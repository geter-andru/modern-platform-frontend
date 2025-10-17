/** AIIntegrationTemplates - TypeScript Migration
 *
 * AI integration templates for Claude, ChatGPT, and other AI platforms
 * Generates prompts, personas, and conversation scripts using ICP and business case intelligence
 * Migrated from legacy platform with enhanced TypeScript type safety
 */

// ==========================================
// DATA INPUT INTERFACES
// ==========================================

export interface ICPData {
  buyerPersona?: BuyerPersona;
  personaTypes?: PersonaType[];
  painPoints?: string[];
  decisionMakingProcess?: string;
  industry?: string;
  conversationFrameworks?: string[];
  objectionResponses?: string[];
}

export interface BuyerPersona {
  name?: string;
  role?: string;
  demographics?: string;
  painPoints?: string[];
  decisionMaking?: string;
  language?: string;
  objections?: string[] | string;
  motivations?: string[] | string;
  decisionCriteria?: string[] | string;
}

export interface PersonaType {
  name: string;
  id: string;
  description?: string;
  painPoints?: string[];
  goals?: string[];
  communicationStyle?: string;
}

export interface CostData {
  impactCalculation?: {
    methodology?: string;
    results?: string;
    totalImpact?: number;
    annualSavings?: number;
  };
  roi?: number;
  paybackPeriod?: number;
}

export interface BusinessCaseData {
  framework?: {
    executiveSummary?: string;
    financialJustification?: string;
    valueProposition?: string;
    successMetrics?: string[];
    riskAssessment?: string;
  };
  roi?: number;
  paybackPeriod?: number;
}

// ==========================================
// PROMPT TEMPLATE INTERFACES
// ==========================================

export interface PromptTemplate {
  id: string;
  name: string;
  type: 'prospect_research' | 'value_proposition' | 'business_case' | 'objection_handling' | 'discovery';
  prompt: string;
  variables: string[];
  aiPlatform: 'claude' | 'chatgpt' | 'generic';
  optimizationNotes?: string;
}

export interface ClaudePrompts {
  prospectResearchPrompt: string;
  valuePropositionPrompt: string;
  businessCasePrompt: string;
  objectionHandlingPrompt: string;
  discoveryPrompt: string;
}

// ==========================================
// AI PERSONA INTERFACES
// ==========================================

export interface PersonaBrief {
  name: string;
  role: string;
  aiInstructions: string;
  conversationStarters: string[];
  objectionHandling: string[];
  rolePlayingPrompt: string;
  validationPrompt: string;
  metadata?: {
    communicationStyle?: string;
    decisionCriteria?: string[];
    motivations?: string[];
    concerns?: string[];
  };
}

export interface AIPersonas {
  buyerPersona: PersonaBrief;
  alternatePersonas?: PersonaBrief[];
}

// ==========================================
// CONVERSATION SCRIPT INTERFACES
// ==========================================

export interface ConversationPhase {
  phase: string;
  duration: string;
  script: string;
  notes: string;
  objective?: string;
}

export interface ConversationScript {
  title: string;
  objective: string;
  totalDuration?: string;
  structure: ConversationPhase[];
  metadata?: {
    scenarioType?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    prerequisites?: string[];
  };
}

export interface ConversationScripts {
  discoveryScript: ConversationScript;
  objectionHandlingScript: {
    title: string;
    objective: string;
    responses: {
      budget: string;
      timing: string;
      authority: string;
      competition: string;
      [key: string]: string;
    };
  };
}

// ==========================================
// SERVICE RESPONSE INTERFACES
// ==========================================

export interface AIIntegrationResult {
  success: boolean;
  data?: {
    prompts?: ClaudePrompts;
    personas?: AIPersonas;
    scripts?: ConversationScripts;
  };
  error?: string;
  metadata?: {
    aiPlatform: 'claude' | 'chatgpt' | 'generic';
    templateCount: number;
    timestamp: string;
  };
}

export interface PromptValidationResult {
  isValid: boolean;
  error: string | null;
  warnings?: string[];
}

// ==========================================
// AI INTEGRATION TEMPLATES CLASS
// ==========================================

export class AIIntegrationTemplates {

  // ==========================================
  // CLAUDE/CHATGPT PROMPT GENERATION
  // ==========================================

  public generateClaudePrompts(
    icpData: ICPData,
    costData?: CostData,
    businessCaseData?: BusinessCaseData
  ): AIIntegrationResult {
    try {
      // Validate input
      const validation = this.validatePromptData({ icpData, costData, businessCaseData });
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || 'Validation failed'
        };
      }

      // Safe data extraction with fallbacks
      const buyerPersona = icpData?.buyerPersona || {};
      const demographics = buyerPersona.demographics || 'Target buyer demographics';
      const painPoints = Array.isArray(buyerPersona.painPoints)
        ? buyerPersona.painPoints.join(', ')
        : buyerPersona.painPoints || 'Key pain points';
      const decisionMaking = buyerPersona.decisionMaking || 'Decision-making process';

      const impactCalculation = costData?.impactCalculation || {};
      const methodology = impactCalculation.methodology || 'Financial impact methodology';
      const results = impactCalculation.results || 'Impact analysis results';

      const framework = businessCaseData?.framework || {};
      const executiveSummary = framework.executiveSummary || 'Executive summary framework';
      const financialJustification = framework.financialJustification || 'Financial justification structure';
      const riskAssessment = framework.riskAssessment || 'Risk assessment methodology';

      // Generate all 5 prompt types
      const prompts: ClaudePrompts = {
        prospectResearchPrompt: this.generateProspectResearchPrompt(icpData),
        valuePropositionPrompt: this.generateValuePropositionPrompt(icpData, costData),
        businessCasePrompt: this.generateBusinessCasePrompt(businessCaseData),
        objectionHandlingPrompt: this.generateObjectionHandlingPrompt(icpData),
        discoveryPrompt: this.generateDiscoveryPrompt(icpData)
      };

      return {
        success: true,
        data: { prompts },
        metadata: {
          aiPlatform: 'claude',
          templateCount: 5,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Error generating Claude prompts:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public generateProspectResearchPrompt(icpData: ICPData): string {
    const buyerPersona = icpData?.buyerPersona || {};
    const demographics = buyerPersona.demographics || 'Target buyer demographics';
    const painPoints = Array.isArray(buyerPersona.painPoints)
      ? buyerPersona.painPoints.join(', ')
      : buyerPersona.painPoints || 'Key pain points';
    const decisionMaking = buyerPersona.decisionMaking || 'Decision-making process';

    return `You are a sales research specialist. Using this systematic buyer intelligence:

TARGET BUYER PROFILE:
Demographics: ${demographics}
Pain Points: ${painPoints}
Decision Making: ${decisionMaking}

Research [COMPANY_NAME] and provide:
1. Fit score (1-10) based on our ICP criteria
2. Specific pain points they likely experience based on our buyer intelligence
3. Key stakeholders to target based on decision-making patterns
4. Recommended approach strategy aligned with buyer preferences

Company to research: [INSERT_COMPANY_URL]
Industry context: [INSERT_INDUSTRY]

Format your response with clear sections and actionable insights.`;
  }

  public generateValuePropositionPrompt(icpData: ICPData, costData?: CostData): string {
    const impactCalculation = costData?.impactCalculation || {};
    const methodology = impactCalculation.methodology || 'Financial impact methodology';
    const results = impactCalculation.results || 'Impact analysis results';

    return `You are a technical value translator. Using our financial impact model:

OUR SOLUTION IMPACT:
Methodology: ${methodology}
Results: ${results}

For [PROSPECT_COMPANY], translate our technical capabilities into:
1. Industry-specific business outcomes that resonate with their stakeholders
2. Quantified financial benefits using our proven calculation methods
3. Risk mitigation value addressing their specific concerns
4. Competitive advantages that matter to their decision criteria

Their industry: [INSERT_INDUSTRY]
Their challenges: [INSERT_CHALLENGES]
Their decision timeline: [INSERT_TIMELINE]

Use business language that speaks to executives and financial stakeholders.`;
  }

  public generateBusinessCasePrompt(businessCaseData?: BusinessCaseData): string {
    const framework = businessCaseData?.framework || {};
    const executiveSummary = framework.executiveSummary || 'Executive summary framework';
    const financialJustification = framework.financialJustification || 'Financial justification structure';
    const riskAssessment = framework.riskAssessment || 'Risk assessment methodology';

    return `You are an executive business case writer. Using our proven framework:

FRAMEWORK STRUCTURE:
Executive Summary: ${executiveSummary}
Financial Justification: ${financialJustification}
Risk Assessment: ${riskAssessment}

Create a business case for [PROSPECT_COMPANY] that includes:
1. Executive summary (C-suite focused, results-oriented)
2. Financial ROI projections with clear payback timeline
3. Implementation roadmap with realistic milestones
4. Risk mitigation strategies addressing common concerns

Prospect context: [INSERT_PROSPECT_CONTEXT]
Budget range: [INSERT_BUDGET_RANGE]
Implementation timeline: [INSERT_TIMELINE]

Keep language professional and benefit-focused for executive audiences.`;
  }

  public generateObjectionHandlingPrompt(icpData: ICPData): string {
    const buyerPersona = icpData?.buyerPersona || {};
    const painPoints = Array.isArray(buyerPersona.painPoints)
      ? buyerPersona.painPoints.join(', ')
      : buyerPersona.painPoints || 'Key concerns';
    const decisionMaking = buyerPersona.decisionMaking || 'Decision-making style';

    return `You are a sales conversation specialist. Using our buyer intelligence:

BUYER PROFILE:
Key Concerns: ${painPoints}
Decision Style: ${decisionMaking}

For the objection: "[INSERT_OBJECTION]"

Provide:
1. Root cause analysis of this objection based on buyer psychology
2. Empathetic acknowledgment that builds trust
3. Evidence-based response using our success data
4. Forward momentum question to continue the conversation

Keep responses consultative and focused on the buyer's success.`;
  }

  public generateDiscoveryPrompt(icpData: ICPData): string {
    const buyerPersona = icpData?.buyerPersona || {};
    const demographics = buyerPersona.demographics || 'Target buyer profile';
    const painPoints = Array.isArray(buyerPersona.painPoints)
      ? buyerPersona.painPoints.join(', ')
      : buyerPersona.painPoints || 'Known pain points';
    const decisionMaking = buyerPersona.decisionMaking || 'Decision process';

    return `You are a discovery conversation specialist. Using our buyer intelligence:

IDEAL BUYER PROFILE:
Target Profile: ${demographics}
Known Pain Points: ${painPoints}
Decision Process: ${decisionMaking}

Create discovery questions for [PROSPECT_COMPANY] that:
1. Uncover their specific version of our known pain points
2. Quantify the business impact of their challenges
3. Identify all stakeholders in their decision process
4. Establish urgency and timeline for resolution

Structure as open-ended questions that encourage detailed responses and build trust.`;
  }

  // ==========================================
  // AI PERSONA DEVELOPMENT
  // ==========================================

  public generateAIPersonas(icpData: ICPData): AIIntegrationResult {
    try {
      const buyerPersona = icpData?.buyerPersona || {};
      const name = buyerPersona.name || 'Target Buyer';
      const role = buyerPersona.role || 'Decision Maker';
      const language = buyerPersona.language || 'professional business terminology';

      // Handle different formats for objections, motivations, decisionCriteria
      const objections = Array.isArray(buyerPersona.objections)
        ? buyerPersona.objections
        : (buyerPersona.objections ? [buyerPersona.objections] : ['budget concerns', 'timing issues']);

      const motivations = Array.isArray(buyerPersona.motivations)
        ? buyerPersona.motivations
        : (buyerPersona.motivations ? [buyerPersona.motivations] : ['efficiency gains', 'cost reduction']);

      const decisionCriteria = Array.isArray(buyerPersona.decisionCriteria)
        ? buyerPersona.decisionCriteria
        : (buyerPersona.decisionCriteria ? [buyerPersona.decisionCriteria] : ['ROI', 'implementation ease']);

      const conversationFrameworks = icpData?.conversationFrameworks || [
        'Tell me about your current process for...',
        'How do you currently handle...',
        'What challenges do you face with...'
      ];

      const objectionResponses = icpData?.objectionResponses || [
        'I understand that concern. Many of our clients initially felt the same way...',
        "That's a great question. Let me share how we've addressed this for similar companies...",
        "I appreciate you bringing that up. Here's what we've learned..."
      ];

      const personaBrief: PersonaBrief = {
        name: name,
        role: role,
        aiInstructions: `When role-playing as this buyer persona:
- Use terminology: ${language}
- Express concerns about: ${objections.join(', ')}
- Show interest in: ${motivations.join(', ')}
- Make decisions based on: ${decisionCriteria.join(', ')}
- Respond with realistic business context and appropriate skepticism
- Ask follow-up questions that real buyers would ask
- Demonstrate understanding of industry challenges`,
        conversationStarters: conversationFrameworks,
        objectionHandling: objectionResponses,
        rolePlayingPrompt: `You are role-playing as ${name}, a ${role}. You are evaluating business solutions and want to make informed decisions that benefit your organization.

Key characteristics:
- Decision criteria: ${decisionCriteria.join(', ')}
- Primary concerns: ${objections.join(', ')}
- What motivates you: ${motivations.join(', ')}
- Communication style: ${language}

Respond as this persona would in a business conversation, asking realistic questions and raising appropriate concerns.`,
        validationPrompt: `You are ${name}, a ${role} who has been asked to validate a business solution.

Your perspective:
- You need to see clear business value: ${motivations.join(', ')}
- You have concerns about: ${objections.join(', ')}
- You evaluate solutions based on: ${decisionCriteria.join(', ')}

Review this proposal and respond with the questions and concerns you would genuinely have as this buyer persona.`,
        metadata: {
          communicationStyle: language,
          decisionCriteria: decisionCriteria,
          motivations: motivations,
          concerns: objections
        }
      };

      return {
        success: true,
        data: {
          personas: {
            buyerPersona: personaBrief
          }
        },
        metadata: {
          aiPlatform: 'generic',
          templateCount: 1,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Error generating AI personas:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public generateBuyerPersona(personaType: PersonaType): PersonaBrief {
    const objections = personaType.painPoints || ['budget', 'timing', 'implementation complexity'];
    const motivations = personaType.goals || ['improve efficiency', 'reduce costs', 'scale operations'];
    const communicationStyle = personaType.communicationStyle || 'professional business terminology';

    return {
      name: personaType.name,
      role: personaType.description || 'Business decision maker',
      aiInstructions: `Role-play as ${personaType.name} with ${communicationStyle}. Express concerns about ${objections.join(', ')}.`,
      conversationStarters: [
        `Tell me about your approach to ${personaType.name.toLowerCase()} solutions`,
        'How does this compare to what we\'re currently doing?',
        'What kind of results have you seen with similar companies?'
      ],
      objectionHandling: [
        'I need to understand the business impact first',
        'How long does implementation typically take?',
        'What about integration with our existing systems?'
      ],
      rolePlayingPrompt: `You are ${personaType.name}. You evaluate solutions based on practical business value and are cautious about new investments.`,
      validationPrompt: `Review this proposal as ${personaType.name} would, focusing on ${motivations.join(', ')}.`,
      metadata: {
        communicationStyle: communicationStyle,
        decisionCriteria: ['ROI', 'ease of implementation', 'proven results'],
        motivations: motivations,
        concerns: objections
      }
    };
  }

  // ==========================================
  // CONVERSATION SCRIPT GENERATION
  // ==========================================

  public generateConversationScripts(
    icpData: ICPData,
    businessCaseData?: BusinessCaseData
  ): AIIntegrationResult {
    try {
      const buyerPersona = icpData?.buyerPersona || {};
      const painPoints = Array.isArray(buyerPersona.painPoints)
        ? buyerPersona.painPoints
        : [buyerPersona.painPoints || 'operational challenges'];

      const framework = businessCaseData?.framework || {};
      const valueProposition = framework.valueProposition || 'Our solution provides significant business value';

      const discoveryScript = this.generateDiscoveryScript(icpData);
      const objectionHandlingScript = this.generateObjectionHandlingScript(icpData);

      return {
        success: true,
        data: {
          scripts: {
            discoveryScript,
            objectionHandlingScript
          }
        },
        metadata: {
          aiPlatform: 'generic',
          templateCount: 2,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Error generating conversation scripts:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public generateDiscoveryScript(icpData: ICPData): ConversationScript {
    const buyerPersona = icpData?.buyerPersona || {};
    const painPoints = Array.isArray(buyerPersona.painPoints)
      ? buyerPersona.painPoints
        : [buyerPersona.painPoints || 'operational challenges'];
    const industry = icpData?.industry || 'your industry';

    return {
      title: 'Discovery Conversation Flow',
      objective: 'Uncover specific pain points and quantify business impact',
      totalDuration: '25-30 minutes',
      structure: [
        {
          phase: 'Opening',
          duration: '2-3 minutes',
          script: `Thank you for taking the time to speak with me. I've done some research on [COMPANY] and your role as [ROLE].

Based on what I've learned about companies in ${industry}, I'm curious about how you're currently handling [PRIMARY_PAIN_POINT].

Before we dive in, could you give me a quick overview of your current [RELEVANT_PROCESS]?`,
          notes: 'Establish credibility and show preparation while opening a natural conversation',
          objective: 'Build rapport and set context'
        },
        {
          phase: 'Pain Discovery',
          duration: '10-15 minutes',
          script: `That's helpful context. I'm hearing [REFLECT_THEIR_SITUATION].

Many organizations we work with face challenges around:
${painPoints.map(point => `- ${point}`).join('\n')}

Which of these resonates most with your experience? Or is there something else that's a bigger concern?

[FOLLOW-UP] Can you help me understand the business impact of [THEIR_PAIN_POINT]? For example, how much time does your team spend on [RELATED_ACTIVITY]?`,
          notes: 'Use known pain points to guide discovery while remaining open to their specific situation',
          objective: 'Identify and quantify specific pain points'
        },
        {
          phase: 'Value Exploration',
          duration: '8-10 minutes',
          script: `I can see how that would be frustrating. What you're describing is exactly what we've helped other ${industry} organizations address.

If you could wave a magic wand and solve [THEIR_PAIN_POINT], what would that mean for your team? Your organization?

[QUANTIFICATION] Is this something that keeps you up at night, or is it more of a nice-to-have improvement?`,
          notes: 'Connect their pain to potential value and establish urgency',
          objective: 'Understand business value and urgency'
        },
        {
          phase: 'Solution Bridge',
          duration: '5-8 minutes',
          script: `Based on what you've shared, I think there could be a really good fit here. We've helped companies like [SIMILAR_COMPANY] achieve [SPECIFIC_RESULT] by [HIGH_LEVEL_APPROACH].

Our approach focuses on [VALUE_PROPOSITION].

Would it be helpful if I showed you how this might work for [COMPANY]?`,
          notes: 'Connect their specific situation to your solution without jumping into a full demo',
          objective: 'Bridge to next steps (demo, proposal, etc.)'
        }
      ],
      metadata: {
        scenarioType: 'discovery_call',
        difficulty: 'intermediate',
        prerequisites: ['ICP research completed', 'Stakeholder identified', 'Meeting scheduled']
      }
    };
  }

  public generateObjectionHandlingScript(icpData: ICPData): ConversationScripts['objectionHandlingScript'] {
    return {
      title: 'Common Objection Responses',
      objective: 'Address concerns while maintaining conversation momentum',
      responses: {
        budget: `I understand budget is always a consideration. Many of our clients initially had the same concern.

What we've found is that the cost of not solving [THEIR_PAIN_POINT] often far exceeds the investment in a solution.

Based on what you've told me about [SPECIFIC_IMPACT], have you calculated what this challenge is currently costing you?`,

        timing: `Timing is definitely important. When you say it's not the right time, help me understand - is that because of other priorities, or because [THEIR_PAIN_POINT] isn't urgent enough yet?

What would need to happen for this to become a priority?`,

        authority: `I appreciate you being upfront about the decision process. Who else would be involved in evaluating something like this?

Would it be helpful if I put together some information that you could share with [DECISION_MAKER]?`,

        competition: `That's great that you're being thorough in your evaluation. What criteria are you using to compare options?

I'd be happy to show you how we're different, but first - what's most important to you in a solution?`
      }
    };
  }

  // ==========================================
  // PROMPT OPTIMIZATION
  // ==========================================

  public optimizePromptForAI(
    basePrompt: string,
    aiType: 'claude' | 'chatgpt' | 'generic' = 'claude'
  ): string {
    try {
      if (!basePrompt || typeof basePrompt !== 'string') {
        return basePrompt;
      }

      const optimizations: Record<string, { prefix: string; structure: string; format: string }> = {
        claude: {
          prefix: 'You are a professional sales specialist with deep expertise in B2B sales. ',
          structure: 'Think step by step and provide detailed, actionable insights.',
          format: 'Format your response with clear headings and bullet points for easy reading.'
        },
        chatgpt: {
          prefix: 'As an experienced B2B sales professional, ',
          structure: 'Analyze this systematically and provide practical recommendations.',
          format: 'Use numbered lists and clear sections in your response.'
        },
        generic: {
          prefix: 'Using your expertise in B2B sales, ',
          structure: 'Provide detailed analysis and actionable recommendations.',
          format: 'Structure your response clearly with headings and examples.'
        }
      };

      const optimization = optimizations[aiType] || optimizations.generic;

      return `${optimization.prefix}${basePrompt}

${optimization.structure}

${optimization.format}`;

    } catch (error) {
      console.error('Error optimizing prompt:', error);
      return basePrompt;
    }
  }

  public addClaudeOptimizations(prompt: string): string {
    return this.optimizePromptForAI(prompt, 'claude');
  }

  public addChatGPTOptimizations(prompt: string): string {
    return this.optimizePromptForAI(prompt, 'chatgpt');
  }

  // ==========================================
  // VARIABLE REPLACEMENT SYSTEM
  // ==========================================

  public replacePromptVariables(
    prompt: string,
    variables: Record<string, string>
  ): string {
    try {
      let processedPrompt = prompt;

      // Standard variable replacements
      const standardVariables: Record<string, string> = {
        '[COMPANY_NAME]': variables.companyName || '[COMPANY_NAME]',
        '[PROSPECT_CONTEXT]': variables.prospectContext || '[PROSPECT_CONTEXT]',
        '[INDUSTRY]': variables.industry || '[INDUSTRY]',
        '[CHALLENGES]': variables.challenges || '[CHALLENGES]',
        '[TIMELINE]': variables.timeline || '[TIMELINE]',
        '[BUDGET_RANGE]': variables.budgetRange || '[BUDGET_RANGE]',
        '[INSERT_COMPANY_URL]': variables.companyUrl || '[INSERT_COMPANY_URL]',
        '[INSERT_OBJECTION]': variables.objection || '[INSERT_OBJECTION]',
        '[INSERT_INDUSTRY]': variables.industry || '[INSERT_INDUSTRY]',
        '[INSERT_CHALLENGES]': variables.challenges || '[INSERT_CHALLENGES]',
        '[INSERT_TIMELINE]': variables.timeline || '[INSERT_TIMELINE]',
        '[INSERT_PROSPECT_CONTEXT]': variables.prospectContext || '[INSERT_PROSPECT_CONTEXT]',
        '[INSERT_BUDGET_RANGE]': variables.budgetRange || '[INSERT_BUDGET_RANGE]',
        '[PROSPECT_COMPANY]': variables.companyName || '[PROSPECT_COMPANY]'
      };

      // Replace each variable (only if replacement value is different from placeholder)
      Object.entries(standardVariables).forEach(([placeholder, value]) => {
        if (value !== placeholder) {
          processedPrompt = processedPrompt.replace(new RegExp(placeholder.replace(/[[\]]/g, '\\$&'), 'g'), value);
        }
      });

      return processedPrompt;

    } catch (error) {
      console.error('Error replacing prompt variables:', error);
      return prompt;
    }
  }

  public extractVariables(prompt: string): string[] {
    try {
      const variablePattern = /\[([A-Z_]+)\]/g;
      const matches = prompt.match(variablePattern);
      return matches ? [...new Set(matches)] : [];
    } catch (error) {
      console.error('Error extracting variables:', error);
      return [];
    }
  }

  public validateVariables(
    prompt: string,
    providedVariables: Record<string, string>
  ): { missing: string[]; unused: string[] } {
    try {
      const requiredVariables = this.extractVariables(prompt);
      const providedKeys = Object.keys(providedVariables).map(key => `[${key}]`);

      const missing = requiredVariables.filter(variable => !providedKeys.includes(variable));
      const unused = providedKeys.filter(key => !requiredVariables.includes(key));

      return { missing, unused };
    } catch (error) {
      console.error('Error validating variables:', error);
      return { missing: [], unused: [] };
    }
  }

  // ==========================================
  // VALIDATION & HELPERS
  // ==========================================

  public validatePromptData(data: {
    icpData?: ICPData;
    costData?: CostData;
    businessCaseData?: BusinessCaseData;
  }): PromptValidationResult {
    try {
      if (!data || typeof data !== 'object') {
        return { isValid: false, error: 'Invalid data provided' };
      }

      // Check for required data structure
      if (!data.icpData && !data.costData && !data.businessCaseData) {
        return {
          isValid: false,
          error: 'At least one data source (ICP, cost, or business case) is required'
        };
      }

      return { isValid: true, error: null };

    } catch (error) {
      console.error('Error validating prompt data:', error);
      return { isValid: false, error: 'Validation error occurred' };
    }
  }

  public validatePromptTemplate(template: PromptTemplate): PromptValidationResult {
    const warnings: string[] = [];

    if (!template) {
      return { isValid: false, error: 'Template is required', warnings };
    }

    if (!template.prompt || template.prompt.trim().length === 0) {
      return { isValid: false, error: 'Prompt text is required', warnings };
    }

    if (template.prompt.length < 50) {
      warnings.push('Prompt is very short - consider adding more context');
    }

    if (!template.variables || template.variables.length === 0) {
      warnings.push('No variables defined - prompt may not be very flexible');
    }

    return { isValid: true, error: null, warnings };
  }

  // ==========================================
  // DEFAULT FALLBACK TEMPLATES
  // ==========================================

  private getDefaultPrompts(): ClaudePrompts {
    return {
      prospectResearchPrompt: `You are a sales research specialist. Research [COMPANY_NAME] and provide:
1. Business overview and key challenges
2. Potential fit for our solution (1-10 score)
3. Key stakeholders to target
4. Recommended approach strategy

Company URL: [INSERT_COMPANY_URL]`,

      valuePropositionPrompt: `You are a value communication specialist. For [PROSPECT_COMPANY]:
1. Identify their likely business challenges
2. Translate our capabilities into their business outcomes
3. Quantify potential benefits
4. Address likely concerns

Industry: [INSERT_INDUSTRY]`,

      businessCasePrompt: `Create a business case for [PROSPECT_COMPANY] including:
1. Executive summary
2. Financial projections
3. Implementation plan
4. Risk mitigation

Context: [INSERT_PROSPECT_CONTEXT]`,

      objectionHandlingPrompt: `Address the objection "[INSERT_OBJECTION]" by:
1. Understanding the root cause
2. Acknowledging their concern
3. Providing evidence-based response
4. Moving the conversation forward`,

      discoveryPrompt: `Create discovery questions for [PROSPECT_COMPANY] that:
1. Uncover pain points
2. Quantify business impact
3. Identify stakeholders
4. Establish urgency`
    };
  }

  private getDefaultPersona(): PersonaBrief {
    return {
      name: 'Business Decision Maker',
      role: 'Director/VP Level',
      aiInstructions: 'Role-play as a cautious but open business decision maker who evaluates solutions based on ROI and business impact.',
      conversationStarters: ['Tell me about your solution', 'How does this work?', 'What are the costs?'],
      objectionHandling: ['I need to see clear ROI', 'What about implementation time?', 'How do you compare to alternatives?'],
      rolePlayingPrompt: 'You are a business decision maker evaluating solutions for practical business value.',
      validationPrompt: 'Review this proposal with a focus on ROI, implementation ease, and proven results.',
      metadata: {
        communicationStyle: 'professional business terminology',
        decisionCriteria: ['ROI', 'ease of implementation'],
        motivations: ['efficiency gains', 'cost reduction'],
        concerns: ['budget', 'implementation complexity']
      }
    };
  }

  private getDefaultScripts(): ConversationScripts {
    return {
      discoveryScript: {
        title: 'Basic Discovery Flow',
        objective: 'Understand prospect needs and challenges',
        structure: [
          {
            phase: 'Opening',
            duration: '2-3 minutes',
            script: 'Thank you for your time. Tell me about your current challenges.',
            notes: 'Start with open-ended questions'
          }
        ]
      },
      objectionHandlingScript: {
        title: 'Common Objections',
        objective: 'Address standard objections',
        responses: {
          budget: 'Let\'s discuss the ROI and payback period.',
          timing: 'What would make this the right time?',
          authority: 'Who else should be involved in this discussion?',
          competition: 'What criteria are most important to you?'
        }
      }
    };
  }
}

// Create and export singleton instance
const aiIntegrationTemplates = new AIIntegrationTemplates();

export default aiIntegrationTemplates;
