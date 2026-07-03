import type { Section, VariantTheme } from '@/lib/variants';
import { Button } from '@/components/ui/Button';

export function HeroA({ section, theme }: { section: Section; theme: VariantTheme }) {
  const { copy } = section;

  return (
    <section
      style={{ background: '#0a0a0a' }}
      className="min-h-[90vh] flex flex-col items-center justify-center px-8 py-24 relative overflow-hidden"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Eyebrow pill */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-12"
          style={{ border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.38)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent }} />
          <span className="font-mono text-xs tracking-widest uppercase">
            avg. outcome · 12,400 students
          </span>
        </div>

        {/* Big stat */}
        <div
          className="font-display font-medium leading-none tracking-tight"
          style={{ fontSize: 'clamp(72px, 16vw, 148px)', color: theme.accent }}
        >
          +1.2
        </div>
        <div
          className="font-display font-medium mt-1"
          style={{ fontSize: 'clamp(22px, 4.5vw, 44px)', color: 'rgba(255,255,255,0.78)' }}
        >
          letter grades. In 4 weeks.
        </div>

        <p
          className="mt-8 text-lg max-w-md mx-auto leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.42)' }}
        >
          Scholé scans your syllabus and drills the 20% of material that moves your grade — nothing else.
        </p>

        {/* Before / After split */}
        <div className="mt-10 flex items-stretch justify-center max-w-sm mx-auto">
          <div
            className="flex-1 rounded-l-2xl p-5 text-left"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRight: 'none',
            }}
          >
            <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.28)' }}>
              Before
            </p>
            <p className="font-display text-2xl font-medium text-white/75">18 hrs</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
              per week, studying everything
            </p>
          </div>
          <div
            className="flex-1 rounded-r-2xl p-5 text-left"
            style={{
              background: `${theme.accent}14`,
              border: `1px solid ${theme.accent}38`,
            }}
          >
            <p
              className="font-mono text-[10px] tracking-widest uppercase mb-2"
              style={{ color: `${theme.accent}bb` }}
            >
              After
            </p>
            <p className="font-display text-2xl font-medium" style={{ color: theme.accent }}>
              6 hrs
            </p>
            <p className="text-xs mt-1" style={{ color: `${theme.accent}80` }}>
              per week, on what matters
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Button accent={theme.accent} size="lg">
            {copy.cta ?? 'Start studying smarter'}
          </Button>
        </div>

        <p className="mt-4 font-mono text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
          Free for your first exam · No credit card
        </p>
      </div>
    </section>
  );
}
