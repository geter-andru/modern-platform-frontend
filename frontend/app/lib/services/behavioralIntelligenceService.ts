/**
 * Enhanced Behavioral Intelligence Service - Next.js 15 + Server Actions
 * Systematic revenue scaling intelligence for Series A technical founders
 * Provides measurable professional credibility and competency tracking
 */

'use server';

interface BehavioralEvent {
  userId: string;
  eventType: 'tool_usage' | 'export_action' | 'competency_milestone' | 'scaling_metric' | 'professional_action';
  toolId?: string;
  sessionId: string;
  timestamp: string;
  scalingContext: {
    currentARR: string; // e.g., "$2.5M"
    targetARR: string;  // e.g., "$10M"
    growthStage: 'early_scaling' | 'rapid_scaling' | 'mature_scaling';
    systematicApproach: boolean;
  };
  businessImpact: 'high' | 'medium' | 'low';
  professionalCredibility: number; // 0-100 score
}

interface ScalingIntelligence {
  userId: string;
  currentScalingScore: number;
  systematicProgressionRate: number;
  professionalCredibilityTrend: 'improving' | 'stable' | 'declining';
  competencyMilestones: {
    customerIntelligence: number;
    valueCommunication: number;
    salesExecution: number;
    systematicOptimization: number;
  };
  scalingVelocity: {
    weeklyProgress: number;
    monthlyMilestones: number;
    quarterlyTargets: number;
  };
  riskFactors: {
    inconsistentSystemUsage: boolean;
    lowBusinessImpactActions: boolean;
    professionalCredibilityDrift: boolean;
  };
  nextSystematicActions: string[];
}

interface FounderScalingMetrics {
  revenueIntelligenceMaturity: number;
  systematicApproachConsistency: number;
  professionalCredibilityMaintenance: number;
  competencyAdvancementVelocity: number;
  businessImpactAmplification: number;
}

class BehavioralIntelligenceService {
  private scalingProfiles = new Map<string, ScalingIntelligence>();
  
  /**
   * Track systematic scaling behavior with Next.js Server Action
   */
  async trackScalingBehavior(event: Omit<BehavioralEvent, 'sessionId' | 'timestamp'>): Promise<void> {
    const enhancedEvent: BehavioralEvent = {
      ...event,
      sessionId: await this.generateSecureSessionId(),
      timestamp: new Date().toISOString()
    };

    // Server-side processing for immediate systematic insights
    await this.processScalingEvent(enhancedEvent);
    
    // Real-time credibility assessment for Series A founders
    if (event.businessImpact === 'high') {
      await this.updateProfessionalCredibilityScore(event.userId, enhancedEvent);
    }
  }

  /**
   * Get real-time scaling intelligence profile (Server Component compatible)
   */
  async getScalingIntelligence(userId: string): Promise<ScalingIntelligence> {
    if (!this.scalingProfiles.has(userId)) {
      await this.buildFounderScalingProfile(userId);
    }
    return this.scalingProfiles.get(userId)!;
  }

  /**
   * Assess systematic revenue scaling readiness
   */
  async assessScalingReadiness(userId: string): Promise<FounderScalingMetrics> {
    const profile = await this.getScalingIntelligence(userId);
    
    return {
      revenueIntelligenceMaturity: this.calculateRevenueIntelligenceMaturity(profile),
      systematicApproachConsistency: this.assessSystematicConsistency(profile),
      professionalCredibilityMaintenance: profile.competencyMilestones.customerIntelligence,
      competencyAdvancementVelocity: profile.scalingVelocity.monthlyMilestones,
      businessImpactAmplification: this.calculateBusinessImpactScore(profile)
    };
  }

  /**
   * Generate systematic scaling recommendations
   */
  async getScalingRecommendations(userId: string): Promise<{
    immediateActions: string[];
    systematicImprovements: string[];
    professionalCredibilityActions: string[];
    scalingAccelerators: string[];
  }> {
    const profile = await this.getScalingIntelligence(userId);
    
    return {
      immediateActions: this.generateImmediateScalingActions(profile),
      systematicImprovements: this.identifySystematicImprovements(profile),
      professionalCredibilityActions: this.recommendCredibilityActions(profile),
      scalingAccelerators: this.suggestScalingAccelerators(profile)
    };
  }

