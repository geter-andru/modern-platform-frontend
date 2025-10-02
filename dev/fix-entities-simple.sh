#!/bin/bash

echo "🚀 Fixing Unescaped Entities..."

# Find and fix unescaped entities in TSX files
find src -name "*.tsx" -exec sed -i '' "s/'/\&apos;/g" {} \;
find src -name "*.tsx" -exec sed -i '' 's/"/\&quot;/g' {} \;

echo "✅ Fixed unescaped entities in all TSX files"

# Check remaining issues
echo "🔍 Checking remaining issues..."
REMAINING=$(npx eslint src --ext .ts,.tsx | grep -E "(no-unused-vars|react/)" | wc -l | tr -d ' ')
echo "📊 Remaining issues: $REMAINING"
