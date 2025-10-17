'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ModernCard } from '@/src/shared/components/ui/ModernCard';

interface AssessmentData {
  results: {
    overallScore: number;
    buyerScore: number;
    techScore: number;
    qualification: 'Qualified' | 'Promising' | 'Developing' | 'Early Stage';
  };
  challenges?: Array<{
    name: string;
    severity: 'high' | 'medium' | 'low';
    evidence: string;
    pattern: string;
    revenueImpact: string;
  }>;
}

interface AssessmentChallengesWidgetProps {
  assessmentData: AssessmentData;
}

export function AssessmentChallengesWidget({ assessmentData }: AssessmentChallengesWidgetProps) {
  const { results, challenges } = assessmentData;

  const getTopChallenge = () => {
    if (results.buyerScore < 50) return "Customer Discovery & Buyer Understanding";
    if (results.techScore < 50) return "Technical Value Translation";
    if (results.qualification === 'Developing') return "Revenue Execution Fundamentals";
    return "Advanced Revenue Scaling";
  };

  const getChallengeSeverity = (score: number) => {
    if (score < 50) return 'high';
    if (score < 70) return 'medium';
    return 'low';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-accent-danger bg-accent-danger/20 border-accent-danger/30';
      case 'medium': return 'text-accent-warning bg-accent-warning/20 border-accent-warning/30';
      case 'low': return 'text-accent-success bg-accent-success/20 border-accent-success/30';
      default: return 'text-text-muted bg-text-muted/20 border-text-muted/30';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high': return 'CRITICAL';
      case 'medium': return 'MODERATE';
      case 'low': return 'MINOR';
      default: return 'UNKNOWN';
    }
  };

  // Generate challenges based on assessment scores if not provided
  const generatedChallenges = challenges || [
    {
      name: getTopChallenge(),
      severity: getChallengeSeverity(results.overallScore),
      evidence: `Assessment scoring indicates knowledge gaps in ${results.buyerScore < 50 ? 'customer discovery' : 'technical value translation'}`,
      pattern: results.buyerScore < 50 
        ? 'Technical founders often focus on product features vs buyer value'
        : 'Difficulty translating technical capabilities into business impact',
      revenueImpact: results.buyerScore < 50 
        ? '25-40% longer sales cycles, lower conversion rates'
        : 'Reduced stakeholder buy-in, slower decision making'
    },
    {
      name: results.techScore < 70 ? 'Technical Value Communication' : 'Advanced Revenue Scaling',
      severity: getChallengeSeverity(results.techScore),
      evidence: `Technical translation score of ${results.techScore}% indicates room for improvement`,
      pattern: 'Struggling to connect technical features to business outcomes',
      revenueImpact: 'Missed opportunities for enterprise partnerships'
    },
    {
      name: results.qualification === 'Early Stage' ? 'Revenue Fundamentals' : 'Strategic Execution',
      severity: results.qualification === 'Early Stage' ? 'high' : 'medium',
      evidence: `Qualification level: ${results.qualification}`,
      pattern: results.qualification === 'Early Stage' 
        ? 'Building foundational revenue capabilities'
        : 'Optimizing existing revenue processes',
      revenueImpact: results.qualification === 'Early Stage'
        ? 'Delayed revenue growth, missed market opportunities'
        : 'Suboptimal revenue performance, competitive disadvantage'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-6 text-white">Top Challenges Identified</h2>
      
      {generatedChallenges.map((challenge, index) => (
        <ModernCard key={index} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {challenge.severity === 'high' ? '🔴' : 
                 challenge.severity === 'medium' ? '🟡' : '🟢'}
              </span>
              <h3 className="text-xl font-semibold text-white">{challenge.name}</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(challenge.severity)}`}>
              {getSeverityLabel(challenge.severity)}
            </span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-400 mb-1">Evidence</div>
              <div className="text-gray-300">{challenge.evidence}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Pattern</div>
              <div className="text-gray-300">{challenge.pattern}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Revenue Impact</div>
              <div className="text-gray-300">{challenge.revenueImpact}</div>
            </div>
          </div>
        </ModernCard>
      ))}
      
      <ModernCard className="p-8 text-center">
        <p className="text-gray-400 mb-4">View detailed challenge analysis and solutions in your ICP Analysis and Cost Calculator tools.</p>
        <button 
          onClick={() => window.location.href = '/icp'}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
        >
          <span>Explore Solutions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </ModernCard>
    </div>
  );
}

