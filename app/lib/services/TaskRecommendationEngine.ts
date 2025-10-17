'use server';

/**
 * TaskRecommendationEngine.ts
 *
 * AI-powered task recommendation engine that maps tasks to competencies,
 * platform tools, and milestone progression. Uses competency gap analysis
 * to prioritize recommendations and guide professional development.
 *
 * @module TaskRecommendationEngine
 * @version 2.0.0 (TypeScript Migration)
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type CompetencyArea = 'customerAnalysis' | 'valueCommunication' | 'executiveReadiness';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type PlatformTool = 'icp' | 'financial' | 'resources' | null;
export type MilestoneTier = 'foundation' | 'growth' | 'expansion' | 'market-leader';
export type BusinessStage = 'pre-seed' | 'seed' | 'seed-to-series-a' | 'series-a' | 'series-b-plus';
export type TaskTableSource = 'seed' | 'series-a' | 'both';

/**
 * Business metrics used for milestone detection
 */
export interface BusinessMetrics {
  mrr?: number;
  arr?: number;
  stage?: string;
  teamSize?: number;
}

/**
 * Competency scores for all three areas
 */
export interface CompetencyScores {
  customerAnalysis: number;
  valueCommunication: number;
  executiveReadiness: number;
}

/**
 * Competency targets for current milestone
 */
export interface CompetencyTargets {
  customerAnalysis: number;
  valueCommunication: number;
  executiveReadiness: number;
}

/**
 * Platform tool recommendation with connection details
 */
export interface ToolRecommendation {
  tool: PlatformTool;
  toolName: string;
  connection: string;
  action: string;
}

/**
 * Milestone data with targets and context
 */
export interface MilestoneData {
  tier: MilestoneTier;
  stage: BusinessStage;
  milestoneCategories: string[];
  revenueRange: string;
  taskTableSource: TaskTableSource;
  context: string;
  targets: CompetencyTargets;
  priority: string[];
  focus: string;
  timeframe: string;
}

/**
 * Default task structure
 */
export interface DefaultTask {
  id: string;
  name: string;
  category: string;
  priority: TaskPriority;
  competencyArea: CompetencyArea | 'general';
}

/**
 * Task with competency area
 */
export interface Task {
  id: string;
  name: string;
  description?: string;
  category?: string;
  priority?: TaskPriority;
  competencyArea?: CompetencyArea | 'general';
  toolConnection?: any;
}

// ============================================================================
// TASK-TO-COMPETENCY MAPPING
// ============================================================================

/**
 * Maps task names to their primary competency area
 */
const TASK_COMPETENCY_MAP: Record<string, CompetencyArea | 'general'> = {
  // Customer Analysis competency
  'Gather and analyze customer feedback to refine the product': 'customerAnalysis',
  'Define Ideal Customer Profile (ICP)': 'customerAnalysis',
  'Refine understanding of target customers to focus sales efforts': 'customerAnalysis',
  'Build a Customer Success Team': 'customerAnalysis',
  'Conduct customer interviews to validate product-market fit': 'customerAnalysis',
  'Analyze user behavior and usage patterns': 'customerAnalysis',
  'Segment customers by value and usage': 'customerAnalysis',
  'Create detailed buyer personas': 'customerAnalysis',
  'Map customer journey and touchpoints': 'customerAnalysis',
  'Implement customer feedback loops': 'customerAnalysis',

  // Value Communication competency
  'Build a repeatable sales process': 'valueCommunication',
  'Start building a sales pipeline and closing deals': 'valueCommunication',
  'Develop a compelling sales pitch and messaging': 'valueCommunication',
  'Implement sales automation and CRM tools to improve efficiency': 'valueCommunication',
  'Optimize Pricing & Packaging': 'valueCommunication',
  'Create value proposition documentation': 'valueCommunication',
  'Develop competitive positioning materials': 'valueCommunication',
  'Build ROI calculators for prospects': 'valueCommunication',
  'Create sales enablement materials': 'valueCommunication',
  'Implement lead qualification framework': 'valueCommunication',
  'Design demo and presentation materials': 'valueCommunication',

  // Executive Readiness competency
  'Hire a dedicated sales leader to build and manage the team': 'executiveReadiness',
  'Implement a sales training program and provide ongoing coaching': 'executiveReadiness',
  'Prepare for Series A funding by demonstrating strong growth': 'executiveReadiness',
  'Expand Sales Team & Channels': 'executiveReadiness',
  'Develop Strategic Partnerships': 'executiveReadiness',
  'Build board reporting and metrics dashboard': 'executiveReadiness',
  'Create investor updates and communication': 'executiveReadiness',
  'Establish executive team structure': 'executiveReadiness',
  'Develop strategic planning processes': 'executiveReadiness',
  'Implement OKRs and performance management': 'executiveReadiness',
  'Create market expansion strategy': 'executiveReadiness'
};

