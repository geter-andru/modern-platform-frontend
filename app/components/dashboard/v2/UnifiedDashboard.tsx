'use client';

/**
 * UnifiedDashboard - Consolidated Professional & Customer Dashboard
 *
 * Combines ProfessionalDashboard + CustomerDashboard into a single unified view
 * Answers the question: "Where am I now?"
 *
 * Features:
 * - Activity tracking and filtering
 * - Weekly progress summary
 * - Competency overview (circular gauges)
 * - Quick actions with tool access
 * - Recent milestones and achievements
 *
 * Integrated Widgets:
 * - InteractiveFilters (time, competency, activity, impact)
 * - WeeklySummary (progress aggregation)
 * - RecentActivity (activity stream with metrics)
 * - CircularCompetencyGauge (3 core competencies)
 * - ActiveToolDisplay (current tool indicator)
 * - RecentMilestones (achievements)
 * - QuickActionButton (tool shortcuts)
 * - SummaryMetric (key stats)
 * - ActivityItem (list items)
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, AlertCircle } from 'lucide-react';
import { ProgressLineChart } from './widgets/ProgressLineChart';
import { CumulativeAreaChart } from './widgets/CumulativeAreaChart';
import { useDashboardData } from '@/app/lib/hooks/useDashboardData';

// ==================== TYPE DEFINITIONS ====================

export interface FilterState {
  timeFilter: 'week' | 'month' | 'quarter' | 'all';
  competencyFilter: 'all' | 'customerAnalysis' | 'valueCommunication' | 'salesExecution';
  activityFilter: 'all' | 'ICP_ANALYSIS' | 'COST_MODEL' | 'BUSINESS_CASE' | 'REAL_ACTION';
  impactFilter: 'all' | 'low' | 'medium' | 'high' | 'critical';
}

export interface CompetencyArea {
  name: string;
  current: number;
  required: number;
  color: string;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  competencyCategory: string;
  pointsEarned: number;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface WeeklyData {
  currentWeek: {
    totalPoints: number;
    activitiesCompleted: number;
    competencyGrowth: number;
    toolsUnlocked: number;
    averageImpact: number;
    focusHours: number;
    streak: number;
  };
  previousWeek: {
    totalPoints: number;
    activitiesCompleted: number;
    competencyGrowth: number;
  };
  goals: {
    weeklyPointTarget: number;
    competencyTarget: number;
    consistencyTarget: number;
  };
}

export interface UnifiedDashboardProps {
  userId: string;
  className?: string;
}

// ==================== MAIN COMPONENT ====================

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({
  userId,
  className = ''
}) => {
  // Filter State Management
  const [filters, setFilters] = useState<FilterState>({
    timeFilter: 'week',
    competencyFilter: 'all',
    activityFilter: 'all',
    impactFilter: 'all'
  });

  // Fetch dashboard data from Supabase using custom hook
  const dashboardData = useDashboardData();
  const competencyAreas = (dashboardData as any).competencyAreas || [];
  const activities = (dashboardData as any).activities || [];
  const weeklyData = (dashboardData as any).weeklyData || [];
  const loading = dashboardData.loading;
  const error = dashboardData.error;

  // ==================== FILTER LOGIC ====================

  const handleFilterChange = (filterKey: keyof FilterState, value: FilterState[keyof FilterState]) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      timeFilter: 'week',
      competencyFilter: 'all',
      activityFilter: 'all',
      impactFilter: 'all'
    });
  };

  const getFilteredActivities = (): Activity[] => {
    let filtered = [...activities];

    // Apply filters (simplified for now)
    if (filters.competencyFilter !== 'all') {
      // Filter logic will be implemented when we migrate InteractiveFilters
    }
    if (filters.activityFilter !== 'all') {
      filtered = filtered.filter(a => a.type === filters.activityFilter);
    }
    if (filters.impactFilter !== 'all') {
      filtered = filtered.filter(a => a.impactLevel === filters.impactFilter);
    }

    return filtered;
  };

  // ==================== EVENT HANDLERS ====================

  const handleActionClick = (actionId: string) => {
    console.log('Quick action clicked:', actionId);
    // TODO: Implement navigation to tools
  };

  const handleViewAllActivities = () => {
    console.log('View all activities clicked');
    // TODO: Implement full activity history view
  };

  // ==================== LOADING STATE ====================

  if (loading) {
    return (
      <div className={`min-h-screen bg-[#0a0a0a] flex items-center justify-center ${className}`}>
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  // ==================== ERROR STATE ====================

  if (error) {
    return (
      <div className={`min-h-screen bg-[#0a0a0a] flex items-center justify-center ${className}`}>
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <h3 className="text-lg font-semibold text-red-400">Error Loading Dashboard</h3>
          </div>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ==================== MAIN DASHBOARD LAYOUT ====================

  return (
    <motion.div
      className={`min-h-screen bg-[#0a0a0a] ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dashboard Header */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
              <p className="text-sm text-gray-400">Track your professional development and activities</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* TODO: Add filter summary badge */}
              <div className="text-sm text-gray-500">
                {getFilteredActivities().length} of {activities.length} activities
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Interactive Filters Section */}
        <div className="mb-6">
          {/* TODO: InteractiveFilters component will go here */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-400">Filters</h3>
              <button
                onClick={clearAllFilters}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Clear All
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Interactive filters will be integrated here (InteractiveFilters.tsx)
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* First Row: Weekly Summary (2 cols) + Competency Overview (1 col) */}
          <div className="lg:col-span-2">
            {/* TODO: WeeklySummary component will go here */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 h-full">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Weekly Summary</h3>
              </div>
              <p className="text-sm text-gray-500">
                WeeklySummary widget will be integrated here
              </p>
              {weeklyData && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {weeklyData.currentWeek.totalPoints}
                    </div>
                    <div className="text-xs text-gray-400">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {weeklyData.currentWeek.activitiesCompleted}
                    </div>
                    <div className="text-xs text-gray-400">Activities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {weeklyData.currentWeek.streak}
                    </div>
                    <div className="text-xs text-gray-400">Day Streak</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* TODO: CircularCompetencyGauge components will go here */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 h-full">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Competencies</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Circular competency gauges will be integrated here
              </p>
              <div className="space-y-3">
                {competencyAreas.map((area: any, index: number) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">{area.name}</span>
                      <span className="text-xs text-gray-300">{area.current}/100</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${area.current}%`,
                          backgroundColor: area.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second Row: Quick Actions (1 col) + Recent Activity (2 cols) */}
          <div className="lg:col-span-1">
            {/* TODO: QuickActions with QuickActionButton components */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <p className="text-sm text-gray-500">
                QuickActionButton components will be integrated here
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            {/* TODO: RecentActivity with ActivityItem components */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Activity stream with ActivityItem components will be integrated here
              </p>
              <div className="space-y-2">
                {getFilteredActivities().slice(0, 4).map((activity) => (
                  <div key={activity.id} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-white">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {activity.competencyCategory} • {activity.timestamp}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-green-400 ml-4">
                        +{activity.pointsEarned}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Third Row: Active Tool Display + Recent Milestones */}
          <div className="lg:col-span-1">
            {/* TODO: ActiveToolDisplay component */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Active Tool</h3>
              <p className="text-xs text-gray-500">
                ActiveToolDisplay widget will be integrated here
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            {/* TODO: RecentMilestones component */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Recent Milestones</h3>
              <p className="text-xs text-gray-500">
                RecentMilestones widget will be integrated here
              </p>
            </div>
          </div>
        </div>

        {/* Fourth Row: Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Progress Line Chart */}
          <div className="lg:col-span-1">
            <ProgressLineChart
              data={[
                { date: '2025-10-04', timestamp: '2025-10-04T00:00:00Z', totalPoints: 120, customerAnalysis: 85, valueCommunication: 75, salesExecution: 60 },
                { date: '2025-10-05', timestamp: '2025-10-05T00:00:00Z', totalPoints: 135, customerAnalysis: 92, valueCommunication: 80, salesExecution: 65 },
                { date: '2025-10-06', timestamp: '2025-10-06T00:00:00Z', totalPoints: 145, customerAnalysis: 98, valueCommunication: 85, salesExecution: 68 },
                { date: '2025-10-07', timestamp: '2025-10-07T00:00:00Z', totalPoints: 160, customerAnalysis: 105, valueCommunication: 92, salesExecution: 75 },
                { date: '2025-10-08', timestamp: '2025-10-08T00:00:00Z', totalPoints: 165, customerAnalysis: 110, valueCommunication: 95, salesExecution: 78 },
                { date: '2025-10-09', timestamp: '2025-10-09T00:00:00Z', totalPoints: 175, customerAnalysis: 118, valueCommunication: 100, salesExecution: 82 },
                { date: '2025-10-10', timestamp: '2025-10-10T00:00:00Z', totalPoints: 180, customerAnalysis: 125, valueCommunication: 105, salesExecution: 88 },
              ]}
              series={[
                { key: 'customerAnalysis', label: 'Customer Analysis', color: '#10b981', enabled: true },
                { key: 'valueCommunication', label: 'Value Communication', color: '#8b5cf6', enabled: true },
                { key: 'salesExecution', label: 'Sales Execution', color: '#f59e0b', enabled: true },
              ]}
              title="Daily Competency Scores"
              height={350}
            />
          </div>

          {/* Cumulative Area Chart */}
          <div className="lg:col-span-1">
            <CumulativeAreaChart
              data={[
                { date: '2025-10-04', timestamp: '2025-10-04T00:00:00Z', cumulativePoints: 120, cumulativeActivities: 15, cumulativeGrowth: 85 },
                { date: '2025-10-05', timestamp: '2025-10-05T00:00:00Z', cumulativePoints: 255, cumulativeActivities: 30, cumulativeGrowth: 177 },
                { date: '2025-10-06', timestamp: '2025-10-06T00:00:00Z', cumulativePoints: 400, cumulativeActivities: 45, cumulativeGrowth: 270 },
                { date: '2025-10-07', timestamp: '2025-10-07T00:00:00Z', cumulativePoints: 560, cumulativeActivities: 62, cumulativeGrowth: 368 },
                { date: '2025-10-08', timestamp: '2025-10-08T00:00:00Z', cumulativePoints: 725, cumulativeActivities: 78, cumulativeGrowth: 470 },
                { date: '2025-10-09', timestamp: '2025-10-09T00:00:00Z', cumulativePoints: 900, cumulativeActivities: 95, cumulativeGrowth: 578 },
                { date: '2025-10-10', timestamp: '2025-10-10T00:00:00Z', cumulativePoints: 1080, cumulativeActivities: 113, cumulativeGrowth: 688 },
              ]}
              series={[
                { key: 'cumulativePoints', label: 'Total Points', color: '#3b82f6', strokeColor: '#2563eb', enabled: true },
                { key: 'cumulativeGrowth', label: 'Competency Growth', color: '#10b981', strokeColor: '#059669', enabled: true },
                { key: 'cumulativeActivities', label: 'Activities', color: '#8b5cf6', strokeColor: '#7c3aed', enabled: true },
              ]}
              stackMode="stacked"
              title="Cumulative Progress"
              height={350}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UnifiedDashboard;
