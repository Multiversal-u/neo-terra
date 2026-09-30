'use strict';
const { v4: uuidv4 } = require('uuid');
const {
  GAME_CONSTANTS,
  COMPANY_INITIAL_STATE,
  GLOBAL_WORLD_STATE,
  SUPPLIERS,
  INVESTMENT_BUDGET_PER_ROUND,
  ROUND_SCENARIOS,
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
    const roundScenario = ROUND_SCENARIOS[this.currentRound] || ROUND_SCENARIOS[1];
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
    const roundScenario = ROUND_SCENARIOS[this.currentRound] || ROUND_SCENARIOS[1];

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

    if (round === 1) {
      if (choice === 'A') {
        story = `Tu decisión de asociarte con GlobalFast Manufacturing redujo tus costos unitarios un 40% y aceleró tus entregas a 48 horas. Sin embargo, periodistas de investigación publicaron un informe satelital que expone descargas de metales pesados y jornadas abusivas en las plantas que fabrican tus componentes. La Comisión Internacional de Ética Comercial abrió un expediente sancionador contra tu corporación.`;
        cascade = [
          'Elección de Manufactura Barata en el Sur Global',
          'Ahorro inicial en costos de producción (+$200,000)',
          'Filtración en medios de comunicación internacionales',
          'Caída de Reputación (-15) e impacto negativo en Índice ESG (-12)'
        ];
      } else if (choice === 'B') {
        story = `Al asociarte con el Consorcio CertifiedGlobal, aseguraste el cumplimiento de normas laborales y la certificación Fair Trade. Aunque tus tiempos de entrega fueron más lentos (7 a 10 días) y tus márgenes moderados, tu empresa se mantuvo completamente blindada ante los escándalos que sacudieron a tus competidores más voraces.`;
        cascade = [
          'Elección de Cadena con Certificaciones ISO',
          'Costos predecibles y estabilidad en la entrega',
          'Inmunidad ante inspecciones regulatorias sorpresa',
          'Consolidación de confianza con clientes institucionales (+8)'
        ];
      } else {
        story = `Tu apuesta por el Ecosistema Autónomo 100% Renovable implicó un desembolso financiero sustancial, pero te posicionó de inmediato como el referente indiscutible de la economía limpia en Neo-Terra. Los fondos de inversión verde catalogaron a tu empresa con calificación ESG Triple A, abriéndote contratos prioritarios en los mercados más exigentes.`;
        cascade = [
          'Inversión en Robótica Solar y Reciclaje de Minerales',
          'Desembolso inicial de capital con márgenes ajustados',
          'Reconocimiento mundial de sostenibilidad (Índice ESG a la cabeza)',
          'Acceso preferencial a licitaciones gubernamentales de alto valor'
        ];
      }
    } else if (round === 2) {
      if (choice === 'A') {
        story = `La automatización agresiva del 70% de tus operaciones disparó tu margen bruto en cifras récord. No obstante, las calles de las ciudades fabriles ardieron en protestas. Sindicatos globales convocaron a un boicot coordinado en redes contra tus productos, y la moral de tu personal técnico cayó en picada.`;
        cascade = [
          'Despido masivo y reemplazo por IA no supervisada',
          'Incremento masivo del margen operativo a corto plazo',
          'Huelgas y protestas en centros de distribución clave',
          'Derrumbe de Relaciones Laborales y advertencia de boicot'
        ];
      } else if (choice === 'B') {
        story = `Tu programa de reconversión híbrida capacitó a cientos de trabajadores para operar junto a la inteligencia artificial. La productividad aumentó un 25% sin generar crisis sociales. Tanto el gobierno como los sindicatos elogiaron tu modelo como un ejemplo de transición justa.`;
        cascade = [
          'Implementación de IA colaborativa con re-capacitación',
          'Inversión educativa para el personal de planta',
          'Paz social y aumento de eficiencia operativa sostenida',
          'Lealtad del consumidor y estabilidad institucional'
        ];
      } else {
        story = `El Pacto Social y la negativa a despedir humanos te convirtieron en el empleador más querido y respetado del sector. Sin embargo, competidores con fábricas 100% robotizadas redujeron precios fuertemente, ejerciendo una presión feroz sobre tu rentabilidad.`;
        cascade = [
          'Blindaje del empleo y salarios justos garantizados',
          'Máxima reputación y lealtad incondicional de los empleados',
          'Pérdida de competitividad en costos frente a rivales robotizados',
          'Margen financiero ajustado que requiere innovación urgente'
        ];
      }
    } else if (round === 3) {
      if (choice === 'A') {
        story = `Tu mudanza a paraísos regulatorios evitó el pago de aranceles de carbono inmediatos. Pero la respuesta internacional fue implacable: la Unión de Naciones declaró un embargo logístico a tus cargueros y bloqueó tus transacciones en divisas centrales. Tu ahorro se transformó en aislamiento comercial.`;
        cascade = [
          'Traslado de servidores a jurisdicciones sin ley ecológica',
          'Evasión temporal de aranceles de carbono',
          'Retaliación regulatoria internacional con aranceles compensatorios',
          'Deterioro de Relaciones con Reguladores y riesgo de bloqueo'
        ];
      } else if (choice === 'B') {
        story = `El pago disciplinado de bonos de compensación te permitió seguir operando sin contratiempos legales. Cumpliste formalmente con la ley, aunque organizaciones ambientalistas comenzaron a auditar tus certificados, advirtiendo que comprar bonos no limpia la atmósfera real.`;
        cascade = [
          'Adquisición de bonos de carbono de compensación',
          'Desembolso recurrente de capital sin reconversión estructural',
          'Cumplimiento de estándares mínimos de exportación',
          'Escrutinio creciente de la sociedad civil sobre el impacto real'
        ];
      } else {
        story = `Al ejecutar la descarbonización total, tu huella ambiental cayó en picada. Mientras tus competidores enfrentaban multas y aranceles punitivos, tu empresa recibió subsidios de transición verde y una ovación unánime de los consumidores conscientes de todo el mundo.`;
        cascade = [
          'Cierre de plantas térmicas y transición a energía limpia',
          'Gasto extraordinario de capital absorbido con éxito',
          'Inmunidad absoluta frente a aranceles de carbono de la ONU',
          'Impulso masivo al Índice ESG y subsidios gubernamentales'
        ];
      }
    } else if (round === 4) {
      if (choice === 'A') {
        story = `Tu decisión de no invertir en ciberdefensa fue un error catastrófico. Durante el asedio cuántico global, un malware secuestró tu base de datos de patentes y paralizó tu cadena logística durante 72 horas. La fuga de datos de clientes desató demandas millonarias.`;
        cascade = [
          'Omisión de gasto en ciberseguridad para ahorrar fondos',
          'Infección por ransomware cuántico en servidores centrales',
          'Pérdida de propiedad intelectual y datos confidenciales',
          'Pérdida sustancial de capital en rescates y multas por negligencia'
        ];
      } else if (choice === 'B') {
        story = `Tu blindaje cuántico privado repelió los ataques con éxito quirúrgico. Tus sistemas operaron al 100% mientras la mitad de la industria colapsaba. Capturaste clientes desesperados cuyos proveedores habituales estaban caídos.`;
        cascade = [
          'Inversión en ciberdefensa cuántica de primer nivel',
          'Desembolso en infraestructura de seguridad privada',
          'Continuidad operacional total durante el apagón digital',
          'Captura de cuota de mercado de competidores hackeados'
        ];
      } else {
        story = `Al liderar la Alianza Abierta de Ciberdefensa, compartiste tus datos de amenazas en tiempo real. Tu generosidad no solo protegió a tu empresa, sino que salvó la red logística de todo el continente. Fuiste nombrado asesor técnico de la alianza global.`;
        cascade = [
          'Liberación de protocolos de defensa en código abierto',
          'Neutralización colectiva del ataque cibernético global',
          'Reconocimiento gubernamental y prestigio internacional',
          'Alianza estratégica con reguladores y subida de reputación'
        ];
      }
    } else if (round === 5) {
      if (choice === 'A') {
        story = `Tu campaña de greenwashing funcionó durante tres meses, hasta que un consorcio de hackers y periodistas filtró las facturas reales de tus proveedores contaminantes. La indignación fue viral: manifestaciones frente a tus oficinas y cancelación masiva de contratos institucionales.`;
        cascade = [
          'Gasto millonario en relaciones públicas y publicidad verde',
          'Auge temporal de ventas entre consumidores incautos',
          'Filtración de auditorías forenses que exponen el fraude',
          'Derrumbe de reputación y apertura de causas judiciales'
        ];
      } else if (choice === 'B') {
        story = `La publicación de auditorías externas verificadas demostró madurez corporativa. Reconociste áreas de mejora sin maquillar cifras. Los mercados premiaron tu honestidad con estabilidad de precios y contratos gubernamentales a largo plazo.`;
        cascade = [
          'Apertura de libros contables y auditorías de emisiones',
          'Escrutinio inicial de la prensa sin consecuencias punitivas',
          'Validación por evaluadoras internacionales de inversión',
          'Calificación de riesgo baja y costo de capital reducido'
        ];
      } else {
        story = `La trazabilidad blockchain radical revolucionó el estándar de la industria. Cada cliente puede escanear tu producto y ver el salario del operario y la huella de carbono de cada componente. Creaste una ventaja competitiva imposible de replicar por tus rivales oscuros.`;
        cascade = [
          'Trazabilidad criptográfica total de la cadena de valor',
          'Inversión tecnológica en transparencia radical',
          'Adopción masiva por la nueva generación de consumidores',
          'Liderazgo ético mundial y lealtad de marca inquebrantable'
        ];
      }
    } else {
      story = `Tu visión en el ciclo final de Neo-Terra 2045 consolidó tu posición definitiva en los libros de historia económica. Tu balance entre ambición comercial, responsabilidad ambiental y ética tecnológica definió el arquetipo con el que serás recordado.`;
      cascade = [
        'Decisión final de legado corporativo',
        'Consolidación de activos y evaluación de impacto histórico',
        'Dictamen de los tribunales de mercado de Neo-Terra',
        'Clasificación final de Arquetipo Corporativo'
      ];
    }

    return {
      round,
      year: roundScenario?.year || 2045,
      scenarioTitle: roundScenario?.title || 'Ciclo Global',
      chosenOptionName: opt?.name || `Opción ${choice}`,
      story,
      cascade,
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

    this.finalRankings = rankings;

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
    const roundScenario = ROUND_SCENARIOS[this.currentRound] || ROUND_SCENARIOS[1];
    const publicCompanies = Array.from(this.companies.values()).map(c => {
      const arch = c.archetype || (this.state === 'finished' ? this.classifyArchetype(c) : null);
      return {
        id: c.id,
        name: c.name,
        playerName: c.playerName,
        marketShare: c.marketShare,
        reputation: c.reputation,
        esgIndex: c.esgIndex,
        capital: c.capital,
        techLevel: c.techLevel,
        archetype: arch,
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
