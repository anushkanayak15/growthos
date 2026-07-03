'use client';

import { useState } from 'react';
import type { Section, VariantTheme } from '@/lib/variants';
import { Button } from '@/components/ui/Button';

const SAMPLE_EXCHANGES: Record<string, { q: string; a: string }> = {
  'Organic Chemistry': {
    q: 'Why does this SN2 reaction invert the stereocenter?',
    a: "You've missed this concept twice — let's slow down. The nucleophile attacks from the opposite side of the leaving group, flipping the molecule like an umbrella in the wind...",
  },
  'Calculus II': {
    q: 'When do I use integration by parts vs. substitution?',
    a: "Good question — you got this wrong on Tuesday too. Try substitution first when you see a function and its derivative together. Reach for by-parts when you have a product of unlike functions...",
  },
  'Microeconomics': {
    q: 'Why does the monopolist\'s marginal revenue curve lie below demand?',
    a: 'Because to sell one more unit, the monopolist has to lower price on *all* units sold, not just the last one — that\'s the part you skipped last session...',
  },
  Statistics: {
    q: 'Why do we use n-1 instead of n for sample variance?',
    a: "Bessel's correction — using n underestimates the true variance. You flagged this as confusing yesterday, so here's the intuition with your own practice numbers...",
  },
};

export function Demo({ section, theme }: { section: Section; theme: VariantTheme }) {
  const { copy } = section;
  const [picked, setPicked] = useState<string | null>(null);

  if (copy.body) {
    return (
      <section className="py-14 px-8">
        <div className="max-w-2xl mx-auto rounded-2xl border border-hairline bg-surface p-8">
          {copy.headline && (
            <p className="font-display text-xl font-medium mb-3">{copy.headline}</p>
          )}
          <p className="text-graphite-soft leading-relaxed">{copy.body}</p>
        </div>
      </section>
    );
  }

  if (copy.items && copy.items.length > 0) {
    const exchange = picked ? SAMPLE_EXCHANGES[picked] : null;
    return (
      <section className="py-20 px-8">
        <div className="max-w-2xl mx-auto text-center">
          {copy.headline && (
            <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
              {copy.headline}
            </h1>
          )}
          {copy.sub && <p className="mt-4 text-lg text-graphite-soft">{copy.sub}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {copy.items.map((subject) => (
              <button
                key={subject}
                onClick={() => setPicked(subject)}
                className="rounded-full border px-4 py-2 text-sm font-mono transition-colors"
                style={
                  picked === subject
                    ? { backgroundColor: theme.accent, borderColor: theme.accent, color: 'white' }
                    : { borderColor: 'var(--hairline)' }
                }
              >
                {subject}
              </button>
            ))}
          </div>
          <div className="mt-6 min-h-[130px] rounded-2xl border border-hairline bg-surface p-6 text-left">
            {!exchange && (
              <p className="text-sm text-graphite-soft text-center">
                Pick a subject above to see the tutor adapt.
              </p>
            )}
            {exchange && (
              <div className="space-y-3">
                <p className="text-sm bg-graphite/5 rounded-lg px-3 py-2 inline-block">{exchange.q}</p>
                <p className="text-sm text-graphite-soft border-l-2 pl-3" style={{ borderColor: theme.accent }}>
                  {exchange.a}
                </p>
              </div>
            )}
          </div>
          {copy.cta && (
            <div className="mt-8">
              <Button accent={theme.accent} size="lg">
                {copy.cta}
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 px-8 text-center">
      {copy.headline && <p className="font-display text-2xl font-medium">{copy.headline}</p>}
      {copy.sub && <p className="mt-3 text-graphite-soft">{copy.sub}</p>}
    </section>
  );
}
