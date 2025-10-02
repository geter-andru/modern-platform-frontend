#!/usr/bin/env node

/**
 * Script to systematically replace 'any' types with proper TypeScript types
 * This script helps identify patterns and provides safe replacements
 */

const fs = require('fs');
const path = require('path');

// Common replacement patterns
const REPLACEMENT_PATTERNS = [
  // API Response patterns
  {
    pattern: /data:\s*any\[\]/g,
    replacement: 'data: unknown[]',
    description: 'Generic array data'
  },
  {
    pattern: /Record<string,\s*any>/g,
    replacement: 'Record<string, string | number | boolean | object>',
    description: 'Generic object records'
  },
  {
    pattern: /context:\s*any/g,
    replacement: 'context: Record<string, string | number | boolean | object>',
    description: 'Context objects'
  },
  {
    pattern: /metadata:\s*any/g,
    replacement: 'metadata: Record<string, string | number | boolean>',
    description: 'Metadata objects'
  },
  {
    pattern: /params:\s*any/g,
    replacement: 'params: Record<string, string>',
    description: 'URL parameters'
  },
  {
    pattern: /body:\s*any/g,
    replacement: 'body: unknown',
    description: 'Request body'
  },
  {
    pattern: /result:\s*any/g,
    replacement: 'result: unknown',
    description: 'Generic results'
  },
  {
    pattern: /response:\s*any/g,
    replacement: 'response: unknown',
    description: 'API responses'
  }
];

// Safe replacement patterns (low risk)
const SAFE_REPLACEMENTS = [
  {
    pattern: /:\s*any\s*=/g,
    replacement: ': unknown =',
    description: 'Variable assignments'
  },
  {
    pattern: /:\s*any\[\]/g,
    replacement: ': unknown[]',
    description: 'Array types'
  },
  {
    pattern: /:\s*any\s*;/g,
    replacement: ': unknown;',
    description: 'Property declarations'
  }
];

function findFilesWithAnyTypes(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.next')) {
        traverse(fullPath);
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(': any') || content.includes('<any>') || content.includes('any[]')) {
          files.push({
            path: fullPath,
            content,
            anyCount: (content.match(/:\s*any\b/g) || []).length
          });
        }
      }
    }
  }
  
  traverse(dir);
  return files.sort((a, b) => b.anyCount - a.anyCount);
}

function analyzeAnyUsage(content) {
  const patterns = {
    functionParams: (content.match(/function\s+\w+\([^)]*:\s*any[^)]*\)/g) || []).length,
    interfaceProps: (content.match(/interface\s+\w+[^{]*{[^}]*:\s*any[^}]*}/g) || []).length,
    variableDeclarations: (content.match(/:\s*any\s*=/g) || []).length,
    arrayTypes: (content.match(/:\s*any\[\]/g) || []).length,
    genericTypes: (content.match(/<any>/g) || []).length,
    recordTypes: (content.match(/Record<string,\s*any>/g) || []).length
  };
  
  return patterns;
}

function generateReport() {
  console.log('🔍 Analyzing any type usage in the codebase...\n');
  
  const files = findFilesWithAnyTypes('./app');
  const srcFiles = findFilesWithAnyTypes('./src');
  const libFiles = findFilesWithAnyTypes('./lib');
  
  const allFiles = [...files, ...srcFiles, ...libFiles];
  
  console.log(`📊 Found ${allFiles.length} files with 'any' types\n`);
  
  // Top files by any count
  console.log('🔥 Top 10 files with most any types:');
  allFiles.slice(0, 10).forEach((file, index) => {
    const relativePath = file.path.replace(process.cwd() + '/', '');
    console.log(`${index + 1}. ${relativePath} (${file.anyCount} any types)`);
  });
  
  console.log('\n📈 Usage patterns:');
  const totalPatterns = allFiles.reduce((acc, file) => {
    const patterns = analyzeAnyUsage(file.content);
    Object.keys(patterns).forEach(key => {
      acc[key] = (acc[key] || 0) + patterns[key];
    });
    return acc;
  }, {});
  
  Object.entries(totalPatterns).forEach(([pattern, count]) => {
    console.log(`  ${pattern}: ${count}`);
  });
  
  console.log('\n🎯 Recommended replacement strategy:');
  console.log('1. Start with API routes (highest impact)');
  console.log('2. Replace Record<string, any> with proper types');
  console.log('3. Replace function parameters with specific interfaces');
  console.log('4. Replace array types with proper element types');
  console.log('5. Use unknown for truly dynamic data');
  
  return allFiles;
}

function suggestReplacements(filePath, content) {
  const suggestions = [];
  
  REPLACEMENT_PATTERNS.forEach(pattern => {
    const matches = content.match(pattern.pattern);
    if (matches) {
      suggestions.push({
        pattern: pattern.description,
        matches: matches.length,
        replacement: pattern.replacement
      });
    }
  });
  
  return suggestions;
}

// Main execution
if (require.main === module) {
  const files = generateReport();
  
  console.log('\n🔧 Suggested replacements for top files:');
  files.slice(0, 5).forEach(file => {
    const relativePath = file.path.replace(process.cwd() + '/', '');
    console.log(`\n📁 ${relativePath}:`);
    
    const suggestions = suggestReplacements(file.path, file.content);
    suggestions.forEach(suggestion => {
      console.log(`  - ${suggestion.pattern}: ${suggestion.matches} instances`);
      console.log(`    Replace with: ${suggestion.replacement}`);
    });
  });
}

module.exports = {
  findFilesWithAnyTypes,
  analyzeAnyUsage,
  REPLACEMENT_PATTERNS,
  SAFE_REPLACEMENTS
};
