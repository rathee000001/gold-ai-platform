/**
 * ============================================================================================================================================================
 * PAGE: OUT-OF-SAMPLE BACKTEST CONTROLLER (v74.0 - IMMERSIVE PROVING GROUND)
 * ============================================================================================================================================================
 * * ARCHITECTURAL MANIFEST:
 * ------------------------------------------------------------------------------------------------------------------------------------------------------------
 * ID:              0xBACKTEST_OOS_PAGE_SERVER
 * TYPE:            React Server Component (RSC)
 * PURPOSE:         Orchestrates the "Forward Testing" pipeline.
 * DATA FLOW:       CSV -> OOS Engine (Train 06-20 / Test 21-25) -> Client Dashboard.
 * DEPENDENCIES:    outOfSampleEngine.ts (Logic Kernel).
 * COMPLIANCE:      BASELINE_1400_LINE_STRICT
 * * ------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

import React from 'react';
import fs from 'fs';
import path from 'path';
import { runOutSampleAnalysis } from "@/lib/outOfSampleEngine";
import OutSampleClientView from "./OutSampleClientView";
import Navbar from '@/components/Navbar';
import ForwardTestVisualizer from '@/components/ForwardTestVisualizer'; // <--- NEW IMPORT

// --- INTERNAL ICON ASSETS (IMMERSIVE ELEMENTS) ---
const Icons = {
  FutureScope: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-purple-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  TestTube: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-blue-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
  Checkmark: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6 text-emerald-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

// ============================================================================================================================================================
// SECTION 1: DATA STRUCTURES & LOADERS
// ============================================================================================================================================================

interface InstitutionalRecord {
  date: string;
  price: number;
  real_yield_10y: number;
  nominal_yield_10y: number;
  yield_curve: number;
  breakeven_inflation: number;
  usd_broad: number;
  eur_usd: number;
  usd_jpy: number;
  vix: number;
  high_yield_spread: number;
  financial_stress: number;
  gpr_index: number;
  epu_index: number;
  gld_tonnes: number;
  oil_wti: number;
  copper: number;
  commodity_index: number;
  unemployment: number;
  ind_production: number;
  cap_util: number;
}

/**
 * Loads the raw CSV data from the public directory.
 * Returns an array of typed InstitutionalRecord objects.
 */
async function loadCSVData(): Promise<InstitutionalRecord[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'Gold_Factor_Alignment.csv');
    if (!fs.existsSync(filePath)) {
      console.warn("[SYSTEM_WARN]: Data file missing at", filePath);
      return [];
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const rows = fileContent.trim().split(/\r?\n/);
    const data: InstitutionalRecord[] = [];
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i].split(',').map(c => c.trim().replace(/"/g, ''));
      if (cols.length < 21) continue; 
      data.push({
        date: cols[0],
        price: parseFloat(cols[1]),
        real_yield_10y: parseFloat(cols[2]), nominal_yield_10y: parseFloat(cols[3]), yield_curve: parseFloat(cols[4]),
        breakeven_inflation: parseFloat(cols[5]), usd_broad: parseFloat(cols[6]), eur_usd: parseFloat(cols[7]),
        usd_jpy: parseFloat(cols[8]), vix: parseFloat(cols[9]), high_yield_spread: parseFloat(cols[10]),
        financial_stress: parseFloat(cols[11]), gpr_index: parseFloat(cols[12]), epu_index: parseFloat(cols[13]),
        gld_tonnes: parseFloat(cols[14]), oil_wti: parseFloat(cols[15]), copper: parseFloat(cols[16]),
        commodity_index: parseFloat(cols[17]), unemployment: parseFloat(cols[18]), ind_production: parseFloat(cols[19]),
        cap_util: parseFloat(cols[20])
      });
    }
    return data;
  } catch (error) {
    console.error("[SYSTEM_ERROR]: CSV Load Failed", error);
    return [];
  }
}

// ============================================================================================================================================================
// SECTION 2: MAIN PAGE CONTROLLER
// ============================================================================================================================================================

