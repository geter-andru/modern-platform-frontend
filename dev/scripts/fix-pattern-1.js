#!/usr/bin/env node

/**
 * Surgical Fix: Pattern 1 - Fix broken JSDoc start patterns
 * Only fixes the broken comment start pattern, nothing else
 */

const fs = require('fs');
const path = require('path');

function fixPattern1(content) {
  let fixedContent = content;
  let changes = 0;

  // Pattern 1: Fix broken comment start at beginning of lines
  const before = fixedContent;
  fixedContent = fixedContent.replace(/^(\s*)\/\*\//g, '$1/**');
  if (before !== fixedContent) changes++;

  return { content: fixedContent, changes };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = fixPattern1(content);
    
    if (result.changes > 0) {
      fs.writeFileSync(filePath, result.content, 'utf8');
      console.log(`✅ Fixed ${result.changes} broken comment patterns in: ${filePath}`);
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
  console.log('🔧 Surgical Fix: Pattern 1 - Fixing broken comment start patterns...');
  
  const allFiles = findTypeScriptFiles('.');
  let fixedCount = 0;
  
  allFiles.forEach(file => {
    if (processFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n📊 Pattern 1 Results:`);
  console.log(`   Files processed: ${allFiles.length}`);
  console.log(`   Files fixed: ${fixedCount}`);
  
  if (fixedCount > 0) {
    console.log('\n🧪 Running TypeScript check to validate Pattern 1 fixes...');
    const { execSync } = require('child_process');
    try {
      execSync('npm run type-check', { stdio: 'inherit' });
      console.log('✅ TypeScript check passed - Pattern 1 fixes are working!');
    } catch (error) {
      console.log('❌ TypeScript check failed - Pattern 1 needs refinement');
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixPattern1, processFile };