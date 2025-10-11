'use client';

/**
 * CompetencyScoreCards - Show 3 competency scores side-by-side
 *
 * Features:
 * - Customer Analysis, Value Communication, Sales Execution scores
 * - Baseline vs Current comparison
 * - Improvement percentages and trend indicators
 * - Professional competency development tracking
 * - Interactive gauge displays
 */

import React from 'react';
import { motion } from 'framer-motion';
import CircularProgressPremium, { CompetencyGrid } from '../ui/CircularProgressPremium';

export interface CompetencyScore {
  key: string;
  label: string;
  current: number;
  previous?: number;
  baseline?: number;
  target?: number;
  targetDate?: string;
  color?: string;
  description?: string;
}

interface CompetencyScoreCardsProps {
  competencies?: CompetencyScore[];
  customerId?: string;
  showBaseline?: boolean;
  showTargetDates?: boolean;
  onCompetencyClick?: (competencyKey: string) => void;
  size?: number;
  className?: string;
}

const CompetencyScoreCards: React.FC<CompetencyScoreCardsProps> = ({
  competencies,
  customerId,
  showBaseline = true,
  showTargetDates = true,
  onCompetencyClick,
  size = 100,
  className = ''
}) => {
  // Default competency data for testing
  const defaultCompetencies: CompetencyScore[] = [
    {
      key: 'customerAnalysis',
      label: 'Customer Analysis',
      current: 65,
      previous: 55,
      baseline: 45,
      target: 75,
      targetDate: '2025-11-01',
      color: 'blue',
      description: 'Systematic buyer targeting and ICP development'
    },
    {
      key: 'valueCommunication',
      label: 'Value Communication',
      current: 58,
      previous: 50,
      baseline: 40,
      target: 70,
      targetDate: '2025-11-15',
      color: 'green',
      description: 'Technical-to-business value translation'
    },
    {
      key: 'salesExecution',
      label: 'Sales Execution',
      current: 72,
      previous: 68,
      baseline: 55,
      target: 80,
      targetDate: '2025-12-01',
      color: 'purple',
      description: 'Revenue generation and deal closing'
    }
  ];

  const displayCompetencies = competencies || defaultCompetencies;

  // Calculate overall competency level
  const getCompetencyLevel = (): string => {
    const avgScore = displayCompetencies.reduce((sum, comp) => sum + comp.current, 0) / displayCompetencies.length;

    if (avgScore >= 80) return 'Advanced';
    if (avgScore >= 70) return 'Proficient';
    if (avgScore >= 55) return 'Developing';
    return 'Foundation';
  };

  // Calculate improvement statistics
  const calculateImprovement = (competency: CompetencyScore): { value: number; percentage: number } => {
    if (!showBaseline || !competency.baseline) {
      return { value: 0, percentage: 0 };
    }

    const improvement = competency.current - competency.baseline;
    const percentage = competency.baseline > 0 ? Math.round((improvement / competency.baseline) * 100) : 0;

    return { value: improvement, percentage };
  };

  // Find strongest and weakest competencies
  const getCompetencyBalance = () => {
    const strongest = displayCompetencies.reduce((max, comp) =>
      comp.current > max.current ? comp : max, displayCompetencies[0]
    );

    const weakest = displayCompetencies.reduce((min, comp) =>
      comp.current < min.current ? comp : min, displayCompetencies[0]
    );

    return { strongest, weakest };
  };

  const balance = getCompetencyBalance();
  const competencyLevel = getCompetencyLevel();

  return (
    <motion.div
      className={`bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-b border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Professional Competency Development
            </h3>
            <p className="text-sm text-gray-400">
              Assessment-driven development tracking ({competencyLevel} level)
            </p>
          </div>
        </div>
      </div>

      {/* Competency Grid - Uses CircularProgressPremium from Chunk 2.1 */}
      <div className="p-8">
        <CompetencyGrid
          competencies={displayCompetencies}
          size={size}
          showTargetDates={showTargetDates}
          className="mb-8"
        />

        {/* Baseline Comparison (if enabled) */}
        {showBaseline && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {displayCompetencies.map((competency) => {
              const improvement = calculateImprovement(competency);

              return (
                <motion.div
                  key={competency.key}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500/30 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onCompetencyClick && onCompetencyClick(competency.key)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">{competency.label}</h4>
                    <div className="text-xs text-gray-400">
                      Baseline: {competency.baseline || 0}%
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-400">
                        {competency.current}%
                      </div>
                      <div className="text-xs text-gray-500">Current Score</div>
                    </div>

                    {improvement.value > 0 && (
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-400">
                          +{improvement.value}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {improvement.percentage > 0 && `(+${improvement.percentage}%)`}
                        </div>
                      </div>
                    )}
                  </div>

                  {competency.description && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-400">{competency.description}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Professional Development Balance Indicator */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-xs text-gray-400 mb-3">Professional Development Balance</div>
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-gray-400">Strongest: </span>
              <span className="text-blue-300 font-medium">{balance.strongest.label}</span>
              <span className="text-blue-400 ml-2">({balance.strongest.current}%)</span>
            </div>
            <div className="text-gray-600">|</div>
            <div>
              <span className="text-gray-400">Focus Area: </span>
              <span className="text-amber-300 font-medium">{balance.weakest.label}</span>
              <span className="text-amber-400 ml-2">({balance.weakest.current}%)</span>
            </div>
          </div>
        </div>

        {/* Development Context */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Professional development tracking and tool access management</span>
            <span>Target: 70+ for advanced tool unlock</span>
          </div>
        </div>

        {/* Professional Tips */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            Click on competency cards for detailed development insights and activity tracking
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CompetencyScoreCards;
