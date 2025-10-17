/**
 * Environment Configuration System
 * 
 * Provides centralized environment variable management with validation,
 * type safety, and environment-specific configurations.
 */

import { z } from 'zod';

// Environment type definitions
export type Environment = 'development' | 'production' | 'test';

// API Key validation schemas
const apiKeySchemas = {
  github: z.string().regex(/^github_pat_[A-Za-z0-9_]+$/, 'Invalid GitHub token format'),
  stripe: z.string().regex(/^rk_(live|test)_[A-Za-z0-9_]+$/, 'Invalid Stripe key format'),
  anthropic: z.string().regex(/^sk-ant-api03-[A-Za-z0-9_-]+$/, 'Invalid Anthropic API key format'),
  supabase: z.string().regex(/^eyJ[A-Za-z0-9_-]+$/, 'Invalid Supabase JWT format'),
  airtable: z.string().regex(/^pat[A-Za-z0-9_.]+$/, 'Invalid Airtable API key format'),
  netlify: z.string().regex(/^nfp_[A-Za-z0-9_]+$/, 'Invalid Netlify API key format'),
  render: z.string().regex(/^rnd_[A-Za-z0-9_]+$/, 'Invalid Render API key format'),
  google: z.string().regex(/^[0-9]+-[A-Za-z0-9_.]+\.apps\.googleusercontent\.com$/, 'Invalid Google Client ID format'),
};

// Environment configuration schema with lenient validation
const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).catch('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url().catch('http://localhost:3000'),

  // API Keys (optional with lenient validation - allows any string or undefined)
  NEXT_PUBLIC_GITHUB_TOKEN: z.string().optional().or(z.literal('')),
  NEXT_PUBLIC_STRIPE_TOKEN: z.string().optional().or(z.literal('')),
  ANTHROPIC_API_KEY: z.string().optional().or(z.literal('')),
  NEXT_PUBLIC_ANTHROPIC_API_KEY: z.string().optional().or(z.literal('')),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional().or(z.literal('')),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal('')),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal('')),
  NEXT_PUBLIC_AIRTABLE_API_KEY: z.string().optional().or(z.literal('')),
  NEXT_PUBLIC_AIRTABLE_BASE_ID: z.string().optional().or(z.literal('')),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional().or(z.literal('')),
  GOOGLE_CLIENT_SECRET: z.string().optional().or(z.literal('')),
  NEXT_PUBLIC_NETLIFY_API_KEY: z.string().optional().or(z.literal('')),
  NEXT_PUBLIC_RENDER_SERVICE_ID: z.string().optional().or(z.literal('')),
  NEXT_PUBLIC_RENDER_URL: z.string().optional().or(z.literal('')),
  RENDER_API_KEY: z.string().optional().or(z.literal('')),
  BACKEND_API_KEY: z.string().optional().or(z.literal('')),
});

