
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

// TypeScript interfaces for progressive engagement
export interface CompellingAspectShown {
  immediate_rating: boolean;
  financial_impact: boolean;
  business_case: boolean;
  integration_reveal: boolean;
}

export interface RevelationTriggers {
  tier_classification: boolean;
  technical_costs: boolean;
  stakeholder_views: boolean;
  tool_integration: boolean;
}

export interface EngagementState {
  currentPhase: 'welcome' | 'tool_focus' | 'integration_reveal';
  activeToolFocus: string | null;
  toolsCompleted: string[];
  integrationUnlocked: boolean;
  userJourneyStep: number;
}

export interface InteractionDepth {
  icp_analysis: {
    ratings_completed: number;
    time_spent: number;
  };
  cost_calculator: {
    charts_explored: number;
    scenarios_run: number;
  };
  business_case: {
    sections_viewed: number;
    stakeholder_modes: number;
  };
}

export interface CustomerData {
  icp_completed?: boolean;
  cost_completed?: boolean;
  business_case_completed?: boolean;
  [key: string]: string | number | boolean | object | undefined;
}

export interface ProgressData {
  competencyLevel?: string;
  skillLevels?: {
    customerAnalysis: number;
    valueCommunication: number;
    executiveReadiness: number;
    overall: number;
  };
  [key: string]: string | number | boolean | object | undefined;
}

export interface UseProgressiveEngagementReturn {
  compellingAspectShown: CompellingAspectShown;
  revelationTriggers: RevelationTriggers;
  engagementState: EngagementState;
  interactionDepth: InteractionDepth;
  showCompellingAspect: (aspectType: keyof CompellingAspectShown, toolName?: string) => void;
  triggerRevelation: (triggerType: keyof RevelationTriggers) => void;
  updateEngagementState: (updates: Partial<EngagementState>) => void;
  updateInteractionDepth: (tool: keyof InteractionDepth, updates: Partial<InteractionDepth[keyof InteractionDepth]>) => void;
  checkRevelationEligibility: (triggerType: keyof RevelationTriggers) => boolean;
  getNextRevelation: () => string | null;
  getEngagementProgress: () => number;
  resetEngagement: () => void;
}

/**
 * Manages progressive engagement state and revelation system
 * Integrates with Supabase for data persistence
 */
