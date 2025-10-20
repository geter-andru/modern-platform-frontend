'use client';

/**
 * CompetencyDevelopmentView - Consolidated Competency Tracking & Development Focus
 *
 * Combines CompetencyOverview + DevelopmentFocus into a single unified view
 * Answers the question: "What should I develop?"
 *
 * Features:
 * - Detailed competency breakdowns with baseline tracking
 * - Assessment insights and recommendations
 * - Next tool unlock progress and requirements
 * - Development session planning
 * - Professional milestone achievements
 * - Tab-based navigation (Overview | Development Plan | Assessments)
 *
 * Integrated Widgets:
 * - TabNavigation (sub-view switcher)
 * - AssessmentInsights (assessment results)
 * - CircularCompetencyGauge (detailed competency charts)
 * - NextUnlockIndicator (unlock preview)
 * - NextUnlockProgress (progress tracking)
 * - InteractiveFilters (competency filters)
 * - SummaryMetric (competency stats)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Play,
  Sparkles,
  AlertCircle,
  Lock,
  Unlock,
  Star
} from 'lucide-react';
import { ProgressLineChart } from './widgets/ProgressLineChart';
import { CumulativeAreaChart } from './widgets/CumulativeAreaChart';
import { TaskRecommendations } from './widgets/TaskRecommendations';
import { useCompetencyDevelopmentData } from '@/app/lib/hooks/useDashboardData';
import { useMilestones } from '@/app/lib/hooks/useAPI';
import { useTasks } from '@/app/lib/hooks/useTasks';

// ==================== TYPE DEFINITIONS ====================

export type CompetencyLevel = 'foundation' | 'developing' | 'proficient' | 'advanced' | 'expert';

export type TabView = 'overview' | 'development' | 'assessments';

export interface CompetencyData {
  name: string;
  current: number;
  baseline: number | null;
  required: number;
  color: string;
  growth: number; // Percentage growth from baseline
}

export interface NextUnlock {
  name: string;
  benefits: string;
  currentProgress: number;
  requiredProgress: number;
  pointsNeeded: number;
  toolIcon?: string;
  requirements: {
    competency: string;
    required: number;
    current: number;
  }[];
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  points: number;
  timestamp: string;
  category: string;
}

export interface DevelopmentRecommendation {
  id: string;
  title: string;
  description: string;
  competencyTarget: string;
  estimatedPoints: number;
  priority: 'high' | 'medium' | 'low';
}

export interface AssessmentData {
  overallScore: number;
  performanceLevel: string;
  revenueOpportunity: number;
  focusArea: string;
  recommendations: string[];
  strengths: string[];
  gaps: string[];
}

export interface CompetencyDevelopmentViewProps {
  userId: string;
  className?: string;
}

// ==================== COMPETENCY LEVEL DEFINITIONS ====================

const COMPETENCY_LEVELS: Record<CompetencyLevel, {
  name: string;
  range: [number, number];
  color: string;
  description: string;
  nextLevel: CompetencyLevel | null;
}> = {
  foundation: {
    name: 'Foundation',
    range: [0, 39],
    color: 'amber',
    description: 'Building systematic approach fundamentals',
    nextLevel: 'developing'
  },
  developing: {
    name: 'Developing',
    range: [40, 69],
    color: 'blue',
    description: 'Demonstrating consistent professional capability',
    nextLevel: 'proficient'
  },
  proficient: {
    name: 'Proficient',
    range: [70, 89],
    color: 'green',
    description: 'Executing advanced revenue intelligence',
    nextLevel: 'advanced'
  },
  advanced: {
    name: 'Advanced',
    range: [90, 99],
    color: 'purple',
    description: 'Leading systematic revenue transformation',
    nextLevel: 'expert'
  },
  expert: {
    name: 'Expert',
    range: [100, 100],
    color: 'red',
    description: 'Mastering revenue intelligence systems',
    nextLevel: null
  }
};

// ==================== UTILITY FUNCTIONS ====================

const getCompetencyLevel = (score: number): { key: CompetencyLevel } & typeof COMPETENCY_LEVELS[CompetencyLevel] => {
  for (const [key, level] of Object.entries(COMPETENCY_LEVELS)) {
    if (score >= level.range[0] && score <= level.range[1]) {
      return { key: key as CompetencyLevel, ...level };
    }
  }
  return { key: 'foundation', ...COMPETENCY_LEVELS.foundation };
};

const getLevelColor = (level: CompetencyLevel): string => {
  const colors = {
    foundation: 'text-amber-400',
    developing: 'text-blue-400',
    proficient: 'text-green-400',
    advanced: 'text-purple-400',
    expert: 'text-red-400'
  };
  return colors[level];
};

// ==================== MAIN COMPONENT ====================

export const CompetencyDevelopmentView: React.FC<CompetencyDevelopmentViewProps> = ({
  userId,
  className = ''
}) => {
  // State Management
  const [activeTab, setActiveTab] = useState<TabView>('overview');
  const [isStartingSession, setIsStartingSession] = useState(false);

  // Fetch competency development data from Supabase
  const competencyData = useCompetencyDevelopmentData();
  const competencyDetails = (competencyData as any).competencies || [];
  const nextUnlockData = (competencyData as any).nextUnlock || null;
  const loading = competencyData.loading;
  const error = competencyData.error;
  const { data: milestonesData } = useMilestones(userId);

  // Fetch task recommendations
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    fetchTasks,
    completeTask,
  } = useTasks({
    userId,
    milestoneTier: 'foundation',
    autoFetch: true,
  });

  // Transform competency details to CompetencyData format
  const competencies = useMemo((): CompetencyData[] => {
    return competencyDetails.map((comp: any) => ({
      name: comp.name,
      current: comp.currentScore,
      baseline: comp.currentScore - comp.recentGrowth, // Estimate baseline
      required: comp.nextLevelThreshold,
      color: comp.id === 'customer_intelligence' ? '#3B82F6' :
             comp.id === 'value_communication' ? '#10B981' : '#8B5CF6',
      growth: comp.recentGrowth > 0 ? (comp.recentGrowth / (comp.currentScore - comp.recentGrowth)) * 100 : 0
    }));
  }, [competencyDetails]);

  // Transform next unlock data to NextUnlock format
  const nextUnlock = useMemo((): NextUnlock | null => {
    if (!nextUnlockData) return null;

    return {
      name: nextUnlockData.name,
      benefits: nextUnlockData.description,
      currentProgress: nextUnlockData.currentPoints,
      requiredProgress: nextUnlockData.pointsRequired,
      pointsNeeded: nextUnlockData.pointsRequired - nextUnlockData.currentPoints,
      requirements: competencyDetails.map((comp: any) => ({
        competency: comp.name,
        required: comp.nextLevelThreshold,
        current: comp.currentScore
      }))
    };
  }, [nextUnlockData, competencyDetails]);

  // Transform milestones data
  const milestones = useMemo((): Milestone[] => {
    if (!milestonesData?.data?.milestones) return [];

    return milestonesData.data.milestones.slice(0, 5).map((m: any) => ({
      id: m.id || String(Math.random()),
      name: m.name || 'Milestone Achieved',
      description: m.description || '',
      points: m.points || m.pointsAwarded || 0,
      timestamp: m.timestamp || m.completedAt || 'Recently',
      category: m.category || 'General'
    }));
  }, [milestonesData]);

  // Mock data for recommendations and assessment (to be connected later)
  const recommendations: DevelopmentRecommendation[] = [];
  const assessmentData: AssessmentData | null = null;

  // Calculate current level from overall score
  const currentLevel = useMemo(() => {
    if (competencies.length === 0) return null;
    const overallScore = Math.min(...competencies.map(c => c.current));
    return getCompetencyLevel(overallScore);
  }, [competencies]);

  // ==================== EVENT HANDLERS ====================

  const handleStartDevelopmentSession = async () => {
    setIsStartingSession(true);
    try {
      console.log('Starting professional development session...');
      // TODO: Implement development session initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error starting development session:', error);
    } finally {
      setTimeout(() => setIsStartingSession(false), 1500);
    }
  };

  const handleStartRecommendation = (recommendation: DevelopmentRecommendation) => {
    console.log('Starting recommended activity:', recommendation.title);
    // TODO: Implement recommendation action
  };

  const handleViewAllMilestones = () => {
    console.log('Opening milestones history...');
    // TODO: Implement milestones modal
  };

  // ==================== LOADING STATE ====================

  if (loading) {
    return (
      <div className={`min-h-screen bg-[#0a0a0a] flex items-center justify-center ${className}`}>
        <div className="text-gray-400">Loading development data...</div>
      </div>
    );
  }

  // ==================== ERROR STATE ====================

  if (error) {
    return (
      <div className={`min-h-screen bg-[#0a0a0a] flex items-center justify-center ${className}`}>
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <h3 className="text-lg font-semibold text-red-400">Error Loading Data</h3>
          </div>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ==================== MAIN VIEW LAYOUT ====================

  return (
    <motion.div
      className={`min-h-screen bg-[#0a0a0a] ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 border-b border-purple-700/50 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Competency Development</h1>
                <p className="text-sm text-purple-200">
                  Systematic advancement through professional revenue intelligence
                </p>
              </div>
            </div>

            {/* Current Level Indicator */}
            {currentLevel && (
              <div className="text-right">
                <div className="text-purple-200 text-xs uppercase tracking-wide">
                  Current Level
                </div>
                <div className={`text-2xl font-bold ${getLevelColor(currentLevel.key)}`}>
                  {currentLevel.name}
                </div>
                <div className="text-xs text-purple-300 mt-1">
                  {currentLevel.description}
                </div>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-2 border-b border-purple-700/30">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'development', label: 'Development Plan', icon: TrendingUp },
              { id: 'assessments', label: 'Assessments', icon: Award }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabView)}
                className={`
                  flex items-center space-x-2 px-4 py-3 font-medium text-sm rounded-t-lg transition-colors
                  ${activeTab === tab.id
                    ? 'bg-purple-700/50 text-white border-b-2 border-purple-400'
                    : 'text-purple-300 hover:text-white hover:bg-purple-800/30'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Competency Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {competencies.map((competency, index) => (
                  <div
                    key={index}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6"
                  >
                    {/* TODO: CircularCompetencyGauge will replace this */}
                    <h3 className="text-sm font-medium text-gray-400 mb-4">{competency.name}</h3>
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#374151"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke={competency.color}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${(competency.current / 100) * 352} 352`}
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold text-white">{competency.current}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Baseline:</span>
                        <span className="text-gray-300">{competency.baseline || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Growth:</span>
                        <span className="text-green-400">+{competency.growth.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Unlock Section */}
              {nextUnlock && (
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                  {/* TODO: NextUnlockIndicator + NextUnlockProgress will go here */}
                  <div className="flex items-center space-x-3 mb-4">
                    <Lock className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Next Unlock</h3>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-base font-medium text-white mb-2">{nextUnlock.name}</h4>
                    <p className="text-sm text-gray-400">{nextUnlock.benefits}</p>
                  </div>
                  <div className="space-y-3">
                    {nextUnlock.requirements.map((req, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">{req.competency}</span>
                          <span className="text-gray-300">{req.current}/{req.required}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${(req.current / req.required) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-sm text-blue-400">
                      ~{nextUnlock.pointsNeeded} points needed to unlock
                    </span>
                  </div>
                </div>
              )}

              {/* Competency Progress Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Progress Line Chart */}
                <div className="lg:col-span-1">
                  <ProgressLineChart
                    data={[
                      { date: '2025-10-04', timestamp: '2025-10-04T00:00:00Z', customerAnalysis: 85, valueCommunication: 75, salesExecution: 60 },
                      { date: '2025-10-05', timestamp: '2025-10-05T00:00:00Z', customerAnalysis: 92, valueCommunication: 80, salesExecution: 65 },
                      { date: '2025-10-06', timestamp: '2025-10-06T00:00:00Z', customerAnalysis: 98, valueCommunication: 85, salesExecution: 68 },
                      { date: '2025-10-07', timestamp: '2025-10-07T00:00:00Z', customerAnalysis: 105, valueCommunication: 92, salesExecution: 75 },
                      { date: '2025-10-08', timestamp: '2025-10-08T00:00:00Z', customerAnalysis: 110, valueCommunication: 95, salesExecution: 78 },
                      { date: '2025-10-09', timestamp: '2025-10-09T00:00:00Z', customerAnalysis: 118, valueCommunication: 100, salesExecution: 82 },
                      { date: '2025-10-10', timestamp: '2025-10-10T00:00:00Z', customerAnalysis: 125, valueCommunication: 105, salesExecution: 88 },
                    ]}
                    series={[
                      { key: 'customerAnalysis', label: 'Customer Analysis', color: '#10b981', enabled: true },
                      { key: 'valueCommunication', label: 'Value Communication', color: '#8b5cf6', enabled: true },
                      { key: 'salesExecution', label: 'Sales Execution', color: '#f59e0b', enabled: true },
                    ]}
                    title="Competency Score Trends"
                    height={350}
                  />
                </div>

                {/* Cumulative Area Chart */}
                <div className="lg:col-span-1">
                  <CumulativeAreaChart
                    data={[
                      { date: '2025-10-04', timestamp: '2025-10-04T00:00:00Z', cumulativeGrowth: 85, cumulativeActivities: 15, cumulativePoints: 120 },
                      { date: '2025-10-05', timestamp: '2025-10-05T00:00:00Z', cumulativeGrowth: 177, cumulativeActivities: 30, cumulativePoints: 255 },
                      { date: '2025-10-06', timestamp: '2025-10-06T00:00:00Z', cumulativeGrowth: 270, cumulativeActivities: 45, cumulativePoints: 400 },
                      { date: '2025-10-07', timestamp: '2025-10-07T00:00:00Z', cumulativeGrowth: 368, cumulativeActivities: 62, cumulativePoints: 560 },
                      { date: '2025-10-08', timestamp: '2025-10-08T00:00:00Z', cumulativeGrowth: 470, cumulativeActivities: 78, cumulativePoints: 725 },
                      { date: '2025-10-09', timestamp: '2025-10-09T00:00:00Z', cumulativeGrowth: 578, cumulativeActivities: 95, cumulativePoints: 900 },
                      { date: '2025-10-10', timestamp: '2025-10-10T00:00:00Z', cumulativeGrowth: 688, cumulativeActivities: 113, cumulativePoints: 1080 },
                    ]}
                    series={[
                      { key: 'cumulativeGrowth', label: 'Total Growth', color: '#10b981', strokeColor: '#059669', enabled: true },
                      { key: 'cumulativeActivities', label: 'Learning Activities', color: '#8b5cf6', strokeColor: '#7c3aed', enabled: true },
                      { key: 'cumulativePoints', label: 'Experience Points', color: '#3b82f6', strokeColor: '#2563eb', enabled: true },
                    ]}
                    stackMode="overlapping"
                    title="Development Journey"
                    height={350}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Development Plan Tab */}
          {activeTab === 'development' && (
            <motion.div
              key="development"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Task Recommendations */}
              <TaskRecommendations
                tasks={tasks}
                loading={tasksLoading}
                error={tasksError}
                onCompleteTask={completeTask}
                onRefresh={fetchTasks}
                maxTasks={10}
                showCompletionButton={true}
              />

              {/* Legacy Recommendations */}
              {recommendations.length > 0 && (
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Additional Recommendations</h3>
                  <div className="space-y-3">
                    {recommendations.map((rec) => (
                      <div
                      key={rec.id}
                      className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-white">{rec.title}</h4>
                          <span className={`
                            text-xs px-2 py-0.5 rounded
                            ${rec.priority === 'high' ? 'bg-red-900/30 text-red-400' :
                              rec.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-400' :
                              'bg-gray-700 text-gray-400'}
                          `}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{rec.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs">
                          <span className="text-gray-500">
                            Target: {rec.competencyTarget}
                          </span>
                          <span className="text-green-400">
                            +{rec.estimatedPoints} points
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartRecommendation(rec)}
                        className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                      >
                        Start
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Recent Milestones */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Recent Milestones</h3>
                  <button
                    onClick={handleViewAllMilestones}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="bg-gray-800 rounded-lg p-4 flex items-start space-x-3"
                    >
                      <div className="p-2 bg-yellow-900/30 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white">{milestone.name}</h4>
                        <p className="text-xs text-gray-400 mt-1">{milestone.description}</p>
                        <div className="flex items-center space-x-3 mt-2 text-xs">
                          <span className="text-gray-500">{milestone.category}</span>
                          <span className="text-green-400">+{milestone.points}</span>
                          <span className="text-gray-500">{milestone.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Development Session CTA */}
              <div className="bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-700/50 rounded-lg p-6">
                <button
                  onClick={handleStartDevelopmentSession}
                  disabled={isStartingSession}
                  className={`
                    w-full group relative overflow-hidden
                    bg-gradient-to-r from-blue-600 to-purple-600
                    hover:from-blue-700 hover:to-purple-700
                    disabled:from-gray-600 disabled:to-gray-700
                    text-white px-6 py-4 rounded-lg font-semibold
                    transition-all duration-300
                    hover:scale-[1.02] hover:shadow-xl
                    ${isStartingSession ? 'animate-pulse' : ''}
                  `}
                >
                  <div className="relative flex items-center justify-center space-x-3">
                    {isStartingSession ? (
                      <>
                        <Sparkles className="w-5 h-5 animate-spin" />
                        <span>Initializing Development Session...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Start Professional Development Session</span>
                        <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
                <div className="mt-4 text-center text-sm text-purple-200">
                  Consistent development creates sustainable competitive advantage
                </div>
              </div>
            </motion.div>
          )}

          {/* Assessments Tab */}
          {activeTab === 'assessments' && (
            <motion.div
              key="assessments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* TODO: AssessmentInsights component will go here */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Assessment Insights</h3>
                {assessmentData && (
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-blue-400">
                          {(assessmentData as any).overallScore || 0}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Overall Score</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-green-400">
                          {(assessmentData as any).performanceLevel || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Performance</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-purple-400">
                          ${(((assessmentData as any).revenueOpportunity || 0) / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Revenue Opp.</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-sm font-bold text-yellow-400">
                          {(assessmentData as any).focusArea || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Focus Area</div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Key Recommendations</h4>
                      <ul className="space-y-2">
                        {((assessmentData as any).recommendations || []).map((rec: any, index: number) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-gray-400">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Strengths & Gaps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-400 mb-3">Strengths</h4>
                        <ul className="space-y-2">
                          {((assessmentData as any).strengths || []).map((strength: any, index: number) => (
                            <li key={index} className="flex items-start space-x-2 text-sm text-gray-400">
                              <span className="text-green-400 mt-1">✓</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-yellow-400 mb-3">Development Gaps</h4>
                        <ul className="space-y-2">
                          {((assessmentData as any).gaps || []).map((gap: any, index: number) => (
                            <li key={index} className="flex items-start space-x-2 text-sm text-gray-400">
                              <span className="text-yellow-400 mt-1">!</span>
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CompetencyDevelopmentView;
