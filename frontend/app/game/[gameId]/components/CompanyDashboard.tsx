'use client';
import React from 'react';

interface CompanyDashboardProps {
  company?: any;
}

export default function CompanyDashboard({ company }: CompanyDashboardProps) {
  // Las 13 variables reales del motor de simulación
  const metrics = [
    { name: 'Reputación Corporativa', value: company?.reputation ?? 50, isInverse: false },
    { name: 'Huella Ambiental', value: company?.environmentalFootprint ?? 50, isInverse: true },
    { name: 'Innovación', value: company?.innovation ?? 30, isInverse: false },
    { name: 'Cuota de Mercado', value: company?.marketShare ?? 5, isInverse: false, unit: '%' },
    { name: 'Relación Consumidores', value: company?.consumerRelations ?? 50, isInverse: false },
    { name: 'Relación Reguladores', value: company?.regulatorRelations ?? 50, isInverse: false },
    { name: 'Relaciones Laborales', value: company?.laborRelations ?? 50, isInverse: false },
    { name: 'Nivel Tecnológico', value: company?.techLevel ?? 30, isInverse: false },
    { name: 'Ciberseguridad', value: company?.cybersecurity ?? 30, isInverse: false },
    { name: 'Índice ESG Sostenible', value: company?.esgIndex ?? 40, isInverse: false },
    { name: 'Capacidad Logística', value: company?.logisticCapacity ?? 40, isInverse: false },
    { name: 'Acceso Internacional', value: company?.internationalAccess ?? 30, isInverse: false },
  ];

  const getColor = (value: number, isInverse: boolean) => {
    const effective = isInverse ? 100 - value : value;
    if (effective < 35) return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
    if (effective <= 65) return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]';
    return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]';
  };

  const capitalFormatted = company?.capital !== undefined
    ? `$${(Number(company.capital)).toLocaleString()}`
    : '$1,000,000';

  return (
    <aside className="w-full md:w-80 bg-slate-900/95 border-b md:border-b-0 md:border-r border-cyan-900/50 p-5 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-900 shrink-0 z-10 backdrop-blur-md">
      {/* Cabecera de la Empresa */}
      <div className="mb-6 pb-4 border-b border-cyan-900/50">
        <h2 className="text-xl md:text-2xl font-black text-white tracking-wider uppercase mb-1 font-orbitron truncate">
          {company?.name || 'Mi Corporación'}
        </h2>
        <div className="text-xs text-cyan-400 font-mono mb-3 uppercase tracking-wider">
          Arquetipo: <span className="text-neoterra-gold">{company?.archetype || 'En Evaluación'}</span>
        </div>

        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">
            Capital Disponible
          </div>
          <div className="text-2xl font-mono font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
            {capitalFormatted}
          </div>
        </div>
      </div>

      {/* Indicadores Corporativos */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          Indicadores de Desempeño
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {metrics.map((v) => (
            <div key={v.name} className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-300">
                <span className="truncate pr-2">{v.name}</span>
                <span className="font-bold text-white shrink-0">
                  {Math.round(v.value)}{v.unit || '/100'}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${getColor(v.value, v.isInverse)}`}
                  style={{ width: `${Math.min(100, Math.max(2, v.value))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
