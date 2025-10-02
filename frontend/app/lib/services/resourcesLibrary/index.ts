/**
 * Resources Library Services Index
 * 
 * Centralized exports for all Resources Library services
 */

// Core services
export { resourceGenerationService } from '../resourceGenerationService';
export { resourceExportService } from '../resourceExportService';
export { resourceAccessService } from '../resourceAccessService';

// Re-export types for convenience
export type {
  Resource,
  ResourceTier,
  ResourceCategory,
  GenerationStatus,
  ExportFormat,
  CumulativeIntelligenceContext,
  ResourceGenerationService,
  ResourceExportService,
  ResourceAccessService
} from '@/lib/types/resourcesLibrary';

// Re-export schemas for validation
export {
  ResourceSchema,
  GenerateResourceRequestSchema,
  GenerateResourceResponseSchema,
  GetResourcesRequestSchema,
  GetResourcesResponseSchema,
  CheckUnlockStatusRequestSchema,
  CheckUnlockStatusResponseSchema,
  ExportResourceRequestSchema,
  ExportResourceResponseSchema,
  TrackAccessRequestSchema
} from '@/lib/validation/schemas/resourcesLibrarySchemas';

// Service factory function
export const createResourcesLibraryServices = () => ({
  generation: resourceGenerationService,
  export: resourceExportService,
  access: resourceAccessService
});

// Default export with all services
export default {
  generation: resourceGenerationService,
  export: resourceExportService,
  access: resourceAccessService
};
