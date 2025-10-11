'use client';

/**
 * Action Tracking Widgets Test Page
 *
 * Comprehensive test page for Chunk 2.4 - Action Tracking Widgets
 * Tests all 3 widgets with sample data and integration scenarios
 */

import React from 'react';
import RecentActionsWidget from '@/app/components/actions/RecentActionsWidget';
import ActionStatisticsWidget from '@/app/components/actions/ActionStatisticsWidget';
import SuggestedActionsWidget from '@/app/components/actions/SuggestedActionsWidget';
import { Activity, BarChart3, Lightbulb, CheckCircle } from 'lucide-react';

export default function TestActionWidgetsPage() {
  // Sample competency scores for SuggestedActionsWidget
  const competencyScores = {
    customerAnalysis: 65,
    valueCommunication: 55,
    salesExecution: 48
  };

  // Handle action tracking
  const handleTrackAction = (action: any) => {
    console.log('Track action:', action);
    alert(`Tracking action: ${action.name}\nPoints: ${action.potentialPoints}\nCategory: ${action.category}`);
  };

  // Handle action click
  const handleActionClick = (action: any) => {
    console.log('Action clicked:', action);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Action Tracking Widgets Test</h1>
            <p className="text-gray-400">Phase 2 - Chunk 2.4: Professional Action Tracking System</p>
          </div>
        </div>

        {/* Test Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-medium text-white">Recent Actions</h3>
            </div>
            <p className="text-xs text-gray-400">Last 10 professional actions with impact tracking</p>
          </div>

          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-medium text-white">Action Statistics</h3>
            </div>
            <p className="text-xs text-gray-400">Comprehensive analytics with chart visualizations</p>
          </div>

          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-5 h-5 text-green-400" />
              <h3 className="text-sm font-medium text-white">Suggested Actions</h3>
            </div>
            <p className="text-xs text-gray-400">Personalized recommendations with competency gaps</p>
          </div>
        </div>
      </div>

      {/* Widget Tests */}
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Test 1: Individual Widgets */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>Test 1: Individual Widgets (Default Sample Data)</span>
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {/* Recent Actions Widget */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Recent Actions Widget</h3>
              <RecentActionsWidget
                maxItems={10}
                showTimestamps={true}
                enableFiltering={true}
                onActionClick={handleActionClick}
              />
            </div>

            {/* Action Statistics Widget */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Action Statistics Widget</h3>
              <ActionStatisticsWidget />
            </div>

            {/* Suggested Actions Widget */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Suggested Actions Widget</h3>
              <SuggestedActionsWidget
                competencyScores={competencyScores}
                onTrackAction={handleTrackAction}
              />
            </div>
          </div>
        </section>

        {/* Test 2: Dashboard Layout Integration */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>Test 2: Dashboard Layout Integration</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Recent Actions */}
            <div className="lg:col-span-2">
              <RecentActionsWidget
                maxItems={8}
                showTimestamps={true}
                enableFiltering={true}
                onActionClick={handleActionClick}
              />
            </div>

            {/* Right Column - Suggested Actions */}
            <div>
              <SuggestedActionsWidget
                competencyScores={competencyScores}
                onTrackAction={handleTrackAction}
              />
            </div>

            {/* Full Width - Statistics */}
            <div className="lg:col-span-3">
              <ActionStatisticsWidget />
            </div>
          </div>
        </section>

        {/* Test 3: Different Competency Scenarios */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>Test 3: Different Competency Scenarios</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Beginner Profile */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Beginner Profile (Low Scores)</h3>
              <SuggestedActionsWidget
                competencyScores={{
                  customerAnalysis: 35,
                  valueCommunication: 30,
                  salesExecution: 25
                }}
                onTrackAction={handleTrackAction}
              />
            </div>

            {/* Advanced Profile */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Advanced Profile (High Scores)</h3>
              <SuggestedActionsWidget
                competencyScores={{
                  customerAnalysis: 72,
                  valueCommunication: 70,
                  salesExecution: 68
                }}
                onTrackAction={handleTrackAction}
              />
            </div>

            {/* Unbalanced Profile */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Unbalanced Profile (Focus Needed)</h3>
              <SuggestedActionsWidget
                competencyScores={{
                  customerAnalysis: 70,
                  valueCommunication: 45,
                  salesExecution: 60
                }}
                onTrackAction={handleTrackAction}
              />
            </div>

            {/* Expert Profile */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Expert Profile (Near Mastery)</h3>
              <SuggestedActionsWidget
                competencyScores={{
                  customerAnalysis: 74,
                  valueCommunication: 73,
                  salesExecution: 72
                }}
                onTrackAction={handleTrackAction}
              />
            </div>
          </div>
        </section>

        {/* Test 4: Widget Configuration Options */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>Test 4: Widget Configuration Options</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Actions - Compact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Recent Actions - Compact (5 items, no filter)</h3>
              <RecentActionsWidget
                maxItems={5}
                showTimestamps={true}
                enableFiltering={false}
              />
            </div>

            {/* Recent Actions - No Timestamps */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Recent Actions - No Timestamps</h3>
              <RecentActionsWidget
                maxItems={5}
                showTimestamps={false}
                enableFiltering={true}
              />
            </div>
          </div>
        </section>

        {/* Test Summary */}
        <section className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>Chunk 2.4 Test Summary</span>
          </h2>
          <div className="space-y-3 text-sm text-gray-300">
            <p>✅ <strong>RecentActionsWidget:</strong> 340 lines - Professional action tracking with filtering, expandable details, animations</p>
            <p>✅ <strong>ActionStatisticsWidget:</strong> 450 lines - Comprehensive analytics with pie/bar charts, time period filters, category breakdown</p>
            <p>✅ <strong>SuggestedActionsWidget:</strong> 400 lines - Personalized recommendations with competency gap analysis, priority scoring</p>
            <p className="mt-4 pt-4 border-t border-gray-700">
              <strong className="text-white">Total:</strong> 3 widgets, ~1,190 lines of TypeScript, Full responsive design, Professional dark theme
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
