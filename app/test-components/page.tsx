'use client';

import React from 'react';
import ModernCard, {
  ModernCardHeader,
  ModernCardContent,
  ModernCardFooter,
  ModernMetricCard,
  ModernGridContainer
} from '@/app/components/ui/ModernCard';
import ModernCircularProgress, {
  ModernProgressGroup,
  ModernMiniProgress
} from '@/app/components/ui/ModernCircularProgress';
import CircularProgressPremium, {
  CompetencyGrid,
  NextMilestonePreview
} from '@/app/components/ui/CircularProgressPremium';
import { Target, TrendingUp, Users } from 'lucide-react';

/**
 * Test page for Chunk 2.1 Foundation UI Components
 *
 * Tests:
 * - ModernCard with all variants
 * - ModernCircularProgress with different colors and sizes
 * - CircularProgressPremium with trends and targets
 */

export default function TestComponentsPage() {
  const competencies = [
    {
      key: 'customerAnalysis',
      label: 'Customer Analysis',
      current: 75,
      previous: 65,
      target: 80,
      targetDate: '2025-11-01'
    },
    {
      key: 'valueCommunication',
      label: 'Value Communication',
      current: 60,
      previous: 55,
      target: 70,
      targetDate: '2025-11-15'
    },
    {
      key: 'salesExecution',
      label: 'Sales Execution',
      current: 45,
      previous: 50,
      target: 70,
      targetDate: '2025-12-01'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Chunk 2.1: Foundation UI Components</h1>
          <p className="text-gray-400">Testing ModernCard, ModernCircularProgress, and CircularProgressPremium</p>
        </div>

        {/* Section 1: ModernCard Variants */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">1. ModernCard Variants</h2>
          <ModernGridContainer>
            <ModernCard variant="default" size="small">
              <ModernCardHeader title="Default Card" subtitle="Standard variant" />
              <ModernCardContent>
                <p className="text-gray-300">This is a default card with medium padding and hover effects.</p>
              </ModernCardContent>
            </ModernCard>

            <ModernCard variant="highlighted" size="small">
              <ModernCardHeader title="Highlighted" subtitle="Purple accent" icon={Target} />
              <ModernCardContent>
                <p className="text-gray-300">Highlighted card with purple border and ring.</p>
              </ModernCardContent>
            </ModernCard>

            <ModernCard variant="success" size="small">
              <ModernCardHeader title="Success" subtitle="Green accent" />
              <ModernCardContent>
                <p className="text-gray-300">Success variant with green border.</p>
              </ModernCardContent>
            </ModernCard>

            <ModernCard variant="glass" size="small">
              <ModernCardHeader title="Glass" subtitle="Blur effect" />
              <ModernCardContent>
                <p className="text-gray-300">Glass morphism effect with backdrop blur.</p>
              </ModernCardContent>
            </ModernCard>
          </ModernGridContainer>
        </section>

        {/* Section 2: Metric Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">2. ModernMetricCard</h2>
          <ModernGridContainer>
            <ModernMetricCard
              title="Total Points"
              value="12,540"
              subtitle="Revenue Intelligence"
              change="+12.5%"
              changeType="positive"
              icon={TrendingUp}
            />

            <ModernMetricCard
              title="Active Users"
              value="247"
              subtitle="This month"
              change="-3.2%"
              changeType="negative"
              icon={Users}
            />

            <ModernMetricCard
              title="Competency Level"
              value="Advanced"
              subtitle="Market Execution Expert"
              icon={Target}
            />
          </ModernGridContainer>
        </section>

        {/* Section 3: ModernCircularProgress */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">3. ModernCircularProgress</h2>
          <ModernProgressGroup className="bg-gray-900 p-8 rounded-xl">
            <ModernCircularProgress
              percentage={75}
              color="purple"
              label="Customer Analysis"
              size={120}
            />
            <ModernCircularProgress
              percentage={60}
              color="blue"
              label="Value Communication"
              size={120}
            />
            <ModernCircularProgress
              percentage={45}
              color="orange"
              label="Sales Execution"
              size={120}
            />
          </ModernProgressGroup>
        </section>

        {/* Section 4: Mini Progress */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">4. ModernMiniProgress</h2>
          <div className="flex items-center gap-6 bg-gray-900 p-6 rounded-xl">
            <ModernMiniProgress percentage={85} color="green" label="ICP" size={60} />
            <ModernMiniProgress percentage={70} color="blue" label="Persona" size={60} />
            <ModernMiniProgress percentage={50} color="orange" label="Market" size={60} />
            <ModernMiniProgress percentage={30} color="red" label="Strategy" size={60} />
          </div>
        </section>

        {/* Section 5: CircularProgressPremium */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">5. CircularProgressPremium with Trends</h2>
          <div className="bg-gray-900 p-8 rounded-xl">
            <CompetencyGrid competencies={competencies} size={100} />
          </div>
        </section>

        {/* Section 6: Next Milestone */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">6. NextMilestonePreview</h2>
          <ModernCard size="auto" padding="default">
            <NextMilestonePreview
              milestone={{
                name: 'Market Execution Expert',
                description: 'Unlock advanced sales intelligence tools'
              }}
              completionPercentage={67}
            />
          </ModernCard>
        </section>

        {/* Section 7: Complex Card Example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">7. Complex Card with All Features</h2>
          <ModernCard variant="highlighted" size="auto">
            <ModernCardHeader
              title="Competency Progress Dashboard"
              subtitle="Track your revenue intelligence development"
              icon={Target}
              action={
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  View Details
                </button>
              }
            />
            <ModernCardContent>
              <ModernProgressGroup>
                <ModernCircularProgress
                  percentage={75}
                  color="purple"
                  label="Overall Progress"
                  size={100}
                />
                <div className="text-left space-y-2">
                  <p className="text-sm text-gray-400">Current Level</p>
                  <p className="text-xl font-bold text-white">Market Execution Expert</p>
                  <p className="text-sm text-gray-500">2,500 points to next level</p>
                </div>
              </ModernProgressGroup>
            </ModernCardContent>
            <ModernCardFooter>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Last updated: Just now</span>
                <span className="text-sm text-purple-400 font-medium">12,540 total points</span>
              </div>
            </ModernCardFooter>
          </ModernCard>
        </section>

        {/* Test Status */}
        <section className="text-center space-y-2 py-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-900/20 border border-green-500/30 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 font-medium">All Components Rendering Successfully</span>
          </div>
          <p className="text-sm text-gray-500">Chunk 2.1 Foundation UI Components - Ready for Production</p>
        </section>
      </div>
    </div>
  );
}
