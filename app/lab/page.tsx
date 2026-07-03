'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { VARIANTS, type Variant } from '@/lib/variants';
import { simulateAll, simulateVariant, type VariantSimulationResult } from '@/lib/simulation';
import { computeVariantMetrics, computeFitnessScores, allSectionIdsFor, type VariantMetrics } from '@/lib/metrics';
import { evolve, type EvolutionResult, type Insight } from '@/lib/evolution';
import { PipelineStepper, type Step } from '@/components/lab/PipelineStepper';
import { VariantThumb } from '@/components/lab/VariantThumb';
import { SimulationPlayback } from '@/components/lab/SimulationPlayback';
import { MetricsDashboard } from '@/components/lab/MetricsDashboard';
import { InsightCard } from '@/components/lab/InsightCard';
import { EvolutionTree } from '@/components/lab/EvolutionTree';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { GEN2_STORAGE_KEY } from '@/lib/gen2Storage';

function randomSeed() {
  return Math.floor(Math.random() * 900_000) + 100_000;
}

export default function LabPage() {
  const [seed, setSeed] = useState(42);
  const [step, setStep] = useState<Step>('pages');
  const [gen1Results, setGen1Results] = useState<VariantSimulationResult[] | null>(null);
  const [gen1Metrics, setGen1Metrics] = useState<VariantMetrics[] | null>(null);
  const [evoResult, setEvoResult] = useState<EvolutionResult | null>(null);
  const [validationMetrics, setValidationMetrics] = useState<VariantMetrics[] | null>(null);
  const [allVariantsWithGen2, setAllVariantsWithGen2] = useState<Variant[] | null>(null);
  const winnerFired = useRef(false);
  const gen2Fired = useRef(false);

  const winner = useMemo(() => {
    if (!gen1Metrics) return null;
    return [...gen1Metrics].sort((a, b) => (b.fitness ?? 0) - (a.fitness ?? 0))[0];
  }, [gen1Metrics]);

  function runExperiment() {
    const results = simulateAll(VARIANTS, seed);
    const metrics = computeFitnessScores(
      results.map((r) => computeVariantMetrics(r, allSectionIdsFor(VARIANTS.find((v) => v.id === r.variantId)!.sections)))
    );
    setGen1Results(results);
    setGen1Metrics(metrics);
    setStep('simulating');
  }

  function rerollSeed() {
    setSeed(randomSeed());
  }

  useEffect(() => {
    if (step === 'winner' && !winnerFired.current) {
      winnerFired.current = true;
      confetti({ particleCount: 140, spread: 70, origin: { y: 0.6 } });
    }
  }, [step]);

  function runEvolution() {
    if (!gen1Results || !gen1Metrics) return;
    const result = evolve({ variants: VARIANTS, results: gen1Results, metrics: gen1Metrics });
    setEvoResult(result);
    try {
      localStorage.setItem(GEN2_STORAGE_KEY, JSON.stringify(result.gen2));
    } catch {
      // localStorage unavailable (e.g. private browsing) — the preview link will just show a fallback.
    }
    setStep('evolve');
  }

  function runValidation() {
    if (!evoResult) return;
    const freshSeed = randomSeed();
    const gen1Fresh = VARIANTS.map((v, i) => simulateVariant(v, freshSeed + i * 104729));
    const gen2Fresh = simulateVariant(evoResult.gen2, freshSeed + 999_999);
    const allResults = [...gen1Fresh, gen2Fresh];
    const allVariants = [...VARIANTS, evoResult.gen2];
    const metrics = computeFitnessScores(
      allResults.map((r) => computeVariantMetrics(r, allSectionIdsFor(allVariants.find((v) => v.id === r.variantId)!.sections)))
    );
    setValidationMetrics(metrics);
    setAllVariantsWithGen2(allVariants);
    setStep('validate');
  }

  useEffect(() => {
    if (step === 'validate' && validationMetrics && !gen2Fired.current) {
      const gen2 = validationMetrics.find((m) => m.variantId === 'G2');
      const bestParent = Math.max(...validationMetrics.filter((m) => m.variantId !== 'G2').map((m) => m.fitness ?? 0));
      if (gen2 && (gen2.fitness ?? 0) > bestParent) {
        gen2Fired.current = true;
        setTimeout(() => confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#7c3aed', '#3355ff', '#e8720c'] }), 400);
      }
    }
  }, [step, validationMetrics]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-hairline bg-background/90 backdrop-blur px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-display font-medium text-sm">
            GrowthOS
          </Link>
          <span className="text-graphite-soft text-sm">▸ Scholé AI experiment</span>
          <span className="hidden max-w-xs font-mono text-[10px] uppercase tracking-wider text-graphite-soft md:inline">
            Synthetic experiment data for demonstration — not real customer outcomes.
          </span>
          <button
            onClick={rerollSeed}
            disabled={step !== 'pages'}
            className="font-mono text-xs rounded-full border border-hairline px-2.5 py-1 text-graphite-soft hover:text-graphite disabled:opacity-40"
            title="Reroll experiment seed"
          >
            seed: {seed} ⟳
          </button>
        </div>
        <PipelineStepper current={step} />
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {step === 'pages' && (
          <section>
            <h1 className="font-display text-2xl font-medium mb-1">Five hypotheses</h1>
            <p className="text-sm text-graphite-soft mb-6 max-w-2xl">
              Each variant is a config-driven landing page testing one growth principle for Scholé AI. Click through any of them, then run the experiment to simulate 10,000 persona-driven visitors per page.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {VARIANTS.map((v) => (
                <VariantThumb key={v.id} variant={v} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button size="lg" onClick={runExperiment}>
                ▶ Run Growth Experiment
              </Button>
            </div>
          </section>
        )}

        {step === 'simulating' && gen1Results && (
          <SimulationPlayback results={gen1Results} seed={seed} onDone={() => setStep('metrics')} />
        )}

        {step === 'metrics' && gen1Metrics && (
          <section>
            <h1 className="font-display text-2xl font-medium mb-1">Dashboard</h1>
            <p className="text-sm text-graphite-soft mb-6">
              {gen1Results!.reduce((s, r) => s + r.users.length, 0).toLocaleString()} simulated visitors across 5 variants, seed {seed}.
            </p>
            <MetricsDashboard metrics={gen1Metrics} variants={VARIANTS} />
            <div className="mt-8 text-center">
              <Button size="lg" onClick={() => setStep('winner')}>
                Reveal Winner
              </Button>
            </div>
          </section>
        )}

        {step === 'winner' && winner && gen1Metrics && (
          <section className="text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-graphite-soft mb-2">Gen 1 champion</p>
            <div className="inline-flex items-center gap-3 mb-2">
              <h1 className="font-display text-4xl font-medium">
                Variant {winner.variantId} — {VARIANTS.find((v) => v.id === winner.variantId)?.name}
              </h1>
            </div>
            <p className="text-graphite-soft mb-8">
              Growth Fitness Score {winner.fitness?.toFixed(1)} · {(winner.conversion.point * 100).toFixed(1)}% conversion
            </p>

            <Card className="text-left max-w-3xl mx-auto p-5">
              <p className="font-display text-xl font-medium">What the Engine Learned Overnight</p>
              <p className="text-sm text-graphite-soft mb-4">
                Not just which page won — what behavior changed the next version.
              </p>
              <div className="space-y-3">
                {evoPreviewInsights(gen1Metrics).map((insight, i) => (
                  <InsightCard key={i} insight={insight} index={i} />
                ))}
              </div>
            </Card>

            <div className="mt-8">
              <Button size="lg" onClick={runEvolution}>
                Evolve to Gen 2 →
              </Button>
            </div>
          </section>
        )}

        {step === 'evolve' && evoResult && (
          <section>
            <h1 className="font-display text-2xl font-medium mb-1">Evolution</h1>
            <p className="text-sm text-graphite-soft mb-6 max-w-2xl">
              Gen 2 is assembled section by section from the strongest performer of each type, re-ordered by dwell, then
              lightly mutated. Every section is tagged with its provenance.
            </p>

            <UrgencyTradeoffCard insight={evoResult.insights.find((insight) => insight.principle === 'urgency')} />

            <Card className="p-5 mb-6">
              <EvolutionTree gen2={evoResult.gen2} variants={VARIANTS} />
            </Card>

            <Card className="p-5 mb-6">
              <p className="font-display text-lg font-medium mb-3">All insights detected</p>
              <div className="space-y-3">
                {evoResult.insights.map((insight, i) => (
                  <InsightCard key={i} insight={insight} index={i} />
                ))}
              </div>
            </Card>

            {evoResult.mutations.length > 0 && (
              <Card className="p-5 mb-6">
                <p className="font-display text-lg font-medium mb-3">Mutations applied</p>
                <div className="space-y-2">
                  {evoResult.mutations.map((m, i) => (
                    <div key={i} className="text-sm border-l-2 pl-3" style={{ borderColor: 'var(--accent)' }}>
                      <p className="font-mono text-xs text-graphite-soft">{m.field}</p>
                      <p className="text-graphite-soft">
                        <span className="line-through opacity-60">{m.before}</span> → <span className="text-graphite">{m.after}</span>
                      </p>
                      <p className="text-xs text-graphite-soft italic">{m.reason}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <div className="text-center flex items-center justify-center gap-3">
              <Link href="/variant/G2" target="_blank">
                <Button variant="secondary" size="lg">
                  Preview Gen 2 page ↗
                </Button>
              </Link>
              <Button size="lg" onClick={runValidation}>
                Validate Gen 2 →
              </Button>
            </div>
          </section>
        )}

        {step === 'validate' && validationMetrics && allVariantsWithGen2 && (
          <section>
            <h1 className="font-display text-2xl font-medium mb-1">Gen 2 vs Gen 1 champion</h1>
            <p className="text-sm text-graphite-soft mb-6">
              Fresh seed, full rerun including Gen 2 — this closes the loop honestly rather than reusing Gen 1&apos;s numbers.
            </p>
            <Card className="p-5 mb-6">
              <MetricsDashboard metrics={validationMetrics} variants={allVariantsWithGen2} />
            </Card>
            <ValidationVerdict metrics={validationMetrics} />
            {evoResult && (
              <BeforeAfterArtifact
                metrics={validationMetrics}
                variants={allVariantsWithGen2}
                evolution={evoResult}
              />
            )}
            <div className="mt-6 text-center">
              <Link href="/variant/G2" target="_blank">
                <Button size="lg">View the winning page ↗</Button>
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function BeforeAfterArtifact({
  metrics,
  variants,
  evolution,
}: {
  metrics: VariantMetrics[];
  variants: Variant[];
  evolution: EvolutionResult;
}) {
  const gen2 = metrics.find((m) => m.variantId === 'G2');
  const champion = [...metrics.filter((m) => m.variantId !== 'G2')].sort((a, b) => (b.fitness ?? 0) - (a.fitness ?? 0))[0];
  if (!gen2 || !champion) return null;

  const championVariant = variants.find((v) => v.id === champion.variantId);
  const fitnessDelta = (gen2.fitness ?? 0) - (champion.fitness ?? 0);
  const changes = evidenceBackedChanges(evolution);

  return (
    <Card className="mt-6 border-accent/25 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-graphite-soft">Before → After</p>
          <h2 className="mt-1 font-display text-2xl font-medium">Gen 1 champion vs Gen 2</h2>
        </div>
        <Badge tone={fitnessDelta >= 0 ? 'good' : 'neutral'}>
          {fitnessDelta >= 0 ? '+' : ''}
          {fitnessDelta.toFixed(1)} fitness
        </Badge>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
        <div className="rounded-xl border border-hairline bg-background p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-graphite-soft">Before</p>
          <p className="mt-2 font-display text-lg font-medium">
            Variant {champion.variantId} — {championVariant?.name ?? champion.variantId}
          </p>
          <p className="mt-1 text-sm text-graphite-soft">
            Growth Fitness Score {champion.fitness?.toFixed(1)}
          </p>
        </div>
        <div className="hidden items-center px-1 font-mono text-xl text-graphite-soft md:flex">→</div>
        <div className="rounded-xl border border-accent/25 bg-accent-soft/50 p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-accent">After</p>
          <p className="mt-2 font-display text-lg font-medium">Gen 2 — The Evolved Page</p>
          <p className="mt-1 text-sm text-graphite-soft">
            Growth Fitness Score {gen2.fitness?.toFixed(1)}
          </p>
        </div>
      </div>

      {changes.length > 0 && (
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {changes.map((change) => (
            <div key={change.label} className="rounded-xl border border-hairline bg-surface p-3">
              <p className="font-display text-sm font-medium">{change.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-graphite-soft">{change.evidence}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function evidenceBackedChanges(evolution: EvolutionResult) {
  const changes: { label: string; evidence: string }[] = [];
  const urgencyInsight = evolution.insights.find((insight) => insight.principle === 'urgency');
  const socialProof = evolution.gen2.sections.find((section) => section.type === 'socialProof');
  const urgency = evolution.gen2.sections.find((section) => section.type === 'urgencyBar');
  const compression = evolution.mutations.find((mutation) =>
    /items|compress|cut|short/i.test(`${mutation.field} ${mutation.reason}`)
  );

  if (socialProof?.provenance) {
    changes.push({
      label: 'Proof moved earlier',
      evidence: `From ${socialProof.provenance.parent}: ${socialProof.provenance.reason}`,
    });
  }

  if (urgency && urgencyInsight) {
    changes.push({
      label: 'Urgency sequenced after trust',
      evidence: urgencyInsight.evidence,
    });
  }

  if (compression) {
    changes.push({
      label: 'Path to CTA shortened',
      evidence: `${compression.before} → ${compression.after}; ${compression.reason}`,
    });
  }

  for (const section of evolution.gen2.sections) {
    if (changes.length >= 3) break;
    if (!section.provenance || section.type === 'socialProof' || section.type === 'urgencyBar') continue;
    changes.push({
      label: `${section.type} carried forward`,
      evidence: `From ${section.provenance.parent}: ${section.provenance.reason}`,
    });
  }

  return changes.slice(0, 3);
}

function UrgencyTradeoffCard({ insight }: { insight?: Insight }) {
  if (!insight) return null;

  return (
    <Card className="mb-6 border-warn/30 bg-warn/5 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-warn">Tradeoff detected</p>
          <p className="mt-2 font-display text-xl font-medium text-graphite">
            Urgency increased conversion for Last-Minute Students, but reduced Skeptic trust.
          </p>
        </div>
        <div className="h-2 w-2 rounded-full bg-warn md:mt-2" />
      </div>
      <p className="mt-4 text-sm text-graphite">{insight.evidence}</p>
      <p className="mt-3 text-sm font-medium text-graphite">
        Decision: keep urgency, but place it after social proof in Gen 2.
      </p>
    </Card>
  );
}

function evoPreviewInsights(metrics: VariantMetrics[]) {
  // A lightweight preview shown at the winner step, before the full evolve() run.
  const best = [...metrics].sort((a, b) => (b.fitness ?? 0) - (a.fitness ?? 0));
  const top = best[0];
  const bottom = best[best.length - 1];
  return [
    {
      principle: 'cta-placement' as const,
      evidence: `${top.variantId} converts at ${(top.conversion.point * 100).toFixed(1)}%, the best of any variant tested`,
      magnitude: top.conversion.point,
      action: `Gen 2 will borrow ${top.variantId}'s highest-converting elements`,
      sourceVariant: top.variantId,
    },
    {
      principle: 'friction' as const,
      evidence: `${bottom.variantId} trails the field at ${(bottom.conversion.point * 100).toFixed(1)}% conversion despite ${bottom.avgTimeOnPage.toFixed(0)}s average time on page`,
      magnitude: 1 - bottom.conversion.point,
      action: `Gen 2 will cut or compress ${bottom.variantId}'s weakest sections`,
      sourceVariant: bottom.variantId,
    },
  ];
}

function ValidationVerdict({ metrics }: { metrics: VariantMetrics[] }) {
  const gen2 = metrics.find((m) => m.variantId === 'G2');
  const bestParent = [...metrics.filter((m) => m.variantId !== 'G2')].sort((a, b) => (b.fitness ?? 0) - (a.fitness ?? 0))[0];
  if (!gen2 || !bestParent) return null;
  const overtook = (gen2.fitness ?? 0) > (bestParent.fitness ?? 0);

  return (
    <div className="text-center">
      <Badge tone={overtook ? 'good' : 'neutral'}>
        {overtook
          ? `Gen 2 overtakes ${bestParent.variantId}: ${gen2.fitness?.toFixed(1)} vs ${bestParent.fitness?.toFixed(1)} fitness`
          : `Gen 2 (${gen2.fitness?.toFixed(1)}) is close behind ${bestParent.variantId} (${bestParent.fitness?.toFixed(1)}) this run`}
      </Badge>
    </div>
  );
}
