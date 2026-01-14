/**
 * ======================================================================================
 * COMPONENT: FORWARD TEST VISUALIZER (THE PROVING GROUND)
 * ======================================================================================
 * Concept: Visualizes a "Time Bridge" extending from known history into the future.
 * Features: Laser grid floor, floating data checkpoints, and a "warp" effect.
 * ======================================================================================
 */

"use client";

import React from 'react';

export default function ForwardTestVisualizer() {
  return (
    <div className="relative w-full max-w-4xl mx-auto h-[350px] md:h-[450px] animate-fade-zoom flex items-center justify-center overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
      
      {/* 1. PERSPECTIVE GRID FLOOR (The "Ground") */}
      <div className="absolute inset-0 perspective-1000">
         <div className="absolute bottom-0 w-full h-[150%] bg-[linear-gradient(0deg,transparent_24%,rgba(124,58,237,0.3)_25%,rgba(124,58,237,0.3)_26%,transparent_27%,transparent_74%,rgba(124,58,237,0.3)_75%,rgba(124,58,237,0.3)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(124,58,237,0.3)_25%,rgba(124,58,237,0.3)_26%,transparent_27%,transparent_74%,rgba(124,58,237,0.3)_75%,rgba(124,58,237,0.3)_76%,transparent_77%,transparent)] bg-[length:50px_50px] transform rotate-x-60 origin-bottom animate-grid-flow"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900"></div>
      </div>

      {/* 2. THE TIME BRIDGE (Central Beam) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-full bg-gradient-to-t from-purple-500 to-blue-400 opacity-50 blur-sm"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white opacity-80"></div>

      {/* 3. FLOATING DATA NODES (Checkpoints) */}
      <div className="absolute inset-0 flex items-center justify-center">
         {/* Node 1: Training End */}
         <div className="absolute top-[60%] flex flex-col items-center animate-pulse-slow">
            <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] border-2 border-white"></div>
            <div className="mt-2 px-3 py-1 bg-slate-800/80 rounded border border-blue-500/30 text-[10px] font-bold text-blue-300 uppercase tracking-widest backdrop-blur">
               2020 Limit
            </div>
         </div>

         {/* Node 2: Testing Start */}
         <div className="absolute top-[40%] flex flex-col items-center animate-pulse-slow" style={{ animationDelay: '0.5s' }}>
            <div className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)] border-2 border-white"></div>
            <div className="mt-2 px-3 py-1 bg-slate-800/80 rounded border border-purple-500/30 text-[10px] font-bold text-purple-300 uppercase tracking-widest backdrop-blur">
               2021 Start
            </div>
         </div>

         {/* Node 3: Current Horizon */}
         <div className="absolute top-[20%] flex flex-col items-center animate-pulse-slow" style={{ animationDelay: '1s' }}>
            <div className="w-6 h-6 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] border-2 border-white flex items-center justify-center">
               <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <div className="mt-2 px-3 py-1 bg-slate-800/80 rounded border border-emerald-500/30 text-[10px] font-bold text-emerald-300 uppercase tracking-widest backdrop-blur">
               2025 Validated
            </div>
         </div>
      </div>

      {/* 4. WARP SPEED PARTICLES */}
      <div className="absolute inset-0 pointer-events-none">
         {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute w-[2px] h-[40px] bg-white opacity-20"
                 style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `warpDrop ${1 + Math.random()}s infinite linear`,
                    opacity: Math.random() * 0.5
                 }}
            />
         ))}
      </div>

      {/* 5. CSS INJECTION */}
      <style jsx>{`
        @keyframes gridFlow {
          from { background-position: 0 0; }
          to { background-position: 0 50px; }
        }
        @keyframes warpDrop {
          from { transform: translateY(-100px); opacity: 0; }
          50% { opacity: 0.5; }
          to { transform: translateY(400px); opacity: 0; }
        }
        .animate-grid-flow { animation: gridFlow 1s linear infinite; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
}