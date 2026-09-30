'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinPage() {
  const [gameCode, setGameCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

  // Si viene con ?code=XXXX en el QR
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code') || params.get('gameId');
      if (code) setGameCode(code.toUpperCase());
    }
  }, []);

  const handleJoin = async () => {
    if (!gameCode.trim() || !companyName.trim()) {
      setError('Por favor ingresa el código de acceso y el nombre de tu empresa.');
      return;
    }

    setLoading(true);
    setError('');

    const formattedCode = gameCode.trim().toUpperCase();
    const cleanName = companyName.trim();

    try {
      // Generar o recuperar ID de jugador persistente en este celular
      let playerId = localStorage.getItem('neo_player_id');
      if (!playerId) {
        playerId = 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
        localStorage.setItem('neo_player_id', playerId);
      }

      // Conectar y registrar la empresa en el backend
      const res = await fetch(`${backendUrl}/api/game/${formattedCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          companyName: cleanName,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Guardar datos en local
        localStorage.setItem('neo_game_id', formattedCode);
        localStorage.setItem('neo_company_name', cleanName);
        localStorage.setItem('neo_company_data', JSON.stringify(data.company));

        // Redirigir a la pantalla de juego del alumno
        router.push(`/game/${formattedCode}`);
      } else {
        setError(data.error || 'No se encontró la partida. Verifica que el código sea correcto.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Error al conectar con el servidor. Revisa tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-400 flex flex-col items-center justify-center p-4 overflow-hidden relative font-inter">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="z-10 bg-slate-900/90 p-8 rounded-2xl border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.2)] w-full max-w-md backdrop-blur-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black font-orbitron tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-sm mb-2">
            NEO-TERRA
          </h1>
          <p className="text-slate-400 text-xs tracking-widest uppercase font-mono">
            Simulador de Estrategia Global 2045
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-700/60 text-red-300 text-xs font-mono">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold mb-2 text-cyan-500 uppercase tracking-wider font-mono">
              1. Código de Acceso a la Simulación
            </label>
            <input
              type="text"
              maxLength={8}
              className="w-full bg-slate-950/70 border border-cyan-800 rounded-lg p-4 text-cyan-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono text-center text-2xl tracking-widest uppercase"
              placeholder="EJ. ALPHA7"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 text-cyan-500 uppercase tracking-wider font-mono">
              2. Nombre de tu Corporación Tecnológica
            </label>
            <input
              type="text"
              maxLength={40}
              className="w-full bg-slate-950/70 border border-cyan-800 rounded-lg p-4 text-cyan-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono text-center text-lg"
              placeholder="Ej: BioGenix, NovaTech, OmniCorp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
          </div>

          <button
            onClick={handleJoin}
            disabled={loading || !gameCode.trim() || !companyName.trim()}
            className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-4 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all uppercase tracking-widest active:scale-95 font-mono text-sm"
          >
            {loading ? 'Conectando con el Servidor...' : '🌐 Conectar a la Simulación'}
          </button>

          <p className="text-center text-[11px] text-slate-500 font-mono">
            Universidad 2045 • Desarrollo Sostenible, TI y Negocios Internacionales
          </p>
        </div>
      </div>
    </div>
  );
}
