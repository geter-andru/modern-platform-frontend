# Production Pages - Design Token Migration Plan

**Date**: 2025-10-17
**Issue**: Cost Calculator, ICP Analysis, and other production pages still use legacy components with inline Tailwind classes instead of design tokens
**Impact**: Users see old gray-900 styling instead of new professional dark theme

---

## Problem Analysis

### Pages Affected
1. **Cost Calculator** (`/cost-calculator`) - Uses `CostCalculatorForm`, `CostResults`, `CostHistory`
2. **ICP Analysis** (`/icp`) - Uses `ProductDetailsWidget`, `ICPRatingSystemWidget`, `BuyerPersonasWidget`
3. **Business Case** (`/business-case`) - Uses `SimplifiedBusinessCaseBuilder`
4. **Dashboard** (`/dashboard`) - Uses various dashboard components

### Root Cause
Legacy components in `/src/shared/components/` and `/src/features/` directories:
- Use hardcoded Tailwind classes (e.g., `bg-gray-900`, `text-gray-400`)
- Do NOT reference design token CSS variables
- Predate the token system migration (completed 2025-10-17)

### Why test-dashboard-v2 Works
- Created AFTER token migration
- Directly imports design-tokens.css
- Uses Modern* components that support tokens

---

## Migration Strategy

### Option A: Component-by-Component Migration (Recommended)
**Timeline**: 2-3 days
**Approach**: Update legacy components to use design tokens
**Benefit**: Maintains existing component logic, minimal breaking changes

### Option B: Replace with Modern Components
**Timeline**: 1 day
**Approach**: Replace legacy components with Modern* equivalents
**Benefit**: Faster, leverages already-migrated components
**Risk**: May need to rebuild some custom logic

---

## Option A: Detailed Migration Steps

### Phase 1: Cost Calculator Components (Day 1)

#### 1.1 CostCalculatorForm.tsx
**File**: `/src/shared/components/cost-calculator/CostCalculatorForm.tsx`

**Current Issues**:
```typescript
// Hardcoded Tailwind classes
<div className="bg-gray-900 border-gray-800">
<input className="bg-gray-800 text-white border-gray-700">
<button className="bg-blue-600 hover:bg-blue-700">
```

**Migration Steps**:
1. Import design tokens at component level:
```typescript
// Add to CostCalculatorForm.tsx top
import '../../../shared/styles/design-tokens.css';
```

2. Replace Tailwind classes with token-based classes:
```typescript
// BEFORE:
<div className="bg-gray-900 border-gray-800 text-gray-400">

// AFTER:
<div className="bg-background-primary border-gray-800 text-text-secondary">
// OR use CSS variables:
<div style={{
  backgroundColor: 'var(--bg-primary)',
  borderColor: 'var(--border-standard)',
  color: 'var(--text-secondary)'
}}>
```

3. Update color mappings:
```typescript
// Color Migration Map:
bg-gray-900 → bg-background-primary (or var(--bg-primary))
bg-gray-800 → bg-background-secondary (or var(--bg-secondary))
bg-gray-700 → bg-background-tertiary (or var(--bg-tertiary))
text-gray-400 → text-text-secondary (or var(--text-secondary))
text-gray-500 → text-text-muted (or var(--text-muted))
text-white → text-text-primary (or var(--text-primary))
border-gray-800 → var(--border-standard)
bg-blue-600 → bg-brand-primary (or var(--brand-primary))
```

4. Test in browser:
```bash
# Start dev server
npm run dev

# Navigate to /cost-calculator
# Verify colors match design system
```

**Estimated Time**: 2-3 hours

#### 1.2 CostResults.tsx
**File**: `/src/shared/components/cost-calculator/CostResults.tsx`

**Same migration pattern as CostCalculatorForm**:
1. Import design-tokens.css
2. Replace hardcoded colors with tokens
3. Test results display

**Estimated Time**: 1-2 hours

#### 1.3 CostHistory.tsx
**File**: `/src/shared/components/cost-calculator/CostHistory.tsx`

**Same migration pattern**
**Estimated Time**: 1 hour

**Total Phase 1**: 4-6 hours

---

### Phase 2: ICP Analysis Components (Day 2)

#### 2.1 ProductDetailsWidget.tsx
**File**: `/src/features/icp-analysis/widgets/ProductDetailsWidget.tsx`

**Current Issues** (from previous audit):
```typescript
// Lines 150-160 - Hardcoded rgba values
style={{
  backgroundColor: 'rgba(10, 10, 10, 0.6)',
  borderColor: 'rgba(59, 130, 246, 0.2)'
}}
```

