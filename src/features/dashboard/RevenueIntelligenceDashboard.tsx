'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Target, Award, Zap, BarChart3, Crown, ToggleLeft, ToggleRight, Settings, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ShadowCRMIntegration from './ShadowCRMIntegration'
import ExperienceDrivenPriorities from './ExperienceDrivenPriorities'
import DealMomentumAnalyzer from './DealMomentumAnalyzer'
import CompetitiveIntelligenceTracker from './CompetitiveIntelligenceTracker'
import StakeholderRelationshipMap from './StakeholderRelationshipMap'

// Mock components for Next.js compatibility
interface Achievement {
  id: string
  title: string
  description: string
  points: number
  achievedAt: string
}

interface MilestoneData {
  id: string
  title: string
  description: string
  achieved: boolean
  achievedAt?: string
  points: number
}

interface ActionData {
  id: string
  type: string
  data: Record<string, unknown>
  timestamp: string
  status: 'pending' | 'completed' | 'failed'
}

const ProfessionalAchievementNotification: React.FC<{
  achievements: Achievement[]
  onDismiss: (id: string) => void
  position: string
}> = ({ achievements, onDismiss, position }) => (
  <div className={`fixed ${position} z-50`}>
    {/* Notification logic would go here */}
  </div>
)

// Mock components removed - using actual components from imports

import CollapsibleModule from './CollapsibleModule'
const DashboardSettings: React.FC<{
  isOpen: boolean
  onClose: () => void
  moduleSettings: ModuleSettings[]
  onModuleSettingsChange: (settings: ModuleSettings[]) => void
  onResetToDefaults: () => void
}> = () => <div>Dashboard Settings Modal</div>

import MilestoneProgressBar from './MilestoneProgressBar'

const SeriesBHealthCard: React.FC<{
  overallHealth: string
  seriesBReadiness: number
  currentARR: number
  targetARR: number
  timelineMonths: number
  targetTimelineMonths: number
  topAlerts: string[]
  keyWins: string[]
  compactMode: boolean
}> = () => <div>Series B Health Card Component</div>

const TodaysFocus: React.FC<{
  compactMode: boolean
}> = () => <div>Today's Focus Component</div>

const SeriesBTrajectory: React.FC<{
  currentPace: string
  targetPace: string
  currentProgress: number
  compactMode: boolean
}> = () => <div>Series B Trajectory Component</div>

// TypeScript interfaces
interface ModuleSettings {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  priority: 'high' | 'medium' | 'low'
  visible: boolean
  defaultExpanded: boolean
  alertCount: number
  actionCount: number
  description?: string
}

interface Achievement {
  id: string
  type: string
  title: string
  description: string
}

interface DevelopmentData {
  currentLevel: {
    name: string
    key: string
  }
  totalExperience: number
  weeklyExperience: number
  progressToNext: {
    percentage: number
    experienceNeeded: number
  }
  todayActions: number
  todayExperience: number
  milestoneProgress: MilestoneData[]
  seriesBReadiness: {
    progress: number
    status: string
  }
  weeklyData: {
    totalActions: number
    totalExperience: number
  }
  buyerIntelligence: {
    technicalValidation: number
    businessCaseApproval: number
    competitorAnalysis: { dataflow: boolean }
    stakeholderMapping: { cfo: boolean }
    valueFrameworks: { roiCalculator: boolean }
    decisionTimeline: { q4Budget: boolean }
    weeklyActions: number
    stakeholderCoverage: {
      cto: number
      cfo: number
      coo: number
    }
    competitivePosition: {
      currentWinRate: number
      trendDirection: string
    }
  }
  dealPipeline: Array<{
    id: string
    name: string
    value: number
    stage: string
    riskLevel: string
    stakeholderAlignment: number
  }>
  recentActions?: ActionData[]
}

interface RevenueIntelligenceDashboardProps {
  customerId: string
  variant?: 'standard' | 'premium'
}

