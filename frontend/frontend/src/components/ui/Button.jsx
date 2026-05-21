import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Custom Button component for the Dermisyn clinical design system.
 * Transitioned to 'Clinical Violet' identity.
 * 
 * @param {string} variant - One of: 'primary', 'secondary', 'outline', 'ghost', 'danger', 'white'
 * @param {string} size - One of: 'sm', 'default', 'lg', 'icon'
 * @param {boolean} isLoading - Displays a spinner and disables the button.
 */
export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'default', 
  isLoading = false, 
  children, 
  ...props 
}, ref) => {
  
  // Style variations for the 'Clinical Violet' theme
  const variantStyles = {
    primary: "bg-gradient-to-r from-violet-600 via-violet-500 to-violet-700 bg-[size:200%] hover:bg-right text-white shadow-premium border border-white/10",
    secondary: "bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-100 shadow-sm",
    outline: "bg-transparent border border-slate-200 text-slate-500 hover:border-violet-600 hover:text-violet-600 transition-all",
    ghost: "bg-transparent hover:bg-violet-50 text-slate-500 hover:text-violet-600 border border-transparent",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-lg",
    white: "bg-white text-slate-950 hover:bg-slate-50 border border-slate-200 shadow-xl font-black",
  };
  
  const sizeStyles = {
    sm: "h-10 px-6 text-[11px] font-black tracking-widest uppercase",
    default: "h-12 px-10 text-[11px] font-black tracking-[0.2em] uppercase",
    lg: "h-16 px-12 text-sm font-black tracking-[0.25em] uppercase",
    icon: "h-12 w-12",
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      disabled={isLoading || props.disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-[18px] transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-violet-600/20 disabled:opacity-50 disabled:pointer-events-none overflow-hidden",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <span className="flex items-center justify-center gap-3 relative z-10">{children}</span>
      )}
    </motion.button>
  );
});

Button.displayName = "Button";
