# Tailwind Class Mapping: Modern-Platform → Assets-App Parity
**Quick Reference for Agent 3 (Design Systems Engineer)**
**Date:** 2025-11-04

---

## Color Replacements

### Background Colors

| ❌ REMOVE | ✅ USE INSTEAD |
|-----------|---------------|
| `style={{ backgroundColor: 'var(--color-background-primary)' }}` | `className="bg-[#0a0a0a]"` or `bg-black` |
| `style={{ backgroundColor: 'var(--color-background-secondary)' }}` | `className="bg-gray-900"` |
| `style={{ backgroundColor: 'var(--color-surface)' }}` | `className="bg-gray-900"` |
| `style={{ backgroundColor: 'var(--color-surface-hover)' }}` | `className="hover:bg-gray-800"` |
| `className="card-executive"` | `className="bg-gray-900 border border-gray-800 rounded-xl p-6"` |

### Text Colors

| ❌ REMOVE | ✅ USE INSTEAD |
|-----------|---------------|
| `style={{ color: 'var(--text-primary)' }}` | `className="text-white"` |
| `style={{ color: 'var(--text-secondary)' }}` | `className="text-gray-200"` |
| `style={{ color: 'var(--text-muted)' }}` | `className="text-gray-400"` |
| `style={{ color: 'var(--color-primary)' }}` | `className="text-blue-500"` |
| `className="body-default"` | `className="text-sm text-gray-200"` |

### Border Colors

| ❌ REMOVE | ✅ USE INSTEAD |
|-----------|---------------|
| `border-transparent` | `border-gray-800` |
| `style={{ borderColor: 'var(--color-border)' }}` | `className="border-gray-800"` |

---

## Typography Replacements

### Heading Classes

| ❌ REMOVE | ✅ USE INSTEAD |
|-----------|---------------|
| `className="heading-1"` | `className="text-3xl font-bold text-white"` |
| `className="heading-2"` | `className="text-2xl font-semibold text-white"` |
| `className="heading-3"` | `className="text-lg font-semibold text-white"` |
| `className="heading-4"` | `className="text-base font-semibold text-white"` |

### Body Text Classes

| ❌ REMOVE | ✅ USE INSTEAD |
|-----------|---------------|
| `className="body-default"` | `className="text-sm text-gray-200"` |
| `className="body-small"` | `className="text-xs text-gray-400"` |
| `className="body-large"` | `className="text-base text-gray-200"` |

---

## Button Replacements

### Primary Button

❌ **REMOVE:**
```jsx
<button className="btn btn-primary">
  Action
</button>
```

✅ **USE:**
```jsx
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
  Action
</button>
```

### Secondary Button

❌ **REMOVE:**
```jsx
<button className="btn btn-secondary">
  Cancel
</button>
```

✅ **USE:**
```jsx
<button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
  Cancel
</button>
```

### Ghost Button

❌ **REMOVE:**
```jsx
<button className="btn-ghost">
  More
</button>
```

✅ **USE:**
```jsx
<button className="text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-1.5 rounded-md transition-colors duration-200">
  More
</button>
```

---

## Card Replacements

### Standard Card

❌ **REMOVE:**
```jsx
<div className="card-executive card-padding-lg">
  <h3 className="heading-3">Title</h3>
  <p className="body-small">Description</p>
</div>
```

✅ **USE:**
```jsx
<div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
  <h3 className="text-lg font-semibold text-white">Title</h3>
  <p className="text-xs text-gray-400">Description</p>
</div>
```

### Card with Header

❌ **REMOVE:**
```jsx
<div className="card-executive">
  <div className="card-header">
    <h3 className="heading-3">Title</h3>
  </div>
  <div className="card-body">
    Content
  </div>
</div>
```

✅ **USE:**
```jsx
<div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-800">
    <h3 className="text-lg font-semibold text-white">Title</h3>
  </div>
  <div className="p-6">
    Content
  </div>
</div>
```

---

## Form Element Replacements

### Text Input

❌ **REMOVE:**
```jsx
<input type="text" className="input-primary" />
```

✅ **USE:**
```jsx
<input
  type="text"
  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="Enter value"
/>
```

### Select Dropdown

❌ **REMOVE:**
```jsx
<select className="select-primary">
  <option>Option</option>
</select>
```

✅ **USE:**
```jsx
<select className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
  <option>Option</option>
</select>
```

### Textarea

❌ **REMOVE:**
```jsx
<textarea className="textarea-primary" />
```

✅ **USE:**
```jsx
<textarea className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows="4" />
```

---

## Spacing Replacements

### Padding

| ❌ REMOVE | ✅ USE INSTEAD |
|-----------|---------------|
| `className="card-padding-sm"` | `className="p-3"` (12px) |
| `className="card-padding-md"` | `className="p-4"` (16px) |
| `className="card-padding-lg"` | `className="p-6"` (24px) |

### Margin/Gap

