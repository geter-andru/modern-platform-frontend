'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

interface XtractButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * XtractButton - Xtract design system button with Andru brand colors
 *
 * Features:
 * - Xtract 6px border radius
 * - Multi-layer shadow system (xtract-button)
 * - Hover lift effect (-translate-y-0.5)
 * - Andru blue primary color (#3b82f6)
 * - Red Hat Display font (inherited)
 * - Framer Motion animations
 *
 * @example
 * <XtractButton variant="primary" size="lg" href="/dashboard">
 *   Go to Dashboard
 * </XtractButton>
 */
export function XtractButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  disabled = false,
  ariaLabel
}: XtractButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-normal transition-all duration-200 ease-out
    focus-visible:ring-4 focus-visible:ring-blue-500/50
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: `
      bg-blue-600 hover:bg-blue-700
      border border-white/10
      text-white shadow-xtract-button
      hover:shadow-xtract-lg hover:-translate-y-0.5
    `,
    secondary: `
      bg-white/5 hover:bg-white/10
      border border-white/10
      text-white shadow-xtract-button
      hover:shadow-xtract-lg hover:-translate-y-0.5
    `,
    ghost: `
      bg-transparent hover:bg-white/5
      text-white border border-transparent
      hover:border-white/10
    `
  };

  const sizeStyles = {
    sm: 'text-caption px-3 py-1.5 rounded-xtract-sm',
    md: 'text-body-sm px-4 py-2 rounded-xtract',
    lg: 'text-body-lg px-6 py-3 rounded-xtract'
  };

  const classes = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const content = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-2"
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
