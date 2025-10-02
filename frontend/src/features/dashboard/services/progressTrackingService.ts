
import { 
  CompetencyData, 
  ProgressTrend, 
  COMPETENCY_LEVELS,
  CompetencyUtils
} from '../types/competency'

export interface ProgressAction {
  id: string
  type: 'icp_analysis' | 'cost_calculation' | 'business_case' | 'assessment' | 'export' | 'custom'
  title: string
  description: string
  category: 'customerAnalysis' | 'valueCommunication' | 'salesExecution'
  pointValue: number
  impactLevel: 'low' | 'medium' | 'high'
  completedAt: string
  userId: string
}

export interface ProgressUpdate {
  userId: string
  action: ProgressAction
  pointsAwarded: number
  competencyUpdates: {
    customerAnalysis?: number
    valueCommunication?: number
    salesExecution?: number
  }
  levelChanged: boolean
  newLevel?: string
  toolsUnlocked: string[]
  timestamp: string
}

export class ProgressTrackingService {
  private userId: string
  private competencyData: CompetencyData
  private progressHistory: ProgressTrend[]
  private updateCallbacks: Array<(update: ProgressUpdate) => void> = []

  constructor(userId: string, competencyData: CompetencyData, progressHistory: ProgressTrend[] = []) {
    this.userId = userId
    this.competencyData = competencyData
    this.progressHistory = progressHistory
  }

  async trackProgress(action: ProgressAction): Promise<ProgressUpdate> {
    // Calculate points to award
    const pointsAwarded = this.calculatePointsAwarded(action)
    
    // Update competency scores
    const competencyUpdates = this.calculateCompetencyUpdates(action, pointsAwarded)
    
    // Update competency data
    this.updateCompetencyData(competencyUpdates, pointsAwarded)
    
    // Check for level changes
    const levelChanged = this.checkLevelChange()
    const newLevel = levelChanged ? this.competencyData.currentLevel.id : undefined
    
    // Check for tool unlocks
    const toolsUnlocked = this.checkToolUnlocks()
    
    // Create progress update
    const progressUpdate: ProgressUpdate = {
      userId: this.userId,
      action,
      pointsAwarded,
      competencyUpdates,
      levelChanged,
      newLevel,
      toolsUnlocked,
      timestamp: new Date().toISOString()
    }
    
    // Add to progress history
    this.addToProgressHistory(progressUpdate)
    
    // Notify callbacks
    this.notifyCallbacks(progressUpdate)
    
    return progressUpdate
  }

  private calculatePointsAwarded(action: ProgressAction): number {
    let basePoints = action.pointValue
    
    // Apply impact level multiplier
    const impactMultipliers = {
      low: 1.0,
      medium: 1.5,
      high: 2.0
    }
    
    basePoints *= impactMultipliers[action.impactLevel]
    
    // Apply competency level bonus
    const levelBonus = this.getLevelBonus()
    basePoints *= levelBonus
    
    return Math.round(basePoints)
  }

  private calculateCompetencyUpdates(action: ProgressAction, pointsAwarded: number): {
    customerAnalysis?: number
    valueCommunication?: number
    salesExecution?: number
  } {
    const updates: {
      customerAnalysis?: number
      valueCommunication?: number
      salesExecution?: number
    } = {}
    
    // Calculate competency increase based on action category
    const competencyIncrease = Math.min(5, Math.round(pointsAwarded / 10))
    
    switch (action.category) {
      case 'customerAnalysis':
        updates.customerAnalysis = Math.min(100, this.competencyData.customerAnalysis + competencyIncrease)
        break
      case 'valueCommunication':
        updates.valueCommunication = Math.min(100, this.competencyData.valueCommunication + competencyIncrease)
        break
      case 'salesExecution':
        updates.salesExecution = Math.min(100, this.competencyData.salesExecution + competencyIncrease)
        break
    }
    
    return updates
  }

