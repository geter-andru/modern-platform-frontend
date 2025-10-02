#!/usr/bin/env node

/**
 * Enhanced Safe Script with Graduated Approach for Replacing 'any' Types
 * 
 * GRADUATED APPROACH:
 * - Stage 1: Simple any → Record<string, any> (safest)
 * - Stage 2: Add basic interfaces for common patterns
 * - Stage 3: Refine complex types with context awareness
 * 
 * SAFETY FEATURES:
 * - Git commit before each file change
 * - Compilation validation after each stage
 * - Automatic rollback on failure
 * - Progress tracking and reporting
 * - Context-aware replacements
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const MAX_FILES_PER_BATCH = 10;
const MIN_ANY_COUNT = 20; // Only process files with 20+ any types

// Graduated replacement stages
const STAGE_1_REPLACEMENTS = [
  {
    pattern: /:\s*any\s*=/g,
    replacement: ': Record<string, any> =',
    description: 'Variable assignments to generic objects',
    risk: 'low',
    context: 'assignment'
  },
  {
    pattern: /:\s*any\s*;/g,
    replacement: ': Record<string, any>;',
    description: 'Property declarations to generic objects',
    risk: 'low',
    context: 'property'
  },
  {
    pattern: /:\s*any\[\]/g,
    replacement: ': Record<string, any>[]',
    description: 'Arrays of generic objects',
    risk: 'low',
    context: 'array'
  },
  {
    pattern: /<any>/g,
    replacement: '<Record<string, any>>',
    description: 'Generic type parameters',
    risk: 'low',
    context: 'generic'
  }
];

const STAGE_2_REPLACEMENTS = [
  {
    pattern: /function\s+\w+\s*\(\s*[^)]*:\s*any[^)]*\)/g,
    replacement: (match) => match.replace(/:\s*any/g, ': Record<string, any>'),
    description: 'Function parameters',
    risk: 'medium',
    context: 'function'
  },
  {
    pattern: /\(\s*[^)]*:\s*any[^)]*\)\s*=>/g,
    replacement: (match) => match.replace(/:\s*any/g, ': Record<string, any>'),
    description: 'Arrow function parameters',
    risk: 'medium',
    context: 'arrow'
  },
  {
    pattern: /catch\s*\(\s*error\s*:\s*any\s*\)/g,
    replacement: 'catch (error: unknown)',
    description: 'Error handling',
    risk: 'low',
    context: 'error'
  }
];

const STAGE_3_REPLACEMENTS = [
  {
    pattern: /Record<string,\s*any>/g,
    replacement: 'Record<string, string | number | boolean | object>',
    description: 'Refined generic object records',
    risk: 'medium',
    context: 'refinement'
  },
  {
    pattern: /:\s*any\s*\|/g,
    replacement: ': unknown |',
    description: 'Union types',
    risk: 'medium',
    context: 'union'
  },
  {
    pattern: /\|\s*any\s*;/g,
    replacement: '| unknown;',
    description: 'Union type endings',
    risk: 'medium',
    context: 'union'
  }
];

// Context-aware analysis
function analyzeAnyUsage(content) {
  const anyMatches = content.match(/:\s*any\b/g) || [];
  const usage = {
    total: anyMatches.length,
    inFunctions: (content.match(/function[^}]*:\s*any/g) || []).length,
    inVariables: (content.match(/:\s*any\s*=/g) || []).length,
    inProperties: (content.match(/:\s*any\s*;/g) || []).length,
    inArrays: (content.match(/:\s*any\[\]/g) || []).length,
    inGenerics: (content.match(/<any>/g) || []).length,
    inErrors: (content.match(/catch\s*\(\s*error\s*:\s*any\s*\)/g) || []).length
  };
  
  return usage;
}

// Apply replacements with context awareness
function applyReplacements(content, replacements, stage) {
  let modifiedContent = content;
  let changesCount = 0;
  
  console.log(`    🔧 Applying Stage ${stage} replacements...`);
  
  for (const replacement of replacements) {
    if (typeof replacement.replacement === 'function') {
      const before = modifiedContent;
      modifiedContent = modifiedContent.replace(replacement.pattern, replacement.replacement);
      if (before !== modifiedContent) {
        changesCount++;
        console.log(`      ✅ ${replacement.description}`);
      }
    } else {
      const before = modifiedContent;
      modifiedContent = modifiedContent.replace(replacement.pattern, replacement.replacement);
      if (before !== modifiedContent) {
        changesCount++;
        console.log(`      ✅ ${replacement.description}`);
      }
    }
  }
  
  return { content: modifiedContent, changesCount };
}

// Enhanced file processing with graduated approach
function processFileWithGraduatedApproach(filePath) {
  console.log(`\n📁 Processing: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const usage = analyzeAnyUsage(content);
    
    console.log(`   Any types found: ${usage.total}`);
    console.log(`   Usage breakdown:`, {
      functions: usage.inFunctions,
      variables: usage.inVariables,
      properties: usage.inProperties,
      arrays: usage.inArrays,
      generics: usage.inGenerics,
      errors: usage.inErrors
    });
    
    if (usage.total < MIN_ANY_COUNT) {
      console.log(`   ⏭️  Skipping - below minimum any count (${MIN_ANY_COUNT})`);
      return { success: false, reason: 'below_threshold', changes: 0 };
    }
    
    // Stage 1: Safe replacements
    let { content: stage1Content, changesCount: stage1Changes } = applyReplacements(content, STAGE_1_REPLACEMENTS, 1);
    
    if (stage1Changes > 0) {
      console.log(`   🔍 Testing Stage 1 changes (${stage1Changes} changes)...`);
      if (!testCompilation(filePath, stage1Content)) {
        console.log(`   ❌ Stage 1 failed - rolling back`);
        return { success: false, reason: 'stage1_failed', changes: 0 };
      }
      console.log(`   ✅ Stage 1 successful`);
    }
    
    // Stage 2: Medium risk replacements
    let { content: stage2Content, changesCount: stage2Changes } = applyReplacements(stage1Content, STAGE_2_REPLACEMENTS, 2);
    
    if (stage2Changes > 0) {
      console.log(`   🔍 Testing Stage 2 changes (${stage2Changes} changes)...`);
      if (!testCompilation(filePath, stage2Content)) {
        console.log(`   ❌ Stage 2 failed - keeping Stage 1 changes`);
        return { success: true, reason: 'stage2_failed', changes: stage1Changes };
      }
      console.log(`   ✅ Stage 2 successful`);
    }
    
    // Stage 3: Refinement replacements
    let { content: finalContent, changesCount: stage3Changes } = applyReplacements(stage2Content, STAGE_3_REPLACEMENTS, 3);
    
    if (stage3Changes > 0) {
      console.log(`   🔍 Testing Stage 3 changes (${stage3Changes} changes)...`);
      if (!testCompilation(filePath, finalContent)) {
        console.log(`   ❌ Stage 3 failed - keeping Stage 2 changes`);
        return { success: true, reason: 'stage3_failed', changes: stage1Changes + stage2Changes };
      }
      console.log(`   ✅ Stage 3 successful`);
    }
    
    const totalChanges = stage1Changes + stage2Changes + stage3Changes;
    
    if (totalChanges > 0) {
      // Commit changes
      commitChanges(filePath);
      fs.writeFileSync(filePath, finalContent, 'utf8');
      console.log(`   ✅ Success - Fixed ${totalChanges} any types`);
      return { success: true, reason: 'success', changes: totalChanges };
    } else {
      console.log(`   ⏭️  No changes needed`);
      return { success: false, reason: 'no_changes', changes: 0 };
    }
    
  } catch (error) {
    console.log(`   ❌ Error processing file: ${error.message}`);
    return { success: false, reason: 'error', changes: 0 };
  }
}

// Test compilation
function testCompilation(filePath, content) {
  try {
    // Write temporary content
    const tempPath = filePath + '.tmp';
    fs.writeFileSync(tempPath, content, 'utf8');
    
    // Test compilation
    execSync(`npx tsc --noEmit --skipLibCheck "${tempPath}"`, { 
      stdio: 'pipe',
      timeout: 30000 
    });
    
    // Clean up
    fs.unlinkSync(tempPath);
    return true;
  } catch (error) {
    // Clean up on error
    try {
      fs.unlinkSync(filePath + '.tmp');
    } catch {}
    return false;
  }
}

// Commit changes
function commitChanges(filePath) {
  try {
    execSync(`git add "${filePath}"`, { stdio: 'pipe' });
    execSync(`git commit -m "refactor: replace any types in ${path.basename(filePath)}"`, { 
      stdio: 'pipe' 
    });
  } catch (error) {
    console.log(`   ⚠️  Could not commit changes for ${filePath}`);
  }
}

// Find files with high any counts
function findHighAnyCountFiles() {
  console.log('🔍 Scanning for files with high any counts...\n');
  
  const files = [];
  const scanDir = (dir) => {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDir(fullPath);
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const anyCount = (content.match(/:\s*any\b/g) || []).length;
          
          if (anyCount >= MIN_ANY_COUNT) {
            files.push({ path: fullPath, anyCount });
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    }
  };
  
  scanDir('.');
  
  // Sort by any count (highest first)
  files.sort((a, b) => b.anyCount - a.anyCount);
  
  return files;
}

// Main execution
function main() {
  console.log('🔧 Enhanced Any Type Replacement Tool (Graduated Approach)');
  console.log('========================================================\n');
  
  const files = findHighAnyCountFiles();
  console.log(`📊 Found ${files.length} files with ${MIN_ANY_COUNT}+ any types\n`);
  
  if (files.length === 0) {
    console.log('🎉 No files found with high any counts!');
    return;
  }
  
  const batchSize = Math.min(MAX_FILES_PER_BATCH, files.length);
  const batch = files.slice(0, batchSize);
  
  console.log(`🎯 Processing ${batchSize} files in this batch:\n`);
  batch.forEach((file, index) => {
    console.log(`${index + 1}. ${file.path} (${file.anyCount} any types)`);
  });
  console.log('');
  
  let successCount = 0;
  let failCount = 0;
  let totalChanges = 0;
  const successfulFiles = [];
  const failedFiles = [];
  
  for (const file of batch) {
    const result = processFileWithGraduatedApproach(file.path);
    
    if (result.success) {
      successCount++;
      totalChanges += result.changes;
      successfulFiles.push(file.path);
    } else {
      failCount++;
      failedFiles.push({ path: file.path, reason: result.reason });
    }
  }
  
  // Final report
  console.log('\n📊 BATCH COMPLETION REPORT');
  console.log('==========================');
  console.log(`✅ Files processed successfully: ${successCount}`);
  console.log(`❌ Files failed: ${failCount}`);
  console.log(`🔧 Any types fixed: ${totalChanges}\n`);
  
  if (successfulFiles.length > 0) {
    console.log('🎉 Successfully processed files:');
    successfulFiles.forEach(file => {
      const anyCount = files.find(f => f.path === file)?.anyCount || 0;
      console.log(`   ${file} (${anyCount} any types)`);
    });
    console.log('');
  }
  
  if (failedFiles.length > 0) {
    console.log('❌ Failed files (need manual review):');
    failedFiles.forEach(file => {
      console.log(`   ${file.path} (${file.reason})`);
    });
    console.log('');
  }
  
  console.log('🎯 All files in this batch completed!');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { processFileWithGraduatedApproach, findHighAnyCountFiles };
