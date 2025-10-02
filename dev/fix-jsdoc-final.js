#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Final JSDoc Fix Script
 * Fixes all problematic JSDoc patterns using regex
 */

function findTsFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && !item.includes('mcp-servers')) {
      findTsFiles(fullPath, files);
    } else if ((item.endsWith('.ts') || item.endsWith('.tsx')) && !item.includes('mcp-servers')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixJSDocComments(content) {
  let fixed = content;
  
  // Pattern 1: Fix multiple /** opening tags
  fixed = fixed.replace(/\*\*\s*\n\s*\*\*\s*\n/g, ' *\n');
  
  // Pattern 2: Fix standalone * characters that should be part of JSDoc
  fixed = fixed.replace(/^\s*\*\s*$/gm, ' *');
  
  // Pattern 3: Fix malformed JSDoc blocks with multiple /** patterns
  fixed = fixed.replace(/\*\*\s*\n\s*\*\*\s*\n\s*\*/g, ' */');
  
  // Pattern 4: Fix incomplete JSDoc blocks
  fixed = fixed.replace(/\*\*\s*\n\s*\*\*\s*\n\s*\*\s*\n/g, ' *\n');
  
  // Pattern 5: Fix lines that start with * but aren't properly formatted
  fixed = fixed.replace(/^\s*\*\s*$/gm, ' *');
  
  // Pattern 6: Fix malformed JSDoc structure
  const lines = fixed.split('\n');
  let result = [];
  let inJSDoc = false;
  let jsdocStart = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check for JSDoc start
    if (trimmed.startsWith('/**') && !inJSDoc) {
      inJSDoc = true;
      jsdocStart = i;
      result.push(line);
      continue;
    }
    
    // Check for JSDoc end
    if (inJSDoc && trimmed.endsWith('*/')) {
      inJSDoc = false;
      result.push(line);
      continue;
    }
    
    // If we're in JSDoc, ensure proper formatting
    if (inJSDoc) {
      // Skip lines that are just * without content
      if (trimmed === '*') {
        result.push(' *');
        continue;
      }
      
      // Ensure JSDoc lines start with *
      if (!trimmed.startsWith('*') && trimmed !== '') {
        result.push(' * ' + trimmed);
      } else {
        result.push(line);
      }
      continue;
    }
    
    result.push(line);
  }
  
  return result.join('\n');
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixJSDocComments(content);
    
    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`✅ Fixed JSDoc in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Starting final JSDoc fix process...');
  
  const projectRoot = process.cwd();
  const tsFiles = findTsFiles(projectRoot);
  
  console.log(`📁 Found ${tsFiles.length} TypeScript files`);
  
  let fixedCount = 0;
  
  for (const file of tsFiles) {
    if (processFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n🎉 JSDoc fix complete!`);
  console.log(`📊 Files processed: ${tsFiles.length}`);
  console.log(`🔧 Files fixed: ${fixedCount}`);
  
  // Run type check to see if errors are resolved
  console.log('\n🔍 Running TypeScript type check...');
  try {
    execSync('npm run type-check', { stdio: 'inherit' });
    console.log('✅ TypeScript type check passed!');
  } catch (error) {
    console.log('⚠️  Some TypeScript errors remain. Check the output above.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixJSDocComments, processFile };