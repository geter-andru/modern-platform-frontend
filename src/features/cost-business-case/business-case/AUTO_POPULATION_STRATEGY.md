# Business Case Auto-Population Strategy

## Overview

This document defines the comprehensive strategy for auto-populating the one-page Business Case Builder from:
1. **ICP Analysis** data (buyer personas, pain points, demographics)
2. **Cost Calculator** results (cost of inaction, ROI projections)
3. **User-provided** contextual information
4. **AI-generated** narrative and synthesis

## Data Flow Architecture

```
┌─────────────────┐
│  ICP Analysis   │──┐
│  (icp-types.ts) │  │
└─────────────────┘  │
                     ├──→ ┌──────────────────────┐     ┌─────────────────┐
┌─────────────────┐  │    │  Auto-Population     │────→│  Business Case  │
│ Cost Calculator │──┤    │  Engine              │     │  Template       │
│ (CostData)      │  │    │  (AI + Mappings)     │     │  (7 Sections)   │
└─────────────────┘  │    └──────────────────────┘     └─────────────────┘
                     │              ↑
┌─────────────────┐  │              │
│ User Input      │──┘              │
│ (Context)       │                 │
└─────────────────┘    ┌────────────┴──────────┐
                       │  Field Metadata       │
                       │  Tracking System      │
                       └───────────────────────┘
```

---

## SECTION 1: HEADER - Auto-Population Mappings

### Fields

| Field | Source | Mapping Logic | Fallback |
|-------|--------|---------------|----------|
| `priorityHeadline` | **AI-Generated** | Generate from: executiveSummary.businessChange + strategicOutcome | User edits |
| `championName` | **User-Provided** | Manual input required | Empty |
| `championTitle` | **User-Provided** | Manual input required | Empty |
| `partnerName` | **User-Provided** | Manual input (salesperson name) | Empty |
| `partnerCompany` | **User-Provided** | Manual input (your company name) | Empty |
| `companyName` | **ICP** → `ICPData.companyName` | Direct mapping | User-provided |
| `generatedDate` | **System** | `new Date()` at creation time | N/A |

### AI Generation Prompt for `priorityHeadline`

```typescript
const headlinePrompt = `
You are creating a priority-driven, executive-level headline for a business case.

Context:
- Company: ${header.companyName}
- Business Change: ${executiveSummary.businessChange}
- Strategic Outcome: ${executiveSummary.strategicOutcome}
- Timeline: ${executiveSummary.implementationTimeline}

Generate a compelling headline (10-15 words) that:
1. Starts with a strong action verb
2. Quantifies the business impact
3. Creates executive urgency
4. Follows this pattern: "[Action] to [Outcome] by [Timeline]: [Quantified Impact]"

Examples:
- "Scale from $2M to $10M ARR in 18 months: Revenue Intelligence Implementation"
- "Eliminate $500K Annual Revenue Leakage: Systematic Deal Qualification Framework"
- "Accelerate Enterprise Sales by 40%: Automated Business Case Generation"

Generate headline:
`;
```

---

## SECTION 2: EXECUTIVE SUMMARY - Auto-Population Mappings

### Fields

| Field | Source | Mapping Logic | Confidence |
|-------|--------|---------------|------------|
| `businessChange` | **ICP** + **User** | ICP buyer painPoints[0] OR user input | 70% ICP, 100% User |
| `recommendedSolution` | **User-Provided** | Your product/service description | 100% |
| `implementationTimeline` | **User-Provided** | Deployment timeline (e.g., "Q2 2025") | 100% |
| `currentCostPain` | **Cost Calculator** → `totalCost` | Format: "Eliminate $XXX,XXX in delayed revenue and competitive losses" | 95% |
| `strategicOutcome` | **ICP** + **User** | ICP buyer goals[0] OR user input | 70% ICP, 100% User |
| `executiveGoal` | **ICP** → `buyerPersonas[0].goals[0]` | Map from CEO/Founder buyer persona | 80% |
| `fullSummary` | **AI-Generated** | Synthesize all above fields into template format | 90% |

### Detailed Mapping: Cost Calculator → `currentCostPain`

```typescript
// From SimplifiedCostCalculator.tsx CostData interface
const costData = {
  delayedRevenue: number,        // Maps to "delayed revenue" phrase
  competitorAdvantage: number,   // Maps to "competitive losses" phrase
  teamEfficiency: number,        // Maps to "productivity costs" phrase
  marketOpportunity: number      // Maps to "missed opportunities" phrase
};

const timeframe = 6; // months
const totalCost = (delayedRevenue + competitorAdvantage + teamEfficiency + marketOpportunity) * timeframe;

// Auto-population logic
executiveSummary.currentCostPain = `$${(totalCost / 1000).toFixed(0)}K in delayed revenue, competitive losses, and missed market opportunities`;
```

### AI Generation Prompt for `fullSummary`

```typescript
const summaryPrompt = `
Generate an executive summary following this exact template:

"Because [businessChange], [companyName] should implement [recommendedSolution] by [implementationTimeline]. This eliminates [currentCostPain] while enabling [strategicOutcome] that directly supports [executiveGoal]."

Context:
- Business Change: ${executiveSummary.businessChange}
- Company: ${header.companyName}
- Solution: ${executiveSummary.recommendedSolution}
- Timeline: ${executiveSummary.implementationTimeline}
- Current Cost/Pain: ${executiveSummary.currentCostPain}
- Strategic Outcome: ${executiveSummary.strategicOutcome}
- Executive Goal: ${executiveSummary.executiveGoal}

Requirements:
1. Use professional, confident language
2. Quantify wherever possible
3. Maintain 2-3 sentences maximum
4. Emphasize urgency without being pushy

Generate summary:
`;
```

---

## SECTION 3: BUSINESS CHALLENGE - Auto-Population Mappings

### Fields

| Field | Source | Mapping Logic | Confidence |
|-------|--------|---------------|------------|
| `currentRealityDescription` | **ICP** → `buyerPersonas[0].painPoints[0]` | Top buyer pain point as current reality | 75% |
| `frequency` | **Cost Calculator** + **User** | Derived from timeframe (monthly, quarterly) | 60% |
| `affectedCount` | **ICP** → `demographics.companySize` | Parse company size to employee count | 65% |
| `affectedStakeholders` | **ICP** → `buyerPersonas` roles | Concatenate buyer persona titles | 85% |
| `specificProblem` | **ICP** → `buyerPersonas[0].painPoints[0]` | Primary pain point description | 80% |
| `dollarCost` | **Cost Calculator** → `totalCost` | Direct mapping from cost calculation | 95% |
| `consequenceTimeline` | **User-Provided** | Manual input (e.g., "Q4 2025") | 100% |
| `consequence` | **ICP** + **AI** | Buyer's fears + competitive consequences | 70% |
| `fullCostOfStatusQuo` | **AI-Generated** | Synthesize all above into narrative | 85% |

### Detailed Mapping: ICP → `affectedStakeholders`

```typescript
// From icp-types.ts BuyerPersona interface
const buyerPersonas: BuyerPersona[] = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-Founder",
    title: "Chief Executive Officer",
    demographics: {
      companySize: "50-100 employees", // Maps to affectedCount
      // ...
    },
    painPoints: [
      "Cannot accurately forecast revenue pipeline", // Maps to specificProblem
      "Losing enterprise deals to competitors"
    ],
    // ...
  },
  {
    name: "Marcus Rodriguez",
    role: "VP Sales",
    title: "Vice President of Sales",
    // ...
  }
];

// Auto-population logic
businessChallenge.affectedStakeholders = buyerPersonas.map(p => p.role).join(", ");
// Output: "CEO & Co-Founder, VP Sales, Head of Revenue Operations"

businessChallenge.affectedCount = parseInt(buyerPersonas[0].demographics.companySize.split("-")[0]);
// Output: 50 (from "50-100 employees")
```

### AI Generation Prompt for `fullCostOfStatusQuo`

```typescript
const costOfStatusQuoPrompt = `
Generate a "Cost of Status Quo" narrative following this template:

