# Comprehensive Import Path Overview for modern-platform

## 🏗️ Current Directory Structure

```
modern-platform/
├── app/                          # Next.js App Router
├── src/
│   ├── shared/                   # Shared components & utilities
│   │   ├── components/           # Reusable UI components
│   │   ├── hooks/               # Shared React hooks
│   │   ├── services/            # Shared services
│   │   ├── types/               # Shared TypeScript types
│   │   └── utils/               # Shared utilities
│   └── features/                # Feature-specific code
│       ├── assessment/
│       ├── dashboard/
│       └── icp-analysis/
├── lib/                         # Core libraries & utilities
│   ├── api/                     # API client & utilities
│   ├── hooks/                   # Core React hooks
│   ├── services/                # Core services
│   ├── supabase/                # Supabase configuration
│   └── utils/                   # Core utilities
└── components/                  # Legacy components (to be removed)
```

## 🎯 Essential Import Paths

### 1. Shared Components (Primary)

```typescript
// Layout Components
import { EnterpriseNavigationV2 } from '@/src/shared/components/layout/EnterpriseNavigationV2';
import { EnterpriseHeader } from '@/src/shared/components/layout/EnterpriseHeader';
import { EnterpriseSidebar } from '@/src/shared/components/layout/EnterpriseSidebar';

// Dashboard Components
import { ProgressOverview } from '@/src/shared/components/dashboard/ProgressOverview';
import { MilestonesCard } from '@/src/shared/components/dashboard/MilestonesCard';
import { QuickActions } from '@/src/shared/components/dashboard/QuickActions';
import { RecentActivity } from '@/src/shared/components/dashboard/RecentActivity';
import { InsightsPanel } from '@/src/shared/components/dashboard/InsightsPanel';
import { EnterpriseDashboard } from '@/src/shared/components/dashboard/EnterpriseDashboard';

// ICP Components
import { ICPAnalysisForm } from '@/src/shared/components/icp/ICPAnalysisForm';
import { ICPResults } from '@/src/shared/components/icp/ICPResults';
import { ICPHistory } from '@/src/shared/components/icp/ICPHistory';

// Cost Calculator Components
import { CostCalculatorForm } from '@/src/shared/components/cost-calculator/CostCalculatorForm';
import { CostResults } from '@/src/shared/components/cost-calculator/CostResults';
import { CostHistory } from '@/src/shared/components/cost-calculator/CostHistory';

// Analytics Components
import { AdvancedAnalyticsDashboard } from '@/src/shared/components/analytics/AdvancedAnalyticsDashboard';
import { CustomerInsightsPanel } from '@/src/shared/components/analytics/CustomerInsightsPanel';
import { PredictiveAnalytics } from '@/src/shared/components/analytics/PredictiveAnalytics';

// Export Components
import { ExportCenter } from '@/src/shared/components/export/ExportCenter';

// Auth Components
import SupabaseAuth from '@/src/shared/components/auth/SupabaseAuth';

// UI Components
import { LoadingSpinner } from '@/src/shared/components/ui/LoadingSpinner';
```

### 2. Feature-Specific Components

```typescript
// Assessment Feature
import { AssessmentResultsWidget } from '@/src/features/assessment/components/AssessmentResultsWidget';
import { AssessmentOverviewWidget } from '@/src/features/assessment/components/AssessmentOverviewWidget';
import { AssessmentChallengesWidget } from '@/src/features/assessment/components/AssessmentChallengesWidget';

// ICP Analysis Feature
import ProductDetailsWidget from '@/src/features/icp-analysis/widgets/ProductDetailsWidget';
import ICPRatingSystemWidget from '@/src/features/icp-analysis/widgets/ICPRatingSystemWidget';
import BuyerPersonasWidget from '@/src/features/icp-analysis/widgets/BuyerPersonasWidget';

// Dashboard Feature
import { CompetencyGauges } from '@/src/features/dashboard/components/CompetencyGauges';
import { ContextualHelp } from '@/src/features/dashboard/components/ContextualHelp';
```

### 3. Hooks & Services

```typescript
// Shared Hooks
import { useSupabaseAuth } from '@/src/shared/hooks/useSupabaseAuth';
import { useProgressiveEngagement } from '@/src/shared/hooks/useProgressiveEngagement';
import { useBehavioralTracking } from '@/src/shared/hooks/useBehavioralTracking';

// Core API Hooks
import { useCustomer, useProgress, useMilestones } from '@/lib/hooks/useAPI';
import { useCostHistory, useTrackAction } from '@/lib/hooks/useAPI';
import { useCustomerICP } from '@/lib/hooks/useAPI';

// Feature-Specific Hooks
import { useEnhancedCompetencyDashboard } from '@/src/features/dashboard/hooks/useEnhancedCompetencyDashboard';
```

### 4. Services & Utilities

