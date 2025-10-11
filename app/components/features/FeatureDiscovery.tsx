'use client';

/**
 * FeatureDiscovery.tsx
 *
 * Showcase component displaying locked platform features with preview
 * information. Motivates users to increase competency levels by showing
 * what features they can unlock and their requirements.
 *
 * @module FeatureDiscovery
 * @version 1.0.0
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type {
  CompetencyArea,
  CompetencyScores
} from '@/app/lib/services/TaskRecommendationEngine';
import type { UnlockedFeature } from './FeatureUnlockModal';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface FeatureDiscoveryProps {
  competencyScores: CompetencyScores;
  unlockedFeatureIds?: string[];
  onFeatureClick?: (feature: UnlockedFeature) => void;
  maxFeatures?: number;
  className?: string;
}

interface FeatureWithStatus extends UnlockedFeature {
  isUnlocked: boolean;
  progressToUnlock: number;
}

// ============================================================================
// FEATURE CATALOG
// ============================================================================

const FEATURE_CATALOG: UnlockedFeature[] = [
  // ICP Intelligence Features
  {
    id: 'icp-advanced-analytics',
    name: 'Advanced ICP Analytics',
    description: 'Deep customer insights with predictive modeling and segmentation analysis',
    icon: '📊',
    category: 'ICP Intelligence',
    competencyRequired: { area: 'customerAnalysis', level: 50 },
    benefits: [
      'AI-powered customer segmentation',
      'Predictive ICP scoring',
      'Market opportunity analysis',
      'Competitive positioning insights'
    ],
    actionLabel: 'Explore Analytics'
  },
  {
    id: 'icp-export-suite',
    name: 'ICP Export Suite',
    description: 'Export ICP data to CRM, sales tools, and analytics platforms',
    icon: '📤',
    category: 'ICP Intelligence',
    competencyRequired: { area: 'customerAnalysis', level: 70 },
    benefits: [
      'CRM integration (Salesforce, HubSpot)',
      'Custom CSV/Excel exports',
      'API access for automation',
      'Scheduled report delivery'
    ],
    actionLabel: 'Configure Exports'
  },

  // Value Communication Features
  {
    id: 'roi-calculator',
    name: 'ROI Calculator',
    description: 'Calculate and present technical ROI with customizable metrics',
    icon: '💰',
    category: 'Value Communication',
    competencyRequired: { area: 'valueCommunication', level: 40 },
    benefits: [
      'Customizable ROI templates',
      'Cost-benefit analysis tools',
      'Stakeholder value mapping',
      'Professional presentation exports'
    ],
    actionLabel: 'Start Calculating'
  },
  {
    id: 'business-case-builder',
    name: 'Business Case Builder',
    description: 'AI-powered business case generation for executive presentations',
    icon: '📈',
    category: 'Value Communication',
    competencyRequired: { area: 'valueCommunication', level: 60 },
    benefits: [
      'AI-generated executive summaries',
      'Financial modeling templates',
      'Risk assessment framework',
      'Multi-format export options'
    ],
    actionLabel: 'Build Case'
  },
  {
    id: 'value-storytelling',
    name: 'Value Storytelling Suite',
    description: 'Create compelling value narratives with data visualization',
    icon: '📖',
    category: 'Value Communication',
    competencyRequired: { area: 'valueCommunication', level: 80 },
    benefits: [
      'Interactive value dashboards',
      'Custom visualization builder',
      'Presentation template library',
      'Brand customization options'
    ],
    actionLabel: 'Create Stories'
  },

  // Implementation Features
  {
    id: 'team-collaboration',
    name: 'Team Collaboration',
    description: 'Multi-user access with role-based permissions and workflows',
    icon: '👥',
    category: 'Implementation',
    competencyRequired: { area: 'executiveReadiness', level: 50 },
    benefits: [
      'Team member invitations',
      'Role-based access control',
      'Collaborative workspaces',
      'Activity tracking and notifications'
    ],
    actionLabel: 'Invite Team'
  },
  {
    id: 'process-automation',
    name: 'Process Automation',
    description: 'Automate repetitive tasks and create custom workflows',
    icon: '⚙️',
    category: 'Implementation',
    competencyRequired: { area: 'executiveReadiness', level: 70 },
    benefits: [
      'Workflow automation builder',
      'Custom trigger configuration',
      'Integration with external tools',
      'Scheduled task execution'
    ],
    actionLabel: 'Automate Workflows'
  },

  // Advanced Tools
  {
    id: 'api-access',
    name: 'API Access',
    description: 'Full programmatic access to platform data and features',
    icon: '🔌',
    category: 'Advanced Tools',
    competencyRequired: { area: 'executiveReadiness', level: 90 },
    benefits: [
      'RESTful API endpoints',
      'Webhook integration',
      'Real-time data sync',
      'Comprehensive API documentation'
    ],
    actionLabel: 'View API Docs'
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getCategoryColor(category: UnlockedFeature['category']): {
  bg: string;
  text: string;
  border: string;
  lockColor: string;
} {
  const colors: Record<
    UnlockedFeature['category'],
    { bg: string; text: string; border: string; lockColor: string }
  > = {
    'ICP Intelligence': {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      lockColor: 'text-blue-500/50'
    },
    'Value Communication': {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/30',
      lockColor: 'text-green-500/50'
    },
    Implementation: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      lockColor: 'text-purple-500/50'
    },
    'Advanced Tools': {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      lockColor: 'text-yellow-500/50'
    }
  };
  return colors[category];
}

function getCompetencyDisplay(area: CompetencyArea): {
  name: string;
  icon: string;
} {
  const display: Record<CompetencyArea, { name: string; icon: string }> = {
    customerAnalysis: { name: 'Customer Analysis', icon: '👥' },
    valueCommunication: { name: 'Value Communication', icon: '💬' },
    executiveReadiness: { name: 'Executive Readiness', icon: '🎯' }
  };
  return display[area];
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function FeatureDiscovery({
  competencyScores,
  unlockedFeatureIds = [],
  onFeatureClick,
  maxFeatures = 8,
  className = ''
}: FeatureDiscoveryProps) {
  // ==========================================================================
  // COMPUTED DATA
  // ==========================================================================

  /**
   * Calculate feature unlock status and progress
   */
  const featuresWithStatus = useMemo<FeatureWithStatus[]>(() => {
    return FEATURE_CATALOG.map(feature => {
      const isUnlocked = unlockedFeatureIds.includes(feature.id);
      const currentCompetency = competencyScores[feature.competencyRequired.area];
      const requiredCompetency = feature.competencyRequired.level;
      const progressToUnlock = Math.min(
        100,
        (currentCompetency / requiredCompetency) * 100
      );

      return {
        ...feature,
        isUnlocked,
        progressToUnlock
      };
    }).slice(0, maxFeatures);
  }, [competencyScores, unlockedFeatureIds, maxFeatures]);

  /**
   * Separate locked and unlocked features
   */
  const { lockedFeatures, unlockedFeatures } = useMemo(() => {
    const locked = featuresWithStatus.filter(f => !f.isUnlocked);
    const unlocked = featuresWithStatus.filter(f => f.isUnlocked);
    return { lockedFeatures: locked, unlockedFeatures: unlocked };
  }, [featuresWithStatus]);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Locked Features Section */}
      {lockedFeatures.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-200 mb-4">
            Unlock New Features
          </h2>
          <p className="text-gray-400 mb-6">
            Complete tasks to increase your competency and unlock powerful features
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedFeatures.map((feature, index) => {
              const categoryColors = getCategoryColor(feature.category);
              const competencyDisplay = getCompetencyDisplay(
                feature.competencyRequired.area
              );

              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative p-6 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-all group"
                >
                  {/* Lock Overlay */}
                  <div className="absolute top-4 right-4">
                    <svg
                      className={`w-6 h-6 ${categoryColors.lockColor}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>

                  {/* Feature Icon */}
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center text-3xl opacity-50 group-hover:opacity-70 transition-opacity">
                      {feature.icon}
                    </div>
                  </div>

                  {/* Feature Info */}
                  <h3 className="text-lg font-semibold text-gray-300 mb-2 group-hover:text-gray-200 transition-colors">
                    {feature.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {feature.description}
                  </p>

                  {/* Category Badge */}
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} border`}
                  >
                    {feature.category}
                  </div>

                  {/* Requirements */}
                  <div className="mb-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">{competencyDisplay.icon}</span>
                      <span className="text-sm text-gray-400">
                        {competencyDisplay.name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      Required: {feature.competencyRequired.level}%
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${feature.progressToUnlock}%` }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                        className={`h-full ${categoryColors.bg} ${categoryColors.border} border-r-2`}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round(feature.progressToUnlock)}% ready
                    </div>
                  </div>

                  {/* Benefits Preview */}
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Includes:</div>
                    <ul className="space-y-1">
                      {feature.benefits.slice(0, 2).map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                          <span className="mt-0.5">•</span>
                          <span className="flex-1">{benefit}</span>
                        </li>
                      ))}
                      {feature.benefits.length > 2 && (
                        <li className="text-xs text-gray-600">
                          +{feature.benefits.length - 2} more features
                        </li>
                      )}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Unlocked Features Section */}
      {unlockedFeatures.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">
            Your Unlocked Features
          </h2>
          <p className="text-gray-400 mb-6">Features you've unlocked and can use</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedFeatures.map((feature, index) => {
              const categoryColors = getCategoryColor(feature.category);

              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onFeatureClick && onFeatureClick(feature)}
                  className="p-6 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-gray-600 transition-all cursor-pointer group"
                >
                  {/* Unlocked Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`${categoryColors.text}`}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Feature Icon */}
                  <div className="mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                  </div>

                  {/* Feature Info */}
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {feature.description}
                  </p>

                  {/* Category Badge */}
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} border`}
                  >
                    {feature.category}
                  </div>

                  {/* Action Button */}
                  <button
                    className={`mt-4 w-full py-2 px-4 rounded-lg font-medium text-sm transition-all ${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} border hover:bg-opacity-80`}
                  >
                    {feature.actionLabel} →
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
