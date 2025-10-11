'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Target,
  Lightbulb,
  Clock,
  DollarSign,
  Users,
  RefreshCw,
} from 'lucide-react';

interface CustomerInsightsPanelProps {
  customerId: string;
}

interface Insight {
  id: string;
  category: 'opportunity' | 'risk' | 'behavioral' | 'market' | 'competitive';
  title: string;
  description: string;
  confidence: number;
  impact: 'High' | 'Medium' | 'Low';
  timeframe: 'Short' | 'Medium' | 'Long';
  estimatedValue?: number;
  actionItems: string[];
  supporting_data: string;
}

export function CustomerInsightsPanel({ customerId }: CustomerInsightsPanelProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Insights', icon: Brain },
    { id: 'opportunity', name: 'Opportunities', icon: TrendingUp },
    { id: 'risk', name: 'Risks', icon: AlertTriangle },
    { id: 'behavioral', name: 'Behavioral', icon: Users },
    { id: 'market', name: 'Market', icon: Target },
    { id: 'competitive', name: 'Competitive', icon: Lightbulb },
  ];

  useEffect(() => {
    generateInsights();
  }, [customerId]);

  const generateInsights = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - in production, this would call the analytics API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockInsights: Insight[] = [
        {
          id: '1',
          category: 'opportunity',
          title: 'High-Value Expansion Opportunity',
          description: 'Customer shows 87% alignment with premium tier features based on usage patterns and engagement metrics. Strong likelihood of successful upsell.',
          confidence: 0.87,
          impact: 'High',
          timeframe: 'Short',
          estimatedValue: 125000,
          actionItems: [
            'Schedule premium features demo within 14 days',
            'Prepare custom ROI analysis highlighting advanced analytics',
            'Identify key stakeholders for expansion discussion'
          ],
          supporting_data: 'Usage analysis: 95% feature adoption, 40% above average session duration'
        },
        {
          id: '2',
          category: 'risk',
          title: 'Competitive Pressure Detection',
          description: 'Market intelligence indicates competitor evaluation activity. Customer engagement patterns suggest potential churn risk if not addressed proactively.',
          confidence: 0.73,
          impact: 'Medium',
          timeframe: 'Short',
          actionItems: [
            'Initiate competitive differentiation presentation',
            'Schedule executive check-in call',
            'Provide case studies demonstrating superior value'
          ],
          supporting_data: 'Behavioral shifts: 25% decrease in feature usage, delayed contract renewal discussions'
        },
        {
          id: '3',
          category: 'behavioral',
          title: 'Power User Engagement Pattern',
          description: 'Customer has developed advanced usage patterns indicating deep product adoption. This suggests opportunity for strategic partnership or advocacy program.',
          confidence: 0.92,
          impact: 'Medium',
          timeframe: 'Medium',
          estimatedValue: 75000,
          actionItems: [
            'Invite to customer advisory board',
            'Explore case study opportunity',
            'Introduce advanced training programs'
          ],
          supporting_data: 'Usage metrics: Top 5% user activity, 8+ integrations active, 15+ team members engaged'
        },
        {
          id: '4',
          category: 'market',
          title: 'Industry Growth Alignment',
          description: 'Customer operates in rapidly growing market segment (25% YoY growth). Their expansion timeline aligns with our product roadmap for maximum impact.',
          confidence: 0.85,
          impact: 'High',
          timeframe: 'Long',
          estimatedValue: 250000,
          actionItems: [
            'Align product roadmap discussion with customer growth plans',
            'Identify multi-year partnership opportunities',
            'Explore joint go-to-market initiatives'
          ],
          supporting_data: 'Market analysis: 25% industry growth, 40% customer expansion planned, strategic alignment score: 8.5/10'
        },
        {
          id: '5',
          category: 'competitive',
          title: 'Unique Value Proposition Leverage',
          description: 'Customer heavily utilizes features that are unique to our platform. This creates strong competitive moat and reduces switching risk.',
          confidence: 0.91,
          impact: 'Medium',
          timeframe: 'Long',
          actionItems: [
            'Document and showcase unique value delivery',
            'Create customer success story highlighting differentiation',
            'Identify similar prospects for targeted outreach'
          ],
          supporting_data: 'Feature analysis: 90% usage of proprietary features, 0% equivalent alternatives in market'
        }
      ];

      setInsights(mockInsights);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory);

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'opportunity': return TrendingUp;
      case 'risk': return AlertTriangle;
      case 'behavioral': return Users;
      case 'market': return Target;
      case 'competitive': return Lightbulb;
      default: return Brain;
    }
  };

  const getInsightColor = (category: string, impact: string) => {
    const baseColors = {
      opportunity: 'green',
      risk: 'red',
      behavioral: 'blue',
      market: 'purple',
      competitive: 'orange'
    };
    
    const color = baseColors[category as keyof typeof baseColors] || 'gray';
    const intensity = impact === 'High' ? '600' : impact === 'Medium' ? '500' : '400';
    
    return {
      bg: `bg-${color}-50`,
      text: `text-${color}-${intensity}`,
      border: `border-${color}-200`
    };
  };

  const getTotalValue = () => {
    return filteredInsights
      .filter(insight => insight.estimatedValue)
      .reduce((sum, insight) => sum + (insight.estimatedValue || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI-Powered Customer Insights</h2>
              <p className="text-sm text-gray-600">
                {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
              </p>
            </div>
          </div>
          <button
            onClick={generateInsights}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Analyzing...' : 'Refresh Insights'}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{filteredInsights.length}</div>
            <div className="text-sm text-gray-600">Active Insights</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              ${(getTotalValue() / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-600">Potential Value</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length * 100)}%
            </div>
            <div className="text-sm text-gray-600">Avg Confidence</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {insights.filter(i => i.impact === 'High').length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isActive = selectedCategory === category.id;
            const count = category.id === 'all' 
              ? insights.length 
              : insights.filter(i => i.category === category.id).length;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg border transition-all ${
                  isActive
                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {category.name}
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  isActive ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">AI is analyzing customer data...</p>
          </div>
        ) : filteredInsights.length > 0 ? (
          filteredInsights.map((insight, index) => {
            const IconComponent = getInsightIcon(insight.category);
            const colors = getInsightColor(insight.category, insight.impact);

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <div className={`p-3 rounded-lg ${colors.bg} mr-4`}>
                      <IconComponent className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {insight.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            insight.impact === 'High' 
                              ? 'bg-red-100 text-red-800'
                              : insight.impact === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {insight.impact} Impact
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {insight.timeframe} Term
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{insight.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center text-blue-600">
                          <Brain className="h-4 w-4 mr-1" />
                          {Math.round(insight.confidence * 100)}% Confidence
                        </span>
                        {insight.estimatedValue && (
                          <span className="flex items-center text-green-600">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ${insight.estimatedValue.toLocaleString()} Potential Value
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supporting Data */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Supporting Evidence</h4>
                  <p className="text-sm text-gray-600">{insight.supporting_data}</p>
                </div>

                {/* Action Items */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Actions</h4>
                  <ul className="space-y-1">
                    {insight.actionItems.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No insights available for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
}