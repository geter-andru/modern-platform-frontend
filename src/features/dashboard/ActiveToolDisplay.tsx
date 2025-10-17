'use client'

import React, { useState, useEffect } from 'react'
import { Lock, CheckCircle, Clock, TrendingUp, Award, Target } from 'lucide-react'

// TypeScript interfaces
interface ToolAccessStatus {
  access: boolean
  completions: number
  unlock_progress?: Record<string, string | number>
}

interface GamificationFeedback {
  pointsAwarded: number
  competencyAdvanced: boolean
  milestoneAchieved: boolean
  toolUnlocked: boolean
}

interface CompletionResult {
  gamification?: GamificationFeedback
}

interface ToolInfo {
  name: string
  description: string
  icon: string
  color: string
  level: string
}

interface ActiveToolDisplayProps {
  currentTool: string
  toolData?: any
  customerId?: string
  onCompletion: (completionData: any) => Promise<CompletionResult>
  onToolChange: (toolName: string) => void
  children: React.ReactElement
  className?: string
}

// Mock services for Next.js compatibility
const airtableService = {
  getCustomerDataByRecordId: async (customerId: string) => {
    // Mock customer data with tool access status
    return {
      toolAccessStatus: {
        icp_analysis: { access: true, completions: 2 },
        cost_calculator: { access: true, completions: 1 },
        business_case_builder: { access: false, completions: 0, unlock_progress: { 'customer_analysis_score': 65, 'required_score': 70 } }
      }
    }
  }
}

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

