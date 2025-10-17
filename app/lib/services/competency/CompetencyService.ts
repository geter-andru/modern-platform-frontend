/**
 * Competency Service
 *
 * Manages user competency tracking, progression, and tool unlocking.
 * Integrates with Supabase competency_data table and leverages PostgreSQL triggers.
 *
 * Architecture:
 * - 6 competency levels: foundation → developing → intermediate → advanced → expert → master
 * - 3 competency areas: customer_analysis, value_communication, sales_execution
 * - Point-based progression (0-1000+ points)
 * - Auto-unlocking tools based on competency scores
 * - Real-time updates via Supabase subscriptions
 */

import { createClient } from '@supabase/supabase-js';

// ==================== TYPES & INTERFACES ====================

export type CompetencyLevel = 'foundation' | 'developing' | 'intermediate' | 'advanced' | 'expert' | 'master';

export type CompetencyCategory = 'customerAnalysis' | 'valueCommunication' | 'salesExecution';

export interface CompetencyData {
  id: string;
  user_id: string;
  customer_analysis: number;  // 0-100
  value_communication: number; // 0-100
  sales_execution: number;     // 0-100
  overall_score: number;       // 0-100 (auto-calculated)
  total_points: number;        // 0-1000+
  current_level: CompetencyLevel;
  level_progress: number;      // 0-100% to next level

  // Baseline scores for growth tracking
  baseline_customer_analysis: number | null;
  baseline_value_communication: number | null;
  baseline_sales_execution: number | null;

  // Tool unlock states (auto-calculated)
  cost_calculator_unlocked: boolean;
  business_case_unlocked: boolean;
  resources_unlocked: boolean;
  export_unlocked: boolean;

  // Metadata
  level_history: LevelChange[];
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface LevelChange {
  from_level: CompetencyLevel;
  to_level: CompetencyLevel;
  timestamp: string;
  trigger: string;
}

export interface CompetencyUpdate {
  customer_analysis?: number;
  value_communication?: number;
  sales_execution?: number;
  total_points?: number;
}

export interface ToolAccessStatus {
  tool: 'icp' | 'cost_calculator' | 'business_case' | 'resources' | 'export';
  hasAccess: boolean;
  reason: string;
  requiredScore?: number;
  currentScore?: number;
  level: CompetencyLevel;
  competency: string;
}

export interface CompetencyGrowth {
  customer_analysis_growth: number;
  value_communication_growth: number;
  sales_execution_growth: number;
  overall_growth: number;
  days_since_baseline: number;
  learning_velocity: number; // points per week
}

// ==================== LEVEL THRESHOLDS ====================

const LEVEL_THRESHOLDS: Record<CompetencyLevel, number> = {
  foundation: 0,
  developing: 200,
  intermediate: 400,
  advanced: 600,
  expert: 800,
  master: 1000,
};

const TOOL_UNLOCK_REQUIREMENTS = {
  icp: { score: 0, field: null }, // Always available
  cost_calculator: { score: 70, field: 'value_communication' as const },
  business_case: { score: 70, field: 'sales_execution' as const },
  resources: { score: 50, field: 'overall_score' as const },
  export: { score: 60, field: 'overall_score' as const },
};

// ==================== COMPETENCY SERVICE ====================

class CompetencyService {
  private supabase: ReturnType<typeof createClient>;
  private static instance: CompetencyService;

  private constructor() {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): CompetencyService {
    if (!CompetencyService.instance) {
      CompetencyService.instance = new CompetencyService();
    }
    return CompetencyService.instance;
  }

  // ==================== CORE CRUD OPERATIONS ====================

  /**
   * Get competency data for a user
   */
  async getCompetencyData(userId: string): Promise<CompetencyData | null> {
    try {
      const { data, error } = await this.supabase
        .from('competency_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, create initial record
          return await this.createInitialCompetencyData(userId);
        }
        throw error;
      }

      return data as CompetencyData;
    } catch (error) {
      console.error('Error getting competency data:', error);
      throw error;
    }
  }