// ============================================================================
// TASK-TO-PLATFORM-TOOL CONNECTIONS
// ============================================================================

/**
 * Maps tasks to platform tool recommendations
 */
const TASK_TOOL_MAP: Record<string, ToolRecommendation> = {
  // ICP Analysis Tool connections
  'Gather and analyze customer feedback to refine the product': {
    tool: 'icp',
    toolName: 'ICP Analysis',
    connection: 'Use ICP Analysis to understand buyer feedback patterns systematically',
    action: 'Analyze feedback data to refine buyer personas'
  },
  'Define Ideal Customer Profile (ICP)': {
    tool: 'icp',
    toolName: 'ICP Analysis',
    connection: 'Direct platform tool usage - core ICP development capability',
    action: 'Build systematic buyer targeting framework'
  },
  'Refine understanding of target customers to focus sales efforts': {
    tool: 'icp',
    toolName: 'ICP Analysis',
    connection: 'Use ICP rating system to prioritize prospect outreach',
    action: 'Rate prospects using systematic scoring framework'
  },
  'Create detailed buyer personas': {
    tool: 'icp',
    toolName: 'ICP Analysis',
    connection: 'Build comprehensive buyer persona documentation',
    action: 'Use persona templates and stakeholder mapping'
  },
  'Segment customers by value and usage': {
    tool: 'icp',
    toolName: 'ICP Analysis',
    connection: 'Apply systematic customer segmentation framework',
    action: 'Use ICP scoring to segment customer base'
  },

  // Financial Impact Builder connections
  'Build a repeatable sales process': {
    tool: 'financial',
    toolName: 'Financial Impact Builder',
    connection: 'Use Cost Calculator to quantify value in systematic sales process',
    action: 'Create ROI models for consistent value communication'
  },
  'Start building a sales pipeline and closing deals': {
    tool: 'financial',
    toolName: 'Financial Impact Builder',
    connection: 'Use Business Case Builder to close deals with financial justification',
    action: 'Generate stakeholder-specific business cases'
  },
  'Implement sales automation and CRM tools': {
    tool: 'financial',
    toolName: 'Financial Impact Builder',
    connection: 'Export financial models for CRM ROI justification',
    action: 'Build business case for sales automation investment'
  },
  'Optimize Pricing & Packaging': {
    tool: 'financial',
    toolName: 'Financial Impact Builder',
    connection: 'Model pricing impact on customer ROI and business outcomes',
    action: 'Calculate optimal pricing for value delivery'
  },
  'Build ROI calculators for prospects': {
    tool: 'financial',
    toolName: 'Financial Impact Builder',
    connection: 'Create prospect-facing ROI calculation templates',
    action: 'Export financial models for prospect use'
  },
  'Create value proposition documentation': {
    tool: 'financial',
    toolName: 'Financial Impact Builder',
    connection: 'Quantify value propositions with financial modeling',
    action: 'Build measurable value proposition framework'
  },

  // Resource Library connections
  'Hire a dedicated sales leader to build and manage the team': {
    tool: 'resources',
    toolName: 'Resource Library',
    connection: 'Access hiring frameworks and sales leader onboarding guides',
    action: 'Use systematic hiring templates and role definitions'
  },
  'Implement a sales training program and provide ongoing coaching': {
    tool: 'resources',
    toolName: 'Resource Library',
    connection: 'Use systematic training materials and competency frameworks',
    action: 'Access training curricula and competency assessments'
  },
  'Develop Strategic Partnerships': {
    tool: 'resources',
    toolName: 'Resource Library',
    connection: 'Access partnership frameworks and negotiation templates',
    action: 'Use partnership development resources'
  },
  'Create sales enablement materials': {
    tool: 'resources',
    toolName: 'Resource Library',
    connection: 'Access templates for sales materials and presentations',
    action: 'Use proven sales enablement frameworks'
  },
  'Establish executive team structure': {
    tool: 'resources',
    toolName: 'Resource Library',
    connection: 'Access organizational design and leadership frameworks',
    action: 'Use executive team building resources'
  }
};

