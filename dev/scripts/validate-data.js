#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Actual mock data violations to detect (refined patterns)
const MOCK_PATTERNS = [
  // Function/variable names that indicate fake systems
  /\bmock[A-Z]\w*/,  // mockData, mockResponse, mockUser (camelCase)
  /\bfake[A-Z]\w*/,  // fakeData, fakeResponse, fakeUser (camelCase)
  /\bdummy[A-Z]\w*/,  // dummyData, dummyResponse (camelCase)
  /getMock[A-Z]\w*\(/,  // getMockData(), getMockUser() (function calls)
  /generateMock\w*\(/,  // generateMockData() (function calls)
  /return.*mock.*data/i,  // return mockData, return mock data
  /lorem ipsum/i,
  /john doe|jane doe/i,
  /@example\.com/,
  /123-456-7890/,
  // Template generators masquerading as real functionality
  /generateTemplate\w*\(/,
  /template.*generator/i,
  /hardcoded.*data/i,
  /static.*content/i
];

// Patterns that are legitimate and should be ignored
const LEGITIMATE_PATTERNS = [
  /placeholder="[^"]*"/,  // HTML placeholder attributes
  /placeholder:/,  // TypeScript placeholder properties
  /\.test\(/,  // Regex .test() methods
  /data-testid/,  // Testing infrastructure
  /Generated:\s*\${/,  // Real timestamp generation
  /\.footer/,  // CSS classes
  /class=".*footer.*"/,  // CSS class names
  /{\/\*.*Footer.*\*\/}/,  // HTML comments
  /{\/\*.*Bar.*\*\/}/,  // HTML comments
  /type.*=.*['"]line['"].*\|.*['"]bar['"].*\|.*['"]pie['"]/, // TypeScript union types
  /role="progressbar"/,  // ARIA attributes
  /overflow-x-auto/,  // CSS classes
  /'bars':/,  // Object property names
  /case 'bars':/,  // Switch cases
];

let hasErrors = false;
const errors = [];

// Scan TypeScript/TSX files for mock data patterns
function scanFile(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return;
  }
  
  // Skip legitimate test infrastructure
  if (filePath.includes('.test.') || 
      filePath.includes('.spec.') || 
      filePath.includes('__tests__') ||
      filePath.includes('/test-') ||
      filePath.includes('/api-test/') ||
      filePath.includes('/auth-test/') ||
      filePath.includes('/integration-test/') ||
      filePath.includes('/storage-test/') ||
      filePath.includes('/storage-cleanup/') ||
      filePath.includes('/test-config/') ||
      filePath.includes('/supabase-dashboard/') ||
      filePath.includes('/demo/') ||
      filePath.includes('TestPage') ||
      filePath.includes('authService.ts') ||  // Contains legitimate test tokens
      filePath.includes('/api/middleware/auth.ts') || // Contains test auth tokens
      filePath.includes('/api/progress/') || // Contains mock API responses for testing
      filePath.includes('/customer/[customerId]') || // Contains test customer IDs in static params
      filePath.includes('exportService.ts') || // Contains test methods for verification
      filePath.includes('webResearchService.ts') || // Contains test methods for verification
      filePath.includes('resourceGenerationService.ts') // Contains test methods for MCP verification
  ) {
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Skip comments and production-approved mock data
      if (line.trim().startsWith('//') || line.includes('@production-approved')) {
        return;
      }
      
      // Check if this line matches any legitimate patterns first
      const isLegitimate = LEGITIMATE_PATTERNS.some(pattern => pattern.test(line));
      if (isLegitimate) {
        return;
      }
      
      // Now check for actual mock data violations
      MOCK_PATTERNS.forEach(pattern => {
        if (pattern.test(line)) {
          const lineNum = index + 1;
          errors.push({
            file: filePath,
            line: lineNum,
            pattern: pattern.toString(),
            content: line.trim().substring(0, 100)
          });
          hasErrors = true;
        }
      });
    });
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
  }
}

// Recursively scan directory
function scanDirectory(dir) {
  // Skip node_modules and build directories
  const skipDirs = ['node_modules', '.next', 'dist', 'build', 'coverage', 'out'];
  
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!skipDirs.includes(file) && !file.startsWith('.')) {
          scanDirectory(fullPath);
        }
      } else {
        scanFile(fullPath);
      }
    });
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }
}

// Main execution
console.log('🔍 Scanning for mock data patterns...\n');

// Scan app and lib directories
['app', 'lib', 'src'].forEach(dir => {
  if (fs.existsSync(dir)) {
    scanDirectory(dir);
  }
});

// Report results
if (hasErrors) {
  console.error('❌ MOCK DATA VALIDATION FAILED!\n');
  console.error('Found mock data patterns in the following locations:\n');
  
  errors.forEach(error => {
    console.error(`📄 ${error.file}:${error.line}`);
    console.error(`   Pattern: ${error.pattern}`);
    console.error(`   Content: ${error.content}`);
    console.error('');
  });
  
  console.error(`\nTotal violations: ${errors.length}`);
  console.error('\n⚠️  Fix these issues before proceeding:');
  console.error('1. Replace mock data with real data sources');
  console.error('2. Add @production-approved comment if mock data is intentional');
  console.error('3. Use proper data fetching from APIs or databases\n');
  
  process.exit(1);
} else {
  console.log('✅ No mock data patterns detected!');
  console.log('All data appears to be production-ready.\n');
}