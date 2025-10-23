/**
 * H&S Revenue Intelligence Platform - Design System Card Component
 * Assets-App Design System Implementation
 * 
 * SURGICAL IMPLEMENTATION:
 * - Glass morphism effects
 * - Professional shadows
 * - Executive-level interactions
 * 
 * Last Updated: 2025-10-21
 */

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  glass = true,
  padding = 'md'
}) => {
  const baseClasses = 'card';
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const glassClasses = glass ? 'glass' : '';
  const hoverClasses = hover ? 'hover-lift' : '';

  return (
    <motion.div
      className={`${baseClasses} ${glassClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4 } : {}}
      style={{
        background: glass ? 'var(--glass-background, rgba(255, 255, 255, 0.03))' : 'var(--color-surface, #2a2a2a)',
        border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.08))',
        backdropFilter: glass ? 'var(--glass-backdrop, blur(16px))' : 'none',
        boxShadow: 'var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.3))'
      }}
    >
      {children}
    </motion.div>
  );
};
