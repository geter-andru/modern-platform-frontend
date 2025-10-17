'use client';

/**
 * TaskCacheMonitor.tsx
 *
 * Development widget for monitoring cache performance in real-time.
 * Displays hit rate, cache size, memory usage, and provides manual
 * cache control. Fixed bottom-right position with expandable details.
 *
 * @module TaskCacheMonitor
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCacheManager from '@/app/lib/services/TaskCacheManager';
// import type { ExtendedCacheStatistics } from '@/app/lib/services/TaskCacheManager';
type ExtendedCacheStatistics = any;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TaskCacheMonitorProps {
  enabled?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function TaskCacheMonitor({
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  className = ''
}: TaskCacheMonitorProps) {
  // State
  const [expanded, setExpanded] = useState(false);
  const [stats, setStats] = useState<ExtendedCacheStatistics>({
    hits: 0,
    misses: 0,
    evictions: 0,
    size: 0,
    hitRate: '0%',
    memoryUsage: 0,
    localStorageKeys: 0
  });
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  // ==========================================================================
  // CACHE MONITORING
  // ==========================================================================

  /**
   * Update cache statistics
   */
  const updateStats = useCallback(() => {
    const currentStats = TaskCacheManager.getStatistics();
    setStats(currentStats);
  }, []);

  /**
   * Auto-refresh statistics
   */
  useEffect(() => {
    if (!enabled || !autoRefresh) return;

    // Initial update
    updateStats();

    // Update every 2 seconds
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, [enabled, autoRefresh, updateStats]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const handleToggle = useCallback(() => {
    setExpanded(prev => !prev);
    if (!expanded) {
      updateStats(); // Refresh when expanding
    }
  }, [expanded, updateStats]);

  const handleClearCache = useCallback(() => {
    if (confirm('Clear all cache entries? This cannot be undone.')) {
      TaskCacheManager.clear();
      updateStats();
    }
  }, [updateStats]);

  const handleCleanupExpired = useCallback(() => {
    const cleaned = TaskCacheManager.cleanupExpiredEntries();
    alert(`Cleaned up ${cleaned} expired entries`);
    updateStats();
  }, [updateStats]);

  const handleToggleAutoRefresh = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, []);

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  const getHitRateColor = (hitRate: string): string => {
    const rate = parseFloat(hitRate);
    if (rate >= 80) return 'text-green-400';
    if (rate >= 60) return 'text-blue-400';
    if (rate >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceLevel = (hitRate: string): {
    level: string;
    color: string;
  } => {
    const rate = parseFloat(hitRate);
    if (rate >= 80)
      return { level: 'Excellent', color: 'bg-green-500/20 text-green-400' };
    if (rate >= 60) return { level: 'Good', color: 'bg-blue-500/20 text-blue-400' };
    if (rate >= 40) return { level: 'Fair', color: 'bg-yellow-500/20 text-yellow-400' };
    return { level: 'Poor', color: 'bg-red-500/20 text-red-400' };
  };

  // Don't render if disabled
  if (!enabled) return null;

  const performance = getPerformanceLevel(stats.hitRate);
  const total = stats.hits + stats.misses;

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      <AnimatePresence mode="wait">
        {!expanded ? (
          // Compact View
          <motion.div
            key="compact"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleToggle}
            className="cursor-pointer"
          >
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl hover:shadow-2xl transition-shadow p-3">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className={`text-lg font-bold ${getHitRateColor(stats.hitRate)}`}>
                    {stats.hitRate}
                  </div>
                  <div className="text-xs text-gray-400">Cache</div>
                </div>
                <div className="h-8 w-px bg-gray-700" />
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-300">{stats.size}</div>
                  <div className="text-xs text-gray-400">Items</div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // Expanded View
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-80"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-200">Cache Monitor</h3>
                <button
                  onClick={handleToggle}
                  className="p-1 rounded hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-200"
                >
                  <svg
                    className="w-5 h-5"
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
                </button>
              </div>

              {/* Performance Badge */}
              <div className="flex items-center gap-2">
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${performance.color}`}
                >
                  {performance.level}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                    }`}
                  />
                  {autoRefresh ? 'Live' : 'Paused'}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="p-4 grid grid-cols-2 gap-3">
              {/* Hit Rate */}
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Hit Rate</div>
                <div className={`text-xl font-bold ${getHitRateColor(stats.hitRate)}`}>
                  {stats.hitRate}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.hits} / {total}
                </div>
              </div>

              {/* Cache Size */}
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Memory</div>
                <div className="text-xl font-bold text-blue-400">{stats.memoryUsage}</div>
                <div className="text-xs text-gray-500 mt-1">entries</div>
              </div>

              {/* Hits */}
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Hits</div>
                <div className="text-xl font-bold text-green-400">{stats.hits}</div>
              </div>

              {/* Misses */}
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Misses</div>
                <div className="text-xl font-bold text-red-400">{stats.misses}</div>
              </div>

              {/* Evictions */}
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Evictions</div>
                <div className="text-xl font-bold text-orange-400">{stats.evictions}</div>
              </div>

              {/* LocalStorage */}
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Storage</div>
                <div className="text-xl font-bold text-purple-400">
                  {stats.localStorageKeys}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-800 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={handleToggleAutoRefresh}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    autoRefresh
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                  }`}
                >
                  {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
                </button>
                <button
                  onClick={updateStats}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 transition-colors"
                  title="Refresh now"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>

              <button
                onClick={handleCleanupExpired}
                className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
              >
                Clean Expired
              </button>

              <button
                onClick={handleClearCache}
                className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
              >
                Clear All Cache
              </button>
            </div>

            {/* Info */}
            <div className="p-3 bg-gray-800/30 text-xs text-gray-500 text-center">
              Development tool • Updates every 2s
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
