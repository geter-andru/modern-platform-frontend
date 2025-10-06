# 🏗️ Four-Repository Development Process Guide

## **📋 Overview**
This guide defines the production-ready development process for the H&S Platform's 4-repository architecture. Each repository serves a specific purpose and follows strict quality gates to ensure enterprise-grade software delivery.

## **📂 Repository Structure**

```
modern-platform/
├── frontend/     # Next.js 15 + React 19 (Deployed to Netlify)
├── backend/      # Express.js API (Deployed to Render)
├── infra/        # Infrastructure & Configuration
└── dev/          # Development Tools & Documentation
```

## **🎯 Core Principles**

1. **Clean Separation**: Each repository is independently deployable
2. **Quality Gates**: Every phase has specific quality requirements
3. **Progressive Enhancement**: Start simple, add complexity only when justified
4. **Production-First**: Always consider deployment implications
5. **Security by Design**: No secrets in code, ever

---

## **📋 PHASE 1: Planning & Design**

### **1.1 Feature Specification**
```markdown
FEATURE: [Name]
PROBLEM: [What business problem does this solve?]
SUCCESS METRIC: [How will we measure success?]

REPOSITORY IMPACT:
□ Frontend - [UI components, pages, user flows]
□ Backend - [API endpoints, business logic, data processing]
□ Infra - [Database changes, deployment configs, secrets]
□ Dev - [Testing tools, documentation, validation]

API CONTRACTS:
- Endpoint: [Method] /api/[resource]
- Request: [Schema]
- Response: [Schema]
- Error Codes: [List]
```

### **1.2 Architecture Review Checklist**
- [ ] Aligns with existing patterns in codebase
- [ ] Reuses existing components/utilities where possible
- [ ] Error handling strategy defined
- [ ] Performance implications considered
- [ ] Mobile responsiveness planned
- [ ] Accessibility requirements identified

---

## **📂 PHASE 2: Repository-Specific Development**

### **2.1 Backend Development** (`modern-platform-backend`)

#### **Setup & Branch Creation**
```bash
cd /Users/geter/andru/hs-andru-test/modern-platform/backend
git checkout -b feature/[feature-name]
npm install
```

#### **Development Workflow**
```bash
# 1. Start development server
npm run dev  # Runs on port 3001

# 2. Test Driven Development
npm run test:watch  # Keep tests running

# 3. Code Quality
npm run lint        # Check code quality
npm run lint:fix    # Auto-fix issues
```

#### **Backend File Structure**
```
src/
├── controllers/
│   └── [feature]Controller.js    # Request handling
├── services/
│   └── [feature]Service.js       # Business logic
├── middleware/
│   └── [feature]Validation.js    # Input validation
├── routes/
│   └── [feature].js              # Route definitions
└── tests/
    └── [feature].test.js         # Unit tests
```

#### **Quality Requirements**
- ✅ All endpoints have error handling
- ✅ Input validation with Joi
- ✅ Authentication middleware where needed
- ✅ Rate limiting configured
- ✅ Logging with Winston
- ✅ Tests for all endpoints
- ✅ API documentation updated

### **2.2 Frontend Development** (`modern-platform-frontend`)

#### **Setup & Branch Creation**
```bash
cd /Users/geter/andru/hs-andru-test/modern-platform/frontend
git checkout -b feature/[feature-name]
npm install
```

#### **Development Workflow**
```bash
# 1. Start development server
npm run dev  # Runs on port 3000

# 2. Run tests
npm run test
npm run test:watch

# 3. Build verification
npm run build  # Must succeed before commit
```

#### **Frontend File Structure**
```
app/
├── [feature]/
│   ├── page.tsx                 # Main page component
│   ├── components/
│   │   └── [Feature]Component.tsx
│   └── __tests__/
│       └── [Feature].test.tsx
lib/
├── hooks/
│   └── use[Feature].ts          # Custom hooks
├── services/
│   └── [feature]Service.ts      # API client
└── types/
    └── [feature].types.ts       # TypeScript interfaces
```

