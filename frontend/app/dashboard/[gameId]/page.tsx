'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import WorldMap from './components/WorldMap';
import GlobalMetricsPanel from './components/GlobalMetricsPanel';
import CompanyRankings from './components/CompanyRankings';
import LiveEventsFeed from './components/LiveEventsFeed';
import { Trophy, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function DashboardPage({ params }: { params: { gameId: string } }) {
  const [gameState, setGameState] = useState<any>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://neo-terra-backend.onrender.com';
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
    <div className="min-h-screen bg-paper text-ink font-sans p-6 md:p-8 flex flex-col justify-between selection:bg-moss-soft selection:text-moss-dark">
      
      {/* Cabecera Principal Proyectable */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-sand-border gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-moss inline-block animate-pulse" />
            <Link href="/" className="font-serif text-2xl md:text-3xl text-ink font-normal tracking-tight hover:opacity-80 transition-opacity">
              NEO-TERRA <span className="text-xs font-mono uppercase text-ink-muted">/ 2045</span>
            </Link>
            <span className="text-sand-300">|</span>
            <span className="text-xs font-mono uppercase tracking-widest text-moss font-semibold">
              TABLERO PÚBLICO DE SALA
            </span>
          </div>
          <p className="text-xs text-ink-muted mt-1 font-light">
            Observatorio Global de Gobernanza Sistémica, Sostenibilidad y Cadenas de Valor
          </p>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="bg-white border border-sand-border px-5 py-2.5 rounded-lg text-center shadow-subtle">
            <span className="text-[10px] text-ink-faint font-mono uppercase tracking-wider block">Progreso de Ciclo</span>
            <span className="text-xl font-serif font-normal text-moss">
              Ronda {currentRound} <span className="text-xs font-sans text-ink-muted">/ {maxRounds}</span>
            </span>
          </div>

          <div className="bg-white border border-sand-border px-5 py-2.5 rounded-lg text-center shadow-subtle">
            <span className="text-[10px] text-ink-faint font-mono uppercase tracking-wider block">Clave de Acceso</span>
            <span className="text-xl font-mono font-bold text-ink tracking-widest">
              {gameId}
            </span>
          </div>

          <Link
            href={`/admin/${gameId}`}
            className="text-xs font-medium uppercase tracking-wider text-ink-muted border border-sand-border hover:border-moss bg-sand-50 hover:bg-white px-3.5 py-3 rounded transition-all flex items-center gap-1.5"
          >
            <span>Panel Moderador</span>
          </Link>
        </div>
      </header>

      {/* Banner de Simulación Concluida */}
      {gameState?.state === 'finished' && (
        <div className="my-6 p-6 rounded-lg bg-white border border-sand-border shadow-paper flex flex-col md:flex-row justify-between items-center gap-6 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded border border-sand-border bg-sand-100 flex items-center justify-center text-2xl shrink-0">
              🏆
            </div>
            <div>
              <div className="text-moss font-mono font-semibold text-xs uppercase tracking-widest">
                SIMULACIÓN GLOBAL CONCLUIDA // LIBRO MAYOR CERRADO
              </div>
              <h2 className="text-2xl font-serif text-ink font-normal mt-0.5">
                Todas las Rondas han Finalizado
              </h2>
              <p className="text-xs text-ink-muted font-light mt-0.5">
                Los arquetipos corporativos han sido calculados y el destino socio-ecológico está sellado.
              </p>
            </div>
          </div>
          <Link
            href={`/end/${gameId}`}
            className="bg-moss hover:bg-moss-light text-paper font-medium py-3 px-6 rounded text-xs uppercase tracking-wider border border-moss-dark shrink-0 flex items-center gap-2 transition-all shadow-subtle"
          >
            <span>Proyectar Podio Final y Arquetipos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Contenido Central: 3 Columnas Proyectables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 flex-1 items-stretch">
        
        {/* Columna Izquierda (3 cols): Ranking de Empresas */}
        <div className="lg:col-span-4 h-full">
          <CompanyRankings companies={companies} />
        </div>

        {/* Columna Central (5 cols): Mapa y Eventos */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full">
          <div className="flex-1 min-h-[260px] bg-white rounded-lg shadow-paper border border-sand-border p-2">
            <WorldMap />
          </div>
          <div className="h-56">
            <LiveEventsFeed events={events} />
          </div>
        </div>

        {/* Columna Derecha (3 cols): Variables Globales */}
        <div className="lg:col-span-3 h-full">
          <GlobalMetricsPanel metrics={globalWorld} />
        </div>

      </div>

      {/* Pie de Página */}
      <footer className="pt-4 border-t border-sand-border flex justify-between items-center text-xs text-ink-faint font-mono">
        <span>SALA: {gameId} • ESTADO: {gameState?.state?.toUpperCase() || 'EN LÍNEA'}</span>
        <span>Universidad 2045 • Gobernanza Sistémica y Sostenibilidad</span>
      </footer>

    </div>
  );
}
