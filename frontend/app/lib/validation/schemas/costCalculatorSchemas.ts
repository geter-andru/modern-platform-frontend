/**
 * Cost Calculator Validation Schemas
 * 
 * Comprehensive validation schemas for all cost calculator related API endpoints.
 * Provides request validation, response validation, and data transformation for
 * cost calculations, comparisons, and export operations.
 * 
 * FUNCTIONALITY STATUS: REAL
 * - Production-ready validation schemas
 * - Complete type safety
 * - Comprehensive error handling
 * - Request/response validation
 */

import { z } from 'zod';

// ============================================================================
// COST CALCULATION INPUT SCHEMAS
// ============================================================================

/**
 * Cost Calculation Input Schema
 * Validates input data for cost calculations
 */
export const CostCalculationInputSchema = z.object({
  currentRevenue: z.number().min(0).describe('Current annual revenue in USD'),
  averageDealSize: z.number().min(0).describe('Average deal size in USD'),
  conversionRate: z.number().min(0).max(100).describe('Lead to customer conversion rate (%)'),
  salesCycleLength: z.number().min(1).max(365).optional().describe('Sales cycle length in days'),
  customerLifetimeValue: z.number().min(0).optional().describe('Customer lifetime value in USD'),
  churnRate: z.number().min(0).max(100).optional().describe('Customer churn rate (%)'),
  marketSize: z.number().min(0).optional().describe('Total addressable market size in USD'),
  competitivePressure: z.number().min(0).max(10).optional().describe('Competitive pressure level (0-10)'),
  teamSize: z.number().min(1).optional().describe('Sales team size'),
  leadVolume: z.number().min(0).optional().describe('Monthly lead volume'),
  costPerLead: z.number().min(0).optional().describe('Current cost per lead in USD'),
  salesEfficiency: z.number().min(0).max(100).optional().describe('Sales efficiency score (0-100)')
});

/**
 * Cost Calculation Scenario Schema
 * Validates cost calculation scenarios for comparison
 */
export const CostCalculationScenarioSchema = z.object({
  name: z.string().min(1).max(255).describe('Scenario name'),
  description: z.string().min(10).max(500).describe('Scenario description'),
  input: CostCalculationInputSchema,
  assumptions: z.record(z.string()).optional().describe('Scenario assumptions')
});

// ============================================================================
// COST CALCULATION RESULT SCHEMAS
// ============================================================================

/**
 * Cost Calculation Details Schema
 * Validates detailed cost calculation results
 */
export const CostCalculationDetailsSchema = z.object({
  lostRevenue: z.number().min(0).describe('Lost revenue due to inefficiencies'),
  inefficiencyLoss: z.number().min(0).describe('Revenue lost to operational inefficiencies'),
  opportunityCost: z.number().min(0).describe('Opportunity cost of inaction'),
  competitiveDisadvantage: z.number().min(0).describe('Cost of competitive disadvantage'),
  totalAnnualCost: z.number().min(0).describe('Total annual cost of inaction'),
  monthlyCost: z.number().min(0).describe('Monthly cost of inaction'),
  dailyCost: z.number().min(0).describe('Daily cost of inaction'),
  costPerLead: z.number().min(0).describe('Cost per lead due to inefficiencies'),
  costPerOpportunity: z.number().min(0).describe('Cost per opportunity lost'),
  roiProjection: z.number().describe('Projected ROI from improvements'),
  paybackPeriod: z.string().describe('Expected payback period')
});

/**
 * Cost Calculation Insights Schema
 * Validates insights from cost calculations
 */
export const CostCalculationInsightsSchema = z.object({
  primaryDrivers: z.array(z.string().min(5).max(200)).describe('Primary cost drivers'),
  recommendations: z.array(z.string().min(10).max(300)).describe('Improvement recommendations'),
  riskFactors: z.array(z.string().min(5).max(200)).describe('Risk factors to consider'),
  opportunityAreas: z.array(z.string().min(5).max(200)).describe('High-impact opportunity areas'),
  quickWins: z.array(z.string().min(10).max(300)).optional().describe('Quick win opportunities'),
  longTermStrategies: z.array(z.string().min(10).max(300)).optional().describe('Long-term strategic initiatives')
});

/**
 * Cost Calculation Metadata Schema
 * Validates cost calculation metadata
 */
export const CostCalculationMetadataSchema = z.object({
  calculationMethod: z.enum(['standard', 'ai_enhanced', 'custom']).describe('Calculation method used'),
  confidence: z.number().min(0).max(1).describe('Calculation confidence level (0-1)'),
  processingTime: z.number().min(0).describe('Processing time in milliseconds'),
  version: z.string().describe('Calculation engine version'),
  assumptions: z.record(z.string()).optional().describe('Calculation assumptions')
});

/**
 * Complete Cost Calculation Result Schema
 * Validates the complete cost calculation result
 */
