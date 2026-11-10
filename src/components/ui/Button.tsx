import React from 'react';
import { cn } from '@/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'glass',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-full';

  const variants = {
    primary:
      'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 active:scale-95',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-100 active:scale-95',
    ghost:
      'bg-transparent hover:bg-white/10 text-slate-300 hover:text-white',
    glass:
      'bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 text-slate-100 shadow-sm active:scale-95',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
