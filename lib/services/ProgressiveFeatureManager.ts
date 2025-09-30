/** Progressive Feature Manager - TypeScript Migration

 * Manages progressive feature unlocking based on professional competency development
 * Maintains professional credibility with competency-based feature access
 * Migrated from legacy platform with Next.js and Supabase integration
 */

import { supabase } from '../supabase/client';
import { supabaseAdmin } from '../supabase/admin';
import { SkillLevels, CompetencyLevel } from './SkillAssessmentEngine';

export interface FeatureAccess {
  features: string[];
  unlockedFeatures: string[];
  lockedFeatures: string[];
  nextUnlocks: string[];
  requirements: Record<string, string[]>;
}

export interface MilestoneNotification {
  title: string;
  description: string;
  feature: string;
  competencyLevel: string;
  timestamp: number;
}

export interface FeatureDefinition {
  id: string;
  name: string;
  description: string;
  category: 'foundation' | 'developing' | 'proficient' | 'advanced' | 'expert';
  requirements: {
    competencyLevel: string;
    skillRequirements: Partial<SkillLevels>;
    usageRequirements: string[];
  };
  benefits: string[];
  professionalValue: string;
}

export class ProgressiveFeatureManager {
  private supabase = supabase;
  private supabaseAdmin = supabaseAdmin;

