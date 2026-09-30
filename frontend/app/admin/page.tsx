'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLandingPage() {
  const router = useRouter();
  const [rounds, setRounds] = useState(8);
  const [existingCode, setExistingCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

  const handleCreateGame = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${backendUrl}/api/game/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: { maxRounds: Number(rounds) }
        }),
      });
      const data = await res.json();
      if (res.ok && data.gameId) {
        router.push(`/admin/${data.gameId}`);
      } else {
        setError(data.error || 'Error al crear la sesión en el servidor');
      }
    } catch (err: any) {
      setError(`No se pudo conectar al backend (${backendUrl}). Verifica que el servidor esté activo.`);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinExisting = () => {
    if (existingCode.trim()) {
      router.push(`/admin/${existingCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-neoterra-dark text-white flex flex-col items-center justify-center p-6 font-inter relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-neoterra-dark to-neoterra-dark pointer-events-none" />

      <div className="z-10 max-w-lg w-full bg-slate-900/80 p-8 rounded-2xl border border-cyan-800/50 backdrop-blur-xl shadow-[0_0_40px_rgba(0,212,255,0.15)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black font-orbitron text-neoterra-cyan tracking-wider mb-2">
            PANEL DEL EXPOSITOR
          </h1>
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
            Control de Simulación Global 2045
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-700/60 text-red-300 text-xs font-mono">
            ⚠️ {error}
          </div>
        )}

        {/* Crear nueva sesión */}
        <div className="space-y-4 mb-8 pb-8 border-b border-gray-800">
          <h2 className="text-sm font-bold text-neoterra-gold uppercase tracking-wider font-mono">
            Nueva Sesión de Simulación
          </h2>
          <div>
            <label className="block text-xs text-gray-400 mb-1 font-mono">
              Cantidad de Rondas (Recomendado: 6 a 10)
            </label>
            <input
              type="number"
              min="3"
              max="10"
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-full bg-slate-950/70 border border-cyan-800 rounded-lg p-3 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            onClick={handleCreateGame}
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 px-4 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 transition-all font-mono uppercase tracking-wider text-sm active:scale-95"
          >
            {loading ? 'Inicializando en Servidor...' : '🚀 Crear Nueva Sesión'}
          </button>
        </div>

        {/* Entrar a sesión existente */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider font-mono">
            Reanudar Sesión Existente
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Código o ID de sesión"
              value={existingCode}
              onChange={(e) => setExistingCode(e.target.value)}
              className="flex-1 bg-slate-950/70 border border-gray-800 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleJoinExisting}
              disabled={!existingCode.trim()}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs px-4 py-3 rounded-lg border border-cyan-900 disabled:opacity-40 transition-colors uppercase font-bold"
            >
              Abrir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
