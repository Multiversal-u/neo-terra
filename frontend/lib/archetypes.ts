export interface ArchetypeDetail {
  id: string;
  label: string;
  icon: string;
  badgeClass: string;
  tagline: string;
  criteria: string;
  description: string;
  meaning: string;
  strengths: string[];
  risks: string[];
  realWorld: string;
  lesson: string;
  reflection: string;
}

export const ARCHETYPE_CATALOG: Record<string, ArchetypeDetail> = {
  LiderSustentable: {
    id: 'LiderSustentable',
    label: 'Líder Sustentable',
    icon: '🌿',
    badgeClass: 'bg-moss-soft text-moss-dark border-moss/30',
    tagline: 'Demostraste que la sostenibilidad también es un modelo de negocio de alto rendimiento.',
    criteria: 'Índice ESG ≥ 70, huella ambiental ≤ 35 y relación con reguladores ≥ 65.',
    description: 'Tu corporación redujo su impacto ambiental de forma tangible, mantuvo relaciones institucionales transparentes con gobiernos y lideró el ranking de sostenibilidad del mercado global.',
    meaning: 'Tu liderazgo operó con visión de largo plazo: entendiste que la licencia social para operar, la eficiencia energética y la descarbonización son activos estratégicos que no se pueden copiar de la noche a la mañana.',
    strengths: [
      'Inmunidad absoluta frente a aranceles de carbono, multas y embargos comerciales.',
      'Acceso preferencial a capital verde y licitaciones gubernamentales de alto valor.',
      'Fidelidad incondicional de consumidores conscientes y legitimidad social.'
    ],
    risks: [
      'Márgenes operativos más estrechos en los primeros ciclos por inversiones de capital.',
      'Vulnerabilidad temporal ante rivales con prácticas agresivas de bajo costo.',
      'Exige coherencia ética permanente: un solo traspié genera una penalización severa.'
    ],
    realWorld: 'Empresas pioneras como Interface o Ørsted, que transformaron industrias petroleras o extractivas tradicionales en modelos 100% renovables y rentables.',
    lesson: 'La rentabilidad sostenible no es una campaña de relaciones públicas: es una secuencia disciplinada de decisiones coherentes a lo largo del tiempo.',
    reflection: '¿Qué directiva de tu equipo requirió mayor convicción para resistir la tentación del margen financiero inmediato?'
  },

  InnovadorResponsable: {
    id: 'InnovadorResponsable',
    label: 'Innovador Responsable',
    icon: '💡',
    badgeClass: 'bg-sand-100 text-ink border-sand-border',
    tagline: 'Tecnología de frontera guiada por una brújula bioética incorruptible.',
    criteria: 'Innovación ≥ 65, índice ESG ≥ 60 y nivel tecnológico ≥ 55.',
    description: 'Invertiste fuertemente en I+D, automatización e IA sin descuidar los estándares laborales, la privacidad de datos ni el impacto ecológico.',
    meaning: 'Tu equipo comprendió que la tecnología es un multiplicador de valores: la pusiste al servicio de la resolución de problemas reales en lugar de usarla únicamente para recortar nómina o extraer datos.',
    strengths: [
      'Ventaja competitiva basada en conocimiento y patentes de alto valor añadido.',
      'Atracción del mejor talento científico e ingenieril del ecosistema de Neo-Terra.',
      'Resiliencia estructural frente a regulaciones emergentes sobre inteligencia artificial.'
    ],
    risks: [
      'Gasto elevado y recurrente en investigación con horizontes de retorno inciertos.',
      'Riesgo de obsolescencia si se frena el flujo constante de capital en I+D.',
      'Dilemas éticos crecientes conforme las tecnologías autónomas ganan complejidad.'
    ],
    realWorld: 'Organizaciones como Patagonia, Fairphone o laboratorios de IA abierta comprometidos con auditorías de seguridad y gobernanza algorítmica.',
    lesson: 'Innovar no es simplemente inventar lo que nadie ha hecho, sino decidir con rigor para qué y para quién se construye.',
    reflection: '¿En qué encrucijada decidió tu corporación no implementar una tecnología disponible porque violaba sus principios?'
  },

  ModeloESG: {
    id: 'ModeloESG',
    label: 'Modelo ESG Triple A',
    icon: '⚖️',
    badgeClass: 'bg-moss-soft text-moss border-moss/30',
    tagline: 'Gobernanza intachable, comercio justo y cadena de valor certificada.',
    criteria: 'Índice ESG ≥ 70 y al menos 35% de los ciclos seleccionando la opción más responsable (C).',
    description: 'Tu empresa se convirtió en el estándar de oro institucional en buenas prácticas ambientales, laborales y de gobierno corporativo.',
    meaning: 'Priorizaste la trazabilidad, la transparencia radical y las relaciones equitativas con proveedores: eliminaste los riesgos ocultos antes de que pudieran detonar en crisis.',
    strengths: [
      'Calificación de riesgo mínima que reduce radicalmente el costo del capital financiero.',
      'Cadena de suministro blindada contra denuncias laborales o corrupción encubierta.',
      'Lealtad institucional y reputación inquebrantable frente a tormentas del mercado.'
    ],
    risks: [
      'Peligro de caer en burocracia de cumplimiento normativo y perder agilidad.',
      'Costos significativos de auditorías forenses, sellos y certificaciones internacionales.',
      'Menor velocidad de captura de cuota de mercado en comparación con competidores voraces.'
    ],
    realWorld: 'Empresas calificadas AAA en índices Dow Jones Sustainability o B-Corps globales como Danone en su transformación regenerativa.',
    lesson: 'El cumplimiento riguroso protege el valor; el verdadero liderazgo ético, sin embargo, consiste en subir la vara para toda la industria.',
    reflection: '¿Optó tu equipo por opciones responsables por convicción auténtica o como mecanismo de contención de riesgos?'
  },

  GiganteDisruptivo: {
    id: 'GiganteDisruptivo',
    label: 'Gigante Disruptivo',
    icon: '🚀',
    badgeClass: 'bg-sand-100 text-ink border-sand-border',
    tagline: 'Escala masiva y plataformas de software para redefinir las reglas del mercado.',
    criteria: 'Cuota de mercado ≥ 14% y nivel tecnológico ≥ 65.',
    description: 'Conquistaste una cuota colosal del mercado apalancándote en tecnología disruptiva, efectos de red y una agresiva estrategia de penetración global.',
    meaning: 'Tu estrategia apostó por la velocidad y la escala: capturar el mercado primero para dictar las condiciones después. Esto genera un poder económico inmenso, pero atrae la lupa de reguladores y de la opinión pública.',
    strengths: [
      'Economías de escala globales y márgenes superiores derivados de efectos de red.',
      'Capacidad para fijar estándares tecnológicos de facto para toda la economía.',
      'Poder financiero para absorber competidores menores y capear turbulencias.'
    ],
    risks: [
      'Investigaciones antimonopolio y presiones regulatorias para desmembrar la corporación.',
      'Sensibilidad extrema a caídas en la confianza de los millones de usuarios de la plataforma.',
      'Impactos colaterales no resueltos en el tejido del empleo tradicional.'
    ],
    realWorld: 'Las grandes plataformas que redefinieron el comercio y los servicios digitales en las décadas de 2010 y 2020.',
    lesson: 'A mayor cuota de mercado, mayor es la responsabilidad cívica que la sociedad exige sobre tus decisiones.',
    reflection: '¿Qué contrapesos internos implementó tu equipo para evitar que el monopolio asfixiara a sus propios clientes?'
  },

  PotenciaTecnologica: {
    id: 'PotenciaTecnologica',
    label: 'Potencia Tecnológica',
    icon: '⚡',
    badgeClass: 'bg-sand-100 text-moss-dark border-sand-border',
    tagline: 'La vanguardia de la computación cuántica, automatización y ciberseguridad.',
    criteria: 'Nivel tecnológico ≥ 68 e innovación ≥ 60.',
    description: 'Desarrollaste la infraestructura técnica más sofisticada de Neo-Terra: ciberdefensa impenetrable, IA de frontera y operaciones totalmente robotizadas.',
    meaning: 'Pusiste la excelencia técnica en el núcleo de tu estrategia corporativa. Cuentas con las capacidades para liderar el futuro; el reto reside en dotar a ese poder técnico de un propósito socioambiental claro.',
    strengths: [
      'Productividad récord y costos marginales mínimos mediante automatización.',
      'Inmunidad absoluta frente a ciberataques, ransomware cuántico y sabotajes digitales.',
      'Ventaja infranqueable en velocidad de procesamiento y desarrollo de producto.'
    ],
    risks: [
      'Indicadores ESG y relaciones laborales que pueden quedar desatendidos.',
      'Tensión con comunidades y sindicatos debido al desplazamiento del empleo humano.',
      'Riesgo de soberbia tecnológica: creer que el software puede resolver problemas sociales.'
    ],
    realWorld: 'Gigantes de fundición de semiconductores de precisión y centros de cómputo cuántico de avanzada.',
    lesson: 'La capacidad técnica es un instrumento: su impacto final depende exclusivamente de la ética que guía su arquitectura.',
    reflection: '¿Qué hubiera ocurrido con tu puntuación final si hubieras canalizado tu músculo tecnológico a la regeneración ecológica?'
  },

  ImperioCoporativo: {
    id: 'ImperioCoporativo',
    label: 'Imperio Corporativo',
    icon: '🏛️',
    badgeClass: 'bg-sand-200 text-ink-muted border-sand-border',
    tagline: 'Dominio absoluto de capital financiero, liquidez y cuota de mercado.',
    criteria: 'Capital ≥ $2,200,000 y cuota de mercado ≥ 12%.',
    description: 'Acumulaste una masa financiera y comercial colosal. Ganaste la partida en términos de rentabilidad pura y tamaño de balance contable.',
    meaning: 'Optimizaste cada decisión para la maximización del dividendo financiero. Es una estrategia eficaz para acumular reservas, pero genera la interrogante de qué costos quedaron fuera del balance: pasivos ecológicos, salarios o confianza pública.',
    strengths: [
      'Solvencia financiera inquebrantable para sobrevivir cualquier crisis del ciclo.',
      'Poder de compra masivo para presionar a la baja las tarifas de los proveedores.',
      'Capacidad para financiar expansiones territoriales sin recurrir a deuda externa.'
    ],
    risks: [
      'Pasivos ambientales o sociales ocultos que pueden erosionar el valor en el futuro.',
      'Desconexión creciente con las expectativas de las nuevas generaciones de consumidores.',
      'Escrutinio tributario y fiscal creciente por parte de los bloques gubernamentales.'
    ],
    realWorld: 'Los conglomerados industriales y financieros del siglo XX que priorizaron la acumulación antes de la era de la transparencia.',
    lesson: 'El capital acumulado mide lo que lograste ganar en el pasado; el índice ESG y la reputación miden si podrás seguir existiendo en el futuro.',
    reflection: '¿Habría sido tan rentable tu modelo si hubieras tenido que pagar por adelantado todos los costos ambientales generados?'
  },

  CorporacionExtractiva: {
    id: 'CorporacionExtractiva',
    label: 'Corporación Extractiva',
    icon: '🏭',
    badgeClass: 'bg-terracotta-soft text-terracotta border-terracotta/30',
    tagline: 'Rentabilidad cortoplacista agresiva trasladando costos al entorno.',
    criteria: 'Al menos 45% de los ciclos optando por proveedores de bajo costo (A) y huella ambiental ≥ 60.',
    description: 'Tu modelo recurrió repetidamente a las cadenas de menor costo y regulaciones laxas, acumulando pasivos de emisiones y riesgos laborales severos.',
    meaning: 'Tu liderazgo privilegió la liquidez inmediata sobre la sostenibilidad del sistema. Obtuviste beneficios en los ciclos tempranos, pero el mundo de Neo-Terra terminó cobrando la factura mediante eventos adversos, aranceles y descrédito público.',
    strengths: [
      'Costos directos de manufactura reducidos.',
      'Máxima liquidez y flexibilidad operativa en los compases iniciales.',
      'Capacidad de competir ferozmente en precio en mercados de bajo poder adquisitivo.'
    ],
    risks: [
      'Castigo fulminante por aranceles de carbono, multas y embargos internacionales.',
      'Exposición crítica a filtraciones en medios, huelgas masivas y boicots de consumidores.',
      'Cierre progresivo de puertas en los mercados internacionales más lucrativos.'
    ],
    realWorld: 'Casos documentados de cadenas textiles o mineras que externalizan el daño ambiental y laboral en terceros países.',
    lesson: 'Los costos que una corporación no asume no desaparecen: los paga el planeta o la sociedad, y tarde o temprano regresan como sanciones.',
    reflection: '¿En qué ciclo tuvo tu equipo la oportunidad de cambiar de trayectoria y qué argumento interno les impidió dar el paso?'
  },

  EmpresaEnCrisis: {
    id: 'EmpresaEnCrisis',
    label: 'Empresa en Crisis',
    icon: '⚠️',
    badgeClass: 'bg-terracotta-soft text-terracotta-dark border-terracotta/40',
    tagline: 'Descapitalización severa o colapso de la licencia social para operar.',
    criteria: 'Capital ≤ $300,000 o índice de reputación ≤ 20 puntos.',
    description: 'Tu corporación concluyó la simulación en situación de insolvencia técnica o con su reputación pública destruida por escándalos acumulados.',
    meaning: 'No representa un fracaso, sino el escenario pedagógico más valioso: visibiliza cómo una cadena de decisiones descoordinadas o la negligencia de riesgos ocultos pueden derribar a una empresa en pocos ciclos.',
    strengths: [
      'Lección profunda e inolvidable sobre gestión de riesgos e interdependencia sistémica.',
      'Oportunidad de refundación total y redefinición de valores desde cero.',
      'Claridad absoluta sobre las prácticas que no deben repetirse en el mundo real.'
    ],
    risks: [
      'Insolvencia operativa o absorción hostil por competidores más capitalizados.',
      'Pérdida total de credibilidad ante inversionistas y autoridades regulatorias.',
      'Deserción masiva de clientes y fuga irrecuperable de talento humano.'
    ],
    realWorld: 'Empresas emblemáticas como Enron, Lehman Brothers o Wirecard, cuyos modelos colapsaron súbitamente al emerger pasivos no revelados.',
    lesson: 'Las catástrofes corporativas raramente ocurren por un solo golpe de mala suerte: son la culminación de pequeñas negligencias toleradas ciclo a ciclo.',
    reflection: 'Si tu equipo pudiera retroceder a un solo momento de la simulación para tomar otra directiva, ¿cuál elegirían y por qué?'
  },

  SobrevivienteMercado: {
    id: 'SobrevivienteMercado',
    label: 'Sobreviviente de Mercado',
    icon: '🛡️',
    badgeClass: 'bg-sand-100 text-ink-muted border-sand-border',
    tagline: 'Prudencia operativa, resiliencia y equilibrio ante presiones encontradas.',
    criteria: 'Estrategia balanceada sin desviaciones extremas: el perfil más adaptable.',
    description: 'Navegaste las transformaciones y crisis de 2045 manteniendo tu empresa a flote, sin destacar en extremos ni incurrir en pasivos fatales.',
    meaning: 'Tu equipo tomó directivas mesuradas. Esa cautela te protegió de los peores desastres, aunque también limitó tu capacidad para construir un liderazgo disruptivo en alguna dimensión específica.',
    strengths: [
      'Diversificación equilibrada de riesgos financieros, ambientales y de reputación.',
      'Estabilidad operativa y continuidad del negocio sin grandes sobresaltos.',
      'Flexibilidad estratégica para pivotar hacia nuevos modelos de gobernanza.'
    ],
    risks: [
      'Falta de una propuesta de valor única que diferencie a la marca en el mercado.',
      'Vulnerabilidad a largo plazo ante competidores que sí tomaron riesgos transformadores.',
      'Riesgo de mediocridad si la cautela se convierte en aversión al cambio.'
    ],
    realWorld: 'Las corporaciones medianas que logran perdurar década tras década priorizando la estabilidad por sobre la notoriedad mediática.',
    lesson: 'Sobrevivir es el requisito indispensable para hacer empresa; liderar, sin embargo, exige comprometerse con una causa mayor.',
    reflection: '¿En qué área de la simulación desearías que tu equipo hubiera tomado una postura más audaz?'
  }
};

export function getArchetypeMeta(key: string): ArchetypeDetail {
  return ARCHETYPE_CATALOG[key] || ARCHETYPE_CATALOG.SobrevivienteMercado;
}
