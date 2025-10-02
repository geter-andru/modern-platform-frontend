#!/usr/bin/env node

/**
 * Fix Unescaped Entities Script
 * Simple and safe script to fix React unescaped entities
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get files with unescaped entity issues
function getFilesWithUnescapedEntities() {
  try {
    const result = execSync('npx eslint src --ext .ts,.tsx | grep "react/no-unescaped-entities" | cut -d":" -f1 | sort | uniq', 
      { encoding: 'utf8', cwd: __dirname, maxBuffer: 1024 * 1024 * 10 });
    return result.trim().split('\n').filter(f => f.length > 0 && f.includes('.tsx'));
  } catch (error) {
    console.error('Error getting files:', error.message);
    return [];
  }
}

// Fix unescaped entities in a file
function fixUnescapedEntities(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let modified = false;
    
    lines.forEach((line, index) => {
      // Fix common unescaped entities
      const originalLine = line;
      let fixedLine = line
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;');
      
      if (fixedLine !== originalLine) {
        lines[index] = fixedLine;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      console.log(`✅ Fixed unescaped entities in: ${path.basename(filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
function main() {
  console.log('🚀 Fixing Unescaped Entities...\n');
  
  const files = getFilesWithUnescapedEntities();
  console.log(`📁 Found ${files.length} files with unescaped entity issues\n`);
  
  let fixedFiles = 0;
  
  files.forEach(filePath => {
    if (fixUnescapedEntities(filePath)) {
      fixedFiles++;
    }
  });
  
  console.log(`\n🎉 Fixed ${fixedFiles} files`);
  
  // Check remaining issues
  console.log('\n🔍 Checking remaining unescaped entity issues...');
  try {
    const result = execSync('npx eslint src --ext .ts,.tsx | grep "react/no-unescaped-entities" | wc -l', 
      { encoding: 'utf8', cwd: __dirname, maxBuffer: 1024 * 1024 * 10 });
    const remainingIssues = parseInt(result.trim());
    console.log(`📊 Remaining unescaped entity issues: ${remainingIssues}`);
  } catch (error) {
    console.log('Could not check remaining issues');
  }
}

if (require.main === module) {
  main();
}
