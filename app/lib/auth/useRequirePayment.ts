'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { supabase } from '@/app/lib/supabase/client';

/**
 * Payment verification status returned by useRequirePayment hook
 */
export interface PaymentStatus {
  /** Whether user has completed founding member payment */
  hasPaid: boolean;
  /** Whether user is a founding member (locks in $750/month pricing) */
  isFoundingMember: boolean;
  /** Whether user has early access (can use platform before Dec 1) */
  hasEarlyAccess: boolean;
  /** When early access is granted (Dec 1, 2025 for founding members) */
  accessGrantedDate: string | null;
  /** Forever locked pricing for founding members */
  foreverLockPrice: number | null;
  /** Loading state while checking payment status */
  loading: boolean;
}

/**
 * User milestone record from database
 */
interface UserMilestone {
  milestone_type: string;
  is_founding_member: boolean;
  has_early_access: boolean;
  access_granted_date: string | null;
  forever_lock_price: number | null;
}

/**
 * Require payment verification - redirects to /pricing if user hasn't paid
 *
 * This hook enforces the payment-first architecture by:
 * 1. Checking if authenticated user has a user_milestones record
 * 2. Verifying they have founding member status (is_founding_member = true)
 * 3. Checking if early access is granted (has_early_access = true)
 * 4. Redirecting to /pricing if any check fails
 *
 * Use this hook on protected pages that require payment:
 *
 * @example
 * ```tsx
 * export default function DashboardPage() {
 *   const { user, loading: authLoading } = useRequireAuth();
 *   const { hasPaid, loading: paymentLoading } = useRequirePayment();
 *
 *   if (authLoading || paymentLoading) {
 *     return <LoadingSpinner />;
 *   }
 *
 *   // User is authenticated AND has paid
 *   return <Dashboard />;
 * }
 * ```
 *
 * @returns Payment status with loading state
 */
export function useRequirePayment(): PaymentStatus {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    hasPaid: false,
    isFoundingMember: false,
    hasEarlyAccess: false,
    accessGrantedDate: null,
    foreverLockPrice: null,
    loading: true,
  });

  useEffect(() => {
    // Wait for auth to complete
    if (authLoading) {
      return;
    }

    // If no user, let useRequireAuth handle the redirect to /auth
    if (!user) {
      setPaymentStatus({
        hasPaid: false,
        isFoundingMember: false,
        hasEarlyAccess: false,
        accessGrantedDate: null,
        foreverLockPrice: null,
        loading: false,
      });
      return;
    }

    /**
     * Check if user has paid by querying user_milestones table
     */
    const checkPaymentStatus = async () => {
      try {
        const { data: milestone, error } = await supabase
          .from('user_milestones')
          .select('milestone_type, is_founding_member, has_early_access, access_granted_date, forever_lock_price')
          .eq('user_id', user.id)
          .single();

        // No milestone record = user hasn't paid
        if (error) {
          if (error.code === 'PGRST116') {
            // PGRST116 = no rows returned (expected for unpaid users)
            console.warn('⚠️ useRequirePayment: No payment record found', {
              userId: user.id,
              email: user.email,
            });
          } else {
            // Unexpected error querying database
            console.error('❌ useRequirePayment: Database error', {
              userId: user.id,
              email: user.email,
              error: error.message,
            });
          }

          // Redirect to pricing page with error parameter
          router.push('/pricing?error=payment_required');

          setPaymentStatus({
            hasPaid: false,
            isFoundingMember: false,
            hasEarlyAccess: false,
            accessGrantedDate: null,
            foreverLockPrice: null,
            loading: false,
          });
          return;
        }

        // Milestone record exists, validate payment status
        const typedMilestone = milestone as UserMilestone;
        const hasPaid = typedMilestone.is_founding_member === true;
        const hasEarlyAccess = typedMilestone.has_early_access === true;

        // User has paid but doesn't have early access yet
        if (hasPaid && !hasEarlyAccess) {
          console.warn('⚠️ useRequirePayment: User paid but early access not granted yet', {
            userId: user.id,
            email: user.email,
            accessGrantedDate: typedMilestone.access_granted_date,
          });

          router.push('/waitlist-welcome?status=access_pending');

          setPaymentStatus({
            hasPaid: true,
            isFoundingMember: true,
            hasEarlyAccess: false,
            accessGrantedDate: typedMilestone.access_granted_date,
            foreverLockPrice: typedMilestone.forever_lock_price,
            loading: false,
          });
          return;
        }

        // User hasn't paid (is_founding_member = false)
        if (!hasPaid) {
          console.warn('⚠️ useRequirePayment: User authenticated but not a founding member', {
            userId: user.id,
            email: user.email,
            milestoneType: typedMilestone.milestone_type,
          });

          router.push('/pricing?error=payment_required');

          setPaymentStatus({
            hasPaid: false,
            isFoundingMember: false,
            hasEarlyAccess: false,
            accessGrantedDate: null,
            foreverLockPrice: null,
            loading: false,
          });
          return;
        }

        // ✅ User has paid AND has early access
        console.log('✅ useRequirePayment: Payment verified', {
          userId: user.id,
          email: user.email,
          isFoundingMember: typedMilestone.is_founding_member,
          hasEarlyAccess: typedMilestone.has_early_access,
          foreverLockPrice: typedMilestone.forever_lock_price,
        });

        setPaymentStatus({
          hasPaid: true,
          isFoundingMember: typedMilestone.is_founding_member,
          hasEarlyAccess: typedMilestone.has_early_access,
          accessGrantedDate: typedMilestone.access_granted_date,
          foreverLockPrice: typedMilestone.forever_lock_price,
          loading: false,
        });
      } catch (err) {
        // Unexpected exception (network error, etc.)
        console.error('❌ useRequirePayment: Exception checking payment status', {
          userId: user.id,
          email: user.email,
          error: err,
        });

        router.push('/pricing?error=verification_failed');

        setPaymentStatus({
          hasPaid: false,
          isFoundingMember: false,
          hasEarlyAccess: false,
          accessGrantedDate: null,
          foreverLockPrice: null,
          loading: false,
        });
      }
    };

    checkPaymentStatus();
  }, [user, authLoading, router]);

  return paymentStatus;
}

