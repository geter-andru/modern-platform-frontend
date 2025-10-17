'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, ArrowRight } from 'lucide-react'

// TypeScript interfaces
interface StageData {
  stage: number
  name: string
  goal: string
  focus: string
  moduleCount: number
  criticalSteps: string[]
  isActive?: boolean
  isTarget?: boolean
}

interface MilestoneProgressBarProps {
  currentStage?: number
  targetStage?: number
  compact?: boolean
  showDetails?: boolean
}

// Mock milestone module service (replace with actual service when available)
const mockMilestoneService = {
  getStageProgressionSummary: (startStage: number, endStage: number): StageData[] => {
    const stages: StageData[] = []
    for (let i = startStage; i <= endStage; i++) {
      stages.push({
        stage: i,
        name: `Series B Stage ${i}`,
        goal: `Achieve milestone ${i} objectives`,
        focus: `Strategic focus for stage ${i}`,
        moduleCount: Math.floor(Math.random() * 5) + 3,
        criticalSteps: [
          `Complete strategic initiative ${i}-A`,
          `Execute operational plan ${i}-B`,
          `Validate market response ${i}-C`
        ]
      })
    }
    return stages
  },
  seriesBStages: {
    10: { goal: 'Foundation establishment', focus: 'Market validation' },
    11: { goal: 'Growth acceleration', focus: 'Scale operations' },
    12: { goal: 'Market expansion', focus: 'Product enhancement' },
    13: { goal: 'Strategic partnerships', focus: 'Channel development' },
    14: { goal: 'Revenue optimization', focus: 'Operational efficiency' },
    15: { goal: 'Series B preparation', focus: 'Investment readiness' }
  }
}

/**
 * Milestone Progress Bar - Shows Series B progression stages 10-15
 * 
 * Visual representation of user's current stage and target progression
 * with specific focus on the 3 critical sales steps for each stage.
 */
const MilestoneProgressBar: React.FC<MilestoneProgressBarProps> = ({ 
  currentStage = 12, 
  targetStage = 15, 
  compact = false,
  showDetails = true 
}) => {
  const stages = mockMilestoneService.getStageProgressionSummary(10, 15)
  
  const getStageStatus = (stage: number): 'completed' | 'active' | 'target' | 'future' => {
    if (stage < currentStage) return 'completed'
    if (stage === currentStage) return 'active'
    if (stage <= targetStage) return 'target'
    return 'future'
  }

  const getStageColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-900/30 border-green-500/50'
      case 'active': return 'text-blue-400 bg-blue-900/30 border-blue-500/50'
      case 'target': return 'text-purple-400 bg-purple-900/30 border-purple-500/50'
      case 'future': return 'text-gray-400 bg-gray-900/30 border-gray-600/50'
      default: return 'text-gray-400 bg-gray-900/30 border-gray-600/50'
    }
  }

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle
      case 'active': return Circle
      default: return Circle
    }
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.stage)
          const Icon = getStageIcon(status)
          const isLast = index === stages.length - 1
          
          return (
            <div key={stage.stage} className="flex items-center">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-md border ${getStageColor(status)}`}>
                <Icon className="w-3 h-3" />
                <span className="text-xs font-medium">{stage.stage}</span>
              </div>
              {!isLast && <ArrowRight className="w-3 h-3 text-gray-500 mx-1" />}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Series B Milestone Progress</h3>
        <div className="text-sm text-gray-400">
          Stage {currentStage} → {targetStage}
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.stage)
          const Icon = getStageIcon(status)
          const isActive = stage.stage === currentStage
          const isTarget = stage.stage <= targetStage && stage.stage > currentStage
          
          return (
            <motion.div
              key={stage.stage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 ${getStageColor(status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 mt-0.5" />
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold">Stage {stage.stage}: {stage.name}</h4>
                      {isActive && (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                          Current
                        </span>
                      )}
                      {isTarget && !isActive && (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                          Target
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-80 mb-2">{stage.goal}</p>
                    
                    {showDetails && (
                      <div className="space-y-1">
                        <div className="text-xs opacity-70">
                          <span className="font-medium">Focus:</span> {stage.focus}
                        </div>
                        <div className="text-xs opacity-70">
                          <span className="font-medium">Modules:</span> {stage.moduleCount} active modules
                        </div>
                        
                        {/* Critical Steps */}
                        <div className="mt-2">
                          <div className="text-xs font-medium opacity-80 mb-1">
                            Critical Steps:
                          </div>
                          <ul className="text-xs opacity-70 space-y-0.5">
                            {stage.criticalSteps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start space-x-1">
                                <span className="text-current">•</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Progress Indicator */}
                <div className="text-right">
                  <div className="text-xs opacity-70">
                    {status === 'completed' && '✓ Complete'}
                    {status === 'active' && 'In Progress'}
                    {status === 'target' && 'Planning'}
                    {status === 'future' && 'Future'}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Current Focus Summary */}
      {showDetails && (
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <h4 className="text-blue-300 font-medium mb-2">Current Stage Focus</h4>
          <p className="text-blue-200 text-sm">
            <strong>Stage {currentStage}:</strong> {mockMilestoneService.seriesBStages[currentStage as keyof typeof mockMilestoneService.seriesBStages]?.goal || 'Stage progression'}
          </p>
          <div className="text-blue-300/80 text-xs mt-2">
            <strong>Strategy:</strong> {mockMilestoneService.seriesBStages[currentStage as keyof typeof mockMilestoneService.seriesBStages]?.focus || 'Strategic focus'}
          </div>
        </div>
      )}
    </div>
  )
}

export default MilestoneProgressBar