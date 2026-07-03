import { cn } from '@/lib/cn';

export function Badge({
  children,
  className,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  className?: string;
  tone?: 'neutral' | 'accent' | 'good' | 'warn';
}) {
  const toneClasses = {
    neutral: 'bg-graphite/5 text-graphite-soft border-hairline',
    accent: 'bg-accent-soft text-accent border-accent/20',
    good: 'bg-good/10 text-good border-good/20',
    warn: 'bg-warn/10 text-warn border-warn/20',
  }[tone];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider',
        toneClasses,
        className
      )}
    >
      {children}
    </span>
  );
}
