'use client';

/**
 * LearningVelocityWidget - Display learning velocity trend and weekly progress
 *
 * Features:
 * - Weekly task completion tracking with pie chart
 * - Week-over-week progress comparison
 * - Task breakdown by category
 * - Weekly consistency streak tracking
 * - Animated completion counters
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskCategories {
  [key: string]: number;
}

interface LearningVelocityWidgetProps {
  completed?: number;
  total?: number;
  previousWeekCompleted?: number;
  streak?: number;
  categories?: TaskCategories;
  className?: string;
}

const LearningVelocityWidget: React.FC<LearningVelocityWidgetProps> = ({
  completed = 8,
  total = 12,
  previousWeekCompleted = 6,
  streak = 3,
  categories = {
    'Customer Analysis': 3,
    'Value Communication': 2,
    'Business Development': 3
  },
  className = ''
}) => {
  const [animatedCompleted, setAnimatedCompleted] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Animate completion count
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedCompleted(completed);
    }, 200);
    return () => clearTimeout(timer);
  }, [completed]);

  // Calculate metrics
  const completionRate = total > 0 ? (completed / total) * 100 : 0;
  const previousRate = total > 0 ? (previousWeekCompleted / total) * 100 : 0;
  const weekOverWeekChange = completionRate - previousRate;
  const remaining = total - completed;

  // Pie chart data
  const pieData = [
    { name: 'Completed', value: Math.max(completed, 0), color: '#10B981' },
    { name: 'Remaining', value: Math.max(remaining, 0), color: '#374151' }
  ];

  // Get completion status
  const getCompletionStatus = (): { label: string; color: string } => {
    if (completionRate >= 90) return { label: 'Excellent', color: 'text-green-400' };
    if (completionRate >= 75) return { label: 'Good', color: 'text-blue-400' };
    if (completionRate >= 50) return { label: 'Fair', color: 'text-yellow-400' };
    return { label: 'Needs Focus', color: 'text-red-400' };
  };

  const status = getCompletionStatus();

  return (
    <motion.div
      className={`bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Weekly Progress</h3>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            {showBreakdown ? 'Hide' : 'Show'} Details
          </button>
        </div>

        {/* Main Progress Display */}
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowBreakdown(!showBreakdown)}
        >
          <div className="flex items-center space-x-4">
            {/* Pie Chart */}
            <div className="relative w-16 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={28}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {Math.round(completionRate)}%
                </span>
              </div>
            </div>

            {/* Task Count */}
            <div>
              <div className="flex items-center space-x-1">
                <motion.span
                  className="text-2xl font-bold text-white"
                  key={animatedCompleted}
                  initial={{ scale: 1.2, color: '#10B981' }}
                  animate={{ scale: 1, color: '#FFFFFF' }}
                  transition={{ duration: 0.3 }}
                >
                  {animatedCompleted}
                </motion.span>
                <span className="text-lg text-gray-400">
                  /{total}
                </span>
              </div>
              <p className="text-xs text-gray-400">tasks completed</p>
            </div>
          </div>

          {/* Week-over-week Change */}
          <div className="text-right">
            <div className="flex items-center justify-end space-x-1">
              {weekOverWeekChange > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : weekOverWeekChange < 0 ? (
                <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
              ) : (
                <Clock className="w-4 h-4 text-gray-400" />
              )}
              <span className={`text-sm font-medium ${
                weekOverWeekChange > 0 ? 'text-green-400' :
                weekOverWeekChange < 0 ? 'text-red-400' : 'text-gray-400'
              }`}>
                {weekOverWeekChange > 0 ? '+' : ''}{weekOverWeekChange.toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-gray-500">vs last week</p>
          </div>
        </div>

        {/* Status and Streak */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
          </div>

          {streak > 0 && (
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400 font-medium">{streak} week streak</span>
            </div>
          )}
        </div>

        {/* Task Breakdown */}
        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 space-y-3">
                <p className="text-sm font-medium text-white mb-3">This Week's Focus Areas</p>
                {Object.entries(categories).map(([category, count], index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-300">{category}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-white">{count} tasks</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LearningVelocityWidget;
