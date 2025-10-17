/** SalesAutomationService - TypeScript Migration
 *
 * Sales automation integration for Outreach, SalesLoft, and Apollo platforms
 * Generates sequences, cadences, and prospect lists using ICP and business case intelligence
 * Migrated from legacy platform with enhanced TypeScript type safety and Supabase integration
 */

import { supabase } from '@/app/lib/supabase/client';

// ==========================================
// DATA INPUT INTERFACES
// ==========================================

export interface ICPData {
  personaTypes?: PersonaType[];
  painPoints?: string[];
  decisionMakingProcess?: string;
  competencyGaps?: string[];
  valuePropositionAlignment?: string;
  companyRating?: number;
  industry?: string;
  companySize?: string;
  revenue?: string;
  targetAccounts?: string[];
}

export interface BusinessCaseData {
  framework?: {
    executiveSummary?: string;
    financialJustification?: string;
    valueProposition?: string;
    successMetrics?: string[];
  };
  roi?: number;
  paybackPeriod?: number;
  implementationTimeline?: string;
  stakeholders?: string[];
}

export interface PersonaType {
  name: string;
  id: string;
  description?: string;
  painPoints?: string[];
  goals?: string[];
  communicationStyle?: string;
  preferredChannels?: ('email' | 'linkedin' | 'phone' | 'sms')[];
}

// ==========================================
// OUTREACH SEQUENCE INTERFACES
// ==========================================

export interface SequenceStep {
  stepNumber: number;
  type: 'email' | 'linkedin' | 'call' | 'task';
  delay: number; // days from previous step
  subject?: string;
  template?: string;
  notes?: string;
  personalizationVariables?: string[];
}

export interface OutreachSequence {
  sequenceId?: string;
  name: string;
  description: string;
  steps: SequenceStep[];
  targetingCriteria: {
    icpFitScore?: { min: number; max: number };
    personaType?: string;
    industry?: string;
    companySize?: string;
  };
  personalizationVariables: string[];
  estimatedDuration: number; // total days
  metadata?: {
    created: string;
    lastModified: string;
    version: string;
  };
}

// ==========================================
// SALESLOFT CADENCE INTERFACES
// ==========================================

export interface CadenceTouch {
  day: number;
  touchNumber: number;
  type: 'email' | 'linkedin' | 'phone' | 'sms';
  priority: 'high' | 'medium' | 'low';
  template?: string;
  objective: string;
  duration?: number; // minutes for calls
  fallbackAction?: string;
}

export interface SalesLoftCadence {
  cadenceId?: string;
  name: string;
  description: string;
  totalDuration: number; // days
  totalTouches: number;
  touches: CadenceTouch[];
  targetAudience: string;
  personaType?: string;
  successCriteria?: string[];
  metadata?: {
    created: string;
    lastModified: string;
    version: string;
  };
}

// ==========================================
// APOLLO LIST INTERFACES
// ==========================================

export interface CompanyFilters {
  industry?: string[];
  revenue?: { min: number; max: number };
  employees?: { min: number; max: number };
  technologies?: string[];
  location?: string[];
  fundingStage?: string[];
}

export interface ContactFilters {
  titles?: string[];
  departments?: string[];
  seniority?: string[];
  functions?: string[];
}

export interface ApolloList {
  listId?: string;
  name: string;
  description: string;
  companyFilters: CompanyFilters;
  contactFilters: ContactFilters;
  intentSignals?: string[];
  estimatedCount?: number;
  targetIcpScore?: { min: number; max: number };
  metadata?: {
    created: string;
    lastModified: string;
    version: string;
  };
}

// ==========================================
// SERVICE RESPONSE INTERFACES
// ==========================================

