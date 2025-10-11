'use client';

import { useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';

export default function CustomerDashboardRedirectClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const customerId = params.customerId as string;
    const token = searchParams.get('token');
    
    if (customerId && token) {
      // Store authentication details for the new platform structure
      document.cookie = `hs_access_token=${token}; expires=${new Date(Date.now() + 24*60*60*1000).toUTCString()}; path=/`;
      document.cookie = `hs_customer_id=${customerId}; expires=${new Date(Date.now() + 7*24*60*60*1000).toUTCString()}; path=/`;
      
      // Redirect to the unified dashboard
      router.replace('/dashboard');
    } else {
      // Fallback to login if authentication is missing
      router.replace('/login');
    }
  }, [params.customerId, searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🚀</div>
        <h1 className="text-xl font-semibold text-text-primary mb-2">Accessing Dashboard...</h1>
        <p className="text-text-muted">Redirecting to your revenue intelligence platform</p>
      </div>
    </div>
  );
}