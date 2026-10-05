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
  ExternalLink,
  Sparkles,
  ChevronRight,
  Eye,
  BookOpen,
  HelpCircle,
  Award,
  Layers,
  X
} from 'lucide-react';
import { ARCHETYPE_CATALOG, getArchetypeMeta, ArchetypeDetail } from '@/lib/archetypes';

export default function EndGamePage({ params }: { params: { gameId: string } }) {
  const [gameState, setGameState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'podium' | 'detailed' | 'archetypes'>('podium');
  const [podiumStep, setPodiumStep] = useState<number>(1); // 1 = reveal 3rd, 2 = reveal 2nd, 3 = reveal 1st
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeDetail | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

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

  const rawCompanies = [...(gameState?.companies || [])];
  const companies = rawCompanies.sort((a, b) => calculateScore(b) - calculateScore(a));
  const world = gameState?.globalWorld;

  const firstPlace = companies[0] || null;
  const secondPlace = companies[1] || null;
  const thirdPlace = companies[2] || null;
  const runnerUps = companies.slice(3);

  const handleOpenArchetype = (archKey: string, comp?: any) => {
    setSelectedArchetype(getArchetypeMeta(archKey));
    setSelectedCompany(comp || null);
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-moss-soft selection:text-moss-dark p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Barra Superior */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-sand-border gap-4">
          <Link 
            href={`/dashboard/${gameId}`} 
            className="text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Tablero de Sala</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={fetchResults}
              className="text-xs font-mono uppercase text-ink-muted hover:text-ink border border-sand-border bg-white px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 shadow-subtle"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Actualizar</span>
            </button>
            <span className="text-xs font-mono text-moss bg-moss-soft px-3 py-1.5 rounded border border-moss/20">
              SALA: {gameId}
            </span>
          </div>
        </div>

        {/* Selector de Vistas / Pestañas */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1 bg-sand-100 rounded-lg border border-sand-border font-mono text-xs">
            <button
              onClick={() => setActiveTab('podium')}
              className={`px-4 sm:px-6 py-2 rounded font-medium flex items-center gap-2 transition-all ${
                activeTab === 'podium'
                  ? 'bg-white text-ink shadow-subtle border border-sand-border'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-moss" />
              <span>Podio Ceremonial (Estilo Kahoot)</span>
            </button>
            <button
              onClick={() => setActiveTab('detailed')}
              className={`px-4 sm:px-6 py-2 rounded font-medium flex items-center gap-2 transition-all ${
                activeTab === 'detailed'
                  ? 'bg-white text-ink shadow-subtle border border-sand-border'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-moss" />
              <span>Dictamen Completo & Arquetipos</span>
            </button>
            <button
              onClick={() => setActiveTab('archetypes')}
              className={`px-4 sm:px-6 py-2 rounded font-medium flex items-center gap-2 transition-all ${
                activeTab === 'archetypes'
                  ? 'bg-white text-ink shadow-subtle border border-sand-border'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-moss" />
              <span>Glosario de Arquetipos</span>
            </button>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* VISTA 1: PODIO CEREMONIAL ESTILO KAHOOT                               */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'podium' && (
          <div className="space-y-12 animate-fade-in-up">
            
            {/* Cabecera Ceremonial */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-moss font-semibold block">
                CEREMONIA DE GOBERNANZA SISTÉMICA // HORIZONTE 2045
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal tracking-tight">
                El Podio de Neo-Terra
              </h1>
              <p className="text-sm sm:text-base text-ink-muted font-light leading-relaxed">
                Descubre qué corporaciones alcanzaron el liderazgo conjugando rentabilidad, ética ambiental y protección social.
              </p>

              {/* Controles de Revelación Progresiva */}
              <div className="pt-3 flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={() => setPodiumStep(prev => Math.min(3, prev + 1))}
                  disabled={podiumStep >= 3}
                  className="bg-moss hover:bg-moss-light disabled:opacity-40 text-paper font-medium px-5 py-2.5 rounded text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shadow-subtle"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {podiumStep === 1 && 'Revelar 2° Lugar (Plata)'}
                    {podiumStep === 2 && '¡Revelar Campeón 1° Lugar (Oro)!'}
                    {podiumStep >= 3 && 'Ceremonia Completa'}
                  </span>
                </button>
                <button
                  onClick={() => setPodiumStep(3)}
                  className="bg-sand-100 hover:bg-white text-ink border border-sand-border px-4 py-2.5 rounded text-xs font-mono uppercase tracking-wider transition-all"
                >
                  Revelar Todo
                </button>
                <button
                  onClick={() => setPodiumStep(1)}
                  className="text-xs font-mono text-ink-faint hover:text-ink px-2 py-1"
                >
                  Reiniciar
                </button>
              </div>
            </div>

            {/* Estructura del Podio de 3 Pedestales */}
            {companies.length === 0 ? (
              <div className="py-20 text-center text-ink-faint font-mono text-xs border border-dashed border-sand-border rounded p-6">
                {loading ? 'Sincronizando libro mayor de la sala...' : 'Aún no hay empresas registradas para esta sala.'}
              </div>
            ) : (
              <div className="relative pt-12 pb-6">
                
                {/* Contenedor Flex de los 3 Pedestales (Orden: 2do, 1ero, 3ero) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto">
                  
                  {/* ─────────────────────────────────────────────────────────── */}
                  {/* 2° LUGAR (Plata) — Columna Izquierda                         */}
                  {/* ─────────────────────────────────────────────────────────── */}
                  <div className="order-2 md:order-1 flex flex-col items-center">
                    {secondPlace && podiumStep >= 2 ? (
                      <div className="w-full space-y-3 text-center animate-fade-in-up">
                        {/* Carta del Consorcio */}
                        <div className="bg-white border border-sand-border rounded-lg p-5 shadow-paper space-y-2">
                          <div className="text-3xl">🥈</div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-faint block">
                            2° LUGAR // SUBCAMPEÓN
                          </span>
                          <h3 className="font-serif text-xl sm:text-2xl text-ink font-normal truncate">
                            {secondPlace.name}
                          </h3>
                          <div className="font-serif text-xl text-ink">
                            ${((secondPlace.capital || 1000000) / 1000000).toFixed(2)}M
                          </div>
                          <div className="inline-block text-xs font-mono font-semibold bg-sand-100 text-ink px-3 py-1 rounded border border-sand-border">
                            {calculateScore(secondPlace).toLocaleString()} pts
                          </div>
                          
                          {/* Arquetipo */}
                          <div className="pt-2 border-t border-sand-border">
                            <button
                              onClick={() => handleOpenArchetype(secondPlace.archetype || 'SobrevivienteMercado', secondPlace)}
                              className="text-xs font-mono text-moss hover:underline flex items-center justify-center gap-1 mx-auto"
                            >
                              <span>{getArchetypeMeta(secondPlace.archetype || 'SobrevivienteMercado').icon}</span>
                              <span className="font-semibold">{getArchetypeMeta(secondPlace.archetype || 'SobrevivienteMercado').label}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Pedestal Físico */}
                        <div className="w-full h-36 bg-gradient-to-t from-sand-200 to-sand-100 border border-sand-border rounded-t-lg flex flex-col items-center justify-center shadow-subtle">
                          <span className="font-serif text-5xl text-sand-500 font-bold opacity-40">2</span>
                          <span className="text-[10px] font-mono tracking-widest uppercase text-ink-muted">PLATA</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-56 border-2 border-dashed border-sand-border rounded-lg flex flex-col items-center justify-center text-center p-6 text-ink-faint">
                        <span className="text-2xl mb-2">🥈</span>
                        <span className="text-xs font-mono uppercase">2° Lugar</span>
                        <span className="text-[11px] text-ink-faint font-mono mt-1">Por revelar...</span>
                      </div>
                    )}
                  </div>

                  {/* ─────────────────────────────────────────────────────────── */}
                  {/* 1° LUGAR (Oro / Campeón) — Columna Central                   */}
                  {/* ─────────────────────────────────────────────────────────── */}
                  <div className="order-1 md:order-2 flex flex-col items-center">
                    {firstPlace && podiumStep >= 3 ? (
                      <div className="w-full space-y-3 text-center animate-fade-in-up relative md:-translate-y-4">
                        
                        {/* Insignia de Coronación */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-moss text-paper text-[10px] font-mono font-bold px-4 py-1 rounded-full uppercase tracking-widest border border-moss-dark shadow-elevated flex items-center gap-1.5">
                          <span>👑</span>
                          <span>CAMPEÓN GLOBAL</span>
                        </div>

                        {/* Carta del Campeón */}
                        <div className="bg-white border-2 border-moss rounded-lg p-6 sm:p-7 shadow-elevated space-y-3 relative">
                          <div className="text-4xl pt-1">👑</div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-moss block">
                            1° LUGAR // LIDERAZGO SISTÉMICO
                          </span>
                          <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal truncate">
                            {firstPlace.name}
                          </h3>
                          <div className="font-serif text-3xl text-moss font-medium">
                            ${((firstPlace.capital || 1000000) / 1000000).toFixed(2)}M
                          </div>
                          <div className="inline-block text-xs font-mono font-bold bg-moss-soft text-moss-dark px-4 py-1.5 rounded border border-moss/30 shadow-subtle">
                            ⭐ {calculateScore(firstPlace).toLocaleString()} pts
                          </div>

                          {/* Arquetipo */}
                          <div className="pt-3 border-t border-sand-border">
                            <button
                              onClick={() => handleOpenArchetype(firstPlace.archetype || 'LiderSustentable', firstPlace)}
                              className="text-xs font-mono text-moss hover:underline flex items-center justify-center gap-1.5 mx-auto bg-moss-soft/60 px-3 py-1 rounded border border-moss/20"
                            >
                              <span>{getArchetypeMeta(firstPlace.archetype || 'LiderSustentable').icon}</span>
                              <span className="font-semibold">{getArchetypeMeta(firstPlace.archetype || 'LiderSustentable').label}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Pedestal Físico Superior */}
                        <div className="w-full h-48 bg-gradient-to-t from-moss/20 via-moss-soft to-white border-2 border-moss/40 rounded-t-lg flex flex-col items-center justify-center shadow-paper">
                          <span className="font-serif text-6xl text-moss font-bold opacity-60">1</span>
                          <span className="text-[10px] font-mono tracking-widest uppercase text-moss font-bold">ORO // CAMPEÓN</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-72 border-2 border-dashed border-moss/30 rounded-lg flex flex-col items-center justify-center text-center p-6 text-ink-faint bg-white">
                        <span className="text-3xl mb-2">👑</span>
                        <span className="text-xs font-mono uppercase text-moss font-bold">1° Lugar (Campeón)</span>
                        <span className="text-[11px] text-ink-faint font-mono mt-1">El momento culminante...</span>
                      </div>
                    )}
                  </div>

                  {/* ─────────────────────────────────────────────────────────── */}
                  {/* 3° LUGAR (Bronce) — Columna Derecha                          */}
                  {/* ─────────────────────────────────────────────────────────── */}
                  <div className="order-3 flex flex-col items-center">
                    {thirdPlace && podiumStep >= 1 ? (
                      <div className="w-full space-y-3 text-center animate-fade-in-up">
                        {/* Carta del Consorcio */}
                        <div className="bg-white border border-sand-border rounded-lg p-5 shadow-paper space-y-2">
                          <div className="text-3xl">🥉</div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-faint block">
                            3° LUGAR // TERCER PUESTO
                          </span>
                          <h3 className="font-serif text-xl sm:text-2xl text-ink font-normal truncate">
                            {thirdPlace.name}
                          </h3>
                          <div className="font-serif text-xl text-ink">
                            ${((thirdPlace.capital || 1000000) / 1000000).toFixed(2)}M
                          </div>
                          <div className="inline-block text-xs font-mono font-semibold bg-sand-100 text-ink px-3 py-1 rounded border border-sand-border">
                            {calculateScore(thirdPlace).toLocaleString()} pts
                          </div>

                          {/* Arquetipo */}
                          <div className="pt-2 border-t border-sand-border">
                            <button
                              onClick={() => handleOpenArchetype(thirdPlace.archetype || 'SobrevivienteMercado', thirdPlace)}
                              className="text-xs font-mono text-moss hover:underline flex items-center justify-center gap-1 mx-auto"
                            >
                              <span>{getArchetypeMeta(thirdPlace.archetype || 'SobrevivienteMercado').icon}</span>
                              <span className="font-semibold">{getArchetypeMeta(thirdPlace.archetype || 'SobrevivienteMercado').label}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Pedestal Físico */}
                        <div className="w-full h-28 bg-gradient-to-t from-terracotta-soft to-sand-50 border border-sand-border rounded-t-lg flex flex-col items-center justify-center shadow-subtle">
                          <span className="font-serif text-5xl text-terracotta/40 font-bold">3</span>
                          <span className="text-[10px] font-mono tracking-widest uppercase text-terracotta font-semibold">BRONCE</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-sand-border rounded-lg flex flex-col items-center justify-center text-center p-6 text-ink-faint">
                        <span className="text-2xl mb-2">🥉</span>
                        <span className="text-xs font-mono uppercase">3° Lugar</span>
                        <span className="text-[11px] text-ink-faint font-mono mt-1">Por revelar...</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Menciones de Honor (4° lugar en adelante) */}
                {runnerUps.length > 0 && podiumStep >= 3 && (
                  <div className="mt-12 pt-8 border-t border-sand-border space-y-4 max-w-4xl mx-auto">
                    <span className="text-xs font-mono uppercase tracking-widest text-ink-faint font-semibold block text-center">
                      MENCIONES DE HONOR // POSICIONES 4° EN ADELANTE
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {runnerUps.map((comp, idx) => {
                        const archMeta = getArchetypeMeta(comp.archetype || 'SobrevivienteMercado');
                        return (
                          <div 
                            key={comp.id || idx}
                            className="p-3.5 bg-white border border-sand-border rounded-lg flex items-center justify-between shadow-subtle hover:border-moss transition-colors"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-ink-muted">#{idx + 4}</span>
                                <span className="text-sm font-medium text-ink truncate max-w-[140px]">{comp.name}</span>
                              </div>
                              <div className="text-[11px] font-mono text-ink-faint mt-0.5">
                                {calculateScore(comp).toLocaleString()} pts • ${((comp.capital || 1000000) / 1000000).toFixed(2)}M
                              </div>
                            </div>
                            <button
                              onClick={() => handleOpenArchetype(comp.archetype || 'SobrevivienteMercado', comp)}
                              className="text-xs font-mono text-moss hover:underline flex items-center gap-1"
                            >
                              <span>{archMeta.icon}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Llamado a la Acción para Explorar el Dictamen Completo */}
            <div className="pt-6 text-center">
              <button
                onClick={() => setActiveTab('detailed')}
                className="bg-moss hover:bg-moss-light text-paper font-medium px-8 py-4 rounded text-xs font-mono uppercase tracking-wider border border-moss-dark inline-flex items-center gap-2 shadow-elevated transition-all"
              >
                <span>Explorar Dictamen Completo & Explicación de Todos los Arquetipos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* VISTA 2: DICTAMEN COMPLETO & TAXONOMÍA DE ARQUETIPOS                 */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'detailed' && (
          <div className="space-y-12 animate-fade-in-up">
            
            <div className="border-b border-sand-border pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-moss font-semibold block">
                  INFORME CORPORATIVO EXHAUSTIVO
                </span>
                <h2 className="font-serif text-3xl text-ink font-normal tracking-tight mt-0.5">
                  Tabla General de Posiciones & Arquetipos
                </h2>
              </div>
              <p className="text-xs font-mono text-ink-muted">
                Haz clic en cualquier corporación para consultar el desglose ético de su arquetipo.
              </p>
            </div>

            {/* Grilla de Todas las Empresas con su Arquetipo Explicado */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((comp: any, idx: number) => {
                const archMeta = getArchetypeMeta(comp.archetype || 'SobrevivienteMercado');

                return (
                  <div
                    key={comp.id || idx}
                    className="border border-sand-border bg-white p-6 rounded-lg shadow-paper flex flex-col justify-between hover:border-moss transition-all"
                  >
                    <div>
                      {/* Cabecera de la Tarjeta */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-xs font-bold text-ink">
                          PUESTO #{idx + 1}
                        </span>
                        <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded border ${archMeta.badgeClass}`}>
                          {archMeta.icon} {archMeta.label}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl text-ink font-normal mb-1 truncate">
                        {comp.name}
                      </h3>

                      <p className="text-xs font-mono text-moss font-medium mt-1">
                        Puntaje Global: {calculateScore(comp).toLocaleString()} pts
                      </p>

                      <p className="text-xs text-ink-muted leading-relaxed font-light mt-3 line-clamp-3">
                        {archMeta.tagline}
                      </p>
                    </div>

                    {/* Botón de Explicación del Arquetipo */}
                    <div className="mt-6 pt-4 border-t border-sand-border space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-ink-muted">
                        <div>Cap: <strong className="text-ink">${((comp.capital || 1000000) / 1000000).toFixed(2)}M</strong></div>
                        <div>ESG: <strong className="text-moss">{comp.esgIndex || 40}</strong></div>
                        <div>Rep: <strong className="text-ink">{comp.reputation || 50}</strong></div>
                        <div>Huella: <strong className="text-terracotta">{comp.environmentalFootprint || 50}</strong></div>
                      </div>

                      <button
                        onClick={() => handleOpenArchetype(comp.archetype || 'SobrevivienteMercado', comp)}
                        className="w-full bg-sand-100 hover:bg-moss hover:text-paper text-ink font-medium py-2.5 px-3 rounded text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-sand-border"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Ver Diagnóstico del Arquetipo</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Balance de la Biosfera */}
            {world && (
              <div className="border border-sand-border bg-sand-50/70 p-8 rounded-lg space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-moss font-semibold block">
                  SALUD PLANETARIA AL HORIZONTE 2045
                </span>
                <h3 className="font-serif text-2xl text-ink font-normal">
                  Balance Ecosistémico Acumulado
                </h3>
                <p className="text-sm text-ink-muted font-light leading-relaxed max-w-3xl">
                  El comportamiento agregado de las corporaciones determinó el estado de habitabilidad global de Neo-Terra.
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
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* VISTA 3: GLOSARIO COMPLETO DE LOS 9 ARQUETIPOS                        */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'archetypes' && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="border-b border-sand-border pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-moss font-semibold block">
                TAXONOMÍA DE GOBERNANZA CONSCIENTE
              </span>
              <h2 className="font-serif text-3xl text-ink font-normal tracking-tight mt-0.5">
                Los 9 Arquetipos de Neo-Terra 2045
              </h2>
              <p className="text-sm text-ink-muted mt-1 font-light">
                Cada arquetipo refleja un modelo mental corporativo con fortalezas tangibles, riesgos sistémicos y casos de estudio del mundo real.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(ARCHETYPE_CATALOG).map(arch => (
                <div
                  key={arch.id}
                  onClick={() => handleOpenArchetype(arch.id)}
                  className="bg-white border border-sand-border p-6 rounded-lg shadow-paper cursor-pointer hover:border-moss transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{arch.icon}</span>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${arch.badgeClass}`}>
                      {arch.label}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-ink font-normal">
                    {arch.label}
                  </h3>
                  <p className="text-xs text-moss font-medium">
                    {arch.tagline}
                  </p>
                  <p className="text-xs text-ink-muted leading-relaxed font-light line-clamp-3">
                    {arch.description}
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-moss flex items-center gap-1 font-semibold">
                    <span>Explorar diagnóstico completo</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* MODAL DETALLADO DE EXPLICACIÓN DE ARQUETIPO                           */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {selectedArchetype && (
          <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in-up">
            <div className="bg-white border border-sand-border rounded-lg max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-elevated p-6 sm:p-8 space-y-6">
              
              {/* Cabecera del Modal */}
              <div className="flex items-start justify-between border-b border-sand-border pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedArchetype.icon}</span>
                    <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded border font-semibold ${selectedArchetype.badgeClass}`}>
                      ARQUETIPO CORPORATIVO
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal tracking-tight">
                    {selectedArchetype.label}
                  </h2>
                  {selectedCompany && (
                    <p className="text-xs font-mono text-ink-muted">
                      Asignado a: <strong className="text-ink">{selectedCompany.name}</strong>
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedArchetype(null)}
                  className="text-ink-muted hover:text-ink text-sm p-1 rounded hover:bg-sand-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tagline Principal */}
              <div className="p-4 bg-moss-soft/60 border border-moss/20 rounded-lg">
                <p className="text-sm font-serif italic text-moss-dark">
                  "{selectedArchetype.tagline}"
                </p>
              </div>

              {/* 1. Criterio de Clasificación */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-ink-faint font-semibold block">
                  1. Criterio Cuantitativo Alcanzado
                </span>
                <p className="text-xs font-mono text-ink bg-sand-50 p-3 rounded border border-sand-border">
                  {selectedArchetype.criteria}
                </p>
              </div>

              {/* 2. Diagnóstico Estratégico */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-moss font-semibold block">
                  2. Diagnóstico Estratégico & Significado
                </span>
                <p className="text-sm text-ink-muted font-light leading-relaxed">
                  {selectedArchetype.meaning}
                </p>
              </div>

              {/* 3. Fortalezas vs Riesgos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-sand-50 p-4 rounded border border-sand-border space-y-2">
                  <span className="text-[11px] font-mono uppercase text-moss font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-moss" />
                    <span>Fortalezas Clave</span>
                  </span>
                  <ul className="text-xs text-ink-muted space-y-1.5 font-light">
                    {selectedArchetype.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-moss font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-sand-50 p-4 rounded border border-sand-border space-y-2">
                  <span className="text-[11px] font-mono uppercase text-terracotta font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-terracotta" />
                    <span>Riesgos & Puntos Ciegos</span>
                  </span>
                  <ul className="text-xs text-ink-muted space-y-1.5 font-light">
                    {selectedArchetype.risks.map((rsk, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-terracotta font-bold">•</span>
                        <span>{rsk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 4. Paralelo con el Mundo Real */}
              <div className="space-y-1.5 bg-sand-50 p-4 rounded border border-sand-border">
                <span className="text-[11px] font-mono uppercase tracking-wider text-ink font-semibold flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-moss" />
                  <span>Paralelo en la Economía Real</span>
                </span>
                <p className="text-xs text-ink-muted leading-relaxed font-light">
                  {selectedArchetype.realWorld}
                </p>
              </div>

              {/* 5. Lección y Pregunta de Reflexión */}
              <div className="space-y-3 p-4 bg-moss-soft/40 border border-moss/30 rounded">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-moss-dark font-bold block">
                    LECCIÓN PEDAGÓGICA CENTRAL
                  </span>
                  <p className="text-xs text-ink font-medium mt-0.5">
                    {selectedArchetype.lesson}
                  </p>
                </div>
                <div className="pt-2 border-t border-moss/20">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink-faint font-semibold block">
                    PREGUNTA DE REFLEXIÓN PARA EL EQUIPO
                  </span>
                  <p className="text-xs text-ink-muted italic mt-0.5 font-light">
                    "{selectedArchetype.reflection}"
                  </p>
                </div>
              </div>

              {/* Botón de Cierre */}
              <button
                onClick={() => setSelectedArchetype(null)}
                className="w-full bg-moss hover:bg-moss-light text-paper font-medium py-3 rounded text-xs uppercase font-mono tracking-wider transition-colors"
              >
                Cerrar Diagnóstico
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
