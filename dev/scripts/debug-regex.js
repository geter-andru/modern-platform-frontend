#!/usr/bin/env node

/**
 * Debug Script: Test regex patterns on actual damaged content
 */

const fs = require('fs');

function debugRegex() {
  console.log('🔍 Debugging regex patterns on actual damaged content...\n');
  
  // Read the actual damaged file
  const content = fs.readFileSync('src/shared/hooks/useProgressiveEngagement.ts', 'utf8');
  
  // Find lines with /*/ pattern
  const lines = content.split('\n');
  const damagedLines = [];
  
  lines.forEach((line, index) => {
    if (line.includes('/*/')) {
      damagedLines.push({
        lineNumber: index + 1,
        content: line,
        length: line.length,
        chars: line.split('').map((char, i) => `${i}:${char.charCodeAt(0)}`).join(' ')
      });
    }
  });
  
  console.log('📋 Found damaged lines:');
  damagedLines.forEach(({ lineNumber, content, length, chars }) => {
    console.log(`Line ${lineNumber}: "${content}"`);
    console.log(`  Length: ${length}, Chars: ${chars}`);
    console.log('');
  });
  
  // Test different regex patterns
  console.log('🧪 Testing regex patterns:');
  
  const patterns = [
    { name: 'Original pattern', regex: /^(\s*)\/\*\//g },
    { name: 'Without anchors', regex: /\/\*\//g },
    { name: 'With multiline', regex: /^(\s*)\/\*\//gm },
    { name: 'Exact match', regex: /\/\*\// },
    { name: 'With word boundary', regex: /\b\/\*\//g }
  ];
  
  patterns.forEach(({ name, regex }) => {
    const matches = content.match(regex);
    console.log(`${name}: ${matches ? matches.length : 0} matches`);
    if (matches) {
      console.log(`  Matches: ${matches.join(', ')}`);
    }
  });
  
  // Test the actual replacement
  console.log('\n🔧 Testing actual replacement:');
  const testContent = '  /*/ Progressive Engagement Hook';
  console.log(`Original: "${testContent}"`);
  
  const fixed = testContent.replace(/^(\s*)\/\*\//g, '$1/**');
  console.log(`Fixed: "${fixed}"`);
  console.log(`Changed: ${testContent !== fixed}`);
}

if (require.main === module) {
  debugRegex();
}

module.exports = { debugRegex };
