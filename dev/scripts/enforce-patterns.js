#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔍 Enforcing Mandatory Development Patterns...\n');

let violations = [];

// Check 1: No manual component creation outside of src/features
function checkComponentStructure() {
  console.log('📋 Checking component structure...');
  
  // Check for components outside proper structure
  const invalidPaths = [
    'app/components',  // Old structure
    'components',      // Root components
    'src/components',  // Wrong location
  ];
  
  invalidPaths.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      files.forEach(file => {
        if (file.isFile() && (file.name.endsWith('.tsx') || file.name.endsWith('.jsx'))) {
          // Skip UI components (allowed in app/components/ui)
          if (!dir.includes('ui')) {
            violations.push({
              type: 'STRUCTURE',
              message: `Component found outside src/features: ${path.join(dir, file.name)}`,
              fix: 'Use: npm run create:component FeatureName ComponentName'
            });
          }
        }
      });
    }
  });
}

// Check 2: Verify all features follow correct structure
function checkFeatureStructure() {
  console.log('📁 Checking feature structure...');
  
  const featuresDir = 'src/features';
  if (fs.existsSync(featuresDir)) {
    const features = fs.readdirSync(featuresDir, { withFileTypes: true });
    
    features.forEach(feature => {
      if (feature.isDirectory()) {
        const featurePath = path.join(featuresDir, feature.name);
        const requiredDirs = ['components', 'types', 'hooks', 'services', 'utils'];
        
        requiredDirs.forEach(dir => {
          const dirPath = path.join(featurePath, dir);
          if (!fs.existsSync(dirPath)) {
            violations.push({
              type: 'FEATURE',
              message: `Missing required directory: ${dirPath}`,
              fix: `Use: npm run create:feature ${feature.name} (recreate properly)`
            });
          }
        });
        
        // Check for index.ts
        if (!fs.existsSync(path.join(featurePath, 'index.ts'))) {
          violations.push({
            type: 'FEATURE',
            message: `Missing index.ts in feature: ${featurePath}`,
            fix: `Use: npm run create:feature ${feature.name} (recreate properly)`
          });
        }
      }
    });
  }
}

// Check 3: No .jsx or .js files
function checkFileExtensions() {
  console.log('📝 Checking file extensions...');
  
  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and build directories
        if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(entry.name)) {
          scanDir(fullPath);
        }
      } else if (entry.isFile()) {
        // Check for forbidden extensions
        if (entry.name.endsWith('.jsx')) {
          violations.push({
            type: 'EXTENSION',
            message: `JSX file found: ${fullPath}`,
            fix: 'Convert to .tsx file with proper TypeScript'
          });
        }
        
        // Allow .js only for config files
        if (entry.name.endsWith('.js') && 
            !entry.name.includes('config') && 
            !entry.name.includes('.config.') &&
            !fullPath.includes('scripts/') &&
            !fullPath.includes('node_modules')) {
          violations.push({
            type: 'EXTENSION',
            message: `JavaScript file found: ${fullPath}`,
            fix: 'Convert to .ts file with proper TypeScript'
          });
        }
      }
    });
  }
  
  scanDir('app');
  scanDir('lib');
  scanDir('src');
}

// Check 4: Verify imports don't use deep relative paths
function checkImports() {
  console.log('🔗 Checking import patterns...');
  
  function scanFile(filePath) {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Check for deep relative imports
        if (line.includes('../../..')) {
          violations.push({
            type: 'IMPORT',
            message: `Deep relative import in ${filePath}:${index + 1}`,
            fix: 'Use absolute imports: @/features, @/lib, @/components'
          });
        }
      });
    } catch (error) {
      // Skip files that can't be read
    }
  }
  
  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!['node_modules', '.next', 'dist', 'build'].includes(entry.name)) {
          scanDir(fullPath);
        }
      } else if (entry.isFile()) {
        scanFile(fullPath);
      }
    });
  }
  
  scanDir('app');
  scanDir('lib');
  scanDir('src');
}

// Check 5: Verify no manual creation markers
function checkManualCreation() {
  console.log('🚫 Checking for manual file creation...');
  
  // Look for files that don't have the auto-generated markers
  const srcFeatures = 'src/features';
  
  if (fs.existsSync(srcFeatures)) {
    const features = fs.readdirSync(srcFeatures, { withFileTypes: true });
    
    features.forEach(feature => {
      if (feature.isDirectory()) {
        const componentsDir = path.join(srcFeatures, feature.name, 'components');
        
        if (fs.existsSync(componentsDir)) {
          const components = fs.readdirSync(componentsDir);
          
          components.forEach(file => {
            if (file.endsWith('.tsx')) {
              const filePath = path.join(componentsDir, file);
              const content = fs.readFileSync(filePath, 'utf8');
              
              // Check for expected auto-generated patterns
              if (!content.includes('TODO: Add props here') && 
                  !content.includes('TODO: Implement component logic') &&
                  !content.includes('// @production-approved')) {
                violations.push({
                  type: 'MANUAL',
                  message: `Possibly manually created component: ${filePath}`,
                  fix: 'Use: npm run create:component (or add @production-approved comment)'
                });
              }
            }
          });
        }
      }
    });
  }
}

// Run all checks
checkComponentStructure();
checkFeatureStructure();
checkFileExtensions();
checkImports();
checkManualCreation();

// Report results
console.log('\n' + '='.repeat(60));

if (violations.length === 0) {
  console.log('✅ All mandatory patterns are being followed!');
  console.log('Your code structure is compliant.\n');
  process.exit(0);
} else {
  console.error(`❌ Found ${violations.length} pattern violations:\n`);
  
  // Group violations by type
  const grouped = violations.reduce((acc, v) => {
    if (!acc[v.type]) acc[v.type] = [];
    acc[v.type].push(v);
    return acc;
  }, {});
  
  Object.entries(grouped).forEach(([type, items]) => {
    console.error(`\n${type} VIOLATIONS (${items.length}):`);
    console.error('-'.repeat(40));
    
    items.forEach(item => {
      console.error(`❌ ${item.message}`);
      console.error(`   Fix: ${item.fix}`);
    });
  });
  
  console.error('\n' + '='.repeat(60));
  console.error('⚠️  Fix these violations before proceeding!');
  console.error('Read MANDATORY_PATTERNS.md for complete guidelines.\n');
  
  process.exit(1);
}