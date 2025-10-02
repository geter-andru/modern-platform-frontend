const fs = require('fs');
const path = require('path');

const REQUIRED_STRUCTURE = {
  'src/features': 'Business features must be in src/features/',
  'src/components/ui': 'Reusable UI components must be in src/components/ui/',
  'src/lib': 'Utilities and services must be in src/lib/',
  'app/api': 'API routes must be in app/api/'
};

const FORBIDDEN_PATTERNS = [
  { pattern: /\.jsx$/, message: 'JSX files not allowed. Use .tsx instead.' },
  { pattern: /mockData|MOCK_DATA|fake.*data/i, message: 'Mock data not allowed in production code.' },
  { pattern: /src\/.*\/.*\.tsx$/, message: 'Components must use proper feature structure.' }
];

let hasErrors = false;

// Check and enforce structure
Object.entries(REQUIRED_STRUCTURE).forEach(([dir, message]) => {
  if (!fs.existsSync(dir)) {
    console.error(`❌ ${message}`);
    console.log(`Creating required directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Recursively scan files for forbidden patterns
function scanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and other ignored directories
      if (['node_modules', '.next', '.git', 'coverage', 'dist', 'build', 'out'].includes(entry.name)) {
        continue;
      }
      scanDirectory(fullPath);
    } else if (entry.isFile()) {
      // Check filename patterns
      for (const { pattern, message } of FORBIDDEN_PATTERNS) {
        if (pattern.test(entry.name)) {
          console.error(`❌ ${message}: ${fullPath}`);
          hasErrors = true;
        }
      }
      
      // Check file content for patterns (only for code files)
      if (/\.(ts|tsx)$/.test(entry.name)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          for (const { pattern, message } of FORBIDDEN_PATTERNS) {
            if (pattern.test(content)) {
              // Check if this is mock data pattern and if it's production-approved
              if (pattern.toString().includes('mockData') && content.includes('// @production-approved')) {
                // Skip production-approved mock data
                continue;
              }
              console.error(`❌ ${message}: ${fullPath}`);
              hasErrors = true;
            }
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    }
  }
}

console.log('🔍 Scanning project structure...');

// Scan main directories
['app', 'lib', 'src'].forEach(dir => {
  if (fs.existsSync(dir)) {
    scanDirectory(dir);
  }
});

if (hasErrors) {
  console.error('\n❌ Structure validation failed! Fix the above issues.');
  process.exit(1);
} else {
  console.log('✅ Structure validation passed!');
}