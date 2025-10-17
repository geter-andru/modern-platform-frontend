// Supabase client configuration for Next.js - Rewritten with proper types
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate Supabase environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// Properly typed interfaces for complex JSON fields
interface WorkflowProgress {
  currentStep: string;
  completedSteps: string[];
  totalSteps: number;
  progressPercentage: number;
  lastUpdated: string;
}

interface CompetencyProgress {
  customerAnalysis: number;
  valueCommunication: number;
  salesExecution: number;
  overallScore: number;
  currentLevel: string;
  pointsEarned: number;
  lastAssessment: string;
}

interface ToolAccessStatus {
  icpAnalysis: boolean;
  costCalculator: boolean;
  businessCase: boolean;
  exportTools: boolean;
  advancedFeatures: boolean;
  unlockedAt: Record<string, string>;
}

interface ICPAnalysis {
  companyProfile: {
    name: string;
    industry: string;
    size: string;
    revenue: string;
    description: string;
  };
  painPoints: string[];
  goals: string[];
  decisionMakers: Array<{
    role: string;
    name: string;
    influence: 'high' | 'medium' | 'low';
  }>;
  buyingProcess: string[];
  timeline: string;
  budget: string;
  score: number;
}

interface BuyerPersona {
  id: string;
  name: string;
  role: string;
  responsibilities: string[];
  painPoints: string[];
  goals: string[];
  preferredChannels: string[];
  decisionFactors: string[];
}

interface EmpathyMapping {
  personaId: string;
  thinks: string[];
  feels: string[];
  sees: string[];
  does: string[];
  pains: string[];
  gains: string[];
}

interface ProductAssessment {
  fitScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  competitiveAdvantages: string[];
  areasForImprovement: string[];
}

interface ProfessionalMilestone {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  achievedAt?: string;
  progress: number;
}

interface DailyObjective {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
  completedAt?: string;
}

interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    weeklyDigest: boolean;
  };
  dashboard: {
    layout: string;
    widgets: string[];
  };
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

interface UsageAnalytics {
  totalSessions: number;
  averageSessionDuration: number;
  toolsUsed: string[];
  lastActive: string;
  weeklyActivity: Record<string, number>;
  monthlyActivity: Record<string, number>;
}

interface ExportHistory {
  id: string;
  type: 'pdf' | 'ppt' | 'email' | 'csv';
  filename: string;
  exportedAt: string;
  size: number;
  status: 'completed' | 'failed' | 'processing';
}

