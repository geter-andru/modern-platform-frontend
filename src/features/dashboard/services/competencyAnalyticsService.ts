
import { 
  CompetencyData, 
  CompetencyAnalytics, 
  ProgressTrend, 
  CompetencyGrowth, 
  PerformanceMetric, 
  SkillGap, 
  DevelopmentRecommendation,
  PeerComparison,
  IndustryBenchmark,
  ProgressVelocity,
  COMPETENCY_LEVELS
} from '../types/competency'

export class CompetencyAnalyticsService {
  private userId: string
  private competencyData: CompetencyData
  private progressHistory: ProgressTrend[]

  constructor(userId: string, competencyData: CompetencyData, progressHistory: ProgressTrend[] = []) {
    this.userId = userId
    this.competencyData = competencyData
    this.progressHistory = progressHistory
  }

  async calculateAnalytics(): Promise<CompetencyAnalytics> {
    const progressTrends = this.calculateProgressTrends()
    const competencyGrowth = this.calculateCompetencyGrowth()
    const performanceMetrics = this.calculatePerformanceMetrics()
    const skillGaps = this.identifySkillGaps()
    const developmentRecommendations = this.generateDevelopmentRecommendations()
    const peerComparison = await this.calculatePeerComparison()
    const industryBenchmarks = await this.calculateIndustryBenchmarks()
    const progressVelocity = this.calculateProgressVelocity()

    return {
      overallScore: this.competencyData.overallScore,
      categoryScores: {
        customerAnalysis: this.competencyData.customerAnalysis,
        valueCommunication: this.competencyData.valueCommunication,
        salesExecution: this.competencyData.salesExecution
      },
      progressTrend: progressTrends[0] || {
        period: 'current',
        score: this.competencyData.overallScore,
        change: 0,
        velocity: { weekly: 0, monthly: 0, quarterly: 0, period: 'month', pointsGained: 0 },
        date: new Date().toISOString(),
        customerAnalysis: this.competencyData.customerAnalysis,
        valueCommunication: this.competencyData.valueCommunication,
        salesExecution: this.competencyData.salesExecution,
        overallScore: this.competencyData.overallScore,
        points: this.competencyData.totalPoints
      },
      progressTrends,
      competencyGrowth,
      milestoneAchievements: [], // Will be populated by milestone service
      performanceMetrics,
      skillGaps,
      recommendations: developmentRecommendations,
      peerComparison,
      industryBenchmark: industryBenchmarks,
      progressVelocity: { velocity: progressVelocity.monthly },
      lastUpdated: new Date().toISOString(),
      analyticsPeriod: 'month'
    }
  }

  private calculateProgressTrends(): ProgressTrend[] {
    if (this.progressHistory.length === 0) {
      return [{
        period: 'current',
        score: this.competencyData.overallScore,
        change: 0,
        velocity: { weekly: 0, monthly: 0, quarterly: 0, period: 'month', pointsGained: 0 },
        date: new Date().toISOString(),
        customerAnalysis: this.competencyData.customerAnalysis,
        valueCommunication: this.competencyData.valueCommunication,
        salesExecution: this.competencyData.salesExecution,
        overallScore: this.competencyData.overallScore,
        points: this.competencyData.totalPoints
      }]
    }

    return this.progressHistory
  }

  private calculateCompetencyGrowth(): CompetencyGrowth[] {
    const categories: Array<'customerAnalysis' | 'valueCommunication' | 'salesExecution'> = [
      'customerAnalysis', 'valueCommunication', 'salesExecution'
    ]

    return categories.map(category => {
      const currentScore = this.competencyData[category]
      const baselineScore = this.competencyData.baselineScores[category]
      const growth = currentScore - baselineScore
      const growthPercentage = baselineScore > 0 ? (growth / baselineScore) * 100 : 0
      
      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable'
      if (growth > 5) trend = 'increasing'
      else if (growth < -5) trend = 'decreasing'

      return {
        period: 'current',
        growth,
        milestones: [],
        category,
        currentScore,
        baselineScore,
        growthPercentage,
        trend
      }
    })
  }