"Every [frequency], [affectedCount] [affectedStakeholders] experience [specificProblem], costing $[dollarCost]. Without action by [consequenceTimeline], [consequence using champion's language]."

Context:
- Frequency: ${businessChallenge.frequency}
- Affected Count: ${businessChallenge.affectedCount}
- Affected Stakeholders: ${businessChallenge.affectedStakeholders}
- Specific Problem: ${businessChallenge.specificProblem}
- Dollar Cost: ${businessChallenge.dollarCost}
- Consequence Timeline: ${businessChallenge.consequenceTimeline}
- Consequence: ${businessChallenge.consequence}

Requirements:
1. Use champion's authentic language (avoid consultant-speak)
2. Quantify the cost precisely
3. Create urgency with the timeline
4. Make the consequence tangible and specific

Generate narrative:
`;
```

---

## SECTION 4: APPROACH & DIFFERENTIATION - Auto-Population Mappings

### Fields

| Field | Source | Mapping Logic | Confidence |
|-------|--------|---------------|------------|
| `discoveryStakeholders` | **ICP** → `buyerPersonas[].name` | Extract all buyer persona names | 90% |
| `capability1` | **User-Provided** | Manual input for 4 capabilities | 100% |
| `capability2` | **User-Provided** | Manual input | 100% |
| `capability3` (Differentiator) | **User-Provided** | Manual input | 100% |
| `capability4` (Implementation) | **User-Provided** | Manual input | 100% |
| `phaseFramework.phase1` | **User-Provided** + **ICP** | Immediate wins based on painPoints | 70% |
| `phaseFramework.phase2` | **User-Provided** + **ICP** | Committee concerns from decisionInfluence | 65% |
| `phaseFramework.phase3` | **User-Provided** + **ICP** | Strategic outcomes from goals | 70% |
| `fullRecommendedSolution` | **AI-Generated** | Synthesize capabilities into narrative | 85% |
| `fullPhaseDescription` | **AI-Generated** | Synthesize 3-phase framework | 85% |

### Detailed Mapping: ICP → 3-Phase Framework

```typescript
// From icp-types.ts
const buyerPersona: BuyerPersona = {
  painPoints: [
    "Cannot accurately forecast revenue pipeline", // Phase 1: Immediate win
    "Losing enterprise deals to competitors",      // Phase 1: Immediate win
  ],
  goals: [
    "Scale from $2M to $10M ARR in 18 months",     // Phase 3: Strategic outcome
    "Build repeatable enterprise sales motion"      // Phase 3: Strategic outcome
  ],
  decisionInfluence: {
    influencers: ["CFO", "Board Members"],          // Phase 2: Committee concerns
    decisionFactors: ["ROI proof", "Risk mitigation"] // Phase 2: Committee concerns
  }
};

// Auto-population logic
approachDifferentiation.phaseFramework.phase1 = `Address ${buyerPersona.painPoints[0]} with immediate revenue intelligence`;
approachDifferentiation.phaseFramework.phase2 = `Demonstrate ROI to CFO and Board with systematic tracking`;
approachDifferentiation.phaseFramework.phase3 = `Enable ${buyerPersona.goals[0]} through repeatable sales motion`;
```

---

## SECTION 5: BUSINESS IMPACT & ROI - Auto-Population Mappings

### Fields

