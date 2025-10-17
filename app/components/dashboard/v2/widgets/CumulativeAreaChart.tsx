'use client';

/**
 * CumulativeAreaChart - Cumulative metrics tracking with area charts
 *
 * Features:
 * - Stacked or overlapping area charts
 * - Gradient fills for visual depth
 * - Multiple data series (points, activities, growth)
 * - Time period filtering (7 days, 30 days, 90 days, all time)
 * - Smooth animations with Recharts
 * - Responsive design
 * - Tooltips with cumulative totals
 * - Dark theme optimized colors
 * - Grid lines and axis labels
 */

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { TrendingUp, Calendar, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

// ==================== TYPE DEFINITIONS ====================

export type TimePeriod = '7d' | '30d' | '90d' | 'all';
export type StackMode = 'stacked' | 'overlapping';

export interface DataPoint {
  /** Date label (e.g., "Jan 15", "Week 1") */
  date: string;
  /** ISO timestamp for sorting */
  timestamp: string;
  /** Cumulative total points */
  cumulativePoints?: number;
  /** Cumulative activities completed */
  cumulativeActivities?: number;
  /** Cumulative competency growth */
  cumulativeGrowth?: number;
  /** Cumulative tools unlocked */
  cumulativeUnlocks?: number;
}

export interface DataSeries {
  /** Unique identifier for the series */
  key: string;
  /** Display name */
  label: string;
  /** Area fill color (hex) */
  color: string;
  /** Area stroke color (hex) */
  strokeColor?: string;
  /** Whether series is visible */
  enabled: boolean;
}

export interface CumulativeAreaChartProps {
  /** Array of data points over time */
  data: DataPoint[];
  /** Available data series */
  series: DataSeries[];
  /** Stacking mode */
  stackMode?: StackMode;
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
  grid: '#475569',
  axis: '#d1d5db',
  tooltip: '#1a1a1a',
  tooltipBorder: '#475569',
  chartBackground: '#0f172a'
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

/**
 * Convert hex color to rgba with opacity
 */
function hexToRgba(hex: string, opacity: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0, 0, 0, ${opacity})`;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
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

  // Calculate total for stacked view
  const total = payload.reduce((sum: any, entry: any) => sum + (entry.value || 0), 0);

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
        {payload.length > 1 && (
          <div className="pt-2 mt-2 border-t border-gray-700 flex justify-between">
            <span className="text-sm font-semibold" style={{ color: '#d1d5db' }}>Total</span>
            <span className="text-sm font-bold" style={{ color: '#ffffff' }}>
              {total.toFixed(0)}
            </span>
          </div>
        )}
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

/**
 * Stack mode toggle
 */
const StackModeToggle: React.FC<{
  stackMode: StackMode;
  onChange: (mode: StackMode) => void;
}> = ({ stackMode, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Layers className="w-4 h-4" style={{ color: '#9ca3af' }} />
      <div className="flex gap-1 bg-[#1a1a1a] rounded-lg p-1">
        <motion.button
          onClick={() => onChange('stacked')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
          style={{
            backgroundColor: stackMode === 'stacked' ? '#3b82f6' : 'transparent',
            color: stackMode === 'stacked' ? '#ffffff' : '#9ca3af'
          }}
        >
          Stacked
        </motion.button>
        <motion.button
          onClick={() => onChange('overlapping')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
          style={{
            backgroundColor: stackMode === 'overlapping' ? '#3b82f6' : 'transparent',
            color: stackMode === 'overlapping' ? '#ffffff' : '#9ca3af'
          }}
        >
          Overlapping
        </motion.button>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

export const CumulativeAreaChart: React.FC<CumulativeAreaChartProps> = ({
  data,
  series,
  stackMode: initialStackMode = 'stacked',
  timePeriod = '30d',
  onTimePeriodChange,
  title = 'Cumulative Progress',
  height = 400,
  className = ''
}) => {
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);
  const [stackMode, setStackMode] = useState<StackMode>(initialStackMode);

  // Filter enabled series
  const enabledSeries = series.filter((s) => s.enabled);

  // Calculate growth rate
  const latestDataPoint = data[data.length - 1];
  const previousDataPoint = data[data.length - 2];
  const growth = latestDataPoint && previousDataPoint
    ? ((latestDataPoint.cumulativePoints || 0) - (previousDataPoint.cumulativePoints || 0)) /
      (previousDataPoint.cumulativePoints || 1) * 100
    : 0;

  const isPositiveGrowth = growth > 0;

  // Get latest total
  const latestTotal = latestDataPoint?.cumulativePoints || 0;

  return (
    <div className={`rounded-lg p-6 ${className}`} style={{ backgroundColor: '#1a1a1a' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#0f172a' }}>
            <TrendingUp
              className="w-5 h-5"
              style={{ color: isPositiveGrowth ? '#10b981' : '#ef4444' }}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: '#ffffff' }}>
              {title}
            </h3>
            <p className="text-sm" style={{ color: '#9ca3af' }}>
              Total: {latestTotal.toFixed(0)} • {isPositiveGrowth ? '+' : ''}{growth.toFixed(1)}% growth
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Stack Mode Toggle */}
          <StackModeToggle stackMode={stackMode} onChange={setStackMode} />

          {/* Time Period Filter */}
          {onTimePeriodChange && (
            <TimePeriodFilter currentPeriod={timePeriod} onChange={onTimePeriodChange} />
          )}
        </div>
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
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            stackOffset={stackMode === 'stacked' ? 'none' : undefined}
          >
            <defs>
              {/* Gradient definitions for each series */}
              {enabledSeries.map((seriesItem) => (
                <linearGradient
                  key={`gradient-${seriesItem.key}`}
                  id={`gradient-${seriesItem.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={seriesItem.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={seriesItem.color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>

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

            {/* Render areas for each enabled series */}
            {enabledSeries.map((seriesItem) => (
              <Area
                key={seriesItem.key}
                type="monotone"
                dataKey={seriesItem.key}
                name={seriesItem.label}
                stackId={stackMode === 'stacked' ? '1' : undefined}
                stroke={seriesItem.strokeColor || seriesItem.color}
                strokeWidth={hoveredSeries === seriesItem.key ? 3 : 2}
                fill={`url(#gradient-${seriesItem.key})`}
                fillOpacity={stackMode === 'overlapping' ? 0.6 : 1}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            ))}
          </AreaChart>
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

export default CumulativeAreaChart;
