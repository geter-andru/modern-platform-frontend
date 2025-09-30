'use client';

import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/src/shared/components/ui/ModernCard';
import { ModernCircularProgress } from '@/src/shared/components/ui/ModernCircularProgress';
import { useSystematicScaling } from '@/src/shared/contexts/SystematicScalingContext';

interface BusinessCaseData {
  currentCost: number;
  timeToDecision: number;
  revenueImpact: number;
  competitorAdvantage: number;
  teamProductivity: number;
}

interface SimplifiedBusinessCaseBuilderProps {
  customerId: string;
  customerData: any;
}

const SimplifiedBusinessCaseBuilder: React.FC<SimplifiedBusinessCaseBuilderProps> = ({ 
  customerId, 
  customerData 
}) => {
  const { 
    trackBehavior, 
    awardPoints,
    getCompetencyLevel,
    getScalingInsights,
    orchestrateScalingPlan 
  } = useSystematicScaling();
  const [businessCase, setBusinessCase] = useState<BusinessCaseData>({
    currentCost: 25000,
    timeToDecision: 90,
    revenueImpact: 150000,
    competitorAdvantage: 85,
    teamProductivity: 68
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading business case data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [customerId]);

  const generateBusinessCase = async () => {
    setIsGenerating(true);
    
    // Track systematic scaling behavior for business case generation
    await trackBehavior({
      eventType: 'tool_usage',
      metadata: {
        tool: 'business_case_builder',
        action: 'generate_case',
        currentCost: businessCase.currentCost,
        revenueImpact: businessCase.revenueImpact
      },
      scalingContext: {
        currentARR: customerData?.currentARR || '$2M',
        targetARR: customerData?.targetARR || '$10M',
        growthStage: 'rapid_scaling',
        systematicApproach: true
      },
      businessImpact: businessCase.revenueImpact > 200000 ? 'high' : 'medium',
      professionalCredibility: 90
    });
    
    // Orchestrate comprehensive scaling plan
    const scalingPlan = await orchestrateScalingPlan({
      currentState: {
        arr: customerData?.currentARR || '$2M',
        teamSize: customerData?.teamSize || 15,
        productComplexity: 'high'
      },
      targetState: {
        arr: customerData?.targetARR || '$10M',
        timeframe: '18 months'
      },
      constraints: {
        budget: businessCase.currentCost * 12,
        teamGrowthRate: 2.0
      }
    });
    
    console.log('Generated scaling plan:', scalingPlan);
    
    // Award competency points for strategic planning
    await awardPoints('strategic_planning', 25, {
      title: 'Business Case Generated',
      description: `Created comprehensive business case with ${businessCase.revenueImpact / 1000}K revenue impact`,
      category: 'strategic_planning',
      impact: 'Executive-ready proposal for systematic scaling',
      metrics: {
        revenueImpact: businessCase.revenueImpact,
        roi: Math.round((businessCase.revenueImpact / businessCase.currentCost) * 100),
        timeToValue: businessCase.timeToDecision
      }
    });
    
    // Simulate AI generation with enhanced metrics
    setTimeout(async () => {
      setBusinessCase(prev => ({
        ...prev,
        revenueImpact: prev.revenueImpact + Math.floor(Math.random() * 50000),
        competitorAdvantage: Math.min(prev.competitorAdvantage + Math.floor(Math.random() * 10), 100),
        teamProductivity: Math.min(prev.teamProductivity + Math.floor(Math.random() * 15), 100)
      }));
      setIsGenerating(false);
      
      // Get updated scaling insights
      const insights = await getScalingInsights();
      console.log('Scaling insights after business case:', insights);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <ModernCard key={index} className="animate-pulse">
                <div className="h-48 bg-slate-700 rounded-lg"></div>
              </ModernCard>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const roiMetrics = [
    {
      title: 'Cost of Inaction',
      value: `$${(businessCase.currentCost / 1000).toFixed(0)}K`,
      progress: Math.min((businessCase.currentCost / 100000) * 100, 100),
      color: 'red' as const,
      description: 'Monthly cost of delayed decision'
    },
    {
      title: 'Revenue Impact',
      value: `$${(businessCase.revenueImpact / 1000).toFixed(0)}K`,
      progress: Math.min((businessCase.revenueImpact / 300000) * 100, 100),
      color: 'green' as const,
      description: 'Projected annual revenue increase'
    },
    {
      title: 'Competitive Advantage',
      value: `${businessCase.competitorAdvantage}%`,
      progress: businessCase.competitorAdvantage,
      color: 'purple' as const,
      description: 'Market positioning improvement'
    },
    {
      title: 'Team Productivity',
      value: `${businessCase.teamProductivity}%`,
      progress: businessCase.teamProductivity,
      color: 'blue' as const,
      description: 'Efficiency improvement'
    }
  ];

  const totalROI = ((businessCase.revenueImpact - businessCase.currentCost) / businessCase.currentCost) * 100;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl opacity-10"></div>
            <div className="relative p-6 rounded-2xl border border-slate-700">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                <h1 className="text-3xl font-bold text-white">
                  Business Case Builder
                </h1>
              </div>
              <p className="text-slate-300 mb-4">
                AI-powered ROI analysis and stakeholder presentation
              </p>
              
              <button
                onClick={generateBusinessCase}
                disabled={isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50"
              >
                {isGenerating ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </span>
                ) : (
                  'Generate Business Case'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ROI Overview */}
        <ModernCard className="p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Total ROI Projection</h2>
            <div className="text-5xl font-bold text-emerald-400 mb-4">
              {totalROI > 0 ? '+' : ''}{totalROI.toFixed(0)}%
            </div>
            <p className="text-slate-400">Expected return on investment within 12 months</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-emerald-400">${(businessCase.revenueImpact / 1000).toFixed(0)}K</div>
              <div className="text-slate-400">Revenue Increase</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">${(businessCase.currentCost / 1000).toFixed(0)}K</div>
              <div className="text-slate-400">Cost of Delay</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{businessCase.timeToDecision} days</div>
              <div className="text-slate-400">Decision Timeline</div>
            </div>
          </div>
        </ModernCard>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roiMetrics.map((metric, index) => (
            <ModernCard key={index} className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">{metric.title}</h3>
                <ModernCircularProgress
                  percentage={metric.progress}
                  size={100}
                  strokeWidth={8}
                  color={metric.color}
                />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">{metric.value}</div>
                <div className="text-sm text-slate-400">{metric.description}</div>
              </div>
            </ModernCard>
          ))}
        </div>

        {/* Executive Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModernCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              <h3 className="text-xl font-semibold text-white">Key Benefits</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="text-white font-medium">Revenue Growth</div>
                  <div className="text-slate-400 text-sm">Projected ${(businessCase.revenueImpact / 1000).toFixed(0)}K increase in annual revenue through better customer targeting</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="text-white font-medium">Competitive Edge</div>
                  <div className="text-slate-400 text-sm">{businessCase.competitorAdvantage}% improvement in market positioning and customer intelligence</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="text-white font-medium">Team Efficiency</div>
                  <div className="text-slate-400 text-sm">{businessCase.teamProductivity}% increase in sales team productivity and conversion rates</div>
                </div>
              </div>
            </div>
          </ModernCard>

          <ModernCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h3 className="text-xl font-semibold text-white">Cost of Inaction</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                <div className="text-red-400 font-semibold text-lg">${(businessCase.currentCost / 1000).toFixed(0)}K/month</div>
                <div className="text-slate-300 text-sm">Lost revenue due to delayed decision making</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Missed opportunities</span>
                  <span className="text-red-400">-$15K/month</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Competitive disadvantage</span>
                  <span className="text-red-400">-$8K/month</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Team inefficiency</span>
                  <span className="text-red-400">-$2K/month</span>
                </div>
              </div>
            </div>
          </ModernCard>
        </div>

        {/* Implementation Timeline */}
        <ModernCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
            <h3 className="text-xl font-semibold text-white">Implementation Roadmap</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { phase: 'Week 1-2', task: 'Platform Setup', status: 'ready' },
              { phase: 'Week 3-4', task: 'Team Onboarding', status: 'ready' },
              { phase: 'Week 5-8', task: 'Data Integration', status: 'planned' },
              { phase: 'Week 9-12', task: 'Full Deployment', status: 'planned' }
            ].map((item, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                item.status === 'ready' 
                  ? 'bg-emerald-900/20 border-emerald-700/50' 
                  : 'bg-slate-800 border-slate-700'
              }`}>
                <div className="text-white font-medium">{item.phase}</div>
                <div className="text-slate-400 text-sm">{item.task}</div>
                <div className={`text-xs mt-2 ${
                  item.status === 'ready' ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {item.status === 'ready' ? 'Ready to start' : 'Planned'}
                </div>
              </div>
            ))}
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default SimplifiedBusinessCaseBuilder;