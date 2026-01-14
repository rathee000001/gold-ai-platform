/**
 * ======================================================================================
 * COMPONENT: SIMULATION CORE (TIME MACHINE VISUALIZER)
 * ======================================================================================
 * Concept: Visualizes historical data re-processing ("Time Travel" Simulation).
 * Features: Rotating temporal rings, data stream validation, and success checkpoints.
 * ======================================================================================
 */

"use client";

import React from 'react';

export default function SimulationCore() {
  return (
    <div className="relative w-full max-w-4xl mx-auto h-[350px] md:h-[450px] animate-fade-zoom flex items-center justify-center overflow-visible">
      
      {/* 1. CENTRAL TEMPORAL ENGINE */}
      <div className="relative z-20 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
         
         {/* Outer Chrono Ring (Spinning Slow) */}
         <div className="absolute inset-0 border-[2px] border-dashed border-amber-500/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
         
         {/* Inner Metric Ring (Spinning Fast Reverse) */}
         <div className="absolute inset-8 border-[4px] border-transparent border-t-amber-400/60 border-b-blue-500/60 rounded-full animate-[spin_5s_linear_infinite_reverse]"></div>
         
         {/* Central Core (The Model Lock) */}
         <div className="relative w-32 h-32 bg-white/10 backdrop-blur-md rounded-full border border-slate-200/50 shadow-[0_0_40px_rgba(245,158,11,0.3)] flex items-center justify-center animate-pulse-slow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 text-amber-500">
               <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <div className="absolute -bottom-8 text-[10px] font-black text-amber-600 uppercase tracking-widest">2006-2020 Locked</div>
         </div>
      </div>

      {/* 2. LEFT SIDE: HISTORICAL DATA INPUTS */}
      <div className="absolute left-0 top-0 bottom-0 w-1/3 z-10 flex flex-col justify-center gap-6 pointer-events-none">
         {[...Array(3)].map((_, i) => (
            <div key={`hist-${i}`} className="relative h-12 w-full">
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-300 to-amber-400 animate-data-slide-right" 
                    style={{ animationDelay: `${i * 0.5}s` }} />
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-ping" 
                    style={{ animationDelay: `${i * 0.5}s` }}/>
            </div>
         ))}
      </div>

      {/* 3. RIGHT SIDE: VALIDATION CHECKPOINTS */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 z-10 flex flex-col justify-center gap-8 pointer-events-none pl-8">
         <div className="flex items-center gap-3 opacity-0 animate-fade-in-right" style={{ animationDelay: '0.5s' }}>
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
               <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Ridge Regression</span>
         </div>
         <div className="flex items-center gap-3 opacity-0 animate-fade-in-right" style={{ animationDelay: '1s' }}>
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
               <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Residual Check</span>
         </div>
         <div className="flex items-center gap-3 opacity-0 animate-fade-in-right" style={{ animationDelay: '1.5s' }}>
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
               <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">RMSE Minimization</span>
         </div>
      </div>

      {/* 4. CSS INJECTION */}
      <style jsx>{`
        @keyframes dataSlideRight {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(20%); opacity: 0; }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-data-slide-right { animation: dataSlideRight 2s infinite linear; }
        .animate-fade-in-right { animation: fadeInRight 0.8s forwards ease-out; }
      `}</style>
    </div>
  );
}