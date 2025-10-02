'use client';

import { useEffect, useState } from 'react';

export default function StorageTest() {
  const [results, setResults] = useState<any>({});

  useEffect(() => {
    const testStorage = () => {
      const tests = {
        localStorageAvailable: false,
        localStorageWrite: false,
        localStorageRead: false,
        sessionStorageAvailable: false,
        cookies: false,
        supabaseKey: null,
        currentOrigin: '',
        currentHost: '',
        currentProtocol: ''
      };

      try {
        // Test localStorage availability
        tests.localStorageAvailable = typeof localStorage !== 'undefined';
        
        if (tests.localStorageAvailable) {
          // Test write
          localStorage.setItem('test-key', 'test-value');
          tests.localStorageWrite = true;
          
          // Test read
          const value = localStorage.getItem('test-key');
          tests.localStorageRead = value === 'test-value';
          
          // Clean up
          localStorage.removeItem('test-key');
        }
        
        // Test sessionStorage
        tests.sessionStorageAvailable = typeof sessionStorage !== 'undefined';
        
        // Test cookies
        tests.cookies = navigator.cookieEnabled;
        
        // Check for existing Supabase session
        tests.supabaseKey = localStorage.getItem('sb-molcqjsqtjbfclasynpg-auth-token');
        
        // Get current page info
        tests.currentOrigin = window.location.origin;
        tests.currentHost = window.location.host;
        tests.currentProtocol = window.location.protocol;
        
      } catch (error) {
        console.error('Storage test error:', error);
      }
      
      console.log('Storage test results:', tests);
      setResults(tests);
    };

    testStorage();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">Browser Storage Test</h1>
        
        <div className="space-y-6">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Storage Capabilities</h2>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">localStorage Available:</span> <span className={results.localStorageAvailable ? 'text-green-400' : 'text-red-400'}>{results.localStorageAvailable ? 'Yes' : 'No'}</span></div>
              <div><span className="text-gray-400">localStorage Write:</span> <span className={results.localStorageWrite ? 'text-green-400' : 'text-red-400'}>{results.localStorageWrite ? 'Yes' : 'No'}</span></div>
              <div><span className="text-gray-400">localStorage Read:</span> <span className={results.localStorageRead ? 'text-green-400' : 'text-red-400'}>{results.localStorageRead ? 'Yes' : 'No'}</span></div>
              <div><span className="text-gray-400">sessionStorage Available:</span> <span className={results.sessionStorageAvailable ? 'text-green-400' : 'text-red-400'}>{results.sessionStorageAvailable ? 'Yes' : 'No'}</span></div>
              <div><span className="text-gray-400">Cookies Enabled:</span> <span className={results.cookies ? 'text-green-400' : 'text-red-400'}>{results.cookies ? 'Yes' : 'No'}</span></div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">Current Environment</h2>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">Origin:</span> <span className="text-white break-all">{results.currentOrigin}</span></div>
              <div><span className="text-gray-400">Host:</span> <span className="text-white">{results.currentHost}</span></div>
              <div><span className="text-gray-400">Protocol:</span> <span className="text-white">{results.currentProtocol}</span></div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Supabase Session Status</h2>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">Supabase Auth Token:</span> <span className={results.supabaseKey ? 'text-green-400' : 'text-red-400'}>{results.supabaseKey ? 'Present' : 'Not Found'}</span></div>
              {results.supabaseKey && (
                <div className="mt-2">
                  <p className="text-gray-400">Token Preview:</p>
                  <code className="text-xs text-green-400 break-all">{JSON.stringify(results.supabaseKey, null, 2)}</code>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Next Steps</h2>
            <div className="space-y-2 text-sm text-gray-300">
              <p>If all storage tests pass but Supabase sessions still don't persist:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Check if domain/origin matches OAuth configuration</li>
                <li>Verify callback URL is properly configured in Supabase dashboard</li>
                <li>Test the native callback approach at <a href="/auth/callback-native" className="text-blue-400">/auth/callback-native</a></li>
                <li>Check browser console for additional authentication errors</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}