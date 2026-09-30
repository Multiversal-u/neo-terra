'use client';

import React from 'react';

interface NewsTickerPanelProps {
  news?: Array<{ headline: string }>;
}

export default function NewsTickerPanel({ news }: NewsTickerPanelProps) {
  const defaultHeadlines = [
    'MERCADOS GLOBALES EN ALERTA POR NUEVAS REGULACIONES DE CARBONO TRANSFRONTERIZAS',
    'CONSORCIOS INDUSTRIALES ACELERAN LA TRANSICIÓN A CADENAS DE SUMINISTRO REGENERATIVAS',
    'TENSIONES GEOPOLÍTICAS RECONFIGURAN RUTAS LOGÍSTICAS EN EL SUR GLOBAL',
    'AUDITORÍAS CRIPTO-ECOLÓGICAS DESENMASCARAN PROVEEDORES OPACOS',
    'CONSUMIDORES PENALIZAN CORPORACIONES CON ÍNDICE ESG INFERIOR A 40 PUNTOS',
  ];

  const items = news && news.length > 0 
    ? news.map((n) => `• ${n.headline.toUpperCase()}`) 
    : defaultHeadlines.map((h) => `• ${h}`);

  return (
    <div className="bg-sand-100 border-t border-sand-border text-ink py-2 px-4 flex items-center overflow-hidden z-20 shrink-0 font-sans">
      <div className="bg-moss text-paper text-[10px] font-mono font-medium px-2 py-0.5 rounded mr-3 shrink-0 uppercase tracking-wider">
        BOLETÍN
      </div>
      <div className="flex-1 whitespace-nowrap overflow-hidden relative flex items-center h-full">
        <div className="inline-block animate-[marquee_45s_linear_infinite] text-xs font-mono text-ink-muted">
          {items.map((item, idx) => (
            <span key={idx} className="mx-6">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
