'use client';

import React from 'react';
import { ModernCard } from '@/src/shared/components/ui/ModernCard';
import { ModernCircularProgress } from '@/src/shared/components/ui/ModernCircularProgress';

interface ICPResultsProps {
  customerId: string;
  icpData?: any;
  isLoading: boolean;
}

export function ICPResults({ customerId, icpData, isLoading }: ICPResultsProps) {
  // Mock data for demonstration
  const mockResults = {
    overallScore: 87,
    companyName: 'TechCorp Solutions',
    factors: [
      { name: 'Company Size', score: 92, color: 'emerald', weight: 25 },
      { name: 'Industry Fit', score: 88, color: 'blue', weight: 30 },
      { name: 'Revenue Range', score: 85, color: 'purple', weight: 20 },
      { name: 'Decision Timeline', score: 82, color: 'indigo', weight: 15 },
      { name: 'Pain Point Match', score: 90, color: 'pink', weight: 10 }
    ],
    insights: [
      {
        type: 'strength',
        title: 'Perfect Size Match',
        description: 'Company size aligns perfectly with our ICP sweet spot'
      },
      {
        type: 'opportunity',
        title: 'Strong Industry Fit',
        description: 'Technology sector shows high conversion rates'
      },
      {
        type: 'risk',
        title: 'Timeline Consideration',
        description: 'Decision timeline may require nurturing approach'
      }
    ],
    recommendations: [
      'Schedule executive-level demo within 2 weeks',
      'Share relevant case studies from similar companies',
      'Connect with technical decision makers',
      'Provide ROI calculator with industry benchmarks'
    ]
  };

  const results = icpData || mockResults;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <ModernCard key={index} className="animate-pulse">
            <div className="h-48 bg-slate-700 rounded-lg"></div>
          </ModernCard>
        ))}
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'emerald';
    if (score >= 70) return 'blue';
    if (score >= 55) return 'orange';
    return 'red';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return '💪';
      case 'opportunity': return '🎯';
      case 'risk': return '⚠️';
      default: return '💡';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <ModernCard className="p-8 text-center">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            {results.companyName} - ICP Analysis
          </h3>
          <div className={`text-6xl font-bold text-${getScoreColor(results.overallScore)}-400 mb-4`}>
            {results.overallScore}
          </div>
          <p className="text-slate-400">Overall ICP Fit Score</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${
            results.overallScore >= 85 ? 'bg-emerald-900/20 border border-emerald-700/50' :
            results.overallScore >= 70 ? 'bg-blue-900/20 border border-blue-700/50' :
            results.overallScore >= 55 ? 'bg-orange-900/20 border border-orange-700/50' :
            'bg-red-900/20 border border-red-700/50'
          }`}>
            <div className="text-white font-medium">Priority Level</div>
            <div className={`text-${getScoreColor(results.overallScore)}-400 font-semibold text-lg`}>
              {results.overallScore >= 85 ? 'High Priority' : 
               results.overallScore >= 70 ? 'Medium Priority' : 
               results.overallScore >= 55 ? 'Low Priority' : 'Not Qualified'}
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${
            results.overallScore >= 85 ? 'bg-emerald-900/20 border border-emerald-700/50' :
            results.overallScore >= 70 ? 'bg-blue-900/20 border border-blue-700/50' :
            results.overallScore >= 55 ? 'bg-orange-900/20 border border-orange-700/50' :
            'bg-red-900/20 border border-red-700/50'
          }`}>
            <div className="text-white font-medium">Confidence Level</div>
            <div className={`text-${getScoreColor(results.overallScore)}-400 font-semibold text-lg`}>
              {results.overallScore >= 85 ? 'Very High' : 
               results.overallScore >= 70 ? 'High' : 
               results.overallScore >= 55 ? 'Medium' : 'Low'}
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${
            results.overallScore >= 85 ? 'bg-emerald-900/20 border border-emerald-700/50' :
            results.overallScore >= 70 ? 'bg-blue-900/20 border border-blue-700/50' :
            results.overallScore >= 55 ? 'bg-orange-900/20 border border-orange-700/50' :
            'bg-red-900/20 border border-red-700/50'
          }`}>
            <div className="text-white font-medium">Next Action</div>
            <div className={`text-${getScoreColor(results.overallScore)}-400 font-semibold text-lg`}>
              {results.overallScore >= 85 ? 'Book Demo' : 
               results.overallScore >= 70 ? 'Qualify Further' : 
               results.overallScore >= 55 ? 'Nurture' : 'Disqualify'}
            </div>
          </div>
        </div>
      </ModernCard>

      {/* Factor Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {results.factors.map((factor, index) => (
          <ModernCard key={index} className="p-6">
            <div className="text-center mb-4">
              <h4 className="text-white font-medium mb-2">{factor.name}</h4>
              <ModernCircularProgress
                percentage={factor.score}
                size={80}
                strokeWidth={6}
                color={factor.color}
              />
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-white mb-1">{factor.score}</div>
              <div className="text-xs text-slate-400">Weight: {factor.weight}%</div>
            </div>
          </ModernCard>
        ))}
      </div>

      {/* Key Insights */}
      <ModernCard className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-white">Key Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {results.insights.map((insight, index) => (
            <div key={index} className="p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xl">{getInsightIcon(insight.type)}</span>
                <h4 className="text-white font-medium">{insight.title}</h4>
              </div>
              <p className="text-slate-400 text-sm">{insight.description}</p>
            </div>
          ))}
        </div>
      </ModernCard>

      {/* Recommendations */}
      <ModernCard className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-white">Next Steps</h3>
        </div>
        
        <div className="space-y-3">
          {results.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-slate-800 rounded-lg">
              <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <div>
                <p className="text-white">{recommendation}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 mr-4">
            Export Analysis
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            Schedule Follow-up
          </button>
        </div>
      </ModernCard>
    </div>
  );
}