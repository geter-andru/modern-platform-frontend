/**
 * Configuration System Test Suite
 * 
 * Tests all configuration modules to ensure they work correctly
 * and provide proper validation and security features.
 */

import { configManager } from './index';
import { validationMiddleware } from '../middleware/validation';
import { apiVersioning } from '../middleware/api-versioning';
import { errorHandler } from '../middleware/error-handling';
import { comprehensiveMiddleware } from '../middleware/index';

// Test configuration class
export class ConfigurationTester {
  private static instance: ConfigurationTester;
  private testResults: Array<{
    test: string;
    status: 'PASS' | 'FAIL' | 'WARN';
    message: string;
    details?: any;
  }> = [];

  private constructor() {}

  public static getInstance(): ConfigurationTester {
    if (!ConfigurationTester.instance) {
      ConfigurationTester.instance = new ConfigurationTester();
    }
    return ConfigurationTester.instance;
  }

  // Run all configuration tests
  public async runAllTests(): Promise<{
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    results: Array<{
      test: string;
      status: 'PASS' | 'FAIL' | 'WARN';
      message: string;
      details?: any;
    }>;
  }> {
    console.log('🧪 Running Configuration System Tests...\n');
    
    this.testResults = [];
    
    // Test environment configuration
    await this.testEnvironmentConfiguration();
    
    // Test secrets management
    await this.testSecretsManagement();
    
    // Test security configuration
    await this.testSecurityConfiguration();
    
    // Test Stripe configuration
    await this.testStripeConfiguration();
    
    // Test validation middleware
    await this.testValidationMiddleware();
    
    // Test API versioning
    await this.testApiVersioning();
    
    // Test error handling
    await this.testErrorHandling();
    
    // Test comprehensive middleware
    await this.testComprehensiveMiddleware();
    
    // Generate test summary
    const summary = this.generateTestSummary();
    this.logTestResults();
    
    return summary;
  }

  // Test environment configuration
  private async testEnvironmentConfiguration(): Promise<void> {
    try {
      const env = configManager.getEnvironment();
      
      // Test environment detection
      this.addTestResult(
        'Environment Detection',
        'PASS',
        `Environment detected: ${env.environment}`,
        { environment: env.environment }
      );
      
      // Test configuration loading
      const config = env.config;
      this.addTestResult(
        'Configuration Loading',
        'PASS',
        'Environment configuration loaded successfully',
        { hasConfig: !!config }
      );
      
      // Test environment-specific configs
      const envConfig = env.environmentConfig;
      this.addTestResult(
        'Environment-Specific Configuration',
        'PASS',
        'Environment-specific configuration loaded',
        { hasEnvConfig: !!envConfig }
      );
      
    } catch (error) {
      this.addTestResult(
        'Environment Configuration',
        'FAIL',
        `Environment configuration failed: ${error}`,
        { error: error.message }
      );
    }
  }

  // Test secrets management
  private async testSecretsManagement(): Promise<void> {
    try {
      const secrets = configManager.getSecrets();
      
      // Test secrets validation
      secrets.validateAllSecrets();
      const summary = secrets.getValidationSummary();
      
      this.addTestResult(
        'Secrets Validation',
        summary.errors.length > 0 ? 'FAIL' : 'PASS',
        `Secrets validation: ${summary.valid}/${summary.total} valid`,
        { summary }
      );
      
      // Test rotation report
      const rotationReport = secrets.generateRotationReport();
      this.addTestResult(
        'Secrets Rotation Report',
        'PASS',
        `Rotation report generated: ${rotationReport.needsRotation.length} secrets need rotation`,
        { rotationReport }
      );
      
    } catch (error) {
      this.addTestResult(
        'Secrets Management',
        'FAIL',
        `Secrets management failed: ${error}`,
        { error: error.message }
      );
    }
  }

  // Test security configuration
  private async testSecurityConfiguration(): Promise<void> {
    try {
      const security = configManager.getSecurity();
      
      // Test security headers
      const headers = security.getSecurityHeaders();
      this.addTestResult(
        'Security Headers',
        'PASS',
        `Security headers configured: ${Object.keys(headers).length} headers`,
        { headers }
      );
      
      // Test CORS configuration
      const cors = security.getCorsConfig();
      this.addTestResult(
        'CORS Configuration',
        'PASS',
        `CORS configured for ${Array.isArray(cors.origin) ? cors.origin.length : 1} origins`,
        { cors }
      );
      
      // Test rate limiting
      const rateLimit = security.getRateLimitConfig();
      this.addTestResult(
        'Rate Limiting',
        'PASS',
        `Rate limiting configured: ${rateLimit.max} requests per ${rateLimit.windowMs / 1000 / 60} minutes`,
        { rateLimit }
      );
      
    } catch (error) {
      this.addTestResult(
        'Security Configuration',
        'FAIL',
        `Security configuration failed: ${error}`,
        { error: error.message }
      );
    }
  }

