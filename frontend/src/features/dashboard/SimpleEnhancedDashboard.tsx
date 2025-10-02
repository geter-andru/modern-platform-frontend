'use client'

/**
 * Simple Enhanced Customer Dashboard - Phase 1 Testing
 * 
 * Implements sophisticated tab navigation system and progress tracking sidebar
 * with professional competency development architecture (simplified for testing).
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingSpinner from '../../shared/components/ui/LoadingSpinner'
import { Alert } from '../../shared/components/ui/AlertComponents'
import TabNavigation from './TabNavigation'
import ProgressSidebar from './ProgressSidebar'
import UnlockRequirementsModal from './UnlockRequirementsModal'

// TypeScript interfaces
interface CompetencyData {
  baselineCustomerAnalysis: number
  baselineValueCommunication: number
  baselineSalesExecution: number
  currentCustomerAnalysis: number
  currentValueCommunication: number
  currentSalesExecution: number
  totalProgressPoints: number
  currentLevel: string
  currentLevelPoints: number
  totalLevelPoints: number
  toolUnlockStates: {
    icpUnlocked: boolean
    costCalculatorUnlocked: boolean
    businessCaseUnlocked: boolean
  }
  sectionsViewed: string[]
  completedRealWorldActions: string[]
  lastActivityDate: string
  totalSessions: number
}

interface TabConfig {
  id: string
  label: string
  description: string
  icon: string
  unlocked: boolean
  requirementScore?: number
  requirementCategory?: 'customerAnalysis' | 'valueCommunication' | 'salesExecution'
  requirementLevel?: string
}

interface ToolCallbacks {
  onICPComplete: (data: any) => Promise<any>
  onCostCalculated: (data: any) => Promise<any>
  onBusinessCaseReady: (data: any) => Promise<any>
}

interface CustomerAssets {
  baseline_customer_analysis?: number
  baseline_value_communication?: number
  baseline_sales_execution?: number
  current_customer_analysis?: number
  current_value_communication?: number
  current_sales_execution?: number
  total_progress_points?: number
  icp_unlocked?: boolean
  cost_calculator_unlocked?: boolean
  business_case_unlocked?: boolean
}

// Mock services for Next.js compatibility
const authService = {
  getCurrentSession: () => ({
    recordId: 'mock-record-id',
    accessToken: 'mock-token'
  })
}

const airtableService = {
  getCustomerAssets: async (recordId: string, token: string): Promise<CustomerAssets> => ({
    baseline_customer_analysis: 45,
    baseline_value_communication: 38,
    baseline_sales_execution: 42,
    current_customer_analysis: 45,
    current_value_communication: 38,
    current_sales_execution: 42,
    total_progress_points: 0,
    icp_unlocked: true,
    cost_calculator_unlocked: false,
    business_case_unlocked: false
  })
}

const SimpleEnhancedDashboard: React.FC = () => {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const customerId = params?.customerId as string
  
  // State management
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [customerData, setCustomerData] = useState<CustomerAssets | null>(null)
  const [activeTab, setActiveTab] = useState('icp-analysis')
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [selectedLockedTool, setSelectedLockedTool] = useState<TabConfig | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Professional competency data structure
  const [competencyData, setCompetencyData] = useState<CompetencyData>({
    // Assessment baseline scores (from initial assessment)
    baselineCustomerAnalysis: 45,
    baselineValueCommunication: 38,
    baselineSalesExecution: 42,
    
    // Current progress scores (updated through platform usage)
    currentCustomerAnalysis: 45,
    currentValueCommunication: 38,
    currentSalesExecution: 42,
    
    // Progress tracking
    totalProgressPoints: 0,
    currentLevel: 'Customer Intelligence Foundation',
    currentLevelPoints: 0,
    totalLevelPoints: 1000,
    
    // Tool unlock states
    toolUnlockStates: {
      icpUnlocked: true,
      costCalculatorUnlocked: false,
      businessCaseUnlocked: false
    },
    
    // Activity tracking
    sectionsViewed: [],
    completedRealWorldActions: [],
    lastActivityDate: new Date().toISOString(),
    totalSessions: 1
  })

  // Tab configuration with professional unlock requirements
  const tabConfig: TabConfig[] = [
    {
      id: 'icp-analysis',
      label: 'ICP Analysis',
      description: 'Customer Intelligence Foundation',
      icon: '🎯',
      unlocked: competencyData.toolUnlockStates.icpUnlocked
    },
    {
      id: 'cost-calculator',
      label: 'Cost Calculator',
      description: 'Value Communication Methodology',
      icon: '💰',
      unlocked: competencyData.toolUnlockStates.costCalculatorUnlocked,
      requirementScore: 70,
      requirementCategory: 'valueCommunication',
      requirementLevel: 'Value Communication Developing'
    },
    {
      id: 'business-case',
      label: 'Business Case',
      description: 'Sales Execution Framework',
      icon: '📊',
      unlocked: competencyData.toolUnlockStates.businessCaseUnlocked,
      requirementScore: 70,
      requirementCategory: 'salesExecution',
      requirementLevel: 'Sales Strategy Proficient'
    }
  ]

  // Handle mobile responsiveness
  useEffect(() => {
    const checkIsMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768)
      }
    }

    const handleResize = () => {
      checkIsMobile()
    }

    checkIsMobile()

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Get active tab from URL
  useEffect(() => {
    if (pathname.includes('cost-calculator')) setActiveTab('cost-calculator')
    else if (pathname.includes('business-case')) setActiveTab('business-case')
    else setActiveTab('icp-analysis')
  }, [pathname])

  // Load customer data and competency information
  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        setLoading(true)
        setError(null)

        const session = authService.getCurrentSession()
        if (!session || !session.recordId) {
          throw new Error('No valid session found. Please check your access link.')
        }

        // Load customer assets from Airtable
        const customerAssets = await airtableService.getCustomerAssets(
          session.recordId,
          session.accessToken
        )

        if (!customerAssets) {
          throw new Error('No customer data found')
        }

        setCustomerData(customerAssets)

        // Load competency data (would come from assessment integration in Phase 4)
        // For now, using mock data structure that matches the Airtable schema
        const enhancedCompetencyData: CompetencyData = {
          ...competencyData,
          // These would be loaded from Airtable in Phase 4
          baselineCustomerAnalysis: customerAssets.baseline_customer_analysis || 45,
          baselineValueCommunication: customerAssets.baseline_value_communication || 38,
          baselineSalesExecution: customerAssets.baseline_sales_execution || 42,
          currentCustomerAnalysis: customerAssets.current_customer_analysis || 45,
          currentValueCommunication: customerAssets.current_value_communication || 38,
          currentSalesExecution: customerAssets.current_sales_execution || 42,
          totalProgressPoints: customerAssets.total_progress_points || 0,
          toolUnlockStates: {
            icpUnlocked: customerAssets.icp_unlocked !== false,
            costCalculatorUnlocked: customerAssets.cost_calculator_unlocked || false,
            businessCaseUnlocked: customerAssets.business_case_unlocked || false
          }
        }

        setCompetencyData(enhancedCompetencyData)

      } catch (err) {
        console.error('Failed to load customer data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load customer data')
      } finally {
        setLoading(false)
      }
    }

    if (customerId) {
      loadCustomerData()
    }
  }, [customerId])

  // Tab navigation handler with lock state checking
  const handleTabNavigation = useCallback((tabId: string) => {
    const tab = tabConfig.find(t => t.id === tabId)
    
    if (!tab) return

    // Check if tab is unlocked
    if (!tab.unlocked) {
      setSelectedLockedTool(tab)
      setShowUnlockModal(true)
      return
    }

    // Navigate to the tab
    const session = authService.getCurrentSession()
    const queryString = session?.accessToken ? `?token=${session.accessToken}` : ''
    router.push(`/customer/${customerId}/dashboard/${tabId}${queryString}`)
  }, [tabConfig, customerId, router])

  // Progress point award system
  const awardProgressPoints = useCallback(async (points: number, category: string) => {
    try {
      const updatedData = { ...competencyData }
      
      // Add points to total
      updatedData.totalProgressPoints += points
      
      // Add points to specific category
      switch (category) {
        case 'customerAnalysis':
          updatedData.currentCustomerAnalysis = Math.min(100, updatedData.currentCustomerAnalysis + (points / 10))
          break
        case 'valueCommunication':
          updatedData.currentValueCommunication = Math.min(100, updatedData.currentValueCommunication + (points / 10))
          break
        case 'salesExecution':
          updatedData.currentSalesExecution = Math.min(100, updatedData.currentSalesExecution + (points / 10))
          break
      }

      // Check for tool unlocks
      if (updatedData.currentValueCommunication >= 70 && !updatedData.toolUnlockStates.costCalculatorUnlocked) {
        updatedData.toolUnlockStates.costCalculatorUnlocked = true
        // Show professional achievement notification
        console.log('Cost Calculator methodology unlocked!')
      }

      if (updatedData.currentSalesExecution >= 70 && !updatedData.toolUnlockStates.businessCaseUnlocked) {
        updatedData.toolUnlockStates.businessCaseUnlocked = true
        // Show professional achievement notification
        console.log('Business Case framework unlocked!')
      }

      // Update level based on total points
      if (updatedData.totalProgressPoints >= 20000) {
        updatedData.currentLevel = 'Revenue Intelligence Master'
      } else if (updatedData.totalProgressPoints >= 10000) {
        updatedData.currentLevel = 'Market Execution Expert'
      } else if (updatedData.totalProgressPoints >= 5000) {
        updatedData.currentLevel = 'Revenue Development Advanced'
      } else if (updatedData.totalProgressPoints >= 2500) {
        updatedData.currentLevel = 'Sales Strategy Proficient'
      } else if (updatedData.totalProgressPoints >= 1000) {
        updatedData.currentLevel = 'Value Communication Developing'
      }

      setCompetencyData(updatedData)

      // In Phase 4, this would update Airtable
      // await airtableService.updateProgressPoints(customerId, points, category);

    } catch (error) {
      console.error('Error awarding progress points:', error)
    }
  }, [competencyData, customerId])

  // Tool completion callbacks with progress tracking
  const toolCallbacks: ToolCallbacks = {
    onICPComplete: useCallback(async (data: any) => {
      await awardProgressPoints(50, 'customerAnalysis')
      return data
    }, [awardProgressPoints]),

    onCostCalculated: useCallback(async (data: any) => {
      await awardProgressPoints(75, 'valueCommunication')
      return data
    }, [awardProgressPoints]),

    onBusinessCaseReady: useCallback(async (data: any) => {
      await awardProgressPoints(100, 'salesExecution')
      return data
    }, [awardProgressPoints])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner 
          message="Loading professional competency dashboard..." 
          size="large"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert type="error" title="Dashboard Error">
            {error}
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Main Dashboard Layout - 80/20 split */}
      <div className={`grid gap-6 p-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-5'}`}>
        {/* Main Content Area - 80% */}
        <div className={`${isMobile ? 'col-span-1 order-2' : 'col-span-4'} space-y-6`}>
          {/* Professional Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Revenue Intelligence Platform
                </h1>
                <p className="text-gray-400">
                  Professional competency development through systematic methodology
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Current Level</div>
                <div className="text-lg font-medium text-blue-400">
                  {competencyData.currentLevel}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <TabNavigation
            tabs={tabConfig}
            activeTab={activeTab}
            competencyData={competencyData}
            onTabClick={handleTabNavigation}
            className="w-full"
          />

          {/* Active Tool Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"
          >
            <div className="p-6">
              {/* In Next.js, this would be replaced with children or page content */}
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {tabConfig.find(t => t.id === activeTab)?.icon}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {tabConfig.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-gray-400">
                  {tabConfig.find(t => t.id === activeTab)?.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Sidebar - 20% */}
        <div className={`${isMobile ? 'col-span-1 order-1' : 'col-span-1'}`}>
          <ProgressSidebar
            competencyData={competencyData}
            onAwardPoints={awardProgressPoints}
            className="sticky top-6"
          />
        </div>
      </div>

      {/* Unlock Requirements Modal */}
      <UnlockRequirementsModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        tool={selectedLockedTool}
        competencyData={competencyData}
      />
    </div>
  )
}

export default SimpleEnhancedDashboard