// Mock services for Next.js compatibility
const professionalDevelopmentService = {
  getDashboardData: async (customerId: string): Promise<DevelopmentData> => ({
    currentLevel: { name: 'Revenue Intelligence Foundation', key: 'foundation' },
    totalExperience: 1250,
    weeklyExperience: 340,
    progressToNext: { percentage: 65, experienceNeeded: 500 },
    todayActions: 3,
    todayExperience: 75,
    milestoneProgress: [],
    seriesBReadiness: { progress: 68, status: 'Series B Preparation' },
    weeklyData: { totalActions: 12, totalExperience: 340 },
    buyerIntelligence: {
      technicalValidation: 85,
      businessCaseApproval: 23,
      competitorAnalysis: { dataflow: false },
      stakeholderMapping: { cfo: false },
      valueFrameworks: { roiCalculator: false },
      decisionTimeline: { q4Budget: false },
      weeklyActions: 3,
      stakeholderCoverage: { cto: 85, cfo: 15, coo: 60 },
      competitivePosition: { currentWinRate: 65, trendDirection: 'declining' }
    },
    dealPipeline: [
      { id: 'deal_1', name: 'TechFlow Enterprise', value: 150000, stage: 'proposal', riskLevel: 'medium', stakeholderAlignment: 70 },
      { id: 'deal_2', name: 'DataCorp Implementation', value: 320000, stage: 'technical_review', riskLevel: 'high', stakeholderAlignment: 45 },
      { id: 'deal_3', name: 'CloudScale Solutions', value: 280000, stage: 'business_case', riskLevel: 'low', stakeholderAlignment: 85 }
    ],
    recentActions: []
  }),

  trackAction: async (customerId: string, actionType: string, actionData: Record<string, unknown>) => ({
    experienceGained: 25,
    achievements: []
  })
}

const milestoneModuleService = {
  seriesBStages: {
    10: { name: 'Foundation', focus: 'Market validation' },
    11: { name: 'Growth acceleration', focus: 'Scale operations' },
    12: { name: 'Scalability/Revenue', focus: 'Product enhancement' },
    13: { name: 'Strategic partnerships', focus: 'Channel development' },
    14: { name: 'Revenue optimization', focus: 'Operational efficiency' },
    15: { name: 'Series B preparation', focus: 'Investment readiness' }
  },

  getModuleConfigForStage: (currentStage: number, targetStage: number) => null
}

const useUserIntelligence = () => ({
  assessment: null,
  milestone: null,
  usage: null,
  loading: false,
  error: null
})

const useBehavioralTracking = (type: string, customerId: string) => ({
  trackAction: (actionType: string, data: Record<string, unknown>) => console.log('Tracking:', actionType, data)
})

const useProfessionalNotifications = () => ({
  showAchievement: (achievement: Achievement) => console.log('Achievement:', achievement),
  achievements: [] as Achievement[],
  onDismiss: (id: string) => console.log('Dismiss:', id),
  templates: {
    completedTask: (actionType: string, points: number) => ({
      type: 'task_completion',
      title: `${actionType} completed`,
      description: `Gained ${points} experience points`
    })
  }
})

/**
 * Revenue Intelligence Dashboard - CORE PHASE
 * 
 * Leading indicator intelligence tracking disguised as professional development
 * Stealth gamification through buyer intelligence action experience points
 * Business milestone progression toward Series B readiness
 */