// ============================================================================
// MILESTONE PROGRESSION DATA
// ============================================================================

/**
 * Defines next milestone for each tier
 */
const MILESTONE_PROGRESSION: Record<MilestoneTier, MilestoneData | null> = {
  foundation: {
    tier: 'growth',
    stage: 'seed-to-series-a',
    milestoneCategories: ['Scalability/Revenue', 'User Base', 'Scaling Product'],
    revenueRange: '$100K - $500K+ MRR',
    taskTableSource: 'both',
    context: 'Scaling systematic processes for Series A readiness',
    targets: { customerAnalysis: 85, valueCommunication: 80, executiveReadiness: 75 },
    priority: ['Value Communication', 'Executive Readiness', 'Customer Analysis'],
    focus: 'Optimize revenue processes for scale and team training',
    timeframe: '6-12 months'
  },
  growth: {
    tier: 'expansion',
    stage: 'series-a',
    milestoneCategories: ['Revenue Growth', 'Market Penetration'],
    revenueRange: '$1M+ ARR',
    taskTableSource: 'series-a',
    context: 'Systematic enterprise sales and market leadership',
    targets: { customerAnalysis: 90, valueCommunication: 90, executiveReadiness: 85 },
    priority: ['Executive Readiness', 'Strategic Intelligence', 'Competitive Mastery'],
    focus: 'Advanced revenue intelligence for market expansion',
    timeframe: '12-18 months'
  },
  expansion: {
    tier: 'market-leader',
    stage: 'series-b-plus',
    milestoneCategories: ['Market Leadership', 'Strategic Expansion'],
    revenueRange: '$10M+ ARR',
    taskTableSource: 'series-a',
    context: 'Market leadership and strategic expansion',
    targets: { customerAnalysis: 95, valueCommunication: 95, executiveReadiness: 90 },
    priority: ['Market Leadership', 'Strategic Expansion', 'Competitive Dominance'],
    focus: 'Market leadership and strategic expansion',
    timeframe: '18-24 months'
  },
  'market-leader': null
};

// ============================================================================
// DEFAULT TASKS BY MILESTONE
// ============================================================================

/**
 * Default tasks to show when no Airtable data available
 */
