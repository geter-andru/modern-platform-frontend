// TypeScript types for Supabase database schema
// Generated from migration scripts for type safety

export interface CustomerAsset {
  // Core Identity
  customer_id: string;
  customer_name?: string;
  email?: string;
  company?: string;
  access_token?: string;
  created_at?: string;
  last_accessed?: string;
  
  // Payment & Status
  payment_status?: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  content_status?: 'Pending' | 'Generating' | 'Ready' | 'Error' | 'Expired';
  usage_count?: number;
  
  // Content Storage (JSON data)
  icp_content?: ICPContent;
  cost_calculator_content?: CostCalculatorContent;
  business_case_content?: BusinessCaseContent;
  
  // Professional Development
  competency_progress?: CompetencyProgress;
  tool_access_status?: ToolAccessStatus;
  professional_milestones?: ProfessionalMilestones;
  daily_objectives?: DailyObjectives;
  user_preferences?: UserPreferences;
  detailed_icp_analysis?: DetailedICPAnalysis;
  target_buyer_personas?: TargetBuyerPersonas;
  
  // Development Planning
  development_plan_active?: boolean;
  competency_level?: string;
  achievement_ids?: string;
  last_assessment_date?: string;
  development_focus?: 'balanced' | 'strength_based' | 'gap_focused' | 'career_accelerated';
  learning_velocity?: number;
  last_action_date?: string;
  
  // Workflow & Analytics
  workflow_progress?: WorkflowProgress;
  usage_analytics?: UsageAnalytics;
  
  // Revolutionary Platform Features
  technical_translation_data?: TechnicalTranslationData;
  stakeholder_arsenal_data?: StakeholderArsenalData;
  resources_library_data?: ResourcesLibraryData;
  gamification_state?: GamificationState;
  
  // Timestamps
  updated_at?: string;
}

export interface AssessmentResult {
  id?: string;
  customer_id: string;
  assessment_date?: string;
  
  // Core Assessment Scores
  customer_analysis_score?: number;
  value_communication_score?: number;
  sales_execution_score?: number;
  overall_score?: number;
  
  // Professional Development
  total_progress_points?: number;
  competency_level?: string;
  previous_level?: string;
  
  // Assessment Metadata
  assessment_type?: 'baseline' | 'progress' | 'retake' | 'milestone';
  assessment_version?: string;
  
  // Performance Analysis
  improvement_areas?: string[];
  strength_areas?: string[];
  recommended_actions?: string[];
  
  // Detailed Competency Scores
  buyer_understanding_score?: number;
  tech_to_value_translation_score?: number;
  stakeholder_communication_score?: number;
  roi_presentation_score?: number;
  
  // Professional Context
  industry_focus?: string;
  company_stage?: 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B+';
  revenue_range?: '$0-1M' | '$1M-5M' | '$5M-10M' | '$10M+';
  
  // Session Data
  assessment_duration?: number;
  completion_percentage?: number;
  
  // Notes
  notes?: string;
  assessor_notes?: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export interface CustomerAction {
  id?: string;
  customer_id: string;
  
  // Action Details
  action_type: 'customer_meeting' | 'prospect_qualification' | 'value_proposition_delivery' | 
               'roi_presentation' | 'proposal_creation' | 'deal_closure' | 
               'referral_generation' | 'case_study_development';
  action_description: string;
  
  // Impact & Scoring
  impact_level?: 'low' | 'medium' | 'high' | 'critical';
  points_awarded: number;
  base_points?: number;
  impact_multiplier?: number;
  
  // Categorization
  category: 'customerAnalysis' | 'valueCommunication' | 'salesExecution';
  subcategory?: string;
  
  // Professional Context
  deal_size_range?: 'Under $10K' | '$10K-50K' | '$50K-250K' | '$250K+';
  stakeholder_level?: 'Individual Contributor' | 'Manager' | 'Director' | 'Executive';
  industry_context?: string;
  
  // Evidence & Verification
  evidence_link?: string;
  evidence_type?: 'meeting_notes' | 'email' | 'proposal' | 'recording' | 'document';
  verified?: boolean;
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
  skills_demonstrated?: string[];
  lessons_learned?: string;
  improvement_notes?: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}

// Content type definitions for JSON fields
export interface ICPContent {
  framework?: string;
  segments?: string[];
  confidence?: number;
  analysis?: any;
}

export interface CostCalculatorContent {
  scenarios?: string[];
  calculations?: {
    roi?: number;
    payback?: number;
    totalCost?: number;
    savings?: number;
  };
}

export interface BusinessCaseContent {
  templates?: string[];
  value?: number;
  timeline?: string;
  stakeholders?: string[];
}

export interface CompetencyProgress {
  current_level?: string;
  points_earned?: number;
  areas_of_focus?: string[];
  last_updated?: string;
}

export interface ToolAccessStatus {
  icp_analysis?: boolean;
  cost_calculator?: boolean; 
  business_case_builder?: boolean;
  advanced_features?: boolean;
}

export interface ProfessionalMilestones {
  achievements?: Array<{
    title: string;
    description: string;
    date: string;
    impact: string;
  }>;
  current_goals?: string[];
  next_milestone?: {
    target: string;
    goal: string;
  };
}

export interface DailyObjectives {
  today?: Array<{
    priority: string;
    task: string;
    timeBlock: string;
    outcome: string;
  }>;
  thisWeek?: string[];
  metrics?: {
    completionRate: number;
    focusTime: string;
    keyResults: number;
  };
}

export interface UserPreferences {
  interface_theme?: 'dark' | 'light';
  notification_settings?: any;
  workflow_preferences?: any;
}

export interface DetailedICPAnalysis {
  segments?: any[];
  scoring_criteria?: any[];
  market_analysis?: any;
}

export interface TargetBuyerPersonas {
  personas?: any[];
  stakeholder_mapping?: any;
}

export interface WorkflowProgress {
  tools_completed?: string[];
  current_step?: string;
  completion_percentage?: number;
}

export interface UsageAnalytics {
  session_count?: number;
  total_time_spent?: number;
  feature_usage?: any;
}

export interface TechnicalTranslationData {
  templates?: any[];
  translation_history?: any[];
}

export interface StakeholderArsenalData {
  stakeholder_profiles?: any[];
  communication_templates?: any[];
}

export interface ResourcesLibraryData {
  generated_resources?: any[];
  custom_templates?: any[];
}

export interface GamificationState {
  current_level?: string;
  points_balance?: number;
  achievements_unlocked?: string[];
  milestone_progress?: any;
}

// Database response types
export type SupabaseResponse<T> = {
  data: T | null;
  error: any;
};

export type CustomerAssetResponse = SupabaseResponse<CustomerAsset>;
export type CustomerAssetsResponse = SupabaseResponse<CustomerAsset[]>;
export type AssessmentResultResponse = SupabaseResponse<AssessmentResult>;
export type AssessmentResultsResponse = SupabaseResponse<AssessmentResult[]>;
export type CustomerActionResponse = SupabaseResponse<CustomerAction>;
export type CustomerActionsResponse = SupabaseResponse<CustomerAction[]>;