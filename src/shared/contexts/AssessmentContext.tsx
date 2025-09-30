/** Assessment Context - TypeScript Migration

 * Assessment data management and personalization with professional development language
 * Enhanced with Supabase integration and TypeScript type safety
 * Migrated from legacy platform with improved error handling
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';

// TypeScript interfaces for assessment context
export interface AssessmentData {
  performance?: string;
  strategy?: string;
  revenue?: {
    opportunity: number;
    current: number;
  };
  challenges?: string[];
  competencyAreas?: string[];
  skillLevels?: {
    customerAnalysis: number;
    valueCommunication: number;
    executiveReadiness: number;
    overall: number;
  };
  lastAssessment?: number;
}

export interface CompetencyBaselines {
  customerAnalysis?: number;
  valueCommunication?: number;
  executiveReadiness?: number;
  overall?: number;
  baselineDate?: string;
}

export interface PersonalizedMessaging {
  welcomeMessage: {
    primary: string;
    secondary: string;
    urgency: 'immediate' | 'moderate' | 'low';
    tone: 'professional' | 'supportive' | 'encouraging';
  };
  toolDescriptions: {
    icpTool: string;
    costTool: string;
    businessCase: string;
  };
  activityPersonalization: Array<{
    focusArea: string;
    activityPrefixes: string[];
    completionMessages: string[];
  }>;
  achievementPersonalization: {
    badgeContext: string;
    completionBonuses: string;
    milestoneMessages: string;
  };
  nextSteps: string[];
}

export interface CustomerData {
  assessment?: AssessmentData;
  competencyBaselines?: CompetencyBaselines;
  id?: string;
  [key: string]: any;
}

export interface AssessmentContextType {
  assessmentData: AssessmentData | null;
  personalizedMessaging: PersonalizedMessaging | null;
  competencyBaselines: CompetencyBaselines | null;
  isLoading: boolean;
  error: string | null;
  updateAssessment: (data: AssessmentData) => void;
  updateCompetencyBaselines: (baselines: CompetencyBaselines) => void;
  refreshAssessment: () => Promise<void>;
  clearAssessment: () => void;
}

// Create context
const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

// Custom hook to use assessment context
export const useAssessment = (): AssessmentContextType => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
};

// Provider component props
interface AssessmentProviderProps {
  children: ReactNode;
  customerData?: CustomerData;
  customerId?: string;
}

// Assessment Provider component
export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ 
  children, 
  customerData, 
  customerId 
}) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [personalizedMessaging, setPersonalizedMessaging] = useState<PersonalizedMessaging | null>(null);
  const [competencyBaselines, setCompetencyBaselines] = useState<CompetencyBaselines | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  // Initialize assessment data from props or fetch from Supabase
  useEffect(() => {
    const initializeAssessment = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (customerData?.assessment) {
          // Use provided customer data
          setAssessmentData(customerData.assessment);
          setCompetencyBaselines(customerData.competencyBaselines || null);
          
          // Generate personalized messaging
          const messaging = generatePersonalizedMessaging(customerData.assessment);
          setPersonalizedMessaging(messaging);
        } else if (customerId) {
          // Fetch from Supabase
          await fetchAssessmentFromSupabase(customerId);
        } else {
          // Set default messaging
          const defaultMessaging = generatePersonalizedMessaging(null);
          setPersonalizedMessaging(defaultMessaging);
        }
      } catch (err) {
        console.error('Error initializing assessment:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize assessment');
        
        // Set default messaging on error
        const defaultMessaging = generatePersonalizedMessaging(null);
        setPersonalizedMessaging(defaultMessaging);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAssessment();
  }, [customerData, customerId]);

  const fetchAssessmentFromSupabase = async (id: string): Promise<void> => {
    try {
      // Fetch assessment data
      const { data: assessment, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .eq('customer_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (assessmentError && assessmentError.code !== 'PGRST116') {
        throw assessmentError;
      }

      // Fetch competency baselines
      const { data: baselines, error: baselinesError } = await supabase
        .from('competency_baselines')
        .select('*')
        .eq('customer_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (baselinesError && baselinesError.code !== 'PGRST116') {
        throw baselinesError;
      }

      if (assessment) {
        setAssessmentData(assessment);
        const messaging = generatePersonalizedMessaging(assessment);
        setPersonalizedMessaging(messaging);
      }

      if (baselines) {
        setCompetencyBaselines(baselines);
      }

    } catch (err) {
      console.error('Error fetching assessment from Supabase:', err);
      throw err;
    }
  };

  const generatePersonalizedMessaging = (assessment: AssessmentData | null): PersonalizedMessaging => {
    // Handle null assessment data gracefully
    if (!assessment) {
      return {
        welcomeMessage: {
          primary: 'Welcome to your professional development platform',
          secondary: 'Begin your systematic revenue intelligence journey',
          urgency: 'moderate',
          tone: 'professional'
        },
        toolDescriptions: {
          icpTool: 'Systematic customer analysis and targeting',
          costTool: 'Financial impact analysis and opportunity quantification',
          businessCase: 'Executive-ready business case development'
        },
        activityPersonalization: [{
          focusArea: 'Professional Development',
          activityPrefixes: ['Professional development activity:'],
          completionMessages: ['advances professional development goals']
        }],
        achievementPersonalization: {
          badgeContext: 'Professional Achievement',
          completionBonuses: 'Professional Development Achievement',
          milestoneMessages: 'professional capabilities'
        },
        nextSteps: [
          'Begin with systematic customer analysis',
          'Focus on foundational professional development',
          'Build consistent methodology and processes'
        ]
      };
    }

    const { performance, strategy, revenue, challenges } = assessment;
    
    return {
      // Welcome messaging based on performance level
      welcomeMessage: getWelcomeMessage(performance, revenue),
      
      // Focus area-specific tool descriptions
      toolDescriptions: getToolDescriptions(strategy, challenges),
      
      // Activity feed personalization
      activityPersonalization: getActivityPersonalization(strategy, challenges),
      
      // Achievement personalization
      achievementPersonalization: getAchievementPersonalization(strategy, challenges),
      
      // Next steps based on assessment
      nextSteps: getNextSteps(performance, strategy)
    };
  };

  const getWelcomeMessage = (performance?: string, revenue?: { opportunity: number; current: number }): PersonalizedMessaging['welcomeMessage'] => {
    // Handle missing performance or revenue data
    if (!performance || !revenue) {
      return {
        primary: 'Welcome to your professional development platform',
        secondary: 'Begin your systematic revenue intelligence journey',
        urgency: 'moderate',
        tone: 'professional'
      };
    }

    const messages: Record<string, PersonalizedMessaging['welcomeMessage']> = {
      'Critical': {
        primary: `Your revenue optimization analysis reveals critical improvement opportunities`,
        secondary: `Based on your assessment, addressing key capability gaps could unlock ${Math.round(revenue.opportunity/1000)}K in revenue potential`,
        urgency: 'immediate',
        tone: 'supportive'
      },
      'Needs Work': {
        primary: `Your assessment indicates significant opportunities for professional development`,
        secondary: `Focusing on key areas could unlock ${Math.round(revenue.opportunity/1000)}K in additional revenue potential`,
        urgency: 'moderate',
        tone: 'encouraging'
      },
      'Good': {
        primary: `Your professional development foundation is solid with room for optimization`,
        secondary: `Strategic improvements could unlock ${Math.round(revenue.opportunity/1000)}K in additional revenue potential`,
        urgency: 'moderate',
        tone: 'professional'
      },
      'Excellent': {
        primary: `Your professional development capabilities are strong`,
        secondary: `Fine-tuning your approach could unlock ${Math.round(revenue.opportunity/1000)}K in additional revenue potential`,
        urgency: 'low',
        tone: 'professional'
      }
    };

    return messages[performance] || messages['Good'];
  };

  const getToolDescriptions = (strategy?: string, challenges?: string[]): PersonalizedMessaging['toolDescriptions'] => {
    const baseDescriptions = {
      icpTool: 'Systematic customer analysis and targeting',
      costTool: 'Financial impact analysis and opportunity quantification',
      businessCase: 'Executive-ready business case development'
    };

    if (!strategy || !challenges) {
      return baseDescriptions;
    }

    // Customize based on strategy and challenges
    if (strategy === 'growth' && challenges?.includes('customer acquisition')) {
      return {
        icpTool: 'Advanced customer acquisition and targeting strategies',
        costTool: 'Customer acquisition cost analysis and optimization',
        businessCase: 'Growth-focused business case development'
      };
    }

    if (strategy === 'efficiency' && challenges?.includes('process optimization')) {
      return {
        icpTool: 'Process optimization and customer segmentation',
        costTool: 'Efficiency improvement cost-benefit analysis',
        businessCase: 'Efficiency-focused business case development'
      };
    }

    return baseDescriptions;
  };

  const getActivityPersonalization = (strategy?: string, challenges?: string[]): PersonalizedMessaging['activityPersonalization'] => {
    const basePersonalization = [{
      focusArea: 'Professional Development',
      activityPrefixes: ['Professional development activity:'],
      completionMessages: ['advances professional development goals']
    }];

    if (!strategy || !challenges) {
      return basePersonalization;
    }

    // Customize based on strategy
    if (strategy === 'growth') {
      return [{
        focusArea: 'Growth Strategy',
        activityPrefixes: ['Growth strategy activity:', 'Customer acquisition activity:'],
        completionMessages: ['advances growth objectives', 'improves customer acquisition']
      }];
    }

    if (strategy === 'efficiency') {
      return [{
        focusArea: 'Efficiency Optimization',
        activityPrefixes: ['Efficiency optimization activity:', 'Process improvement activity:'],
        completionMessages: ['improves operational efficiency', 'optimizes business processes']
      }];
    }

    return basePersonalization;
  };

  const getAchievementPersonalization = (strategy?: string, challenges?: string[]): PersonalizedMessaging['achievementPersonalization'] => {
    const basePersonalization = {
      badgeContext: 'Professional Achievement',
      completionBonuses: 'Professional Development Achievement',
      milestoneMessages: 'professional capabilities'
    };

    if (!strategy || !challenges) {
      return basePersonalization;
    }

    // Customize based on strategy
    if (strategy === 'growth') {
      return {
        badgeContext: 'Growth Achievement',
        completionBonuses: 'Growth Strategy Achievement',
        milestoneMessages: 'growth capabilities'
      };
    }

    if (strategy === 'efficiency') {
      return {
        badgeContext: 'Efficiency Achievement',
        completionBonuses: 'Efficiency Optimization Achievement',
        milestoneMessages: 'efficiency capabilities'
      };
    }

    return basePersonalization;
  };

  const getNextSteps = (performance?: string, strategy?: string): string[] => {
    const baseSteps = [
      'Begin with systematic customer analysis',
      'Focus on foundational professional development',
      'Build consistent methodology and processes'
    ];

    if (!performance || !strategy) {
      return baseSteps;
    }

    // Customize based on performance level
    if (performance === 'Critical') {
      return [
        'Address critical capability gaps immediately',
        'Focus on foundational professional development',
        'Build systematic approach to customer analysis'
      ];
    }

    if (performance === 'Excellent') {
      return [
        'Optimize existing professional capabilities',
        'Explore advanced strategic opportunities',
        'Share expertise with team members'
      ];
    }

    // Customize based on strategy
    if (strategy === 'growth') {
      return [
        'Focus on customer acquisition strategies',
        'Develop growth-oriented business cases',
        'Optimize customer targeting and segmentation'
      ];
    }

    if (strategy === 'efficiency') {
      return [
        'Identify process optimization opportunities',
        'Develop efficiency-focused business cases',
        'Streamline customer analysis workflows'
      ];
    }

    return baseSteps;
  };

  const updateAssessment = async (data: AssessmentData): Promise<void> => {
    try {
      setAssessmentData(data);
      
      // Generate new personalized messaging
      const messaging = generatePersonalizedMessaging(data);
      setPersonalizedMessaging(messaging);

      // Store in Supabase if customerId is available
      if (customerId) {
        const { error } = await supabase
          .from('assessments')
          .upsert({
            customer_id: customerId,
            assessment_data: data,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error updating assessment in Supabase:', error);
        }
      }
    } catch (err) {
      console.error('Error updating assessment:', err);
      setError(err instanceof Error ? err.message : 'Failed to update assessment');
    }
  };

  const updateCompetencyBaselines = async (baselines: CompetencyBaselines): Promise<void> => {
    try {
      setCompetencyBaselines(baselines);

      // Store in Supabase if customerId is available
      if (customerId) {
        const { error } = await supabase
          .from('competency_baselines')
          .upsert({
            customer_id: customerId,
            baseline_data: baselines,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error updating competency baselines in Supabase:', error);
        }
      }
    } catch (err) {
      console.error('Error updating competency baselines:', err);
      setError(err instanceof Error ? err.message : 'Failed to update competency baselines');
    }
  };

  const refreshAssessment = async (): Promise<void> => {
    if (!customerId) return;

    setIsLoading(true);
    setError(null);

    try {
      await fetchAssessmentFromSupabase(customerId);
    } catch (err) {
      console.error('Error refreshing assessment:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAssessment = (): void => {
    setAssessmentData(null);
    setCompetencyBaselines(null);
    setPersonalizedMessaging(generatePersonalizedMessaging(null));
    setError(null);
  };

  const contextValue: AssessmentContextType = {
    assessmentData,
    personalizedMessaging,
    competencyBaselines,
    isLoading,
    error,
    updateAssessment,
    updateCompetencyBaselines,
    refreshAssessment,
    clearAssessment
  };

  return (
    <AssessmentContext.Provider value={contextValue}>
      {children}
    </AssessmentContext.Provider>
  );
};

export default AssessmentContext;
