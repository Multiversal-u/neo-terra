'use strict';

/**
 * GAME CONFIGURATION — NEO-TERRA Global Simulator 2045
 *
 * Estructura narrativa:
 *  - 9 dilemas temáticos (rondas 1..9) que recorren las 8 dimensiones del mundo
 *  - 1 dilema de cierre ("El Veredicto") que SIEMPRE ocupa la última ronda,
 *    sin importar si la sala se configuró con 6, 8 o 10 rondas.
 *
 * Cada opción de dilema contiene:
 *  - effects:  deltas cuantificados que se aplican a la empresa al evaluar la ronda
 *  - story / cascade: crónica narrativa que recibe el alumno
 *  - risk (opcional): consecuencia condicionada a decisiones PREVIAS. Si la variable
 *    de la empresa está por debajo del umbral, se aplican efectos extra y otra crónica.
 */

const GAME_CONSTANTS = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 100,
  ROUNDS_MIN: 6,
  ROUNDS_MAX: 10,
  ROUND_DURATION_SECONDS: 300,
  DECISION_TIMEOUT_SECONDS: 180,
};

// Presupuesto de inversión que el consejo asigna cada ciclo (no sale del capital).
const INVESTMENT_BUDGET_PER_ROUND = 500000;

const COMPANY_INITIAL_STATE = {
  capital: 1000000,
  marketShare: 5,
  reputation: 50,
  environmentalFootprint: 50, // menor es mejor
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
  globalTemperature: 1.5,
  economicStability: 60,
  consumerConfidence: 55,
  internationalRegulation: 40,
  globalInnovation: 35,
  socialInequality: 55,
  sustainabilityIndex: 55,
};

