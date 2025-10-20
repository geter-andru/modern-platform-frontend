'use server';

/**
 * TaskResourceMatcher.ts
 *
 * Maps completed tasks to relevant resource recommendations using multiple
 * strategies: task-driven recommendations, competency gap analysis, and
 * milestone-based progression. Provides intelligent resource suggestions
 * to guide professional development.
 *
 * @module TaskResourceMatcher
 * @version 2.0.0 (TypeScript Migration)
 */

import type { CompetencyArea, TaskPriority, MilestoneTier } from './TaskRecommendationEngine';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Priority levels for resource recommendations
 */
export type ResourcePriority = 'high' | 'medium' | 'low';

/**
 * Source of recommendation
 */
export type RecommendationSource =
  | 'task-completion'
  | 'task-progression'
  | 'competency-gap'
  | 'milestone-essential'
  | 'milestone-recommended'
  | 'milestone-advanced';

/**
 * Resource category types
 */
export type ResourceCategory = 'ICP Intelligence' | 'Value Communication' | 'Implementation';

/**
 * Competency level tiers
 */
export type CompetencyLevel = 'low' | 'medium' | 'high';

/**
 * Task-to-resource mapping
 */
export interface TaskResourceMapping {
  immediate: string[];
  nextLevel: string[];
  category: ResourceCategory;
}

/**
 * Resource recommendation
 */
export interface ResourceRecommendation {
  resourceId: string;
  reason: string;
  priority: ResourcePriority;
  category: ResourceCategory;
  source: RecommendationSource;
  competencyArea?: CompetencyArea;
  currentScore?: number;
}

/**
 * Completed task structure
 */
export interface CompletedTask {
  id: string;
  name?: string;
  taskName?: string;
  completedAt?: number;
  competencyArea?: CompetencyArea;
}

/**
 * Customer data for recommendations
 */
export interface CustomerData {
  customerId: string;
  competencyScores?: Record<CompetencyArea, number>;
  milestone?: {
    tier: MilestoneTier;
    stage: string;
  };
}

/**
 * Usage assessment data
 */
export interface UsageAssessment {
  usage?: {
    icpProgress?: number;
    financialProgress?: number;
    resourcesAccessed?: number;
  };
}

/**
 * Milestone resource flow structure
 */
export interface MilestoneResourceFlow {
  essential: string[];
  recommended: string[];
  advanced: string[];
}

// ============================================================================
// TASK-TO-RESOURCE MAPPING RULES
// ============================================================================

const TASK_RESOURCE_MAP: Record<string, TaskResourceMapping> = {
  // Customer Analysis Tasks
  'Define Ideal Customer Profile': {
    immediate: ['icp-basics-1', 'icp-basics-3'],
    nextLevel: ['icp-growth-1', 'icp-expansion-1'],
    category: 'ICP Intelligence'
  },
  'Conduct Customer Discovery Research': {
    immediate: ['icp-basics-3', 'icp-basics-2'],
    nextLevel: ['icp-growth-2'],
    category: 'ICP Intelligence'
  },
  'Map Customer Journey': {
    immediate: ['icp-basics-1', 'value-basics-1'],
    nextLevel: ['value-growth-1'],
    category: 'Value Communication'
  },

  // Value Communication Tasks
  'Calculate Technical ROI': {
    immediate: ['value-basics-1', 'value-basics-2'],
    nextLevel: ['value-growth-2', 'value-expansion-1'],
    category: 'Value Communication'
  },
  'Build Financial Business Case': {
    immediate: ['value-basics-1', 'impl-basics-1'],
    nextLevel: ['value-growth-1', 'value-expansion-2'],
    category: 'Value Communication'
  },
  'Create Stakeholder Value Maps': {
    immediate: ['value-basics-2'],
    nextLevel: ['value-growth-1', 'icp-growth-1'],
    category: 'Value Communication'
  },

  // Executive Readiness Tasks
  'Develop Executive Presentations': {
    immediate: ['value-basics-2'],
    nextLevel: ['value-expansion-1', 'value-growth-1'],
    category: 'Value Communication'
  },
  'Create Scalable Processes': {
    immediate: ['impl-basics-1'],
    nextLevel: ['impl-growth-1', 'impl-expansion-1'],
    category: 'Implementation'
  },
  'Build Team Training Materials': {
    immediate: ['impl-basics-1'],
    nextLevel: ['impl-growth-1'],
    category: 'Implementation'
  },

  // General Business Development
  'Systematic Customer Analysis': {
    immediate: ['icp-basics-1', 'icp-basics-3'],
    nextLevel: ['icp-growth-1'],
    category: 'ICP Intelligence'
  },
  'Revenue Process Optimization': {
    immediate: ['value-basics-1', 'impl-basics-1'],
    nextLevel: ['value-growth-2', 'impl-growth-1'],
    category: 'Implementation'
  }
};

