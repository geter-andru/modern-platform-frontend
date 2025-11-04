'use client';

import { useRequireAuth } from '@/app/lib/auth';
import { ModernSidebarLayout } from '../../src/shared/components/layout/ModernSidebarLayout';
import { AdvancedAnalyticsDashboard } from '../../src/shared/components/analytics/AdvancedAnalyticsDashboard';

export default function AnalyticsPage() {
  const { user, loading } = useRequireAuth(); // Auto-redirects if not authenticated

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <ModernSidebarLayout>
      <div className="space-y-6">
        {/* Header with AI Gradient */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            <h1 className="text-4xl font-bold mb-2">Advanced Analytics</h1>
            <p className="text-lg text-text-muted dark:text-gray-300">
              AI-powered insights and predictive analytics for your business
            </p>
          </div>
        </div>

        {/* Analytics Dashboard */}
        {user?.id && <AdvancedAnalyticsDashboard customerId={user.id} />}
      </div>
    </ModernSidebarLayout>
  );
}
