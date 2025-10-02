'use client';

import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/src/shared/components/ui/ModernCard';
import { ModernCircularProgress } from '@/src/shared/components/ui/ModernCircularProgress';
import { useSystematicScaling } from '@/src/shared/contexts/SystematicScalingContext';

interface CostData {
  delayedRevenue: number;
  competitorAdvantage: number;
  teamEfficiency: number;
  marketOpportunity: number;
}

interface SimplifiedCostCalculatorProps {
  customerId: string;
  customerData: any;
}

const SimplifiedCostCalculator: React.FC<SimplifiedCostCalculatorProps> = ({ 
  customerId, 
  customerData 
}) => {
  const { 
    trackBehavior, 
    awardPoints, 
    getCompetencyLevel,
    getScalingInsights 
  } = useSystematicScaling();
  const [costData, setCostData] = useState<CostData>({
    delayedRevenue: 45000,
    competitorAdvantage: 23000,
    teamEfficiency: 12000,
    marketOpportunity: 38000
  });

  const [timeframe, setTimeframe] = useState(6); // months
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading cost data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [customerId]);

  const calculateTotalCost = () => {
    const monthlyCost = Object.values(costData).reduce((sum, cost) => sum + cost, 0);
    return monthlyCost * timeframe;
  };

  const recalculateCosts = async () => {
    setIsCalculating(true);
    
    // Track systematic scaling behavior
    await trackBehavior({
      eventType: 'tool_usage',
      metadata: {
        tool: 'cost_calculator',
        action: 'recalculate_costs',
        timeframe,
        totalCost: calculateTotalCost()
      },
      scalingContext: {
        currentARR: customerData?.currentARR || '$2M',
        targetARR: customerData?.targetARR || '$10M',
        growthStage: 'rapid_scaling',
        systematicApproach: true
      },
      businessImpact: totalCost > 500000 ? 'high' : totalCost > 200000 ? 'medium' : 'low',
      professionalCredibility: 85
    });
    
    // Award competency points for financial analysis
    await awardPoints('financial_analysis', 15, {
      title: 'Cost Analysis Completed',
      description: `Analyzed ${timeframe}-month cost projection`,
      category: 'financial_analysis',
      impact: 'Identified potential savings opportunities',
      metrics: {
        totalCost: calculateTotalCost(),
        timeframe,
        savingsOpportunity: calculateTotalCost() * 0.75
      }
    });
    
    // Simulate AI recalculation with systematic insights
    setTimeout(async () => {
      setCostData({
        delayedRevenue: costData.delayedRevenue + Math.floor(Math.random() * 10000 - 5000),
        competitorAdvantage: costData.competitorAdvantage + Math.floor(Math.random() * 5000 - 2500),
        teamEfficiency: costData.teamEfficiency + Math.floor(Math.random() * 3000 - 1500),
        marketOpportunity: costData.marketOpportunity + Math.floor(Math.random() * 8000 - 4000)
      });
      setIsCalculating(false);
      
      // Get scaling insights after calculation
      const insights = await getScalingInsights();
      console.log('Scaling insights after cost calculation:', insights);
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

  const totalCost = calculateTotalCost();
  const costFactors = [
    {
      title: 'Delayed Revenue',
      value: costData.delayedRevenue,
      color: 'red' as const,
      description: 'Revenue lost due to slow decision making'
    },
    {
      title: 'Competitive Disadvantage',
      value: costData.competitorAdvantage,
      color: 'orange' as const,
      description: 'Market share lost to competitors'
    },
    {
      title: 'Team Inefficiency',
      value: costData.teamEfficiency,
      color: 'orange' as const,
      description: 'Productivity costs of manual processes'
    },
    {
      title: 'Missed Opportunities',
      value: costData.marketOpportunity,
      color: 'purple' as const,
      description: 'Potential deals not pursued'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Systematic Scaling Status Bar */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">Systematic Revenue Scaling Mode Active</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-slate-400">Current ARR: <span className="text-white font-semibold">{customerData?.currentARR || '$2M'}</span></span>
              <span className="text-slate-400">→</span>
              <span className="text-slate-400">Target: <span className="text-green-400 font-semibold">{customerData?.targetARR || '$10M'}</span></span>
            </div>
          </div>
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-2xl opacity-10"></div>
            <div className="relative p-6 rounded-2xl border border-slate-700">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
                <h1 className="text-3xl font-bold text-white">
                  Cost of Inaction Calculator
                </h1>
              </div>
              <p className="text-slate-300 mb-4">
                Calculate the real cost of delayed decision making
              </p>
              
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-2">
                  <label className="text-white text-sm">Timeframe:</label>
                  <select 
                    value={timeframe}
                    onChange={(e) => setTimeframe(Number(e.target.value))}
                    className="bg-slate-700 text-white px-3 py-1 rounded-lg border border-slate-600"
                  >
                    <option value={3}>3 months</option>
                    <option value={6}>6 months</option>
                    <option value={12}>12 months</option>
                    <option value={18}>18 months</option>
                  </select>
                </div>
                
                <button
                  onClick={recalculateCosts}
                  disabled={isCalculating}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50"
                >
                  {isCalculating ? (
                    <span className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Calculating...</span>
                    </span>
                  ) : (
                    'Recalculate Costs'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Total Cost Overview */}
        <ModernCard className="p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Total Cost of Inaction</h2>
            <div className="text-6xl font-bold text-red-400 mb-4">
              ${(totalCost / 1000).toFixed(0)}K
            </div>
            <p className="text-slate-400">Projected cost over {timeframe} months of delayed decision</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-red-400">${(costData.delayedRevenue / 1000).toFixed(0)}K</div>
              <div className="text-slate-400">Delayed Revenue</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">${(costData.competitorAdvantage / 1000).toFixed(0)}K</div>
              <div className="text-slate-400">Competitive Loss</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">${(costData.teamEfficiency / 1000).toFixed(0)}K</div>
              <div className="text-slate-400">Efficiency Loss</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">${(costData.marketOpportunity / 1000).toFixed(0)}K</div>
              <div className="text-slate-400">Missed Opportunities</div>
            </div>
          </div>
        </ModernCard>

        {/* Cost Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {costFactors.map((factor, index) => (
            <ModernCard key={index} className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">{factor.title}</h3>
                <ModernCircularProgress
                  percentage={Math.min((factor.value / 50000) * 100, 100)}
                  size={100}
                  strokeWidth={8}
                  color={factor.color}
                />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">
                  ${(factor.value / 1000).toFixed(0)}K<span className="text-sm text-slate-400">/mo</span>
                </div>
                <div className="text-sm text-slate-400">{factor.description}</div>
              </div>
            </ModernCard>
          ))}
        </div>

        {/* Impact Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModernCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h3 className="text-xl font-semibold text-white">Cost Breakdown</h3>
            </div>
            
            <div className="space-y-4">
              {costFactors.map((factor, index) => {
                const percentage = (factor.value / Object.values(costData).reduce((sum, cost) => sum + cost, 0)) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white">{factor.title}</span>
                      <span className={`text-${factor.color}-400 font-semibold`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r from-${factor.color}-500 to-${factor.color}-600 rounded-full transition-all duration-1000`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </ModernCard>

          <ModernCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              <h3 className="text-xl font-semibold text-white">Savings Opportunity</h3>
            </div>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-emerald-900/20 border border-emerald-700/50 rounded-lg">
                <div className="text-emerald-400 font-semibold text-2xl">
                  ${(totalCost * 0.75 / 1000).toFixed(0)}K
                </div>
                <div className="text-slate-300 text-sm">Potential savings with immediate action</div>
              </div>
              
              <div className="space-y-3">
                {[
                  { action: 'Implement revenue intelligence', savings: '65%' },
                  { action: 'Optimize sales processes', savings: '23%' },
                  { action: 'Improve team productivity', savings: '12%' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                    <span className="text-white text-sm">{item.action}</span>
                    <span className="text-emerald-400 font-semibold">{item.savings}</span>
                  </div>
                ))}
              </div>
            </div>
          </ModernCard>
        </div>

        {/* Systematic Scaling Recommendations */}
        <ModernCard className="p-6 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            <h3 className="text-xl font-semibold text-white">Systematic Scaling Actions</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-900/20 border border-purple-700/50 rounded-lg">
              <div className="text-purple-400 font-semibold mb-2">Immediate Action</div>
              <div className="text-white text-sm mb-2">Implement Revenue Intelligence</div>
              <div className="text-slate-400 text-xs">Expected ROI: {Math.round(totalCost * 0.65 / 1000)}K saved</div>
              <div className="mt-2 text-xs text-purple-400">+50 Competency Points</div>
            </div>
            
            <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
              <div className="text-blue-400 font-semibold mb-2">30-Day Action</div>
              <div className="text-white text-sm mb-2">Optimize Sales Processes</div>
              <div className="text-slate-400 text-xs">Expected ROI: {Math.round(totalCost * 0.23 / 1000)}K saved</div>
              <div className="mt-2 text-xs text-blue-400">+30 Competency Points</div>
            </div>
            
            <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
              <div className="text-green-400 font-semibold mb-2">90-Day Action</div>
              <div className="text-white text-sm mb-2">Scale Team Productivity</div>
              <div className="text-slate-400 text-xs">Expected ROI: {Math.round(totalCost * 0.12 / 1000)}K saved</div>
              <div className="mt-2 text-xs text-green-400">+20 Competency Points</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-slate-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Your Financial Analysis Competency Level:</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((getCompetencyLevel('financial_analysis')?.currentPoints || 0) / 1000 * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-purple-400 font-semibold">
                  Level {getCompetencyLevel('financial_analysis')?.level || 1}
                </span>
              </div>
            </div>
          </div>
        </ModernCard>
        
        {/* Action Timeline */}
        <ModernCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <h3 className="text-xl font-semibold text-white">Cost Escalation Timeline</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { period: 'Month 1', cost: totalCost / timeframe, status: 'current' },
              { period: 'Month 3', cost: (totalCost / timeframe) * 3, status: 'warning' },
              { period: 'Month 6', cost: (totalCost / timeframe) * 6, status: 'danger' },
              { period: 'Month 12', cost: (totalCost / timeframe) * 12, status: 'critical' }
            ].map((item, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                item.status === 'current' ? 'bg-blue-900/20 border-blue-700/50' :
                item.status === 'warning' ? 'bg-yellow-900/20 border-yellow-700/50' :
                item.status === 'danger' ? 'bg-orange-900/20 border-orange-700/50' :
                'bg-red-900/20 border-red-700/50'
              }`}>
                <div className="text-white font-medium">{item.period}</div>
                <div className={`text-2xl font-bold ${
                  item.status === 'current' ? 'text-blue-400' :
                  item.status === 'warning' ? 'text-yellow-400' :
                  item.status === 'danger' ? 'text-orange-400' :
                  'text-red-400'
                }`}>
                  ${(item.cost / 1000).toFixed(0)}K
                </div>
                <div className="text-slate-400 text-sm">Cumulative cost</div>
              </div>
            ))}
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default SimplifiedCostCalculator;