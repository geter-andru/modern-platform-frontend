/**
 * Resources Library Services Index
 * 
 * Centralized exports for all Resources Library services
 */

// Core services
import { resourceGenerationService } from '../resourceGenerationService';
import { resourceExportService } from '../resourceExportService';
import { resourceAccessService } from '../resourceAccessService';

export { resourceGenerationService, resourceExportService, resourceAccessService };

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
} from '@/app/lib/types/resourcesLibrary';

// Re-export schemas for validation
// export {
//   ResourceSchema,
//   GenerateResourceRequestSchema,
//   GenerateResourceResponseSchema,
//   GetResourcesRequestSchema,
//   GetResourcesResponseSchema,
//   CheckUnlockStatusRequestSchema,
//   CheckUnlockStatusResponseSchema,
//   ExportResourceRequestSchema,
//   ExportResourceResponseSchema,
//   TrackAccessRequestSchema
// } from '@/app/lib/validation/schemas/resourcesLibrarySchemas'; // TODO: Create schema file

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
