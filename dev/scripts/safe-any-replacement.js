#!/usr/bin/env node

/**
 * Safe Script/File-by-File Hybrid Approach for Replacing 'any' Types
 * 
 * SAFETY FEATURES:
 * - Maximum 5 files processed at a time
 * - Git commit before each file change
 * - Compilation validation after each replacement
 * - Automatic rollback on failure
 * - Progress tracking and reporting
 * - Resumable from any point
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const MAX_FILES_PER_BATCH = 5;
const SAFE_REPLACEMENTS = [
  {
    pattern: /Record<string,\s*any>/g,
    replacement: 'Record<string, string | number | boolean | object>',
    description: 'Generic object records',
    risk: 'low'
  },
  {
    pattern: /:\s*any\[\]/g,
    replacement: ': unknown[]',
    description: 'Generic arrays',
    risk: 'low'
  },
  {
    pattern: /:\s*any\s*=/g,
    replacement: ': unknown =',
    description: 'Variable assignments',
    risk: 'low'
  },
  {
    pattern: /:\s*any\s*;/g,
    replacement: ': unknown;',
    description: 'Property declarations',
    risk: 'low'
  },
  {
    pattern: /<any>/g,
    replacement: '<unknown>',
    description: 'Generic type parameters',
    risk: 'low'
  }
];

// High-risk patterns that need manual review
const HIGH_RISK_PATTERNS = [
  /function\s+\w+\([^)]*:\s*any[^)]*\)/g,
  /interface\s+\w+[^{]*{[^}]*:\s*any[^}]*}/g,
  /class\s+\w+[^{]*{[^}]*:\s*any[^}]*}/g
];

class SafeAnyReplacement {
  constructor() {
    this.processedFiles = [];
    this.failedFiles = [];
    this.skippedFiles = [];
    this.progress = {
      totalFiles: 0,
      processed: 0,
      failed: 0,
      skipped: 0,
      anyTypesFixed: 0
    };
  }

  // Main execution method
  async run(options = {}) {
    const { 
      maxFiles = MAX_FILES_PER_BATCH,
      targetFiles = null,
      dryRun = false,
      resumeFrom = null
    } = options;

    console.log('🔧 Safe Any Type Replacement Tool');
    console.log('==================================\n');

    try {
      // Step 1: Find files with any types
      const filesWithAny = await this.findFilesWithAnyTypes();
      console.log(`📊 Found ${filesWithAny.length} files with 'any' types\n`);

      // Step 2: Filter and prioritize files
      let filesToProcess = targetFiles ? 
        filesWithAny.filter(f => targetFiles.includes(f.path)) :
        filesWithAny;

      if (resumeFrom) {
        const resumeIndex = filesToProcess.findIndex(f => f.path === resumeFrom);
        if (resumeIndex !== -1) {
          filesToProcess = filesToProcess.slice(resumeIndex);
          console.log(`🔄 Resuming from: ${resumeFrom}\n`);
        }
      }

      // Step 3: Limit to max files per batch
      filesToProcess = filesToProcess.slice(0, maxFiles);
      this.progress.totalFiles = filesToProcess.length;

      console.log(`🎯 Processing ${filesToProcess.length} files in this batch:\n`);
      filesToProcess.forEach((file, index) => {
        console.log(`${index + 1}. ${file.path} (${file.anyCount} any types)`);
      });
      console.log('');

      // Step 4: Process each file
      for (const file of filesToProcess) {
        await this.processFile(file, dryRun);
      }

      // Step 5: Generate report
      this.generateReport();

    } catch (error) {
      console.error('❌ Fatal error:', error.message);
      process.exit(1);
    }
  }

  // Find all files with any types
  async findFilesWithAnyTypes() {
    const files = [];
    
    function traverse(dir) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.next')) {
          traverse(fullPath);
        } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const anyCount = (content.match(/:\s*any\b/g) || []).length;
          if (anyCount > 0) {
            files.push({
              path: fullPath,
              content,
              anyCount,
              relativePath: fullPath.replace(process.cwd() + '/', '')
            });
          }
        }
      }
    }
    
    traverse('./app');
    traverse('./src');
    traverse('./lib');
    
    return files.sort((a, b) => b.anyCount - a.anyCount);
  }

  // Process a single file
  async processFile(file, dryRun = false) {
    console.log(`\n📁 Processing: ${file.relativePath}`);
    console.log(`   Any types found: ${file.anyCount}`);

    try {
      // Step 1: Analyze file
      const analysis = this.analyzeFile(file);
      console.log(`   Safe replacements: ${analysis.safeReplacements.length}`);
      console.log(`   High-risk patterns: ${analysis.highRiskPatterns.length}`);

      if (analysis.safeReplacements.length === 0) {
        console.log(`   ⏭️  Skipping - no safe replacements available`);
        this.skippedFiles.push(file);
        this.progress.skipped++;
        return;
      }

      if (dryRun) {
        console.log(`   🔍 DRY RUN - Would apply ${analysis.safeReplacements.length} safe replacements`);
        this.progress.processed++;
        return;
      }

      // Step 2: Create backup commit
      await this.createBackupCommit(file.relativePath);

      // Step 3: Apply safe replacements
      const newContent = this.applySafeReplacements(file.content, analysis.safeReplacements);
      const anyTypesFixed = file.anyCount - (newContent.match(/:\s*any\b/g) || []).length;

      // Step 4: Write file
      fs.writeFileSync(file.path, newContent, 'utf8');

      // Step 5: Validate compilation
      const compilationSuccess = await this.validateCompilation(file.relativePath);

      if (compilationSuccess) {
        console.log(`   ✅ Success - Fixed ${anyTypesFixed} any types`);
        this.processedFiles.push({ ...file, anyTypesFixed });
        this.progress.processed++;
        this.progress.anyTypesFixed += anyTypesFixed;
      } else {
        console.log(`   ❌ Compilation failed - rolling back`);
        await this.rollbackFile(file.relativePath);
        this.failedFiles.push(file);
        this.progress.failed++;
      }

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      this.failedFiles.push(file);
      this.progress.failed++;
    }
  }

  // Analyze file for safe vs risky replacements
  analyzeFile(file) {
    const safeReplacements = [];
    const highRiskPatterns = [];

    // Check for safe replacements
    SAFE_REPLACEMENTS.forEach(replacement => {
      const matches = file.content.match(replacement.pattern);
      if (matches) {
        safeReplacements.push({
          ...replacement,
          matches: matches.length,
          lines: this.findPatternLines(file.content, replacement.pattern)
        });
      }
    });

    // Check for high-risk patterns
    HIGH_RISK_PATTERNS.forEach(pattern => {
      const matches = file.content.match(pattern);
      if (matches) {
        highRiskPatterns.push({
          pattern: pattern.toString(),
          matches: matches.length,
          lines: this.findPatternLines(file.content, pattern)
        });
      }
    });

    return { safeReplacements, highRiskPatterns };
  }

  // Find line numbers for patterns
  findPatternLines(content, pattern) {
    const lines = content.split('\n');
    const lineNumbers = [];
    
    lines.forEach((line, index) => {
      if (pattern.test(line)) {
        lineNumbers.push(index + 1);
      }
    });
    
    return lineNumbers;
  }

  // Apply safe replacements to content
  applySafeReplacements(content, safeReplacements) {
    let newContent = content;
    
    safeReplacements.forEach(replacement => {
      newContent = newContent.replace(replacement.pattern, replacement.replacement);
    });
    
    return newContent;
  }

  // Create backup commit
  async createBackupCommit(filePath) {
    try {
      execSync(`git add "${filePath}"`, { stdio: 'pipe' });
      execSync(`git commit -m "Backup before any type replacement: ${filePath}"`, { stdio: 'pipe' });
    } catch (error) {
      // Ignore if no changes to commit
    }
  }

  // Validate compilation
  async validateCompilation(filePath) {
    try {
      execSync(`npx tsc --noEmit --skipLibCheck "${filePath}"`, { stdio: 'pipe' });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Rollback file to previous commit
  async rollbackFile(filePath) {
    try {
      execSync(`git checkout HEAD~1 -- "${filePath}"`, { stdio: 'pipe' });
    } catch (error) {
      console.log(`   ⚠️  Could not rollback ${filePath}`);
    }
  }

  // Generate progress report
  generateReport() {
    console.log('\n📊 BATCH COMPLETION REPORT');
    console.log('==========================');
    console.log(`✅ Files processed successfully: ${this.progress.processed}`);
    console.log(`❌ Files failed: ${this.progress.failed}`);
    console.log(`⏭️  Files skipped: ${this.progress.skipped}`);
    console.log(`🔧 Any types fixed: ${this.progress.anyTypesFixed}`);
    
    if (this.processedFiles.length > 0) {
      console.log('\n🎉 Successfully processed files:');
      this.processedFiles.forEach(file => {
        console.log(`   ${file.relativePath} (${file.anyTypesFixed} any types fixed)`);
      });
    }

    if (this.failedFiles.length > 0) {
      console.log('\n❌ Failed files (need manual review):');
      this.failedFiles.forEach(file => {
        console.log(`   ${file.relativePath}`);
      });
    }

    if (this.skippedFiles.length > 0) {
      console.log('\n⏭️  Skipped files (no safe replacements):');
      this.skippedFiles.forEach(file => {
        console.log(`   ${file.relativePath}`);
      });
    }

    // Next steps
    const remainingFiles = this.progress.totalFiles - this.progress.processed - this.progress.failed - this.progress.skipped;
    if (remainingFiles > 0) {
      console.log(`\n🔄 Next batch: ${remainingFiles} files remaining`);
      console.log('Run again to continue processing the next batch.');
    } else {
      console.log('\n🎯 All files in this batch completed!');
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--max-files':
        options.maxFiles = parseInt(args[++i]) || MAX_FILES_PER_BATCH;
        break;
      case '--files':
        options.targetFiles = args[++i].split(',').map(f => f.trim());
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--resume-from':
        options.resumeFrom = args[++i];
        break;
      case '--help':
        console.log(`
Safe Any Type Replacement Tool

Usage: node scripts/safe-any-replacement.js [options]

Options:
  --max-files <number>    Maximum files to process (default: 5)
  --files <file1,file2>   Specific files to process
  --dry-run              Show what would be changed without making changes
  --resume-from <file>    Resume processing from specific file
  --help                 Show this help message

Examples:
  node scripts/safe-any-replacement.js
  node scripts/safe-any-replacement.js --max-files 3
  node scripts/safe-any-replacement.js --files "app/api/test.ts,src/utils.ts"
  node scripts/safe-any-replacement.js --dry-run
        `);
        process.exit(0);
    }
  }

  // Run the tool
  const tool = new SafeAnyReplacement();
  tool.run(options).catch(console.error);
}

module.exports = SafeAnyReplacement;
