'use client';

/**
 * TaskDetails.tsx
 *
 * Expanded modal view for displaying full task details, including
 * description, competency impact, resource recommendations, tool
 * connections, and completion flow with animations.
 *
 * @module TaskDetails
 * @version 1.0.0
 */

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskResourceMatcher from '@/app/lib/services/TaskResourceMatcher';
import type {
  Task,
  CompetencyArea,
  TaskPriority,
  MilestoneTier
} from '@/app/lib/services/TaskRecommendationEngine';
import type { ResourceRecommendation } from '@/app/lib/services/TaskResourceMatcher';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TaskDetailsProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  milestone: {
    tier: MilestoneTier;
    stage: string;
  };
  competencyScores: Record<CompetencyArea, number>;
  onComplete: (task: Task) => void;
  className?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getCompetencyGain(priority: TaskPriority): number {
  const gainMap: Record<TaskPriority, number> = {
    critical: 15,
    high: 10,
    medium: 7,
    low: 5
  };
  return gainMap[priority];
}

function getPriorityColor(priority: TaskPriority): {
  bg: string;
  text: string;
  border: string;
} {
  const colors: Record<TaskPriority, { bg: string; text: string; border: string }> = {
    critical: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/30'
    },
    high: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/30'
    },
    medium: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30'
    },
    low: {
      bg: 'bg-gray-500/10',
      text: 'text-gray-400',
      border: 'border-gray-500/30'
    }
  };
  return colors[priority];
}

