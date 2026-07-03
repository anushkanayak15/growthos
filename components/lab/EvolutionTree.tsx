'use client';

import { motion } from 'framer-motion';
import type { Variant } from '@/lib/variants';
import { Badge } from '@/components/ui/Badge';

export function EvolutionTree({ gen2, variants }: { gen2: Variant; variants: Variant[] }) {
  const contributions = new Map<string, string[]>();
  for (const section of gen2.sections) {
    if (!section.provenance) continue;
    const list = contributions.get(section.provenance.parent) ?? [];
    list.push(section.type);
    contributions.set(section.provenance.parent, list);
  }

  const parents = [...contributions.entries()];

  return (
    <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
      <div className="space-y-3">
        {parents.map(([parentId, types], i) => {
          const variant = variants.find((v) => v.id === parentId);
          return (
            <motion.div
              key={parentId}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-hairline bg-surface p-3 flex items-center gap-3"
            >
              <span
                className="h-8 w-8 rounded-full flex items-center justify-center font-mono text-xs text-white shrink-0"
                style={{ backgroundColor: variant?.theme.accent ?? 'var(--accent)' }}
              >
                {parentId}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{variant?.name ?? parentId}</p>
                <p className="text-xs text-graphite-soft font-mono truncate">{types.join(', ')}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="hidden md:flex flex-col items-center gap-1 text-graphite-soft">
        {parents.map((_, i) => (
          <svg key={i} width="60" height="24" viewBox="0 0 60 24" className="overflow-visible">
            <path d="M0 12 H50" stroke="var(--hairline)" strokeWidth="1.5" fill="none" />
            <path d="M46 6 L54 12 L46 18" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
          </svg>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: parents.length * 0.1 + 0.15 }}
        className="rounded-2xl border-2 p-4"
        style={{ borderColor: gen2.theme.accent }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Badge tone="accent">Gen 2</Badge>
          <span className="font-display text-sm font-medium">{gen2.name}</span>
        </div>
        <ol className="space-y-1.5">
          {gen2.sections.map((s) => (
            <li key={s.id} className="text-xs font-mono text-graphite-soft flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: variants.find((v) => v.id === s.provenance?.parent)?.theme.accent ?? '#999' }}
              />
              <span className="truncate">
                {s.type} <span className="text-graphite-soft/70">from {s.provenance?.parent}</span>
              </span>
            </li>
          ))}
        </ol>
      </motion.div>
    </div>
  );
}
