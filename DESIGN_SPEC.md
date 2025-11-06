# Design System Specification: Assets-App Parity
**Agent 1 - Senior Product Designer**
**Date:** 2025-11-04
**Status:** Foundation Document - Phase 0
**Target:** 100% visual and functional parity with assets-app

---

## Critical Constraint
**MAINTAIN EXISTING FUNCTIONALITY** - All fixes must preserve current behavior. This is a visual-only migration.

---

## 1. Color System (CORRECTED)

### Background Colors
```typescript
// WRONG (Current modern-platform)
background: {
  primary: '#1a1a1a',    // ❌ Too light - 160% less contrast
  secondary: '#121212',
  tertiary: '#111111',
  elevated: '#222222',
}

// CORRECT (Assets-app - Source of Truth)
background: {
  primary: '#0a0a0a',    // ✅ Deep black - maximum depth
  secondary: '#111111',  // ✅ Subtle elevation
  tertiary: '#1a1a1a',   // ✅ Higher elevation
  elevated: '#222222',   // ✅ Highest elevation
}
```

**Tailwind Class Mappings:**
- Page background: `bg-black` (pure `#000000`) or `bg-[#0a0a0a]`
- Card background: `bg-gray-900` (`#111111`)
- Card borders: `border-gray-800` (`#1f2937`)
- Elevated surfaces: `bg-gray-800` (`#1f2937`)

### Text Colors
```typescript
// Assets-app Standard
text: {
  primary: '#ffffff',    // Headings, important text
  secondary: '#e5e5e5',  // Body text
  muted: '#a3a3a3',      // Supporting text
  subtle: '#737373',     // Disabled/placeholder
}
```

**Tailwind Class Mappings:**
- Headings: `text-white`
- Body text: `text-gray-200`
- Supporting text: `text-gray-400`
- Disabled: `text-gray-500`

### Brand Colors (Keep Modern-Platform Values)
```typescript
brand: {
  primary: '#3b82f6',    // blue-500 - CTAs, links
  secondary: '#10b981',  // emerald-500 - Success states
  accent: '#8b5cf6',     // violet-500 - Highlights
}
```

**Tailwind Class Mappings:**
- Primary buttons: `bg-blue-500 hover:bg-blue-600`
- Success states: `text-emerald-500`
- Accent elements: `text-violet-500`

---

## 2. Typography System

### Font Sizes (Assets-App Pixel Values)
```javascript
// Source: assets-app/tailwind.config.js
'xs': ['11px', { lineHeight: '1.5' }],     // Small labels
'sm': ['13px', { lineHeight: '1.5' }],     // Body small
'base': ['15px', { lineHeight: '1.5' }],   // Body default
'lg': ['17px', { lineHeight: '1.5' }],     // Subheadings
'xl': ['19px', { lineHeight: '1.25' }],    // Section headers
'2xl': ['23px', { lineHeight: '1.25' }],   // Page headers
'3xl': ['29px', { lineHeight: '1.25' }],   // Hero text
```

**Critical Note:** Assets-app uses PIXELS for precise dark mode rendering. Modern-platform's rem values create inconsistency.

### Font Weights
- Headings: `font-semibold` (600)
- Body: `font-normal` (400)
- Emphasis: `font-medium` (500)

**Tailwind Class Examples:**
```jsx
// Page heading
<h1 className="text-3xl font-bold text-white">

// Section heading
<h2 className="text-lg font-semibold text-white">

// Body text
<p className="text-sm text-gray-400">
```

---

## 3. Spacing System (4px Grid)

### Standard Spacing
```javascript
// Assets-app uses Tailwind defaults (4px base)
padding: {
  1: '4px',    // Tight
  2: '8px',    // Compact
  3: '12px',   // Small
  4: '16px',   // Medium
  6: '24px',   // Large
  8: '32px',   // XL
}
```

**Common Patterns:**
- Card padding: `p-6` (24px)
- Section gaps: `space-y-6` (24px between elements)
- Button padding: `px-4 py-2` (16px horizontal, 8px vertical)
- Page container: `px-4 sm:px-6 lg:px-8` (responsive)

---

## 4. Component Patterns (Assets-App Reference)

### Card Pattern (CANONICAL)
```jsx
// Source: SimplifiedICP.jsx:612-620
<div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
  <div className="flex items-center gap-3 mb-4">
    <IconComponent className="w-5 h-5 text-blue-400" />
    <div>
      <h3 className="text-lg font-semibold text-white">Card Title</h3>
      <p className="text-gray-400 text-sm">Card description</p>
    </div>
  </div>
  <div className="space-y-4">
    {/* Card content */}
  </div>
</div>
```

**Key Elements:**
- Background: `bg-gray-900` (not CSS variables)
- Border: `border border-gray-800` (subtle)
- Rounding: `rounded-xl` (12px)
- Padding: `p-6` (24px all sides)
- Icon size: `w-5 h-5` (20px)
- Icon color: Semantic (blue-400, emerald-400, etc.)

