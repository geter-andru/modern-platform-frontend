#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating project structure...\n');

let violations = [];

// Check 1: Verify src/features structure
function checkFeaturesStructure() {
  console.log('📁 Checking features structure...');
  
  const featuresDir = 'src/features';
  if (!fs.existsSync(featuresDir)) {
    violations.push({
      type: 'MISSING',
      message: 'src/features directory does not exist',
      fix: 'Create with: mkdir -p src/features'
    });
    return;
  }
  
  const features = fs.readdirSync(featuresDir, { withFileTypes: true });
  
  features.forEach(feature => {
    if (feature.isDirectory()) {
      const featurePath = path.join(featuresDir, feature.name);
      const requiredDirs = ['components', 'hooks', 'types', 'api'];
      
      requiredDirs.forEach(dir => {
        const dirPath = path.join(featurePath, dir);
        if (!fs.existsSync(dirPath)) {
          violations.push({
            type: 'STRUCTURE',
            message: `Missing required directory: ${dirPath}`,
            fix: `Use: node tools/generators/create-feature.js ${feature.name}`
          });
        } else {
          // Check for index.ts in each directory
          const indexPath = path.join(dirPath, 'index.ts');
          if (!fs.existsSync(indexPath)) {
            violations.push({
              type: 'EXPORTS',
              message: `Missing index.ts: ${indexPath}`,
              fix: 'Create barrel export file'
            });
          }
        }
      });
      
      // Check for main feature index.ts
      if (!fs.existsSync(path.join(featurePath, 'index.ts'))) {
        violations.push({
          type: 'EXPORTS',
          message: `Missing main index.ts in feature: ${featurePath}`,
          fix: `Use: node tools/generators/create-feature.js ${feature.name}`
        });
      }
    }
  });
}

// Check 2: Verify shared structure
function checkSharedStructure() {
  console.log('🔗 Checking shared structure...');
  
  const sharedDir = 'src/shared';
  if (!fs.existsSync(sharedDir)) {
    violations.push({
      type: 'MISSING',
      message: 'src/shared directory does not exist',
      fix: 'Create shared directory structure'
    });
    return;
  }
  
  const requiredDirs = [
    'components/ui',
    'components/layout',
    'lib/api',
    'lib/auth',
    'lib/integrations',
    'lib/hooks',
    'types'
  ];
  
  requiredDirs.forEach(dir => {
    const fullPath = path.join(sharedDir, dir);
    if (!fs.existsSync(fullPath)) {
      violations.push({
        type: 'STRUCTURE',
        message: `Missing shared directory: ${fullPath}`,
        fix: `Create: mkdir -p ${fullPath}`
      });
    }
  });
}

// Check 3: No components outside proper structure
function checkComponentsPlacement() {
  console.log('📋 Checking component placement...');
  
  // Check for components in wrong locations
  const forbiddenPaths = [
    'app/components',
    'components',
    'lib/components'
  ];
  
  forbiddenPaths.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir, { recursive: true });
      files.forEach(file => {
        if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
          // Allow ui components in app/components/ui
          if (dir === 'app/components' && file.startsWith('ui/')) {
            return; // This is allowed during migration
          }
          
          violations.push({
            type: 'PLACEMENT',
            message: `Component in wrong location: ${path.join(dir, file)}`,
            fix: 'Move to src/features/[feature]/components/ or src/shared/components/'
          });
        }
      });
    }
  });
}

// Check 4: TypeScript file extensions
function checkFileExtensions() {
  console.log('📝 Checking file extensions...');
  
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
        if (entry.name.endsWith('.jsx')) {
          violations.push({
            type: 'EXTENSION',
            message: `JSX file found: ${fullPath}`,
            fix: 'Convert to .tsx with proper TypeScript'
          });
        }
        
        if (entry.name.endsWith('.js') && 
            !entry.name.includes('config') && 
            !fullPath.includes('tools/') &&
            !fullPath.includes('scripts/')) {
          violations.push({
            type: 'EXTENSION',
            message: `JavaScript file found: ${fullPath}`,
            fix: 'Convert to .ts with proper TypeScript'
          });
        }
      }
    });
  }
  
  scanDir('src');
}

// Check 5: Tools directory
function checkToolsStructure() {
  console.log('🛠️  Checking tools structure...');
  
  const toolsDir = 'tools';
  if (!fs.existsSync(toolsDir)) {
    violations.push({
      type: 'MISSING',
      message: 'tools directory does not exist',
      fix: 'Create tools directory with generators and validators'
    });
    return;
  }
  
  const requiredDirs = ['generators', 'validators', 'templates'];
  
  requiredDirs.forEach(dir => {
    const fullPath = path.join(toolsDir, dir);
    if (!fs.existsSync(fullPath)) {
      violations.push({
        type: 'TOOLS',
        message: `Missing tools directory: ${fullPath}`,
        fix: `Create: mkdir -p ${fullPath}`
      });
    }
  });
}

// Run all checks
checkFeaturesStructure();
checkSharedStructure();
checkComponentsPlacement();
checkFileExtensions();
checkToolsStructure();

// Report results
console.log('\n' + '='.repeat(60));

if (violations.length === 0) {
  console.log('✅ Project structure is valid!');
  console.log('All directories and files are properly organized.\n');
  process.exit(0);
} else {
  console.error(`❌ Found ${violations.length} structure violations:\n`);
  
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
  console.error('This structure ensures maintainable, scalable code.\n');
  
  process.exit(1);
}