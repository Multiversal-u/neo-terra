'use client';

import React from 'react';
import { ShieldCheck, Building2, TrendingUp } from 'lucide-react';

interface CompanyDashboardProps {
  company?: any;
}

export default function CompanyDashboard({ company }: CompanyDashboardProps) {
  // Las 13 variables reales del motor de simulación
  const metrics = [
    { name: 'Reputación Corporativa', value: company?.reputation ?? 50, isInverse: false },
    { name: 'Huella Ambiental', value: company?.environmentalFootprint ?? 50, isInverse: true },
    { name: 'Innovación Tecnológica', value: company?.innovation ?? 30, isInverse: false },
    { name: 'Cuota de Mercado', value: company?.marketShare ?? 5, isInverse: false, unit: '%' },
    { name: 'Relación Consumidores', value: company?.consumerRelations ?? 50, isInverse: false },
    { name: 'Relación Reguladores', value: company?.regulatorRelations ?? 50, isInverse: false },
    { name: 'Relaciones Laborales', value: company?.laborRelations ?? 50, isInverse: false },
    { name: 'Nivel Tecnológico', value: company?.techLevel ?? 30, isInverse: false },
    { name: 'Ciberseguridad & Datos', value: company?.cybersecurity ?? 30, isInverse: false },
    { name: 'Índice ESG Sostenible', value: company?.esgIndex ?? 40, isInverse: false },
    { name: 'Capacidad Logística', value: company?.logisticCapacity ?? 40, isInverse: false },
    { name: 'Acceso Internacional', value: company?.internationalAccess ?? 30, isInverse: false },
  ];

  const getColor = (value: number, isInverse: boolean) => {
    const effective = isInverse ? 100 - value : value;
    if (effective < 35) return 'bg-terracotta';
    if (effective <= 65) return 'bg-sand-400';
    return 'bg-moss';
  };

  const capitalFormatted = company?.capital !== undefined
    ? `$${(Number(company.capital)).toLocaleString()}`
    : '$1,000,000';

  return (
    <aside className="w-full md:w-80 bg-white p-6 flex flex-col overflow-y-auto shrink-0 z-10 font-sans">
      {/* Cabecera de la Empresa */}
      <div className="mb-6 pb-5 border-b border-sand-border">
        <span className="text-[10px] font-mono tracking-widest uppercase text-moss font-semibold block mb-1">
          LIBRO MAYOR PRIVADO
        </span>
        <h2 className="text-xl font-serif text-ink font-normal truncate">
          {company?.name || 'Mi Corporación'}
        </h2>
        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-sand-100 border border-sand-border text-[11px] font-mono text-ink-muted">
          <span>Arquetipo:</span>
          <strong className="text-ink font-semibold">{company?.archetype || 'En Evaluación'}</strong>
        </div>

        {/* Tarjeta de Capital */}
        <div className="mt-4 bg-sand-50 p-4 rounded border border-sand-border">
          <div className="text-[10px] text-ink-faint uppercase font-bold tracking-wider font-mono">
            Capital Operativo Disponible
          </div>
          <div className="text-2xl font-serif font-medium text-ink mt-0.5">
            {capitalFormatted}
          </div>
        </div>
      </div>

      {/* Indicadores Corporativos */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-ink uppercase tracking-wider font-mono flex items-center gap-2">
          <span className="w-2 h-2 bg-moss rounded-full" />
          <span>Indicadores de Desempeño</span>
        </h3>

        <div className="space-y-3.5">
          {metrics.map((v) => (
            <div key={v.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-mono text-ink-muted">
                <span className="truncate pr-2">{v.name}</span>
                <span className="font-semibold text-ink shrink-0">
                  {Math.round(v.value)}{v.unit || '/100'}
                </span>
              </div>
              <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${getColor(v.value, v.isInverse)}`}
                  style={{ width: `${Math.min(100, Math.max(3, v.value))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
