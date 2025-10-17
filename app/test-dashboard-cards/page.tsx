'use client';

/**
 * Dashboard Cards Test Page
 *
 * Comprehensive test page for Chunk 2.5 - Competency Dashboard Cards
 * Tests all 5 dashboard cards with sample data and integration scenarios
 */

import React from 'react';
import MilestoneTrackerCard from '@/app/components/dashboard/MilestoneTrackerCard';
import NextUnlockCard from '@/app/components/dashboard/NextUnlockCard';
import DailyObjectivesCard from '@/app/components/dashboard/DailyObjectivesCard';
import ProgressiveToolAccessCard from '@/app/components/dashboard/ProgressiveToolAccessCard';
import CompetencyFeedbackCard from '@/app/components/dashboard/CompetencyFeedbackCard';
import { LayoutDashboard, Target, Award, CheckCircle } from 'lucide-react';

export default function TestDashboardCardsPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] p-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Cards Test</h1>
            <p className="text-text-secondary">Phase 2 - Chunk 2.5: Competency Dashboard Cards</p>
          </div>
        </div>

        {/* Test Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-medium text-white">Milestone Tracker</h3>
            </div>
            <p className="text-xs text-text-secondary">Progress and timeline tracking</p>
          </div>

          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-medium text-white">Next Unlock</h3>
            </div>
            <p className="text-xs text-text-secondary">Tool unlock preview</p>
          </div>

          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h3 className="text-sm font-medium text-white">Daily Objectives</h3>
            </div>
            <p className="text-xs text-text-secondary">Today's goals tracking</p>
          </div>

          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <LayoutDashboard className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-medium text-white">Tool Access</h3>
            </div>
            <p className="text-xs text-text-secondary">Progressive unlock status</p>
          </div>

          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <h3 className="text-sm font-medium text-white">Competency Feedback</h3>
            </div>
            <p className="text-xs text-text-secondary">Recent achievements</p>
          </div>
        </div>
      </div>

      {/* Widget Tests */}
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Test 1: Individual Cards (3-Column Grid) */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>Test 1: Individual Cards (Default Sample Data)</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MilestoneTrackerCard />
            <NextUnlockCard />
            <DailyObjectivesCard />
            <ProgressiveToolAccessCard />
            <CompetencyFeedbackCard />
          </div>
        </section>

        {/* Test 2: Dashboard Layout Integration (2-Column) */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>Test 2: Dashboard Layout Integration (80/20 Split)</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Main Content Area (4 columns) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MilestoneTrackerCard />
                <DailyObjectivesCard />
              </div>
              <CompetencyFeedbackCard />
            </div>

            {/* Sidebar (1 column) */}
            <div className="lg:col-span-1 space-y-6">
              <NextUnlockCard />
              <ProgressiveToolAccessCard />
            </div>
          </div>
        </section>

        {/* Test 3: Different Milestone Scenarios */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>Test 3: Different Milestone Scenarios</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* On Track Scenario */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">On Track (85% complete)</h3>
              <MilestoneTrackerCard
                currentMilestone={{
                  name: 'Growth → Expansion',
                  progress: 85,
                  target: 100,
                  dueDate: '2025-12-31'
                }}
                nextMilestone={{
                  name: 'Expansion → Scale',
                  estimatedStart: '2026-01-15'
                }}
                achievements={4}
                totalMilestones={6}
              />
            </div>

            {/* Behind Schedule */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Behind Schedule (45% complete)</h3>
              <MilestoneTrackerCard
                currentMilestone={{
                  name: 'Foundation → Growth',
                  progress: 45,
                  target: 100,
                  dueDate: '2025-11-30'
                }}
                nextMilestone={{
                  name: 'Growth → Expansion',
                  estimatedStart: '2026-01-01'
                }}
                achievements={1}
                totalMilestones={6}
              />
            </div>

            {/* Nearly Complete */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Nearly Complete (95% complete)</h3>
              <MilestoneTrackerCard
                currentMilestone={{
                  name: 'Expansion → Scale',
                  progress: 95,
                  target: 100,
                  dueDate: '2025-12-25'
                }}
                nextMilestone={{
                  name: 'Scale → Enterprise',
                  estimatedStart: '2026-01-05'
                }}
                achievements={5}
                totalMilestones={6}
              />
            </div>
          </div>
        </section>

        {/* Test 4: Compact Dashboard View */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>Test 4: Compact Dashboard View (All Cards)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <MilestoneTrackerCard className="h-full" />
            <NextUnlockCard className="h-full" />
            <DailyObjectivesCard className="h-full" />
            <ProgressiveToolAccessCard className="h-full" />
            <CompetencyFeedbackCard className="h-full md:col-span-2 xl:col-span-1" />
          </div>
        </section>

        {/* Test Summary */}
        <section className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>Chunk 2.5 Test Summary</span>
          </h2>
          <div className="space-y-3 text-sm text-gray-300">
            <p>✅ <strong>MilestoneTrackerCard:</strong> 260 lines - Progress tracking, time metrics, expandable details, forecast calculation</p>
            <p>✅ <strong>NextUnlockCard:</strong> 245 lines - Tool preview, competency requirements, progress tracking, capability preview</p>
            <p>✅ <strong>DailyObjectivesCard:</strong> 280 lines - Daily goals, completion tracking, streak display, interactive checkboxes</p>
            <p>✅ <strong>ProgressiveToolAccessCard:</strong> 210 lines - All tools status, unlock progress, compact overview</p>
            <p>✅ <strong>CompetencyFeedbackCard:</strong> 250 lines - Achievement stream, skill gains, encouragement messages</p>
            <p className="mt-4 pt-4 border-t border-gray-700">
              <strong className="text-white">Total:</strong> 5 dashboard cards, ~1,245 lines of TypeScript, Full responsive design, Professional dark theme
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