  /**
   * Track professional milestone achievement
   */
  async trackProfessionalMilestone(
    userId: string, 
    milestone: string, 
    businessImpact: 'transformational' | 'significant' | 'incremental'
  ): Promise<void> {
    await this.trackScalingBehavior({
      userId,
      eventType: 'competency_milestone',
      scalingContext: {
        currentARR: '$2M+', // Would be dynamic in production
        targetARR: '$10M',
        growthStage: 'rapid_scaling',
        systematicApproach: true
      },
      businessImpact: businessImpact === 'transformational' ? 'high' : 
                     businessImpact === 'significant' ? 'medium' : 'low',
      professionalCredibility: businessImpact === 'transformational' ? 95 : 
                              businessImpact === 'significant' ? 85 : 75
    });
  }

  /**
   * Process scaling event with server-side intelligence
   */
  private async processScalingEvent(event: BehavioralEvent): Promise<void> {
    const profile = await this.getScalingIntelligence(event.userId);
    
    // Update systematic progression metrics
    this.updateScalingMetrics(profile, event);
    
    // Assess professional credibility maintenance
    this.updateCredibilityTrend(profile, event);
    
    // Generate next systematic actions
    profile.nextSystematicActions = this.generateNextActions(profile, event);
    
    this.scalingProfiles.set(event.userId, profile);
  }

  /**
   * Build comprehensive founder scaling profile
   */
  private async buildFounderScalingProfile(userId: string): Promise<void> {
    const profile: ScalingIntelligence = {
      userId,
      currentScalingScore: 75, // Starting systematic scaling baseline
      systematicProgressionRate: 1.2,
      professionalCredibilityTrend: 'improving',
      competencyMilestones: {
        customerIntelligence: 60,
        valueCommunication: 55,
        salesExecution: 45,
        systematicOptimization: 40
      },
      scalingVelocity: {
        weeklyProgress: 8,
        monthlyMilestones: 3,
        quarterlyTargets: 2
      },
      riskFactors: {
        inconsistentSystemUsage: false,
        lowBusinessImpactActions: false,
        professionalCredibilityDrift: false
      },
      nextSystematicActions: [
        'Complete comprehensive ICP analysis session',
        'Export first professional stakeholder asset',
        'Track real-world scaling application metrics'
      ]
    };
    
    this.scalingProfiles.set(userId, profile);
  }

  /**
   * Update professional credibility score with server-side processing
   */
  private async updateProfessionalCredibilityScore(userId: string, event: BehavioralEvent): Promise<void> {
    const profile = await this.getScalingIntelligence(userId);
    
    // Systematic scaling credibility adjustment
    const credibilityDelta = this.calculateCredibilityDelta(event);
    profile.currentScalingScore = Math.max(0, Math.min(100, profile.currentScalingScore + credibilityDelta));
    
    // Professional credibility trend assessment
    if (credibilityDelta > 5) profile.professionalCredibilityTrend = 'improving';
    else if (credibilityDelta < -3) profile.professionalCredibilityTrend = 'declining';
    else profile.professionalCredibilityTrend = 'stable';
  }

  /**
   * Calculate systematic scaling metrics
   */
  private updateScalingMetrics(profile: ScalingIntelligence, event: BehavioralEvent): void {
    // Update competency milestone based on tool usage
    if (event.toolId === 'icp-analysis') {
      profile.competencyMilestones.customerIntelligence += 2;
    } else if (event.toolId === 'cost-calculator') {
      profile.competencyMilestones.valueCommunication += 2;
    } else if (event.toolId === 'business-case') {
      profile.competencyMilestones.salesExecution += 2;
    }
    
    // Update scaling velocity
    profile.scalingVelocity.weeklyProgress += event.businessImpact === 'high' ? 5 : 
                                             event.businessImpact === 'medium' ? 3 : 1;
  }

