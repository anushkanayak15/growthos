import Link from 'next/link';
import { VARIANTS } from '@/lib/variants';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const PIPELINE = ['Hypothesize', 'Simulate', 'Learn', 'Evolve', 'Validate'];

const PERSONAS = [
  {
    id: '01',
    name: 'The Achiever',
    signal: 'Outcome + speed',
    description: 'Wants a measurable grade lift and a faster path to exam readiness.',
  },
  {
    id: '02',
    name: 'The Skeptic',
    signal: 'Proof + trust',
    description: 'Needs credible evidence before believing a promise or clicking a CTA.',
  },
  {
    id: '03',
    name: 'The Last-Minute',
    signal: 'Urgency + action',
    description: 'Responds to deadlines, momentum, and a clear next step right now.',
  },
  {
    id: '04',
    name: 'The Explorer',
    signal: 'Product discovery',
    description: 'Stays longer when they can interact with the product before committing.',
  },
  {
    id: '05',
    name: 'The Social Learner',
    signal: 'Belonging + proof',
    description: 'Looks for testimonials, peer behavior, and reassurance from people like them.',
  },
];

const PERSONA_FIT: Record<string, string> = {
  A: 'Best bet: The Achiever',
  B: 'Best bet: The Social Learner',
  C: 'Best bet: The Skeptic',
  D: 'Best bet: The Last-Minute',
  E: 'Best bet: The Explorer',
};

const TRADITIONAL_TESTING = [
  'Wait for enough real traffic',
  'Run one test at a time',
  'Learn after weeks, not moments',
  'Lose time when a page underperforms',
];

const GROWTHOS_TESTING = [
  'Model behavior before spending traffic',
  'Compare five distinct hypotheses',
  'Extract behavioral patterns immediately',
  'Generate and validate a stronger next version',
];

const INSIGHTS = [
  {
    principle: 'SOCIAL PROOF',
    finding: 'Skeptics responded more strongly to proof than to urgency.',
    recommendation: 'Move testimonials and evidence above the fold.',
    accent: '#2f6f4f',
  },
  {
    principle: 'PRODUCT-LED',
    finding: 'Explorers spent longer in interactive product moments.',
    recommendation: 'Shorten the path from demo engagement to CTA.',
    accent: '#3457d5',
  },
  {
    principle: 'URGENCY',
    finding: 'Urgency lifted Last-Minute conversion but reduced Skeptic trust.',
    recommendation: 'Sequence urgency after a trust-building section.',
    accent: '#c62828',
  },
];

