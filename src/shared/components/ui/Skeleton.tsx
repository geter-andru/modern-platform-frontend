'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Skeleton - Enterprise-grade skeleton loading component system
 * 
 * Features:
 * - Multiple skeleton variants (text, avatar, card, list, etc.)
 * - Customizable dimensions and animations
 * - Responsive skeleton layouts
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Multiple animation styles (shimmer, pulse, wave)
 * - Nested skeleton components
 * - Loading state patterns
 * - Theme-aware styling
 */

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
export type SkeletonAnimation = 'pulse' | 'shimmer' | 'wave' | 'none';
export type SkeletonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: string | number;
  height?: string | number;
  size?: SkeletonSize;
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
  'data-testid'?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  animation = 'pulse',
  width,
  height,
  size = 'md',
  className = '',
  children,
  'aria-label': ariaLabel,
  'data-testid': testId
}) => {
  // Size configurations
  const sizeClasses = {
    xs: 'h-3',
    sm: 'h-4',
    md: 'h-5',
    lg: 'h-6',
    xl: 'h-8'
  };

  // Variant configurations
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg'
  };

  // Animation configurations
  const getAnimationClasses = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'shimmer':
        return 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-shimmer';
      case 'wave':
        return 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-wave';
      case 'none':
        return '';
      default:
        return 'animate-pulse';
    }
  };

  // Build dimensions
  const getDimensions = () => {
    const styles: React.CSSProperties = {};
    
    if (width) {
      styles.width = typeof width === 'number' ? `${width}px` : width;
    }
    
    if (height) {
      styles.height = typeof height === 'number' ? `${height}px` : height;
    } else if (variant === 'text' && !height) {
      // Use size for text variant if no height specified
      return styles;
    }
    
    return styles;
  };

  // Build skeleton classes
  const skeletonClasses = `
    bg-gray-800
    ${variant === 'text' && !height ? sizeClasses[size] : ''}
    ${variantClasses[variant]}
    ${getAnimationClasses()}
    ${className}
  `.trim();

  // Custom shimmer keyframes (would need to be added to tailwind.config.js)
  const shimmerKeyframes = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;

  const waveKeyframes = `
    @keyframes wave {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;

  if (children) {
    return (
      <div 
        className={className}
        aria-label={ariaLabel || 'Loading...'}
        data-testid={testId}
      >
        {children}
      </div>
    );
  }

  return (
    <>
      {/* Add keyframes to head if using shimmer or wave animation */}
      {(animation === 'shimmer' || animation === 'wave') && (
        <style jsx>{`
          ${shimmerKeyframes}
          ${waveKeyframes}
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
          .animate-wave {
            animation: wave 1.5s infinite;
          }
        `}</style>
      )}
      
      <div
        className={skeletonClasses}
        style={getDimensions()}
        aria-label={ariaLabel || 'Loading...'}
        role="status"
        data-testid={testId}
      />
    </>
  );
};

// Avatar Skeleton Component
export interface SkeletonAvatarProps {
  size?: number | SkeletonSize;
  animation?: SkeletonAnimation;
  className?: string;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 'md',
  animation = 'pulse',
  className = ''
}) => {
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56
  };

  const dimensions = typeof size === 'number' ? size : sizeMap[size];

  return (
    <Skeleton
      variant="circular"
      width={dimensions}
      height={dimensions}
      animation={animation}
      className={className}
      aria-label="Loading avatar"
    />
  );
};

// Text Skeleton Component
export interface SkeletonTextProps {
  lines?: number;
  width?: string | string[];
  size?: SkeletonSize;
  animation?: SkeletonAnimation;
  className?: string;
  spacing?: 'tight' | 'normal' | 'loose';
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 1,
  width = '100%',
  size = 'md',
  animation = 'pulse',
  className = '',
  spacing = 'normal'
}) => {
  const spacingClasses = {
    tight: 'space-y-1',
    normal: 'space-y-2',
    loose: 'space-y-3'
  };

  const getLineWidth = (index: number) => {
    if (Array.isArray(width)) {
      return width[index] || width[width.length - 1] || '100%';
    }
    
    // Make last line shorter for natural text appearance
    if (index === lines - 1 && lines > 1 && width === '100%') {
      return '75%';
    }
    
    return width;
  };

  return (
    <div className={`${spacingClasses[spacing]} ${className}`} aria-label={`Loading ${lines} lines of text`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          size={size}
          width={getLineWidth(index)}
          animation={animation}
        />
      ))}
    </div>
  );
};

// Card Skeleton Component
export interface SkeletonCardProps {
  showAvatar?: boolean;
  avatarSize?: number | SkeletonSize;
  titleWidth?: string;
  descriptionLines?: number;
  showActions?: boolean;
  animation?: SkeletonAnimation;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showAvatar = true,
  avatarSize = 'md',
  titleWidth = '60%',
  descriptionLines = 2,
  showActions = true,
  animation = 'pulse',
  className = ''
}) => {
  return (
    <div className={`p-4 space-y-4 bg-gray-800/50 rounded-lg border border-gray-700 ${className}`} aria-label="Loading card">
      {/* Header with avatar and title */}
      <div className="flex items-start space-x-3">
        {showAvatar && (
          <SkeletonAvatar size={avatarSize} animation={animation} />
        )}
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" size="lg" width={titleWidth} animation={animation} />
          <Skeleton variant="text" size="sm" width="40%" animation={animation} />
        </div>
      </div>

      {/* Content */}
      {descriptionLines > 0 && (
        <SkeletonText
          lines={descriptionLines}
          size="md"
          animation={animation}
        />
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex space-x-2 pt-2">
          <Skeleton variant="rounded" width={80} height={32} animation={animation} />
          <Skeleton variant="rounded" width={80} height={32} animation={animation} />
        </div>
      )}
    </div>
  );
};

// List Skeleton Component
export interface SkeletonListProps {
  items?: number;
  showAvatar?: boolean;
  showActions?: boolean;
  animation?: SkeletonAnimation;
  className?: string;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  items = 3,
  showAvatar = true,
  showActions = false,
  animation = 'pulse',
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`} aria-label={`Loading list of ${items} items`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
          {showAvatar && (
            <SkeletonAvatar size="sm" animation={animation} />
          )}
          
          <div className="flex-1 space-y-2">
            <Skeleton 
              variant="text" 
              size="md" 
              width={`${60 + Math.random() * 30}%`} 
              animation={animation} 
            />
            <Skeleton 
              variant="text" 
              size="sm" 
              width={`${40 + Math.random() * 20}%`} 
              animation={animation} 
            />
          </div>

          {showActions && (
            <div className="flex space-x-2">
              <Skeleton variant="circular" width={24} height={24} animation={animation} />
              <Skeleton variant="circular" width={24} height={24} animation={animation} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Table Skeleton Component
export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  animation?: SkeletonAnimation;
  className?: string;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  animation = 'pulse',
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`} aria-label={`Loading table with ${rows} rows and ${columns} columns`}>
      {/* Header */}
      {showHeader && (
        <div className="flex space-x-4 p-3 bg-gray-800/50 rounded-lg">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1">
              <Skeleton 
                variant="text" 
                size="sm" 
                width={`${50 + Math.random() * 30}%`} 
                animation={animation} 
              />
            </div>
          ))}
        </div>
      )}

      {/* Rows */}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex space-x-4 p-3 bg-gray-800/20 rounded">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1">
                <Skeleton 
                  variant="text" 
                  size="sm" 
                  width={`${40 + Math.random() * 40}%`} 
                  animation={animation} 
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Dashboard Skeleton Component
export interface SkeletonDashboardProps {
  showHeader?: boolean;
  showSidebar?: boolean;
  showCards?: boolean;
  showChart?: boolean;
  animation?: SkeletonAnimation;
  className?: string;
}

export const SkeletonDashboard: React.FC<SkeletonDashboardProps> = ({
  showHeader = true,
  showSidebar = true,
  showCards = true,
  showChart = true,
  animation = 'pulse',
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`} aria-label="Loading dashboard">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <SkeletonAvatar size="lg" animation={animation} />
            <div className="space-y-2">
              <Skeleton variant="text" size="lg" width={200} animation={animation} />
              <Skeleton variant="text" size="sm" width={150} animation={animation} />
            </div>
          </div>
          <div className="flex space-x-2">
            <Skeleton variant="rounded" width={100} height={36} animation={animation} />
            <Skeleton variant="rounded" width={80} height={36} animation={animation} />
          </div>
        </div>
      )}

      <div className="flex space-x-6">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-64 space-y-4">
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton 
                  key={index}
                  variant="rounded" 
                  width="100%" 
                  height={40} 
                  animation={animation} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Stats Cards */}
          {showCards && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-4 bg-gray-800/30 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton variant="text" size="sm" width={80} animation={animation} />
                    <Skeleton variant="circular" width={24} height={24} animation={animation} />
                  </div>
                  <Skeleton variant="text" size="xl" width={120} animation={animation} />
                  <Skeleton variant="text" size="sm" width={100} animation={animation} />
                </div>
              ))}
            </div>
          )}

          {/* Chart */}
          {showChart && (
            <div className="p-6 bg-gray-800/30 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton variant="text" size="lg" width={200} animation={animation} />
                <Skeleton variant="rounded" width={100} height={32} animation={animation} />
              </div>
              <Skeleton variant="rectangular" width="100%" height={300} animation={animation} />
            </div>
          )}

          {/* Recent Activity */}
          <SkeletonList items={4} showAvatar showActions animation={animation} />
        </div>
      </div>
    </div>
  );
};

// Hook for skeleton loading states
export const useSkeleton = (loading: boolean = true) => {
  const [isLoading, setIsLoading] = React.useState(loading);

  const startLoading = React.useCallback(() => setIsLoading(true), []);
  const stopLoading = React.useCallback(() => setIsLoading(false), []);

  return {
    isLoading,
    setIsLoading,
    startLoading,
    stopLoading
  };
};

export default Skeleton;