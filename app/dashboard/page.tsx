'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Force dynamic rendering (no static generation) for authenticated pages
export const dynamic = 'force-dynamic';
import { useRequireAuth, useRequirePayment } from '@/app/lib/auth';
import { ModernSidebarLayout } from '../../src/shared/components/layout/ModernSidebarLayout';
import { ProgressOverview } from '../../src/shared/components/dashboard/ProgressOverview';
import { MilestonesCard } from '../../src/shared/components/dashboard/MilestonesCard';
import { QuickActions } from '../../src/shared/components/dashboard/QuickActions';
import { RecentActivity } from '../../src/shared/components/dashboard/RecentActivity';
import { InsightsPanel } from '../../src/shared/components/dashboard/InsightsPanel';
import { EnterpriseDashboard } from '../../src/shared/components/dashboard/EnterpriseDashboard';
import { useCustomer, useProgress, useMilestones, useProgressInsights } from '@/app/lib/hooks/useAPI';
import { Skeleton, SkeletonCard } from '../../src/shared/components/ui/Skeleton';
import { useCommandPalette } from '../../src/shared/components/ui/command-palette';

// Insight type definition (matches InsightsPanel component)
interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'achievement' | 'tip';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

// Helper function to transform backend insights into component format
function transformInsightsToArray(backendInsights: any): Insight[] | undefined {
  if (!backendInsights?.insights) return undefined;

  const { nextSteps, recommendations, strengths } = backendInsights.insights;
  const transformedInsights: Insight[] = [];

  // Add next steps as opportunities
  if (nextSteps && Array.isArray(nextSteps)) {
    nextSteps.forEach((step: string, index: number) => {
      transformedInsights.push({
        id: `next-step-${index}`,
        type: 'opportunity' as const,
        title: 'Next Step',
        description: step,
        priority: 'high' as const,
        actionable: true,
      });
    });
  }

  // Add recommendations as tips
  if (recommendations && Array.isArray(recommendations)) {
    recommendations.forEach((rec: string, index: number) => {
      transformedInsights.push({
        id: `recommendation-${index}`,
        type: 'tip' as const,
        title: 'Recommendation',
        description: rec,
        priority: 'medium' as const,
        actionable: true,
      });
    });
  }

  // Add strengths as achievements
  if (strengths && Array.isArray(strengths)) {
    strengths.forEach((strength: string, index: number) => {
      transformedInsights.push({
        id: `strength-${index}`,
        type: 'achievement' as const,
        title: 'Strength',
        description: strength,
        priority: 'low' as const,
        actionable: false,
      });
    });
  }

  return transformedInsights.length > 0 ? transformedInsights : undefined;
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useRequireAuth(); // Auto-redirects if not authenticated
  const { hasPaid, loading: paymentLoading } = useRequirePayment(); // Verifies payment before access
  const { openPalette } = useCommandPalette();

  const { data: customer, isLoading: customerLoading } = useCustomer(user?.id);
  const { data: progress, isLoading: progressLoading } = useProgress(user?.id);
  const { data: milestones, isLoading: milestonesLoading } = useMilestones(user?.id);
  const { data: insights, isLoading: insightsLoading } = useProgressInsights(user?.id);

  // Clean up OAuth callback parameters from URL (code, next, etc.)
  useEffect(() => {
    const code = searchParams.get('code');
    const next = searchParams.get('next');

    // If OAuth parameters are present, clean the URL
    if (code || next) {
      console.log('🧹 Cleaning OAuth parameters from dashboard URL');
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  // Show loading state while checking auth AND payment
  if (loading || paymentLoading) {
    return (
      <ModernSidebarLayout>
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
              Here's your revenue intelligence overview
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
                milestones={milestones?.data?.milestones}
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
              insights={transformInsightsToArray(insights?.data) || []}
              isLoading={insightsLoading}
            />
          </div>
        </div>
      </div>
    </ModernSidebarLayout>
  );
}