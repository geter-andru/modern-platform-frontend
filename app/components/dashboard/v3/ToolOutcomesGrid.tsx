'use client';

/**
 * ToolOutcomesGrid - Leading Indicators Display
 *
 * Displays 7 tool outcome indicators (leading indicators) that predict
 * financial outcomes 4-8 weeks ahead. Each indicator shows:
 * - Current value
 * - Industry benchmark comparison
 * - Trend direction (improvement vs previous period)
 * - What it predicts
 *
 * Part of Dashboard-v3 "GPS for Revenue" system
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Users,
  DollarSign,
  Clock,
  Award,
  Share2,
  AlertCircle
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Sparkline } from './charts/Sparkline';

// ==================== TYPE DEFINITIONS ====================

export interface ToolOutcomeIndicator {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  benchmark: number;
  previousValue?: number;
  historicalData?: number[]; // Last 5-12 weeks of data for sparkline
  predicts: string;
  icon: LucideIcon;
  color: string;
}

export interface ToolOutcomesGridProps {
  indicators: ToolOutcomeIndicator[];
  isLoading?: boolean;
  error?: string | null;
}

// ==================== HELPER FUNCTIONS ====================

const getTrendDirection = (
  current: number,
  previous?: number
): 'up' | 'down' | 'neutral' => {
  if (!previous) return 'neutral';
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'neutral';
};

const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
  switch (direction) {
    case 'up':
      return TrendingUp;
    case 'down':
      return TrendingDown;
    default:
      return Minus;
  }
};

const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
  switch (direction) {
    case 'up':
      return 'text-green-500';
    case 'down':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

const calculateChange = (current: number, previous?: number): number => {
  if (!previous) return 0;
  return current - previous;
};

const formatValue = (value: number, unit: string): string => {
  if (unit === '%') {
    return `${value.toFixed(1)}%`;
  }
  if (unit === 'number') {
    return value.toFixed(1);
  }
  if (unit === 'days') {
    return `${Math.round(value)} days`;
  }
  return `${value}`;
};

// ==================== INDICATOR CARD COMPONENT ====================

interface IndicatorCardProps {
  indicator: ToolOutcomeIndicator;
  index: number;
}

const IndicatorCard: React.FC<IndicatorCardProps> = ({ indicator, index }) => {
  const Icon = indicator.icon;
  const trend = getTrendDirection(indicator.value, indicator.previousValue);
  const TrendIcon = getTrendIcon(trend);
  const trendColor = getTrendColor(trend);
  const change = calculateChange(indicator.value, indicator.previousValue);

  const isBelowBenchmark = indicator.value < indicator.benchmark;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#1f1f1f] border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${indicator.color} bg-opacity-10`}>
            <Icon className={`h-5 w-5 ${indicator.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-200">
              {indicator.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {indicator.description}
            </p>
          </div>
        </div>
      </div>

      {/* Value Display with Sparkline */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">
              {formatValue(indicator.value, indicator.unit)}
            </span>
            {indicator.previousValue && (
              <div className={`flex items-center space-x-1 ${trendColor}`}>
                <TrendIcon className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {change > 0 ? '+' : ''}
                  {formatValue(Math.abs(change), indicator.unit === '%' ? 'pt' : indicator.unit)}
                </span>
              </div>
            )}
          </div>
          {/* Sparkline */}
          {indicator.historicalData && indicator.historicalData.length > 0 && (
            <Sparkline
              data={indicator.historicalData}
              color={indicator.color.replace('text-', 'rgb(var(--')}
              fillColor={`${indicator.color.replace('text-', 'rgba(var(--')}0.1)`}
              width={80}
              height={32}
              showTooltip={true}
            />
          )}
        </div>
      </div>

      {/* Benchmark Comparison */}
      <div className="mb-4 p-3 bg-[#151515] rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Industry Benchmark</span>
          <span className="text-sm font-semibold text-gray-300">
            {formatValue(indicator.benchmark, indicator.unit)}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isBelowBenchmark ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{
              width: `${Math.min(
                (indicator.value / indicator.benchmark) * 100,
                100
              )}%`
            }}
          />
        </div>
        {isBelowBenchmark && (
          <div className="flex items-center space-x-1 mt-2">
            <AlertCircle className="h-3 w-3 text-yellow-500" />
            <span className="text-xs text-yellow-500">
              Below industry average
            </span>
          </div>
        )}
      </div>

      {/* Prediction */}
      <div className="p-3 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Target className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-blue-300">Predicts:</p>
            <p className="text-xs text-blue-200 mt-1">{indicator.predicts}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== MAIN COMPONENT ====================

