'use client';
import React, { useState } from 'react';

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
  // Opción del dilema elegida (A, B o C)
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C'>('B');

  // Enfoque prioritario de inversión
  const [investmentFocus, setInvestmentFocus] = useState<'tech' | 'green' | 'social' | 'cyber'>('tech');

  // Valores de respaldo si el escenario aún no ha cargado
  const currentYear = 2043 + roundNumber * 2;
  const title = scenario?.title || `Ronda ${roundNumber}: Dilema Estratégico Global`;
  const context = scenario?.context || 'El mercado tecnológico global de Neo-Terra enfrenta una reconfiguración de capital y recursos.';
  const question = scenario?.dilemmaQuestion || '¿Qué directiva estratégica adoptará tu corporación?';

  const defaultOptions = [
    {
      id: 'A' as const,
      name: 'Opción A: Reducción Agresiva de Costos',
      badge: 'Bajo Costo',
      badgeColor: 'amber',
      preview: 'Máximo margen de ganancias a corto plazo mediante procesos intensivos.',
      narrativeRisk: 'Riesgo alto de sanciones ambientales y reclamos laborales.',
    },
    {
      id: 'B' as const,
      name: 'Opción B: Estrategia Certificada y Equilibrada',
      badge: 'Costo Equilibrado',
      badgeColor: 'cyan',
      preview: 'Cumplimiento normativo estricto y estándares de mercado verificados.',
      narrativeRisk: 'Margen financiero moderado pero estabilidad reputacional comprobada.',
    },
    {
      id: 'C' as const,
      name: 'Opción C: Liderazgo Sostenible de Vanguardia',
      badge: 'Inversión Premium',
      badgeColor: 'emerald',
      preview: 'Tecnología limpia, economía circular y gobernanza ética absoluta.',
      narrativeRisk: 'Alto desembolso de capital inicial con retorno a mediano plazo.',
    },
  ];

  const options = scenario?.options || defaultOptions;

  const defaultFocusOptions = [
    { id: 'tech' as const, label: '💻 I+D e Inteligencia Artificial', desc: 'Sube Nivel Tecnológico' },
    { id: 'green' as const, label: '🌱 Transición Ecológica', desc: 'Reduce Huella Ambiental' },
    { id: 'social' as const, label: '👥 Salarios y Bienestar', desc: 'Mejora Relaciones Laborales' },
    { id: 'cyber' as const, label: '🛡️ Ciberseguridad de Datos', desc: 'Inmunidad ante Ataques' },
  ];

  const focusOptions = scenario?.investmentFocusOptions || defaultFocusOptions;

  const handleSubmit = () => {
    onSubmit({
      dilemmaChoice: selectedOption,
      investmentFocus: investmentFocus,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16 font-inter">
      {/* Cabecera Narrativa de la Ronda */}
      <div className="bg-slate-900/90 p-5 md:p-6 rounded-2xl border border-cyan-800/50 backdrop-blur-md shadow-xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-0.5 rounded-full font-bold">
            AÑO {scenario?.year || currentYear} // CICLO {roundNumber}
          </span>
          <span className="text-xs font-mono text-neoterra-gold font-bold">
            Neo-Terra 2045
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-black font-orbitron text-white tracking-wide mt-1 mb-2">
          {title}
        </h2>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans border-l-2 border-cyan-500 pl-3 py-1 bg-cyan-950/20 rounded-r-lg">
          {context}
        </p>
      </div>

      {/* 1. Dilema Central: Las 3 Rutas Estratégicas */}
      <section className="space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" />
            1. {question}
          </h3>
          <span className="text-[10px] text-gray-400 font-mono italic">Selecciona 1 opción</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {options.map((opt: any) => {
            const isSelected = selectedOption === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedOption(opt.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all border relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-bold text-sm md:text-base text-white font-orbitron">
                      {opt.name}
                    </span>
                    {isSelected ? (
                      <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-950 border border-cyan-700 px-2 py-0.5 rounded">
                        ✓ SELECCIONADO
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-gray-400 border border-slate-800 px-2 py-0.5 rounded">
                        {opt.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-200 font-sans leading-relaxed mb-2">
                    {opt.preview}
                  </p>
                </div>

                <div className="text-[11px] font-mono text-amber-300/90 bg-black/40 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span><strong>Consecuencia prevista:</strong> {opt.narrativeRisk}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Enfoque de Inversión Primario */}
      <section className="space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-purple-400 rounded-full" />
            2. Prioridad de Presupuesto ($500,000)
          </h3>
          <span className="text-[10px] text-gray-400 font-mono">¿Dónde enfocarás tu capital?</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {focusOptions.map((f: any) => {
            const isSelected = investmentFocus === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setInvestmentFocus(f.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-950/60 border-purple-400 ring-1 ring-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="font-bold text-xs font-mono block mb-1">
                  {f.label}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {f.desc}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Botón de Confirmación */}
      <div className="pt-2">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-6 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] disabled:opacity-50 transition-all uppercase tracking-widest font-mono text-sm active:scale-95 border border-cyan-400 flex items-center justify-center gap-2"
        >
          {submitting ? 'Transmitiendo Directiva...' : '🚀 CONFIRMAR DIRECTIVA ESTRATÉGICA'}
        </button>
      </div>
    </div>
  );
}
