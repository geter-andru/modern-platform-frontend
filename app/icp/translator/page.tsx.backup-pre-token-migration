'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TechnicalTranslatorPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main ICP page with translator tab
    router.replace('/icp?tab=translator');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to ICP Translator...</p>
      </div>
    </div>
  );
}