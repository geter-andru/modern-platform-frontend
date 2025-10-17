'use client';

import React, { useState } from 'react';
import { Play, BookOpen, Sparkles, TrendingUp } from 'lucide-react';
// Note: Import these components once they are migrated
// import NextUnlockProgress from './NextUnlockProgress';
// import WeeklyRecommendations from './WeeklyRecommendations';
// import RecentMilestones from './RecentMilestones';

// TypeScript interfaces
interface CompetencyLevel {
  name: string;
  range: [number, number];
  color: string;
  description: string;
  nextLevel: string | null;
}

interface NextUnlock {
  name: string;
  benefits: string;
  currentProgress: number;
  requiredProgress: number;
  pointsNeeded: number;
}

interface Recommendation {
  title: string;
  description?: string;
}

interface Milestone {
  id: string;
  title: string;
  date: string;
  points: number;
}

interface PersonalizedMessaging {
  primary: string;
  secondary: string;
  urgency: string;
}

interface DevelopmentData {
  nextUnlock?: NextUnlock;
  recommendations?: Recommendation[];
  recentMilestones?: Milestone[];
}

interface DevelopmentFocusProps {
  developmentData?: DevelopmentData;
  competencyScores?: Record<string, number>;
  onStartSession?: (recommendation?: Recommendation) => void | Promise<void>;
  onShowMilestones?: () => void;
  className?: string;
}

// Professional level definitions for stealth gamification
const COMPETENCY_LEVELS: Record<string, CompetencyLevel> = {
  foundation: {
    name: 'Foundation',
    range: [0, 39],
    color: 'amber',
    description: 'Building systematic approach fundamentals',
    nextLevel: 'developing'
  },
  developing: {
    name: 'Developing', 
    range: [40, 69],
    color: 'blue',
    description: 'Demonstrating consistent professional capability',
    nextLevel: 'proficient'
  },
  proficient: {
    name: 'Proficient',
    range: [70, 89], 
    color: 'green',
    description: 'Executing advanced revenue intelligence',
    nextLevel: 'advanced'
  },
  advanced: {
    name: 'Advanced',
    range: [90, 99],
    color: 'purple', 
    description: 'Leading systematic revenue transformation',
    nextLevel: 'expert'
  },
  expert: {
    name: 'Expert',
    range: [100, 100],
    color: 'red',
    description: 'Mastering revenue intelligence systems',
    nextLevel: null
  }
};

// Calculate competency level from score
const getCompetencyLevel = (score: number) => {
  for (const [key, level] of Object.entries(COMPETENCY_LEVELS)) {
    if (score >= level.range[0] && score <= level.range[1]) {
      return { key, ...level };
    }
  }
  return { key: 'foundation', ...COMPETENCY_LEVELS.foundation };
};

// Calculate next unlock requirements (psychological anticipation)
const getNextUnlock = (competencyScores: Record<string, number>): NextUnlock => {
  const scores = Object.values(competencyScores);
  const lowestScore = Math.min(...scores);
  const currentLevel = getCompetencyLevel(lowestScore);
  
  if (currentLevel.nextLevel) {
    const nextLevelData = COMPETENCY_LEVELS[currentLevel.nextLevel];
    const pointsNeeded = nextLevelData.range[0] - lowestScore;
    
    return {
      name: `${nextLevelData.name} Level Professional Tools`,
      benefits: `Access to advanced ${nextLevelData.description.toLowerCase()} capabilities and systematic methodologies`,
      currentProgress: lowestScore,
      requiredProgress: nextLevelData.range[0],
      pointsNeeded: Math.max(0, pointsNeeded)
    };
  }
  
  return {
    name: 'All Professional Capabilities Unlocked',
    benefits: 'Maximum revenue intelligence capability achieved - complete systematic approach mastery',
    currentProgress: 100,
    requiredProgress: 100, 
    pointsNeeded: 0
  };
};

