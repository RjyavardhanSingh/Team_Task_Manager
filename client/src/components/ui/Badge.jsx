import { cn } from '../../utils/cn';

const styleByVariant = {
    neutral: 'bg-zinc-50 text-zinc-900 border-zinc-300',
    info: 'bg-zinc-100 text-zinc-900 border-zinc-300',
    warning: 'bg-zinc-200 text-zinc-900 border-zinc-300',
    success: 'bg-zinc-900 text-white border-zinc-900',
    danger: 'bg-zinc-700 text-white border-zinc-700',
};

export const Badge = ({ children, className, variant = 'neutral' }) => {
    return (
        <span
            className={cn(
                'inline-flex items-center border px-2 py-1 text-xs font-medium uppercase tracking-wide rounded-none',
                styleByVariant[variant] || styleByVariant.neutral,
                className
            )}
        >
            {children}
        </span>
    );
};
