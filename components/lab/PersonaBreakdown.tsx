import type { VariantMetrics } from '@/lib/metrics';
import { buildPersonaVariantMatrix } from '@/lib/metrics';
import type { Variant } from '@/lib/variants';
import { cn } from '@/lib/cn';

export function PersonaBreakdown({ metrics, variants }: { metrics: VariantMetrics[]; variants: Variant[] }) {
  const matrix = buildPersonaVariantMatrix(metrics);
  const max = Math.max(...matrix.flatMap((row) => row.byVariant.map((c) => c.conversion)));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left font-mono text-xs uppercase tracking-wider text-graphite-soft font-normal pb-2 pr-4">
              Cohort
            </th>
            {variants.map((v) => (
              <th key={v.id} className="text-center font-mono text-xs uppercase tracking-wider text-graphite-soft font-normal pb-2 px-2">
                {v.id}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row) => {
            const rowBest = Math.max(...row.byVariant.map((c) => c.conversion));
            return (
              <tr key={row.personaId} className="border-t border-hairline">
                <td className="py-2 pr-4 whitespace-nowrap text-graphite">{row.personaName}</td>
                {row.byVariant.map((cell) => {
                  const intensity = max > 0 ? cell.conversion / max : 0;
                  const isBest = cell.conversion === rowBest && rowBest > 0;
                  return (
                    <td key={cell.variantId} className="px-2 py-2 text-center">
                      <span
                        className={cn(
                          'inline-block min-w-[3.5rem] rounded-md px-2 py-1 font-mono text-xs',
                          isBest && 'font-semibold ring-1 ring-accent'
                        )}
                        style={{
                          backgroundColor: `rgba(51, 85, 255, ${0.06 + intensity * 0.28})`,
                        }}
                      >
                        {(cell.conversion * 100).toFixed(1)}%
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