export const ToolOutcomesGrid: React.FC<ToolOutcomesGridProps> = ({
  indicators,
  isLoading = false,
  error = null
}) => {
  // ==================== LOADING STATE ====================

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className="bg-[#1f1f1f] border border-gray-800 rounded-lg p-6 animate-pulse"
          >
            <div className="h-24 bg-gray-800 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // ==================== ERROR STATE ====================

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div>
            <h3 className="text-sm font-semibold text-red-300">
              Error Loading Tool Outcomes
            </h3>
            <p className="text-xs text-red-200 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== EMPTY STATE ====================

  if (indicators.length === 0) {
    return (
      <div className="bg-[#1f1f1f] border border-gray-800 rounded-lg p-12 text-center">
        <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-300 mb-2">
          No Tool Outcomes Yet
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Start using Andru tools to track outcomes. Your leading indicators will
          appear here and predict financial results 4-8 weeks ahead.
        </p>
      </div>
    );
  }

  // ==================== RENDER ====================

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">
          Tool Outcome Indicators (Leading)
        </h2>
        <p className="text-sm text-gray-400">
          Observable in weeks 2-6 • Predict financial outcomes 4-8 weeks ahead
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {indicators.map((indicator, index) => (
          <IndicatorCard
            key={indicator.id}
            indicator={indicator}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

// ==================== DEFAULT INDICATORS (FOR REFERENCE) ====================

export const DEFAULT_INDICATORS: ToolOutcomeIndicator[] = [
  {
    id: 'low_fit_reduction',
    name: 'Low-Fit Deal Reduction',
    description: 'Low-ICP deals eliminated before wasting cycles',
    value: 28,
    unit: '%',
    benchmark: 15,
    previousValue: 15,
    historicalData: [8, 12, 15, 18, 22, 25, 28],
    predicts: '15-20% close rate boost in 8 weeks',
    icon: Target,
    color: 'text-purple-500'
  },
  {
    id: 'meeting_proposal_conversion',
    name: 'Meeting→Proposal Conversion',
    description: 'First meetings advancing to proposal stage',
    value: 45,
    unit: '%',
    benchmark: 30,
    previousValue: 30,
    historicalData: [25, 28, 30, 33, 37, 41, 45],
    predicts: '10-12 qualified opps in 4 weeks',
    icon: Users,
    color: 'text-blue-500'
  },
  {
    id: 'multi_stakeholder_engagement',
    name: 'Multi-Stakeholder Engagement',
    description: 'Avg stakeholders engaged per deal',
    value: 3.2,
    unit: 'number',
    benchmark: 2.0,
    previousValue: 2.0,
    historicalData: [1.5, 1.8, 2.0, 2.3, 2.7, 3.0, 3.2],
    predicts: '18-24 day cycle reduction in 6 weeks',
    icon: Users,
    color: 'text-green-500'
  },
  {
    id: 'deal_size_increase',
    name: 'Deal Size Increase',
    description: 'Avg deal size improvement vs baseline',
    value: 32,
    unit: '%',
    benchmark: 10,
    previousValue: 10,
    historicalData: [5, 8, 10, 15, 20, 26, 32],
    predicts: '$250K-$320K pipeline growth in 6 weeks',
    icon: DollarSign,
    color: 'text-emerald-500'
  },
  {
    id: 'deal_cycle_reduction',
    name: 'Deal Cycle Time Reduction',
    description: 'Sales cycle length decrease vs baseline',
    value: 22,
    unit: '%',
    benchmark: 8,
    previousValue: 8,
    historicalData: [3, 5, 8, 12, 15, 18, 22],
    predicts: 'Revenue velocity improvement in 6 weeks',
    icon: Clock,
    color: 'text-orange-500'
  },
  {
    id: 'executive_engagement_win_rate',
    name: 'Executive Engagement Win Rate',
    description: 'Close rate with executive-level engagement',
    value: 78,
    unit: '%',
    benchmark: 45,
    historicalData: [35, 42, 50, 58, 65, 71, 78],
    previousValue: 45,
    predicts: 'Close rate improvement in 8 weeks',
    icon: Award,
    color: 'text-yellow-500'
  },
  {
    id: 'customer_referral_rate',
    name: 'Customer Referral Rate',
    description: 'Customers providing qualified referrals',
    value: 18,
    unit: '%',
    benchmark: 5,
    previousValue: 5,
    historicalData: [2, 3, 5, 8, 11, 14, 18],
    predicts: 'Pipeline growth from warm intros in 4 weeks',
    icon: Share2,
    color: 'text-pink-500'
  }
];

export default ToolOutcomesGrid;
