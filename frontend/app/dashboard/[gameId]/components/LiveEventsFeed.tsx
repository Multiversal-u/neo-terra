'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveEventsFeed({ events }: { events: any[] }) {
  return (
    <div className="bg-neoterra-navy/50 p-4 rounded-xl border border-neoterra-red/30 h-full flex flex-col">
      <h2 className="font-orbitron text-lg text-neoterra-red mb-2">LIVE EVENTS NETWORK</h2>
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 flex flex-col justify-end gap-2 p-2">
          <AnimatePresence>
            {(events || []).slice(-3).map((ev, i) => (
              <motion.div 
                key={ev.id || i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-black/60 border-l-4 border-neoterra-red p-3 rounded shadow-[0_0_10px_rgba(239,68,68,0.2)]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <span className="font-bold text-neoterra-gold">{ev.title || "Global Shift"}</span>
                </div>
                <p className="text-sm text-gray-300 mt-1">{ev.description || "Unprecedented market volatility detected."}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {(!events || events.length === 0) && (
             <div className="text-center text-gray-500 italic mt-auto">Awaiting network anomalies...</div>
          )}
        </div>
      </div>
    </div>
  );
}
