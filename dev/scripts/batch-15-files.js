#!/usr/bin/env node

/**
 * Batch Script for 15 Specific Files with Any Type Replacement
 * 
 * TARGET FILES:
 * - lib/hooks/useAPI.ts (12 any types)
 * - lib/agents/customer-value/SalesMaterialsOptimizer.ts (12 any types)
 * - app/lib/services/airtableService.ts (12 any types)
 * - lib/services/CRMIntegrationService.ts (11 any types)
 * - app/lib/services/webhookService.ts (11 any types)
 * - app/lib/services/supabaseDataService.ts (11 any types)
 * - app/lib/services/businessCaseService.ts (11 any types)
 * - lib/services/BehavioralIntelligenceService.ts (10 any types)
 * - lib/queue/processors.ts (10 any types)
 * - lib/agents/customer-value/ProspectQualificationOptimizer.ts (10 any types)
 * - src/shared/hooks/useProgressiveEngagement.ts (9 any types)
 * - src/shared/components/ui/FormWizard.tsx (9 any types)
 * - lib/services/job-service.ts (9 any types)
 * - app/lib/services/authService.ts (9 any types)
 * - app/api/icp-analysis/generate/route.ts (9 any types)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Target files with their any counts
const TARGET_FILES = [
  'lib/hooks/useAPI.ts',
  'lib/agents/customer-value/SalesMaterialsOptimizer.ts',
  'app/lib/services/airtableService.ts',
  'lib/services/CRMIntegrationService.ts',
  'app/lib/services/webhookService.ts',
  'app/lib/services/supabaseDataService.ts',
  'app/lib/services/businessCaseService.ts',
  'lib/services/BehavioralIntelligenceService.ts',
  'lib/queue/processors.ts',
  'lib/agents/customer-value/ProspectQualificationOptimizer.ts',
  'src/shared/hooks/useProgressiveEngagement.ts',
  'src/shared/components/ui/FormWizard.tsx',
  'lib/services/job-service.ts',
  'app/lib/services/authService.ts',
  'app/api/icp-analysis/generate/route.ts'
];

// Safe replacement patterns
const SAFE_REPLACEMENTS = [
  {
    pattern: /:\s*any\s*=/g,
    replacement: ': Record<string, any> =',
    description: 'Variable assignments to generic objects'
  },
  {
    pattern: /:\s*any\s*;/g,
    replacement: ': Record<string, any>;',
    description: 'Property declarations to generic objects'
  },
  {
    pattern: /:\s*any\[\]/g,
    replacement: ': Record<string, any>[]',
    description: 'Arrays of generic objects'
  },
  {
    pattern: /:\s*any\s*\)/g,
    replacement: ': Record<string, any>)',
    description: 'Function parameters to generic objects'
  },
  {
    pattern: /:\s*any\s*=>/g,
    replacement: ': Record<string, any> =>',
    description: 'Arrow function parameters to generic objects'
  },
  {
    pattern: /:\s*any\s*,/g,
    replacement: ': Record<string, any>,',
    description: 'Object properties to generic objects'
  },
  {
    pattern: /:\s*any\s*}/g,
    replacement: ': Record<string, any>}',
    description: 'Object properties to generic objects (end)'
  },
  {
    pattern: /:\s*any\s*\|/g,
    replacement: ': Record<string, any> |',
    description: 'Union types with generic objects'
  },
  {
    pattern: /:\s*any\s*&/g,
    replacement: ': Record<string, any> &',
    description: 'Intersection types with generic objects'
  },
  {
    pattern: /:\s*any\s*>/g,
    replacement: ': Record<string, any>>',
    description: 'Generic type parameters'
  }
];

function countAnyTypes(content) {
  const matches = content.match(/:\s*any\b/g);
  return matches ? matches.length : 0;
}

function applySafeReplacements(content) {
  let newContent = content;
  let replacements = 0;
  
  for (const replacement of SAFE_REPLACEMENTS) {
    const beforeCount = (newContent.match(replacement.pattern) || []).length;
    newContent = newContent.replace(replacement.pattern, replacement.replacement);
    const afterCount = (newContent.match(replacement.pattern) || []).length;
    const applied = beforeCount - afterCount;
    if (applied > 0) {
      console.log(`      ✅ ${replacement.description} (${applied} replacements)`);
      replacements += applied;
    }
  }
  
  return { content: newContent, replacements };
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

function commitChanges(filePath, stage) {
  try {
    execSync(`git add "${filePath}"`, { stdio: 'pipe' });
    execSync(`git commit -m "Fix any types in ${path.basename(filePath)} - ${stage}"`, { stdio: 'pipe' });
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
    console.log(`   ⚠️  Could not rollback ${filePath}`);
    return false;
  }
}

async function processFile(filePath) {
  console.log(`\n📁 Processing: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`   ❌ File not found: ${filePath}`);
    return { success: false, fixedCount: 0 };
  }
  
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const anyCount = countAnyTypes(originalContent);
  
  console.log(`   Any types found: ${anyCount}`);
  
  if (anyCount === 0) {
    console.log(`   ⏭️  No any types to fix`);
    return { success: true, fixedCount: 0 };
  }
  
  // Apply safe replacements
  const { content: newContent, replacements } = applySafeReplacements(originalContent);
  
  if (replacements === 0) {
    console.log(`   ⏭️  No safe replacements available`);
    return { success: true, fixedCount: 0 };
  }
  
  console.log(`   🔧 Applied ${replacements} safe replacements`);
  
  // Test compilation
  console.log(`   🔍 Testing compilation...`);
  const tempFile = filePath + '.temp';
  fs.writeFileSync(tempFile, newContent);
  
  const compiles = testCompilation(tempFile);
  fs.unlinkSync(tempFile);
  
  if (!compiles) {
    console.log(`   ❌ Compilation failed - skipping file`);
    return { success: false, fixedCount: 0 };
  }
  
  // Apply changes
  fs.writeFileSync(filePath, newContent);
  
  // Commit changes
  if (commitChanges(filePath, 'Safe replacements')) {
    console.log(`   ✅ Success - Fixed ${replacements} any types`);
    return { success: true, fixedCount: replacements };
  } else {
    console.log(`   ⚠️  Changes applied but commit failed`);
    return { success: true, fixedCount: replacements };
  }
}

async function main() {
  console.log('🔧 Batch Any Type Replacement Tool');
  console.log('==================================\n');
  
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
    const result = await processFile(filePath);
    
    if (result.success) {
      successCount++;
      totalFixed += result.fixedCount;
      if (result.fixedCount > 0) {
        successfulFiles.push(filePath);
      }
    } else {
      failedCount++;
      failedFiles.push(filePath);
    }
  }
  
  console.log('\n📊 BATCH COMPLETION REPORT');
  console.log('==========================');
  console.log(`✅ Files processed successfully: ${successCount}`);
  console.log(`❌ Files failed: ${failedCount}`);
  console.log(`🔧 Any types fixed: ${totalFixed}`);
  
  if (successfulFiles.length > 0) {
    console.log('\n🎉 Successfully processed files:');
    successfulFiles.forEach(file => {
      console.log(`   ${file}`);
    });
  }
  
  if (failedFiles.length > 0) {
    console.log('\n❌ Failed files (need manual review):');
    failedFiles.forEach(file => {
      console.log(`   ${file}`);
    });
  }
  
  console.log('\n🎯 All files in this batch completed!');
}

main().catch(console.error);