// ============================================================================
// COMPETENCY-BASED RESOURCE RECOMMENDATIONS
// ============================================================================

const COMPETENCY_RESOURCE_MAP: Record<CompetencyArea, Record<CompetencyLevel, string[]>> = {
  customerAnalysis: {
    low: ['icp-basics-1', 'icp-basics-3', 'icp-basics-2'],
    medium: ['icp-growth-1', 'icp-growth-2'],
    high: ['icp-expansion-1']
  },
  valueCommunication: {
    low: ['value-basics-1', 'value-basics-2'],
    medium: ['value-growth-1', 'value-growth-2'],
    high: ['value-expansion-1', 'value-expansion-2']
  },
  executiveReadiness: {
    low: ['impl-basics-1', 'value-basics-2'],
    medium: ['impl-growth-1', 'value-growth-1'],
    high: ['impl-expansion-1', 'value-expansion-1']
  }
};

// ============================================================================
// MILESTONE-BASED RESOURCE PROGRESSION
// ============================================================================

const MILESTONE_RESOURCE_FLOW: Record<MilestoneTier, MilestoneResourceFlow> = {
  foundation: {
    essential: ['icp-basics-1', 'value-basics-1', 'impl-basics-1'],
    recommended: ['icp-basics-2', 'icp-basics-3', 'value-basics-2'],
    advanced: ['icp-growth-1', 'value-growth-1']
  },
  growth: {
    essential: ['icp-growth-1', 'value-growth-1', 'impl-growth-1'],
    recommended: ['icp-growth-2', 'value-growth-2'],
    advanced: ['icp-expansion-1', 'value-expansion-1']
  },
  expansion: {
    essential: ['icp-expansion-1', 'value-expansion-1', 'impl-expansion-1'],
    recommended: ['value-expansion-2'],
    advanced: []
  },
  'market-leader': {
    essential: ['value-expansion-2', 'impl-expansion-1'],
    recommended: [],
    advanced: []
  }
};

// ============================================================================
// SERVICE CLASS
// ============================================================================

/**
 * TaskResourceMatcher - Singleton service for resource matching
 */
class TaskResourceMatcherService {
  private static instance: TaskResourceMatcherService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): TaskResourceMatcherService {
    if (!TaskResourceMatcherService.instance) {
      TaskResourceMatcherService.instance = new TaskResourceMatcherService();
    }
    return TaskResourceMatcherService.instance;
  }

  // ==========================================================================
  // PUBLIC RECOMMENDATION METHODS
  // ==========================================================================

  /**
   * Get unified smart recommendations from all sources
   */
  public getSmartRecommendations(
    completedTasks: CompletedTask[],
    customerData: CustomerData,
    usageAssessment: UsageAssessment
  ): ResourceRecommendation[] {
    const allRecommendations: ResourceRecommendation[] = [];

    // Task-driven recommendations
    const taskRecs = this.getTaskDrivenRecommendations(
      completedTasks,
      customerData,
      usageAssessment
    );
    allRecommendations.push(...taskRecs);

    // Competency gap recommendations
    if (customerData.competencyScores) {
      const competencyRecs = this.getCompetencyGapRecommendations(
        customerData.competencyScores,
        customerData.milestone
      );
      allRecommendations.push(...competencyRecs);
    }

    // Milestone-based recommendations
    if (customerData.milestone) {
      const milestoneRecs = this.getMilestoneRecommendations(
        customerData.milestone,
        completedTasks.length
      );
      allRecommendations.push(...milestoneRecs);
    }

    // Deduplicate and prioritize
    return this.deduplicateAndPrioritize(allRecommendations);
  }

  /**
   * Get resource recommendations based on completed tasks
   */
  public getTaskDrivenRecommendations(
    completedTasks: CompletedTask[],
    customerData: CustomerData,
    usageAssessment: UsageAssessment
  ): ResourceRecommendation[] {
    // Defensive guard: Ensure completedTasks is a valid array
    if (!Array.isArray(completedTasks)) {
      console.warn('⚠️ getTaskDrivenRecommendations received non-array completedTasks:', completedTasks);
      return [];
    }

    const recommendations: ResourceRecommendation[] = [];
    const completedTaskNames = completedTasks.map(
      task => task.name || task.taskName || ''
    );

    // Find immediate resource needs based on completed tasks
    completedTaskNames.forEach(taskName => {
      const mapping = this.findTaskMapping(taskName);
      if (mapping) {
        // Add immediate resources - with array guard
        if (Array.isArray(mapping.immediate)) {
          mapping.immediate.forEach(resourceId => {
            recommendations.push({
              resourceId,
              reason: `Follow-up to "${taskName}"`,
              priority: 'high',
              category: mapping.category,
              source: 'task-completion'
            });
          });
        }

        // Add next-level resources if user is advanced - with array guard
        if (this.isAdvancedUser(customerData, usageAssessment) && Array.isArray(mapping.nextLevel)) {
          mapping.nextLevel.forEach(resourceId => {
            recommendations.push({
              resourceId,
              reason: `Advanced implementation for "${taskName}"`,
              priority: 'medium',
              category: mapping.category,
              source: 'task-progression'
            });
          });
        }
      }
    });

    return recommendations;
  }

  /**
   * Get recommendations based on competency gaps
   */
  public getCompetencyGapRecommendations(
    competencyScores: Record<CompetencyArea, number>,
    milestone?: { tier: MilestoneTier; stage: string }
  ): ResourceRecommendation[] {
    const recommendations: ResourceRecommendation[] = [];

    Object.entries(competencyScores).forEach(([competency, score]) => {
      const competencyArea = competency as CompetencyArea;
      const level = this.getCompetencyLevel(score);
      const resourceMap = COMPETENCY_RESOURCE_MAP[competencyArea];

      // Defensive guard: Ensure resourceMap[level] is an array
      if (resourceMap && Array.isArray(resourceMap[level])) {
        resourceMap[level].forEach(resourceId => {
          recommendations.push({
            resourceId,
            reason: `Improve ${competencyArea} competency (current: ${score}%)`,
            priority: score < 50 ? 'high' : 'medium',
            category: this.getResourceCategory(competencyArea),
            source: 'competency-gap',
            competencyArea,
            currentScore: score
          });
        });
      }
    });

    return recommendations;
  }

  /**
   * Get recommendations based on milestone stage
   */
  public getMilestoneRecommendations(
    milestone: { tier: MilestoneTier; stage: string },
    completedTasksCount: number = 0
  ): ResourceRecommendation[] {
    const recommendations: ResourceRecommendation[] = [];
    const tierResources = MILESTONE_RESOURCE_FLOW[milestone.tier];

    if (!tierResources) return recommendations;

    // Essential resources (always recommend) - with array guard
    if (Array.isArray(tierResources.essential)) {
      tierResources.essential.forEach(resourceId => {
        recommendations.push({
          resourceId,
          reason: `Essential for ${milestone.tier} stage`,
          priority: 'high',
          category: this.getResourceCategoryFromId(resourceId),
          source: 'milestone-essential'
        });
      });
    }

    // Recommended resources (if user has completed some tasks) - with array guard
    if (completedTasksCount > 2 && Array.isArray(tierResources.recommended)) {
      tierResources.recommended.forEach(resourceId => {
        recommendations.push({
          resourceId,
          reason: `Recommended for ${milestone.tier} stage progression`,
          priority: 'medium',
          category: this.getResourceCategoryFromId(resourceId),
          source: 'milestone-recommended'
        });
      });
    }

    // Advanced resources (if user is progressing well) - with array guard
    if (completedTasksCount > 5 && Array.isArray(tierResources.advanced)) {
      tierResources.advanced.forEach(resourceId => {
        recommendations.push({
          resourceId,
          reason: `Advanced ${milestone.tier} stage capabilities`,
          priority: 'low',
          category: this.getResourceCategoryFromId(resourceId),
          source: 'milestone-advanced'
        });
      });
    }

    return recommendations;
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  /**
   * Find task mapping by partial name match
   */
  private findTaskMapping(taskName: string): TaskResourceMapping | null {
    // Direct match first
    if (TASK_RESOURCE_MAP[taskName]) {
      return TASK_RESOURCE_MAP[taskName];
    }

    // Partial match
    const lowerTaskName = taskName.toLowerCase();
    for (const [mappedTaskName, mapping] of Object.entries(TASK_RESOURCE_MAP)) {
      if (
        lowerTaskName.includes(mappedTaskName.toLowerCase()) ||
        mappedTaskName.toLowerCase().includes(lowerTaskName)
      ) {
        return mapping;
      }
    }

    return null;
  }

  /**
   * Determine if user is advanced based on usage patterns
   */
  private isAdvancedUser(
    customerData: CustomerData,
    usageAssessment: UsageAssessment
  ): boolean {
    const usage = usageAssessment?.usage || {};
    const totalProgress = (usage.icpProgress || 0) + (usage.financialProgress || 0);
    const resourcesAccessed = usage.resourcesAccessed || 0;

    const avgCompetency = customerData.competencyScores
      ? Object.values(customerData.competencyScores).reduce((sum, score) => sum + score, 0) / 3
      : 0;

    return totalProgress > 100 || resourcesAccessed > 10 || avgCompetency > 70;
  }

  /**
   * Get competency level from score
   */
  private getCompetencyLevel(score: number): CompetencyLevel {
    if (score < 50) return 'low';
    if (score < 75) return 'medium';
    return 'high';
  }

  /**
   * Get resource category from competency area
   */
  private getResourceCategory(competencyArea: CompetencyArea): ResourceCategory {
    const categoryMap: Record<CompetencyArea, ResourceCategory> = {
      customerAnalysis: 'ICP Intelligence',
      valueCommunication: 'Value Communication',
      executiveReadiness: 'Implementation'
    };
    return categoryMap[competencyArea] || 'Implementation';
  }

  /**
   * Get resource category from resource ID
   */
  private getResourceCategoryFromId(resourceId: string): ResourceCategory {
    if (resourceId.includes('icp-')) return 'ICP Intelligence';
    if (resourceId.includes('value-')) return 'Value Communication';
    if (resourceId.includes('impl-')) return 'Implementation';
    return 'Implementation';
  }

  /**
   * Deduplicate and prioritize recommendations
   */
  private deduplicateAndPrioritize(
    recommendations: ResourceRecommendation[]
  ): ResourceRecommendation[] {
    // Remove duplicates by resourceId
    const uniqueRecs = recommendations.reduce((acc: ResourceRecommendation[], rec) => {
      if (!acc.find(existing => existing.resourceId === rec.resourceId)) {
        acc.push(rec);
      }
      return acc;
    }, []);

    // Sort by priority and source
    const priorityOrder: Record<ResourcePriority, number> = { high: 3, medium: 2, low: 1 };
    const sourceOrder: Record<RecommendationSource, number> = {
      'task-completion': 4,
      'competency-gap': 3,
      'milestone-essential': 2,
      'milestone-recommended': 1,
      'task-progression': 1,
      'milestone-advanced': 0
    };

    return uniqueRecs
      .sort((a, b) => {
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;

        return sourceOrder[b.source] - sourceOrder[a.source];
      })
      .slice(0, 8); // Limit to top 8 recommendations
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const TaskResourceMatcher = TaskResourceMatcherService.getInstance();
export default TaskResourceMatcher;
