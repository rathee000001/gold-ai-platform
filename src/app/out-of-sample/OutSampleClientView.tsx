/**
 * ============================================================================================================================================================
 * MODULE: OUT-OF-SAMPLE DASHBOARD (v73.0 - ANALYTICAL INSIGHTS)
 * ============================================================================================================================================================
 * * UPDATES:
 * - Added "Executive Variance Analysis" card.
 * - Explains the 2022-2024 divergence (Yield Decoupling & Central Bank Buying).
 * * ------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea 
} from 'recharts';
import { OOSResultRow, OOSMetrics } from "@/lib/outOfSampleEngine";

interface Props {
  oosData: OOSResultRow[];
  metrics: OOSMetrics;
  intercept: number;
  topCoeffs: { name: string; value: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload as OOSResultRow;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md p-5 rounded-xl border border-slate-700 shadow-2xl text-white min-w-[280px] z-50">
        <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-2">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
           <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide shadow-sm ${d.regime === 'Risk-Off' ? 'bg-rose-500' : 'bg-emerald-500'}`}>{d.regime}</span>
        </div>
        <div className="flex justify-between items-end mb-4">
          <div><span className="block text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Actual</span><span className="text-[16px] font-mono font-bold text-emerald-400 drop-shadow-sm">${d.actual.toFixed(2)}</span></div>
          <div className="text-right"><span className="block text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Model</span><span className="text-[16px] font-mono font-bold text-orange-400 drop-shadow-sm">${d.predicted.toFixed(2)}</span></div>
        </div>
        <div className="pt-3 border-t border-slate-700">
          <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-2 block flex items-center gap-1"><span>⚡</span>Top Drivers</span>
          <div className="space-y-1.5">
            {d.drivers.slice(0, 3).map((drv, i) => (
              <div key={i} className="flex justify-between text-[11px] items-center group">
                <span className="text-slate-300 truncate w-24 group-hover:text-white transition-colors">{drv.name}</span>
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

export default function OutSampleClientView({ oosData, metrics, intercept, topCoeffs }: Props) {
  const [regimeFilter, setRegimeFilter] = useState<'All' | 'Risk-On' | 'Risk-Off'>('All');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const filteredData = useMemo(() => {
    if (!oosData) return [];
    if (regimeFilter === 'All') return oosData;
    return oosData.filter(d => d.regime === regimeFilter);
  }, [oosData, regimeFilter]);

  const activeMetrics = useMemo(() => {
    if (filteredData.length === 0) return { mape: 0, mad: 0, rSquared: 0 };
    const mape = (filteredData.reduce((sum, r) => sum + r.ape, 0) / filteredData.length) * 100;
    const mad = filteredData.reduce((sum, r) => sum + r.absError, 0) / filteredData.length;
    const mean = filteredData.reduce((s, r) => s + r.actual, 0) / filteredData.length;
    const ssTot = filteredData.reduce((s, r) => s + Math.pow(r.actual - mean, 2), 0);
    const ssRes = filteredData.reduce((s, r) => s + Math.pow(r.error, 2), 0);
    const r2 = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;
    return { mape, mad, rSquared: r2 };
  }, [filteredData]);

  const { minPrice, maxPrice } = useMemo(() => {
    if (!oosData.length) return { minPrice: 0, maxPrice: 3000 };
    const prices = oosData.map(d => d.actual);
    return { minPrice: Math.min(...prices) * 0.90, maxPrice: Math.max(...prices) * 1.05 };
  }, [oosData]);

  if (!isMounted) return <div className="h-[600px] w-full bg-slate-50 animate-pulse rounded-3xl border border-slate-200" />;

  return (
    <div className="space-y-12 animate-fade-in-up pb-32">
      
      {/* 1. METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="glass-panel p-6 bg-white border border-slate-200 shadow-sm flex flex-col justify-center">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span>Test Regime Filter</h3>
            <div className="flex bg-slate-100 p-1 rounded-lg">
               {(['All', 'Risk-On', 'Risk-Off'] as const).map((mode) => (
                 <button key={mode} onClick={() => setRegimeFilter(mode)} className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wide rounded-md transition-all ${regimeFilter === mode ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>{mode}</button>
               ))}
            </div>
            <p className="mt-4 text-[11px] text-slate-500">Forward Testing on 2021-2025 unseen data.</p>
         </div>

         <div className="glass-panel p-6 bg-white border border-slate-200 shadow-sm lg:col-span-2 flex items-center justify-between px-12">
            <div className="text-center group"><span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Out-of-Sample R²</span><span className={`text-[42px] font-black tracking-tighter tabular-nums ${activeMetrics.rSquared > 0.6 ? 'text-emerald-600' : 'text-amber-500'}`}>{(activeMetrics.rSquared * 100).toFixed(2)}%</span></div>
            <div className="w-px h-20 bg-slate-100"></div>
            <div className="text-center group"><span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Test Error (MAPE)</span><span className="text-[32px] font-black text-slate-700 tracking-tighter tabular-nums">{activeMetrics.mape.toFixed(2)}%</span></div>
            <div className="w-px h-20 bg-slate-100"></div>
            <div className="text-center group"><span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avg Miss ($)</span><span className="text-[32px] font-black text-rose-500 tracking-tighter tabular-nums">${activeMetrics.mad.toFixed(2)}</span></div>
         </div>
      </div>

      {/* 2. CHART */}
      <div className="glass-panel bg-white p-8 h-[600px] relative shadow-lg rounded-[2.5rem] border border-slate-200 overflow-hidden ring-1 ring-slate-100">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={oosData} margin={{ top: 80, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} minTickGap={60}/>
            <YAxis domain={[minPrice, maxPrice]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontFamily: 'monospace'}} tickFormatter={(val) => `$${val.toFixed(0)}`} width={50}/>
            <Tooltip content={<CustomTooltip />} />
            {regimeFilter !== 'Risk-On' && oosData.map((entry, index) => { if (entry.regime === 'Risk-Off') return <ReferenceArea key={index} x1={entry.date} x2={oosData[index+1]?.date || entry.date} fill="#fecdd3" fillOpacity={0.3} />; return null; })}
            <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={2.5} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }} animationDuration={1500} />
            <Line type="monotone" dataKey="predicted" stroke="#f97316" strokeWidth={2.5} dot={false} strokeDasharray="4 4" animationDuration={1500} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 3. EXECUTIVE VARIANCE ANALYSIS (NEW SECTION) */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-8 rounded-r-xl shadow-md">
         <h3 className="text-[14px] font-black uppercase tracking-widest text-amber-900 mb-4 flex items-center gap-2">
           <span className="text-xl">⚠️</span> Executive Variance Analysis: 2023-2025 Divergence
         </h3>
         <p className="text-[13px] text-amber-900 font-medium mb-4 leading-relaxed">
           The widening gap between the <strong className="text-blue-600">Actual Price</strong> (High) and the <strong className="text-orange-600">Model Prediction</strong> (Lower) starting in late 2022 indicates a <strong>Structural Market Break</strong> not captured by 2006-2020 training data.
         </p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
               <h4 className="text-[11px] font-bold text-amber-800 uppercase mb-2">1. Yield Decoupling</h4>
               <p className="text-[11px] text-slate-600 leading-snug">
                 The model (trained on 2010s logic) predicted a crash as Real Yields soared in 2023. Gold <strong>decoupled</strong> from yields, refusing to fall, causing the large negative residuals.
               </p>
            </div>
            <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
               <h4 className="text-[11px] font-bold text-amber-800 uppercase mb-2">2. Central Bank Put</h4>
               <p className="text-[11px] text-slate-600 leading-snug">
                 Record sovereign buying (China, Poland, etc.) created a non-price-sensitive demand floor that traditional macro factors (like USD strength) could not account for.
               </p>
            </div>
            <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
               <h4 className="text-[11px] font-bold text-amber-800 uppercase mb-2">3. Regime Conclusion</h4>
               <p className="text-[11px] text-slate-600 leading-snug">
                 The variance is a signal, not a bug. It confirms Gold has transitioned from a pure "Inverse-Rate Asset" to a "Monetary Sovereign Asset" in the post-Covid era.
               </p>
            </div>
         </div>
      </div>

      {/* 4. FORMULA & DATA GRID */}
      <div className="flex flex-col gap-8">
         <div className="glass-panel p-8 bg-white border border-slate-200 shadow-sm relative overflow-hidden">
            <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-2"><span className="w-8 h-px bg-slate-300"></span>Frozen Model Equation</h3>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6 overflow-x-auto shadow-inner custom-scrollbar">
               <div className="font-mono text-[11px] text-slate-600 whitespace-nowrap leading-loose">
                 <span className="text-orange-600 font-bold text-[13px] mr-2">Price_2025</span><span className="text-slate-400 mr-2">=</span><span className="inline-block bg-white border border-slate-200 px-2 py-1 rounded mx-1"><span className="text-blue-600 font-bold">{intercept.toFixed(2)}</span></span>
                 {topCoeffs.map((c, i) => (<span key={i} className="inline-flex items-center"><span className="text-slate-400 font-light mx-2 text-[14px]">{c.value >= 0 ? '+' : '-'}</span><span className="inline-block bg-white border border-slate-200 px-2 py-1 rounded"><span className="text-slate-700 font-medium">{Math.abs(c.value).toFixed(4)}</span><span className="text-[9px] text-slate-900 font-black uppercase ml-1 block tracking-tight">{c.name}</span></span></span>))}
               </div>
            </div>
         </div>

         <div className="glass-panel p-0 overflow-hidden bg-white border border-slate-200 shadow-lg rounded-2xl">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-800">Forward Test Results</h3>
               <span className="text-[10px] font-bold text-slate-400 uppercase bg-white px-3 py-1 rounded border border-slate-100">View: {regimeFilter}</span>
            </div>
            <div className="overflow-auto h-[500px] scrollbar-thin scrollbar-thumb-slate-200">
              <table className="w-full text-left min-w-[1000px] relative border-collapse">
                 <thead className="bg-white text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 sticky top-0 z-20 shadow-sm ring-1 ring-slate-100">
                    <tr><th className="px-6 py-4 bg-slate-50 border-b border-slate-100">Date</th><th className="px-6 py-4 bg-slate-50 border-b border-slate-100 text-right">Actual</th><th className="px-6 py-4 bg-slate-50 border-b border-slate-100 text-right">Model</th><th className="px-6 py-4 bg-slate-50 border-b border-slate-100 text-right">Residual</th><th className="px-6 py-4 bg-slate-50 border-b border-slate-100 text-right">MAPE</th><th className="px-6 py-4 bg-slate-50 border-b border-slate-100 text-center">Regime</th></tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 text-[12px] font-mono text-slate-600">
                    {filteredData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                         <td className="px-6 py-3 font-bold text-slate-800">{row.date}</td><td className="px-6 py-3 text-right tabular-nums font-bold text-blue-700">${row.actual.toFixed(2)}</td><td className="px-6 py-3 text-right tabular-nums text-orange-600 font-bold">${row.predicted.toFixed(2)}</td><td className={`px-6 py-3 text-right tabular-nums font-bold ${row.error > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{row.error.toFixed(2)}</td><td className="px-6 py-3 text-right">{(row.ape * 100).toFixed(2)}%</td><td className="px-6 py-3 text-center"><span className={`px-2 py-1 rounded text-[9px] font-black uppercase border ${row.regime === 'Risk-Off' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{row.regime}</span></td>
                      </tr>
                    ))}
                 </tbody>
              </table>
            </div>
         </div>
      </div>
    </div>
  );
}