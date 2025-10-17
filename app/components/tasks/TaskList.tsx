'use client';

/**
 * TaskList.tsx
 *
 * Container component that displays multiple task cards in a responsive grid.
 * Handles task fetching, filtering, completion, and progress tracking.
 *
 * @module TaskList
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import TaskDataService from '@/app/lib/services/TaskDataService';
import TaskCompletionService from '@/app/lib/services/TaskCompletionService';
import TaskRecommendationEngine from '@/app/lib/services/TaskRecommendationEngine';
import type {
  Task,
  CompetencyArea,
  TaskPriority,
  MilestoneTier
} from '@/app/lib/services/TaskRecommendationEngine';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TaskListProps {
  customerId: string;
  milestone: {
    tier: MilestoneTier;
    stage: string;
  };
  competencyScores?: Record<CompetencyArea, number>;
  onTaskComplete?: (task: Task, competencyGain: number) => void;
  showUpcoming?: boolean;
  maxTasks?: number;
  className?: string;
}

type FilterType = 'all' | 'critical' | 'high' | 'medium' | 'low';
type SortType = 'priority' | 'competency' | 'name';

interface TaskFilters {
  priority: FilterType;
  competencyArea: CompetencyArea | 'all';
  sort: SortType;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function TaskList({
  customerId,
  milestone,
  competencyScores = {
    customerAnalysis: 0,
    valueCommunication: 0,
    executiveReadiness: 0
  },
  onTaskComplete,
  showUpcoming = false,
  maxTasks = 12,
  className = ''
}: TaskListProps) {
  // State management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    priority: 'all',
    competencyArea: 'all',
    sort: 'priority'
  });

  // ==========================================================================
  // DATA FETCHING
  // ==========================================================================

  /**
   * Fetch tasks for current milestone
   */
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Preload critical data for performance
      // await TaskDataService.preloadDashboardData(customerId, milestone, competencyScores);

      // Fetch current milestone tasks (uses cache)
      const customerData = {
        customerId,
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

      const fetchedTasks = await TaskDataService.fetchTasksForCustomer(
        customerData as any,
        usageAssessment
      );

      setTasks(fetchedTasks || []);

      // Fetch upcoming milestone tasks if requested
      if (showUpcoming) {
        const nextMilestone = TaskRecommendationEngine.getNextMilestone(milestone as any);
        if (nextMilestone) {
          const upcoming = await TaskDataService.fetchUpcomingTasks(
            nextMilestone as any,
            competencyScores
          );
          setUpcomingTasks(upcoming || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [customerId, milestone, competencyScores, showUpcoming]);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ==========================================================================
  // TASK COMPLETION HANDLING
  // ==========================================================================

  /**
   * Handle task completion
   */
  const handleTaskComplete = useCallback(
    async (task: Task) => {
      try {
        // Process completion with service
        const competencyGain = await (TaskCompletionService as any).completeTask(
          customerId,
          task,
          milestone,
          competencyScores
        );

        // Update local state
        setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));

        // Notify parent component
        if (onTaskComplete) {
          onTaskComplete(task, competencyGain);
        }

        // Show success feedback
        console.log(
          `Task completed! +${competencyGain}% ${task.competencyArea} competency`
        );
      } catch (err) {
        console.error('Failed to complete task:', err);
        setError('Failed to complete task. Please try again.');
      }
    },
    [customerId, milestone, competencyScores, onTaskComplete]
  );

  // ==========================================================================
  // FILTERING AND SORTING
  // ==========================================================================

  /**
   * Filter and sort tasks based on current filters
   */
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Filter by priority
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Filter by competency area
    if (filters.competencyArea !== 'all') {
      filtered = filtered.filter(
        task => task.competencyArea === filters.competencyArea
      );
    }

    // Sort tasks
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'priority': {
          const priorityOrder: Record<TaskPriority, number> = {
            critical: 4,
            high: 3,
            medium: 2,
            low: 1
          };
          return priorityOrder[b.priority || 'low'] - priorityOrder[a.priority || 'low'];
        }
        case 'competency':
          return (a.competencyArea || '').localeCompare(b.competencyArea || '');
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    // Limit number of tasks
    return filtered.slice(0, maxTasks);
  }, [tasks, filters, maxTasks]);

  // ==========================================================================
  // FILTER HANDLERS
  // ==========================================================================

  const handleFilterChange = useCallback((newFilters: Partial<TaskFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  /**
   * Get priority badge color
   */
  const getPriorityColor = (priority: TaskPriority): string => {
    const colors: Record<TaskPriority, string> = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      low: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[priority];
  };

  /**
   * Get competency area color
   */
  const getCompetencyColor = (area: CompetencyArea): string => {
    const colors: Record<CompetencyArea, string> = {
      customerAnalysis: 'text-blue-400',
      valueCommunication: 'text-green-400',
      executiveReadiness: 'text-purple-400'
    };
    return colors[area];
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
          <p className="mt-4 text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-300 text-lg mb-4">{error}</p>
          <button
            onClick={fetchTasks}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (filteredTasks.length === 0 && tasks.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-300 text-lg mb-2">All caught up!</p>
          <p className="text-gray-500">No tasks available for your current milestone.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Filters Section */}
      <div className="mb-6 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Priority Filter */}
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">Priority</label>
            <select
              value={filters.priority}
              onChange={e =>
                handleFilterChange({ priority: e.target.value as FilterType })
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Competency Area Filter */}
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">Competency Area</label>
            <select
              value={filters.competencyArea}
              onChange={e =>
                handleFilterChange({
                  competencyArea: e.target.value as CompetencyArea | 'all'
                })
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Areas</option>
              <option value="customerAnalysis">Customer Analysis</option>
              <option value="valueCommunication">Value Communication</option>
              <option value="executiveReadiness">Executive Readiness</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">Sort By</label>
            <select
              value={filters.sort}
              onChange={e =>
                handleFilterChange({ sort: e.target.value as SortType })
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="priority">Priority</option>
              <option value="competency">Competency Area</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Active Filter Count */}
        {(filters.priority !== 'all' || filters.competencyArea !== 'all') && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-400">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </span>
            <button
              onClick={() =>
                setFilters({ priority: 'all', competencyArea: 'all', sort: 'priority' })
              }
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Task Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              milestone={milestone}
              competencyScores={competencyScores}
              onComplete={handleTaskComplete}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Upcoming Tasks Preview */}
      {showUpcoming && upcomingTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              Coming Next Milestone
            </h3>
            <p className="text-gray-400">
              Preview of tasks you'll unlock as you progress
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTasks.slice(0, 3).map(task => (
              <div
                key={task.id}
                className="relative p-6 bg-gray-900/30 border border-gray-800/50 rounded-lg opacity-60"
              >
                {/* Locked Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-gray-600">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Task Info */}
                <h4 className="text-lg font-medium text-gray-400 mb-2">{task.name}</h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded border ${getPriorityColor(
                      task.priority || 'low'
                    )}`}
                  >
                    {task.priority}
                  </span>
                  <span className={`text-sm ${getCompetencyColor((task.competencyArea === 'general' ? 'customerAnalysis' : task.competencyArea) || 'customerAnalysis')}`}>
                    {task.competencyArea}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
