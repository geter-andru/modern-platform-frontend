'use client';

/**
 * MilestoneTrackerCard - Milestone progress and timeline tracking
 *
 * Features:
 * - Current milestone progress with animated visual indicator
 * - Time-based progress tracking with urgency detection
 * - Next milestone preview with estimated start date
 * - Achievement status and completion forecast
 * - Expandable details with target, due date, and remaining progress
 */

import React, { useState, useEffect } from 'react';
import { Target, Calendar, Zap, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Milestone {
  name: string;
  progress: number;
  target: number;
  dueDate: string;
}

interface NextMilestone {
  name: string;
  estimatedStart: string;
}

interface MilestoneTrackerCardProps {
  currentMilestone?: Milestone;
  nextMilestone?: NextMilestone;
  achievements?: number;
  totalMilestones?: number;
  className?: string;
}

const MilestoneTrackerCard: React.FC<MilestoneTrackerCardProps> = ({
  currentMilestone = {
    name: 'Foundation → Growth',
    progress: 72,
    target: 75,
    dueDate: '2025-12-15'
  },
  nextMilestone = {
    name: 'Growth → Expansion',
    estimatedStart: '2025-12-20'
  },
  achievements = 2,
  totalMilestones = 6,
  className = ''
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Animate progress on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(currentMilestone.progress);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentMilestone.progress]);

  // Calculate time metrics
  const calculateTimeMetrics = () => {
    const dueDate = new Date(currentMilestone.dueDate);
    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const isOverdue = daysRemaining < 0;
    const isUrgent = daysRemaining <= 7 && daysRemaining > 0;
    const isOnTrack = currentMilestone.progress >= (currentMilestone.target * 0.8);

    return {
      daysRemaining: Math.abs(daysRemaining),
      isOverdue,
      isUrgent,
      isOnTrack,
      status: isOverdue ? 'Overdue' :
              isUrgent ? 'Urgent' :
              isOnTrack ? 'On Track' : 'At Risk'
    };
  };

  const timeMetrics = calculateTimeMetrics();

  // Get status color
  const getStatusColor = (): string => {
    if (timeMetrics.isOverdue) return 'text-red-400';
    if (timeMetrics.isUrgent) return 'text-yellow-400';
    if (timeMetrics.isOnTrack) return 'text-green-400';
    return 'text-gray-400';
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Calculate completion forecast
  const getCompletionForecast = (): string => {
    if (currentMilestone.progress >= currentMilestone.target) {
      return 'Complete';
    }

    const progressNeeded = currentMilestone.target - currentMilestone.progress;
    const daysAvailable = Math.max(timeMetrics.daysRemaining, 1);
    const dailyProgressNeeded = progressNeeded / daysAvailable;

    if (dailyProgressNeeded <= 2) return 'On Pace';
    if (dailyProgressNeeded <= 4) return 'Push Needed';
    return 'Critical';
  };

  const forecast = getCompletionForecast();

  // Get forecast color
  const getForecastColor = (): string => {
    if (forecast === 'Complete') return 'text-green-400';
    if (forecast === 'On Pace') return 'text-blue-400';
    if (forecast === 'Push Needed') return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      className={`bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-base font-semibold text-white">Milestone Progress</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
        >
          {Math.round(animatedProgress)}%
        </button>
      </div>

      {/* Current Milestone Name */}
      <p className="text-sm text-gray-400 mb-3">{currentMilestone.name}</p>

      {/* Progress Bar */}
      <div className="space-y-2 mb-4">
        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${animatedProgress}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>

        {/* Progress Labels */}
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">
            {Math.round(animatedProgress)}% complete
          </span>
          <span className={getStatusColor()}>
            {timeMetrics.status}
          </span>
        </div>
      </div>

      {/* Time and Forecast Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">Timeline</span>
          </div>
          <p className="text-sm font-medium text-white">
            {timeMetrics.isOverdue ? 'Overdue' : `${timeMetrics.daysRemaining}d left`}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Zap className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">Forecast</span>
          </div>
          <p className={`text-sm font-medium ${getForecastColor()}`}>
            {forecast}
          </p>
        </div>
      </div>

      {/* Achievements Summary */}
      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-400">
            {achievements}/{totalMilestones} milestones achieved
          </span>
        </div>
        <span className="text-sm text-purple-400">
          Next: {formatDate(nextMilestone.estimatedStart).split(',')[0]}
        </span>
      </div>

      {/* Detailed Breakdown */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3"
          >
            <h4 className="text-sm font-semibold text-white mb-2">Milestone Details</h4>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Current Progress:</span>
                <span className="text-xs text-white font-medium">{currentMilestone.progress}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Target:</span>
                <span className="text-xs text-white font-medium">{currentMilestone.target}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Due Date:</span>
                <span className="text-xs text-white font-medium">{formatDate(currentMilestone.dueDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Remaining:</span>
                <span className="text-xs text-white font-medium">
                  {Math.max(currentMilestone.target - currentMilestone.progress, 0)}%
                </span>
              </div>
            </div>

            {/* Next Milestone Preview */}
            <div className="mt-4 pt-3 border-t border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-medium text-gray-300">Next Milestone</span>
              </div>
              <p className="text-sm text-white mb-1">{nextMilestone.name}</p>
              <p className="text-xs text-gray-400">
                Estimated start: {formatDate(nextMilestone.estimatedStart)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MilestoneTrackerCard;
