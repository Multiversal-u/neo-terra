'use client';
import React from 'react';

interface WaitingScreenProps {
  decidedCount?: number;
  totalCount?: number;
  onViewNarrative?: () => void;
  hasNarrative?: boolean;
}

export default function WaitingScreen({ decidedCount, totalCount, onViewNarrative, hasNarrative }: WaitingScreenProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700 p-4 font-inter">
      {/* Esfera / Núcleo Animado */}
      <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-cyan-900/40 bg-cyan-950/20 shadow-[inset_0_0_40px_rgba(6,182,212,0.2)]" />
        <div className="absolute inset-2 rounded-full border-t-2 border-r-2 border-transparent border-t-cyan-400 border-r-cyan-400/40 animate-[spin_4s_linear_infinite]" />
        <div className="absolute inset-6 rounded-full border-b-2 border-l-2 border-transparent border-b-purple-500 border-l-purple-500/40 animate-[spin_3s_linear_infinite_reverse]" />
        <div className="absolute inset-10 rounded-full border-2 border-dashed border-emerald-400/30 animate-[spin_8s_linear_infinite]" />

        <div className="flex flex-col items-center justify-center z-10 text-center">
          <span className="text-cyan-400 font-mono font-black text-lg md:text-xl tracking-widest drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
            SINCRONIZANDO
          </span>
          <span className="text-cyan-500 text-[10px] font-mono mt-1 animate-pulse">
            ESPERANDO RONDAS...
          </span>
        </div>
      </div>

      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-xl md:text-2xl font-black font-orbitron text-white tracking-widest uppercase">
          Directivas Transmitidas
        </h2>
        <p className="text-slate-400 text-xs font-mono leading-relaxed">
          Tus decisiones han sido registradas en el libro mayor de Neo-Terra. Esperando que las demás corporaciones completen su ciclo...
        </p>
      </div>

      {hasNarrative && onViewNarrative && (
        <button
          onClick={onViewNarrative}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl text-xs md:text-sm font-mono tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 border border-cyan-400 animate-pulse"
        >
          <span>📖</span> VER CRÓNICA DEL CICLO Y CONSECUENCIAS
        </button>
      )}

      <div className="bg-slate-900/80 border border-cyan-800/50 p-6 rounded-2xl max-w-md w-full backdrop-blur-sm shadow-xl">
        <h3 className="text-xs text-cyan-400 uppercase font-bold mb-3 tracking-widest flex items-center justify-between border-b border-slate-800 pb-2 font-mono">
          <span>Estado de la Red Global</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> EN LÍNEA
          </span>
        </h3>

        <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-center">
          <div className="text-3xl font-orbitron font-bold text-neoterra-gold">
            {decidedCount !== undefined && totalCount !== undefined
              ? `${decidedCount} / ${totalCount}`
              : 'EN PROCESO'}
          </div>
          <p className="text-xs font-mono text-gray-400 mt-1">
            Empresas con directivas confirmadas
          </p>
        </div>

        <p className="text-[11px] text-gray-500 font-mono text-center mt-4">
          Una vez concluido el tiempo, el Motor de Inteligencia Global calculará los efectos en cadena.
        </p>
      </div>
    </div>
  );
}
