import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-moss disabled:pointer-events-none disabled:opacity-40 cursor-pointer font-sans";
    
    const variants = {
      primary: "bg-moss text-paper hover:bg-moss-light border border-moss-dark shadow-subtle",
      secondary: "bg-sand-100 text-ink hover:bg-white border border-sand-border",
      ghost: "hover:bg-sand-100 text-ink-muted hover:text-ink",
      danger: "bg-terracotta text-paper hover:bg-terracotta-dark border border-terracotta-dark",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-6 text-sm uppercase tracking-wider",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
