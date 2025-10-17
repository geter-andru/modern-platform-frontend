'use client'

/**
 * Enhanced Customer Dashboard with Progressive Engagement Integration
 * 
 * Integrates the progressive engagement system with existing functionality.
 * Provides choice between progressive experience and traditional dashboard.
 */

import React, { useState, useEffect } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import EnhancedTabNavigation from './progressive-engagement/EnhancedTabNavigation'
import { useWorkflowProgress } from '../../../app/hooks/useWorkflowProgress'
import useCompetencyDashboard from '../../../app/hooks/useCompetencyDashboard'
import LoadingSpinner from '../../shared/components/ui/LoadingSpinner'
import { Alert } from '../../shared/components/ui/AlertComponents'
import CompetencyDashboard from './competency/CompetencyDashboard'
import CompetencyOverview from './CompetencyOverview'
import ActiveToolDisplay from './ActiveToolDisplay'
import ProfessionalDevelopment from './ProfessionalDevelopment'
import ProgressiveToolAccess from './competency/ProgressiveToolAccess'
// ProgressNotifications and useProgressNotifications are defined locally
import ProgressiveEngagementContainer from '../../shared/components/progressive-engagement/ProgressiveEngagementContainer'

// Local definitions for ProgressNotifications (since they're used in this component)
const useProgressNotifications = () => ({
  notifications: [],
  showProgressRecognition: (title: string, points: number) => console.log('Progress:', title, points),
  showCompetencyAdvancement: (title: string, points: number) => console.log('Competency:', title, points),
  showMilestoneReached: (title: string, type: string, points: number) => console.log('Milestone:', title, type, points),
  showToolAccessEarned: (title: string) => console.log('Tool Access:', title),
  dismissNotification: (id: string) => console.log('Dismiss:', id)
})

const ProgressNotifications: React.FC<{
  notifications: any[]
  onDismiss: (id: string) => void
  position: string
  className: string
}> = ({ notifications, onDismiss, position, className }) => (
  <div className={`fixed ${position} ${className}`}>
    {/* Notification display logic would go here */}
  </div>
)

// TypeScript interfaces
interface ICPCompleteData {
  overallScore: number
  companyName: string
  timeSpent: number
}

interface CostCalculatedData {
  totalAnnualCost: number
  timeSpent: number
}

interface BusinessCaseReadyData {
  selectedTemplate: string
  timeSpent: number
}

interface ExportData {
  format: string
}

interface ProgressData {
  [key: string]: any
}

interface ToolCallbacks {
  onICPComplete: (data: ICPCompleteData) => Promise<any>
  onCostCalculated: (data: CostCalculatedData) => Promise<any>
  onBusinessCaseReady: (data: BusinessCaseReadyData) => Promise<any>
  onExport: (data: ExportData) => Promise<void>
  onUpdateProgress: (data: ProgressData) => Promise<void>
}

interface WorkflowProgress {
  icp_completed?: boolean
  cost_completed?: boolean
  business_case_completed?: boolean
  completion_percentage?: number
}

interface ToolAccess {
  [toolName: string]: {
    access: boolean
  }
}

interface SummaryStats {
  objectivesCompleted: number
  objectivesTotal: number
}

type ExperienceMode = 'progressive' | 'traditional'

// Mock auth service for Next.js compatibility
const authService = {
  getCurrentSession: () => ({
    accessToken: 'mock-token',
    recordId: 'mock-record-id'
  })
}

