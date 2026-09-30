'use client';
import React from 'react';

interface RoundResultsModalProps {
  onClose: () => void;
  narrative?: any;
  companyName?: string;
  results?: any;
}

export default function RoundResultsModal({
  onClose,
  narrative,
  companyName,
  results,
}: RoundResultsModalProps) {
  const story = narrative?.story || 'Tu corporación ejecutó las directivas del ciclo. El mercado global asimiló el impacto de la oferta tecnológica y los reguladores monitorean el comportamiento de las cadenas de valor.';
  const cascade = narrative?.cascade || [
    'Directiva estratégica implementada',
    'Reacción de competidores en el mercado',
    'Ajuste en la demanda de los consumidores',
    'Resultado financiero y reputacional consolidado',
  ];
  const newsList = results?.newsItems || [];

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4 font-inter">
      <div className="bg-slate-900/95 border border-cyan-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(6,182,212,0.25)] animate-in zoom-in-95 duration-300 p-6 md:p-8 space-y-6">
        
        {/* Cabecera de la Crónica */}
        <div className="text-center space-y-1.5 border-b border-slate-800 pb-4">
          <div className="inline-block px-3 py-1 bg-cyan-950 border border-cyan-700 text-cyan-300 text-[10px] font-mono font-bold tracking-widest rounded-full uppercase">
            INFORME DE INTELIGENCIA CORPORATIVA // AÑO {narrative?.year || 2045}
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-orbitron text-white uppercase tracking-wider">
            Crónica del Ciclo {narrative?.round || 1}
          </h2>
          <p className="text-slate-400 font-mono text-xs">
            Evaluación de consecuencias para <strong className="text-cyan-400">{companyName || 'tu empresa'}</strong>
          </p>
        </div>

        {/* 1. La Narrativa Personalizada de tu Empresa */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
              Qué ocurrió tras tu decisión ({narrative?.chosenOptionName || 'Directiva Ejecutada'})
            </h3>
          </div>

          <div className="bg-slate-950/90 p-4 md:p-5 rounded-2xl border-l-4 border-cyan-500 border-t border-r border-b border-slate-800 shadow-inner">
            <p className="text-xs md:text-sm text-slate-200 font-sans leading-relaxed">
              {story}
            </p>
          </div>
        </div>

        {/* 2. El Efecto en Cascada */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest font-mono flex items-center gap-2">
            <span>🔗</span>
            Cadena de Causa y Efecto (Efecto Cascada)
          </h3>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2.5 font-mono text-xs">
            {cascade.map((step: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-950 border border-purple-700 text-purple-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-300 leading-snug">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Boletín de Noticias Globales */}
        {newsList.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-neoterra-gold uppercase tracking-widest font-mono flex items-center gap-2">
              <span>📰</span>
              Titulares de Prensa Global
            </h3>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {newsList.slice(0, 2).map((news: any, idx: number) => (
                <div key={idx} className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-xs">
                  <div className="font-bold text-amber-300 mb-0.5 font-orbitron">{news.headline}</div>
                  <div className="text-slate-400 text-[11px] leading-tight">{news.body}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aviso de Espera de Siguiente Ciclo */}
        <div className="pt-2 flex flex-col items-center justify-center text-center space-y-2 border-t border-slate-800 pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950/80 rounded-xl border border-cyan-800/60 font-mono text-xs text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Esperando que el docente inicie la siguiente ronda...
          </div>
          <p className="text-[11px] text-gray-500 font-mono">
            El nuevo dilema estratégico se abrirá automáticamente en tu pantalla.
          </p>
        </div>
      </div>
    </div>
  );
}
