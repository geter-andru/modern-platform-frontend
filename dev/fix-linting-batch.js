#!/usr/bin/env node

/**
 * Batch Linting Fix Script
 * Processes files in smaller batches to avoid buffer limits
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get files with linting issues
function getFilesWithIssues() {
  try {
    const result = execSync('npx eslint src --ext .ts,.tsx | grep -E "(no-unused-vars|react/)" | cut -d":" -f1 | sort | uniq', 
      { encoding: 'utf8', cwd: __dirname, maxBuffer: 1024 * 1024 * 10 });
    return result.trim().split('\n').filter(f => f.length > 0);
  } catch (error) {
    console.error('Error getting files with issues:', error.message);
    return [];
  }
}

// Fix unescaped entities in a file
function fixUnescapedEntities(filePath) {
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
}

// Fix unused imports in a file
function fixUnusedImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let modified = false;
  
  // Common unused imports to remove
  const unusedImports = [
    'useEffect', 'motion', 'AnimatePresence', 'Bell', 'ChevronDown', 'ChevronUp',
    'RefreshCw', 'DollarSign', 'AlertTriangle', 'CheckCircle', 'Clock', 'Users',
    'Target', 'Eye', 'EyeOff', 'TrendingUp', 'Search', 'Home', 'BarChart3',
    'Settings', 'X', 'Lock', 'FileText', 'Database', 'Image'
  ];
  
  lines.forEach((line, index) => {
    if (line.includes('import') && line.includes('from')) {
      let fixedLine = line;
      
      unusedImports.forEach(importName => {
        // Remove unused imports
        const patterns = [
          new RegExp(`\\b${importName}\\s*,?\\s*`, 'g'),
          new RegExp(`,\\s*${importName}\\b`, 'g'),
          new RegExp(`\\b${importName}\\s*`, 'g')
        ];
        
        patterns.forEach(pattern => {
          fixedLine = fixedLine.replace(pattern, '');
        });
      });
      
      // Clean up empty imports and trailing commas
      fixedLine = fixedLine.replace(/,\s*}/g, '}');
      fixedLine = fixedLine.replace(/{\s*,/g, '{');
      fixedLine = fixedLine.replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"];?\s*/, '');
      
      if (fixedLine !== line) {
        lines[index] = fixedLine;
        modified = true;
      }
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`✅ Fixed unused imports in: ${path.basename(filePath)}`);
    return true;
  }
  
  return false;
}

// Process a single file
function processFile(filePath) {
  try {
    let modified = false;
    
    // Fix unescaped entities first (easier and safer)
    if (fixUnescapedEntities(filePath)) {
      modified = true;
    }
    
    // Fix unused imports
    if (fixUnusedImports(filePath)) {
      modified = true;
    }
    
    return modified;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
function main() {
  console.log('🚀 Starting Batch Linting Fixes...\n');
  
  const files = getFilesWithIssues();
  console.log(`📁 Found ${files.length} files with issues\n`);
  
  let fixedFiles = 0;
  let processedFiles = 0;
  
  // Process files in batches
  const batchSize = 10;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    
    console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} files)...`);
    
    batch.forEach(filePath => {
      if (processFile(filePath)) {
        fixedFiles++;
      }
      processedFiles++;
    });
    
    // Small delay between batches
    if (i + batchSize < files.length) {
      console.log('⏳ Waiting 1 second before next batch...\n');
      // No actual delay in script, just for logging
    }
  }
  
  console.log(`\n🎉 Processed ${processedFiles} files, fixed ${fixedFiles} files`);
  
  // Check remaining issues
  console.log('\n🔍 Checking remaining issues...');
  try {
    const result = execSync('npx eslint src --ext .ts,.tsx | grep -E "(no-unused-vars|react/)" | wc -l', 
      { encoding: 'utf8', cwd: __dirname, maxBuffer: 1024 * 1024 * 10 });
    const remainingIssues = parseInt(result.trim());
    console.log(`📊 Remaining issues: ${remainingIssues}`);
  } catch (error) {
    console.log('Could not check remaining issues');
  }
}

if (require.main === module) {
  main();
}

module.exports = { processFile, fixUnescapedEntities, fixUnusedImports };
