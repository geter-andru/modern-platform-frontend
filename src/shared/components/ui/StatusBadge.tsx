import React from 'react';
import { Badge } from './Badge';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

/**
 * StatusBadge Component
 *
 * Specialized badge for confidence scores and quality indicators.
 * Based on 21st.dev social proof patterns and SnowUI status indicators.
 *
 * Usage:
 * - Persona confidence scores (90%+ = High, 70-89% = Medium, <70% = Low)
 * - Segment quality indicators (90+ = High fit, 70-89 = Medium fit, <70 = Low fit)
 * - ICP match strength
 *
 * Color Coding:
 * - High (Green): 90%+ confidence, high quality
 * - Medium (Yellow): 70-89% confidence, medium quality
 * - Low (Red): <70% confidence, low quality
 */

export interface StatusBadgeProps {
  status: 'high' | 'medium' | 'low';
  score?: number;
  label?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  score,
  label,
  showIcon = true,
  size = 'md',
  className = ''
}) => {
  // Status configuration
  const statusConfig = {
    high: {
      variant: 'success' as const,
      icon: CheckCircle2,
      defaultLabel: 'High Confidence'
    },
    medium: {
      variant: 'warning' as const,
      icon: AlertCircle,
      defaultLabel: 'Medium Confidence'
    },
    low: {
      variant: 'danger' as const,
      icon: XCircle,
      defaultLabel: 'Low Confidence'
    }
  };

  const config = statusConfig[status];
  const displayLabel = label || config.defaultLabel;
  const icon = showIcon ? config.icon : undefined;

  return (
    <Badge
      variant={config.variant}
      size={size}
      icon={icon}
      className={className}
    >
      {score !== undefined ? `${score}%` : displayLabel}
    </Badge>
  );
};

/**
 * Helper function to determine status from score
 */
export const getStatusFromScore = (score: number): 'high' | 'medium' | 'low' => {
  if (score >= 90) return 'high';
  if (score >= 70) return 'medium';
  return 'low';
};

/**
 * ConfidenceBadge - Convenient wrapper for confidence scores
 */
export const ConfidenceBadge: React.FC<{
  score: number;
  size?: 'sm' | 'md';
  className?: string;
}> = ({ score, size = 'md', className = '' }) => {
  const status = getStatusFromScore(score);
  return (
    <StatusBadge
      status={status}
      score={score}
      size={size}
      className={className}
    />
  );
};

/**
 * QualityBadge - Convenient wrapper for quality indicators
 */
export const QualityBadge: React.FC<{
  score: number;
  size?: 'sm' | 'md';
  className?: string;
}> = ({ score, size = 'md', className = '' }) => {
  const status = getStatusFromScore(score);
  const labels = {
    high: 'High Fit',
    medium: 'Medium Fit',
    low: 'Low Fit'
  };
  return (
    <StatusBadge
      status={status}
      label={labels[status]}
      size={size}
      className={className}
    />
  );
};

export default StatusBadge;
