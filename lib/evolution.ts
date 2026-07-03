import type { Variant, Section, SectionType, CtaStyle } from './variants';
import type { VariantSimulationResult } from './simulation';
import type { VariantMetrics } from './metrics';
import { PERSONAS, type PersonaId } from './personas';

export type Principle =
  | 'social-proof'
  | 'urgency'
  | 'outcome-framing'
  | 'product-led'
  | 'friction'
  | 'cta-placement';

export interface Insight {
  principle: Principle;
  evidence: string;
  magnitude: number;
  action: string;
  sourceVariant: string;
}

export interface Mutation {
  field: string;
  before: string;
  after: string;
  reason: string;
}

export interface EvolutionResult {
  insights: Insight[];
  gen2: Variant;
  mutations: Mutation[];
}

interface Ctx {
  variants: Variant[];
  results: VariantSimulationResult[];
  metrics: VariantMetrics[];
}

function pct(x: number) {
  return `${(x * 100).toFixed(1)}%`;
}

// --- Heuristics --------------------------------------------------------

function heuristicPromoteHighDwellSections(ctx: Ctx): Insight[] {
  const { metrics } = ctx;
  const insights: Insight[] = [];
  const types: SectionType[] = ['socialProof', 'features', 'demo', 'pricing', 'faq'];

  for (const type of types) {
    const points: { dwell: number; conv: number; variantId: string }[] = [];
    for (const m of metrics) {
      const entries = Object.values(m.sectionDwell).filter((s) => s.sectionType === type);
      if (entries.length === 0) continue;
      const meanDwell = entries.reduce((s, e) => s + e.meanDwell, 0) / entries.length;
      points.push({ dwell: meanDwell, conv: m.conversion.point, variantId: m.variantId });
    }
    if (points.length < 3) continue;
    const meanD = points.reduce((s, p) => s + p.dwell, 0) / points.length;
    const meanC = points.reduce((s, p) => s + p.conv, 0) / points.length;
    const cov = points.reduce((s, p) => s + (p.dwell - meanD) * (p.conv - meanC), 0);
    const varD = points.reduce((s, p) => s + (p.dwell - meanD) ** 2, 0);
    const varC = points.reduce((s, p) => s + (p.conv - meanC) ** 2, 0);
    const corr = varD > 0 && varC > 0 ? cov / Math.sqrt(varD * varC) : 0;
    if (corr > 0.4) {
      const best = [...points].sort((a, b) => b.dwell - a.dwell)[0];
      insights.push({
        principle: 'friction',
        evidence: `${type} dwell correlates with conversion across variants (r=${corr.toFixed(2)}); ${best.variantId} has the highest mean dwell on it at ${best.dwell.toFixed(1)}s`,
        magnitude: corr,
        action: `Promote ${type} earlier in Gen 2's section order`,
        sourceVariant: best.variantId,
      });
    }
  }
  return insights;
}

function heuristicCutSkippedSections(ctx: Ctx): Insight[] {
  const insights: Insight[] = [];
  for (const m of ctx.metrics) {
    const entries = Object.entries(m.sectionDwell);
    if (entries.length === 0) continue;
    const avgReach = entries.reduce((s, [, e]) => s + e.reachRate, 0) / entries.length;
    for (const [sectionId, e] of entries) {
      if (e.sectionType === 'cta' || e.sectionType === 'urgencyBar') continue;
      if (e.reachRate < avgReach * 0.6 && m.bounceRate > 0.2) {
        insights.push({
          principle: 'friction',
          evidence: `${sectionId} (${e.sectionType}) on ${m.variantId} is reached by only ${pct(e.reachRate)} of visitors, well below that page's ${pct(avgReach)} average reach`,
          magnitude: avgReach - e.reachRate,
          action: `Compress or cut ${e.sectionType} sections with high early drop-off`,
          sourceVariant: m.variantId,
        });
      }
    }
  }
  return insights.sort((a, b) => b.magnitude - a.magnitude).slice(0, 2);
}

