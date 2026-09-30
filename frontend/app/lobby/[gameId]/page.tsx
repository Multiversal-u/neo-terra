'use client';
import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function LobbyPage({ params }: { params: { gameId: string } }) {
  const [joinUrl, setJoinUrl] = useState('');
  const [companies, setCompanies] = useState<any[]>([]);
  const [gameState, setGameState] = useState<string>('lobby');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setJoinUrl(`${window.location.origin}/?code=${params.gameId.toUpperCase()}`);
    }
  }, [params.gameId]);

  // Consultar periódicamente las empresas conectadas
  useEffect(() => {
    const fetchLobby = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/game/${params.gameId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.state) {
            setCompanies(data.state.companies || []);
            setGameState(data.state.state || 'lobby');
          }
        }
      } catch (err) {
        console.error('Error al consultar sala:', err);
      }
    };

    fetchLobby();
    const interval = setInterval(fetchLobby, 2500);
    return () => clearInterval(interval);
  }, [params.gameId, backendUrl]);

  return (
    <div className="min-h-screen bg-neoterra-dark text-white flex flex-col items-center justify-center p-6 md:p-12 font-inter relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-neoterra-dark to-neoterra-dark z-0" />

      <div className="z-10 text-center max-w-5xl w-full">
        <h1 className="text-5xl md:text-7xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-neoterra-cyan via-blue-400 to-neoterra-purple mb-3 animate-pulse tracking-widest">
          NEO-TERRA
        </h1>
        <p className="text-lg md:text-xl text-gray-400 tracking-widest uppercase mb-10 font-mono">
          AÑO 2045 // SALA DE ESPERA CORPORATIVA
        </p>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-center bg-slate-900/80 p-8 md:p-12 rounded-3xl border border-cyan-800/50 backdrop-blur-xl shadow-[0_0_60px_rgba(0,212,255,0.15)]">
          {/* Código QR */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              {joinUrl ? (
                <QRCodeSVG value={joinUrl} size={220} bgColor="#ffffff" fgColor="#000000" level="M" />
              ) : (
                <div className="w-[220px] h-[220px] flex items-center justify-center text-black font-mono">
                  Generando QR...
                </div>
              )}
            </div>
            <p className="text-xs text-cyan-400 font-mono font-bold tracking-wider">
              📲 ESCANEA CON TU CÁMARA
            </p>
          </div>

          {/* Información y Lista de Conectados */}
          <div className="text-left flex-1 w-full">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-cyan-900/50 mb-6">
              <span className="text-xs text-gray-400 font-mono uppercase block mb-1">
                Código de Sala para Móvil:
              </span>
              <span className="text-3xl md:text-4xl font-orbitron text-neoterra-gold font-black tracking-widest">
                {params.gameId.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-cyan-900/60 pb-2">
                <h3 className="text-sm font-bold text-neoterra-cyan font-mono tracking-wider uppercase">
                  Corporaciones Conectadas
                </h3>
                <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1 rounded-full font-bold">
                  {companies.length} entidades listas
                </span>
              </div>

              <div className="min-h-[140px] max-h-[220px] overflow-y-auto pr-2 space-y-2">
                {companies.length === 0 ? (
                  <div className="py-8 text-center text-gray-500 font-mono text-sm italic">
                    Escaneando la red en busca de conexiones entrantes...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {companies.map((comp) => (
                      <div
                        key={comp.id}
                        className="flex items-center gap-2 p-2.5 bg-black/50 border border-cyan-950 rounded-lg text-sm font-mono"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white font-bold truncate">{comp.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-xs text-gray-400 font-mono">
          <span>
            Estado del Juego:{' '}
            <strong className="text-neoterra-cyan uppercase">{gameState}</strong>
          </span>
          <span>•</span>
          <span>El expositor iniciará la partida desde su panel de control</span>
        </div>
      </div>
    </div>
  );
}
