/**
 * H&S Revenue Intelligence Platform - Design System Button Component
 * Assets-App Design System Implementation
 * 
 * SURGICAL IMPLEMENTATION:
 * - Glass morphism effects
 * - Professional typography
 * - Executive-level interactions
 * 
 * Last Updated: 2025-10-21
 */

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  loading = false,
  icon,
  disabled,
  ...props
}) => {
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-secondary bg-transparent border-transparent hover:bg-glass-background'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      style={{
        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
        fontWeight: 'var(--font-weight-medium, 500)',
        letterSpacing: 'var(--tracking-wide, 0.025em)'
      }}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {children}
        </div>
      )}
    </motion.button>
  );
};
