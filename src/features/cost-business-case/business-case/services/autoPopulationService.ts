// Auto-Population Service for Business Case Builder
// Maps ICP Analysis and Cost Calculator data to Business Case template
// Includes confidence scoring and AI narrative generation

import {
  BusinessCaseData,
  BUSINESS_CASE_DEFAULTS,
  AutoPopulationSource,
  FieldMetadata,
  ImpactTableRow
} from '../BusinessCaseTypes';
import type { ICPData, BuyerPersona } from '@/src/features/icp-analysis/types/icp-types';

// ============================================================================
// TYPES
// ============================================================================

interface CostCalculatorResults {
  costData: {
    delayedRevenue: number;
    competitorAdvantage: number;
    teamEfficiency: number;
    marketOpportunity: number;
  };
  timeframe: number; // months
  totalCost: number;
  savingsOpportunity: number;
  customerData?: {
    currentARR: string;
    targetARR: string;
    growthStage?: string;
  };
}

interface UserContext {
  championName: string;
  championTitle: string;
  partnerName: string;
  partnerCompany: string;
  recommendedSolution: string;
  totalInvestment: number;
  implementationTimeline: string;
  alternativesConsidered: string[];
  uniqueDeliverable: string;
}

export interface AutoPopulationInput {
  icpData?: ICPData;
  costCalculatorResults?: CostCalculatorResults;
  userContext: UserContext;
  userId?: string; // Optional user ID for createdBy field
}

// ============================================================================
// SUPABASE DATA FETCHING
// ============================================================================

/**
 * Fetch ICP Analysis data from Supabase
 */
export async function fetchICPData(icpAnalysisId: string): Promise<ICPData | null> {
  try {
    // TODO: Replace with actual Supabase query
    // const { data, error } = await supabase
    //   .from('customer_assets')
    //   .select('*')
    //   .eq('id', icpAnalysisId)
    //   .eq('resource_type', 'icp_analysis')
    //   .single();

    // if (error) throw error;
    // return data as ICPData;

    console.log('Fetching ICP data for ID:', icpAnalysisId);
    return null; // Placeholder - will integrate with Supabase
  } catch (error) {
    console.error('Failed to fetch ICP data:', error);
    return null;
  }
}

/**
 * Fetch Cost Calculator results from Supabase
 */
export async function fetchCostCalculatorData(costCalcId: string): Promise<CostCalculatorResults | null> {
  try {
    // Dynamically import to avoid circular dependencies
    const { fetchCostCalculation } = await import('../../cost-calculator/costCalculatorService');

    console.log('Fetching Cost Calculator data for ID:', costCalcId);

    const result = await fetchCostCalculation(costCalcId);

    if (!result) {
      console.warn('No Cost Calculator data found for ID:', costCalcId);
      return null;
    }

    console.log('Cost Calculator data fetched successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to fetch Cost Calculator data:', error);
    return null;
  }
}

// ============================================================================
// CONFIDENCE CALCULATION
// ============================================================================

/**
 * Calculate confidence score for a field based on source and data quality
 * Returns 0-1 confidence score
 */
export function calculateConfidence(
  source: AutoPopulationSource,
  hasData: boolean,
  dataQuality: 'high' | 'medium' | 'low' = 'high'
): number {
  if (!hasData) return 0;

  // Base confidence by source
  const baseConfidence: Record<AutoPopulationSource, number> = {
    [AutoPopulationSource.COST_CALCULATOR]: 0.95,  // Most accurate
    [AutoPopulationSource.ICP]: 0.85,              // High accuracy
    [AutoPopulationSource.USER_PROVIDED]: 1.0,     // User knows best
    [AutoPopulationSource.AI_GENERATED]: 0.75,     // Needs review
    [AutoPopulationSource.HYBRID]: 0.80            // Combined sources
  };

  // Quality multiplier
  const qualityMultiplier: Record<string, number> = {
    high: 1.0,
    medium: 0.85,
    low: 0.65
  };

  return baseConfidence[source] * qualityMultiplier[dataQuality];
}

// ============================================================================
// FIELD MAPPING: ICP → BUSINESS CASE
// ============================================================================

