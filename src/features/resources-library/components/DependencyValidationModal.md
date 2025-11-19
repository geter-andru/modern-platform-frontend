# DependencyValidationModal

Professional React component for validating resource generation dependencies in the H&S Revenue Intelligence Platform.

## Purpose

Validates that all required dependencies exist before allowing resource generation. Displays missing dependencies, estimated costs, and recommended generation order to guide users through the dependency tree.

## Features

- ✅ Real-time dependency validation via API (`/api/dependencies/validate`)
- ✅ Visual dependency tree with tier indicators
- ✅ Cost estimation (tokens + dollars) for each dependency
- ✅ Recommended generation order based on tier hierarchy
- ✅ One-click dependency generation
- ✅ Batch generation of all missing dependencies
- ✅ Cache status indicators (shows if validation was cached)
- ✅ Loading, error, and success states
- ✅ Keyboard navigation (ESC to close)
- ✅ Animated entrance/exit transitions
- ✅ Accessible (ARIA labels, focus management)

## Usage

### Basic Usage

```tsx
import { DependencyValidationModal } from '@/features/resources-library/components';

function ResourceCard({ resourceId, resourceName }) {
  const [showValidation, setShowValidation] = useState(false);

  return (
    <>
      <button onClick={() => setShowValidation(true)}>
        Generate {resourceName}
      </button>

      <DependencyValidationModal
        isOpen={showValidation}
        onClose={() => setShowValidation(false)}
        resourceId={resourceId}
        resourceName={resourceName}
      />
    </>
  );
}
```

### With Dependency Generation Handlers

```tsx
import { DependencyValidationModal } from '@/features/resources-library/components';

function ResourceLibrary() {
  const [validationState, setValidationState] = useState({
    isOpen: false,
    resourceId: '',
    resourceName: ''
  });

  const handleGenerateDependency = async (resourceId: string) => {
    // Navigate to dependency generation or trigger generation workflow
    router.push(`/resources/generate/${resourceId}`);
  };

  const handleGenerateAll = async (resourceIds: string[]) => {
    // Trigger batch generation workflow
    for (const id of resourceIds) {
      await generateResource(id);
    }
  };

  return (
    <DependencyValidationModal
      isOpen={validationState.isOpen}
      onClose={() => setValidationState({ isOpen: false, resourceId: '', resourceName: '' })}
      resourceId={validationState.resourceId}
      resourceName={validationState.resourceName}
      onGenerateDependency={handleGenerateDependency}
      onGenerateAll={handleGenerateAll}
    />
  );
}
```

### Advanced: Pre-validation Before Showing Modal

```tsx
import { DependencyValidationModal } from '@/features/resources-library/components';

function SmartResourceGenerator() {
  const [validation, setValidation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleValidateAndGenerate = async (resourceId: string, resourceName: string) => {
    // Pre-validate
    const response = await fetch('/api/dependencies/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId })
    });

    const { validation } = await response.json();

    if (validation.valid) {
      // All dependencies met - proceed directly to generation
      await generateResource(resourceId);
    } else {
      // Show dependency modal to user
      setValidation(validation);
      setShowModal(true);
    }
  };

  return (
    <DependencyValidationModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      resourceId={validation?.resourceId || ''}
      resourceName={validation?.resourceName || ''}
      onGenerateDependency={handleGenerateDependency}
      onGenerateAll={handleGenerateAll}
    />
  );
}
```

## Props

### DependencyValidationModalProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Controls modal visibility |
| `onClose` | `() => void` | Yes | Callback when modal is closed |
| `resourceId` | `string` | Yes | ID of resource to validate (e.g., `"sales-slide-deck"`) |
| `resourceName` | `string` | Yes | Display name of resource (e.g., `"Sales Slide Deck"`) |
| `onGenerateDependency` | `(resourceId: string) => void` | No | Callback when user clicks "Generate" on a single dependency |
| `onGenerateAll` | `(resourceIds: string[]) => void` | No | Callback when user clicks "Generate All" for batch generation |

## API Integration

### Endpoint: `/api/dependencies/validate`

**Request:**
```json
{
  "resourceId": "sales-slide-deck"
}
```

**Response (Valid):**
```json
{
  "success": true,
  "validation": {
    "valid": true,
    "resourceId": "sales-slide-deck",
    "resourceName": "Sales Slide Deck",
    "missingDependencies": [],
    "estimatedCost": 0.0045,
    "estimatedTokens": 1500,
    "suggestedOrder": [],
    "cacheStatus": {
      "cached": true,
      "cacheAge": 12
    }
  }
}
```

**Response (Invalid - Missing Dependencies):**
```json
{
  "success": true,
  "validation": {
    "valid": false,
    "resourceId": "sales-slide-deck",
    "resourceName": "Sales Slide Deck",
    "missingDependencies": [
      {
        "resourceId": "value-messaging",
        "resourceName": "Value Messaging",
        "tier": 1,
        "estimatedCost": 0.0030,
        "estimatedTokens": 1000
      },
      {
        "resourceId": "icp-analysis",
        "resourceName": "ICP Analysis",
        "tier": 1,
        "estimatedCost": 0.0045,
        "estimatedTokens": 1500
      }
    ],
    "estimatedCost": 0.012,
    "estimatedTokens": 4000,
    "suggestedOrder": [
      {
        "resourceId": "icp-analysis",
        "resourceName": "ICP Analysis",
        "tier": 1,
        "reason": "Foundation resource - required by multiple dependencies"
      },
      {
        "resourceId": "value-messaging",
        "resourceName": "Value Messaging",
        "tier": 1,
        "reason": "Direct dependency of target resource"
      },
      {
        "resourceId": "sales-slide-deck",
        "resourceName": "Sales Slide Deck",
        "tier": 3,
        "reason": "Target resource"
      }
    ],
    "cacheStatus": {
      "cached": false
    }
  }
}
```

