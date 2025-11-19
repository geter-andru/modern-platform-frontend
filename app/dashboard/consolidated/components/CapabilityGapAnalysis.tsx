'use client';

import { motion } from 'framer-motion';
import { AlertCircle, TrendingUp, Target } from 'lucide-react';

interface CapabilityGap {
  capability: string;
  yourScore: number;
  benchmark: number;
  gap: number;
  status: 'critical' | 'warning' | 'good';
  revenueImpact: {
    metric: string;
    value: string;
    timeframe: string;
  };
  rootCause: string;
  actionSteps: string[];
  timeToClose: string;
  priority: number;
}

interface CapabilityGapAnalysisProps {
  customerId?: string;
  isLoading: boolean;
}

export function CapabilityGapAnalysis({ customerId, isLoading }: CapabilityGapAnalysisProps) {
  // TODO: Fetch from API
  const gaps: CapabilityGap[] = [
    {
      capability: 'Value Communication',
      yourScore: 52,
      benchmark: 65,
      gap: 13,
      status: 'critical',
      revenueImpact: {
        metric: '+$280K ARR',
        value: 'next quarter',
        timeframe: 'Q2 2025'
      },
      rootCause: 'CFO stakeholder mapping incomplete (40%)',
      actionSteps: [
        'Complete 3 CFO-facing business cases',
        'Build ROI calculator template',
        'Map economic buyer value drivers'
      ],
      timeToClose: '4-6 weeks',
      priority: 1
    },
    {
      capability: 'Sales Process',
      yourScore: 58,
      benchmark: 70,
      gap: 12,
      status: 'warning',
      revenueImpact: {
        metric: 'VP Sales ramp time',
        value: '-2 weeks',
        timeframe: 'Next hire'
      },
      rootCause: 'Playbook only 55% complete (6/11 stages)',
      actionSteps: [
        'Document demo → trial handoff process',
        'Create champion cultivation playbook',
        'Build CS handoff checklist'
      ],
      timeToClose: '3-4 weeks',
      priority: 2
    },
    {
      capability: 'Customer Intelligence',
      yourScore: 67,
      benchmark: 75,
      gap: 8,
      status: 'warning',
      revenueImpact: {
        metric: '+4% win rate',
        value: 'improvement',
        timeframe: 'Q2 2025'
      },
      rootCause: 'Discovery framework at 45% (inconsistent execution)',
      actionSteps: [
        'Standardize discovery question sets',
        'Train on SPIN methodology',
        'Build qualification scorecard'
      ],
      timeToClose: '2-3 weeks',
      priority: 3
    },
    {
      capability: 'Market Intelligence',
      yourScore: 71,
      benchmark: 72,
      gap: 1,
      status: 'good',
      revenueImpact: {
        metric: 'Minimal impact',
        value: 'maintain',
        timeframe: 'Current'
      },
      rootCause: 'Win/loss analysis at 60% (12/20 deals)',
      actionSteps: [
        'Complete remaining 8 deal post-mortems',
        'Extract objection patterns',
        'Update competitive battlecards'
      ],
      timeToClose: '1-2 weeks',
      priority: 4
    }
  ];

  const sortedGaps = [...gaps].sort((a, b) => a.priority - b.priority);

  const getStatusColor = (status: string) => {
    if (status === 'critical') return 'border-red-500/50 bg-red-500/10';
    if (status === 'warning') return 'border-yellow-500/50 bg-yellow-500/10';
    return 'border-green-500/50 bg-green-500/10';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'critical') return <AlertCircle className="w-5 h-5 text-red-400" />;
    if (status === 'warning') return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    return <TrendingUp className="w-5 h-5 text-green-400" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'critical') return <span className="px-2 py-1 rounded text-xs font-semibold bg-red-500/20 text-red-300">Critical Gap</span>;
    if (status === 'warning') return <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-300">Below Benchmark</span>;
    return <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-300">On Track</span>;
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 animate-pulse">
        <div className="h-96 bg-white/10 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Capability Gap Analysis</h2>
          <p className="text-sm text-white/60">Highest-ROI improvements prioritized by revenue impact</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-xs text-white/50 mb-1">Critical Gaps</div>
          <div className="text-2xl font-bold text-red-400">
            {gaps.filter(g => g.status === 'critical').length}
          </div>
          <div className="text-xs text-white/60 mt-1">Requires immediate attention</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-xs text-white/50 mb-1">Below Benchmark</div>
          <div className="text-2xl font-bold text-yellow-400">
            {gaps.filter(g => g.status === 'warning').length}
          </div>
          <div className="text-xs text-white/60 mt-1">Improvement opportunities</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-xs text-white/50 mb-1">Total Potential Impact</div>
          <div className="text-2xl font-bold text-green-400">
            $280K+
          </div>
          <div className="text-xs text-white/60 mt-1">ARR increase (Q2 2025)</div>
        </div>
      </div>

      {/* Gap Cards */}
      <div className="space-y-4">
        {sortedGaps.map((gap, index) => (
          <motion.div
            key={gap.capability}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`border rounded-lg p-5 ${getStatusColor(gap.status)}`}
          >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                {getStatusIcon(gap.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white">{gap.capability}</h3>
                    {getStatusBadge(gap.status)}
                  </div>
                  <div className="text-sm text-white/70">
                    Priority {gap.priority} • {gap.timeToClose} to close gap
                  </div>
                </div>
              </div>
            </div>

            {/* Score Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-white/50 mb-1">Your Score</div>
                <div className="text-2xl font-bold text-white">{gap.yourScore}%</div>
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Benchmark (Series A)</div>
                <div className="text-2xl font-bold text-yellow-400">{gap.benchmark}%</div>
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Gap to Close</div>
                <div className="text-2xl font-bold text-red-400">{gap.gap} points</div>
                <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                    style={{ width: `${(gap.gap / gap.benchmark) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Revenue Impact */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-white/70 uppercase tracking-wide">
                  Predicted Revenue Impact
                </span>
              </div>
              <div className="text-white">
                Closing this gap predicts:{' '}
                <span className="font-bold text-green-400">{gap.revenueImpact.metric}</span>
                {gap.revenueImpact.value && (
                  <>
                    {' '}({gap.revenueImpact.value})
                  </>
                )}
              </div>
              <div className="text-xs text-white/50 mt-1">Timeframe: {gap.revenueImpact.timeframe}</div>
            </div>

            {/* Root Cause */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-white/50 mb-2 uppercase tracking-wide">
                Root Cause Analysis
              </div>
              <div className="text-sm text-white/80 bg-white/5 rounded-lg p-3">
                {gap.rootCause}
              </div>
            </div>

            {/* Action Steps */}
            <div>
              <div className="text-xs font-semibold text-white/50 mb-2 uppercase tracking-wide">
                Recommended Actions
              </div>
              <div className="space-y-2">
                {gap.actionSteps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-start gap-2">
                    <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-blue-300">{stepIndex + 1}</span>
                    </div>
                    <div className="text-sm text-white/80">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-blue-300" />
          <div className="flex-1">
            <div className="text-white font-semibold">Focus on Value Communication</div>
            <div className="text-sm text-white/70">
              Highest revenue impact ($280K ARR) • Priority 1 • 4-6 weeks to close gap
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors">
            View Actions →
          </button>
        </div>
      </div>
    </div>
  );
}
