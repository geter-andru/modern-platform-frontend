import React from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * Badge Component
 *
 * Based on SnowUI Design System patterns and 21st.dev social proof mechanics.
 * Used for status indicators, counts, labels, and social proof.
 *
 * Design Specs from SnowUI:
 * - Small: 20px height
 * - Medium: 24px height
 * - Padding: 6px 12px
 * - Border radius: 12px (pill-shaped)
 *
 * Color System:
 * - Success (Green): High confidence, positive metrics
 * - Warning (Yellow): Medium confidence, caution
 * - Danger (Red): Low confidence, negative indicators
 * - Info (Blue): Neutral information
 * - Neutral (Gray): Inactive/disabled states
 */

export interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant,
  size = 'md',
  children,
  icon: Icon,
  className = ''
}) => {
  // Variant color mappings
  const variantStyles = {
    success: {
      bg: 'rgba(34, 197, 94, 0.1)',      // green-500 with 10% opacity
      border: 'rgba(34, 197, 94, 0.3)',   // green-500 with 30% opacity
      text: '#22c55e'                     // green-500
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.1)',     // amber-500 with 10% opacity
      border: 'rgba(245, 158, 11, 0.3)',  // amber-500 with 30% opacity
      text: '#f59e0b'                     // amber-500
    },
    danger: {
      bg: 'rgba(239, 68, 68, 0.1)',      // red-500 with 10% opacity
      border: 'rgba(239, 68, 68, 0.3)',   // red-500 with 30% opacity
      text: '#ef4444'                     // red-500
    },
    info: {
      bg: 'rgba(59, 130, 246, 0.1)',     // blue-500 with 10% opacity
      border: 'rgba(59, 130, 246, 0.3)',  // blue-500 with 30% opacity
      text: '#3b82f6'                     // blue-500
    },
    neutral: {
      bg: 'rgba(115, 115, 115, 0.1)',    // neutral-500 with 10% opacity
      border: 'rgba(115, 115, 115, 0.3)', // neutral-500 with 30% opacity
      text: '#737373'                     // neutral-500
    }
  };

  // Size mappings
  const sizeStyles = {
    sm: {
      height: '20px',
      fontSize: '0.75rem',    // 12px
      padding: '4px 10px',
      iconSize: 'w-3 h-3'     // 12px
    },
    md: {
      height: '24px',
      fontSize: '0.875rem',   // 14px
      padding: '6px 12px',
      iconSize: 'w-4 h-4'     // 16px
    }
  };

  const colors = variantStyles[variant];
  const sizing = sizeStyles[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium ${className}`}
      style={{
        height: sizing.height,
        padding: sizing.padding,
        fontSize: sizing.fontSize,
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        color: colors.text
      }}
    >
      {Icon && <Icon className={sizing.iconSize} />}
      {children}
    </span>
  );
};

export default Badge;
