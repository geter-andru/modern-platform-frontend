/**
 * Task Data Service - TypeScript Migration
 * Phase 3.3: Task Management System
 *
 * Handles task data fetching, filtering, and CRUD operations with Supabase
 * Manages task lifecycle, prioritization, and caching for optimal performance
 *
 * @migration Next.js 15 + TypeScript strict mode
 * @phase Phase 3.3 - Task Data Service (CRUD operations)
 * @refactored 2025-10-11 - Migrated from Airtable to Supabase
 * @note Server-side only (uses createClient from supabase/server)
 */

import { createClient } from '@/app/lib/supabase/server';

// Import dependencies (to be created)
// import { TaskRecommendationEngine } from './TaskRecommendationEngine';
// import { TaskCacheManager } from './TaskCacheManager';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Task {
  id: string;
  name: string;
  description: string;
  category: string;
  stageMilestone: string;
  priority: TaskPriority;
  revenueGoal: string;
  competencyArea: CompetencyArea | 'general';
  platformConnection: PlatformConnection | null;
  sourceTable: string;
  estimatedTime: string;
  businessImpact: string;
  prerequisites: string;
  resources: string[];
  createdTime: string;
  competencyGap?: number;
  relevanceScore?: number;
}

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type CompetencyArea = 'customerAnalysis' | 'valueCommunication' | 'executiveReadiness';
export type MilestoneTier = 'foundation' | 'growth' | 'expansion';

export interface PlatformConnection {
  tool: 'icp' | 'financial' | 'resources' | 'business-case';
  feature: string;
  description: string;
}

export interface CustomerData {
  customerId: string;
  milestone: Milestone;
  competencyScores: CompetencyScores;
}

export interface Milestone {
  tier: MilestoneTier;
  milestoneCategories?: string[];
  revenueRange?: string;
  taskTableSource?: 'seed' | 'series-a' | 'both';
  targets?: CompetencyTargets;
}

export interface CompetencyScores {
  customerAnalysis: number;
  valueCommunication: number;
  executiveReadiness: number;
}

export interface CompetencyTargets {
  customerAnalysis: number;
  valueCommunication: number;
  executiveReadiness: number;
}

export interface UsageAssessment {
  usage: {
    icpProgress?: number;
    financialProgress?: number;
    resourcesAccessed?: number;
  };
}

export interface TaskCompletionData {
  toolUsed?: string;
  notes?: string;
  competencyGain?: number;
}

// Removed: AirtableRecord and AirtableResponse interfaces (Supabase uses typed responses)

// ============================================================================
// CONFIGURATION
// ============================================================================

// Supabase database tables for tasks system
const SUPABASE_TABLES = {
  tasksLibrary: 'tasks_library',
  taskCompletions: 'task_completions',
} as const;

const MILESTONE_TARGETS: Record<MilestoneTier, CompetencyTargets> = {
  foundation: { customerAnalysis: 70, valueCommunication: 65, executiveReadiness: 50 },
  growth: { customerAnalysis: 85, valueCommunication: 80, executiveReadiness: 75 },
  expansion: { customerAnalysis: 90, valueCommunication: 90, executiveReadiness: 85 },
} as const;

const PRIORITY_ORDER = { critical: 4, high: 3, medium: 2, low: 1 } as const;

const PRIORITY_MAP: Record<string, TaskPriority> = {
  'Critical': 'critical',
  'High': 'high',
  'Medium': 'medium',
  'Low': 'low',
  'Must Have': 'critical',
  'Should Have': 'high',
  'Could Have': 'medium',
  "Won't Have": 'low',
} as const;

// ============================================================================
// TASK DATA SERVICE CLASS
// ============================================================================

class TaskDataServiceClass {
  // ==========================================================================
  // MAIN TASK FETCHING
  // ==========================================================================