export const useProgressiveEngagement = (customerId: string): UseProgressiveEngagementReturn => {

  // Track which compelling aspects user has seen
  const [compellingAspectShown, setCompellingAspectShown] = useState<CompellingAspectShown>({
    immediate_rating: false,
    financial_impact: false,
    business_case: false,
    integration_reveal: false
  });

  // Track progressive reveal eligibility
  const [revelationTriggers, setRevelationTriggers] = useState<RevelationTriggers>({
    tier_classification: false,
    technical_costs: false,
    stakeholder_views: false,
    tool_integration: false
  });

  // Track overall engagement progression
  const [engagementState, setEngagementState] = useState<EngagementState>({
    currentPhase: 'welcome',
    activeToolFocus: null,
    toolsCompleted: [],
    integrationUnlocked: false,
    userJourneyStep: 1
  });

  // Track tool interaction depth for revelation triggers
  const [interactionDepth, setInteractionDepth] = useState<InteractionDepth>({
    icp_analysis: { ratings_completed: 0, time_spent: 0 },
    cost_calculator: { charts_explored: 0, scenarios_run: 0 },
    business_case: { sections_viewed: 0, stakeholder_modes: 0 }
  });

  // Initialize engagement state from Supabase
  useEffect(() => {
    const initializeEngagementState = async () => {
      if (!customerId) return;

      try {
        // Get customer data from Supabase
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', customerId)
          .single() as { data: CustomerData | null; error: unknown };

        if (customerError) {
          console.error('Error fetching customer data:', customerError);
          return;
        }

        // Get progress data from Supabase
        const { data: progressData, error: progressError } = await supabase
          .from('competency_progress')
          .select('*')
          .eq('customer_id', customerId)
          .single() as { data: ProgressData | null; error: unknown };

        if (progressError) {
          console.error('Error fetching progress data:', progressError);
        }

        // Determine current engagement state based on existing data
        const completedTools: string[] = [];
        if (customerData?.icp_completed) completedTools.push('icp_analysis');
        if (customerData?.cost_completed) completedTools.push('cost_calculator');
        if (customerData?.business_case_completed) completedTools.push('business_case');

        // Set appropriate phase based on completion
        let currentPhase: EngagementState['currentPhase'] = 'welcome';
        if (completedTools.length > 0 && completedTools.length < 3) {
          currentPhase = 'tool_focus';
        } else if (completedTools.length === 3) {
          currentPhase = 'integration_reveal';
        }

        setEngagementState(prev => ({
          ...prev,
          currentPhase,
          toolsCompleted: completedTools,
          integrationUnlocked: completedTools.length === 3,
          userJourneyStep: completedTools.length + 1
        }));

        // Mark aspects as shown if tools are already completed
        const aspectsShown: Partial<CompellingAspectShown> = {};
        if (customerData?.icp_completed) aspectsShown.immediate_rating = true;
        if (customerData?.cost_completed) aspectsShown.financial_impact = true;
        if (customerData?.business_case_completed) aspectsShown.business_case = true;
        
        setCompellingAspectShown(prev => ({ ...prev, ...aspectsShown }));

        // Set revelation triggers based on progress
        if (progressData) {
          setRevelationTriggers(prev => ({
            ...prev,
            tier_classification: progressData.competencyLevel === 'proficient' || progressData.competencyLevel === 'advanced',
            technical_costs: completedTools.includes('cost_calculator'),
            stakeholder_views: completedTools.includes('business_case'),
            tool_integration: completedTools.length >= 2
          }));
        }

      } catch (error) {
        console.error('Error initializing engagement state:', error);
      }
    };

    initializeEngagementState();
  }, [customerId, supabase]);

  const showCompellingAspect = useCallback((aspectType: keyof CompellingAspectShown, toolName?: string): void => {
    setCompellingAspectShown(prev => ({
      ...prev,
      [aspectType]: true
    }));

    setEngagementState(prev => ({
      ...prev,
      currentPhase: 'tool_focus',
      activeToolFocus: toolName || aspectType,
      userJourneyStep: Math.max(prev.userJourneyStep, 2)
    }));

    // Store in Supabase
    if (customerId) {
      (supabase
        .from('engagement_state')
        .upsert({
          customer_id: customerId,
          aspect_type: aspectType,
          tool_name: toolName,
          timestamp: new Date().toISOString()
        }) as any)
        .catch((error: unknown) => console.error('Error storing engagement state:', error));
    }
  }, [customerId, supabase]);

  const triggerRevelation = useCallback((triggerType: keyof RevelationTriggers): void => {
    setRevelationTriggers(prev => ({
      ...prev,
      [triggerType]: true
    }));

    // Check if integration should be unlocked
    const newTriggers = { ...revelationTriggers, [triggerType]: true };
    const triggerCount = Object.values(newTriggers).filter(Boolean).length;
    
    if (triggerCount >= 3 && !engagementState.integrationUnlocked) {
      setEngagementState(prev => ({
        ...prev,
        integrationUnlocked: true,
        currentPhase: 'integration_reveal',
        userJourneyStep: Math.max(prev.userJourneyStep, 4)
      }));
    }

    // Store in Supabase
    if (customerId) {
      (supabase
        .from('revelation_triggers')
        .upsert({
          customer_id: customerId,
          trigger_type: triggerType,
          timestamp: new Date().toISOString()
        }) as any)
        .catch((error: unknown) => console.error('Error storing revelation trigger:', error));
    }
  }, [customerId, supabase, revelationTriggers, engagementState.integrationUnlocked]);

  const updateEngagementState = useCallback((updates: Partial<EngagementState>): void => {
    setEngagementState(prev => ({
      ...prev,
      ...updates
    }));

    // Store in Supabase
    if (customerId) {
      (supabase
        .from('engagement_state')
        .upsert({
          customer_id: customerId,
          state: updates,
          timestamp: new Date().toISOString()
        }) as any)
        .catch((error: unknown) => console.error('Error updating engagement state:', error));
    }
  }, [customerId, supabase]);

  const updateInteractionDepth = useCallback((
    tool: keyof InteractionDepth, 
    updates: Partial<InteractionDepth[keyof InteractionDepth]>
  ): void => {
    setInteractionDepth(prev => ({
      ...prev,
      [tool]: {
        ...prev[tool],
        ...updates
      }
    }));

    // Check for revelation triggers based on interaction depth
    const newDepth = { ...interactionDepth, [tool]: { ...interactionDepth[tool], ...updates } };
    
    // Trigger revelations based on interaction depth
    if (tool === 'icp_analysis' && newDepth.icp_analysis.ratings_completed >= 5) {
      triggerRevelation('tier_classification');
    }
    
    if (tool === 'cost_calculator' && newDepth.cost_calculator.scenarios_run >= 3) {
      triggerRevelation('technical_costs');
    }
    
    if (tool === 'business_case' && newDepth.business_case.stakeholder_modes >= 2) {
      triggerRevelation('stakeholder_views');
    }

    // Store in Supabase
    if (customerId) {
      (supabase
        .from('interaction_depth')
        .upsert({
          customer_id: customerId,
          tool,
          depth_data: newDepth[tool],
          timestamp: new Date().toISOString()
        }) as any)
        .catch((error: unknown) => console.error('Error storing interaction depth:', error));
    }
  }, [customerId, supabase, interactionDepth, triggerRevelation]);

  const checkRevelationEligibility = useCallback((triggerType: keyof RevelationTriggers): boolean => {
    const eligibilityRules: Record<keyof RevelationTriggers, () => boolean> = {
      tier_classification: () => interactionDepth.icp_analysis.ratings_completed >= 5,
      technical_costs: () => interactionDepth.cost_calculator.scenarios_run >= 3,
      stakeholder_views: () => interactionDepth.business_case.stakeholder_modes >= 2,
      tool_integration: () => engagementState.toolsCompleted.length >= 2
    };

    return eligibilityRules[triggerType]?.() || false;
  }, [interactionDepth, engagementState.toolsCompleted.length]);

  const getNextRevelation = useCallback((): string | null => {
    const availableRevelations = Object.entries(revelationTriggers)
      .filter(([, isTriggered]) => !isTriggered)
      .filter(([triggerType]) => checkRevelationEligibility(triggerType as keyof RevelationTriggers))
      .map(([triggerType]) => triggerType);

    return availableRevelations.length > 0 ? availableRevelations[0] : null;
  }, [revelationTriggers, checkRevelationEligibility]);

  const getEngagementProgress = useCallback((): number => {
    const totalAspects = Object.keys(compellingAspectShown).length;
    const shownAspects = Object.values(compellingAspectShown).filter(Boolean).length;
    const aspectProgress = (shownAspects / totalAspects) * 50;

    const totalTriggers = Object.keys(revelationTriggers).length;
    const triggeredCount = Object.values(revelationTriggers).filter(Boolean).length;
    const triggerProgress = (triggeredCount / totalTriggers) * 50;

    return Math.round(aspectProgress + triggerProgress);
  }, [compellingAspectShown, revelationTriggers]);

  const resetEngagement = useCallback((): void => {
    setCompellingAspectShown({
      immediate_rating: false,
      financial_impact: false,
      business_case: false,
      integration_reveal: false
    });

    setRevelationTriggers({
      tier_classification: false,
      technical_costs: false,
      stakeholder_views: false,
      tool_integration: false
    });

    setEngagementState({
      currentPhase: 'welcome',
      activeToolFocus: null,
      toolsCompleted: [],
      integrationUnlocked: false,
      userJourneyStep: 1
    });

    setInteractionDepth({
      icp_analysis: { ratings_completed: 0, time_spent: 0 },
      cost_calculator: { charts_explored: 0, scenarios_run: 0 },
      business_case: { sections_viewed: 0, stakeholder_modes: 0 }
    });

    // Clear from Supabase
    if (customerId) {
      (supabase
        .from('engagement_state')
        .delete()
        .eq('customer_id', customerId) as any)
        .catch((error: unknown) => console.error('Error clearing engagement state:', error));
    }
  }, [customerId, supabase]);

  return {
    compellingAspectShown,
    revelationTriggers,
    engagementState,
    interactionDepth,
    showCompellingAspect,
    triggerRevelation,
    updateEngagementState,
    updateInteractionDepth,
    checkRevelationEligibility,
    getNextRevelation,
    getEngagementProgress,
    resetEngagement
  };
};

export default useProgressiveEngagement;
