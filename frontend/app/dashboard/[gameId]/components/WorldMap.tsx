'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function WorldMap() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative bg-sand-50/40 p-4 rounded-lg border border-sand-border">
      <div className="absolute top-4 left-4 z-10">
        <span className="text-[10px] font-mono tracking-widest uppercase text-moss font-semibold block">
          GEOPOLÍTICA REGIONAL
        </span>
        <h2 className="font-serif text-sm md:text-base text-ink font-normal mt-0.5">
          Rutas Comerciales & Límites Planetarios
        </h2>
      </div>

      <svg viewBox="0 0 800 400" className="w-full h-full max-h-[300px]">
        {/* Continente Ficticio 1: Región Norte / Atlántico */}
        <motion.path
          d="M 100 120 Q 160 70 220 110 T 320 110 T 380 160 T 340 240 T 210 280 T 80 190 Z"
          fill="#F4F1EA"
          stroke="#2D3A29"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />

        {/* Continente Ficticio 2: Región Sur / Indo-Pacífico */}
        <motion.path
          d="M 440 160 Q 540 110 640 160 T 730 240 T 610 330 T 460 280 Z"
          fill="#F4F1EA"
          stroke="#2D3A29"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
        />

        {/* Rutas Comerciales Transfronterizas (Líneas finas con pulsos) */}
        <path 
          d="M 240 180 Q 380 130 520 200" 
          fill="none" 
          stroke="#9E9482" 
          strokeWidth="1.2" 
          strokeDasharray="4,4"
        />

        <path 
          d="M 280 230 Q 380 280 480 240" 
          fill="none" 
          stroke="#B85333" 
          strokeWidth="1" 
          strokeDasharray="3,3"
          strokeOpacity="0.7"
        />

        {/* Nodos de Interconexión Logística */}
        <circle cx="240" cy="180" r="4" fill="#2D3A29">
          <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="520" cy="200" r="4" fill="#2D3A29">
          <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" begin="1.5s" />
        </circle>
        <circle cx="380" cy="130" r="3.5" fill="#B85333" />

        {/* Etiquetas Regionales en Monospace */}
        <text x="140" y="190" fill="#615E57" fontSize="10" fontFamily="monospace" letterSpacing="1">
          ZONA AMÉRICAS-EUROPA
        </text>
        <text x="500" y="240" fill="#615E57" fontSize="10" fontFamily="monospace" letterSpacing="1">
          ZONA ASIA-PACÍFICO
        </text>
      </svg>
    </div>
  );
}
