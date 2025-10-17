'use client';

/**
 * CircularCompetencyGauge - Circular progress ring for competency scores
 *
 * Features:
 * - 120px circular progress visualization
 * - Animated score transitions on mount
 * - Color-coded by competency level (foundation, developing, proficient)
 * - Unlock status indicators
 * - Hover tooltip with detailed information
 * - Click handler for drill-down navigation
 * - Professional business KPI styling
 * - Responsive sizing
 *
 * Dependencies:
 * - react-circular-progressbar for the circular progress ring
 */

import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './CircularProgressbar.css';

// ==================== TYPE DEFINITIONS ====================

export interface CircularCompetencyGaugeProps {
  /** Competency name/title */
  name: string;
  /** Current competency score (0-100) */
  currentScore: number;
  /** Target score for unlock (default: 70) */
  targetScore?: number;
  /** Competency level label */
  level: string;
  /** Custom color override (optional) */
  color?: string;
  /** Description of what unlocks at target score */
  unlockBenefit: string;
  /** Additional description text */
  description?: string;
  /** Click handler for drill-down */
  onClick?: (name: string) => void;
  /** Additional CSS classes */
  className?: string;
}

export type CompetencyLevel = 'foundation' | 'developing' | 'proficient' | 'advanced' | 'expert';

export interface ColorMapping {
  [key: string]: string;
}

// ==================== COLOR CONFIGURATION ====================

/**
 * Professional color mapping for business intelligence presentation
 */
const COMPETENCY_COLORS: ColorMapping = {
  // Level-based colors
  foundation: '#f59e0b', // Amber - needs development
  developing: '#3b82f6', // Blue - making progress
  proficient: '#10b981', // Green - mastery level
  advanced: '#8b5cf6', // Purple - advanced level
  expert: '#ec4899', // Pink - expert level

  // Direct color names (for flexibility)
  blue: '#3b82f6',
  amber: '#f59e0b',
  green: '#10b981',
  purple: '#8b5cf6',
  pink: '#ec4899'
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get gauge color based on level or custom color
 */
function getGaugeColor(level: string, customColor?: string): string {
  if (customColor) {
    return COMPETENCY_COLORS[customColor.toLowerCase()] || customColor;
  }
  return COMPETENCY_COLORS[level.toLowerCase()] || COMPETENCY_COLORS.foundation;
}

// ==================== MAIN COMPONENT ====================

export const CircularCompetencyGauge: React.FC<CircularCompetencyGaugeProps> = ({
  name,
  currentScore,
  targetScore = 70,
  level,
  color,
  unlockBenefit,
  description,
  onClick,
  className = ''
}) => {
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  // Calculate unlock status
  const isUnlocked = currentScore >= targetScore;
  const pointsToUnlock = Math.max(0, targetScore - currentScore);

  // Determine gauge color
  const gaugeColor = getGaugeColor(level, color);

  // Professional animation on mount - smooth, business-appropriate
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(currentScore);
    }, 200);

    return () => clearTimeout(timer);
  }, [currentScore]);

  // Handle click interaction
  const handleClick = () => {
    if (onClick) {
      onClick(name);
    }
  };

  return (
    <div
      className={`text-center group cursor-pointer transform hover:scale-105 transition-transform duration-200 ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${name} competency: ${currentScore} out of 100 points, ${level} level`}
    >
      {/* Circular Progress Ring - Professional Business KPI Style */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 relative">
        <CircularProgressbar
          value={animatedScore}
          text={`${Math.round(animatedScore)}`}
          styles={buildStyles({
            pathColor: gaugeColor,
            textColor: '#ffffff',
            textSize: '20px',
            trailColor: '#374151',
            backgroundColor: 'transparent',
            pathTransitionDuration: 0.8,
            pathTransition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          })}
        />

        {/* Professional drop shadow overlay */}
        <div
          className="absolute inset-0 rounded-full shadow-lg pointer-events-none"
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))',
            background: 'transparent'
          }}
        />
      </div>

      {/* Competency Details - Business Intelligence Presentation */}
      <div className="space-y-2">
        {/* Competency Name */}
        <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
          {name}
        </h4>

        {/* Level Indicator */}
        <div className="text-xs text-gray-400">Level: {level}</div>

        {/* Professional Status Indicator */}
        <div
          className={`text-xs px-2 py-1 rounded-full inline-block transition-colors ${
            isUnlocked
              ? 'bg-green-900 text-green-300 group-hover:bg-green-800'
              : 'bg-amber-900 text-amber-300 group-hover:bg-amber-800'
          }`}
        >
          {isUnlocked ? 'Tools Unlocked' : `${pointsToUnlock} points to unlock`}
        </div>

        {/* Hover Tooltip Area - Sophisticated Business Information */}
        <div className="relative">
          <div className="text-xs text-gray-500 cursor-help group-hover:text-gray-400 transition-colors">
            {unlockBenefit}
          </div>

          {/* Detailed Professional Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-56 p-4 bg-gray-900 border border-gray-600 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 shadow-xl pointer-events-none">
            {/* Tooltip Header */}
            <div className="font-medium mb-2 text-blue-300">{name} Development</div>

            {/* Score Details */}
            <div className="space-y-1 text-gray-300">
              <div>Current Score: {currentScore}/100</div>
              <div>Target for Unlock: {targetScore}/100</div>
              <div>Points Needed: {pointsToUnlock}</div>
              <div>Professional Level: {level}</div>
            </div>

            {/* Optional Description */}
            {description && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="text-gray-400">{description}</div>
              </div>
            )}

            {/* Unlock Benefit */}
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="font-medium text-blue-300 mb-1">Unlock Benefit:</div>
              <div className="text-gray-400">{unlockBenefit}</div>
            </div>

            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularCompetencyGauge;
