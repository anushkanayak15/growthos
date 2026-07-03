import type { Section, VariantTheme } from '@/lib/variants';
import { Button } from '@/components/ui/Button';

export function Hero({ section, theme }: { section: Section; theme: VariantTheme }) {
  const { copy } = section;
  const airy = theme.density === 'airy';

  return (
    <section className={airy ? 'py-24 px-8' : 'py-16 px-8'}>
      <div className="max-w-3xl mx-auto text-center">
        <h1
          className={
            'font-display font-medium tracking-tight text-graphite ' +
            (airy ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl')
          }
        >
          {copy.headline}
        </h1>
        {copy.sub && (
          <p className="mt-5 text-lg text-graphite-soft max-w-xl mx-auto">{copy.sub}</p>
        )}
        {copy.cta && (
          <div className="mt-8">
            <Button accent={theme.accent} size="lg">
              {copy.cta}
            </Button>
          </div>
        )}
        {copy.items && copy.items.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-70">
            {copy.items.map((logo) => (
              <span key={logo} className="font-mono text-xs uppercase tracking-wider text-graphite-soft">
                {logo}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
