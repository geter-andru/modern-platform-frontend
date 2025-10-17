/**
 * Feature Flag System
 *
 * Controls which features are enabled in production vs development.
 * Prevents incomplete mock features from showing to production users.
 *
 * INTEGRATION: Part of Production Readiness Plan Phase 1
 * See: /PRODUCTION_READINESS_PLAN_2025-10-12.md
 */

export interface FeatureFlags {
  // TIER 4 features (intentionally deferred)
  weeklyTargetAccounts: boolean;      // Real prospecting requires Puppeteer MCP integration

  // Features with partial implementation (generation works, retrieval mocked)
  icpHistory: boolean;                // Generation works, history retrieval mocked
  businessCaseHistory: boolean;       // Generation works, history retrieval mocked
  costCalculatorHistory: boolean;     // Calculation works, frontend history mocked
  exportDownloads: boolean;           // Backend generates, download URLs 404

  // Infrastructure features
  emailNotifications: boolean;        // Requires SendGrid/AWS SES configuration
  recentActivityFeed: boolean;        // Needs real-time activity integration
}

/**
 * Production Feature Flags
 *
 * Conservative settings - only enable features that work end-to-end.
 * Hide incomplete features to prevent user confusion.
 */
const PRODUCTION_FEATURES: FeatureFlags = {
  // TIER 4 - Show "Coming Soon" instead of mock data
  weeklyTargetAccounts: false,        // TIER 4 - Intentional deferral (40-60 hours work)

  // Hide incomplete retrieval features (generation works!)
  icpHistory: false,                  // Hide history tab until retrieval implemented (Week 5)
  businessCaseHistory: false,         // Hide history tab until retrieval implemented (Week 5)
  costCalculatorHistory: false,       // Hide history tab until frontend fetches backend (Week 5)
  exportDownloads: false,             // Disable download button until backend fixed (Week 6)

  // Infrastructure - check environment variables
  emailNotifications: !!process.env.SENDGRID_API_KEY && !process.env.SENDGRID_API_KEY.includes('your_'),
  recentActivityFeed: false,          // Show empty state until activity tracking integrated (Week 7)
};

/**
 * Development Feature Flags
 *
 * Enable all features for testing, including incomplete ones.
 * Developers need to test mock data flows.
 */
const DEVELOPMENT_FEATURES: FeatureFlags = {
  ...PRODUCTION_FEATURES,
  weeklyTargetAccounts: true,         // Allow in dev for UI testing
  icpHistory: true,                   // Test with mock data in dev
  businessCaseHistory: true,          // Test with mock data in dev
  costCalculatorHistory: true,        // Test with mock data in dev
  exportDownloads: true,              // Test export flow in dev (will 404 but shows UI)
  recentActivityFeed: true,           // Test with mock data in dev
};

/**
 * Get feature flags based on environment
 */
export const features = process.env.NODE_ENV === 'production'
  ? PRODUCTION_FEATURES
  : DEVELOPMENT_FEATURES;

/**
 * Check if a specific feature is enabled
 *
 * @param feature - Feature name to check
 * @returns boolean - true if feature is enabled in current environment
 *
 * @example
 * if (isFeatureEnabled('icpHistory')) {
 *   // Show history tab
 * } else {
 *   // Show "Coming soon" message
 * }
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return features[feature] === true;
}

/**
 * Check if a feature is production-ready
 *
 * @param feature - Feature name to check
 * @returns boolean - true if feature is enabled in production
 *
 * @example
 * if (!isProductionReady('weeklyTargetAccounts')) {
 *   console.warn('Weekly Target Accounts not ready for production');
 * }
 */
export function isProductionReady(feature: keyof FeatureFlags): boolean {
  return PRODUCTION_FEATURES[feature] === true;
}

/**
 * Get list of disabled features in current environment
 *
 * Useful for debugging and admin dashboards
 */
export function getDisabledFeatures(): Array<keyof FeatureFlags> {
  return (Object.keys(features) as Array<keyof FeatureFlags>).filter(
    feature => !features[feature]
  );
}

/**
 * Get feature flag status for all features
 *
 * Useful for admin dashboard and debugging
 */
export function getAllFeatureFlags(): Record<keyof FeatureFlags, boolean> {
  return { ...features };
}

/**
 * Log feature flag status on app startup
 *
 * Helps debug feature flag issues in different environments
 */
export function logFeatureFlags(): void {
  const env = process.env.NODE_ENV;
  const disabled = getDisabledFeatures();

  console.log(`🎯 Feature Flags (${env}):`);

  if (disabled.length > 0) {
    console.log(`   ⚠️  Disabled features (${disabled.length}):`);
    disabled.forEach(feature => {
      console.log(`      - ${feature}`);
    });
  }

  if (env === 'production') {
    const enabledCount = Object.values(features).filter(v => v).length;
    const totalCount = Object.keys(features).length;
    console.log(`   ✅ ${enabledCount}/${totalCount} features enabled in production`);
  }
}

// Auto-log on import in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  logFeatureFlags();
}
