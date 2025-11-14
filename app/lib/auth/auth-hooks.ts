'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import type { AuthUser } from './auth-service';

// Re-export main hook
export { useAuth };

/**
 * Return type for useRequireAuth - discriminated union
 * TypeScript can narrow this type based on the loading flag:
 * - When loading=true, user is null
 * - When loading=false, user is guaranteed non-null (or page has redirected)
 */
export type RequireAuthResult =
  | { loading: true; user: null; isAuthenticated: false }
  | { loading: false; user: AuthUser; isAuthenticated: true };

/**
 * Get the current authenticated user
 */
export function useAuthUser() {
  const { user } = useAuth();
  return user;
}

/**
 * Get the current session
 */
export function useAuthSession() {
  const { session } = useAuth();
  return session;
}

/**
 * Check if user is authenticated
 */
export function useIsAuthenticated() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

/**
 * Check if user is an admin
 */
export function useIsAdmin() {
  const { isAdmin } = useAuth();
  return isAdmin;
}

/**
 * Require authentication - redirects to /auth if not authenticated
 * Use this hook in protected pages
 *
 * Returns a discriminated union that TypeScript can narrow:
 * - After checking `if (loading)`, TypeScript knows user is non-null
 */
export function useRequireAuth(): RequireAuthResult {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 🔄 OAuth Session Sync: Skip redirect if auth_loading parameter present
    // This allows AuthLoadingScreen to complete session synchronization (4.5s)
    // before checking authentication state
    const urlParams = new URLSearchParams(window.location.search);
    const isAuthLoading = urlParams.get('auth_loading') === 'true';

    if (isAuthLoading) {
      console.log('🔄 [useRequireAuth] OAuth session sync in progress - skipping redirect check');
      return; // Don't redirect during OAuth callback session sync
    }

    if (!loading && !isAuthenticated) {
      console.log('⚠️ [useRequireAuth] Not authenticated - redirecting to /auth');
      // Store intended destination
      const currentPath = window.location.pathname;
      router.push(`/auth?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [user, loading, isAuthenticated, router]);

  // Return discriminated union based on loading state
  if (loading) {
    return { loading: true, user: null, isAuthenticated: false };
  }

  // At this point, either user exists or useEffect will redirect
  // Type assertion is safe because redirect happens immediately
  return {
    loading: false,
    user: user as AuthUser,
    isAuthenticated: true, // Literal true to match discriminated union
  };
}

/**
 * Require admin access - redirects to /dashboard if not admin
 * Use this hook in admin-only pages
 */
export function useRequireAdmin() {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth');
      } else if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, isAuthenticated, isAdmin, router]);

  return { user, loading, isAuthenticated, isAdmin };
}

/**
 * Get auth loading state
 */
export function useAuthLoading() {
  const { loading } = useAuth();
  return loading;
}

/**
 * Get auth error
 */
export function useAuthError() {
  const { error, clearError } = useAuth();
  return { error, clearError };
}
