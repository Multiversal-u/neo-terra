'use client';
import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
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
  color: string;
  unit?: string;
  invertColor?: boolean;
}

function MetricGauge({ label, value, max, color, unit = '', invertColor = false }: MetricGaugeProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const displayColor = invertColor
    ? pct > 66 ? '#ef4444' : pct > 33 ? '#f97316' : '#10b981'
    : pct > 66 ? '#10b981' : pct > 33 ? '#f97316' : '#ef4444';

  const data = [{ value: pct, fill: displayColor }];

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-20 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="100%"
            barSize={8}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar background dataKey="value" cornerRadius={4} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-white font-bold text-sm leading-none">
        {value.toFixed(unit === '°C' ? 1 : 0)}{unit}
      </p>
      <p className="text-gray-400 text-xs text-center leading-tight">{label}</p>
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
      color: '#ef4444',
      unit: '°C',
      invertColor: true,
    },
    {
      label: 'Estabilidad Eco.',
      value: m.economicStability ?? 60,
      max: 100,
      color: '#10b981',
    },
    {
      label: 'Confianza',
      value: m.consumerConfidence ?? 55,
      max: 100,
      color: '#00d4ff',
    },
    {
      label: 'Regulación',
      value: m.internationalRegulation ?? 40,
      max: 100,
      color: '#7c3aed',
      invertColor: true,
    },
    {
      label: 'Innovación',
      value: m.globalInnovation ?? 35,
      max: 100,
      color: '#fbbf24',
    },
    {
      label: 'Desigualdad',
      value: m.socialInequality ?? 55,
      max: 100,
      color: '#f97316',
      invertColor: true,
    },
    {
      label: 'Sostenibilidad',
      value: m.sustainabilityIndex ?? 40,
      max: 100,
      color: '#84cc16',
    },
  ];

  return (
    <div className="bg-neoterra-navy/50 p-6 rounded-xl border border-neoterra-purple/30 h-full flex flex-col">
      <h2 className="font-orbitron text-xl text-neoterra-purple mb-6 tracking-wider">
        VARIABLES GLOBALES
      </h2>
      <div className="grid grid-cols-2 gap-4 flex-1 place-items-center">
        {gauges.map((g) => (
          <MetricGauge key={g.label} {...g} />
        ))}
      </div>
    </div>
  );
}
