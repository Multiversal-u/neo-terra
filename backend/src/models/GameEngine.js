'use strict';
const { v4: uuidv4 } = require('uuid');
const {
  GAME_CONSTANTS,
  COMPANY_INITIAL_STATE,
  GLOBAL_WORLD_STATE,
  SUPPLIERS,
  INVESTMENT_BUDGET_PER_ROUND,
  ROUND_SCENARIOS,
  FINAL_SCENARIO,
  getScenarioForRound,
  ARCHETYPE_PROFILES,
  EMERGENCY_EVENTS,
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
    this.state        = 'lobby'; // lobby|playing|roundActive|calculating|finished|emergency
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

    // Sistema de Emergencias y Crisis Relámpago Imprevistas
    this.activeEmergency = null;
    this.emergencyDecisions = new Map(); // playerId → optionId

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
    if (this.state === 'finished') return this.endGame();
    if (this.currentRound >= this.maxRounds) {
      return this.endGame();
    }

    // Si la ronda actual estaba activa y hubo decisiones, auto-evaluar antes de avanzar
    if (this.currentRound > 0 && this.state === 'roundActive' && this.roundDecisions.size > 0) {
      this.calculateRoundResults();
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

  // ─── Flash Emergency & Crisis System ──────────────────────────────────────

  triggerEmergency(emergencyId = null) {
    let crisis = null;
    if (emergencyId) {
      crisis = EMERGENCY_EVENTS.find(e => e.id === emergencyId);
    }
    if (!crisis) {
      // Pick a random emergency
      const idx = Math.floor(Math.random() * EMERGENCY_EVENTS.length);
      crisis = EMERGENCY_EVENTS[idx];
    }

    this.activeEmergency = {
      ...crisis,
      triggeredAt: Date.now(),
    };
    this.emergencyDecisions.clear();
    // Limpiar feedback previo en todas las empresas para que la nueva crisis no aparezca contestada
    for (const comp of this.companies.values()) {
      comp.lastEmergencyFeedback = null;
    }

    // Broadcast breaking news
    this.newsHistory.push({
      headline: crisis.title,
      body: crisis.context,
      timestamp: Date.now(),
      impact: 'NEGATIVE',
    });

    return this.activeEmergency;
  }

  submitEmergencyDecision(playerId, optionId) {
    if (!this.activeEmergency) throw new Error('No hay una emergencia activa');
    const company = this.companies.get(playerId);
    if (!company) throw new Error('Empresa no encontrada');

    const opt = (this.activeEmergency.options || []).find(o => o.id === optionId);
    if (!opt) throw new Error('Opción de crisis inválida');

    // Apply immediate consequences
    if (opt.consequences) {
      for (const [key, val] of Object.entries(opt.consequences)) {
        if (key === 'capital') {
          company.capital += val;
        } else if (company[key] !== undefined) {
          company[key] = this._clamp(company[key] + val, 0, 100);
        }
      }
      this._clampCompany(company);
      this.companies.set(playerId, company);
    }

    company.lastEmergencyFeedback = {
      emergencyId: this.activeEmergency.id,
      crisisTitle: this.activeEmergency.title,
      chosenOption: opt.title,
      feedback: opt.feedback,
      consequences: opt.consequences,
    };

    this.emergencyDecisions.set(playerId, optionId);

    return {
      success: true,
      feedback: opt.feedback,
      decidedCount: this.emergencyDecisions.size,
      totalCount: this.companies.size,
    };
  }

  resolveEmergency() {
    const summary = {
      crisisTitle: this.activeEmergency?.title,
      totalResponded: this.emergencyDecisions.size,
      totalPlayers: this.companies.size,
    };
    this.activeEmergency = null;
    this.emergencyDecisions.clear();
    for (const comp of this.companies.values()) {
      comp.lastEmergencyFeedback = null;
    }
    return summary;
  }

  // ─── Decisions ────────────────────────────────────────────────────────────

  submitDecision(playerId, decision) {
    if (this.state !== 'roundActive' && this.state !== 'playing') throw new Error('Round is not active');
    if (!this.companies.has(playerId)) throw new Error('Player not in game');
    if (this.roundDecisions.has(playerId)) throw new Error('Already submitted');

    const validatedDecision = this._validateDecision(decision);
    this.roundDecisions.set(playerId, validatedDecision);

    const company = this.companies.get(playerId);
    const roundScenario = getScenarioForRound(this.currentRound, this.maxRounds);
    if (company) {
      company.lastNarrative = this._buildNarrativeForCompany(company, company, validatedDecision, roundScenario);
    }

    const allIn = this.checkAllDecided();
    return {
      accepted: true,
      allDecided: allIn,
      decidedCount: this.roundDecisions.size,
      totalCount: this.companies.size,
      narrative: company?.lastNarrative,
    };
  }

  checkAllDecided() {
    return this.roundDecisions.size >= this.companies.size;
  }

  _validateDecision(dec) {
    // Soporte para el formato simplificado de dilema narrativo
    if (dec.dilemmaChoice) {
      const choice = ['A', 'B', 'C'].includes(dec.dilemmaChoice) ? dec.dilemmaChoice : 'B';
      const focus = dec.investmentFocus || 'tech';

      // Distribución inteligente del presupuesto de $500,000 según el enfoque elegido
      let investment = { rd: 80000, social: 80000, environmental: 80000, cybersecurity: 80000, marketing: 90000, logistics: 90000 };
      if (focus === 'tech') {
        investment = { rd: 250000, cybersecurity: 100000, marketing: 50000, logistics: 50000, social: 25000, environmental: 25000 };
      } else if (focus === 'green') {
        investment = { environmental: 250000, social: 100000, rd: 50000, logistics: 50000, marketing: 25000, cybersecurity: 25000 };
      } else if (focus === 'social') {
        investment = { social: 250000, marketing: 100000, environmental: 50000, rd: 50000, logistics: 25000, cybersecurity: 25000 };
      } else if (focus === 'cyber') {
        investment = { cybersecurity: 250000, rd: 100000, logistics: 50000, marketing: 50000, social: 25000, environmental: 25000 };
      }

      const pricingStrategy = choice === 'A' ? 'aggressive' : choice === 'C' ? 'premium' : 'balanced';

      return {
        supplier: choice,
        dilemmaChoice: choice,
        investmentFocus: focus,
        investment,
        pricingStrategy,
        expansionTarget: dec.expansionTarget || null,
      };
    }

    // Formato clásico retrocompatible
    const suppliers = ['A', 'B', 'C'];
    const strategies = ['aggressive', 'balanced', 'premium'];
    const regions = [null, 'asia', 'europe', 'africa', 'americas'];

    const supplier = suppliers.includes(dec.supplier) ? dec.supplier : 'B';
    const pricingStrategy = strategies.includes(dec.pricingStrategy) ? dec.pricingStrategy : 'balanced';
    const expansionTarget = regions.includes(dec.expansionTarget) ? dec.expansionTarget : null;

    const investment = {
      rd: Math.max(0, Math.round(dec.investment?.rd || 80000)),
      social: Math.max(0, Math.round(dec.investment?.social || 80000)),
      environmental: Math.max(0, Math.round(dec.investment?.environmental || 80000)),
      cybersecurity: Math.max(0, Math.round(dec.investment?.cybersecurity || 80000)),
      marketing: Math.max(0, Math.round(dec.investment?.marketing || 90000)),
      logistics: Math.max(0, Math.round(dec.investment?.logistics || 90000)),
    };

    return {
      supplier,
      dilemmaChoice: supplier,
      investmentFocus: 'balanced',
      investment,
      pricingStrategy,
      expansionTarget,
    };
  }

  // ─── Round Calculation ────────────────────────────────────────────────────

  calculateRoundResults() {
    this.state = 'calculating';
    const roundScenario = getScenarioForRound(this.currentRound, this.maxRounds);

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

      // 4. Apply direct option effects from the scenario & evaluate conditional risks
      const choice = decision.dilemmaChoice || decision.supplier || 'B';
      const chosenOpt = (roundScenario?.options || []).find(o => o.id === choice);
      let triggeredRisk = false;
      if (chosenOpt) {
        let appliedEffects = { ...(chosenOpt.effects || {}) };
        if (
          chosenOpt.risk &&
          company[chosenOpt.risk.variable] !== undefined &&
          company[chosenOpt.risk.variable] < chosenOpt.risk.below
        ) {
          appliedEffects = { ...appliedEffects, ...(chosenOpt.risk.effects || {}) };
          triggeredRisk = true;
        }
        for (const [k, v] of Object.entries(appliedEffects)) {
          if (k === 'capital') {
            company.capital += v;
          } else if (company[k] !== undefined) {
            company[k] = this._clamp(company[k] + v, 0, 100);
          }
        }
      }
      company._lastTriggeredRisk = triggeredRisk;

      // 5. Calculate and add revenue
      const revenue = this._calculateRevenue(company, this.globalWorld, decision.pricingStrategy);
      company.capital += revenue;

      // 6. Record decision history
      company.supplierHistory.push(decision.supplier);
      company.decisionHistory.push({
        round: this.currentRound,
        ...decision,
        revenue,
        triggeredRisk,
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

    this.state = 'roundResults';

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
    const roundScenario = getScenarioForRound(this.currentRound, this.maxRounds);

    for (const [id, company] of this.companies) {
      const before = snapshotBefore.get(id);
      if (!before) continue;

      const decision = this.roundDecisions.get(id) || {};
      const narrative = this._buildNarrativeForCompany(company, before, decision, roundScenario);

      // Guardar en la empresa para que el celular del alumno lo lea de inmediato
      company.lastNarrative = narrative;

      summaries.push({
        companyId: id,
        companyName: company.name,
        narrative,
        deltas: {
          capital: company.capital - before.capital,
          reputation: company.reputation - before.reputation,
          esgIndex: company.esgIndex - before.esgIndex,
          marketShare: Number((company.marketShare - before.marketShare).toFixed(2)),
          environmentalFootprint: company.environmentalFootprint - before.environmentalFootprint,
          techLevel: company.techLevel - before.techLevel,
          cybersecurity: company.cybersecurity - before.cybersecurity,
          innovation: company.innovation - before.innovation,
        }
      });
    }
    return summaries;
  }

  _buildNarrativeForCompany(company, before, decision, roundScenario) {
    const round = this.currentRound;
    const choice = decision.dilemmaChoice || decision.supplier || 'B';
    const opt = (roundScenario?.options || []).find(o => o.id === choice);

    let story = '';
    let cascade = [];

    // Si se activó un riesgo condicional por decisiones previas
    const triggeredRisk = company._lastTriggeredRisk && opt?.risk;
    if (triggeredRisk) {
      story = opt.risk.story || opt.story || 'Tu directiva provocó consecuencias adversas debido a tus decisiones previas.';
      cascade = opt.risk.cascade || opt.cascade || [];
    } else if (opt?.story) {
      story = opt.story;
      cascade = opt.cascade || [];
    } else {
      story = `Tu corporación implementó la directiva ${opt?.name || choice} durante el ciclo ${round}. El mercado asimiló el impacto y los reguladores continúan supervisando las operaciones.`;
      cascade = [
        `Directiva estratégica implementada: ${opt?.name || choice}`,
        'Reacción de mercados y competidores en Neo-Terra',
        'Ajuste en la demanda e impacto reputacional consolidado',
      ];
    }

    return {
      round,
      year: roundScenario?.year || (2045 + (round - 1) * 2),
      scenarioTitle: roundScenario?.title || `Ciclo ${round}`,
      theme: roundScenario?.theme || 'Gobernanza',
      learningGoal: roundScenario?.learningGoal || 'Evaluación de impacto sistémico',
      chosenOptionName: opt?.name || `Opción ${choice}`,
      badge: opt?.badge,
      badgeColor: opt?.badgeColor,
      story,
      cascade,
      triggeredRisk: !!triggeredRisk,
      riskLabel: triggeredRisk ? opt.risk.label : null,
    };
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
    // Mercado global total de Neo-Terra accesible anualmente
    const TOTAL_ADDRESSABLE_MARKET = 6500000;

    const priceMultipliers = {
      aggressive: 1.25,
      balanced:   1.00,
      premium:    0.85,
    };

    const worldFactor = (world.consumerConfidence / 100) *
                        (1 - world.internationalRegulation / 200) *
                        (world.economicStability / 100 + 0.3);

    // Ingreso base derivado de la cuota de mercado
    let revenue = (company.marketShare / 100) * TOTAL_ADDRESSABLE_MARKET;
    revenue *= (priceMultipliers[pricingStrategy] || 1.0);
    revenue *= Math.max(0.45, worldFactor);

    // Bono reputacional: fidelidad y confianza de clientes
    if (company.reputation >= 70) revenue *= 1.20;
    else if (company.reputation <= 30) revenue *= 0.70;

    // Tech premium: en 2045, mayor nivel tecnológico genera productos de mayor margen
    revenue *= (1 + company.techLevel / 200);

    // Acceso a mercados internacionales
    if (company.internationalAccess >= 55) revenue *= 1.15;

    // Nicho ético: consumidores con alto poder adquisitivo pagan sobreprecio por ESG alto
    if (company.esgIndex >= 65 && pricingStrategy === 'premium') revenue *= 1.25;

    return Math.max(60000, Math.round(revenue));
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

    // 1. Quiebra técnica o colapso ético
    if (capital <= 300000 || reputation <= 20)
      return 'EmpresaEnCrisis';

    // 2. Modelo de triple impacto positivo (Líder Sustentable)
    if (esgIndex >= 70 && environmentalFootprint <= 35 && regulatorRelations >= 65)
      return 'LiderSustentable';

    // 3. Alta tecnología con responsabilidad bioética
    if (innovation >= 65 && esgIndex >= 60 && techLevel >= 55)
      return 'InnovadorResponsable';

    // 4. Cadena limpia y certificada (Modelo ESG)
    if (esgIndex >= 70 && (premiumRounds / totalRounds) >= 0.35)
      return 'ModeloESG';

    // 5. Alta tecnología y disrupción de mercado
    if (marketShare >= 14 && techLevel >= 65)
      return 'GiganteDisruptivo';

    // 6. Potencia pura en software, IA y ciberseguridad
    if (techLevel >= 68 && innovation >= 60)
      return 'PotenciaTecnologica';

    // 7. Maximización agresiva de capital financiero
    if (capital >= 2200000 && marketShare >= 12)
      return 'ImperioCoporativo';

    // 8. Modelo contaminante y extractivo
    if ((cheapRounds / totalRounds) >= 0.45 && environmentalFootprint >= 60)
      return 'CorporacionExtractiva';

    // Por defecto: balance general resiliente
    return 'SobrevivienteMercado';
  }

  calculateCompositeScore(company) {
    const capital = company.capital || 0;
    const esg = company.esgIndex || 0;
    const rep = company.reputation || 0;
    const share = company.marketShare || 0;
    const tech = company.techLevel || 0;
    const footprint = company.environmentalFootprint || 0;

    // 1. Dimensión Financiera (35%): Cada $100k aporta 200 pts
    let score = (capital / 500);

    // 2. Dimensión Sostenibilidad ESG (25%): 0-100 -> 0-2,500 pts
    score += (esg * 25);

    // 3. Dimensión Reputacional y Ética (20%): 0-100 -> 0-2,000 pts
    score += (rep * 20);

    // 4. Dimensión de Competitividad de Mercado (20%): cuota + tech
    score += (share * 100) + (tech * 10);

    // 5. Penalizaciones Sistémicas del Mundo 2045:
    if (rep < 20) score -= 1500; // Colapso reputacional
    if (footprint > 75) score -= 1000; // Pasivo ambiental crítico
    if (capital < 200000) score -= 1500; // Quiebra técnica

    return Math.round(score);
  }

  endGame() {
    this.state = 'finished';

    const rankings = Array.from(this.companies.values()).map(company => {
      company.archetype = this.classifyArchetype(company);
      company.archetypeProfile = ARCHETYPE_PROFILES[company.archetype] || ARCHETYPE_PROFILES.SobrevivienteMercado;
      company.compositeScore = this.calculateCompositeScore(company);
      return this._sanitizeCompanyForPlayer(company);
    });

    // Ordenar por puntaje global sistémico
    rankings.sort((a, b) => (b.compositeScore || 0) - (a.compositeScore || 0));

    // Añadir rank posicional 1..N
    rankings.forEach((r, idx) => {
      r.finalRank = idx + 1;
    });

    this.finalRankings = rankings;

    return {
      state: 'finished',
      rankings,
      archetypeProfiles: ARCHETYPE_PROFILES,
      finalWorldState: this.globalWorld,
      roundHistory: this.roundHistory,
      newsHistory: this.newsHistory,
    };
  }

  // ─── State Getters ────────────────────────────────────────────────────────

  getPublicGameState() {
    const roundScenario = getScenarioForRound(this.currentRound, this.maxRounds);
    const publicCompanies = Array.from(this.companies.values()).map(c => {
      const arch = c.archetype || (this.state === 'finished' ? this.classifyArchetype(c) : null);
      const profile = arch ? (ARCHETYPE_PROFILES[arch] || ARCHETYPE_PROFILES.SobrevivienteMercado) : null;
      return {
        id: c.id,
        name: c.name,
        playerName: c.playerName,
        marketShare: c.marketShare,
        reputation: c.reputation,
        esgIndex: c.esgIndex,
        capital: c.capital,
        techLevel: c.techLevel,
        environmentalFootprint: c.environmentalFootprint,
        archetype: arch,
        archetypeProfile: profile,
        compositeScore: this.calculateCompositeScore(c),
        hasDecided: this.roundDecisions.has(c.id),
      };
    });

    return {
      gameId: this.gameId,
      state: this.state,
      currentRound: this.currentRound,
      maxRounds: this.maxRounds,
      currentScenario: roundScenario,
      globalWorld: this.globalWorld,
      companies: publicCompanies,
      rankings: this.finalRankings || (this.state === 'finished' ? publicCompanies : []),
      archetypeProfiles: ARCHETYPE_PROFILES,
      decidedCount: this.roundDecisions.size,
      totalPlayers: this.companies.size,
      activeEmergency: this.activeEmergency,
      emergencyDecidedCount: this.emergencyDecisions.size,
      recentNews: this.newsHistory.slice(-5),
      recentEvents: this.events.slice(-5).map(e => ({
        id: e.id, name: e.name, category: e.category, severity: e.severity
      })),
    };
  }

  getCompanyState(playerId) {
    const company = this.companies.get(playerId);
    if (!company) return null;
    const sanitized = this._sanitizeCompanyForPlayer(company);
    const arch = company.archetype || (this.state === 'finished' ? this.classifyArchetype(company) : null);
    sanitized.archetype = arch;
    sanitized.archetypeProfile = arch ? (ARCHETYPE_PROFILES[arch] || ARCHETYPE_PROFILES.SobrevivienteMercado) : null;
    sanitized.compositeScore = this.calculateCompositeScore(company);

    if (this.state === 'finished' && this.finalRankings) {
      const idx = this.finalRankings.findIndex(r => r.id === playerId);
      sanitized.finalRank = idx >= 0 ? idx + 1 : null;
      sanitized.totalParticipants = this.finalRankings.length;
    }
    return sanitized;
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
