'use client';

import { useState, useEffect } from 'react';
import { ConversionFunnel, FunnelStage, DateRangeFilter } from '../types';
import { fetchConversionFunnel } from '../utils/dataFetchers';
import { TrendingUp, TrendingDown, Users, Clock, ChevronRight } from 'lucide-react';

interface ConversionFunnelChartProps {
  dateRange: DateRangeFilter;
}

/**
 * Conversion Funnel Chart Component
 *
 * Displays a visual funnel showing user progression through:
 * Visit → Assessment → Signup → Payment
 *
 * Features:
 * - Visual funnel representation with sizing based on stage volume
 * - Detailed stats for each stage (completion rate, drop rate, volume)
 * - Overall conversion metrics
 * - Loading and error states
 */
export function ConversionFunnelChart({ dateRange }: ConversionFunnelChartProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [funnel, setFunnel] = useState<ConversionFunnel | null>(null);

  useEffect(() => {
    loadFunnelData();
  }, [dateRange]);

  const loadFunnelData = async () => {
    setLoading(true);
    setError(null);

    const result = await fetchConversionFunnel(dateRange);

    if (result.success) {
      setFunnel(result.data);
    } else {
      setError(result.error || 'Failed to load funnel data');
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading conversion funnel...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
        <div className="flex items-center text-red-600">
          <TrendingDown className="w-5 h-5 mr-2" />
          <span className="font-medium">Error loading funnel:</span>
          <span className="ml-2">{error}</span>
        </div>
      </div>
    );
  }

  if (!funnel) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <p className="text-gray-500 text-center">No funnel data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">{funnel.funnel_name}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Complete user journey from first visit to payment
        </p>
      </div>

      {/* Overall Metrics */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Entered</p>
            <p className="text-2xl font-bold text-gray-900">
              {funnel.total_entered_funnel.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Converted</p>
            <p className="text-2xl font-bold text-green-600">
              {funnel.total_completed_funnel.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Conversion Rate</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-blue-600">
                {funnel.overall_conversion_rate.toFixed(1)}%
              </p>
              {funnel.overall_conversion_rate > 0 && (
                <TrendingUp className="w-4 h-4 ml-2 text-green-500" />
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg Time to Convert</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(funnel.avg_time_to_convert)}
              </p>
              <Clock className="w-4 h-4 ml-2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Funnel */}
      <div className="p-8">
        <div className="space-y-6">
          {funnel.stages.map((stage, index) => (
            <FunnelStageVisual
              key={stage.stage_name}
              stage={stage}
              index={index}
              maxWidth={funnel.total_entered_funnel}
              isLast={index === funnel.stages.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Individual Funnel Stage Visual Component
 */
interface FunnelStageVisualProps {
  stage: FunnelStage;
  index: number;
  maxWidth: number;
  isLast: boolean;
}

function FunnelStageVisual({ stage, index, maxWidth, isLast }: FunnelStageVisualProps) {
  // Calculate width percentage based on volume
  const widthPercentage = maxWidth > 0
    ? (stage.total_entered / maxWidth) * 100
    : 0;

  // Calculate colors based on completion rate
  const getStageColor = (completionRate: number) => {
    if (completionRate >= 70) return 'bg-green-500';
    if (completionRate >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const barColor = getStageColor(stage.completion_rate);
  const textColor = getStageColor(stage.completion_rate).replace('bg-', 'text-');

  return (
    <div className="relative">
      {/* Stage Bar */}
      <div className="flex items-center gap-4">
        {/* Stage Number */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
          {index + 1}
        </div>

        {/* Stage Content */}
        <div className="flex-1">
          {/* Stage Label */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900">{stage.stage_name}</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                <span className="font-medium">{stage.total_entered.toLocaleString()}</span>
                <span className="ml-1">entered</span>
              </div>
              <div className={`flex items-center ${textColor} font-bold`}>
                <span>{stage.completion_rate.toFixed(1)}%</span>
                <span className="ml-1">completed</span>
              </div>
            </div>
          </div>

          {/* Funnel Bar */}
          <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full ${barColor} transition-all duration-500 ease-out flex items-center justify-between px-4`}
              style={{ width: `${widthPercentage}%` }}
            >
              <div className="flex items-center text-white font-bold">
                <span className="text-2xl">{stage.total_completed.toLocaleString()}</span>
                <span className="ml-2 text-sm opacity-90">completed</span>
              </div>
              {stage.total_dropped > 0 && (
                <div className="flex items-center text-white/80 text-sm">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  <span>{stage.total_dropped.toLocaleString()} dropped ({stage.drop_rate.toFixed(1)}%)</span>
                </div>
              )}
            </div>
          </div>

          {/* Stage Stats */}
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            {stage.avg_time_in_stage > 0 && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>Avg time: {formatDuration(stage.avg_time_in_stage)}</span>
              </div>
            )}
            {stage.next_stage && (
              <div className="flex items-center">
                <ChevronRight className="w-3 h-3 mr-1" />
                <span>Next: {stage.next_stage}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connector Arrow */}
      {!isLast && (
        <div className="flex justify-center py-2">
          <div className="w-0.5 h-6 bg-gray-300"></div>
        </div>
      )}
    </div>
  );
}

/**
 * Helper function to format duration in seconds to human-readable format
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
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}
