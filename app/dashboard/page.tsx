'use client';

import { useState } from 'react';
import { useRequireAuth } from '@/app/lib/auth';
import { EnterpriseNavigationV2 } from '../../src/shared/components/layout/EnterpriseNavigationV2';
import { ProgressOverview } from '../../src/shared/components/dashboard/ProgressOverview';
import { MilestonesCard } from '../../src/shared/components/dashboard/MilestonesCard';
import { QuickActions } from '../../src/shared/components/dashboard/QuickActions';
import { RecentActivity } from '../../src/shared/components/dashboard/RecentActivity';
import { InsightsPanel } from '../../src/shared/components/dashboard/InsightsPanel';
import { EnterpriseDashboard } from '../../src/shared/components/dashboard/EnterpriseDashboard';
import { useCustomer, useProgress, useMilestones, useProgressInsights } from '@/app/lib/hooks/useAPI';
import { Skeleton, SkeletonCard } from '../../src/shared/components/ui/Skeleton';

export default function DashboardPage() {
  const { user, loading } = useRequireAuth(); // Auto-redirects if not authenticated

  const { data: customer, isLoading: customerLoading } = useCustomer(user?.id);
  const { data: progress, isLoading: progressLoading } = useProgress(user?.id);
  const { data: milestones, isLoading: milestonesLoading } = useMilestones(user?.id);
  const { data: insights, isLoading: insightsLoading } = useProgressInsights(user?.id);

  if (loading) {
    return (
      <EnterpriseNavigationV2>
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <Skeleton variant="text" width="60%" height="h-8" animation="shimmer" />
              <Skeleton variant="text" width="40%" height="h-4" animation="shimmer" />
            </div>
            <Skeleton variant="text" width="120px" height="h-4" animation="shimmer" />
          </div>
          
          {/* Metrics grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} animation="shimmer" />
            ))}
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonCard animation="shimmer" />
            <SkeletonCard animation="shimmer" />
          </div>
        </div>
      </EnterpriseNavigationV2>
    );
  }

  const isLoading = customerLoading || progressLoading || milestonesLoading || insightsLoading;

  return (
    <EnterpriseNavigationV2>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Welcome back{customer?.data?.customerName ? `, ${customer.data.customerName}` : ''}!
            </h1>
            <p className="text-text-muted mt-1">
              Here's your revenue intelligence overview
            </p>
          </div>
          <div className="text-sm text-text-subtle">
            User ID: <span className="font-mono bg-surface px-2 py-1 rounded">{user?.id?.slice(0, 8) || 'Unknown'}...</span>
          </div>
        </div>

        {/* Progress Overview */}
        <ProgressOverview
          progress={undefined}
          isLoading={isLoading}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* Milestones */}
            {user?.id && (
              <MilestonesCard
                milestones={milestones?.data}
                isLoading={milestonesLoading}
                customerId={user.id}
              />
            )}

            {/* Recent Activity */}
            <RecentActivity
              activities={[]}
              isLoading={progressLoading}
            />
          </div>

          {/* Right Column - 1 col */}
          <div className="space-y-6">
            {/* Quick Actions */}
            {user?.id && <QuickActions customerId={user.id} />}

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