## Visual States

### 1. Loading State
- Centered spinner with "Validating dependencies..." message
- Shown immediately when modal opens while fetching validation

### 2. Error State
- Red alert box with error message
- "Retry Validation" button
- Displays API errors or network failures

### 3. Success State (All Dependencies Met)
- Green success box with "Ready to Generate" message
- Shows estimated cost and tokens
- "Continue to Generation" button
- Cache status indicator (if cached)

### 4. Missing Dependencies State
- Yellow warning box with count of missing dependencies
- List of required resources with:
  - Tier indicator
  - Resource name
  - Cost estimate ($ and tokens)
  - "Generate" button (if `onGenerateDependency` provided)
- Recommended generation order section
- Total cost summary
- "Generate All" button (if `onGenerateAll` provided)

## Styling

Uses the platform's design system:
- Dark theme (`bg-black/90`, `bg-gray-800`, etc.)
- Backdrop blur effect
- Animated transitions (Framer Motion)
- Responsive layout
- Border styling (`border-gray-700`, `border-white/10`)
- Color-coded states (green=success, yellow=warning, red=error, blue=info)

## Accessibility

- Keyboard navigation (ESC to close)
- Focus trap (Tab cycles within modal)
- ARIA labels on buttons
- Semantic HTML structure
- Proper heading hierarchy
- Screen reader friendly

## Performance Optimizations

- Automatic validation caching (server-side)
- Cache status indicator shows cached results
- Efficient re-rendering with React state
- Lazy loading (modal only renders when `isOpen` is true)

## Integration with Dependency System

This modal integrates with the platform's dependency validation system:

1. **Tier-Based Hierarchy**: Resources organized in tiers 1-8
2. **Dependency Graph**: Each resource declares required dependencies
3. **Cache Layer**: Validation results cached for 24 hours
4. **Suggested Order**: AI-optimized generation sequence
5. **Cost Estimation**: Token-based pricing with Claude Sonnet

## Example Flows

### Flow 1: All Dependencies Met
```
User clicks "Generate Sales Deck"
  → Modal opens with loading state
  → API validates dependencies
  → Green success: "Ready to Generate"
  → User clicks "Continue to Generation"
  → Modal closes, generation starts
```

### Flow 2: Missing Dependencies
```
User clicks "Generate Sales Deck"
  → Modal opens with loading state
  → API detects 2 missing dependencies
  → Yellow warning: "Missing 2 dependencies"
  → Shows: ICP Analysis ($0.0045, 1500 tokens)
          Value Messaging ($0.0030, 1000 tokens)
  → Recommended order: ICP → Value → Sales Deck
  → Total cost: $0.012 (4000 tokens)
  → User clicks "Generate All"
  → Modal closes, batch generation starts
```

### Flow 3: Single Dependency Generation
```
User sees missing dependencies
  → Clicks "Generate" on ICP Analysis
  → Modal closes
  → Navigates to ICP Analysis generation
  → After completion, returns to original resource
```

## Related Files

- **Backend Controller**: `/backend/src/controllers/dependencyValidationController.js`
- **Backend Routes**: `/backend/src/routes/dependencyValidationRoutes.js`
- **Dependency Config**: `/backend/src/config/resource-dependencies.js`
- **Database Migration**: `/infra/supabase/migrations/20250118000001_create_dependency_and_context_cache.sql`

## Testing

### Unit Tests (to be created)
```tsx
describe('DependencyValidationModal', () => {
  it('renders loading state on mount', () => {});
  it('displays success state when all dependencies met', () => {});
  it('displays missing dependencies with cost estimates', () => {});
  it('calls onGenerateDependency when clicking single generate button', () => {});
  it('calls onGenerateAll when clicking generate all button', () => {});
  it('closes on ESC key press', () => {});
  it('closes on backdrop click', () => {});
  it('shows error state on API failure', () => {});
  it('retries validation on error retry button click', () => {});
});
```

### Integration Tests (to be created)
```tsx
describe('DependencyValidationModal Integration', () => {
  it('fetches validation from API on mount', () => {});
  it('handles API errors gracefully', () => {});
  it('triggers resource generation workflow on generate click', () => {});
  it('updates UI when validation changes', () => {});
});
```

## Future Enhancements

- [ ] Add dependency visualization (tree diagram)
- [ ] Show estimated generation time per resource
- [ ] Add "Save for Later" option to queue dependencies
- [ ] Integrate with progress tracking system
- [ ] Add batch generation progress indicator
- [ ] Support for optional vs required dependencies
- [ ] Add dependency conflict detection
- [ ] Show circular dependency warnings
- [ ] Add "Skip validation" option for admin users
- [ ] Cache validation results client-side (local storage)

---

**Created**: January 18, 2025
**Component Location**: `/frontend/src/features/resources-library/components/DependencyValidationModal.tsx`
**API Endpoint**: `/api/dependencies/validate`
**Related Docs**: See `/backend/docs/COMPLETE_RESOURCE_CONTENT_SCHEMAS.md` for resource structure
