/**
 * Configuration System Entry Point
 * 
 * Initializes and exports all configuration modules for the modern-platform application.
 * This provides a centralized way to access environment, security, and secrets configuration.
 */

import { env } from './environment';
import { secretsManager } from './secrets';
import { securityConfig } from './security';
import { stripeConfig } from './stripe-config';

// Configuration initialization class
export class ConfigManager {
  private static instance: ConfigManager;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public initialize(): void {
    if (this.initialized) {
      return;
    }

    console.log('🔧 Initializing Configuration System...');
    
    try {
      // Initialize all configuration modules
      this.initializeEnvironment();
      this.initializeSecrets();
      this.initializeSecurity();
      this.initializeStripe();
      
      this.initialized = true;
      console.log('✅ Configuration System Initialized Successfully');
      
      // Log configuration summary
      this.logConfigurationSummary();
      
    } catch (error) {
      console.error('❌ Configuration System Initialization Failed:', error);
      throw error;
    }
  }

  private initializeEnvironment(): void {
    console.log('  📋 Loading environment configuration...');
    // Environment is already initialized when imported
  }

  private initializeSecrets(): void {
    console.log('  🔐 Validating secrets...');
    secretsManager.validateAllSecrets();
  }

  private initializeSecurity(): void {
    console.log('  🔒 Loading security configuration...');
    // Security config is already initialized when imported
  }

  private initializeStripe(): void {
    console.log('  💳 Loading Stripe configuration...');
    // Stripe config is already initialized when imported
  }

  private logConfigurationSummary(): void {
    console.log('\n📊 Configuration Summary');
    console.log('========================');
    console.log(`Environment: ${env.environment}`);
    console.log(`Site URL: ${env.config.NEXT_PUBLIC_SITE_URL}`);
    console.log(`Stripe Mode: ${stripeConfig.getEnvironment()}`);
    
    const secretsSummary = secretsManager.getValidationSummary();
    console.log(`Secrets Status: ${secretsSummary.valid}/${secretsSummary.total} valid`);
    
    if (secretsSummary.warnings.length > 0) {
      console.log(`Warnings: ${secretsSummary.warnings.length}`);
    }
    
    if (secretsSummary.errors.length > 0) {
      console.log(`Errors: ${secretsSummary.errors.length}`);
    }
    
    console.log('\n');
  }

  public getEnvironment() {
    return env;
  }

  public getSecrets() {
    return secretsManager;
  }

  public getSecurity() {
    return securityConfig;
  }

  public getStripe() {
    return stripeConfig;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public logDetailedReport(): void {
    if (!this.initialized) {
      console.log('Configuration system not initialized. Call initialize() first.');
      return;
    }

    console.log('\n📋 Detailed Configuration Report');
    console.log('==================================');
    
    // Environment details
    env.logEnvironmentConfig();
    
    // Secrets validation
    secretsManager.logValidationReport();
    
    // Security configuration
    securityConfig.logSecurityConfig();
    
    // Stripe configuration
    stripeConfig.logStripeConfig();
  }
}

// Export singleton instance
export const configManager = ConfigManager.getInstance();

// Export individual configuration modules
export { env } from './environment';
export { secretsManager } from './secrets';
export { securityConfig } from './security';
export { stripeConfig } from './stripe-config';

// Export types
export type { Environment } from './environment';
export type { SecretConfig, SecretValidationResult } from './secrets';
export type { SecurityHeaders, CorsConfig } from './security';
export type { StripeConfig } from './stripe-config';

// Auto-initialize configuration system
if (typeof window === 'undefined') {
  // Only initialize on server side
  configManager.initialize();
}