### Button Pattern
```jsx
// Primary button
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg
  font-medium transition-colors duration-200">
  Action
</button>

// Secondary button
<button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg
  font-medium transition-colors duration-200">
  Cancel
</button>

// Ghost button
<button className="text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-1.5
  rounded-md transition-colors duration-200">
  More
</button>
```

### Input Pattern
```jsx
// Source: TechnicalTranslationWidget.jsx:156-159
<input
  type="text"
  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg
    text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2
    focus:ring-blue-500 focus:border-transparent"
  placeholder="Enter value"
/>
```

### Select Pattern
```jsx
<select className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded
  text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
  <option value="">Select option</option>
</select>
```

### Tab Navigation Pattern
```jsx
// Source: SimplifiedICP.jsx:298-308
<div className="border-b border-gray-800">
  <nav className="flex space-x-8">
    {tabs.map(tab => (
      <button
        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
          activeTab === tab.id
            ? 'border-blue-500 text-blue-400'
            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </nav>
</div>
```

---

## 5. Layout Patterns

### Page Container
```jsx
// Source: SimplifiedICP.jsx:257-269
<div className="min-h-screen bg-black">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-white mb-2">Page Title</h1>
    <p className="text-gray-400 mb-8">Page description</p>

    {/* Page content */}
  </div>
</div>
```

**Key Elements:**
- Full height: `min-h-screen`
- Background: `bg-black` (pure black base)
- Container: `max-w-7xl mx-auto` (centered, 1280px max)
- Responsive padding: `px-4 sm:px-6 lg:px-8`
- Vertical spacing: `py-8`

### Widget Grid (AVOID TWO-COLUMN COMPLEXITY)
```jsx
// Assets-app uses SINGLE COLUMN with tabs
// NOT: grid grid-cols-1 md:grid-cols-[30fr_70fr]
// YES: Single column, content switches via tabs

<div className="space-y-6">
  {widgets.map(widget => (
    <WidgetComponent key={widget.id} />
  ))}
</div>
```

---

## 6. FORBIDDEN PATTERNS (Never Use These)

### ❌ CSS Variables in Inline Styles
```jsx
// WRONG - Runtime lookup overhead
<div style={{ backgroundColor: 'var(--color-surface)' }}>

// CORRECT - Direct Tailwind class
<div className="bg-gray-900">
```

### ❌ Custom CSS Classes
```jsx
// WRONG - Requires CSS file lookup
<button className="btn btn-primary">

// CORRECT - Direct Tailwind utilities
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
```

### ❌ Inline Style Hover States
```jsx
// WRONG - JavaScript hover management
<button
  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
  onMouseLeave={(e) => e.target.style.backgroundColor = ''}
>

// CORRECT - Tailwind hover utilities
<button className="bg-gray-700 hover:bg-gray-600">
```

### ❌ AnimatePresence for Simple Rendering
```jsx
// WRONG - Unnecessary animation library
<AnimatePresence mode="wait">
  <motion.div key={widget.id}>
    <Widget />
  </motion.div>
</AnimatePresence>

// CORRECT - Direct rendering
{activeWidget && <Widget />}
```

### ❌ Rem Values in Typography
```jsx
// WRONG - Inconsistent rendering
fontSize: { 'sm': ['0.875rem', { lineHeight: '1.5' }] }

// CORRECT - Pixel-perfect control
fontSize: { 'sm': ['13px', { lineHeight: '1.5' }] }
```

---

## 7. Migration Strategy for Existing Components

### Step-by-Step Process:

**1. Identify Current Pattern**
```jsx
// Current (ProductDetailsWidget.tsx:651)
<div className="px-6 py-4 border-b border-transparent" style={{
  backgroundColor: 'var(--color-background-tertiary)'
}}>
```

**2. Find Assets-App Equivalent**
```jsx
// Reference (SimplifiedICP.jsx:612)
<div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
```

**3. Apply Direct Conversion**
```jsx
// Converted
<div className="px-6 py-4 border-b border-gray-800 bg-gray-900">
```

**4. Test Visual Parity**
- Screenshot before/after
- Compare with assets-app reference
- Verify no functionality changes

---

## 8. Component-Specific Specifications

### Product Details Widget
**Reference:** `/Users/geter/andru/archive/archived-hs-projects/assets-app/src/components/simplified/cards/ProductDetailsWidget.jsx`

**Current Issues:**
- Lines 651-687: Inline styles with CSS variables
- Lines 705-732: JavaScript hover state management
- Missing: Direct Tailwind utility classes

**Required Changes:**
```jsx
// Header section
<div className="px-6 py-4 border-b border-gray-800 bg-gray-900">
  <h2 className="text-lg font-semibold text-white">My Product Details</h2>
</div>

// Form section
<div className="p-6 space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      Product Name
    </label>
    <input
      type="text"
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg
        text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2
        focus:ring-blue-500"
      placeholder="Enter product name"
    />
  </div>
</div>

// Button section
<div className="px-6 py-4 border-t border-gray-800 bg-gray-900 flex justify-end gap-3">
  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg
    font-medium transition-colors duration-200">
    Cancel
  </button>
  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg
    font-medium transition-colors duration-200">
    Save
  </button>
</div>
```

