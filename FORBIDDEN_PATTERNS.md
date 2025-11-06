# Forbidden Patterns: What NOT to Do
**Critical Reference for All Agents**
**Date:** 2025-11-04

---

## ⚠️ Critical Rules

1. **NEVER use CSS variables in inline styles**
2. **NEVER create custom CSS classes for styling**
3. **NEVER manage hover/focus states with JavaScript**
4. **NEVER use AnimatePresence for simple rendering**
5. **NEVER use rem values for typography (use pixels)**
6. **NEVER deviate from assets-app visual patterns**
7. **NEVER break existing functionality for visual changes**

---

## ❌ Pattern 1: CSS Variables in Inline Styles

### Why This is Forbidden
- **Performance:** Runtime CSS variable lookup on every render
- **Debugging:** Hard to trace what actual color is rendered
- **Consistency:** Variables can be overridden unpredictably
- **Tooling:** DevTools shows computed values, not semantic names

### Examples

**❌ WRONG:**
```jsx
<div style={{ backgroundColor: 'var(--color-surface)' }}>
  Content
</div>
```

**❌ WRONG:**
```jsx
<div style={{
  backgroundColor: 'var(--color-background-tertiary)',
  borderColor: 'var(--color-border)',
  color: 'var(--text-primary)'
}}>
  Content
</div>
```

**✅ CORRECT:**
```jsx
<div className="bg-gray-900 border border-gray-800 text-white">
  Content
</div>
```

### Where This Appears
- `ProductDetailsWidget.tsx` lines 651-687
- `TechnicalTranslationPanel.tsx` (multiple locations)
- All widget components using `style={{ backgroundColor: 'var(...' }}`

---

## ❌ Pattern 2: Custom CSS Classes

### Why This is Forbidden
- **Lookup:** Requires jumping to CSS file to understand styling
- **Specificity:** CSS cascade can override unexpectedly
- **Portability:** Components aren't self-contained
- **Tailwind:** Defeats purpose of utility-first framework

### Examples

**❌ WRONG:**
```jsx
<div className="card-executive">
  <h3 className="heading-3">Title</h3>
  <p className="body-small">Description</p>
</div>
```

**❌ WRONG:**
```jsx
<button className="btn btn-primary">
  Action
</button>
```

**❌ WRONG:**
```jsx
<input className="input-primary" />
```

**✅ CORRECT:**
```jsx
<div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
  <h3 className="text-lg font-semibold text-white">Title</h3>
  <p className="text-xs text-gray-400">Description</p>
</div>
```

**✅ CORRECT:**
```jsx
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
  Action
</button>
```

**✅ CORRECT:**
```jsx
<input className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
```

### Where to Find These
- `component-patterns.css` - entire file should be deprecated
- `design-tokens.css` - CSS variables should be reference only
- All components importing these styles

### Exception
- **Allowed:** Semantic layout classes that don't define styling
  - Example: `className="prose"` (typography plugin)
  - Example: `className="container"` (if only sets max-width/centering)

---

## ❌ Pattern 3: JavaScript Hover/Focus Management

### Why This is Forbidden
- **Performance:** State updates cause re-renders on every hover
- **Accessibility:** CSS :hover/:focus works with keyboard/screen readers
- **Complexity:** 10+ lines of code vs 1 Tailwind class
- **Maintainability:** Hard to debug event handler chains

### Examples

**❌ WRONG:**
```jsx
const [isHovered, setIsHovered] = useState(false);

<button
  style={{
    backgroundColor: isHovered ? 'var(--color-hover)' : 'var(--color-surface)'
  }}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  Button
</button>
```

**❌ WRONG:**
```jsx
<button
  onMouseEnter={(e) => {
    (e.target as HTMLElement).style.backgroundColor = 'var(--color-surface-hover)'
  }}
  onMouseLeave={(e) => {
    (e.target as HTMLElement).style.backgroundColor = 'var(--color-surface)'
  }}
>
  Button
</button>
```

**❌ WRONG:**
```jsx
const [focusedInput, setFocusedInput] = useState<string | null>(null);

<input
  style={{
    borderColor: focusedInput === 'email' ? 'var(--color-focus)' : 'var(--color-border)'
  }}
  onFocus={() => setFocusedInput('email')}
  onBlur={() => setFocusedInput(null)}
/>
```

**✅ CORRECT:**
```jsx
<button className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200">
  Button
</button>
```

**✅ CORRECT:**
```jsx
<input className="border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500" />
```

### Where This Appears
- `ProductDetailsWidget.tsx` lines 705-732
- Any component with `onMouseEnter`/`onMouseLeave` for styling
- Any component with `useState` for hover/focus tracking

### Exception
- **Allowed:** JavaScript hover for complex logic (tooltips, dropdowns)
  - Example: Showing/hiding tooltip content
  - Example: Managing dropdown open/close state
- **Not Allowed:** JavaScript hover for simple style changes

---

## ❌ Pattern 4: AnimatePresence for Simple Rendering

