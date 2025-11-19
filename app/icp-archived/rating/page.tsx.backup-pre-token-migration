'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ICPRatingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main ICP page with rating-system tab
    router.replace('/icp?tab=rating-system');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to ICP Rating System...</p>
      </div>
    </div>
  );
}