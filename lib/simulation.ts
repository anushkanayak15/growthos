import { mulberry32, gaussian, clamp, weightedPick, type RNG } from './rng';
import { PERSONAS, type Persona, type PersonaId } from './personas';
import type { Variant, Section, SectionType } from './variants';

export const USERS_PER_VARIANT = 10_000;

export interface SectionDwellRecord {
  sectionId: string;
  sectionType: SectionType;
  dwellSeconds: number;
  reachedIndex: number;
}

export interface UserRecord {
  userIndex: number;
  personaId: PersonaId;
  bounced: boolean;
  bouncedAtSectionIndex: number | null;
  heroGateFailed: boolean;
  converted: boolean;
  maxScrollDepth: number; // 0..1, fraction of sections seen
  totalTimeSeconds: number;
  resonance: number;
  sectionDwells: SectionDwellRecord[];
  ctaClicked: boolean;
}

export interface VariantSimulationResult {
  variantId: string;
  seed: number;
  users: UserRecord[];
}

// Base read time per section type (seconds), scaled by content length + persona interest.
const BASE_READ_TIME: Record<SectionType, number> = {
  hero: 6,
  socialProof: 10,
  features: 12,
  demo: 16,
  pricing: 6,
  faq: 9,
  cta: 4,
  urgencyBar: 2,
};

function sectionLengthFactor(section: Section): number {
  const itemCount = section.copy.items?.length ?? 0;
  const bodyLen = section.copy.body?.length ?? 0;
  return 1 + itemCount * 0.15 + bodyLen / 400;
}

function personaInterest(persona: Persona, section: Section): number {
  const trigger = persona.triggers[section.type] ?? 0;
  const repel = persona.repels[section.type] ?? 0;
  return clamp(1 + trigger * 1.2 - repel * 0.8, 0.35, 2.2);
}

function drawPersona(rng: RNG): Persona {
  return weightedPick(
    rng,
    PERSONAS.map((p) => ({ item: p, weight: p.mix }))
  );
}

function heroResonance(persona: Persona, hero: Section): number {
  const trigger = persona.triggers[hero.type] ?? 0;
  const repel = persona.repels[hero.type] ?? 0;
  return clamp(0.38 + trigger - repel, 0, 1);
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function simulateUser(userIndex: number, variant: Variant, rng: RNG): UserRecord {
  const persona = drawPersona(rng);
  const attentionBudget = Math.max(5, gaussian(rng, persona.attentionBudget.mean, persona.attentionBudget.stdDev));
  let remainingBudget = attentionBudget;
  let resonance = 0;
  let bounced = false;
  let bouncedAtSectionIndex: number | null = null;
  let ctaClicked = false;
  let converted = false;
  let totalTime = 0;
  const sectionDwells: SectionDwellRecord[] = [];
  let lastReachedIndex = -1;

  const sections = variant.sections;
  const hero = sections.find((s) => s.type === 'hero') ?? sections[0];

  // 1. Hero gate — the 3-second test.
  const heroRes = heroResonance(persona, hero);
  const heroFailP = clamp(0.22 * (1 - heroRes), 0.01, 0.4);
  if (rng() < heroFailP) {
    bounced = true;
    bouncedAtSectionIndex = sections.indexOf(hero);
    totalTime = clamp(gaussian(rng, 3, 1), 1, 6);
    return {
      userIndex,
      personaId: persona.id,
      bounced,
      bouncedAtSectionIndex,
      heroGateFailed: true,
      converted: false,
      maxScrollDepth: 1 / sections.length,
      totalTimeSeconds: totalTime,
      resonance: heroRes,
      sectionDwells: [
        { sectionId: hero.id, sectionType: hero.type, dwellSeconds: totalTime, reachedIndex: 0 },
      ],
      ctaClicked: false,
    };
  }
  resonance += heroRes;

  // 2. Walk sections in order.
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (remainingBudget <= 0.5) break;

    const interest = personaInterest(persona, section);
    const rawDwell = BASE_READ_TIME[section.type] * sectionLengthFactor(section) * interest;
    const dwell = clamp(Math.min(rawDwell, remainingBudget), 0.3, remainingBudget);
    remainingBudget -= dwell;
    totalTime += dwell;
    lastReachedIndex = i;
    sectionDwells.push({ sectionId: section.id, sectionType: section.type, dwellSeconds: dwell, reachedIndex: i });

    const trigger = persona.triggers[section.type] ?? 0;
    const repel = persona.repels[section.type] ?? 0;
    resonance = clamp(resonance + trigger - repel, 0, 3);

    // CTA encountered.
    if ((section.type === 'cta' || section.type === 'urgencyBar') && !ctaClicked) {
      const isUrgencyStyled = section.type === 'urgencyBar' || variant.ctaStyle === 'sticky-bar';
      const styleModifier =
        variant.ctaStyle === 'inline-repeated'
          ? 1.1
          : variant.ctaStyle === 'demo-embedded'
            ? 1.15
            : variant.ctaStyle === 'footer'
              ? 0.9
              : 1.0;
      const urgencyMult = isUrgencyStyled ? persona.urgencyCtaMultiplier : 1.0;
      const p = sigmoid((resonance - persona.trustThreshold) * 3) * styleModifier * urgencyMult;
      if (rng() < clamp(p, 0, 0.97)) {
        ctaClicked = true;
        converted = true;
      }
    }

    // Bounce check.
    const bounceHazard = clamp(persona.baseBounce * (1 - resonance * 0.5) + repel * 0.15, 0.01, 0.6);
    if (!converted && rng() < bounceHazard) {
      bounced = true;
      bouncedAtSectionIndex = i;
      break;
    }
    if (converted) break;
  }

  return {
    userIndex,
    personaId: persona.id,
    bounced,
    bouncedAtSectionIndex,
    heroGateFailed: false,
    converted,
    maxScrollDepth: sections.length > 0 ? (lastReachedIndex + 1) / sections.length : 0,
    totalTimeSeconds: totalTime,
    resonance,
    sectionDwells,
    ctaClicked,
  };
}

export function simulateVariant(variant: Variant, seed: number, n = USERS_PER_VARIANT): VariantSimulationResult {
  const rng = mulberry32(seed);
  const users: UserRecord[] = [];
  for (let i = 0; i < n; i++) {
    users.push(simulateUser(i, variant, rng));
  }
  return { variantId: variant.id, seed, users };
}

export function simulateAll(variants: Variant[], seed: number, n = USERS_PER_VARIANT): VariantSimulationResult[] {
  // Offset seed per variant so each gets an independent but deterministic stream from the same experiment seed.
  return variants.map((v, i) => simulateVariant(v, seed + i * 104729, n));
}
