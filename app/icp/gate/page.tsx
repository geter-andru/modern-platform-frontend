'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authService } from '@/app/lib/auth';
import Image from 'next/image';

export default function ICPGatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const redirectPath = searchParams.get('redirect');
  const error = searchParams.get('error');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // If user is already authenticated with delve email, redirect
    if (currentUser?.email?.includes('@delve.') && redirectPath) {
      router.push(redirectPath);
    }
  }, [redirectPath, router]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const redirectTo = redirectPath
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`
        : `${window.location.origin}/auth/callback`;

      await authService.signInWithGoogle(redirectTo);
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      fontFamily: '"Red Hat Display", sans-serif',
      background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
      color: '#ffffff'
    }}>
      <div className="max-w-md w-full mx-4">
        <div className="rounded-2xl shadow-xl p-8 text-center" style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/andru-logo-v2_192x192.png"
              alt="Andru"
              width={64}
              height={64}
              className="rounded-lg"
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold mb-4" style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {error === 'unauthorized' ? 'Access Restricted' : 'Sign In to View'}
          </h1>

          {/* Message */}
          {error === 'unauthorized' ? (
            <div className="mb-8">
              <p className="text-lg mb-4" style={{ color: '#fca5a5' }}>
                This content is exclusively for Delve users.
              </p>
              <p className="text-base" style={{ color: '#a3a3a3' }}>
                {user?.email ? (
                  <>You're signed in as <strong style={{ color: '#ffffff' }}>{user.email}</strong>, but you need a <strong style={{ color: '#ffffff' }}>@delve.*</strong> email address to access this page.</>
                ) : (
                  <>Please sign in with your <strong style={{ color: '#ffffff' }}>@delve.*</strong> email address to continue.</>
                )}
              </p>
            </div>
          ) : (
            <div className="mb-8">
              <p className="text-lg mb-4" style={{ color: '#e5e5e5' }}>
                This customer intelligence analysis is exclusively for Delve users.
              </p>
              <p className="text-base" style={{ color: '#a3a3a3' }}>
                Sign in with your <strong style={{ color: '#ffffff' }}>@delve.*</strong> email to view this content.
              </p>
            </div>
          )}

          {/* Sign In Button */}
          {!user || !user.email?.includes('@delve.') ? (
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full text-white font-bold px-8 py-4 rounded-lg hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In with Google'}
            </button>
          ) : null}

          {/* Back to Home */}
          <a
            href="/"
            className="inline-block mt-6 text-sm hover:opacity-80 transition-opacity"
            style={{ color: '#a3a3a3' }}
          >
            ← Back to Andru
          </a>
        </div>
      </div>
    </div>
  );
}
