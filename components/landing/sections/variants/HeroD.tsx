'use client';

import { useEffect, useState } from 'react';
import type { Section, VariantTheme } from '@/lib/variants';
import { Button } from '@/components/ui/Button';

export function HeroD({ section, theme }: { section: Section; theme: VariantTheme }) {
  const [seconds, setSeconds] = useState(19 * 24 * 3600);
  const [joined, setJoined] = useState(247);
  const { copy } = section;

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const tick = () => {
      const delay = 7000 + Math.random() * 6000;
      const t = setTimeout(() => {
        setJoined((n) => n + 1);
        tick();
      }, delay);
      return t;
    };
    const t = tick();
    return () => clearTimeout(t);
  }, []);

  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const fmt = (n: number) => String(n).padStart(2, '0');

  return (
    <section
      style={{ background: '#0d0d0d' }}
      className="min-h-[85vh] flex flex-col items-center justify-center px-8 py-20 text-white"
    >
      <div className="max-w-3xl mx-auto text-center w-full">
        {/* Countdown label */}
        <p
          className="font-mono text-xs uppercase tracking-widest mb-5"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          finals countdown · every second counts
        </p>

        {/* Countdown clock */}
        <div className="flex items-end justify-center gap-2 mb-10">
          {[
            { val: d, label: 'days' },
            { val: h, label: 'hrs' },
            { val: m, label: 'min' },
            { val: s, label: 'sec' },
          ].map(({ val, label }, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="text-center">
                <div
                  className="font-display font-medium tabular-nums rounded-xl px-4 py-3"
                  style={{
                    fontSize: 'clamp(28px, 7vw, 58px)',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${theme.accent}35`,
                    minWidth: '80px',
                  }}
                >
                  {fmt(val)}
                </div>
                <p
                  className="font-mono text-[10px] mt-1.5 uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.28)' }}
                >
                  {label}
                </p>
              </div>
              {i < 3 && (
                <span
                  className="font-display mb-4"
                  style={{ fontSize: 'clamp(20px, 5vw, 40px)', color: `${theme.accent}50` }}
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        <h1
          className="font-display font-medium tracking-tight mb-4"
          style={{ fontSize: 'clamp(28px, 6vw, 52px)' }}
        >
          {copy.headline}
        </h1>
        {copy.sub && (
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {copy.sub}
          </p>
        )}

        {/* Live activity indicator */}
        <div
          className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 mb-8"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.09)',
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: theme.accent }}
          />
          <span className="font-mono text-sm">
            <span className="font-semibold">{joined}</span>{' '}
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>students joined today</span>
          </span>
        </div>

        <div className="block">
          <Button accent={theme.accent} size="lg">
            {copy.cta ?? "Don't fall behind"}
          </Button>
        </div>

        <p className="mt-4 font-mono text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
          Free through your next exam if you start this week
        </p>
      </div>
    </section>
  );
}
