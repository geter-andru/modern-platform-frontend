

import { createClient, RealtimeChannel } from '@supabase/supabase-js'
import { 
  CompetencyData, 
  CompetencyUpdate, 
  ProgressUpdate,
  MilestoneAchievement 
} from '../types/competency'

export interface SupabaseRealtimeConfig {
  url: string
  anonKey: string
  userId: string
}

export interface RealtimeEventHandler {
  (data: Record<string, any>): void
}

export class SupabaseRealtimeService {
  private supabase: ReturnType<typeof createClient>
  private userId: string
  private channels: Map<string, RealtimeChannel> = new Map()
  private eventHandlers: Map<string, RealtimeEventHandler[]> = new Map()

  constructor(config: SupabaseRealtimeConfig) {
    this.supabase = createClient(config.url, config.anonKey)
    this.userId = config.userId
  }

  async initialize(): Promise<void> {
    try {
      // Subscribe to competency data updates
      await this.subscribeToCompetencyUpdates()
      
      // Subscribe to progress tracking updates
      await this.subscribeToProgressUpdates()
      
      // Subscribe to milestone achievements
      await this.subscribeToMilestoneUpdates()
      
      // Subscribe to tool unlock notifications
      await this.subscribeToToolUnlocks()
      
      console.log('Supabase Realtime initialized successfully')
    } catch (error) {
      console.error('Error initializing Supabase Realtime:', error)
      throw error
    }
  }

  private async subscribeToCompetencyUpdates(): Promise<void> {
    const channel = this.supabase
      .channel(`competency-updates-${this.userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'competency_data',
          filter: `user_id=eq.${this.userId}`
        },
        (payload: Record<string, any>) => {
          console.log('Competency update received:', payload)
          
          const update: CompetencyUpdate = {
            type: 'level_up',
            userId: this.userId,
            category: 'overallScore',
            newScore: payload.new?.overallScore || 0,
            source: 'realtime',
            timestamp: new Date().toISOString()
          }
          
          this.emit('competency_update', update)
        }
      )
      .subscribe()

    this.channels.set('competency-updates', channel)
  }

  private async subscribeToProgressUpdates(): Promise<void> {
    const channel = this.supabase
      .channel(`progress-updates-${this.userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'progress_tracking',
          filter: `user_id=eq.${this.userId}`
        },
        (payload: Record<string, any>) => {
          console.log('Progress update received:', payload)
          
          const update: ProgressUpdate = {
            userId: this.userId,
            action: payload.new.action_type,
            points: payload.new.points_awarded,
            category: payload.new.category,
            timestamp: payload.new.created_at,
            competencyData: {
              customerAnalysis: payload.new.customer_analysis_score,
              valueCommunication: payload.new.value_communication_score,
              salesExecution: payload.new.sales_execution_score,
              overallScore: payload.new.overall_score,
              totalPoints: payload.new.total_points,
              currentLevel: { id: 'foundation', name: 'Foundation', points: 0, nextLevel: 'developing', previousLevel: null, color: 'gray' },
              levelProgress: 0,
              lastUpdated: new Date().toISOString(),
              baselineScores: {
                customerAnalysis: 0,
                valueCommunication: 0,
                salesExecution: 0
              },
              levelHistory: [],
              toolUnlockStates: {
                icpUnlocked: true,
                costCalculatorUnlocked: false,
                businessCaseUnlocked: false,
                resourcesUnlocked: false,
                exportUnlocked: false
              }
            },
            data: {
              customerAnalysis: payload.new.customer_analysis_score,
              valueCommunication: payload.new.value_communication_score,
              salesExecution: payload.new.sales_execution_score,
              overallScore: payload.new.overall_score,
              totalPoints: payload.new.total_points,
              currentLevel: { id: 'foundation', name: 'Foundation', points: 0, nextLevel: 'developing', previousLevel: null, color: 'gray' },
              levelProgress: 0,
              lastUpdated: new Date().toISOString(),
              baselineScores: {
                customerAnalysis: 0,
                valueCommunication: 0,
                salesExecution: 0
              },
              levelHistory: [],
              toolUnlockStates: {
                icpUnlocked: true,
                costCalculatorUnlocked: false,
                businessCaseUnlocked: false,
                resourcesUnlocked: false,
                exportUnlocked: false
              }
            }
          }
          
          this.emit('progress_update', update)
        }
      )
      .subscribe()

    this.channels.set('progress-updates', channel)
  }

