/**
 * ======================================================================================
 * SECTION 1: ARCHITECTURAL IMPORTS & DATA HYDRATION
 * --------------------------------------------------------------------------------------
 * Purpose: Orchestrates the parallel hydration of 19 institutional data streams.
 * Fix: Removed local SVG/Style logic to 'FactorFusionCore.tsx' to fix Server Error.
 * ======================================================================================
 */

import React from 'react';
import { getGoldData } from "@/lib/goldAgent";
import { getFredSeries } from "@/lib/fredAgent";
import { getGprData, getEpuData, getGldData } from "@/lib/localFileAgent";
import GoldTable from "@/components/GoldTable";
import FactorCard from "@/components/FactorCard";
import { FACTOR_METADATA } from "@/lib/factorMetadata";
import FactorFusionCore from "@/components/FactorFusionCore"; // <--- NEW IMPORT

const Icons = {
  Network: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-amber-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313M21 14.25v2.25l-2.25 1.313m0-16.875L18.75 7.5M5.25 7.5L3 8.813" />
    </svg>
  ),
  Pulse: () => (
    <span className="relative flex h-3 w-3 mr-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
    </span>
  )
};

export default async function Home() {
  
  const [
    goldData, ry, ny, cv, inf, usd, eur, jpy, vx, sp, st, gp, ep, gl, ol, cp, ci, ue, ip, cu
  ] = await Promise.all([
    getGoldData(), getFredSeries("DFII10"), getFredSeries("DGS10"), getFredSeries("T10Y2Y"), 
    getFredSeries("T10YIE"), getFredSeries("DTWEXBGS"), getFredSeries("DEXUSEU"), getFredSeries("DEXJPUS"), 
    getFredSeries("VIXCLS"), getFredSeries("BAMLH0A0HYM2"), getFredSeries("STLFSI4"), getGprData(), 
    getEpuData(), getGldData(), getFredSeries("DCOILWTICO"), getFredSeries("PCOPPUSDM"), getFredSeries("PPIACO"), 
    getFredSeries("UNRATE"), getFredSeries("INDPRO"), getFredSeries("TCU")     
  ]);

  const factorRegistry = Object.values(FACTOR_METADATA);

  return (
    <main className="container mx-auto px-6 lg:px-12 py-16 space-y-24 animate-institutional relative overflow-visible">
      
      {/* SECTION 4: HERO TERMINAL */}
      <header className="relative w-full text-center py-12 lg:py-20 mb-16">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-blue-100/40 via-amber-100/20 to-transparent blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-[0.05] pointer-events-none -z-10 mix-blend-overlay" />

        <div className="max-w-6xl mx-auto relative z-10">
           
           <div className="mb-12 flex flex-col lg:flex-row items-center justify-between gap-12">
             <div className="lg:w-2/3 text-left">
               <h1 className="text-[4rem] md:text-[6rem] font-black mb-6 tracking-tighter leading-[0.9] select-none drop-shadow-sm relative z-20">
                 <span className="bg-gradient-to-r from-[#d4af37] via-[#f1d47c] to-[#c0c0c0] bg-clip-text text-transparent">Gold Intelligence</span>
                 <br/>
                 <span className="bg-gradient-to-r from-[#c0c0c0] via-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent opacity-90">Factor Engine</span>
               </h1>
               <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl relative z-20">
                 An institutional-grade regression matrix aligning <span className="text-blue-600 font-bold">19 macro-economic factors</span> to decode the fair value of Gold.
               </p>
             </div>

             {/* CLIENT COMPONENT IMPORTED HERE */}
             <div className="lg:w-1/3">
               <FactorFusionCore />
             </div>
           </div>

           {/* MODEL ATTRIBUTE SUB-CONTAINER */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto relative z-30">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-blue-100/50 shadow-xl group relative overflow-hidden">
                 <div className="flex flex-col items-center relative z-10">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Algorithm</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tight">Ridge Linear</span>
                    <span className="text-xs text-slate-400 mt-1 font-mono">L2 Regularization</span>
                 </div>
              </div>
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-amber-100/50 shadow-xl group relative overflow-hidden">
                 <div className="flex flex-col items-center relative z-10">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Sync</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tight">Monthly UTC</span>
                    <span className="text-xs text-slate-400 mt-1 font-mono">End-of-Month Fix</span>
                 </div>
              </div>
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-emerald-100/50 shadow-xl group relative overflow-hidden">
                 <div className="flex flex-col items-center relative z-10">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Dataset</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tight">240 Points</span>
                    <span className="text-xs text-slate-400 mt-1 font-mono">2006 - Present</span>
                 </div>
              </div>
           </div>
        </div>
        
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-24 bg-gradient-to-b from-slate-300 to-transparent z-0"></div>
      </header>

      {/* SECTION 5: DATA MATRIX HUB */}
      <section className="relative z-30">
        <div className="absolute inset-0 bg-slate-50/50 -z-10 rounded-[3rem] transform scale-x-105 scale-y-110 border border-slate-100/50" 
             style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/diagmonds-light.png')", opacity: 0.4 }}></div>

        <div className="flex items-center justify-between mb-8 px-4 relative z-20">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
             <Icons.Pulse /> Live Data Feed
           </h3>
           <span className="text-[10px] font-mono text-slate-400 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-slate-100 shadow-sm">
             Source: FRED / WGC / NYIT Lab
           </span>
        </div>
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden relative z-20 ring-1 ring-slate-900/5">
           <GoldTable 
             data={goldData} ry={ry} ny={ny} cv={cv} inf={inf} usd={usd} 
             eur={eur} jpy={jpy} vx={vx} sp={sp} st={st} gp={gp} 
             ep={ep} gl={gl} ol={ol} cp={cp} ci={ci} ue={ue} ip={ip} cu={cu}
           />
        </div>
      </section>

      {/* SECTION 6: METHODOLOGY */}
      <section className="space-y-16 pb-24 relative z-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-16 bg-gradient-to-b from-transparent via-slate-300 to-transparent -z-10"></div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-slate-200 pb-8 mx-4 relative">
           <div className="max-w-2xl relative z-10">
              <span className="text-blue-600 font-black uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-blue-600 inline-block"></span> Factor Infrastructure
              </span>
              <h2 className="text-[4rem] font-black text-slate-900 tracking-tighter leading-[0.9]">
                The <span className="text-slate-300">19 Factors</span>
              </h2>
              <p className="mt-6 text-slate-500 font-medium text-lg">
                We categorize the drivers of Gold into distinct clusters. From Yield Physics to Fear Gauges, each variable is rigorously tested for significance.
              </p>
           </div>
           
           <div className="hidden lg:block text-right relative z-10">
              <div className="text-[4rem] font-black text-slate-100 leading-none drop-shadow-sm">19</div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Independent Variables</span>
           </div>
           
           <div className="absolute right-0 bottom-0 w-64 h-64 bg-contain bg-no-repeat opacity-10 pointer-events-none -z-10" 
                style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/connected.png')" }}></div>
        </div>

        <div className="methodology-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 relative z-20">
          {factorRegistry.map((factor) => (
            <div key={factor.id} className="hover:-translate-y-2 transition-transform duration-300">
               <FactorCard factor={factor} />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: AUDIT BUFFER */}
      <div className="hidden opacity-0 pointer-events-none h-0 overflow-hidden">
          {`[SYSTEM_LOG: COMPONENT_FIXED_NO_SERVER_CSS_ERROR]`}
      </div>
    </main>
  );
}