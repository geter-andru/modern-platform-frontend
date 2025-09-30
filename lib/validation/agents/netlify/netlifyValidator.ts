/**
 * Netlify Deployment Validator
 * 
 * Validates Netlify-specific configuration and deployment settings
 * to ensure secure and proper deployment.
 */

import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { z } from 'zod';

// Netlify validation result schema
export const NetlifyValidationResult = z.object({
  success: z.boolean(),
  configValid: z.boolean(),
  environmentReady: z.boolean(),
  buildSettings: z.object({
    command: z.string(),
    publish: z.string(),
    nodeVersion: z.string().optional()
  }),
  error: z.string().optional(),
  warnings: z.array(z.string()).optional()
});

export type NetlifyValidationResult = z.infer<typeof NetlifyValidationResult>;

export class NetlifyValidator {
  private projectRoot: string;
  private configPath: string;

  constructor() {
    this.projectRoot = process.cwd();
    this.configPath = path.join(this.projectRoot, 'netlify.toml');
  }

  /**
   * Validate Netlify configuration and deployment readiness
   */
  async validateNetlifyDeployment(): Promise<NetlifyValidationResult> {
    console.log(chalk.blue('🌐 Validating Netlify deployment configuration...'));

    try {
      // Check if netlify.toml exists
      const configExists = fs.existsSync(this.configPath);
      if (!configExists) {
        return {
          success: false,
          configValid: false,
          environmentReady: false,
          buildSettings: {
            command: 'NOT_CONFIGURED',
            publish: 'NOT_CONFIGURED'
          },
          error: 'netlify.toml configuration file not found'
        };
      }

      // Parse and validate netlify.toml
      const configContent = fs.readFileSync(this.configPath, 'utf8');
      const configValidation = this.validateNetlifyConfig(configContent);

      // Check environment variables for Netlify
      const environmentReady = this.validateNetlifyEnvironment();

      // Extract build settings
      const buildSettings = this.extractBuildSettings(configContent);

      const success = configValidation.valid && environmentReady;

      if (success) {
        console.log(chalk.green('✅ Netlify deployment configuration valid'));
      } else {
        console.log(chalk.red('❌ Netlify deployment configuration invalid'));
        if (!configValidation.valid) {
          console.log(chalk.red(`   Config issues: ${configValidation.issues?.join(', ')}`));
        }
        if (!environmentReady) {
          console.log(chalk.red('   Environment variables not ready for deployment'));
        }
      }

      return {
        success,
        configValid: configValidation.valid,
        environmentReady,
        buildSettings,
        error: success ? undefined : 'Netlify deployment configuration invalid',
        warnings: configValidation.warnings
      };

    } catch (error) {
      console.log(chalk.red(`❌ Netlify validation error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      return {
        success: false,
        configValid: false,
        environmentReady: false,
        buildSettings: {
          command: 'ERROR',
          publish: 'ERROR'
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Validate netlify.toml configuration
   */
  private validateNetlifyConfig(configContent: string): { valid: boolean; issues?: string[]; warnings?: string[] } {
    const issues: string[] = [];
    const warnings: string[] = [];

    // Check for required sections
    if (!configContent.includes('[build]')) {
      issues.push('Missing [build] section');
    }

    // Check for secure build command
    if (configContent.includes('command = "npm run build"')) {
      warnings.push('Using insecure build command. Consider using "npm run build:secure"');
    }

    if (!configContent.includes('build:secure') && !configContent.includes('validate')) {
      issues.push('Build command does not include security validation');
    }

    // Check for proper publish directory
    if (!configContent.includes('publish = ".next"')) {
      warnings.push('Publish directory should be ".next" for Next.js apps');
    }

    // Check for security headers
    if (!configContent.includes('X-Frame-Options')) {
      warnings.push('Missing security headers configuration');
    }

    // Check for proper redirects
    if (!configContent.includes('[[redirects]]')) {
      warnings.push('Missing redirects configuration for SPA routing');
    }

    return {
      valid: issues.length === 0,
      issues: issues.length > 0 ? issues : undefined,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Validate environment variables for Netlify deployment
   */
  private validateNetlifyEnvironment(): boolean {
    const requiredForDeployment = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    // In Netlify, environment variables are set in the dashboard
    // We can only check if they would be available at build time
    const hasRequiredVars = requiredForDeployment.every(varName => {
      // Check if variable is defined (either in .env or will be set in Netlify)
      return process.env[varName] || process.env[`NETLIFY_${varName}`];
    });

    // For local development, be more lenient
    if (!hasRequiredVars && process.env.NODE_ENV !== 'production') {
      console.log(chalk.yellow('⚠️  Environment variables not ready for deployment (local dev)'));
      console.log(chalk.yellow('   These will be required for Netlify deployment'));
      return true; // Don't fail validation in local development
    }

    return hasRequiredVars;
  }

  /**
   * Extract build settings from netlify.toml
   */
  private extractBuildSettings(configContent: string): { command: string; publish: string; nodeVersion?: string } {
    const settings: { command: string; publish: string; nodeVersion?: string } = {
      command: 'NOT_FOUND',
      publish: 'NOT_FOUND'
    };

    // Extract command
    const commandMatch = configContent.match(/command\s*=\s*["']([^"']+)["']/);
    if (commandMatch) {
      settings.command = commandMatch[1];
    }

    // Extract publish directory
    const publishMatch = configContent.match(/publish\s*=\s*["']([^"']+)["']/);
    if (publishMatch) {
      settings.publish = publishMatch[1];
    }

    // Extract Node version
    const nodeMatch = configContent.match(/NODE_VERSION\s*=\s*["']([^"']+)["']/);
    if (nodeMatch) {
      settings.nodeVersion = nodeMatch[1];
    }

    return settings;
  }

  /**
   * Get Netlify deployment summary
   */
  getNetlifySummary(): Record<string, any> {
    const summary: Record<string, any> = {
      configExists: fs.existsSync(this.configPath),
      configPath: this.configPath,
      timestamp: new Date().toISOString()
    };

    if (summary.configExists) {
      try {
        const configContent = fs.readFileSync(this.configPath, 'utf8');
        summary.buildSettings = this.extractBuildSettings(configContent);
        summary.configValidation = this.validateNetlifyConfig(configContent);
        summary.environmentReady = this.validateNetlifyEnvironment();
      } catch (error) {
        summary.error = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    return summary;
  }
}

export const netlifyValidator = new NetlifyValidator();

// CLI execution
async function main() {
  const validator = new NetlifyValidator();
  const result = await validator.validateNetlifyDeployment();
  
  if (result.success) {
    console.log(chalk.green('✅ Netlify deployment validation completed successfully'));
    process.exit(0);
  } else {
    console.log(chalk.red('❌ Netlify deployment validation failed'));
    console.log(chalk.red(`Error: ${result.error}`));
    process.exit(1);
  }
}

// ES module entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
