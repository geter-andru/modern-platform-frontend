# Widget-by-Widget Conversion Guide
**Quick Reference for Agent 3 (Design Systems Engineer)**
**Date:** 2025-11-04
**Purpose:** Step-by-step conversion instructions for each widget

---

## How to Use This Guide

1. **Start with Phase 1 widgets** (marked 🔴 P0)
2. **Read assets-app reference code** for each widget
3. **Follow conversion pattern** step-by-step
4. **Test functionality** after each change
5. **Screenshot and compare** with baseline
6. **Commit each widget separately** for easy rollback

---

## Phase 1: Critical Fixes (Target: 30% → 60% Parity)

### Fix 1: Background Color (HIGHEST PRIORITY)

**File:** `tailwind.config.ts`
**Line:** 16
**Current:** `primary: '#1a1a1a'`
**Change to:** `primary: '#0a0a0a'`

**Impact:** Immediate 40% improvement in visual quality

**Steps:**
1. Open `tailwind.config.ts`
2. Find line 16 in colors.background section
3. Change `'#1a1a1a'` to `'#0a0a0a'`
4. Save file
5. Verify Tailwind rebuilds (watch terminal)
6. Refresh browser (hard refresh: Cmd+Shift+R)
7. Screenshot and compare

**Verification:**
- DevTools color picker on page background should show `#0a0a0a`
- Page should look significantly darker (like assets-app)

---

### Fix 2: Enable Technical Translation Widget

**File:** `app/icp/page.tsx`
**Line:** 82-90 (approximate)

**Current:**
```jsx
{
  id: 'translator',
  title: 'Technical Translator',
  description: 'Transform metrics into business language',
  icon: Zap,
  available: false,  // ❌ Wrong
  // No component prop
}
```

**Change to:**
```jsx
{
  id: 'translator',
  title: 'Technical Translator',
  description: 'Transform metrics into business language',
  icon: Zap,
  available: true,  // ✅ Fixed
  component: TechnicalTranslationPanel  // ✅ Added
}
```

**Additional Change Required:**
Add import at top of file:
```jsx
import { TechnicalTranslationPanel } from '@/features/icp-analysis/widgets/TechnicalTranslationPanel';
```

**Verification:**
- Widget should render instead of placeholder
- No console errors
- Widget functionality works (dropdowns, inputs)

---

### Fix 3: Simplify Layout (Remove Two-Column Grid)

**File:** `app/icp/page.tsx`
**Lines:** 500-528 (approximate)

**Current (Complex):**
```jsx
<div className="mb-8 grid grid-cols-1 md:grid-cols-[30fr_70fr] gap-6">
  <div className="space-y-6">
    <AnimatePresence mode="wait">
      {leftColumnWidget && (
        <motion.div key={leftColumnWidget.id}>
          {/* Complex logic */}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  <div className="space-y-6">
    {/* Right column */}
  </div>
</div>
```

**Change to (Simple):**
```jsx
<div className="space-y-6">
  {activeTab === 'overview' && <MyICPOverview />}
  {activeTab === 'personas' && <BuyerPersonas />}
  {activeTab === 'translator' && <TechnicalTranslationPanel />}
  {/* Add other widgets as needed */}
</div>
```

**Note:** This requires adding tab navigation. Reference assets-app `SimplifiedICP.jsx` lines 298-308 for tab pattern.

**Verification:**
- Single column layout
- Clean tab switching
- No animation delays
- Mobile responsive

---

## Phase 2: Component Styling (Target: 60% → 85% Parity)

### Widget 1: Product Details Widget

**File:** `src/features/icp-analysis/widgets/ProductDetailsWidget.tsx`
**Priority:** 🟡 P1
**Reference:** `assets-app/src/components/simplified/cards/ProductDetailsWidget.jsx`

#### Section 1: Header (Lines 651-657 approx)

**Current:**
```jsx
<div
  className="px-6 py-4 border-b border-transparent"
  style={{ backgroundColor: 'var(--color-background-tertiary)' }}
>
  <h2 className="heading-3" style={{ color: 'var(--text-primary)' }}>
    My Product Details
  </h2>
</div>
```

**Convert to:**
```jsx
<div className="px-6 py-4 border-b border-gray-800 bg-gray-900">
  <h2 className="text-lg font-semibold text-white">
    My Product Details
  </h2>
</div>
```

**Changes:**
- ❌ Remove: `style={{ backgroundColor: 'var(--color-background-tertiary)' }}`
- ✅ Add: `bg-gray-900` to className
- ❌ Remove: `border-transparent`
- ✅ Add: `border-gray-800` to className
- ❌ Remove: `className="heading-3"` and inline style
- ✅ Add: `className="text-lg font-semibold text-white"`

#### Section 2: Form Fields (Throughout widget)

**Current Pattern:**
```jsx
<input
  type="text"
  className="input-primary"
  style={{ backgroundColor: 'var(--color-input)' }}
/>
```

**Convert to:**
```jsx
<input
  type="text"
  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="Enter value"
/>
```

