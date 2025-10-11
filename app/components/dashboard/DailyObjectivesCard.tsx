'use client';

/**
 * DailyObjectivesCard - Daily professional development objectives
 *
 * Features:
 * - Today's objectives list (3-4 daily goals)
 * - Completion status tracking with checkmarks
 * - Daily stats: points earned, objectives complete, streak
 * - Progress bar showing daily completion
 * - Auto-generated objectives based on user level
 */

import React, { useState, useEffect } from 'react';
import { Target, Award, Flame, CheckCircle, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Objective {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  icon: string;
  completed: boolean;
}

interface DailyObjectivesCardProps {
  objectives?: Objective[];
  className?: string;
}

const DailyObjectivesCard: React.FC<DailyObjectivesCardProps> = ({
  objectives: propObjectives,
  className = ''
}) => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [totalPointsToday, setTotalPointsToday] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(3);

  // Generate sample objectives
  const generateSampleObjectives = (): Objective[] => {
    return [
      {
        id: 'methodology_exploration',
        title: 'Business Methodology Exploration',
        description: 'Complete 1 ICP analysis',
        points: 50,
        category: 'Foundation',
        icon: '🔍',
        completed: true
      },
      {
        id: 'strategic_practice',
        title: 'Strategic Analysis Practice',
        description: 'Complete cost impact analysis',
        points: 75,
        category: 'Practice',
        icon: '📊',
        completed: true
      },
      {
        id: 'quality_excellence',
        title: 'Quality Excellence Initiative',
        description: 'Achieve 75%+ accuracy in customer profiling',
        points: 80,
        category: 'Quality',
        icon: '🎯',
        completed: false
      },
      {
        id: 'strategic_communication',
        title: 'Strategic Communication',
        description: 'Export 1 strategic analysis',
        points: 40,
        category: 'Communication',
        icon: '📤',
        completed: false
      }
    ];
  };

  // Initialize objectives
  useEffect(() => {
    if (propObjectives) {
      setObjectives(propObjectives);
      const points = propObjectives
        .filter(obj => obj.completed)
        .reduce((sum, obj) => sum + obj.points, 0);
      setTotalPointsToday(points);
    } else {
      const sampleObjectives = generateSampleObjectives();
      setObjectives(sampleObjectives);
      const points = sampleObjectives
        .filter(obj => obj.completed)
        .reduce((sum, obj) => sum + obj.points, 0);
      setTotalPointsToday(points);
    }
  }, [propObjectives]);

  // Calculate completion rate
  const getCompletionRate = (): number => {
    if (objectives.length === 0) return 0;
    return Math.round((objectives.filter(obj => obj.completed).length / objectives.length) * 100);
  };

  const completionRate = getCompletionRate();
  const completedCount = objectives.filter(obj => obj.completed).length;
  const allCompleted = completedCount === objectives.length && objectives.length > 0;

  // Toggle objective completion (for demo)
  const toggleObjective = (objectiveId: string) => {
    setObjectives(prevObjectives =>
      prevObjectives.map(obj => {
        if (obj.id === objectiveId) {
          const newCompleted = !obj.completed;
          // Update points
          if (newCompleted) {
            setTotalPointsToday(prev => prev + obj.points);
          } else {
            setTotalPointsToday(prev => prev - obj.points);
          }
          return { ...obj, completed: newCompleted };
        }
        return obj;
      })
    );
  };

  return (
    <motion.div
      className={`bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-white">Daily Objectives</h3>
        </div>
        <span className="text-sm font-medium text-blue-400">{completionRate}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${completionRate}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-yellow-400">{totalPointsToday}</div>
          <div className="text-xs text-gray-400">Points</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-400">{completedCount}/{objectives.length}</div>
          <div className="text-xs text-gray-400">Complete</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-lg font-bold text-orange-400">{dailyStreak}</span>
          </div>
          <div className="text-xs text-gray-400">Day Streak</div>
        </div>
      </div>

      {/* Objectives List */}
      <div className="space-y-2 mb-4">
        <h4 className="text-xs font-semibold text-gray-300 mb-2">Today's Goals</h4>
        <AnimatePresence mode="popLayout">
          {objectives.map((objective, index) => (
            <motion.div
              key={objective.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => toggleObjective(objective.id)}
              className={`relative flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                objective.completed
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : 'bg-gray-900 border-gray-800 hover:border-gray-700'
              }`}
            >
              {/* Completion Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {objective.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-600" />
                )}
              </div>

              {/* Objective Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{objective.icon}</span>
                    <h5 className={`text-sm font-medium ${
                      objective.completed ? 'text-gray-400 line-through' : 'text-white'
                    }`}>
                      {objective.title}
                    </h5>
                  </div>
                  <span className={`text-xs font-medium ${
                    objective.completed ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {objective.completed ? '✓' : `+${objective.points}`}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{objective.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* All Completed Message */}
      {allCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-3 bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-800 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-green-400" />
            <div>
              <h4 className="text-sm font-semibold text-green-400">All Objectives Complete!</h4>
              <p className="text-xs text-green-300">Outstanding professional development today</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Call to Action (when incomplete) */}
      {!allCompleted && completedCount > 0 && (
        <div className="p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">
                {objectives.length - completedCount} objective{objectives.length - completedCount > 1 ? 's' : ''} remaining
              </span>
            </div>
            <span className="text-xs text-blue-400">Keep going!</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DailyObjectivesCard;
