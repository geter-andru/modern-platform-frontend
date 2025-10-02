#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

if (process.argv.length < 4) {
  console.error('❌ Usage: node tools/generators/create-component.js FeatureName ComponentName');
  process.exit(1);
}

const featureName = process.argv[2];
const componentName = process.argv[3];
const featureDir = `src/features/${featureName}`;
const componentFile = path.join(featureDir, 'components', `${componentName}.tsx`);
const typeFile = path.join(featureDir, 'types', `${componentName.toLowerCase()}.types.ts`);

if (!fs.existsSync(featureDir)) {
  console.error(`❌ Feature '${featureName}' does not exist. Create it first with:`);
  console.error(`   node tools/generators/create-feature.js ${featureName}`);
  process.exit(1);
}

console.log(`🧩 Creating component: ${componentName} in ${featureName}`);

// Create TypeScript types file
fs.writeFileSync(typeFile, `// ${componentName} Component Types
export interface ${componentName}Props {
  // TODO: Define component props
  // Example:
  // title: string;
  // onAction: () => void;
}

export interface ${componentName}Data {
  // TODO: Define data types used by this component
  // Example:
  // id: string;
  // value: number;
}

// TODO: Add other types as needed
`);

// Create React component file
fs.writeFileSync(componentFile, `import React from 'react';
import type { ${componentName}Props } from '../types/${componentName.toLowerCase()}.types';

export const ${componentName}: React.FC<${componentName}Props> = ({
  // TODO: Add props here - TypeScript will enforce this
}) => {
  // TODO: Implement component logic
  // NOTE: No mock data allowed - this will fail build
  
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-semibold">${componentName}</h2>
      {/* TODO: Add component JSX */}
    </div>
  );
};

export default ${componentName};
`);

console.log('✅ Component created successfully!');
console.log(`📄 Component: ${componentFile}`);
console.log(`📄 Types: ${typeFile}`);
console.log('📝 Next steps:');
console.log(`   1. Define props in ${componentName}Props interface`);
console.log('   2. Implement component logic with real data');
console.log('   3. Export component in components/index.ts');
console.log('   4. Export types in types/index.ts');