const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class BuildSystemValidator {
  constructor() {
    this.baseDir = '/Users/geter/andru/hs-andru-test/modern-platform';
    console.log(`Debug: Build System baseDir set to ${this.baseDir}`);
  }

  async runFullValidation() {
    const results = { tests: [], overallScore: 0 };
    
    const tests = [
      () => this.validateNextConfig(),
      () => this.validateNetlifyConfig()
    ];

    for (const test of tests) {
      try {
        const result = await test();
        results.tests.push(result);
      } catch (error) {
        results.tests.push({
          name: 'Build Test Error',
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

  async validateNextConfig() {
    console.log(chalk.blue('  ⚙️  Validating Next.js configuration...'));

    const configFile = path.join(this.baseDir, 'next.config.ts');
    
    if (fs.existsSync(configFile)) {
      const content = fs.readFileSync(configFile, 'utf8');
      
      if (content.includes('export') && content.includes('NextConfig')) {
        console.log(chalk.green('    ✅ Next.js config properly structured'));
        return { name: 'Next Config', passed: true, score: 100, details: 'Config properly structured' };
      } else {
        return { name: 'Next Config', passed: false, score: 50, details: 'Config needs updates' };
      }
    } else {
      return { name: 'Next Config', passed: false, score: 0, details: 'Config file missing' };
    }
  }

  async validateNetlifyConfig() {
    console.log(chalk.blue('  🌐 Validating Netlify configuration...'));

    const netlifyFile = path.join(this.baseDir, 'netlify.toml');
    
    if (fs.existsSync(netlifyFile)) {
      const content = fs.readFileSync(netlifyFile, 'utf8');
      
      if (content.includes('[build]') && content.includes('publish = "out"')) {
        console.log(chalk.green('    ✅ Netlify config properly configured'));
        return { name: 'Netlify Config', passed: true, score: 100, details: 'Deployment config ready' };
      } else {
        return { name: 'Netlify Config', passed: false, score: 50, details: 'Config needs updates' };
      }
    } else {
      return { name: 'Netlify Config', passed: false, score: 0, details: 'Netlify config missing' };
    }
  }

  displayResults(results) {
    console.log(chalk.cyan('\n  📊 Build System Results:'));
    results.tests.forEach(test => {
      const icon = test.passed ? '✅' : '❌';
      const color = test.passed ? chalk.green : chalk.red;
      console.log(color(`    ${icon} ${test.name}: ${test.score}/100 - ${test.details}`));
    });
  }
}

module.exports = BuildSystemValidator;