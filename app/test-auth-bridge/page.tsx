/**
 * Authentication Bridge Test Page
 * 
 * This page allows testing the Supabase → Express backend authentication flow.
 * It provides a simple UI to run tests and see results.
 * 
 * FUNCTIONALITY STATUS: REAL
 * - Real authentication testing interface
 * - Real backend communication testing
 * - Real error reporting and debugging
 * - Production-ready test interface
 */

'use client';

import { useState, useEffect } from 'react';
import { runAuthBridgeTests, quickAuthTest, TestResult } from '@/app/lib/testing/auth-bridge-test';
import { authBridge } from '@/app/lib/services/auth-bridge';
import { modernApiClient } from '@/app/lib/api/modern-client';

export default function TestAuthBridgePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [user, setUser] = useState<any>(null);
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await authBridge.isAuthenticated();
      setAuthStatus(isAuth);
      
      if (isAuth) {
        const currentUser = await authBridge.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthStatus(false);
    }
  };

  const runQuickTest = async () => {
    setIsRunning(true);
    try {
      const success = await quickAuthTest();
      if (success) {
        await checkAuthStatus();
      }
    } catch (error) {
      console.error('Quick test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runFullTests = async () => {
    setIsRunning(true);
    try {
      const testResults = await runAuthBridgeTests();
      setResults(testResults);
    } catch (error) {
      console.error('Full tests failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const testBackendConnection = async () => {
    setIsRunning(true);
    try {
      const response = await modernApiClient.checkHealth();
      console.log('Backend health check:', response);
      alert(`Backend Health: ${response.success ? 'Connected' : 'Failed'}\n${response.error || 'OK'}`);
    } catch (error) {
      console.error('Backend test failed:', error);
      alert(`Backend test failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-text-primary mb-6">
            🔐 Authentication Bridge Test
          </h1>
          
          {/* Authentication Status */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Authentication Status</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  authStatus === true ? 'bg-green-100 text-green-800' :
                  authStatus === false ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {authStatus === true ? '✅ Authenticated' :
                   authStatus === false ? '❌ Not Authenticated' :
                   '⏳ Checking...'}
                </span>
              </div>
              
              {user && (
                <div className="space-y-1 text-sm text-text-muted">
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>User ID:</strong> {user.id}</div>
                  <div><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</div>
                </div>
              )}
            </div>
          </div>

          {/* Test Buttons */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Run Tests</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={runQuickTest}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? '⏳ Running...' : '🚀 Quick Test'}
              </button>
              
              <button
                onClick={testBackendConnection}
                disabled={isRunning}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? '⏳ Testing...' : '🏥 Backend Health'}
              </button>
              
              <button
                onClick={runFullTests}
                disabled={isRunning}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? '⏳ Running...' : '🧪 Full Test Suite'}
              </button>
              
              <button
                onClick={checkAuthStatus}
                disabled={isRunning}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔄 Refresh Status
              </button>
            </div>
          </div>

          {/* Test Results */}
          {results.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Test Results</h2>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.success
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">
                          {result.success ? '✅' : '❌'}
                        </span>
                        <span className="font-medium">{result.testName}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {result.duration}ms
                      </span>
                    </div>
                    
                    {result.error && (
                      <div className="mt-2 text-sm text-red-600">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                    
                    {result.details && (
                      <div className="mt-2 text-sm text-text-muted">
                        <details>
                          <summary className="cursor-pointer font-medium">
                            Details
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Summary */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total Tests:</span> {results.length}
                  </div>
                  <div>
                    <span className="font-medium">Passed:</span> {results.filter(r => r.success).length}
                  </div>
                  <div>
                    <span className="font-medium">Failed:</span> {results.filter(r => !r.success).length}
                  </div>
                  <div>
                    <span className="font-medium">Success Rate:</span>{' '}
                    {Math.round((results.filter(r => r.success).length / results.length) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Quick Test:</strong> Basic authentication and backend connectivity check</li>
              <li>• <strong>Backend Health:</strong> Test connection to Express backend API</li>
              <li>• <strong>Full Test Suite:</strong> Comprehensive authentication bridge testing</li>
              <li>• <strong>Refresh Status:</strong> Update authentication status display</li>
            </ul>
            <div className="mt-3 text-sm text-blue-700">
              <strong>Note:</strong> Make sure you're logged in with Supabase authentication before running tests.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