export interface SalesAutomationResult {
  success: boolean;
  data?: {
    outreachSequences?: OutreachSequence[];
    salesLoftCadences?: SalesLoftCadence[];
    apolloLists?: ApolloList[];
  };
  error?: string;
  metadata?: {
    platform: 'outreach' | 'salesloft' | 'apollo';
    recordCount: number;
    timestamp: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// ==========================================
// SALES AUTOMATION SERVICE CLASS
// ==========================================

export class SalesAutomationService {
  private supabase = supabase;

  // ==========================================
  // OUTREACH SEQUENCE GENERATION
  // ==========================================

  public generateOutreachSequences(
    icpData: ICPData,
    businessCaseData?: BusinessCaseData
  ): SalesAutomationResult {
    try {
      // Validate input
      const validation = this.validateICPData(icpData);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`
        };
      }

      // Safe data extraction with fallbacks
      const painPoints = Array.isArray(icpData?.painPoints)
        ? icpData.painPoints.join(', ')
        : icpData?.painPoints || 'key business challenges';

      const valueProposition = businessCaseData?.framework?.valueProposition
        || 'our solution provides significant business value';

      // Generate three sequence types
      const sequences: OutreachSequence[] = [
        this.generateProspectingSequence(icpData, businessCaseData),
        this.generateNurturingSequence(icpData, businessCaseData),
        this.generateReengagementSequence(icpData, businessCaseData)
      ];

      return {
        success: true,
        data: { outreachSequences: sequences },
        metadata: {
          platform: 'outreach',
          recordCount: sequences.length,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Error generating Outreach sequences:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public generateProspectingSequence(
    icpData: ICPData,
    businessCaseData?: BusinessCaseData
  ): OutreachSequence {
    const painPoints = Array.isArray(icpData?.painPoints)
      ? icpData.painPoints.join(', ')
      : icpData?.painPoints || 'operational challenges';

    const valueProposition = businessCaseData?.framework?.valueProposition
      || 'measurable business outcomes';

    return {
      sequenceId: `outreach-prospecting-${Date.now()}`,
      name: 'H&S ICP-Qualified Prospecting',
      description: 'Multi-touch sequence for high-fit prospects (ICP score 7.0-10.0)',
      steps: [
        {
          stepNumber: 1,
          type: 'email',
          delay: 0,
          subject: 'Quick question about [[COMPANY_CHALLENGE]]',
          template: `Hi [[FIRST_NAME]],

I noticed [[COMPANY_NAME]] is in the [[INDUSTRY]] space. Based on what I've seen, companies like yours often face challenges around: ${painPoints}.

I'm curious - is this something you're experiencing?

We've helped similar companies achieve ${valueProposition}, and I thought it might be relevant for [[COMPANY_NAME]].

Worth a quick 15-minute conversation?

Best,
[[YOUR_NAME]]`,
          notes: 'Personalized opener referencing specific pain points',
          personalizationVariables: ['[[FIRST_NAME]]', '[[COMPANY_NAME]]', '[[INDUSTRY]]', '[[COMPANY_CHALLENGE]]', '[[YOUR_NAME]]']
        },
        {
          stepNumber: 2,
          type: 'linkedin',
          delay: 3,
          template: `Sent you an email about ${painPoints} - thought it might be relevant for [[COMPANY_NAME]].

If timing isn't right now, would love to stay connected for future reference.`,
          notes: 'LinkedIn connection request with context',
          personalizationVariables: ['[[COMPANY_NAME]]']
        },
        {
          stepNumber: 3,
          type: 'email',
          delay: 5,
          subject: 'Re: [[COMPANY_NAME]] - [[SPECIFIC_OUTCOME]]',
          template: `[[FIRST_NAME]],

Following up on my note from last week. I wanted to share a quick example:

We recently helped [[SIMILAR_COMPANY]] in [[INDUSTRY]] achieve [[SPECIFIC_OUTCOME]] by addressing ${painPoints}.

The approach was straightforward: [[BRIEF_APPROACH]].

If you're dealing with similar challenges, I'd be happy to share what worked for them.

Free this week for a brief call?

[[YOUR_NAME]]`,
          notes: 'Value-focused follow-up with social proof',
          personalizationVariables: ['[[FIRST_NAME]]', '[[COMPANY_NAME]]', '[[SIMILAR_COMPANY]]', '[[INDUSTRY]]', '[[SPECIFIC_OUTCOME]]', '[[BRIEF_APPROACH]]', '[[YOUR_NAME]]']
        },
        {
          stepNumber: 4,
          type: 'email',
          delay: 8,
          subject: 'Last note - [[COMPANY_NAME]]',
          template: `[[FIRST_NAME]],

I know you're busy, so I'll keep this brief.

If ${painPoints} aren't priorities right now, completely understand. But if they are, I think we could provide significant value to [[COMPANY_NAME]].

Either way, let me know - I'll stop reaching out if it's not a fit.

Thanks for considering,
[[YOUR_NAME]]`,
          notes: 'Respectful breakup email',
          personalizationVariables: ['[[FIRST_NAME]]', '[[COMPANY_NAME]]', '[[YOUR_NAME]]']
        }
      ],
      targetingCriteria: {
        icpFitScore: { min: 7.0, max: 10.0 },
        personaType: icpData?.personaTypes?.[0]?.id || 'decision_maker',
        industry: icpData?.industry || 'technology',
        companySize: icpData?.companySize || 'medium'
      },
      personalizationVariables: [
        '[[FIRST_NAME]]', '[[COMPANY_NAME]]', '[[INDUSTRY]]', '[[COMPANY_CHALLENGE]]',
        '[[SIMILAR_COMPANY]]', '[[SPECIFIC_OUTCOME]]', '[[BRIEF_APPROACH]]', '[[YOUR_NAME]]'
      ],
      estimatedDuration: 12,
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0'
      }
    };
  }

  public generateNurturingSequence(
    icpData: ICPData,
    businessCaseData?: BusinessCaseData
  ): OutreachSequence {
    const painPoints = Array.isArray(icpData?.painPoints)
      ? icpData.painPoints.join(', ')
      : icpData?.painPoints || 'business challenges';

    return {
      sequenceId: `outreach-nurturing-${Date.now()}`,
      name: 'H&S Prospect Nurturing',
      description: 'Educational nurture sequence for medium-fit prospects (ICP score 5.0-6.9)',
      steps: [
        {
          stepNumber: 1,
          type: 'email',
          delay: 0,
          subject: 'Thought this might be relevant for [[COMPANY_NAME]]',
          template: `Hi [[FIRST_NAME]],

I came across [[COMPANY_NAME]] and thought you might find this relevant:

We recently published a guide on addressing ${painPoints} for companies in [[INDUSTRY]].

Key insights include:
- [[KEY_INSIGHT_1]]
- [[KEY_INSIGHT_2]]
- [[KEY_INSIGHT_3]]

Would you like me to send it over?

Best,
[[YOUR_NAME]]`,
          notes: 'Value-first educational approach',
          personalizationVariables: ['[[FIRST_NAME]]', '[[COMPANY_NAME]]', '[[INDUSTRY]]', '[[KEY_INSIGHT_1]]', '[[KEY_INSIGHT_2]]', '[[KEY_INSIGHT_3]]', '[[YOUR_NAME]]']
        },
        {
          stepNumber: 2,
          type: 'email',
          delay: 7,
          subject: 'Quick resource for [[COMPANY_NAME]]',
          template: `[[FIRST_NAME]],

Following up with that resource I mentioned. No strings attached - just thought it might be helpful as you navigate ${painPoints}.

[RESOURCE_LINK]

Let me know if you find it useful.

[[YOUR_NAME]]`,
          notes: 'Deliver promised value',
          personalizationVariables: ['[[FIRST_NAME]]', '[[COMPANY_NAME]]', '[[RESOURCE_LINK]]', '[[YOUR_NAME]]']
        },
        {
          stepNumber: 3,
          type: 'linkedin',
          delay: 14,
          template: `Shared some resources on ${painPoints} - hope they were helpful for [[COMPANY_NAME]].

Happy to discuss further if you'd find it valuable.`,
          notes: 'LinkedIn touchpoint for continued engagement',
          personalizationVariables: ['[[COMPANY_NAME]]']
        },
        {
          stepNumber: 4,
          type: 'email',
          delay: 21,
          subject: 'Checking in - [[COMPANY_NAME]]',
          template: `[[FIRST_NAME]],

Wanted to check if those resources were helpful.

If you're seeing similar challenges at [[COMPANY_NAME]], I'd be happy to share how other companies have addressed them.

No pressure - just here if helpful.

[[YOUR_NAME]]`,
          notes: 'Low-pressure check-in',
          personalizationVariables: ['[[FIRST_NAME]]', '[[COMPANY_NAME]]', '[[YOUR_NAME]]']
        }
      ],
      targetingCriteria: {
        icpFitScore: { min: 5.0, max: 6.9 },
        industry: icpData?.industry || 'technology'
      },
      personalizationVariables: [
        '[[FIRST_NAME]]', '[[COMPANY_NAME]]', '[[INDUSTRY]]', '[[KEY_INSIGHT_1]]',
        '[[KEY_INSIGHT_2]]', '[[KEY_INSIGHT_3]]', '[[RESOURCE_LINK]]', '[[YOUR_NAME]]'
      ],
      estimatedDuration: 24,
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0'
      }
    };
  }

  public generateReengagementSequence(
    icpData: ICPData,
    businessCaseData?: BusinessCaseData
  ): OutreachSequence {
    return {
      sequenceId: `outreach-reengagement-${Date.now()}`,
      name: 'H&S Re-engagement',
      description: 'Re-activate dormant prospects who previously showed interest',
      steps: [
        {
          stepNumber: 1,
          type: 'email',
          delay: 0,
          subject: "It's been a while - [[COMPANY_NAME]] update?",
          template: `Hi [[FIRST_NAME]],

It's been a while since we last connected about [[PREVIOUS_TOPIC]].

I'm curious - has anything changed at [[COMPANY_NAME]] that makes this more relevant now?

We've made some significant updates:
- [[NEW_FEATURE_1]]
- [[NEW_FEATURE_2]]

Worth reconnecting for 15 minutes?

[[YOUR_NAME]]`,
          notes: "Acknowledge time gap, highlight what's new",
          personalizationVariables: ['[[FIRST_NAME]]', '[[COMPANY_NAME]]', '[[PREVIOUS_TOPIC]]', '[[NEW_FEATURE_1]]', '[[NEW_FEATURE_2]]', '[[YOUR_NAME]]']
        },
        {
          stepNumber: 2,
          type: 'email',
          delay: 5,
          subject: 'New approach to [[PAIN_POINT]]',
          template: `[[FIRST_NAME]],

Quick follow-up - wanted to share something that might be relevant:

We've developed a new approach to [[PAIN_POINT]] that's showing strong results. [[SIMILAR_COMPANY]] just achieved [[SPECIFIC_RESULT]].

If this is still a priority at [[COMPANY_NAME]], happy to walk you through it.

[[YOUR_NAME]]`,
          notes: 'Lead with new value/results',
          personalizationVariables: ['[[FIRST_NAME]]', '[[PAIN_POINT]]', '[[SIMILAR_COMPANY]]', '[[SPECIFIC_RESULT]]', '[[COMPANY_NAME]]', '[[YOUR_NAME]]']
        },
        {
          stepNumber: 3,
          type: 'linkedin',
          delay: 10,
          template: `Reaching back out about [[PAIN_POINT]] solutions. Some exciting new developments I thought might interest [[COMPANY_NAME]].

Open to a quick catch-up if timing's better now.`,
          notes: 'Multi-channel touchpoint',
          personalizationVariables: ['[[PAIN_POINT]]', '[[COMPANY_NAME]]']
        }
      ],
      targetingCriteria: {
        icpFitScore: { min: 6.0, max: 10.0 }
      },
      personalizationVariables: [
        '[[FIRST_NAME]]', '[[COMPANY_NAME]]', '[[PREVIOUS_TOPIC]]', '[[NEW_FEATURE_1]]',
        '[[NEW_FEATURE_2]]', '[[PAIN_POINT]]', '[[SIMILAR_COMPANY]]', '[[SPECIFIC_RESULT]]', '[[YOUR_NAME]]'
      ],
      estimatedDuration: 12,
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0'
      }
    };
  }

  // ==========================================
  // SALESLOFT CADENCE GENERATION
  // ==========================================

  public generateSalesLoftCadences(
    icpData: ICPData,
    personaType?: string
  ): SalesAutomationResult {
    try {
      // Validate input
      const validation = this.validateICPData(icpData);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`
        };
      }

      // Generate three cadence types
      const cadences: SalesLoftCadence[] = [
        this.generateExecutiveCadence(icpData),
        this.generateManagerCadence(icpData),
        this.generateTechnicalCadence(icpData)
      ];

      return {
        success: true,
        data: { salesLoftCadences: cadences },
        metadata: {
          platform: 'salesloft',
          recordCount: cadences.length,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Error generating SalesLoft cadences:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public generateExecutiveCadence(icpData: ICPData): SalesLoftCadence {
    const painPoints = Array.isArray(icpData?.painPoints)
      ? icpData.painPoints[0]
      : icpData?.painPoints || 'strategic challenges';

    return {
      cadenceId: `salesloft-executive-${Date.now()}`,
      name: 'H&S Executive Engagement',
      description: 'C-level executive cadence - low frequency, high value touches',
      totalDuration: 21,
      totalTouches: 5,
      touches: [
        {
          day: 1,
          touchNumber: 1,
          type: 'email',
          priority: 'high',
          template: 'Executive value proposition email',
          objective: 'Establish relevance with quantified business impact',
          duration: 0
        },
        {
          day: 7,
          touchNumber: 2,
          type: 'linkedin',
          priority: 'medium',
          template: 'LinkedIn connection with executive summary',
          objective: 'Multi-channel presence',
          duration: 0
        },
        {
          day: 10,
          touchNumber: 3,
          type: 'phone',
          priority: 'high',
          template: 'Executive voicemail script',
          objective: 'Personal outreach with specific value proposition',
          duration: 2,
          fallbackAction: 'Leave concise voicemail with callback number'
        },
        {
          day: 14,
          touchNumber: 4,
          type: 'email',
          priority: 'high',
          template: 'Social proof email with case study',
          objective: 'Build credibility with peer examples',
          duration: 0
        },
        {
          day: 21,
          touchNumber: 5,
          type: 'email',
          priority: 'medium',
          template: 'Final value summary with clear CTA',
          objective: 'Respectful close or conversion',
          duration: 0
        }
      ],
      targetAudience: 'C-level executives (CEO, CFO, COO)',
      personaType: 'economic_buyer',
      successCriteria: [
        'Meeting scheduled within 21 days',
        'Positive response to any touch',
        'Connection accepted on LinkedIn',
        'Referral to relevant team member'
      ],
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0'
      }
    };
  }

  public generateManagerCadence(icpData: ICPData): SalesLoftCadence {
    return {
      cadenceId: `salesloft-manager-${Date.now()}`,
      name: 'H&S Manager Engagement',
      description: 'Mid-level manager cadence - balanced frequency and value',
      totalDuration: 14,
      totalTouches: 7,
      touches: [
        {
          day: 1,
          touchNumber: 1,
          type: 'email',
          priority: 'high',
          template: 'Manager pain point email',
          objective: 'Identify specific operational challenges',
          duration: 0
        },
        {
          day: 3,
          touchNumber: 2,
          type: 'linkedin',
          priority: 'medium',
          template: 'LinkedIn connection request',
          objective: 'Build professional network',
          duration: 0
        },
        {
          day: 5,
          touchNumber: 3,
          type: 'email',
          priority: 'high',
          template: 'Educational content email',
          objective: 'Provide value without asking for anything',
          duration: 0
        },
        {
          day: 7,
          touchNumber: 4,
          type: 'phone',
          priority: 'high',
          template: 'Manager discovery call script',
          objective: 'Understand team challenges and priorities',
          duration: 15,
          fallbackAction: 'Send follow-up email with time options'
        },
        {
          day: 9,
          touchNumber: 5,
          type: 'email',
          priority: 'medium',
          template: 'Team impact email',
          objective: 'Show how solution helps their team succeed',
          duration: 0
        },
        {
          day: 12,
          touchNumber: 6,
          type: 'linkedin',
          priority: 'low',
          template: 'LinkedIn message with resource',
          objective: 'Stay top of mind with helpful content',
          duration: 0
        },
        {
          day: 14,
          touchNumber: 7,
          type: 'email',
          priority: 'medium',
          template: 'Next steps or pause email',
          objective: 'Clear path forward or graceful pause',
          duration: 0
        }
      ],
      targetAudience: 'Mid-level managers (Directors, VPs)',
      personaType: 'business_dm',
      successCriteria: [
        'Discovery call completed',
        'Resource downloads or engagement',
        'Introduction to executive sponsor',
        'Demo scheduled'
      ],
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0'
      }
    };
  }

  public generateTechnicalCadence(icpData: ICPData): SalesLoftCadence {
    return {
      cadenceId: `salesloft-technical-${Date.now()}`,
      name: 'H&S Technical Evaluator Engagement',
      description: 'Technical evaluator cadence - detailed, technical focus',
      totalDuration: 14,
      totalTouches: 6,
      touches: [
        {
          day: 1,
          touchNumber: 1,
          type: 'email',
          priority: 'high',
          template: 'Technical overview email',
          objective: 'Address technical requirements and architecture',
          duration: 0
        },
        {
          day: 3,
          touchNumber: 2,
          type: 'email',
          priority: 'high',
          template: 'Integration and compatibility email',
          objective: 'Explain integration capabilities',
          duration: 0
        },
        {
          day: 5,
          touchNumber: 3,
          type: 'phone',
          priority: 'high',
          template: 'Technical deep-dive call script',
          objective: 'Answer technical questions and discuss architecture',
          duration: 30,
          fallbackAction: 'Offer to send technical documentation'
        },
        {
          day: 7,
          touchNumber: 4,
          type: 'email',
          priority: 'high',
          template: 'Technical documentation package',
          objective: 'Provide comprehensive technical resources',
          duration: 0
        },
        {
          day: 10,
          touchNumber: 5,
          type: 'linkedin',
          priority: 'medium',
          template: 'LinkedIn with technical case study',
          objective: 'Share technical implementation success story',
          duration: 0
        },
        {
          day: 14,
          touchNumber: 6,
          type: 'email',
          priority: 'high',
          template: 'POC or trial proposal email',
          objective: 'Move to hands-on evaluation',
          duration: 0
        }
      ],
      targetAudience: 'Technical evaluators (Engineers, Architects, IT Directors)',
      personaType: 'technical_evaluator',
      successCriteria: [
        'Technical deep-dive call completed',
        'Documentation reviewed',
        'POC or trial initiated',
        'Technical objections addressed'
      ],
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0'
      }
    };
  }

  // ==========================================
  // APOLLO LIST GENERATION
  // ==========================================

  public generateApolloLists(
    icpData: ICPData,
    filters?: Partial<CompanyFilters & ContactFilters>
  ): SalesAutomationResult {
    try {
      // Validate input
      const validation = this.validateICPData(icpData);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`
        };
      }

      // Generate three list types
      const lists: ApolloList[] = [
        this.generateHighFitList(icpData, filters),
        this.generateIntentSignalList(icpData, filters),
        this.generateLookalikeList(icpData, filters)
      ];

      return {
        success: true,
        data: { apolloLists: lists },
        metadata: {
          platform: 'apollo',
          recordCount: lists.length,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Error generating Apollo lists:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public generateHighFitList(
    icpData: ICPData,
    additionalFilters?: Partial<CompanyFilters & ContactFilters>
  ): ApolloList {
    const industry = icpData?.industry || 'Technology';
    const companySize = icpData?.companySize || 'medium';

    // Map company size to employee range
    const employeeRange = this.mapCompanySizeToEmployees(companySize);

    return {
      listId: `apollo-high-fit-${Date.now()}`,
      name: 'H&S High ICP Fit Prospects',
      description: 'Companies matching ideal customer profile with ICP score 8.0+',
      companyFilters: {
        industry: additionalFilters?.industry || [industry],
        employees: additionalFilters?.employees || employeeRange,
        revenue: additionalFilters?.revenue || { min: 1000000, max: 50000000 },
        technologies: additionalFilters?.technologies || [],
        location: additionalFilters?.location || ['United States', 'Canada'],
        fundingStage: additionalFilters?.fundingStage || ['Series A', 'Series B', 'Series C']
      },
      contactFilters: {
        titles: additionalFilters?.titles || [
          'Chief Executive Officer',
          'Chief Financial Officer',
          'Chief Operating Officer',
          'VP of Sales',
          'VP of Operations',
          'Director of Revenue Operations'
        ],
        departments: additionalFilters?.departments || ['Executive', 'Sales', 'Operations', 'Finance'],
        seniority: additionalFilters?.seniority || ['C-Level', 'VP', 'Director'],
        functions: additionalFilters?.functions || ['Executive', 'Sales', 'Operations']
      },
      intentSignals: [
        'Recently raised funding',
        'Hiring for sales roles',
        'Tech stack includes CRM',
        'Company growth indicators'
      ],
      estimatedCount: 500,
      targetIcpScore: { min: 8.0, max: 10.0 },
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0'
      }
    };
  }

  public generateIntentSignalList(
    icpData: ICPData,
    additionalFilters?: Partial<CompanyFilters & ContactFilters>
  ): ApolloList {
    return {
      listId: `apollo-intent-${Date.now()}`,
      name: 'H&S Intent Signal Prospects',
      description: 'Prospects showing active buying signals and intent',
      companyFilters: {
        industry: additionalFilters?.industry || [icpData?.industry || 'Technology'],
        employees: additionalFilters?.employees || { min: 50, max: 1000 },
        revenue: additionalFilters?.revenue || { min: 5000000, max: 100000000 },
        technologies: additionalFilters?.technologies || ['Salesforce', 'HubSpot', 'Outreach'],
        location: additionalFilters?.location || ['United States'],
        fundingStage: additionalFilters?.fundingStage || ['Series B', 'Series C', 'Series D']
      },
      contactFilters: {
        titles: additionalFilters?.titles || [
          'VP of Sales',
          'Chief Revenue Officer',
          'Director of Sales Operations',
          'VP of Business Development'
        ],
        departments: additionalFilters?.departments || ['Sales', 'Revenue Operations'],
        seniority: additionalFilters?.seniority || ['VP', 'C-Level', 'Director'],
        functions: additionalFilters?.functions || ['Sales', 'Business Development']
      },
      intentSignals: [
        'Visiting competitor websites',
        'Searching for related keywords',
        'Attending relevant webinars',
        'Downloading related content',
        'Job postings for related roles',
        'Recent leadership changes',
        'Technology adoption signals'
      ],
      estimatedCount: 250,
      targetIcpScore: { min: 7.0, max: 10.0 },
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0'
      }
    };
  }

  public generateLookalikeList(
    icpData: ICPData,
    additionalFilters?: Partial<CompanyFilters & ContactFilters>
  ): ApolloList {
    return {
      listId: `apollo-lookalike-${Date.now()}`,
      name: 'H&S Lookalike Prospects',
      description: 'Companies similar to your best customers',
      companyFilters: {
        industry: additionalFilters?.industry || [icpData?.industry || 'Technology'],
        employees: additionalFilters?.employees || { min: 100, max: 500 },
        revenue: additionalFilters?.revenue || { min: 10000000, max: 100000000 },
        technologies: additionalFilters?.technologies || [],
        location: additionalFilters?.location || ['United States', 'Canada', 'United Kingdom'],
        fundingStage: additionalFilters?.fundingStage || ['Series B', 'Series C', 'Growth Stage']
      },
      contactFilters: {
        titles: additionalFilters?.titles || [
          'Chief Executive Officer',
          'Chief Revenue Officer',
          'VP of Sales',
          'VP of Marketing'
        ],
        departments: additionalFilters?.departments || ['Executive', 'Sales', 'Marketing'],
        seniority: additionalFilters?.seniority || ['C-Level', 'VP'],
        functions: additionalFilters?.functions || ['Executive', 'Sales', 'Marketing']
      },
      intentSignals: [
        'Similar tech stack to customers',
        'Similar business model',
        'Similar growth stage',
        'Similar challenges based on public info'
      ],
      estimatedCount: 300,
      targetIcpScore: { min: 7.5, max: 10.0 },
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0'
      }
    };
  }

  // ==========================================
  // PERSONALIZATION & OPTIMIZATION
  // ==========================================

  public optimizeSequenceForPersona(
    sequence: OutreachSequence,
    personaType: string
  ): OutreachSequence {
    try {
      const optimizedSequence = { ...sequence };

      // Adjust sequence based on persona preferences
      switch (personaType.toLowerCase()) {
        case 'technical_dm':
        case 'technical_evaluator':
          // Technical personas prefer detailed, technical communication
          optimizedSequence.steps = optimizedSequence.steps.map(step => ({
            ...step,
            template: step.template?.replace('business outcomes', 'technical capabilities')
              .replace('strategic value', 'technical architecture')
          }));
          break;

        case 'economic_buyer':
        case 'business_dm':
          // Business personas prefer ROI and business impact
          optimizedSequence.steps = optimizedSequence.steps.map(step => ({
            ...step,
            template: step.template?.replace('features', 'business outcomes')
              .replace('how it works', 'business impact')
          }));
          break;

        default:
          // Keep default sequence
          break;
      }

      return optimizedSequence;

    } catch (error) {
      console.error('Error optimizing sequence for persona:', error);
      return sequence;
    }
  }

  public generateSequenceVariations(
    baseSequence: OutreachSequence,
    variationType: 'a_b_test' | 'multi_variant' | 'persona_specific'
  ): OutreachSequence[] {
    try {
      const variations: OutreachSequence[] = [baseSequence];

      if (variationType === 'a_b_test') {
        // Create one A/B variation with different subject lines
        const variationB = {
          ...baseSequence,
          sequenceId: `${baseSequence.sequenceId}-variation-b`,
          name: `${baseSequence.name} (Variation B)`,
          steps: baseSequence.steps.map(step => ({
            ...step,
            subject: step.subject?.replace('Quick question', 'Curious about')
              .replace('Following up', 'Thought you might find this interesting')
          }))
        };
        variations.push(variationB);
      }

      if (variationType === 'multi_variant') {
        // Create multiple variations with different approaches
        const variationValue = {
          ...baseSequence,
          sequenceId: `${baseSequence.sequenceId}-value-focus`,
          name: `${baseSequence.name} (Value Focus)`,
          description: 'Variation focused on quantified value and ROI'
        };

        const variationSocial = {
          ...baseSequence,
          sequenceId: `${baseSequence.sequenceId}-social-proof`,
          name: `${baseSequence.name} (Social Proof)`,
          description: 'Variation focused on customer success stories'
        };

        variations.push(variationValue, variationSocial);
      }

      if (variationType === 'persona_specific') {
        // Create variations for each persona type
        const personaTypes = ['technical_dm', 'business_dm', 'economic_buyer'];
        personaTypes.forEach(persona => {
          const personaVariation = this.optimizeSequenceForPersona(baseSequence, persona);
          personaVariation.sequenceId = `${baseSequence.sequenceId}-${persona}`;
          personaVariation.name = `${baseSequence.name} (${persona})`;
          variations.push(personaVariation);
        });
      }

      return variations;

    } catch (error) {
      console.error('Error generating sequence variations:', error);
      return [baseSequence];
    }
  }

  public replacePersonalizationVariables(
    template: string,
    variables: Record<string, string>
  ): string {
    try {
      let personalizedTemplate = template;

      // Replace each [[VARIABLE]] with its value
      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = `[[${key}]]`;
        personalizedTemplate = personalizedTemplate.replace(new RegExp(placeholder, 'g'), value);
      });

      return personalizedTemplate;

    } catch (error) {
      console.error('Error replacing personalization variables:', error);
      return template;
    }
  }

  // ==========================================
  // VALIDATION & HELPERS
  // ==========================================

  private validateICPData(icpData: ICPData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!icpData) {
      errors.push('ICP data is required');
      return { isValid: false, errors, warnings };
    }

    if (!icpData.industry && !icpData.personaTypes?.length) {
      warnings.push('No industry or persona types provided - using defaults');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  public validateSequenceData(sequence: OutreachSequence): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!sequence) {
      errors.push('Sequence data is required');
      return { isValid: false, errors, warnings };
    }

    if (!sequence.name) {
      errors.push('Sequence name is required');
    }

    if (!sequence.steps || sequence.steps.length === 0) {
      errors.push('Sequence must have at least one step');
    }

    if (sequence.steps && sequence.steps.some(step => !step.type || !step.template)) {
      errors.push('All steps must have type and template');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  public validateCadenceData(cadence: SalesLoftCadence): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!cadence) {
      errors.push('Cadence data is required');
      return { isValid: false, errors, warnings };
    }

    if (!cadence.name) {
      errors.push('Cadence name is required');
    }

    if (!cadence.touches || cadence.touches.length === 0) {
      errors.push('Cadence must have at least one touch');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  public validateApolloListData(list: ApolloList): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!list) {
      errors.push('Apollo list data is required');
      return { isValid: false, errors, warnings };
    }

    if (!list.name) {
      errors.push('List name is required');
    }

    if (!list.companyFilters && !list.contactFilters) {
      errors.push('At least one filter type (company or contact) is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // ==========================================
  // SUPABASE INTEGRATION
  // ==========================================

  public async storeSalesAutomationData(
    platform: 'outreach' | 'salesloft' | 'apollo',
    data: any,
    userId: string
  ): Promise<void> {
    try {
      const { error } = await (this.supabase as any)
        .from('sales_automation_data')
        .insert([{
          platform,
          data,
          user_id: userId,
          timestamp: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error storing sales automation data:', error);
      }
    } catch (error) {
      console.error('Error storing sales automation data:', error);
    }
  }

  public async getSalesAutomationData(
    userId: string,
    platform?: 'outreach' | 'salesloft' | 'apollo'
  ): Promise<any[]> {
    try {
      let query = this.supabase
        .from('sales_automation_data')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (platform) {
        query = query.eq('platform', platform);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching sales automation data:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching sales automation data:', error);
      return [];
    }
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================

  private mapCompanySizeToEmployees(companySize: string): { min: number; max: number } {
    const sizeMap: Record<string, { min: number; max: number }> = {
      startup: { min: 1, max: 10 },
      small: { min: 11, max: 50 },
      medium: { min: 51, max: 200 },
      large: { min: 201, max: 1000 },
      enterprise: { min: 1001, max: 50000 }
    };

    return sizeMap[companySize.toLowerCase()] || { min: 50, max: 500 };
  }
}

// Create and export singleton instance
const salesAutomationService = new SalesAutomationService();

export default salesAutomationService;
