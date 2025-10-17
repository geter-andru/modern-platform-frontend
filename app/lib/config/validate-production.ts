/**
 * Production Readiness Validation
 *
 * Validates that all required services are configured before production deployment.
 * FAILS deployment if critical services are missing (email, database, storage).
 *
 * INTEGRATION: Part of Production Readiness Plan Phase 1
 * See: /PRODUCTION_READINESS_PLAN_2025-10-12.md
 *
 * Usage:
 * - Import and run in app initialization (e.g., layout.tsx, middleware)
 * - Add to CI/CD pipeline as pre-deployment check
 * - Monitor via admin dashboard
 */

export interface ValidationResult {
  ready: boolean;
  errors: string[];
  warnings: string[];
  environment: string;
  timestamp: string;
}

export interface ServiceStatus {
  name: string;
  configured: boolean;
  required: boolean;
  message: string;
}

/**
 * Validate production readiness
 *
 * Checks all critical services and environment variables.
 * Returns validation result with errors and warnings.
 */
export function validateProductionReadiness(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const env = process.env.NODE_ENV || 'development';

  // Only run strict validation in production
  if (env !== 'production') {
    return {
      ready: true,
      errors: [],
      warnings: ['Running in development mode - production checks skipped'],
      environment: env,
      timestamp: new Date().toISOString()
    };
  }

  // ============================================================================
  // CRITICAL CHECKS (deployment-blocking)
  // ============================================================================

  // 1. Database Configuration
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    errors.push('❌ SUPABASE_URL not configured - database will not work');
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    errors.push('❌ SUPABASE_ANON_KEY not configured - authentication will fail');
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    errors.push('❌ SUPABASE_SERVICE_ROLE_KEY not configured - backend operations will fail');
  }

  // 2. Email Service Configuration
  if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY.includes('your_')) {
    errors.push('❌ Email service not configured - users will NOT receive emails (notifications, welcome emails, reports)');
  }

  if (!process.env.FROM_EMAIL) {
    warnings.push('⚠️  FROM_EMAIL not set - emails will use default sender');
  }

  // 3. File Storage Configuration (for exports)
  const hasS3 = process.env.AWS_S3_BUCKET && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;
  const hasGCS = process.env.GCS_BUCKET && process.env.GCS_PROJECT_ID;

  if (!hasS3 && !hasGCS) {
    errors.push('❌ File storage not configured (AWS S3 or GCS) - export downloads will fail with 404 errors');
  }

  // 4. Claude AI Configuration
  if (!process.env.ANTHROPIC_API_KEY && !process.env.CLAUDE_API_KEY) {
    errors.push('❌ Claude API key not configured - ICP and Business Case generation will fail');
  }

  // ============================================================================
  // WARNING CHECKS (non-blocking but important)
  // ============================================================================

  // 5. API Key Quality Checks
  if (process.env.ANTHROPIC_API_KEY?.includes('demo') || process.env.CLAUDE_API_KEY?.includes('demo')) {
    warnings.push('⚠️  Using demo Claude API key - rate limits may apply, production use not recommended');
  }

  if (process.env.SENDGRID_API_KEY?.startsWith('SG.test')) {
    warnings.push('⚠️  Using test SendGrid API key - emails may not deliver reliably');
  }

  // 6. Backend URL Configuration
  if (!process.env.NEXT_PUBLIC_BACKEND_URL && !process.env.BACKEND_URL) {
    warnings.push('⚠️  BACKEND_URL not configured - will use relative URLs (may fail in some deployments)');
  }

  // 7. Monitoring Configuration
  if (!process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN) {
    warnings.push('⚠️  Sentry not configured - error monitoring disabled');
  }

  // 8. Analytics Configuration
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    warnings.push('⚠️  Google Analytics not configured - usage tracking disabled');
  }

  // 9. Authentication Configuration
  if (!process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
    warnings.push('⚠️  NEXTAUTH_SECRET not set - session security may be compromised');
  }

  // 10. CORS Configuration
  if (!process.env.NEXT_PUBLIC_APP_URL && !process.env.VERCEL_URL) {
    warnings.push('⚠️  APP_URL not configured - CORS issues may occur');
  }

  return {
    ready: errors.length === 0,
    errors,
    warnings,
    environment: env,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get detailed service status
 *
 * Returns status of all services for admin dashboard
 */
export function getServiceStatus(): ServiceStatus[] {
  return [
    {
      name: 'Supabase Database',
      configured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      required: true,
      message: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Connected' : 'Not configured'
    },
    {
      name: 'Email Delivery (SendGrid)',
      configured: !!(process.env.SENDGRID_API_KEY && !process.env.SENDGRID_API_KEY.includes('your_')),
      required: true,
      message: process.env.SENDGRID_API_KEY ? 'Configured' : 'Not configured'
    },
    {
      name: 'File Storage (AWS S3)',
      configured: !!(process.env.AWS_S3_BUCKET && process.env.AWS_ACCESS_KEY_ID),
      required: true,
      message: process.env.AWS_S3_BUCKET ? `Bucket: ${process.env.AWS_S3_BUCKET}` : 'Not configured'
    },
    {
      name: 'Claude AI',
      configured: !!(process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY),
      required: true,
      message: (process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY) ? 'API key present' : 'Not configured'
    },
    {
      name: 'Error Monitoring (Sentry)',
      configured: !!(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN),
      required: false,
      message: (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN) ? 'Configured' : 'Optional - not configured'
    },
    {
      name: 'Analytics (Google Analytics)',
      configured: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      required: false,
      message: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? 'Tracking enabled' : 'Optional - not configured'
    }
  ];
}

/**
 * Throw error if production readiness check fails
 *
 * Use this in app initialization to prevent deployment with missing services
 */
export function assertProductionReady(): void {
  const validation = validateProductionReadiness();

  if (!validation.ready) {
    const errorMessage = [
      '❌ PRODUCTION READINESS CHECK FAILED',
      '',
      'The following critical services are not configured:',
      ...validation.errors.map(err => `  ${err}`),
      '',
      'Deployment blocked. Configure missing services before deploying to production.',
      '',
      'See /PRODUCTION_READINESS_PLAN_2025-10-12.md for setup instructions.'
    ].join('\n');

    console.error(errorMessage);
    throw new Error('Production deployment blocked - see console for details');
  }

  if (validation.warnings.length > 0) {
    console.warn('⚠️  PRODUCTION WARNINGS:');
    validation.warnings.forEach(warn => console.warn(`  ${warn}`));
  }
}

/**
 * Log production readiness status
 *
 * Non-throwing version for monitoring and logging
 */
export function logProductionReadiness(): ValidationResult {
  const validation = validateProductionReadiness();

  if (validation.environment === 'production') {
    if (validation.ready) {
      console.log('✅ Production readiness check passed');
      if (validation.warnings.length > 0) {
        console.warn('⚠️  Production warnings:');
        validation.warnings.forEach(warn => console.warn(`  ${warn}`));
      }
    } else {
      console.error('❌ Production readiness check FAILED:');
      validation.errors.forEach(err => console.error(`  ${err}`));
    }
  } else {
    console.log(`🔧 Running in ${validation.environment} mode (production checks skipped)`);
  }

  return validation;
}

/**
 * Get environment variable summary for debugging
 *
 * SECURITY: Only shows if variables are present/absent, not actual values
 */
export function getEnvironmentSummary(): Record<string, 'configured' | 'missing' | 'invalid'> {
  return {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'configured' : 'missing',
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY?.includes('your_') ? 'invalid' : (process.env.SENDGRID_API_KEY ? 'configured' : 'missing'),
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET ? 'configured' : 'missing',
    CLAUDE_API_KEY: (process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY) ? 'configured' : 'missing',
    SENTRY_DSN: (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN) ? 'configured' : 'missing',
  };
}

// Auto-run validation on import in production
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  // Server-side only, don't run in browser
  try {
    logProductionReadiness();
  } catch (error) {
    console.error('Production validation failed on startup:', error);
  }
}
