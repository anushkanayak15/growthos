import type { Section, VariantTheme } from '@/lib/variants';

export function Features({ section, theme }: { section: Section; theme: VariantTheme }) {
  const { copy } = section;
  const items = copy.items ?? [];

  return (
    <section className="py-14 px-8">
      <div className="max-w-4xl mx-auto">
        {copy.headline && (
          <h2 className="font-display text-2xl md:text-3xl font-medium text-center mb-8">
            {copy.headline}
          </h2>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, i) => {
            const [title, rest] = item.split(' → ');
            return (
              <div key={i} className="rounded-xl border border-hairline bg-surface p-4">
                <div
                  className="w-6 h-6 rounded-full mb-3 flex items-center justify-center font-mono text-[11px] text-white"
                  style={{ backgroundColor: theme.accent }}
                >
                  {i + 1}
                </div>
                {rest ? (
                  <>
                    <p className="font-medium text-sm">{title}</p>
                    <p className="text-sm text-graphite-soft mt-1">{rest}</p>
                  </>
                ) : (
                  <p className="text-sm text-graphite-soft">{item}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
