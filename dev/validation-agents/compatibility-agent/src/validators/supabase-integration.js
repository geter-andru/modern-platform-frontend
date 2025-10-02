const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class SupabaseIntegrationValidator {
  constructor() {
    this.baseDir = '/Users/geter/andru/';
    console.log(`Debug: Supabase baseDir set to ${this.baseDir}`);
  }

  async runFullValidation() {
    const results = {
      tests: [],
      overallScore: 0
    };

    const tests = [
      () => this.validateSupabaseConfig(),
      () => this.validateAuthComponents(),
      () => this.validateEnvironmentVars(),
      () => this.validateMiddleware()
    ];

    for (const test of tests) {
      try {
        const result = await test();
        results.tests.push(result);
      } catch (error) {
        results.tests.push({
          name: 'Supabase Test Error',
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

  async validateSupabaseConfig() {
    console.log(chalk.blue('  🔧 Validating Supabase configuration...'));

    const configFile = path.join(this.baseDir, 'hs-andru-test/modern-platform/app/lib/services/supabaseClient.ts');
    
    if (fs.existsSync(configFile)) {
      const content = fs.readFileSync(configFile, 'utf8');
      
      if (content.includes('@supabase/supabase-js') && content.includes('createClient')) {
        console.log(chalk.green('    ✅ Supabase client properly configured'));
        return { name: 'Supabase Config', passed: true, score: 100, details: 'Client configured correctly' };
      } else {
        console.log(chalk.yellow('    ⚠️  Supabase client configuration issues'));
        return { name: 'Supabase Config', passed: false, score: 50, details: 'Configuration incomplete' };
      }
    } else {
      console.log(chalk.red('    ❌ Supabase client file not found'));
      return { name: 'Supabase Config', passed: false, score: 0, details: 'Client file missing' };
    }
  }

  async validateAuthComponents() {
    console.log(chalk.blue('  🔐 Validating auth components...'));

    // Look for auth components in our expected locations
    const authFiles = [
      path.join(this.baseDir, 'hs-andru-test/modern-platform/app/components/auth/SupabaseAuth.tsx'),
      path.join(this.baseDir, 'hs-andru-test/modern-platform/app/lib/services/authService.ts')
    ];
    
    let foundAuth = false;
    let authContent = '';
    
    for (const authFile of authFiles) {
      console.log(`Debug: checking auth file ${authFile}`);
      if (fs.existsSync(authFile)) {
        foundAuth = true;
        authContent = fs.readFileSync(authFile, 'utf8');
        console.log(chalk.green(`    ✅ Found auth file: ${path.basename(authFile)}`));
        break;
      }
    }
    
    if (foundAuth) {
      // Check for appropriate auth patterns based on our implementation
      if (authContent.includes('interface') || authContent.includes('SessionData') || authContent.includes('GoogleAuth')) {
        console.log(chalk.green('    ✅ Auth components properly implemented'));
        return { name: 'Auth Components', passed: true, score: 100, details: 'Auth service implemented' };
      } else {
        return { name: 'Auth Components', passed: false, score: 50, details: 'Auth implementation incomplete' };
      }
    } else {
      console.log(chalk.red('    ❌ No auth components found'));
      return { name: 'Auth Components', passed: false, score: 0, details: 'Auth component missing' };
    }
  }

  async validateEnvironmentVars() {
    console.log(chalk.blue('  🌍 Validating environment variables...'));

    const envFile = path.join(this.baseDir, 'hs-andru-test/modern-platform/.env.local');
    
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, 'utf8');
      
      const hasUrl = content.includes('NEXT_PUBLIC_SUPABASE_URL');
      const hasAnonKey = content.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');
      
      if (hasUrl && hasAnonKey) {
        console.log(chalk.green('    ✅ Environment variables configured'));
        return { name: 'Environment Vars', passed: true, score: 100, details: 'All vars present' };
      } else {
        console.log(chalk.yellow('    ⚠️  Missing environment variables'));
        return { name: 'Environment Vars', passed: false, score: 50, details: 'Some vars missing' };
      }
    } else {
      console.log(chalk.red('    ❌ Environment file not found'));
      return { name: 'Environment Vars', passed: false, score: 0, details: 'No .env.local file' };
    }
  }

  async validateMiddleware() {
    console.log(chalk.blue('  🛡️  Validating middleware...'));

    const middlewareFile = path.join(this.baseDir, 'hs-andru-test/modern-platform/middleware.ts');
    
    if (fs.existsSync(middlewareFile)) {
      const content = fs.readFileSync(middlewareFile, 'utf8');
      
      if (content.includes('@supabase/ssr')) {
        console.log(chalk.green('    ✅ Middleware properly configured'));
        return { name: 'Middleware', passed: true, score: 100, details: 'SSR middleware active' };
      } else {
        return { name: 'Middleware', passed: false, score: 70, details: 'Middleware needs SSR updates' };
      }
    } else {
      return { name: 'Middleware', passed: false, score: 0, details: 'Middleware file missing' };
    }
  }

  displayResults(results) {
    console.log(chalk.cyan('\n  📊 Supabase Integration Results:'));
    results.tests.forEach(test => {
      const icon = test.passed ? '✅' : '❌';
      const color = test.passed ? chalk.green : chalk.red;
      console.log(color(`    ${icon} ${test.name}: ${test.score}/100 - ${test.details}`));
    });
  }
}

module.exports = SupabaseIntegrationValidator;