/**
 * Assessment → Dashboard Capability Mapping Service
 *
 * This service maps assessment baseline scores to dashboard capability tracking.
 * It creates the bridge between assessment completion and ongoing capability development.
 *
 * Mapping Strategy:
 * - Assessment buyerScore → Dashboard "Customer Intelligence" baseline
 * - Assessment techScore → Dashboard "Value Communication" baseline
 * - Sales Process & Market Intelligence initialized at 50% (to be built through platform usage)
 */

import type { AssessmentBaselines } from '../hooks/useAssessmentBaselines';

export interface DashboardCapability {
  name: string;
  score: number;
  previousScore: number;
  baselineScore: number; // From assessment
  incrementalGain: number; // From platform usage
  monthOverMonthChange: number;
  trend: 'up' | 'down' | 'flat';
  color: string;
  behaviors: {
    name: string;
    value: string;
    status?: 'good' | 'warning' | 'needs-improvement';
  }[];
}

export class AssessmentMappingService {
  /**
   * Maps assessment baselines to dashboard capabilities
   * Returns initial capability scores with assessment as baseline
   */
  static mapToCapabilities(baselines: AssessmentBaselines | null): DashboardCapability[] {
    if (!baselines) {
      // Return default capabilities if no assessment data
      return this.getDefaultCapabilities();
    }

    const { baselineMetrics } = baselines;

    return [
      {
        name: 'Customer Intelligence',
        score: baselineMetrics.customerUnderstanding,
        previousScore: 0, // No previous score on first assessment
        baselineScore: baselineMetrics.customerUnderstanding,
        incrementalGain: 0, // Will increase through platform usage
        monthOverMonthChange: 0,
        trend: 'flat',
        color: 'from-blue-500 to-blue-600',
        behaviors: this.getCustomerIntelligenceBehaviors(baselineMetrics.customerUnderstanding)
      },
      {
        name: 'Value Communication',
        score: baselineMetrics.technicalTranslation,
        previousScore: 0,
        baselineScore: baselineMetrics.technicalTranslation,
        incrementalGain: 0,
        monthOverMonthChange: 0,
        trend: 'flat',
        color: 'from-purple-500 to-purple-600',
        behaviors: this.getValueCommunicationBehaviors(baselineMetrics.technicalTranslation)
      },
      {
        name: 'Sales Process',
        score: 25, // Initialize at 25% - to be built through platform
        previousScore: 0,
        baselineScore: 25,
        incrementalGain: 0,
        monthOverMonthChange: 0,
        trend: 'flat',
        color: 'from-green-500 to-green-600',
        behaviors: [
          { name: 'Playbook Completeness', value: 'Not started', status: 'needs-improvement' },
          { name: 'Process Systematization', value: 'To be developed', status: 'needs-improvement' }
        ]
      },
      {
        name: 'Market Intelligence',
        score: 25, // Initialize at 25% - to be built through platform
        previousScore: 0,
        baselineScore: 25,
        incrementalGain: 0,
        monthOverMonthChange: 0,
        trend: 'flat',
        color: 'from-orange-500 to-orange-600',
        behaviors: [
          { name: 'Competitive Analysis', value: 'Not started', status: 'needs-improvement' },
          { name: 'Win/Loss Tracking', value: 'To be developed', status: 'needs-improvement' }
        ]
      }
    ];
  }

  /**
   * Gets default capabilities when no assessment data exists
   */
  private static getDefaultCapabilities(): DashboardCapability[] {
    return [
      {
        name: 'Customer Intelligence',
        score: 0,
        previousScore: 0,
        baselineScore: 0,
        incrementalGain: 0,
        monthOverMonthChange: 0,
        trend: 'flat',
        color: 'from-blue-500 to-blue-600',
        behaviors: [
          { name: 'Assessment', value: 'Not completed', status: 'needs-improvement' },
          { name: 'Baseline Score', value: 'Complete assessment to establish baseline', status: 'needs-improvement' }
        ]
      },
      {
        name: 'Value Communication',
        score: 0,
        previousScore: 0,
        baselineScore: 0,
        incrementalGain: 0,
        monthOverMonthChange: 0,
        trend: 'flat',
        color: 'from-purple-500 to-purple-600',
        behaviors: [
          { name: 'Assessment', value: 'Not completed', status: 'needs-improvement' },
          { name: 'Baseline Score', value: 'Complete assessment to establish baseline', status: 'needs-improvement' }
        ]
      },
      {
        name: 'Sales Process',
        score: 0,
        previousScore: 0,
        baselineScore: 0,
        incrementalGain: 0,
        monthOverMonthChange: 0,
        trend: 'flat',
        color: 'from-green-500 to-green-600',
        behaviors: [
          { name: 'Assessment', value: 'Not completed', status: 'needs-improvement' }
        ]
      },
      {
        name: 'Market Intelligence',
        score: 0,
        previousScore: 0,
        baselineScore: 0,
        incrementalGain: 0,
        monthOverMonthChange: 0,
        trend: 'flat',
        color: 'from-orange-500 to-orange-600',
        behaviors: [
          { name: 'Assessment', value: 'Not completed', status: 'needs-improvement' }
        ]
      }
    ];
  }

