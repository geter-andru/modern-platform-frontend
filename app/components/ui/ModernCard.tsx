'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

/**
 * ModernCard - Professional SaaS-style card component
 *
 * Features:
 * - Modern card layout with professional spacing
 * - Professional dark theme colors
 * - Smooth hover transitions and interactive states
 * - Flexible sizing with responsive behavior
 * - Clean typography hierarchy
 */

type CardSize = 'small' | 'medium' | 'large' | 'auto';
type CardVariant = 'default' | 'highlighted' | 'success' | 'warning' | 'glass';
type CardPadding = 'none' | 'compact' | 'default' | 'spacious';

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  size?: CardSize;
  variant?: CardVariant;
  interactive?: boolean;
  padding?: CardPadding;
}

const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className = '',
  size = 'medium',
  variant = 'default',
  interactive = true,
  padding = 'default'
}) => {
  // Size configurations with responsive adjustments
  const sizeClasses: Record<CardSize, string> = {
    small: 'min-h-[180px] sm:min-h-[200px]',
    medium: 'min-h-[240px] sm:min-h-[280px]',
    large: 'min-h-[300px] sm:min-h-[360px]',
    auto: 'min-h-fit'
  };

  // Padding configurations with responsive adjustments
  const paddingClasses: Record<CardPadding, string> = {
    none: 'p-0',
    compact: 'p-3 sm:p-4',
    default: 'p-4 sm:p-6',
    spacious: 'p-6 sm:p-8'
  };

  // Variant configurations
  const variantClasses: Record<CardVariant, string> = {
    default: 'bg-[#1a1a1a] border-transparent',
    highlighted: 'bg-[#1a1a1a] border-transparent ring-1 ring-purple-500/20',
    success: 'bg-[#1a1a1a] border-transparent ring-1 ring-green-500/20',
    warning: 'bg-[#1a1a1a] border-transparent ring-1 ring-orange-500/20',
    glass: 'bg-gray-900/50 border-transparent backdrop-blur-sm'
  };

  // Interactive states
  const interactiveClasses = interactive
    ? 'hover:shadow-xl hover:shadow-black/20 transition-all duration-300 cursor-pointer'
    : '';

  const baseClasses = `
    relative rounded-xl border border-transparent backdrop-blur-sm
    ${sizeClasses[size]}
    ${paddingClasses[padding]}
    ${variantClasses[variant]}
    ${interactiveClasses}
    ${className}
  `.trim();

  return (
    <motion.div
      className={baseClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={interactive ? {
        y: -2,
        transition: { duration: 0.2 }
      } : {}}
    >
      {children}
    </motion.div>
  );
};

/**
 * ModernCardHeader - Header section for cards
 */
interface ModernCardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export const ModernCardHeader: React.FC<ModernCardHeaderProps> = ({
  title,
  subtitle,
  action,
  icon: Icon,
  className = ''
}) => {
  return (
    <div className={`flex items-start justify-between mb-6 ${className}`}>
      <div className="flex items-start space-x-3">
        {Icon && (
          <div className="p-2 rounded-lg bg-gray-800/50">
            <Icon className="w-5 h-5 text-purple-400" />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

/**
 * ModernCardContent - Main content area for cards
 */
interface ModernCardContentProps {
  children: ReactNode;
  className?: string;
}

export const ModernCardContent: React.FC<ModernCardContentProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`flex-1 ${className}`}>
      {children}
    </div>
  );
};

/**
 * ModernCardFooter - Footer section for cards
 */
interface ModernCardFooterProps {
  children: ReactNode;
  className?: string;
}

export const ModernCardFooter: React.FC<ModernCardFooterProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`mt-6 pt-4 border-t border-transparent ${className}`}>
      {children}
    </div>
  );
};

/**
 * ModernMetricCard - Specialized card for displaying metrics
 */
type ChangeType = 'positive' | 'negative' | 'neutral';

interface ModernMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: ChangeType;
  icon?: LucideIcon;
  trend?: ReactNode;
  className?: string;
}

export const ModernMetricCard: React.FC<ModernMetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon: Icon,
  trend,
  className = ''
}) => {
  const changeColors: Record<ChangeType, string> = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400'
  };

  return (
    <ModernCard size="small" padding="default" className={className}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-gray-800/50">
            <Icon className="w-5 h-5 text-purple-400" />
          </div>
        )}
      </div>

      {(change || trend) && (
        <div className="flex items-center justify-between">
          {change && (
            <span className={`text-sm font-medium ${changeColors[changeType]}`}>
              {change}
            </span>
          )}
          {trend && (
            <div className="flex-1 ml-4">
              {trend}
            </div>
          )}
        </div>
      )}
    </ModernCard>
  );
};

/**
 * ModernGridContainer - Responsive grid container for dashboard layout
 */
interface ModernGridContainerProps {
  children: ReactNode;
  className?: string;
}

export const ModernGridContainer: React.FC<ModernGridContainerProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`
      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
      gap-4 sm:gap-6 auto-rows-min
      px-4 sm:px-0
      ${className}
    `}>
      {children}
    </div>
  );
};

// Export default and named exports
export default ModernCard;
export { ModernCard };
