'use client';

import React, { ReactNode } from 'react';

// Badge types and variants
export type BadgeVariant = 'filled' | 'outlined' | 'subtle';
export type BadgeColor = 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

// Base Badge component
interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  rounded?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

export function Badge({
  children,
  variant = 'subtle',
  color = 'gray',
  size = 'sm',
  rounded = false,
  removable = false,
  onRemove,
  icon,
  rightIcon,
  className = ''
}: BadgeProps) {
  const getColorStyles = (color: BadgeColor, variant: BadgeVariant) => {
    const styles = {
      gray: {
        filled: 'bg-slate-600 text-white border-slate-600',
        outlined: 'bg-transparent text-slate-400 border-slate-500',
        subtle: 'bg-slate-800 text-slate-300 border-slate-700'
      },
      red: {
        filled: 'bg-red-600 text-white border-red-600',
        outlined: 'bg-transparent text-red-400 border-red-500',
        subtle: 'bg-red-900/20 text-red-400 border-red-700/50'
      },
      orange: {
        filled: 'bg-orange-600 text-white border-orange-600',
        outlined: 'bg-transparent text-orange-400 border-orange-500',
        subtle: 'bg-orange-900/20 text-orange-400 border-orange-700/50'
      },
      yellow: {
        filled: 'bg-yellow-600 text-white border-yellow-600',
        outlined: 'bg-transparent text-yellow-400 border-yellow-500',
        subtle: 'bg-yellow-900/20 text-yellow-400 border-yellow-700/50'
      },
      green: {
        filled: 'bg-emerald-600 text-white border-emerald-600',
        outlined: 'bg-transparent text-emerald-400 border-emerald-500',
        subtle: 'bg-emerald-900/20 text-emerald-400 border-emerald-700/50'
      },
      blue: {
        filled: 'bg-blue-600 text-white border-blue-600',
        outlined: 'bg-transparent text-blue-400 border-blue-500',
        subtle: 'bg-blue-900/20 text-blue-400 border-blue-700/50'
      },
      indigo: {
        filled: 'bg-indigo-600 text-white border-indigo-600',
        outlined: 'bg-transparent text-indigo-400 border-indigo-500',
        subtle: 'bg-indigo-900/20 text-indigo-400 border-indigo-700/50'
      },
      purple: {
        filled: 'bg-purple-600 text-white border-purple-600',
        outlined: 'bg-transparent text-purple-400 border-purple-500',
        subtle: 'bg-purple-900/20 text-purple-400 border-purple-700/50'
      },
      pink: {
        filled: 'bg-pink-600 text-white border-pink-600',
        outlined: 'bg-transparent text-pink-400 border-pink-500',
        subtle: 'bg-pink-900/20 text-pink-400 border-pink-700/50'
      }
    };
    return styles[color][variant];
  };

  const getSizeStyles = (size: BadgeSize) => {
    const styles = {
      xs: 'px-2 py-0.5 text-xs',
      sm: 'px-2.5 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base'
    };
    return styles[size];
  };

  const iconSize = size === 'xs' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <span
      className={`
        inline-flex items-center font-medium border transition-colors
        ${rounded ? 'rounded-full' : 'rounded-md'}
        ${getColorStyles(color, variant)}
        ${getSizeStyles(size)}
        ${className}
      `}
    >
      {icon && (
        <span className={`mr-1.5 ${iconSize}`}>
          {icon}
        </span>
      )}
      
      <span>{children}</span>
      
      {rightIcon && !removable && (
        <span className={`ml-1.5 ${iconSize}`}>
          {rightIcon}
        </span>
      )}
      
      {removable && (
        <button
          onClick={onRemove}
          className={`ml-1.5 ${iconSize} hover:bg-black/20 rounded-full transition-colors p-0.5`}
          aria-label="Remove"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

// Status Badge
interface StatusBadgeProps extends Omit<BadgeProps, 'color' | 'icon'> {
  status: 'active' | 'inactive' | 'pending' | 'error' | 'success' | 'warning';
  showDot?: boolean;
}

export function StatusBadge({ status, showDot = true, ...props }: StatusBadgeProps) {
  const statusConfig = {
    active: { color: 'green' as BadgeColor, label: 'Active' },
    inactive: { color: 'gray' as BadgeColor, label: 'Inactive' },
    pending: { color: 'yellow' as BadgeColor, label: 'Pending' },
    error: { color: 'red' as BadgeColor, label: 'Error' },
    success: { color: 'green' as BadgeColor, label: 'Success' },
    warning: { color: 'orange' as BadgeColor, label: 'Warning' }
  };

  const config = statusConfig[status];
  
  const dot = showDot ? (
    <span className={`w-2 h-2 rounded-full bg-current`} />
  ) : null;

  return (
    <Badge
      {...props}
      color={config.color}
      icon={dot}
    >
      {props.children || config.label}
    </Badge>
  );
}

// Number Badge (for counts, notifications, etc.)
interface NumberBadgeProps extends Omit<BadgeProps, 'children'> {
  count: number;
  max?: number;
  showZero?: boolean;
}

export function NumberBadge({ count, max = 99, showZero = false, ...props }: NumberBadgeProps) {
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge {...props} rounded>
      {displayCount}
    </Badge>
  );
}

// Priority Badge
interface PriorityBadgeProps extends Omit<BadgeProps, 'color' | 'children'> {
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export function PriorityBadge({ priority, ...props }: PriorityBadgeProps) {
  const priorityConfig = {
    low: { color: 'blue' as BadgeColor, label: 'Low', icon: '⬇️' },
    medium: { color: 'yellow' as BadgeColor, label: 'Medium', icon: '➡️' },
    high: { color: 'orange' as BadgeColor, label: 'High', icon: '⬆️' },
    urgent: { color: 'red' as BadgeColor, label: 'Urgent', icon: '🚨' }
  };

  const config = priorityConfig[priority];

  return (
    <Badge
      {...props}
      color={config.color}
      icon={<span>{config.icon}</span>}
    >
      {config.label}
    </Badge>
  );
}

// Tag Badge (for categories, labels, etc.)
interface TagBadgeProps extends BadgeProps {
  deletable?: boolean;
  onDelete?: () => void;
}

export function TagBadge({ deletable = false, onDelete, ...props }: TagBadgeProps) {
  return (
    <Badge
      {...props}
      variant="outlined"
      removable={deletable}
      onRemove={onDelete}
      rounded
    />
  );
}

// Progress Badge
interface ProgressBadgeProps extends Omit<BadgeProps, 'children' | 'icon'> {
  value: number;
  max?: number;
  showPercentage?: boolean;
  format?: 'percentage' | 'fraction';
}

export function ProgressBadge({ 
  value, 
  max = 100, 
  showPercentage = true,
  format = 'percentage',
  ...props 
}: ProgressBadgeProps) {
  const percentage = Math.round((value / max) * 100);
  
  let color: BadgeColor = 'gray';
  if (percentage >= 80) color = 'green';
  else if (percentage >= 60) color = 'blue';
  else if (percentage >= 40) color = 'yellow';
  else if (percentage >= 20) color = 'orange';
  else color = 'red';

  const displayValue = format === 'percentage' 
    ? `${percentage}%` 
    : `${value}/${max}`;

  return (
    <Badge {...props} color={color}>
      {displayValue}
    </Badge>
  );
}

// Version Badge
interface VersionBadgeProps extends Omit<BadgeProps, 'children'> {
  version: string;
  prefix?: string;
}

export function VersionBadge({ version, prefix = 'v', ...props }: VersionBadgeProps) {
  return (
    <Badge {...props} variant="outlined" color="blue">
      {prefix}{version}
    </Badge>
  );
}

// Badge Group (for displaying multiple badges together)
interface BadgeGroupProps {
  children: ReactNode;
  spacing?: 'tight' | 'normal' | 'loose';
  wrap?: boolean;
  className?: string;
}

export function BadgeGroup({ 
  children, 
  spacing = 'normal',
  wrap = true,
  className = '' 
}: BadgeGroupProps) {
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
}

// Interactive Badge (clickable)
interface InteractiveBadgeProps extends BadgeProps {
  onClick?: () => void;
  href?: string;
  selected?: boolean;
}

export function InteractiveBadge({ 
  onClick, 
  href, 
  selected = false,
  className = '',
  ...props 
}: InteractiveBadgeProps) {
  const Component = href ? 'a' : 'button';
  const isInteractive = onClick || href;

  const interactiveClasses = isInteractive
    ? 'cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500/50'
    : '';

  const selectedClasses = selected
    ? 'ring-2 ring-blue-500/50'
    : '';

  if (!isInteractive) {
    return <Badge {...props} className={`${className} ${selectedClasses}`} />;
  }

  return (
    <Component
      onClick={onClick}
      href={href}
      className={`inline-block ${interactiveClasses} ${selectedClasses} ${className}`}
    >
      <Badge {...props} />
    </Component>
  );
}

export default {
  Badge,
  StatusBadge,
  NumberBadge,
  PriorityBadge,
  TagBadge,
  ProgressBadge,
  VersionBadge,
  BadgeGroup,
  InteractiveBadge
};