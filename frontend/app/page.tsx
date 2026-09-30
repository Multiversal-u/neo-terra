'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShieldCheck, 
  Globe2, 
  Cpu, 
  Leaf, 
  BarChart3, 
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const [gameCode, setGameCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activePillar, setActivePillar] = useState<number | null>(0);
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://neo-terra-backend.onrender.com';

  // Detección automática de ?code=XXXX en URL (ej. escaneo de QR)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code') || params.get('gameId');
      if (code) setGameCode(code.toUpperCase());
    }
  }, []);

  const handleJoin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!gameCode.trim() || !companyName.trim()) {
      setError('Por favor indica tanto el código de acceso como el nombre corporativo.');
      return;
    }

    setLoading(true);
    setError('');

    const formattedCode = gameCode.trim().toUpperCase();
    const cleanName = companyName.trim();

    try {
      let playerId = localStorage.getItem('neo_player_id');
      if (!playerId) {
        playerId = 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
        localStorage.setItem('neo_player_id', playerId);
      }

      const res = await fetch(`${backendUrl}/api/game/${formattedCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          companyName: cleanName,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('neo_game_id', formattedCode);
        localStorage.setItem('neo_company_name', cleanName);
        localStorage.setItem('neo_company_data', JSON.stringify(data.company));
        router.push(`/game/${formattedCode}`);
      } else {
        setError(data.error || 'No se localizó la sesión indicada. Verifica que el código coincida con la pantalla de la sala.');
      }
    } catch (err: any) {
      console.error(err);
      setError('No fue posible contactar con el nodo central de simulación. Revisa la conectividad.');
    } finally {
      setLoading(false);
    }
  };

  const pillars = [
    {
      id: 0,
      title: 'Desarrollo Sostenible y Límites Planetarios',
      subtitle: 'Contabilidad de carbono, economía circular y gobernanza ambiental no lineal.',
      badge: 'Ecología Aplicada',
      body: 'La rentabilidad del siglo XXI exige operar dentro de los nueve umbrales de estabilidad biosférica de Rockström. En NEO-TERRA, la externalización de emisiones hacia proveedores lejanos activa aranceles punitivos de ajuste en frontera (CBAM) y acelera puntos de no retorno térmico.',
      icon: Leaf,
      metric: '9 Umbrales Planetarios',
    },
    {
      id: 1,
      title: 'Sistemas de Información y Resiliencia Digital',
      subtitle: 'Trazabilidad criptográfica de materias primas y defensa de infraestructuras críticas.',
      badge: 'Tecnología Sistémica',
      body: 'Los contratos opacos y la manipulación de inventarios son desenmascarados mediante auditorías algorítmicas. Las corporaciones deben presupuestar en ciberdefensa proactiva o enfrentar sabotajes a sus líneas automatizadas en puertos intermodales.',
      icon: Cpu,
      metric: 'Auditorías Cero-Complacencia',
    },
    {
      id: 2,
      title: 'Geopolítica y Negocios Internacionales',
      subtitle: 'Rutas comerciales, diplomacia corporativa y deslocalización consciente.',
      badge: 'Estrategia Global',
      body: 'La expansión hacia Asia, Europa, África o las Américas no es un mero cálculo arancelario: requiere sopesar la estabilidad institucional, el costo logístico descarbonizado y la legitimidad social de la marca ante comunidades locales.',
      icon: Globe2,
      metric: '4 Macrorregiones Dinámicas',
    },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-moss-soft selection:text-moss-dark">
      {/* Barra de cabecera editorial y minimalista */}
      <header className="border-b border-sand-border bg-paper/90 backdrop-blur sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-moss inline-block animate-pulse" />
            <Link href="/" className="font-serif text-2xl tracking-tight text-ink font-normal hover:opacity-80 transition-opacity">
              NEO-TERRA <span className="text-xs font-sans uppercase tracking-widest text-ink-muted ml-1.5 font-medium">/ 2045</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wider uppercase text-ink-muted">
            <a href="#acceso" className="hover:text-ink transition-colors">01. Acceso a Sala</a>
            <a href="#metricas" className="hover:text-ink transition-colors">02. Observatorio</a>
            <a href="#tecnologia" className="hover:text-ink transition-colors">03. Pilares Sistémicos</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-xs font-medium uppercase tracking-wider text-moss border border-sand-border hover:border-moss bg-sand-50 hover:bg-white px-4 py-2 rounded transition-all flex items-center gap-1.5"
            >
              <span>Panel Facilitador</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section: Asimétrica, tipográfica y con espacio activo */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden border-b border-sand-border">
        {/* Gráfico vectorial orgánico/computacional sutil de fondo */}
        <div className="absolute right-0 top-1/4 -translate-y-1/2 w-full lg:w-1/2 h-[500px] pointer-events-none opacity-40 mix-blend-multiply overflow-hidden">
          <svg viewBox="0 0 800 600" className="w-full h-full fill-none stroke-sand-300" strokeWidth="1">
            {/* Curvas topográficas combinadas con líneas ortogonales */}
            <path d="M 50,300 C 180,180 320,380 480,240 S 680,160 800,280" />
            <path d="M 50,340 C 200,220 340,420 500,280 S 700,200 800,320" strokeDasharray="4 6" stroke="#9E9482" />
            <path d="M 50,380 C 220,260 360,460 520,320 S 720,240 800,360" />
            <path d="M 50,420 C 240,300 380,500 540,360 S 740,280 800,400" stroke="#2D3A29" strokeOpacity="0.3" />
            {/* Retícula de coordenadas analíticas */}
            <line x1="200" y1="100" x2="200" y2="500" strokeDasharray="2 4" stroke="#DED7C8" />
            <line x1="450" y1="80" x2="450" y2="520" strokeDasharray="2 4" stroke="#DED7C8" />
            <line x1="650" y1="120" x2="650" y2="480" strokeDasharray="2 4" stroke="#DED7C8" />
            <circle cx="480" cy="240" r="4" fill="#B85333" />
            <circle cx="320" cy="380" r="3" fill="#2D3A29" />
            <circle cx="680" cy="160" r="3.5" fill="#615E57" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Columna Editorial Principal */}
            <div className="lg:col-span-7 space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 border border-sand-border bg-sand-100/70 px-3.5 py-1.5 rounded text-xs uppercase tracking-widest text-ink-muted font-medium">
                <Sparkles className="w-3.5 h-3.5 text-moss" />
                <span>Simulador Multijugador de Economía y Estrategia Global</span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.06] text-ink">
                Donde las decisiones corporativas rinden cuentas a la <span className="italic text-moss font-serif">biosfera</span>.
              </h1>

              <p className="text-lg sm:text-xl text-ink-muted font-light leading-relaxed max-w-2xl">
                Un entorno interactivo de gobernanza estratégica hacia 2045. Los equipos dirigen consorcios multinacionales navegando tensiones de suministro, ciberdefensa y regulaciones climáticas sin concesiones de maquillaje verde.
              </p>

              {/* Indicadores periodísticos compactos */}
              <div className="pt-4 grid grid-cols-3 gap-6 border-t border-sand-border text-left">
                <div>
                  <div className="font-serif text-2xl text-ink">100+</div>
                  <div className="text-xs text-ink-muted mt-1 uppercase tracking-wider">Crisis Estocásticas</div>
                </div>
                <div>
                  <div className="font-serif text-2xl text-moss">8</div>
                  <div className="text-xs text-ink-muted mt-1 uppercase tracking-wider">Arquetipos Éticos</div>
                </div>
                <div>
                  <div className="font-serif text-2xl text-terracotta">1.5°C</div>
                  <div className="text-xs text-ink-muted mt-1 uppercase tracking-wider">Límite Crítico</div>
                </div>
              </div>
            </div>

            {/* Columna Asimétrica: Terminal de Acceso a la Simulación */}
            <div id="acceso" className="lg:col-span-5 lg:mt-2">
              <div className="border border-sand-border bg-white/95 p-8 sm:p-10 rounded-lg shadow-paper transition-all">
                <div className="flex items-center justify-between pb-6 border-b border-sand-border mb-6">
                  <div>
                    <span className="text-[11px] font-mono tracking-widest uppercase text-moss font-semibold block">
                      TERMINAL DE ENTRADA
                    </span>
                    <h2 className="font-serif text-2xl text-ink font-normal mt-0.5">
                      Ingreso a la Partida
                    </h2>
                  </div>
                  <div className="w-8 h-8 rounded border border-sand-border flex items-center justify-center bg-sand-50">
                    <ShieldCheck className="w-4 h-4 text-moss" />
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded border border-terracotta/40 bg-terracotta-soft text-terracotta-dark text-xs leading-relaxed flex items-start gap-2.5">
                    <span className="font-bold">Aviso:</span>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleJoin} className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
                      Código de Sala (4 - 8 caracteres)
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      className="w-full bg-sand-50 border border-sand-border focus:border-moss focus:bg-white text-ink rounded p-3.5 text-center font-mono text-xl tracking-widest uppercase transition-colors"
                      placeholder="EJ. ALPHA7"
                      value={gameCode}
                      onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                    />
                    <p className="text-[11px] text-ink-faint mt-1.5">
                      Consúltalo con el facilitador o escanéalo desde el proyector.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
                      Nombre de la Corporación
                    </label>
                    <input
                      type="text"
                      maxLength={36}
                      className="w-full bg-sand-50 border border-sand-border focus:border-moss focus:bg-white text-ink rounded p-3.5 text-base transition-colors"
                      placeholder="Ej. Helios Dynamics, BioTerra Labs"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <p className="text-[11px] text-ink-faint mt-1.5">
                      Identidad corporativa con la que competirás en el mercado.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !gameCode.trim() || !companyName.trim()}
                    className="w-full bg-moss hover:bg-moss-light disabled:opacity-40 disabled:cursor-not-allowed text-paper font-medium py-4 px-6 rounded transition-all duration-200 border border-moss-dark flex items-center justify-center gap-2 text-sm tracking-wide active:scale-[0.99]"
                  >
                    {loading ? (
                      <span>Validando credenciales en sala...</span>
                    ) : (
                      <>
                        <span>Ingresar a la Simulación</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <p className="text-[11px] text-ink-faint leading-tight">
                      Simulación académica multiusuario • Universidad 2045
                    </p>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Sección 2: Métricas de Impacto (Estilo Infografía de Revista Editorial) */}
      <section id="metricas" className="py-24 border-b border-sand-border bg-stone-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-moss font-semibold block mb-3">
              02 / OBSERVATORIO SISTÉMICO
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink font-normal tracking-tight leading-tight">
              Métricas tangibles que miden el impacto real, sin complacencia.
            </h2>
            <p className="text-base sm:text-lg text-ink-muted mt-4 font-light leading-relaxed">
              En NEO-TERRA, las decisiones no se reducen a un saldo financiero aislado. El motor calcula las consecuencias sistémicas que tus suministros y directivas provocan sobre la sociedad y el ecosistema global.
            </p>
          </div>

          {/* Grilla infográfica con líneas finas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-sand-border">
            
            <div className="p-8 border-r border-b border-sand-border bg-paper flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-ink-faint block mb-4">
                  01 // TERMODINÁMICA
                </span>
                <div className="font-serif text-4xl text-terracotta mb-2">
                  +1.5°C
                </div>
                <div className="text-sm font-semibold text-ink mb-3">
                  Umbral Térmico Planetario
                </div>
                <p className="text-xs text-ink-muted leading-relaxed font-light">
                  Si las corporaciones priorizan suministros baratos de alta huella de carbono, la temperatura sobrepasa el límite seguro, desatando catástrofes climáticas e insolvencia.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-sand-border/60 text-[11px] font-mono text-ink-faint">
                Acuerdo de París • Retroalimentación Viva
              </div>
            </div>

            <div className="p-8 border-r border-b border-sand-border bg-paper flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-ink-faint block mb-4">
                  02 // GEOPOLÍTICA
                </span>
                <div className="font-serif text-4xl text-moss mb-2">
                  100+
                </div>
                <div className="text-sm font-semibold text-ink mb-3">
                  Contingencias Estocásticas
                </div>
                <p className="text-xs text-ink-muted leading-relaxed font-light">
                  Desde bloqueos marítimos hasta boicots laborales en el Sur Global. El catálogo de eventos responde al comportamiento agregado de todas las empresas en juego.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-sand-border/60 text-[11px] font-mono text-ink-faint">
                Event Engine • Cadenas de Valor
              </div>
            </div>

            <div className="p-8 border-r border-b border-sand-border bg-paper flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-ink-faint block mb-4">
                  03 // TAXONOMÍA ÉTICA
                </span>
                <div className="font-serif text-4xl text-ink mb-2">
                  8
                </div>
                <div className="text-sm font-semibold text-ink mb-3">
                  Arquetipos de Liderazgo
                </div>
                <p className="text-xs text-ink-muted leading-relaxed font-light">
                  Al finalizar la simulación, cada consorcio es clasificado según su equilibrio entre beneficio comercial, responsabilidad social y regeneración ambiental.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-sand-border/60 text-[11px] font-mono text-ink-faint">
                Clasificación Multicriterio ESG
              </div>
            </div>

            <div className="p-8 border-r border-b border-sand-border bg-paper flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-ink-faint block mb-4">
                  04 // INTEGRIDAD
                </span>
                <div className="font-serif text-4xl text-ink mb-2">
                  13
                </div>
                <div className="text-sm font-semibold text-ink mb-3">
                  Variables Interconectadas
                </div>
                <p className="text-xs text-ink-muted leading-relaxed font-light">
                  Capital, reputación, índice ESG, ciberseguridad y relaciones laborales evaluadas en cada ciclo mediante matrices dinámicas de causa y efecto.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-sand-border/60 text-[11px] font-mono text-ink-faint">
                Trazabilidad Cripto-Sistémica
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Sección 3: Nuestra Tecnología y Pilares (Diseño Editorial Expandible) */}
      <section id="tecnologia" className="py-24 border-b border-sand-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-moss font-semibold block">
                03 / ARQUITECTURA ACADÉMICA
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight leading-snug">
                Tres pilares formativos para la toma de decisiones complejas.
              </h2>
              <p className="text-sm sm:text-base text-ink-muted font-light leading-relaxed">
                Diseñado como una herramienta pedagógica rigurosa que conecta la ingeniería de sistemas, la sostenibilidad ambiental y la gestión de negocios transfronterizos.
              </p>

              <div className="pt-6 border-t border-sand-border">
                <div className="p-5 bg-sand-100/60 border border-sand-border rounded text-xs text-ink-muted leading-relaxed">
                  <strong className="text-ink block mb-1 font-semibold">Pedagogía por Consecuencias</strong>
                  Los participantes no reciben sermones morales: experimentan de primera mano cómo un ahorro del 15% en insumos opacos puede colapsar su reputación y cerrar mercados clave en rondas posteriores.
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {pillars.map((pillar) => {
                const IconComponent = pillar.icon;
                const isOpen = activePillar === pillar.id;

                return (
                  <div
                    key={pillar.id}
                    className="border border-sand-border rounded-lg bg-white overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setActivePillar(isOpen ? null : pillar.id)}
                      className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 hover:bg-sand-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded border border-sand-border bg-sand-50 flex items-center justify-center shrink-0">
                          <IconComponent className="w-5 h-5 text-moss" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-ink-faint block">
                            {pillar.badge}
                          </span>
                          <h3 className="font-serif text-lg sm:text-xl text-ink font-normal mt-0.5">
                            {pillar.title}
                          </h3>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-ink-muted transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-7 sm:px-7 sm:pb-7 pt-2 border-t border-sand-border/60 bg-sand-50/30">
                        <p className="text-xs uppercase tracking-wider font-semibold text-moss mb-2">
                          {pillar.subtitle}
                        </p>
                        <p className="text-sm text-ink-muted leading-relaxed font-light">
                          {pillar.body}
                        </p>
                        <div className="mt-4 pt-3 border-t border-sand-border/60 flex items-center justify-between text-xs text-ink-faint font-mono">
                          <span>Métrica Clave:</span>
                          <span className="text-ink font-semibold">{pillar.metric}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* Sección 4: Acceso para Cátedra y Proyección */}
      <section className="py-20 border-b border-sand-border bg-stone-100/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="border border-sand-border bg-white p-8 sm:p-12 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-moss font-semibold block">
                ZONA DE FACILITACIÓN & CÁTEDRA
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                ¿Eres docente o expositor a cargo de la sesión?
              </h2>
              <p className="text-sm text-ink-muted font-light leading-relaxed">
                Accede al panel de control para crear una nueva sala, proyectar el mapa global en pantalla gigante o moderar el avance de las rondas de simulación.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href="/admin"
                className="bg-moss hover:bg-moss-light text-paper font-medium py-3 px-5 rounded transition-all text-xs tracking-wider uppercase text-center border border-moss-dark"
              >
                Panel de Administración
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Colofón / Footer Editorial */}
      <footer className="py-16 bg-paper text-ink-muted text-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-sand-border pt-8">
          <div>
            <span className="font-serif text-ink text-base font-normal tracking-tight block">NEO-TERRA</span>
            <p className="text-[11px] text-ink-faint mt-1">
              Plataforma de Simulación y Gobernanza Consciente 2045.
            </p>
          </div>

          <div className="text-[11px] text-ink-faint text-left sm:text-right">
            <span>Universidad 2045 • Desarrollo Sostenible, TI y Negocios Internacionales</span>
            <div className="mt-1">Diseñado bajo principios de ecología visual y respeto cognitivo.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