  private calculatePerformanceMetrics(): PerformanceMetric[] {
    const metrics: PerformanceMetric[] = []

    // Overall competency score
    metrics.push({
      name: 'Overall Competency Score',
      target: 100,
      metric: 'Overall Competency Score',
      value: this.competencyData.overallScore,
      unit: 'points',
      trend: this.calculateTrend(),
      change: this.calculateChange(),
      period: 'month'
    })

    // Total points
    metrics.push({
      name: 'Total Progress Points',
      target: 750,
      metric: 'Total Progress Points',
      value: this.competencyData.totalPoints,
      unit: 'points',
      trend: this.calculateTrend(),
      change: this.calculateChange(),
      period: 'month'
    })

    // Level progress
    metrics.push({
      name: 'Level Progress',
      target: 100,
      metric: 'Level Progress',
      value: this.competencyData.levelProgress,
      unit: '%',
      trend: this.calculateTrend(),
      change: this.calculateChange(),
      period: 'month'
    })

    return metrics
  }

  private identifySkillGaps(): SkillGap[] {
    const gaps: SkillGap[] = []
    const categories: Array<'customerAnalysis' | 'valueCommunication' | 'salesExecution'> = [
      'customerAnalysis', 'valueCommunication', 'salesExecution'
    ]

    categories.forEach(category => {
      const currentLevel = this.competencyData[category]
      const targetLevel = 80 // Target competency level
      const gap = targetLevel - currentLevel

      if (gap > 10) {
        let priority: 'high' | 'medium' | 'low' = 'low'
        if (gap > 30) priority = 'high'
        else if (gap > 20) priority = 'medium'

        gaps.push({
          skill: this.getSkillName(category),
          currentLevel,
          targetLevel,
          gap,
          priority,
          recommendations: this.getSkillRecommendations(category)
        })
      }
    })

    return gaps
  }

  private generateDevelopmentRecommendations(): DevelopmentRecommendation[] {
    const recommendations: DevelopmentRecommendation[] = []

    // Analyze competency gaps and generate recommendations
    const skillGaps = this.identifySkillGaps()
    
    skillGaps.forEach(gap => {
      if (gap.priority === 'high') {
        recommendations.push({
          type: 'course',
          id: `improve-${gap.skill.toLowerCase().replace(/\s+/g, '-')}`,
          title: `Improve ${gap.skill} Skills`,
          description: `Focus on developing ${gap.skill} competencies to reach target level`,
          category: 'competency',
          priority: 'high',
          estimatedTime: '2-4 weeks',
          resources: this.getSkillResources(gap.skill),
          prerequisites: []
        })
      }
    })

    // Add tool-specific recommendations
    if (!this.competencyData.toolUnlockStates.costCalculatorUnlocked) {
      recommendations.push({
        type: 'practice',
        id: 'unlock-cost-calculator',
        title: 'Unlock Cost Calculator Tool',
        description: 'Improve Value Communication skills to unlock the Cost Calculator',
        category: 'tool',
        priority: 'medium',
        estimatedTime: '1-2 weeks',
        resources: ['Value Communication Assessment', 'ROI Communication Guide'],
        prerequisites: ['70+ Value Communication competency']
      })
    }

    if (!this.competencyData.toolUnlockStates.businessCaseUnlocked) {
      recommendations.push({
        type: 'practice',
        id: 'unlock-business-case',
        title: 'Unlock Business Case Builder',
        description: 'Improve Sales Execution skills to unlock the Business Case Builder',
        category: 'tool',
        priority: 'medium',
        estimatedTime: '1-2 weeks',
        resources: ['Sales Execution Assessment', 'Business Case Guide'],
        prerequisites: ['70+ Sales Execution competency']
      })
    }

    return recommendations
  }

  private async calculatePeerComparison(): Promise<PeerComparison> {
    // TODO: Implement real peer comparison with Supabase
    return {
      userScore: this.competencyData.overallScore,
      peerAverage: 65, // Placeholder
      percentile: 75, // Placeholder
      averageScore: 65, // Placeholder
      topPerformers: 90 // Placeholder
    }
  }

  private async calculateIndustryBenchmarks(): Promise<IndustryBenchmark> {
    // TODO: Implement real industry benchmarks
    return {
      industry: 'Technology Sales',
      averageScore: 55,
      topQuartile: 85,
      position: 65,
      metric: 'Overall Competency Score',
      userValue: this.competencyData.overallScore
    }
  }