| Field | Source | Mapping Logic | Confidence |
|-------|--------|---------------|------------|
| `visionFrom` | **ICP** + **Cost Calculator** | Current pain state from painPoints + totalCost | 80% |
| `visionTo` | **ICP** → `buyerPersonas[0].goals[0]` | Future desired state from top goal | 85% |
| **Executive KPI Row** | | | |
| `executiveKPI.impactArea` | **Cost Calculator** → `delayedRevenue` | "Revenue Growth" or "ARR Expansion" | 90% |
| `executiveKPI.currentState` | **ICP** → `demographics.companySize` or **User** | Current ARR (e.g., "$2M ARR") | 75% |
| `executiveKPI.targetByDate` | **ICP** → `goals[0]` + **User** | Target ARR + timeline (e.g., "$10M ARR by Q4 2026") | 70% |
| `executiveKPI.strategicValue` | **ICP** → `goals[0]` | How it supports strategic goals | 75% |
| **Champion Metric Row** | | | |
| `championMetric.impactArea` | **ICP** → `buyerPersonas[champion].painPoints[0]` | Champion's success metric | 80% |
| `championMetric.currentState` | **Cost Calculator** + **ICP** | Current problem severity | 70% |
| `championMetric.targetByDate` | **User-Provided** | Improvement target + timeline | 100% |
| `championMetric.strategicValue` | **ICP** → `buyerPersonas[champion].goals[0]` | Champion's career impact | 75% |
| **Committee Concern Row** | | | |
| `committeeConcern.impactArea` | **ICP** → `decisionInfluence.decisionFactors[0]` | CFO/Board concern (e.g., "Risk Mitigation") | 80% |
| `committeeConcern.currentState` | **ICP** + **Cost Calculator** | Current risk/cost state | 70% |
| `committeeConcern.targetByDate` | **User-Provided** | Risk reduction target | 100% |
| `committeeConcern.strategicValue` | **ICP** → `decisionInfluence.decisionFactors` | How it addresses committee | 75% |
| **Organizational Benefits** | | | |
| `financialROI` | **Cost Calculator** → `totalCost * 0.75` | "X:1 ROI in Y months" calculation | 95% |
| `operationalExcellence` | **User-Provided** + **ICP** | Operational improvements | 70% |
| `competitiveAdvantage` | **ICP** + **User** | Market positioning gains | 65% |
| `riskReduction` | **ICP** → `fears` + **User** | Risk mitigation benefits | 70% |
| `fullBenefitsNarrative` | **AI-Generated** | Synthesize all benefits | 85% |

### Detailed Mapping: Cost Calculator → ROI Calculation

```typescript
// From SimplifiedCostCalculator.tsx
const costData = {
  delayedRevenue: 45000,
  competitorAdvantage: 23000,
  teamEfficiency: 12000,
  marketOpportunity: 38000
};
const timeframe = 6; // months
const totalCost = (45000 + 23000 + 12000 + 38000) * 6 = 708000;
const savingsOpportunity = totalCost * 0.75 = 531000;

// Assuming user-provided investment
const userProvidedInvestment = 150000;
const roiRatio = (savingsOpportunity / userProvidedInvestment).toFixed(1); // "3.5"

// Auto-population logic
businessImpactROI.financialROI = `${roiRatio}:1 ROI within ${timeframe} months`;
// Output: "3.5:1 ROI within 6 months"

businessImpactROI.executiveKPI = {
  impactArea: "Revenue Growth",
  currentState: "$2M ARR",
  targetByDate: "$10M ARR by Q4 2026",
  strategicValue: "Achieve Series B fundraising goals"
};
```

### AI Generation Prompt for `fullBenefitsNarrative`

```typescript
const benefitsPrompt = `
Generate an "Organizational Benefits" narrative combining all benefit categories.

Context:
- Financial ROI: ${businessImpactROI.financialROI}
- Operational Excellence: ${businessImpactROI.operationalExcellence}
- Competitive Advantage: ${businessImpactROI.competitiveAdvantage}
- Risk Reduction: ${businessImpactROI.riskReduction}

Format as: "[Financial ROI] • [Operational excellence] • [Competitive advantage] • [Risk reduction]"

Requirements:
1. Use concise bullet points (5-8 words each)
2. Lead with quantifiable financial impact
3. Progress from tangible to strategic benefits
4. Use business language (not technical jargon)

Example:
"3.5:1 ROI in 6 months • 40% faster deal velocity • First-mover advantage in enterprise • Eliminate $500K annual revenue risk"

Generate narrative:
`;
```

---

## SECTION 6: INVESTMENT & IMPLEMENTATION - Auto-Population Mappings

### Fields