#### **Quality Requirements**
- ✅ TypeScript interfaces for all props
- ✅ Loading states implemented
- ✅ Error boundaries in place
- ✅ Mobile responsive (test at 375px, 768px, 1440px)
- ✅ Accessibility: ARIA labels, keyboard navigation
- ✅ Form validation with react-hook-form + zod
- ✅ API error handling with user feedback
- ✅ React Query for data fetching

### **2.3 Infrastructure Updates** (`modern-platform-infra`)

#### **Setup & Branch Creation**
```bash
cd /Users/geter/andru/hs-andru-test/modern-platform/infra
git checkout -b feature/[feature-name]
```

#### **Configuration Updates**
```
supabase/
├── migrations/
│   └── [timestamp]_[feature].sql
.env.example  # Update with new variables
netlify.toml  # If frontend deployment changes needed
```

#### **Quality Requirements**
- ✅ Migrations are reversible
- ✅ .env.example updated with descriptions
- ✅ No actual secrets in repository
- ✅ Schema documentation updated
- ✅ Migration tested on staging first

### **2.4 Development Tools** (`modern-platform-dev`)

#### **Documentation & Tools**
```
dev/
├── docs/
│   └── [feature]-implementation.md
├── scripts/
│   └── test-[feature].js
└── validation-agents/
    └── [feature]-validator.js
```

---

## **🔄 PHASE 3: Integration & Testing**

### **3.1 Local Integration Testing**

#### **Start All Services**
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev

# Terminal 3: Database (if local Supabase)
supabase start
```

#### **Integration Test Checklist**
- [ ] End-to-end user flow works
- [ ] Data persists correctly
- [ ] Error scenarios handled gracefully
- [ ] Performance acceptable (<3s page load)
- [ ] Mobile experience smooth
- [ ] Keyboard navigation works

### **3.2 Cross-Repository Validation**

```bash
# Backend API Tests
curl -X POST http://localhost:3001/api/[endpoint] \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'

# Frontend Build Test
cd frontend && npm run build

# Lint All Repositories
cd backend && npm run lint
cd frontend && npm run lint
```

---

## **🚀 PHASE 4: Deployment Process**

### **4.1 Pre-Deployment Checklist**
- [ ] All tests passing
- [ ] Build succeeds without warnings
- [ ] Environment variables documented
- [ ] Database migrations prepared
- [ ] API documentation updated
- [ ] Rollback plan defined

### **4.2 Backend Deployment (Render)**

#### **Environment Variables**
```bash
# Update in Render Dashboard
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=...
AIRTABLE_API_KEY=...
```

#### **Deployment Steps**
1. Push to main branch
2. Render auto-deploys from GitHub
3. Monitor build logs
4. Test production endpoints
5. Check error tracking

### **4.3 Frontend Deployment (Netlify)**

#### **Environment Variables**
```bash
# Update in Netlify Dashboard
NEXT_PUBLIC_API_URL=https://api.production.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

#### **Deployment Steps**
1. Push to main branch
2. Netlify auto-builds
3. Preview deployment first
4. Promote to production
5. Clear CDN cache if needed

### **4.4 Database Updates (Supabase)**

```bash
# 1. Test migration locally
supabase db reset
supabase migration up

# 2. Apply to staging
supabase db push --db-url $STAGING_URL

# 3. Verify staging
# Run integration tests

# 4. Apply to production
supabase db push --db-url $PRODUCTION_URL
```

---

## **📊 PHASE 5: Monitoring & Validation**

### **5.1 Post-Deployment Verification**

#### **Health Checks**
```bash
# Backend Health
curl https://api.production.com/health

# Frontend Status
curl https://app.production.com

# Database Connection
npm run test:db:production
```

#### **Monitoring Checklist**
- [ ] Error rates normal
- [ ] Response times <500ms p95
- [ ] No JavaScript errors in browser
- [ ] Database queries optimized
- [ ] Memory usage stable
- [ ] User reports verified

