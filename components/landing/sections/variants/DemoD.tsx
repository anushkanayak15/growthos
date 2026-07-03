'use client';

import { useEffect, useState } from 'react';
import type { Section, VariantTheme } from '@/lib/variants';
import { Button } from '@/components/ui/Button';

const FEED = [
  { name: 'Alex R.', school: 'UT Austin', action: 'started their finals study plan', ago: '2 min ago', avatar: 'A' },
  { name: 'Sarah M.', school: 'Michigan', action: 'improved +0.8 grades in Organic Chem', ago: '9 min ago', avatar: 'S' },
  { name: 'James K.', school: 'UCLA', action: 'finished week 3 of their plan', ago: '14 min ago', avatar: 'J' },
  { name: 'Priya N.', school: 'Cornell', action: 'completed 40 weak-spot drills', ago: '22 min ago', avatar: 'P' },
  { name: 'Devon C.', school: 'Georgia Tech', action: 'uploaded their Calc II syllabus', ago: '28 min ago', avatar: 'D' },
  { name: 'Mia T.', school: 'Columbia', action: 'hit a 14-day study streak', ago: '35 min ago', avatar: 'M' },
];

export function DemoD({ section, theme }: { section: Section; theme: VariantTheme }) {
  const [visible, setVisible] = useState(2);

  useEffect(() => {
    if (visible >= FEED.length) return;
    const t = setTimeout(() => setVisible((n) => n + 1), 2200);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <section style={{ background: '#0d0d0d' }} className="py-14 px-8">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: theme.accent }} />
          <p className="font-mono text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
            live activity · right now
          </p>
        </div>

        {/* Feed entries */}
        <div className="space-y-2 mb-8">
          {FEED.slice(0, visible).map((entry, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300"
              style={{
                background: i === 0 ? `${theme.accent}12` : 'rgba(255,255,255,0.03)',
                border: i === 0 ? `1px solid ${theme.accent}40` : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold text-white"
                style={{ background: i === 0 ? theme.accent : 'rgba(255,255,255,0.10)' }}
              >
                {entry.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: 'rgba(255,255,255,0.78)' }}>
                  <span className="font-medium text-white">{entry.name}</span>
                  {' '}
                  <span style={{ color: 'rgba(255,255,255,0.40)' }}>({entry.school})</span>
                  {' '}{entry.action}
                </p>
              </div>
              <span className="font-mono text-[10px] flex-shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {entry.ago}
              </span>
            </div>
          ))}
        </div>

        {/* Capacity bar */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex justify-between items-center mb-3">
            <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              free tier spots claimed this week
            </p>
            <p className="font-mono text-sm font-semibold" style={{ color: theme.accent }}>78%</p>
          </div>
          <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: '78%', background: theme.accent }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
              {joined(visible)} students joined today · resets midnight
            </p>
            <Button accent={theme.accent} size="md">
              {section.copy.cta ?? "Claim your spot"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function joined(n: number) {
  return 230 + n * 3;
}
