import type { Section, VariantTheme } from '@/lib/variants';
import { Button } from '@/components/ui/Button';

export function HeroB({ section, theme }: { section: Section; theme: VariantTheme }) {
  const { copy } = section;

  return (
    <section style={{ background: '#fdf8f3' }} className="px-8 pt-20 pb-16">
      <div className="max-w-2xl mx-auto">
        {/* Eyebrow */}
        <p
          className="font-mono text-xs tracking-widest uppercase mb-5"
          style={{ color: theme.accent }}
        >
          your AI study companion
        </p>

        <h1 className="font-display text-5xl md:text-6xl font-medium tracking-tight text-graphite leading-tight">
          {copy.headline}
        </h1>

        {copy.sub && (
          <p className="mt-5 text-lg text-graphite-soft max-w-md leading-relaxed">{copy.sub}</p>
        )}

        {/* Inline chat preview */}
        <div
          className="mt-9 rounded-2xl bg-white shadow-sm max-w-sm p-5 space-y-3"
          style={{ border: '1px solid rgba(0,0,0,0.07)' }}
        >
          {/* Student message */}
          <div className="flex justify-end">
            <div
              className="rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed max-w-[82%]"
              style={{ background: '#f0ece6', color: '#3a3530' }}
            >
              I keep blanking on integration by parts…
            </div>
          </div>

          {/* Tutor message */}
          <div className="flex items-end gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold"
              style={{ background: theme.accent }}
            >
              S
            </div>
            <div
              className="rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed max-w-[82%] text-white"
              style={{ background: theme.accent }}
            >
              I noticed that too — you&apos;ve flagged it twice. Let&apos;s try it from a different angle this time.
            </div>
          </div>

          {/* Typing indicator */}
          <div className="flex items-end gap-2.5 opacity-50">
            <div
              className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold"
              style={{ background: theme.accent }}
            >
              S
            </div>
            <div className="rounded-full px-4 py-2.5" style={{ background: '#f0ece6' }}>
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full animate-bounce bg-graphite-soft" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce bg-graphite-soft" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce bg-graphite-soft" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        </div>

        {copy.cta && (
          <div className="mt-8 flex items-center gap-4">
            <Button accent={theme.accent} size="lg">
              {copy.cta}
            </Button>
            <p className="text-sm text-graphite-soft">No commitment · First session free</p>
          </div>
        )}
      </div>
    </section>
  );
}
