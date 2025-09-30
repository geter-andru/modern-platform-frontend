

'use client'

import React, { useState } from 'react'
import { CompetencyData } from '../types/competency'
import { 
  QuestionMarkCircleIcon,
  LightBulbIcon,
  BookOpenIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

interface ContextualHelpProps {
  currentPage: string
  competencyData: CompetencyData | null
}

interface HelpItem {
  id: string
  title: string
  description: string
  type: 'tip' | 'guide' | 'warning' | 'info'
  action?: string
  actionUrl?: string
  priority: 'high' | 'medium' | 'low'
  competencyLevel?: string
}

function HelpItemComponent({ item }: { item: HelpItem }) {
  const getIcon = () => {
    switch (item.type) {
      case 'tip':
        return <LightBulbIcon className="h-5 w-5 text-yellow-500" />
      case 'guide':
        return <BookOpenIcon className="h-5 w-5 text-blue-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />
      default:
        return <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getBorderColor = () => {
    switch (item.type) {
      case 'tip':
        return 'border-yellow-200 bg-yellow-50'
      case 'guide':
        return 'border-blue-200 bg-blue-50'
      case 'warning':
        return 'border-red-200 bg-red-50'
      case 'info':
        return 'border-gray-200 bg-gray-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  return (
    <div className={`rounded-lg border p-4 ${getBorderColor()}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            {item.title}
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            {item.description}
          </p>
          {item.action && (
            <button className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors">
              <PlayIcon className="h-4 w-4" />
              <span>{item.action}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function QuickActions({ competencyData }: { competencyData: CompetencyData | null }) {
  if (!competencyData) return null

  const actions = []

  // Add actions based on competency level
  if (competencyData.currentLevel?.id === 'foundation') {
    actions.push({
      title: 'Complete Your First ICP Analysis',
      description: 'Start building customer analysis skills',
      url: '/icp',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />
    })
  }

  if ((competencyData.valueCommunication || 0) < 70) {
    actions.push({
      title: 'Improve Value Communication',
      description: 'Focus on articulating value propositions',
      url: '/training/value-communication',
      icon: <LightBulbIcon className="h-5 w-5 text-yellow-500" />
    })
  }

  if ((competencyData.salesExecution || 0) < 70) {
    actions.push({
      title: 'Enhance Sales Execution',
      description: 'Develop closing and negotiation skills',
      url: '/training/sales-execution',
      icon: <BookOpenIcon className="h-5 w-5 text-blue-500" />
    })
  }

  if (actions.length === 0) {
    actions.push({
      title: 'Continue Your Journey',
      description: 'Keep building on your strong foundation',
      url: '/dashboard',
      icon: <TrophyIcon className="h-5 w-5 text-purple-500" />
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {action.icon}
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {action.title}
                </div>
                <div className="text-xs text-gray-600">
                  {action.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function CompetencyTips({ competencyData }: { competencyData: CompetencyData | null }) {
  if (!competencyData) return null

  const tips = []

  // Generate tips based on current competency levels
  if ((competencyData.customerAnalysis || 0) < 60) {
    tips.push({
      id: 'customer-analysis-tip',
      title: 'Improve Customer Analysis',
      description: 'Focus on understanding customer pain points and market dynamics. Complete more ICP analyses to build this skill.',
      type: 'tip' as const,
      priority: 'high' as const
    })
  }

  if ((competencyData.valueCommunication || 0) < 60) {
    tips.push({
      id: 'value-communication-tip',
      title: 'Enhance Value Communication',
      description: 'Practice articulating ROI and value propositions. Use the cost calculator to quantify benefits.',
      type: 'tip' as const,
      priority: 'high' as const
    })
  }

  if ((competencyData.salesExecution || 0) < 60) {
    tips.push({
      id: 'sales-execution-tip',
      title: 'Strengthen Sales Execution',
      description: 'Develop closing techniques and objection handling. Use the business case builder to support your sales process.',
      type: 'tip' as const,
      priority: 'high' as const
    })
  }

  // Add level-specific tips
  if (competencyData.currentLevel?.id === 'foundation' as const) {
    tips.push({
      id: 'developing-level-tip',
      title: 'Developing Level Focus',
      description: 'You\'re making great progress! Focus on completing assessments and building consistent habits.',
      type: 'info' as const,
      priority: 'medium' as const
    })
  }

  if ((competencyData.totalPoints || 0) > 500) {
    tips.push({
      id: 'advanced-tip',
      title: 'Advanced Strategies',
      description: 'Consider mentoring others and sharing your expertise. This will accelerate your own learning.',
      type: 'guide' as const,
      priority: 'medium' as const
    })
  }

  return (
    <div className="space-y-3">
      {tips.map((tip) => (
        <HelpItemComponent key={tip.id} item={tip} />
      ))}
    </div>
  )
}

function PageSpecificHelp({ currentPage }: { currentPage: string }) {
  const pageHelp: Record<string, HelpItem[]> = {
    dashboard: [
      {
        id: 'dashboard-overview',
        title: 'Dashboard Overview',
        description: 'Your dashboard shows your competency progress, recent activity, and personalized recommendations.',
        type: 'info',
        priority: 'low'
      }
    ],
    icp: [
      {
        id: 'icp-analysis-guide',
        title: 'ICP Analysis Best Practices',
        description: 'Focus on identifying customer pain points, market size, and competitive positioning.',
        type: 'guide',
        priority: 'high'
      }
    ],
    'cost-calculator': [
      {
        id: 'cost-calculator-tip',
        title: 'Cost Calculator Tips',
        description: 'Include all relevant costs: software, training, implementation, and opportunity costs.',
        type: 'tip',
        priority: 'high'
      }
    ],
    'business-case': [
      {
        id: 'business-case-guide',
        title: 'Business Case Structure',
        description: 'Start with executive summary, include ROI calculations, and address risk mitigation.',
        type: 'guide',
        priority: 'high'
      }
    ]
  }

  const helpItems = pageHelp[currentPage] || []

  if (helpItems.length === 0) return null

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Page-Specific Help</h3>
      <div className="space-y-3">
        {helpItems.map((item) => (
          <HelpItemComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

export function ContextualHelp({ currentPage, competencyData }: ContextualHelpProps) {
  const [activeTab, setActiveTab] = useState<'tips' | 'actions' | 'page'>('tips')

  return (
    <div className="space-y-4">
      
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <QuestionMarkCircleIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-medium text-gray-900">Contextual Help</h3>
        </div>
        
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'tips'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tips
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'actions'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Actions
          </button>
          <button
            onClick={() => setActiveTab('page')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'page'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Page Help
          </button>
        </div>
      </div>

      {activeTab === 'tips' && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Personalized Tips</h3>
          <CompetencyTips competencyData={competencyData} />
        </div>
      )}

      {activeTab === 'actions' && (
        <QuickActions competencyData={competencyData} />
      )}

      {activeTab === 'page' && (
        <PageSpecificHelp currentPage={currentPage} />
      )}
    </div>
  )
}

// Import TrophyIcon for QuickActions
import { TrophyIcon } from '@heroicons/react/24/outline'
