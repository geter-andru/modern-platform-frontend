
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'

// Surgical type definitions based on actual usage in this file
interface CompetencyData {
  customer_analysis: number;
  value_communication: number;
  sales_execution: number;
  overall_score: number;
  total_points: number;
  current_level: string;
  level_progress: number;
  baseline_customer_analysis?: number;
  baseline_value_communication?: number;
  baseline_sales_execution?: number;
}

interface ProgressHistoryItem {
  created_at: string;
  points_awarded: number;
  category?: string;
}

interface MilestoneItem {
  id: string;
  title: string;
  description: string;
  points: number;
  achieved_at?: string;
}

interface ActionItem {
  id: string;
  verified: boolean;
  points: number;
  points_awarded: number;
  category: string;
}

interface SkillGap {
  skill: string;
  currentScore: number;
  targetScore: number;
  gap: number;
  priority: 'low' | 'medium' | 'high';
}

interface Recommendation {
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  estimatedTime: string;
  targetScore?: number;
  currentCount?: number;
  currentScore?: number;
  targetCount?: number;
  actions?: string[];
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Get user from request headers
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // week, month, quarter, year
    const includePeerComparison = searchParams.get('includePeerComparison') === 'true'
    const includeIndustryBenchmarks = searchParams.get('includeIndustryBenchmarks') === 'true'

    // Validate period
    if (!['week', 'month', 'quarter', 'year'].includes(period)) {
      return NextResponse.json({ error: 'Invalid period. Must be: week, month, quarter, or year' }, { status: 400 })
    }

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (period) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(endDate.getMonth() - 3)
        break
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
    }

    // Get current competency data
    const { data: competencyData, error: competencyError } = await supabase
      .from('competency_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (competencyError) {
      console.error('Error fetching competency data:', competencyError)
      return NextResponse.json({ error: 'Failed to fetch competency data' }, { status: 500 })
    }

    // Get progress history for the period
    const { data: progressHistory, error: progressError } = await supabase
      .from('progress_tracking')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true })

    if (progressError) {
      console.error('Error fetching progress history:', progressError)
      return NextResponse.json({ error: 'Failed to fetch progress history' }, { status: 500 })
    }

    // Get milestone achievements
    const { data: milestones, error: milestoneError } = await supabase
      .from('milestone_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achieved', true)
      .order('achieved_at', { ascending: false })

    if (milestoneError) {
      console.error('Error fetching milestones:', milestoneError)
      return NextResponse.json({ error: 'Failed to fetch milestones' }, { status: 500 })
    }

    // Get real-world actions
    const { data: actions, error: actionsError } = await supabase
      .from('customer_actions')
      .select('*')
      .eq('customer_id', userId)
      .gte('action_date', startDate.toISOString())
      .lte('action_date', endDate.toISOString())
      .order('action_date', { ascending: true })

    if (actionsError) {
      console.error('Error fetching actions:', actionsError)
      return NextResponse.json({ error: 'Failed to fetch actions' }, { status: 500 })
    }

    // Calculate analytics
    const analytics = calculateAnalytics(
      competencyData,
      progressHistory || [],
      milestones || [],
      actions || [],
      period,
      startDate,
      endDate
    )

    // Add peer comparison if requested
    if (includePeerComparison) {
      (analytics as any).peerComparison = await getPeerComparison(userId, competencyData)
    }

    // Add industry benchmarks if requested
    if (includeIndustryBenchmarks) {
      (analytics as any).industryBenchmarks = getIndustryBenchmarks(competencyData)
    }

    // Store analytics in database for future reference
    await storeAnalytics(userId, period, analytics)

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Unexpected error in GET /api/competency/analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calculateAnalytics(
  competencyData: CompetencyData,
  progressHistory: ProgressHistoryItem[],
  milestones: MilestoneItem[],
  actions: ActionItem[],
  period: string,
  startDate: Date,
  endDate: Date
) {
  // Progress trends
  const progressTrends = calculateProgressTrends(progressHistory, period)
  
  // Competency growth
  const competencyGrowth = calculateCompetencyGrowth(competencyData, progressHistory)
  
  // Performance metrics
  const performanceMetrics = calculatePerformanceMetrics(progressHistory, actions, period)
  
  // Skill gaps
  const skillGaps = calculateSkillGaps(competencyData)
  
  // Development recommendations
  const developmentRecommendations = generateDevelopmentRecommendations(
    competencyData,
    skillGaps,
    progressHistory
  )

  // Progress velocity
  const progressVelocity = calculateProgressVelocity(progressHistory, period)

  return {
    period,
    dateRange: {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    },
    currentCompetency: {
      customerAnalysis: competencyData.customer_analysis,
      valueCommunication: competencyData.value_communication,
      salesExecution: competencyData.sales_execution,
      overallScore: competencyData.overall_score,
      totalPoints: competencyData.total_points,
      currentLevel: competencyData.current_level,
      levelProgress: competencyData.level_progress
    },
    progressTrends,
    competencyGrowth,
    performanceMetrics,
    skillGaps,
    developmentRecommendations,
    progressVelocity,
    milestones: {
      total: milestones.length,
      recent: milestones.slice(0, 5),
      pointsEarned: milestones.reduce((sum, m) => sum + m.points, 0)
    },
    actions: {
      total: actions.length,
      verified: actions.filter(a => a.verified).length,
      totalPoints: actions.reduce((sum, a) => sum + a.points_awarded, 0),
      categoryBreakdown: {
        customerAnalysis: actions.filter(a => a.category === 'customerAnalysis').length,
        valueCommunication: actions.filter(a => a.category === 'valueCommunication').length,
        salesExecution: actions.filter(a => a.category === 'salesExecution').length
      }
    }
  }
}

