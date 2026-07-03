'use client';

import { useState } from 'react';
import type { Section } from '@/lib/variants';

export function Faq({ section }: { section: Section }) {
  const { copy } = section;
  const [open, setOpen] = useState<number | null>(null);
  const items = (copy.items ?? []).map((raw) => {
    const [q, a] = raw.split('|');
    return { q, a };
  });

  return (
    <section className="py-14 px-8">
      <div className="max-w-2xl mx-auto">
        {copy.headline && (
          <h2 className="font-display text-2xl font-medium text-center mb-6">{copy.headline}</h2>
        )}
        <div className="divide-y divide-hairline border-y border-hairline">
          {items.map(({ q, a }, i) => (
            <div key={i}>
              <button
                className="w-full text-left py-4 flex items-center justify-between gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-medium">{q}</span>
                <span className="font-mono text-graphite-soft">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && <p className="pb-4 text-sm text-graphite-soft">{a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
