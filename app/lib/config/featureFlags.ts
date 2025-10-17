// Feature Flag Configuration for Enterprise Platform in MVP Mode
// Allows selective activation of enterprise features based on environment

export interface FeatureFlags {
  // Core MVP Configuration
  MVP_MODE: boolean;
  
  // Analytics & Reporting
  ADVANCED_ANALYTICS: boolean;
  BEHAVIORAL_INTELLIGENCE: boolean;
  REAL_TIME_ORCHESTRATION: boolean;
  PREDICTIVE_INSIGHTS: boolean;
  
  // Automation & AI
  AUTO_AGENT_SPAWNING: boolean;
  INTELLIGENT_WORKFLOW_OPTIMIZATION: boolean;
  AUTOMATED_INTERVENTION: boolean;
  
  // Enterprise Features
  MULTI_TENANT_SCALING: boolean;
  ADVANCED_EXPORT_FORMATS: boolean;
  STAKEHOLDER_MAPPING: boolean;
  PROFESSIONAL_DEVELOPMENT_TRACKING: boolean;
  
  // Infrastructure
  COMPLEX_DATABASE_OPERATIONS: boolean;
  ADVANCED_ERROR_RECOVERY: boolean;
  PERFORMANCE_MONITORING: boolean;
}

// Environment-based feature flag configuration
export const FEATURE_FLAGS: FeatureFlags = {
  // Core MVP Configuration
  MVP_MODE: process.env.NEXT_PUBLIC_MVP_MODE === 'true',
  
  // Analytics & Reporting (disabled in MVP for simplicity)
  ADVANCED_ANALYTICS: process.env.NEXT_PUBLIC_ADVANCED_ANALYTICS === 'true' && process.env.NEXT_PUBLIC_MVP_MODE !== 'true',
  BEHAVIORAL_INTELLIGENCE: process.env.NEXT_PUBLIC_BEHAVIORAL_INTELLIGENCE === 'true' && process.env.NEXT_PUBLIC_MVP_MODE !== 'true',
  REAL_TIME_ORCHESTRATION: process.env.NEXT_PUBLIC_REAL_TIME_ORCHESTRATION === 'true' && process.env.NEXT_PUBLIC_MVP_MODE !== 'true',
  PREDICTIVE_INSIGHTS: process.env.NEXT_PUBLIC_PREDICTIVE_INSIGHTS === 'true' && process.env.NEXT_PUBLIC_MVP_MODE !== 'true',
  
  // Automation & AI (manual mode in MVP)
  AUTO_AGENT_SPAWNING: process.env.NEXT_PUBLIC_AUTO_AGENT_SPAWNING === 'true' && process.env.NEXT_PUBLIC_MVP_MODE !== 'true',
  INTELLIGENT_WORKFLOW_OPTIMIZATION: process.env.NEXT_PUBLIC_INTELLIGENT_OPTIMIZATION === 'true' && process.env.NEXT_PUBLIC_MVP_MODE !== 'true',
  AUTOMATED_INTERVENTION: process.env.NEXT_PUBLIC_AUTOMATED_INTERVENTION === 'true' && process.env.NEXT_PUBLIC_MVP_MODE !== 'true',
  
  // Enterprise Features (simplified in MVP)
  MULTI_TENANT_SCALING: process.env.NEXT_PUBLIC_MULTI_TENANT === 'true' && process.env.NEXT_PUBLIC_MVP_MODE !== 'true',
  ADVANCED_EXPORT_FORMATS: process.env.NEXT_PUBLIC_ADVANCED_EXPORTS === 'true' && process.env.NEXT_PUBLIC_MVP_MODE !== 'true',
  STAKEHOLDER_MAPPING: process.env.NEXT_PUBLIC_STAKEHOLDER_MAPPING === 'true' && process.env.NEXT_PUBLIC_MVP_MODE !== 'true',
  PROFESSIONAL_DEVELOPMENT_TRACKING: process.env.NEXT_PUBLIC_PROF_DEV_TRACKING === 'true' && process.env.NEXT_PUBLIC_MVP_MODE !== 'true',
  
  // Infrastructure (simplified in MVP)
  COMPLEX_DATABASE_OPERATIONS: process.env.NEXT_PUBLIC_COMPLEX_DB === 'true' && process.env.NEXT_PUBLIC_MVP_MODE !== 'true',
  ADVANCED_ERROR_RECOVERY: process.env.NEXT_PUBLIC_ADVANCED_ERROR_RECOVERY === 'true' && process.env.NEXT_PUBLIC_MVP_MODE !== 'true',
  PERFORMANCE_MONITORING: process.env.NEXT_PUBLIC_PERFORMANCE_MONITORING === 'true' && process.env.NEXT_PUBLIC_MVP_MODE !== 'true'
};