### **5.2 Documentation Updates**
```markdown
# Update in dev/docs/

## Feature: [Name]
- **Released**: [Date]
- **Endpoints**: [List]
- **Database Changes**: [List]
- **Environment Variables**: [List]
- **Known Issues**: [List]
- **Monitoring**: [Dashboard links]
```

---

## **🛠️ Development Standards**

### **Git Conventions**

#### **Branch Naming**
```
feature/add-team-dashboard
bugfix/fix-auth-redirect
hotfix/critical-payment-issue
chore/update-dependencies
```

#### **Commit Messages**
```
feat(frontend): add team collaboration dashboard
fix(backend): resolve race condition in auth
docs(dev): update API documentation
test(frontend): add integration tests for teams
chore(infra): update Node.js version
```

### **Code Review Requirements**
- [ ] Code follows existing patterns
- [ ] Tests included and passing
- [ ] Documentation updated
- [ ] No console.logs or debugging code
- [ ] Security implications considered
- [ ] Performance impact acceptable

### **Security Standards**
- 🔒 Never commit secrets
- 🔒 Use environment variables
- 🔒 Validate all inputs
- 🔒 Sanitize outputs
- 🔒 Use HTTPS everywhere
- 🔒 Implement rate limiting
- 🔒 Add authentication where needed

---

## **💡 Best Practices**

### **Performance**
1. **Frontend**: Lazy load components, optimize images, use React.memo
2. **Backend**: Use pagination, implement caching, optimize queries
3. **Database**: Add indexes, use connection pooling, optimize schemas

### **Testing Strategy**
1. **Unit Tests**: Test individual functions
2. **Integration Tests**: Test API endpoints
3. **E2E Tests**: Test complete user flows
4. **Performance Tests**: Load testing for scaling

### **Error Handling**
```typescript
// Frontend
try {
  const data = await apiService.getData()
} catch (error) {
  toast.error('Failed to load data')
  console.error('API Error:', error)
  // Send to error tracking
}

// Backend
try {
  const result = await service.process()
  res.json({ success: true, data: result })
} catch (error) {
  logger.error('Processing failed:', error)
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  })
}
```

---

## **📈 Scaling Considerations**

### **When to Optimize**
- Response time >1s consistently
- Memory usage >80%
- Database queries >100ms
- Build time >5 minutes
- Bundle size >5MB

### **Optimization Strategies**
1. **Code Splitting**: Dynamic imports for large components
2. **Caching**: Redis for frequently accessed data
3. **CDN**: Static assets via Cloudflare
4. **Database**: Read replicas for scaling
5. **API**: GraphQL for reducing requests

---

## **🚨 Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Clear caches
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should match .nvmrc
```

#### **CORS Errors**
```javascript
// Backend: Check CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
```

#### **Environment Variables**
```bash
# Verify locally
npm run env:check

# Verify on deployment platform
# Check dashboard for all required vars
```

---

## **📚 Resources**

- **Frontend Docs**: [Next.js 15 Docs](https://nextjs.org/docs)
- **Backend Docs**: [Express.js Guide](https://expressjs.com/guide)
- **Database**: [Supabase Docs](https://supabase.com/docs)
- **Deployment**: [Netlify](https://docs.netlify.com) | [Render](https://render.com/docs)

---

## **✅ Quick Reference Checklist**

Before starting any feature:
- [ ] Read this guide completely
- [ ] Check existing patterns in codebase
- [ ] Define API contracts
- [ ] Plan error handling
- [ ] Consider mobile experience
- [ ] Document approach

During development:
- [ ] Write tests first (TDD)
- [ ] Keep commits small
- [ ] Run linters frequently
- [ ] Test on mobile
- [ ] Update documentation

Before deployment:
- [ ] All tests passing
- [ ] Build succeeds
- [ ] Environment vars set
- [ ] Rollback plan ready
- [ ] Team notified

After deployment:
- [ ] Monitor error rates
- [ ] Check performance
- [ ] Verify functionality
- [ ] Update documentation
- [ ] Celebrate success! 🎉