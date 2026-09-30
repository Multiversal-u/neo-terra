'use client';
import React, { useEffect, useState } from 'react';

const ARCHETYPE_META: Record<string, { label: string; icon: string; color: string; desc: string }> = {
  LiderSustentable: {
    label: 'Líder Sustentable',
    icon: '🌿',
    color: 'border-emerald-500 bg-emerald-950/80 text-emerald-300',
    desc: 'Mínima huella ambiental, máxima reputación y cumplimiento normativo ejemplar.',
  },
  InnovadorResponsable: {
    label: 'Innovador Responsable',
    icon: '💡',
    color: 'border-cyan-500 bg-cyan-950/80 text-cyan-300',
    desc: 'Alta inversión en I+D tecnológico alineada con rigurosos estándares ESG y bioética.',
  },
  ModeloESG: {
    label: 'Modelo ESG Triple A',
    icon: '⚖️',
    color: 'border-teal-500 bg-teal-950/80 text-teal-300',
    desc: 'Prioridad absoluta a proveedores certificados, comercio justo y transparencia de datos.',
  },
  ImperioCoporativo: {
    label: 'Imperio Corporativo',
    icon: '🏛️',
    color: 'border-amber-500 bg-amber-950/80 text-amber-300',
    desc: 'Dominio masivo de capital y cuota de mercado con economías de escala globales.',
  },
  PotenciaTecnologica: {
    label: 'Potencia Tecnológica',
    icon: '⚡',
    color: 'border-purple-500 bg-purple-950/80 text-purple-300',
    desc: 'Vanguardia absoluta en IA, automatización y ciberdefensa cuántica.',
  },
  GiganteDisruptivo: {
    label: 'Gigante Disruptivo',
    icon: '🚀',
    color: 'border-indigo-500 bg-indigo-950/80 text-indigo-300',
    desc: 'Crecimiento meteórico y captura agresiva de mercado basada en plataformas disruptivas.',
  },
  CorporacionExtractiva: {
    label: 'Corporación Extractiva',
    icon: '🏭',
    color: 'border-orange-500 bg-orange-950/80 text-orange-300',
    desc: 'Márgenes de rentabilidad a corto plazo con severo riesgo de sanciones y huella ecológica.',
  },
  EmpresaEnCrisis: {
    label: 'Empresa en Crisis',
    icon: '⚠️',
    color: 'border-red-500 bg-red-950/80 text-red-300',
    desc: 'Descapitalización crítica o daño reputacional grave tras colapsos regulatorios.',
  },
  SobrevivienteMercado: {
    label: 'Sobreviviente de Mercado',
    icon: '🛡️',
    color: 'border-blue-500 bg-blue-950/80 text-blue-300',
    desc: 'Estrategia balanceada y resiliente ante las presiones inflacionarias y climáticas de 2045.',
  },
};