| Field | Source | Mapping Logic | Confidence |
|-------|--------|---------------|------------|
| `totalInvestment` | **User-Provided** | Manual input (your pricing) | 100% |
| `roiRatio` | **Cost Calculator** → `savingsOpportunity / totalInvestment` | Calculated ratio | 95% |
| `roiTimeframe` | **Cost Calculator** → `timeframe` | Direct mapping from timeframe | 95% |
| `milestones[]` | **User-Provided** + **AI** | 3 milestones (Month 1, 2-3, 4-6) | 70% |
| `fullInvestmentStatement` | **AI-Generated** | Synthesize investment + ROI | 90% |
| `fullTimelineDescription` | **AI-Generated** | Synthesize milestones | 85% |

### Detailed Mapping: Cost Calculator → ROI Ratio

```typescript
// From SimplifiedCostCalculator.tsx and BusinessCaseTypes.ts
const totalCost = 708000; // 6-month cost of inaction
const savingsOpportunity = totalCost * 0.75; // 531000
const userProvidedInvestment = 150000; // User's pricing
const timeframe = 6; // months

// Auto-population logic
investmentImplementation.totalInvestment = userProvidedInvestment;
investmentImplementation.roiRatio = `${(savingsOpportunity / userProvidedInvestment).toFixed(1)}:1`;
investmentImplementation.roiTimeframe = `within ${timeframe} months`;

// Output: "3.5:1 within 6 months"
```

### AI Generation Prompt for Milestones

```typescript
const milestonesPrompt = `
Generate 3 implementation milestones for a business case.

Context:
- Solution: ${executiveSummary.recommendedSolution}
- Timeline: ${investmentImplementation.roiTimeframe}
- Top Pain Point: ${businessChallenge.specificProblem}
- Strategic Goal: ${businessImpactROI.visionTo}

Generate 3 milestones following this structure:
1. Month 1: [Immediate wins - quick value delivery]
2. Month 2-3: [Measurable improvements - KPI movement]
3. Month 4-6: [Full value realization - strategic goal achievement]

Requirements:
1. Each milestone must be specific and measurable
2. Progress from tactical to strategic
3. Reference actual pain points and goals
4. Use confident, active language

Generate milestones:
`;
```

---

## SECTION 7: STRATEGIC RATIONALE & NEXT STEPS - Auto-Population Mappings

### Fields

| Field | Source | Mapping Logic | Confidence |
|-------|--------|---------------|------------|
| `whyChangeNow` | **ICP** → `buyerPersonas[0].painPoints` urgency | Business trigger from pain points | 75% |
| `whyYourCompany` | **User-Provided** | Your unique fit/positioning | 100% |
| `whyThisApproach` | **User-Provided** | Methodology advantage | 100% |
| `valueAlignment1` | **ICP** → `psychographics.values[0]` | Company values alignment | 70% |
| `valueAlignment2` | **ICP** → `psychographics.values[1]` | Company values alignment | 70% |
| `valueAlignment3` | **ICP** → `psychographics.values[2]` | Company values alignment | 70% |
| `championQuote` | **AI-Generated** + **User** | First-person champion assessment | 60% |
| `alternativesConsidered[]` | **User-Provided** | Competitor names | 100% |
| `uniqueDeliverable` | **User-Provided** | What only you can deliver | 100% |
| `immediateActions[]` | **User-Provided** + **Template** | 3 next steps (Committee, Validation, Approval) | 80% |
| `fullChampionAssessment` | **AI-Generated** | Synthesize quote + context | 75% |
| `fullNextStepsDescription` | **AI-Generated** | Synthesize actions | 85% |

### Detailed Mapping: ICP → Values Alignment

```typescript
// From icp-types.ts
const buyerPersona: BuyerPersona = {
  psychographics: {
    values: [
      "Systematic efficiency over quick fixes",    // Maps to valueAlignment1
      "Data-driven decision making",               // Maps to valueAlignment2
      "Long-term strategic thinking"               // Maps to valueAlignment3
    ],
    motivations: [
      "Achieve predictable revenue growth",
      "Build world-class sales organization"
    ],
    fears: [
      "Missing fundraising targets",
      "Losing credibility with board"
    ]
  }
};

// Auto-population logic
strategyNextSteps.valueAlignment1 = `Your systematic approach to revenue scaling aligns with our ${buyerPersona.psychographics.values[0]} value`;
strategyNextSteps.valueAlignment2 = `Data-driven ROI tracking supports our ${buyerPersona.psychographics.values[1]} culture`;
strategyNextSteps.valueAlignment3 = `18-month implementation roadmap reflects our ${buyerPersona.psychographics.values[2]} philosophy`;
```

