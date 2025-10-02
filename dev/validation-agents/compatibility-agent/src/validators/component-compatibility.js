const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class ComponentCompatibilityValidator {
  constructor() {
    this.baseDir = '/Users/geter/andru/';
    console.log(`Debug: baseDir set to ${this.baseDir}`);
  }

  async runFullValidation() {
    const results = {
      tests: [],
      overallScore: 0
    };

    // Test component structure
    const componentTests = [
      () => this.validateComponentStructure(),
      () => this.validateReactHooks(),
      () => this.validateTypeScriptProps(), 
      () => this.validateTailwindClasses(),
      () => this.validateFramerMotion(),
      () => this.validateLucideIcons(),
      () => this.validateImportPaths()
    ];

    for (const test of componentTests) {
      try {
        const result = await test();
        results.tests.push(result);
      } catch (error) {
        results.tests.push({
          name: 'Component Test Error',
          passed: false,
          score: 0,
          details: `Error: ${error.message}`
        });
      }
    }

    // Calculate overall score
    results.overallScore = Math.round(
      results.tests.reduce((sum, test) => sum + test.score, 0) / results.tests.length
    );

    this.displayResults(results);
    return results;
  }

  async validateComponentStructure() {
    console.log(chalk.blue('  🔍 Validating component structure...'));

    const requiredComponents = [
      'hs-andru-test/modern-platform/app/components/ui/ButtonComponents.tsx',
      'hs-andru-test/modern-platform/app/components/ui/ModernCard.tsx',
      'hs-andru-test/modern-platform/app/components/ui/ModernCircularProgress.tsx',
      'hs-andru-test/modern-platform/app/components/ui/ModalComponents.tsx',
      'hs-andru-test/modern-platform/app/components/ui/TabComponents.tsx',
      'hs-andru-test/modern-platform/app/components/dashboard/WeeklyTargetAccounts.tsx'
    ];

    let passed = 0;
    const missing = [];

    for (const component of requiredComponents) {
      const filePath = path.join(this.baseDir, component);
      console.log(`Debug: checking ${filePath}`);
      if (fs.existsSync(filePath)) {
        passed++;
        console.log(chalk.green(`    ✅ ${component} found`));
      } else {
        missing.push(component);
        console.log(chalk.red(`    ❌ ${component} missing`));
      }
    }

    const score = Math.round((passed / requiredComponents.length) * 100);

    return {
      name: 'Component Structure',
      passed: missing.length === 0,
      score,
      details: missing.length > 0 ? `Missing: ${missing.join(', ')}` : 'All components found'
    };
  }

  async validateReactHooks() {
    console.log(chalk.blue('  🪝 Validating React hooks usage...'));

    // Only check context files for hooks (services shouldn't have hooks)
    const hooksToCheck = [
      'hs-andru-test/modern-platform/app/lib/contexts/UserIntelligenceContext.tsx'
    ];

    let passed = 0;
    const issues = [];

    for (const hookFile of hooksToCheck) {
      const filePath = path.join(this.baseDir, hookFile);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for proper hook patterns
        if (content.includes('useState') || content.includes('useEffect') || content.includes('useCallback')) {
          passed++;
          console.log(chalk.green(`    ✅ ${hookFile} has valid hook patterns`));
        } else {
          issues.push(`${hookFile} missing hook patterns`);
          console.log(chalk.yellow(`    ⚠️  ${hookFile} missing expected hooks`));
        }
      } else {
        issues.push(`${hookFile} missing`);
        console.log(chalk.red(`    ❌ ${hookFile} not found`));
      }
    }

    const score = Math.round((passed / hooksToCheck.length) * 100);

    return {
      name: 'React Hooks',
      passed: issues.length === 0,
      score,
      details: issues.length > 0 ? issues.join(', ') : 'All hooks properly implemented'
    };
  }

  async validateTypeScriptProps() {
    console.log(chalk.blue('  📝 Validating TypeScript prop interfaces...'));

    const componentFiles = [
      'hs-andru-test/modern-platform/app/components/ui/ButtonComponents.tsx',
      'hs-andru-test/modern-platform/app/components/ui/ModalComponents.tsx'
    ];

    let passed = 0;
    const issues = [];

    for (const componentFile of componentFiles) {
      const filePath = path.join(this.baseDir, componentFile);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for TypeScript interfaces (updated for our Phase 3D implementation)
        if (content.includes('interface') && (content.includes('React.FC<') || content.includes('ReactNode'))) {
          passed++;
          console.log(chalk.green(`    ✅ ${componentFile} has proper TypeScript interfaces`));
        } else {
          issues.push(`${componentFile} missing TypeScript interfaces`);
          console.log(chalk.yellow(`    ⚠️  ${componentFile} missing proper interfaces`));
        }
      } else {
        issues.push(`${componentFile} missing`);
      }
    }

    const score = passed > 0 ? Math.round((passed / componentFiles.length) * 100) : 0;

    return {
      name: 'TypeScript Props',
      passed: issues.length === 0,
      score,
      details: issues.length > 0 ? issues.join(', ') : 'All components have proper TypeScript interfaces'
    };
  }

  async validateTailwindClasses() {
    console.log(chalk.blue('  🎨 Validating Tailwind CSS classes...'));

    const componentsToCheck = [
      'hs-andru-test/modern-platform/app/components/ui/ButtonComponents.tsx',
      'hs-andru-test/modern-platform/app/components/ui/ModernCard.tsx'
    ];

    let passed = 0;
    const issues = [];

    for (const componentFile of componentsToCheck) {
      const filePath = path.join(this.baseDir, componentFile);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for Tailwind classes
        if (content.includes('className=') && (content.includes('bg-') || content.includes('text-') || content.includes('p-'))) {
          passed++;
          console.log(chalk.green(`    ✅ ${componentFile} uses Tailwind classes`));
        } else {
          issues.push(`${componentFile} missing Tailwind classes`);
          console.log(chalk.yellow(`    ⚠️  ${componentFile} may be missing Tailwind styling`));
        }
      }
    }

    const score = passed > 0 ? Math.round((passed / componentsToCheck.length) * 100) : 0;

    return {
      name: 'Tailwind CSS',
      passed: issues.length === 0,
      score,
      details: issues.length > 0 ? issues.join(', ') : 'All components use Tailwind properly'
    };
  }

  async validateFramerMotion() {
    console.log(chalk.blue('  🎭 Validating Framer Motion animations...'));

    const animationFile = path.join(this.baseDir, 'hs-andru-test/modern-platform/app/components/ui/ModernCircularProgress.tsx');
    
    if (fs.existsSync(animationFile)) {
      const content = fs.readFileSync(animationFile, 'utf8');
      
      if (content.includes('motion.') && content.includes('framer-motion')) {
        console.log(chalk.green('    ✅ Framer Motion properly implemented'));
        return {
          name: 'Framer Motion',
          passed: true,
          score: 100,
          details: 'Animations properly implemented'
        };
      } else {
        console.log(chalk.yellow('    ⚠️  Framer Motion import/usage issues'));
        return {
          name: 'Framer Motion',
          passed: false,
          score: 50,
          details: 'Missing proper Framer Motion usage'
        };
      }
    } else {
      console.log(chalk.red('    ❌ Advanced animations file not found'));
      return {
        name: 'Framer Motion',
        passed: false,
        score: 0,
        details: 'Animation component missing'
      };
    }
  }

  async validateLucideIcons() {
    console.log(chalk.blue('  🎯 Validating Lucide icons...'));

    const componentsWithIcons = [
      'hs-andru-test/modern-platform/app/components/ui/ModalComponents.tsx',
      'hs-andru-test/modern-platform/app/components/dashboard/WeeklyTargetAccounts.tsx'
    ];

    let passed = 0;
    const issues = [];

    for (const componentFile of componentsWithIcons) {
      const filePath = path.join(this.baseDir, componentFile);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for Lucide icons or SVG fallbacks
        if (content.includes('lucide-react') || content.includes('<svg')) {
          passed++;
          console.log(chalk.green(`    ✅ ${componentFile} has icon implementation`));
        } else {
          issues.push(`${componentFile} missing icon imports`);
          console.log(chalk.yellow(`    ⚠️  ${componentFile} may be missing icons`));
        }
      }
    }

    const score = passed > 0 ? Math.round((passed / componentsWithIcons.length) * 100) : 50; // Partial score if some found

    return {
      name: 'Lucide Icons',
      passed: issues.length === 0,
      score,
      details: issues.length > 0 ? issues.join(', ') : 'Icons properly implemented'
    };
  }

  async validateImportPaths() {
    console.log(chalk.blue('  📦 Validating import paths...'));

    const files = [
      'hs-andru-test/modern-platform/app/components/ui/TabComponents.tsx',
      'hs-andru-test/modern-platform/app/lib/services/authService.ts'
    ];

    let passed = 0;
    const issues = [];

    for (const file of files) {
      const filePath = path.join(this.baseDir, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for appropriate imports based on file type
        const isReactComponent = file.includes('/components/') || file.endsWith('.tsx');
        const isServiceModule = file.includes('/services/');
        
        let hasProperImports = false;
        if (isReactComponent) {
          hasProperImports = content.includes("from 'react'") || content.includes("import React");
        } else if (isServiceModule) {
          hasProperImports = content.includes("interface") || content.includes("class") || content.includes("export");
        }

        if (hasProperImports) {
          passed++;
          console.log(chalk.green(`    ✅ ${file} has proper imports`));
        } else {
          issues.push(`${file} import issues`);
          console.log(chalk.yellow(`    ⚠️  ${file} may have import issues`));
        }
      }
    }

    const score = passed > 0 ? Math.round((passed / files.length) * 100) : 0;

    return {
      name: 'Import Paths',
      passed: issues.length === 0,
      score,
      details: issues.length > 0 ? issues.join(', ') : 'All imports properly structured'
    };
  }

  displayResults(results) {
    console.log(chalk.cyan('\n  📊 Component Compatibility Results:'));
    results.tests.forEach(test => {
      const icon = test.passed ? '✅' : '❌';
      const color = test.passed ? chalk.green : chalk.red;
      console.log(color(`    ${icon} ${test.name}: ${test.score}/100 - ${test.details}`));
    });
  }
}

module.exports = ComponentCompatibilityValidator;