'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { Insight, Mutation } from '@/lib/evolution';
import type { VariantMetrics } from '@/lib/metrics';
import type { Section, SectionType, Variant } from '@/lib/variants';
import { Badge } from '@/components/ui/Badge';

const SECTION_LABEL: Record<SectionType, string> = {
  hero: 'Hero',
  socialProof: 'Proof',
  features: 'Features',
  demo: 'Demo',
  pricing: 'Pricing',
  faq: 'FAQ',
  urgencyBar: 'Urgency',
  cta: 'CTA',
};

export function EvolutionTree({
  gen2,
  variants,
  metrics,
  insights,
  mutations,
  validationMetrics,
}: {
  gen2: Variant;
  variants: Variant[];
  metrics: VariantMetrics[];
  insights: Insight[];
  mutations: Mutation[];
  validationMetrics?: VariantMetrics[];
}) {
  const prefersReducedMotion = useReducedMotion();
  const sourceKeys = new Set(gen2.sections.map((section) => sourceKey(section)));
  const gen1Champion = bestMetric(metrics);
  const validationChampion = validationMetrics ? bestMetric(validationMetrics.filter((metric) => metric.variantId !== 'G2')) : null;
  const gen2Metric = validationMetrics?.find((metric) => metric.variantId === 'G2') ?? null;
  const champion = validationChampion ?? gen1Champion;
  const championVariant = variants.find((variant) => variant.id === champion?.variantId);
  const selectedCount = gen2.sections.filter((section) => section.provenance).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-graphite-soft">Page Evolution Map</p>
          <h2 className="mt-1 font-display text-2xl font-medium">The Evolved Candidate inherits the strongest page traits</h2>
          <p className="mt-1 max-w-2xl text-sm text-graphite-soft">
            The Evolved Candidate inherits the strongest page traits from experiment evidence, not intuition.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-right">
          <MetricPill
            label="Gen 0 champion"
            value={champion ? `${championVariant?.id ?? champion.variantId} · ${champion.fitness?.toFixed(1)}` : 'pending'}
          />
          <MetricPill label="Evolved fitness" value={gen2Metric ? gen2Metric.fitness?.toFixed(1) ?? 'pending' : 'pending'} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_72px_minmax(280px,0.72fr)] lg:items-start">
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <VariantBlueprint
              key={variant.id}
              variant={variant}
              metric={metrics.find((metric) => metric.variantId === variant.id)}
              sourceKeys={sourceKeys}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>

        <div className="hidden h-full min-h-[320px] items-center justify-center lg:flex">
          <div className="relative h-full w-full">
            <div className="absolute left-1/2 top-6 h-[calc(100%-48px)] w-px -translate-x-1/2 bg-hairline" />
            {Array.from({ length: Math.max(1, selectedCount) }).map((_, index) => (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="absolute left-1/2 h-px w-12 -translate-x-1/2 bg-accent/45"
                style={{ top: `${18 + (index / Math.max(1, selectedCount - 1)) * 64}%` }}
              >
                <span className="absolute -right-1 -top-[3px] h-1.5 w-1.5 rotate-45 border-r border-t border-accent/60" />
              </motion.div>
            ))}
          </div>
        </div>

        <EvolvedBlueprint
          gen2={gen2}
          variants={variants}
          insights={insights}
          mutations={mutations}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-background px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-wider text-graphite-soft">{label}</p>
      <p className="mt-1 font-display text-lg font-medium text-graphite">{value}</p>
    </div>
  );
}

