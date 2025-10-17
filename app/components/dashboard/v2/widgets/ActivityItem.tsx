'use client';

/**
 * ActivityItem - Individual activity display component
 *
 * Features:
 * - Activity type indicators with professional styling
 * - Competency category badges
 * - Impact level visualization (critical, high, medium, low)
 * - Points earned display
 * - Timestamp and metadata
 * - Hover effects for interactivity
 * - Icon support with fallbacks
 */

import React from 'react';
import { Trophy, TrendingUp, BarChart3, Target, Clock, Award } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================

export type ActivityType =
  | 'ICP_ANALYSIS'
  | 'COST_MODEL'
  | 'REAL_ACTION'
  | 'BUSINESS_CASE'
  | 'COMPETENCY_IMPROVEMENT';

export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

export type CompetencyCategory =
  | 'Customer Analysis'
  | 'Value Communication'
  | 'Sales Execution'
  | 'Professional Development';

export interface ActivityTypeConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: LucideIcon;
}

export interface CompetencyCategoryConfig {
  badge: string;
  color: string;
  textColor: string;
}

export interface ImpactIndicator {
  color: string;
  size: string;
  label: string;
}

export interface ActivityItemProps {
  /** Activity type identifier */
  type: ActivityType;
  /** Activity description text */
  description: string;
  /** Timestamp display (e.g., "2 hours ago") */
  timestamp: string;
  /** Points earned from this activity */
  pointsEarned: number;
  /** Competency category this activity belongs to */
  competencyCategory: CompetencyCategory;
  /** Impact level of the activity */
  impactLevel?: ImpactLevel;
  /** Custom icon override (optional) */
  icon?: LucideIcon;
  /** Additional CSS classes */
  className?: string;
}

// ==================== ACTIVITY TYPE CONFIGURATIONS ====================

const ACTIVITY_TYPES: Record<ActivityType, ActivityTypeConfig> = {
  ICP_ANALYSIS: {
    label: 'ICP Analysis',
    color: 'blue',
    bgColor: 'bg-blue-900/30',
    borderColor: 'border-blue-500/40',
    textColor: 'text-blue-300',
    icon: Target
  },
  COST_MODEL: {
    label: 'Cost Modeling',
    color: 'green',
    bgColor: 'bg-green-900/30',
    borderColor: 'border-green-500/40',
    textColor: 'text-green-300',
    icon: TrendingUp
  },
  REAL_ACTION: {
    label: 'Professional Action',
    color: 'purple',
    bgColor: 'bg-purple-900/30',
    borderColor: 'border-purple-500/40',
    textColor: 'text-purple-300',
    icon: Trophy
  },
  BUSINESS_CASE: {
    label: 'Business Case',
    color: 'amber',
    bgColor: 'bg-amber-900/30',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-300',
    icon: BarChart3
  },
  COMPETENCY_IMPROVEMENT: {
    label: 'Competency Development',
    color: 'gray',
    bgColor: 'bg-gray-800/30',
    borderColor: 'border-gray-500/40',
    textColor: 'text-gray-300',
    icon: Award
  }
};

// ==================== COMPETENCY CATEGORY CONFIGURATIONS ====================

const COMPETENCY_CATEGORIES: Record<CompetencyCategory, CompetencyCategoryConfig> = {
  'Customer Analysis': {
    badge: 'Customer Intelligence',
    color: 'bg-blue-600',
    textColor: 'text-blue-100'
  },
  'Value Communication': {
    badge: 'Value Intelligence',
    color: 'bg-green-600',
    textColor: 'text-green-100'
  },
  'Sales Execution': {
    badge: 'Revenue Intelligence',
    color: 'bg-purple-600',
    textColor: 'text-purple-100'
  },
  'Professional Development': {
    badge: 'Development',
    color: 'bg-gray-600',
    textColor: 'text-gray-100'
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get impact level indicator styling and labels
 */
function getImpactIndicator(level: ImpactLevel): ImpactIndicator {
  switch (level) {
    case 'critical':
      return {
        color: 'text-red-400',
        size: '●●●●',
        label: 'Critical Impact'
      };
    case 'high':
      return {
        color: 'text-orange-400',
        size: '●●●○',
        label: 'High Impact'
      };
    case 'medium':
      return {
        color: 'text-blue-400',
        size: '●●○○',
        label: 'Standard Impact'
      };
    case 'low':
      return {
        color: 'text-gray-400',
        size: '●○○○',
        label: 'Low Impact'
      };
  }
}

// ==================== MAIN COMPONENT ====================

export const ActivityItem: React.FC<ActivityItemProps> = ({
  type,
  description,
  timestamp,
  pointsEarned,
  competencyCategory,
  impactLevel = 'medium',
  icon: CustomIcon,
  className = ''
}) => {
  // Get activity type configuration
  const activityType = ACTIVITY_TYPES[type] || ACTIVITY_TYPES.COMPETENCY_IMPROVEMENT;
  const IconComponent = CustomIcon || activityType.icon;

  // Get competency category configuration
  const categoryConfig =
    COMPETENCY_CATEGORIES[competencyCategory] ||
    COMPETENCY_CATEGORIES['Professional Development'];

  // Get impact indicator
  const impactIndicator = getImpactIndicator(impactLevel);

  return (
    <div
      className={`
        group
        relative
        hover:bg-gray-800/50
        transition-all duration-200
        rounded-lg p-4
        border border-gray-700/50
        hover:border-gray-600/50
        ${className}
      `}
    >
      <div className="flex items-start space-x-4">
        {/* Professional Activity Icon */}
        <div
          className={`
            flex-shrink-0 w-10 h-10 rounded-lg
            ${activityType.bgColor}
            ${activityType.borderColor}
            border
            flex items-center justify-center
          `}
        >
          <IconComponent className={`w-5 h-5 ${activityType.textColor}`} />
        </div>

        {/* Activity Content */}
        <div className="flex-1 min-w-0">
          {/* Activity Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                {/* Activity Type Badge */}
                <span
                  className={`
                    inline-flex items-center
                    px-2 py-1 rounded-full
                    text-xs font-medium
                    ${activityType.bgColor}
                    ${activityType.textColor}
                    border ${activityType.borderColor}
                  `}
                >
                  {activityType.label}
                </span>

                {/* Competency Category Badge */}
                <span
                  className={`
                    inline-flex items-center
                    px-2 py-1 rounded-full
                    text-xs font-medium
                    ${categoryConfig.color}
                    ${categoryConfig.textColor}
                  `}
                >
                  {categoryConfig.badge}
                </span>
              </div>

              {/* Activity Description */}
              <p className="text-sm text-white font-medium leading-snug group-hover:text-blue-100 transition-colors">
                {description}
              </p>
            </div>

            {/* Points Earned - Professional Presentation */}
            <div className="flex-shrink-0 text-right ml-3">
              <div className="text-lg font-semibold text-green-400">
                +{pointsEarned}
              </div>
              <div className="text-xs text-gray-400">points</div>
            </div>
          </div>

          {/* Activity Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              {/* Timestamp */}
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{timestamp}</span>
              </div>

              {/* Impact Level Indicator */}
              <div className="flex items-center space-x-1">
                <span className={`${impactIndicator.color} font-mono text-sm`}>
                  {impactIndicator.size}
                </span>
                <span className="text-gray-500">{impactIndicator.label}</span>
              </div>
            </div>

            {/* Professional Growth Indicator */}
            <div className="flex items-center space-x-1 text-gray-500">
              <TrendingUp className="w-3 h-3" />
              <span>Development</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Professional Hover Effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </div>
  );
};

export default ActivityItem;
