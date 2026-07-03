export type SectionType =
  | 'hero'
  | 'socialProof'
  | 'features'
  | 'demo'
  | 'pricing'
  | 'faq'
  | 'cta'
  | 'urgencyBar';

export interface SectionCopy {
  headline?: string;
  sub?: string;
  body?: string;
  cta?: string;
  items?: string[];
}

export interface Provenance {
  parent: string;
  reason: string;
}

export interface Section {
  id: string;
  type: SectionType;
  copy: SectionCopy;
  emphasis: 'high' | 'medium' | 'low';
  provenance?: Provenance;
}

export type CtaStyle =
  | 'hero-primary'
  | 'sticky-bar'
  | 'inline-repeated'
  | 'footer'
  | 'demo-embedded';

export interface VariantTheme {
  accent: string; // tailwind-compatible hex
  density: 'airy' | 'dense';
  tone: string;
}

export interface Variant {
  id: string;
  name: string;
  strategy: string;
  hypothesis: string;
  theme: VariantTheme;
  sections: Section[];
  ctaStyle: CtaStyle;
}

// ---------------------------------------------------------------------------
// Variant A — "The Outcome" (outcome framing)
// ---------------------------------------------------------------------------
const variantA: Variant = {
  id: 'A',
  name: "The Outcome",
  strategy: 'Outcome framing',
  hypothesis: 'Exam-stressed students convert on concrete results, not features.',
  theme: { accent: '#e8720c', density: 'airy', tone: 'confident' },
  ctaStyle: 'hero-primary',
  sections: [
    {
      id: 'a-hero',
      type: 'hero',
      emphasis: 'high',
      copy: {
        headline: 'Get an A in half the study time.',
        sub: "Scholé builds a study plan from your syllabus and drills exactly what you're weakest at.",
        cta: 'Start studying smarter',
      },
    },
    {
      id: 'a-stats',
      type: 'socialProof',
      emphasis: 'high',
      copy: {
        headline: 'The numbers behind the promise',
        items: [
          '+1.2 letter grades average lift after 4 weeks',
          '6.3 hours saved per week on average',
          '92% say they stopped studying material they already knew',
        ],
      },
    },
    {
      id: 'a-features',
      type: 'features',
      emphasis: 'medium',
      copy: {
        headline: 'Every feature, one outcome',
        items: [
          'Syllabus scan → a study plan ordered by exam weight, not chapter order',
          'Weak-spot drills → the 20% of material causing 80% of your lost points',
          'Adaptive pacing → the plan compresses automatically as your deadline nears',
        ],
      },
    },
    {
      id: 'a-cta-mid',
      type: 'cta',
      emphasis: 'medium',
      copy: { headline: 'Ready to see your plan?', cta: 'Start studying smarter' },
    },
    {
      id: 'a-pricing',
      type: 'pricing',
      emphasis: 'low',
      copy: {
        headline: 'Free to start',
        sub: '$0 for your first exam. $12/mo after that, cancel anytime.',
      },
    },
    {
      id: 'a-cta-final',
      type: 'cta',
      emphasis: 'high',
      copy: { headline: 'Get an A in half the study time.', cta: 'Start studying smarter' },
    },
  ],
};

// ---------------------------------------------------------------------------
// Variant B — "The Companion" (emotional resonance)
// ---------------------------------------------------------------------------
const variantB: Variant = {
  id: 'B',
  name: 'The Companion',
  strategy: 'Emotional resonance',
  hypothesis: 'Studying is lonely; belonging beats performance claims.',
  theme: { accent: '#c9714a', density: 'airy', tone: 'warm' },
  ctaStyle: 'footer',
  sections: [
    {
      id: 'b-hero',
      type: 'hero',
      emphasis: 'high',
      copy: {
        headline: 'Never study alone again.',
        sub: 'A tutor that remembers where you struggled yesterday and meets you there today.',
        cta: 'Meet your tutor',
      },
    },
    {
      id: 'b-story',
      type: 'demo',
      emphasis: 'medium',
      copy: {
        headline: "2am before your midterm...",
        body: "...and you're re-reading the same paragraph for the fourth time. Scholé already knows you flagged this exact concept three days ago. It doesn't just show you the answer — it walks you back through the one step you keep tripping on, at 2am, without judgment.",
      },
    },
    {
      id: 'b-features',
      type: 'features',
      emphasis: 'low',
      copy: {
        headline: 'What it feels like to have a tutor who remembers',
        items: [
          'Picks up exactly where your last session left off',
          'Notices when you\'re guessing versus when you know it',
          'Explains things differently the second time, not louder the same way',
        ],
      },
    },
    {
      id: 'b-cta-mid',
      type: 'cta',
      emphasis: 'low',
      copy: { headline: 'Curious what that first session feels like?', cta: 'Meet your tutor' },
    },
    {
      id: 'b-testimonials',
      type: 'socialProof',
      emphasis: 'high',
      copy: {
        headline: 'Conversations, not quotes',
        items: [
          '"I stopped feeling behind. It just met me where I was." — Priya, sophomore',
          '"It\'s the only thing that didn\'t make me feel dumb for asking twice." — Marcus, junior',
          '"Honestly it felt like studying with a patient friend." — Dana, senior',
        ],
      },
    },
    {
      id: 'b-faq',
      type: 'faq',
      emphasis: 'low',
      copy: {
        headline: 'Questions people ask before their first session',
        items: [
          'Will it judge me for not knowing this already?|No. It only ever asks what you need next, never why you don\'t already know it.',
          'What if I don\'t know what I\'m stuck on?|That\'s normal — the first session is a short, low-pressure diagnostic conversation, not a test.',
          'Can I stop and pick back up later?|Yes, it remembers exactly where you left off, down to the specific concept.',
        ],
      },
    },
    {
      id: 'b-cta',
      type: 'cta',
      emphasis: 'medium',
      copy: { headline: "You don't have to do this alone.", cta: 'Meet your tutor' },
    },
  ],
};

