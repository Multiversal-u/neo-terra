'use client';

import React from 'react';
import { Newspaper, ArrowRight, ShieldCheck, GitFork } from 'lucide-react';

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
    'Directiva estratégica implementada en la cadena de suministro',
    'Reacción de competidores en mercados transfronterizos',
    'Ajuste en la demanda de los consumidores según índice ESG',
    'Resultado financiero y balance de reputación consolidado',
  ];
  const newsList = results?.newsItems || [];

  return (
    <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in-up">
      <div className="bg-white border border-sand-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-elevated p-6 sm:p-8 space-y-6">
        
        {/* Cabecera de la Crónica */}
        <div className="text-center space-y-1.5 border-b border-sand-border pb-5">
          <div className="inline-block px-3 py-0.5 bg-sand-100 border border-sand-border text-ink-muted text-[10px] font-mono font-bold tracking-widest rounded uppercase">
            INFORME DE INTELIGENCIA CORPORATIVA // CICLO {narrative?.round || 1}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-ink font-normal tracking-tight">
            Crónica de Consecuencias
          </h2>
          <p className="text-xs font-mono text-ink-muted">
            Dictamen sistémico para <strong className="text-ink">{companyName || 'tu empresa'}</strong>
          </p>
        </div>

        {/* 1. La Narrativa Personalizada de tu Empresa */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-moss uppercase tracking-wider font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-moss" />
            <span>Impacto Directo de tu Elección ({narrative?.chosenOptionName || 'Directiva'})</span>
          </h3>

          <div className="bg-sand-50 p-5 rounded border-l-2 border-moss border border-sand-border">
            <p className="text-sm text-ink-muted leading-relaxed font-light">
              {story}
            </p>
          </div>
        </div>

        {/* 2. El Efecto en Cascada */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider font-mono flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 text-moss" />
            <span>Cadena de Causa y Efecto Sistémica</span>
          </h3>

          <div className="bg-stone-50 p-4 rounded border border-sand-border space-y-2.5 font-sans text-xs">
            {cascade.map((step: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded bg-sand-200 text-ink text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-ink-muted leading-relaxed font-light">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Noticias Globales del Ciclo */}
        {newsList.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Newspaper className="w-3.5 h-3.5 text-moss" />
              <span>Titulares del Mercado Internacional</span>
            </h3>

            <div className="space-y-2">
              {newsList.slice(0, 3).map((news: any, idx: number) => (
                <div key={idx} className="p-3 bg-sand-50 rounded border border-sand-border text-xs">
                  <div className="font-semibold text-ink font-sans">
                    {news.headline || news}
                  </div>
                  {news.body && (
                    <p className="text-[11px] text-ink-muted mt-1 font-light leading-relaxed">
                      {news.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón de Continuación */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full bg-moss hover:bg-moss-light text-paper font-medium py-3.5 px-6 rounded transition-all duration-200 border border-moss-dark flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
          >
            <span>Entendido • Continuar al Siguiente Ciclo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
