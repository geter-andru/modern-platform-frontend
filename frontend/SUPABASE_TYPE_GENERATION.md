# Supabase Type Generation Setup

## Current State

✅ **MVP Solution Active**: Using minimal hand-written types (`app/lib/types/supabase.ts`)
- File size: 217 lines (reduced from 317)
- Provides basic type safety for core tables
- Allows flexible typing for all other tables
- Build succeeds without errors

## Production Solution: Auto-Generate Types

When scaling beyond 15 users, replace minimal types with auto-generated types from your live Supabase database.

---

## Setup Instructions

### Prerequisites

1. **Supabase Project Access Token**
   - Go to: https://supabase.com/dashboard/account/tokens
   - Click "Generate new token"
   - Give it a name: "Type Generation"
   - Copy the token (keep it secret!)

2. **Install Supabase CLI** (already available via npx)
   ```bash
   npx supabase --version
   ```

---

### Option 1: One-Time Generation (Manual)

Generate types once and commit to git:

```bash
# Set your access token (don't commit this!)
export SUPABASE_ACCESS_TOKEN="your-access-token-here"

# Generate types from your live database
npx supabase gen types typescript \
  --project-id ipoynqojwxgmhbpxfkfp \
  --schema public \
  > app/lib/types/supabase-generated.ts

# Replace the minimal types
mv app/lib/types/supabase.ts app/lib/types/supabase-minimal-backup.ts
mv app/lib/types/supabase-generated.ts app/lib/types/supabase.ts

# Test build
npm run build

# If successful, commit
git add app/lib/types/supabase.ts
git commit -m "feat: Replace minimal types with auto-generated Supabase types"
```

**When to use**: After major schema changes, or before production launch.

---

### Option 2: Automated Generation (CI/CD)

Add type generation to your build process:

#### 1. Create generation script

```bash
# File: scripts/generate-supabase-types.sh
#!/bin/bash

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "⚠️  SUPABASE_ACCESS_TOKEN not set. Skipping type generation."
  echo "Using existing types from app/lib/types/supabase.ts"
  exit 0
fi

echo "🔄 Generating Supabase types from live database..."

npx supabase gen types typescript \
  --project-id ipoynqojwxgmhbpxfkfp \
  --schema public \
  > app/lib/types/supabase-generated.ts

if [ $? -eq 0 ]; then
  mv app/lib/types/supabase-generated.ts app/lib/types/supabase.ts
  echo "✅ Supabase types generated successfully"
else
  echo "❌ Failed to generate types. Using existing types."
  rm -f app/lib/types/supabase-generated.ts
  exit 1
fi
```

#### 2. Make it executable

```bash
chmod +x scripts/generate-supabase-types.sh
```

#### 3. Add to package.json

```json
{
  "scripts": {
    "types:supabase": "./scripts/generate-supabase-types.sh",
    "types:check": "tsc --noEmit",
    "prebuild": "npm run types:supabase"
  }
}
```

#### 4. Configure CI/CD (Netlify/GitHub Actions)

**Netlify** - Add environment variable:
- Dashboard → Site Settings → Environment Variables
- Add: `SUPABASE_ACCESS_TOKEN` = `your-token-here`
- Build command will auto-run `prebuild` script

**GitHub Actions**:
```yaml
# .github/workflows/deploy.yml
- name: Generate Supabase Types
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
  run: npm run types:supabase
```

**When to use**: For teams making frequent schema changes.

---

### Option 3: Local Development with Supabase CLI

Use local Supabase instance for development:

#### 1. Initialize Supabase locally

```bash
cd /Users/geter/andru/hs-andru-test/modern-platform/infra

# Link to your cloud project
npx supabase link --project-ref ipoynqojwxgmhbpxfkfp

# Pull latest migrations from cloud
npx supabase db pull

# Start local Supabase (Docker required)
npx supabase start
```

#### 2. Generate types from local instance

```bash
npx supabase gen types typescript --local > ../frontend/app/lib/types/supabase.ts
```

#### 3. Watch for schema changes

```bash
# Terminal 1: Watch for migration changes
npx supabase db diff --file new_migration

# Terminal 2: Auto-regenerate types on change
npx watch "npx supabase gen types typescript --local > ../frontend/app/lib/types/supabase.ts" infra/supabase/migrations
```

**When to use**: Active development with frequent schema changes.

---

## Comparison: Minimal vs Auto-Generated

| Feature | Minimal Types (Current) | Auto-Generated |
|---------|------------------------|----------------|
| **File Size** | 217 lines | 2000-5000 lines |
| **Type Safety** | Basic (flexible) | Comprehensive (strict) |
| **Maintenance** | Manual updates | Automatic |
| **Build Speed** | Fast | Fast |
| **Runtime Safety** | Same | Same |
| **Setup Complexity** | None | Moderate |
| **Best For** | MVP, rapid iteration | Production, teams |

---

## Recommended Approach for Your Platform

### Phase 1: MVP (0-15 users) ✅ CURRENT
- Use minimal types (already done)
- TypeScript checking disabled
- Focus on functionality

### Phase 2: Growth (15-75 users)
- Generate types once manually (Option 1)
- Enable TypeScript checking
- Fix type errors before production

### Phase 3: Scale (75+ users)
- Set up automated generation (Option 2)
- Add to CI/CD pipeline
- Type safety enforced

---

## Files Reference

- **Minimal types**: `app/lib/types/supabase.ts` (current - 217 lines)
- **Full manual types backup**: `app/lib/types/supabase-full.ts.backup` (317 lines)
- **Auto-generated location**: `app/lib/types/supabase.ts` (after running Option 1 or 2)

---

## Troubleshooting

### "Your account does not have the necessary privileges"

**Solution**: You need a Supabase access token (see Prerequisites above)

### "supabase: command not found"

**Solution**: Use `npx supabase` instead of `supabase`

### Generated types show empty tables

**Solution**:
1. Check your database actually has tables (run SQL: `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`)
2. Verify RLS policies allow access
3. Try with service_role key instead of anon key

### Types don't match database after migration

**Solution**: Re-run type generation after every migration:
```bash
npm run types:supabase
```

---

## Next Steps

**Immediate (before 15 users)**:
- ✅ Keep using minimal types
- ✅ Focus on functionality

**Before Production (50+ users)**:
1. Get Supabase access token from dashboard
2. Run Option 1 (manual generation)
3. Enable TypeScript checking in `next.config.ts`
4. Fix any type errors
5. Deploy

**Long-term (scaling)**:
1. Set up Option 2 (automated CI/CD)
2. Add type generation to deployment pipeline
3. Enforce type checking in pre-commit hooks
