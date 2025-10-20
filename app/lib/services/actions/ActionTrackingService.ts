/**
 * Action Tracking Service
 *
 * Manages real-world business action tracking, point awards, and competency progression.
 * Integrates with Supabase customer_actions table and CompetencyService for point awards.
 *
 * Architecture:
 * - 8 action types: customer_meeting, prospect_qualification, value_proposition_delivery,
 *   roi_presentation, proposal_creation, deal_closure, referral_generation, case_study_development
 * - Point-based system with impact multipliers (1.0x - 3.0x)
 * - 3 competency categories: customerAnalysis, valueCommunication, salesExecution
 * - Evidence tracking and verification
 * - Real-time updates via Supabase subscriptions
 */

// Import singleton Supabase client (DO NOT create new instances - causes session conflicts)
import { supabase } from '@/app/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import CompetencyService from '../competency/CompetencyService';

// ==================== TYPES & INTERFACES ====================

export type ActionType =
  | 'customer_meeting'
  | 'prospect_qualification'
  | 'value_proposition_delivery'
  | 'roi_presentation'
  | 'proposal_creation'
  | 'deal_closure'
  | 'referral_generation'
  | 'case_study_development';

export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

export type CompetencyCategory = 'customerAnalysis' | 'valueCommunication' | 'salesExecution';

export type DealSizeRange = 'Under $10K' | '$10K-50K' | '$50K-250K' | '$250K+';

export type StakeholderLevel = 'Individual Contributor' | 'Manager' | 'Director' | 'Executive';

export type EvidenceType = 'meeting_notes' | 'email' | 'proposal' | 'recording' | 'document';

export interface CustomerAction {
  id: string;
  customer_id: string;
  action_type: ActionType;
  action_description: string;

  // Impact & Scoring
  impact_level: ImpactLevel;
  points_awarded: number;
  base_points?: number;
  impact_multiplier?: number;

  // Categorization
  category: CompetencyCategory;
  subcategory?: string;

  // Professional Context
  deal_size_range?: DealSizeRange;
  stakeholder_level?: StakeholderLevel;
  industry_context?: string;

  // Evidence & Verification
  evidence_link?: string;
  evidence_type?: EvidenceType;
  verified: boolean;
  verified_by?: string;
  verified_at?: string;

  // Timing
  action_date: string;
  duration_minutes?: number;

  // Outcome Tracking
  outcome_achieved?: boolean;
  outcome_description?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;

  // Learning & Development
  skills_demonstrated?: Record<string, any>;
  lessons_learned?: string;
  improvement_notes?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface LogActionParams {
  customer_id: string;
  action_type: ActionType;
  action_description: string;
  impact_level?: ImpactLevel;
  category: CompetencyCategory;
  subcategory?: string;
  deal_size_range?: DealSizeRange;
  stakeholder_level?: StakeholderLevel;
  industry_context?: string;
  evidence_link?: string;
  evidence_type?: EvidenceType;
  action_date?: string;
  duration_minutes?: number;
  outcome_achieved?: boolean;
  outcome_description?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
  skills_demonstrated?: Record<string, any>;
  lessons_learned?: string;
  improvement_notes?: string;
}

export interface ActionAnalytics {
  total_actions: number;
  total_points: number;
  verified_actions: number;
  by_category: Record<CompetencyCategory, {
    count: number;
    points: number;
    avg_points: number;
  }>;
  by_type: Record<string, {
    count: number;
    points: number;
    avg_points: number;
  }>;
  recent_actions: CustomerAction[];
  top_action_type: string;
  learning_velocity: number; // Actions per week
  avg_action_value: number;
}

export interface ActionFilter {
  action_type?: ActionType;
  category?: CompetencyCategory;
  impact_level?: ImpactLevel;
  verified?: boolean;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

// ==================== POINT CALCULATIONS ====================

/**
 * Base points for each action type
 */
const BASE_POINTS: Record<ActionType, number> = {
  customer_meeting: 100,           // 50-200 points with multipliers
  prospect_qualification: 200,     // 100-300 points
  value_proposition_delivery: 250, // 150-400 points
  roi_presentation: 300,           // 200-500 points
  proposal_creation: 350,          // 200-500 points
  deal_closure: 1000,              // 500-2000 points
  referral_generation: 200,        // 100-300 points
  case_study_development: 200,     // 100-300 points
};

/**
 * Default category mapping for action types
 */
const ACTION_CATEGORY_MAP: Record<ActionType, CompetencyCategory> = {
  customer_meeting: 'customerAnalysis',
  prospect_qualification: 'customerAnalysis',
  value_proposition_delivery: 'valueCommunication',
  roi_presentation: 'valueCommunication',
  proposal_creation: 'valueCommunication',
  deal_closure: 'salesExecution',
  referral_generation: 'salesExecution',
  case_study_development: 'salesExecution',
};

/**
 * Impact level multipliers
 */
const IMPACT_MULTIPLIERS: Record<ImpactLevel, number> = {
  low: 1.0,
  medium: 1.5,
  high: 2.0,
  critical: 3.0,
};

// ==================== ACTION TRACKING SERVICE ====================

class ActionTrackingService {
  private supabase: SupabaseClient;
  private static instance: ActionTrackingService;
  private competencyService: typeof CompetencyService;

