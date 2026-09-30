'use client';

import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from 'recharts';

interface Metrics {
  globalTemperature?: number;
  economicStability?: number;
  consumerConfidence?: number;
  internationalRegulation?: number;
  globalInnovation?: number;
  socialInequality?: number;
  sustainabilityIndex?: number;
}

interface MetricGaugeProps {
  label: string;
  value: number;
  max: number;
  unit?: string;
  invertColor?: boolean;
}

function MetricGauge({ label, value, max, unit = '', invertColor = false }: MetricGaugeProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  
  // Paleta consciente: Moss (#2D3A29), Sand (#9E9482), Terracotta (#B85333)
  const displayColor = invertColor
    ? pct > 66 ? '#B85333' : pct > 33 ? '#9E9482' : '#2D3A29'
    : pct > 66 ? '#2D3A29' : pct > 33 ? '#9E9482' : '#B85333';

  const data = [{ value: pct, fill: displayColor }];

  return (
    <div className="flex flex-col items-center gap-1.5 p-2 bg-sand-50/50 rounded border border-sand-border/70 w-full">
      <div className="w-16 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="100%"
            barSize={6}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar background={{ fill: '#EAE5D9' }} dataKey="value" cornerRadius={3} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center">
        <p className="text-ink font-mono font-bold text-sm leading-none">
          {value.toFixed(unit === '°C' ? 1 : 0)}{unit}
        </p>
        <p className="text-ink-muted text-[11px] text-center font-sans mt-1 leading-tight">
          {label}
        </p>
      </div>
    </div>
  );
}

export default function GlobalMetricsPanel({ metrics }: { metrics?: Metrics }) {
  const m = metrics || {};

  const gauges: MetricGaugeProps[] = [
    {
      label: 'Temperatura',
      value: m.globalTemperature ?? 1.5,
      max: 4,
      unit: '°C',
      invertColor: true,
    },
    {
      label: 'Estabilidad Eco.',
      value: m.economicStability ?? 60,
      max: 100,
    },
    {
      label: 'Confianza Consumidor',
      value: m.consumerConfidence ?? 55,
      max: 100,
    },
    {
      label: 'Regulación Global',
      value: m.internationalRegulation ?? 40,
      max: 100,
      invertColor: true,
    },
    {
      label: 'Innovación',
      value: m.globalInnovation ?? 35,
      max: 100,
    },
    {
      label: 'Desigualdad Social',
      value: m.socialInequality ?? 55,
      max: 100,
      invertColor: true,
    },
    {
      label: 'Sostenibilidad',
      value: m.sustainabilityIndex ?? 40,
      max: 100,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-sand-border shadow-paper h-full flex flex-col font-sans">
      <div className="mb-4 pb-3 border-b border-sand-border flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-moss font-semibold block">
            EQUILIBRIO SISTÉMICO
          </span>
          <h2 className="font-serif text-xl text-ink font-normal mt-0.5">
            Variables de la Biosfera
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1 place-items-center">
        {gauges.map((g) => (
          <MetricGauge key={g.label} {...g} />
        ))}
      </div>
    </div>
  );
}