  /**
   * Fetch tasks for customer with filtering and caching
   */
  async fetchTasksForCustomer(
    customerData: CustomerData,
    usageAssessment?: UsageAssessment
  ): Promise<Task[]> {
    const customerId = customerData.customerId || 'unknown';
    const milestone = customerData.milestone || { tier: 'foundation' as MilestoneTier };
    const competencyScores = customerData.competencyScores || this._getDefaultScores();

    try {
      // Try to get from cache first
      const cacheKey = this._generateCacheKey(customerId, milestone);
      // const cachedTasks = TaskCacheManager.getCachedCustomerTasks(customerId, cacheKey);

      // if (cachedTasks) {
      //   console.log('TaskDataService: Using cached tasks');
      //   return cachedTasks;
      // }

      // Fetch tasks from Supabase tasks_library
      console.log('TaskDataService: Fetching tasks from Supabase');
      const supabaseTasks = await this.fetchFilteredTasks(milestone.taskTableSource || 'seed', milestone, competencyScores);

      // Fallback to default tasks if Supabase query fails or returns empty
      const tasks = supabaseTasks.length > 0 ? supabaseTasks : this._getDefaultTasksForMilestone(milestone.tier);

      // Ensure milestone has targets for calculations
      const milestoneWithTargets: Milestone = {
        ...milestone,
        targets: milestone.targets || MILESTONE_TARGETS[milestone.tier],
      };

      const prioritizedTasks = this.prioritizeTasksForUser(
        tasks,
        competencyScores,
        usageAssessment,
        milestoneWithTargets
      );

      // Cache the results
      // TaskCacheManager.cacheCustomerTasks(customerId, cacheKey, prioritizedTasks);

      return prioritizedTasks;
    } catch (error) {
      console.error('Error in fetchTasksForCustomer:', error);

      // Graceful degradation with default tasks
      const defaultTasks = this._getDefaultTasksForMilestone(milestone.tier);
      const milestoneWithTargets: Milestone = {
        ...milestone,
        targets: milestone.targets || MILESTONE_TARGETS[milestone.tier],
      };

      return this.prioritizeTasksForUser(
        defaultTasks,
        competencyScores,
        usageAssessment,
        milestoneWithTargets
      );
    }
  }

  // ==========================================================================
  // SUPABASE OPERATIONS
  // ==========================================================================

  /**
   * Fetch filtered tasks from Supabase tasks_library
   */
  async fetchFilteredTasks(
    tableSource: string,
    milestone: Milestone,
    competencyScores: CompetencyScores
  ): Promise<Task[]> {
    try {
      const supabase = await createClient();

      // Build stage_milestone filter based on milestone tier
      const stageMilestones = this._getStageMilestonesForSource(tableSource, milestone.tier);

      // Query tasks_library table
      let query = supabase
        .from(SUPABASE_TABLES.tasksLibrary)
        .select('*')
        .eq('is_active', true)
        .in('stage_milestone', stageMilestones)
        .limit(10);

      // Optional: Filter by priority for users with low competencies
      const hasLowCompetencies = Object.values(competencyScores).some((score) => score < 60);
      if (hasLowCompetencies) {
        query = query.in('priority', ['critical', 'high']);
      }

      // Execute query
      const { data, error } = await query.order('priority', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        return [];
      }

      // Transform Supabase records to Task objects
      return (data || []).map((record) => this._transformSupabaseRecord(record));
    } catch (error) {
      console.error('Error fetching filtered tasks from Supabase:', error);
      return [];
    }
  }

  /**
   * Transform Supabase record to Task object
   */
  private _transformSupabaseRecord(record: any): Task {
    return {
      id: record.id,
      name: record.name || 'Unnamed Task',
      description: record.description || '',
      category: record.category || 'General',
      stageMilestone: record.stage_milestone || '',
      priority: record.priority as TaskPriority,
      revenueGoal: '', // Not stored in Supabase tasks_library
      competencyArea: record.competency_area || 'general',
      platformConnection: record.platform_connection || null,
      sourceTable: record.source_table || 'seed',
      estimatedTime: record.estimated_time || '30 min',
      businessImpact: record.business_impact || '',
      prerequisites: record.prerequisites || '',
      resources: Array.isArray(record.resources) ? record.resources : [],
      createdTime: record.created_at || new Date().toISOString(),
    };
  }

