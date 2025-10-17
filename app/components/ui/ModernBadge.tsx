'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * ModernBadge - Comprehensive badge component system for Next.js App Router
 *
 * Features:
 * - 6 semantic variants (default, primary, success, warning, danger, info)
 * - 3 sizes (sm, md, lg)
 * - Optional icon support (left or right)
 * - Optional dot indicator with pulsing animation
 * - Removable badges with close button
 * - Pill vs rounded shape options
 * - Count badge variant for notifications
 * - Status, priority, progress, version, and tag badges
 * - Badge group container for multiple badges
 * - Interactive/clickable badges
 * - Dark theme design system
 * - Framer Motion animations
 * - TypeScript strict mode
 * - Full accessibility
 */

export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  pill?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  showDot?: boolean;
  dotColor?: string;
  pulse?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const ModernBadge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  pill = false,
  icon,
  iconPosition = 'left',
  showDot = false,
  dotColor,
  pulse = false,
  removable = false,
  onRemove,
  className = ''
}) => {
  // Variant configurations with dark theme colors
  const variantStyles = {
    default: 'bg-gray-700/20 text-gray-300 border-gray-700/30',
    primary: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  // Size configurations
  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizeStyles = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const dotSizeStyles = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  // Pulse animation for dot indicator
  const pulseAnimation = pulse ? {
    scale: [1, 1.2, 1],
    opacity: [1, 0.7, 1]
  } : {};

  return (
    <span
      className={`
        inline-flex items-center font-medium border transition-all duration-200
        ${pill ? 'rounded-full' : 'rounded-md'}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {/* Dot Indicator */}
      {showDot && (
        <motion.span
          animate={pulseAnimation}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className={`
            ${dotSizeStyles[size]} rounded-full mr-1.5
            ${dotColor || 'bg-current'}
          `}
        />
      )}

      {/* Left Icon */}
      {icon && iconPosition === 'left' && (
        <span className={`${iconSizeStyles[size]} mr-1.5 flex-shrink-0`}>
          {icon}
        </span>
      )}

      {/* Content */}
      <span>{children}</span>

      {/* Right Icon */}
      {icon && iconPosition === 'right' && !removable && (
        <span className={`${iconSizeStyles[size]} ml-1.5 flex-shrink-0`}>
          {icon}
        </span>
      )}

      {/* Remove Button */}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={`
            ${iconSizeStyles[size]} ml-1.5 flex-shrink-0
            hover:bg-black/20 rounded-full transition-colors p-0.5
          `}
          aria-label="Remove badge"
          type="button"
        >
          <X className="w-full h-full" />
        </button>
      )}
    </span>
  );
};

// Count/Number Badge for notifications
export interface NumberBadgeProps extends Omit<BadgeProps, 'children'> {
  count: number;
  max?: number;
  showZero?: boolean;
}

export const NumberBadge: React.FC<NumberBadgeProps> = ({
  count,
  max = 99,
  showZero = false,
  pill = true,
  ...props
}) => {
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <ModernBadge {...props} pill={pill}>
      {displayCount}
    </ModernBadge>
  );
};

// Status Badge with semantic colors
export type StatusType = 'active' | 'inactive' | 'pending' | 'error' | 'success' | 'warning';

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  status: StatusType;
  children?: ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showDot = true,
  pulse = false,
  children,
  ...props
}) => {
  const statusConfig: Record<StatusType, { variant: BadgeVariant; label: string; shouldPulse: boolean }> = {
    active: { variant: 'success', label: 'Active', shouldPulse: true },
    inactive: { variant: 'default', label: 'Inactive', shouldPulse: false },
    pending: { variant: 'warning', label: 'Pending', shouldPulse: true },
    error: { variant: 'danger', label: 'Error', shouldPulse: false },
    success: { variant: 'success', label: 'Success', shouldPulse: false },
    warning: { variant: 'warning', label: 'Warning', shouldPulse: false }
  };

  const config = statusConfig[status];

  return (
    <ModernBadge
      {...props}
      variant={config.variant}
      showDot={showDot}
      pulse={pulse ?? config.shouldPulse}
    >
      {children || config.label}
    </ModernBadge>
  );
};

// Priority Badge
export type PriorityType = 'low' | 'medium' | 'high' | 'urgent';

export interface PriorityBadgeProps extends Omit<BadgeProps, 'variant' | 'icon' | 'children'> {
  priority: PriorityType;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  ...props
}) => {
  const priorityConfig: Record<PriorityType, { variant: BadgeVariant; label: string; icon: string }> = {
    low: { variant: 'info', label: 'Low', icon: '↓' },
    medium: { variant: 'warning', label: 'Medium', icon: '→' },
    high: { variant: 'warning', label: 'High', icon: '↑' },
    urgent: { variant: 'danger', label: 'Urgent', icon: '!!' }
  };

  const config = priorityConfig[priority];

  return (
    <ModernBadge
      {...props}
      variant={config.variant}
      icon={<span className="font-bold">{config.icon}</span>}
      iconPosition="left"
    >
      {config.label}
    </ModernBadge>
  );
};

// Progress Badge with percentage display
export interface ProgressBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  value: number;
  max?: number;
  format?: 'percentage' | 'fraction';
}

export const ProgressBadge: React.FC<ProgressBadgeProps> = ({
  value,
  max = 100,
  format = 'percentage',
  ...props
}) => {
  const percentage = Math.round((value / max) * 100);

  let variant: BadgeVariant = 'default';
  if (percentage >= 80) variant = 'success';
  else if (percentage >= 60) variant = 'info';
  else if (percentage >= 40) variant = 'warning';
  else if (percentage >= 20) variant = 'warning';
  else variant = 'danger';

  const displayValue = format === 'percentage'
    ? `${percentage}%`
    : `${value}/${max}`;

  return (
    <ModernBadge {...props} variant={variant}>
      {displayValue}
    </ModernBadge>
  );
};

// Tag Badge (deletable tags for categories, labels)
export interface TagBadgeProps extends BadgeProps {
  deletable?: boolean;
  onDelete?: () => void;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  deletable = false,
  onDelete,
  pill = true,
  variant = 'default',
  ...props
}) => {
  return (
    <ModernBadge
      {...props}
      variant={variant}
      pill={pill}
      removable={deletable}
      onRemove={onDelete}
    />
  );
};

// Version Badge
export interface VersionBadgeProps extends Omit<BadgeProps, 'children'> {
  version: string;
  prefix?: string;
}

export const VersionBadge: React.FC<VersionBadgeProps> = ({
  version,
  prefix = 'v',
  variant = 'info',
  ...props
}) => {
  return (
    <ModernBadge {...props} variant={variant}>
      {prefix}{version}
    </ModernBadge>
  );
};

// Badge Group container for displaying multiple badges
export interface BadgeGroupProps {
  children: ReactNode;
  spacing?: 'tight' | 'normal' | 'loose';
  wrap?: boolean;
  className?: string;
}

export const BadgeGroup: React.FC<BadgeGroupProps> = ({
  children,
  spacing = 'normal',
  wrap = true,
  className = ''
}) => {
  const spacingClasses = {
    tight: 'gap-1',
    normal: 'gap-2',
    loose: 'gap-3'
  };

  return (
    <div
      className={`
        flex items-center
        ${spacingClasses[spacing]}
        ${wrap ? 'flex-wrap' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Interactive Badge (clickable/linkable)
export interface InteractiveBadgeProps extends BadgeProps {
  onClick?: () => void;
  href?: string;
  selected?: boolean;
}

export const InteractiveBadge: React.FC<InteractiveBadgeProps> = ({
  onClick,
  href,
  selected = false,
  className = '',
  ...props
}) => {
  const Component = href ? 'a' : 'button';
  const isInteractive = onClick || href;

  const interactiveClasses = isInteractive
    ? 'cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500/50'
    : '';

  const selectedClasses = selected
    ? 'ring-2 ring-purple-500/50'
    : '';

  if (!isInteractive) {
    return <ModernBadge {...props} className={`${className} ${selectedClasses}`} />;
  }

  const componentProps: any = {
    className: `inline-block ${interactiveClasses} ${selectedClasses}`,
    ...(href ? { href } : {}),
    ...(onClick ? { onClick, type: 'button' } : {})
  };

  return (
    <Component {...componentProps}>
      <ModernBadge {...props} className={className} />
    </Component>
  );
};

ModernBadge.displayName = 'ModernBadge';

export default ModernBadge;
