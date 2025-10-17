'use client';

/**
 * TaskCard.tsx
 *
 * Individual task card component with completion tracking, animations,
 * and competency gain preview. Displays task priority, description,
 * and provides interactive completion flow.
 *
 * @module TaskCard
 * @version 1.0.0
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  Task,
  CompetencyArea,
  TaskPriority,
  MilestoneTier
} from '@/app/lib/services/TaskRecommendationEngine';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TaskCardProps {
  task: Task;
  milestone: {
    tier: MilestoneTier;
    stage: string;
  };
  competencyScores: Record<CompetencyArea, number>;
  onComplete: (task: Task) => void;
  onDetails?: (task: Task) => void;
  showDetails?: boolean;
  className?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get competency gain from task priority
 */
function getCompetencyGain(priority: TaskPriority): number {
  const gainMap: Record<TaskPriority, number> = {
    critical: 15,
    high: 10,
    medium: 7,
    low: 5
  };
  return gainMap[priority];
}

/**
 * Get priority color classes
 */
function getPriorityColor(priority: TaskPriority): {
  bg: string;
  text: string;
  border: string;
  glow: string;
} {
  const colors: Record<
    TaskPriority,
    { bg: string; text: string; border: string; glow: string }
  > = {
    critical: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/30',
      glow: 'shadow-red-500/20'
    },
    high: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      glow: 'shadow-orange-500/20'
    },
    medium: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      glow: 'shadow-blue-500/20'
    },
    low: {
      bg: 'bg-gray-500/10',
      text: 'text-gray-400',
      border: 'border-gray-500/30',
      glow: 'shadow-gray-500/20'
    }
  };
  return colors[priority];
}

/**
 * Get competency area display name and color
 */
function getCompetencyDisplay(area: CompetencyArea): {
  name: string;
  color: string;
  icon: string;
} {
  const display: Record<CompetencyArea, { name: string; color: string; icon: string }> = {
    customerAnalysis: {
      name: 'Customer Analysis',
      color: 'text-blue-400',
      icon: '👥'
    },
    valueCommunication: {
      name: 'Value Communication',
      color: 'text-green-400',
      icon: '💬'
    },
    executiveReadiness: {
      name: 'Executive Readiness',
      color: 'text-purple-400',
      icon: '🎯'
    }
  };
  return display[area];
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function TaskCard({
  task,
  milestone,
  competencyScores,
  onComplete,
  onDetails,
  showDetails = true,
  className = ''
}: TaskCardProps) {
  // State
  const [isCompleting, setIsCompleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get task metadata
  const priority = task.priority || 'medium' as TaskPriority;
  const competencyArea = (task.competencyArea === 'general' ? 'customerAnalysis' : task.competencyArea) || 'customerAnalysis' as CompetencyArea;
  const priorityColors = getPriorityColor(priority);
  const competencyDisplay = getCompetencyDisplay(competencyArea);
  const competencyGain = getCompetencyGain(priority);
  const currentCompetency = competencyScores[competencyArea] || 0;
  const newCompetency = Math.min(100, currentCompetency + competencyGain);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  /**
   * Handle completion click
   */
  const handleCompleteClick = useCallback(() => {
    setShowConfirmation(true);
  }, []);

  /**
   * Confirm task completion
   */
  const handleConfirmComplete = useCallback(async () => {
    setIsCompleting(true);

    try {
      // Small delay for animation
      await new Promise(resolve => setTimeout(resolve, 300));

      // Notify parent
      onComplete(task);

      setShowConfirmation(false);
    } catch (error) {
      console.error('Failed to complete task:', error);
      setIsCompleting(false);
      setShowConfirmation(false);
    }
  }, [task, onComplete]);

  /**
   * Cancel completion
   */
  const handleCancelComplete = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  /**
   * Handle details click
   */
  const handleDetailsClick = useCallback(() => {
    if (onDetails) {
      onDetails(task);
    }
  }, [task, onDetails]);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative ${className}`}
    >
      <div
        className={`
          p-6 rounded-lg border transition-all duration-300
          bg-gray-900/50 border-gray-800
          ${isHovered ? `shadow-lg ${priorityColors.glow}` : 'shadow-md'}
          ${isCompleting ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        {/* Priority Badge */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`
              px-3 py-1 rounded-full text-xs font-medium border
              ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border}
            `}
          >
            {priority.toUpperCase()}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {showDetails && onDetails && (
              <button
                onClick={handleDetailsClick}
                className="p-1.5 rounded-md hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-200"
                title="View details"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Task Name */}
        <h3 className="text-lg font-semibold text-gray-200 mb-3 line-clamp-2">
          {task.name}
        </h3>

        {/* Task Description */}
        {task.description && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-3">{task.description}</p>
        )}

        {/* Competency Area */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-800">
          <span className="text-lg">{competencyDisplay.icon}</span>
          <span className={`text-sm font-medium ${competencyDisplay.color}`}>
            {competencyDisplay.name}
          </span>
        </div>

        {/* Competency Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Current Progress</span>
            <span className={`text-xs font-medium ${competencyDisplay.color}`}>
              {currentCompetency}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentCompetency}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`h-full ${priorityColors.bg} ${priorityColors.border} border-r-2`}
            />
          </div>
        </div>

        {/* Competency Gain Preview */}
        <div
          className={`
            p-3 rounded-lg mb-4
            ${priorityColors.bg} ${priorityColors.border} border
          `}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Complete for:</span>
            <span className={`text-lg font-bold ${priorityColors.text}`}>
              +{competencyGain}% {competencyDisplay.icon}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <span>{currentCompetency}%</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            <span className={competencyDisplay.color}>{newCompetency}%</span>
          </div>
        </div>

        {/* Complete Button */}
        <AnimatePresence mode="wait">
          {!showConfirmation ? (
            <motion.button
              key="complete-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCompleteClick}
              disabled={isCompleting}
              className={`
                w-full py-3 rounded-lg font-medium transition-all duration-300
                ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border} border
                hover:bg-opacity-80 hover:shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isCompleting ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                  />
                  Completing...
                </span>
              ) : (
                'Mark as Complete'
              )}
            </motion.button>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <p className="text-sm text-center text-gray-300 mb-3">
                Confirm task completion?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleCancelComplete}
                  className="flex-1 py-2 rounded-lg font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmComplete}
                  disabled={isCompleting}
                  className={`
                    flex-1 py-2 rounded-lg font-medium transition-all
                    ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border} border
                    hover:bg-opacity-80
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {isCompleting ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tool Connection Indicator */}
        {task.toolConnection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.5 }}
            className="mt-3 pt-3 border-t border-gray-800"
          >
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <span>Connects to {task.toolConnection}</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
