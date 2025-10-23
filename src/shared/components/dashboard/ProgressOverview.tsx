'use client';

import { motion } from 'framer-motion';
import {
  BarChart3 as ChartBarIcon,
  Trophy as TrophyIcon,
  Clock as ClockIcon,
  Flame as FireIcon,
} from 'lucide-react';
import { GlassCard } from '../design-system';

interface ProgressData {
  overallScore: number;
  completedMilestones: number;
  totalMilestones: number;
  timeSpent: number;
  streak: number;
  recentActions?: Array<{
    action: string;
    timestamp: string;
    impact: string;
  }>;
}

interface ProgressOverviewProps {
  progress?: ProgressData;
  isLoading: boolean;
}

export function ProgressOverview({ progress, isLoading }: ProgressOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <GlassCard key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-white/20 rounded mb-2"></div>
            <div className="h-8 bg-white/20 rounded"></div>
          </GlassCard>
        ))}
      </div>
    );
  }

  const stats = [
    {
      name: 'Overall Progress',
      value: `${progress?.overallScore || 0}%`,
      icon: ChartBarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Milestones',
      value: `${progress?.completedMilestones || 0}/${progress?.totalMilestones || 5}`,
      icon: TrophyIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Time Invested',
      value: `${Math.round((progress?.timeSpent || 0) / 60)} hrs`,
      icon: ClockIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Current Streak',
      value: `${progress?.streak || 0} days`,
      icon: FireIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <GlassCard 
            className="p-6" 
            hover 
            glow
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-brand-primary to-blue-600 shadow-lg shadow-brand/30">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70" style={{
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                }}>
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-white" style={{
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  fontWeight: 'var(--font-weight-bold, 700)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}>
                  {stat.value}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}