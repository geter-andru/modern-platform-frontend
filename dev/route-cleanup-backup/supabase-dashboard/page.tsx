'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getCurrentUser } from '@/lib/supabase/client';
import { LoadingSpinner } from '@/src/shared/components/ui/LoadingStates';

export default function SupabaseDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);
        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to H&S Platform
            </h1>
            <p className="text-gray-400">
              Hi {user?.email || user?.user_metadata?.name || 'User'}! Your dashboard is ready.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors border border-gray-700"
          >
            Sign Out
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Info</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                <span className="text-gray-500">Email:</span> {user?.email || 'Not provided'}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-500">User ID:</span> {user?.id}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-500">Created:</span> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/icp')}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-left"
              >
                🎯 ICP Analysis
              </button>
              <button 
                onClick={() => router.push('/cost-calculator')}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-left"
              >
                💰 Cost Calculator
              </button>
              <button 
                onClick={() => router.push('/business-case')}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-left"
              >
                📊 Business Case Builder
              </button>
            </div>
          </div>

          {/* Platform Status */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Platform Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Authentication</span>
                <span className="text-green-400">✅ Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Supabase</span>
                <span className="text-green-400">✅ Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tools</span>
                <span className="text-green-400">✅ Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Info */}
        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
          <h4 className="text-blue-400 font-medium mb-2">🚧 Development Environment</h4>
          <p className="text-blue-300 text-sm">
            This is a test environment for the Next.js migration. The Supabase authentication is working properly.
          </p>
        </div>
      </div>
    </div>
  );
}