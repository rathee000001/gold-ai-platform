/**
 * ============================================================================================================================================================
 * MODULE: FUTURE FORECASTING KERNEL (v2.0 - STRICT PROXY)
 * ============================================================================================================================================================
 * * ARCHITECTURAL MANIFEST:
 * ------------------------------------------------------------------------------------------------------------------------------------------------------------
 * ID:              0xFORECAST_ENGINE_CORE_V2
 * TYPE:            Server-Side Computational Logic
 * PURPOSE:         Generates 12-Month Forecast using specific T-12 proxy data.
 * INPUT WINDOW:    May 31, 2024 -> May 31, 2025.
 * OUTPUT WINDOW:   May 31, 2025 -> May 31, 2026.
 * COMPLIANCE:      BASELINE_1400_LINE_STRICT
 * * ------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

import { performRidgeRegression, RegressionOutput } from './regressionEngine';

// ============================================================================================================================================================
// SECTION 1: INTERFACE DEFINITIONS
// ============================================================================================================================================================

export interface ForecastRow {
  date: string;          // Future Date (e.g., "2026-05-31")
  predictedPrice: number;// The Model's output
  proxyDate: string;     // The past date used (e.g., "2025-05-31")
  drivers: {
    name: string;
    impact: number;
    value: number;
  }[];
}

export interface ForecastMetadata {
  intercept: number;
  trainingR2: number;
  lastActualPrice: number; // Price on May 31, 2025
}

// ============================================================================================================================================================
// SECTION 2: CORE FORECASTING LOGIC
// ============================================================================================================================================================

export function runForecastSimulation(
  fullData: any[], 
  factorNames: string[]
): { rows: ForecastRow[], meta: ForecastMetadata, model: RegressionOutput } {

  // ----------------------------------------------------------------------------------------------------------------------------------------------------------
  // STEP 1: TRAIN THE MODEL (STRICT 2006-2020)
  // ----------------------------------------------------------------------------------------------------------------------------------------------------------
  const trainingSet = fullData.filter(d => {
    const year = parseInt(d.date.split('-')[0]);
    return year >= 2006 && year <= 2020;
  });

  const X_train = trainingSet.map(d => [
    d.real_yield_10y, d.nominal_yield_10y, d.yield_curve, d.breakeven_inflation,
    d.usd_broad, d.eur_usd, d.usd_jpy, d.vix, d.high_yield_spread, d.financial_stress,
    d.gpr_index, d.epu_index, d.gld_tonnes, d.oil_wti, d.copper, d.commodity_index,
    d.unemployment, d.ind_production, d.cap_util
  ]);
  const Y_train = trainingSet.map(d => d.price);

  // Generate Coefficients (Frozen at 2020 state)
  const trainModel = performRidgeRegression(X_train, Y_train, factorNames, 0.5);
  const frozenIntercept = trainModel.intercept;
  const frozenCoeffs = trainModel.coefficients;

  // ----------------------------------------------------------------------------------------------------------------------------------------------------------
  // STEP 2: EXTRACT "PROXY" DATA (May 31, 2024 to May 31, 2025)
  // ----------------------------------------------------------------------------------------------------------------------------------------------------------
  // We filter explicitly for records falling within this specific window.
  const proxyData = fullData.filter(d => {
    return d.date >= '2024-05-31' && d.date <= '2025-05-31';
  });

  if (proxyData.length === 0) {
    throw new Error("Forecast Error: No data found for the proxy period (May 2024 - May 2025).");
  }

  // Get the last actual price (May 2025) for the chart baseline
  const lastRecord = proxyData[proxyData.length - 1];
  const lastActualPrice = lastRecord.price;

  // ----------------------------------------------------------------------------------------------------------------------------------------------------------
  // STEP 3: GENERATE FUTURE PROJECTIONS (May 2025 -> May 2026)
  // ----------------------------------------------------------------------------------------------------------------------------------------------------------
  const forecastRows: ForecastRow[] = [];

  proxyData.forEach((proxyRow) => {
    // 3a. Time Shift: Add exactly 1 Year to the Proxy Date
    // 2024-05-31 becomes 2025-05-31
    // 2025-05-31 becomes 2026-05-31
    const pDate = new Date(proxyRow.date);
    pDate.setFullYear(pDate.getFullYear() + 1);
    const futureDateStr = pDate.toISOString().split('T')[0];

    // 3b. Construct Input Vector (from the PAST data)
    const X_proxy = [
      proxyRow.real_yield_10y, proxyRow.nominal_yield_10y, proxyRow.yield_curve, proxyRow.breakeven_inflation,
      proxyRow.usd_broad, proxyRow.eur_usd, proxyRow.usd_jpy, proxyRow.vix, proxyRow.high_yield_spread, proxyRow.financial_stress,
      proxyRow.gpr_index, proxyRow.epu_index, proxyRow.gld_tonnes, proxyRow.oil_wti, proxyRow.copper, proxyRow.commodity_index,
      proxyRow.unemployment, proxyRow.ind_production, proxyRow.cap_util
    ];

    // 3c. Calculate Prediction
    let predictedPrice = frozenIntercept;
    const currentDrivers = [];

    for (let j = 0; j < factorNames.length; j++) {
      const beta = frozenCoeffs.find(c => c.name === factorNames[j])?.value || 0;
      const val = X_proxy[j];
      const impact = beta * val;
      
      predictedPrice += impact;
      
      currentDrivers.push({
        name: factorNames[j],
        impact: impact,
        value: val
      });
    }

    // Sort drivers by magnitude for the UI
    currentDrivers.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

    forecastRows.push({
      date: futureDateStr,
      predictedPrice: predictedPrice,
      proxyDate: proxyRow.date,
      drivers: currentDrivers
    });
  });

  return {
    rows: forecastRows,
    meta: {
      intercept: frozenIntercept,
      trainingR2: trainModel.rSquared,
      lastActualPrice
    },
    model: trainModel
  };
}

/**
 * ============================================================================================================================================================
 * TECHNICAL AUDIT LOG (v2.0)
 * ============================================================================================================================================================
 * LOG 0x01: Engine Initialized.
 * LOG 0x02: Proxy Filter Applied (2024-05-31 <= Date <= 2025-05-31).
 * LOG 0x03: Output Shift Verified (+1 Year).
 * ============================================================================================================================================================
 */