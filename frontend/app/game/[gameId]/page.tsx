'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import CompanyDashboard from './components/CompanyDashboard';
import DecisionPanel from './components/DecisionPanel';
import NewsTickerPanel from './components/NewsTickerPanel';
import RoundResultsModal from './components/RoundResultsModal';
import WaitingScreen from './components/WaitingScreen';
import EmergencyModal from './components/EmergencyModal';
import { Trophy, BarChart2, FileEdit, Clock, ShieldCheck, AlertTriangle, Globe2, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { getArchetypeMeta } from '@/lib/archetypes';

export default function GamePage({ params }: { params: { gameId: string } }) {
  const [playerId, setPlayerId] = useState<string>('');
  const [company, setCompany] = useState<any>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastRoundSeen, setLastRoundSeen] = useState<number>(0);

  // En móvil: pestaña activa ('decisions' o 'metrics')
  const [activeTab, setActiveTab] = useState<'decisions' | 'metrics'>('decisions');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://neo-terra-backend.onrender.com';
  const gameId = params.gameId.toUpperCase();

  // Inicializar ID y nombre de la empresa desde localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('neo_player_id');
      if (!id) {
        id = 'usr_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('neo_player_id', id);
      }
      setPlayerId(id);

      const cachedCompany = localStorage.getItem('neo_company_data');
      if (cachedCompany) {
        try {
          setCompany(JSON.parse(cachedCompany));
        } catch (e) {}
      }
    }
  }, []);

  // Función para sincronizar estado del juego y de la empresa
  const syncState = useCallback(async () => {
    if (!playerId) return;

    try {
      // 1. Estado público del juego
      const gameRes = await fetch(`${backendUrl}/api/game/${gameId}`);
      if (gameRes.ok) {
        const gameData = await gameRes.json();
        const gs = gameData.state;
        setGameState(gs);

        // Si avanzó de ronda, habilitar nuevo formulario de decisión
        if (gs.currentRound > lastRoundSeen) {
          setLastRoundSeen(gs.currentRound);
          setHasSubmitted(false);
          setShowResults(false);
          setActiveTab('decisions');
        }

        // Si la ronda está en resultados o calculando
        if (gs.state === 'roundResults' || gs.state === 'calculating') {
          setShowResults(true);
        }
      }

      // 2. Estado privado de la empresa del jugador
      const compRes = await fetch(`${backendUrl}/api/game/${gameId}/company/${playerId}`);
      if (compRes.ok) {
        const compData = await compRes.json();
        if (compData.company) {
          setCompany(compData.company);
          localStorage.setItem('neo_company_data', JSON.stringify(compData.company));
        }
      }
    } catch (err) {
      console.error('Error sincronizando móvil:', err);
    }
  }, [backendUrl, gameId, playerId, lastRoundSeen]);

  // Polling regular cada 2.5 segundos
  useEffect(() => {
    syncState();
    const interval = setInterval(syncState, 2500);
    return () => clearInterval(interval);
  }, [syncState]);

  // Enviar decisión al backend
  const handleSubmitDecision = async (decision: any) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${backendUrl}/api/game/${gameId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          decision,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setHasSubmitted(true);
        if (data.result?.narrative) {
          setCompany((prev: any) => ({ ...prev, lastNarrative: data.result.narrative }));
        }
        setShowResults(false); // Esperar evaluación del docente
      } else {
        const err = await res.json();
        alert(`Aviso: ${err.error || 'No se pudo registrar la decisión'}`);
      }
    } catch (err: any) {
      alert('Error de conexión al enviar la decisión. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
      syncState();
    }
  };

  // Enviar decisión de emergencia relámpago
  const handleEmergencySubmit = async (optionId: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/game/${gameId}/emergencyDecision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          optionId,
        }),
      });
      if (res.ok) {
        syncState();
      }
    } catch (err) {
      console.error('Error enviando decisión de emergencia:', err);
    }
  };

  const currentRound = gameState?.currentRound || 0;
  const isLobby = !gameState || gameState.state === 'lobby' || currentRound === 0;

  return (
    <div className="h-screen bg-paper text-ink font-sans selection:bg-moss-soft selection:text-moss-dark flex flex-col overflow-hidden">
      {/* Cabecera Móvil y Desktop Homologada */}
      <header className="bg-white border-b border-sand-border px-4 sm:px-6 py-3 flex justify-between items-center z-20 shrink-0 shadow-subtle">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-moss inline-block animate-pulse" />
          <Link href="/" className="font-serif text-lg font-normal text-ink tracking-tight hover:opacity-80 transition-opacity">
            NEO-TERRA <span className="text-[10px] font-mono uppercase text-ink-muted">/ 2045</span>
          </Link>
          <span className="text-sand-300 hidden sm:inline">|</span>
          <span className="text-xs font-mono text-ink-muted hidden sm:inline">
            SALA: <strong className="text-ink font-bold">{gameId}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {gameState?.state === 'finished' ? (
            <Link
              href={`/end/${gameId}`}
              className="bg-moss hover:bg-moss-light text-paper font-medium text-xs px-3.5 py-1.5 rounded font-mono tracking-wider flex items-center gap-1.5 transition-colors border border-moss-dark"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Ver Resultados Finales</span>
            </Link>
          ) : (
            <div className="bg-sand-100 text-ink px-3 py-1 rounded border border-sand-border font-mono text-xs font-medium">
              {isLobby ? 'SALA DE ESPERA' : `RONDA ${currentRound} DE ${gameState?.maxRounds || 8}`}
            </div>
          )}
        </div>
      </header>

      {/* Selector de Pestañas para Móviles */}
      <div className="flex md:hidden bg-white border-b border-sand-border shrink-0 z-10 font-mono text-xs">
        <button
          onClick={() => setActiveTab('decisions')}
          className={`flex-1 py-3 font-semibold text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'decisions'
              ? 'border-moss text-moss bg-moss-soft/40'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>Directivas</span>
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 py-3 font-semibold text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'metrics'
              ? 'border-moss text-moss bg-moss-soft/40'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Mi Empresa ({company?.name || 'Nova'})</span>
        </button>
      </div>

      {/* Cuerpo Principal */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Panel de Empresa: Siempre visible en PC, condicionado en Móvil */}
        <div className={`${activeTab === 'metrics' ? 'block' : 'hidden'} md:block h-full overflow-y-auto shrink-0 border-r border-sand-border bg-white`}>
          <CompanyDashboard company={company} />
        </div>

        {/* Zona Central de Decisiones: Visible en pestaña decisiones o en PC */}
        <main
          className={`${
            activeTab === 'decisions' ? 'block' : 'hidden md:block'
          } flex-1 overflow-y-auto p-4 sm:p-8 bg-paper relative h-full`}
        >
          {gameState?.state === 'finished' ? (
            (() => {
              const sorted = [...(gameState?.companies || [])].sort((a, b) => (b.compositeScore || 0) - (a.compositeScore || 0));
              const myRank = company?.finalRank || (sorted.findIndex(c => c.id === playerId) + 1) || 1;
              const archKey = company?.archetype || (sorted.find(c => c.id === playerId)?.archetype) || 'SobrevivienteMercado';
              const myArch = getArchetypeMeta(archKey);

              return (
                <div className="max-w-2xl mx-auto space-y-6 pb-16 animate-fade-in-up font-sans">
                  
                  {/* Tarjeta de Posición & Coronación Personal */}
                  <div className="bg-white border-2 border-moss/40 rounded-lg p-6 sm:p-8 text-center shadow-paper space-y-3">
                    <div className="text-4xl">
                      {myRank === 1 ? '👑' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : '🏆'}
                    </div>

                    <div className="inline-block px-3.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-moss-soft text-moss-dark border border-moss/30">
                      {myRank === 1 ? '1° LUGAR // CAMPEÓN GLOBAL' : myRank === 2 ? '2° LUGAR // SUBCAMPEÓN' : myRank === 3 ? '3° LUGAR // TERCER PUESTO' : `PUESTO #${myRank} DE ${gameState?.totalPlayers || sorted.length}`}
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                      {company?.name || 'Tu Consorcio'}
                    </h2>

                    <p className="text-xs sm:text-sm text-ink-muted font-light leading-relaxed max-w-lg mx-auto">
                      La simulación ha concluido. El mercado de Neo-Terra evaluó tu equilibrio entre rentabilidad, huella ecológica y ética en la cadena de suministro.
                    </p>

                    {/* Resumen de Métricas Clave */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-sand-border text-center text-xs font-mono">
                      <div className="bg-sand-50 p-2.5 rounded border border-sand-border">
                        <span className="text-[10px] text-ink-faint block uppercase">Capital Final</span>
                        <strong className="text-ink text-sm">${((company?.capital || 1000000) / 1000000).toFixed(2)}M</strong>
                      </div>
                      <div className="bg-sand-50 p-2.5 rounded border border-sand-border">
                        <span className="text-[10px] text-ink-faint block uppercase">Índice ESG</span>
                        <strong className="text-moss text-sm">{company?.esgIndex || 40}/100</strong>
                      </div>
                      <div className="bg-sand-50 p-2.5 rounded border border-sand-border">
                        <span className="text-[10px] text-ink-faint block uppercase">Reputación</span>
                        <strong className="text-ink text-sm">{company?.reputation || 50}/100</strong>
                      </div>
                      <div className="bg-sand-50 p-2.5 rounded border border-sand-border">
                        <span className="text-[10px] text-ink-faint block uppercase">Huella Ecológica</span>
                        <strong className="text-terracotta text-sm">{company?.environmentalFootprint || 50}/100</strong>
                      </div>
                    </div>
                  </div>

                  {/* Diagnóstico Exhaustivo de Tu Arquetipo */}
                  <div className="bg-white border border-sand-border rounded-lg p-6 sm:p-8 shadow-paper space-y-5">
                    <div className="flex items-center justify-between border-b border-sand-border pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-moss font-semibold block">
                          TU DIAGNÓSTICO ESTRATÉGICO
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl">{myArch.icon}</span>
                          <h3 className="font-serif text-2xl text-ink font-normal">
                            {myArch.label}
                          </h3>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded border ${myArch.badgeClass}`}>
                        {myArch.icon} Clasificado
                      </span>
                    </div>

                    {/* Tagline */}
                    <div className="p-4 bg-moss-soft/60 border border-moss/20 rounded">
                      <p className="text-xs sm:text-sm font-serif italic text-moss-dark">
                        "{myArch.tagline}"
                      </p>
                    </div>

                    {/* Significado */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono uppercase text-ink-faint font-semibold block">
                        ¿Qué Significa tu Arquetipo en la Simulación?
                      </span>
                      <p className="text-xs sm:text-sm text-ink-muted font-light leading-relaxed">
                        {myArch.meaning}
                      </p>
                    </div>

                    {/* Fortalezas vs Riesgos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      <div className="bg-sand-50 p-3.5 rounded border border-sand-border space-y-1.5">
                        <span className="text-[10px] font-mono uppercase text-moss font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Fortalezas que Demostraste</span>
                        </span>
                        <ul className="text-xs text-ink-muted space-y-1 font-light">
                          {myArch.strengths.map((str, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-moss font-bold">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-sand-50 p-3.5 rounded border border-sand-border space-y-1.5">
                        <span className="text-[10px] font-mono uppercase text-terracotta font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Puntos Ciegos y Riesgos</span>
                        </span>
                        <ul className="text-xs text-ink-muted space-y-1 font-light">
                          {myArch.risks.map((rsk, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-terracotta font-bold">•</span>
                              <span>{rsk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Paralelo del Mundo Real */}
                    <div className="p-3.5 bg-sand-50 rounded border border-sand-border space-y-1">
                      <span className="text-[10px] font-mono uppercase text-ink font-semibold flex items-center gap-1">
                        <Globe2 className="w-3.5 h-3.5 text-moss" />
                        <span>Caso Análogo en la Economía Real</span>
                      </span>
                      <p className="text-xs text-ink-muted font-light leading-relaxed">
                        {myArch.realWorld}
                      </p>
                    </div>

                    {/* Lección y Pregunta de Reflexión */}
                    <div className="p-4 bg-moss-soft/40 border border-moss/30 rounded space-y-2.5">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-moss-dark font-bold block">
                          LECCIÓN DE GOBERNANZA CONSCIENTE
                        </span>
                        <p className="text-xs text-ink font-medium mt-0.5">
                          {myArch.lesson}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-moss/20">
                        <span className="text-[10px] font-mono uppercase text-ink-faint font-semibold block">
                          PREGUNTA DE REFLEXIÓN PARA TU EQUIPO
                        </span>
                        <p className="text-xs text-ink-muted italic mt-0.5 font-light">
                          "{myArch.reflection}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botón para Abrir el Podio de la Sala */}
                  <div className="pt-2">
                    <Link
                      href={`/end/${gameId}`}
                      className="w-full bg-moss hover:bg-moss-light text-paper font-medium py-4 px-6 rounded text-xs uppercase font-mono tracking-wider border border-moss-dark flex items-center justify-center gap-2 shadow-elevated transition-colors text-center"
                    >
                      <Trophy className="w-4 h-4 text-paper" />
                      <span>Ver el Podio Ceremonial de la Sala (Estilo Kahoot)</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                </div>
              );
            })()
          ) : isLobby ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full border border-sand-border bg-sand-50 flex items-center justify-center text-moss">
                <Clock className="w-6 h-6 animate-spin text-moss" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase bg-moss-soft text-moss-dark border border-moss/30 px-3 py-1 rounded font-semibold">
                  SALA DE ESPERA
                </span>
                <h2 className="text-2xl font-serif text-ink font-normal">
                  {company?.name || 'Tu Consorcio'} está Conectado
                </h2>
                <p className="text-sm text-ink-muted font-light leading-relaxed">
                  Aguardando a que el facilitador active el inicio formal de la Ronda 1.
                </p>
              </div>
            </div>
          ) : hasSubmitted ? (
            <WaitingScreen
              decidedCount={gameState?.decidedCount}
              totalCount={gameState?.totalPlayers}
              hasNarrative={!!company?.lastNarrative}
              onViewNarrative={() => setShowResults(true)}
            />
          ) : (
            <DecisionPanel
              roundNumber={currentRound}
              scenario={gameState?.currentScenario}
              onSubmit={handleSubmitDecision}
              submitting={submitting}
            />
          )}

          {/* Modal de Emergencia en Tiempo Real */}
          {gameState?.activeEmergency && (
            <EmergencyModal
              emergency={gameState.activeEmergency}
              onSubmit={handleEmergencySubmit}
              feedback={company?.lastEmergencyFeedback}
            />
          )}

          {/* Modal de Consecuencias y Crónica de la Ronda */}
          {showResults && company?.lastNarrative && (
            <RoundResultsModal
              narrative={company.lastNarrative}
              companyName={company?.name}
              results={gameState?.lastResults}
              onClose={() => setShowResults(false)}
            />
          )}
        </main>
      </div>

      {/* Ticker de Noticias Globales */}
      <NewsTickerPanel news={gameState?.recentNews} />
    </div>
  );
}
