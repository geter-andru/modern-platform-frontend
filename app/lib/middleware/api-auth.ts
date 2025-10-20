// Authentication bridge for Express backend API calls
import { supabase } from '../supabase/client';
import { API_CONFIG } from '@/app/lib/config/api';

export interface AuthHeaders {
  'Authorization'?: string;
  'X-Access-Token'?: string;
  'X-API-Key'?: string;
}

/**
 * Get authentication headers for Express backend API calls
 * Uses Supabase JWT authentication only
 */
export async function getAuthHeaders(customerId?: string): Promise<AuthHeaders> {
  try {
    // Get Supabase session (only supported authentication method)
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
      // Use Supabase access token as JWT Bearer token
      // The Express backend will validate it through authenticateMulti middleware
      return {
        'Authorization': `Bearer ${session.access_token}`
      };
    }

    // No Supabase session available
    throw new AuthenticationError(
      'No active Supabase session. Please log in to continue.',
      'MISSING_SESSION'
    );

  } catch (error) {
    // If it's already an AuthenticationError, re-throw it
    if (error instanceof AuthenticationError) {
      throw error;
    }

    // For other errors, wrap in AuthenticationError
    console.error('Error getting auth headers:', error);
    throw new AuthenticationError(
      'Failed to retrieve authentication credentials',
      'AUTH_ERROR',
      error
    );
  }
}

/**
 * Custom error class for authentication failures
 */
export class AuthenticationError extends Error {
  code: string;
  originalError?: unknown;

  constructor(message: string, code: string = 'AUTH_ERROR', originalError?: unknown) {
    super(message);
    this.name = 'AuthenticationError';
    this.code = code;
    this.originalError = originalError;
  }
}

/**
 * Create authenticated fetch wrapper for Express backend
 */
export async function authenticatedFetch(
  url: string, 
  options: RequestInit = {}, 
  customerId?: string
): Promise<Response> {
  const authHeaders = await getAuthHeaders(customerId);
  
  // Merge auth headers with existing headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...authHeaders,
  };

  // Make sure we're calling the Express backend
  const fullUrl = url.startsWith('/') ? `${API_CONFIG.backend}${url}` : url;

  return fetch(fullUrl, {
    ...options,
    headers,
  });
}