  private constructor() {
    // Use singleton Supabase client (DO NOT create new instances - causes session conflicts)
    this.supabase = supabase;
    this.competencyService = CompetencyService;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ActionTrackingService {
    if (!ActionTrackingService.instance) {
      ActionTrackingService.instance = new ActionTrackingService();
    }
    return ActionTrackingService.instance;
  }

  // ==================== CORE ACTION LOGGING ====================

  /**
   * Calculate points for an action based on type, impact level, and context
   */
  private calculateActionPoints(
    actionType: ActionType,
    impactLevel: ImpactLevel = 'medium',
    context?: {
      dealSize?: DealSizeRange;
      stakeholderLevel?: StakeholderLevel;
      durationMinutes?: number;
    }
  ): { basePoints: number; multiplier: number; totalPoints: number } {
    const basePoints = BASE_POINTS[actionType];
    let multiplier = IMPACT_MULTIPLIERS[impactLevel];

    // Additional multipliers based on context
    if (context?.dealSize) {
      switch (context.dealSize) {
        case '$250K+':
          multiplier *= 1.5;
          break;
        case '$50K-250K':
          multiplier *= 1.3;
          break;
        case '$10K-50K':
          multiplier *= 1.1;
          break;
      }
    }

    if (context?.stakeholderLevel === 'Executive') {
      multiplier *= 1.2;
    } else if (context?.stakeholderLevel === 'Director') {
      multiplier *= 1.1;
    }

    // Time efficiency bonus (completed faster than expected)
    if (context?.durationMinutes) {
      if (actionType === 'customer_meeting' && context.durationMinutes < 30) {
        multiplier *= 1.1; // Efficient meeting
      } else if (actionType === 'proposal_creation' && context.durationMinutes < 120) {
        multiplier *= 1.1; // Efficient proposal creation
      }
    }

    const totalPoints = Math.round(basePoints * multiplier);

    return {
      basePoints,
      multiplier: Math.round(multiplier * 100) / 100,
      totalPoints,
    };
  }

  /**
   * Log a real-world business action
   */
  async logAction(params: LogActionParams): Promise<CustomerAction> {
    try {
      const {
        customer_id,
        action_type,
        action_description,
        impact_level = 'medium',
        category,
        subcategory,
        deal_size_range,
        stakeholder_level,
        industry_context,
        evidence_link,
        evidence_type,
        action_date = new Date().toISOString(),
        duration_minutes,
        outcome_achieved,
        outcome_description,
        follow_up_required = false,
        follow_up_date,
        skills_demonstrated,
        lessons_learned,
        improvement_notes,
      } = params;

      // Calculate points
      const { basePoints, multiplier, totalPoints } = this.calculateActionPoints(
        action_type,
        impact_level,
        {
          dealSize: deal_size_range,
          stakeholderLevel: stakeholder_level,
          durationMinutes: duration_minutes,
        }
      );

      // Insert action into database
      const { data, error } = await (this.supabase as any)
        .from('customer_actions')
        .insert({
          customer_id,
          action_type,
          action_description,
          impact_level,
          points_awarded: totalPoints,
          base_points: basePoints,
          impact_multiplier: multiplier,
          category,
          subcategory,
          deal_size_range,
          stakeholder_level,
          industry_context,
          evidence_link,
          evidence_type,
          verified: false,
          action_date,
          duration_minutes,
          outcome_achieved,
          outcome_description,
          follow_up_required,
          follow_up_date,
          skills_demonstrated,
          lessons_learned,
          improvement_notes,
        })
        .select()
        .single();

      if (error) throw error;

      // Award points to user's competency system
      await this.competencyService.awardPoints(
        customer_id,
        totalPoints,
        `${action_type.replace(/_/g, ' ')} - ${action_description.substring(0, 50)}`
      );

      console.log(`Action logged: ${action_type} (+${totalPoints} points) for user ${customer_id}`);

      return data as CustomerAction;
    } catch (error) {
      console.error('Error logging action:', error);
      throw error;
    }
  }

  /**
   * Verify an action (e.g., by manager or automated validation)
   */
  async verifyAction(
    actionId: string,
    verifiedBy: string
  ): Promise<CustomerAction> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('customer_actions')
        .update({
          verified: true,
          verified_by: verifiedBy,
          verified_at: new Date().toISOString(),
        })
        .eq('id', actionId)
        .select()
        .single();

      if (error) throw error;

      return data as CustomerAction;
    } catch (error) {
      console.error('Error verifying action:', error);
      throw error;
    }
  }

