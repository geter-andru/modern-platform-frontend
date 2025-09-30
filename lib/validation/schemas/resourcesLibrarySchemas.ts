/**
 * Resources Library Validation Schemas
 * 
 * Comprehensive TypeScript validation schemas for the three-tier Resources Library system.
 * Includes all data types, API request/response schemas, and validation rules.
 */

import { z } from 'zod';

// ===========================================
// CORE RESOURCE TYPES
// ===========================================

export const ResourceTierSchema = z.enum([1, 2, 3]);
export type ResourceTier = z.infer<typeof ResourceTierSchema>;

export const ResourceCategorySchema = z.enum([
  'buyer_intelligence',
  'sales_frameworks',
  'strategic_tools',
  'implementation_guides',
  'competitive_intelligence',
  'behavioral_analysis'
]);
export type ResourceCategory = z.infer<typeof ResourceCategorySchema>;

export const GenerationStatusSchema = z.enum([
  'pending',
  'generating',
  'completed',
  'failed',
  'archived'
]);
export type GenerationStatus = z.infer<typeof GenerationStatusSchema>;

export const ExportFormatSchema = z.enum(['pdf', 'docx', 'csv', 'json', 'html']);
export type ExportFormat = z.infer<typeof ExportFormatSchema>;

export const DependencyTypeSchema = z.enum([
  'prerequisite',
  'context_enhancer',
  'data_source',
  'template_base'
]);
export type DependencyType = z.infer<typeof DependencyTypeSchema>;

export const AccessTypeSchema = z.enum(['view', 'download', 'export', 'share', 'edit']);
export type AccessType = z.infer<typeof AccessTypeSchema>;

export const CriteriaTypeSchema = z.enum([
  'milestone_completion',
  'tool_usage',
  'competency_threshold',
  'behavioral_trigger',
  'time_based',
  'manual_approval'
]);
export type CriteriaType = z.infer<typeof CriteriaTypeSchema>;

export const TemplateTypeSchema = z.enum([
  'ai_prompt',
  'content_structure',
  'export_format',
  'validation_schema'
]);
export type TemplateType = z.infer<typeof TemplateTypeSchema>;

export const FeedbackTypeSchema = z.enum([
  'quality',
  'usefulness',
  'accuracy',
  'completeness',
  'clarity'
]);
export type FeedbackType = z.infer<typeof FeedbackTypeSchema>;

// ===========================================
// RESOURCE CONTENT SCHEMAS
// ===========================================

export const ResourceSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  order: z.number().int().min(0),
  metadata: z.record(z.any()).optional()
});

export const ResourceTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  content: z.string(),
  variables: z.record(z.any()).optional()
});

export const ResourceFrameworkSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  steps: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    order: z.number().int().min(0)
  })),
  metadata: z.record(z.any()).optional()
});

export const ResourceToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  description: z.string(),
  instructions: z.string(),
  inputs: z.array(z.object({
    name: z.string(),
    type: z.string(),
    required: z.boolean(),
    description: z.string().optional()
  })),
  outputs: z.array(z.object({
    name: z.string(),
    type: z.string(),
    description: z.string().optional()
  })),
  metadata: z.record(z.any()).optional()
});

export const ResourceContentSchema = z.object({
  sections: z.array(ResourceSectionSchema),
  templates: z.array(ResourceTemplateSchema).optional(),
  frameworks: z.array(ResourceFrameworkSchema).optional(),
  tools: z.array(ResourceToolSchema).optional(),
  metadata: z.record(z.any()).optional()
});

// ===========================================
// MAIN RESOURCE SCHEMA
// ===========================================

export const ResourceSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string(),
  tier: ResourceTierSchema,
  category: ResourceCategorySchema,
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  content: ResourceContentSchema,
  metadata: z.record(z.any()).default({}),
  dependencies: z.array(z.string()).default([]),
  unlock_criteria: z.record(z.any()).default({}),
  export_formats: z.array(ExportFormatSchema).default(['pdf', 'docx', 'csv']),
  generation_status: GenerationStatusSchema.default('pending'),
  ai_context: z.record(z.any()).default({}),
  generation_time_ms: z.number().int().min(0).optional(),
  access_count: z.number().int().min(0).default(0),
  last_accessed: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export type Resource = z.infer<typeof ResourceSchema>;

