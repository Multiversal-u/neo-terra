import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const Gauge = React.forwardRef<HTMLDivElement, GaugeProps>(
  ({ className, value, size = 120, strokeWidth = 10, color = "#06b6d4", ...props }, ref) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const clampedValue = Math.min(100, Math.max(0, value));
    const offset = circumference - (clampedValue / 100) * circumference;

    return (
      <div ref={ref} className={cn("relative flex items-center justify-center", className)} {...props} style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(30, 41, 59, 0.5)" // slate-800/50
            strokeWidth={strokeWidth}
          />
          {/* Progress Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-slate-200">
          <span className="text-xl font-bold font-mono">{Math.round(clampedValue)}%</span>
        </div>
      </div>
    );
  }
);
Gauge.displayName = "Gauge";
