'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/lib/auth';
import { motion } from 'framer-motion';
import { Activity, Users, FileDown, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

interface PlatformAnalytics {
  aggregateStats: {
    totalToolSessions: number;
    totalExports: number;
    activeUsers: number;
    inactiveUsers: number;
  };
  topExporters: Array<{
    email: string;
    exportCount: number;
  }>;
  message?: string;
}

export function PlatformAnalyticsSection() {
  const { session } = useAuth();
  const [data, setData] = useState<PlatformAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlatformAnalytics();
  }, [session]);

  const fetchPlatformAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!session?.access_token) {
        throw new Error('No session token available');
      }

      console.log('🚀 Fetching platform analytics...');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/platform-analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch platform analytics');
      }

      const result = await response.json();
      console.log('✅ Platform analytics loaded:', result.data);
      setData(result.data);
    } catch (err) {
      console.error('❌ Error fetching platform analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load platform analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
          <p className="text-sm text-text-secondary">Loading platform analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-900/20 border border-red-500/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-300 mb-1">Error Loading Platform Analytics</h3>
            <p className="text-xs text-red-400/80 mb-3">{error}</p>
            <button
              onClick={fetchPlatformAnalytics}
              className="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Empty state: No platform activity yet
  const isEmpty = data.aggregateStats.totalToolSessions === 0 && data.aggregateStats.totalExports === 0;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Platform Usage Analytics</h2>
        <p className="text-sm text-text-secondary mt-1">
          Monitor tool usage, exports, and user engagement across the platform
        </p>
      </div>

      {/* Empty State */}
      {isEmpty && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-indigo-800/10 border border-indigo-500/20"
        >
          <div className="text-center max-w-md mx-auto">
            <Activity className="w-12 h-12 text-indigo-400/60 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Platform Activity Yet</h3>
            <p className="text-sm text-text-secondary">
              Platform usage analytics will appear here once founding members start using tools,
              generating exports, and engaging with the platform.
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      {!isEmpty && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Tool Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 border border-indigo-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-10 h-10 text-indigo-400" />
                <span className="text-3xl font-bold text-white">{data.aggregateStats.totalToolSessions}</span>
              </div>
              <h3 className="text-sm font-medium text-indigo-300">Total Tool Sessions</h3>
              <p className="text-xs text-indigo-400/60 mt-1">Across all founding members</p>
            </motion.div>

            {/* Total Exports */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border border-emerald-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <FileDown className="w-10 h-10 text-emerald-400" />
                <span className="text-3xl font-bold text-white">{data.aggregateStats.totalExports}</span>
              </div>
              <h3 className="text-sm font-medium text-emerald-300">Total Exports</h3>
              <p className="text-xs text-emerald-400/60 mt-1">PDFs, CSVs, and shares</p>
            </motion.div>

            {/* Active Users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <Users className="w-10 h-10 text-green-400" />
                <span className="text-3xl font-bold text-white">{data.aggregateStats.activeUsers}</span>
              </div>
              <h3 className="text-sm font-medium text-green-300">Active Users</h3>
              <p className="text-xs text-green-400/60 mt-1">Active in last 7 days</p>
            </motion.div>

            {/* Inactive Users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/30 to-slate-800/20 border border-slate-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-10 h-10 text-slate-400" />
                <span className="text-3xl font-bold text-white">{data.aggregateStats.inactiveUsers}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-300">Inactive Users</h3>
              <p className="text-xs text-slate-400/60 mt-1">7+ days since last activity</p>
            </motion.div>
          </div>

          {/* Top Exporters */}
          {data.topExporters && data.topExporters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-2xl bg-surface-secondary border border-border-subtle"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-4">Top Exporters</h3>
              <div className="space-y-3">
                {data.topExporters.map((exporter, index) => (
                  <div
                    key={`${exporter.email}-${index}`}
                    className="flex items-center justify-between p-4 rounded-lg bg-surface-primary border border-border-subtle hover:border-border-muted transition"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-900/30 border border-emerald-500/30">
                        <span className="text-sm font-bold text-emerald-400">#{index + 1}</span>
                      </div>
                      <p className="text-sm font-medium text-text-primary">{exporter.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileDown className="w-4 h-4 text-text-tertiary" />
                      <span className="text-lg font-semibold text-text-primary">{exporter.exportCount}</span>
                      <span className="text-xs text-text-secondary">exports</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* No Top Exporters */}
          {(!data.topExporters || data.topExporters.length === 0) && (
            <div className="p-6 rounded-2xl bg-surface-secondary border border-border-subtle">
              <div className="text-center py-4">
                <FileDown className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
                <p className="text-sm text-text-secondary">No exports generated yet</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
