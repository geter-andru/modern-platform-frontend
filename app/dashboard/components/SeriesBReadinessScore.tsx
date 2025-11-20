'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp } from 'lucide-react';

interface SeriesBReadinessScoreProps {
  customerId?: string;
  isLoading: boolean;
}

export function SeriesBReadinessScore({ customerId, isLoading }: SeriesBReadinessScoreProps) {
  // TODO: Calculate from real business metrics
  const readinessData = {
    overallScore: 52,
    targetScore: 85,
    components: {
      arrProgress: { score: 32, weight: 40 },
      winRate: { score: 55, weight: 25 },
      dealSize: { score: 75, weight: 20 },
      pipeline: { score: 40, weight: 15 }
    },
    monthsToGoal: 8,
    monthlyGrowthRate: 6
  };

  const gapToTarget = readinessData.targetScore - readinessData.overallScore;
  const progressPercentage = (readinessData.overallScore / readinessData.targetScore) * 100;

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 animate-pulse">
        <div className="h-32 bg-white/10 rounded"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6"
    >
      <div className="flex items-start justify-between">
        {/* Left Side: Score Display */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Series B Readiness Score</h2>
              <p className="text-sm text-white/60">Fundraising preparedness tracker</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold text-white">
                {readinessData.overallScore}%
              </span>
              <span className="text-lg text-white/60">
                / {readinessData.targetScore}% target
              </span>
            </div>

            <div className="w-full bg-white/10 rounded-full h-4 mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">
                Gap: +{gapToTarget}% needed
              </span>
              <span className="text-green-400 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +{readinessData.monthlyGrowthRate}%/month
              </span>
            </div>
          </div>

          {/* Timeline Estimate */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="text-sm text-white/70 mb-1">
              Estimated Time to Target
            </div>
            <div className="text-2xl font-bold text-white">
              {readinessData.monthsToGoal} months
            </div>
            <div className="text-xs text-white/50 mt-1">
              At current growth rate (~July 2025)
            </div>
          </div>
        </div>

        {/* Right Side: Component Breakdown */}
        <div className="w-80 ml-6">
          <div className="text-sm font-medium text-white/70 mb-3">Score Breakdown</div>

          <div className="space-y-3">
            {/* ARR Progress */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">ARR Progress</span>
                <span className="text-sm font-medium text-white">
                  {readinessData.components.arrProgress.score}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/10 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: `${readinessData.components.arrProgress.score}%` }}
                  />
                </div>
                <span className="text-xs text-white/50">
                  {readinessData.components.arrProgress.weight}% weight
                </span>
              </div>
            </div>

            {/* Win Rate */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">Win Rate</span>
                <span className="text-sm font-medium text-white">
                  {readinessData.components.winRate.score}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/10 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{ width: `${readinessData.components.winRate.score}%` }}
                  />
                </div>
                <span className="text-xs text-white/50">
                  {readinessData.components.winRate.weight}% weight
                </span>
              </div>
            </div>

            {/* Avg Deal Size */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">Avg Deal Size</span>
                <span className="text-sm font-medium text-white">
                  {readinessData.components.dealSize.score}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/10 rounded-full h-1.5">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full"
                    style={{ width: `${readinessData.components.dealSize.score}%` }}
                  />
                </div>
                <span className="text-xs text-white/50">
                  {readinessData.components.dealSize.weight}% weight
                </span>
              </div>
            </div>

            {/* Pipeline */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">Qualified Pipeline</span>
                <span className="text-sm font-medium text-white">
                  {readinessData.components.pipeline.score}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/10 rounded-full h-1.5">
                  <div
                    className="bg-orange-500 h-1.5 rounded-full"
                    style={{ width: `${readinessData.components.pipeline.score}%` }}
                  />
                </div>
                <span className="text-xs text-white/50">
                  {readinessData.components.pipeline.weight}% weight
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
