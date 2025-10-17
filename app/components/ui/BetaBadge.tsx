/**
 * Beta Badge Component
 *
 * Displays a badge for features that are in beta or incomplete.
 * Helps set user expectations for features still under development.
 *
 * INTEGRATION: Part of Production Readiness Plan Phase 1
 * See: /PRODUCTION_READINESS_PLAN_2025-10-12.md
 */

'use client';

import React, { useState } from 'react';
import { AlertCircle, Info, X } from 'lucide-react';

export type BetaBadgeVariant = 'beta' | 'coming-soon' | 'experimental' | 'alpha';
export type BetaBadgeSize = 'sm' | 'md' | 'lg';

export interface BetaBadgeProps {
  /**
   * Feature name to display in tooltip
   */
  feature?: string;

  /**
   * Custom tooltip message
   * If not provided, uses default message based on variant
   */
  tooltip?: string;

  /**
   * Badge variant
   * @default 'beta'
   */
  variant?: BetaBadgeVariant;

  /**
   * Badge size
   * @default 'md'
   */
  size?: BetaBadgeSize;

  /**
   * Show tooltip on hover
   * @default true
   */
  showTooltip?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Callback when badge is clicked
   */
  onClick?: () => void;
}

const variantStyles: Record<BetaBadgeVariant, {
  bg: string;
  text: string;
  border: string;
  icon: typeof AlertCircle;
  label: string;
}> = {
  beta: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
    icon: AlertCircle,
    label: 'BETA'
  },
  'coming-soon': {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    icon: Info,
    label: 'COMING SOON'
  },
  experimental: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    icon: AlertCircle,
    label: 'EXPERIMENTAL'
  },
  alpha: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
    icon: AlertCircle,
    label: 'ALPHA'
  }
};

const sizeStyles: Record<BetaBadgeSize, {
  padding: string;
  text: string;
  iconSize: string;
}> = {
  sm: {
    padding: 'px-1.5 py-0.5',
    text: 'text-[10px]',
    iconSize: 'w-2.5 h-2.5'
  },
  md: {
    padding: 'px-2 py-1',
    text: 'text-xs',
    iconSize: 'w-3 h-3'
  },
  lg: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    iconSize: 'w-4 h-4'
  }
};

const defaultTooltips: Record<BetaBadgeVariant, (feature?: string) => string> = {
  beta: (feature) => feature
    ? `${feature} is in beta - some features may not work as expected`
    : 'This feature is in beta testing',
  'coming-soon': (feature) => feature
    ? `${feature} is coming soon - currently under development`
    : 'This feature is coming soon',
  experimental: (feature) => feature
    ? `${feature} is experimental - use with caution`
    : 'This is an experimental feature',
  alpha: (feature) => feature
    ? `${feature} is in early alpha - expect bugs and changes`
    : 'This feature is in early alpha'
};

/**
 * Beta Badge Component
 *
 * @example
 * // Basic usage
 * <BetaBadge feature="ICP History" />
 *
 * @example
 * // Coming soon variant
 * <BetaBadge variant="coming-soon" feature="Weekly Target Accounts" />
 *
 * @example
 * // Custom tooltip
 * <BetaBadge
 *   feature="Export Downloads"
 *   tooltip="Export functionality is currently being improved"
 * />
 *
 * @example
 * // Inline with heading
 * <h2 className="flex items-center gap-2">
 *   Weekly Target Accounts
 *   <BetaBadge variant="coming-soon" feature="Target Accounts" />
 * </h2>
 */
export const BetaBadge: React.FC<BetaBadgeProps> = ({
  feature,
  tooltip,
  variant = 'beta',
  size = 'md',
  showTooltip = true,
  className = '',
  onClick
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const Icon = variantStyle.icon;

  const tooltipText = tooltip || defaultTooltips[variant](feature);

  return (
    <div className="relative inline-flex">
      <span
        className={`
          inline-flex items-center gap-1 font-semibold tracking-wide
          ${sizeStyle.padding} ${sizeStyle.text}
          ${variantStyle.bg} ${variantStyle.text} ${variantStyle.border}
          border rounded
          ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
          ${className}
        `}
        onMouseEnter={() => showTooltip && setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onClick={onClick}
      >
        <Icon className={sizeStyle.iconSize} />
        {variantStyle.label}
      </span>

      {/* Tooltip */}
      {showTooltip && isTooltipVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-gray-700 whitespace-nowrap max-w-xs">
            {tooltipText}

            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-8 border-transparent border-t-gray-900" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Beta Section Wrapper
 *
 * Wraps a section with a beta indicator in the corner
 *
 * @example
 * <BetaSection feature="Export History" variant="beta">
 *   <div>Your content here</div>
 * </BetaSection>
 */
export const BetaSection: React.FC<{
  children: React.ReactNode;
  feature?: string;
  tooltip?: string;
  variant?: BetaBadgeVariant;
  className?: string;
}> = ({ children, feature, tooltip, variant = 'beta', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-2 right-2 z-10">
        <BetaBadge feature={feature} tooltip={tooltip} variant={variant} size="sm" />
      </div>
      {children}
    </div>
  );
};

/**
 * Beta Banner
 *
 * Full-width banner for beta features
 *
 * @example
 * <BetaBanner
 *   feature="Weekly Target Accounts"
 *   message="This feature is in beta. Real AI-powered prospecting coming in Q1 2026."
 *   variant="coming-soon"
 * />
 */
export const BetaBanner: React.FC<{
  feature: string;
  message: string;
  variant?: BetaBadgeVariant;
  onDismiss?: () => void;
  className?: string;
}> = ({ feature, message, variant = 'beta', onDismiss, className = '' }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const variantStyle = variantStyles[variant];
  const Icon = variantStyle.icon;

  if (isDismissed) return null;

  return (
    <div className={`${variantStyle.bg} ${variantStyle.border} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`${variantStyle.text} w-5 h-5 flex-shrink-0 mt-0.5`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-semibold ${variantStyle.text}`}>
              {feature}
            </span>
            <BetaBadge variant={variant} size="sm" showTooltip={false} />
          </div>

          <p className="text-sm text-gray-300">
            {message}
          </p>
        </div>

        {onDismiss && (
          <button
            onClick={() => {
              setIsDismissed(true);
              onDismiss();
            }}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BetaBadge;
