# Supabase RLS Policy Fixes Required

**Date:** October 17, 2025
**Issue:** Row-Level Security policies blocking authenticated users from managing their profiles
**Related Error:** `new row violates row-level security policy for table "customer_profiles"`

---

## Problem Summary

After successful Google OAuth signin, users encounter RLS policy violations when:
1. Creating their profile for the first time (INSERT)
2. Reading their profile data (SELECT)
3. Updating their profile (UPDATE)

**Console Errors:**
```
new row violates row-level security policy for table "customer_profiles"
GET /rest/v1/customer_profiles?select=*&id=eq.<uuid> → 406 (Not Acceptable)
POST /rest/v1/customer_profiles → 401 (Unauthorized)
```

---

## Root Cause

The `customer_profiles` table has RLS enabled but lacks policies allowing authenticated users to:
- Create their own profile on first signin
- Read their own profile data
- Update their own profile information

---

## Required SQL Fixes

Run these SQL statements in the Supabase SQL Editor to fix the RLS policies:

### 1. Allow Authenticated Users to Insert Their Own Profile

```sql
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON customer_profiles;

-- Create policy allowing users to insert their own profile
CREATE POLICY "Users can insert own profile"
ON customer_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  -- User can only insert a profile where customer_id matches their auth.uid()
  customer_id = auth.uid()
);
```

**What this does:** Allows users who just signed in to create their profile record. The `WITH CHECK` ensures they can only create a profile with their own `customer_id`.

---

### 2. Allow Authenticated Users to Read Their Own Profile

```sql
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can read own profile" ON customer_profiles;

-- Create policy allowing users to read their own profile
CREATE POLICY "Users can read own profile"
ON customer_profiles
FOR SELECT
TO authenticated
USING (
  -- User can only read profiles where customer_id matches their auth.uid()
  customer_id = auth.uid()
);
```

**What this does:** Allows users to query and read their profile data. The `USING` clause restricts visibility to only their own profile.

---

### 3. Allow Authenticated Users to Update Their Own Profile

```sql
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can update own profile" ON customer_profiles;

-- Create policy allowing users to update their own profile
CREATE POLICY "Users can update own profile"
ON customer_profiles
FOR UPDATE
TO authenticated
USING (
  -- User can only update profiles where customer_id matches their auth.uid()
  customer_id = auth.uid()
)
WITH CHECK (
  -- Ensure they're not changing the customer_id to someone else's
  customer_id = auth.uid()
);
```

**What this does:** Allows users to modify their profile fields while preventing them from changing their `customer_id` or accessing other users' profiles.

---

### 4. (Optional) Allow Users to Delete Their Own Profile

```sql
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can delete own profile" ON customer_profiles;

-- Create policy allowing users to delete their own profile
CREATE POLICY "Users can delete own profile"
ON customer_profiles
FOR DELETE
TO authenticated
USING (
  customer_id = auth.uid()
);
```

**What this does:** Allows users to delete their own profile if needed (optional based on business requirements).

---

## Verification Steps

After applying these policies, verify they work:

### 1. Test Profile Creation (INSERT)
```sql
-- Run as authenticated user in SQL Editor
INSERT INTO customer_profiles (
  customer_id,
  email,
  company_name
) VALUES (
  auth.uid(),
  auth.jwt() ->> 'email',
  'Test Company'
);
```
**Expected:** Row inserted successfully

---

### 2. Test Profile Read (SELECT)
```sql
-- Run as authenticated user
SELECT *
FROM customer_profiles
WHERE customer_id = auth.uid();
```
**Expected:** Returns your profile data

---

### 3. Test Profile Update (UPDATE)
```sql
-- Run as authenticated user
UPDATE customer_profiles
SET company_name = 'Updated Company Name'
WHERE customer_id = auth.uid();
```
**Expected:** Row updated successfully

---

### 4. Test Cross-User Access Prevention
```sql
-- Try to read another user's profile (should fail)
SELECT *
FROM customer_profiles
WHERE customer_id != auth.uid();
```
**Expected:** Returns no rows (policy blocks access)

---

## Alternative: Combined Policy (All Operations)

If you prefer a single policy covering all operations:

```sql
-- Drop all existing policies
DROP POLICY IF EXISTS "Users manage own profile" ON customer_profiles;

-- Create comprehensive policy
CREATE POLICY "Users manage own profile"
ON customer_profiles
FOR ALL
TO authenticated
USING (customer_id = auth.uid())
WITH CHECK (customer_id = auth.uid());
```

**Note:** This is simpler but less granular. Use separate policies if you need different rules for different operations.

---

## Post-Fix Expected Behavior

After applying these policies:

1. ✅ User signs in with Google OAuth
2. ✅ Frontend queries `customer_profiles` for their profile
3. ✅ If no profile exists, frontend creates one (INSERT succeeds)
4. ✅ Profile data is returned to frontend (SELECT succeeds)
5. ✅ User can update their profile fields (UPDATE succeeds)
6. ✅ AuthBridge finds active session (no "No session found" errors)
7. ✅ API calls succeed with proper authentication

---

## Related Files

- **Frontend Auth Service:** `/app/lib/auth/auth-service.ts`
- **Profile Management:** Code that queries `customer_profiles` table
- **AuthBridge Service:** `/app/lib/services/auth-bridge.ts`

---

## Security Notes

### Why These Policies Are Safe

1. **`auth.uid()` is secure:** Supabase's `auth.uid()` function returns the authenticated user's ID from their JWT token, which is cryptographically signed and cannot be spoofed.

2. **Row-level isolation:** Each user can only access their own data. Even if they try to modify the SQL query client-side, the RLS policies enforce server-side restrictions.

3. **No privilege escalation:** Users cannot access or modify other users' profiles, even if they know their UUIDs.

### What These Policies Protect Against

- ✅ Users reading other users' profiles
- ✅ Users modifying other users' data
- ✅ Users creating profiles with someone else's `customer_id`
- ✅ Unauthorized profile access via API manipulation

---

## Deployment Checklist

- [ ] Run INSERT policy SQL in Supabase SQL Editor
- [ ] Run SELECT policy SQL in Supabase SQL Editor
- [ ] Run UPDATE policy SQL in Supabase SQL Editor
- [ ] (Optional) Run DELETE policy SQL if needed
- [ ] Test signin flow on staging environment
- [ ] Verify profile creation works for new users
- [ ] Verify profile updates work for existing users
- [ ] Test on production environment
- [ ] Monitor Supabase logs for RLS policy errors

---

## Troubleshooting

### If policies still don't work:

1. **Check RLS is enabled:**
   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public'
   AND tablename = 'customer_profiles';
   ```
   `rowsecurity` should be `true`

2. **List all policies:**
   ```sql
   SELECT * FROM pg_policies
   WHERE tablename = 'customer_profiles';
   ```

3. **Check user authentication:**
   ```sql
   SELECT auth.uid();  -- Should return your user UUID
   SELECT auth.role(); -- Should return 'authenticated'
   ```

4. **Enable policy logging:**
   - In Supabase Dashboard → Settings → API
   - Enable detailed error logging
   - Check logs after failed operations

---

## Questions?

If issues persist after applying these policies, check:
- Is the user's `auth.uid()` matching the `customer_id` in the database?
- Are there any conflicting policies on the table?
- Is RLS enabled on the table?
- Are you using the correct Supabase client (singleton)?

---

**Status:** Ready to implement
**Priority:** High - Blocks user profile creation and session management
**Impact:** Fixes 401/406 errors and enables full authentication flow
