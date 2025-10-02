# 🚨 MANDATORY DEVELOPMENT PATTERNS 🚨

**VIOLATION OF THESE PATTERNS WILL BLOCK ALL BUILDS AND DEPLOYMENTS**

---

## 1. Creating New Features

### ❌ NEVER DO THIS:
```bash
# Manual directory creation is FORBIDDEN
mkdir src/features/my-feature  # ❌ BLOCKED
touch src/features/my-feature/index.ts  # ❌ BLOCKED
```

### ✅ ALWAYS DO THIS:
```bash
# MANDATORY: Use the script, not manual creation
npm run create:feature MyNewFeature

# This automatically creates:
# src/features/MyNewFeature/
# ├── components/
# ├── hooks/
# ├── types/
# ├── utils/
# ├── services/
# └── index.ts
```

### Why This Is Mandatory:
- Ensures consistent structure across all features
- Automatically generates TypeScript boilerplate
- Prevents architecture drift
- Creates proper barrel exports
- Enforces naming conventions

---

## 2. Creating New Components

### ❌ NEVER DO THIS:
```typescript
// Creating components manually is FORBIDDEN
// app/components/MyComponent.tsx  ❌ BLOCKED
// src/MyComponent.jsx  ❌ BLOCKED
// components/random/MyComponent.js  ❌ BLOCKED
```

### ✅ ALWAYS DO THIS:
```bash
# MANDATORY: Use the script
npm run create:component MyFeature MyComponent

# This creates properly structured TypeScript files with:
# - Proper TypeScript interfaces
# - Real data requirements
# - Enforced patterns
# - No mock data placeholders
# - Proper prop types
```

### Component Structure (Auto-Generated):
```typescript
// src/features/MyFeature/components/MyComponent.tsx
import React from 'react';
import type { MyComponentProps } from '../types/mycomponent.types';

export const MyComponent: React.FC<MyComponentProps> = ({ 
  // TypeScript will enforce props
}) => {
  // NO mock data allowed
  // Real data implementation required
  return (
    <div className="flex flex-col space-y-4">
      {/* Component implementation */}
    </div>
  );
};
```

---

## 3. Development Process

### ❌ NEVER DO THIS:
```bash
# Starting development without checks
next dev  # ❌ BLOCKED - Will fail
npm start  # ❌ BLOCKED - Will fail

# Committing without validation
git commit -m "quick fix" --no-verify  # ❌ AVOID - Tracked and flagged
```

### ✅ ALWAYS DO THIS:
```bash
# Every development session MUST start with:
npm run dev  # This runs all checks first

# Before committing:
git add .
git commit -m "feat(auth): add OAuth integration"  # Pre-commit hooks run automatically

# Commit message format:
# type(scope): subject
# Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
```

---

## 4. File Types and Extensions

### ❌ FORBIDDEN:
- `.jsx` files - Use `.tsx` instead
- `.js` files - Use `.ts` instead  
- Any untyped JavaScript files
- Files outside proper structure

### ✅ REQUIRED:
- `.tsx` for React components
- `.ts` for utilities and services
- Proper TypeScript types for everything
- Files in correct feature directories

---

## 5. Data Handling

### ❌ FORBIDDEN:
```typescript
// ALL OF THESE WILL BLOCK YOUR BUILD:
const mockData = {...}  // ❌ BLOCKED
const fakeUsers = [...]  // ❌ BLOCKED
const dummyData = [...]  // ❌ BLOCKED
const testData = [...]  // ❌ BLOCKED
email: "john@example.com"  // ❌ BLOCKED
phone: "123-456-7890"  // ❌ BLOCKED
name: "John Doe"  // ❌ BLOCKED
```

### ✅ REQUIRED:
```typescript
// Real data from real sources
const userData = await fetchFromAPI('/api/users');
const customerData = await airtableService.getCustomer(id);
const analyticsData = await supabase.from('analytics').select();
```

---

## 6. Import Patterns

### ❌ FORBIDDEN:
```typescript
import Component from '../../../components/Component';  // ❌ Deep relative imports
import { util } from '../../../../utils';  // ❌ BLOCKED
```

### ✅ REQUIRED:
```typescript
import { Component } from '@/features/MyFeature/components';
import { util } from '@/lib/utils';
import { service } from '@/services';
```

---

## 7. Testing Requirements

### Before EVERY Commit:
1. ✅ TypeScript compilation must pass
2. ✅ ESLint must pass with zero warnings
3. ✅ No mock data detected
4. ✅ No JSX files present
5. ✅ All imports valid
6. ✅ Structure validation passed

### Before EVERY Push:
1. ✅ All commit checks
2. ✅ No console.log in client code
3. ✅ TODO comments have issue numbers
4. ✅ Full build succeeds
5. ✅ All tests pass

---

## 8. Emergency Override Process

If you absolutely MUST bypass these patterns (NOT RECOMMENDED):

1. **Document WHY** in a comment with:
   ```typescript
   // @production-approved - [Your Name] - [Date] - [Reason]
   // Example: @production-approved - John Smith - 2024-01-15 - Legacy migration
   ```

2. **Create an issue** for fixing it later

3. **Get approval** from tech lead

4. **Know that**:
   - This will be tracked
   - This will be audited
   - This should be temporary

---

## Enforcement Mechanisms

### Automatic Enforcement:
- **Pre-commit hooks**: Block bad commits
- **Pre-push hooks**: Block bad pushes  
- **Build scripts**: Block bad builds
- **CI/CD pipeline**: Final enforcement

### Manual Enforcement:
- **Code reviews**: Must follow patterns
- **Automated audits**: Daily pattern compliance reports
- **Performance reviews**: Pattern violations tracked

---

## Quick Reference Commands

```bash
# Create a new feature
npm run create:feature FeatureName

# Create a new component
npm run create:component FeatureName ComponentName

# Start development (with all checks)
npm run dev

# Run all validations
npm run validate:all

# Fix linting issues
npm run fix

# Check for mock data
npm run validate:data

# Check structure
npm run structure-check
```

---

## Remember

**These patterns are NOT suggestions. They are MANDATORY.**

Violations will:
- ❌ Block your commits
- ❌ Block your builds
- ❌ Block your deployments
- ❌ Be tracked and reported

Follow the patterns, and development will be smooth and consistent.

---

*Last Updated: [Auto-generated]*
*Enforcement Level: MAXIMUM*
*Bypass Difficulty: EXTREME*