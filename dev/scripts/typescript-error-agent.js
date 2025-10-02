#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * TypeScript Error Agent System
 * A comprehensive system for detecting, categorizing, and resolving TypeScript errors
 * Features:
 * - Real-time error detection
 * - Automated error categorization
 * - Intelligent error resolution
 * - Continuous integration support
 * - Error reporting and analytics
 */

class TypeScriptErrorAgent {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || process.cwd();
    this.verbose = options.verbose || false;
    this.autoFix = options.autoFix || false;
    this.backup = options.backup !== false; // Default to true
    this.dryRun = options.dryRun || false;
    this.maxFiles = options.maxFiles || 100;
    this.maxErrorsPerFile = options.maxErrorsPerFile || 50;
    this.errorHistory = [];
    this.resolutionStats = {
      totalErrors: 0,
      fixedErrors: 0,
      failedFixes: 0,
      errorTypes: {}
    };
    this.options = options;
  }

  /**
   * Main entry point - runs the complete error detection and resolution process
   */
  async run() {
    console.log('🤖 TypeScript Error Agent System Starting...\n');
    
    try {
      // Step 1: Detect all TypeScript errors
      const errors = await this.detectErrors();
      
      if (errors.length === 0) {
        console.log('✅ No TypeScript errors found!');
        return { success: true, errors: [], fixed: 0 };
      }

      // Step 2: Categorize errors
      const categorizedErrors = this.categorizeErrors(errors);
      
      // Step 3: Generate resolution strategies
      const resolutionStrategies = this.generateResolutionStrategies(categorizedErrors);
      
      // Step 4: Apply fixes (if autoFix is enabled)
      let fixedCount = 0;
      if (this.autoFix) {
        fixedCount = await this.applyFixes(resolutionStrategies);
      }
      
      // Step 5: Generate report
      this.generateReport(categorizedErrors, resolutionStrategies, fixedCount);
      
      return {
        success: fixedCount > 0,
        errors: categorizedErrors,
        strategies: resolutionStrategies,
        fixed: fixedCount
      };
      
    } catch (error) {
      console.error('❌ TypeScript Error Agent failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Detect all TypeScript errors in the project
   */
  async detectErrors() {
    console.log('🔍 Detecting TypeScript errors...');
    
    try {
      const output = execSync('npm run type-check', { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      // If we get here, there are no errors
      return [];
      
    } catch (error) {
      // Parse the error output to extract TypeScript errors
      const errorOutput = error.stdout || error.stderr || '';
      return this.parseErrorOutput(errorOutput);
    }
  }

  /**
   * Parse TypeScript compiler output to extract structured error information
   */
  parseErrorOutput(output) {
    const errors = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^(.+?)\((\d+),(\d+)\):\s+error\s+TS(\d+):\s*(.+)$/);
      if (match) {
        const [, filePath, lineNum, colNum, errorCode, message] = match;
        errors.push({
          file: filePath,
          line: parseInt(lineNum),
          column: parseInt(colNum),
          code: `TS${errorCode}`,
          message: message.trim(),
          severity: 'error',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return errors;
  }

  /**
   * Categorize errors by type and severity
   */
  categorizeErrors(errors) {
    console.log('📊 Categorizing errors...');
    
    const categories = {
      syntax: [],
      type: [],
      import: [],
      configuration: [],
      jsdoc: [],
      other: []
    };

    for (const error of errors) {
      const category = this.determineErrorCategory(error);
      categories[category].push(error);
      
      // Update stats
      this.resolutionStats.totalErrors++;
      this.resolutionStats.errorTypes[error.code] = (this.resolutionStats.errorTypes[error.code] || 0) + 1;
    }

    return categories;
  }

  /**
   * Determine the category of a TypeScript error
   */
  determineErrorCategory(error) {
    const { code, message, file } = error;
    
    // JSDoc errors
    if (code === 'TS1109' || code === 'TS1005' || code === 'TS1434' || 
        code === 'TS1161' || message.includes('Expression expected') ||
        message.includes('Unterminated regular expression')) {
      return 'jsdoc';
    }
    
    // Import/Export errors
    if (code === 'TS2307' || code === 'TS2306' || code === 'TS2304' ||
        message.includes('Cannot find module') || message.includes('Module not found')) {
      return 'import';
    }
    
    // Type errors
    if (code === 'TS2322' || code === 'TS2345' || code === 'TS2339' ||
        message.includes('Type') || message.includes('Property')) {
      return 'type';
    }
    
    // Syntax errors
    if (code === 'TS1003' || code === 'TS1128' || code === 'TS1131' ||
        message.includes('syntax') || message.includes('expected')) {
      return 'syntax';
    }
    
    // Configuration errors
    if (code === 'TS18026' || message.includes('tsconfig') || 
        message.includes('configuration')) {
      return 'configuration';
    }
    
    return 'other';
  }

  /**
   * Generate resolution strategies for each error category
   */
  generateResolutionStrategies(categorizedErrors) {
    console.log('🧠 Generating resolution strategies...');
    
    const strategies = {};
    
    for (const [category, errors] of Object.entries(categorizedErrors)) {
      if (errors.length === 0) continue;
      
      strategies[category] = this.getCategoryStrategy(category, errors);
    }
    
    return strategies;
  }

  /**
   * Get resolution strategy for a specific error category
   */
  getCategoryStrategy(category, errors) {
    switch (category) {
      case 'jsdoc':
        return {
          type: 'jsdoc-fix',
          description: 'Fix malformed JSDoc comments',
          priority: 'high',
          autoFixable: true,
          fixFunction: () => this.fixJSDocErrors(errors),
          estimatedTime: '2-5 minutes'
        };
        
      case 'import':
        return {
          type: 'import-fix',
          description: 'Fix missing imports and module resolution',
          priority: 'high',
          autoFixable: true,
          fixFunction: () => this.fixImportErrors(errors),
          estimatedTime: '5-10 minutes'
        };
        
      case 'type':
        return {
          type: 'type-fix',
          description: 'Fix type mismatches and interface issues',
          priority: 'medium',
          autoFixable: false,
          fixFunction: () => this.fixTypeErrors(errors),
          estimatedTime: '10-30 minutes'
        };
        
      case 'syntax':
        return {
          type: 'syntax-fix',
          description: 'Fix syntax errors and malformed code',
          priority: 'high',
          autoFixable: true,
          fixFunction: () => this.fixSyntaxErrors(errors),
          estimatedTime: '3-8 minutes'
        };
        
      case 'configuration':
        return {
          type: 'config-fix',
          description: 'Fix TypeScript configuration issues',
          priority: 'medium',
          autoFixable: true,
          fixFunction: () => this.fixConfigErrors(errors),
          estimatedTime: '5-15 minutes'
        };
        
      default:
        return {
          type: 'manual-fix',
          description: 'Manual review required',
          priority: 'low',
          autoFixable: false,
          fixFunction: () => this.manualReview(errors),
          estimatedTime: '15-60 minutes'
        };
    }
  }

  /**
   * Apply fixes based on resolution strategies
   */
  async applyFixes(strategies) {
    console.log('🔧 Applying fixes...');
    
    let totalFixed = 0;
    
    for (const [category, strategy] of Object.entries(strategies)) {
      if (!strategy.autoFixable) {
        console.log(`⏭️  Skipping ${category} (manual fix required)`);
        continue;
      }
      
      try {
        console.log(`🔨 Fixing ${category} errors...`);
        const fixed = await strategy.fixFunction();
        totalFixed += fixed;
        this.resolutionStats.fixedErrors += fixed;
        console.log(`✅ Fixed ${fixed} ${category} errors`);
      } catch (error) {
        console.error(`❌ Failed to fix ${category} errors:`, error.message);
        this.resolutionStats.failedFixes++;
      }
    }
    
    return totalFixed;
  }

  /**
   * Fix JSDoc-related errors
   */
  async fixJSDocErrors(errors) {
    const filesToFix = new Set(errors.map(e => e.file));
    let fixedCount = 0;
    
    console.log(`  📁 Processing ${filesToFix.size} files with JSDoc errors...`);
    
    for (const filePath of filesToFix) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fixed = this.fixJSDocComments(content);
        
        if (content !== fixed) {
          // Create backup if enabled
          if (this.backup) {
            const backupPath = `${filePath}.backup.${Date.now()}`;
            fs.writeFileSync(backupPath, content, 'utf8');
            console.log(`  💾 Backup created: ${path.basename(backupPath)}`);
          }
          
          if (!this.dryRun) {
            fs.writeFileSync(filePath, fixed, 'utf8');
          }
          fixedCount++;
          console.log(`  ✅ Fixed JSDoc in: ${path.basename(filePath)}`);
        } else {
          console.log(`  ⏭️  No changes needed in: ${path.basename(filePath)}`);
        }
      } catch (error) {
        console.error(`  ❌ Error fixing ${filePath}:`, error.message);
      }
    }
    
    return fixedCount;
  }

  /**
   * Fix JSDoc comment formatting
   */
  fixJSDocComments(content) {
    let fixed = content;
    
    // Pattern 1: Fix the specific malformed JSDoc pattern we're seeing
    // Fix: /**\n * /**\n * PRODUCTION READINESS: NO\n */\n *\n * Description
    fixed = fixed.replace(/\*\*\s*\n\s*\*\s*\*\*\s*\n\s*\*\s*PRODUCTION READINESS: NO\s*\n\s*\*\/\s*\n\s*\*\s*\n/g, ' *\n * PRODUCTION READINESS: NO\n *\n');
    
    // Pattern 1b: Fix the simpler pattern: /**\n * /**\n * PRODUCTION READINESS: NO\n */\n *\n
    fixed = fixed.replace(/\*\*\s*\n\s*\*\s*\*\*\s*\n\s*\*\s*PRODUCTION READINESS: NO\s*\n\s*\*\/\s*\n\s*\*\s*\n/g, ' *\n * PRODUCTION READINESS: NO\n *\n');
    
    // Pattern 1c: Fix the exact pattern we just manually fixed
    fixed = fixed.replace(/\*\*\s*\n\s*\*\s*\*\*\s*\n\s*\*\s*\*\*\s*\n\s*\*\s*PRODUCTION READINESS: NO\s*\n\s*\*\/\s*\n\s*\*\s*\n/g, ' *\n * PRODUCTION READINESS: NO\n *\n');
    
    // Pattern 2: Fix multiple /** opening tags
    fixed = fixed.replace(/\*\*\s*\n\s*\*\*\s*\n/g, ' *\n');
    
    // Pattern 3: Fix standalone * characters that should be part of JSDoc
    fixed = fixed.replace(/^\s*\*\s*$/gm, ' *');
    
    // Pattern 4: Fix malformed JSDoc blocks with multiple /** patterns
    fixed = fixed.replace(/\*\*\s*\n\s*\*\*\s*\n\s*\*/g, ' */');
    
    // Pattern 5: Fix incomplete JSDoc blocks
    fixed = fixed.replace(/\*\*\s*\n\s*\*\*\s*\n\s*\*\s*\n/g, ' *\n');
    
    // Pattern 6: Fix lines that start with * but aren't properly formatted
    fixed = fixed.replace(/^\s*\*\s*$/gm, ' *');
    
    // Pattern 7: Fix malformed JSDoc structure - more comprehensive approach
    const lines = fixed.split('\n');
    let result = [];
    let inJSDoc = false;
    let jsdocStart = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Check for JSDoc start
      if (trimmed.startsWith('/**') && !inJSDoc) {
        inJSDoc = true;
        jsdocStart = i;
        result.push(line);
        continue;
      }
      
      // Check for JSDoc end
      if (inJSDoc && trimmed.endsWith('*/')) {
        inJSDoc = false;
        result.push(line);
        continue;
      }
      
      // If we're in JSDoc, ensure proper formatting
      if (inJSDoc) {
        // Skip lines that are just * without content
        if (trimmed === '*') {
          result.push(' *');
          continue;
        }
        
        // Ensure JSDoc lines start with *
        if (!trimmed.startsWith('*') && trimmed !== '') {
          result.push(' * ' + trimmed);
        } else {
          result.push(line);
        }
        continue;
      }
      
      result.push(line);
    }
    
    return result.join('\n');
  }

  /**
   * Fix import-related errors
   */
  async fixImportErrors(errors) {
    // This would implement intelligent import fixing
    // For now, return 0 as it requires more complex logic
    console.log('  📝 Import fixes require manual review');
    return 0;
  }

  /**
   * Fix type-related errors
   */
  async fixTypeErrors(errors) {
    // This would implement intelligent type fixing
    // For now, return 0 as it requires more complex logic
    console.log('  📝 Type fixes require manual review');
    return 0;
  }

  /**
   * Fix syntax errors
   */
  async fixSyntaxErrors(errors) {
    // This would implement intelligent syntax fixing
    // For now, return 0 as it requires more complex logic
    console.log('  📝 Syntax fixes require manual review');
    return 0;
  }

  /**
   * Fix configuration errors
   */
  async fixConfigErrors(errors) {
    // This would implement intelligent config fixing
    // For now, return 0 as it requires more complex logic
    console.log('  📝 Config fixes require manual review');
    return 0;
  }

  /**
   * Manual review placeholder
   */
  async manualReview(errors) {
    console.log(`  📝 ${errors.length} errors require manual review`);
    return 0;
  }

  /**
   * Generate comprehensive error report
   */
  generateReport(categorizedErrors, strategies, fixedCount) {
    console.log('\n📊 TypeScript Error Agent Report');
    console.log('=====================================');
    
    console.log(`\n📈 Summary:`);
    console.log(`  Total Errors: ${this.resolutionStats.totalErrors}`);
    console.log(`  Fixed Errors: ${fixedCount}`);
    console.log(`  Remaining: ${this.resolutionStats.totalErrors - fixedCount}`);
    
    console.log(`\n📋 Error Categories:`);
    for (const [category, errors] of Object.entries(categorizedErrors)) {
      if (errors.length > 0) {
        const strategy = strategies[category];
        console.log(`  ${category.toUpperCase()}: ${errors.length} errors`);
        console.log(`    Strategy: ${strategy.description}`);
        console.log(`    Auto-fixable: ${strategy.autoFixable ? 'Yes' : 'No'}`);
        console.log(`    Estimated time: ${strategy.estimatedTime}`);
      }
    }
    
    console.log(`\n🔧 Error Types:`);
    for (const [code, count] of Object.entries(this.resolutionStats.errorTypes)) {
      console.log(`  ${code}: ${count} occurrences`);
    }
    
    if (fixedCount > 0) {
      console.log(`\n✅ Successfully fixed ${fixedCount} errors!`);
    } else {
      console.log(`\n⚠️  No errors were automatically fixed. Manual review required.`);
    }
  }

  /**
   * Run in continuous mode (watch for changes)
   */
  async runContinuous() {
    console.log('🔄 Starting continuous TypeScript error monitoring...');
    
    // This would implement file watching and continuous error checking
    // For now, just run once
    return await this.run();
  }

  /**
   * Run in CI/CD mode (fail on errors)
   */
  async runCI() {
    console.log('🚀 Running in CI/CD mode...');
    
    const result = await this.run();
    
    if (result.errors && result.errors.some(cat => cat.length > 0)) {
      console.error('❌ TypeScript errors found in CI/CD pipeline');
      process.exit(1);
    }
    
    console.log('✅ No TypeScript errors found');
    return result;
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    autoFix: args.includes('--fix'),
    verbose: args.includes('--verbose'),
    continuous: args.includes('--watch'),
    ci: args.includes('--ci')
  };

  const agent = new TypeScriptErrorAgent(options);

  if (options.ci) {
    agent.runCI().catch(console.error);
  } else if (options.continuous) {
    agent.runContinuous().catch(console.error);
  } else {
    agent.run().catch(console.error);
  }
}

module.exports = TypeScriptErrorAgent;
