'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Spinner - Advanced loading spinner and skeleton components
 * 
 * Features:
 * - Multiple spinner variants (default, dots, pulse, bars, circle)
 * - Customizable sizes and colors
 * - Loading overlays for components
 * - Skeleton loading placeholders
 * - Progress indicators
 * - Animated loading states
 * - Accessibility compliant
 */

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'default' | 'dots' | 'pulse' | 'bars' | 'circle' | 'bounce';

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  color?: string;
  className?: string;
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'default',
  color = 'text-blue-500',
  className = '',
  label = 'Loading...'
}) => {
  // Size configurations
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const dotSizes = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  const barSizes = {
    xs: 'w-0.5 h-3',
    sm: 'w-0.5 h-4',
    md: 'w-1 h-5',
    lg: 'w-1 h-6',
    xl: 'w-1.5 h-8'
  };

  // Render different spinner variants
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={`flex items-center gap-1 ${className}`} role="status" aria-label={label}>
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={`${dotSizes[size]} ${color.replace('text-', 'bg-')} rounded-full`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut'
                }}
              />
            ))}
            <span className="sr-only">{label}</span>
          </div>
        );

      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} ${className}`} role="status" aria-label={label}>
            <motion.div
              className={`w-full h-full ${color.replace('text-', 'bg-')} rounded-full`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <span className="sr-only">{label}</span>
          </div>
        );

      case 'bars':
        return (
          <div className={`flex items-end gap-1 ${className}`} role="status" aria-label={label}>
            {[0, 1, 2, 3].map((index) => (
              <motion.div
                key={index}
                className={`${barSizes[size]} ${color.replace('text-', 'bg-')} rounded-sm`}
                animate={{
                  scaleY: [1, 0.3, 1]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: index * 0.1,
                  ease: 'easeInOut'
                }}
              />
            ))}
            <span className="sr-only">{label}</span>
          </div>
        );

      case 'circle':
        return (
          <div className={`${sizeClasses[size]} ${className}`} role="status" aria-label={label}>
            <motion.div
              className={`w-full h-full border-2 border-gray-300 rounded-full`}
              style={{
                borderTopColor: color.includes('blue') ? '#3B82F6' : 
                                color.includes('green') ? '#10B981' :
                                color.includes('red') ? '#EF4444' :
                                color.includes('yellow') ? '#F59E0B' : '#3B82F6'
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
            <span className="sr-only">{label}</span>
          </div>
        );

      case 'bounce':
        return (
          <div className={`flex items-center gap-1 ${className}`} role="status" aria-label={label}>
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={`${dotSizes[size]} ${color.replace('text-', 'bg-')} rounded-full`}
                animate={{
                  y: ['0%', '-50%', '0%']
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: index * 0.1,
                  ease: 'easeInOut'
                }}
              />
            ))}
            <span className="sr-only">{label}</span>
          </div>
        );

      default:
        return (
          <Loader2 
            className={`${sizeClasses[size]} ${color} animate-spin ${className}`} 
            role="status"
            aria-label={label}
          />
        );
    }
  };

  return renderSpinner();
};

// Loading Overlay Component
export interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinner?: SpinnerProps;
  message?: string;
  className?: string;
  overlayClassName?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  spinner = {},
  message = 'Loading...',
  className = '',
  overlayClassName = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`
            absolute inset-0 bg-gray-900/50 backdrop-blur-sm 
            flex items-center justify-center z-10 rounded-lg
            ${overlayClassName}
          `}
        >
          <div className="text-center">
            <Spinner {...spinner} />
            {message && (
              <p className="mt-3 text-sm text-white font-medium">
                {message}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Skeleton Component for loading placeholders
export interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'rectangular',
  animation = 'pulse'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'rounded';
      case 'circular':
        return 'rounded-full';
      default:
        return 'rounded-lg';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return 'animate-pulse'; // Could be enhanced with wave animation
      default:
        return '';
    }
  };

  return (
    <div
      className={`
        bg-gray-700 ${getVariantClasses()} ${getAnimationClasses()} ${className}
      `}
      style={{ width, height }}
      role="status"
      aria-label="Loading content..."
    />
  );
};

// Progress Spinner Component
export interface ProgressSpinnerProps {
  progress: number;
  size?: SpinnerSize;
  color?: string;
  backgroundColor?: string;
  strokeWidth?: number;
  showPercentage?: boolean;
  className?: string;
}

export const ProgressSpinner: React.FC<ProgressSpinnerProps> = ({
  progress,
  size = 'md',
  color = '#3B82F6',
  backgroundColor = '#374151',
  strokeWidth = 4,
  showPercentage = false,
  className = ''
}) => {
  const sizeValues = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80
  };

  const dimension = sizeValues[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`} style={{ width: dimension, height: dimension }}>
      <svg
        width={dimension}
        height={dimension}
        className="transform -rotate-90"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Background circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            strokeDasharray,
            strokeDashoffset
          }}
        />
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-white">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

// Loading Button Component
export interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  spinner?: SpinnerProps;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText = 'Loading...',
  spinner = { size: 'sm', variant: 'default' },
  children,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        relative flex items-center justify-center gap-2 transition-all duration-200
        ${isLoading ? 'cursor-not-allowed opacity-70' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading && (
        <Spinner {...spinner} />
      )}
      <span className={isLoading ? 'opacity-70' : ''}>
        {isLoading && loadingText ? loadingText : children}
      </span>
    </button>
  );
};

export default Spinner;