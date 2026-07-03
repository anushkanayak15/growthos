import { motion } from 'framer-motion';
import type { Insight } from '@/lib/evolution';
import { Badge } from '@/components/ui/Badge';

const PRINCIPLE_LABEL: Record<Insight['principle'], string> = {
  'social-proof': 'Social proof',
  urgency: 'Urgency sequencing',
  'outcome-framing': 'Outcome framing',
  'product-led': 'Product-led',
  friction: 'Friction',
  'cta-placement': 'CTA placement',
};

const PRINCIPLE_OBSERVATION: Record<Insight['principle'], string> = {
  'social-proof': 'Students responded to proof before promises',
  urgency: 'Time pressure changed attention patterns',
  'outcome-framing': 'Outcome-first copy created clearer intent',
  'product-led': 'Interactive product moments earned deeper engagement',
  friction: 'High attention did not always become action',
  'cta-placement': 'The strongest next step appeared at the right moment',
};

export function InsightCard({ insight, index }: { insight: Insight; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.34, ease: 'easeOut' }}
      className="rounded-xl border border-hairline bg-surface p-4"
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <Badge tone="accent">{PRINCIPLE_LABEL[insight.principle]}</Badge>
        <span className="font-mono text-[11px] text-graphite-soft">
          {insight.sourceVariant !== 'none' ? `lineage source: ${insight.sourceVariant}` : ''}
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-graphite-soft">
            Observed behavior
          </p>
          <p className="mt-1 text-sm font-medium text-graphite">
            {PRINCIPLE_OBSERVATION[insight.principle]}
          </p>
        </div>
        <span className="hidden md:block pt-5 font-mono text-sm text-graphite-soft">→</span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-graphite-soft">Evidence</p>
          <p className="mt-1 text-sm text-graphite">{insight.evidence}</p>
        </div>
        <span className="hidden md:block pt-5 font-mono text-sm text-graphite-soft">→</span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-graphite-soft">
            Recommended action
          </p>
          <p className="mt-1 text-sm font-medium" style={{ color: 'var(--accent)' }}>
            {insight.action}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
