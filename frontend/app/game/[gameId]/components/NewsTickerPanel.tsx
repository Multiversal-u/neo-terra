'use client';
import React from 'react';

interface NewsTickerPanelProps {
  news?: Array<{ headline: string }>;
}

export default function NewsTickerPanel({ news }: NewsTickerPanelProps) {
  const defaultHeadlines = [
    '+++ MERCADOS GLOBALES EN ALERTA POR NUEVAS REGULACIONES DE CARBONO +++',
    '+++ CORPORACIONES ACELERAN LA TRANSICIÓN A CADENAS DE SUMINISTRO LIMPIAS +++',
    '+++ TENSIONES GEOPOLÍTICAS IMPACTAN RUTAS LOGÍSTICAS INTERNACIONALES +++',
    '+++ INVESTIGACIONES DE LA ONU PONEN BAJO LA LUPA A PROVEEDORES DE BAJO COSTO +++',
    '+++ CONSUMIDORES DE LA GENERACIÓN Z RECHAZAN EMPRESAS SIN ÍNDICE ESG VERIFICADO +++',
  ];

  const items = news && news.length > 0 ? news.map((n) => `+++ ${n.headline.toUpperCase()} +++`) : defaultHeadlines;

  return (
    <div className="bg-slate-950 border-t border-cyan-900/50 text-slate-300 py-1.5 px-3 flex items-center overflow-hidden z-20 shrink-0 font-mono">
      <div className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded mr-3 shrink-0 uppercase tracking-widest shadow-[0_0_8px_rgba(220,38,38,0.5)] z-10">
        EN VIVO
      </div>
      <div className="flex-1 whitespace-nowrap overflow-hidden relative flex items-center h-full">
        <div className="inline-block animate-[marquee_35s_linear_infinite] text-xs">
          {items.map((item, idx) => (
            <span key={idx} className="mx-6 text-cyan-300">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
