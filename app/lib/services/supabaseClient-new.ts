// Supabase client configuration for Next.js - Rewritten with proper types
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase environment variables are properly configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  !supabaseUrl.includes('your_supabase_') && 
  !supabaseAnonKey.includes('your_supabase_');

// Use dummy values for development when Supabase is not configured
const developmentUrl = 'https://placeholder.supabase.co';
const developmentKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxMjc2MTAsImV4cCI6MTk2MDcwMzYxMH0.development-key';

const finalUrl = isSupabaseConfigured ? supabaseUrl! : developmentUrl;
const finalKey = isSupabaseConfigured ? supabaseAnonKey! : developmentKey;

// Core data interfaces with proper typing
export interface CustomerAsset {
  id: string;
  customer_id: string;
  customer_name: string;
  company_name: string;
  email: string;
  workflow_progress: Record<string, string | number | boolean>;
  competency_progress: Record<string, string | number | boolean>;
  tool_access_status: Record<string, string | number | boolean>;
  detailed_icp_analysis: Record<string, string | number | boolean>;
  target_buyer_personas: Array<Record<string, string | number | boolean>>;
  empathy_mapping: Array<Record<string, string | number | boolean>>;
  product_assessment: Record<string, string | number | boolean>;
  professional_milestones: Array<Record<string, string | number | boolean>>;
  daily_objectives: Array<Record<string, string | number | boolean>>;
  user_preferences: Record<string, string | number | boolean>;
  usage_analytics: Record<string, string | number | boolean>;
  export_history: Array<Record<string, string | number | boolean>>;
  created_at: string;
  updated_at: string;
}

export interface CompetencyData {
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
}

export interface CompetencyAction {
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
}

export interface CompetencyMilestone {
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
}

// Create the Supabase client
export const supabase: SupabaseClient = createClient(
  finalUrl,
  finalKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// Typed helper functions
export const getCustomerAssets = async (customerId: string): Promise<{ data: CustomerAsset | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('customer_assets')
    .select('*')
    .eq('customer_id', customerId)
    .single();
  
  return { data, error };
};

export const updateCustomerAssets = async (
  customerId: string, 
  updates: Partial<CustomerAsset>
): Promise<{ data: CustomerAsset | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('customer_assets')
    .update(updates)
    .eq('customer_id', customerId)
    .select()
    .single();
  
  return { data, error };
};

export const getCompetencyData = async (userId: string): Promise<{ data: CompetencyData | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('competency_data')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
};

export const updateCompetencyData = async (
  userId: string,
  updates: Partial<CompetencyData>
): Promise<{ data: CompetencyData | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('competency_data')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  return { data, error };
};

export const getCompetencyActions = async (userId: string): Promise<{ data: CompetencyAction[] | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('competency_actions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const addCompetencyAction = async (
  action: Omit<CompetencyAction, 'id' | 'created_at'>
): Promise<{ data: CompetencyAction | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('competency_actions')
    .insert(action)
    .select()
    .single();
  
  return { data, error };
};

export const getCompetencyMilestones = async (userId: string): Promise<{ data: CompetencyMilestone[] | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('competency_milestones')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const updateCompetencyMilestone = async (
  milestoneId: string,
  updates: Partial<CompetencyMilestone>
): Promise<{ data: CompetencyMilestone | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('competency_milestones')
    .update(updates)
    .eq('id', milestoneId)
    .select()
    .single();
  
  return { data, error };
};

// Export the default client
export default supabase;