**Pattern Notes:**
- Always include full Tailwind classes
- Always add focus states
- Always add placeholder styling
- Never use custom CSS classes

#### Section 3: Buttons (Lines 705-732 approx)

**Current (JavaScript Hover):**
```jsx
<button
  style={{
    backgroundColor: 'var(--color-surface)',
    color: 'var(--text-primary)'
  }}
  onMouseEnter={(e) => {
    (e.target as HTMLElement).style.backgroundColor = 'var(--color-surface-hover)'
  }}
  onMouseLeave={(e) => {
    (e.target as HTMLElement).style.backgroundColor = 'var(--color-surface)'
  }}
>
  Save
</button>
```

**Convert to (CSS Hover):**
```jsx
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
  Save
</button>
```

**Changes:**
- ❌ Remove: All `style` attributes
- ❌ Remove: `onMouseEnter` and `onMouseLeave` handlers
- ✅ Add: Complete Tailwind utility classes
- ✅ Add: `hover:` pseudo-class
- ✅ Add: `transition-colors duration-200` for smooth hover

**Verification Checklist:**
- [ ] No `style={{` in file
- [ ] No `var(--` references
- [ ] No custom CSS classes (e.g., `input-primary`, `heading-3`)
- [ ] All buttons use CSS hover (not JavaScript)
- [ ] Form is still functional
- [ ] All inputs accept text
- [ ] Save button triggers handler
- [ ] Screenshot matches assets-app

---

### Widget 2: Technical Translation Panel

**File:** `src/features/icp-analysis/widgets/TechnicalTranslationPanel.tsx`
**Priority:** 🔴 P0 (Enable first) + 🟡 P1 (Style)
**Reference:** `assets-app/src/components/simplified/cards/TechnicalTranslationWidget.jsx`

**Phase 1:** Enable widget (see Fix 2 above)

**Phase 2:** Style conversion

#### Key Patterns from Assets-App Reference

**Framework Selector (Lines 154-162 in assets-app):**
```jsx
<select className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
  {availableFrameworks.map(framework => (
    <option key={framework.id} value={framework.id}>
      {framework.name}
    </option>
  ))}
</select>
```

**Metric Input Grid (Lines 167-185 in assets-app):**
```jsx
<div className="grid grid-cols-3 gap-1.5">
  <input
    type="text"
    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Metric"
  />
  <input
    type="text"
    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Value"
  />
  <select className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
    <option>Unit</option>
  </select>
</div>
```

**Translation Output Box (Lines 210-220 in assets-app):**
```jsx
<div className="p-3 bg-gray-800/50 rounded border border-gray-700">
  <p className="text-sm text-gray-200 leading-relaxed">
    {translation}
  </p>
</div>
```

**Conversion Strategy:**
1. Scan entire file for `style={{`
2. Replace all instances with Tailwind classes
3. Use TAILWIND_CLASS_MAPPING.md for reference
4. Test dropdown functionality
5. Verify metric inputs work
6. Check translation generation

**Verification Checklist:**
- [ ] Widget renders when enabled
- [ ] Framework dropdown populates
- [ ] Metric inputs accept values
- [ ] Translation generates correctly
- [ ] All styling matches assets-app
- [ ] No CSS variables remain

---

### Widget 3: Buyer Personas

**File:** Create new or find existing component
**Priority:** 🟡 P1
**Reference:** `assets-app/src/components/simplified/cards/BuyerPersonasWidget.jsx`

**Status:** Component may need to be created or imported from another location.

**Pattern to Follow:**
```jsx
<div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {personas.map(persona => (
      <div key={persona.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-white">{persona.title}</h4>
            <p className="text-xs text-gray-400">{persona.role}</p>
          </div>
        </div>
        <p className="text-sm text-gray-300">{persona.description}</p>
      </div>
    ))}
  </div>
</div>
```

**Key Elements:**
- Card background: `bg-gray-900`
- Inner card: `bg-gray-800`
- Icon background: `bg-blue-500/20` (20% opacity)
- Icon color: `text-blue-400`
- Grid: 1 column mobile, 2 columns desktop

**Steps:**
1. Check if component exists in codebase
2. If not, create from assets-app reference
3. Enable in page.tsx widgets array
4. Test rendering and functionality

---

### Widget 4: My ICP Overview

**File:** Find existing component (likely in `src/features/icp-analysis/widgets/`)
**Priority:** 🟡 P1
**Status:** Already rendered but needs styling fixes

**Pattern Checklist:**
- [ ] Card uses `bg-gray-900 border border-gray-800`
- [ ] Metrics use consistent typography
- [ ] Icons are semantic colors (blue-400, emerald-400)
- [ ] No CSS variables or inline styles
- [ ] Matches assets-app layout

**Quick Fixes:**
1. Find all `style={{` → Remove
2. Find all custom classes → Replace with Tailwind
3. Verify metrics display correctly
4. Screenshot comparison

---

### Widget 5: Rate This Company

