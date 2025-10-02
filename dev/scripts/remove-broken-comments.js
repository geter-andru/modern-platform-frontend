#!/usr/bin/env node

/**
 * Surgical Fix: Remove ALL broken JSDoc comments
 * Removes malformed comment blocks while preserving actual TypeScript code
 */

const fs = require('fs');
const path = require('path');

function removeBrokenComments(content) {
  let fixedContent = content;
  let changes = 0;

  // Pattern 1: Remove broken comment blocks that start with /*/ and end with * /
  const before1 = fixedContent;
  fixedContent = fixedContent.replace(/\/\*\/[\s\S]*?\* \//g, '');
  if (before1 !== fixedContent) changes++;

  // Pattern 2: Remove standalone broken comment starts /*/
  const before2 = fixedContent;
  fixedContent = fixedContent.replace(/\/\*\/[^\n]*/g, '');
  if (before2 !== fixedContent) changes++;

  // Pattern 3: Remove standalone broken comment ends * /
  const before3 = fixedContent;
  fixedContent = fixedContent.replace(/^\s*\* \s*$/gm, '');
  if (before3 !== fixedContent) changes++;

  // Pattern 4: Remove any remaining malformed comment patterns
  const before4 = fixedContent;
  fixedContent = fixedContent.replace(/\/\*\/[\s\S]*?(?=\n\s*[a-zA-Z]|\n\s*export|\n\s*const|\n\s*function|\n\s*class|\n\s*interface|\n\s*type|\n\s*import|\n\s*$)/g, '');
  if (before4 !== fixedContent) changes++;

  // Clean up multiple consecutive empty lines
  const before5 = fixedContent;
  fixedContent = fixedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
  if (before5 !== fixedContent) changes++;

  return { content: fixedContent, changes };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = removeBrokenComments(content);
    
    if (result.changes > 0) {
      fs.writeFileSync(filePath, result.content, 'utf8');
      console.log(`✅ Removed ${result.changes} broken comment patterns from: ${filePath}`);
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
  console.log('🔧 Surgical Fix: Removing ALL broken JSDoc comments...');
  
  const allFiles = findTypeScriptFiles('.');
  let fixedCount = 0;
  let totalChanges = 0;
  
  allFiles.forEach(file => {
    if (processFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n📊 Results:`);
  console.log(`   Files processed: ${allFiles.length}`);
  console.log(`   Files with broken comments removed: ${fixedCount}`);
  
  if (fixedCount > 0) {
    console.log('\n🧪 Running TypeScript check to validate comment removal...');
    const { execSync } = require('child_process');
    try {
      execSync('npm run type-check', { stdio: 'inherit' });
      console.log('✅ TypeScript check passed - All broken comments removed successfully!');
    } catch (error) {
      console.log('❌ TypeScript check failed - Some broken comments may remain');
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { removeBrokenComments, processFile };
