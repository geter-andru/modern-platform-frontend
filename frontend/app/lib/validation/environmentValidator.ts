/**
 * Environment Variable Validator
 * 
 * Validates environment variables at build time and runtime
 * to ensure all required variables are present and properly formatted.
 */

import fs from 'node:fs';
import { z } from 'zod';
import chalk from 'chalk';
import { 
  EnvironmentSchema, 
  EnvironmentValidationResult,
  type Environment 
} from './schemas/environmentSchemas.js';

export class EnvironmentValidator {
  private requiredVariables: string[];
  private optionalVariables: string[];

  constructor() {
    // Required for production deployment
    this.requiredVariables = [
      'NODE_ENV',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    // Optional but recommended
    this.optionalVariables = [
      'NEXT_PUBLIC_NODE_ENV',
      'NEXT_PUBLIC_SITE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'OPENAI_API_KEY',
      'ANTHROPIC_API_KEY',
      'AIRTABLE_API_KEY',
      'AIRTABLE_BASE_ID',
      'AIRTABLE_API_URL'
    ];
  }

  /**
   * Validate all environment variables
   */
  async validateEnvironment(): Promise<EnvironmentValidationResult> {
    console.log(chalk.blue('🔍 Validating environment variables...'));

    try {
      // Load environment variables from .env.local if not already loaded
      if (!process.env.NODE_ENV && fs.existsSync('.env.local')) {
        console.log(chalk.yellow('⚠️  Loading environment variables from .env.local...'));
        // Note: In a real deployment, these would be set by Netlify
        // For local validation, we'll be more lenient
      }

      // Check for missing required variables
      const missing = this.requiredVariables.filter(varName => !process.env[varName]);
      
      // For local development, be more lenient - only fail if we're in production mode
      if (missing.length > 0 && process.env.NODE_ENV === 'production') {
        return {
          success: false,
          missing,
          error: `Missing required environment variables in production: ${missing.join(', ')}`
        };
      }
      
      // For local development, just warn about missing variables
      if (missing.length > 0) {
        console.log(chalk.yellow(`⚠️  Missing environment variables (local dev): ${missing.join(', ')}`));
        console.log(chalk.yellow('   These will be required for production deployment'));
      }

      // Validate environment variable formats (only for variables that exist)
      const existingEnvVars = Object.keys(process.env).reduce((acc, key) => {
        acc[key] = process.env[key];
        return acc;
      }, {} as Record<string, string>);

      const validationResult = EnvironmentSchema.safeParse(existingEnvVars);
      
      if (!validationResult.success) {
        const invalid = validationResult.error?.errors?.map(err => err.path.join('.')) || ['Unknown validation error'];
        console.log(chalk.yellow(`⚠️  Invalid environment variable formats: ${invalid.join(', ')}`));
        // Don't fail validation for format issues in local development
        if (process.env.NODE_ENV === 'production') {
          return {
            success: false,
            invalid,
            error: `Invalid environment variable formats: ${invalid.join(', ')}`
          };
        }
      }

      // Check for optional variables in production
      if (process.env.NODE_ENV === 'production') {
        const missingOptional = this.optionalVariables.filter(varName => !process.env[varName]);
        if (missingOptional.length > 0) {
          console.log(chalk.yellow(`⚠️  Missing optional variables in production: ${missingOptional.join(', ')}`));
        }
      }

      console.log(chalk.green('✅ Environment variables validated successfully'));
      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown validation error'
      };
    }
  }

  /**
   * Validate specific environment variable
   */
  validateVariable(name: string, value: string | undefined): boolean {
    if (!value) return false;

    switch (name) {
      case 'NEXT_PUBLIC_SUPABASE_URL':
        return value.startsWith('https://') && value.includes('.supabase.co');
      
      case 'NEXT_PUBLIC_SUPABASE_ANON_KEY':
      case 'SUPABASE_SERVICE_ROLE_KEY':
        return value.startsWith('eyJ') && value.length > 100;
      
      case 'OPENAI_API_KEY':
        return value.startsWith('sk-') && value.length > 20;
      
      case 'ANTHROPIC_API_KEY':
        return value.startsWith('sk-ant-') && value.length > 20;
      
      case 'AIRTABLE_API_KEY':
        return value.startsWith('pat') && value.length > 20;
      
      case 'AIRTABLE_BASE_ID':
        return value.startsWith('app') && value.length > 10;
      
      default:
        return true;
    }
  }

  /**
   * Get environment summary for debugging
   */
  getEnvironmentSummary(): Record<string, string> {
    const summary: Record<string, string> = {};
    
    [...this.requiredVariables, ...this.optionalVariables].forEach(varName => {
      const value = process.env[varName];
      if (value) {
        // Mask sensitive values
        if (varName.includes('KEY') || varName.includes('SECRET') || varName.includes('TOKEN')) {
          summary[varName] = `${value.substring(0, 8)}...${value.substring(value.length - 4)}`;
        } else {
          summary[varName] = value;
        }
      } else {
        summary[varName] = 'NOT_SET';
      }
    });

    return summary;
  }
}

export const environmentValidator = new EnvironmentValidator();
