'use strict';

/**
 * GAME CONFIGURATION — NEO-TERRA Global Simulator 2045
 */

const GAME_CONSTANTS = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 100,
  ROUNDS_MIN: 6,
  ROUNDS_MAX: 10,
  ROUND_DURATION_SECONDS: 300,   // 5 minutes per round
  DECISION_TIMEOUT_SECONDS: 180, // 3 minutes to decide
};

const INVESTMENT_BUDGET_PER_ROUND = 500000; // $500,000 per round to allocate

const COMPANY_INITIAL_STATE = {
  capital: 1000000,         // $1,000,000 starting capital
  marketShare: 5,           // 5% of global market
  reputation: 50,           // 0-100
  environmentalFootprint: 50, // 0-100 (LOWER is better)
  innovation: 30,
  consumerRelations: 50,
  regulatorRelations: 50,
  laborRelations: 50,
  techLevel: 30,
  cybersecurity: 30,
  esgIndex: 40,
  logisticCapacity: 40,
  internationalAccess: 30,
};

const GLOBAL_WORLD_STATE = {
  globalTemperature: 1.5,       // °C above pre-industrial (Paris target)
  economicStability: 60,        // 0-100
  consumerConfidence: 55,       // 0-100
  internationalRegulation: 40,  // 0-100
  globalInnovation: 35,         // 0-100
  socialInequality: 55,         // 0-100 (higher = more inequality)
  sustainabilityIndex: 40,      // 0-100
};

