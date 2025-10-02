'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface ProgressData {
  completionPercentage: number;
  totalMilestones: number;
  completedMilestones: number;
  currentStage: string;
  timeSpent: number;
  estimatedTimeRemaining: number;
  recentActivity: Array<{
    action: string;
    timestamp: string;
    impact: number;
  }>;
}

interface ProgressVisualizationProps {
  data?: ProgressData;
  isLoading: boolean;
  customerId: string;
}

export function ProgressVisualization({ data, isLoading, customerId }: ProgressVisualizationProps) {
  const [animationKey, setAnimationKey] = useState(0);
  const [liveProgress, setLiveProgress] = useState(data?.completionPercentage || 0);

  // Update progress with smooth animation when data changes
  useEffect(() => {
    if (data?.completionPercentage !== undefined) {
      setLiveProgress(data.completionPercentage);
      setAnimationKey(prev => prev + 1);
    }
  }, [data?.completionPercentage]);

  // Simulate real-time updates (in a real app, this would be WebSocket/SSE)
  useEffect(() => {
    const interval = setInterval(() => {
      // Small random fluctuations to show "live" activity
      const variance = (Math.random() - 0.5) * 0.1;
      setLiveProgress(prev => Math.max(0, Math.min(100, prev + variance)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case 'discovery':
        return 'bg-blue-500';
      case 'analysis':
        return 'bg-purple-500';
      case 'planning':
        return 'bg-yellow-500';
      case 'execution':
        return 'bg-green-500';
      case 'optimization':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 25) return 'from-red-400 to-red-600';
    if (percentage < 50) return 'from-yellow-400 to-yellow-600';
    if (percentage < 75) return 'from-blue-400 to-blue-600';
    return 'from-green-400 to-green-600';
  };

  const getVelocityIndicator = () => {
    if (!data?.recentActivity?.length) return { icon: ClockIcon, color: 'text-gray-400', trend: 'stable' };
    
    const recentImpact = data.recentActivity.slice(-3).reduce((sum, activity) => sum + activity.impact, 0);
    
    if (recentImpact > 5) return { icon: ArrowTrendingUpIcon, color: 'text-green-500', trend: 'accelerating' };
    if (recentImpact < -2) return { icon: ExclamationTriangleIcon, color: 'text-red-500', trend: 'slowing' };
    return { icon: CheckCircleIcon, color: 'text-blue-500', trend: 'steady' };
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const velocity = getVelocityIndicator();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <ChartBarIcon className="h-5 w-5 mr-2" />
          Progress Visualization
        </h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm text-gray-600">
            <velocity.icon className={`h-4 w-4 mr-1 ${velocity.color}`} />
            <span className="capitalize">{velocity.trend}</span>
          </div>
          <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      {/* Main Progress Circle */}
      <div className="relative mb-8">
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              
              {/* Progress circle */}
              <motion.circle
                key={animationKey}
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className={`bg-gradient-to-r ${getProgressColor(liveProgress)}`}
                style={{
                  strokeDasharray: `${2 * Math.PI * 50}`,
                }}
                initial={{
                  strokeDashoffset: 2 * Math.PI * 50,
                }}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 50 * (1 - liveProgress / 100),
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                }}
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                key={liveProgress}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-bold text-gray-900"
              >
                {Math.round(liveProgress)}%
              </motion.div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
        </div>

        {/* Stage indicator */}
        <div className="absolute top-0 right-0">
          <div className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getStageColor(data?.currentStage || '')}`}>
            {data?.currentStage || 'Discovery'}
          </div>
        </div>
      </div>

      {/* Progress Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center p-4 bg-gray-50 rounded-lg"
        >
          <TrophyIcon className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {data?.completedMilestones || 0}
          </div>
          <div className="text-xs text-gray-500">
            of {data?.totalMilestones || 0} milestones
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center p-4 bg-gray-50 rounded-lg"
        >
          <ClockIcon className="h-6 w-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {Math.round((data?.timeSpent || 0) / 3600)}h
          </div>
          <div className="text-xs text-gray-500">Time invested</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center p-4 bg-gray-50 rounded-lg"
        >
          <ArrowTrendingUpIcon className="h-6 w-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {Math.round((data?.estimatedTimeRemaining || 0) / 3600)}h
          </div>
          <div className="text-xs text-gray-500">Estimated remaining</div>
        </motion.div>
      </div>

      {/* Recent Activity Stream */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          <AnimatePresence>
            {(data?.recentActivity || []).slice(-5).map((activity, index) => (
              <motion.div
                key={`${activity.timestamp}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-gray-600 flex-1 truncate">
                  {activity.action}
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    activity.impact > 0 ? 'text-green-600' : 
                    activity.impact < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {activity.impact > 0 ? '+' : ''}{activity.impact}
                  </span>
                  <span className="text-gray-400">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Prediction */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center text-sm">
          <ArrowTrendingUpIcon className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-blue-800 font-medium">
            Projected completion: {new Date(Date.now() + (data?.estimatedTimeRemaining || 0) * 1000).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}