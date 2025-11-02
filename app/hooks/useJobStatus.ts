/**
 * useJobStatus Hook
 *
 * React hook for polling job status from the backend job queue API.
 * Automatically polls every 2 seconds until job completes or fails.
 *
 * @module hooks/useJobStatus
 * @created 2025-10-29
 * @author Agent 3 (Infrastructure & DevOps Lead)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { authenticatedFetch } from '@/app/lib/middleware/api-auth';
import { API_CONFIG } from '@/app/lib/config/api';

// ============================================================================
// TypeScript Types & Interfaces
// ============================================================================

/**
 * Job status states matching backend job queue
 */
export type JobStatus = 'waiting' | 'active' | 'completed' | 'failed';

/**
 * Job queue types
 */
export type JobQueueType = 'persona-generation' | 'company-rating' | 'batch-rating' | 'icp-generation';

/**
 * Job metadata from backend
 */
export interface JobMetadata {
  customerId: string;
  companyContext?: string;
  industry?: string;
  targetMarket?: string;
  companyUrl?: string;
  companies?: string[];
  icpFrameworkId?: string;
  submittedAt: string;
}

/**
 * Job result structure (varies by job type)
 */
export interface JobResult {
  success: boolean;
  personas?: any[]; // For persona generation jobs
  savedId?: string;
  rating?: any; // For rating jobs
  results?: any[]; // For batch jobs
  metadata?: Record<string, any>;
  [key: string]: any;
}

/**
 * Full job status response from backend
 */
export interface JobStatusData {
  jobId: string;
  queueName: string;
  status: JobStatus;
  progress: number; // 0-100
  data: JobMetadata;
  result: JobResult | null;
  failedReason: string | null;
  attemptsMade: number;
  timestamp: number;
  processedOn: number | null;
  finishedOn: number | null;
}

/**
 * Hook configuration options
 */
export interface UseJobStatusOptions {
  /**
   * Polling interval in milliseconds
   * @default 2000 (2 seconds)
   */
  pollInterval?: number;

  /**
   * Callback when job completes successfully
   */
  onComplete?: (result: JobResult) => void;

  /**
   * Callback when job fails
   */
  onError?: (error: string) => void;

  /**
   * Callback on each status update
   */
  onStatusUpdate?: (status: JobStatusData) => void;

  /**
   * Whether to start polling immediately
   * @default true
   */
  autoStart?: boolean;

  /**
   * Maximum number of polling attempts before giving up
   * @default 150 (5 minutes at 2-second intervals)
   */
  maxAttempts?: number;
}

/**
 * Hook return value
 */
export interface UseJobStatusReturn {
  /** Current job status */
  status: JobStatus | null;

  /** Job progress (0-100) */
  progress: number;

  /** Job result when completed */
  result: JobResult | null;

  /** Error message if failed */
  error: string | null;

  /** Full job status data */
  jobData: JobStatusData | null;

  /** Whether currently polling */
  isPolling: boolean;

  /** Whether job is in progress (waiting or active) */
  isLoading: boolean;

  /** Whether job completed successfully */
  isComplete: boolean;

  /** Whether job failed */
  isFailed: boolean;

  /** Start polling manually */
  startPolling: () => void;

  /** Stop polling manually */
  stopPolling: () => void;

  /** Retry failed job polling */
  retry: () => void;
}

// ============================================================================
// Main Hook Implementation
// ============================================================================

/**
 * Hook for polling job status from backend queue
 *
 * @example
 * ```typescript
 * // Submit job first
 * const { jobId } = await authenticatedFetch('/api/jobs/personas', {
 *   method: 'POST',
 *   body: JSON.stringify({ companyContext, industry, targetMarket })
 * }).then(r => r.json());
 *
 * // Poll status
 * const { status, progress, result, isComplete } = useJobStatus(jobId, {
 *   onComplete: (result) => {
 *     console.log('Personas generated:', result.personas);
 *   },
 *   onError: (error) => {
 *     console.error('Job failed:', error);
 *   }
 * });
 * ```
 */
