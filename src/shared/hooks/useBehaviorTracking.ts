/**
 * useBehaviorTracking Hook
 * Phase 3.1: Comprehensive User Behavior Tracking System
 *
 * React hook for tracking user behavior across the platform
 * Integrates with behaviorTrackingService and SystematicScalingContext
 */

'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  behaviorTrackingService,
  getDeviceInfo,
  type EventType,
  type ToolId,
  type BusinessImpact,
  type CompetencyArea,
  type GrowthStage,
} from '@/app/lib/services/behaviorTrackingService';

interface UseBehaviorTrackingOptions {
  customerId: string;
  currentARR?: string;
  targetARR?: string;
  growthStage?: GrowthStage;
}

interface TrackToolUsageParams {
  toolId: ToolId;
  toolSection?: string;
  businessImpact?: BusinessImpact;
  competencyArea?: CompetencyArea;
  metadata?: Record<string, any>;
}

interface TrackExportParams {
  toolId: ToolId;
  exportType: 'pdf' | 'csv' | 'email' | 'share';
  businessImpact?: BusinessImpact;
  metadata?: Record<string, any>;
}

interface TrackMilestoneParams {
  competencyArea: CompetencyArea;
  milestoneDescription: string;
  professionalCredibility: number;
  businessImpact?: BusinessImpact;
}

