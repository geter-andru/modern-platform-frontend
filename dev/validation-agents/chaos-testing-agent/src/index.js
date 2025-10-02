const chalk = require('chalk');
const NextJSStressValidator = require('./validators/nextjs-stress-test');
const SupabaseFailureValidator = require('./validators/supabase-failure-injection');
const ComponentChaosValidator = require('./validators/component-chaos');
const BuildSystemChaosValidator = require('./validators/build-system-chaos');
const AuthChaosValidator = require('./validators/auth-chaos');

class NextJSChaosTestingAgent {
  constructor() {
    this.hsContext = this.loadHSContext();
    this.validators = {
      nextjsStress: new NextJSStressValidator(),
      supabaseFailure: new SupabaseFailureValidator(),
      componentChaos: new ComponentChaosValidator(),
      buildSystemChaos: new BuildSystemChaosValidator(),
      authChaos: new AuthChaosValidator()
    };
  }

  loadHSContext() {
    const fs = require('fs');
    const path = require('path');
    const cwd = process.cwd();
    
    try {
      const contextPath = path.join(cwd, 'H_S_VALIDATION_CONTEXT.json');
      if (fs.existsSync(contextPath)) {
        return JSON.parse(fs.readFileSync(contextPath, 'utf8'));
      }
    } catch (error) {
      console.warn('Could not load H&S context, using defaults');
    }
    
    return { appType: 'unknown', architecture: 'nextjs' };
  }

  async runFullChaosValidation() {
    const appName = this.hsContext.appName || 'H&S Platform';
    console.log(chalk.red.bold(`🌪️  ${appName} Chaos Testing Agent\n`));
    console.log(chalk.yellow(`Validating ${this.hsContext.appType} app resilience under adverse conditions\n`));

    const results = {};

    // Run all chaos validation categories
    console.log(chalk.magenta('💥 Running Next.js Stress Test Validation...'));
    results.nextjsStress = await this.validators.nextjsStress.runFullValidation();
    
    console.log(chalk.magenta('\n💥 Running Supabase Failure Injection...'));
    results.supabaseFailure = await this.validators.supabaseFailure.runFullValidation();
    
    console.log(chalk.magenta('\n💥 Running Component Chaos Validation...'));
    results.componentChaos = await this.validators.componentChaos.runFullValidation();
    
    console.log(chalk.magenta('\n💥 Running Build System Chaos...'));
    results.buildSystemChaos = await this.validators.buildSystemChaos.runFullValidation();
    
    console.log(chalk.magenta('\n💥 Running Auth Chaos Validation...'));
    results.authChaos = await this.validators.authChaos.runFullValidation();

    // Calculate overall resilience score
    const resilienceScore = Math.round(
      (results.nextjsStress.overallScore + 
       results.supabaseFailure.overallScore + 
       results.componentChaos.overallScore + 
       results.buildSystemChaos.overallScore + 
       results.authChaos.overallScore) / 5
    );

    // Generate resilience scorecard
    this.generateResilienceScorecard(results, resilienceScore);

    return { resilienceScore, results };
  }

  generateResilienceScorecard(results, resilienceScore) {
    console.log(chalk.red.bold('\n🛡️  NEXT.JS PLATFORM RESILIENCE SCORECARD'));
    console.log(chalk.red('='.repeat(55)));
    
    console.log(chalk.cyan(`Next.js Stress Resilience: ${results.nextjsStress.overallScore}/100`));
    console.log(chalk.cyan(`Supabase Failure Recovery: ${results.supabaseFailure.overallScore}/100`));
    console.log(chalk.cyan(`Component Chaos Resilience: ${results.componentChaos.overallScore}/100`));
    console.log(chalk.cyan(`Build System Resilience: ${results.buildSystemChaos.overallScore}/100`));
    console.log(chalk.cyan(`Auth Chaos Recovery: ${results.authChaos.overallScore}/100`));
    
    console.log(chalk.red('='.repeat(55)));
    console.log(chalk.bold.cyan(`Overall Resilience Score: ${resilienceScore}/100`));

    // Deployment resilience decision
    if (resilienceScore >= 85) {
      console.log(chalk.green.bold('\n✅ RESILIENCE VALIDATED'));
      console.log(chalk.green('Next.js platform ready for enterprise deployment under stress'));
    } else {
      console.log(chalk.red.bold('\n❌ RESILIENCE FAILURE'));
      console.log(chalk.red('Platform not ready for production - Critical weakness detected'));
      
      // Identify weak points
      const weakAreas = [];
      if (results.nextjsStress.overallScore < 90) weakAreas.push('Next.js Stress Resilience');
      if (results.supabaseFailure.overallScore < 85) weakAreas.push('Supabase Failure Recovery');
      if (results.componentChaos.overallScore < 80) weakAreas.push('Component Chaos Resilience');
      if (results.buildSystemChaos.overallScore < 85) weakAreas.push('Build System Resilience');
      if (results.authChaos.overallScore < 85) weakAreas.push('Auth Chaos Recovery');
      
      if (weakAreas.length > 0) {
        console.log(chalk.red(`\nWeak Areas: ${weakAreas.join(', ')}`));
      }
    }

    this.validateBusinessProtectionMechanisms(results);
  }

  validateBusinessProtectionMechanisms(results) {
    console.log(chalk.red.bold('\n💼 NEXT.JS BUSINESS PROTECTION VALIDATION'));
    
    const businessChecks = [
      {
        name: 'Supabase Auth → Platform Recovery',
        passed: results.supabaseFailure.overallScore >= 85,
        requirement: 'MUST be 85+ for customer retention'
      },
      {
        name: 'Component Error Boundaries',
        passed: results.componentChaos.overallScore >= 80,
        requirement: 'MUST be 80+ for enterprise credibility'
      },
      {
        name: 'Build System Stability',
        passed: results.buildSystemChaos.overallScore >= 85,
        requirement: 'MUST be 85+ for deployment confidence'
      },
      {
        name: 'Authentication Resilience',
        passed: results.authChaos.overallScore >= 85,
        requirement: 'MUST be 85+ for security integrity'
      }
    ];

    businessChecks.forEach(check => {
      const icon = check.passed ? '✅' : '❌';
      const color = check.passed ? chalk.green : chalk.red;
      console.log(color(`${icon} ${check.name}: ${check.requirement}`));
    });

    const allBusinessProtected = businessChecks.every(check => check.passed);
    
    if (!allBusinessProtected) {
      console.log(chalk.red.bold('\n🚨 BUSINESS PROTECTION FAILURE - DO NOT DEPLOY'));
      console.log(chalk.red('Customer revenue and professional credibility at risk'));
    } else {
      console.log(chalk.green.bold('\n🎯 ALL BUSINESS PROTECTIONS VALIDATED'));
      console.log(chalk.green('Platform maintains professional standards under chaos'));
    }
  }

  // Safe chaos testing methods
  async runGentleChaosTest() {
    console.log(chalk.yellow.bold('🌀 Running Gentle Chaos Test - Safe for Production'));
    
    return {
      nextjsStress: await this.validators.nextjsStress.runGentleTest(),
      componentChaos: await this.validators.componentChaos.runGentleTest()
    };
  }

  async runSupabaseChaosTest() {
    console.log(chalk.red.bold('🔥 Running Supabase Chaos Test'));
    console.log(chalk.yellow('Testing authentication, session, and database resilience'));
    
    return {
      supabaseFailure: await this.validators.supabaseFailure.runBusinessCriticalTest(),
      authChaos: await this.validators.authChaos.runBusinessCriticalTest()
    };
  }
}

module.exports = NextJSChaosTestingAgent;