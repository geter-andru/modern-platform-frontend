'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase/client';
import OnboardingFlow from '../components/features/OnboardingFlow';

/**
 * Onboarding Page
 *
 * Displays the 3-step onboarding flow for first-time users.
 * Redirects to dashboard/ICP tool after completion.
 *
 * Auth Guard: Requires authenticated user
 */
export default function OnboardingPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Auth guard: Redirect to /auth if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.log('❌ No session found - redirecting to /auth');
        router.push('/auth?redirect=/onboarding');
        return;
      }

      console.log('✅ User authenticated - showing onboarding');
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleComplete = () => {
    console.log('✅ Onboarding flow completed - redirecting to ICP tool');
    setIsOpen(false);
    router.push('/icp');
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <OnboardingFlow
        isOpen={isOpen}
        onComplete={handleComplete}
      />
    </div>
  );
}
