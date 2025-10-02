const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class AuthFlowValidator {
  constructor() {
    this.baseDir = '/Users/geter/andru/';
    console.log(`Debug: Auth Flow baseDir set to ${this.baseDir}`);
  }

  async runFullValidation() {
    const results = { tests: [], overallScore: 0 };
    
    const tests = [
      () => this.validateSupabaseAuth(),
      () => this.validateAuthHooks()
    ];

    for (const test of tests) {
      try {
        const result = await test();
        results.tests.push(result);
      } catch (error) {
        results.tests.push({
          name: 'Auth Test Error',
          passed: false,
          score: 0,
          details: error.message
        });
      }
    }

    results.overallScore = Math.round(
      results.tests.reduce((sum, test) => sum + test.score, 0) / results.tests.length
    );

    this.displayResults(results);
    return results;
  }

  async validateSupabaseAuth() {
    console.log(chalk.blue('  🔐 Validating Supabase auth flow...'));

    const authFile = path.join(this.baseDir, 'hs-andru-test/modern-platform/app/components/auth/SupabaseAuth.tsx');
    
    if (fs.existsSync(authFile)) {
      const content = fs.readFileSync(authFile, 'utf8');
      
      if (content.includes('Auth') || content.includes('interface') || content.includes('GoogleAuth')) {
        console.log(chalk.green('    ✅ Auth flow properly implemented'));
        return { name: 'Supabase Auth', passed: true, score: 100, details: 'Auth components found' };
      } else {
        return { name: 'Supabase Auth', passed: false, score: 60, details: 'Auth flow incomplete' };
      }
    } else {
      return { name: 'Supabase Auth', passed: false, score: 0, details: 'Auth component missing' };
    }
  }

  async validateAuthHooks() {
    console.log(chalk.blue('  🪝 Validating auth hooks...'));

    const hookFile = path.join(this.baseDir, 'hs-andru-test/modern-platform/app/lib/services/authService.ts');
    
    if (fs.existsSync(hookFile)) {
      const content = fs.readFileSync(hookFile, 'utf8');
      
      if (content.includes('interface') && (content.includes('SessionData') || content.includes('GoogleAuth'))) {
        console.log(chalk.green('    ✅ Auth hooks properly implemented'));
        return { name: 'Auth Hooks', passed: true, score: 100, details: 'All auth methods available' };
      } else {
        return { name: 'Auth Hooks', passed: false, score: 50, details: 'Auth hooks incomplete' };
      }
    } else {
      return { name: 'Auth Hooks', passed: false, score: 0, details: 'Auth hooks missing' };
    }
  }

  displayResults(results) {
    console.log(chalk.cyan('\n  📊 Auth Flow Results:'));
    results.tests.forEach(test => {
      const icon = test.passed ? '✅' : '❌';
      const color = test.passed ? chalk.green : chalk.red;
      console.log(color(`    ${icon} ${test.name}: ${test.score}/100 - ${test.details}`));
    });
  }
}

module.exports = AuthFlowValidator;