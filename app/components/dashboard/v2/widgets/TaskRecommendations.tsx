'use client';

/**
 * TaskRecommendations Widget
 * Displays recommended tasks based on competency gaps and current milestone
 *
 * Features:
 * - Task list with priority indicators
 * - Competency area badges
 * - Platform tool integration callouts
 * - One-click task completion
 * - Estimated time and business impact
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  Link as LinkIcon,
  Loader2,
  AlertCircle,
  Target,
  Sparkles,
} from 'lucide-react';
import type { Task } from '@/app/lib/services/TaskDataService';

export interface TaskRecommendationsProps {
  tasks: Task[];
  loading?: boolean;
  error?: string | null;
  onCompleteTask?: (task: Task) => Promise<void>;
  onRefresh?: () => void;
  className?: string;
  maxTasks?: number;
  showCompletionButton?: boolean;
}

const priorityConfig = {
  critical: {
    label: 'Critical',
    color: 'bg-red-600',
    textColor: 'text-red-400',
    borderColor: 'border-red-500',
  },
  high: {
    label: 'High',
    color: 'bg-orange-600',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500',
  },
  medium: {
    label: 'Medium',
    color: 'bg-yellow-600',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500',
  },
  low: {
    label: 'Low',
    color: 'bg-gray-600',
    textColor: 'text-gray-400',
    borderColor: 'border-gray-500',
  },
};

const competencyConfig = {
  customerAnalysis: {
    label: 'Customer Analysis',
    color: 'bg-purple-600/20 text-purple-400 border-purple-500',
    icon: '🎯',
  },
  valueCommunication: {
    label: 'Value Communication',
    color: 'bg-blue-600/20 text-blue-400 border-blue-500',
    icon: '💬',
  },
  executiveReadiness: {
    label: 'Executive Readiness',
    color: 'bg-green-600/20 text-green-400 border-green-500',
    icon: '⭐',
  },
  general: {
    label: 'General',
    color: 'bg-gray-600/20 text-gray-400 border-gray-500',
    icon: '📋',
  },
};

export const TaskRecommendations: React.FC<TaskRecommendationsProps> = ({
  tasks,
  loading = false,
  error = null,
  onCompleteTask,
  onRefresh,
  className = '',
  maxTasks = 5,
  showCompletionButton = true,
}) => {
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  const handleCompleteTask = async (task: Task) => {
    if (!onCompleteTask) return;

    setCompletingTaskId(task.id);
    try {
      await onCompleteTask(task);
    } catch (err) {
      console.error('Error completing task:', err);
    } finally {
      setCompletingTaskId(null);
    }
  };

  const displayTasks = tasks.slice(0, maxTasks);

  return (
    <div className={`bg-surface border border-border rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">
            Recommended Tasks
          </h3>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="text-sm text-text-muted hover:text-primary transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-4 bg-red-950/20 border border-red-500 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-400 font-medium">Failed to load tasks</p>
            <p className="text-xs text-red-400/70 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && displayTasks.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
          <p className="text-text-muted">No recommended tasks at this time</p>
          <p className="text-sm text-text-subtle mt-1">
            Check back later for new recommendations
          </p>
        </div>
      )}

      {/* Task List */}
      {!loading && !error && displayTasks.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {displayTasks.map((task, index) => {
              const priority = priorityConfig[task.priority];
              const competency = competencyConfig[task.competencyArea] || competencyConfig.general;
              const isCompleting = completingTaskId === task.id;

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-surface-hover border ${priority.borderColor} rounded-lg p-4 hover:shadow-lg transition-shadow`}
                >
                  {/* Task Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${priority.color} text-white`}
                        >
                          {priority.label}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium border ${competency.color}`}
                        >
                          {competency.icon} {competency.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-text-primary">
                        {task.name}
                      </h4>
                    </div>
                  </div>

                  {/* Task Description */}
                  <p className="text-sm text-text-muted mb-3 line-clamp-2">
                    {task.description}
                  </p>

                  {/* Task Metadata */}
                  <div className="flex items-center gap-4 text-xs text-text-subtle mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{task.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{task.category}</span>
                    </div>
                  </div>

                  {/* Platform Connection */}
                  {task.platformConnection && (
                    <div className="mb-3 p-3 bg-primary/10 border border-primary/30 rounded">
                      <div className="flex items-start gap-2">
                        <LinkIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-primary">
                            Platform Tool: {task.platformConnection.tool}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {task.platformConnection.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Business Impact */}
                  {task.businessImpact && (
                    <p className="text-xs text-text-subtle italic mb-3">
                      Impact: {task.businessImpact}
                    </p>
                  )}

                  {/* Complete Button */}
                  {showCompletionButton && onCompleteTask && (
                    <button
                      onClick={() => handleCompleteTask(task)}
                      disabled={isCompleting}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-semibold rounded transition-colors"
                    >
                      {isCompleting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Completing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Mark as Complete
                        </>
                      )}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Footer Note */}
      {!loading && !error && displayTasks.length > 0 && tasks.length > maxTasks && (
        <div className="mt-4 pt-4 border-t border-border text-center">
          <p className="text-xs text-text-subtle">
            Showing {maxTasks} of {tasks.length} recommended tasks
          </p>
        </div>
      )}
    </div>
  );
};
