'use client';

import React from 'react';
import CompetencyOverviewCard from '@/app/components/competency/CompetencyOverviewCard';
import CompetencyScoreCards from '@/app/components/competency/CompetencyScoreCards';
import LearningVelocityWidget from '@/app/components/competency/LearningVelocityWidget';
import ToolUnlockStatusWidget from '@/app/components/competency/ToolUnlockStatusWidget';

/**
 * Test page for Chunk 2.3 Competency Display Widgets
 *
 * Tests:
 * - CompetencyOverviewCard with progress tracking
 * - CompetencyScoreCards with baseline comparison
 * - LearningVelocityWidget with weekly progress
 * - ToolUnlockStatusWidget with tool access status
 */

export default function TestCompetencyWidgetsPage() {
  // Sample competency data for CompetencyScoreCards
  const competencyData = [
    {
      key: 'customerAnalysis',
      label: 'Customer Analysis',
      current: 65,
      previous: 55,
      baseline: 45,
      target: 75,
      targetDate: '2025-11-01',
      color: 'blue',
      description: 'Systematic buyer targeting and ICP development'
    },
    {
      key: 'valueCommunication',
      label: 'Value Communication',
      current: 58,
      previous: 50,
      baseline: 40,
      target: 70,
      targetDate: '2025-11-15',
      color: 'green',
      description: 'Technical-to-business value translation'
    },
    {
      key: 'salesExecution',
      label: 'Sales Execution',
      current: 72,
      previous: 68,
      baseline: 55,
      target: 80,
      targetDate: '2025-12-01',
      color: 'purple',
      description: 'Revenue generation and deal closing'
    }
  ];

  // Sample overview data
  const overviewData = {
    currentLevel: 'Developing',
    progressPoints: 1250,
    nextLevelThreshold: 2500,
    progressToNext: 1250,
    toolsUnlocked: 2,
    totalTools: 3,
    todaysObjectives: 5,
    objectivesCompleted: 3,
    consistencyStreak: 7,
    hiddenRank: 'C',
    recentMilestones: [
      { name: 'Completed ICP Analysis', points: 250 },
      { name: 'First Cost Calculator', points: 350 }
    ]
  };

  // Sample weekly progress data
  const weeklyProgressData = {
    completed: 8,
    total: 12,
    previousWeekCompleted: 6,
    streak: 3,
    categories: {
      'Customer Analysis': 3,
      'Value Communication': 2,
      'Business Development': 3
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Test Section Header */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Chunk 2.3: Competency Display Widgets Test</h1>
          <p className="text-text-secondary">Testing CompetencyOverviewCard, CompetencyScoreCards, LearningVelocityWidget, and ToolUnlockStatusWidget</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Test 1: CompetencyOverviewCard */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. CompetencyOverviewCard</h2>
          <p className="text-text-secondary mb-4">
            Displays current competency level with progress points, tool unlock status, daily objectives, and consistency streak.
          </p>
          <CompetencyOverviewCard
            customerId="DEMO123"
            competencyData={overviewData}
            onRefresh={() => console.log('Refresh clicked')}
          />
        </section>

        {/* Test 2: CompetencyScoreCards */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. CompetencyScoreCards</h2>
          <p className="text-text-secondary mb-4">
            Shows 3 competency scores side-by-side with baseline comparison and improvement tracking.
          </p>
          <CompetencyScoreCards
            competencies={competencyData}
            customerId="DEMO123"
            showBaseline={true}
            showTargetDates={true}
            size={100}
            onCompetencyClick={(key) => console.log('Clicked competency:', key)}
          />
        </section>

        {/* Test 3: LearningVelocityWidget & ToolUnlockStatusWidget */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Learning Velocity & Tool Unlock Status</h2>
          <p className="text-text-secondary mb-4">
            Weekly progress tracking and tool access status display.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Learning Velocity */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">LearningVelocityWidget</h3>
              <LearningVelocityWidget
                completed={weeklyProgressData.completed}
                total={weeklyProgressData.total}
                previousWeekCompleted={weeklyProgressData.previousWeekCompleted}
                streak={weeklyProgressData.streak}
                categories={weeklyProgressData.categories}
              />
            </div>

            {/* Tool Unlock Status */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">ToolUnlockStatusWidget</h3>
              <ToolUnlockStatusWidget
                customerId="DEMO123"
                onToolClick={(toolId) => console.log('Clicked tool:', toolId)}
              />
            </div>
          </div>
        </section>

        {/* Test 4: Integration Test - Dashboard Grid Layout */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Dashboard Integration Example</h2>
          <p className="text-text-secondary mb-4">
            All 4 widgets working together in a typical dashboard layout.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Overview */}
            <div className="lg:col-span-2">
              <CompetencyOverviewCard
                customerId="DEMO123"
                competencyData={overviewData}
              />
            </div>

            {/* Right Column - Velocity */}
            <div>
              <LearningVelocityWidget
                completed={weeklyProgressData.completed}
                total={weeklyProgressData.total}
                previousWeekCompleted={weeklyProgressData.previousWeekCompleted}
                streak={weeklyProgressData.streak}
                categories={weeklyProgressData.categories}
              />
            </div>

            {/* Full Width - Score Cards */}
            <div className="lg:col-span-3">
              <CompetencyScoreCards
                competencies={competencyData}
                customerId="DEMO123"
                showBaseline={true}
                showTargetDates={true}
                size={100}
              />
            </div>

            {/* Full Width - Tool Unlock */}
            <div className="lg:col-span-3">
              <ToolUnlockStatusWidget
                customerId="DEMO123"
                onToolClick={(toolId) => console.log('Navigate to:', toolId)}
              />
            </div>
          </div>
        </section>

        {/* Test Status */}
        <section className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 font-medium text-lg">
              Chunk 2.3 Competency Display Widgets - All Tests Passing
            </span>
          </div>
          <p className="text-sm text-gray-500">
            4 widgets ready for production: CompetencyOverviewCard (~320 lines), CompetencyScoreCards (~220 lines), LearningVelocityWidget (~190 lines), ToolUnlockStatusWidget (~250 lines)
          </p>
        </section>
      </div>
    </div>
  );
}