const RevenueIntelligenceDashboard: React.FC<RevenueIntelligenceDashboardProps> = ({ 
  customerId, 
  variant = 'premium' 
}) => {
  const router = useRouter()
  const { assessment, milestone, usage, loading, error } = useUserIntelligence()
  const { trackAction } = useBehavioralTracking('revenue_intelligence', customerId)
  
  // Professional development state
  const [developmentData, setDevelopmentData] = useState<DevelopmentData | null>(null)
  const [experienceHistory, setExperienceHistory] = useState<any[]>([])
  const [isLoadingDevelopment, setIsLoadingDevelopment] = useState(true)
  
  // Achievement notifications
  const { showAchievement, achievements, onDismiss, templates } = useProfessionalNotifications()

  // POLISH PHASE: Dashboard settings state
  const [showSettings, setShowSettings] = useState(false)
  const [moduleSettings, setModuleSettings] = useState<ModuleSettings[]>([
    {
      id: 'revenue_indicators',
      name: 'Revenue Intelligence Indicators',
      icon: TrendingUp,
      priority: 'high',
      visible: true,
      defaultExpanded: true,
      alertCount: 2,
      actionCount: 3
    },
    {
      id: 'priority_actions',
      name: 'Priority Actions',
      icon: Target,
      priority: 'high',
      visible: true,
      defaultExpanded: true,
      alertCount: 0,
      actionCount: 5
    },
    {
      id: 'deal_momentum',
      name: 'Deal Momentum & Velocity',
      icon: Zap,
      priority: 'high',
      visible: true,
      defaultExpanded: true,
      alertCount: 3,
      actionCount: 4
    },
    {
      id: 'professional_progression',
      name: 'Professional Development Path',
      icon: Award,
      priority: 'medium',
      visible: true,
      defaultExpanded: false,
      alertCount: 0,
      actionCount: 1
    },
    {
      id: 'competitive_intelligence',
      name: 'Competitive Intelligence',
      icon: Target,
      priority: 'medium',
      visible: true,
      defaultExpanded: false,
      alertCount: 2,
      actionCount: 3
    },
    {
      id: 'stakeholder_relationships',
      name: 'Stakeholder Relationships',
      icon: Users,
      priority: 'medium',
      visible: true,
      defaultExpanded: false,
      alertCount: 1,
      actionCount: 2
    },
    {
      id: 'business_milestones',
      name: 'Business Development Milestones',
      icon: Award,
      priority: 'low',
      visible: false,
      defaultExpanded: false,
      alertCount: 0,
      actionCount: 1
    }
  ])
  const [compactMode, setCompactMode] = useState(false)
  
  // MILESTONE INTEGRATION - Series B stage tracking
  const [currentSeriesBStage, setCurrentSeriesBStage] = useState(12) // Default: Scalability/Revenue
  const [targetSeriesBStage, setTargetSeriesBStage] = useState(15) // Target: Series B preparation

  // Initialize professional development tracking
  useEffect(() => {
    const initializeDevelopment = async () => {
      try {
        setIsLoadingDevelopment(true)
        const dashboardData = await professionalDevelopmentService.getDashboardData(customerId)
        setDevelopmentData(dashboardData)
        setExperienceHistory(dashboardData.recentActions || [])
        
        // Track dashboard view
        await trackProfessionalAction('view_dashboard', {
          variant,
          timestamp: Date.now()
        })
      } catch (error) {
        console.error('Error initializing development tracking:', error)
      } finally {
        setIsLoadingDevelopment(false)
      }
    }

    if (customerId) {
      initializeDevelopment()
    }
  }, [customerId, variant])

  // Track professional development actions
  const trackProfessionalAction = async (actionType: string, actionData: Record<string, unknown> = {}) => {
    try {
      const result = await professionalDevelopmentService.trackAction(customerId, actionType, actionData)
      
      // Update local state
      if (result.experienceGained > 0) {
        const updatedData = await professionalDevelopmentService.getDashboardData(customerId)
        setDevelopmentData(updatedData)
        setExperienceHistory(updatedData.recentActions || [])

        // Show achievement notifications
        result.achievements.forEach((achievement: Achievement) => {
          showAchievement(achievement)
        })

        // Create action completion notification
        if (result.experienceGained > 0) {
          const template = templates.completedTask(actionType, result.experienceGained)
          showAchievement({
            ...template,
            id: `action_${Date.now()}_${actionType}`
          } as any)
        }
      }
      
      // Track in existing behavioral system
      trackAction('professional_development_action', {
        actionType,
        experienceGained: result.experienceGained,
        achievements: result.achievements.length,
        timestamp: Date.now()
      })

      return result
    } catch (error) {
      console.error('Error tracking professional action:', error)
      return { experienceGained: 0, achievements: [] }
    }
  }

  // Handle resource actions (view, copy, execute)
  const handleResourceAction = async (actionType: string, resourceData: Record<string, unknown>) => {
    await trackProfessionalAction(actionType, {
      resourceName: resourceData.name,
      resourceType: resourceData.type,
      difficulty: resourceData.difficulty || 'medium',
      strategic_value: resourceData.strategic_value || 'medium'
    })
  }

  // Get module settings by ID
  const getModuleSettings = (moduleId: string) => {
    return moduleSettings.find(m => m.id === moduleId) || {}
  }

  // Helper function to get milestone-driven modules
  const getMilestoneDrivenModules = () => {
    try {
      return milestoneModuleService.getModuleConfigForStage(currentSeriesBStage, currentSeriesBStage)
    } catch (error) {
      console.warn('Error getting milestone-driven modules:', error)
      return moduleSettings
    }
  }

  const getVisibleModules = () => {
    // Use milestone-driven modules if available, otherwise fall back to moduleSettings
    const settings = getMilestoneDrivenModules() || moduleSettings
    return settings
      .filter(module => module.visible)
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
  }

  // Handle tool navigation with experience tracking
  const handleToolNavigation = async (toolName: string) => {
    await trackProfessionalAction('navigate_to_tool', {
      toolName,
      strategic_value: 'high'
    })
    
    router.push(`/customer/${customerId}/simplified/${toolName}`)
  }

  // Safe defaults for development
  const safeDevelopmentData = developmentData || {
    currentLevel: { name: 'Revenue Intelligence Foundation', key: 'foundation' },
    totalExperience: 0,
    weeklyExperience: 0,
    progressToNext: { percentage: 0, experienceNeeded: 500 },
    todayActions: 0,
    todayExperience: 0,
    milestoneProgress: [],
    seriesBReadiness: { progress: 0, status: 'Foundation Building' },
    weeklyData: { totalActions: 0, totalExperience: 0 },
    buyerIntelligence: {
      technicalValidation: 85,
      businessCaseApproval: 23,
      competitorAnalysis: { dataflow: false },
      stakeholderMapping: { cfo: false },
      valueFrameworks: { roiCalculator: false },
      decisionTimeline: { q4Budget: false },
      weeklyActions: 3,
      stakeholderCoverage: { cto: 85, cfo: 15, coo: 60 },
      competitivePosition: { currentWinRate: 65, trendDirection: 'declining' }
    },
    dealPipeline: [
      { id: 'deal_1', name: 'TechFlow Enterprise', value: 150000, stage: 'proposal', riskLevel: 'medium', stakeholderAlignment: 70 },
      { id: 'deal_2', name: 'DataCorp Implementation', value: 320000, stage: 'technical_review', riskLevel: 'high', stakeholderAlignment: 45 },
      { id: 'deal_3', name: 'CloudScale Solutions', value: 280000, stage: 'business_case', riskLevel: 'low', stakeholderAlignment: 85 }
    ]
  }

  if (loading || isLoadingDevelopment) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading revenue intelligence platform...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Achievement Notifications */}
      <ProfessionalAchievementNotification
        achievements={achievements}
        onDismiss={onDismiss}
        position="top-right"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header with Dashboard Controls */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Revenue Intelligence Dashboard</h1>
              <p className="text-gray-400 text-sm">Professional development through systematic buyer intelligence</p>
              
              {/* Series B Milestone Progress */}
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-blue-300">Stage {currentSeriesBStage}: {(milestoneModuleService.seriesBStages as any)[currentSeriesBStage]?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-xs text-purple-300">Target: Stage {targetSeriesBStage}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Focus: {(milestoneModuleService.seriesBStages as any)[currentSeriesBStage]?.focus}
                </div>
              </div>
            </div>
            
            {/* Dashboard Controls */}
            <div className="flex items-center gap-3">
              {/* Series B Stage Selector */}
              <select
                value={currentSeriesBStage}
                onChange={(e) => setCurrentSeriesBStage(parseInt(e.target.value))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                title="Select Series B Stage"
              >
                {Object.entries(milestoneModuleService.seriesBStages).map(([stage, info]) => (
                  <option key={stage} value={stage}>
                    Stage {stage}: {info.name}
                  </option>
                ))}
              </select>

              {/* Compact Mode Toggle */}
              <button
                onClick={() => setCompactMode(!compactMode)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  compactMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                title="Toggle compact mode"
              >
                Compact
              </button>
              
              {/* Settings */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                title="Dashboard settings"
              >
                <Settings className="w-4 h-4 text-gray-400" />
              </button>
              
              {/* Dashboard Type Toggle */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-white">Standard</span>
                  </div>
                  <button
                    onClick={() => router.push(`/customer/${customerId}/simplified/dashboard${variant === 'premium' ? '' : '-premium'}`)}
                    className="text-gray-400 hover:text-white transition-colors"
                    title={`Switch to ${variant === 'premium' ? 'Standard' : 'Premium'} Dashboard`}
                  >
                    {variant === 'premium' ? (
                      <ToggleRight className="w-4 h-4 text-purple-500" />
                    ) : (
                      <ToggleLeft className="w-4 h-4" />
                    )}
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <Crown className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-white">Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SERIES B COMMAND CENTER - Top 20% Screen Real Estate (5-Second Rule) */}
        <div className="mb-6 space-y-4">
          {/* Executive Health Status - 5-Second Decision Velocity */}
          <SeriesBHealthCard
            overallHealth="yellow"
            seriesBReadiness={68}
            currentARR={2100000}
            targetARR={5000000}
            timelineMonths={8}
            targetTimelineMonths={6}
            topAlerts={[
              "Customer churn spike detected (8% vs 5% target)",
              "Pipeline velocity 20% below target",
              "Engineering team scaling challenges"
            ]}
            keyWins={[
              "Strong product-market fit signals (NPS 65+)",
              "Technical team execution excellence (98% uptime)",
              "3 enterprise deals in final stages"
            ]}
            compactMode={compactMode}
          />

          {/* Today's Focus - Exception-First Design */}
          <TodaysFocus compactMode={compactMode} />

          {/* Predictive Timeline - Forward-Looking Intelligence */}
          <SeriesBTrajectory
            currentPace="8 months to readiness"
            targetPace="6 months"
            currentProgress={68}
            compactMode={compactMode}
          />
        </div>

        {/* Milestone Progress Visualization */}
        <div className="mb-6">
          <MilestoneProgressBar
            currentStage={currentSeriesBStage}
            targetStage={targetSeriesBStage}
            compact={compactMode}
            showDetails={!compactMode}
          />
        </div>

        {/* Modular Dashboard System */}
        <div className="space-y-4">
          {getVisibleModules().map((module) => {
            switch (module.id) {
              case 'revenue_indicators':
                return (
                  <CollapsibleModule
                    key={module.id}
                    title={module.name}
                    subtitle={module.description}
                    icon={module.icon}
                    priority={module.priority}
                    defaultExpanded={module.defaultExpanded}
                    alertCount={module.alertCount}
                    actionCount={module.actionCount}
                    lastUpdated="2 minutes ago"
                    compact={compactMode}
                  >
                    <ShadowCRMIntegration />
                  </CollapsibleModule>
                )
              
              case 'priority_actions':
                return (
                  <CollapsibleModule
                    key={module.id}
                    title={module.name}
                    subtitle={module.description}
                    icon={module.icon}
                    priority={module.priority}
                    defaultExpanded={module.defaultExpanded}
                    alertCount={module.alertCount}
                    actionCount={module.actionCount}
                    experienceAvailable={45}
                    lastUpdated="5 minutes ago"
                    compact={compactMode}
                  >
                    <ExperienceDrivenPriorities />
                  </CollapsibleModule>
                )
              
              case 'deal_momentum':
                return (
                  <CollapsibleModule
                    key={module.id}
                    title={module.name}
                    subtitle={module.description}
                    icon={module.icon}
                    priority={module.priority}
                    defaultExpanded={module.defaultExpanded}
                    alertCount={module.alertCount}
                    actionCount={module.actionCount}
                    experienceAvailable={25}
                    lastUpdated="1 hour ago"
                    compact={compactMode}
                  >
                    <DealMomentumAnalyzer />
                  </CollapsibleModule>
                )
              
              case 'professional_progression':
                return (
                  <CollapsibleModule
                    key={module.id}
                    title={module.name}
                    subtitle={module.description}
                    icon={module.icon}
                    priority={module.priority}
                    defaultExpanded={module.defaultExpanded}
                    alertCount={module.alertCount}
                    actionCount={module.actionCount}
                    experienceAvailable={15}
                    lastUpdated="30 minutes ago"
                    compact={compactMode}
                  >
                    {/* Professional Development Overview - Compact */}
                    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        {/* Current Level */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                              <Award className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {safeDevelopmentData.currentLevel.name}
                              </h3>
                              <p className="text-purple-200 text-xs">Professional Development Level</p>
                            </div>
                          </div>
              
                          {/* Progress bar */}
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${safeDevelopmentData.progressToNext.percentage}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {safeDevelopmentData.progressToNext.experienceNeeded.toLocaleString()} exp to next level
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 lg:col-span-2">
                          <div className="text-center lg:text-left">
                            <div className="text-xl font-bold text-white">
                              {safeDevelopmentData.totalExperience.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">Total Experience</div>
                          </div>
                          <div className="text-center lg:text-left">
                            <div className="text-xl font-bold text-green-400">
                              {safeDevelopmentData.todayActions}
                            </div>
                            <div className="text-xs text-gray-400">Actions Today</div>
                          </div>
                          <div className="text-center lg:text-left">
                            <div className="text-xl font-bold text-blue-400">
                              {safeDevelopmentData.weeklyData.totalExperience}
                            </div>
                            <div className="text-xs text-gray-400">Weekly Total</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleModule>
                )
              
              case 'competitive_intelligence':
                return (
                  <CollapsibleModule
                    key={module.id}
                    title={module.name}
                    subtitle={module.description}
                    icon={module.icon}
                    priority={module.priority}
                    defaultExpanded={module.defaultExpanded}
                    alertCount={module.alertCount}
                    actionCount={module.actionCount}
                    experienceAvailable={20}
                    lastUpdated="15 minutes ago"
                    compact={compactMode}
                  >
                    <CompetitiveIntelligenceTracker />
                  </CollapsibleModule>
                )
              
              case 'stakeholder_relationships':
                return (
                  <CollapsibleModule
                    key={module.id}
                    title={module.name}
                    subtitle={module.description}
                    icon={module.icon}
                    priority={module.priority}
                    defaultExpanded={module.defaultExpanded}
                    alertCount={module.alertCount}
                    actionCount={module.actionCount}
                    experienceAvailable={35}
                    lastUpdated="45 minutes ago"
                    compact={compactMode}
                  >
                    <StakeholderRelationshipMap />
                  </CollapsibleModule>
                )
              
              case 'business_milestones':
                return (
                  <CollapsibleModule
                    key={module.id}
                    title={module.name}
                    subtitle={module.description}
                    icon={module.icon}
                    priority={module.priority}
                    defaultExpanded={module.defaultExpanded}
                    alertCount={module.alertCount}
                    actionCount={module.actionCount}
                    experienceAvailable={10}
                    lastUpdated="2 hours ago"
                    compact={compactMode}
                  >
                    <div className="text-center text-gray-400 py-8">
                      <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Business milestone tracking coming soon</p>
                    </div>
                  </CollapsibleModule>
                )
              
              default:
                return null
            }
          })}
        </div>

        {/* Dashboard Settings Modal */}
        <DashboardSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          moduleSettings={moduleSettings}
          onModuleSettingsChange={setModuleSettings}
          onResetToDefaults={() => {
            setModuleSettings([])
            setShowSettings(false)
          }}
        />
      </div>
    </div>
  )
}

export default RevenueIntelligenceDashboard