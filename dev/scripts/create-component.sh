#!/bin/bash
if [ $# -eq 0 ]; then
    echo "❌ Usage: npm run create:component FeatureName ComponentName"
    exit 1
fi

FEATURE=$1
COMPONENT=$2
FEATURE_DIR="src/features/${FEATURE}"
COMPONENT_DIR="${FEATURE_DIR}/components"
COMPONENT_LOWER=$(echo "${COMPONENT}" | tr '[:upper:]' '[:lower:]')

# Force proper structure
mkdir -p "${COMPONENT_DIR}"
mkdir -p "${FEATURE_DIR}/types"
mkdir -p "${FEATURE_DIR}/hooks"

# Generate TypeScript component template
cat > "${COMPONENT_DIR}/${COMPONENT}.tsx" << EOF
import React from 'react';
import type { ${COMPONENT}Props } from '../types/${COMPONENT_LOWER}.types';

export const ${COMPONENT}: React.FC<${COMPONENT}Props> = ({ 
  // TODO: Add props here - TypeScript will enforce this
}) => {
  // TODO: Implement component logic
  // NOTE: No mock data allowed - this will fail build
  
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-semibold">${COMPONENT}</h2>
      {/* TODO: Add component JSX */}
    </div>
  );
};

export default ${COMPONENT};
EOF

# Generate TypeScript types file
cat > "${FEATURE_DIR}/types/${COMPONENT_LOWER}.types.ts" << EOF
export interface ${COMPONENT}Props {
  // TODO: Define component props
  // Example:
  // title: string;
  // onAction: () => void;
}

export interface ${COMPONENT}Data {
  // TODO: Define data types
  // Example:
  // id: string;
  // value: number;
}
EOF

echo "✅ Created ${COMPONENT} in ${FEATURE_DIR}"
echo "⚠️  Remember to:"
echo "   1. Define props in ${COMPONENT}Props"
echo "   2. Implement real data fetching (no mock data)"
echo "   3. Add proper TypeScript types"