'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  Clock,
  Star,
  Zap,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Filter,
  Calendar,
  BarChart3,
  Lightbulb,
} from 'lucide-react';

interface RecommendationEngineProps {
  customerId: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'expansion' | 'retention' | 'optimization' | 'engagement' | 'revenue' | 'competitive';
  priority: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  estimatedValue?: number;
  timeToImplement: string;
  effort: 'low' | 'medium' | 'high';
  actionSteps: string[];
  supportingData: string;
  relatedInsights: string[];
  deadline?: string;
  status: 'new' | 'in_progress' | 'completed' | 'dismissed';
}

interface RecommendationMetrics {
  totalRecommendations: number;
  highPriorityCount: number;
  totalPotentialValue: number;
  avgConfidence: number;
  completionRate: number;
  activeRecommendations: number;
}

export function RecommendationEngine({ customerId }: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [metrics, setMetrics] = useState<RecommendationMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');

  const categories = [
    { id: 'all', name: 'All Categories', icon: Sparkles },
    { id: 'expansion', name: 'Expansion', icon: TrendingUp },
    { id: 'retention', name: 'Retention', icon: Users },
    { id: 'optimization', name: 'Optimization', icon: Target },
    { id: 'engagement', name: 'Engagement', icon: Star },
    { id: 'revenue', name: 'Revenue', icon: DollarSign },
    { id: 'competitive', name: 'Competitive', icon: Zap },
  ];

  const priorities = [
    { id: 'all', name: 'All Priorities' },
    { id: 'critical', name: 'Critical' },
    { id: 'high', name: 'High' },
    { id: 'medium', name: 'Medium' },
    { id: 'low', name: 'Low' },
  ];

  const statuses = [
    { id: 'active', name: 'Active (New + In Progress)' },
    { id: 'new', name: 'New' },
    { id: 'in_progress', name: 'In Progress' },
    { id: 'completed', name: 'Completed' },
    { id: 'dismissed', name: 'Dismissed' },
  ];

  useEffect(() => {
    generateRecommendations();
  }, [customerId, selectedCategory, selectedPriority, selectedStatus]);

  const generateRecommendations = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - in production, this would call the analytics API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockRecommendations: Recommendation[] = [
        {
          id: 'rec-001',
          title: 'Accelerate Premium Feature Adoption',
          description: 'Customer shows 85% alignment with premium tier features but hasn\'t upgraded. Deploy targeted feature showcase campaign.',
          category: 'expansion',
          priority: 'critical',
          confidence: 0.91,
          impact: 'high',
          estimatedValue: 125000,
          timeToImplement: '2-3 weeks',
          effort: 'medium',
          actionSteps: [
            'Schedule premium features demo within 7 days',
            'Prepare custom ROI analysis with customer data',
            'Identify key stakeholders for expansion discussion',
            'Create urgency with limited-time upgrade incentive',
          ],
          supportingData: 'Usage analysis: 95% feature adoption, 40% above average session duration, 8+ team members active',
          relatedInsights: ['High-Value Expansion Opportunity', 'Power User Engagement Pattern'],
          deadline: '2024-09-01',
          status: 'new',
        },
        {
          id: 'rec-002',
          title: 'Proactive Churn Prevention Campaign',
          description: 'Early warning indicators suggest potential churn risk. Immediate intervention required to maintain relationship.',
          category: 'retention',
          priority: 'critical',
          confidence: 0.87,
          impact: 'high',
          estimatedValue: 75000,
          timeToImplement: '1 week',
          effort: 'high',
          actionSteps: [
            'Initiate executive check-in call within 48 hours',
            'Conduct comprehensive health check assessment',
            'Provide competitive differentiation materials',
            'Offer dedicated success manager assignment',
          ],
          supportingData: 'Behavioral shifts: 25% decrease in feature usage, delayed contract renewal discussions, support ticket increase',
          relatedInsights: ['Competitive Pressure Detection', 'At-Risk Customer Segment'],
          deadline: '2024-08-25',
          status: 'in_progress',
        },
        {
          id: 'rec-003',
          title: 'Optimize Onboarding Workflow',
          description: 'Current onboarding process shows 65% completion rate. Streamlined approach can improve user activation by 30%.',
          category: 'optimization',
          priority: 'high',
          confidence: 0.82,
          impact: 'medium',
          estimatedValue: 45000,
          timeToImplement: '3-4 weeks',
          effort: 'medium',
          actionSteps: [
            'Analyze current onboarding drop-off points',
            'Design simplified 3-step activation process',
            'Implement progressive disclosure techniques',
            'Add gamification elements to increase engagement',
          ],
          supportingData: 'Onboarding analytics: 65% completion rate, average time to value: 14 days, 35% drop-off at step 3',
          relatedInsights: ['User Experience Optimization', 'Time to Value Analysis'],
          status: 'new',
        },
        {
          id: 'rec-004',
          title: 'Launch Customer Advocacy Program',
          description: 'High-engagement customers perfect candidates for advocacy program. Leverage for case studies and referrals.',
          category: 'engagement',
          priority: 'medium',
          confidence: 0.88,
          impact: 'medium',
          estimatedValue: 85000,
          timeToImplement: '4-6 weeks',
          effort: 'low',
          actionSteps: [
            'Identify top 10 customer advocates',
            'Create structured referral incentive program',
            'Develop case study content pipeline',
            'Launch quarterly customer advisory board',
          ],
          supportingData: 'Customer health scores: 15 customers with 9.0+ satisfaction, 8+ NPS promoters, high feature adoption',
          relatedInsights: ['Power User Engagement Pattern', 'Customer Success Champions'],
          status: 'new',
        },
        {
          id: 'rec-005',
          title: 'Implement Dynamic Pricing Strategy',
          description: 'Market analysis suggests 15-20% pricing optimization opportunity based on value delivered and competitive positioning.',
          category: 'revenue',
          priority: 'high',
          confidence: 0.76,
          impact: 'high',
          estimatedValue: 180000,
          timeToImplement: '6-8 weeks',
          effort: 'high',
          actionSteps: [
            'Conduct comprehensive pricing analysis',
            'Develop value-based pricing tiers',
            'Test pricing with select customer segments',
            'Implement gradual rollout strategy',
          ],
          supportingData: 'Pricing analysis: 23% below market rate for premium features, 89% customer value satisfaction, low price sensitivity',
          relatedInsights: ['Market Positioning Analysis', 'Value Proposition Strength'],
          status: 'new',
        },
        {
          id: 'rec-006',
          title: 'Competitive Differentiation Campaign',
          description: 'Recent competitor activity requires strategic response. Highlight unique value propositions to maintain market position.',
          category: 'competitive',
          priority: 'medium',
          confidence: 0.79,
          impact: 'medium',
          estimatedValue: 95000,
          timeToImplement: '2-3 weeks',
          effort: 'medium',
          actionSteps: [
            'Create competitive differentiation content',
            'Launch targeted marketing campaign',
            'Train sales team on competitive messaging',
            'Develop unique feature showcase program',
          ],
          supportingData: 'Competitive intelligence: 2 major competitors launched similar features, 15% price reduction by key competitor',
          relatedInsights: ['Competitive Pressure Analysis', 'Market Share Protection'],
          status: 'completed',
        },
      ];

      // Filter recommendations based on selections
      let filteredRecommendations = mockRecommendations;

      if (selectedCategory !== 'all') {
        filteredRecommendations = filteredRecommendations.filter(rec => rec.category === selectedCategory);
      }

      if (selectedPriority !== 'all') {
        filteredRecommendations = filteredRecommendations.filter(rec => rec.priority === selectedPriority);
      }

      if (selectedStatus !== 'active') {
        filteredRecommendations = filteredRecommendations.filter(rec => rec.status === selectedStatus);
      } else {
        filteredRecommendations = filteredRecommendations.filter(rec => 
          rec.status === 'new' || rec.status === 'in_progress'
        );
      }

      setRecommendations(filteredRecommendations);

      // Calculate metrics
      const totalRecs = mockRecommendations.length;
      const highPriorityCount = mockRecommendations.filter(r => r.priority === 'critical' || r.priority === 'high').length;
      const totalValue = mockRecommendations
        .filter(r => r.estimatedValue)
        .reduce((sum, r) => sum + (r.estimatedValue || 0), 0);
      const avgConfidence = mockRecommendations.reduce((sum, r) => sum + r.confidence, 0) / totalRecs;
      const completedCount = mockRecommendations.filter(r => r.status === 'completed').length;
      const activeCount = mockRecommendations.filter(r => r.status === 'new' || r.status === 'in_progress').length;

      setMetrics({
        totalRecommendations: totalRecs,
        highPriorityCount,
        totalPotentialValue: totalValue,
        avgConfidence,
        completionRate: (completedCount / totalRecs) * 100,
        activeRecommendations: activeCount,
      });

    } catch (error) {
      console.error('Failed to generate recommendations:', error);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return AlertTriangle;
      case 'high': return TrendingUp;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return Target;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryConfig = categories.find(c => c.id === category);
    return categoryConfig?.icon || Sparkles;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-pink-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Recommendation Engine</h2>
              <p className="text-sm text-gray-600">Intelligent suggestions for customer success optimization</p>
            </div>
          </div>
          <button
            onClick={generateRecommendations}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Analyzing...' : 'Refresh Recommendations'}
          </button>
        </div>

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">{metrics.totalRecommendations}</div>
              <div className="text-sm text-gray-600">Total Recommendations</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{metrics.highPriorityCount}</div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(metrics.totalPotentialValue)}
              </div>
              <div className="text-sm text-gray-600">Potential Value</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(metrics.avgConfidence * 100)}%
              </div>
              <div className="text-sm text-gray-600">Avg Confidence</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(metrics.completionRate)}%
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{metrics.activeRecommendations}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              <Filter className="h-4 w-4 inline mr-1" />
              Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const isActive = selectedCategory === category.id;
                const count = category.id === 'all' 
                  ? recommendations.length 
                  : recommendations.filter(r => r.category === category.id).length;

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-3 py-2 rounded-lg border text-sm transition-all ${
                      isActive
                        ? 'bg-pink-50 border-pink-200 text-pink-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-1" />
                    {category.name}
                    <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                      isActive ? 'bg-pink-100 text-pink-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Priority</h3>
            <div className="flex flex-wrap gap-2">
              {priorities.map((priority) => {
                const isActive = selectedPriority === priority.id;

                return (
                  <button
                    key={priority.id}
                    onClick={() => setSelectedPriority(priority.id)}
                    className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                      isActive
                        ? 'bg-orange-50 border-orange-200 text-orange-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {priority.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Status</h3>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => {
                const isActive = selectedStatus === status.id;

                return (
                  <button
                    key={status.id}
                    onClick={() => setSelectedStatus(status.id)}
                    className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                      isActive
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {status.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Sparkles className="h-12 w-12 text-pink-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">AI is generating personalized recommendations...</p>
          </div>
        ) : recommendations.length > 0 ? (
          recommendations.map((recommendation, index) => {
            const PriorityIcon = getPriorityIcon(recommendation.priority);
            const CategoryIcon = getCategoryIcon(recommendation.category);

            return (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-pink-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <div className="p-3 rounded-lg bg-pink-50 mr-4">
                      <CategoryIcon className="h-6 w-6 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {recommendation.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(recommendation.priority)} flex items-center`}>
                            <PriorityIcon className="h-3 w-3 mr-1" />
                            {recommendation.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(recommendation.status)}`}>
                            {recommendation.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{recommendation.description}</p>
                      
                      {/* Key Metrics */}
                      <div className="flex items-center space-x-4 text-sm mb-4">
                        <span className="flex items-center text-blue-600">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          {Math.round(recommendation.confidence * 100)}% Confidence
                        </span>
                        <span className={`flex items-center ${getImpactColor(recommendation.impact)}`}>
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {recommendation.impact} Impact
                        </span>
                        {recommendation.estimatedValue && (
                          <span className="flex items-center text-green-600">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {formatCurrency(recommendation.estimatedValue)}
                          </span>
                        )}
                        <span className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {recommendation.timeToImplement}
                        </span>
                        <span className={`flex items-center ${getEffortColor(recommendation.effort)}`}>
                          <Target className="h-4 w-4 mr-1" />
                          {recommendation.effort} Effort
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supporting Data */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Supporting Evidence</h4>
                  <p className="text-sm text-gray-600">{recommendation.supportingData}</p>
                </div>

                {/* Action Steps */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Action Steps
                  </h4>
                  <ul className="space-y-1">
                    {recommendation.actionSteps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start text-sm text-gray-600">
                        <ArrowRight className="h-4 w-4 text-pink-400 mt-0.5 mr-2 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Related Insights */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Related Insights</h4>
                    <div className="flex flex-wrap gap-1">
                      {recommendation.relatedInsights.map((insight, insightIndex) => (
                        <span
                          key={insightIndex}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                        >
                          {insight}
                        </span>
                      ))}
                    </div>
                  </div>
                  {recommendation.deadline && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">Deadline</div>
                      <div className="text-sm text-red-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(recommendation.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No recommendations found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}