#!/usr/bin/env node

/**
 * Fix HTML Entity Encoding Corruption Script
 * Corrects HTML entities back to proper quotes in TypeScript/TSX files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all TypeScript/TSX files with HTML entity issues
function getFilesWithHtmlEntities() {
  try {
    const result = execSync('find src app -name "*.ts" -o -name "*.tsx" | xargs grep -l "&apos;\\|&quot;" 2>/dev/null || true', 
      { encoding: 'utf8', cwd: __dirname, maxBuffer: 1024 * 1024 * 10 });
    return result.trim().split('\n').filter(f => f.length > 0);
  } catch (error) {
    console.error('Error getting files:', error.message);
    return [];
  }
}

// Fix HTML entities in a file
function fixHtmlEntities(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Fix HTML entities back to proper quotes
    let fixedContent = content
      .replace(/&apos;/g, "'")  // Fix single quotes
      .replace(/&quot;/g, '"'); // Fix double quotes
    
    if (fixedContent !== originalContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✅ Fixed HTML entities in: ${path.basename(filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Count remaining HTML entities
function countRemainingEntities() {
  try {
    const result = execSync('find src app -name "*.ts" -o -name "*.tsx" | xargs grep -c "&apos;\\|&quot;" 2>/dev/null | awk \'{sum += $1} END {print sum}\' || echo "0"', 
      { encoding: 'utf8', cwd: __dirname, maxBuffer: 1024 * 1024 * 10 });
    return parseInt(result.trim()) || 0;
  } catch (error) {
    return 0;
  }
}

// Main execution
function main() {
  console.log('🚀 Fixing HTML Entity Encoding Corruption...\n');
  
  const files = getFilesWithHtmlEntities();
  console.log(`📁 Found ${files.length} files with HTML entity issues\n`);
  
  if (files.length === 0) {
    console.log('✅ No files with HTML entity issues found!');
    return;
  }
  
  let fixedFiles = 0;
  
  files.forEach(filePath => {
    if (fixHtmlEntities(filePath)) {
      fixedFiles++;
    }
  });
  
  console.log(`\n🎉 Fixed ${fixedFiles} files`);
  
  // Check remaining issues
  const remainingEntities = countRemainingEntities();
  console.log(`📊 Remaining HTML entities: ${remainingEntities}`);
  
  if (remainingEntities === 0) {
    console.log('\n✅ All HTML entity issues have been resolved!');
    console.log('\n🔍 Running TypeScript compilation check...');
    
    try {
      execSync('npx tsc --noEmit --strict', { 
        encoding: 'utf8', 
        cwd: __dirname,
        stdio: 'inherit'
      });
      console.log('\n🎉 TypeScript compilation successful!');
    } catch (error) {
      console.log('\n⚠️  TypeScript compilation still has issues. Check the output above.');
    }
  } else {
    console.log('\n⚠️  Some HTML entity issues remain. Please check the files manually.');
  }
}

if (require.main === module) {
  main();
}
