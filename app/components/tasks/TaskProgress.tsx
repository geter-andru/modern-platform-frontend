'use client';

/**
 * TaskProgress.tsx
 *
 * Progress tracking widget displaying competency advancement, task
 * completion statistics, milestone progress, and visual charts.
 * Shows real-time progress with animations and milestone predictions.
 *
 * @module TaskProgress
 * @version 1.0.0
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import TaskRecommendationEngine from '@/app/lib/services/TaskRecommendationEngine';
import type {
  CompetencyArea,
  MilestoneTier,
  CompetencyScores
} from '@/app/lib/services/TaskRecommendationEngine';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TaskProgressProps {
  competencyScores: CompetencyScores;
  milestone: {
    tier: MilestoneTier;
    stage: string;
  };
  tasksCompleted: number;
  totalTasks: number;
  className?: string;
  showMilestoneProgress?: boolean;
  showCompetencyBreakdown?: boolean;
}

interface CompetencyProgressItem {
  area: CompetencyArea;
  name: string;
  icon: string;
  color: string;
  current: number;
  target: number;
  gap: number;
  percentage: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getCompetencyDisplay(area: CompetencyArea): {
  name: string;
  color: string;
  bgColor: string;
  icon: string;
} {
  const display: Record<
    CompetencyArea,
    { name: string; color: string; bgColor: string; icon: string }
  > = {
    customerAnalysis: {
      name: 'Customer Analysis',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500',
      icon: '👥'
    },
    valueCommunication: {
      name: 'Value Communication',
      color: 'text-green-400',
      bgColor: 'bg-green-500',
      icon: '💬'
    },
    executiveReadiness: {
      name: 'Executive Readiness',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500',
      icon: '🎯'
    }
  };
  return display[area];
}

function getMilestoneColor(tier: MilestoneTier): {
  color: string;
  bgColor: string;
  gradient: string;
} {
  const colors: Record<
    MilestoneTier,
    { color: string; bgColor: string; gradient: string }
  > = {
    foundation: {
      color: 'text-blue-400',
      bgColor: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600'
    },
    growth: {
      color: 'text-green-400',
      bgColor: 'bg-green-500',
      gradient: 'from-green-500 to-green-600'
    },
    expansion: {
      color: 'text-purple-400',
      bgColor: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600'
    },
    'market-leader': {
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500',
      gradient: 'from-yellow-500 to-yellow-600'
    }
  };
  return colors[tier];
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function TaskProgress({
  competencyScores,
  milestone,
  tasksCompleted,
  totalTasks,
  className = '',
  showMilestoneProgress = true,
  showCompetencyBreakdown = true
}: TaskProgressProps) {
  // ==========================================================================
  // COMPUTED DATA
  // ==========================================================================

  /**
   * Calculate overall progress
   */
  const overallProgress = useMemo(() => {
    const avgCompetency =
      (competencyScores.customerAnalysis +
        competencyScores.valueCommunication +
        competencyScores.executiveReadiness) /
      3;

    const taskProgress = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;

    return {
      avgCompetency: Math.round(avgCompetency),
      taskProgress: Math.round(taskProgress),
      overall: Math.round((avgCompetency + taskProgress) / 2)
    };
  }, [competencyScores, tasksCompleted, totalTasks]);

  /**
   * Get milestone targets and calculate gaps
   */
  const milestoneData = useMemo(() => {
    const targets = (TaskRecommendationEngine as any).getMilestoneTargets(milestone.tier);

    const competencyItems: CompetencyProgressItem[] = [
      {
        area: 'customerAnalysis' as CompetencyArea,
        ...getCompetencyDisplay('customerAnalysis'),
        current: competencyScores.customerAnalysis,
        target: targets.customerAnalysis,
        gap: Math.max(0, targets.customerAnalysis - competencyScores.customerAnalysis),
        percentage: (competencyScores.customerAnalysis / targets.customerAnalysis) * 100
      },
      {
        area: 'valueCommunication' as CompetencyArea,
        ...getCompetencyDisplay('valueCommunication'),
        current: competencyScores.valueCommunication,
        target: targets.valueCommunication,
        gap: Math.max(0, targets.valueCommunication - competencyScores.valueCommunication),
        percentage:
          (competencyScores.valueCommunication / targets.valueCommunication) * 100
      },
      {
        area: 'executiveReadiness' as CompetencyArea,
        ...getCompetencyDisplay('executiveReadiness'),
        current: competencyScores.executiveReadiness,
        target: targets.executiveReadiness,
        gap: Math.max(0, targets.executiveReadiness - competencyScores.executiveReadiness),
        percentage: (competencyScores.executiveReadiness / targets.executiveReadiness) * 100
      }
    ];

    return { targets, competencyItems };
  }, [milestone.tier, competencyScores]);

  /**
   * Calculate next milestone progress
   */
  const nextMilestoneData = useMemo(() => {
    const nextMilestone = TaskRecommendationEngine.getNextMilestone(milestone as any);
    if (!nextMilestone) return null;

    const nextTargets = (TaskRecommendationEngine as any).getMilestoneTargets(nextMilestone.tier);
    const avgCurrent =
      (competencyScores.customerAnalysis +
        competencyScores.valueCommunication +
        competencyScores.executiveReadiness) /
      3;
    const avgTarget =
      (nextTargets.customerAnalysis +
        nextTargets.valueCommunication +
        nextTargets.executiveReadiness) /
      3;

    return {
      milestone: nextMilestone,
      progress: (avgCurrent / avgTarget) * 100,
      gap: Math.max(0, avgTarget - avgCurrent)
    };
  }, [milestone, competencyScores]);

  const milestoneColor = getMilestoneColor(milestone.tier);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg"
      >
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Overall Progress</h3>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Task Completion */}
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {tasksCompleted}
            </div>
            <div className="text-sm text-gray-400">Tasks Completed</div>
          </div>

          {/* Average Competency */}
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {overallProgress.avgCompetency}%
            </div>
            <div className="text-sm text-gray-400">Avg Competency</div>
          </div>

          {/* Overall Score */}
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {overallProgress.overall}%
            </div>
            <div className="text-sm text-gray-400">Overall Score</div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress.overall}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r ${milestoneColor.gradient}`}
          />
        </div>
      </motion.div>

      {/* Competency Breakdown */}
      {showCompetencyBreakdown && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-gray-200 mb-4">
            Competency Breakdown
          </h3>

          <div className="space-y-4">
            {milestoneData.competencyItems.map((item, index) => (
              <motion.div
                key={item.area}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className={`text-sm font-medium ${item.color}`}>
                      {item.name}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {item.current}% / {item.target}%
                    {item.gap > 0 && (
                      <span className="ml-2 text-orange-400">
                        (-{item.gap}% to target)
                      </span>
                    )}
                  </div>
                </div>

                {/* Competency Progress Bar */}
                <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, item.percentage)}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                    className={`h-full ${(item as any).bgColor}`}
                  />
                  {/* Target Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white/50"
                    style={{ left: '100%' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Current Milestone Progress */}
      {showMilestoneProgress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-gray-200 mb-4">
            Current Milestone: {milestone.tier.charAt(0).toUpperCase() + milestone.tier.slice(1)}
          </h3>

          <div className="space-y-3">
            {/* Milestone Indicator */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${milestoneColor.bgColor} flex items-center justify-center text-white font-bold`}>
                {milestone.tier.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-200">
                  {milestone.tier.charAt(0).toUpperCase() + milestone.tier.slice(1)} Stage
                </div>
                <div className="text-sm text-gray-400">{milestone.stage}</div>
              </div>
            </div>

            {/* Task Progress */}
            <div className="pt-3 border-t border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Tasks Progress</span>
                <span className="text-sm font-medium text-gray-200">
                  {tasksCompleted} / {totalTasks}
                </span>
              </div>
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress.taskProgress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full ${milestoneColor.bgColor}`}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Next Milestone Preview */}
      {nextMilestoneData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-gray-900/30 border border-gray-800/50 rounded-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-400">Next Milestone</h3>
            <span className="text-sm text-gray-500">
              {Math.round(nextMilestoneData.progress)}% ready
            </span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full ${getMilestoneColor(nextMilestoneData.milestone.tier).bgColor} opacity-50 flex items-center justify-center text-white font-bold`}>
              {nextMilestoneData.milestone.tier.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-gray-300">
                {nextMilestoneData.milestone.tier.charAt(0).toUpperCase() +
                  nextMilestoneData.milestone.tier.slice(1)}
              </div>
              <div className="text-sm text-gray-500">
                +{Math.round(nextMilestoneData.gap)}% competency needed
              </div>
            </div>
          </div>

          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, nextMilestoneData.progress)}%` }}
              transition={{ duration: 1, delay: 0.4 }}
              className={`h-full bg-gradient-to-r ${
                getMilestoneColor(nextMilestoneData.milestone.tier).gradient
              } opacity-50`}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
