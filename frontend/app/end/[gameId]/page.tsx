'use client';
import React, { useEffect, useState } from 'react';

export default function EndGamePage({ params }: { params: { gameId: string } }) {
  const [gameState, setGameState] = useState<any>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  const gameId = params.gameId.toUpperCase();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/game/${gameId}`);
        if (res.ok) {
          const data = await res.json();
          setGameState(data.state);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchResults();
  }, [backendUrl, gameId]);

  const companies = gameState?.companies || [];

  return (
    <div className="min-h-screen bg-neoterra-dark text-white flex flex-col items-center justify-center p-6 md:p-12 font-inter relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/20 via-neoterra-dark to-neoterra-dark pointer-events-none" />

      <div className="z-10 max-w-6xl w-full text-center space-y-10">
        <div>
          <span className="text-xs font-mono uppercase bg-amber-950 text-amber-300 border border-amber-800 px-3 py-1 rounded-full font-bold">
            RESULTADOS FINALES // EVALUACIÓN DE ARQUETIPOS
          </span>
          <h1 className="text-4xl md:text-6xl font-black font-orbitron text-neoterra-gold mt-3 mb-2 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]">
            SIMULACIÓN CONCLUIDA
          </h1>
          <p className="text-base md:text-lg text-gray-400 font-mono">
            El destino de Neo-Terra en 2045 ha sido moldeado por las decisiones de las corporaciones.
          </p>
        </div>

        {/* Tarjetas de Arquetipos de Empresas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.length === 0 ? (
            <div className="col-span-full py-12 text-gray-500 font-mono">
              Recuperando veredictos corporativos del libro mayor...
            </div>
          ) : (
            companies.map((comp: any) => (
              <div
                key={comp.id}
                className="bg-slate-900/80 p-6 rounded-2xl border border-cyan-800/40 shadow-[0_0_25px_rgba(0,212,255,0.15)] flex flex-col justify-between text-left backdrop-blur-md"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-black font-orbitron text-white truncate">
                      {comp.name}
                    </h2>
                    <span className="text-xs font-mono bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded font-bold">
                      {comp.archetype || 'Líder de Mercado'}
                    </span>
                  </div>

                  <div className="text-3xl font-mono font-bold text-emerald-400 mb-4">
                    ${((comp.capital || 1000000) / 1000000).toFixed(2)}M
                  </div>

                  <div className="space-y-1 text-xs font-mono text-gray-300 border-t border-slate-800 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reputación:</span>
                      <span className="text-cyan-300 font-bold">{comp.reputation || 50}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Índice ESG:</span>
                      <span className="text-emerald-300 font-bold">{comp.esgIndex || 40}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cuota de Mercado:</span>
                      <span className="text-amber-300 font-bold">{comp.marketShare || 5}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-gray-400 italic">
                  Clasificación basada en el balance entre rentabilidad, innovación tecnológica y sostenibilidad sistémica.
                </div>
              </div>
            ))
          )}
        </div>

        {/* Conclusiones Pedagógicas */}
        <div className="bg-slate-900/90 p-8 rounded-3xl border border-cyan-800/50 max-w-4xl mx-auto text-left shadow-2xl space-y-4">
          <h2 className="text-xl font-bold font-orbitron text-neoterra-cyan tracking-wider flex items-center gap-2">
            🎓 ANÁLISIS PEDAGÓGICO DE LA SIMULACIÓN
          </h2>
          <div className="space-y-3 text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
            <p>
              1. <strong>La sostenibilidad no es un acto de caridad:</strong> Las empresas que recurrieron exclusivamente a proveedores contaminantes por su bajo costo inicial sufrieron el embate de sanciones, aranceles verdes y boicots de consumidores a mediano y largo plazo.
            </p>
            <p>
              2. <strong>Impacto de los Sistemas de Información:</strong> En los negocios internacionales del siglo XXI, la trazabilidad de datos y la transparencia algorítmica son las variables que definen el acceso a mercados de alto valor agregado.
            </p>
            <p>
              3. <strong>Equilibrio Sistémico:</strong> Los ganadores no son simplemente quienes acumularon más capital en una sola ronda, sino aquellos que alcanzaron resiliencia frente a crisis climáticas, ciberataques y presiones regulatorias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
