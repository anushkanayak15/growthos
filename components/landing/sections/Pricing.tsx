import type { Section, VariantTheme } from '@/lib/variants';

export function Pricing({ section, theme }: { section: Section; theme: VariantTheme }) {
  const { copy } = section;

  return (
    <section className="py-14 px-8">
      <div
        className="max-w-md mx-auto rounded-2xl border p-6 text-center"
        style={{ borderColor: theme.accent + '40', backgroundColor: theme.accent + '0d' }}
      >
        {copy.headline && <p className="font-display text-xl font-medium">{copy.headline}</p>}
        {copy.sub && <p className="mt-2 text-sm text-graphite-soft">{copy.sub}</p>}
      </div>
    </section>
  );
}