  /**
   * Update professional credibility trend
   */
  private updateCredibilityTrend(profile: ScalingIntelligence, event: BehavioralEvent): void {
    const systematicUsage = event.scalingContext.systematicApproach;
    const businessImpact = event.businessImpact;
    
    // Assess risk factors for Series A founders
    profile.riskFactors.inconsistentSystemUsage = !systematicUsage;
    profile.riskFactors.lowBusinessImpactActions = businessImpact === 'low';
    profile.riskFactors.professionalCredibilityDrift = event.professionalCredibility < 70;
  }

  /**
   * Generate immediate scaling actions
   */
  private generateImmediateScalingActions(profile: ScalingIntelligence): string[] {
    const actions: string[] = [];
    
    if (profile.competencyMilestones.customerIntelligence < 70) {
      actions.push('Complete systematic ICP analysis to strengthen customer intelligence');
    }
    
    if (profile.scalingVelocity.weeklyProgress < 10) {
      actions.push('Increase systematic tool usage frequency for scaling acceleration');
    }
    
    if (profile.riskFactors.professionalCredibilityDrift) {
      actions.push('Focus on high-business-impact actions to restore professional credibility');
    }
    
    return actions;
  }

  /**
   * Identify systematic improvements
   */
  private identifySystematicImprovements(profile: ScalingIntelligence): string[] {
    const improvements: string[] = [];
    
    const lowestMilestone = Object.entries(profile.competencyMilestones)
      .sort(([,a], [,b]) => a - b)[0];
    
    improvements.push(`Strengthen ${lowestMilestone[0].replace(/([A-Z])/g, ' $1').toLowerCase()} competency`);
    
    if (profile.systematicProgressionRate < 1.5) {
      improvements.push('Implement more systematic approach to scaling activities');
    }
    
    return improvements;
  }

  /**
   * Recommend professional credibility actions
   */
  private recommendCredibilityActions(profile: ScalingIntelligence): string[] {
    if (profile.currentScalingScore > 85) {
      return ['Maintain current systematic scaling excellence'];
    }
    
    return [
      'Export professional assets to demonstrate systematic capability',
      'Track real-world application of scaling insights',
      'Complete competency milestones with business impact focus'
    ];
  }

  /**
   * Suggest scaling accelerators
   */
  private suggestScalingAccelerators(profile: ScalingIntelligence): string[] {
    return [
      'Leverage all three core tools systematically for compound scaling effects',
      'Export professional assets for stakeholder credibility building',
      'Track systematic progression metrics weekly for optimized growth velocity'
    ];
  }

  // Utility methods
  private calculateRevenueIntelligenceMaturity(profile: ScalingIntelligence): number {
    return Math.round(
      (Object.values(profile.competencyMilestones).reduce((a, b) => a + b, 0) / 4)
    );
  }

  private assessSystematicConsistency(profile: ScalingIntelligence): number {
    return profile.riskFactors.inconsistentSystemUsage ? 60 : 90;
  }

  private calculateBusinessImpactScore(profile: ScalingIntelligence): number {
    return profile.scalingVelocity.monthlyMilestones * 20;
  }

  private calculateCredibilityDelta(event: BehavioralEvent): number {
    let delta = 0;
    
    if (event.businessImpact === 'high') delta += 5;
    else if (event.businessImpact === 'medium') delta += 2;
    
    if (event.scalingContext.systematicApproach) delta += 2;
    if (event.professionalCredibility > 90) delta += 3;
    
    return delta;
  }

  private generateNextActions(profile: ScalingIntelligence, event: BehavioralEvent): string[] {
    const actions = [...profile.nextSystematicActions];
    
    if (event.businessImpact === 'high') {
      actions.unshift('Continue systematic high-impact scaling activities');
    }
    
    return actions.slice(0, 5); // Top 5 systematic actions
  }

  private async generateSecureSessionId(): Promise<string> {
    return `scaling_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance for server-side usage
export const behavioralIntelligenceService = new BehavioralIntelligenceService();
export type { BehavioralEvent, ScalingIntelligence, FounderScalingMetrics };