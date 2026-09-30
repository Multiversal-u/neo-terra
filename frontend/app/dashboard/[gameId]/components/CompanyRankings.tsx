'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function CompanyRankings({ companies }: { companies: any[] }) {
  const sorted = [...(companies || [])].sort((a, b) => (b.capital || 0) - (a.capital || 0));

  return (
    <div className="bg-neoterra-navy/60 p-5 rounded-2xl border border-cyan-800/40 h-full backdrop-blur-md flex flex-col font-inter">
      <div className="flex justify-between items-center mb-4 border-b border-cyan-900/60 pb-3">
        <h2 className="font-orbitron text-lg font-black text-neoterra-cyan tracking-wider">
          RANKING CORPORATIVO
        </h2>
        <span className="text-[11px] font-mono text-gray-400">
          {sorted.length} {sorted.length === 1 ? 'empresa' : 'empresas'}
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {sorted.length === 0 && (
          <div className="text-center py-12 text-gray-500 font-mono text-xs italic">
            Esperando la conexión de corporaciones...
          </div>
        )}

        {sorted.map((company, index) => {
          const capitalMillion = company.capital !== undefined
            ? (company.capital / 1000000).toFixed(2)
            : '1.00';

          return (
            <motion.div
              key={company.id || index}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-slate-800 hover:border-cyan-900 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`font-mono font-black text-sm w-5 text-center ${
                  index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-600' : 'text-gray-500'
                }`}>
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-white truncate font-inter">
                    {company.name}
                  </div>
                  <div className="text-[10px] text-cyan-400/80 font-mono uppercase truncate">
                    {company.archetype || 'En Carrera'}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 ml-2">
                <div className="text-emerald-400 font-mono font-bold text-sm">
                  ${capitalMillion}M
                </div>
                <div className="text-[10px] text-purple-300 font-mono">
                  ESG: <strong className="text-white">{company.esgIndex || 40}</strong>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