// Environment-specific configurations
const environmentConfigs = {
  development: {
    apiKeys: {
      stripe: {
        useTestKey: true,
        testKeyPrefix: 'rk_test_',
        liveKeyPrefix: 'rk_live_',
      },
      anthropic: {
        rateLimit: 100, // requests per minute
        timeout: 30000, // 30 seconds
      },
      github: {
        rateLimit: 5000, // requests per hour
        timeout: 10000, // 10 seconds
      },
    },
    security: {
      cors: {
        origin: ['http://localhost:3000', 'http://localhost:3002'],
        credentials: true,
      },
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
    logging: {
      level: 'debug',
      enableRequestLogging: true,
      enableErrorLogging: true,
    },
  },
  production: {
    apiKeys: {
      stripe: {
        useTestKey: false,
        testKeyPrefix: 'rk_test_',
        liveKeyPrefix: 'rk_live_',
      },
      anthropic: {
        rateLimit: 1000, // requests per minute
        timeout: 60000, // 60 seconds
      },
      github: {
        rateLimit: 5000, // requests per hour
        timeout: 15000, // 15 seconds
      },
    },
    security: {
      cors: {
        origin: ['https://platform.andruai.com'],
        credentials: true,
      },
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
      },
    },
    logging: {
      level: 'info',
      enableRequestLogging: false,
      enableErrorLogging: true,
    },
  },
  test: {
    apiKeys: {
      stripe: {
        useTestKey: true,
        testKeyPrefix: 'rk_test_',
        liveKeyPrefix: 'rk_live_',
      },
      anthropic: {
        rateLimit: 10, // requests per minute
        timeout: 5000, // 5 seconds
      },
      github: {
        rateLimit: 100, // requests per hour
        timeout: 5000, // 5 seconds
      },
    },
    security: {
      cors: {
        origin: ['http://localhost:3000'],
        credentials: true,
      },
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
    logging: {
      level: 'error',
      enableRequestLogging: false,
      enableErrorLogging: true,
    },
  },
};

// Environment configuration class
export class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  private _config: z.infer<typeof environmentSchema>;
  private _environment: Environment;

  private constructor() {
    this._environment = this.detectEnvironment();
    this._config = this.loadAndValidateConfig();
  }

  public static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  private detectEnvironment(): Environment {
    const nodeEnv = process.env.NODE_ENV as Environment;
    
    if (!nodeEnv || !['development', 'production', 'test'].includes(nodeEnv)) {
      console.warn('Invalid NODE_ENV, defaulting to development');
      return 'development';
    }
    
    return nodeEnv;
  }

  private loadAndValidateConfig(): z.infer<typeof environmentSchema> {
    try {
      const config = environmentSchema.parse(process.env);
      
      // Additional validation for environment-specific requirements
      this.validateEnvironmentSpecificConfig(config);
      
      return config;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Environment validation failed:');
        error.issues.forEach(err => {
          console.error(`  ${err.path.join('.')}: ${err.message}`);
        });
        throw new Error('Environment configuration validation failed');
      }
      throw error;
    }
  }

  private validateEnvironmentSpecificConfig(config: z.infer<typeof environmentSchema>): void {
    const envConfig = environmentConfigs[this.environment];

    // Validate Stripe key based on environment (if configured)
    if (config.NEXT_PUBLIC_STRIPE_TOKEN) {
      if (envConfig.apiKeys.stripe.useTestKey) {
        if (!config.NEXT_PUBLIC_STRIPE_TOKEN.startsWith('rk_test_')) {
          console.warn(`Warning: Using live Stripe key in ${this.environment} environment. Consider using test key.`);
        }
      } else {
        if (!config.NEXT_PUBLIC_STRIPE_TOKEN.startsWith('rk_live_')) {
          console.warn(`Warning: Production environment should use live Stripe key, got: ${config.NEXT_PUBLIC_STRIPE_TOKEN.substring(0, 10)}...`);
        }
      }
    }
  }

  // Public getters
  public get environment(): Environment {
    return this._environment;
  }

  public get isDevelopment(): boolean {
    return this._environment === 'development';
  }

  public get isProduction(): boolean {
    return this.environment === 'production';
  }

  public get isTest(): boolean {
    return this.environment === 'test';
  }

  public get config(): z.infer<typeof environmentSchema> {
    return this._config;
  }

  public get environmentConfig() {
    return environmentConfigs[this.environment];
  }

  // API Key getters with validation (returns undefined if not configured)
  public get githubToken(): string | undefined {
    return this._config.NEXT_PUBLIC_GITHUB_TOKEN;
  }

  public get stripeToken(): string | undefined {
    return this._config.NEXT_PUBLIC_STRIPE_TOKEN;
  }

  public get anthropicApiKey(): string | undefined {
    return this._config.ANTHROPIC_API_KEY || this._config.NEXT_PUBLIC_ANTHROPIC_API_KEY;
  }

  public get supabaseUrl(): string | undefined {
    return this._config.NEXT_PUBLIC_SUPABASE_URL;
  }

  public get supabaseAnonKey(): string | undefined {
    return this._config.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }

  public get supabaseServiceRoleKey(): string | undefined {
    return this._config.SUPABASE_SERVICE_ROLE_KEY;
  }

  public get airtableApiKey(): string | undefined {
    return this._config.NEXT_PUBLIC_AIRTABLE_API_KEY;
  }

  public get airtableBaseId(): string | undefined {
    return this._config.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  }

  public get googleClientId(): string | undefined {
    return this._config.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  }

  public get googleClientSecret(): string | undefined {
    return this._config.GOOGLE_CLIENT_SECRET;
  }

  public get netlifyApiKey(): string | undefined {
    return this._config.NEXT_PUBLIC_NETLIFY_API_KEY;
  }

  public get renderServiceId(): string | undefined {
    return this._config.NEXT_PUBLIC_RENDER_SERVICE_ID;
  }

  public get renderUrl(): string | undefined {
    return this._config.NEXT_PUBLIC_RENDER_URL;
  }

  public get renderApiKey(): string | undefined {
    return this._config.RENDER_API_KEY;
  }

  public get backendApiKey(): string | undefined {
    return this._config.BACKEND_API_KEY;
  }

  public get siteUrl(): string | undefined {
    return this._config.NEXT_PUBLIC_SITE_URL;
  }

  // Utility methods
  public validateApiKey(key: string, type: keyof typeof apiKeySchemas): boolean {
    try {
      apiKeySchemas[type].parse(key);
      return true;
    } catch {
      return false;
    }
  }

  public getApiKeyConfig(service: keyof typeof environmentConfigs.development.apiKeys) {
    return this.environmentConfig.apiKeys[service];
  }

  public getSecurityConfig() {
    return this.environmentConfig.security;
  }

  public getLoggingConfig() {
    return this.environmentConfig.logging;
  }
}

// Export singleton instance
export const env = EnvironmentConfig.getInstance();

// Export types for use in other modules
export type EnvironmentConfigType = z.infer<typeof environmentSchema>;
export type EnvironmentConfigs = typeof environmentConfigs;
