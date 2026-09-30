'use client';
import React, { useEffect } from 'react';
import WorldMap from './components/WorldMap';
import GlobalMetricsPanel from './components/GlobalMetricsPanel';
import CompanyRankings from './components/CompanyRankings';
import LiveEventsFeed from './components/LiveEventsFeed';
import { useDashboardStore } from '../../../lib/stores/dashboardStore';

export default function DashboardPage({ params }: { params: { gameId: string } }) {
  const { allCompanies, globalWorld, currentRound, events, roundHistory } = useDashboardStore();

  return (
    <div className="min-h-screen bg-neoterra-dark text-white p-4 font-inter flex flex-col">
      <header className="flex justify-between items-center mb-6 border-b border-neoterra-cyan/30 pb-4">
        <h1 className="text-3xl font-orbitron text-neoterra-cyan tracking-widest">NEO-TERRA COMMAND CENTER</h1>
        <div className="text-xl font-orbitron text-neoterra-gold">ROUND: {currentRound || 1}</div>
        <div className="text-lg text-neoterra-purple">GAME ID: {params.gameId}</div>
      </header>
      
      <div className="flex-1 grid grid-cols-12 gap-6">
        <div className="col-span-3 space-y-6">
          <CompanyRankings companies={allCompanies} />
        </div>
        <div className="col-span-6 flex flex-col space-y-6">
          <div className="flex-1 bg-neoterra-navy/50 rounded-xl border border-neoterra-cyan/20 p-4 relative overflow-hidden">
            <WorldMap />
          </div>
          <div className="h-48">
            <LiveEventsFeed events={events} />
          </div>
        </div>
        <div className="col-span-3 space-y-6">
          <GlobalMetricsPanel metrics={globalWorld ?? undefined} />
        </div>
      </div>
    </div>
  );
}
