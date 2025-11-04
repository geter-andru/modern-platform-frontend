# Netlify Environment Variables Setup
**Date:** October 16, 2025
**Status:** REQUIRED FOR DEPLOYMENT

## Overview

As of October 16, 2025, all sensitive environment variables have been **removed from `netlify.toml`** for security. They must be configured in the Netlify UI before deployment.

## Required Environment Variables

Navigate to: **Netlify Dashboard** → **Site Settings** → **Environment Variables**

### Production Environment Variables

| Variable Name | Value | Description | Scope |
|--------------|-------|-------------|-------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://hs-andru-test.onrender.com` | Backend API endpoint | All deploys |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://molcqjsqtjbfclasynpg.supabase.co` | Supabase project URL | All deploys |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vbGNxanNxdGpiZmNsYXN5bnBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4ODk1NDcsImV4cCI6MjA3MTQ2NTU0N30.IEP7E2VM2uV1vltbSw1CwYpYw1qw6MvI-JB5SD0tUKI` | Supabase anonymous key (public) | All deploys |

### Optional Environment Variables

| Variable Name | Example Value | Description | Scope |
|--------------|---------------|-------------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-site.netlify.app` | Frontend site URL | Production |
| `NEXT_PUBLIC_DEBUG_MODE` | `false` | Enable debug logging | Development |
| `NEXT_PUBLIC_ENABLE_TEST_ENDPOINTS` | `false` | Enable test endpoints | Development |

## Setup Instructions

### Method 1: Netlify UI (Recommended)

1. Log in to [Netlify Dashboard](https://app.netlify.com)
2. Select your site: **modern-platform-frontend**
3. Go to **Site Settings** → **Environment Variables**
4. Click **Add a variable**
5. For each variable listed above:
   - Enter the **Variable name** (e.g., `NEXT_PUBLIC_BACKEND_URL`)
   - Enter the **Value**
   - Set scope to **All deploys** (or specific as needed)
   - Click **Create variable**
6. Trigger a new deploy to apply changes

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Set environment variables
netlify env:set NEXT_PUBLIC_BACKEND_URL "https://hs-andru-test.onrender.com"
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://molcqjsqtjbfclasynpg.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vbGNxanNxdGpiZmNsYXN5bnBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4ODk1NDcsImV4cCI6MjA3MTQ2NTU0N30.IEP7E2VM2uV1vltbSw1CwYpYw1qw6MvI-JB5SD0tUKI"

# List all environment variables to verify
netlify env:list
```

### Method 3: Netlify MCP Server (Automated)

```typescript
// If using the Netlify MCP server
const envVars = [
  {
    key: "NEXT_PUBLIC_BACKEND_URL",
    value: "https://hs-andru-test.onrender.com"
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_URL",
    value: "https://molcqjsqtjbfclasynpg.supabase.co"
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
];

// Set each variable (requires Netlify MCP server)
for (const envVar of envVars) {
  await netlify_set_env_var({
    siteId: "your-netlify-site-id",
    key: envVar.key,
    value: envVar.value
  });
}
```

## Verification

After setting environment variables:

1. **Trigger a new deploy**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

2. **Check deploy logs**
   - Verify variables are available during build
   - Look for no errors related to missing environment variables

3. **Test the deployed site**
   - Open the deployed URL
   - Verify Supabase connection works
   - Check backend API calls succeed
   - Open browser console and check for errors

## Security Notes

⚠️ **IMPORTANT:**
- Never commit API keys to version control (Git)
- The `NEXT_PUBLIC_*` prefix means these variables are **exposed to the browser**
- Only use `NEXT_PUBLIC_*` for non-sensitive, client-side values
- The Supabase anon key is safe to expose (it's public by design)
- For sensitive backend operations, use server-side environment variables

## Troubleshooting

### Build fails with "Cannot read property 'NEXT_PUBLIC_BACKEND_URL'"

**Solution:** Environment variable not set in Netlify
1. Go to Site Settings → Environment Variables
2. Verify all required variables are listed
3. Check the scope is set to "All deploys"
4. Trigger a new deploy

### App loads but Supabase connection fails

**Solution:** Incorrect Supabase credentials
1. Verify `NEXT_PUBLIC_SUPABASE_URL` matches your Supabase project
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the anonymous key (not service role key)
3. Check Supabase project is active (not paused)

### Backend API calls return 404 or CORS errors

**Solution:** Backend URL incorrect or backend not deployed
1. Verify `NEXT_PUBLIC_BACKEND_URL` points to the correct Render service
2. Check backend service is deployed and running
3. Verify CORS configuration on backend allows your Netlify domain

## Related Files

- `netlify.toml` - Netlify configuration (secrets removed)
- `.env.example` - Local development environment template
- `app/lib/config/environment.ts` - Environment variable validation

## Maintenance

**Review:** Monthly
**Next Review:** November 16, 2025
**Owner:** Development Team

---

**Last Updated:** October 16, 2025
**Security Status:** ✅ No secrets in version control
