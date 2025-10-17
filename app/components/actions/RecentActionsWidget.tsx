'use client';

/**
 * RecentActionsWidget - Display recent professional actions
 *
 * Features:
 * - List of last 10 actions with action type badges
 * - Impact level indicators (low, medium, high, critical)
 * - Points awarded display
 * - Date/time formatting (relative timestamps)
 * - Interactive items with expandable details
 * - Smart filtering by action category
 */

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, TrendingUp, FileText, Calculator, Target, Users, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Action {
  id: string;
  type: string;
  category: 'customerAnalysis' | 'valueCommunication' | 'salesExecution';
  title: string;
  details?: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  points: number;
  timestamp: Date;
  icon: LucideIcon;
  isNew?: boolean;
}

interface RecentActionsWidgetProps {
  actions?: Action[];
  maxItems?: number;
  showTimestamps?: boolean;
  enableFiltering?: boolean;
  onActionClick?: (action: Action) => void;
  className?: string;
}

const RecentActionsWidget: React.FC<RecentActionsWidgetProps> = ({
  actions: propActions,
  maxItems = 10,
  showTimestamps = true,
  enableFiltering = true,
  onActionClick,
  className = ''
}) => {
  const [actions, setActions] = useState<Action[]>([]);
  const [filter, setFilter] = useState<'all' | string>('all');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Generate sample professional actions
  const generateSampleActions = (): Action[] => {
    const actionTemplates = [
      {
        type: 'customer_meeting',
        category: 'customerAnalysis' as const,
        title: 'Completed customer discovery session with TechCorp',
        details: 'Enterprise segment, 95% fit score, recommended for immediate outreach',
        impact: 'high' as const,
        points: 100,
        icon: Users
      },
      {
        type: 'icp_analysis',
        category: 'customerAnalysis' as const,
        title: 'Conducted ICP analysis for SaaS vertical',
        details: 'Identified 3 ideal customer profiles with 85%+ fit scores',
        impact: 'medium' as const,
        points: 75,
        icon: Target
      },
      {
        type: 'value_proposition',
        category: 'valueCommunication' as const,
        title: 'Delivered value proposition to C-suite stakeholders',
        details: 'Presented ROI analysis, 18-month payback period',
        impact: 'high' as const,
        points: 150,
        icon: TrendingUp
      },
      {
        type: 'roi_presentation',
        category: 'valueCommunication' as const,
        title: 'Presented comprehensive ROI analysis',
        details: 'Financial model showing $125K annual savings',
        impact: 'critical' as const,
        points: 200,
        icon: Calculator
      },
      {
        type: 'proposal_creation',
        category: 'salesExecution' as const,
        title: 'Created business proposal for RFP response',
        details: 'Comprehensive 45-page proposal with technical specifications',
        impact: 'high' as const,
        points: 250,
        icon: FileText
      },
      {
        type: 'deal_closure',
        category: 'salesExecution' as const,
        title: 'Successfully closed $75K annual contract',
        details: 'Enterprise customer, 3-year commitment secured',
        impact: 'critical' as const,
        points: 500,
        icon: Award
      },
      {
        type: 'prospect_qualification',
        category: 'customerAnalysis' as const,
        title: 'Qualified 8 prospects using BANT framework',
        details: 'Budget confirmed, authority identified, timeline established',
        impact: 'medium' as const,
        points: 75,
        icon: CheckCircle
      },
      {
        type: 'case_study',
        category: 'valueCommunication' as const,
        title: 'Developed customer success case study',
        details: 'Documented 40% efficiency improvement for existing customer',
        impact: 'high' as const,
        points: 400,
        icon: FileText
      }
    ];

    return actionTemplates.map((template, index) => ({
      id: `action-${index}`,
      ...template,
      timestamp: new Date(Date.now() - (index * 3.5 * 60 * 60 * 1000)), // Stagger by 3.5 hours
      isNew: index < 2
    }));
  };

  // Initialize actions
  useEffect(() => {
    if (propActions) {
      setActions(propActions);
    } else {
      setActions(generateSampleActions());
    }
  }, [propActions]);

  // Filter actions
  const filteredActions = actions.filter(action => {
    if (filter === 'all') return true;
    return action.category === filter;
  });

  // Format timestamp
  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  // Get impact color
  const getImpactColor = (impact: string): string => {
    const colors: Record<string, string> = {
      low: 'bg-gray-400',
      medium: 'bg-blue-400',
      high: 'bg-green-400',
      critical: 'bg-purple-400'
    };
    return colors[impact] || colors.medium;
  };

  // Get category label
  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      customerAnalysis: 'Customer Analysis',
      valueCommunication: 'Value Communication',
      salesExecution: 'Sales Execution'
    };
    return labels[category] || category;
  };

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All', count: actions.length },
    { value: 'customerAnalysis', label: 'Customer', count: actions.filter(a => a.category === 'customerAnalysis').length },
    { value: 'valueCommunication', label: 'Value', count: actions.filter(a => a.category === 'valueCommunication').length },
    { value: 'salesExecution', label: 'Sales', count: actions.filter(a => a.category === 'salesExecution').length }
  ];

  return (
    <motion.div
      className={`bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 border-b border-gray-800 p-6">
        <h3 className="text-xl font-bold text-white mb-1">Recent Professional Actions</h3>
        <p className="text-sm text-gray-400">Tracking your business development activities</p>
      </div>

      <div className="p-6 space-y-4">
        {/* Filter Tabs */}
        {enableFiltering && (
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {option.label}
                {option.count > 0 && (
                  <span className="ml-1 text-xs opacity-75">({option.count})</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Action List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredActions.slice(0, maxItems).map((action, index) => {
              const IconComponent = action.icon;
              const isExpanded = expandedItem === action.id;

              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`relative p-4 rounded-lg border border-gray-700 cursor-pointer transition-all duration-200 hover:border-gray-600 hover:bg-gray-800/50 ${
                    action.isNew ? 'ring-1 ring-blue-500/30' : ''
                  }`}
                  onClick={() => {
                    setExpandedItem(isExpanded ? null : action.id);
                    if (onActionClick) onActionClick(action);
                  }}
                >
                  {/* New Action Indicator */}
                  {action.isNew && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  )}

                  <div className="flex items-start space-x-3">
                    {/* Action Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-blue-400" />
                    </div>

                    {/* Action Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-white line-clamp-2">
                          {action.title}
                        </p>
                        {showTimestamps && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500 ml-2">
                            <Clock className="w-3 h-3" />
                            <span className="whitespace-nowrap">{formatTimestamp(action.timestamp)}</span>
                          </div>
                        )}
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center space-x-4 text-xs">
                        {/* Impact Level */}
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${getImpactColor(action.impact)}`} />
                          <span className="text-gray-400 capitalize">{action.impact} impact</span>
                        </div>

                        {/* Points Awarded */}
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400 font-medium">+{action.points}</span>
                          <span className="text-gray-400">points</span>
                        </div>

                        {/* Category Badge */}
                        <div className="px-2 py-0.5 bg-gray-700 rounded text-gray-300">
                          {getCategoryLabel(action.category)}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && action.details && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 pt-3 border-t border-gray-700"
                          >
                            <p className="text-sm text-gray-300">{action.details}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* View All Button */}
        {actions.length > maxItems && (
          <button className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 border border-gray-700 hover:border-gray-600 rounded-lg transition-colors">
            View All Actions ({actions.length})
          </button>
        )}

        {/* Empty State */}
        {filteredActions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent actions to display</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentActionsWidget;
