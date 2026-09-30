'use client';
import React, { useState } from 'react';

export default function DecisionPanel({ onSubmit }: { onSubmit: () => void }) {
  const [budget, setBudget] = useState(50);
  const [strategy, setStrategy] = useState('Penetration');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/60 p-6 rounded-xl border border-cyan-900/50 backdrop-blur-md shadow-lg">
        <div>
          <h2 className="text-2xl font-black text-white tracking-wide uppercase mb-1">Phase 3: Expansion</h2>
          <p className="text-sm text-cyan-400/70 font-mono">Input strategic parameters for current cycle.</p>
        </div>
        <div className="mt-4 sm:mt-0 text-right bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Time Remaining</div>
          <div className="text-3xl font-mono text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">02:45</div>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          Supplier Network
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['NeoLogistics', 'EcoChain', 'GlobalTech'].map((supplier) => (
            <div 
              key={supplier} 
              onClick={() => setSelectedSupplier(supplier)}
              className={`border p-5 rounded-xl cursor-pointer transition-all relative overflow-hidden ${
                selectedSupplier === supplier 
                  ? 'bg-cyan-900/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              <h4 className={`font-bold text-lg mb-2 ${selectedSupplier === supplier ? 'text-cyan-400' : 'text-slate-300'}`}>{supplier}</h4>
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Cost</span><span className="text-slate-300">¥1.2B</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Reliability</span><span className="text-emerald-400">High</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
          R&D Budget Allocation
        </h3>
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 backdrop-blur-sm">
          <div className="flex justify-between items-end mb-6">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">Capital Commitment</span>
            <div className="text-right">
               <span className="text-2xl font-mono text-cyan-400 drop-shadow-md">{budget}%</span>
               <span className="text-xs text-slate-500 font-mono ml-2">(¥{(budget * 0.145).toFixed(2)}B)</span>
            </div>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={budget} 
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-cyan-500 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer border border-slate-700"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          Pricing Strategy
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          {['Penetration', 'Skimming', 'Value-Based'].map((strat) => (
            <label 
              key={strat} 
              className={`flex items-center justify-center gap-3 cursor-pointer p-4 rounded-xl border transition-all flex-1 ${
                strategy === strat 
                  ? 'bg-cyan-900/20 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                  : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <input 
                type="radio" 
                name="pricing" 
                checked={strategy === strat}
                onChange={() => setStrategy(strat)}
                className="w-4 h-4 text-cyan-500 bg-slate-950 border-slate-700 focus:ring-cyan-500/50" 
              />
              <span className={`text-sm font-bold uppercase tracking-wider ${strategy === strat ? 'text-cyan-400' : 'text-slate-400'}`}>{strat}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="pt-8 flex justify-end">
        <button 
          onClick={onSubmit}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-10 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all uppercase tracking-widest text-lg active:scale-95 border border-cyan-400/50 w-full sm:w-auto"
        >
          Commit Directives
        </button>
      </div>
    </div>
  );
}
