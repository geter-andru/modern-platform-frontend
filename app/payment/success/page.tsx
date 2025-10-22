'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase/client';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto-redirect to dashboard after 5 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const sessionId = searchParams?.get('session_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-6">
            <svg
              className="h-16 w-16 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Trial Started Successfully!
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Your 3-day free trial has begun. You now have full access to all platform features.
        </p>

        {/* Trial Details */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">What's Next:</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" />
              </svg>
              Access all features for the next 3 days
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" />
              </svg>
              We'll charge $99/month after trial ends
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" />
              </svg>
              Cancel anytime before trial ends - no charge
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors mb-3"
        >
          Go to Dashboard
        </button>

        {/* Auto-redirect message */}
        <p className="text-center text-sm text-gray-500">
          Redirecting to dashboard in {countdown} seconds...
        </p>

        {sessionId && (
          <p className="mt-4 text-xs text-gray-400 text-center">
            Session ID: {sessionId}
          </p>
        )}
      </div>
    </div>
  );
}
