import { Suspense } from 'react';
import { UserIntelligenceProvider } from '../../../lib/contexts/UserIntelligenceContext';
import DashboardPremiumClient from './DashboardPremiumClient';

// Generate static params for known customer IDs
export async function generateStaticParams() {
  return [
    { customerId: 'dru78DR9789SDF862' }, // Admin user
    { customerId: 'CUST_02' }, // Test user
    { customerId: 'demo' }, // Demo user
  ];
}

export default function CustomerDashboardPremiumPage() {
  return (
    <UserIntelligenceProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-slate-300 text-lg">Loading Premium Dashboard...</div>
          </div>
        </div>
      }>
        <DashboardPremiumClient />
      </Suspense>
    </UserIntelligenceProvider>
  );
}