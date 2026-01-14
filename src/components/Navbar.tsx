/**
 * ============================================================================================================================================================
 * COMPONENT: GLOBAL NAVIGATION SYSTEM (v3.0 - FULL MAP)
 * ============================================================================================================================================================
 * PURPOSE:     Primary navigation bar matching the 'NYIT Laboratory' design.
 * FEATURES:    Automatic 'Active State' detection for all modules.
 * LINKS:       Mapped to your specific file directory structure.
 * ============================================================================================================================================================
 */

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Navigation Data Map
  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'HISTORY', href: '/history' },           // Placeholder
    { name: 'INTELLIGENCE', href: '/intelligence' }, // The Factor Engine
    { name: 'REGRESSION', href: '/regression' },
    { name: 'IN-SAMPLE', href: '/backtest' },
    { name: 'OUT-SAMPLE', href: '/out-of-sample' },  // Maps to src/app/out-of-sample
    { name: 'FORECAST', href: '/forecast' },         // Maps to src/app/forecast
    { name: 'DOCS', href: '/documentation' }         // Placeholder
  ];

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* BRANDING SECTION */}
        <div className="flex flex-col leading-none select-none shrink-0 mr-8">
          <Link href="/">
            <h1 className="text-[24px] font-black tracking-tighter text-[#D4AF37] cursor-pointer">
              GOLD<span className="text-[#D4AF37]/40">.AI</span>
            </h1>
          </Link>
          <span className="text-[9px] font-bold text-blue-600 tracking-[0.3em] uppercase mt-0.5">
            NYIT Laboratory
          </span>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex gap-8 h-full overflow-x-auto no-scrollbar items-center">
          {navLinks.map((link) => {
            // Active State Logic
            const isActive = link.href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(link.href);

            return (
              <Link 
                key={link.name} 
                href={link.href}
                className="relative h-full flex items-center group shrink-0"
              >
                <span className={`text-[11px] font-black tracking-[0.1em] transition-colors duration-300 ${
                  isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  {link.name}
                </span>
                
                {/* Blue Underline Indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 shadow-[0_-2px_10px_rgba(37,99,235,0.3)]"></div>
                )}
              </Link>
            );
          })}
        </div>

        {/* STATUS INDICATOR */}
        <div className="hidden lg:flex items-center gap-2 shrink-0 ml-8">
           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Online</span>
        </div>

      </div>
    </nav>
  );
}