### AI Generation Prompt for `championQuote`

```typescript
const championQuotePrompt = `
Generate a first-person champion assessment quote for a business case.

Context:
- Champion Name: ${header.championName}
- Champion Title: ${header.championTitle}
- Champion's Top Pain Point: ${businessChallenge.specificProblem}
- Champion's Goal: ${businessImpactROI.championMetric.targetByDate}
- Alternatives Considered: ${strategyNextSteps.alternativesConsidered.join(", ")}
- Your Unique Deliverable: ${strategyNextSteps.uniqueDeliverable}
- Champion Personality: ${buyerPersona.psychographics.personality}
- Communication Style: ${buyerPersona.psychographics.communicationStyle}

Generate a quote following this template:
"I've evaluated [alternatives] and [Your Company] uniquely delivers [unique capability] that solves [specific pain point]. Unlike [alternatives], they [differentiation]. This is critical because [strategic importance]."

Requirements:
1. Use first-person ("I've evaluated...")
2. Sound authentic to champion's role and personality
3. Reference specific alternatives by name
4. Articulate clear differentiation
5. Connect to strategic goals
6. 3-4 sentences maximum

Generate quote:
`;
```

---

## AUTO-POPULATION WORKFLOW

### Step 1: Data Collection Phase

```typescript
interface AutoPopulationInput {
  // From ICP Analysis (if available)
  icpData?: ICPData;

  // From Cost Calculator (if available)
  costCalculatorResults?: {
    costData: CostData;
    timeframe: number;
    totalCost: number;
    savingsOpportunity: number;
    customerData: {
      currentARR: string;
      targetARR: string;
    };
  };

  // User-provided context (always required)
  userContext: {
    championName: string;
    championTitle: string;
    partnerName: string;
    partnerCompany: string;
    recommendedSolution: string;
    totalInvestment: number;
    implementationTimeline: string;
    alternativesConsidered: string[];
    uniqueDeliverable: string;
  };
}
```

### Step 2: Field-Level Auto-Population

```typescript
async function autoPopulateBusinessCase(input: AutoPopulationInput): Promise<BusinessCaseData> {
  const businessCase: BusinessCaseData = { ...BUSINESS_CASE_DEFAULTS };
  const metadata: Record<string, FieldMetadata> = {};

  // SECTION 1: HEADER
  businessCase.header.companyName = input.icpData?.companyName || input.userContext.companyName;
  metadata['header.companyName'] = {
    source: input.icpData ? AutoPopulationSource.ICP : AutoPopulationSource.USER_PROVIDED,
    lastUpdated: new Date(),
    isEditable: true,
    confidence: input.icpData ? 0.9 : 1.0
  };

  businessCase.header.championName = input.userContext.championName;
  metadata['header.championName'] = {
    source: AutoPopulationSource.USER_PROVIDED,
    lastUpdated: new Date(),
    isEditable: true,
    confidence: 1.0
  };

  // Generate priority headline using AI
  businessCase.header.priorityHeadline = await generateHeadline(businessCase);
  metadata['header.priorityHeadline'] = {
    source: AutoPopulationSource.AI_GENERATED,
    lastUpdated: new Date(),
    isEditable: true,
    confidence: 0.85
  };

  // SECTION 2: EXECUTIVE SUMMARY
  if (input.costCalculatorResults) {
    const totalCost = input.costCalculatorResults.totalCost;
    businessCase.executiveSummary.currentCostPain =
      `$${(totalCost / 1000).toFixed(0)}K in delayed revenue, competitive losses, and missed opportunities`;

    metadata['executiveSummary.currentCostPain'] = {
      source: AutoPopulationSource.COST_CALCULATOR,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: 0.95
    };
  }

  if (input.icpData?.buyerPersonas && input.icpData.buyerPersonas.length > 0) {
    const primaryBuyer = input.icpData.buyerPersonas[0];
    businessCase.executiveSummary.businessChange = primaryBuyer.painPoints[0];
    businessCase.executiveSummary.executiveGoal = primaryBuyer.goals[0];

    metadata['executiveSummary.businessChange'] = {
      source: AutoPopulationSource.ICP,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: 0.75
    };
  }

  // SECTION 3: BUSINESS CHALLENGE
  if (input.costCalculatorResults) {
    businessCase.businessChallenge.dollarCost = input.costCalculatorResults.totalCost;

    metadata['businessChallenge.dollarCost'] = {
      source: AutoPopulationSource.COST_CALCULATOR,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: 0.95
    };
  }

  // SECTION 5: BUSINESS IMPACT & ROI
  if (input.costCalculatorResults && input.userContext.totalInvestment) {
    const roiRatio = (input.costCalculatorResults.savingsOpportunity / input.userContext.totalInvestment).toFixed(1);
    businessCase.businessImpactROI.financialROI =
      `${roiRatio}:1 ROI within ${input.costCalculatorResults.timeframe} months`;

    metadata['businessImpactROI.financialROI'] = {
      source: AutoPopulationSource.COST_CALCULATOR,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: 0.95
    };
  }

  // Continue for all sections...

  // Store metadata
  businessCase.fieldMetadata = metadata;

  return businessCase;
}
```

### Step 3: AI Narrative Generation

```typescript
async function generateBusinessCaseNarratives(businessCase: BusinessCaseData): Promise<BusinessCaseData> {
  // Generate all AI-synthesized narrative fields
  const narrativePromises = [
    generateHeadline(businessCase),
    generateExecutiveSummary(businessCase),
    generateCostOfStatusQuo(businessCase),
    generateRecommendedSolution(businessCase),
    generateBenefitsNarrative(businessCase),
    generateChampionAssessment(businessCase),
    generateNextStepsDescription(businessCase)
  ];

  const [
    headline,
    execSummary,
    costStatusQuo,
    solution,
    benefits,
    championQuote,
    nextSteps
  ] = await Promise.all(narrativePromises);

  // Update business case with generated narratives
  businessCase.header.priorityHeadline = headline;
  businessCase.executiveSummary.fullSummary = execSummary;
  businessCase.businessChallenge.fullCostOfStatusQuo = costStatusQuo;
  businessCase.approachDifferentiation.fullRecommendedSolution = solution;
  businessCase.businessImpactROI.fullBenefitsNarrative = benefits;
  businessCase.strategyNextSteps.fullChampionAssessment = championQuote;
  businessCase.strategyNextSteps.fullNextStepsDescription = nextSteps;

  return businessCase;
}
```

---

## CONFIDENCE SCORING & USER TRANSPARENCY

### Confidence Levels

| Confidence | Source | Editing Recommendation |
|------------|--------|------------------------|
| 95-100% | Cost Calculator exact values, User-provided data | Low edit priority - highly accurate |
| 80-94% | ICP direct mappings, System calculations | Medium edit priority - verify accuracy |
| 65-79% | ICP inferred mappings, Hybrid sources | High edit priority - review and refine |
| <65% | AI-generated narratives, Complex inferences | Highest edit priority - significant review needed |

### Field Highlighting System

```typescript
function getFieldHighlightStyle(confidence: number): string {
  if (confidence >= 0.95) return 'border-green-500/30 bg-green-900/10'; // Highly confident
  if (confidence >= 0.80) return 'border-blue-500/30 bg-blue-900/10';   // Confident
  if (confidence >= 0.65) return 'border-yellow-500/30 bg-yellow-900/10'; // Review suggested
  return 'border-red-500/30 bg-red-900/10';                              // Review required
}
```

### User Transparency UI

