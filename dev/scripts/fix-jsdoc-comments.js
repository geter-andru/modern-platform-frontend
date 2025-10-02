#!/usr/bin/env node

/**
 * JSDoc Comment Fixer Script
 * Fixes malformed JSDoc comments that are causing TypeScript errors
 */

const fs = require('fs');
const path = require('path');

function fixJSDocComments(content) {
  // Fix nested /** blocks - remove duplicate /** patterns
  content = content.replace(/\*\/\s*\*\*\s*\*/g, '*/');
  
  // Fix malformed comment blocks that start with /** but have issues
  content = content.replace(/\*\*\s*\*\*\s*\*/g, '*/');
  
  // Fix comments that have /** followed by another /** on the same line
  content = content.replace(/\*\*\s*\*\*\s*\*/g, '*/');
  
  // Fix comments that have multiple /** in sequence
  content = content.replace(/(\*\*\/\s*)+/g, '*/');
  
  // Fix comments that have /** followed by text without proper spacing
  content = content.replace(/\*\*\s*([^*\s])/g, '* $1');
  
  // Fix comments that start with /** but are missing the opening
  content = content.replace(/^(\s*)\*\s*([^*\s])/gm, '$1* $2');
  
  // Fix comments that have malformed JSDoc syntax
  content = content.replace(/\*\s*\*\s*\*/g, '*/');
  
  // Fix comments that have /** without proper closing
  content = content.replace(/\*\*\s*$/gm, '*/');
  
  // Fix comments that have multiple * in sequence
  content = content.replace(/\*{3,}/g, '*/');
  
  // Fix specific pattern: */ followed by standalone *
  content = content.replace(/\*\/\s*\*\s*$/gm, '*/');
  
  // Fix pattern: */ * text - remove the standalone *
  content = content.replace(/\*\/\s*\*\s*([^*\s])/g, '*/ $1');
  
  // Fix pattern: */ * * text - remove the standalone * *
  content = content.replace(/\*\/\s*\*\s*\*\s*([^*\s])/g, '*/ $1');
  
  return content;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixJSDocComments(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
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
  console.log('🔧 Fixing JSDoc comments...');
  
  // Find all TypeScript files
  const files = findTypeScriptFiles('.');
  
  let fixedCount = 0;
  
  files.forEach(file => {
    if (processFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n📊 Summary: Fixed ${fixedCount} files`);
}

if (require.main === module) {
  main();
}

module.exports = { fixJSDocComments, processFile };