// ─────────────────────────────────────────────────────────────────────────────
// SUPPLIERS
// ─────────────────────────────────────────────────────────────────────────────
const SUPPLIERS = [
  {
    id: 'A',
    name: 'GlobalFast Manufacturing',
    publicInfo: {
      priceMultiplier: 0.6,
      deliverySpeed: 'Inmediata (48h)',
      description: 'Producción masiva de bajo costo. Entrega garantizada en 48 horas. Sin burocracia ni papeleos.',
      certifications: [],
      qualityRating: 3,
      priceLabel: 'Muy Bajo',
      highlight: '⚡ Entrega más rápida del mercado',
    },
    hiddenAttributes: {
      corruption: 75,
      laborExploitation: 80,
      realEmissions: 85,
      geopoliticalDependency: 70,
      reputationRisk: 80,
      sanctionRisk: 60,
      climateRisk: 65,
    },
  },
  {
    id: 'B',
    name: 'CertifiedGlobal Partners',
    publicInfo: {
      priceMultiplier: 1.0,
      deliverySpeed: 'Estándar (7-10 días)',
      description: 'Cadena de suministro certificada internacionalmente. Precio justo, buenas prácticas documentadas.',
      certifications: ['ISO 9001', 'Fair Trade Certified'],
      qualityRating: 7,
      priceLabel: 'Medio',
      highlight: '✅ Certificaciones internacionales verificadas',
    },
    hiddenAttributes: {
      corruption: 25,
      laborExploitation: 20,
      realEmissions: 40,
      geopoliticalDependency: 30,
      reputationRisk: 30,
      sanctionRisk: 20,
      climateRisk: 35,
    },
  },
  {
    id: 'C',
    name: 'NeoTech Sustainable Supply',
    publicInfo: {
      priceMultiplier: 1.5,
      deliverySpeed: 'Premium (5 días)',
      description: 'Tecnología de producción avanzada. Automatización completa, materiales reciclados, energía 100% renovable.',
      certifications: ['ISO 14001', 'B-Corp', 'Carbon Neutral 2045', 'SA8000'],
      qualityRating: 10,
      priceLabel: 'Alto',
      highlight: '🌱 Cadena de suministro 100% sostenible',
    },
    hiddenAttributes: {
      corruption: 5,
      laborExploitation: 5,
      realEmissions: 10,
      geopoliticalDependency: 15,
      reputationRisk: 10,
      sanctionRisk: 5,
      climateRisk: 20,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ARCHETYPE THRESHOLDS
// ─────────────────────────────────────────────────────────────────────────────
const ARCHETYPE_THRESHOLDS = {
  EmpresaEnCrisis: {
    conditions: [
      { variable: 'capital', operator: '<=', value: 200000 },
      { variable: 'reputation', operator: '<=', value: 15 },
    ],
    description: 'Las consecuencias ocultas te alcanzaron. Sancionada, aislada y en declive.',
    color: '#ef4444',
    emoji: '💀',
  },
  LiderSustentable: {
    conditions: [
      { variable: 'esgIndex', operator: '>=', value: 80 },
      { variable: 'environmentalFootprint', operator: '<=', value: 20 },
      { variable: 'regulatorRelations', operator: '>=', value: 75 },
    ],
    description: 'El modelo del futuro. Demostró que la sostenibilidad es un negocio rentable.',
    color: '#10b981',
    emoji: '🍃',
  },
  InnovadorResponsable: {
    conditions: [
      { variable: 'innovation', operator: '>=', value: 72 },
      { variable: 'esgIndex', operator: '>=', value: 68 },
      { variable: 'techLevel', operator: '>=', value: 60 },
    ],
    description: 'Tecnología y responsabilidad juntas. El arquetipo más admirado en Neo-Terra 2045.',
    color: '#6366f1',
    emoji: '🌱',
  },
  ModeloESG: {
    conditions: [
      { variable: 'esgIndex', operator: '>=', value: 75 },
    ],
    description: 'Equilibrio perfecto entre rentabilidad e impacto. Un referente global en ESG.',
    color: '#22d3ee',
    emoji: '📊',
  },
  GiganteDisruptivo: {
    conditions: [
      { variable: 'marketShare', operator: '>=', value: 22 },
      { variable: 'techLevel', operator: '>=', value: 75 },
    ],
    description: 'Domina el mercado tecnológico. Winner-takes-all en la economía digital.',
    color: '#a855f7',
    emoji: '🚀',
  },
  PotenciaTecnologica: {
    conditions: [
      { variable: 'techLevel', operator: '>=', value: 78 },
      { variable: 'innovation', operator: '>=', value: 72 },
    ],
    description: 'Líder en innovación tecnológica. Definiendo los estándares del futuro.',
    color: '#f59e0b',
    emoji: '⚡',
  },
  ImperioCoporativo: {
    conditions: [
      { variable: 'capital', operator: '>=', value: 4500000 },
      { variable: 'marketShare', operator: '>=', value: 15 },
    ],
    description: 'Poder económico enorme. ¿A qué costo? Las siguientes generaciones lo sabrán.',
    color: '#d97706',
    emoji: '🏛️',
  },
  CorporacionExtractiva: {
    conditions: [
      { variable: 'environmentalFootprint', operator: '>=', value: 70 },
    ],
    description: 'Extracción sin límites. Rico ahora, pero el mundo no lo olvidará.',
    color: '#f97316',
    emoji: '🏭',
  },
  SobrevivienteMercado: {
    conditions: [],
    description: 'Navegó el mercado global. Ni héroe ni villano. La historia continúa.',
    color: '#6b7280',
    emoji: '🌐',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIOS & DILEMMAS PER ROUND (EVOLUTIVE PROGRESSION 2045-2055)
// ─────────────────────────────────────────────────────────────────────────────
const ROUND_SCENARIOS = {
  1: {
    round: 1,
    year: 2045,
    title: 'El Boom de la IA y el Dilema de los Suministros',
    context: 'La demanda de chips cuánticos y baterías de alta densidad se dispara a nivel mundial. Como CEO, debes establecer la cadena de suministro que sustentará las operaciones de tu multinacional.',
    dilemmaQuestion: '¿A qué socio comercial confiarás la manufactura de tus componentes clave?',
    options: [
      {
        id: 'A',
        name: 'Opción A: Manufactura Masiva Ultra-Rápida',
        badge: 'Costo Muy Bajo',
        badgeColor: 'amber',
        preview: 'Entrega en 48h. Máximo margen de beneficio inmediato.',
        narrativeRisk: 'Proveedores no auditados en el Sur Global con sospechas de explotación laboral y alta huella de carbono.',
      },
      {
        id: 'B',
        name: 'Opción B: Consorcio Certificado ISO / Fair Trade',
        badge: 'Costo Equilibrado',
        badgeColor: 'cyan',
        preview: 'Entrega estándar (7-10 días). Cumplimiento normativo y salarios dignos documentados.',
        narrativeRisk: 'Margen de ganancia moderado, pero blindaje contra escándalos internacionales.',
      },
      {
        id: 'C',
        name: 'Opción C: Ecosistema Autónomo 100% Renovable',
        badge: 'Inversión Premium',
        badgeColor: 'emerald',
        preview: 'Plantas automatizadas con energía solar y reciclaje de tierras raras.',
        narrativeRisk: 'Alto costo inicial de capital, pero otorga liderazgo inmediato en el Índice ESG.',
      },
    ],
    investmentFocusOptions: [
      { id: 'tech', label: 'Innovación en Algoritmos e I+D', desc: '+Nivel Tecnológico y Patentes' },
      { id: 'green', label: 'Transición Verde y Eficiencia', desc: '-Huella Ambiental y +ESG' },
      { id: 'social', label: 'Bienestar y Salarios Dignos', desc: '+Relaciones Laborales y Consumo' },
      { id: 'cyber', label: 'Ciberdefensa e Infraestructura', desc: '+Protección de Datos Críticos' },
    ],
  },
  2: {
    round: 2,
    year: 2047,
    title: 'La Gran Ola de Automatización y la Crisis Laboral',
    context: 'Los sistemas autónomos pueden sustituir al 70% de la fuerza laboral operativa. La rentabilidad seduce a los accionistas, pero los sindicatos y la sociedad civil exigen un freno ético.',
    dilemmaQuestion: '¿Cómo implementarás la revolución de la IA en tu empresa?',
    options: [
      {
        id: 'A',
        name: 'Opción A: Automatización Total Agresiva',
        badge: 'Margen Extremo',
        badgeColor: 'amber',
        preview: 'Despido masivo de operarios y reemplazo por robots autónomos.',
        narrativeRisk: 'Dispara tus ganancias a corto plazo, pero provoca huelgas y destruye tu reputación laboral.',
      },
      {
        id: 'B',
        name: 'Opción B: Modelo Híbrido de Reconversión',
        badge: 'Estrategia Equilibrada',
        badgeColor: 'cyan',
        preview: 'Financiar programas de re-capacitación en IA para tus empleados.',
        narrativeRisk: 'Costo moderado de capacitación, pero mantiene la paz social y la lealtad de marca.',
      },
      {
        id: 'C',
        name: 'Opción C: Pacto Social de Blindaje Humano',
        badge: 'Compromiso Ético',
        badgeColor: 'emerald',
        preview: 'Garantizar el empleo humano y limitar la IA solo a tareas auxiliares.',
        narrativeRisk: 'Márgenes de ganancia más bajos, pero apoyo incondicional de reguladores y consumidores.',
      },
    ],
    investmentFocusOptions: [
      { id: 'tech', label: 'Algoritmos de Optimización', desc: 'Aumentar cuota de mercado' },
      { id: 'green', label: 'Reducción de Huella de Servidores', desc: 'Certificación ecológica' },
      { id: 'social', label: 'Fondo de Apoyo Comunitario', desc: 'Blindar relaciones públicas' },
      { id: 'cyber', label: 'Blindaje Contra Sabotajes', desc: 'Proteger sistemas ante huelgas' },
    ],
  },
  3: {
    round: 3,
    year: 2049,
    title: 'La Emergencia Climática y los Aranceles de Carbono',
    context: 'La temperatura media del planeta ha subido drásticamente. Las naciones aprueban el "Pacto de Neo-Terra", imponiendo multas severas a las empresas que emiten gases contaminantes.',
    dilemmaQuestion: '¿Cómo responderás a la ofensiva regulatoria ambiental?',
    options: [
      {
        id: 'A',
        name: 'Opción A: Paraísos Regulatorios y Evasión',
        badge: 'Evasión de Costos',
        badgeColor: 'amber',
        preview: 'Mudar servidores y plantas a jurisdicciones sin leyes ambientales.',
        narrativeRisk: 'Ahorro inmediato, pero riesgo de bloqueos comerciales y sanciones internacionales.',
      },
      {
        id: 'B',
        name: 'Opción B: Compra de Bonos de Compensación',
        badge: 'Mitigación Convencional',
        badgeColor: 'cyan',
        preview: 'Pagar las multas y adquirir bonos de carbono para mantener operaciones.',
        narrativeRisk: 'Costo recurrente predecible, pero los consumidores cuestionan el impacto real.',
      },
      {
        id: 'C',
        name: 'Opción C: Descarbonización Total Inmediata',
        badge: 'Liderazgo Sostenible',
        badgeColor: 'emerald',
        preview: 'Cerrar toda instalación fósil y operar con 100% renovables certificadas.',
        narrativeRisk: 'Fuerte desembolso de capital, pero exenciones fiscales y acceso preferente a mercados ricos.',
      },
    ],
    investmentFocusOptions: [
      { id: 'tech', label: 'Captura y Almacenamiento de Carbono', desc: 'Innovación ambiental' },
      { id: 'green', label: 'Reingeniería de Empaques Circulares', desc: 'Cumplimiento normativo' },
      { id: 'social', label: 'Compensación a Comunidades', desc: 'Alianzas con ONGs' },
      { id: 'cyber', label: 'Monitoreo Satelital de Emisiones', desc: 'Trazabilidad de datos' },
    ],
  },
  4: {
    round: 4,
    year: 2051,
    title: 'El Gran Asedio Cibernético y la Guerra de Datos',
    context: 'Un ataque cibernético cuántico sin precedentes paraliza la logística intercontinental. Redes de hacktivistas exponen los secretos corporativos peor guardados.',
    dilemmaQuestion: '¿Cuál es tu estrategia ante la crisis global de ciberseguridad?',
    options: [
      {
        id: 'A',
        name: 'Opción A: No Invertir y Minimizar el Ataque',
        badge: 'Ahorro Máximo',
        badgeColor: 'amber',
        preview: 'Considerar el ataque una amenaza menor y no gastar fondos en defensa.',
        narrativeRisk: 'Ahorro de capital, pero si eres hackeado perderás patentes, datos y millones en multas.',
      },
      {
        id: 'B',
        name: 'Opción B: Blindaje Privado con IA Cuántica',
        badge: 'Seguridad Privada',
        badgeColor: 'cyan',
        preview: 'Contratar las mejores firmas de ciberdefensa para proteger solo tus activos.',
        narrativeRisk: 'Inversión alta, pero tus operaciones continuarán sin interrupciones.',
      },
      {
        id: 'C',
        name: 'Opción C: Alianza Abierta de Ciberinteligencia',
        badge: 'Defensa Colectiva',
        badgeColor: 'emerald',
        preview: 'Compartir código e informes de amenazas con toda la industria y gobiernos.',
        narrativeRisk: 'Fortalece la resiliencia de toda la economía global y te corona como líder confiable.',
      },
    ],
    investmentFocusOptions: [
      { id: 'tech', label: 'Criptografía Post-Cuántica', desc: 'Inmunidad digital' },
      { id: 'green', label: 'Servidores con Enfriamiento Verde', desc: 'Eficiencia energética' },
      { id: 'social', label: 'Protección de Privacidad de Usuarios', desc: 'Confianza de consumidores' },
      { id: 'cyber', label: 'Auditoría Forense de Red', desc: 'Detección temprana de brechas' },
    ],
  },
  5: {
    round: 5,
    year: 2053,
    title: 'La Rebelión del Consumidor: Auditoría vs. Greenwashing',
    context: 'Los consumidores en Neo-Terra ya no creen en discursos corporativos. Una ola de protestas globales exige ver los datos reales de la cadena de suministro.',
    dilemmaQuestion: '¿Cómo enfrentarás la demanda masiva de transparencia?',
    options: [
      {
        id: 'A',
        name: 'Opción A: Campaña Agresiva de "Greenwashing"',
        badge: 'Marketing y Relaciones Públicas',
        badgeColor: 'amber',
        preview: 'Invertir en publicidad verde emotiva sin alterar tus fábricas ni proveedores.',
        narrativeRisk: 'Atrae clientes distraídos, pero una filtración periodística hundirá tu credibilidad.',
      },
      {
        id: 'B',
        name: 'Opción B: Auditoría Externa y Reportes ESG Públicos',
        badge: 'Transparencia Verificada',
        badgeColor: 'cyan',
        preview: 'Publicar auditorías completas, asumiendo errores pasados y planes de mejora.',
        narrativeRisk: 'Críticas a corto plazo por tus fallas, pero respeto y estabilidad institucional.',
      },
      {
        id: 'C',
        name: 'Opción C: Trazabilidad Blockchain Radical',
        badge: 'Apertura Total',
        badgeColor: 'emerald',
        preview: 'Hacer pública la procedencia de cada gramo de material y cada salario pagado.',
        narrativeRisk: 'No deja margen para secretos, pero te convierte en la marca más ética del planeta.',
      },
    ],
    investmentFocusOptions: [
      { id: 'tech', label: 'Plataforma de Trazabilidad Pública', desc: 'Datos abiertos' },
      { id: 'green', label: 'Eliminación Total de Plásticos', desc: 'Certificación circular' },
      { id: 'social', label: 'Consejo Comunitario de Supervisión', desc: 'Gobernanza participativa' },
      { id: 'cyber', label: 'Verificación de Proveedores por IA', desc: 'Filtro ético automático' },
    ],
  },
  6: {
    round: 6,
    year: 2055,
    title: 'El Veredicto de Neo-Terra: El Legado Corporativo',
    context: 'El ciclo histórico concluye. La economía global se reconfigura y los tribunales de mercado juzgan a cada corporación. Ha llegado el momento de consolidar tu legado.',
    dilemmaQuestion: '¿Cuál es la misión final de tu organización multinacional?',
    options: [
      {
        id: 'A',
        name: 'Opción A: Maximización de Dividendos y Monopolio',
        badge: 'Imperio Financiero',
        badgeColor: 'amber',
        preview: 'Liquidar inversiones blandas y capturar la mayor cantidad de capital posible.',
        narrativeRisk: 'Arquetipo: Imperio Corporativo o Corporación Extractiva.',
      },
      {
        id: 'B',
        name: 'Opción B: Hegemonía Tecnológica e Infraestructura',
        badge: 'Potencia Digital',
        badgeColor: 'cyan',
        preview: 'Convertirte en la columna vertebral tecnológica que gestiona las megaciudades.',
        narrativeRisk: 'Arquetipo: Potencia Tecnológica o Gigante Disruptivo.',
      },
      {
        id: 'C',
        name: 'Opción C: Corporación B Regenerativa Planetaria',
        badge: 'Liderazgo Sostenible',
        badgeColor: 'emerald',
        preview: 'Reinvertir utilidades en restauración ecológica y equidad económica.',
        narrativeRisk: 'Arquetipo: Líder Sustentable o Modelo ESG.',
      },
    ],
    investmentFocusOptions: [
      { id: 'tech', label: 'Fideicomiso de IA Abierta', desc: 'Legado del conocimiento' },
      { id: 'green', label: 'Fondo de Restauración Biológica', desc: 'Legado planetario' },
      { id: 'social', label: 'Cooperativa de Empleados', desc: 'Equidad socioeconómica' },
      { id: 'cyber', label: 'Red Global Inviolable', desc: 'Infraestructura pública' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// EMERGENCY & FLASH CRISIS EVENTS (ABRUPT BREAKING SITUATIONS)
// ─────────────────────────────────────────────────────────────────────────────
const EMERGENCY_EVENTS = [
  {
    id: 'crisis_solar_flare',
    title: '🚨 ALERTA ROJA: Tormenta Solar Cuántica y Apagón Satelital',
    context: 'Una eyección de masa coronal solar de escala extrema ha desactivado las constelaciones de satélites comerciales en órbita baja. Los corredores marítimos autónomos, las redes GPS y las transacciones bancarias están paralizadas.',
    dilemma: 'Tus cargueros y fábricas están incomunicados en altamar y aeropuertos. ¿Qué directiva relámpago ejecuta tu gabinete de crisis?',
    options: [
      {
        id: 'opt_1',
        title: 'Contratar Banda Cuántica Militar de Emergencia',
        cost: 90000,
        desc: 'Desembolso inmediato de $90,000 para enlazar con la red de defensa orbital y mantener el 100% de tus envíos activos.',
        consequences: { capital: -90000, marketShare: +3, reputation: +5 },
        feedback: 'Tu rápida respuesta financiera salvó las entregas. Capturaste clientes desesperados que tus competidores no pudieron atender.'
      },
      {
        id: 'opt_2',
        title: 'Anclar Flota y Esperar la Restauración Pública',
        cost: 0,
        desc: 'Sin gasto de capital. Detener todas las operaciones hasta que las agencias espaciales restablezcan la red pública.',
        consequences: { marketShare: -3, consumerRelations: -8 },
        feedback: 'Ahorraste fondos de emergencia, pero miles de clientes sufrieron cancelaciones y penalizaciones por demoras.'
      },
      {
        id: 'opt_3',
        title: 'Liberar Algoritmos de Navegación Inercial Terrestre',
        cost: 40000,
        desc: 'Liberar en código abierto tus protocolos propietarios de guía autónoma para ayudar a toda la industria.',
        consequences: { capital: -40000, reputation: +15, regulatorRelations: +12, esgIndex: +8 },
        feedback: 'Un acto de liderazgo elogiado por la ONU. Tu empresa fue la heroína del apagón, consolidando alianzas de valor incalculable.'
      }
    ]
  },
  {
    id: 'crisis_data_leak',
    title: '🚨 ALERTA ROJA: Filtración Masiva en la Dark Web',
    context: 'Un consorcio anónimo de ciberactivistas ha publicado terabytes de correos internos, fórmulas y contratos confidenciales de las corporaciones tecnológicas de Neo-Terra.',
    dilemma: 'Documentos internos confidenciales de tu empresa han sido expuestos en foros públicos. ¿Cómo responde tu dirección de crisis?',
    options: [
      {
        id: 'opt_1',
        title: 'Transparencia Absoluta y Admisión Pública',
        cost: 50000,
        desc: 'Reconocer la filtración, asumir responsabilidades y abrir auditorías independientes inmediatas.',
        consequences: { capital: -50000, reputation: +10, regulatorRelations: +10, esgIndex: +6 },
        feedback: 'Tu honestidad desarmó el escándalo. Los reguladores valoraron tu cooperación y los clientes mantuvieron su confianza.'
      },
      {
        id: 'opt_2',
        title: 'Campaña Ofensiva de Desmentido y Demandas Legales',
        cost: 80000,
        desc: 'Pagar a bufetes de abogados y relaciones públicas para calificar los datos como falsificados e IA generativa.',
        consequences: { capital: -80000, reputation: -15, consumerRelations: -12 },
        feedback: 'La estrategia judicial enfureció a la opinión pública. La evidencia forense demostró la autenticidad y el escándalo se duplicó.'
      },
      {
        id: 'opt_3',
        title: 'Blindaje Técnico Hermético en Silencio',
        cost: 30000,
        desc: 'No emitir comentarios públicos y gastar $30,000 en parches de ciberseguridad internos.',
        consequences: { capital: -30000, cybersecurity: +15, reputation: -5 },
        feedback: 'Evitaste alimentar la prensa, pero la falta de explicaciones dejó sospechas que erosionaron levemente la reputación.'
      }
    ]
  },
  {
    id: 'crisis_tsunami_supply',
    title: '🚨 ALERTA ROJA: Desastre Climático en el Estrecho de Malaca',
    context: 'Un megatsunami inducido por el calentamiento oceánico ha arrasado los tres principales puertos de transferencia del Sudeste Asiático. El 50% de las rutas comerciales globales están bloqueadas.',
    dilemma: 'Tus cargueros con componentes de microchips están varados en la zona del desastre. ¿Qué orden emite tu comité de logística?',
    options: [
      {
        id: 'opt_1',
        title: 'Puente Aéreo Suborbital de Alta Velocidad',
        cost: 120000,
        desc: 'Desviar suministros mediante transporte aéreo y cohetes suborbitales para no retrasar entregas.',
        consequences: { capital: -120000, environmentalFootprint: +10, marketShare: +2 },
        feedback: 'Costó una fortuna y aumentó tus emisiones, pero cumpliste con tus clientes mientras tus rivales colapsaron.'
      },
      {
        id: 'opt_2',
        title: 'Reorientar Recursos a Asistencia Humanitaria en la Zona',
        cost: 60000,
        desc: 'Destinar tu flota varada para transportar víveres y medicinas a las poblaciones costeras afectadas.',
        consequences: { capital: -60000, reputation: +20, laborRelations: +15, esgIndex: +12 },
        feedback: 'Tu gesto humanitario conmovió al mundo. La ONU te otorgó exenciones arancelarias especiales de por vida.'
      },
      {
        id: 'opt_3',
        title: 'Declarar Fuerza Mayor y Cobrar Seguros',
        cost: 0,
        desc: 'Congelar contratos, invocar cláusulas de desastre y solicitar indemnizaciones a las aseguradoras.',
        consequences: { capital: +40000, consumerRelations: -15, marketShare: -4 },
        feedback: 'Recuperaste liquidez con las pólizas de seguro, pero abandonaste a tus clientes en el peor momento de la crisis.'
      }
    ]
  }
];

module.exports = {
  GAME_CONSTANTS,
  INVESTMENT_BUDGET_PER_ROUND,
  COMPANY_INITIAL_STATE,
  GLOBAL_WORLD_STATE,
  SUPPLIERS,
  ARCHETYPE_THRESHOLDS,
  ROUND_SCENARIOS,
  EMERGENCY_EVENTS,
};


