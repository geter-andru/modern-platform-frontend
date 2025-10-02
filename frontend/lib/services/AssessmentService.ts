import { airtableService } from '../../app/lib/services/airtableService';

// TypeScript Interfaces for AssessmentService
export interface ProfessionalLevel {
  id: 'foundation' | 'developing' | 'proficient' | 'advanced' | 'expert' | 'master';
  name: string;
  description: string;
  requiredPoints: number;
  maxPoints: number | null;
  color: string;
  benefits: string[];
  toolUnlocks: string[];
}

export interface CompetencyCategory {
  id: 'customerAnalysis' | 'valueCommunication' | 'salesExecution';
  name: string;
  description: string;
  icon: string;
  color: string;
  maxScore: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  type: 'multiple_choice' | 'scale';
  options?: { value: number; text: string }[];
  scale?: { min: number; max: number; labels: string[] };
}

export interface CompetencyScores {
  customerAnalysis: number;
  valueCommunication: number;
  salesExecution: number;
}

export interface LevelProgress {
  current: ProfessionalLevel;
  next: ProfessionalLevel | null;
  progress: number;
  pointsToNext: number;
  pointsInLevel: number;
  pointsNeededForLevel: number;
}

export interface CompetencyInsight {
  type: 'positive' | 'opportunity' | 'milestone';
  category: string;
  title: string;
  message: string;
  impact: 'high' | 'medium' | 'low';
}

export interface DevelopmentRecommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
  description: string;
  estimatedTime: string;
  potentialPoints: number;
}

export interface RealWorldAction {
  id: string;
  customerId: string;
  type: string;
  category: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  evidence?: string;
  pointsAwarded: number;
  timestamp: string;
  verified: boolean;
  tags: string[];
}

export interface DevelopmentPlan {
  timeframe: string;
  objectives: Array<{
    category: string;
    target: string;
    currentScore: number;
    targetScore: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  activities: Array<{
    type: 'platform_engagement' | 'real_world_action';
    title: string;
    description: string;
    estimatedTime: string;
    pointsPotential: number;
    category: string;
  }>;
  milestones: Array<{
    type: 'level_progression';
    title: string;
    description: string;
    targetPoints: number;
    currentPoints: number;
    estimatedTimeframe: string;
  }>;
  estimatedOutcome: {
    totalPointsGain: number;
    competencyImprovements: CompetencyScores;
    toolUnlocks: string[];
    levelProgression: {
      willAdvance: boolean;
      currentLevel: string;
      potentialLevel: string;
      progressToNext: LevelProgress;
    };
  };
}

export interface CompetencyAnalytics {
  insights: CompetencyInsight[];
  recommendations: DevelopmentRecommendation[];
  focusArea: string;
  overallScore: number;
  levelProgress: LevelProgress;
}

export interface ToolAccessControl {
  icpAnalysis: boolean;
  costCalculator: boolean;
  businessCaseBuilder: boolean;
  advancedAnalytics: boolean;
  customFrameworks: boolean;
}

export interface AssessmentSyncData {
  sessionId: string;
  userId: string;
  assessmentResults: {
    overallScore: number;
    performanceLevel: string;
    skillLevels: {
      customerAnalysis: number;
      businessCommunication: number;
      revenueStrategy: number;
      valueArticulation: number;
      strategicThinking: number;
    };
    challenges: Array<{
      name: string;
      description: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
      impact: number;
      businessConsequence: string;
    }>;
    recommendations: Array<{
      category: string;
      title: string;
      description: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
      expectedOutcome: string;
      timeframe: string;
      tools: string[];
    }>;
    focusArea: string;
    revenueOpportunity: number;
    roiMultiplier: number;
    nextSteps: string[];
    confidence: number;
    generatedAt: string;
  };
  userInfo: {
    email: string;
    company: string;
    productName: string;
    productDescription: string;
    businessModel: string;
  };
  syncTimestamp: string;
}

export interface UserProgressData {
  userId: string;
  baselineScores: CompetencyScores;
  currentScores: CompetencyScores;
  totalPoints: number;
  levelProgress: LevelProgress;
  toolAccess: ToolAccessControl;
  lastUpdated: string;
  assessmentHistory: Array<{
    sessionId: string;
    completedAt: string;
    overallScore: number;
    performanceLevel: string;
  }>;
}

/**
 * Assessment Service - Professional Development & Progress Tracking
 * 
 * Handles professional level management, progress tracking, competency analytics,
 * tool access control, and real-world action tracking.
 * Integrates with andru-assessment AssessmentServiceLite via API.
 */
class AssessmentService {
  private competencyCategories: CompetencyCategory[];
  private professionalLevels: ProfessionalLevel[];
  private userProgressCache: Map<string, UserProgressData> = new Map();

