/**
 * Technical Translation Service - TypeScript Migration
 * Phase 3.2: Advanced Intelligence Services
 *
 * Converts technical metrics into stakeholder-specific business language
 * for Series A technical founders who need systematic buyer understanding.
 *
 * Core Use Case: "How does 10x faster processing translate to
 * 'reduces quarterly reporting from 6 weeks to 3 days'?"
 *
 * @migration Next.js 15 + TypeScript strict mode
 * @phase Phase 3.2 - Technical Translation Service
 * @note Isomorphic module - can run on server or client
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface BuyerPersona {
  id: string;                          // From ICP Analysis
  name: string;                        // "Sarah Chen"
  title: string;                       // "CEO & Co-Founder"
  role: 'CFO' | 'COO' | 'CTO' | 'CEO' | 'CRO' | 'VP Sales' | 'VP Product';
  goals: string[];                     // ["Scale from $2M to $10M ARR"]
  painPoints: string[];                // ["Cannot forecast revenue pipeline"]
  values: string[];                    // ["Data-driven decision making"]
  decisionCriteria?: string[];         // ["Measurable ROI", "Time to value"]
  communicationStyle?: string;         // "Direct, data-focused"

  // NEW: Empathy Mapping (Pure Signal Part II enhancement)
  empathyMap?: {
    see: string[];                     // Observable external reality
    hear: string[];                    // Direct feedback from board/team/customers
    thinkAndFeel: string[];            // 3 AM fears, hidden concerns
    sayAndDo: {
      public: string[];                // Public statements/behavior
      private: string[];               // Private behavior/actions
    };
    pains: string[];                   // Professional risks, emotional burdens
    gains: string[];                   // Professional relief, career advancement
  };
  hiddenAmbitions?: string[];          // Career goals not publicly stated
  failureConsequences?: string[];      // What happens if they don't succeed
  careerStage?: string;                // "First-time VP Sales" | "Proven CRO"
  successMetrics?: string[];           // What they're measured on
}

export interface TranslationInput {
  technicalMetric: string;
  improvement: string;
  industry: keyof typeof INDUSTRY_FRAMEWORKS | string;
  targetPersonas: BuyerPersona[];      // Array of personas from ICP
  includeInternalStakeholders?: boolean; // Generate CXO translations
  customerContext?: {
    name?: string;
    industry?: string;
    size?: 'SMB' | 'Mid-Market' | 'Enterprise';
    painPoint?: string;
    currentARR?: string;               // "$2M"
    targetARR?: string;                // "$10M"
    timeline?: string;                 // "18 months"
  };
  competitorClaim?: string;

  // NEW: Desert Context (Revenue Desert ICP integration)
  desertContext?: {
    runwayMonths: number;              // 12-18 months runway remaining
    fundingPressure: string;           // "Series A required in 90 days"
    boardMilestones: string[];         // ["5-10 enterprise logos", "$5M ARR"]
    recentHires: string[];             // ["VP Enterprise Sales hired 8 months ago"]
    observablePainSignals: string[];   // ["Losing deals at CFO stage", "Founder on 80% of calls"]
    criticalSuccessMetrics: {
      metric: string;                  // "Close 3-5 enterprise deals"
      deadline: string;                // "90 days"
      impact: string;                  // "Extends runway 6-9 months"
    }[];
  };
}

// NEW: Four-Layer Translation Framework (Pure Signal Part III enhancement)
export interface FourLayerTranslation {
  layer1_technicalCapability: string;      // SAME for all personas
  layer2_strategicPainRisk: {
    externalPressure: string;              // Market/board/competitive reality
    internalDriver: string;                // Career/reputation/identity concern
    theRisk: string;                       // What happens if not solved (failure consequences)
  };
  layer3_strategicOutcome: {
    operationalChange: string;             // How day-to-day transforms
    strategicChange: string;               // How position/capability improves
    relationshipChange: string;            // How stakeholder perception shifts
  };
  layer4_roiAndRelief: {
    theNumbers: {
      primary: string;                     // Primary metric (defensible to their stakeholder)
      secondary: string;                   // Supporting calculation
      timeToValue: string;                 // When they see results
      defensibleTo: string;                // "Board" | "Founder" | "CFO"
    };
    theRelief: string;                     // First-person "I stop..." statement from empathy map
    theCareerWin: string;                  // Professional advancement aligned to hidden ambitions
  };
}

export interface PersonaTranslation {
  persona: BuyerPersona;

  // NEW: Four-layer framework integration
  fourLayerTranslation?: FourLayerTranslation;

  // Existing direct messaging (maintained for backward compatibility)
  directMessaging: {
    elevator: string;                  // What YOU say to Sarah
    email: string;                     // Email YOU send to Sarah
    presentation: string;              // Slides for Sarah
    painPointConnection: string;       // How it solves Sarah's pain
    goalAlignment: string;             // How it achieves Sarah's goal
    keyMetrics: string[];              // Metrics Sarah cares about
  };
}

export interface CXOTranslation {
  stakeholder: 'CFO' | 'COO' | 'CTO';

  // NEW: Four-layer framework for champion enablement
  fourLayerForChampion?: {
    strategicPainRisk: string;         // How champion frames the problem to CXO
    strategicOutcome: string;          // How champion frames the transformation to CXO
    roiStatement: string;              // Numbers champion uses with CXO
    relationshipBenefit: string;       // How this helps champion's relationship with CXO
  };

  championEnablement: {
    talkingPoints: string;             // What Sarah tells her CFO
    emailTemplate: string;             // Email Sarah forwards to CFO
    presentationSlides: string;        // Slides Sarah shares with CFO
    objectionHandling: string[];       // "What if CFO says X?"
    keyMetrics: string[];              // Metrics CFO cares about
    decisionCriteria: string[];        // What CFO needs to approve
  };
}

export interface TranslationResult {
  technicalInput: string;
  businessTranslation: string;

  // NEW: Two-level stakeholder structure
  targetBuyerTranslations: PersonaTranslation[];  // Level 1
  internalStakeholderTranslations: CXOTranslation[]; // Level 2
  stakeholderMap: {
    level1: string[];                  // ["Sarah Chen", "Marcus Rodriguez"]
    level2: string[];                  // ["CFO", "COO", "CTO"]
    totalStakeholders: number;         // 5
  };

  // Existing fields for backward compatibility
  stakeholderSpecific: {
    language: string;
    keyMetrics: string[];
    painPointConnection: string;
    roiCalculation: string;
  };
  competitivePositioning: {
    position: string;
    differentiation: string;
    validation: string;
    counterClaim?: string;
  };
  supportingEvidence: {
    caseStudy: string;
    benchmark: string;
    methodology: string;
    timeline: string;
  };
  usageInstructions: {
    elevator: string;
    email: string;
    presentation: string;
    proposal: string;
  };
  generatedAt: string;
  industry: string;
  targetStakeholder: string; // Backward compatibility
}

interface IndustryFramework {
  name: string;
  stakeholders: string[];
  painPoints: Record<string, string>;
  translationTemplates: Record<string, {
    technical: string;
    business: string;
    cfoLanguage: string;
    cooLanguage: string;
  }>;
}

interface StakeholderLanguagePrefs {
  focus: string;
  metrics: string[];
  concerns: string[];
  language: string;
}

interface BaseTranslation {
  business: string;
  impact: string;
  cfoVersion?: string;
  cooVersion?: string;
}

interface StakeholderTranslation {
  primary: string;
  language: string;
  metrics: string[];
  painPoint: string;
  roi: string;
  elevator: string;
  email: string;
  presentation: string;
  proposal: string;
}

// ============================================================================
// CONSTANTS & FRAMEWORKS
// ============================================================================

const INDUSTRY_FRAMEWORKS = {
  healthcare: {
    name: 'Healthcare & Medical',
    stakeholders: ['CFO', 'COO', 'Compliance Officer', 'Medical Director'],
    painPoints: {
      regulatory_reporting: 'Regulatory compliance and reporting overhead',
      claim_processing: 'Insurance claim processing delays',
      patient_data: 'Patient data management complexity',
      audit_compliance: 'Audit preparation and compliance costs',
    },
    translationTemplates: {
      processing_speed: {
        technical: 'processing speed improvement',
        business: 'reduces operational overhead and compliance costs',
        cfoLanguage: 'cost per processed transaction',
        cooLanguage: 'operational efficiency and turnaround time',
      },
      data_accuracy: {
        technical: 'data accuracy improvement',
        business: 'reduces compliance risk and audit costs',
        cfoLanguage: 'risk mitigation and cost avoidance',
        cooLanguage: 'operational quality and patient safety',
      },
    },
  },
  logistics: {
    name: 'Logistics & Supply Chain',
    stakeholders: ['CFO', 'COO', 'Supply Chain Director', 'Operations Manager'],
    painPoints: {
      visibility_gaps: 'Supply chain visibility and tracking',
      inventory_costs: 'Inventory carrying costs and waste',
      delivery_delays: 'Delivery delays and customer satisfaction',
      cost_optimization: 'Route and cost optimization',
    },
    translationTemplates: {
      tracking_accuracy: {
        technical: 'tracking accuracy improvement',
        business: 'reduces inventory waste and improves customer satisfaction',
        cfoLanguage: 'inventory carrying cost reduction',
        cooLanguage: 'operational visibility and control',
      },
      route_optimization: {
        technical: 'route optimization efficiency',
        business: 'reduces delivery costs and improves on-time performance',
        cfoLanguage: 'transportation cost reduction',
        cooLanguage: 'delivery reliability and customer satisfaction',
      },
    },
  },
  fintech: {
    name: 'Financial Technology',
    stakeholders: ['CFO', 'CRO', 'Compliance Officer', 'Risk Manager'],
    painPoints: {
      transaction_costs: 'Transaction processing costs and fees',
      fraud_prevention: 'Fraud detection and prevention',
      regulatory_compliance: 'Financial regulatory compliance',
      risk_management: 'Risk assessment and management',
    },
    translationTemplates: {
      fraud_detection: {
        technical: 'fraud detection accuracy',
        business: 'reduces financial losses and regulatory risk',
        cfoLanguage: 'cost per prevented fraud incident',
        croLanguage: 'risk mitigation and compliance assurance',
      },
      transaction_processing: {
        technical: 'transaction processing speed',
        business: 'reduces processing costs and improves customer experience',
        cfoLanguage: 'cost per transaction',
        cooLanguage: 'processing capacity and throughput',
      },
    },
  },
  saas: {
    name: 'Software as a Service',
    stakeholders: ['CEO', 'CTO', 'VP Product', 'VP Engineering'],
    painPoints: {
      time_to_market: 'Product development and time to market',
      scalability: 'Platform scalability and reliability',
      customer_churn: 'Customer retention and satisfaction',
      development_velocity: 'Engineering team productivity',
    },
    translationTemplates: {
      development_speed: {
        technical: 'development velocity improvement',
        business: 'reduces time to market and increases competitive advantage',
        cfoLanguage: 'development cost efficiency',
        cooLanguage: 'product delivery speed and quality',
      },
      platform_reliability: {
        technical: 'platform reliability improvement',
        business: 'reduces customer churn and support costs',
        cfoLanguage: 'customer lifetime value improvement',
        cooLanguage: 'operational stability and customer satisfaction',
      },
    },
  },
} as const;

const STAKEHOLDER_LANGUAGE = {
  CFO: {
    focus: 'cost reduction and ROI',
    metrics: ['cost per unit', 'ROI percentage', 'payback period', 'cost savings'],
    concerns: ['budget impact', 'financial risk', 'implementation cost'],
    language: 'financial and quantitative',
  },
  COO: {
    focus: 'operational efficiency and scalability',
    metrics: ['process efficiency', 'turnaround time', 'capacity utilization'],
    concerns: ['operational disruption', 'scalability', 'team productivity'],
    language: 'operational and process-focused',
  },
  CTO: {
    focus: 'technical feasibility and integration',
    metrics: ['system performance', 'integration complexity', 'technical debt'],
    concerns: ['technical risk', 'system compatibility', 'maintenance'],
    language: 'technical and architecture-focused',
  },
  CEO: {
    focus: 'strategic impact and growth',
    metrics: ['revenue growth', 'market position', 'competitive advantage'],
    concerns: ['strategic risk', 'market timing', 'competitive response'],
    language: 'strategic and business-focused',
  },
  CRO: {
    focus: 'revenue growth and customer success',
    metrics: ['customer acquisition', 'retention rate', 'upsell potential'],
    concerns: ['customer satisfaction', 'sales enablement', 'revenue risk'],
    language: 'customer and revenue-focused',
  },
} as const;

const METRIC_TRANSLATIONS = {
  processing_speed: {
    '2x_faster': 'Reduces processing time by 50%',
    '5x_faster': 'Reduces processing time by 80%',
    '10x_faster': 'Reduces processing time by 90%',
  },
  accuracy_improvement: {
    '95_to_99': 'Reduces errors by 80% (95% → 99% accuracy)',
    '90_to_95': 'Reduces errors by 50% (90% → 95% accuracy)',
    '85_to_95': 'Reduces errors by 67% (85% → 95% accuracy)',
  },
  cost_reduction: {
    '20_percent': 'Reduces operational costs by 20%',
    '40_percent': 'Reduces operational costs by 40%',
    '60_percent': 'Reduces operational costs by 60%',
  },
} as const;

// ============================================================================
// CORE SERVICE CLASS
// ============================================================================

class TechnicalTranslationService {
  private industryFrameworks = INDUSTRY_FRAMEWORKS;
  private stakeholderLanguage = STAKEHOLDER_LANGUAGE;
  private metricTranslations = METRIC_TRANSLATIONS;

  /**
   * Main translation method - converts technical metrics to business language
   * @param input - Technical metrics and context
   * @returns Stakeholder-specific translations
   */
  translateTechnicalMetric(input: TranslationInput): TranslationResult {
    const {
      technicalMetric,
      improvement,
      industry,
      targetPersonas,                          // Array of personas
      includeInternalStakeholders = true,      // Default to true
      customerContext,
      competitorClaim,
      desertContext,                           // NEW: Desert context for urgency
    } = input;

    // Defensive guard: Ensure targetPersonas is a valid array
    if (!Array.isArray(targetPersonas)) {
      console.error('❌ translateTechnicalMetric received non-array targetPersonas:', targetPersonas);
      throw new Error('Invalid targetPersonas: expected array of buyer personas');
    }

    // Get industry framework (with fallback)
    const industryKey = industry in this.industryFrameworks ? industry as keyof typeof INDUSTRY_FRAMEWORKS : 'healthcare';
    const industryFramework = this.industryFrameworks[industryKey];

    // Generate base translation
    const baseTranslation = this._generateBaseTranslation(
      technicalMetric,
      improvement,
      industryFramework as any
    );

    // Level 1: Generate persona-specific translations (now with desert context)
    const buyerTranslations = targetPersonas.map(persona =>
      this._generatePersonaTranslation(
        technicalMetric,
        improvement,
        persona,
        baseTranslation,
        customerContext,
        desertContext                          // Pass desert context
      )
    );

    // Level 2: Generate internal stakeholder translations (champion enablement with empathy)
    const internalTranslations = includeInternalStakeholders
      ? (['CFO', 'COO', 'CTO'] as const).map(stakeholder =>
          this._generateInternalStakeholderTranslation(
            technicalMetric,
            improvement,
            stakeholder,
            targetPersonas,
            baseTranslation,
            customerContext,
            desertContext                         // Pass desert context for urgency
          )
        )
      : [];

    // Generate competitive positioning
    const competitivePosition = this._generateCompetitivePosition(
      technicalMetric,
      improvement,
      competitorClaim
    );

    // Generate supporting evidence
    const supportingEvidence = this._generateSupportingEvidence(
      technicalMetric,
      improvement,
      industryKey
    );

    return {
      technicalInput: `${technicalMetric}: ${improvement}`,
      businessTranslation: baseTranslation.business,

      // NEW: Two-level stakeholder structure
      targetBuyerTranslations: buyerTranslations,
      internalStakeholderTranslations: internalTranslations,
      stakeholderMap: {
        level1: targetPersonas.map(p => p.name),
        level2: includeInternalStakeholders ? ['CFO', 'COO', 'CTO'] : [],
        totalStakeholders: buyerTranslations.length + internalTranslations.length
      },

      // Existing fields for backward compatibility
      stakeholderSpecific: {
        language: 'persona-specific',
        keyMetrics: buyerTranslations[0]?.directMessaging.keyMetrics || [],
        painPointConnection: buyerTranslations[0]?.directMessaging.painPointConnection || '',
        roiCalculation: 'See persona-specific translations'
      },
      competitivePositioning: competitivePosition,
      supportingEvidence: supportingEvidence,
      usageInstructions: {
        elevator: buyerTranslations[0]?.directMessaging.elevator || '',
        email: buyerTranslations[0]?.directMessaging.email || '',
        presentation: buyerTranslations[0]?.directMessaging.presentation || '',
        proposal: `Complete proposal with ${buyerTranslations.length} persona sections + ${internalTranslations.length} CXO sections`
      },
      generatedAt: new Date().toISOString(),
      industry: industryFramework.name,
      targetStakeholder: targetPersonas[0]?.role || 'CEO' // Backward compatibility
    };
  }

  /**
   * Generate base business translation from technical metric
   */
  private _generateBaseTranslation(
    technicalMetric: string,
    improvement: string,
    industryFramework: IndustryFramework
  ): BaseTranslation {
    const template = industryFramework.translationTemplates[technicalMetric];

    if (!template) {
      return {
        business: `Improves ${technicalMetric} by ${improvement}`,
        impact: 'operational efficiency and cost reduction',
      };
    }

    return {
      business: template.business,
      impact: template.business,
      cfoVersion: template.cfoLanguage,
      cooVersion: template.cooLanguage,
    };
  }

  /**
   * Generate stakeholder-specific translation
   */
  private _generateStakeholderTranslation(
    baseTranslation: BaseTranslation,
    stakeholderPrefs: StakeholderLanguagePrefs,
    customerContext: TranslationInput['customerContext'] = {},
    improvement: string = 'technical improvement'
  ): StakeholderTranslation {
    const customerName = customerContext?.name || 'your organization';
    const customerIndustry = customerContext?.industry || 'your industry';

    // CFO-specific translation
    if (stakeholderPrefs.focus.includes('cost reduction')) {
      return {
        primary: `Reduces operational costs for ${customerName} by improving efficiency`,
        language: 'financial impact and ROI',
        metrics: ['cost per transaction', 'annual cost savings', 'payback period'],
        painPoint: 'High operational costs reducing profitability',
        roi: 'Typical customers see 15-25% cost reduction within 6 months',
        elevator: `We help ${customerIndustry} companies like ${customerName} reduce operational costs by 20-40% through improved processing efficiency`,
        email: `Based on your current volume, this could reduce your operational costs by approximately $X annually`,
        presentation: `Cost Impact Analysis: How ${improvement} translates to ${customerName}'s bottom line`,
        proposal: `Financial Impact Assessment: Projected cost savings and ROI timeline for ${customerName}`,
      };
    }

    // COO-specific translation
    if (stakeholderPrefs.focus.includes('operational efficiency')) {
      return {
        primary: `Improves operational efficiency and reduces processing bottlenecks`,
        language: 'operational impact and scalability',
        metrics: ['process efficiency', 'turnaround time', 'capacity utilization'],
        painPoint: 'Operational bottlenecks limiting growth and customer satisfaction',
        roi: 'Typical customers improve operational capacity by 30-50% without additional staff',
        elevator: `We help ${customerIndustry} operations teams scale efficiently without proportional staff increases`,
        email: `This improvement could help your team handle 2-3x current volume with existing resources`,
        presentation: `Operational Efficiency Analysis: Scaling capacity without scaling costs`,
        proposal: `Operations Transformation Plan: Systematic efficiency improvements for ${customerName}`,
      };
    }

    // CEO/Strategic translation
    if (stakeholderPrefs.focus.includes('strategic')) {
      return {
        primary: `Drives competitive advantage and market differentiation`,
        language: 'strategic impact and growth',
        metrics: ['market share gain', 'competitive position', 'revenue growth'],
        painPoint: 'Competitive pressure and market commoditization',
        roi: 'Typical customers achieve 2-3x faster growth vs. competitors',
        elevator: `We help ${customerIndustry} leaders gain sustainable competitive advantage through superior operational capabilities`,
        email: `This could position ${customerName} as the efficiency leader in ${customerIndustry}`,
        presentation: `Strategic Differentiation: Building unassailable competitive moats`,
        proposal: `Strategic Growth Initiative: Leveraging operational excellence for market leadership`,
      };
    }

    // Default business translation
    return {
      primary: baseTranslation.business,
      language: 'business impact and efficiency',
      metrics: ['efficiency improvement', 'time savings', 'error reduction'],
      painPoint: 'Operational inefficiencies impacting business performance',
      roi: 'Typical improvement results in measurable business impact within 3-6 months',
      elevator: `We help companies improve their core operations for better business outcomes`,
      email: `This could significantly improve your operational performance`,
      presentation: `Business Impact: How technical improvements drive business results`,
      proposal: `Technical Implementation Plan: Systematic improvements for business impact`,
    };
  }

  /**
   * Generate competitive positioning
   */
  private _generateCompetitivePosition(
    technicalMetric: string,
    improvement: string,
    competitorClaim?: string
  ) {
    if (!competitorClaim) {
      return {
        position: 'Market-leading performance',
        differentiation: 'Proven technical advantage',
        validation: 'Customer case study available',
      };
    }

    return {
      position: `Our ${improvement} improvement vs. competitor's ${competitorClaim}`,
      differentiation: 'Sustainable technical advantage with proven methodology',
      validation: 'Validated through customer implementations and case studies',
      counterClaim: `While competitors claim ${competitorClaim}, our approach delivers consistent, measurable results`,
    };
  }

  /**
   * Generate supporting evidence and case studies
   */
  private _generateSupportingEvidence(
    technicalMetric: string,
    improvement: string,
    industry: string
  ) {
    return {
      caseStudy: `Customer case study: ${industry} company achieved ${improvement} in ${technicalMetric}`,
      benchmark: `Industry benchmark: Top 10% of ${industry} companies typically see this level of improvement`,
      methodology: `Our systematic approach ensures consistent results across implementations`,
      timeline: `Typical implementation: 30-60 days to full deployment, 90 days to measurable ROI`,
    };
  }

  /**
   * Quick translation for common scenarios
   */
  quickTranslate(
    technicalMetric: string,
    improvement: string,
    stakeholder: 'CFO' | 'COO' | 'CTO' | 'CEO' | 'CRO' = 'CFO'
  ): TranslationResult {
    // Create a fallback persona for quick translation
    const fallbackPersona: BuyerPersona = {
      id: 'quick-translate-persona',
      name: 'Target Customer',
      title: `${stakeholder} & Decision Maker`,
      role: stakeholder,
      goals: ['Improve business performance', 'Reduce operational costs'],
      painPoints: ['Operational inefficiencies', 'Scaling challenges'],
      values: ['Efficiency', 'Growth', 'Innovation'],
      decisionCriteria: ['ROI', 'Implementation risk', 'Business impact'],
      communicationStyle: 'Direct, results-focused'
    };

    return this.translateTechnicalMetric({
      technicalMetric,
      improvement,
      industry: 'healthcare',
      targetPersonas: [fallbackPersona],
      includeInternalStakeholders: true,
      customerContext: { name: 'Target Customer', industry: 'Healthcare' },
    });
  }

  /**
   * Get available industries and frameworks
   */
  getAvailableFrameworks() {
    return Object.keys(this.industryFrameworks).map((key) => ({
      id: key,
      name: this.industryFrameworks[key as keyof typeof INDUSTRY_FRAMEWORKS].name,
      stakeholders: this.industryFrameworks[key as keyof typeof INDUSTRY_FRAMEWORKS].stakeholders,
    }));
  }

  /**
   * Get stakeholder language preferences
   */
  getStakeholderPreferences(stakeholder: keyof typeof STAKEHOLDER_LANGUAGE) {
    return this.stakeholderLanguage[stakeholder] || this.stakeholderLanguage.CFO;
  }

  // ============================================================================
  // NEW: PERSONA-SPECIFIC TRANSLATION METHODS
  // ============================================================================

  /**
   * Generate persona-specific translation using ICP data
   * NOW WITH FOUR-LAYER FRAMEWORK + EMPATHY MAPPING
   */
  private _generatePersonaTranslation(
    technicalMetric: string,
    improvement: string,
    persona: BuyerPersona,
    baseTranslation: BaseTranslation,
    customerContext?: TranslationInput['customerContext'],
    desertContext?: TranslationInput['desertContext']
  ): PersonaTranslation {
    const customerName = customerContext?.name || 'your organization';
    const customerIndustry = customerContext?.industry || 'your industry';
    const currentARR = customerContext?.currentARR || '$2M';
    const targetARR = customerContext?.targetARR || '$10M';
    const timeline = customerContext?.timeline || '18 months';

    // Get primary goal and pain point for this persona
    const primaryGoal = persona.goals[0] || 'Improve business performance';
    const primaryPainPoint = persona.painPoints[0] || 'Operational inefficiencies';

    // Generate four-layer translation if empathy map exists
    const fourLayerTranslation = persona.empathyMap
      ? this._generateFourLayerTranslation(
          technicalMetric,
          improvement,
          persona,
          customerContext,
          desertContext
        )
      : undefined;

    return {
      persona,
      fourLayerTranslation,
      directMessaging: {
        // Use four-layer framework for elevator pitch if available
        elevator: fourLayerTranslation
          ? this._generateEmpathyDrivenElevatorPitch(fourLayerTranslation, persona, customerContext)
          : this._generatePersonaElevatorPitch(
              persona,
              technicalMetric,
              improvement,
              primaryGoal,
              primaryPainPoint,
              customerContext
            ),
        email: this._generatePersonaEmail(
          persona,
          technicalMetric,
          improvement,
          primaryGoal,
          primaryPainPoint,
          customerContext
        ),
        presentation: `For ${persona.name}: How ${improvement} in ${technicalMetric} directly supports your goal of ${primaryGoal}`,
        painPointConnection: `This directly addresses your challenge with ${primaryPainPoint} by providing measurable improvement in ${technicalMetric}`,
        goalAlignment: `By achieving ${improvement} in ${technicalMetric}, you'll be able to ${primaryGoal.toLowerCase()}`,
        keyMetrics: this._getPersonaRelevantMetrics(persona.role, persona.goals)
      }
    };
  }

  /**
   * Generate persona-specific elevator pitch
   */
  private _generatePersonaElevatorPitch(
    persona: BuyerPersona,
    technicalMetric: string,
    improvement: string,
    goal: string,
    painPoint: string,
    customerContext?: TranslationInput['customerContext']
  ): string {
    const customerName = customerContext?.name || 'your organization';
    const customerIndustry = customerContext?.industry || 'your industry';

    if (persona.role === 'CEO') {
      return `Hi ${persona.name}, I help ${customerIndustry} CEOs like you achieve ${goal} by solving the ${painPoint} challenge. Our ${improvement} improvement in ${technicalMetric} has helped similar companies reach their growth targets 40% faster.`;
    }

    if (persona.role === 'CFO') {
      return `Hi ${persona.name}, I help ${customerIndustry} CFOs reduce operational costs while improving efficiency. Our ${improvement} improvement in ${technicalMetric} typically delivers 20-30% cost savings within 6 months.`;
    }

    if (persona.role === 'VP Sales') {
      return `Hi ${persona.name}, I help sales leaders improve win rates and shorten sales cycles. Our ${improvement} improvement in ${technicalMetric} gives your team the competitive advantage they need to close more deals.`;
    }

    return `Hi ${persona.name}, I help ${persona.role}s in ${customerIndustry} achieve ${goal} by addressing ${painPoint}. Our ${improvement} improvement in ${technicalMetric} provides the measurable impact you need.`;
  }

  /**
   * Generate persona-specific email
   */
  private _generatePersonaEmail(
    persona: BuyerPersona,
    technicalMetric: string,
    improvement: string,
    goal: string,
    painPoint: string,
    customerContext?: TranslationInput['customerContext']
  ): string {
    const customerName = customerContext?.name || 'your organization';
    const currentARR = customerContext?.currentARR || '$2M';
    const targetARR = customerContext?.targetARR || '$10M';

    return `Subject: How ${improvement} in ${technicalMetric} helps ${customerName} achieve ${goal}

Hi ${persona.name},

I noticed that ${customerName} is focused on ${goal}, and I believe our solution can help you get there faster.

Specifically, our ${improvement} improvement in ${technicalMetric} directly addresses your challenge with ${painPoint}. 

For companies like ${customerName} (currently at ${currentARR}, targeting ${targetARR}), this typically translates to:
• Measurable progress toward your growth goals
• Reduced operational friction
• Competitive advantage in your market

Would you be interested in a 15-minute conversation about how this could accelerate ${customerName}'s path to ${goal}?

Best regards,
[Your name]`;
  }

  /**
   * Get metrics relevant to persona's role and goals
   */
  private _getPersonaRelevantMetrics(role: string, goals: string[]): string[] {
    const roleMetrics: Record<string, string[]> = {
      'CEO': ['Revenue growth', 'Market share', 'Competitive advantage', 'Team productivity'],
      'CFO': ['ROI', 'Cost reduction', 'Payback period', 'Cash flow improvement'],
      'COO': ['Operational efficiency', 'Process improvement', 'Capacity utilization', 'Quality metrics'],
      'CTO': ['System performance', 'Technical debt reduction', 'Integration success', 'Scalability'],
      'VP Sales': ['Win rate', 'Sales cycle length', 'Pipeline velocity', 'Customer acquisition cost'],
      'VP Product': ['Time to market', 'Feature adoption', 'User satisfaction', 'Product velocity']
    };

    return roleMetrics[role] || ['Efficiency improvement', 'Cost reduction', 'Time savings', 'Quality improvement'];
  }

  // ============================================================================
  // NEW: FOUR-LAYER TRANSLATION FRAMEWORK (Pure Signal Part III Enhancement)
  // ============================================================================

  /**
   * Generate complete four-layer translation using empathy mapping + desert context
   */
  private _generateFourLayerTranslation(
    technicalMetric: string,
    improvement: string,
    persona: BuyerPersona,
    customerContext?: TranslationInput['customerContext'],
    desertContext?: TranslationInput['desertContext']
  ): FourLayerTranslation {
    // LAYER 1: Technical Capability (same for all personas)
    const layer1 = `${improvement} improvement in ${technicalMetric}`;

    // LAYER 2: Strategic Pain/Risk (persona + empathy + desert specific)
    const layer2 = this._generateStrategicPainRisk(persona, desertContext, customerContext);

    // LAYER 3: Strategic Outcome (transformation specific to persona)
    const layer3 = this._generateStrategicOutcome(persona, technicalMetric, improvement, customerContext);

    // LAYER 4: ROI + Emotional Relief + Career Win
    const layer4 = this._generateROIAndRelief(persona, technicalMetric, improvement, desertContext, customerContext);

    return {
      layer1_technicalCapability: layer1,
      layer2_strategicPainRisk: layer2,
      layer3_strategicOutcome: layer3,
      layer4_roiAndRelief: layer4
    };
  }

  /**
   * LAYER 2: Generate Strategic Pain/Risk using empathy map + desert context
   */
  private _generateStrategicPainRisk(
    persona: BuyerPersona,
    desertContext?: TranslationInput['desertContext'],
    customerContext?: TranslationInput['customerContext']
  ): FourLayerTranslation['layer2_strategicPainRisk'] {
    const empathy = persona.empathyMap;
    const primaryPain = persona.painPoints[0] || 'operational challenges';

    // External Pressure: Combine what they SEE + HEAR + desert context
    const externalPressure = empathy
      ? `${empathy.see[0] || 'Market pressures building'}. ${empathy.hear[0] || 'Stakeholders demanding results'}${
          desertContext?.fundingPressure ? `. ${desertContext.fundingPressure}` : ''
        }`
      : `${primaryPain} creating competitive disadvantage${
          desertContext?.fundingPressure ? `. ${desertContext.fundingPressure}` : ''
        }`;

    // Internal Driver: Use empathy map THINK & FEEL + hidden ambitions
    const internalDriver = empathy?.thinkAndFeel[0]
      ? `${empathy.thinkAndFeel[0]}${
          persona.hiddenAmbitions?.[0] ? `. Ambition: ${persona.hiddenAmbitions[0]}` : ''
        }`
      : `Career reputation at stake${persona.hiddenAmbitions?.[0] ? `: ${persona.hiddenAmbitions[0]}` : ''}`;

    // The Risk: Use failure consequences
    const theRisk = persona.failureConsequences?.[0]
      ? persona.failureConsequences.join('; ')
      : 'Professional setback and lost opportunity';

    return {
      externalPressure,
      internalDriver,
      theRisk
    };
  }

  /**
   * LAYER 3: Generate Strategic Outcome (transformation)
   */
  private _generateStrategicOutcome(
    persona: BuyerPersona,
    technicalMetric: string,
    improvement: string,
    customerContext?: TranslationInput['customerContext']
  ): FourLayerTranslation['layer3_strategicOutcome'] {
    const empathy = persona.empathyMap;
    const primaryGoal = persona.goals[0] || 'Achieve business objectives';

    // Operational Change: What shifts in day-to-day work
    const operationalChange = `${improvement} in ${technicalMetric} enables ${persona.name} to ${primaryGoal.toLowerCase()} with measurable efficiency gains`;

    // Strategic Change: Position/capability improvement
    const strategicChange = empathy?.gains[0]
      ? `${empathy.gains[0]} becomes achievable`
      : `Strategic capability to ${primaryGoal.toLowerCase()} independently`;

    // Relationship Change: How stakeholder perception shifts
    const relationshipChange = `${
      persona.role === 'CEO' ? 'Board' : persona.role === 'VP Sales' ? 'Founder' : 'Leadership'
    } sees proven competence and systematic progress`;

    return {
      operationalChange,
      strategicChange,
      relationshipChange
    };
  }

  /**
   * LAYER 4: Generate ROI + Emotional Relief + Career Win
   */
  private _generateROIAndRelief(
    persona: BuyerPersona,
    technicalMetric: string,
    improvement: string,
    desertContext?: TranslationInput['desertContext'],
    customerContext?: TranslationInput['customerContext']
  ): FourLayerTranslation['layer4_roiAndRelief'] {
    const empathy = persona.empathyMap;

    // The Numbers: Persona-specific, defensible ROI
    const theNumbers = this._generateDefensibleROI(persona, technicalMetric, improvement, desertContext, customerContext);

    // The Relief: First-person statement from empathy map PAINS
    const theRelief = empathy?.pains[0]
      ? `I stop ${empathy.pains[0].toLowerCase().replace(/^(professional|personal|career)\s+/i, '')}${
          empathy.thinkAndFeel[0] ? `. ${empathy.thinkAndFeel[0]}` : ''
        }`
      : `I stop worrying about ${persona.painPoints[0]?.toLowerCase() || 'operational challenges'} and focus on strategic growth`;

    // The Career Win: Map to hidden ambitions + gains
    const theCareerWin = persona.hiddenAmbitions?.[0]
      ? `${persona.hiddenAmbitions[0]}${empathy?.gains[0] ? `. ${empathy.gains[0]}` : ''}`
      : `Establish reputation as ${persona.role} who delivers measurable business transformation`;

    return {
      theNumbers,
      theRelief,
      theCareerWin
    };
  }

  /**
   * Generate defensible ROI numbers specific to persona
   */
  private _generateDefensibleROI(
    persona: BuyerPersona,
    technicalMetric: string,
    improvement: string,
    desertContext?: TranslationInput['desertContext'],
    customerContext?: TranslationInput['customerContext']
  ): FourLayerTranslation['layer4_roiAndRelief']['theNumbers'] {
    const currentARR = customerContext?.currentARR || '$2M';
    const targetARR = customerContext?.targetARR || '$10M';

    // Role-specific ROI calculations
    if (persona.role === 'CEO') {
      const primaryMetric = desertContext?.criticalSuccessMetrics?.[0]
        ? `${desertContext.criticalSuccessMetrics[0].metric} in ${desertContext.criticalSuccessMetrics[0].deadline} = ${desertContext.criticalSuccessMetrics[0].impact}`
        : `Accelerate ${currentARR} → ${targetARR} growth by 40%`;

      return {
        primary: primaryMetric,
        secondary: `Reduce founder sales time 70% (reclaim 25-30 hours/week)`,
        timeToValue: desertContext?.criticalSuccessMetrics?.[0]?.deadline || '60-90 days',
        defensibleTo: 'Board'
      };
    }

    if (persona.role === 'VP Sales') {
      return {
        primary: `85% quota attainment = job security + ${currentARR} equity preservation`,
        secondary: `60% close rate (from 25%); 40% shorter sales cycles`,
        timeToValue: '30 days to independent deal management, 60 days to first close',
        defensibleTo: 'Founder'
      };
    }

    if (persona.role === 'CFO') {
      return {
        primary: `$800K improved working capital efficiency from accurate forecasting`,
        secondary: `$312K annual labor savings (40 hrs/month → strategic work)`,
        timeToValue: '45 days to first accurate 60-day forecast',
        defensibleTo: 'Board'
      };
    }

    // Default for other roles
    return {
      primary: `20-30% operational efficiency improvement within 6 months`,
      secondary: `Measurable progress toward ${persona.goals[0] || 'business objectives'}`,
      timeToValue: '60-90 days',
      defensibleTo: persona.role === 'COO' || persona.role === 'CTO' ? 'CEO' : 'Board'
    };
  }

  /**
   * Generate empathy-driven elevator pitch from four-layer framework
   */
  private _generateEmpathyDrivenElevatorPitch(
    fourLayer: FourLayerTranslation,
    persona: BuyerPersona,
    customerContext?: TranslationInput['customerContext']
  ): string {
    const customerName = customerContext?.name || 'your organization';

    return `${persona.name}, ${fourLayer.layer2_strategicPainRisk.externalPressure}

Our ${fourLayer.layer1_technicalCapability} delivers:
• ${fourLayer.layer3_strategicOutcome.operationalChange}
• ${fourLayer.layer4_roiAndRelief.theNumbers.primary}

${fourLayer.layer4_roiAndRelief.theRelief}

${fourLayer.layer4_roiAndRelief.theCareerWin}`;
  }

  // ============================================================================
  // NEW: CHAMPION ENABLEMENT METHODS
  // ============================================================================

  /**
   * Generate four-layer framework for champion to use with CXO stakeholder
   */
  private _generateFourLayerForChampion(
    stakeholder: 'CFO' | 'COO' | 'CTO',
    technicalMetric: string,
    improvement: string,
    champion: BuyerPersona,
    desertContext?: TranslationInput['desertContext'],
    customerContext?: TranslationInput['customerContext']
  ): CXOTranslation['fourLayerForChampion'] {
    const customerName = customerContext?.name || 'our organization';
    const championName = champion.name;

    // Strategic Pain/Risk: How champion frames the problem to CXO
    const strategicPainRisk = this._generateChampionPainRiskFraming(
      stakeholder,
      championName,
      technicalMetric,
      improvement,
      desertContext,
      customerName
    );

    // Strategic Outcome: How champion frames the transformation to CXO
    const strategicOutcome = this._generateChampionOutcomeFraming(
      stakeholder,
      championName,
      technicalMetric,
      improvement,
      customerName
    );

    // ROI Statement: Numbers champion uses with CXO
    const roiStatement = this._generateChampionROIStatement(
      stakeholder,
      technicalMetric,
      improvement,
      desertContext,
      customerContext
    );

    // Relationship Benefit: How this helps champion's relationship with CXO
    const relationshipBenefit = champion.empathyMap?.gains[0]
      ? `By bringing this solution to ${stakeholder}, ${championName} demonstrates strategic thinking and ${champion.empathyMap.gains[0].toLowerCase()}`
      : `${championName} establishes credibility with ${stakeholder} as strategic partner who brings measurable solutions`;

    return {
      strategicPainRisk,
      strategicOutcome,
      roiStatement,
      relationshipBenefit
    };
  }

  /**
   * Generate how champion frames the pain/risk to CXO
   */
  private _generateChampionPainRiskFraming(
    stakeholder: 'CFO' | 'COO' | 'CTO',
    championName: string,
    technicalMetric: string,
    improvement: string,
    desertContext?: TranslationInput['desertContext'],
    customerName?: string
  ): string {
    if (stakeholder === 'CFO') {
      return `${championName} should tell the CFO: "We're currently unable to accurately forecast ${technicalMetric}, which creates financial planning risk${
        desertContext?.fundingPressure ? ` especially given ${desertContext.fundingPressure}` : ''
      }. This ${improvement} improvement would give us the data confidence needed for reliable forecasting and cost optimization."`;
    }

    if (stakeholder === 'COO') {
      return `${championName} should tell the COO: "Our current ${technicalMetric} creates operational bottlenecks that prevent us from scaling${
        desertContext?.observablePainSignals?.[0] ? `, and ${desertContext.observablePainSignals[0].toLowerCase()}` : ''
      }. This ${improvement} improvement would eliminate the bottleneck and enable systematic growth."`;
    }

    if (stakeholder === 'CTO') {
      return `${championName} should tell the CTO: "Our ${technicalMetric} is creating technical debt and reliability concerns. This ${improvement} improvement is a proven solution with minimal integration risk that strengthens our technical foundation."`;
    }

    return `${championName} should frame the urgency and business impact to ${stakeholder}`;
  }

  /**
   * Generate how champion frames the outcome to CXO
   */
  private _generateChampionOutcomeFraming(
    stakeholder: 'CFO' | 'COO' | 'CTO',
    championName: string,
    technicalMetric: string,
    improvement: string,
    customerName?: string
  ): string {
    if (stakeholder === 'CFO') {
      return `${championName} should tell the CFO: "This gives us ${improvement} improvement in ${technicalMetric}, which translates to accurate financial forecasting, reduced operational costs, and confidence in board presentations."`;
    }

    if (stakeholder === 'COO') {
      return `${championName} should tell the COO: "This enables us to scale operational capacity 2-3x without proportional staffing increases, directly supporting ${customerName}'s growth objectives."`;
    }

    if (stakeholder === 'CTO') {
      return `${championName} should tell the CTO: "This strengthens our technical architecture with ${improvement} improvement in ${technicalMetric}, reducing technical debt and improving system reliability."`;
    }

    return `${championName} should emphasize the transformation to ${stakeholder}`;
  }

  /**
   * Generate ROI statement for champion to use with CXO
   */
  private _generateChampionROIStatement(
    stakeholder: 'CFO' | 'COO' | 'CTO',
    technicalMetric: string,
    improvement: string,
    desertContext?: TranslationInput['desertContext'],
    customerContext?: TranslationInput['customerContext']
  ): string {
    const currentARR = customerContext?.currentARR || '$2M';

    if (stakeholder === 'CFO') {
      return `"Based on our current volume, this translates to $800K+ improved working capital efficiency and $312K annual labor savings. ROI payback within 45 days."`;
    }

    if (stakeholder === 'COO') {
      return `"We can handle 2-3x current volume without proportional staff increases, translating to 30-50% operational capacity improvement with existing resources."`;
    }

    if (stakeholder === 'CTO') {
      return `"${improvement} in ${technicalMetric} with minimal integration risk. Proven solution reduces technical debt and improves system reliability within 30-60 days."`;
    }

    return `"Measurable ROI within 6 months with minimal implementation risk"`;
  }

  /**
   * Generate internal stakeholder translation (champion enablement)
   * NOW WITH FOUR-LAYER FRAMEWORK FOR CHAMPION MESSAGING
   */
  private _generateInternalStakeholderTranslation(
    technicalMetric: string,
    improvement: string,
    stakeholder: 'CFO' | 'COO' | 'CTO',
    champions: BuyerPersona[],
    baseTranslation: BaseTranslation,
    customerContext?: TranslationInput['customerContext'],
    desertContext?: TranslationInput['desertContext']
  ): CXOTranslation {
    const primaryChampion = champions[0];
    const championName = primaryChampion?.name || 'your champion';

    // Generate four-layer framework for champion if empathy map exists
    const fourLayerForChampion = primaryChampion?.empathyMap
      ? this._generateFourLayerForChampion(
          stakeholder,
          technicalMetric,
          improvement,
          primaryChampion,
          desertContext,
          customerContext
        )
      : undefined;

    return {
      stakeholder,
      fourLayerForChampion,
      championEnablement: {
        talkingPoints: fourLayerForChampion
          ? fourLayerForChampion.strategicPainRisk
          : this._generateChampionTalkingPoints(
              stakeholder,
              technicalMetric,
              improvement,
              championName,
              customerContext
            ),
        emailTemplate: this._generateChampionEmailTemplate(
          stakeholder,
          technicalMetric,
          improvement,
          championName,
          customerContext
        ),
        presentationSlides: `Champion Enablement: What ${championName} should tell the ${stakeholder} about ${improvement} in ${technicalMetric}`,
        objectionHandling: this._generateStakeholderObjections(stakeholder),
        keyMetrics: this._getStakeholderDecisionCriteria(stakeholder),
        decisionCriteria: this._getStakeholderDecisionCriteria(stakeholder)
      }
    };
  }

  /**
   * Generate champion talking points for internal stakeholders
   */
  private _generateChampionTalkingPoints(
    stakeholder: 'CFO' | 'COO' | 'CTO',
    technicalMetric: string,
    improvement: string,
    championName: string,
    customerContext?: TranslationInput['customerContext']
  ): string {
    const customerName = customerContext?.name || 'our organization';

    if (stakeholder === 'CFO') {
      return `${championName} should tell the CFO: "This ${improvement} improvement in ${technicalMetric} will reduce our operational costs by 20-30% within 6 months. Based on our current volume, that's approximately $X in annual savings. The ROI is clear and measurable."`;
    }

    if (stakeholder === 'COO') {
      return `${championName} should tell the COO: "This solution will improve our operational efficiency by ${improvement} in ${technicalMetric}. This means we can handle 2-3x current volume without proportional staff increases, directly supporting our scaling goals."`;
    }

    if (stakeholder === 'CTO') {
      return `${championName} should tell the CTO: "This ${improvement} improvement in ${technicalMetric} reduces our technical debt and improves system reliability. It's a proven solution with minimal integration risk and clear performance benefits."`;
    }

    return `${championName} should emphasize the measurable business impact and low implementation risk to the ${stakeholder}.`;
  }

  /**
   * Generate champion email template for internal stakeholders
   */
  private _generateChampionEmailTemplate(
    stakeholder: 'CFO' | 'COO' | 'CTO',
    technicalMetric: string,
    improvement: string,
    championName: string,
    customerContext?: TranslationInput['customerContext']
  ): string {
    const customerName = customerContext?.name || 'our organization';

    return `Subject: Recommendation: ${improvement} improvement in ${technicalMetric} for ${customerName}

Hi [${stakeholder} name],

I've been evaluating solutions to improve our ${technicalMetric} and found one that delivers ${improvement} improvement.

Key benefits for ${customerName}:
• Measurable performance improvement
• Low implementation risk
• Clear ROI within 6 months
• Proven track record with similar companies

I recommend we move forward with this solution. Happy to discuss the details and answer any questions.

Best,
${championName}`;
  }

  /**
   * Generate common objections for each stakeholder
   */
  private _generateStakeholderObjections(stakeholder: 'CFO' | 'COO' | 'CTO'): string[] {
    const objections: Record<string, string[]> = {
      'CFO': [
        "What's the total cost of ownership?",
        "How do we measure ROI?",
        "What's the payback period?",
        "Are there hidden costs?"
      ],
      'COO': [
        "How disruptive is the implementation?",
        "What's the learning curve for our team?",
        "How does this integrate with existing processes?",
        "What's the maintenance overhead?"
      ],
      'CTO': [
        "How does this integrate with our current tech stack?",
        "What's the security and compliance impact?",
        "How do we handle data migration?",
        "What's the technical support model?"
      ]
    };

    return objections[stakeholder] || ["What's the implementation timeline?", "How do we measure success?"];
  }

  /**
   * Get decision criteria for each stakeholder
   */
  private _getStakeholderDecisionCriteria(stakeholder: 'CFO' | 'COO' | 'CTO'): string[] {
    const criteria: Record<string, string[]> = {
      'CFO': ['ROI calculation', 'Cost-benefit analysis', 'Budget approval', 'Financial risk assessment'],
      'COO': ['Operational impact', 'Implementation timeline', 'Team readiness', 'Process integration'],
      'CTO': ['Technical feasibility', 'Integration requirements', 'Security compliance', 'Performance metrics']
    };

    return criteria[stakeholder] || ['Business impact', 'Implementation risk', 'Success metrics'];
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

const technicalTranslationService = new TechnicalTranslationService();
export default technicalTranslationService;

// Example usage:
/*
const translation = technicalTranslationService.translateTechnicalMetric({
  technicalMetric: 'processing_speed',
  improvement: '10x faster',
  industry: 'healthcare',
  targetStakeholder: 'CFO',
  customerContext: {
    name: 'MedGlobal',
    industry: 'Healthcare',
    size: 'Enterprise',
    painPoint: 'Quarterly reporting overhead',
  },
  competitorClaim: '40% cost reduction',
});

// Result: Reduces quarterly reporting from 6 weeks to 3 days
// Plus stakeholder-specific talking points, ROI calculations, and competitive positioning
*/
