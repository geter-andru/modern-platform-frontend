const chalk = require('chalk');
const ComponentCompatibilityValidator = require('./validators/component-compatibility');
const SupabaseIntegrationValidator = require('./validators/supabase-integration');
const PerformanceValidator = require('./validators/performance-validation');

// Use actual validators where available, placeholders otherwise
let TypeScriptValidator, BuildSystemValidator, AuthFlowValidator;
try {
  TypeScriptValidator = require('./validators/typescript-validation');
} catch (e) {
  TypeScriptValidator = require('./validators/placeholder-validators').TypeScriptValidator;
}
try {
  BuildSystemValidator = require('./validators/build-system-validation');
} catch (e) {
  BuildSystemValidator = require('./validators/placeholder-validators').BuildSystemValidator;
}
try {
  AuthFlowValidator = require('./validators/auth-flow-validation');
} catch (e) {
  AuthFlowValidator = require('./validators/placeholder-validators').AuthFlowValidator;
}

class NextJSCompatibilityAgent {
  constructor() {
    this.hsContext = this.loadHSContext();
    this.validators = {
      componentCompatibility: new ComponentCompatibilityValidator(),
      supabaseIntegration: new SupabaseIntegrationValidator(),
      performance: new PerformanceValidator(), 
      typeScript: new TypeScriptValidator(),
      buildSystem: new BuildSystemValidator(),
      authFlow: new AuthFlowValidator()
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

  async runFullCompatibilityValidation() {
    const appName = this.hsContext.appName || 'H&S Platform';
    
    // Handle integrationPoints as object (not array)
    let integrations = 'Platform integrations';
    if (this.hsContext.integrationPoints && typeof this.hsContext.integrationPoints === 'object') {
      const integrationKeys = Object.keys(this.hsContext.integrationPoints);
      integrations = integrationKeys.length > 0 ? integrationKeys.join(' → ') : 'Platform integrations';
    }
    
    console.log(chalk.yellow.bold(`🚀 ${appName} Compatibility Agent\n`));
    console.log(chalk.cyan(`Validating complete ${integrations} integration\n`));

    const results = {};

    // Run all validation categories
    console.log(chalk.magenta('📋 Running Component Compatibility Validation...'));
    results.componentCompatibility = await this.validators.componentCompatibility.runFullValidation();
    
    console.log(chalk.magenta('\n📋 Running Supabase Integration Validation...'));  
    results.supabaseIntegration = await this.validators.supabaseIntegration.runFullValidation();
    
    console.log(chalk.magenta('\n📋 Running Performance Validation...'));
    results.performance = await this.validators.performance.runFullValidation();
    
    console.log(chalk.magenta('\n📋 Running TypeScript Validation...'));
    results.typeScript = await this.validators.typeScript.runFullValidation();
    
    console.log(chalk.magenta('\n📋 Running Build System Validation...'));
    results.buildSystem = await this.validators.buildSystem.runFullValidation();

    console.log(chalk.magenta('\n📋 Running Auth Flow Validation...'));
    results.authFlow = await this.validators.authFlow.runFullValidation();

    // Calculate overall compatibility score
    const overallScore = Math.round(
      (results.componentCompatibility.overallScore + 
       results.supabaseIntegration.overallScore + 
       results.performance.overallScore + 
       results.typeScript.overallScore + 
       results.buildSystem.overallScore +
       results.authFlow.overallScore) / 6
    );

    // Generate compatibility scorecard
    this.generateCompatibilityScorecard(results, overallScore);

    return { overallScore, results };
  }

  generateCompatibilityScorecard(results, overallScore) {
    console.log(chalk.yellow.bold('\n📊 NEXT.JS PLATFORM COMPATIBILITY SCORECARD'));
    console.log(chalk.yellow('='.repeat(55)));
    
    console.log(chalk.cyan(`Component Compatibility: ${results.componentCompatibility.overallScore}/100`));
    console.log(chalk.cyan(`Supabase Integration: ${results.supabaseIntegration.overallScore}/100`));
    console.log(chalk.cyan(`Performance: ${results.performance.overallScore}/100`));
    console.log(chalk.cyan(`TypeScript: ${results.typeScript.overallScore}/100`)); 
    console.log(chalk.cyan(`Build System: ${results.buildSystem.overallScore}/100`));
    console.log(chalk.cyan(`Auth Flow: ${results.authFlow.overallScore}/100`));
    
    console.log(chalk.yellow('='.repeat(55)));
    console.log(chalk.bold.cyan(`Overall Compatibility Score: ${overallScore}/100`));

    // Deployment decision
    if (overallScore >= 90) {
      console.log(chalk.green.bold('\n✅ DEPLOYMENT APPROVED'));
      console.log(chalk.green('All critical Next.js integrations validated successfully'));
    } else {
      console.log(chalk.red.bold('\n❌ DEPLOYMENT BLOCKED'));
      console.log(chalk.red('Critical Next.js integration validation failed - Do not deploy'));
      
      // Identify failing areas
      const failingAreas = [];
      if (results.componentCompatibility.overallScore < 95) failingAreas.push('Component Compatibility');
      if (results.supabaseIntegration.overallScore < 92) failingAreas.push('Supabase Integration');
      if (results.performance.overallScore < 88) failingAreas.push('Performance');
      if (results.typeScript.overallScore < 90) failingAreas.push('TypeScript');
      if (results.buildSystem.overallScore < 94) failingAreas.push('Build System');
      if (results.authFlow.overallScore < 93) failingAreas.push('Auth Flow');
      
      if (failingAreas.length > 0) {
        console.log(chalk.red(`\nFailing Areas: ${failingAreas.join(', ')}`));
      }
    }

    // Critical workflow integrity check
    this.validateCriticalWorkflows(results);
  }

  validateCriticalWorkflows(results) {
    console.log(chalk.yellow.bold('\n🔒 CRITICAL NEXT.JS WORKFLOW INTEGRITY CHECK'));
    
    const criticalChecks = [
      {
        name: 'React 19 + Next.js 15 Compatibility',
        passed: results.componentCompatibility.overallScore >= 95,
        requirement: 'MUST be 95+ for deployment'
      },
      {
        name: 'Supabase Auth Integration',
        passed: results.supabaseIntegration.overallScore >= 92,
        requirement: 'MUST be 92+ for deployment'
      },
      {
        name: 'Core Web Vitals Performance',
        passed: results.performance.overallScore >= 88,
        requirement: 'MUST be 88+ for deployment'
      },
      {
        name: 'TypeScript Compilation',
        passed: results.typeScript.overallScore >= 90,
        requirement: 'MUST be 90+ for deployment'
      },
      {
        name: 'Production Build System',
        passed: results.buildSystem.overallScore >= 94,
        requirement: 'MUST be 94+ for deployment'
      },
      {
        name: 'Authentication Flow Integrity',
        passed: results.authFlow.overallScore >= 93,
        requirement: 'MUST be 93+ for deployment'
      }
    ];

    criticalChecks.forEach(check => {
      const icon = check.passed ? '✅' : '❌';
      const color = check.passed ? chalk.green : chalk.red;
      console.log(color(`${icon} ${check.name}: ${check.requirement}`));
    });

    const allCriticalPassed = criticalChecks.every(check => check.passed);
    
    if (!allCriticalPassed) {
      console.log(chalk.red.bold('\n🚨 CRITICAL NEXT.JS WORKFLOW FAILURE - DEPLOYMENT BLOCKED'));
    } else {
      console.log(chalk.green.bold('\n🎯 ALL CRITICAL NEXT.JS WORKFLOWS VALIDATED'));
    }
  }

  async validateSpecificWorkflow(workflowType) {
    switch (workflowType) {
      case 'components':
        return await this.validators.componentCompatibility.runFullValidation();
      case 'supabase':
        return await this.validators.supabaseIntegration.runFullValidation();
      case 'performance':
        return await this.validators.performance.runFullValidation();
      case 'typescript':
        return await this.validators.typeScript.runFullValidation();
      case 'build':
        return await this.validators.buildSystem.runFullValidation();
      case 'auth':
        return await this.validators.authFlow.runFullValidation();
      default:
        throw new Error(`Unknown workflow type: ${workflowType}`);
    }
  }
}

module.exports = NextJSCompatibilityAgent;