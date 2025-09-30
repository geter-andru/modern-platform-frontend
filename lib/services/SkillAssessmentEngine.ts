/** Skill Assessment Engine - TypeScript Migration

 * Professional competency assessment and skill level determination
 * Maintains professional credibility with competency-based language
 * Migrated from legacy platform with Next.js and Supabase integration
 */

import { supabase } from '../supabase/client';
import { supabaseAdmin } from '../supabase/admin';
import { UserBehaviorData } from './BehavioralIntelligenceService';

export interface SkillLevels {
  customerAnalysis: number;
  valueCommunication: number;
  executiveReadiness: number;
  financialModeling: number;
  businessCaseDevelopment: number;
  stakeholderEngagement: number;
  professionalCredibility: number;
  overallCompetency: number;
}

export interface CompetencyLevel {
  level: 'foundation' | 'developing' | 'proficient' | 'advanced' | 'expert';
  score: number;
  description: string;
  nextLevelRequirements: string[];
  unlockedFeatures: string[];
}

export interface SkillAssessmentResult {
  userId: string;
  skillLevels: SkillLevels;
  competencyLevel: CompetencyLevel;
  strengths: string[];
  improvementAreas: string[];
  recommendations: string[];
  assessmentDate: number;
}

export class SkillAssessmentEngine {
  private supabase = supabase;
  private supabaseAdmin = supabaseAdmin;

  // Competency level definitions
  private competencyLevels: Record<string, CompetencyLevel> = {
    foundation: {
      level: 'foundation',
      score: 0.2,
      description: 'Building fundamental professional competencies',
      nextLevelRequirements: [
        'Complete 3+ ICP analyses with detailed review',
        'Export at least 2 business cases',
        'Demonstrate basic stakeholder customization'
      ],
      unlockedFeatures: [
        'Basic ICP Analysis',
        'Standard Cost Calculator',
        'Simple Business Case Builder'
      ]
    },
    developing: {
      level: 'developing',
      score: 0.4,
      description: 'Developing professional skills and business acumen',
      nextLevelRequirements: [
        'Achieve 80%+ accuracy in company ratings',
        'Complete business cases in <5 minutes',
        'Use multiple stakeholder perspectives'
      ],
      unlockedFeatures: [
        'Advanced ICP Analysis',
        'Enhanced Cost Calculator',
        'Stakeholder-Specific Business Cases'
      ]
    },
    proficient: {
      level: 'proficient',
      score: 0.6,
      description: 'Demonstrating proficient professional capabilities',
      nextLevelRequirements: [
        'Maintain 90%+ professional credibility score',
        'Export to multiple CRM systems',
        'Demonstrate strategic export timing'
      ],
      unlockedFeatures: [
        'Professional Dashboard',
        'Advanced Export Options',
        'Competency Tracking'
      ]
    },
    advanced: {
      level: 'advanced',
      score: 0.8,
      description: 'Advanced professional competency and business expertise',
      nextLevelRequirements: [
        'Achieve 95%+ accuracy across all tools',
        'Demonstrate executive-level communication',
        'Show consistent professional development'
      ],
      unlockedFeatures: [
        'Executive Dashboard',
        'Advanced Analytics',
        'Professional Development Tracking'
      ]
    },
    expert: {
      level: 'expert',
      score: 1.0,
      description: 'Expert-level professional competency and business mastery',
      nextLevelRequirements: [
        'Maintain expert-level performance consistently',
        'Demonstrate leadership in professional development',
        'Contribute to platform improvement'
      ],
      unlockedFeatures: [
        'Expert Dashboard',
        'Advanced Professional Tools',
        'Mentorship Capabilities'
      ]
    }
  };

  public static assessAllSkills(behaviorData: UserBehaviorData): SkillLevels {
    const engine = new SkillAssessmentEngine();
    return engine.calculateSkillLevels(behaviorData);
  }

  public static determineCompetencyLevel(skillLevels: SkillLevels): CompetencyLevel {
    const engine = new SkillAssessmentEngine();
    return engine.getCompetencyLevel(skillLevels);
  }

  private calculateSkillLevels(behaviorData: UserBehaviorData): SkillLevels {
    return {
      customerAnalysis: this.assessCustomerAnalysisSkill(behaviorData),
      valueCommunication: this.assessValueCommunicationSkill(behaviorData),
      executiveReadiness: this.assessExecutiveReadinessSkill(behaviorData),
      financialModeling: this.assessFinancialModelingSkill(behaviorData),
      businessCaseDevelopment: this.assessBusinessCaseDevelopmentSkill(behaviorData),
      stakeholderEngagement: this.assessStakeholderEngagementSkill(behaviorData),
      professionalCredibility: this.assessProfessionalCredibilitySkill(behaviorData),
      overallCompetency: 0 // Will be calculated
    };
  }

