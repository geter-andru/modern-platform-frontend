import { Suspense } from 'react';
import CustomerBusinessCaseRedirectClient from './CustomerBusinessCaseRedirectClient';

// Generate static params for known customer IDs
export async function generateStaticParams() {
  return [
    { customerId: 'dru9K2L7M8N4P5Q6' }, // Test user
    { customerId: 'dru78DR9789SDF862' }, // Admin user
    { customerId: 'dru90BT3821XCP479' }, // Additional user
    { customerId: 'CUST_2' }, // Legacy test user
    { customerId: 'CUST_4' }, // Legacy admin user
  ];
}

export default function CustomerBusinessCaseRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    }>
      <CustomerBusinessCaseRedirectClient />
    </Suspense>
  );
}