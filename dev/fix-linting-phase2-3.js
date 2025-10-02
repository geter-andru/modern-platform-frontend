#!/usr/bin/env node

/**
 * Phase 2 & 3 Linting Fix Script
 * Automatically fixes common unused variable and React best practice issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all TypeScript/TSX files in src directory
function getAllTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllTsFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Fix unused imports in a file
function fixUnusedImports(content) {
  // Common unused imports to remove
  const unusedImports = [
    'useEffect',
    'motion',
    'AnimatePresence',
    'Bell',
    'ChevronDown',
    'ChevronUp',
    'RefreshCw',
    'DollarSign',
    'AlertTriangle',
    'CheckCircle',
    'Clock',
    'Users',
    'Target',
    'Eye',
    'EyeOff',
    'TrendingUp'
  ];
  
  let fixed = content;
  
  // Remove unused imports from import statements
  unusedImports.forEach(importName => {
    // Remove from destructured imports
    const destructuredPattern = new RegExp(`\\b${importName}\\s*,?\\s*`, 'g');
    fixed = fixed.replace(destructuredPattern, '');
    
    // Clean up empty import lines
    fixed = fixed.replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"];?\s*\n/g, '');
    
    // Clean up trailing commas in imports
    fixed = fixed.replace(/,\s*}/g, '}');
    fixed = fixed.replace(/{\s*,/g, '{');
  });
  
  return fixed;
}

// Fix React unescaped entities
function fixUnescapedEntities(content) {
  return content
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;');
}

// Fix unused variables (basic cases)
function fixUnusedVariables(content) {
  // Remove unused destructured parameters
  const unusedParamPattern = /(\w+),\s*/g;
  
  // This is more complex and should be done carefully
  // For now, we'll focus on the simpler fixes
  return content;
}

// Process a single file
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let fixed = content;
    
    // Apply fixes
    fixed = fixUnusedImports(fixed);
    fixed = fixUnescapedEntities(fixed);
    
    // Only write if content changed
    if (fixed !== content) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
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
  console.log('🚀 Starting Phase 2 & 3 Linting Fixes...\n');
  
  const srcDir = path.join(__dirname, 'src');
  const files = getAllTsFiles(srcDir);
  
  console.log(`📁 Found ${files.length} TypeScript files\n`);
  
  let fixedCount = 0;
  
  for (const file of files) {
    if (processFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n🎉 Fixed ${fixedCount} files`);
  
  // Run ESLint to check remaining issues
  console.log('\n🔍 Checking remaining issues...');
  try {
    const result = execSync('npx eslint src --ext .ts,.tsx | grep -E "(no-unused-vars|react/)" | wc -l', 
      { encoding: 'utf8', cwd: __dirname });
    const remainingIssues = parseInt(result.trim());
    console.log(`📊 Remaining issues: ${remainingIssues}`);
  } catch (error) {
    console.log('Could not check remaining issues');
  }
}

if (require.main === module) {
  main();
}

module.exports = { processFile, fixUnusedImports, fixUnescapedEntities };