// ===========================================
// RESOURCE DEPENDENCY SCHEMA
// ===========================================

export const ResourceDependencySchema = z.object({
  id: z.string().uuid(),
  resource_id: z.string().uuid(),
  depends_on_resource_id: z.string().uuid(),
  dependency_type: DependencyTypeSchema,
  context_data: z.record(z.any()).default({}),
  created_at: z.string().datetime()
});

export type ResourceDependency = z.infer<typeof ResourceDependencySchema>;

// ===========================================
// GENERATION LOG SCHEMA
// ===========================================

export const GenerationLogStatusSchema = z.enum([
  'initiated',
  'ai_processing',
  'content_generation',
  'validation',
  'completed',
  'failed'
]);

export const ResourceGenerationLogSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string(),
  resource_id: z.string().uuid().optional(),
  generation_status: GenerationLogStatusSchema,
  ai_context: z.record(z.any()).default({}),
  generation_time_ms: z.number().int().min(0).optional(),
  tokens_used: z.number().int().min(0).optional(),
  cost_estimate: z.number().min(0).optional(),
  error_message: z.string().optional(),
  retry_count: z.number().int().min(0).default(0),
  created_at: z.string().datetime()
});

export type ResourceGenerationLog = z.infer<typeof ResourceGenerationLogSchema>;

// ===========================================
// ACCESS TRACKING SCHEMA
// ===========================================

export const ResourceAccessTrackingSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string(),
  resource_id: z.string().uuid(),
  access_type: AccessTypeSchema,
  access_count: z.number().int().min(1).default(1),
  last_accessed: z.string().datetime(),
  session_id: z.string().optional(),
  user_agent: z.string().optional(),
  ip_address: z.string().optional(),
  created_at: z.string().datetime()
});

export type ResourceAccessTracking = z.infer<typeof ResourceAccessTrackingSchema>;

// ===========================================
// UNLOCK CRITERIA SCHEMA
// ===========================================

export const ResourceUnlockCriteriaSchema = z.object({
  id: z.string().uuid(),
  resource_id: z.string().uuid(),
  criteria_type: CriteriaTypeSchema,
  criteria_config: z.record(z.any()),
  is_required: z.boolean().default(true),
  created_at: z.string().datetime()
});

export type ResourceUnlockCriteria = z.infer<typeof ResourceUnlockCriteriaSchema>;

// ===========================================
// TEMPLATE SCHEMA (Already defined above)
// ===========================================

// ===========================================
// EXPORT SCHEMA
// ===========================================

export const ExportStatusSchema = z.enum(['pending', 'processing', 'completed', 'failed']);

export const ResourceExportSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string(),
  resource_id: z.string().uuid(),
  export_format: ExportFormatSchema,
  export_status: ExportStatusSchema.default('pending'),
  file_path: z.string().optional(),
  file_size_bytes: z.number().int().min(0).optional(),
  download_url: z.string().url().optional(),
  expires_at: z.string().datetime().optional(),
  created_at: z.string().datetime()
});

export type ResourceExport = z.infer<typeof ResourceExportSchema>;

// ===========================================
// FEEDBACK SCHEMA
// ===========================================

export const ResourceFeedbackSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string(),
  resource_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5).optional(),
  feedback_text: z.string().optional(),
  feedback_type: FeedbackTypeSchema.optional(),
  is_helpful: z.boolean().optional(),
  created_at: z.string().datetime()
});

export type ResourceFeedback = z.infer<typeof ResourceFeedbackSchema>;

// ===========================================
// CUMULATIVE INTELLIGENCE CONTEXT SCHEMA
// ===========================================

export const CumulativeIntelligenceContextSchema = z.object({
  product_details: z.record(z.any()),
  icp_analysis: z.record(z.any()).optional(),
  buyer_personas: z.array(z.record(z.any())).optional(),
  rating_system: z.record(z.any()).optional(),
  company_ratings: z.array(z.record(z.any())).optional(),
  technical_translations: z.array(z.record(z.any())).optional(),
  resources_library: z.array(ResourceSchema).optional(),
  customer_progress: z.record(z.any()).optional(),
  behavioral_data: z.record(z.any()).optional()
});

export type CumulativeIntelligenceContext = z.infer<typeof CumulativeIntelligenceContextSchema>;