export function useBehaviorTracking(options: UseBehaviorTrackingOptions) {
  const { customerId, currentARR, targetARR, growthStage } = options;
  const sessionInitialized = useRef(false);
  const pageEntryTime = useRef<number>(Date.now());

  // Initialize session on mount
  useEffect(() => {
    if (!sessionInitialized.current && customerId) {
      const deviceInfo = getDeviceInfo();
      behaviorTrackingService.initializeSessionInDB(customerId, deviceInfo);
      sessionInitialized.current = true;
    }
  }, [customerId]);

  // Track page views automatically
  useEffect(() => {
    if (!customerId) return;

    const currentPath = window.location.pathname;
    pageEntryTime.current = Date.now();

    behaviorTrackingService.trackNavigation({
      customer_id: customerId,
      to_page: currentPath,
    });

    // Cleanup: track page exit duration
    return () => {
      const timeSpent = Date.now() - pageEntryTime.current;
      // Don't track if less than 1 second (likely navigation/refresh)
      if (timeSpent > 1000) {
        behaviorTrackingService.trackEvent({
          customer_id: customerId,
          event_type: 'content_interaction',
          business_impact: 'low',
          event_metadata: {
            page: currentPath,
            time_spent_ms: timeSpent,
          },
        });
      }
    };
  }, [customerId]);

  /**
   * Track tool usage
   */
  const trackToolUsage = useCallback(
    async (params: TrackToolUsageParams) => {
      if (!customerId) return;

      await behaviorTrackingService.trackToolUsage({
        customer_id: customerId,
        tool_id: params.toolId,
        tool_section: params.toolSection,
        business_impact: params.businessImpact,
        competency_area: params.competencyArea,
        metadata: params.metadata,
        scaling_context: {
          current_arr: currentARR,
          target_arr: targetARR,
          growth_stage: growthStage,
        },
      });
    },
    [customerId, currentARR, targetARR, growthStage]
  );

  /**
   * Track export action
   */
  const trackExport = useCallback(
    async (params: TrackExportParams) => {
      if (!customerId) return;

      await behaviorTrackingService.trackExport({
        customer_id: customerId,
        tool_id: params.toolId,
        export_type: params.exportType,
        business_impact: params.businessImpact || 'high',
        metadata: params.metadata,
      });
    },
    [customerId]
  );

  /**
   * Track competency milestone
   */
  const trackMilestone = useCallback(
    async (params: TrackMilestoneParams) => {
      if (!customerId) return;

      await behaviorTrackingService.trackCompetencyMilestone({
        customer_id: customerId,
        competency_area: params.competencyArea,
        milestone_description: params.milestoneDescription,
        professional_credibility: params.professionalCredibility,
        business_impact: params.businessImpact,
      });
    },
    [customerId]
  );

  /**
   * Track generic event
   */
  const trackEvent = useCallback(
    async (params: {
      eventType: EventType;
      toolId?: ToolId;
      businessImpact: BusinessImpact;
      metadata?: Record<string, any>;
      competencyArea?: CompetencyArea;
    }) => {
      if (!customerId) return;

      await behaviorTrackingService.trackEvent({
        customer_id: customerId,
        event_type: params.eventType,
        tool_id: params.toolId,
        business_impact: params.businessImpact,
        competency_area: params.competencyArea,
        event_metadata: params.metadata,
        current_arr: currentARR,
        target_arr: targetARR,
        growth_stage: growthStage,
        systematic_approach: true,
      });
    },
    [customerId, currentARR, targetARR, growthStage]
  );

  /**
   * Track button click
   */
  const trackClick = useCallback(
    async (params: {
      buttonId: string;
      buttonLabel: string;
      toolId?: ToolId;
      businessImpact?: BusinessImpact;
    }) => {
      await trackEvent({
        eventType: 'content_interaction',
        toolId: params.toolId,
        businessImpact: params.businessImpact || 'low',
        metadata: {
          interaction_type: 'button_click',
          button_id: params.buttonId,
          button_label: params.buttonLabel,
        },
      });
    },
    [trackEvent]
  );

  /**
   * Track form submission
   */
  const trackFormSubmit = useCallback(
    async (params: {
      formId: string;
      formType: string;
      toolId?: ToolId;
      businessImpact?: BusinessImpact;
      success: boolean;
    }) => {
      await trackEvent({
        eventType: 'professional_action',
        toolId: params.toolId,
        businessImpact: params.businessImpact || 'medium',
        metadata: {
          form_id: params.formId,
          form_type: params.formType,
          success: params.success,
        },
      });
    },
    [trackEvent]
  );

  /**
   * Track resource generation (AI content)
   */
  const trackResourceGeneration = useCallback(
    async (params: {
      toolId: ToolId;
      resourceType: string;
      businessImpact?: BusinessImpact;
      metadata?: Record<string, any>;
    }) => {
      await trackEvent({
        eventType: 'resource_generation',
        toolId: params.toolId,
        businessImpact: params.businessImpact || 'high',
        metadata: {
          resource_type: params.resourceType,
          ...params.metadata,
        },
      });
    },
    [trackEvent]
  );

  /**
   * Get behavior insights
   */
  const getInsights = useCallback(async () => {
    if (!customerId) return null;
    return await behaviorTrackingService.getInsights(customerId);
  }, [customerId]);

  /**
   * Get recent events
   */
  const getRecentEvents = useCallback(
    async (limit: number = 50) => {
      if (!customerId) return [];
      return await behaviorTrackingService.getRecentEvents(customerId, limit);
    },
    [customerId]
  );

  return {
    // Core tracking methods
    trackToolUsage,
    trackExport,
    trackMilestone,
    trackEvent,

    // Convenience methods
    trackClick,
    trackFormSubmit,
    trackResourceGeneration,

    // Analytics methods
    getInsights,
    getRecentEvents,

    // Session info
    sessionId: behaviorTrackingService.getSessionId(),
  };
}

/**
 * Hook for tracking a specific tool's usage
 * Automatically tracks tool entry/exit
 */
export function useToolTracking(
  customerId: string,
  toolId: ToolId,
  toolSection?: string
) {
  const { trackToolUsage } = useBehaviorTracking({ customerId });
  const entryTime = useRef<number>(Date.now());

  useEffect(() => {
    // Track tool entry
    entryTime.current = Date.now();
    trackToolUsage({
      toolId,
      toolSection,
      businessImpact: 'medium',
      metadata: { action: 'tool_entered' },
    });

    // Track tool exit on unmount
    return () => {
      const timeSpent = Date.now() - entryTime.current;
      if (timeSpent > 3000) {
        // Only track if spent more than 3 seconds
        trackToolUsage({
          toolId,
          toolSection,
          businessImpact: 'medium',
          metadata: {
            action: 'tool_exited',
            time_spent_ms: timeSpent,
            time_spent_seconds: Math.floor(timeSpent / 1000),
          },
        });
      }
    };
  }, [toolId, toolSection, trackToolUsage]);

  return { trackToolUsage };
}
