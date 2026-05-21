import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Standardized status Badge for clinical and operational indicators.
 * Fully transitioned to the 'Clinical Violet' identity with upscaled typography.
 * 
 * @param {string} variant - One of: 'primary', 'success', 'warning', 'danger', 'info', 'white'
 */
export function Badge({ className, variant = 'primary', children, ...props }) {
  
  const variantStyles = {
    primary: "bg-violet-600/10 text-violet-600 border border-violet-100 shadow-sm",
    success: "bg-violet-50 text-violet-700 border border-violet-100 shadow-sm",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    danger: "bg-rose-50 text-rose-700 border border-rose-100 shadow-sm",
    info: "bg-slate-50 text-slate-500 border border-slate-100",
    white: "bg-white text-slate-950 font-black border border-slate-100 shadow-sm",
  };

  return (
    <div className={cn(
      "inline-flex items-center justify-center px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all",
      variantStyles[variant],
      className
    )} {...props}>
      {children}
    </div>
  );
}
