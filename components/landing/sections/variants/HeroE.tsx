'use client';

import { useEffect, useState } from 'react';
import type { Section, VariantTheme } from '@/lib/variants';
import { Button } from '@/components/ui/Button';

const TERMINAL_LINES = [
  { text: '> scholé analyze --syllabus calc2-sp25.pdf', color: 'rgba(255,255,255,0.55)' },
  { text: '  scanning 47 graded topics...', color: 'rgba(255,255,255,0.30)' },
  { text: '  ✓ topics extracted, weights mapped', color: '#27c93f' },
  { text: '> running adaptive diagnostic...', color: 'rgba(255,255,255,0.55)' },
  { text: '  ✓ 3 weak spots identified', color: '#27c93f' },
  { text: '> generating personalized plan...', color: 'rgba(255,255,255,0.55)' },
  { text: '  ✓ 19-day study plan ready', color: '#27c93f' },
];

const DELAYS = [0, 600, 1200, 1800, 2500, 3200, 3900];

export function HeroE({ section, theme }: { section: Section; theme: VariantTheme }) {
  const [shown, setShown] = useState(0);
  const { copy } = section;

  useEffect(() => {
    if (shown >= TERMINAL_LINES.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), DELAYS[shown] + 500);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <section
      style={{ background: '#0a0a0e' }}
      className="px-8 pt-16 pb-20 min-h-[88vh] flex flex-col items-center justify-center"
    >
      <div className="max-w-3xl mx-auto w-full">
        {/* Terminal window */}
        <div
          className="rounded-xl overflow-hidden mb-10"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-1.5 px-4 py-2.5"
            style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
            <span className="ml-3 font-mono text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>
              scholé — tutor engine v2.4 · demo mode
            </span>
          </div>

          {/* Terminal body */}
          <div
            className="px-5 py-5 font-mono text-xs space-y-1.5 min-h-[150px]"
            style={{ background: '#0d0d11' }}
          >
            {TERMINAL_LINES.slice(0, shown).map((line, i) => (
              <div key={i} style={{ color: line.color }}>
                {line.text}
              </div>
            ))}
            {shown < TERMINAL_LINES.length && (
              <div style={{ color: 'rgba(255,255,255,0.25)' }}>
                <span className="animate-pulse">█</span>
              </div>
            )}
          </div>
        </div>

        {/* Hero text */}
        <div className="text-center text-white">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-6 font-mono text-xs"
            style={{
              background: `${theme.accent}1a`,
              color: theme.accent,
              border: `1px solid ${theme.accent}35`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent }} />
            demo · live · try it now
          </div>

          <h1
            className="font-display font-medium tracking-tight mb-5"
            style={{ fontSize: 'clamp(28px, 6vw, 52px)' }}
          >
            {copy.headline}
          </h1>

          {copy.sub && (
            <p className="text-lg mb-10 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.46)' }}>
              {copy.sub}
            </p>
          )}

          {copy.cta && (
            <Button accent={theme.accent} size="lg">
              {copy.cta}
            </Button>
          )}

          <p className="mt-4 font-mono text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            no signup required for the demo
          </p>
        </div>
      </div>
    </section>
  );
}
