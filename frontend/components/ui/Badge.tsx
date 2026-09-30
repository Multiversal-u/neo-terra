import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-slate-800 text-slate-300 border-slate-700",
      success: "bg-emerald-950 text-emerald-400 border-emerald-800 shadow-[0_0_10px_rgba(5,150,105,0.2)]",
      warning: "bg-amber-950 text-amber-400 border-amber-800 shadow-[0_0_10px_rgba(217,119,6,0.2)]",
      error: "bg-red-950 text-red-400 border-red-800 shadow-[0_0_10px_rgba(220,38,38,0.2)]",
      info: "bg-cyan-950 text-cyan-400 border-cyan-800 shadow-[0_0_10px_rgba(8,145,178,0.2)]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