function calculateProgressTrends(progressHistory: ProgressHistoryItem[], period: string) {
  const trends = {
    daily: [] as Array<{ date: string; points: number; actions: number }>,
    weekly: [] as Array<{ week: string; points: number; actions: number }>,
    monthly: [] as Array<{ month: string; points: number; actions: number }>
  }

  // Group progress by time periods
  const groupedProgress = progressHistory.reduce((acc, item) => {
    const date = new Date(item.created_at)
    const dayKey = date.toISOString().split('T')[0]
    const weekKey = getWeekKey(date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!acc.daily[dayKey]) acc.daily[dayKey] = { points: 0, actions: 0 }
    if (!acc.weekly[weekKey]) acc.weekly[weekKey] = { points: 0, actions: 0 }
    if (!acc.monthly[monthKey]) acc.monthly[monthKey] = { points: 0, actions: 0 }

    acc.daily[dayKey].points += item.points_awarded
    acc.daily[dayKey].actions += 1
    acc.weekly[weekKey].points += item.points_awarded
    acc.weekly[weekKey].actions += 1
    acc.monthly[monthKey].points += item.points_awarded
    acc.monthly[monthKey].actions += 1

    return acc
  }, { 
    daily: {} as Record<string, { points: number; actions: number }>, 
    weekly: {} as Record<string, { points: number; actions: number }>, 
    monthly: {} as Record<string, { points: number; actions: number }> 
  })

  // Convert to arrays
  trends.daily = Object.entries(groupedProgress.daily).map(([date, data]: [string, any]) => ({
    date,
    points: data.points,
    actions: data.actions
  })).sort((a, b) => a.date.localeCompare(b.date))

  trends.weekly = Object.entries(groupedProgress.weekly).map(([week, data]: [string, any]) => ({
    week,
    points: data.points,
    actions: data.actions
  })).sort((a, b) => a.week.localeCompare(b.week))

  trends.monthly = Object.entries(groupedProgress.monthly).map(([month, data]: [string, any]) => ({
    month,
    points: data.points,
    actions: data.actions
  })).sort((a, b) => a.month.localeCompare(b.month))

  return trends
}