### Technical Translation Panel
**Reference:** `/Users/geter/andru/archive/archived-hs-projects/assets-app/src/components/simplified/cards/TechnicalTranslationWidget.jsx`

**Current Issues:**
- Widget exists but marked `available: false` in page.tsx:85
- Not integrated into ICP page

**Required Changes:**
1. In `/app/icp/page.tsx` line 85: Change `available: false` to `available: true`
2. Import component: `import { TechnicalTranslationPanel } from '@/features/icp-analysis/widgets/TechnicalTranslationPanel'`
3. Add to widgets array: `component: TechnicalTranslationPanel`
4. Update panel styling to match assets-app card pattern

---

## 9. Quality Checklist (Agent 4 Verification)

### Visual Parity Check
- [ ] Background color matches: `#0a0a0a` vs `#1a1a1a`
- [ ] Card backgrounds: `#111111` (gray-900)
- [ ] Card borders: `#1f2937` (gray-800)
- [ ] Text colors: White headings, gray-200 body
- [ ] Font sizes: Pixel-perfect match to assets-app
- [ ] Spacing: 4px grid alignment
- [ ] Border radius: Consistent (rounded-xl = 12px)

### Functionality Check
- [ ] All form inputs functional
- [ ] Button click handlers preserved
- [ ] Data flow unchanged (API hooks still work)
- [ ] Context values still accessible
- [ ] No console errors
- [ ] No TypeScript errors

### Performance Check
- [ ] No CSS variable runtime lookups
- [ ] Direct Tailwind class compilation
- [ ] Hover states use CSS (not JavaScript)
- [ ] No unnecessary AnimatePresence delays
- [ ] Fast page load times

---

## 10. File-by-File Change Log

### Phase 1 (Foundation) - Agent 2 & 3

**File:** `tailwind.config.ts`
- **Line 16:** Change `'#1a1a1a'` to `'#0a0a0a'`
- **Lines 90-98:** Convert rem to pixels (optional - Phase 2)

**File:** `src/shared/styles/design-tokens.css`
- **Line 55:** Change `--bg-primary: #1a1a1a` to `--bg-primary: #0a0a0a`
- **Note:** This file may be deprecated after full migration to Tailwind

**File:** `app/icp/page.tsx`
- **Line 85:** Change `available: false` to `available: true` (Technical Translator)
- **Lines 500-528:** Simplify two-column grid to single column with tabs
- **Lines 524-543:** Remove placeholder rendering logic

### Phase 2 (Component Parity) - Agent 3

**File:** `src/features/icp-analysis/widgets/ProductDetailsWidget.tsx`
- **Lines 651-687:** Replace inline styles with Tailwind classes
- **Lines 705-732:** Replace JavaScript hover with CSS hover classes
- **All occurrences:** Remove `style={{ backgroundColor: 'var(...)' }}`

**File:** `src/features/icp-analysis/widgets/TechnicalTranslationPanel.tsx`
- **Review entire file:** Ensure matches assets-app styling
- **Add:** Direct Tailwind classes for all elements

**File:** Other widget files (MyICPOverview, BuyerPersonas, etc.)
- **Pattern:** Apply same conversion methodology
- **Reference:** Assets-app equivalent components

---

## 11. Success Metrics

### Quantitative
- **Visual Parity Score:** 30% → 100%
- **CSS Variable Usage:** 127 instances → 0 instances
- **Page Load Time:** Maintain or improve current speed
- **TypeScript Errors:** 0 (maintained)
- **Runtime Errors:** 0 (maintained)

### Qualitative
- Agent 1 (Designer) sign-off on visual quality
- Agent 4 (QA) confirmation of functionality preservation
- Side-by-side comparison indistinguishable from assets-app

---

## 12. Rollback Plan

**If any phase introduces regressions:**

1. **Git Revert:** Each phase committed separately
2. **Feature Flag:** Changes behind conditional logic
3. **Incremental:** Single component at a time
4. **Review Gate:** Agent 1 + Agent 4 approval before merge

---

## Next Actions

**Agent 2 (Frontend Architect):**
- Review this spec for structural concerns
- Plan widget integration strategy
- Document data flow preservation approach

**Agent 3 (Design Systems Engineer):**
- Begin Phase 1 foundation fixes
- Create TAILWIND_CLASS_MAPPING.md reference
- Start ProductDetailsWidget conversion

**Agent 4 (QA Specialist):**
- Capture baseline screenshots (both apps, all widgets)
- Set up visual regression testing
- Create parity scoring system

---

**Document Status:** Complete - Ready for Phase 1 Execution
**Last Updated:** 2025-11-04
**Owner:** Agent 1 (Senior Product Designer)