const DevelopmentFocus: React.FC<DevelopmentFocusProps> = ({
  developmentData,
  competencyScores = {},
  onStartSession,
  onShowMilestones,
  className = ''
}) => {
  const [isStartingSession, setIsStartingSession] = useState<boolean>(false);

  // Mock assessment context functions until context is available
  const getRevenueOpportunity = (): number => 250000; // $250K default
  const getPerformanceLevel = (): string => 'Developing'; // Default performance level

  // Calculate current level and next unlock
  const assessmentScore = Math.min(...Object.values(competencyScores)) || 45; // Default score
  const currentLevel = getCompetencyLevel(assessmentScore);
  const nextUnlock = developmentData?.nextUnlock || getNextUnlock(competencyScores);
  
  // Use personalized recommendations from development data
  const recommendations = developmentData?.recommendations || [];
  
  // Default messaging
  const messaging: PersonalizedMessaging = {
    primary: 'Consistent development creates sustainable competitive advantage',
    secondary: 'Continue building systematic professional capabilities',
    urgency: 'moderate'
  };
  
  // Professional session start handler
  const handleStartDevelopmentSession = async () => {
    setIsStartingSession(true);
    
    try {
      if (onStartSession) {
        await onStartSession();
      } else {
        console.log('Starting professional development session...');
        // Simulate session preparation
        setTimeout(() => {
          console.log('Development session initialized');
        }, 1000);
      }
    } catch (error) {
      console.error('Error starting development session:', error);
    } finally {
      setTimeout(() => setIsStartingSession(false), 1500);
    }
  };

  // Handle recommendation session start
  const handleStartRecommendation = (recommendation: Recommendation) => {
    if (onStartSession) {
      onStartSession(recommendation);
    } else {
      console.log('Starting recommended activity:', recommendation.title);
    }
  };

  // Handle milestones modal
  const handleShowAllMilestones = () => {
    if (onShowMilestones) {
      onShowMilestones();
    } else {
      console.log('Opening milestones history...');
    }
  };

  return (
    <div className={`
      bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 
      rounded-lg border border-purple-700/50 shadow-2xl relative
      ${className}
    `}>
      {/* Professional Header with Stealth Level Display */}
      <div className="p-6 border-b border-purple-700/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <BookOpen size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Professional Development Focus
            </h3>
          </div>
          
          {/* Current Level Indicator (Psychological Status) */}
          <div className="text-right">
            <div className="text-purple-200 text-xs uppercase tracking-wide">
              Current Level
            </div>
            <div className={`text-lg font-bold ${
              currentLevel.color === 'amber' ? 'text-amber-400' :
              currentLevel.color === 'blue' ? 'text-blue-400' :
              currentLevel.color === 'green' ? 'text-green-400' :
              currentLevel.color === 'purple' ? 'text-purple-400' :
              'text-red-400'
            }`}>
              {currentLevel.name}
            </div>
          </div>
        </div>
        
        <p className="text-purple-200 text-sm leading-relaxed">
          Systematic advancement through professional revenue intelligence development
        </p>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Next Unlock Progress Placeholder */}
        <div className="bg-purple-800/50 rounded-lg p-4 border border-purple-600/30">
          <div className="text-white font-medium mb-2">{nextUnlock.name}</div>
          <div className="text-purple-200 text-sm mb-3">{nextUnlock.benefits}</div>
          
          {/* Progress Bar */}
          <div className="w-full bg-purple-900 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(nextUnlock.currentProgress / nextUnlock.requiredProgress) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-purple-300">
            <span>{nextUnlock.currentProgress} / {nextUnlock.requiredProgress} points</span>
            <span>{nextUnlock.pointsNeeded} points needed</span>
          </div>
        </div>
        
        {/* Weekly Recommendations Placeholder */}
        <div className="bg-purple-800/50 rounded-lg p-4 border border-purple-600/30">
          <div className="text-white font-medium mb-3">Weekly Development Recommendations</div>
          {recommendations.length > 0 ? (
            <div className="space-y-2">
              {recommendations.slice(0, 3).map((rec, index) => (
                <button
                  key={index}
                  onClick={() => handleStartRecommendation(rec)}
                  className="w-full text-left p-3 bg-purple-700/50 rounded-lg hover:bg-purple-700/70 transition-colors"
                >
                  <div className="text-purple-100 font-medium">{rec.title}</div>
                  {rec.description && (
                    <div className="text-purple-300 text-sm mt-1">{rec.description}</div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-purple-300 text-sm">
              Personalized recommendations will appear here based on your development progress
            </div>
          )}
        </div>
        
        {/* Recent Milestones Placeholder */}
        <div className="bg-purple-800/50 rounded-lg p-4 border border-purple-600/30">
          <div className="flex items-center justify-between mb-3">
            <div className="text-white font-medium">Recent Milestones</div>
            <button
              onClick={handleShowAllMilestones}
              className="text-purple-300 text-sm hover:text-purple-200 transition-colors"
            >
              View All
            </button>
          </div>
          
          {developmentData?.recentMilestones && developmentData.recentMilestones.length > 0 ? (
            <div className="space-y-2">
              {developmentData.recentMilestones.slice(0, 3).map((milestone) => (
                <div key={milestone.id} className="flex justify-between items-center">
                  <div>
                    <div className="text-purple-100 text-sm font-medium">{milestone.title}</div>
                    <div className="text-purple-400 text-xs">{milestone.date}</div>
                  </div>
                  <div className="text-green-400 text-sm font-medium">+{milestone.points} pts</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-purple-300 text-sm">
              Complete professional development activities to earn milestones
            </div>
          )}
        </div>
      </div>

      {/* Primary Call-to-Action (Psychological Engagement Driver) */}
      <div className="p-6 border-t border-purple-700/30">
        <button 
          onClick={handleStartDevelopmentSession}
          disabled={isStartingSession}
          className={`
            w-full group relative overflow-hidden
            bg-gradient-to-r from-blue-600 to-purple-600 
            hover:from-blue-700 hover:to-purple-700 
            disabled:from-gray-600 disabled:to-gray-700
            text-white px-6 py-4 rounded-lg font-semibold
            transition-all duration-300 
            hover:scale-[1.02] hover:shadow-xl
            ${isStartingSession ? 'animate-pulse' : ''}
          `}
        >
          {/* Animated Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 -skew-x-12 group-hover:animate-pulse" />
          
          {/* Button Content */}
          <div className="relative flex items-center justify-center space-x-3">
            {isStartingSession ? (
              <>
                <Sparkles size={20} className="animate-spin" />
                <span>Initializing Development Session...</span>
              </>
            ) : (
              <>
                <Play size={20} className="group-hover:scale-110 transition-transform" />
                <span>Start Professional Development Session</span>
                <TrendingUp size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </div>
        </button>
        
        {/* Assessment-Driven Professional Encouragement */}
        <div className="mt-3 text-center">
          <p className="text-purple-200 text-sm">
            {messaging.primary}
          </p>
          <div className="mt-1 text-xs text-purple-300">
            {messaging.secondary}
          </div>
          <div className="mt-1 text-xs text-purple-400">
            {nextUnlock.pointsNeeded > 0 
              ? `${nextUnlock.pointsNeeded} points until next capability unlock`
              : 'All professional capabilities unlocked'
            }
          </div>
          <div className="mt-1 text-xs text-purple-500">
            Revenue Opportunity: ${Math.round(getRevenueOpportunity()/1000)}K | Performance: {getPerformanceLevel()}
          </div>
        </div>
      </div>
      
      {/* Subtle Professional Glow Effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-600/5 to-blue-600/5 pointer-events-none" />
    </div>
  );
};

export default DevelopmentFocus;