export function useJobStatus(
  jobId: string | null,
  options: UseJobStatusOptions = {}
): UseJobStatusReturn {
  const {
    pollInterval = 2000,
    onComplete,
    onError,
    onStatusUpdate,
    autoStart = true,
    maxAttempts = 150, // 5 minutes at 2-second intervals
  } = options;

  // State
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [result, setResult] = useState<JobResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobData, setJobData] = useState<JobStatusData | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);

  // Refs for interval management
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const attemptCountRef = useRef<number>(0);
  const callbacksRef = useRef({ onComplete, onError, onStatusUpdate });

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = { onComplete, onError, onStatusUpdate };
  }, [onComplete, onError, onStatusUpdate]);

  /**
   * Fetch job status from backend
   */
  const fetchJobStatus = useCallback(async () => {
    if (!jobId) {
      console.warn('[useJobStatus] No jobId provided');
      return;
    }

    try {
      const url = `${API_CONFIG.backend}/api/jobs/${jobId}`;

      const response = await authenticatedFetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch job status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !data.job) {
        throw new Error('Invalid response format from job status API');
      }

      const jobStatus: JobStatusData = data.job;

      // Update state
      setJobData(jobStatus);
      setStatus(jobStatus.status);
      setProgress(jobStatus.progress);

      // Call status update callback
      if (callbacksRef.current.onStatusUpdate) {
        callbacksRef.current.onStatusUpdate(jobStatus);
      }

      // Handle completed state
      if (jobStatus.status === 'completed') {
        setResult(jobStatus.result);
        setIsPolling(false);

        if (callbacksRef.current.onComplete && jobStatus.result) {
          callbacksRef.current.onComplete(jobStatus.result);
        }

        // Stop polling
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }

      // Handle failed state
      else if (jobStatus.status === 'failed') {
        const errorMessage = jobStatus.failedReason || 'Job failed with unknown error';
        setError(errorMessage);
        setIsPolling(false);

        if (callbacksRef.current.onError) {
          callbacksRef.current.onError(errorMessage);
        }

        // Stop polling
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useJobStatus] Error fetching job status:', errorMessage);
      setError(errorMessage);
      setIsPolling(false);

      if (callbacksRef.current.onError) {
        callbacksRef.current.onError(errorMessage);
      }

      // Stop polling on error
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [jobId]);

  /**
   * Start polling
   */
  const startPolling = useCallback(() => {
    if (!jobId) {
      console.warn('[useJobStatus] Cannot start polling without jobId');
      return;
    }

    if (isPolling) {
      console.warn('[useJobStatus] Already polling');
      return;
    }

    console.log(`[useJobStatus] Starting polling for job: ${jobId}`);
    setIsPolling(true);
    attemptCountRef.current = 0;

    // Initial fetch
    fetchJobStatus();

    // Set up interval
    intervalRef.current = setInterval(() => {
      attemptCountRef.current += 1;

      // Check max attempts
      if (attemptCountRef.current >= maxAttempts) {
        console.warn(`[useJobStatus] Max polling attempts reached (${maxAttempts})`);
        setError('Job status polling timed out');
        setIsPolling(false);

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if (callbacksRef.current.onError) {
          callbacksRef.current.onError('Job status polling timed out');
        }
        return;
      }

      fetchJobStatus();
    }, pollInterval);
  }, [jobId, isPolling, pollInterval, maxAttempts, fetchJobStatus]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    console.log('[useJobStatus] Stopping polling');
    setIsPolling(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Retry after failure
   */
  const retry = useCallback(() => {
    console.log('[useJobStatus] Retrying...');
    setError(null);
    setStatus(null);
    setProgress(0);
    setResult(null);
    attemptCountRef.current = 0;
    startPolling();
  }, [startPolling]);

  // Auto-start polling when jobId changes
  useEffect(() => {
    if (jobId && autoStart) {
      startPolling();
    }

    // Cleanup on unmount or jobId change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [jobId, autoStart, startPolling]);

  // Computed values
  const isLoading = status === 'waiting' || status === 'active';
  const isComplete = status === 'completed';
  const isFailed = status === 'failed';

  return {
    status,
    progress,
    result,
    error,
    jobData,
    isPolling,
    isLoading,
    isComplete,
    isFailed,
    startPolling,
    stopPolling,
    retry,
  };
}

export default useJobStatus;
