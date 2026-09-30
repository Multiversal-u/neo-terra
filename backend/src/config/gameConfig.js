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

module.exports = {
  GAME_CONSTANTS,
  INVESTMENT_BUDGET_PER_ROUND,
  COMPANY_INITIAL_STATE,
  GLOBAL_WORLD_STATE,
  SUPPLIERS,
  ARCHETYPE_THRESHOLDS,
};
