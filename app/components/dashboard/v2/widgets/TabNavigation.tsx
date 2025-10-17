'use client';

/**
 * TabNavigation - Professional tab navigation component
 *
 * Features:
 * - Tab buttons with icon, label, and description
 * - Lock states with unlock requirements
 * - Progress bars for locked tabs
 * - Active tab indicator with smooth animation
 * - Competency score summary display
 * - Professional hover and tap animations (framer-motion)
 * - Tab numbering for visual hierarchy
 * - Responsive grid layout
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, BarChart3 } from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================

export type CompetencyCategory = 'customerAnalysis' | 'valueCommunication' | 'salesExecution';

export interface Tab {
  /** Unique tab identifier */
  id: string;
  /** Tab label */
  label: string;
  /** Tab description */
  description: string;
  /** Tab icon (emoji or component) */
  icon: string;
  /** Whether tab is unlocked */
  unlocked: boolean;
  /** Required score to unlock */
  requirementScore?: number;
  /** Competency category for unlock requirement */
  requirementCategory?: CompetencyCategory;
}

export interface CompetencyData {
  /** Current Customer Analysis score */
  currentCustomerAnalysis: number;
  /** Current Value Communication score */
  currentValueCommunication: number;
  /** Current Sales Execution score */
  currentSalesExecution: number;
}

export interface TabNavigationProps {
  /** Array of tabs */
  tabs: Tab[];
  /** Currently active tab ID */
  activeTab: string;
  /** Competency scores data */
  competencyData: CompetencyData;
  /** Tab click handler */
  onTabClick: (tabId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get current score for a competency category
 */
function getCurrentScore(
  competencyData: CompetencyData,
  category?: CompetencyCategory
): number {
  if (!category) return 0;

  switch (category) {
    case 'customerAnalysis':
      return competencyData.currentCustomerAnalysis;
    case 'valueCommunication':
      return competencyData.currentValueCommunication;
    case 'salesExecution':
      return competencyData.currentSalesExecution;
    default:
      return 0;
  }
}

/**
 * Calculate progress percentage towards requirement
 */
function getProgressPercentage(tab: Tab, competencyData: CompetencyData): number {
  if (!tab.requirementScore || !tab.requirementCategory) return 100;

  const currentScore = getCurrentScore(competencyData, tab.requirementCategory);
  return Math.min(100, (currentScore / tab.requirementScore) * 100);
}

/**
 * Get tab styling classes based on state
 */
function getTabStyling(tab: Tab, isActive: boolean): string {
  if (tab.unlocked) {
    return isActive
      ? 'bg-blue-900/50 border-blue-500/50 text-blue-300'
      : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600';
  } else {
    return 'bg-gray-900 border-gray-800 text-gray-500 cursor-not-allowed';
  }
}

/**
 * Get requirement text for locked tabs
 */
function getRequirementText(tab: Tab, competencyData: CompetencyData): string | null {
  if (tab.unlocked || !tab.requirementScore || !tab.requirementCategory) return null;

  const currentScore = getCurrentScore(competencyData, tab.requirementCategory);
  const needed = tab.requirementScore - currentScore;
  const categoryLabel = tab.requirementCategory
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .trim();

  return `Reach ${needed.toFixed(0)}+ points in ${categoryLabel} to unlock`;
}

/**
 * Get progress bar color based on percentage
 */
function getProgressBarColor(percentage: number): string {
  if (percentage >= 100) return 'bg-green-500';
  if (percentage >= 70) return 'bg-yellow-500';
  return 'bg-blue-500';
}

// ==================== MAIN COMPONENT ====================

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  competencyData,
  onTabClick,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Tab Headers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const progressPercentage = getProgressPercentage(tab, competencyData);
          const requirementText = getRequirementText(tab, competencyData);

          return (
            <motion.button
              key={tab.id}
              onClick={() => tab.unlocked && onTabClick(tab.id)}
              disabled={!tab.unlocked}
              whileHover={tab.unlocked ? { scale: 1.02 } : undefined}
              whileTap={tab.unlocked ? { scale: 0.98 } : undefined}
              className={`relative p-6 rounded-lg border-2 transition-all duration-300 text-left ${getTabStyling(
                tab,
                isActive
              )}`}
              aria-label={`${tab.label} tab ${tab.unlocked ? '' : '(locked)'}`}
              aria-disabled={!tab.unlocked}
            >
              {/* Tab Icon and Content */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl" aria-hidden="true">
                    {tab.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-lg">{tab.label}</h3>
                    <p className="text-sm opacity-75">{tab.description}</p>
                  </div>
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {tab.unlocked ? (
                    <CheckCircle className="w-6 h-6 text-green-400" aria-label="Unlocked" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-500" aria-label="Locked" />
                  )}
                </div>
              </div>

              {/* Progress Bar for Locked Tabs */}
              {!tab.unlocked && tab.requirementScore && tab.requirementCategory && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress to unlock</span>
                    <span className="text-gray-300">
                      {getCurrentScore(competencyData, tab.requirementCategory).toFixed(0)}/
                      {tab.requirementScore}
                    </span>
                  </div>

                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-2 rounded-full ${getProgressBarColor(progressPercentage)}`}
                    />
                  </div>

                  {requirementText && (
                    <p className="text-xs text-gray-500 mt-2">{requirementText}</p>
                  )}
                </div>
              )}

              {/* Active Tab Indicator */}
              {isActive && tab.unlocked && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 rounded-b-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* Tab Number Badge */}
              <div className="absolute top-2 right-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    tab.unlocked ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Professional Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-900 border border-gray-800 rounded-lg p-4"
      >
        <div className="flex items-center space-x-3 mb-3">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h4 className="font-medium text-white">Methodology Progress</h4>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {competencyData.currentCustomerAnalysis.toFixed(0)}
            </div>
            <div className="text-xs text-gray-400">Customer Analysis</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {competencyData.currentValueCommunication.toFixed(0)}
            </div>
            <div className="text-xs text-gray-400">Value Communication</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {competencyData.currentSalesExecution.toFixed(0)}
            </div>
            <div className="text-xs text-gray-400">Sales Execution</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TabNavigation;
