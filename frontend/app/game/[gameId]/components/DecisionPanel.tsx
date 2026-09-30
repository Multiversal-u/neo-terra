'use client';
import React, { useState } from 'react';

interface DecisionPanelProps {
  roundNumber?: number;
  onSubmit: (decision: any) => void;
  submitting?: boolean;
}

export default function DecisionPanel({ roundNumber = 1, onSubmit, submitting = false }: DecisionPanelProps) {
  // Proveedor seleccionado: A, B o C
  const [selectedSupplier, setSelectedSupplier] = useState<'A' | 'B' | 'C'>('B');

  // Inversiones (Presupuesto total disponible por ciclo: $500,000)
  const TOTAL_BUDGET = 500000;
  const [investments, setInvestments] = useState({
    rd: 100000,
    social: 80000,
    environmental: 80000,
    cybersecurity: 80000,
    marketing: 80000,
    logistics: 80000,
  });

  // Estrategia de precios
  const [pricingStrategy, setPricingStrategy] = useState<'aggressive' | 'balanced' | 'premium'>('balanced');

  // Expansión regional
  const [expansionTarget, setExpansionTarget] = useState<string | null>(null);

  const totalSpent = Object.values(investments).reduce((a, b) => a + b, 0);
  const budgetRemaining = TOTAL_BUDGET - totalSpent;

  const handleInvestmentChange = (field: keyof typeof investments, val: number) => {
    setInvestments((prev) => ({
      ...prev,
      [field]: Math.max(0, val),
    }));
  };

  const handleSubmit = () => {
    if (totalSpent > TOTAL_BUDGET) {
      alert(`Has superado el presupuesto disponible de $${TOTAL_BUDGET.toLocaleString()}. Ajusta tus inversiones.`);
      return;
    }

    const decisionPayload = {
      supplier: selectedSupplier,
      investment: investments,
      pricingStrategy,
      expansionTarget,
    };

    onSubmit(decisionPayload);
  };

  const suppliers = [
    {
      id: 'A' as const,
      name: 'Proveedor A: GlobalFast Mfg.',
      badge: 'Costo Bajo',
      badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
      speed: '48h (Inmediata)',
      quality: '3/10',
      desc: 'Producción masiva de alta velocidad. Máximo ahorro a corto plazo.',
    },
    {
      id: 'B' as const,
      name: 'Proveedor B: CertifiedGlobal',
      badge: 'Costo Equilibrado',
      badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
      speed: '7 a 10 días',
      quality: '7/10',
      desc: 'Cadena de suministro con sellos ISO 9001 y Comercio Justo.',
    },
    {
      id: 'C' as const,
      name: 'Proveedor C: NeoTech Sustainable',
      badge: 'Costo Alto (Premium)',
      badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
      speed: '5 días',
      quality: '10/10',
      desc: 'Plantas 100% limpias, robótica avanzada y certificación B-Corp.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-16 font-inter">
      {/* Cabecera de la Ronda */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/80 p-5 rounded-2xl border border-cyan-800/50 backdrop-blur-md shadow-lg gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-0.5 rounded font-bold">
            CICLO DE DECISIONES // 2045
          </span>
          <h2 className="text-2xl font-black font-orbitron text-white tracking-wide uppercase mt-1">
            Ronda {roundNumber}: Directivas Estratégicas
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Tus decisiones moldearán el mercado global y el destino de Neo-Terra.
          </p>
        </div>
      </div>

      {/* 1. Selección de Proveedor */}
      <section className="space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full" />
            1. Selección de Cadena de Suministro
          </h3>
          <span className="text-xs text-slate-400 font-mono italic">
            *Algunos atributos son confidenciales
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suppliers.map((s) => {
            const isSelected = selectedSupplier === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedSupplier(s.id)}
                className={`border p-4 rounded-xl cursor-pointer transition-all relative ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${s.badgeColor}`}>
                    {s.badge}
                  </span>
                  {isSelected && (
                    <span className="text-xs text-cyan-400 font-mono font-bold">✓ ELEGIDO</span>
                  )}
                </div>

                <h4 className={`font-bold text-base mb-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {s.name}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{s.desc}</p>

                <div className="space-y-1 font-mono text-[11px] pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Entrega:</span>
                    <span className="text-slate-300 font-bold">{s.speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Calidad:</span>
                    <span className="text-slate-300 font-bold">{s.quality}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Asignación de Presupuesto ($500k) */}
      <section className="space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full" />
            2. Presupuesto de Inversión por Ciclo ($500,000)
          </h3>
          <span
            className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${
              budgetRemaining >= 0
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
            }`}
          >
            Disponible: ${budgetRemaining.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: 'rd' as const, label: 'I+D e Inteligencia Artificial', desc: 'Sube Nivel Tecnológico' },
            { key: 'social' as const, label: 'Impacto Social y Salarios', desc: 'Mejora Relación Laboral' },
            { key: 'environmental' as const, label: 'Transición Ecológica', desc: 'Reduce Huella Ambiental' },
            { key: 'cybersecurity' as const, label: 'Ciberseguridad y Datos', desc: 'Protección contra Ataques' },
            { key: 'marketing' as const, label: 'Marketing y Consumo', desc: 'Aumenta Cuota de Mercado' },
            { key: 'logistics' as const, label: 'Capacidad Logística', desc: 'Expansión de Rutas' },
          ].map((item) => (
            <div key={item.key} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 block">{item.label}</span>
                <span className="text-[10px] text-slate-500 font-mono block mb-2">{item.desc}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">$</span>
                <input
                  type="number"
                  step="10000"
                  min="0"
                  max="500000"
                  value={investments[item.key]}
                  onChange={(e) => handleInvestmentChange(item.key, Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Estrategia de Precios */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full" />
          3. Estrategia de Mercado y Fijación de Precios
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'aggressive' as const, label: 'Agresiva', desc: 'Precios bajos. Gran volumen, pero erosiona reputación.' },
            { id: 'balanced' as const, label: 'Equilibrada', desc: 'Margen estándar y estabilidad de mercado.' },
            { id: 'premium' as const, label: 'Premium Sostenible', desc: 'Precios altos. Atrae consumidores conscientes.' },
          ].map((strat) => (
            <label
              key={strat.id}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                pricingStrategy === strat.id
                  ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="pricing"
                  checked={pricingStrategy === strat.id}
                  onChange={() => setPricingStrategy(strat.id)}
                  className="w-4 h-4 text-cyan-500 bg-slate-950 border-slate-700"
                />
                <span className="font-bold text-sm text-white font-mono uppercase">{strat.label}</span>
              </div>
              <p className="text-xs text-slate-400">{strat.desc}</p>
            </label>
          ))}
        </div>
      </section>

      {/* 4. Expansión Geográfica */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-400 rounded-full" />
          4. Expansión Internacional Opcional (Costo: $120,000)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: null, label: 'Ninguna' },
            { id: 'asia', label: 'Asia-Pacífico' },
            { id: 'europe', label: 'Europa' },
            { id: 'americas', label: 'América' },
            { id: 'africa', label: 'África' },
          ].map((region) => (
            <button
              key={region.label}
              type="button"
              onClick={() => setExpansionTarget(region.id)}
              className={`p-3 rounded-lg border text-xs font-mono font-bold transition-all text-center ${
                expansionTarget === region.id
                  ? 'bg-amber-950/60 border-amber-400 text-amber-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>
      </section>

      {/* Botón de Envío */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || budgetRemaining < 0}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-10 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] disabled:opacity-40 disabled:cursor-not-allowed transition-all uppercase tracking-widest font-mono text-base active:scale-95 border border-cyan-400 w-full sm:w-auto"
        >
          {submitting ? 'Transmitiendo Decisiones...' : '🚀 CONFIRMAR DIRECTIVAS'}
        </button>
      </div>
    </div>
  );
}
