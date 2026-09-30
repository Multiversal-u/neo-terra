'use client';
import React from 'react';

const variables = [
  { name: 'Market Share', value: 45 },
  { name: 'Public Trust', value: 72 },
  { name: 'Tech Innovation', value: 85 },
  { name: 'Eco-Rating', value: 25 },
  { name: 'Employee Morale', value: 60 },
  { name: 'Reg Compliance', value: 50 },
  { name: 'Supply Chain', value: 38 },
  { name: 'Cyber Security', value: 90 },
  { name: 'Brand Value', value: 65 },
  { name: 'Debt Ratio', value: 40 },
  { name: 'R&D Output', value: 77 },
  { name: 'Production', value: 55 },
  { name: 'Global Influence', value: 30 },
];

export default function CompanyDashboard() {
  const getColor = (value: number) => {
    if (value < 30) return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
    if (value <= 60) return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]';
    return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]';
  };

  return (
    <aside className="w-full md:w-72 lg:w-80 bg-slate-900/90 border-r border-cyan-900/50 p-5 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent shrink-0 z-10 backdrop-blur-sm">
      <div className="mb-8 pb-6 border-b border-cyan-900/50">
        <h2 className="text-2xl font-black text-white tracking-wider uppercase mb-1 drop-shadow-md">OmniCorp</h2>
        <div className="text-xs text-cyan-500 font-mono mb-4 uppercase tracking-widest">Type: Technocrat</div>
        
        <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Liquid Capital</div>
          <div className="text-3xl font-mono text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]">¥ 14.5B</div>
        </div>
      </div>
      
      <div className="space-y-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
          Core Metrics
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {variables.map((v) => (
            <div key={v.name} className="flex flex-col gap-1.5 group">
              <div className="flex justify-between text-[11px] font-mono text-slate-400 group-hover:text-slate-300 transition-colors uppercase">
                <span>{v.name}</span>
                <span className="text-slate-300">{v.value}%</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800/50">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${getColor(v.value)}`}
                  style={{ width: `${v.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
