import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { 
  CompetencyData, 
  CompetencyAnalytics, 
  ProgressTrend,
  COMPETENCY_LEVELS,
  CompetencyUtils
} from '../types/competency'
import { CompetencyAnalyticsService } from '../services/competencyAnalyticsService'
import { ProgressTrackingService, ProgressAction, ProgressUpdate } from '../services/progressTrackingService'
import { SupabaseRealtimeService } from '../services/supabaseRealtimeService'

export interface UseEnhancedCompetencyDashboardReturn {
  // Core competency data
  competencyData: CompetencyData | null
  analytics: CompetencyAnalytics | null
  progressHistory: ProgressTrend[]
  
  // Loading and error states
  loading: boolean
  error: string | null
  
  // Real-time connection
  isConnected: boolean
  connectionState: 'connecting' | 'open' | 'closing' | 'closed'
  
  // Actions
  trackProgress: (action: ProgressAction) => Promise<ProgressUpdate>
  refreshAnalytics: () => Promise<void>
  updateCompetencyData: (updates: Partial<CompetencyData>) => void
  
  // Notifications
  notifications: Notification[]
  dismissNotification: (id: string) => void
  
  // Progress summary
  progressSummary: {
    pointsGained: number
    levelAdvancements: number
    toolsUnlocked: number
    competencyImprovements: {
      customerAnalysis: number
      valueCommunication: number
      salesExecution: number
    }
  }
}

export interface Notification {
  id: string
  type: 'level_up' | 'tool_unlock' | 'milestone_achieved' | 'progress_update'
  title: string
  message: string
  timestamp: string
  read: boolean
}

export function useEnhancedCompetencyDashboard(userId: string): UseEnhancedCompetencyDashboardReturn {
  // State management
  const [competencyData, setCompetencyData] = useState<CompetencyData | null>(null)
  const [analytics, setAnalytics] = useState<CompetencyAnalytics | null>(null)
  const [progressHistory, setProgressHistory] = useState<ProgressTrend[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  // Service references
  const analyticsServiceRef = useRef<CompetencyAnalyticsService | null>(null)
  const progressServiceRef = useRef<ProgressTrackingService | null>(null)
  const realtimeServiceRef = useRef<SupabaseRealtimeService | null>(null)
  
  // WebSocket connection state
  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState<'connecting' | 'open' | 'closing' | 'closed'>('closed')

  const initializeServices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Load initial competency data (TODO: Replace with real Supabase call)
      const initialData: CompetencyData = {
        customerAnalysis: 45,
        valueCommunication: 38,
        salesExecution: 42,
        overallScore: 42,
        currentLevel: COMPETENCY_LEVELS[0],
        totalPoints: 0,
        levelProgress: 0,
        baselineScores: {
          customerAnalysis: 45,
          valueCommunication: 38,
          salesExecution: 42
        },
        levelHistory: [],
        lastUpdated: new Date().toISOString(),
        toolUnlockStates: {
          icpUnlocked: true,
          costCalculatorUnlocked: false,
          businessCaseUnlocked: false,
          resourcesUnlocked: false,
          exportUnlocked: false
        }
      }

      setCompetencyData(initialData)

      // Initialize services
      analyticsServiceRef.current = new CompetencyAnalyticsService(userId, initialData, progressHistory)
      progressServiceRef.current = new ProgressTrackingService(userId, initialData, progressHistory)
      
      // Initialize Supabase realtime service
      realtimeServiceRef.current = new SupabaseRealtimeService({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        userId
      })

      // Load analytics
      const analyticsData = await analyticsServiceRef.current.calculateAnalytics()
      setAnalytics(analyticsData)

      // Set up realtime connection
      await realtimeServiceRef.current.initialize()

    } catch (err) {
      console.error('Error initializing competency dashboard:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize dashboard')
    } finally {
      setLoading(false)
    }
  }, [userId, progressHistory])

  // Add notification helper
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    setNotifications(prev => [newNotification, ...prev])
  }, [])

  // Dismiss notification
  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  // Track progress action
  const trackProgress = useCallback(async (action: ProgressAction): Promise<ProgressUpdate> => {
    if (!progressServiceRef.current) {
      throw new Error('Progress service not initialized')
    }
    return await progressServiceRef.current.trackProgress(action)
  }, [])

  // Refresh analytics
  const refreshAnalytics = useCallback(async () => {
    if (!analyticsServiceRef.current) {
      return
    }
    try {
      const analyticsData = await analyticsServiceRef.current.calculateAnalytics()
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error refreshing analytics:', error)
    }
  }, [])

  // Update competency data
  const updateCompetencyData = useCallback((updates: Partial<CompetencyData>) => {
    setCompetencyData(prev => prev ? { ...prev, ...updates } : null)
  }, [])

  // Calculate progress summary
  const progressSummary = useMemo(() => {
    if (!competencyData) {
      return {
        pointsGained: 0,
        levelAdvancements: 0,
        toolsUnlocked: 0,
        competencyImprovements: {
          customerAnalysis: 0,
          valueCommunication: 0,
          salesExecution: 0
        }
      }
    }

    const baseline = competencyData.baselineScores
    return {
      pointsGained: competencyData.totalPoints,
      levelAdvancements: competencyData.levelHistory.length,
      toolsUnlocked: Object.values(competencyData.toolUnlockStates).filter(Boolean).length,
      competencyImprovements: {
        customerAnalysis: competencyData.customerAnalysis - baseline.customerAnalysis,
        valueCommunication: competencyData.valueCommunication - baseline.valueCommunication,
        salesExecution: competencyData.salesExecution - baseline.salesExecution
      }
    }
  }, [competencyData])

  const setupRealtimeHandlers = useCallback(() => {
    if (!realtimeServiceRef.current) return

    // Competency update handlers
    const unsubscribeCompetencyUpdate = realtimeServiceRef.current.subscribe('competency_update', (update) => {
      console.log('Competency update received:', update)
      // Handle real-time competency updates
      if (competencyData) {
        // Update competency data based on server update
        setCompetencyData(prev => prev ? { ...prev, ...update.data } : null)
      }
    })

    const unsubscribeProgressUpdate = realtimeServiceRef.current.subscribe('progress_update', (update) => {
      console.log('Progress update received:', update)
      // Handle real-time progress updates
      setProgressHistory(prev => [...prev, {
        period: 'realtime',
        score: update.data?.overallScore || competencyData?.overallScore || 0,
        change: 0,
        velocity: { weekly: 0, monthly: 0, quarterly: 0, period: 'realtime', pointsGained: 0 },
        date: update.timestamp,
        customerAnalysis: update.data?.customerAnalysis || competencyData?.customerAnalysis || 0,
        valueCommunication: update.data?.valueCommunication || competencyData?.valueCommunication || 0,
        salesExecution: update.data?.salesExecution || competencyData?.salesExecution || 0,
        overallScore: update.data?.overallScore || competencyData?.overallScore || 0,
        points: update.data?.totalPoints || competencyData?.totalPoints || 0
      }])
    })

    const unsubscribeLevelUp = realtimeServiceRef.current.subscribe('level_up', (data) => {
      console.log('Level up notification:', data)
      addNotification({
        type: 'level_up',
        title: 'Level Up!',
        message: `Congratulations! You've reached ${data.newLevel} level!`,
        timestamp: new Date().toISOString(),
        read: false
      })
    })

    const unsubscribeToolUnlock = realtimeServiceRef.current.subscribe('tool_unlock', (data) => {
      console.log('Tool unlock notification:', data)
      addNotification({
        type: 'tool_unlock',
        title: 'New Tool Unlocked!',
        message: `${data.toolName} is now available!`,
        timestamp: new Date().toISOString(),
        read: false
      })
    })

    // Connection state handlers
    const unsubscribeConnectionState = realtimeServiceRef.current.subscribe('connection_state', (state) => {
      setConnectionState(state as any)
      setIsConnected((state as any) === 'open')
    })

    return () => {
      unsubscribeCompetencyUpdate()
      unsubscribeProgressUpdate()
      unsubscribeLevelUp()
      unsubscribeToolUnlock()
      unsubscribeConnectionState()
    }
  }, [competencyData, addNotification])

  // Initialize services on mount
  useEffect(() => {
    initializeServices()
  }, [initializeServices])

  // Setup realtime handlers when services are ready
  useEffect(() => {
    if (realtimeServiceRef.current && competencyData) {
      setupRealtimeHandlers()
    }
  }, [setupRealtimeHandlers])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (realtimeServiceRef.current) {
        realtimeServiceRef.current.disconnect()
      }
    }
  }, [])

  return {
    // Core competency data
    competencyData,
    analytics,
    progressHistory,
    
    // Loading and error states
    loading,
    error,
    
    // Real-time connection
    isConnected,
    connectionState,
    
    // Actions
    trackProgress,
    refreshAnalytics,
    updateCompetencyData,
    
    // Notifications
    notifications,
    dismissNotification,
    
    // Progress summary
    progressSummary
  }
}

