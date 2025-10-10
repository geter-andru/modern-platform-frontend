/**
 * Resources Library TypeScript Interfaces
 * 
 * Comprehensive type definitions for the three-tier Resources Library system.
 * Includes all interfaces, types, and enums for type safety and IntelliSense.
 */

// ===========================================
// CORE ENUMS
// ===========================================

export enum ResourceTier {
  CORE = 1,
  ADVANCED = 2,
  STRATEGIC = 3
}

export enum ResourceCategory {
  BUYER_INTELLIGENCE = 'buyer_intelligence',
  SALES_FRAMEWORKS = 'sales_frameworks',
  STRATEGIC_TOOLS = 'strategic_tools',
  IMPLEMENTATION_GUIDES = 'implementation_guides',
  COMPETITIVE_INTELLIGENCE = 'competitive_intelligence',
  BEHAVIORAL_ANALYSIS = 'behavioral_analysis'
}

export enum GenerationStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ARCHIVED = 'archived'
}

export enum ExportFormat {
  PDF = 'pdf',
  DOCX = 'docx',
  CSV = 'csv',
  JSON = 'json',
  HTML = 'html'
}

export enum DependencyType {
  PREREQUISITE = 'prerequisite',
  CONTEXT_ENHANCER = 'context_enhancer',
  DATA_SOURCE = 'data_source',
  TEMPLATE_BASE = 'template_base'
}

export enum AccessType {
  VIEW = 'view',
  DOWNLOAD = 'download',
  EXPORT = 'export',
  SHARE = 'share',
  EDIT = 'edit'
}

export enum CriteriaType {
  MILESTONE_COMPLETION = 'milestone_completion',
  TOOL_USAGE = 'tool_usage',
  COMPETENCY_THRESHOLD = 'competency_threshold',
  BEHAVIORAL_TRIGGER = 'behavioral_trigger',
  TIME_BASED = 'time_based',
  MANUAL_APPROVAL = 'manual_approval'
}

export enum TemplateType {
  AI_PROMPT = 'ai_prompt',
  CONTENT_STRUCTURE = 'content_structure',
  EXPORT_FORMAT = 'export_format',
  VALIDATION_SCHEMA = 'validation_schema'
}

export enum FeedbackType {
  QUALITY = 'quality',
  USEFULNESS = 'usefulness',
  ACCURACY = 'accuracy',
  COMPLETENESS = 'completeness',
  CLARITY = 'clarity'
}

// ===========================================
// CORE INTERFACES
// ===========================================

export interface ResourceSection {
  id: string;
  title: string;
  content: string;
  order: number;
  metadata?: Record<string, any>;
}

export interface ResourceTemplate {
  id: string;
  name: string;
  type: string;
  content: string;
  variables?: Record<string, any>;
}

export interface ResourceFramework {
  id: string;
  name: string;
  description: string;
  steps: ResourceFrameworkStep[];
  metadata?: Record<string, any>;
}

