'use client';

import { useRequireAuth } from '@/app/lib/auth';
import { SimplifiedBusinessCaseBuilder } from '@/src/features/cost-business-case';

export default function BusinessCasePage() {
  const { user, loading } = useRequireAuth(); // Auto-redirects if not authenticated

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background-primary)' }}>
        <div className="text-center">
          <div className="border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ width: '32px', height: '32px', borderColor: 'var(--color-brand-primary)', borderTopColor: 'transparent' }}></div>
          <p className="body text-text-secondary">Loading business case builder...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return user?.id ? (
    <SimplifiedBusinessCaseBuilder
      customerId={user.id}
      customerData={user}
    />
  ) : null;
}