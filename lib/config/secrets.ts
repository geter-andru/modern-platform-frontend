/**
 * Secrets Management System
 * 
 * Provides centralized secrets validation, rotation, and management
 * for development and production environments.
 */

import { env, Environment } from './environment';

// Secret types and their validation requirements
export interface SecretConfig {
  name: string;
  type: 'api_key' | 'token' | 'jwt' | 'client_id' | 'client_secret';
  required: boolean;
  environment: Environment[];
  validation: {
    pattern: RegExp;
    minLength?: number;
    maxLength?: number;
  };
  rotation: {
    enabled: boolean;
    interval?: number; // days
    lastRotated?: Date;
  };
}

// Secret definitions
const secretDefinitions: Record<string, SecretConfig> = {
  GITHUB_TOKEN: {
    name: 'GitHub Personal Access Token',
    type: 'token',
    required: true,
    environment: ['development', 'production'],
    validation: {
      pattern: /^github_pat_[A-Za-z0-9_]+$/,
      minLength: 40,
      maxLength: 100,
    },
    rotation: {
      enabled: true,
      interval: 90, // 90 days
    },
  },
  STRIPE_TOKEN: {
    name: 'Stripe API Key',
    type: 'api_key',
    required: true,
    environment: ['development', 'production'],
    validation: {
      pattern: /^rk_(live|test)_[A-Za-z0-9_]+$/,
      minLength: 50,
      maxLength: 100,
    },
    rotation: {
      enabled: true,
      interval: 365, // 1 year
    },
  },
  ANTHROPIC_API_KEY: {
    name: 'Anthropic API Key',
    type: 'api_key',
    required: true,
    environment: ['development', 'production'],
    validation: {
      pattern: /^sk-ant-api03-[A-Za-z0-9_-]+$/,
      minLength: 50,
      maxLength: 100,
    },
    rotation: {
      enabled: true,
      interval: 180, // 6 months
    },
  },
  SUPABASE_ANON_KEY: {
    name: 'Supabase Anonymous Key',
    type: 'jwt',
    required: true,
    environment: ['development', 'production'],
    validation: {
      pattern: /^eyJ[A-Za-z0-9_-]+$/,
      minLength: 100,
      maxLength: 500,
    },
    rotation: {
      enabled: false, // Managed by Supabase
    },
  },
  SUPABASE_SERVICE_ROLE_KEY: {
    name: 'Supabase Service Role Key',
    type: 'jwt',
    required: true,
    environment: ['development', 'production'],
    validation: {
      pattern: /^eyJ[A-Za-z0-9_-]+$/,
      minLength: 100,
      maxLength: 500,
    },
    rotation: {
      enabled: false, // Managed by Supabase
    },
  },
  AIRTABLE_API_KEY: {
    name: 'Airtable API Key',
    type: 'api_key',
    required: true,
    environment: ['development', 'production'],
    validation: {
      pattern: /^pat[A-Za-z0-9_.]+$/,
      minLength: 50,
      maxLength: 100,
    },
    rotation: {
      enabled: true,
      interval: 180, // 6 months
    },
  },
  GOOGLE_CLIENT_ID: {
    name: 'Google OAuth Client ID',
    type: 'client_id',
    required: true,
    environment: ['development', 'production'],
    validation: {
      pattern: /^[0-9]+-[A-Za-z0-9_.]+\.apps\.googleusercontent\.com$/,
      minLength: 50,
      maxLength: 100,
    },
    rotation: {
      enabled: false, // Managed by Google Cloud Console
    },
  },
  GOOGLE_CLIENT_SECRET: {
    name: 'Google OAuth Client Secret',
    type: 'client_secret',
    required: true,
    environment: ['development', 'production'],
    validation: {
      pattern: /^GOCSPX-[A-Za-z0-9_-]+$/,
      minLength: 20,
      maxLength: 50,
    },
    rotation: {
      enabled: true,
      interval: 90, // 90 days
    },
  },
  NETLIFY_API_KEY: {
    name: 'Netlify API Key',
    type: 'api_key',
    required: false,
    environment: ['development', 'production'],
    validation: {
      pattern: /^nfp_[A-Za-z0-9_]+$/,
      minLength: 20,
      maxLength: 50,
    },
    rotation: {
      enabled: true,
      interval: 180, // 6 months
    },
  },
  RENDER_API_KEY: {
    name: 'Render API Key',
    type: 'api_key',
    required: false,
    environment: ['development', 'production'],
    validation: {
      pattern: /^rnd_[A-Za-z0-9_]+$/,
      minLength: 20,
      maxLength: 50,
    },
    rotation: {
      enabled: true,
      interval: 180, // 6 months
    },
  },
};

