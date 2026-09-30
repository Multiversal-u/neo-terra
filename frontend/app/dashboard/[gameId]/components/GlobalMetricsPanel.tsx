'use client';
import React from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

export default function GlobalMetricsPanel({ metrics }: { metrics: any }) {
  const data = [
    { name: 'Temperature', value: metrics?.temperature || 1.5, fill: '#ef4444' },
    { name: 'Eco Stability', value: metrics?.economicStability || 50, fill: '#10b981' },
    { name: 'Consumer Conf', value: metrics?.consumerConfidence || 50, fill: '#00d4ff' },
    { name: 'Regulation', value: metrics?.internationalRegulation || 50, fill: '#7c3aed' },
    { name: 'Innovation', value: metrics?.globalInnovation || 50, fill: '#fbbf24' },
    { name: 'Inequality', value: metrics?.socialInequality || 50, fill: '#f97316' },
    { name: 'Sustainability', value: metrics?.sustainabilityIndex || 50, fill: '#84cc16' }
  ];

  return (
    <div className="bg-neoterra-navy/50 p-6 rounded-xl border border-neoterra-purple/30 h-full flex flex-col">
      <h2 className="font-orbitron text-xl text-neoterra-purple mb-4">GLOBAL METRICS</h2>
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="100%" barSize={10} data={data}>
            <RadialBar background clockWise dataKey="value" cornerRadius={10} />
            <Tooltip contentStyle={{ backgroundColor: '#050a14', border: '1px solid #7c3aed' }} />
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} textStyle={{ fill: '#fff', fontSize: '12px' }} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
