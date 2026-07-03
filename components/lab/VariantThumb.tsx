import Link from 'next/link';
import type { Variant } from '@/lib/variants';
import { Badge } from '@/components/ui/Badge';

export function VariantThumb({ variant }: { variant: Variant }) {
  const hero = variant.sections.find((s) => s.type === 'hero') ?? variant.sections[0];

  return (
    <div className="rounded-2xl border border-hairline bg-surface overflow-hidden flex flex-col">
      <div
        className="p-5 flex-1"
        style={{ background: `linear-gradient(180deg, ${variant.theme.accent}14, transparent)` }}
      >
        <div className="flex items-center justify-between mb-3">
          <Badge tone="neutral">Variant {variant.id}</Badge>
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: variant.theme.accent }}
          />
        </div>
        <p className="font-display text-lg font-medium leading-snug">{variant.name}</p>
        <p className="mt-1 text-xs text-graphite-soft">{variant.strategy}</p>
        <p className="mt-3 text-sm text-graphite line-clamp-2">
          {hero.copy.headline}
        </p>
      </div>
      <Link
        href={`/variant/${variant.id}`}
        target="_blank"
        className="block text-center py-2.5 text-xs font-mono uppercase tracking-wider text-graphite-soft border-t border-hairline hover:text-graphite hover:bg-graphite/[0.03]"
      >
        View full page →
      </Link>
    </div>
  );
}
