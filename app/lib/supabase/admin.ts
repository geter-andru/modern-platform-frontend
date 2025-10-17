// Supabase Admin Client (Service Role)
// This client has elevated permissions for server-side operations
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/app/lib/types/supabase';

let _supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null;

// Lazy-load admin client to avoid build-time errors
function getSupabaseAdmin() {
  if (_supabaseAdmin) return _supabaseAdmin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  _supabaseAdmin = createClient<Database>(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  return _supabaseAdmin;
}

// Export admin client getter
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get: (target, prop) => {
    const admin = getSupabaseAdmin();
    return (admin as any)[prop];
  }
});

// Helper functions for common admin operations
export const adminOperations = {
  // Get all users (bypass RLS)
  async getAllUsers() {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.auth.admin.listUsers();
    return { data, error };
  },

  // Create user profile
  async createUserProfile(userId: string, profileData: any) {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('customer_profiles')
      .insert({
        customer_id: userId,
        ...profileData
      });
    return { data, error };
  },

  // Get user by ID (bypass RLS)
  async getUserById(userId: string) {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('customer_profiles')
      .select('*')
      .eq('customer_id', userId)
      .single();
    return { data, error };
  },

  // Update user profile (bypass RLS)
  async updateUserProfile(userId: string, updates: any) {
    const admin = getSupabaseAdmin();
    const { data, error } = await (admin as any)
      .from('customer_profiles')
      .update(updates)
      .eq('customer_id', userId);
    return { data, error };
  },

  // Delete user and all related data
  async deleteUser(userId: string) {
    const admin = getSupabaseAdmin();
    // This will cascade delete all related records due to foreign key constraints
    const { data, error } = await admin
      .from('customer_profiles')
      .delete()
      .eq('customer_id', userId);
    return { data, error };
  },

  // Get AI generation stats (admin only)
  async getAIGenerationStats() {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('ai_resource_generations')
      .select(`
        id,
        customer_id,
        generation_status,
        quality_score,
        total_resources_generated,
        cost_usd,
        created_at
      `)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get error logs (admin only)
  async getErrorLogs(limit = 100) {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('generation_error_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  }
};

// Type-safe wrapper for admin operations
export type AdminOperations = typeof adminOperations;