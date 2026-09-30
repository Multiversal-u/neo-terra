'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  ArrowLeft, 
  ShieldCheck, 
  Leaf, 
  Globe2, 
  Cpu, 
  Scale, 
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const ARCHETYPE_META: Record<string, { label: string; icon: string; badgeClass: string; desc: string }> = {
  LiderSustentable: {
    label: 'Líder Sustentable',
    icon: '🌿',
    badgeClass: 'bg-moss-soft text-moss-dark border-moss/30',
    desc: 'Mínima huella ambiental, máxima reputación y cumplimiento normativo ejemplar.',
  },
  InnovadorResponsable: {
    label: 'Innovador Responsable',
    icon: '💡',
    badgeClass: 'bg-sand-100 text-ink border-sand-border',
    desc: 'Alta inversión en I+D tecnológico alineada con rigurosos estándares ESG y bioética.',
  },
  ModeloESG: {
    label: 'Modelo ESG Triple A',
    icon: '⚖️',
    badgeClass: 'bg-moss-soft text-moss border-moss/30',
    desc: 'Prioridad absoluta a proveedores certificados, comercio justo y transparencia de datos.',
  },
  ImperioCoporativo: {
    label: 'Imperio Corporativo',
    icon: '🏛️',
    badgeClass: 'bg-sand-200 text-ink-muted border-sand-border',
    desc: 'Dominio masivo de capital y cuota de mercado con economías de escala globales.',
  },
  PotenciaTecnologica: {
    label: 'Potencia Tecnológica',
    icon: '⚡',
    badgeClass: 'bg-sand-100 text-moss-dark border-sand-border',
    desc: 'Vanguardia absoluta en IA, automatización y ciberdefensa cuántica.',
  },
  GiganteDisruptivo: {
    label: 'Gigante Disruptivo',
    icon: '🚀',
    badgeClass: 'bg-sand-100 text-ink border-sand-border',
    desc: 'Crecimiento dinámico y captura de mercado basada en plataformas disruptivas.',
  },
  CorporacionExtractiva: {
    label: 'Corporación Extractiva',
    icon: '🏭',
    badgeClass: 'bg-terracotta-soft text-terracotta border-terracotta/30',
    desc: 'Márgenes de rentabilidad a corto plazo con severo riesgo de sanciones y huella ecológica.',
  },
  EmpresaEnCrisis: {
    label: 'Empresa en Crisis',
    icon: '⚠️',
    badgeClass: 'bg-terracotta-soft text-terracotta-dark border-terracotta/40',
    desc: 'Descapitalización crítica o daño reputacional grave tras colapsos regulatorios.',
  },
  SobrevivienteMercado: {
    label: 'Sobreviviente de Mercado',
    icon: '🛡️',
    badgeClass: 'bg-sand-100 text-ink-muted border-sand-border',
    desc: 'Estrategia balanceada y resiliente ante las presiones inflacionarias y climáticas de 2045.',
  },
};

