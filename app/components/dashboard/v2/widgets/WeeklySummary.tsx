'use client';

/**
 * WeeklySummary - Weekly performance overview widget
 *
 * Features:
 * - Weekly target progress visualization
 * - 6 key metrics with trend indicators
 * - Goal progress tracking (points, competency, consistency)
 * - Achievement badges (earned/unearned states)
 * - Detailed analytics CTA
 * - Professional gradient styling
 * - Responsive grid layouts
 * - Mock data for development/testing
 */

import React from 'react';
import {
  Calendar,
  Target,
  TrendingUp,
  Award,
  ChevronRight,
  Star,
  type LucideIcon
} from 'lucide-react';
import SummaryMetric from './SummaryMetric';

// ==================== TYPE DEFINITIONS ====================

export interface WeekData {
  /** Total points earned this week */
  totalPoints: number;
  /** Number of activities completed */
  activitiesCompleted: number;
  /** Competency points gained */
  competencyGrowth: number;
  /** Number of tools unlocked this week */
  toolsUnlocked: number;
  /** Average impact score (1-4) */
  averageImpact: number;
  /** Hours spent on focused activities */
  focusHours: number;
  /** Consecutive days with activity */
  streak: number;
}

export interface Goals {
  /** Target points for the week */
  weeklyPointTarget: number;
  /** Target competency points to gain */
  competencyTarget: number;
  /** Target daily consistency (days) */
  consistencyTarget: number;
}

export interface Achievement {
  /** Achievement title */
  title: string;
  /** Achievement description */
  description: string;
  /** Whether achievement was earned this week */
  earned: boolean;
  /** Icon component for the achievement */
  icon: LucideIcon;
}

export interface WeeklyData {
  /** Current week's data */
  currentWeek: WeekData;
  /** Previous week's data for comparison */
  previousWeek: WeekData;
  /** Weekly goals */
  goals: Goals;
  /** Achievements for this week */
  achievements: Achievement[];
}

export interface WeeklySummaryProps {
  /** Weekly data (uses mock data if not provided) */
  weeklyData?: WeeklyData;
  /** Additional CSS classes */
  className?: string;
}

// ==================== DEFAULT MOCK DATA ====================

/**
 * Default mock data for development and testing
 * This will be replaced with real Supabase data in production
 */