  private updateCompetencyData(updates: any, pointsAwarded: number): void {
    // Update competency scores
    if (updates.customerAnalysis !== undefined) {
      this.competencyData.customerAnalysis = updates.customerAnalysis
    }
    if (updates.valueCommunication !== undefined) {
      this.competencyData.valueCommunication = updates.valueCommunication
    }
    if (updates.salesExecution !== undefined) {
      this.competencyData.salesExecution = updates.salesExecution
    }
    
    // Update total points
    this.competencyData.totalPoints += pointsAwarded
    
    // Recalculate overall score
    this.competencyData.overallScore = CompetencyUtils.calculateOverallScore(this.competencyData)
    
    // Update current level
    this.competencyData.currentLevel = CompetencyUtils.getCurrentLevel(this.competencyData.totalPoints)
    
    // Update level progress
    this.competencyData.levelProgress = CompetencyUtils.calculateLevelProgress(
      this.competencyData.currentLevel, 
      this.competencyData.totalPoints
    )
    
    // Update last updated timestamp
    this.competencyData.lastUpdated = new Date().toISOString()
  }

  private checkLevelChange(): boolean {
    const newLevel = CompetencyUtils.getCurrentLevel(this.competencyData.totalPoints)
    return newLevel.id !== this.competencyData.currentLevel.id
  }

  private checkToolUnlocks(): string[] {
    const unlockedTools: string[] = []
    
    // Check each tool unlock requirement
    if (!this.competencyData.toolUnlockStates.costCalculatorUnlocked && 
        this.competencyData.valueCommunication >= 70) {
      this.competencyData.toolUnlockStates.costCalculatorUnlocked = true
      unlockedTools.push('costCalculator')
    }
    
    if (!this.competencyData.toolUnlockStates.businessCaseUnlocked && 
        this.competencyData.salesExecution >= 70) {
      this.competencyData.toolUnlockStates.businessCaseUnlocked = true
      unlockedTools.push('businessCase')
    }
    
    if (!this.competencyData.toolUnlockStates.resourcesUnlocked && 
        this.competencyData.overallScore >= 50) {
      this.competencyData.toolUnlockStates.resourcesUnlocked = true
      unlockedTools.push('resources')
    }
    
    if (!this.competencyData.toolUnlockStates.exportUnlocked && 
        this.competencyData.overallScore >= 60) {
      this.competencyData.toolUnlockStates.exportUnlocked = true
      unlockedTools.push('export')
    }
    
    return unlockedTools
  }

  private addToProgressHistory(update: ProgressUpdate): void {
    const progressEntry: ProgressTrend = {
      period: 'current',
      score: this.competencyData.overallScore,
      change: 0,
      velocity: { weekly: 0, monthly: 0, quarterly: 0, period: 'month', pointsGained: 0 },
      date: update.timestamp,
      customerAnalysis: this.competencyData.customerAnalysis,
      valueCommunication: this.competencyData.valueCommunication,
      salesExecution: this.competencyData.salesExecution,
      overallScore: this.competencyData.overallScore,
      points: this.competencyData.totalPoints
    }
    
    this.progressHistory.push(progressEntry)
    
    // Keep only last 365 days of history
    if (this.progressHistory.length > 365) {
      this.progressHistory = this.progressHistory.slice(-365)
    }
  }

  private getLevelBonus(): number {
    const levelIndex = COMPETENCY_LEVELS.findIndex(level => level.id === this.competencyData.currentLevel.id)
    return 1 + (levelIndex * 0.1) // 10% bonus per level
  }