/**
 * Optional: Check payment status without enforcing redirect
 * Useful for conditionally showing UI elements based on payment status
 *
 * @example
 * ```tsx
 * const { hasPaid, isFoundingMember } = usePaymentStatus();
 *
 * return (
 *   <div>
 *     {isFoundingMember && (
 *       <Badge>Founding Member - $750/month forever</Badge>
 *     )}
 *   </div>
 * );
 * ```
 */
export function usePaymentStatus(): Omit<PaymentStatus, 'loading'> & { loading: boolean } {
  const { user, loading: authLoading } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    hasPaid: false,
    isFoundingMember: false,
    hasEarlyAccess: false,
    accessGrantedDate: null,
    foreverLockPrice: null,
    loading: true,
  });

  useEffect(() => {
    if (authLoading || !user) {
      setPaymentStatus({
        hasPaid: false,
        isFoundingMember: false,
        hasEarlyAccess: false,
        accessGrantedDate: null,
        foreverLockPrice: null,
        loading: authLoading,
      });
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const { data: milestone, error } = await supabase
          .from('user_milestones')
          .select('milestone_type, is_founding_member, has_early_access, access_granted_date, forever_lock_price')
          .eq('user_id', user.id)
          .single();

        if (error || !milestone) {
          setPaymentStatus({
            hasPaid: false,
            isFoundingMember: false,
            hasEarlyAccess: false,
            accessGrantedDate: null,
            foreverLockPrice: null,
            loading: false,
          });
          return;
        }

        const typedMilestone = milestone as UserMilestone;
        setPaymentStatus({
          hasPaid: typedMilestone.is_founding_member === true,
          isFoundingMember: typedMilestone.is_founding_member,
          hasEarlyAccess: typedMilestone.has_early_access,
          accessGrantedDate: typedMilestone.access_granted_date,
          foreverLockPrice: typedMilestone.forever_lock_price,
          loading: false,
        });
      } catch (err) {
        console.error('Error checking payment status:', err);
        setPaymentStatus({
          hasPaid: false,
          isFoundingMember: false,
          hasEarlyAccess: false,
          accessGrantedDate: null,
          foreverLockPrice: null,
          loading: false,
        });
      }
    };

    checkPaymentStatus();
  }, [user, authLoading]);

  return paymentStatus;
}
