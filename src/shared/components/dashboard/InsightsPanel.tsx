'use client';

import { motion } from 'framer-motion';
import {
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'achievement' | 'tip';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

interface InsightsPanelProps {
  insights?: Insight[];
  isLoading: boolean;
}

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'opportunity':
      return ArrowTrendingUpIcon;
    case 'warning':
      return ExclamationTriangleIcon;
    case 'achievement':
      return CheckCircleIcon;
    case 'tip':
      return LightBulbIcon;
    default:
      return LightBulbIcon;
  }
};

const getInsightColor = (type: string) => {
  switch (type) {
    case 'opportunity':
      return 'text-green-600 bg-green-50';
    case 'warning':
      return 'text-yellow-600 bg-yellow-50';
    case 'achievement':
      return 'text-blue-600 bg-blue-50';
    case 'tip':
      return 'text-purple-600 bg-purple-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function InsightsPanel({ insights, isLoading }: InsightsPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Mock insights if none provided
  const displayInsights = insights || [
    {
      id: '1',
      type: 'opportunity' as const,
      title: 'High-Value Prospects Identified',
      description: 'Your ICP analysis shows 3 enterprise segments with 90%+ fit scores.',
      priority: 'high' as const,
      actionable: true,
    },
    {
      id: '2',
      type: 'tip' as const,
      title: 'Complete Cost Calculator',
      description: 'Add competitive analysis data to strengthen your business case.',
      priority: 'medium' as const,
      actionable: true,
    },
    {
      id: '3',
      type: 'achievement' as const,
      title: 'Milestone Progress',
      description: 'You\'re 80% through the Customer Analysis milestone. Keep it up!',
      priority: 'low' as const,
      actionable: false,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Insights</h2>
        <span className="text-sm text-gray-500">AI-powered</span>
      </div>

      <div className="space-y-4">
        {displayInsights.map((insight, index) => {
          const IconComponent = getInsightIcon(insight.type);
          
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {insight.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(insight.priority)}`}>
                      {insight.priority}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    {insight.description}
                  </p>
                  
                  {insight.actionable && (
                    <button className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium">
                      Take Action →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {displayInsights.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <LightBulbIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>No insights available</p>
          <p className="text-sm mt-1">Continue using the platform to get personalized insights</p>
        </div>
      )}

      {/* Refresh insights */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium">
          Refresh Insights
        </button>
      </div>
    </div>
  );
}