const ActiveToolDisplay: React.FC<ActiveToolDisplayProps> = ({ 
  currentTool, 
  toolData, 
  customerId,
  onCompletion, 
  onToolChange,
  children,
  className = '' 
}) => {
  const [toolAccess, setToolAccess] = useState<Record<string, ToolAccessStatus>>({})
  const [gamificationFeedback, setGamificationFeedback] = useState<GamificationFeedback | null>(null)
  const [loading, setLoading] = useState(true)
  
  const {
    notifications,
    showProgressRecognition,
    showCompetencyAdvancement,
    showMilestoneReached,
    showToolAccessEarned,
    dismissNotification
  } = useProgressNotifications()

  useEffect(() => {
    loadToolAccessStatus()
  }, [customerId, currentTool])

  const loadToolAccessStatus = async () => {
    if (!customerId) return

    try {
      setLoading(true)
      const data = await airtableService.getCustomerDataByRecordId(customerId)
      setToolAccess(data.toolAccessStatus || {})
    } catch (error) {
      console.error('Error loading tool access status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompletionWithGamification = async (completionData: any) => {
    try {
      // Call the original completion handler
      const result = await onCompletion(completionData)
      
      // Process gamification feedback if available
      if (result?.gamification) {
        setGamificationFeedback(result.gamification)
        
        // Show appropriate notifications based on achievements
        const { gamification } = result
        
        if (gamification.pointsAwarded > 0) {
          showProgressRecognition(
            `${currentTool.toUpperCase()} Analysis Completed`,
            gamification.pointsAwarded
          )
        }
        
        if (gamification.competencyAdvanced) {
          showCompetencyAdvancement(
            'Professional Competency',
            gamification.pointsAwarded
          )
        }
        
        if (gamification.milestoneAchieved) {
          showMilestoneReached(
            'Professional Milestone Achieved',
            'Excellence Recognition',
            gamification.pointsAwarded
          )
        }
        
        if (gamification.toolUnlocked) {
          showToolAccessEarned('Advanced Methodology Access')
        }

        // Auto-refresh tool access status
        setTimeout(() => {
          loadToolAccessStatus()
        }, 1000)
      }
      
      return result
    } catch (error) {
      console.error('Error in gamified completion handler:', error)
      throw error
    }
  }

  const getToolInfo = (toolName: string): ToolInfo => {
    const toolInfo: Record<string, ToolInfo> = {
      icp: {
        name: 'Customer Intelligence Analysis',
        description: 'Systematic customer profiling and market analysis',
        icon: '🎯',
        color: 'blue',
        level: 'Foundation'
      },
      cost: {
        name: 'Value Quantification',
        description: 'Financial impact assessment and ROI calculation',
        icon: '💰',
        color: 'green',
        level: 'Developing'
      },
      'cost-calculator': {
        name: 'Value Quantification',
        description: 'Financial impact assessment and ROI calculation', 
        icon: '💰',
        color: 'green',
        level: 'Developing'
      },
      business_case: {
        name: 'Strategic Proposal Development',
        description: 'Executive-level business case construction',
        icon: '📊',
        color: 'purple',
        level: 'Proficient'
      },
      'business-case': {
        name: 'Strategic Proposal Development',
        description: 'Executive-level business case construction',
        icon: '📊', 
        color: 'purple',
        level: 'Proficient'
      },
      results: {
        name: 'Results Dashboard',
        description: 'Comprehensive analysis results and export',
        icon: '📈',
        color: 'yellow',
        level: 'Advanced'
      }
    }
    
    return toolInfo[toolName] || toolInfo.icp
  }

  const getAccessStatus = (toolName: string): ToolAccessStatus => {
    const normalizedName = toolName === 'cost-calculator' ? 'cost_calculator' : 
                          toolName === 'business-case' ? 'business_case_builder' : 
                          `${toolName}_analysis`
    
    return toolAccess[normalizedName] || { access: false, completions: 0 }
  }

  const toolInfo = getToolInfo(currentTool)
  const accessStatus = getAccessStatus(currentTool)
  const isLocked = !accessStatus.access

  if (loading) {
    return (
      <div className={`bg-gray-900 border border-gray-700 rounded-lg p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3" />
          <div className="h-32 bg-gray-700 rounded" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`bg-gray-900 border border-gray-700 rounded-lg overflow-hidden ${className}`}>
        {/* Executive Tool Header */}
        <div className={`bg-gradient-to-r from-${toolInfo.color}-900/30 via-${toolInfo.color}-800/20 to-${toolInfo.color}-900/30 border-b border-gray-700 p-8`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className={`p-4 bg-gradient-to-br from-${toolInfo.color}-600/20 to-${toolInfo.color}-500/20 rounded-2xl border border-${toolInfo.color}-500/30 backdrop-blur-sm shadow-lg`}>
                <span className="text-4xl">{toolInfo.icon}</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                  {toolInfo.name}
                </h2>
                <p className="text-gray-200 text-base leading-relaxed mb-4">
                  {toolInfo.description}
                </p>
                <div className="flex items-center space-x-6">
                  <span className={`px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full text-sm font-semibold text-purple-300`}>
                    {toolInfo.level} Tier
                  </span>
                  <span className="text-sm text-gray-300 font-medium">
                    Deployments: {accessStatus.completions || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Executive Status Indicator */}
            <div className="flex items-center space-x-4">
              {isLocked ? (
                <div className="flex items-center space-x-3 text-gray-400">
                  <div className="p-2 bg-gray-700/50 rounded-lg">
                    <Lock className="w-6 h-6" />
                  </div>
                  <span className="text-base font-medium">Access Restricted</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3 text-green-400">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <span className="text-base font-semibold">Executive Access</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Executive Performance Feedback */}
        {gamificationFeedback && (
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/60 border-b border-gray-700/50 p-6">
            <div className="flex items-center space-x-6">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Strategic Development Recognition
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {gamificationFeedback.pointsAwarded > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-blue-500/20 rounded">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-200">+{gamificationFeedback.pointsAwarded} excellence points</span>
                    </div>
                  )}
                  {gamificationFeedback.competencyAdvanced && (
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-green-500/20 rounded">
                        <Target className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-200">Competency Advancement</span>
                    </div>
                  )}
                  {gamificationFeedback.milestoneAchieved && (
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-yellow-500/20 rounded">
                        <Award className="w-4 h-4 text-yellow-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-200">Strategic Milestone</span>
                    </div>
                  )}
                  {gamificationFeedback.toolUnlocked && (
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-purple-500/20 rounded">
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-200">Access Granted</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setGamificationFeedback(null)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Executive Access Restriction Display */}
        {isLocked ? (
          <div className="p-12 text-center">
            <div className="mb-8">
              <div className="p-6 bg-gray-700/30 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Lock className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-200 mb-4">
                Executive Methodology Access Required
              </h3>
              <p className="text-gray-300 max-w-lg mx-auto leading-relaxed">
                Demonstrate strategic competency in foundational methodologies to unlock this advanced executive framework.
              </p>
            </div>

            {/* Executive Unlock Progress Dashboard */}
            {accessStatus.unlock_progress && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-lg mx-auto mb-8">
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-200 mb-4">
                    Competency Requirements
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(accessStatus.unlock_progress).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300 font-medium capitalize">
                          {key.replace('_', ' ')}
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full text-sm font-bold text-purple-300">
                          {typeof value === 'number' ? value : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => onToolChange('icp')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 hover:scale-105"
            >
              Begin Strategic Foundation
            </button>
          </div>
        ) : (
          /* Executive Tool Framework Content */
          <div className="p-8">
            {/* Enhanced children with executive gamification context */}
            {React.cloneElement(children as any, {
              onCompletion: handleCompletionWithGamification,
              toolInfo: toolInfo,
              accessStatus: accessStatus,
              gamificationEnabled: true,
              executiveMode: true
            } as any)}
          </div>
        )}
      </div>

      {/* Executive Progress Notifications */}
      <ProgressNotifications
        notifications={notifications}
        onDismiss={dismissNotification}
        position="top-right"
        className="fixed z-50"
      />
    </>
  )
}

export default ActiveToolDisplay