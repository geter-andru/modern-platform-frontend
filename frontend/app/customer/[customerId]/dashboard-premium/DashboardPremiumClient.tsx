'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useUserIntelligence } from '../../../lib/contexts/UserIntelligenceContext';
import ModernCard from '../../../lib/components/ModernCard';
import ModernCircularProgress from '../../../lib/components/ModernCircularProgress';

export default function DashboardPremiumClient() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = params.customerId as string;
  const token = searchParams.get('token');
  const { assessment, milestone, usage, loading, error } = useUserIntelligence();
  
  // Local state for UI interactions
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Simulate initial load completion
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Safe defaults for development
  const safeAssessment = {
    competencyScores: { 
      customerAnalysis: 65, 
      valueCommunication: 58, 
      executiveReadiness: 72 
    },
    performance: { level: 'Good', score: 65 },
    revenue: { opportunity: 750000 }
  };

  const safeMilestone = {
    tier: 'growth',
    context: 'Advanced revenue intelligence development',
    targets: { customerAnalysis: 75, valueCommunication: 70, executiveReadiness: 80 }
  };

  // Enhanced competency data for premium visualization
  const competencyData = [
    {
      key: 'customerAnalysis',
      label: 'Customer Analysis',
      current: safeAssessment.competencyScores.customerAnalysis,
      previous: safeAssessment.competencyScores.customerAnalysis - 5,
      target: safeMilestone.targets.customerAnalysis,
      targetDate: '2024-09-15'
    },
    {
      key: 'valueCommunication', 
      label: 'Value Communication',
      current: safeAssessment.competencyScores.valueCommunication,
      previous: safeAssessment.competencyScores.valueCommunication - 3,
      target: safeMilestone.targets.valueCommunication,
      targetDate: '2024-09-20'
    },
    {
      key: 'executiveReadiness',
      label: 'Executive Readiness', 
      current: safeAssessment.competencyScores.executiveReadiness,
      previous: safeAssessment.competencyScores.executiveReadiness - 7,
      target: safeMilestone.targets.executiveReadiness,
      targetDate: '2024-09-25'
    }
  ];

  if (loading || isInitialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-slate-300 text-lg">Loading Premium Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Competency Progress Cards */}
          {competencyData.map((competency) => (
            <ModernCard key={competency.key} size="large" className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-white">{competency.label}</h3>
                <ModernCircularProgress
                  percentage={competency.current}
                  size={120}
                  className="mx-auto"
                />
                <div className="text-sm text-slate-400">
                  Target: {competency.target}% by {competency.targetDate}
                </div>
              </div>
            </ModernCard>
          ))}
        </div>
        
        {/* Revenue Opportunity Card */}
        <ModernCard size="large" className="mt-6 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Revenue Opportunity</h2>
          <div className="text-4xl font-bold text-green-400">
            ${safeAssessment.revenue.opportunity.toLocaleString()}
          </div>
          <div className="text-slate-400 mt-2">
            Projected annual impact from revenue intelligence mastery
          </div>
        </ModernCard>
      </div>
    </div>
  );
}