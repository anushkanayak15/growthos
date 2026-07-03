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

export function InsightCard({ insight, index }: { insight: Insight; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-xl border border-hairline bg-surface p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <Badge tone="accent">{PRINCIPLE_LABEL[insight.principle]}</Badge>
        <span className="font-mono text-[11px] text-graphite-soft">
          {insight.sourceVariant !== 'none' ? `source: ${insight.sourceVariant}` : ''}
        </span>
      </div>
      <p className="text-sm text-graphite">{insight.evidence}</p>
      <p className="mt-2 text-sm font-medium" style={{ color: 'var(--accent)' }}>
        → {insight.action}
      </p>
    </motion.div>
  );
}