  /**
   * Determines Customer Intelligence behaviors based on baseline score
   */
  private static getCustomerIntelligenceBehaviors(score: number) {
    if (score >= 70) {
      return [
        { name: 'ICP Definition', value: '85%+', status: 'good' as const },
        { name: 'Buyer Personas', value: 'Strong foundation', status: 'good' as const },
        { name: 'Discovery Framework', value: 'Established', status: 'good' as const }
      ];
    } else if (score >= 60) {
      return [
        { name: 'ICP Definition', value: '60-70%', status: 'warning' as const },
        { name: 'Buyer Personas', value: 'Good foundation', status: 'warning' as const },
        { name: 'Discovery Framework', value: 'In progress', status: 'warning' as const }
      ];
    } else {
      return [
        { name: 'ICP Definition', value: 'Below 60%', status: 'needs-improvement' as const },
        { name: 'Buyer Personas', value: 'Needs development', status: 'needs-improvement' as const },
        { name: 'Discovery Framework', value: 'Not started', status: 'needs-improvement' as const }
      ];
    }
  }

  /**
   * Determines Value Communication behaviors based on baseline score
   */
  private static getValueCommunicationBehaviors(score: number) {
    if (score >= 70) {
      return [
        { name: 'Technical Translation', value: 'Excellent', status: 'good' as const },
        { name: 'Business Case Building', value: 'Strong capability', status: 'good' as const },
        { name: 'ROI Articulation', value: 'Well-developed', status: 'good' as const }
      ];
    } else if (score >= 60) {
      return [
        { name: 'Technical Translation', value: 'Good', status: 'warning' as const },
        { name: 'Business Case Building', value: 'Developing', status: 'warning' as const },
        { name: 'ROI Articulation', value: 'In progress', status: 'warning' as const }
      ];
    } else {
      return [
        { name: 'Technical Translation', value: 'Needs work', status: 'needs-improvement' as const },
        { name: 'Business Case Building', value: 'Not started', status: 'needs-improvement' as const },
        { name: 'ROI Articulation', value: 'Undeveloped', status: 'needs-improvement' as const }
      ];
    }
  }

  /**
   * Calculate overall revenue execution capability score
   * Weighted average of all four capabilities
   */
  static calculateOverallScore(capabilities: DashboardCapability[]): number {
    const weights = {
      'Customer Intelligence': 0.35,
      'Value Communication': 0.30,
      'Sales Process': 0.20,
      'Market Intelligence': 0.15
    };

    let totalScore = 0;
    let totalWeight = 0;

    capabilities.forEach(cap => {
      const weight = weights[cap.name as keyof typeof weights] || 0;
      totalScore += cap.score * weight;
      totalWeight += weight;
    });

    return Math.round(totalScore / totalWeight);
  }

  /**
   * Get capability gaps (difference from benchmark)
   */
  static getCapabilityGaps(capabilities: DashboardCapability[]) {
    // Series A benchmarks
    const benchmarks = {
      'Customer Intelligence': 75,
      'Value Communication': 65,
      'Sales Process': 70,
      'Market Intelligence': 72
    };

    return capabilities.map(cap => {
      const benchmark = benchmarks[cap.name as keyof typeof benchmarks] || 70;
      const gap = Math.max(benchmark - cap.score, 0);

      return {
        capability: cap.name,
        yourScore: cap.score,
        benchmark,
        gap,
        status: gap === 0 ? 'good' : gap <= 10 ? 'warning' : 'critical'
      };
    });
  }
}
