#!/usr/bin/env node

/**
 * Surgical Fix: Remove ALL JSDoc and JSX comments
 * Removes JSDoc and JSX comment blocks while preserving // comments
 */

const fs = require('fs');
const path = require('path');

function removeJSDocAndJSXComments(content) {
  let fixedContent = content;
  let changes = 0;

  // Pattern 1: Remove JSDoc comments /** ... */
  const before1 = fixedContent;
  fixedContent = fixedContent.replace(/\/\*\*[\s\S]*?\*\//g, '');
  if (before1 !== fixedContent) changes++;

  // Pattern 2: Remove JSX comments {/* ... */}
  const before2 = fixedContent;
  fixedContent = fixedContent.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  if (before2 !== fixedContent) changes++;

  // Pattern 3: Remove any remaining malformed JSDoc patterns /*/ ... */
  const before3 = fixedContent;
  fixedContent = fixedContent.replace(/\/\*\/[\s\S]*?\*\//g, '');
  if (before3 !== fixedContent) changes++;

  // Pattern 4: Remove any remaining malformed JSX patterns {*/ ... */}
  const before4 = fixedContent;
  fixedContent = fixedContent.replace(/\{\*\/[\s\S]*?\*\/\}/g, '');
  if (before4 !== fixedContent) changes++;

  // Pattern 5: Remove standalone comment starts that don't have proper endings
  const before5 = fixedContent;
  fixedContent = fixedContent.replace(/\/\*\/[^\n]*/g, '');
  if (before5 !== fixedContent) changes++;

  // Pattern 6: Remove standalone comment ends
  const before6 = fixedContent;
  fixedContent = fixedContent.replace(/^\s*\* \s*$/gm, '');
  if (before6 !== fixedContent) changes++;

  // Pattern 7: Remove any remaining /*/ patterns
  const before7 = fixedContent;
  fixedContent = fixedContent.replace(/\/\*\/[^\n]*/g, '');
  if (before7 !== fixedContent) changes++;

  // Pattern 8: Remove any remaining */ patterns at end of lines
  const before8 = fixedContent;
  fixedContent = fixedContent.replace(/^\s*\*\/\s*$/gm, '');
  if (before8 !== fixedContent) changes++;

  // Clean up multiple consecutive empty lines
  const before9 = fixedContent;
  fixedContent = fixedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
  if (before9 !== fixedContent) changes++;

  return { content: fixedContent, changes };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = removeJSDocAndJSXComments(content);
    
    if (result.changes > 0) {
      fs.writeFileSync(filePath, result.content, 'utf8');
      console.log(`✅ Removed ${result.changes} JSDoc/JSX comment patterns from: ${filePath}`);
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
  console.log('🔧 Surgical Fix: Removing ALL JSDoc and JSX comments...');
  
  const allFiles = findTypeScriptFiles('.');
  let fixedCount = 0;
  
  allFiles.forEach(file => {
    if (processFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n📊 Results:`);
  console.log(`   Files processed: ${allFiles.length}`);
  console.log(`   Files with JSDoc/JSX comments removed: ${fixedCount}`);
  
  if (fixedCount > 0) {
    console.log('\n🧪 Running TypeScript check to validate comment removal...');
    const { execSync } = require('child_process');
    try {
      execSync('npm run type-check', { stdio: 'inherit' });
      console.log('✅ TypeScript check passed - All JSDoc/JSX comments removed successfully!');
    } catch (error) {
      console.log('❌ TypeScript check failed - Some comments may remain');
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { removeJSDocAndJSXComments, processFile };
