'use client';

import { useState, useEffect } from 'react';
import {
  AssessmentStats,
  AssessmentScoreDistribution,
  TopCompanyByAssessment,
  DateRangeFilter,
} from '../types';
import {
  fetchAssessmentStats,
  fetchAssessmentScoreDistribution,
  fetchTopCompanies,
} from '../utils/dataFetchers';
import { CheckCircle2, XCircle, TrendingUp, Award, Building2, BarChart3 } from 'lucide-react';

interface AssessmentAnalyticsProps {
  dateRange: DateRangeFilter;
}

/**
 * Assessment Analytics Component
 *
 * Displays comprehensive analytics for the Andru assessment:
 * - Completion rates and abandonment stats
 * - Score distributions
 * - Top companies by assessment count
 * - Assessment-to-signup conversion
 */
export function AssessmentAnalytics({ dateRange }: AssessmentAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AssessmentStats | null>(null);
  const [distribution, setDistribution] = useState<AssessmentScoreDistribution[]>([]);
  const [topCompanies, setTopCompanies] = useState<TopCompanyByAssessment[]>([]);

  useEffect(() => {
    loadAssessmentData();
  }, [dateRange]);

  const loadAssessmentData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all assessment data in parallel
      const [statsResult, distributionResult, companiesResult] = await Promise.all([
        fetchAssessmentStats(dateRange),
        fetchAssessmentScoreDistribution(dateRange),
        fetchTopCompanies(dateRange, 10),
      ]);

      if (!statsResult.success) {
        setError(statsResult.error || 'Failed to load stats');
        return;
      }
      if (!distributionResult.success) {
        setError(distributionResult.error || 'Failed to load distribution');
        return;
      }
      if (!companiesResult.success) {
        setError(companiesResult.error || 'Failed to load companies');
        return;
      }

      setStats(statsResult.data);
      setDistribution(distributionResult.data);
      setTopCompanies(companiesResult.data);
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
          <span className="ml-3 text-gray-600">Loading assessment analytics...</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
        <div className="flex items-center text-red-600">
          <XCircle className="w-5 h-5 mr-2" />
          <span>Error: {error || 'No data available'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Assessment Overview</h2>
          <p className="text-sm text-gray-500 mt-1">
            Completion rates, scores, and conversion metrics
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Started */}
            <MetricCard
              label="Total Started"
              value={stats.total_started.toLocaleString()}
              icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
              color="blue"
            />

            {/* Total Completed */}
            <MetricCard
              label="Total Completed"
              value={stats.total_completed.toLocaleString()}
              icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
              color="green"
              subtitle={`${stats.completion_rate.toFixed(1)}% completion rate`}
            />

            {/* Total Abandoned */}
            <MetricCard
              label="Total Abandoned"
              value={stats.total_abandoned.toLocaleString()}
              icon={<XCircle className="w-5 h-5 text-red-500" />}
              color="red"
              subtitle={`${(100 - stats.completion_rate).toFixed(1)}% abandonment`}
            />

            {/* Signups After Assessment */}
            <MetricCard
              label="Converted to Signup"
              value={stats.total_signups_after_assessment.toLocaleString()}
              icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
              color="purple"
              subtitle={`${stats.assessment_to_signup_conversion.toFixed(1)}% conversion`}
            />
          </div>

          {/* Score Metrics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Avg Overall Score</p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">
                    {stats.avg_overall_score.toFixed(1)}
                  </p>
                </div>
                <Award className="w-10 h-10 text-blue-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Avg Buyer Score</p>
                  <p className="text-3xl font-bold text-purple-900 mt-1">
                    {stats.avg_buyer_score.toFixed(1)}
                  </p>
                </div>
                <Award className="w-10 h-10 text-purple-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Avg Time to Complete</p>
                  <p className="text-3xl font-bold text-green-900 mt-1">
                    {formatDuration(stats.avg_time_to_complete)}
                  </p>
                </div>
                <BarChart3 className="w-10 h-10 text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Distribution Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Score Distribution</h2>
          <p className="text-sm text-gray-500 mt-1">
            Breakdown of assessment scores by range
          </p>
        </div>

        <div className="p-6">
          <ScoreDistributionChart distribution={distribution} />
        </div>
      </div>

      {/* Top Companies Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Top Companies</h2>
          <p className="text-sm text-gray-500 mt-1">
            Companies with the most assessment completions
          </p>
        </div>

        <div className="p-6">
          <TopCompaniesTable companies={topCompanies} />
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
  color: 'blue' | 'green' | 'red' | 'purple';
  subtitle?: string;
}

function MetricCard({ label, value, icon, color, subtitle }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4 border`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="ml-3">{icon}</div>
      </div>
    </div>
  );
}

/**
 * Score Distribution Chart Component
 */
interface ScoreDistributionChartProps {
  distribution: AssessmentScoreDistribution[];
}

function ScoreDistributionChart({ distribution }: ScoreDistributionChartProps) {
  if (distribution.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No score distribution data available
      </div>
    );
  }

  const maxCount = Math.max(...distribution.map(d => d.count));

  return (
    <div className="space-y-4">
      {distribution.map((range) => {
        const widthPercentage = maxCount > 0 ? (range.count / maxCount) * 100 : 0;

        // Color based on score range
        const getColor = (scoreRange: string) => {
          const start = parseInt(scoreRange.split('-')[0]);
          if (start >= 80) return 'bg-green-500';
          if (start >= 60) return 'bg-blue-500';
          if (start >= 40) return 'bg-yellow-500';
          if (start >= 20) return 'bg-orange-500';
          return 'bg-red-500';
        };

        const barColor = getColor(range.score_range);

        return (
          <div key={range.score_range}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">{range.score_range}</span>
              <span className="text-gray-500">
                {range.count} assessments ({range.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden">
              <div
                className={`${barColor} h-full flex items-center justify-end px-3 transition-all duration-500 ease-out`}
                style={{ width: `${widthPercentage}%` }}
              >
                {range.count > 0 && (
                  <span className="text-white font-bold text-sm">{range.count}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Top Companies Table Component
 */
interface TopCompaniesTableProps {
  companies: TopCompanyByAssessment[];
}

function TopCompaniesTable({ companies }: TopCompaniesTableProps) {
  if (companies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No company data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assessments
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avg Score
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Latest Assessment
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map((company, index) => (
            <tr key={company.company_name} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {index + 1}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{company.company_name}</span>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right">
                <span className="text-sm font-bold text-gray-900">
                  {company.total_assessments}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  company.avg_score >= 80 ? 'bg-green-100 text-green-800' :
                  company.avg_score >= 60 ? 'bg-blue-100 text-blue-800' :
                  company.avg_score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {company.avg_score.toFixed(1)}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-500">
                {formatDate(company.latest_assessment_date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
    year: 'numeric',
  });
}