// ─────────────────────────────────────────────────────────────────────────────
// PROVEEDORES (la opción A/B/C de cada dilema hereda el perfil de riesgo oculto)
// ─────────────────────────────────────────────────────────────────────────────
const SUPPLIERS = [
  {
    id: 'A',
    name: 'GlobalFast Manufacturing',
    publicInfo: {
      priceMultiplier: 0.6,
      deliverySpeed: 'Inmediata (48h)',
      description: 'Producción masiva de bajo costo. Entrega garantizada en 48 horas.',
      certifications: [],
      qualityRating: 3,
      priceLabel: 'Muy Bajo',
      highlight: 'Entrega más rápida del mercado',
    },
    hiddenAttributes: {
      corruption: 75, laborExploitation: 80, realEmissions: 85,
      geopoliticalDependency: 70, reputationRisk: 80, sanctionRisk: 60, climateRisk: 65,
    },
  },
  {
    id: 'B',
    name: 'CertifiedGlobal Partners',
    publicInfo: {
      priceMultiplier: 1.0,
      deliverySpeed: 'Estándar (7-10 días)',
      description: 'Cadena de suministro certificada internacionalmente.',
      certifications: ['ISO 9001', 'Fair Trade Certified'],
      qualityRating: 7,
      priceLabel: 'Medio',
      highlight: 'Certificaciones internacionales verificadas',
    },
    hiddenAttributes: {
      corruption: 25, laborExploitation: 20, realEmissions: 40,
      geopoliticalDependency: 30, reputationRisk: 30, sanctionRisk: 20, climateRisk: 35,
    },
  },
  {
    id: 'C',
    name: 'NeoTech Sustainable Supply',
    publicInfo: {
      priceMultiplier: 1.5,
      deliverySpeed: 'Premium (5 días)',
      description: 'Automatización completa, materiales reciclados, energía 100% renovable.',
      certifications: ['ISO 14001', 'B-Corp', 'Carbon Neutral 2045', 'SA8000'],
      qualityRating: 10,
      priceLabel: 'Alto',
      highlight: 'Cadena de suministro 100% sostenible',
    },
    hiddenAttributes: {
      corruption: 5, laborExploitation: 5, realEmissions: 10,
      geopoliticalDependency: 15, reputationRisk: 10, sanctionRisk: 5, climateRisk: 20,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PERFILES DE ARQUETIPO (explicación final personalizada)
// Los umbrales reales viven en GameEngine.classifyArchetype; aquí se documentan.
// ─────────────────────────────────────────────────────────────────────────────
const ARCHETYPE_PROFILES = {
  LiderSustentable: {
    label: 'Líder Sustentable',
    icon: '🌿',
    tagline: 'Demostraste que la sostenibilidad también es un modelo de negocio.',
    criteria: 'Índice ESG ≥ 70, huella ambiental ≤ 35 y relación con reguladores ≥ 65.',
    description: 'Tu corporación redujo su impacto ambiental de forma real (no cosmética), mantuvo una relación de confianza con los gobiernos y llevó su índice ESG a la élite del mercado.',
    meaning: 'Tu liderazgo pensó en horizontes largos: aceptaste sacrificar margen en los primeros ciclos para construir activos que el mercado no puede copiar rápido — confianza, licencia social y cadenas limpias.',
    strengths: ['Inmunidad frente a aranceles de carbono y sanciones', 'Acceso preferente a mercados y capital verde', 'Lealtad de consumidores y reguladores'],
    risks: ['Márgenes ajustados si el mercado no premia la sostenibilidad', 'Puede perder velocidad frente a competidores más agresivos', 'Exige coherencia permanente: un solo escándalo erosiona años de trabajo'],
    realWorld: 'Empresas como Interface o Ørsted transformaron industrias contaminantes en referentes de descarbonización.',
    lesson: 'La sostenibilidad rentable no es una campaña: es una secuencia de decisiones coherentes en el tiempo.',
    reflection: '¿Qué decisión de tu equipo fue la más difícil de sostener frente a la tentación del beneficio inmediato?',
  },
  InnovadorResponsable: {
    label: 'Innovador Responsable',
    icon: '💡',
    tagline: 'Tecnología de frontera con brújula ética.',
    criteria: 'Innovación ≥ 65, índice ESG ≥ 60 y nivel tecnológico ≥ 55.',
    description: 'Invertiste con fuerza en I+D sin sacrificar los estándares sociales y ambientales. Tu empresa crece por la calidad de sus ideas, no por la explotación de sus costos.',
    meaning: 'Entendiste que la tecnología amplifica valores: la pusiste al servicio de productos mejores y de una transición justa, en lugar de usarla sólo para recortar personal.',
    strengths: ['Ventaja competitiva basada en conocimiento', 'Atracción de talento y alianzas', 'Resiliencia ante regulaciones de IA y datos'],
    risks: ['Alto gasto en investigación con retornos inciertos', 'Riesgo de obsolescencia si deja de invertir', 'Dilemas éticos crecientes con cada salto tecnológico'],
    realWorld: 'Patagonia, Fairphone o los laboratorios de IA que publican sus evaluaciones de seguridad encarnan este perfil.',
    lesson: 'Innovar no es sólo hacer algo nuevo, sino decidir para qué y para quién se hace.',
    reflection: '¿En qué momento elegiste no usar una tecnología aunque fuera rentable?',
  },
  ModeloESG: {
    label: 'Modelo ESG',
    icon: '⚖️',
    tagline: 'Gobernanza ejemplar y cadena de suministro certificada.',
    criteria: 'Índice ESG ≥ 70 y al menos 35% de los ciclos con la opción más sostenible (C).',
    description: 'Tu empresa se convirtió en referencia de buenas prácticas ambientales, sociales y de gobierno corporativo, apoyándose de forma consistente en las opciones más responsables.',
    meaning: 'Priorizaste la transparencia y el cumplimiento: tu estrategia reduce riesgos ocultos y te convierte en un socio confiable para inversionistas institucionales.',
    strengths: ['Bajo perfil de riesgo para inversionistas', 'Cadena de suministro trazable', 'Reputación estable ante crisis'],
    risks: ['Puede quedarse en el cumplimiento sin liderar la transformación', 'Costos de certificación elevados', 'Menor crecimiento de cuota de mercado'],
    realWorld: 'Las empresas con calificación ESG AAA (como Unilever en su etapa de Plan de Vida Sostenible) siguen este patrón.',
    lesson: 'Cumplir bien es valioso, pero el verdadero liderazgo llega cuando el estándar que sigues lo defines tú.',
    reflection: '¿Tu equipo eligió las opciones responsables por convicción o por evitar riesgos?',
  },
  GiganteDisruptivo: {
    label: 'Gigante Disruptivo',
    icon: '🚀',
    tagline: 'Escala y tecnología para dominar el mercado.',
    criteria: 'Cuota de mercado ≥ 14% y nivel tecnológico ≥ 65.',
    description: 'Combinaste una plataforma tecnológica poderosa con una expansión agresiva de mercado. Tu corporación redefine las reglas del sector.',
    meaning: 'Tu estrategia apostó por la velocidad y la escala: ganar primero y ordenar después. Eso crea valor enorme, pero también concentra poder y atrae el escrutinio público.',
    strengths: ['Efectos de red y economías de escala', 'Capacidad de fijar estándares de la industria', 'Gran capacidad de inversión futura'],
    risks: ['Investigaciones antimonopolio', 'Dependencia de la reputación de la plataforma', 'Impactos sociales de la disrupción (empleo, datos)'],
    realWorld: 'Las grandes plataformas digitales que dominaron la década de 2020 son el ejemplo clásico.',
    lesson: 'Cuanto mayor es el poder de mercado, mayor es la responsabilidad que la sociedad exige.',
    reflection: '¿Qué contrapesos debería tener una empresa que domina su mercado?',
  },
  PotenciaTecnologica: {
    label: 'Potencia Tecnológica',
    icon: '⚡',
    tagline: 'La vanguardia del conocimiento técnico.',
    criteria: 'Nivel tecnológico ≥ 68 e innovación ≥ 60.',
    description: 'Tu empresa construyó una de las bases tecnológicas más avanzadas de Neo-Terra: IA, automatización y ciberdefensa de primer nivel.',
    meaning: 'Pusiste el desarrollo técnico en el centro. Tienes las herramientas para liderar el futuro; la pregunta pendiente es si las usarás con el mismo rigor en lo social y ambiental.',
    strengths: ['Productividad y márgenes superiores', 'Protección ante ciberataques', 'Opciones estratégicas abiertas'],
    risks: ['Índice ESG por debajo de su potencial', 'Tensiones laborales por automatización', 'Burbujas tecnológicas'],
    realWorld: 'Los fabricantes de semiconductores y laboratorios de IA de vanguardia encajan en este perfil.',
    lesson: 'La capacidad técnica es un medio: su valor final depende del propósito que la dirige.',
    reflection: '¿Qué hubiera pasado si tu inversión tecnológica se hubiera orientado a la sostenibilidad?',
  },
  ImperioCoporativo: {
    label: 'Imperio Corporativo',
    icon: '🏛️',
    tagline: 'Máximo capital y presencia de mercado.',
    criteria: 'Capital ≥ $2.2M y cuota de mercado ≥ 12%.',
    description: 'Tu empresa acumuló un poder financiero y comercial enorme. Ganaste la carrera de los números.',
    meaning: 'Tu equipo optimizó para el resultado financiero. Es una estrategia legítima, pero conviene preguntarse qué costos quedaron fuera del balance: personas, ecosistemas, confianza.',
    strengths: ['Solidez financiera para resistir crisis', 'Poder de negociación con proveedores', 'Capacidad de adquirir competidores'],
    risks: ['Pasivos ocultos (ambientales, laborales) que pueden estallar', 'Desconfianza de la nueva generación de consumidores', 'Presión regulatoria creciente'],
    realWorld: 'Los grandes conglomerados industriales del siglo XX crecieron así antes de enfrentar la era de la regulación climática.',
    lesson: 'El capital mide lo que ganaste; la reputación y el ESG miden lo que podrás seguir ganando.',
    reflection: '¿Tu éxito financiero sería sostenible si se cobraran todos los costos externos de tus decisiones?',
  },
  CorporacionExtractiva: {
    label: 'Corporación Extractiva',
    icon: '🏭',
    tagline: 'Rentabilidad inmediata a costa del entorno.',
    criteria: 'Al menos 45% de los ciclos eligiendo la opción de menor costo (A) y huella ambiental ≥ 60.',
    description: 'Tu modelo se apoyó de forma recurrente en las opciones más baratas y rápidas, acumulando una huella ambiental y riesgos ocultos muy altos.',
    meaning: 'Tu equipo privilegió el corto plazo. Las ganancias iniciales fueron reales, pero también la deuda ambiental y social que el mundo de Neo-Terra terminó cobrando con eventos, sanciones y pérdida de confianza.',
    strengths: ['Costos operativos bajos', 'Velocidad de ejecución', 'Liquidez en los primeros ciclos'],
    risks: ['Sanciones, embargos y aranceles de carbono', 'Escándalos laborales y boicots', 'Pérdida de acceso a mercados internacionales'],
    realWorld: 'Los casos de colapsos de fábricas textiles o derrames petroleros muestran el costo real de este modelo.',
    lesson: 'Los costos que una empresa no paga no desaparecen: los paga alguien más, y tarde o temprano regresan.',
    reflection: '¿En qué ronda pudo tu equipo cambiar de rumbo y por qué no lo hizo?',
  },
  EmpresaEnCrisis: {
    label: 'Empresa en Crisis',
    icon: '⚠️',
    tagline: 'Las consecuencias acumuladas te alcanzaron.',
    criteria: 'Capital ≤ $300K o reputación ≤ 20.',
    description: 'Tu corporación terminó la simulación descapitalizada o con su reputación destruida tras una cadena de decisiones y eventos adversos.',
    meaning: 'No es un fracaso personal: es el escenario donde más se aprende. Revisa en qué momento los riesgos ocultos se materializaron y qué señal ignoró tu equipo.',
    strengths: ['Aprendizaje profundo sobre gestión de riesgos', 'Oportunidad de reestructuración total', 'Claridad sobre qué no repetir'],
    risks: ['Insolvencia o adquisición hostil', 'Pérdida de licencia social para operar', 'Fuga de talento'],
    realWorld: 'Enron, Wirecard o Evergrande ilustran cómo los riesgos acumulados pueden derrumbar gigantes.',
    lesson: 'Las crisis rara vez llegan de golpe: son la suma de pequeñas decisiones que parecían inofensivas.',
    reflection: 'Si pudieras repetir un solo ciclo, ¿cuál sería y qué cambiarías?',
  },
  SobrevivienteMercado: {
    label: 'Sobreviviente de Mercado',
    icon: '🛡️',
    tagline: 'Equilibrio resiliente entre todas las presiones.',
    criteria: 'No cumple los umbrales de ningún arquetipo extremo: perfil balanceado.',
    description: 'Tu empresa navegó la simulación sin caer en extremos: ni el villano ni el héroe de la historia, pero sí una organización que sigue en pie.',
    meaning: 'Tu equipo tomó decisiones mixtas. Esa prudencia te protegió de los peores escenarios, pero también te impidió destacar en alguna dimensión.',
    strengths: ['Diversificación de riesgos', 'Estabilidad operativa', 'Flexibilidad para reorientarse'],
    risks: ['Falta de una propuesta de valor distintiva', 'Vulnerable ante competidores con estrategia clara', 'Puede quedar rezagada en la transición'],
    realWorld: 'Muchas empresas medianas sobreviven así: estables, pero sin un liderazgo claro en su sector.',
    lesson: 'Sobrevivir no es lo mismo que liderar: la estrategia exige elegir en qué ser excelente.',
    reflection: '¿En qué dimensión hubieras querido que tu empresa fuera la mejor de la sala?',
  },
};

// Compatibilidad: algunos módulos antiguos importaban ARCHETYPE_THRESHOLDS
const ARCHETYPE_THRESHOLDS = ARCHETYPE_PROFILES;

const DEFAULT_FOCUS = [
  { id: 'tech', label: 'Innovación e I+D', desc: '+Nivel tecnológico e innovación' },
  { id: 'green', label: 'Transición Verde', desc: '−Huella ambiental, +ESG' },
  { id: 'social', label: 'Bienestar y Comunidad', desc: '+Relaciones laborales y reputación' },
  { id: 'cyber', label: 'Ciberdefensa', desc: '+Protección de datos críticos' },
];

// ─────────────────────────────────────────────────────────────────────────────
// DILEMAS TEMÁTICOS (rondas 1..9)
// ─────────────────────────────────────────────────────────────────────────────
const ROUND_SCENARIOS = {
  1: {
    title: 'El Boom de la IA y el Dilema de los Suministros',
    theme: 'Cadena de suministro',
    context: 'La demanda de chips cuánticos y baterías de alta densidad se dispara. Como CEO debes establecer la cadena de suministro que sostendrá a tu multinacional durante la próxima década.',
    dilemmaQuestion: '¿A qué socio comercial confiarás la manufactura de tus componentes clave?',
    learningGoal: 'Las decisiones de proveedores tienen riesgos ocultos que no aparecen en el precio.',
    options: [
      {
        id: 'A', name: 'Manufactura Masiva Ultra-Rápida', badge: 'Costo Muy Bajo', badgeColor: 'terracotta',
        preview: 'Entrega en 48h y máximo margen inmediato.',
        narrativeRisk: 'Proveedores no auditados con sospechas de explotación laboral y alta huella de carbono.',
        effects: { capital: 60000 },
        story: 'Tu alianza con GlobalFast Manufacturing redujo costos un 40% y aceleró las entregas a 48 horas. Pero imágenes satelitales comenzaron a mostrar descargas tóxicas y jornadas abusivas en las plantas que fabrican tus componentes. Por ahora es un rumor; el riesgo queda sembrado en tu cadena.',
        cascade: ['Elección de manufactura barata no auditada', 'Ahorro inmediato en costos de producción', 'Acumulación silenciosa de riesgo laboral y de emisiones', 'Mayor exposición a escándalos y sanciones futuras'],
      },
      {
        id: 'B', name: 'Consorcio Certificado ISO / Fair Trade', badge: 'Costo Equilibrado', badgeColor: 'moss',
        preview: 'Entrega estándar (7-10 días) con salarios dignos documentados.',
        narrativeRisk: 'Margen moderado, pero blindaje frente a escándalos internacionales.',
        effects: { consumerRelations: 3, regulatorRelations: 2 },
        story: 'Al asociarte con CertifiedGlobal aseguraste normas laborales verificadas y certificación Fair Trade. Tus entregas son más lentas y tus márgenes moderados, pero tu empresa quedó protegida frente a las auditorías sorpresa que empiezan a recorrer la industria.',
        cascade: ['Cadena de suministro con certificaciones ISO', 'Costos predecibles y entregas estables', 'Menor exposición a inspecciones regulatorias', 'Confianza creciente de clientes institucionales'],
      },
      {
        id: 'C', name: 'Ecosistema Autónomo 100% Renovable', badge: 'Inversión Premium', badgeColor: 'moss',
        preview: 'Plantas automatizadas con energía solar y reciclaje de tierras raras.',
        narrativeRisk: 'Alto costo de capital inicial, pero liderazgo inmediato en ESG.',
        effects: { capital: -40000, esgIndex: 4, reputation: 3 },
        story: 'Tu apuesta por el ecosistema 100% renovable exigió un desembolso fuerte, pero te posicionó como referente de la economía limpia. Los fondos de inversión verde elevaron tu calificación ESG y abrieron conversaciones para contratos en los mercados más exigentes.',
        cascade: ['Inversión en robótica solar y reciclaje de minerales', 'Desembolso inicial con márgenes ajustados', 'Reconocimiento temprano en índices de sostenibilidad', 'Acceso preferente a licitaciones de alto valor'],
      },
    ],
    investmentFocusOptions: DEFAULT_FOCUS,
  },

  2: {
    title: 'La Gran Ola de Automatización',
    theme: 'Trabajo y automatización',
    context: 'Los sistemas autónomos pueden sustituir al 70% de la fuerza laboral operativa. Los accionistas presionan por eficiencia; sindicatos y sociedad civil exigen un freno ético.',
    dilemmaQuestion: '¿Cómo implementarás la revolución de la IA en tu empresa?',
    learningGoal: 'La tecnología redistribuye costos y beneficios entre empresa, trabajadores y sociedad.',
    options: [
      {
        id: 'A', name: 'Automatización Total Agresiva', badge: 'Margen Extremo', badgeColor: 'terracotta',
        preview: 'Despido masivo de operarios y reemplazo por robots autónomos.',
        narrativeRisk: 'Dispara ganancias a corto plazo, pero provoca huelgas y daño reputacional.',
        effects: { capital: 120000, techLevel: 8, laborRelations: -18, reputation: -6 },
        story: 'La automatización del 70% de tus operaciones disparó tu margen bruto. Sin embargo, las ciudades fabriles estallaron en protestas: los sindicatos convocaron un boicot coordinado y la moral de tu personal técnico se desplomó.',
        cascade: ['Despido masivo y reemplazo por IA no supervisada', 'Incremento del margen operativo a corto plazo', 'Huelgas en centros de distribución clave', 'Derrumbe de relaciones laborales y riesgo de boicot'],
      },
      {
        id: 'B', name: 'Modelo Híbrido de Reconversión', badge: 'Estrategia Equilibrada', badgeColor: 'moss',
        preview: 'Programas de re-capacitación en IA para tus empleados.',
        narrativeRisk: 'Costo moderado, pero mantiene la paz social.',
        effects: { capital: -30000, techLevel: 5, innovation: 3, laborRelations: 4 },
        story: 'Tu programa de reconversión capacitó a cientos de trabajadores para operar junto a la IA. La productividad aumentó sin crisis social, y gobierno y sindicatos citaron tu modelo como ejemplo de transición justa.',
        cascade: ['IA colaborativa con re-capacitación', 'Inversión educativa para el personal', 'Paz social y eficiencia sostenida', 'Lealtad del consumidor y estabilidad institucional'],
      },
      {
        id: 'C', name: 'Pacto Social de Blindaje Humano', badge: 'Compromiso Ético', badgeColor: 'moss',
        preview: 'Garantizar el empleo humano y limitar la IA a tareas auxiliares.',
        narrativeRisk: 'Márgenes más bajos, pero apoyo de reguladores y consumidores.',
        effects: { capital: -50000, laborRelations: 15, reputation: 6, techLevel: -2 },
        story: 'El Pacto Social te convirtió en el empleador más respetado del sector. Pero los competidores con fábricas robotizadas bajaron precios con fuerza, presionando tu rentabilidad: tendrás que innovar para sostener tu promesa.',
        cascade: ['Blindaje del empleo y salarios justos', 'Máxima lealtad de los empleados', 'Pérdida de competitividad en costos', 'Necesidad urgente de innovar para sostener márgenes'],
      },
    ],
    investmentFocusOptions: DEFAULT_FOCUS,
  },

  3: {
    title: 'Emergencia Climática y Aranceles de Carbono',
    theme: 'Clima y regulación',
    context: 'La temperatura media ha subido de forma drástica. Las naciones aprueban el "Pacto de Neo-Terra": multas severas para las empresas que emiten gases contaminantes.',
    dilemmaQuestion: '¿Cómo responderás a la ofensiva regulatoria ambiental?',
    learningGoal: 'Evadir la regulación traslada el costo al futuro; adaptarse temprano lo convierte en ventaja.',
    options: [
      {
        id: 'A', name: 'Paraísos Regulatorios y Evasión', badge: 'Evasión de Costos', badgeColor: 'terracotta',
        preview: 'Mudar plantas y servidores a jurisdicciones sin leyes ambientales.',
        narrativeRisk: 'Ahorro inmediato, pero riesgo de bloqueos comerciales.',
        effects: { capital: 90000, regulatorRelations: -12, internationalAccess: -8, environmentalFootprint: 6 },
        story: 'Tu mudanza a paraísos regulatorios evitó los aranceles inmediatos. La respuesta internacional fue rápida: varios bloques comerciales impusieron aranceles compensatorios a tus cargamentos y te incluyeron en listas de vigilancia.',
        cascade: ['Traslado a jurisdicciones sin ley ecológica', 'Evasión temporal de aranceles de carbono', 'Aranceles compensatorios internacionales', 'Deterioro de la relación con reguladores'],
      },
      {
        id: 'B', name: 'Compra de Bonos de Compensación', badge: 'Mitigación Convencional', badgeColor: 'moss',
        preview: 'Pagar multas y adquirir bonos de carbono.',
        narrativeRisk: 'Costo recurrente predecible; los consumidores cuestionan el impacto real.',
        effects: { capital: -60000, regulatorRelations: 3 },
        story: 'El pago disciplinado de bonos te permitió operar sin contratiempos legales. Cumpliste la ley, aunque organizaciones ambientalistas advierten que comprar bonos no limpia la atmósfera real.',
        cascade: ['Adquisición de bonos de compensación', 'Gasto recurrente sin reconversión estructural', 'Cumplimiento de estándares mínimos', 'Escrutinio creciente sobre el impacto real'],
      },
      {
        id: 'C', name: 'Descarbonización Total Inmediata', badge: 'Liderazgo Sostenible', badgeColor: 'moss',
        preview: 'Cerrar toda instalación fósil y operar con 100% renovables.',
        narrativeRisk: 'Fuerte desembolso, pero exenciones fiscales y mercados preferentes.',
        effects: { capital: -140000, environmentalFootprint: -18, esgIndex: 8, regulatorRelations: 8 },
        story: 'Ejecutaste la descarbonización total y tu huella ambiental cayó en picada. Mientras otros enfrentaban multas, tú recibiste exenciones fiscales y el reconocimiento de los consumidores conscientes.',
        cascade: ['Cierre de plantas térmicas', 'Gasto extraordinario de capital', 'Inmunidad frente a aranceles de carbono', 'Impulso al índice ESG y a la relación con gobiernos'],
      },
    ],
    investmentFocusOptions: [
      { id: 'tech', label: 'Captura de Carbono', desc: 'Innovación ambiental' },
      { id: 'green', label: 'Empaques Circulares', desc: 'Cumplimiento normativo' },
      { id: 'social', label: 'Compensación a Comunidades', desc: 'Alianzas con ONGs' },
      { id: 'cyber', label: 'Monitoreo Satelital de Emisiones', desc: 'Trazabilidad de datos' },
    ],
  },

  4: {
    title: 'El Gran Asedio Cibernético',
    theme: 'Ciberseguridad',
    context: 'Un ataque cibernético cuántico sin precedentes paraliza la logística intercontinental. Redes de hacktivistas exponen secretos corporativos.',
    dilemmaQuestion: '¿Cuál es tu estrategia ante la crisis global de ciberseguridad?',
    learningGoal: 'La seguridad es una inversión acumulativa: lo que no invertiste antes se paga en la crisis.',
    options: [
      {
        id: 'A', name: 'No Invertir y Minimizar el Ataque', badge: 'Ahorro Máximo', badgeColor: 'terracotta',
        preview: 'Considerarlo una amenaza menor y no gastar en defensa.',
        narrativeRisk: 'Si tus defensas previas son débiles, perderás datos, patentes y capital.',
        effects: { capital: 50000 },
        story: 'Decidiste no gastar en defensa adicional. Tus inversiones previas en ciberseguridad resistieron el asedio: fue una apuesta arriesgada que esta vez salió bien.',
        cascade: ['Omisión de gasto adicional en ciberdefensa', 'Las defensas construidas en ciclos previos resistieron', 'Ahorro de capital sin interrupciones', 'Lección: la apuesta dependió de decisiones anteriores'],
        risk: {
          variable: 'cybersecurity', below: 50, label: 'Ciberseguridad',
          effects: { capital: -200000, reputation: -10, innovation: -8, consumerRelations: -8 },
          story: 'No invertir en ciberdefensa fue un error catastrófico. Un ransomware cuántico secuestró tu base de patentes y paralizó tu logística 72 horas. La fuga de datos de clientes desató demandas millonarias.',
          cascade: ['Omisión de gasto en ciberseguridad', 'Ransomware cuántico en servidores centrales (defensas previas < 50)', 'Pérdida de propiedad intelectual y datos de clientes', 'Pérdida de capital en rescates y multas'],
        },
      },
      {
        id: 'B', name: 'Blindaje Privado con IA Cuántica', badge: 'Seguridad Privada', badgeColor: 'moss',
        preview: 'Contratar las mejores firmas de ciberdefensa sólo para ti.',
        narrativeRisk: 'Inversión alta, pero continuidad operativa garantizada.',
        effects: { capital: -90000, cybersecurity: 18, marketShare: 1 },
        story: 'Tu blindaje cuántico privado repelió los ataques con precisión quirúrgica. Operaste al 100% mientras media industria colapsaba, y capturaste clientes cuyos proveedores estaban caídos.',
        cascade: ['Ciberdefensa cuántica de primer nivel', 'Desembolso en infraestructura privada', 'Continuidad operativa total', 'Captura de clientes de competidores hackeados'],
      },
      {
        id: 'C', name: 'Alianza Abierta de Ciberinteligencia', badge: 'Defensa Colectiva', badgeColor: 'moss',
        preview: 'Compartir código e informes de amenazas con toda la industria.',
        narrativeRisk: 'Fortalece a toda la economía y te posiciona como líder confiable.',
        effects: { capital: -50000, cybersecurity: 10, reputation: 8, regulatorRelations: 8 },
        story: 'Lideraste la Alianza Abierta de Ciberdefensa compartiendo amenazas en tiempo real. Protegiste a tu empresa y a la red logística del continente; los gobiernos te nombraron asesor técnico.',
        cascade: ['Protocolos de defensa en código abierto', 'Neutralización colectiva del ataque', 'Reconocimiento gubernamental', 'Alianza estratégica con reguladores'],
      },
    ],
    investmentFocusOptions: [
      { id: 'tech', label: 'Criptografía Post-Cuántica', desc: 'Inmunidad digital' },
      { id: 'green', label: 'Servidores con Enfriamiento Verde', desc: 'Eficiencia energética' },
      { id: 'social', label: 'Privacidad de Usuarios', desc: 'Confianza de consumidores' },
      { id: 'cyber', label: 'Auditoría Forense de Red', desc: 'Detección temprana de brechas' },
    ],
  },

  5: {
    title: 'La Rebelión del Consumidor: Auditoría vs. Greenwashing',
    theme: 'Transparencia',
    context: 'Los consumidores ya no creen en discursos corporativos. Protestas globales exigen ver los datos reales de las cadenas de suministro.',
    dilemmaQuestion: '¿Cómo enfrentarás la demanda masiva de transparencia?',
    learningGoal: 'El greenwashing funciona sólo mientras nadie compara el discurso con los datos.',
    options: [
      {
        id: 'A', name: 'Campaña Agresiva de Greenwashing', badge: 'Relaciones Públicas', badgeColor: 'terracotta',
        preview: 'Publicidad verde emotiva sin cambiar fábricas ni proveedores.',
        narrativeRisk: 'Si tu ESG real es bajo, una filtración hundirá tu credibilidad.',
        effects: { capital: 60000, marketShare: 1.5 },
        story: 'Tu campaña verde atrajo nuevos clientes. Los periodistas compararon tu publicidad con tus datos reales y, como tu índice ESG ya era sólido, la crítica fue menor: tu historial respaldó el discurso.',
        cascade: ['Gasto en publicidad verde', 'Auge de ventas', 'Auditoría periodística de tus datos reales', 'Tu ESG previo (≥ 60) evitó el escándalo'],
        risk: {
          variable: 'esgIndex', below: 60, label: 'Índice ESG',
          effects: { reputation: -18, consumerRelations: -12, regulatorRelations: -8, marketShare: -2.5 },
          story: 'Tu greenwashing funcionó tres meses, hasta que hackers y periodistas filtraron las facturas reales de tus proveedores. La indignación fue viral: manifestaciones frente a tus oficinas y cancelación de contratos.',
          cascade: ['Publicidad verde sin cambios reales', 'Auge temporal de ventas', 'Filtración que contrasta discurso y datos (ESG < 60)', 'Derrumbe reputacional y causas judiciales'],
        },
      },
      {
        id: 'B', name: 'Auditoría Externa y Reportes ESG Públicos', badge: 'Transparencia Verificada', badgeColor: 'moss',
        preview: 'Publicar auditorías completas asumiendo errores pasados.',
        narrativeRisk: 'Críticas a corto plazo, respeto institucional a largo plazo.',
        effects: { capital: -40000, reputation: 5, regulatorRelations: 6, esgIndex: 4 },
        story: 'Publicaste auditorías externas verificadas y reconociste áreas de mejora sin maquillar cifras. Los mercados premiaron tu honestidad con estabilidad y contratos de largo plazo.',
        cascade: ['Apertura de auditorías de emisiones', 'Escrutinio inicial sin consecuencias punitivas', 'Validación de evaluadoras internacionales', 'Menor costo de capital'],
      },
      {
        id: 'C', name: 'Trazabilidad Blockchain Radical', badge: 'Apertura Total', badgeColor: 'moss',
        preview: 'Hacer pública la procedencia de cada material y cada salario.',
        narrativeRisk: 'No deja espacio para secretos; te convierte en la marca más ética.',
        effects: { capital: -80000, reputation: 10, consumerRelations: 10, esgIndex: 6, techLevel: 4 },
        story: 'Tu trazabilidad blockchain cambió el estándar de la industria: cualquier cliente puede ver el salario del operario y la huella de cada componente. Creaste una ventaja que tus rivales opacos no pueden copiar.',
        cascade: ['Trazabilidad criptográfica total', 'Inversión tecnológica en transparencia', 'Adopción masiva por consumidores jóvenes', 'Liderazgo ético y lealtad de marca'],
      },
    ],
    investmentFocusOptions: [
      { id: 'tech', label: 'Plataforma de Trazabilidad', desc: 'Datos abiertos' },
      { id: 'green', label: 'Eliminación de Plásticos', desc: 'Certificación circular' },
      { id: 'social', label: 'Consejo Comunitario', desc: 'Gobernanza participativa' },
      { id: 'cyber', label: 'Verificación de Proveedores por IA', desc: 'Filtro ético automático' },
    ],
  },

  6: {
    title: 'La Guerra de las Tierras Raras',
    theme: 'Geopolítica',
    context: 'Dos bloques geopolíticos se disputan los yacimientos de litio, cobalto y neodimio. Los precios se triplican y aparecen intermediarios que ofrecen minerales de zonas en conflicto sin hacer preguntas.',
    dilemmaQuestion: '¿Cómo asegurarás los minerales críticos para tu producción?',
    learningGoal: 'La dependencia geopolítica es un riesgo de negocio; diversificar y reciclar crea resiliencia.',
    options: [
      {
        id: 'A', name: 'Comprar a Intermediarios sin Preguntas', badge: 'Suministro Inmediato', badgeColor: 'terracotta',
        preview: 'Minerales baratos y disponibles de zonas en conflicto.',
        narrativeRisk: 'Si tu relación con reguladores es débil, enfrentarás sanciones y embargos.',
        effects: { capital: 100000, logisticCapacity: 5 },
        story: 'Aseguraste minerales baratos mientras tus rivales se quedaban sin inventario. Las autoridades investigaron el origen, pero tu buena relación con los reguladores te dio margen para corregir la trazabilidad sin sanciones mayores.',
        cascade: ['Compra de minerales sin trazabilidad', 'Producción sin interrupciones', 'Investigación sobre el origen de los minerales', 'Tu relación con reguladores (≥ 50) amortiguó el golpe'],
        risk: {
          variable: 'regulatorRelations', below: 50, label: 'Relación con reguladores',
          effects: { capital: -180000, internationalAccess: -15, reputation: -10 },
          story: 'Una investigación de la ONU vinculó tus minerales con milicias armadas. Sin aliados regulatorios, tus productos fueron embargados en tres bloques comerciales y tu marca apareció en los titulares junto a la palabra "conflicto".',
          cascade: ['Compra de minerales de zonas en conflicto', 'Investigación internacional sobre su origen', 'Embargo comercial (relación con reguladores < 50)', 'Pérdida de acceso internacional y reputación'],
        },
      },
      {
        id: 'B', name: 'Diversificar Proveedores entre Bloques', badge: 'Resiliencia', badgeColor: 'moss',
        preview: 'Contratos en varios continentes para no depender de nadie.',
        narrativeRisk: 'Costo logístico mayor, pero menor exposición a conflictos.',
        effects: { capital: -60000, logisticCapacity: 8, internationalAccess: 6 },
        story: 'Repartiste tus contratos entre varios bloques. Pagaste más por la logística, pero cuando un corredor comercial se cerró, tus otras rutas mantuvieron la producción en marcha.',
        cascade: ['Contratos en múltiples regiones', 'Mayor costo logístico', 'Producción estable pese al cierre de rutas', 'Mayor acceso internacional'],
      },
      {
        id: 'C', name: 'Minería Urbana y Reciclaje Propio', badge: 'Economía Circular', badgeColor: 'moss',
        preview: 'Recuperar minerales de dispositivos usados en plantas propias.',
        narrativeRisk: 'Inversión alta, pero independencia total del conflicto.',
        effects: { capital: -100000, environmentalFootprint: -8, innovation: 8, esgIndex: 5 },
        story: 'Construiste plantas de minería urbana que recuperan minerales de millones de dispositivos desechados. Te independizaste del conflicto y convertiste un problema de residuos en tu ventaja estratégica.',
        cascade: ['Plantas de reciclaje de dispositivos', 'Fuerte inversión de capital', 'Independencia de los bloques en conflicto', 'Menor huella e impulso a la innovación'],
      },
    ],
    investmentFocusOptions: [
      { id: 'tech', label: 'Materiales Sustitutos', desc: 'Investigación de nuevas aleaciones' },
      { id: 'green', label: 'Reciclaje de Baterías', desc: 'Economía circular' },
      { id: 'social', label: 'Comunidades Mineras', desc: 'Relaciones con territorios' },
      { id: 'cyber', label: 'Trazabilidad de Minerales', desc: 'Certificación de origen' },
    ],
  },

  7: {
    title: 'Refugiados Climáticos y el Impuesto Solidario',
    theme: 'Desigualdad social',
    context: 'Millones de personas abandonan zonas costeras inundadas. Los gobiernos proponen un impuesto corporativo solidario para financiar vivienda y empleo. Los lobbies empresariales se movilizan para bloquearlo.',
    dilemmaQuestion: '¿Qué postura tomará tu corporación ante la crisis humanitaria?',
    learningGoal: 'Las empresas operan dentro de sociedades: la estabilidad social también es su activo.',
    options: [
      {
        id: 'A', name: 'Financiar el Lobby contra el Impuesto', badge: 'Defensa del Margen', badgeColor: 'terracotta',
        preview: 'Pagar campañas y cabilderos para frenar la ley.',
        narrativeRisk: 'Protege tus utilidades, pero te expone como antagonista social.',
        effects: { capital: 80000, regulatorRelations: -6, reputation: -8, laborRelations: -4 },
        story: 'Tu lobby retrasó la ley y protegió tus utilidades. Pero una filtración reveló los montos que pagaste a cabilderos mientras miles de familias vivían en albergues. Tu nombre se volvió símbolo de indiferencia.',
        cascade: ['Financiamiento de cabildeo político', 'Retraso del impuesto solidario', 'Filtración de los pagos a cabilderos', 'Daño reputacional y tensión con gobiernos'],
      },
      {
        id: 'B', name: 'Cumplir el Impuesto sin Más', badge: 'Cumplimiento', badgeColor: 'moss',
        preview: 'Pagar la nueva contribución sin involucrarse más.',
        narrativeRisk: 'Costo moderado y neutralidad pública.',
        effects: { capital: -60000, regulatorRelations: 5, reputation: 3 },
        story: 'Pagaste el impuesto solidario sin oponerte ni destacar. Los gobiernos valoraron tu cooperación y tu empresa evitó la polémica que envolvió a quienes intentaron bloquear la ley.',
        cascade: ['Pago de la contribución solidaria', 'Neutralidad en el debate público', 'Buena relación con gobiernos', 'Estabilidad reputacional'],
      },
      {
        id: 'C', name: 'Programa de Inclusión Laboral', badge: 'Impacto Social', badgeColor: 'moss',
        preview: 'Contratar y capacitar a refugiados climáticos en tus plantas.',
        narrativeRisk: 'Inversión mayor, pero te convierte en parte de la solución.',
        effects: { capital: -90000, laborRelations: 12, reputation: 10, esgIndex: 6, consumerRelations: 5 },
        story: 'Además de pagar el impuesto, abriste 3,000 puestos con capacitación para refugiados climáticos. Tus plantas ganaron talento motivado y tu marca se convirtió en sinónimo de solidaridad.',
        cascade: ['Contratación y capacitación de refugiados', 'Inversión social significativa', 'Nuevo talento leal y motivado', 'Fuerte impulso a reputación y ESG'],
      },
    ],
    investmentFocusOptions: [
      { id: 'tech', label: 'Plataformas de Empleo Digital', desc: 'Conectar talento desplazado' },
      { id: 'green', label: 'Vivienda Resiliente', desc: 'Infraestructura climática' },
      { id: 'social', label: 'Educación y Capacitación', desc: 'Movilidad social' },
      { id: 'cyber', label: 'Identidad Digital Segura', desc: 'Protección de datos vulnerables' },
    ],
  },

  8: {
    title: 'El Mercado de los Datos y la IA de Vigilancia',
    theme: 'Ética de datos',
    context: 'Tu empresa posee datos de comportamiento de 400 millones de usuarios. Anunciantes y gobiernos ofrecen sumas récord por acceder a ellos para entrenar sistemas de vigilancia predictiva.',
    dilemmaQuestion: '¿Qué harás con los datos de tus usuarios?',
    learningGoal: 'La confianza digital es un activo frágil: monetizar datos sin consentimiento tiene costos diferidos.',
    options: [
      {
        id: 'A', name: 'Vender los Datos al Mejor Postor', badge: 'Ingreso Récord', badgeColor: 'terracotta',
        preview: 'Licenciar los datos sin pedir consentimiento adicional.',
        narrativeRisk: 'Si tu relación con reguladores es débil, las multas serán devastadoras.',
        effects: { capital: 150000 },
        story: 'La venta de datos generó un ingreso récord. Los reguladores abrieron una revisión, pero tu historial de cooperación permitió negociar un acuerdo con una multa menor y compromisos de mejora.',
        cascade: ['Venta masiva de datos de usuarios', 'Ingreso extraordinario', 'Revisión regulatoria', 'Tu relación con reguladores (≥ 55) evitó la multa máxima'],
        risk: {
          variable: 'regulatorRelations', below: 55, label: 'Relación con reguladores',
          effects: { capital: -220000, reputation: -15, consumerRelations: -15 },
          story: 'La venta de datos se descubrió cuando un sistema de vigilancia entrenado con ellos discriminó a millones de personas. Sin aliados regulatorios, recibiste la multa máxima bajo la ley GDPR-2045 y una demanda colectiva.',
          cascade: ['Venta masiva de datos sin consentimiento', 'Uso discriminatorio por parte de terceros', 'Multa máxima (relación con reguladores < 55)', 'Éxodo de usuarios y demanda colectiva'],
        },
      },
      {
        id: 'B', name: 'Monetizar con Consentimiento Explícito', badge: 'Modelo Opt-In', badgeColor: 'moss',
        preview: 'Pagar a los usuarios que acepten compartir sus datos.',
        narrativeRisk: 'Ingreso menor, pero legal y transparente.',
        effects: { capital: 40000, consumerRelations: 3 },
        story: 'Ofreciste a tus usuarios una parte de los ingresos a cambio de compartir datos de forma voluntaria. El 30% aceptó: menos ingreso que la venta masiva, pero ninguna sorpresa legal.',
        cascade: ['Modelo de datos con consentimiento', 'Ingreso moderado y legal', 'Usuarios informados y compensados', 'Confianza digital estable'],
      },
      {
        id: 'C', name: 'Privacidad por Diseño: Cero Venta', badge: 'Confianza Digital', badgeColor: 'moss',
        preview: 'Cifrar todo y no vender datos bajo ninguna circunstancia.',
        narrativeRisk: 'Renuncias a un ingreso enorme a cambio de confianza total.',
        effects: { capital: -40000, consumerRelations: 12, reputation: 8, cybersecurity: 8 },
        story: 'Cifraste los datos de extremo a extremo y anunciaste que jamás los venderías. Cuando estalló el escándalo de vigilancia en la industria, millones de usuarios migraron a tus servicios.',
        cascade: ['Cifrado total y política de cero venta', 'Renuncia a ingresos por datos', 'Migración de usuarios desde competidores', 'Confianza digital y ciberseguridad reforzadas'],
      },
    ],
    investmentFocusOptions: [
      { id: 'tech', label: 'IA Explicable', desc: 'Algoritmos auditables' },
      { id: 'green', label: 'Centros de Datos Eficientes', desc: 'Menor consumo energético' },
      { id: 'social', label: 'Alfabetización Digital', desc: 'Usuarios informados' },
      { id: 'cyber', label: 'Cifrado de Extremo a Extremo', desc: 'Protección total' },
    ],
  },

  9: {
    title: 'La Recesión Global y la Crisis de Deuda',
    theme: 'Economía',
    context: 'Una crisis de deuda soberana congela el crédito. Las ventas caen 25% y los accionistas exigen proteger el valor de la acción a toda costa.',
    dilemmaQuestion: '¿Cómo protegerás a tu corporación durante la recesión?',
    learningGoal: 'En las crisis se revela la estrategia: recortar para sobrevivir o invertir para salir más fuerte.',
    options: [
      {
        id: 'A', name: 'Despidos Masivos y Recompra de Acciones', badge: 'Valor al Accionista', badgeColor: 'terracotta',
        preview: 'Recortar 30% de la plantilla y recomprar acciones.',
        narrativeRisk: 'Mejora el balance inmediato, pero destruye capacidad futura.',
        effects: { capital: 200000, laborRelations: -20, reputation: -10, innovation: -6 },
        story: 'Los despidos y la recompra de acciones mejoraron tu balance trimestral. Pero perdiste a ingenieros clave, tus centros de innovación quedaron vacíos y las comunidades donde operas te ven como un actor que abandona en tiempos difíciles.',
        cascade: ['Recorte del 30% de la plantilla', 'Recompra de acciones y mejora del balance', 'Pérdida de talento e innovación', 'Deterioro laboral y reputacional'],
      },
      {
        id: 'B', name: 'Recorte de Costos Equilibrado', badge: 'Prudencia', badgeColor: 'moss',
        preview: 'Reducir gastos no esenciales y congelar contrataciones.',
        narrativeRisk: 'Protege la operación sin grandes sacrificios ni avances.',
        effects: { capital: 60000, laborRelations: -4 },
        story: 'Congelaste contrataciones y recortaste gastos no esenciales. Atravesaste la recesión sin despidos masivos ni grandes avances: sobreviviste con la estructura intacta.',
        cascade: ['Congelamiento de contrataciones', 'Ahorro moderado', 'Operación protegida', 'Ligera tensión laboral'],
      },
      {
        id: 'C', name: 'Inversión Contracíclica en Economía Verde', badge: 'Visión de Largo Plazo', badgeColor: 'moss',
        preview: 'Mantener el empleo e invertir mientras otros recortan.',
        narrativeRisk: 'Apuesta costosa que posiciona a tu empresa para la recuperación.',
        effects: { capital: -120000, laborRelations: 10, innovation: 8, environmentalFootprint: -8, marketShare: 1.5, esgIndex: 5 },
        story: 'Mientras tus competidores recortaban, mantuviste el empleo y aceleraste proyectos verdes aprovechando costos bajos. Cuando la economía se recuperó, tu empresa estaba lista para capturar la nueva demanda.',
        cascade: ['Mantenimiento del empleo', 'Inversión en proyectos verdes a bajo costo', 'Talento e innovación preservados', 'Ganancia de cuota en la recuperación'],
      },
    ],
    investmentFocusOptions: [
      { id: 'tech', label: 'Eficiencia Operativa con IA', desc: 'Reducir costos sin despidos' },
      { id: 'green', label: 'Infraestructura Verde', desc: 'Estímulo económico sostenible' },
      { id: 'social', label: 'Fondo de Protección Laboral', desc: 'Retener talento' },
      { id: 'cyber', label: 'Resiliencia Financiera Digital', desc: 'Proteger sistemas de pago' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DILEMA DE CIERRE (siempre la última ronda)
// ─────────────────────────────────────────────────────────────────────────────
const FINAL_SCENARIO = {
  title: 'El Veredicto de Neo-Terra: El Legado Corporativo',
  theme: 'Legado',
  isFinal: true,
  context: 'El ciclo histórico concluye. Los tribunales de mercado, los inversionistas y la sociedad juzgan a cada corporación. Ha llegado el momento de definir el legado de tu organización.',
  dilemmaQuestion: '¿Cuál es la misión final de tu organización?',
  learningGoal: 'El legado de una empresa es la suma de todas sus decisiones, no sólo la última.',
  options: [
    {
      id: 'A', name: 'Maximización de Dividendos y Monopolio', badge: 'Imperio Financiero', badgeColor: 'terracotta',
      preview: 'Liquidar inversiones blandas y capturar el máximo capital posible.',
      narrativeRisk: 'Te acerca a Imperio Corporativo o Corporación Extractiva.',
      effects: { capital: 300000, marketShare: 2, reputation: -8, esgIndex: -6 },
      story: 'Repartiste dividendos récord y consolidaste tu poder de mercado. Los accionistas celebran; los analistas de sostenibilidad advierten que dejaste pasivos sin resolver para las próximas generaciones.',
      cascade: ['Liquidación de inversiones de largo plazo', 'Dividendos récord y consolidación de mercado', 'Pasivos sociales y ambientales sin resolver', 'Legado financiero con preguntas abiertas'],
    },
    {
      id: 'B', name: 'Hegemonía Tecnológica e Infraestructura', badge: 'Potencia Digital', badgeColor: 'moss',
      preview: 'Convertirte en la columna tecnológica de las megaciudades.',
      narrativeRisk: 'Te acerca a Potencia Tecnológica o Gigante Disruptivo.',
      effects: { capital: 50000, techLevel: 10, innovation: 8, marketShare: 1.5 },
      story: 'Tu empresa se convirtió en la infraestructura invisible de las megaciudades: energía, movilidad y datos pasan por tus sistemas. Tu legado es técnico; su sentido dependerá de cómo se gobierne ese poder.',
      cascade: ['Inversión en infraestructura urbana crítica', 'Liderazgo tecnológico consolidado', 'Dependencia de las ciudades en tus sistemas', 'Legado de poder tecnológico'],
    },
    {
      id: 'C', name: 'Corporación Regenerativa Planetaria', badge: 'Liderazgo Sostenible', badgeColor: 'moss',
      preview: 'Reinvertir utilidades en restauración ecológica y equidad.',
      narrativeRisk: 'Te acerca a Líder Sustentable o Modelo ESG.',
      effects: { capital: -150000, esgIndex: 10, reputation: 12, environmentalFootprint: -12, regulatorRelations: 8 },
      story: 'Destinaste tus utilidades a restaurar ecosistemas y a fondos de equidad para tus trabajadores. Neo-Terra te recordará como la corporación que devolvió más de lo que tomó.',
      cascade: ['Reinversión en restauración ecológica', 'Fondos de equidad para trabajadores', 'Reconocimiento global como empresa regenerativa', 'Legado planetario positivo'],
    },
  ],
  investmentFocusOptions: [
    { id: 'tech', label: 'Fideicomiso de IA Abierta', desc: 'Legado del conocimiento' },
    { id: 'green', label: 'Fondo de Restauración Biológica', desc: 'Legado planetario' },
    { id: 'social', label: 'Cooperativa de Empleados', desc: 'Equidad socioeconómica' },
    { id: 'cyber', label: 'Red Global Inviolable', desc: 'Infraestructura pública' },
  ],
};

const THEMATIC_COUNT = Object.keys(ROUND_SCENARIOS).length;

/**
 * Devuelve el escenario de una ronda. La última ronda siempre es el Veredicto.
 */
function getScenarioForRound(round, maxRounds) {
  const r = Math.max(1, round || 1);
  const year = 2045 + (r - 1) * 2;
  if (maxRounds && r >= maxRounds) {
    return { ...FINAL_SCENARIO, round: r, year, totalRounds: maxRounds };
  }
  const idx = ((r - 1) % THEMATIC_COUNT) + 1;
  return { ...ROUND_SCENARIOS[idx], round: r, year, totalRounds: maxRounds, isFinal: false };
}

// ─────────────────────────────────────────────────────────────────────────────
// EMERGENCIAS RELÁMPAGO (6 crisis, no se repiten hasta agotarse)
// ─────────────────────────────────────────────────────────────────────────────
const EMERGENCY_EVENTS = [
  {
    id: 'crisis_solar_flare',
    title: 'Tormenta Solar y Apagón Satelital',
    context: 'Una eyección de masa coronal extrema desactivó los satélites comerciales en órbita baja. Rutas marítimas autónomas, GPS y transacciones bancarias están paralizadas.',
    dilemma: 'Tus cargueros y fábricas están incomunicados. ¿Qué directiva ejecuta tu gabinete de crisis?',
    options: [
      { id: 'opt_1', title: 'Contratar banda militar de emergencia', desc: 'Pagar $90,000 para mantener activos el 100% de tus envíos.', consequences: { capital: -90000, marketShare: 3, reputation: 5 }, feedback: 'Tu respuesta financiera salvó las entregas y capturaste clientes que tus competidores no pudieron atender.' },
      { id: 'opt_2', title: 'Anclar la flota y esperar', desc: 'Sin gasto: detener operaciones hasta que se restablezca la red pública.', consequences: { marketShare: -3, consumerRelations: -8 }, feedback: 'Ahorraste fondos, pero miles de clientes sufrieron cancelaciones y penalizaciones.' },
      { id: 'opt_3', title: 'Liberar tus algoritmos de navegación', desc: 'Compartir en código abierto tus protocolos de guía para ayudar a toda la industria ($40,000).', consequences: { capital: -40000, reputation: 15, regulatorRelations: 12, esgIndex: 8 }, feedback: 'Un acto de liderazgo elogiado por la ONU: tu empresa fue la heroína del apagón.' },
    ],
  },
  {
    id: 'crisis_data_leak',
    title: 'Filtración Masiva en la Dark Web',
    context: 'Ciberactivistas publicaron terabytes de correos, fórmulas y contratos confidenciales de las corporaciones de Neo-Terra.',
    dilemma: 'Documentos internos de tu empresa están expuestos en foros públicos. ¿Cómo respondes?',
    options: [
      { id: 'opt_1', title: 'Transparencia y admisión pública', desc: 'Reconocer la filtración y abrir auditorías independientes ($50,000).', consequences: { capital: -50000, reputation: 10, regulatorRelations: 10, esgIndex: 6 }, feedback: 'Tu honestidad desarmó el escándalo; reguladores y clientes valoraron tu cooperación.' },
      { id: 'opt_2', title: 'Desmentir y demandar', desc: 'Pagar abogados y relaciones públicas para calificar los datos como falsos ($80,000).', consequences: { capital: -80000, reputation: -15, consumerRelations: -12 }, feedback: 'La evidencia forense demostró la autenticidad de los datos y el escándalo se duplicó.' },
      { id: 'opt_3', title: 'Blindaje técnico en silencio', desc: 'No comentar y reforzar la ciberseguridad interna ($30,000).', consequences: { capital: -30000, cybersecurity: 15, reputation: -5 }, feedback: 'Evitaste alimentar a la prensa, pero el silencio dejó sospechas.' },
    ],
  },
  {
    id: 'crisis_tsunami_supply',
    title: 'Megatsunami en el Estrecho de Malaca',
    context: 'Un megatsunami arrasó los principales puertos del Sudeste Asiático. La mitad de las rutas comerciales globales están bloqueadas.',
    dilemma: 'Tus cargueros con microchips están varados en la zona del desastre. ¿Qué ordenas?',
    options: [
      { id: 'opt_1', title: 'Puente aéreo suborbital', desc: 'Desviar suministros por aire para no retrasar entregas ($120,000).', consequences: { capital: -120000, environmentalFootprint: 10, marketShare: 2 }, feedback: 'Costó una fortuna y elevó tus emisiones, pero cumpliste mientras tus rivales colapsaban.' },
      { id: 'opt_2', title: 'Ayuda humanitaria con tu flota', desc: 'Usar tus barcos para llevar víveres y medicinas a la población ($60,000).', consequences: { capital: -60000, reputation: 20, laborRelations: 15, esgIndex: 12 }, feedback: 'Tu gesto humanitario conmovió al mundo y te otorgó exenciones arancelarias.' },
      { id: 'opt_3', title: 'Declarar fuerza mayor y cobrar seguros', desc: 'Congelar contratos e invocar cláusulas de desastre.', consequences: { capital: 40000, consumerRelations: -15, marketShare: -4 }, feedback: 'Recuperaste liquidez, pero abandonaste a tus clientes en el peor momento.' },
    ],
  },
  {
    id: 'crisis_deepfake_ceo',
    title: 'Deepfake de tu CEO Desata Pánico Bursátil',
    context: 'Un video hiperrealista generado por IA muestra a tu director anunciando un fraude contable. Se volvió viral en minutos y tus acciones caen 30%.',
    dilemma: 'El mercado exige una respuesta inmediata. ¿Qué hace tu gabinete?',
    options: [
      { id: 'opt_1', title: 'Verificación criptográfica pública', desc: 'Publicar pruebas firmadas digitalmente y lanzar un sistema de verificación de comunicados ($50,000).', consequences: { capital: -50000, reputation: 8, cybersecurity: 10 }, feedback: 'Las pruebas criptográficas restauraron la confianza y tu sistema de verificación se volvió estándar.' },
      { id: 'opt_2', title: 'Silencio y demanda penal', desc: 'No comentar públicamente y presentar una denuncia ($20,000).', consequences: { capital: -20000, reputation: -6, consumerRelations: -5 }, feedback: 'La demanda avanza lento; el silencio dejó dudas en inversionistas y clientes.' },
      { id: 'opt_3', title: 'Recomprar acciones baratas aprovechando el pánico', desc: 'Usar la caída para comprar tus propias acciones antes de desmentir.', consequences: { capital: 60000, reputation: -10, regulatorRelations: -10 }, feedback: 'Ganaste dinero, pero los reguladores investigan uso de información privilegiada.' },
    ],
  },
  {
    id: 'crisis_heatwave',
    title: 'Ola de Calor Extremo de 52°C',
    context: 'Una ola de calor sin precedentes golpea tus principales plantas. Varios trabajadores colapsaron y los sindicatos amenazan con huelga.',
    dilemma: 'La producción del trimestre está en riesgo. ¿Qué decides?',
    options: [
      { id: 'opt_1', title: 'Detener la producción con salario íntegro', desc: 'Parar hasta que bajen las temperaturas, pagando sueldos completos ($80,000).', consequences: { capital: -80000, laborRelations: 15, reputation: 10, marketShare: -1 }, feedback: 'Protegiste la vida de tus trabajadores; tu lealtad laboral alcanzó máximos históricos.' },
      { id: 'opt_2', title: 'Turnos nocturnos y climatización', desc: 'Reorganizar turnos e instalar climatización de emergencia ($50,000).', consequences: { capital: -50000, laborRelations: 6, environmentalFootprint: 4 }, feedback: 'Mantuviste la producción con medidas razonables, aunque el consumo energético aumentó.' },
      { id: 'opt_3', title: 'Mantener la producción a toda costa', desc: 'Exigir cumplir metas pese al calor.', consequences: { capital: 50000, laborRelations: -20, reputation: -12, regulatorRelations: -8 }, feedback: 'Cumpliste la meta, pero las hospitalizaciones provocaron una investigación laboral.' },
    ],
  },
  {
    id: 'crisis_pandemic',
    title: 'Brote del Patógeno Respiratorio H-45',
    context: 'Un nuevo virus respiratorio obliga a cuarentenas en 40 países. Faltan sensores de diagnóstico y equipo médico.',
    dilemma: 'Tu empresa tiene tecnología que podría ayudar. ¿Cómo actúas?',
    options: [
      { id: 'opt_1', title: 'Liberar patentes de sensores diagnósticos', desc: 'Permitir que cualquier fabricante produzca tus sensores sin regalías ($40,000).', consequences: { capital: -40000, reputation: 15, esgIndex: 8, regulatorRelations: 10 }, feedback: 'Tus sensores salvaron miles de vidas; gobiernos y ciudadanos te reconocen como aliado.' },
      { id: 'opt_2', title: 'Producir insumos médicos con sobreprecio', desc: 'Reconvertir líneas y vender al precio que el mercado pague.', consequences: { capital: 90000, reputation: -12, consumerRelations: -10 }, feedback: 'Obtuviste ganancias extraordinarias, pero la prensa te acusa de lucrar con la emergencia.' },
      { id: 'opt_3', title: 'Teletrabajo y protocolos sanitarios', desc: 'Proteger a tu personal y mantener operaciones remotas ($30,000).', consequences: { capital: -30000, laborRelations: 8, cybersecurity: -4 }, feedback: 'Cuidaste a tu equipo; el trabajo remoto amplió tu superficie de ataque digital.' },
    ],
  },
];

module.exports = {
  GAME_CONSTANTS,
  INVESTMENT_BUDGET_PER_ROUND,
  COMPANY_INITIAL_STATE,
  GLOBAL_WORLD_STATE,
  SUPPLIERS,
  ARCHETYPE_PROFILES,
  ARCHETYPE_THRESHOLDS,
  ROUND_SCENARIOS,
  FINAL_SCENARIO,
  getScenarioForRound,
  EMERGENCY_EVENTS,
};
