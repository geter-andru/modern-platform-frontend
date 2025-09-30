import { Suspense } from 'react';
import CustomerICPRedirectClient from './CustomerICPRedirectClient';

// Generate static params for known customer IDs
export async function generateStaticParams() {
  return [
    { customerId: 'CUST_2' },
    { customerId: 'CUST_4' },
  ];
}

export default function CustomerICPRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    }>
      <CustomerICPRedirectClient />
    </Suspense>
  );
}