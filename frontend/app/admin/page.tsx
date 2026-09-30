'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldCheck, Compass, Settings2 } from 'lucide-react';

export default function AdminLandingPage() {
  const router = useRouter();
  const [rounds, setRounds] = useState(8);
  const [existingCode, setExistingCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://neo-terra-backend.onrender.com';

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
        setError(data.error || 'No fue posible crear la sesión en el servidor central.');
      }
    } catch (err: any) {
      setError(`Error de comunicación con el nodo (${backendUrl}). Verifica que el servicio esté en línea.`);
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
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-moss-soft selection:text-moss-dark flex flex-col justify-between">
      {/* Cabecera */}
      <header className="border-b border-sand-border bg-paper/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-ink-muted hover:text-ink transition-colors text-xs font-mono uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Portal Principal</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-moss" />
            <span className="font-serif text-lg text-ink font-normal">NEO-TERRA</span>
            <span className="text-[10px] font-mono text-ink-faint uppercase">/ Facilitación</span>
          </div>
        </div>
      </header>

      {/* Contenido Central */}
      <main className="max-w-3xl mx-auto px-6 py-16 w-full flex-1 flex flex-col justify-center">
        <div className="border border-sand-border bg-white p-8 sm:p-12 rounded-lg shadow-paper">
          <div className="mb-8 pb-6 border-b border-sand-border">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-moss font-semibold mb-2">
              <Settings2 className="w-3.5 h-3.5" />
              <span>Gabinete de Facilitación Pedagógica</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight">
              Gestión de Sesiones de Simulación
            </h1>
            <p className="text-sm text-ink-muted mt-2 font-light leading-relaxed">
              Configura los ciclos de juego para el aula o reanuda una sesión activa para moderar los dilemas y eventos de gobernanza.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded border border-terracotta/40 bg-terracotta-soft text-terracotta-dark text-xs leading-relaxed flex items-start gap-2">
              <span className="font-bold">Aviso:</span>
              <span>{error}</span>
            </div>
          )}

          {/* Bloque 1: Crear Nueva Sesión */}
          <div className="space-y-4 mb-10 pb-10 border-b border-sand-border">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-ink font-normal flex items-center gap-2">
                <span>01.</span>
                <span>Configurar Nueva Sala</span>
              </h2>
              <span className="text-[11px] font-mono text-moss bg-moss-soft px-2.5 py-0.5 rounded border border-moss/20">
                Recomendado
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
                Cantidad de Rondas / Ciclos de Decisión (6 a 10)
              </label>
              <input
                type="number"
                min="3"
                max="10"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="w-full bg-sand-50 border border-sand-border focus:border-moss focus:bg-white text-ink rounded p-3 font-mono text-base transition-colors"
              />
              <p className="text-[11px] text-ink-faint mt-1.5">
                Cada ronda representa 2 años cronológicos de transformaciones geopolíticas y regulatorias (Horizonte 2045).
              </p>
            </div>

            <button
              onClick={handleCreateGame}
              disabled={loading}
              className="w-full bg-moss hover:bg-moss-light disabled:opacity-40 text-paper font-medium py-3.5 px-6 rounded transition-all duration-200 border border-moss-dark flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              {loading ? 'Inicializando Sesión en el Nodo...' : 'Crear Sala e Iniciar Simulación'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bloque 2: Reanudar Sesión */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-ink font-normal flex items-center gap-2">
              <span>02.</span>
              <span>Reanudar o Moderar Sesión Existente</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Código de Sala (ej. ALPHA7)"
                value={existingCode}
                onChange={(e) => setExistingCode(e.target.value.toUpperCase())}
                className="flex-1 bg-sand-50 border border-sand-border focus:border-moss focus:bg-white text-ink rounded p-3 font-mono text-sm uppercase tracking-widest transition-colors"
              />
              <button
                onClick={handleJoinExisting}
                disabled={!existingCode.trim()}
                className="bg-sand-100 hover:bg-white text-ink font-medium px-6 py-3 rounded border border-sand-border hover:border-moss text-xs uppercase tracking-wider transition-colors disabled:opacity-40"
              >
                Abrir Panel
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-sand-border py-6 text-center text-xs text-ink-faint font-mono">
        NEO-TERRA 2045 • Laboratorio de Simulación y Gobernanza Consciente
      </footer>
    </div>
  );
}
