/**
 * useCompanyRatingCache Hook
 * 
 * Specialized cache hook for company rating data with analysis and management capabilities.
 * Provides intelligent caching for company ratings with optimistic updates.
 * 
 * Phase 5, Chunk 1: TanStack Query Cache Hooks Implementation
 */

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import {
  CompanyRating,
  UseCompanyRatingCacheReturn,
  QUERY_KEYS,
  DEFAULT_CACHE_CONFIG,
  SHORT_CACHE_CONFIG
} from './types';
import { authenticatedFetch } from '@/app/lib/middleware/api-auth';
import { useJobStatus } from '@/app/hooks/useJobStatus';
import { API_CONFIG } from '@/app/lib/config/api';
import toast from 'react-hot-toast';

interface UseCompanyRatingCacheOptions {
  customerId: string | undefined;
  enabled?: boolean;
  refetchInterval?: number;
}

export function useCompanyRatingCache({
  customerId,
  enabled = true,
  refetchInterval
}: UseCompanyRatingCacheOptions): UseCompanyRatingCacheReturn {
  const queryClient = useQueryClient();
  const [isAnalyzingCompany, setIsAnalyzingCompany] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  // Use job status hook to poll for company rating completion
  const { status: jobStatus, progress: jobProgress, result: jobResult, error: jobError, isComplete, isFailed } = useJobStatus(jobId, {
    onComplete: (result) => {
      console.log('✅ Company rating job completed:', result);

      // Update cache with rating result
      if (result.rating) {
        queryClient.setQueryData(QUERY_KEYS.COMPANY_RATINGS(customerId!), (oldRatings: CompanyRating[] = []) => {
          return [...oldRatings, result.rating];
        });
        toast.success('Company rating analysis complete!');
      }

      setIsAnalyzingCompany(false);
      setJobId(null); // Clear job ID after completion
    },
    onError: (error) => {
      console.error('❌ Company rating job failed:', error);
      toast.error(error || 'Failed to analyze company');
      setIsAnalyzingCompany(false);
      setJobId(null); // Clear job ID after failure
    },
    autoStart: true // Automatically start polling when jobId is set
  });

  // Company ratings query (all ratings for this customer)
  const {
    data: ratings = [],
    isLoading: isLoadingRatings,
    error: ratingsError,
    refetch: refetchRatings
  } = useQuery({
    queryKey: QUERY_KEYS.COMPANY_RATINGS(customerId!),
    queryFn: async () => {
      if (!customerId) throw new Error('Customer ID is required');
      
      try {
        // Use Agent 2's production-ready API endpoint
        const response = await authenticatedFetch('/api/ratings/current-user', {
          method: 'GET'
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            return result.data;
          }
        }
      } catch (error) {
        console.log('No existing company ratings found');
      }
      
      // Return empty array if no ratings exist
      return [];
    },
    enabled: enabled && !!customerId,
    ...DEFAULT_CACHE_CONFIG,
    refetchInterval
  });

  // Company analysis mutation - now uses job queue
  const analyzeCompanyMutation = useMutation({
    mutationFn: async ({ companyName, userId }: { companyName: string; userId?: string }) => {
      if (!companyName.trim()) {
        throw new Error('Company name is required');
      }

      setIsAnalyzingCompany(true);

      try {
        console.log(`🔍 Starting async company analysis for: ${companyName}`);

        // Submit job to async queue (Phase 4 integration)
        console.log('📤 Submitting company rating job to queue...');
        const jobResponse = await authenticatedFetch(`${API_CONFIG.backend}/api/jobs/rate-company`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyUrl: companyName.trim(), // Backend expects companyUrl parameter
            icpFrameworkId: customerId // Optional: link to ICP framework
          })
        });

        if (!jobResponse.ok) {
          const errorData = await jobResponse.json();
          throw new Error(errorData.error || 'Failed to submit company rating job');
        }

        const jobData = await jobResponse.json();

        if (!jobData.success || !jobData.jobId) {
          throw new Error('Failed to get job ID from company rating submission');
        }

        console.log('✅ Company rating job submitted:', jobData.jobId);

        // Set job ID to trigger useJobStatus polling
        setJobId(jobData.jobId);

        return { jobId: jobData.jobId };

      } catch (error) {
        setIsAnalyzingCompany(false);
        throw error;
      }
    },
    onError: (error: any) => {
      console.error('❌ Company rating job submission failed:', error);
      toast.error(error.message || 'Failed to submit company rating job');
      setIsAnalyzingCompany(false);
    }
  });

  // Computed error state
  const hasError = !!(ratingsError || analyzeCompanyMutation.error);

  // Analyze company action
  const analyzeCompany = useCallback(async (companyName: string, userId?: string) => {
    await analyzeCompanyMutation.mutateAsync({ companyName, userId });
  }, [analyzeCompanyMutation]);

  // Cache invalidation
  const invalidateRatings = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANY_RATINGS(customerId!) });
  }, [queryClient, customerId]);

  // Optimistic update methods
  const addRating = useCallback((rating: CompanyRating) => {
    queryClient.setQueryData(QUERY_KEYS.COMPANY_RATINGS(customerId!), (oldRatings: CompanyRating[] | undefined) => {
      const existingRatings = oldRatings || [];
      // Remove any existing rating for the same company
      const filteredRatings = existingRatings.filter(r => r.companyName !== rating.companyName);
      // Add the new rating
      return [...filteredRatings, rating];
    });
  }, [queryClient, customerId]);

  const updateRating = useCallback((ratingId: string, updates: Partial<CompanyRating>) => {
    queryClient.setQueryData(QUERY_KEYS.COMPANY_RATINGS(customerId!), (oldRatings: CompanyRating[] | undefined) => {
      if (!oldRatings) return oldRatings;
      
      return oldRatings.map(rating => 
        rating.companyName === ratingId 
          ? { ...rating, ...updates }
          : rating
      );
    });
  }, [queryClient, customerId]);

  const removeRating = useCallback((ratingId: string) => {
    queryClient.setQueryData(QUERY_KEYS.COMPANY_RATINGS(customerId!), (oldRatings: CompanyRating[] | undefined) => {
      if (!oldRatings) return oldRatings;
      
      return oldRatings.filter(rating => rating.companyName !== ratingId);
    });
  }, [queryClient, customerId]);

  // Get current rating (most recent)
  const currentRating = ratings.length > 0 ? ratings[ratings.length - 1] : undefined;

  return {
    // Data
    ratings,
    currentRating,
    
    // Loading states
    isLoadingRatings,
    isAnalyzingCompany,
    
    // Error states
    ratingsError: ratingsError as Error | null,
    analysisError: analyzeCompanyMutation.error as Error | null,
    hasError,
    
    // Actions
    refetchRatings,
    analyzeCompany,
    
    // Cache management
    invalidateRatings,
    
    // Optimistic updates
    addRating,
    updateRating,
    removeRating
  };
}

