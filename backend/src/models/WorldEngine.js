'use strict';
const EVENT_CATALOG = require('./EventCatalog');

/**
 * WorldEngine — Motor de Mundo Dinámico (Pseudo-IA)
 *
 * Analiza el estado colectivo del juego tras cada ronda,
 * detecta patrones, selecciona eventos del catálogo con scoring
 * ponderado y genera consecuencias en cascada.
 */
class WorldEngine {
  // ─── Entry Point ──────────────────────────────────────────────────────────
  analyzeRound(globalWorld, allCompanyStates, decisions) {
    const averages  = this.calculateAverages(decisions, allCompanyStates);
    const updatedWorld = this.applyGlobalEffects({ ...globalWorld }, averages);
    const patterns  = this.detectPatterns(averages, updatedWorld);
    const scored    = this.scoreEvents(patterns, averages, updatedWorld, EVENT_CATALOG);
    const selected  = this.selectTopEvents(scored, 3);
    const newsItems = this.generateNews(selected, averages, updatedWorld);
    const cascadeEffects = this.computeCascadeEffects(selected, allCompanyStates, decisions);

    // Apply global consequences from selected events
    for (const event of selected) {
      if (event.consequences && event.consequences.global) {
        for (const [key, delta] of Object.entries(event.consequences.global)) {
          if (updatedWorld[key] !== undefined) {
            updatedWorld[key] = this._clamp(updatedWorld[key] + delta, 0, 100);
          }
        }
      }
    }

    // Clamp global world
    updatedWorld.globalTemperature = Math.max(0.5, updatedWorld.globalTemperature);
    updatedWorld.economicStability = this._clamp(updatedWorld.economicStability, 0, 100);
    updatedWorld.consumerConfidence = this._clamp(updatedWorld.consumerConfidence, 0, 100);
    updatedWorld.internationalRegulation = this._clamp(updatedWorld.internationalRegulation, 0, 100);
    updatedWorld.globalInnovation = this._clamp(updatedWorld.globalInnovation, 0, 100);
    updatedWorld.socialInequality = this._clamp(updatedWorld.socialInequality, 0, 100);
    updatedWorld.sustainabilityIndex = this._clamp(updatedWorld.sustainabilityIndex, 0, 100);

    return {
      updatedWorld,
      triggeredEvents: selected,
      newsItems,
      cascadeEffects,
      patterns,
      averages
    };
  }

  // ─── Metrics Computation ──────────────────────────────────────────────────
  calculateAverages(decisions, companies) {
    const n = companies.length || 1;
    const d = decisions.length || 1;

    let sumEmissions = 0, sumCyber = 0, sumReputation = 0, sumESG = 0;
    let sumLaborRel = 0, sumTechLevel = 0, sumInternational = 0;
    let sumHiddenLabor = 0, sumHiddenCorruption = 0;
    companies.forEach(c => {
      sumEmissions   += c.environmentalFootprint || 50;
      sumCyber       += c.cybersecurity || 30;
      sumReputation  += c.reputation || 50;
      sumESG         += c.esgIndex || 40;
      sumLaborRel    += c.laborRelations || 50;
      sumTechLevel   += c.techLevel || 30;
      sumInternational += c.internationalAccess || 30;
      sumHiddenLabor += c._hiddenLaborRisk || 0;
      sumHiddenCorruption += c._hiddenCorruptionExposure || 0;
    });

    let sumRD = 0, sumSocial = 0, sumEnvironmental = 0, sumCyberInvest = 0;
    let cheapCount = 0, premiumCount = 0;
    decisions.forEach(dec => {
      if (dec.supplier === 'A') cheapCount++;
      if (dec.supplier === 'C') premiumCount++;
      if (dec.investment) {
        sumRD          += (dec.investment.rd || 0);
        sumSocial      += (dec.investment.social || 0);
        sumEnvironmental += (dec.investment.environmental || 0);
        sumCyberInvest += (dec.investment.cybersecurity || 0);
      }
    });

    return {
      avgEmissions:         sumEmissions / n,
      avgCybersecurity:     sumCyber / n,
      avgReputation:        sumReputation / n,
      avgESG:               sumESG / n,
      avgLaborRelations:    sumLaborRel / n,
      avgTechLevel:         sumTechLevel / n,
      avgInternationalAccess: sumInternational / n,
      avgHiddenLaborRisk:   sumHiddenLabor / n,
      avgHiddenCorruption:  sumHiddenCorruption / n,
      avgRD:                sumRD / d,
      avgSocial:            sumSocial / d,
      avgEnvironmental:     sumEnvironmental / d,
      avgCyberInvestment:   sumCyberInvest / d,
      pctCheapSupplier:     cheapCount / d,
      pctPremiumSupplier:   premiumCount / d,
      cheapSupplierCount:   cheapCount,
      totalDecisions:       d
    };
  }