// Configuration modes based on feature flags
export const CONFIG_MODES = {
  // Orchestration Configuration
  ORCHESTRATION_MODE: FEATURE_FLAGS.MVP_MODE ? 'manual' : 'automated',
  REPORTING_FREQUENCY: FEATURE_FLAGS.MVP_MODE ? 'daily' : 'real-time',
  INTERVENTION_TYPE: FEATURE_FLAGS.MVP_MODE ? 'email-alert' : 'automated',
  
  // Analytics Configuration
  ANALYTICS_DEPTH: FEATURE_FLAGS.MVP_MODE ? 'basic' : 'comprehensive',
  DASHBOARD_COMPLEXITY: FEATURE_FLAGS.MVP_MODE ? 'simplified' : 'advanced',
  
  // Export Configuration
  EXPORT_FORMATS: FEATURE_FLAGS.MVP_MODE ? ['pdf'] : ['pdf', 'docx', 'pptx', 'csv', 'json'],
  RESOURCE_TIERS: FEATURE_FLAGS.MVP_MODE ? ['core'] : ['core', 'advanced', 'strategic'],
  
  // User Experience Configuration
  ONBOARDING_COMPLEXITY: FEATURE_FLAGS.MVP_MODE ? 'streamlined' : 'comprehensive',
  FEATURE_DISCOVERY: FEATURE_FLAGS.MVP_MODE ? 'guided' : 'self-service'
};

// Utility functions for feature checking
export const featureUtils = {
  // Check if MVP mode is active
  isMVPMode: (): boolean => FEATURE_FLAGS.MVP_MODE,
  
  // Check if enterprise features are available
  isEnterpriseMode: (): boolean => !FEATURE_FLAGS.MVP_MODE,
  
  // Get configuration for a specific feature
  getFeatureConfig: (featureName: keyof FeatureFlags): boolean => {
    return FEATURE_FLAGS[featureName];
  },
  
  // Get orchestration mode
  getOrchestrationMode: (): 'manual' | 'automated' => (CONFIG_MODES.ORCHESTRATION_MODE as any),
  
  // Get analytics configuration
  getAnalyticsConfig: () => ({
    depth: CONFIG_MODES.ANALYTICS_DEPTH,
    dashboardType: CONFIG_MODES.DASHBOARD_COMPLEXITY,
    reportingFrequency: CONFIG_MODES.REPORTING_FREQUENCY
  }),
  
  // Get export configuration
  getExportConfig: () => ({
    formats: CONFIG_MODES.EXPORT_FORMATS,
    tiers: CONFIG_MODES.RESOURCE_TIERS
  }),
  
  // Check if feature should be displayed
  shouldShowFeature: (featureName: keyof FeatureFlags): boolean => {
    return FEATURE_FLAGS[featureName];
  },
  
  // Get user experience configuration
  getUXConfig: () => ({
    onboardingType: CONFIG_MODES.ONBOARDING_COMPLEXITY,
    featureDiscovery: CONFIG_MODES.FEATURE_DISCOVERY
  })
};

// Environment validation
export const validateEnvironment = (): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} => {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Check if MVP mode is properly configured
  if (typeof process.env.NEXT_PUBLIC_MVP_MODE === 'undefined') {
    warnings.push('NEXT_PUBLIC_MVP_MODE not set - defaulting to false');
  }
  
  // Validate environment consistency
  if (FEATURE_FLAGS.MVP_MODE && FEATURE_FLAGS.ADVANCED_ANALYTICS) {
    warnings.push('MVP mode enabled but advanced analytics also enabled - analytics will be disabled');
  }
  
  if (FEATURE_FLAGS.MVP_MODE && FEATURE_FLAGS.AUTO_AGENT_SPAWNING) {
    warnings.push('MVP mode enabled but auto agent spawning also enabled - spawning will be disabled');
  }
  
  return {
    isValid: errors.length === 0,
    warnings,
    errors
  };
};

// Development utilities
export const devUtils = {
  // Log current feature flag configuration
  logFeatureFlags: (): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 Feature Flags Configuration:', {
        mode: FEATURE_FLAGS.MVP_MODE ? 'MVP' : 'Enterprise',
        flags: FEATURE_FLAGS,
        config: CONFIG_MODES
      });
    }
  },
  
  // Get feature flag summary for debugging
  getFeatureSummary: () => ({
    mode: FEATURE_FLAGS.MVP_MODE ? 'MVP' : 'Enterprise',
    activeFeatures: Object.entries(FEATURE_FLAGS)
      .filter(([_, enabled]) => enabled)
      .map(([feature]) => feature),
    configModes: CONFIG_MODES
  })
};

// Initialize feature flags logging in development
if (process.env.NODE_ENV === 'development') {
  devUtils.logFeatureFlags();
  
  const validation = validateEnvironment();
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Feature Flag Warnings:', validation.warnings);
  }
  if (validation.errors.length > 0) {
    console.error('❌ Feature Flag Errors:', validation.errors);
  }
}

export default FEATURE_FLAGS;