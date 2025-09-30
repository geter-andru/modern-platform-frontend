'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '../../src/shared/hooks/useSupabaseAuth';
import { EnterpriseNavigationV2 } from '../../src/shared/components/layout/EnterpriseNavigationV2';
import { AdvancedAnalyticsDashboard } from '../../src/shared/components/analytics/AdvancedAnalyticsDashboard';

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useSupabaseAuth();

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <EnterpriseNavigationV2>
      <div className="space-y-6">
        {/* Header with AI Gradient */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            <h1 className="text-4xl font-bold mb-2">Advanced Analytics</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              AI-powered insights and predictive analytics for your business
            </p>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <AdvancedAnalyticsDashboard customerId={user.id} />
      </div>
    </EnterpriseNavigationV2>
  );
}
