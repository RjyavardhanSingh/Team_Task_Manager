import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Input = forwardRef(({ className, type = "text", error, label, ...props }, ref) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm font-medium text-zinc-900">{label}</label>}
            <input
                type={type}
                className={cn(
                    "field-control flex h-10 w-full rounded-none px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-zinc-700 bg-zinc-100",
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && <span className="text-xs text-zinc-800">{error}</span>}
        </div>
    );
});

Input.displayName = "Input";
