
// Core Backend Service
export { backendService } from './backendService';

// Authentication Service (Local)
export { authService } from './authService';

// Tool-Specific Services (Local)
export { icpAnalysisService } from './icpAnalysisService';
export { costCalculatorService } from './costCalculatorService';
export { businessCaseService } from './businessCaseService';

// Progress and Export Services (Local)
export { progressTrackingService } from './progressTrackingService';
export { default as exportService } from './exportService';

// Legacy Services (for backward compatibility)
export { airtableService } from './airtableService';
export { default as claudeAIService } from './claudeAIService';

// AI and Resource Services
export { default as resourceGenerationService } from './resourceGenerationService';

// Service Types and Interfaces
// Note: Backend service types are not currently exported

// Re-export all services as default for convenience
import { backendService } from './backendService';
import { authService } from './authService';
import { icpAnalysisService } from './icpAnalysisService';
import { costCalculatorService } from './costCalculatorService';
import { businessCaseService } from './businessCaseService';
import { progressTrackingService } from './progressTrackingService';
import exportService from './exportService';
import { airtableService } from './airtableService';
import claudeAIService from './claudeAIService';
import resourceGenerationService from './resourceGenerationService';

export default {
  backendService,
  authService,
  icpAnalysisService,
  costCalculatorService,
  businessCaseService,
  progressTrackingService,
  exportService,
  airtableService,
  claudeAIService,
  resourceGenerationService
};
