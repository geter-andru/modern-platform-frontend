/**
 * IntelligenceSignal Component
 *
 * Displays completeness and coverage indicators for ICP analysis.
 * Shows users: "Is this analysis complete? What's missing?"
 *
 * Usage:
 * <IntelligenceSignal coverage={85} total={10} collected={8} />
 * <IntelligenceSignal coverage={100} variant="success" />
 * <IntelligenceSignal coverage={45} status="needs-review" missingItems={["buying triggers", "objections"]} />
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

export type SignalStatus = 'complete' | 'strong' | 'moderate' | 'needs-review' | 'incomplete';

export interface IntelligenceSignalProps {
  coverage: number; // 0-100 percentage
  total?: number; // Total data points possible
  collected?: number; // Data points collected
  status?: SignalStatus;
  label?: string;
  missingItems?: string[]; // What's missing
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card' | 'inline';
  showDetails?: boolean;
  className?: string;
}

const STATUS_CONFIG = {
  complete: {
    label: 'Complete',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/20',
  },
  strong: {
    label: 'Strong',
    icon: Sparkles,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-blue-500/20',
  },
  moderate: {
    label: 'Moderate',
    icon: Info,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    glowColor: 'shadow-amber-500/20',
  },
  'needs-review': {
    label: 'Needs Review',
    icon: AlertTriangle,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    glowColor: 'shadow-orange-500/20',
  },
  incomplete: {
    label: 'Incomplete',
    icon: AlertTriangle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    glowColor: 'shadow-red-500/20',
  },
};

export const IntelligenceSignal: React.FC<IntelligenceSignalProps> = ({
  coverage,
  total,
  collected,
  status: providedStatus,
  label = 'Coverage',
  missingItems = [],
  size = 'md',
  variant = 'default',
  showDetails = true,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  // Auto-calculate status from coverage if not provided
  const status: SignalStatus = providedStatus || getStatusFromCoverage(coverage);
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  const hasDetails = missingItems.length > 0 || (total !== undefined && collected !== undefined);

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1.5">
          <Icon className={`w-4 h-4 ${config.color}`} />
          <span className="text-sm text-gray-300 font-medium">{coverage}%</span>
        </div>
        {total !== undefined && collected !== undefined && (
          <span className="text-xs text-gray-500">
            ({collected}/{total})
          </span>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <motion.div
        className={`
          relative overflow-hidden
          rounded-lg border ${config.borderColor}
          ${config.bgColor}
          backdrop-blur-sm
          p-4
          ${className}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${config.color}`} />
            <span className="text-sm font-medium text-gray-300">{label}</span>
          </div>
          <span className={`text-2xl font-bold ${config.color} tabular-nums`}>
            {coverage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden mb-3">
          <motion.div
            className={`absolute inset-y-0 left-0 ${config.bgColor} opacity-50`}
            initial={{ width: 0 }}
            animate={{ width: `${coverage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <motion.div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${config.color.replace('text-', 'from-')} to-transparent`}
            initial={{ width: 0 }}
            animate={{ width: `${coverage}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
          />
        </div>

        {/* Data Points */}
        {total !== undefined && collected !== undefined && (
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Data Points</span>
            <span className="font-medium">
              {collected} of {total} collected
            </span>
          </div>
        )}

        {/* Missing Items */}
        {missingItems.length > 0 && showDetails && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 w-full flex items-center justify-between text-xs text-gray-400 hover:text-gray-300 transition-colors"
          >
            <span>View Missing Items</span>
            {isExpanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </motion.button>
        )}

        <AnimatePresence>
          {isExpanded && missingItems.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 space-y-1 overflow-hidden"
            >
              {missingItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-xs text-gray-500 pl-1"
                >
                  <div className="w-1 h-1 rounded-full bg-gray-600" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Default variant
  return (
    <div
      className={`
        inline-flex items-center gap-3
        px-3 py-2 rounded-lg
        border ${config.borderColor}
        ${config.bgColor}
        backdrop-blur-sm
        transition-all duration-300
        ${isHovered ? `${config.glowColor} shadow-lg` : 'shadow-sm'}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon + Label */}
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${config.color}`} />
        <span className="text-sm text-gray-300 font-medium">{label}</span>
      </div>

      {/* Score */}
      <span className={`text-lg font-bold ${config.color} tabular-nums`}>
        {coverage}%
      </span>

      {/* Data Points */}
      {total !== undefined && collected !== undefined && (
        <span className="text-xs text-gray-500">
          ({collected}/{total})
        </span>
      )}
    </div>
  );
};

/**
 * CoverageRing Component - Circular progress indicator
 */
export interface CoverageRingProps {
  coverage: number; // 0-100
  size?: number; // diameter in pixels
  strokeWidth?: number;
  showPercentage?: boolean;
  className?: string;
}

export const CoverageRing: React.FC<CoverageRingProps> = ({
  coverage,
  size = 80,
  strokeWidth = 6,
  showPercentage = true,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (coverage / 100) * circumference;

  const status = getStatusFromCoverage(coverage);
  const config = STATUS_CONFIG[status];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-white/5"
        />

        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={config.color}
          style={{
            strokeDasharray: circumference,
          }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>

      {/* Percentage Text */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${config.color} tabular-nums`}>
            {coverage}%
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * DataPointsIndicator - Shows collected/total data points with checkmarks
 */
export interface DataPointsIndicatorProps {
  collected: number;
  total: number;
  size?: 'sm' | 'md';
  className?: string;
}

export const DataPointsIndicator: React.FC<DataPointsIndicatorProps> = ({
  collected,
  total,
  size = 'md',
  className = '',
}) => {
  const coverage = (collected / total) * 100;
  const status = getStatusFromCoverage(coverage);
  const config = STATUS_CONFIG[status];

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <CheckCircle2 className={`${iconSize} ${config.color}`} />
      <span className={`${textSize} text-gray-300 font-medium tabular-nums`}>
        {collected}/{total}
      </span>
      <span className={`${textSize} text-gray-500`}>data points</span>
    </div>
  );
};

/**
 * Helper function to determine status from coverage percentage
 */
export function getStatusFromCoverage(coverage: number): SignalStatus {
  if (coverage === 100) return 'complete';
  if (coverage >= 85) return 'strong';
  if (coverage >= 70) return 'moderate';
  if (coverage >= 50) return 'needs-review';
  return 'incomplete';
}

export default IntelligenceSignal;
