'use client';

import { useEffect, useState } from 'react';
import type { Section, VariantTheme } from '@/lib/variants';

export function UrgencyBar({ section, theme }: { section: Section; theme: VariantTheme }) {
  const { copy } = section;
  const [seconds, setSeconds] = useState(19 * 24 * 3600);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return (
    <div
      className="sticky top-0 z-20 flex flex-wrap items-center justify-center gap-3 px-4 py-2.5 text-white text-sm"
      style={{ backgroundColor: theme.accent }}
    >
      <span className="font-medium">{copy.headline}</span>
      <span className="font-mono tabular-nums text-xs opacity-90">
        {days}d {String(hours).padStart(2, '0')}h {String(mins).padStart(2, '0')}m{' '}
        {String(secs).padStart(2, '0')}s
      </span>
      {copy.sub && <span className="hidden md:inline text-xs opacity-80">{copy.sub}</span>}
    </div>
  );
}