  /**
   * Update an existing action
   */
  async updateAction(
    actionId: string,
    updates: Partial<LogActionParams>
  ): Promise<CustomerAction> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('customer_actions')
        .update(updates)
        .eq('id', actionId)
        .select()
        .single();

      if (error) throw error;

      return data as CustomerAction;
    } catch (error) {
      console.error('Error updating action:', error);
      throw error;
    }
  }

  // ==================== ACTION RETRIEVAL ====================

  /**
   * Get action history for a customer with optional filters
   */
  async getActionHistory(
    customerId: string,
    filter?: ActionFilter
  ): Promise<CustomerAction[]> {
    try {
      let query = this.supabase
        .from('customer_actions')
        .select('*')
        .eq('customer_id', customerId)
        .order('action_date', { ascending: false });

      // Apply filters
      if (filter?.action_type) {
        query = query.eq('action_type', filter.action_type);
      }
      if (filter?.category) {
        query = query.eq('category', filter.category);
      }
      if (filter?.impact_level) {
        query = query.eq('impact_level', filter.impact_level);
      }
      if (filter?.verified !== undefined) {
        query = query.eq('verified', filter.verified);
      }
      if (filter?.start_date) {
        query = query.gte('action_date', filter.start_date);
      }
      if (filter?.end_date) {
        query = query.lte('action_date', filter.end_date);
      }
      if (filter?.limit) {
        query = query.limit(filter.limit);
      }
      if (filter?.offset) {
        query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data as CustomerAction[];
    } catch (error) {
      console.error('Error getting action history:', error);
      throw error;
    }
  }

  /**
   * Get a single action by ID
   */
  async getActionById(actionId: string): Promise<CustomerAction | null> {
    try {
      const { data, error } = await this.supabase
        .from('customer_actions')
        .select('*')
        .eq('id', actionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw error;
      }

      return data as CustomerAction;
    } catch (error) {
      console.error('Error getting action by ID:', error);
      throw error;
    }
  }

  /**
   * Get recent actions across all categories
   */
  async getRecentActions(
    customerId: string,
    limit: number = 10
  ): Promise<CustomerAction[]> {
    return this.getActionHistory(customerId, { limit });
  }

  /**
   * Get actions by category
   */
  async getActionsByCategory(
    customerId: string,
    category: CompetencyCategory,
    limit: number = 20
  ): Promise<CustomerAction[]> {
    return this.getActionHistory(customerId, { category, limit });
  }

  /**
   * Get actions requiring follow-up
   */
  async getActionsNeedingFollowUp(customerId: string): Promise<CustomerAction[]> {
    try {
      const { data, error } = await this.supabase
        .from('customer_actions')
        .select('*')
        .eq('customer_id', customerId)
        .eq('follow_up_required', true)
        .order('follow_up_date', { ascending: true });

      if (error) throw error;

      return data as CustomerAction[];
    } catch (error) {
      console.error('Error getting actions needing follow-up:', error);
      throw error;
    }
  }

  // ==================== ANALYTICS & INSIGHTS ====================

  /**
   * Get comprehensive action analytics for a customer
   */
  async getActionAnalytics(customerId: string): Promise<ActionAnalytics> {
    try {
      const actions = await this.getActionHistory(customerId);

      // Defensive guard: Ensure actions is a valid array
      if (!Array.isArray(actions)) {
        console.warn('⚠️ getActionAnalytics received non-array actions:', actions);
        return {
          total_actions: 0,
          total_points: 0,
          verified_actions: 0,
          by_category: {
            customerAnalysis: { count: 0, points: 0, avg_points: 0 },
            valueCommunication: { count: 0, points: 0, avg_points: 0 },
            salesExecution: { count: 0, points: 0, avg_points: 0 },
          },
          by_type: {},
          recent_actions: [],
          top_action_type: 'none',
          learning_velocity: 0,
          avg_action_value: 0,
        };
      }

      const totalActions = actions.length;
      const totalPoints = actions.reduce((sum, action) => sum + action.points_awarded, 0);
      const verifiedActions = actions.filter((action) => action.verified).length;

      // By category
      const byCategory: Record<string, { count: number; points: number; avg_points: number }> = {
        customerAnalysis: { count: 0, points: 0, avg_points: 0 },
        valueCommunication: { count: 0, points: 0, avg_points: 0 },
        salesExecution: { count: 0, points: 0, avg_points: 0 },
      };

      actions.forEach((action) => {
        if (byCategory[action.category]) {
          byCategory[action.category].count += 1;
          byCategory[action.category].points += action.points_awarded;
        }
      });

      Object.keys(byCategory).forEach((category) => {
        const cat = byCategory[category];
        cat.avg_points = cat.count > 0 ? Math.round(cat.points / cat.count) : 0;
      });

      // By type
      const byType: Record<string, { count: number; points: number; avg_points: number }> = {};

      actions.forEach((action) => {
        if (!byType[action.action_type]) {
          byType[action.action_type] = { count: 0, points: 0, avg_points: 0 };
        }
        byType[action.action_type].count += 1;
        byType[action.action_type].points += action.points_awarded;
      });

      Object.keys(byType).forEach((type) => {
        byType[type].avg_points = Math.round(byType[type].points / byType[type].count);
      });

      // Find top action type
      const topActionType = Object.entries(byType).sort((a, b) => b[1].count - a[1].count)[0]?.[0] || 'none';

      // Calculate learning velocity (actions per week)
      const oldestAction = actions[actions.length - 1];
      const daysSinceFirstAction = oldestAction
        ? Math.max(
            1,
            Math.floor((Date.now() - new Date(oldestAction.action_date).getTime()) / (1000 * 60 * 60 * 24))
          )
        : 1;
      const learningVelocity = Math.round((totalActions / daysSinceFirstAction) * 7 * 10) / 10;

      // Average action value
      const avgActionValue = totalActions > 0 ? Math.round(totalPoints / totalActions) : 0;

      return {
        total_actions: totalActions,
        total_points: totalPoints,
        verified_actions: verifiedActions,
        by_category: byCategory as Record<CompetencyCategory, { count: number; points: number; avg_points: number }>,
        by_type: byType,
        recent_actions: actions.slice(0, 5),
        top_action_type: topActionType,
        learning_velocity: learningVelocity,
        avg_action_value: avgActionValue,
      };
    } catch (error) {
      console.error('Error getting action analytics:', error);
      throw error;
    }
  }

  /**
   * Get action frequency over time (for charts)
   */
  async getActionFrequency(
    customerId: string,
    days: number = 30
  ): Promise<Record<string, number>> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const actions = await this.getActionHistory(customerId, {
        start_date: startDate.toISOString(),
      });

      const frequency: Record<string, number> = {};

      actions.forEach((action) => {
        const date = new Date(action.action_date).toISOString().split('T')[0];
        frequency[date] = (frequency[date] || 0) + 1;
      });

      return frequency;
    } catch (error) {
      console.error('Error getting action frequency:', error);
      throw error;
    }
  }

  // ==================== REAL-TIME SUBSCRIPTIONS ====================

  /**
   * Subscribe to action changes for a customer
   */
  subscribeToActions(
    customerId: string,
    callback: (action: CustomerAction) => void
  ) {
    const subscription = this.supabase
      .channel(`actions_${customerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customer_actions',
          filter: `customer_id=eq.${customerId}`,
        },
        (payload) => {
          callback(payload.new as CustomerAction);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  // ==================== HELPER METHODS ====================

  /**
   * Get default category for an action type
   */
  getDefaultCategory(actionType: ActionType): CompetencyCategory {
    return ACTION_CATEGORY_MAP[actionType];
  }

  /**
   * Get base points for an action type
   */
  getBasePoints(actionType: ActionType): number {
    return BASE_POINTS[actionType];
  }

  /**
   * Preview points for an action before logging
   */
  previewActionPoints(
    actionType: ActionType,
    impactLevel: ImpactLevel = 'medium',
    context?: {
      dealSize?: DealSizeRange;
      stakeholderLevel?: StakeholderLevel;
      durationMinutes?: number;
    }
  ): { basePoints: number; multiplier: number; totalPoints: number } {
    return this.calculateActionPoints(actionType, impactLevel, context);
  }
}

// Export singleton instance
export default ActionTrackingService.getInstance();