const CustomerDashboardEnhanced: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const customerId = params?.customerId as string
  
  // Dashboard experience selection
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>('progressive')
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  const {
    workflowData,
    workflowProgress,
    userPreferences,
    usageAnalytics,
    workflowStatus,
    loading: workflowLoading,
    error: workflowError,
    completeTool,
    startTool,
    updateProgress,
    trackExport: trackExportAction,
    initializeWorkflow
  } = useWorkflowProgress(customerId)

  const competencyData = useCompetencyDashboard(customerId);
  
  // Use type assertion to access properties that may not exist yet
  const competencyProgress = (competencyData as any).competencyProgress || null;
  const toolAccess = (competencyData as any).toolAccess || null;
  const milestones = (competencyData as any).milestones || [];
  const dailyObjectives = (competencyData as any).dailyObjectives || [];
  const handleToolCompletion = (competencyData as any).handleToolCompletion || (() => {});
  const handleObjectiveCompletion = (competencyData as any).handleObjectiveCompletion || (() => {});
  const handleToolUnlock = (competencyData as any).handleToolUnlock || (() => {});
  const checkUnlockCriteria = (competencyData as any).checkUnlockCriteria || (() => true);
  const refreshData = (competencyData as any).refreshData || (() => {});
  const summaryStats = (competencyData as any).summaryStats || null;
  
  const gamificationLoading = competencyData.loading;
  const gamificationError = competencyData.error;

  const {
    notifications,
    showProgressRecognition,
    showCompetencyAdvancement,
    showMilestoneReached,
    showToolAccessEarned,
    dismissNotification
  } = useProgressNotifications()

  // Determine experience mode based on user progress
  useEffect(() => {
    const determineExperienceMode = () => {
      // If user has completed any tools, default to traditional
      const hasCompletedAnyTool = workflowProgress && (
        workflowProgress.icp_completed || 
        workflowProgress.cost_completed || 
        workflowProgress.business_case_completed
      )

      // Check URL parameter for forced mode
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        const forcedMode = urlParams.get('experience') as ExperienceMode
        
        if (forcedMode === 'progressive' || forcedMode === 'traditional') {
          setExperienceMode(forcedMode)
        } else if (!hasCompletedAnyTool) {
          // New users get progressive experience
          setExperienceMode('progressive')
        } else {
          // Returning users get traditional dashboard
          setExperienceMode('traditional')
        }
      }
    }

    if (workflowProgress) {
      determineExperienceMode()
    }
  }, [workflowProgress])

  // Handle mobile responsiveness with SSR safety
  useEffect(() => {
    const checkIsMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768)
      }
    }

    const handleResize = () => {
      checkIsMobile()
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        setShowMobileSidebar(false)
      }
    }

    checkIsMobile()

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Get current active tab from route
  const getActiveTab = (): string => {
    if (pathname.includes('cost-calculator')) return 'cost'
    if (pathname.includes('business-case')) return 'business_case'
    if (pathname.includes('results')) return 'results'
    return 'icp'
  }

  // Enhanced tab navigation with access control
  const handleTabChange = async (tabRoute: string): Promise<void> => {
    const session = authService.getCurrentSession()
    const queryString = session?.accessToken ? `?token=${session.accessToken}` : ''
    
    // Check tool access before navigation
    const toolName = tabRoute === 'cost-calculator' ? 'cost_calculator' : 
                    tabRoute === 'business-case' ? 'business_case_builder' : 
                    'icp_analysis'
    
    if (toolAccess[toolName] && !toolAccess[toolName].access) {
      // Show access denied notification
      showProgressRecognition(
        'Advanced Methodology Locked',
        0
      )
      return
    }
    
    // Start tool timer when navigating
    const timerToolName = tabRoute === 'cost-calculator' ? 'cost' : 
                         tabRoute === 'business-case' ? 'business_case' : tabRoute
    startTool(timerToolName)
    
    router.push(`/customer/${customerId}/dashboard/${tabRoute}${queryString}`)
  }

  // Initialize workflow if needed on mount
  useEffect(() => {
    if (customerId && !workflowProgress && !workflowLoading) {
      initializeWorkflow()
    }
  }, [customerId, workflowProgress, workflowLoading, initializeWorkflow])

  // Enhanced tool completion callbacks with gamification integration
  const toolCallbacks: ToolCallbacks = {
    onICPComplete: async (data: ICPCompleteData) => {
      try {
        // Process with both workflow and gamification systems
        const [workflowResult, gamificationResult] = await Promise.all([
          completeTool('icp'),
          handleToolCompletion('icp', {
            score: data.overallScore,
            companyName: data.companyName,
            timeSpent: data.timeSpent
          })
        ])
        
        // Show gamification feedback
        if (gamificationResult.success && gamificationResult.gamification) {
          const { gamification } = gamificationResult
          
          if (gamification.pointsAwarded > 0) {
            showProgressRecognition('Customer Analysis Completed', gamification.pointsAwarded)
          }
          
          if (gamification.milestoneAchieved) {
            showMilestoneReached('Professional Milestone', 'Customer Intelligence Foundation', 50)
          }
          
          if (gamification.toolUnlocked) {
            showToolAccessEarned('Cost Calculator Methodology')
          }
        }
        
        // Check for auto-unlock and navigation
        await checkUnlockCriteria()
        
        if ((workflowResult as any)?.success && data.overallScore >= 60) {
          setTimeout(() => {
            handleTabChange('cost-calculator')
          }, 3000)
        }
        
        return workflowResult
      } catch (error) {
        console.error('Error completing ICP:', error)
        throw error
      }
    },

    onCostCalculated: async (data: CostCalculatedData) => {
      try {
        const [workflowResult, gamificationResult] = await Promise.all([
          completeTool('cost'),
          handleToolCompletion('cost', {
            annualCost: data.totalAnnualCost,
            timeSpent: data.timeSpent
          })
        ])
        
        // Show gamification feedback
        if (gamificationResult.success && gamificationResult.gamification) {
          const { gamification } = gamificationResult
          
          if (gamification.pointsAwarded > 0) {
            showProgressRecognition('Value Quantification Completed', gamification.pointsAwarded)
          }
          
          if (gamification.milestoneAchieved) {
            showMilestoneReached('Professional Milestone', 'Value Articulation Mastery', 75)
          }
          
          if (gamification.toolUnlocked) {
            showToolAccessEarned('Business Case Builder Methodology')
          }
        }
        
        await checkUnlockCriteria()
        
        if ((workflowResult as any)?.success) {
          setTimeout(() => {
            handleTabChange('business-case')
          }, 3000)
        }
        
        return workflowResult
      } catch (error) {
        console.error('Error completing Cost Calculator:', error)
        throw error
      }
    },

    onBusinessCaseReady: async (data: BusinessCaseReadyData) => {
      try {
        const [workflowResult, gamificationResult] = await Promise.all([
          completeTool('business_case'),
          handleToolCompletion('business_case', {
            templateName: data.selectedTemplate,
            timeSpent: data.timeSpent
          })
        ])
        
        // Show gamification feedback
        if (gamificationResult.success && gamificationResult.gamification) {
          const { gamification } = gamificationResult
          
          if (gamification.pointsAwarded > 0) {
            showProgressRecognition('Strategic Proposal Completed', gamification.pointsAwarded)
          }
          
          if (gamification.milestoneAchieved) {
            showMilestoneReached('Professional Milestone', 'Strategic Communication Mastery', 100)
          }
          
          if (gamification.comprehensiveMilestone) {
            showMilestoneReached('Master Achievement', 'Comprehensive Revenue Strategist', 200)
          }
        }
        
        if ((workflowResult as any)?.success) {
          setTimeout(() => {
            handleTabChange('results')
          }, 3000)
        }
        
        return workflowResult
      } catch (error) {
        console.error('Error completing Business Case:', error)
        throw error
      }
    },

    onExport: async (exportData: ExportData): Promise<void> => {
      try {
        await trackExportAction(getActiveTab())
        showProgressRecognition('Professional Export Completed', 10)
      } catch (error) {
        console.error('Error tracking export:', error)
      }
    },

    onUpdateProgress: async (progressData: ProgressData): Promise<void> => {
      try {
        await updateProgress(JSON.stringify(progressData))
      } catch (error) {
        console.error('Error updating progress:', error)
      }
    }
  }

  // Handle progressive engagement tool completion
  const handleProgressiveToolCompletion = async (toolName: string, completionData: any) => {
    // Map progressive tool names to traditional callback names
    const toolMapping: { [key: string]: keyof ToolCallbacks } = {
      'icp_analysis': 'onICPComplete',
      'cost_calculator': 'onCostCalculated', 
      'business_case': 'onBusinessCaseReady'
    }

    const callbackKey = toolMapping[toolName]
    const callback = toolCallbacks[callbackKey]
    if (callback && (callbackKey === 'onICPComplete' || callbackKey === 'onCostCalculated' || callbackKey === 'onBusinessCaseReady')) {
      await callback(completionData)
    }

    // Switch to traditional experience after first tool completion
    if (experienceMode === 'progressive') {
      setExperienceMode('traditional')
      // Navigate to traditional dashboard with completed tool
      const route = toolName === 'icp_analysis' ? 'cost-calculator' : 
                   toolName === 'cost_calculator' ? 'business-case' : 'results'
      handleTabChange(route)
    }
  }

  // Handle experience mode toggle
  const toggleExperienceMode = () => {
    const newMode: ExperienceMode = experienceMode === 'progressive' ? 'traditional' : 'progressive'
    setExperienceMode(newMode)
    
    // Update URL to maintain mode preference
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('experience', newMode)
      window.history.pushState({}, '', url.toString())
    }
  }

  // Combined loading state
  const isLoading = workflowLoading || gamificationLoading
  const hasError = workflowError || gamificationError

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSpinner />
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <Alert type="error" title="Error Loading Dashboard">
          {workflowError || gamificationError}
        </Alert>
      </div>
    )
  }

  return (
    <>
      {/* Progressive Engagement Experience */}
      {experienceMode === 'progressive' && (
        <ProgressiveEngagementContainer
          {...({
            customerId,
            onToolCompletion: handleProgressiveToolCompletion
          } as any)}
        />
      )}

      {/* Traditional Dashboard Experience */}
      {experienceMode === 'traditional' && (
        <div className={`min-h-screen ${isMobile ? 'pb-20' : ''}`}>
          <div className="space-y-6">
            {/* Competency Overview Header */}
            <CompetencyOverview
              customerId={customerId}
              competencyData={competencyProgress}
              onRefresh={refreshData}
              className="w-full"
            />

            {/* Main Content Grid */}
            <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'}`}>
              {/* Tool Area - Takes up most space */}
              <div className={`${isMobile ? 'col-span-1' : 'lg:col-span-3'} space-y-6`}>
                {/* Progressive Tool Access */}
                <ProgressiveToolAccess
                  customerId={customerId}
                  toolAccess={toolAccess}
                  onToolComplete={handleToolCompletion}
                  onUnlockEarned={handleToolUnlock}
                  className="w-full"
                />

                {/* Enhanced Navigation */}
                <EnhancedTabNavigation 
                  {...({
                    activeTab: getActiveTab(),
                    onTabChange: handleTabChange,
                    workflowData: workflowProgress,
                    workflowStatus,
                    completionPercentage: (workflowProgress as any)?.completion_percentage || 0,
                    customerId,
                    toolAccess
                  } as any)}
                />

                {/* Active Tool Display with Gamification */}
                <ActiveToolDisplay
                  currentTool={getActiveTab()}
                  toolData={workflowProgress}
                  customerId={customerId}
                  onCompletion={async (data: any) => {
                    // Route to appropriate callback
                    const activeTab = getActiveTab()
                    if (activeTab === 'icp') return await toolCallbacks.onICPComplete(data)
                    if (activeTab === 'cost') return await toolCallbacks.onCostCalculated(data)
                    if (activeTab === 'business_case') return await toolCallbacks.onBusinessCaseReady(data)
                    return data
                  }}
                  onToolChange={handleTabChange}
                  className="w-full"
                >
                  {/* Children would be rendered here in Next.js layout pattern */}
                  <div className="p-6 text-center text-gray-400">
                    Tool content would be rendered here via Next.js layout pattern
                  </div>
                </ActiveToolDisplay>
              </div>

              {/* Professional Development Sidebar */}
              <div className={`${isMobile ? 'col-span-1' : 'lg:col-span-1'}`}>
                {isMobile ? (
                  /* Mobile: Collapsible Sidebar */
                  <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t border-gray-700">
                    <button
                      onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                      className="w-full p-4 text-white font-medium flex items-center justify-center space-x-2"
                    >
                      <span>Professional Development</span>
                      <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">
                        {summaryStats.objectivesCompleted}/{summaryStats.objectivesTotal}
                      </span>
                    </button>
                    
                    {showMobileSidebar && (
                      <div className="absolute bottom-full left-0 right-0 bg-gray-900 border-t border-gray-700 max-h-80 overflow-y-auto">
                        <ProfessionalDevelopment
                          customerId={customerId}
                          milestones={milestones}
                          dailyObjectives={dailyObjectives}
                          onObjectiveComplete={handleObjectiveCompletion}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  /* Desktop: Fixed Sidebar */
                  <div className="sticky top-6">
                    <ProfessionalDevelopment
                      customerId={customerId}
                      milestones={milestones}
                      dailyObjectives={dailyObjectives}
                      onObjectiveComplete={handleObjectiveCompletion}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Experience Mode Toggle (Development & Testing) */}
      {(process.env.NODE_ENV === 'development' || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug'))) && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          <button
            onClick={toggleExperienceMode}
            className="block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg border border-indigo-500 transition-colors duration-200"
          >
            {experienceMode === 'progressive' ? 'Switch to Traditional' : 'Switch to Progressive'}
          </button>
          <div className="text-xs text-gray-400 text-center">
            Current: {experienceMode}
          </div>
        </div>
      )}

      {/* Progress Notifications - Available in both experiences */}
      <ProgressNotifications
        notifications={notifications}
        onDismiss={dismissNotification}
        position="top-right"
        className=""
      />
    </>
  )
}

export default CustomerDashboardEnhanced