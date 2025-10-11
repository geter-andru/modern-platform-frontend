'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Boundary caught an error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            
            <h1 className="text-xl font-semibold text-white mb-2">
              Something went wrong
            </h1>
            
            <p className="text-gray-400 mb-4">
              We're sorry, but something unexpected happened. Please try again.
            </p>

            {process.env.NEXT_PUBLIC_NODE_ENV === 'development' && (
              <details className="mb-4 text-left">
                <summary className="cursor-pointer text-gray-500 hover:text-gray-400">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-gray-800 rounded text-sm font-mono text-gray-400 overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Error:</strong> {error.message}
                  </div>
                  {error.digest && (
                    <div className="mb-2">
                      <strong>Digest:</strong> {error.digest}
                    </div>
                  )}
                  {error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs mt-1">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={reset}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Home
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              If this problem persists, please contact support.
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
