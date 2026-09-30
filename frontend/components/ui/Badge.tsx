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
      default: "bg-sand-100 text-ink-muted border-sand-border",
      success: "bg-moss-soft text-moss-dark border-moss/30",
      warning: "bg-sand-200 text-amber-800 border-sand-border",
      error: "bg-terracotta-soft text-terracotta border-terracotta/30",
      info: "bg-sand-100 text-moss border-sand-border",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-mono font-medium transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
