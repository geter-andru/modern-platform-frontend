import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ModernCircularProgress - Professional circular progress component
 * 
 * Features:
 * - Professional circular progress with smooth animations
 * - Multiple size variants (sm, md, lg, xl)
 * - Color schemes matching the design system
 * - Customizable stroke width and colors
 * - Center content support for additional metrics
 * - TypeScript-first implementation
 */

interface ModernCircularProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  strokeWidth?: number;
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'brand-primary' | 'brand-secondary' | 'accent-success' | 'accent-warning' | 'accent-danger';
  backgroundColor?: string;
  showPercentage?: boolean;
  centerContent?: React.ReactNode;
  label?: string;
  animated?: boolean;
  className?: string;
}

interface ModernProgressGroupProps {
  children: React.ReactNode;
  className?: string;
}

interface ModernMiniProgressProps {
  value: number;
  max?: number;
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'brand-primary' | 'brand-secondary' | 'accent-success' | 'accent-warning' | 'accent-danger';
  label?: string;
  size?: 'sm' | 'md' | 'lg' | number;
  className?: string;
}

const ModernCircularProgress: React.FC<ModernCircularProgressProps> = ({
  value = 0,
  max = 100,
  size = 'lg',
  strokeWidth,
  color = 'brand-primary',
  backgroundColor = 'var(--color-surface)',
  showPercentage = true,
  centerContent,
  label,
  animated = true,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Size configurations
  const sizeConfig = {
    sm: { size: 60, strokeWidth: 4 },
    md: { size: 80, strokeWidth: 6 },
    lg: { size: 120, strokeWidth: 8 },
    xl: { size: 160, strokeWidth: 10 }
  };
  
  const actualSize = typeof size === 'number' ? size : sizeConfig[size].size;
  const actualStrokeWidth = strokeWidth || (typeof size === 'number' ? 8 : sizeConfig[size].strokeWidth);
  
  const radius = (actualSize - actualStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  const offset = circumference - (percentage / 100) * circumference;

  // Color schemes matching the design system
  const colorSchemes = {
    purple: {
      primary: '#8B5CF6',
      gradient: 'url(#purpleGradient)',
      glow: '#8B5CF6'
    },
    blue: {
      primary: '#3B82F6',
      gradient: 'url(#blueGradient)',
      glow: '#3B82F6'
    },
    green: {
      primary: '#10B981',
      gradient: 'url(#greenGradient)',
      glow: '#10B981'
    },
    orange: {
      primary: '#F59E0B',
      gradient: 'url(#orangeGradient)',
      glow: '#F59E0B'
    },
    red: {
      primary: '#EF4444',
      gradient: 'url(#redGradient)',
      glow: '#EF4444'
    },
    'brand-primary': {
      primary: 'var(--color-brand-primary)',
      gradient: 'url(#brandPrimaryGradient)',
      glow: 'var(--color-brand-primary)'
    },
    'brand-secondary': {
      primary: 'var(--color-brand-secondary)',
      gradient: 'url(#brandSecondaryGradient)',
      glow: 'var(--color-brand-secondary)'
    },
    'accent-success': {
      primary: 'var(--color-accent-success)',
      gradient: 'url(#accentSuccessGradient)',
      glow: 'var(--color-accent-success)'
    },
    'accent-warning': {
      primary: 'var(--color-accent-warning)',
      gradient: 'url(#accentWarningGradient)',
      glow: 'var(--color-accent-warning)'
    },
    'accent-danger': {
      primary: 'var(--color-accent-danger)',
      gradient: 'url(#accentDangerGradient)',
      glow: 'var(--color-accent-danger)'
    }
  };

  const currentColor = colorSchemes[color] || colorSchemes['brand-primary'];

  // Animate value counter
  useEffect(() => {
    if (!animated) {
      setDisplayValue(value);
      return;
    }

    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    const startValue = displayValue;
    const targetValue = Math.max(0, Math.min(max, value));

    const animateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (targetValue - startValue) * easeOut;
      
      setDisplayValue(Math.round(currentValue * 10) / 10); // Round to 1 decimal
      
      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      }
    };

    requestAnimationFrame(animateCounter);
  }, [value, max, animated, displayValue]);

  return (
    <div 
      className={`relative inline-flex items-center justify-center touch-manipulation ${className}`}
      role="progressbar"
      aria-valuenow={percentage || 0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `Progress: ${percentage || 0}%`}
    >
      <svg
        width={actualSize}
        height={actualSize}
        className="transform -rotate-90"
        style={{
          filter: `drop-shadow(0 0 8px ${currentColor.glow}30)`
        }}
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <linearGradient id="brandPrimaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-brand-primary)" />
            <stop offset="100%" stopColor="var(--color-brand-primary)" />
          </linearGradient>
          <linearGradient id="brandSecondaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-brand-secondary)" />
            <stop offset="100%" stopColor="var(--color-brand-secondary)" />
          </linearGradient>
          <linearGradient id="accentSuccessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-success)" />
            <stop offset="100%" stopColor="var(--color-accent-success)" />
          </linearGradient>
          <linearGradient id="accentWarningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-warning)" />
            <stop offset="100%" stopColor="var(--color-accent-warning)" />
          </linearGradient>
          <linearGradient id="accentDangerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-danger)" />
            <stop offset="100%" stopColor="var(--color-accent-danger)" />
          </linearGradient>
        </defs>

        {/* Background Circle */}
        <circle
          cx={actualSize / 2}
          cy={actualSize / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={actualStrokeWidth}
          fill="transparent"
          className="opacity-20"
        />

        {/* Progress Circle */}
        <motion.circle
          cx={actualSize / 2}
          cy={actualSize / 2}
          r={radius}
          stroke={currentColor.gradient}
          strokeWidth={actualStrokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: animated ? 1.5 : 0,
            ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic-bezier for smooth animation
          }}
          style={{
            filter: `drop-shadow(0 0 4px ${currentColor.glow}50)`
          }}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {showPercentage && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-baseline"
          >
            <span className="text-xl sm:text-2xl font-bold text-text-primary">
              {Math.round((displayValue / max) * 100)}
            </span>
            <span className="text-base sm:text-lg text-text-muted ml-1">%</span>
          </motion.div>
        )}
        
        {centerContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-1"
          >
            {centerContent}
          </motion.div>
        )}
        
        {label && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-2 text-xs text-text-muted font-medium max-w-[80px] leading-tight"
          >
            {label}
          </motion.div>
        )}
      </div>
    </div>
  );
};

/**
 * ModernProgressGroup - Group multiple progress circles
 */
const ModernProgressGroup: React.FC<ModernProgressGroupProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center gap-8 ${className}`}>
      {children}
    </div>
  );
};

/**
 * ModernMiniProgress - Smaller version for compact displays
 */
const ModernMiniProgress: React.FC<ModernMiniProgressProps> = ({
  value = 0,
  max = 100,
  color = 'brand-primary',
  label,
  size = 'md',
  className = ''
}) => {
  return (
    <ModernCircularProgress
      value={value}
      max={max}
      size={size}
      strokeWidth={4}
      color={color}
      label={label}
      className={className}
    />
  );
};

export default ModernCircularProgress;
export { ModernCircularProgress, ModernProgressGroup, ModernMiniProgress };
