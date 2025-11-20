'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface BusinessMilestone {
  name: string;
  current: number;
  target: number;
  unit: 'dollars' | 'percentage' | 'count';
  percentageToGoal: number;
  monthOverMonthChange: number;
  trend: 'up' | 'down' | 'flat';
  nextAction: string;
  impactOnSeriesB: string;
}

interface BusinessMilestonesCardProps {
  customerId?: string;
  isLoading: boolean;
}

export function BusinessMilestonesCard({ customerId, isLoading }: BusinessMilestonesCardProps) {
  // TODO: Fetch real data from API
  // For now, using mock data structure
  const milestones: BusinessMilestone[] = [
    {
      name: 'ARR Progress',
      current: 3200000,
      target: 10000000,
      unit: 'dollars',
      percentageToGoal: 32,
      monthOverMonthChange: 18,
      trend: 'up',
      nextAction: 'Close $200K Acme deal',
      impactOnSeriesB: 'Need $10M ARR to raise Series B'
    },
    {
      name: 'Win Rate',
      current: 22,
      target: 40,
      unit: 'percentage',
      percentageToGoal: 55,
      monthOverMonthChange: 7,
      trend: 'up',
      nextAction: 'Win Acme Corp (Q1)',
      impactOnSeriesB: 'VCs want 35-40% win rate'
    },
    {
      name: 'Avg Deal Size',
      current: 75000,
      target: 100000,
      unit: 'dollars',
      percentageToGoal: 75,
      monthOverMonthChange: 12,
      trend: 'up',
      nextAction: 'Upsell Beta to $150K',
      impactOnSeriesB: 'Larger deals = faster ARR growth'
    },
    {
      name: 'Qualified Pipeline',
      current: 1200000,
      target: 3000000,
      unit: 'dollars',
      percentageToGoal: 40,
      monthOverMonthChange: 15,
      trend: 'up',
      nextAction: 'Add 3 ops this week',
      impactOnSeriesB: 'Need 3x ARR in pipeline'
    }
  ];

  const formatValue = (value: number, unit: string) => {
    if (unit === 'dollars') {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
      return `$${value}`;
    }
    if (unit === 'percentage') return `${value}%`;
    return value.toString();
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-yellow-400';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <ArrowRight className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
        <div className="h-6 bg-white/20 rounded mb-4 animate-pulse w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-white/10 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Current Performance (Trailing Results)</h2>
            <p className="text-sm text-white/60">Financial outcomes driven by capability development</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2">
          <span className="text-yellow-400">⚠️</span>
          <p className="text-sm text-yellow-200/90">
            These are outcomes of your execution capability - Focus on capability development, outcomes follow
          </p>
        </div>
      </div>

      {/* Milestone Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            {/* Milestone Name */}
            <div className="text-sm font-medium text-white/70 mb-3">
              {milestone.name}
            </div>

            {/* Current Value (Large) */}
            <div className="text-3xl font-bold text-white mb-1">
              {formatValue(milestone.current, milestone.unit)}
            </div>

            {/* Target + Progress */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-sm text-white/50">Target:</span>
              <span className="text-sm font-medium text-white/70">
                {formatValue(milestone.target, milestone.unit)}
              </span>
              <span className="text-xs text-blue-400 font-medium">
                ({milestone.percentageToGoal}%)
              </span>
            </div>

            {/* Month-over-Month Change */}
            <div className={`flex items-center gap-1 mb-4 ${getTrendColor(milestone.trend)}`}>
              {getTrendIcon(milestone.trend)}
              <span className="text-sm font-medium">
                {milestone.monthOverMonthChange > 0 ? '+' : ''}{milestone.monthOverMonthChange}% MoM
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${milestone.percentageToGoal}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                />
              </div>
              <div className="text-xs text-white/50 mt-1">
                {milestone.percentageToGoal}% to Series B goal
              </div>
            </div>

            {/* Capability Validation */}
            <div className="border-t border-white/10 pt-3">
              <div className="text-xs text-blue-300/70 mb-1">
                {milestone.name === 'ARR Progress' && '← Driven by 67% Customer Intelligence'}
                {milestone.name === 'Win Rate' && '← Tracking toward 28-32% (67% Customer Intel predicts)'}
                {milestone.name === 'Avg Deal Size' && '← Result of 52% Value Communication capability'}
                {milestone.name === 'Qualified Pipeline' && '← Generated by 58% Sales Process systematization'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
