#!/bin/bash

echo "🚀 Fixing HTML Entity Encoding Corruption..."

# Count issues before fix
echo "📊 Counting HTML entity issues before fix..."
BEFORE=$(find src app -name "*.ts" -o -name "*.tsx" | xargs grep -c "&apos;\|&quot;" 2>/dev/null | awk '{sum += $1} END {print sum}' || echo "0")
echo "Found $BEFORE HTML entity issues"

# Fix HTML entities in TypeScript/TSX files
echo "🔧 Fixing HTML entities..."
find src app -name "*.ts" -o -name "*.tsx" -exec sed -i '' 's/&apos;/'"'"'/g' {} \;
find src app -name "*.ts" -o -name "*.tsx" -exec sed -i '' 's/&quot;/"/g' {} \;

# Count issues after fix
echo "📊 Counting HTML entity issues after fix..."
AFTER=$(find src app -name "*.ts" -o -name "*.tsx" | xargs grep -c "&apos;\|&quot;" 2>/dev/null | awk '{sum += $1} END {print sum}' || echo "0")
echo "Remaining $AFTER HTML entity issues"

# Calculate fixed count
FIXED=$((BEFORE - AFTER))
echo "✅ Fixed $FIXED HTML entity issues"

if [ "$AFTER" -eq 0 ]; then
    echo "🎉 All HTML entity issues resolved!"
    echo "🔍 Running TypeScript compilation check..."
    npx tsc --noEmit --strict
    if [ $? -eq 0 ]; then
        echo "🎉 TypeScript compilation successful!"
    else
        echo "⚠️  TypeScript compilation still has issues."
    fi
else
    echo "⚠️  Some HTML entity issues remain."
fi
