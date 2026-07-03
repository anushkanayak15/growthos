import type { VariantMetrics } from '@/lib/metrics';
import type { Variant } from '@/lib/variants';
import { FitnessChart } from './FitnessChart';
import { Heatmap } from './Heatmap';
import { PersonaBreakdown } from './PersonaBreakdown';
import { Card } from '@/components/ui/Card';

export function MetricsDashboard({ metrics, variants }: { metrics: VariantMetrics[]; variants: Variant[] }) {
  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex items-center justify-between mb-1">
          <p className="font-display text-lg font-medium">Fitness Score</p>
          <div
            className="group relative font-mono text-[11px] text-graphite-soft cursor-help"
            title="Fitness Score = 100 × (0.40·conversion + 0.20·engagement + 0.15·scrollDepth + 0.15·timeOnPage + 0.10·(1−bounce)), each min-max normalized across candidates. Conversion dominates because it's the business outcome; the rest are leading indicators."
          >
            ⓘ weights
          </div>
        </div>
        <p className="text-xs text-graphite-soft mb-2">
          Bars sorted by fitness. Black tick marks show the Wilson 95% confidence interval on conversion rate.
        </p>
        <FitnessChart metrics={metrics} variants={variants} />
      </Card>

      <Card className="p-5">
        <p className="font-display text-lg font-medium mb-1">Behavioral Cohort × candidate conversion</p>
        <p className="text-xs text-graphite-soft mb-3">
          Darker cells convert more within that behavioral cohort; ringed cells are each cohort&apos;s best candidate.
        </p>
        <PersonaBreakdown metrics={metrics} variants={variants} />
      </Card>

      <Card className="p-5">
        <p className="font-display text-lg font-medium mb-1">Attention Profiler</p>
        <p className="text-xs text-graphite-soft mb-3">
          See where behavioral cohorts spend attention, lose momentum, or exit the conversion path.
        </p>
        <Heatmap metrics={metrics} variants={variants} />
      </Card>
    </div>
  );
}