function calculateCompetencyGrowth(competencyData: CompetencyData, progressHistory: ProgressHistoryItem[]) {
  const baseline = {
    customerAnalysis: competencyData.baseline_customer_analysis || 0,
    valueCommunication: competencyData.baseline_value_communication || 0,
    salesExecution: competencyData.baseline_sales_execution || 0
  }

  const current = {
    customerAnalysis: competencyData.customer_analysis,
    valueCommunication: competencyData.value_communication,
    salesExecution: competencyData.sales_execution
  }

  return {
    customerAnalysis: {
      baseline: baseline.customerAnalysis,
      current: current.customerAnalysis,
      growth: current.customerAnalysis - baseline.customerAnalysis,
      growthPercentage: baseline.customerAnalysis > 0 
        ? Math.round(((current.customerAnalysis - baseline.customerAnalysis) / baseline.customerAnalysis) * 100)
        : 0
    },
    valueCommunication: {
      baseline: baseline.valueCommunication,
      current: current.valueCommunication,
      growth: current.valueCommunication - baseline.valueCommunication,
      growthPercentage: baseline.valueCommunication > 0 
        ? Math.round(((current.valueCommunication - baseline.valueCommunication) / baseline.valueCommunication) * 100)
        : 0
    },
    salesExecution: {
      baseline: baseline.salesExecution,
      current: current.salesExecution,
      growth: current.salesExecution - baseline.salesExecution,
      growthPercentage: baseline.salesExecution > 0 
        ? Math.round(((current.salesExecution - baseline.salesExecution) / baseline.salesExecution) * 100)
        : 0
    }
  }
}

function calculatePerformanceMetrics(progressHistory: ProgressHistoryItem[], actions: ActionItem[], period: string) {
  const totalActions = progressHistory.length
  const totalPoints = progressHistory.reduce((sum, item) => sum + item.points_awarded, 0)
  const verifiedActions = actions.filter(a => a.verified).length
  const totalActionPoints = actions.reduce((sum, a) => sum + a.points_awarded, 0)

  // Calculate averages
  const daysInPeriod = getDaysInPeriod(period)
  const averageActionsPerDay = totalActions / daysInPeriod
  const averagePointsPerDay = totalPoints / daysInPeriod
  const averagePointsPerAction = totalActions > 0 ? totalPoints / totalActions : 0

  // Calculate consistency (days with activity)
  const activeDays = new Set(progressHistory.map(item => 
    new Date(item.created_at).toISOString().split('T')[0]
  )).size
  const consistencyPercentage = Math.round((activeDays / daysInPeriod) * 100)

  return {
    totalActions,
    totalPoints,
    verifiedActions,
    totalActionPoints,
    averageActionsPerDay: Math.round(averageActionsPerDay * 100) / 100,
    averagePointsPerDay: Math.round(averagePointsPerDay * 100) / 100,
    averagePointsPerAction: Math.round(averagePointsPerAction * 100) / 100,
    consistencyPercentage,
    activeDays,
    totalDays: daysInPeriod
  }
}

function calculateSkillGaps(competencyData: CompetencyData) {
  const gaps: SkillGap[] = []
  const scores = {
    customerAnalysis: competencyData.customer_analysis,
    valueCommunication: competencyData.value_communication,
    salesExecution: competencyData.sales_execution
  }

  // Identify areas below 70 (intermediate level)
  Object.entries(scores).forEach(([skill, score]) => {
    if (score < 70) {
      gaps.push({
        skill,
        currentScore: score,
        targetScore: 70,
        gap: 70 - score,
        priority: score < 50 ? 'high' : score < 60 ? 'medium' : 'low'
      })
    }
  })

  return gaps.sort((a, b) => b.gap - a.gap)
}