  private assessCustomerAnalysisSkill(behaviorData: UserBehaviorData): number {
    const icpBehavior = behaviorData.icpBehavior;
    let score = 0.5; // Base score

    // Review time indicates depth of analysis
    if (icpBehavior.reviewTime > 180000) score += 0.2; // 3+ minutes
    else if (icpBehavior.reviewTime > 120000) score += 0.1; // 2+ minutes

    // Return visits indicate continued engagement
    if (icpBehavior.returnVisits > 2) score += 0.15;
    else if (icpBehavior.returnVisits > 0) score += 0.1;

    // Customization shows analytical thinking
    if (icpBehavior.customizedCriteria) score += 0.1;

    // Export indicates value recognition
    if (icpBehavior.exportedSummary) score += 0.1;

    // Rating accuracy shows analytical quality
    score += icpBehavior.ratingAccuracy * 0.2;

    return Math.min(score, 1.0);
  }

  private assessValueCommunicationSkill(behaviorData: UserBehaviorData): number {
    const businessCaseBehavior = behaviorData.businessCaseBehavior;
    let score = 0.5; // Base score

    // Multiple stakeholder views show communication versatility
    if (businessCaseBehavior.stakeholderViewSwitches > 3) score += 0.2;
    else if (businessCaseBehavior.stakeholderViewSwitches > 1) score += 0.1;

    // Multiple format exports show communication adaptability
    if (businessCaseBehavior.multipleFormatExports) score += 0.15;

    // Strategic export timing shows communication planning
    if (businessCaseBehavior.strategicExportTiming) score += 0.1;

    // Quality score reflects communication effectiveness
    score += businessCaseBehavior.qualityScore * 0.2;

    return Math.min(score, 1.0);
  }

  private assessExecutiveReadinessSkill(behaviorData: UserBehaviorData): number {
    const overallMetrics = behaviorData.overallMetrics;
    let score = 0.5; // Base score

    // Professional credibility is crucial for executive readiness
    if (overallMetrics.professionalCredibilityScore >= 100) score += 0.3;
    else if (overallMetrics.professionalCredibilityScore >= 95) score += 0.2;

    // Export behavior shows executive-level action
    if (overallMetrics.totalExports > 3) score += 0.15;
    else if (overallMetrics.totalExports > 0) score += 0.1;

    // Session duration indicates executive-level engagement
    if (overallMetrics.averageSessionDuration > 900000) score += 0.1; // 15+ minutes

    // Tool sequence shows comprehensive understanding
    if (overallMetrics.toolSequenceLength > 3) score += 0.1;

    return Math.min(score, 1.0);
  }

  private assessFinancialModelingSkill(behaviorData: UserBehaviorData): number {
    const calculatorBehavior = behaviorData.calculatorBehavior;
    let score = 0.5; // Base score

    // Variable adjustments show financial modeling depth
    if (calculatorBehavior.variableAdjustments > 5) score += 0.2;
    else if (calculatorBehavior.variableAdjustments > 2) score += 0.1;

    // Chart exports show financial communication
    if (calculatorBehavior.exportedCharts) score += 0.15;

    // Edge case testing shows financial modeling sophistication
    if (calculatorBehavior.edgeCaseTesting) score += 0.1;

    // Accuracy score reflects financial modeling quality
    score += calculatorBehavior.accuracyScore * 0.2;

    return Math.min(score, 1.0);
  }

  private assessBusinessCaseDevelopmentSkill(behaviorData: UserBehaviorData): number {
    const businessCaseBehavior = behaviorData.businessCaseBehavior;
    let score = 0.5; // Base score

    // Completion time shows efficiency
    if (businessCaseBehavior.completionTime < 300000) score += 0.2; // <5 minutes
    else if (businessCaseBehavior.completionTime < 420000) score += 0.1; // <7 minutes

    // Stakeholder switches show comprehensive thinking
    if (businessCaseBehavior.stakeholderViewSwitches > 2) score += 0.15;

    // Multiple exports show business case versatility
    if (businessCaseBehavior.multipleFormatExports) score += 0.1;

    // Quality score reflects business case development quality
    score += businessCaseBehavior.qualityScore * 0.2;

    return Math.min(score, 1.0);
  }

