'use client';
import React from 'react';

export default function WaitingScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-1000 p-4">
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* Abstract animated globe / core */}
        <div className="absolute inset-0 rounded-full border border-cyan-900/30 bg-cyan-950/10 shadow-[inset_0_0_50px_rgba(6,182,212,0.1)]"></div>
        <div className="absolute inset-2 rounded-full border-t-2 border-r-2 border-transparent border-t-cyan-500/70 border-r-cyan-500/30 animate-[spin_4s_linear_infinite]" />
        <div className="absolute inset-6 rounded-full border-b-2 border-l-2 border-transparent border-b-blue-500/70 border-l-blue-500/30 animate-[spin_3s_linear_infinite_reverse]" />
        <div className="absolute inset-10 rounded-full border-2 border-dashed border-emerald-500/20 animate-[spin_8s_linear_infinite]" />
        
        <div className="flex flex-col items-center justify-center z-10">
          <span className="text-cyan-400 font-mono font-bold text-2xl tracking-widest drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
            SYNC
          </span>
          <span className="text-cyan-500/50 text-[10px] font-mono mt-1">WAITING...</span>
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-black text-white tracking-widest uppercase">Directives Transmitted</h2>
        <p className="text-slate-400 text-sm font-mono">Awaiting neural confirmation from global competitors...</p>
      </div>

      <div className="bg-slate-900/80 border border-cyan-900/40 p-6 rounded-2xl max-w-md w-full backdrop-blur-sm shadow-xl">
        <h3 className="text-[10px] text-cyan-500 uppercase font-bold mb-4 tracking-widest flex items-center justify-between border-b border-slate-800/50 pb-2">
          <span>Live Network Status</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> ONLINE</span>
        </h3>
        <div className="space-y-3 text-sm font-mono">
          <div className="flex justify-between items-center p-2 rounded bg-slate-950/50 border border-slate-800">
             <span className="text-slate-300">OmniCorp</span>
             <span className="text-emerald-400 text-xs font-bold px-2 py-0.5 bg-emerald-950/50 rounded">LOCKED</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-slate-950/50 border border-slate-800">
             <span className="text-slate-300">BioGenix</span>
             <span className="text-emerald-400 text-xs font-bold px-2 py-0.5 bg-emerald-950/50 rounded">LOCKED</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-slate-900 border border-slate-700">
             <span className="text-slate-400">AeroDyne</span>
             <span className="text-amber-500 text-xs font-bold px-2 py-0.5 animate-pulse">PROCESSING...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
