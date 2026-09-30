'use client';
import React from 'react';

export default function EndGamePage({ params }: { params: { gameId: string } }) {
  return (
    <div className="min-h-screen bg-neoterra-dark text-white flex flex-col items-center justify-center p-8 font-inter relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      <div className="z-10 max-w-6xl w-full text-center">
        <h1 className="text-5xl font-orbitron text-neoterra-gold mb-4 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">SIMULATION CONCLUDED</h1>
        <p className="text-xl text-gray-400 mb-12">THE WORLD OF 2045 HAS BEEN SHAPED BY YOUR DECISIONS.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-neoterra-navy/80 p-8 rounded-xl border border-neoterra-cyan shadow-[0_0_20px_rgba(0,212,255,0.2)]">
            <h2 className="text-3xl font-orbitron text-white mb-2">OmniCorp</h2>
            <div className="text-neoterra-purple font-bold mb-6">THE VISIONARY</div>
            <div className="text-4xl text-neoterra-green mb-4">$4.2B</div>
            <p className="text-sm text-gray-300">Achieved market dominance through aggressive expansion while maintaining a fragile ecological balance.</p>
          </div>
          {/* More cards would map here */}
        </div>
        
        <div className="bg-black/60 p-8 rounded-xl border border-gray-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-orbitron text-neoterra-cyan mb-4">POST-MORTEM ANALYSIS</h2>
          <p className="text-gray-300 leading-relaxed text-left">
            The global temperature rose by 1.2°C during this cycle. The aggressive technological investments led to high economic output, but caused severe disruptions in social equity. We learned that unrestrained capital growth without sustainable frameworks inevitably leads to volatile geopolitical conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
