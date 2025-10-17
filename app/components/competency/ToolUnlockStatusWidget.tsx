'use client';

/**
 * ToolUnlockStatusWidget - Show tool access status and unlock progress
 *
 * Features:
 * - ICP Analysis (always unlocked)
 * - Cost Calculator (requires 70+ value communication)
 * - Business Case Builder (requires 70+ sales execution)
 * - Progress bars for locked tools
 * - Unlock requirements and descriptions
 * - Professional unlock celebration animations
 */

import React, { useState } from 'react';
import { Target, Calculator, FileText, Lock, Unlock, CheckCircle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface ToolRequirement {
  competency: string;
  requiredScore: number;
  currentScore: number;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  unlocked: boolean;
  requirement?: ToolRequirement;
  color: string;
}

interface ToolUnlockStatusWidgetProps {
  tools?: Tool[];
  customerId?: string;
  onToolClick?: (toolId: string) => void;
  className?: string;
}

const ToolUnlockStatusWidget: React.FC<ToolUnlockStatusWidgetProps> = ({
  tools,
  customerId,
  onToolClick,
  className = ''
}) => {
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  // Default tools configuration
  const defaultTools: Tool[] = [
    {
      id: 'icp-analysis',
      name: 'ICP Analysis',
      description: 'Customer identification and profiling methodology',
      icon: Target,
      unlocked: true,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'cost-calculator',
      name: 'Cost of Inaction Calculator',
      description: 'Revenue impact analysis methodology',
      icon: Calculator,
      unlocked: false,
      requirement: {
        competency: 'Value Communication',
        requiredScore: 70,
        currentScore: 58
      },
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'business-case',
      name: 'Business Case Builder',
      description: 'Strategic proposal development framework',
      icon: FileText,
      unlocked: false,
      requirement: {
        competency: 'Sales Execution',
        requiredScore: 70,
        currentScore: 72
      },
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const displayTools = tools || defaultTools;

  // Calculate unlock progress
  const calculateProgress = (tool: Tool): number => {
    if (tool.unlocked) return 100;
    if (!tool.requirement) return 0;

    const progress = (tool.requirement.currentScore / tool.requirement.requiredScore) * 100;
    return Math.min(progress, 100);
  };

  // Get progress status
  const getProgressStatus = (progress: number): { label: string; color: string } => {
    if (progress >= 100) return { label: 'Unlocked', color: 'text-green-400' };
    if (progress >= 90) return { label: 'Almost There', color: 'text-blue-400' };
    if (progress >= 70) return { label: 'Good Progress', color: 'text-yellow-400' };
    return { label: 'Keep Going', color: 'text-gray-400' };
  };

  // Calculate points needed
  const getPointsNeeded = (tool: Tool): number => {
    if (tool.unlocked || !tool.requirement) return 0;
    return Math.max(0, tool.requirement.requiredScore - tool.requirement.currentScore);
  };

  // Count unlocked tools
  const unlockedCount = displayTools.filter(tool => tool.unlocked).length;
  const totalCount = displayTools.length;

  return (
    <motion.div
      className={`bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/30 to-purple-900/30 border-b border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Tool Access Status
            </h3>
            <p className="text-sm text-gray-400">
              Progressive methodology unlocking system
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">
              {unlockedCount}/{totalCount}
            </div>
            <div className="text-xs text-gray-400">Unlocked</div>
          </div>
        </div>
      </div>

      {/* Tools List */}
      <div className="p-6 space-y-4">
        {displayTools.map((tool, index) => {
          const Icon = tool.icon;
          const progress = calculateProgress(tool);
          const status = getProgressStatus(progress);
          const pointsNeeded = getPointsNeeded(tool);
          const isExpanded = expandedTool === tool.id;

          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-800 rounded-lg border ${
                tool.unlocked ? 'border-green-500/30' : 'border-gray-700'
              } overflow-hidden`}
            >
              {/* Tool Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-750 transition-colors"
                onClick={() => {
                  setExpandedTool(isExpanded ? null : tool.id);
                  if (tool.unlocked && onToolClick) {
                    onToolClick(tool.id);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Tool Icon */}
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${tool.color} ${
                      !tool.unlocked && 'opacity-50'
                    }`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Tool Info */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-base font-semibold text-white">{tool.name}</h4>
                        {tool.unlocked ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{tool.description}</p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="text-right">
                    {tool.unlocked ? (
                      <div className="flex items-center space-x-1">
                        <Unlock className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">Available</span>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-white">{Math.round(progress)}%</div>
                        <div className={`text-xs ${status.color}`}>{status.label}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar (for locked tools) */}
                {!tool.unlocked && tool.requirement && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`bg-gradient-to-r ${tool.color} h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                      <span>{tool.requirement.competency}: {tool.requirement.currentScore}%</span>
                      <span>{pointsNeeded} points to unlock</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-700 bg-gray-800/50 p-4"
                  >
                    {tool.unlocked ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300">
                          ✅ This tool is unlocked and ready to use!
                        </p>
                        <p className="text-xs text-gray-400">
                          Click to navigate to {tool.name}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-white mb-1">Unlock Requirement:</p>
                          <p className="text-sm text-gray-300">
                            Achieve {tool.requirement?.requiredScore}% or higher in{' '}
                            {tool.requirement?.competency}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <TrendingUp className="w-3 h-3" />
                          <span>
                            Current: {tool.requirement?.currentScore}% | Target:{' '}
                            {tool.requirement?.requiredScore}%
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 p-4 bg-gray-800/30">
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>Professional development unlocks advanced methodologies</span>
          <span>Target: 70%+ competency scores</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ToolUnlockStatusWidget;
