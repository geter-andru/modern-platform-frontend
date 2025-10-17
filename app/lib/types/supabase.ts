/**
 * Minimal Supabase Type Definitions for MVP
 *
 * This file provides minimal type safety while allowing the app to build successfully.
 * For production, replace this with auto-generated types from Supabase CLI:
 *
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > supabase.ts
 *
 * Backup of full manual types: supabase.ts.backup
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Core tables with minimal typing
      customer_assets: {
        Row: {
          customer_id: string;
          customer_name?: string;
          email?: string;
          company?: string;
          payment_status?: string;
          content_status?: string;
          icp_content?: Json;
          cost_calculator_content?: Json;
          business_case_content?: Json;
          competency_progress?: Json;
          tool_access_status?: Json;
          workflow_progress?: Json;
          usage_analytics?: Json;
          created_at?: string;
          updated_at?: string;
          [key: string]: any; // Allow additional fields
        };
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };

      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          customer_id?: string;
          full_name?: string;
          company?: string;
          preferences?: Json;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
          [key: string]: any;
        };
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };

      assessment_sessions: {
        Row: {
          id: string;
          session_id: string;
          user_id?: string;
          user_email?: string;
          assessment_data?: Json;
          status?: string;
          created_at?: string;
          updated_at?: string;
          [key: string]: any;
        };
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };

      assessment_results: {
        Row: {
          id: string;
          customer_id: string;
          customer_analysis_score?: number;
          value_communication_score?: number;
          sales_execution_score?: number;
          overall_score?: number;
          competency_level?: string;
          created_at?: string;
          updated_at?: string;
          [key: string]: any;
        };
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };

      competency_data: {
        Row: {
          id: string;
          user_id: string;
          customer_analysis?: number;
          value_communication?: number;
          sales_execution?: number;
          overall_score?: number;
          current_level?: string;
          cost_calculator_unlocked?: boolean;
          business_case_unlocked?: boolean;
          resources_unlocked?: boolean;
          created_at?: string;
          updated_at?: string;
          [key: string]: any;
        };
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };

      customer_actions: {
        Row: {
          id: string;
          customer_id?: string;
          user_id?: string;
          action_type: string;
          action_description?: string;
          points_awarded?: number;
          category?: string;
          action_date?: string;
          created_at?: string;
          updated_at?: string;
          [key: string]: any;
        };
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };

      resources: {
        Row: {
          id: string;
          customer_id: string;
          tier?: number;
          category?: string;
          title: string;
          description?: string;
          content?: Json;
          generation_status?: string;
          created_at?: string;
          updated_at?: string;
          [key: string]: any;
        };
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };

      resource_exports: {
        Row: {
          id: string;
          resource_id: string;
          customer_id: string;
          export_format: string;
          export_status: string;
          download_url?: string;
          created_at?: string;
          [key: string]: any;
        };
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };

      application_logs: {
        Row: {
          id: string;
          timestamp: string;
          level: 'debug' | 'info' | 'warn' | 'error';
          message: string;
          context?: Json;
          user_id?: string | null;
          session_id?: string | null;
          url?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at: string;
          [key: string]: any;
        };
        Insert: {
          id?: string;
          timestamp?: string;
          level: 'debug' | 'info' | 'warn' | 'error';
          message: string;
          context?: Json;
          user_id?: string | null;
          session_id?: string | null;
          url?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          timestamp?: string;
          level?: 'debug' | 'info' | 'warn' | 'error';
          message?: string;
          context?: Json;
          user_id?: string | null;
          session_id?: string | null;
          url?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
      };

      customer_sessions: {
        Row: {
          id: string;
          customer_id: string;
          session_id: string;
          pipeline_status: string;
          current_step: string;
          progress_data?: Json;
          error_count?: number;
          last_error?: string;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
          [key: string]: any;
        };
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };

      // All other tables - flexible typing
      [key: string]: {
        Row: Record<string, any>;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };
    };

    Views: {
      [key: string]: {
        Row: Record<string, any>;
      };
    };

    Functions: {
      [key: string]: {
        Args: Record<string, any>;
        Returns: any;
      };
    };

    Enums: {
      [key: string]: string;
    };
  };
}

// Helper types for common patterns
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
