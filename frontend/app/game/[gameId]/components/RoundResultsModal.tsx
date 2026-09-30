'use client';
import React from 'react';

export default function RoundResultsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-in zoom-in-95 fade-in duration-300 p-8 space-y-8">
        
        <div className="text-center space-y-3 border-b border-slate-800/80 pb-6">
          <div className="inline-block px-3 py-1 bg-cyan-950 border border-cyan-800 text-cyan-400 text-[10px] font-mono font-bold tracking-widest rounded mb-2">SYSTEM UPDATE</div>
          <h2 className="text-4xl font-black text-white uppercase tracking-widest drop-shadow-md">Cycle Resolved</h2>
          <p className="text-slate-400 font-mono text-sm">Analysis of implemented strategic parameters</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
             Executive Summary
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/50 p-5 rounded-xl border border-slate-800 font-sans">
            Your decision to aggressively expand into the emerging AI logistics sector yielded mixed results. While market share increased significantly due to early adoption, public trust fell corresponding to perceived monopolistic practices. The GlobalTech partnership successfully stabilized your supply chain throughput.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">Metrics Delta</h4>
            <ul className="space-y-3 text-sm font-mono">
              <li className="flex justify-between items-center border-b border-slate-800/50 pb-2">
                 <span className="text-slate-400">Market Share</span>
                 <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded text-xs">+5.0% ▲</span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-800/50 pb-2">
                 <span className="text-slate-400">Public Trust</span>
                 <span className="text-red-400 bg-red-950/50 px-2 py-0.5 rounded text-xs">-12.0% ▼</span>
              </li>
              <li className="flex justify-between items-center">
                 <span className="text-slate-400">Available Capital</span>
                 <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded text-xs">+¥2.1B ▲</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">Global Events</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">▪</span>
                <span>Syndicate strike affects major orbital shipping lanes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">▪</span>
                <span>New Tier-3 carbon tax legislation passed in NorthAm sector.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex justify-center">
          <button 
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-16 rounded-lg border border-slate-600 hover:border-cyan-500 transition-all uppercase tracking-widest text-sm active:scale-95"
          >
            Acknowledge & Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
