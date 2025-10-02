

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
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface DashboardLayoutProps {
  children: React.ReactNode
  userId: string
  currentPage?: string
  className?: string
}

export function DashboardLayout({ 
  children, 
  userId, 
  currentPage = 'dashboard',
  className = '' 
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'competency' | 'progress' | 'help' | 'notifications'>('competency')
  const [sidebarWidth, setSidebarWidth] = useState(320) // Default 20% of 1600px

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
        setSidebarWidth(280)
      } else if (screenWidth < 1280) {
        setSidebarWidth(300)
      } else {
        setSidebarWidth(320)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculate layout dimensions
  const mainContentWidth = sidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%'
  const sidebarStyle = {
    width: `${sidebarWidth}px`,
    transform: sidebarOpen ? 'translateX(0)' : `translateX(${sidebarWidth}px)`
  }

  return (
    <div className={`flex h-screen bg-gray-50 ${className}`}>
      
      <div 
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{ width: mainContentWidth }}
      >
        <div className="h-full flex flex-col">
          
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </button>
              
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Professional Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
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

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>

      <div
        className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-lg transition-transform duration-300 ease-in-out z-40 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={sidebarStyle}
      >
        <div className="h-full flex flex-col">
          
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
                Competency
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'progress'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Progress
              </button>
              <button
                onClick={() => setActiveTab('help')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'help'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Help
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
                  Notifications
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

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
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export function useDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'competency' | 'progress' | 'help' | 'notifications'>('competency')

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

export const LAYOUT_BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1536
} as const

export const LAYOUT_CONFIG = {
  sidebarWidth: {
    mobile: 280,
    tablet: 300,
    desktop: 320,
    wide: 360
  },
  mainContentPadding: {
    mobile: 16,
    tablet: 20,
    desktop: 24
  }
} as const