// ---------------------------------------------------------------------------
// Variant C — "The Crowd" (social proof / authority)
// ---------------------------------------------------------------------------
const variantC: Variant = {
  id: 'C',
  name: 'The Crowd',
  strategy: 'Social proof / authority',
  hypothesis: 'Skeptical students need evidence before promises.',
  theme: { accent: '#2f6f4f', density: 'dense', tone: 'editorial' },
  ctaStyle: 'inline-repeated',
  sections: [
    {
      id: 'c-hero',
      type: 'hero',
      emphasis: 'high',
      copy: {
        headline: 'Trusted by 50,000 students at 120 universities.',
        sub: 'Average grade improvement: one full letter grade in 6 weeks.',
        cta: 'Join 50,000 students',
        items: ['Stanford', 'UT Austin', 'Michigan', 'UCLA', 'Georgia Tech', 'NYU'],
      },
    },
    {
      id: 'c-testimonial-grid',
      type: 'socialProof',
      emphasis: 'high',
      copy: {
        headline: 'What students at 120 universities are saying',
        items: [
          '"Went from a C+ to an A- in Organic Chemistry." — Alicia R., UT Austin',
          '"Cut my study time in half before finals." — Devon K., Michigan',
          '"Wish I found this freshman year." — Sam T., UCLA',
          '"My study group uses it now too." — Naomi P., Georgia Tech',
        ],
      },
    },
    {
      id: 'c-cta-1',
      type: 'cta',
      emphasis: 'medium',
      copy: { headline: 'Be the next success story.', cta: 'Join 50,000 students' },
    },
    {
      id: 'c-data',
      type: 'features',
      emphasis: 'high',
      copy: {
        headline: 'The data behind the results',
        items: [
          '1 full letter grade average improvement in 6 weeks (n=12,400 self-reported)',
          '4.8/5 average rating across 9,200 reviews',
          '82% retention into a second semester',
        ],
      },
    },
    {
      id: 'c-cta-2',
      type: 'cta',
      emphasis: 'medium',
      copy: { headline: 'Join the students already ahead.', cta: 'Join 50,000 students' },
    },
    {
      id: 'c-features',
      type: 'features',
      emphasis: 'low',
      copy: {
        headline: 'Built for the way top students actually study',
        items: [
          'Syllabus-aware study plans',
          'Weak-spot drilling engine',
          'Progress shared with study groups',
        ],
      },
    },
    {
      id: 'c-faq',
      type: 'faq',
      emphasis: 'low',
      copy: {
        headline: 'Before you take our word for it',
        items: [
          'Are these numbers audited?|Self-reported by students at signup and after their first graded exam; methodology is in our README.',
          'Does it work for any course?|It works from any syllabus or course outline — STEM and humanities alike.',
          'What happens after the 6-week average?|Most students keep the weak-spot drilling engine running for the full term.',
        ],
      },
    },
    {
      id: 'c-cta-final',
      type: 'cta',
      emphasis: 'high',
      copy: { headline: '50,000 students can\'t all be wrong.', cta: 'Join 50,000 students' },
    },
  ],
};