### Why This is Forbidden
- **Performance:** Adds 300-500ms delay to simple renders
- **Complexity:** 15+ lines for what should be 1 line
- **Dependencies:** Requires Framer Motion bundle size
- **UX:** Users expect instant widget changes, not fade animations

### Examples

**❌ WRONG:**
```jsx
<AnimatePresence mode="wait">
  <motion.div
    key={widget.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Widget />
  </motion.div>
</AnimatePresence>
```

**❌ WRONG:**
```jsx
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

**✅ CORRECT:**
```jsx
{activeWidget && <Widget />}
```

**✅ CORRECT:**
```jsx
{isVisible && <div>Content</div>}
```

### Where This Appears
- `app/icp/page.tsx` lines 500-528
- Any component wrapping simple renders in motion.div

### Exception
- **Allowed:** AnimatePresence for complex UI transitions
  - Example: Modal entry/exit
  - Example: Multi-step form wizard
  - Example: Slideshow/carousel
- **Not Allowed:** Simple show/hide, widget switching, tab navigation

---

## ❌ Pattern 5: Rem Values in Typography

### Why This is Forbidden
- **Inconsistency:** Browser font size settings cause unpredictable sizing
- **Assets-App:** Uses pixels for precise control
- **Dark Mode:** Requires pixel-perfect contrast ratios
- **Testing:** Hard to verify exact sizes across browsers

### Examples

**❌ WRONG (Current tailwind.config.ts):**
```typescript
fontSize: {
  'xs': ['0.75rem', { lineHeight: '1.5' }],      // 12px
  'sm': ['0.875rem', { lineHeight: '1.5' }],     // 14px
  'base': ['1rem', { lineHeight: '1.5' }],       // 16px
}
```

**✅ CORRECT (Assets-app pattern):**
```typescript
fontSize: {
  'xs': ['11px', { lineHeight: '1.5' }],
  'sm': ['13px', { lineHeight: '1.5' }],
  'base': ['15px', { lineHeight: '1.5' }],
}
```

### Where to Fix
- `tailwind.config.ts` lines 90-98
- Optional in Phase 1, required in Phase 2 for 100% parity

### Exception
- **Allowed:** Rem for spacing/layout (less critical than typography)
- **Not Allowed:** Rem for font sizes, line heights

---

## ❌ Pattern 6: Deviating from Assets-App

### Why This is Forbidden
- **Goal:** User explicitly wants "EXACT SAME" appearance
- **Reference:** Assets-app is the source of truth
- **Testing:** Any deviation fails parity check
- **Trust:** User has proven assets-app looks better

### Examples

**❌ WRONG:**
```jsx
// "Improving" on assets-app design
<div className="bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl">
  {/* Fancy gradient not in assets-app */}
</div>
```

**❌ WRONG:**
```jsx
// "Better" spacing than assets-app
<div className="p-8">  {/* Assets-app uses p-6 */}
  Content
</div>
```

**❌ WRONG:**
```jsx
// "Modern" animations not in assets-app
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Button
</motion.div>
```

**✅ CORRECT:**
```jsx
// Exact match to assets-app SimplifiedICP.jsx:612-620
<div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
  <div className="flex items-center gap-3 mb-4">
    <Icon className="w-5 h-5 text-blue-400" />
    <div>
      <h3 className="text-lg font-semibold text-white">Title</h3>
      <p className="text-gray-400 text-sm">Description</p>
    </div>
  </div>
</div>
```

### Process
1. Find equivalent in assets-app
2. Copy class pattern exactly
3. Adjust only for component-specific content
4. Get Agent 1 approval if unsure

---

## ❌ Pattern 7: Breaking Functionality for Visuals

### Why This is Forbidden
- **User Constraint:** "existing functionality must be barely disrupted/untouched"
- **Risk:** Visual fixes that break forms, API calls, data flow
- **Priority:** Preserve logic > Improve visuals
- **Rollback:** Functional regressions require immediate revert

### Examples

**❌ WRONG:**
```jsx
// Removing controlled component for simpler styling
<input
  value={inputValue}  // ❌ REMOVED
  onChange={handleChange}  // ❌ REMOVED
  className="bg-gray-700 text-white"
/>
```

**❌ WRONG:**
```jsx
// Removing API hook because loading state is complex
// ❌ REMOVED: const { data, loading } = useProductData();
<div className="bg-gray-900">
  {/* Hardcoded data instead of API data */}
</div>
```

**❌ WRONG:**
```jsx
// Changing component structure breaks parent's ref
<div>  {/* ❌ Should be forwardRef */}
  Content
</div>
```

**✅ CORRECT:**
```jsx
// Keep ALL functionality, only change styling
<input
  value={inputValue}  // ✅ PRESERVED
  onChange={handleChange}  // ✅ PRESERVED
  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
/>
```

**✅ CORRECT:**
```jsx
// Keep API hooks, style loading states
const { data, loading } = useProductData();  // ✅ PRESERVED