function VariantBlueprint({
  variant,
  metric,
  sourceKeys,
  index,
  prefersReducedMotion,
}: {
  variant: Variant;
  metric?: VariantMetrics;
  sourceKeys: Set<string>;
  index: number;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border border-hairline bg-background p-3"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs text-white"
            style={{ backgroundColor: variant.theme.accent }}
          >
            {variant.id}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{variant.name}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-graphite-soft">
              {metric?.fitness !== undefined ? `${metric.fitness.toFixed(1)} fitness` : 'source page'}
            </p>
          </div>
        </div>
        <Badge tone="neutral">{variant.sections.length} sections</Badge>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {variant.sections.map((section, sectionIndex) => {
          const sectionMetric = metric?.sectionDwell[section.id];
          const selected = sourceKeys.has(`${variant.id}:${section.type}`);
          return (
            <motion.div
              key={section.id}
              initial={prefersReducedMotion || !selected ? false : { opacity: 0.72, x: -8 }}
              animate={prefersReducedMotion || !selected ? undefined : { opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + sectionIndex * 0.035 }}
              className="relative min-w-[74px] rounded-lg border px-2 py-2"
              style={{
                borderColor: selected ? variant.theme.accent : 'var(--hairline)',
                background: selected ? `${variant.theme.accent}14` : 'var(--surface)',
                boxShadow: selected ? `0 0 0 1px ${variant.theme.accent}24` : undefined,
              }}
            >
              <div
                className="absolute inset-x-0 bottom-0 rounded-b-lg"
                style={{
                  height: `${sectionMetric ? Math.max(18, Math.min(100, sectionMetric.reachRate * 100)) : 18}%`,
                  background: selected ? `${variant.theme.accent}1f` : 'rgba(22,24,28,0.04)',
                }}
              />
              <div className="relative">
                <p className="font-mono text-[10px] uppercase tracking-wider text-graphite-soft">
                  {SECTION_LABEL[section.type]}
                </p>
                <p className="mt-1 font-mono text-[10px] text-graphite-soft">
                  {sectionMetric ? `${sectionMetric.meanDwell.toFixed(1)}s · ${Math.round(sectionMetric.reachRate * 100)}%` : 'no attention data'}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function EvolvedBlueprint({
  gen2,
  variants,
  insights,
  mutations,
  prefersReducedMotion,
}: {
  gen2: Variant;
  variants: Variant[];
  insights: Insight[];
  mutations: Mutation[];
  prefersReducedMotion: boolean | null;
}) {
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
      transition={{ delay: 0.24 }}
      className="rounded-2xl border-2 bg-surface p-4"
      style={{ borderColor: gen2.theme.accent }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <Badge tone="accent">Evolved Candidate</Badge>
          <p className="mt-2 font-display text-lg font-medium">{gen2.name}</p>
        </div>
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: gen2.theme.accent }} />
      </div>

      <ol className="space-y-2">
        {gen2.sections.map((section, index) => {
          const parent = variants.find((variant) => variant.id === section.provenance?.parent);
          return (
            <motion.li
              key={section.id}
              initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ delay: 0.32 + index * 0.06 }}
              className="rounded-xl border border-hairline bg-background p-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: parent?.theme.accent ?? 'var(--accent)' }}
                />
                <p className="font-mono text-[10px] uppercase tracking-wider text-graphite-soft">
                  {SECTION_LABEL[section.type]} from {section.provenance?.parent ?? 'Evolved Candidate'}
                </p>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-graphite">{sectionReason(section, insights, mutations)}</p>
            </motion.li>
          );
        })}
      </ol>
    </motion.div>
  );
}

function bestMetric(metrics: VariantMetrics[]) {
  return [...metrics].sort((a, b) => (b.fitness ?? 0) - (a.fitness ?? 0))[0] ?? null;
}

function sourceKey(section: Section) {
  return section.provenance ? `${section.provenance.parent}:${section.type}` : `G2:${section.type}`;
}

function sectionReason(section: Section, insights: Insight[], mutations: Mutation[]) {
  if (section.provenance?.reason) return section.provenance.reason;

  const relatedMutation = mutations.find((mutation) => mutation.field.startsWith(section.id));
  if (relatedMutation) return relatedMutation.reason;

  const relatedInsight = insights.find((insight) => insight.sourceVariant === section.provenance?.parent);
  if (relatedInsight) return relatedInsight.action;

  return 'selected for the evolved page sequence';
}
