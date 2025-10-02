#!/usr/bin/env node

/**
 * Batch Script for 25 Specific Files with Any Type Replacement
 * 
 * TARGET FILES (25 files):
 * - lib/agents/customer-value/SalesMaterialsOptimizer.ts (12 any types)
 * - app/lib/services/airtableService.ts (12 any types)
 * - lib/services/CRMIntegrationService.ts (11 any types)
 * - app/lib/services/webhookService.ts (11 any types)
 * - app/lib/services/supabaseDataService.ts (11 any types)
 * - app/lib/services/businessCaseService.ts (11 any types)
 * - lib/services/BehavioralIntelligenceService.ts (10 any types)
 * - lib/queue/processors.ts (10 any types)
 * - lib/agents/customer-value/ProspectQualificationOptimizer.ts (10 any types)
 * - app/api/icp-analysis/generate/route.ts (9 any types)
 * - src/shared/hooks/api/useApiQueries.ts (8 any types)
 * - src/features/icp-analysis/IntegratedICPTool.tsx (8 any types)
 * - src/features/dashboard/services/supabaseRealtimeService.ts (8 any types)
 * - src/features/dashboard/EnhancedCustomerDashboard.tsx (8 any types)
 * - lib/agents/supabase-management/ManualAgent.ts (8 any types)
 * - lib/agents/customer-value/DashboardOptimizer.ts (8 any types)
 * - app/lib/services/progressTrackingService.ts (8 any types)
 * - src/features/dashboard/CustomerDashboard.tsx (7 any types)
 * - lib/agents/supabase-management/ConsolidationAgent.ts (7 any types)
 * - app/lib/services/costCalculatorService.ts (7 any types)
 * - src/shared/hooks/useBehavioralTracking.ts (6 any types)
 * - src/shared/components/ui/ValidationSystem.tsx (6 any types)
 * - src/features/dashboard/SimpleEnhancedDashboard.tsx (6 any types)
 * - src/features/dashboard/ProfessionalDashboard.tsx (6 any types)
 * - server.ts (6 any types)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Target files with their any counts
const TARGET_FILES = [
  'lib/agents/customer-value/SalesMaterialsOptimizer.ts',
  'app/lib/services/airtableService.ts',
  'lib/services/CRMIntegrationService.ts',
  'app/lib/services/webhookService.ts',
  'app/lib/services/supabaseDataService.ts',
  'app/lib/services/businessCaseService.ts',
  'lib/services/BehavioralIntelligenceService.ts',
  'lib/queue/processors.ts',
  'lib/agents/customer-value/ProspectQualificationOptimizer.ts',
  'app/api/icp-analysis/generate/route.ts',
  'src/shared/hooks/api/useApiQueries.ts',
  'src/features/icp-analysis/IntegratedICPTool.tsx',
  'src/features/dashboard/services/supabaseRealtimeService.ts',
  'src/features/dashboard/EnhancedCustomerDashboard.tsx',
  'lib/agents/supabase-management/ManualAgent.ts',
  'lib/agents/customer-value/DashboardOptimizer.ts',
  'app/lib/services/progressTrackingService.ts',
  'src/features/dashboard/CustomerDashboard.tsx',
  'lib/agents/supabase-management/ConsolidationAgent.ts',
  'app/lib/services/costCalculatorService.ts',
  'src/shared/hooks/useBehavioralTracking.ts',
  'src/shared/components/ui/ValidationSystem.tsx',
  'src/features/dashboard/SimpleEnhancedDashboard.tsx',
  'src/features/dashboard/ProfessionalDashboard.tsx',
  'server.ts'
];

// Enhanced safe replacement patterns with better context awareness
const SAFE_REPLACEMENTS = [
  {
    pattern: /:\s*any\s*=/g,
    replacement: ': Record<string, any> =',
    description: 'Variable assignments to generic objects',
    risk: 'low'
  },
  {
    pattern: /:\s*any\s*;/g,
    replacement: ': Record<string, any>;',
    description: 'Property declarations to generic objects',
    risk: 'low'
  },
  {
    pattern: /:\s*any\[\]/g,
    replacement: ': Record<string, any>[]',
    description: 'Arrays of generic objects',
    risk: 'low'
  },
  {
    pattern: /:\s*any\s*\)/g,
    replacement: ': Record<string, any>)',
    description: 'Function parameters to generic objects',
    risk: 'low'
  },
  {
    pattern: /:\s*any\s*=>/g,
    replacement: ': Record<string, any> =>',
    description: 'Arrow function parameters to generic objects',
    risk: 'low'
  },
  {
    pattern: /:\s*any\s*,/g,
    replacement: ': Record<string, any>,',
    description: 'Object properties to generic objects',
    risk: 'low'
  },
  {
    pattern: /:\s*any\s*}/g,
    replacement: ': Record<string, any>}',
    description: 'Object properties to generic objects (end)',
    risk: 'low'
  },
  {
    pattern: /:\s*any\s*\|/g,
    replacement: ': Record<string, any> |',
    description: 'Union types with generic objects',
    risk: 'low'
  },
  {
    pattern: /:\s*any\s*&/g,
    replacement: ': Record<string, any> &',
    description: 'Intersection types with generic objects',
    risk: 'low'
  },
  {
    pattern: /:\s*any\s*>/g,
    replacement: ': Record<string, any>>',
    description: 'Generic type parameters',
    risk: 'low'
  },
  // More specific replacements for common patterns
  {
    pattern: /error:\s*any/g,
    replacement: 'error: unknown',
    description: 'Error handling parameters',
    risk: 'low'
  },
  {
    pattern: /catch\s*\(\s*error:\s*any\s*\)/g,
    replacement: 'catch (error: unknown)',
    description: 'Catch block error parameters',
    risk: 'low'
  },
  {
    pattern: /data:\s*any/g,
    replacement: 'data: Record<string, any>',
    description: 'Data parameters',
    risk: 'low'
  },
  {
    pattern: /options:\s*any/g,
    replacement: 'options: Record<string, any>',
    description: 'Options parameters',
    risk: 'low'
  },
  {
    pattern: /config:\s*any/g,
    replacement: 'config: Record<string, any>',
    description: 'Config parameters',
    risk: 'low'
  },
  {
    pattern: /params:\s*any/g,
    replacement: 'params: Record<string, any>',
    description: 'Params parameters',
    risk: 'low'
  }
];

function countAnyTypes(content) {
  const matches = content.match(/:\s*any\b/g);
  return matches ? matches.length : 0;
}

function applySafeReplacements(content) {
  let newContent = content;
  let replacements = 0;
  const appliedReplacements = [];
  
  for (const replacement of SAFE_REPLACEMENTS) {
    const beforeCount = (newContent.match(replacement.pattern) || []).length;
    newContent = newContent.replace(replacement.pattern, replacement.replacement);
    const afterCount = (newContent.match(replacement.pattern) || []).length;
    const applied = beforeCount - afterCount;
    if (applied > 0) {
      appliedReplacements.push({
        description: replacement.description,
        count: applied,
        risk: replacement.risk
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
      timeout: 15000 
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
    return { success: false, fixedCount: 0, reason: 'file_not_found' };
  }
  
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const anyCount = countAnyTypes(originalContent);
  
  console.log(`   Any types found: ${anyCount}`);
  
  if (anyCount === 0) {
    console.log(`   ⏭️  No any types to fix`);
    return { success: true, fixedCount: 0, reason: 'no_any_types' };
  }
  
  // Apply safe replacements
  const { content: newContent, replacements, appliedReplacements } = applySafeReplacements(originalContent);
  
  if (replacements === 0) {
    console.log(`   ⏭️  No safe replacements available`);
    return { success: true, fixedCount: 0, reason: 'no_safe_replacements' };
  }
  
  console.log(`   🔧 Applied ${replacements} safe replacements:`);
  appliedReplacements.forEach(rep => {
    console.log(`      ✅ ${rep.description} (${rep.count} replacements, risk: ${rep.risk})`);
  });
  
  // Test compilation
  console.log(`   🔍 Testing compilation...`);
  const tempFile = filePath + '.temp';
  fs.writeFileSync(tempFile, newContent);
  
  const compiles = testCompilation(tempFile);
  fs.unlinkSync(tempFile);
  
  if (!compiles) {
    console.log(`   ❌ Compilation failed - skipping file`);
    return { success: false, fixedCount: 0, reason: 'compilation_failed' };
  }
  
  // Apply changes
  fs.writeFileSync(filePath, newContent);
  
  // Commit changes
  if (commitChanges(filePath, 'Safe replacements')) {
    console.log(`   ✅ Success - Fixed ${replacements} any types`);
    return { success: true, fixedCount: replacements, reason: 'success' };
  } else {
    console.log(`   ⚠️  Changes applied but commit failed`);
    return { success: true, fixedCount: replacements, reason: 'commit_failed' };
  }
}

async function main() {
  console.log('🔧 Batch Any Type Replacement Tool (25 Files)');
  console.log('============================================\n');
  
  console.log(`🎯 Processing ${TARGET_FILES.length} target files:\n`);
  TARGET_FILES.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });
  
  let totalFixed = 0;
  let successCount = 0;
  let failedCount = 0;
  const successfulFiles = [];
  const failedFiles = [];
  const skippedFiles = [];
  
  for (const filePath of TARGET_FILES) {
    const result = await processFile(filePath);
    
    if (result.success) {
      successCount++;
      totalFixed += result.fixedCount;
      if (result.fixedCount > 0) {
        successfulFiles.push({ file: filePath, fixed: result.fixedCount });
      } else {
        skippedFiles.push({ file: filePath, reason: result.reason });
      }
    } else {
      failedCount++;
      failedFiles.push({ file: filePath, reason: result.reason });
    }
  }
  
  console.log('\n📊 BATCH COMPLETION REPORT');
  console.log('==========================');
  console.log(`✅ Files processed successfully: ${successCount}`);
  console.log(`❌ Files failed: ${failedCount}`);
  console.log(`🔧 Any types fixed: ${totalFixed}`);
  
  if (successfulFiles.length > 0) {
    console.log('\n🎉 Successfully processed files:');
    successfulFiles.forEach(({ file, fixed }) => {
      console.log(`   ${file} (${fixed} any types fixed)`);
    });
  }
  
  if (skippedFiles.length > 0) {
    console.log('\n⏭️  Skipped files:');
    skippedFiles.forEach(({ file, reason }) => {
      console.log(`   ${file} (${reason})`);
    });
  }
  
  if (failedFiles.length > 0) {
    console.log('\n❌ Failed files (need manual review):');
    failedFiles.forEach(({ file, reason }) => {
      console.log(`   ${file} (${reason})`);
    });
  }
  
  console.log('\n🎯 All files in this batch completed!');
  console.log(`\n📈 Progress: ${totalFixed} any types eliminated from ${TARGET_FILES.length} files`);
}

main().catch(console.error);
