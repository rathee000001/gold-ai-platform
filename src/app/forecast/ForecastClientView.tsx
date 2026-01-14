/**
 * ============================================================================================================================================================
 * MODULE: FORECAST DASHBOARD (CLIENT VIEW v2.0)
 * ============================================================================================================================================================
 * * UPDATES:
 * - Specific Date Range Labels (May 2025 - May 2026).
 * - "Proxy Input" explanation updated to "May 31, 2024 - May 31, 2025".
 * * ------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { ForecastRow, ForecastMetadata } from "@/lib/forecastEngine";

interface Props {
  forecastData: ForecastRow[];
  meta: ForecastMetadata;
  topCoeffs: { name: string; value: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload as ForecastRow;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md p-5 rounded-xl border border-slate-700 shadow-2xl text-white min-w-[300px] z-50">
        <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-2">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
           <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide bg-blue-600/20 text-blue-300 border border-blue-600/30">FUTURE</span>
        </div>
        <div className="flex justify-between items-end mb-4">
          <div><span className="block text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Projected Price</span><span className="text-[18px] font-mono font-bold text-orange-400 drop-shadow-sm">${d.predictedPrice.toFixed(2)}</span></div>
        </div>
        <div className="bg-slate-800/50 p-2 rounded mb-3 border border-slate-700">
          <p className="text-[9px] text-slate-400 leading-tight">
            <span className="text-blue-400 font-bold">SOURCE:</span> Macro data from <span className="text-white font-mono">{d.proxyDate}</span> (T-12 Mo).
          </p>
        </div>
        <div className="pt-2 border-t border-slate-700">
          <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-2 block flex items-center gap-1"><span>⚡</span>Drivers (from {d.proxyDate})</span>
          <div className="space-y-1.5">
            {d.drivers.slice(0, 3).map((drv, i) => (
              <div key={i} className="flex justify-between text-[11px] items-center group">
                <span className="text-slate-300 truncate w-32 group-hover:text-white transition-colors">{drv.name}</span>
                <span className={`font-mono ${drv.impact > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{drv.impact > 0 ? '+' : ''}{drv.impact.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function ForecastClientView({ forecastData, meta, topCoeffs }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const { minPrice, maxPrice } = useMemo(() => {
    if (!forecastData || forecastData.length === 0) return { minPrice: 0, maxPrice: 3000 };
    const prices = forecastData.map(d => d.predictedPrice);
    prices.push(meta.lastActualPrice);
    return { minPrice: Math.min(...prices) * 0.95, maxPrice: Math.max(...prices) * 1.05 };
  }, [forecastData, meta.lastActualPrice]);

  if (!isMounted) return <div className="h-[600px] w-full bg-slate-50 animate-pulse rounded-3xl border border-slate-200" />;

  return (
    <div className="space-y-12 animate-fade-in-up pb-32">
      
      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass-panel p-6 bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Baseline (May 31, 2025)</span>
            <span className="text-[32px] font-black text-slate-700 tracking-tighter tabular-nums">${meta.lastActualPrice.toFixed(2)}</span>
         </div>
         <div className="glass-panel p-6 bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Training Fit (2006-2020)</span>
             <span className="text-[32px] font-black text-emerald-600 tracking-tighter tabular-nums">{(meta.trainingR2 * 100).toFixed(1)}%</span>
         </div>
         <div className="glass-panel p-6 bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Forecast Horizon</span>
             <span className="text-[32px] font-black text-blue-600 tracking-tighter tabular-nums">May '25 - May '26</span>
         </div>
      </div>

      {/* CHART */}
      <div className="glass-panel bg-white p-8 h-[600px] relative shadow-lg rounded-[2.5rem] border border-slate-200 overflow-hidden ring-1 ring-slate-100">
        <div className="absolute top-8 left-8 right-8 z-10 flex justify-between pointer-events-none">
           <h3 className="text-[14px] font-black uppercase tracking-widest text-slate-500">Price Projection (May 2025 - May 2026)</h3>
           <div className="flex gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-100">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm animate-pulse"></div><span className="text-[10px] font-bold text-slate-600">FORECAST MODEL</span></div>
           </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecastData} margin={{ top: 80, right: 40, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} minTickGap={40}/>
            <YAxis domain={[minPrice, maxPrice]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontFamily: 'monospace'}} tickFormatter={(val) => `$${val.toFixed(0)}`} width={50}/>
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="predictedPrice" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: '#f97316', strokeWidth: 2 }} activeDot={{ r: 7, strokeWidth: 0, fill: '#f97316' }} animationDuration={2000} strokeDasharray="8 4" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* CARD 2: DEEP-DIVE EXECUTIVE ANALYSIS */}
         <div className="bg-amber-50 border-l-4 border-amber-500 p-8 rounded-r-xl shadow-md">
            <h3 className="text-[14px] font-black uppercase tracking-widest text-amber-900 mb-6 flex items-center gap-3">
              <span className="text-2xl">⚠️</span> 
              <span>Structural Break Analysis: Why the Model May Underestimate</span>
            </h3>
            
            <p className="text-[13px] text-amber-900 font-medium mb-8 leading-relaxed max-w-4xl">
               This forecast applies a <strong className="text-amber-700">2006-2020 Logic Engine</strong> to 2024-2025 market data. 
               While mathematically rigorous, it operates under the assumption that historical correlations remain static. 
               We observe two critical "Regime Shifts" where the market structure has fundamentally changed, creating a divergence risk:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               {/* Insight 1: Central Banks */}
               <div className="bg-white/80 p-6 rounded-xl border border-amber-200/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs ring-4 ring-amber-50/50">1</div>
                     <h4 className="text-[12px] font-black text-amber-900 uppercase tracking-wide">The "Sovereign Floor" Thesis</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                     <strong>The Mechanism:</strong> From 2006-2020, Gold flows were dominated by ETFs and speculative futures (price sensitive). Since 2022, Global Central Banks (notably PBoC, Poland, Singapore) have become the dominant buyers.
                  </p>
                  <div className="bg-amber-50/50 p-3 rounded border border-amber-100">
                     <p className="text-[10px] text-amber-800 font-bold leading-tight">
                        Impact on Forecast: <span className="font-normal text-slate-600">Sovereign buyers are "Strategic," not "Tactical." They buy regardless of high prices to de-dollarize reserves. This creates a non-economic price floor that our model—trained on price-sensitive ETF data—cannot see, likely leading to bearish errors.</span>
                     </p>
                  </div>
               </div>

               {/* Insight 2: Yield Decoupling */}
               <div className="bg-white/80 p-6 rounded-xl border border-amber-200/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs ring-4 ring-amber-50/50">2</div>
                     <h4 className="text-[12px] font-black text-amber-900 uppercase tracking-wide">Breakdown of "Opportunity Cost"</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                     <strong>The Mechanism:</strong> The model assumes a strong negative correlation (-0.85) between Real Yields and Gold. Historically, when bonds pay 2%+, zero-yield Gold is sold.
                  </p>
                  <div className="bg-amber-50/50 p-3 rounded border border-amber-100">
                     <p className="text-[10px] text-amber-800 font-bold leading-tight">
                        Impact on Forecast: <span className="font-normal text-slate-600">In 2023-2024, Gold hit ATHs despite 20-year high yields. The market is now pricing Gold as a hedge against <em>Fiscal Dominance</em> (US Debt Levels) rather than just interest rates. The model will heavily penalize Gold for high yields, potentially predicting a crash that won't happen.</span>
                     </p>
                  </div>
               </div>

            </div>
         </div>
      
      {/* DATA TABLE */}
      <div className="glass-panel p-0 overflow-hidden bg-white border border-slate-200 shadow-lg rounded-2xl">
         <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center"><h3 className="text-[12px] font-black uppercase tracking-widest text-slate-800">Projected Data Points (2025-2026)</h3></div>
         <div className="overflow-auto h-[400px] scrollbar-thin scrollbar-thumb-slate-200">
           <table className="w-full text-left min-w-[800px] relative border-collapse">
              <thead className="bg-white text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 sticky top-0 z-20 shadow-sm ring-1 ring-slate-100">
                 <tr><th className="px-6 py-4 bg-slate-50 border-b border-slate-100">Future Date</th><th className="px-6 py-4 bg-slate-50 border-b border-slate-100">Proxy Input Date (T-12)</th><th className="px-6 py-4 bg-slate-50 border-b border-slate-100 text-right">Predicted Price</th><th className="px-6 py-4 bg-slate-50 border-b border-slate-100">Primary Driver</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-[12px] font-mono text-slate-600">
                 {forecastData.map((row, idx) => (
                   <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-3 font-bold text-slate-800">{row.date}</td><td className="px-6 py-3 text-slate-500">{row.proxyDate}</td><td className="px-6 py-3 text-right tabular-nums text-orange-600 font-bold text-[14px]">${row.predictedPrice.toFixed(2)}</td>
                      <td className="px-6 py-3"><div className="flex items-center gap-2"><span className="text-[10px] uppercase font-bold text-slate-400">{row.drivers[0].name}</span><span className={`text-[10px] font-mono ${row.drivers[0].impact > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{row.drivers[0].impact > 0 ? '↑' : '↓'} ${Math.abs(row.drivers[0].impact).toFixed(0)}</span></div></td>
                   </tr>
                 ))}
              </tbody>
           </table>
         </div>
      </div>
    </div>
  );
}