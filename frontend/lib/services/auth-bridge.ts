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

import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

// Backend API configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

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
  private supabaseClient: ReturnType<typeof createClient>;

  constructor(config?: Partial<AuthBridgeConfig>) {
    this.config = {
      backendUrl: BACKEND_URL,
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
   * Retrieves Supabase session and formats headers for Express backend
   */
  async getAuthHeaders(): Promise<BackendAuthHeaders> {
    try {
      // Get current Supabase session
      const { data: { session }, error } = await this.supabaseClient.auth.getSession();
      
      if (error) {
        console.error('Error getting Supabase session:', error);
        throw new Error(`Supabase session error: ${error.message}`);
      }

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
    const url = `${this.config.backendUrl}${endpoint}`;
    
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
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await this.supabaseClient.auth.getSession();
      return !!session?.access_token;
    } catch (error) {
      console.error('AuthBridge: Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Get current user information
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.supabaseClient.auth.getUser();
      
      if (error) {
        console.error('AuthBridge: Error getting user:', error);
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('AuthBridge: Error getting user:', error);
      return null;
    }
  }

  /**
   * Refresh Supabase session if needed
   */
  async refreshSession() {
    try {
      const { data, error } = await this.supabaseClient.auth.refreshSession();
      
      if (error) {
        console.error('AuthBridge: Error refreshing session:', error);
        throw error;
      }
      
      return data;
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
