import React from 'react';
import { motion } from 'framer-motion';

/**
 * ModernCard - Professional SaaS-style card component
 * 
 * Features:
 * - Modern card layout with professional spacing
 * - Professional dark theme colors using CSS variables
 * - Smooth hover transitions and interactive states
 * - Flexible sizing with responsive behavior
 * - Clean typography hierarchy
 */

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'auto';
  variant?: 'default' | 'highlighted' | 'success' | 'warning' | 'glass';
  interactive?: boolean;
  padding?: 'none' | 'compact' | 'default' | 'spacious';
  onClick?: () => void;
}

const ModernCard: React.FC<ModernCardProps> = ({ 
  children, 
  className = '', 
  size = 'medium',
  variant = 'default',
  interactive = false,
  padding = 'default',
  onClick
}) => {
  // Size configurations with responsive adjustments and padding
  const sizeClasses = {
    small: 'min-h-[180px] sm:min-h-[200px] p-4',
    medium: 'min-h-[240px] sm:min-h-[280px] p-6',
    large: 'min-h-[300px] sm:min-h-[360px] p-8',
    auto: 'min-h-fit p-0'
  };

  // Padding configurations with responsive adjustments
  const paddingClasses = {
    none: 'p-0',
    compact: 'p-3',
    default: 'p-6',
    spacious: 'p-8'
  };

  // Variant configurations using CSS variables
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800',
    highlighted: 'bg-gradient-to-br from-purple-50 to-blue-50',
    success: 'bg-green-50 dark:bg-green-900/20',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20',
    glass: 'bg-white/80 backdrop-blur-sm'
  };

  // Interactive states
  const interactiveClasses = interactive 
    ? 'hover:shadow-lg transition-all duration-300 cursor-pointer'
    : '';

  // Use padding prop to override size-based padding
  const finalSizeClasses = padding !== 'default' 
    ? sizeClasses[size].replace(/p-\d+/, paddingClasses[padding])
    : sizeClasses[size];

  const baseClasses = `
    relative rounded-xl border backdrop-blur-sm
    ${finalSizeClasses}
    ${variantClasses[variant]}
    ${interactiveClasses}
    ${className}
  `.trim();

  return (
    <motion.div
      role="article"
      className={baseClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={interactive ? { 
        y: -2,
        transition: { duration: 0.2 }
      } : {}}
      onClick={interactive ? onClick : undefined}
      tabIndex={interactive ? 0 : undefined}
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
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

const ModernCardHeader: React.FC<ModernCardHeaderProps> = ({ 
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
          <div className="p-2 rounded-lg bg-surface/50">
            <Icon className="w-5 h-5 text-brand-accent" />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
          {subtitle && (
            <p className="text-sm text-text-muted">{subtitle}</p>
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
  children: React.ReactNode;
  className?: string;
}

const ModernCardContent: React.FC<ModernCardContentProps> = ({ 
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
  children: React.ReactNode;
  className?: string;
}

const ModernCardFooter: React.FC<ModernCardFooterProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`mt-6 pt-4 border-t border-surface ${className}`}>
      {children}
    </div>
  );
};

/**
 * ModernMetricCard - Specialized card for displaying metrics
 */
interface ModernMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ComponentType<{ className?: string }>;
  trend?: React.ReactNode;
  className?: string;
}

const ModernMetricCard: React.FC<ModernMetricCardProps> = ({ 
  title, 
  value, 
  subtitle,
  change,
  changeType = 'neutral',
  icon: Icon,
  trend,
  className = ''
}) => {
  const changeColors = {
    positive: 'text-brand-secondary',
    negative: 'text-accent-danger',
    neutral: 'text-text-muted'
  };

  return (
    <ModernCard size="small" padding="default" className={className}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
          {subtitle && (
            <p className="text-sm text-text-subtle mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-surface/50">
            <Icon className="w-5 h-5 text-brand-accent" />
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
  children: React.ReactNode;
  className?: string;
}

const ModernGridContainer: React.FC<ModernGridContainerProps> = ({ 
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

// Export all components
export default ModernCard;
export { ModernCard };
export { 
  ModernCardHeader, 
  ModernCardContent, 
  ModernCardFooter, 
  ModernMetricCard, 
  ModernGridContainer 
};
