import type { VariantSimulationResult } from './simulation';
import { PERSONAS, type PersonaId } from './personas';
import type { SectionType } from './variants';

export interface WilsonInterval {
  point: number;
  low: number;
  high: number;
}

// Wilson score interval — better small-sample behavior than a normal approximation,
// and doesn't produce nonsensical bounds outside [0, 1].
export function wilsonInterval(successes: number, n: number, z = 1.96): WilsonInterval {
  if (n === 0) return { point: 0, low: 0, high: 0 };
  const p = successes / n;
  const denom = 1 + (z * z) / n;
  const center = p + (z * z) / (2 * n);
  const margin = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
  return {
    point: p,
    low: Math.max(0, (center - margin) / denom),
    high: Math.min(1, (center + margin) / denom),
  };
}

export interface VariantMetrics {
  variantId: string;
  n: number;
  conversion: WilsonInterval;
  bounceRate: number;
  avgScrollDepth: number;
  avgTimeOnPage: number;
  engagement: number; // mean resonance
  sectionDwell: Record<string, { sectionType: SectionType; meanDwell: number; reachRate: number }>;
  personaConversion: Record<PersonaId, { n: number; conversion: number }>;
  fitness?: number; // filled in by computeFitnessScores
}

export function computeVariantMetrics(result: VariantSimulationResult, allSectionIds: string[]): VariantMetrics {
  const users = result.users;
  const n = users.length;
  const conversions = users.filter((u) => u.converted).length;
  const bounces = users.filter((u) => u.bounced).length;

  const sumScroll = users.reduce((s, u) => s + u.maxScrollDepth, 0);
  const sumTime = users.reduce((s, u) => s + u.totalTimeSeconds, 0);
  const sumResonance = users.reduce((s, u) => s + u.resonance, 0);

  const sectionDwell: VariantMetrics['sectionDwell'] = {};
  for (const sectionId of allSectionIds) {
    const dwells = users
      .map((u) => u.sectionDwells.find((d) => d.sectionId === sectionId))
      .filter((d): d is NonNullable<typeof d> => !!d);
    if (dwells.length === 0) continue;
    sectionDwell[sectionId] = {
      sectionType: dwells[0].sectionType,
      meanDwell: dwells.reduce((s, d) => s + d.dwellSeconds, 0) / dwells.length,
      reachRate: dwells.length / n,
    };
  }

  const personaConversion = {} as VariantMetrics['personaConversion'];
  for (const persona of PERSONAS) {
    const cohort = users.filter((u) => u.personaId === persona.id);
    const cohortConversions = cohort.filter((u) => u.converted).length;
    personaConversion[persona.id] = {
      n: cohort.length,
      conversion: cohort.length > 0 ? cohortConversions / cohort.length : 0,
    };
  }

  return {
    variantId: result.variantId,
    n,
    conversion: wilsonInterval(conversions, n),
    bounceRate: bounces / n,
    avgScrollDepth: sumScroll / n,
    avgTimeOnPage: sumTime / n,
    engagement: sumResonance / n,
    sectionDwell,
    personaConversion,
  };
}

function minMaxNormalize(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max - min < 1e-9) return values.map(() => 0.5);
  return values.map((v) => (v - min) / (max - min));
}

export const GFS_WEIGHTS = {
  conversion: 0.4,
  engagement: 0.2,
  scrollDepth: 0.15,
  timeOnPage: 0.15,
  inverseBounceRate: 0.1,
};

/** Growth Fitness Score, 0-100, computed relative to the other variants in this run. */
export function computeFitnessScores(metricsList: VariantMetrics[]): VariantMetrics[] {
  const conv = minMaxNormalize(metricsList.map((m) => m.conversion.point));
  const eng = minMaxNormalize(metricsList.map((m) => m.engagement));
  const scroll = minMaxNormalize(metricsList.map((m) => m.avgScrollDepth));
  const time = minMaxNormalize(metricsList.map((m) => m.avgTimeOnPage));
  const inverseBounce = minMaxNormalize(metricsList.map((m) => 1 - m.bounceRate));

  return metricsList.map((m, i) => ({
    ...m,
    fitness:
      100 *
      (GFS_WEIGHTS.conversion * conv[i] +
        GFS_WEIGHTS.engagement * eng[i] +
        GFS_WEIGHTS.scrollDepth * scroll[i] +
        GFS_WEIGHTS.timeOnPage * time[i] +
        GFS_WEIGHTS.inverseBounceRate * inverseBounce[i]),
  }));
}

export function buildPersonaVariantMatrix(metricsList: VariantMetrics[]) {
  return PERSONAS.map((persona) => ({
    personaId: persona.id,
    personaName: persona.name,
    byVariant: metricsList.map((m) => ({
      variantId: m.variantId,
      conversion: m.personaConversion[persona.id]?.conversion ?? 0,
    })),
  }));
}

export function allSectionIdsFor(sections: { id: string }[]): string[] {
  return sections.map((s) => s.id);
}