  private assessStakeholderEngagementSkill(behaviorData: UserBehaviorData): number {
    const businessCaseBehavior = behaviorData.businessCaseBehavior;
    const overallMetrics = behaviorData.overallMetrics;
    let score = 0.5; // Base score

    // Stakeholder view switches show engagement versatility
    if (businessCaseBehavior.stakeholderViewSwitches > 3) score += 0.25;
    else if (businessCaseBehavior.stakeholderViewSwitches > 1) score += 0.15;

    // Strategic export timing shows stakeholder consideration
    if (businessCaseBehavior.strategicExportTiming) score += 0.15;

    // Multiple format exports show stakeholder accommodation
    if (businessCaseBehavior.multipleFormatExports) score += 0.1;

    // Professional credibility shows stakeholder appropriateness
    if (overallMetrics.professionalCredibilityScore >= 100) score += 0.1;

    return Math.min(score, 1.0);
  }

  private assessProfessionalCredibilitySkill(behaviorData: UserBehaviorData): number {
    const overallMetrics = behaviorData.overallMetrics;
    let score = 0.5; // Base score

    // Professional credibility score is the primary indicator
    score += (overallMetrics.professionalCredibilityScore / 100) * 0.4;

    // Export behavior shows professional action
    if (overallMetrics.totalExports > 2) score += 0.1;

    // Session duration shows professional engagement
    if (overallMetrics.averageSessionDuration > 600000) score += 0.1; // 10+ minutes

    return Math.min(score, 1.0);
  }

  private getCompetencyLevel(skillLevels: SkillLevels): CompetencyLevel {
    // Calculate overall competency score
    const skillScores = [
      skillLevels.customerAnalysis,
      skillLevels.valueCommunication,
      skillLevels.executiveReadiness,
      skillLevels.financialModeling,
      skillLevels.businessCaseDevelopment,
      skillLevels.stakeholderEngagement,
      skillLevels.professionalCredibility
    ];

    const overallScore = skillScores.reduce((sum, score) => sum + score, 0) / skillScores.length;
    skillLevels.overallCompetency = overallScore;

    // Determine competency level based on overall score
    if (overallScore >= 0.9) return this.competencyLevels.expert;
    if (overallScore >= 0.8) return this.competencyLevels.advanced;
    if (overallScore >= 0.6) return this.competencyLevels.proficient;
    if (overallScore >= 0.4) return this.competencyLevels.developing;
    return this.competencyLevels.foundation;
  }

  public async performSkillAssessment(userId: string, behaviorData: UserBehaviorData): Promise<SkillAssessmentResult> {
    const skillLevels = this.calculateSkillLevels(behaviorData);
    const competencyLevel = this.getCompetencyLevel(skillLevels);

    const assessment: SkillAssessmentResult = {
      userId,
      skillLevels,
      competencyLevel,
      strengths: this.identifyStrengths(skillLevels),
      improvementAreas: this.identifyImprovementAreas(skillLevels),
      recommendations: this.generateRecommendations(skillLevels, competencyLevel),
      assessmentDate: Date.now()
    };

    // Store assessment in Supabase
    await this.storeAssessment(assessment);

    return assessment;
  }

  private identifyStrengths(skillLevels: SkillLevels): string[] {
    const strengths: string[] = [];
    const skillNames: Record<keyof SkillLevels, string> = {
      customerAnalysis: 'Customer Analysis',
      valueCommunication: 'Value Communication',
      executiveReadiness: 'Executive Readiness',
      financialModeling: 'Financial Modeling',
      businessCaseDevelopment: 'Business Case Development',
      stakeholderEngagement: 'Stakeholder Engagement',
      professionalCredibility: 'Professional Credibility',
      overallCompetency: 'Overall Competency'
    };

    Object.entries(skillLevels).forEach(([skill, score]) => {
      if (skill !== 'overallCompetency' && score >= 0.8) {
        strengths.push(skillNames[skill as keyof SkillLevels]);
      }
    });

    return strengths;
  }

  private identifyImprovementAreas(skillLevels: SkillLevels): string[] {
    const improvementAreas: string[] = [];
    const skillNames: Record<keyof SkillLevels, string> = {
      customerAnalysis: 'Customer Analysis',
      valueCommunication: 'Value Communication',
      executiveReadiness: 'Executive Readiness',
      financialModeling: 'Financial Modeling',
      businessCaseDevelopment: 'Business Case Development',
      stakeholderEngagement: 'Stakeholder Engagement',
      professionalCredibility: 'Professional Credibility',
      overallCompetency: 'Overall Competency'
    };

    Object.entries(skillLevels).forEach(([skill, score]) => {
      if (skill !== 'overallCompetency' && score < 0.6) {
        improvementAreas.push(skillNames[skill as keyof SkillLevels]);
      }
    });

    return improvementAreas;
  }

