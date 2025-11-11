/**
 * Unified Authentication System
 *
 * Single source of truth for authentication in the H&S Platform.
 * Built on Supabase Auth with React Context for state management.
 *
 * @example Basic usage
 * ```tsx
 * import { useAuth } from '@/lib/auth';
 *
 * function MyComponent() {
 *   const { user, isAuthenticated, signOut } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <div>Please sign in</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Welcome, {user?.email}</p>
 *       <button onClick={signOut}>Sign Out</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Protected route
 * ```tsx
 * import { useRequireAuth } from '@/lib/auth';
 *
 * function ProtectedPage() {
 *   const { user, loading } = useRequireAuth(); // Auto-redirects if not authenticated
 *
 *   if (loading) return <div>Loading...</div>;
 *
 *   return <div>Protected content for {user?.email}</div>;
 * }
 * ```
 */

// Main Provider and Hook
export { AuthProvider, useAuth } from './auth-provider';
export type { AuthContextType } from './auth-provider';

// Convenience Hooks
export {
  useAuthUser,
  useAuthSession,
  useIsAuthenticated,
  useIsAdmin,
  useRequireAuth,
  useRequireAdmin,
  useAuthLoading,
  useAuthError,
} from './auth-hooks';

// Payment Verification Hooks
export {
  useRequirePayment,
  usePaymentStatus,
} from './useRequirePayment';
export type { PaymentStatus } from './useRequirePayment';

// Service (for advanced usage)
export { authService } from './auth-service';
export type { AuthUser, AuthSession } from './auth-service';

// Legacy compatibility (will be removed in future versions)
export { legacyAuth } from './auth-service';
