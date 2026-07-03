import type { VariantMetrics } from '@/lib/metrics';
import type { Variant } from '@/lib/variants';

export function Heatmap({ metrics, variants }: { metrics: VariantMetrics[]; variants: Variant[] }) {
  const allDwells = metrics.flatMap((m) => Object.values(m.sectionDwell).map((e) => e.meanDwell));
  const maxDwell = Math.max(...allDwells, 1);

  return (
    <div className="grid gap-4 md:grid-cols-5">
      {variants.map((variant) => {
        const m = metrics.find((mm) => mm.variantId === variant.id)!;
        return (
          <div key={variant.id} className="rounded-xl border border-hairline overflow-hidden">
            <div className="px-3 py-1.5 bg-graphite/[0.03] border-b border-hairline">
              <span className="font-mono text-[11px] uppercase tracking-wider text-graphite-soft">
                {variant.id} · {variant.name}
              </span>
            </div>
            <div className="p-1.5 space-y-1">
              {variant.sections.map((section) => {
                const dwell = m.sectionDwell[section.id]?.meanDwell ?? 0;
                const reach = m.sectionDwell[section.id]?.reachRate ?? 0;
                const intensity = maxDwell > 0 ? dwell / maxDwell : 0;
                return (
                  <div
                    key={section.id}
                    title={`${section.type}: ${dwell.toFixed(1)}s mean attention, ${Math.round(reach * 100)}% reach`}
                    className="flex items-center justify-between rounded px-2 py-1 text-[11px] font-mono"
                    style={{ backgroundColor: `rgba(51, 85, 255, ${0.05 + intensity * 0.55})` }}
                  >
                    <span className="truncate text-graphite-soft">{section.type}</span>
                    <span className="text-graphite tabular-nums">{dwell.toFixed(1)}s · {Math.round(reach * 100)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
