'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinPage() {
  const [gameCode, setGameCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const router = useRouter();

  const handleJoin = () => {
    if (gameCode && companyName) {
      // Connect socket logic here
      router.push(`/game/${gameCode}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-400 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/cyber-grid.svg')] bg-cover opacity-10 animate-pulse pointer-events-none" />
      <div className="z-10 bg-slate-900/80 p-8 rounded-xl border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)] w-full max-w-md backdrop-blur-xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-sm mb-2">NEO-TERRA</h1>
          <p className="text-slate-400 text-sm tracking-widest uppercase">Global Simulation Protocol 2045</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold mb-2 text-cyan-500 uppercase tracking-wider">Access Code</label>
            <input 
              type="text" 
              className="w-full bg-slate-950/50 border border-cyan-800 rounded-md p-4 text-cyan-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono text-center text-xl tracking-widest"
              placeholder="000-000"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-cyan-900/50"></div>
            <div className="text-cyan-700 text-xs font-bold uppercase">OR</div>
            <div className="flex-1 h-px bg-cyan-900/50"></div>
          </div>
          
          <button className="w-full py-3 bg-slate-800/50 border border-cyan-800/50 rounded-md text-cyan-500 hover:bg-slate-800 hover:text-cyan-300 transition-colors flex items-center justify-center gap-2 font-mono text-sm">
             [ SCAN NEURAL QR ]
          </button>
          
          <div className="pt-4">
            <label className="block text-xs font-bold mb-2 text-cyan-500 uppercase tracking-wider">Corporate Identity</label>
            <input 
              type="text" 
              className="w-full bg-slate-950/50 border border-cyan-800 rounded-md p-4 text-cyan-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
              placeholder="e.g. OmniCorp / BioGenix"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          
          <button 
            onClick={handleJoin}
            disabled={!gameCode || !companyName}
            className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-4 rounded-md shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:shadow-none transition-all uppercase tracking-widest active:scale-95"
          >
            Initialize Uplink
          </button>
        </div>
      </div>
    </div>
  );
}
