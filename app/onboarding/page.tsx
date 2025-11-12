'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingFlow from '../components/features/OnboardingFlow';
import { useRequireAuth } from '@/app/lib/auth';
import { useRequirePayment } from '@/app/lib/auth/useRequirePayment';

/**
 * Onboarding Page
 *
 * Displays the 3-step onboarding flow for first-time PAID users.
 * Redirects to /icp tool after completion.
 *
 * Auth Guard: Requires authenticated user with payment
 * Payment Guard: Requires founding member payment before showing onboarding
 */
export default function OnboardingPage() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  // Auth + Payment guards: Auto-redirect if not authenticated or not paid
  const { user, loading: authLoading } = useRequireAuth();
  const { hasPaid, loading: paymentLoading } = useRequirePayment();

  const handleComplete = () => {
    console.log('✅ Onboarding flow completed - redirecting to ICP tool');
    setIsOpen(false);
    router.push('/icp');
  };

  // Show loading state while checking auth and payment
  if (authLoading || paymentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background-primary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full border-b-2 mx-auto mb-4" style={{ width: '48px', height: '48px', borderColor: 'var(--color-brand-primary)' }}></div>
          <p className="body" style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and paid, show onboarding
  // (useRequirePayment already handles redirect to /pricing if not paid)

  return (
    <div className="min-h-screen" style={{ background: 'var(--background-primary)' }}>
      <OnboardingFlow
        isOpen={isOpen}
        onComplete={handleComplete}
      />
    </div>
  );
}
