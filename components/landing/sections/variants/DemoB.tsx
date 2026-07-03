'use client';

import { useEffect, useState } from 'react';
import type { Section, VariantTheme } from '@/lib/variants';
import { Button } from '@/components/ui/Button';

const MESSAGES = [
  { from: 'student' as const, text: "i can't figure this out. i've re-read it 4 times", delay: 0 },
  { from: 'student' as const, text: "it's 2am and i genuinely give up", delay: 700 },
  { from: 'tutor' as const, text: "Hey. I'm here. You flagged this exact concept three days ago.", delay: 1600 },
  { from: 'tutor' as const, text: "You don't need to start over — you just missed one step. Let me show you.", delay: 2700 },
  { from: 'student' as const, text: "ok", delay: 3600 },
  { from: 'tutor' as const, text: "Good. Here's the part you keep skipping, in your own words from last session…", delay: 4200 },
];

export function DemoB({ section, theme }: { section: Section; theme: VariantTheme }) {
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    if (shown >= MESSAGES.length) return;
    const delay = shown === 0 ? 300 : MESSAGES[shown].delay - MESSAGES[shown - 1].delay;
    const t = setTimeout(() => setShown((n) => n + 1), delay);
    return () => clearTimeout(t);
  }, [shown, started]);

  const restart = () => {
    setShown(0);
    setStarted(true);
  };

  return (
    <section style={{ background: '#fdf8f3' }} className="py-16 px-8">
      <div className="max-w-md mx-auto">
        {section.copy.headline && (
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1" style={{ background: 'var(--hairline)' }} />
            <p className="font-mono text-xs text-graphite-soft uppercase tracking-wider">
              {section.copy.headline}
            </p>
            <div className="h-px flex-1" style={{ background: 'var(--hairline)' }} />
          </div>
        )}

        {/* Phone-frame chat */}
        <div
          className="rounded-3xl overflow-hidden shadow-xl"
          style={{ background: '#1c1917', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Status bar */}
          <div
            className="px-6 pt-5 pb-2 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              2:14 AM
            </span>
            <span className="font-mono text-xs font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Scholé
            </span>
            <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              ●●●
            </span>
          </div>

          {/* Messages area */}
          <div className="px-4 py-5 space-y-3 min-h-[260px]">
            {!started && (
              <div className="h-full flex items-center justify-center py-8">
                <button
                  onClick={() => { setStarted(true); }}
                  className="rounded-full px-5 py-2 text-sm font-mono transition-opacity hover:opacity-80"
                  style={{ background: `${theme.accent}30`, color: theme.accent, border: `1px solid ${theme.accent}50` }}
                >
                  ▶ play conversation
                </button>
              </div>
            )}

            {started && MESSAGES.slice(0, shown).map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === 'student' ? 'justify-end' : 'items-end gap-2'}`}
              >
                {msg.from === 'tutor' && (
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-semibold text-white"
                    style={{ background: theme.accent }}
                  >
                    S
                  </div>
                )}
                <div
                  className="rounded-2xl px-3.5 py-2.5 text-xs max-w-[76%] leading-relaxed"
                  style={
                    msg.from === 'student'
                      ? { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)' }
                      : { background: theme.accent, color: 'white' }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {started && shown < MESSAGES.length && shown > 0 && (
              <div className="flex items-end gap-2">
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-semibold text-white"
                  style={{ background: theme.accent }}
                >
                  S
                </div>
                <div
                  className="rounded-2xl px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <span className="inline-flex gap-1">
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ background: 'rgba(255,255,255,0.35)', animationDelay: `${d}ms` }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 flex items-center justify-between">
          {shown >= MESSAGES.length ? (
            <>
              <button
                onClick={restart}
                className="font-mono text-xs underline text-graphite-soft hover:text-graphite"
              >
                replay ↺
              </button>
              <Button accent={theme.accent} size="lg">
                Meet your tutor
              </Button>
            </>
          ) : (
            <p className="font-mono text-xs text-graphite-soft">
              {started ? 'no judgment, ever.' : 'watch what 2am feels like with Scholé'}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
