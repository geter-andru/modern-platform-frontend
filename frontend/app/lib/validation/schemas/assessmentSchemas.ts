/**
 * Assessment Validation Schemas
 * 
 * Comprehensive validation schemas for all assessment-related API endpoints.
 * Provides request validation, response validation, and data transformation.
 * 
 * FUNCTIONALITY STATUS: REAL
 * - Production-ready validation schemas
 * - Complete type safety
 * - Comprehensive error handling
 * - Request/response validation
 */

import { z } from 'zod';

// ============================================================================
// ASSESSMENT SESSION DATA SCHEMAS
// ============================================================================

/**
 * Assessment Results Schema
 * Validates the structure of assessment results data
 */
export const AssessmentResultsSchema = z.object({
  overallScore: z.number().min(0).max(100).describe('Overall assessment score (0-100)'),
  buyerScore: z.number().min(0).max(100).describe('Buyer competency score (0-100)'),
  techScore: z.number().min(0).max(100).describe('Technical competency score (0-100)'),
  qualification: z.enum(['Foundation', 'Developing', 'Proficient', 'Advanced', 'Expert'])
    .describe('Qualification level based on assessment results')
});

/**
 * Generated Content Schema
 * Validates AI-generated content from assessments
 */
export const GeneratedContentSchema = z.object({
  buyerGap: z.object({
    analysis: z.string().min(10).describe('Buyer gap analysis'),
    recommendations: z.array(z.string()).describe('Gap closure recommendations'),
    priority: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('Priority level')
  }).optional(),
  icp: z.object({
    profile: z.string().min(10).describe('Ideal Customer Profile description'),
    characteristics: z.array(z.string()).describe('Key customer characteristics'),
    painPoints: z.array(z.string()).describe('Primary pain points')
  }).optional(),
  tbp: z.object({
    process: z.string().min(10).describe('Target Buying Process description'),
    stages: z.array(z.string()).describe('Buying process stages'),
    decisionMakers: z.array(z.string()).describe('Key decision makers')
  }).optional()
});

/**
 * User Information Schema
 * Validates user information in assessment context
 */
export const UserInfoSchema = z.object({
  company: z.string().min(1).max(255).describe('Company name'),
  email: z.string().email().describe('User email address'),
  name: z.string().min(1).max(255).describe('User full name'),
  role: z.string().min(1).max(100).describe('User role/title')
});

/**
 * Product Information Schema
 * Validates product-related information
 */
export const ProductInfoSchema = z.object({
  name: z.string().min(1).max(255).describe('Product name'),
  description: z.string().min(10).describe('Product description'),
  category: z.string().min(1).max(100).describe('Product category'),
  features: z.array(z.string()).describe('Key product features'),
  pricing: z.object({
    model: z.enum(['subscription', 'one-time', 'freemium', 'enterprise']),
    range: z.string().describe('Price range description')
  }).optional()
}).optional();

/**
 * Challenge Schema
 * Validates individual challenges identified in assessment
 */
export const ChallengeSchema = z.object({
  id: z.string().uuid().describe('Unique challenge identifier'),
  name: z.string().min(1).max(255).describe('Challenge name'),
  description: z.string().min(10).describe('Challenge description'),
  category: z.enum(['Technical', 'Process', 'Communication', 'Strategy', 'Execution']),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
  impact: z.string().describe('Business impact description'),
  recommendations: z.array(z.string()).describe('Recommended solutions')
});

/**
 * Recommendation Schema
 * Validates assessment recommendations
 */
export const RecommendationSchema = z.object({
  id: z.string().uuid().describe('Unique recommendation identifier'),
  title: z.string().min(1).max(255).describe('Recommendation title'),
  description: z.string().min(10).describe('Detailed recommendation description'),
  category: z.enum(['Training', 'Process', 'Tool', 'Strategy', 'Communication']),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  effort: z.enum(['Low', 'Medium', 'High']).describe('Implementation effort level'),
  impact: z.enum(['Low', 'Medium', 'High']).describe('Expected impact level'),
  timeline: z.string().describe('Recommended implementation timeline')
});

/**
 * Insight Schema
 * Validates assessment insights
 */
export const InsightSchema = z.object({
  id: z.string().uuid().describe('Unique insight identifier'),
  title: z.string().min(1).max(255).describe('Insight title'),
  description: z.string().min(10).describe('Insight description'),
  category: z.enum(['Strength', 'Opportunity', 'Risk', 'Trend', 'Pattern']),
  confidence: z.number().min(0).max(1).describe('Confidence level (0-1)'),
  evidence: z.array(z.string()).describe('Supporting evidence'),
  implications: z.array(z.string()).describe('Business implications')
});

/**
 * Assessment Metadata Schema
 * Validates assessment session metadata
 */