  private async subscribeToMilestoneUpdates(): Promise<void> {
    const channel = this.supabase
      .channel(`milestone-updates-${this.userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'milestone_achievements',
          filter: `user_id=eq.${this.userId}`
        },
        (payload: Record<string, any>) => {
          console.log('Milestone achievement received:', payload)
          
          const achievement: MilestoneAchievement = {
            id: payload.new.id,
            title: payload.new.title,
            description: payload.new.description,
            category: payload.new.category,
            points: payload.new.points,
            milestone: payload.new.milestone_name || 'Unknown Milestone',
            achievedAt: payload.new.achieved_at,
          }
          
          this.emit('milestone_achieved', {
            milestoneId: achievement.id,
            title: achievement.title,
            points: achievement.points
          })
        }
      )
      .subscribe()

    this.channels.set('milestone-updates', channel)
  }

  private async subscribeToToolUnlocks(): Promise<void> {
    const channel = this.supabase
      .channel(`tool-unlocks-${this.userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'competency_data',
          filter: `user_id=eq.${this.userId}`
        },
        (payload: Record<string, any>) => {
          // Check for tool unlocks by comparing old and new values
          const oldData = payload.old
          const newData = payload.new
          
          const unlockedTools: string[] = []
          
          // Check each tool unlock condition
          if (!oldData.cost_calculator_unlocked && newData.cost_calculator_unlocked) {
            unlockedTools.push('costCalculator')
          }
          if (!oldData.business_case_unlocked && newData.business_case_unlocked) {
            unlockedTools.push('businessCase')
          }
          if (!oldData.resources_unlocked && newData.resources_unlocked) {
            unlockedTools.push('resources')
          }
          if (!oldData.export_unlocked && newData.export_unlocked) {
            unlockedTools.push('export')
          }
          
          // Emit tool unlock notifications
          unlockedTools.forEach(toolName => {
            this.emit('tool_unlock', {
              toolName,
              unlockedAt: new Date().toISOString()
            })
          })
        }
      )
      .subscribe()

    this.channels.set('tool-unlocks', channel)
  }