export interface ResourceFrameworkStep {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface ResourceTool {
  id: string;
  name: string;
  type: string;
  description: string;
  instructions: string;
  inputs: ResourceToolInput[];
  outputs: ResourceToolOutput[];
  metadata?: Record<string, any>;
}

export interface ResourceToolInput {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

export interface ResourceToolOutput {
  name: string;
  type: string;
  description?: string;
}

export interface ResourceContent {
  sections: ResourceSection[];
  templates?: ResourceTemplate[];
  frameworks?: ResourceFramework[];
  tools?: ResourceTool[];
  metadata?: Record<string, any>;
}

export interface Resource {
  id: string;
  customer_id: string;
  tier: ResourceTier;
  category: ResourceCategory;
  title: string;
  description?: string;
  content: ResourceContent;
  metadata: Record<string, any>;
  dependencies: string[];
  unlock_criteria: Record<string, any>;
  export_formats: ExportFormat[];
  generation_status: GenerationStatus;
  ai_context: Record<string, any>;
  generation_time_ms?: number;
  access_count: number;
  last_accessed?: string;
  created_at: string;
  updated_at: string;
}

export interface ResourceDependency {
  id: string;
  resource_id: string;
  depends_on_resource_id: string;
  dependency_type: DependencyType;
  context_data: Record<string, any>;
  created_at: string;
}

export interface ResourceGenerationLog {
  id: string;
  customer_id: string;
  resource_id?: string;
  generation_status: GenerationStatus;
  ai_context: Record<string, any>;
  generation_time_ms?: number;
  tokens_used?: number;
  cost_estimate?: number;
  error_message?: string;
  retry_count: number;
  created_at: string;
}

export interface ResourceAccessTracking {
  id: string;
  customer_id: string;
  resource_id: string;
  access_type: AccessType;
  access_count: number;
  last_accessed: string;
  session_id?: string;
  user_agent?: string;
  ip_address?: string;
  created_at: string;
}

export interface ResourceUnlockCriteria {
  id: string;
  resource_id: string;
  criteria_type: CriteriaType;
  criteria_config: Record<string, any>;
  is_required: boolean;
  created_at: string;
}

export interface ResourceTemplate {
  id: string;
  template_name: string;
  template_type: TemplateType;
  tier: ResourceTier;
  category: ResourceCategory;
  template_content: Record<string, any>;
  variables: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResourceExport {
  id: string;
  customer_id: string;
  resource_id: string;
  export_format: ExportFormat;
  export_status: 'pending' | 'processing' | 'completed' | 'failed';
  file_path?: string;
  file_size_bytes?: number;
  download_url?: string;
  expires_at?: string;
  created_at: string;
}

export interface ResourceFeedback {
  id: string;
  customer_id: string;
  resource_id: string;
  rating?: number;
  feedback_text?: string;
  feedback_type?: FeedbackType;
  is_helpful?: boolean;
  created_at: string;
}

// ===========================================
// CUMULATIVE INTELLIGENCE CONTEXT
// ===========================================

export interface CumulativeIntelligenceContext {
  product_details: Record<string, any>;
  icp_analysis?: Record<string, any>;
  buyer_personas?: Record<string, any>[];
  rating_system?: Record<string, any>;
  company_ratings?: Record<string, any>[];
  technical_translations?: Record<string, any>[];
  resources_library?: Resource[];
  customer_progress?: Record<string, any>;
  behavioral_data?: Record<string, any>;
}

// ===========================================
// API REQUEST/RESPONSE INTERFACES
// ===========================================

export interface GenerateResourceRequest {
  customer_id: string;
  resource_type: string;
  tier: ResourceTier;
  category: ResourceCategory;
  title: string;
  description?: string;
  context: CumulativeIntelligenceContext;
  dependencies?: string[];
  unlock_criteria?: Record<string, any>;
}

export interface GenerateResourceResponse {
  success: boolean;
  data?: Resource;
  error?: string;
  message?: string;
  generation_log_id?: string;
}

export interface GetResourcesRequest {
  customer_id: string;
  tier?: ResourceTier;
  category?: ResourceCategory;
  status?: GenerationStatus;
  limit?: number;
  offset?: number;
}

export interface GetResourcesResponse {
  success: boolean;
  data?: Resource[];
  error?: string;
  total_count?: number;
  has_more?: boolean;
}

export interface CheckUnlockStatusRequest {
  customer_id: string;
  tier?: ResourceTier;
  resource_id?: string;
}

export interface CheckUnlockStatusResponse {
  success: boolean;
  data?: {
    unlocked_resources: string[];
    locked_resources: {
      resource_id: string;
      reason: string;
      criteria_needed: Record<string, any>;
    }[];
    progress: Record<string, any>;
  };
  error?: string;
}

export interface ExportResourceRequest {
  customer_id: string;
  resource_id: string;
  export_format: ExportFormat;
  options?: Record<string, any>;
}

export interface ExportResourceResponse {
  success: boolean;
  data?: ResourceExport;
  error?: string;
  download_url?: string;
}

export interface TrackAccessRequest {
  customer_id: string;
  resource_id: string;
  access_type: AccessType;
  session_id?: string;
  user_agent?: string;
  ip_address?: string;
}

export interface SubmitFeedbackRequest {
  customer_id: string;
  resource_id: string;
  rating?: number;
  feedback_text?: string;
  feedback_type?: FeedbackType;
  is_helpful?: boolean;
}

// ===========================================
// SERVICE INTERFACES
// ===========================================

export interface ResourceGenerationService {
  generateResource(
    customerId: string,
    resourceType: string,
    context: CumulativeIntelligenceContext
  ): Promise<Resource>;
  
  generateTier1Resources(context: CumulativeIntelligenceContext): Promise<Resource[]>;
  generateTier2Resources(context: CumulativeIntelligenceContext): Promise<Resource[]>;
  generateTier3Resources(context: CumulativeIntelligenceContext): Promise<Resource[]>;
  
  checkUnlockCriteria(customerId: string, tier: ResourceTier): Promise<boolean>;
  getAvailableResources(customerId: string): Promise<Resource[]>;
}

export interface ResourceExportService {
  exportResource(
    resourceId: string,
    format: ExportFormat,
    options?: Record<string, any>
  ): Promise<ResourceExport>;
  
