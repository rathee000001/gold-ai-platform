/**
 * ======================================================================================
 * COMPONENT: FUTURE HORIZON SCANNER (THE FORECAST ENGINE)
 * ======================================================================================
 * Concept: A radar/scanner visualizing the projection of future data points.
 * Features: Rotating radar sweep, floating predictions, and a "Proxy" timeline.
 * ======================================================================================
 */

"use client";

import React from 'react';

export default function FutureHorizonScanner() {
  return (
    <div className="relative w-full max-w-4xl mx-auto h-[350px] md:h-[450px] animate-fade-zoom flex items-center justify-center overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
      
      {/* 1. BACKGROUND GRID (The Horizon) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-[0.05]"></div>
      
      {/* 2. CENTRAL RADAR SCANNER */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border border-orange-500/20 flex items-center justify-center">
         {/* Radar Sweep Animation */}
         <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-orange-500/10 to-transparent animate-[spin_4s_linear_infinite] origin-center"></div>
         <div className="absolute top-1/2 left-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent to-orange-400 origin-left animate-[spin_4s_linear_infinite]"></div>
         
         {/* Concentric Rings */}
         <div className="absolute inset-8 rounded-full border border-orange-500/10"></div>
         <div className="absolute inset-16 rounded-full border border-orange-500/10"></div>
         <div className="absolute inset-24 rounded-full border border-orange-500/10"></div>

         {/* Central Focal Point (The Proxy) */}
         <div className="relative z-10 w-24 h-24 bg-orange-500/10 backdrop-blur-md rounded-full border border-orange-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.4)] animate-pulse-slow">
            <div className="text-center">
               <div className="text-[9px] font-black text-orange-300 uppercase tracking-widest">Proxy</div>
               <div className="text-xs font-bold text-white">2024-25</div>
            </div>
         </div>
      </div>

      {/* 3. FLOATING PREDICTION NODES (The Future) */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Node 1: Near Future */}
         <div className="absolute top-[30%] right-[25%] flex items-center gap-2 animate-float" style={{ animationDelay: '0s' }}>
            <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.8)]"></div>
            <span className="text-[9px] font-mono text-orange-200/60">Q3 2025</span>
         </div>

         {/* Node 2: Mid Future */}
         <div className="absolute bottom-[35%] right-[15%] flex items-center gap-2 animate-float" style={{ animationDelay: '1.5s' }}>
            <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.8)]"></div>
            <span className="text-[9px] font-mono text-orange-200/60">Q4 2025</span>
         </div>

         {/* Node 3: Far Future */}
         <div className="absolute top-[40%] left-[20%] flex items-center gap-2 animate-float" style={{ animationDelay: '0.8s' }}>
            <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.8)]"></div>
            <span className="text-[9px] font-mono text-orange-200/60">Q1 2026</span>
         </div>
      </div>

      {/* 4. SCAN LINES */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
         <div className="absolute top-0 w-full h-[2px] bg-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.8)] animate-scan-down"></div>
      </div>

      {/* 5. CSS INJECTION */}
      <style jsx>{`
        @keyframes scanDown {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        .animate-scan-down { animation: scanDown 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}