// Secrets validation result
export interface SecretValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

// Secrets management class
export class SecretsManager {
  private static instance: SecretsManager;
  private secrets: Map<string, string> = new Map();
  private validationResults: Map<string, SecretValidationResult> = new Map();

  private constructor() {
    this.loadSecrets();
    this.validateAllSecrets();
  }

  public static getInstance(): SecretsManager {
    if (!SecretsManager.instance) {
      SecretsManager.instance = new SecretsManager();
    }
    return SecretsManager.instance;
  }

  private loadSecrets(): void {
    // Load secrets from environment variables
    const secretMappings = {
      GITHUB_TOKEN: env.githubToken,
      STRIPE_TOKEN: env.stripeToken,
      ANTHROPIC_API_KEY: env.anthropicApiKey,
      SUPABASE_ANON_KEY: env.supabaseAnonKey,
      SUPABASE_SERVICE_ROLE_KEY: env.supabaseServiceRoleKey,
      AIRTABLE_API_KEY: env.airtableApiKey,
      GOOGLE_CLIENT_ID: env.googleClientId,
      GOOGLE_CLIENT_SECRET: env.googleClientSecret,
      NETLIFY_API_KEY: env.netlifyApiKey,
      RENDER_API_KEY: env.renderApiKey,
    };

    for (const [key, value] of Object.entries(secretMappings)) {
      if (value) {
        this.secrets.set(key, value);
      }
    }
  }

  public validateSecret(secretName: string): SecretValidationResult {
    const secret = this.secrets.get(secretName);
    const definition = secretDefinitions[secretName];
    
    const result: SecretValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      recommendations: [],
    };

    if (!definition) {
      result.isValid = false;
      result.errors.push(`Unknown secret: ${secretName}`);
      return result;
    }

    // Check if secret is required for current environment
    if (definition.required && !secret) {
      result.isValid = false;
      result.errors.push(`${definition.name} is required but not provided`);
      return result;
    }

    if (!secret) {
      result.warnings.push(`${definition.name} is not provided (optional)`);
      return result;
    }

    // Validate secret format
    if (!definition.validation.pattern.test(secret)) {
      result.isValid = false;
      result.errors.push(`${definition.name} format is invalid`);
    }

    // Validate secret length
    if (definition.validation.minLength && secret.length < definition.validation.minLength) {
      result.isValid = false;
      result.errors.push(`${definition.name} is too short (minimum ${definition.validation.minLength} characters)`);
    }

    if (definition.validation.maxLength && secret.length > definition.validation.maxLength) {
      result.isValid = false;
      result.errors.push(`${definition.name} is too long (maximum ${definition.validation.maxLength} characters)`);
    }

    // Environment-specific validation
    if (env.isDevelopment && secretName === 'STRIPE_TOKEN' && secret.startsWith('rk_live_')) {
      result.warnings.push('Using live Stripe key in development environment. Consider using test key.');
      result.recommendations.push('Replace with test key (rk_test_...) for development');
    }

    if (env.isProduction && secretName === 'STRIPE_TOKEN' && secret.startsWith('rk_test_')) {
      result.isValid = false;
      result.errors.push('Using test Stripe key in production environment');
    }

