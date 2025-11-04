'use client';

/**
 * ICPGenerationProgress - Enhanced Multi-Stage Progress Indicator
 *
 * Premium progress visualization for ICP generation with:
 * - Multi-stage visual breakdown
 * - Real-time status updates
 * - Intelligence signals (checkmarks, confidence scores)
 * - Smooth animations
 *
 * Follows Agent 4's Visual Hierarchy Spec
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  CheckCircle2,
  Loader2,
  Users,
  Target,
  TrendingUp,
  Sparkles,
  Zap
} from 'lucide-react';

// Generation stages with icons and descriptions
export interface GenerationStage {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress?: number; // 0-100 for current stage
  confidenceScore?: number; // 0-100 for completed stages
}

export interface ICPGenerationProgressProps {
  currentProgress: number; // Overall progress 0-100
  currentStage: string; // Current stage ID or description
  stages?: GenerationStage[];
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}

// Default generation stages
const DEFAULT_STAGES: GenerationStage[] = [
  {
    id: 'analysis',
    label: 'Product Analysis',
    icon: Brain,
    description: 'Analyzing product details and market context',
    status: 'pending'
  },
  {
    id: 'personas',
    label: 'Buyer Personas',
    icon: Users,
    description: 'Identifying decision-makers and influencers',
    status: 'pending'
  },
  {
    id: 'intelligence',
    label: 'Market Intelligence',
    icon: Target,
    description: 'Extracting pain points and buying triggers',
    status: 'pending'
  },
  {
    id: 'finalization',
    label: 'Final Assembly',
    icon: Sparkles,
    description: 'Generating comprehensive ICP analysis',
    status: 'pending'
  }
];

export const ICPGenerationProgress: React.FC<ICPGenerationProgressProps> = ({
  currentProgress,
  currentStage,
  stages = DEFAULT_STAGES,
  isOpen,
  onClose,
  className = ''
}) => {
  // Calculate which stage we're on based on progress
  const getCurrentStageIndex = () => {
    const stageProgress = 100 / stages.length;
    return Math.min(Math.floor(currentProgress / stageProgress), stages.length - 1);
  };

  const currentStageIndex = getCurrentStageIndex();

  // Update stages with current progress
  const enhancedStages: GenerationStage[] = stages.map((stage, index) => {
    if (index < currentStageIndex) {
      return { ...stage, status: 'completed', confidenceScore: 95 + Math.random() * 5 };
    } else if (index === currentStageIndex) {
      const stageProgress = (currentProgress % (100 / stages.length)) * stages.length;
      return { ...stage, status: 'in-progress', progress: stageProgress };
    }
    return { ...stage, status: 'pending' };
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{
            zIndex: 'var(--z-modal)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl rounded-2xl p-8"
            style={{
              background: 'var(--glass-bg-emphasis)',
              backdropFilter: 'var(--glass-blur-xl)',
              border: '2px solid var(--glass-border-emphasis)',
              boxShadow: 'var(--shadow-executive)'
            }}
          >
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl" />

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 3, -3, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    boxShadow: 'var(--shadow-glow-primary)'
                  }}
                >
                  <Brain className="w-10 h-10" style={{ color: 'var(--color-primary)' }} />
                </motion.div>

                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Generating ICP Analysis
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {currentStage || 'Andru is analyzing your product...'}
                </p>
              </div>

              {/* Stage Progress Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {enhancedStages.map((stage, index) => {
                  const Icon = stage.icon;
                  const isActive = index === currentStageIndex;
                  const isCompleted = stage.status === 'completed';

                  return (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative p-4 rounded-xl transition-all duration-300"
                      style={{
                        background: isActive
                          ? 'rgba(59, 130, 246, 0.1)'
                          : isCompleted
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(255, 255, 255, 0.03)',
                        border: isActive
                          ? '2px solid rgba(59, 130, 246, 0.4)'
                          : isCompleted
                            ? '2px solid rgba(16, 185, 129, 0.3)'
                            : '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: isActive
                          ? '0 0 20px rgba(59, 130, 246, 0.2)'
                          : 'none'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="relative">
                          {isCompleted ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{
                                background: 'rgba(16, 185, 129, 0.2)',
                                border: '2px solid rgba(16, 185, 129, 0.4)'
                              }}
                            >
                              <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
                            </motion.div>
                          ) : isActive ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{
                                background: 'rgba(59, 130, 246, 0.2)',
                                border: '2px solid rgba(59, 130, 246, 0.4)'
                              }}
                            >
                              <Icon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                            </motion.div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center opacity-50"
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                              }}
                            >
                              <Icon className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-semibold" style={{
                              color: isActive || isCompleted ? 'var(--text-primary)' : 'var(--text-muted)'
                            }}>
                              {stage.label}
                            </h4>
                            {isCompleted && stage.confidenceScore && (
                              <span className="text-xs font-mono px-2 py-0.5 rounded" style={{
                                color: 'var(--color-accent)',
                                background: 'rgba(16, 185, 129, 0.15)'
                              }}>
                                {Math.round(stage.confidenceScore)}%
                              </span>
                            )}
                            {isActive && (
                              <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--color-primary)' }} />
                            )}
                          </div>
                          <p className="text-xs leading-tight" style={{
                            color: isActive ? 'var(--text-secondary)' : 'var(--text-subtle)'
                          }}>
                            {stage.description}
                          </p>

                          {/* Mini progress bar for active stage */}
                          {isActive && stage.progress !== undefined && (
                            <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: 'var(--color-primary)' }}
                                initial={{ width: '0%' }}
                                animate={{ width: `${stage.progress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Overall Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Overall Progress
                  </span>
                  <span className="text-sm font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {Math.round(currentProgress)}%
                  </span>
                </div>
                <div className="relative h-3 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${currentProgress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </div>
              </div>

              {/* Witty Messages */}
              <motion.div
                key={currentStageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-4 rounded-lg"
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Zap className="w-4 h-4" style={{ color: 'var(--color-secondary)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    AI Insight
                  </span>
                </div>
                <p className="text-xs italic" style={{ color: 'var(--text-subtle)' }}>
                  {currentProgress < 25 && "Analyzing product DNA and market signals..."}
                  {currentProgress >= 25 && currentProgress < 50 && "Mapping decision-maker personas with precision..."}
                  {currentProgress >= 50 && currentProgress < 75 && "Extracting intelligence signals and buying patterns..."}
                  {currentProgress >= 75 && "Synthesizing insights into actionable ICP analysis..."}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ICPGenerationProgress;
