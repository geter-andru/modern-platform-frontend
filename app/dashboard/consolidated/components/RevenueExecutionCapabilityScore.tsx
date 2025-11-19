'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight, Target } from 'lucide-react';

interface Capability {
  name: string;
  score: number;
  previousScore: number;
  monthOverMonthChange: number;
  trend: 'up' | 'down' | 'flat';
  color: string;
  behaviors: {
    name: string;
    value: string;
    status?: 'good' | 'warning' | 'needs-improvement';
  }[];
}

interface PredictedOutcome {
  metric: string;
  range?: [number, number];
  value?: number;
  change?: number;
  unit: string;
  timeframe: string;
}

interface RevenueExecutionCapabilityScoreProps {
  customerId?: string;
  isLoading: boolean;
}

export function RevenueExecutionCapabilityScore({ customerId, isLoading }: RevenueExecutionCapabilityScoreProps) {
  // TODO: Fetch from API
  const overallScore = 62;

  const capabilities: Capability[] = [
    {
      name: 'Customer Intelligence',
      score: 67,
      previousScore: 59,
      monthOverMonthChange: 8,
      trend: 'up',
      color: 'from-blue-500 to-blue-600',
      behaviors: [
        { name: 'ICP Definition', value: '85%', status: 'good' },
        { name: 'Buyer Personas', value: '4 personas, monthly refresh', status: 'good' },
        { name: 'Discovery Framework', value: '45%', status: 'needs-improvement' },
        { name: 'Interview Cadence', value: '3/week (above benchmark)', status: 'good' }
      ]
    },
    {
      name: 'Value Communication',
      score: 52,
      previousScore: 47,
      monthOverMonthChange: 5,
      trend: 'up',
      color: 'from-purple-500 to-purple-600',
      behaviors: [
        { name: 'Business Cases', value: '8 created, 75% accuracy', status: 'good' },
        { name: 'ROI Quantification', value: '65%', status: 'warning' },
        { name: 'Stakeholder Mapping', value: '40% (CFO blind spot)', status: 'needs-improvement' },
        { name: 'Technical Translation', value: '78%', status: 'good' }
      ]
    },
    {
      name: 'Sales Process',
      score: 58,
      previousScore: 46,
      monthOverMonthChange: 12,
      trend: 'up',
      color: 'from-green-500 to-green-600',
      behaviors: [
        { name: 'Qualification Framework', value: '80% (MEDDIC)', status: 'good' },
        { name: 'Playbook Completeness', value: '6/11 stages documented', status: 'warning' },
        { name: 'Handoff Quality', value: '45% (CS gaps)', status: 'needs-improvement' },
        { name: 'Artifact Library', value: '12/38 resources', status: 'warning' }
      ]
    },
    {
      name: 'Market Intelligence',
      score: 71,
      previousScore: 68,
      monthOverMonthChange: 3,
      trend: 'up',
      color: 'from-orange-500 to-orange-600',
      behaviors: [
        { name: 'Competitive Intel', value: '5 competitors mapped', status: 'good' },
        { name: 'Win/Loss Analysis', value: '12/20 deals analyzed', status: 'warning' },
        { name: 'Objection Library', value: '24 responses documented', status: 'good' },
        { name: 'Market Research', value: 'Monthly analyst reports', status: 'good' }
      ]
    }
  ];

  const predictedOutcomes: PredictedOutcome[] = [
    { metric: 'Win Rate', range: [28, 32], unit: '%', timeframe: 'Q2 2025' },
    { metric: 'Avg Deal Size', value: 85000, change: 12, unit: '$', timeframe: 'Q2 2025' },
    { metric: 'Sales Cycle', value: 4.2, change: -0.8, unit: 'months', timeframe: 'Q2 2025' },
    { metric: 'Retention', value: 89, unit: '%', timeframe: 'Q2 2025' }
  ];

  const getCircleProgress = (percentage: number) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return { circumference, offset };
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3" />;
    return <ArrowRight className="w-3 h-3" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-yellow-400';
  };

  const getBehaviorColor = (status?: string) => {
    if (status === 'good') return 'text-green-400';
    if (status === 'warning') return 'text-yellow-400';
    if (status === 'needs-improvement') return 'text-orange-400';
    return 'text-white/70';
  };

  const formatOutcomeValue = (outcome: PredictedOutcome) => {
    if (outcome.range) {
      return `${outcome.range[0]}-${outcome.range[1]}${outcome.unit}`;
    }
    if (outcome.unit === '$') {
      return `$${(outcome.value! / 1000).toFixed(0)}K`;
    }
    return `${outcome.value}${outcome.unit}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 animate-pulse">
        <div className="h-96 bg-white/10 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur-xl border border-white/20 rounded-xl p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Revenue Execution Capability</h2>
          <p className="text-sm text-white/70">Systematic behaviors that predict financial outcomes</p>
        </div>
      </div>

      {/* Overall Score */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-5xl font-bold text-white">{overallScore}%</span>
          <span className="text-lg text-white/60">Overall Capability</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallScore}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </motion.div>
        </div>
      </div>

      {/* Predicted Outcomes Panel */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
        <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wide">
          Capability → Predicted Outcomes
        </h3>
        <div className="text-white/90 mb-4">
          <span className="font-bold">{overallScore}% execution capability</span> predicts:
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {predictedOutcomes.map((outcome, index) => (
            <motion.div
              key={outcome.metric}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-3"
            >
              <div className="text-xs text-white/50 mb-1">{outcome.metric}</div>
              <div className="text-lg font-bold text-white">{formatOutcomeValue(outcome)}</div>
              {outcome.change && (
                <div className={`text-xs flex items-center gap-1 ${outcome.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {outcome.change > 0 ? '↑' : '↓'} {Math.abs(outcome.change)}%
                </div>
              )}
              <div className="text-xs text-white/40 mt-1">{outcome.timeframe}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Component Breakdown */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wide">
          Component Breakdown
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {capabilities.map((capability, index) => {
            const { circumference, offset } = getCircleProgress(capability.score);

            return (
              <motion.div
                key={capability.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
              >
                {/* Capability Name */}
                <div className="text-sm font-medium text-white/80 mb-3">
                  {capability.name}
                </div>

                {/* Circular Gauge */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="transform -rotate-90 w-20 h-20">
                      {/* Background circle */}
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-white/10"
                      />
                      {/* Progress circle */}
                      <motion.circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="url(#gradient-capability-${index})"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                        style={{
                          strokeDasharray: circumference,
                        }}
                      />
                      <defs>
                        <linearGradient id={`gradient-capability-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={`rgb(${index === 0 ? '59, 130, 246' : index === 1 ? '168, 85, 247' : index === 2 ? '34, 197, 94' : '249, 115, 22'})`} />
                          <stop offset="100%" stopColor={`rgb(${index === 0 ? '37, 99, 235' : index === 1 ? '147, 51, 234' : index === 2 ? '22, 163, 74' : '234, 88, 12'})`} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{capability.score}%</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(capability.trend)}`}>
                      {getTrendIcon(capability.trend)}
                      +{capability.monthOverMonthChange}% MoM
                    </div>
                  </div>
                </div>

                {/* Behaviors (collapsed by default, can expand in future) */}
                <div className="text-xs text-white/50 pt-3 border-t border-white/10">
                  {capability.behaviors.length} behaviors tracked
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Fastest Impact Action */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-purple-300 uppercase tracking-wide">
            Fastest Impact Action
          </span>
        </div>
        <div className="text-white font-medium">
          Improve Value Communication to 65% (+13%)
        </div>
        <div className="text-sm text-white/70 mt-1">
          → Predicted impact: +6% win rate in next quarter
        </div>
      </div>
    </div>
  );
}