export function useCompetencyLevels() {
  return {
    levels: COMPETENCY_LEVELS,
    getLevelById: (id: string) => COMPETENCY_LEVELS.find(level => level.id === id),
    getLevelByPoints: (points: number) => CompetencyUtils.getCurrentLevel(points),
    getNextLevel: (currentLevelId: string) => {
      const currentLevel = COMPETENCY_LEVELS.find(level => level.id === currentLevelId)
      return currentLevel?.nextLevel ? COMPETENCY_LEVELS.find(level => level.id === currentLevel.nextLevel) : null
    },
    getPreviousLevel: (currentLevelId: string) => {
      const currentLevel = COMPETENCY_LEVELS.find(level => level.id === currentLevelId)
      return currentLevel?.previousLevel ? COMPETENCY_LEVELS.find(level => level.id === currentLevel.previousLevel) : null
    }
  }
}

export function useToolUnlockRequirements() {
  return {
    checkToolUnlock: (competencyData: CompetencyData, toolName: keyof typeof competencyData.toolUnlockStates) => {
      return CompetencyUtils.checkToolUnlock(competencyData, toolName)
    },
    getUnlockRequirements: (toolName: string) => {
      // Return unlock requirements for specific tool
      const requirements = {
        costCalculator: {
          requirement: 'valueCommunication',
          minScore: 70,
          description: 'Requires 70+ Value Communication competency'
        },
        businessCase: {
          requirement: 'salesExecution',
          minScore: 70,
          description: 'Requires 70+ Sales Execution competency'
        },
        resources: {
          requirement: 'overall',
          minScore: 50,
          description: 'Requires 50+ overall competency'
        },
        export: {
          requirement: 'overall',
          minScore: 60,
          description: 'Requires 60+ overall competency'
        }
      }
      return requirements[toolName as keyof typeof requirements] || null
    }
  }
}