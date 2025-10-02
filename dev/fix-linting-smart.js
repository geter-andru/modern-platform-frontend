#!/usr/bin/env node

/**
 * Smart Linting Fix Script
 * Uses ESLint output to make targeted fixes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get ESLint issues for specific rules
function getLintingIssues() {
  try {
    const result = execSync('npx eslint src --ext .ts,.tsx --format=json', 
      { encoding: 'utf8', cwd: __dirname });
    const eslintOutput = JSON.parse(result);
    
    const issues = {
      unusedVars: [],
      unescapedEntities: []
    };
    
    eslintOutput.forEach(file => {
      file.messages.forEach(message => {
        if (message.ruleId === 'no-unused-vars') {
          issues.unusedVars.push({
            file: file.filePath,
            line: message.line,
            column: message.column,
            message: message.message
          });
        } else if (message.ruleId === 'react/no-unescaped-entities') {
          issues.unescapedEntities.push({
            file: file.filePath,
            line: message.line,
            column: message.column,
            message: message.message
          });
        }
      });
    });
    
    return issues;
  } catch (error) {
    console.error('Error getting linting issues:', error.message);
    return { unusedVars: [], unescapedEntities: [] };
  }
}

// Fix unescaped entities in a file
function fixUnescapedEntities(filePath, issues) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let modified = false;
  
  issues.forEach(issue => {
    const lineIndex = issue.line - 1;
    if (lineIndex >= 0 && lineIndex < lines.length) {
      const line = lines[lineIndex];
      
      // Fix common unescaped entities
      let fixedLine = line
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;');
      
      if (fixedLine !== line) {
        lines[lineIndex] = fixedLine;
        modified = true;
      }
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
function fixUnusedImports(filePath, issues) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let modified = false;
  
  // Group issues by line
  const lineIssues = {};
  issues.forEach(issue => {
    if (!lineIssues[issue.line]) {
      lineIssues[issue.line] = [];
    }
    lineIssues[issue.line].push(issue);
  });
  
  // Process each line with issues
  Object.keys(lineIssues).forEach(lineNum => {
    const lineIndex = parseInt(lineNum) - 1;
    if (lineIndex >= 0 && lineIndex < lines.length) {
      const line = lines[lineIndex];
      const lineIssuesList = lineIssues[lineNum];
      
      // Check if this is an import line
      if (line.includes('import') && line.includes('from')) {
        let fixedLine = line;
        
        lineIssuesList.forEach(issue => {
          // Extract the unused variable name from the message
          const match = issue.message.match(/'([^']+)' is defined but never used/);
          if (match) {
            const unusedVar = match[1];
            
            // Remove the unused variable from the import
            const patterns = [
              new RegExp(`\\b${unusedVar}\\s*,?\\s*`, 'g'),
              new RegExp(`,\\s*${unusedVar}\\b`, 'g'),
              new RegExp(`\\b${unusedVar}\\s*`, 'g')
            ];
            
            patterns.forEach(pattern => {
              fixedLine = fixedLine.replace(pattern, '');
            });
            
            // Clean up empty imports and trailing commas
            fixedLine = fixedLine.replace(/,\s*}/g, '}');
            fixedLine = fixedLine.replace(/{\s*,/g, '{');
            fixedLine = fixedLine.replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"];?\s*/, '');
          }
        });
        
        if (fixedLine !== line) {
          lines[lineIndex] = fixedLine;
          modified = true;
        }
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

// Main execution
function main() {
  console.log('🚀 Starting Smart Linting Fixes...\n');
  
  const issues = getLintingIssues();
  
  console.log(`📊 Found ${issues.unusedVars.length} unused variable issues`);
  console.log(`📊 Found ${issues.unescapedEntities.length} unescaped entity issues\n`);
  
  // Group issues by file
  const fileIssues = {};
  
  [...issues.unusedVars, ...issues.unescapedEntities].forEach(issue => {
    if (!fileIssues[issue.file]) {
      fileIssues[issue.file] = {
        unusedVars: [],
        unescapedEntities: []
      };
    }
    
    if (issue.message.includes('is defined but never used')) {
      fileIssues[issue.file].unusedVars.push(issue);
    } else if (issue.message.includes('can be escaped')) {
      fileIssues[issue.file].unescapedEntities.push(issue);
    }
  });
  
  let fixedFiles = 0;
  
  // Process each file
  Object.keys(fileIssues).forEach(filePath => {
    const fileIssue = fileIssues[filePath];
    let fileModified = false;
    
    // Fix unescaped entities first (easier and safer)
    if (fileIssue.unescapedEntities.length > 0) {
      if (fixUnescapedEntities(filePath, fileIssue.unescapedEntities)) {
        fileModified = true;
      }
    }
    
    // Fix unused imports
    if (fileIssue.unusedVars.length > 0) {
      if (fixUnusedImports(filePath, fileIssue.unusedVars)) {
        fileModified = true;
      }
    }
    
    if (fileModified) {
      fixedFiles++;
    }
  });
  
  console.log(`\n🎉 Fixed ${fixedFiles} files`);
  
  // Check remaining issues
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

module.exports = { getLintingIssues, fixUnescapedEntities, fixUnusedImports };
