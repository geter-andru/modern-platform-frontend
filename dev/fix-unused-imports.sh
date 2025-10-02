#!/bin/bash

echo "🚀 Fixing Unused Imports..."

# Common unused imports to remove
UNUSED_IMPORTS=(
  "useEffect"
  "motion"
  "AnimatePresence"
  "Bell"
  "ChevronDown"
  "ChevronUp"
  "RefreshCw"
  "DollarSign"
  "AlertTriangle"
  "CheckCircle"
  "Clock"
  "Users"
  "Target"
  "Eye"
  "EyeOff"
  "TrendingUp"
  "Search"
  "Home"
  "BarChart3"
  "Settings"
  "X"
  "Lock"
  "FileText"
  "Database"
  "Image"
)

# Process each unused import
for import in "${UNUSED_IMPORTS[@]}"; do
  echo "Removing unused import: $import"
  
  # Remove from destructured imports
  find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' "s/\\b$import\\s*,//g"
  find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' "s/,$import\\b//g"
  find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' "s/\\b$import\\s*//g"
done

# Clean up empty imports and trailing commas
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/,\s*}/}/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/{\s*,/{/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' '/import\s*{\s*}\s*from/d'

echo "✅ Fixed unused imports"

# Check remaining issues
echo "🔍 Checking remaining issues..."
REMAINING=$(npx eslint src --ext .ts,.tsx | grep -E "(no-unused-vars|react/)" | wc -l | tr -d ' ')
echo "📊 Remaining issues: $REMAINING"
