'use client';

import { useEffect, useState } from 'react';

export default function StorageCleanup() {
  const [storageItems, setStorageItems] = useState<Array<{key: string, size: number, preview: string}>>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analyzeStorage();
  }, []);

  const analyzeStorage = () => {
    try {
      const items: Array<{key: string, size: number, preview: string}> = [];
      let total = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          const size = new Blob([value]).size;
          const preview = value.length > 100 ? value.substring(0, 100) + '...' : value;
          
          items.push({ key, size, preview });
          total += size;
        }
      }

      items.sort((a, b) => b.size - a.size);
      setStorageItems(items);
      setTotalSize(total);
      setError(null);
    } catch (err) {
      setError(`Error analyzing storage: ${err}`);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const removeItem = (key: string) => {
    try {
      localStorage.removeItem(key);
      analyzeStorage();
    } catch (err) {
      setError(`Error removing ${key}: ${err}`);
    }
  };

  const clearAllStorage = () => {
    if (confirm('Are you sure you want to clear ALL localStorage? This will log you out of all websites.')) {
      try {
        localStorage.clear();
        analyzeStorage();
      } catch (err) {
        setError(`Error clearing storage: ${err}`);
      }
    }
  };

  const testStorageWrite = () => {
    try {
      localStorage.setItem('test-key', 'test-value');
      localStorage.removeItem('test-key');
      setError(null);
      alert('Storage write test successful!');
    } catch (err) {
      setError(`Storage write failed: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-red-400">localStorage Cleanup Tool</h1>
        
        <div className="space-y-6">
          <div className="bg-red-900 p-6 rounded-lg border border-red-700">
            <h2 className="text-xl font-semibold mb-4 text-red-400">⚠️ Storage Quota Issue Detected</h2>
            <p className="text-gray-300 mb-4">
              Your localStorage is full, which is preventing Supabase from storing authentication sessions.
              This is why OAuth sign-in redirects back to login.
            </p>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">Total localStorage Usage:</span> <span className="text-red-400 font-mono">{formatSize(totalSize)}</span></div>
              <div><span className="text-gray-400">Number of Items:</span> <span className="text-white">{storageItems.length}</span></div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Actions</h2>
            <div className="space-x-4">
              <button 
                onClick={testStorageWrite}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
              >
                Test Storage Write
              </button>
              <button 
                onClick={clearAllStorage}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
              >
                Clear All localStorage
              </button>
              <button 
                onClick={analyzeStorage}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                Refresh Analysis
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">Storage Items (Largest First)</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {storageItems.map((item) => (
                <div key={item.key} className="border border-gray-700 p-3 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-mono text-sm truncate">{item.key}</p>
                      <p className="text-gray-400 text-xs">{formatSize(item.size)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.key)}
                      className="ml-2 px-2 py-1 bg-red-600 hover:bg-red-700 text-xs rounded"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 font-mono bg-gray-800 p-2 rounded overflow-x-auto">
                    {item.preview}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Next Steps</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>Review the storage items above and remove any unnecessary data</li>
              <li>Click "Test Storage Write" to verify localStorage is working</li>
              <li>Once storage is working, try the OAuth sign-in again</li>
              <li>The largest items are shown first - consider removing those for maximum impact</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}