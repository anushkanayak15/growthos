# GrowthOS: Product & Experimentation Report

## Executive Summary

GrowthOS is an **Evolutionary Conversion Lab** that compresses the landing-page experimentation loop from weeks to minutes. It compares five distinct landing-page hypotheses for Scholé AI, simulates persona-driven behavior, evaluates performance with conversion and engagement signals, extracts explainable Selection Findings, assembles an Evolved Candidate (Gen 2), and validates that candidate again.

**Core product promise:** GrowthOS stress-tests landing-page hypotheses against behavioral cohorts, learns which page traits earn attention and trust, then assembles a stronger next version.

## Assignment Response

The product was built to satisfy the following requirements:

- Compare at least five landing pages for the same product and audience.
- Simulate meaningful user behavior.
- Determine page winners using data.
- Generate new variations based on learning.
- Explain what changed and why.
- Provide a hosted web application plus an honest engineering walkthrough and persuasive product pitch.

## Product Under Test

**Scholé AI** is an adaptive AI tutor for college students preparing for exams. The product and audience remain constant so that the experiment isolates the landing-page strategy: message, proof, structure, urgency, product demonstration, and CTA experience.

## Five Gen 0 Growth Hypotheses

| Candidate | Hypothesis | Mechanism | Expected Cohort |
|---|---|---|---|
| A — The Outcome | Students convert on concrete results, not features. | Grade lift, time saved, study efficiency. | The Achiever |
| B — The Companion | Studying is lonely; belonging can outperform performance claims. | Memory, reassurance, nonjudgmental support. | The Social Learner |
| C — The Crowd | Skeptical students need evidence before promises. | Ratings, testimonials, universities, proof. | The Skeptic |
| D — The Deadline | Last-minute students respond to scarcity and peer pressure. | Countdown, activity, urgency, action. | The Last-Minute Student |
| E — The Sandbox | Explorers convert after experiencing the product. | Interactive demo, workflow visibility. | The Explorer |

## Simulation Model

GrowthOS simulates **10,000 users per candidate**, or **50,000 Gen 0 visits** per run. A visitor is sampled into a behavioral cohort and receives an attention budget. The user then moves through a page section by section.

### Cohorts

- **The Skeptic:** needs proof; resists urgency and hype.
- **The Achiever:** responds to outcome framing and efficiency.
- **The Last-Minute Student:** responds to urgency and a clear immediate action.
- **The Explorer:** engages with product demo and feature depth.
- **The Social Learner:** responds to peer proof and reassurance.

### Session logic

1. Draw cohort from the defined population mix.
2. Draw a Gaussian-distributed attention budget.
3. Evaluate a hero gate representing the opening-message test.
4. Walk page sections in order.
5. Update resonance using cohort triggers and repels.
6. Record dwell, reach, scroll, time, bounce, CTA click, and conversion.
7. End when the visitor converts, bounces, or exhausts attention.

### Key terms

- **Resonance:** fit between the visitor and the page content.
- **Hero gate:** early relevance check for the opening message.
- **Attention budget:** modeled visitor patience.
- **Dwell:** time spent on a section.
- **Reach rate:** fraction of visitors reaching a section.
- **Bounce hazard:** probability of leaving at a point in the page.
- **CTA propensity:** probability of clicking a conversion action.

## Metrics

GrowthOS measures:

- Conversion rate
- Wilson 95% confidence interval
- Bounce rate
- Average scroll depth
- Average time on page
- Engagement / resonance
- Section dwell and reach
- Cohort-by-variant conversion

### Fitness Score

```text
GFS = 100 × [
  0.40 × normalized conversion +
  0.20 × normalized engagement +
  0.15 × normalized scroll depth +
  0.15 × normalized time on page +
  0.10 × normalized (1 − bounce rate)
]
```

Conversion is weighted most heavily because it is the business outcome. The other metrics explain how a page reached that outcome and where it lost users.

## Explainable Evolution

The system creates Selection Findings such as:

- High-dwell sections that correlate with conversion should be promoted.
- Low-reach sections on high-bounce pages should be compressed or cut.
- The best CTA style should be retained.
- Cohorts that underconvert should receive targeted content.
- Urgency can help Last-Minute Students while reducing Skeptic trust; it should be sequenced after proof.
- A high-dwell demo that converts only mid-pack should be followed by a shorter CTA path.

Gen 2 is created through:

1. **Selection:** choose strong hero, proof, CTA, and supporting sections.
2. **Recombination:** build an ordered page from selected traits.
3. **Mutation:** apply small logged copy or compression changes.
4. **Lineage:** record parent source and reason for each Gen 2 section.
5. **Validation Retest:** rerun simulated traffic with Gen 2 included.

## Final Product Theme

GrowthOS is framed as an **Evolutionary Conversion Lab**.

- Variants: **Gen 0 Candidates / Growth Hypotheses**
- Personas: **Behavioral Cohorts**
- Simulation: **Behavioral Stress Test**
- Heatmaps: **Attention Profiler**
- Insights: **Selection Findings**
- Evolution visualization: **Page Evolution Map**
- Gen 2: **Evolved Candidate**
- Validation run: **Validation Retest**

The product avoids claiming to be a literal genetic algorithm. It is evolution-inspired and explainable: behavioral pressure selects useful page traits, selected traits are recombined, small mutations are logged, and the outcome is validated.

## Visual Differentiation

- **A — Outcome:** premium result-led design, grade-lift hero, study-time comparison, improvement timeline.
- **B — Companion:** warm conversational design, tutor chat interaction, supportive pacing.
- **C — Crowd:** dense credibility, enrollment count, university marquee, reviews and ratings.
- **D — Deadline:** countdown, activity feed, social momentum, urgency hierarchy.
- **E — Sandbox:** terminal-style workflow and interactive adaptive demo.

## Technical Architecture

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- canvas-confetti
- Config-driven candidate pages
- Seeded deterministic simulation
- In-memory experiment state; locally persisted Gen 2 preview

Core files:

- `lib/variants.ts`
- `lib/personas.ts`
- `lib/simulation.ts`
- `lib/metrics.ts`
- `lib/evolution.ts`
- `components/landing/*`
- `components/lab/*`
- `app/page.tsx`
- `app/lab/page.tsx`

## Integrity and Limitations

GrowthOS uses synthetic behavioral experiment data. It is a directional hypothesis-testing system, not a substitute for real customer evidence.

Important limitations:

- Personas and behavior weights are assumptions.
- CTA click models intent, not activation, payment, or retention.
- Fitness Scores are relative within a run because inputs are min-max normalized.
- Illustrative testimonials, university names, counts, ratings, and grade claims must be visibly labeled as synthetic demonstration data.
- A production version should connect real analytics, persistent experiment history, live validation guardrails, and controlled traffic allocation.

## Development Workflow

AI-assisted development tools were used as implementation accelerators for scaffolding, component iteration, debugging, and verification. Product strategy, experiment assumptions, visual direction, and final review decisions were actively shaped throughout the build.

