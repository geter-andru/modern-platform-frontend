'use client';

/**
 * NextUnlockProgress - Unlock progress tracking widget
 *
 * Features:
 * - Animated progress bar with smooth transitions
 * - Three states: locked, near unlock (80%+), unlocked
 * - Dynamic status messages and icons
 * - Points needed display
 * - Progress percentage calculation
 * - Animated shine effect on progress bar
 * - Unlock threshold visual marker
 * - Benefits preview section with state-based styling
 * - Call to action for near unlock (drives engagement)
 * - Success state recognition
 * - Professional stealth gamification psychology
 */

import React, { useState, useEffect } from 'react';
import { Lock, Unlock, TrendingUp, Zap, type LucideIcon } from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================

export interface NextUnlock {
  /** Name of the capability being unlocked */
  name?: string;
  /** Description of unlock benefits */
  benefits?: string;
  /** Additional properties */
  [key: string]: any;
}

export interface StatusMessage {
  /** Status title */
  title: string;
  /** Status description */
  description: string;
  /** Status icon component */
  icon: LucideIcon;
  /** Icon color class */
  color: string;
}

export interface NextUnlockProgressProps {
  /** Information about the next unlock */
  nextUnlock?: NextUnlock;
  /** Current progress points */
  currentProgress: number;
  /** Required progress points for unlock */
  requiredProgress: number;
  /** Points remaining to unlock */
  pointsNeeded: number;
  /** Additional CSS classes */
  className?: string;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get status message based on progress state
 */
function getStatusMessage(isUnlocked: boolean, isNearUnlock: boolean): StatusMessage {
  if (isUnlocked) {
    return {
      title: 'Capability Unlocked',
      description: 'New professional tools now available',
      icon: Unlock,
      color: 'text-green-400'
    };
  }

  if (isNearUnlock) {
    return {
      title: 'Nearly Achieved',
      description: 'Advanced capabilities approaching',
      icon: Zap,
      color: 'text-amber-400'
    };
  }

  return {
    title: 'Development Target',
    description: 'Systematic advancement in progress',
    icon: Lock,
    color: 'text-purple-300'
  };
}

// ==================== MAIN COMPONENT ====================

export const NextUnlockProgress: React.FC<NextUnlockProgressProps> = ({
  nextUnlock,
  currentProgress,
  requiredProgress,
  pointsNeeded,
  className = ''
}) => {
  const [animatedProgress, setAnimatedProgress] = useState<number>(0);

  // Calculate progress metrics
  const progressPercentage = Math.min((currentProgress / requiredProgress) * 100, 100);
  const isUnlocked = currentProgress >= requiredProgress;
  const isNearUnlock = progressPercentage >= 80 && !isUnlocked;

  // Smooth animation on mount and updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 300);

    return () => clearTimeout(timer);
  }, [progressPercentage]);

  // Get dynamic status
  const status = getStatusMessage(isUnlocked, isNearUnlock);
  const StatusIcon = status.icon;

  return (
    <div className={`mb-6 ${className}`}>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <StatusIcon size={18} className={status.color} />
            <h4 className="text-white font-semibold">Next Capability Unlock</h4>
          </div>
          <p className="text-purple-200 text-sm font-medium">
            {nextUnlock?.name || 'Advanced Professional Tools'}
          </p>
          <p className="text-purple-300 text-xs mt-1">{status.description}</p>
        </div>

        {/* Points Needed Badge */}
        <div className="text-right ml-4">
          <div className="text-purple-200 text-xs uppercase tracking-wide">Progress Needed</div>
          <div className={`text-lg font-bold ${isNearUnlock ? 'text-amber-400' : 'text-white'}`}>
            {pointsNeeded > 0 ? `${pointsNeeded}` : '0'}
            <span className="text-sm font-normal ml-1">points</span>
          </div>
        </div>
      </div>

      {/* Professional Progress Bar with Stealth Psychology */}
      <div className="relative mb-4">
        {/* Background Track */}
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden relative">
          {/* Animated Progress Fill */}
          <div
            className={`h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
              isUnlocked
                ? 'bg-gradient-to-r from-green-500 to-green-400'
                : isNearUnlock
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}
            style={{ width: `${animatedProgress}%` }}
          >
            {/* Animated Shine Effect (Psychological Satisfaction) */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -skew-x-12 animate-shine"
              style={{
                animationDuration: isNearUnlock ? '1.5s' : '3s'
              }}
            />
          </div>

          {/* Unlock Threshold Marker */}
          {!isUnlocked && (
            <div className="absolute top-0 w-0.5 h-4 bg-white opacity-40" style={{ left: '100%' }} />
          )}
        </div>

        {/* Progress Labels */}
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-purple-300">
            {currentProgress} / {requiredProgress} points
          </span>
          <span className={isNearUnlock ? 'text-amber-400 font-medium' : 'text-purple-300'}>
            {Math.round(progressPercentage)}% complete
          </span>
        </div>
      </div>

      {/* Unlock Benefits Preview (Anticipation Psychology) */}
      <div
        className={`p-4 rounded-lg border transition-all duration-300 ${
          isUnlocked
            ? 'bg-green-900/20 border-green-500/30'
            : isNearUnlock
              ? 'bg-amber-900/20 border-amber-500/30'
              : 'bg-black/30 border-purple-700/30'
        }`}
      >
        <div className="flex items-start space-x-3">
          {/* Benefit Icon */}
          <div
            className={`p-2 rounded-lg ${
              isUnlocked ? 'bg-green-600' : isNearUnlock ? 'bg-amber-600' : 'bg-purple-600'
            }`}
          >
            <TrendingUp size={16} className="text-white" />
          </div>

          {/* Benefit Content */}
          <div className="flex-1">
            <div
              className={`text-sm font-medium mb-1 ${
                isUnlocked
                  ? 'text-green-300'
                  : isNearUnlock
                    ? 'text-amber-300'
                    : 'text-purple-200'
              }`}
            >
              {isUnlocked ? 'Now Available:' : 'Unlock Benefits:'}
            </div>
            <div className="text-white text-sm leading-relaxed">
              {nextUnlock?.benefits ||
                'Advanced revenue intelligence and systematic client development capabilities'}
            </div>

            {/* Call to Action for Near Unlock (Drives Engagement) */}
            {isNearUnlock && (
              <div className="mt-3 text-xs text-amber-400 font-medium">
                ⚡ Almost there! Complete one more professional activity to unlock.
              </div>
            )}

            {/* Success State Recognition */}
            {isUnlocked && (
              <div className="mt-3 text-xs text-green-400 font-medium">
                ✅ Professional milestone achieved. New capabilities active.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional CSS Animation */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-shine {
          animation: shine 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default NextUnlockProgress;