return (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
    {loading ? (
      <div className="text-gray-400">Loading...</div>
    ) : (
      <div>{data?.content}</div>
    )}
  </div>
);
```

### Testing Checklist
- [ ] All form submissions still work
- [ ] All API calls still execute
- [ ] All button click handlers fire
- [ ] All validation logic runs
- [ ] All data transformations apply
- [ ] No TypeScript errors introduced
- [ ] No console errors appear

---

## ❌ Pattern 8: Over-Complex Layouts

### Why This is Forbidden
- **Assets-App:** Uses single-column with tabs
- **Modern-Platform:** Over-engineered two-column grid
- **UX:** Tabs provide clearer navigation than side-by-side
- **Responsive:** Single column works better on mobile

### Examples

**❌ WRONG (app/icp/page.tsx:500-528):**
```jsx
<div className="mb-8 grid grid-cols-1 md:grid-cols-[30fr_70fr] gap-6">
  <div className="space-y-6">
    <AnimatePresence mode="wait">
      {leftColumnWidget && (
        <motion.div key={leftColumnWidget.id}>
          {leftColumnWidget.available ? (
            <leftColumnWidget.component />
          ) : (
            <PlaceholderCard />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  <div className="space-y-6">
    {/* Right column */}
  </div>
</div>
```

**✅ CORRECT (Assets-app pattern):**
```jsx
<div className="space-y-6">
  {activeTab === 'overview' && <OverviewWidget />}
  {activeTab === 'personas' && <PersonasWidget />}
  {activeTab === 'translator' && <TranslatorWidget />}
</div>
```

### Where to Fix
- `app/icp/page.tsx` lines 500-528
- Phase 1: Foundation Fixes

---

## ❌ Pattern 9: Placeholder Widgets

### Why This is Forbidden
- **User Goal:** Show functional widgets like assets-app
- **Current State:** Components exist but marked unavailable
- **Fix:** Set `available: true`, import components
- **Test:** Verify each widget renders correctly

### Examples

**❌ WRONG (app/icp/page.tsx:82-86):**
```jsx
{
  id: 'translator',
  title: 'Technical Translator',
  available: false,  // ❌ Widget exists but hidden
  // No component prop
}
```

**❌ WRONG (Placeholder rendering):**
```jsx
{!widget.available && (
  <div className="card-executive text-center">
    <p>🚧 This widget is currently under development</p>
  </div>
)}
```

**✅ CORRECT:**
```jsx
{
  id: 'translator',
  title: 'Technical Translator',
  available: true,  // ✅ Enable widget
  component: TechnicalTranslationPanel  // ✅ Import actual component
}
```

### Where to Fix
- `app/icp/page.tsx` - Set all widgets to `available: true`
- Import all widget components
- Remove placeholder rendering logic

---

## ⚠️ Edge Cases That ARE Allowed

### 1. Conditional Logic Styling
```jsx
// ✅ ALLOWED - Conditional classes for state
<div className={`${isActive ? 'bg-blue-500' : 'bg-gray-700'}`}>
```

### 2. Dynamic Content
```jsx
// ✅ ALLOWED - Content-driven styling
<div className={`${hasError ? 'border-red-500' : 'border-gray-600'}`}>
```

### 3. Computed Values
```jsx
// ✅ ALLOWED - Math-driven inline styles
<div style={{ width: `${percentage}%` }}>
```

### 4. Third-Party Components
```jsx
// ✅ ALLOWED - Library components we don't control
<ReactSelect styles={customStyles} />
```

---

## Enforcement

### Agent Responsibilities

**Agent 1 (Senior Product Designer):**
- Review all PRs for forbidden patterns
- Reject any deviations from assets-app
- Approve styling decisions

**Agent 2 (Frontend Architect):**
- Ensure functionality is preserved
- Review component structure changes
- Validate data flow integrity

**Agent 3 (Design Systems Engineer):**
- Execute conversions per spec
- Flag any edge cases
- Document pattern decisions

**Agent 4 (QA Specialist):**
- Test for functional regressions
- Verify visual parity
- Report forbidden pattern usage

### Immediate Rollback If:
- Functional regression detected
- Forbidden pattern merged
- Visual quality degrades from assets-app
- TypeScript/runtime errors introduced

---

## Quick Reference: Red Flags in Code Review

```jsx
// 🚩 RED FLAG: CSS variables
style={{ backgroundColor: 'var(--'

// 🚩 RED FLAG: Custom classes
className="card-executive"
className="heading-3"
className="btn btn-primary"

// 🚩 RED FLAG: JavaScript hover
onMouseEnter={(e) =>
onMouseLeave={(e) =>
const [isHovered, setIsHovered] = useState

// 🚩 RED FLAG: Unnecessary animations
<AnimatePresence mode="wait">
<motion.div key={

// 🚩 RED FLAG: Rem typography
fontSize: ['0.875rem'

// 🚩 RED FLAG: Deviating from assets-app
// Check: Does this match SimplifiedICP.jsx?

// 🚩 RED FLAG: Removing functionality
// Missing: useContext, useState, useEffect hooks
// Missing: onChange, onSubmit handlers
```

---

**Document Status:** Complete - Enforce in All Reviews
**Last Updated:** 2025-11-04
**Owner:** Agent 1 (Senior Product Designer)
