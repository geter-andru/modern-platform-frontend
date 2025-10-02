# HS-Platform Staging Deployment Guide

## 🚀 Netlify Branch Preview Setup

### **Current Status**
- ✅ **Production**: `platform.andru-ai.com` (assets-app React)
- 🚧 **Staging**: Branch preview from `assets-feature` (hs-platform Next.js)

---

## **Netlify Configuration**

### **Branch Preview Settings**
1. **Main Branch**: `main` → Production (DO NOT CHANGE)
2. **Preview Branch**: `assets-feature` → Staging
3. **Build Command**: `npm run build` (from `hs-platform/frontend`)
4. **Publish Directory**: `hs-platform/frontend/out`

### **Environment Variables (Staging)**
Set in Netlify dashboard for staging branch:
```bash
NODE_VERSION=18
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_API_URL=https://staging-api.andru-ai.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_EXPORT=true
```

---

## **Deployment Process**

### **Step 1: Push to Branch**
```bash
git checkout assets-feature
git add .
git commit -m "staging: Configure hs-platform for Netlify deployment"
git push origin assets-feature
```

### **Step 2: Netlify Auto-Deploy**
- Netlify will detect the push to `assets-feature`
- Build process runs from `hs-platform/frontend`
- Preview URL generated: `https://deploy-preview-X--platform-andru-ai.netlify.app`

### **Step 3: Access Staging**
- **Staging URL**: Provided by Netlify after deployment
- **Customer Test**: `https://staging-url/customer/CUST_4?token=admin-demo-token-2025`
- **Dashboard**: `https://staging-url/dashboard`

---

## **Testing Checklist**

### **Core Functionality**
- [ ] Home page loads without errors
- [ ] Dashboard renders correctly
- [ ] Customer routes work (`/customer/CUST_4`)
- [ ] ICP analysis tool loads
- [ ] Cost calculator functions
- [ ] Export features work
- [ ] Navigation is responsive

### **Feature Parity with Production**
- [ ] Same customer data available
- [ ] All tools accessible
- [ ] Export functionality works
- [ ] Mobile responsiveness
- [ ] Error handling

### **Performance**
- [ ] Page load times under 3 seconds
- [ ] No JavaScript errors in console
- [ ] Responsive on mobile devices
- [ ] Lighthouse score > 80

---

## **Rollback Plan**

### **If Staging Issues**
1. **Fix Issues**: Make corrections on `assets-feature` branch
2. **Redeploy**: Push changes triggers automatic rebuild
3. **Emergency**: Switch staging to different branch if needed

### **If Production Affected**
⚠️ **Production should NOT be affected** - main branch unchanged

---

## **Domain Strategy**

### **Current Setup**
- **Production**: `platform.andru-ai.com` → main branch (assets-app)
- **Staging**: `deploy-preview-*--platform-andru-ai.netlify.app` → assets-feature (hs-platform)

### **Future Migration Path**
1. **Phase 1**: Test hs-platform on staging URL
2. **Phase 2**: Set up `staging.platform.andru-ai.com` subdomain
3. **Phase 3**: Switch main domain to hs-platform after validation

---

## **Commands for Quick Testing**

### **Local Build Test**
```bash
cd /Users/geter/hs-andru-v1/hs-platform/frontend
npm run build
npm run start
```

### **Check Staging Status**
```bash
curl -I https://deploy-preview-X--platform-andru-ai.netlify.app
```

### **Test Customer URLs**
```bash
curl -s "https://staging-url/customer/CUST_4?token=admin-demo-token-2025"
```

---

## **Key Differences: hs-platform vs assets-app**

### **Technology Stack**
| Feature | assets-app (Production) | hs-platform (Staging) |
|---------|------------------------|------------------------|
| Framework | Create React App | Next.js 15 |
| TypeScript | Partial | Full TypeScript |
| Styling | Tailwind CSS | Tailwind CSS |
| State | React Context | React Query |
| Build | CRA build | Next.js export |
| Backend | Static/Airtable | Express.js API |

### **Features**
- ✅ **Same**: ICP Analysis, Cost Calculator, Dashboard
- ✅ **Enhanced**: Better TypeScript, improved API layer
- ✅ **New**: Advanced analytics, enterprise navigation
- ⚠️ **Different**: URL structure may vary slightly

---

## **Success Criteria**

### **Staging Validation Complete When:**
1. ✅ All core features working
2. ✅ Performance acceptable
3. ✅ Mobile responsive
4. ✅ Customer data accessible
5. ✅ Export functionality verified
6. ✅ No critical errors

### **Ready for Production Migration When:**
1. ✅ Feature parity achieved
2. ✅ Performance equal or better
3. ✅ All test customer workflows pass
4. ✅ Stakeholder approval received
5. ✅ Rollback plan validated

---

## **Emergency Contacts**

### **If Staging Breaks Production**
- **Action**: Verify main branch unchanged
- **Check**: `platform.andru-ai.com` still serving assets-app
- **Rollback**: Not needed (branches isolated)

### **If Staging Won't Deploy**
- **Check**: Netlify build logs
- **Verify**: `netlify.toml` configuration
- **Test**: Local build process first