'use client';

/**
 * PredictionTracker - Financial Predictions Display
 *
 * Displays financial outcome predictions (lagging indicators) that were
 * generated from tool outcomes 4-8 weeks ago. Shows:
 * - Active predictions (not yet validated)
 * - Validated predictions with accuracy scores
 * - Overall prediction accuracy across all validations
 *
 * Part of Dashboard-v3 "GPS for Revenue" system
 * Builds trust by showing "We predicted X, you achieved Y (95% accurate)"
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Award
} from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================

export interface Prediction {
  id: string;
  type: 'close_rate' | 'revenue_growth' | 'pipeline_value' | 'new_opportunities' | 'cycle_reduction';
  description: string;
  predictedValue: number;
  predictedValueUnit: string;
  confidencePercentage: number;
  predictionTargetDate: string; // ISO date string
  weeksAhead: number;
  createdAt: string; // ISO date string

  // Validation fields (null if not yet validated)
  isValidated: boolean;
  actualValue?: number;
  accuracyPercentage?: number;
}

export interface PredictionTrackerProps {
  predictions: Prediction[];
  isLoading?: boolean;
  error?: string | null;
}

// ==================== HELPER FUNCTIONS ====================

const getPredictionTypeLabel = (
  type: Prediction['type']
): string => {
  const labels = {
    close_rate: 'Close Rate Improvement',
    revenue_growth: 'Revenue Growth',
    pipeline_value: 'Pipeline Value Growth',
    new_opportunities: 'New Opportunities',
    cycle_reduction: 'Cycle Time Reduction'
  };
  return labels[type];
};

const getPredictionTypeColor = (
  type: Prediction['type']
): string => {
  const colors = {
    close_rate: 'text-purple-400',
    revenue_growth: 'text-green-400',
    pipeline_value: 'text-blue-400',
    new_opportunities: 'text-emerald-400',
    cycle_reduction: 'text-orange-400'
  };
  return colors[type];
};

const getAccuracyColor = (accuracy: number): string => {
  if (accuracy >= 90) return 'text-green-500';
  if (accuracy >= 75) return 'text-yellow-500';
  return 'text-red-500';
};

const getAccuracyLabel = (accuracy: number): string => {
  if (accuracy >= 90) return 'Excellent';
  if (accuracy >= 75) return 'Good';
  if (accuracy >= 60) return 'Fair';
  return 'Needs Improvement';
};

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getWeeksUntilTarget = (targetDate: string): number => {
  const target = new Date(targetDate);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  const diffWeeks = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7));
  return Math.max(0, diffWeeks);
};

const formatValue = (value: number, unit: string): string => {
  if (unit === '%') return `${value.toFixed(1)}%`;
  if (unit === '$') return `$${value.toLocaleString()}`;
  if (unit === 'number') return Math.round(value).toString();
  if (unit === 'days') return `${Math.round(value)} days`;
  return `${value}`;
};

// ==================== VALIDATED PREDICTION CARD ====================

interface ValidatedPredictionCardProps {
  prediction: Prediction;
  index: number;
}

const ValidatedPredictionCard: React.FC<ValidatedPredictionCardProps> = ({
  prediction,
  index
}) => {
  const typeColor = getPredictionTypeColor(prediction.type);
  const accuracyColor = getAccuracyColor(prediction.accuracyPercentage || 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#1f1f1f] border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className={`text-sm font-semibold ${typeColor}`}>
            {getPredictionTypeLabel(prediction.type)}
          </span>
        </div>
        <div className={`text-xs font-bold ${accuracyColor}`}>
          {prediction.accuracyPercentage?.toFixed(0)}% accurate
        </div>
      </div>

      {/* Prediction */}
      <div className="mb-3">
        <p className="text-sm text-gray-300 mb-2">
          &ldquo;{prediction.description}&rdquo;
        </p>
        <div className="flex items-baseline space-x-2 text-xs text-gray-500">
          <span>
            Predicted: {formatValue(prediction.predictedValue, prediction.predictedValueUnit)}
          </span>
          <span>•</span>
          <span>
            Actual: {formatValue(prediction.actualValue || 0, prediction.predictedValueUnit)}
          </span>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatDate(prediction.createdAt)} → {formatDate(prediction.predictionTargetDate)}</span>
        <span className="text-gray-600">
          {prediction.confidencePercentage}% confidence
        </span>
      </div>
    </motion.div>
  );
};

// ==================== ACTIVE PREDICTION CARD ====================

interface ActivePredictionCardProps {
  prediction: Prediction;
  index: number;
}

