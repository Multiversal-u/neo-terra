'use client';
import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function LobbyPage({ params }: { params: { gameId: string } }) {
  const [joinUrl, setJoinUrl] = useState('');

  useEffect(() => {
    setJoinUrl(`${window.location.origin}/game/${params.gameId}`);
  }, [params.gameId]);

  return (
    <div className="min-h-screen bg-neoterra-dark text-white flex flex-col items-center justify-center p-8 font-inter relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neoterra-navy/40 via-neoterra-dark to-neoterra-dark z-0" />
      
      <div className="z-10 text-center max-w-4xl w-full">
        <h1 className="text-6xl font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-neoterra-cyan to-neoterra-purple mb-4 animate-pulse">
          NEO-TERRA
        </h1>
        <p className="text-2xl text-gray-400 tracking-widest mb-12">YEAR 2045 // AWAITING CORPORATE UPLINK</p>

        <div className="flex flex-col md:flex-row gap-12 items-center justify-center bg-black/40 p-12 rounded-3xl border border-neoterra-cyan/20 backdrop-blur-sm shadow-[0_0_50px_rgba(0,212,255,0.1)]">
          <div className="bg-white p-4 rounded-xl">
            {joinUrl && <QRCodeSVG value={joinUrl} size={256} bgColor="#ffffff" fgColor="#000000" />}
          </div>
          
          <div className="text-left flex-1">
            <h2 className="text-3xl font-orbitron text-neoterra-gold mb-6">UPLINK CODE: <span className="text-white">{params.gameId.toUpperCase()}</span></h2>
            <div className="space-y-4 mb-8">
              <h3 className="text-xl text-neoterra-cyan border-b border-neoterra-cyan/30 pb-2">CONNECTED ENTITIES (0/8)</h3>
              <div className="min-h-[150px] text-gray-500 italic">
                Scanning for incoming connections...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
