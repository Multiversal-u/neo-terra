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
