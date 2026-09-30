'use client';
import React, { useEffect, useState } from 'react';
import WorldMap from './components/WorldMap';
import GlobalMetricsPanel from './components/GlobalMetricsPanel';
import CompanyRankings from './components/CompanyRankings';
import LiveEventsFeed from './components/LiveEventsFeed';

export default function DashboardPage({ params }: { params: { gameId: string } }) {
  const [gameState, setGameState] = useState<any>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  const gameId = params.gameId.toUpperCase();

  // Polling automático cada 2.5 segundos para reflejar decisiones de los alumnos en vivo
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/game/${gameId}`);
        if (res.ok) {
          const data = await res.json();
          setGameState(data.state);
        }
      } catch (err) {
        console.error('Error al actualizar Dashboard:', err);
      }
    };

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 2500);
    return () => clearInterval(interval);
  }, [gameId, backendUrl]);

  const currentRound = gameState?.currentRound || 0;
  const maxRounds = gameState?.maxRounds || 8;
  const companies = gameState?.companies || [];
  const events = gameState?.recentEvents || [];
  const globalWorld = gameState?.globalWorld;

  return (
    <div className="min-h-screen bg-neoterra-dark text-white p-4 md:p-6 font-inter flex flex-col justify-between overflow-x-hidden">
      {/* Cabecera Principal Proyectable */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-cyan-800/40 pb-4 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black font-orbitron text-neoterra-cyan tracking-widest flex items-center gap-3">
            <span className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
            CENTRO DE CONTROL GLOBAL // NEO-TERRA 2045
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-1">
            Simulador de Sistemas de Información, Sostenibilidad y Negocios Internacionales
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-900 border border-amber-500/40 px-5 py-2 rounded-xl text-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <span className="text-[10px] text-gray-400 font-mono uppercase block">Progreso Global</span>
            <span className="text-lg md:text-xl font-orbitron font-black text-neoterra-gold">
              RONDA {currentRound} / {maxRounds}
            </span>
          </div>

          <div className="bg-slate-900 border border-purple-500/40 px-5 py-2 rounded-xl text-center">
            <span className="text-[10px] text-gray-400 font-mono uppercase block">Código de Sala</span>
            <span className="text-lg md:text-xl font-orbitron font-bold text-purple-300">
              {gameId}
            </span>
          </div>
        </div>
      </header>

      {/* Banner de Simulación Concluida */}
      {gameState?.state === 'finished' && (
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-2 border-amber-500 shadow-[0_0_60px_rgba(251,191,36,0.4)] flex flex-col md:flex-row justify-between items-center gap-4 animate-in zoom-in-95">
          <div className="flex items-center gap-4">
            <span className="text-4xl animate-bounce">🏆</span>
            <div>
              <div className="text-amber-400 font-mono font-bold text-xs uppercase tracking-widest">
                SIMULACIÓN GLOBAL CONCLUIDA // LIBRO MAYOR CERRADO
              </div>
              <h2 className="text-xl md:text-2xl font-orbitron font-black text-white">
                TODAS LAS RONDAS HAN FINALIZADO
              </h2>
              <p className="text-xs text-gray-300 font-sans mt-0.5">
                Los arquetipos corporativos han sido dictaminados y el destino de Neo-Terra 2045 está sellado.
              </p>
            </div>
          </div>
          <a
            href={`/end/${gameId}`}
            className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black font-orbitron py-3.5 px-6 rounded-xl text-sm tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.6)] shrink-0 flex items-center gap-2 hover:scale-105 transition-all"
          >
            <span>👑</span> PROYECTAR PODIO FINAL Y ARQUETIPOS ➔
          </a>
        </div>
      )}

      {/* Banner de Emergencia Activa en Pantalla Gigante */}
      {gameState?.activeEmergency && (
        <div className="mb-6 p-4 rounded-2xl bg-red-950/90 border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)] flex flex-col md:flex-row justify-between items-center gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🚨</span>
            <div>
              <div className="text-red-400 font-mono font-bold text-xs uppercase tracking-widest">
                INCIDENTE GLOBAL IMPREVISTO EN TIEMPO REAL
              </div>
              <h2 className="text-lg md:text-xl font-orbitron font-black text-white">
                {gameState.activeEmergency.title}
              </h2>
              <p className="text-xs text-gray-300 font-sans mt-0.5">
                {gameState.activeEmergency.context}
              </p>
            </div>
          </div>
          <div className="bg-black/60 border border-red-800 px-4 py-2 rounded-xl text-center shrink-0">
            <span className="text-[10px] text-gray-400 font-mono uppercase block">Gabinete de Crisis</span>
            <span className="text-lg font-orbitron font-bold text-amber-300">
              {gameState.emergencyDecidedCount || 0} / {gameState.totalPlayers || 0} listas
            </span>
          </div>
        </div>
      )}

      {/* Grid de 3 Columnas Proyectables */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-4">
        {/* Columna Izquierda: Ranking Corporativo en Vivo */}
        <div className="lg:col-span-3 min-h-[400px]">
          <CompanyRankings companies={companies} />
        </div>

        {/* Columna Central: Mapa Geopolítico y Feed de Alertas */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <div className="flex-1 bg-neoterra-navy/40 rounded-2xl border border-cyan-800/30 p-4 relative overflow-hidden backdrop-blur-md min-h-[340px]">
            <WorldMap />
          </div>
          <div className="h-44">
            <LiveEventsFeed events={events} />
          </div>
        </div>

        {/* Columna Derecha: Las 7 Variables Globales del Planeta */}
        <div className="lg:col-span-3 min-h-[400px]">
          <GlobalMetricsPanel metrics={globalWorld} />
        </div>
      </div>

      {/* Barra Inferior de Noticias */}
      <footer className="bg-slate-950 border border-cyan-900/40 rounded-xl p-2.5 flex items-center gap-3 font-mono text-xs">
        <span className="bg-cyan-500 text-black px-2 py-0.5 rounded font-bold text-[10px] uppercase shrink-0">
          NOTICIAS
        </span>
        <div className="overflow-hidden whitespace-nowrap text-slate-300">
          {gameState?.recentNews && gameState.recentNews.length > 0 ? (
            <span>{gameState.recentNews[gameState.recentNews.length - 1].headline} — {gameState.recentNews[gameState.recentNews.length - 1].body}</span>
          ) : (
            <span>Sistema en monitoreo de variables planetarias. Conexión de corporaciones multinacionales activa.</span>
          )}
        </div>
      </footer>
    </div>
  );
}
