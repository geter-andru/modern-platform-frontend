
'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { supabase } from '../../../lib/supabase/client';
import { useRouter } from 'next/navigation';

interface SupabaseAuthProps {
  redirectTo?: string;
}

const SupabaseAuth: React.FC<SupabaseAuthProps> = ({ redirectTo = '/icp' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) {
        router.push(redirectTo);
      }
    };
    
    checkAuth();

    // Listen for auth state changes (OAuth callback)
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.push(redirectTo);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabaseClient.auth, router, redirectTo]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectTo}`
        }
      });
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabaseClient.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectTo}`
        }
      });
      
      if (error) {
        setError(error.message);
      } else {
        setError('Check your email for the login link!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Access the H&S Revenue Intelligence Platform
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const email = (e.target as HTMLInputElement).value;
                    if (email) {
                      handleEmailSignIn(email);
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  const email = (document.querySelector('input[type="email"]') as HTMLInputElement)?.value;
                  if (email) {
                    handleEmailSignIn(email);
                  }
                }}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Send Magic Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseAuth;