const DEFAULT_TASKS: Record<MilestoneTier, DefaultTask[]> = {
  foundation: [
    {
      id: 'default-f1',
      name: 'Define Ideal Customer Profile (ICP)',
      category: 'Initial PMF (Product-Market Fit)',
      priority: 'high',
      competencyArea: 'customerAnalysis'
    },
    {
      id: 'default-f2',
      name: 'Build a repeatable sales process',
      category: 'Key Hires',
      priority: 'high',
      competencyArea: 'valueCommunication'
    },
    {
      id: 'default-f3',
      name: 'Create value proposition documentation',
      category: 'Initial PMF (Product-Market Fit)',
      priority: 'medium',
      competencyArea: 'valueCommunication'
    }
  ],
  growth: [
    {
      id: 'default-g1',
      name: 'Implement sales automation and CRM tools to improve efficiency',
      category: 'Scalability/Revenue',
      priority: 'critical',
      competencyArea: 'valueCommunication'
    },
    {
      id: 'default-g2',
      name: 'Hire a dedicated sales leader to build and manage the team',
      category: 'Scaling Product',
      priority: 'high',
      competencyArea: 'executiveReadiness'
    },
    {
      id: 'default-g3',
      name: 'Analyze user behavior and usage patterns',
      category: 'User Base',
      priority: 'medium',
      competencyArea: 'customerAnalysis'
    }
  ],
  expansion: [
    {
      id: 'default-e1',
      name: 'Develop Strategic Partnerships',
      category: 'Market Penetration',
      priority: 'critical',
      competencyArea: 'executiveReadiness'
    },
    {
      id: 'default-e2',
      name: 'Prepare for Series A funding by demonstrating strong growth',
      category: 'Revenue Growth',
      priority: 'high',
      competencyArea: 'executiveReadiness'
    },
    {
      id: 'default-e3',
      name: 'Create market expansion strategy',
      category: 'Market Penetration',
      priority: 'medium',
      competencyArea: 'executiveReadiness'
    }
  ],
  'market-leader': [
    {
      id: 'default-ml1',
      name: 'Expand to international markets',
      category: 'Market Leadership',
      priority: 'critical',
      competencyArea: 'executiveReadiness'
    },
    {
      id: 'default-ml2',
      name: 'Build strategic M&A pipeline',
      category: 'Strategic Expansion',
      priority: 'high',
      competencyArea: 'executiveReadiness'
    },
    {
      id: 'default-ml3',
      name: 'Develop thought leadership program',
      category: 'Market Leadership',
      priority: 'medium',
      competencyArea: 'customerAnalysis'
    }
  ]
};

// ============================================================================
// SERVICE CLASS
// ============================================================================

/**
 * TaskRecommendationEngine - Singleton service for task recommendations
 */
