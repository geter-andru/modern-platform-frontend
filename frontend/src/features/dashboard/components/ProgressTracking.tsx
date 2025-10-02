

'use client'

import React from 'react'
import { CompetencyAnalytics } from '../types/competency'

import { 
  ChartBarIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ArrowTrendingDownIcon as TrendingDownIcon,
  MinusIcon,
  TrophyIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface ProgressTrackingProps {
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
  analytics: CompetencyAnalytics | null
}

interface ProgressMetricProps {
  label: string
  value: number
  change: number
  icon: React.ReactNode
  color: string
}

function ProgressMetric({ label, value, change, icon, color }: ProgressMetricProps) {
  const getChangeIcon = () => {
    if (change > 0) return <TrendingUpIcon className="h-4 w-4 text-green-500" />
    if (change < 0) return <TrendingDownIcon className="h-4 w-4 text-red-500" />
    return <MinusIcon className="h-4 w-4 text-gray-500" />
  }

  const getChangeColor = () => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
          <span className="text-sm font-medium text-gray-900">{label}</span>
        </div>
        <div className={`flex items-center space-x-1 text-xs ${getChangeColor()}`}>
          {getChangeIcon()}
          <span>{Math.abs(change)}</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}

function RecentActivityTimeline({ analytics }: { analytics: CompetencyAnalytics | null }) {
  if (!analytics?.progressTrends || analytics.progressTrends.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h3>
        <div className="text-center text-gray-500 text-sm py-4">
          No recent activity to display
        </div>
      </div>
    )
  }

  const recentTrends = analytics.progressTrends.slice(-5).reverse()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h3>
      <div className="space-y-3">
        {recentTrends.map((trend: any, index: number) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-900">
                {new Date(trend.date as string).toLocaleDateString()}
              </div>
              <div className="text-xs text-gray-500">
                Overall: {trend.overallScore as any} | Points: {trend.points as any}
              </div>
            </div>
            <div className="flex-shrink-0 text-xs text-gray-500">
              {new Date(trend.date as string).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CompetencyImprovements({ progressSummary }: { progressSummary: Record<string, unknown> }) {
  const improvements = [
    {
      category: 'Customer Analysis',
      improvement: (progressSummary.competencyImprovements as Record<string, unknown>).customerAnalysis as number,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      category: 'Value Communication',
      improvement: (progressSummary.competencyImprovements as Record<string, unknown>).valueCommunication as number,
      color: 'bg-green-100 text-green-600'
    },
    {
      category: 'Sales Execution',
      improvement: (progressSummary.competencyImprovements as Record<string, unknown>).salesExecution as number,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Competency Improvements</h3>
      <div className="space-y-3">
        {improvements.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{item.category}</span>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${item.color}`}>
              {item.improvement > 0 ? (
                <TrendingUpIcon className="h-3 w-3" />
              ) : item.improvement < 0 ? (
                <TrendingDownIcon className="h-3 w-3" />
              ) : (
                <MinusIcon className="h-3 w-3" />
              )}
              <span>{item.improvement > 0 ? '+' : ''}{item.improvement}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PerformanceInsights({ analytics }: { analytics: CompetencyAnalytics | null }) {
  if (!analytics) return null

  const insights = []
  
  // Add insights based on analytics data
  if (analytics.competencyGrowth) {
    const topGrowth = analytics.competencyGrowth
      .filter((g: any) => (g.growth as number) > 0)
      .sort((a: any, b: any) => (b.growth as number) - (a.growth as number))[0]
    
    if (topGrowth) {
      insights.push({
        type: 'growth',
        message: `${topGrowth.category} shows the strongest growth (+${topGrowth.growth} points)`,
        icon: <TrendingUpIcon className="h-4 w-4 text-green-500" />
      })
    }
  }

  if (analytics.skillGaps && analytics.skillGaps.length > 0) {
    const highPriorityGap = analytics.skillGaps.find((gap: any) => gap.priority === 'high')
    if (highPriorityGap) {
      insights.push({
        type: 'gap',
        message: `Focus on ${highPriorityGap.skill} (${highPriorityGap.gap} point gap)`,
        icon: <StarIcon className="h-4 w-4 text-yellow-500" />
      })
    }
  }

  if (analytics.progressVelocity && analytics.progressVelocity.velocity > 0) {
    insights.push({
      type: 'velocity',
      message: `Great momentum! ${analytics.progressVelocity.velocity.toFixed(1)} points/day`,
      icon: <TrophyIcon className="h-4 w-4 text-blue-500" />
    })
  }

  if (insights.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Performance Insights</h3>
        <div className="text-center text-gray-500 text-sm py-4">
          Keep working to unlock insights!
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Performance Insights</h3>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {insight.icon}
            </div>
            <p className="text-sm text-gray-700">{insight.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProgressTracking({ progressSummary, analytics }: ProgressTrackingProps) {
  return (
    <div className="space-y-4">
      
      <div className="grid grid-cols-1 gap-4">
        <ProgressMetric
          label="Points Gained"
          value={progressSummary.pointsGained}
          change={progressSummary.pointsGained}
          icon={<TrophyIcon className="h-5 w-5 text-yellow-600" />}
          color="bg-yellow-100"
        />
        
        <ProgressMetric
          label="Level Advancements"
          value={progressSummary.levelAdvancements}
          change={progressSummary.levelAdvancements}
          icon={<StarIcon className="h-5 w-5 text-purple-600" />}
          color="bg-purple-100"
        />
        
        <ProgressMetric
          label="Tools Unlocked"
          value={progressSummary.toolsUnlocked}
          change={progressSummary.toolsUnlocked}
          icon={<ChartBarIcon className="h-5 w-5 text-green-600" />}
          color="bg-green-100"
        />
      </div>

      <CompetencyImprovements progressSummary={progressSummary} />

      <RecentActivityTimeline analytics={analytics} />

      <PerformanceInsights analytics={analytics} />
    </div>
  )
}
