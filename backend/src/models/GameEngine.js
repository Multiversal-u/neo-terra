'use strict';
const { v4: uuidv4 } = require('uuid');
const {
  GAME_CONSTANTS,
  COMPANY_INITIAL_STATE,
  GLOBAL_WORLD_STATE,
  SUPPLIERS,
  INVESTMENT_BUDGET_PER_ROUND,
} = require('../config/gameConfig');
const WorldEngine = require('./WorldEngine');

/**
 * GameEngine — Motor principal del juego NEO-TERRA
 *
 * Gestiona el ciclo de vida completo de una sesión:
 * lobby → jugando → ronda activa → calculando → siguiente ronda → fin
 */
class GameEngine {
  constructor(gameId, settings = {}) {
    this.gameId       = gameId;
    this.hostId       = null;
    this.state        = 'lobby'; // lobby|playing|roundActive|calculating|finished
    this.currentRound = 0;
    this.maxRounds    = settings.maxRounds || 8;
    this.roundDuration = settings.roundDuration || GAME_CONSTANTS.DECISION_TIMEOUT_SECONDS;

    // Core data
    this.companies     = new Map();  // playerId → companyState
    this.globalWorld   = { ...GLOBAL_WORLD_STATE };
    this.roundDecisions = new Map(); // playerId → decision
    this.events        = [];
    this.newsHistory   = [];
    this.roundHistory  = [];

    this.worldEngine = new WorldEngine();
    this.createdAt   = Date.now();
    this.roundStartedAt = null;
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  initGame(hostId, settings = {}) {
    this.hostId = hostId;
    if (settings.maxRounds) this.maxRounds = Math.min(
      Math.max(settings.maxRounds, GAME_CONSTANTS.ROUNDS_MIN),
      GAME_CONSTANTS.ROUNDS_MAX
    );
    if (settings.roundDuration) this.roundDuration = settings.roundDuration;
    return this;
  }

  addCompany(playerId, companyName, playerName) {
    if (this.state === 'finished') throw new Error('La simulación ya ha finalizado');
    if (this.companies.size >= GAME_CONSTANTS.MAX_PLAYERS) {
      throw new Error(`Límite máximo de empresas (${GAME_CONSTANTS.MAX_PLAYERS}) alcanzado`);
    }

    const company = {
      id: playerId,
      gameId: this.gameId,
      name: companyName,
      playerName: playerName || companyName,
      ...JSON.parse(JSON.stringify(COMPANY_INITIAL_STATE)),
      supplierHistory: [],
      decisionHistory: [],
      variableHistory: [],
      _hiddenLaborRisk: 0,
      _hiddenCorruptionExposure: 0,
      _hiddenEmissionDebt: 0,
    };

    this.companies.set(playerId, company);
    return this._sanitizeCompanyForPlayer(company);
  }

  removeCompany(playerId) {
    this.companies.delete(playerId);
    this.roundDecisions.delete(playerId);
  }

  startGame() {
    this.state = 'playing';
    this.startRound(); // Immediately launch Round 1
    return this.getPublicGameState();
  }

  startRound() {
    if (this.state === 'finished') return null;
    if (this.currentRound >= this.maxRounds) {
      return this.endGame();
    }

    this.currentRound++;
    this.state = 'roundActive';
    this.roundDecisions.clear();
    this.roundStartedAt = Date.now();

    return {
      currentRound: this.currentRound,
      maxRounds: this.maxRounds,
      state: this.state,
      roundDuration: this.roundDuration,
      supplierOptions: this._getSupplierPublicInfo(),
      budget: INVESTMENT_BUDGET_PER_ROUND,
    };
  }

  // ─── Decisions ────────────────────────────────────────────────────────────

  submitDecision(playerId, decision) {
    if (this.state !== 'roundActive') throw new Error('Round is not active');
    if (!this.companies.has(playerId)) throw new Error('Player not in game');
    if (this.roundDecisions.has(playerId)) throw new Error('Already submitted');

    const validatedDecision = this._validateDecision(decision);
    this.roundDecisions.set(playerId, validatedDecision);

    const allIn = this.checkAllDecided();
    return {
      accepted: true,
      allDecided: allIn,
      decidedCount: this.roundDecisions.size,
      totalCount: this.companies.size,
    };
  }

  checkAllDecided() {
    return this.roundDecisions.size >= this.companies.size;
  }

  _validateDecision(dec) {
    const suppliers = ['A', 'B', 'C'];
    const strategies = ['aggressive', 'balanced', 'premium'];
    const regions = [null, 'asia', 'europe', 'africa', 'americas'];

    if (!suppliers.includes(dec.supplier)) throw new Error('Invalid supplier');
    if (!strategies.includes(dec.pricingStrategy)) throw new Error('Invalid pricing strategy');
    if (!regions.includes(dec.expansionTarget)) throw new Error('Invalid expansion target');

    const investment = {
      rd: Math.max(0, Math.round(dec.investment?.rd || 0)),
      social: Math.max(0, Math.round(dec.investment?.social || 0)),
      environmental: Math.max(0, Math.round(dec.investment?.environmental || 0)),
      cybersecurity: Math.max(0, Math.round(dec.investment?.cybersecurity || 0)),
      marketing: Math.max(0, Math.round(dec.investment?.marketing || 0)),
      logistics: Math.max(0, Math.round(dec.investment?.logistics || 0)),
    };

    return {
      supplier: dec.supplier,
      investment,
      pricingStrategy: dec.pricingStrategy,
      expansionTarget: dec.expansionTarget || null,
    };
  }

  // ─── Round Calculation ────────────────────────────────────────────────────

  calculateRoundResults() {
    this.state = 'calculating';

    // Snapshot state before this round
    const snapshotBefore = new Map();
    for (const [id, c] of this.companies) {
      snapshotBefore.set(id, { ...c });
    }

    // Apply each player's decisions to their company
    for (const [playerId, decision] of this.roundDecisions) {
      const company = this.companies.get(playerId);
      if (!company) continue;

      // 1. Apply supplier effects
      this._applySupplierEffects(company, decision.supplier);

      // 2. Apply investments
      this._applyInvestmentEffects(company, decision.investment);

      // 3. Apply pricing strategy & expansion
      this._applyPricingStrategy(company, decision.pricingStrategy);
      if (decision.expansionTarget) {
        this._applyExpansion(company, decision.expansionTarget);
      }

      // 4. Calculate and add revenue
      const revenue = this._calculateRevenue(company, this.globalWorld, decision.pricingStrategy);
      company.capital += revenue;

      // 5. Record decision history
      company.supplierHistory.push(decision.supplier);
      company.decisionHistory.push({
        round: this.currentRound,
        ...decision,
        revenue
      });

      // Clamp all 0-100 variables
      this._clampCompany(company);
      this.companies.set(playerId, company);
    }

    // Run WorldEngine analysis (pseudo-AI)
    const allCompanies = Array.from(this.companies.values());
    const allDecisions = Array.from(this.roundDecisions.values());

    const { updatedWorld, triggeredEvents, newsItems, cascadeEffects, patterns, averages } =
      this.worldEngine.analyzeRound(this.globalWorld, allCompanies, allDecisions);

    this.globalWorld = updatedWorld;

    // Apply event consequences to companies
    for (const event of triggeredEvents) {
      this._applyEventToCompanies(event, allDecisions);
    }

    // Record cascade effects
    for (const cascade of cascadeEffects) {
      if (cascade.companyId) {
        const company = this.companies.get(cascade.companyId);
        if (company) {
          for (const [key, delta] of Object.entries(cascade.changes || {})) {
            if (key === 'capital') {
              company.capital += delta;
            } else if (company[key] !== undefined) {
              company[key] = this._clamp(company[key] + delta, 0, 100);
            }
          }
          this._clampCompany(company);
          this.companies.set(cascade.companyId, company);
        }
      }
    }

    // Record variable history for each company
    for (const company of this.companies.values()) {
      company.variableHistory.push({
        round: this.currentRound,
        capital: company.capital,
        reputation: company.reputation,
        esgIndex: company.esgIndex,
        marketShare: company.marketShare,
        environmentalFootprint: company.environmentalFootprint,
        techLevel: company.techLevel,
      });
    }

    // Store events and news
    this.events.push(...triggeredEvents);
    this.newsHistory.push(...newsItems);

    // Build round summary (deltas for UI)
    const companySummaries = this._buildCompanySummaries(snapshotBefore);

    // Store round history
    this.roundHistory.push({
      round: this.currentRound,
      globalWorld: { ...this.globalWorld },
      events: triggeredEvents.map(e => ({ id: e.id, name: e.name, category: e.category })),
      newsItems,
      averages,
      patterns,
    });

    this.state = 'playing';

    return {
      round: this.currentRound,
      updatedWorld: this.globalWorld,
      triggeredEvents,
      newsItems,
      cascadeEffects,
      companySummaries,
      patterns,
      averages,
    };
  }

  _buildCompanySummaries(snapshotBefore) {
    const summaries = [];
    for (const [id, company] of this.companies) {
      const before = snapshotBefore.get(id);
      if (!before) continue;
      summaries.push({
        companyId: id,
        companyName: company.name,
        deltas: {
          capital: company.capital - before.capital,
          reputation: company.reputation - before.reputation,
          esgIndex: company.esgIndex - before.esgIndex,
          marketShare: company.marketShare - before.marketShare,
          environmentalFootprint: company.environmentalFootprint - before.environmentalFootprint,
          techLevel: company.techLevel - before.techLevel,
          cybersecurity: company.cybersecurity - before.cybersecurity,
          innovation: company.innovation - before.innovation,
        }
      });
    }
    return summaries;
  }

  // ─── Effect Application ───────────────────────────────────────────────────

  _applySupplierEffects(company, supplierId) {
    const supplier = SUPPLIERS.find(s => s.id === supplierId);
    if (!supplier) return;

    const h = supplier.hiddenAttributes;
    const roundFactor = Math.min(1 + (this.currentRound - 1) * 0.15, 2.0);

    // Cost: Supplier A saves money, Supplier C costs more
    const costs = { A: 30000, B: 80000, C: 150000 };
    company.capital -= (costs[supplierId] || 80000);

    // Environmental footprint accumulates silently
    const emissionIncrease = (h.realEmissions / 100) * 12 * roundFactor;
    company.environmentalFootprint = this._clamp(
      company.environmentalFootprint + emissionIncrease, 0, 100
    );

    // Hidden risk accumulation (invisible to player)
    company._hiddenLaborRisk += (h.laborExploitation / 100) * 8;
    company._hiddenCorruptionExposure += (h.corruption / 100) * 6;
    company._hiddenEmissionDebt += (h.realEmissions / 100) * 10;

    // Labor relations: cheap suppliers degrade indirectly
    const laborImpact = -(h.laborExploitation / 100) * 2;
    company.laborRelations = this._clamp(company.laborRelations + laborImpact, 0, 100);

    // Regulator relations: sanction risk
    const regulatorImpact = -(h.sanctionRisk / 100) * 1.5;
    company.regulatorRelations = this._clamp(
      company.regulatorRelations + regulatorImpact, 0, 100
    );

    // ESG: premium supplier improves ESG passively
    if (supplierId === 'C') {
      company.esgIndex = this._clamp(company.esgIndex + 3, 0, 100);
      company.reputation = this._clamp(company.reputation + 1, 0, 100);
    }
  }

  _applyInvestmentEffects(company, investment) {
    const budget = INVESTMENT_BUDGET_PER_ROUND;

    const pct = (amount) => (amount || 0) / budget;

    // R&D → Innovation, Tech Level
    company.innovation  = this._clamp(company.innovation + pct(investment.rd) * 38, 0, 100);
    company.techLevel   = this._clamp(company.techLevel + pct(investment.rd) * 25, 0, 100);

    // Social → Labor, Reputation, ESG
    company.laborRelations = this._clamp(company.laborRelations + pct(investment.social) * 28, 0, 100);
    company.reputation     = this._clamp(company.reputation + pct(investment.social) * 10, 0, 100);
    company.esgIndex       = this._clamp(company.esgIndex + pct(investment.social) * 12, 0, 100);

    // Environmental → Footprint (reduction), ESG, Reputation
    company.environmentalFootprint = this._clamp(
      company.environmentalFootprint - pct(investment.environmental) * 22, 0, 100
    );
    company.esgIndex   = this._clamp(company.esgIndex + pct(investment.environmental) * 18, 0, 100);
    company.reputation = this._clamp(company.reputation + pct(investment.environmental) * 6, 0, 100);

    // Cybersecurity
    company.cybersecurity = this._clamp(
      company.cybersecurity + pct(investment.cybersecurity) * 32, 0, 100
    );

    // Marketing → Consumer Relations, Market Share
    company.consumerRelations = this._clamp(
      company.consumerRelations + pct(investment.marketing) * 22, 0, 100
    );
    company.marketShare = this._clamp(
      company.marketShare + pct(investment.marketing) * 1.5, 0, 100
    );

    // Logistics → Logistic Capacity, International Access
    company.logisticCapacity = this._clamp(
      company.logisticCapacity + pct(investment.logistics) * 28, 0, 100
    );
    company.internationalAccess = this._clamp(
      company.internationalAccess + pct(investment.logistics) * 12, 0, 100
    );

    // Deduct total investment from capital
    const totalSpent = Object.values(investment).reduce((a, b) => a + (b || 0), 0);
    company.capital -= totalSpent;
  }

  _applyPricingStrategy(company, strategy) {
    const effects = {
      aggressive: { reputationDelta: -2,  marketShareDelta:  2.0, consumerDelta: -3 },
      balanced:   { reputationDelta:  0,  marketShareDelta:  0.5, consumerDelta:  0 },
      premium:    { reputationDelta:  3,  marketShareDelta: -0.5, consumerDelta:  2 },
    };
    const e = effects[strategy] || effects.balanced;
    company.reputation      = this._clamp(company.reputation + e.reputationDelta, 0, 100);
    company.marketShare     = this._clamp(company.marketShare + e.marketShareDelta, 0, 100);
    company.consumerRelations = this._clamp(company.consumerRelations + e.consumerDelta, 0, 100);
  }

  _applyExpansion(company, region) {
    company.internationalAccess = this._clamp(company.internationalAccess + 6, 0, 100);
    company.logisticCapacity    = this._clamp(company.logisticCapacity + 2, 0, 100);
    company.capital -= 120000; // Cost of expansion
  }

  _calculateRevenue(company, world, pricingStrategy) {
    const BASE_MARKET = 600000;

    const priceMultipliers = {
      aggressive: 1.35,
      balanced:   1.00,
      premium:    0.75,
    };

    const worldFactor = (world.consumerConfidence / 100) *
                        (1 - world.internationalRegulation / 180) *
                        (world.economicStability / 100 + 0.3);

    let revenue = (company.marketShare / 100) * BASE_MARKET;
    revenue *= (priceMultipliers[pricingStrategy] || 1.0);
    revenue *= worldFactor;

    // Reputation bonus
    if (company.reputation > 70) revenue *= 1.18;
    else if (company.reputation < 25) revenue *= 0.72;

    // Tech premium (2045: tech-savvy companies earn more)
    revenue *= (1 + company.techLevel / 250);

    // International access bonus
    if (company.internationalAccess > 60) revenue *= 1.12;

    // ESG premium market
    if (company.esgIndex > 70 && pricingStrategy === 'premium') revenue *= 1.10;

    return Math.max(0, Math.round(revenue));
  }

  _applyEventToCompanies(event, allDecisions) {
    if (!event.consequences?.company) return;

    const companyEffect = event.consequences.company;
    const decisionList  = allDecisions;

    let decisionIdx = 0;
    for (const company of this.companies.values()) {
      const decision = decisionList[decisionIdx++] || {};

      // Determine if this company is affected
      let affected = false;
      if (companyEffect.appliesTo === 'all') affected = true;
      else if (companyEffect.appliesTo === 'cheapSupplierUsers' && decision.supplier === 'A') affected = true;
      else if (companyEffect.appliesTo === 'premiumSupplierUsers' && decision.supplier === 'C') affected = true;
      else if (companyEffect.appliesTo === 'lowCyber' && company.cybersecurity < 35) affected = true;
      else if (companyEffect.appliesTo === 'highESG' && company.esgIndex > 65) affected = true;
      else if (companyEffect.appliesTo === 'lowESG' && company.esgIndex < 35) affected = true;
      else if (companyEffect.appliesTo === 'topTech' && company.techLevel > 65) affected = true;

      if (!affected) continue;

      if (companyEffect.reputation)          company.reputation = this._clamp(company.reputation + companyEffect.reputation, 0, 100);
      if (companyEffect.esgIndex)            company.esgIndex = this._clamp(company.esgIndex + companyEffect.esgIndex, 0, 100);
      if (companyEffect.capital)             company.capital += companyEffect.capital;
      if (companyEffect.regulatorRelations)  company.regulatorRelations = this._clamp(company.regulatorRelations + companyEffect.regulatorRelations, 0, 100);
      if (companyEffect.consumerRelations)   company.consumerRelations = this._clamp(company.consumerRelations + companyEffect.consumerRelations, 0, 100);
      if (companyEffect.laborRelations)      company.laborRelations = this._clamp(company.laborRelations + companyEffect.laborRelations, 0, 100);
      if (companyEffect.cybersecurity)       company.cybersecurity = this._clamp(company.cybersecurity + companyEffect.cybersecurity, 0, 100);
      if (companyEffect.marketShare)         company.marketShare = this._clamp(company.marketShare + companyEffect.marketShare, 0, 100);
      if (companyEffect.internationalAccess) company.internationalAccess = this._clamp(company.internationalAccess + companyEffect.internationalAccess, 0, 100);

      this._clampCompany(company);
    }
  }

  // ─── Archetypes ───────────────────────────────────────────────────────────

  classifyArchetype(company) {
    const {
      capital, marketShare, reputation, esgIndex, techLevel,
      innovation, environmentalFootprint, cybersecurity,
      regulatorRelations, supplierHistory = [],
    } = company;

    const cheapRounds    = supplierHistory.filter(s => s === 'A').length;
    const premiumRounds  = supplierHistory.filter(s => s === 'C').length;
    const totalRounds    = supplierHistory.length || 1;

    // Rule-based classification (order matters)
    if (capital <= 200000 || reputation <= 15)
      return 'EmpresaEnCrisis';

    if (esgIndex >= 80 && environmentalFootprint <= 20 && regulatorRelations >= 75)
      return 'LiderSustentable';

    if (innovation >= 72 && esgIndex >= 68 && techLevel >= 60)
      return 'InnovadorResponsable';

    if (esgIndex >= 75 && (premiumRounds / totalRounds) >= 0.6)
      return 'ModeloESG';

    if (marketShare >= 22 && techLevel >= 75)
      return 'GiganteDisruptivo';

    if (techLevel >= 78 && innovation >= 72)
      return 'PotenciaTecnologica';

    if (capital >= 4500000 && marketShare >= 15)
      return 'ImperioCoporativo';

    if ((cheapRounds / totalRounds) >= 0.6 && environmentalFootprint >= 70)
      return 'CorporacionExtractiva';

    return 'SobrevivienteMercado'; // Default
  }

  endGame() {
    this.state = 'finished';

    const rankings = Array.from(this.companies.values()).map(company => {
      company.archetype = this.classifyArchetype(company);
      return this._sanitizeCompanyForPlayer(company);
    });

    // Sort by composite score: capital + reputation + esgIndex
    rankings.sort((a, b) => {
      const scoreA = (a.capital / 10000) + (a.reputation * 100) + (a.esgIndex * 80) + (a.marketShare * 200);
      const scoreB = (b.capital / 10000) + (b.reputation * 100) + (b.esgIndex * 80) + (b.marketShare * 200);
      return scoreB - scoreA;
    });

    return {
      state: 'finished',
      rankings,
      finalWorldState: this.globalWorld,
      roundHistory: this.roundHistory,
      newsHistory: this.newsHistory,
    };
  }

  // ─── State Getters ────────────────────────────────────────────────────────

  getPublicGameState() {
    const publicCompanies = Array.from(this.companies.values()).map(c => ({
      id: c.id,
      name: c.name,
      playerName: c.playerName,
      marketShare: c.marketShare,
      reputation: c.reputation,
      esgIndex: c.esgIndex,
      capital: c.capital,
      techLevel: c.techLevel,
      archetype: c.archetype || null,
      hasDecided: this.roundDecisions.has(c.id),
    }));

    return {
      gameId: this.gameId,
      state: this.state,
      currentRound: this.currentRound,
      maxRounds: this.maxRounds,
      globalWorld: this.globalWorld,
      companies: publicCompanies,
      decidedCount: this.roundDecisions.size,
      totalPlayers: this.companies.size,
      recentNews: this.newsHistory.slice(-5),
      recentEvents: this.events.slice(-5).map(e => ({
        id: e.id, name: e.name, category: e.category, severity: e.severity
      })),
    };
  }

  getCompanyState(playerId) {
    const company = this.companies.get(playerId);
    if (!company) return null;
    return this._sanitizeCompanyForPlayer(company);
  }

  getAdminState() {
    return {
      ...this.getPublicGameState(),
      companies: Array.from(this.companies.values()).map(c => ({
        ...this._sanitizeCompanyForPlayer(c),
        hasDecided: this.roundDecisions.has(c.id),
        decisionSummary: this.roundDecisions.has(c.id)
          ? { supplier: this.roundDecisions.get(c.id).supplier }
          : null,
      })),
      roundHistory: this.roundHistory,
    };
  }

  _sanitizeCompanyForPlayer(company) {
    // Remove hidden attributes before sending to player
    const { _hiddenLaborRisk, _hiddenCorruptionExposure, _hiddenEmissionDebt, ...safe } = company;
    return safe;
  }

  _getSupplierPublicInfo() {
    return SUPPLIERS.map(s => ({
      id: s.id,
      name: s.name,
      publicInfo: s.publicInfo,
    }));
  }

  // ─── Utilities ────────────────────────────────────────────────────────────

  _clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  _clampCompany(company) {
    const vars100 = [
      'reputation', 'environmentalFootprint', 'innovation', 'marketShare',
      'consumerRelations', 'regulatorRelations', 'laborRelations',
      'techLevel', 'cybersecurity', 'esgIndex', 'logisticCapacity', 'internationalAccess'
    ];
    for (const key of vars100) {
      if (company[key] !== undefined) {
        company[key] = Math.round(this._clamp(company[key], 0, 100) * 10) / 10;
      }
    }
    // Capital cannot go below 0
    company.capital = Math.max(0, Math.round(company.capital));
    return company;
  }
}

module.exports = GameEngine;
