import { cn } from '@/lib/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  accent?: string;
  size?: 'md' | 'lg';
}

export function Button({
  children,
  className,
  variant = 'primary',
  accent,
  size = 'md',
  style,
  ...props
}: ButtonProps) {
  const sizeClasses = size === 'lg' ? 'px-6 py-3.5 text-base' : 'px-4 py-2.5 text-sm';

  const variantClasses = {
    primary: 'text-white shadow-sm hover:opacity-90',
    secondary: 'bg-white border border-hairline text-graphite hover:bg-graphite/[0.03]',
    ghost: 'text-graphite hover:bg-graphite/5',
  }[variant];

  const computedStyle =
    variant === 'primary'
      ? { backgroundColor: accent ?? 'var(--accent)', ...style }
      : style;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors cursor-pointer',
        sizeClasses,
        variantClasses,
        className
      )}
      style={computedStyle}
      {...props}
    >
      {children}
    </button>
  );
}
