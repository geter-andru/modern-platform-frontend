#!/bin/bash

echo "🧪 Testing HTML Entity Fix on Sample Files..."

# Get a small sample of files with HTML entity issues
echo "📁 Finding sample files with HTML entity issues..."
SAMPLE_FILES=$(find src -name "*.tsx" | head -3 | xargs grep -l "&apos;\|&quot;" 2>/dev/null || echo "")

if [ -z "$SAMPLE_FILES" ]; then
    echo "❌ No sample files found with HTML entity issues"
    exit 1
fi

echo "Sample files to test:"
echo "$SAMPLE_FILES"
echo ""

# Count issues before fix
echo "📊 Counting HTML entity issues before fix..."
BEFORE=$(echo "$SAMPLE_FILES" | xargs grep -c "&apos;\|&quot;" 2>/dev/null | awk '{sum += $1} END {print sum}' || echo "0")
echo "Found $BEFORE HTML entity issues in sample files"

# Show a sample of the corrupted content
echo ""
echo "🔍 Sample of corrupted content (first 3 lines):"
echo "$SAMPLE_FILES" | head -1 | xargs head -3

# Fix HTML entities in sample files only
echo ""
echo "🔧 Fixing HTML entities in sample files..."
echo "$SAMPLE_FILES" | xargs sed -i '' 's/&apos;/'"'"'/g'
echo "$SAMPLE_FILES" | xargs sed -i '' 's/&quot;/"/g'

# Count issues after fix
echo "📊 Counting HTML entity issues after fix..."
AFTER=$(echo "$SAMPLE_FILES" | xargs grep -c "&apos;\|&quot;" 2>/dev/null | awk '{sum += $1} END {print sum}' || echo "0")
echo "Remaining $AFTER HTML entity issues in sample files"

# Show the fixed content
echo ""
echo "🔍 Sample of fixed content (first 3 lines):"
echo "$SAMPLE_FILES" | head -1 | xargs head -3

# Calculate fixed count
FIXED=$((BEFORE - AFTER))
echo ""
echo "✅ Fixed $FIXED HTML entity issues in sample files"

if [ "$AFTER" -eq 0 ]; then
    echo "🎉 All HTML entity issues resolved in sample files!"
    echo ""
    echo "🔍 Testing TypeScript compilation on sample files..."
    echo "$SAMPLE_FILES" | xargs npx tsc --noEmit --strict
    if [ $? -eq 0 ]; then
        echo "🎉 TypeScript compilation successful on sample files!"
        echo ""
        echo "✅ Test successful! Ready to run on all files."
    else
        echo "⚠️  TypeScript compilation still has issues on sample files."
    fi
else
    echo "⚠️  Some HTML entity issues remain in sample files."
fi
