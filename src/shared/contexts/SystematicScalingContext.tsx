/**
 * Systematic Scaling Context - Next.js 15 Enhanced Context Provider
 * Integrates competency tracking, behavioral intelligence, and agent orchestration
 * Server Component compatible with Server Actions integration
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import customerValueOrchestrator from '@/app/lib/services/customerValueOrchestrator';
import { competencyService } from '@/app/lib/services/competencyService';
import { behavioralIntelligenceService } from '@/app/lib/services/behavioralIntelligenceService';
import { agentOrchestrationService } from '@/app/lib/services/agentOrchestrationService';
import {
  behaviorTrackingService,
  type EventType,
  type ToolId,
  type BusinessImpact,
  type CompetencyArea as BehaviorCompetencyArea,
  type GrowthStage
} from '@/app/lib/services/behaviorTrackingService';
// Types that may not be exported yet - using any for now
type FounderProfile = any;
type FounderScalingStatus = any;
type SystematicScalingSession = any;
import type { UserCompetency, CompetencyAssessment } from '@/app/lib/services/competencyService';
import type { ScalingIntelligence } from '@/app/lib/services/behavioralIntelligenceService';

interface SystematicScalingContextType {
  // Founder Profile & Status
  founderProfile: FounderProfile | null;
  scalingStatus: FounderScalingStatus | null;
  competencyAssessment: CompetencyAssessment | null;
  scalingIntelligence: ScalingIntelligence | null;
  
  // Loading States
  isLoading: boolean;
  isProcessingAction: boolean;
  
  // Actions
  initializeFounder: (founderId: string, profileData: Omit<FounderProfile, 'userId'>) => Promise<void>;
  processToolUsage: (
    toolUsed: 'icp_analysis' | 'cost_calculator' | 'business_case_builder',
    sessionData: {
      businessImpact: 'high' | 'medium' | 'low';
      specificActions: string[];
      professionalOutputs: string[];
      timeSpent: number;
    }
  ) => Promise<void>;
  executeSystematicAction: (
    actionType: 'professional_milestone' | 'competency_advancement' | 'agent_deployment' | 'business_intelligence',
    actionDetails: {
      description: string;
      expectedBusinessImpact: 'transformational' | 'significant' | 'incremental';
      timeInvestment: number;
      professionalCredibilityGain: number;
    }
  ) => Promise<boolean>;
  
  // Intelligence & Recommendations
  getSystematicRecommendations: () => Promise<{
    priorityActions: string[];
    competencyFocus: string[];
    agentDeployment: string[];
    businessImpactOpportunities: string[];
    professionalDevelopment: string[];
  }>;
  generateScalingPlan: (horizon?: '30_days' | '90_days' | '180_days' | '365_days') => Promise<void>;
  
  // Real-time Updates
  refreshScalingStatus: () => Promise<void>;
  
  // Systematic Progress Tracking
  currentSession: SystematicScalingSession | null;
  recentAchievements: Array<{
    type: 'competency' | 'milestone' | 'agent_completion';
    description: string;
    businessImpact: 'high' | 'medium' | 'low';
    timestamp: string;
    professionalCredibilityGain: number;
  }>;
  
  // Professional Metrics
  professionalCredibilityScore: number;
  businessImpactGenerated: number;
  scalingVelocityMultiplier: number;
  nextSystematicMilestones: string[];
  
  // Helper Functions
  isHighPerformer: boolean;
  canAccessAdvancedFeatures: boolean;
  getCompetencyProgress: (area: UserCompetency['area']) => {
    currentLevel: number;
    progressToNext: number;
    businessImpactScore: number;
  } | null;
  
  // Missing methods used by components
  trackBehavior: (action: string, data?: any) => void;
  awardPoints: (points: number, reason: string) => void;
  getCompetencyLevel: (competency: string) => { level: number; currentPoints: number };
  getScalingInsights: () => any;
  orchestrateScalingPlan: (plan: any) => Promise<void>;
}

const SystematicScalingContext = createContext<SystematicScalingContextType | null>(null);

export const useSystematicScaling = (): SystematicScalingContextType => {
  const context = useContext(SystematicScalingContext);
  if (!context) {
    throw new Error('useSystematicScaling must be used within SystematicScalingProvider');
  }
  return context;
};

interface SystematicScalingProviderProps {
  children: React.ReactNode;
  founderId: string;
  initialProfile?: Omit<FounderProfile, 'userId'>;
}

export const SystematicScalingProvider: React.FC<SystematicScalingProviderProps> = ({
  children,
  founderId,
  initialProfile
}) => {
  // Core State
  const [founderProfile, setFounderProfile] = useState<FounderProfile | null>(null);
  const [scalingStatus, setScalingStatus] = useState<FounderScalingStatus | null>(null);
  const [competencyAssessment, setCompetencyAssessment] = useState<CompetencyAssessment | null>(null);
  const [scalingIntelligence, setScalingIntelligence] = useState<ScalingIntelligence | null>(null);
  
  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  
  // Session & Achievement Tracking
  const [currentSession, setCurrentSession] = useState<SystematicScalingSession | null>(null);
  const [recentAchievements, setRecentAchievements] = useState<Array<{
    type: 'competency' | 'milestone' | 'agent_completion';
    description: string;
    businessImpact: 'high' | 'medium' | 'low';
    timestamp: string;
    professionalCredibilityGain: number;
  }>>([]);
  
  // Initialize founder data on mount
  useEffect(() => {
    const initializeFounderData = async () => {
      if (!founderId) return;
      
      setIsLoading(true);
      try {
        // Initialize or load founder profile
        if (initialProfile) {
          const profile = await (customerValueOrchestrator as any).initializeFounderProfile(founderId, initialProfile);
          setFounderProfile(profile);
        }
        
        // Load comprehensive scaling status
        await refreshScalingStatus();
        
      } catch (error) {
        console.error('Failed to initialize founder data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeFounderData();
  }, [founderId, initialProfile]);

  // Initialize Founder Profile
  const initializeFounder = useCallback(async (
    founderId: string,
    profileData: Omit<FounderProfile, 'userId'>
  ) => {
    setIsLoading(true);
    try {
      const profile = await (customerValueOrchestrator as any).initializeFounderProfile(founderId, profileData);
      setFounderProfile(profile);
      await refreshScalingStatus();
    } catch (error) {
      console.error('Failed to initialize founder:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Process Tool Usage with Integrated Intelligence
  const processToolUsage = useCallback(async (
    toolUsed: 'icp_analysis' | 'cost_calculator' | 'business_case_builder',
    sessionData: {
      businessImpact: 'high' | 'medium' | 'low';
      specificActions: string[];
      professionalOutputs: string[];
      timeSpent: number;
    }
  ) => {
    if (!founderId) return;
    
    setIsProcessingAction(true);
    try {
      const result = await (customerValueOrchestrator as any).processToolUsage(founderId, toolUsed, sessionData);
      
      // Update recent achievements
      const achievement = {
        type: 'competency' as const,
        description: `Completed ${toolUsed.replace('_', ' ')} with ${sessionData.businessImpact} business impact`,
        businessImpact: sessionData.businessImpact,
        timestamp: new Date().toISOString(),
        professionalCredibilityGain: result.competencyUpdate.businessImpactIncrease
      };
      
      setRecentAchievements(prev => [achievement, ...prev.slice(0, 9)]);
      
      // Refresh comprehensive status
      await refreshScalingStatus();
      
      // Show level progression notification if applicable
      if (result.competencyUpdate.levelChanged) {
        // Could trigger notification system here
        console.log(`Level progression: Advanced to level ${result.competencyUpdate.newLevel}`);
      }
      
    } catch (error) {
      console.error('Failed to process tool usage:', error);
    } finally {
      setIsProcessingAction(false);
    }
  }, [founderId]);

  // Execute Systematic Action
  const executeSystematicAction = useCallback(async (
    actionType: 'professional_milestone' | 'competency_advancement' | 'agent_deployment' | 'business_intelligence',
    actionDetails: {
      description: string;
      expectedBusinessImpact: 'transformational' | 'significant' | 'incremental';
      timeInvestment: number;
      professionalCredibilityGain: number;
    }
  ): Promise<boolean> => {
    if (!founderId) return false;
    
    setIsProcessingAction(true);
    try {
      const result = await (customerValueOrchestrator as any).executeSystematicAction(
        founderId,
        actionType,
        actionDetails
      );
      
      if (result.success) {
        // Add achievement
        const achievement = {
          type: actionType === 'professional_milestone' ? 'milestone' : 
                actionType === 'agent_deployment' ? 'agent_completion' : 'competency',
          description: actionDetails.description,
          businessImpact: actionDetails.expectedBusinessImpact === 'transformational' ? 'high' :
                         actionDetails.expectedBusinessImpact === 'significant' ? 'medium' : 'low',
          timestamp: new Date().toISOString(),
          professionalCredibilityGain: result.professionalCredibilityIncrease
        } as const;
        
        setRecentAchievements(prev => [achievement, ...prev.slice(0, 9)]);
        
        // Refresh status
        await refreshScalingStatus();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to execute systematic action:', error);
      return false;
    } finally {
      setIsProcessingAction(false);
    }
  }, [founderId]);

  // Get Integrated Recommendations
  const getSystematicRecommendations = useCallback(async () => {
    if (!founderId) {
      return {
        priorityActions: [],
        competencyFocus: [],
        agentDeployment: [],
        businessImpactOpportunities: [],
        professionalDevelopment: []
      };
    }
    
    return await (customerValueOrchestrator as any).getSystematicRecommendations(founderId);
  }, [founderId]);

  // Generate Comprehensive Scaling Plan
  const generateScalingPlan = useCallback(async (
    horizon: '30_days' | '90_days' | '180_days' | '365_days' = '90_days'
  ) => {
    if (!founderId) return;
    
    setIsProcessingAction(true);
    try {
      const plan = await (customerValueOrchestrator as any).generateScalingPlan(founderId, horizon);
      // Plan could be stored in state or handled by parent component
      console.log('Generated scaling plan:', plan);
    } catch (error) {
      console.error('Failed to generate scaling plan:', error);
    } finally {
      setIsProcessingAction(false);
    }
  }, [founderId]);

  // Refresh Comprehensive Scaling Status
  const refreshScalingStatus = useCallback(async () => {
    if (!founderId) return;
    
    try {
      const [status, assessment, intelligence] = await Promise.all([
        (customerValueOrchestrator as any).getFounderScalingStatus(founderId),
        competencyService.getCompetencyAssessment(founderId),
        behavioralIntelligenceService.getScalingIntelligence(founderId)
      ]);
      
      setScalingStatus(status);
      setCompetencyAssessment(assessment);
      setScalingIntelligence(intelligence);
      
    } catch (error) {
      console.error('Failed to refresh scaling status:', error);
    }
  }, [founderId]);

  // Helper Functions
  const getCompetencyProgress = useCallback((area: UserCompetency['area']) => {
    if (!scalingStatus) return null;
    
    const competency = scalingStatus.competencyProfile.find((c: any) => c.area === area);
    if (!competency) return null;
    
    return {
      currentLevel: competency.currentLevel,
      progressToNext: competency.progressToNextLevel,
      businessImpactScore: competency.businessImpactScore
    };
  }, [scalingStatus]);

  // Computed Properties
  const professionalCredibilityScore = scalingIntelligence?.currentScalingScore || 0;
  const businessImpactGenerated = scalingStatus?.businessImpactGenerated || 0;
  const scalingVelocityMultiplier = scalingStatus?.scalingVelocityMultiplier || 1.0;
  const nextSystematicMilestones = scalingStatus?.nextSystematicMilestones || [];
  
  const isHighPerformer = professionalCredibilityScore >= 85;
  const canAccessAdvancedFeatures = isHighPerformer && businessImpactGenerated >= 100;

  // Real behavior tracking implementation
  const trackBehavior = useCallback(async (action: string, data?: any) => {
    if (!founderId) return;

    try {
      // Parse data if it's a JSON string
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

      // Map competency area from context to behavior tracking format
      const mapCompetencyArea = (area?: string): BehaviorCompetencyArea | undefined => {
        const mapping: Record<string, BehaviorCompetencyArea> = {
          'customer_intelligence': 'customer_intelligence',
          'value_communication': 'value_communication',
          'sales_execution': 'sales_execution',
          'systematic_optimization': 'systematic_optimization',
        };
        return area ? mapping[area] : undefined;
      };

      // Route to appropriate tracking method based on action
      if (action.includes('tool_usage') || action.includes('tool_')) {
        await behaviorTrackingService.trackToolUsage({
          customer_id: founderId,
          tool_id: (parsedData?.toolId || parsedData?.tool_id) as ToolId,
          tool_section: parsedData?.toolSection || parsedData?.section,
          business_impact: (parsedData?.businessImpact || 'medium') as BusinessImpact,
          competency_area: mapCompetencyArea(parsedData?.competencyArea),
          metadata: parsedData?.metadata || parsedData,
          scaling_context: {
            current_arr: scalingStatus?.currentARR,
            target_arr: scalingStatus?.targetARR,
            growth_stage: (scalingStatus?.growthStage as GrowthStage) || 'rapid_scaling',
          },
        });
      } else if (action.includes('export') || action.includes('download')) {
        await behaviorTrackingService.trackExport({
          customer_id: founderId,
          tool_id: (parsedData?.toolId || 'icp-analysis') as ToolId,
          export_type: parsedData?.exportType || parsedData?.format || 'pdf',
          business_impact: (parsedData?.businessImpact || 'high') as BusinessImpact,
          metadata: parsedData?.metadata || parsedData,
        });
      } else if (action.includes('milestone') || action.includes('competency')) {
        await behaviorTrackingService.trackCompetencyMilestone({
          customer_id: founderId,
          competency_area: mapCompetencyArea(parsedData?.competencyArea) || 'customer_intelligence',
          milestone_description: parsedData?.description || action,
          professional_credibility: parsedData?.credibility || parsedData?.points || 10,
          business_impact: (parsedData?.businessImpact || 'high') as BusinessImpact,
        });
      } else if (action.includes('navigation') || action.includes('navigate')) {
        await behaviorTrackingService.trackNavigation({
          customer_id: founderId,
          from_page: parsedData?.from,
          to_page: parsedData?.to || window.location.pathname,
          tool_id: parsedData?.toolId as ToolId,
        });
      } else {
        // Generic event tracking
        await behaviorTrackingService.trackEvent({
          customer_id: founderId,
          event_type: (parsedData?.eventType || 'professional_action') as EventType,
          tool_id: parsedData?.toolId as ToolId,
          business_impact: (parsedData?.businessImpact || 'medium') as BusinessImpact,
          competency_area: mapCompetencyArea(parsedData?.competencyArea),
          event_metadata: parsedData?.metadata || parsedData,
          current_arr: scalingStatus?.currentARR,
          target_arr: scalingStatus?.targetARR,
          growth_stage: (scalingStatus?.growthStage as GrowthStage) || 'rapid_scaling',
          systematic_approach: true,
        });
      }
    } catch (error) {
      console.error('Failed to track behavior:', error);
      // Fail silently - don't break user experience for tracking failures
    }
  }, [founderId, scalingStatus]);

  const awardPoints = useCallback((points: number, reason: string) => {
    console.log('Awarding points:', points, reason);
  }, []);

  const getCompetencyLevel = useCallback((competency: string) => {
    const competencyData = scalingStatus?.competencyProfile.find((c: any) => c.area === competency);
    return {
      level: competencyData?.currentLevel || 1,
      currentPoints: competencyData?.progressToNextLevel || 0
    };
  }, [scalingStatus]);

  const getScalingInsights = useCallback(() => {
    return scalingIntelligence || {};
  }, [scalingIntelligence]);

  const orchestrateScalingPlan = useCallback(async (plan: any) => {
    console.log('Orchestrating scaling plan:', plan);
  }, []);

  const contextValue: SystematicScalingContextType = {
    // Core Data
    founderProfile,
    scalingStatus,
    competencyAssessment,
    scalingIntelligence,
    
    // Loading States
    isLoading,
    isProcessingAction,
    
    // Actions
    initializeFounder,
    processToolUsage,
    executeSystematicAction,
    getSystematicRecommendations,
    generateScalingPlan,
    refreshScalingStatus,
    
    // Session & Achievement Tracking
    currentSession,
    recentAchievements,
    
    // Professional Metrics
    professionalCredibilityScore,
    businessImpactGenerated,
    scalingVelocityMultiplier,
    nextSystematicMilestones,
    
    // Helper Functions
    isHighPerformer,
    canAccessAdvancedFeatures,
    getCompetencyProgress,
    
    // Missing methods
    trackBehavior,
    awardPoints,
    getCompetencyLevel,
    getScalingInsights,
    orchestrateScalingPlan
  };

  return (
    <SystematicScalingContext.Provider value={contextValue}>
      {children}
    </SystematicScalingContext.Provider>
  );
};

// Helper hook for specific competency tracking
export const useCompetencyTracking = () => {
  const { scalingStatus, getCompetencyProgress, refreshScalingStatus } = useSystematicScaling();
  
  const trackCompetencyMilestone = useCallback(async (
    area: UserCompetency['area'],
    milestone: string,
    businessImpact: 'transformational' | 'significant' | 'incremental'
  ) => {
    try {
      await competencyService.trackMilestone(
        scalingStatus?.founderId || '',
        area,
        milestone,
        businessImpact
      );
      await refreshScalingStatus();
    } catch (error) {
      console.error('Failed to track competency milestone:', error);
    }
  }, [scalingStatus?.founderId, refreshScalingStatus]);
  
  return {
    competencies: scalingStatus?.competencyProfile || [],
    getCompetencyProgress,
    trackCompetencyMilestone,
    overallScore: scalingStatus?.overallReadinessScore || 0
  };
};

// Helper hook for agent coordination
export const useAgentOrchestration = () => {
  const { scalingStatus, founderId } = useSystematicScaling() as any;
  
  const spawnAgent = useCallback(async (
    agentType: 'customer_intelligence' | 'value_communication' | 'sales_execution' | 'systematic_optimization',
    businessObjective: string
  ) => {
    if (!founderId) return null;
    
    try {
      return await agentOrchestrationService.spawnScalingAgent(
        founderId,
        agentType,
        businessObjective,
        {
          currentARR: '$2M+',
          targetARR: '$10M',
          growthStage: 'rapid_scaling',
          systematicApproach: true
        }
      );
    } catch (error) {
      console.error('Failed to spawn agent:', error);
      return null;
    }
  }, [founderId]);
  
  const getAgentRecommendations = useCallback(async () => {
    if (!founderId) return null;
    
    try {
      return await agentOrchestrationService.getScalingRecommendations(founderId);
    } catch (error) {
      console.error('Failed to get agent recommendations:', error);
      return null;
    }
  }, [founderId]);
  
  return {
    activeAgents: scalingStatus?.activeAgents || [],
    spawnAgent,
    getAgentRecommendations
  };
};