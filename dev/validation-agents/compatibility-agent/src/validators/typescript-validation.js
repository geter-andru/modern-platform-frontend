const { exec } = require('child_process');
const chalk = require('chalk');

class TypeScriptValidator {
  constructor() {
    this.projectDir = '/Users/geter/andru/hs-andru-test/modern-platform';
    console.log(`Debug: TypeScript projectDir set to ${this.projectDir}`);
  }

  async runFullValidation() {
    const results = { tests: [], overallScore: 0 };

    const tests = [
      () => this.validateTypeScriptCompilation(),
      () => this.validateBuildProcess()
    ];

    for (const test of tests) {
      try {
        const result = await test();
        results.tests.push(result);
      } catch (error) {
        results.tests.push({
          name: 'TypeScript Test Error',
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

  async validateTypeScriptCompilation() {
    console.log(chalk.blue('  📝 Validating TypeScript compilation...'));

    return new Promise((resolve) => {
      exec('npx tsc --noEmit --skipLibCheck', { cwd: this.projectDir }, (error, stdout, stderr) => {
        if (error) {
          console.log(chalk.yellow('    ⚠️  TypeScript compilation has warnings'));
          resolve({ name: 'TS Compilation', passed: false, score: 70, details: 'Has compilation warnings' });
        } else {
          console.log(chalk.green('    ✅ TypeScript compiles cleanly'));
          resolve({ name: 'TS Compilation', passed: true, score: 100, details: 'Clean compilation' });
        }
      });
    });
  }

  async validateBuildProcess() {
    console.log(chalk.blue('  🏗️  Validating build process...'));

    return new Promise((resolve) => {
      exec('npm run build', { cwd: this.projectDir }, (error, stdout, stderr) => {
        if (error) {
          console.log(chalk.red('    ❌ Build failed'));
          resolve({ name: 'Build Process', passed: false, score: 0, details: 'Build failed' });
        } else if (stdout.includes('Compiled successfully')) {
          console.log(chalk.green('    ✅ Build successful'));
          resolve({ name: 'Build Process', passed: true, score: 100, details: 'Build successful' });
        } else {
          console.log(chalk.yellow('    ⚠️  Build has warnings'));
          resolve({ name: 'Build Process', passed: false, score: 80, details: 'Build with warnings' });
        }
      });
    });
  }

  displayResults(results) {
    console.log(chalk.cyan('\n  📊 TypeScript Results:'));
    results.tests.forEach(test => {
      const icon = test.passed ? '✅' : '❌';
      const color = test.passed ? chalk.green : chalk.red;
      console.log(color(`    ${icon} ${test.name}: ${test.score}/100 - ${test.details}`));
    });
  }
}

module.exports = TypeScriptValidator;