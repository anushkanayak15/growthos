import type { SectionType } from './variants';

export type PersonaId = 'skeptic' | 'achiever' | 'lastMinute' | 'explorer' | 'socialLearner';

export interface Persona {
  id: PersonaId;
  name: string;
  mix: number; // population share, sums to 1 across all personas
  attentionBudget: { mean: number; stdDev: number }; // seconds
  scrollPersistence: 'low' | 'low-medium' | 'medium' | 'high';
  trustThreshold: number; // 0..1, resonance needed before CTA click becomes likely
  baseBounce: number; // baseline per-section bounce hazard before resonance modifiers
  triggers: Partial<Record<SectionType, number>>; // resonance gained on encountering section
  repels: Partial<Record<SectionType, number>>; // resonance lost on encountering section
  urgencyCtaMultiplier: number; // multiplies CTA propensity for urgency-styled CTAs
}

export const PERSONAS: Persona[] = [
  {
    id: 'skeptic',
    name: 'The Skeptic',
    mix: 0.2,
    attentionBudget: { mean: 45, stdDev: 15 },
    scrollPersistence: 'medium',
    trustThreshold: 0.62,
    baseBounce: 0.12,
    triggers: { socialProof: 0.35, pricing: 0.15 },
    repels: { urgencyBar: 0.3, hero: 0.15 },
    urgencyCtaMultiplier: 0.55,
  },
  {
    id: 'achiever',
    name: 'The Achiever',
    mix: 0.25,
    attentionBudget: { mean: 35, stdDev: 10 },
    scrollPersistence: 'low-medium',
    trustThreshold: 0.52,
    baseBounce: 0.14,
    triggers: { hero: 0.48, pricing: 0.1 },
    repels: { features: 0.15, faq: 0.1 },
    urgencyCtaMultiplier: 1.0,
  },
  {
    id: 'lastMinute',
    name: 'The Last-Minute',
    mix: 0.2,
    attentionBudget: { mean: 20, stdDev: 8 },
    scrollPersistence: 'low',
    trustThreshold: 0.35,
    baseBounce: 0.22,
    triggers: { urgencyBar: 0.4, cta: 0.25 },
    repels: { socialProof: 0.25, demo: 0.1 },
    urgencyCtaMultiplier: 1.6,
  },
  {
    id: 'explorer',
    name: 'The Explorer',
    mix: 0.15,
    attentionBudget: { mean: 90, stdDev: 25 },
    scrollPersistence: 'high',
    trustThreshold: 0.5,
    baseBounce: 0.06,
    triggers: { demo: 0.4, features: 0.25 },
    repels: { urgencyBar: 0.2, pricing: 0.05 },
    urgencyCtaMultiplier: 0.7,
  },
  {
    id: 'socialLearner',
    name: 'The Social Learner',
    mix: 0.2,
    attentionBudget: { mean: 50, stdDev: 15 },
    scrollPersistence: 'medium',
    trustThreshold: 0.5,
    baseBounce: 0.1,
    triggers: { socialProof: 0.35, faq: 0.25 },
    repels: { demo: 0.1, features: 0.05 },
    urgencyCtaMultiplier: 0.9,
  },
];

export const PERSONA_MIX_SUM = PERSONAS.reduce((s, p) => s + p.mix, 0);