export default function Home() {
  return (
    <div className="flex-1 overflow-hidden bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-lg font-medium tracking-tight">
          GrowthOS
        </Link>

        <Link href="/lab">
          <Button variant="secondary">Enter the lab →</Button>
        </Link>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pb-20 pt-12 lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:pt-20">
          <div>
            <Badge tone="accent" className="mb-5">
              Product under test: Scholé AI
            </Badge>
            <p className="mb-4 max-w-xl font-mono text-[11px] uppercase tracking-[0.14em] text-graphite-soft">
              Synthetic experiment data for demonstration — not real customer outcomes.
            </p>

            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-graphite-soft">
              Autonomous experimentation for growth teams
            </p>

            <h1 className="font-display text-5xl font-medium leading-[0.98] tracking-[-0.045em] md:text-6xl lg:text-7xl">
              What if your landing page improved itself while you slept?
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite-soft md:text-xl">
              Launch 5 growth hypotheses. Simulate 50,000 students. Wake up with a better
              page—built from the behavioral evidence, not a hunch.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/lab">
                <Button size="lg">▶ Run the growth experiment</Button>
              </Link>

              <div className="flex items-center gap-2 text-sm text-graphite-soft">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#3457d5]" />
                Seeded, deterministic simulation
              </div>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-hairline pt-5">
              <div>
                <p className="font-display text-2xl font-medium">5</p>
                <p className="mt-1 text-xs text-graphite-soft">growth hypotheses</p>
              </div>
              <div>
                <p className="font-display text-2xl font-medium">50K</p>
                <p className="mt-1 text-xs text-graphite-soft">simulated visitors</p>
              </div>
              <div>
                <p className="font-display text-2xl font-medium">1</p>
                <p className="mt-1 text-xs text-graphite-soft">evolved Gen 2 page</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.25rem] bg-[#3457d5]/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-[#27272a] bg-[#18181b] p-5 text-white shadow-[0_28px_90px_rgba(24,24,27,0.22)] md:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#66d17c]" />
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-white/60">
                    Live experiment
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/45">
                  Seed 42
                </span>
              </div>

              <div className="mt-5 grid grid-cols-5 gap-2">
                {VARIANTS.map((variant) => (
                  <div
                    key={variant.id}
                    className="rounded-lg border border-white/10 bg-white/[0.05] px-2 py-3 text-center"
                  >
                    <div
                      className="mx-auto mb-2 h-2 w-2 rounded-full"
                      style={{ backgroundColor: variant.theme.accent }}
                    />
                    <p className="font-mono text-xs text-white/80">{variant.id}</p>
                  </div>
                ))}
              </div>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                  simulate
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                      Behavioral sample
                    </p>
                    <p className="mt-1 font-display text-3xl font-medium">50,000</p>
                    <p className="text-sm text-white/55">persona-driven visits</p>
                  </div>
                  <div className="flex gap-1">
                    {[38, 64, 47, 84, 56, 92, 72].map((height, index) => (
                      <span
                        key={index}
                        className="w-2 rounded-sm bg-[#7590ff]"
                        style={{ height: `${height / 2}px`, opacity: 0.45 + index * 0.07 }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                  learn + evolve
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="rounded-xl border border-[#5c8b6a]/45 bg-[#2f6f4f]/20 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#9cd6af]">
                    Winner
                  </p>
                  <p className="mt-1 font-display text-lg">Variant C</p>
                  <p className="text-xs text-white/50">proof earns trust</p>
                </div>

                <span className="font-mono text-lg text-white/40">→</span>

                <div className="rounded-xl border border-[#8b7ee9]/50 bg-[#7c3aed]/20 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#c2baff]">
                    Gen 2
                  </p>
                  <p className="mt-1 font-display text-lg">Evolved</p>
                  <p className="text-xs text-white/50">validated lift</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <span className="text-sm text-white/60">Result</span>
                <span className="font-mono text-xs uppercase tracking-wider text-[#9cd6af]">
                  Gen 2 beats its parents
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-hairline bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#3457d5]">
                Why GrowthOS exists
              </p>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
                Traditional A/B testing is slow because learning depends on waiting.
              </h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-hairline bg-background p-6">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-graphite-soft">
                    Traditional testing
                  </p>
                  <span className="rounded-full border border-hairline px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-graphite-soft">
                    reactive
                  </span>
                </div>

                <p className="mt-5 font-display text-2xl font-medium">
                  Launch. Wait. Hope traffic teaches you something.
                </p>

                <ul className="mt-6 space-y-3">
                  {TRADITIONAL_TESTING.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-graphite-soft">
                      <span className="mt-0.5 text-[#c62828]">×</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[#3457d5]/35 bg-[#3457d5] p-6 text-white shadow-[0_16px_40px_rgba(52,87,213,0.18)]">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/65">
                    GrowthOS
                  </p>
                  <span className="rounded-full border border-white/25 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white/80">
                    proactive
                  </span>
                </div>

                <p className="mt-5 font-display text-2xl font-medium">
                  Generate hypotheses. Simulate behavior. Ship a better bet.
                </p>

                <ul className="mt-6 space-y-3">
                  {GROWTHOS_TESTING.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-white/80">
                      <span className="mt-0.5 text-[#b7c6ff]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#3457d5]">
                The learning loop
              </p>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
                Not a static dashboard. An experiment that closes the loop.
              </h2>
            </div>
            <Link href="/lab" className="text-sm font-medium underline underline-offset-4">
              See the full lab →
            </Link>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-5">
            {PIPELINE.map((step, index) => (
              <div key={step} className="relative rounded-2xl border border-hairline bg-surface p-4">
                <p className="font-mono text-xs text-graphite-soft">0{index + 1}</p>
                <p className="mt-5 font-display text-lg font-medium">{step}</p>
                <p className="mt-2 text-sm leading-relaxed text-graphite-soft">
                  {
                    [
                      'Frame each page as a behavioral bet.',
                      'Model persona-driven visits at scale.',
                      'Measure conversion and leading indicators.',
                      'Extract the strongest behavioral signal.',
                      'Validate a better page against the field.',
                    ][index]
                  }
                </p>

                {index < PIPELINE.length - 1 && (
                  <span className="absolute -right-2 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 rounded-full border border-hairline bg-background text-center font-mono text-[10px] leading-[14px] text-graphite-soft md:block">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-hairline bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#3457d5]">
                  Five strategic bets
                </p>
                <h2 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
                  Same product. Five completely different beliefs about why people convert.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-graphite-soft">
                These are not cosmetic headline swaps. Each variant changes the psychological
                lever, CTA style, page structure, and expected audience fit.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {VARIANTS.map((variant) => (
                <Link
                  key={variant.id}
                  href={`/variant/${variant.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-2xl border border-hairline bg-background p-5 transition-all hover:-translate-y-1 hover:border-graphite-soft/40 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: variant.theme.accent }}
                      />
                      <span className="font-mono text-xs uppercase tracking-wider text-graphite-soft">
                        Variant {variant.id}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-graphite-soft transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </div>

                  <p className="mt-5 font-display text-xl font-medium">{variant.name}</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: variant.theme.accent }}>
                    {variant.strategy}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-graphite-soft">
                    {variant.hypothesis}
                  </p>

                  <div className="mt-5 border-t border-hairline pt-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite-soft">
                      Expected audience fit
                    </p>
                    <p className="mt-1 text-sm font-medium">{PERSONA_FIT[variant.id]}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#3457d5]">
              Simulated users, not generic traffic
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
              Every visit has a motivation, an attention budget, and a reason to leave.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-graphite-soft">
              GrowthOS models distinct behaviors rather than treating every click as identical.
              This makes the output useful for learning which message works for whom.
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {PERSONAS.map((persona) => (
              <div key={persona.id} className="rounded-2xl border border-hairline bg-surface p-4">
                <p className="font-mono text-xs text-graphite-soft">{persona.id}</p>
                <p className="mt-5 font-display text-lg font-medium">{persona.name}</p>
                <p className="mt-2 text-xs font-medium text-[#3457d5]">{persona.signal}</p>
                <p className="mt-3 text-sm leading-relaxed text-graphite-soft">
                  {persona.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-[#27272a] bg-[#18181b] text-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#aab8ff]">
                  Explainability built in
                </p>
                <h2 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-5xl">
                  What the Engine Learned Overnight
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
                  The system does not just name a winner. It turns behavioral patterns into
                  specific page changes, then reruns the experiment to validate the recommendation.
                </p>

                <Link href="/lab" className="mt-7 inline-block">
                  <Button variant="secondary">Watch the full evolution →</Button>
                </Link>
              </div>

              <div className="space-y-3">
                {INSIGHTS.map((insight, index) => (
                  <div
                    key={insight.principle}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition-colors hover:bg-white/[0.08]"
                  >
                    <div
                      className="absolute bottom-0 left-0 top-0 w-1"
                      style={{ backgroundColor: insight.accent }}
                    />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 animate-pulse rounded-full"
                            style={{ backgroundColor: insight.accent }}
                          />
                          <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/55">
                            {insight.principle}
                          </p>
                        </div>
                        <p className="mt-3 font-display text-lg font-medium">{insight.finding}</p>
                        <p className="mt-2 text-sm leading-relaxed text-white/60">
                          <span className="font-medium text-white/85">Recommendation:</span>{' '}
                          {insight.recommendation}
                        </p>
                      </div>
                      <span className="font-mono text-xs text-white/35">0{index + 1}</span>
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl border border-[#9d90ff]/45 bg-[#7c3aed]/20 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-[#c9c2ff]">
                    Gen 2 decision
                  </p>
                  <p className="mt-2 font-display text-xl font-medium">
                    Lead with proof. Preserve urgency after trust. Keep the CTA path short.
                  </p>
                  <p className="mt-2 text-sm text-white/65">
                    Every inherited section carries provenance so the recommendation remains
                    inspectable, not black-box.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#3457d5]">
            Ready to stop waiting?
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-medium tracking-tight md:text-5xl">
            Stop waiting weeks for landing-page answers.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-graphite-soft">
            Watch five growth beliefs compete, see the system explain what it learned, and validate
            the next best version in one continuous loop.
          </p>

          <div className="mt-8">
            <Link href="/lab">
              <Button size="lg">▶ Run the growth experiment</Button>
            </Link>
          </div>

          <p className="mt-7 text-xs text-graphite-soft">
            No database. Deterministic seeds reproduce the exact same experiment every time.
          </p>
        </section>
      </main>
    </div>
  );
}