  /**
   * Create initial competency data for a new user
   */
  async createInitialCompetencyData(userId: string): Promise<CompetencyData> {
    try {
      const initialData = {
        user_id: userId,
        customer_analysis: 45,
        value_communication: 38,
        sales_execution: 42,
        total_points: 0,
        baseline_customer_analysis: 45,
        baseline_value_communication: 38,
        baseline_sales_execution: 42,
      };

      const { data, error } = await (this.supabase as any)
        .from('competency_data')
        .insert(initialData)
        .select()
        .single();

      if (error) throw error;

      return data as CompetencyData;
    } catch (error) {
      console.error('Error creating initial competency data:', error);
      throw error;
    }
  }

  /**
   * Update competency scores (triggers auto-calculate level, tool unlocks, etc.)
   */
  async updateCompetencyScores(
    userId: string,
    updates: CompetencyUpdate
  ): Promise<CompetencyData> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('competency_data')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return data as CompetencyData;
    } catch (error) {
      console.error('Error updating competency scores:', error);
      throw error;
    }
  }

  /**
   * Award points to a user (adds to total_points)
   */
  async awardPoints(userId: string, points: number, reason: string): Promise<CompetencyData> {
    try {
      // Get current data
      const currentData = await this.getCompetencyData(userId);
      if (!currentData) throw new Error('User competency data not found');

      const newTotalPoints = currentData.total_points + points;

      // Update with new points
      const updatedData = await this.updateCompetencyScores(userId, {
        total_points: newTotalPoints,
      });

      // Check if level changed
      const oldLevel = currentData.current_level;
      const newLevel = updatedData.current_level;

      if (oldLevel !== newLevel) {
        // Log level change
        console.log(`User ${userId} leveled up: ${oldLevel} → ${newLevel} (${reason})`);
      }

      return updatedData;
    } catch (error) {
      console.error('Error awarding points:', error);
      throw error;
    }
  }

  // ==================== TOOL ACCESS & UNLOCKING ====================

  /**
   * Get comprehensive tool access status
   */
  async getToolAccessStatus(userId: string): Promise<Record<string, ToolAccessStatus>> {
    try {
      const competencyData = await this.getCompetencyData(userId);
      if (!competencyData) {
        throw new Error('User competency data not found');
      }

      const status: Record<string, ToolAccessStatus> = {
        icp: {
          tool: 'icp',
          hasAccess: true,
          reason: 'Foundation tool - always available',
          level: competencyData.current_level,
          competency: 'Customer Intelligence',
        },
        cost_calculator: {
          tool: 'cost_calculator',
          hasAccess: competencyData.cost_calculator_unlocked,
          reason: competencyData.cost_calculator_unlocked
            ? 'Value communication competency demonstrated'
            : 'Requires value communication score ≥ 70%',
          requiredScore: TOOL_UNLOCK_REQUIREMENTS.cost_calculator.score,
          currentScore: competencyData.value_communication,
          level: competencyData.current_level,
          competency: 'Value Quantification',
        },
        business_case: {
          tool: 'business_case',
          hasAccess: competencyData.business_case_unlocked,
          reason: competencyData.business_case_unlocked
            ? 'Sales execution mastery confirmed'
            : 'Requires sales execution score ≥ 70%',
          requiredScore: TOOL_UNLOCK_REQUIREMENTS.business_case.score,
          currentScore: competencyData.sales_execution,
          level: competencyData.current_level,
          competency: 'Strategic Development',
        },
        resources: {
          tool: 'resources',
          hasAccess: competencyData.resources_unlocked,
          reason: competencyData.resources_unlocked
            ? 'Intermediate competency achieved'
            : 'Requires overall score ≥ 50%',
          requiredScore: TOOL_UNLOCK_REQUIREMENTS.resources.score,
          currentScore: competencyData.overall_score,
          level: competencyData.current_level,
          competency: 'Professional Resources',
        },
        export: {
          tool: 'export',
          hasAccess: competencyData.export_unlocked,
          reason: competencyData.export_unlocked
            ? 'Advanced data export capabilities enabled'
            : 'Requires overall score ≥ 60%',
          requiredScore: TOOL_UNLOCK_REQUIREMENTS.export.score,
          currentScore: competencyData.overall_score,
          level: competencyData.current_level,
          competency: 'Data Export',
        },
      };

      return status;
    } catch (error) {
      console.error('Error getting tool access status:', error);
      throw error;
    }
  }

  /**
   * Check if specific tool is unlocked
   */
  async isToolUnlocked(userId: string, tool: string): Promise<boolean> {
    try {
      const accessStatus = await this.getToolAccessStatus(userId);
      return accessStatus[tool]?.hasAccess || false;
    } catch (error) {
      console.error(`Error checking ${tool} unlock status:`, error);
      return false;
    }
  }

  // ==================== COMPETENCY GROWTH & ANALYTICS ====================

  /**
   * Calculate competency growth since baseline
   */
  async getCompetencyGrowth(userId: string): Promise<CompetencyGrowth> {
    try {
      const competencyData = await this.getCompetencyData(userId);
      if (!competencyData) {
        throw new Error('User competency data not found');
      }

      const baselineCA = competencyData.baseline_customer_analysis || competencyData.customer_analysis;
      const baselineVC = competencyData.baseline_value_communication || competencyData.value_communication;
      const baselineSE = competencyData.baseline_sales_execution || competencyData.sales_execution;

      const caGrowth = competencyData.customer_analysis - baselineCA;
      const vcGrowth = competencyData.value_communication - baselineVC;
      const seGrowth = competencyData.sales_execution - baselineSE;
      const overallGrowth = (caGrowth + vcGrowth + seGrowth) / 3;

      // Calculate days since baseline
      const createdDate = new Date(competencyData.created_at);
      const now = new Date();
      const daysSinceBaseline = Math.max(1, Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));

      // Calculate learning velocity (points per week)
      const learningVelocity = (competencyData.total_points / daysSinceBaseline) * 7;

      return {
        customer_analysis_growth: Math.round(caGrowth),
        value_communication_growth: Math.round(vcGrowth),
        sales_execution_growth: Math.round(seGrowth),
        overall_growth: Math.round(overallGrowth),
        days_since_baseline: daysSinceBaseline,
        learning_velocity: Math.round(learningVelocity * 10) / 10,
      };
    } catch (error) {
      console.error('Error calculating competency growth:', error);
      throw error;
    }
  }

  /**
   * Get user's current level info
   */
  getUserLevelInfo(level: CompetencyLevel): {
    level: CompetencyLevel;
    title: string;
    description: string;
    pointsRequired: number;
    nextLevel: CompetencyLevel | null;
    nextLevelPoints: number | null;
  } {
    const levelData = {
      foundation: {
        title: 'Customer Intelligence Foundation',
        description: 'Building foundational customer analysis competencies',
        next: 'developing' as CompetencyLevel,
      },
      developing: {
        title: 'Value Articulation Analyst',
        description: 'Competent in customer analysis and value quantification',
        next: 'intermediate' as CompetencyLevel,
      },
      intermediate: {
        title: 'Strategic Development Specialist',
        description: 'Proficient in multi-dimensional sales methodologies',
        next: 'advanced' as CompetencyLevel,
      },
      advanced: {
        title: 'Revenue Intelligence Professional',
        description: 'Advanced practitioner of integrated revenue strategies',
        next: 'expert' as CompetencyLevel,
      },
      expert: {
        title: 'Sales Excellence Expert',
        description: 'Expert-level mastery of revenue intelligence frameworks',
        next: 'master' as CompetencyLevel,
      },
      master: {
        title: 'Revenue Intelligence Master',
        description: 'Master-level authority in strategic sales methodologies',
        next: null,
      },
    };

    const currentData = levelData[level];
    const nextLevel = currentData.next;
    const nextLevelPoints = nextLevel ? LEVEL_THRESHOLDS[nextLevel] : null;

    return {
      level,
      title: currentData.title,
      description: currentData.description,
      pointsRequired: LEVEL_THRESHOLDS[level],
      nextLevel,
      nextLevelPoints,
    };
  }

  // ==================== REAL-TIME SUBSCRIPTIONS ====================

  /**
   * Subscribe to competency data changes for a user
   */
  subscribeToCompetencyChanges(
    userId: string,
    callback: (data: CompetencyData) => void
  ) {
    const subscription = this.supabase
      .channel(`competency_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'competency_data',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as CompetencyData);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
}

// Export singleton instance
export default CompetencyService.getInstance();
