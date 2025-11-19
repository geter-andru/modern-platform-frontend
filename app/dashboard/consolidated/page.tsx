'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth, useRequirePayment } from '@/app/lib/auth';
import { ModernSidebarLayout } from '../../../src/shared/components/layout/ModernSidebarLayout';
import { useCustomer, useProgress, useMilestones, useProgressInsights } from '@/app/lib/hooks/useAPI';
import { Skeleton } from '../../../src/shared/components/ui/Skeleton';
import { useCommandPalette } from '../../../src/shared/components/ui/command-palette';
import { useBehaviorTracking } from '../../../src/shared/hooks/useBehaviorTracking';

// Components
import { BusinessMilestonesCard } from './components/BusinessMilestonesCard';
import { SeriesBReadinessScore } from './components/SeriesBReadinessScore';
import { AIInsightsPanel } from './components/AIInsightsPanel';
import { CompetencyGauges } from './components/CompetencyGauges';
import { PlatformStats } from './components/PlatformStats';
import { RevenueTrendChart } from './components/RevenueTrendChart';
import { ActiveMilestonesCard } from './components/ActiveMilestonesCard';
import { QuickActionsCard } from './components/QuickActionsCard';
import { EnhancedActivityStream } from './components/EnhancedActivityStream';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ConsolidatedDashboard() {
  const router = useRouter();
  const { user, loading } = useRequireAuth();
  const { hasPaid, loading: paymentLoading } = useRequirePayment();
  const { openPalette } = useCommandPalette();

  const { data: customer, isLoading: customerLoading } = useCustomer(user?.id);
  const { data: progress, isLoading: progressLoading } = useProgress(user?.id);
  const { data: milestones, isLoading: milestonesLoading } = useMilestones(user?.id);
  const { data: insights, isLoading: insightsLoading } = useProgressInsights(user?.id);

  // Track page view
  useBehaviorTracking({
    customerId: user?.id || '',
  });

  // Loading state
  if (loading || paymentLoading) {
    return (
      <ModernSidebarLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <Skeleton variant="text" width="60%" height="h-8" animation="shimmer" />
              <Skeleton variant="text" width="40%" height="h-4" animation="shimmer" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" height="h-32" animation="shimmer" />
            ))}
          </div>
        </div>
      </ModernSidebarLayout>
    );
  }

  const isLoading = customerLoading || progressLoading || milestonesLoading || insightsLoading;

  return (
    <ModernSidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="heading-2 text-text-primary">
              Welcome back{customer?.data?.customerName ? `, ${customer.data.customerName}` : ''}!
            </h1>
            <p className="body text-text-muted mt-1">
              Series B Readiness Dashboard
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={openPalette}
              className="
                flex items-center gap-2 px-3 py-2 rounded-lg
                bg-surface/50 border border-white/10
                text-text-muted hover:text-text-primary
                hover:bg-surface/80 hover:border-white/20
                transition-all duration-200 ease-elegant
                body-small
              "
            >
              <kbd className="px-1.5 py-0.5 bg-surface/50 rounded body-small">⌘K</kbd>
              <span>Command Palette</span>
            </button>
            <div className="body-small text-text-subtle">
              User ID: <span className="font-mono bg-surface px-2 py-1 rounded">{user?.id?.slice(0, 8) || 'Unknown'}...</span>
            </div>
          </div>
        </div>

        {/* PRIORITY #1: Business Milestones */}
        <BusinessMilestonesCard
          customerId={user?.id}
          isLoading={isLoading}
        />

        {/* Series B Readiness Score */}
        <SeriesBReadinessScore
          customerId={user?.id}
          isLoading={isLoading}
        />

        {/* AI-Driven Next Action */}
        <AIInsightsPanel
          insights={insights?.data}
          isLoading={insightsLoading}
          customerId={user?.id}
        />

        {/* Competency Progression + Platform Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CompetencyGauges
            customerId={user?.id}
            isLoading={isLoading}
          />
          <PlatformStats
            customerId={user?.id}
            isLoading={isLoading}
          />
        </div>

        {/* Revenue Trajectory Chart */}
        <RevenueTrendChart
          customerId={user?.id}
          isLoading={isLoading}
        />

        {/* Milestones + Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActiveMilestonesCard
            milestones={milestones?.data?.milestones}
            isLoading={milestonesLoading}
            customerId={user?.id || ''}
          />
          <QuickActionsCard
            customerId={user?.id || ''}
          />
        </div>

        {/* Enhanced Activity Stream */}
        <EnhancedActivityStream
          customerId={user?.id}
          isLoading={isLoading}
        />
      </div>
    </ModernSidebarLayout>
  );
}