  getExportStatus(exportId: string): Promise<ResourceExport>;
  downloadExport(exportId: string): Promise<string>;
}

export interface ResourceAccessService {
  trackAccess(request: TrackAccessRequest): Promise<void>;
  getAccessHistory(customerId: string, resourceId?: string): Promise<ResourceAccessTracking[]>;
  getPopularResources(customerId: string, limit?: number): Promise<Resource[]>;
}

export interface ResourceFeedbackService {
  submitFeedback(request: SubmitFeedbackRequest): Promise<ResourceFeedback>;
  getFeedback(resourceId: string): Promise<ResourceFeedback[]>;
  getAverageRating(resourceId: string): Promise<number>;
}

// ===========================================
// UTILITY TYPES
// ===========================================

export type ResourceFilter = {
  tier?: ResourceTier;
  category?: ResourceCategory;
  status?: GenerationStatus;
  search?: string;
  tags?: string[];
};

export type ResourceSort = {
  field: 'created_at' | 'updated_at' | 'title' | 'access_count' | 'rating';
  direction: 'asc' | 'desc';
};

export type ResourcePagination = {
  limit: number;
  offset: number;
  total_count?: number;
  has_more?: boolean;
};

export type ResourceSearchResult = {
  resources: Resource[];
  pagination: ResourcePagination;
  filters_applied: ResourceFilter;
  sort_applied: ResourceSort;
};

// ===========================================
// ERROR TYPES
// ===========================================

export interface ResourceError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface ResourceValidationError extends ResourceError {
  field: string;
  value: any;
  constraint: string;
}

export interface ResourceGenerationError extends ResourceError {
  resource_id?: string;
  generation_log_id?: string;
  retry_count: number;
  max_retries: number;
}

// ===========================================
// CONFIGURATION TYPES
// ===========================================

export interface ResourceLibraryConfig {
  ai_service: {
    provider: 'anthropic' | 'openai' | 'custom';
    model: string;
    max_tokens: number;
    temperature: number;
    timeout_ms: number;
  };
  
  generation: {
    max_concurrent_generations: number;
    retry_attempts: number;
    retry_delay_ms: number;
    timeout_ms: number;
  };
  
  export: {
    max_file_size_mb: number;
    retention_days: number;
    supported_formats: ExportFormat[];
  };
  
  access: {
    track_user_behavior: boolean;
    session_timeout_minutes: number;
    max_access_history: number;
  };
  
  feedback: {
    enable_ratings: boolean;
    enable_text_feedback: boolean;
    moderation_enabled: boolean;
  };
}

// ===========================================
// EVENT TYPES
// ===========================================

export interface ResourceEvent {
  type: string;
  timestamp: string;
  customer_id: string;
  resource_id?: string;
  data: Record<string, any>;
}

export interface ResourceGeneratedEvent extends ResourceEvent {
  type: 'resource.generated';
  resource_id: string;
  data: {
    tier: ResourceTier;
    category: ResourceCategory;
    generation_time_ms: number;
    tokens_used: number;
  };
}

export interface ResourceAccessedEvent extends ResourceEvent {
  type: 'resource.accessed';
  resource_id: string;
  data: {
    access_type: AccessType;
    session_id?: string;
    user_agent?: string;
  };
}

export interface ResourceExportedEvent extends ResourceEvent {
  type: 'resource.exported';
  resource_id: string;
  data: {
    export_format: ExportFormat;
    file_size_bytes: number;
    download_url: string;
  };
}

export interface ResourceFeedbackSubmittedEvent extends ResourceEvent {
  type: 'resource.feedback_submitted';
  resource_id: string;
  data: {
    rating?: number;
    feedback_type?: FeedbackType;
    is_helpful?: boolean;
  };
}

// ===========================================
// EXPORT ALL TYPES
// ===========================================

export type {
  // Core types
  Resource,
  ResourceDependency,
  ResourceGenerationLog,
  ResourceAccessTracking,
  ResourceUnlockCriteria,
  ResourceTemplate,
  ResourceExport,
  ResourceFeedback,
  
  // Context types
  CumulativeIntelligenceContext,
  
  // API types
  GenerateResourceRequest,
  GenerateResourceResponse,
  GetResourcesRequest,
  GetResourcesResponse,
  CheckUnlockStatusRequest,
  CheckUnlockStatusResponse,
  ExportResourceRequest,
  ExportResourceResponse,
  TrackAccessRequest,
  SubmitFeedbackRequest,
  
  // Service types
  ResourceGenerationService,
  ResourceExportService,
  ResourceAccessService,
  ResourceFeedbackService,
  
  // Utility types
  ResourceFilter,
  ResourceSort,
  ResourcePagination,
  ResourceSearchResult,
  
  // Error types
  ResourceError,
  ResourceValidationError,
  ResourceGenerationError,
  
  // Configuration types
  ResourceLibraryConfig,
  
  // Event types
  ResourceEvent,
  ResourceGeneratedEvent,
  ResourceAccessedEvent,
  ResourceExportedEvent,
  ResourceFeedbackSubmittedEvent
};
