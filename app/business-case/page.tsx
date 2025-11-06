'use client';

import { useRequireAuth } from '@/app/lib/auth';
import { SimplifiedBusinessCaseBuilder } from '@/src/features/cost-business-case';
import { ModernSidebarLayout } from '../../src/shared/components/layout/ModernSidebarLayout';
import { SystematicScalingProvider } from '@/src/shared/contexts/SystematicScalingContext';

export default function BusinessCasePage() {
  const { user, loading } = useRequireAuth(); // Auto-redirects if not authenticated

  if (loading) {
    return (
      <SystematicScalingProvider founderId="">
        <ModernSidebarLayout>
          <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
            <div className="text-center">
              <div className="border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ width: '32px', height: '32px', borderColor: 'var(--color-brand-primary)', borderTopColor: 'transparent' }}></div>
              <p className="body text-text-secondary">Loading business case builder...</p>
            </div>
          </div>
        </ModernSidebarLayout>
      </SystematicScalingProvider>
    );
  }

  if (!user) {
    return null;
  }

  return user?.id ? (
    <SystematicScalingProvider founderId={user.id}>
      <ModernSidebarLayout>
        <SimplifiedBusinessCaseBuilder
          customerId={user.id}
          customerData={user}
        />
      </ModernSidebarLayout>
    </SystematicScalingProvider>
  ) : null;
}