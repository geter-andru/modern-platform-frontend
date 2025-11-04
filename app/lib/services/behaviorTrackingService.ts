/**
 * Behavior Tracking Service - Supabase Integration
 * Phase 3.1: Comprehensive User Behavior Tracking System
 *
 * Tracks digital platform interactions for systematic scaling intelligence
 * Integrates with behavior_events, behavior_insights, and behavior_sessions tables
 */

'use client';

import { supabase } from '@/app/lib/supabase/client';

// ============================================
// Type Definitions (matching database schema)
// ============================================

export type EventType =
  | 'tool_usage'
  | 'export_action'
  | 'competency_milestone'
  | 'scaling_metric'
  | 'professional_action'
  | 'navigation'
  | 'content_interaction'
  | 'resource_generation'
  | 'resource_share'
  | 'systematic_progression';

export type ToolId = 'icp-analysis' | 'cost-calculator' | 'business-case' | 'resources';

export type GrowthStage = 'early_scaling' | 'rapid_scaling' | 'mature_scaling';

export type BusinessImpact = 'low' | 'medium' | 'high';

export type CompetencyArea =
  | 'customer_intelligence'
  | 'value_communication'
  | 'sales_execution'
  | 'systematic_optimization';

export interface BehaviorEvent {
  customer_id: string;
  session_id: string;
  event_type: EventType;
  tool_id?: ToolId;
  tool_section?: string;

  // Scaling Context
  current_arr?: string;
  target_arr?: string;
  growth_stage?: GrowthStage;
  systematic_approach?: boolean;

  // Impact Assessment
  business_impact: BusinessImpact;
  professional_credibility?: number;
  competency_area?: CompetencyArea;

  // Metadata
  event_metadata?: Record<string, any>;
  user_agent?: string;

  // Timing
  session_duration?: number;
  time_on_page?: number;

  // Outcome
  action_completed?: boolean;
  action_outcome?: string;
  follow_up_scheduled?: boolean;
}

export interface BehaviorInsights {
  customer_id: string;
  current_scaling_score: number;
  systematic_progression_rate: number;
  professional_credibility_trend: 'improving' | 'stable' | 'declining';

  customer_intelligence_score: number;
  value_communication_score: number;
  sales_execution_score: number;
  systematic_optimization_score: number;

  weekly_progress_points: number;
  monthly_milestones_completed: number;
  quarterly_targets_achieved: number;

  inconsistent_system_usage: boolean;
  low_business_impact_actions: boolean;
  professional_credibility_drift: boolean;

  total_tool_sessions: number;
  total_exports_generated: number;
  total_resources_created: number;
  total_time_spent_minutes: number;

  last_session_timestamp?: string;
  last_tool_used?: string;
  days_since_last_activity?: number;

  next_systematic_actions: string[];
}

export interface BehaviorSession {
  session_id: string;
  customer_id: string;
  started_at: string;
  ended_at?: string;
  duration_seconds?: number;

  tools_accessed: string[];
  primary_tool?: string;

  events_count: number;
  exports_generated: number;
  competency_points_earned: number;
  business_impact_level?: BusinessImpact;

  device_type?: string;
  browser?: string;
  referrer_source?: string;
}

// ============================================
// Behavior Tracking Service Class
// ============================================