  private generateRecommendations(skillLevels: SkillLevels, competencyLevel: CompetencyLevel): string[] {
    const recommendations: string[] = [];

    // Add competency level specific recommendations
    recommendations.push(...competencyLevel.nextLevelRequirements);

    // Add skill-specific recommendations
    if (skillLevels.customerAnalysis < 0.7) {
      recommendations.push('Spend more time reviewing ICP analysis results for deeper insights');
    }

    if (skillLevels.financialModeling < 0.7) {
      recommendations.push('Experiment with different calculator variables to explore financial scenarios');
    }

    if (skillLevels.stakeholderEngagement < 0.7) {
      recommendations.push('Try different stakeholder perspectives in business case development');
    }

    if (skillLevels.valueCommunication < 0.7) {
      recommendations.push('Practice exporting business cases in multiple formats for different audiences');
    }

    if (skillLevels.executiveReadiness < 0.7) {
      recommendations.push('Focus on maintaining professional credibility in all interactions');
    }

    return recommendations;
  }

  private async storeAssessment(assessment: SkillAssessmentResult): Promise<void> {
    try {
      const { error } = await (this.supabase as any)
        .from('skill_assessments')
        .insert([{
          user_id: assessment.userId,
          skill_levels: assessment.skillLevels,
          competency_level: assessment.competencyLevel.level,
          competency_score: assessment.competencyLevel.score,
          strengths: assessment.strengths,
          improvement_areas: assessment.improvementAreas,
          recommendations: assessment.recommendations,
          assessment_date: new Date(assessment.assessmentDate).toISOString()
        }]);

      if (error) {
        console.error('Error storing skill assessment:', error);
      } else {
        console.log(`✅ Stored skill assessment for user ${assessment.userId}`);
      }
    } catch (error) {
      console.error('Error storing skill assessment:', error);
    }
  }

  public async getLatestAssessment(userId: string): Promise<SkillAssessmentResult | null> {
    try {
      const { data, error } = await this.supabase
        .from('skill_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('assessment_date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.warn('Could not fetch skill assessment:', error);
        return null;
      }

      return {
        userId: (data as any).user_id,
        skillLevels: (data as any).skill_levels,
        competencyLevel: this.competencyLevels[(data as any).competency_level],
        strengths: (data as any).strengths,
        improvementAreas: (data as any).improvement_areas,
        recommendations: (data as any).recommendations,
        assessmentDate: new Date((data as any).assessment_date).getTime()
      };
    } catch (error) {
      console.error('Error fetching skill assessment:', error);
      return null;
    }
  }

  public getCompetencyLevelDefinition(level: string): CompetencyLevel | null {
    return this.competencyLevels[level] || null;
  }

  public getAllCompetencyLevels(): Record<string, CompetencyLevel> {
    return this.competencyLevels;
  }

  public calculateProgressToNextLevel(currentLevel: CompetencyLevel, skillLevels: SkillLevels): {
    progress: number;
    nextLevel: CompetencyLevel | null;
    requirementsMet: number;
    totalRequirements: number;
  } {
    const levels = Object.values(this.competencyLevels);
    const currentIndex = levels.findIndex(level => level.level === currentLevel.level);
    const nextLevel = currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;

    if (!nextLevel) {
      return {
        progress: 100,
        nextLevel: null,
        requirementsMet: 0,
        totalRequirements: 0
      };
    }

    // Calculate progress based on skill levels
    const skillScores = [
      skillLevels.customerAnalysis,
      skillLevels.valueCommunication,
      skillLevels.executiveReadiness,
      skillLevels.financialModeling,
      skillLevels.businessCaseDevelopment,
      skillLevels.stakeholderEngagement,
      skillLevels.professionalCredibility
    ];

    const currentScore = skillScores.reduce((sum, score) => sum + score, 0) / skillScores.length;
    const progress = ((currentScore - currentLevel.score) / (nextLevel.score - currentLevel.score)) * 100;

    return {
      progress: Math.max(0, Math.min(100, progress)),
      nextLevel,
      requirementsMet: 0, // Would be calculated based on actual requirements
      totalRequirements: nextLevel.nextLevelRequirements.length
    };
  }
}

// Create and export singleton instance
const skillAssessmentEngine = new SkillAssessmentEngine();

export default skillAssessmentEngine;
