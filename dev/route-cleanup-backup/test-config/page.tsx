'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function TestConfigPage() {
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    // Get Supabase configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Extract project ID from URL
    const projectId = supabaseUrl?.split('.')[0]?.replace('https://', '');
    
    setConfig({
      supabaseUrl,
      projectId,
      hasAnonKey: !!supabaseAnonKey,
      anonKeyLength: supabaseAnonKey?.length,
      authConfig: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        debug: true
      },
      expectedCallbackUrl: `${window.location.origin}/auth/callback`,
      currentOrigin: window.location.origin,
      localStorage: {
        storageKey: `sb-${projectId}-auth-token`,
        hasStoredSession: !!localStorage.getItem(`sb-${projectId}-auth-token`)
      }
    });

    // Test authentication endpoint
    testAuthEndpoint();
  }, []);

  const testAuthEndpoint = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log('Auth endpoint test:', { hasSession: !!data.session, error });
    } catch (err) {
      console.error('Auth endpoint error:', err);
    }
  };

  const clearAllSessions = () => {
    // Clear all possible session storage
    const projectId = config.projectId;
    localStorage.removeItem(`sb-${projectId}-auth-token`);
    localStorage.removeItem(`sb-${projectId}-auth-token-code-verifier`);
    sessionStorage.clear();
    console.log('All sessions cleared');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">Supabase Configuration Test</h1>
        
        <div className="space-y-6">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Project Configuration</h2>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">Supabase URL:</span> <span className="text-white">{config.supabaseUrl}</span></div>
              <div><span className="text-gray-400">Project ID:</span> <span className="text-white">{config.projectId}</span></div>
              <div><span className="text-gray-400">Has Anon Key:</span> <span className="text-white">{config.hasAnonKey ? 'Yes' : 'No'}</span></div>
              <div><span className="text-gray-400">Anon Key Length:</span> <span className="text-white">{config.anonKeyLength}</span></div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">OAuth Configuration</h2>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">Expected Callback URL:</span> <span className="text-white break-all">{config.expectedCallbackUrl}</span></div>
              <div><span className="text-gray-400">Current Origin:</span> <span className="text-white">{config.currentOrigin}</span></div>
              <div className="mt-4 p-4 bg-gray-800 rounded">
                <p className="text-yellow-400 mb-2">⚠️ Make sure this URL is added in Supabase Dashboard:</p>
                <code className="text-green-400">{config.expectedCallbackUrl}</code>
                <p className="text-gray-400 mt-2 text-xs">Go to: Authentication → URL Configuration → Redirect URLs</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Session Storage</h2>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">Storage Key:</span> <span className="text-white">{config.localStorage?.storageKey}</span></div>
              <div><span className="text-gray-400">Has Stored Session:</span> <span className="text-white">{config.localStorage?.hasStoredSession ? 'Yes' : 'No'}</span></div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-red-400">Troubleshooting Actions</h2>
            <div className="space-y-4">
              <button
                onClick={clearAllSessions}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
              >
                Clear All Sessions
              </button>
              <p className="text-gray-400 text-sm">This will clear all stored sessions and reload the page.</p>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Next Steps</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>Verify the callback URL above is added to your Supabase dashboard</li>
              <li>Check that Google OAuth is enabled in Supabase Authentication → Providers</li>
              <li>Clear all sessions using the button above</li>
              <li>Try signing in again at <a href="/login" className="text-blue-400 hover:text-blue-300">/login</a></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}