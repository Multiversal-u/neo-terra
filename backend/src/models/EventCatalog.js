'use strict';

/**
 * EVENT CATALOG — NEO-TERRA Global Simulator 2045
 * 100+ eventos cubriendo 8 categorías temáticas.
 *
 * Estructura de cada evento:
 * {
 *   id: string,
 *   name: string,
 *   description: string,
 *   category: 'Social'|'Tecnológica'|'Ambiental'|'Económica'|'Política'|'Geopolítica'|'Comercial'|'Ciberseguridad',
 *   baseProbability: number (0-1),
 *   activationConditions: [{ variable, operator, value, probabilityBoost }],
 *   consequences: {
 *     global: { worldVar: delta },
 *     company: { appliesTo: string, companyVar: delta },
 *     cascade: [string]
 *   },
 *   newsHeadline: string,
 *   newsBody: string,
 *   severity: 'low'|'medium'|'high'|'critical'
 * }
 */

const EVENT_CATALOG = [

  // ══════════════════════════════════════════════════════════════════════════
  // 🔴 CATEGORÍA: SOCIAL (15 eventos)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'soc_001',
    name: 'Escándalo Laboral Internacional',
    description: 'Periodistas revelan condiciones infrahumanas en centros de producción.',
    category: 'Social',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'pctCheapSupplier', operator: '>', value: 0.5, probabilityBoost: 0.45 },
      { variable: 'avgHiddenLaborRisk', operator: '>', value: 30, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { consumerConfidence: -8, internationalRegulation: +10, socialInequality: +5 },
      company: {
        appliesTo: 'cheapSupplierUsers',
        reputation: -15, esgIndex: -12, regulatorRelations: -10, consumerRelations: -8,
      },
      cascade: ['boycottRisk', 'regulationIncrease'],
    },
    newsHeadline: 'ESCÁNDALO INTERNACIONAL',
    newsBody: 'Investigación revela explotación infantil en centros de producción del Sur Global. El {{pctCheap}}% de corporaciones de Neo-Terra están bajo investigación. Las empresas involucradas enfrentan sanciones internacionales inmediatas.',
    severity: 'high',
  },

  {
    id: 'soc_002',
    name: 'Ola de Huelgas Globales',
    description: 'Trabajadores de múltiples sectores paran actividades en protesta.',
    category: 'Social',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'avgLaborRelations', operator: '<', value: 35, probabilityBoost: 0.45 },
      { variable: 'socialInequality', operator: '>', value: 65, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: -8, consumerConfidence: -5 },
      company: { appliesTo: 'all', capital: -50000, laborRelations: -8 },
      cascade: ['productionDelay'],
    },
    newsHeadline: 'HUELGA GLOBAL 2045',
    newsBody: 'Trabajadores de 47 países paran actividades. La desigualdad global ha alcanzado niveles históricos. Corporaciones que ignoran las condiciones laborales pierden producción por segunda semana consecutiva.',
    severity: 'high',
  },

  {
    id: 'soc_003',
    name: 'Boicot Internacional de Consumidores',
    description: 'Movimiento global organiza boicot masivo contra corporaciones irresponsables.',
    category: 'Social',
    baseProbability: 0.07,
    activationConditions: [
      { variable: 'avgReputation', operator: '<', value: 35, probabilityBoost: 0.40 },
      { variable: 'consumerConfidence', operator: '<', value: 40, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { consumerConfidence: -10, sustainabilityIndex: +3 },
      company: { appliesTo: 'lowRep', marketShare: -3, consumerRelations: -15, capital: -80000 },
      cascade: ['marketShareLoss'],
    },
    newsHeadline: 'BOICOT GLOBAL #NoCompresNeoTerra',
    newsBody: 'El hashtag #NoCompresNeoTerra se convierte en tendencia mundial. Consumidores organizados rechazan productos de corporaciones con bajas calificaciones ESG. Las empresas con reputación por debajo de 30 pierden cuota de mercado.',
    severity: 'high',
  },

  {
    id: 'soc_004',
    name: 'Premio Internacional de Impacto Social',
    description: 'Naciones Unidas premia a las corporaciones con mejores prácticas laborales.',
    category: 'Social',
    baseProbability: 0.12,
    activationConditions: [
      { variable: 'avgESG', operator: '>', value: 60, probabilityBoost: 0.35 },
      { variable: 'avgLaborRelations', operator: '>', value: 65, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { consumerConfidence: +6, sustainabilityIndex: +5 },
      company: { appliesTo: 'highESG', reputation: +15, internationalAccess: +8, capital: 100000 },
      cascade: [],
    },
    newsHeadline: 'PREMIOS ONU DE IMPACTO SOCIAL 2045',
    newsBody: 'La ONU reconoce a las corporaciones líderes en bienestar laboral. Las empresas con índice ESG superior a 65 reciben acceso preferencial a mercados globales y capital de impacto. Neo-Terra celebra un nuevo paradigma empresarial.',
    severity: 'low',
  },

  {
    id: 'soc_005',
    name: 'Crisis de Desempleo Tecnológico',
    description: 'La automatización masiva genera desempleo estructural en economías emergentes.',
    category: 'Social',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '>', value: 60, probabilityBoost: 0.35 },
      { variable: 'socialInequality', operator: '>', value: 55, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { socialInequality: +10, consumerConfidence: -7, internationalRegulation: +6 },
      company: { appliesTo: 'topTech', regulatorRelations: -8, reputation: -5 },
      cascade: ['taxOnAutomation'],
    },
    newsHeadline: 'LA CRISIS DEL ROBOT 2045',
    newsBody: 'Economistas estiman que 800 millones de empleos han sido automatizados en Neo-Terra. Los gobiernos debaten un "impuesto robótico". Las corporaciones tecnológicas enfrentan presión sin precedentes para compensar el impacto social.',
    severity: 'high',
  },

  {
    id: 'soc_006',
    name: 'Movimiento por Salarios Dignos 2045',
    description: 'Coalición global exige salario mínimo global corporativo.',
    category: 'Social',
    baseProbability: 0.09,
    activationConditions: [
      { variable: 'avgHiddenLaborRisk', operator: '>', value: 45, probabilityBoost: 0.40 },
      { variable: 'socialInequality', operator: '>', value: 60, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { internationalRegulation: +8, socialInequality: -5, consumerConfidence: +3 },
      company: { appliesTo: 'cheapSupplierUsers', capital: -60000, laborRelations: -5 },
      cascade: [],
    },
    newsHeadline: 'SALARIO MÍNIMO GLOBAL CORPORATIVO',
    newsBody: 'La Coalición de Trabajadores Digitales aprueba en resolución que todas las corporaciones de Neo-Terra deben garantizar salario digno en toda su cadena de suministro. Empresas con proveedor A enfrentan costos adicionales obligatorios.',
    severity: 'medium',
  },

  {
    id: 'soc_007',
    name: 'Alianza de Trabajadores Digitales',
    description: 'Sindicato global digital logra acuerdo vinculante.',
    category: 'Social',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'pctCheapSupplier', operator: '>', value: 0.6, probabilityBoost: 0.35 },
    ],
    consequences: {
      global: { socialInequality: -8, internationalRegulation: +5 },
      company: { appliesTo: 'all', laborRelations: +5, capital: -30000 },
      cascade: [],
    },
    newsHeadline: 'SINDICATO DIGITAL GLOBAL ACUERDO HISTÓRICO',
    newsBody: 'La Alianza de Trabajadores Digitales logra un acuerdo sin precedentes. Todas las corporaciones de Neo-Terra deberán contribuir al Fondo de Transición Laboral. Los beneficios: estabilidad social a largo plazo y reducción de conflictos.',
    severity: 'medium',
  },

  {
    id: 'soc_008',
    name: 'Pandemia de Salud Mental Corporativa',
    description: 'Estudio revela epidemia de burnout en corporaciones con malas condiciones.',
    category: 'Social',
    baseProbability: 0.09,
    activationConditions: [
      { variable: 'avgLaborRelations', operator: '<', value: 30, probabilityBoost: 0.40 },
    ],
    consequences: {
      global: { economicStability: -4, socialInequality: +5 },
      company: { appliesTo: 'all', laborRelations: -5, capital: -40000 },
      cascade: [],
    },
    newsHeadline: 'CRISIS DE SALUD MENTAL EN CORPORACIONES',
    newsBody: 'El Instituto de Bienestar Global reporta niveles record de burnout. Empresas con relaciones laborales deterioradas pierden productividad en un 25%. Los costos de rotación de personal aumentan drásticamente.',
    severity: 'medium',
  },

  {
    id: 'soc_009',
    name: 'Revolución de Transparencia Corporativa',
    description: 'Nueva ley exige divulgación total de cadenas de suministro.',
    category: 'Social',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'internationalRegulation', operator: '>', value: 55, probabilityBoost: 0.35 },
      { variable: 'pctCheapSupplier', operator: '>', value: 0.5, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { consumerConfidence: +5, internationalRegulation: +5 },
      company: { appliesTo: 'cheapSupplierUsers', reputation: -10, regulatorRelations: -8 },
      cascade: ['supplierReveal'],
    },
    newsHeadline: 'LEY DE TRANSPARENCIA CORPORATIVA 2045',
    newsBody: 'El Parlamento de Neo-Terra aprueba la Ley de Transparencia Total. Todas las corporaciones deben publicar datos completos de sus cadenas de suministro. Los proveedores ocultos ya no pueden serlo más.',
    severity: 'high',
  },

  {
    id: 'soc_010',
    name: 'Festival Global de Sostenibilidad',
    description: 'Evento masivo celebra líderes en sostenibilidad empresarial.',
    category: 'Social',
    baseProbability: 0.12,
    activationConditions: [
      { variable: 'sustainabilityIndex', operator: '>', value: 55, probabilityBoost: 0.30 },
      { variable: 'avgESG', operator: '>', value: 55, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { consumerConfidence: +8, sustainabilityIndex: +4 },
      company: { appliesTo: 'highESG', reputation: +10, marketShare: +1, consumerRelations: +8 },
      cascade: [],
    },
    newsHeadline: 'NEO-TERRA SUSTAINABILITY SUMMIT 2045',
    newsBody: 'Más de 2 mil millones de personas siguen el Festival Global de Sostenibilidad. Las corporaciones con índice ESG superior a 65 son destacadas como modelos globales. La ola de consumo consciente beneficia directamente a los líderes sostenibles.',
    severity: 'low',
  },

  {
    id: 'soc_011',
    name: 'Crisis Migratoria por Cambio Climático',
    description: 'Millones de refugiados climáticos desestabilizan economías.',
    category: 'Social',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'globalTemperature', operator: '>', value: 2.3, probabilityBoost: 0.45 },
    ],
    consequences: {
      global: { economicStability: -10, socialInequality: +8, internationalRegulation: +6 },
      company: { appliesTo: 'all', capital: -40000, internationalAccess: -3 },
      cascade: [],
    },
    newsHeadline: 'CRISIS MIGRATORIA CLIMÁTICA SIN PRECEDENTES',
    newsBody: 'Con temperaturas en {{temperature}}°C sobre niveles pre-industriales, 300 millones de personas abandonan zonas costeras. La crisis migratoria colapsa fronteras y mercados. Neo-Terra enfrenta su mayor desafío humanitario.',
    severity: 'critical',
  },

  {
    id: 'soc_012',
    name: 'Informe de Desigualdad Corporativa',
    description: 'Reporte revela brecha creciente entre corporaciones ricas y pobres.',
    category: 'Social',
    baseProbability: 0.11,
    activationConditions: [
      { variable: 'socialInequality', operator: '>', value: 70, probabilityBoost: 0.35 },
    ],
    consequences: {
      global: { internationalRegulation: +8, consumerConfidence: -5 },
      company: { appliesTo: 'all', regulatorRelations: -3 },
      cascade: ['progressiveTax'],
    },
    newsHeadline: 'INFORME OXFAM 2045: DESIGUALDAD EXTREMA',
    newsBody: 'El Informe Oxfam revela que las 10 corporaciones más ricas de Neo-Terra poseen más capital que el 90% restante combinado. Los gobiernos estudian medidas de redistribución corporativa.',
    severity: 'medium',
  },

  {
    id: 'soc_013',
    name: 'Reconocimiento como Mejor Empleador Global',
    description: 'Rankings internacionales destacan empresas con excelentes condiciones laborales.',
    category: 'Social',
    baseProbability: 0.13,
    activationConditions: [
      { variable: 'avgLaborRelations', operator: '>', value: 70, probabilityBoost: 0.30 },
    ],
    consequences: {
      global: { consumerConfidence: +5 },
      company: { appliesTo: 'highESG', reputation: +12, consumerRelations: +8, capital: 80000 },
      cascade: [],
    },
    newsHeadline: 'RANKING: MEJORES EMPLEADORES GLOBALES 2045',
    newsBody: 'Great Place to Work Global destaca a las corporaciones de Neo-Terra con mejores prácticas laborales. La reputación como empleador responsable genera oleadas de consumidores leales y talento de élite.',
    severity: 'low',
  },

  {
    id: 'soc_014',
    name: 'Protesta Masiva Contra IA Sin Regulación',
    description: 'Ciudadanos protestan contra automatización sin compensación social.',
    category: 'Social',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '>', value: 65, probabilityBoost: 0.35 },
      { variable: 'socialInequality', operator: '>', value: 60, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { internationalRegulation: +10, socialInequality: +3 },
      company: { appliesTo: 'topTech', reputation: -8, regulatorRelations: -10 },
      cascade: [],
    },
    newsHeadline: 'PROTESTAS GLOBALES CONTRA LA IA CORPORATIVA',
    newsBody: 'Millones marchan en 80 países contra la automatización sin compensación. Las corporaciones tecnológicas líderes son señaladas como responsables de la crisis laboral. Se esperan nuevas regulaciones de IA para el próximo período.',
    severity: 'high',
  },

  {
    id: 'soc_015',
    name: 'Generación Z Toma el Poder del Consumo',
    description: 'Los consumidores más jóvenes dominan el mercado con valores radicalmente diferentes.',
    category: 'Social',
    baseProbability: 0.13,
    activationConditions: [
      { variable: 'avgESG', operator: '>', value: 50, probabilityBoost: 0.25 },
    ],
    consequences: {
      global: { consumerConfidence: +8, sustainabilityIndex: +5 },
      company: { appliesTo: 'highESG', marketShare: +2, consumerRelations: +10 },
      cascade: [],
    },
    newsHeadline: 'GEN Z REDEFINE EL MERCADO GLOBAL',
    newsBody: 'El 60% del poder adquisitivo global ahora está en manos de consumidores menores de 30 años. Su principal criterio de compra: el índice ESG corporativo. Las empresas responsables ganan participación de mercado sin gastar en marketing.',
    severity: 'low',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 🌡️ CATEGORÍA: AMBIENTAL (15 eventos)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'amb_001',
    name: 'Crisis Climática de Emergencia Global',
    description: 'La temperatura alcanza niveles de emergencia irreversibles.',
    category: 'Ambiental',
    baseProbability: 0.05,
    activationConditions: [
      { variable: 'globalTemperature', operator: '>', value: 2.5, probabilityBoost: 0.60 },
    ],
    consequences: {
      global: { economicStability: -15, consumerConfidence: -12, internationalRegulation: +15, sustainabilityIndex: -10 },
      company: { appliesTo: 'all', capital: -100000, internationalAccess: -5 },
      cascade: ['climateEmergency', 'regulationSurge'],
    },
    newsHeadline: '🚨 EMERGENCIA CLIMÁTICA GLOBAL',
    newsBody: 'ALERTA MÁXIMA: La temperatura global alcanzó {{temperature}}°C sobre niveles pre-industriales. La ONU declara emergencia climática permanente. Sanciones económicas masivas activadas contra las corporaciones más contaminantes de Neo-Terra.',
    severity: 'critical',
  },

  {
    id: 'amb_002',
    name: 'Regulación de Carbono de Emergencia',
    description: 'Nuevos impuestos de carbono de emergencia son implementados.',
    category: 'Ambiental',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'avgEmissions', operator: '>', value: 68, probabilityBoost: 0.40 },
      { variable: 'globalTemperature', operator: '>', value: 2.0, probabilityBoost: 0.25 },
    ],
    consequences: {
      global: { internationalRegulation: +12, globalTemperature: -0.05 },
      company: { appliesTo: 'cheapSupplierUsers', capital: -150000, regulatorRelations: -10 },
      cascade: ['exportDeclines'],
    },
    newsHeadline: 'IMPUESTO DE CARBONO GLOBAL ACTIVADO',
    newsBody: 'El Consejo Climático de Neo-Terra activa el Protocolo de Carbono de Emergencia. Las corporaciones con huella ambiental superior a 65 pagarán una tasa de carbono equivalente a $150,000 por período. Las emisiones globales deben reducirse un 40% en 5 años.',
    severity: 'high',
  },

  {
    id: 'amb_003',
    name: 'Innovación en Energía Verde',
    description: 'Nuevas tecnologías de energía renovable reducen costos drásticamente.',
    category: 'Ambiental',
    baseProbability: 0.12,
    activationConditions: [
      { variable: 'avgRD', operator: '>', value: 80000, probabilityBoost: 0.35 },
      { variable: 'globalInnovation', operator: '>', value: 50, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { globalTemperature: -0.08, sustainabilityIndex: +8, globalInnovation: +5 },
      company: { appliesTo: 'topTech', esgIndex: +10, environmentalFootprint: -8, capital: 120000 },
      cascade: [],
    },
    newsHeadline: 'REVOLUCIÓN ENERGÉTICA: COSTO CERO RENOVABLE',
    newsBody: 'NeoFusion Laboratories anuncia que la energía solar de próxima generación reduce los costos de producción en 70%. Las corporaciones tecnológicas que adoptan el nuevo estándar reducen su huella ambiental masivamente. Un punto de inflexión histórico.',
    severity: 'low',
  },

  {
    id: 'amb_004',
    name: 'Escasez de Agua Global',
    description: 'El cambio climático provoca escasez hídrica en zonas clave de producción.',
    category: 'Ambiental',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'globalTemperature', operator: '>', value: 2.0, probabilityBoost: 0.40 },
      { variable: 'avgEmissions', operator: '>', value: 60, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: -8, sustainabilityIndex: -6 },
      company: { appliesTo: 'cheapSupplierUsers', logisticCapacity: -10, capital: -60000 },
      cascade: ['supplyChainDisruption'],
    },
    newsHeadline: 'CRISIS HÍDRICA GLOBAL: PRODUCCIÓN EN RIESGO',
    newsBody: 'La escasez de agua afecta el 40% de los centros de producción en Neo-Terra. Los proveedores de bajo costo en regiones áridas reportan interrupciones críticas. Los costos logísticos aumentan sin precedentes.',
    severity: 'high',
  },

  {
    id: 'amb_005',
    name: 'Subsidios Verdes Internacionales',
    description: 'Fondo internacional subsidia a empresas con bajas emisiones.',
    category: 'Ambiental',
    baseProbability: 0.11,
    activationConditions: [
      { variable: 'pctPremiumSupplier', operator: '>', value: 0.4, probabilityBoost: 0.30 },
      { variable: 'sustainabilityIndex', operator: '>', value: 45, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { sustainabilityIndex: +6, globalTemperature: -0.03 },
      company: { appliesTo: 'premiumSupplierUsers', capital: 180000, esgIndex: +5 },
      cascade: [],
    },
    newsHeadline: 'FONDO VERDE GLOBAL: $180,000 POR EMPRESA',
    newsBody: 'El Fondo Verde de Neo-Terra distribuye subsidios a corporaciones con cadena de suministro sostenible. Las empresas que eligieron el Proveedor C reciben capital de impacto. La economía circular se vuelve rentable.',
    severity: 'low',
  },

  {
    id: 'amb_006',
    name: 'Colapso de Ecosistema Regional',
    description: 'Un ecosistema clave colapsa por contaminación corporativa excesiva.',
    category: 'Ambiental',
    baseProbability: 0.06,
    activationConditions: [
      { variable: 'globalTemperature', operator: '>', value: 2.8, probabilityBoost: 0.55 },
      { variable: 'avgEmissions', operator: '>', value: 75, probabilityBoost: 0.25 },
    ],
    consequences: {
      global: { sustainabilityIndex: -15, consumerConfidence: -10, internationalRegulation: +15 },
      company: { appliesTo: 'cheapSupplierUsers', reputation: -20, capital: -200000, internationalAccess: -10 },
      cascade: ['permanentDamage'],
    },
    newsHeadline: '💀 COLAPSO ECOSISTEMA: PUNTO DE NO RETORNO',
    newsBody: 'Científicos confirman el colapso irreversible del ecosistema marino del Océano Central de Neo-Terra. El nivel de contaminación acumulado ha superado el umbral de recuperación. Las corporaciones más contaminantes enfrentan cargos ante el Tribunal Internacional Ambiental.',
    severity: 'critical',
  },

  {
    id: 'amb_007',
    name: 'Premio Cero Emisiones Neo-Terra',
    description: 'Las corporaciones más limpias son reconocidas globalmente.',
    category: 'Ambiental',
    baseProbability: 0.12,
    activationConditions: [
      { variable: 'pctPremiumSupplier', operator: '>', value: 0.35, probabilityBoost: 0.30 },
      { variable: 'sustainabilityIndex', operator: '>', value: 50, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { sustainabilityIndex: +5, consumerConfidence: +6 },
      company: { appliesTo: 'premiumSupplierUsers', reputation: +15, internationalAccess: +8, marketShare: +1 },
      cascade: [],
    },
    newsHeadline: 'PREMIO CERO EMISIONES 2045',
    newsBody: 'Las corporaciones con cadena de suministro neutral en carbono reciben el máximo reconocimiento internacional. El sello "Cero Emisiones 2045" abre puertas a mercados premium globales. Una nueva era de competencia sostenible comienza.',
    severity: 'low',
  },

  {
    id: 'amb_008',
    name: 'Inundación de Centros Logísticos',
    description: 'Eventos climáticos extremos destruyen infraestructura logística.',
    category: 'Ambiental',
    baseProbability: 0.09,
    activationConditions: [
      { variable: 'globalTemperature', operator: '>', value: 2.2, probabilityBoost: 0.40 },
      { variable: 'pctCheapSupplier', operator: '>', value: 0.5, probabilityBoost: 0.15 },
    ],
    consequences: {
      global: { economicStability: -6, sustainabilityIndex: -4 },
      company: { appliesTo: 'cheapSupplierUsers', logisticCapacity: -12, capital: -80000 },
      cascade: ['supplyChainDisruption'],
    },
    newsHeadline: 'INUNDACIONES DESTRUYEN CADENAS DE SUMINISTRO',
    newsBody: 'Lluvias récord en regiones de producción del Sur Global destruyen centros logísticos. Los proveedores de bajo costo concentrados en zonas de riesgo climático reportan pérdidas totales. Las empresas dependientes del Proveedor A pierden capacidad operativa.',
    severity: 'high',
  },

  {
    id: 'amb_009',
    name: 'Cumbre de Neo-Terra sobre Clima',
    description: 'Acuerdo histórico global sobre emisiones corporativas.',
    category: 'Ambiental',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'globalTemperature', operator: '>', value: 1.8, probabilityBoost: 0.30 },
      { variable: 'sustainabilityIndex', operator: '<', value: 50, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { internationalRegulation: +12, sustainabilityIndex: +5 },
      company: { appliesTo: 'all', regulatorRelations: -3 },
      cascade: [],
    },
    newsHeadline: 'CUMBRE CLIMÁTICA: NUEVAS REGLAS GLOBALES',
    newsBody: 'La Cumbre de Neo-Terra sobre Cambio Climático establece metas vinculantes de reducción de emisiones. Todas las corporaciones deberán reducir su huella ambiental un 30% en el próximo período. Los infractores enfrentarán sanciones automáticas.',
    severity: 'medium',
  },

  {
    id: 'amb_010',
    name: 'Escasez de Materias Primas Críticas',
    description: 'El extractivismo excesivo agota materiales esenciales para la producción tech.',
    category: 'Ambiental',
    baseProbability: 0.09,
    activationConditions: [
      { variable: 'avgEmissions', operator: '>', value: 65, probabilityBoost: 0.30 },
      { variable: 'globalTemperature', operator: '>', value: 2.1, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: -8, globalInnovation: -5 },
      company: { appliesTo: 'all', capital: -70000, techLevel: -3 },
      cascade: [],
    },
    newsHeadline: 'ESCASEZ CRÍTICA DE MATERIAS PRIMAS TECH',
    newsBody: 'La sobreextracción y el cambio climático combinados han agotado reservas clave de litio, cobalto y tierras raras en Neo-Terra. Los costos de producción tecnológica aumentan 35%. La transición a materiales reciclados se vuelve urgente.',
    severity: 'high',
  },

  {
    id: 'amb_011',
    name: 'Mercado de Carbono Financiero Neo-Terra',
    description: 'Se lanza bolsa de créditos de carbono para corporaciones.',
    category: 'Ambiental',
    baseProbability: 0.11,
    activationConditions: [
      { variable: 'internationalRegulation', operator: '>', value: 50, probabilityBoost: 0.30 },
      { variable: 'sustainabilityIndex', operator: '>', value: 45, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { sustainabilityIndex: +6, economicStability: +3 },
      company: { appliesTo: 'premiumSupplierUsers', capital: 150000, esgIndex: +5 },
      cascade: [],
    },
    newsHeadline: 'BOLSA DE CARBONO NEO-TERRA ABRE',
    newsBody: 'Neo-Terra lanza la primera bolsa de créditos de carbono totalmente automatizada. Las corporaciones con emisiones negativas pueden vender créditos en el mercado global. Las empresas sostenibles generan un nuevo flujo de ingresos sin producir nada adicional.',
    severity: 'low',
  },

  {
    id: 'amb_012',
    name: 'Deshielo Ártico: Nuevas Rutas Comerciales',
    description: 'El deshielo abre rutas marítimas pero indica desastre climático.',
    category: 'Ambiental',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'globalTemperature', operator: '>', value: 2.0, probabilityBoost: 0.40 },
    ],
    consequences: {
      global: { sustainabilityIndex: -8, economicStability: +3 },
      company: { appliesTo: 'globalLeaders', logisticCapacity: +8, capital: 60000 },
      cascade: [],
    },
    newsHeadline: 'ÁRTICO ABIERTO: NUEVA RUTA COMERCIAL Y CRISIS',
    newsBody: 'El deshielo ártico completo abre rutas marítimas que reducen tiempos de envío en 30%. Sin embargo, los científicos advierten que este es un indicador de catástrofe climática inminente. Las corporaciones con acceso internacional aprovechan las nuevas rutas.',
    severity: 'medium',
  },

  {
    id: 'amb_013',
    name: 'Sequía en Zonas de Producción Agrícola',
    description: 'Sequías extremas afectan la producción de materias primas.',
    category: 'Ambiental',
    baseProbability: 0.09,
    activationConditions: [
      { variable: 'globalTemperature', operator: '>', value: 2.1, probabilityBoost: 0.35 },
      { variable: 'avgEmissions', operator: '>', value: 60, probabilityBoost: 0.15 },
    ],
    consequences: {
      global: { economicStability: -7, consumerConfidence: -5 },
      company: { appliesTo: 'cheapSupplierUsers', capital: -80000, logisticCapacity: -8 },
      cascade: [],
    },
    newsHeadline: 'GRAN SEQUÍA 2045: PRODUCCIÓN COLAPSA',
    newsBody: 'La peor sequía en 500 años afecta las principales regiones agrícolas de Neo-Terra. Los costos de materias primas se disparan. Los proveedores del Sur Global con dependencia agrícola reportan cese de operaciones parcial.',
    severity: 'high',
  },

  {
    id: 'amb_014',
    name: 'Certificación Empresa Carbono Negativo',
    description: 'Empresas logran la certificación más exclusiva en sostenibilidad.',
    category: 'Ambiental',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'pctPremiumSupplier', operator: '>', value: 0.5, probabilityBoost: 0.30 },
      { variable: 'avgESG', operator: '>', value: 65, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { sustainabilityIndex: +8 },
      company: { appliesTo: 'highESG', internationalAccess: +12, reputation: +10, capital: 200000 },
      cascade: [],
    },
    newsHeadline: 'CERTIFICACIÓN CARBONO NEGATIVO: ÉLITE GLOBAL',
    newsBody: 'El grupo selecto de corporaciones de Neo-Terra con certificación "Carbono Negativo" obtiene acceso exclusivo a los mercados premium de Europa Norte y el bloque ASEAN+. Un nuevo nivel de competitividad basado en sostenibilidad real.',
    severity: 'low',
  },

  {
    id: 'amb_015',
    name: 'Revolución de Economía Circular',
    description: 'Un estándar global de economía circular transforma la producción.',
    category: 'Ambiental',
    baseProbability: 0.11,
    activationConditions: [
      { variable: 'avgRD', operator: '>', value: 100000, probabilityBoost: 0.30 },
      { variable: 'sustainabilityIndex', operator: '>', value: 50, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { sustainabilityIndex: +10, globalInnovation: +6, globalTemperature: -0.05 },
      company: { appliesTo: 'topTech', esgIndex: +8, innovation: +5, capital: 100000 },
      cascade: [],
    },
    newsHeadline: 'ECONOMÍA CIRCULAR GLOBAL: NUEVO PARADIGMA',
    newsBody: 'El Consejo de Innovación de Neo-Terra adopta el Estándar Universal de Economía Circular. Las corporaciones tecnológicas líderes que implementan producción zero-waste reciben ventajas competitivas estructurales. La sostenibilidad se convierte en modelo de negocio.',
    severity: 'low',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 💻 CATEGORÍA: TECNOLÓGICA (15 eventos)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'tec_001',
    name: 'Revolución de IA de Próxima Generación',
    description: 'Un breakthrough en IA redefine la productividad corporativa.',
    category: 'Tecnológica',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'globalInnovation', operator: '>', value: 60, probabilityBoost: 0.40 },
      { variable: 'avgRD', operator: '>', value: 120000, probabilityBoost: 0.25 },
    ],
    consequences: {
      global: { globalInnovation: +10, economicStability: +5, socialInequality: +5 },
      company: { appliesTo: 'topTech', innovation: +15, capital: 250000, marketShare: +3 },
      cascade: [],
    },
    newsHeadline: 'IA GENERAL 2045: REVOLUCIÓN PRODUCTIVA',
    newsBody: 'NeoMind Corp anuncia el primer sistema de IA de propósito general capaz de gestionar operaciones corporativas completas. Las empresas con alto nivel tecnológico multiplican su productividad. La brecha con las empresas rezagadas se amplía exponencialmente.',
    severity: 'medium',
  },

  {
    id: 'tec_002',
    name: 'Obsolescencia Tecnológica Masiva',
    description: 'Empresas que no invirtieron en tech quedan fuera del mercado.',
    category: 'Tecnológica',
    baseProbability: 0.09,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '<', value: 35, probabilityBoost: 0.40 },
      { variable: 'globalInnovation', operator: '>', value: 55, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: -5 },
      company: { appliesTo: 'lowTech', marketShare: -3, capital: -100000, reputation: -8 },
      cascade: [],
    },
    newsHeadline: 'OBSOLESCENCIA: EMPRESAS SIN TECH DESAPARECEN',
    newsBody: 'El mercado global de 2045 expulsa a las corporaciones que no adoptaron tecnologías de vanguardia. Los consumidores digitales rechazan productos y servicios de empresas con nivel tecnológico inferior. La brecha digital empresarial alcanza su punto de quiebre.',
    severity: 'high',
  },

  {
    id: 'tec_003',
    name: 'Quantum Computing Breakthrough',
    description: 'La computación cuántica se vuelve accesible para corporaciones líderes.',
    category: 'Tecnológica',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'avgRD', operator: '>', value: 150000, probabilityBoost: 0.40 },
      { variable: 'globalInnovation', operator: '>', value: 65, probabilityBoost: 0.25 },
    ],
    consequences: {
      global: { globalInnovation: +8, economicStability: +4 },
      company: { appliesTo: 'topTech', techLevel: +15, innovation: +10, cybersecurity: +10 },
      cascade: [],
    },
    newsHeadline: 'COMPUTACIÓN CUÁNTICA: ACCESO CORPORATIVO',
    newsBody: 'QuantumNeo Labs hace accesibles los primeros procesadores cuánticos corporativos. Las empresas con mayor inversión en I+D obtienen ventajas computacionales sin precedentes en optimización de cadena de suministro, modelado de mercados y seguridad.',
    severity: 'medium',
  },

  {
    id: 'tec_004',
    name: 'Estándar Global de Interoperabilidad',
    description: 'Un nuevo protocolo global conecta todos los sistemas empresariales.',
    category: 'Tecnológica',
    baseProbability: 0.11,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '>', value: 55, probabilityBoost: 0.30 },
      { variable: 'globalInnovation', operator: '>', value: 50, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { globalInnovation: +6, economicStability: +4 },
      company: { appliesTo: 'topTech', internationalAccess: +10, logisticCapacity: +8 },
      cascade: [],
    },
    newsHeadline: 'PROTOCOLO UNIFICADO GLOBAL: NEO-API 2045',
    newsBody: 'El consorcio Neo-API lanza el estándar universal de conectividad empresarial. Las corporaciones tecnológicamente avanzadas pueden ahora integrarse instantáneamente con cualquier mercado global. Los silos empresariales son historia.',
    severity: 'low',
  },

  {
    id: 'tec_005',
    name: 'Metaverso Corporativo de Nueva Generación',
    description: 'El metaverso empresarial crea nuevos mercados digitales.',
    category: 'Tecnológica',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '>', value: 50, probabilityBoost: 0.30 },
      { variable: 'globalInnovation', operator: '>', value: 45, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { globalInnovation: +5, consumerConfidence: +4 },
      company: { appliesTo: 'topTech', marketShare: +2, consumerRelations: +8, capital: 80000 },
      cascade: [],
    },
    newsHeadline: 'METAVERSO CORPORATIVO: NUEVO MERCADO BILLONARIO',
    newsBody: 'Las corporaciones más innovadoras de Neo-Terra inauguran el Metaverso Empresarial 3.0. Los primeros en adoptar la plataforma capturan cuota de mercado en el espacio digital. Un mercado de $2 billones se abre para las empresas tecnológicamente preparadas.',
    severity: 'low',
  },

  {
    id: 'tec_006',
    name: 'Automatización Total de Logística',
    description: 'Drones y robots autónomos revolucionan la cadena de suministro.',
    category: 'Tecnológica',
    baseProbability: 0.11,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '>', value: 60, probabilityBoost: 0.30 },
      { variable: 'avgRD', operator: '>', value: 100000, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { globalInnovation: +5, socialInequality: +4 },
      company: { appliesTo: 'topTech', logisticCapacity: +15, capital: 120000 },
      cascade: [],
    },
    newsHeadline: 'LOGÍSTICA AUTÓNOMA: COSTO CERO DE ENVÍO',
    newsBody: 'RoboLogistics Neo-Terra despliega la primera red de entrega 100% autónoma. Las corporaciones con mayor nivel tecnológico reducen costos logísticos en 80%. La velocidad de entrega se convierte en ventaja competitiva definitiva.',
    severity: 'low',
  },

  {
    id: 'tec_007',
    name: 'Estándar ISO de IA Responsable',
    description: 'Nueva regulación global sobre el uso ético de inteligencia artificial.',
    category: 'Tecnológica',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'internationalRegulation', operator: '>', value: 55, probabilityBoost: 0.35 },
      { variable: 'avgTechLevel', operator: '>', value: 55, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { internationalRegulation: +5, globalInnovation: -3 },
      company: { appliesTo: 'all', capital: -50000, regulatorRelations: +5 },
      cascade: [],
    },
    newsHeadline: 'ISO-IA 2045: CUMPLIMIENTO OBLIGATORIO',
    newsBody: 'El nuevo estándar ISO de IA Responsable es adoptado por 150 países. Todas las corporaciones deben auditar y certificar sus sistemas de IA. El costo de compliance es de $50,000, pero la certificación abre mercados de alto valor.',
    severity: 'medium',
  },

  {
    id: 'tec_008',
    name: 'Plataforma de Comercio Blockchain Descentralizado',
    description: 'Blockchain elimina intermediarios y reduce costos de transacción.',
    category: 'Tecnológica',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '>', value: 50, probabilityBoost: 0.30 },
      { variable: 'globalInnovation', operator: '>', value: 50, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: +5, globalInnovation: +5 },
      company: { appliesTo: 'topTech', internationalAccess: +8, capital: 90000 },
      cascade: [],
    },
    newsHeadline: 'NEOTERRA CHAIN: COMERCIO SIN INTERMEDIARIOS',
    newsBody: 'NeoChain lanza la plataforma de comercio blockchain más grande de Neo-Terra. Las corporaciones tecnológicamente avanzadas eliminan intermediarios bancarios y reducen costos de transacción internacional en 60%. Los márgenes se disparan.',
    severity: 'low',
  },

  {
    id: 'tec_009',
    name: 'Colapso de Infraestructura Digital Global',
    description: 'Un fallo masivo del sistema digital paraliza operaciones.',
    category: 'Tecnológica',
    baseProbability: 0.06,
    activationConditions: [
      { variable: 'avgCybersecurity', operator: '<', value: 30, probabilityBoost: 0.45 },
      { variable: 'globalInnovation', operator: '>', value: 60, probabilityBoost: 0.15 },
    ],
    consequences: {
      global: { economicStability: -12, consumerConfidence: -8 },
      company: { appliesTo: 'all', capital: -100000, logisticCapacity: -10 },
      cascade: ['systemOutage'],
    },
    newsHeadline: 'COLAPSO DIGITAL GLOBAL: 72 HORAS SIN SISTEMAS',
    newsBody: 'El mayor fallo de infraestructura digital en la historia de Neo-Terra paraliza operaciones corporativas durante 72 horas. Las corporaciones con baja inversión en ciberseguridad sufren pérdidas irrecuperables. El costo total: $500 mil millones.',
    severity: 'critical',
  },

  {
    id: 'tec_010',
    name: 'Algoritmos de Predicción de Mercados',
    description: 'IA de predicción de mercados disponible para corporaciones líderes.',
    category: 'Tecnológica',
    baseProbability: 0.11,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '>', value: 60, probabilityBoost: 0.30 },
      { variable: 'globalInnovation', operator: '>', value: 55, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { globalInnovation: +4, economicStability: +3 },
      company: { appliesTo: 'topTech', marketShare: +2, capital: 150000, innovation: +5 },
      cascade: [],
    },
    newsHeadline: 'PROPHET-AI: PREDICE MERCADOS CON 95% EXACTITUD',
    newsBody: 'El sistema de IA Prophet de NeuroData Corp predice movimientos de mercado con 95% de exactitud. Las corporaciones con mayor nivel tecnológico obtienen acceso prioritario. La ventaja informacional crea un nuevo tipo de desigualdad corporativa.',
    severity: 'low',
  },

  {
    id: 'tec_011',
    name: 'Brecha Digital Corporativa Norte-Sur',
    description: 'La diferencia tecnológica entre corporaciones crea un nuevo tipo de exclusión.',
    category: 'Tecnológica',
    baseProbability: 0.09,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '<', value: 35, probabilityBoost: 0.35 },
      { variable: 'socialInequality', operator: '>', value: 55, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { socialInequality: +8, economicStability: -5 },
      company: { appliesTo: 'lowTech', internationalAccess: -5, marketShare: -2 },
      cascade: [],
    },
    newsHeadline: 'BRECHA DIGITAL: DOS MUNDOS CORPORATIVOS',
    newsBody: 'El informe Tech Divide 2045 revela que Neo-Terra tiene dos economías corporativas: las tech-powered con crecimiento exponencial y las analógicas en declive terminal. La movilidad entre grupos es prácticamente nula sin inversión masiva en tecnología.',
    severity: 'medium',
  },

  {
    id: 'tec_012',
    name: 'Open Source Revolution Corporativa',
    description: 'Movimiento open source democratiza tecnología avanzada.',
    category: 'Tecnológica',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'globalInnovation', operator: '>', value: 55, probabilityBoost: 0.30 },
    ],
    consequences: {
      global: { globalInnovation: +8, socialInequality: -5 },
      company: { appliesTo: 'all', techLevel: +5, innovation: +3 },
      cascade: [],
    },
    newsHeadline: 'OPEN SOURCE GLOBAL: TECH PARA TODOS',
    newsBody: 'La coalición OpenNeoTerra libera gratuitamente un stack tecnológico completo de nivel enterprise. Todas las corporaciones se benefician, pero las que más invierten en I+D pueden adaptar y optimizar estas herramientas más rápidamente.',
    severity: 'low',
  },

  {
    id: 'tec_013',
    name: 'Patentes Bloqueadas por Corporación Dominante',
    description: 'Una empresa monopoliza tecnología clave y bloquea competidores.',
    category: 'Tecnológica',
    baseProbability: 0.07,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '>', value: 65, probabilityBoost: 0.35 },
    ],
    consequences: {
      global: { globalInnovation: -5, internationalRegulation: +5 },
      company: { appliesTo: 'topTech', marketShare: +3, capital: 200000 },
      cascade: ['antitrustRisk'],
    },
    newsHeadline: 'MONOPOLIO TECNOLÓGICO: BLOQUEO DE PATENTES',
    newsBody: 'La corporación tecnológica líder de Neo-Terra ha patentado 3,000 tecnologías clave, bloqueando efectivamente la competencia. Los reguladores inician investigación antimonopolio. Los líderes tech consolidan posición mientras dure la investigación.',
    severity: 'medium',
  },

  {
    id: 'tec_014',
    name: 'Neurotecnología Corporativa de Vanguardia',
    description: 'Interfaz cerebro-computadora transforma la productividad humana.',
    category: 'Tecnológica',
    baseProbability: 0.07,
    activationConditions: [
      { variable: 'avgRD', operator: '>', value: 180000, probabilityBoost: 0.45 },
      { variable: 'globalInnovation', operator: '>', value: 70, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { globalInnovation: +15, socialInequality: +8 },
      company: { appliesTo: 'topTech', techLevel: +20, innovation: +15, marketShare: +4 },
      cascade: [],
    },
    newsHeadline: 'NEUROTEC: FUSIÓN HUMANO-MÁQUINA CORPORATIVA',
    newsBody: 'NeoMind Biotech lanza las primeras interfaces cerebro-computadora de uso corporativo masivo. Los empleados de corporaciones líderes en innovación procesan datos a velocidades inhumanas. Una nueva era de productividad nace en Neo-Terra.',
    severity: 'medium',
  },

  {
    id: 'tec_015',
    name: 'Colapso del Sistema GPS Global',
    description: 'Fallo técnico destruye la infraestructura de navegación global.',
    category: 'Tecnológica',
    baseProbability: 0.05,
    activationConditions: [
      { variable: 'avgCybersecurity', operator: '<', value: 35, probabilityBoost: 0.40 },
    ],
    consequences: {
      global: { economicStability: -10, consumerConfidence: -8 },
      company: { appliesTo: 'all', logisticCapacity: -15, capital: -80000 },
      cascade: ['logisticsChaos'],
    },
    newsHeadline: 'CAOS GPS: LOGÍSTICA GLOBAL PARALIZADA',
    newsBody: 'Un ataque coordinado al sistema de navegación satelital global paraliza la logística de Neo-Terra. Los sistemas de entrega autónoma fallan. Las corporaciones dependientes de cadenas de suministro globales pierden operatividad durante días.',
    severity: 'critical',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 📉 CATEGORÍA: ECONÓMICA (15 eventos)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'eco_001',
    name: 'Recesión Global 2047',
    description: 'La economía global entra en recesión técnica.',
    category: 'Económica',
    baseProbability: 0.07,
    activationConditions: [
      { variable: 'economicStability', operator: '<', value: 30, probabilityBoost: 0.60 },
    ],
    consequences: {
      global: { economicStability: -15, consumerConfidence: -15, socialInequality: +10 },
      company: { appliesTo: 'all', capital: -200000, marketShare: -1 },
      cascade: ['revenueCollapse'],
    },
    newsHeadline: 'RECESIÓN GLOBAL 2047: MERCADOS EN CAÍDA LIBRE',
    newsBody: 'Neo-Terra entra oficialmente en recesión. Los mercados caen 35% en una semana. El consumo global colapsa. Las corporaciones con reservas de capital sobrevivirán; las que apostaron todo en expansión agresiva enfrentan insolvencia.',
    severity: 'critical',
  },

  {
    id: 'eco_002',
    name: 'Boom Económico de los Mercados Emergentes',
    description: 'Economías emergentes de Neo-Terra disparan el consumo global.',
    category: 'Económica',
    baseProbability: 0.11,
    activationConditions: [
      { variable: 'economicStability', operator: '>', value: 68, probabilityBoost: 0.30 },
      { variable: 'consumerConfidence', operator: '>', value: 65, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: +8, consumerConfidence: +10, sustainabilityIndex: +3 },
      company: { appliesTo: 'globalLeaders', marketShare: +2, capital: 200000 },
      cascade: [],
    },
    newsHeadline: 'BOOM ECONÓMICO: LOS TIGRES DE NEO-TERRA',
    newsBody: 'Las economías emergentes de Neo-Terra registran crecimientos del 12% anual. El consumo de clase media global se dispara. Las corporaciones con acceso internacional capturan una demanda sin precedentes. El mercado global se expande.',
    severity: 'low',
  },

  {
    id: 'eco_003',
    name: 'Impuesto Global a Corporaciones',
    description: 'Acuerdo internacional establece impuesto corporativo mínimo global.',
    category: 'Económica',
    baseProbability: 0.09,
    activationConditions: [
      { variable: 'internationalRegulation', operator: '>', value: 65, probabilityBoost: 0.35 },
      { variable: 'socialInequality', operator: '>', value: 60, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { socialInequality: -6, internationalRegulation: +5, economicStability: +3 },
      company: { appliesTo: 'all', capital: -80000 },
      cascade: [],
    },
    newsHeadline: 'IMPUESTO GLOBAL CORPORATIVO: 25% MÍNIMO',
    newsBody: 'El acuerdo histórico de 185 países establece un impuesto corporativo mínimo global del 25%. Los paraísos fiscales son eliminados. El capital resultante financia infraestructura global de sostenibilidad. Todas las corporaciones pagan su parte.',
    severity: 'medium',
  },

  {
    id: 'eco_004',
    name: 'Créditos de Sostenibilidad Neo-Terra',
    description: 'Bancos globales ofrecen créditos preferentes a empresas sostenibles.',
    category: 'Económica',
    baseProbability: 0.12,
    activationConditions: [
      { variable: 'sustainabilityIndex', operator: '>', value: 50, probabilityBoost: 0.30 },
      { variable: 'avgESG', operator: '>', value: 55, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: +5, sustainabilityIndex: +4 },
      company: { appliesTo: 'highESG', capital: 250000, regulatorRelations: +5 },
      cascade: [],
    },
    newsHeadline: 'BANCO GLOBAL VERDE: CRÉDITOS PARA EMPRESAS ESG',
    newsBody: 'El Banco Verde Global de Neo-Terra inyecta $250,000 en capital preferente a corporaciones con índice ESG superior a 65. La financiación sostenible supera por primera vez a la financiación tradicional en volumen global.',
    severity: 'low',
  },

  {
    id: 'eco_005',
    name: 'Inflación Global de Costos de Producción',
    description: 'Los costos de manufactura se disparan por múltiples factores.',
    category: 'Económica',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'avgEmissions', operator: '>', value: 65, probabilityBoost: 0.25 },
      { variable: 'economicStability', operator: '<', value: 50, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: -8, consumerConfidence: -6 },
      company: { appliesTo: 'all', capital: -80000 },
      cascade: [],
    },
    newsHeadline: 'INFLACIÓN CORPORATIVA: COSTOS +35%',
    newsBody: 'La combinación de crisis climática, escasez de materias primas e inestabilidad geopolítica dispara los costos de producción en Neo-Terra. Las corporaciones más vulnerables a la cadena de suministro absorben el mayor impacto.',
    severity: 'high',
  },

  {
    id: 'eco_006',
    name: 'Fusiones y Adquisiciones Masivas',
    description: 'El mercado consolida: las grandes absorben a las pequeñas.',
    category: 'Económica',
    baseProbability: 0.09,
    activationConditions: [
      { variable: 'economicStability', operator: '<', value: 45, probabilityBoost: 0.30 },
    ],
    consequences: {
      global: { economicStability: +3, socialInequality: +6 },
      company: { appliesTo: 'all', marketShare: -1 },
      cascade: [],
    },
    newsHeadline: 'OLA DE M&A: CONSOLIDACIÓN CORPORATIVA GLOBAL',
    newsBody: 'La inestabilidad económica desata una ola de fusiones y adquisiciones. Las corporaciones más pequeñas son absorbidas o quebradas. El mercado de Neo-Terra se consolida en pocos actores dominantes. La participación de mercado se redistribuye.',
    severity: 'medium',
  },

  {
    id: 'eco_007',
    name: 'Burbuja del Sector Tecnológico',
    description: 'El sobrevalor de empresas tech explota dramáticamente.',
    category: 'Económica',
    baseProbability: 0.07,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '>', value: 70, probabilityBoost: 0.35 },
      { variable: 'economicStability', operator: '<', value: 50, probabilityBoost: 0.25 },
    ],
    consequences: {
      global: { economicStability: -12, consumerConfidence: -10 },
      company: { appliesTo: 'topTech', capital: -300000, marketShare: -3 },
      cascade: ['marketCrash'],
    },
    newsHeadline: 'BURBUJA TECH 2045: EXPLOSIÓN BRUTAL',
    newsBody: 'El mercado tecnológico de Neo-Terra colapsa como en 2000 y 2008. Las valoraciones infladas de corporaciones tech explotan. Incluso las líderes pierden capital masivamente. Los inversores huyen al mercado físico. ¿Quién sobrevivirá?',
    severity: 'critical',
  },

  {
    id: 'eco_008',
    name: 'Sanciones Económicas por Corrupción',
    description: 'Organismos internacionales sancionan a corporaciones corruptas.',
    category: 'Económica',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'avgHiddenCorruption', operator: '>', value: 50, probabilityBoost: 0.45 },
      { variable: 'internationalRegulation', operator: '>', value: 55, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { internationalRegulation: +8, consumerConfidence: +3 },
      company: { appliesTo: 'cheapSupplierUsers', capital: -200000, reputation: -15, internationalAccess: -10 },
      cascade: ['marketClosure'],
    },
    newsHeadline: 'SANCIONES POR CORRUPCIÓN: LISTAS NEGRAS GLOBALES',
    newsBody: 'El Tribunal Internacional Corporativo publica las primeras listas negras de corporaciones con prácticas corruptas. Las empresas que usaron proveedores con altos índices de corrupción son sancionadas con exclusión de mercados internacionales.',
    severity: 'high',
  },

  {
    id: 'eco_009',
    name: 'Moneda Digital Global (GDBC)',
    description: 'Se lanza la primera moneda digital de reserva global.',
    category: 'Económica',
    baseProbability: 0.09,
    activationConditions: [
      { variable: 'globalInnovation', operator: '>', value: 55, probabilityBoost: 0.25 },
      { variable: 'economicStability', operator: '>', value: 55, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: +8, globalInnovation: +5 },
      company: { appliesTo: 'topTech', capital: 100000, internationalAccess: +5 },
      cascade: [],
    },
    newsHeadline: 'GDBC: LA MONEDA DIGITAL GLOBAL HA LLEGADO',
    newsBody: 'El Banco Central de Neo-Terra lanza la Global Digital Basic Currency. Las transacciones internacionales se simplifican radicalmente. Las corporaciones tecnológicas obtienen acceso prioritario al nuevo sistema financiero global descentralizado.',
    severity: 'low',
  },

  {
    id: 'eco_010',
    name: 'Subsidios a la Innovación Nacional',
    description: 'Gobiernos nacionales subsidian masivamente la I+D corporativa.',
    category: 'Económica',
    baseProbability: 0.12,
    activationConditions: [
      { variable: 'avgRD', operator: '>', value: 100000, probabilityBoost: 0.30 },
      { variable: 'globalInnovation', operator: '>', value: 45, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { globalInnovation: +6, economicStability: +4 },
      company: { appliesTo: 'topTech', capital: 150000, innovation: +8 },
      cascade: [],
    },
    newsHeadline: 'PROGRAMA NACIONAL DE INNOVACIÓN: $150K POR EMPRESA',
    newsBody: 'Los gobiernos de Neo-Terra anuncian el mayor programa de subsidios a la innovación de la historia. Las corporaciones con mayor inversión en I+D reciben capital adicional del estado. La innovación se convierte en prioridad de Estado.',
    severity: 'low',
  },

  {
    id: 'eco_011',
    name: 'Crisis de Deuda Corporativa',
    description: 'Las deudas acumuladas colapsan el sistema crediticio.',
    category: 'Económica',
    baseProbability: 0.07,
    activationConditions: [
      { variable: 'economicStability', operator: '<', value: 35, probabilityBoost: 0.45 },
    ],
    consequences: {
      global: { economicStability: -10, consumerConfidence: -8 },
      company: { appliesTo: 'all', capital: -150000 },
      cascade: ['creditFreeze'],
    },
    newsHeadline: 'CRISIS DE DEUDA: CRÉDITO CORPORATIVO CONGELADO',
    newsBody: 'Los bancos de Neo-Terra congelan el crédito corporativo ante el aumento de impagos. Las corporaciones sin reservas de capital propio quedan sin liquidez operativa. La crisis crediticia amplifica el daño de otras crisis en curso.',
    severity: 'critical',
  },

  {
    id: 'eco_012',
    name: 'Mercados Emergentes del África Digital',
    description: 'África conectada digitalmente se convierte en el mayor mercado de consumo.',
    category: 'Económica',
    baseProbability: 0.11,
    activationConditions: [
      { variable: 'avgInternationalAccess', operator: '>', value: 45, probabilityBoost: 0.35 },
      { variable: 'economicStability', operator: '>', value: 55, probabilityBoost: 0.15 },
    ],
    consequences: {
      global: { economicStability: +6, consumerConfidence: +5 },
      company: { appliesTo: 'globalLeaders', marketShare: +3, capital: 180000 },
      cascade: [],
    },
    newsHeadline: 'AFRICA 2045: EL MAYOR MERCADO DEL PLANETA',
    newsBody: 'Con 2.5 mil millones de consumidores conectados, África se convierte en el mayor mercado de consumo digital del planeta. Las corporaciones con acceso internacional capturan la ola de crecimiento. Una oportunidad histórica sin precedentes.',
    severity: 'low',
  },

  {
    id: 'eco_013',
    name: 'Regulación Antimonopolio Digital Global',
    description: 'Autoridades desmantelan monopolios tecnológicos globales.',
    category: 'Económica',
    baseProbability: 0.07,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '>', value: 65, probabilityBoost: 0.35 },
      { variable: 'internationalRegulation', operator: '>', value: 60, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { internationalRegulation: +6, economicStability: +3 },
      company: { appliesTo: 'topTech', capital: -200000, marketShare: -3 },
      cascade: [],
    },
    newsHeadline: 'ANTI-MONOPOLIO: FIN DE LAS MEGA-CORPORACIONES',
    newsBody: 'La Comisión Antimonopolio Global de Neo-Terra fuerza la división de las corporaciones tecnológicas con más del 25% de cuota de mercado. Las multas alcanzan $200,000 por empresa investigada. La competencia se redistribuye.',
    severity: 'high',
  },

  {
    id: 'eco_014',
    name: 'Boom del Consumo Consciente Global',
    description: 'Los consumidores premian masivamente a las empresas éticas.',
    category: 'Económica',
    baseProbability: 0.12,
    activationConditions: [
      { variable: 'avgESG', operator: '>', value: 58, probabilityBoost: 0.30 },
      { variable: 'consumerConfidence', operator: '>', value: 60, probabilityBoost: 0.15 },
    ],
    consequences: {
      global: { consumerConfidence: +8, sustainabilityIndex: +6 },
      company: { appliesTo: 'highESG', marketShare: +2, capital: 150000, consumerRelations: +10 },
      cascade: [],
    },
    newsHeadline: 'CONSUMO CONSCIENTE: EMPRESAS ESG DOMINAN MERCADO',
    newsBody: 'Un cambio sísmico en el comportamiento del consumidor premia a las corporaciones sostenibles. El 78% de los consumidores de Neo-Terra afirman pagar un 20% más por productos de empresas con alto índice ESG. La ética se convierte en ventaja competitiva definitiva.',
    severity: 'low',
  },

  {
    id: 'eco_015',
    name: 'Hiperinflación en Economías Inestables',
    description: 'La inflación descontrolada destruye el valor del capital acumulado.',
    category: 'Económica',
    baseProbability: 0.06,
    activationConditions: [
      { variable: 'economicStability', operator: '<', value: 25, probabilityBoost: 0.55 },
    ],
    consequences: {
      global: { economicStability: -8, consumerConfidence: -12 },
      company: { appliesTo: 'all', capital: -120000 },
      cascade: [],
    },
    newsHeadline: 'HIPERINFLACIÓN: EL CAPITAL PIERDE VALOR',
    newsBody: 'La inflación en Neo-Terra alcanza el 800% anual. El capital acumulado pierde valor rápidamente. Las corporaciones con activos físicos y tecnológicos sobreviven mejor que las puramente financieras. Crisis histórica sin precedentes.',
    severity: 'critical',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 🏛️ CATEGORÍA: POLÍTICA (10 eventos)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'pol_001',
    name: 'Regulación Antimonopolio Global Reforzada',
    description: 'Ley internacional limita el poder de las megacorporaciones.',
    category: 'Política',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'internationalRegulation', operator: '>', value: 60, probabilityBoost: 0.35 },
      { variable: 'economicStability', operator: '<', value: 50, probabilityBoost: 0.15 },
    ],
    consequences: {
      global: { internationalRegulation: +8, socialInequality: -5 },
      company: { appliesTo: 'all', regulatorRelations: -5, capital: -60000 },
      cascade: [],
    },
    newsHeadline: 'LEY NEO-ANTITRUST: FIN DEL PODER ILIMITADO',
    newsBody: 'El Parlamento de Neo-Terra aprueba la ley de regulación corporativa más estricta de la historia. Las empresas con cuota de mercado superior al 20% deben compartir tecnología con competidores. El poder corporativo tiene nuevos límites.',
    severity: 'medium',
  },

  {
    id: 'pol_002',
    name: 'Escándalo de Corrupción Política-Corporativa',
    description: 'Sale a la luz una red de corrupción entre políticos y corporaciones.',
    category: 'Política',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'avgHiddenCorruption', operator: '>', value: 55, probabilityBoost: 0.50 },
    ],
    consequences: {
      global: { internationalRegulation: +10, consumerConfidence: -8 },
      company: { appliesTo: 'cheapSupplierUsers', reputation: -20, regulatorRelations: -15 },
      cascade: ['legalProceedings'],
    },
    newsHeadline: 'ESCÁNDALO POLÍTICO: REDES DE CORRUPCIÓN EXPUESTAS',
    newsBody: 'Una investigación periodística de impacto global revela una red de corrupción entre funcionarios gubernamentales y corporaciones de Neo-Terra. Los proveedores cuestionados son señalados. Las empresas involucradas enfrentan juicios y sanciones.',
    severity: 'high',
  },

  {
    id: 'pol_003',
    name: 'Nueva Constitución Corporativa Global',
    description: 'Se aprueba un nuevo marco legal para corporaciones multinacionales.',
    category: 'Política',
    baseProbability: 0.07,
    activationConditions: [
      { variable: 'internationalRegulation', operator: '>', value: 70, probabilityBoost: 0.35 },
    ],
    consequences: {
      global: { internationalRegulation: +10, sustainabilityIndex: +6 },
      company: { appliesTo: 'all', regulatorRelations: -3, capital: -50000 },
      cascade: [],
    },
    newsHeadline: 'CONSTITUCIÓN CORPORATIVA GLOBAL 2045',
    newsBody: 'La Asamblea Global aprueba la primera Constitución Corporativa vinculante. Las corporaciones son ahora legalmente responsables de su impacto social y ambiental. El compliance se vuelve existencial, no opcional.',
    severity: 'high',
  },

  {
    id: 'pol_004',
    name: 'Gobierno Algorítmico Piloto',
    description: 'Primeros gobiernos adoptan toma de decisiones por IA.',
    category: 'Política',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'globalInnovation', operator: '>', value: 65, probabilityBoost: 0.35 },
      { variable: 'avgTechLevel', operator: '>', value: 60, probabilityBoost: 0.15 },
    ],
    consequences: {
      global: { economicStability: +5, internationalRegulation: +3 },
      company: { appliesTo: 'topTech', regulatorRelations: +8, capital: 80000 },
      cascade: [],
    },
    newsHeadline: 'GOV-AI: PRIMER GOBIERNO ALGORÍTMICO PILOTO',
    newsBody: 'NeoCity adopta el primer sistema de gobierno algorítmico del mundo. Las regulaciones se aplican automáticamente y sin corrupción. Las corporaciones tecnológicas colaboran en el diseño del sistema y obtienen ventajas regulatorias.',
    severity: 'low',
  },

  {
    id: 'pol_005',
    name: 'Revocación de Licencias Operativas',
    description: 'Gobierno revoca permisos de operación a empresas irresponsables.',
    category: 'Política',
    baseProbability: 0.07,
    activationConditions: [
      { variable: 'avgHiddenCorruption', operator: '>', value: 60, probabilityBoost: 0.40 },
      { variable: 'internationalRegulation', operator: '>', value: 65, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { internationalRegulation: +5 },
      company: { appliesTo: 'cheapSupplierUsers', internationalAccess: -15, capital: -200000, reputation: -15 },
      cascade: [],
    },
    newsHeadline: 'REVOCACIÓN MASIVA DE LICENCIAS CORPORATIVAS',
    newsBody: 'Los gobiernos de Neo-Terra revocan licencias operativas en 12 sectores clave. Las corporaciones con historial de malas prácticas pierden acceso a mercados estratégicos. La era de impunidad corporativa ha terminado.',
    severity: 'critical',
  },

  {
    id: 'pol_006',
    name: 'Alianza de Países Verdes (GreenBlock)',
    description: 'Bloque de países establece barreras verdes para el comercio.',
    category: 'Política',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'sustainabilityIndex', operator: '>', value: 50, probabilityBoost: 0.30 },
      { variable: 'internationalRegulation', operator: '>', value: 55, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { sustainabilityIndex: +8, internationalRegulation: +8 },
      company: { appliesTo: 'highESG', internationalAccess: +12, capital: 100000 },
      cascade: [],
    },
    newsHeadline: 'GREENBLOCK: 60 PAÍSES ABREN MERCADOS SOSTENIBLES',
    newsBody: 'El bloque GreenBlock de 60 naciones acuerda dar acceso preferencial de comercio a corporaciones con certificación ESG avanzada. Las empresas sostenibles acceden a mercados de alto poder adquisitivo. Las extractivas son excluidas.',
    severity: 'medium',
  },

  {
    id: 'pol_007',
    name: 'Elecciones Anti-Corporativas Globales',
    description: 'Ola populista anti-corporativa llega al poder en múltiples países.',
    category: 'Política',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'socialInequality', operator: '>', value: 65, probabilityBoost: 0.40 },
      { variable: 'consumerConfidence', operator: '<', value: 40, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { internationalRegulation: +15, economicStability: -8 },
      company: { appliesTo: 'all', capital: -100000, regulatorRelations: -10 },
      cascade: [],
    },
    newsHeadline: 'OLA POPULISTA: GOBIERNOS ANTI-CORPORATIVOS LLEGAN',
    newsBody: 'En 25 países de Neo-Terra, partidos con agendas anti-corporativas ganan elecciones. Las promesas: impuestos corporativos del 40%, expropiaciones en sectores estratégicos, y auditorías masivas. El ambiente regulatorio se vuelve hostil.',
    severity: 'high',
  },

  {
    id: 'pol_008',
    name: 'Tribunal Internacional Corporativo',
    description: 'Se crea un tribunal permanente para juzgar crímenes corporativos.',
    category: 'Política',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'avgHiddenLaborRisk', operator: '>', value: 50, probabilityBoost: 0.35 },
      { variable: 'internationalRegulation', operator: '>', value: 60, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { internationalRegulation: +8, consumerConfidence: +5 },
      company: { appliesTo: 'cheapSupplierUsers', reputation: -12, regulatorRelations: -15, capital: -150000 },
      cascade: [],
    },
    newsHeadline: 'TRIBUNAL CORPORATIVO INTERNACIONAL OPERATIVO',
    newsBody: 'El Tribunal Internacional de Responsabilidad Corporativa (TIRC) inicia operaciones con 47 casos activos. Las corporaciones con historial de explotación laboral y daño ambiental son las primeras en ser juzgadas. Multas de hasta $500,000.',
    severity: 'high',
  },

  {
    id: 'pol_009',
    name: 'Diplomacia Corporativa Directa',
    description: 'Corporaciones obtienen voz directa en negociaciones internacionales.',
    category: 'Política',
    baseProbability: 0.09,
    activationConditions: [
      { variable: 'avgInternationalAccess', operator: '>', value: 55, probabilityBoost: 0.30 },
    ],
    consequences: {
      global: { economicStability: +4 },
      company: { appliesTo: 'globalLeaders', regulatorRelations: +8, internationalAccess: +10 },
      cascade: [],
    },
    newsHeadline: 'CORPORACIONES EN LA MESA DIPLOMÁTICA GLOBAL',
    newsBody: 'Por primera vez en la historia, las corporaciones de Neo-Terra con mayor acceso internacional participan directamente en negociaciones de tratados comerciales. La diplomacia corporativa rediseña el mapa del comercio global.',
    severity: 'low',
  },

  {
    id: 'pol_010',
    name: 'Estado de Emergencia Económica Nacional',
    description: 'Gobiernos declaran emergencia y toman control parcial de sectores.',
    category: 'Política',
    baseProbability: 0.06,
    activationConditions: [
      { variable: 'economicStability', operator: '<', value: 25, probabilityBoost: 0.55 },
    ],
    consequences: {
      global: { economicStability: +5, internationalRegulation: +10 },
      company: { appliesTo: 'all', capital: -120000, internationalAccess: -5 },
      cascade: [],
    },
    newsHeadline: 'ESTADO DE EMERGENCIA: CONTROL ESTATAL CORPORATIVO',
    newsBody: 'Ante el colapso económico, 30 gobiernos de Neo-Terra declaran estado de emergencia económica. El Estado toma participación temporal en sectores estratégicos. Las corporaciones operan bajo supervisión directa del gobierno. Libertad empresarial limitada.',
    severity: 'critical',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 🌍 CATEGORÍA: GEOPOLÍTICA (10 eventos)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'geo_001',
    name: 'Guerra Comercial Tecnológica',
    description: 'Bloques económicos inician guerra comercial por dominio tech.',
    category: 'Geopolítica',
    baseProbability: 0.07,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '>', value: 60, probabilityBoost: 0.35 },
      { variable: 'internationalRegulation', operator: '>', value: 55, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: -10, internationalRegulation: +12 },
      company: { appliesTo: 'all', internationalAccess: -8, capital: -80000 },
      cascade: ['supplyChainDisruption'],
    },
    newsHeadline: 'GUERRA COMERCIAL TECH: BLOQUES ENFRENTADOS',
    newsBody: 'Los dos grandes bloques económicos de Neo-Terra inician una guerra comercial tecnológica. Los aranceles sobre tecnología suben al 40%. Las cadenas de suministro globales se fracturan. Las corporaciones deben elegir un bando o perder acceso a ambos.',
    severity: 'high',
  },

  {
    id: 'geo_002',
    name: 'Bloqueo Comercial del Sur Global',
    description: 'Naciones del Sur Global imponen embargo a corporaciones explotadoras.',
    category: 'Geopolítica',
    baseProbability: 0.07,
    activationConditions: [
      { variable: 'pctCheapSupplier', operator: '>', value: 0.6, probabilityBoost: 0.45 },
      { variable: 'avgHiddenLaborRisk', operator: '>', value: 50, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { internationalRegulation: +10, economicStability: -8, socialInequality: -5 },
      company: { appliesTo: 'cheapSupplierUsers', internationalAccess: -15, logisticCapacity: -10, capital: -150000 },
      cascade: [],
    },
    newsHeadline: 'BLOQUEO SUR GLOBAL: EMBARGO A CORPORACIONES',
    newsBody: 'La Unión de Naciones del Sur Global vota embargo comercial total contra corporaciones que operan con proveedores de explotación. Los países del Sur controlan el 60% de materias primas clave. Las corporaciones con proveedor A pierden acceso crítico.',
    severity: 'critical',
  },

  {
    id: 'geo_003',
    name: 'Nueva Alianza del Indo-Pacífico',
    description: 'Bloque Asia-Pacífico crea zona de libre comercio exclusiva.',
    category: 'Geopolítica',
    baseProbability: 0.09,
    activationConditions: [
      { variable: 'avgInternationalAccess', operator: '>', value: 45, probabilityBoost: 0.30 },
    ],
    consequences: {
      global: { economicStability: +6, globalInnovation: +5 },
      company: { appliesTo: 'globalLeaders', internationalAccess: +10, marketShare: +2, capital: 120000 },
      cascade: [],
    },
    newsHeadline: 'INDO-PACIFIC ALLIANCE: MAYOR ZONA LIBRE DE COMERCIO',
    newsBody: 'La Nueva Alianza del Indo-Pacífico agrupa a 35 países con 3.5 mil millones de consumidores. Las corporaciones con acceso internacional ya establecido obtienen ventajas inmediatas. El mayor mercado de libre comercio de la historia abre sus puertas.',
    severity: 'low',
  },

  {
    id: 'geo_004',
    name: 'Conflicto por Recursos de Tierras Raras',
    description: 'Tensiones geopolíticas por control de materiales críticos.',
    category: 'Geopolítica',
    baseProbability: 0.07,
    activationConditions: [
      { variable: 'globalTemperature', operator: '>', value: 2.0, probabilityBoost: 0.25 },
      { variable: 'avgTechLevel', operator: '>', value: 55, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: -8, internationalRegulation: +6 },
      company: { appliesTo: 'all', capital: -80000, techLevel: -3 },
      cascade: ['supplyChainDisruption'],
    },
    newsHeadline: 'GUERRA FRÍA POR TIERRAS RARAS: ESCASEZ CRÍTICA',
    newsBody: 'El conflicto geopolítico por el control de depósitos de cobalto, litio y neodimio escala a tensión internacional. Las corporaciones dependientes de materiales importados enfrentan escasez crítica y precios disparados. La tecnología tiene su precio geopolítico.',
    severity: 'high',
  },

  {
    id: 'geo_005',
    name: 'Crisis de Refugiados Tecnológicos',
    description: 'La automatización desplaza masivamente trabajadores en países pobres.',
    category: 'Geopolítica',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '>', value: 65, probabilityBoost: 0.30 },
      { variable: 'socialInequality', operator: '>', value: 65, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { socialInequality: +10, economicStability: -7, internationalRegulation: +8 },
      company: { appliesTo: 'all', regulatorRelations: -5 },
      cascade: [],
    },
    newsHeadline: 'REFUGIADOS TECH: 200M DESPLAZADOS POR AUTOMATIZACIÓN',
    newsBody: 'La automatización masiva desplaza 200 millones de trabajadores en economías emergentes. La crisis migratoria resultante desestabiliza las fronteras de Neo-Terra. Las corporaciones tecnológicas son señaladas como responsables del desastre social.',
    severity: 'high',
  },

  {
    id: 'geo_006',
    name: 'Sanciones por Violaciones de Derechos Humanos',
    description: 'Bloque occidental impone sanciones por explotación laboral.',
    category: 'Geopolítica',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'avgHiddenLaborRisk', operator: '>', value: 55, probabilityBoost: 0.45 },
    ],
    consequences: {
      global: { internationalRegulation: +10 },
      company: { appliesTo: 'cheapSupplierUsers', internationalAccess: -12, capital: -180000, reputation: -18 },
      cascade: [],
    },
    newsHeadline: 'SANCIONES DDHH: MERCADOS CERRADOS',
    newsBody: 'Los países del G-20 implementan sanciones coordinadas contra corporaciones de Neo-Terra con historial documentado de violaciones de derechos humanos en sus cadenas de suministro. Los mercados occidentales de alto poder adquisitivo cierran sus puertas.',
    severity: 'critical',
  },

  {
    id: 'geo_007',
    name: 'Tratado de Datos Digitales Global',
    description: 'Acuerdo internacional sobre flujos de datos y privacidad.',
    category: 'Geopolítica',
    baseProbability: 0.09,
    activationConditions: [
      { variable: 'avgCybersecurity', operator: '>', value: 55, probabilityBoost: 0.30 },
      { variable: 'globalInnovation', operator: '>', value: 55, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { internationalRegulation: +6, globalInnovation: +4 },
      company: { appliesTo: 'highCyber', internationalAccess: +8, capital: 90000 },
      cascade: [],
    },
    newsHeadline: 'TRATADO DIGITAL GLOBAL: DATOS PROTEGIDOS',
    newsBody: 'El Tratado de Datos Digitales de Neo-Terra establece un marco global de privacidad y flujo de datos. Las corporaciones con alta ciberseguridad certificada obtienen acceso prioritario. Un nuevo activo estratégico: la confianza digital.',
    severity: 'low',
  },

  {
    id: 'geo_008',
    name: 'Alianza BRICS+ Tecnológica Contra Occidente',
    description: 'Nuevo bloque tecnológico alternativo emerge como potencia.',
    category: 'Geopolítica',
    baseProbability: 0.07,
    activationConditions: [
      { variable: 'economicStability', operator: '<', value: 50, probabilityBoost: 0.30 },
      { variable: 'internationalRegulation', operator: '>', value: 60, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: -6, globalInnovation: +4 },
      company: { appliesTo: 'all', internationalAccess: -5 },
      cascade: [],
    },
    newsHeadline: 'BRICS+ TECH: NUEVA POTENCIA TECNOLÓGICA GLOBAL',
    newsBody: 'La Alianza BRICS+ lanza su propio stack tecnológico soberano, desafiando el dominio occidental. Neo-Terra se fragmenta en dos ecosistemas digitales. Las corporaciones deben elegir uno o adaptarse a ambos con doble inversión.',
    severity: 'high',
  },

  {
    id: 'geo_009',
    name: 'Desintegración de Tratados Comerciales Históricos',
    description: 'Múltiples acuerdos comerciales colapsan por tensiones geopolíticas.',
    category: 'Geopolítica',
    baseProbability: 0.06,
    activationConditions: [
      { variable: 'economicStability', operator: '<', value: 35, probabilityBoost: 0.45 },
      { variable: 'internationalRegulation', operator: '>', value: 70, probabilityBoost: 0.15 },
    ],
    consequences: {
      global: { economicStability: -10, internationalRegulation: +8 },
      company: { appliesTo: 'all', internationalAccess: -10, capital: -100000 },
      cascade: [],
    },
    newsHeadline: 'COLAPSO DE TRATADOS: PROTECCIONISMO TOTAL',
    newsBody: 'En 6 meses, 23 tratados comerciales históricos de Neo-Terra son terminados unilateralmente. El proteccionismo reemplaza la globalización. Los aranceles se disparan. Las cadenas de suministro globales se rompen. La era del libre comercio termina.',
    severity: 'critical',
  },

  {
    id: 'geo_010',
    name: 'Carrera Espacial Corporativa',
    description: 'Las corporaciones más avanzadas compiten por recursos espaciales.',
    category: 'Geopolítica',
    baseProbability: 0.07,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '>', value: 75, probabilityBoost: 0.40 },
      { variable: 'avgRD', operator: '>', value: 200000, probabilityBoost: 0.25 },
    ],
    consequences: {
      global: { globalInnovation: +12, economicStability: +5 },
      company: { appliesTo: 'topTech', marketShare: +4, capital: 300000, innovation: +15 },
      cascade: [],
    },
    newsHeadline: 'CARRERA ESPACIAL CORPORATIVA 2045',
    newsBody: 'Las corporaciones más tecnológicamente avanzadas de Neo-Terra inician la extracción de recursos espaciales. Asteroides ricos en metales raros resuelven la escasez terrestre. Las empresas líderes en I+D capturan un mercado completamente nuevo.',
    severity: 'medium',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 🛒 CATEGORÍA: COMERCIAL (10 eventos)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'com_001',
    name: 'Plataforma de Comercio Global Directo',
    description: 'Nueva plataforma digital elimina intermediarios comerciales.',
    category: 'Comercial',
    baseProbability: 0.11,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '>', value: 55, probabilityBoost: 0.30 },
      { variable: 'globalInnovation', operator: '>', value: 50, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: +5, globalInnovation: +4 },
      company: { appliesTo: 'topTech', logisticCapacity: +8, marketShare: +2 },
      cascade: [],
    },
    newsHeadline: 'NEOMARKET: COMERCIO GLOBAL SIN INTERMEDIARIOS',
    newsBody: 'NeoMarket, la plataforma de comercio directo, conecta a 2 mil millones de consumidores con corporaciones sin intermediarios. Las empresas tecnológicamente preparadas capturan márgenes históricos. El comercio tradicional pierde relevancia.',
    severity: 'low',
  },

  {
    id: 'com_002',
    name: 'Certificación de Cadena Sostenible Premium',
    description: 'Nuevo sello de cadena sostenible abre mercados exclusivos.',
    category: 'Comercial',
    baseProbability: 0.12,
    activationConditions: [
      { variable: 'pctPremiumSupplier', operator: '>', value: 0.35, probabilityBoost: 0.35 },
      { variable: 'avgESG', operator: '>', value: 55, probabilityBoost: 0.15 },
    ],
    consequences: {
      global: { sustainabilityIndex: +6 },
      company: { appliesTo: 'premiumSupplierUsers', marketShare: +2, reputation: +10, capital: 100000 },
      cascade: [],
    },
    newsHeadline: 'SELLO CADENA SOSTENIBLE: ACCESO A MERCADOS PREMIUM',
    newsBody: 'La certificación "Cadena 100% Sostenible" se convierte en el pasaporte obligatorio para mercados europeos y norteamericanos de alto valor. Las corporaciones con proveedor C obtienen el sello automáticamente. Nuevos ingresos de segmentos exclusivos.',
    severity: 'low',
  },

  {
    id: 'com_003',
    name: 'Colapso de Plataformas E-Commerce',
    description: 'Un ataque masivo destruye las principales plataformas de venta online.',
    category: 'Comercial',
    baseProbability: 0.06,
    activationConditions: [
      { variable: 'avgCybersecurity', operator: '<', value: 30, probabilityBoost: 0.45 },
    ],
    consequences: {
      global: { economicStability: -10, consumerConfidence: -12 },
      company: { appliesTo: 'all', capital: -120000, consumerRelations: -8 },
      cascade: [],
    },
    newsHeadline: 'COLAPSO E-COMMERCE: VENTAS EN CERO',
    newsBody: 'Un ataque coordinado destruye las principales plataformas de comercio digital de Neo-Terra. Las ventas en línea colapsan durante 2 semanas. Las corporaciones sin canales de venta físicos alternativos sufren pérdidas críticas. Ciberseguridad: prioridad inmediata.',
    severity: 'critical',
  },

  {
    id: 'com_004',
    name: 'Boom del Mercado de África Digital',
    description: 'El mercado africano digitalizado explota en consumo.',
    category: 'Comercial',
    baseProbability: 0.11,
    activationConditions: [
      { variable: 'avgInternationalAccess', operator: '>', value: 40, probabilityBoost: 0.30 },
      { variable: 'consumerConfidence', operator: '>', value: 55, probabilityBoost: 0.15 },
    ],
    consequences: {
      global: { economicStability: +6, consumerConfidence: +5 },
      company: { appliesTo: 'globalLeaders', marketShare: +3, capital: 180000 },
      cascade: [],
    },
    newsHeadline: 'AFRICA DIGITAL: MERCADO DE $3 BILLONES ABRE',
    newsBody: 'Con 1.8 mil millones de personas conectadas, el mercado africano digitalizado es la mayor oportunidad comercial del siglo. Las corporaciones con redes internacionales establecidas son las primeras en capturar esta demanda histórica.',
    severity: 'low',
  },

  {
    id: 'com_005',
    name: 'Crisis de Confianza en Marcas Globales',
    description: 'Escándalos masivos destruyen la confianza en marcas corporativas.',
    category: 'Comercial',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'avgReputation', operator: '<', value: 35, probabilityBoost: 0.45 },
    ],
    consequences: {
      global: { consumerConfidence: -12, economicStability: -6 },
      company: { appliesTo: 'lowRep', marketShare: -3, capital: -80000 },
      cascade: [],
    },
    newsHeadline: 'CRISIS DE MARCA: CONSUMIDORES ABANDONAN CORPORACIONES',
    newsBody: 'Una ola de escándalos corporativos destruye la confianza del consumidor en las marcas globales. El 45% de los consumidores de Neo-Terra afirma haber abandonado una marca corporativa este período. Las empresas con reputación deteriorada pagan el precio.',
    severity: 'high',
  },

  {
    id: 'com_006',
    name: 'Nuevo Estándar de Calidad Global',
    description: 'El mercado exige nuevos estándares que requieren inversión tech.',
    category: 'Comercial',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'avgTechLevel', operator: '>', value: 55, probabilityBoost: 0.30 },
      { variable: 'consumerConfidence', operator: '>', value: 55, probabilityBoost: 0.15 },
    ],
    consequences: {
      global: { globalInnovation: +5, consumerConfidence: +5 },
      company: { appliesTo: 'topTech', marketShare: +2, reputation: +8 },
      cascade: [],
    },
    newsHeadline: 'ESTÁNDAR NEOQ: NUEVA BARRERA DE CALIDAD',
    newsBody: 'El mercado global adopta el NeoQ Standard, requisito mínimo de calidad tecnológica para productos y servicios. Las corporaciones con alto nivel tech lo cumplen automáticamente. Las rezagadas pierden certificación y acceso a mercados premium.',
    severity: 'medium',
  },

  {
    id: 'com_007',
    name: 'Plataforma de Licitaciones Corporativas Globales',
    description: 'Nueva plataforma abre contratos gubernamentales masivos.',
    category: 'Comercial',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'avgInternationalAccess', operator: '>', value: 50, probabilityBoost: 0.30 },
      { variable: 'avgTechLevel', operator: '>', value: 50, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: +4 },
      company: { appliesTo: 'globalLeaders', capital: 200000, marketShare: +2 },
      cascade: [],
    },
    newsHeadline: 'GOV-TENDER: $50B EN CONTRATOS GLOBALES',
    newsBody: 'La plataforma GovTender de Neo-Terra abre $50 mil millones en contratos gubernamentales a corporaciones calificadas. Las empresas con alta capacidad logística e internacional obtienen contratos de infraestructura a largo plazo.',
    severity: 'low',
  },

  {
    id: 'com_008',
    name: 'Escasez de Productos por Crisis Climática',
    description: 'La crisis climática genera escasez masiva de productos básicos.',
    category: 'Comercial',
    baseProbability: 0.09,
    activationConditions: [
      { variable: 'globalTemperature', operator: '>', value: 2.2, probabilityBoost: 0.40 },
      { variable: 'pctCheapSupplier', operator: '>', value: 0.5, probabilityBoost: 0.15 },
    ],
    consequences: {
      global: { consumerConfidence: -8, economicStability: -6 },
      company: { appliesTo: 'cheapSupplierUsers', capital: -100000, logisticCapacity: -8 },
      cascade: [],
    },
    newsHeadline: 'ESCASEZ GLOBAL: CADENAS DE SUMINISTRO ROTAS',
    newsBody: 'La crisis climática y las malas prácticas corporativas combinadas generan escasez masiva de productos en Neo-Terra. Los proveedores más vulnerables al clima colapsan. Los consumidores protestan. El mercado de productos alternativos explota.',
    severity: 'high',
  },

  {
    id: 'com_009',
    name: 'Alianza de Comercio Justo 2045',
    description: 'Bloque de consumidores y corporaciones promueven comercio ético.',
    category: 'Comercial',
    baseProbability: 0.11,
    activationConditions: [
      { variable: 'pctPremiumSupplier', operator: '>', value: 0.4, probabilityBoost: 0.30 },
      { variable: 'avgESG', operator: '>', value: 55, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { consumerConfidence: +8, sustainabilityIndex: +6 },
      company: { appliesTo: 'premiumSupplierUsers', marketShare: +2, reputation: +8, capital: 90000 },
      cascade: [],
    },
    newsHeadline: 'COMERCIO JUSTO 2045: NUEVA ERA GLOBAL',
    newsBody: 'La Alianza de Comercio Justo 2045 agrupa a corporaciones y consumidores en un compromiso vinculante de prácticas éticas. Las empresas miembros reciben sello de autenticidad y acceso a canales de distribución exclusivos con márgenes superiores.',
    severity: 'low',
  },

  {
    id: 'com_010',
    name: 'Crisis de Logística por Geopolítica',
    description: 'Tensiones políticas bloquean rutas comerciales estratégicas.',
    category: 'Comercial',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'internationalRegulation', operator: '>', value: 65, probabilityBoost: 0.35 },
      { variable: 'economicStability', operator: '<', value: 45, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: -8, consumerConfidence: -6 },
      company: { appliesTo: 'all', logisticCapacity: -10, capital: -60000 },
      cascade: [],
    },
    newsHeadline: 'BLOQUEO DE RUTAS: LOGÍSTICA GLOBAL EN CRISIS',
    newsBody: 'Las tensiones geopolíticas bloquean el Canal Central y el Estrecho de Neo-Terra, las rutas marítimas más importantes del mundo. Los tiempos de envío se triplican. Los costos logísticos explotan. Las cadenas de suministro globales se rompen.',
    severity: 'high',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 🔒 CATEGORÍA: CIBERSEGURIDAD (10 eventos)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'cyb_001',
    name: 'Ciberataque Global Coordinado',
    description: 'Un ataque masivo de actores estatales paraliza corporaciones.',
    category: 'Ciberseguridad',
    baseProbability: 0.07,
    activationConditions: [
      { variable: 'avgCybersecurity', operator: '<', value: 30, probabilityBoost: 0.50 },
    ],
    consequences: {
      global: { economicStability: -12, consumerConfidence: -10 },
      company: { appliesTo: 'lowCyber', capital: -200000, reputation: -12, cybersecurity: -5 },
      cascade: ['dataBreachCascade'],
    },
    newsHeadline: '🔒 CIBERATAQUE GLOBAL: CORPORACIONES BAJO FUEGO',
    newsBody: 'El mayor ciberataque coordinado de la historia impacta a Neo-Terra. Actores estatales comprometen datos de millones de consumidores. Las corporaciones con baja inversión en ciberseguridad son el objetivo principal. Pérdidas masivas e irrecuperables.',
    severity: 'critical',
  },

  {
    id: 'cyb_002',
    name: 'Ransomware a Cadenas Logísticas',
    description: 'Hackers secuestran los sistemas logísticos de corporaciones vulnerables.',
    category: 'Ciberseguridad',
    baseProbability: 0.08,
    activationConditions: [
      { variable: 'avgCybersecurity', operator: '<', value: 35, probabilityBoost: 0.45 },
    ],
    consequences: {
      global: { economicStability: -6 },
      company: { appliesTo: 'lowCyber', capital: -150000, logisticCapacity: -15 },
      cascade: [],
    },
    newsHeadline: 'RANSOMWARE LOGÍSTICO: CADENAS SECUESTRADAS',
    newsBody: 'El grupo de ransomware NeoPhantom secuestra los sistemas de gestión logística de múltiples corporaciones. Las empresas con ciberseguridad insuficiente deben pagar $150,000 en rescate o perder semanas de operaciones. La era del ransomware industrial ha llegado.',
    severity: 'high',
  },

  {
    id: 'cyb_003',
    name: 'Espionaje Corporativo de Alto Nivel',
    description: 'Competidores usan IA para robar secretos industriales.',
    category: 'Ciberseguridad',
    baseProbability: 0.09,
    activationConditions: [
      { variable: 'avgCybersecurity', operator: '<', value: 40, probabilityBoost: 0.40 },
      { variable: 'avgTechLevel', operator: '>', value: 55, probabilityBoost: 0.15 },
    ],
    consequences: {
      global: { globalInnovation: -3 },
      company: { appliesTo: 'lowCyber', innovation: -10, techLevel: -5, reputation: -8 },
      cascade: [],
    },
    newsHeadline: 'ESPIONAJE INDUSTRIAL: SECRETOS ROBADOS',
    newsBody: 'Una operación de espionaje corporativo con IA avanzada filtra la propiedad intelectual de múltiples corporaciones de Neo-Terra. Las empresas con ciberseguridad deficiente pierden años de ventaja tecnológica en horas. La inteligencia corporativa es un arma.',
    severity: 'high',
  },

  {
    id: 'cyb_004',
    name: 'Brecha Masiva de Datos de Consumidores',
    description: 'Datos privados de millones de clientes son expuestos.',
    category: 'Ciberseguridad',
    baseProbability: 0.09,
    activationConditions: [
      { variable: 'avgCybersecurity', operator: '<', value: 40, probabilityBoost: 0.45 },
    ],
    consequences: {
      global: { consumerConfidence: -10, internationalRegulation: +8 },
      company: { appliesTo: 'lowCyber', reputation: -15, consumerRelations: -15, capital: -120000, regulatorRelations: -12 },
      cascade: [],
    },
    newsHeadline: 'BRECHA DE DATOS: 500M DE CONSUMIDORES EXPUESTOS',
    newsBody: 'Los datos privados de 500 millones de consumidores de Neo-Terra son expuestos en la mayor brecha de datos de la historia. Las corporaciones con ciberseguridad débil enfrentan multas del GDPR-2045, demandas colectivas y abandono masivo de consumidores.',
    severity: 'critical',
  },

  {
    id: 'cyb_005',
    name: 'Certificación Elite de Ciberseguridad',
    description: 'Nuevo estándar global abre mercados exclusivos.',
    category: 'Ciberseguridad',
    baseProbability: 0.11,
    activationConditions: [
      { variable: 'avgCybersecurity', operator: '>', value: 60, probabilityBoost: 0.35 },
    ],
    consequences: {
      global: { economicStability: +4 },
      company: { appliesTo: 'highCyber', internationalAccess: +10, reputation: +8, capital: 100000 },
      cascade: [],
    },
    newsHeadline: 'CYBERSTAR GOLD: ACCESO A MERCADOS ULTRASEGUROS',
    newsBody: 'La certificación CyberStar Gold es adoptada como requisito por 40 países para contratos gubernamentales y corporativos. Las empresas con ciberseguridad superior a 60 obtienen el sello automáticamente. La seguridad se convierte en ventaja competitiva de primer nivel.',
    severity: 'low',
  },

  {
    id: 'cyb_006',
    name: 'Colapso de Infraestructura Financiera Digital',
    description: 'Un ataque compromete el sistema financiero corporativo global.',
    category: 'Ciberseguridad',
    baseProbability: 0.05,
    activationConditions: [
      { variable: 'avgCybersecurity', operator: '<', value: 25, probabilityBoost: 0.55 },
      { variable: 'economicStability', operator: '<', value: 40, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: -15, consumerConfidence: -15 },
      company: { appliesTo: 'all', capital: -200000 },
      cascade: ['financialSystemCollapse'],
    },
    newsHeadline: '🚨 COLAPSO FINANCIERO DIGITAL: EMERGENCIA TOTAL',
    newsBody: 'El sistema financiero digital de Neo-Terra ha sido comprometido. Transacciones congeladas. Capital inaccesible. Pánico en mercados. El peor escenario cibernético se materializa. Solo las corporaciones con sistemas financieros redundantes sobreviven.',
    severity: 'critical',
  },

  {
    id: 'cyb_007',
    name: 'IA de Defensa Cibernética Colectiva',
    description: 'Sistema de IA protege a corporaciones de ataques futuros.',
    category: 'Ciberseguridad',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'avgCybersecurity', operator: '>', value: 55, probabilityBoost: 0.35 },
      { variable: 'avgRD', operator: '>', value: 100000, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { economicStability: +5 },
      company: { appliesTo: 'highCyber', cybersecurity: +10, reputation: +5 },
      cascade: [],
    },
    newsHeadline: 'NEOGUARD IA: DEFENSA CIBERNÉTICA COLECTIVA',
    newsBody: 'El consorcio NeoGuard lanza el primer sistema de defensa cibernética basado en IA colectiva. Las corporaciones con alta inversión en ciberseguridad acceden al sistema y se vuelven prácticamente inmunes a ataques. La ciberseguridad en red supera a la individual.',
    severity: 'low',
  },

  {
    id: 'cyb_008',
    name: 'Regulación Global de Privacidad de Datos',
    description: 'Ley global de privacidad impone nuevos costos de compliance.',
    category: 'Ciberseguridad',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'internationalRegulation', operator: '>', value: 60, probabilityBoost: 0.30 },
    ],
    consequences: {
      global: { internationalRegulation: +5, consumerConfidence: +5 },
      company: { appliesTo: 'all', capital: -60000, regulatorRelations: +3 },
      cascade: [],
    },
    newsHeadline: 'GDPR-2045: NUEVA LEY GLOBAL DE PRIVACIDAD',
    newsBody: 'El Reglamento Global de Protección de Datos 2045 entra en vigor. Todas las corporaciones de Neo-Terra deben cumplir estándares de privacidad de datos sin precedentes. El costo de compliance es de $60,000, pero las multas por incumplimiento alcanzan $500,000.',
    severity: 'medium',
  },

  {
    id: 'cyb_009',
    name: 'Alianza de Ciberdefensa Corporativa',
    description: 'Corporaciones forman alianza defensiva contra amenazas comunes.',
    category: 'Ciberseguridad',
    baseProbability: 0.10,
    activationConditions: [
      { variable: 'avgCybersecurity', operator: '>', value: 50, probabilityBoost: 0.30 },
    ],
    consequences: {
      global: { economicStability: +3 },
      company: { appliesTo: 'highCyber', cybersecurity: +8, internationalAccess: +5 },
      cascade: [],
    },
    newsHeadline: 'CYBERALLIANCE: CORPORACIONES UNEN DEFENSA',
    newsBody: 'Las corporaciones con mayor inversión en ciberseguridad forman la primera alianza de defensa cibernética corporativa. El intercambio de inteligencia de amenazas en tiempo real hace a sus miembros virtualmente invulnerables. Ser excluido significa estar solo ante el ataque.',
    severity: 'low',
  },

  {
    id: 'cyb_010',
    name: 'Hack al Sistema de Comercio Global',
    description: 'Ataque destruye la plataforma de comercio internacional.',
    category: 'Ciberseguridad',
    baseProbability: 0.06,
    activationConditions: [
      { variable: 'avgCybersecurity', operator: '<', value: 35, probabilityBoost: 0.45 },
      { variable: 'globalInnovation', operator: '>', value: 55, probabilityBoost: 0.15 },
    ],
    consequences: {
      global: { economicStability: -10, consumerConfidence: -8, globalInnovation: -3 },
      company: { appliesTo: 'all', capital: -100000, internationalAccess: -8 },
      cascade: [],
    },
    newsHeadline: 'HACKEO SISTEMA COMERCIO GLOBAL: MERCADOS CAEN',
    newsBody: 'El sistema de comercio internacional de Neo-Terra es comprometido en un ataque de 48 horas. Transacciones internacionales congeladas. Contratos incumplidos. Las corporaciones con sistemas de backup propios minimizan el daño. Las demás sufren pérdidas totales.',
    severity: 'critical',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ⭐ EVENTOS ESPECIALES DE NARRATIVA (5 eventos)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'spe_001',
    name: 'El Gran Despertar Corporativo',
    description: 'Una corporación logra ser la primera en alcanzar Net Zero real.',
    category: 'Ambiental',
    baseProbability: 0.05,
    activationConditions: [
      { variable: 'pctPremiumSupplier', operator: '>', value: 0.7, probabilityBoost: 0.50 },
      { variable: 'sustainabilityIndex', operator: '>', value: 65, probabilityBoost: 0.20 },
    ],
    consequences: {
      global: { sustainabilityIndex: +10, consumerConfidence: +8 },
      company: { appliesTo: 'highESG', reputation: +20, marketShare: +4, capital: 300000 },
      cascade: [],
    },
    newsHeadline: '🌱 HISTORIA: PRIMERA CORPORACIÓN NET ZERO VERIFICADO',
    newsBody: 'Neo-Terra celebra un momento histórico. Por primera vez en la historia del capitalismo, una corporación logra verificación independiente de huella de carbono cero real en toda su cadena de suministro. El mercado recompensa este logro con una oleada de consumidores leales.',
    severity: 'low',
  },

  {
    id: 'spe_002',
    name: 'La Caída del Titán',
    description: 'La corporación más grande colapsa por acumulación de riesgos ocultos.',
    category: 'Económica',
    baseProbability: 0.04,
    activationConditions: [
      { variable: 'avgHiddenLaborRisk', operator: '>', value: 70, probabilityBoost: 0.45 },
      { variable: 'avgHiddenCorruption', operator: '>', value: 65, probabilityBoost: 0.30 },
    ],
    consequences: {
      global: { economicStability: -12, consumerConfidence: -10, internationalRegulation: +15 },
      company: { appliesTo: 'cheapSupplierUsers', capital: -300000, reputation: -20, marketShare: -4 },
      cascade: ['marketPanic'],
    },
    newsHeadline: '💀 MEGA-COLAPSO: EL TITÁN HA CAÍDO',
    newsBody: 'La que fuera la mayor corporación de Neo-Terra declara quiebra total. Los años de prácticas ocultas se derrumban de golpe: explotación laboral, corrupción sistémica y deuda de emisiones. Su colapso sacude los mercados y destruye la confianza global en el modelo corporativo tradicional.',
    severity: 'critical',
  },

  {
    id: 'spe_003',
    name: 'Convergencia Tecnológica Universal',
    description: 'Neo-Terra alcanza un umbral histórico de innovación colectiva.',
    category: 'Tecnológica',
    baseProbability: 0.05,
    activationConditions: [
      { variable: 'globalInnovation', operator: '>', value: 75, probabilityBoost: 0.55 },
      { variable: 'avgTechLevel', operator: '>', value: 65, probabilityBoost: 0.30 },
    ],
    consequences: {
      global: { globalInnovation: +15, economicStability: +10, socialInequality: +5 },
      company: { appliesTo: 'all', techLevel: +10, innovation: +8 },
      cascade: [],
    },
    newsHeadline: '⚡ SINGULARIDAD TECNOLÓGICA CORPORATIVA 2045',
    newsBody: 'Neo-Terra alcanza el umbral histórico de convergencia tecnológica. El nivel de innovación colectiva supera el punto donde la tecnología se autoalimenta. Todas las corporaciones se benefician, pero las líderes en tech capturan una ventaja compuesta exponencial.',
    severity: 'medium',
  },

  {
    id: 'spe_004',
    name: 'El Mundo Arde: Punto de No Retorno',
    description: 'La temperatura supera 3°C y se activa retroalimentación climática.',
    category: 'Ambiental',
    baseProbability: 0.03,
    activationConditions: [
      { variable: 'globalTemperature', operator: '>', value: 3.0, probabilityBoost: 0.70 },
    ],
    consequences: {
      global: { sustainabilityIndex: -25, economicStability: -20, consumerConfidence: -20, socialInequality: +15 },
      company: { appliesTo: 'all', capital: -300000, internationalAccess: -15 },
      cascade: ['climateCollapse'],
    },
    newsHeadline: '🔥 PUNTO DE NO RETORNO: NEO-TERRA EN EMERGENCIA',
    newsBody: 'Los científicos confirman que Neo-Terra ha cruzado el punto de no retorno climático. La temperatura global supera los 3°C. Los sistemas climáticos entran en retroalimentación positiva. La economía global colapsa. Las corporaciones que ignoraron la crisis ambiental ahora pagan el precio final.',
    severity: 'critical',
  },

  {
    id: 'spe_005',
    name: 'Neo-Terra Sostenible: Victoria Colectiva',
    description: 'La acción colectiva logra un índice de sostenibilidad histórico.',
    category: 'Social',
    baseProbability: 0.04,
    activationConditions: [
      { variable: 'sustainabilityIndex', operator: '>', value: 75, probabilityBoost: 0.60 },
      { variable: 'pctPremiumSupplier', operator: '>', value: 0.6, probabilityBoost: 0.30 },
    ],
    consequences: {
      global: { economicStability: +12, consumerConfidence: +15, socialInequality: -10, sustainabilityIndex: +10 },
      company: { appliesTo: 'highESG', capital: 400000, marketShare: +5, reputation: +20 },
      cascade: [],
    },
    newsHeadline: '🌍 VICTORIA: NEO-TERRA ALCANZA SOSTENIBILIDAD GLOBAL',
    newsBody: 'Por primera vez en la historia, un conjunto de corporaciones logra llevar el índice de sostenibilidad global a territorio positivo. Neo-Terra demuestra que el capitalismo consciente no solo es posible, sino también el modelo más rentable a largo plazo. Un nuevo capítulo comienza.',
    severity: 'low',
  },

];

module.exports = EVENT_CATALOG;
