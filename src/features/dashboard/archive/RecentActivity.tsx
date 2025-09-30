'use client';

import { motion } from 'framer-motion';
import {
  ClockIcon,
  UserGroupIcon,
  CalculatorIcon,
  DocumentChartBarIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  impact: 'low' | 'medium' | 'high';
  category: string;
}

interface RecentActivityProps {
  activities?: Activity[];
  isLoading: boolean;
}

const getActivityIcon = (category: string) => {
  switch (category) {
    case 'icp':
      return UserGroupIcon;
    case 'cost-calculator':
      return CalculatorIcon;
    case 'business-case':
      return DocumentChartBarIcon;
    case 'export':
      return ArrowDownTrayIcon;
    case 'progress':
      return ChartBarIcon;
    default:
      return ClockIcon;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high':
      return 'text-green-600 bg-green-50';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50';
    case 'low':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="h-6 w-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Mock data if no activities provided
  const displayActivities = activities || [
    {
      id: '1',
      action: 'ICP Analysis Started',
      description: 'Began analyzing enterprise customer segments',
      timestamp: '2024-08-17T18:00:00Z',
      impact: 'high' as const,
      category: 'icp',
    },
    {
      id: '2',
      action: 'Cost Calculation',
      description: 'Calculated cost of delayed implementation',
      timestamp: '2024-08-17T16:00:00Z',
      impact: 'medium' as const,
      category: 'cost-calculator',
    },
    {
      id: '3',
      action: 'Milestone Achieved',
      description: 'Completed "Customer Analysis" milestone',
      timestamp: '2024-08-17T14:00:00Z',
      impact: 'high' as const,
      category: 'progress',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <span className="text-sm text-gray-500">{displayActivities.length} activities</span>
      </div>

      <div className="space-y-4">
        {displayActivities.map((activity, index) => {
          const IconComponent = getActivityIcon(activity.category);
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <IconComponent className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {activity.description}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(activity.impact)}`}>
                  {activity.impact}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {displayActivities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ClockIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>No recent activity</p>
          <p className="text-sm mt-1">Start using the platform to see your activity here</p>
        </div>
      )}
    </div>
  );
}