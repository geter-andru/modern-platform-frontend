/**
 * Development Security Configuration
 * 
 * Provides security headers, CORS configuration, and development-specific
 * security measures for the modern-platform application.
 */

import { env } from './environment';

// Security headers configuration
export interface SecurityHeaders {
  [key: string]: string;
}

// CORS configuration
export interface CorsConfig {
  origin: string | string[];
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
  maxAge?: number;
}

// Security configuration class
export class SecurityConfig {
  private static instance: SecurityConfig;
  private environment: string;

  private constructor() {
    this.environment = env.environment;
  }

  public static getInstance(): SecurityConfig {
    if (!SecurityConfig.instance) {
      SecurityConfig.instance = new SecurityConfig();
    }
    return SecurityConfig.instance;
  }

  // Get security headers based on environment
  public getSecurityHeaders(): SecurityHeaders {
    const baseHeaders: SecurityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    };

    if (this.environment === 'production') {
      return {
        ...baseHeaders,
        'X-Frame-Options': 'DENY',
        'Content-Security-Policy': this.getContentSecurityPolicy(),
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      };
    }

    if (this.environment === 'development') {
      return {
        ...baseHeaders,
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy': this.getDevelopmentCSP(),
      };
    }

    return baseHeaders;
  }

  // Get CORS configuration based on environment
  public getCorsConfig(): CorsConfig {
    const baseConfig: CorsConfig = {
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
      ],
      credentials: true,
      maxAge: 86400, // 24 hours
    };

    if (this.environment === 'production') {
      return {
        ...baseConfig,
        origin: ['https://platform.andruai.com'],
      };
    }

    if (this.environment === 'development') {
      return {
        ...baseConfig,
        origin: [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:3002',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:3001',
          'http://127.0.0.1:3002',
        ],
      };
    }

    return {
      ...baseConfig,
      origin: '*',
    };
  }

  // Get Content Security Policy for production
  private getContentSecurityPolicy(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.anthropic.com https://*.supabase.co https://api.stripe.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');
  }

  // Get Content Security Policy for development
  private getDevelopmentCSP(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' http://localhost:* https://api.anthropic.com https://*.supabase.co https://api.stripe.com",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');
  }

  // Validate request origin
  public validateOrigin(origin: string): boolean {
    const corsConfig = this.getCorsConfig();
    
    if (typeof corsConfig.origin === 'string') {
      return corsConfig.origin === origin;
    }
    
    return corsConfig.origin.includes(origin);
  }

  // Get rate limiting configuration
  public getRateLimitConfig(): {
    windowMs: number;
    max: number;
    message: string;
    standardHeaders: boolean;
    legacyHeaders: boolean;
  } {
    if (this.environment === 'production') {
      return {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
      };
    }

    if (this.environment === 'development') {
      return {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000, // limit each IP to 1000 requests per windowMs
        message: 'Too many requests from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
      };
    }

    return {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    };
  }

  // Get API key validation configuration
  public getApiKeyValidationConfig(): {
    required: boolean;
    strict: boolean;
    logAttempts: boolean;
  } {
    if (this.environment === 'production') {
      return {
        required: true,
        strict: true,
        logAttempts: true,
      };
    }

    if (this.environment === 'development') {
      return {
        required: false,
        strict: false,
        logAttempts: true,
      };
    }

    return {
      required: true,
      strict: false,
      logAttempts: false,
    };
  }

  // Get logging configuration
  public getLoggingConfig(): {
    level: 'error' | 'warn' | 'info' | 'debug';
    enableRequestLogging: boolean;
    enableErrorLogging: boolean;
    enableSecurityLogging: boolean;
  } {
    if (this.environment === 'production') {
      return {
        level: 'info',
        enableRequestLogging: false,
        enableErrorLogging: true,
        enableSecurityLogging: true,
      };
    }

    if (this.environment === 'development') {
      return {
        level: 'debug',
        enableRequestLogging: true,
        enableErrorLogging: true,
        enableSecurityLogging: true,
      };
    }

    return {
      level: 'error',
      enableRequestLogging: false,
      enableErrorLogging: true,
      enableSecurityLogging: false,
    };
  }

  // Validate API key format
  public validateApiKey(apiKey: string, service: string): boolean {
    const patterns: Record<string, RegExp> = {
      github: /^github_pat_[A-Za-z0-9_]+$/,
      stripe: /^rk_(live|test)_[A-Za-z0-9_]+$/,
      anthropic: /^sk-ant-api03-[A-Za-z0-9_-]+$/,
      supabase: /^eyJ[A-Za-z0-9_-]+$/,
      airtable: /^pat[A-Za-z0-9_.]+$/,
      netlify: /^nfp_[A-Za-z0-9_]+$/,
      render: /^rnd_[A-Za-z0-9_]+$/,
    };

    const pattern = patterns[service.toLowerCase()];
    if (!pattern) {
      return false;
    }

    return pattern.test(apiKey);
  }

  // Get security recommendations
  public getSecurityRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.environment === 'development') {
      recommendations.push('Use test API keys instead of live keys');
      recommendations.push('Enable request logging for debugging');
      recommendations.push('Use development-specific CORS origins');
      recommendations.push('Consider using environment-specific configurations');
    }

    if (this.environment === 'production') {
      recommendations.push('Enable HTTPS only');
      recommendations.push('Implement proper secrets management');
      recommendations.push('Enable security monitoring and alerting');
      recommendations.push('Regular security audits and penetration testing');
      recommendations.push('Implement proper backup and disaster recovery');
    }

    return recommendations;
  }

  // Log security configuration
  public logSecurityConfig(): void {
    console.log('\n🔒 Security Configuration');
    console.log('=========================');
    console.log(`Environment: ${this.environment}`);
    console.log(`CORS Origins: ${JSON.stringify(this.getCorsConfig().origin)}`);
    console.log(`Rate Limit: ${this.getRateLimitConfig().max} requests per ${this.getRateLimitConfig().windowMs / 1000 / 60} minutes`);
    console.log(`Logging Level: ${this.getLoggingConfig().level}`);
    
    const recommendations = this.getSecurityRecommendations();
    if (recommendations.length > 0) {
      console.log('\n💡 Security Recommendations:');
      recommendations.forEach(rec => console.log(`  - ${rec}`));
    }
    
    console.log('\n');
  }
}

// Export singleton instance
export const securityConfig = SecurityConfig.getInstance();

// Export types
export type { SecurityHeaders, CorsConfig };
