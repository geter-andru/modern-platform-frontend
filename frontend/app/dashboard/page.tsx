'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '../../src/shared/hooks/useSupabaseAuth';
import { EnterpriseNavigationV2 } from '../../src/shared/components/layout/EnterpriseNavigationV2';
import { ProgressOverview } from '../../src/shared/components/dashboard/ProgressOverview';
import { MilestonesCard } from '../../src/shared/components/dashboard/MilestonesCard';
import { QuickActions } from '../../src/shared/components/dashboard/QuickActions';
import { RecentActivity } from '../../src/shared/components/dashboard/RecentActivity';
import { InsightsPanel } from '../../src/shared/components/dashboard/InsightsPanel';
import { EnterpriseDashboard } from '../../src/shared/components/dashboard/EnterpriseDashboard';
import { useCustomer, useProgress, useMilestones, useProgressInsights } from '../../lib/hooks/useAPI';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useSupabaseAuth();

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    
    if (!user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const { data: customer, isLoading: customerLoading } = useCustomer(user?.id);
  const { data: progress, isLoading: progressLoading } = useProgress(user?.id);
  const { data: milestones, isLoading: milestonesLoading } = useMilestones(user?.id);
  const { data: insights, isLoading: insightsLoading } = useProgressInsights(user?.id);

  if (authLoading) {
    return (
      <EnterpriseNavigationV2>
        <div className="flex items-center justify-center h-64">
          <div className="text-text-muted">Loading...</div>
        </div>
      </EnterpriseNavigationV2>
    );
  }

  if (!user) {
    return null;
  }

  const isLoading = customerLoading || progressLoading || milestonesLoading || insightsLoading;

  return (
    <EnterpriseNavigationV2>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Welcome back{customer?.data?.name ? `, ${customer.data.name}` : ''}!
            </h1>
            <p className="text-text-muted mt-1">
              Here's your revenue intelligence overview
            </p>
          </div>
          <div className="text-sm text-text-subtle">
            User ID: <span className="font-mono bg-surface px-2 py-1 rounded">{user.id.slice(0, 8)}...</span>
          </div>
        </div>

        {/* Progress Overview */}
        <ProgressOverview 
          progress={progress?.data} 
          isLoading={isLoading}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* Milestones */}
            <MilestonesCard 
              milestones={milestones?.data} 
              isLoading={milestonesLoading}
              customerId={user.id}
            />

            {/* Recent Activity */}
            <RecentActivity 
              activities={progress?.data?.recentActions}
              isLoading={progressLoading}
            />
          </div>

          {/* Right Column - 1 col */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions customerId={user.id} />

            {/* Insights */}
            <InsightsPanel 
              insights={insights?.data}
              isLoading={insightsLoading}
            />
          </div>
        </div>
      </div>
    </EnterpriseNavigationV2>
  );
}