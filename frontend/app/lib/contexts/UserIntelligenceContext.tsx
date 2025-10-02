'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

// Create context
const UserIntelligenceContext = createContext<any>(null);

// Custom hook for using the context
export const useUserIntelligence = () => {
  const context = useContext(UserIntelligenceContext);
  if (!context) {
    // Return safe defaults for graceful degradation
    return {
      assessment: {
        performance: { level: 'Average', score: 50 },
        revenue: { opportunity: 500000 },
        strategy: { focusArea: 'Sales Process' },
        challenges: { critical: 0, highPriority: 0, manageable: 0 },
        competencyScores: { 
          customerAnalysis: 50, 
          valueCommunication: 50, 
          executiveReadiness: 50 
        }
      },
      businessContext: {
        industry: 'Technology',
        productType: 'SaaS Platform',
        targetMarket: 'Enterprise',
        fundingStage: 'Series A',
        currentARR: 2100000,
        targetARR: 10000000,
        teamSize: 25,
        customerCount: 150
      },
      icpAnalysis: {
        targetIndustries: ['Healthcare', 'Financial Services'],
        buyerPersonas: [],
        painPoints: [],
        valuePropositions: [],
        competitiveAdvantages: []
      },
      milestone: {
        tier: 'growth',
        context: 'Advanced revenue intelligence development',
        targets: { customerAnalysis: 75, valueCommunication: 70, executiveReadiness: 80 }
      },
      usage: {
        totalSessions: 45,
        toolsUsed: ['ICP Analysis', 'Cost Calculator'],
        lastActive: new Date().toISOString()
      },
      loading: false,
      error: null,
      updateUsage: () => {},
      updateAssessment: () => {},
      refreshData: () => {}
    };
  }
  
  return context;
};

// Provider component
export const UserIntelligenceProvider = ({ children }: { children: React.ReactNode }) => {
  const [assessment, setAssessment] = useState(null);
  const [businessContext, setBusinessContext] = useState(null);
  const [icpAnalysis, setIcpAnalysis] = useState(null);
  const [milestone, setMilestone] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data for development
  useEffect(() => {
    setAssessment({
      performance: { level: 'Good', score: 65 },
      revenue: { opportunity: 750000 },
      strategy: { focusArea: 'Customer Intelligence' },
      challenges: { critical: 1, highPriority: 3, manageable: 5 },
      competencyScores: { 
        customerAnalysis: 65, 
        valueCommunication: 58, 
        executiveReadiness: 72 
      }
    });

    setBusinessContext({
      industry: 'Technology',
      productType: 'SaaS Platform', 
      targetMarket: 'Enterprise',
      fundingStage: 'Series A',
      currentARR: 2100000,
      targetARR: 10000000,
      teamSize: 25,
      customerCount: 150
    });

    setMilestone({
      tier: 'growth',
      context: 'Advanced revenue intelligence development',
      targets: { customerAnalysis: 75, valueCommunication: 70, executiveReadiness: 80 }
    });

    setUsage({
      totalSessions: 45,
      toolsUsed: ['ICP Analysis', 'Cost Calculator', 'Business Case Builder'],
      lastActive: new Date().toISOString()
    });
  }, []);

  const updateUsage = useCallback((newUsage: any) => {
    setUsage(prev => ({ ...prev, ...newUsage }));
  }, []);

  const updateAssessment = useCallback((newAssessment: any) => {
    setAssessment(prev => ({ ...prev, ...newAssessment }));
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      // Refresh logic would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    assessment,
    businessContext,
    icpAnalysis,
    milestone,
    usage,
    loading,
    error,
    updateUsage,
    updateAssessment,
    refreshData
  };

  return (
    <UserIntelligenceContext.Provider value={value}>
      {children}
    </UserIntelligenceContext.Provider>
  );
};