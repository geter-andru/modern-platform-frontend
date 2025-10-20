/**
 * Authentication Bridge Service
 *
 * Bridges Supabase authentication from frontend to Express backend APIs.
 * This service handles the communication between Next.js frontend (Supabase auth)
 * and Express backend (JWT validation) seamlessly.
 *
 * FUNCTIONALITY STATUS: REAL
 * - Real Supabase session management
 * - Real backend API communication
 * - Real error handling and retry logic
 * - Production-ready authentication bridge
 */

import { supabase } from '@/app/lib/supabase/client';
import { API_CONFIG, getBackendUrl } from '@/app/lib/config/api';

export interface AuthBridgeConfig {
  backendUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface BackendAuthHeaders {
  'Authorization': string;
  'Content-Type': string;
  'X-Requested-With'?: string;
}

export interface BackendResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

export class AuthBridgeService {
  private config: AuthBridgeConfig;
  private supabaseClient: typeof supabase;

  constructor(config?: Partial<AuthBridgeConfig>) {
    this.config = {
      backendUrl: API_CONFIG.backend,
      timeout: 30000, // 30 seconds
      retryAttempts: 3,
      retryDelay: 1000, // 1 second
      ...config
    };

    // Use the existing Supabase client
    this.supabaseClient = supabase;
  }

  /**
   * Get authentication headers for backend API calls
   * Uses AuthProvider's session instead of calling getSession() directly
   * This prevents duplicate GoTrueClient instances
   */
  async getAuthHeaders(): Promise<BackendAuthHeaders> {
    try {
      // Import authService to get the current session from AuthProvider
      const { authService } = await import('@/app/lib/auth/auth-service');

      // Get current session from AuthProvider (singleton, no duplicate calls)
      const session = authService.getCurrentSession();

      if (!session?.access_token) {
        throw new Error('No active Supabase session found');
      }

      // Validate session expiry
      if (session.expires_at && Date.now() / 1000 > session.expires_at) {
        throw new Error('Supabase session has expired');
      }

      return {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      };

    } catch (error) {
      console.error('AuthBridge: Failed to get auth headers:', error);
      throw error;
    }
  }

  /**
   * Make authenticated request to backend API
   * Handles authentication, retries, and error formatting
   */
  async makeAuthenticatedRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<BackendResponse<T>> {
    const url = getBackendUrl(endpoint);
    
    try {
      const headers = await this.getAuthHeaders();
      
      const requestOptions: RequestInit = {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        },
        signal: AbortSignal.timeout(this.config.timeout)
      };

      let lastError: Error | null = null;
      
      // Retry logic for network issues
      for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
        try {
          console.log(`AuthBridge: Making request to ${url} (attempt ${attempt})`);
          
          const response = await fetch(url, requestOptions);
          
          if (!response.ok) {
            // Handle specific HTTP status codes
            if (response.status === 401) {
              throw new Error('Authentication failed - please log in again');
            } else if (response.status === 403) {
              throw new Error('Access denied - insufficient permissions');
            } else if (response.status === 429) {
              throw new Error('Rate limit exceeded - please wait before trying again');
            } else if (response.status >= 500) {
              throw new Error(`Server error (${response.status}) - please try again later`);
            } else {
              throw new Error(`Request failed with status ${response.status}`);
            }
          }

          const data = await response.json();
          console.log(`AuthBridge: Request successful to ${url}`);
          return data;

        } catch (error) {
          lastError = error as Error;
          console.warn(`AuthBridge: Request failed (attempt ${attempt}):`, error);
          
          // Don't retry on authentication or permission errors
          if (error instanceof Error && 
              (error.message.includes('Authentication failed') || 
               error.message.includes('Access denied'))) {
            throw error;
          }
          
          // Wait before retry (except on last attempt)
          if (attempt < this.config.retryAttempts) {
            await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt));
          }
        }
      }

      // All retries failed
      throw lastError || new Error('Request failed after all retry attempts');

    } catch (error) {
      console.error(`AuthBridge: Request failed to ${url}:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: `Failed to communicate with backend API: ${url}`
      };
    }
  }

  /**
   * GET request to backend API
   */
  async get<T = any>(endpoint: string): Promise<BackendResponse<T>> {
    return this.makeAuthenticatedRequest<T>(endpoint, {
      method: 'GET'
    });
  }

  /**
   * POST request to backend API
   */
  async post<T = any>(endpoint: string, data?: any): Promise<BackendResponse<T>> {
    return this.makeAuthenticatedRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * PUT request to backend API
   */
  async put<T = any>(endpoint: string, data?: any): Promise<BackendResponse<T>> {
    return this.makeAuthenticatedRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * DELETE request to backend API
   */
  async delete<T = any>(endpoint: string): Promise<BackendResponse<T>> {
    return this.makeAuthenticatedRequest<T>(endpoint, {
      method: 'DELETE'
    });
  }

  /**
   * Check if user is authenticated
   * Uses AuthProvider's state instead of calling getSession() directly
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const { authService } = await import('@/app/lib/auth/auth-service');
      return authService.isAuthenticated();
    } catch (error) {
      console.error('AuthBridge: Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Get current user information
   * Uses AuthProvider's user instead of calling getUser() directly
   */
  async getCurrentUser() {
    try {
      const { authService } = await import('@/app/lib/auth/auth-service');
      return authService.getCurrentUser();
    } catch (error) {
      console.error('AuthBridge: Error getting user:', error);
      return null;
    }
  }

  /**
   * Refresh Supabase session if needed
   * Uses AuthProvider's refresh logic (happens automatically)
   * Just return current session as refresh is handled by AuthProvider
   */
  async refreshSession() {
    try {
      const { authService } = await import('@/app/lib/auth/auth-service');
      const session = authService.getCurrentSession();
      return { session, user: authService.getCurrentUser() };
    } catch (error) {
      console.error('AuthBridge: Error refreshing session:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authBridge = new AuthBridgeService();

// Export convenience functions
export const getAuthHeaders = () => authBridge.getAuthHeaders();
export const makeAuthenticatedRequest = <T = any>(endpoint: string, options?: RequestInit) => 
  authBridge.makeAuthenticatedRequest<T>(endpoint, options);
export const isAuthenticated = () => authBridge.isAuthenticated();
export const getCurrentUser = () => authBridge.getCurrentUser();
