'use client';

import { useState, useEffect } from 'react';

// Mock data for dashboard
const mockDashboardData = {
  customerAnalysis: {
    totalCustomers: 150,
    activeCustomers: 89,
    newCustomers: 12,
    churnRate: 3.2
  },
  revenue: {
    monthly: 125000,
    quarterly: 375000,
    annual: 1500000,
    growth: 15.3
  },
  competency: {
    overallScore: 75,
    performanceLevel: 'intermediate',
    revenueOpportunity: '$50K',
    focusArea: 'customer_analysis'
  }
};

export const useDashboardData = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(mockDashboardData);
      setLoading(false);
    }, 1000);
  }, []);

  return { data, loading, error };
};

// Export for CompetencyDevelopmentView
export const useCompetencyDevelopmentData = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data for now - replace with actual implementation
    setData({
      overallScore: 75,
      performanceLevel: 'intermediate',
      revenueOpportunity: '$50K',
      focusArea: 'customer_analysis',
      recommendations: [
        { id: 1, title: 'Improve discovery questions', priority: 'high' },
        { id: 2, title: 'Practice value communication', priority: 'medium' }
      ],
      strengths: [
        { id: 1, title: 'Strong technical knowledge' },
        { id: 2, title: 'Good relationship building' }
      ],
      gaps: [
        { id: 1, title: 'Discovery questioning' },
        { id: 2, title: 'Value proposition clarity' }
      ]
    });
    setLoading(false);
  }, []);

  return { data, loading, error };
};