/**
 * Agent System TypeScript Types
 * Generated from Supabase schema: 20250130000001_create_agent_system_tables.sql
 * 
 * This file contains all TypeScript interfaces and types for the agent system
 * database tables and related functionality.
 */

// ===============================================
// CORE DATABASE TYPES
// ===============================================

export interface AgentOrchestrationSession {
  id: string;
  user_id: string;
  session_name: string;
  session_type: 'customer_value_optimization' | 'dashboard_optimization' | 'deal_value_optimization' | 'prospect_qualification_optimization' | 'sales_materials_optimization';
  status: 'active' | 'paused' | 'completed' | 'failed' | 'cancelled';
  configuration: {
    monitoring_interval: number;
    friction_threshold: number;
    optimization_threshold: number;
    max_concurrent_agents: number;
    auto_optimization: boolean;
  };
  session_data: Record<string, any>;
  friction_points: FrictionPoint[];
  optimization_history: OptimizationRecord[];
  total_optimizations: number;
  successful_optimizations: number;
  average_optimization_time: number | null;
  session_score: number | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgentExecution {
  id: string;
  user_id: string;
  session_id: string;
  agent_name: 'CustomerValueOrchestrator' | 'DashboardOptimizer' | 'DealValueCalculatorOptimizer' | 'ProspectQualificationOptimizer' | 'SalesMaterialsOptimizer';
  agent_type: 'master_orchestrator' | 'sub_agent';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  context: Record<string, any>;
  input_data: Record<string, any>;
  output_data: Record<string, any>;
  execution_time_ms: number | null;
  memory_usage_mb: number | null;
  cpu_usage_percent: number | null;
  optimization_score: number | null;
  optimizations_applied: OptimizationRecord[];
  issues_detected: IssueRecord[];
  recommendations: RecommendationRecord[];
  error_message: string | null;
  error_stack: string | null;
  retry_count: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgentPerformanceMetric {
  id: string;
  user_id: string;
  session_id: string | null;
  execution_id: string | null;
  metric_name: string;
  metric_type: 'performance' | 'optimization' | 'friction' | 'business_impact' | 'user_satisfaction';
  metric_value: number;
  metric_unit: string | null;
  baseline_value: number | null;
  target_value: number | null;
  context: Record<string, any>;
  metadata: Record<string, any>;
  aggregation_type: 'single' | 'average' | 'sum' | 'max' | 'min' | 'count';
  time_window_minutes: number;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export interface AgentOptimizationHistory {
  id: string;
  user_id: string;
  session_id: string;
  execution_id: string | null;
  optimization_type: 'dashboard_ui' | 'deal_calculation' | 'prospect_qualification' | 'sales_materials' | 'workflow_flow' | 'friction_reduction';
  optimization_category: 'ui_ux' | 'calculation_logic' | 'qualification_criteria' | 'content_optimization' | 'process_improvement' | 'performance_enhancement';
  optimization_name: string;
  description: string | null;
  before_state: Record<string, any>;
  after_state: Record<string, any>;
  impact_score: number | null;
  business_value_score: number | null;
  user_satisfaction_score: number | null;
  implementation_status: 'pending' | 'implemented' | 'failed' | 'rolled_back';
  implementation_time_ms: number | null;
  results: Record<string, any>;
  feedback: Record<string, any>;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeriesAFounderContext {
  id: string;
  user_id: string;
  session_id: string | null;
  company_name: string;
  industry: string;
  company_stage: 'late_seed' | 'series_a' | 'series_a_plus';
  current_arr: number | null;
  target_arr: number | null;
  business_model: 'b2b_saas' | 'b2c_saas' | 'marketplace' | 'ecommerce' | 'fintech' | 'healthtech' | 'edtech' | 'other';
  target_market: string;
  customer_segment: string;
  primary_pain_points: string[];
  secondary_pain_points: string[];
  friction_areas: string[];
  primary_goals: string[];
  success_metrics: string[];
  kpis: Record<string, any>;
  user_behavior_patterns: Record<string, any>;
  interaction_preferences: Record<string, any>;
  optimization_preferences: Record<string, any>;
  professional_language_score: number | null;
  gaming_terminology_detected: string[];
  professional_alternatives: string[];
  context_version: string;
  last_updated_by: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ===============================================
// SUPPORTING TYPES
// ===============================================

export interface FrictionPoint {
  id: string;
  type: 'ui_friction' | 'workflow_friction' | 'data_friction' | 'performance_friction';
  severity: number; // 0-1 scale
  description: string;
  location: string;
  detected_at: string;
  resolved: boolean;
  resolution_method?: string;
}

export interface OptimizationRecord {
  id: string;
  type: string;
  name: string;
  description: string;
  applied_at: string;
  impact_score: number;
  business_value_score: number;
  user_satisfaction_score: number;
  status: 'pending' | 'implemented' | 'failed' | 'rolled_back';
}

export interface IssueRecord {
  id: string;
  type: 'performance' | 'usability' | 'data_quality' | 'business_logic';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  detected_at: string;
  resolved: boolean;
}

export interface RecommendationRecord {
  id: string;
  type: 'optimization' | 'improvement' | 'fix' | 'enhancement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  estimated_impact: number;
  implementation_effort: 'low' | 'medium' | 'high';
  generated_at: string;
}

// ===============================================
// DATABASE VIEW TYPES
// ===============================================

export interface AgentSessionSummary {
  id: string;
  user_id: string;
  session_name: string;
  session_type: string;
  status: string;
  total_optimizations: number;
  successful_optimizations: number;
  session_score: number | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  success_rate_percent: number;
  session_duration_minutes: number | null;
  total_executions: number;
  completed_executions: number;
  failed_executions: number;
  avg_execution_time_ms: number;
  avg_optimization_score: number;
  total_optimizations_applied: number;
  avg_impact_score: number;
  avg_business_value_score: number;
}

export interface AgentPerformanceDashboard {
  user_id: string;
  session_id: string | null;
  metric_name: string;
  metric_type: string;
  metric_value: number;
  metric_unit: string | null;
  baseline_value: number | null;
  target_value: number | null;
  recorded_at: string;
  improvement_percent: number | null;
  target_achievement_percent: number | null;
  performance_status: 'target_achieved' | 'improving' | 'declining' | 'neutral';
  session_name: string | null;
  session_type: string | null;
  session_status: string | null;
}

export interface AgentOptimizationImpact {
  id: string;
  user_id: string;
  session_id: string;
  optimization_type: string;
  optimization_category: string;
  optimization_name: string;
  impact_score: number | null;
  business_value_score: number | null;
  user_satisfaction_score: number | null;
  implementation_status: string;
  applied_at: string | null;
  created_at: string;
  overall_optimization_score: number;
  session_name: string | null;
  session_type: string | null;
  agent_name: string | null;
  execution_time_ms: number | null;
  time_to_implementation_minutes: number | null;
}

export interface SeriesAFounderInsights {
  id: string;
  user_id: string;
  company_name: string;
  industry: string;
  company_stage: string;
  current_arr: number | null;
  target_arr: number | null;
  business_model: string;
  target_market: string;
  customer_segment: string;
  professional_language_score: number | null;
  created_at: string;
  updated_at: string;
  arr_growth_target_percent: number | null;
  total_sessions: number;
  active_sessions: number;
  avg_session_score: number;
  total_optimizations: number;
  avg_impact_score: number;
  avg_business_value_score: number;
  professional_credibility_status: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  gaming_terminology_count: number;
}

export interface AgentRealtimeMonitoring {
  session_id: string;
  user_id: string;
  session_name: string;
  session_type: string;
  session_status: string;
  started_at: string;
  current_agent: string;
  current_execution_status: string;
  current_execution_started_at: string | null;
  recent_avg_execution_time_ms: number;
  recent_avg_optimization_score: number;
  recent_metric_count: number;
  recent_friction_count: number;
  avg_friction_severity: number;
  system_health_status: 'healthy' | 'warning' | 'critical';
  last_activity_at: string;
}

export interface AgentAnalyticsSummary {
  date: string;
  session_type: string;
  total_sessions: number;
  completed_sessions: number;
  failed_sessions: number;
  avg_session_score: number;
  avg_optimizations_per_session: number;
  avg_successful_optimizations_per_session: number;
  avg_execution_time_ms: number;
  avg_executions_per_session: number;
  avg_impact_score: number;
  avg_business_value_score: number;
  avg_optimizations_applied_per_session: number;
}

// ===============================================
// API REQUEST/RESPONSE TYPES
// ===============================================

export interface CreateSessionRequest {
  session_name: string;
  session_type: AgentOrchestrationSession['session_type'];
  configuration?: Partial<AgentOrchestrationSession['configuration']>;
  session_data?: Record<string, any>;
}

export interface CreateSessionResponse {
  session: AgentOrchestrationSession;
  success: boolean;
  message?: string;
}

export interface StartExecutionRequest {
  session_id: string;
  agent_name: AgentExecution['agent_name'];
  context?: Record<string, any>;
  input_data?: Record<string, any>;
}

export interface StartExecutionResponse {
  execution: AgentExecution;
  success: boolean;
  message?: string;
}

export interface RecordMetricRequest {
  session_id?: string;
  execution_id?: string;
  metric_name: string;
  metric_type: AgentPerformanceMetric['metric_type'];
  metric_value: number;
  metric_unit?: string;
  baseline_value?: number;
  target_value?: number;
  context?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface RecordMetricResponse {
  metric: AgentPerformanceMetric;
  success: boolean;
  message?: string;
}

export interface RecordOptimizationRequest {
  session_id: string;
  execution_id?: string;
  optimization_type: AgentOptimizationHistory['optimization_type'];
  optimization_category: AgentOptimizationHistory['optimization_category'];
  optimization_name: string;
  description?: string;
  before_state: Record<string, any>;
  after_state: Record<string, any>;
  impact_score?: number;
  business_value_score?: number;
  user_satisfaction_score?: number;
  results?: Record<string, any>;
}

export interface RecordOptimizationResponse {
  optimization: AgentOptimizationHistory;
  success: boolean;
  message?: string;
}

export interface CreateFounderContextRequest {
  company_name: string;
  industry: string;
  company_stage: SeriesAFounderContext['company_stage'];
  current_arr?: number;
  target_arr?: number;
  business_model: SeriesAFounderContext['business_model'];
  target_market: string;
  customer_segment: string;
  primary_pain_points?: string[];
  secondary_pain_points?: string[];
  friction_areas?: string[];
  primary_goals?: string[];
  success_metrics?: string[];
  kpis?: Record<string, any>;
}

export interface CreateFounderContextResponse {
  context: SeriesAFounderContext;
  success: boolean;
  message?: string;
}

// ===============================================
// QUERY TYPES
// ===============================================

export interface SessionQuery {
  user_id?: string;
  session_type?: AgentOrchestrationSession['session_type'];
  status?: AgentOrchestrationSession['status'];
  limit?: number;
  offset?: number;
  order_by?: 'created_at' | 'updated_at' | 'session_score' | 'total_optimizations';
  order_direction?: 'asc' | 'desc';
}

export interface ExecutionQuery {
  session_id?: string;
  agent_name?: AgentExecution['agent_name'];
  status?: AgentExecution['status'];
  limit?: number;
  offset?: number;
  order_by?: 'created_at' | 'started_at' | 'completed_at' | 'execution_time_ms';
  order_direction?: 'asc' | 'desc';
}

export interface MetricQuery {
  session_id?: string;
  execution_id?: string;
  metric_name?: string;
  metric_type?: AgentPerformanceMetric['metric_type'];
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
  order_by?: 'recorded_at' | 'metric_value';
  order_direction?: 'asc' | 'desc';
}

export interface OptimizationQuery {
  session_id?: string;
  optimization_type?: AgentOptimizationHistory['optimization_type'];
  implementation_status?: AgentOptimizationHistory['implementation_status'];
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
  order_by?: 'created_at' | 'applied_at' | 'impact_score' | 'business_value_score';
  order_direction?: 'asc' | 'desc';
}

// ===============================================
// UTILITY TYPES
// ===============================================

export type AgentName = AgentExecution['agent_name'];
export type SessionType = AgentOrchestrationSession['session_type'];
export type SessionStatus = AgentOrchestrationSession['status'];
export type ExecutionStatus = AgentExecution['status'];
export type OptimizationType = AgentOptimizationHistory['optimization_type'];
export type MetricType = AgentPerformanceMetric['metric_type'];
export type CompanyStage = SeriesAFounderContext['company_stage'];
export type BusinessModel = SeriesAFounderContext['business_model'];

// ===============================================
// CONSTANTS
// ===============================================

export const AGENT_NAMES: AgentName[] = [
  'CustomerValueOrchestrator',
  'DashboardOptimizer',
  'DealValueCalculatorOptimizer',
  'ProspectQualificationOptimizer',
  'SalesMaterialsOptimizer'
];

export const SESSION_TYPES: SessionType[] = [
  'customer_value_optimization',
  'dashboard_optimization',
  'deal_value_optimization',
  'prospect_qualification_optimization',
  'sales_materials_optimization'
];

export const OPTIMIZATION_TYPES: OptimizationType[] = [
  'dashboard_ui',
  'deal_calculation',
  'prospect_qualification',
  'sales_materials',
  'workflow_flow',
  'friction_reduction'
];

export const METRIC_TYPES: MetricType[] = [
  'performance',
  'optimization',
  'friction',
  'business_impact',
  'user_satisfaction'
];

export const COMPANY_STAGES: CompanyStage[] = [
  'late_seed',
  'series_a',
  'series_a_plus'
];

export const BUSINESS_MODELS: BusinessModel[] = [
  'b2b_saas',
  'b2c_saas',
  'marketplace',
  'ecommerce',
  'fintech',
  'healthtech',
  'edtech',
  'other'
];
