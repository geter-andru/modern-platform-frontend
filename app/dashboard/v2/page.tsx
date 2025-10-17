'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSupabaseAuth } from '../../../src/shared/hooks/useSupabaseAuth';
import { EnterpriseNavigationV2 } from '../../../src/shared/components/layout/EnterpriseNavigationV2';
import { DashboardViewToggle } from '@/app/components/dashboard/v2/DashboardViewToggle';
import { UnifiedDashboard } from '@/app/components/dashboard/v2/UnifiedDashboard';
import { CompetencyDevelopmentView } from '@/app/components/dashboard/v2/CompetencyDevelopmentView';
import { useCustomer } from '@/app/lib/hooks/useAPI';

// Force dynamic rendering for authentication and searchParams
export const dynamic = 'force-dynamic';

export default function DashboardV2Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useSupabaseAuth();

  // Get current view from URL params (default: 'overview')
  const [currentView, setCurrentView] = useState<'overview' | 'development'>(
    (searchParams.get('view') as 'overview' | 'development') || 'overview'
  );

  // Fetch customer data for personalization
  const { data: customer, isLoading: customerLoading } = useCustomer(user?.id);

  // Auth protection
  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    if (!user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Loading state
  if (authLoading) {
    return (
      <EnterpriseNavigationV2>
        <div className="flex items-center justify-center h-64">
          <div className="text-text-muted">Loading dashboard...</div>
        </div>
      </EnterpriseNavigationV2>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  return (
    <EnterpriseNavigationV2>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              {currentView === 'overview'
                ? `Welcome back${customer?.data?.customerName ? `, ${customer.data.customerName}` : ''}!`
                : 'Competency Development'}
            </h1>
            <p className="text-text-muted mt-1">
              {currentView === 'overview'
                ? 'Track your revenue intelligence progress and achievements'
                : 'Plan your learning journey and unlock new capabilities'}
            </p>
          </div>
          <div className="text-sm text-text-subtle">
            User ID: <span className="font-mono bg-surface px-2 py-1 rounded">{user.id.slice(0, 8)}...</span>
          </div>
        </div>

        {/* View Toggle */}
        <DashboardViewToggle 
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        {/* Conditional View Rendering */}
        <div className="mt-6">
          {currentView === 'overview' ? (
            <UnifiedDashboard userId={user.id} />
          ) : (
            <CompetencyDevelopmentView userId={user.id} />
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-text-subtle">
          <p>
            Dashboard V2 - New unified experience with advanced progress tracking
            {' • '}
            <a
              href="/dashboard"
              className="text-primary hover:text-primary-hover underline"
            >
              Return to classic dashboard
            </a>
          </p>
        </div>
      </div>
    </EnterpriseNavigationV2>
  );
}
