# User Management System - Testing Guide

## Admin User Setup

**Admin Email**: geter@humusnshore.org

## Manual Setup Steps (Required First)

### 1. Create Admin User in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User** → **Create new user**
4. Enter:
   - Email: `geter@humusnshore.org`
   - Password: (Choose a secure password)
   - Click **Create User**
   - Note the User UID that's generated

### 2. Verify Profile Creation

After creating the user, check if the profile was auto-created:

1. Go to **Table Editor** → **user_profiles**
2. Look for a row with the User UID
3. If not present, the trigger might need adjustment

### 3. Grant Super Admin Role

Run this SQL in the SQL Editor:

```sql
-- Get the user ID for geter@humusnshore.org
WITH user_info AS (
  SELECT id FROM auth.users WHERE email = 'geter@humusnshore.org' LIMIT 1
)
-- Insert super admin role
INSERT INTO user_roles (user_id, role_name, granted_by, is_active, metadata)
SELECT 
  id,
  'super_admin',
  id, -- self-granted for initial admin
  true,
  '{"note": "Initial admin user"}'::jsonb
FROM user_info;

-- Verify the role was created
SELECT * FROM user_roles WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'geter@humusnshore.org'
);
```

## Testing Checklist

### Authentication Tests

- [ ] Sign in at `/login` with geter@humusnshore.org
- [ ] Verify redirect to dashboard after login
- [ ] Check session persistence on page refresh

### Profile Management

- [ ] Navigate to `/profile`
- [ ] Verify profile data loads
- [ ] Test editing profile fields:
  - [ ] Full name
  - [ ] Company
  - [ ] Job title
  - [ ] Phone number
- [ ] Save changes and verify persistence
- [ ] Test preference updates:
  - [ ] Email notifications
  - [ ] Theme selection
  - [ ] Language preference

### Organization Management

- [ ] Create new organization:
  - Name: "Humus & Shore"
  - Slug: "humus-shore"
  - Description: "Primary organization"
- [ ] Verify organization appears in list
- [ ] Test organization settings update
- [ ] Verify owner permissions

### Team Invitations

- [ ] Send invitation to test email
- [ ] Verify invitation appears in pending list
- [ ] Test invitation revocation
- [ ] Check invitation expiry (7 days)

### Role Management

- [ ] View current user roles
- [ ] As super admin, assign roles to other users
- [ ] Test role hierarchy:
  - guest → user → manager → admin → super_admin
- [ ] Verify permission inheritance

### API Endpoint Tests

Run these with your session token after logging in:

```javascript
// Get your session token from browser DevTools:
// Application → Cookies → sb-molcqjsqtjbfclasynpg-auth-token

const token = "YOUR_SESSION_TOKEN_HERE";
const baseURL = "http://localhost:3000/api";

// Test Profile API
fetch(`${baseURL}/users/profile`, {
  headers: {
    'Cookie': `sb-molcqjsqtjbfclasynpg-auth-token=${token}`
  }
}).then(r => r.json()).then(console.log);

// Test Organizations API
fetch(`${baseURL}/organizations`, {
  headers: {
    'Cookie': `sb-molcqjsqtjbfclasynpg-auth-token=${token}`
  }
}).then(r => r.json()).then(console.log);

// Create Organization
fetch(`${baseURL}/organizations`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': `sb-molcqjsqtjbfclasynpg-auth-token=${token}`
  },
  body: JSON.stringify({
    name: 'Test Organization',
    slug: 'test-org',
    description: 'Testing organization creation'
  })
}).then(r => r.json()).then(console.log);
```

## Expected Behaviors

### For Super Admin (geter@humusnshore.org)

1. **Full Access**: Can view and modify all data
2. **User Management**: Can assign/revoke roles for any user
3. **Organization Control**: Can manage all organizations
4. **Audit Visibility**: Can view all activity logs

### RLS Policy Verification

The following should work for super admin:
- View all user profiles
- Modify any organization
- Access all team invitations
- View complete audit logs

## Troubleshooting

### Profile Not Created
If profile doesn't auto-create, manually insert:
```sql
INSERT INTO user_profiles (id, email, full_name, company, is_active)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'geter@humusnshore.org'),
  'geter@humusnshore.org',
  'Geter',
  'Humus & Shore',
  true
);
```

### Permission Denied Errors
Check RLS policies are recognizing the @humusnshore.org domain:
```sql
-- Test super admin detection
SELECT 
  auth.uid() as current_user_id,
  (auth.jwt() ->> 'email') as current_email,
  (auth.jwt() ->> 'email') LIKE '%@andru.ai' as is_andru_admin,
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role_name = 'super_admin' 
    AND is_active = true
  ) as has_super_admin_role;
```

### Session Issues
- Clear cookies and re-login
- Check Supabase Auth settings
- Verify JWT expiry time

## Success Criteria

✅ The user management system is fully functional when:

1. Admin user can log in successfully
2. Profile auto-creates or can be manually created
3. All CRUD operations work for:
   - User profiles
   - Organizations
   - Team invitations
   - Role assignments
4. RLS policies properly enforce permissions
5. UI components display and update data correctly
6. Activity is logged to user_activity_log table

## Next Steps After Testing

1. Document any bugs found
2. Fix critical issues
3. Create additional test users for role hierarchy testing
4. Test invitation acceptance flow with secondary email
5. Verify audit log completeness