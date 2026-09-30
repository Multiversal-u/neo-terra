'use client';

import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import { ArrowLeft, Users, ShieldCheck, Sparkles } from 'lucide-react';

export default function LobbyPage({ params }: { params: { gameId: string } }) {
  const [joinUrl, setJoinUrl] = useState('');
  const [companies, setCompanies] = useState<any[]>([]);
  const [gameState, setGameState] = useState<string>('lobby');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://neo-terra-backend.onrender.com';
  const gameId = params.gameId.toUpperCase();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setJoinUrl(`${window.location.origin}/?code=${gameId}`);
    }
  }, [gameId]);

  useEffect(() => {
    const fetchLobby = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/game/${gameId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.state) {
            setCompanies(data.state.companies || []);
            setGameState(data.state.state || 'lobby');
          }
        }
      } catch (err) {
        console.error('Error consultando lobby:', err);
      }
    };

    fetchLobby();
    const interval = setInterval(fetchLobby, 2500);
    return () => clearInterval(interval);
  }, [gameId, backendUrl]);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-moss-soft selection:text-moss-dark p-6 sm:p-12 flex flex-col justify-between">
      {/* Barra Superior */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-sand-border">
        <Link href={`/admin/${gameId}`} className="text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Panel de Moderación</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-moss inline-block animate-pulse" />
          <span className="font-serif text-xl tracking-tight text-ink font-normal">NEO-TERRA</span>
          <span className="text-[10px] font-mono text-ink-muted uppercase">/ SALA DE ACCESO</span>
        </div>
      </header>

      {/* Contenido Central */}
      <main className="max-w-5xl mx-auto w-full py-10 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-moss font-semibold block">
            INGRESO MULTIJUGADOR // HORIZONTE 2045
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink font-normal tracking-tight">
            Terminal de Conexión
          </h1>
          <p className="text-base text-ink-muted font-light leading-relaxed">
            Apunta la cámara de tu dispositivo hacia el código QR o introduce la clave de sala en el portal principal.
          </p>
        </div>

        {/* Tarjeta de Código QR y Lista de Entidades */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch border border-sand-border bg-white p-8 sm:p-12 rounded-lg shadow-paper">
          
          {/* Bloque QR */}
          <div className="md:col-span-5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-sand-border pb-8 md:pb-0 md:pr-8">
            <div className="p-4 bg-sand-50 rounded-lg border border-sand-border shadow-subtle mb-4">
              {joinUrl ? (
                <QRCodeSVG value={joinUrl} size={220} bgColor="#FAF9F6" fgColor="#1A1917" level="M" />
              ) : (
                <div className="w-[220px] h-[220px] flex items-center justify-center font-mono text-xs text-ink-faint">
                  Generando código QR...
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink-faint block">
                CÓDIGO MANUAL DE SALA
              </span>
              <div className="font-serif text-3xl font-bold tracking-widest text-moss">
                {gameId}
              </div>
            </div>
          </div>

          {/* Bloque de Empresas Registradas */}
          <div className="md:col-span-7 flex flex-col justify-between pl-0 md:pl-4">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-sand-border mb-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-moss font-semibold block">
                    CONSORTIUM DIRECTORY
                  </span>
                  <h3 className="font-serif text-xl text-ink font-normal">
                    Corporaciones Conectadas
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono bg-sand-100 px-3 py-1 rounded border border-sand-border text-ink">
                  <Users className="w-3.5 h-3.5 text-moss" />
                  <span>{companies.length} Entidades</span>
                </div>
              </div>

              <div className="min-h-[180px] max-h-[260px] overflow-y-auto pr-2 space-y-2">
                {companies.length === 0 ? (
                  <div className="py-12 text-center text-xs font-mono text-ink-faint border border-dashed border-sand-border rounded p-6">
                    Aguardando conexiones de los alumnos...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {companies.map((comp) => (
                      <div
                        key={comp.id}
                        className="flex items-center gap-2.5 p-3 bg-sand-50/70 border border-sand-border rounded text-xs font-medium text-ink transition-colors hover:bg-white"
                      >
                        <span className="w-2 h-2 rounded-full bg-moss shrink-0" />
                        <span className="truncate">{comp.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-sand-border flex items-center justify-between text-xs text-ink-faint font-mono">
              <span>Estado: <strong className="text-ink uppercase font-semibold">{gameState}</strong></span>
              <span>El facilitador activará el inicio del ciclo</span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center text-xs text-ink-faint font-mono pt-6 border-t border-sand-border">
        NEO-TERRA 2045 • Gobernanza Sistémica y Sostenibilidad
      </footer>
    </div>
  );
}
