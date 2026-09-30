'use client';
import { useState } from 'react';
import CompanyDashboard from './components/CompanyDashboard';
import DecisionPanel from './components/DecisionPanel';
import NewsTickerPanel from './components/NewsTickerPanel';
import RoundResultsModal from './components/RoundResultsModal';
import WaitingScreen from './components/WaitingScreen';

export default function GamePage({ params }: { params: { gameId: string } }) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const round = 1;

  const handleSubmit = () => {
    setHasSubmitted(true);
    // Simulate end of round delay for demonstration
    setTimeout(() => {
       setShowResults(true);
    }, 4000);
  };

  return (
    <div className="h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-cyan-500/30 overflow-hidden">
      <header className="bg-slate-900 border-b border-cyan-900/50 p-4 flex justify-between items-center shadow-md z-10 shrink-0">
        <h1 className="text-xl font-bold text-cyan-400 tracking-widest flex items-center gap-3">
          NEO-TERRA 
          <span className="text-slate-700">|</span> 
          <span className="text-xs font-mono text-slate-400">NET: {params.gameId}</span>
        </h1>
        <div className="bg-cyan-950/50 text-cyan-300 px-6 py-1.5 rounded border border-cyan-800/50 font-mono text-sm font-bold shadow-[0_0_10px_rgba(6,182,212,0.1)]">
          CYCLE {round}
        </div>
      </header>
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <CompanyDashboard />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950/80 relative scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
          {showResults ? (
            <RoundResultsModal onClose={() => { setShowResults(false); setHasSubmitted(false); }} />
          ) : hasSubmitted ? (
            <WaitingScreen />
          ) : (
            <DecisionPanel onSubmit={handleSubmit} />
          )}
        </main>
      </div>
      
      <NewsTickerPanel />
    </div>
  );
}