export default function EndGamePage({ params }: { params: { gameId: string } }) {
  const [gameState, setGameState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  const gameId = params.gameId.toUpperCase();

  const fetchResults = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/game/${gameId}`);
      if (res.ok) {
        const data = await res.json();
        setGameState(data.state);
      }
    } catch (err) {
      console.error('Error al recuperar resultados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 4000);
    return () => clearInterval(interval);
  }, [backendUrl, gameId]);

  const calculateScore = (comp: any) => {
    if (comp.compositeScore !== undefined && comp.compositeScore !== null) {
      return comp.compositeScore;
    }
    const capital = comp.capital || 0;
    const esg = comp.esgIndex || 0;
    const rep = comp.reputation || 0;
    const share = comp.marketShare || 0;
    const tech = comp.techLevel || 0;
    const footprint = comp.environmentalFootprint || 0;

    let score = (capital / 500) + (esg * 25) + (rep * 20) + (share * 100) + (tech * 10);
    if (rep < 20) score -= 1500;
    if (footprint > 75) score -= 1000;
    if (capital < 200000) score -= 1500;
    return Math.round(score);
  };

  const rawCompanies = gameState?.rankings?.length
    ? gameState.rankings
    : gameState?.companies || [];

  const companies = rawCompanies.slice().sort((a: any, b: any) => {
    return calculateScore(b) - calculateScore(a);
  });

  const world = gameState?.globalWorld;

  return (
    <div className="min-h-screen bg-neoterra-dark text-white p-6 md:p-12 font-inter relative overflow-x-hidden selection:bg-amber-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-neoterra-dark pointer-events-none" />

      <div className="z-10 max-w-7xl mx-auto space-y-12 relative">
        {/* Cabecera y Navegación */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-amber-900/50 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase bg-amber-950 text-amber-300 border border-amber-700 px-3 py-1 rounded-full font-bold">
                EVALUACIÓN SISTÉMICA // RESULTADOS FINALES 2045
              </span>
              <span className="text-xs font-mono text-gray-400">SALA: {gameId}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-orbitron text-neoterra-gold drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]">
              PODIO DE RESULTADOS
            </h1>
            <p className="text-sm md:text-base text-gray-400 font-mono mt-1">
              Dictamen final de arquetipos corporativos, balance de capital y salud planetaria.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchResults}
              className="bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800 px-4 py-2 rounded-xl font-mono text-xs transition-all"
            >
              🔄 Actualizar
            </button>
            <a
              href={`/dashboard/${gameId}`}
              className="bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-600/60 px-4 py-2 rounded-xl font-mono text-xs transition-all flex items-center gap-1.5"
            >
              🖥️ Ver Dashboard
            </a>
          </div>
        </div>

        {/* Podio Top 3 */}
        {companies.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-6 max-w-4xl mx-auto">
            {/* 2do Lugar (Plata) */}
            <div className="bg-slate-900/90 border-2 border-slate-400 rounded-3xl p-6 text-center space-y-3 order-2 md:order-1 shadow-[0_0_30px_rgba(148,163,184,0.2)] md:-translate-y-2">
              <div className="text-4xl">🥈</div>
              <div className="text-xs font-mono font-bold text-slate-300 tracking-widest uppercase">
                2° LUGAR // SUBCAMPEÓN
              </div>
              <h3 className="text-xl font-black font-orbitron text-white truncate">
                {companies[1].name}
              </h3>
              <div className="text-2xl font-mono font-bold text-emerald-400">
                ${((companies[1].capital || 1000000) / 1000000).toFixed(2)}M
              </div>
              <div className="inline-block text-xs font-mono font-bold bg-slate-800 text-slate-200 px-3 py-1 rounded-full border border-slate-700">
                ⭐ {calculateScore(companies[1]).toLocaleString()} pts
              </div>
              <div className="text-xs font-mono text-gray-400">
                ESG: <span className="text-emerald-300 font-bold">{companies[1].esgIndex}/100</span> | Rep:{' '}
                <span className="text-cyan-300 font-bold">{companies[1].reputation}/100</span>
              </div>
            </div>

            {/* 1er Lugar (Oro) */}
            <div className="bg-gradient-to-b from-amber-950/90 to-slate-900 border-2 border-amber-400 rounded-3xl p-8 text-center space-y-4 order-1 md:order-2 shadow-[0_0_50px_rgba(251,191,36,0.4)] md:-translate-y-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[11px] font-orbitron font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                👑 CAMPEÓN SUPREMO
              </div>
              <div className="text-5xl animate-bounce">🥇</div>
              <div className="text-xs font-mono font-bold text-amber-300 tracking-widest uppercase">
                1° LUGAR // LÍDER GLOBAL
              </div>
              <h3 className="text-2xl font-black font-orbitron text-amber-300 truncate">
                {companies[0].name}
              </h3>
              <div className="text-3xl font-mono font-black text-emerald-400">
                ${((companies[0].capital || 1000000) / 1000000).toFixed(2)}M
              </div>
              <div className="inline-block text-xs font-mono font-bold bg-amber-950 text-amber-300 px-4 py-1 rounded-full border border-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                ⭐ {calculateScore(companies[0]).toLocaleString()} pts
              </div>
              <div className="text-xs font-mono text-gray-300">
                ESG: <span className="text-emerald-300 font-bold">{companies[0].esgIndex}/100</span> | Rep:{' '}
                <span className="text-cyan-300 font-bold">{companies[0].reputation}/100</span>
              </div>
            </div>

            {/* 3er Lugar (Bronce) */}
            <div className="bg-slate-900/90 border-2 border-amber-700/80 rounded-3xl p-6 text-center space-y-3 order-3 shadow-[0_0_30px_rgba(180,83,9,0.2)]">
              <div className="text-4xl">🥉</div>
              <div className="text-xs font-mono font-bold text-amber-600 tracking-widest uppercase">
                3° LUGAR // TERCER PUESTO
              </div>
              <h3 className="text-xl font-black font-orbitron text-white truncate">
                {companies[2].name}
              </h3>
              <div className="text-2xl font-mono font-bold text-emerald-400">
                ${((companies[2].capital || 1000000) / 1000000).toFixed(2)}M
              </div>
              <div className="inline-block text-xs font-mono font-bold bg-slate-800 text-amber-500 px-3 py-1 rounded-full border border-amber-800">
                ⭐ {calculateScore(companies[2]).toLocaleString()} pts
              </div>
              <div className="text-xs font-mono text-gray-400">
                ESG: <span className="text-emerald-300 font-bold">{companies[2].esgIndex}/100</span> | Rep:{' '}
                <span className="text-cyan-300 font-bold">{companies[2].reputation}/100</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabla / Tarjetas de Todas las Empresas y Arquetipos */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black font-orbitron text-white tracking-wider flex items-center gap-3">
            <span>🏢</span> CLASIFICACIÓN DE ARQUETIPOS CORPORATIVOS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.length === 0 ? (
              <div className="col-span-full py-16 text-center text-gray-500 font-mono border border-dashed border-gray-800 rounded-3xl">
                {loading ? 'Cargando libro mayor corporativo...' : 'Aún no hay empresas registradas en esta sala.'}
              </div>
            ) : (
              companies.map((comp: any, idx: number) => {
                const archKey = comp.archetype || 'SobrevivienteMercado';
                const arch = ARCHETYPE_META[archKey] || ARCHETYPE_META.SobrevivienteMercado;

                return (
                  <div
                    key={comp.id || idx}
                    className="bg-slate-900/80 p-6 rounded-3xl border border-cyan-800/40 shadow-xl flex flex-col justify-between text-left backdrop-blur-md transition-all hover:border-cyan-500/60"
                  >
                    <div>
                      {/* Cabecera de Empresa */}
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 block uppercase">
                            Posición #{idx + 1}
                          </span>
                          <h3 className="text-xl font-black font-orbitron text-white truncate max-w-[200px]">
                            {comp.name}
                          </h3>
                        </div>
                        <span
                          className={`text-xs font-mono border px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shrink-0 ${arch.color}`}
                        >
                          <span>{arch.icon}</span>
                          <span>{arch.label}</span>
                        </span>
                      </div>

                      {/* Capital y Puntaje */}
                      <div className="flex justify-between items-baseline mb-4">
                        <div className="text-3xl font-mono font-black text-emerald-400">
                          ${((comp.capital || 1000000) / 1000000).toFixed(2)}M
                        </div>
                        <div className="text-xs font-mono font-bold text-amber-300 bg-amber-950/70 border border-amber-800/80 px-2.5 py-1 rounded-lg">
                          ⭐ {calculateScore(comp).toLocaleString()} pts
                        </div>
                      </div>

                      {/* Descripción del Arquetipo */}
                      <p className="text-xs text-gray-300 font-sans leading-relaxed mb-4 p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                        {arch.desc}
                      </p>

                      {/* Variables Clave */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono border-t border-slate-800/80 pt-3">
                        <div className="bg-slate-950/50 p-2 rounded-lg">
                          <span className="text-[10px] text-gray-500 block">Reputación</span>
                          <span className="text-cyan-300 font-bold">{comp.reputation || 50}/100</span>
                        </div>
                        <div className="bg-slate-950/50 p-2 rounded-lg">
                          <span className="text-[10px] text-gray-500 block">Índice ESG</span>
                          <span className="text-emerald-300 font-bold">{comp.esgIndex || 40}/100</span>
                        </div>
                        <div className="bg-slate-950/50 p-2 rounded-lg">
                          <span className="text-[10px] text-gray-500 block">Cuota Mercado</span>
                          <span className="text-amber-300 font-bold">{comp.marketShare || 5}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/60 text-[10px] text-gray-500 font-mono flex justify-between">
                      <span>Tecnología: {comp.techLevel || 30}/100</span>
                      <span>Decisión lista: ✓</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Estado Final del Planeta Neo-Terra */}
        {world && (
          <div className="bg-slate-900/90 border border-cyan-800/60 p-6 md:p-8 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold font-orbitron text-neoterra-cyan tracking-wider flex items-center gap-2">
              🌍 ESTADO FINAL DEL PLANETA NEO-TERRA
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-center">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs text-gray-400 block uppercase">Temperatura Global</span>
                <span className="text-2xl font-black text-rose-400">+{world.globalTemperature}°C</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs text-gray-400 block uppercase">Estabilidad Económica</span>
                <span className="text-2xl font-black text-emerald-400">{world.economicStability}/100</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs text-gray-400 block uppercase">Confianza del Consumidor</span>
                <span className="text-2xl font-black text-cyan-400">{world.consumerConfidence}/100</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs text-gray-400 block uppercase">Índice Sostenibilidad</span>
                <span className="text-2xl font-black text-amber-300">{world.sustainabilityIndex}/100</span>
              </div>
            </div>
          </div>
        )}

        {/* Conclusiones Pedagógicas */}
        <div className="bg-slate-900/95 p-8 md:p-10 rounded-3xl border border-cyan-800/60 max-w-5xl mx-auto text-left shadow-2xl space-y-6">
          <h2 className="text-2xl font-black font-orbitron text-neoterra-cyan tracking-wider flex items-center gap-3">
            🎓 ANÁLISIS PEDAGÓGICO DE LA SIMULACIÓN
          </h2>
          <div className="space-y-4 text-sm md:text-base text-gray-300 leading-relaxed font-sans">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <strong className="text-amber-300 font-orbitron text-sm block mb-1">
                1. La Sostenibilidad como Ventaja Competitiva:
              </strong>
              Las organizaciones que optaron únicamente por proveedores contaminantes por su bajo costo inicial sufrieron el embate de aranceles verdes, sanciones y boicots internacionales en las rondas medias y finales.
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <strong className="text-cyan-300 font-orbitron text-sm block mb-1">
                2. Sistemas de Información y Trazabilidad:
              </strong>
              En los negocios internacionales contemporáneos, la transparencia criptográfica de la cadena de valor y la ciberdefensa ya no son gastos operativos, sino los activos estratégicos que aseguran el acceso a mercados de alto valor.
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <strong className="text-emerald-300 font-orbitron text-sm block mb-1">
                3. Resiliencia Sistémica Multidimensional:
              </strong>
              El verdadero éxito corporativo en el siglo XXI no se mide únicamente por la acumulación transitoria de liquidez, sino por la capacidad de resistir perturbaciones no lineales: crisis climáticas, disrupciones logísticas e incidentes cibernéticos imprevistos.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
