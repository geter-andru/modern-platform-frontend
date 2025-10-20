import { Suspense } from 'react';
import ICPAnalysisPage from './ICPAnalysisPage';

// Force dynamic rendering - this page requires client-side authentication and cannot be statically generated
export const dynamic = 'force-dynamic';

// This page is dynamic and doesn't support static generation
// Removed generateStaticParams() because:
// 1. ICPAnalysisPage uses client-side hooks (useEffect, useRouter)
// 2. Requires runtime Supabase authentication
// 3. Cannot be prerendered without browser environment

export default function SimplifiedICPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <h1 className="text-xl font-semibold text-gray-200 mb-2">Loading ICP Analysis Tool</h1>
          <p className="text-text-secondary">Initializing customer profiling system...</p>
        </div>
      </div>
    }>
      <ICPAnalysisPage />
    </Suspense>
  );
}