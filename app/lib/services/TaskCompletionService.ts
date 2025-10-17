/**
 * Task Completion Service - TypeScript Migration
 * Phase 3.3: Task Management System
 *
 * Handles task completion tracking and behavioral assessment
 * Manages competency progress, milestone achievements, and professional development velocity
 *
 * @migration Next.js 15 + TypeScript strict mode
 * @phase Phase 3.3 - Task Completion Service
 * @refactored 2025-10-11 - Migrated from Airtable to Supabase via TaskDataService
 * @note Client-side service (uses localStorage, sessionStorage, window events)
 */

'use client';

import type {
  Task,
  TaskPriority,
  CompetencyArea,
  CompetencyScores,
  TaskCompletionData,
  MilestoneTier,
} from './TaskDataService';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TaskCompletionEvent {
  type: 'task_completion';
  taskId: string;
  taskName: string;
  customerId: string;
  competencyArea: CompetencyArea | 'general';
  priority: TaskPriority;
  milestone: MilestoneTier;
  toolUsed?: string;
  notes?: string;
  competencyGain?: number;
  sessionId: string;
  userAgent: string;
  timestamp: number;
  timezone: string;
  platform: string;
}

export interface UsageData {
  taskCompletions: number;
  lastTaskCompletion: number;
  firstTaskCompletion?: number;
  competencyProgress: Record<string, number>;
  priorityCompletions: Record<TaskPriority, number>;
  toolConnections: Record<string, number>;
  developmentVelocity: number;
}

export interface MilestoneAchievement {
  area: string;
  target: number;
  current: number;
}

export interface TaskRecognition {
  message: string;
  competencyGain: string;
  businessImpact: string;
  nextSuggestion: string;
  timestamp: number;
}

export interface TaskBasedScoring {
  completionRate: number;
  complexityProgression: number;
  implementationFollowThrough: number;
  developmentVelocity: number;
}

export interface EnhancedUsageAssessment {
  taskIntelligence: TaskBasedScoring;
  overallCompetency: number;
  [key: string]: any;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const COMPETENCY_BOOSTS: Record<TaskPriority, number> = {
  critical: 8,
  high: 5,
  medium: 3,
  low: 1,
} as const;

const MILESTONE_TARGETS = {
  foundation: { customerAnalysis: 70, valueCommunication: 65, executiveReadiness: 50 },
  growth: { customerAnalysis: 85, valueCommunication: 80, executiveReadiness: 75 },
  expansion: { customerAnalysis: 90, valueCommunication: 90, executiveReadiness: 85 },
} as const;

const DEFAULT_COMPETENCY_SCORES: CompetencyScores = {
  customerAnalysis: 50,
  valueCommunication: 50,
  executiveReadiness: 50,
} as const;

// ============================================================================
// TASK COMPLETION SERVICE CLASS
// ============================================================================

class TaskCompletionServiceClass {
  private updateQueue: TaskCompletionEvent[] = [];
  private isUpdating: boolean = false;

  // ==========================================================================
  // SESSION MANAGEMENT
  // ==========================================================================

  getCurrentSessionId(): string {
    if (typeof window === 'undefined') return 'server-session';

    let sessionId = sessionStorage.getItem('taskCompletionSession');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('taskCompletionSession', sessionId);
    }
    return sessionId;
  }

  // ==========================================================================
  // TASK COMPLETION TRACKING
  // ==========================================================================