export const AssessmentMetadataSchema = z.object({
  sessionId: z.string().uuid().describe('Unique session identifier'),
  createdAt: z.string().datetime().describe('Session creation timestamp'),
  updatedAt: z.string().datetime().describe('Last update timestamp'),
  status: z.enum(['In Progress', 'Completed', 'Failed', 'Cancelled']).describe('Session status'),
  version: z.string().describe('Assessment version'),
  duration: z.number().min(0).describe('Assessment duration in minutes')
});

// ============================================================================
// COMPLETE ASSESSMENT DATA SCHEMA
// ============================================================================

/**
 * Complete Assessment Data Schema
 * Validates the complete assessment data structure returned by APIs
 */
export const AssessmentDataSchema = z.object({
  results: AssessmentResultsSchema,
  generatedContent: GeneratedContentSchema,
  userInfo: UserInfoSchema,
  productInfo: ProductInfoSchema,
  questionTimings: z.record(z.number()).describe('Question response timings'),
  challenges: z.array(ChallengeSchema).optional(),
  recommendations: z.array(RecommendationSchema).optional(),
  insights: z.array(InsightSchema).optional(),
  metadata: AssessmentMetadataSchema
});

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

/**
 * Assessment Results Request Schema
 * Validates GET requests for assessment results
 */
export const AssessmentResultsRequestSchema = z.object({
  includeDetails: z.boolean().optional().default(false).describe('Include detailed analysis'),
  includeRecommendations: z.boolean().optional().default(true).describe('Include recommendations'),
  includeInsights: z.boolean().optional().default(true).describe('Include insights')
});

/**
 * Assessment Status Request Schema
 * Validates GET requests for assessment status
 */
export const AssessmentStatusRequestSchema = z.object({
  includeProgress: z.boolean().optional().default(true).describe('Include progress information'),
  includeHistory: z.boolean().optional().default(false).describe('Include assessment history')
});

/**
 * Assessment Action Request Schema
 * Validates POST requests for assessment actions
 */
export const AssessmentActionRequestSchema = z.object({
  action: z.enum(['start', 'pause', 'resume', 'complete', 'reset']).describe('Action to perform'),
  data: z.record(z.any()).optional().describe('Additional action data')
});

/**
 * Assessment Sync Request Schema
 * Validates POST requests for assessment synchronization
 */
