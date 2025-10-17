'use client';

/**
 * ActiveToolDisplay - Current active tool indicator widget
 *
 * Features:
 * - Tool name and description display
 * - Access status indicator (locked/unlocked)
 * - Completion count tracking
 * - Professional tier badge
 * - Color-coded by tool category
 * - Gamification feedback display (points, achievements)
 * - Lock screen with unlock requirements
 * - Responsive design
 *
 * Note: This is a pure presentation component.
 * State management and data fetching should be handled by parent components.
 */

import React from 'react';
import { Lock, CheckCircle, TrendingUp, Award, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================

export interface ToolInfo {
  /** Tool name/title */
  name: string;
  /** Tool description */
  description: string;
  /** Icon emoji or component */
  icon: string;
  /** Color theme (blue, green, purple, amber, yellow) */
  color: 'blue' | 'green' | 'purple' | 'amber' | 'yellow';
  /** Professional tier level */
  level: string;
}

export interface ToolAccessStatus {
  /** Whether user has access to this tool */
  access: boolean;
  /** Number of times tool has been completed */
  completions: number;
  /** Progress toward unlocking (if locked) */
  unlock_progress?: Record<string, string | number>;
}

export interface GamificationFeedback {
  /** Points awarded for completion */
  pointsAwarded: number;
  /** Whether competency level advanced */
  competencyAdvanced: boolean;
  /** Whether milestone was achieved */
  milestoneAchieved: boolean;
  /** Whether new tool was unlocked */
  toolUnlocked: boolean;
}

export interface ActiveToolDisplayProps {
  /** Tool information */
  toolInfo: ToolInfo;
  /** Access status for this tool */
  accessStatus: ToolAccessStatus;
  /** Gamification feedback (optional) */
  gamificationFeedback?: GamificationFeedback | null;
  /** Callback to change tools */
  onToolChange?: (toolName: string) => void;
  /** Callback to dismiss gamification feedback */
  onDismissFeedback?: () => void;
  /** Loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Child component (tool content) */
  children?: React.ReactNode;
}

// ==================== COLOR CONFIGURATION ====================

/**
 * Color class mappings for different tool themes
 */
const COLOR_CLASSES = {
  blue: {
    gradient: 'from-blue-900/30 via-blue-800/20 to-blue-900/30',
    iconBg: 'from-blue-600/20 to-blue-500/20',
    iconBorder: 'border-blue-500/30'
  },
  green: {
    gradient: 'from-green-900/30 via-green-800/20 to-green-900/30',
    iconBg: 'from-green-600/20 to-green-500/20',
    iconBorder: 'border-green-500/30'
  },
  purple: {
    gradient: 'from-purple-900/30 via-purple-800/20 to-purple-900/30',
    iconBg: 'from-purple-600/20 to-purple-500/20',
    iconBorder: 'border-purple-500/30'
  },
  amber: {
    gradient: 'from-amber-900/30 via-amber-800/20 to-amber-900/30',
    iconBg: 'from-amber-600/20 to-amber-500/20',
    iconBorder: 'border-amber-500/30'
  },
  yellow: {
    gradient: 'from-yellow-900/30 via-yellow-800/20 to-yellow-900/30',
    iconBg: 'from-yellow-600/20 to-yellow-500/20',
    iconBorder: 'border-yellow-500/30'
  }
};

// ==================== MAIN COMPONENT ====================

export const ActiveToolDisplay: React.FC<ActiveToolDisplayProps> = ({
  toolInfo,
  accessStatus,
  gamificationFeedback,
  onToolChange,
  onDismissFeedback,
  loading = false,
  className = '',
  children
}) => {
  const isLocked = !accessStatus.access;
  const colorClasses = COLOR_CLASSES[toolInfo.color] || COLOR_CLASSES.blue;

  // Loading State
  if (loading) {
    return (
      <div className={`bg-gray-900 border border-gray-700 rounded-lg p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3" />
          <div className="h-32 bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Professional Tool Header */}
      <div
        className={`bg-gradient-to-r ${colorClasses.gradient} border-b border-gray-700 p-8`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Tool Icon */}
            <div
              className={`p-4 bg-gradient-to-br ${colorClasses.iconBg} rounded-2xl border ${colorClasses.iconBorder} backdrop-blur-sm shadow-lg`}
            >
              <span className="text-4xl">{toolInfo.icon}</span>
            </div>

            {/* Tool Info */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                {toolInfo.name}
              </h2>
              <p className="text-gray-200 text-base leading-relaxed mb-4">
                {toolInfo.description}
              </p>
              <div className="flex items-center space-x-6">
                <span className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full text-sm font-semibold text-purple-300">
                  {toolInfo.level} Tier
                </span>
                <span className="text-sm text-gray-300 font-medium">
                  Deployments: {accessStatus.completions || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Access Status Indicator */}
          <div className="flex items-center space-x-4">
            {isLocked ? (
              <div className="flex items-center space-x-3 text-gray-400">
                <div className="p-2 bg-gray-700/50 rounded-lg">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="text-base font-medium">Access Restricted</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-green-400">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <span className="text-base font-semibold">Executive Access</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gamification Feedback Banner */}
      {gamificationFeedback && (
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/60 border-b border-gray-700/50 p-6">
          <div className="flex items-center space-x-6">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-3">
                Strategic Development Recognition
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {gamificationFeedback.pointsAwarded > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="p-1 bg-blue-500/20 rounded">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-200">
                      +{gamificationFeedback.pointsAwarded} excellence points
                    </span>
                  </div>
                )}
                {gamificationFeedback.competencyAdvanced && (
                  <div className="flex items-center space-x-2">
                    <div className="p-1 bg-green-500/20 rounded">
                      <Target className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-200">
                      Competency Advancement
                    </span>
                  </div>
                )}
                {gamificationFeedback.milestoneAchieved && (
                  <div className="flex items-center space-x-2">
                    <div className="p-1 bg-yellow-500/20 rounded">
                      <Award className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-200">Strategic Milestone</span>
                  </div>
                )}
                {gamificationFeedback.toolUnlocked && (
                  <div className="flex items-center space-x-2">
                    <div className="p-1 bg-purple-500/20 rounded">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-200">Access Granted</span>
                  </div>
                )}
              </div>
            </div>
            {onDismissFeedback && (
              <button
                onClick={onDismissFeedback}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                aria-label="Dismiss feedback"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Lock Screen */}
      {isLocked ? (
        <div className="p-12 text-center">
          <div className="mb-8">
            <div className="p-6 bg-gray-700/30 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Lock className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-200 mb-4">
              Executive Methodology Access Required
            </h3>
            <p className="text-gray-300 max-w-lg mx-auto leading-relaxed">
              Demonstrate strategic competency in foundational methodologies to unlock this
              advanced executive framework.
            </p>
          </div>

          {/* Unlock Progress Dashboard */}
          {accessStatus.unlock_progress && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-lg mx-auto mb-8">
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-200 mb-4">
                  Competency Requirements
                </h4>
                <div className="space-y-4">
                  {Object.entries(accessStatus.unlock_progress).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg"
                    >
                      <span className="text-gray-300 font-medium capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full text-sm font-bold text-purple-300">
                        {typeof value === 'number' ? value : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Call to Action */}
          {onToolChange && (
            <button
              onClick={() => onToolChange('icp')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 hover:scale-105"
            >
              Begin Strategic Foundation
            </button>
          )}
        </div>
      ) : (
        /* Tool Content */
        <div className="p-8">{children}</div>
      )}
    </div>
  );
};

export default ActiveToolDisplay;
