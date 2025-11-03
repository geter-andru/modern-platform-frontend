/**
 * Andru Revenue Intelligence - Design System Input Component
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

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDrop' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2" style={{
          color: 'var(--color-text-secondary, #e5e5e5)',
          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
          fontWeight: 'var(--font-weight-medium, 500)'
        }}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <motion.input
          className={`form-input ${icon ? 'pl-10' : ''} ${className}`}
          style={{
            fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
            fontSize: 'var(--text-sm, 0.875rem)',
            color: 'var(--color-text-primary, #ffffff)'
          }}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm" style={{
          color: 'var(--color-accent-danger, #ef4444)',
          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
        }}>
          {error}
        </p>
      )}
    </div>
  );
};
