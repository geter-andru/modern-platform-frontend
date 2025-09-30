

'use client'

import React from 'react'
import { CompetencyData, CompetencyAnalytics } from '../types/competency'

import { COMPETENCY_LEVELS } from '../types/competency'

interface CompetencyGaugesProps {
  competencyData?: CompetencyData | null
  analytics?: CompetencyAnalytics | null
  competencyAreas?: Record<string, unknown>[]
  nextUnlock?: Record<string, unknown>
  competencyBaselines?: Record<string, unknown>
  assessmentData?: Record<string, unknown>
  onGaugeClick?: (area: string) => void
  className?: string
}
import { 
  ChartPieIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline'

interface GaugeProps {
  value: number
  max: number
  label: string
  color: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
  description?: string
}

function CircularGauge({ value, max, label, color, trend, trendValue, description }: GaugeProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const radius = 60
  const strokeWidth = 8
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className="h-4 w-4 text-green-500" />
      case 'down':
        return <ArrowDownIcon className="h-4 w-4 text-red-500" />
      case 'stable':
        return <MinusIcon className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      case 'stable':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        {trend && trendValue !== undefined && (
          <div className={`flex items-center space-x-1 text-xs ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{Math.abs(trendValue)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center mb-3">
        <div className="relative">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
          >
            
            <circle
              stroke="#e5e7eb"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            
            <circle
              stroke={color}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-500 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500">/ {max}</div>
            </div>
          </div>
        </div>
      </div>

      {description && (
        <p className="text-xs text-gray-600 text-center">{description}</p>
      )}
    </div>
  )
}

function LevelProgressBar({ competencyData }: { competencyData: CompetencyData | null }) {
  if (!competencyData) return null

  const currentLevel = competencyData.currentLevel
  const nextLevel = COMPETENCY_LEVELS.find(level => level.id === currentLevel?.nextLevel)
  const progress = competencyData.levelProgress || 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Level Progress</h3>
        <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium" style={{ color: currentLevel?.color || '#6B7280' }}>
            {currentLevel?.name || 'Unknown Level'}
          </span>
          <span className="text-gray-600">{competencyData.totalPoints || 0} pts</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500 ease-in-out"
            style={{
              backgroundColor: currentLevel?.color || '#6B7280',
              width: `${progress}%`
            }}
          />
        </div>

        {nextLevel && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Next: {nextLevel.name}</span>
            <span>{nextLevel.points - (competencyData.totalPoints || 0)} pts to go</span>
          </div>
        )}
      </div>
    </div>
  )
}

function OverallScoreCard({ competencyData }: { competencyData: CompetencyData | null }) {
  if (!competencyData) return null

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Developing'
    return 'Needs Improvement'
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200 p-4">
      <div className="flex items-center space-x-3 mb-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <ChartPieIcon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">Overall Score</h3>
          <p className="text-xs text-gray-600">{getScoreLabel(competencyData.overallScore || 0)}</p>
        </div>
      </div>

      <div className="text-center">
        <div className={`text-3xl font-bold ${getScoreColor(competencyData.overallScore || 0)}`}>
          {competencyData.overallScore || 0}
        </div>
        <div className="text-sm text-gray-600">out of 100</div>
      </div>
    </div>
  )
}

export function CompetencyGauges({ 
  competencyData: propCompetencyData, 
  analytics, 
  competencyAreas, 
  nextUnlock, 
  competencyBaselines, 
  assessmentData, 
  onGaugeClick, 
  className = '' 
}: CompetencyGaugesProps) {
  // Create mock competencyData from competencyAreas if needed
  const mockCompetencyData: CompetencyData = {
    customerAnalysis: 75,
    valueCommunication: 80,
    salesExecution: 70,
    overallScore: 75,
    totalPoints: 150,
    currentLevel: COMPETENCY_LEVELS[0], // 'foundation'
    levelProgress: 50,
    lastUpdated: new Date().toISOString(),
    baselineScores: {
      customerAnalysis: 60,
      valueCommunication: 65,
      salesExecution: 55
    },
    levelHistory: [],
    toolUnlockStates: {
      icpUnlocked: true,
      costCalculatorUnlocked: true,
      businessCaseUnlocked: false,
      resourcesUnlocked: false,
      exportUnlocked: false
    }
  };

  const competencyData = propCompetencyData || (competencyAreas && competencyAreas.length > 0 ? mockCompetencyData : null);

  if (!competencyData) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-32"></div>
        </div>
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-24"></div>
        </div>
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-24"></div>
        </div>
      </div>
    )
  }

  // Get trend data from analytics
  const getTrendData = (category: 'customerAnalysis' | 'valueCommunication' | 'salesExecution') => {
    if (!analytics?.competencyGrowth) return { trend: 'stable' as const, trendValue: 0 }
    
    const growth = analytics.competencyGrowth.find((g: any) => g.category === category)
    if (!growth) return { trend: 'stable' as const, trendValue: 0 }
    
    return {
      trend: growth.trend as 'up' | 'down' | 'stable',
      trendValue: growth.growth
    }
  }

  const customerTrend = getTrendData('customerAnalysis')
  const valueTrend = getTrendData('valueCommunication')
  const salesTrend = getTrendData('salesExecution')

  return (
    <div className={`space-y-4 ${className}`}>
      
      <OverallScoreCard competencyData={competencyData} />

      <div className="grid grid-cols-1 gap-4">
        <CircularGauge
          value={competencyData.customerAnalysis || 0}
          max={100}
          label="Customer Analysis"
          color="#3B82F6"
          trend={customerTrend.trend}
          trendValue={customerTrend.trendValue}
          description="Understanding customer needs and market dynamics"
        />

        <CircularGauge
          value={competencyData.valueCommunication || 0}
          max={100}
          label="Value Communication"
          color="#10B981"
          trend={valueTrend.trend}
          trendValue={valueTrend.trendValue}
          description="Articulating value propositions effectively"
        />

        <CircularGauge
          value={competencyData.salesExecution || 0}
          max={100}
          label="Sales Execution"
          color="#F59E0B"
          trend={salesTrend.trend}
          trendValue={salesTrend.trendValue}
          description="Closing deals and managing sales processes"
        />
      </div>

      <LevelProgressBar competencyData={competencyData} />

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {competencyData.totalPoints || 0}
            </div>
            <div className="text-xs text-gray-500">Total Points</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {competencyData.currentLevel?.name?.split(' ')[0] || 'Unknown'}
            </div>
            <div className="text-xs text-gray-500">Current Level</div>
          </div>
        </div>
      </div>
    </div>
  )
}
