'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface CompetencyGaugesProps {
  customerId?: string;
  isLoading: boolean;
}

export function CompetencyGauges({ customerId, isLoading }: CompetencyGaugesProps) {
  // TODO: Fetch from API
  const competencies = [
    {
      name: 'Customer Analysis',
      current: 52,
      previous: 40,
      percentageGain: 12,
      nextMilestone: 65,
      nextMilestoneName: 'Tier 2 Unlock',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Value Communication',
      current: 38,
      previous: 33,
      percentageGain: 5,
      nextMilestone: 50,
      nextMilestoneName: 'Advanced Tools',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Sales Execution',
      current: 61,
      previous: 53,
      percentageGain: 8,
      nextMilestone: 75,
      nextMilestoneName: 'Master Level',
      color: 'from-green-500 to-green-600'
    }
  ];

  const getCircleProgress = (percentage: number) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return { circumference, offset };
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 animate-pulse">
        <div className="h-64 bg-white/10 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-1">Revenue Execution Capabilities</h3>
      <p className="text-sm text-white/60 mb-6">Systematic behaviors driving financial outcomes</p>

      <div className="space-y-6">
        {competencies.map((comp, index) => {
          const { circumference, offset } = getCircleProgress(comp.current);
          const percentToNextMilestone = Math.round((comp.current / comp.nextMilestone) * 100);

          return (
            <motion.div
              key={comp.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              {/* Circular Gauge */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="transform -rotate-90 w-24 h-24">
                  {/* Background circle */}
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-white/10"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="url(#gradient-${index})"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    style={{
                      strokeDasharray: circumference,
                    }}
                  />
                  <defs>
                    <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" className={`text-${comp.color.split('-')[1]}-500`} stopColor="currentColor" />
                      <stop offset="100%" className={`text-${comp.color.split('-')[1]}-600`} stopColor="currentColor" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{comp.current}%</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="font-medium text-white mb-1">{comp.name}</div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{comp.percentageGain}% this month
                  </div>
                </div>
                <div className="text-xs text-white/60">
                  Next: {comp.nextMilestone}% → {comp.nextMilestoneName}
                </div>
                <div className="text-xs text-blue-400">
                  {percentToNextMilestone}% to unlock
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
