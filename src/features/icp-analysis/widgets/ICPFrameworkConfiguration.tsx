'use client';

import React, { useState } from 'react';
import { Target, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface ICPFrameworkConfigurationProps {
  className?: string;
}

interface WeightCategory {
  id: string;
  label: string;
  description: string;
  defaultWeight: number;
}

const WEIGHT_CATEGORIES: WeightCategory[] = [
  {
    id: 'company-size',
    label: 'Company Size',
    description: 'Employee count and revenue indicators',
    defaultWeight: 25
  },
  {
    id: 'technical-maturity',
    label: 'Technical Maturity',
    description: 'Technology stack and adoption readiness',
    defaultWeight: 30
  },
  {
    id: 'growth-stage',
    label: 'Growth Stage',
    description: 'Company trajectory and funding status',
    defaultWeight: 20
  },
  {
    id: 'pain-point-severity',
    label: 'Pain Point Severity',
    description: 'Problem urgency and budget availability',
    defaultWeight: 25
  }
];

export default function ICPFrameworkConfiguration({ className = '' }: ICPFrameworkConfigurationProps) {
  const [weights, setWeights] = useState<Record<string, number>>(
    WEIGHT_CATEGORIES.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: cat.defaultWeight
    }), {})
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const isValidDistribution = totalWeight === 100;

  const handleWeightChange = (categoryId: string, newWeight: number) => {
    setWeights(prev => ({
      ...prev,
      [categoryId]: newWeight
    }));
  };

  return (
    <div className={`bg-[#1a2332] border border-blue-800/30 rounded-xl p-8 shadow-lg shadow-blue-500/10 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">ICP Framework Configuration</h2>
            <p className="text-gray-400 text-sm mt-1">Define scoring criteria weights for buyer evaluation</p>
          </div>
        </div>
      </div>

      {/* Total Weight Distribution */}
      <div className="mb-6 p-4 bg-black/30 rounded-lg border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Total Weight Distribution</span>
          <span className={`text-lg font-bold ${isValidDistribution ? 'text-green-400' : 'text-red-400'}`}>
            {totalWeight}%
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isValidDistribution ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(totalWeight, 100)}%` }}
          ></div>
        </div>
        {!isValidDistribution && (
          <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Weights must total exactly 100%
          </p>
        )}
      </div>

      {/* Weight Sliders */}
      <div className="space-y-6">
        {WEIGHT_CATEGORIES.map((category) => {
          const weight = weights[category.id];

          return (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-white">
                    {category.label}
                  </label>
                  <p className="text-xs text-gray-400 mt-0.5">{category.description}</p>
                </div>
                <span className="text-xl font-bold text-blue-400 min-w-[60px] text-right">
                  {weight}%
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={weight}
                  onChange={(e) => handleWeightChange(category.id, parseInt(e.target.value))}
                  className="flex-1 h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-blue-500
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:shadow-blue-500/50
                    [&::-moz-range-thumb]:appearance-none
                    [&::-moz-range-thumb]:w-5
                    [&::-moz-range-thumb]:h-5
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-blue-500
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:shadow-lg"
                />
              </div>

              {/* Visual progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-2.5 border border-gray-700">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${weight}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Implementation Tips */}
      <div className="mt-8 p-6 bg-black/30 rounded-lg border border-white/5">
        <h3 className="text-lg font-semibold text-white mb-4">Implementation Tips</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm text-gray-300">
              Start with customer interviews to validate assumptions
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm text-gray-300">
              Review quarterly and adjust based on win/loss analysis
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm text-gray-300">
              Share framework with sales and marketing teams
            </span>
          </li>
        </ul>
      </div>

      {/* Active Scoring Criteria Summary */}
      <div className="mt-6 p-6 bg-blue-900/20 rounded-lg border border-blue-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Active Scoring Criteria</h3>
        <div className="grid grid-cols-2 gap-4">
          {WEIGHT_CATEGORIES.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{category.label}:</span>
              <span className="text-base font-bold text-blue-400">{weights[category.id]}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced View Toggle */}
      <div className="mt-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          {showAdvanced ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide Advanced Scoring Details
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show Advanced Scoring Details
            </>
          )}
        </button>

        {showAdvanced && (
          <div className="mt-4 p-6 bg-black/30 rounded-lg border border-white/5 space-y-4">
            <h4 className="text-md font-semibold text-white mb-3">Detailed Scoring Breakdown</h4>

            {/* Company Size Details */}
            <div className="space-y-2">
              <h5 className="text-sm font-semibold text-blue-400">Company Size (25%)</h5>
              <ul className="text-xs text-gray-400 space-y-1 ml-4">
                <li>• 10-50 employees: Startup tier</li>
                <li>• 51-200 employees: Growth tier</li>
                <li>• 201-1000 employees: Mid-market tier</li>
                <li>• 1000+ employees: Enterprise tier</li>
              </ul>
            </div>

            {/* Technical Maturity Details */}
            <div className="space-y-2">
              <h5 className="text-sm font-semibold text-blue-400">Technical Maturity (30%)</h5>
              <ul className="text-xs text-gray-400 space-y-1 ml-4">
                <li>• Basic: Manual processes, limited tooling</li>
                <li>• Intermediate: Some automation, standard tools</li>
                <li>• Advanced: Full automation, modern stack</li>
                <li>• Expert: Cutting-edge tech, innovation leaders</li>
              </ul>
            </div>

            {/* Growth Stage Details */}
            <div className="space-y-2">
              <h5 className="text-sm font-semibold text-blue-400">Growth Stage (20%)</h5>
              <ul className="text-xs text-gray-400 space-y-1 ml-4">
                <li>• Seed: Pre-product or early validation</li>
                <li>• Series A: Product-market fit achieved</li>
                <li>• Series B+: Scaling operations</li>
                <li>• Mature: Established market position</li>
              </ul>
            </div>

            {/* Pain Point Severity Details */}
            <div className="space-y-2">
              <h5 className="text-sm font-semibold text-blue-400">Pain Point Severity (25%)</h5>
              <ul className="text-xs text-gray-400 space-y-1 ml-4">
                <li>• Critical: Immediate business impact, urgent need</li>
                <li>• High: Significant pain, budget allocated</li>
                <li>• Medium: Known issue, evaluating solutions</li>
                <li>• Low: Nice-to-have, no immediate plans</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
