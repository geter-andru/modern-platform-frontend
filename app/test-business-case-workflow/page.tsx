'use client';

/**
 * End-to-End Business Case Workflow Test Page
 *
 * Tests the complete integration:
 * ICP Analysis → Cost Calculator → Business Case Builder → Export
 *
 * This page demonstrates the TIER 1 Priority #1 workflow from
 * VALUE_DRIVEN_PRIORITIZATION.md
 */

import React, { useState } from 'react';
import { ModernCard } from '@/src/shared/components/ui/ModernCard';
import SimplifiedCostCalculator from '@/src/features/cost-business-case/cost-calculator/SimplifiedCostCalculator';
import SimplifiedBusinessCaseBuilder from '@/src/features/cost-business-case/business-case/SimplifiedBusinessCaseBuilder';
import type { CostCalculatorResults } from '@/src/features/cost-business-case/cost-calculator/CostCalculatorTypes';
import type { BusinessCaseData, ExportFormat } from '@/src/features/cost-business-case/business-case/BusinessCaseTypes';

export default function BusinessCaseWorkflowTest() {
  const [activeTab, setActiveTab] = useState<'overview' | 'icp' | 'calculator' | 'business-case'>('overview');
  const [costCalculatorId, setCostCalculatorId] = useState<string | undefined>();
  const [icpAnalysisId] = useState<string>('test-icp-001'); // Mock ICP ID for testing

  // Handle cost calculation save
  const handleCostCalculationSave = async (results: CostCalculatorResults) => {
    console.log('Cost calculation saved:', results);
    setCostCalculatorId(results.id);

    // Auto-advance to Business Case Builder
    setTimeout(() => {
      setActiveTab('business-case');
      alert(`Cost calculation saved! ID: ${results.id}\n\nMoving to Business Case Builder with auto-population...`);
    }, 1000);
  };

  // Handle business case save
  const handleBusinessCaseSave = async (data: BusinessCaseData) => {
    console.log('Business case saved:', data);
    alert('Business case saved successfully!');
  };

  // Handle business case export
  const handleBusinessCaseExport = async (data: BusinessCaseData, format: ExportFormat) => {
    console.log('Business case exported:', format, data);
  };

  const tabs = [
    { id: 'overview' as const, label: 'Workflow Overview', icon: '📋' },
    { id: 'icp' as const, label: 'ICP Analysis', icon: '🎯' },
    { id: 'calculator' as const, label: 'Cost Calculator', icon: '💰' },
    { id: 'business-case' as const, label: 'Business Case', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-2 bg-purple-900/30 border border-purple-700/50 rounded-full text-purple-300 text-sm font-semibold mb-4">
            TIER 1 PRIORITY #1 - End-to-End Workflow Test
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Business Case Builder Workflow
          </h1>

          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Complete integration testing: ICP Analysis → Cost Calculator → Business Case Builder → Export
          </p>

          {/* Status Indicators */}
          <div className="flex items-center justify-center space-x-6 pt-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${icpAnalysisId ? 'bg-green-500' : 'bg-slate-600'}`}></div>
              <span className="text-sm text-slate-400">ICP Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${costCalculatorId ? 'bg-green-500' : 'bg-slate-600'}`}></div>
              <span className="text-sm text-slate-400">Cost Calculator</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${costCalculatorId && icpAnalysisId ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
              <span className="text-sm text-slate-400">Business Case</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white border-b-2 border-purple-400'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              } rounded-t-lg`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <ModernCard className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">🎯 Workflow Overview</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Step 1 */}
                    <div className="p-6 bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-700/30 rounded-lg">
                      <div className="text-4xl mb-4">🎯</div>
                      <h3 className="text-lg font-bold text-blue-300 mb-2">Step 1: ICP Analysis</h3>
                      <p className="text-sm text-slate-400 mb-4">
                        Understand your Ideal Customer Profile with detailed buyer personas
                      </p>
                      <ul className="text-xs text-slate-500 space-y-1">
                        <li>• 2 Buyer Personas</li>
                        <li>• Demographics & Psychographics</li>
                        <li>• Goals & Pain Points</li>
                        <li>• Decision Influence</li>
                      </ul>
                    </div>

                    {/* Step 2 */}
                    <div className="p-6 bg-gradient-to-br from-orange-900/20 to-orange-800/10 border border-orange-700/30 rounded-lg">
                      <div className="text-4xl mb-4">💰</div>
                      <h3 className="text-lg font-bold text-orange-300 mb-2">Step 2: Cost Calculator</h3>
                      <p className="text-sm text-slate-400 mb-4">
                        Quantify the cost of inaction with 4 cost factors
                      </p>
                      <ul className="text-xs text-slate-500 space-y-1">
                        <li>• Delayed Revenue</li>
                        <li>• Competitive Disadvantage</li>
                        <li>• Team Inefficiency</li>
                        <li>• Missed Opportunities</li>
                      </ul>
                    </div>

                    {/* Step 3 */}
                    <div className="p-6 bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30 rounded-lg">
                      <div className="text-4xl mb-4">📊</div>
                      <h3 className="text-lg font-bold text-purple-300 mb-2">Step 3: Business Case</h3>
                      <p className="text-sm text-slate-400 mb-4">
                        Auto-populate professional one-page business case
                      </p>
                      <ul className="text-xs text-slate-500 space-y-1">
                        <li>• 7 Template Sections</li>
                        <li>• 70% Auto-Populated</li>
                        <li>• Confidence Tracking</li>
                        <li>• PDF/DOCX/HTML Export</li>
                      </ul>
                    </div>
                  </div>

                  {/* Data Flow Diagram */}
                  <div className="mt-8 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4">📊 Data Flow</h3>
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <div className="px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-lg text-blue-300">
                        ICP Analysis
                      </div>
                      <div className="text-slate-500">→</div>
                      <div className="px-4 py-2 bg-orange-900/30 border border-orange-700/50 rounded-lg text-orange-300">
                        Cost Calculator
                      </div>
                      <div className="text-slate-500">→</div>
                      <div className="px-4 py-2 bg-purple-900/30 border border-purple-700/50 rounded-lg text-purple-300">
                        Business Case Builder
                      </div>
                      <div className="text-slate-500">→</div>
                      <div className="px-4 py-2 bg-green-900/30 border border-green-700/50 rounded-lg text-green-300">
                        Export (PDF/DOCX/HTML)
                      </div>
                    </div>
                  </div>

                  {/* Quick Start */}
                  <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                    <h4 className="font-semibold text-blue-300 mb-2">🚀 Quick Start</h4>
                    <ol className="text-sm text-slate-400 space-y-2">
                      <li>1. <strong className="text-white">ICP Analysis</strong>: Review mock buyer persona data (Sarah Chen CEO, Marcus Rodriguez VP Sales)</li>
                      <li>2. <strong className="text-white">Cost Calculator</strong>: Calculate costs and click "Save Calculation"</li>
                      <li>3. <strong className="text-white">Business Case</strong>: Watch auto-population from ICP + Cost Calculator</li>
                      <li>4. <strong className="text-white">Export</strong>: Download as PDF, DOCX, or HTML</li>
                    </ol>
                  </div>

                  {/* Start Button */}
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setActiveTab('calculator')}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
                    >
                      Start Workflow Test →
                    </button>
                  </div>
                </div>
              </ModernCard>
            </div>
          )}

          {/* ICP Analysis Tab */}
          {activeTab === 'icp' && (
            <ModernCard className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">🎯 ICP Analysis (Mock Data)</h2>

              <div className="space-y-6">
                <div className="p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                  <p className="text-sm text-slate-300">
                    <strong className="text-blue-300">Mock ICP ID:</strong> {icpAnalysisId}
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    This test uses mock ICP data with 2 buyer personas. In production, this would be real data from the ICP Analysis feature.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Persona 1 */}
                  <div className="p-6 bg-slate-800 border border-slate-700 rounded-lg">
                    <h3 className="text-lg font-bold text-white mb-4">Sarah Chen - CEO & Co-Founder</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="text-slate-400">Goals:</div>
                        <div className="text-white">Scale from $2M to $10M ARR in 18 months</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Pain Points:</div>
                        <div className="text-white">Cannot accurately forecast revenue pipeline</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Values:</div>
                        <div className="text-white">Data-driven decision making, Systematic efficiency</div>
                      </div>
                    </div>
                  </div>

                  {/* Persona 2 */}
                  <div className="p-6 bg-slate-800 border border-slate-700 rounded-lg">
                    <h3 className="text-lg font-bold text-white mb-4">Marcus Rodriguez - VP Sales</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="text-slate-400">Goals:</div>
                        <div className="text-white">Improve win rate from 15% to 30%</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Pain Points:</div>
                        <div className="text-white">Cannot articulate business value to CFOs</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Values:</div>
                        <div className="text-white">Results-driven execution, Team enablement</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <button
                    onClick={() => setActiveTab('calculator')}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
                  >
                    Continue to Cost Calculator →
                  </button>
                </div>
              </div>
            </ModernCard>
          )}

          {/* Cost Calculator Tab */}
          {activeTab === 'calculator' && (
            <div>
              <SimplifiedCostCalculator
                {...({
                  customerId: "test-customer-001",
                  customerData: {
                    currentARR: '$2M',
                    targetARR: '$10M',
                    growthStage: 'rapid_scaling'
                  },
                  onCalculationComplete: (results: any) => {
                    console.log('Calculation complete:', results);
                  },
                  onSave: handleCostCalculationSave
                } as any)}
              />
            </div>
          )}

          {/* Business Case Tab */}
          {activeTab === 'business-case' && (
            <div>
              <SimplifiedBusinessCaseBuilder
                {...({
                  icpAnalysisId,
                  costCalculatorId,
                  onSave: handleBusinessCaseSave,
                  onExport: handleBusinessCaseExport
                } as any)}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-slate-500 text-sm">
          <p>Business Case Builder - TIER 1 Priority #1 | DAY 6 End-to-End Testing</p>
          <p className="mt-2">Phase 5.1: Cost Calculator & Business Case Builder Integration</p>
        </div>
      </div>
    </div>
  );
}
