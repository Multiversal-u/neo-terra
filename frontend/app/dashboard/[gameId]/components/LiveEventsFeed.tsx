'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Globe2 } from 'lucide-react';

export default function LiveEventsFeed({ events }: { events: any[] }) {
  const eventsList = (events || []).slice(-3);

  return (
    <div className="bg-white p-5 rounded-lg border border-sand-border shadow-paper h-full flex flex-col font-sans">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-sand-border">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-terracotta font-semibold block">
            RADAR GEOPOLÍTICO
          </span>
          <h2 className="font-serif text-lg text-ink font-normal mt-0.5 flex items-center gap-2">
            <span className="w-2 h-2 bg-terracotta rounded-full animate-pulse" />
            <span>Contingencias en Tiempo Real</span>
          </h2>
        </div>
        <span className="text-[10px] font-mono text-ink-faint uppercase">
          Feed Global
        </span>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="flex flex-col justify-end gap-2.5">
          <AnimatePresence>
            {eventsList.map((ev, i) => (
              <motion.div
                key={ev.id || i}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-sand-50 border-l-2 border-terracotta p-3.5 rounded border border-sand-border shadow-subtle"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-serif text-sm font-medium text-ink truncate">
                    {ev.name || ev.title || 'Evento Sistémico'}
                  </span>
                  {ev.category && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-sand-200 text-ink-muted shrink-0 uppercase">
                      {ev.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-muted leading-relaxed font-light">
                  {ev.description || 'Impacto en mercados internacionales por directivas corporativas agregadas.'}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>

          {(!events || events.length === 0) && (
            <div className="text-center text-ink-faint font-mono text-xs italic py-6 border border-dashed border-sand-border rounded p-4">
              Monitoreando redes globales y cadenas de valor...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
