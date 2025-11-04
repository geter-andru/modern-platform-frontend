# Phase 3.1 Migration Guide

## Quick Start: Apply Database Migration

### Prerequisites
- Access to Supabase Dashboard
- Project already using Supabase
- `customer_assets` table exists (referenced by foreign keys)

---

## Step-by-Step Migration

### 1. Access Supabase SQL Editor

1. Navigate to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in left sidebar
4. Click **New Query**

### 2. Run Migration SQL

**File Location:**
```
/infra/supabase/migrations/20251103000001_create_behavior_tracking_schema.sql
```

**Actions:**
1. Open the file in your code editor
2. Copy entire contents (all 384 lines)
3. Paste into Supabase SQL Editor
4. Click **Run** button

**Expected Execution Time:** < 5 seconds

### 3. Verify Migration Success

Run this verification query in SQL Editor:

```sql
-- Check all 3 tables created
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('behavior_events', 'behavior_insights', 'behavior_sessions')
ORDER BY table_name;
```

**Expected Output:**
```
table_name              | column_count
------------------------+-------------
behavior_events         | 24
behavior_insights       | 22
behavior_sessions       | 13
```

### 4. Verify RLS Policies

```sql
-- Check Row Level Security enabled
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('behavior_events', 'behavior_insights', 'behavior_sessions');
```

**Expected Output:**
```
tablename              | rowsecurity
-----------------------+-------------
behavior_events        | t
behavior_insights      | t
behavior_sessions      | t
```

### 5. Verify Triggers

```sql
-- Check triggers created
SELECT
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('behavior_events', 'behavior_insights', 'behavior_sessions');
```

**Expected Output:**
```
trigger_name                        | event_manipulation | event_object_table
------------------------------------+-------------------+-------------------
update_behavior_events_updated_at   | UPDATE            | behavior_events
trigger_update_insights_on_event    | INSERT            | behavior_events
update_behavior_insights_updated_at | UPDATE            | behavior_insights
update_behavior_sessions_updated_at | UPDATE            | behavior_sessions
```

### 6. Verify Sample Data

```sql
-- Check admin user insights initialized
SELECT
  customer_id,
  current_scaling_score,
  total_tool_sessions,
  created_at
FROM behavior_insights
WHERE customer_id = 'dru78DR9789SDF862';
```

**Expected Output:**
```
customer_id         | current_scaling_score | total_tool_sessions | created_at
--------------------+----------------------+--------------------+---------------------------
dru78DR9789SDF862   | 82                   | 0                  | 2025-11-03 [timestamp]
```

---

## Troubleshooting

### Error: "relation customer_assets does not exist"

**Cause:** Foreign key constraint requires `customer_assets` table

**Solution:**
1. Check if table exists: `SELECT * FROM customer_assets LIMIT 1;`
2. If missing, you need to run earlier migrations first
3. Verify migration order in `/infra/supabase/migrations/`

### Error: "function update_updated_at_column() does not exist"

**Cause:** Missing utility function for timestamp updates

**Solution:**
Add this function before running migration:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Error: "permission denied for table customer_assets"

**Cause:** Insufficient database permissions

**Solution:**
1. Ensure you're connected as database owner
2. Check Supabase project settings → Database → Connection pooling
3. Use "Direct connection" for migrations

---

## Post-Migration Testing

### Test 1: Insert Sample Event

```sql
-- Insert a test event
INSERT INTO behavior_events (
  customer_id,
  session_id,
  event_type,
  tool_id,
  business_impact
) VALUES (
  'dru78DR9789SDF862',
  'test_session_123',
  'tool_usage',
  'icp-analysis',
  'medium'
);

-- Verify event inserted
SELECT
  id,
  customer_id,
  event_type,
  tool_id,
  created_at
FROM behavior_events
WHERE session_id = 'test_session_123';
```

### Test 2: Verify Auto-Update Trigger

