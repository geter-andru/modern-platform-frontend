'use client';

import { useState, useEffect } from 'react';
import { PlatformUsageStats, ToolUsageStats, DateRangeFilter } from '../types';
import { fetchPlatformUsageStats, fetchToolUsageStats } from '../utils/dataFetchers';
import { Activity, Users, Clock, Download, Zap, TrendingUp } from 'lucide-react';

interface PlatformUsageAnalyticsProps {
  dateRange: DateRangeFilter;
}

/**
 * Platform Usage Analytics Component
 *
 * Displays analytics for authenticated users:
 * - Overall platform usage stats (sessions, active users, events)
 * - Tool-specific usage breakdown
 * - Export and engagement metrics
 */
export function PlatformUsageAnalytics({ dateRange }: PlatformUsageAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [platformStats, setPlatformStats] = useState<PlatformUsageStats | null>(null);
  const [toolStats, setToolStats] = useState<ToolUsageStats[]>([]);

  useEffect(() => {
    loadPlatformData();
  }, [dateRange]);

  const loadPlatformData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [platformResult, toolsResult] = await Promise.all([
        fetchPlatformUsageStats(dateRange),
        fetchToolUsageStats(dateRange),
      ]);

      if (!platformResult.success) {
        setError(platformResult.error || 'Failed to load platform stats');
        return;
      }
      if (!toolsResult.success) {
        setError(toolsResult.error || 'Failed to load tool stats');
        return;
      }

      setPlatformStats(platformResult.data);
      setToolStats(toolsResult.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading platform usage analytics...</span>
        </div>
      </div>
    );
  }

  if (error || !platformStats) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
        <div className="flex items-center text-red-600">
          <TrendingUp className="w-5 h-5 mr-2" />
          <span>Error: {error || 'No data available'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Platform Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Platform Overview</h2>
          <p className="text-sm text-gray-500 mt-1">
            Authenticated user activity and engagement metrics
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Sessions */}
            <MetricCard
              label="Total Sessions"
              value={platformStats.total_sessions.toLocaleString()}
              icon={<Activity className="w-6 h-6 text-blue-500" />}
              color="blue"
            />

            {/* Active Users */}
            <MetricCard
              label="Active Users"
              value={platformStats.total_active_users.toLocaleString()}
              icon={<Users className="w-6 h-6 text-green-500" />}
              color="green"
            />

            {/* Avg Session Duration */}
            <MetricCard
              label="Avg Session Duration"
              value={formatDuration(platformStats.avg_session_duration)}
              icon={<Clock className="w-6 h-6 text-purple-500" />}
              color="purple"
            />

            {/* Total Events */}
            <MetricCard
              label="Total Events"
              value={platformStats.total_events.toLocaleString()}
              icon={<Zap className="w-6 h-6 text-orange-500" />}
              color="orange"
            />
          </div>

          {/* Export Metrics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-700">Total Exports Generated</p>
                  <p className="text-3xl font-bold text-indigo-900 mt-2">
                    {platformStats.total_exports.toLocaleString()}
                  </p>
                  <p className="text-sm text-indigo-600 mt-1">
                    {platformStats.avg_exports_per_user.toFixed(1)} avg per user
                  </p>
                </div>
                <Download className="w-12 h-12 text-indigo-400" />
              </div>
            </div>

            {platformStats.most_used_tool && (
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border border-pink-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-pink-700">Most Popular Tool</p>
                    <p className="text-3xl font-bold text-pink-900 mt-2">
                      {platformStats.most_used_tool}
                    </p>
                    <p className="text-sm text-pink-600 mt-1">
                      {platformStats.most_used_tool_percentage.toFixed(1)}% of sessions
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-pink-400" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tool Usage Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Tool Usage Breakdown</h2>
          <p className="text-sm text-gray-500 mt-1">
            Detailed usage statistics for each platform tool
          </p>
        </div>

        <div className="p-6">
          <ToolUsageBreakdown tools={toolStats} />
        </div>
      </div>
    </div>
  );
}

/**
 * Metric Card Component
 */
interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function MetricCard({ label, value, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-6 border`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="ml-4">{icon}</div>
      </div>
    </div>
  );
}

/**
 * Tool Usage Breakdown Component
 */
interface ToolUsageBreakdownProps {
  tools: ToolUsageStats[];
}

function ToolUsageBreakdown({ tools }: ToolUsageBreakdownProps) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tool usage data available
      </div>
    );
  }

  // Find max uses for visual scaling
  const maxUses = Math.max(...tools.map(t => t.total_uses));

  return (
    <div className="space-y-4">
      {tools.map((tool, index) => {
        const widthPercentage = maxUses > 0 ? (tool.total_uses / maxUses) * 100 : 0;

        // Color gradient based on usage
        const getColor = (percentage: number) => {
          if (percentage >= 75) return 'from-blue-500 to-blue-600';
          if (percentage >= 50) return 'from-green-500 to-green-600';
          if (percentage >= 25) return 'from-yellow-500 to-yellow-600';
          return 'from-gray-400 to-gray-500';
        };

        const barGradient = getColor(tool.percentage_of_total_usage);

        return (
          <div key={tool.tool_id} className="border border-gray-200 rounded-lg p-4">
            {/* Tool Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{tool.tool_name}</h3>
                  <p className="text-sm text-gray-500">{tool.tool_id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{tool.total_uses.toLocaleString()}</p>
                <p className="text-xs text-gray-500">uses</p>
              </div>
            </div>

            {/* Usage Bar */}
            <div className="relative h-10 bg-gray-100 rounded-lg overflow-hidden mb-3">
              <div
                className={`absolute left-0 top-0 h-full bg-gradient-to-r ${barGradient} transition-all duration-500 ease-out flex items-center justify-between px-4`}
                style={{ width: `${widthPercentage}%` }}
              >
                <span className="text-white font-bold text-sm">
                  {tool.percentage_of_total_usage.toFixed(1)}% of total usage
                </span>
              </div>
            </div>

            {/* Tool Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 rounded p-2">
                <div className="flex items-center text-gray-500 mb-1">
                  <Users className="w-3 h-3 mr-1" />
                  <span className="text-xs">Unique Users</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{tool.unique_users}</p>
              </div>

              <div className="bg-gray-50 rounded p-2">
                <div className="flex items-center text-gray-500 mb-1">
                  <Clock className="w-3 h-3 mr-1" />
                  <span className="text-xs">Avg Time Spent</span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {formatDuration(tool.avg_time_spent)}
                </p>
              </div>

              <div className="bg-gray-50 rounded p-2">
                <div className="flex items-center text-gray-500 mb-1">
                  <Download className="w-3 h-3 mr-1" />
                  <span className="text-xs">Exports</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{tool.exports_generated}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Helper function to format duration
 */
function formatDuration(seconds: number): string {
  if (seconds === 0) return '—';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}
