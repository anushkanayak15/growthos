import type { Section, VariantTheme } from '@/lib/variants';

const TIMELINE_POINTS = [
  { label: 'Day 1', grade: 'C+', note: 'you today' },
  { label: 'Wk 2', grade: 'B−', delta: '+0.5' },
  { label: 'Wk 4', grade: 'B+', delta: '+0.9' },
  { label: 'Wk 6', grade: 'A−', delta: '+1.2' },
];

const STATS = [
  { value: '+1.2', label: 'letter grades average lift', sub: 'after 4 weeks (n=12,400)' },
  { value: '6.3h', label: 'saved per week', sub: 'vs. unstructured study' },
  { value: '92%', label: 'cut material they knew cold', sub: 'efficiency improvement' },
];

export function SocialProofA({ section, theme }: { section: Section; theme: VariantTheme }) {
  return (
    <section className="py-20 px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {section.copy.headline && (
          <h2 className="font-display text-2xl font-medium text-center text-graphite mb-16">
            {section.copy.headline}
          </h2>
        )}

        {/* Grade progression timeline */}
        <div className="relative mb-20">
          {/* Connecting track */}
          <div
            className="absolute left-[12.5%] right-[12.5%] h-px top-[18px]"
            style={{ background: 'var(--hairline)' }}
          />
          {/* Filled portion */}
          <div
            className="absolute left-[12.5%] h-px top-[18px] transition-all"
            style={{ width: '75%', background: theme.accent, opacity: 0.4 }}
          />

          <div className="grid grid-cols-4">
            {TIMELINE_POINTS.map((pt, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                {/* Dot */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center relative z-10"
                  style={{
                    background: i === 0 ? '#f2f1ec' : theme.accent,
                    border: i === 0 ? '2px solid var(--hairline)' : `2px solid ${theme.accent}`,
                    boxShadow: i === TIMELINE_POINTS.length - 1 ? `0 0 0 6px ${theme.accent}1a` : undefined,
                  }}
                >
                  <span className="font-mono text-[10px] font-medium" style={{ color: i === 0 ? 'var(--graphite-soft)' : 'white' }}>
                    {pt.grade}
                  </span>
                </div>
                <p className="font-mono text-xs text-graphite-soft">{pt.label}</p>
                {pt.delta ? (
                  <p className="font-mono text-xs font-medium" style={{ color: theme.accent }}>
                    {pt.delta}
                  </p>
                ) : (
                  <p className="font-mono text-[10px] text-graphite-soft">{pt.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-5">
          {STATS.map((s, i) => (
            <div key={i} className="rounded-2xl border border-hairline p-6">
              <p className="font-display text-4xl font-medium" style={{ color: theme.accent }}>
                {s.value}
              </p>
              <p className="text-sm text-graphite mt-2 font-medium">{s.label}</p>
              <p className="text-xs text-graphite-soft mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