  subscribe(eventType: string, handler: RealtimeEventHandler): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }
    
    this.eventHandlers.get(eventType)!.push(handler)
    
    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(eventType)
      if (handlers) {
        const index = handlers.indexOf(handler)
        if (index > -1) {
          handlers.splice(index, 1)
        }
      }
    }
  }

  private emit(eventType: string, data: Record<string, any>): void {
    const handlers = this.eventHandlers.get(eventType)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error('Error in realtime event handler:', error)
        }
      })
    }
  }

  async sendProgressUpdate(update: ProgressUpdate): Promise<void> {
    try {
      const { error } = await (this.supabase as any)
        .from('progress_tracking')
        .insert({
          user_id: this.userId,
          action_type: update.action,
          points_awarded: update.points,
          category: update.category,
          customer_analysis_score: update.data?.customerAnalysis,
          value_communication_score: update.data?.valueCommunication,
          sales_execution_score: update.data?.salesExecution,
          overall_score: update.data?.overallScore,
          total_points: update.data?.totalPoints,
          created_at: update.timestamp
        })

      if (error) {
        console.error('Error sending progress update:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in sendProgressUpdate:', error)
      throw error
    }
  }

  async updateCompetencyData(competencyData: CompetencyData): Promise<void> {
    try {
      const { error } = await (this.supabase as any)
        .from('competency_data')
        .upsert({
          user_id: this.userId,
          customer_analysis: competencyData.customerAnalysis,
          value_communication: competencyData.valueCommunication,
          sales_execution: competencyData.salesExecution,
          overall_score: competencyData.overallScore,
          total_points: competencyData.totalPoints,
          current_level: competencyData.currentLevel.id,
          level_progress: competencyData.levelProgress,
          cost_calculator_unlocked: competencyData.toolUnlockStates.costCalculatorUnlocked,
          business_case_unlocked: competencyData.toolUnlockStates.businessCaseUnlocked,
          resources_unlocked: competencyData.toolUnlockStates.resourcesUnlocked,
          export_unlocked: competencyData.toolUnlockStates.exportUnlocked,
          last_updated: competencyData.lastUpdated
        })

      if (error) {
        console.error('Error updating competency data:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in updateCompetencyData:', error)
      throw error
    }
  }

  async getCompetencyData(): Promise<CompetencyData | null> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('competency_data')
        .select('*')
        .eq('user_id', this.userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, return null
          return null
        }
        console.error('Error getting competency data:', error)
        throw error
      }

      // Transform database data to CompetencyData format
      return {
        customerAnalysis: (data as any).customer_analysis,
        valueCommunication: (data as any).value_communication,
        salesExecution: (data as any).sales_execution,
        overallScore: (data as any).overall_score,
        currentLevel: this.getLevelById((data as any).current_level),
        totalPoints: (data as any).total_points,
        levelProgress: (data as any).level_progress,
        baselineScores: {
          customerAnalysis: (data as any).baseline_customer_analysis || (data as any).customer_analysis,
          valueCommunication: (data as any).baseline_value_communication || (data as any).value_communication,
          salesExecution: (data as any).baseline_sales_execution || (data as any).sales_execution
        },
        levelHistory: (data as any).level_history || [],
        lastUpdated: (data as any).last_updated,
        toolUnlockStates: {
          icpUnlocked: true, // Always unlocked
          costCalculatorUnlocked: (data as any).cost_calculator_unlocked,
          businessCaseUnlocked: (data as any).business_case_unlocked,
          resourcesUnlocked: (data as any).resources_unlocked,
          exportUnlocked: (data as any).export_unlocked
        }
      }
    } catch (error) {
      console.error('Error in getCompetencyData:', error)
      throw error
    }
  }

  async getProgressHistory(limit: number = 100): Promise<any[]> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('progress_tracking')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error getting progress history:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error in getProgressHistory:', error)
      throw error
    }
  }

  private getLevelById(levelId: string): any {
    const levels = [
      { id: 'foundation', name: 'Foundation Level', points: 0, color: '#6B7280' },
      { id: 'developing', name: 'Developing Level', points: 200, color: '#3B82F6' },
      { id: 'intermediate', name: 'Intermediate Level', points: 400, color: '#10B981' },
      { id: 'advanced', name: 'Advanced Level', points: 600, color: '#F59E0B' },
      { id: 'expert', name: 'Expert Level', points: 800, color: '#EF4444' },
      { id: 'master', name: 'Master Level', points: 1000, color: '#8B5CF6' }
    ]
    
    return levels.find(level => level.id === levelId) || levels[0]
  }

  disconnect(): void {
    this.channels.forEach((channel, name) => {
      this.supabase.removeChannel(channel)
      console.log(`Disconnected channel: ${name}`)
    })
    this.channels.clear()
    this.eventHandlers.clear()
  }

  isConnected(): boolean {
    return this.channels.size > 0
  }
}

export function useSupabaseRealtime(userId: string) {
  const [realtimeService] = useState(() => {
    const config = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      userId
    }
    return new SupabaseRealtimeService(config)
  })

  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<any>(null)

  useEffect(() => {
    // Initialize realtime service
    realtimeService.initialize().then(() => {
      setIsConnected(true)
    }).catch(error => {
      console.error('Failed to initialize realtime service:', error)
      setIsConnected(false)
    })

    // Subscribe to all updates
    const unsubscribeUpdates = realtimeService.subscribe('*', (data) => {
      setLastUpdate(data)
    })

    // Cleanup on unmount
    return () => {
      unsubscribeUpdates()
      realtimeService.disconnect()
    }
  }, [realtimeService])

  return {
    realtimeService,
    isConnected,
    lastUpdate,
    connect: () => realtimeService.initialize(),
    disconnect: () => realtimeService.disconnect()
  }
}

// Import useState and useEffect for the hook
import { useState, useEffect } from 'react'