function generateDevelopmentRecommendations(
  competencyData: CompetencyData,
  skillGaps: SkillGap[],
  progressHistory: ProgressHistoryItem[]
) {
  const recommendations: Recommendation[] = []

  // Skill gap recommendations
  skillGaps.forEach(gap => {
    recommendations.push({
      type: 'skill_development',
      priority: gap.priority,
      title: `Improve ${gap.skill.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
      description: `Focus on developing ${gap.skill.replace(/([A-Z])/g, ' $1').toLowerCase()} skills to reach intermediate level`,
      category: gap.skill,
      estimatedTime: '2-4 weeks',
      targetScore: gap.targetScore,
      currentScore: gap.currentScore,
      actions: getSkillDevelopmentActions(gap.skill)
    })
  })

  // Activity-based recommendations
  const recentActivity = progressHistory.slice(-10)
  const categoryCounts: Record<string, number> = recentActivity.reduce((acc, item) => {
    const category = item.category || 'unknown'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Recommend areas with less activity
  const categories = ['customerAnalysis', 'valueCommunication', 'salesExecution']
  categories.forEach(category => {
    const count = categoryCounts[category] || 0
    if (count < 2) {
      recommendations.push({
        type: 'activity_balance',
        priority: 'medium',
        title: `Increase ${category.replace(/([A-Z])/g, ' $1').toLowerCase()} activities`,
        description: `You've had limited activity in ${category.replace(/([A-Z])/g, ' $1').toLowerCase()} recently`,
        category: category,
        estimatedTime: '1-2 weeks',
        currentCount: count,
        targetCount: 3,
        actions: getCategoryActions(category)
      })
    }
  })

  return recommendations.sort((a, b) => {
    const priorityOrder: { [key: string]: number } = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}

function calculateProgressVelocity(progressHistory: ProgressHistoryItem[], period: string) {
  if (progressHistory.length < 2) {
    return { trend: 'stable', velocity: 0, description: 'Insufficient data for velocity calculation' }
  }

  const sortedHistory = progressHistory.sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  const firstHalf = sortedHistory.slice(0, Math.floor(sortedHistory.length / 2))
  const secondHalf = sortedHistory.slice(Math.floor(sortedHistory.length / 2))

  const firstHalfPoints = firstHalf.reduce((sum, item) => sum + item.points_awarded, 0)
  const secondHalfPoints = secondHalf.reduce((sum, item) => sum + item.points_awarded, 0)

  const velocity = secondHalfPoints - firstHalfPoints
  const trend = velocity > 0 ? 'accelerating' : velocity < 0 ? 'decelerating' : 'stable'

  return {
    trend,
    velocity,
    description: getVelocityDescription(trend, velocity)
  }
}

async function getPeerComparison(userId: string, competencyData: CompetencyData) {
  // This would typically compare against other users in the same organization/cohort
  // For now, return mock data structure
  return {
    percentile: 75,
    averageScore: 65,
    topPerformers: 25,
    description: 'You are performing above average compared to your peers'
  }
}

function getIndustryBenchmarks(competencyData: CompetencyData) {
  // Industry benchmark data (would typically come from external data source)
  return {
    customerAnalysis: { benchmark: 68, user: competencyData.customer_analysis },
    valueCommunication: { benchmark: 72, user: competencyData.value_communication },
    salesExecution: { benchmark: 70, user: competencyData.sales_execution },
    overall: { benchmark: 70, user: competencyData.overall_score }
  }
}

async function storeAnalytics(userId: string, period: string, analytics: Record<string, unknown>) {
  try {
    await supabase
      .from('competency_analytics')
      .upsert({
        user_id: userId,
        analytics_period: period,
        progress_trends: analytics.progressTrends,
        competency_growth: analytics.competencyGrowth,
        performance_metrics: analytics.performanceMetrics,
        skill_gaps: analytics.skillGaps,
        development_recommendations: analytics.developmentRecommendations,
        progress_velocity: analytics.progressVelocity,
        last_updated: new Date().toISOString()
      })
  } catch (error) {
    console.error('Error storing analytics:', error)
    // Don't fail the request if analytics storage fails
  }
}

// Helper functions
function getWeekKey(date: Date): string {
  const year = date.getFullYear()
  const week = getWeekNumber(date)
  return `${year}-W${String(week).padStart(2, '0')}`
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

function getDaysInPeriod(period: string): number {
  switch (period) {
    case 'week': return 7
    case 'month': return 30
    case 'quarter': return 90
    case 'year': return 365
    default: return 30
  }
}

function getSkillDevelopmentActions(skill: string): string[] {
  const actionMap = {
    customerAnalysis: [
      'Complete customer discovery calls',
      'Research market trends',
      'Analyze competitor strategies',
      'Develop buyer personas'
    ],
    valueCommunication: [
      'Practice ROI presentations',
      'Create value proposition templates',
      'Develop business case frameworks',
      'Conduct stakeholder demos'
    ],
    salesExecution: [
      'Create proposal templates',
      'Practice negotiation techniques',
      'Develop closing strategies',
      'Track deal progression'
    ]
  }
  return actionMap[skill as keyof typeof actionMap] || []
}

function getCategoryActions(category: string): string[] {
  return getSkillDevelopmentActions(category)
}

function getVelocityDescription(trend: string, velocity: number): string {
  switch (trend) {
    case 'accelerating':
      return `Your progress is accelerating with ${velocity} additional points in recent activities`
    case 'decelerating':
      return `Your progress has slowed down with ${Math.abs(velocity)} fewer points in recent activities`
    default:
      return 'Your progress velocity is stable'
  }
}