// Database types for H&S Revenue Intelligence Platform
export interface Database {
  public: {
    Tables: {
      customer_assets: {
        Row: {
          id: string;
          customer_id: string;
          customer_name: string;
          company_name: string;
          email: string;
          workflow_progress: WorkflowProgress;
          competency_progress: CompetencyProgress;
          tool_access_status: ToolAccessStatus;
          detailed_icp_analysis: ICPAnalysis;
          target_buyer_personas: BuyerPersona[];
          empathy_mapping: EmpathyMapping[];
          product_assessment: ProductAssessment;
          professional_milestones: ProfessionalMilestone[];
          daily_objectives: DailyObjective[];
          user_preferences: UserPreferences;
          usage_analytics: UsageAnalytics;
          export_history: ExportHistory[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          customer_id: string;
          customer_name: string;
          company_name?: string;
          email: string;
          workflow_progress?: WorkflowProgress;
          competency_progress?: CompetencyProgress;
          tool_access_status?: ToolAccessStatus;
          detailed_icp_analysis?: ICPAnalysis;
          target_buyer_personas?: BuyerPersona[];
          empathy_mapping?: EmpathyMapping[];
          product_assessment?: ProductAssessment;
          professional_milestones?: ProfessionalMilestone[];
          daily_objectives?: DailyObjective[];
          user_preferences?: UserPreferences;
          usage_analytics?: UsageAnalytics;
          export_history?: ExportHistory[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          customer_name?: string;
          company_name?: string;
          email?: string;
          workflow_progress?: WorkflowProgress;
          competency_progress?: CompetencyProgress;
          tool_access_status?: ToolAccessStatus;
          detailed_icp_analysis?: ICPAnalysis;
          target_buyer_personas?: BuyerPersona[];
          empathy_mapping?: EmpathyMapping[];
          product_assessment?: ProductAssessment;
          professional_milestones?: ProfessionalMilestone[];
          daily_objectives?: DailyObjective[];
          user_preferences?: UserPreferences;
          usage_analytics?: UsageAnalytics;
          export_history?: ExportHistory[];
          updated_at?: string;
        };
      };
      competency_data: {
        Row: {
          id: string;
          user_id: string;
          customer_analysis: number;
          value_communication: number;
          sales_execution: number;
          overall_score: number;
          total_points: number;
          current_level: string;
          level_progress: number;
          last_updated: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          customer_analysis?: number;
          value_communication?: number;
          sales_execution?: number;
          overall_score?: number;
          total_points?: number;
          current_level?: string;
          level_progress?: number;
          last_updated?: string;
          created_at?: string;
        };
        Update: {
          customer_analysis?: number;
          value_communication?: number;
          sales_execution?: number;
          overall_score?: number;
          total_points?: number;
          current_level?: string;
          level_progress?: number;
          last_updated?: string;
        };
      };
      competency_actions: {
        Row: {
          id: string;
          user_id: string;
          action_type: string;
          category: string;
          description: string;
          points: number;
          verified: boolean;
          verified_at?: string;
          verified_by?: string;
          evidence_link?: string;
          evidence_type?: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          action_type: string;
          category: string;
          description: string;
          points: number;
          verified?: boolean;
          verified_at?: string;
          verified_by?: string;
          evidence_link?: string;
          evidence_type?: string;
          created_at?: string;
        };
        Update: {
          action_type?: string;
          category?: string;
          description?: string;
          points?: number;
          verified?: boolean;
          verified_at?: string;
          verified_by?: string;
          evidence_link?: string;
          evidence_type?: string;
        };
      };
      competency_milestones: {
        Row: {
          id: string;
          user_id: string;
          milestone_id: string;
          title: string;
          description: string;
          category: string;
          points: number;
          achieved: boolean;
          achieved_at?: string;
          progress_percentage: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          milestone_id: string;
          title: string;
          description: string;
          category: string;
          points: number;
          achieved?: boolean;
          achieved_at?: string;
          progress_percentage?: number;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          category?: string;
          points?: number;
          achieved?: boolean;
          achieved_at?: string;
          progress_percentage?: number;
        };
      };
      cost_calculations: {
        Row: {
          id: string;
          user_id: string;
          current_revenue: number;
          average_deal_size: number;
          conversion_rate: number;
          sales_cycle_length?: number;
          customer_lifetime_value?: number;
          churn_rate?: number;
          market_size?: number;
          competitive_pressure?: number;
          calculation: any;
          insights: any;
          total_cost: number;
          calculation_method: string;
          confidence?: number;
          processing_time?: number;
          status: string;
          generated_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          current_revenue: number;
          average_deal_size: number;
          conversion_rate: number;
          sales_cycle_length?: number;
          customer_lifetime_value?: number;
          churn_rate?: number;
          market_size?: number;
          competitive_pressure?: number;
          calculation?: any;
          insights?: any;
          total_cost: number;
          calculation_method?: string;
          confidence?: number;
          processing_time?: number;
          status?: string;
          generated_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          current_revenue?: number;
          average_deal_size?: number;
          conversion_rate?: number;
          sales_cycle_length?: number;
          customer_lifetime_value?: number;
          churn_rate?: number;
          market_size?: number;
          competitive_pressure?: number;
          calculation?: any;
          insights?: any;
          total_cost?: number;
          calculation_method?: string;
          confidence?: number;
          processing_time?: number;
          status?: string;
          generated_at?: string;
          updated_at?: string;
        };
      };
      business_cases: {
        Row: {
          id: string;
          user_id: string;
          template: string;
          customer_data: any;
          business_case: any;
          recommendations: any;
          confidence?: number;
          source: string;
          template_version?: string;
          analysis_method?: string;
          processing_time?: number;
          status: string;
          generated_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          template: string;
          customer_data: any;
          business_case: any;
          recommendations?: any;
          confidence?: number;
          source?: string;
          template_version?: string;
          analysis_method?: string;
          processing_time?: number;
          status?: string;
          generated_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          template?: string;
          customer_data?: any;
          business_case?: any;
          recommendations?: any;
          confidence?: number;
          source?: string;
          template_version?: string;
          analysis_method?: string;
          processing_time?: number;
          status?: string;
          generated_at?: string;
          updated_at?: string;
        };
      };
      customer_actions: {
        Row: {
          id: string;
          user_id: string;
          action_type: string;
          action_title: string;
          action_description?: string;
          category: string;
          customer_id?: string;
          customer_name?: string;
          product_context?: string;
          business_context?: string;
          impact_level: string;
          points_awarded: number;
          competency_impact: any;
          revenue_impact?: number;
          customer_satisfaction?: number;
          business_outcome?: string;
          lessons_learned?: string;
          action_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          action_type: string;
          action_title: string;
          action_description?: string;
          category: string;
          customer_id?: string;
          customer_name?: string;
          product_context?: string;
          business_context?: string;
          impact_level?: string;
          points_awarded?: number;
          competency_impact?: any;
          revenue_impact?: number;
          customer_satisfaction?: number;
          business_outcome?: string;
          lessons_learned?: string;
          action_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          action_type?: string;
          action_title?: string;
          action_description?: string;
          category?: string;
          customer_id?: string;
          customer_name?: string;
          product_context?: string;
          business_context?: string;
          impact_level?: string;
          points_awarded?: number;
          competency_impact?: any;
          revenue_impact?: number;
          customer_satisfaction?: number;
          business_outcome?: string;
          lessons_learned?: string;
          action_date?: string;
          updated_at?: string;
        };
      };
      export_history: {
        Row: {
          id: string;
          user_id: string;
          export_type: string;
          format: string;
          file_name: string;
          file_size: number;
          download_url: string;
          expires_at: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          export_type: string;
          format: string;
          file_name: string;
          file_size: number;
          download_url: string;
          expires_at: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          export_type?: string;
          format?: string;
          file_name?: string;
          file_size?: number;
          download_url?: string;
          expires_at?: string;
          status?: string;
          updated_at?: string;
        };
      };
      assessment_data: {
        Row: {
          id: string;
          customer_id: string;
          assessment_data: any;
          updated_at: string;
        };
        Insert: {
          customer_id: string;
          assessment_data: any;
          updated_at?: string;
        };
        Update: {
          assessment_data?: any;
          updated_at?: string;
        };
      };
      competency_baselines: {
        Row: {
          id: string;
          customer_id: string;
          baseline_data: any;
          updated_at: string;
        };
        Insert: {
          customer_id: string;
          baseline_data: any;
          updated_at?: string;
        };
        Update: {
          baseline_data?: any;
          updated_at?: string;
        };
      };
      compelling_aspects_shown: {
        Row: {
          id: string;
          customer_id: string;
          aspect_type: string;
          tool_name?: string;
          timestamp: string;
        };
        Insert: {
          customer_id: string;
          aspect_type: string;
          tool_name?: string;
          timestamp: string;
        };
        Update: {
          aspect_type?: string;
          tool_name?: string;
          timestamp?: string;
        };
      };
      revelation_triggers: {
        Row: {
          id: string;
          customer_id: string;
          trigger_type: string;
          timestamp: string;
        };
        Insert: {
          customer_id: string;
          trigger_type: string;
          timestamp: string;
        };
        Update: {
          trigger_type?: string;
          timestamp?: string;
        };
      };
      engagement_states: {
        Row: {
          id: string;
          customer_id: string;
          state: any;
          timestamp: string;
        };
        Insert: {
          customer_id: string;
          state: any;
          timestamp: string;
        };
        Update: {
          state?: any;
          timestamp?: string;
        };
      };
      interaction_depth: {
        Row: {
          id: string;
          customer_id: string;
          tool: string;
          depth_data: any;
          timestamp: string;
        };
        Insert: {
          customer_id: string;
          tool: string;
          depth_data: any;
          timestamp: string;
        };
        Update: {
          tool?: string;
          depth_data?: any;
          timestamp?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Create and export the Supabase client with proper typing
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// Export types for use in other files
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Helper functions with proper typing
export const getCustomerAssets = async (customerId: string) => {
  const { data, error } = await supabase
    .from('customer_assets')
    .select('*')
    .eq('customer_id', customerId)
    .single();
  
  return { data, error };
};

export const updateCustomerAssets = async (
  customerId: string, 
  updates: Record<string, any>
) => {
  const { data, error } = await (supabase as any)
    .from('customer_assets')
    .update(updates)
    .eq('customer_id', customerId)
    .select()
    .single();
  
  return { data, error };
};

export const getCompetencyData = async (userId: string) => {
  const { data, error } = await supabase
    .from('competency_data')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
};

export const updateCompetencyData = async (
  userId: string,
  updates: Record<string, any>
) => {
  const { data, error } = await (supabase as any)
    .from('competency_data')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  return { data, error };
};

export const getCompetencyActions = async (userId: string) => {
  const { data, error } = await supabase
    .from('competency_actions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const addCompetencyAction = async (
  action: Record<string, any>
) => {
  const { data, error } = await (supabase as any)
    .from('competency_actions')
    .insert(action)
    .select()
    .single();
  
  return { data, error };
};

export const getCompetencyMilestones = async (userId: string) => {
  const { data, error } = await supabase
    .from('competency_milestones')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const updateCompetencyMilestone = async (
  milestoneId: string,
  updates: Record<string, any>
) => {
  const { data, error } = await (supabase as any)
    .from('competency_milestones')
    .update(updates)
    .eq('id', milestoneId)
    .select()
    .single();
  
  return { data, error };
};

// Export the default client
export default supabase;
