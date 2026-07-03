import { cn } from '@/lib/cn';

export const STEPS = ['pages', 'simulating', 'metrics', 'winner', 'evolve', 'validate'] as const;
export type Step = (typeof STEPS)[number];

const STEP_LABEL: Record<Step, string> = {
  pages: 'Gen 0',
  simulating: 'Stress Test',
  metrics: 'Attention',
  winner: 'Findings',
  evolve: 'Map',
  validate: 'Retest',
};

export function PipelineStepper({ current }: { current: Step }) {
  const currentIndex = STEPS.indexOf(current);

  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {STEPS.map((step, i) => {
        const state = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'todo';
        return (
          <div key={step} className="flex items-center">
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={cn(
                  'h-2 w-2 rounded-full transition-colors',
                  state === 'done' && 'bg-accent',
                  state === 'active' && 'bg-accent ring-4 ring-accent-soft',
                  state === 'todo' && 'bg-hairline'
                )}
              />
              <span
                className={cn(
                  'font-mono text-xs uppercase tracking-wider whitespace-nowrap',
                  state === 'todo' ? 'text-graphite-soft/60' : 'text-graphite'
                )}
              >
                {STEP_LABEL[step]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span className={cn('mx-3 h-px w-6 shrink-0', state === 'done' ? 'bg-accent' : 'bg-hairline')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