class BehaviorTrackingService {
  private currentSessionId: string | null = null;
  private sessionStartTime: number | null = null;
  private pageStartTime: number | null = null;
  private eventsQueue: BehaviorEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeSession();
    this.startAutoFlush();
  }

  /**
   * Initialize a new tracking session
   */
  private initializeSession(): void {
    this.currentSessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.pageStartTime = Date.now();

    if (typeof window !== 'undefined') {
      // Track session end on page unload
      window.addEventListener('beforeunload', () => this.endSession());
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    if (!this.currentSessionId) {
      this.initializeSession();
    }
    return this.currentSessionId!;
  }

  /**
   * Track a behavior event
   */
  async trackEvent(event: Omit<BehaviorEvent, 'session_id'>): Promise<void> {
    const fullEvent: BehaviorEvent = {
      ...event,
      session_id: this.getSessionId(),
      session_duration: this.getSessionDuration(),
      time_on_page: this.getTimeOnPage(),
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    // Add to queue for batch processing
    this.eventsQueue.push(fullEvent);

    // If high-impact event, flush immediately
    if (event.business_impact === 'high') {
      await this.flush();
    }
  }

  /**
   * Track tool usage
   */
  async trackToolUsage(params: {
    customer_id: string;
    tool_id: ToolId;
    tool_section?: string;
    business_impact?: BusinessImpact;
    competency_area?: CompetencyArea;
    metadata?: Record<string, any>;
    scaling_context?: {
      current_arr?: string;
      target_arr?: string;
      growth_stage?: GrowthStage;
    };
  }): Promise<void> {
    await this.trackEvent({
      customer_id: params.customer_id,
      event_type: 'tool_usage',
      tool_id: params.tool_id,
      tool_section: params.tool_section,
      business_impact: params.business_impact || 'medium',
      competency_area: params.competency_area,
      event_metadata: params.metadata,
      current_arr: params.scaling_context?.current_arr,
      target_arr: params.scaling_context?.target_arr,
      growth_stage: params.scaling_context?.growth_stage,
      systematic_approach: true,
    });
  }

  /**
   * Track export action
   */
  async trackExport(params: {
    customer_id: string;
    tool_id: ToolId;
    export_type: 'pdf' | 'csv' | 'email' | 'share';
    business_impact?: BusinessImpact;
    metadata?: Record<string, any>;
  }): Promise<void> {
    await this.trackEvent({
      customer_id: params.customer_id,
      event_type: 'export_action',
      tool_id: params.tool_id,
      business_impact: params.business_impact || 'high',
      event_metadata: { export_type: params.export_type, ...params.metadata },
      action_completed: true,
    });
  }

  /**
   * Track competency milestone
   */
  async trackCompetencyMilestone(params: {
    customer_id: string;
    competency_area: CompetencyArea;
    milestone_description: string;
    professional_credibility: number;
    business_impact?: BusinessImpact;
  }): Promise<void> {
    await this.trackEvent({
      customer_id: params.customer_id,
      event_type: 'competency_milestone',
      competency_area: params.competency_area,
      business_impact: params.business_impact || 'high',
      professional_credibility: params.professional_credibility,
      event_metadata: { milestone: params.milestone_description },
      action_completed: true,
    });
  }

  /**
   * Track navigation
   */
  async trackNavigation(params: {
    customer_id: string;
    from_page?: string;
    to_page: string;
    tool_id?: ToolId;
  }): Promise<void> {
    // Reset page timer
    this.pageStartTime = Date.now();

    await this.trackEvent({
      customer_id: params.customer_id,
      event_type: 'navigation',
      tool_id: params.tool_id,
      business_impact: 'low',
      event_metadata: {
        from: params.from_page,
        to: params.to_page,
      },
    });
  }

  /**
   * Get session duration in milliseconds
   */
  private getSessionDuration(): number {
    if (!this.sessionStartTime) return 0;
    return Date.now() - this.sessionStartTime;
  }

  /**
   * Get time on current page in milliseconds
   */
  private getTimeOnPage(): number {
    if (!this.pageStartTime) return 0;
    return Date.now() - this.pageStartTime;
  }

  /**
   * Flush events queue to database
   */
  async flush(): Promise<void> {
    if (this.eventsQueue.length === 0) return;

    const eventsToFlush = [...this.eventsQueue];
    this.eventsQueue = [];

    try {
      const { error } = await supabase
        .from('behavior_events')
        .insert(eventsToFlush as any);

      if (error) {
        console.error('Failed to track behavior events:', error);
        // Re-add failed events to queue
        this.eventsQueue.unshift(...eventsToFlush);
      }
    } catch (error) {
      console.error('Error flushing behavior events:', error);
      this.eventsQueue.unshift(...eventsToFlush);
    }
  }

  /**
   * Start auto-flush interval
   */
  private startAutoFlush(): void {
    // Flush every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flush();
    }, 30000);
  }

  /**
   * End current session
   */
  async endSession(): Promise<void> {
    if (!this.currentSessionId) return;

    await this.flush();

    // Update session end time in database
    try {
      await (supabase
        .from('behavior_sessions') as any)
        .update({
          ended_at: new Date().toISOString(),
          duration_seconds: Math.floor(this.getSessionDuration() / 1000),
        })
        .eq('session_id', this.currentSessionId);
    } catch (error) {
      console.error('Failed to end session:', error);
    }

    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
  }

  /**
   * Get behavior insights for a customer
   */
  async getInsights(customerId: string): Promise<BehaviorInsights | null> {
    try {
      const { data, error } = await supabase
        .from('behavior_insights')
        .select('*')
        .eq('customer_id', customerId)
        .single();

      if (error) {
        console.error('Failed to fetch behavior insights:', error);
        return null;
      }

      return data as BehaviorInsights;
    } catch (error) {
      console.error('Error fetching behavior insights:', error);
      return null;
    }
  }

  /**
   * Get recent events for a customer
   */
  async getRecentEvents(
    customerId: string,
    limit: number = 50
  ): Promise<BehaviorEvent[]> {
    try {
      const { data, error } = await supabase
        .from('behavior_events')
        .select('*')
        .eq('customer_id', customerId)
        .order('event_timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch behavior events:', error);
        return [];
      }

      return data as BehaviorEvent[];
    } catch (error) {
      console.error('Error fetching behavior events:', error);
      return [];
    }
  }

  /**
   * Initialize session in database
   */
  async initializeSessionInDB(
    customerId: string,
    deviceInfo?: { type?: string; browser?: string; referrer?: string }
  ): Promise<void> {
    try {
      await supabase.from('behavior_sessions').insert({
        session_id: this.getSessionId(),
        customer_id: customerId,
        started_at: new Date().toISOString(),
        device_type: deviceInfo?.type,
        browser: deviceInfo?.browser,
        referrer_source: deviceInfo?.referrer,
        events_count: 0,
        tools_accessed: [],
      } as any);
    } catch (error) {
      console.error('Failed to initialize session in DB:', error);
    }
  }
}

// ============================================
// Export Singleton Instance
// ============================================

export const behaviorTrackingService = new BehaviorTrackingService();

// Helper function to get device info
export function getDeviceInfo() {
  if (typeof window === 'undefined') return {};

  const ua = navigator.userAgent;
  let deviceType = 'desktop';

  if (/Mobile|Android|iPhone/i.test(ua)) deviceType = 'mobile';
  else if (/Tablet|iPad/i.test(ua)) deviceType = 'tablet';

  let browser = 'unknown';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';

  return {
    type: deviceType,
    browser,
    referrer: document.referrer,
  };
}
