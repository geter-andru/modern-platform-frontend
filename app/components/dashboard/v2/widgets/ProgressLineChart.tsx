'use client';

/**
 * ProgressLineChart - Progress tracking over time with line graphs
 *
 * Features:
 * - Multiple data series (competency areas, points, activities)
 * - Time period filtering (7 days, 30 days, 90 days, all time)
 * - Smooth animations with Recharts
 * - Responsive design
 * - Tooltips with detailed breakdowns
 * - Legend for data series
 * - Dark theme optimized colors
 * - Grid lines and axis labels
 */

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

// ==================== TYPE DEFINITIONS ====================

export type TimePeriod = '7d' | '30d' | '90d' | 'all';

export interface DataPoint {
  /** Date label (e.g., "Jan 15", "Week 1") */
  date: string;
  /** ISO timestamp for sorting */
  timestamp: string;
  /** Total points earned */
  totalPoints?: number;
  /** Customer Analysis score */
  customerAnalysis?: number;
  /** Value Communication score */
  valueCommunication?: number;
  /** Sales Execution score */
  salesExecution?: number;
  /** Number of activities completed */
  activitiesCompleted?: number;
}

export interface DataSeries {
  /** Unique identifier for the series */
  key: string;
  /** Display name */
  label: string;
  /** Line color (hex) */
  color: string;
  /** Whether series is visible */
  enabled: boolean;
}

export interface ProgressLineChartProps {
  /** Array of data points over time */
  data: DataPoint[];
  /** Available data series */
  series: DataSeries[];
  /** Current time period filter */
  timePeriod?: TimePeriod;
  /** Time period change handler */
  onTimePeriodChange?: (period: TimePeriod) => void;
  /** Chart title */
  title?: string;
  /** Chart height in pixels */
  height?: number;
  /** Additional CSS classes */
  className?: string;
}

// ==================== CONSTANTS ====================

const TIME_PERIODS: { value: TimePeriod; label: string }[] = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'all', label: 'All Time' }
];

const DEFAULT_COLORS = {
  grid: '#475569',           // Lighter grid for better visibility
  axis: '#d1d5db',           // Brighter axis labels
  tooltip: '#1a1a1a',
  tooltipBorder: '#475569',
  chartBackground: '#0f172a' // Distinct chart area background
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format date for display on X-axis
 */
function formatXAxis(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}

/**
 * Format value for Y-axis (add K for thousands)
 */
function formatYAxis(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

// ==================== SUB-COMPONENTS ====================

/**
 * Custom tooltip component for chart
 */
const CustomTooltip: React.FC<TooltipProps<number, string>> = (props) => {
  const { active } = props;
  const payload = (props as any).payload;
  const label = (props as any).label;
  
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className="rounded-lg p-4 shadow-lg border"
      style={{
        backgroundColor: DEFAULT_COLORS.tooltip,
        borderColor: DEFAULT_COLORS.tooltipBorder
      }}
    >
      <p className="font-semibold mb-2" style={{ color: '#ffffff' }}>
        {formatXAxis(label)}
      </p>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span style={{ color: '#d1d5db' }}>{entry.name}</span>
            </div>
            <span className="font-medium" style={{ color: '#ffffff' }}>
              {typeof entry.value === 'number' ? entry.value.toFixed(0) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Time period filter buttons
 */
const TimePeriodFilter: React.FC<{
  currentPeriod: TimePeriod;
  onChange: (period: TimePeriod) => void;
}> = ({ currentPeriod, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4" style={{ color: '#9ca3af' }} />
      <div className="flex gap-1 bg-[#1a1a1a] rounded-lg p-1">
        {TIME_PERIODS.map((period) => {
          const isActive = currentPeriod === period.value;
          return (
            <motion.button
              key={period.value}
              onClick={() => onChange(period.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
              style={{
                backgroundColor: isActive ? '#3b82f6' : 'transparent',
                color: isActive ? '#ffffff' : '#9ca3af'
              }}
            >
              {period.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

export const ProgressLineChart: React.FC<ProgressLineChartProps> = ({
  data,
  series,
  timePeriod = '30d',
  onTimePeriodChange,
  title = 'Progress Over Time',
  height = 400,
  className = ''
}) => {
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);

  // Filter enabled series
  const enabledSeries = series.filter((s) => s.enabled);

  // Calculate trend
  const latestDataPoint = data[data.length - 1];
  const previousDataPoint = data[data.length - 2];
  const trend = latestDataPoint && previousDataPoint
    ? ((latestDataPoint.totalPoints || 0) - (previousDataPoint.totalPoints || 0)) /
      (previousDataPoint.totalPoints || 1) * 100
    : 0;

  const isPositiveTrend = trend > 0;

  return (
    <div className={`rounded-lg p-6 ${className}`} style={{ backgroundColor: '#1a1a1a' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#0f172a' }}>
            <TrendingUp
              className="w-5 h-5"
              style={{ color: isPositiveTrend ? '#10b981' : '#ef4444' }}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: '#ffffff' }}>
              {title}
            </h3>
            <p className="text-sm" style={{ color: '#9ca3af' }}>
              {isPositiveTrend ? '+' : ''}{trend.toFixed(1)}% from previous period
            </p>
          </div>
        </div>

        {/* Time Period Filter */}
        {onTimePeriodChange && (
          <TimePeriodFilter currentPeriod={timePeriod} onChange={onTimePeriodChange} />
        )}
      </div>

      {/* Chart Container with Background */}
      <div
        className="rounded-lg p-4 border"
        style={{
          backgroundColor: DEFAULT_COLORS.chartBackground,
          borderColor: DEFAULT_COLORS.grid
        }}
      >
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={DEFAULT_COLORS.grid}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              stroke={DEFAULT_COLORS.axis}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              stroke={DEFAULT_COLORS.axis}
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px', color: '#d1d5db' }}
              onMouseEnter={(e) => setHoveredSeries(e.dataKey as string)}
              onMouseLeave={() => setHoveredSeries(null)}
            />

            {/* Render lines for each enabled series */}
            {enabledSeries.map((seriesItem) => (
              <Line
                key={seriesItem.key}
                type="monotone"
                dataKey={seriesItem.key}
                name={seriesItem.label}
                stroke={seriesItem.color}
                strokeWidth={hoveredSeries === seriesItem.key ? 3 : 2}
                dot={{ fill: seriesItem.color, r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Data Series Legend with Toggles */}
      <div className="mt-6 flex flex-wrap gap-4">
        {series.map((seriesItem) => (
          <div
            key={seriesItem.key}
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{
              backgroundColor: seriesItem.enabled ? '#0f172a' : '#1a1a1a',
              opacity: seriesItem.enabled ? 1 : 0.5
            }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: seriesItem.color }}
            />
            <span className="text-sm font-medium" style={{ color: '#d1d5db' }}>
              {seriesItem.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressLineChart;