  constructor() {
    this.competencyCategories = [
      {
        id: 'customerAnalysis',
        name: 'Customer Analysis',
        description: 'Ability to identify, analyze, and profile ideal customers',
        icon: 'target',
        color: 'blue',
        maxScore: 100,
        questions: []
      },
      {
        id: 'valueCommunication',
        name: 'Value Communication',
        description: 'Skill in articulating value propositions and ROI',
        icon: 'trending-up',
        color: 'green',
        maxScore: 100,
        questions: []
      },
      {
        id: 'salesExecution',
        name: 'Sales Execution',
        description: 'Proficiency in sales methodology and deal progression',
        icon: 'bar-chart',
        color: 'purple',
        maxScore: 100,
        questions: []
      }
    ];

    this.professionalLevels = [
      {
        id: 'foundation',
        name: 'Customer Intelligence Foundation',
        description: 'Building fundamental customer analysis skills',
        requiredPoints: 0,
        maxPoints: 1000,
        color: 'blue',
        benefits: [
          'Access to ICP Analysis tools',
          'Basic customer profiling frameworks',
          'Foundational assessment benchmarks'
        ],
        toolUnlocks: ['ICP Analysis Tools']
      },
      {
        id: 'developing',
        name: 'Value Communication Developing',
        description: 'Developing value articulation capabilities',
        requiredPoints: 1000,
        maxPoints: 2500,
        color: 'green',
        benefits: [
          'Cost Calculator methodology access',
          'Value proposition frameworks',
          'ROI calculation tools'
        ],
        toolUnlocks: ['Cost Calculator']
      },
      {
        id: 'proficient',
        name: 'Sales Strategy Proficient',
        description: 'Proficient in systematic sales execution',
        requiredPoints: 2500,
        maxPoints: 5000,
        color: 'purple',
        benefits: [
          'Business Case Builder access',
          'Advanced sales frameworks',
          'Deal progression methodologies'
        ],
        toolUnlocks: ['Business Case Builder']
      },
      {
        id: 'advanced',
        name: 'Revenue Development Advanced',
        description: 'Advanced revenue generation expertise',
        requiredPoints: 5000,
        maxPoints: 10000,
        color: 'orange',
        benefits: [
          'Advanced analytics access',
          'Custom framework creation',
          'Peer mentoring opportunities'
        ],
        toolUnlocks: ['Advanced Analytics']
      },
      {
        id: 'expert',
        name: 'Market Execution Expert',
        description: 'Expert-level market execution capabilities',
        requiredPoints: 10000,
        maxPoints: 20000,
        color: 'red',
        benefits: [
          'Expert methodologies',
          'Advanced market analysis',
          'Leadership development access'
        ],
        toolUnlocks: ['Custom Frameworks']
      },
      {
        id: 'master',
        name: 'Revenue Intelligence Master',
        description: 'Master-level revenue intelligence expertise',
        requiredPoints: 20000,
        maxPoints: null,
        color: 'gold',
        benefits: [
          'Full platform access',
          'Custom methodology development',
          'Industry recognition programs'
        ],
        toolUnlocks: ['Full Platform Access']
      }
    ];
  }

