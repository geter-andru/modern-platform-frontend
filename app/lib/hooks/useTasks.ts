'use client';

/**
 * useTasks Hook
 * Provides task data and operations for Dashboard v2
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchTasksForCustomerAction, saveTaskProgressAction } from '@/app/actions/tasks';
import type {
  Task,
  CustomerData,
  CompetencyScores,
  MilestoneTier,
  TaskCompletionData,
} from '@/app/lib/services/TaskDataService';
import TaskCompletionService from '@/app/lib/services/TaskCompletionService';

export interface UseTasksOptions {
  userId: string;
  milestoneTier?: MilestoneTier;
  competencyFilter?: 'all' | 'customerAnalysis' | 'valueCommunication' | 'executiveReadiness';
  autoFetch?: boolean;
}

export interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  competencyScores: CompetencyScores;
  fetchTasks: () => Promise<void>;
  completeTask: (task: Task, notes?: string) => Promise<void>;
  refreshCompetencyScores: () => void;
}

export function useTasks(options: UseTasksOptions): UseTasksReturn {
  const {
    userId,
    milestoneTier = 'foundation',
    competencyFilter = 'all',
    autoFetch = true,
  } = options;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [competencyScores, setCompetencyScores] = useState<CompetencyScores>({
    customerAnalysis: 50,
    valueCommunication: 50,
    executiveReadiness: 50,
  });

  // Refresh competency scores from localStorage
  const refreshCompetencyScores = useCallback(() => {
    const scores = TaskCompletionService.getCurrentCompetencyScores();
    setCompetencyScores(scores);
  }, []);

  // Fetch tasks from Supabase
  const fetchTasks = useCallback(async () => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const customerData: CustomerData = {
        customerId: userId,
        milestone: {
          tier: milestoneTier,
          taskTableSource: milestoneTier === 'foundation' ? 'seed' : 'series-a',
        },
        competencyScores,
      };

      const fetchedTasks = await fetchTasksForCustomerAction(customerData);

      // Apply competency filter if specified
      let filteredTasks = fetchedTasks;
      if (competencyFilter !== 'all') {
        filteredTasks = fetchedTasks.filter(
          (task) => task.competencyArea === competencyFilter
        );
      }

      setTasks(filteredTasks);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to fetch tasks');
      setTasks([]); // Clear tasks on error
    } finally {
      setLoading(false);
    }
  }, [userId, milestoneTier, competencyScores, competencyFilter]);

  // Complete a task
  const completeTask = useCallback(
    async (task: Task, notes?: string) => {
      if (!userId) {
        throw new Error('User ID is required');
      }

      try {
        // Track completion via TaskCompletionService (updates localStorage + dispatches events)
        await TaskCompletionService.trackTaskCompletion({
          taskId: task.id,
          taskName: task.name,
          customerId: userId,
          competencyArea: task.competencyArea,
          priority: task.priority,
          milestone: milestoneTier,
          toolUsed: task.platformConnection?.tool || 'none',
          notes: notes || 'Completed via Dashboard v2',
          competencyGain: 5, // Default gain, can be customized based on priority
        });

        // Persist to Supabase via server action
        await saveTaskProgressAction(
          userId,
          task,
          {
            toolUsed: task.platformConnection?.tool,
            notes: notes || 'Completed via Dashboard v2',
            competencyGain: 5,
          }
        );

        // Refresh competency scores
        refreshCompetencyScores();

        // Refresh tasks list to show updated recommendations
        await fetchTasks();

        console.log('✅ Task completed successfully:', task.name);
      } catch (err: any) {
        console.error('Error completing task:', err);
        throw new Error(`Failed to complete task: ${err.message}`);
      }
    },
    [userId, milestoneTier, fetchTasks, refreshCompetencyScores]
  );

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch && userId) {
      fetchTasks();
    }
  }, [autoFetch, userId, milestoneTier, competencyFilter]);

  // Load initial competency scores
  useEffect(() => {
    refreshCompetencyScores();
  }, [refreshCompetencyScores]);

  // Listen for competency updates from TaskCompletionService
  useEffect(() => {
    const handleCompetencyUpdate = () => {
      refreshCompetencyScores();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('competencyUpdated', handleCompetencyUpdate);
      return () => window.removeEventListener('competencyUpdated', handleCompetencyUpdate);
    }
  }, [refreshCompetencyScores]);

  return {
    tasks,
    loading,
    error,
    competencyScores,
    fetchTasks,
    completeTask,
    refreshCompetencyScores,
  };
}
