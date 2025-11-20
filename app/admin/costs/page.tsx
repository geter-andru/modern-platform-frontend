'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/src/shared/components/design-system';
import {
  DollarSign,
  TrendingUp,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  Users,
  BarChart3,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/app/lib/auth';

interface TodaysCosts {
  total_calls: number;
  successful_calls: number;
  failed_calls: number;
  total_cost_usd: string;
  total_tokens: number;
  operations_breakdown: Record<string, { calls: number; cost: string }>;
  models_breakdown: Record<string, { calls: number; cost: string }>;
}

interface MonthlyCosts {
  month: string;
  total_calls: number;
  total_cost_usd: string;
  total_tokens: number;
  avg_cost_per_call: string;
  avg_tokens_per_call: number;
}

interface DailyCost {
  date: string;
  total_calls: number;
  total_cost_usd: string;
  total_tokens: number;
}

interface TopUser {
  user_id: string;
  total_cost_usd: string;
}

/**
 * AI Cost Dashboard
 *
 * Real-time dashboard for tracking AI API costs and usage metrics.
 * Features:
 * - Today's real-time costs
 * - Month-to-date summary
 * - Cost breakdown by operation and model
 * - Daily cost trends (last 30 days)
 * - Top spending users
 * - Unit economics calculations
 */
export default function CostsPage() {
  const { session } = useAuth();
  const [todaysCosts, setTodaysCosts] = useState<TodaysCosts | null>(null);
  const [monthlyCosts, setMonthlyCosts] = useState<MonthlyCosts | null>(null);
  const [dailyCosts, setDailyCosts] = useState<DailyCost[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Budget thresholds
  const DAILY_BUDGET = 200; // $200/day
  const MONTHLY_BUDGET = 5000; // $5,000/month

  // Fetch data
  useEffect(() => {
    fetchAllData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchAllData();
    }, 60000);
    return () => clearInterval(interval);
  }, [session]);

  const fetchAllData = async () => {
    try {
      setError(null);

      if (!session?.access_token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

      // Fetch all data in parallel
      const [todayRes, monthlyRes, dailyRes, topUsersRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/costs/today`, { headers }),
        fetch(`${apiUrl}/api/admin/costs/monthly`, { headers }),
        fetch(`${apiUrl}/api/admin/costs/daily`, { headers }),
        fetch(`${apiUrl}/api/admin/costs/top-users?limit=10`, { headers }),
      ]);

      const [todayData, monthlyData, dailyData, topUsersData] = await Promise.all([
        todayRes.json(),
        monthlyRes.json(),
        dailyRes.json(),
        topUsersRes.json(),
      ]);

      if (todayData.success) setTodaysCosts(todayData.data);
      if (monthlyData.success) setMonthlyCosts(monthlyData.data);
      if (dailyData.success) setDailyCosts(dailyData.data);
      if (topUsersData.success) setTopUsers(topUsersData.data);

      setLastRefresh(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cost data:', err);
      setError('Failed to load cost data');
      setLoading(false);
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <GlassCard className="p-8">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
            <p className="text-white text-lg">Loading cost data...</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <GlassCard className="p-8">
          <div className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="w-6 h-6" />
            <p className="text-lg">{error}</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  const todayBurnRate = todaysCosts ? (parseFloat(todaysCosts.total_cost_usd) / DAILY_BUDGET) * 100 : 0;
  const monthlyBurnRate = monthlyCosts ? (parseFloat(monthlyCosts.total_cost_usd) / MONTHLY_BUDGET) * 100 : 0;
  const successRate = todaysCosts
    ? ((todaysCosts.successful_calls / (todaysCosts.total_calls || 1)) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <GlassCard className="border-b border-white/10 rounded-none">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">AI Cost Dashboard</h1>
              <p className="text-sm text-white/60 mt-1">
                Real-time AI API cost tracking and unit economics
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-white/40">Last updated</p>
                <p className="text-sm text-white/80">
                  {lastRefresh.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={fetchAllData}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Today's Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Today's Costs (Real-Time)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Cost"
              value={formatCurrency(todaysCosts?.total_cost_usd || 0)}
              icon={<DollarSign className="w-6 h-6" />}
              trend={todayBurnRate < 50 ? 'good' : todayBurnRate < 80 ? 'warning' : 'danger'}
              subtitle={`${todayBurnRate.toFixed(0)}% of daily budget`}
            />
            <StatCard
              label="API Calls"
              value={formatNumber(todaysCosts?.total_calls || 0)}
              icon={<Activity className="w-6 h-6" />}
              trend="neutral"
              subtitle={`${successRate}% success rate`}
            />
            <StatCard
              label="Total Tokens"
              value={formatNumber(todaysCosts?.total_tokens || 0)}
              icon={<Zap className="w-6 h-6" />}
              trend="neutral"
              subtitle={`${formatNumber(todaysCosts?.total_tokens || 0)} used`}
            />
            <StatCard
              label="Failed Calls"
              value={formatNumber(todaysCosts?.failed_calls || 0)}
              icon={<AlertTriangle className="w-6 h-6" />}
              trend={todaysCosts?.failed_calls === 0 ? 'good' : 'warning'}
              subtitle={`${todaysCosts?.successful_calls || 0} successful`}
            />
          </div>
        </motion.div>

        {/* Month-to-Date Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Month-to-Date Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Monthly Cost"
              value={formatCurrency(monthlyCosts?.total_cost_usd || 0)}
              icon={<DollarSign className="w-6 h-6" />}
              trend={monthlyBurnRate < 60 ? 'good' : monthlyBurnRate < 85 ? 'warning' : 'danger'}
              subtitle={`${monthlyBurnRate.toFixed(0)}% of budget`}
            />
            <StatCard
              label="Total Calls"
              value={formatNumber(monthlyCosts?.total_calls || 0)}
              icon={<BarChart3 className="w-6 h-6" />}
              trend="neutral"
            />
            <StatCard
              label="Avg Cost/Call"
              value={formatCurrency(monthlyCosts?.avg_cost_per_call || 0)}
              icon={<DollarSign className="w-6 h-6" />}
              trend="neutral"
              subtitle="Unit economics"
            />
            <StatCard
              label="Avg Tokens/Call"
              value={formatNumber(monthlyCosts?.avg_tokens_per_call || 0)}
              icon={<Zap className="w-6 h-6" />}
              trend="neutral"
            />
          </div>
        </motion.div>

        {/* Cost Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Operations Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Cost by Operation</h3>
              <div className="space-y-3">
                {todaysCosts?.operations_breakdown &&
                  Object.entries(todaysCosts.operations_breakdown)
                    .sort(([, a], [, b]) => parseFloat(b.cost) - parseFloat(a.cost))
                    .map(([operation, data]) => (
                      <BreakdownRow
                        key={operation}
                        label={operation}
                        value={formatCurrency(data.cost)}
                        count={data.calls}
                      />
                    ))}
                {(!todaysCosts?.operations_breakdown || Object.keys(todaysCosts.operations_breakdown).length === 0) && (
                  <p className="text-white/40 text-center py-4">No data yet today</p>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Models Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Cost by Model</h3>
              <div className="space-y-3">
                {todaysCosts?.models_breakdown &&
                  Object.entries(todaysCosts.models_breakdown)
                    .sort(([, a], [, b]) => parseFloat(b.cost) - parseFloat(a.cost))
                    .map(([model, data]) => (
                      <BreakdownRow
                        key={model}
                        label={model.replace('claude-', '').replace('-20240229', '').replace('-20241022', '')}
                        value={formatCurrency(data.cost)}
                        count={data.calls}
                      />
                    ))}
                {(!todaysCosts?.models_breakdown || Object.keys(todaysCosts.models_breakdown).length === 0) && (
                  <p className="text-white/40 text-center py-4">No data yet today</p>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Daily Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <GlassCard className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Daily Cost Trend (Last 30 Days)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/60 text-sm font-medium pb-3">Date</th>
                    <th className="text-right text-white/60 text-sm font-medium pb-3">Calls</th>
                    <th className="text-right text-white/60 text-sm font-medium pb-3">Tokens</th>
                    <th className="text-right text-white/60 text-sm font-medium pb-3">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyCosts.slice(0, 10).map((day) => (
                    <tr key={day.date} className="border-b border-white/5">
                      <td className="py-3 text-white/80 text-sm">
                        {new Date(day.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3 text-right text-white/80 text-sm">
                        {formatNumber(day.total_calls)}
                      </td>
                      <td className="py-3 text-right text-white/80 text-sm">
                        {formatNumber(day.total_tokens)}
                      </td>
                      <td className="py-3 text-right text-white font-medium text-sm">
                        {formatCurrency(day.total_cost_usd)}
                      </td>
                    </tr>
                  ))}
                  {dailyCosts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-white/40 py-8">
                        No historical data available yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>

        {/* Top Spending Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Top Spending Users
            </h3>
            <div className="space-y-3">
              {topUsers.slice(0, 10).map((user, index) => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white/40 text-sm font-medium w-6">#{index + 1}</span>
                    <span className="text-white/80 text-sm font-mono">{user.user_id.slice(0, 8)}...</span>
                  </div>
                  <span className="text-white font-medium">{formatCurrency(user.total_cost_usd)}</span>
                </div>
              ))}
              {topUsers.length === 0 && (
                <p className="text-white/40 text-center py-4">No user data available yet</p>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  icon,
  trend,
  subtitle,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: 'good' | 'warning' | 'danger' | 'neutral';
  subtitle?: string;
}) {
  const trendColors = {
    good: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
    neutral: 'text-blue-400',
  };

  const bgColors = {
    good: 'bg-green-500/20',
    warning: 'bg-yellow-500/20',
    danger: 'bg-red-500/20',
    neutral: 'bg-blue-500/20',
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${bgColors[trend]}`}>
          <div className={trendColors[trend]}>{icon}</div>
        </div>
        {trend === 'good' && <CheckCircle className="w-5 h-5 text-green-400" />}
        {trend === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
        {trend === 'danger' && <AlertTriangle className="w-5 h-5 text-red-400" />}
      </div>
      <p className="text-white/60 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {subtitle && <p className="text-xs text-white/40">{subtitle}</p>}
    </GlassCard>
  );
}

// Breakdown Row Component
function BreakdownRow({
  label,
  value,
  count,
}: {
  label: string;
  value: string;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
      <div>
        <p className="text-white/80 text-sm font-medium">{label}</p>
        <p className="text-white/40 text-xs">{count} calls</p>
      </div>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}
