import Link from 'next/link';
import type { Variant } from '@/lib/variants';
import { SectionRenderer } from '@/components/landing/SectionRenderer';
import { Badge } from '@/components/ui/Badge';

export function VariantPageBody({ variant }: { variant: Variant }) {
  const hasUrgencyBar = variant.sections[0]?.type === 'urgencyBar';
  const bodySections = hasUrgencyBar ? variant.sections.slice(1) : variant.sections;

  return (
    <div className="min-h-screen bg-white">
      {hasUrgencyBar && (
        <SectionRenderer section={variant.sections[0]} theme={variant.theme} variantId={variant.id} />
      )}
      <div className="flex items-center justify-between px-6 py-3 border-b border-hairline bg-background/80 backdrop-blur sticky top-0 z-30">
        <Link href="/lab" className="font-mono text-xs text-graphite-soft hover:text-graphite">
          ← back to lab
        </Link>
        <span className="hidden font-mono text-[10px] uppercase tracking-wider text-graphite-soft md:inline">
          Synthetic behavioral experiment data for demonstration — not real customer outcomes.
        </span>
        <div className="flex items-center gap-2">
          <Badge tone="accent">{variant.id === 'G2' ? 'Evolved Candidate' : `Gen 0 Candidate ${variant.id}`}</Badge>
          <span className="font-display text-sm font-medium">
            {variant.id === 'G2' ? 'Evidence-backed page' : variant.name}
          </span>
        </div>
      </div>
      {bodySections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          theme={variant.theme}
          variantId={variant.id}
          showProvenance
        />
      ))}
    </div>
  );
}