**Migration Steps**:
1. Replace rgba with design tokens:
```typescript
// BEFORE:
style={{
  backgroundColor: 'rgba(10, 10, 10, 0.6)',
  borderColor: 'rgba(59, 130, 246, 0.2)'
}}

// AFTER:
style={{
  backgroundColor: 'var(--bg-secondary)',
  borderColor: 'var(--brand-primary)'
}}
// Or use Tailwind:
className="bg-background-secondary border-brand-primary"
```

2. Update all color references to use tokens

**Estimated Time**: 2-3 hours

#### 2.2 ICPRatingSystemWidget.tsx
**Same pattern as ProductDetailsWidget**
**Estimated Time**: 2 hours

#### 2.3 BuyerPersonasWidget.tsx
**Same pattern**
**Estimated Time**: 1-2 hours

#### 2.4 MyICPOverviewWidget.tsx
**Same pattern**
**Estimated Time**: 1 hour

#### 2.5 RateCompanyWidget.tsx
**Same pattern**
**Estimated Time**: 1 hour

**Total Phase 2**: 7-9 hours

---

### Phase 3: Business Case Components (Day 2-3)

#### 3.1 SimplifiedBusinessCaseBuilder.tsx
**File**: `/src/features/cost-business-case/business-case/SimplifiedBusinessCaseBuilder.tsx`

**Migration pattern same as above**
**Estimated Time**: 3-4 hours

#### 3.2 SimplifiedCostCalculator.tsx
**File**: `/src/features/cost-business-case/cost-calculator/SimplifiedCostCalculator.tsx`

**Estimated Time**: 2-3 hours

**Total Phase 3**: 5-7 hours

---

### Phase 4: Dashboard Components (Day 3)

#### 4.1 Legacy Dashboard Components
**Files**: `/src/features/dashboard/*.tsx` (71 components found)

**Strategy**: Prioritize actively used components
1. CustomerDashboard.tsx
2. RevenueIntelligenceDashboard.tsx
3. ProfessionalDashboard.tsx
4. (Others as needed)

**Estimated Time**: 4-6 hours (for top 3)

---

## Option B: Replace with Modern Components

### Phase 1: Cost Calculator Rewrite (4-6 hours)

**Current**:
```typescript
// app/cost-calculator/page.tsx
import { CostCalculatorForm } from '../../src/shared/components/cost-calculator/CostCalculatorForm';
```

**Replace with**:
```typescript
import { ModernCard } from '@/app/components/ui/ModernCard';
import { ModernInput } from '@/app/components/ui/ModernInput';
import { ModernButton } from '@/app/components/ui/ModernButton';

export default function CostCalculatorPage() {
  return (
    <ModernCard variant="default" padding="spacious">
      <h2 className="text-text-primary text-2xl font-bold">Cost of Inaction Calculator</h2>

      <div className="space-y-4 mt-6">
        <ModernInput
          label="Average Deal Size ($)"
          type="number"
          placeholder="25000"
          value={dealSize}
          onChange={(e) => setDealSize(e.target.value)}
        />

        <ModernInput
          label="Monthly Deals Closed"
          type="number"
          placeholder="5"
          value={monthlyDeals}
          onChange={(e) => setMonthlyDeals(e.target.value)}
        />

        <ModernButton
          variant="primary"
          size="lg"
          onClick={handleCalculate}
          fullWidth
        >
          Calculate Impact
        </ModernButton>
      </div>
    </ModernCard>
  );
}
```

**Pros**:
- Instant design token support (Modern* components already migrated)
- Clean, consistent UI
- Leverages existing work

**Cons**:
- Need to rebuild form logic
- May lose some custom features from legacy components

---

## Recommended Approach: Hybrid Strategy

**Week 1 (Days 1-2)**: Option B for Critical Pages
- Rewrite Cost Calculator page with Modern* components (Priority 0)
- Rewrite ICP Analysis page with Modern* components (Priority 0)
- **Benefit**: Users see new design immediately

**Week 2 (Days 3-5)**: Option A for Complex Components
- Migrate ProductDetailsWidget (has custom logic)
- Migrate SimplifiedBusinessCaseBuilder (complex workflow)
- Migrate Dashboard components (many interdependencies)
- **Benefit**: Preserve existing logic while gaining token support

---

## Color Mapping Reference

### Background Colors
```typescript
// Legacy → Design Tokens
'bg-gray-900' → 'bg-background-primary' or 'var(--bg-primary)' (#000000)
'bg-gray-800' → 'bg-background-secondary' or 'var(--bg-secondary)' (#0a0a0a)
'bg-gray-700' → 'bg-background-tertiary' or 'var(--bg-tertiary)' (#111111)
'bg-black' → 'bg-background-primary' or 'var(--bg-primary)' (#000000)
```

