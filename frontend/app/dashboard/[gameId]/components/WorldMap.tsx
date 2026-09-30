'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function WorldMap() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <h2 className="absolute top-4 left-4 font-orbitron text-neoterra-cyan text-xl">Global Map</h2>
      <svg viewBox="0 0 800 400" className="w-full h-full opacity-80 drop-shadow-[0_0_15px_rgba(0,212,255,0.5)]">
        <motion.path
          d="M 100 100 Q 150 50 200 100 T 300 100 T 400 150 T 350 250 T 200 300 T 50 200 Z"
          fill="#0a1628"
          stroke="#00d4ff"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          whileHover={{ fill: "#1a365d" }}
        />
        <motion.path
          d="M 450 150 Q 550 100 650 150 T 750 250 T 600 350 T 450 300 Z"
          fill="#0a1628"
          stroke="#7c3aed"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
          whileHover={{ fill: "#2e1065" }}
        />
        {/* Animated Data Flows */}
        <circle cx="250" cy="180" r="4" fill="#fbbf24">
          <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="550" cy="220" r="4" fill="#fbbf24">
          <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="1s" />
        </circle>
        <path d="M 250 180 Q 400 150 550 220" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="5,5">
          <animate attributeName="stroke-dashoffset" from="100" to="0" dur="3s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  );
}
