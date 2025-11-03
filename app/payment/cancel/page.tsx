'use client';

import { useRouter } from 'next/navigation';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Cancel Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-full p-6">
            <svg
              className="h-16 w-16 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Checkout Cancelled
        </h1>

        <p className="text-center text-gray-600 mb-6">
          No worries! Your payment was not processed. You can try again anytime you're ready.
        </p>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Still interested?</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" />
              </svg>
              Free access during beta (Dec 2025 - Feb 2025)
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" />
              </svg>
              Lock in $149/month lifetime pricing (50% off forever)
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" />
              </svg>
              100 founding member spots available
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <button
          onClick={() => router.push('/pricing')}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors mb-3"
        >
          Try Again
        </button>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back to Dashboard
        </button>

        {/* Support Link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Have questions?{' '}
          <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-700 font-medium">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