```sql
-- Check insights auto-updated
SELECT
  customer_id,
  total_tool_sessions,
  last_tool_used,
  days_since_last_activity
FROM behavior_insights
WHERE customer_id = 'dru78DR9789SDF862';
```

**Expected:**
- `total_tool_sessions` should increment by 1
- `last_tool_used` should be 'icp-analysis'
- `days_since_last_activity` should be 0

### Test 3: Create Test Session

```sql
-- Insert session
INSERT INTO behavior_sessions (
  session_id,
  customer_id,
  tools_accessed,
  events_count
) VALUES (
  'test_session_456',
  'dru78DR9789SDF862',
  ARRAY['icp-analysis'],
  1
);

-- Verify session created
SELECT * FROM behavior_sessions
WHERE session_id = 'test_session_456';
```

### Test 4: Clean Up Test Data

```sql
-- Remove test data
DELETE FROM behavior_events WHERE session_id LIKE 'test_session%';
DELETE FROM behavior_sessions WHERE session_id LIKE 'test_session%';
```

---

## Integration Checklist

After successful migration:

- [ ] Migration SQL executed successfully
- [ ] 3 tables created (behavior_events, behavior_insights, behavior_sessions)
- [ ] 13 indexes created
- [ ] 4 triggers created
- [ ] 3 RLS policies enabled
- [ ] Sample data for admin user exists
- [ ] Test event insertion works
- [ ] Auto-update trigger works
- [ ] Frontend compiles without errors (`npm run dev`)
- [ ] Browser console shows no errors when using ICP tool

---

## Next Steps After Migration

1. **Test Tracking in Development:**
   ```bash
   npm run dev
   ```
   - Navigate to ICP Analysis tool
   - Open browser DevTools → Console
   - Switch tabs (should see tracking calls)
   - Generate resources (should track start/complete)

2. **Verify Data in Supabase:**
   - Check `behavior_events` table for new entries
   - Check `behavior_insights` auto-updated
   - Check `behavior_sessions` created

3. **Monitor Performance:**
   - Observe event batching (30-second intervals)
   - High-impact events flush immediately
   - No UI lag from tracking calls

4. **Production Deployment:**
   - Apply same migration to production Supabase
   - Monitor for errors in production logs
   - Verify RLS policies working correctly

---

## Rollback (If Needed)

```sql
-- Drop all tables, triggers, and functions (destructive!)
DROP TRIGGER IF EXISTS trigger_update_insights_on_event ON behavior_events;
DROP TRIGGER IF EXISTS update_behavior_events_updated_at ON behavior_events;
DROP TRIGGER IF EXISTS update_behavior_insights_updated_at ON behavior_insights;
DROP TRIGGER IF EXISTS update_behavior_sessions_updated_at ON behavior_sessions;

DROP FUNCTION IF EXISTS update_behavior_insights_on_event();
DROP FUNCTION IF EXISTS cleanup_expired_behavior_events();

DROP TABLE IF EXISTS behavior_sessions CASCADE;
DROP TABLE IF EXISTS behavior_insights CASCADE;
DROP TABLE IF EXISTS behavior_events CASCADE;
```

**⚠️ WARNING:** This will delete all tracking data. Only use if absolutely necessary.

---

## Support

If you encounter issues:

1. Check error message in Supabase SQL Editor
2. Review migration SQL file for syntax errors
3. Verify prerequisite tables exist (customer_assets)
4. Check Supabase logs for detailed error info
5. Ensure database user has CREATE permissions

---

**Migration File:** `/infra/supabase/migrations/20251103000001_create_behavior_tracking_schema.sql`
**Documentation:** `PHASE_3.1_BEHAVIOR_TRACKING_IMPLEMENTATION_COMPLETE.md`
**Total Execution Time:** ~5 seconds
**Database Changes:** 3 tables, 13 indexes, 4 triggers, 3 RLS policies
