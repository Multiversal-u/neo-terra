'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function CompanyRankings({ companies }: { companies: any[] }) {
  const sorted = [...(companies || [])].sort((a, b) => b.capital - a.capital);

  return (
    <div className="bg-neoterra-navy/50 p-6 rounded-xl border border-neoterra-cyan/30 h-full">
      <h2 className="font-orbitron text-xl text-neoterra-cyan mb-4">CORPORATE RANKINGS</h2>
      <div className="space-y-4">
        {sorted.length === 0 && <p className="text-gray-400">Waiting for corporations...</p>}
        {sorted.map((company, index) => (
          <motion.div 
            key={company.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between bg-neoterra-dark/80 p-3 rounded-lg border border-gray-700"
          >
            <div className="flex items-center gap-3">
              <span className="text-neoterra-gold font-bold w-6">{index + 1}.</span>
              <div>
                <div className="font-bold">{company.name}</div>
                <div className="text-xs text-neoterra-purple">{company.archetype}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-neoterra-green font-mono">${(company.capital / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-neoterra-cyan">ESG: {company.esgIndex || 50}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
