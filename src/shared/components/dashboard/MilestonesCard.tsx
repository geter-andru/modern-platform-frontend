'use client';

import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ClockIcon,
  LockClosedIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { useCompleteMilestone } from '@/lib/hooks/useAPI';

interface Milestone {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in_progress' | 'locked';
  progress: number;
  points: number;
  requirements: string[];
  estimatedTime: string;
}

interface MilestonesCardProps {
  milestones?: Milestone[];
  isLoading: boolean;
  customerId: string;
}

export function MilestonesCard({ milestones, isLoading, customerId }: MilestonesCardProps) {
  const completeMilestone = useCompleteMilestone();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleCompleteMilestone = (milestoneId: string) => {
    completeMilestone.mutate({
      customerId,
      milestoneId,
      metadata: { completedAt: new Date().toISOString() },
    });
  };

  const getStatusIcon = (milestone: Milestone) => {
    switch (milestone.status) {
      case 'completed':
        return <CheckCircleIconSolid className="h-8 w-8 text-green-500" />;
      case 'in_progress':
        return <ClockIcon className="h-8 w-8 text-blue-500" />;
      case 'locked':
        return <LockClosedIcon className="h-8 w-8 text-gray-400" />;
      default:
        return <CheckCircleIcon className="h-8 w-8 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in_progress':
        return 'bg-blue-50 border-blue-200';
      case 'locked':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Milestones</h2>
        <div className="text-sm text-gray-500">
          {milestones?.filter(m => m.status === 'completed').length || 0} of {milestones?.length || 0} completed
        </div>
      </div>

      <div className="space-y-4">
        {milestones?.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`border rounded-lg p-4 transition-all ${getStatusColor(milestone.status)}`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getStatusIcon(milestone)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {milestone.name}
                  </h3>
                  <span className="text-sm font-medium text-gray-600">
                    {milestone.points} pts
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  {milestone.description}
                </p>

                {/* Progress bar for in_progress milestones */}
                {milestone.status === 'in_progress' && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{milestone.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${milestone.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-blue-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {milestone.requirements && milestone.requirements.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Requirements:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {milestone.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action button for in_progress milestones at 100% */}
                {milestone.status === 'in_progress' && milestone.progress >= 100 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCompleteMilestone(milestone.id)}
                    disabled={completeMilestone.isPending}
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {completeMilestone.isPending ? 'Completing...' : 'Complete Milestone'}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )) || (
          <div className="text-center py-8 text-gray-500">
            <TrophyIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No milestones available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}