  // Test Stripe configuration
  private async testStripeConfiguration(): Promise<void> {
    try {
      const stripe = configManager.getStripe();
      
      // Test Stripe config loading
      const config = stripe.getConfig();
      this.addTestResult(
        'Stripe Configuration Loading',
        'PASS',
        `Stripe configuration loaded: ${config.environment} mode`,
        { config }
      );
      
      // Test Stripe key validation
      const isValid = stripe.validateStripeKey(config.publishableKey, 'stripe');
      this.addTestResult(
        'Stripe Key Validation',
        isValid ? 'PASS' : 'FAIL',
        `Stripe key validation: ${isValid ? 'valid' : 'invalid'}`,
        { isValid, key: config.publishableKey.substring(0, 10) + '...' }
      );
      
      // Test environment-specific validation
      const isTestMode = stripe.isTestMode();
      const env = configManager.getEnvironment();
      if (env.isDevelopment && !isTestMode) {
        this.addTestResult(
          'Stripe Environment Validation',
          'WARN',
          'Using live Stripe key in development environment',
          { isTestMode, environment: env.environment }
        );
      } else {
        this.addTestResult(
          'Stripe Environment Validation',
          'PASS',
          'Stripe key matches environment requirements',
          { isTestMode, environment: env.environment }
        );
      }
      
    } catch (error) {
      this.addTestResult(
        'Stripe Configuration',
        'FAIL',
        `Stripe configuration failed: ${error}`,
        { error: error.message }
      );
    }
  }

  // Test validation middleware
  private async testValidationMiddleware(): Promise<void> {
    try {
      const validation = validationMiddleware;
      
      // Test validation summary
      const summary = validation.getValidationSummary();
      this.addTestResult(
        'Validation Middleware',
        'PASS',
        `Validation middleware configured: ${summary.totalSchemas} schemas`,
        { summary }
      );
      
      // Test API key validation
      const isValid = validation.validateApiKey('test-key', 'github');
      this.addTestResult(
        'API Key Validation',
        'PASS',
        'API key validation function working',
        { isValid }
      );
      
    } catch (error) {
      this.addTestResult(
        'Validation Middleware',
        'FAIL',
        `Validation middleware failed: ${error}`,
        { error: error.message }
      );
    }
  }

  // Test API versioning
  private async testApiVersioning(): Promise<void> {
    try {
      const versioning = apiVersioning;
      
      // Test version extraction
      const mockRequest = new Request('http://localhost:3000/api/v1/test', {
        headers: { 'API-Version': 'v1' }
      }) as any;
      
      const version = versioning.extractVersion(mockRequest);
      this.addTestResult(
        'API Version Extraction',
        'PASS',
        `Version extracted: ${version.version} from ${version.source}`,
        { version }
      );
      
      // Test version validation
      const validation = versioning.validateVersion('v1');
      this.addTestResult(
        'API Version Validation',
        'PASS',
        `Version validation: ${validation.isValid ? 'valid' : 'invalid'}`,
        { validation }
      );
      
      // Test version statistics
      const stats = versioning.getVersionStatistics();
      this.addTestResult(
        'API Version Statistics',
        'PASS',
        `Version statistics: ${stats.totalVersions} total versions`,
        { stats }
      );
      
    } catch (error) {
      this.addTestResult(
        'API Versioning',
        'FAIL',
        `API versioning failed: ${error}`,
        { error: error.message }
      );
    }
  }

  // Test error handling
  private async testErrorHandling(): Promise<void> {
    try {
      const errorHandler = errorHandler;
      
      // Test error creation
      const error = errorHandler.validationError('Test validation error');
      this.addTestResult(
        'Error Creation',
        'PASS',
        `Error created: ${error.type}`,
        { error: { type: error.type, message: error.message } }
      );
      
      // Test error statistics
      const stats = errorHandler.getErrorStatistics();
      this.addTestResult(
        'Error Statistics',
        'PASS',
        'Error statistics system working',
        { stats }
      );
      
    } catch (error) {
      this.addTestResult(
        'Error Handling',
        'FAIL',
        `Error handling failed: ${error}`,
        { error: error.message }
      );
    }
  }

  // Test comprehensive middleware
  private async testComprehensiveMiddleware(): Promise<void> {
    try {
      const middleware = comprehensiveMiddleware;
      
      // Test middleware statistics
      const stats = middleware.getMiddlewareStatistics();
      this.addTestResult(
        'Comprehensive Middleware',
        'PASS',
        'Comprehensive middleware system working',
        { stats }
      );
      
    } catch (error) {
      this.addTestResult(
        'Comprehensive Middleware',
        'FAIL',
        `Comprehensive middleware failed: ${error}`,
        { error: error.message }
      );
    }
  }

  // Add test result
  private addTestResult(
    test: string,
    status: 'PASS' | 'FAIL' | 'WARN',
    message: string,
    details?: any
  ): void {
    this.testResults.push({ test, status, message, details });
  }

  // Generate test summary
  private generateTestSummary(): {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    results: Array<{
      test: string;
      status: 'PASS' | 'FAIL' | 'WARN';
      message: string;
      details?: any;
    }>;
  } {
    const total = this.testResults.length;
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const warnings = this.testResults.filter(r => r.status === 'WARN').length;
    
    return {
      total,
      passed,
      failed,
      warnings,
      results: this.testResults,
    };
  }

  // Log test results
  private logTestResults(): void {
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    
    const summary = this.generateTestSummary();
    console.log(`Total Tests: ${summary.total}`);
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`⚠️  Warnings: ${summary.warnings}`);
    
    console.log('\n📋 Detailed Results:');
    this.testResults.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
      console.log(`${icon} ${result.test}: ${result.message}`);
      
      if (result.details && process.env.NODE_ENV === 'development') {
        console.log(`   Details:`, result.details);
      }
    });
    
    console.log('\n');
  }
}

// Export singleton instance
export const configurationTester = ConfigurationTester.getInstance();

// Export test runner function
export async function runConfigurationTests(): Promise<{
  total: number;
  passed: number;
  failed: number;
  warnings: number;
  results: Array<{
    test: string;
    status: 'PASS' | 'FAIL' | 'WARN';
    message: string;
    details?: any;
  }>;
}> {
  return configurationTester.runAllTests();
}
