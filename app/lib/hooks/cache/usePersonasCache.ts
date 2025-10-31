/**
 * usePersonasCache Hook
 * 
 * Specialized cache hook for buyer personas data with generation and management capabilities.
 * Provides intelligent caching for persona data with optimistic updates.
 * 
 * Phase 5, Chunk 1: TanStack Query Cache Hooks Implementation
 */

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import {
  BuyerPersona,
  PersonasData,
  UsePersonasCacheReturn,
  QUERY_KEYS,
  DEFAULT_CACHE_CONFIG,
  SHORT_CACHE_CONFIG
} from './types';
import { authenticatedFetch } from '@/app/lib/middleware/api-auth';
import { useJobStatus } from '@/app/hooks/useJobStatus';
import { API_CONFIG } from '@/app/lib/config/api';
import toast from 'react-hot-toast';

interface UsePersonasCacheOptions {
  customerId: string | undefined;
  enabled?: boolean;
  refetchInterval?: number;
}

export function usePersonasCache({
  customerId,
  enabled = true,
  refetchInterval
}: UsePersonasCacheOptions): UsePersonasCacheReturn {
  const queryClient = useQueryClient();
  const [isGeneratingPersonas, setIsGeneratingPersonas] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  // Use job status hook to poll for persona generation completion
  const { status: jobStatus, progress: jobProgress, result: jobResult, error: jobError, isComplete, isFailed } = useJobStatus(jobId, {
    onComplete: (result) => {
      console.log('✅ Persona generation job completed:', result);

      // Update cache with generated personas
      if (result.personas) {
        const personasData: PersonasData = {
          personas: result.personas,
          summary: {
            totalPersonas: result.personas.length,
            averageConfidence: result.personas.reduce((acc: number, p: any) => acc + (p.confidence || 85), 0) / result.personas.length,
            keyInsights: result.metadata?.keyInsights || []
          },
          generatedAt: new Date().toISOString(),
          source: 'ai_generated'
        };

        queryClient.setQueryData(QUERY_KEYS.PERSONAS(customerId!), personasData);
        toast.success(`Generated ${result.personas.length} buyer personas successfully!`);
      }

      setIsGeneratingPersonas(false);
      setJobId(null); // Clear job ID after completion
    },
    onError: (error) => {
      console.error('❌ Persona generation job failed:', error);
      toast.error(error || 'Failed to generate buyer personas');
      setIsGeneratingPersonas(false);
      setJobId(null); // Clear job ID after failure
    },
    autoStart: true // Automatically start polling when jobId is set
  });

  // Personas data query
  const {
    data: personasData,
    isLoading: isLoadingPersonas,
    error: personasError,
    refetch: refetchPersonas
  } = useQuery({
    queryKey: QUERY_KEYS.PERSONAS(customerId!),
    queryFn: async () => {
      if (!customerId) throw new Error('Customer ID is required');
      
      // Try to fetch from Agent 2's production-ready personas API
      try {
        const response = await authenticatedFetch('/api/personas/current-user', {
          method: 'GET'
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.personas) {
            return result.personas;
          }
        }
      } catch (error) {
        console.log('No existing personas found, will generate new ones');
      }
      
      // Return empty personas data if none exist
      return {
        personas: [],
        summary: {
          totalPersonas: 0,
          averageConfidence: 0,
          keyInsights: []
        },
        generatedAt: new Date().toISOString(),
        source: 'empty'
      } as PersonasData;
    },
    enabled: enabled && !!customerId,
    ...DEFAULT_CACHE_CONFIG,
    refetchInterval
  });

  // Personas generation mutation - now uses job queue
  const generatePersonasMutation = useMutation({
    mutationFn: async (context: {
      companyContext: string;
      industry: string;
      targetMarket: string;
    }) => {
      if (!customerId) throw new Error('Customer ID is required');

      setIsGeneratingPersonas(true);

      try {
        console.log('👥 Starting async buyer persona generation...');
        console.log('📡 Fetching ICP data for user', customerId);

        // First, get ICP data from backend to use for persona generation
        const icpResponse = await authenticatedFetch(`/api/customer/${customerId}/icp`, {
          method: 'GET'
        });

        if (!icpResponse.ok) {
          throw new Error('Failed to fetch ICP data for persona generation');
        }

        const icpData = await icpResponse.json();
        console.log('✅ ICP data loaded for persona generation');

        // Build company context from ICP data
        let companyContext = context.companyContext;
        let industry = context.industry;
        let targetMarket = context.targetMarket;

        if (icpData.success && icpData.data) {
          const icp = icpData.data;
          companyContext = `Company: ${icp.title || 'Unknown'}\nDescription: ${icp.description || ''}\nSegments: ${icp.segments?.map((s: any) => s.name).join(', ') || ''}\nKey Indicators: ${icp.keyIndicators?.join(', ') || ''}`;
          industry = 'Technology'; // Default, could be extracted from ICP
          targetMarket = icp.segments?.map((s: any) => s.name).join(', ') || context.targetMarket;
        }

        console.log('🔍 Context built, length:', companyContext.length);

        // Validate context
        if (!companyContext || companyContext.length < 10) {
          throw new Error('Insufficient company context for persona generation. Please ensure ICP data is available.');
        }

        console.log('📤 Submitting persona generation job to queue...');

        // Submit job to async queue (Phase 4 integration)
        const jobResponse = await authenticatedFetch(`${API_CONFIG.backend}/api/jobs/personas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyContext,
            industry,
            targetMarket
          })
        });

        if (!jobResponse.ok) {
          const errorData = await jobResponse.json();
          throw new Error(errorData.error || 'Failed to submit persona generation job');
        }

        const jobData = await jobResponse.json();

        if (!jobData.success || !jobData.jobId) {
          throw new Error('Failed to get job ID from persona generation submission');
        }

        console.log('✅ Persona generation job submitted:', jobData.jobId);

        // Set job ID to trigger useJobStatus polling
        setJobId(jobData.jobId);

        return { jobId: jobData.jobId };

      } catch (error) {
        setIsGeneratingPersonas(false);
        throw error;
      }
    },
    onError: (error: any) => {
      console.error('❌ Persona generation job submission failed:', error);
      toast.error(error.message || 'Failed to submit persona generation job');
      setIsGeneratingPersonas(false);
    }
  });

  // Computed error state
  const hasError = !!(personasError || generatePersonasMutation.error);

  // Generate personas action
  const generatePersonas = useCallback(async (context: {
    companyContext: string;
    industry: string;
    targetMarket: string;
  }) => {
    await generatePersonasMutation.mutateAsync(context);
  }, [generatePersonasMutation]);

  // Cache invalidation
  const invalidatePersonas = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PERSONAS(customerId!) });
  }, [queryClient, customerId]);

  // Optimistic update methods
  const updatePersonas = useCallback((personas: BuyerPersona[]) => {
    queryClient.setQueryData(QUERY_KEYS.PERSONAS(customerId!), (oldData: PersonasData | undefined) => {
      if (!oldData) {
        return {
          personas,
          summary: {
            totalPersonas: personas.length,
            averageConfidence: personas.reduce((acc, p) => acc + p.confidence, 0) / personas.length,
            keyInsights: []
          },
          generatedAt: new Date().toISOString(),
          source: 'manual'
        };
      }
      
      return {
        ...oldData,
        personas,
        summary: {
          ...oldData.summary,
          totalPersonas: personas.length,
          averageConfidence: personas.reduce((acc, p) => acc + p.confidence, 0) / personas.length
        }
      };
    });
  }, [queryClient, customerId]);

  const addPersona = useCallback((persona: BuyerPersona) => {
    queryClient.setQueryData(QUERY_KEYS.PERSONAS(customerId!), (oldData: PersonasData | undefined) => {
      if (!oldData) {
        return {
          personas: [persona],
          summary: {
            totalPersonas: 1,
            averageConfidence: persona.confidence,
            keyInsights: []
          },
          generatedAt: new Date().toISOString(),
          source: 'manual'
        };
      }
      
      const newPersonas = [...oldData.personas, persona];
      return {
        ...oldData,
        personas: newPersonas,
        summary: {
          ...oldData.summary,
          totalPersonas: newPersonas.length,
          averageConfidence: newPersonas.reduce((acc, p) => acc + p.confidence, 0) / newPersonas.length
        }
      };
    });
  }, [queryClient, customerId]);

  const removePersona = useCallback((personaId: string) => {
    queryClient.setQueryData(QUERY_KEYS.PERSONAS(customerId!), (oldData: PersonasData | undefined) => {
      if (!oldData) return oldData;
      
      const newPersonas = oldData.personas.filter(p => p.id !== personaId);
      return {
        ...oldData,
        personas: newPersonas,
        summary: {
          ...oldData.summary,
          totalPersonas: newPersonas.length,
          averageConfidence: newPersonas.length > 0 
            ? newPersonas.reduce((acc, p) => acc + p.confidence, 0) / newPersonas.length 
            : 0
        }
      };
    });
  }, [queryClient, customerId]);

  return {
    // Data
    personas: personasData?.personas || [],
    personasData,
    
    // Loading states
    isLoadingPersonas,
    isGeneratingPersonas,
    
    // Error states
    personasError: personasError as Error | null,
    generationError: generatePersonasMutation.error as Error | null,
    hasError,
    
    // Actions
    refetchPersonas,
    generatePersonas,
    
    // Cache management
    invalidatePersonas,
    
    // Optimistic updates
    updatePersonas,
    addPersona,
    removePersona
  };
}

// Convenience hook for persona generation only
export function useGeneratePersonas(customerId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (context: {
      companyContext: string;
      industry: string;
      targetMarket: string;
    }) => {
      if (!customerId) throw new Error('Customer ID is required');
      
      const response = await authenticatedFetch('/api/ai/generate-personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...context,
          customerId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate personas');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Persona generation failed');
      }
      
      return result.data as PersonasData;
    },
    onSuccess: (data) => {
      // Update cache with new personas data
      queryClient.setQueryData(QUERY_KEYS.PERSONAS(customerId!), data);
      toast.success(`Generated ${data.personas.length} buyer personas successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to generate buyer personas');
    }
  });
}
