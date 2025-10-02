'use client'

import React, { useState, useEffect } from 'react'
import { Unlock, Lock, CheckCircle, Clock, Star, Zap, Target, Award } from 'lucide-react'

// TypeScript interfaces
interface Tool {
  id: string
  name: string
  description: string
  category: string
  level: number
  pointsRequired: number
  isUnlocked: boolean
  isCompleted: boolean
  progress?: number
  icon?: string
}

interface ToolAccess {
  currentLevel: number
  totalPoints: number
  unlockedTools: string[]
  completedTools: string[]
  availableTools: Tool[]
}

interface ProgressiveToolAccessProps {
  customerId: string
  toolAccess?: ToolAccess
  onToolComplete: (toolId: string) => void
  onUnlockEarned: (toolId: string) => void
  className?: string
}

const ProgressiveToolAccess: React.FC<ProgressiveToolAccessProps> = ({
  customerId,
  toolAccess,
  onToolComplete,
  onUnlockEarned,
  className = ''
}) => {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (customerId) {
      loadToolAccess()
    }
  }, [customerId])

  const loadToolAccess = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Mock data for now - in production this would fetch from API
      const mockTools: Tool[] = [
        {
          id: 'pipeline-analysis',
          name: 'Pipeline Analysis',
          description: 'Advanced pipeline tracking and forecasting tools',
          category: 'Sales',
          level: 1,
          pointsRequired: 100,
          isUnlocked: true,
          isCompleted: true,
          progress: 100,
          icon: '📊'
        },
        {
          id: 'customer-discovery',
          name: 'Customer Discovery',
          description: 'Deep customer research and persona mapping',
          category: 'Research',
          level: 2,
          pointsRequired: 250,
          isUnlocked: true,
          isCompleted: false,
          progress: 60,
          icon: '🔍'
        },
        {
          id: 'deal-negotiation',
          name: 'Deal Negotiation',
          description: 'Advanced negotiation strategies and tactics',
          category: 'Sales',
          level: 3,
          pointsRequired: 500,
          isUnlocked: false,
          isCompleted: false,
          progress: 0,
          icon: '🤝'
        },
        {
          id: 'market-analysis',
          name: 'Market Analysis',
          description: 'Comprehensive market research and competitive intelligence',
          category: 'Research',
          level: 2,
          pointsRequired: 300,
          isUnlocked: true,
          isCompleted: false,
          progress: 30,
          icon: '📈'
        },
        {
          id: 'stakeholder-mapping',
          name: 'Stakeholder Mapping',
          description: 'Complex stakeholder relationship management',
          category: 'Strategy',
          level: 4,
          pointsRequired: 750,
          isUnlocked: false,
          isCompleted: false,
          progress: 0,
          icon: '🗺️'
        }
      ]
      
      setTools(mockTools)
    } catch (err) {
      setError('Failed to load tool access data')
      console.error('Error loading tool access:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToolClick = (tool: Tool) => {
    if (!tool.isUnlocked) {
      return
    }
    
    if (tool.isCompleted) {
      return
    }
    
    // Simulate tool completion
    onToolComplete(tool.id)
  }

  const getToolStatusIcon = (tool: Tool) => {
    if (tool.isCompleted) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else if (tool.isUnlocked) {
      return <Clock className="h-5 w-5 text-blue-500" />
    } else {
      return <Lock className="h-5 w-5 text-gray-400" />
    }
  }

  const getToolStatusColor = (tool: Tool) => {
    if (tool.isCompleted) {
      return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
    } else if (tool.isUnlocked) {
      return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
    } else {
      return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
    }
  }

  if (loading) {
    return (
      <div className={`progressive-tool-access ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`progressive-tool-access ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center text-red-600 dark:text-red-400">
            <p>{error}</p>
            <button 
              onClick={loadToolAccess}
              className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`progressive-tool-access ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Progressive Tool Access
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Unlock advanced tools as you progress
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{tools.filter(t => t.isUnlocked).length}/{tools.length} unlocked</span>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className={`
                  relative p-4 rounded-lg border-2 transition-all duration-200
                  ${getToolStatusColor(tool)}
                  ${tool.isUnlocked && !tool.isCompleted ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}
                  ${!tool.isUnlocked ? 'opacity-60' : ''}
                `}
                onClick={() => handleToolClick(tool)}
              >
                {/* Tool Icon and Status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{tool.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Level {tool.level}
                      </p>
                    </div>
                  </div>
                  {getToolStatusIcon(tool)}
                </div>

                {/* Tool Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {tool.description}
                </p>

                {/* Progress Bar */}
                {tool.isUnlocked && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{tool.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${tool.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Points Required */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Star className="h-3 w-3" />
                    <span>{tool.pointsRequired} pts</span>
                  </div>
                  {!tool.isUnlocked && (
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Lock className="h-3 w-3" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    {tool.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {tools.filter(t => t.isCompleted).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Unlock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Available
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {tools.filter(t => t.isUnlocked && !t.isCompleted).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    Total Tools
                  </p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {tools.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressiveToolAccess
