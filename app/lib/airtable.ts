// Airtable service alias - Re-export from app/lib/services/airtableService.ts
// This provides a cleaner import path for external modules and maintains compatibility

export * from './services/airtableService';

// Additional convenience exports for common operations
import airtableService from './services/airtableService';

// Re-export the main service functions with default export
export default airtableService;