'use client';

/**
 * Enhanced Customer Dashboard - Phase 1
 * 
 * Implements sophisticated tab navigation system and progress tracking sidebar
 * with professional competency development architecture.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// TypeScript interfaces
interface CustomerData {
  [key: string]: any;
  baseline_customer_analysis?: number;
  baseline_value_communication?: number;
  baseline_sales_execution?: number;
  current_customer_analysis?: number;
  current_value_communication?: number;
  current_sales_execution?: number;
  total_progress_points?: number;
  icp_unlocked?: boolean;
  cost_calculator_unlocked?: boolean;
  business_case_unlocked?: boolean;
  icpContent?: any;
  personaContent?: any;
}

interface CompetencyData {
  baselineCustomerAnalysis: number;
  baselineValueCommunication: number;
  baselineSalesExecution: number;
  currentCustomerAnalysis: number;
  currentValueCommunication: number;
  currentSalesExecution: number;
  totalProgressPoints: number;
  currentLevel: string;
  currentLevelPoints: number;
  totalLevelPoints: number;
  toolUnlockStates: {
    icpUnlocked: boolean;
    costCalculatorUnlocked: boolean;
    businessCaseUnlocked: boolean;
  };
  sectionsViewed: string[];
  completedRealWorldActions: string[];
  lastActivityDate: string;
  totalSessions: number;
}

interface TabConfiguration {
  id: string;
  label: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirementScore?: number;
  requirementCategory?: string;
  requirementLevel?: string;
  component: React.ComponentType<any>;
}

interface ProgressData {
  points: number;
  category: string;
}

interface SessionData {
  recordId?: string;
  accessToken?: string;
}

interface EnhancedCustomerDashboardProps {
  customerId?: string;
}

// Mock services for Next.js compatibility
const mockAuthService = {
  getCurrentSession: (): SessionData | null => ({
    recordId: 'mock-record-id',
    accessToken: 'mock-token'
  })
};

const mockAirtableService = {
  getCustomerAssets: async (recordId: string, token: string): Promise<CustomerData> => ({
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
};

// Placeholder components until migration is complete
const LoadingSpinner: React.FC<{ message: string; size: string }> = ({ message, size }) => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className={`animate-spin rounded-full border-4 border-purple-500 border-t-transparent ${
      size === 'large' ? 'w-12 h-12' : 'w-8 h-8'
    }`} />
    <p className="text-gray-400">{message}</p>
  </div>
);

const Callout: React.FC<{ type: string; title: string; children: React.ReactNode }> = ({ type, title, children }) => (
  <div className={`p-4 rounded-lg border ${
    type === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-100' : 'bg-blue-900/20 border-blue-500/30 text-blue-100'
  }`}>
    <h3 className="font-medium mb-2">{title}</h3>
    <p>{children}</p>
  </div>
);

const TabNavigation: React.FC<{
  tabs: TabConfiguration[];
  activeTab: string;
  competencyData: CompetencyData;
  onTabClick: (tabId: string) => void;
  className?: string;
}> = ({ tabs, activeTab, competencyData, onTabClick, className }) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 ${className || ''}`}>
    <div className="flex space-x-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          disabled={!tab.unlocked}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === tab.id
              ? 'bg-purple-600 text-white'
              : tab.unlocked
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span className="text-lg">{tab.icon}</span>
          <div>
            <div className="font-medium">{tab.label}</div>
            <div className="text-xs">{tab.description}</div>
          </div>
          {!tab.unlocked && <div className="text-lg">🔒</div>}
        </button>
      ))}
    </div>
  </div>
);

const ProgressSidebar: React.FC<{
  competencyData: CompetencyData;
  onAwardPoints: (points: number, category: string) => void;
  className?: string;
}> = ({ competencyData, onAwardPoints, className }) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 ${className || ''}`}>
    <h3 className="text-lg font-semibold text-white mb-4">Progress Overview</h3>
    
    <div className="space-y-4">
      <div>
        <div className="text-sm text-gray-400">Current Level</div>
        <div className="text-lg font-medium text-purple-400">{competencyData.currentLevel}</div>
      </div>
      
      <div>
        <div className="text-sm text-gray-400 mb-2">Total Progress</div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(100, (competencyData.totalProgressPoints / 1000) * 100)}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">{competencyData.totalProgressPoints} / 1000 pts</div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-300">Competency Areas</div>
        
        {[
          { key: 'Customer Analysis', current: competencyData.currentCustomerAnalysis, baseline: competencyData.baselineCustomerAnalysis },
          { key: 'Value Communication', current: competencyData.currentValueCommunication, baseline: competencyData.baselineValueCommunication },
          { key: 'Sales Execution', current: competencyData.currentSalesExecution, baseline: competencyData.baselineSalesExecution }
        ].map((area) => (
          <div key={area.key} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">{area.key}</span>
              <span className={`${area.current > area.baseline ? 'text-green-400' : 'text-gray-400'}`}>
                {area.current}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all"
                style={{ width: `${area.current}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const UnlockRequirementsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  tool: TabConfiguration | null;
  competencyData: CompetencyData;
}> = ({ isOpen, onClose, tool, competencyData }) => {
  if (!isOpen || !tool) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Methodology Locked</h2>
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">{tool.icon}</div>
          <h3 className="text-lg font-medium text-white mb-2">{tool.label}</h3>
          <p className="text-gray-400">{tool.description}</p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-white mb-2">Requirements:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Score {tool.requirementScore}+ in {tool.requirementCategory}</li>
            <li>• Achieve {tool.requirementLevel} level</li>
            <li>• Complete prerequisite activities</li>
          </ul>
        </div>
        
        <button
          onClick={onClose}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Continue Development
        </button>
      </div>
    </div>
  );
};

const ICPDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  icpContent: any;
  onProgressUpdate: (data: ProgressData) => void;
}> = ({ isOpen, onClose, icpContent, onProgressUpdate }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">ICP Analysis Deep-Dive</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="text-gray-300">
            <p>Interactive ICP analysis content would appear here...</p>
            <p className="text-sm text-gray-400 mt-4">This modal will contain the full ICP rating system and export tools.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PersonaDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  personaContent: any;
  onProgressUpdate: (data: ProgressData) => void;
}> = ({ isOpen, onClose, personaContent, onProgressUpdate }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Buyer Persona Deep-Dive</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="text-gray-300">
            <p>Interactive buyer persona content would appear here...</p>
            <p className="text-sm text-gray-400 mt-4">This modal will contain psychology profiles and practice scenarios.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder tool components
const ICPDisplay: React.FC = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold text-white mb-4">ICP Analysis Tool</h2>
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <p className="text-gray-300">ICP Analysis interface will be implemented here...</p>
    </div>
  </div>
);

const CostCalculator: React.FC = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold text-white mb-4">Cost Calculator Tool</h2>
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <p className="text-gray-300">Cost Calculator interface will be implemented here...</p>
    </div>
  </div>
);

const BusinessCaseBuilder: React.FC = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold text-white mb-4">Business Case Builder Tool</h2>
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <p className="text-gray-300">Business Case Builder interface will be implemented here...</p>
    </div>
  </div>
);

const EnhancedCustomerDashboard: React.FC<EnhancedCustomerDashboardProps> = ({ 
  customerId = 'mock-customer-id' 
}) => {
  // State management
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('icp-analysis');
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);
  const [selectedLockedTool, setSelectedLockedTool] = useState<TabConfiguration | null>(null);
  const [showICPModal, setShowICPModal] = useState<boolean>(false);
  const [showPersonaModal, setShowPersonaModal] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

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
  });

  // Tab configuration with professional unlock requirements
  const tabConfig: TabConfiguration[] = [
    {
      id: 'icp-analysis',
      label: 'ICP Analysis',
      description: 'Customer Intelligence Foundation',
      icon: '🎯',
      unlocked: competencyData.toolUnlockStates.icpUnlocked,
      component: ICPDisplay
    },
    {
      id: 'cost-calculator',
      label: 'Cost Calculator',
      description: 'Value Communication Methodology',
      icon: '💰',
      unlocked: competencyData.toolUnlockStates.costCalculatorUnlocked,
      requirementScore: 70,
      requirementCategory: 'valueCommunication',
      requirementLevel: 'Value Communication Developing',
      component: CostCalculator
    },
    {
      id: 'business-case',
      label: 'Business Case',
      description: 'Sales Execution Framework',
      icon: '📊',
      unlocked: competencyData.toolUnlockStates.businessCaseUnlocked,
      requirementScore: 70,
      requirementCategory: 'salesExecution',
      requirementLevel: 'Sales Strategy Proficient',
      component: BusinessCaseBuilder
    }
  ];

  // Handle mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load customer data and competency information
  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        setLoading(true);
        setError(null);

        const session = mockAuthService.getCurrentSession();
        if (!session || !session.recordId) {
          throw new Error('No valid session found. Please check your access link.');
        }

        // Load customer assets from Airtable (using mock service for now)
        const customerAssets = await mockAirtableService.getCustomerAssets(
          session.recordId,
          session.accessToken || ''
        );

        if (!customerAssets) {
          throw new Error('No customer data found');
        }

        setCustomerData(customerAssets);

        // Load competency data (would come from assessment integration in Phase 4)
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
        };

        setCompetencyData(enhancedCompetencyData);

      } catch (err) {
        console.error('Failed to load customer data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      loadCustomerData();
    }
  }, [customerId]);

  // Tab navigation handler with lock state checking
  const handleTabNavigation = useCallback((tabId: string) => {
    const tab = tabConfig.find(t => t.id === tabId);
    
    if (!tab) return;

    // Check if tab is unlocked
    if (!tab.unlocked) {
      setSelectedLockedTool(tab);
      setShowUnlockModal(true);
      return;
    }

    // Navigate to the tab (in real implementation, would use router)
    setActiveTab(tabId);
    console.log(`Navigating to tab: ${tabId}`);
  }, [tabConfig]);

  // Progress point award system with modal trigger handling
  const handleProgressUpdate = useCallback((progressData: ProgressData) => {
    awardProgressPoints(progressData.points, progressData.category);
  }, []);

  // Progress point award system
  const awardProgressPoints = useCallback(async (points: number, category: string) => {
    try {
      const updatedData = { ...competencyData };
      
      // Add points to total
      updatedData.totalProgressPoints += points;
      
      // Add points to specific category
      switch (category) {
        case 'customerAnalysis':
          updatedData.currentCustomerAnalysis = Math.min(100, updatedData.currentCustomerAnalysis + (points / 10));
          break;
        case 'valueCommunication':
          updatedData.currentValueCommunication = Math.min(100, updatedData.currentValueCommunication + (points / 10));
          break;
        case 'salesExecution':
          updatedData.currentSalesExecution = Math.min(100, updatedData.currentSalesExecution + (points / 10));
          break;
      }

      // Check for tool unlocks
      if (updatedData.currentValueCommunication >= 70 && !updatedData.toolUnlockStates.costCalculatorUnlocked) {
        updatedData.toolUnlockStates.costCalculatorUnlocked = true;
        // Show professional achievement notification
        console.log('Cost Calculator methodology unlocked!');
      }

      if (updatedData.currentSalesExecution >= 70 && !updatedData.toolUnlockStates.businessCaseUnlocked) {
        updatedData.toolUnlockStates.businessCaseUnlocked = true;
        // Show professional achievement notification
        console.log('Business Case framework unlocked!');
      }

      // Update level based on total points
      if (updatedData.totalProgressPoints >= 20000) {
        updatedData.currentLevel = 'Revenue Intelligence Master';
      } else if (updatedData.totalProgressPoints >= 10000) {
        updatedData.currentLevel = 'Market Execution Expert';
      } else if (updatedData.totalProgressPoints >= 5000) {
        updatedData.currentLevel = 'Revenue Development Advanced';
      } else if (updatedData.totalProgressPoints >= 2500) {
        updatedData.currentLevel = 'Sales Strategy Proficient';
      } else if (updatedData.totalProgressPoints >= 1000) {
        updatedData.currentLevel = 'Value Communication Developing';
      }

      setCompetencyData(updatedData);

      // In Phase 4, this would update Airtable
      // await airtableService.updateProgressPoints(customerId, points, category);

    } catch (error) {
      console.error('Error awarding progress points:', error);
    }
  }, [competencyData, customerId]);

  // Tool completion callbacks with progress tracking
  const toolCallbacks = {
    onICPComplete: useCallback(async (data: any) => {
      await awardProgressPoints(50, 'customerAnalysis');
      return data;
    }, [awardProgressPoints]),

    onCostCalculated: useCallback(async (data: any) => {
      await awardProgressPoints(75, 'valueCommunication');
      return data;
    }, [awardProgressPoints]),

    onBusinessCaseReady: useCallback(async (data: any) => {
      await awardProgressPoints(100, 'salesExecution');
      return data;
    }, [awardProgressPoints])
  };

  // Render current tool component with modal integration
  const renderActiveToolComponent = () => {
    const activeTabConfig = tabConfig.find(tab => tab.id === activeTab);
    if (!activeTabConfig || !activeTabConfig.unlocked) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-900 border border-gray-700 rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-medium text-white mb-2">Methodology Locked</h3>
            <p className="text-gray-400">Complete requirements to unlock this tool</p>
          </div>
        </div>
      );
    }

    // Enhanced ICP Display with modal integration
    if (activeTab === 'icp-analysis') {
      return (
        <div className="space-y-6">
          <ICPDisplay />
          
          {/* Professional Deep-Dive Actions */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Professional Deep-Dive Analysis</h3>
            <p className="text-gray-400 mb-6">
              Access comprehensive frameworks and interactive tools to master customer intelligence
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowICPModal(true)}
                className="flex items-center space-x-3 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg hover:bg-blue-900/30 transition-colors text-left"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🎯</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-300">ICP Analysis Deep-Dive</h4>
                  <p className="text-sm text-blue-100">Interactive rating system & export tools</p>
                  <p className="text-xs text-blue-400 mt-1">+90 progress points available</p>
                </div>
              </button>
              
              <button
                onClick={() => setShowPersonaModal(true)}
                className="flex items-center space-x-3 p-4 bg-green-900/20 border border-green-500/30 rounded-lg hover:bg-green-900/30 transition-colors text-left"
              >
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">👥</span>
                </div>
                <div>
                  <h4 className="font-medium text-green-300">Buyer Persona Deep-Dive</h4>
                  <p className="text-sm text-green-100">Psychology profiles & practice scenarios</p>
                  <p className="text-xs text-green-400 mt-1">+275 progress points available</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    }

    const ComponentToRender = activeTabConfig.component;
    return <ComponentToRender />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner 
          message="Loading professional competency dashboard..." 
          size="large"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Callout type="error" title="Dashboard Error">
            {error}
          </Callout>
        </div>
      </div>
    );
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
            {renderActiveToolComponent()}
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

      {/* ICP Detail Modal */}
      <ICPDetailModal
        isOpen={showICPModal}
        onClose={() => setShowICPModal(false)}
        icpContent={customerData?.icpContent}
        onProgressUpdate={handleProgressUpdate}
      />

      {/* Persona Detail Modal */}
      <PersonaDetailModal
        isOpen={showPersonaModal}
        onClose={() => setShowPersonaModal(false)}
        personaContent={customerData?.personaContent}
        onProgressUpdate={handleProgressUpdate}
      />
    </div>
  );
};

export default EnhancedCustomerDashboard;