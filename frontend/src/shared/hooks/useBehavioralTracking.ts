
import { useEffect, useRef, useCallback } from 'react';
import { BehavioralIntelligenceService } from '@/lib/services/BehavioralIntelligenceService';

// TypeScript interfaces for behavioral tracking
export interface InteractionData {
  section?: string;
  duration?: number;
  startTime?: number;
  endTime?: number;
  timestamp?: number;
  sessionTime?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface ActionData {
  type?: string;
  timestamp?: number;
  sessionTime?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface ExportContext {
  type: string;
  componentContext: string;
  timestamp: number;
  sessionDuration: number;
  data?: Record<string, any>;
  [key: string]: string | number | boolean | Record<string, any> | undefined;
}

export interface CustomizationData {
  type: string;
  timestamp: number;
  [key: string]: string | number | boolean | undefined;
}

export interface SessionData {
  duration: number;
  interactions: Record<string, any>;
  endTime: number;
}

export interface UseBehavioralTrackingReturn {
  trackSectionTime: (sectionName: string) => () => void;
  trackAction: (actionType: string, actionData?: ActionData) => void;
  trackExport: (exportType: string, exportData?: Record<string, any>) => void;
  trackCustomization: (customizationType: string, customizationData?: CustomizationData) => void;
  trackToolSequence: (toolName: string) => void;
  trackVisit: () => void;
  getSessionData: () => SessionData | null;
  getInteractionCount: (actionType: string) => number;
  getTotalSessionTime: () => number;
}

export const useBehavioralTracking = (
  componentName: string, 
  userId: string
): UseBehavioralTrackingReturn => {
  const startTime = useRef<number>(Date.now());
  const interactions = useRef<Record<string, any>>({});
  const sectionTimers = useRef<Record<string, number>>({});
  const behavioralService = useRef<BehavioralIntelligenceService | null>(null);

  // Initialize behavioral service
  useEffect(() => {
    if (typeof window !== 'undefined') {
      behavioralService.current = new BehavioralIntelligenceService();
    }
  }, []);

  // Initialize tracking when hook mounts
  useEffect(() => {
    if (userId && componentName && behavioralService.current) {
      behavioralService.current.recordVisit(userId, componentName);
      startTime.current = Date.now();
    }
    
    // Cleanup function to record session when component unmounts
    return () => {
      if (userId && componentName && behavioralService.current) {
        const sessionDuration = Date.now() - startTime.current;
        behavioralService.current.recordSession(userId, componentName, {
          duration: sessionDuration,
          interactions: interactions.current,
          endTime: Date.now()
        });
      }
    };
  }, [componentName, userId]);

  const trackSectionTime = useCallback((sectionName: string): (() => void) => {
    if (!userId || !componentName || !behavioralService.current) {
      return () => {};
    }
    
    const sectionStartTime = Date.now();
    sectionTimers.current[sectionName] = sectionStartTime;
    
    // Return cleanup function to stop tracking
    return () => {
      const sectionEndTime = Date.now();
      const duration = sectionEndTime - sectionStartTime;
      
      // Record the section interaction
      behavioralService.current?.recordInteraction(userId, componentName, {
        section: sectionName,
        duration: duration,
        startTime: sectionStartTime,
        endTime: sectionEndTime
      });
      
      // Update local interactions reference
      interactions.current[`${sectionName}Time`] = 
        (interactions.current[`${sectionName}Time`] || 0) + duration;
    };
  }, [componentName, userId]);

  const trackAction = useCallback((actionType: string, actionData: ActionData = {}): void => {
    if (!userId || !componentName || !behavioralService.current) return;
    
    // Update local interaction count
    interactions.current[actionType] = (interactions.current[actionType] || 0) + 1;
    
    // Record the action
    behavioralService.current.recordAction(userId, componentName, actionType, {
      ...actionData,
      timestamp: Date.now(),
      sessionTime: Date.now() - startTime.current
    });
  }, [componentName, userId]);

  const trackExport = useCallback((exportType: string, exportData: Record<string, any> = {}): void => {
    if (!userId || !componentName || !behavioralService.current) return;
    
    const exportContext: ExportContext = {
      type: exportType,
      componentContext: componentName,
      timestamp: Date.now(),
      sessionDuration: Date.now() - startTime.current,
      data: exportData
    };
    
    behavioralService.current.recordExport(userId, exportContext);
    trackAction('export', exportContext as any);
  }, [componentName, userId, trackAction]);

  const trackCustomization = useCallback((customizationType: string, customizationData: CustomizationData = { type: '', timestamp: 0 }): void => {
    if (!userId || !componentName || !behavioralService.current) return;
    
    trackAction('customization', { 
      customizationType, 
      ...customizationData,
      timestamp: Date.now()
    });
  }, [componentName, userId, trackAction]);

  const trackToolSequence = useCallback((toolName: string): void => {
    if (!userId || !behavioralService.current) return;
    
    behavioralService.current.recordToolSequence(userId, toolName);
    trackAction('tool_sequence', { tool: toolName });
  }, [userId, trackAction]);

  const trackVisit = useCallback((): void => {
    if (!userId || !componentName || !behavioralService.current) return;
    
    behavioralService.current.recordVisit(userId, componentName);
  }, [componentName, userId]);

  const getSessionData = useCallback((): SessionData | null => {
    if (!userId || !componentName) return null;
    
    return {
      duration: Date.now() - startTime.current,
      interactions: { ...interactions.current },
      endTime: Date.now()
    };
  }, [userId, componentName]);

  const getInteractionCount = useCallback((actionType: string): number => {
    return interactions.current[actionType] || 0;
  }, []);

  const getTotalSessionTime = useCallback((): number => {
    return Date.now() - startTime.current;
  }, []);

  return {
    trackSectionTime,
    trackAction,
    trackExport,
    trackCustomization,
    trackToolSequence,
    trackVisit,
    getSessionData,
    getInteractionCount,
    getTotalSessionTime
  };
};

export default useBehavioralTracking;
