#!/usr/bin/env tsx

/**
 * Environment Validation Script
 *
 * Validates all environment variables at startup using the centralized
 * environment configuration system. Provides clear error messages and
 * exits with appropriate status codes.
 */

import { env } from '../lib/config/environment';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function logSuccess(message: string) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

function logError(message: string) {
  console.log(`${colors.red}✗${colors.reset} ${message}`);
}

function logWarning(message: string) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
}

function logInfo(message: string) {
  console.log(`${colors.blue}ℹ${colors.reset} ${message}`);
}

function logSection(message: string) {
  console.log(`\n${colors.cyan}${message}${colors.reset}`);
}

function maskSecret(value: string, visibleChars: number = 4): string {
  if (value.length <= visibleChars) {
    return '*'.repeat(value.length);
  }
  return value.substring(0, visibleChars) + '*'.repeat(value.length - visibleChars);
}

async function validateEnvironment(): Promise<boolean> {
  console.log('\n🔍 Validating Environment Configuration\n');
  console.log('━'.repeat(60));

  let hasErrors = false;
  let hasWarnings = false;

  try {
    // Environment info
    logSection('Environment Information');
    logSuccess(`Environment: ${env.environment}`);
    logSuccess(`Mode: ${env.isDevelopment ? 'Development' : env.isProduction ? 'Production' : 'Test'}`);

    // Supabase Configuration
    logSection('Supabase Configuration');
    if (env.supabaseUrl && env.supabaseAnonKey) {
      logSuccess(`Supabase URL: ${env.supabaseUrl}`);
      logSuccess(`Supabase Anon Key: ${maskSecret(env.supabaseAnonKey, 10)}`);
      if (env.supabaseServiceRoleKey) {
        logSuccess(`Supabase Service Role Key: ${maskSecret(env.supabaseServiceRoleKey, 10)}`);
      } else {
        logWarning(`Supabase Service Role Key: Not configured (optional in development)`);
      }
    } else {
      if (env.isDevelopment) {
        logWarning(`Supabase not configured (optional in development)`);
        hasWarnings = true;
      } else {
        logError(`Supabase configuration required in ${env.environment}`);
        hasErrors = true;
      }
    }

    // API Keys
    logSection('API Keys');
    if (env.anthropicApiKey) {
      logSuccess(`Anthropic API Key: ${maskSecret(env.anthropicApiKey, 15)}`);
    } else {
      logWarning(`Anthropic API Key: Not configured (optional in development)`);
      hasWarnings = true;
    }

    if (env.airtableApiKey && env.airtableBaseId) {
      logSuccess(`Airtable API Key: ${maskSecret(env.airtableApiKey, 10)}`);
      logSuccess(`Airtable Base ID: ${env.airtableBaseId}`);
    } else {
      logWarning(`Airtable not configured (optional in development)`);
      hasWarnings = true;
    }

    if (env.googleClientId && env.googleClientSecret) {
      logSuccess(`Google Client ID: ${maskSecret(env.googleClientId, 15)}`);
      logSuccess(`Google Client Secret: ${maskSecret(env.googleClientSecret, 8)}`);
    } else {
      logWarning(`Google not configured (optional in development)`);
      hasWarnings = true;
    }

    if (env.githubToken) {
      logSuccess(`GitHub Token: ${maskSecret(env.githubToken, 15)}`);
    } else {
      logWarning(`GitHub Token: Not configured (optional in development)`);
      hasWarnings = true;
    }

    if (env.stripeToken) {
      logSuccess(`Stripe Token: ${maskSecret(env.stripeToken, 12)}`);
    } else {
      logWarning(`Stripe Token: Not configured (optional in development)`);
      hasWarnings = true;
    }

    // Backend Configuration
    logSection('Backend Configuration');
    logSuccess(`Backend URL: ${env.backendUrl}`);
    if (env.backendApiKey) {
      logSuccess(`Backend API Key: ${maskSecret(env.backendApiKey, 8)}`);
    } else {
      logWarning('Backend API Key: Not configured (optional)');
      hasWarnings = true;
    }

    // Deployment Configuration
    logSection('Deployment Configuration');
    if (env.netlifyApiKey) {
      logSuccess(`Netlify API Key: ${maskSecret(env.netlifyApiKey, 8)}`);
    } else {
      logWarning(`Netlify API Key: Not configured (optional in development)`);
      hasWarnings = true;
    }

    if (env.renderServiceId && env.renderUrl && env.renderApiKey) {
      logSuccess(`Render Service ID: ${env.renderServiceId}`);
      logSuccess(`Render URL: ${env.renderUrl}`);
      logSuccess(`Render API Key: ${maskSecret(env.renderApiKey, 8)}`);
    } else {
      logWarning(`Render not configured (optional in development)`);
      hasWarnings = true;
    }

    // Environment-specific validation
    logSection('Environment-Specific Validation');
    const envConfig = env.environmentConfig;

    if (env.isProduction) {
      // Production-specific checks
      if (env.stripeToken) {
        if (env.stripeToken.startsWith('rk_test_')) {
          logError('Production environment is using TEST Stripe key!');
          hasErrors = true;
        } else {
          logSuccess('Using LIVE Stripe key in production');
        }
      } else {
        logError('Stripe Token required in production');
        hasErrors = true;
      }

      logInfo(`API Rate Limits: Anthropic=${envConfig.apiKeys.anthropic.rateLimit}/min, GitHub=${envConfig.apiKeys.github.rateLimit}/hr`);
    } else if (env.isDevelopment) {
      // Development-specific checks
      if (env.stripeToken && !env.stripeToken.startsWith('rk_test_')) {
        logWarning('Development environment is using LIVE Stripe key (consider using test key)');
        hasWarnings = true;
      } else {
        logSuccess('Using TEST Stripe key in development');
      }

      logInfo(`Debug mode enabled with request/error logging`);
    }

    // Security Configuration
    logSection('Security Configuration');
    const securityConfig = env.getSecurityConfig();
    logSuccess(`CORS Origins: ${securityConfig.cors.origin.join(', ')}`);
    logSuccess(`Security Headers: ${Object.keys(securityConfig.headers).length} configured`);

    // Summary
    console.log('\n' + '━'.repeat(60));

    if (hasErrors) {
      console.log(`\n${colors.red}✗ Validation Failed${colors.reset}`);
      console.log(`${colors.red}Please fix the errors above and try again.${colors.reset}\n`);
      return false;
    } else if (hasWarnings) {
      console.log(`\n${colors.yellow}⚠ Validation Passed with Warnings${colors.reset}`);
      console.log(`${colors.yellow}Review the warnings above.${colors.reset}\n`);
      return true;
    } else {
      console.log(`\n${colors.green}✓ All Environment Variables Validated Successfully!${colors.reset}\n`);
      return true;
    }

  } catch (error) {
    console.log('\n' + '━'.repeat(60));
    console.log(`\n${colors.red}✗ Environment Validation Failed${colors.reset}\n`);

    if (error instanceof Error) {
      console.error(`${colors.red}Error: ${error.message}${colors.reset}\n`);

      // Check if it's a Zod validation error
      if (error.message.includes('validation failed')) {
        console.log(`${colors.yellow}Common fixes:${colors.reset}`);
        console.log(`  1. Ensure all required environment variables are set in .env.local`);
        console.log(`  2. Check that API keys match the expected format`);
        console.log(`  3. Verify URLs are valid and include protocol (http:// or https://)`);
        console.log(`  4. Review lib/config/environment.ts for validation requirements\n`);
      }
    } else {
      console.error(`${colors.red}Unknown error occurred${colors.reset}\n`);
    }

    return false;
  }
}

// Run validation
validateEnvironment()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Fatal error during validation:', error);
    process.exit(1);
  });
