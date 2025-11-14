'use client';

import { useState, useEffect } from 'react';
import { NavigationPath, UserJourney, DateRangeFilter } from '../types';
import { fetchNavigationPaths, fetchUserJourneys } from '../utils/dataFetchers';
import { ArrowRight, Users, Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface UserFlowChartProps {
  dateRange: DateRangeFilter;
}

type ViewMode = 'transitions' | 'journeys';

/**
 * User Flow Chart Component
 *
 * Displays user navigation patterns and common journeys
 *
 * Features:
 * - Two view modes: Transitions (page-to-page) and Journeys (complete paths)
 * - Visual representation of navigation flows
 * - Conversion and dropout metrics for each path
 * - Time spent analytics
 */
export function UserFlowChart({ dateRange }: UserFlowChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('transitions');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navigationPaths, setNavigationPaths] = useState<NavigationPath[]>([]);
  const [userJourneys, setUserJourneys] = useState<UserJourney[]>([]);

  useEffect(() => {
    loadFlowData();
  }, [dateRange, viewMode]);

  const loadFlowData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (viewMode === 'transitions') {
        const result = await fetchNavigationPaths(dateRange, 25);
        if (result.success) {
          setNavigationPaths(result.data);
        } else {
          setError(result.error || 'Failed to load navigation paths');
        }
      } else {
        const result = await fetchUserJourneys(dateRange, 2, 15);
        if (result.success) {
          setUserJourneys(result.data);
        } else {
          setError(result.error || 'Failed to load user journeys');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header with View Toggle */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Flow Analysis</h2>
            <p className="text-sm text-gray-500 mt-1">
              {viewMode === 'transitions'
                ? 'Most common page-to-page transitions'
                : 'Complete user journey patterns'}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('transitions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'transitions'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Transitions
            </button>
            <button
              onClick={() => setViewMode('journeys')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'journeys'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Journeys
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading flow data...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-red-600">
            <TrendingDown className="w-5 h-5 mr-2" />
            <span>Error: {error}</span>
          </div>
        ) : viewMode === 'transitions' ? (
          <NavigationTransitionsView paths={navigationPaths} />
        ) : (
          <UserJourneysView journeys={userJourneys} />
        )}
      </div>
    </div>
  );
}

/**
 * Navigation Transitions View Component
 */
interface NavigationTransitionsViewProps {
  paths: NavigationPath[];
}

function NavigationTransitionsView({ paths }: NavigationTransitionsViewProps) {
  if (paths.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No navigation data available for this date range
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {paths.map((path, index) => (
        <NavigationPathCard key={`${path.from_page}-${path.to_page}-${index}`} path={path} />
      ))}
    </div>
  );
}

/**
 * Navigation Path Card Component
 */
interface NavigationPathCardProps {
  path: NavigationPath;
}

function NavigationPathCard({ path }: NavigationPathCardProps) {
  const conversionRate = path.total_transitions > 0
    ? (path.conversion_count / path.total_transitions) * 100
    : 0;

  const dropoutRate = path.total_transitions > 0
    ? (path.dropout_count / path.total_transitions) * 100
    : 0;

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Path Visual */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 bg-blue-50 px-4 py-2 rounded-lg">
          <p className="text-sm font-medium text-gray-900 truncate">{formatPagePath(path.from_page)}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <div className="flex-1 bg-green-50 px-4 py-2 rounded-lg">
          <p className="text-sm font-medium text-gray-900 truncate">{formatPagePath(path.to_page)}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Transitions</p>
          <p className="text-lg font-bold text-gray-900">{path.total_transitions.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Unique Users</p>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-gray-400" />
            <p className="text-lg font-bold text-gray-900">{path.unique_users.toLocaleString()}</p>
          </div>
        </div>
        <div>
          <p className="text-gray-500">Avg Time</p>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-gray-400" />
            <p className="text-lg font-bold text-gray-900">{formatDuration(path.avg_time_between)}</p>
          </div>
        </div>
        <div>
          <p className="text-gray-500">Outcome</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="font-bold">{conversionRate.toFixed(0)}%</span>
            </div>
            <div className="flex items-center text-red-600">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span className="font-bold">{dropoutRate.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * User Journeys View Component
 */
interface UserJourneysViewProps {
  journeys: UserJourney[];
}

function UserJourneysView({ journeys }: UserJourneysViewProps) {
  if (journeys.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No journey patterns found with minimum 2 occurrences
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {journeys.map((journey, index) => (
        <UserJourneyCard key={journey.journey_id} journey={journey} rank={index + 1} />
      ))}
    </div>
  );
}

/**
 * User Journey Card Component
 */
interface UserJourneyCardProps {
  journey: UserJourney;
  rank: number;
}

function UserJourneyCard({ journey, rank }: UserJourneyCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Journey Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            {rank}
          </div>
          <div>
            <p className="text-sm text-gray-500">Journey Pattern</p>
            <p className="text-lg font-bold text-gray-900">{journey.total_occurrences} occurrences</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Conversion Rate</p>
            <p className={`text-lg font-bold ${
              journey.conversion_rate >= 50 ? 'text-green-600' :
              journey.conversion_rate >= 25 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {journey.conversion_rate.toFixed(1)}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Avg Duration</p>
            <div className="flex items-center justify-end">
              <Clock className="w-4 h-4 mr-1 text-gray-400" />
              <p className="text-lg font-bold text-gray-900">{formatDuration(journey.avg_duration)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Path Visual */}
      <div className="bg-gray-50 rounded-lg p-3 mb-2">
        <div className="flex items-center flex-wrap gap-2">
          {journey.path_sequence.map((page, index) => (
            <div key={index} className="flex items-center">
              <div className="bg-white border border-gray-200 rounded px-3 py-1.5">
                <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  {formatPagePath(page)}
                </p>
              </div>
              {index < journey.path_sequence.length - 1 && (
                <ArrowRight className="w-4 h-4 mx-1 text-gray-400 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dropout Info */}
      {journey.dropout_step && (
        <div className="flex items-center text-sm text-red-600 bg-red-50 rounded px-3 py-2">
          <TrendingDown className="w-4 h-4 mr-2" />
          <span>
            Most common dropout: <strong>{formatPagePath(journey.dropout_step)}</strong>
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Helper function to format page paths for display
 */
function formatPagePath(path: string): string {
  if (!path || path === 'unknown') return 'Unknown Page';

  // Remove leading slash
  const cleaned = path.startsWith('/') ? path.slice(1) : path;

  // Handle common paths
  if (cleaned === '' || cleaned === 'index') return 'Home';
  if (cleaned === 'dashboard') return 'Dashboard';
  if (cleaned.startsWith('icp/')) return 'ICP: ' + cleaned.split('/')[1];
  if (cleaned.startsWith('tools/')) return 'Tool: ' + cleaned.split('/')[1];
  if (cleaned.startsWith('admin/')) return 'Admin: ' + cleaned.split('/')[1];

  // Capitalize and format
  return cleaned
    .split('/')
    .map(segment =>
      segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    )
    .join(' / ');
}

/**
 * Helper function to format duration in seconds
 */
function formatDuration(seconds: number): string {
  if (seconds === 0) return '—';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${secs}s`;
  }
}