### Text Colors
```typescript
// Legacy → Design Tokens
'text-white' → 'text-text-primary' or 'var(--text-primary)' (#ffffff)
'text-gray-400' → 'text-text-secondary' or 'var(--text-secondary)' (#e2e8f0)
'text-gray-500' → 'text-text-muted' or 'var(--text-muted)' (#94a3b8)
'text-gray-600' → 'text-text-subtle' or 'var(--text-subtle)' (#64748b)
```

### Brand Colors
```typescript
// Legacy → Design Tokens
'bg-blue-600' → 'bg-brand-primary' or 'var(--brand-primary)' (#3b82f6)
'text-blue-500' → 'text-brand-primary' or 'var(--brand-primary)' (#3b82f6)
'bg-green-600' → 'bg-brand-secondary' or 'var(--brand-secondary)' (#10b981)
'bg-purple-600' → 'bg-brand-accent' or 'var(--brand-accent)' (#8b5cf6)
```

### Border Colors
```typescript
// Legacy → Design Tokens
'border-gray-800' → 'var(--border-standard)' (#2a2a2a)
'border-gray-700' → 'var(--border-subtle)' (#333333)
'border-blue-500' → 'border-brand-primary' or 'var(--brand-primary)' (#3b82f6)
```

---

## Testing Checklist

### Per Component
- [ ] Import design-tokens.css (if not using Modern* components)
- [ ] Replace all hardcoded colors with tokens
- [ ] Test in browser (visual inspection)
- [ ] Test dark mode (should work automatically)
- [ ] Test hover states (ensure token-based colors work)
- [ ] Test disabled states
- [ ] Verify no console errors

### Per Page
- [ ] Navigate to page in browser
- [ ] Compare to test-dashboard-v2 styling
- [ ] Verify all interactive elements work
- [ ] Check responsive behavior (mobile, tablet, desktop)
- [ ] Test all form inputs
- [ ] Test all buttons
- [ ] Verify data loading states
- [ ] Test error states

---

## Implementation Script

### Quick Start (Option B - Modern Components)

```bash
# 1. Create new Cost Calculator with Modern components
cd /Users/geter/andru/hs-andru-test/modern-platform/frontend

# 2. Backup existing page
cp app/cost-calculator/page.tsx app/cost-calculator/page.tsx.backup-pre-token-migration

# 3. Edit page.tsx to use Modern* components
# (Agent can do this)

# 4. Test
npm run dev
# Navigate to http://localhost:3000/cost-calculator

# 5. If good, commit
git add app/cost-calculator/page.tsx
git commit -m "feat: Migrate Cost Calculator to design tokens (Modern components)"
```

### Gradual Migration (Option A - Component Updates)

```bash
# 1. Create branch
git checkout -b feat/production-pages-token-migration

# 2. Migrate one component at a time
# Start with CostCalculatorForm.tsx
# (Agent can do this)

# 3. Test each component
npm run dev

# 4. Commit incrementally
git add src/shared/components/cost-calculator/CostCalculatorForm.tsx
git commit -m "feat: Migrate CostCalculatorForm to design tokens"

# 5. Repeat for each component
```

---

## Rollback Plan

### If Migration Causes Issues

**Immediate Rollback**:
```bash
# Restore from backup
cp app/cost-calculator/page.tsx.backup-pre-token-migration app/cost-calculator/page.tsx

# Or revert commit
git revert HEAD
```

**Safe Migration Path**:
1. Create feature branch
2. Migrate one page at a time
3. Test thoroughly
4. Merge to main only after validation
5. Keep backups for 1 week

---

## Timeline Summary

### Option A (Component Migration): 2-3 days
- Day 1: Cost Calculator components (4-6 hours)
- Day 2: ICP Analysis components (7-9 hours)
- Day 3: Business Case + Dashboard (9-12 hours)

### Option B (Modern Component Rewrite): 1 day
- Morning: Cost Calculator page (4-6 hours)
- Afternoon: ICP Analysis page (4-6 hours)

### Recommended Hybrid: 1 week
- Days 1-2: Rewrite critical pages with Modern* components
- Days 3-5: Migrate complex components to preserve logic

---

## Next Steps

**Immediate Actions**:
1. Choose Option A, B, or Hybrid
2. Create feature branch: `feat/production-pages-token-migration`
3. Start with Cost Calculator (most visible)
4. Test thoroughly before moving to next page

**Questions to Answer**:
- Do you want to preserve existing component logic (Option A)?
- Or rebuild pages with Modern* components for speed (Option B)?
- Which pages are highest priority for users?

---

**Created**: 2025-10-17
**Status**: Ready for Implementation
**Estimated Total Time**: 1-3 days depending on approach
**Breaking Changes**: None (visual update only)
