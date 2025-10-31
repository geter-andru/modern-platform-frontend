# useJobStatus Hook - Usage Examples

Complete guide for using the `useJobStatus` hook to poll backend job queue status.

**Location**: `frontend/app/hooks/useJobStatus.ts`
**Author**: Agent 3 (Infrastructure & DevOps Lead)
**Created**: 2025-10-29

---

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [With Callbacks](#with-callbacks)
3. [Manual Controls](#manual-controls)
4. [Integration with Widgets](#integration-with-widgets)
5. [TypeScript Usage](#typescript-usage)
6. [Error Handling Patterns](#error-handling-patterns)
7. [Advanced Configurations](#advanced-configurations)

---

## Basic Usage

### Example 1: Persona Generation

```typescript
import { useState } from 'react';
import { useJobStatus } from '@/app/hooks/useJobStatus';
import { authenticatedFetch } from '@/app/lib/middleware/api-auth';
import { API_CONFIG } from '@/app/lib/config/api';

function PersonaGenerationWidget() {
  const [jobId, setJobId] = useState<string | null>(null);

  // Poll job status automatically when jobId is set
  const { status, progress, result, isLoading, isComplete, error } = useJobStatus(jobId);

  const handleGeneratePersonas = async () => {
    try {
      // Submit job to backend
      const response = await authenticatedFetch(`${API_CONFIG.baseURL}/api/jobs/personas`, {
        method: 'POST',
        body: JSON.stringify({
          companyContext: 'B2B SaaS sales automation',
          industry: 'Technology',
          targetMarket: 'Mid-market sales teams'
        })
      });

      const data = await response.json();

      if (data.success && data.jobId) {
        setJobId(data.jobId); // Start polling automatically
      }
    } catch (err) {
      console.error('Failed to submit job:', err);
    }
  };

  return (
    <div>
      <button onClick={handleGeneratePersonas} disabled={isLoading}>
        Generate Personas
      </button>

      {isLoading && (
        <div>
          <p>Status: {status}</p>
          <p>Progress: {progress}%</p>
        </div>
      )}

      {isComplete && result?.personas && (
        <div>
          <h3>Generated Personas:</h3>
          {result.personas.map((persona, idx) => (
            <div key={idx}>
              <h4>{persona.title}</h4>
              <p>{persona.description}</p>
            </div>
          ))}
        </div>
      )}

      {error && <p className="error">Error: {error}</p>}
    </div>
  );
}
```

---

## With Callbacks

### Example 2: Using Callbacks for Side Effects

```typescript
import { useState } from 'react';
import { useJobStatus } from '@/app/hooks/useJobStatus';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function CompanyRatingWidget() {
  const [jobId, setJobId] = useState<string | null>(null);
  const router = useRouter();

  const { status, progress, isLoading, error } = useJobStatus(jobId, {
    // Called when job completes successfully
    onComplete: (result) => {
      console.log('Job completed:', result);

      // Show success toast
      toast.success('Company rating complete!', {
        description: `Rating: ${result.rating?.score}/100`
      });

      // Refresh data or navigate
      router.refresh();
    },

    // Called when job fails
    onError: (errorMessage) => {
      console.error('Job failed:', errorMessage);

      // Show error toast
      toast.error('Rating failed', {
        description: errorMessage
      });
    },

    // Called on every status update
    onStatusUpdate: (jobData) => {
      console.log('Status update:', jobData.status, jobData.progress);

      // Update analytics
      if (jobData.status === 'active') {
        // Track job processing time, etc.
      }
    }
  });

  const handleRateCompany = async (companyUrl: string) => {
    try {
      const response = await authenticatedFetch(`${API_CONFIG.baseURL}/api/jobs/rate`, {
        method: 'POST',
        body: JSON.stringify({ companyUrl })
      });

      const data = await response.json();
      if (data.success) {
        setJobId(data.jobId);
      }
    } catch (err) {
      toast.error('Failed to submit rating job');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter company URL"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleRateCompany(e.currentTarget.value);
          }
        }}
      />

      {isLoading && (
        <div className="progress-bar">
          <div style={{ width: `${progress}%` }} />
          <span>{status}: {progress}%</span>
        </div>
      )}
    </div>
  );
}
```

---

## Manual Controls

### Example 3: Manual Polling Control

```typescript
import { useState } from 'react';
import { useJobStatus } from '@/app/hooks/useJobStatus';

function BatchRatingWidget() {
  const [jobId, setJobId] = useState<string | null>(null);

  // Disable auto-start, control polling manually
  const {
    status,
    progress,
    result,
    isPolling,
    startPolling,
    stopPolling,
    retry
  } = useJobStatus(jobId, {
    autoStart: false, // Don't start automatically
    pollInterval: 3000, // Poll every 3 seconds
    maxAttempts: 100 // 5 minutes at 3-second intervals
  });

  const handleStartBatchJob = async (companies: string[]) => {
    const response = await authenticatedFetch(`${API_CONFIG.baseURL}/api/jobs/batch-rate`, {
      method: 'POST',
      body: JSON.stringify({ companies })
    });

    const data = await response.json();
    if (data.success) {
      setJobId(data.jobId);
      // Don't start polling yet - user will click "Start Monitoring"
    }
  };

  return (
    <div>
      <button onClick={() => handleStartBatchJob(['company1.com', 'company2.com'])}>
        Submit Batch Job
      </button>

      {jobId && !isPolling && (
        <button onClick={startPolling}>
          Start Monitoring
        </button>
      )}

      {isPolling && (
        <button onClick={stopPolling}>
          Pause Monitoring
        </button>
      )}

      {status === 'failed' && (
        <button onClick={retry}>
          Retry
        </button>
      )}

      {isPolling && <p>Polling... {progress}%</p>}

      {status === 'completed' && result?.results && (
        <div>
          <h3>Batch Results:</h3>
          {result.results.map((item, idx) => (
            <div key={idx}>
              <p>{item.company}: {item.rating}/100</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Integration with Widgets

### Example 4: Replacing Synchronous API Calls

**BEFORE** (Synchronous, blocking):

```typescript
// OLD: ProductDetailsWidget.tsx
async function handleGenerateICP() {
  setIsGenerating(true);

  try {
    // This blocks for 30-60 seconds
    const response = await fetch('/api/generate-icp', {
      method: 'POST',
      body: JSON.stringify({ productDetails })
    });

    const data = await response.json();
    setPersonas(data.personas);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsGenerating(false);
  }
}
```

**AFTER** (Asynchronous with job queue):

```typescript
// NEW: ProductDetailsWidget.tsx
import { useState } from 'react';
import { useJobStatus } from '@/app/hooks/useJobStatus';

function ProductDetailsWidget() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [personas, setPersonas] = useState<any[]>([]);

  // Poll job status
  const { status, progress, isComplete, error } = useJobStatus(jobId, {
    onComplete: (result) => {
      if (result.personas) {
        setPersonas(result.personas);
        setJobId(null); // Clear jobId after success
      }
    },
    onError: (err) => {
      console.error('ICP generation failed:', err);
    }
  });

  async function handleGenerateICP() {
    try {
      // Submit job (returns immediately)
      const response = await authenticatedFetch('/api/jobs/personas', {
        method: 'POST',
        body: JSON.stringify({ productDetails })
      });

      const data = await response.json();
      if (data.success) {
        setJobId(data.jobId); // Start polling
      }
    } catch (err) {
      console.error('Failed to submit job:', err);
    }
  }

  const isGenerating = status === 'waiting' || status === 'active';

  return (
    <div>
      <button onClick={handleGenerateICP} disabled={isGenerating}>
        {isGenerating ? `Generating... ${progress}%` : 'Generate ICP'}
      </button>

      {isGenerating && (
        <div className="progress-indicator">
          <p>Status: {status}</p>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {isComplete && personas.length > 0 && (
        <div className="personas-list">
          {personas.map(persona => (
            <PersonaCard key={persona.id} persona={persona} />
          ))}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
```

**Benefits of Migration**:
- ✅ No more 60-second HTTP timeouts
- ✅ Better UX with real-time progress updates
- ✅ User can navigate away and come back
- ✅ Backend can handle rate limits without blocking frontend
- ✅ Proper error handling and retry logic

---

## TypeScript Usage

### Example 5: Strongly Typed Hook Usage

```typescript
import { useJobStatus, JobResult, JobStatus, JobStatusData } from '@/app/hooks/useJobStatus';

// Custom type for your specific result
interface PersonaGenerationResult extends JobResult {
  personas: Array<{
    id: string;
    title: string;
    description: string;
    painPoints: string[];
    goals: string[];
  }>;
  savedId: string;
}

function TypedPersonaWidget() {
  const [jobId, setJobId] = useState<string | null>(null);

  const {
    status,
    progress,
    result,
    jobData,
    isComplete
  } = useJobStatus(jobId, {
    onComplete: (result: JobResult) => {
      // Type assertion for specific result type
      const personaResult = result as PersonaGenerationResult;

      console.log('Generated personas:', personaResult.personas);
      console.log('Saved with ID:', personaResult.savedId);
    },

    onStatusUpdate: (status: JobStatusData) => {
      // Access typed job metadata
      console.log('Customer ID:', status.data.customerId);
      console.log('Company context:', status.data.companyContext);
      console.log('Submitted at:', status.data.submittedAt);
    }
  });

  // Type guards for result access
  if (isComplete && result) {
    const personaResult = result as PersonaGenerationResult;

    return (
      <div>
        {personaResult.personas.map(persona => (
          <div key={persona.id}>
            <h3>{persona.title}</h3>
            <p>{persona.description}</p>
            <ul>
              {persona.painPoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return <div>Loading...</div>;
}
```

---

## Error Handling Patterns

### Example 6: Comprehensive Error Handling

```typescript
import { useJobStatus } from '@/app/hooks/useJobStatus';
import { toast } from 'sonner';

function RobustJobWidget() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const {
    status,
    error,
    isFailed,
    retry,
    jobData
  } = useJobStatus(jobId, {
    maxAttempts: 150, // 5 minutes

    onError: (errorMessage) => {
      console.error('Job error:', errorMessage);

      // Different error handling based on error type
      if (errorMessage.includes('timeout')) {
        toast.error('Job is taking longer than expected', {
          description: 'The job may still be processing. Please check back later.',
          action: {
            label: 'Retry',
            onClick: () => {
              setRetryCount(prev => prev + 1);
              retry();
            }
          }
        });
      } else if (errorMessage.includes('rate limit')) {
        toast.error('Rate limit reached', {
          description: 'Please wait a moment before trying again.'
        });
      } else if (errorMessage.includes('authentication')) {
        toast.error('Authentication failed', {
          description: 'Please refresh the page and try again.'
        });
      } else {
        toast.error('Job failed', {
          description: errorMessage
        });
      }

      // Log to analytics
      logJobError({
        jobId,
        errorMessage,
        retryCount,
        attemptsMade: jobData?.attemptsMade || 0
      });
    }
  });

  // Show retry limit reached
  if (retryCount >= 3) {
    return (
      <div className="error-state">
        <h3>Unable to Complete Job</h3>
        <p>We've attempted this operation multiple times without success.</p>
        <button onClick={() => {
          // Reset and try fresh submission
          setJobId(null);
          setRetryCount(0);
        }}>
          Start Over
        </button>
      </div>
    );
  }

  // Show failed state with retry
  if (isFailed) {
    return (
      <div className="error-state">
        <p>Job failed: {error}</p>
        <button onClick={() => {
          setRetryCount(prev => prev + 1);
          retry();
        }}>
          Retry (Attempt {retryCount + 1}/3)
        </button>
      </div>
    );
  }

  return <div>Job Status: {status}</div>;
}
```

---

## Advanced Configurations

### Example 7: Custom Polling Strategy

```typescript
import { useJobStatus } from '@/app/hooks/useJobStatus';

function CustomPollingWidget() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const {
    status,
    progress,
    jobData
  } = useJobStatus(jobId, {
    // Fast polling for first minute, then slow down
    pollInterval: Date.now() - startTime < 60000 ? 1000 : 5000,

    // Long timeout for batch jobs
    maxAttempts: 300, // 10 minutes at variable intervals

    onStatusUpdate: (data) => {
      // Calculate estimated time remaining
      if (data.status === 'active' && data.progress > 0) {
        const elapsed = Date.now() - startTime;
        const estimated = (elapsed / data.progress) * (100 - data.progress);

        console.log(`Estimated time remaining: ${Math.round(estimated / 1000)}s`);
      }

      // Log progress milestones
      if (data.progress === 25 || data.progress === 50 || data.progress === 75) {
        console.log(`Milestone reached: ${data.progress}%`);
      }
    }
  });

  return (
    <div>
      <p>Status: {status}</p>
      <p>Progress: {progress}%</p>
      {jobData && (
        <div className="job-details">
          <p>Job ID: {jobData.jobId}</p>
          <p>Queue: {jobData.queueName}</p>
          <p>Attempts: {jobData.attemptsMade}</p>
          {jobData.processedOn && (
            <p>Started: {new Date(jobData.processedOn).toLocaleTimeString()}</p>
          )}
        </div>
      )}
    </div>
  );
}
```

### Example 8: Multiple Simultaneous Jobs

```typescript
import { useJobStatus } from '@/app/hooks/useJobStatus';

function MultiJobDashboard() {
  const [jobs, setJobs] = useState<string[]>([]);

  return (
    <div>
      <button onClick={() => {
        // Add new job
        fetch('/api/jobs/personas', { method: 'POST' })
          .then(r => r.json())
          .then(data => setJobs(prev => [...prev, data.jobId]));
      }}>
        Add Job
      </button>

      <div className="jobs-grid">
        {jobs.map(jobId => (
          <JobStatusCard key={jobId} jobId={jobId} />
        ))}
      </div>
    </div>
  );
}

function JobStatusCard({ jobId }: { jobId: string }) {
  const { status, progress, result, isComplete } = useJobStatus(jobId);

  return (
    <div className="job-card">
      <p>Job: {jobId.substring(0, 8)}...</p>
      <p>Status: {status}</p>
      {!isComplete && <progress value={progress} max={100} />}
      {isComplete && result && <p>✅ Complete</p>}
    </div>
  );
}
```

---

## Best Practices

### 1. **Always Handle Loading States**
```typescript
const { isLoading, status } = useJobStatus(jobId);

return (
  <button disabled={isLoading}>
    {isLoading ? `${status}... ${progress}%` : 'Start Job'}
  </button>
);
```

### 2. **Clear JobId After Completion**
```typescript
useJobStatus(jobId, {
  onComplete: (result) => {
    handleSuccess(result);
    setJobId(null); // Clear to stop unnecessary polling
  }
});
```

### 3. **Use Callbacks for Side Effects**
```typescript
// ✅ Good: Use callbacks
useJobStatus(jobId, {
  onComplete: (result) => {
    router.refresh();
    toast.success('Done!');
  }
});

// ❌ Bad: Poll result in useEffect
useEffect(() => {
  if (result) {
    router.refresh();
  }
}, [result]);
```

### 4. **Provide Retry Options**
```typescript
const { isFailed, error, retry } = useJobStatus(jobId);

if (isFailed) {
  return (
    <div>
      <p>Error: {error}</p>
      <button onClick={retry}>Try Again</button>
    </div>
  );
}
```

### 5. **Show Progress Feedback**
```typescript
const { status, progress } = useJobStatus(jobId);

return (
  <div>
    <p>{status === 'waiting' ? 'Queued...' : 'Processing...'}</p>
    <progress value={progress} max={100} />
    <span>{progress}%</span>
  </div>
);
```

---

## Troubleshooting

### Issue: Hook keeps polling after unmount
**Solution**: The hook automatically cleans up intervals. Ensure you're not preventing unmount.

### Issue: "Max polling attempts reached"
**Solution**: Increase `maxAttempts` option or check if job is actually stuck in backend queue.

### Issue: Authentication errors during polling
**Solution**: Ensure Supabase session is valid. The hook uses `authenticatedFetch` which handles JWT automatically.

### Issue: Progress stuck at 0%
**Solution**: Check if backend worker is updating job progress correctly. Progress is set by worker, not API.

---

## Migration Checklist

When migrating existing synchronous API calls to job queue:

- [ ] Replace direct API call with job submission call
- [ ] Add `useJobStatus` hook with jobId state
- [ ] Update loading state to use hook's `isLoading`
- [ ] Update success state to use hook's `onComplete` callback
- [ ] Update error handling to use hook's `onError` callback
- [ ] Add progress indicator using hook's `progress` value
- [ ] Test timeout scenarios (maxAttempts)
- [ ] Test error scenarios (backend failure, auth failure)
- [ ] Test user navigation during job processing
- [ ] Update TypeScript types for new result format

---

## Related Documentation

- **Backend Job API**: `backend/TEST_JOB_API.md`
- **Queue Implementation**: `backend/src/lib/queue.js`
- **Worker Implementation**: `backend/src/workers/*.js`
- **Authentication**: `frontend/app/lib/middleware/api-auth.ts`
- **Progress Tracker**: `AGENT_PROGRESS_TRACKER_2.md`

---

**Questions or Issues?**
Contact: Agent 3 (Infrastructure & DevOps Lead)
Created: 2025-10-29
