'use client';

/**
 * Tasks System Integration Test Page
 * Tests the complete TaskDataService + TaskCompletionService + Supabase integration
 * Verifies: Task fetching, filtering, completion tracking, RLS policies
 */

import { useEffect, useState } from 'react';
import {
  fetchTasksForCustomerAction,
  saveTaskProgressAction,
} from '@/app/actions/tasks';
import type {
  Task,
  CustomerData,
  CompetencyScores,
  MilestoneTier,
} from '@/app/lib/services/TaskDataService';
import TaskCompletionService from '@/app/lib/services/TaskCompletionService';
import { useAuth } from '@/app/lib/hooks/useAuth';

export default function TestTasksIntegration() {
  const { user, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completionStatus, setCompletionStatus] = useState<string>('');
  const [competencyScores, setCompetencyScores] = useState<CompetencyScores>({
    customerAnalysis: 50,
    valueCommunication: 50,
    executiveReadiness: 50,
  });

  // Fetch tasks for authenticated user
  const fetchTasks = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const customerData: CustomerData = {
        customerId: user.id,
        milestone: {
          tier: 'foundation' as MilestoneTier,
          taskTableSource: 'seed',
        },
        competencyScores,
      };

      console.log('Fetching tasks for customer:', customerData);
      const fetchedTasks = await fetchTasksForCustomerAction(customerData);

      console.log('Tasks fetched:', fetchedTasks);
      setTasks(fetchedTasks);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  // Complete a task
  const completeTask = async (task: Task) => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    try {
      setCompletionStatus(`Completing task: ${task.name}...`);

      // Track completion via TaskCompletionService
      const completionEvent = await TaskCompletionService.trackTaskCompletion({
        taskId: task.id,
        taskName: task.name,
        customerId: user.id,
        competencyArea: task.competencyArea,
        priority: task.priority,
        milestone: 'foundation',
        toolUsed: task.platformConnection?.tool || 'none',
        notes: 'Completed via test page',
        competencyGain: 5,
      });

      console.log('Task completed:', completionEvent);
      setCompletionStatus(`✅ Task completed successfully!`);

      // Update local competency scores
      const updatedScores = TaskCompletionService.getCurrentCompetencyScores();
      setCompetencyScores(updatedScores);

      // Refresh tasks list
      setTimeout(() => fetchTasks(), 1000);
    } catch (err: any) {
      console.error('Error completing task:', err);
      setCompletionStatus(`❌ Error: ${err.message}`);
    }
  };

  // Load initial data
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchTasks();
      const savedScores = TaskCompletionService.getCurrentCompetencyScores();
      setCompetencyScores(savedScores);
    }
  }, [isAuthenticated, user?.id]);

  // Listen for task completion persistence events
  useEffect(() => {
    const handlePersist = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const eventData = customEvent.detail;

      try {
        await saveTaskProgressAction(
          eventData.customerId,
          {
            id: eventData.taskId,
            name: eventData.taskName,
            competencyArea: eventData.competencyArea,
            priority: eventData.priority,
            category: eventData.milestone,
          } as any,
          {
            toolUsed: eventData.toolUsed,
            notes: eventData.notes || `Completed via ${eventData.platform}`,
            competencyGain: eventData.competencyGain,
          }
        );
        console.log('✅ Task completion persisted to Supabase');
      } catch (error) {
        console.error('❌ Failed to persist task completion:', error);
      }
    };

    window.addEventListener('taskCompletionPersist', handlePersist);
    return () => window.removeEventListener('taskCompletionPersist', handlePersist);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🧪 Tasks System Integration Test</h1>
          <p className="text-gray-400">
            Testing TaskDataService + TaskCompletionService + Supabase
          </p>
        </div>

        {/* Authentication Status */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Authentication Status</h2>
          {isAuthenticated ? (
            <div className="space-y-2">
              <p className="text-green-400">✅ Authenticated</p>
              <p className="text-gray-300">User ID: {user?.id}</p>
              <p className="text-gray-300">Email: {user?.email}</p>
            </div>
          ) : (
            <p className="text-red-400">❌ Not authenticated - Please log in</p>
          )}
        </div>

        {/* Competency Scores */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Current Competency Scores</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Customer Analysis</p>
              <p className="text-2xl font-bold text-purple-400">
                {competencyScores.customerAnalysis}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Value Communication</p>
              <p className="text-2xl font-bold text-blue-400">
                {competencyScores.valueCommunication}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Executive Readiness</p>
              <p className="text-2xl font-bold text-green-400">
                {competencyScores.executiveReadiness}
              </p>
            </div>
          </div>
        </div>

        {/* Fetch Tasks Button */}
        <div className="mb-6">
          <button
            onClick={fetchTasks}
            disabled={loading || !isAuthenticated}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Fetching Tasks...' : 'Fetch Tasks from Supabase'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 p-4 rounded-lg mb-6">
            <p className="text-red-400">❌ Error: {error}</p>
          </div>
        )}

        {/* Completion Status */}
        {completionStatus && (
          <div className="bg-blue-900/20 border border-blue-500 p-4 rounded-lg mb-6">
            <p className="text-blue-400">{completionStatus}</p>
          </div>
        )}

        {/* Tasks List */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">
            Fetched Tasks ({tasks.length})
          </h2>

          {tasks.length === 0 && !loading && (
            <p className="text-gray-400">No tasks found. Click "Fetch Tasks" to load.</p>
          )}

          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-700 p-4 rounded-lg border border-gray-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{task.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      task.priority === 'critical'
                        ? 'bg-red-600 text-white'
                        : task.priority === 'high'
                        ? 'bg-orange-600 text-white'
                        : task.priority === 'medium'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-600 text-white'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-gray-400">Category:</span>{' '}
                    <span className="text-white">{task.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Competency Area:</span>{' '}
                    <span className="text-white">{task.competencyArea}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Estimated Time:</span>{' '}
                    <span className="text-white">{task.estimatedTime}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Stage/Milestone:</span>{' '}
                    <span className="text-white">{task.stageMilestone}</span>
                  </div>
                </div>

                {task.platformConnection && (
                  <div className="mt-3 p-3 bg-purple-900/30 rounded border border-purple-500/50">
                    <p className="text-sm text-purple-300">
                      🔗 Platform Tool: <span className="font-semibold">{task.platformConnection.tool}</span>
                    </p>
                    <p className="text-xs text-purple-400 mt-1">
                      {task.platformConnection.description}
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <button
                    onClick={() => completeTask(task)}
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm font-semibold transition-colors"
                  >
                    ✅ Mark as Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
