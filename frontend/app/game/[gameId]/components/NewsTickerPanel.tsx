'use client';
import React from 'react';

export default function NewsTickerPanel() {
  return (
    <div className="bg-slate-950 border-t border-cyan-900/50 text-slate-300 py-1.5 px-3 flex items-center overflow-hidden z-20 shrink-0">
      <div className="bg-red-600/90 text-white text-[10px] font-black px-3 py-1 rounded-sm mr-4 shrink-0 uppercase tracking-widest shadow-[0_0_8px_rgba(220,38,38,0.5)] z-10">
        Live Feed
      </div>
      <div className="flex-1 whitespace-nowrap overflow-hidden relative flex items-center h-full">
        <div className="inline-block animate-[marquee_30s_linear_infinite] text-xs font-mono">
          <span className="mx-8 text-cyan-400">+++ GLOBAL MARKETS STABILIZE AFTER AI LEGISLATION +++</span>
          <span className="mx-8 text-emerald-400">+++ OMNICORP STOCK SURGES 12% IN PRE-MARKET +++</span>
          <span className="mx-8 text-rose-400">+++ CRITICAL RESOURCE SHORTAGES REPORTED IN SECTOR 4 +++</span>
          <span className="mx-8 text-purple-400">+++ NEW EXOPLANET COLONY ESTABLISHED BY BIOGENIX +++</span>
          <span className="mx-8 text-cyan-400">+++ SYNDICATE STRIKES DISRUPT LOGISTICS NETWORKS +++</span>
          <span className="mx-8 text-cyan-400">+++ GLOBAL MARKETS STABILIZE AFTER AI LEGISLATION +++</span>
        </div>
      </div>
    </div>
  );
}
