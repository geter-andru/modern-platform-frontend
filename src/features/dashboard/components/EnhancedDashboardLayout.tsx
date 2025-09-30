'use client'

import React, { useState, useEffect } from 'react'
import { useEnhancedCompetencyDashboard } from '../hooks/useEnhancedCompetencyDashboard'
import { CompetencyGauges } from './CompetencyGauges'
import { ProgressTracking } from './ProgressTracking'
import { ContextualHelp } from './ContextualHelp'
import { NotificationsPanel } from './NotificationsPanel'
import { ToolUnlockStatus } from './ToolUnlockStatus'
import { 
  Bars3Icon, 
  XMarkIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  TrophyIcon,
  StarIcon,
  CogIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface EnhancedDashboardLayoutProps {
  children: React.ReactNode
  userId: string
  currentPage?: string
  className?: string
  rightSidebarContent?: React.ReactNode
  sidebarCollapsed?: boolean
  onSidebarToggle?: (collapsed: boolean) => void
}

export function EnhancedDashboardLayout({ 
  children, 
  userId, 
  currentPage = 'dashboard',
  className = '',
  rightSidebarContent,
  sidebarCollapsed = false,
  onSidebarToggle
}: EnhancedDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(!sidebarCollapsed)
  const [activeTab, setActiveTab] = useState<'competency' | 'progress' | 'help' | 'notifications' | 'milestones'>('competency')
  const [sidebarWidth, setSidebarWidth] = useState(360) // Enhanced width for 6-level system

  // Get competency data and real-time updates
  const {
    competencyData,
    analytics,
    isConnected,
    notifications,
    dismissNotification,
    progressSummary
  } = useEnhancedCompetencyDashboard(userId)

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      if (screenWidth < 1024) {
        setSidebarOpen(false)
        setSidebarWidth(320)
      } else if (screenWidth < 1280) {
        setSidebarWidth(340)
      } else if (screenWidth < 1536) {
        setSidebarWidth(360)
      } else {
        setSidebarWidth(400) // Wider for large screens
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    const newState = !sidebarOpen
    setSidebarOpen(newState)
    onSidebarToggle?.(newState)
  }

  // Calculate layout dimensions for 80/20 split
  const mainContentWidth = sidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%'
  const sidebarStyle = {
    width: `${sidebarWidth}px`,
    transform: sidebarOpen ? 'translateX(0)' : `translateX(${sidebarWidth}px)`
  }

  // Get competency level info
  const getLevelInfo = (level: string) => {
    const levels = {
      foundation: { name: 'Foundation', color: 'text-gray-600', bg: 'bg-gray-100' },
      developing: { name: 'Developing', color: 'text-blue-600', bg: 'bg-blue-100' },
      intermediate: { name: 'Intermediate', color: 'text-green-600', bg: 'bg-green-100' },
      advanced: { name: 'Advanced', color: 'text-purple-600', bg: 'bg-purple-100' },
      expert: { name: 'Expert', color: 'text-orange-600', bg: 'bg-orange-100' },
      master: { name: 'Master', color: 'text-red-600', bg: 'bg-red-100' }
    }
    return levels[level as keyof typeof levels] || levels.foundation
  }

  const levelInfo = competencyData ? getLevelInfo(competencyData.currentLevel.id) : getLevelInfo('foundation')

  return (
    <div className={`flex h-screen bg-gray-50 ${className}`}>
      
      {/* Main Content Area (80%) */}
      <div 
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{ width: mainContentWidth }}
      >
        <div className="h-full flex flex-col">
          
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSidebarToggle}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </button>
              
              <div className="flex items-center space-x-3">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Professional Dashboard
                </h1>
                {competencyData && (
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${levelInfo.bg} ${levelInfo.color}`}>
                    {levelInfo.name}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Real-time Status */}
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

              {/* Notifications */}
              {notifications.length > 0 && (
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <BellIcon className="h-5 w-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Right Sidebar (20%) */}
      <div
        className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-lg transition-transform duration-300 ease-in-out z-40 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={sidebarStyle}
      >
        <div className="h-full flex flex-col">
          
          {/* Sidebar Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Competency Center
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('competency')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'competency'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  <ChartBarIcon className="h-4 w-4" />
                  <span>Levels</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'progress'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  <TrophyIcon className="h-4 w-4" />
                  <span>Progress</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('milestones')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'milestones'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  <StarIcon className="h-4 w-4" />
                  <span>Goals</span>
                </div>
              </button>
            </div>
            
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mt-2">
              <button
                onClick={() => setActiveTab('help')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'help'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                  <span>Help</span>
                </div>
              </button>
              {notifications.length > 0 && (
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors relative ${
                    activeTab === 'notifications'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <BellIcon className="h-4 w-4" />
                    <span>Alerts</span>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'competency' && (
              <div className="p-6 space-y-6">
                <CompetencyGauges 
                  competencyData={competencyData}
                  analytics={analytics}
                />
                <ToolUnlockStatus 
                  competencyData={competencyData}
                />
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="p-6">
                <ProgressTracking 
                  progressSummary={progressSummary}
                  analytics={analytics}
                />
              </div>
            )}

            {activeTab === 'milestones' && (
              <div className="p-6">
                <MilestonesPanel 
                  competencyData={competencyData}
                  analytics={analytics}
                />
              </div>
            )}

            {activeTab === 'help' && (
              <div className="p-6">
                <ContextualHelp 
                  currentPage={currentPage}
                  competencyData={competencyData}
                />
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-6">
                <NotificationsPanel 
                  notifications={notifications}
                  onDismiss={dismissNotification}
                />
              </div>
            )}

            {/* Custom sidebar content */}
            {rightSidebarContent && (
              <div className="p-6">
                {rightSidebarContent}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

// Milestones Panel Component
function MilestonesPanel({ competencyData, analytics }: { competencyData: any, analytics: any }) {
  const milestones = [
    {
      id: 'foundation_level',
      title: 'Foundation Level',
      description: 'Complete your first assessment',
      achieved: competencyData?.currentLevel === 'foundation' || competencyData?.currentLevel !== 'foundation',
      points: 100
    },
    {
      id: 'developing_level',
      title: 'Developing Level',
      description: 'Reach 200+ competency points',
      achieved: competencyData?.currentLevel === 'developing' || competencyData?.currentLevel === 'intermediate' || competencyData?.currentLevel === 'advanced' || competencyData?.currentLevel === 'expert' || competencyData?.currentLevel === 'master',
      points: 200
    },
    {
      id: 'intermediate_level',
      title: 'Intermediate Level',
      description: 'Reach 400+ competency points',
      achieved: competencyData?.currentLevel === 'intermediate' || competencyData?.currentLevel === 'advanced' || competencyData?.currentLevel === 'expert' || competencyData?.currentLevel === 'master',
      points: 400
    },
    {
      id: 'advanced_level',
      title: 'Advanced Level',
      description: 'Reach 600+ competency points',
      achieved: competencyData?.currentLevel === 'advanced' || competencyData?.currentLevel === 'expert' || competencyData?.currentLevel === 'master',
      points: 600
    },
    {
      id: 'expert_level',
      title: 'Expert Level',
      description: 'Reach 800+ competency points',
      achieved: competencyData?.currentLevel === 'expert' || competencyData?.currentLevel === 'master',
      points: 800
    },
    {
      id: 'master_level',
      title: 'Master Level',
      description: 'Reach 1000+ competency points',
      achieved: competencyData?.currentLevel === 'master',
      points: 1000
    }
  ]

  const achievedMilestones = milestones.filter(m => m.achieved)
  const nextMilestone = milestones.find(m => !m.achieved)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Achievement Progress</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Milestones Achieved</span>
            <span className="text-sm font-semibold text-gray-900">
              {achievedMilestones.length}/{milestones.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(achievedMilestones.length / milestones.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {nextMilestone && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Next Goal</h4>
          <p className="text-sm text-blue-800 mb-2">{nextMilestone.title}</p>
          <p className="text-xs text-blue-600">{nextMilestone.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-blue-600">Points needed:</span>
            <span className="text-xs font-semibold text-blue-800">
              {nextMilestone.points - (competencyData?.totalPoints || 0)}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900">All Milestones</h4>
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`flex items-center space-x-3 p-3 rounded-lg border ${
              milestone.achieved 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              milestone.achieved ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              {milestone.achieved ? (
                <StarIcon className="h-4 w-4 text-white" />
              ) : (
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                milestone.achieved ? 'text-green-900' : 'text-gray-900'
              }`}>
                {milestone.title}
              </p>
              <p className={`text-xs ${
                milestone.achieved ? 'text-green-600' : 'text-gray-500'
              }`}>
                {milestone.description}
              </p>
            </div>
            <span className={`text-xs font-semibold ${
              milestone.achieved ? 'text-green-600' : 'text-gray-400'
            }`}>
              {milestone.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function useEnhancedDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'competency' | 'progress' | 'help' | 'notifications' | 'milestones'>('competency')

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const openSidebar = () => setSidebarOpen(true)
  const closeSidebar = () => setSidebarOpen(false)

  return {
    sidebarOpen,
    activeTab,
    setActiveTab,
    toggleSidebar,
    openSidebar,
    closeSidebar
  }
}

export const ENHANCED_LAYOUT_BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1536,
  ultra: 1920
} as const

export const ENHANCED_LAYOUT_CONFIG = {
  sidebarWidth: {
    mobile: 320,
    tablet: 340,
    desktop: 360,
    wide: 400,
    ultra: 450
  },
  mainContentPadding: {
    mobile: 16,
    tablet: 20,
    desktop: 24,
    wide: 28
  },
  competencyLevels: {
    foundation: { minPoints: 0, maxPoints: 199, color: 'gray' },
    developing: { minPoints: 200, maxPoints: 399, color: 'blue' },
    intermediate: { minPoints: 400, maxPoints: 599, color: 'green' },
    advanced: { minPoints: 600, maxPoints: 799, color: 'purple' },
    expert: { minPoints: 800, maxPoints: 999, color: 'orange' },
    master: { minPoints: 1000, maxPoints: Infinity, color: 'red' }
  }
} as const

