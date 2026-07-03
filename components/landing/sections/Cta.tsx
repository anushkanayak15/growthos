import type { Section, VariantTheme } from '@/lib/variants';
import { Button } from '@/components/ui/Button';

export function Cta({ section, theme }: { section: Section; theme: VariantTheme }) {
  const { copy } = section;

  return (
    <section className="py-16 px-8 text-center">
      {copy.headline && (
        <h2 className="font-display text-2xl md:text-3xl font-medium mb-6">{copy.headline}</h2>
      )}
      {copy.cta && (
        <Button accent={theme.accent} size="lg">
          {copy.cta}
        </Button>
      )}
    </section>
  );
}
