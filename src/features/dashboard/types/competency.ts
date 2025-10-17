
// Core competency data structure
export interface CompetencyData {
  customerAnalysis: number;
  valueCommunication: number;
  salesExecution: number;
  overallScore: number;
  totalPoints: number;
  currentLevel: typeof COMPETENCY_LEVELS[0];
  levelProgress: number;
  lastUpdated: string;
  baselineScores: {
    customerAnalysis: number;
    valueCommunication: number;
    salesExecution: number;
  };
  levelHistory: Array<{
    level: string;
    achievedAt: string;
    points: number;
  }>;
  toolUnlockStates: {
    icpUnlocked: boolean;
    costCalculatorUnlocked: boolean;
    businessCaseUnlocked: boolean;
    resourcesUnlocked: boolean;
    exportUnlocked: boolean;
  };
}

// Competency levels
export const COMPETENCY_LEVELS = [
  { id: 'foundation', name: 'Foundation', points: 0, nextLevel: 'developing', previousLevel: null, color: 'gray' },
  { id: 'developing', name: 'Developing', points: 100, nextLevel: 'proficient', previousLevel: 'foundation', color: 'blue' },
  { id: 'proficient', name: 'Proficient', points: 250, nextLevel: 'expert', previousLevel: 'developing', color: 'green' },
  { id: 'expert', name: 'Expert', points: 500, nextLevel: 'master', previousLevel: 'proficient', color: 'purple' },
  { id: 'master', name: 'Master', points: 750, nextLevel: null, previousLevel: 'expert', color: 'gold' }
] as const;

// Analytics interfaces
export interface CompetencyAnalytics {
  overallScore: number;
  categoryScores: {
    customerAnalysis: number;
    valueCommunication: number;
    salesExecution: number;
  };
  progressTrend: ProgressTrend;
  progressTrends: ProgressTrend[];
  competencyGrowth: CompetencyGrowth[];
  skillGaps: SkillGap[];
  recommendations: DevelopmentRecommendation[];
  peerComparison: PeerComparison;
  industryBenchmark: IndustryBenchmark;
  progressVelocity?: {
    velocity: number;
  };
  milestoneAchievements?: MilestoneAchievement[];
  performanceMetrics?: PerformanceMetric[];
  developmentRecommendations?: DevelopmentRecommendation[];
  lastUpdated?: string;
  analyticsPeriod?: string;
}

export interface ProgressTrend {
  period: string;
  score: number;
  change: number;
  velocity: ProgressVelocity;
  date: string;
  customerAnalysis: number;
  valueCommunication: number;
  salesExecution: number;
  overallScore: number;
  points: number;
}

export interface CompetencyGrowth {
  period: string;
  growth: number;
  milestones: string[];
  category: 'customerAnalysis' | 'valueCommunication' | 'salesExecution';
  currentScore: number;
  baselineScore: number;
  growthPercentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  metric: string;
  trend: string;
  change?: number;
  period?: string;
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  priority: 'low' | 'medium' | 'high';
  gap: number;
  recommendations: string[];
}

export interface DevelopmentRecommendation {
  type: 'course' | 'practice' | 'mentorship';
  title: string;
  description: string;
  estimatedTime: string;
  priority: 'low' | 'medium' | 'high';
  id: string;
  category: string;
  resources?: string[];
  prerequisites?: string[];
}

export interface PeerComparison {
  percentile: number;
  averageScore: number;
  topPerformers: number;
  userScore: number;
  peerAverage: number;
}

export interface IndustryBenchmark {
  industry: string;
  averageScore: number;
  topQuartile: number;
  position: number;
  metric: string;
  userValue: number;
}

export interface ProgressVelocity {
  weekly: number;
  monthly: number;
  quarterly: number;
  period: string;
  pointsGained: number;
}

export interface CompetencyUpdate {
  category: keyof CompetencyData;
  newScore: number;
  timestamp: string;
  source: string;
  type: string;
  userId: string;
}

export interface ProgressUpdate {
  userId: string;
  competencyData: CompetencyData;
  timestamp: string;
  action: string;
  points: number;
  category: string;
  data: CompetencyData;
}

export interface MilestoneAchievement {
  milestone: string;
  achievedAt: string;
  points: number;
  category: string;
  id: string;
  title: string;
  description: string;
}

export class CompetencyUtils {
  
  static calculateOverallScore(competencyData: CompetencyData): number {
    return Math.round(
      (competencyData.customerAnalysis + 
       competencyData.valueCommunication + 
       competencyData.salesExecution) / 3
    )
  }

  static getCurrentLevel(totalPoints: number): typeof COMPETENCY_LEVELS[0] {
    for (let i = COMPETENCY_LEVELS.length - 1; i >= 0; i--) {
      if (totalPoints >= COMPETENCY_LEVELS[i].points) {
        return COMPETENCY_LEVELS[i] as typeof COMPETENCY_LEVELS[0]
      }
    }
    return COMPETENCY_LEVELS[0] as typeof COMPETENCY_LEVELS[0]
  }

  static calculateLevelProgress(currentLevel: typeof COMPETENCY_LEVELS[0], totalPoints: number): number {
    const nextLevel = COMPETENCY_LEVELS.find(level => level.id === currentLevel.nextLevel)
    if (!nextLevel) return 100 // Max level reached

    const currentLevelPoints = currentLevel.points
    const nextLevelPoints = nextLevel.points
    const progress = ((totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100
    
    return Math.min(100, Math.max(0, progress))
  }

  static checkToolUnlock(competencyData: CompetencyData, toolName: keyof typeof competencyData.toolUnlockStates): boolean {
    const requirements = {
      icpUnlocked: true, // Always unlocked
      costCalculatorUnlocked: competencyData.valueCommunication >= 70,
      businessCaseUnlocked: competencyData.salesExecution >= 70,
      resourcesUnlocked: competencyData.overallScore >= 50,
      exportUnlocked: competencyData.overallScore >= 60
    }

    return requirements[toolName] || false
  }
}