/**
 * Map ICP data to Business Case fields
 */
function mapICPToBusinessCase(
  icpData: ICPData,
  businessCase: BusinessCaseData,
  metadata: Record<string, FieldMetadata>
): void {
  // Header: Company Name
  if (icpData.companyName) {
    businessCase.header.companyName = icpData.companyName;
    metadata['header.companyName'] = {
      source: AutoPopulationSource.ICP,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: calculateConfidence(AutoPopulationSource.ICP, true, 'high')
    };
  }

  // Get primary buyer persona
  const primaryBuyer = icpData.buyerPersonas?.[0];
  if (!primaryBuyer) return;

  // Executive Summary: Business Change
  if (primaryBuyer.painPoints && primaryBuyer.painPoints.length > 0) {
    businessCase.executiveSummary.businessChange = primaryBuyer.painPoints[0];
    metadata['executiveSummary.businessChange'] = {
      source: AutoPopulationSource.ICP,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: calculateConfidence(AutoPopulationSource.ICP, true, 'high')
    };
  }

  // Executive Summary: Executive Goal
  if (primaryBuyer.goals && primaryBuyer.goals.length > 0) {
    businessCase.executiveSummary.executiveGoal = primaryBuyer.goals[0];
    metadata['executiveSummary.executiveGoal'] = {
      source: AutoPopulationSource.ICP,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: calculateConfidence(AutoPopulationSource.ICP, true, 'high')
    };
  }

  // Business Challenge: Current Reality
  if (primaryBuyer.painPoints && primaryBuyer.painPoints.length > 0) {
    businessCase.businessChallenge.currentRealityDescription = primaryBuyer.painPoints[0];
    metadata['businessChallenge.currentRealityDescription'] = {
      source: AutoPopulationSource.ICP,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: calculateConfidence(AutoPopulationSource.ICP, true, 'high')
    };
  }

  // Business Challenge: Specific Problem
  if (primaryBuyer.painPoints && primaryBuyer.painPoints.length > 1) {
    businessCase.businessChallenge.specificProblem = primaryBuyer.painPoints[1] || primaryBuyer.painPoints[0];
    metadata['businessChallenge.specificProblem'] = {
      source: AutoPopulationSource.ICP,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: calculateConfidence(AutoPopulationSource.ICP, true, 'medium')
    };
  }

  // Business Challenge: Affected Stakeholders
  if (icpData.buyerPersonas && icpData.buyerPersonas.length > 0) {
    const stakeholders = icpData.buyerPersonas.map(p => p.role).join(', ');
    businessCase.businessChallenge.affectedStakeholders = stakeholders;
    metadata['businessChallenge.affectedStakeholders'] = {
      source: AutoPopulationSource.ICP,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: calculateConfidence(AutoPopulationSource.ICP, true, 'high')
    };
  }

  // Business Challenge: Affected Count
  if (primaryBuyer.demographics?.companySize) {
    const sizeMatch = primaryBuyer.demographics.companySize.match(/(\d+)/);
    if (sizeMatch) {
      businessCase.businessChallenge.affectedCount = parseInt(sizeMatch[0]);
      metadata['businessChallenge.affectedCount'] = {
        source: AutoPopulationSource.ICP,
        lastUpdated: new Date(),
        isEditable: true,
        confidence: calculateConfidence(AutoPopulationSource.ICP, true, 'medium')
      };
    }
  }

  // Approach & Differentiation: Discovery Stakeholders
  if (icpData.buyerPersonas && icpData.buyerPersonas.length > 0) {
    const stakeholderNames = icpData.buyerPersonas.map(p => p.name);
    businessCase.approachDifferentiation.discoveryStakeholders = stakeholderNames;
    metadata['approachDifferentiation.discoveryStakeholders'] = {
      source: AutoPopulationSource.ICP,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: calculateConfidence(AutoPopulationSource.ICP, true, 'high')
    };
  }

  // Business Impact & ROI: Vision From
  if (primaryBuyer.painPoints && primaryBuyer.painPoints.length > 0) {
    businessCase.businessImpactROI.visionFrom = primaryBuyer.painPoints[0];
    metadata['businessImpactROI.visionFrom'] = {
      source: AutoPopulationSource.ICP,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: calculateConfidence(AutoPopulationSource.ICP, true, 'high')
    };
  }

  // Business Impact & ROI: Vision To
  if (primaryBuyer.goals && primaryBuyer.goals.length > 0) {
    businessCase.businessImpactROI.visionTo = primaryBuyer.goals[0];
    metadata['businessImpactROI.visionTo'] = {
      source: AutoPopulationSource.ICP,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: calculateConfidence(AutoPopulationSource.ICP, true, 'high')
    };
  }

  // Business Impact & ROI: Executive KPI (from ICP demographics)
  if (primaryBuyer.role && primaryBuyer.goals && primaryBuyer.goals.length > 0) {
    businessCase.businessImpactROI.executiveKPI = {
      impactArea: 'Revenue Growth',
      currentState: '', // Will be filled from Cost Calculator
      targetByDate: '', // Will be filled from Cost Calculator
      strategicValue: primaryBuyer.goals[0]
    };
    metadata['businessImpactROI.executiveKPI'] = {
      source: AutoPopulationSource.ICP,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: calculateConfidence(AutoPopulationSource.ICP, true, 'medium')
    };
  }

  // Strategic Rationale: Values Alignment
  if (primaryBuyer.psychographics?.values && primaryBuyer.psychographics.values.length >= 3) {
    businessCase.strategyNextSteps.valueAlignment1 = primaryBuyer.psychographics.values[0];
    businessCase.strategyNextSteps.valueAlignment2 = primaryBuyer.psychographics.values[1];
    businessCase.strategyNextSteps.valueAlignment3 = primaryBuyer.psychographics.values[2];

    metadata['strategyNextSteps.valueAlignment1'] = {
      source: AutoPopulationSource.ICP,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: calculateConfidence(AutoPopulationSource.ICP, true, 'high')
    };
  }
}

// ============================================================================
// FIELD MAPPING: COST CALCULATOR → BUSINESS CASE
// ============================================================================

/**
 * Map Cost Calculator results to Business Case fields
 */
function mapCostCalculatorToBusinessCase(
  costCalcResults: CostCalculatorResults,
  businessCase: BusinessCaseData,
  metadata: Record<string, FieldMetadata>
): void {
  // Executive Summary: Current Cost/Pain
  const totalCost = costCalcResults.totalCost;
  const totalCostK = (totalCost / 1000).toFixed(0);
  businessCase.executiveSummary.currentCostPain =
    `$${totalCostK}K in delayed revenue, competitive losses, and missed opportunities`;

  metadata['executiveSummary.currentCostPain'] = {
    source: AutoPopulationSource.COST_CALCULATOR,
    lastUpdated: new Date(),
    isEditable: true,
    confidence: calculateConfidence(AutoPopulationSource.COST_CALCULATOR, true, 'high')
  };

  // Business Challenge: Dollar Cost
  businessCase.businessChallenge.dollarCost = totalCost;
  metadata['businessChallenge.dollarCost'] = {
    source: AutoPopulationSource.COST_CALCULATOR,
    lastUpdated: new Date(),
    isEditable: true,
    confidence: calculateConfidence(AutoPopulationSource.COST_CALCULATOR, true, 'high')
  };

  // Business Challenge: Frequency
  businessCase.businessChallenge.frequency = `${costCalcResults.timeframe} months`;
  metadata['businessChallenge.frequency'] = {
    source: AutoPopulationSource.COST_CALCULATOR,
    lastUpdated: new Date(),
    isEditable: true,
    confidence: calculateConfidence(AutoPopulationSource.COST_CALCULATOR, true, 'high')
  };

  // Business Impact & ROI: Executive KPI (Current & Target ARR)
  if (costCalcResults.customerData) {
    if (businessCase.businessImpactROI.executiveKPI) {
      businessCase.businessImpactROI.executiveKPI.currentState =
        costCalcResults.customerData.currentARR || '$2M ARR';
      businessCase.businessImpactROI.executiveKPI.targetByDate =
        `${costCalcResults.customerData.targetARR || '$10M ARR'} by Q4 2026`;

      metadata['businessImpactROI.executiveKPI.currentState'] = {
        source: AutoPopulationSource.COST_CALCULATOR,
        lastUpdated: new Date(),
        isEditable: true,
        confidence: calculateConfidence(AutoPopulationSource.COST_CALCULATOR, true, 'high')
      };
    }
  }

  // Business Impact & ROI: Financial ROI (calculated from savings opportunity)
  if (businessCase.investmentImplementation.totalInvestment > 0) {
    const roiRatio = (costCalcResults.savingsOpportunity / businessCase.investmentImplementation.totalInvestment).toFixed(1);
    businessCase.businessImpactROI.financialROI = `${roiRatio}:1 ROI within ${costCalcResults.timeframe} months`;

    metadata['businessImpactROI.financialROI'] = {
      source: AutoPopulationSource.COST_CALCULATOR,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: calculateConfidence(AutoPopulationSource.COST_CALCULATOR, true, 'high')
    };

    // Investment & Implementation: ROI Ratio
    businessCase.investmentImplementation.roiRatio = `${roiRatio}:1`;
    businessCase.investmentImplementation.roiTimeframe = `within ${costCalcResults.timeframe} months`;

    metadata['investmentImplementation.roiRatio'] = {
      source: AutoPopulationSource.COST_CALCULATOR,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: calculateConfidence(AutoPopulationSource.COST_CALCULATOR, true, 'high')
    };
  }
}

