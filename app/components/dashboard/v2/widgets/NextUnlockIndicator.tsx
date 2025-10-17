'use client';

/**
 * NextUnlockIndicator - Next tool unlock preview card
 *
 * Features:
 * - Shows closest competency to unlock threshold
 * - Points needed calculation
 * - Progress bar with animated glow effect
 * - "All unlocked" celebration state
 * - Current progress percentage
 * - Additional locked areas display
 * - Professional gradient backgrounds
 * - Configurable unlock threshold
 */

import React from 'react';
import { Trophy, Target, ArrowRight } from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================

export interface CompetencyArea {
  /** Competency name */
  name: string;
  /** Current score (0-100) */
  current: number;
  /** Description of what unlocks at threshold */
  unlockBenefit?: string;
  /** Additional properties */
  [key: string]: any;
}

export interface NextUnlockIndicatorProps {
  /** Array of competency areas */
  competencyAreas?: CompetencyArea[];
  /** Unlock threshold score (default: 70) */
  unlockThreshold?: number;
  /** Additional CSS classes */
  className?: string;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Find the next competency to unlock (closest to threshold)
 */
function findNextUnlock(
  competencies: CompetencyArea[],
  threshold: number
): CompetencyArea | null {
  const lockedAreas = competencies.filter((comp) => comp.current < threshold);

  if (lockedAreas.length === 0) return null;

  // Sort by current score descending (highest score = closest to unlock)
  return lockedAreas.sort((a, b) => b.current - a.current)[0];
}

/**
 * Calculate progress percentage toward unlock
 */
function calculateProgress(current: number, threshold: number): number {
  return Math.min((current / threshold) * 100, 100);
}

// ==================== MAIN COMPONENT ====================

export const NextUnlockIndicator: React.FC<NextUnlockIndicatorProps> = ({
  competencyAreas = [],
  unlockThreshold = 70,
  className = ''
}) => {
  // Find next unlock and remaining locked areas
  const lockedAreas = competencyAreas.filter((comp) => comp.current < unlockThreshold);
  const nextUnlock = findNextUnlock(competencyAreas, unlockThreshold);

  // All tools unlocked state - Professional celebration
  if (!nextUnlock) {
    return (
      <div
        className={`text-center p-6 bg-gradient-to-r from-green-900 to-emerald-900 border border-green-700 rounded-lg ${className}`}
      >
        <div className="flex items-center justify-center mb-3">
          <Trophy size={24} className="text-green-300 mr-2" />
          <div className="text-green-300 font-semibold text-lg">
            Professional Competency Targets Achieved
          </div>
        </div>
        <div className="text-green-400 text-sm">
          All revenue intelligence tools unlocked and available for use
        </div>
        <div className="mt-4 text-xs text-green-500">
          Continue tracking professional development activities to maintain advancement
        </div>
      </div>
    );
  }

  // Calculate progress metrics
  const pointsNeeded = unlockThreshold - nextUnlock.current;
  const progressToNext = calculateProgress(nextUnlock.current, unlockThreshold);
  const progressWidth = Math.min(progressToNext, 100);

  return (
    <div
      className={`p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 rounded-lg border border-blue-700 ${className}`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Target size={18} className="text-blue-300 mr-2" />
            <div className="text-white font-semibold">Next Tool Unlock</div>
          </div>
          <div className="text-blue-200 text-sm font-medium mb-1">
            {nextUnlock.unlockBenefit || `${nextUnlock.name} Professional Tools`}
          </div>
          <div className="text-blue-300 text-xs">Competency Area: {nextUnlock.name}</div>
        </div>

        {/* Points Needed Badge */}
        <div className="text-right ml-4">
          <div className="text-blue-300 font-bold text-xl">{pointsNeeded}</div>
          <div className="text-blue-400 text-xs">points needed</div>
        </div>
      </div>

      {/* Professional Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-blue-300 mb-2">
          <span>Current Progress</span>
          <span>{Math.round(progressToNext)}% to unlock</span>
        </div>
        <div className="w-full bg-blue-800 rounded-full h-3 relative overflow-hidden">
          {/* Progress Fill */}
          <div
            className="bg-gradient-to-r from-blue-400 to-blue-300 h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressWidth}%` }}
          />

          {/* Professional glow effect */}
          <div
            className="absolute top-0 bg-gradient-to-r from-transparent via-blue-200 to-transparent h-3 rounded-full opacity-30 transition-all duration-700"
            style={{
              width: '20%',
              left: `${Math.max(0, progressWidth - 10)}%`,
              animation: progressWidth > 10 ? 'pulse 2s ease-in-out infinite' : 'none'
            }}
          />
        </div>
      </div>

      {/* Professional Development Context */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-blue-300">
          <span className="font-medium">{nextUnlock.name}:</span>
          <span className="ml-2">
            {nextUnlock.current}/{unlockThreshold}
          </span>
        </div>
        <div className="flex items-center text-blue-400 text-xs">
          <span>Professional Development</span>
          <ArrowRight size={14} className="ml-1" />
        </div>
      </div>

      {/* Additional Locked Areas (Context) */}
      {lockedAreas.length > 1 && (
        <div className="mt-4 pt-4 border-t border-blue-800">
          <div className="text-xs text-blue-400 mb-2">
            Additional Development Opportunities:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {lockedAreas.slice(1).map((area) => (
              <div
                key={area.name}
                className="flex justify-between text-xs text-blue-300 bg-blue-900/50 px-2 py-1 rounded"
              >
                <span>{area.name}</span>
                <span>
                  {area.current}/{unlockThreshold}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NextUnlockIndicator;
