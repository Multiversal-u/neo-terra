'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

interface EmergencyModalProps {
  emergency: any;
  onSubmit: (optionId: string) => Promise<void>;
  feedback?: any;
  onClose?: () => void;
}

export default function EmergencyModal({ emergency, onSubmit, feedback, onClose }: EmergencyModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>('opt_1');
  const [submitting, setSubmitting] = useState(false);
  const [localFeedback, setLocalFeedback] = useState<any>(feedback || null);

  React.useEffect(() => {
    setLocalFeedback(feedback || null);
    setSelectedOption('opt_1');
    setSubmitting(false);
  }, [emergency?.id, feedback]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(selectedOption);
      const chosen = (emergency.options || []).find((o: any) => o.id === selectedOption);
      setLocalFeedback(chosen?.feedback || 'Acción de contingencia asentada en el libro mayor.');
    } catch (err: any) {
      alert('Error enviando directiva de emergencia.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in-up">
      <div className="bg-white border border-terracotta/40 rounded-lg max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-elevated p-6 sm:p-8 space-y-6">
        
        {/* Cabecera de Contingencia */}
        <div className="text-center space-y-2.5 border-b border-sand-border pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-terracotta-soft border border-terracotta/30 text-terracotta-dark text-[10px] font-mono font-bold tracking-widest rounded uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-terracotta" />
            <span>INCIDENTE IMPREVISTO EN TIEMPO REAL // ALERTA SISTÉMICA</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif text-ink font-normal tracking-tight">
            {emergency.title}
          </h2>

          <div className="text-xs sm:text-sm text-ink-muted leading-relaxed font-light bg-sand-50 p-4 rounded border border-sand-border text-left">
            {emergency.context}
          </div>
        </div>

        {localFeedback ? (
          /* Informe Posterior a la Decisión */
          <div className="space-y-4">
            <div className="bg-moss-soft/60 p-5 rounded border border-moss/30 space-y-2">
              <span className="text-[11px] font-mono text-moss-dark font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-moss" />
                <span>Directiva de Contingencia Ejecutada</span>
              </span>
              <p className="text-xs sm:text-sm text-ink leading-relaxed font-light">
                {typeof localFeedback === 'string' ? localFeedback : localFeedback?.feedback || JSON.stringify(localFeedback)}
              </p>
            </div>

            <div className="p-4 bg-sand-50 border border-sand-border rounded text-center font-mono text-xs text-ink-muted">
              Aguardando a que la mesa central de facilitación concluya la fase de contingencia...
            </div>
          </div>
        ) : (
          /* Opciones de Acción Táctica Inmediata */
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-ink-muted font-mono uppercase tracking-wider">
              {emergency.dilemma || '¿Qué orden inmediata emite tu gabinete de contingencia?'}
            </h3>

            <div className="space-y-3">
              {(emergency.options || []).map((opt: any) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-terracotta bg-terracotta-soft/30 shadow-subtle'
                        : 'border-sand-border bg-white hover:border-sand-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        isSelected ? 'bg-terracotta text-paper' : 'bg-sand-100 text-ink-muted border border-sand-border'
                      }`}>
                        •
                      </span>
                      <div className="text-sm font-medium text-ink">
                        {opt.title || opt.label || opt.text}
                      </div>
                    </div>
                    {(opt.desc || opt.impact) && (
                      <p className="text-[11px] text-ink-faint font-mono pl-6">
                        {opt.desc || opt.impact}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-terracotta hover:bg-terracotta-dark disabled:opacity-40 text-paper font-medium py-3.5 px-6 rounded transition-all duration-200 border border-terracotta-dark flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              {submitting ? 'Transmitiendo directiva...' : 'Confirmar Orden de Crisis'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
