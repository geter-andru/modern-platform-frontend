#!/bin/bash

# Supabase Type Generation Script
# Generates TypeScript types from live Supabase database
#
# Usage:
#   SUPABASE_ACCESS_TOKEN=your-token npm run types:supabase
#   OR
#   export SUPABASE_ACCESS_TOKEN=your-token
#   ./scripts/generate-supabase-types.sh

set -e  # Exit on error

PROJECT_ID="ipoynqojwxgmhbpxfkfp"
OUTPUT_FILE="app/lib/types/supabase.ts"
BACKUP_FILE="app/lib/types/supabase-minimal-backup.ts"

echo "🔍 Checking for Supabase access token..."

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo ""
  echo "⚠️  SUPABASE_ACCESS_TOKEN environment variable not set"
  echo ""
  echo "Using existing minimal types from $OUTPUT_FILE"
  echo ""
  echo "To generate types from live database:"
  echo "  1. Get access token from: https://supabase.com/dashboard/account/tokens"
  echo "  2. Run: SUPABASE_ACCESS_TOKEN=your-token npm run types:supabase"
  echo ""
  exit 0
fi

echo "✅ Access token found"
echo ""
echo "🔄 Generating types from Supabase project: $PROJECT_ID"
echo ""

# Backup current types
if [ -f "$OUTPUT_FILE" ]; then
  echo "📦 Backing up current types to: $BACKUP_FILE"
  cp "$OUTPUT_FILE" "$BACKUP_FILE"
fi

# Generate types
echo "🎯 Running type generation..."
npx supabase gen types typescript \
  --project-id "$PROJECT_ID" \
  --schema public \
  > "${OUTPUT_FILE}.tmp"

if [ $? -eq 0 ]; then
  # Success - replace the file
  mv "${OUTPUT_FILE}.tmp" "$OUTPUT_FILE"

  # Count lines
  LINE_COUNT=$(wc -l < "$OUTPUT_FILE" | tr -d ' ')

  echo ""
  echo "✅ Success! Generated $LINE_COUNT lines of TypeScript types"
  echo "📄 Output: $OUTPUT_FILE"
  echo ""
  echo "Next steps:"
  echo "  1. npm run build  # Test that build still works"
  echo "  2. git diff $OUTPUT_FILE  # Review changes"
  echo "  3. git add $OUTPUT_FILE && git commit -m 'chore: Update Supabase types'"
  echo ""
else
  # Failed - clean up and restore backup
  echo ""
  echo "❌ Type generation failed"
  rm -f "${OUTPUT_FILE}.tmp"

  if [ -f "$BACKUP_FILE" ]; then
    echo "📦 Restoring backup from: $BACKUP_FILE"
    cp "$BACKUP_FILE" "$OUTPUT_FILE"
  fi

  echo ""
  echo "Troubleshooting:"
  echo "  - Verify access token is valid"
  echo "  - Check project ID: $PROJECT_ID"
  echo "  - Ensure you have permissions to access the project"
  echo "  - Run with --debug flag: npx supabase gen types typescript --debug"
  echo ""
  exit 1
fi
