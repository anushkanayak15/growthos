'use client';

import { useEffect, useState } from 'react';
import type { Section, VariantTheme } from '@/lib/variants';
import { Button } from '@/components/ui/Button';

const UNIVERSITIES = [
  'Stanford', 'MIT', 'UCLA', 'UT Austin', 'Michigan', 'Georgia Tech',
  'NYU', 'Columbia', 'Cornell', 'Penn', 'Northwestern', 'UNC',
  'Ohio State', 'Purdue', 'UC Berkeley', 'USC', 'Vanderbilt', 'Georgetown',
];

const TARGET = 50247;
const START = 49750;

function useCountUp(target: number, start: number, duration = 2000, startDelay = 400) {
  const [count, setCount] = useState(start);
  useEffect(() => {
    let raf: number;
    const startTime = Date.now() + startDelay;
    const tick = () => {
      const now = Date.now();
      if (now < startTime) { raf = requestAnimationFrame(tick); return; }
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(start + (target - start) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration, startDelay]);
  return count;
}

export function HeroC({ section, theme }: { section: Section; theme: VariantTheme }) {
  const { copy } = section;
  const count = useCountUp(TARGET, START);

  return (
    <section className="py-16 px-8 bg-white">
      <style>{`
        @keyframes marquee-c {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-c-track { animation: marquee-c 28s linear infinite; display: flex; gap: 3.5rem; width: max-content; }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Live counter centrepiece */}
        <div className="text-center mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-graphite-soft mb-2">
            students currently enrolled
          </p>
          <div
            className="font-display font-medium tabular-nums"
            style={{ fontSize: 'clamp(52px, 11vw, 96px)', color: theme.accent }}
          >
            {count.toLocaleString()}
          </div>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.accent }} />
            <p className="font-mono text-xs text-graphite-soft">live · updates in real time</p>
          </div>
        </div>

        {/* University marquee */}
        <div
          className="overflow-hidden py-3 mb-10"
          style={{ borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' }}
        >
          <div className="marquee-c-track">
            {[...UNIVERSITIES, ...UNIVERSITIES].map((u, i) => (
              <span
                key={i}
                className="font-mono text-xs uppercase tracking-widest text-graphite-soft whitespace-nowrap"
              >
                {u}
              </span>
            ))}
          </div>
        </div>

        {/* Headline block */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-graphite">
            {copy.headline}
          </h1>
          {copy.sub && (
            <p className="mt-4 text-lg text-graphite-soft">{copy.sub}</p>
          )}

          {/* Star rating row */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="text-xl" style={{ color: '#f59e0b', letterSpacing: '2px' }}>
              ★★★★★
            </span>
            <span className="font-mono text-sm text-graphite-soft">4.8 / 5</span>
            <span className="text-graphite-soft/40">·</span>
            <span className="font-mono text-sm text-graphite-soft">9,200 reviews</span>
            <span className="text-graphite-soft/40">·</span>
            <span className="font-mono text-sm text-graphite-soft">120 universities</span>
          </div>

          {copy.cta && (
            <div className="mt-8">
              <Button accent={theme.accent} size="lg">
                {copy.cta}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