function heuristicBestCtaStyle(ctx: Ctx): Insight[] {
  const { metrics, variants } = ctx;
  const byStyle = new Map<CtaStyle, VariantMetrics[]>();
  for (const m of metrics) {
    const v = variants.find((v) => v.id === m.variantId)!;
    const list = byStyle.get(v.ctaStyle) ?? [];
    list.push(m);
    byStyle.set(v.ctaStyle, list);
  }
  const ranked = [...byStyle.entries()]
    .map(([style, ms]) => ({
      style,
      avgConv: ms.reduce((s, m) => s + m.conversion.point, 0) / ms.length,
      best: [...ms].sort((a, b) => b.conversion.point - a.conversion.point)[0],
    }))
    .sort((a, b) => b.avgConv - a.avgConv);

  const winner = ranked[0];
  return [
    {
      principle: 'cta-placement',
      evidence: `${winner.style} CTAs convert at ${pct(winner.avgConv)} on average, the best of any style tested; ${winner.best.variantId} leads at ${pct(winner.best.conversion.point)}`,
      magnitude: winner.avgConv,
      action: `Adopt ${winner.best.variantId}'s CTA copy and ${winner.style} style in Gen 2`,
      sourceVariant: winner.best.variantId,
    },
  ];
}

function heuristicUnderconvertingPersona(ctx: Ctx): Insight[] {
  const { metrics } = ctx;
  const insights: Insight[] = [];
  for (const persona of PERSONAS) {
    const convs = metrics.map((m) => m.personaConversion[persona.id]?.conversion ?? 0);
    const maxConv = Math.max(...convs);
    if (maxConv < 0.25) {
      const bestTrigger = Object.entries(persona.triggers).sort((a, b) => b[1] - a[1])[0];
      insights.push({
        principle: 'friction',
        evidence: `${persona.name} converts below 25% on every variant (best: ${pct(maxConv)})`,
        magnitude: 0.25 - maxConv,
        action: `Add a ${bestTrigger?.[0] ?? 'features'} section aimed at ${persona.name} in Gen 2`,
        sourceVariant: 'none',
      });
    }
  }
  return insights;
}

function heuristicUrgencySequencing(ctx: Ctx): Insight[] {
  const { metrics, variants } = ctx;
  const urgencyVariant = variants.find((v) => v.sections.some((s) => s.type === 'urgencyBar'));
  if (!urgencyVariant) return [];
  const m = metrics.find((m) => m.variantId === urgencyVariant.id);
  if (!m) return [];

  const lastMinuteConv = m.personaConversion['lastMinute' as PersonaId]?.conversion ?? 0;
  const skepticConv = m.personaConversion['skeptic' as PersonaId]?.conversion ?? 0;
  const skepticAvgElsewhere =
    metrics
      .filter((mm) => mm.variantId !== urgencyVariant.id)
      .reduce((s, mm) => s + (mm.personaConversion['skeptic' as PersonaId]?.conversion ?? 0), 0) /
    Math.max(1, metrics.length - 1);

  if (lastMinuteConv > 0.5 && skepticConv < skepticAvgElsewhere) {
    return [
      {
        principle: 'urgency',
        evidence: `${urgencyVariant.id}'s urgency bar lifts Last-Minute conversion to ${pct(lastMinuteConv)} but Skeptic conversion (${pct(skepticConv)}) trails their ${pct(skepticAvgElsewhere)} average on other pages`,
        magnitude: lastMinuteConv - skepticConv,
        action: `Keep the urgency bar, but move it below the trust/social-proof block instead of leading with it`,
        sourceVariant: urgencyVariant.id,
      },
    ];
  }
  return [];
}

function heuristicDemoLongPage(ctx: Ctx): Insight[] {
  const { metrics, variants } = ctx;
  const demoVariant = variants.find((v) => v.strategy.toLowerCase().includes('product-led'));
  if (!demoVariant) return [];
  const m = metrics.find((m) => m.variantId === demoVariant.id);
  if (!m) return [];

  const demoEntries = Object.values(m.sectionDwell).filter((e) => e.sectionType === 'demo');
  if (demoEntries.length === 0) return [];
  const demoDwell = demoEntries.reduce((s, e) => s + e.meanDwell, 0) / demoEntries.length;

  const allDwells = metrics.flatMap((mm) => Object.values(mm.sectionDwell).map((e) => e.meanDwell));
  const sorted = [...allDwells].sort((a, b) => a - b);
  const dwellRank = sorted.findIndex((d) => d >= demoDwell) / sorted.length;

  const convRank =
    [...metrics].sort((a, b) => b.conversion.point - a.conversion.point).findIndex((mm) => mm.variantId === demoVariant.id) /
    Math.max(1, metrics.length - 1);

  if (dwellRank > 0.7 && convRank > 0.3) {
    return [
      {
        principle: 'product-led',
        evidence: `${demoVariant.id}'s demo section holds attention (${demoDwell.toFixed(1)}s, top ${Math.round((1 - dwellRank) * 100)}% of all sections) but the page converts only mid-pack (${pct(m.conversion.point)})`,
        magnitude: dwellRank - convRank,
        action: `Pair the demo with a shorter path to CTA in Gen 2 rather than a long feature deep-dive`,
        sourceVariant: demoVariant.id,
      },
    ];
  }
  return [];
}

