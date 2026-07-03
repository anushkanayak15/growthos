# GrowthOS

A/B tests take weeks to reach significance. GrowthOS compresses the loop to minutes: it simulates
persona-driven traffic across five landing-page hypotheses for Scholé AI, an adaptive tutor for
college students, scores each on a Growth Fitness Score, and then evolves a new page — Gen 2 — by
recombining whatever actually worked, section by section, with every choice tagged to its evidence.

**Live demo:** run `vercel --prod` from this directory and drop the URL here, or run locally with the
three commands below. A 30-second walkthrough gif belongs here too once recorded.

## How it works

```
Pages → Simulate → Metrics → Winner → Evolve → Gen 2
```

1. **Pages** — five landing pages for Scholé AI, each a data config (not hardcoded JSX) testing one
   growth principle: outcome framing, emotional resonance, social proof, urgency, and product-led growth.
2. **Simulate** — 10,000 seeded, persona-driven visitors per variant (50,000 total) walk each page:
   a hero-gate check, section-by-section dwell and resonance accumulation, bounce hazard, and CTA
   propensity. Same seed, same result, every time — reproducible and honestly logged (the live ticker
   is sampled straight from real simulation records, not scripted).
3. **Metrics** — conversion rate with a Wilson 95% confidence interval, bounce rate, scroll depth,
   time on page, engagement (mean resonance), a per-section dwell heatmap, and a persona × variant
   conversion matrix.
4. **Winner** — the variant with the highest Growth Fitness Score:

   ```
   GFS = 100 × (0.40·conversion + 0.20·engagement + 0.15·scrollDepth + 0.15·timeOnPage + 0.10·(1−bounce))
   ```

   Each term is min-max normalized across variants first. Conversion dominates the weighting because
   it's the actual business outcome; the rest are leading indicators.
5. **Evolve** — a rules-based, inspectable pipeline (`lib/evolution.ts`):
   - *Insight extraction*: 6 heuristics scan the metrics for patterns (dwell-vs-conversion correlation,
     skip-heavy sections, best-performing CTA style, underconverting personas, urgency's
     lift-most-but-hurts-Skeptics sequencing effect, and demo engagement vs. page length).
   - *Recombination*: Gen 2's hero comes from whichever variant had the best hero-gate pass rate
     weighted by downstream conversion; its social proof, features, and pricing sections each come
     from that section type's strongest performer; the urgency bar is kept but resequenced below the
     trust block instead of leading with it; order is otherwise front-loaded by global mean dwell.
   - *Mutation*: oversized item lists get compressed, headlines gain a concrete number when one's
     available nearby, subheads over 15 words get tightened, and the CTA picks up an urgency word if
     the urgency heuristic scored net-positive. Every mutation is logged with a before/after and reason.
   - Every Gen 2 section carries a `provenance: { parent, reason }` tag, rendered as a small label on
     its live page.
6. **Validate** — Gen 2 is dropped into a fresh simulation run (new seed, all 6 pages) to check it
   actually beats its parents rather than just looking good on paper. This is the step that closes the
   loop — and also the step where the circularity below matters most.

### Persona model (`lib/personas.ts`)

| Persona | Mix | Converts best on | Why |
|---|---|---|---|
| The Skeptic | 20% | C (social proof) | high trust threshold, penalized on urgency |
| The Achiever | 25% | outcome- and urgency-responsive | pragmatic, low trust threshold |
| The Last-Minute | 20% | D (urgency) | short attention budget, urgency-boosted CTA propensity |
| The Explorer | 15% | E (product-led demo) | huge attention budget, rewards depth |
| The Social Learner | 20% | C (testimonials) | triggers on social proof and FAQ |

Each persona simulation draws an attention budget, walks sections accumulating resonance from
per-section-type triggers/repels, faces a bounce hazard each section, and clicks a CTA with
probability `sigmoid(resonance − trustThreshold) × styleModifier × urgencyMultiplier`.

## Honest limitations

- **Simulated ≠ real users.** Every number here comes from a heuristic behavioral model, tuned until
  it produced intuitive results (Skeptics do best on social proof, Last-Minute students respond to
  urgency, Explorers reward the interactive demo). It is a plausible model of student behavior, not a
  measurement of it.
- **The circularity problem.** Gen 2 is evolved from Gen 1's simulated data using the same simulation
  engine, then "validated" by simulating it again with the same engine. A model that's wrong in a
  consistent way will confirm its own mistake at every step. The validation rerun changes the seed (so
  it isn't literally replaying the same numbers) but it can't detect a systematic bias in the underlying
  behavioral assumptions — only real traffic can do that.
- **Section types are coarser than section content.** The simulation reasons about `hero`, `cta`, etc.
  as types, not about *which* hero. It can't distinguish "outcome-framed hero" from "urgency-framed
  hero" except through the copy a human already assigned — the model's granularity is the section
  type, not the narrative.
- **Real-world wiring.** To replace the simulation with reality: fire PostHog (or similar) events for
  section-view, dwell, and CTA-click that match the exact shape of `SectionDwellRecord` and
  `UserRecord` in `lib/simulation.ts`, so `lib/metrics.ts` needs no changes. For live traffic
  allocation, replace the single-shot "run experiment then pick a winner" flow with a Thompson-sampling
  multi-armed bandit: model each variant's conversion as a Beta distribution, route a shrinking share
  of live traffic to the pulled-down arms as the posteriors separate, and let evolution trigger off a
  minimum-sample-size gate rather than a fixed N.

## Run locally

```bash
pnpm install
pnpm dev
pnpm build   # verify a clean production build
```

Then open `http://localhost:3000`, or jump straight to `/lab`.

## Architecture decisions and tradeoffs

- **Config-driven pages, one renderer.** `lib/variants.ts` defines every landing page as data —
  ordered `Section` objects with a `type`, `copy`, and `emphasis`. `SectionRenderer` is the only place
  that turns a section into JSX. This is what makes evolution real: Gen 2 is a new array of sections
  assembled from the same building blocks, rendered by the exact same components as the five
  hand-authored pages, with `provenance` tagging where each section came from.
- **Seeded PRNG (`mulberry32`), no external randomness.** The same experiment seed reproduces the
  exact same simulation, which makes the demo debuggable and the "reroll seed" button an honest proof
  that results aren't cherry-picked rather than a gimmick.
- **No database.** All state lives in React component state for the duration of a session; Gen 2 is
  persisted to `localStorage` only so its full-page preview route (`/variant/G2`) can find it. This
  keeps the app a zero-config Vercel deploy and keeps the "in-memory and deterministic" claim literal.
- **LLM adapter behind a flag.** None of the current UI depends on an LLM call — insight text is
  generated from the same structured `Insight` objects the evolution engine already produces. If an
  `AI_API_KEY` is ever wired in to narrate insights in prose, it should be additive and no-op
  gracefully when unset, so the public demo never depends on a live key.