```tsx
interface FieldWithMetadata {
  value: string;
  metadata: FieldMetadata;
}

function BusinessCaseField({ field, metadata }: FieldWithMetadata) {
  return (
    <div className={`p-3 rounded-lg border ${getFieldHighlightStyle(metadata.confidence)}`}>
      <div className="flex justify-between items-start mb-2">
        <label className="text-sm font-medium text-slate-300">Field Name</label>
        <div className="flex items-center space-x-2">
          <SourceBadge source={metadata.source} />
          <ConfidenceBadge confidence={metadata.confidence} />
        </div>
      </div>
      <input
        value={field.value}
        className="w-full bg-slate-800 text-white"
        onChange={(e) => handleFieldUpdate(e.target.value)}
      />
      <p className="text-xs text-slate-400 mt-1">
        Last updated: {metadata.lastUpdated.toLocaleString()}
      </p>
    </div>
  );
}
```

---

## PRIORITY AUTO-POPULATION ORDER

### Phase 1: Foundation (Highest Value, Highest Confidence)

1. **Header** (companyName, championName, championTitle) - 95% confidence
2. **Business Challenge** (dollarCost) - 95% from Cost Calculator
3. **Investment & Implementation** (totalInvestment, roiRatio) - 95% calculated
4. **Business Impact & ROI** (financialROI) - 95% from Cost Calculator

### Phase 2: Context (High Value, Medium-High Confidence)

5. **Executive Summary** (currentCostPain, executiveGoal) - 75-90% from ICP + Cost Calc
6. **Business Challenge** (affectedStakeholders, specificProblem) - 75-85% from ICP
7. **Business Impact & ROI** (executiveKPI row) - 75-85% from ICP + Cost Calc
8. **Strategic Rationale** (valueAlignment fields) - 70-75% from ICP psychographics

### Phase 3: Narrative Synthesis (Medium Value, Variable Confidence)

9. **Executive Summary** (fullSummary) - 90% AI-generated
10. **Business Challenge** (fullCostOfStatusQuo) - 85% AI-generated
11. **Approach & Differentiation** (fullRecommendedSolution) - 85% AI-generated
12. **Business Impact & ROI** (fullBenefitsNarrative) - 85% AI-generated
13. **Strategic Rationale** (fullChampionAssessment) - 75% AI-generated

### Phase 4: User Refinement (Lowest Confidence, Highest Edit Priority)

14. **Approach & Differentiation** (4 capabilities) - User-provided
15. **Approach & Differentiation** (3-phase framework) - 60-70% from ICP, requires refinement
16. **Strategic Rationale** (immediateActions) - 80% template-based, user confirms
17. **Header** (priorityHeadline) - 85% AI-generated, user refines

---

## IMPLEMENTATION CHECKLIST

- [ ] Create `autoPopulationService.ts` with mapping logic
- [ ] Build field metadata tracking system
- [ ] Integrate ICP Analysis data fetching
- [ ] Integrate Cost Calculator results fetching
- [ ] Implement AI prompt templates for narratives
- [ ] Create confidence scoring algorithm
- [ ] Build user transparency UI (badges, highlighting)
- [ ] Add field-level editing with source preservation
- [ ] Implement validation for required vs. auto-populated fields
- [ ] Create auto-population preview mode
- [ ] Add "Re-generate from source" button for AI fields
- [ ] Build comprehensive testing suite with mock ICP + Cost Calculator data

---

## SUCCESS METRICS

1. **Auto-Population Coverage**: Target 70%+ of fields auto-populated on first load
2. **User Edit Rate**: Track which fields users edit most (indicates low confidence)
3. **Confidence Accuracy**: Measure actual user edits vs. predicted confidence scores
4. **Time to Complete**: Reduce business case creation from 60 min → 15 min
5. **Export Rate**: % of auto-populated business cases that get exported (quality indicator)

---

## NEXT STEPS

1. **DAY 1 (Today)**: Complete auto-population strategy documentation ✓
2. **DAY 2**: Build Business Case Template Component with all 7 sections
3. **DAY 3**: Implement auto-population service with ICP + Cost Calculator integration
4. **DAY 4**: Add export functionality (PDF/DOCX/HTML)
5. **DAY 5**: Migrate Cost Calculator to modern platform
6. **DAY 6**: End-to-end testing and workflow integration