export const AssessmentSyncRequestSchema = z.object({
  source: z.enum(['andru-assessment', 'platform', 'external']).describe('Data source'),
  sessionId: z.string().uuid().optional().describe('External session ID'),
  userId: z.string().uuid().optional().describe('External user ID'),
  forceUpdate: z.boolean().optional().default(false).describe('Force data update')
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Assessment Results Response Schema
 * Validates responses from assessment results endpoint
 */
export const AssessmentResultsResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  assessmentData: AssessmentDataSchema.optional().describe('Assessment data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

/**
 * Assessment Status Response Schema
 * Validates responses from assessment status endpoint
 */
export const AssessmentStatusResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  status: z.object({
    hasAssessment: z.boolean().describe('Whether user has completed assessment'),
    currentLevel: z.enum(['Foundation', 'Developing', 'Proficient', 'Advanced', 'Expert']).optional(),
    progress: z.number().min(0).max(100).optional().describe('Assessment progress percentage'),
    lastUpdated: z.string().datetime().optional().describe('Last assessment update'),
    toolAccess: z.array(z.string()).optional().describe('Available tools based on level')
  }),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

/**
 * Assessment Action Response Schema
 * Validates responses from assessment action endpoint
 */
export const AssessmentActionResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  action: z.string().describe('Action performed'),
  result: z.any().describe('Action result data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

/**
 * Assessment Sync Response Schema
 * Validates responses from assessment sync endpoint
 */
export const AssessmentSyncResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  synced: z.boolean().describe('Whether data was successfully synced'),
  data: z.any().optional().describe('Synced data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

/**
 * Assessment Summary Request Schema
 * Validates GET requests for assessment summary
 */
export const AssessmentSummaryRequestSchema = z.object({
  includeBaselines: z.boolean().optional().default(true).describe('Include baseline metrics'),
  includeProgress: z.boolean().optional().default(true).describe('Include progress information'),
  includeRecommendations: z.boolean().optional().default(false).describe('Include improvement recommendations')
});

/**
 * Assessment Summary Response Schema
 * Validates responses from assessment summary endpoint
 */
export const AssessmentSummaryResponseSchema = z.object({
  hasAssessmentData: z.boolean().describe('Whether user has assessment data'),
  message: z.string().describe('Response message'),
  baselines: z.object({
    // Core Performance Metrics
    overallScore: z.number().min(0).max(100).describe('Overall assessment score'),
    buyerScore: z.number().min(0).max(100).describe('Buyer competency score'),
    techScore: z.number().min(0).max(100).describe('Technical competency score'),
    qualification: z.string().describe('Qualification level'),
    
    // Professional Level Classification
    professionalLevel: z.string().describe('Professional level classification'),
    percentile: z.number().min(0).max(100).describe('Performance percentile'),
    
    // Key Performance Indicators
    buyerGap: z.number().optional().describe('Buyer gap score'),
    hasProductInfo: z.boolean().describe('Whether product info is available'),
    hasChallenges: z.boolean().describe('Whether challenges are identified'),
    hasRecommendations: z.boolean().describe('Whether recommendations are available'),
    
    // Assessment Metadata
    assessmentDate: z.string().datetime().describe('Assessment completion date'),
    lastUpdated: z.string().datetime().describe('Last update timestamp'),
    sessionId: z.string().describe('Assessment session ID'),
    
    // Dashboard Integration Flags
    canGenerateICP: z.boolean().describe('Can generate ICP analysis'),
    canBuildBusinessCase: z.boolean().describe('Can build business case'),
    canAccessAdvancedFeatures: z.boolean().describe('Can access advanced features'),
    
    // Progress Tracking Baselines
    baselineMetrics: z.object({
      customerUnderstanding: z.number().min(0).max(100).describe('Customer understanding score'),
      technicalTranslation: z.number().min(0).max(100).describe('Technical translation score'),
      overallReadiness: z.number().min(0).max(100).describe('Overall readiness score')
    }),
    
    // Improvement Areas
    improvementAreas: z.array(z.string()).describe('Areas for improvement'),
    
    // Strength Areas
    strengthAreas: z.array(z.string()).describe('Areas of strength')
  }).nullable().describe('Assessment baseline data')
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate assessment results request
 */
export function validateAssessmentResultsRequest(data: unknown) {
  return AssessmentResultsRequestSchema.parse(data);
}

/**
 * Validate assessment status request
 */
export function validateAssessmentStatusRequest(data: unknown) {
  return AssessmentStatusRequestSchema.parse(data);
}

/**
 * Validate assessment action request
 */
export function validateAssessmentActionRequest(data: unknown) {
  return AssessmentActionRequestSchema.parse(data);
}

/**
 * Validate assessment sync request
 */
export function validateAssessmentSyncRequest(data: unknown) {
  return AssessmentSyncRequestSchema.parse(data);
}

/**
 * Validate assessment results response
 */
export function validateAssessmentResultsResponse(data: unknown) {
  return AssessmentResultsResponseSchema.parse(data);
}

/**
 * Validate assessment status response
 */
export function validateAssessmentStatusResponse(data: unknown) {
  return AssessmentStatusResponseSchema.parse(data);
}

/**
 * Validate assessment action response
 */
export function validateAssessmentActionResponse(data: unknown) {
  return AssessmentActionResponseSchema.parse(data);
}

/**
 * Validate assessment sync response
 */
export function validateAssessmentSyncResponse(data: unknown) {
  return AssessmentSyncResponseSchema.parse(data);
}

/**
 * Validate assessment summary request
 */
export function validateAssessmentSummaryRequest(data: unknown) {
  return AssessmentSummaryRequestSchema.parse(data);
}

/**
 * Validate assessment summary response
 */
export function validateAssessmentSummaryResponse(data: unknown) {
  return AssessmentSummaryResponseSchema.parse(data);
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AssessmentResults = z.infer<typeof AssessmentResultsSchema>;
export type GeneratedContent = z.infer<typeof GeneratedContentSchema>;
export type UserInfo = z.infer<typeof UserInfoSchema>;
export type ProductInfo = z.infer<typeof ProductInfoSchema>;
export type Challenge = z.infer<typeof ChallengeSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
export type Insight = z.infer<typeof InsightSchema>;
export type AssessmentMetadata = z.infer<typeof AssessmentMetadataSchema>;
export type AssessmentData = z.infer<typeof AssessmentDataSchema>;

export type AssessmentResultsRequest = z.infer<typeof AssessmentResultsRequestSchema>;
export type AssessmentStatusRequest = z.infer<typeof AssessmentStatusRequestSchema>;
export type AssessmentActionRequest = z.infer<typeof AssessmentActionRequestSchema>;
export type AssessmentSyncRequest = z.infer<typeof AssessmentSyncRequestSchema>;
export type AssessmentSummaryRequest = z.infer<typeof AssessmentSummaryRequestSchema>;

export type AssessmentResultsResponse = z.infer<typeof AssessmentResultsResponseSchema>;
export type AssessmentStatusResponse = z.infer<typeof AssessmentStatusResponseSchema>;
export type AssessmentActionResponse = z.infer<typeof AssessmentActionResponseSchema>;
export type AssessmentSyncResponse = z.infer<typeof AssessmentSyncResponseSchema>;
export type AssessmentSummaryResponse = z.infer<typeof AssessmentSummaryResponseSchema>;
