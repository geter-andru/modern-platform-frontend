#!/usr/bin/env node

/**
 * Fast Safe Any Type Replacement Tool
 * 
 * STRATEGY:
 * 1. Target files with 5-10 any types (sweet spot for automation)
 * 2. Use conservative replacements that are 99% safe
 * 3. Skip files with complex dependencies
 * 4. Process multiple files in parallel where possible
 * 5. Quick rollback on any failures
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Conservative replacement patterns (99% safe)
const CONSERVATIVE_REPLACEMENTS = [
  {
    pattern: /error:\s*any/g,
    replacement: 'error: unknown',
    description: 'Error parameters',
    safety: 'very_high'
  },
  {
    pattern: /catch\s*\(\s*error:\s*any\s*\)/g,
    replacement: 'catch (error: unknown)',
    description: 'Catch block errors',
    safety: 'very_high'
  },
  {
    pattern: /:\s*any\s*\[\]/g,
    replacement: ': unknown[]',
    description: 'Array types',
    safety: 'high'
  },
  {
    pattern: /:\s*any\s*;/g,
    replacement: ': unknown;',
    description: 'Property declarations',
    safety: 'high'
  },
  {
    pattern: /:\s*any\s*=/g,
    replacement: ': unknown =',
    description: 'Variable assignments',
    safety: 'high'
  },
  {
    pattern: /:\s*any\s*\)/g,
    replacement: ': unknown)',
    description: 'Function parameters',
    safety: 'high'
  },
  {
    pattern: /:\s*any\s*=>/g,
    replacement: ': unknown =>',
    description: 'Arrow function parameters',
    safety: 'high'
  },
  {
    pattern: /:\s*any\s*,/g,
    replacement: ': unknown,',
    description: 'Object properties',
    safety: 'high'
  },
  {
    pattern: /:\s*any\s*}/g,
    replacement: ': unknown}',
    description: 'Object properties (end)',
    safety: 'high'
  }
];

function countAnyTypes(content) {
  const matches = content.match(/:\s*any\b/g);
  return matches ? matches.length : 0;
}

function isSafeToProcess(filePath) {
  // Skip files with complex dependencies
  const skipPatterns = [
    'node_modules',
    'backup',
    'mcp-servers',
    '.d.ts',
    'test',
    'spec'
  ];
  
  return !skipPatterns.some(pattern => filePath.includes(pattern));
}

function applyConservativeReplacements(content) {
  let newContent = content;
  let replacements = 0;
  const appliedReplacements = [];
  
  for (const replacement of CONSERVATIVE_REPLACEMENTS) {
    const beforeCount = (newContent.match(replacement.pattern) || []).length;
    newContent = newContent.replace(replacement.pattern, replacement.replacement);
    const afterCount = (newContent.match(replacement.pattern) || []).length;
    const applied = beforeCount - afterCount;
    if (applied > 0) {
      appliedReplacements.push({
        description: replacement.description,
        count: applied,
        safety: replacement.safety
      });
      replacements += applied;
    }
  }
  
  return { content: newContent, replacements, appliedReplacements };
}

function testCompilation(filePath) {
  try {
    execSync(`npx tsc --noEmit --skipLibCheck "${filePath}"`, { 
      stdio: 'pipe',
      timeout: 10000 
    });
    return true;
  } catch (error) {
    return false;
  }
}

function commitChanges(filePath) {
  try {
    execSync(`git add "${filePath}"`, { stdio: 'pipe' });
    execSync(`git commit -m "Fast any type replacement in ${path.basename(filePath)}"`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

function rollbackFile(filePath) {
  try {
    execSync(`git checkout HEAD -- "${filePath}"`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

async function processFile(filePath) {
  if (!isSafeToProcess(filePath)) {
    return { success: false, reason: 'unsafe_to_process' };
  }
  
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const anyCount = countAnyTypes(originalContent);
  
  // Target files with 5-10 any types (sweet spot)
  if (anyCount < 5 || anyCount > 10) {
    return { success: false, reason: 'count_out_of_range' };
  }
  
  const { content: newContent, replacements, appliedReplacements } = applyConservativeReplacements(originalContent);
  
  if (replacements === 0) {
    return { success: false, reason: 'no_replacements' };
  }
  
  // Test compilation
  const tempFile = filePath + '.temp';
  fs.writeFileSync(tempFile, newContent);
  
  const compiles = testCompilation(tempFile);
  fs.unlinkSync(tempFile);
  
  if (!compiles) {
    return { success: false, reason: 'compilation_failed' };
  }
  
  // Apply changes
  fs.writeFileSync(filePath, newContent);
  
  // Commit changes
  if (commitChanges(filePath)) {
    return { 
      success: true, 
      fixedCount: replacements, 
      appliedReplacements,
      anyCount 
    };
  } else {
    return { success: false, reason: 'commit_failed' };
  }
}

async function main() {
  console.log('🚀 Fast Safe Any Type Replacement Tool');
  console.log('=====================================\n');
  
  // Find all TypeScript files
  const allFiles = execSync('find . -name "*.ts" -o -name "*.tsx"', { encoding: 'utf8' })
    .split('\n')
    .filter(file => file.trim() && isSafeToProcess(file.trim()));
  
  // Count any types in each file
  const filesWithAny = [];
  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const anyCount = countAnyTypes(content);
      if (anyCount > 0) {
        filesWithAny.push({ file, anyCount });
      }
    } catch (error) {
      // Skip files that can't be read
    }
  }
  
  // Sort by any count and filter for sweet spot (5-10 any types)
  const targetFiles = filesWithAny
    .filter(({ anyCount }) => anyCount >= 5 && anyCount <= 10)
    .sort((a, b) => a.anyCount - b.anyCount)
    .slice(0, 15); // Process up to 15 files
  
  console.log(`📊 Found ${filesWithAny.length} files with any types`);
  console.log(`🎯 Targeting ${targetFiles.length} files with 5-10 any types\n`);
  
  let totalFixed = 0;
  let successCount = 0;
  let failedCount = 0;
  const successfulFiles = [];
  const failedFiles = [];
  
  for (const { file, anyCount } of targetFiles) {
    console.log(`📁 Processing: ${file} (${anyCount} any types)`);
    
    const result = await processFile(file);
    
    if (result.success) {
      successCount++;
      totalFixed += result.fixedCount;
      successfulFiles.push({
        file,
        fixed: result.fixedCount,
        original: anyCount,
        appliedReplacements: result.appliedReplacements
      });
      console.log(`   ✅ Success - Fixed ${result.fixedCount} any types`);
    } else {
      failedCount++;
      failedFiles.push({ file, reason: result.reason });
      console.log(`   ❌ Failed - ${result.reason}`);
    }
  }
  
  console.log('\n📊 FAST BATCH COMPLETION REPORT');
  console.log('================================');
  console.log(`✅ Files processed successfully: ${successCount}`);
  console.log(`❌ Files failed: ${failedCount}`);
  console.log(`🔧 Any types fixed: ${totalFixed}`);
  
  if (successfulFiles.length > 0) {
    console.log('\n🎉 Successfully processed files:');
    successfulFiles.forEach(({ file, fixed, original, appliedReplacements }) => {
      console.log(`   ${file} (${original} → ${original - fixed} any types)`);
      appliedReplacements.forEach(rep => {
        console.log(`      ✅ ${rep.description} (${rep.count} replacements, safety: ${rep.safety})`);
      });
    });
  }
  
  if (failedFiles.length > 0) {
    console.log('\n❌ Failed files:');
    failedFiles.forEach(({ file, reason }) => {
      console.log(`   ${file} (${reason})`);
    });
  }
  
  console.log('\n🎯 Fast batch completed!');
  console.log(`\n📈 Progress: ${totalFixed} any types eliminated from ${targetFiles.length} files`);
}

main().catch(console.error);
