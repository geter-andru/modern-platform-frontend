# Integration Migration Plan
## H&S Revenue Intelligence Platform - Technical Implementation Guide

**Date:** October 9, 2025
**Status:** Implementation Ready
**Estimated Effort:** 40-60 hours across 3 sprints
**Dependencies:** See PLATFORM_MIGRATION_VALUE_ANALYSIS.md for business justification

---

## Table of Contents

1. [Phase 1: Feature Flags Integration](#phase-1-feature-flags-integration)
2. [Phase 2: Job Queue Setup](#phase-2-job-queue-setup)
3. [Phase 3: Advanced Caching](#phase-3-advanced-caching)
4. [Phase 4: Environment Configuration](#phase-4-environment-configuration)
5. [Phase 5: Error Handling System](#phase-5-error-handling-system)
6. [Phase 6: Secrets Management](#phase-6-secrets-management)
7. [Phase 7: Brand Consistency](#phase-7-brand-consistency)
8. [Phase 8: SEO Optimization](#phase-8-seo-optimization)
9. [Testing Strategy](#testing-strategy)
10. [Rollback Procedures](#rollback-procedures)

---

## Phase 1: Feature Flags Integration

**Priority:** Tier 1 - Revenue Enabler
**Effort:** 8-10 hours
**Value:** $100K-200K/year (enables tiered pricing)

### 1.1 Setup Feature Flags

**File:** `modern-platform/frontend/lib/config/featureFlags.ts` (already exists)

**Step 1:** Add environment variables to `.env.local`:

```bash
# Feature Flags Configuration
NEXT_PUBLIC_MVP_MODE=false
NEXT_PUBLIC_BEHAVIORAL_INTELLIGENCE=true
NEXT_PUBLIC_ADVANCED_ANALYTICS=true
NEXT_PUBLIC_REAL_TIME_ORCHESTRATION=false
NEXT_PUBLIC_PREDICTIVE_INSIGHTS=false
```

**Step 2:** Create feature flag hook

**File to create:** `modern-platform/frontend/app/lib/hooks/useFeatureFlags.ts`

```typescript
'use client';

import { FEATURE_FLAGS, featureUtils } from '@/lib/config/featureFlags';
import { useEffect, useState } from 'react';

export function useFeatureFlags() {
  const [flags, setFlags] = useState(FEATURE_FLAGS);

  useEffect(() => {
    // In production, this could sync with a feature flag service
    // For now, we use environment-based flags
    setFlags(FEATURE_FLAGS);
  }, []);

  return {
    flags,
    isEnabled: (feature: keyof typeof FEATURE_FLAGS) => flags[feature],
    isMVPMode: featureUtils.isMVPMode(),
    isEnterpriseMode: featureUtils.isEnterpriseMode(),
    getAnalyticsConfig: featureUtils.getAnalyticsConfig(),
    getExportConfig: featureUtils.getExportConfig()
  };
}
```

### 1.2 Integrate Feature Flags in ICP Analysis

**File to update:** `modern-platform/frontend/app/customer/[customerId]/simplified/icp/ICPAnalysisPage.tsx`

**Current code (lines 1-20):**
```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ICPAnalysisForm } from '@/shared/components/icp/ICPAnalysisForm';
import { supabase } from '@/lib/supabase/client'
```

**Add after imports:**
```typescript
import { useFeatureFlags } from '@/app/lib/hooks/useFeatureFlags';
```

**Add in component:**
```typescript
export default function ICPAnalysisPage() {
  const params = useParams();
  const { isEnabled } = useFeatureFlags();

  // Show advanced analytics only if feature is enabled
  const showAdvancedAnalytics = isEnabled('ADVANCED_ANALYTICS');
  const showBehavioralIntelligence = isEnabled('BEHAVIORAL_INTELLIGENCE');

  return (
    <div>
      <ICPAnalysisForm />

      {showAdvancedAnalytics && (
        <div className="mt-6">
          {/* Advanced analytics section */}
        </div>
      )}

      {showBehavioralIntelligence && (
        <div className="mt-6">
          {/* Behavioral intelligence section */}
        </div>
      )}
    </div>
  );
}
```

### 1.3 Add Feature Flag Middleware

**File to create:** `modern-platform/frontend/app/api/middleware/featureFlags.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { FEATURE_FLAGS } from '@/lib/config/featureFlags';

export function featureFlagMiddleware(request: NextRequest, featureName: keyof typeof FEATURE_FLAGS) {
  if (!FEATURE_FLAGS[featureName]) {
    return NextResponse.json(
      { error: 'Feature not available in your plan' },
      { status: 403 }
    );
  }

  return null; // Continue processing
}
```

**Usage in API routes:**

**File to update:** `modern-platform/frontend/app/api/icp-analysis/generate/route.ts`

```typescript
import { featureFlagMiddleware } from '@/app/api/middleware/featureFlags';

export async function POST(request: Request) {
  // Check if advanced analytics is enabled
  const featureCheck = featureFlagMiddleware(request as any, 'ADVANCED_ANALYTICS');
  if (featureCheck) return featureCheck;

  // Continue with ICP generation...
}
```

### 1.4 Testing Checklist

- [ ] Feature flags load from environment variables
- [ ] UI components show/hide based on flags
- [ ] API routes enforce feature access
- [ ] MVP mode disables enterprise features
- [ ] Can toggle flags without code changes

**Testing command:**
```bash
# Test MVP mode
NEXT_PUBLIC_MVP_MODE=true npm run dev

# Test Enterprise mode
NEXT_PUBLIC_MVP_MODE=false NEXT_PUBLIC_ADVANCED_ANALYTICS=true npm run dev
```

---

## Phase 2: Job Queue Setup

**Priority:** Tier 1 - Revenue Enabler
**Effort:** 10-12 hours
**Value:** $160K/year (productivity + API savings)

### 2.1 Initialize Job Queue

**File:** `modern-platform/frontend/lib/queue/job-queue.ts` (already exists)

**Step 1:** Create job processors directory

**Directory to create:** `modern-platform/frontend/app/lib/jobs/`

**File to create:** `modern-platform/frontend/app/lib/jobs/icpGenerationJob.ts`

```typescript
import { JobProcessor } from '@/lib/queue/job-queue';
import { ICPAnalysisService } from '@/app/lib/intelligence/icpAnalysisService';

interface ICPJobData {
  customerId: string;
  businessType: string;
  productDescription: string;
  industry: string;
  targetMarket: string;
}

export const icpGenerationProcessor: JobProcessor<ICPJobData> = async (job, updateProgress) => {
  const { customerId, businessType, productDescription, industry, targetMarket } = job.data;

  updateProgress(10); // Started

  const icpService = new ICPAnalysisService();

  // Step 1: Analyze business context
  updateProgress(25);
  const context = await icpService.analyzeContext({
    businessType,
    productDescription,
    industry
  });

  // Step 2: Generate ICP profile
  updateProgress(50);
  const icpProfile = await icpService.generateProfile(context);

  // Step 3: Identify pain points
  updateProgress(75);
  const painPoints = await icpService.identifyPainPoints(icpProfile);

  // Step 4: Save to database
  updateProgress(90);
  const result = await icpService.saveAnalysis(customerId, {
    profile: icpProfile,
    painPoints,
    context
  });

  updateProgress(100);

  return result;
};
```

### 2.2 Register Job Processors

**File to create:** `modern-platform/frontend/app/lib/jobs/index.ts`

```typescript
import { jobQueue } from '@/lib/queue/job-queue';
import { icpGenerationProcessor } from './icpGenerationJob';

// Register all job processors
export function initializeJobQueue() {
  jobQueue.process('icp-generation', icpGenerationProcessor);

  console.log('✅ Job queue initialized');
}

// Auto-initialize on import
if (typeof window !== 'undefined') {
  initializeJobQueue();
}
```

### 2.3 Update ICP Generation to Use Queue

**File to update:** `modern-platform/frontend/app/api/icp-analysis/generate/route.ts`

**Before:**
```typescript
export async function POST(request: Request) {
  const body = await request.json();

  // Synchronous generation (blocks for 30-60 seconds)
  const result = await generateICP(body);

  return NextResponse.json(result);
}
```

**After:**
```typescript
import { queue } from '@/lib/queue/job-queue';

export async function POST(request: Request) {
  const body = await request.json();
  const { customerId } = body;

  // Queue ICP generation (returns immediately)
  const job = queue.add('icp-generation', {
    customerId,
    businessType: body.businessType,
    productDescription: body.productDescription,
    industry: body.industry,
    targetMarket: body.targetMarket
  }, {
    priority: 10, // High priority for ICP generation
    attempts: 3,  // Retry up to 3 times
    backoff: 'exponential'
  });

  return NextResponse.json({
    jobId: job.id,
    status: 'queued',
    message: 'ICP generation started'
  });
}
```

### 2.4 Add Job Status Endpoint

**File to create:** `modern-platform/frontend/app/api/icp-analysis/status/[jobId]/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { queue } from '@/lib/queue/job-queue';

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  const job = queue.getJob(params.jobId);

  if (!job) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: job.id,
    status: job.status,
    progress: job.progress,
    result: job.result,
    errors: job.errors,
    createdAt: job.createdAt,
    completedAt: job.completedAt
  });
}
```

### 2.5 Update Frontend to Poll Job Status

**File to update:** `modern-platform/frontend/app/customer/[customerId]/simplified/icp/ICPAnalysisPage.tsx`

**Add job status polling:**

```typescript
import { useState, useEffect } from 'react';

export default function ICPAnalysisPage() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Poll job status
  useEffect(() => {
    if (!jobId) return;

    const pollInterval = setInterval(async () => {
      const response = await fetch(`/api/icp-analysis/status/${jobId}`);
      const status = await response.json();

      setJobStatus(status);

      if (status.status === 'completed') {
        clearInterval(pollInterval);
        setIsGenerating(false);
        // Handle completed job
      } else if (status.status === 'failed') {
        clearInterval(pollInterval);
        setIsGenerating(false);
        // Handle failed job
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [jobId]);

  const handleGenerateICP = async (formData: any) => {
    setIsGenerating(true);

    const response = await fetch('/api/icp-analysis/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const { jobId } = await response.json();
    setJobId(jobId);
  };

  return (
    <div>
      <ICPAnalysisForm onSubmit={handleGenerateICP} />

      {isGenerating && jobStatus && (
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${jobStatus.progress}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">
              {jobStatus.progress}%
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Analyzing your ideal customer profile...
          </p>
        </div>
      )}
    </div>
  );
}
```

### 2.6 Testing Checklist

- [ ] ICP generation queues job (doesn't block)
- [ ] Job status endpoint returns progress
- [ ] Frontend shows progress bar during generation
- [ ] Failed jobs retry 3 times automatically
- [ ] Completed jobs show results
- [ ] Can view job queue stats at `/api/queue/stats`

**Testing command:**
```bash
# Start queue monitor
npm run dev

# In another terminal, trigger ICP generation
curl -X POST http://localhost:3000/api/icp-analysis/generate \
  -H "Content-Type: application/json" \
  -d '{"customerId":"test","businessType":"SaaS","productDescription":"CRM","industry":"Technology","targetMarket":"SMB"}'

# Check job status
curl http://localhost:3000/api/icp-analysis/status/{jobId}
```

---

## Phase 3: Advanced Caching

**Priority:** Tier 1 - Revenue Enabler
**Effort:** 6-8 hours
**Value:** $400K/year (productivity gains)

### 3.1 Create Caching Layer for Supabase Queries

**File to create:** `modern-platform/frontend/app/lib/utils/cachedSupabase.ts`

```typescript
import { supabase } from '@/lib/supabase/client';
import { AdvancedCache } from '@/lib/performance/caching';

// Create cache instance for Supabase queries
const supabaseCache = new AdvancedCache('supabase-queries', {
  ttl: 1000 * 60 * 5, // 5 minutes
  maxSize: 100,
  enablePersistence: true,
  strategy: 'lru'
});

interface QueryOptions {
  useCache?: boolean;
  cacheTtl?: number;
}

export async function cachedQuery<T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options: QueryOptions = {}
): Promise<T> {
  const { useCache = true, cacheTtl } = options;

  // Check cache first
  if (useCache) {
    const cached = supabaseCache.get(queryKey);
    if (cached !== null) {
      console.log('📦 Cache hit:', queryKey);
      return cached as T;
    }
  }

  // Execute query
  console.log('🔍 Cache miss, fetching:', queryKey);
  const result = await queryFn();

  // Store in cache
  if (useCache && result) {
    supabaseCache.set(queryKey, result, cacheTtl);
  }

  return result;
}

// Clear cache for specific pattern
export function clearCache(pattern?: string) {
  if (pattern) {
    // Clear all keys matching pattern
    // Implementation depends on cache keys structure
  } else {
    supabaseCache.clear();
  }
}

// Get cache statistics
export function getCacheStats() {
  return supabaseCache.getStats();
}
```

### 3.2 Update Supabase Data Service to Use Cache

**File to update:** `modern-platform/frontend/app/lib/services/supabaseDataService.ts`

**Before (line 112):**
```typescript
const { data, error } = await supabase
  .from('assessment_sessions')
  .select('*')
  .eq('customer_id', customerId)
  .single();
```

**After:**
```typescript
import { cachedQuery } from '@/app/lib/utils/cachedSupabase';

const { data, error } = await cachedQuery(
  `assessment_session:${customerId}`,
  async () => {
    const result = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('customer_id', customerId)
      .single();

    if (result.error) throw result.error;
    return result;
  },
  { cacheTtl: 1000 * 60 * 10 } // Cache for 10 minutes
);
```

### 3.3 Add Cache Invalidation on Mutations

**File to update:** `modern-platform/frontend/app/lib/services/supabaseDataService.ts`

**After any insert/update/delete:**

```typescript
import { clearCache } from '@/app/lib/utils/cachedSupabase';

async function updateAssessmentSession(customerId: string, data: any) {
  const result = await supabase
    .from('assessment_sessions')
    .update(data)
    .eq('customer_id', customerId);

  // Invalidate cache for this customer
  clearCache(`assessment_session:${customerId}`);

  return result;
}
```

### 3.4 Add Cache Stats Dashboard

**File to create:** `modern-platform/frontend/app/admin/cache-stats/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getCacheStats } from '@/app/lib/utils/cachedSupabase';

export default function CacheStatsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getCacheStats());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div>Loading...</div>;

  const hitRate = stats.size > 0 ? (stats.hitRate * 100).toFixed(1) : 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cache Statistics</h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Cache Size</div>
          <div className="text-2xl font-bold">{stats.size}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Hit Rate</div>
          <div className="text-2xl font-bold">{hitRate}%</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Memory Usage</div>
          <div className="text-2xl font-bold">
            {(stats.memoryUsage / 1024).toFixed(1)} KB
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Age</div>
          <div className="text-2xl font-bold">
            {Math.floor((Date.now() - stats.oldestEntry) / 1000 / 60)} min
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3.5 Testing Checklist

- [ ] First query fetches from Supabase (cache miss)
- [ ] Second identical query returns from cache (cache hit)
- [ ] Cache stats show hit rate increasing
- [ ] Mutations invalidate relevant cache entries
- [ ] Cache persists across page refreshes (localStorage)
- [ ] Cache stats dashboard shows live metrics

**Testing command:**
```bash
# Monitor cache in browser console
localStorage.getItem('cache_supabase-queries')

# Check cache stats
curl http://localhost:3000/admin/cache-stats
```

---

## Phase 4: Environment Configuration

**Priority:** Tier 2 - Risk Mitigator
**Effort:** 8-10 hours
**Value:** $5K-10K/year (prevents outages)

### 4.1 Migrate to Validated Environment Config

**Files to update:** All 20 files using `process.env.*`

**Example migration:**

**File:** `modern-platform/frontend/app/api/health/route.ts`

**Before (line 26):**
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anthropicKey = process.env.ANTHROPIC_API_KEY;
```

**After:**
```typescript
import { env } from '@/lib/config/environment';

const supabaseUrl = env.supabaseUrl;
const anthropicKey = env.anthropicApiKey;
```

**Benefits:**
- Type-safe access (TypeScript autocomplete)
- Validated format (catches invalid API keys at startup)
- Runtime errors if missing (fails fast)

### 4.2 Add Environment Validation Script

**File to create:** `modern-platform/frontend/scripts/validate-env.ts`

```typescript
#!/usr/bin/env ts-node

import { env } from '../lib/config/environment';

console.log('🔍 Validating environment configuration...\n');

try {
  // Accessing env will trigger validation
  console.log('✅ Environment:', env.environment);
  console.log('✅ Supabase URL:', env.supabaseUrl);
  console.log('✅ Anthropic API Key:', env.anthropicApiKey.substring(0, 20) + '...');
  console.log('✅ Airtable API Key:', env.airtableApiKey.substring(0, 20) + '...');

  console.log('\n✅ All environment variables validated successfully!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Environment validation failed:');
  console.error(error);
  process.exit(1);
}
```

**Add to package.json:**
```json
{
  "scripts": {
    "validate:env": "ts-node scripts/validate-env.ts"
  }
}
```

### 4.3 Add Pre-Build Validation

**File to update:** `modern-platform/frontend/next.config.ts`

```typescript
import { env } from './lib/config/environment';

// Validate environment before build
console.log('🔍 Validating environment before build...');
try {
  env.supabaseUrl; // Accessing will trigger validation
  console.log('✅ Environment validated');
} catch (error) {
  console.error('❌ Environment validation failed:', error);
  process.exit(1);
}

const nextConfig = {
  // ... existing config
};

export default nextConfig;
```

### 4.4 Update All Process.env References

**Script to find all references:**

```bash
cd modern-platform/frontend
grep -r "process.env\." app/ --include="*.ts" --include="*.tsx" -n
```

**Files to update (found 20 files):**

1. `app/lib/utils/performanceMonitor.ts`
2. `app/api/export/status/[exportId]/route.ts`
3. `app/api/export/history/[customerId]/route.ts`
4. `app/api/health/route.ts`
5. `app/lib/services/authHelper.ts`
6. `app/api/export/company-rating/route.ts`
7. `app/api/export/personas/route.ts`
8. `app/api/export/assessment/route.ts`
9. `app/api/export/business-case/route.ts`
10. `app/api/export/comprehensive/route.ts`
11. `app/api/export/cost-calculator/route.ts`
12. `app/api/export/icp/route.ts`
13. `app/api/products/current-user/route.ts`
14. `app/api/products/history/route.ts`
15. `app/api/products/save/route.ts`
16. `app/profile/page.tsx`
17. `app/lib/services/progressTrackingService.ts`
18. `app/lib/services/icpAnalysisService.ts`
19. `app/lib/services/exportService.ts`
20. `app/lib/services/googleWorkspaceService.ts`

**Migration pattern for each file:**

```typescript
// Before
const apiKey = process.env.ANTHROPIC_API_KEY;

// After
import { env } from '@/lib/config/environment';
const apiKey = env.anthropicApiKey;
```

### 4.5 Testing Checklist

- [ ] `npm run validate:env` passes
- [ ] Build fails if env vars missing
- [ ] TypeScript autocomplete works for env vars
- [ ] Invalid API key format caught at startup
- [ ] All 20 files migrated successfully

---

## Phase 5: Error Handling System

**Priority:** Tier 2 - Risk Mitigator
**Effort:** 10-12 hours
**Value:** $60K-72K/year (reduces churn)

### 5.1 Create Global Error Boundary

**File to create:** `modern-platform/frontend/app/components/GlobalErrorBoundary.tsx`

```typescript
'use client';

import { withErrorBoundary, getUserFriendlyMessage, getRecoveryActions } from '@/lib/utils/errorHandling';
import React from 'react';

interface ErrorBoundaryProps {
  error: any;
  retry: () => void;
}

function ErrorFallback({ error, retry }: ErrorBoundaryProps) {
  const message = getUserFriendlyMessage(error);
  const actions = getRecoveryActions(error, { retry });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Something went wrong
        </h2>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                action.primary
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">
              Technical Details
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

export const GlobalErrorBoundary = withErrorBoundary;
export const ErrorBoundaryFallback = ErrorFallback;
```

### 5.2 Wrap App with Error Boundary

**File to update:** `modern-platform/frontend/app/layout.tsx`

```typescript
import { GlobalErrorBoundary, ErrorBoundaryFallback } from './components/GlobalErrorBoundary';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GlobalErrorBoundary fallbackComponent={ErrorBoundaryFallback}>
          {children}
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
```

### 5.3 Add Retry Logic to API Calls

**File to create:** `modern-platform/frontend/app/lib/utils/apiClient.ts`

```typescript
import { retryWithBackoff, ApiError } from '@/lib/utils/errorHandling';

export async function apiCall<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  return retryWithBackoff(async () => {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        error.message || 'Request failed',
        error.code || 'API_ERROR',
        response.status,
        error
      );
    }

    return response.json();
  }, 3); // Retry 3 times
}
```

### 5.4 Update ICP Service to Use Retry Logic

**File to update:** `modern-platform/frontend/app/lib/intelligence/icpAnalysisService.ts`

**Before:**
```typescript
const response = await fetch('/api/icp-analysis/generate', {
  method: 'POST',
  body: JSON.stringify(data)
});

if (!response.ok) {
  throw new Error('Failed to generate ICP');
}

const result = await response.json();
```

**After:**
```typescript
import { apiCall } from '@/app/lib/utils/apiClient';
import { NetworkError } from '@/lib/utils/errorHandling';

try {
  const result = await apiCall('/api/icp-analysis/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  return result;
} catch (error) {
  if (error instanceof NetworkError) {
    // Network errors will have already been retried 3 times
    throw new Error('Network connection issue. Please check your internet and try again.');
  }
  throw error;
}
```

### 5.5 Add Error Logging

**File to create:** `modern-platform/frontend/app/lib/utils/errorLogger.ts`

```typescript
import { logError } from '@/lib/utils/errorHandling';

export function setupErrorLogging() {
  // Global error handler
  window.addEventListener('error', (event) => {
    logError(event.error, {
      type: 'global_error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, {
      type: 'unhandled_promise_rejection',
      promise: event.promise
    });
  });

  console.log('✅ Error logging initialized');
}
```

**Call in app initialization:**

**File to update:** `modern-platform/frontend/app/layout.tsx`

```typescript
import { setupErrorLogging } from './lib/utils/errorLogger';

export default function RootLayout({ children }: { children: React.NodeNode }) {
  useEffect(() => {
    setupErrorLogging();
  }, []);

  return (
    // ... layout
  );
}
```

### 5.6 Testing Checklist

- [ ] Error boundary catches React errors
- [ ] User sees friendly error message (not stack trace)
- [ ] Retry button works for recoverable errors
- [ ] Network errors retry 3 times automatically
- [ ] Errors logged to console in development
- [ ] Production errors ready for Sentry integration

**Testing commands:**
```typescript
// Test error boundary
throw new Error('Test error');

// Test network retry
fetch('https://nonexistent-api.example.com/test');

// Test API error
throw new ApiError('Test API error', 'TEST_ERROR', 400);
```

---

## Phase 6: Secrets Management

**Priority:** Tier 2 - Risk Mitigator
**Effort:** 4-6 hours
**Value:** $10K-50K/year (prevents breaches)

### 6.1 Enable Secrets Validation

**File:** `modern-platform/frontend/lib/config/secrets.ts` (already exists)

**Add to environment validation script:**

**File to update:** `modern-platform/frontend/scripts/validate-env.ts`

```typescript
import { secretsManager } from '../lib/config/secrets';

console.log('🔐 Validating API keys...\n');

const summary = secretsManager.getValidationSummary();

console.log(`Total secrets: ${summary.total}`);
console.log(`✅ Valid: ${summary.valid}`);
console.log(`❌ Invalid: ${summary.invalid}`);
console.log(`⚠️  Warnings: ${summary.warnings.length}`);

if (summary.errors.length > 0) {
  console.error('\n❌ Errors:');
  summary.errors.forEach(error => console.error(`  - ${error}`));
}

if (summary.warnings.length > 0) {
  console.warn('\n⚠️  Warnings:');
  summary.warnings.forEach(warning => console.warn(`  - ${warning}`));
}

if (summary.invalid > 0) {
  process.exit(1);
}
```

### 6.2 Add Rotation Monitoring

**File to create:** `modern-platform/frontend/scripts/check-rotation.ts`

```typescript
#!/usr/bin/env ts-node

import { secretsManager } from '../lib/config/secrets';

const report = secretsManager.generateRotationReport();

console.log('🔄 API Key Rotation Report\n');

if (report.needsRotation.length > 0) {
  console.warn('⚠️  These keys need rotation:');
  report.needsRotation.forEach(key => console.warn(`  - ${key}`));
  console.log('');
}

console.log('📅 Rotation Schedule:');
report.rotationSchedule.forEach(({ secret, daysUntilRotation, definition }) => {
  const status = daysUntilRotation === 0 ? '🔴' : daysUntilRotation < 30 ? '🟡' : '🟢';
  console.log(`  ${status} ${secret}: ${daysUntilRotation} days until rotation`);
});
```

**Add to package.json:**
```json
{
  "scripts": {
    "check:rotation": "ts-node scripts/check-rotation.ts"
  }
}
```

### 6.3 Testing Checklist

- [ ] Invalid API keys caught at startup
- [ ] Rotation script shows days until rotation
- [ ] Test Stripe key in production mode triggers error
- [ ] Live Stripe key in production mode validates successfully

**Testing command:**
```bash
npm run validate:env
npm run check:rotation
```

---

## Phase 7: Brand Consistency

**Priority:** Tier 3 - Growth Accelerator
**Effort:** 3-4 hours
**Value:** $20K-30K/year (higher close rates)

### 7.1 Create Brand Constants

**File:** `modern-platform/frontend/lib/constants/brand.ts` (already exists)

### 7.2 Replace Hardcoded Colors

**Script to find hardcoded colors:**
```bash
grep -r "#[0-9A-Fa-f]\{6\}" app/ --include="*.tsx" --include="*.ts" -n
```

**Example migration:**

**Before:**
```typescript
<div className="bg-purple-600 text-white">
```

**After:**
```typescript
import { brandColors } from '@/lib/constants/brand';

<div style={{ backgroundColor: brandColors.primary, color: brandColors.text.light }}>
```

### 7.3 Testing Checklist

- [ ] All hardcoded colors replaced
- [ ] Brand colors consistent across pages
- [ ] Easy to update brand colors globally

---

## Phase 8: SEO Optimization

**Priority:** Tier 3 - Growth Accelerator
**Effort:** 4-6 hours
**Value:** $5K-8K/year (viral leads)

### 8.1 Add SEO Component

**File to create:** `modern-platform/frontend/app/components/SEOHead.tsx`

```typescript
import Head from 'next/head';

interface SEOHeadProps {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
}

export function SEOHead({ title, description, ogImage, canonical }: SEOHeadProps) {
  const fullTitle = `${title} | H&S Revenue Intelligence`;
  const defaultOgImage = 'https://platform.andru-ai.com/og-default.png';

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />

      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}
    </Head>
  );
}
```

### 8.2 Add to Shared Resource Page

**File to update:** `modern-platform/frontend/app/resources/shared/[token]/page.tsx`

```typescript
import { SEOHead } from '@/app/components/SEOHead';

export default function SharedResourcePage() {
  // ... existing code

  return (
    <>
      <SEOHead
        title={`ICP Analysis: ${resource.title}`}
        description={resource.description || 'Ideal Customer Profile Analysis'}
        ogImage={`/api/og-image/resource/${resource.id}`}
        canonical={`https://platform.andru-ai.com/resources/shared/${token}`}
      />

      <div className="min-h-screen bg-gray-50">
        {/* ... existing content */}
      </div>
    </>
  );
}
```

### 8.3 Testing Checklist

- [ ] Meta tags appear in page source
- [ ] Shared links show preview on social media
- [ ] Google Search Console validates structured data

---

## Testing Strategy

### Unit Tests

```bash
# Test feature flags
npm test -- featureFlags.test.ts

# Test job queue
npm test -- job-queue.test.ts

# Test caching
npm test -- caching.test.ts

# Test error handling
npm test -- errorHandling.test.ts
```

### Integration Tests

```bash
# Test full ICP generation flow
npm test -- icp-integration.test.ts

# Test queue + cache integration
npm test -- queue-cache.test.ts
```

### End-to-End Tests

```bash
# Test complete user flow
npm run test:e2e
```

---

## Rollback Procedures

### Phase Rollback

Each phase is independent and can be rolled back separately:

```bash
# Rollback feature flags
git revert <commit-hash>

# Rollback job queue
git revert <commit-hash>

# Rollback caching
git revert <commit-hash>
```

### Emergency Rollback

```bash
# Full rollback to previous state
git reset --hard <pre-migration-commit>
git push --force origin main

# Notify team
echo "Migration rolled back to $(git log -1 --pretty=%H)"
```

---

## Success Metrics

### Track These KPIs

1. **Page Load Time**: Target <50ms for cached data
2. **Cache Hit Rate**: Target >80%
3. **API Error Rate**: Target <0.5%
4. **Job Completion Rate**: Target >95%
5. **Customer Churn**: Target <5%

### Monitoring Dashboard

Create admin dashboard at `/admin/metrics`:

```typescript
// Display:
- Cache hit rate (live)
- Job queue stats (active, completed, failed)
- API error rate (last 24h)
- Environment validation status
- Secret rotation schedule
```

---

**Document Status:** Implementation Ready
**Last Updated:** October 9, 2025
**Owner:** Engineering Team
**Next Step:** Begin Phase 1 (Feature Flags)
