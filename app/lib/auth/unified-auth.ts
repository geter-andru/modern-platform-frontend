import { supabase } from '@/app/lib/supabase/client';

export const unifiedAuth = {
  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return !error && !!session;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  },

  async getCustomerId(): Promise<string | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session?.user) {
        return session.user.id;
      }
      return null;
    } catch (error) {
      console.error('Failed to get customer ID:', error);
      return null;
    }
  },

  async getCurrentUser(): Promise<any> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session?.user) {
        return {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email,
          isSupabaseUser: true
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }
};