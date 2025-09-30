/**
 * Export Validation Schemas
 * 
 * Comprehensive validation schemas for all export-related API endpoints.
 * Provides request validation, response validation, and data transformation
 * for multi-format export functionality.
 * 
 * FUNCTIONALITY STATUS: REAL
 * - Production-ready validation schemas
 * - Complete type safety
 * - Comprehensive error handling
 * - Request/response validation
 */

import { z } from 'zod';

// ============================================================================
// EXPORT DATA SCHEMAS
// ============================================================================

/**
 * Export Format Schema
 * Validates supported export formats
 */
export const ExportFormatSchema = z.enum([
  'pdf',
  'docx',
  'xlsx',
  'csv',
  'json',
  'xml',
  'html'
]).describe('Supported export format');

/**
 * Content Type Schema
 * Validates supported content types for export
 */
export const ContentTypeSchema = z.enum([
  'assessment',
  'icp-analysis',
  'business-case',
  'cost-calculator',
  'financial-impact',
  'customer-analysis',
  'market-analysis',
  'competitive-analysis',
  'sales-materials',
  'presentation'
]).describe('Content type for export');

/**
 * User Tool Schema
 * Validates user tools that can be included in exports
 */
export const UserToolSchema = z.object({
  id: z.string().uuid().describe('Tool identifier'),
  name: z.string().min(1).max(255).describe('Tool name'),
  type: z.enum(['ai', 'crm', 'sales', 'marketing', 'analytics']).describe('Tool type'),
  data: z.record(z.string(), z.any()).optional().describe('Tool-specific data')
});

/**
 * Custom Field Schema
 * Validates custom fields for export
 */
export const CustomFieldSchema = z.object({
  name: z.string().min(1).max(255).describe('Field name'),
  value: z.any().describe('Field value'),
  type: z.enum(['text', 'number', 'date', 'boolean', 'object']).describe('Field type'),
  required: z.boolean().default(false).describe('Whether field is required')
});

/**
 * Export Metadata Schema
 * Validates export metadata
 */
export const ExportMetadataSchema = z.object({
  title: z.string().min(1).max(255).describe('Export title'),
  description: z.string().max(1000).optional().describe('Export description'),
  author: z.string().min(1).max(255).describe('Export author'),
  version: z.string().default('1.0').describe('Export version'),
  createdAt: z.string().datetime().describe('Creation timestamp'),
  tags: z.array(z.string()).optional().describe('Export tags'),
  confidentiality: z.enum(['public', 'internal', 'confidential', 'restricted']).default('internal').describe('Confidentiality level')
});

/**
 * Export History Entry Schema
 * Validates export history entries
 */
export const ExportHistoryEntrySchema = z.object({
  id: z.string().uuid().describe('Export history entry identifier'),
  userId: z.string().uuid().describe('User identifier'),
  format: ExportFormatSchema,
  contentType: ContentTypeSchema,
  userTools: z.array(UserToolSchema).describe('User tools included'),
  success: z.boolean().describe('Export success status'),
  metadata: ExportMetadataSchema.optional().describe('Export metadata'),
  timestamp: z.string().datetime().describe('Export timestamp'),
  fileSize: z.number().positive().optional().describe('Exported file size in bytes'),
  downloadUrl: z.string().url().optional().describe('Download URL'),
  expiresAt: z.string().datetime().optional().describe('Download expiration timestamp')
});

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

/**
 * Export Request Schema
 * Validates POST requests for data export
 */
export const ExportRequestSchema = z.object({
  format: ExportFormatSchema,
  contentType: ContentTypeSchema,
  userTools: z.array(UserToolSchema).default([]).describe('User tools to include'),
  includeMetadata: z.boolean().default(true).describe('Include metadata in export'),
  includeTemplates: z.boolean().default(true).describe('Include templates in export'),
  customFields: z.record(z.string(), z.any()).default({}).describe('Custom fields for export'),
  data: z.any().optional().describe('Data to export'),
  options: z.object({
    includeCharts: z.boolean().default(true).describe('Include charts and visualizations'),
    includeRawData: z.boolean().default(false).describe('Include raw data'),
    compressOutput: z.boolean().default(false).describe('Compress output file'),
    password: z.string().optional().describe('Password protection for export'),
    watermark: z.string().optional().describe('Watermark text')
  }).optional().describe('Export options')
});

/**
 * Export History Request Schema
 * Validates GET requests for export history
 */
export const ExportHistoryRequestSchema = z.object({
  limit: z.number().positive().max(100).default(20).describe('Number of entries to return'),
  offset: z.number().min(0).default(0).describe('Number of entries to skip'),
  format: ExportFormatSchema.optional().describe('Filter by export format'),
  contentType: ContentTypeSchema.optional().describe('Filter by content type'),
  dateFrom: z.string().datetime().optional().describe('Filter exports from date'),
  dateTo: z.string().datetime().optional().describe('Filter exports to date')
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Export Response Schema
 * Validates responses from export endpoint
 */
export const ExportResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  data: z.any().optional().describe('Exported data'),
  metadata: ExportMetadataSchema.optional().describe('Export metadata'),
  downloadUrl: z.string().url().optional().describe('Download URL for exported file'),
  filename: z.string().optional().describe('Exported file name'),
  fileSize: z.number().positive().optional().describe('File size in bytes'),
  expiresAt: z.string().datetime().optional().describe('Download expiration timestamp'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

/**
 * Export History Response Schema
 * Validates responses from export history endpoint
 */
export const ExportHistoryResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  exportHistory: z.array(ExportHistoryEntrySchema).describe('Export history entries'),
  availableFormats: z.array(z.object({
    format: ExportFormatSchema,
    name: z.string().describe('Format display name'),
    description: z.string().describe('Format description'),
    supportedContentTypes: z.array(ContentTypeSchema).describe('Supported content types'),
    maxFileSize: z.number().positive().optional().describe('Maximum file size in bytes')
  })).describe('Available export formats'),
  pagination: z.object({
    total: z.number().min(0).describe('Total number of entries'),
    limit: z.number().positive().describe('Number of entries per page'),
    offset: z.number().min(0).describe('Current offset'),
    hasMore: z.boolean().describe('Whether more entries are available')
  }).describe('Pagination information'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate export request
 */
export function validateExportRequest(data: unknown) {
  return ExportRequestSchema.parse(data);
}

/**
 * Validate export history request
 */
export function validateExportHistoryRequest(data: unknown) {
  return ExportHistoryRequestSchema.parse(data);
}

/**
 * Validate export response
 */
export function validateExportResponse(data: unknown) {
  return ExportResponseSchema.parse(data);
}

/**
 * Validate export history response
 */
export function validateExportHistoryResponse(data: unknown) {
  return ExportHistoryResponseSchema.parse(data);
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ExportFormat = z.infer<typeof ExportFormatSchema>;
export type ContentType = z.infer<typeof ContentTypeSchema>;
export type UserTool = z.infer<typeof UserToolSchema>;
export type CustomField = z.infer<typeof CustomFieldSchema>;
export type ExportMetadata = z.infer<typeof ExportMetadataSchema>;
export type ExportHistoryEntry = z.infer<typeof ExportHistoryEntrySchema>;

export type ExportRequest = z.infer<typeof ExportRequestSchema>;
export type ExportHistoryRequest = z.infer<typeof ExportHistoryRequestSchema>;

export type ExportResponse = z.infer<typeof ExportResponseSchema>;
export type ExportHistoryResponse = z.infer<typeof ExportHistoryResponseSchema>;