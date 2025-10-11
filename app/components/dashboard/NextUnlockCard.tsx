'use client';

/**
 * NextUnlockCard - Next tool unlock preview and requirements
 *
 * Features:
 * - Next tool to unlock preview with icon
 * - Competency requirements display
 * - Progress toward unlock with visual indicators
 * - Estimated actions needed to unlock
 * - Tool capabilities preview
 */

import React from 'react';
import { Lock, TrendingUp, Star, ChevronRight, Calculator, FileText, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface CompetencyRequirement {
  name: string;
  required: number;
  current: number;
  color: string;
}

interface NextTool {
  id: string;
  name: string;
  icon: LucideIcon;
  level: string;
  levelBadge: string;
  color: string;
  description: string;
  requirements: CompetencyRequirement[];
  capabilities: string[];
  actionsNeeded: number;
}

interface NextUnlockCardProps {
  nextTool?: NextTool;
  className?: string;
}

const NextUnlockCard: React.FC<NextUnlockCardProps> = ({
  nextTool = {
    id: 'cost-calculator',
    name: 'Cost of Inaction Calculator',
    icon: Calculator,
    level: 'Developing Level',
    levelBadge: 'Level 2',
    color: 'green',
    description: 'Advanced revenue impact analysis methodology',
    requirements: [
      { name: 'Customer Analysis', required: 65, current: 58, color: '#3B82F6' },
      { name: 'Value Communication', required: 60, current: 55, color: '#10B981' }
    ],
    capabilities: [
      'Multi-scenario cost modeling',
      'Risk-adjusted impact calculations',
      'Executive summary generation'
    ],
    actionsNeeded: 3
  },
  className = ''
}) => {
  // Calculate overall progress toward unlock
  const calculateOverallProgress = (): number => {
    if (!nextTool.requirements.length) return 0;

    const totalProgress = nextTool.requirements.reduce((sum, req) => {
      const progress = Math.min((req.current / req.required) * 100, 100);
      return sum + progress;
    }, 0);

    return totalProgress / nextTool.requirements.length;
  };

  const overallProgress = calculateOverallProgress();
  const isCloseToUnlock = overallProgress >= 80;
  const IconComponent = nextTool.icon;

  // Get progress color based on percentage
  const getProgressColor = (progress: number): string => {
    if (progress >= 90) return 'text-green-400';
    if (progress >= 70) return 'text-blue-400';
    if (progress >= 50) return 'text-yellow-400';
    return 'text-gray-400';
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
          <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Lock className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-white">Next Unlock</h3>
        </div>
        <span className={`px-2 py-1 bg-${nextTool.color}-900/30 border border-${nextTool.color}-700 rounded text-xs font-medium text-${nextTool.color}-400`}>
          {nextTool.levelBadge}
        </span>
      </div>

      {/* Tool Preview */}
      <div className="flex items-start space-x-4 mb-4 p-4 bg-gray-800 rounded-lg">
        <div className={`w-12 h-12 bg-gradient-to-br from-${nextTool.color}-600 to-${nextTool.color}-500 rounded-lg flex items-center justify-center flex-shrink-0`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white mb-1">{nextTool.name}</h4>
          <p className="text-xs text-gray-400">{nextTool.description}</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Unlock Progress</span>
          <span className={`text-xs font-medium ${getProgressColor(overallProgress)}`}>
            {Math.round(overallProgress)}%
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`bg-gradient-to-r from-blue-500 to-${nextTool.color}-500 h-2 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Competency Requirements */}
      <div className="space-y-3 mb-4">
        <h5 className="text-xs font-semibold text-gray-300 flex items-center">
          <Target className="w-3 h-3 mr-1" />
          Requirements
        </h5>
        {nextTool.requirements.map((req, index) => {
          const progress = (req.current / req.required) * 100;
          const isMet = req.current >= req.required;

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{req.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {req.current}/{req.required}
                  </span>
                  {isMet && (
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: isMet ? '#10B981' : req.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions Needed */}
      <div className={`p-3 rounded-lg ${isCloseToUnlock ? 'bg-green-900/20 border border-green-800' : 'bg-blue-900/20 border border-blue-800'} mb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className={`w-4 h-4 ${isCloseToUnlock ? 'text-green-400' : 'text-blue-400'}`} />
            <span className={`text-sm font-medium ${isCloseToUnlock ? 'text-green-400' : 'text-blue-400'}`}>
              {isCloseToUnlock ? 'Almost There!' : 'Keep Going'}
            </span>
          </div>
          <span className={`text-xs ${isCloseToUnlock ? 'text-green-300' : 'text-blue-300'}`}>
            ~{nextTool.actionsNeeded} actions needed
          </span>
        </div>
      </div>

      {/* Capabilities Preview */}
      <div className="space-y-2 mb-4">
        <h5 className="text-xs font-semibold text-gray-300 flex items-center">
          <Star className="w-3 h-3 mr-1 text-yellow-400" />
          What You'll Get
        </h5>
        <div className="space-y-1">
          {nextTool.capabilities.slice(0, 3).map((capability, index) => (
            <div key={index} className="flex items-start space-x-2">
              <ChevronRight className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-400">{capability}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <button className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
        <span>Track Actions to Unlock</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default NextUnlockCard;
