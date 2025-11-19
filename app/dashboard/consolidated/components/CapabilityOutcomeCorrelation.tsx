'use client';

import { motion } from 'framer-motion';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { useState } from 'react';

interface CorrelationData {
  capability: string;
  outcome: string;
  yourScore: number;
  yourOutcome: number;
  predictedOutcome: number;
  benchmark: {
    score: number;
    outcome: number;
  };
  historicalData: {
    capabilityScore: number;
    avgOutcome: number;
  }[];
  correlation: number;
  sampleSize: number;
}

interface CapabilityOutcomeCorrelationProps {
  customerId?: string;
  isLoading: boolean;
}

export function CapabilityOutcomeCorrelation({ customerId, isLoading }: CapabilityOutcomeCorrelationProps) {
  const [selectedCorrelation, setSelectedCorrelation] = useState(0);

  // TODO: Fetch from API
  const correlations: CorrelationData[] = [
    {
      capability: 'Customer Intelligence',
      outcome: 'Win Rate',
      yourScore: 67,
      yourOutcome: 22,
      predictedOutcome: 31,
      benchmark: { score: 65, outcome: 29 },
      historicalData: [
        { capabilityScore: 45, avgOutcome: 18 },
        { capabilityScore: 55, avgOutcome: 24 },
        { capabilityScore: 65, avgOutcome: 29 },
        { capabilityScore: 75, avgOutcome: 35 },
        { capabilityScore: 85, avgOutcome: 42 }
      ],
      correlation: 0.78,
      sampleSize: 247
    },
    {
      capability: 'Value Communication',
      outcome: 'Avg Deal Size',
      yourScore: 52,
      yourOutcome: 75,
      predictedOutcome: 68,
      benchmark: { score: 65, outcome: 95 },
      historicalData: [
        { capabilityScore: 40, avgOutcome: 55 },
        { capabilityScore: 50, avgOutcome: 68 },
        { capabilityScore: 60, avgOutcome: 85 },
        { capabilityScore: 70, avgOutcome: 105 },
        { capabilityScore: 80, avgOutcome: 125 }
      ],
      correlation: 0.82,
      sampleSize: 198
    },
    {
      capability: 'Sales Process',
      outcome: 'Sales Cycle',
      yourScore: 58,
      yourOutcome: 5.2,
      predictedOutcome: 4.8,
      benchmark: { score: 65, outcome: 4.2 },
      historicalData: [
        { capabilityScore: 40, avgOutcome: 7.2 },
        { capabilityScore: 50, avgOutcome: 6.1 },
        { capabilityScore: 60, avgOutcome: 4.8 },
        { capabilityScore: 70, avgOutcome: 3.9 },
        { capabilityScore: 80, avgOutcome: 3.2 }
      ],
      correlation: -0.75, // Negative correlation (higher capability = shorter cycle)
      sampleSize: 183
    }
  ];

  const current = correlations[selectedCorrelation];

  const formatOutcome = (value: number, outcome: string) => {
    if (outcome === 'Win Rate') return `${value}%`;
    if (outcome === 'Avg Deal Size') return `$${value}K`;
    if (outcome === 'Sales Cycle') return `${value} mo`;
    return value.toString();
  };

  const getCorrelationStrength = (r: number) => {
    const abs = Math.abs(r);
    if (abs >= 0.7) return 'Strong';
    if (abs >= 0.5) return 'Moderate';
    return 'Weak';
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 animate-pulse">
        <div className="h-80 bg-white/10 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Capability → Outcome Correlation</h2>
            <p className="text-sm text-white/60">Historical data proves systematic capability predicts performance</p>
          </div>
        </div>
      </div>

      {/* Correlation Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {correlations.map((corr, index) => (
          <button
            key={index}
            onClick={() => setSelectedCorrelation(index)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200
              ${selectedCorrelation === index
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
              }
            `}
          >
            {corr.capability} → {corr.outcome}
          </button>
        ))}
      </div>

      {/* Correlation Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Chart Visualization */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wide">
            Historical Correlation Analysis
          </h3>

          {/* Simplified Scatter Plot */}
          <div className="relative h-64 mb-4">
            {/* Y-axis label */}
            <div className="absolute -left-2 top-0 bottom-0 flex items-center">
              <div className="text-xs text-white/50 -rotate-90 whitespace-nowrap">
                {current.outcome}
              </div>
            </div>

            {/* Chart Area */}
            <div className="ml-6 mr-2 h-full border-l border-b border-white/20 relative">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <div
                  key={y}
                  className="absolute w-full border-t border-white/5"
                  style={{ bottom: `${y}%` }}
                >
                  <span className="absolute -left-6 -top-2 text-xs text-white/40">
                    {current.outcome === 'Sales Cycle'
                      ? (7.2 - (y / 100) * 4).toFixed(1)
                      : Math.round((y / 100) * (current.historicalData[current.historicalData.length - 1].avgOutcome))
                    }
                  </span>
                </div>
              ))}

              {/* Historical data points */}
              {current.historicalData.map((point, index) => {
                const x = (point.capabilityScore / 100) * 100;
                const maxOutcome = Math.max(...current.historicalData.map(d => d.avgOutcome));
                const minOutcome = Math.min(...current.historicalData.map(d => d.avgOutcome));
                const y = current.outcome === 'Sales Cycle'
                  ? ((7.2 - point.avgOutcome) / 4) * 100
                  : ((point.avgOutcome - minOutcome) / (maxOutcome - minOutcome)) * 100;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="absolute w-2 h-2 rounded-full bg-blue-400"
                    style={{
                      left: `${x}%`,
                      bottom: `${y}%`,
                      transform: 'translate(-50%, 50%)'
                    }}
                  />
                );
              })}

              {/* Your current position */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute"
                style={{
                  left: `${current.yourScore}%`,
                  bottom: current.outcome === 'Sales Cycle'
                    ? `${((7.2 - current.yourOutcome) / 4) * 100}%`
                    : `${((current.yourOutcome - Math.min(...current.historicalData.map(d => d.avgOutcome))) / (Math.max(...current.historicalData.map(d => d.avgOutcome)) - Math.min(...current.historicalData.map(d => d.avgOutcome)))) * 100}%`,
                  transform: 'translate(-50%, 50%)'
                }}
              >
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white animate-pulse" />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-green-400">
                    You
                  </div>
                </div>
              </motion.div>

              {/* Predicted position */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute"
                style={{
                  left: `${current.yourScore}%`,
                  bottom: current.outcome === 'Sales Cycle'
                    ? `${((7.2 - current.predictedOutcome) / 4) * 100}%`
                    : `${((current.predictedOutcome - Math.min(...current.historicalData.map(d => d.avgOutcome))) / (Math.max(...current.historicalData.map(d => d.avgOutcome)) - Math.min(...current.historicalData.map(d => d.avgOutcome)))) * 100}%`,
                  transform: 'translate(-50%, 50%)'
                }}
              >
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white border-dashed" />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-purple-400">
                    Q2
                  </div>
                </div>
              </motion.div>

              {/* Benchmark position */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute"
                style={{
                  left: `${current.benchmark.score}%`,
                  bottom: current.outcome === 'Sales Cycle'
                    ? `${((7.2 - current.benchmark.outcome) / 4) * 100}%`
                    : `${((current.benchmark.outcome - Math.min(...current.historicalData.map(d => d.avgOutcome))) / (Math.max(...current.historicalData.map(d => d.avgOutcome)) - Math.min(...current.historicalData.map(d => d.avgOutcome)))) * 100}%`,
                  transform: 'translate(-50%, 50%)'
                }}
              >
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-white" />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-yellow-400">
                    Benchmark
                  </div>
                </div>
              </motion.div>
            </div>

            {/* X-axis label */}
            <div className="ml-6 mt-2 text-center text-xs text-white/50">
              {current.capability} Capability (%)
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-600" />
              <span className="text-white/70">Your Position</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border border-dashed" />
              <span className="text-white/70">Predicted Q2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="text-white/70">Series A Avg</span>
            </div>
          </div>
        </div>

        {/* Right: Statistical Summary */}
        <div className="space-y-4">
          {/* Current Position */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wide">
              Your Current Position
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-white/70">{current.capability}:</span>
                <span className="text-sm font-bold text-white">{current.yourScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/70">Current {current.outcome}:</span>
                <span className="text-sm font-bold text-white">{formatOutcome(current.yourOutcome, current.outcome)}</span>
              </div>
            </div>
          </div>

          {/* Benchmark Comparison */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wide">
              Benchmark Comparison
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-white/70">Series A Average:</span>
                <span className="text-sm font-medium text-yellow-400">{current.benchmark.score}% capability</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/70">Their {current.outcome}:</span>
                <span className="text-sm font-medium text-yellow-400">{formatOutcome(current.benchmark.outcome, current.outcome)}</span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">
                    {current.yourScore > current.benchmark.score ? 'Above' : 'Below'} benchmark by {Math.abs(current.yourScore - current.benchmark.score)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Prediction */}
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-purple-300 mb-3 uppercase tracking-wide">
              Predicted Q2 2025 Outcome
            </h4>
            <div className="text-2xl font-bold text-white mb-2">
              {formatOutcome(current.predictedOutcome, current.outcome)}
            </div>
            <div className="text-sm text-white/70 mb-3">
              Based on your {current.yourScore}% {current.capability} capability
            </div>
            <div className="text-xs text-white/60 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span>Correlation Strength:</span>
                <span className="font-semibold text-purple-300">
                  {getCorrelationStrength(current.correlation)} (r={current.correlation.toFixed(2)})
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span>Sample Size:</span>
                <span className="font-semibold text-purple-300">{current.sampleSize} founders</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="text-sm text-white/90">
          <span className="font-bold">Historical Analysis:</span> Founders with {current.yourScore}% {current.capability} capability
          average {formatOutcome(current.predictedOutcome, current.outcome)} in {current.outcome.toLowerCase()} within 6 months.
          Your current trajectory aligns with this pattern.
        </div>
      </div>
    </div>
  );
}