  private calculateProgressVelocity(): ProgressVelocity {
    if (this.progressHistory.length < 2) {
      return {
        weekly: 0,
        monthly: 0,
        quarterly: 0,
        period: 'month',
        pointsGained: 0
      }
    }

    const recent = this.progressHistory.slice(-30) // Last 30 days
    const older = this.progressHistory.slice(-60, -30) // Previous 30 days

    const recentPoints = recent[recent.length - 1]?.points || 0
    const olderPoints = older[older.length - 1]?.points || 0
    const pointsGained = recentPoints - olderPoints

    // let trend: 'accelerating' | 'decelerating' | 'stable' = 'stable'
    // if (pointsGained > 50) trend = 'accelerating'
    // else if (pointsGained < -20) trend = 'decelerating'

    return {
      weekly: pointsGained / 4, // Approximate weekly points
      monthly: pointsGained,
      quarterly: pointsGained * 3, // Approximate quarterly points
      period: 'month',
      pointsGained
    }
  }

  private calculateTrend(): 'up' | 'down' | 'stable' {
    // TODO: Implement real trend calculation based on historical data
    return 'up'
  }

  private calculateChange(): number {
    // TODO: Implement real change calculation based on historical data
    return 5
  }

  private getSkillName(category: string): string {
    const names: Record<string, string> = {
      customerAnalysis: 'Customer Analysis',
      valueCommunication: 'Value Communication',
      salesExecution: 'Sales Execution'
    }
    return names[category] || category
  }

  private getSkillRecommendations(category: string): string[] {
    const recommendations: Record<string, string[]> = {
      customerAnalysis: [
        'Complete more ICP analyses',
        'Study customer research methodologies',
        'Practice prospect qualification techniques'
      ],
      valueCommunication: [
        'Focus on ROI communication',
        'Practice value proposition development',
        'Study stakeholder communication strategies'
      ],
      salesExecution: [
        'Practice objection handling',
        'Study closing techniques',
        'Develop negotiation skills'
      ]
    }
    return recommendations[category] || []
  }

  private getSkillResources(skill: string): string[] {
    const resources: Record<string, string[]> = {
      'Customer Analysis': [
        'ICP Analysis Guide',
        'Prospect Qualification Framework',
        'Customer Research Methodology'
      ],
      'Value Communication': [
        'ROI Communication Guide',
        'Value Proposition Template',
        'Stakeholder Communication Best Practices'
      ],
      'Sales Execution': [
        'Objection Handling Playbook',
        'Closing Techniques Guide',
        'Negotiation Strategies'
      ]
    }
    return resources[skill] || []
  }
}

export class CompetencyUtils {
  
  static calculateOverallScore(competencyData: CompetencyData): number {
    return Math.round(
      (competencyData.customerAnalysis + 
       competencyData.valueCommunication + 
       competencyData.salesExecution) / 3
    )
  }

  static getCurrentLevel(totalPoints: number): typeof COMPETENCY_LEVELS[0] {
    for (let i = COMPETENCY_LEVELS.length - 1; i >= 0; i--) {
      if (totalPoints >= COMPETENCY_LEVELS[i].points) {
        return COMPETENCY_LEVELS[i] as typeof COMPETENCY_LEVELS[0]
      }
    }
    return COMPETENCY_LEVELS[0] as typeof COMPETENCY_LEVELS[0]
  }

  static calculateLevelProgress(currentLevel: typeof COMPETENCY_LEVELS[0], totalPoints: number): number {
    const nextLevel = COMPETENCY_LEVELS.find(level => level.id === currentLevel.nextLevel)
    if (!nextLevel) return 100 // Max level reached

    const currentLevelPoints = currentLevel.points
    const nextLevelPoints = nextLevel.points
    const progress = ((totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100
    
    return Math.min(100, Math.max(0, progress))
  }

  static checkToolUnlock(competencyData: CompetencyData, toolName: keyof typeof competencyData.toolUnlockStates): boolean {
    const requirements = {
      icpUnlocked: true, // Always unlocked
      costCalculatorUnlocked: competencyData.valueCommunication >= 70,
      businessCaseUnlocked: competencyData.salesExecution >= 70,
      resourcesUnlocked: competencyData.overallScore >= 50,
      exportUnlocked: competencyData.overallScore >= 60
    }

    return requirements[toolName] || false
  }
}
