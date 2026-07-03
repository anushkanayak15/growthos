'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VariantSimulationResult } from '@/lib/simulation';
import { describeUser } from '@/lib/ticker';
import { PERSONAS } from '@/lib/personas';

const DURATION_MS = 6500;
const TICKER_LINES = 26;

export function SimulationPlayback({
  results,
  seed,
  onDone,
}: {
  results: VariantSimulationResult[];
  seed: number;
  onDone: () => void;
}) {
  const totalUsers = useMemo(() => results.reduce((s, r) => s + r.users.length, 0), [results]);
  const [progress, setProgress] = useState(0);
  const [tickerLog, setTickerLog] = useState<string[]>([]);
  const startRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  // Lazy initializer, not useMemo: this sampling is intentionally one-shot and impure
  // (picks random log lines to play back once), the same pattern React's docs use for
  // generating a random id in state.
  const [sampleLines] = useState<string[]>(() => {
    const lines: string[] = [];
    for (let i = 0; i < TICKER_LINES; i++) {
      const r = results[Math.floor(Math.random() * results.length)];
      const u = r.users[Math.floor(Math.random() * r.users.length)];
      lines.push(describeUser(u, r.variantId));
    }
    return lines;
  });

  useEffect(() => {
    let raf: number;
    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = t - startRef.current;
      const p = Math.min(1, elapsed / DURATION_MS);
      setProgress(p);
      const linesShown = Math.floor(p * sampleLines.length);
      setTickerLog(sampleLines.slice(0, linesShown));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        setTimeout(onDone, 500);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleLines]);

  const usersShown = Math.floor(progress * totalUsers);

  return (
    <div className="max-w-3xl mx-auto py-16 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-graphite-soft">
        behavioral stress test seed {seed}
      </p>
      <p className="font-display text-5xl font-medium tabular-nums mt-3">
        {usersShown.toLocaleString()}
      </p>
      <p className="text-sm text-graphite-soft mt-1">synthetic cohort visits across 5 Gen 0 Candidates</p>

      <div className="mt-6 h-2 rounded-full bg-hairline overflow-hidden max-w-md mx-auto">
        <motion.div
          className="h-full bg-accent"
          animate={{ width: `${progress * 100}%` }}
          transition={{ ease: 'linear', duration: 0.1 }}
        />
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {PERSONAS.map((p) => (
          <span
            key={p.id}
            className="rounded-full border border-hairline bg-surface px-3 py-1 text-xs font-mono text-graphite-soft"
          >
            {p.name} · {Math.round(p.mix * 100)}%
          </span>
        ))}
      </div>

      <div className="mt-8 h-56 overflow-hidden rounded-2xl border border-hairline bg-graphite text-left">
        <div className="flex flex-col-reverse h-full overflow-hidden px-4 py-3 gap-1.5">
          <AnimatePresence initial={false}>
            {[...tickerLog].reverse().slice(0, 10).map((line, i) => (
              <motion.p
                key={line + i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1 - i * 0.09, y: 0 }}
                className="font-mono text-xs text-white/90 truncate"
              >
                <span className="text-accent">›</span> {line}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
