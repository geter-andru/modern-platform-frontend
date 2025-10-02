'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  BarChart3,
  Activity,
  RefreshCw,
} from 'lucide-react';

interface PredictiveAnalyticsProps {
  customerId: string;
}

interface DealPrediction {
  dealId: string;
  dealName: string;
  dealValue: number;
  closureProbability: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  predictedCloseDate: string;
  riskFactors: string[];
  opportunityFactors: string[];
  recommendedActions: string[];
  stage: string;
  timeline: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
}

interface PredictionMetrics {
  totalDeals: number;
  totalValue: number;
  averageProbability: number;
  highConfidenceDeals: number;
  atRiskDeals: number;
  pipelineHealth: 'excellent' | 'good' | 'moderate' | 'poor';
}

export function PredictiveAnalytics({ customerId }: PredictiveAnalyticsProps) {
  const [predictions, setPredictions] = useState<DealPrediction[]>([]);
  const [metrics, setMetrics] = useState<PredictionMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  const timeframes = [
    { id: 'all', name: 'All Deals', icon: BarChart3 },
    { id: 'immediate', name: 'Next 30 Days', icon: Clock },
    { id: 'short_term', name: 'Next Quarter', icon: Calendar },
    { id: 'medium_term', name: 'Next 6 Months', icon: TrendingUp },
    { id: 'long_term', name: 'Long Term', icon: Target },
  ];

  const stages = [
    { id: 'all', name: 'All Stages' },
    { id: 'prospecting', name: 'Prospecting' },
    { id: 'qualification', name: 'Qualification' },
    { id: 'proposal', name: 'Proposal' },
    { id: 'negotiation', name: 'Negotiation' },
    { id: 'closed_won', name: 'Closed Won' },
    { id: 'closed_lost', name: 'Closed Lost' },
  ];

  useEffect(() => {
    generatePredictions();
  }, [customerId, selectedTimeframe, selectedStage]);

  const generatePredictions = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - in production, this would call the analytics API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockPredictions: DealPrediction[] = [
        {
          dealId: 'deal-001',
          dealName: 'Enterprise Platform License - TechCorp',
          dealValue: 125000,
          closureProbability: 0.87,
          confidenceLevel: 'high',
          predictedCloseDate: '2024-09-15',
          riskFactors: [
            'Budget approval pending from CFO',
            'Competitor evaluation in progress',
          ],
          opportunityFactors: [
            'Strong product fit alignment',
            'Positive stakeholder engagement',
            'Internal champion identified',
          ],
          recommendedActions: [
            'Schedule CFO presentation within 1 week',
            'Provide competitive differentiation materials',
            'Accelerate proof of concept timeline',
          ],
          stage: 'proposal',
          timeline: 'short_term',
        },
        {
          dealId: 'deal-002',
          dealName: 'SaaS Expansion - GrowthCo',
          dealValue: 75000,
          closureProbability: 0.92,
          confidenceLevel: 'high',
          predictedCloseDate: '2024-08-28',
          riskFactors: [
            'Integration complexity concerns',
          ],
          opportunityFactors: [
            'Existing customer relationship',
            'Proven ROI from current usage',
            'Expansion budget already allocated',
          ],
          recommendedActions: [
            'Provide detailed integration roadmap',
            'Showcase similar customer success stories',
            'Offer technical support package',
          ],
          stage: 'negotiation',
          timeline: 'immediate',
        },
        {
          dealId: 'deal-003',
          dealName: 'Analytics Platform - DataInc',
          dealValue: 200000,
          closureProbability: 0.65,
          confidenceLevel: 'medium',
          predictedCloseDate: '2024-11-30',
          riskFactors: [
            'Multiple decision makers involved',
            'Long procurement process',
            'Custom requirement complexity',
          ],
          opportunityFactors: [
            'Strategic initiative alignment',
            'Executive sponsorship confirmed',
            'Unique solution fit',
          ],
          recommendedActions: [
            'Map decision-making process',
            'Develop executive value proposition',
            'Create custom demo environment',
          ],
          stage: 'qualification',
          timeline: 'medium_term',
        },
        {
          dealId: 'deal-004',
          dealName: 'Starter Package - SmallBiz',
          dealValue: 25000,
          closureProbability: 0.45,
          confidenceLevel: 'low',
          predictedCloseDate: '2024-10-15',
          riskFactors: [
            'Price sensitivity concerns',
            'Limited technical resources',
            'Alternative solution evaluation',
          ],
          opportunityFactors: [
            'Growth stage company',
            'Technical fit confirmed',
            'Referral from existing customer',
          ],
          recommendedActions: [
            'Provide flexible pricing options',
            'Offer implementation support',
            'Leverage customer referral testimonial',
          ],
          stage: 'prospecting',
          timeline: 'medium_term',
        },
      ];

      const filteredPredictions = mockPredictions.filter(prediction => {
        const timeframeMatch = selectedTimeframe === 'all' || prediction.timeline === selectedTimeframe;
        const stageMatch = selectedStage === 'all' || prediction.stage === selectedStage;
        return timeframeMatch && stageMatch;
      });

      setPredictions(filteredPredictions);

      // Calculate metrics
      const totalValue = filteredPredictions.reduce((sum, p) => sum + p.dealValue, 0);
      const avgProbability = filteredPredictions.reduce((sum, p) => sum + p.closureProbability, 0) / filteredPredictions.length;
      const highConfidenceCount = filteredPredictions.filter(p => p.confidenceLevel === 'high').length;
      const atRiskCount = filteredPredictions.filter(p => p.closureProbability < 0.6).length;

      let pipelineHealth: PredictionMetrics['pipelineHealth'] = 'excellent';
      if (avgProbability < 0.7) pipelineHealth = 'good';
      if (avgProbability < 0.6) pipelineHealth = 'moderate';
      if (avgProbability < 0.5) pipelineHealth = 'poor';

      setMetrics({
        totalDeals: filteredPredictions.length,
        totalValue,
        averageProbability: avgProbability || 0,
        highConfidenceDeals: highConfidenceCount,
        atRiskDeals: atRiskCount,
        pipelineHealth,
      });

    } catch (error) {
      console.error('Failed to generate predictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.8) return 'text-green-600';
    if (probability >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProbabilityBg = (probability: number) => {
    if (probability >= 0.8) return 'bg-green-100';
    if (probability >= 0.6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'moderate': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high': return CheckCircle;
      case 'medium': return AlertCircle;
      case 'low': return TrendingDown;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Target className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Predictive Deal Analytics</h2>
              <p className="text-sm text-gray-600">AI-powered deal closure predictions and insights</p>
            </div>
          </div>
          <button
            onClick={generatePredictions}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Analyzing...' : 'Refresh Predictions'}
          </button>
        </div>

        {/* Pipeline Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalDeals}</div>
              <div className="text-sm text-gray-600">Active Deals</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ${(metrics.totalValue / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-gray-600">Pipeline Value</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(metrics.averageProbability * 100)}%
              </div>
              <div className="text-sm text-gray-600">Avg. Probability</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{metrics.highConfidenceDeals}</div>
              <div className="text-sm text-gray-600">High Confidence</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-2xl font-bold ${getHealthColor(metrics.pipelineHealth)}`}>
                {metrics.pipelineHealth.toUpperCase()}
              </div>
              <div className="text-sm text-gray-600">Pipeline Health</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-4">
          {/* Timeframe Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Timeframe</h3>
            <div className="flex flex-wrap gap-2">
              {timeframes.map((timeframe) => {
                const IconComponent = timeframe.icon;
                const isActive = selectedTimeframe === timeframe.id;
                const count = timeframe.id === 'all' 
                  ? predictions.length 
                  : predictions.filter(p => p.timeline === timeframe.id).length;

                return (
                  <button
                    key={timeframe.id}
                    onClick={() => setSelectedTimeframe(timeframe.id)}
                    className={`flex items-center px-3 py-2 rounded-lg border text-sm transition-all ${
                      isActive
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {timeframe.name}
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Deal Stage</h3>
            <div className="flex flex-wrap gap-2">
              {stages.map((stage) => {
                const isActive = selectedStage === stage.id;
                const count = stage.id === 'all' 
                  ? predictions.length 
                  : predictions.filter(p => p.stage === stage.id).length;

                return (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStage(stage.id)}
                    className={`flex items-center px-3 py-2 rounded-lg border text-sm transition-all ${
                      isActive
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {stage.name}
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Predictions List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Target className="h-12 w-12 text-green-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">AI is analyzing deal probability...</p>
          </div>
        ) : predictions.length > 0 ? (
          predictions.map((prediction, index) => {
            const ConfidenceIcon = getConfidenceIcon(prediction.confidenceLevel);
            const probabilityColor = getProbabilityColor(prediction.closureProbability);
            const probabilityBg = getProbabilityBg(prediction.closureProbability);

            return (
              <motion.div
                key={prediction.dealId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">
                        {prediction.dealName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${probabilityBg} ${probabilityColor}`}>
                          {Math.round(prediction.closureProbability * 100)}% Probability
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${
                          prediction.confidenceLevel === 'high' 
                            ? 'bg-green-100 text-green-800'
                            : prediction.confidenceLevel === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <ConfidenceIcon className="h-3 w-3 mr-1" />
                          {prediction.confidenceLevel} confidence
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${prediction.dealValue.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Expected: {new Date(prediction.predictedCloseDate).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {prediction.stage.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Risk Factors */}
                  <div className="p-3 bg-red-50 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      Risk Factors
                    </h4>
                    <ul className="space-y-1">
                      {prediction.riskFactors.map((risk, riskIndex) => (
                        <li key={riskIndex} className="text-sm text-red-700 flex items-start">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunity Factors */}
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Opportunities
                    </h4>
                    <ul className="space-y-1">
                      {prediction.opportunityFactors.map((opportunity, oppIndex) => (
                        <li key={oppIndex} className="text-sm text-green-700 flex items-start">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Actions */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Recommended Actions
                    </h4>
                    <ul className="space-y-1">
                      {prediction.recommendedActions.map((action, actionIndex) => (
                        <li key={actionIndex} className="text-sm text-blue-700 flex items-start">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No deals found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}