  // Feature definitions organized by competency level
  private featureDefinitions: Record<string, FeatureDefinition[]> = {
    foundation: [
      {
        id: 'basic-icp-analysis',
        name: 'Basic ICP Analysis',
        description: 'Fundamental ideal customer profile analysis capabilities',
        category: 'foundation',
        requirements: {
          competencyLevel: 'foundation',
          skillRequirements: { customerAnalysis: 0.3 },
          usageRequirements: ['Complete first ICP analysis']
        },
        benefits: ['Customer segmentation', 'Basic market analysis'],
        professionalValue: 'Essential for understanding target market'
      },
      {
        id: 'standard-cost-calculator',
        name: 'Standard Cost Calculator',
        description: 'Basic cost calculation and ROI analysis',
        category: 'foundation',
        requirements: {
          competencyLevel: 'foundation',
          skillRequirements: { financialModeling: 0.3 },
          usageRequirements: ['Complete first cost calculation']
        },
        benefits: ['ROI calculations', 'Basic financial modeling'],
        professionalValue: 'Fundamental for financial decision making'
      },
      {
        id: 'simple-business-case',
        name: 'Simple Business Case Builder',
        description: 'Basic business case development tools',
        category: 'foundation',
        requirements: {
          competencyLevel: 'foundation',
          skillRequirements: { businessCaseDevelopment: 0.3 },
          usageRequirements: ['Complete first business case']
        },
        benefits: ['Basic business case templates', 'Simple stakeholder views'],
        professionalValue: 'Core skill for business development'
      }
    ],
    developing: [
      {
        id: 'advanced-icp-analysis',
        name: 'Advanced ICP Analysis',
        description: 'Enhanced ICP analysis with deeper insights',
        category: 'developing',
        requirements: {
          competencyLevel: 'developing',
          skillRequirements: { customerAnalysis: 0.6 },
          usageRequirements: ['Complete 3+ ICP analyses', 'Achieve 80%+ rating accuracy']
        },
        benefits: ['Advanced segmentation', 'Competitive analysis', 'Market positioning'],
        professionalValue: 'Enhanced market intelligence capabilities'
      },
      {
        id: 'enhanced-cost-calculator',
        name: 'Enhanced Cost Calculator',
        description: 'Advanced financial modeling and scenario analysis',
        category: 'developing',
        requirements: {
          competencyLevel: 'developing',
          skillRequirements: { financialModeling: 0.6 },
          usageRequirements: ['Complete 5+ calculations', 'Export financial charts']
        },
        benefits: ['Scenario modeling', 'Advanced ROI analysis', 'Risk assessment'],
        professionalValue: 'Sophisticated financial analysis capabilities'
      },
      {
        id: 'stakeholder-business-cases',
        name: 'Stakeholder-Specific Business Cases',
        description: 'Customized business cases for different stakeholder roles',
        category: 'developing',
        requirements: {
          competencyLevel: 'developing',
          skillRequirements: { stakeholderEngagement: 0.6 },
          usageRequirements: ['Use multiple stakeholder views', 'Export in multiple formats']
        },
        benefits: ['CEO/CFO/CTO views', 'Role-specific metrics', 'Customized presentations'],
        professionalValue: 'Professional stakeholder communication'
      }
    ],
    proficient: [
      {
        id: 'professional-dashboard',
        name: 'Professional Dashboard',
        description: 'Comprehensive professional development tracking',
        category: 'proficient',
        requirements: {
          competencyLevel: 'proficient',
          skillRequirements: { professionalCredibility: 0.8 },
          usageRequirements: ['Maintain 90%+ credibility score', 'Complete 10+ sessions']
        },
        benefits: ['Progress tracking', 'Competency visualization', 'Professional milestones'],
        professionalValue: 'Professional development monitoring and growth'
      },
      {
        id: 'advanced-export-options',
        name: 'Advanced Export Options',
        description: 'Enhanced export capabilities with CRM integration',
        category: 'proficient',
        requirements: {
          competencyLevel: 'proficient',
          skillRequirements: { valueCommunication: 0.8 },
          usageRequirements: ['Export to 3+ CRM systems', 'Achieve 95%+ export success']
        },
        benefits: ['Multi-CRM integration', 'Custom export formats', 'Automated workflows'],
        professionalValue: 'Seamless integration with professional tools'
      },
      {
        id: 'competency-tracking',
        name: 'Competency Tracking',
        description: 'Detailed skill development and progress monitoring',
        category: 'proficient',
        requirements: {
          competencyLevel: 'proficient',
          skillRequirements: { executiveReadiness: 0.8 },
          usageRequirements: ['Demonstrate consistent improvement', 'Achieve proficient level']
        },
        benefits: ['Skill assessments', 'Progress analytics', 'Development recommendations'],
        professionalValue: 'Continuous professional development'
      }
    ],
    advanced: [
      {
        id: 'executive-dashboard',
        name: 'Executive Dashboard',
        description: 'Executive-level insights and strategic overview',
        category: 'advanced',
        requirements: {
          competencyLevel: 'advanced',
          skillRequirements: { executiveReadiness: 0.9 },
          usageRequirements: ['Demonstrate executive-level usage', 'Maintain advanced competency']
        },
        benefits: ['Strategic insights', 'Executive reporting', 'High-level analytics'],
        professionalValue: 'Executive-level business intelligence'
      },
      {
        id: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'Sophisticated analytics and predictive insights',
        category: 'advanced',
        requirements: {
          competencyLevel: 'advanced',
          skillRequirements: { customerAnalysis: 0.9, financialModeling: 0.9 },
          usageRequirements: ['Achieve 95%+ accuracy across tools', 'Demonstrate advanced usage']
        },
        benefits: ['Predictive analytics', 'Advanced reporting', 'Strategic forecasting'],
        professionalValue: 'Advanced business intelligence capabilities'
      },
      {
        id: 'professional-development-tracking',
        name: 'Professional Development Tracking',
        description: 'Comprehensive professional growth monitoring',
        category: 'advanced',
        requirements: {
          competencyLevel: 'advanced',
          skillRequirements: { professionalCredibility: 0.95 },
          usageRequirements: ['Maintain expert-level credibility', 'Demonstrate leadership']
        },
        benefits: ['Development planning', 'Mentorship tools', 'Leadership tracking'],
        professionalValue: 'Professional leadership development'
      }
    ],
    expert: [
      {
        id: 'expert-dashboard',
        name: 'Expert Dashboard',
        description: 'Expert-level platform mastery and insights',
        category: 'expert',
        requirements: {
          competencyLevel: 'expert',
          skillRequirements: { overallCompetency: 0.95 },
          usageRequirements: ['Achieve expert level', 'Demonstrate mastery']
        },
        benefits: ['Expert insights', 'Mastery recognition', 'Advanced customization'],
        professionalValue: 'Expert-level business mastery'
      },
      {
        id: 'advanced-professional-tools',
        name: 'Advanced Professional Tools',
        description: 'Cutting-edge professional development tools',
        category: 'expert',
        requirements: {
          competencyLevel: 'expert',
          skillRequirements: { overallCompetency: 0.98 },
          usageRequirements: ['Maintain expert performance', 'Contribute to platform']
        },
        benefits: ['Beta features', 'Advanced customization', 'Expert tools'],
        professionalValue: 'Cutting-edge professional capabilities'
      },
      {
        id: 'mentorship-capabilities',
        name: 'Mentorship Capabilities',
        description: 'Tools for mentoring and developing others',
        category: 'expert',
        requirements: {
          competencyLevel: 'expert',
          skillRequirements: { professionalCredibility: 1.0 },
          usageRequirements: ['Demonstrate leadership', 'Help others develop']
        },
        benefits: ['Mentorship tools', 'Team development', 'Leadership features'],
        professionalValue: 'Professional leadership and mentorship'
      }
    ]
  };

