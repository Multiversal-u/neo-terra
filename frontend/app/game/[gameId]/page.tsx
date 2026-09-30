'use client';
import { useState, useEffect, useCallback } from 'react';
import CompanyDashboard from './components/CompanyDashboard';
import DecisionPanel from './components/DecisionPanel';
import NewsTickerPanel from './components/NewsTickerPanel';
import RoundResultsModal from './components/RoundResultsModal';
import WaitingScreen from './components/WaitingScreen';
import EmergencyModal from './components/EmergencyModal';

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

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
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
    <div className="h-screen bg-slate-950 text-slate-200 flex flex-col font-inter selection:bg-cyan-500/30 overflow-hidden">
      {/* Cabecera Móvil */}
      <header className="bg-slate-900 border-b border-cyan-900/50 px-4 py-2.5 flex justify-between items-center shadow-md z-20 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h1 className="text-base md:text-lg font-black font-orbitron text-cyan-400 tracking-wider">
            NEO-TERRA
          </h1>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-[11px] font-mono text-slate-400">
            SALA: <strong className="text-neoterra-gold">{gameId}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {gameState?.state === 'finished' ? (
            <a
              href={`/end/${gameId}`}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-3 py-1.5 rounded-lg font-mono tracking-wider flex items-center gap-1 shadow-[0_0_12px_rgba(251,191,36,0.6)] animate-pulse"
            >
              🏆 VER RESULTADOS FINALES
            </a>
          ) : (
            <div className="bg-cyan-950 text-cyan-300 px-3 py-1 rounded-lg border border-cyan-800 font-mono text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.15)]">
              {isLobby ? 'SALA DE ESPERA' : `RONDA ${currentRound} DE ${gameState?.maxRounds || 8}`}
            </div>
          )}
        </div>
      </header>

      {/* Selector de Pestañas para Celulares */}
      <div className="flex md:hidden bg-slate-900/90 border-b border-cyan-900/50 shrink-0 z-10 font-mono text-xs">
        <button
          onClick={() => setActiveTab('decisions')}
          className={`flex-1 py-3 font-bold text-center border-b-2 transition-all ${
            activeTab === 'decisions'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          📝 Directivas y Decisiones
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 py-3 font-bold text-center border-b-2 transition-all ${
            activeTab === 'metrics'
              ? 'border-purple-400 text-purple-300 bg-purple-950/30'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          📊 Mi Empresa ({company?.name || 'Nova'})
        </button>
      </div>

      {/* Cuerpo Principal */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Panel de Empresa: Siempre visible en PC, condicionado en Celular */}
        <div className={`${activeTab === 'metrics' ? 'block' : 'hidden'} md:block h-full overflow-y-auto`}>
          <CompanyDashboard company={company} />
        </div>

        {/* Zona Central de Decisiones: Visible en pestaña decisiones o en PC */}
        <main
          className={`${
            activeTab === 'decisions' ? 'block' : 'hidden md:block'
          } flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950/80 relative scrollbar-thin scrollbar-thumb-cyan-900 h-full`}
        >
          {gameState?.state === 'finished' ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6 font-inter">
              <div className="w-20 h-20 rounded-full bg-amber-950/80 border-2 border-amber-500 flex items-center justify-center text-4xl shadow-[0_0_35px_rgba(245,158,11,0.5)] animate-bounce">
                🏆
              </div>
              <div className="space-y-2 max-w-md">
                <span className="text-xs font-mono uppercase bg-amber-950 text-amber-300 border border-amber-800 px-3 py-1 rounded-full font-bold">
                  SIMULACIÓN CONCLUIDA
                </span>
                <h2 className="text-2xl md:text-3xl font-black font-orbitron text-neoterra-gold drop-shadow-md">
                  VER EVALUACIÓN Y PODIO FINAL
                </h2>
                <p className="text-xs text-gray-300 font-mono">
                  Todas las rondas han finalizado. Conoce el Arquetipo de Negocios asignado a <strong className="text-cyan-400">"{company?.name}"</strong> y la posición final de tu empresa.
                </p>
              </div>
              <a
                href={`/end/${gameId}`}
                className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black font-orbitron py-4 px-8 rounded-2xl text-sm md:text-base tracking-wider shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:scale-105 transition-all"
              >
                🏆 VER MI ARQUETIPO Y RESULTADOS FINALES ➔
              </a>
            </div>
          ) : showResults ? (
            <RoundResultsModal
              onClose={() => setShowResults(false)}
              narrative={company?.lastNarrative}
              companyName={company?.name}
              results={{
                newsItems: gameState?.recentNews,
                triggeredEvents: gameState?.recentEvents,
              }}
            />
          ) : isLobby ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 font-mono">
              <div className="w-16 h-16 rounded-full bg-cyan-950/50 border border-cyan-800 flex items-center justify-center text-3xl animate-pulse">
                ⏳
              </div>
              <h2 className="text-xl font-bold font-orbitron text-white">
                Esperando al Expositor...
              </h2>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Tu corporación <strong className="text-cyan-300">"{company?.name || 'Registrada'}"</strong> está conectada.
                En cuanto el profesor presione <strong className="text-neoterra-gold">"Iniciar Siguiente Ronda"</strong> en su panel, aquí se abrirán tus opciones de proveedores y presupuesto.
              </p>
              <button
                onClick={syncState}
                className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-cyan-800 text-cyan-400 rounded-lg text-xs"
              >
                🔄 Actualizar Estado
              </button>
            </div>
          ) : hasSubmitted ? (
            <div className="h-full flex items-center justify-center">
              <WaitingScreen
                decidedCount={gameState?.decidedCount}
                totalCount={gameState?.totalPlayers}
              />
            </div>
          ) : (
            <DecisionPanel
              roundNumber={currentRound}
              scenario={gameState?.currentScenario}
              onSubmit={handleSubmitDecision}
              submitting={submitting}
            />
          )}
        </main>
      </div>

      {/* Modal de Alerta de Emergencia y Crisis Relámpago */}
      {gameState?.activeEmergency && (
        <EmergencyModal
          key={gameState.activeEmergency.id || gameState.activeEmergency.title}
          emergency={gameState.activeEmergency}
          onSubmit={handleEmergencySubmit}
          feedback={
            company?.lastEmergencyFeedback?.emergencyId === gameState.activeEmergency.id
              ? company.lastEmergencyFeedback.feedback
              : undefined
          }
        />
      )}

      {/* Ticker de noticias en vivo */}
      <NewsTickerPanel news={gameState?.recentNews} />
    </div>
  );
}