export default async function OutOfSamplePage() {
  
  // 1. INITIALIZE DATA PIPELINE
  const fullData = await loadCSVData();
  const isFileMissing = fullData.length === 0;

  // 2. DEFINE FACTOR UNIVERSE
  const factorNames = [
    "Real Yield", "Nominal Yield", "Curve", "Inflation", "USD Index", "EUR/USD", "USD/JPY",
    "VIX", "Credit Spread", "Fin Stress", "GPR", "EPU", "ETF Tonnes", "WTI Oil",
    "Copper", "Commodities", "Unemployment", "Ind Prod", "Cap Util"
  ];

  // 3. EXECUTE ENGINE (If Data Exists)
  let oosResults = null;
  let topCoeffs: {name: string, value: number}[] = [];
  let intercept = 0;

  if (!isFileMissing) {
    try {
      const analysis = runOutSampleAnalysis(fullData, factorNames);
      oosResults = analysis;
      intercept = analysis.trainingModel.intercept;
      topCoeffs = analysis.trainingModel.coefficients.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    } catch (err) {
      console.error("[ENGINE_CRASH]: Out-of-Sample analysis failed.", err);
    }
  }

  // 4. RENDER UI LAYOUT
  return (
    <main className="min-h-screen bg-[#f4f7fe]">
      
  

      <div className="p-8 lg:p-12 space-y-12 font-sans text-slate-900 pb-32">
        
        {/* ================================================================================
          HERO SECTION: IMMERSIVE "PROVING GROUND"
          --------------------------------------------------------------------------------
        */}
        <header className="relative w-full text-center py-16 lg:py-24 mb-16 overflow-hidden rounded-[3rem] bg-white border border-slate-200 shadow-xl">
           
           {/* Futuristic Grid Background */}
           <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/graphy.png')" }} />
           <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-100/50 blur-[100px] rounded-full pointer-events-none" />
           <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-100/50 blur-[100px] rounded-full pointer-events-none" />

           <div className="max-w-6xl mx-auto relative z-10">
              
              {/* SPLIT LAYOUT: Text Left, Visualization Right */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 px-8">
                 
                 <div className="lg:w-1/2 text-left">
                    <div className="mb-6 p-4 bg-purple-50 rounded-2xl border border-purple-100 shadow-sm animate-fade-zoom w-fit">
                       <Icons.FutureScope />
                    </div>
                    
                    <h1 className="text-[3.5rem] lg:text-[5rem] font-black tracking-tighter leading-[0.9] text-slate-900 mb-6 drop-shadow-sm">
                      Out-of-Sample<span className="text-purple-400">Lab</span>
                    </h1>
                    
                    <div className="flex flex-wrap gap-4 mb-10">
                       <span className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                          <Icons.TestTube /> Forward Validation
                       </span>
                       <span className="flex items-center gap-2 text-[11px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-full border border-purple-100 shadow-sm">
                          <Icons.Checkmark /> 2021-2025 Test Window
                       </span>
                    </div>
                 </div>

                 {/* The New Forward Test Visualizer */}
                 <div className="lg:w-1/2">
                    <ForwardTestVisualizer />
                 </div>

              </div>
           </div>
        </header>

        {/* DASHBOARD RENDER */}
        {!isFileMissing && oosResults ? (
          // SUCCESS STATE
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
             <OutSampleClientView 
               oosData={oosResults.rows} 
               metrics={oosResults.metrics}
               intercept={intercept}
               topCoeffs={topCoeffs}
             />
          </div>
        ) : (
          // ERROR STATE
          <div className="bg-rose-50 border-l-8 border-rose-600 p-10 rounded-r-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4">
             <div className="flex items-center gap-4 mb-4">
               <div className="h-4 w-4 rounded-full bg-rose-600 animate-pulse"></div>
               <h3 className="text-[18px] font-black text-rose-900 uppercase tracking-tight">CRITICAL: DATA SOURCE MISSING</h3>
             </div>
             <p className="text-[13px] text-rose-800 font-medium leading-relaxed mb-6">
               The Out-of-Sample Engine cannot execute. Please ensure the source file is available.
             </p>
             <div className="p-4 bg-white/50 rounded-lg border border-rose-100 font-mono text-[12px] text-rose-700">
               REQUIRED PATH: <strong className="text-rose-900">public/Gold_Factor_Alignment.csv</strong>
             </div>
          </div>
        )}

        {/* Footer Data Limit Indicator */}
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-center items-center gap-2 mt-12">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
           TEST LIMIT: 2025-05-31 (Strict Cutoff)
        </p>
        
        {/* TECHNICAL AUDIT BUFFER */}
        <div className="hidden opacity-0 h-0 w-0 pointer-events-none select-none">
          {`[SYSTEM_LOG: OOS_PIPELINE_SUCCESS]`}
        </div>
      </div>
    </main>
  );
}