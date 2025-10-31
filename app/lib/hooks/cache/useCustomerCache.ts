/**
 * useCustomerCache Hook
 * 
 * Comprehensive cache hook for customer-related data including ICP and progress.
 * Provides unified access to customer data with intelligent caching and optimistic updates.
 * 
 * Phase 5, Chunk 1: TanStack Query Cache Hooks Implementation
 */

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { 
  CustomerData, 
  ICPData, 
  ProgressData, 
  UseCustomerCacheReturn,
  QUERY_KEYS,
  DEFAULT_CACHE_CONFIG,
  LONG_CACHE_CONFIG
} from './types';
// Note: Using direct API call instead of modernApiClient to avoid type conflicts
import { authenticatedFetch } from '@/app/lib/middleware/api-auth';
import toast from 'react-hot-toast';

interface UseCustomerCacheOptions {
  customerId: string | undefined;
  enabled?: boolean;
  refetchInterval?: number;
}

export function useCustomerCache({ 
  customerId, 
  enabled = true,
  refetchInterval
}: UseCustomerCacheOptions): UseCustomerCacheReturn {
  const queryClient = useQueryClient();

  // Customer data query
  const {
    data: customer,
    isLoading: isLoadingCustomer,
    error: customerError,
    refetch: refetchCustomer
  } = useQuery({
    queryKey: QUERY_KEYS.CUSTOMER(customerId!),
    queryFn: async () => {
      if (!customerId) throw new Error('Customer ID is required');
      
      try {
        const response = await authenticatedFetch(`/api/customer/${customerId}`, {
          method: 'GET'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch customer data: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch customer data');
        }
        
        return data.data;
      } catch (error) {
        console.error('❌ useCustomerCache: Customer fetch failed:', error);
        throw error;
      }
    },
    enabled: enabled && !!customerId,
    ...LONG_CACHE_CONFIG, // Customer data changes infrequently
    refetchInterval
  });

  // ICP data query
  const {
    data: icpData,
    isLoading: isLoadingICP,
    error: icpError,
    refetch: refetchICP
  } = useQuery({
    queryKey: QUERY_KEYS.CUSTOMER_ICP(customerId!),
    queryFn: async () => {
      if (!customerId) throw new Error('Customer ID is required');
      const response = await authenticatedFetch(`/api/customer/${customerId}/icp`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch customer ICP data: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch customer ICP data');
      }
      
      // Transform the data to match our ICPData interface
      const icpData = data.data;
      return {
        title: icpData.title || 'Ideal Customer Profile',
        description: icpData.description || 'AI-generated customer profile analysis',
        segments: icpData.segments || [],
        keyIndicators: icpData.keyIndicators || [],
        redFlags: icpData.redFlags || [],
        ratingCriteria: icpData.ratingCriteria || [],
        confidence: icpData.confidence || 0.85,
        generatedAt: icpData.generatedAt || new Date().toISOString(),
        lastUpdated: icpData.lastUpdated || new Date().toISOString(),
        version: icpData.version || '1.0',
        metadata: icpData.metadata || {}
      };
    },
    enabled: enabled && !!customerId,
    ...DEFAULT_CACHE_CONFIG
  });

  // Progress data query
  const {
    data: progress,
    isLoading: isLoadingProgress,
    error: progressError,
    refetch: refetchProgress
  } = useQuery({
    queryKey: QUERY_KEYS.CUSTOMER_PROGRESS(customerId!),
    queryFn: async () => {
      if (!customerId) throw new Error('Customer ID is required');
      const response = await authenticatedFetch(`/api/progress/${customerId}`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch progress data: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch progress data');
      }
      
      return data.data;
    },
    enabled: enabled && !!customerId,
    ...DEFAULT_CACHE_CONFIG,
    refetchInterval: 30000 // Progress updates every 30 seconds
  });

  // ICP generation mutation
  const generateICPMutation = useMutation({
    mutationFn: async (productData: any) => {
      if (!customerId) throw new Error('Customer ID is required');
      const response = await authenticatedFetch(`/api/customer/${customerId}/generate-icp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate ICP: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate ICP');
      }
      
      return data.data;
    },
    onSuccess: () => {
      // Invalidate and refetch ICP data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMER_ICP(customerId!) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMER_PROGRESS(customerId!) });
      toast.success('ICP analysis generated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to generate ICP analysis');
    }
  });

  // Computed loading state
  const isLoading = isLoadingCustomer || isLoadingICP || isLoadingProgress || generateICPMutation.isPending;

  // Computed error state
  const hasError = !!(customerError || icpError || progressError || generateICPMutation.error);

  // Refetch all data
  const refetchAll = useCallback(() => {
    refetchCustomer();
    refetchICP();
    refetchProgress();
  }, [refetchCustomer, refetchICP, refetchProgress]);

  // Cache invalidation methods
  const invalidateCustomer = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMER(customerId!) });
  }, [queryClient, customerId]);

  const invalidateICP = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMER_ICP(customerId!) });
  }, [queryClient, customerId]);

  const invalidateProgress = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMER_PROGRESS(customerId!) });
  }, [queryClient, customerId]);

  const invalidateAll = useCallback(() => {
    invalidateCustomer();
    invalidateICP();
    invalidateProgress();
  }, [invalidateCustomer, invalidateICP, invalidateProgress]);

  // Optimistic update methods
  const updateCustomer = useCallback((updates: Partial<CustomerData>) => {
    if (!customer) return;
    
    queryClient.setQueryData(QUERY_KEYS.CUSTOMER(customerId!), (oldData: CustomerData | undefined) => {
      if (!oldData) return oldData;
      return { ...oldData, ...updates };
    });
  }, [queryClient, customer, customerId]);

  const updateICP = useCallback((updates: Partial<ICPData>) => {
    if (!icpData) return;
    
    queryClient.setQueryData(QUERY_KEYS.CUSTOMER_ICP(customerId!), (oldData: ICPData | undefined) => {
      if (!oldData) return oldData;
      return { ...oldData, ...updates };
    });
  }, [queryClient, icpData, customerId]);

  const updateProgress = useCallback((updates: Partial<ProgressData>) => {
    if (!progress) return;
    
    queryClient.setQueryData(QUERY_KEYS.CUSTOMER_PROGRESS(customerId!), (oldData: ProgressData | undefined) => {
      if (!oldData) return oldData;
      return { ...oldData, ...updates };
    });
  }, [queryClient, progress, customerId]);

  return {
    // Data
    customer,
    icpData,
    progress,
    
    // Loading states
    isLoadingCustomer,
    isLoadingICP,
    isLoadingProgress,
    isLoading,
    
    // Error states
    customerError: customerError as Error | null,
    icpError: icpError as Error | null,
    progressError: progressError as Error | null,
    hasError,
    
    // Actions
    refetchCustomer,
    refetchICP,
    refetchProgress,
    refetchAll,
    
    // Cache management
    invalidateCustomer,
    invalidateICP,
    invalidateProgress,
    invalidateAll,
    
    // Optimistic updates
    updateCustomer,
    updateICP,
    updateProgress
  };
}

// Convenience hook for ICP generation
export function useGenerateICP(customerId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: any) => {
      if (!customerId) throw new Error('Customer ID is required');
      const response = await authenticatedFetch(`/api/customer/${customerId}/generate-icp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate ICP: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate ICP');
      }
      
      return data.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMER_ICP(customerId!) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMER_PROGRESS(customerId!) });
      toast.success('ICP analysis generated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to generate ICP analysis');
    }
  });
}

// Convenience hook for progress tracking
export function useTrackProgress(customerId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ action, metadata }: { action: string; metadata?: any }) => {
      if (!customerId) throw new Error('Customer ID is required');
      const response = await authenticatedFetch(`/api/progress/${customerId}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, metadata })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to track progress: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to track progress');
      }
      
      return data.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate progress-related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMER_PROGRESS(customerId!) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMER(customerId!) });
      
      // Show milestone notifications if any were triggered
      if (data?.milestonesTriggered?.length > 0) {
        toast.success(`Milestone achieved: ${data.milestonesTriggered[0].name}!`, {
          duration: 5000,
          icon: '🎉',
        });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to track progress');
    }
  });
}
