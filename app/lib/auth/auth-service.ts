// Pure Supabase Authentication System
// Replaces all legacy auth systems with Supabase-only implementation

import { supabase } from '@/app/lib/supabase/client';
import { supabaseAdmin } from '@/app/lib/supabase/admin';
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
  private sessionDebugEnabled = false; // Disable verbose debugging during build

  constructor() {
    console.log('🔐 [AuthService] Initializing Supabase Auth Service...');
    // Listen to auth state changes
    supabase.auth.onAuthStateChange(this.handleAuthStateChange.bind(this));
    // Initialize session on startup
    this.initializeSession();
  }

  /**
   * Helper to safely log session details without exposing tokens
   */
  private logSessionDetails(label: string, session: Session | null) {
    if (!this.sessionDebugEnabled) return;

    if (session) {
      console.log(`🔐 [AuthService] ${label}:`, {
        user: {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role
        },
        tokenPresent: !!session.access_token,
        tokenExpiry: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'none',
        tokenExpiresIn: session.expires_at ? `${Math.round((session.expires_at * 1000 - Date.now()) / 1000)}s` : 'none',
        isExpired: session.expires_at ? (Date.now() / 1000 > session.expires_at) : false
      });
    } else {
      console.log(`🔐 [AuthService] ${label}: No session`);
    }
  }

  private async initializeSession() {
    console.log('🔐 [AuthService] Initializing session from storage...');
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('🔐 [AuthService] Error getting session:', error);
        return;
      }

      this.logSessionDetails('Session initialized', session);

      if (session) {
        this.currentSession = session;
        this.currentUser = await this.transformUser(session.user);
        console.log('🔐 [AuthService] ✅ User restored from session:', this.currentUser.email);
        this.notifyListeners(this.currentUser);
      } else {
        console.log('🔐 [AuthService] No existing session found (user not logged in)');
      }
    } catch (error) {
      console.error('🔐 [AuthService] ❌ Error initializing session:', error);
    }
  }

  private async handleAuthStateChange(event: AuthChangeEvent, session: Session | null) {
    console.log(`🔐 [AuthService] Auth state change: ${event}`);
    this.logSessionDetails(`After ${event}`, session);

    this.currentSession = session;

    if (session?.user) {
      this.currentUser = await this.transformUser(session.user);
      console.log(`🔐 [AuthService] Current user set:`, {
        id: this.currentUser.id,
        email: this.currentUser.email,
        isAdmin: this.currentUser.isAdmin
      });
    } else {
      this.currentUser = null;
      console.log('🔐 [AuthService] Current user cleared');
    }

    this.notifyListeners(this.currentUser);
    console.log(`🔐 [AuthService] Notified ${this.authListeners.length} listener(s)`);

    // Handle specific events
    switch (event) {
      case 'INITIAL_SESSION':
        console.log('🔐 [AuthService] 🎯 Initial session loaded from storage');
        if (session?.user) {
          console.log('🔐 [AuthService] ✅ Restored user session:', this.currentUser?.email);
        } else {
          console.log('🔐 [AuthService] No stored session found (user not logged in)');
        }
        break;
      case 'SIGNED_IN':
        console.log('🔐 [AuthService] ✅ User signed in successfully:', this.currentUser?.email);
        // Ensure user profile exists
        if (session?.user) {
          await this.ensureUserProfile(session.user);
        }
        break;
      case 'SIGNED_OUT':
        console.log('🔐 [AuthService] 👋 User signed out');
        break;
      case 'TOKEN_REFRESHED':
        console.log('🔐 [AuthService] 🔄 Token refreshed successfully');
        break;
      case 'USER_UPDATED':
        console.log('🔐 [AuthService] 👤 User data updated');
        break;
      case 'PASSWORD_RECOVERY':
        console.log('🔐 [AuthService] 🔑 Password recovery initiated');
        break;
      default:
        console.log(`🔐 [AuthService] Unhandled event: ${event}`);
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
    console.log('🔐 [AuthService] Ensuring user profile exists for:', user.email);
    try {
      // Check if profile exists
      const { data: existingProfile, error: selectError } = await supabase
        .from('customer_assets')
        .select('customer_id')
        .eq('customer_id', user.id)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        // PGRST116 = no rows returned, which is expected for new users
        console.error('🔐 [AuthService] ❌ Error checking profile:', selectError);
        return;
      }

      if (!existingProfile) {
        console.log('🔐 [AuthService] No existing profile found, creating new profile...');
        // Create profile
        const { error } = await (supabase as any)
          .from('customer_assets')
          .insert({
            customer_id: user.id,
            email: user.email || '',
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            company_name: user.user_metadata?.company_name || ''
          });

        if (error) {
          console.error('🔐 [AuthService] ❌ Error creating user profile:', error.message);
          console.error('🔐 [AuthService] Error details:', {
            code: error.code,
            hint: error.hint,
            details: error.details
          });
        } else {
          console.log('🔐 [AuthService] ✅ User profile created successfully');
        }
      } else {
        console.log('🔐 [AuthService] ✅ User profile already exists');
      }
    } catch (error) {
      console.error('🔐 [AuthService] ❌ Unexpected error ensuring user profile:', error);
    }
  }

  private notifyListeners(user: AuthUser | null) {
    this.authListeners.forEach(listener => listener(user));
  }

  // Public API
  getCurrentUser(): AuthUser | null {
    if (this.sessionDebugEnabled && this.currentUser) {
      console.log('🔐 [AuthService] getCurrentUser() called:', {
        id: this.currentUser.id,
        email: this.currentUser.email
      });
    }
    return this.currentUser;
  }

  getCurrentSession(): Session | null {
    if (this.sessionDebugEnabled) {
      this.logSessionDetails('getCurrentSession() called', this.currentSession);
    }
    return this.currentSession;
  }

  isAuthenticated(): boolean {
    const authenticated = !!this.currentUser;
    if (this.sessionDebugEnabled) {
      console.log('🔐 [AuthService] isAuthenticated():', authenticated);
    }
    return authenticated;
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
    console.log('🔐 [AuthService] getServerSession() called...');
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('🔐 [AuthService] ❌ Error getting server session:', error);
      throw error;
    }

    this.logSessionDetails('Server session retrieved', session);
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
