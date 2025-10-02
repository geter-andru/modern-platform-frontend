'use client';

import { useState } from 'react';
import webResearchService from '@/app/lib/services/webResearchService';

export default function ApiTestPage() {
  const [query, setQuery] = useState('artificial intelligence startup funding');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testRealResearch = async () => {
    setLoading(true);
    setResults(null);
    
    try {
      console.log('🚀 Testing REAL web research service...');
      
      const researchData = await webResearchService.conductProductResearch({
        productName: query.split(' ')[0] || 'default',
        businessType: 'Technology',
        productDescription: query
      }, 'medium');
      
      console.log('📊 Real research results:', researchData);
      setResults(researchData);
      
    } catch (error) {
      console.error('❌ Test failed:', error);
      setResults({ error: (error as any).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          🧪 Real API Integration Test
        </h1>
        
        <div className="bg-slate-900 rounded-lg p-6 mb-6">
          <label className="text-white block mb-2">Test Query:</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 text-white rounded mb-4"
            placeholder="Enter search query..."
          />
          
          <button
            onClick={testRealResearch}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Test Real Research'}
          </button>
        </div>

        {results && (
          <div className="bg-slate-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Results {results.real ? '✅ REAL DATA' : '❌ MOCK DATA'} {/* @production-approved */}
            </h2>
            
            {results.error ? (
              <div className="text-red-400">Error: {results.error}</div>
            ) : (
              <div className="space-y-4">
                <div className="text-green-400">
                  ✅ Successful: {results.successful} | 
                  ❌ Failed: {results.failed} | 
                  📦 Cached: {results.cached}
                </div>
                
                {Object.entries(results.data || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="border-t border-slate-700 pt-4">
                    <h3 className="text-purple-400 font-semibold mb-2">{key}</h3>
                    
                    {value.sources && (
                      <div className="mb-2">
                        <span className="text-slate-400">Sources:</span>
                        <ul className="text-sm text-slate-300 ml-4">
                          {value.sources.slice(0, 3).map((source: string, i: number) => (
                            <li key={i} className="truncate">• {source}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {value.insights && (
                      <div>
                        <span className="text-slate-400">Insights:</span>
                        <div className="text-sm text-slate-300 ml-4">
                          {value.insights[0]?.substring(0, 200)}...
                        </div>
                      </div>
                    )}
                    
                    {value.competitorList && (
                      <div>
                        <span className="text-slate-400">Competitors Found:</span>
                        <div className="text-sm text-slate-300 ml-4">
                          {value.competitorList.join(', ') || 'None extracted'}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-slate-500 mt-1">
                      Real: {value.real ? '✅' : '❌'}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <details className="mt-4">
              <summary className="text-slate-400 cursor-pointer">Raw JSON</summary>
              <pre className="text-xs text-slate-500 mt-2 overflow-auto">
                {JSON.stringify(results, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}