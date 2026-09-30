'use client';

import React, { useState } from 'react';
import { Check, ArrowRight, ShieldCheck, Cpu, Leaf, Users, Shield } from 'lucide-react';

interface DecisionPanelProps {
  roundNumber?: number;
  scenario?: any;
  onSubmit: (decision: any) => void;
  submitting?: boolean;
}

export default function DecisionPanel({
  roundNumber = 1,
  scenario,
  onSubmit,
  submitting = false,
}: DecisionPanelProps) {
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C'>('B');
  const [investmentFocus, setInvestmentFocus] = useState<'tech' | 'green' | 'social' | 'cyber'>('tech');

  const currentYear = 2043 + roundNumber * 2;
  const title = scenario?.title || `Ronda ${roundNumber}: Dilema Estratégico Global`;
  const context = scenario?.context || 'El mercado tecnológico global de Neo-Terra enfrenta una reconfiguración de capital y recursos.';
  const question = scenario?.dilemmaQuestion || '¿Qué directiva estratégica adoptará tu corporación?';

  const defaultOptions = [
    {
      id: 'A' as const,
      name: 'Opción A: Reducción Agresiva de Costos',
      badge: 'Bajo Costo',
      badgeColor: 'terracotta',
      preview: 'Máximo margen de ganancias a corto plazo mediante procesos intensivos.',
      narrativeRisk: 'Riesgo alto de sanciones ambientales y reclamos laborales.',
    },
    {
      id: 'B' as const,
      name: 'Opción B: Estrategia Certificada y Equilibrada',
      badge: 'Costo Equilibrado',
      badgeColor: 'moss',
      preview: 'Cumplimiento normativo estricto y estándares de mercado verificados.',
      narrativeRisk: 'Margen financiero moderado pero estabilidad reputacional comprobada.',
    },
    {
      id: 'C' as const,
      name: 'Opción C: Liderazgo Sostenible de Vanguardia',
      badge: 'Inversión Premium',
      badgeColor: 'moss-dark',
      preview: 'Tecnología limpia, economía circular y gobernanza ética absoluta.',
      narrativeRisk: 'Alto desembolso de capital inicial con retorno a mediano plazo.',
    },
  ];

  const options = scenario?.options || defaultOptions;

  const defaultFocusOptions = [
    { id: 'tech' as const, label: 'I+D e Inteligencia Artificial', desc: 'Sube Nivel Tecnológico', icon: Cpu },
    { id: 'green' as const, label: 'Transición Ecológica', desc: 'Reduce Huella Ambiental', icon: Leaf },
    { id: 'social' as const, label: 'Salarios y Bienestar', desc: 'Mejora Relaciones Laborales', icon: Users },
    { id: 'cyber' as const, label: 'Ciberseguridad de Datos', desc: 'Protección ante Sabotajes', icon: Shield },
  ];

  const focusOptions = scenario?.investmentFocusOptions || defaultFocusOptions;

  const handleSubmit = () => {
    onSubmit({
      dilemmaChoice: selectedOption,
      investmentFocus: investmentFocus,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 font-sans">
      
      {/* Cabecera Narrativa de la Ronda */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-sand-border shadow-paper">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[11px] font-mono uppercase bg-sand-100 text-ink-muted border border-sand-border px-3 py-0.5 rounded font-semibold">
            AÑO {scenario?.year || currentYear} // CICLO {roundNumber}
          </span>
          <span className="text-xs font-mono text-moss font-medium">
            Toma de Decisiones
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif text-ink font-normal tracking-tight mb-3">
          {title}
        </h2>

        <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-light mb-6">
          {context}
        </p>

        <div className="pt-4 border-t border-sand-border">
          <p className="text-xs uppercase tracking-wider font-semibold text-moss">
            {question}
          </p>
        </div>
      </div>

      {/* 1. Selección del Dilema */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider font-mono">
            1. Selecciona tu Directiva Operativa
          </h3>
          <span className="text-[11px] font-mono text-ink-faint">
            Elige una opción (A, B o C)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {options.map((opt: any) => {
            const isSelected = selectedOption === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedOption(opt.id)}
                className={`p-5 rounded-lg border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-moss bg-moss-soft/30 shadow-subtle'
                    : 'border-sand-border bg-white hover:border-sand-400'
                }`}
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      isSelected ? 'bg-moss text-paper' : 'bg-sand-100 text-ink-muted border border-sand-border'
                    }`}>
                      {opt.id}
                    </span>
                    <h4 className="text-base font-medium text-ink">
                      {opt.name}
                    </h4>
                  </div>

                  <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded border shrink-0 ${
                    opt.badgeColor === 'terracotta'
                      ? 'bg-terracotta-soft text-terracotta border-terracotta/30'
                      : 'bg-sand-100 text-moss border-sand-border'
                  }`}>
                    {opt.badge}
                  </span>
                </div>

                <p className="text-xs text-ink-muted leading-relaxed pl-7 font-light">
                  {opt.preview}
                </p>

                {opt.narrativeRisk && (
                  <p className="text-[11px] text-terracotta font-mono mt-2 pl-7">
                    ⚠️ {opt.narrativeRisk}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Enfoque Prioritario de Inversión */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider font-mono">
            2. Enfoque Prioritario de Inversión
          </h3>
          <span className="text-[11px] font-mono text-ink-faint">
            Destino del presupuesto complementario
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {focusOptions.map((f: any) => {
            const isSelected = investmentFocus === f.id;
            const IconComponent = f.icon || ShieldCheck;
            return (
              <div
                key={f.id}
                onClick={() => setInvestmentFocus(f.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-moss bg-moss-soft/30 shadow-subtle'
                    : 'border-sand-border bg-white hover:border-sand-400'
                }`}
              >
                <div className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-moss bg-moss text-paper' : 'border-sand-border bg-sand-50 text-ink-muted'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-ink">
                    {f.label}
                  </div>
                  <div className="text-[11px] text-ink-muted mt-0.5 font-light">
                    {f.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botón de Confirmación */}
      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-moss hover:bg-moss-light disabled:opacity-40 text-paper font-medium py-4 px-6 rounded transition-all duration-200 border border-moss-dark flex items-center justify-center gap-2 text-xs uppercase tracking-wider active:scale-[0.99] shadow-subtle"
        >
          {submitting ? (
            <span>Registrando directiva en el nodo central...</span>
          ) : (
            <>
              <span>Transmitir Directiva Corporativa</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-ink-faint font-mono mt-2">
          Una vez transmitida, la decisión queda asentada en el libro mayor hasta el cierre de ronda.
        </p>
      </div>

    </div>
  );
}