**File:** Create or import component
**Priority:** 🟡 P1

**Pattern:**
```jsx
<div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
  <h3 className="text-lg font-semibold text-white mb-4">Rate This Company</h3>

  {criteria.map(criterion => (
    <div key={criterion.id} className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {criterion.label}
      </label>
      <input
        type="range"
        min="0"
        max="10"
        className="w-full"
        onChange={(e) => handleRatingChange(criterion.id, e.target.value)}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0</span>
        <span>10</span>
      </div>
    </div>
  ))}

  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 mt-4">
    Submit Rating
  </button>
</div>
```

---

### Widget 6: ICP Rating System

**File:** Create or import component
**Priority:** 🟡 P1

**Pattern:**
```jsx
<div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
  <div className="text-center mb-6">
    <div className="text-5xl font-bold text-blue-400 mb-2">
      {overallScore}/100
    </div>
    <p className="text-sm text-gray-400">Overall ICP Fit Score</p>
  </div>

  <div className="space-y-3">
    {categories.map(category => (
      <div key={category.id}>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">{category.name}</span>
          <span className="text-white font-medium">{category.score}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${category.score}%` }}
          />
        </div>
      </div>
    ))}
  </div>
</div>
```

**Note:** `style={{ width }}` is allowed here because it's dynamic content-driven (not color/styling).

---

## Phase 3: Polish & Verification (Target: 85% → 100% Parity)

### Typography Fine-Tuning

**File:** `tailwind.config.ts` lines 90-98

**Optional Fix (if needed for 100% parity):**

**Current (Rem):**
```typescript
'xs': ['0.75rem', { lineHeight: '1.5' }],
'sm': ['0.875rem', { lineHeight: '1.5' }],
'base': ['1rem', { lineHeight: '1.5' }],
```

**Convert to (Pixels - Assets-App Pattern):**
```typescript
'xs': ['11px', { lineHeight: '1.5' }],
'sm': ['13px', { lineHeight: '1.5' }],
'base': ['15px', { lineHeight: '1.5' }],
'lg': ['17px', { lineHeight: '1.5' }],
'xl': ['19px', { lineHeight: '1.25' }],
'2xl': ['23px', { lineHeight: '1.25' }],
'3xl': ['29px', { lineHeight: '1.25' }],
```

**Impact:** Pixel-perfect typography match with assets-app

---

## Common Conversion Patterns

### Pattern 1: Card Container
```jsx
// ❌ Before
<div className="card-executive card-padding-lg" style={{ backgroundColor: 'var(--bg)' }}>

// ✅ After
<div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
```

### Pattern 2: Text Elements
```jsx
// ❌ Before
<h3 className="heading-3" style={{ color: 'var(--text-primary)' }}>

// ✅ After
<h3 className="text-lg font-semibold text-white">
```

### Pattern 3: Form Inputs
```jsx
// ❌ Before
<input className="input-primary" style={{ backgroundColor: 'var(--color-input)' }} />

// ✅ After
<input className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
```

### Pattern 4: Buttons
```jsx
// ❌ Before
<button className="btn btn-primary" onMouseEnter={...} onMouseLeave={...}>

// ✅ After
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
```

---

## Testing After Each Widget

### Functional Test
1. Open browser to `http://localhost:3000/icp`
2. Interact with widget (click buttons, fill inputs, select dropdowns)
3. Verify all functionality works
4. Check browser console for errors
5. Verify API calls succeed (if applicable)

### Visual Test
1. Screenshot current state
2. Compare with assets-app baseline
3. Use DevTools color picker to verify colors
4. Check spacing with ruler tool
5. Test responsive behavior (resize browser)

### Code Quality Test
1. Run TypeScript check: `npm run type-check`
2. Check for build errors: `npm run build`
3. Verify no console warnings
4. Review code for forbidden patterns

---

## Emergency Rollback

If a widget breaks after conversion:

```bash
# 1. Identify the commit
git log --oneline -10

# 2. Revert specific commit
git revert <commit-hash>

# 3. Or reset to before conversion
git reset --hard HEAD~1

# 4. Restore npm dependencies if needed
npm install
```

---

## Agent 3 Workflow Template

**For each widget:**

1. ✅ Read this guide section
2. ✅ Read assets-app reference code
3. ✅ Open modern-platform component
4. ✅ Take "before" screenshot
5. ✅ Make conversions line-by-line
6. ✅ Test functionality
7. ✅ Take "after" screenshot
8. ✅ Compare with baseline
9. ✅ Commit with clear message
10. ✅ Move to next widget

**Commit Message Format:**
```
[Widget] Convert [WidgetName] to Tailwind classes

- Remove CSS variables from inline styles
- Replace custom classes with Tailwind utilities
- Update buttons to use CSS hover
- Verified functionality intact
- Visual parity: [X]%
```

---

**Document Status:** Complete - Ready for Agent 3 Execution
**Last Updated:** 2025-11-04
**Owner:** Agent 1 (Senior Product Designer)
