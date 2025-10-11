'use client';

/**
 * FeatureUnlockModal.tsx
 *
 * Celebration modal displayed when users unlock new platform features
 * based on competency achievements. Shows feature details, benefits,
 * and encourages exploration with animated celebration effects.
 *
 * @module FeatureUnlockModal
 * @version 1.0.0
 */

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CompetencyArea } from '@/app/lib/services/TaskRecommendationEngine';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface UnlockedFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'ICP Intelligence' | 'Value Communication' | 'Implementation' | 'Advanced Tools';
  competencyRequired: {
    area: CompetencyArea;
    level: number;
  };
  benefits: string[];
  actionLabel?: string;
  actionUrl?: string;
}

export interface FeatureUnlockModalProps {
  feature: UnlockedFeature | null;
  isOpen: boolean;
  onClose: () => void;
  onExplore?: (feature: UnlockedFeature) => void;
  className?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getCategoryColor(category: UnlockedFeature['category']): {
  bg: string;
  text: string;
  border: string;
  gradient: string;
} {
  const colors: Record<
    UnlockedFeature['category'],
    { bg: string; text: string; border: string; gradient: string }
  > = {
    'ICP Intelligence': {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      gradient: 'from-blue-500 to-blue-600'
    },
    'Value Communication': {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/30',
      gradient: 'from-green-500 to-green-600'
    },
    Implementation: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      gradient: 'from-purple-500 to-purple-600'
    },
    'Advanced Tools': {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      gradient: 'from-yellow-500 to-yellow-600'
    }
  };
  return colors[category];
}

function getCompetencyDisplay(area: CompetencyArea): {
  name: string;
  icon: string;
  color: string;
} {
  const display: Record<CompetencyArea, { name: string; icon: string; color: string }> = {
    customerAnalysis: {
      name: 'Customer Analysis',
      icon: '👥',
      color: 'text-blue-400'
    },
    valueCommunication: {
      name: 'Value Communication',
      icon: '💬',
      color: 'text-green-400'
    },
    executiveReadiness: {
      name: 'Executive Readiness',
      icon: '🎯',
      color: 'text-purple-400'
    }
  };
  return display[area];
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function FeatureUnlockModal({
  feature,
  isOpen,
  onClose,
  onExplore,
  className = ''
}: FeatureUnlockModalProps) {
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

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleExplore = useCallback(() => {
    if (feature && onExplore) {
      onExplore(feature);
    }
    onClose();
  }, [feature, onExplore, onClose]);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  if (!feature) return null;

  const categoryColors = getCategoryColor(feature.category);
  const competencyDisplay = getCompetencyDisplay(feature.competencyRequired.area);

  // Confetti particles configuration
  const confettiCount = 50;
  const confettiParticles = Array.from({ length: confettiCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    rotation: Math.random() * 360,
    color: ['#60A5FA', '#34D399', '#A78BFA', '#FBBF24'][Math.floor(Math.random() * 4)]
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        >
          {/* Confetti Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confettiParticles.map(particle => (
              <motion.div
                key={particle.id}
                initial={{
                  y: -20,
                  x: `${particle.x}%`,
                  opacity: 1,
                  rotate: 0
                }}
                animate={{
                  y: '100vh',
                  opacity: 0,
                  rotate: particle.rotation
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: 'linear'
                }}
                className="absolute w-3 h-3 rounded-sm"
                style={{ backgroundColor: particle.color }}
              />
            ))}
          </div>

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-200 z-10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header Section */}
            <div className="relative p-8 text-center border-b border-gray-800">
              {/* Celebration Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                className="inline-block mb-4"
              >
                <div
                  className={`w-24 h-24 rounded-full bg-gradient-to-br ${categoryColors.gradient} flex items-center justify-center text-5xl shadow-2xl`}
                >
                  {feature.icon}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  🎉 Feature Unlocked!
                </h2>
                <h1 className="text-3xl font-bold text-gray-100 mb-3">{feature.name}</h1>
                <p className="text-lg text-gray-400 max-w-xl mx-auto">
                  {feature.description}
                </p>
              </motion.div>
            </div>

            {/* Achievement Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-gray-800/50 border-b border-gray-800"
            >
              <div className="flex items-center justify-center gap-4">
                <div
                  className={`px-4 py-2 rounded-lg border ${categoryColors.bg} ${categoryColors.text} ${categoryColors.border}`}
                >
                  {feature.category}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
                  <span className="text-xl">{competencyDisplay.icon}</span>
                  <span className={`text-sm font-medium ${competencyDisplay.color}`}>
                    {competencyDisplay.name}
                  </span>
                  <span className="text-sm text-gray-400">
                    Level {feature.competencyRequired.level}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Benefits Section */}
            <div className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-xl font-semibold text-gray-200 mb-4">
                  What You Can Do Now:
                </h3>
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-1">
                        <svg
                          className={`w-5 h-5 ${categoryColors.text}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-300 flex-1">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Action Section */}
            <div className="p-8 pt-4 border-t border-gray-800">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleExplore}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r ${categoryColors.gradient} hover:shadow-lg transition-all`}
                >
                  {feature.actionLabel || 'Explore Feature'} →
                </button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center text-sm text-gray-500 mt-4"
              >
                Keep completing tasks to unlock more features!
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
