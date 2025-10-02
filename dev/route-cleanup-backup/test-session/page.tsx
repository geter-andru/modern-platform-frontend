'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function TestSessionPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testSessionCreation = async () => {
    setLoading(true);
    setResult('Testing session creation...');
    
    try {
      // Test 1: Check current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log('Current session:', currentSession);
      setResult(prev => prev + '\nCurrent session: ' + (currentSession ? 'EXISTS' : 'NULL'));
      
      // Test 2: Try to create a mock session (this should fail but let's see how)
      const mockTokens = {
        access_token: 'mock_access_token_test',
        refresh_token: 'mock_refresh_token_test'
      };
      
      console.log('Attempting to set mock session...');
      setResult(prev => prev + '\nAttempting to set mock session...');
      
      const { data: { session: mockSession }, error } = await supabase.auth.setSession(mockTokens);
      
      console.log('Mock session result:', { session: !!mockSession, error });
      setResult(prev => prev + '\nMock session result: ' + JSON.stringify({ session: !!mockSession, error: error?.message || 'No error' }, null, 2));
      
      // Test 3: Check session again after attempt
      const { data: { session: afterSession } } = await supabase.auth.getSession();
      console.log('Session after mock attempt:', afterSession);
      setResult(prev => prev + '\nSession after mock: ' + (afterSession ? 'EXISTS' : 'NULL'));
      
      // Test 4: Test storage directly
      const storageKey = `sb-${supabase.supabaseUrl.split('//')[1].split('.')[0]}-auth-token`;
      const localStorageValue = localStorage.getItem(storageKey);
      console.log('LocalStorage value:', localStorageValue);
      setResult(prev => prev + '\nLocalStorage: ' + (localStorageValue ? 'HAS_VALUE' : 'NULL'));
      
    } catch (error) {
      console.error('Test error:', error);
      setResult(prev => prev + '\nERROR: ' + error);
    }
    
    setLoading(false);
  };

  const clearSession = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setResult('Session cleared');
    } catch (error) {
      setResult('Clear error: ' + error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Supabase Session Test</h1>
        
        <div className="space-y-4">
          <button
            onClick={testSessionCreation}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
          >
            {loading ? 'Testing...' : 'Test Session Creation'}
          </button>
          
          <button
            onClick={clearSession}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded ml-4"
          >
            Clear Session
          </button>
        </div>
        
        <div className="mt-8 bg-gray-900 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Test Results:</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-300">{result}</pre>
        </div>
      </div>
    </div>
  );
}