```typescript
// Core Services
import { CRMIntegrationService } from '@/lib/services/CRMIntegrationService';
import { ProgressiveFeatureManager } from '@/lib/services/ProgressiveFeatureManager';
import { SkillAssessmentEngine } from '@/lib/services/SkillAssessmentEngine';

// Shared Services
import { cacheService } from '@/src/shared/services/cacheService';
import { exportService } from '@/src/shared/services/exportService';

// Utilities
import { tracking } from '@/lib/utils/tracking';
import { codeSplitting } from '@/src/shared/utils/codeSplitting';
```

### 5. Supabase & API

```typescript
// Supabase Client
import { supabase } from '@/lib/supabase/client';
import { getCustomerAssets } from '@/lib/supabase/client';

// API Client
import { customerAPI, costCalculatorAPI } from '@/lib/api/client';
```

### 6. Types & Constants

```typescript
// Shared Types
import { ApiTypes } from '@/src/shared/types/api';

// Brand Constants
import { COLORS, TYPOGRAPHY } from '@/lib/constants/brand';
```

## ⚠️ Critical Import Path Rules

### ✅ CORRECT Patterns:

```typescript
// Shared components (most common)
import { ComponentName } from '@/src/shared/components/category/ComponentName';

// Feature-specific components
import { ComponentName } from '@/src/features/feature-name/components/ComponentName';

// Core utilities
import { utilityName } from '@/lib/utility-type/utilityName';

// Shared utilities
import { utilityName } from '@/src/shared/utility-type/utilityName';
```

### ❌ AVOID These Patterns:

```typescript
// Legacy paths (no longer exist)
import { Component } from '@/components/...';
import { Component } from '@/hs-platform/...';
import { Component } from '@/app/components/...';

// Direct file imports (use proper paths)
import Component from './Component';
```

## 🔧 TypeScript Configuration

The current `tsconfig.json` has:
```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```

This allows all imports to use the `@/` prefix, which resolves to the project root.

## 📝 Import Path Checklist

When adding new components or utilities:

1. **Shared Components** → `@/src/shared/components/category/`
2. **Feature Components** → `@/src/features/feature-name/components/`
3. **Shared Hooks** → `@/src/shared/hooks/`
4. **Core Hooks** → `@/lib/hooks/`
5. **Services** → `@/lib/services/` or `@/src/shared/services/`
6. **Utilities** → `@/lib/utils/` or `@/src/shared/utils/`
7. **Types** → `@/src/shared/types/` or `@/lib/types/`
8. **Constants** → `@/lib/constants/`

## 🎯 Component Categories

### Layout Components
- **Location**: `@/src/shared/components/layout/`
- **Purpose**: Navigation, headers, sidebars, page layouts
- **Examples**: `EnterpriseNavigationV2`, `EnterpriseHeader`, `EnterpriseSidebar`

### Dashboard Components
- **Location**: `@/src/shared/components/dashboard/`
- **Purpose**: Dashboard-specific UI components
- **Examples**: `ProgressOverview`, `MilestonesCard`, `QuickActions`

### Tool Components
- **Location**: `@/src/shared/components/[tool-name]/`
- **Purpose**: Tool-specific components (ICP, Cost Calculator, etc.)
- **Examples**: `ICPAnalysisForm`, `CostCalculatorForm`

### Analytics Components
- **Location**: `@/src/shared/components/analytics/`
- **Purpose**: Analytics and reporting components
- **Examples**: `AdvancedAnalyticsDashboard`, `CustomerInsightsPanel`

### Export Components
- **Location**: `@/src/shared/components/export/`
- **Purpose**: Data export functionality
- **Examples**: `ExportCenter`

### Auth Components
- **Location**: `@/src/shared/components/auth/`
- **Purpose**: Authentication-related components
- **Examples**: `SupabaseAuth`

### UI Components
- **Location**: `@/src/shared/components/ui/`
- **Purpose**: Reusable UI primitives
- **Examples**: `LoadingSpinner`, `ModernCard`

## 🚀 Migration Notes

This import path structure was established after consolidating components from:
- `/components/` (root level)
- `/app/components/`
- `/hs-platform/frontend/components/`
- `/src/components/`

All components are now organized in a clean, feature-based architecture that supports:
- **Scalability**: Easy to add new features
- **Maintainability**: Clear separation of concerns
- **Reusability**: Shared components in dedicated directories
- **Type Safety**: Consistent TypeScript imports

## 📚 Related Documentation

- `COMPREHENSIVE_TESTING_REPORT.md` - Testing procedures
- `BACKEND_INTEGRATION_COMPLETE.md` - Backend integration status
- `TYPESCRIPT_ERROR_RESOLUTION_COMPLETE_2025-01-27.md` - TypeScript setup

---

**Last Updated**: September 23, 2025
**Version**: 1.0
**Status**: Active - Use this guide for all new development