export const CostCalculationResultSchema = z.object({
  currentRevenue: z.number().min(0).describe('Input current revenue'),
  averageDealSize: z.number().min(0).describe('Input average deal size'),
  conversionRate: z.number().min(0).max(100).describe('Input conversion rate'),
  calculation: CostCalculationDetailsSchema,
  insights: CostCalculationInsightsSchema,
  totalCost: z.number().min(0).describe('Total cost of inaction'),
  generatedAt: z.string().datetime().describe('Calculation timestamp'),
  metadata: CostCalculationMetadataSchema
});

// ============================================================================
// COST COMPARISON SCHEMAS
// ============================================================================

/**
 * Cost Comparison Scenario Schema
 * Validates individual scenarios in cost comparisons
 */
export const CostComparisonScenarioSchema = z.object({
  name: z.string().min(1).max(255).describe('Scenario name'),
  input: CostCalculationInputSchema,
  result: CostCalculationResultSchema,
  ranking: z.number().min(1).optional().describe('Scenario ranking')
});

/**
 * Cost Comparison Analysis Schema
 * Validates cost comparison analysis results
 */
export const CostComparisonAnalysisSchema = z.object({
  bestScenario: z.string().describe('Best performing scenario name'),
  worstScenario: z.string().describe('Worst performing scenario name'),
  savingsPotential: z.number().min(0).describe('Maximum savings potential in USD'),
  recommendations: z.array(z.string().min(10).max(300)).describe('Comparison-based recommendations'),
  keyDifferences: z.array(z.object({
    metric: z.string().describe('Metric name'),
    bestValue: z.number().describe('Best scenario value'),
    worstValue: z.number().describe('Worst scenario value'),
    difference: z.number().describe('Value difference'),
    impact: z.enum(['low', 'medium', 'high', 'critical']).describe('Impact level')
  })).optional()
});

/**
 * Complete Cost Comparison Result Schema
 * Validates the complete cost comparison result
 */
export const CostComparisonResultSchema = z.object({
  scenarios: z.array(CostComparisonScenarioSchema).min(2).max(10).describe('Comparison scenarios'),
  comparison: CostComparisonAnalysisSchema,
  generatedAt: z.string().datetime().describe('Comparison timestamp')
});

// ============================================================================
// COST HISTORY SCHEMAS
// ============================================================================

/**
 * Cost Calculation History Entry Schema
 * Validates individual cost calculation history entries
 */
export const CostCalculationHistoryEntrySchema = z.object({
  id: z.string().uuid().describe('History entry ID'),
  timestamp: z.string().datetime().describe('Calculation timestamp'),
  input: CostCalculationInputSchema,
  result: CostCalculationResultSchema,
  notes: z.string().optional().describe('User notes'),
  tags: z.array(z.string()).optional().describe('Calculation tags')
});

/**
 * Cost Calculation History Schema
 * Validates cost calculation history data
 */
export const CostCalculationHistorySchema = z.object({
  entries: z.array(CostCalculationHistoryEntrySchema).describe('History entries'),
  totalCalculations: z.number().min(0).describe('Total number of calculations'),
  dateRange: z.object({
    start: z.string().datetime().describe('History start date'),
    end: z.string().datetime().describe('History end date')
  }).optional(),
  trends: z.object({
    averageCost: z.number().min(0).describe('Average cost of inaction'),
    costTrend: z.enum(['increasing', 'decreasing', 'stable']).describe('Cost trend direction'),
    improvementAreas: z.array(z.string()).describe('Areas showing improvement')
  }).optional()
});

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

/**
 * Cost Calculation Request Schema
 * Validates POST requests for cost calculations
 */
export const CostCalculationRequestSchema = z.object({
  input: CostCalculationInputSchema,
  options: z.object({
    includeInsights: z.boolean().optional().default(true).describe('Include detailed insights'),
    includeRecommendations: z.boolean().optional().default(true).describe('Include recommendations'),
    includeRiskAnalysis: z.boolean().optional().default(true).describe('Include risk analysis'),
    calculationMethod: z.enum(['standard', 'ai_enhanced']).optional().default('standard').describe('Calculation method')
  }).optional()
});

/**
 * Cost Comparison Request Schema
 * Validates POST requests for cost comparisons
 */
export const CostComparisonRequestSchema = z.object({
  scenarios: z.array(CostCalculationScenarioSchema).min(2).max(5).describe('Scenarios to compare'),
  options: z.object({
    includeAnalysis: z.boolean().optional().default(true).describe('Include detailed analysis'),
    includeRecommendations: z.boolean().optional().default(true).describe('Include recommendations'),
    rankingMethod: z.enum(['total_cost', 'roi', 'payback_period']).optional().default('total_cost').describe('Ranking method')
  }).optional()
});

/**
 * Cost History Request Schema
 * Validates GET requests for cost calculation history
 */
export const CostHistoryRequestSchema = z.object({
  limit: z.number().min(1).max(100).optional().default(20).describe('Number of entries to return'),
  offset: z.number().min(0).optional().default(0).describe('Number of entries to skip'),
  dateRange: z.object({
    start: z.string().datetime().optional().describe('Start date filter'),
    end: z.string().datetime().optional().describe('End date filter')
  }).optional(),
  includeTrends: z.boolean().optional().default(false).describe('Include trend analysis')
});

/**
 * Cost Export Request Schema
 * Validates POST requests for cost calculation export
 */
export const CostExportRequestSchema = z.object({
  calculationId: z.string().uuid().optional().describe('Specific calculation ID to export'),
  format: z.enum(['pdf', 'excel', 'csv', 'json']).describe('Export format'),
  includeCharts: z.boolean().optional().default(true).describe('Include charts in export'),
  includeRecommendations: z.boolean().optional().default(true).describe('Include recommendations'),
  dateRange: z.object({
    start: z.string().datetime().optional().describe('Export start date'),
    end: z.string().datetime().optional().describe('Export end date')
  }).optional()
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Cost Calculation Response Schema
 * Validates responses from cost calculation endpoint
 */
export const CostCalculationResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  data: CostCalculationResultSchema.optional().describe('Calculation result data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable'),
  processingTime: z.number().optional().describe('Total processing time in milliseconds')
});

/**
 * Cost Comparison Response Schema
 * Validates responses from cost comparison endpoint
 */
export const CostComparisonResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  data: CostComparisonResultSchema.optional().describe('Comparison result data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable'),
  processingTime: z.number().optional().describe('Total processing time in milliseconds')
});

/**
 * Cost History Response Schema
 * Validates responses from cost history endpoint
 */
export const CostHistoryResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  data: CostCalculationHistorySchema.optional().describe('History data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable'),
  pagination: z.object({
    total: z.number().min(0).describe('Total number of entries'),
    limit: z.number().min(1).describe('Number of entries per page'),
    offset: z.number().min(0).describe('Current offset'),
    hasMore: z.boolean().describe('Whether more entries are available')
  }).optional()
});

/**
 * Cost Export Response Schema
 * Validates responses from cost export endpoint
 */
export const CostExportResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  data: z.object({
    exportId: z.string().uuid().describe('Export ID'),
    format: z.string().describe('Export format'),
    downloadUrl: z.string().url().optional().describe('Download URL'),
    expiresAt: z.string().datetime().optional().describe('Download expiration time'),
    fileSize: z.number().min(0).optional().describe('File size in bytes')
  }).optional().describe('Export data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate cost calculation request
 */
export function validateCostCalculationRequest(data: unknown) {
  return CostCalculationRequestSchema.parse(data);
}

/**
 * Validate cost comparison request
 */
export function validateCostComparisonRequest(data: unknown) {
  return CostComparisonRequestSchema.parse(data);
}

/**
 * Validate cost history request
 */
export function validateCostHistoryRequest(data: unknown) {
  return CostHistoryRequestSchema.parse(data);
}

/**
 * Validate cost export request
 */
export function validateCostExportRequest(data: unknown) {
  return CostExportRequestSchema.parse(data);
}

/**
 * Validate cost calculation response
 */
export function validateCostCalculationResponse(data: unknown) {
  return CostCalculationResponseSchema.parse(data);
}

/**
 * Validate cost comparison response
 */
export function validateCostComparisonResponse(data: unknown) {
  return CostComparisonResponseSchema.parse(data);
}

/**
 * Validate cost history response
 */
export function validateCostHistoryResponse(data: unknown) {
  return CostHistoryResponseSchema.parse(data);
}

/**
 * Validate cost export response
 */
export function validateCostExportResponse(data: unknown) {
  return CostExportResponseSchema.parse(data);
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CostCalculationInput = z.infer<typeof CostCalculationInputSchema>;
export type CostCalculationScenario = z.infer<typeof CostCalculationScenarioSchema>;
export type CostCalculationDetails = z.infer<typeof CostCalculationDetailsSchema>;
export type CostCalculationInsights = z.infer<typeof CostCalculationInsightsSchema>;
export type CostCalculationMetadata = z.infer<typeof CostCalculationMetadataSchema>;
export type CostCalculationResult = z.infer<typeof CostCalculationResultSchema>;
export type CostComparisonScenario = z.infer<typeof CostComparisonScenarioSchema>;
export type CostComparisonAnalysis = z.infer<typeof CostComparisonAnalysisSchema>;
export type CostComparisonResult = z.infer<typeof CostComparisonResultSchema>;
export type CostCalculationHistoryEntry = z.infer<typeof CostCalculationHistoryEntrySchema>;
export type CostCalculationHistory = z.infer<typeof CostCalculationHistorySchema>;

export type CostCalculationRequest = z.infer<typeof CostCalculationRequestSchema>;
export type CostComparisonRequest = z.infer<typeof CostComparisonRequestSchema>;
export type CostHistoryRequest = z.infer<typeof CostHistoryRequestSchema>;
export type CostExportRequest = z.infer<typeof CostExportRequestSchema>;

export type CostCalculationResponse = z.infer<typeof CostCalculationResponseSchema>;
export type CostComparisonResponse = z.infer<typeof CostComparisonResponseSchema>;
export type CostHistoryResponse = z.infer<typeof CostHistoryResponseSchema>;
export type CostExportResponse = z.infer<typeof CostExportResponseSchema>;
