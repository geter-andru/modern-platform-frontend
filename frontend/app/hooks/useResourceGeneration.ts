'use client';

import { useState, useEffect, useCallback } from 'react';
import eventBus from '@/app/lib/events/EventBus';
import eventManager from '@/app/lib/events/EventManager';
import type { ResourceGenerationProgressPayload, ResourceGenerationCompletedPayload, ResourceGenerationFailedPayload } from '@/app/lib/events/ResourceGenerationEvents';

/**
 * Custom hook for resource generation with event-driven progress tracking
 */

interface ResourceGenerationState {
  isGenerating: boolean;
  progress: number;
  currentStep: string;
  error?: string;
  mcpServicesUsed?: string[];
}

interface GeneratedResource {
  id: string;
  content: string;
  quality: number;
  generationMethod: 'template' | 'enhanced' | 'premium';
  cost: number;
  duration: number;
  sources: string[];
  confidence: number;
  generatedAt: Date;
}

export function useResourceGeneration() {
  const [generationStates, setGenerationStates] = useState<Record<string, ResourceGenerationState>>({});
  const [generatedResources, setGeneratedResources] = useState<Record<string, GeneratedResource>>({});
  const [isEventSystemInitialized, setIsEventSystemInitialized] = useState(false);

  // Initialize event system
  useEffect(() => {
    const initializeEventSystem = async () => {
      try {
        await eventManager.initialize();
        setIsEventSystemInitialized(true);
        console.log('✅ Resource generation event system initialized');
      } catch (error) {
        console.error('❌ Failed to initialize event system:', error);
      }
    };

    initializeEventSystem();

    // Cleanup on unmount
    return () => {
      if (isEventSystemInitialized) {
        eventManager.shutdown();
      }
    };
  }, [isEventSystemInitialized]);

  // Set up event listeners
  useEffect(() => {
    if (!isEventSystemInitialized) return;

    console.log('📡 Setting up resource generation event listeners');

    // Handle generation progress events
    const unsubscribeProgress = eventBus.on('resource_generation_progress', (event, payload) => {
      const { resourceId, progress, currentStep, mcpServicesUsed } = payload as ResourceGenerationProgressPayload;
      
      setGenerationStates(prev => ({
        ...prev,
        [resourceId]: {
          isGenerating: true,
          progress,
          currentStep,
          mcpServicesUsed
        }
      }));
    });

    // Handle generation completed events
    const unsubscribeCompleted = eventBus.on('resource_generation_completed', (event, payload) => {
      const { resourceId, result } = payload as ResourceGenerationCompletedPayload;
      
      // Update generated resources
      const generatedResource: GeneratedResource = {
        id: resourceId,
        content: result.content,
        quality: result.quality,
        generationMethod: result.generationMethod,
        cost: result.cost,
        duration: result.duration,
        sources: result.sources,
        confidence: result.confidence,
        generatedAt: new Date()
      };

      setGeneratedResources(prev => ({
        ...prev,
        [resourceId]: generatedResource
      }));

      // Clear generation state
      setGenerationStates(prev => {
        const newStates = { ...prev };
        delete newStates[resourceId];
        return newStates;
      });
    });

    // Handle generation failed events
    const unsubscribeFailed = eventBus.on('resource_generation_failed', (event, payload) => {
      const { resourceId, error } = payload as ResourceGenerationFailedPayload;
      
      setGenerationStates(prev => ({
        ...prev,
        [resourceId]: {
          isGenerating: false,
          progress: 0,
          currentStep: 'Generation failed',
          error
        }
      }));

      // Clear error state after delay
      setTimeout(() => {
        setGenerationStates(prev => {
          const newStates = { ...prev };
          delete newStates[resourceId];
          return newStates;
        });
      }, 5000);
    });

    // Cleanup event listeners
    return () => {
      unsubscribeProgress();
      unsubscribeCompleted();
      unsubscribeFailed();
    };
  }, [isEventSystemInitialized]);

  // Generate resource function
  const generateResource = useCallback(async (
    resourceId: string,
    resourceType: string,
    customerData: any,
    productContext?: any,
    stakeholderContext?: any
  ) => {
    try {
      console.log(`🎯 Hook: Requesting generation of ${resourceId}`);

      // Call the API route
      const response = await fetch('/api/resources/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId,
          resourceType,
          customerData,
          productContext,
          stakeholderContext
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Generation failed');
      }

      const result = await response.json();
      console.log('✅ Hook: Resource generation completed successfully');
      
      return result;

    } catch (error: any) {
      console.error('❌ Hook: Resource generation failed:', error);
      throw error;
    }
  }, []);

  // Get resource timeline
  const getResourceTimeline = useCallback((resourceId: string) => {
    if (!isEventSystemInitialized) {
      return {
        resourceId,
        events: [],
        status: 'unknown' as const
      };
    }

    return eventManager.getResourceTimeline(resourceId);
  }, [isEventSystemInitialized]);

  // Get system health metrics
  const getSystemHealth = useCallback(() => {
    if (!isEventSystemInitialized) {
      return {
        healthy: false,
        eventProcessingRate: 0,
        averageEventLatency: 0,
        errorRate: 0,
        recentActivity: false
      };
    }

    return eventManager.getHealthMetrics();
  }, [isEventSystemInitialized]);

  // Get event system status
  const getEventSystemStatus = useCallback(() => {
    if (!isEventSystemInitialized) {
      return {
        initialized: false,
        uptime: 0,
        config: {},
        eventStats: { totalEvents: 0, eventsByType: {}, recentEvents: 0 },
        activeHandlers: 0
      };
    }

    return eventManager.getStatus();
  }, [isEventSystemInitialized]);

  // Check if a resource is currently generating
  const isResourceGenerating = useCallback((resourceId: string): boolean => {
    return generationStates[resourceId]?.isGenerating || false;
  }, [generationStates]);

  // Check if a resource has been generated
  const isResourceGenerated = useCallback((resourceId: string): boolean => {
    return generatedResources[resourceId] !== undefined;
  }, [generatedResources]);

  // Get resource generation state
  const getResourceState = useCallback((resourceId: string): ResourceGenerationState | undefined => {
    return generationStates[resourceId];
  }, [generationStates]);

  // Get generated resource
  const getGeneratedResource = useCallback((resourceId: string): GeneratedResource | undefined => {
    return generatedResources[resourceId];
  }, [generatedResources]);

  // Clear all generated resources
  const clearGeneratedResources = useCallback(() => {
    setGeneratedResources({});
    setGenerationStates({});
    console.log('🗑️ Cleared all generated resources');
  }, []);

  return {
    // State
    generationStates,
    generatedResources,
    isEventSystemInitialized,

    // Actions
    generateResource,
    clearGeneratedResources,

    // Getters
    isResourceGenerating,
    isResourceGenerated,
    getResourceState,
    getGeneratedResource,
    getResourceTimeline,
    getSystemHealth,
    getEventSystemStatus,

    // Computed values
    totalGeneratedResources: Object.keys(generatedResources).length,
    activeGenerations: Object.keys(generationStates).filter(id => generationStates[id].isGenerating).length,
    hasErrors: Object.values(generationStates).some(state => state.error),
    systemReady: isEventSystemInitialized
  };
}