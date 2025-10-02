#!/usr/bin/env node

/**
 * JSDoc Damage Fix Script - Surgical Repair
 * Fixes the specific damage caused by the overly aggressive JSDoc fixing script
 */

const fs = require('fs');
const path = require('path');

function fixJSDocDamage(content) {
  let fixedContent = content;
  let changes = 0;

  // Pattern 1: Fix /*/ at start of comment blocks (context-aware)
  const before1 = fixedContent;
  fixedContent = fixedContent.replace(/^(\s*)\/\*\//g, '$1/**');
  if (before1 !== fixedContent) changes++;

  // Pattern 2: Fix * / at end of comment blocks (context-aware)
  const before2 = fixedContent;
  fixedContent = fixedContent.replace(/^(\s*)\* \/$/gm, '$1*/');
  if (before2 !== fixedContent) changes++;

  // Pattern 3: Fix multiple consecutive /*/ patterns (run twice to catch cascading)
  const before3a = fixedContent;
  fixedContent = fixedContent.replace(/\/\*\/\s*\/\*\//g, '/**');
  if (before3a !== fixedContent) changes++;
  
  const before3b = fixedContent;
  fixedContent = fixedContent.replace(/\/\*\/\s*\/\*\//g, '/**');
  if (before3b !== fixedContent) changes++;

  // Pattern 4: Fix standalone * at end of lines back to proper comment syntax
  const before4 = fixedContent;
  fixedContent = fixedContent.replace(/^(\s*)\*\s*$/gm, '$1*/');
  if (before4 !== fixedContent) changes++;

  // Pattern 5: Fix broken comment blocks that start with * instead of /**
  const before5 = fixedContent;
  fixedContent = fixedContent.replace(/^(\s*)\*\s*([^*\s])/gm, '$1* $2');
  if (before5 !== fixedContent) changes++;

  return { content: fixedContent, changes };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = fixJSDocDamage(content);
    
    if (result.changes > 0) {
      fs.writeFileSync(filePath, result.content, 'utf8');
      console.log(`✅ Fixed ${result.changes} patterns in: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findTypeScriptFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', 'out'].includes(item)) {
        findTypeScriptFiles(fullPath, files);
      }
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function main() {
  console.log('🔧 Testing JSDoc damage fix on small batch...');
  
  // Test on a small subset first - just the files we know were damaged
  const testFiles = [
    'app/api/progress/[customerId]/track/route.ts',
    'app/components/auth/SupabaseAuth.tsx',
    'lib/services/ExportEngineService.ts'
  ];
  
  let fixedCount = 0;
  
  testFiles.forEach(file => {
    if (fs.existsSync(file)) {
      if (processFile(file)) {
        fixedCount++;
      }
    } else {
      console.log(`⚠️  File not found: ${file}`);
    }
  });
  
  console.log(`\n📊 Test Results: Fixed ${fixedCount} files`);
  
  if (fixedCount > 0) {
    console.log('\n🧪 Running TypeScript check to validate fixes...');
    const { execSync } = require('child_process');
    try {
      execSync('npm run type-check', { stdio: 'inherit' });
      console.log('✅ TypeScript check passed - fixes are working!');
    } catch (error) {
      console.log('❌ TypeScript check failed - need to refine patterns');
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixJSDocDamage, processFile };
