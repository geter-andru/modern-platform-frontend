'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  Target,
  Activity,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface RevenueForecastProps {
  customerId: string;
}

interface ForecastData {
  month: string;
  actual?: number;
  predicted: number;
  optimistic: number;
  pessimistic: number;
  confidence: number;
}

interface RevenueTrend {
  period: string;
  growth: number;
  variance: number;
  factors: string[];
}

interface ForecastMetrics {
  totalProjected: number;
  growthRate: number;
  confidence: number;
  volatility: number;
  seasonalityStrength: number;
  trendDirection: 'up' | 'down' | 'stable';
}

export function RevenueForecast({ customerId }: RevenueForecastProps) {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [metrics, setMetrics] = useState<ForecastMetrics | null>(null);
  const [trends, setTrends] = useState<RevenueTrend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('12months');
  const [selectedScenario, setSelectedScenario] = useState<string>('predicted');

  const timeframes = [
    { id: '6months', name: '6 Months', icon: Calendar },
    { id: '12months', name: '12 Months', icon: BarChart3 },
    { id: '18months', name: '18 Months', icon: LineChart },
    { id: '24months', name: '24 Months', icon: TrendingUp },
  ];

  const scenarios = [
    { id: 'pessimistic', name: 'Conservative', color: 'red' },
    { id: 'predicted', name: 'Most Likely', color: 'blue' },
    { id: 'optimistic', name: 'Optimistic', color: 'green' },
  ];

  useEffect(() => {
    generateForecast();
  }, [customerId, selectedTimeframe]);

  const generateForecast = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - in production, this would call the analytics API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock forecast data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const baseRevenue = 250000;
      const growth = 0.15; // 15% annual growth
      const volatility = 0.1; // 10% volatility
      const seasonalPattern = [0.8, 0.9, 1.0, 1.1, 1.0, 0.9, 0.8, 0.9, 1.1, 1.2, 1.3, 1.1]; // Seasonal multipliers

      const mockData: ForecastData[] = months.map((month, index) => {
        const seasonalMultiplier = seasonalPattern[index];
        const trendMultiplier = 1 + (growth * (index / 12));
        const baseValue = baseRevenue * seasonalMultiplier * trendMultiplier;
        
        const predicted = baseValue;
        const optimistic = baseValue * (1 + volatility + 0.1);
        const pessimistic = baseValue * (1 - volatility);
        const confidence = 0.9 - (index * 0.02); // Decreasing confidence over time

        // Add actual data for first few months
        const actual = index < 6 ? baseValue * (0.95 + Math.random() * 0.1) : undefined;

        return {
          month,
          actual,
          predicted: Math.round(predicted),
          optimistic: Math.round(optimistic),
          pessimistic: Math.round(pessimistic),
          confidence: Math.round(confidence * 100) / 100,
        };
      });

      setForecastData(mockData);

      // Calculate metrics
      const totalProjected = mockData.reduce((sum, d) => sum + d.predicted, 0);
      const firstHalf = mockData.slice(0, 6).reduce((sum, d) => sum + d.predicted, 0);
      const secondHalf = mockData.slice(6, 12).reduce((sum, d) => sum + d.predicted, 0);
      const growthRate = ((secondHalf - firstHalf) / firstHalf) * 100;
      const avgConfidence = mockData.reduce((sum, d) => sum + d.confidence, 0) / mockData.length;
      
      // Calculate volatility as coefficient of variation
      const mean = totalProjected / mockData.length;
      const variance = mockData.reduce((sum, d) => sum + Math.pow(d.predicted - mean, 2), 0) / mockData.length;
      const calculatedVolatility = Math.sqrt(variance) / mean;

      setMetrics({
        totalProjected,
        growthRate,
        confidence: avgConfidence,
        volatility: calculatedVolatility * 100,
        seasonalityStrength: 0.85,
        trendDirection: growthRate > 5 ? 'up' : growthRate < -5 ? 'down' : 'stable',
      });

      // Generate trend analysis
      const mockTrends: RevenueTrend[] = [
        {
          period: 'Q1 2024',
          growth: 12.5,
          variance: 8.2,
          factors: ['Seasonal uptick', 'New product launch', 'Enterprise expansion'],
        },
        {
          period: 'Q2 2024',
          growth: 18.3,
          variance: 6.1,
          factors: ['Strong pipeline execution', 'Upsell success', 'Market growth'],
        },
        {
          period: 'Q3 2024',
          growth: 15.7,
          variance: 9.4,
          factors: ['Summer seasonality', 'Competitive pressure', 'Product improvements'],
        },
        {
          period: 'Q4 2024',
          growth: 22.1,
          variance: 7.3,
          factors: ['Holiday surge', 'Budget spending', 'Strategic partnerships'],
        },
      ];

      setTrends(mockTrends);

    } catch (error) {
      console.error('Failed to generate forecast:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return ArrowUpRight;
      case 'down': return ArrowDownRight;
      default: return Activity;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getScenarioValue = (data: ForecastData, scenario: string) => {
    switch (scenario) {
      case 'optimistic': return data.optimistic;
      case 'pessimistic': return data.pessimistic;
      default: return data.predicted;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-indigo-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Revenue Forecasting</h2>
              <p className="text-sm text-gray-600">AI-powered revenue predictions and trend analysis</p>
            </div>
          </div>
          <button
            onClick={generateForecast}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Analyzing...' : 'Refresh Forecast'}
          </button>
        </div>

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {formatCurrency(metrics.totalProjected)}
              </div>
              <div className="text-sm text-gray-600">Projected Revenue</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-2xl font-bold flex items-center justify-center ${getTrendColor(metrics.trendDirection)}`}>
                {React.createElement(getTrendIcon(metrics.trendDirection), { className: "h-6 w-6 mr-1" })}
                {Math.abs(metrics.growthRate).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Growth Rate</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(metrics.confidence * 100)}%
              </div>
              <div className="text-sm text-gray-600">Confidence</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {metrics.volatility.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Volatility</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(metrics.seasonalityStrength * 100)}%
              </div>
              <div className="text-sm text-gray-600">Seasonality</div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeframe Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Forecast Period</h3>
            <div className="flex flex-wrap gap-2">
              {timeframes.map((timeframe) => {
                const IconComponent = timeframe.icon;
                const isActive = selectedTimeframe === timeframe.id;

                return (
                  <button
                    key={timeframe.id}
                    onClick={() => setSelectedTimeframe(timeframe.id)}
                    className={`flex items-center px-4 py-2 rounded-lg border text-sm transition-all ${
                      isActive
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {timeframe.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scenario Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Scenario View</h3>
            <div className="flex flex-wrap gap-2">
              {scenarios.map((scenario) => {
                const isActive = selectedScenario === scenario.id;

                return (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenario(scenario.id)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                      isActive
                        ? `bg-${scenario.color}-50 border-${scenario.color}-200 text-${scenario.color}-700`
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {scenario.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Visualization */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Forecast</h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <TrendingUp className="h-12 w-12 text-indigo-400 animate-pulse" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Chart Header */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Revenue ({formatCurrency(0).replace('$0', '$')})</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                  <span>Actual</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>Predicted</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Optimistic</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>Conservative</span>
                </div>
              </div>
            </div>

            {/* Simple Bar Chart Visualization */}
            <div className="space-y-2">
              {forecastData.map((data, index) => {
                const maxValue = Math.max(...forecastData.map(d => d.optimistic));
                const actualWidth = data.actual ? (data.actual / maxValue) * 100 : 0;
                const predictedWidth = (data.predicted / maxValue) * 100;
                const optimisticWidth = (data.optimistic / maxValue) * 100;
                const pessimisticWidth = (data.pessimistic / maxValue) * 100;

                return (
                  <motion.div
                    key={data.month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-12 text-sm font-medium text-gray-600">{data.month}</div>
                    <div className="flex-1 relative h-8 bg-gray-100 rounded">
                      {/* Optimistic bar */}
                      <div
                        className="absolute top-0 left-0 h-full bg-green-200 rounded"
                        style={{ width: `${optimisticWidth}%` }}
                      />
                      {/* Pessimistic bar */}
                      <div
                        className="absolute top-0 left-0 h-full bg-red-200 rounded"
                        style={{ width: `${pessimisticWidth}%` }}
                      />
                      {/* Predicted bar */}
                      <div
                        className="absolute top-0 left-0 h-full bg-blue-500 rounded"
                        style={{ width: `${predictedWidth}%` }}
                      />
                      {/* Actual bar (if exists) */}
                      {data.actual && (
                        <div
                          className="absolute top-0 left-0 h-full bg-gray-600 rounded"
                          style={{ width: `${actualWidth}%` }}
                        />
                      )}
                    </div>
                    <div className="w-24 text-sm text-gray-600 text-right">
                      {formatCurrency(getScenarioValue(data, selectedScenario))}
                    </div>
                    <div className="w-16 text-xs text-gray-500 text-right">
                      {Math.round(data.confidence * 100)}%
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Trend Analysis */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quarterly Trend Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {trends.map((trend, index) => (
            <motion.div
              key={trend.period}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{trend.period}</h4>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${trend.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend.growth > 0 ? '+' : ''}{trend.growth}%
                  </div>
                  <div className="text-xs text-gray-500">±{trend.variance}% variance</div>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-1">Key Factors</h5>
                <ul className="space-y-1">
                  {trend.factors.map((factor, factorIndex) => (
                    <li key={factorIndex} className="text-sm text-gray-600 flex items-start">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}