// ===========================================
// API REQUEST/RESPONSE SCHEMAS
// ===========================================

// Generate Resource Request
export const GenerateResourceRequestSchema = z.object({
  customer_id: z.string(),
  resource_type: z.string(),
  tier: ResourceTierSchema,
  category: ResourceCategorySchema,
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  context: CumulativeIntelligenceContextSchema,
  dependencies: z.array(z.string()).optional(),
  unlock_criteria: z.record(z.any()).optional()
});

export type GenerateResourceRequest = z.infer<typeof GenerateResourceRequestSchema>;

// Generate Resource Response
export const GenerateResourceResponseSchema = z.object({
  success: z.boolean(),
  data: ResourceSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
  generation_log_id: z.string().uuid().optional()
});

export type GenerateResourceResponse = z.infer<typeof GenerateResourceResponseSchema>;

// Get Resources Request
export const GetResourcesRequestSchema = z.object({
  customer_id: z.string(),
  tier: ResourceTierSchema.optional(),
  category: ResourceCategorySchema.optional(),
  status: GenerationStatusSchema.optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
});

export type GetResourcesRequest = z.infer<typeof GetResourcesRequestSchema>;

// Get Resources Response
export const GetResourcesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ResourceSchema).optional(),
  error: z.string().optional(),
  total_count: z.number().int().min(0).optional(),
  has_more: z.boolean().optional()
});

export type GetResourcesResponse = z.infer<typeof GetResourcesResponseSchema>;

// Check Unlock Status Request
export const CheckUnlockStatusRequestSchema = z.object({
  customer_id: z.string(),
  tier: ResourceTierSchema.optional(),
  resource_id: z.string().uuid().optional()
});

export type CheckUnlockStatusRequest = z.infer<typeof CheckUnlockStatusRequestSchema>;

// Check Unlock Status Response
export const CheckUnlockStatusResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    unlocked_resources: z.array(z.string()),
    locked_resources: z.array(z.object({
      resource_id: z.string(),
      reason: z.string(),
      criteria_needed: z.record(z.any())
    })),
    progress: z.record(z.any())
  }).optional(),
  error: z.string().optional()
});

export type CheckUnlockStatusResponse = z.infer<typeof CheckUnlockStatusResponseSchema>;

// Export Resource Request
export const ExportResourceRequestSchema = z.object({
  customer_id: z.string(),
  resource_id: z.string().uuid(),
  export_format: ExportFormatSchema,
  options: z.record(z.any()).optional()
});

export type ExportResourceRequest = z.infer<typeof ExportResourceRequestSchema>;

// Export Resource Response
export const ExportResourceResponseSchema = z.object({
  success: z.boolean(),
  data: ResourceExportSchema.optional(),
  error: z.string().optional(),
  download_url: z.string().url().optional()
});

export type ExportResourceResponse = z.infer<typeof ExportResourceResponseSchema>;

// Track Access Request
export const TrackAccessRequestSchema = z.object({
  customer_id: z.string(),
  resource_id: z.string().uuid(),
  access_type: AccessTypeSchema,
  session_id: z.string().optional(),
  user_agent: z.string().optional(),
  ip_address: z.string().optional()
});

export type TrackAccessRequest = z.infer<typeof TrackAccessRequestSchema>;

// Submit Feedback Request
export const SubmitFeedbackRequestSchema = z.object({
  customer_id: z.string(),
  resource_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5).optional(),
  feedback_text: z.string().optional(),
  feedback_type: FeedbackTypeSchema.optional(),
  is_helpful: z.boolean().optional()
});

export type SubmitFeedbackRequest = z.infer<typeof SubmitFeedbackRequestSchema>;

// ===========================================
// VALIDATION HELPERS
// ===========================================

export const validateResourceTier = (tier: number): tier is ResourceTier => {
  return ResourceTierSchema.safeParse(tier).success;
};

export const validateResourceCategory = (category: string): category is ResourceCategory => {
  return ResourceCategorySchema.safeParse(category).success;
};

export const validateExportFormat = (format: string): format is ExportFormat => {
  return ExportFormatSchema.safeParse(format).success;
};

export const validateGenerationStatus = (status: string): status is GenerationStatus => {
  return GenerationStatusSchema.safeParse(status).success;
};

// ===========================================
// SCHEMA EXPORTS
// ===========================================

// All schemas are exported individually above
