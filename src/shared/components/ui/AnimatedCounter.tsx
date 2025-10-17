'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * AnimatedCounter - Professional animated number counter component
 * 
 * Features:
 * - Smooth number transitions with easing
 * - Support for different number formats (currency, percentage, etc.)
 * - Customizable duration and easing
 * - Accessibility compliant
 * - Performance optimized with useSpring
 */

export interface AnimatedCounterProps {
  value: number;
  duration?: number;
  easing?: 'linear' | 'easeOut' | 'easeInOut' | 'easeOutExpo';
  format?: 'number' | 'currency' | 'percentage' | 'decimal';
  prefix?: string;
  suffix?: string;
  className?: string;
  'aria-label'?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  easing = 'easeOutExpo',
  format = 'number',
  prefix = '',
  suffix = '',
  className = '',
  'aria-label': ariaLabel
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Spring animation for smooth transitions
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    duration: duration / 1000
  });

  // Transform spring value to display value
  const animatedValue = useTransform(springValue, (latest) => {
    return Math.round(latest);
  });

  // Update spring value when prop changes
  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  // Update display value
  useEffect(() => {
    const unsubscribe = animatedValue.onChange((latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [animatedValue]);

  // Format the display value
  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      case 'percentage':
        return `${val}%`;
      case 'decimal':
        return val.toFixed(1);
      default:
        return val.toLocaleString();
    }
  };

  const formattedValue = formatValue(displayValue);

  return (
    <motion.span
      className={className}
      aria-label={ariaLabel || `Value: ${formattedValue}`}
      role="text"
      aria-live="polite"
    >
      {prefix}{formattedValue}{suffix}
    </motion.span>
  );
};

/**
 * AnimatedMetric - Specialized animated counter for metric cards
 */
export interface AnimatedMetricProps {
  value: number;
  previousValue?: number;
  duration?: number;
  format?: 'number' | 'currency' | 'percentage' | 'decimal';
  prefix?: string;
  suffix?: string;
  className?: string;
  showChange?: boolean;
}

export const AnimatedMetric: React.FC<AnimatedMetricProps> = ({
  value,
  previousValue,
  duration = 800,
  format = 'number',
  prefix = '',
  suffix = '',
  className = '',
  showChange = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (previousValue !== undefined && previousValue !== value) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), duration);
      return () => clearTimeout(timer);
    }
  }, [value, previousValue, duration]);

  return (
    <motion.div
      className={`relative ${className}`}
      animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <AnimatedCounter
        value={value}
        duration={duration}
        easing="easeOutExpo"
        format={format}
        prefix={prefix}
        suffix={suffix}
        className="text-2xl font-bold text-text-primary"
      />
      
      {showChange && previousValue !== undefined && previousValue !== value && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute -top-6 right-0 text-xs text-brand-secondary"
        >
          {value > previousValue ? '↗' : '↘'}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnimatedCounter;
