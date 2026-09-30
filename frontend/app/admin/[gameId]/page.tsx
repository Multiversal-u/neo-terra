'use client';
import React, { useState, useEffect } from 'react';

export default function AdminPanel({ params }: { params: { gameId: string } }) {
  const [gameState, setGameState] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

  const fetchGameState = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/game/${params.gameId}`);
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
  }, [params.gameId]);

  const handleStartGame = async () => {
    setLoading(true);
    setStatusMsg('Iniciando simulación...');
    try {
      const res = await fetch(`${backendUrl}/api/game/${params.gameId}/start`, {
        method: 'POST',
      });
      if (res.ok) {
        setStatusMsg('Simulación iniciada con éxito. Ya puedes abrir la Ronda 1.');
        fetchGameState();
      } else {
        const text = await res.text();
        setStatusMsg(`Aviso: ${text}`);
      }
    } catch (err: any) {
      setStatusMsg(`Error de conexión: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNextRound = async () => {
    setLoading(true);
    setStatusMsg('Avanzando de ronda...');
    try {
      const res = await fetch(`${backendUrl}/api/admin/${params.gameId}/nextRound`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.finished) {
          setStatusMsg('¡La simulación ha finalizado! Revisa la pantalla de resultados.');
        } else {
          setStatusMsg(`Ronda ${data.round?.currentRound || ''} iniciada correctamente.`);
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
      const res = await fetch(`${backendUrl}/api/admin/${params.gameId}/pause`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg(`Estado cambiado a: ${data.state}`);
        fetchGameState();
      }
  const handleTriggerEmergency = async () => {
    setLoading(true);
    setStatusMsg('Activando incidente de emergencia relámpago...');
    try {
      const res = await fetch(`${backendUrl}/api/admin/${params.gameId}/emergency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setStatusMsg(`🚨 EMERGENCIA ACTIVADA: ${data.emergency?.title}`);
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
      const res = await fetch(`${backendUrl}/api/admin/${params.gameId}/resolveEmergency`, {
        method: 'POST',
      });
      if (res.ok) {
        setStatusMsg('✓ Emergencia concluida. Simulación reanudada con éxito.');
        fetchGameState();
      }
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neoterra-dark text-white p-8 font-inter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-cyan-900/50 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-orbitron text-neoterra-cyan tracking-wider">
            PANEL DE CONTROL DEL EXPOSITOR
          </h1>
          <p className="text-sm font-mono text-gray-400 mt-1">
            SESIÓN: <span className="text-neoterra-gold font-bold">{params.gameId}</span> | ESTADO:{' '}
            <span className="text-neoterra-cyan uppercase">{gameState?.state || 'CARGANDO...'}</span>
          </p>
        </div>
        <div className="flex gap-4">
          <a
            href={`/dashboard/${params.gameId}`}
            target="_blank"
            rel="noreferrer"
            className="bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/50 px-4 py-2 rounded-lg font-mono text-sm transition-all flex items-center gap-2"
          >
            🖥️ Proyectar Dashboard
          </a>
          <a
            href={`/lobby/${params.gameId}`}
            target="_blank"
            rel="noreferrer"
            className="bg-cyan-950/60 hover:bg-cyan-900 text-cyan-200 border border-cyan-500/50 px-4 py-2 rounded-lg font-mono text-sm transition-all flex items-center gap-2"
          >
            📱 Ver QR de Acceso
          </a>
        </div>
      </div>

      {statusMsg && (
        <div className="mb-6 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 font-mono text-sm flex items-center justify-between">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg('')} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controles de Simulación */}
        <div className="bg-neoterra-navy/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-2 text-neoterra-gold font-orbitron flex items-center gap-2">
            ⚙️ Controles de Ronda
          </h2>
          <p className="text-xs text-gray-400 mb-6 font-mono">
            Ronda actual: <strong className="text-white">{gameState?.currentRound || 0}</strong> de {gameState?.maxRounds || 8}
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleStartGame}
              disabled={loading || (gameState?.state && gameState.state !== 'lobby')}
              className="bg-neoterra-green text-black font-bold py-3.5 px-4 rounded-lg hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-mono tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              ▶ 1. INICIALIZAR SIMULACIÓN (Abrir Juego)
            </button>

            <button
              onClick={handleNextRound}
              disabled={loading}
              className="bg-neoterra-cyan text-black font-bold py-3.5 px-4 rounded-lg hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-mono tracking-wider shadow-[0_0_15px_rgba(0,212,255,0.2)]"
            >
              ⏭ 2. INICIAR SIGUIENTE RONDA (Enviar a Celulares)
            </button>

            <button
              onClick={handlePause}
              disabled={loading}
              className="bg-neoterra-red/80 text-white font-bold py-3 px-4 rounded-lg hover:bg-neoterra-red transition-all font-mono tracking-wider"
            >
              ⏸ PAUSAR / REANUDAR
            </button>

            <button
              onClick={handleTriggerEmergency}
              disabled={loading || !!gameState?.activeEmergency}
              className="bg-amber-500 hover:bg-amber-400 text-black font-black py-3.5 px-4 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all font-mono tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 border border-amber-400"
            >
              🚨 3. INYECTAR EMERGENCIA RELÁMPAGO (Crisis)
            </button>

            {gameState?.activeEmergency && (
              <div className="p-4 bg-red-950/90 border-2 border-red-500 rounded-xl space-y-2 mt-2">
                <div className="font-bold text-red-300 font-mono text-xs uppercase flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  INCIDENTE DE EMERGENCIA ACTIVO EN DISPOSITIVOS
                </div>
                <div className="font-bold text-sm text-white font-orbitron">{gameState.activeEmergency.title}</div>
                <div className="text-xs text-gray-300 font-mono">
                  Respuestas de crisis recibidas: <strong className="text-amber-300">{gameState.emergencyDecidedCount || 0}</strong> de {gameState.totalPlayers || 0} empresas
                </div>
                <button
                  onClick={handleResolveEmergency}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg text-xs uppercase font-mono tracking-wider mt-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  ✓ Concluir Emergencia y Reanudar Simulación
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Empresas Conectadas */}
        <div className="bg-neoterra-navy/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-2 text-neoterra-purple font-orbitron flex items-center justify-between">
            <span>🏢 Empresas Conectadas</span>
            <span className="text-sm font-mono text-cyan-400">
              ({gameState?.companies?.length || 0} empresas)
            </span>
          </h2>
          <p className="text-xs text-gray-400 mb-4 font-mono">
            Decisiones enviadas esta ronda: {gameState?.decidedCount || 0} / {gameState?.totalPlayers || 0}
          </p>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {(!gameState?.companies || gameState.companies.length === 0) ? (
              <div className="text-center py-12 text-gray-500 font-mono text-sm border border-dashed border-gray-800 rounded-lg">
                Esperando que los estudiantes escaneen el QR y se conecten...
              </div>
            ) : (
              gameState.companies.map((company: any) => (
                <div
                  key={company.id}
                  className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-gray-800"
                >
                  <div>
                    <span className="font-bold text-white">{company.name}</span>
                    <span className="text-xs text-gray-400 ml-2 font-mono">
                      (Cap: ${(company.capital / 1000).toFixed(0)}k)
                    </span>
                  </div>
                  <div>
                    {company.hasDecided ? (
                      <span className="text-green-400 text-xs font-mono font-bold bg-green-950/60 border border-green-800 px-2 py-0.5 rounded">
                        ✓ DECISIÓN LISTA
                      </span>
                    ) : (
                      <span className="text-yellow-400 text-xs font-mono bg-yellow-950/60 border border-yellow-800 px-2 py-0.5 rounded animate-pulse">
                        ⏳ PENSANDO...
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
  );
}
