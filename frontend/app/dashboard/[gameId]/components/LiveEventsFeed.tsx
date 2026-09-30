'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveEventsFeed({ events }: { events: any[] }) {
  const eventsList = (events || []).slice(-3);

  return (
    <div className="bg-neoterra-navy/60 p-4 rounded-2xl border border-red-900/40 h-full flex flex-col font-inter backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-orbitron text-sm font-black text-red-400 tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          ALERTAS Y EVENTOS EN VIVO
        </h2>
        <span className="text-[10px] font-mono text-gray-400 uppercase">
          Feed Global
        </span>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 flex flex-col justify-end gap-2 p-1">
          <AnimatePresence>
            {eventsList.map((ev, i) => (
              <motion.div
                key={ev.id || i}
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-black/70 border-l-4 border-red-500 p-3 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs">⚠️</span>
                  <span className="font-bold text-xs text-amber-300 font-orbitron uppercase truncate">
                    {ev.name || ev.title || 'Evento Sistémico'}
                  </span>
                  {ev.category && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 ml-auto">
                      {ev.category}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-300 leading-tight font-sans">
                  {ev.description || 'Impacto en mercados internacionales por decisiones corporativas.'}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>

          {(!events || events.length === 0) && (
            <div className="text-center text-gray-500 font-mono text-xs italic py-4">
              Monitoreando redes globales en busca de anomalías...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
