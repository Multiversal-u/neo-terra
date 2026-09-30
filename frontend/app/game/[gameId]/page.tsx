'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import CompanyDashboard from './components/CompanyDashboard';
import DecisionPanel from './components/DecisionPanel';
import NewsTickerPanel from './components/NewsTickerPanel';
import RoundResultsModal from './components/RoundResultsModal';
import WaitingScreen from './components/WaitingScreen';
import EmergencyModal from './components/EmergencyModal';
import { Trophy, BarChart2, FileEdit, Clock } from 'lucide-react';

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
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded border border-sand-border bg-sand-100 flex items-center justify-center text-3xl">
                🏆
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase bg-sand-100 text-ink-muted border border-sand-border px-3 py-1 rounded font-semibold">
                  SIMULACIÓN CONCLUIDA
                </span>
                <h2 className="text-2xl font-serif text-ink font-normal mt-2">
                  Todas las Rondas han Finalizado
                </h2>
                <p className="text-sm text-ink-muted font-light leading-relaxed">
                  El dictamen final y el podio de gobernanza están listos. Consulta tu posición y arquetipo.
                </p>
              </div>
              <Link
                href={`/end/${gameId}`}
                className="bg-moss hover:bg-moss-light text-paper font-medium py-3 px-6 rounded text-xs uppercase tracking-wider border border-moss-dark transition-colors"
              >
                Abrir Resultados y Podio de la Sala
              </Link>
            </div>
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
