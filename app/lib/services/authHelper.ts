/**
 * Authentication Helper
 * 
 * Provides utilities for getting authentication tokens from Supabase
 * for use in API calls to the backend.
 */

import { createBrowserClient } from '@supabase/ssr';

/**
 * Get the current user's authentication token
 */
export async function getAuthToken(): Promise<string> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || '';
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return '';
  }
}

/**
 * Get the current user's ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch (error) {
    console.error('Failed to get current user ID:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  return token.length > 0;
}


