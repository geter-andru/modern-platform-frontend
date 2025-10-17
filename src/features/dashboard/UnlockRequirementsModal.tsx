'use client';

/**
 * Unlock Requirements Modal
 * 
 * Professional modal explaining tool unlock requirements with progress tracking
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Lock, Target, TrendingUp, BarChart3, 
  ArrowRight, CheckCircle, Clock, Star, LucideIcon 
} from 'lucide-react';

// TypeScript interfaces
interface CompetencyData {
  currentCustomerAnalysis: number;
  currentValueCommunication: number;
  currentSalesExecution: number;
}

interface Tool {
  label: string;
  description: string;
  requirementCategory?: 'customerAnalysis' | 'valueCommunication' | 'salesExecution';
  requirementScore?: number;
  requirementLevel?: string;
}

interface DevelopmentStep {
  id: number;
  title: string;
  description: string;
  points: string;
  timeEstimate: string;
}

interface UnlockRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool | null;
  competencyData: CompetencyData;
}

const UnlockRequirementsModal: React.FC<UnlockRequirementsModalProps> = ({ 
  isOpen, 
  onClose, 
  tool, 
  competencyData 
}) => {
  if (!isOpen || !tool) return null;

  // Get current score for requirement category
  const getCurrentScore = (category: Tool['requirementCategory']): number => {
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
  };

  // Get category display name
  const getCategoryDisplayName = (category: Tool['requirementCategory']): string => {
    if (!category) return 'General';
    
    switch (category) {
      case 'customerAnalysis':
        return 'Customer Analysis';
      case 'valueCommunication':
        return 'Value Communication';
      case 'salesExecution':
        return 'Sales Execution';
      default:
        return category;
    }
  };

  // Get category icon
  const getCategoryIcon = (category: Tool['requirementCategory']): LucideIcon => {
    if (!category) return Target;
    
    switch (category) {
      case 'customerAnalysis':
        return Target;
      case 'valueCommunication':
        return TrendingUp;
      case 'salesExecution':
        return BarChart3;
      default:
        return Target;
    }
  };

  // Calculate progress and requirements
  const currentScore = tool.requirementCategory ? getCurrentScore(tool.requirementCategory) : 0;
  const requiredScore = tool.requirementScore || 70;
  const progressPercentage = Math.min(100, (currentScore / requiredScore) * 100);
  const pointsNeeded = Math.max(0, requiredScore - currentScore);
  
  const CategoryIcon = tool.requirementCategory ? getCategoryIcon(tool.requirementCategory) : Lock;

  // Professional development steps to reach requirement
  const developmentSteps: DevelopmentStep[] = [
    {
      id: 1,
      title: 'Engage with Platform Content',
      description: 'Complete sections and interact with tools',
      points: '10-25 points per action',
      timeEstimate: '5-15 minutes each'
    },
    {
      id: 2,
      title: 'Practice with Sample Data',
      description: 'Use interactive features and calculators',
      points: '25-50 points per session',
      timeEstimate: '15-30 minutes'
    },
    {
      id: 3,
      title: 'Complete Real-World Actions',
      description: 'Apply learnings to actual business scenarios',
      points: '75-300 points per action',
      timeEstimate: '1-4 hours'
    }
  ];

  // Recommended actions based on tool type
  const getRecommendedActions = (): string[] => {
    if (!tool.requirementCategory) return [];

    const actionMap: Record<NonNullable<Tool['requirementCategory']>, string[]> = {
      customerAnalysis: [
        'Complete ICP Analysis sections',
        'Rate multiple companies', 
        'Analyze customer segments',
        'Document buyer personas'
      ],
      valueCommunication: [
        'Complete ICP Analysis sections',
        'Rate multiple companies',
        'Create value proposition materials',
        'Document ROI calculations'
      ],
      salesExecution: [
        'Build comprehensive business cases',
        'Practice objection handling scenarios',
        'Schedule real prospect meetings',
        'Complete sales methodology training'
      ]
    };

    return actionMap[tool.requirementCategory] || [];
  };

  const recommendedActions = getRecommendedActions();

  const getProgressBarColor = (percentage: number): string => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
        onClick={handleOverlayClick}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={handleStopPropagation}
          className="bg-black/80 backdrop-blur-lg border border-white/10 shadow-2xl shadow-black/50 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Methodology Locked
                </h2>
                <p className="text-sm text-gray-400">
                  {tool.label} - {tool.description}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Current Progress */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CategoryIcon className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="font-medium text-white">
                    Professional Development Required
                  </h3>
                  <p className="text-sm text-gray-400">
                    Advance your {getCategoryDisplayName(tool.requirementCategory)} competency
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-300">Current Progress</span>
                    <span className="text-white font-medium">
                      {currentScore.toFixed(0)} / {requiredScore} points
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-3 rounded-full ${getProgressBarColor(progressPercentage)}`}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-gray-500">Baseline</span>
                    <span className="text-gray-400">
                      {pointsNeeded > 0 ? `${pointsNeeded.toFixed(0)} points needed` : 'Requirement met!'}
                    </span>
                  </div>
                </div>

                {/* Level Requirement */}
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <div>
                      <div className="text-sm font-medium text-white">
                        Required Level
                      </div>
                      <div className="text-xs text-gray-400">
                        {tool.requirementLevel || 'Professional'}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-yellow-400 font-medium">
                    {requiredScore}+ points
                  </div>
                </div>
              </div>
            </div>

            {/* Development Path */}
            <div>
              <h3 className="font-medium text-white mb-4 flex items-center space-x-2">
                <ArrowRight className="w-5 h-5 text-blue-400" />
                <span>Professional Development Path</span>
              </h3>
              
              <div className="space-y-3">
                {developmentSteps.map((step) => (
                  <div key={step.id} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-blue-300">
                          {step.id}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-400 mb-3">
                          {step.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>{step.points}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{step.timeEstimate}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Actions */}
            {recommendedActions.length > 0 && (
              <div>
                <h3 className="font-medium text-white mb-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Recommended Next Actions</span>
                </h3>
                
                <div className="grid gap-2">
                  {recommendedActions.map((action, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Message */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="font-medium text-blue-300 mb-2">
                Systematic Professional Development
              </h4>
              <p className="text-sm text-blue-100">
                Our competency-based system ensures you build genuine expertise before 
                advancing to more sophisticated methodologies. This approach maximizes 
                your success rate and professional credibility.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-800/50">
            <div className="text-sm text-gray-400">
              Track your progress in the sidebar as you develop competencies
            </div>
            
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              Continue Development
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UnlockRequirementsModal;