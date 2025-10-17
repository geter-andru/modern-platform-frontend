'use client';

import { useRequireAuth } from '@/app/lib/auth';
import { SimplifiedBusinessCaseBuilder } from '@/src/features/cost-business-case';

export default function BusinessCasePage() {
  const { user, loading } = useRequireAuth(); // Auto-redirects if not authenticated

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading business case builder...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SimplifiedBusinessCaseBuilder
      customerId={user.id}
      customerData={user}
    />
  );
}