  public determineFeatureAccess(competencyLevel: string, skillLevels: SkillLevels): FeatureAccess {
    const unlockedFeatures: string[] = [];
    const lockedFeatures: string[] = [];
    const nextUnlocks: string[] = [];
    const requirements: Record<string, string[]> = {};

    // Get features for current and lower competency levels
    const currentLevelIndex = this.getCompetencyLevelIndex(competencyLevel);
    
    for (let i = 0; i <= currentLevelIndex; i++) {
      const level = this.getCompetencyLevelByIndex(i);
      const features = this.featureDefinitions[level] || [];
      
      features.forEach(feature => {
        if (this.isFeatureUnlocked(feature, skillLevels)) {
          unlockedFeatures.push(feature.id);
        } else {
          lockedFeatures.push(feature.id);
          requirements[feature.id] = this.getFeatureRequirements(feature);
        }
      });
    }

    // Get next level features for preview
    if (currentLevelIndex < this.getMaxCompetencyLevelIndex()) {
      const nextLevel = this.getCompetencyLevelByIndex(currentLevelIndex + 1);
      const nextLevelFeatures = this.featureDefinitions[nextLevel] || [];
      nextUnlocks.push(...nextLevelFeatures.map(f => f.id));
    }

    return {
      features: [...unlockedFeatures, ...lockedFeatures],
      unlockedFeatures,
      lockedFeatures,
      nextUnlocks,
      requirements
    };
  }

  private isFeatureUnlocked(feature: FeatureDefinition, skillLevels: SkillLevels): boolean {
    // Check competency level requirement
    const userCompetencyIndex = this.getCompetencyLevelIndex(feature.requirements.competencyLevel);
    const currentCompetencyIndex = this.getCompetencyLevelIndex(this.getCurrentCompetencyLevel(skillLevels));
    
    if (currentCompetencyIndex < userCompetencyIndex) {
      return false;
    }

    // Check skill requirements
    for (const [skill, requiredLevel] of Object.entries(feature.requirements.skillRequirements)) {
      const currentLevel = skillLevels[skill as keyof SkillLevels] || 0;
      if (currentLevel < requiredLevel) {
        return false;
      }
    }

    return true;
  }

  private getFeatureRequirements(feature: FeatureDefinition): string[] {
    const requirements: string[] = [];
    
    requirements.push(`Reach ${feature.requirements.competencyLevel} competency level`);
    
    Object.entries(feature.requirements.skillRequirements).forEach(([skill, level]) => {
      const skillName = this.getSkillDisplayName(skill);
      requirements.push(`Develop ${skillName} to ${Math.round(level * 100)}%`);
    });
    
    requirements.push(...feature.requirements.usageRequirements);
    
    return requirements;
  }

  private getSkillDisplayName(skill: string): string {
    const skillNames: Record<string, string> = {
      customerAnalysis: 'Customer Analysis',
      valueCommunication: 'Value Communication',
      executiveReadiness: 'Executive Readiness',
      financialModeling: 'Financial Modeling',
      businessCaseDevelopment: 'Business Case Development',
      stakeholderEngagement: 'Stakeholder Engagement',
      professionalCredibility: 'Professional Credibility',
      overallCompetency: 'Overall Competency'
    };
    
    return skillNames[skill] || skill;
  }

  private getCurrentCompetencyLevel(skillLevels: SkillLevels): string {
    const overallScore = skillLevels.overallCompetency;
    
    if (overallScore >= 0.9) return 'expert';
    if (overallScore >= 0.8) return 'advanced';
    if (overallScore >= 0.6) return 'proficient';
    if (overallScore >= 0.4) return 'developing';
    return 'foundation';
  }

  private getCompetencyLevelIndex(level: string): number {
    const levels = ['foundation', 'developing', 'proficient', 'advanced', 'expert'];
    return levels.indexOf(level);
  }

  private getCompetencyLevelByIndex(index: number): string {
    const levels = ['foundation', 'developing', 'proficient', 'advanced', 'expert'];
    return levels[index] || 'foundation';
  }

  private getMaxCompetencyLevelIndex(): number {
    return 4; // expert level
  }

  public getMilestoneNotification(data: {
    feature: string;
    userId: string;
    competencyLevel: string;
    skillLevels: SkillLevels;
  }): MilestoneNotification | null {
    const featureDef = this.getFeatureDefinition(data.feature);
    if (!featureDef) return null;

    return {
      title: `Professional Milestone: ${featureDef.name} Unlocked`,
      description: `You've unlocked ${featureDef.name} - ${featureDef.description}`,
      feature: data.feature,
      competencyLevel: data.competencyLevel,
      timestamp: Date.now()
    };
  }