// Convenience hook for company analysis only
export function useAnalyzeCompany(customerId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ companyName, userId }: { companyName: string; userId?: string }) => {
      if (!companyName.trim()) {
        throw new Error('Company name is required');
      }
      
      // Step 1: Get company research data
      const researchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company-research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: companyName.trim(),
          includeLinkedIn: true,
          includeNews: true,
          includeFinancials: true
        })
      });
      
      if (!researchResponse.ok) {
        throw new Error('Failed to fetch company research data');
      }
      
      const researchData = await researchResponse.json();
      
      // Step 2: Prepare rating framework
      const defaultFramework = {
        criteria: [
          {
            id: 'company_size',
            name: 'Company Size',
            weight: 20,
            description: 'Number of employees and revenue scale'
          },
          {
            id: 'industry_fit',
            name: 'Industry Fit',
            weight: 25,
            description: 'Alignment with target industry and market'
          },
          {
            id: 'technology_adoption',
            name: 'Technology Adoption',
            weight: 20,
            description: 'Likelihood to adopt new technologies'
          },
          {
            id: 'budget_capacity',
            name: 'Budget Capacity',
            weight: 15,
            description: 'Financial capacity for new investments'
          },
          {
            id: 'decision_making',
            name: 'Decision Making Process',
            weight: 20,
            description: 'Speed and complexity of decision making'
          }
        ]
      };
      
      // Step 3: Call the rating API
      const ratingResponse = await fetch('/api/ai/rate-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: companyName.trim(),
          researchData: researchData,
          framework: defaultFramework,
          customerId: userId || customerId
        })
      });
      
      if (!ratingResponse.ok) {
        const errorData = await ratingResponse.json();
        throw new Error(errorData.error || 'Failed to generate company rating');
      }
      
      const ratingResult = await ratingResponse.json();
      
      if (!ratingResult.success) {
        throw new Error(ratingResult.error || 'Rating generation failed');
      }
      
      // Transform API response to widget format
      const rating: CompanyRating = {
        companyName: companyName.trim(),
        generatedAt: new Date().toISOString(),
        confidence: ratingResult.data.confidence,
        overallScore: ratingResult.data.overallScore,
        tier: ratingResult.data.tier,
        recommendation: ratingResult.data.recommendation,
        criteria: ratingResult.data.criteria,
        insights: ratingResult.data.insights,
        salesActions: ratingResult.data.salesActions
      };
      
      return rating;
    },
    onSuccess: (rating) => {
      // Add the new rating to the cache
      queryClient.setQueryData(QUERY_KEYS.COMPANY_RATINGS(customerId!), (oldRatings: CompanyRating[] | undefined) => {
        const existingRatings = oldRatings || [];
        // Remove any existing rating for the same company
        const filteredRatings = existingRatings.filter(r => r.companyName !== rating.companyName);
        // Add the new rating
        return [...filteredRatings, rating];
      });
      
      toast.success(`Company analysis completed for ${rating.companyName}!`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to analyze company');
    }
  });
}