  // ─── Global World Update ─────────────────────────────────────────────────
  applyGlobalEffects(world, avg) {
    // Temperature: rises with emissions, falls with environmental investment
    const tempDelta = (avg.avgEmissions / 100) * 0.10
                    - (avg.avgEnvironmental / 500000) * 0.04
                    - (avg.pctPremiumSupplier * 0.02);
    world.globalTemperature += tempDelta;

    // Economic Stability: hurt by cheap practices, boosted by innovation
    const econDelta = (avg.avgTechLevel / 100) * 2
                    - (avg.pctCheapSupplier * 4)
                    - (world.globalTemperature > 2.5 ? 4 : 0)
                    + (avg.avgReputation > 60 ? 1 : -1);
    world.economicStability += econDelta;

    // Consumer Confidence: driven by reputation and scandals
    const confDelta = (avg.avgReputation - 50) * 0.15
                    - (avg.avgHiddenLaborRisk > 40 ? 5 : 0)
                    + (avg.avgESG > 60 ? 2 : 0);
    world.consumerConfidence += confDelta;

    // International Regulation: rises with bad practices
    const regDelta = (avg.pctCheapSupplier * 3)
                   + (world.globalTemperature > 2.0 ? 2 : 0)
                   + (avg.avgEmissions > 70 ? 4 : 0)
                   - (avg.avgESG > 65 ? 2 : 0)
                   - (avg.pctPremiumSupplier * 2);
    world.internationalRegulation += regDelta;

    // Global Innovation: rises with R&D investment
    const innovDelta = (avg.avgRD / 200000) * 5 - 0.5; // natural decay without investment
    world.globalInnovation += innovDelta;

    // Social Inequality: rises with cheap labor, falls with social investment
    const ineqDelta = (avg.pctCheapSupplier * 3)
                    - (avg.avgSocial / 200000) * 2
                    + (avg.avgHiddenLaborRisk > 50 ? 3 : 0);
    world.socialInequality += ineqDelta;

    // Sustainability Index: composite metric
    world.sustainabilityIndex = Math.round(
      Math.max(0, (1.5 - world.globalTemperature) / 1.5 * 100) * 0.30 +
      world.economicStability * 0.20 +
      Math.max(0, 100 - world.socialInequality) * 0.20 +
      world.globalInnovation * 0.15 +
      Math.max(0, 100 - avg.avgEmissions) * 0.15
    );

    return world;
  }

  // ─── Pattern Detection ───────────────────────────────────────────────────
  detectPatterns(avg, world) {
    const p = {};

    p.highLaborScandalRisk = avg.pctCheapSupplier > 0.5;
    p.extremeLaborScandalRisk = avg.pctCheapSupplier > 0.7;
    p.climateRegulationTrigger = world.globalTemperature > 2.0;
    p.extremeClimate = world.globalTemperature > 2.8;
    p.emissionsCrisis = avg.avgEmissions > 70;
    p.techBoom = avg.avgRD > 100000 && avg.avgTechLevel > 55;
    p.techStagnation = avg.avgTechLevel < 30;
    p.economicCrisis = world.economicStability < 30;
    p.socialUnrest = world.socialInequality > 65;
    p.cyberVulnerable = avg.avgCybersecurity < 30;
    p.sustainabilityLeadership = avg.pctPremiumSupplier > 0.55;
    p.reputationCollapse = avg.avgReputation < 30;
    p.reputationExcellence = avg.avgReputation > 75;
    p.overRegulated = world.internationalRegulation > 75;
    p.consumerCrisis = world.consumerConfidence < 30;
    p.corruptionRisk = avg.avgHiddenCorruption > 50;

    return p;
  }

