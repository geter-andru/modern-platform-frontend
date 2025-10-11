'use client';

/**
 * SuggestedActionsWidget - Recommended actions for competency development
 *
 * Features:
 * - Top 5 suggested actions based on competency gaps
 * - Potential points and impact display
 * - Reason for suggestion (competency gap analysis)
 * - "Track Action" button for quick logging
 * - Diversification recommendations for balanced growth
 */

import React, { useState, useEffect } from 'react';
import { Lightbulb, Target, TrendingUp, Award, ChevronRight, Users, BarChart3, FileText, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface CompetencyScore {
  customerAnalysis: number;
  valueCommunication: number;
  salesExecution: number;
}

interface SuggestedAction {
  id: string;
  type: string;
  name: string;
  category: 'customerAnalysis' | 'valueCommunication' | 'salesExecution';
  description: string;
  icon: LucideIcon;
  potentialPoints: number;
  competencyGain: number;
  competencyArea: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  timeEstimate: string;
}

interface SuggestedActionsWidgetProps {
  competencyScores?: CompetencyScore;
  onTrackAction?: (action: SuggestedAction) => void;
  className?: string;
}

const SuggestedActionsWidget: React.FC<SuggestedActionsWidgetProps> = ({
  competencyScores: propScores,
  onTrackAction,
  className = ''
}) => {
  const [competencyScores, setCompetencyScores] = useState<CompetencyScore>({
    customerAnalysis: 65,
    valueCommunication: 55,
    salesExecution: 48
  });
  const [suggestions, setSuggestions] = useState<SuggestedAction[]>([]);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Action templates with competency mappings
  const actionTemplates = [
    {
      type: 'customer_meeting',
      name: 'Customer Discovery Meeting',
      category: 'customerAnalysis' as const,
      description: 'Conduct structured customer discovery session with qualified prospect',
      icon: Users,
      basePoints: 100,
      competencyGain: 5,
      competencyArea: 'customerAnalysis',
      timeEstimate: '1-2 hours'
    },
    {
      type: 'prospect_qualification',
      name: 'Prospect Qualification',
      category: 'customerAnalysis' as const,
      description: 'Apply systematic qualification framework (BANT, MEDDIC, etc.)',
      icon: Target,
      basePoints: 75,
      competencyGain: 3,
      competencyArea: 'customerAnalysis',
      timeEstimate: '30-60 minutes'
    },
    {
      type: 'value_proposition_delivery',
      name: 'Value Proposition Presentation',
      category: 'valueCommunication' as const,
      description: 'Deliver tailored value proposition to key stakeholders',
      icon: TrendingUp,
      basePoints: 150,
      competencyGain: 7,
      competencyArea: 'valueCommunication',
      timeEstimate: '1-2 hours'
    },
    {
      type: 'roi_presentation',
      name: 'ROI Analysis Presentation',
      category: 'valueCommunication' as const,
      description: 'Present comprehensive ROI analysis to decision makers',
      icon: BarChart3,
      basePoints: 200,
      competencyGain: 10,
      competencyArea: 'valueCommunication',
      timeEstimate: '2-3 hours'
    },
    {
      type: 'proposal_creation',
      name: 'Business Proposal Development',
      category: 'salesExecution' as const,
      description: 'Create comprehensive business proposal or RFP response',
      icon: FileText,
      basePoints: 250,
      competencyGain: 12,
      competencyArea: 'salesExecution',
      timeEstimate: '4-8 hours'
    },
    {
      type: 'deal_closure',
      name: 'Deal Closure Achievement',
      category: 'salesExecution' as const,
      description: 'Successfully close business opportunity and secure commitment',
      icon: Award,
      basePoints: 500,
      competencyGain: 15,
      competencyArea: 'salesExecution',
      timeEstimate: 'Variable'
    }
  ];

  // Calculate competency gaps and generate suggestions
  const generateSuggestions = (scores: CompetencyScore): SuggestedAction[] => {
    // Calculate gaps from target score of 75
    const targetScore = 75;
    const gaps = {
      customerAnalysis: Math.max(0, targetScore - scores.customerAnalysis),
      valueCommunication: Math.max(0, targetScore - scores.valueCommunication),
      salesExecution: Math.max(0, targetScore - scores.salesExecution)
    };

    // Prioritize actions based on competency gaps
    const suggestions = actionTemplates.map((template) => {
      const gap = gaps[template.competencyArea as keyof typeof gaps];
      const priority = gap > 20 ? 'high' : gap > 10 ? 'medium' : 'low';

      // Generate contextual reason
      let reason = '';
      if (gap > 20) {
        reason = `Critical gap: Build ${template.competencyArea.replace(/([A-Z])/g, ' $1').toLowerCase()} skills (${gap} points below target)`;
      } else if (gap > 10) {
        reason = `Moderate gap: Strengthen ${template.competencyArea.replace(/([A-Z])/g, ' $1').toLowerCase()} capabilities (${gap} points to target)`;
      } else {
        reason = `Maintain excellence: Continue ${template.competencyArea.replace(/([A-Z])/g, ' $1').toLowerCase()} progress`;
      }

      return {
        id: template.type,
        ...template,
        potentialPoints: template.basePoints,
        priority: priority as 'high' | 'medium' | 'low',
        reason
      };
    });

    // Sort by priority and competency gap
    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.competencyGain - a.competencyGain;
    }).slice(0, 5);
  };

  // Initialize scores and suggestions
  useEffect(() => {
    const scores = propScores || competencyScores;
    setCompetencyScores(scores);
    setSuggestions(generateSuggestions(scores));
  }, [propScores]);

  // Handle track action
  const handleTrackAction = (action: SuggestedAction) => {
    if (onTrackAction) {
      onTrackAction(action);
    } else {
      console.log('Track action:', action);
      // In production, this would open a tracking modal
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      high: 'text-red-400 bg-red-900/20 border-red-500/30',
      medium: 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30',
      low: 'text-green-400 bg-green-900/20 border-green-500/30'
    };
    return colors[priority] || colors.medium;
  };

  // Get priority label
  const getPriorityLabel = (priority: string): string => {
    const labels: Record<string, string> = {
      high: 'High Priority',
      medium: 'Medium Priority',
      low: 'Maintain'
    };
    return labels[priority] || 'Medium Priority';
  };

  // Calculate diversification score
  const getDiversificationMessage = (): { message: string; color: string } => {
    const scores = competencyScores;
    const values = Object.values(scores);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev < 5) {
      return {
        message: 'Excellent balance across all competency areas',
        color: 'text-green-400'
      };
    } else if (stdDev < 10) {
      return {
        message: 'Good diversification with minor gaps to address',
        color: 'text-blue-400'
      };
    } else {
      return {
        message: 'Focus on balanced development across all areas',
        color: 'text-yellow-400'
      };
    }
  };

  const diversification = getDiversificationMessage();

  return (
    <motion.div
      className={`bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/30 to-purple-900/30 border-b border-gray-800 p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-bold text-white">Suggested Actions</h3>
          <Lightbulb className="w-6 h-6 text-green-400" />
        </div>
        <p className="text-sm text-gray-400">Personalized recommendations based on your competency development</p>
      </div>

      <div className="p-6 space-y-4">
        {/* Diversification Insight */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">Competency Balance</span>
            <span className={`text-xs font-medium ${diversification.color}`}>
              {diversification.message}
            </span>
          </div>

          {/* Competency Bars */}
          <div className="space-y-2">
            {Object.entries(competencyScores).map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-white font-medium">{value}/75</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      key === 'customerAnalysis' ? 'bg-blue-500' :
                      key === 'valueCommunication' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(value / 75) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Actions List */}
        <div className="space-y-3">
          <AnimatePresence>
            {suggestions.map((action, index) => {
              const IconComponent = action.icon;
              const isExpanded = expandedItem === action.id;

              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors"
                >
                  {/* Priority Badge */}
                  <div className={`absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(action.priority)}`}>
                    {getPriorityLabel(action.priority)}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-green-400" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-24">
                        <h4 className="text-sm font-medium text-white mb-1">{action.name}</h4>

                        {/* Metadata */}
                        <div className="flex items-center space-x-3 text-xs text-gray-400 mb-2">
                          <span className="flex items-center space-x-1">
                            <Award className="w-3 h-3" />
                            <span className="text-green-400 font-medium">+{action.potentialPoints}</span>
                            <span>points</span>
                          </span>
                          <span>•</span>
                          <span>{action.timeEstimate}</span>
                        </div>

                        {/* Reason */}
                        <p className="text-xs text-gray-400 mb-3">
                          {action.reason}
                        </p>

                        {/* Expandable Description */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mb-3 pt-3 border-t border-gray-700"
                            >
                              <p className="text-sm text-gray-300">{action.description}</p>
                              <div className="mt-2 text-xs text-gray-400">
                                <span className="font-medium">Competency Gain:</span> +{action.competencyGain} points in {action.competencyArea.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleTrackAction(action)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded text-xs font-medium transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Track Action</span>
                          </button>

                          <button
                            onClick={() => setExpandedItem(isExpanded ? null : action.id)}
                            className="px-3 py-1.5 text-gray-400 hover:text-white text-xs transition-colors"
                          >
                            {isExpanded ? 'Show Less' : 'Learn More'}
                          </button>
                        </div>
                      </div>

                      {/* Chevron */}
                      <ChevronRight className="w-4 h-4 text-gray-600 absolute top-4 right-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Growth Insight */}
        <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Target className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-400 font-medium mb-1">Balanced Growth Strategy</p>
              <p className="text-green-300 text-sm">
                Focus on your highest-priority actions to close competency gaps.
                Aim for balanced development across customer analysis, value communication,
                and sales execution to build comprehensive revenue capabilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SuggestedActionsWidget;
