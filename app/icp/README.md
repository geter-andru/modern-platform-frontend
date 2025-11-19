# ICP v3 - Modern Architecture Implementation

**Created:** 2025-11-04
**Status:** Day 1 Foundation Complete ✅
**URL:** `/icp-v3`

## Overview

ICP v3 is a complete rearchitecture of the ICP Analysis page using modern layout patterns while preserving all existing widget functionality.

## Architecture Pattern

**Layout:** Sidebar + Single Content Area
**Navigation:** Left sidebar with tool links, progress tracker, quick actions
**Content:** Single widget display with URL-based routing

### Key Principles

1. **Preserve Functionality:** All existing widgets work exactly as-is
2. **Wrapper Architecture:** New layout components wrap existing widgets unchanged
3. **Direct Tailwind Only:** No CSS variables, no custom CSS classes
4. **No Animations:** No motion.div, AnimatePresence per FORBIDDEN_PATTERNS.md

## Directory Structure

```
app/icp-v3/
├── page.tsx                   # Main page with widget routing
├── components/
│   ├── LeftSidebar.tsx       # Navigation + progress + quick actions
│   └── PageLayout.tsx        # Flex layout wrapper
└── README.md                  # This file
```

## Components

### LeftSidebar.tsx (186 lines)

**Features:**
- Navigation menu for 6 ICP tools
- Progress tracker section (placeholder - 45% completion)
- Quick actions section (Export ICP, Start Guided Tour)

**Styling:**
- Width: `w-64` (256px fixed)
- Background: `bg-gray-900`
- Border: `border-r border-gray-800`
- Active state: `bg-blue-600 text-white`

**Props:**
- `activeWidget: string` - Current active widget ID
- `onNavigate: (widgetId: string) => void` - Navigation handler

### PageLayout.tsx (28 lines)

**Features:**
- Simple flex container
- Sidebar + main content area
- Max-width content container

**Styling:**
- Container: `flex min-h-screen bg-black`
- Main: `flex-1 overflow-x-hidden`
- Content: `max-w-7xl mx-auto p-8`

**Props:**
- `sidebar: React.ReactNode` - Sidebar component
- `children: React.ReactNode` - Main content

### page.tsx (185 lines)

**Features:**
- Imports all 6 existing widgets
- URL parameter-based routing (`?widget=translator`)
- Auth integration
- Customer/ICP data hooks
- Action tracking

**Widgets Integrated:**
1. `product-details` - ProductDetailsWidget
2. `rating-system` - ICPRatingSystemWidget
3. `personas` - BuyerPersonasWidget
4. `overview` - MyICPOverviewWidget
5. `rate-company` - RateCompanyWidget
6. `translator` - TechnicalTranslationWidget

## Widget Import Pattern

All widgets imported from:
```typescript
import WidgetName from '@/src/features/icp-analysis/widgets/WidgetName';
```

## Routing Pattern

```typescript
// URL: /icp-v3?widget=translator
// Renders: <TechnicalTranslationWidget className="w-full" />

{activeWidget === 'translator' && (
  <TechnicalTranslationWidget className="w-full" />
)}
```

## Color Palette

**Background:**
- Page: `bg-black` (#000000)
- Sidebar: `bg-gray-900` (#111111)
- Cards: `bg-gray-800` (#1f2937)

**Borders:**
- Primary: `border-gray-800` (#1f2937)
- Secondary: `border-gray-700` (#374151)

**Accent:**
- Primary: `bg-blue-600` (#2563eb)
- Hover: `hover:bg-blue-700`

**Text:**
- Primary: `text-white`
- Secondary: `text-gray-300`
- Tertiary: `text-gray-400`

## Success Criteria (Day 1)

✅ Sidebar renders with navigation, progress placeholder, quick actions
✅ Page loads at `/icp-v3` without errors
✅ All 6 widgets importable and render when selected
✅ Tab navigation works (URL params update)
✅ NO console errors for webpack/import issues
✅ 100% Tailwind classes (no CSS variables, no custom classes)

## Next Steps (Day 2+)

- [ ] Build GrowthStageGuidanceBanner component
- [ ] Build ScoringFrameworkSection component
- [ ] Build ImplementationTipsSection component
- [ ] Build StakeholderArsenalWidget component
- [ ] Add real progress tracking logic
- [ ] Add real quick actions functionality
- [ ] Agent 3: Style all components to match assets-app theme

## Testing

**Manual Test Checklist:**
1. Navigate to `/icp-v3` - Should load without errors
2. Click each sidebar link - Widget should render
3. Use URL params - `?widget=personas` should navigate
4. Check browser console - No webpack errors
5. Verify auth redirect - Should redirect to `/auth` if not logged in

## Technical Notes

- **Auth:** Uses `useRequireAuth()` hook
- **Data Fetching:** TanStack Query via `useCustomer()` and `useCustomerICP()`
- **Analytics:** Action tracking via `useTrackAction()`
- **Type Safety:** Full TypeScript with strict mode
- **Next.js:** App Router with 'use client' components

## Known Issues

None - Day 1 foundation complete with no errors.

## References

- FORBIDDEN_PATTERNS.md - Styling constraints
- DESIGN_SPEC.md - Card and component patterns
- app/icp-refactored/page.tsx - Original implementation reference