// ---------------------------------------------------------------------------
// Variant D — "The Deadline" (urgency / FOMO)
// ---------------------------------------------------------------------------
const variantD: Variant = {
  id: 'D',
  name: 'The Deadline',
  strategy: 'Urgency / FOMO',
  hypothesis: 'Last-minute studiers respond to scarcity and peer pressure.',
  theme: { accent: '#c62828', density: 'dense', tone: 'high-energy' },
  ctaStyle: 'sticky-bar',
  sections: [
    {
      id: 'd-urgency',
      type: 'urgencyBar',
      emphasis: 'high',
      copy: {
        headline: 'Finals in 19 days',
        sub: 'Every day you wait, the curve moves without you.',
        cta: "Don't fall behind",
      },
    },
    {
      id: 'd-hero',
      type: 'hero',
      emphasis: 'high',
      copy: {
        headline: 'Your classmates are already using AI tutors.',
        sub: 'Finals are in 19 days. Every day you wait, the curve moves without you.',
        cta: "Don't fall behind",
      },
    },
    {
      id: 'd-curve',
      type: 'demo',
      emphasis: 'medium',
      copy: {
        headline: 'What the top of the curve does differently',
        body: 'They started their focused review 3 weeks out, not 3 days out. They drilled weak spots daily instead of re-reading notes once. The gap compounds — and it\'s compounding right now.',
      },
    },
    {
      id: 'd-features',
      type: 'features',
      emphasis: 'low',
      copy: {
        headline: 'Catch up fast',
        items: [
          'Instant syllabus scan — plan ready in 60 seconds',
          'Priority drilling on your weakest topics first',
          'Daily catch-up targets so you\'re not cramming blind',
        ],
      },
    },
    {
      id: 'd-offer',
      type: 'pricing',
      emphasis: 'medium',
      copy: {
        headline: 'Finals-week offer ends in 19 days',
        sub: 'Free through your next exam if you start this week.',
      },
    },
    {
      id: 'd-cta',
      type: 'cta',
      emphasis: 'high',
      copy: { headline: 'The curve isn\'t waiting.', cta: "Don't fall behind" },
    },
  ],
};

// ---------------------------------------------------------------------------
// Variant E — "The Sandbox" (product-led / show don't tell)
// ---------------------------------------------------------------------------
const variantE: Variant = {
  id: 'E',
  name: 'The Sandbox',
  strategy: 'Product-led / show, don\'t tell',
  hypothesis: 'Explorers convert when they experience the product before any claim.',
  theme: { accent: '#3457d5', density: 'dense', tone: 'technical' },
  ctaStyle: 'demo-embedded',
  sections: [
    {
      id: 'e-demo-hero',
      type: 'demo',
      emphasis: 'high',
      copy: {
        headline: 'See how it adapts to you.',
        sub: 'Pick a subject. Watch the tutor find exactly where you\'re stuck.',
        cta: 'Try a sample question',
        items: ['Organic Chemistry', 'Calculus II', 'Microeconomics', 'Statistics'],
      },
    },
    {
      id: 'e-deep-dive',
      type: 'features',
      emphasis: 'high',
      copy: {
        headline: 'Under the hood',
        items: [
          'Syllabus parser extracts every graded topic and its weight toward your final grade',
          'Diagnostic questioning locates your weak spots in under 2 minutes, not a full pretest',
          'Adaptive drill engine resurfaces a concept with rising difficulty until it sticks',
          'Session memory means tomorrow\'s plan already accounts for today\'s mistakes',
        ],
      },
    },
    {
      id: 'e-cta-mid',
      type: 'cta',
      emphasis: 'low',
      copy: { headline: 'Want to see the plan it builds?', cta: 'Try a sample question' },
    },
    {
      id: 'e-how-it-works',
      type: 'socialProof',
      emphasis: 'medium',
      copy: {
        headline: 'How it works',
        items: [
          '1. Upload your syllabus or course outline',
          '2. Answer a short diagnostic — the tutor is already adapting',
          '3. Get a daily plan ranked by what will move your grade most',
        ],
      },
    },
    {
      id: 'e-pricing',
      type: 'pricing',
      emphasis: 'low',
      copy: {
        headline: 'Try it before you pay for it',
        sub: 'Free diagnostic and first plan. $12/mo if you keep going.',
      },
    },
    {
      id: 'e-cta',
      type: 'cta',
      emphasis: 'high',
      copy: { headline: 'Stop reading about it.', cta: 'Try a sample question' },
    },
  ],
};

export const VARIANTS: Variant[] = [variantA, variantB, variantC, variantD, variantE];

export function getVariant(id: string): Variant | undefined {
  return VARIANTS.find((v) => v.id === id);
}
