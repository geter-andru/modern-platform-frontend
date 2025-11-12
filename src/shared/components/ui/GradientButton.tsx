'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

/**
 * GradientButton Component
 *
 * Production-ready button component extracted from existing platform patterns.
 * Matches design system established in DESIGN_SYSTEM_SURGICAL_FIXES_COMPLETE.md
 *
 * Features:
 * - Blue-to-purple gradient (brand identity)
 * - Hover animations (scale + shadow)
 * - Optional icons (left/right)
 * - Multiple size variants
 * - Accessible (ARIA labels, keyboard navigation)
 * - TypeScript typed
 *
 * Usage:
 * <GradientButton href="/signup" leftIcon={Zap} rightIcon={ArrowRight}>
 *   Apply for Founding Member Access
 * </GradientButton>
 */

export interface GradientButtonProps {
  /** Button text content */
  children: React.ReactNode;

  /** Navigation href (if link) or undefined (if button) */
  href?: string;

  /** Click handler (for non-link buttons) */
  onClick?: () => void;

  /** Icon to display on left side */
  leftIcon?: LucideIcon;

  /** Icon to display on right side */
  rightIcon?: LucideIcon;

  /** Button size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /** Visual style variant */
  variant?: 'primary' | 'secondary';

  /** Disabled state */
  disabled?: boolean;

  /** Full width button */
  fullWidth?: boolean;

  /** ARIA label for accessibility */
  ariaLabel?: string;

  /** Additional CSS classes */
  className?: string;

  /** Open link in new tab */
  target?: '_blank' | '_self';
}

// Size configurations
const sizeConfig = {
  sm: {
    padding: 'px-6 py-3',
    text: 'text-sm',
    iconSize: 'w-4 h-4',
    gap: 'gap-2'
  },
  md: {
    padding: 'px-8 py-4',
    text: 'text-base',
    iconSize: 'w-5 h-5',
    gap: 'gap-2'
  },
  lg: {
    padding: 'px-10 py-5',
    text: 'text-lg',
    iconSize: 'w-5 h-5',
    gap: 'gap-3'
  },
  xl: {
    padding: 'px-12 py-6',
    text: 'text-xl',
    iconSize: 'w-6 h-6',
    gap: 'gap-3'
  }
};

// Variant configurations
const variantConfig = {
  primary: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
    hoverShadow: '0 12px 32px rgba(59, 130, 246, 0.5)'
  },
  secondary: {
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
    hoverShadow: '0 12px 32px rgba(99, 102, 241, 0.5)'
  }
};

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  href,
  onClick,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  size = 'lg',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  ariaLabel,
  className = '',
  target = '_self'
}) => {
  const sizeClasses = sizeConfig[size];
  const variantStyle = variantConfig[variant];

  // Base classes (design system aligned)
  const baseClasses = `
    inline-flex items-center justify-center
    rounded-xl font-bold
    transition-all duration-300 transform
    hover:scale-105 hover:shadow-2xl
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    ${sizeClasses.padding}
    ${sizeClasses.text}
    ${sizeClasses.gap}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const buttonStyle = {
    background: variantStyle.background,
    color: '#FFFFFF',
    fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
    boxShadow: variantStyle.boxShadow
  };

  const content = (
    <>
      {LeftIcon && <LeftIcon className={sizeClasses.iconSize} />}
      {children}
      {RightIcon && <RightIcon className={sizeClasses.iconSize} />}
    </>
  );

  // Render as Link if href provided
  if (href && !disabled) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={baseClasses}
        style={buttonStyle}
        aria-label={ariaLabel}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      >
        {content}
      </Link>
    );
  }

  // Render as button
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      style={buttonStyle}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
};

export default GradientButton;