const DEFAULT_WEEKLY_DATA: WeeklyData = {
  currentWeek: {
    totalPoints: 180,
    activitiesCompleted: 8,
    competencyGrowth: 12,
    toolsUnlocked: 1,
    averageImpact: 3.2, // out of 4 (low=1, medium=2, high=3, critical=4)
    focusHours: 14.5,
    streak: 5 // consecutive days with activity
  },
  previousWeek: {
    totalPoints: 145,
    activitiesCompleted: 6,
    competencyGrowth: 8,
    toolsUnlocked: 0,
    averageImpact: 2.8,
    focusHours: 11.2,
    streak: 3
  },
  goals: {
    weeklyPointTarget: 200,
    competencyTarget: 15,
    consistencyTarget: 7 // daily activities
  },
  achievements: [
    {
      title: 'High Impact Week',
      description: 'Completed 2+ critical impact activities',
      earned: true,
      icon: Star
    },
    {
      title: 'Consistency Builder',
      description: '5-day activity streak achieved',
      earned: true,
      icon: Target
    },
    {
      title: 'Tool Unlocked',
      description: 'Reached 70+ Value Communication score',
      earned: true,
      icon: Award
    }
  ]
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Calculate progress percentage towards a goal
 */
function calculateProgress(current: number, target: number): number {
  return Math.min((current / target) * 100, 100);
}

/**
 * Get progress bar color classes based on completion percentage
 */
function getProgressBarColor(progress: number, type: 'points' | 'competency' | 'consistency'): string {
  if (progress >= 100) {
    return 'bg-gradient-to-r from-green-500 to-green-400';
  }

  switch (type) {
    case 'points':
      return 'bg-gradient-to-r from-blue-500 to-blue-400';
    case 'competency':
      return 'bg-gradient-to-r from-purple-600 to-purple-500';
    case 'consistency':
      return 'bg-gradient-to-r from-amber-500 to-amber-400';
    default:
      return 'bg-gradient-to-r from-blue-500 to-blue-400';
  }
}

// ==================== MAIN COMPONENT ====================

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({
  weeklyData,
  className = ''
}) => {
  const data = weeklyData || DEFAULT_WEEKLY_DATA;
  const { currentWeek, previousWeek, goals, achievements } = data;

  // Calculate goal progress percentages
  const pointsProgress = calculateProgress(currentWeek.totalPoints, goals.weeklyPointTarget);
  const competencyProgress = calculateProgress(currentWeek.competencyGrowth, goals.competencyTarget);
  const consistencyProgress = calculateProgress(currentWeek.streak, goals.consistencyTarget);

  return (
    <div
      className={`bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-lg border border-gray-700 ${className}`}
    >
      {/* Professional Header with Gradient Accent */}
      <div className="relative p-6 border-b border-gray-700">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-green-600/10 rounded-t-lg" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Weekly Performance Summary</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>This week</span>
            </div>
          </div>

          {/* Progress Overview Bar */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Weekly Target Progress</span>
                <span className="text-blue-400 font-medium">{Math.round(pointsProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${pointsProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid - Business Intelligence Style */}
      <div className="p-6 border-b border-gray-700">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <SummaryMetric
            label="Total Points"
            value={currentWeek.totalPoints}
            previousValue={previousWeek.totalPoints}
            size="default"
            className="text-center"
          />

          <SummaryMetric
            label="Activities"
            value={currentWeek.activitiesCompleted}
            previousValue={previousWeek.activitiesCompleted}
            size="default"
            className="text-center"
          />

          <SummaryMetric
            label="Competency Growth"
            value={currentWeek.competencyGrowth}
            previousValue={previousWeek.competencyGrowth}
            suffix=" pts"
            size="default"
            className="text-center"
          />

          <SummaryMetric
            label="Impact Score"
            value={currentWeek.averageImpact}
            previousValue={previousWeek.averageImpact}
            format="decimal"
            suffix="/4"
            size="small"
            className="text-center"
          />

          <SummaryMetric
            label="Focus Hours"
            value={currentWeek.focusHours}
            previousValue={previousWeek.focusHours}
            format="decimal"
            suffix="h"
            size="small"
            className="text-center"
          />

          <SummaryMetric
            label="Daily Streak"
            value={currentWeek.streak}
            previousValue={previousWeek.streak}
            suffix=" days"
            size="small"
            className="text-center"
          />
        </div>
      </div>

      {/* Goal Progress Indicators */}
      <div className="p-6 border-b border-gray-700">
        <h4 className="text-sm font-semibold text-white mb-4">Goal Progress</h4>
        <div className="space-y-4">
          {/* Points Goal */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Weekly Points Target</span>
              <span className="text-gray-400">
                {currentWeek.totalPoints} / {goals.weeklyPointTarget}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(
                  pointsProgress,
                  'points'
                )}`}
                style={{ width: `${pointsProgress}%` }}
              />
            </div>
          </div>

          {/* Competency Goal */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Competency Development</span>
              <span className="text-gray-400">
                {currentWeek.competencyGrowth} / {goals.competencyTarget}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(
                  competencyProgress,
                  'competency'
                )}`}
                style={{ width: `${competencyProgress}%` }}
              />
            </div>
          </div>

          {/* Consistency Goal */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Daily Consistency</span>
              <span className="text-gray-400">
                {currentWeek.streak} / {goals.consistencyTarget} days
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(
                  consistencyProgress,
                  'consistency'
                )}`}
                style={{ width: `${consistencyProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-white mb-4">Weekly Achievements</h4>
        <div className="space-y-3">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                  achievement.earned
                    ? 'bg-green-900/20 border-green-500/30 hover:bg-green-900/30'
                    : 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  <IconComponent size={16} />
                </div>

                <div className="flex-1">
                  <div
                    className={`text-sm font-medium ${
                      achievement.earned ? 'text-green-300' : 'text-gray-400'
                    }`}
                  >
                    {achievement.title}
                  </div>
                  <div className="text-xs text-gray-500">{achievement.description}</div>
                </div>

                {achievement.earned && (
                  <div className="text-green-400">
                    <ChevronRight size={16} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Weekly Summary Action */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <button className="w-full group bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 hover:border-blue-500/50 rounded-lg py-3 px-4 transition-all duration-200 flex items-center justify-center space-x-2">
            <TrendingUp size={16} className="text-blue-400 group-hover:text-blue-300" />
            <span className="text-sm font-medium text-white group-hover:text-blue-100">
              View Detailed Analytics
            </span>
            <ChevronRight
              size={16}
              className="text-gray-400 group-hover:text-blue-300 group-hover:translate-x-1 transition-all duration-200"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;
