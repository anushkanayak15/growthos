'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ErrorBar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { VariantMetrics } from '@/lib/metrics';
import type { Variant } from '@/lib/variants';

export function FitnessChart({ metrics, variants }: { metrics: VariantMetrics[]; variants: Variant[] }) {
  const data = [...metrics]
    .sort((a, b) => (b.fitness ?? 0) - (a.fitness ?? 0))
    .map((m) => {
      const v = variants.find((v) => v.id === m.variantId)!;
      return {
        variantId: m.variantId,
        name: v.name,
        fitness: Math.round((m.fitness ?? 0) * 10) / 10,
        conversionPct: Math.round(m.conversion.point * 1000) / 10,
        conversionErr: Math.round(((m.conversion.high - m.conversion.low) / 2) * 1000) / 10,
        accent: v.theme.accent,
      };
    });

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--hairline)" />
          <XAxis
            dataKey="variantId"
            tick={{ fontSize: 12, fontFamily: 'var(--font-mono)', fill: 'var(--graphite-soft)' }}
            axisLine={{ stroke: 'var(--hairline)' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fontFamily: 'var(--font-mono)', fill: 'var(--graphite-soft)' }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            cursor={{ fill: 'var(--accent-soft)' }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="rounded-lg border border-hairline bg-surface px-3 py-2 text-xs font-mono shadow-sm">
                  <p className="font-semibold">
                    {d.variantId} — {d.name}
                  </p>
                  <p>fitness score: {d.fitness}</p>
                  <p>
                    conversion: {d.conversionPct}% ± {d.conversionErr}
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="fitness" radius={[6, 6, 0, 0]} maxBarSize={56}>
            {data.map((d) => (
              <Cell key={d.variantId} fill={d.accent} />
            ))}
            <ErrorBar dataKey="conversionErr" width={4} strokeWidth={1.5} stroke="var(--graphite)" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 justify-center mt-1">
        {data.map((d) => (
          <span key={d.variantId} className="flex items-center gap-1.5 text-[11px] font-mono text-graphite-soft">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.accent }} />
            {d.variantId} {d.fitness}
          </span>
        ))}
      </div>
    </div>
  );
}
