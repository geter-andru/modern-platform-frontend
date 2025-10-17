'use client';

/**
 * CompetencyFeedbackCard - Real-time competency development feedback
 *
 * Features:
 * - Recent competency improvements display
 * - Congratulatory messages for achievements
 * - Skill gains with point awards
 * - Positive reinforcement feedback
 * - Competency impact indicators
 */

import React from 'react';
import { TrendingUp, Award, Star, Zap, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CompetencyImpact {
  type: string;
  gain: number;
}

interface FeedbackItem {
  id: string;
  celebration: string;
  message: string;
  points: number;
  competencyImpact: CompetencyImpact[];
  timestamp: Date;
  isRecent: boolean;
}

interface CompetencyFeedbackCardProps {
  feedbackItems?: FeedbackItem[];
  className?: string;
}

const CompetencyFeedbackCard: React.FC<CompetencyFeedbackCardProps> = ({
  feedbackItems: propItems,
  className = ''
}) => {
  const defaultItems: FeedbackItem[] = [
    {
      id: 'feedback-1',
      celebration: 'Systematic approach recognized',
      message: 'Customer analysis methodology applied',
      points: 25,
      competencyImpact: [
        { type: 'customer_analysis', gain: 3 },
        { type: 'systematic_thinking', gain: 2 }
      ],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRecent: true
    },
    {
      id: 'feedback-2',
      celebration: 'Financial modeling proficiency demonstrated',
      message: 'Value quantification framework executed',
      points: 35,
      competencyImpact: [
        { type: 'value_articulation', gain: 4 },
        { type: 'financial_modeling', gain: 3 }
      ],
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isRecent: true
    },
    {
      id: 'feedback-3',
      celebration: 'Process efficiency excellence',
      message: 'Rapid methodology execution achieved',
      points: 40,
      competencyImpact: [
        { type: 'efficiency_mastery', gain: 3 }
      ],
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRecent: false
    }
  ];

  const feedbackItems = propItems || defaultItems;
  const recentItems = feedbackItems.filter(item => item.isRecent);
  const totalPointsToday = recentItems.reduce((sum, item) => sum + item.points, 0);

  // Format relative time
  const formatRelativeTime = (timestamp: Date): string => {
    const now = Date.now();
    const diff = now - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return 'Earlier';
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
          <div className="w-8 h-8 bg-yellow-900/30 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <h3 className="text-base font-semibold text-white">Recent Achievements</h3>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-yellow-400">{totalPointsToday} pts today</span>
        </div>
      </div>

      {/* Feedback Stream */}
      <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {feedbackItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`relative p-4 rounded-lg border ${
                item.isRecent
                  ? 'bg-blue-900/20 border-blue-700'
                  : 'bg-gray-800 border-gray-700'
              }`}
            >
              {/* Fresh indicator */}
              {item.isRecent && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
              )}

              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  item.isRecent ? 'bg-blue-800/50' : 'bg-gray-700'
                }`}>
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-white text-sm">{item.celebration}</h4>
                    {item.points > 0 && (
                      <span className="text-xs font-semibold text-green-400 ml-2 flex-shrink-0">
                        +{item.points}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 text-xs mb-2">{item.message}</p>

                  {/* Competency impacts */}
                  {item.competencyImpact && item.competencyImpact.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.competencyImpact.map((impact, idx) => (
                        <span
                          key={idx}
                          className="flex items-center space-x-1 text-xs px-2 py-0.5 bg-green-900/30 text-green-400 rounded border border-green-800"
                        >
                          <ArrowUp className="w-2.5 h-2.5" />
                          <span>{impact.type.replace(/_/g, ' ')} +{impact.gain}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="text-xs text-gray-500">
                    {formatRelativeTime(item.timestamp)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Award className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-gray-400">Total Achievements</span>
          </div>
          <p className="text-lg font-bold text-white">{feedbackItems.length}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-xs text-gray-400">Skills Improved</span>
          </div>
          <p className="text-lg font-bold text-white">
            {feedbackItems.reduce((sum, item) => sum + item.competencyImpact.length, 0)}
          </p>
        </div>
      </div>

      {/* Encouragement Message */}
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800 rounded-lg">
        <div className="flex items-start space-x-2">
          <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="text-sm font-medium text-blue-300 mb-1">Excellent Progress!</h5>
            <p className="text-xs text-blue-200">
              Your systematic approach to professional development is building valuable capabilities
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompetencyFeedbackCard;
