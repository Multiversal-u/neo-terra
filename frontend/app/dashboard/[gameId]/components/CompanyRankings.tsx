'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CompanyRankings({ companies }: { companies: any[] }) {
  const sorted = [...(companies || [])].sort((a, b) => (b.capital || 0) - (a.capital || 0));

  return (
    <div className="bg-white p-6 rounded-lg border border-sand-border shadow-paper h-full flex flex-col font-sans">
      <div className="flex justify-between items-center mb-4 border-b border-sand-border pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-moss font-semibold block">
            LIBRO MAYOR ABIERTO
          </span>
          <h2 className="font-serif text-xl text-ink font-normal mt-0.5">
            Ranking Corporativo
          </h2>
        </div>
        <span className="text-xs font-mono bg-sand-100 px-2.5 py-1 rounded border border-sand-border text-ink-muted">
          {sorted.length} {sorted.length === 1 ? 'entidad' : 'entidades'}
        </span>
      </div>

      <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
        {sorted.length === 0 && (
          <div className="text-center py-16 text-ink-faint font-mono text-xs italic border border-dashed border-sand-border rounded p-6">
            Aguardando conexión de corporaciones en sala...
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-sand-50/70 hover:bg-white p-3.5 rounded border border-sand-border transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`font-serif font-bold text-sm w-5 text-center ${
                  index === 0 ? 'text-amber-700' : index === 1 ? 'text-ink' : index === 2 ? 'text-terracotta' : 'text-ink-faint'
                }`}>
                  {index + 1}.
                </span>
                <div className="min-w-0">
                  <div className="font-medium text-sm text-ink truncate">
                    {company.name}
                  </div>
                  <div className="text-[10px] text-moss font-mono uppercase truncate">
                    {company.archetype || 'En Carrera'}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 ml-3">
                <div className="text-ink font-mono font-bold text-sm">
                  ${capitalMillion}M
                </div>
                <div className="text-[10px] text-ink-muted font-mono">
                  ESG: <strong className="text-ink">{company.esgIndex || 40}</strong>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
