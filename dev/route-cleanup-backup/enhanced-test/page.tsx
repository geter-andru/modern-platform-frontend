'use client'

import React, { useState } from 'react'
import { EnhancedDashboardLayout } from '@/src/features/dashboard/components/EnhancedDashboardLayout'
import { CompetencyGauges } from '@/src/features/dashboard/components/CompetencyGauges'
import { ProgressTracking } from '@/src/features/dashboard/components/ProgressTracking'
import { ContextualHelp } from '@/src/features/dashboard/components/ContextualHelp'
import { NotificationsPanel } from '@/src/features/dashboard/components/NotificationsPanel'
import { ToolUnlockStatus } from '@/src/features/dashboard/components/ToolUnlockStatus'
import { useEnhancedCompetencyDashboard } from '@/src/features/dashboard/hooks/useEnhancedCompetencyDashboard'
import { 
  ChartBarIcon,
  TrophyIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  DocumentTextIcon,
  CogIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const TEST_USER_ID = 'test-user-123'

// Enhanced mock data for 6-level competency system
const mockCompetencyData = {
  customerAnalysis: 75,
  valueCommunication: 65,
  salesExecution: 70,
  overallScore: 70,
  currentLevel: {
    id: 'intermediate' as const,
    name: 'Intermediate',
    points: 300,
    nextLevel: 'advanced',
    previousLevel: 'developing',
    color: 'blue'
  },
  totalPoints: 450,
  levelProgress: 50,
  baselineScores: {
    customerAnalysis: 45,
    valueCommunication: 35,
    salesExecution: 40
  },
  levelHistory: [
    { level: 'foundation', achievedAt: '2024-01-01', points: 0 },
    { level: 'developing', achievedAt: '2024-02-15', points: 200 },
    { level: 'intermediate', achievedAt: '2024-03-20', points: 400 }
  ],
  lastUpdated: new Date().toISOString(),
  toolUnlockStates: {
    icpUnlocked: true,
    costCalculatorUnlocked: true,
    businessCaseUnlocked: false,
    resourcesUnlocked: true,
    exportUnlocked: true
  }
}

const mockAnalytics = {
  overallScore: 70,
  categoryScores: {
    customerAnalysis: 75,
    valueCommunication: 65,
    salesExecution: 70
  },
  progressTrend: {
    period: 'current',
    score: 70,
    change: 5,
    velocity: { weekly: 0, monthly: 0, quarterly: 0, period: 'month', pointsGained: 0 },
    date: new Date().toISOString(),
    customerAnalysis: 75,
    valueCommunication: 65,
    salesExecution: 70,
    overallScore: 70,
    points: 450
  },
  recommendations: [],
  industryBenchmark: {
    industry: 'Technology Sales',
    averageScore: 55,
    topQuartile: 85,
    position: 65,
    metric: 'Overall Competency Score',
    userValue: 70
  },
  progressVelocity: { velocity: 0 },
  lastUpdated: new Date().toISOString(),
  analyticsPeriod: 'month',
  progressTrends: {
    daily: [
      { date: '2024-03-20', points: 25, actions: 2 },
      { date: '2024-03-21', points: 30, actions: 3 },
      { date: '2024-03-22', points: 20, actions: 1 },
      { date: '2024-03-23', points: 35, actions: 4 },
      { date: '2024-03-24', points: 40, actions: 3 }
    ],
    weekly: [
      { week: '2024-W12', points: 150, actions: 10 },
      { week: '2024-W13', points: 180, actions: 12 },
      { week: '2024-W14', points: 200, actions: 15 }
    ],
    monthly: [
      { month: '2024-01', points: 600, actions: 45 },
      { month: '2024-02', points: 750, actions: 55 },
      { month: '2024-03', points: 900, actions: 65 }
    ]
  },
  competencyGrowth: {
    customerAnalysis: { baseline: 45, current: 75, growth: 30, growthPercentage: 67 },
    valueCommunication: { baseline: 35, current: 65, growth: 30, growthPercentage: 86 },
    salesExecution: { baseline: 40, current: 70, growth: 30, growthPercentage: 75 }
  },
  performanceMetrics: {
    totalActions: 165,
    totalPoints: 2250,
    averageActionsPerDay: 2.1,
    averagePointsPerDay: 28.5,
    averagePointsPerAction: 13.6,
    consistencyPercentage: 85,
    activeDays: 78,
    totalDays: 92
  },
  skillGaps: [
    {
      skill: 'valueCommunication',
      currentScore: 65,
      targetScore: 70,
      gap: 5,
      priority: 'low'
    }
  ],
  developmentRecommendations: [
    {
      type: 'skill_development',
      priority: 'low',
      title: 'Improve value communication',
      description: 'Focus on developing value communication skills to reach intermediate level',
      targetScore: 70,
      currentScore: 65,
      actions: ['Practice ROI presentations', 'Create value proposition templates']
    }
  ]
}

const mockProgressSummary = {
  pointsGained: 50,
  levelAdvancements: 1,
  toolsUnlocked: 2,
  competencyImprovements: [
    { skill: 'customerAnalysis', improvement: 5, previousScore: 70 },
    { skill: 'valueCommunication', improvement: 3, previousScore: 62 },
    { skill: 'salesExecution', improvement: 2, previousScore: 68 }
  ],
  recentActivity: [
    {
      id: '1',
      type: 'competency_gain',
      title: 'Customer Analysis Improved',
      description: 'Gained 5 points in Customer Analysis',
      timestamp: new Date().toISOString(),
      points: 5
    },
    {
      id: '2',
      type: 'tool_unlock',
      title: 'Export Features Unlocked',
      description: 'Unlocked export functionality',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      points: 0
    }
  ]
}

const mockNotifications = [
  {
    id: '1',
    type: 'achievement',
    title: 'Level Advancement!',
    message: 'You\'ve reached Intermediate level!',
    timestamp: new Date().toISOString(),
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'milestone',
    title: 'New Milestone Available',
    message: 'Advanced Level milestone is now available',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    priority: 'medium'
  },
  {
    id: '3',
    type: 'tip',
    title: 'Pro Tip',
    message: 'Complete more customer meetings to boost your Customer Analysis score',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
    priority: 'low'
  }
]

function TestStatus({ label, status, details }: { label: string, status: 'success' | 'error' | 'warning', details?: string }) {
  const statusConfig = {
    success: { icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-50' },
    error: { icon: XCircleIcon, color: 'text-red-600', bg: 'bg-red-50' },
    warning: { icon: XCircleIcon, color: 'text-yellow-600', bg: 'bg-yellow-50' }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg ${config.bg}`}>
      <Icon className={`h-5 w-5 ${config.color}`} />
      <div>
        <div className={`font-medium ${config.color}`}>{label}</div>
        {details && <div className="text-sm text-gray-600">{details}</div>}
      </div>
    </div>
  )
}

function ComponentTest({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  )
}

export default function EnhancedDashboardTestPage() {
  const [activeTest, setActiveTest] = useState<'full' | 'components' | 'api'>('full')
  const [apiTestResults, setApiTestResults] = useState<any>(null)
  const [testingApi, setTestingApi] = useState(false)
  
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
  const testNotifications = notifications.length > 0 ? notifications as any : mockNotifications

  // Test API endpoints
  const testApiEndpoints = async () => {
    setTestingApi(true)
    const results: any = {
      competencyLevels: { status: 'pending', data: null, error: null },
      competencyActions: { status: 'pending', data: null, error: null },
      competencyMilestones: { status: 'pending', data: null, error: null },
      competencyAnalytics: { status: 'pending', data: null, error: null }
    }

    try {
      // Test competency levels endpoint
      const levelsResponse = await fetch('/api/competency/levels')
      if (levelsResponse.ok) {
        results.competencyLevels = { status: 'success', data: await levelsResponse.json() }
      } else {
        results.competencyLevels = { status: 'error', error: `HTTP ${levelsResponse.status}` }
      }
    } catch (error) {
      results.competencyLevels = { status: 'error', error: (error as any).message }
    }

    try {
      // Test competency actions endpoint
      const actionsResponse = await fetch('/api/competency/actions')
      if (actionsResponse.ok) {
        results.competencyActions = { status: 'success', data: await actionsResponse.json() }
      } else {
        results.competencyActions = { status: 'error', error: `HTTP ${actionsResponse.status}` }
      }
    } catch (error) {
      results.competencyActions = { status: 'error', error: (error as any).message }
    }

    try {
      // Test competency milestones endpoint
      const milestonesResponse = await fetch('/api/competency/milestones')
      if (milestonesResponse.ok) {
        results.competencyMilestones = { status: 'success', data: await milestonesResponse.json() }
      } else {
        results.competencyMilestones = { status: 'error', error: `HTTP ${milestonesResponse.status}` }
      }
    } catch (error) {
      results.competencyMilestones = { status: 'error', error: (error as any).message }
    }

    try {
      // Test competency analytics endpoint
      const analyticsResponse = await fetch('/api/competency/analytics')
      if (analyticsResponse.ok) {
        results.competencyAnalytics = { status: 'success', data: await analyticsResponse.json() }
      } else {
        results.competencyAnalytics = { status: 'error', error: `HTTP ${analyticsResponse.status}` }
      }
    } catch (error) {
      results.competencyAnalytics = { status: 'error', error: (error as any).message }
    }

    setApiTestResults(results)
    setTestingApi(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Enhanced Dashboard Test Environment</h1>
            <p className="text-gray-600 mt-2">Test the enhanced 80/20 layout with 6-level competency system</p>
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
                Enhanced Layout Test
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
              <button
                onClick={() => setActiveTest('api')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTest === 'api'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                API Endpoints Test
              </button>
            </div>
          </div>

          {/* Test Status Overview */}
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Status Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <TestStatus 
                label="Real-time Connection" 
                status={isConnected ? 'success' : 'error'}
                details={isConnected ? 'Connected to Supabase' : 'Offline mode'}
              />
              <TestStatus 
                label="Competency Data" 
                status={competencyData ? 'success' : 'warning'}
                details={competencyData ? 'Real data loaded' : 'Using mock data'}
              />
              <TestStatus 
                label="Analytics Data" 
                status={analytics ? 'success' : 'warning'}
                details={analytics ? 'Real analytics loaded' : 'Using mock analytics'}
              />
              <TestStatus 
                label="Notifications" 
                status={notifications.length > 0 ? 'success' : 'warning'}
                details={notifications.length > 0 ? `${notifications.length} real notifications` : 'Using mock notifications'}
              />
            </div>
          </div>

          {activeTest === 'full' ? (
            <EnhancedDashboardLayout userId={TEST_USER_ID} currentPage="dashboard">
              <div className="p-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Enhanced Dashboard Test</h2>
                  <p className="text-gray-600 mb-4">
                    This is the enhanced dashboard with the 80/20 layout and right sidebar featuring the 6-level competency system.
                    Check the right sidebar for all the enhanced components:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li><strong>Competency Levels</strong> - 6-level progression system (Foundation → Master)</li>
                    <li><strong>Progress Tracking</strong> - Real-time progress monitoring with analytics</li>
                    <li><strong>Milestones Panel</strong> - Professional achievement tracking</li>
                    <li><strong>Contextual Help</strong> - Page-specific guidance and tips</li>
                    <li><strong>Notifications</strong> - Real-time alerts and updates</li>
                  </ul>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Current Test Data:</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Current Level:</span> {typeof testCompetencyData.currentLevel === 'string' ? testCompetencyData.currentLevel : testCompetencyData.currentLevel.name}
                      </div>
                      <div>
                        <span className="font-medium">Total Points:</span> {testCompetencyData.totalPoints}
                      </div>
                      <div>
                        <span className="font-medium">Overall Score:</span> {testCompetencyData.overallScore}%
                      </div>
                      <div>
                        <span className="font-medium">Level Progress:</span> {testCompetencyData.levelProgress}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </EnhancedDashboardLayout>
          ) : activeTest === 'components' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ComponentTest title="Competency Gauges (6-Level System)">
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
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">API Endpoints Test</h2>
                <p className="text-gray-600 mb-4">
                  Test all the new Phase 2.4 API endpoints for competency management.
                </p>
                
                <button
                  onClick={testApiEndpoints}
                  disabled={testingApi}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testingApi ? 'Testing...' : 'Test All API Endpoints'}
                </button>
              </div>

              {apiTestResults && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">API Test Results</h3>
                  <div className="space-y-4">
                    {Object.entries(apiTestResults).map(([endpoint, result]: [string, any]) => (
                      <div key={endpoint} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {endpoint.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h4>
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            result.status === 'success' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.status}
                          </span>
                        </div>
                        
                        {result.error && (
                          <div className="text-red-600 text-sm mb-2">
                            Error: {result.error}
                          </div>
                        )}
                        
                        {result.data && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                              View Response Data
                            </summary>
                            <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

