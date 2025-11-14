/**
 * Analytics Types
 *
 * Comprehensive type definitions for all analytics data structures.
 * Ensures type safety across the entire analytics dashboard.
 */

// ============================================================================
// PUBLIC PAGE ANALYTICS
// ============================================================================

export interface PublicPageVisit {
  id: string;
  anonymous_session_id: string;
  user_id: string | null;
  page_path: string;
  page_title: string | null;
  referrer_url: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  device_type: string | null;
  browser: string | null;
  user_agent: string | null;
  screen_width: number | null;
  screen_height: number | null;
  time_on_page: number | null; // seconds
  scroll_depth: number | null; // percentage
  clicked_cta: boolean | null;
  cta_text: string | null;
  cta_location: string | null;
  first_touch: boolean | null;
  last_touch: boolean | null;
  attributed_conversion: boolean | null;
  ip_address: string | null;
  country_code: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface PublicPageStats {
  page_path: string;
  page_title: string | null;
  total_visits: number;
  unique_visitors: number;
  avg_time_on_page: number; // seconds
  avg_scroll_depth: number; // percentage
  bounce_rate: number; // percentage
  cta_clicks: number;
  cta_click_rate: number; // percentage
  conversion_count: number;
  conversion_rate: number; // percentage
}

export interface CTAPerformance {
  cta_text: string;
  cta_location: string;
  total_impressions: number;
  total_clicks: number;
  click_through_rate: number; // percentage
  conversions: number;
  conversion_rate: number; // percentage
}

export interface UTMSourceStats {
  utm_source: string;
  utm_medium: string | null;
  utm_campaign: string | null;
  total_visits: number;
  unique_visitors: number;
  conversions: number;
  conversion_rate: number; // percentage
  avg_time_on_site: number; // seconds
}

// ============================================================================
// ASSESSMENT ANALYTICS
// ============================================================================

export interface AssessmentSession {
  id: string;
  session_id: string;
  user_id: string | null;
  assessment_data: Record<string, any>;
  user_email: string;
  company_name: string | null;
  overall_score: number | null;
  buyer_score: number | null;
  status: 'started' | 'in_progress' | 'completed' | 'completed_awaiting_signup' | 'linked' | 'abandoned';
  created_at: string;
  updated_at: string;
}

export interface AssessmentStats {
  total_started: number;
  total_completed: number;
  total_abandoned: number;
  completion_rate: number; // percentage
  avg_overall_score: number;
  avg_buyer_score: number;
  avg_time_to_complete: number; // seconds
  total_signups_after_assessment: number;
  assessment_to_signup_conversion: number; // percentage
}

export interface AssessmentScoreDistribution {
  score_range: string; // e.g., "0-20", "21-40", "41-60", "61-80", "81-100"
  count: number;
  percentage: number;
}

export interface TopCompanyByAssessment {
  company_name: string;
  total_assessments: number;
  avg_score: number;
  latest_assessment_date: string;
}

// ============================================================================
// BEHAVIOR ANALYTICS (Authenticated Users)
// ============================================================================

export interface BehaviorSession {
  session_id: string;
  customer_id: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  tools_accessed: string[] | null;
  primary_tool: string | null;
  events_count: number | null;
  exports_generated: number | null;
  competency_points_earned: number | null;
  business_impact_level: 'low' | 'medium' | 'high' | null;
  device_type: string | null;
  browser: string | null;
  referrer_source: string | null;
  created_at: string;
  updated_at: string;
}

export interface BehaviorEvent {
  id: string;
  session_id: string;
  customer_id: string;
  event_type: 'navigation' | 'action' | 'export' | 'tool_use' | 'content_interaction';
  tool_id: string | null;
  event_metadata: Record<string, any> | null;
  created_at: string;
}

export interface PlatformUsageStats {
  total_sessions: number;
  total_active_users: number;
  avg_session_duration: number; // seconds
  total_events: number;
  total_exports: number;
  avg_exports_per_user: number;
  most_used_tool: string | null;
  most_used_tool_percentage: number;
}

export interface ToolUsageStats {
  tool_id: string;
  tool_name: string;
  total_uses: number;
  unique_users: number;
  avg_time_spent: number; // seconds
  exports_generated: number;
  percentage_of_total_usage: number;
}

// ============================================================================
// USER FLOW / NAVIGATION ANALYTICS
// ============================================================================

export interface NavigationPath {
  from_page: string;
  to_page: string;
  total_transitions: number;
  unique_users: number;
  avg_time_between: number; // seconds
  conversion_count: number; // how many completed desired action
  dropout_count: number; // how many abandoned
}

export interface PageNode {
  page_id: string;
  page_path: string;
  page_name: string;
  total_visits: number;
  unique_visitors: number;
  avg_time_on_page: number;
  bounce_count: number;
  exit_count: number;
}

export interface UserJourney {
  journey_id: string;
  user_type: 'anonymous' | 'authenticated';
  path_sequence: string[]; // ordered array of page paths
  total_occurrences: number;
  avg_duration: number; // total journey duration in seconds
  conversion_rate: number; // percentage that converted
  dropout_step: string | null; // where users typically drop off
}

// ============================================================================
// CONVERSION FUNNEL
// ============================================================================

export interface FunnelStage {
  stage_name: string;
  stage_order: number;
  total_entered: number;
  total_completed: number;
  total_dropped: number;
  completion_rate: number; // percentage
  drop_rate: number; // percentage
  avg_time_in_stage: number; // seconds
  next_stage: string | null;
}

export interface ConversionFunnel {
  funnel_name: string;
  total_entered_funnel: number;
  total_completed_funnel: number;
  overall_conversion_rate: number;
  stages: FunnelStage[];
  avg_time_to_convert: number; // seconds
}

// Standard conversion funnel stages
export enum FunnelStageType {
  VISIT = 'visit',
  ASSESSMENT = 'assessment',
  SIGNUP = 'signup',
  PAYMENT = 'payment'
}

// ============================================================================
// DATE RANGE & FILTERS
// ============================================================================

export interface DateRangeFilter {
  start_date: string; // ISO 8601 format
  end_date: string; // ISO 8601 format
  preset?: 'today' | 'last_7_days' | 'last_30_days' | 'last_90_days' | 'custom';
}

export interface AnalyticsFilters {
  date_range: DateRangeFilter;
  utm_source?: string;
  utm_campaign?: string;
  device_type?: string;
  user_type?: 'anonymous' | 'authenticated' | 'all';
  page_path?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface AnalyticsAPIResponse<T> {
  success: boolean;
  data: T;
  metadata?: {
    total_count: number;
    filtered_count: number;
    date_range: DateRangeFilter;
    generated_at: string;
  };
  error?: string;
}

// ============================================================================
// SCENARIO PAGE ANALYTICS
// ============================================================================

export interface ScenarioPageOverview {
  total_views: number;
  unique_visitors: number;
  avg_time_on_page: number; // seconds
  total_cta_clicks: number;
  scenario_to_assessment_conversions: number;
  scenario_to_assessment_rate: number; // percentage
  scenario_to_signup_conversions: number;
  scenario_to_signup_rate: number; // percentage
}

export interface ScenarioDetailedStats {
  scenario_slug: string;
  scenario_title: string;
  company_name: string;
  persona: string;
  total_views: number;
  unique_visitors: number;
  avg_time_on_page: number; // seconds
  avg_scroll_depth: number; // percentage
  bounce_rate: number; // percentage
  cta_clicks: number;
  cta_click_rate: number; // percentage
  assessment_conversions: number;
  assessment_conversion_rate: number; // percentage
  signup_conversions: number;
  signup_conversion_rate: number; // percentage
  last_viewed: string; // ISO 8601
}

// ============================================================================
// DASHBOARD STATE
// ============================================================================

export interface AnalyticsDashboardState {
  filters: AnalyticsFilters;
  loading: {
    publicPages: boolean;
    assessments: boolean;
    platformUsage: boolean;
    userFlow: boolean;
    conversionFunnel: boolean;
  };
  errors: {
    publicPages: string | null;
    assessments: string | null;
    platformUsage: string | null;
    userFlow: string | null;
    conversionFunnel: string | null;
  };
  lastRefresh: Date | null;
}