  /**
   * Save task progress to Supabase task_completions with cache invalidation
   */
  async saveTaskProgress(
    customerId: string,
    taskData: Task,
    completionData: TaskCompletionData
  ): Promise<any | null> {
    try {
      const supabase = await createClient();

      // Build competency gains JSONB object
      const competencyGains: Record<string, number> = {
        customerAnalysis: 0,
        valueCommunication: 0,
        executiveReadiness: 0,
      };

      if (taskData.competencyArea && taskData.competencyArea !== 'general') {
        competencyGains[taskData.competencyArea] = completionData.competencyGain || 0;
      }

      // Insert into task_completions table
      const { data, error } = await supabase
        .from(SUPABASE_TABLES.taskCompletions)
        .insert({
          user_id: customerId,
          task_id: taskData.id,
          competency_gains: competencyGains,
          notes: completionData.notes || '',
          completion_data: {
            toolUsed: completionData.toolUsed || 'none',
            competencyGain: completionData.competencyGain || 0,
          },
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        return null;
      }

      // Invalidate related cache entries
      // TaskCacheManager.invalidateCustomer(customerId);

      return data;
    } catch (error) {
      console.error('Error saving task progress to Supabase:', error);
      return null;
    }
  }

  // ==========================================================================
  // TASK PRIORITIZATION
  // ==========================================================================

  /**
   * Prioritize tasks for user based on competency gaps
   */
  prioritizeTasksForUser(
    tasks: Task[],
    competencyScores: CompetencyScores,
    usageAssessment: UsageAssessment | undefined,
    milestone: Milestone
  ): Task[] {
    return tasks
      .map((task) => {
        // Add competency mapping
        const competencyArea = this._mapTaskToCompetency(task.name);

        // Add platform tool connection
        const platformConnection = this._getToolRecommendation(task.name);

        // Calculate priority based on competency gap
        const calculatedPriority = this._calculateTaskPriority(task, competencyScores, milestone);

        // Use calculated priority if higher than existing
        const finalPriority = this._getHigherPriority(task.priority, calculatedPriority);

        return {
          ...task,
          competencyArea,
          platformConnection,
          priority: finalPriority,
          competencyGap: this._calculateCompetencyGap(competencyArea, competencyScores, milestone),
          relevanceScore: this._calculateRelevanceScore(task, competencyScores, usageAssessment),
        };
      })
      .sort((a, b) => {
        // Sort by priority first, then relevance score
        const priorityDiff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];

        if (priorityDiff !== 0) return priorityDiff;

        // Then by relevance score
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
      })
      .slice(0, 5); // Limit to top 5 recommendations
  }

  /**
   * Calculate competency gap for task
   */
  private _calculateCompetencyGap(
    competencyArea: CompetencyArea | 'general',
    competencyScores: CompetencyScores,
    milestone: Milestone
  ): number {
    if (competencyArea === 'general') return 0;

    const currentScore = competencyScores[competencyArea] || 50;
    const targetScore = milestone?.targets?.[competencyArea] || 70;

    return Math.max(0, targetScore - currentScore);
  }

  /**
   * Calculate relevance score based on usage patterns
   */
  private _calculateRelevanceScore(
    task: Task,
    competencyScores: CompetencyScores,
    usageAssessment?: UsageAssessment
  ): number {
    let score = 50; // Base score

    // Boost if competency area has low score
    const competencyGap = this._calculateCompetencyGap(
      task.competencyArea,
      competencyScores,
      { tier: 'foundation', targets: MILESTONE_TARGETS.foundation }
    );
    score += competencyGap * 2;

    // Boost if user has used related platform tool
    if (task.platformConnection && usageAssessment) {
      const toolUsage = this._getToolUsageScore(task.platformConnection.tool, usageAssessment);
      score += toolUsage;
    }

    // Boost for higher priority tasks
    const priorityBoost: Record<TaskPriority, number> = {
      critical: 20,
      high: 15,
      medium: 10,
      low: 5,
    };
    score += priorityBoost[task.priority] || 5;

    return Math.min(100, score);
  }

  // ==========================================================================
  // UPCOMING TASKS
  // ==========================================================================

