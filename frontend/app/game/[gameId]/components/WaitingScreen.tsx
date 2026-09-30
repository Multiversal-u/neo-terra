'use client';

import React from 'react';
import { Clock, CheckCircle2, FileText } from 'lucide-react';

interface WaitingScreenProps {
  decidedCount?: number;
  totalCount?: number;
  onViewNarrative?: () => void;
  hasNarrative?: boolean;
}

export default function WaitingScreen({ 
  decidedCount, 
  totalCount, 
  onViewNarrative, 
  hasNarrative 
}: WaitingScreenProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-8 p-6 font-sans max-w-md mx-auto animate-fade-in-up">
      
      {/* Símbolo de Sincronización Orgánica */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-sand-border bg-sand-50" />
        <div className="absolute inset-2 rounded-full border-t border-moss animate-[spin_3s_linear_infinite]" />
        <div className="w-12 h-12 rounded-full bg-white border border-sand-border flex items-center justify-center shadow-subtle">
          <Clock className="w-5 h-5 text-moss" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <span className="text-[10px] font-mono uppercase bg-moss-soft text-moss-dark border border-moss/30 px-3 py-1 rounded font-semibold inline-block">
          DIRECTIVAS ASENTADAS EN EL LIBRO MAYOR
        </span>
        <h2 className="text-2xl font-serif text-ink font-normal">
          Decisión Registrada con Éxito
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-light">
          Tus directivas están consolidadas. Aguardando a que el facilitador evalúe el impacto sistémico del ciclo.
        </p>
      </div>

      {/* Tarjeta de Contador de Sala */}
      <div className="bg-white border border-sand-border p-6 rounded-lg w-full shadow-paper text-center space-y-2">
        <span className="text-[11px] font-mono text-ink-faint uppercase tracking-wider block">
          AVANCE COLECTIVO EN SALA
        </span>
        <div className="font-serif text-4xl text-moss font-normal">
          {decidedCount !== undefined && totalCount !== undefined
            ? `${decidedCount} / ${totalCount}`
            : 'En Progreso'}
        </div>
        <p className="text-xs text-ink-muted font-light">
          Corporaciones con directivas transmitidas
        </p>
      </div>

      {hasNarrative && onViewNarrative && (
        <button
          onClick={onViewNarrative}
          className="w-full bg-sand-100 hover:bg-white text-ink font-medium py-3 px-4 rounded border border-sand-border hover:border-moss text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
        >
          <FileText className="w-4 h-4 text-moss" />
          <span>Releer Crónica del Ciclo Previo</span>
        </button>
      )}

    </div>
  );
}
