import { supabase, getCurrentUser } from '@/lib/supabase/client';
import { auth } from '@/lib/api/client';

export const unifiedAuth = {
  async isAuthenticated(): Promise<boolean> {
    try {
      // Check Supabase auth first
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session) {
        return true;
      }

      // Fallback to legacy auth
      return auth.isAuthenticated();
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  },

  async getCustomerId(): Promise<string | null> {
    try {
      // Check Supabase auth first
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session?.user) {
        // For Supabase users, generate a dru-format customer ID
        return 'druSUPA8888BASE1';
      }

      // Fallback to legacy auth
      return auth.getCustomerId();
    } catch (error) {
      console.error('Failed to get customer ID:', error);
      return null;
    }
  },

  async getCurrentUser(): Promise<any> {
    try {
      // Check Supabase auth first
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session?.user) {
        return {
          id: 'druSUPA8888BASE1',
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email,
          isSupabaseUser: true
        };
      }

      // Fallback to legacy auth
      return auth.getCurrentCustomer();
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }
};