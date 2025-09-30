import { Suspense } from 'react';
import CustomerRedirectClient from './CustomerRedirectClient';

// Generate static params for known customer IDs
export async function generateStaticParams() {
  // Return common customer IDs that should be statically generated
  return [
    { customerId: 'dru78DR9789SDF862' }, // Admin user
    { customerId: 'CUST_02' }, // Test user
    { customerId: 'demo' }, // Demo user
  ];
}

export default function CustomerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white">Redirecting to dashboard...</div>
        </div>
      </div>
    }>
      <CustomerRedirectClient />
    </Suspense>
  );
}