    // Check rotation requirements
    if (definition.rotation.enabled && definition.rotation.interval) {
      const lastRotated = definition.rotation.lastRotated;
      if (lastRotated) {
        const daysSinceRotation = Math.floor((Date.now() - lastRotated.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceRotation > definition.rotation.interval) {
          result.warnings.push(`${definition.name} should be rotated (last rotated ${daysSinceRotation} days ago)`);
          result.recommendations.push(`Rotate ${definition.name} every ${definition.rotation.interval} days`);
        }
      } else {
        result.recommendations.push(`Set up rotation schedule for ${definition.name} (every ${definition.rotation.interval} days)`);
      }
    }

    return result;
  }

  public validateAllSecrets(): void {
    for (const secretName of Object.keys(secretDefinitions)) {
      const result = this.validateSecret(secretName);
      this.validationResults.set(secretName, result);
    }
  }

  public getValidationResults(): Map<string, SecretValidationResult> {
    return this.validationResults;
  }

  public getSecret(secretName: string): string | undefined {
    return this.secrets.get(secretName);
  }

  public getAllSecrets(): Map<string, string> {
    return new Map(this.secrets);
  }

  public getSecretDefinition(secretName: string): SecretConfig | undefined {
    return secretDefinitions[secretName];
  }

  public getAllSecretDefinitions(): Record<string, SecretConfig> {
    return secretDefinitions;
  }

  public getValidationSummary(): {
    total: number;
    valid: number;
    invalid: number;
    warnings: number;
    errors: string[];
    warnings: string[];
    recommendations: string[];
  } {
    const results = Array.from(this.validationResults.values());
    
    const summary = {
      total: results.length,
      valid: results.filter(r => r.isValid && r.errors.length === 0).length,
      invalid: results.filter(r => !r.isValid || r.errors.length > 0).length,
      warnings: results.filter(r => r.warnings.length > 0).length,
      errors: results.flatMap(r => r.errors),
      warnings: results.flatMap(r => r.warnings),
      recommendations: results.flatMap(r => r.recommendations),
    };

    return summary;
  }

  public generateRotationReport(): {
    needsRotation: string[];
    rotationSchedule: Array<{
      secret: string;
      definition: SecretConfig;
      daysUntilRotation: number;
    }>;
  } {
    const needsRotation: string[] = [];
    const rotationSchedule: Array<{
      secret: string;
      definition: SecretConfig;
      daysUntilRotation: number;
    }> = [];

    for (const [secretName, definition] of Object.entries(secretDefinitions)) {
      if (definition.rotation.enabled && definition.rotation.interval) {
        const lastRotated = definition.rotation.lastRotated;
        if (lastRotated) {
          const daysSinceRotation = Math.floor((Date.now() - lastRotated.getTime()) / (1000 * 60 * 60 * 24));
          const daysUntilRotation = definition.rotation.interval - daysSinceRotation;
          
          if (daysUntilRotation <= 0) {
            needsRotation.push(secretName);
          }
          
          rotationSchedule.push({
            secret: secretName,
            definition,
            daysUntilRotation: Math.max(0, daysUntilRotation),
          });
        } else {
          needsRotation.push(secretName);
          rotationSchedule.push({
            secret: secretName,
            definition,
            daysUntilRotation: 0,
          });
        }
      }
    }

    return { needsRotation, rotationSchedule };
  }

  public logValidationReport(): void {
    const summary = this.getValidationSummary();
    const rotationReport = this.generateRotationReport();

    console.log('\n🔐 Secrets Validation Report');
    console.log('============================');
    console.log(`Total Secrets: ${summary.total}`);
    console.log(`Valid: ${summary.valid}`);
    console.log(`Invalid: ${summary.invalid}`);
    console.log(`Warnings: ${summary.warnings}`);

    if (summary.errors.length > 0) {
      console.log('\n❌ Errors:');
      summary.errors.forEach(error => console.log(`  - ${error}`));
    }

    if (summary.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      summary.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    if (summary.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      summary.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }

    if (rotationReport.needsRotation.length > 0) {
      console.log('\n🔄 Secrets Needing Rotation:');
      rotationReport.needsRotation.forEach(secret => console.log(`  - ${secret}`));
    }

    console.log('\n');
  }
}

// Export singleton instance
export const secretsManager = SecretsManager.getInstance();

// Export types
export type { SecretConfig, SecretValidationResult };
