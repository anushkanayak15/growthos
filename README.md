# GrowthOS

An explainable, evolution-inspired landing-page experimentation lab that simulates behavioral cohorts, evaluates competing page hypotheses, and assembles a validated next version.

## Live Demo

Live demo: https://growthos-plum.vercel.app

## What It Does

GrowthOS is a closed-loop demo of an internal growth experimentation tool. It does not run real-user A/B tests; it models a repeatable synthetic experiment so the full decision pipeline can be inspected end to end.

The flow:

1. Compare five landing-page hypotheses for Scholé AI.
2. Simulate behavioral cohorts against each page.
3. Measure engagement and conversion signals.
4. Extract explainable findings from the run.
5. Assemble Gen 2 with section lineage/provenance.
6. Retest Gen 2 against the original field with a fresh seed.

The core product idea is evidence-backed recombination: the final page is not a black-box generation. It is built from specific sections that performed well under the experiment model, with visible reasons for where each inherited section came from.

## Growth Hypotheses

| Variant | Strategy | Hypothesis | Intended behavioral cohort fit |
|---|---|---|---|
| A | Outcome framing | Exam-stressed students convert on concrete results, not features. | The Achiever: wants measurable grade lift and time savings. |
| B | Emotional resonance | Studying is lonely; belonging beats performance claims. | The Social Learner: responds to reassurance and peer-like support. |
| C | Social proof / authority | Skeptical students need evidence before promises. | The Skeptic: needs trust, proof, and credible claims before acting. |
| D | Urgency / FOMO | Last-minute studiers respond to scarcity and peer pressure. | The Last-Minute: has a short attention budget and responds to deadline-driven CTAs. |
| E | Product-led discovery | Explorers convert when they experience the product before any claim. | The Explorer: spends more time with demos and product detail. |

## Experiment Model

The simulation uses synthetic behavioral cohorts/personas, each with different attention budgets, trust thresholds, bounce tendencies, section triggers, section repels, and urgency sensitivity. A seeded deterministic random generator makes runs reproducible: the same seed produces the same synthetic visitor paths and metrics.

Each Gen 0 candidate receives 10,000 simulated visitors. Visitors pass through a hero-gate check, move section by section, accumulate resonance, spend time based on section type and interest, may bounce, and may convert when they encounter a CTA or urgency bar.

Recorded signals include:

- Conversion
- Bounce
- Scroll depth
- Time on page
- Section dwell
- Section reach
- CTA interaction
- Behavioral cohort conversion

All behavioral and performance data in this demo is synthetic and intended for demonstration only; it is not real customer or university data.

## Evaluation

GrowthOS computes a Growth Fitness Score for each candidate. Each component is min-max normalized across the candidates in that run, then combined with these weights:

| Signal | Weight |
|---|---:|
| Conversion | 40% |
| Engagement | 20% |
| Scroll depth | 15% |
| Time on page | 15% |
| Inverse bounce rate | 10% |

Conversion is weighted most heavily because it is the primary business outcome. Engagement, scroll depth, time on page, and inverse bounce rate act as leading indicators of whether the page is earning attention and trust.

Conversion estimates also include Wilson confidence intervals, which provide a more stable uncertainty range than a simple normal approximation.

## How Gen 2 Evolves

Gen 2 is evolution-inspired, not a full genetic algorithm. The system extracts selection findings from the synthetic run, then recombines useful page traits using deterministic, inspectable rules.

Selection findings look for patterns such as:

- Sections where dwell correlates with conversion
- Sections with weak reach or early drop-off
- CTA styles with stronger conversion
- Behavioral cohorts that underconvert
- Urgency tradeoffs, such as helping Last-Minute students while reducing Skeptic trust
- Product-led demos that hold attention but need a shorter path to CTA

Gen 2 is assembled from real section-level evidence:

- The hero comes from the candidate with the best hero-gate pass rate weighted by downstream conversion.
- Social proof, features, and pricing are selected by section performance using dwell, reach, and page conversion.
- The CTA source comes from the highest-converting candidate.
- Urgency can be retained but moved below trust-building proof when the findings support that sequencing.
- Some sections may be compressed or lightly adjusted, with before/after mutation reasons recorded.

Each Gen 2 section carries provenance showing the parent variant and the reason it was selected. The validation rerun then compares Gen 2 with the original candidates, including the Gen 1 champion, using a fresh seed rather than reusing the first run's numbers.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- canvas-confetti
- pnpm
- Vercel deployment compatibility

## Run Locally

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

To verify a production build:

```bash
pnpm build
```
