# 🚨 **CRITICAL DEVELOPMENT CONFIGURATION RULES**

**Date:** January 27, 2025  
**Status:** MANDATORY - Never violate these rules  
**Purpose:** Prevent configuration conflicts between development and production

---

## 🎯 **RULE #1: NEVER USE PRODUCTION CONFIG IN DEVELOPMENT**

### **❌ FORBIDDEN:**
```typescript
// NEVER copy production config to development
const nextConfig: NextConfig = {
  output: 'export',        // ❌ BREAKS API ROUTES
  trailingSlash: true,     // ❌ CAUSES 308 REDIRECTS
  images: { unoptimized: true }  // ❌ DISABLES IMAGE OPTIMIZATION
};
```

### **✅ REQUIRED:**
```typescript
// ALWAYS use development-specific config
const nextConfig: NextConfig = {
  // output: 'export',     // ✅ DISABLED for development
  trailingSlash: false,    // ✅ REQUIRED for API routes
  images: { unoptimized: false }  // ✅ ENABLED for development
};
```

---

## 🎯 **RULE #2: DUAL CONFIGURATION SYSTEM**

### **File Structure:**
```
frontend/
├── next.config.ts              # Development config
├── next.config.production.ts   # Production config
└── package.json                # Scripts for both modes
```

### **Package.json Scripts:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:production": "cp next.config.production.ts next.config.ts && next build",
    "start": "next start"
  }
}
```

---

## 🎯 **RULE #3: CONFIGURATION VALIDATION**

### **Development Config Checklist:**
- [ ] `output: 'export'` is **DISABLED** or **COMMENTED OUT**
- [ ] `trailingSlash: false` (APIs don't use trailing slashes)
- [ ] `images.unoptimized: false` (enable image optimization)
- [ ] `typescript.ignoreBuildErrors: false` (catch errors early)
- [ ] `eslint.ignoreDuringBuilds: false` (enforce code quality)

### **Production Config Checklist:**
- [ ] `output: 'export'` is **ENABLED** (for Netlify static export)
- [ ] `trailingSlash: true` (required for static hosting)
- [ ] `images.unoptimized: true` (disable for static export)
- [ ] `typescript.ignoreBuildErrors: true` (allow deployment with errors)
- [ ] `eslint.ignoreDuringBuilds: true` (allow deployment with linting issues)

---

## 🎯 **RULE #4: API ROUTE TESTING**

### **Before Starting Development:**
```bash
# ALWAYS test API routes first
curl -s "http://localhost:3000/api/test-supabase"
# Should return JSON, NOT redirects
```

### **Expected Response:**
```json
{"success": true, "tests": {...}}
```

### **❌ Failure Response:**
```
/api/test-supabase/
```
*(This indicates trailingSlash: true is enabled)*

---

## 🎯 **RULE #5: MIDDLEWARE COMPATIBILITY**

### **Development Mode:**
- ✅ Middleware **ENABLED** (`middleware.ts` exists)
- ✅ API routes **WORKING** (no redirects)
- ✅ Authentication **FUNCTIONAL**

### **Production Mode:**
- ❌ Middleware **DISABLED** (incompatible with static export)
- ✅ Static pages **WORKING**
- ✅ Client-side routing **FUNCTIONAL**

---

## 🎯 **RULE #6: ENVIRONMENT VARIABLE VALIDATION**

### **Development Environment:**
```bash
# Check these variables exist and are valid
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### **Validation Script:**
```bash
# Add to package.json scripts
"validate:env": "node -e \"console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING')\""
```

---

## 🎯 **RULE #7: SERVER STARTUP SEQUENCE**

### **MANDATORY ORDER:**
1. **Backend First:** `cd backend && npm start`
2. **Wait for Health:** `curl http://localhost:3001/health`
3. **Frontend Second:** `cd frontend && npm run dev`
4. **Test API Routes:** `curl http://localhost:3000/api/test-supabase`
5. **Test Pages:** `curl http://localhost:3000/test-auth-bridge`

### **❌ NEVER:**
- Start frontend before backend
- Skip API route testing
- Assume configuration is correct

---

## 🎯 **RULE #8: TROUBLESHOOTING PROTOCOL**

### **When API Routes Redirect:**
1. **Check trailingSlash:** Must be `false` in development
2. **Check output:** Must be disabled or commented out
3. **Restart server:** Configuration changes require restart
4. **Test with curl:** Verify actual response, not browser

### **When Middleware Fails:**
1. **Check Next.js version:** Must be compatible
2. **Check config:** No static export in development
3. **Check environment:** Supabase variables must be set
4. **Check logs:** Look for specific error messages

---

## 🎯 **RULE #9: DEPLOYMENT SWITCHING**

### **To Production:**
```bash
# Switch to production config
cp next.config.production.ts next.config.ts
npm run build
```

### **Back to Development:**
```bash
# Restore development config
git checkout next.config.ts
npm run dev
```

### **❌ NEVER:**
- Commit production config as default
- Deploy with development config
- Mix configuration settings

---

## 🎯 **RULE #10: DOCUMENTATION REQUIREMENTS**

### **Every Config Change Must Include:**
- [ ] **Reason:** Why the change was made
- [ ] **Impact:** What it affects (dev/prod/both)
- [ ] **Testing:** How to verify it works
- [ ] **Rollback:** How to undo if needed

### **Example:**
```typescript
// REASON: Disable trailing slashes for API route compatibility
// IMPACT: Development only - APIs now work without redirects
// TESTING: curl http://localhost:3000/api/test-supabase should return JSON
// ROLLBACK: Change trailingSlash back to true
trailingSlash: false,
```

---

## 🚨 **EMERGENCY RECOVERY**

### **If Development is Broken:**
```bash
# 1. Kill all servers
pkill -f "npm run dev" && pkill -f "npm start"

# 2. Reset to known good config
git checkout next.config.ts

# 3. Verify environment variables
cat .env.local | grep SUPABASE

# 4. Start fresh
cd backend && npm start &
cd frontend && npm run dev &

# 5. Test immediately
curl http://localhost:3000/api/test-supabase
```

---

## 📋 **CHECKLIST FOR NEW DEVELOPERS**

### **Before Starting Work:**
- [ ] Read this document completely
- [ ] Understand dual configuration system
- [ ] Test API routes work (no redirects)
- [ ] Verify environment variables are set
- [ ] Confirm backend is running first

### **Before Committing:**
- [ ] Development config is in `next.config.ts`
- [ ] Production config is in `next.config.production.ts`
- [ ] No mixed configuration settings
- [ ] API routes tested and working
- [ ] Documentation updated if config changed

---

## 🎯 **SUCCESS METRICS**

### **Development Environment is Healthy When:**
- ✅ API routes return JSON (not redirects)
- ✅ Backend health endpoint responds
- ✅ Frontend pages load without errors
- ✅ Authentication bridge works
- ✅ No middleware conflicts

### **Production Environment is Healthy When:**
- ✅ Static export builds successfully
- ✅ All pages are pre-rendered
- ✅ No server-side dependencies
- ✅ Netlify deployment succeeds
- ✅ Client-side routing works

---

**Remember: Configuration conflicts are the #1 cause of development issues. Follow these rules religiously to maintain a stable development environment.**
