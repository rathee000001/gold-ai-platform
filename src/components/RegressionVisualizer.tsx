/**
 * ======================================================================================
 * COMPONENT: REGRESSION VISUALIZER (THE LINEAR SOLVER v2.0)
 * ======================================================================================
 * Concept: 3D Scatter Plot with integrated AI Intelligence Agent news tooltips.
 * Purpose: Visualizes the "Crucible" of training (2006-2020) with historical context.
 * ======================================================================================
 */

"use client";

import React, { useState } from 'react';

// --- SECTION 1: INTERNAL INTELLIGENCE ARCHIVE ---
const INTEL_ARCHIVE = [
  { date: "2008", event: "Lehman Collapse & Great Recession", impact: "Safe Haven Pivot" },
  { date: "2011", event: "Eurozone Debt Crisis Peaks", impact: "ATH Momentum" },
  { date: "2013", event: "The Taper Tantrum", impact: "Yield Headwinds" },
  { date: "2016", event: "Brexit & US Election Volatility", impact: "Policy Uncertainty" },
  { date: "2020", event: "COVID-19 Global Liquidity Shock", impact: "Systemic Inflow" }
];

export default function RegressionVisualizer() {
  const [activeIntel, setActiveIntel] = useState<typeof INTEL_ARCHIVE[0] | null>(null);

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[350px] md:h-[450px] animate-fade-zoom flex items-center justify-center overflow-visible">
      
      {/* 1. CENTRAL 3D GRID SYSTEM */}
      <div className="relative z-20 w-64 h-64 md:w-80 md:h-80 perspective-1000">
         
         {/* Rotating Container */}
         <div className="w-full h-full relative preserve-3d animate-[spin_20s_linear_infinite] group">
            
            {/* The 3D Cube/Grid Wireframe */}
            <div className="absolute inset-0 border-2 border-blue-500/20 rounded-lg transform rotate-x-12 rotate-y-12"></div>
            <div className="absolute inset-4 border border-slate-300/10 rounded-lg transform -rotate-x-12 -rotate-y-12"></div>
            
            {/* The Regression Plane (Best Fit Surface) */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.8)] transform -rotate-12 animate-pulse-slow"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent shadow-[0_0_20px_rgba(245,158,11,0.8)] transform rotate-45 opacity-50"></div>

            {/* Floating Data Points (Historical News Interactive) */}
            {INTEL_ARCHIVE.map((item, i) => (
               <div key={i} 
                    onMouseEnter={() => setActiveIntel(item)}
                    onMouseLeave={() => setActiveIntel(null)}
                    className={`absolute w-3 h-3 rounded-full cursor-help shadow-lg transition-all duration-300 hover:scale-150 hover:bg-white z-50 ${i % 2 === 0 ? 'bg-emerald-400' : 'bg-blue-400'}`}
                    style={{
                        top: `${20 + (i * 15)}%`,
                        left: `${15 + (i * 15)}%`,
                        transform: `translateZ(${20 + (i * 10)}px)`,
                        animation: `floatPoint ${3 + (i * 0.2)}s infinite ease-in-out alternate`
                    }}
               >
                  {/* Point Label */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                     <span className="text-[8px] font-black text-slate-400 whitespace-nowrap">{item.date}</span>
                  </div>
               </div>
            ))}
         </div>
         
         {/* Central Mathematical Core */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-24 h-24 animate-spin-slow-reverse drop-shadow-2xl">
               <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" className="text-slate-300/30" fill="none" strokeDasharray="4 4" />
               <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="1" className="text-blue-500/50" />
               <circle cx="50" cy="50" r="5" className="text-amber-500 fill-current animate-pulse" />
            </svg>
         </div>
      </div>

      {/* 2. AGENT OVERLAY (INTELLIGENCE POPUP) */}
      {activeIntel && (
         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-slate-900 border border-amber-500/30 p-4 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 max-w-[240px]">
            <div className="flex items-center gap-2 mb-2">
               <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
               <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter">AI Agent: {activeIntel.date}</span>
            </div>
            <p className="text-[11px] text-white font-bold leading-tight mb-2">"{activeIntel.event}"</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest">Impact: {activeIntel.impact}</p>
         </div>
      )}

      {/* 3. BACKGROUND DATA STREAMS */}
      <div className="absolute inset-0 z-10 pointer-events-none">
         {[...Array(5)].map((_, i) => (
            <div key={`line-${i}`} className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-slate-300/40 to-transparent"
                 style={{ left: `${20 * i}%`, animationDelay: `${i * 0.5}s` }}>
               <div className="absolute top-0 w-full h-20 bg-blue-400/30 blur-md animate-data-rain" style={{ animationDuration: `${3 + i}s` }}></div>
            </div>
         ))}
      </div>

      {/* 4. HUD METRICS */}
      <div className="absolute top-10 left-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg border border-slate-200 shadow-sm z-30">
         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Function</span>
         <span className="text-xs font-mono font-bold text-blue-600">f(x) = βx + ε</span>
      </div>
      <div className="absolute bottom-10 right-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg border border-slate-200 shadow-sm z-30">
         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Optimization</span>
         <span className="text-xs font-mono font-bold text-emerald-600">L2 Ridge Minimize</span>
      </div>

      <style jsx>{`
        @keyframes floatPoint {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-10px) scale(1.2); }
        }
        @keyframes dataRain {
          0% { top: -20%; opacity: 0; }
          20% { opacity: 1; }
          100% { top: 120%; opacity: 0; }
        }
        .preserve-3d { transform-style: preserve-3d; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
}