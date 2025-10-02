#!/usr/bin/env node

/**
 * H&S Platform Validation Orchestrator
 * Prevents customer-facing failures by orchestrating 4 validation agents
 * Business Purpose: Ensure zero-downtime deployments across H&S Platform ecosystem
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const chalk = require('chalk').default || require('chalk');
const { default: ora } = require('ora');

class HSValidationOrchestrator {
  constructor() {
    this.startTime = Date.now();
    this.projectRoot = this.detectProjectRoot();
    this.hsContext = this.loadHSContext();
    this.results = {
      security: null,
      compatibility: null, 
      netlifyCore: null,
      chaos: null,
      netlifyProtection: null
    };
  }

  detectProjectRoot() {
    // Look for H_S_VALIDATION_CONTEXT.json in parent directories
    let currentDir = process.cwd();
    while (currentDir !== path.dirname(currentDir)) {
      const contextPath = path.join(currentDir, 'H_S_VALIDATION_CONTEXT.json');
      if (fs.existsSync(contextPath)) {
        const context = JSON.parse(fs.readFileSync(contextPath, 'utf8'));
        if (context.appName === 'modern-platform' && fs.existsSync(path.join(currentDir, 'app'))) {
          return currentDir;
        }
      }
      currentDir = path.dirname(currentDir);
    }
    
    // If not found, try specific known paths
    const knownPaths = [
      '/Users/geter/andru/hs-andru-test/modern-platform',
      '../hs-andru-test/modern-platform'
    ];
    
    for (const checkPath of knownPaths) {
      const fullPath = path.resolve(checkPath);
      if (fs.existsSync(path.join(fullPath, 'H_S_VALIDATION_CONTEXT.json'))) {
        return fullPath;
      }
    }
    
    return process.cwd();
  }

  loadHSContext() {
    try {
      const contextPath = path.join(this.projectRoot, 'H_S_VALIDATION_CONTEXT.json');
      if (fs.existsSync(contextPath)) {
        return JSON.parse(fs.readFileSync(contextPath, 'utf8'));
      }
    } catch (error) {
      console.error(chalk.red('❌ BUSINESS CRITICAL: Could not load H&S validation context'));
      process.exit(1);
    }
    
    console.error(chalk.red('❌ BUSINESS CRITICAL: H_S_VALIDATION_CONTEXT.json not found'));
    process.exit(1);
  }

  async executeAgent(agentPath, args = []) {
    return new Promise((resolve, reject) => {
      const child = spawn('node', [agentPath, ...args], {
        cwd: this.projectRoot,
        stdio: ['inherit', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
        process.stdout.write(data);
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
        process.stderr.write(data);
      });

      child.on('close', (code) => {
        resolve({
          exitCode: code,
          stdout,
          stderr,
          success: code === 0
        });
      });

      child.on('error', reject);
    });
  }

  async runSecurityValidation() {
    const spinner = ora('Running security secrets scan...').start();
    
    try {
      const agentPath = path.join(__dirname, 'security-secrets-prevention-agent/scripts/scan-repository.js');
      const result = await this.executeAgent(agentPath);
      
      this.results.security = result;
      
      if (!result.success) {
        spinner.fail('BUSINESS CRITICAL: Secrets detected - customer data at risk');
        throw new Error('Security validation failed - secrets detected');
      }
      
      spinner.succeed('Security validation passed');
      return result;
      
    } catch (error) {
      spinner.fail('Security validation failed');
      throw error;
    }
  }

  async runCompatibilityValidation() {
    const spinner = ora(`Running ${this.hsContext.appType} compatibility validation...`).start();
    
    try {
      const agentPath = path.join(__dirname, 'compatibility-agent/src/index.js');
      const result = await this.executeAgent(agentPath);
      
      this.results.compatibility = result;
      
      if (!result.success) {
        spinner.fail('BUSINESS CRITICAL: Integration failure risk - customer platform unstable');
        throw new Error('Compatibility validation failed');
      }
      
      spinner.succeed('Compatibility validation passed');
      return result;
      
    } catch (error) {
      spinner.fail('Compatibility validation failed');
      throw error;
    }
  }

  async runNetlifyValidation(phases = ['1', '2']) {
    const phaseDesc = phases.join('+');
    const spinner = ora(`Running Netlify Phase ${phaseDesc} validation...`).start();
    
    try {
      const agentPath = path.join(__dirname, 'netlify-test-agent.js');
      const args = phases.length === 1 ? [`--phase${phases[0]}`] : [`--phase1`, `--phase2`];
      const result = await this.executeAgent(agentPath, args);
      
      if (phases.join('') === '12') {
        this.results.netlifyCore = result;
      } else if (phases.join('') === '3') {
        this.results.netlifyProtection = result;
      }
      
      if (!result.success) {
        const errorType = phases.includes('3') ? 'Git protection disabled' : 'Build failure';
        spinner.fail(`BUSINESS CRITICAL: ${errorType} - deployment safety compromised`);
        throw new Error(`Netlify Phase ${phaseDesc} validation failed`);
      }
      
      spinner.succeed(`Netlify Phase ${phaseDesc} validation passed`);
      return result;
      
    } catch (error) {
      spinner.fail(`Netlify Phase ${phaseDesc} validation failed`);
      throw error;
    }
  }

  async runChaosValidation() {
    const spinner = ora('Running chaos resilience validation...').start();
    
    try {
      const agentPath = path.join(__dirname, 'chaos-testing-agent/src/index.js');
      const result = await this.executeAgent(agentPath);
      
      this.results.chaos = result;
      
      // Chaos is non-critical - warn but don't block
      if (!result.success) {
        spinner.warn('BUSINESS WARNING: Platform may degrade under stress');
        console.log(chalk.yellow('⚠️  Resilience score below threshold - customer experience may suffer'));
      } else {
        spinner.succeed('Chaos validation passed');
      }
      
      return result;
      
    } catch (error) {
      spinner.warn('Chaos validation encountered issues');
      console.log(chalk.yellow('⚠️  Could not complete resilience testing'));
      return { success: false, exitCode: 1 };
    }
  }

  generateReport() {
    const duration = (Date.now() - this.startTime) / 1000;
    const appName = this.hsContext.appName || 'H&S Platform';
    
    console.log(chalk.blue.bold('\n📊 H&S PLATFORM VALIDATION REPORT'));
    console.log(chalk.blue('='.repeat(50)));
    console.log(chalk.cyan(`App: ${appName}`));
    console.log(chalk.cyan(`Type: ${this.hsContext.appType}`));
    console.log(chalk.cyan(`Architecture: ${this.hsContext.architecture}`));
    console.log(chalk.cyan(`Duration: ${duration.toFixed(2)}s`));
    console.log(chalk.blue('='.repeat(50)));

    const steps = [
      { name: 'Security Secrets', result: this.results.security, critical: true },
      { name: 'Compatibility', result: this.results.compatibility, critical: true },
      { name: 'Netlify Core', result: this.results.netlifyCore, critical: true },
      { name: 'Chaos Resilience', result: this.results.chaos, critical: false },
      { name: 'Git Protection', result: this.results.netlifyProtection, critical: true }
    ];

    let criticalFailures = 0;
    let warnings = 0;

    steps.forEach(step => {
      if (!step.result) {
        console.log(chalk.gray(`⚪ ${step.name}: Not executed`));
        return;
      }

      if (step.result.success) {
        console.log(chalk.green(`✅ ${step.name}: Passed`));
      } else {
        if (step.critical) {
          criticalFailures++;
          console.log(chalk.red(`❌ ${step.name}: FAILED (CRITICAL)`));
        } else {
          warnings++;
          console.log(chalk.yellow(`⚠️  ${step.name}: Warning`));
        }
      }
    });

    console.log(chalk.blue('='.repeat(50)));
    
    if (criticalFailures === 0) {
      console.log(chalk.green.bold('✅ VALIDATION PASSED - SAFE TO COMMIT'));
      console.log(chalk.green(`Customer platform protection: ACTIVE`));
      if (warnings > 0) {
        console.log(chalk.yellow(`Warnings: ${warnings} (non-blocking)`));
      }
      return true;
    } else {
      console.log(chalk.red.bold('❌ VALIDATION FAILED - COMMIT BLOCKED'));
      console.log(chalk.red(`Critical failures: ${criticalFailures}`));
      console.log(chalk.red('🛡️ Customer platform protection: ACTIVATED'));
      return false;
    }
  }

  async runFullValidation() {
    const appName = this.hsContext.appName || 'H&S Platform';
    console.log(chalk.magenta.bold(`🎯 ${appName} Validation Pipeline Starting...\n`));
    
    try {
      // Step 1: Security (CRITICAL)
      console.log(chalk.cyan('🔒 Step 1: Security Secrets Validation'));
      await this.runSecurityValidation();
      
      // Step 2: Compatibility (CRITICAL) 
      console.log(chalk.cyan('\n🔧 Step 2: Integration Compatibility Validation'));
      await this.runCompatibilityValidation();
      
      // Step 3: Netlify Core (CRITICAL)
      console.log(chalk.cyan('\n🏗️ Step 3: Build & Deployment Validation'));
      await this.runNetlifyValidation(['1', '2']);
      
      // Step 4: Chaos (WARNING ONLY)
      console.log(chalk.cyan('\n🌪️ Step 4: Resilience & Stress Testing'));
      await this.runChaosValidation();
      
      // Step 5: Git Protection (CRITICAL)
      console.log(chalk.cyan('\n🛡️ Step 5: Git Protection System'));
      await this.runNetlifyValidation(['3']);
      
      const success = this.generateReport();
      process.exit(success ? 0 : 1);
      
    } catch (error) {
      console.error(chalk.red.bold('\n❌ VALIDATION PIPELINE FAILED'));
      console.error(chalk.red('🛡️ Customer platform protection: ACTIVATED'));
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  }
}

// CLI execution
async function main() {
  const orchestrator = new HSValidationOrchestrator();
  await orchestrator.runFullValidation();
}

if (require.main === module) {
  main();
}

module.exports = HSValidationOrchestrator;