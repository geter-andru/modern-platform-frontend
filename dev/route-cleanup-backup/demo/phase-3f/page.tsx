'use client'

/**
 * Phase 3F Progressive Engagement Demo Page
 * 
 * Showcases all migrated progressive engagement components in action
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WelcomeHero from '../../../src/shared/components/progressive-engagement/WelcomeHero';
import ProgressiveEngagementContainer from '../../../src/shared/components/progressive-engagement/ProgressiveEngagementContainer';
import CompellingAspectDemo from '../../../src/shared/components/progressive-engagement/CompellingAspectDemo';
import IntegratedIntelligenceReveal from '../../../src/shared/components/progressive-engagement/IntegratedIntelligenceReveal';
import SuccessMetricsDisplay, { useSuccessMetrics } from '../../../src/shared/components/progressive-engagement/SuccessMetrics';

// Mock customer data for demo
const mockCustomerData = {
  customerName: "Demo User",
  company: "Tech Innovations Inc",
  company_size: "50-200 employees",
  detailedIcpAnalysis: {
    score: 8.5,
    tier: "Champion",
    fit_reasons: ["Strong product-market fit", "High growth potential", "Technical sophistication"]
  },
  targetBuyerPersonas: [
    {
      title: "VP of Engineering",
      pain_points: ["Technical debt management", "Team productivity", "Infrastructure scaling"],
      motivations: ["Operational efficiency", "Technology leadership", "Cost optimization"]
    }
  ]
};

const mockCompletedAnalysisData = {
  icp_analysis: {
    score: 8.5,
    tier: "Champion",
    confidence: 94
  },
  cost_calculator: {
    totalCost: 127000,
    monthlyImpact: 21000,
    confidence: 97
  },
  business_case: {
    roi: 340,
    timeframe: "12 months",
    confidence: 91
  }
};

export default function Phase3FDemo() {
  const [currentDemo, setCurrentDemo] = useState<string>('welcome');
  const [aspectType, setAspectType] = useState<string>('immediate_rating');
  
  // Success metrics tracking
  const successMetrics = useSuccessMetrics('demo-user-123');

  const handleEngagement = (engagementType: string) => {
    successMetrics.trackEngagement('engagement_started', { type: engagementType });
    console.log('Engagement started:', engagementType);
  };

  const handleAspectEngagement = (aspectType: string, data?: any) => {
    successMetrics.trackEngagement('compelling_aspect_engaged', { aspectType, data });
    console.log('Aspect engaged:', aspectType, data);
  };

  const handleToolCompletion = (toolName: string, completionData: any) => {
    successMetrics.trackEngagement('tool_completed', { toolName, completionData });
    console.log('Tool completed:', toolName, completionData);
  };

  const handleAdvancedAccess = (capabilityName: string, accessData?: any) => {
    successMetrics.trackEngagement('advanced_methodology_unlocked', { capabilityName, accessData });
    console.log('Advanced access:', capabilityName, accessData);
  };

  const renderCurrentDemo = () => {
    switch (currentDemo) {
      case 'welcome':
        return (
          <WelcomeHero
            customerId="demo-user-123"
            customerData={mockCustomerData}
            onStartEngagement={handleEngagement}
          />
        );
      
      case 'container':
        return (
          <ProgressiveEngagementContainer
            customerId="demo-user-123"
            onToolCompletion={handleToolCompletion}
          />
        );
      
      case 'aspect':
        return (
          <CompellingAspectDemo
            aspectType={aspectType}
            onEngageWith={handleAspectEngagement}
            customerData={mockCustomerData}
          />
        );
      
      case 'reveal':
        return (
          <IntegratedIntelligenceReveal
            customerId="demo-user-123"
            completedAnalysisData={mockCompletedAnalysisData}
            onAdvancedAccess={handleAdvancedAccess}
          />
        );
      
      case 'metrics':
        return (
          <div className="max-w-4xl mx-auto">
            <SuccessMetricsDisplay
              metrics={successMetrics.metrics}
              insights={successMetrics.getEngagementInsights()}
              className="mb-6"
            />
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/30">
              <h3 className="text-lg font-semibold text-white mb-4">Interactions Log</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {successMetrics.interactions.map((interaction, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-700/30 rounded border border-gray-600/30">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-400 font-medium">{interaction.type}</span>
                      <span className="text-gray-400 text-xs">
                        {new Date(interaction.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {Object.keys(interaction.data).length > 0 && (
                      <div className="text-gray-300 text-xs mt-1">
                        {JSON.stringify(interaction.data, null, 2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Phase 3F Demo</h1>
              <p className="text-gray-400">Progressive Engagement System Migration Showcase</p>
            </div>
            <div className="text-sm text-green-400 bg-green-900/30 px-3 py-1 rounded-full border border-green-500/30">
              ✅ Migration Complete
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="container mx-auto px-6 py-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600/30 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Component Showcase</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { id: 'welcome', name: 'Welcome Hero', icon: '🎯' },
              { id: 'container', name: 'Container', icon: '🏗️' },
              { id: 'aspect', name: 'Aspect Demo', icon: '✨' },
              { id: 'reveal', name: 'Intelligence Reveal', icon: '🏆' },
              { id: 'metrics', name: 'Success Metrics', icon: '📊' }
            ].map((demo) => (
              <button
                key={demo.id}
                onClick={() => setCurrentDemo(demo.id)}
                className={`p-3 rounded-lg text-center transition-all duration-200 border ${
                  currentDemo === demo.id
                    ? 'bg-blue-600/30 border-blue-500/50 text-blue-300'
                    : 'bg-gray-700/30 border-gray-600/30 text-gray-300 hover:bg-gray-600/30 hover:border-gray-500/50'
                }`}
              >
                <div className="text-2xl mb-1">{demo.icon}</div>
                <div className="text-sm font-medium">{demo.name}</div>
              </button>
            ))}
          </div>

          {/* Aspect Type Selector (for Aspect Demo) */}
          {currentDemo === 'aspect' && (
            <div className="mt-4 pt-4 border-t border-gray-600/30">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Aspect Type:</h3>
              <div className="flex space-x-2">
                {[
                  { id: 'immediate_rating', name: 'ICP Rating', icon: '🎯' },
                  { id: 'financial_impact', name: 'Financial Impact', icon: '💰' },
                  { id: 'business_case', name: 'Business Case', icon: '📋' }
                ].map((aspect) => (
                  <button
                    key={aspect.id}
                    onClick={() => setAspectType(aspect.id)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 border ${
                      aspectType === aspect.id
                        ? 'bg-purple-600/30 border-purple-500/50 text-purple-300'
                        : 'bg-gray-700/30 border-gray-600/30 text-gray-300 hover:bg-gray-600/30'
                    }`}
                  >
                    {aspect.icon} {aspect.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Demo Component Display */}
        <motion.div
          key={currentDemo + aspectType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="min-h-[600px]"
        >
          {renderCurrentDemo()}
        </motion.div>

        {/* Component Information */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
          <h3 className="text-lg font-semibold text-white mb-4">Migration Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-blue-400 mb-2">Technical Achievements</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>✅ Full TypeScript conversion with comprehensive interfaces</li>
                <li>✅ Next.js 15 + React 19 compatibility maintained</li>
                <li>✅ All Framer Motion animations preserved</li>
                <li>✅ Client-side functionality properly handled</li>
                <li>✅ Error boundaries and graceful fallbacks implemented</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-green-400 mb-2">Component Status</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>🎯 WelcomeHero: 500+ lines migrated</li>
                <li>🏗️ ProgressiveEngagementContainer: 310+ lines migrated</li>
                <li>✨ CompellingAspectDemo: 338+ lines migrated</li>
                <li>🏆 IntegratedIntelligenceReveal: 566+ lines migrated</li>
                <li>📊 SuccessMetrics: 366+ lines migrated</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}