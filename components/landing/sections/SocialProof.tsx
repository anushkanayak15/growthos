import type { Section, VariantTheme } from '@/lib/variants';

function looksLikeQuote(item: string) {
  return item.trim().startsWith('"');
}

function looksNumeric(item: string) {
  return /^[\d.+%]/.test(item.trim());
}

export function SocialProof({ section, theme }: { section: Section; theme: VariantTheme }) {
  const { copy } = section;
  const items = copy.items ?? [];
  const asQuotes = items.length > 0 && looksLikeQuote(items[0]);
  const asStats = items.length > 0 && looksNumeric(items[0]);

  return (
    <section className="py-14 px-8">
      <div className="max-w-4xl mx-auto">
        {copy.headline && (
          <h2 className="font-display text-2xl md:text-3xl font-medium text-center mb-8">
            {copy.headline}
          </h2>
        )}
        {asQuotes && (
          <div className="grid gap-4 md:grid-cols-3">
            {items.map((quote, i) => {
              const [text, attribution] = quote.split(' — ');
              return (
                <div key={i} className="rounded-2xl border border-hairline bg-surface p-5">
                  <p className="text-sm text-graphite">{text}</p>
                  {attribution && (
                    <p className="mt-3 text-xs font-mono text-graphite-soft">— {attribution}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {asStats && !asQuotes && (
          <div className="grid gap-6 md:grid-cols-3 text-center">
            {items.map((stat, i) => (
              <div key={i}>
                <p
                  className="font-mono text-3xl font-semibold"
                  style={{ color: theme.accent }}
                >
                  {stat.split(' ')[0]}
                </p>
                <p className="mt-1 text-sm text-graphite-soft">{stat.split(' ').slice(1).join(' ')}</p>
              </div>
            ))}
          </div>
        )}
        {!asQuotes && !asStats && items.length > 0 && (
          <ol className="space-y-3 max-w-lg mx-auto">
            {items.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-graphite-soft">
                <span className="font-mono" style={{ color: theme.accent }}>
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
