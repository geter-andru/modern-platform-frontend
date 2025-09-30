/**
 * Stripe Configuration Management
 * 
 * Handles Stripe key management for different environments,
 * ensuring test keys are used in development and live keys in production.
 */

import { env } from './environment';

// Stripe configuration interface
export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret?: string;
  environment: 'test' | 'live';
  isTestMode: boolean;
}

// Stripe configuration class
export class StripeConfigManager {
  private static instance: StripeConfigManager;
  private config: StripeConfig;

  private constructor() {
    this.config = this.loadStripeConfig();
  }

  public static getInstance(): StripeConfigManager {
    if (!StripeConfigManager.instance) {
      StripeConfigManager.instance = new StripeConfigManager();
    }
    return StripeConfigManager.instance;
  }

  private loadStripeConfig(): StripeConfig {
    const stripeToken = env.stripeToken;
    
    // Determine if we're using test or live key
    const isTestKey = stripeToken.startsWith('rk_test_');
    const isLiveKey = stripeToken.startsWith('rk_live_');
    
    if (!isTestKey && !isLiveKey) {
      throw new Error(`Invalid Stripe key format: ${stripeToken.substring(0, 10)}...`);
    }

    // Environment validation
    if (env.isDevelopment && isLiveKey) {
      console.warn('⚠️  WARNING: Using live Stripe key in development environment!');
      console.warn('   Consider using test key (rk_test_...) for development safety.');
    }

    if (env.isProduction && isTestKey) {
      throw new Error('Cannot use test Stripe key in production environment');
    }

    return {
      publishableKey: stripeToken,
      secretKey: stripeToken, // In this case, they're the same
      environment: isTestKey ? 'test' : 'live',
      isTestMode: isTestKey,
    };
  }

  public getConfig(): StripeConfig {
    return this.config;
  }

  public getPublishableKey(): string {
    return this.config.publishableKey;
  }

  public getSecretKey(): string {
    return this.config.secretKey;
  }

  public isTestMode(): boolean {
    return this.config.isTestMode;
  }

  public getEnvironment(): 'test' | 'live' {
    return this.config.environment;
  }

  public validateStripeKey(key: string): boolean {
    const testKeyPattern = /^rk_test_[A-Za-z0-9_]+$/;
    const liveKeyPattern = /^rk_live_[A-Za-z0-9_]+$/;
    
    return testKeyPattern.test(key) || liveKeyPattern.test(key);
  }

  public getStripeKeyRecommendation(): string {
    if (env.isDevelopment) {
      return 'Use test key (rk_test_...) for development safety';
    }
    
    if (env.isProduction) {
      return 'Use live key (rk_live_...) for production';
    }
    
    return 'Use appropriate key for your environment';
  }

  public logStripeConfig(): void {
    console.log('\n💳 Stripe Configuration');
    console.log('========================');
    console.log(`Environment: ${this.config.environment}`);
    console.log(`Test Mode: ${this.config.isTestMode ? 'Yes' : 'No'}`);
    console.log(`Key: ${this.config.publishableKey.substring(0, 10)}...`);
    
    if (env.isDevelopment && !this.config.isTestMode) {
      console.log('\n⚠️  WARNING: Using live Stripe key in development!');
      console.log('   Recommendation: Replace with test key for safety');
    }
    
    console.log('\n');
  }

  // Static method to get test key format
  public static getTestKeyFormat(): string {
    return 'rk_test_[A-Za-z0-9_]+';
  }

  // Static method to get live key format
  public static getLiveKeyFormat(): string {
    return 'rk_live_[A-Za-z0-9_]+';
  }

  // Static method to validate key format
  public static validateKeyFormat(key: string): {
    isValid: boolean;
    isTest: boolean;
    isLive: boolean;
    format: string;
  } {
    const testPattern = /^rk_test_[A-Za-z0-9_]+$/;
    const livePattern = /^rk_live_[A-Za-z0-9_]+$/;
    
    const isTest = testPattern.test(key);
    const isLive = livePattern.test(key);
    const isValid = isTest || isLive;
    
    let format = 'invalid';
    if (isTest) format = 'test';
    if (isLive) format = 'live';
    
    return { isValid, isTest, isLive, format };
  }
}

// Export singleton instance
export const stripeConfig = StripeConfigManager.getInstance();

// Export types
export type { StripeConfig };
