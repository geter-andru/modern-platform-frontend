'use client';

import React from 'react';
import CircularCompetencyGauge from './CircularCompetencyGauge';
// Note: NextUnlockIndicator will be imported once migrated
// import NextUnlockIndicator from './NextUnlockIndicator';

// TypeScript interfaces
interface CompetencyArea {
  name: string;
  current: number;
  level: string;
  color: string;
  unlockBenefit: string;
  description?: string;
}

interface AssessmentData {
  performance?: {
    level: string;
  };
}

interface CompetencyBaselines {
  customerAnalysis?: number;
  valueCommunication?: number;
  salesExecution?: number;
}

interface CompetencyGaugesProps {
  competencyAreas: CompetencyArea[];
  nextUnlock?: any;
  competencyBaselines?: CompetencyBaselines;
  assessmentData?: AssessmentData;
  onGaugeClick?: (competencyName: string) => void;
  className?: string;
}

const CompetencyGauges: React.FC<CompetencyGaugesProps> = ({ 
  competencyAreas, 
  nextUnlock, 
  competencyBaselines,
  assessmentData,
  onGaugeClick, 
  className = '' 
}) => {
  // Handle gauge click for future detailed views
  const handleGaugeClick = (competencyName: string) => {
    console.log(`Opening detailed view for ${competencyName} competency`);
    if (onGaugeClick) {
      onGaugeClick(competencyName);
    }
  };

  // Calculate assessment-driven targets based on performance level
  const getPersonalizedTarget = (competencyName: string): number => {
    if (!assessmentData?.performance) return 70;
    
    const performanceTargets: Record<string, number> = {
      'Critical': 40,
      'Needs Work': 60,
      'Average': 70,
      'Good': 85,
      'Excellent': 95
    };
    
    return performanceTargets[assessmentData.performance.level] || 70;
  };

  // Get assessment-driven baseline if available
  const getBaselineScore = (competencyName: string): number | null => {
    const competencyMap: Record<string, keyof CompetencyBaselines> = {
      'Customer Analysis': 'customerAnalysis',
      'Value Communication': 'valueCommunication', 
      'Sales Execution': 'salesExecution'
    };
    
    const key = competencyMap[competencyName];
    return competencyBaselines?.[key] || null;
  };

  // Get strongest and weakest competency areas
  const getStrongestCompetency = (): CompetencyArea | undefined => {
    if (!competencyAreas.length) return undefined;
    return competencyAreas.reduce((max, comp) => comp.current > max.current ? comp : max, competencyAreas[0]);
  };

  const getWeakestCompetency = (): CompetencyArea | undefined => {
    if (!competencyAreas.length) return undefined;
    return competencyAreas.reduce((min, comp) => comp.current < min.current ? comp : min, competencyAreas[0]);
  };

  const strongestCompetency = getStrongestCompetency();
  const weakestCompetency = getWeakestCompetency();

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
      {/* Professional Header */}
      <h3 className="text-lg font-semibold text-white mb-6">
        Professional Competency Development
      </h3>
      
      {/* Assessment-Driven Circular Gauges Grid - Personalized Business Intelligence Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {competencyAreas.map((competency) => {
          const baselineScore = getBaselineScore(competency.name);
          const personalizedTarget = getPersonalizedTarget(competency.name);
          
          return (
            <CircularCompetencyGauge 
              key={competency.name}
              name={competency.name}
              currentScore={competency.current}
              targetScore={personalizedTarget}
              level={competency.level}
              color={competency.color}
              unlockBenefit={competency.unlockBenefit}
              description={competency.description}
              onClick={handleGaugeClick}
            />
          );
        })}
      </div>
      
      {/* Professional Progression Indicator - Placeholder until NextUnlockIndicator is migrated */}
      <div className="mt-6 bg-gray-700 rounded-lg p-4">
        <div className="text-sm font-medium text-white mb-2">Next Unlock Progress</div>
        <div className="text-xs text-gray-400">
          Professional progression tracking will be displayed here
        </div>
      </div>
      
      {/* Assessment-Driven Development Context */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>
            {assessmentData 
              ? `Assessment-driven development tracking (${assessmentData.performance?.level || 'Average'} level)`
              : 'Professional development tracking and tool access management'
            }
          </span>
          <span>
            {assessmentData 
              ? `Target: ${getPersonalizedTarget('Customer Analysis')}+ for optimization`
              : 'Target: 70+ for tool unlock'
            }
          </span>
        </div>
      </div>
      
      {/* Advanced: Professional Development Balance Indicator */}
      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
        <div className="text-xs text-gray-400 mb-2">Professional Development Balance</div>
        <div className="text-sm text-white">
          <span>Strongest: </span>
          <span className="text-blue-300 font-medium">
            {strongestCompetency?.name || 'N/A'}
          </span>
          <span className="text-gray-400 mx-2">|</span>
          <span>Focus Area: </span>
          <span className="text-amber-300 font-medium">
            {weakestCompetency?.name || 'N/A'}
          </span>
        </div>
      </div>
      
      {/* Professional Tips for Enhanced Engagement */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Click on competency gauges for detailed development insights and activity tracking
      </div>
    </div>
  );
};

export default CompetencyGauges;