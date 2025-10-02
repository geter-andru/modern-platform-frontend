

'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/src/features/dashboard/components/DashboardLayout'
import { CompetencyGauges } from '@/src/features/dashboard/components/CompetencyGauges'
import { ProgressTracking } from '@/src/features/dashboard/components/ProgressTracking'
import { ContextualHelp } from '@/src/features/dashboard/components/ContextualHelp'
import { NotificationsPanel } from '@/src/features/dashboard/components/NotificationsPanel'
import { ToolUnlockStatus } from '@/src/features/dashboard/components/ToolUnlockStatus'
import { useEnhancedCompetencyDashboard } from '@/src/features/dashboard/hooks/useEnhancedCompetencyDashboard'

const TEST_USER_ID = 'test-user-123'

// Mock competency data for testing
const mockCompetencyData = {
  customerAnalysis: 65,
  valueCommunication: 45,
  salesExecution: 55,
  overallScore: 55,
  currentLevel: {
    id: 'foundation' as const,
    name: 'Foundation',
    points: 0,
    nextLevel: 'developing',
    previousLevel: null,
    color: 'gray'
  },
  totalPoints: 250,
  levelProgress: 25,
  baselineScores: {
    customerAnalysis: 45,
    valueCommunication: 35,
    salesExecution: 40
  },
  levelHistory: [],
  lastUpdated: new Date().toISOString(),
  toolUnlockStates: {
    icpUnlocked: true,
    costCalculatorUnlocked: false,
    businessCaseUnlocked: false,
    resourcesUnlocked: true,
    exportUnlocked: false
  }
}

const mockAnalytics = {
  overallScore: 55,
  categoryScores: {
    customerAnalysis: 65,
    valueCommunication: 45,
    salesExecution: 55
  },
  progressTrend: {
    period: 'current',
    score: 55,
    change: 5,
    velocity: { weekly: 0, monthly: 0, quarterly: 0, period: 'month', pointsGained: 0 },
    date: new Date().toISOString(),
    customerAnalysis: 65,
    valueCommunication: 45,
    salesExecution: 55,
    overallScore: 55,
    points: 250
  },
  recommendations: [],
  industryBenchmark: {
    industry: 'Technology Sales',
    averageScore: 55,
    topQuartile: 85,
    position: 65,
    metric: 'Overall Competency Score',
    userValue: 55
  },
  progressVelocity: { velocity: 0 },
  lastUpdated: new Date().toISOString(),
  analyticsPeriod: 'month',
  progressTrends: [
    {
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      customerAnalysis: 60,
      valueCommunication: 40,
      salesExecution: 50,
      overallScore: 50,
      points: 200
    },
    {
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      customerAnalysis: 62,
      valueCommunication: 42,
      salesExecution: 52,
      overallScore: 52,
      points: 220
    },
    {
      date: new Date().toISOString(),
      customerAnalysis: 65,
      valueCommunication: 45,
      salesExecution: 55,
      overallScore: 55,
      points: 250
    }
  ],
  competencyGrowth: [
    {
      category: 'customerAnalysis' as const,
      currentScore: 65,
      baselineScore: 45,
      growth: 20,
      growthPercentage: 44.4,
      trend: 'increasing' as const
    },
    {
      category: 'valueCommunication' as const,
      currentScore: 45,
      baselineScore: 35,
      growth: 10,
      growthPercentage: 28.6,
      trend: 'increasing' as const
    },
    {
      category: 'salesExecution' as const,
      currentScore: 55,
      baselineScore: 40,
      growth: 15,
      growthPercentage: 37.5,
      trend: 'increasing' as const
    }
  ],
  milestoneAchievements: [],
  performanceMetrics: [
    {
      metric: 'Overall Competency Score',
      value: 55,
      unit: 'points',
      trend: 'up' as const,
      change: 5,
      period: 'month'
    }
  ],
  skillGaps: [
    {
      skill: 'Value Communication',
      currentLevel: 45,
      targetLevel: 70,
      gap: 25,
      priority: 'high' as const,
      recommendations: ['Focus on ROI communication', 'Practice value proposition development']
    }
  ],
  developmentRecommendations: [
    {
      id: 'improve-value-communication',
      title: 'Improve Value Communication Skills',
      description: 'Focus on developing Value Communication competencies to reach target level',
      category: 'competency' as const,
      priority: 'high' as const,
      estimatedTime: '2-4 weeks',
      resources: ['Value Communication Assessment', 'ROI Communication Guide'],
      prerequisites: []
    }
  ],
  peerComparison: {
    userScore: 55,
    peerAverage: 45,
    percentile: 75,
    comparison: 'above' as const,
    insights: ['Your competency score is above the peer average']
  },
  industryBenchmarks: []
}

