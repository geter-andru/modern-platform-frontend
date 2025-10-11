/**
 * Enhanced Competency Service - Next.js 15 + Static Generation
 * Systematic professional development tracking for Series A technical founders
 * Measurable competency progression with business impact focus
 */

'use server';

interface CompetencyArea {
  id: 'customer_intelligence' | 'value_communication' | 'sales_execution' | 'systematic_optimization';
  name: string;
  description: string;
  businessImpact: string;
  scalingRelevance: string;
}

interface CompetencyLevel {
  level: number;
  name: string;
  businessCapability: string;
  requiredPoints: number;
  professionalMilestones: string[];
  scalingBenefits: string[];
}

interface UserCompetency {
  userId: string;
  area: CompetencyArea['id'];
  currentLevel: number;
  currentPoints: number;
  nextLevelPoints: number;
  progressToNextLevel: number;
  recentAchievements: Achievement[];
  businessImpactScore: number;
  scalingReadiness: 'emerging' | 'developing' | 'proficient' | 'advanced' | 'expert';
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  pointsAwarded: number;
  businessImpact: 'high' | 'medium' | 'low';
  timestamp: string;
  professionalCredibility: number;
}

interface CompetencyAssessment {
  overallScore: number;
  readinessLevel: string;
  strengthAreas: CompetencyArea['id'][];
  developmentAreas: CompetencyArea['id'][];
  recommendedActions: string[];
  businessImpactPrediction: string;
  scalingVelocityEstimate: number;
}

class CompetencyService {
  private userCompetencies = new Map<string, UserCompetency[]>();
  
  private competencyAreas: CompetencyArea[] = [
    {
      id: 'customer_intelligence',
      name: 'Customer Intelligence',
      description: 'Systematic customer analysis and ICP development',
      businessImpact: 'Reduces customer acquisition cost by 40-60%',
      scalingRelevance: 'Essential for systematic $2M→$10M scaling'
    },
    {
      id: 'value_communication',
      name: 'Value Communication',
      description: 'Professional value proposition and ROI articulation',
      businessImpact: 'Increases conversion rates by 35-50%',
      scalingRelevance: 'Critical for stakeholder buy-in during scaling'
    },
    {
      id: 'sales_execution',
      name: 'Sales Execution',
      description: 'Systematic business case development and closing',
      businessImpact: 'Improves deal closure rate by 45-65%',
      scalingRelevance: 'Mandatory for scaling revenue systematically'
    },
    {
      id: 'systematic_optimization',
      name: 'Systematic Optimization',
      description: 'Continuous process improvement and scaling intelligence',
      businessImpact: 'Amplifies scaling velocity by 2-3x',
      scalingRelevance: 'Differentiator for sustained $10M+ growth'
    }
  ];

  private competencyLevels: CompetencyLevel[] = [
    {
      level: 1,
      name: 'Foundation',
      businessCapability: 'Basic systematic approach implementation',
      requiredPoints: 0,
      professionalMilestones: ['Complete tool introduction', 'Export first asset'],
      scalingBenefits: ['Structured approach establishment']
    },
    {
      level: 2,
      name: 'Developing',
      businessCapability: 'Consistent systematic application',
      requiredPoints: 100,
      professionalMilestones: ['Complete 5 systematic sessions', 'Track business impact'],
      scalingBenefits: ['Measurable process improvement', 'Stakeholder credibility']
    },
    {
      level: 3,
      name: 'Proficient',
      businessCapability: 'Professional-grade systematic execution',
      requiredPoints: 300,
      professionalMilestones: ['Demonstrate ROI improvement', 'Professional asset creation'],
      scalingBenefits: ['Systematic scaling readiness', 'Investor presentation capability']
    },
    {
      level: 4,
      name: 'Advanced',
      businessCapability: 'Systematic optimization and improvement',
      requiredPoints: 600,
      professionalMilestones: ['Process optimization evidence', 'Team scalability preparation'],
      scalingBenefits: ['Scaling system leadership', 'Systematic team development']
    },
    {
      level: 5,
      name: 'Expert',
      businessCapability: 'Systematic scaling mastery',
      requiredPoints: 1000,
      professionalMilestones: ['Proven scaling system results', 'Industry recognition'],
      scalingBenefits: ['Systematic $10M+ scaling capability', 'Industry thought leadership']
    }
  ];

