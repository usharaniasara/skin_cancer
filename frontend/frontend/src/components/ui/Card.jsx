import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Primitive Card component for the Nebula design system.
 * Supports glassmorphism and iridescent effects via global CSS classes.
 */
export function Card({ className, children, ...props }) {
  return (
    <div 
      className={cn(
        "rounded-[48px] overflow-hidden bg-slate-900/40 border border-white/5 backdrop-blur-3xl transition-all duration-700",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
