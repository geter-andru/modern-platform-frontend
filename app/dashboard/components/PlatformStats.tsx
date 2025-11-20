'use client';

import { Book, Flame, Clock } from 'lucide-react';

interface PlatformStatsProps {
  customerId?: string;
  isLoading: boolean;
}

export function PlatformStats({ customerId, isLoading }: PlatformStatsProps) {
  const stats = {
    resourcesUnlocked: 16,
    totalResources: 38,
    resourcePercentage: 42,
    weekGain: 8,
    streak: 5,
    streakGoal: 7,
    focusHours: 12,
    hoursGoal: 15
  };

  if (isLoading) {
    return <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 animate-pulse h-64"></div>;
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-1">Platform Effectiveness</h3>
      <p className="text-sm text-white/60 mb-6">Your usage stats</p>

      <div className="space-y-4">
        {/* Resource Library */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Book className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white/80">Resource Library</span>
            </div>
            <span className="text-sm font-bold text-purple-400">+{stats.weekGain}%</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {stats.resourcesUnlocked}/{stats.totalResources}
          </div>
          <div className="text-xs text-white/60 mb-2">{stats.resourcePercentage}% Complete • Tier 2 Unlocked</div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full" style={{ width: `${stats.resourcePercentage}%` }} />
          </div>
        </div>

        {/* Consistency Streak */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white/80">Consistency</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.streak} days</div>
          <div className="text-xs text-white/60 mb-2">{stats.streakGoal} days = bonus milestone</div>
        </div>

        {/* Focus Time */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/80">Focus Time</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.focusHours} hrs</div>
          <div className="text-xs text-white/60">{stats.hoursGoal} hrs = weekly milestone</div>
        </div>

        {/* This Month Summary */}
        <div className="border-t border-white/10 pt-4 mt-4">
          <div className="text-xs font-medium text-white/70 mb-2">📈 This Month:</div>
          <div className="space-y-1 text-sm text-white/60">
            <div>• 3 ICPs generated</div>
            <div>• 2 Business Cases created</div>
            <div>• 5 Resources exported</div>
          </div>
        </div>
      </div>
    </div>
  );
}