  /**
   * Award competency points with Next.js server-side processing
   */
  async awardCompetencyPoints(
    userId: string,
    area: CompetencyArea['id'],
    points: number,
    achievement: Omit<Achievement, 'id' | 'timestamp'>
  ): Promise<{
    levelChanged: boolean;
    newLevel?: number;
    businessImpactIncrease: number;
  }> {
    const competency = await this.getUserCompetency(userId, area);
    const previousLevel = competency.currentLevel;
    
    // Award points and check for level progression
    competency.currentPoints += points;
    const newLevel = this.calculateLevel(competency.currentPoints);
    const levelChanged = newLevel > previousLevel;
    
    // Update competency data
    competency.currentLevel = newLevel;
    competency.nextLevelPoints = this.getNextLevelRequirement(newLevel);
    competency.progressToNextLevel = this.calculateProgressToNextLevel(competency.currentPoints, newLevel);
    
    // Add achievement
    const fullAchievement: Achievement = {
      ...achievement,
      id: `achievement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    
    competency.recentAchievements.unshift(fullAchievement);
    competency.recentAchievements = competency.recentAchievements.slice(0, 10); // Keep last 10
    
    // Update business impact score
    const businessImpactIncrease = this.calculateBusinessImpactIncrease(achievement.businessImpact);
    competency.businessImpactScore += businessImpactIncrease;
    
    // Update scaling readiness
    competency.scalingReadiness = this.determineScalingReadiness(competency);
    
    await this.persistCompetency(userId, competency);
    
    return {
      levelChanged,
      newLevel: levelChanged ? newLevel : undefined,
      businessImpactIncrease
    };
  }

  /**
   * Get user's competency profile (Server Component compatible)
   */
  async getUserCompetency(userId: string, area: CompetencyArea['id']): Promise<UserCompetency> {
    const userCompetencies = this.userCompetencies.get(userId) || [];
    
    let competency = userCompetencies.find(c => c.area === area);
    if (!competency) {
      competency = await this.initializeCompetency(userId, area);
      userCompetencies.push(competency);
      this.userCompetencies.set(userId, userCompetencies);
    }
    
    return competency;
  }

  /**
   * Get complete competency assessment for systematic scaling
   */
  async getCompetencyAssessment(userId: string): Promise<CompetencyAssessment> {
    const competencies = await Promise.all(
      this.competencyAreas.map(area => this.getUserCompetency(userId, area.id))
    );
    
    const overallScore = Math.round(
      competencies.reduce((sum, comp) => sum + comp.businessImpactScore, 0) / competencies.length
    );
    
    const strengthAreas = competencies
      .filter(comp => comp.businessImpactScore > 70)
      .map(comp => comp.area);
    
    const developmentAreas = competencies
      .filter(comp => comp.businessImpactScore < 50)
      .map(comp => comp.area);
    
    return {
      overallScore,
      readinessLevel: this.determineOverallReadiness(competencies),
      strengthAreas,
      developmentAreas,
      recommendedActions: this.generateRecommendedActions(competencies),
      businessImpactPrediction: this.predictBusinessImpact(competencies),
      scalingVelocityEstimate: this.estimateScalingVelocity(competencies)
    };
  }

  /**
   * Get systematic progression recommendations
   */
  async getProgressionRecommendations(userId: string): Promise<{
    immediateActions: string[];
    shortTermGoals: string[];
    longTermObjectives: string[];
    businessImpactOpportunities: string[];
  }> {
    const competencies = await Promise.all(
      this.competencyAreas.map(area => this.getUserCompetency(userId, area.id))
    );
    
    return {
      immediateActions: this.generateImmediateActions(competencies),
      shortTermGoals: this.generateShortTermGoals(competencies),
      longTermObjectives: this.generateLongTermObjectives(competencies),
      businessImpactOpportunities: this.identifyBusinessOpportunities(competencies)
    };
  }

  /**
   * Track professional milestone completion
   */
  async trackMilestone(
    userId: string,
    area: CompetencyArea['id'],
    milestone: string,
    businessImpact: 'transformational' | 'significant' | 'incremental'
  ): Promise<void> {
    const points = businessImpact === 'transformational' ? 100 :
                   businessImpact === 'significant' ? 50 : 25;
    
    await this.awardCompetencyPoints(userId, area, points, {
      name: `Milestone: ${milestone}`,
      description: `Professional milestone completed with ${businessImpact} business impact`,
      pointsAwarded: points,
      businessImpact: businessImpact === 'transformational' ? 'high' :
                      businessImpact === 'significant' ? 'medium' : 'low',
      professionalCredibility: businessImpact === 'transformational' ? 95 :
                              businessImpact === 'significant' ? 85 : 75
    });
  }

  /**
   * Initialize new competency area for user
   */
  private async initializeCompetency(userId: string, area: CompetencyArea['id']): Promise<UserCompetency> {
    return {
      userId,
      area,
      currentLevel: 1,
      currentPoints: 0,
      nextLevelPoints: 100,
      progressToNextLevel: 0,
      recentAchievements: [],
      businessImpactScore: 25, // Starting baseline for Series A founders
      scalingReadiness: 'emerging'
    };
  }

  /**
   * Calculate competency level based on points
   */
  private calculateLevel(points: number): number {
    const level = this.competencyLevels
      .filter(level => points >= level.requiredPoints)
      .sort((a, b) => b.requiredPoints - a.requiredPoints)[0];
    
    return level ? level.level : 1;
  }

  /**
   * Get next level requirement
   */
  private getNextLevelRequirement(currentLevel: number): number {
    const nextLevel = this.competencyLevels.find(level => level.level > currentLevel);
    return nextLevel ? nextLevel.requiredPoints : 1000;
  }

  /**
   * Calculate progress to next level
   */
  private calculateProgressToNextLevel(currentPoints: number, currentLevel: number): number {
    const currentLevelReq = this.competencyLevels.find(l => l.level === currentLevel)?.requiredPoints || 0;
    const nextLevelReq = this.getNextLevelRequirement(currentLevel);
    
    if (nextLevelReq === currentLevelReq) return 100;
    
    const progress = ((currentPoints - currentLevelReq) / (nextLevelReq - currentLevelReq)) * 100;
    return Math.min(100, Math.max(0, progress));
  }

  /**
   * Calculate business impact increase
   */
  private calculateBusinessImpactIncrease(impact: Achievement['businessImpact']): number {
    return impact === 'high' ? 10 : impact === 'medium' ? 5 : 2;
  }

  /**
   * Determine scaling readiness based on competency
   */
  private determineScalingReadiness(competency: UserCompetency): UserCompetency['scalingReadiness'] {
    if (competency.businessImpactScore >= 90) return 'expert';
    if (competency.businessImpactScore >= 75) return 'advanced';
    if (competency.businessImpactScore >= 60) return 'proficient';
    if (competency.businessImpactScore >= 40) return 'developing';
    return 'emerging';
  }

  /**
   * Determine overall scaling readiness
   */
  private determineOverallReadiness(competencies: UserCompetency[]): string {
    const averageScore = competencies.reduce((sum, comp) => sum + comp.businessImpactScore, 0) / competencies.length;
    
    if (averageScore >= 85) return 'Ready for systematic $10M+ scaling';
    if (averageScore >= 70) return 'Ready for accelerated scaling to $5M+';
    if (averageScore >= 55) return 'Prepared for systematic scaling approach';
    if (averageScore >= 40) return 'Building systematic scaling foundation';
    return 'Establishing systematic approach fundamentals';
  }

  /**
   * Generate recommended actions based on competency analysis
   */
  private generateRecommendedActions(competencies: UserCompetency[]): string[] {
    const actions: string[] = [];
    
    const lowestCompetency = competencies.sort((a, b) => a.businessImpactScore - b.businessImpactScore)[0];
    actions.push(`Prioritize ${this.getAreaName(lowestCompetency.area)} development for balanced scaling capability`);
    
    const highestCompetency = competencies.sort((a, b) => b.businessImpactScore - a.businessImpactScore)[0];
    if (highestCompetency.businessImpactScore > 80) {
      actions.push(`Leverage ${this.getAreaName(highestCompetency.area)} strength for accelerated business impact`);
    }
    
    return actions;
  }

  /**
   * Predict business impact based on competency profile
   */
  private predictBusinessImpact(competencies: UserCompetency[]): string {
    const averageScore = competencies.reduce((sum, comp) => sum + comp.businessImpactScore, 0) / competencies.length;
    
    if (averageScore >= 80) return 'High probability of systematic scaling success with 2-3x velocity improvement';
    if (averageScore >= 65) return 'Good systematic scaling potential with measurable efficiency gains';
    if (averageScore >= 50) return 'Moderate systematic improvement with structured approach benefits';
    return 'Foundation building phase with systematic approach establishment';
  }

  /**
   * Estimate scaling velocity based on competency
   */
  private estimateScalingVelocity(competencies: UserCompetency[]): number {
    const averageLevel = competencies.reduce((sum, comp) => sum + comp.currentLevel, 0) / competencies.length;
    return Math.round(averageLevel * 0.5 * 100) / 100; // Scaling velocity multiplier
  }

  /**
   * Generate immediate action recommendations
   */
  private generateImmediateActions(competencies: UserCompetency[]): string[] {
    const actions: string[] = [];
    
    competencies.forEach(comp => {
      if (comp.businessImpactScore < 40) {
        actions.push(`Complete ${this.getAreaName(comp.area)} foundation milestone`);
      }
    });
    
    return actions.slice(0, 3); // Top 3 immediate actions
  }

  /**
   * Generate short-term goals
   */
  private generateShortTermGoals(competencies: UserCompetency[]): string[] {
    return competencies
      .filter(comp => comp.currentLevel < 3)
      .map(comp => `Reach Proficient level in ${this.getAreaName(comp.area)}`)
      .slice(0, 2);
  }

  /**
   * Generate long-term objectives
   */
  private generateLongTermObjectives(competencies: UserCompetency[]): string[] {
    return [
      'Achieve Advanced level across all competency areas',
      'Demonstrate systematic scaling capability to $10M+ ARR',
      'Establish systematic optimization expertise for sustained growth'
    ];
  }

  /**
   * Identify business impact opportunities
   */
  private identifyBusinessOpportunities(competencies: UserCompetency[]): string[] {
    const opportunities: string[] = [];
    
    const customerIntelligence = competencies.find(c => c.area === 'customer_intelligence');
    if (customerIntelligence && customerIntelligence.businessImpactScore > 70) {
      opportunities.push('Leverage customer intelligence for 40-60% CAC reduction');
    }
    
    const valueCommunication = competencies.find(c => c.area === 'value_communication');
    if (valueCommunication && valueCommunication.businessImpactScore > 70) {
      opportunities.push('Apply value communication mastery for 35-50% conversion improvement');
    }
    
    return opportunities;
  }

  /**
   * Get human-readable area name
   */
  private getAreaName(areaId: CompetencyArea['id']): string {
    return this.competencyAreas.find(area => area.id === areaId)?.name || areaId;
  }

  /**
   * Persist competency data (would integrate with database in production)
   */
  private async persistCompetency(userId: string, competency: UserCompetency): Promise<void> {
    // Server-side persistence logic would go here
    // For now, maintaining in-memory storage
  }
}

// Export singleton instance for server-side usage
export const competencyService = new CompetencyService();
export type { UserCompetency, CompetencyAssessment, Achievement, CompetencyArea };