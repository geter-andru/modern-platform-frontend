// Pure Supabase Authentication System
// Replaces all legacy auth systems with Supabase-only implementation

import { supabase } from '@/app/lib/supabase/client';
import { supabaseAdmin } from '@/app/lib/supabase/admin';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { linkAnonymousSessionToUser } from '../analytics/publicPageTracking';

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
  private refreshTimer: NodeJS.Timeout | null = null;
  private initializationPromise: Promise<void> | null = null;
  private isInitialized = false;

  constructor() {
    console.log('🔐 [AuthService] Initializing Supabase Auth Service...');

    // Listen to auth state changes
    supabase.auth.onAuthStateChange(this.handleAuthStateChange.bind(this));
    // Initialize session on startup (track completion)
    this.initializationPromise = this.initializeSession();
    // Start proactive token refresh
    this.startTokenRefreshTimer();
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

  private async initializeSession(): Promise<void> {
    console.log('🔐 [AuthService] Initializing session from storage...');
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('🔐 [AuthService] Error getting session:', error);
        this.isInitialized = true;
        return;
      }

      this.logSessionDetails('Session initialized', session);

      if (session) {
        this.currentSession = session;
        this.currentUser = await this.transformUser(session.user);
        console.log('🔐 [AuthService] ✅ User restored from session:', this.currentUser.email);
        this.isInitialized = true;
        this.notifyListeners(this.currentUser);
      } else {
        console.log('🔐 [AuthService] No existing session found (user not logged in)');
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('🔐 [AuthService] ❌ Error initializing session:', error);
      this.isInitialized = true;
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
          // Start token refresh timer for restored session
          this.startTokenRefreshTimer();
        } else {
          console.log('🔐 [AuthService] No stored session found (user not logged in)');
        }
        break;
      case 'SIGNED_IN':
        console.log('🔐 [AuthService] ✅ User signed in successfully:', this.currentUser?.email);
        // Ensure user profile exists
        if (session?.user) {
          await this.ensureUserProfile(session.user);

          // Link anonymous session to authenticated user for funnel tracking
          if (session.access_token) {
            console.log('🔗 [AuthService] Linking anonymous session to user:', session.user.id);
            await linkAnonymousSessionToUser(session.user.id, session.access_token);
          }

          // Link completed assessment to user account (if any)
          await this.linkAssessmentToUser(session.user, session.access_token);
        }
        // Restart token refresh timer with new session
        this.startTokenRefreshTimer();
        break;
      case 'SIGNED_OUT':
        console.log('🔐 [AuthService] 👋 User signed out');
        // Stop token refresh timer
        this.stopTokenRefreshTimer();
        break;
      case 'TOKEN_REFRESHED':
        console.log('🔐 [AuthService] 🔄 Token refreshed successfully');
        // Restart token refresh timer with updated expiry
        this.startTokenRefreshTimer();
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

    const authUser = {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata || {},
      app_metadata: user.app_metadata || {},
      isAdmin
    };

    console.log('🔐 [AuthService] User transformed:', {
      email: authUser.email,
      isAdmin: authUser.isAdmin
    });

    return authUser;
  }

  private async checkAdminStatus(user: User): Promise<boolean> {
    if (!user.email) return false;

    // Check admin criteria
    const adminEmails = [
      'admin@andru.ai',
      'support@andru.ai',
      'geter@humusnshore.org' // Founder admin access
    ];
    const adminDomains = ['@andru.ai'];

    const isAdmin = adminEmails.includes(user.email) ||
           adminDomains.some(domain => user.email!.endsWith(domain));

    console.log(`🔐 [AuthService] Admin check for ${user.email}: ${isAdmin ? '✅ IS ADMIN' : '❌ NOT ADMIN'}`);

    return isAdmin;
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

  private async linkAssessmentToUser(user: User, accessToken: string) {
    if (!user.email) {
      console.log('🔗 [AuthService] No email for assessment linking');
      return;
    }

    console.log('🔗 [AuthService] Checking for assessment sessions to link:', user.email);

    try {
      // Check if there's a completed assessment for this email that hasn't been linked yet
      const { data: assessments, error: selectError } = await supabase
        .from('assessment_sessions')
        .select('id, session_id, overall_score, buyer_score, created_at')
        .eq('user_email', user.email)
        .eq('status', 'completed_awaiting_signup')
        .is('user_id', null)
        .order('created_at', { ascending: false });

      if (selectError) {
        console.error('🔗 [AuthService] ❌ Error checking assessments:', selectError);
        return;
      }

      if (!assessments || assessments.length === 0) {
        console.log('🔗 [AuthService] No assessment sessions found to link');
        return;
      }

      console.log(`🔗 [AuthService] Found ${assessments.length} assessment(s) to link`);

      // Link all matching assessments to the user
      const { data: updated, error: updateError } = await (supabase
        .from('assessment_sessions') as any)
        .update({
          user_id: user.id,
          status: 'linked',
          updated_at: new Date().toISOString()
        })
        .eq('user_email', user.email)
        .eq('status', 'completed_awaiting_signup')
        .is('user_id', null)
        .select('id, session_id') as {
          data: { id: string; session_id: string }[] | null;
          error: any
        };

      if (updateError) {
        console.error('🔗 [AuthService] ❌ Error linking assessments:', updateError);
        return;
      }

      console.log('🔗 [AuthService] ✅ Successfully linked assessments to user:', {
        userId: user.id,
        email: user.email,
        linkedCount: updated?.length || 0,
        sessionIds: updated?.map(a => a.session_id)
      });
    } catch (error) {
      console.error('🔗 [AuthService] ❌ Unexpected error linking assessments:', error);
    }
  }

  private notifyListeners(user: AuthUser | null) {
    this.authListeners.forEach(listener => listener(user));
  }

  /**
   * Start proactive token refresh timer
   * Refreshes tokens 5 minutes before expiry to avoid interruptions
   */
  private startTokenRefreshTimer() {
    // Clear existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Only run in browser
    if (typeof window === 'undefined') return;

    const checkAndRefresh = async () => {
      const session = this.currentSession;

      if (!session?.expires_at) {
        // No session, check again in 1 minute
        this.refreshTimer = setTimeout(checkAndRefresh, 60 * 1000);
        return;
      }

      // Calculate time until expiry
      const expiresAt = session.expires_at * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;

      // Refresh 5 minutes before expiry (or immediately if less than 5 minutes left)
      const refreshBuffer = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (timeUntilExpiry <= refreshBuffer) {
        console.log('🔄 [AuthService] Token expiring soon, refreshing proactively...', {
          expiresIn: Math.round(timeUntilExpiry / 1000) + 's'
        });

        try {
          // Supabase will automatically refresh using the refresh token
          const { data, error } = await supabase.auth.refreshSession();

          if (error) {
            console.error('❌ [AuthService] Token refresh failed:', error);
            // Session expired, clear state
            this.currentSession = null;
            this.currentUser = null;
            this.notifyListeners(null);
          } else if (data.session) {
            console.log('✅ [AuthService] Token refreshed successfully');
            // Session will be updated via onAuthStateChange handler
          }
        } catch (err) {
          console.error('❌ [AuthService] Token refresh error:', err);
        }

        // Check again in 5 minutes
        this.refreshTimer = setTimeout(checkAndRefresh, 5 * 60 * 1000);
      } else {
        // Schedule refresh for 5 minutes before expiry
        const refreshIn = timeUntilExpiry - refreshBuffer;
        console.log(`⏰ [AuthService] Token refresh scheduled in ${Math.round(refreshIn / 1000 / 60)} minutes`);
        this.refreshTimer = setTimeout(checkAndRefresh, refreshIn);
      }
    };

    // Start checking
    checkAndRefresh();
  }

  /**
   * Stop token refresh timer (cleanup)
   */
  private stopTokenRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
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
    this.stopTokenRefreshTimer();
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

    // Wait for initialization to complete before calling callback
    if (this.isInitialized) {
      // Already initialized, call immediately
      callback(this.currentUser);
    } else if (this.initializationPromise) {
      // Still initializing, wait for completion
      this.initializationPromise.then(() => {
        callback(this.currentUser);
      });
    } else {
      // Fallback: call immediately (shouldn't happen)
      callback(this.currentUser);
    }

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

// SINGLETON FACTORY: Create instance only in browser context
// During SSR/build, this module may be imported multiple times
// This function ensures only one instance exists in browser
// Uses global window storage to survive hot module reloads in development
function getAuthService(): SupabaseAuthService {
  // Server-side rendering: Don't create real instance
  if (typeof window === 'undefined') {
    // Return minimal stub for SSR compatibility
    return {
      getCurrentUser: () => null,
      getCurrentSession: () => null,
      isAuthenticated: () => false,
      isAdmin: () => false,
      signInWithGoogle: async () => ({ provider: 'google', url: '' }),
      signOut: async () => {},
      getServerSession: async () => null,
      onAuthStateChange: () => () => {},
      getUsers: async () => ({ data: { users: [] }, error: null }),
      deleteUser: async () => ({ data: {}, error: null })
    } as any;
  }

  // Browser: Create singleton instance using global window storage
  // This survives hot module reloads in development
  if (!(window as any).__authServiceInstance) {
    console.log('🔐 [AuthService] Creating singleton instance...');
    (window as any).__authServiceInstance = new SupabaseAuthService();
  } else {
    console.log('🔐 [AuthService] Reusing existing singleton instance');
  }

  return (window as any).__authServiceInstance;
}

// LAZY SINGLETON: Use Proxy for lazy initialization
// This prevents eager execution during module import (SSR/HMR)
// Instance only created on first property access in browser
export const authService = new Proxy({} as SupabaseAuthService, {
  get(target, prop) {
    const instance = getAuthService();
    return typeof instance[prop as keyof SupabaseAuthService] === 'function'
      ? (instance[prop as keyof SupabaseAuthService] as Function).bind(instance)
      : instance[prop as keyof SupabaseAuthService];
  }
});

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
