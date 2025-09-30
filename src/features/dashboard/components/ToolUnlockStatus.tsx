

'use client'

import React from 'react'
import { CompetencyData } from '../types/competency'
import { 
  LockClosedIcon,
  LockOpenIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CalculatorIcon,
  DocumentTextIcon,
  FolderIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

interface ToolUnlockStatusProps {
  competencyData: CompetencyData | null
}

interface Tool {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  requirement: string
  currentValue: number
  requiredValue: number
  category: 'customerAnalysis' | 'valueCommunication' | 'salesExecution' | 'overall'
}

function ToolItem({ tool }: { tool: Tool }) {
  const progress = tool.requiredValue > 0 ? (tool.currentValue / tool.requiredValue) * 100 : 100
  const isUnlocked = tool.unlocked
  const isClose = !isUnlocked && progress >= 80

  const getStatusColor = () => {
    if (isUnlocked) return 'text-green-600'
    if (isClose) return 'text-yellow-600'
    return 'text-gray-400'
  }

  const getStatusIcon = () => {
    if (isUnlocked) return <CheckCircleIcon className="h-5 w-5 text-green-500" />
    if (isClose) return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
    return <LockClosedIcon className="h-5 w-5 text-gray-400" />
  }

  const getBorderColor = () => {
    if (isUnlocked) return 'border-green-200 bg-green-50'
    if (isClose) return 'border-yellow-200 bg-yellow-50'
    return 'border-gray-200 bg-gray-50'
  }

  return (
    <div className={`rounded-lg border p-4 ${getBorderColor()}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
            {tool.icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-gray-900">{tool.name}</h4>
            {getStatusIcon()}
          </div>
          <p className="text-sm text-gray-700 mb-2">{tool.description}</p>
          
          {!isUnlocked && (
            <div className="space-y-2">
              <div className="text-xs text-gray-600">
                <span className="font-medium">Requirement:</span> {tool.requirement}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isClose ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">
                  {tool.currentValue}/{tool.requiredValue}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function UnlockProgress({ competencyData }: { competencyData: CompetencyData | null }) {
  if (!competencyData) return null

  const tools = [
    {
      id: 'icp',
      name: 'ICP Analysis',
      description: 'Customer intelligence and market analysis',
      icon: <ChartBarIcon className="h-5 w-5 text-blue-600" />,
      unlocked: true, // Always unlocked
      requirement: 'Foundation level',
      currentValue: 100,
      requiredValue: 0,
      category: 'overall' as const
    },
    {
      id: 'cost-calculator',
      name: 'Cost Calculator',
      description: 'ROI and cost impact calculations',
      icon: <CalculatorIcon className="h-5 w-5 text-green-600" />,
      unlocked: competencyData.toolUnlockStates?.costCalculatorUnlocked || false,
      requirement: '70+ Value Communication',
      currentValue: competencyData.valueCommunication || 0,
      requiredValue: 70,
      category: 'valueCommunication' as const
    },
    {
      id: 'business-case',
      name: 'Business Case Builder',
      description: 'Comprehensive business case development',
      icon: <DocumentTextIcon className="h-5 w-5 text-purple-600" />,
      unlocked: competencyData.toolUnlockStates?.businessCaseUnlocked || false,
      requirement: '70+ Sales Execution',
      currentValue: competencyData.salesExecution || 0,
      requiredValue: 70,
      category: 'salesExecution' as const
    },
    {
      id: 'resources',
      name: 'Resource Library',
      description: 'Access to training materials and guides',
      icon: <FolderIcon className="h-5 w-5 text-orange-600" />,
      unlocked: competencyData.toolUnlockStates?.resourcesUnlocked || false,
      requirement: '50+ Overall Score',
      currentValue: competencyData.overallScore || 0,
      requiredValue: 50,
      category: 'overall' as const
    },
    {
      id: 'export',
      name: 'Export Tools',
      description: 'Export analyses and reports',
      icon: <ArrowDownTrayIcon className="h-5 w-5 text-indigo-600" />,
      unlocked: competencyData.toolUnlockStates?.exportUnlocked || false,
      requirement: '60+ Overall Score',
      currentValue: competencyData.overallScore || 0,
      requiredValue: 60,
      category: 'overall' as const
    }
  ]

  const unlockedCount = tools.filter(tool => tool.unlocked).length
  const totalCount = tools.length
  const progressPercentage = (unlockedCount / totalCount) * 100

  return (
    <div className="space-y-4">
      
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Tool Unlock Progress</h3>
          <span className="text-sm text-gray-600">{unlockedCount}/{totalCount} unlocked</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="text-xs text-gray-600">
          {progressPercentage === 100 
            ? 'All tools unlocked! 🎉' 
            : `${Math.round(progressPercentage)}% complete`
          }
        </div>
      </div>

      <div className="space-y-3">
        {tools.map((tool) => (
          <ToolItem key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
}

function NextUnlockTarget({ competencyData }: { competencyData: CompetencyData | null }) {
  if (!competencyData) return null

  const nextTargets = []

  // Find next unlock targets
  if (!competencyData.toolUnlockStates?.costCalculatorUnlocked) {
    const needed = 70 - (competencyData.valueCommunication || 0)
    nextTargets.push({
      tool: 'Cost Calculator',
      category: 'Value Communication',
      current: competencyData.valueCommunication || 0,
      required: 70,
      needed: needed,
      priority: 'high'
    })
  }

  if (!competencyData.toolUnlockStates?.businessCaseUnlocked) {
    const needed = 70 - (competencyData.salesExecution || 0)
    nextTargets.push({
      tool: 'Business Case Builder',
      category: 'Sales Execution',
      current: competencyData.salesExecution || 0,
      required: 70,
      needed: needed,
      priority: 'high'
    })
  }

  if (!competencyData.toolUnlockStates?.resourcesUnlocked) {
    const needed = 50 - (competencyData.overallScore || 0)
    nextTargets.push({
      tool: 'Resource Library',
      category: 'Overall Score',
      current: competencyData.overallScore || 0,
      required: 50,
      needed: needed,
      priority: 'medium'
    })
  }

  if (!competencyData.toolUnlockStates?.exportUnlocked) {
    const needed = 60 - (competencyData.overallScore || 0)
    nextTargets.push({
      tool: 'Export Tools',
      category: 'Overall Score',
      current: competencyData.overallScore || 0,
      required: 60,
      needed: needed,
      priority: 'medium'
    })
  }

  if (nextTargets.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
          <h3 className="text-sm font-medium text-green-900">All Tools Unlocked!</h3>
        </div>
        <p className="text-sm text-green-700 mt-1">
          Congratulations! You have access to all available tools.
        </p>
      </div>
    )
  }

  // Sort by priority and needed points
  nextTargets.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority === 'high' ? -1 : 1
    }
    return a.needed - b.needed
  })

  const nextTarget = nextTargets[0]

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-2">
        <LockClosedIcon className="h-5 w-5 text-blue-500" />
        <h3 className="text-sm font-medium text-blue-900">Next Unlock Target</h3>
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium text-blue-900">{nextTarget.tool}</div>
        <div className="text-sm text-blue-700">
          Need {nextTarget.needed} more points in {nextTarget.category}
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(nextTarget.current / nextTarget.required) * 100}%` }}
            />
          </div>
          <span className="text-xs text-blue-600">
            {nextTarget.current}/{nextTarget.required}
          </span>
        </div>
      </div>
    </div>
  )
}

export function ToolUnlockStatus({ competencyData }: ToolUnlockStatusProps) {
  if (!competencyData) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-24"></div>
        </div>
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-32"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      
      <NextUnlockTarget competencyData={competencyData} />

      <UnlockProgress competencyData={competencyData} />
    </div>
  )
}
