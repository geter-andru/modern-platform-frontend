'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users2,
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
  Target,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Filter,
  ArrowUpRight,
  Users,
} from 'lucide-react';

interface CustomerSegmentationProps {
  customerId: string;
}

interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  totalValue: number;
  averageValue: number;
  retentionRate: number;
  growthRate: number;
  churnRisk: 'low' | 'medium' | 'high';
  characteristics: string[];
  opportunities: string[];
  strategies: string[];
  color: string;
  trend: 'growing' | 'stable' | 'declining';
}

interface CohortData {
  month: string;
  newCustomers: number;
  retentionRate: number;
  revenue: number;
  churnRate: number;
}

interface SegmentMetrics {
  totalCustomers: number;
  totalRevenue: number;
  averageRetention: number;
  segments: number;
  topPerformer: string;
  riskSegments: number;
}

export function CustomerSegmentation({ customerId }: CustomerSegmentationProps) {
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [metrics, setMetrics] = useState<SegmentMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedView, setSelectedView] = useState<string>('segments');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const views = [
    { id: 'segments', name: 'Segments', icon: Users2 },
    { id: 'cohorts', name: 'Cohort Analysis', icon: BarChart3 },
    { id: 'lifecycle', name: 'Lifecycle', icon: Target },
    { id: 'value', name: 'Value Tiers', icon: DollarSign },
  ];

  const filters = [
    { id: 'all', name: 'All Segments' },
    { id: 'high_value', name: 'High Value' },
    { id: 'growing', name: 'Growing' },
    { id: 'at_risk', name: 'At Risk' },
    { id: 'new', name: 'New Customers' },
  ];

  useEffect(() => {
    generateSegmentation();
  }, [customerId, selectedView, selectedFilter]);

  const generateSegmentation = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - in production, this would call the analytics API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockSegments: CustomerSegment[] = [
        {
          id: 'enterprise',
          name: 'Enterprise Champions',
          description: 'Large organizations with high engagement and strategic value',
          customerCount: 45,
          totalValue: 2250000,
          averageValue: 50000,
          retentionRate: 0.95,
          growthRate: 0.25,
          churnRisk: 'low',
          characteristics: [
            '500+ employees',
            'Multi-department usage',
            'Executive sponsorship',
            'Integration with core systems',
          ],
          opportunities: [
            'Additional module expansion',
            'Multi-year contract upgrades',
            'Professional services attachment',
          ],
          strategies: [
            'Dedicated customer success manager',
            'Quarterly business reviews',
            'Executive advisory program',
          ],
          color: 'bg-purple-500',
          trend: 'growing',
        },
        {
          id: 'growth',
          name: 'High-Growth Scaling',
          description: 'Mid-market companies experiencing rapid growth',
          customerCount: 78,
          totalValue: 1560000,
          averageValue: 20000,
          retentionRate: 0.88,
          growthRate: 0.35,
          churnRisk: 'low',
          characteristics: [
            '100-500 employees',
            'Rapid team expansion',
            'Technology-forward culture',
            'Budget for innovation',
          ],
          opportunities: [
            'Seat expansion as they grow',
            'Advanced feature adoption',
            'Training and enablement services',
          ],
          strategies: [
            'Growth-stage playbooks',
            'Expansion monitoring',
            'Success milestone tracking',
          ],
          color: 'bg-green-500',
          trend: 'growing',
        },
        {
          id: 'stable',
          name: 'Steady Performers',
          description: 'Established customers with consistent usage patterns',
          customerCount: 112,
          totalValue: 1120000,
          averageValue: 10000,
          retentionRate: 0.85,
          growthRate: 0.08,
          churnRisk: 'medium',
          characteristics: [
            '50-200 employees',
            'Predictable usage patterns',
            'Budget-conscious',
            'Process-oriented',
          ],
          opportunities: [
            'Workflow optimization',
            'Cost-efficient upgrades',
            'Loyalty program benefits',
          ],
          strategies: [
            'Value demonstration',
            'Efficiency improvements',
            'Renewal optimization',
          ],
          color: 'bg-blue-500',
          trend: 'stable',
        },
        {
          id: 'startup',
          name: 'Emerging Innovators',
          description: 'Early-stage companies with high potential but limited budgets',
          customerCount: 156,
          totalValue: 468000,
          averageValue: 3000,
          retentionRate: 0.72,
          growthRate: 0.45,
          churnRisk: 'high',
          characteristics: [
            '10-50 employees',
            'Price-sensitive',
            'Fast decision making',
            'High growth potential',
          ],
          opportunities: [
            'Startup-friendly pricing',
            'Growth partnership programs',
            'Mentorship and resources',
          ],
          strategies: [
            'Flexible pricing models',
            'Success acceleration',
            'Community building',
          ],
          color: 'bg-orange-500',
          trend: 'growing',
        },
        {
          id: 'churned',
          name: 'At-Risk Customers',
          description: 'Customers showing signs of disengagement or churn risk',
          customerCount: 34,
          totalValue: 340000,
          averageValue: 10000,
          retentionRate: 0.45,
          growthRate: -0.15,
          churnRisk: 'high',
          characteristics: [
            'Declining usage patterns',
            'Support ticket volume increase',
            'Contract renewal delays',
            'Competitive evaluation',
          ],
          opportunities: [
            'Proactive intervention',
            'Value re-demonstration',
            'Competitive differentiation',
          ],
          strategies: [
            'Early warning systems',
            'Win-back campaigns',
            'Executive escalation',
          ],
          color: 'bg-red-500',
          trend: 'declining',
        },
      ];

      const filteredSegments = selectedFilter === 'all' 
        ? mockSegments 
        : mockSegments.filter(segment => {
            switch (selectedFilter) {
              case 'high_value': return segment.averageValue > 20000;
              case 'growing': return segment.trend === 'growing';
              case 'at_risk': return segment.churnRisk === 'high';
              case 'new': return segment.id === 'startup';
              default: return true;
            }
          });

      setSegments(filteredSegments);

      // Generate cohort data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const mockCohorts: CohortData[] = months.map((month, index) => ({
        month,
        newCustomers: 25 + Math.floor(Math.random() * 15),
        retentionRate: 0.85 + (Math.random() * 0.1),
        revenue: 85000 + (Math.random() * 20000),
        churnRate: 0.05 + (Math.random() * 0.03),
      }));

      setCohorts(mockCohorts);

      // Calculate metrics
      const totalCustomers = filteredSegments.reduce((sum, s) => sum + s.customerCount, 0);
      const totalRevenue = filteredSegments.reduce((sum, s) => sum + s.totalValue, 0);
      const avgRetention = filteredSegments.reduce((sum, s) => sum + s.retentionRate, 0) / filteredSegments.length;
      const topPerformer = filteredSegments.sort((a, b) => b.totalValue - a.totalValue)[0]?.name || '';
      const riskSegments = filteredSegments.filter(s => s.churnRisk === 'high').length;

      setMetrics({
        totalCustomers,
        totalRevenue,
        averageRetention: avgRetention,
        segments: filteredSegments.length,
        topPerformer,
        riskSegments,
      });

    } catch (error) {
      console.error('Failed to generate segmentation:', error);
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'growing': return ArrowUpRight;
      case 'declining': return TrendingUp; // Using TrendingUp with different color
      default: return BarChart3;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'growing': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChurnRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChurnRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return CheckCircle;
      case 'medium': return Clock;
      case 'high': return AlertTriangle;
      default: return Target;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users2 className="h-6 w-6 text-orange-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Customer Segmentation</h2>
              <p className="text-sm text-gray-600">AI-powered customer cohort analysis and insights</p>
            </div>
          </div>
          <button
            onClick={generateSegmentation}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Analyzing...' : 'Refresh Analysis'}
          </button>
        </div>

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{metrics.totalCustomers}</div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(metrics.totalRevenue)}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(metrics.averageRetention * 100)}%
              </div>
              <div className="text-sm text-gray-600">Avg. Retention</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{metrics.segments}</div>
              <div className="text-sm text-gray-600">Active Segments</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-bold text-indigo-600 truncate">{metrics.topPerformer}</div>
              <div className="text-sm text-gray-600">Top Performer</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{metrics.riskSegments}</div>
              <div className="text-sm text-gray-600">At Risk</div>
            </div>
          </div>
        )}
      </div>

      {/* View Selection and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* View Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Analysis View</h3>
            <div className="flex flex-wrap gap-2">
              {views.map((view) => {
                const IconComponent = view.icon;
                const isActive = selectedView === view.id;

                return (
                  <button
                    key={view.id}
                    onClick={() => setSelectedView(view.id)}
                    className={`flex items-center px-4 py-2 rounded-lg border text-sm transition-all ${
                      isActive
                        ? 'bg-orange-50 border-orange-200 text-orange-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {view.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              <Filter className="h-4 w-4 inline mr-1" />
              Filter Segments
            </h3>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const isActive = selectedFilter === filter.id;

                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                      isActive
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filter.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Segments Analysis */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Users2 className="h-12 w-12 text-orange-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">AI is analyzing customer segments...</p>
          </div>
        ) : segments.length > 0 ? (
          segments.map((segment, index) => {
            const TrendIcon = getTrendIcon(segment.trend);
            const ChurnIcon = getChurnRiskIcon(segment.churnRisk);

            return (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <div className={`p-3 rounded-lg ${segment.color} bg-opacity-10 mr-4`}>
                      <Users className={`h-6 w-6 ${segment.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {segment.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getChurnRiskColor(segment.churnRisk)} flex items-center`}>
                            <ChurnIcon className="h-3 w-3 mr-1" />
                            {segment.churnRisk} risk
                          </span>
                          <span className={`flex items-center text-xs ${getTrendColor(segment.trend)}`}>
                            <TrendIcon className="h-3 w-3 mr-1" />
                            {segment.trend}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{segment.description}</p>
                      
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-blue-600">{segment.customerCount}</div>
                          <div className="text-xs text-gray-600">Customers</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(segment.totalValue / 1000)}K
                          </div>
                          <div className="text-xs text-gray-600">Total Value</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-purple-600">
                            {Math.round(segment.retentionRate * 100)}%
                          </div>
                          <div className="text-xs text-gray-600">Retention</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className={`text-lg font-bold ${segment.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {segment.growthRate > 0 ? '+' : ''}{Math.round(segment.growthRate * 100)}%
                          </div>
                          <div className="text-xs text-gray-600">Growth</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Characteristics */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      Key Characteristics
                    </h4>
                    <ul className="space-y-1">
                      {segment.characteristics.map((char, charIndex) => (
                        <li key={charIndex} className="text-sm text-blue-700 flex items-start">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Opportunities
                    </h4>
                    <ul className="space-y-1">
                      {segment.opportunities.map((opp, oppIndex) => (
                        <li key={oppIndex} className="text-sm text-green-700 flex items-start">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {opp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Strategies */}
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-800 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Recommended Strategies
                    </h4>
                    <ul className="space-y-1">
                      {segment.strategies.map((strategy, strategyIndex) => (
                        <li key={strategyIndex} className="text-sm text-purple-700 flex items-start">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {strategy}
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
            <Users2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No segments found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}