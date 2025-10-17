'use client';

/**
 * SummaryMetric - Professional metric display component
 *
 * Features:
 * - Trend indicators with icons (up/down/neutral)
 * - Change calculation (percentage and raw)
 * - Multiple format options (number, percentage, currency, decimal)
 * - Size variants (small, default, large)
 * - Prefix/suffix support
 * - Hover effects for professional presentation
 * - Baseline tracking support
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================

export type MetricFormat = 'number' | 'percentage' | 'currency' | 'decimal' | 'large_number';
export type MetricSize = 'small' | 'default' | 'large';
export type TrendDirection = 'up' | 'down' | 'neutral';

export interface ChangeMetrics {
  raw: number;
  percent: number;
  isPositive: boolean;
  isNegative: boolean;
  isNeutral: boolean;
}

export interface TrendStyling {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  direction: TrendDirection;
}

export interface SummaryMetricProps {
  /** Metric label */
  label: string;
  /** Current value */
  value: number;
  /** Previous value for comparison (optional) */
  previousValue?: number;
  /** Value format type */
  format?: MetricFormat;
  /** Suffix to append (e.g., " pts", "h") */
  suffix?: string;
  /** Prefix to prepend (e.g., "$", "+") */
  prefix?: string;
  /** Size variant */
  size?: MetricSize;
  /** Show trend icon */
  showTrend?: boolean;
  /** Show change values */
  showChange?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ==================== SIZE CONFIGURATIONS ====================

const SIZE_CLASSES: Record<MetricSize, {
  value: string;
  label: string;
  change: string;
  icon: number;
}> = {
  small: {
    value: 'text-lg font-semibold',
    label: 'text-xs',
    change: 'text-xs',
    icon: 12
  },
  default: {
    value: 'text-2xl font-bold',
    label: 'text-sm',
    change: 'text-sm',
    icon: 16
  },
  large: {
    value: 'text-3xl font-bold',
    label: 'text-base',
    change: 'text-base',
    icon: 20
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Calculate change metrics between current and previous value
 */
function calculateChange(value: number, previousValue: number | undefined): ChangeMetrics | null {
  if (previousValue === undefined || previousValue === 0) return null;

  const rawChange = value - previousValue;
  const percentChange = (rawChange / previousValue) * 100;

  return {
    raw: rawChange,
    percent: percentChange,
    isPositive: rawChange > 0,
    isNegative: rawChange < 0,
    isNeutral: rawChange === 0
  };
}

/**
 * Format value based on format type
 */
function formatValue(val: number, format: MetricFormat): string {
  switch (format) {
    case 'percentage':
      return `${val}%`;
    case 'currency':
      return `$${val.toLocaleString()}`;
    case 'decimal':
      return val.toFixed(1);
    case 'large_number':
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
      return val.toString();
    default:
      return val.toLocaleString();
  }
}

/**
 * Get trend styling based on change metrics
 */
function getTrendStyling(change: ChangeMetrics | null): TrendStyling {
  if (!change) {
    return {
      icon: Minus,
      color: 'text-gray-400',
      bgColor: 'bg-gray-700/30',
      direction: 'neutral'
    };
  }

  if (change.isPositive) {
    return {
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-900/30',
      direction: 'up'
    };
  } else if (change.isNegative) {
    return {
      icon: TrendingDown,
      color: 'text-red-400',
      bgColor: 'bg-red-900/30',
      direction: 'down'
    };
  } else {
    return {
      icon: Minus,
      color: 'text-gray-400',
      bgColor: 'bg-gray-700/30',
      direction: 'neutral'
    };
  }
}

// ==================== MAIN COMPONENT ====================

export const SummaryMetric: React.FC<SummaryMetricProps> = ({
  label,
  value,
  previousValue,
  format = 'number',
  suffix = '',
  prefix = '',
  size = 'default',
  showTrend = true,
  showChange = true,
  className = ''
}) => {
  // Calculate metrics
  const change = calculateChange(value, previousValue);
  const trendStyling = getTrendStyling(change);
  const sizes = SIZE_CLASSES[size];
  const TrendIcon = trendStyling.icon;

  return (
    <div className={`group ${className}`}>
      {/* Main Metric Display */}
      <div className="space-y-2">
        {/* Value with Prefix/Suffix */}
        <div className={`
          ${sizes.value}
          text-white
          font-mono
          tracking-tight
          group-hover:text-blue-100
          transition-colors
        `}>
          {prefix}{formatValue(value, format)}{suffix}
        </div>

        {/* Label */}
        <div className={`
          ${sizes.label}
          text-gray-400
          uppercase
          tracking-wide
          font-medium
        `}>
          {label}
        </div>

        {/* Change Indicators */}
        {(showChange || showTrend) && change && (
          <div className="flex items-center space-x-2">
            {/* Trend Icon */}
            {showTrend && (
              <div className={`
                flex items-center justify-center
                w-6 h-6 rounded-full
                ${trendStyling.bgColor}
              `}>
                <TrendIcon
                  size={sizes.icon}
                  className={trendStyling.color}
                />
              </div>
            )}

            {/* Change Values */}
            {showChange && (
              <div className="flex items-center space-x-2">
                {/* Percentage Change */}
                <span className={`
                  ${sizes.change}
                  font-medium
                  ${trendStyling.color}
                `}>
                  {change.isPositive ? '+' : ''}
                  {change.percent.toFixed(1)}%
                </span>

                {/* Raw Change */}
                <span className={`${sizes.change} text-gray-500`}>
                  ({change.isPositive ? '+' : ''}
                  {formatValue(change.raw, format)})
                </span>
              </div>
            )}
          </div>
        )}

        {/* Additional Context for No Previous Value */}
        {!change && previousValue === 0 && (
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center">
              <ChevronUp size={12} className="text-blue-400" />
            </div>
            <span className={`${sizes.change} text-blue-400 font-medium`}>
              New baseline
            </span>
          </div>
        )}
      </div>

      {/* Professional Hover Enhancement */}
      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
        <div className="mt-2 text-xs text-gray-500 text-center">
          {change ? 'vs. previous period' : 'baseline metric'}
        </div>
      </div>
    </div>
  );
};

export default SummaryMetric;
