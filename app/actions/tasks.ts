'use server';

/**
 * Server Actions for Tasks System
 * Wraps TaskDataService for client component usage
 */

import TaskDataService, {
  type Task,
  type CustomerData,
  type TaskCompletionData,
} from '@/app/lib/services/TaskDataService';

/**
 * Fetch tasks for a customer
 */
export async function fetchTasksForCustomerAction(
  customerData: CustomerData
): Promise<Task[]> {
  try {
    return await TaskDataService.fetchTasksForCustomer(customerData);
  } catch (error: any) {
    console.error('Error in fetchTasksForCustomerAction:', error);
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }
}

/**
 * Save task progress
 */
export async function saveTaskProgressAction(
  customerId: string,
  taskData: Task,
  completionData: TaskCompletionData
): Promise<any> {
  try {
    return await TaskDataService.saveTaskProgress(customerId, taskData, completionData);
  } catch (error: any) {
    console.error('Error in saveTaskProgressAction:', error);
    throw new Error(`Failed to save task progress: ${error.message}`);
  }
}

/**
 * Fetch upcoming tasks for next milestone
 */
export async function fetchUpcomingTasksAction(
  currentMilestone: CustomerData['milestone'],
  competencyScores: CustomerData['competencyScores']
): Promise<Task[]> {
  try {
    return await TaskDataService.fetchUpcomingTasks(currentMilestone, competencyScores);
  } catch (error: any) {
    console.error('Error in fetchUpcomingTasksAction:', error);
    throw new Error(`Failed to fetch upcoming tasks: ${error.message}`);
  }
}
