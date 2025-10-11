'use client';

/**
 * ProgressiveToolAccessCard - Tool access status overview
 *
 * Features:
 * - Overview of all 3 tools (ICP, Cost Calculator, Business Case)
 * - Unlock status indicators (unlocked/locked)
 * - Progress toward unlocking for locked tools
 * - Competency-based progressive unlock display
 * - Compact card format for dashboard
 */

import React from 'react';
import { Lock, Unlock, Target, Calculator, FileText, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: LucideIcon;
  unlocked: boolean;
  progress: number;
  requirement: string;
  color: string;
}

interface ProgressiveToolAccessCardProps {
  tools?: Tool[];
  className?: string;
}

const ProgressiveToolAccessCard: React.FC<ProgressiveToolAccessCardProps> = ({
  tools: propTools,
  className = ''
}) => {
  const defaultTools: Tool[] = [
    {
      id: 'icp-analysis',
      name: 'ICP Analysis',
      icon: Target,
      unlocked: true,
      progress: 100,
      requirement: 'Always available',
      color: '#3B82F6'
    },
    {
      id: 'cost-calculator',
      name: 'Cost Calculator',
      icon: Calculator,
      unlocked: true,
      progress: 100,
      requirement: '3 ICP analyses (70%+ accuracy)',
      color: '#10B981'
    },
    {
      id: 'business-case',
      name: 'Business Case Builder',
      icon: FileText,
      unlocked: false,
      progress: 50,
      requirement: '2 cost analyses completed',
      color: '#8B5CF6'
    }
  ];

  const tools = propTools || defaultTools;
  const unlockedCount = tools.filter(tool => tool.unlocked).length;
  const totalTools = tools.length;
  const nextToUnlock = tools.find(tool => !tool.unlocked);

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
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-base font-semibold text-white">Tool Access</h3>
        </div>
        <span className="text-sm font-medium text-purple-400">
          {unlockedCount}/{totalTools} Unlocked
        </span>
      </div>

      {/* Tools List */}
      <div className="space-y-3 mb-4">
        {tools.map((tool, index) => {
          const IconComponent = tool.icon;
          const isLast = index === tools.length - 1;

          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`relative p-3 rounded-lg border ${
                tool.unlocked
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-900 border-gray-800'
              } ${!isLast ? 'mb-2' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {/* Tool Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tool.unlocked ? 'bg-gray-700' : 'bg-gray-800'
                    }`}
                    style={{
                      backgroundColor: tool.unlocked ? `${tool.color}20` : undefined
                    }}
                  >
                    <IconComponent
                      className="w-5 h-5"
                      style={{ color: tool.unlocked ? tool.color : '#6B7280' }}
                    />
                  </div>

                  {/* Tool Info */}
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${
                      tool.unlocked ? 'text-white' : 'text-gray-400'
                    }`}>
                      {tool.name}
                    </h4>
                    <p className="text-xs text-gray-500">{tool.requirement}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center space-x-2">
                  {tool.unlocked ? (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-green-900/30 border border-green-700 rounded">
                      <Unlock className="w-3 h-3 text-green-400" />
                      <span className="text-xs font-medium text-green-400">Available</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded">
                      <Lock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs font-medium text-gray-500">Locked</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar (for locked tools) */}
              {!tool.unlocked && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-medium text-gray-400">{tool.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-1.5 rounded-full"
                      style={{ backgroundColor: tool.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${tool.progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Next Unlock Insight */}
      {nextToUnlock && (
        <div className="p-3 bg-purple-900/20 border border-purple-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <Lock className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-sm font-medium text-purple-400 mb-1">Next Unlock</h5>
              <p className="text-xs text-purple-300">
                {nextToUnlock.name} - {100 - nextToUnlock.progress}% progress needed
              </p>
            </div>
          </div>
        </div>
      )}

      {/* All Unlocked Message */}
      {!nextToUnlock && (
        <div className="p-3 bg-green-900/20 border border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <Unlock className="w-4 h-4 text-green-400" />
            <div>
              <h5 className="text-sm font-medium text-green-400">Full Access</h5>
              <p className="text-xs text-green-300">All tools unlocked and available</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProgressiveToolAccessCard;
