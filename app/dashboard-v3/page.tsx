'use client';

/**
 * Dashboard-v3: GPS for Revenue
 *
 * Predictive execution intelligence dashboard that shows:
 * - Tool Outcome Indicators (Leading) - Observable in weeks 2-6
 * - Financial Predictions (Lagging) - Predicted 4-8 weeks ahead
 *
 * Key Innovation: Andru predicts CRM metrics before they appear in Salesforce
 *
 * Architectural Flow:
 * Tool Usage → Tool Outcomes (weeks 2-6, LEADING) → Financial Predictions (weeks 8-12, LAGGING)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navigation, TrendingUp, AlertCircle } from 'lucide-react';
import { useRequireAuth } from '@/app/lib/auth/auth-hooks';
import { useRouter } from 'next/navigation';
import { ToolOutcomesGrid, DEFAULT_INDICATORS } from '@/app/components/dashboard/v3/ToolOutcomesGrid';
import { PredictionTracker } from '@/app/components/dashboard/v3/PredictionTracker';
import { RadarComparisonChart } from '@/app/components/dashboard/v3/charts/RadarComparisonChart';
import { TrendChart } from '@/app/components/dashboard/v3/charts/TrendChart';
import { FunnelChart } from '@/app/components/dashboard/v3/charts/FunnelChart';
import type { ToolOutcomeIndicator } from '@/app/components/dashboard/v3/ToolOutcomesGrid';
import type { Prediction } from '@/app/components/dashboard/v3/PredictionTracker';
import type { RadarDataPoint } from '@/app/components/dashboard/v3/charts/RadarComparisonChart';
import type { TrendDataSeries } from '@/app/components/dashboard/v3/charts/TrendChart';
import type { FunnelStage } from '@/app/components/dashboard/v3/charts/FunnelChart';

// ==================== TYPE DEFINITIONS ====================

interface DashboardData {
  currentOutcomes: ToolOutcomeIndicator[];
  activePredictions: Prediction[];
  validatedPredictions: Prediction[];
  lastUpdated: string;
}

// ==================== MAIN COMPONENT ====================

export default function DashboardV3Page() {
  const { user, loading: authLoading } = useRequireAuth();
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==================== AUTHENTICATION ====================
  // Auth handled by useRequireAuth - redirects if not authenticated

  // ==================== DATA FETCHING ====================

  useEffect(() => {
    if (authLoading) return;

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/leading-indicators/dashboard', {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 404) {
            // No data yet - use empty state
            setDashboardData({
              currentOutcomes: [],
              activePredictions: [],
              validatedPredictions: [],
              lastUpdated: new Date().toISOString()
            });
            return;
          }
          throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
        }

        const data = await response.json();

        // Transform API response to component format
        const currentOutcomes = data.currentOutcomes || [];
        const activePredictions = data.activePredictions || [];
        const validatedPredictions = data.pastPredictions || [];

        setDashboardData({
          currentOutcomes,
          activePredictions,
          validatedPredictions,
          lastUpdated: data.lastUpdated || new Date().toISOString()
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [authLoading]);

  // ==================== LOADING STATE ====================

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1f1f1f] border border-gray-800 rounded-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading Dashboard-v3...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== ERROR STATE ====================

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-300 mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-sm text-red-200">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== MAIN RENDER ====================

  const allPredictions = [
    ...(dashboardData?.activePredictions || []),
    ...(dashboardData?.validatedPredictions || [])
  ];

  // ==================== CHART DATA PREPARATION ====================

  // Radar Chart Data
  const radarData: RadarDataPoint[] = useMemo(() => {
    const indicators = dashboardData?.currentOutcomes || DEFAULT_INDICATORS;
    return indicators.map((indicator) => ({
      label: indicator.name.replace(' %', '').replace(' Reduction', '').replace(' Conversion', '').substring(0, 20),
      currentValue: indicator.value,
      benchmark: indicator.benchmark
    }));
  }, [dashboardData?.currentOutcomes]);

  // Trend Chart Data
  const trendData: TrendDataSeries[] = useMemo(() => {
    const indicators = dashboardData?.currentOutcomes || DEFAULT_INDICATORS;
    return indicators
      .filter((indicator) => indicator.historicalData && indicator.historicalData.length > 0)
      .map((indicator) => ({
        id: indicator.id,
        label: indicator.name,
        data: indicator.historicalData || [],
        color: indicator.color.replace('text-', 'rgb(').replace('-500', ', 500)').replace('purple', '168, 85, 247').replace('blue', '59, 130, 246').replace('green', '34, 197, 94').replace('emerald', '16, 185, 129').replace('orange', '249, 115, 22').replace('yellow', '234, 179, 8').replace('pink', '236, 72, 153'),
        benchmark: indicator.benchmark
      }));
  }, [dashboardData?.currentOutcomes]);

  const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];

  // Funnel Chart Data
  const funnelData: FunnelStage[] = useMemo(() => {
    // Mock data for funnel - in production this would come from API
    return [
      {
        label: 'Tool Uses',
        value: 100,
        color: 'rgba(59, 130, 246, 0.8)', // blue
        description: 'Total Andru tool interactions'
      },
      {
        label: 'Outcomes Recorded',
        value: 85,
        color: 'rgba(168, 85, 247, 0.8)', // purple
        description: 'Measurable tool outcomes captured'
      },
      {
        label: 'Predictions Generated',
        value: 60,
        color: 'rgba(34, 197, 94, 0.8)', // green
        description: 'Financial predictions created'
      },
      {
        label: 'Predictions Validated',
        value: 45,
        color: 'rgba(234, 179, 8, 0.8)', // yellow
        description: 'Predictions with actual outcomes'
      },
      {
        label: 'Accurate Predictions',
        value: 38,
        color: 'rgba(16, 185, 129, 0.8)', // emerald
        description: 'Predictions >75% accurate'
      }
    ];
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-500 bg-opacity-10 rounded-lg">
              <Navigation className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                GPS for Revenue
              </h1>
              <p className="text-gray-400 mt-1">
                Predict CRM metrics before they appear in Salesforce
              </p>
            </div>
          </div>

          {/* Tagline */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <TrendingUp className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-gray-200 mb-2">
                  The Dashboard That Sees the Future
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Track tool outcomes (weeks 2-6) that predict financial results (weeks 8-12).
                  Check Andru before board meetings to know what your CRM will show before it shows it.
                </p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          {dashboardData?.lastUpdated && (
            <div className="mt-4 text-xs text-gray-500 text-right">
              Last updated: {new Date(dashboardData.lastUpdated).toLocaleString()}
            </div>
          )}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Tool Outcomes (2/3 width on large screens) */}
          <div className="xl:col-span-2 space-y-8">
            <ToolOutcomesGrid
              indicators={dashboardData?.currentOutcomes || []}
              isLoading={false}
              error={error}
            />
          </div>

          {/* Predictions & Funnel (1/3 width on large screens) */}
          <div className="xl:col-span-1 space-y-8">
            <PredictionTracker
              predictions={allPredictions}
              isLoading={false}
              error={error}
            />

            {/* Funnel Chart */}
            <FunnelChart
              stages={funnelData}
              title="Prediction Lifecycle"
              subtitle="From tool use to validated predictions"
            />
          </div>
        </div>

        {/* Charts Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Radar Comparison Chart */}
          <RadarComparisonChart
            data={radarData}
            title="Performance vs Benchmark"
            currentLabel="Your Performance"
            benchmarkLabel="Industry Average"
          />

          {/* Trend Chart - Full Width on Mobile, Half on Desktop */}
          <div className="lg:col-span-1">
            <TrendChart
              series={trendData}
              weekLabels={weekLabels}
              title="7-Week Trends"
              subtitle="Track indicator movements over time"
            />
          </div>
        </motion.div>

        {/* Demo Mode Notice (if using default data) */}
        {dashboardData?.currentOutcomes?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg p-6"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-300 mb-1">
                  Getting Started
                </h3>
                <p className="text-sm text-yellow-200">
                  Start using Andru tools (ICP analysis, buyer personas, translations) to track outcomes.
                  Your first tool outcome indicators will appear here within 2-6 weeks, and financial predictions
                  will follow 4-8 weeks after that.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 bg-[#1f1f1f] border border-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-200 mb-4">
            How Dashboard-v3 Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-blue-400 font-semibold mb-2">
                1. Use Andru Tools
              </div>
              <p className="text-gray-400">
                Rate companies with ICP tool, generate personas, create translations.
                Tool usage is tracked automatically.
              </p>
            </div>
            <div>
              <div className="text-purple-400 font-semibold mb-2">
                2. Track Tool Outcomes (2-6 weeks)
              </div>
              <p className="text-gray-400">
                Observable metrics appear: low-fit reduction, meeting→proposal conversion,
                multi-stakeholder engagement, etc.
              </p>
            </div>
            <div>
              <div className="text-green-400 font-semibold mb-2">
                3. See Financial Predictions (8-12 weeks)
              </div>
              <p className="text-gray-400">
                Andru predicts close rate, pipeline value, new opps before they appear in CRM.
                Validate predictions to build trust.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
