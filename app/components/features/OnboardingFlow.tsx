'use client';

/**
 * OnboardingFlow.tsx
 *
 * Multi-step onboarding flow for first-time users. Guides users through
 * platform introduction, feature discovery, and initial setup with
 * interactive step-by-step navigation and progress tracking.
 *
 * @module OnboardingFlow
 * @version 1.0.0
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: React.ReactNode;
  actionLabel?: string;
  skipLabel?: string;
}

export interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip?: () => void;
  steps?: OnboardingStep[];
  className?: string;
}

// ============================================================================
// DEFAULT ONBOARDING STEPS
// ============================================================================

const DEFAULT_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Growth Platform',
    description: 'Accelerate your business with AI-powered guidance',
    icon: '👋',
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 text-lg">
          This platform helps technical founders and engineers transition into business
          leaders by providing:
        </p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="mt-1 text-blue-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-200 mb-1">
                Personalized Task Recommendations
              </h4>
              <p className="text-sm text-gray-400">
                Get AI-powered suggestions based on your business stage and competency levels
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 text-green-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-200 mb-1">
                Progressive Feature Unlocks
              </h4>
              <p className="text-sm text-gray-400">
                Unlock powerful tools as you build competency in key business areas
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 text-purple-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-200 mb-1">Resource Library</h4>
              <p className="text-sm text-gray-400">
                Access curated resources matched to your completed tasks
              </p>
            </div>
          </li>
        </ul>
      </div>
    ),
    actionLabel: 'Get Started'
  },
  {
    id: 'competencies',
    title: 'Build Your Competencies',
    description: 'Track progress across three key business areas',
    icon: '📊',
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">
          Your growth is measured across three competency areas:
        </p>
        <div className="grid gap-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👥</span>
              <h4 className="font-semibold text-blue-400">Customer Analysis</h4>
            </div>
            <p className="text-sm text-gray-400">
              Understanding your ideal customer, market positioning, and customer discovery
            </p>
          </div>
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">💬</span>
              <h4 className="font-semibold text-green-400">Value Communication</h4>
            </div>
            <p className="text-sm text-gray-400">
              Articulating ROI, building business cases, and executive presentations
            </p>
          </div>
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎯</span>
              <h4 className="font-semibold text-purple-400">Executive Readiness</h4>
            </div>
            <p className="text-sm text-gray-400">
              Building scalable processes, team capabilities, and leadership skills
            </p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-400">
            <strong className="text-gray-300">Pro Tip:</strong> Complete tasks to increase
            your competency scores and unlock advanced features!
          </p>
        </div>
      </div>
    ),
    actionLabel: 'Continue'
  },
  {
    id: 'tasks',
    title: 'Your Personalized Tasks',
    description: 'Complete tasks tailored to your business stage',
    icon: '✅',
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">
          Tasks are recommended based on your current milestone and competency gaps:
        </p>
        <div className="space-y-3">
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-200">Priority Levels</h4>
              <div className="flex gap-2">
                <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded">
                  Critical
                </span>
                <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded">
                  High
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Focus on critical and high-priority tasks for maximum impact
            </p>
          </div>
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-200 mb-2">Competency Gain</h4>
            <p className="text-sm text-gray-400">
              Each task completion increases your competency by 5-15% based on priority
            </p>
          </div>
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-200 mb-2">Resource Recommendations</h4>
            <p className="text-sm text-gray-400">
              Get matched resources after completing tasks to deepen your knowledge
            </p>
          </div>
        </div>
      </div>
    ),
    actionLabel: 'Next'
  },
  {
    id: 'features',
    title: 'Unlock Powerful Features',
    description: 'Gain access to advanced tools as you grow',
    icon: '🔓',
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">
          Build competency to unlock premium features:
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-sm font-medium text-gray-200 mb-1">
              Advanced Analytics
            </div>
            <div className="text-xs text-gray-400">At 50% competency</div>
          </div>
          <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-sm font-medium text-gray-200 mb-1">ROI Calculator</div>
            <div className="text-xs text-gray-400">At 40% competency</div>
          </div>
          <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-sm font-medium text-gray-200 mb-1">
              Business Case Builder
            </div>
            <div className="text-xs text-gray-400">At 60% competency</div>
          </div>
          <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-sm font-medium text-gray-200 mb-1">
              Team Collaboration
            </div>
            <div className="text-xs text-gray-400">At 50% competency</div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-gray-300">
            <strong>Ready to start?</strong> Complete your first task to begin building
            competency!
          </p>
        </div>
      </div>
    ),
    actionLabel: 'Start My Journey'
  }
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function OnboardingFlow({
  isOpen,
  onComplete,
  onSkip,
  steps = DEFAULT_STEPS,
  className = ''
}: OnboardingFlowProps) {
  // State
  const [currentStep, setCurrentStep] = useState(0);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  }, [currentStep, steps.length, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  }, [onSkip, onComplete]);

  const handleStepClick = useCallback((index: number) => {
    setCurrentStep(index);
  }, []);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  if (!isOpen) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.90)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          />
        </div>

        {/* Header */}
        <div className="p-8 pb-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                key={step.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
              >
                {step.icon}
              </motion.div>
              <div>
                <motion.h2
                  key={`title-${step.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-gray-100"
                >
                  {step.title}
                </motion.h2>
                <motion.p
                  key={`desc-${step.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-400"
                >
                  {step.description}
                </motion.p>
              </div>
            </div>

            {/* Skip Button */}
            {onSkip && !isLastStep && (
              <button
                onClick={handleSkip}
                className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
              >
                Skip tour
              </button>
            )}
          </div>

          {/* Step Indicators */}
          <div className="flex gap-2">
            {steps.map((s, index) => (
              <button
                key={s.id}
                onClick={() => handleStepClick(index)}
                className={`flex-1 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-blue-500'
                    : index < currentStep
                    ? 'bg-blue-500/50'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-8 pt-6 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center justify-between">
            {/* Step Counter */}
            <div className="text-sm text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {!isFirstStep && (
                <button
                  onClick={handlePrevious}
                  className="px-6 py-3 rounded-lg font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  ← Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg transition-all"
              >
                {step.actionLabel || (isLastStep ? 'Get Started' : 'Next')} →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
