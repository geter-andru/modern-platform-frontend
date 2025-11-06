'use client';

import { ReactNode } from 'react';

interface XtractBadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * XtractBadge - Xtract design system badge component
 *
 * Features:
 * - Xtract 12px border radius (xtract-md)
 * - Andru blue primary color
 * - Clean, minimal styling
 * - Size variants (sm, md)
 * - Color variants (primary, secondary, success, warning)
 *
 * @example
 * <XtractBadge variant="primary" size="md">
 *   High Confidence
 * </XtractBadge>
 */
export function XtractBadge({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}: XtractBadgeProps) {
  const variantStyles = {
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-white/10 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-black'
  };

  const sizeStyles = {
    sm: 'text-caption px-2 py-1',      // 12px font, 8px/4px padding
    md: 'text-body-sm px-3 py-1.5'    // 14px font, 12px/6px padding
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-xtract-md
        font-normal
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </span>
  );
}
