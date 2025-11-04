/**
 * ConfidenceBadge Component
 *
 * Visual indicator for AI confidence levels in ICP analysis.
 * Design philosophy: Trustworthy, clear, professional - not alarming.
 *
 * Usage:
 * <ConfidenceBadge level="high" score={97} />
 * <ConfidenceBadge level="medium" score={85} showTooltip />
 * <ConfidenceBadge level="low" score={72} context="Based on 3 data signals" />
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  score?: number; // 0-100 percentage
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  showTooltip?: boolean;
  context?: string; // Tooltip context
  variant?: 'default' | 'subtle' | 'prominent';
  className?: string;
}

const CONFIDENCE_CONFIG = {
  high: {
    label: 'High Confidence',
    shortLabel: 'High',
    icon: CheckCircle2,
    bgGradient: 'from-emerald-500/20 to-emerald-600/20',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-400',
    iconColor: 'text-emerald-400',
    glowColor: 'shadow-emerald-500/20',
    tooltip: 'Based on strong data signals from multiple sources',
  },
  medium: {
    label: 'Medium Confidence',
    shortLabel: 'Medium',
    icon: AlertCircle,
    bgGradient: 'from-amber-500/20 to-amber-600/20',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-400',
    iconColor: 'text-amber-400',
    glowColor: 'shadow-amber-500/20',
    tooltip: 'Based on moderate data signals - verify key details',
  },
  low: {
    label: 'Needs Review',
    shortLabel: 'Review',
    icon: Info,
    bgGradient: 'from-orange-500/20 to-orange-600/20',
    borderColor: 'border-orange-500/40',
    textColor: 'text-orange-400',
    iconColor: 'text-orange-400',
    glowColor: 'shadow-orange-500/20',
    tooltip: 'Limited data available - manual verification recommended',
  },
};

const SIZE_CONFIG = {
  sm: {
    container: 'h-6 px-2 gap-1',
    icon: 'w-3 h-3',
    text: 'text-xs',
    score: 'text-[10px]',
  },
  md: {
    container: 'h-7 px-2.5 gap-1.5',
    icon: 'w-3.5 h-3.5',
    text: 'text-xs',
    score: 'text-xs',
  },
  lg: {
    container: 'h-8 px-3 gap-2',
    icon: 'w-4 h-4',
    text: 'text-sm',
    score: 'text-sm',
  },
};

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  level,
  score,
  size = 'md',
  showScore = false,
  showTooltip = true,
  context,
  variant = 'default',
  className = '',
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const config = CONFIDENCE_CONFIG[level];
  const sizeConfig = SIZE_CONFIG[size];
  const Icon = config.icon;

  const tooltipText = context || config.tooltip;

  const getOpacity = () => {
    if (variant === 'subtle') return 'opacity-70';
    if (variant === 'prominent') return 'opacity-100';
    return 'opacity-90';
  };

  return (
    <div className="relative inline-flex">
      <motion.div
        className={`
          inline-flex items-center ${sizeConfig.container}
          bg-gradient-to-r ${config.bgGradient}
          border ${config.borderColor}
          rounded-full
          backdrop-blur-sm
          transition-all duration-300
          ${getOpacity()}
          ${isHovered ? `${config.glowColor} shadow-lg scale-105` : 'shadow-sm'}
          ${className}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Icon */}
        <Icon className={`${sizeConfig.icon} ${config.iconColor} flex-shrink-0`} />

        {/* Label */}
        <span className={`${sizeConfig.text} ${config.textColor} font-medium whitespace-nowrap`}>
          {size === 'sm' ? config.shortLabel : config.shortLabel}
        </span>

        {/* Score */}
        {showScore && score !== undefined && (
          <span className={`${sizeConfig.score} ${config.textColor} font-semibold opacity-90`}>
            {score}%
          </span>
        )}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
          >
            <div
              className="
                px-3 py-2 rounded-lg
                bg-gray-900/95 backdrop-blur-md
                border border-white/10
                shadow-xl shadow-black/50
                max-w-xs
              "
            >
              <p className="text-xs text-gray-200 leading-relaxed">
                {tooltipText}
                {score !== undefined && (
                  <span className="block mt-1 text-[11px] text-gray-400">
                    Confidence Score: {score}%
                  </span>
                )}
              </p>

              {/* Tooltip Arrow */}
              <div
                className="
                  absolute top-full left-1/2 -translate-x-1/2 -mt-px
                  w-2 h-2 rotate-45
                  bg-gray-900 border-r border-b border-white/10
                "
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Helper function to calculate confidence level from score
 */
export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 95) return 'high';
  if (score >= 80) return 'medium';
  return 'low';
}

/**
 * ConfidenceScore Component - Display just the score with minimal styling
 */
export interface ConfidenceScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ConfidenceScore: React.FC<ConfidenceScoreProps> = ({
  score,
  size = 'md',
  className = '',
}) => {
  const level = getConfidenceLevel(score);
  const config = CONFIDENCE_CONFIG[level];

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <span className={`${sizeClasses[size]} ${config.textColor} font-semibold tabular-nums ${className}`}>
      {score}%
    </span>
  );
};

export default ConfidenceBadge;