  // ─── Event Scoring ───────────────────────────────────────────────────────
  scoreEvents(patterns, avg, world, catalog) {
    return catalog.map(event => {
      let score = event.baseProbability;

      if (event.activationConditions) {
        for (const cond of event.activationConditions) {
          const val = this._resolveVariable(cond.variable, patterns, avg, world);
          const met = this._evaluateCondition(val, cond.operator, cond.value);
          if (met) score += (cond.probabilityBoost || 0.20);
        }
      }

      // Add small random noise for variety
      score += (Math.random() * 0.05 - 0.025);

      return { ...event, _score: Math.min(score, 0.98) };
    });
  }

  _resolveVariable(varName, patterns, avg, world) {
    const map = {
      pctCheapSupplier:        avg.pctCheapSupplier,
      pctPremiumSupplier:      avg.pctPremiumSupplier,
      avgEmissions:            avg.avgEmissions,
      avgCybersecurity:        avg.avgCybersecurity,
      avgRD:                   avg.avgRD,
      avgSocial:               avg.avgSocial,
      avgTechLevel:            avg.avgTechLevel,
      avgESG:                  avg.avgESG,
      avgReputation:           avg.avgReputation,
      avgLaborRelations:       avg.avgLaborRelations,
      avgHiddenLaborRisk:      avg.avgHiddenLaborRisk,
      globalTemperature:       world.globalTemperature,
      economicStability:       world.economicStability,
      consumerConfidence:      world.consumerConfidence,
      internationalRegulation: world.internationalRegulation,
      globalInnovation:        world.globalInnovation,
      socialInequality:        world.socialInequality,
      sustainabilityIndex:     world.sustainabilityIndex,
      // Pattern shorthands
      highLaborScandalRisk:    patterns.highLaborScandalRisk ? 1 : 0,
      techBoom:                patterns.techBoom ? 1 : 0,
      cyberVulnerable:         patterns.cyberVulnerable ? 1 : 0,
      socialUnrest:            patterns.socialUnrest ? 1 : 0,
    };
    return map[varName] ?? null;
  }

  _evaluateCondition(val, operator, threshold) {
    if (val === null) return false;
    switch (operator) {
      case '>':  return val > threshold;
      case '>=': return val >= threshold;
      case '<':  return val < threshold;
      case '<=': return val <= threshold;
      case '==': return val === threshold;
      case '===': return val === threshold;
      default:   return false;
    }
  }

  // ─── Event Selection ─────────────────────────────────────────────────────
  selectTopEvents(scoredCatalog, maxEvents = 3) {
    // Sort by score descending, pick top N with probabilistic selection
    const sorted = [...scoredCatalog].sort((a, b) => b._score - a._score);
    const selected = [];

    for (const event of sorted) {
      if (selected.length >= maxEvents) break;
      // Probabilistic trigger: score is the probability of triggering
      if (Math.random() < event._score) {
        selected.push(event);
      }
    }

    // Ensure at least 1 event always fires
    if (selected.length === 0 && sorted.length > 0) {
      selected.push(sorted[0]);
    }

    return selected;
  }

  // ─── News Generation ─────────────────────────────────────────────────────
  generateNews(triggeredEvents, avg, world) {
    const contextualPrefixes = {
      Social:         '🔴 ALERTA SOCIAL',
      Ambiental:      '🌡️ CRISIS AMBIENTAL',
      Tecnológica:    '⚡ AVANCE TECNOLÓGICO',
      Económica:      '📉 REPORTE ECONÓMICO',
      Política:       '🏛️ DECISIÓN POLÍTICA',
      Geopolítica:    '🌍 TENSIÓN GEOPOLÍTICA',
      Comercial:      '📦 MERCADOS GLOBALES',
      Ciberseguridad: '🔒 ALERTA CIBERNÉTICA',
    };

    return triggeredEvents.map(evt => ({
      id: evt.id,
      headline: `${contextualPrefixes[evt.category] || '📰 NOTICIAS'}: ${evt.newsHeadline}`,
      body: this._enrichNewsBody(evt, avg, world),
      category: evt.category,
      severity: evt.severity || 'medium',
      timestamp: new Date().toISOString(),
      affectsWho: evt.consequences?.company?.appliesTo || 'all'
    }));
  }

