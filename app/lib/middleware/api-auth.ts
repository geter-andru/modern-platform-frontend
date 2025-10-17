// Authentication bridge for Express backend API calls
import { supabase } from '../supabase/client';

export interface AuthHeaders {
  'Authorization'?: string;
  'X-Access-Token'?: string;
  'X-API-Key'?: string;
}

/**
 * Get authentication headers for Express backend API calls
 * Handles both Supabase sessions and customer access tokens
 */
export async function getAuthHeaders(customerId?: string): Promise<AuthHeaders> {
  try {
    // First, try to get Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      // Use Supabase access token as JWT Bearer token
      // The Express backend will validate it through authenticateMulti middleware
      return {
        'Authorization': `Bearer ${session.access_token}`
      };
    }

    // Fallback to customer access tokens for admin/demo users
    if (customerId === 'dru78DR9789SDF862') {
      const adminDemoToken = process.env.NEXT_PUBLIC_ADMIN_DEMO_TOKEN || 'admin-demo-token-2025';
      return {
        'X-Access-Token': adminDemoToken
      };
    }

    if (customerId === 'CUST_02') {
      const testToken = process.env.NEXT_PUBLIC_TEST_TOKEN || 'test-token-123456';
      return {
        'X-Access-Token': testToken
      };
    }

    // Check URL params for access token (legacy support)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        return {
          'X-Access-Token': token
        };
      }
    }

    // No authentication available
    console.warn('No authentication method available for API call');
    return {};
    
  } catch (error) {
    console.error('Error getting auth headers:', error);
    // Return customer token as fallback
    if (customerId === 'dru78DR9789SDF862') {
      const adminDemoToken = process.env.NEXT_PUBLIC_ADMIN_DEMO_TOKEN || 'admin-demo-token-2025';
      return {
        'X-Access-Token': adminDemoToken
      };
    }
    return {};
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

  // Make sure we're calling the Express backend on port 3001
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001' 
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : url;

  return fetch(fullUrl, {
    ...options,
    headers,
  });
}