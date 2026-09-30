'use client';
import React, { useState } from 'react';

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
      setLocalFeedback(chosen?.feedback || 'Acción de contingencia ejecutada con éxito.');
    } catch (err: any) {
      alert('Error enviando directiva de emergencia.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 font-inter animate-in fade-in duration-300">
      <div className="bg-slate-950 border-2 border-red-500 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-[0_0_80px_rgba(239,68,68,0.4)] p-6 md:p-8 space-y-6">
        
        {/* Cabecera de Alerta Roja */}
        <div className="text-center space-y-2 border-b border-red-900/60 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950 border border-red-600 text-red-300 text-[10px] font-mono font-black tracking-widest rounded-full uppercase animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            INCIDENTE IMPREVISTO EN TIEMPO REAL // ALERTA ROJA
          </div>

          <h2 className="text-2xl md:text-3xl font-black font-orbitron text-red-400 uppercase tracking-wide">
            {emergency.title}
          </h2>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans bg-red-950/30 p-4 rounded-xl border border-red-900/40 text-left">
            {emergency.context}
          </p>
        </div>

        {localFeedback ? (
          /* Informe Posterior a la Decisión de Crisis */
          <div className="space-y-4 animate-in zoom-in-95 duration-300">
            <div className="bg-slate-900 p-5 rounded-2xl border-l-4 border-emerald-400 border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                ✓ DIRECTIVA DE CRISIS EJECUTADA
              </span>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
                {localFeedback}
              </p>
            </div>

            <div className="p-4 bg-black/50 border border-slate-800 rounded-xl text-center font-mono text-xs text-gray-400">
              Esperando que el gabinete de crisis central de Neo-Terra declare el fin de la contingencia...
            </div>
          </div>
        ) : (
          /* Opciones de Acción Táctica Inmediata */
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-wider">
                {emergency.dilemma || '¿Qué orden inmediata emite tu gabinete de contingencia?'}
              </h3>
            </div>

            <div className="space-y-3">
              {(emergency.options || []).map((opt: any) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] ring-1 ring-red-400'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-white font-orbitron">
                        {opt.title}
                      </span>
                      <span className="text-xs font-mono text-amber-400 font-bold">
                        {opt.cost > 0 ? `-$${(opt.cost / 1000).toFixed(0)}k` : 'Costo $0'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 px-6 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:shadow-[0_0_40px_rgba(239,68,68,0.7)] disabled:opacity-50 transition-all uppercase tracking-widest font-mono text-sm active:scale-95 border border-red-400 flex items-center justify-center gap-2"
              >
                {submitting ? 'Emitiendo Directiva...' : '⚡ EJECUTAR RESPUESTA DE EMERGENCIA'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