const ActivePredictionCard: React.FC<ActivePredictionCardProps> = ({
  prediction,
  index
}) => {
  const typeColor = getPredictionTypeColor(prediction.type);
  const weeksRemaining = getWeeksUntilTarget(prediction.predictionTargetDate);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#1f1f1f] border border-blue-500 border-opacity-30 rounded-lg p-4 hover:border-blue-500 hover:border-opacity-50 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-400" />
          <span className={`text-sm font-semibold ${typeColor}`}>
            {getPredictionTypeLabel(prediction.type)}
          </span>
        </div>
        <div className="text-xs font-semibold text-blue-400">
          {weeksRemaining} {weeksRemaining === 1 ? 'week' : 'weeks'} away
        </div>
      </div>

      {/* Prediction */}
      <div className="mb-3">
        <p className="text-sm text-gray-300 mb-2">
          &ldquo;{prediction.description}&rdquo;
        </p>
        <div className="text-xs text-gray-500">
          Target: {formatValue(prediction.predictedValue, prediction.predictedValueUnit)}
        </div>
      </div>

      {/* Confidence */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Confidence:</span>
          <div className="w-24 bg-gray-800 rounded-full h-1.5">
            <div
              className="h-1.5 bg-blue-500 rounded-full"
              style={{ width: `${prediction.confidencePercentage}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-blue-400">
            {prediction.confidencePercentage}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== OVERALL ACCURACY BANNER ====================

interface AccuracyBannerProps {
  overallAccuracy: number;
  totalValidations: number;
}

const AccuracyBanner: React.FC<AccuracyBannerProps> = ({
  overallAccuracy,
  totalValidations
}) => {
  const accuracyColor = getAccuracyColor(overallAccuracy);
  const accuracyLabel = getAccuracyLabel(overallAccuracy);

  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Award className="h-6 w-6 text-blue-400" />
          <div>
            <h3 className="text-sm font-semibold text-gray-200">
              Overall Prediction Accuracy
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Based on {totalValidations} validated {totalValidations === 1 ? 'prediction' : 'predictions'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${accuracyColor}`}>
            {overallAccuracy.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {accuracyLabel}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

export const PredictionTracker: React.FC<PredictionTrackerProps> = ({
  predictions,
  isLoading = false,
  error = null
}) => {
  // ==================== COMPUTED VALUES ====================

  const { activePredictions, validatedPredictions, overallAccuracy } = useMemo(() => {
    const active = predictions.filter((p) => !p.isValidated);
    const validated = predictions.filter((p) => p.isValidated);

    const accuracy =
      validated.length > 0
        ? validated.reduce((sum, p) => sum + (p.accuracyPercentage || 0), 0) /
          validated.length
        : 0;

    return {
      activePredictions: active,
      validatedPredictions: validated,
      overallAccuracy: accuracy
    };
  }, [predictions]);

  // ==================== LOADING STATE ====================

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-[#1f1f1f] border border-gray-800 rounded-lg p-4 animate-pulse">
          <div className="h-20 bg-gray-800 rounded"></div>
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[#1f1f1f] border border-gray-800 rounded-lg p-4 animate-pulse"
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
              Error Loading Predictions
            </h3>
            <p className="text-xs text-red-200 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== EMPTY STATE ====================

  if (predictions.length === 0) {
    return (
      <div className="bg-[#1f1f1f] border border-gray-800 rounded-lg p-12 text-center">
        <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-300 mb-2">
          No Predictions Yet
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Record your first tool outcomes to generate financial predictions.
          Predictions will appear here 4-8 weeks before outcomes materialize.
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
          Financial Predictions (Lagging)
        </h2>
        <p className="text-sm text-gray-400">
          Predicted from tool outcomes 4-8 weeks ago
        </p>
      </div>

      {/* Overall Accuracy */}
      {validatedPredictions.length > 0 && (
        <AccuracyBanner
          overallAccuracy={overallAccuracy}
          totalValidations={validatedPredictions.length}
        />
      )}

      {/* Active Predictions */}
      {activePredictions.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-200">
              Active Predictions
            </h3>
            <span className="text-sm text-gray-500">
              ({activePredictions.length})
            </span>
          </div>
          <div className="space-y-3">
            {activePredictions.map((prediction, index) => (
              <ActivePredictionCard
                key={prediction.id}
                prediction={prediction}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Validated Predictions */}
      {validatedPredictions.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-200">
              Validated Predictions
            </h3>
            <span className="text-sm text-gray-500">
              ({validatedPredictions.length})
            </span>
          </div>
          <div className="space-y-3">
            {validatedPredictions.slice(0, 5).map((prediction, index) => (
              <ValidatedPredictionCard
                key={prediction.id}
                prediction={prediction}
                index={index}
              />
            ))}
          </div>
          {validatedPredictions.length > 5 && (
            <button className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors">
              View all {validatedPredictions.length} validated predictions →
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictionTracker;