export function extractInsights(ctx: Ctx): Insight[] {
  const insights = [
    ...heuristicPromoteHighDwellSections(ctx),
    ...heuristicCutSkippedSections(ctx),
    ...heuristicBestCtaStyle(ctx),
    ...heuristicUnderconvertingPersona(ctx),
    ...heuristicUrgencySequencing(ctx),
    ...heuristicDemoLongPage(ctx),
  ];
  return insights.sort((a, b) => b.magnitude - a.magnitude);
}

// --- Recombination -------------------------------------------------------

function bestSectionOfType(ctx: Ctx, type: SectionType): { section: Section; variant: Variant; score: number } | null {
  let best: { section: Section; variant: Variant; score: number } | null = null;
  for (const variant of ctx.variants) {
    const m = ctx.metrics.find((mm) => mm.variantId === variant.id)!;
    for (const section of variant.sections) {
      if (section.type !== type) continue;
      const dwellInfo = m.sectionDwell[section.id];
      const score = (dwellInfo?.meanDwell ?? 0) * (dwellInfo?.reachRate ?? 0) * (1 + m.conversion.point);
      if (!best || score > best.score) best = { section, variant, score };
    }
  }
  return best;
}

function bestHeroSection(ctx: Ctx): { section: Section; variant: Variant } {
  // Score by hero-gate pass rate weighted by downstream conversion (the gate is whatever
  // section the visitor sees first), but pull the actual content from that variant's
  // hero-type section — falling back to the gating section only if it has none (e.g. E).
  let best: { section: Section; variant: Variant; score: number } | null = null;
  for (const variant of ctx.variants) {
    const result = ctx.results.find((r) => r.variantId === variant.id)!;
    const m = ctx.metrics.find((mm) => mm.variantId === variant.id)!;
    const passRate = 1 - result.users.filter((u) => u.heroGateFailed).length / result.users.length;
    const score = passRate * m.conversion.point;
    const heroContent = variant.sections.find((s) => s.type === 'hero') ?? variant.sections[0];
    if (!best || score > best.score) best = { section: heroContent, variant, score };
  }
  return best!;
}

function bestCtaSource(ctx: Ctx): { section: Section; variant: Variant } {
  const ranked = [...ctx.metrics].sort((a, b) => b.conversion.point - a.conversion.point);
  const winner = ranked[0];
  const variant = ctx.variants.find((v) => v.id === winner.variantId)!;
  const ctaSection = [...variant.sections].reverse().find((s) => s.type === 'cta') ?? variant.sections[variant.sections.length - 1];
  return { section: ctaSection, variant };
}

function wordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export function evolve(ctx: Ctx): EvolutionResult {
  const insights = extractInsights(ctx);
  const mutations: Mutation[] = [];

  const heroPick = bestHeroSection(ctx);
  const socialProofPick = bestSectionOfType(ctx, 'socialProof');
  const featuresPick = bestSectionOfType(ctx, 'features');
  const pricingPick = bestSectionOfType(ctx, 'pricing');
  const ctaPick = bestCtaSource(ctx);

  const urgencyInsight = insights.find((i) => i.principle === 'urgency');
  const urgencyVariant = ctx.variants.find((v) => v.sections.some((s) => s.type === 'urgencyBar'));
  const urgencySection = urgencyVariant?.sections.find((s) => s.type === 'urgencyBar') ?? null;

  const sections: Section[] = [];

  // Hero: always first (the gate).
  sections.push({
    ...heroPick.section,
    id: 'g2-hero',
    provenance: { parent: heroPick.variant.id, reason: 'best hero-gate pass rate weighted by downstream conversion' },
  });

  // Middle sections ordered by global mean dwell (front-load what holds attention),
  // except socialProof always leads the middle block — it's the "trust block" the
  // urgency-sequencing insight is defined relative to.
  const middleCandidates: { section: Section; variant: Variant; type: SectionType; globalDwell: number }[] = [];
  for (const [pick, type] of [
    [featuresPick, 'features'],
    [pricingPick, 'pricing'],
  ] as const) {
    if (!pick) continue;
    const dwells = ctx.metrics.flatMap((m) =>
      Object.values(m.sectionDwell).filter((e) => e.sectionType === type).map((e) => e.meanDwell)
    );
    const globalDwell = dwells.length ? dwells.reduce((s, d) => s + d, 0) / dwells.length : 0;
    middleCandidates.push({ section: pick.section, variant: pick.variant, type, globalDwell });
  }
  middleCandidates.sort((a, b) => b.globalDwell - a.globalDwell);

  function compressAndPush(c: { section: Section; variant: Variant; type: SectionType; globalDwell: number }) {
    let section: Section = { ...c.section, id: `g2-${c.type}`, provenance: { parent: c.variant.id, reason: `strongest ${c.type} performer (${c.globalDwell.toFixed(1)}s mean dwell)` } };
    // Cut-the-bottom-quartile mutation: compress oversized item lists.
    if (section.copy.items && section.copy.items.length > 3) {
      const before = `${section.copy.items.length} items`;
      section = { ...section, copy: { ...section.copy, items: section.copy.items.slice(0, 3) } };
      mutations.push({
        field: `${section.id}.items`,
        before,
        after: '3 items',
        reason: 'compressed bottom-quartile-dwell content to keep the path to CTA short',
      });
    }
    sections.push(section);
  }

  if (socialProofPick) {
    const dwells = ctx.metrics.flatMap((m) =>
      Object.values(m.sectionDwell).filter((e) => e.sectionType === 'socialProof').map((e) => e.meanDwell)
    );
    const globalDwell = dwells.length ? dwells.reduce((s, d) => s + d, 0) / dwells.length : 0;
    compressAndPush({ section: socialProofPick.section, variant: socialProofPick.variant, type: 'socialProof', globalDwell });
  }

  // Urgency bar: keep it, but sequence it right below the trust block instead of leading
  // with it — the sequencing win the urgency heuristic found. Placing it here (rather than
  // at the very end) also preserves it as an early, cheap CTA touchpoint for every visitor.
  if (urgencySection && urgencyVariant) {
    sections.push({
      ...urgencySection,
      id: 'g2-urgency',
      provenance: {
        parent: urgencyVariant.id,
        reason: urgencyInsight
          ? 'urgency lifts conversion broadly but hurts Skeptics when led with — demoted below the trust block'
          : 'urgency bar retained just below the trust block',
      },
    });
  }

  for (const c of middleCandidates) {
    compressAndPush(c);
  }

  // CTA: copy + style from the best overall performer, with mutations applied.
  let ctaCopy = { ...ctaPick.section.copy };
  const before = ctaCopy.headline ?? '';
  if (ctaCopy.headline && !/\d/.test(ctaCopy.headline)) {
    const statSection = sections.find((s) => s.copy.items?.some((i) => /^\d/.test(i)));
    const stat = statSection?.copy.items?.find((i) => /^\d/.test(i));
    if (stat) {
      const number = stat.match(/^[\d.,]+%?/)?.[0];
      if (number) {
        const afterHeadline = `${ctaCopy.headline} (${number})`;
        ctaCopy = { ...ctaCopy, headline: afterHeadline };
        mutations.push({ field: 'cta.headline', before, after: afterHeadline, reason: 'added a concrete number for specificity' });
      }
    }
  }
  if (ctaCopy.sub && wordCount(ctaCopy.sub) > 15) {
    const shortened = ctaCopy.sub.split(/\s+/).slice(0, 14).join(' ') + '.';
    mutations.push({ field: 'cta.sub', before: ctaCopy.sub, after: shortened, reason: 'tightened sub-headline to under 15 words' });
    ctaCopy = { ...ctaCopy, sub: shortened };
  }
  if (urgencyInsight && ctaCopy.cta && !/don'?t|now|today|last|final/i.test(ctaCopy.cta)) {
    const beforeCta = ctaCopy.cta;
    const afterCta = `${ctaCopy.cta} — don't fall behind`;
    ctaCopy = { ...ctaCopy, cta: afterCta };
    mutations.push({ field: 'cta.cta', before: beforeCta, after: afterCta, reason: 'urgency scored positive overall, so one urgency word was added to the CTA' });
  }

  sections.push({
    id: 'g2-cta',
    type: 'cta',
    emphasis: 'high',
    copy: ctaCopy,
    provenance: { parent: ctaPick.variant.id, reason: `highest overall conversion (${pct(ctx.metrics.find((m) => m.variantId === ctaPick.variant.id)!.conversion.point)})` },
  });

  const gen2: Variant = {
    id: 'G2',
    name: 'Gen 2 — The Evolved Page',
    strategy: 'Evidence-recombined',
    hypothesis: 'A page assembled from what actually worked, section by section, beats any single hand-authored hypothesis.',
    theme: { accent: '#7c3aed', density: 'airy', tone: 'evolved' },
    ctaStyle: ctaPick.variant.ctaStyle,
    sections,
  };

  return { insights, gen2, mutations };
}
