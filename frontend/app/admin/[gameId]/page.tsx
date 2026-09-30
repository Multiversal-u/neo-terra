'use client';
import React from 'react';

export default function AdminPanel({ params }: { params: { gameId: string } }) {
  return (
    <div className="min-h-screen bg-neoterra-dark text-white p-8 font-inter">
      <h1 className="text-3xl font-orbitron text-neoterra-cyan mb-8">SYSADMIN ROOT // {params.gameId}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-neoterra-navy/50 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-6 text-neoterra-gold">Simulation Controls</h2>
          <div className="flex flex-col gap-4">
            <button className="bg-neoterra-green text-black font-bold py-3 px-4 rounded hover:bg-green-400 transition-colors">
              INITIALIZE SIMULATION
            </button>
            <button className="bg-neoterra-cyan text-black font-bold py-3 px-4 rounded hover:bg-cyan-400 transition-colors">
              FORCE NEXT CYCLE
            </button>
            <button className="bg-neoterra-red text-white font-bold py-3 px-4 rounded hover:bg-red-500 transition-colors">
              EMERGENCY HALT
            </button>
          </div>
        </div>

        <div className="bg-neoterra-navy/50 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-6 text-neoterra-purple">Active Connections</h2>
          <div className="space-y-2">
            {/* Example connected players */}
            <div className="flex justify-between items-center p-3 bg-black/40 rounded border border-gray-800">
              <span>CyberDyne Corp</span>
              <span className="text-green-500 text-sm">✓ DECIDED</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/40 rounded border border-gray-800">
              <span>OmniCorp</span>
              <span className="text-yellow-500 text-sm">⏳ CALCULATING...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