  /**
   * Fetch upcoming tasks for next milestone with caching
   */
  async fetchUpcomingTasks(
    currentMilestone: Milestone,
    competencyScores: CompetencyScores
  ): Promise<Task[]> {
    try {
      // Try cache first
      const cacheKey = `upcoming_${currentMilestone.tier}`;
      // const cachedUpcoming = TaskCacheManager.getCachedUpcomingTasks(cacheKey);

      // if (cachedUpcoming) {
      //   console.log('TaskDataService: Using cached upcoming tasks');
      //   return cachedUpcoming;
      // }

      const nextMilestone = this._getNextMilestone(currentMilestone);
      if (!nextMilestone) return [];

      // Create milestone data for next tier
      const nextMilestoneData: Milestone = {
        ...nextMilestone,
        targets: MILESTONE_TARGETS[nextMilestone.tier],
      };

      const tasks = await this.fetchFilteredTasks(
        nextMilestoneData.taskTableSource || 'seed',
        nextMilestoneData,
        competencyScores
      );

      const upcomingTasks = tasks.slice(0, 2); // Limit to 2 preview tasks

      // Cache upcoming tasks
      // TaskCacheManager.cacheUpcomingTasks(cacheKey, upcomingTasks);

      return upcomingTasks;
    } catch (error) {
      console.error('Error fetching upcoming tasks:', error);
      return [];
    }
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  private _generateCacheKey(customerId: string, milestone: Milestone): string {
    return `${customerId}_${milestone.tier}_${JSON.stringify(milestone.milestoneCategories || [])}`;
  }

  /**
   * Get stage_milestone values for Supabase query based on source and tier
   */
  private _getStageMilestonesForSource(source: string, tier: MilestoneTier): string[] {
    // Map milestone tier to stage_milestone values in tasks_library
    const tierMap: Record<MilestoneTier, { seed: string[]; seriesA: string[] }> = {
      foundation: {
        seed: ['foundation-seed'],
        seriesA: ['foundation-series-a'],
      },
      growth: {
        seed: ['growth-seed'],
        seriesA: ['growth-series-a'],
      },
      expansion: {
        seed: ['expansion-seed'],
        seriesA: ['expansion-series-a'],
      },
    };

    const stages = tierMap[tier] || tierMap.foundation;

    switch (source) {
      case 'seed':
        return stages.seed;
      case 'series-a':
        return stages.seriesA;
      case 'both':
        return [...stages.seed, ...stages.seriesA];
      default:
        return stages.seed;
    }
  }

  private _getHigherPriority(priority1: TaskPriority, priority2: TaskPriority): TaskPriority {
    const score1 = PRIORITY_ORDER[priority1] || 2;
    const score2 = PRIORITY_ORDER[priority2] || 2;

    return score1 >= score2 ? priority1 : priority2;
  }

  private _getToolUsageScore(
    toolName: 'icp' | 'financial' | 'resources' | 'business-case',
    usageAssessment: UsageAssessment
  ): number {
    if (!usageAssessment || !usageAssessment.usage) return 0;

    const usage = usageAssessment.usage;

    switch (toolName) {
      case 'icp':
        return (usage.icpProgress || 0) / 5; // Convert percentage to 0-20 score
      case 'financial':
        return (usage.financialProgress || 0) / 5;
      case 'resources':
        return Math.min(20, (usage.resourcesAccessed || 0) * 2);
      default:
        return 0;
    }
  }

  private _getDefaultScores(): CompetencyScores {
    return {
      customerAnalysis: 50,
      valueCommunication: 50,
      executiveReadiness: 50,
    };
  }

  private _getNextMilestone(currentMilestone: Milestone): Milestone | null {
    const tierOrder: MilestoneTier[] = ['foundation', 'growth', 'expansion'];
    const currentIndex = tierOrder.indexOf(currentMilestone.tier);

    if (currentIndex === -1 || currentIndex >= tierOrder.length - 1) {
      return null; // Already at highest tier
    }

    return {
      tier: tierOrder[currentIndex + 1],
      taskTableSource: 'series-a',
    };
  }

  // ==========================================================================
  // PLACEHOLDER METHODS (to be replaced when other services are ready)
  // ==========================================================================

  private _getDefaultTasksForMilestone(tier: MilestoneTier): Task[] {
    // Temporary default tasks until Airtable tables are set up
    return [
      {
        id: 'task-1',
        name: 'Complete ICP Analysis',
        description: 'Define your ideal customer profile with our comprehensive framework',
        category: 'Customer Intelligence',
        stageMilestone: tier,
        priority: 'high',
        revenueGoal: '$1M-$5M ARR',
        competencyArea: 'customerAnalysis',
        platformConnection: {
          tool: 'icp',
          feature: 'ICP Analysis Tool',
          description: 'Use our platform to generate comprehensive ICP analysis',
        },
        sourceTable: 'default',
        estimatedTime: '45 min',
        businessImpact: 'Critical for targeting right customers',
        prerequisites: 'None',
        resources: [],
        createdTime: new Date().toISOString(),
      },
      {
        id: 'task-2',
        name: 'Calculate Cost of Inaction',
        description: 'Quantify the financial impact of not solving customer problems',
        category: 'Value Communication',
        stageMilestone: tier,
        priority: 'high',
        revenueGoal: '$1M-$5M ARR',
        competencyArea: 'valueCommunication',
        platformConnection: {
          tool: 'financial',
          feature: 'Cost Calculator',
          description: 'Generate ROI analysis and cost calculations',
        },
        sourceTable: 'default',
        estimatedTime: '30 min',
        businessImpact: 'Essential for value-based selling',
        prerequisites: 'ICP Analysis complete',
        resources: [],
        createdTime: new Date().toISOString(),
      },
      {
        id: 'task-3',
        name: 'Build Executive Summary',
        description: 'Create concise business case for C-level stakeholders',
        category: 'Executive Readiness',
        stageMilestone: tier,
        priority: 'medium',
        revenueGoal: '$1M-$5M ARR',
        competencyArea: 'executiveReadiness',
        platformConnection: {
          tool: 'business-case',
          feature: 'Business Case Builder',
          description: 'Generate professional business case documents',
        },
        sourceTable: 'default',
        estimatedTime: '60 min',
        businessImpact: 'Critical for closing enterprise deals',
        prerequisites: 'ICP and Cost Analysis complete',
        resources: [],
        createdTime: new Date().toISOString(),
      },
    ];
  }

  private _mapTaskToCompetency(taskName: string): CompetencyArea | 'general' {
    const taskNameLower = taskName.toLowerCase();

    if (taskNameLower.includes('icp') || taskNameLower.includes('customer') || taskNameLower.includes('persona')) {
      return 'customerAnalysis';
    }
    if (taskNameLower.includes('value') || taskNameLower.includes('roi') || taskNameLower.includes('cost')) {
      return 'valueCommunication';
    }
    if (taskNameLower.includes('executive') || taskNameLower.includes('business case') || taskNameLower.includes('c-level')) {
      return 'executiveReadiness';
    }

    return 'general';
  }

  private _getToolRecommendation(taskName: string): PlatformConnection | null {
    const taskNameLower = taskName.toLowerCase();

    if (taskNameLower.includes('icp') || taskNameLower.includes('customer profile')) {
      return {
        tool: 'icp',
        feature: 'ICP Analysis Tool',
        description: 'Use our platform to generate comprehensive ICP analysis',
      };
    }
    if (taskNameLower.includes('cost') || taskNameLower.includes('roi') || taskNameLower.includes('calculator')) {
      return {
        tool: 'financial',
        feature: 'Cost Calculator',
        description: 'Generate ROI analysis and cost calculations',
      };
    }
    if (taskNameLower.includes('business case') || taskNameLower.includes('executive summary')) {
      return {
        tool: 'business-case',
        feature: 'Business Case Builder',
        description: 'Generate professional business case documents',
      };
    }
    if (taskNameLower.includes('resource') || taskNameLower.includes('template')) {
      return {
        tool: 'resources',
        feature: 'Resources Library',
        description: 'Access templates and learning resources',
      };
    }

    return null;
  }

  private _calculateTaskPriority(
    task: Task,
    competencyScores: CompetencyScores,
    milestone: Milestone
  ): TaskPriority {
    const competencyGap = this._calculateCompetencyGap(
      task.competencyArea,
      competencyScores,
      milestone
    );

    // High priority if competency gap is large (>20 points)
    if (competencyGap > 20) return 'high';
    if (competencyGap > 10) return 'medium';

    return 'low';
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

const TaskDataService = new TaskDataServiceClass();
export default TaskDataService;
