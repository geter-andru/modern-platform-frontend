'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface XtractCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

/**
 * XtractCard - Xtract design system card component
 *
 * Features:
 * - Xtract 20px border radius (xtract-lg)
 * - Xtract shadow system (xtract-card)
 * - Glassmorphism (backdrop-blur-xl)
 * - Hover lift effect (4px translateY)
 * - White/10% border for subtle depth
 *
 * @example
 * <XtractCard hover={true} padding="lg">
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </XtractCard>
 */
export function XtractCard({
  children,
  className = '',
  hover = false,
  padding = 'md'
}: XtractCardProps) {
  const paddingStyles = {
    sm: 'p-4',    // 16px
    md: 'p-6',    // 24px
    lg: 'p-8'     // 32px
  };

  const baseStyles = `
    bg-white/5
    border border-white/10
    rounded-xtract-lg
    backdrop-blur-xl
    shadow-xtract-card
    ${paddingStyles[padding]}
  `;

  if (hover) {
    return (
      <motion.div
        whileHover={{
          y: -4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`${baseStyles} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseStyles} ${className}`}>
      {children}
    </div>
  );
}