const mockProgressSummary = {
  pointsGained: 50,
  levelAdvancements: 0,
  toolsUnlocked: 1,
  competencyImprovements: {
    customerAnalysis: 20,
    valueCommunication: 10,
    salesExecution: 15
  }
}

const mockNotifications = [
  {
    id: '1',
    type: 'level_up' as const,
    title: 'Level Up!',
    message: 'Congratulations! You\'ve reached Developing level!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: '2',
    type: 'tool_unlock' as const,
    title: 'New Tool Unlocked!',
    message: 'Resource Library is now available!',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: '3',
    type: 'progress_update' as const,
    title: 'Progress Update',
    message: 'You gained 25 points from completing an ICP analysis',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: true
  }
]

function ComponentTest({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  )
}

export default function DashboardTestPage() {
  const [activeTest, setActiveTest] = useState<'full' | 'components'>('full')
  
  const {
    competencyData,
    analytics,
    loading,
    error,
    isConnected,
    notifications,
    progressSummary
  } = useEnhancedCompetencyDashboard(TEST_USER_ID)

  // Use real data if available, otherwise use mock data
  const testCompetencyData = competencyData || (mockCompetencyData as any)
  const testAnalytics = analytics || (mockAnalytics as any)
  const testProgressSummary = progressSummary || mockProgressSummary
  const testNotifications = notifications.length > 0 ? notifications : mockNotifications

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Test Environment</h1>
            <p className="text-gray-600 mt-2">Test all dashboard components and functionality</p>
          </div>

          <div className="mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTest('full')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTest === 'full'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Full Dashboard Layout
              </button>
              <button
                onClick={() => setActiveTest('components')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTest === 'components'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Individual Components
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Connection Status</h3>
                <p className="text-sm text-gray-600">
                  {loading ? 'Loading...' : error ? `Error: ${error}` : 'Connected to real-time data'}
                </p>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span>{isConnected ? 'Live' : 'Offline'}</span>
              </div>
            </div>
          </div>

          {activeTest === 'full' ? (
            <DashboardLayout userId={TEST_USER_ID} currentPage="dashboard">
              <div className="p-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Full Dashboard Test</h2>
                  <p className="text-gray-600">
                    This is the complete dashboard with the 80/20 layout and right sidebar.
                    Check the right sidebar for all the components: Competency Gauges, Progress Tracking, 
                    Contextual Help, and Notifications.
                  </p>
                </div>
              </div>
            </DashboardLayout>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ComponentTest title="Competency Gauges">
                <CompetencyGauges 
                  competencyData={testCompetencyData}
                  analytics={testAnalytics}
                />
              </ComponentTest>

              <ComponentTest title="Progress Tracking">
                <ProgressTracking 
                  progressSummary={testProgressSummary}
                  analytics={testAnalytics}
                />
              </ComponentTest>

              <ComponentTest title="Tool Unlock Status">
                <ToolUnlockStatus 
                  competencyData={testCompetencyData}
                />
              </ComponentTest>

              <ComponentTest title="Contextual Help">
                <ContextualHelp 
                  currentPage="dashboard"
                  competencyData={testCompetencyData}
                />
              </ComponentTest>

              <ComponentTest title="Notifications Panel">
                <NotificationsPanel 
                  notifications={testNotifications}
                  onDismiss={(id) => console.log('Dismiss notification:', id)}
                />
              </ComponentTest>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
