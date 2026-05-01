import { cn } from '../../utils/cn';

export const Button = ({ children, className, variant = 'primary', size = 'md', isLoading, ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center border rounded-none font-medium transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:translate-y-px';
    
    const variants = {
        primary: 'border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-700',
        secondary: 'border-zinc-300 bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
        outline: 'border-zinc-400 bg-white text-zinc-900 hover:bg-zinc-100',
        danger: 'border-zinc-800 bg-zinc-800 text-white hover:bg-zinc-900',
        ghost: 'border-zinc-300 bg-zinc-50 text-zinc-900 hover:bg-zinc-100'
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base'
    };

    return (
        <button 
            className={cn(baseStyles, variants[variant], sizes[size], className)} 
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? <span className="mr-2 animate-pulse">Saving</span> : null}
            {children}
        </button>
    );
};
