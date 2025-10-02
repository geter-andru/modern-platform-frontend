'use client';

// Simple authentication test page
import React from 'react';
import { useSupabaseAuth } from '../../lib/hooks/useSupabaseAuth';
import { LoadingSpinner } from '@/src/shared/components/ui/LoadingStates';

const AuthTestPage: React.FC = () => {
  const { user, session, loading, error, signOut, signInWithGoogle } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Authentication Test
        </h1>

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-200">Error: {error}</p>
          </div>
        )}

        {user ? (
          <div className="space-y-6">
            <div className="bg-green-900 border border-green-700 rounded-lg p-4">
              <h2 className="text-green-200 text-lg font-semibold mb-2">
                ✅ Authenticated
              </h2>
              <p className="text-green-200">
                Welcome, {user.email || user.user_metadata?.full_name || 'User'}!
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h3 className="text-white text-lg font-semibold mb-4">User Details</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">
                  <span className="font-medium">ID:</span> {user.id}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Email:</span> {user.email || 'Not provided'}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Provider:</span> {user.app_metadata?.provider || 'Unknown'}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Created:</span> {new Date(user.created_at || '').toLocaleDateString()}
                </p>
              </div>
            </div>

            {session && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <h3 className="text-white text-lg font-semibold mb-4">Session Details</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">
                    <span className="font-medium">Expires:</span> {session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'Unknown'}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium">Provider:</span> {session.user.app_metadata?.provider || 'Unknown'}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => signOut()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
              <h2 className="text-yellow-200 text-lg font-semibold mb-2">
                ⚠️ Not Authenticated
              </h2>
              <p className="text-yellow-200">
                Please sign in to test authentication.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => signInWithGoogle()}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign in with Google</span>
              </button>

              <div className="text-center">
                <a
                  href="/auth"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Go to Full Auth Page
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="/login"
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthTestPage;