#!/usr/bin/env node

/**
 * Targeted Fast Any Type Replacement Tool
 * 
 * STRATEGY:
 * 1. Target specific files we know have 5-10 any types
 * 2. Use conservative replacements that are 99% safe
 * 3. Quick rollback on any failures
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Target files with known any counts (5-10 range)
const TARGET_FILES = [
  'src/shared/hooks/useBehavioralTracking.ts',
  'src/shared/components/ui/ValidationSystem.tsx',
  'src/features/dashboard/SimpleEnhancedDashboard.tsx',
  'src/features/dashboard/ProfessionalDashboard.tsx',
  'server.ts',
  'app/lib/services/costCalculatorService.ts',
  'lib/agents/supabase-management/ConsolidationAgent.ts',
  'src/features/dashboard/CustomerDashboard.tsx',
  'app/lib/services/progressTrackingService.ts',
  'lib/agents/customer-value/DashboardOptimizer.ts',
  'lib/agents/supabase-management/ManualAgent.ts',
  'src/features/dashboard/EnhancedCustomerDashboard.tsx',
  'src/features/dashboard/services/supabaseRealtimeService.ts',
  'src/features/icp-analysis/IntegratedICPTool.tsx',
  'src/shared/hooks/api/useApiQueries.ts'
];

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
  if (!fs.existsSync(filePath)) {
    return { success: false, reason: 'file_not_found' };
  }
  
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const anyCount = countAnyTypes(originalContent);
  
  // Only process files with 5-10 any types
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
  console.log('🎯 Targeted Fast Any Type Replacement Tool');
  console.log('==========================================\n');
  
  console.log(`🎯 Processing ${TARGET_FILES.length} target files:\n`);
  TARGET_FILES.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });
  
  let totalFixed = 0;
  let successCount = 0;
  let failedCount = 0;
  const successfulFiles = [];
  const failedFiles = [];
  
  for (const filePath of TARGET_FILES) {
    console.log(`\n📁 Processing: ${filePath}`);
    
    const result = await processFile(filePath);
    
    if (result.success) {
      successCount++;
      totalFixed += result.fixedCount;
      successfulFiles.push({
        file: filePath,
        fixed: result.fixedCount,
        original: result.anyCount,
        appliedReplacements: result.appliedReplacements
      });
      console.log(`   ✅ Success - Fixed ${result.fixedCount} any types`);
    } else {
      failedCount++;
      failedFiles.push({ file: filePath, reason: result.reason });
      console.log(`   ❌ Failed - ${result.reason}`);
    }
  }
  
  console.log('\n📊 TARGETED BATCH COMPLETION REPORT');
  console.log('===================================');
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
  
  console.log('\n🎯 Targeted batch completed!');
  console.log(`\n📈 Progress: ${totalFixed} any types eliminated from ${TARGET_FILES.length} files`);
}

main().catch(console.error);