  private getFeatureDefinition(featureId: string): FeatureDefinition | null {
    for (const features of Object.values(this.featureDefinitions)) {
      const feature = features.find(f => f.id === featureId);
      if (feature) return feature;
    }
    return null;
  }

  public getAllFeatures(): FeatureDefinition[] {
    return Object.values(this.featureDefinitions).flat();
  }

  public getFeaturesByCategory(category: string): FeatureDefinition[] {
    return this.featureDefinitions[category] || [];
  }

  public getFeature(featureId: string): FeatureDefinition | null {
    return this.getFeatureDefinition(featureId);
  }

  public hasFeatureAccess(userId: string, featureId: string, skillLevels: SkillLevels): boolean {
    const feature = this.getFeature(featureId);
    if (!feature) return false;

    return this.isFeatureUnlocked(feature, skillLevels);
  }

  public async getUserFeatureAccess(userId: string, skillLevels: SkillLevels): Promise<{
    access: FeatureAccess;
    unlockedCount: number;
    totalCount: number;
    nextLevelProgress: number;
  }> {
    const competencyLevel = this.getCurrentCompetencyLevel(skillLevels);
    const access = this.determineFeatureAccess(competencyLevel, skillLevels);
    
    const unlockedCount = access.unlockedFeatures.length;
    const totalCount = access.features.length;
    const nextLevelProgress = this.calculateNextLevelProgress(competencyLevel, skillLevels);

    return {
      access,
      unlockedCount,
      totalCount,
      nextLevelProgress
    };
  }

  private calculateNextLevelProgress(currentLevel: string, skillLevels: SkillLevels): number {
    const currentIndex = this.getCompetencyLevelIndex(currentLevel);
    if (currentIndex >= this.getMaxCompetencyLevelIndex()) return 100;

    const nextLevel = this.getCompetencyLevelByIndex(currentIndex + 1);
    const currentScore = skillLevels.overallCompetency;
    
    // Calculate progress based on score thresholds
    const levelThresholds = [0.2, 0.4, 0.6, 0.8, 1.0];
    const currentThreshold = levelThresholds[currentIndex];
    const nextThreshold = levelThresholds[currentIndex + 1];
    
    const progress = ((currentScore - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    return Math.max(0, Math.min(100, progress));
  }

  public async storeFeatureUnlock(userId: string, featureId: string, competencyLevel: string): Promise<void> {
    try {
      const { error } = await (this.supabase as any)
        .from('feature_unlocks')
        .insert([{
          user_id: userId,
          feature_id: featureId,
          competency_level: competencyLevel,
          unlocked_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error storing feature unlock:', error);
      } else {
        console.log(`✅ Stored feature unlock: ${featureId} for user ${userId}`);
      }
    } catch (error) {
      console.error('Error storing feature unlock:', error);
    }
  }

  public async getFeatureUnlockHistory(userId: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('feature_unlocks')
        .select('*')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error fetching feature unlock history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching feature unlock history:', error);
      return [];
    }
  }

  public async getFeatureUsageStats(featureId: string): Promise<{
    totalUnlocks: number;
    recentUnlocks: number;
    competencyDistribution: Record<string, number>;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('feature_unlocks')
        .select('*')
        .eq('feature_id', featureId);

      if (error) {
        console.error('Error fetching feature usage stats:', error);
        return {
          totalUnlocks: 0,
          recentUnlocks: 0,
          competencyDistribution: {}
        };
      }

      const unlocks = data || [];
      const totalUnlocks = unlocks.length;
      
      // Recent unlocks (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentUnlocks = unlocks.filter((unlock: any) => 
        new Date(unlock.unlocked_at) > thirtyDaysAgo
      ).length;

      // Competency distribution
      const competencyDistribution: Record<string, number> = {};
      unlocks.forEach((unlock: any) => {
        const level = unlock.competency_level;
        competencyDistribution[level] = (competencyDistribution[level] || 0) + 1;
      });

      return {
        totalUnlocks,
        recentUnlocks,
        competencyDistribution
      };
    } catch (error) {
      console.error('Error fetching feature usage stats:', error);
      return {
        totalUnlocks: 0,
        recentUnlocks: 0,
        competencyDistribution: {}
      };
    }
  }
}

// Create and export singleton instance
const progressiveFeatureManager = new ProgressiveFeatureManager();

export default progressiveFeatureManager;
