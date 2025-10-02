#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const TypeScriptErrorAgent = require('./typescript-error-agent');

/**
 * TypeScript Error Agent Event-Based Trigger System
 * This system triggers the TypeScript Error Agent only during specific events:
 * - Build processes
 * - TypeScript migrations
 * - Pre-commit hooks
 * - CI/CD pipelines
 */

class TypeScriptErrorAgentTrigger {
  constructor() {
    this.agent = null;
    this.triggerEvents = {
      'build': false,
      'migration': false,
      'pre-commit': false,
      'ci': false
    };
  }

  /**
   * Check if we should trigger the error agent based on current context
   */
  shouldTrigger() {
    const args = process.argv.slice(2);
    const env = process.env;
    
    // Check for explicit trigger flags
    if (args.includes('--trigger-build') || args.includes('--build')) {
      this.triggerEvents.build = true;
      return true;
    }
    
    if (args.includes('--trigger-migration') || args.includes('--migration')) {
      this.triggerEvents.migration = true;
      return true;
    }
    
    if (args.includes('--trigger-pre-commit') || args.includes('--pre-commit')) {
      this.triggerEvents.preCommit = true;
      return true;
    }
    
    if (args.includes('--trigger-ci') || args.includes('--ci')) {
      this.triggerEvents.ci = true;
      return true;
    }
    
    // Check environment variables
    if (env.NODE_ENV === 'production' || env.CI === 'true') {
      this.triggerEvents.ci = true;
      return true;
    }
    
    if (env.BUILD_MODE === 'true' || env.BUILD === 'true') {
      this.triggerEvents.build = true;
      return true;
    }
    
    // Check if we're in a build script context
    if (this.isBuildContext()) {
      this.triggerEvents.build = true;
      return true;
    }
    
    // Check if we're in a migration context
    if (this.isMigrationContext()) {
      this.triggerEvents.migration = true;
      return true;
    }
    
    return false;
  }

  /**
   * Check if we're in a build context
   */
  isBuildContext() {
    const args = process.argv.slice(2);
    const npmScript = process.env.npm_lifecycle_event;
    
    // Check npm script names
    if (npmScript && (
      npmScript.includes('build') ||
      npmScript.includes('compile') ||
      npmScript.includes('type-check') ||
      npmScript.includes('pre-build') ||
      npmScript.includes('post-build')
    )) {
      return true;
    }
    
    // Check command line arguments
    if (args.some(arg => 
      arg.includes('build') || 
      arg.includes('compile') || 
      arg.includes('type-check')
    )) {
      return true;
    }
    
    return false;
  }

  /**
   * Check if we're in a migration context
   */
  isMigrationContext() {
    const args = process.argv.slice(2);
    const npmScript = process.env.npm_lifecycle_event;
    
    // Check npm script names
    if (npmScript && (
      npmScript.includes('migrate') ||
      npmScript.includes('migration') ||
      npmScript.includes('ts-migrate') ||
      npmScript.includes('typescript-migrate')
    )) {
      return true;
    }
    
    // Check command line arguments
    if (args.some(arg => 
      arg.includes('migrate') || 
      arg.includes('migration') || 
      arg.includes('ts-migrate')
    )) {
      return true;
    }
    
    return false;
  }

  /**
   * Run the TypeScript Error Agent with appropriate settings for the trigger event
   */
  async run() {
    if (!this.shouldTrigger()) {
      console.log('🚫 TypeScript Error Agent not triggered - not in build/migration context');
      return { triggered: false, reason: 'Not in build/migration context' };
    }

    console.log('🎯 TypeScript Error Agent triggered by event:', this.getTriggerEvent());
    
    // Configure agent based on trigger event
    const options = this.getAgentOptions();
    this.agent = new TypeScriptErrorAgent(options);
    
    try {
      const result = await this.agent.run();
      return { triggered: true, event: this.getTriggerEvent(), result };
    } catch (error) {
      console.error('❌ TypeScript Error Agent failed:', error.message);
      return { triggered: true, event: this.getTriggerEvent(), error: error.message };
    }
  }

  /**
   * Get the current trigger event
   */
  getTriggerEvent() {
    for (const [event, triggered] of Object.entries(this.triggerEvents)) {
      if (triggered) return event;
    }
    return 'unknown';
  }

  /**
   * Get agent options based on trigger event
   */
  getAgentOptions() {
    const baseOptions = {
      projectRoot: process.cwd(),
      verbose: process.argv.includes('--verbose'),
      backup: true,
      dryRun: process.argv.includes('--dry-run')
    };

    if (this.triggerEvents.build) {
      return {
        ...baseOptions,
        autoFix: true,
        maxFiles: 200,
        maxErrorsPerFile: 100
      };
    }

    if (this.triggerEvents.migration) {
      return {
        ...baseOptions,
        autoFix: true,
        maxFiles: 500,
        maxErrorsPerFile: 200,
        verbose: true
      };
    }

    if (this.triggerEvents.preCommit) {
      return {
        ...baseOptions,
        autoFix: true,
        maxFiles: 50,
        maxErrorsPerFile: 25
      };
    }

    if (this.triggerEvents.ci) {
      return {
        ...baseOptions,
        autoFix: false, // Don't auto-fix in CI, just report
        maxFiles: 1000,
        maxErrorsPerFile: 500
      };
    }

    return baseOptions;
  }
}

// CLI Interface
if (require.main === module) {
  const trigger = new TypeScriptErrorAgentTrigger();
  
  trigger.run()
    .then(result => {
      if (result.triggered) {
        console.log(`\n🎉 TypeScript Error Agent completed for event: ${result.event}`);
        if (result.error) {
          process.exit(1);
        }
      }
    })
    .catch(error => {
      console.error('❌ TypeScript Error Agent Trigger failed:', error.message);
      process.exit(1);
    });
}

module.exports = TypeScriptErrorAgentTrigger;