| ❌ REMOVE | ✅ USE INSTEAD |
|-----------|---------------|
| `className="space-compact"` | `className="space-y-2"` (8px) |
| `className="space-normal"` | `className="space-y-4"` (16px) |
| `className="space-relaxed"` | `className="space-y-6"` (24px) |

---

## Layout Replacements

### Container

❌ **REMOVE:**
```jsx
<div className="container-default">
  Content
</div>
```

✅ **USE:**
```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  Content
</div>
```

### Two-Column Grid (AVOID - Use Tabs Instead)

❌ **REMOVE:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-[30fr_70fr] gap-6">
  <div>Left</div>
  <div>Right</div>
</div>
```

✅ **USE:**
```jsx
<div className="space-y-6">
  {/* Single column with tab navigation */}
</div>
```

---

## JavaScript Pattern Replacements

### Hover State Management

❌ **REMOVE:**
```jsx
<button
  style={{ backgroundColor: isHovered ? 'var(--color-hover)' : 'var(--color-surface)' }}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  Button
</button>
```

✅ **USE:**
```jsx
<button className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200">
  Button
</button>
```

### Conditional Styling

❌ **REMOVE:**
```jsx
<div
  style={{
    backgroundColor: isActive ? 'var(--color-active)' : 'var(--color-surface)'
  }}
>
```

✅ **USE:**
```jsx
<div className={`${isActive ? 'bg-blue-500' : 'bg-gray-700'}`}>
```

---

## Icon Sizing

| ❌ REMOVE | ✅ USE INSTEAD |
|-----------|---------------|
| `className="icon-sm"` | `className="w-4 h-4"` (16px) |
| `className="icon-md"` | `className="w-5 h-5"` (20px) |
| `className="icon-lg"` | `className="w-6 h-6"` (24px) |

**Icon Colors:**
- Primary action: `text-blue-400`
- Success: `text-emerald-400`
- Warning: `text-amber-400`
- Danger: `text-red-400`
- Neutral: `text-gray-400`

---

## Animation Replacements

### AnimatePresence (Simple Cases)

❌ **REMOVE:**
```jsx
<AnimatePresence mode="wait">
  <motion.div
    key={widget.id}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <Widget />
  </motion.div>
</AnimatePresence>
```

✅ **USE:**
```jsx
{activeWidget && <Widget />}
```

### Keep AnimatePresence Only For:
- Complex multi-step transitions
- User-expected animations (modals, tooltips)
- NOT for simple widget rendering

---

## Common Conversion Examples

### Example 1: ProductDetailsWidget Header

**BEFORE (Lines 651-657):**
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

**AFTER:**
```jsx
<div className="px-6 py-4 border-b border-gray-800 bg-gray-900">
  <h2 className="text-lg font-semibold text-white">
    My Product Details
  </h2>
</div>
```

### Example 2: Button with Inline Styles

**BEFORE:**
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

**AFTER:**
```jsx
<button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
  Save
</button>
```

### Example 3: Card with Custom Classes

**BEFORE:**
```jsx
<div className="card-executive card-padding-lg">
  <div className="card-header">
    <h3 className="heading-3">Title</h3>
    <p className="body-small">Description</p>
  </div>
</div>
```

**AFTER:**
```jsx
<div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
  <div className="flex items-center gap-3 mb-4">
    <h3 className="text-lg font-semibold text-white">Title</h3>
  </div>
  <p className="text-xs text-gray-400">Description</p>
</div>
```

---

## Quick Search & Replace Patterns

Use these patterns for bulk conversions (with caution - review each):

```bash
# Background colors
style={{ backgroundColor: 'var(--color-surface)' }}  →  className="bg-gray-900"
style={{ backgroundColor: 'var(--color-background-primary)' }}  →  className="bg-[#0a0a0a]"

# Text colors
style={{ color: 'var(--text-primary)' }}  →  className="text-white"
style={{ color: 'var(--text-secondary)' }}  →  className="text-gray-200"
style={{ color: 'var(--text-muted)' }}  →  className="text-gray-400"

# Borders
border-transparent  →  border-gray-800

# Classes
className="heading-3"  →  className="text-lg font-semibold text-white"
className="body-default"  →  className="text-sm text-gray-200"
className="card-executive"  →  className="bg-gray-900 border border-gray-800 rounded-xl"
```

---

## Validation Checklist

After each conversion, verify:
- [ ] No `style={{` attributes remain (except edge cases approved by Agent 1)
- [ ] No `var(--` CSS variable references
- [ ] No custom classes from `component-patterns.css`
- [ ] All colors match assets-app (use DevTools color picker)
- [ ] Hover states work with CSS (not JavaScript)
- [ ] Component still functions correctly (no broken logic)

---

**Next Steps:**
1. Start with ProductDetailsWidget.tsx
2. Use this mapping for systematic conversion
3. Test each component after conversion
4. Screenshot before/after for Agent 4 verification
5. Commit each widget separately for easy rollback

**Document Status:** Complete
**Last Updated:** 2025-11-04
**Owner:** Agent 1 (Senior Product Designer)
