import type { Section, VariantTheme } from '@/lib/variants';

const REVIEWS = [
  { text: 'Went from a C+ to an A− in Organic Chemistry in 5 weeks.', name: 'Alicia R.', school: 'UT Austin', subject: 'Chem 301' },
  { text: 'Cut my study time in half right before finals. Went up a full grade.', name: 'Devon K.', school: 'Michigan', subject: 'Econ 401' },
  { text: 'Wish I found this freshman year. Would have saved me 2 years of bad grades.', name: 'Sam T.', school: 'UCLA', subject: 'Stats 100' },
  { text: 'My entire study group uses it now. We all improved together.', name: 'Naomi P.', school: 'Georgia Tech', subject: 'CS 3510' },
  { text: 'I went up a full grade in Statistics in 3 weeks, starting from failing.', name: 'Priya M.', school: 'Cornell', subject: 'STSCI 2110' },
  { text: 'The adaptive drilling found gaps I didn\'t even know I had.', name: 'Jordan L.', school: 'Penn', subject: 'Econ 001' },
];

function Stars() {
  return <span style={{ color: '#f59e0b' }}>★★★★★</span>;
}

export function SocialProofC({ section, theme }: { section: Section; theme: VariantTheme }) {
  return (
    <section className="py-16 px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Aggregate header */}
        <div
          className="flex flex-wrap items-center justify-between gap-6 mb-10 pb-8"
          style={{ borderBottom: '1px solid var(--hairline)' }}
        >
          <div className="flex items-center gap-4">
            <div className="text-3xl" style={{ color: '#f59e0b', letterSpacing: '2px' }}>★★★★★</div>
            <div>
              <p className="font-display text-2xl font-medium">4.8 / 5</p>
              <p className="text-xs text-graphite-soft mt-0.5">from 9,200 verified reviews</p>
            </div>
          </div>
          <div className="flex gap-8">
            {[
              { val: '50k+', lbl: 'students' },
              { val: '120', lbl: 'universities' },
              { val: '82%', lbl: 'return sem. 2' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="text-center">
                <p className="font-display text-2xl font-medium" style={{ color: theme.accent }}>{val}</p>
                <p className="text-xs text-graphite-soft mt-0.5">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {section.copy.headline && (
          <h2 className="font-display text-xl font-medium text-graphite mb-6">
            {section.copy.headline}
          </h2>
        )}

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="rounded-xl p-5 flex flex-col gap-3"
              style={{ border: '1px solid var(--hairline)', background: '#fff' }}
            >
              <Stars />
              <p className="text-sm text-graphite leading-relaxed flex-1">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="flex items-center gap-2.5 pt-2" style={{ borderTop: '1px solid var(--hairline)' }}>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0"
                  style={{ background: theme.accent }}
                >
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-xs font-medium text-graphite">{r.name}</p>
                  <p className="text-[10px] text-graphite-soft">{r.school} · {r.subject}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