class TaskRecommendationEngineService {
  private static instance: TaskRecommendationEngineService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): TaskRecommendationEngineService {
    if (!TaskRecommendationEngineService.instance) {
      TaskRecommendationEngineService.instance = new TaskRecommendationEngineService();
    }
    return TaskRecommendationEngineService.instance;
  }

  // ==========================================================================
  // PUBLIC METHODS
  // ==========================================================================

  /**
   * Map task name to primary competency area
   */
  public mapTaskToCompetency(taskName: string): CompetencyArea | 'general' {
    return TASK_COMPETENCY_MAP[taskName] || 'general';
  }

  /**
   * Get platform tool recommendation for task
   */
  public getToolRecommendation(taskName: string): ToolRecommendation | null {
    return TASK_TOOL_MAP[taskName] || null;
  }

  /**
   * Detect current milestone based on business metrics
   */
  public detectMilestoneWithTasks(businessMetrics: BusinessMetrics): MilestoneData {
    const { mrr = 0, arr = 0, teamSize = 1 } = businessMetrics;

    // Convert ARR to MRR if only ARR provided
    const monthlyRevenue = mrr || (arr / 12);

    // Foundation Building: Initial PMF + Key Hires ($10K-$100K MRR)
    if (monthlyRevenue >= 10000 && monthlyRevenue <= 100000) {
      return {
        tier: 'foundation',
        stage: 'seed',
        milestoneCategories: ['Initial PMF (Product-Market Fit)', 'Key Hires'],
        revenueRange: '$10K - $100K MRR',
        taskTableSource: 'seed',
        context: 'Building systematic foundations for scalable PMF validation',
        targets: { customerAnalysis: 70, valueCommunication: 65, executiveReadiness: 50 },
        priority: ['Customer Analysis', 'Value Communication', 'Executive Readiness'],
        focus: 'Establish systematic buyer understanding and value communication',
        timeframe: '3-6 months'
      };
    }

    // Growth Scaling: Scalability + User Base + Early Series A ($100K-$500K MRR)
    if (monthlyRevenue >= 100000 && monthlyRevenue <= 500000) {
      return {
        tier: 'growth',
        stage: 'seed-to-series-a',
        milestoneCategories: ['Scalability/Revenue', 'User Base', 'Scaling Product'],
        revenueRange: '$100K - $500K+ MRR',
        taskTableSource: 'both',
        context: 'Scaling systematic processes for Series A readiness',
        targets: { customerAnalysis: 85, valueCommunication: 80, executiveReadiness: 75 },
        priority: ['Value Communication', 'Executive Readiness', 'Customer Analysis'],
        focus: 'Optimize revenue processes for scale and team training',
        timeframe: '6-12 months'
      };
    }

    // Market Expansion: Series A Revenue Growth + Market Penetration ($1M+ ARR)
    if (arr >= 1000000 || monthlyRevenue >= 83333) {
      return {
        tier: 'expansion',
        stage: 'series-a',
        milestoneCategories: ['Revenue Growth', 'Market Penetration'],
        revenueRange: '$1M+ ARR',
        taskTableSource: 'series-a',
        context: 'Systematic enterprise sales and market leadership',
        targets: { customerAnalysis: 90, valueCommunication: 90, executiveReadiness: 85 },
        priority: ['Executive Readiness', 'Strategic Intelligence', 'Competitive Mastery'],
        focus: 'Advanced revenue intelligence for market expansion',
        timeframe: '12-18 months'
      };
    }

    // Default to foundation if below thresholds
    return {
      tier: 'foundation',
      stage: 'pre-seed',
      milestoneCategories: ['Product Launch', 'Initial Traction'],
      revenueRange: 'Pre-$10K MRR',
      taskTableSource: 'seed',
      context: 'Building systematic foundations for initial market traction',
      targets: { customerAnalysis: 60, valueCommunication: 55, executiveReadiness: 40 },
      priority: ['Customer Analysis', 'Value Communication'],
      focus: 'Establish basic buyer understanding and product-market fit',
      timeframe: '3-6 months'
    };
  }

  /**
   * Calculate task priority based on competency gaps
   */
  public calculateTaskPriority(
    task: Task,
    competencyScores: CompetencyScores,
    milestoneData: MilestoneData
  ): TaskPriority {
    const taskCompetency = this.mapTaskToCompetency(task.name);
    const competencyScore = taskCompetency === 'general' ? 50 : competencyScores[taskCompetency];
    const milestoneTarget = taskCompetency === 'general' ? 70 : milestoneData.targets[taskCompetency];

    const gap = Math.max(0, milestoneTarget - competencyScore);

    // Priority calculation based on competency gap
    if (gap > 30) return 'critical';
    if (gap > 15) return 'high';
    if (gap > 5) return 'medium';
    return 'low';
  }

  /**
   * Get next milestone preview
   */
  public getNextMilestone(currentTier: MilestoneTier): MilestoneData | null {
    return MILESTONE_PROGRESSION[currentTier];
  }

  /**
   * Get default tasks for milestone tier (fallback when no Airtable data)
   */
  public getDefaultTasksForMilestone(milestoneTier: MilestoneTier): DefaultTask[] {
    return DEFAULT_TASKS[milestoneTier] || DEFAULT_TASKS.foundation;
  }

  /**
   * Calculate competency gap for specific area
   */
  public calculateCompetencyGap(
    competencyArea: CompetencyArea,
    currentScore: number,
    milestoneData: MilestoneData
  ): number {
    const target = milestoneData.targets[competencyArea];
    return Math.max(0, target - currentScore);
  }

  /**
   * Get recommended tasks based on competency gaps
   */
  public getRecommendedTasks(
    competencyScores: CompetencyScores,
    milestoneData: MilestoneData,
    limit: number = 5
  ): DefaultTask[] {
    const allTasks = this.getDefaultTasksForMilestone(milestoneData.tier);

    // Calculate gap for each task and sort by priority
    const tasksWithGaps = allTasks.map(task => {
      const competencyArea = task.competencyArea === 'general'
        ? null
        : task.competencyArea;

      const gap = competencyArea
        ? this.calculateCompetencyGap(competencyArea, competencyScores[competencyArea], milestoneData)
        : 0;

      return { ...task, gap };
    });

    // Sort by gap (highest first) and return top N
    return tasksWithGaps
      .sort((a, b) => b.gap - a.gap)
      .slice(0, limit);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const TaskRecommendationEngine = TaskRecommendationEngineService.getInstance();
export default TaskRecommendationEngine;