// ============================================================================
// FIELD MAPPING: USER CONTEXT → BUSINESS CASE
// ============================================================================

/**
 * Map user-provided context to Business Case fields
 */
function mapUserContextToBusinessCase(
  userContext: UserContext,
  businessCase: BusinessCaseData,
  metadata: Record<string, FieldMetadata>
): void {
  // Header
  businessCase.header.championName = userContext.championName;
  businessCase.header.championTitle = userContext.championTitle;
  businessCase.header.partnerName = userContext.partnerName;
  businessCase.header.partnerCompany = userContext.partnerCompany;

  metadata['header.championName'] = {
    source: AutoPopulationSource.USER_PROVIDED,
    lastUpdated: new Date(),
    isEditable: true,
    confidence: 1.0
  };
  metadata['header.championTitle'] = {
    source: AutoPopulationSource.USER_PROVIDED,
    lastUpdated: new Date(),
    isEditable: true,
    confidence: 1.0
  };

  // Executive Summary
  businessCase.executiveSummary.recommendedSolution = userContext.recommendedSolution;
  businessCase.executiveSummary.implementationTimeline = userContext.implementationTimeline;

  metadata['executiveSummary.recommendedSolution'] = {
    source: AutoPopulationSource.USER_PROVIDED,
    lastUpdated: new Date(),
    isEditable: true,
    confidence: 1.0
  };

  // Investment & Implementation
  businessCase.investmentImplementation.totalInvestment = userContext.totalInvestment;

  metadata['investmentImplementation.totalInvestment'] = {
    source: AutoPopulationSource.USER_PROVIDED,
    lastUpdated: new Date(),
    isEditable: true,
    confidence: 1.0
  };

  // Strategic Rationale
  businessCase.strategyNextSteps.alternativesConsidered = userContext.alternativesConsidered;
  businessCase.strategyNextSteps.uniqueDeliverable = userContext.uniqueDeliverable;

  metadata['strategyNextSteps.alternativesConsidered'] = {
    source: AutoPopulationSource.USER_PROVIDED,
    lastUpdated: new Date(),
    isEditable: true,
    confidence: 1.0
  };
}

// ============================================================================
// AI NARRATIVE GENERATION (PLACEHOLDER)
// ============================================================================

/**
 * Generate AI narratives for composite fields
 * TODO: Integrate with backend AI service
 */
async function generateAINarratives(
  businessCase: BusinessCaseData,
  metadata: Record<string, FieldMetadata>
): Promise<void> {
  // Placeholder - will integrate with Claude API via backend

  // Example: Generate priority headline
  if (businessCase.executiveSummary.businessChange &&
      businessCase.executiveSummary.strategicOutcome &&
      businessCase.executiveSummary.implementationTimeline) {

    // TODO: Call backend API to generate headline
    // const headline = await generateHeadline(businessCase);

    const headline = `Transform ${businessCase.header.companyName || 'Your Business'} with ${businessCase.executiveSummary.recommendedSolution || 'Strategic Solutions'}`;

    businessCase.header.priorityHeadline = headline;
    metadata['header.priorityHeadline'] = {
      source: AutoPopulationSource.AI_GENERATED,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: calculateConfidence(AutoPopulationSource.AI_GENERATED, true, 'medium')
    };
  }

  // Example: Generate executive summary
  if (businessCase.executiveSummary.businessChange &&
      businessCase.executiveSummary.recommendedSolution &&
      businessCase.executiveSummary.implementationTimeline &&
      businessCase.executiveSummary.currentCostPain &&
      businessCase.executiveSummary.strategicOutcome &&
      businessCase.executiveSummary.executiveGoal) {

    const fullSummary = `Because ${businessCase.executiveSummary.businessChange}, ${businessCase.header.companyName} should implement ${businessCase.executiveSummary.recommendedSolution} by ${businessCase.executiveSummary.implementationTimeline}. This eliminates ${businessCase.executiveSummary.currentCostPain} while enabling ${businessCase.executiveSummary.strategicOutcome} that directly supports ${businessCase.executiveSummary.executiveGoal}.`;

    businessCase.executiveSummary.fullSummary = fullSummary;
    metadata['executiveSummary.fullSummary'] = {
      source: AutoPopulationSource.AI_GENERATED,
      lastUpdated: new Date(),
      isEditable: true,
      confidence: calculateConfidence(AutoPopulationSource.AI_GENERATED, true, 'high')
    };
  }

  // TODO: Add more AI narrative generators:
  // - generateCostOfStatusQuo()
  // - generateRecommendedSolution()
  // - generateBenefitsNarrative()
  // - generateChampionAssessment()
  // - generateNextStepsDescription()
}

// ============================================================================
// MAIN AUTO-POPULATION FUNCTION
// ============================================================================

/**
 * Auto-populate Business Case from ICP, Cost Calculator, and User Context
 */
export async function autoPopulateBusinessCase(
  input: AutoPopulationInput
): Promise<BusinessCaseData> {
  // Start with defaults
  const businessCase: BusinessCaseData = {
    ...BUSINESS_CASE_DEFAULTS,
    id: crypto.randomUUID(),
    version: 1,
    status: 'draft',
    lastModified: new Date(),
    createdBy: input.userId || 'system', // Use provided userId or fallback to 'system'
    exportFormat: [],
    includeCharts: true,
    fieldMetadata: {}
  } as BusinessCaseData;

  const metadata: Record<string, FieldMetadata> = {};

  // Phase 1: Map ICP data
  if (input.icpData) {
    mapICPToBusinessCase(input.icpData, businessCase, metadata);
  }

  // Phase 2: Map User Context
  mapUserContextToBusinessCase(input.userContext, businessCase, metadata);

  // Phase 3: Map Cost Calculator (must be after user context for ROI calculation)
  if (input.costCalculatorResults) {
    mapCostCalculatorToBusinessCase(input.costCalculatorResults, businessCase, metadata);
  }

  // Phase 4: Generate AI narratives
  await generateAINarratives(businessCase, metadata);

  // Store metadata
  businessCase.fieldMetadata = metadata;

  return businessCase;
}

/**
 * Calculate completion percentage of business case
 */
export function calculateCompletionPercentage(businessCase: BusinessCaseData): number {
  // Count total fields vs filled fields
  let totalFields = 0;
  let filledFields = 0;

  // Helper to check if value is filled
  const isFilled = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return value > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return false;
  };

  // Check each section
  Object.values(businessCase).forEach((section) => {
    if (typeof section === 'object' && section !== null) {
      Object.values(section).forEach((value) => {
        totalFields++;
        if (isFilled(value)) filledFields++;
      });
    }
  });

  return Math.round((filledFields / totalFields) * 100);
}
