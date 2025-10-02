// Resource Library TypeScript Interfaces

export interface Resource {
  id: string;
  title: string;
  description: string;
  tier: 1 | 2 | 3;
  category: ResourceCategory;
  status: ResourceStatus;
  lastUpdated: string;
  accessCount: number;
  dependencies?: string[];
  exportFormats: ExportFormat[];
  content?: string;
  metadata?: Record<string, any>;
  generationStatus?: GenerationStatus;
  aiContext?: Record<string, any>;
  generationTimeMs?: number;
  lastAccessed?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResourceTier {
  id: 1 | 2 | 3;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  isUnlocked: boolean;
  unlockRequirement?: string;
  unlockCriteria?: UnlockCriteria;
}

export interface ResourceCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

export interface ResourceDependency {
  id: string;
  resourceId: string;
  dependsOnResourceId: string;
  dependencyType: DependencyType;
  isRequired: boolean;
  createdAt: string;
}

export interface ResourceGenerationRequest {
  resourceId: string;
  customerId: string;
  productDetails: ProductDetails;
  dependencies: Resource[];
  context: GenerationContext;
  options?: GenerationOptions;
}

export interface ResourceGenerationResponse {
  success: boolean;
  resource?: Resource;
  error?: string;
  generationTimeMs?: number;
  aiContext?: Record<string, any>;
}

export interface ExportRequest {
  resourceId: string;
  format: ExportFormat;
  options?: ExportOptions;
}

export interface ExportResponse {
  success: boolean;
  downloadUrl?: string;
  filename?: string;
  error?: string;
}

// Enums and Union Types
export type ResourceStatus = 'available' | 'locked' | 'generating' | 'failed' | 'archived';
export type GenerationStatus = 'pending' | 'generating' | 'completed' | 'failed' | 'archived';
export type ExportFormat = 'PDF' | 'DOCX' | 'JSON' | 'CSV';
export type DependencyType = 'required' | 'optional' | 'recommended';
export type ResourceType = 'content_templates' | 'guides' | 'frameworks' | 'ai_prompts' | 'one_pagers' | 'slide_decks';

// Supporting Interfaces
export interface ProductDetails {
  name: string;
  description: string;
  keyFeatures: string;
  idealCustomerDescription: string;
  businessModel: string;
  customerCount: string;
  distinguishingFeature: string;
}

export interface GenerationContext {
  customerId: string;
  competencyLevel: number;
  previousResources: Resource[];
  assessmentData?: any;
  icpData?: any;
  costCalculatorData?: any;
}

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  includeExamples?: boolean;
  customPrompts?: string[];
}

export interface ExportOptions {
  includeMetadata?: boolean;
  customFormatting?: boolean;
  watermark?: string;
  branding?: boolean;
}

export interface UnlockCriteria {
  requiredResources?: string[];
  competencyLevel?: number;
  assessmentScore?: number;
  usageCount?: number;
  timeBased?: {
    daysSinceSignup?: number;
    daysSinceLastResource?: number;
  };
}

// API Response Types
export interface ResourceListResponse {
  success: boolean;
  resources: Resource[];
  total: number;
  page: number;
  limit: number;
  error?: string;
}

export interface ResourceDetailResponse {
  success: boolean;
  resource?: Resource;
  error?: string;
}

export interface TierUnlockResponse {
  success: boolean;
  unlockedTiers: number[];
  nextUnlockRequirements?: Record<number, string>;
  error?: string;
}

// Hook Types
export interface UseResourceGenerationReturn {
  generateResource: (request: ResourceGenerationRequest) => Promise<ResourceGenerationResponse>;
  isLoading: boolean;
  error: string | null;
  lastGenerated?: Resource;
}

export interface UseResourceTiersReturn {
  tiers: ResourceTier[];
  selectedTier: number;
  setSelectedTier: (tier: number) => void;
  unlockedTiers: number[];
  checkUnlockRequirements: (tier: number) => UnlockCriteria | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseResourceExportReturn {
  exportResource: (request: ExportRequest) => Promise<ExportResponse>;
  isLoading: boolean;
  error: string | null;
  lastExport?: ExportResponse;
}

// Component Props Types
export interface ResourceTierTabsProps {
  tiers: ResourceTier[];
  selectedTier: 1 | 2 | 3;
  onTierSelect: (tier: 1 | 2 | 3) => void;
}

export interface ResourceGridProps {
  resources: Resource[];
  tier: ResourceTier;
  onResourceClick: (resource: Resource) => void;
  isLoading?: boolean;
}

export interface ResourceModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onExport: (resource: Resource, format: ExportFormat) => void;
  onShare: (resource: Resource) => void;
  isLoading?: boolean;
}

export interface ResourceExportProps {
  resource: Resource;
  onExport: (resource: Resource, format: ExportFormat) => void;
  isLoading?: boolean;
}

export interface ResourceCardProps {
  resource: Resource;
  onClick: (resource: Resource) => void;
  showDependencies?: boolean;
  showExportFormats?: boolean;
}

export interface ResourceContentProps {
  resource: Resource;
  content: string;
  isLoading?: boolean;
}

export interface ResourceActionsProps {
  resource: Resource;
  onExport: (format: ExportFormat) => void;
  onShare: () => void;
  onCopy: () => void;
  isLoading?: boolean;
}

// Configuration Types
export interface ResourceLibraryConfig {
  maxConcurrentGenerations: number;
  defaultGenerationOptions: GenerationOptions;
  exportLimits: {
    maxFileSize: number;
    maxExportsPerHour: number;
  };
  tierUnlockCriteria: Record<number, UnlockCriteria>;
  resourceDependencies: Record<string, string[]>;
  aiPrompts: Record<string, string>;
}

// Error Types
export interface ResourceError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Analytics Types
export interface ResourceAnalytics {
  resourceId: string;
  views: number;
  exports: number;
  shares: number;
  generationTime: number;
  userSatisfaction?: number;
  lastAccessed: string;
}

export interface TierAnalytics {
  tier: number;
  totalResources: number;
  unlockedResources: number;
  averageGenerationTime: number;
  mostPopularResources: string[];
  unlockRate: number;
}