  subscribe(callback: (update: ProgressUpdate) => void): () => void {
    this.updateCallbacks.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = this.updateCallbacks.indexOf(callback)
      if (index > -1) {
        this.updateCallbacks.splice(index, 1)
      }
    }
  }

  private notifyCallbacks(update: ProgressUpdate): void {
    this.updateCallbacks.forEach(callback => {
      try {
        callback(update)
      } catch (error) {
        console.error('Error in progress update callback:', error)
      }
    })
  }

  getCompetencyData(): CompetencyData {
    return { ...this.competencyData }
  }

  getProgressHistory(): ProgressTrend[] {
    return [...this.progressHistory]
  }

  getProgressSummary(days: number = 30): {
    pointsGained: number
    levelAdvancements: number
    toolsUnlocked: number
    competencyImprovements: {
      customerAnalysis: number
      valueCommunication: number
      salesExecution: number
    }
  } {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    const recentHistory = this.progressHistory.filter(entry => 
      new Date(entry.date) >= cutoffDate
    )
    
    if (recentHistory.length === 0) {
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
    
    const firstEntry = recentHistory[0]
    const lastEntry = recentHistory[recentHistory.length - 1]
    
    return {
      pointsGained: lastEntry.points - firstEntry.points,
      levelAdvancements: 0, // TODO: Calculate from level history
      toolsUnlocked: 0, // TODO: Calculate from tool unlock history
      competencyImprovements: {
        customerAnalysis: lastEntry.customerAnalysis - firstEntry.customerAnalysis,
        valueCommunication: lastEntry.valueCommunication - firstEntry.valueCommunication,
        salesExecution: lastEntry.salesExecution - firstEntry.salesExecution
      }
    }
  }
}

export const PROGRESS_ACTIONS = {
  ICP_ANALYSIS: {
    id: 'icp-analysis',
    type: 'icp_analysis' as const,
    title: 'ICP Analysis Completed',
    description: 'Completed comprehensive ICP analysis',
    category: 'customerAnalysis' as const,
    pointValue: 25,
    impactLevel: 'medium' as const
  },
  
  COST_CALCULATION: {
    id: 'cost-calculation',
    type: 'cost_calculation' as const,
    title: 'Cost Calculation Completed',
    description: 'Completed cost impact calculation',
    category: 'valueCommunication' as const,
    pointValue: 30,
    impactLevel: 'high' as const
  },
  
  BUSINESS_CASE: {
    id: 'business-case',
    type: 'business_case' as const,
    title: 'Business Case Completed',
    description: 'Completed business case development',
    category: 'salesExecution' as const,
    pointValue: 35,
    impactLevel: 'high' as const
  },
  
  ASSESSMENT: {
    id: 'assessment',
    type: 'assessment' as const,
    title: 'Assessment Completed',
    description: 'Completed competency assessment',
    category: 'customerAnalysis' as const,
    pointValue: 20,
    impactLevel: 'medium' as const
  },
  
  EXPORT: {
    id: 'export',
    type: 'export' as const,
    title: 'Export Completed',
    description: 'Exported analysis or report',
    category: 'valueCommunication' as const,
    pointValue: 15,
    impactLevel: 'low' as const
  }
}

export class ProgressUtils {
  
  static createCustomAction(
    id: string,
    title: string,
    description: string,
    category: 'customerAnalysis' | 'valueCommunication' | 'salesExecution',
    pointValue: number,
    impactLevel: 'low' | 'medium' | 'high' = 'medium'
  ): ProgressAction {
    return {
      id,
      type: 'custom',
      title,
      description,
      category,
      pointValue,
      impactLevel,
      completedAt: new Date().toISOString(),
      userId: '' // Will be set by the service
    }
  }

  static estimateTimeToNextLevel(
    currentLevel: typeof COMPETENCY_LEVELS[0],
    totalPoints: number,
    averagePointsPerDay: number
  ): number {
    const nextLevel = COMPETENCY_LEVELS.find(level => level.id === currentLevel.nextLevel)
    if (!nextLevel) return 0 // Max level reached
    
    const pointsNeeded = nextLevel.points - totalPoints
    return Math.ceil(pointsNeeded / averagePointsPerDay)
  }

  static calculateProgressStreak(progressHistory: ProgressTrend[]): number {
    if (progressHistory.length === 0) return 0
    
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = progressHistory.length - 1; i >= 0; i--) {
      const entryDate = new Date(progressHistory[i].date)
      entryDate.setHours(0, 0, 0, 0)
      
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === streak) {
        streak++
        today.setDate(today.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }
}
