'use client';

/**
 * ActionStatisticsWidget - Comprehensive action tracking statistics
 *
 * Features:
 * - Total actions count and total points earned
 * - Breakdown by action type (pie chart)
 * - Breakdown by impact level (bar chart)
 * - Time period filters (7d, 30d, 90d, All time)
 * - Average impact multiplier calculation
 * - Category distribution analysis
 */

import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, Award, Target, Calendar, Users, DollarSign, FileText, Lightbulb, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, BarChart, Bar, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { LucideIcon } from 'lucide-react';

interface Action {
  id: string;
  type: string;
  category: 'customerAnalysis' | 'valueCommunication' | 'salesExecution';
  impact: 'low' | 'medium' | 'high' | 'critical';
  pointsAwarded: number;
  timestamp: Date;
}

interface ActionStatisticsWidgetProps {
  actions?: Action[];
  className?: string;
}

interface ActionTypeStats {
  type: string;
  name: string;
  count: number;
  points: number;
  color: string;
  icon: LucideIcon;
}

interface ImpactLevelStats {
  level: string;
  name: string;
  count: number;
  multiplier: number;
  color: string;
}

type TimePeriod = '7d' | '30d' | '90d' | 'all';

const ActionStatisticsWidget: React.FC<ActionStatisticsWidgetProps> = ({
  actions: propActions,
  className = ''
}) => {
  const [actions, setActions] = useState<Action[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30d');

  // Action type definitions (matching RealWorldActionTracker)
  const actionTypeDefinitions = [
    {
      id: 'customer_meeting',
      name: 'Customer Discovery',
      category: 'customerAnalysis',
      icon: Users,
      basePoints: 100,
      color: '#3B82F6' // blue
    },
    {
      id: 'prospect_qualification',
      name: 'Prospect Qualification',
      category: 'customerAnalysis',
      icon: Target,
      basePoints: 75,
      color: '#06B6D4' // cyan
    },
    {
      id: 'value_proposition_delivery',
      name: 'Value Proposition',
      category: 'valueCommunication',
      icon: TrendingUp,
      basePoints: 150,
      color: '#10B981' // green
    },
    {
      id: 'roi_presentation',
      name: 'ROI Analysis',
      category: 'valueCommunication',
      icon: BarChart3,
      basePoints: 200,
      color: '#22C55E' // green-500
    },
    {
      id: 'proposal_creation',
      name: 'Business Proposal',
      category: 'salesExecution',
      icon: FileText,
      basePoints: 250,
      color: '#8B5CF6' // purple
    },
    {
      id: 'deal_closure',
      name: 'Deal Closure',
      category: 'salesExecution',
      icon: Award,
      basePoints: 500,
      color: '#A855F7' // purple-500
    },
    {
      id: 'referral_generation',
      name: 'Referral Generation',
      category: 'salesExecution',
      icon: ExternalLink,
      basePoints: 300,
      color: '#C084FC' // purple-400
    },
    {
      id: 'case_study_development',
      name: 'Case Study',
      category: 'valueCommunication',
      icon: Lightbulb,
      basePoints: 400,
      color: '#34D399' // green-400
    }
  ];

  // Impact level definitions
  const impactLevelDefinitions = [
    { id: 'low', name: 'Standard Impact', multiplier: 0.8, color: '#9CA3AF' },      // gray-400
    { id: 'medium', name: 'Significant Impact', multiplier: 1.0, color: '#60A5FA' }, // blue-400
    { id: 'high', name: 'High Impact', multiplier: 1.5, color: '#34D399' },          // green-400
    { id: 'critical', name: 'Critical Impact', multiplier: 2.0, color: '#A855F7' }   // purple-500
  ];

  // Generate sample actions
  const generateSampleActions = (): Action[] => {
    const sampleActions: Action[] = [];
    const now = Date.now();

    // Generate 50 sample actions over 120 days
    for (let i = 0; i < 50; i++) {
      const type = actionTypeDefinitions[Math.floor(Math.random() * actionTypeDefinitions.length)];
      const impact = impactLevelDefinitions[Math.floor(Math.random() * impactLevelDefinitions.length)];
      const daysAgo = Math.floor(Math.random() * 120);
      const points = Math.round(type.basePoints * impact.multiplier);

      sampleActions.push({
        id: `action-${i}`,
        type: type.id,
        category: type.category as 'customerAnalysis' | 'valueCommunication' | 'salesExecution',
        impact: impact.id as 'low' | 'medium' | 'high' | 'critical',
        pointsAwarded: points,
        timestamp: new Date(now - daysAgo * 24 * 60 * 60 * 1000)
      });
    }

    return sampleActions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  // Initialize actions
  useEffect(() => {
    if (propActions) {
      setActions(propActions);
    } else {
      setActions(generateSampleActions());
    }
  }, [propActions]);

  // Filter actions by time period
  const filteredActions = useMemo(() => {
    if (timePeriod === 'all') return actions;

    const now = Date.now();
    const days = timePeriod === '7d' ? 7 : timePeriod === '30d' ? 30 : 90;
    const cutoff = now - (days * 24 * 60 * 60 * 1000);

    return actions.filter(action => action.timestamp.getTime() >= cutoff);
  }, [actions, timePeriod]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalActions = filteredActions.length;
    const totalPoints = filteredActions.reduce((sum, action) => sum + action.pointsAwarded, 0);

    // Calculate average impact
    const averageImpact = totalActions > 0
      ? filteredActions.reduce((sum, action) => {
          const impactDef = impactLevelDefinitions.find(i => i.id === action.impact);
          return sum + (impactDef?.multiplier || 1);
        }, 0) / totalActions
      : 0;

    // Action type statistics
    const typeStats: Record<string, ActionTypeStats> = {};
    filteredActions.forEach(action => {
      if (!typeStats[action.type]) {
        const typeDef = actionTypeDefinitions.find(t => t.id === action.type);
        typeStats[action.type] = {
          type: action.type,
          name: typeDef?.name || action.type,
          count: 0,
          points: 0,
          color: typeDef?.color || '#9CA3AF',
          icon: typeDef?.icon || Target
        };
      }
      typeStats[action.type].count++;
      typeStats[action.type].points += action.pointsAwarded;
    });

    // Impact level statistics
    const impactStats: Record<string, ImpactLevelStats> = {};
    filteredActions.forEach(action => {
      if (!impactStats[action.impact]) {
        const impactDef = impactLevelDefinitions.find(i => i.id === action.impact);
        impactStats[action.impact] = {
          level: action.impact,
          name: impactDef?.name || action.impact,
          count: 0,
          multiplier: impactDef?.multiplier || 1,
          color: impactDef?.color || '#9CA3AF'
        };
      }
      impactStats[action.impact].count++;
    });

    // Category statistics
    const categoryStats = {
      customerAnalysis: filteredActions.filter(a => a.category === 'customerAnalysis').length,
      valueCommunication: filteredActions.filter(a => a.category === 'valueCommunication').length,
      salesExecution: filteredActions.filter(a => a.category === 'salesExecution').length
    };

    return {
      totalActions,
      totalPoints,
      averageImpact,
      byType: Object.values(typeStats),
      byImpact: Object.values(impactStats),
      byCategory: categoryStats
    };
  }, [filteredActions]);

  // Prepare pie chart data (top 6 action types)
  const pieChartData = useMemo(() => {
    return statistics.byType
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
      .map(stat => ({
        name: stat.name,
        value: stat.count,
        color: stat.color
      }));
  }, [statistics.byType]);

  // Prepare bar chart data (impact levels)
  const barChartData = useMemo(() => {
    const order = ['low', 'medium', 'high', 'critical'];
    return order
      .map(level => statistics.byImpact.find(s => s.level === level))
      .filter(Boolean)
      .map(stat => ({
        name: stat!.name.replace(' Impact', ''),
        count: stat!.count,
        color: stat!.color
      }));
  }, [statistics.byImpact]);

  // Time period options
  const timePeriodOptions = [
    { value: '7d' as TimePeriod, label: '7 Days' },
    { value: '30d' as TimePeriod, label: '30 Days' },
    { value: '90d' as TimePeriod, label: '90 Days' },
    { value: 'all' as TimePeriod, label: 'All Time' }
  ];

  return (
    <motion.div
      className={`bg-[#1a1a1a] border border-transparent rounded-xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-b border-transparent p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-bold text-white">Action Statistics</h3>
          <BarChart3 className="w-6 h-6 text-purple-400" />
        </div>
        <p className="text-sm text-gray-400">Comprehensive activity analytics and performance metrics</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Time Period Filter */}
        <div className="flex flex-wrap gap-2">
          {timePeriodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTimePeriod(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timePeriod === option.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{statistics.totalActions}</div>
            <div className="text-xs text-gray-400">Total Actions</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {statistics.totalPoints.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Points Earned</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {statistics.averageImpact.toFixed(1)}x
            </div>
            <div className="text-xs text-gray-400">Avg Impact</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {statistics.totalActions > 0
                ? Math.round(statistics.totalPoints / statistics.totalActions)
                : 0}
            </div>
            <div className="text-xs text-gray-400">Avg Points/Action</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Action Type Distribution (Pie Chart) */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-4">Action Type Distribution</h4>
            {pieChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      animationDuration={1000}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="mt-4 space-y-1">
                  {pieChartData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
                        <span className="text-gray-300">{entry.name}</span>
                      </div>
                      <span className="text-gray-400">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">
                No actions in this period
              </div>
            )}
          </div>

          {/* Impact Level Distribution (Bar Chart) */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-4">Impact Level Distribution</h4>
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barChartData}>
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} animationDuration={1000}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">
                No actions in this period
              </div>
            )}

            {/* Impact Legend */}
            {barChartData.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-1">
                {barChartData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
                      <span className="text-gray-300">{entry.name}</span>
                    </div>
                    <span className="text-gray-400">{entry.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-white mb-3">Category Breakdown</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">
                {statistics.byCategory.customerAnalysis}
              </div>
              <div className="text-xs text-gray-400 mt-1">Customer Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {statistics.byCategory.valueCommunication}
              </div>
              <div className="text-xs text-gray-400 mt-1">Value Communication</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">
                {statistics.byCategory.salesExecution}
              </div>
              <div className="text-xs text-gray-400 mt-1">Sales Execution</div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {statistics.totalActions === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No actions recorded in this time period</p>
            <p className="text-xs mt-1">Try selecting a different time range</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ActionStatisticsWidget;