  /**
   * Track task completion for behavioral assessment
   */
  async trackTaskCompletion(taskData: {
    taskId: string;
    taskName: string;
    customerId: string;
    competencyArea: CompetencyArea | 'general';
    priority: TaskPriority;
    milestone: MilestoneTier;
    toolUsed?: string;
    notes?: string;
    competencyGain?: number;
  }): Promise<TaskCompletionEvent> {
    const completionEvent: TaskCompletionEvent = {
      type: 'task_completion',
      ...taskData,
      sessionId: this.getCurrentSessionId(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      timestamp: Date.now(),
      timezone:
        typeof Intl !== 'undefined'
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : 'UTC',
      platform: 'simplified_dashboard',
    };

    try {
      // Update local usage data immediately
      this.updateLocalUsageData(completionEvent);

      // Save to Supabase task_completions (non-blocking)
      this.throttledUpdateUsageData(completionEvent);

      // Update competency scores
      this.updateCompetencyProgress(
        taskData.competencyArea,
        taskData.priority,
        taskData.customerId
      );

      // Check for milestone achievements
      this.checkForMilestoneAchievements(taskData);

      return completionEvent;
    } catch (error) {
      console.error('Error tracking task completion:', error);
      // Don't throw - allow operation to continue
      return completionEvent;
    }
  }

  // ==========================================================================
  // LOCAL STORAGE MANAGEMENT
  // ==========================================================================

  /**
   * Update local usage data in localStorage
   */
  private updateLocalUsageData(eventData: TaskCompletionEvent): void {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = `taskUsageData_${eventData.customerId || 'unknown'}`;
      const existingDataStr = localStorage.getItem(storageKey) || '{}';
      const existingData: Partial<UsageData> = JSON.parse(existingDataStr);

      // Update completion statistics
      const taskCompletions = (existingData.taskCompletions || 0) + 1;
      const lastTaskCompletion = Date.now();

      // Track first completion if not set
      if (!existingData.firstTaskCompletion) {
        existingData.firstTaskCompletion = lastTaskCompletion;
      }

      // Track by competency area
      const competencyProgress = existingData.competencyProgress || {};
      competencyProgress[eventData.competencyArea] =
        (competencyProgress[eventData.competencyArea] || 0) + 1;

      // Track by priority level
      const priorityCompletions = (existingData.priorityCompletions || {}) as Record<TaskPriority, number>;
      priorityCompletions[eventData.priority] = (priorityCompletions[eventData.priority] || 0) + 1;

      // Track tool usage connection
      const toolConnections = existingData.toolConnections || {};
      if (eventData.toolUsed && eventData.toolUsed !== 'none') {
        toolConnections[eventData.toolUsed] = (toolConnections[eventData.toolUsed] || 0) + 1;
      }

      // Build complete usage data object
      const updatedData: UsageData = {
        taskCompletions,
        lastTaskCompletion,
        firstTaskCompletion: existingData.firstTaskCompletion,
        competencyProgress,
        priorityCompletions,
        toolConnections,
        developmentVelocity: this.calculateDevelopmentVelocity({
          ...existingData,
          taskCompletions,
          lastTaskCompletion,
        } as UsageData),
      };

      localStorage.setItem(storageKey, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error updating local usage data:', error);
    }
  }

  /**
   * Throttled server update with batch processing
   */
  private throttledUpdateUsageData(eventData: TaskCompletionEvent): void {
    this.updateQueue.push(eventData);

    // Process queue with debounced delay
    setTimeout(() => this.processQueue(), 1000);
  }

  /**
   * Process update queue in batches
   * Note: This method stores events in queue for external persistence handling
   * The calling code should use server actions to persist to Supabase
   */
  private async processQueue(): Promise<void> {
    if (this.isUpdating || this.updateQueue.length === 0) return;

    this.isUpdating = true;
    const batch = this.updateQueue.splice(0, 5); // Process up to 5 at a time

    try {
      // Dispatch custom event for external persistence handling
      // The test page or dashboard can listen for this and call server actions
      if (typeof window !== 'undefined') {
        batch.forEach((eventData) => {
          window.dispatchEvent(
            new CustomEvent('taskCompletionPersist', {
              detail: eventData,
            })
          );
        });
      }

      console.log(`Queued ${batch.length} task completions for persistence`);
    } catch (error) {
      console.warn('Batch task progress processing failed:', error);
    } finally {
      this.isUpdating = false;

      // Process remaining queue after delay
      if (this.updateQueue.length > 0) {
        setTimeout(() => this.processQueue(), 2000);
      }
    }
  }

  // ==========================================================================
  // COMPETENCY MANAGEMENT
  // ==========================================================================

  /**
   * Update competency scores based on task type
   */
  private updateCompetencyProgress(
    competencyArea: CompetencyArea | 'general',
    priority: TaskPriority,
    customerId: string
  ): void {
    if (competencyArea === 'general') return;

    const boost = COMPETENCY_BOOSTS[priority] || 1;

    try {
      // Get current competency scores
      const currentScores = this.getCurrentCompetencyScores();

      // Apply boost
      const updatedScores: CompetencyScores = {
        ...currentScores,
        [competencyArea]: Math.min(100, (currentScores[competencyArea] || 50) + boost),
      };

      // Save updated scores locally
      this.saveCompetencyScores(updatedScores);

      // Update cache with new scores
      // if (customerId) {
      //   TaskCacheManager.cacheCompetencyProgress(customerId, updatedScores);
      // }

      // Trigger competency update event
      this.triggerCompetencyUpdate(competencyArea, boost);
    } catch (error) {
      console.error('Error updating competency progress:', error);
    }
  }

  /**
   * Get current competency scores from localStorage
   */
  getCurrentCompetencyScores(): CompetencyScores {
    if (typeof window === 'undefined') return DEFAULT_COMPETENCY_SCORES;

    try {
      const scoresStr = localStorage.getItem('competencyScores');
      return scoresStr ? JSON.parse(scoresStr) : DEFAULT_COMPETENCY_SCORES;
    } catch (error) {
      console.error('Error getting competency scores:', error);
      return DEFAULT_COMPETENCY_SCORES;
    }
  }

  /**
   * Save competency scores to localStorage
   */
  private saveCompetencyScores(scores: CompetencyScores): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('competencyScores', JSON.stringify(scores));
      localStorage.setItem('competencyScoresUpdated', Date.now().toString());
    } catch (error) {
      console.error('Error saving competency scores:', error);
    }
  }

  /**
   * Trigger competency update event for real-time UI updates
   */
  private triggerCompetencyUpdate(competencyArea: CompetencyArea, boost: number): void {
    if (typeof window === 'undefined') return;

    window.dispatchEvent(
      new CustomEvent('competencyUpdated', {
        detail: { competencyArea, boost, timestamp: Date.now() },
      })
    );
  }

  // ==========================================================================
  // MILESTONE ACHIEVEMENTS
  // ==========================================================================

  /**
   * Check for milestone achievements based on competency scores
   */
  private checkForMilestoneAchievements(taskData: {
    milestone: MilestoneTier;
  }): void {
    try {
      const currentScores = this.getCurrentCompetencyScores();
      const milestoneTargets = this.getMilestoneTargets(taskData.milestone);

      // Check if any competency area reached target
      const achievements: MilestoneAchievement[] = [];
      Object.keys(milestoneTargets).forEach((area) => {
        const areaKey = area as keyof CompetencyScores;
        if (currentScores[areaKey] >= milestoneTargets[areaKey]) {
          achievements.push({
            area,
            target: milestoneTargets[areaKey],
            current: currentScores[areaKey],
          });
        }
      });

      if (achievements.length > 0) {
        this.triggerMilestoneAchievement(achievements, taskData.milestone);
      }
    } catch (error) {
      console.error('Error checking milestone achievements:', error);
    }
  }

  /**
   * Get milestone targets for a given tier
   */
  private getMilestoneTargets(milestoneTier: MilestoneTier): CompetencyScores {
    return MILESTONE_TARGETS[milestoneTier] || MILESTONE_TARGETS.foundation;
  }

  /**
   * Trigger milestone achievement event
   */
  private triggerMilestoneAchievement(
    achievements: MilestoneAchievement[],
    milestone: MilestoneTier
  ): void {
    if (typeof window === 'undefined') return;

    window.dispatchEvent(
      new CustomEvent('milestoneAchieved', {
        detail: { achievements, milestone, timestamp: Date.now() },
      })
    );

    console.log('🎯 Milestone Achievement:', achievements);
  }

  // ==========================================================================
  // TASK COMPLETION RECOGNITION
  // ==========================================================================

  /**
   * Show professional task completion recognition
   */
  showTaskCompletionRecognition(task: Task, completionData: TaskCompletionData): TaskRecognition {
    const recognition: TaskRecognition = {
      message: `${task.name} implementation complete`,
      competencyGain: `${task.competencyArea} capability enhanced (+${completionData.competencyGain || 0} points)`,
      businessImpact: this.getBusinessImpactMessage(task),
      nextSuggestion: this.getNextActionSuggestion(task),
      timestamp: Date.now(),
    };

    if (typeof window !== 'undefined') {
      // Dispatch recognition event for UI to handle
      window.dispatchEvent(
        new CustomEvent('taskRecognition', {
          detail: recognition,
        })
      );

      // Suggest platform tool if applicable
      if (task.platformConnection) {
        this.suggestPlatformTool(task.platformConnection);
      }
    }

    console.log('🏆 Professional Recognition:', recognition);

    return recognition;
  }

  /**
   * Get business impact message for a task
   */
  private getBusinessImpactMessage(task: Task): string {
    const impactMessages: Record<string, string> = {
      customerAnalysis:
        'Enhanced buyer understanding drives more effective targeting and higher conversion rates',
      valueCommunication:
        'Improved value articulation accelerates deal closure and increases average deal size',
      executiveReadiness:
        'Strengthened executive capabilities enable scaling and strategic decision-making',
      general:
        'Systematic business development progress achieved through structured implementation',
    };

    return impactMessages[task.competencyArea] || impactMessages.general;
  }

  /**
   * Get next action suggestion
   */
  private getNextActionSuggestion(task: Task): string {
    if (task.platformConnection) {
      return `Continue with ${task.platformConnection.tool}: ${task.platformConnection.description}`;
    }

    const suggestions: Record<string, string> = {
      customerAnalysis: 'Use ICP Analysis tool to systematically apply this customer intelligence',
      valueCommunication:
        'Use Financial Impact Builder to quantify and communicate this value',
      executiveReadiness:
        'Access Resource Library for executive-level implementation frameworks',
      general: 'Continue with next recommended action for systematic business development',
    };

    return suggestions[task.competencyArea] || suggestions.general;
  }

  /**
   * Suggest platform tool connection
   */
  private suggestPlatformTool(platformConnection: Task['platformConnection']): void {
    if (typeof window === 'undefined' || !platformConnection) return;

    window.dispatchEvent(
      new CustomEvent('toolSuggestion', {
        detail: {
          tool: platformConnection.tool,
          feature: platformConnection.feature,
          description: platformConnection.description,
          timestamp: Date.now(),
        },
      })
    );
  }

  // ==========================================================================
  // ANALYTICS & ASSESSMENT
  // ==========================================================================

  /**
   * Calculate development velocity based on task completion frequency
   */
  private calculateDevelopmentVelocity(usageData: Partial<UsageData>): number {
    if (!usageData.taskCompletions || usageData.taskCompletions < 2) {
      return 0;
    }

    // Simple velocity calculation based on completion frequency
    const daysSinceStart =
      (Date.now() - (usageData.firstTaskCompletion || Date.now())) / (1000 * 60 * 60 * 24);
    const completionsPerDay = usageData.taskCompletions / Math.max(1, daysSinceStart);

    // Normalize to 0-1 scale (1 completion per day = 1.0 velocity)
    return Math.min(1, completionsPerDay);
  }

  /**
   * Enhance usage assessment with task data
   */
  enhanceUsageAssessmentWithTasks(
    baseAssessment: any,
    customerId: string
  ): EnhancedUsageAssessment {
    if (typeof window === 'undefined')
      return { ...baseAssessment, taskIntelligence: {}, overallCompetency: 50 };

    try {
      const storageKey = `taskUsageData_${customerId}`;
      const taskDataStr = localStorage.getItem(storageKey) || '{}';
      const taskData: Partial<UsageData> = JSON.parse(taskDataStr);

      const taskBasedScoring: TaskBasedScoring = {
        completionRate: this.calculateTaskCompletionRate(taskData),
        complexityProgression: this.analyzeTaskComplexityProgression(taskData),
        implementationFollowThrough: this.analyzeToolUsageAfterTasks(taskData),
        developmentVelocity: taskData.developmentVelocity || 0,
      };

      return {
        ...baseAssessment,
        taskIntelligence: taskBasedScoring,
        overallCompetency: this.combineAssessments(baseAssessment, taskBasedScoring),
      };
    } catch (error) {
      console.error('Error enhancing usage assessment with tasks:', error);
      return { ...baseAssessment, taskIntelligence: {}, overallCompetency: 50 };
    }
  }

  /**
   * Calculate task completion rate
   */
  private calculateTaskCompletionRate(taskData: Partial<UsageData>): number {
    if (!taskData.taskCompletions) return 0;

    // Calculate based on available tasks vs completed
    const availableTasks = 10; // Estimate based on milestone
    return Math.min(1, taskData.taskCompletions / availableTasks);
  }

  /**
   * Analyze task complexity progression
   */
  private analyzeTaskComplexityProgression(taskData: Partial<UsageData>): number {
    if (!taskData.priorityCompletions) return 0;

    const weights: Record<TaskPriority, number> = { critical: 4, high: 3, medium: 2, low: 1 };
    let totalComplexity = 0;
    let totalTasks = 0;

    Object.entries(taskData.priorityCompletions).forEach(([priority, count]) => {
      const priorityKey = priority as TaskPriority;
      totalComplexity += weights[priorityKey] * count;
      totalTasks += count;
    });

    return totalTasks > 0 ? totalComplexity / (totalTasks * 4) : 0; // Normalize to 0-1
  }

  /**
   * Analyze tool usage after tasks
   */
  private analyzeToolUsageAfterTasks(taskData: Partial<UsageData>): number {
    if (!taskData.toolConnections) return 0;

    // Calculate percentage of tasks that led to tool usage
    const toolUsageCount = Object.values(taskData.toolConnections).reduce(
      (sum, count) => sum + count,
      0
    );
    const totalTasks = taskData.taskCompletions || 1;

    return Math.min(1, toolUsageCount / totalTasks);
  }

  /**
   * Combine base assessment and task-based scoring
   */
  private combineAssessments(
    baseAssessment: any,
    taskBasedScoring: TaskBasedScoring
  ): number {
    // Weighted combination of base assessment and task-based scoring
    const baseWeight = 0.6;
    const taskWeight = 0.4;

    const baseScore = baseAssessment.overallScore || 50;
    const taskScore =
      taskBasedScoring.completionRate * 25 +
      taskBasedScoring.complexityProgression * 25 +
      taskBasedScoring.implementationFollowThrough * 25 +
      taskBasedScoring.developmentVelocity * 25;

    return Math.round(baseScore * baseWeight + taskScore * taskWeight);
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

const TaskCompletionService = new TaskCompletionServiceClass();
export default TaskCompletionService;