  _enrichNewsBody(event, avg, world) {
    // Add dynamic numbers to the news body
    let body = event.newsBody;
    body = body.replace('{{temperature}}', world.globalTemperature.toFixed(1));
    body = body.replace('{{pctCheap}}', Math.round(avg.pctCheapSupplier * 100));
    body = body.replace('{{regulation}}', Math.round(world.internationalRegulation));
    body = body.replace('{{stability}}', Math.round(world.economicStability));
    return body;
  }

  // ─── Cascade Effects ─────────────────────────────────────────────────────
  computeCascadeEffects(triggeredEvents, companies, decisions) {
    const cascades = [];
    const decisionMap = new Map(
      decisions.map((d, i) => [companies[i]?.id, d])
    );

    for (const evt of triggeredEvents) {
      if (!evt.consequences) continue;

      // Company-level cascades
      if (evt.consequences.company) {
        const companyEffect = evt.consequences.company;

        for (const company of companies) {
          const decision = decisionMap.get(company.id);
          const affected = this._isCompanyAffected(company, decision, companyEffect.appliesTo);

          if (affected) {
            const effect = { companyId: company.id, companyName: company.name, changes: {} };

            if (companyEffect.reputation)        effect.changes.reputation = companyEffect.reputation;
            if (companyEffect.esgIndex)           effect.changes.esgIndex = companyEffect.esgIndex;
            if (companyEffect.capital)            effect.changes.capital = companyEffect.capital;
            if (companyEffect.regulatorRelations) effect.changes.regulatorRelations = companyEffect.regulatorRelations;
            if (companyEffect.consumerRelations)  effect.changes.consumerRelations = companyEffect.consumerRelations;
            if (companyEffect.laborRelations)     effect.changes.laborRelations = companyEffect.laborRelations;
            if (companyEffect.cybersecurity)      effect.changes.cybersecurity = companyEffect.cybersecurity;
            if (companyEffect.marketShare)        effect.changes.marketShare = companyEffect.marketShare;
            if (companyEffect.internationalAccess) effect.changes.internationalAccess = companyEffect.internationalAccess;

            cascades.push({ eventId: evt.id, eventName: evt.name, ...effect });
          }
        }
      }

      // Named cascade chains
      if (evt.consequences.cascade) {
        for (const cascadeId of evt.consequences.cascade) {
          cascades.push({ type: 'namedCascade', id: cascadeId, eventId: evt.id });
        }
      }
    }

    return cascades;
  }

  _isCompanyAffected(company, decision, appliesTo) {
    if (!appliesTo || appliesTo === 'all') return true;
    if (appliesTo === 'cheapSupplierUsers')   return decision?.supplier === 'A';
    if (appliesTo === 'premiumSupplierUsers') return decision?.supplier === 'C';
    if (appliesTo === 'lowCyber')    return (company.cybersecurity || 0) < 35;
    if (appliesTo === 'highCyber')   return (company.cybersecurity || 0) > 65;
    if (appliesTo === 'lowESG')      return (company.esgIndex || 0) < 35;
    if (appliesTo === 'highESG')     return (company.esgIndex || 0) > 65;
    if (appliesTo === 'topTech')     return (company.techLevel || 0) > 65;
    if (appliesTo === 'lowTech')     return (company.techLevel || 0) < 35;
    if (appliesTo === 'highRep')     return (company.reputation || 0) > 70;
    if (appliesTo === 'lowRep')      return (company.reputation || 0) < 30;
    if (appliesTo === 'globalLeaders') return (company.internationalAccess || 0) > 60;
    return false;
  }

  // ─── Utilities ────────────────────────────────────────────────────────────
  _clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
}

module.exports = WorldEngine;
