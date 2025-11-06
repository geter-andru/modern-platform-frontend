'use client';

import { useState, useEffect } from 'react';
import { useCustomerCache, usePersonasCache, useCompanyRatingCache } from '@/app/lib/hooks/cache';

/**
 * Cache Testing Page
 * 
 * This page tests the TanStack Query cache hooks to verify:
 * 1. Cache behavior works correctly
 * 2. API calls are reduced by 60-80% as specified in Phase 5, Chunk 1
 * 3. Data is properly cached and shared between components
 */

export default function CacheTestPage() {
  const [apiCallCount, setApiCallCount] = useState(0);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Test with a sample customer ID
  const testCustomerId = '85e54a00-d75b-420e-a3bb-ddd750fc548a';

  // Cache hooks
  const customerCache = useCustomerCache({ 
    customerId: testCustomerId, 
    enabled: true 
  });
  
  const personasCache = usePersonasCache({ 
    customerId: testCustomerId, 
    enabled: true 
  });
  
  const ratingCache = useCompanyRatingCache({ 
    customerId: testCustomerId, 
    enabled: true 
  });

  // Monitor API calls
  useEffect(() => {
    const originalFetch = window.fetch;
    let callCount = 0;

    window.fetch = async (...args) => {
      callCount++;
      setApiCallCount(callCount);
      console.log(`🌐 API Call #${callCount}:`, args[0]);
      return originalFetch(...args);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const runCacheTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    setApiCallCount(0);

    const results: string[] = [];
    
    try {
      // Test 1: Initial data loading
      results.push('🧪 Test 1: Initial data loading...');
      await Promise.all([
        customerCache.refetchICP(),
        personasCache.refetchPersonas(),
        ratingCache.refetchRatings()
      ]);
      results.push(`✅ Initial load complete. API calls: ${apiCallCount}`);

      // Test 2: Cache hit test - same data should not trigger new API calls
      results.push('🧪 Test 2: Cache hit test...');
      const initialCallCount = apiCallCount;
      
      await Promise.all([
        customerCache.refetchICP(),
        personasCache.refetchPersonas(),
        ratingCache.refetchRatings()
      ]);
      
      const newCallCount = apiCallCount - initialCallCount;
      results.push(`✅ Cache hit test complete. New API calls: ${newCallCount}`);

      // Test 3: Multiple rapid requests (should use cache)
      results.push('🧪 Test 3: Multiple rapid requests...');
      const rapidCallCount = apiCallCount;
      
      for (let i = 0; i < 5; i++) {
        await Promise.all([
          customerCache.refetchICP(),
          personasCache.refetchPersonas(),
          ratingCache.refetchRatings()
        ]);
      }
      
      const rapidNewCalls = apiCallCount - rapidCallCount;
      results.push(`✅ Rapid requests complete. New API calls: ${rapidNewCalls}`);

      // Test 4: Cache invalidation test
      results.push('🧪 Test 4: Cache invalidation test...');
      const invalidationCallCount = apiCallCount;
      
      customerCache.invalidateICP();
      personasCache.invalidatePersonas();
      ratingCache.invalidateRatings();
      
      // Wait a bit for invalidation to trigger
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const invalidationNewCalls = apiCallCount - invalidationCallCount;
      results.push(`✅ Cache invalidation complete. New API calls: ${invalidationNewCalls}`);

      // Calculate efficiency
      const totalCalls = apiCallCount;
      const expectedCallsWithoutCache = 3 * 8; // 3 endpoints * 8 requests
      const efficiency = Math.round((1 - totalCalls / expectedCallsWithoutCache) * 100);
      
      results.push(`📊 Cache Efficiency: ${efficiency}% reduction in API calls`);
      results.push(`📊 Total API calls: ${totalCalls} (expected without cache: ${expectedCallsWithoutCache})`);
      
      if (efficiency >= 60) {
        results.push('🎉 SUCCESS: Cache efficiency target (60%+) achieved!');
      } else {
        results.push('⚠️ WARNING: Cache efficiency below target (60%+)');
      }

    } catch (error) {
      results.push(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setTestResults(results);
    setIsRunning(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Cache Testing Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Customer Cache Status */}
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Customer Cache</h3>
          <div className="space-y-2 text-sm">
            <div>Loading: {customerCache.isLoadingICP ? 'Yes' : 'No'}</div>
            <div>Error: {customerCache.icpError ? 'Yes' : 'No'}</div>
            <div>Data: {customerCache.icpData ? 'Loaded' : 'None'}</div>
          </div>
        </div>

        {/* Personas Cache Status */}
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Personas Cache</h3>
          <div className="space-y-2 text-sm">
            <div>Loading: {personasCache.isLoadingPersonas ? 'Yes' : 'No'}</div>
            <div>Error: {personasCache.hasError ? 'Yes' : 'No'}</div>
            <div>Count: {personasCache.personas?.length || 0}</div>
          </div>
        </div>

        {/* Rating Cache Status */}
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Rating Cache</h3>
          <div className="space-y-2 text-sm">
            <div>Loading: {ratingCache.isLoadingRatings ? 'Yes' : 'No'}</div>
            <div>Error: {ratingCache.hasError ? 'Yes' : 'No'}</div>
            <div>Count: {ratingCache.ratings?.length || 0}</div>
          </div>
        </div>
      </div>

      {/* API Call Counter */}
      <div className="card p-4 mb-6">
        <h3 className="font-semibold mb-2">API Call Counter</h3>
        <div className="text-2xl font-bold text-primary">
          {apiCallCount} calls made
        </div>
      </div>

      {/* Test Controls */}
      <div className="card p-4 mb-6">
        <h3 className="font-semibold mb-4">Cache Tests</h3>
        <button
          onClick={runCacheTest}
          disabled={isRunning}
          className="btn btn-primary"
        >
          {isRunning ? 'Running Tests...' : 'Run Cache Tests'}
        </button>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="card p-4">
          <h3 className="font-semibold mb-4">Test Results</h3>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug Information */}
      <div className="card p-4 mt-6">
        <h3 className="font-semibold mb-4">Debug Information</h3>
        <div className="space-y-2 text-sm">
          <div>Customer ID: {testCustomerId}</div>
          <div>Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL || 'Not set'}</div>
          <div>Cache Status: {isRunning ? 'Testing...' : 'Ready'}</div>
        </div>
      </div>
    </div>
  );
}





