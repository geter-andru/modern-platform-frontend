// Pure Supabase Authentication System
// Replaces all legacy auth systems with Supabase-only implementation

import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string | undefined;
  user_metadata: Record<string, any>;
  app_metadata: Record<string, any>;
  isAdmin: boolean;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class SupabaseAuthService {
  private currentUser: AuthUser | null = null;
  private currentSession: Session | null = null;
  private authListeners: ((user: AuthUser | null) => void)[] = [];

  constructor() {
    // Listen to auth state changes
    supabase.auth.onAuthStateChange(this.handleAuthStateChange.bind(this));
    // Initialize session on startup
    this.initializeSession();
  }

  private async initializeSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        this.currentSession = session;
        this.currentUser = await this.transformUser(session.user);
        this.notifyListeners(this.currentUser);
      }
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  }

  private async handleAuthStateChange(event: AuthChangeEvent, session: Session | null) {
    console.log('🔐 Auth state change:', event, session?.user?.email);
    
    this.currentSession = session;
    
    if (session?.user) {
      this.currentUser = await this.transformUser(session.user);
    } else {
      this.currentUser = null;
    }
    
    this.notifyListeners(this.currentUser);
    
    // Handle specific events
    switch (event) {
      case 'SIGNED_IN':
        console.log('✅ User signed in:', this.currentUser?.email);
        // Ensure user profile exists
        await this.ensureUserProfile(session.user);
        break;
      case 'SIGNED_OUT':
        console.log('👋 User signed out');
        break;
      case 'TOKEN_REFRESHED':
        console.log('🔄 Token refreshed');
        break;
    }
  }

  private async transformUser(user: User): Promise<AuthUser> {
    const isAdmin = await this.checkAdminStatus(user);
    
    return {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata || {},
      app_metadata: user.app_metadata || {},
      isAdmin
    };
  }

  private async checkAdminStatus(user: User): Promise<boolean> {
    if (!user.email) return false;
    
    // Check admin criteria
    const adminEmails = ['admin@andru.ai', 'support@andru.ai'];
    const adminDomains = ['@andru.ai'];
    
    return adminEmails.includes(user.email) || 
           adminDomains.some(domain => user.email!.endsWith(domain));
  }

  private async ensureUserProfile(user: User) {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('customer_profiles')
        .select('id')
        .eq('customer_id', user.id)
        .single();

      if (!existingProfile) {
        // Create profile
        const { error } = await supabase
          .from('customer_profiles')
          .insert({
            customer_id: user.id,
            email: user.email || '',
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            company_name: user.user_metadata?.company_name || ''
          });

        if (error) {
          console.error('Error creating user profile:', error);
        } else {
          console.log('✅ User profile created');
        }
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  }

  private notifyListeners(user: AuthUser | null) {
    this.authListeners.forEach(listener => listener(user));
  }

  // Public API
  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.isAdmin || false;
  }

  // Sign in with Google OAuth
  async signInWithGoogle(redirectTo?: string) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      throw error;
    }

    return data;
  }

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }

    this.currentUser = null;
    this.currentSession = null;
  }

  // Get session for server-side use
  async getServerSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }

    return session;
  }

  // Subscribe to auth changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    this.authListeners.push(callback);
    
    // Call immediately with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.authListeners.indexOf(callback);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }

  // Admin functions (using service role)
  async getUsers() {
    if (!this.isAdmin()) {
      throw new Error('Admin access required');
    }

    return await supabaseAdmin.auth.admin.listUsers();
  }

  async deleteUser(userId: string) {
    if (!this.isAdmin()) {
      throw new Error('Admin access required');
    }

    return await supabaseAdmin.auth.admin.deleteUser(userId);
  }
}

// Create singleton instance
export const authService = new SupabaseAuthService();

// Legacy compatibility layer (to be removed after migration)
export const legacyAuth = {
  isAuthenticated: () => authService.isAuthenticated(),
  getCurrentUser: () => authService.getCurrentUser(),
  getCustomerId: () => authService.getCurrentUser()?.id || null,
  getCurrentCustomer: () => {
    const user = authService.getCurrentUser();
    if (!user) return null;
    
    return {
      id: user.id,
      customerId: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email,
      isAdmin: user.isAdmin
    };
  },
  login: async (email: string, password?: string) => {
    // For backward compatibility - redirect to proper auth
    throw new Error('Use authService.signInWithGoogle() instead');
  }
};

// Export main auth service as default
export default authService;