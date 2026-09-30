import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  indicatorClassName?: string;
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, indicatorClassName, ...props }, ref) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    return (
      <div
        ref={ref}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-slate-800/80", className)}
        {...props}
      >
        <motion.div
          className={cn("h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]", indicatorClassName)}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";