function getCompetencyDisplay(area: CompetencyArea): {
  name: string;
  color: string;
  icon: string;
  description: string;
} {
  const display: Record<
    CompetencyArea,
    { name: string; color: string; icon: string; description: string }
  > = {
    customerAnalysis: {
      name: 'Customer Analysis',
      color: 'text-blue-400',
      icon: '👥',
      description: 'Understanding your ideal customer and market positioning'
    },
    valueCommunication: {
      name: 'Value Communication',
      color: 'text-green-400',
      icon: '💬',
      description: 'Articulating your value proposition and ROI'
    },
    executiveReadiness: {
      name: 'Executive Readiness',
      color: 'text-purple-400',
      icon: '🎯',
      description: 'Building scalable processes and team capabilities'
    }
  };
  return display[area];
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function TaskDetails({
  task,
  isOpen,
  onClose,
  milestone,
  competencyScores,
  onComplete,
  className = ''
}: TaskDetailsProps) {
  // State
  const [isCompleting, setIsCompleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [recommendations, setRecommendations] = useState<ResourceRecommendation[]>([]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Fetch resource recommendations when task changes
  useEffect(() => {
    if (task && isOpen) {
      const customerData = {
        customerId: 'system', // Fallback value - component not currently used
        competencyScores,
        milestone
      };

      const usageAssessment = {
        usage: {
          icpProgress: competencyScores.customerAnalysis || 0,
          financialProgress: competencyScores.valueCommunication || 0,
          resourcesAccessed: 0
        }
      };

      // Get task-driven recommendations
      const completedTask = {
        id: task.id,
        name: task.name,
        competencyArea: task.competencyArea === 'general' ? 'customerAnalysis' : task.competencyArea
      };

      const recs = TaskResourceMatcher.getTaskDrivenRecommendations(
        [completedTask],
        customerData,
        usageAssessment
      );

      setRecommendations(recs.slice(0, 4)); // Limit to top 4
    }
  }, [task, isOpen, milestone, competencyScores]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleCompleteClick = useCallback(() => {
    setShowConfirmation(true);
  }, []);

  const handleConfirmComplete = useCallback(async () => {
    if (!task) return;

    setIsCompleting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      onComplete(task);
      setShowConfirmation(false);
      onClose();
    } catch (error) {
      console.error('Failed to complete task:', error);
      setIsCompleting(false);
      setShowConfirmation(false);
    }
  }, [task, onComplete, onClose]);

  const handleCancelComplete = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  if (!task) return null;

  const priority = task.priority || 'medium' as TaskPriority;
  const competencyArea = (task.competencyArea === 'general' ? 'customerAnalysis' : task.competencyArea) || 'customerAnalysis' as CompetencyArea;
  const priorityColors = getPriorityColor(priority);
  const competencyDisplay = getCompetencyDisplay(competencyArea);
  const competencyGain = getCompetencyGain(priority);
  const currentCompetency = competencyScores[competencyArea] || 0;
  const newCompetency = Math.min(100, currentCompetency + competencyGain);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-800 rounded-xl shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-200 z-10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border}`}
                  >
                    {priority.toUpperCase()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{competencyDisplay.icon}</span>
                    <span className={`text-sm font-medium ${competencyDisplay.color}`}>
                      {competencyDisplay.name}
                    </span>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-100 mb-3">{task.name}</h2>

                {task.description && (
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Competency Impact */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">
                  Competency Impact
                </h3>

                <div
                  className={`p-6 rounded-lg border ${priorityColors.bg} ${priorityColors.border}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">
                        {competencyDisplay.description}
                      </div>
                      <div className="text-2xl font-bold text-gray-200">
                        {currentCompetency}% → {newCompetency}%
                      </div>
                    </div>
                    <div className={`text-4xl font-bold ${priorityColors.text}`}>
                      +{competencyGain}%
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: `${currentCompetency}%` }}
                      animate={{ width: `${newCompetency}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full ${priorityColors.bg} ${priorityColors.border} border-r-2`}
                    />
                  </div>
                </div>
              </div>

              {/* Tool Connection */}
              {task.toolConnection && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    Platform Integration
                  </h3>
                  <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-6 h-6 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-200">
                          Connects to {task.toolConnection}
                        </div>
                        <div className="text-sm text-gray-400">
                          This task integrates with platform tools for enhanced workflow
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Resource Recommendations */}
              {recommendations.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    Recommended Resources
                  </h3>
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <motion.div
                        key={rec.resourceId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-200">
                                {rec.category}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-xs ${
                                  rec.priority === 'high'
                                    ? 'bg-orange-500/20 text-orange-400'
                                    : rec.priority === 'medium'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-gray-500/20 text-gray-400'
                                }`}
                              >
                                {rec.priority}
                              </span>
                            </div>
                            <div className="text-sm text-gray-400">{rec.reason}</div>
                          </div>
                          <button className="ml-4 p-2 rounded-lg hover:bg-gray-700 transition-colors text-blue-400">
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
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Milestone Context */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">
                  Milestone Context
                </h3>
                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-gray-200 mb-1">
                        {milestone.tier.charAt(0).toUpperCase() + milestone.tier.slice(1)}{' '}
                        Stage
                      </div>
                      <div className="text-sm text-gray-400">
                        This task is recommended for your current business stage
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="border-t border-gray-800 pt-6">
                <AnimatePresence mode="wait">
                  {!showConfirmation ? (
                    <motion.button
                      key="complete-button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={handleCompleteClick}
                      disabled={isCompleting}
                      className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border} border hover:bg-opacity-80 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isCompleting ? (
                        <span className="flex items-center justify-center gap-3">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: 'linear'
                            }}
                            className="w-6 h-6 border-3 border-current border-t-transparent rounded-full"
                          />
                          Completing...
                        </span>
                      ) : (
                        `Mark as Complete (+${competencyGain}% ${competencyDisplay.icon})`
                      )}
                    </motion.button>
                  ) : (
                    <motion.div
                      key="confirmation"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <p className="text-center text-gray-300 text-lg">
                        Confirm task completion?
                      </p>
                      <div className="flex gap-4">
                        <button
                          onClick={handleCancelComplete}
                          className="flex-1 py-3 rounded-lg font-semibold border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleConfirmComplete}
                          disabled={isCompleting}
                          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border} border hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isCompleting ? 'Processing...' : 'Confirm'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
