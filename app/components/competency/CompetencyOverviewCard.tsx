'use client';

/**
 * CompetencyOverviewCard - Display current competency level with progress tracking
 *
 * Features:
 * - Current level display with progress points
 * - Tool unlock status tracking
 * - Daily objectives completion
 * - Consistency streak visualization
 * - Progress bar to next level
 * - Recent professional achievements
 */

import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, Target, Unlock, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompetencyOverviewData {
  currentLevel: string;
  progressPoints: number;
  nextLevelThreshold: number;
  progressToNext: number;
  toolsUnlocked: number;
  totalTools: number;
  todaysObjectives: number;
  objectivesCompleted: number;
  consistencyStreak: number;
  hiddenRank?: string;
  recentMilestones?: MilestoneData[];
}

interface MilestoneData {
  name: string;
  points: number;
  date?: string;
}

interface CompetencyOverviewCardProps {
  customerId?: string;
  competencyData?: Partial<CompetencyOverviewData>;
  onRefresh?: () => void;
  className?: string;
}

const CompetencyOverviewCard: React.FC<CompetencyOverviewCardProps> = ({
  customerId,
  competencyData,
  onRefresh,
  className = ''
}) => {
  const [overview, setOverview] = useState<CompetencyOverviewData>({
    currentLevel: 'Foundation',
    progressPoints: 0,
    nextLevelThreshold: 500,
    progressToNext: 0,
    toolsUnlocked: 1,
    totalTools: 3,
    todaysObjectives: 3,
    objectivesCompleted: 0,
    consistencyStreak: 0,
    hiddenRank: 'E',
    recentMilestones: []
  });
  const [loading, setLoading] = useState(true);
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    loadOverviewData();
  }, [customerId, competencyData]);

  const loadOverviewData = async () => {
    setLoading(true);

    // If competencyData is provided, use it
    if (competencyData) {
      setOverview(prev => ({
        ...prev,
        ...competencyData
      }));
      setLoading(false);
      return;
    }

    // Default demo data for testing
    setTimeout(() => {
      const defaultData: CompetencyOverviewData = {
        currentLevel: 'Developing',
        progressPoints: 1250,
        nextLevelThreshold: 2500,
        progressToNext: 1250,
        toolsUnlocked: 2,
        totalTools: 3,
        todaysObjectives: 5,
        objectivesCompleted: 3,
        consistencyStreak: 7,
        hiddenRank: 'C',
        recentMilestones: [
          { name: 'Completed ICP Analysis', points: 250 },
          { name: 'First Cost Calculator', points: 350 }
        ]
      };

      setOverview(defaultData);
      setLoading(false);
    }, 500);
  };

  const getProgressPercentage = () => {
    if (overview.nextLevelThreshold === 0) return 0;
    return Math.min((overview.progressToNext / overview.nextLevelThreshold) * 100, 100);
  };

  const getLevelColor = (level: string): string => {
    const colors: Record<string, string> = {
      'Foundation': 'text-blue-400',
      'Developing': 'text-green-400',
      'Proficient': 'text-yellow-400',
      'Advanced': 'text-purple-400',
      'Expert': 'text-red-400'
    };
    return colors[level] || 'text-gray-400';
  };

  const getRankDisplay = (rank: string): string => {
    const rankEmojis: Record<string, string> = {
      'E': '⚪', 'D': '🔵', 'C': '🟢',
      'B': '🟡', 'A': '🟠', 'S': '🔴', 'S+': '⭐'
    };
    return rankEmojis[rank] || '⚪';
  };

  if (loading) {
    return (
      <div className={`bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-b border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-900/50 rounded-lg border border-blue-700">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                Professional Competency Overview
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <span className={`font-medium ${getLevelColor(overview.currentLevel)}`}>
                  {overview.currentLevel} Level
                </span>
                <span className="text-gray-500">•</span>
                <span className="flex items-center space-x-1">
                  <span>{getRankDisplay(overview.hiddenRank || 'E')}</span>
                  <span>Methodology Specialist</span>
                </span>
              </div>
            </div>
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
              title="Refresh competency data"
            >
              <TrendingUp className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Progress Points */}
          <motion.div
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Progress Points</h3>
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
            <div className={`text-2xl font-bold text-yellow-400 ${animateProgress ? 'animate-pulse' : ''}`}>
              {overview.progressPoints.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Professional development score
            </div>
          </motion.div>

          {/* Methodology Access */}
          <motion.div
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Tools Available</h3>
              <Unlock className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">
              {overview.toolsUnlocked}/{overview.totalTools}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Advanced methodologies unlocked
            </div>
          </motion.div>

          {/* Daily Objectives */}
          <motion.div
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Today's Focus</h3>
              <Target className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {overview.objectivesCompleted}/{overview.todaysObjectives}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Professional objectives completed
            </div>
          </motion.div>

          {/* Consistency Streak */}
          <motion.div
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Excellence Streak</h3>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {overview.consistencyStreak}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Consecutive days of engagement
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Next Advancement Progress</h3>
            <span className="text-xs text-gray-500">
              {overview.progressToNext}/{overview.nextLevelThreshold}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              {animateProgress && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-slide-right" />
              )}
            </motion.div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Current: {overview.currentLevel}</span>
            <span>{Math.round(getProgressPercentage())}% Complete</span>
          </div>
        </div>

        {/* Recent Achievements */}
        {overview.recentMilestones && overview.recentMilestones.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
              <Award className="w-4 h-4 mr-2 text-yellow-400" />
              Recent Professional Achievements
            </h3>
            <div className="space-y-2">
              {overview.recentMilestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-900 rounded border border-gray-600 hover:border-purple-500/30 transition-colors cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <span className="text-sm text-gray-300">{milestone.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-yellow-400">+{milestone.points}</span>
                    <ChevronRight className="w-3 h-3 text-gray-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CompetencyOverviewCard;
