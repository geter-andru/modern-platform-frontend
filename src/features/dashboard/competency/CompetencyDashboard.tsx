'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, Award, Target, Unlock, ChevronRight, Star, BarChart3, Users, Zap } from 'lucide-react'
import CompetencyOverview from '../CompetencyOverview'

// TypeScript interfaces
interface CompetencyData {
  currentLevel: string
  progressPoints: number
  nextLevelThreshold: number
  progressToNext?: number
  toolsUnlocked: number
  totalTools: number
  todaysObjectives: number
  objectivesCompleted: number
  consistencyStreak: number
  hiddenRank: string
  recentMilestones?: Array<{
    name: string
    points: number
  }>
}

interface CompetencyDashboardProps {
  customerId: string
  isVisible: boolean
  className?: string
}

const CompetencyDashboard: React.FC<CompetencyDashboardProps> = ({
  customerId,
  isVisible,
  className = ''
}) => {
  const [competencyData, setCompetencyData] = useState<CompetencyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (customerId && isVisible) {
      loadCompetencyData()
    }
  }, [customerId, isVisible])

  const loadCompetencyData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Mock data for now - in production this would fetch from API
      const mockData: CompetencyData = {
        currentLevel: "Intermediate",
        progressPoints: 1250,
        nextLevelThreshold: 2000,
        progressToNext: 62.5,
        toolsUnlocked: 8,
        totalTools: 15,
        todaysObjectives: 3,
        objectivesCompleted: 1,
        consistencyStreak: 7,
        hiddenRank: "Top 15%",
        recentMilestones: [
          { name: "First Deal Closed", points: 100 },
          { name: "Pipeline Analysis Master", points: 75 },
          { name: "Customer Discovery Expert", points: 50 }
        ]
      }
      
      setCompetencyData(mockData)
    } catch (err) {
      setError('Failed to load competency data')
      console.error('Error loading competency data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadCompetencyData()
  }

  if (!isVisible) {
    return null
  }

  if (loading) {
    return (
      <div className={`competency-dashboard ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`competency-dashboard ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center text-red-600 dark:text-red-400">
            <p>{error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!competencyData) {
    return null
  }

  return (
    <div className={`competency-dashboard ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Competency Dashboard
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track your professional development progress
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <TrendingUp className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Competency Overview */}
          <CompetencyOverview
            customerId={customerId}
            competencyData={competencyData}
            onRefresh={handleRefresh}
            className="mb-6"
          />

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Current Level
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {competencyData.currentLevel}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Progress Points
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {competencyData.progressPoints.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Unlock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    Tools Unlocked
                  </p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {competencyData.toolsUnlocked}/{competencyData.totalTools}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Milestones */}
          {competencyData.recentMilestones && competencyData.recentMilestones.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Recent Milestones
              </h3>
              <div className="space-y-2">
                {competencyData.recentMilestones.map((milestone, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="p-1 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                        <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {milestone.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      +{milestone.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompetencyDashboard
