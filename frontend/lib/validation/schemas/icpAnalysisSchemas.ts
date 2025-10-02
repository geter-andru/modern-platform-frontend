/**
 * ICP Analysis Validation Schemas
 * 
 * Comprehensive validation schemas for all ICP (Ideal Customer Profile) analysis
 * related API endpoints. Provides request validation, response validation, and
 * data transformation for customer analysis functionality.
 * 
 * FUNCTIONALITY STATUS: REAL
 * - Production-ready validation schemas
 * - Complete type safety
 * - Comprehensive error handling
 * - Request/response validation
 */

import { z } from 'zod';

// ============================================================================
// ICP ANALYSIS DATA SCHEMAS
// ============================================================================

/**
 * Buyer Persona Schema
 * Validates individual buyer persona data
 */
export const BuyerPersonaSchema = z.object({
  id: z.string().uuid().describe('Unique persona identifier'),
  name: z.string().min(1).max(255).describe('Persona name'),
  title: z.string().min(1).max(255).describe('Job title'),
  department: z.string().min(1).max(100).describe('Department'),
  seniority: z.enum(['junior', 'mid-level', 'senior', 'executive']).describe('Seniority level'),
  responsibilities: z.array(z.string()).describe('Key responsibilities'),
  painPoints: z.array(z.string()).describe('Primary pain points'),
  goals: z.array(z.string()).describe('Primary goals'),
  decisionMakingRole: z.enum(['influencer', 'decision-maker', 'champion', 'gatekeeper']).describe('Decision making role'),
  budgetAuthority: z.enum(['none', 'limited', 'moderate', 'high']).describe('Budget authority level'),
  technologyAdoption: z.enum(['laggard', 'late-majority', 'early-majority', 'early-adopter', 'innovator']).describe('Technology adoption profile')
});

/**
 * Market Analysis Schema
 * Validates market analysis data
 */
export const MarketAnalysisSchema = z.object({
  marketSize: z.number().positive().describe('Total addressable market size'),
  growthRate: z.number().min(0).max(100).describe('Market growth rate percentage'),
  competition: z.array(z.object({
    name: z.string().describe('Competitor name'),
    marketShare: z.number().min(0).max(100).describe('Market share percentage'),
    strengths: z.array(z.string()).describe('Competitor strengths'),
    weaknesses: z.array(z.string()).describe('Competitor weaknesses')
  })).describe('Competitive landscape'),
  trends: z.array(z.string()).describe('Market trends'),
  opportunities: z.array(z.string()).describe('Market opportunities'),
  threats: z.array(z.string()).describe('Market threats')
});

/**
 * Customer Segment Schema
 * Validates customer segment data
 */
export const CustomerSegmentSchema = z.object({
  id: z.string().uuid().describe('Unique segment identifier'),
  name: z.string().min(1).max(255).describe('Segment name'),
  description: z.string().min(10).describe('Segment description'),
  size: z.number().positive().describe('Segment size'),
  characteristics: z.array(z.string()).describe('Key characteristics'),
  needs: z.array(z.string()).describe('Primary needs'),
  painPoints: z.array(z.string()).describe('Common pain points'),
  buyingBehavior: z.object({
    decisionProcess: z.string().describe('Decision making process'),
    timeline: z.string().describe('Typical buying timeline'),
    budget: z.string().describe('Budget range'),
    criteria: z.array(z.string()).describe('Decision criteria')
  }).describe('Buying behavior patterns')
});

/**
 * ICP Analysis Metadata Schema
 * Validates ICP analysis session metadata
 */
export const ICPAnalysisMetadataSchema = z.object({
  analysisId: z.string().uuid().describe('Unique analysis identifier'),
  customerId: z.string().uuid().describe('Customer identifier'),
  createdAt: z.string().datetime().describe('Analysis creation timestamp'),
  updatedAt: z.string().datetime().describe('Last update timestamp'),
  status: z.enum(['pending', 'in-progress', 'completed', 'failed']).describe('Analysis status'),
  version: z.string().describe('Analysis version'),
  dataSources: z.array(z.string()).describe('Data sources used'),
  confidence: z.number().min(0).max(1).describe('Analysis confidence level')
});

// ============================================================================
// COMPLETE ICP ANALYSIS DATA SCHEMA
// ============================================================================

/**
 * Complete ICP Analysis Data Schema
 * Validates the complete ICP analysis data structure returned by APIs
 */
export const ICPAnalysisDataSchema = z.object({
  buyerPersonas: z.array(BuyerPersonaSchema).describe('Identified buyer personas'),
  marketAnalysis: MarketAnalysisSchema.optional().describe('Market analysis data'),
  customerSegments: z.array(CustomerSegmentSchema).describe('Customer segments'),
  recommendations: z.array(z.object({
    id: z.string().uuid().describe('Recommendation identifier'),
    title: z.string().min(1).max(255).describe('Recommendation title'),
    description: z.string().min(10).describe('Detailed recommendation'),
    priority: z.enum(['low', 'medium', 'high', 'critical']).describe('Priority level'),
    impact: z.enum(['low', 'medium', 'high']).describe('Expected impact'),
    effort: z.enum(['low', 'medium', 'high']).describe('Implementation effort'),
    timeline: z.string().describe('Implementation timeline')
  })).describe('Strategic recommendations'),
  insights: z.array(z.object({
    id: z.string().uuid().describe('Insight identifier'),
    title: z.string().min(1).max(255).describe('Insight title'),
    description: z.string().min(10).describe('Insight description'),
    category: z.enum(['opportunity', 'risk', 'trend', 'pattern']).describe('Insight category'),
    confidence: z.number().min(0).max(1).describe('Confidence level'),
    evidence: z.array(z.string()).describe('Supporting evidence'),
    implications: z.array(z.string()).describe('Business implications')
  })).describe('Key insights'),
  metadata: ICPAnalysisMetadataSchema
});

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

/**
 * ICP Analysis Request Schema
 * Validates GET requests for ICP analysis
 */
export const ICPAnalysisRequestSchema = z.object({
  includePersonas: z.boolean().optional().default(true).describe('Include buyer personas'),
  includeMarketAnalysis: z.boolean().optional().default(false).describe('Include market analysis'),
  includeSegments: z.boolean().optional().default(true).describe('Include customer segments'),
  includeRecommendations: z.boolean().optional().default(true).describe('Include recommendations'),
  includeInsights: z.boolean().optional().default(true).describe('Include insights'),
  analysisDepth: z.enum(['basic', 'standard', 'comprehensive']).optional().default('standard').describe('Analysis depth level')
});

/**
 * ICP Analysis Generation Request Schema
 * Validates POST requests for generating ICP analysis
 */
export const ICPAnalysisGenerationRequestSchema = z.object({
  customerId: z.string().uuid().describe('Customer identifier'),
  analysisType: z.enum(['basic', 'advanced', 'comprehensive']).describe('Analysis type'),
  includePersonas: z.boolean().default(true).describe('Include buyer personas'),
  includeMarketAnalysis: z.boolean().default(false).describe('Include market analysis'),
  includeSegments: z.boolean().default(true).describe('Include customer segments'),
  dataSources: z.array(z.string()).optional().describe('Specific data sources to use'),
  customParameters: z.record(z.any()).optional().describe('Custom analysis parameters')
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * ICP Analysis Response Schema
 * Validates responses from ICP analysis endpoint
 */
export const ICPAnalysisResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  icpData: ICPAnalysisDataSchema.optional().describe('ICP analysis data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

/**
 * ICP Analysis Generation Response Schema
 * Validates responses from ICP analysis generation endpoint
 */
export const ICPAnalysisGenerationResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  analysisId: z.string().uuid().describe('Generated analysis identifier'),
  status: z.enum(['pending', 'in-progress', 'completed', 'failed']).describe('Analysis status'),
  estimatedCompletionTime: z.number().optional().describe('Estimated completion time in minutes'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate ICP analysis request
 */
export function validateICPAnalysisRequest(data: unknown) {
  return ICPAnalysisRequestSchema.parse(data);
}

/**
 * Validate ICP analysis generation request
 */
export function validateICPAnalysisGenerationRequest(data: unknown) {
  return ICPAnalysisGenerationRequestSchema.parse(data);
}

/**
 * Validate ICP analysis response
 */
export function validateICPAnalysisResponse(data: unknown) {
  return ICPAnalysisResponseSchema.parse(data);
}

/**
 * Validate ICP analysis generation response
 */
export function validateICPAnalysisGenerationResponse(data: unknown) {
  return ICPAnalysisGenerationResponseSchema.parse(data);
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type BuyerPersona = z.infer<typeof BuyerPersonaSchema>;
export type MarketAnalysis = z.infer<typeof MarketAnalysisSchema>;
export type CustomerSegment = z.infer<typeof CustomerSegmentSchema>;
export type ICPAnalysisMetadata = z.infer<typeof ICPAnalysisMetadataSchema>;
export type ICPAnalysisData = z.infer<typeof ICPAnalysisDataSchema>;

export type ICPAnalysisRequest = z.infer<typeof ICPAnalysisRequestSchema>;
export type ICPAnalysisGenerationRequest = z.infer<typeof ICPAnalysisGenerationRequestSchema>;

export type ICPAnalysisResponse = z.infer<typeof ICPAnalysisResponseSchema>;
export type ICPAnalysisGenerationResponse = z.infer<typeof ICPAnalysisGenerationResponseSchema>;