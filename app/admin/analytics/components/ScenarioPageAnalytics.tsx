'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/src/shared/components/design-system';
import { DateRangeFilter, ScenarioPageOverview, ScenarioDetailedStats } from '../types';
import { fetchScenarioPageOverview, fetchScenarioDetailedStats } from '../utils/dataFetchers';
import {
  Eye,
  Users,
  Clock,
  MousePointer,
  TrendingUp,
  FileText,
  UserPlus,
  Building2,
  Briefcase,
  Calendar,
  BarChart3,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface ScenarioPageAnalyticsProps {
  dateRange: DateRangeFilter;
}

/**
 * Scenario Page Analytics Component
 *
 * Tracks performance of all 94 ICP scenario pages:
 * - Overall metrics (views, engagement, conversions)
 * - Per-scenario breakdown with company/persona
 * - Ranking by performance
 */
export function ScenarioPageAnalytics({ dateRange }: ScenarioPageAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<ScenarioPageOverview | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioDetailedStats[]>([]);

  useEffect(() => {
    loadScenarioData();
  }, [dateRange]);

  const loadScenarioData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [overviewResult, scenariosResult] = await Promise.all([
        fetchScenarioPageOverview(dateRange),
        fetchScenarioDetailedStats(dateRange),
      ]);

      if (!overviewResult.success) {
        setError(overviewResult.error || 'Failed to load overview');
        return;
      }
      if (!scenariosResult.success) {
        setError(scenariosResult.error || 'Failed to load scenarios');
        return;
      }

      setOverview(overviewResult.data);
      setScenarios(scenariosResult.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <GlassCard className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-white/70">Loading scenario analytics...</span>
        </div>
      </GlassCard>
    );
  }

  if (error || !overview) {
    return (
      <GlassCard className="p-8 border-red-500/30">
        <div className="flex items-center text-red-400">
          <TrendingUp className="w-5 h-5 mr-2" />
          <span>Error: {error || 'No data available'}</span>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Views"
          value={overview.total_views.toLocaleString()}
          icon={<Eye className="h-6 w-6 text-white" />}
          gradient="from-blue-500 to-blue-600"
        />

        <MetricCard
          label="Unique Visitors"
          value={overview.unique_visitors.toLocaleString()}
          icon={<Users className="h-6 w-6 text-white" />}
          gradient="from-purple-500 to-purple-600"
        />

        <MetricCard
          label="Avg Time on Page"
          value={formatDuration(overview.avg_time_on_page)}
          icon={<Clock className="h-6 w-6 text-white" />}
          gradient="from-green-500 to-green-600"
        />

        <MetricCard
          label="CTA Clicks"
          value={overview.total_cta_clicks.toLocaleString()}
          icon={<MousePointer className="h-6 w-6 text-white" />}
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6" hover glow>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Scenario → Assessment</p>
              <p className="text-3xl font-bold text-white mt-2">
                {overview.scenario_to_assessment_conversions.toLocaleString()}
              </p>
              <p className="text-sm text-white/60 mt-1">
                {overview.scenario_to_assessment_rate.toFixed(1)}% conversion rate
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo/30">
              <FileText className="w-10 h-10 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover glow>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Scenario → Signup</p>
              <p className="text-3xl font-bold text-white mt-2">
                {overview.scenario_to_signup_conversions.toLocaleString()}
              </p>
              <p className="text-sm text-white/60 mt-1">
                {overview.scenario_to_signup_rate.toFixed(1)}% conversion rate
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg shadow-pink/30">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Scenario Performance Table */}
      <GlassCard className="overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Scenario Performance</h2>
          <p className="text-sm text-white/60 mt-1">
            Ranked by total views • {scenarios.length} scenarios tracked
          </p>
        </div>

        <div className="overflow-x-auto">
          <ScenarioTable scenarios={scenarios} />
        </div>
      </GlassCard>
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
  gradient: string;
}

function MetricCard({ label, value, icon, gradient }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="p-6" hover glow>
        <div className="flex items-center">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            {icon}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-white/70">{label}</p>
            <p className="text-2xl font-bold text-white" style={{
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              {value}
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/**
 * Scenario Performance Table Component
 */
interface ScenarioTableProps {
  scenarios: ScenarioDetailedStats[];
}

function ScenarioTable({ scenarios }: ScenarioTableProps) {
  if (scenarios.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-white/50">
        No scenario data available
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-white/10">
      <thead>
        <tr className="bg-white/5">
          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
            Rank
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
            Company
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
            Persona
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">
            Views
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">
            Visitors
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">
            Avg Time
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">
            CTA Rate
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">
            Last Viewed
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {scenarios.map((scenario, index) => (
          <motion.tr
            key={scenario.scenario_slug}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="hover:bg-white/5 transition-colors"
          >
            <td className="px-4 py-4 whitespace-nowrap">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow/30' :
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900 shadow-lg shadow-gray/20' :
                index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange/30' :
                'bg-white/10 text-white/70'
              }`}>
                {index + 1}
              </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <Building2 className="w-4 h-4 mr-2 text-white/40" />
                <span className="text-sm font-medium text-white">{scenario.company_name}</span>
              </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-white/40" />
                <span className="text-sm text-white/70">{scenario.persona}</span>
              </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-right">
              <span className="text-sm font-bold text-white">
                {scenario.total_views.toLocaleString()}
              </span>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-right">
              <span className="text-sm text-white/70">
                {scenario.unique_visitors}
              </span>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-right">
              <span className="text-sm text-white/70">
                {formatDuration(scenario.avg_time_on_page)}
              </span>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-right">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                scenario.cta_click_rate >= 50 ? 'bg-green-500/20 text-green-300' :
                scenario.cta_click_rate >= 25 ? 'bg-blue-500/20 text-blue-300' :
                scenario.cta_click_rate >= 10 ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {scenario.cta_click_rate.toFixed(1)}%
              </span>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-white/50">
              {formatDate(scenario.last_viewed)}
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Helper function to format duration
 */
function formatDuration(seconds: number): string {
  if (seconds === 0) return '—';

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

/**
 * Helper function to format date
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
