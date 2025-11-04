'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import { useMilestones } from '@/app/lib/hooks/useAPI';
import { useAuth } from '@/app/lib/auth';
import { useCompoundHover } from '../../utils/compound-hover';
import { useRouter } from 'next/navigation';

interface MilestoneTrackerWidgetProps {
  collapsed: boolean;
}

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

export function MilestoneTrackerWidget({ collapsed }: MilestoneTrackerWidgetProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { data: milestonesData, isLoading } = useMilestones(user?.id);
  const widgetHover = useCompoundHover('subtle');

  // Extract milestones array safely
  const milestones: Milestone[] = Array.isArray(milestonesData?.data?.milestones)
    ? milestonesData.data.milestones
    : [];

  // Calculate progress stats
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const currentMilestone = milestones.find(m => m.status === 'in_progress');
  const progressPercentage = totalMilestones > 0
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0;

  // Don't render if no data
  if (!user || totalMilestones === 0) {
    return null;
  }

  if (collapsed) {
    // Compact view for collapsed sidebar
    return (
      <motion.button
        onClick={() => router.push('/dashboard')}
        onMouseEnter={widgetHover.handleMouseEnter}
        onMouseLeave={widgetHover.handleMouseLeave}
        className="w-full p-2 rounded-lg bg-surface/30 hover:bg-surface/50 border border-white/10 hover:border-white/20 transition-all duration-200 ease-elegant group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex flex-col items-center gap-1">
          <Trophy className="w-5 h-5 text-[#00CED1]" />
          <div className="text-xs font-medium text-text-primary">
            {completedMilestones}/{totalMilestones}
          </div>
          {/* Progress ring */}
          <svg className="w-8 h-8 -rotate-90">
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-surface"
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 14}`}
              strokeDashoffset={`${2 * Math.PI * 14 * (1 - progressPercentage / 100)}`}
              className="text-[#00CED1] transition-all duration-500 ease-elegant"
            />
          </svg>
        </div>
      </motion.button>
    );
  }

  // Expanded view
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="p-4 rounded-lg bg-surface/30 border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#00CED1]" />
          <h3 className="body-small font-medium text-text-primary">Progress</h3>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-text-muted hover:text-[#00CED1] transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Overall Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="body-small text-text-muted">
            {completedMilestones} of {totalMilestones} milestones
          </span>
          <span className="body-small font-medium text-[#00CED1]">
            {progressPercentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00CED1] to-[#00A8B5] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
      </div>

      {/* Current Milestone */}
      {currentMilestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-3 rounded-lg bg-background-elevated/50 border border-white/5"
        >
          <div className="flex items-start gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="body-small font-medium text-text-primary truncate">
                {currentMilestone.name}
              </h4>
              <p className="body-small text-text-muted mt-0.5">
                {currentMilestone.progress}% complete
              </p>
            </div>
          </div>

          {/* Current Milestone Progress */}
          <div className="h-1.5 bg-surface/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${currentMilestone.progress}%` }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Next Locked Milestone (if no current) */}
      {!currentMilestone && milestones.some(m => m.status === 'locked') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-3 rounded-lg bg-background-elevated/30 border border-white/5"
        >
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-text-subtle mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="body-small font-medium text-text-muted truncate">
                Next Milestone
              </h4>
              <p className="body-small text-text-subtle mt-0.5">
                Complete current tasks to unlock
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
