'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Play, 
  FileText, 
  SkipForward, 
  AlertTriangle, 
  Pause, 
  Trophy, 
  ExternalLink, 
  QrCode, 
  Monitor, 
  RefreshCw,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function AdminPanel({ params }: { params: { gameId: string } }) {
  const [gameState, setGameState] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://neo-terra-backend.onrender.com';
  const gameId = params.gameId.toUpperCase();

  const fetchGameState = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/game/${gameId}`);
      if (res.ok) {
        const data = await res.json();
        setGameState(data.state);
      }
    } catch (err) {
      console.error('Error al obtener estado del juego:', err);
    }
  };

  useEffect(() => {
    fetchGameState();
    const interval = setInterval(fetchGameState, 3000);
    return () => clearInterval(interval);
  }, [gameId]);

  const handleStartGame = async () => {
    setLoading(true);
    setStatusMsg('Inicializando simulación...');
    try {
      const res = await fetch(`${backendUrl}/api/game/${gameId}/start`, {
        method: 'POST',
      });
      if (res.ok) {
        setStatusMsg('Simulación iniciada. La Ronda 1 se encuentra activa en los dispositivos.');
        fetchGameState();
      } else {
        const text = await res.text();
        setStatusMsg(`Aviso: ${text}`);
      }
    } catch (err: any) {
      setStatusMsg(`Error de comunicación: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNextRound = async () => {
    setLoading(true);
    setStatusMsg('Avanzando al siguiente ciclo...');
    try {
      const res = await fetch(`${backendUrl}/api/admin/${gameId}/nextRound`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.finished) {
          setStatusMsg('La simulación ha llegado a su término. Puedes proyectar el podio de resultados.');
        } else {
          setStatusMsg(`Ronda ${data.round?.currentRound || ''} iniciada con éxito.`);
        }
        fetchGameState();
      } else {
        const text = await res.text();
        setStatusMsg(`Error: ${text}`);
      }
    } catch (err: any) {
      setStatusMsg(`Error de conexión: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/${gameId}/pause`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg(`Estado modificado a: ${data.state}`);
        fetchGameState();
      }
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateRound = async () => {
    setLoading(true);
    setStatusMsg('Evaluando directivas corporativas y generando crónicas de consecuencias...');
    try {
      const res = await fetch(`${backendUrl}/api/admin/${gameId}/calculateRound`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg('✓ Ronda evaluada. Crónicas de impacto y titulares narrativos desplegados en los celulares.');
        fetchGameState();
      } else {
        setStatusMsg(`Error: ${data.error || 'No fue posible evaluar la ronda'}`);
      }
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEndGame = async () => {
    if (!confirm('¿Deseas finalizar formalmente la simulación? Se calculará el dictamen de arquetipos y se publicará el podio final.')) {
      return;
    }
    setLoading(true);
    setStatusMsg('Clasificando arquetipos de empresas y sellando resultados...');
    try {
      const res = await fetch(`${backendUrl}/api/admin/${gameId}/endGame`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg('✓ Simulación concluida. Podio generado.');
        fetchGameState();
        window.open(`/end/${gameId}`, '_blank');
      } else {
        setStatusMsg(`Error: ${data.error || 'No fue posible finalizar'}`);
      }
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerEmergency = async () => {
    setLoading(true);
    setStatusMsg('Inyectando contingencia imprevista en tiempo real...');
    try {
      const res = await fetch(`${backendUrl}/api/admin/${gameId}/emergency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setStatusMsg(`🚨 Contingencia activada: ${data.emergency?.title}`);
        fetchGameState();
      } else {
        const text = await res.text();
        setStatusMsg(`Aviso: ${text}`);
      }
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveEmergency = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/${gameId}/resolveEmergency`, {
        method: 'POST',
      });
      if (res.ok) {
        setStatusMsg('✓ Contingencia resuelta. Simulación reanudada.');
        fetchGameState();
      }
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-moss-soft selection:text-moss-dark p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabecera Principal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-sand-border gap-6">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-xs font-mono text-ink-muted hover:text-ink flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Salas</span>
              </Link>
              <span className="text-sand-300">/</span>
              <span className="text-xs font-mono uppercase tracking-widest text-moss font-semibold">
                PANEL DE CÁTEDRA
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight mt-1">
              Control de Simulación
            </h1>

            <div className="flex items-center gap-3 mt-2 text-xs font-mono text-ink-muted">
              <span>SALA: <strong className="text-ink font-bold">{gameId}</strong></span>
              <span>•</span>
              <span>ESTADO: <strong className="text-moss uppercase">{gameState?.state || 'EN LÍNEA'}</strong></span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href={`/lobby/${gameId}`}
              target="_blank"
              className="text-xs font-medium uppercase tracking-wider text-ink border border-sand-border hover:border-moss bg-sand-50 hover:bg-white px-3.5 py-2 rounded transition-all flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-moss" />
              <span>Ver QR de Sala</span>
            </Link>

            <Link
              href={`/dashboard/${gameId}`}
              target="_blank"
              className="text-xs font-medium uppercase tracking-wider text-ink border border-sand-border hover:border-moss bg-sand-50 hover:bg-white px-3.5 py-2 rounded transition-all flex items-center gap-1.5"
            >
              <Monitor className="w-3.5 h-3.5 text-moss" />
              <span>Proyectar Tablero</span>
            </Link>

            <Link
              href={`/end/${gameId}`}
              target="_blank"
              className="text-xs font-medium uppercase tracking-wider text-terracotta border border-terracotta/30 hover:border-terracotta bg-terracotta-soft px-3.5 py-2 rounded transition-all flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Podio de Resultados</span>
            </Link>
          </div>
        </div>

        {/* Mensaje de Estado / Errata */}
        {statusMsg && (
          <div className="p-4 rounded border border-sand-border bg-white text-xs font-mono text-ink flex items-center justify-between shadow-subtle">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-moss" />
              <span>{statusMsg}</span>
            </div>
            <button onClick={() => setStatusMsg('')} className="text-ink-muted hover:text-ink font-bold text-sm ml-4">
              ✕
            </button>
          </div>
        )}

        {/* Grilla Principal: Controles y Monitoreo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Columna Izquierda (7 cols): Controles de Ronda */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border border-sand-border bg-white p-7 rounded-lg shadow-paper">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-sand-border">
                <div>
                  <span className="text-[11px] font-mono tracking-widest uppercase text-moss font-semibold block">
                    SECUENCIA PEDAGÓGICA
                  </span>
                  <h2 className="font-serif text-2xl text-ink font-normal mt-0.5">
                    Gobernanza del Ciclo
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-ink-faint block uppercase">Ronda Actual</span>
                  <span className="font-serif text-2xl text-ink font-normal">
                    {gameState?.currentRound || 0} <span className="text-sm font-sans text-ink-muted">/ {gameState?.maxRounds || 8}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-3.5">
                {/* 1. Iniciar Simulación */}
                <button
                  onClick={handleStartGame}
                  disabled={loading || (gameState?.state && gameState.state !== 'lobby')}
                  className="w-full bg-sand-100 hover:bg-sand-200 disabled:opacity-40 disabled:cursor-not-allowed text-ink font-medium p-4 rounded border border-sand-border text-xs uppercase tracking-wider flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-base font-bold text-moss">01.</span>
                    <span className="font-semibold text-left">Inicializar Simulación (Abrir Ronda 1)</span>
                  </div>
                  <Play className="w-4 h-4 text-moss shrink-0" />
                </button>

                {/* 2. Evaluar y Publicar Crónica */}
                <button
                  onClick={handleCalculateRound}
                  disabled={loading || gameState?.state === 'lobby'}
                  className="w-full bg-moss hover:bg-moss-light disabled:opacity-40 disabled:cursor-not-allowed text-paper font-medium p-4 rounded border border-moss-dark text-xs uppercase tracking-wider flex items-center justify-between transition-colors shadow-subtle"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-base font-bold text-sand-300">02.</span>
                    <span className="font-semibold text-left">Evaluar Ronda y Publicar Crónica de Impacto</span>
                  </div>
                  <FileText className="w-4 h-4 text-sand-300 shrink-0" />
                </button>

                {/* 3. Siguiente Ronda */}
                <button
                  onClick={handleNextRound}
                  disabled={loading}
                  className="w-full bg-sand-50 hover:bg-sand-100 disabled:opacity-40 disabled:cursor-not-allowed text-ink font-medium p-4 rounded border border-sand-border text-xs uppercase tracking-wider flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-base font-bold text-ink-muted">03.</span>
                    <span className="font-semibold text-left">Iniciar Siguiente Ronda (Nuevo Dilema)</span>
                  </div>
                  <SkipForward className="w-4 h-4 text-ink-muted shrink-0" />
                </button>

                {/* 4. Inyectar Emergencia */}
                <button
                  onClick={handleTriggerEmergency}
                  disabled={loading || !!gameState?.activeEmergency}
                  className="w-full bg-terracotta-soft hover:bg-terracotta/20 disabled:opacity-40 disabled:cursor-not-allowed text-terracotta-dark font-medium p-4 rounded border border-terracotta/40 text-xs uppercase tracking-wider flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-base font-bold text-terracotta">04.</span>
                    <span className="font-semibold text-left">Inyectar Emergencia Relámpago (Crisis Imprevista)</span>
                  </div>
                  <AlertTriangle className="w-4 h-4 text-terracotta shrink-0" />
                </button>

                {/* 5. Pausar */}
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handlePause}
                    disabled={loading}
                    className="flex-1 bg-white hover:bg-sand-50 text-ink-muted hover:text-ink font-medium py-3 px-4 rounded border border-sand-border text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar / Reanudar</span>
                  </button>

                  <button
                    onClick={handleEndGame}
                    disabled={loading}
                    className="flex-1 bg-sand-200 hover:bg-sand-300 text-ink font-medium py-3 px-4 rounded border border-sand-border text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trophy className="w-3.5 h-3.5 text-moss" />
                    <span>Concluir Simulación</span>
                  </button>
                </div>
              </div>

              {/* Caja de Emergencia Activa */}
              {gameState?.activeEmergency && (
                <div className="mt-6 p-5 border border-terracotta bg-terracotta-soft rounded-lg space-y-3 animate-fade-in-up">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-terracotta-dark font-bold">
                    <span className="w-2 h-2 rounded-full bg-terracotta animate-ping" />
                    <span>Incidente de Emergencia Activo en Dispositivos</span>
                  </div>
                  <h3 className="font-serif text-lg text-ink font-normal">
                    {gameState.activeEmergency.title}
                  </h3>
                  <div className="text-xs font-mono text-ink-muted">
                    Respuestas de contingencia recibidas: <strong className="text-ink">{gameState.emergencyDecidedCount || 0}</strong> de {gameState.totalPlayers || 0} empresas
                  </div>
                  <button
                    onClick={handleResolveEmergency}
                    className="w-full bg-moss hover:bg-moss-light text-paper font-medium py-2.5 px-4 rounded text-xs uppercase tracking-wider border border-moss-dark transition-colors"
                  >
                    Concluir Emergencia y Retomar Ciclo Normal
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Columna Derecha (5 cols): Monitor de Alumnos Conectados */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-sand-border bg-white p-7 rounded-lg shadow-paper">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-sand-border">
                <div>
                  <span className="text-[11px] font-mono tracking-widest uppercase text-moss font-semibold block">
                    AUDITORÍA EN VIVO
                  </span>
                  <h2 className="font-serif text-2xl text-ink font-normal mt-0.5">
                    Corporaciones Conectadas
                  </h2>
                </div>
                <span className="text-xs font-mono bg-sand-100 px-2.5 py-1 rounded border border-sand-border text-ink">
                  {gameState?.decidedCount || 0} / {gameState?.totalPlayers || 0} Listas
                </span>
              </div>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {(!gameState?.companies || gameState.companies.length === 0) ? (
                  <div className="py-16 text-center text-xs font-mono text-ink-faint border border-dashed border-sand-border rounded p-6">
                    Esperando que los estudiantes escaneen el QR y registren sus consorcios...
                  </div>
                ) : (
                  gameState.companies.map((comp: any) => (
                    <div
                      key={comp.id}
                      className="p-3.5 rounded border border-sand-border bg-sand-50/60 flex items-center justify-between transition-colors hover:bg-white"
                    >
                      <div>
                        <div className="text-sm font-medium text-ink">
                          {comp.name}
                        </div>
                        <div className="text-[11px] font-mono text-ink-faint">
                          Cap: ${(Number(comp.capital) / 1000).toFixed(0)}k • ESG: {comp.esgIndex || 40}
                        </div>
                      </div>

                      <div>
                        {comp.hasDecided ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-moss bg-moss-soft px-2.5 py-1 rounded border border-moss/30 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Confirmada</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-ink-faint bg-sand-100 px-2.5 py-1 rounded border border-sand-border">
                            <Clock className="w-3 h-3" />
                            <span>Evaluando</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