export default function EndGamePage({ params }: { params: { gameId: string } }) {
  const [gameState, setGameState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://neo-terra-backend.onrender.com';
  const gameId = params.gameId.toUpperCase();

  const fetchResults = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/game/${gameId}`);
      if (res.ok) {
        const data = await res.json();
        setGameState(data.state);
      }
    } catch (err) {
      console.error('Error recuperando resultados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 4000);
    return () => clearInterval(interval);
  }, [backendUrl, gameId]);

  const calculateScore = (comp: any) => {
    if (comp.compositeScore !== undefined && comp.compositeScore !== null) {
      return comp.compositeScore;
    }
    const capital = comp.capital || 0;
    const esg = comp.esgIndex || 0;
    const rep = comp.reputation || 0;
    const share = comp.marketShare || 0;
    const tech = comp.techLevel || 0;
    const footprint = comp.environmentalFootprint || 0;

    let score = (capital / 500) + (esg * 25) + (rep * 20) + (share * 100) + (tech * 10);
    if (rep < 20) score -= 1500;
    if (footprint > 75) score -= 1000;
    return Math.max(0, Math.round(score));
  };

  const companies = [...(gameState?.companies || [])].sort((a, b) => calculateScore(b) - calculateScore(a));
  const world = gameState?.globalWorld;

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-moss-soft selection:text-moss-dark p-6 sm:p-12">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Barra Superior */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-sand-border gap-4">
          <Link href={`/dashboard/${gameId}`} className="text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Tablero de Sala</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchResults}
              className="text-xs font-mono uppercase text-ink-muted hover:text-ink border border-sand-border bg-white px-3 py-1.5 rounded transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Actualizar Dictamen</span>
            </button>
            <span className="text-xs font-mono text-moss bg-moss-soft px-3 py-1.5 rounded border border-moss/20">
              SALA: {gameId}
            </span>
          </div>
        </div>

        {/* Título de la Ceremonia de Cierre */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-moss font-semibold block">
            DICTAMEN FINAL DE GOBERNANZA SISTÉMICA // 2045
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink font-normal tracking-tight">
            Podio de Resultados & Arquetipos
          </h1>
          <p className="text-base sm:text-lg text-ink-muted font-light leading-relaxed">
            Evaluación ponderada entre solvencia financiera, mitigación de la huella ecológica y conducta ética en las cadenas de suministro internacionales.
          </p>
        </div>

        {/* Podio Top 3 */}
        {companies.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 max-w-4xl mx-auto">
            
            {/* 2do Lugar (Plata) */}
            <div className="bg-white border border-sand-border rounded-lg p-6 sm:p-8 text-center space-y-3 order-2 md:order-1 shadow-paper">
              <div className="font-serif text-2xl text-ink-muted">🥈</div>
              <div className="text-[10px] font-mono font-semibold text-ink-faint tracking-widest uppercase">
                2° LUGAR // SUBCAMPEÓN
              </div>
              <h3 className="text-xl font-serif text-ink font-normal truncate">
                {companies[1].name}
              </h3>
              <div className="text-2xl font-serif font-medium text-ink">
                ${((companies[1].capital || 1000000) / 1000000).toFixed(2)}M
              </div>
              <div className="inline-block text-xs font-mono font-semibold bg-sand-100 text-ink px-3 py-1 rounded border border-sand-border">
                {calculateScore(companies[1]).toLocaleString()} pts
              </div>
              <div className="text-xs font-mono text-ink-muted pt-2 border-t border-sand-border">
                ESG: <span className="font-bold text-moss">{companies[1].esgIndex}/100</span> • Rep:{' '}
                <span className="font-bold text-ink">{companies[1].reputation}/100</span>
              </div>
            </div>

            {/* 1er Lugar (Oro / Campeón) */}
            <div className="bg-white border-2 border-moss rounded-lg p-8 sm:p-10 text-center space-y-4 order-1 md:order-2 shadow-elevated relative md:-translate-y-4">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-moss text-paper text-[10px] font-mono font-bold px-3 py-0.5 rounded uppercase tracking-wider">
                CAMPEÓN GLOBAL
              </div>
              <div className="font-serif text-3xl text-moss">👑</div>
              <div className="text-[10px] font-mono font-bold text-moss tracking-widest uppercase">
                1° LUGAR // LIDERAZGO SISTÉMICO
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-ink font-normal truncate">
                {companies[0].name}
              </h3>
              <div className="text-3xl font-serif font-medium text-moss">
                ${((companies[0].capital || 1000000) / 1000000).toFixed(2)}M
              </div>
              <div className="inline-block text-xs font-mono font-bold bg-moss-soft text-moss-dark px-4 py-1.5 rounded border border-moss/30">
                ⭐ {calculateScore(companies[0]).toLocaleString()} pts
              </div>
              <div className="text-xs font-mono text-ink-muted pt-3 border-t border-sand-border">
                ESG: <span className="font-bold text-moss">{companies[0].esgIndex}/100</span> • Rep:{' '}
                <span className="font-bold text-ink">{companies[0].reputation}/100</span>
              </div>
            </div>

            {/* 3er Lugar (Bronce) */}
            <div className="bg-white border border-sand-border rounded-lg p-6 sm:p-8 text-center space-y-3 order-3 shadow-paper">
              <div className="font-serif text-2xl text-terracotta">🥉</div>
              <div className="text-[10px] font-mono font-semibold text-ink-faint tracking-widest uppercase">
                3° LUGAR // TERCER PUESTO
              </div>
              <h3 className="text-xl font-serif text-ink font-normal truncate">
                {companies[2].name}
              </h3>
              <div className="text-2xl font-serif font-medium text-ink">
                ${((companies[2].capital || 1000000) / 1000000).toFixed(2)}M
              </div>
              <div className="inline-block text-xs font-mono font-semibold bg-sand-100 text-ink px-3 py-1 rounded border border-sand-border">
                {calculateScore(companies[2]).toLocaleString()} pts
              </div>
              <div className="text-xs font-mono text-ink-muted pt-2 border-t border-sand-border">
                ESG: <span className="font-bold text-moss">{companies[2].esgIndex}/100</span> • Rep:{' '}
                <span className="font-bold text-ink">{companies[2].reputation}/100</span>
              </div>
            </div>

          </div>
        )}

        {/* Clasificación de Arquetipos Corporativos */}
        <div className="space-y-6">
          <div className="border-b border-sand-border pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-moss font-semibold block">
              TAXONOMÍA ÉTICA COMPLETA
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal tracking-tight mt-0.5">
              Clasificación de Arquetipos en Sala
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.length === 0 ? (
              <div className="col-span-full py-16 text-center text-ink-faint font-mono text-xs border border-dashed border-sand-border rounded p-6">
                {loading ? 'Compilando libro mayor corporativo...' : 'Aún no hay empresas registradas en esta sala.'}
              </div>
            ) : (
              companies.map((comp: any, idx: number) => {
                const archKey = comp.archetype || 'SobrevivienteMercado';
                const arch = ARCHETYPE_META[archKey] || ARCHETYPE_META.SobrevivienteMercado;

                return (
                  <div
                    key={comp.id || idx}
                    className="border border-sand-border bg-white p-6 rounded-lg shadow-paper flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-xs text-ink-faint">
                          #{idx + 1}
                        </span>
                        <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded border ${arch.badgeClass}`}>
                          {arch.icon} {arch.label}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl text-ink font-normal mb-1">
                        {comp.name}
                      </h3>

                      <p className="text-xs text-ink-muted leading-relaxed font-light mt-2">
                        {arch.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-sand-border grid grid-cols-2 gap-2 text-xs font-mono text-ink-muted">
                      <div>
                        Capital: <strong className="text-ink">${((comp.capital || 1000000) / 1000000).toFixed(2)}M</strong>
                      </div>
                      <div>
                        Índice ESG: <strong className="text-moss">{comp.esgIndex || 40}</strong>
                      </div>
                      <div>
                        Reputación: <strong className="text-ink">{comp.reputation || 50}</strong>
                      </div>
                      <div>
                        Huella: <strong className="text-terracotta">{comp.environmentalFootprint || 50}</strong>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Estado Final de la Biosfera */}
        {world && (
          <div className="border border-sand-border bg-sand-50/70 p-8 rounded-lg space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-moss font-semibold block">
              SALUD PLANETARIA AL HORIZONTE 2045
            </span>
            <h3 className="font-serif text-2xl text-ink font-normal">
              Balance Ecosistémico Acumulado
            </h3>
            <p className="text-sm text-ink-muted font-light leading-relaxed max-w-3xl">
              El comportamiento agregado de las corporaciones determinó el estado de habitabilidad global. La mitigación colectiva o la aceleración térmica marcan el legado que esta simulación deja a las generaciones venideras.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-sand-border text-center">
              <div className="bg-white p-4 rounded border border-sand-border">
                <span className="text-[10px] font-mono text-ink-faint uppercase block">Temp. Final</span>
                <span className="font-serif text-2xl text-terracotta">
                  {world.globalTemperature?.toFixed(1) || '1.5'}°C
                </span>
              </div>
              <div className="bg-white p-4 rounded border border-sand-border">
                <span className="text-[10px] font-mono text-ink-faint uppercase block">Estabilidad Eco.</span>
                <span className="font-serif text-2xl text-ink">
                  {Math.round(world.economicStability || 60)}/100
                </span>
              </div>
              <div className="bg-white p-4 rounded border border-sand-border">
                <span className="text-[10px] font-mono text-ink-faint uppercase block">Confianza</span>
                <span className="font-serif text-2xl text-moss">
                  {Math.round(world.consumerConfidence || 55)}/100
                </span>
              </div>
              <div className="bg-white p-4 rounded border border-sand-border">
                <span className="text-[10px] font-mono text-ink-faint uppercase block">Sostenibilidad</span>
                <span className="font-serif text-2xl text-moss">
                  {Math.round(world.sustainabilityIndex || 40)}/100
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
