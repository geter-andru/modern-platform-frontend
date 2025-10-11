'use client';

import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/src/shared/components/ui/ModernCard';
import { ModernCircularProgress } from '@/src/shared/components/ui/ModernCircularProgress';
import { useSystematicScaling } from '@/src/shared/contexts/SystematicScalingContext';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Target,
  Users,
  DollarSign,
  BarChart3,
  Award,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle,
  ArrowUp,
  Briefcase,
  FileText,
  Calculator
} from 'lucide-react';

interface SystematicScalingDashboardProps {
  customerId: string;
  customerData: any;
}

const SystematicScalingDashboard: React.FC<SystematicScalingDashboardProps> = ({
  customerId,
  customerData
}) => {
  const router = useRouter();
  const {
    getCompetencyLevel,
    getScalingInsights,
    trackBehavior
  } = useSystematicScaling();

  const [scalingInsights, setScalingInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScalingData = async () => {
      try {
        const insights = await getScalingInsights();
        setScalingInsights(insights);
      } catch (error) {
        console.error('Error loading scaling data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadScalingData();
  }, [getScalingInsights]);

  const currentARR = customerData?.currentARR || '$2M';
  const targetARR = customerData?.targetARR || '$10M';
  const teamSize = customerData?.teamSize || 15;
  
  // Get current competency levels
  const strategicPlanningLevel = getCompetencyLevel('strategic_planning');
  const customerAnalysisLevel = getCompetencyLevel('customer_analysis');
  const financialAnalysisLevel = getCompetencyLevel('financial_analysis');

  // Calculate overall systematic scaling progress
  const overallProgress = Math.round(
    ((strategicPlanningLevel?.currentPoints || 0) +
     (customerAnalysisLevel?.currentPoints || 0) +
     (financialAnalysisLevel?.currentPoints || 0)) / 30
  );

  // ARR Progress calculation (assuming $2M -> $10M journey)
  const arrProgressPercent = Math.min(
    ((parseFloat(currentARR.replace('$', '').replace('M', '')) - 2) / 8) * 100,
    100
  );

  // Calculate scaling velocity (months to reach $10M at current rate)
  const scalingVelocity = Math.max(18 - (overallProgress / 10), 6);

  const handleToolNavigation = async (tool: string, route: string) => {
    await trackBehavior(JSON.stringify({
      eventType: 'tool_usage',
      metadata: {
        tool,
        source: 'dashboard_navigation',
        currentARR,
        overallProgress
      },
      scalingContext: {
        currentARR,
        targetARR,
        growthStage: arrProgressPercent < 25 ? 'early_scaling' : arrProgressPercent < 75 ? 'rapid_scaling' : 'mature_scaling',
        systematicApproach: true
      },
      businessImpact: 'medium',
      professionalCredibility: 75
    }));

    router.push(route);
  };

  const competencyData = [
    {
      label: 'Strategic Planning',
      level: strategicPlanningLevel?.level || 1,
      progress: Math.min(((strategicPlanningLevel?.currentPoints || 0) / 1000) * 100, 100),
      color: 'purple' as const,
      impact: 'Market positioning and growth strategy optimization'
    },
    {
      label: 'Customer Analysis',
      level: customerAnalysisLevel?.level || 1,
      progress: Math.min(((customerAnalysisLevel?.currentPoints || 0) / 1000) * 100, 100),
      color: 'blue' as const,
      impact: 'Enhanced customer intelligence and targeting precision'
    },
    {
      label: 'Financial Analysis',
      level: financialAnalysisLevel?.level || 1,
      progress: Math.min(((financialAnalysisLevel?.currentPoints || 0) / 1000) * 100, 100),
      color: 'green' as const,
      impact: 'Improved ROI modeling and cost optimization'
    }
  ];

  const coreTools = [
    {
      id: 'icp',
      title: 'ICP Analysis',
      description: 'AI-powered customer profiling with systematic intelligence',
      icon: Target,
      route: `/customer/${customerId}/simplified/icp?token=${customerData?.authToken}`,
      color: 'blue' as const,
      competencyBoost: 'Customer Analysis',
      status: 'Ready'
    },
    {
      id: 'financial',
      title: 'Cost Calculator',
      description: 'ROI analysis with systematic scaling recommendations',
      icon: Calculator,
      route: `/customer/${customerId}/simplified/cost-calculator?token=${customerData?.authToken}`,
      color: 'green' as const,
      competencyBoost: 'Financial Analysis',
      status: 'Ready'
    },
    {
      id: 'business-case',
      title: 'Business Case Builder',
      description: 'Executive-ready proposals with scaling intelligence',
      icon: Briefcase,
      route: `/customer/${customerId}/simplified/business-case?token=${customerData?.authToken}`,
      color: 'purple' as const,
      competencyBoost: 'Strategic Planning',
      status: 'Ready'
    },
    {
      id: 'resources',
      title: 'Resource Library',
      description: 'Export-ready intelligence assets for CRM and stakeholders',
      icon: FileText,
      route: `/customer/${customerId}/simplified/resources?token=${customerData?.authToken}`,
      color: 'green' as const,
      competencyBoost: 'All Areas',
      status: 'Ready'
    }
  ];

  const nextMilestones = [
    {
      title: '$3M ARR Milestone',
      description: 'Unlock advanced analytics and predictive modeling',
      progress: Math.min((arrProgressPercent / 25) * 100, 100),
      timeToAchieve: `${Math.max(6 - Math.floor(arrProgressPercent / 10), 1)} months`,
      unlocks: ['Advanced Resource Templates', 'Competitive Intelligence', 'Team Scaling Guidance']
    },
    {
      title: 'Strategic Planning Level 3',
      description: 'Unlock board-ready materials and executive resources',
      progress: strategicPlanningLevel?.level >= 3 ? 100 : ((strategicPlanningLevel?.currentPoints || 0) / 300) * 100,
      timeToAchieve: strategicPlanningLevel?.level >= 3 ? 'Achieved' : '2-4 weeks',
      unlocks: ['Executive Business Cases', 'Board Presentation Templates', 'Series B Readiness']
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-slate-300 text-lg">Loading Systematic Scaling Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Systematic Scaling Status */}
        <div className="text-center mb-8">
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300">Systematic Revenue Scaling Mode Active</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-slate-400">Progress: <span className="text-purple-400 font-semibold">{overallProgress}%</span></span>
                <span className="text-slate-400">→</span>
                <span className="text-slate-400">ETA to $10M: <span className="text-white font-semibold">{scalingVelocity}mo</span></span>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Revenue Intelligence Dashboard
          </h1>
          <p className="text-slate-300 text-lg">
            Systematic scaling from {currentARR} → {targetARR} ARR with AI-powered intelligence
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModernCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-green-900/20 border border-green-700/50">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Current ARR</p>
                <p className="text-2xl font-bold text-white">{currentARR}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000"
                  style={{ width: `${arrProgressPercent}%` }}
                />
              </div>
              <span className="text-xs text-slate-400">{Math.round(arrProgressPercent)}%</span>
            </div>
          </ModernCard>

          <ModernCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-900/20 border border-purple-700/50">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Scaling Velocity</p>
                <p className="text-2xl font-bold text-white">{scalingVelocity}mo</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">Projected time to reach {targetARR}</p>
          </ModernCard>

          <ModernCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-900/20 border border-blue-700/50">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Team Size</p>
                <p className="text-2xl font-bold text-white">{teamSize}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">Optimal for {currentARR} stage</p>
          </ModernCard>

          <ModernCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-900/20 border border-emerald-700/50">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Overall Progress</p>
                <p className="text-2xl font-bold text-white">{overallProgress}%</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">Systematic scaling advancement</p>
          </ModernCard>
        </div>

        {/* Competency Overview */}
        <ModernCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            <h3 className="text-xl font-semibold text-white">Professional Competency Overview</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {competencyData.map((comp, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold">{comp.label}</h4>
                    <p className="text-xs text-slate-400">Level {comp.level}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-${comp.color}-400 font-bold text-lg`}>
                      {Math.round(comp.progress)}%
                    </div>
                  </div>
                </div>
                
                <ModernCircularProgress
                  percentage={comp.progress}
                  size={80}
                  strokeWidth={6}
                  color={comp.color}
                />
                
                <p className="text-xs text-slate-400">{comp.impact}</p>
              </div>
            ))}
          </div>
        </ModernCard>

        {/* Core Tools */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Core Revenue Intelligence Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <ModernCard 
                  key={tool.id} 
                  className="p-6 cursor-pointer hover:border-purple-600/50 transition-all duration-200 hover:scale-105"
                  onClick={() => handleToolNavigation(tool.id, tool.route)}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 rounded-lg bg-${tool.color}-900/20 border border-${tool.color}-700/50`}>
                      <Icon className={`w-5 h-5 text-${tool.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{tool.title}</h4>
                      <p className="text-xs text-slate-400">{tool.status}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-3">{tool.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Enhances: {tool.competencyBoost}</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400">Ready</span>
                    </div>
                  </div>
                </ModernCard>
              );
            })}
          </div>
        </div>

        {/* Next Milestones */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Upcoming Milestones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nextMilestones.map((milestone, index) => (
              <ModernCard key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-semibold">{milestone.title}</h4>
                    <p className="text-sm text-slate-400">{milestone.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-purple-400 font-bold">
                      {Math.round(milestone.progress)}%
                    </div>
                    <p className="text-xs text-slate-400">{milestone.timeToAchieve}</p>
                  </div>
                </div>
                
                <div className="mb-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
                
                <div>
                  <p className="text-sm text-slate-300 mb-2">Unlocks:</p>
                  <div className="space-y-1">
                    {milestone.unlocks.map((unlock, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Award className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs text-slate-400">{unlock}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystematicScalingDashboard;