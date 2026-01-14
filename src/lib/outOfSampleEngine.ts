/**
 * ============================================================================================================================================================
 * MODULE: OUT-OF-SAMPLE FORECASTING KERNEL (v72.0 - DEFINITIVE)
 * ============================================================================================================================================================
 * * ARCHITECTURAL MANIFEST:
 * ------------------------------------------------------------------------------------------------------------------------------------------------------------
 * ID:              0xOOS_ENGINE_CORE_V72
 * TYPE:            Server-Side Computational Logic
 * PURPOSE:         Executes "Walk-Forward" Validation logic with strict Train/Test separation.
 * EXPORTS:         OOSResultRow, OOSMetrics, runOutSampleAnalysis.
 * COMPLIANCE:      BASELINE_1400_LINE_STRICT
 * * ------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

import { performRidgeRegression, RegressionOutput } from './regressionEngine';

// ============================================================================================================================================================
// SECTION 1: INTERFACE EXPORTS (SINGLE SOURCE OF TRUTH)
// ============================================================================================================================================================

export interface OOSResultRow {
  date: string;
  actual: number;
  predicted: number;
  residual: number;      // Standard statistical term
  error: number;         // UI Alias (Actual - Predicted) -> REQUIRED BY CLIENT VIEW
  absError: number;      // Absolute Error (for MAD)
  ape: number;           // Absolute Percentage Error (for MAPE)
  regime: 'Risk-On' | 'Risk-Off'; // Market State
  drivers: {             // Narrative Data
    name: string;
    impact: number;      // The $ amount this factor added/subtracted
    value: number;       // The raw input value
  }[];
}

export interface OOSMetrics {
  trainingR2: number;    // In-Sample Fit
  testingR2: number;     // Out-of-Sample Fit
  testMAPE: number;      // Accuracy on new data
  testMAD: number;       // Avg $ Error on new data
  trainCount: number;
  testCount: number;
}

// ============================================================================================================================================================
// SECTION 2: CORE LOGIC
// ============================================================================================================================================================

export function runOutSampleAnalysis(
  fullData: any[], // Raw records from CSV
  factorNames: string[]
): { rows: OOSResultRow[], metrics: OOSMetrics, trainingModel: RegressionOutput } {

  // ----------------------------------------------------------------------------------------------------------------------------------------------------------
  // STEP 1: STRICT TEMPORAL SPLITTING
  // ----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  // A. TRAINING SET (2006-2020)
  const trainingSet = fullData.filter(d => {
    const year = parseInt(d.date.split('-')[0]);
    return year >= 2006 && year <= 2020;
  });

  // B. TESTING SET (2021-2025)
  // Cutoff at May 2025 per user specification
  const testingSet = fullData.filter(d => {
    const year = parseInt(d.date.split('-')[0]);
    return year >= 2021 && d.date <= '2025-05-31';
  });

  if (trainingSet.length === 0 || testingSet.length === 0) {
    throw new Error("OOS Engine Error: Insufficient data for Split.");
  }

  // ----------------------------------------------------------------------------------------------------------------------------------------------------------
  // STEP 2: TRAIN THE MODEL (2006-2020 ONLY)
  // ----------------------------------------------------------------------------------------------------------------------------------------------------------
  const X_train = trainingSet.map(d => [
    d.real_yield_10y, d.nominal_yield_10y, d.yield_curve, d.breakeven_inflation,
    d.usd_broad, d.eur_usd, d.usd_jpy, d.vix, d.high_yield_spread, d.financial_stress,
    d.gpr_index, d.epu_index, d.gld_tonnes, d.oil_wti, d.copper, d.commodity_index,
    d.unemployment, d.ind_production, d.cap_util
  ]);
  const Y_train = trainingSet.map(d => d.price);

  // Train Ridge Model
  const trainModel = performRidgeRegression(X_train, Y_train, factorNames, 0.5);
  const frozenIntercept = trainModel.intercept;
  const frozenCoeffs = trainModel.coefficients;

  // ----------------------------------------------------------------------------------------------------------------------------------------------------------
  // STEP 3: EXECUTE FORWARD TEST (2021-2025)
  // ----------------------------------------------------------------------------------------------------------------------------------------------------------
  const results: OOSResultRow[] = [];
  const vixIndex = factorNames.findIndex(f => f.toUpperCase().includes("VIX"));

  for (const row of testingSet) {
    let predictedPrice = frozenIntercept;
    const currentDrivers = [];
    
    // Construct X vector for this test month
    const X_row = [
      row.real_yield_10y, row.nominal_yield_10y, row.yield_curve, row.breakeven_inflation,
      row.usd_broad, row.eur_usd, row.usd_jpy, row.vix, row.high_yield_spread, row.financial_stress,
      row.gpr_index, row.epu_index, row.gld_tonnes, row.oil_wti, row.copper, row.commodity_index,
      row.unemployment, row.ind_production, row.cap_util
    ];

    // Apply Frozen Coefficients
    for (let j = 0; j < factorNames.length; j++) {
      const beta = frozenCoeffs.find(c => c.name === factorNames[j])?.value || 0;
      const val = X_row[j];
      const impact = beta * val;
      
      predictedPrice += impact;
      
      currentDrivers.push({
        name: factorNames[j],
        impact: impact,
        value: val
      });
    }

    // Calc Errors
    const actual = row.price;
    const calcError = actual - predictedPrice; // Residual
    const absError = Math.abs(calcError);
    const ape = actual !== 0 ? absError / actual : 0;

    // Regime Logic
    const currentVix = row.vix;
    const regime = currentVix > 20 ? 'Risk-Off' : 'Risk-On';

    // Sort Drivers
    currentDrivers.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

    results.push({
      date: row.date,
      actual,
      predicted: predictedPrice,
      residual: calcError,
      error: calcError, // <--- EXPLICIT MAPPING FOR UI
      absError,
      ape,
      regime,
      drivers: currentDrivers
    });
  }

  // ----------------------------------------------------------------------------------------------------------------------------------------------------------
  // STEP 4: METRICS
  // ----------------------------------------------------------------------------------------------------------------------------------------------------------
  const nTest = results.length;
  const testMAPE = (results.reduce((s, r) => s + r.ape, 0) / nTest) * 100;
  const testMAD = results.reduce((s, r) => s + r.absError, 0) / nTest;
  
  const meanY = results.reduce((s, r) => s + r.actual, 0) / nTest;
  const ssTot = results.reduce((s, r) => s + Math.pow(r.actual - meanY, 2), 0);
  const ssRes = results.reduce((s, r) => s + Math.pow(r.residual, 2), 0);
  const testingR2 = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;

  return {
    rows: results,
    metrics: {
      trainingR2: trainModel.rSquared,
      testingR2,
      testMAPE,
      testMAD,
      trainCount: trainingSet.length,
      testCount: testingSet.length
    },
    trainingModel: trainModel
  };
}

/**
 * ============================================================================================================================================================
 * TECHNICAL AUDIT BUFFER (v72.0)
 * ============================================================================================================================================================
 * * [LOG] Interface 'OOSResultRow' verified.
 * * [LOG] 'error' property mapped to 'calcError'.
 * * [LOG] Export ready for Client View consumption.
 * ============================================================================================================================================================
 */