  /**
   * Process assessment sync data from andru-assessment
   */
  async processAssessmentSync(syncData: AssessmentSyncData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🔄 Processing assessment sync for user: ${syncData.userId}`);

      // Convert assessment results to competency scores
      const competencyScores: CompetencyScores = {
        customerAnalysis: syncData.assessmentResults.skillLevels.customerAnalysis * 10, // Convert to 0-100 scale
        valueCommunication: syncData.assessmentResults.skillLevels.valueArticulation * 10,
        salesExecution: syncData.assessmentResults.skillLevels.revenueStrategy * 10
      };

      // Calculate total points based on overall score
      const totalPoints = Math.round(syncData.assessmentResults.overallScore * 100);

      // Get or create user progress data
      let userProgress = await this.getUserProgress(syncData.userId);
      if (!userProgress) {
        // Create new user progress with baseline scores
        userProgress = {
          userId: syncData.userId,
          baselineScores: { ...competencyScores },
          currentScores: { ...competencyScores },
          totalPoints,
          levelProgress: this.calculateLevelProgress(totalPoints),
          toolAccess: this.determineToolAccess(competencyScores, totalPoints),
          lastUpdated: new Date().toISOString(),
          assessmentHistory: []
        };
      } else {
        // Update existing user progress
        userProgress.currentScores = { ...competencyScores };
        userProgress.totalPoints = totalPoints;
        userProgress.levelProgress = this.calculateLevelProgress(totalPoints);
        userProgress.toolAccess = this.determineToolAccess(competencyScores, totalPoints);
        userProgress.lastUpdated = new Date().toISOString();
      }

      // Add to assessment history
      userProgress.assessmentHistory.push({
        sessionId: syncData.sessionId,
        completedAt: syncData.syncTimestamp,
        overallScore: syncData.assessmentResults.overallScore,
        performanceLevel: syncData.assessmentResults.performanceLevel
      });

      // Store updated progress
      await this.storeUserProgress(userProgress);

      // Store in Airtable
      await airtableService.storeAssessmentResults(syncData.userId, {
        sessionId: syncData.sessionId,
        competencyScores,
        totalPoints,
        levelProgress: userProgress.levelProgress,
        toolAccess: userProgress.toolAccess,
        assessmentResults: syncData.assessmentResults,
        userInfo: syncData.userInfo
      });

      console.log(`✅ Assessment sync processed for user: ${syncData.userId}`);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to process assessment sync:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Calculate current professional level based on total points
   */
  calculateProfessionalLevel(totalPoints: number): ProfessionalLevel {
    for (let i = this.professionalLevels.length - 1; i >= 0; i--) {
      const level = this.professionalLevels[i];
      if (totalPoints >= level.requiredPoints) {
        return level;
      }
    }
    return this.professionalLevels[0];
  }

  /**
   * Calculate progress to next level
   */
  calculateLevelProgress(totalPoints: number): LevelProgress {
    const currentLevel = this.calculateProfessionalLevel(totalPoints);
    const currentIndex = this.professionalLevels.findIndex(l => l.id === currentLevel.id);
    
    if (currentIndex === this.professionalLevels.length - 1) {
      // Already at maximum level
      return {
        current: currentLevel,
        next: null,
        progress: 100,
        pointsToNext: 0,
        pointsInLevel: totalPoints - currentLevel.requiredPoints,
        pointsNeededForLevel: 0
      };
    }

    const nextLevel = this.professionalLevels[currentIndex + 1];
    const progressInLevel = totalPoints - currentLevel.requiredPoints;
    const pointsNeededForLevel = nextLevel.requiredPoints - currentLevel.requiredPoints;
    const progressPercentage = (progressInLevel / pointsNeededForLevel) * 100;

    return {
      current: currentLevel,
      next: nextLevel,
      progress: Math.min(100, progressPercentage),
      pointsToNext: nextLevel.requiredPoints - totalPoints,
      pointsInLevel: progressInLevel,
      pointsNeededForLevel
    };
  }

  /**
   * Generate competency insights and recommendations
   */
  generateCompetencyInsights(competencyData: {
    baselineCustomerAnalysis: number;
    baselineValueCommunication: number;
    baselineSalesExecution: number;
    currentCustomerAnalysis: number;
    currentValueCommunication: number;
    currentSalesExecution: number;
    totalProgressPoints: number;
  }): CompetencyAnalytics {
    const insights: CompetencyInsight[] = [];
    const recommendations: DevelopmentRecommendation[] = [];

    // Analyze competency gaps
    const categories = ['customerAnalysis', 'valueCommunication', 'salesExecution'];
    const categoryNames = {
      customerAnalysis: 'Customer Analysis',
      valueCommunication: 'Value Communication',
      salesExecution: 'Sales Execution'
    };

    let lowestCategory = categories[0];
    let lowestScore = competencyData[`current${categories[0].charAt(0).toUpperCase()}${categories[0].slice(1)}` as keyof typeof competencyData] as number;

    categories.forEach(category => {
      const baselineKey = `baseline${category.charAt(0).toUpperCase()}${category.slice(1)}` as keyof typeof competencyData;
      const currentKey = `current${category.charAt(0).toUpperCase()}${category.slice(1)}` as keyof typeof competencyData;
      
      const baseline = competencyData[baselineKey] as number || 0;
      const current = competencyData[currentKey] as number || 0;
      const improvement = current - baseline;

      if (current < lowestScore) {
        lowestScore = current;
        lowestCategory = category;
      }

      // Generate category-specific insights
      if (improvement > 10) {
        insights.push({
          type: 'positive',
          category,
          title: `Strong Progress in ${categoryNames[category as keyof typeof categoryNames]}`,
          message: `You've improved ${improvement.toFixed(0)} points since your baseline assessment.`,
          impact: 'high'
        });
      } else if (improvement < 5) {
        insights.push({
          type: 'opportunity',
          category,
          title: `Development Opportunity: ${categoryNames[category as keyof typeof categoryNames]}`,
          message: `Consider focusing more attention on ${categoryNames[category as keyof typeof categoryNames].toLowerCase()} skills.`,
          impact: 'medium'
        });
      }

      // Tool unlock recommendations
      if (current < 70) {
        const toolMap = {
          customerAnalysis: 'ICP Analysis deep-dives',
          valueCommunication: 'Cost Calculator methodology',
          salesExecution: 'Business Case Builder framework'
        };

        recommendations.push({
          category,
          priority: current < 50 ? 'high' : 'medium',
          action: `Focus on ${toolMap[category as keyof typeof toolMap]}`,
          description: `Reach 70+ points to unlock advanced ${categoryNames[category as keyof typeof categoryNames].toLowerCase()} tools`,
          estimatedTime: '2-4 hours',
          potentialPoints: Math.ceil((70 - current) * 10)
        });
      }
    });

    // Generate level progression insights
    const levelProgress = this.calculateLevelProgress(competencyData.totalProgressPoints);
    if (levelProgress.next) {
      insights.push({
        type: 'milestone',
        category: 'progression',
        title: `${levelProgress.pointsToNext} Points to ${levelProgress.next.name}`,
        message: `You're ${levelProgress.progress.toFixed(0)}% of the way to your next professional level.`,
        impact: 'high'
      });
    }

    return {
      insights,
      recommendations,
      focusArea: categoryNames[lowestCategory as keyof typeof categoryNames],
      overallScore: Math.round((competencyData.currentCustomerAnalysis + competencyData.currentValueCommunication + competencyData.currentSalesExecution) / 3),
      levelProgress
    };
  }

  /**
   * Track real-world action completion
   */
  async trackRealWorldAction(customerId: string, actionData: {
    type: string;
    category: string;
    description: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    evidence?: string;
    tags?: string[];
  }): Promise<{ success: boolean; points: number; actionRecord: RealWorldAction; error?: string }> {
    try {
      const timestamp = new Date().toISOString();
      
      // Calculate points based on action type and impact
      const points = this.calculateActionPoints(actionData);
      
      // Create action record
      const actionRecord: RealWorldAction = {
        id: `action_${Date.now()}`,
        customerId,
        type: actionData.type,
        category: actionData.category,
        description: actionData.description,
        impact: actionData.impact,
        evidence: actionData.evidence || undefined,
        pointsAwarded: points,
        timestamp,
        verified: false, // Honor system - could be enhanced with verification
        tags: actionData.tags || []
      };

      // Store in Airtable
      await airtableService.storeRealWorldAction(actionRecord);
      
      // Update user progress with new points
      await this.updateUserProgressWithAction(customerId, points);
      
      console.log('✅ Real-world action tracked:', actionRecord);
      
      return {
        success: true,
        points,
        actionRecord
      };

    } catch (error) {
      console.error('❌ Error tracking real-world action:', error);
      return {
        success: false,
        points: 0,
        actionRecord: {} as RealWorldAction,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Calculate points for real-world actions
   */
  private calculateActionPoints(actionData: { type: string; impact: string }): number {
    const basePoints: Record<string, number> = {
      'customer_meeting': 100,
      'prospect_qualification': 75,
      'value_proposition_delivery': 150,
      'roi_presentation': 200,
      'proposal_creation': 250,
      'deal_closure': 500,
      'referral_generation': 300,
      'case_study_development': 400
    };

    const impactMultiplier: Record<string, number> = {
      'low': 0.8,
      'medium': 1.0,
      'high': 1.5,
      'critical': 2.0
    };

    const base = basePoints[actionData.type] || 50;
    const multiplier = impactMultiplier[actionData.impact] || 1.0;
    
    return Math.round(base * multiplier);
  }

  /**
   * Update user progress with new action points
   */
  private async updateUserProgressWithAction(userId: string, points: number): Promise<void> {
    try {
      const userProgress = await this.getUserProgress(userId);
      if (userProgress) {
        userProgress.totalPoints += points;
        userProgress.levelProgress = this.calculateLevelProgress(userProgress.totalPoints);
        userProgress.toolAccess = this.determineToolAccess(userProgress.currentScores, userProgress.totalPoints);
        userProgress.lastUpdated = new Date().toISOString();
        
        await this.storeUserProgress(userProgress);
      }
    } catch (error) {
      console.error('Failed to update user progress with action:', error);
    }
  }

  /**
   * Generate professional development recommendations
   */
  generateDevelopmentPlan(competencyData: {
    currentCustomerAnalysis: number;
    currentValueCommunication: number;
    currentSalesExecution: number;
    totalProgressPoints: number;
  }, timeframe: string = '30days'): DevelopmentPlan {
    const insights = this.generateCompetencyInsights({
      baselineCustomerAnalysis: 0,
      baselineValueCommunication: 0,
      baselineSalesExecution: 0,
      ...competencyData
    });
    
    const plan: DevelopmentPlan = {
      timeframe,
      objectives: [],
      activities: [],
      milestones: [],
      estimatedOutcome: {
        totalPointsGain: 0,
        competencyImprovements: {
          customerAnalysis: 0,
          valueCommunication: 0,
          salesExecution: 0
        },
        toolUnlocks: [],
        levelProgression: {
          willAdvance: false,
          currentLevel: '',
          potentialLevel: '',
          progressToNext: {} as LevelProgress
        }
      }
    };

    // Generate objectives based on competency gaps
    insights.recommendations.forEach(rec => {
      if (rec.priority === 'high') {
        plan.objectives.push({
          category: rec.category,
          target: `Reach 70+ points in ${rec.category}`,
          currentScore: competencyData[`current${rec.category.charAt(0).toUpperCase()}${rec.category.slice(1)}` as keyof typeof competencyData] as number,
          targetScore: 70,
          priority: 'high'
        });
      }
    });

    // Generate recommended activities
    const activities = [
      {
        type: 'platform_engagement' as const,
        title: 'Complete ICP Analysis Deep-Dive',
        description: 'Comprehensive customer intelligence framework mastery',
        estimatedTime: '2 hours',
        pointsPotential: 90,
        category: 'customerAnalysis'
      },
      {
        type: 'platform_engagement' as const,
        title: 'Master Buyer Persona Framework',
        description: 'Advanced stakeholder psychology and communication',
        estimatedTime: '3 hours',
        pointsPotential: 275,
        category: 'valueCommunication'
      },
      {
        type: 'real_world_action' as const,
        title: 'Apply ICP Framework to 3 Prospects',
        description: 'Real-world application of customer analysis skills',
        estimatedTime: '4 hours',
        pointsPotential: 300,
        category: 'customerAnalysis'
      },
      {
        type: 'real_world_action' as const,
        title: 'Deliver ROI Presentation to Prospect',
        description: 'Practice value communication methodology',
        estimatedTime: '2 hours',
        pointsPotential: 200,
        category: 'valueCommunication'
      }
    ];

    plan.activities = activities.filter(activity => {
      // Include activities relevant to user's development needs
      return insights.recommendations.some(rec => rec.category === activity.category);
    });

    // Generate milestones
    if (insights.levelProgress.next) {
      plan.milestones.push({
        type: 'level_progression',
        title: `Achieve ${insights.levelProgress.next.name}`,
        description: `Unlock advanced ${insights.levelProgress.next.name.toLowerCase()} capabilities`,
        targetPoints: insights.levelProgress.next.requiredPoints,
        currentPoints: competencyData.totalProgressPoints,
        estimatedTimeframe: '2-4 weeks'
      });
    }

    // Estimate outcomes
    const totalPotentialPoints = plan.activities.reduce((sum, activity) => sum + activity.pointsPotential, 0);
    plan.estimatedOutcome = {
      totalPointsGain: totalPotentialPoints,
      competencyImprovements: this.estimateCompetencyGains(competencyData, totalPotentialPoints),
      toolUnlocks: this.estimateToolUnlocks(competencyData, totalPotentialPoints),
      levelProgression: this.estimateLevelProgression(competencyData, totalPotentialPoints)
    };

    return plan;
  }

  /**
   * Estimate competency score improvements
   */
  private estimateCompetencyGains(competencyData: {
    currentCustomerAnalysis: number;
    currentValueCommunication: number;
    currentSalesExecution: number;
  }, additionalPoints: number): CompetencyScores {
    // Simplified estimation - in reality would be more sophisticated
    const pointsPerCategory = additionalPoints / 3;
    const scoreImprovement = pointsPerCategory / 10; // 10 points = 1 score point

    return {
      customerAnalysis: Math.min(100, competencyData.currentCustomerAnalysis + scoreImprovement),
      valueCommunication: Math.min(100, competencyData.currentValueCommunication + scoreImprovement),
      salesExecution: Math.min(100, competencyData.currentSalesExecution + scoreImprovement)
    };
  }

  /**
   * Estimate tool unlock potential
   */
  private estimateToolUnlocks(competencyData: {
    currentCustomerAnalysis: number;
    currentValueCommunication: number;
    currentSalesExecution: number;
  }, additionalPoints: number): string[] {
    const improvements = this.estimateCompetencyGains(competencyData, additionalPoints);
    const unlocks: string[] = [];

    if (improvements.valueCommunication >= 70) {
      unlocks.push('Cost Calculator');
    }

    if (improvements.salesExecution >= 70) {
      unlocks.push('Business Case Builder');
    }

    return unlocks;
  }

  /**
   * Estimate level progression potential
   */
  private estimateLevelProgression(competencyData: {
    totalProgressPoints: number;
  }, additionalPoints: number): {
    willAdvance: boolean;
    currentLevel: string;
    potentialLevel: string;
    progressToNext: LevelProgress;
  } {
    const newTotalPoints = competencyData.totalProgressPoints + additionalPoints;
    const currentLevel = this.calculateProfessionalLevel(competencyData.totalProgressPoints);
    const newLevel = this.calculateProfessionalLevel(newTotalPoints);

    return {
      willAdvance: newLevel.id !== currentLevel.id,
      currentLevel: currentLevel.name,
      potentialLevel: newLevel.name,
      progressToNext: this.calculateLevelProgress(newTotalPoints)
    };
  }

  /**
   * Determine tool access control based on competency scores and level
   */
  determineToolAccess(competencyScores: CompetencyScores, totalPoints: number): ToolAccessControl {
    const currentLevel = this.calculateProfessionalLevel(totalPoints);
    
    return {
      icpAnalysis: true, // Always available
      costCalculator: competencyScores.valueCommunication >= 70 || currentLevel.id !== 'foundation',
      businessCaseBuilder: competencyScores.salesExecution >= 70 || currentLevel.id !== 'foundation',
      advancedAnalytics: currentLevel.id === 'advanced' || currentLevel.id === 'expert' || currentLevel.id === 'master',
      customFrameworks: currentLevel.id === 'expert' || currentLevel.id === 'master'
    };
  }

  /**
   * Get user progress data
   */
  async getUserProgress(userId: string): Promise<UserProgressData | null> {
    try {
      // Check cache first
      if (this.userProgressCache.has(userId)) {
        return this.userProgressCache.get(userId)!;
      }

      // Fetch from Airtable
      const progressData = await airtableService.getUserProgress(userId);
      if (progressData) {
        this.userProgressCache.set(userId, progressData);
        return progressData;
      }

      return null;
    } catch (error) {
      console.error('Failed to get user progress:', error);
      return null;
    }
  }

  /**
   * Store user progress data
   */
  private async storeUserProgress(userProgress: UserProgressData): Promise<void> {
    try {
      // Update cache
      this.userProgressCache.set(userProgress.userId, userProgress);

      // Store in Airtable
      await airtableService.storeUserProgress(userProgress);
    } catch (error) {
      console.error('Failed to store user progress:', error);
    }
  }

  /**
   * Get all competency categories
   */
  getCompetencyCategories(): CompetencyCategory[] {
    return this.competencyCategories;
  }

  /**
   * Get all professional levels
   */
  getProfessionalLevels(): ProfessionalLevel[] {
    return this.professionalLevels;
  }

  /**
   * Get assessment questions for a specific category
   */
  getAssessmentQuestions(category: string): AssessmentQuestion[] {
    // This would typically return questions from a database
    // For now, return sample questions
    return [
      {
        id: `${category}_1`,
        category,
        question: `How do you currently approach ${category}?`,
        type: 'multiple_choice',
        options: [
          { value: 20, text: 'Basic approach' },
          { value: 40, text: 'Some structure' },
          { value: 60, text: 'Systematic method' },
          { value: 80, text: 'Advanced framework' },
          { value: 100, text: 'Expert methodology' }
        ]
      }
    ];
  }
}

// Create singleton instance
const assessmentService = new AssessmentService();

export default assessmentService;
