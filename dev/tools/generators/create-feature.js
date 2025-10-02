#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  console.error('❌ Usage: node tools/generators/create-feature.js FeatureName');
  process.exit(1);
}

const featureName = process.argv[2];
const featureDir = `src/features/${featureName}`;

console.log(`🏗️  Creating feature: ${featureName}`);

// Create directory structure
const dirs = ['components', 'hooks', 'types', 'api'];
dirs.forEach(dir => {
  const fullPath = path.join(featureDir, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  
  // Create index.ts for each subdirectory
  fs.writeFileSync(path.join(fullPath, 'index.ts'), `// ${featureName} ${dir} exports\n// This file is auto-maintained - do not edit manually\n\n// TODO: Add exports as components/hooks/types/services are created\n`);
});

// Create feature config
fs.writeFileSync(path.join(featureDir, 'feature.config.ts'), `// ${featureName} Feature Configuration
export const ${featureName.toLowerCase()}Config = {
  name: '${featureName}',
  version: '1.0.0',
  description: 'TODO: Add feature description',
  dependencies: [],
  // TODO: Add feature-specific configuration
};

export default ${featureName.toLowerCase()}Config;
`);

// Create main index.ts
fs.writeFileSync(path.join(featureDir, 'index.ts'), `// ${featureName} Feature Exports
// This file is auto-maintained - do not edit manually

// Components
export * from './components';

// Hooks
export * from './hooks';

// Types
export * from './types';

// API Services
export * from './api';

// Configuration
export { default as ${featureName.toLowerCase()}Config } from './feature.config';
`);

console.log('✅ Feature created successfully!');
console.log(`📁 Directory: ${featureDir}`);
console.log('📝 Next steps:');
console.log(`   1. Use: node tools/generators/create-component.js ${featureName} ComponentName`);
console.log('   2. Add feature types to types/index.ts');
console.log('   3. Create API services in api/index.ts');
console.log('   4. Add hooks in hooks/index.ts');