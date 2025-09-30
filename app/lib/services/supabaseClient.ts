// Supabase client configuration for Next.js
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
          workflow_progress: any;
          competency_progress: any;
          tool_access_status: any;
          detailed_icp_analysis: any;
          target_buyer_personas: any;
          empathy_mapping: any;
          product_assessment: any;
          professional_milestones: any;
          daily_objectives: any;
          user_preferences: any;
          usage_analytics: any;
          export_history: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          customer_id: string;
          customer_name: string;
          company_name?: string;
          email: string;
          workflow_progress?: any;
          competency_progress?: any;
          tool_access_status?: any;
          detailed_icp_analysis?: any;
          target_buyer_personas?: any;
          empathy_mapping?: any;
          product_assessment?: any;
          professional_milestones?: any;
          daily_objectives?: any;
          user_preferences?: any;
          usage_analytics?: any;
          export_history?: any;
        };
        Update: {
          customer_name?: string;
          company_name?: string;
          email?: string;
          workflow_progress?: any;
          competency_progress?: any;
          tool_access_status?: any;
          detailed_icp_analysis?: any;
          target_buyer_personas?: any;
          empathy_mapping?: any;
          product_assessment?: any;
          professional_milestones?: any;
          daily_objectives?: any;
          user_preferences?: any;
          usage_analytics?: any;
          export_history?: any;
        };
      };
      assessment_sessions: {
        Row: {
          id: string;
          session_id: string;
          assessment_data: any;
          user_id?: string;
          email?: string;
          status: 'pending' | 'completed' | 'linked';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          session_id: string;
          assessment_data: any;
          user_id?: string;
          email?: string;
          status?: 'pending' | 'completed' | 'linked';
        };
        Update: {
          assessment_data?: any;
          user_id?: string;
          email?: string;
          status?: 'pending' | 'completed' | 'linked';
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          customer_id: string;
          full_name?: string;
          company_name?: string;
          job_title?: string;
          phone?: string;
          subscription_status?: string;
          onboarding_completed?: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          customer_id: string;
          full_name?: string;
          company_name?: string;
          job_title?: string;
          phone?: string;
          subscription_status?: string;
          onboarding_completed?: boolean;
        };
        Update: {
          customer_id?: string;
          full_name?: string;
          company_name?: string;
          job_title?: string;
          phone?: string;
          subscription_status?: string;
          onboarding_completed?: boolean;
        };
      };
      customer_sessions: {
        Row: {
          id: string;
          customer_id: string;
          session_id: string;
          pipeline_status: 'pending' | 'generating_icp' | 'generating_calculator' | 'complete' | 'failed';
          current_step: string;
          progress_data: any;
          error_count: number;
          last_error: string | null;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          customer_id: string;
          session_id: string;
          pipeline_status?: 'pending' | 'generating_icp' | 'generating_calculator' | 'complete' | 'failed';
          current_step?: string;
          progress_data?: any;
          error_count?: number;
          last_error?: string | null;
          expires_at: string;
        };
        Update: {
          pipeline_status?: 'pending' | 'generating_icp' | 'generating_calculator' | 'complete' | 'failed';
          current_step?: string;
          progress_data?: any;
          error_count?: number;
          last_error?: string | null;
          expires_at?: string;
        };
      };
    };
  };
}

// Create a single supabase client for interacting with your database
export const supabase: SupabaseClient<Database> = createClient(finalUrl, finalKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    debug: process.env.NODE_ENV === 'development',
  }
});

// Types
export interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: any;
  app_metadata?: any;
}

// Helper function to get current user
export const getCurrentUser = async (): Promise<SupabaseUser | null> => {
  try {
    // Return null in development when Supabase is not configured
    if (!isSupabaseConfigured) {
      return null;
    }
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Helper function to sign out
export const signOut = async (): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
};

// Helper function to get session
export const getSession = async () => {
  try {
    // Return null in development when Supabase is not configured
    if (!isSupabaseConfigured) {
      return null;
    }
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Helper function to check if Supabase is properly configured
export const isSupabaseConfiguredProp = (): boolean => {
  return isSupabaseConfigured;
};

// Helper functions for customer_sessions table
export const customerSessionHelpers = {
  // Create a new customer session
  async createSession(customerId: string, sessionId: string, expiresInHours: number = 24) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const { data, error } = await supabase
      .from('customer_sessions')
      .insert({
        customer_id: customerId,
        session_id: sessionId,
        pipeline_status: 'pending',
        current_step: 'initialization',
        progress_data: { started_at: new Date().toISOString() },
        error_count: 0,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    return { data, error };
  },

  // Update session status and progress
  async updateSessionStatus(sessionId: string, status: 'pending' | 'generating_icp' | 'generating_calculator' | 'complete' | 'failed', currentStep?: string, progressData?: any) {
    const updateData: any = {
      pipeline_status: status,
      updated_at: new Date().toISOString()
    };

    if (currentStep) updateData.current_step = currentStep;
    if (progressData) updateData.progress_data = progressData;

    const { data, error } = await supabase
      .from('customer_sessions')
      .update(updateData)
      .eq('session_id', sessionId)
      .select()
      .single();

    return { data, error };
  },

  // Record an error and increment error count
  async recordError(sessionId: string, errorMessage: string) {
    const { data: session } = await supabase
      .from('customer_sessions')
      .select('error_count')
      .eq('session_id', sessionId)
      .single();

    const errorCount = (session?.error_count || 0) + 1;
    const shouldFail = errorCount >= 3; // Fail after 3 errors

    const { data, error } = await supabase
      .from('customer_sessions')
      .update({
        error_count: errorCount,
        last_error: errorMessage,
        pipeline_status: shouldFail ? 'failed' : 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .select()
      .single();

    return { data, error, shouldFail };
  },

  // Get session by session ID
  async getSession(sessionId: string) {
    const { data, error } = await supabase
      .from('customer_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    return { data, error };
  },

  // Get active sessions for a customer
  async getCustomerSessions(customerId: string) {
    const { data, error } = await supabase
      .from('customer_sessions')
      .select('*')
      .eq('customer_id', customerId)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Clean up expired sessions
  async cleanupExpiredSessions() {
    const { data, error } = await supabase
      .from('customer_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString());

    return { data, error };
  }
};

export default supabase;