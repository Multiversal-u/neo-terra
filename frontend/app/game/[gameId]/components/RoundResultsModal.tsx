'use client';
import React from 'react';

interface RoundResultsModalProps {
  onClose: () => void;
  results?: any;
}

export default function RoundResultsModal({ onClose, results }: RoundResultsModalProps) {
  const newsList = results?.newsItems || [];
  const eventsList = results?.triggeredEvents || [];

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 font-inter">
      <div className="bg-slate-900/95 border border-cyan-500/40 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(6,182,212,0.2)] animate-in zoom-in-95 fade-in duration-300 p-6 md:p-8 space-y-6">
        
        {/* Cabecera */}
        <div className="text-center space-y-2 border-b border-slate-800 pb-5">
          <div className="inline-block px-3 py-1 bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px] font-mono font-bold tracking-widest rounded-full mb-1">
            BOLETÍN DEL MERCADO // NEO-TERRA 2045
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-orbitron text-white uppercase tracking-wider">
            Ciclo Concluido
          </h2>
          <p className="text-slate-400 font-mono text-xs">
            Evaluación sistémica de las decisiones colectivas
          </p>
        </div>

        {/* Noticias y Eventos Globales Desencadenados */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            Noticias Globales de Impacto
          </h3>

          <div className="space-y-3">
            {newsList.length === 0 ? (
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
                Mercados estables. Las regulaciones internacionales monitorean los movimientos de capital sin anomalías mayores detectadas.
              </div>
            ) : (
              newsList.map((news: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 p-4 rounded-xl border-l-4 border-cyan-500 border-r border-t border-b border-slate-800"
                >
                  <h4 className="text-sm font-bold text-neoterra-gold font-orbitron mb-1">
                    {news.headline}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {news.body}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Explicación Pedagógica del Impacto */}
        <div className="bg-cyan-950/20 p-4 rounded-2xl border border-cyan-900/60 space-y-2">
          <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
            💡 Lección Sistémica de la Ronda
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Las decisiones corporativas no ocurren en el vacío. Los proveedores de bajo costo generan ahorro inmediato pero acumulan deuda de emisiones y riesgo laboral que tarde o temprano detonan investigaciones internacionales.
          </p>
        </div>

        {/* Botón de Continuar */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={onClose}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 px-12 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all uppercase tracking-widest font-mono text-sm active:scale-95 border border-cyan-400"
          >
            Comprendido • Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
