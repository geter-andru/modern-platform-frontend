// Enhanced Auth Service for Next.js Platform
// Based on React SPA's authService.js patterns with Supabase integration

import Cookies from 'js-cookie';
import { supabase, getCurrentUser as getSupabaseUser } from '../supabase/client';

interface AuthSession {
  customerId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  customer: CustomerProfile | null;
}

interface CustomerProfile {
  id: string;
  customerId: string;
  name: string;
  customerName: string;
  email: string;
  company: string;
  status: string;
  isAdmin?: boolean;
  demoMode?: boolean;
  hasPersonalizedICP?: boolean;
  hasDetailedAnalysis?: boolean;
  adminAccess?: boolean;
  paymentStatus?: string;
}

class AuthService {
  private static instance: AuthService;
  private session: AuthSession | null = null;
  
  // Cookie names
  private readonly TOKEN_COOKIE = 'hs_auth_token';
  private readonly REFRESH_COOKIE = 'hs_refresh_token';
  private readonly CUSTOMER_ID_COOKIE = 'hs_customer_id';
  private readonly SESSION_COOKIE = 'hs_session';

  constructor() {
    if (AuthService.instance) {
      return AuthService.instance;
    }
    AuthService.instance = this;
    this.loadSessionFromStorage();
  }

  // Load session from cookies on initialization
  private loadSessionFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const sessionData = Cookies.get(this.SESSION_COOKIE);
      if (sessionData) {
        this.session = JSON.parse(sessionData);
        // Validate session hasn't expired
        if (this.session && this.session.expiresAt < Date.now()) {
          this.clearSession();
        }
      }
    } catch (error) {
      console.warn('Failed to load session from storage:', error);
      this.clearSession();
    }
  }

  // Save session to cookies
  private saveSessionToStorage(session: AuthSession): void {
    if (typeof window === 'undefined') return;
    
    try {
      Cookies.set(this.TOKEN_COOKIE, session.accessToken, { expires: 1 });
      Cookies.set(this.REFRESH_COOKIE, session.refreshToken, { expires: 7 });
      Cookies.set(this.CUSTOMER_ID_COOKIE, session.customerId, { expires: 7 });
      Cookies.set(this.SESSION_COOKIE, JSON.stringify(session), { expires: 1 });
    } catch (error) {
      console.error('Failed to save session to storage:', error);
    }
  }

  // Clear session from cookies
  private clearSession(): void {
    this.session = null;
    if (typeof window === 'undefined') return;
    
    Cookies.remove(this.TOKEN_COOKIE);
    Cookies.remove(this.REFRESH_COOKIE);
    Cookies.remove(this.CUSTOMER_ID_COOKIE);
    Cookies.remove(this.SESSION_COOKIE);
  }

  // Supabase authentication methods
  async loginWithSupabase(): Promise<{ success: boolean; data?: CustomerProfile; error?: string }> {
    try {
      const supabaseUser = await getSupabaseUser();
      if (!supabaseUser) {
        return {
          success: false,
          error: 'No Supabase user found. Please sign in.'
        };
      }

      // Create customer profile from Supabase user
      const customer: CustomerProfile = {
        id: 'SUPABASE_USER',
        customerId: 'SUPABASE_USER',
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email || 'Supabase User',
        customerName: supabaseUser.user_metadata?.full_name || supabaseUser.email || 'Supabase User',
        email: supabaseUser.email || '',
        company: supabaseUser.user_metadata?.company || 'Your Company',
        status: 'active',
        isAdmin: false,
        demoMode: false,
        hasPersonalizedICP: true,
        hasDetailedAnalysis: true,
        paymentStatus: 'Completed' // Supabase users get full access
      };

      // Create session
      const session: AuthSession = {
        customerId: 'SUPABASE_USER',
        accessToken: 'supabase-auth',
        refreshToken: `supabase_refresh_${Date.now()}`,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        customer
      };

      this.session = session;
      this.saveSessionToStorage(session);

      return { success: true, data: customer };
    } catch (error: any) {
      return { 
        success: false, 
        error: 'Supabase authentication failed. Please try again.' 
      };
    }
  }

  // Check if user is authenticated via Supabase
  async isSupabaseAuthenticated(): Promise<boolean> {
    try {
      const user = await getSupabaseUser();
      return !!user;
    } catch {
      return false;
    }
  }

  // Enhanced login with multiple authentication patterns
  async login(customerId: string, accessToken?: string): Promise<{ success: boolean; data?: CustomerProfile; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const customer = this.getCustomerProfile(customerId);
      if (!customer) {
        return {
          success: false,
          error: 'Customer not found. Please check your Customer ID.'
        };
      }

      // Validate admin access tokens
      if (customer.isAdmin && accessToken) {
        const validAdminTokens = ['admin-demo-token-2025', 'test-token-123456'];
        if (!validAdminTokens.includes(accessToken)) {
          return {
            success: false,
            error: 'Invalid admin access token.'
          };
        }
      }

      // Create session
      const session: AuthSession = {
        customerId,
        accessToken: accessToken || `token_${customerId}_${Date.now()}`,
        refreshToken: `refresh_${customerId}_${Date.now()}`,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        customer
      };

      this.session = session;
      this.saveSessionToStorage(session);

      return { success: true, data: customer };
    } catch (error: any) {
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      };
    }
  }

  // Logout and clear session
  logout(): void {
    this.clearSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (!this.session) return false;
    if (this.session.expiresAt < Date.now()) {
      this.clearSession();
      return false;
    }
    return true;
  }

  // Get current session
  getCurrentSession(): AuthSession | null {
    if (!this.isAuthenticated()) return null;
    return this.session;
  }

  // Get current customer
  getCurrentCustomer(): CustomerProfile | null {
    const session = this.getCurrentSession();
    return session?.customer || null;
  }

  // Get customer ID
  getCustomerId(): string | undefined {
    const session = this.getCurrentSession();
    return session?.customerId;
  }

  // Get access token
  getAccessToken(): string | undefined {
    const session = this.getCurrentSession();
    return session?.accessToken;
  }

  // Admin access checks
  isAdmin(): boolean {
    const customer = this.getCurrentCustomer();
    return customer?.isAdmin === true;
  }

  hasAdminAccess(): boolean {
    const customer = this.getCurrentCustomer();
    return customer?.isAdmin === true && customer?.adminAccess === true;
  }

  // Payment status checks
  hasCompletedPayment(): boolean {
    const customer = this.getCurrentCustomer();
    // Admin users always have access
    if (customer?.isAdmin) return true;
    return customer?.paymentStatus === 'Completed';
  }

  // Tool access validation
  hasToolAccess(toolName: string): boolean {
    const customer = this.getCurrentCustomer();
    if (!customer) return false;
    
    // Admin users have access to all tools
    if (customer.isAdmin) return true;
    
    // Check payment status for regular users
    if (!this.hasCompletedPayment()) return false;
    
    // Tool-specific access logic
    switch (toolName) {
      case 'icp':
        return customer.hasPersonalizedICP || false;
      case 'cost-calculator':
        return true; // Available to all paid users
      case 'business-case':
        return customer.hasDetailedAnalysis || false;
      default:
        return false;
    }
  }

  // Refresh authentication token
  async refreshToken(): Promise<boolean> {
    if (!this.session) return false;
    
    try {
      // Simulate token refresh API call
      const newToken = `refreshed_token_${this.session.customerId}_${Date.now()}`;
      this.session.accessToken = newToken;
      this.session.expiresAt = Date.now() + (24 * 60 * 60 * 1000);
      
      this.saveSessionToStorage(this.session);
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clearSession();
      return false;
    }
  }

  // Session validation and extension
  async validateSession(): Promise<boolean> {
    if (!this.session) return false;
    
    // If session expires in less than 1 hour, try to refresh
    const oneHour = 60 * 60 * 1000;
    if (this.session.expiresAt - Date.now() < oneHour) {
      return await this.refreshToken();
    }
    
    return true;
  }

  // Get customer profiles (mock data)
  private getCustomerProfile(customerId: string): CustomerProfile | null {
    const profiles: Record<string, CustomerProfile> = {
      'CUST_2': {
        id: 'CUST_2',
        customerId: 'CUST_2',
        name: 'John Demo',
        customerName: 'John Demo',
        email: 'john@example.com',
        company: 'Demo Company',
        status: 'active',
        isAdmin: false,
        demoMode: false,
        hasPersonalizedICP: true,
        hasDetailedAnalysis: false,
        paymentStatus: 'Completed'
      },
      'CUST_4': {
        id: 'CUST_4',
        customerId: 'CUST_4',
        name: 'Admin Demo',
        customerName: 'Platform Administrator',
        email: 'admin@example.com',
        company: 'H&S Revenue Intelligence',
        status: 'admin',
        isAdmin: true,
        demoMode: true,
        hasPersonalizedICP: true,
        hasDetailedAnalysis: true,
        adminAccess: true,
        paymentStatus: 'Completed'
      },
      'dru78DR9789SDF862': {
        id: 'dru78DR9789SDF862',
        customerId: 'dru78DR9789SDF862',
        name: 'Geter',
        customerName: 'Geter',
        email: 'geter@hs-platform.com',
        company: 'H&S Platform',
        status: 'admin',
        isAdmin: true,
        demoMode: true,
        hasPersonalizedICP: true,
        hasDetailedAnalysis: true,
        adminAccess: true,
        paymentStatus: 'Completed'
      },
      'CUST_02': {
        id: 'CUST_02',
        customerId: 'CUST_02',
        name: 'Test User',
        customerName: 'Test User',
        email: 'test@example.com',
        company: 'Test Company',
        status: 'test',
        isAdmin: false,
        demoMode: true,
        hasPersonalizedICP: false,
        hasDetailedAnalysis: false,
        paymentStatus: 'Pending'
      }
    };

    return profiles[customerId] || null;
  }

  // Development utilities
  isDemoMode(): boolean {
    const customer = this.getCurrentCustomer();
    return customer?.demoMode === true;
  }

  getSessionInfo(): any {
    return {
      isAuthenticated: this.isAuthenticated(),
      customerId: this.getCustomerId(),
      isAdmin: this.isAdmin(),
      hasAdminAccess: this.hasAdminAccess(),
      hasCompletedPayment: this.hasCompletedPayment(),
      isDemoMode: this.isDemoMode(),
      sessionExpiresAt: this.session?.expiresAt,
      sessionValid: this.session ? this.session.expiresAt > Date.now() : false
    };
  }

  // Extract credentials from URL parameters
  extractCredentials(searchParams: URLSearchParams): { customerId: string; accessToken: string } | null {
    const customerId = searchParams.get('customerId') || '';
    const accessToken = searchParams.get('token') || '';
    
    if (!customerId || !accessToken) {
      return null;
    }
    
    return { customerId, accessToken };
  }

  // Validate credentials using existing authentication logic
  async validateCredentials(customerId: string, accessToken: string): Promise<{ valid: boolean; customerData?: any; error?: string }> {
    try {
      // Use existing authentication method for admin users
      if (customerId === 'dru78DR9789SDF862' && accessToken === 'admin-demo-token-2025') {
        const adminData = await this.getAdminProfile();
        return {
          valid: true,
          customerData: adminData
        };
      }

      // For regular customers, implement proper validation
      // This would need integration with actual customer database
      return {
        valid: false,
        error: 'Customer validation not implemented for non-admin users'
      };
    } catch (error: any) {
      return {
        valid: false,
        error: `Validation failed: ${error.message}`
      };
    }
  }

  // Generate session from validated credentials
  async generateSession(customerId: string, customerData: any): Promise<any> {
    const sessionData: AuthSession = {
      customerId,
      accessToken: `token_${Date.now()}`,
      refreshToken: `refresh_${Date.now()}`,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      customer: customerData
    };
    
    this.session = sessionData;
    this.saveSessionToStorage();
    
    return sessionData;
  }

  // Refresh existing session
  async refreshSession(): Promise<void> {
    if (this.session && this.session.expiresAt > Date.now()) {
      this.session.expiresAt = Date.now() + (24 * 60 * 60 * 1000); // Extend by 24 hours
      this.saveSessionToStorage();
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;