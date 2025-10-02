'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function DebugCallbackContent() {
  const [urlInfo, setUrlInfo] = useState<any>({});
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Capture all URL information
      const urlData = {
        fullUrl: window.location.href,
        origin: window.location.origin,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        
        // Parse search params
        searchParams: {},
        
        // Parse hash params  
        hashParams: {},
        
        // Check for common OAuth parameters
        commonOAuthParams: {
          access_token: null,
          refresh_token: null,
          expires_in: null,
          token_type: null,
          state: null,
          code: null,
          error: null,
          error_description: null
        }
      };

      // Parse search parameters
      const searchParamsObj = new URLSearchParams(window.location.search);
      for (const [key, value] of searchParamsObj.entries()) {
        (urlData.searchParams as any)[key] = value;
        if (key in urlData.commonOAuthParams) {
          (urlData.commonOAuthParams as any)[key] = value;
        }
      }

      // Parse hash parameters (common for OAuth implicit flow)
      const hashParamsObj = new URLSearchParams(window.location.hash.substring(1));
      for (const [key, value] of hashParamsObj.entries()) {
        (urlData.hashParams as any)[key] = value;
        if (key in urlData.commonOAuthParams) {
          (urlData.commonOAuthParams as any)[key] = value;
        }
      }

      setUrlInfo(urlData);
      console.log('🔍 Debug Callback - Complete URL Analysis:', urlData);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">OAuth Debug Callback</h1>
        
        <div className="space-y-6">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-400">URL Information</h2>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">Full URL:</span> <span className="text-white break-all">{urlInfo.fullUrl}</span></div>
              <div><span className="text-gray-400">Origin:</span> <span className="text-white">{urlInfo.origin}</span></div>
              <div><span className="text-gray-400">Pathname:</span> <span className="text-white">{urlInfo.pathname}</span></div>
              <div><span className="text-gray-400">Search:</span> <span className="text-white">{urlInfo.search || 'None'}</span></div>
              <div><span className="text-gray-400">Hash:</span> <span className="text-white">{urlInfo.hash || 'None'}</span></div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">Search Parameters</h2>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {JSON.stringify(urlInfo.searchParams || {}, null, 2)}
            </pre>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Hash Parameters</h2>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {JSON.stringify(urlInfo.hashParams || {}, null, 2)}
            </pre>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-red-400">OAuth Parameters</h2>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {JSON.stringify(urlInfo.commonOAuthParams || {}, null, 2)}
            </pre>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-4">This debug page shows exactly what parameters are received in the OAuth callback.</p>
            <a 
              href="/login" 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DebugCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading debug information...</p>
        </div>
      </div>
    }>
      <DebugCallbackContent />
    </Suspense>
  );
}