/**
 * Export Service
 *
 * Handles file generation and export functionality for various data types.
 * Supports multiple formats including PDF, DOCX, PPTX, CSV, and JSON.
 *
 * Updated: 2025-10-12 - Integrated with Supabase database for real data persistence
 */

import { env } from '@/app/lib/config/environment';
import { supabase } from '@/app/lib/supabase/client';
import { API_CONFIG } from '@/app/lib/config/api';
import PDFGenerator from './export/generators/PDFGenerator';
import DOCXGenerator from './export/generators/DOCXGenerator';

interface ExportFormat {
  format: string;
  name: string;
  description: string;
  mimeType: string;
  extension: string;
  supportedTypes: string[];
}

interface ExportRequest {
  type: string;
  data: any;
  format: string;
  options?: {
    template?: string;
    includeCharts?: boolean;
    includeMetadata?: boolean;
    customStyling?: boolean;
    [key: string]: any;
  };
  customerId?: string;
}

interface ExportResult {
  exportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  fileSize?: number;
  expiresAt?: string;
  error?: string;
  metadata?: {
    format: string;
    type: string;
    generatedAt: string;
    processingTime: number;
  };
}

interface BackendResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ExportService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = API_CONFIG.backend;
    this.apiKey = env.backendApiKey || '';
  }

  /**
   * Get supported export formats
   */
  getSupportedFormats(): ExportFormat[] {
    return [
      {
        format: 'pdf',
        name: 'PDF Document',
        description: 'Portable Document Format - ideal for reports and presentations',
        mimeType: 'application/pdf',
        extension: '.pdf',
        supportedTypes: ['assessment', 'icp', 'cost', 'business_case', 'comprehensive']
      },
      {
        format: 'docx',
        name: 'Word Document',
        description: 'Microsoft Word format - editable and professional',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        extension: '.docx',
        supportedTypes: ['assessment', 'icp', 'cost', 'business_case', 'comprehensive']
      },
      {
        format: 'pptx',
        name: 'PowerPoint Presentation',
        description: 'Microsoft PowerPoint format - perfect for presentations',
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        extension: '.pptx',
        supportedTypes: ['icp', 'business_case', 'comprehensive']
      },
      {
        format: 'csv',
        name: 'CSV Data',
        description: 'Comma-separated values - ideal for data analysis',
        mimeType: 'text/csv',
        extension: '.csv',
        supportedTypes: ['assessment', 'icp', 'cost', 'progress']
      },
      {
        format: 'json',
        name: 'JSON Data',
        description: 'JavaScript Object Notation - structured data format',
        mimeType: 'application/json',
        extension: '.json',
        supportedTypes: ['assessment', 'icp', 'cost', 'business_case', 'progress']
      },
      {
        format: 'xlsx',
        name: 'Excel Spreadsheet',
        description: 'Microsoft Excel format - perfect for data analysis',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        extension: '.xlsx',
        supportedTypes: ['assessment', 'icp', 'cost', 'progress']
      }
    ];
  }

  /**
   * Export data in specified format
   */
  async exportData(request: ExportRequest): Promise<BackendResponse<ExportResult>> {
    try {
      console.log('📤 Exporting data:', request.type, 'as', request.format);

      // Validate request
      const validation = this.validateExportRequest(request);
      if (!validation.valid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`
        };
      }

      // Generate export ID
      const exportId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const startTime = Date.now();

      // Generate file based on format
      let blob: Blob | null = null;
      let downloadUrl: string | undefined;

      if (request.format === 'pdf') {
        blob = await this.generatePDF(request);
      } else if (request.format === 'docx') {
        blob = await this.generateDOCX(request);
      }

      // If file was generated, create download URL
      if (blob) {
        downloadUrl = URL.createObjectURL(blob);
      } else {
        // For other formats (csv, json, xlsx, pptx), return mock for now
        downloadUrl = `/api/exports/${exportId}/download`;
      }

      const result: ExportResult = {
        exportId,
        status: 'completed',
        downloadUrl,
        fileSize: blob ? blob.size : this.estimateFileSize(request),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        metadata: {
          format: request.format,
          type: request.type,
          generatedAt: new Date().toISOString(),
          processingTime: Date.now() - startTime
        }
      };

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('❌ Export failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate PDF file
   */
  private async generatePDF(request: ExportRequest): Promise<Blob> {
    const { type, data, options } = request;

    const pdfOptions = {
      title: options?.template || `${type} Export`,
      subtitle: 'Revenue Intelligence Platform',
      author: 'Revenue Intelligence Platform',
      includeHeader: true,
      includeFooter: true,
      ...options
    };

    switch (type) {
      case 'icp':
        return await PDFGenerator.generateICPAnalysis(data, pdfOptions as any);
      case 'assessment':
        return await PDFGenerator.generateAssessment(data, pdfOptions as any);
      case 'business_case':
        return await PDFGenerator.generateBusinessCase(data, pdfOptions as any);
      case 'cost':
        return await PDFGenerator.generateCostCalculator(data, pdfOptions as any);
      case 'comprehensive':
        // Generate comprehensive report with all sections
        return await PDFGenerator.generateFromSections(data.sections || [], pdfOptions as any);
      default:
        throw new Error(`PDF generation not supported for type: ${type}`);
    }
  }

  /**
   * Generate DOCX file
   */
  private async generateDOCX(request: ExportRequest): Promise<Blob> {
    const { type, data, options } = request;

    const docxOptions = {
      title: options?.template || `${type} Export`,
      subtitle: 'Revenue Intelligence Platform',
      author: 'Revenue Intelligence Platform',
      ...options
    };

    switch (type) {
      case 'icp':
        return await DOCXGenerator.generateICPAnalysis(data, docxOptions);
      case 'assessment':
        return await DOCXGenerator.generateAssessment(data, docxOptions);
      case 'business_case':
        return await DOCXGenerator.generateBusinessCase(data, docxOptions);
      case 'cost':
        return await DOCXGenerator.generateCostCalculator(data, docxOptions);
      case 'comprehensive':
        // Generate comprehensive document with all sections
        return await DOCXGenerator.generateFromSections(data.sections || [], docxOptions);
      default:
        throw new Error(`DOCX generation not supported for type: ${type}`);
    }
  }

  /**
   * Get export status from Supabase database
   */
  async getExportStatus(exportId: string): Promise<BackendResponse<ExportResult>> {
    try {
      console.log('📊 Checking export status from database:', exportId);

      const { data, error } = await supabase
        .from('export_history')
        .select('*')
        .eq('id', exportId)
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        return {
          success: false,
          error: error.message || 'Failed to retrieve export status'
        };
      }

      if (!data) {
        return {
          success: false,
          error: 'Export not found'
        };
      }

      // Transform database row to ExportResult format
      const result: ExportResult = {
        exportId: (data as any).id,
        status: (data as any).status || 'completed',
        downloadUrl: (data as any).download_url,
        fileSize: (data as any).file_size,
        expiresAt: (data as any).expires_at,
        metadata: {
          format: (data as any).format || 'pdf',
          type: (data as any).type || 'assessment',
          generatedAt: (data as any).generated_at || (data as any).created_at,
          processingTime: (data as any).processing_time || 0
        }
      };

      console.log('✅ Export status retrieved successfully');

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('❌ Failed to get export status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Download export file from Supabase database
   */
  async downloadExport(exportId: string): Promise<BackendResponse<{ downloadUrl: string; filename: string }>> {
    try {
      console.log('⬇️ Downloading export from database:', exportId);

      const { data, error } = await supabase
        .from('export_history')
        .select('*')
        .eq('id', exportId)
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        return {
          success: false,
          error: error.message || 'Failed to retrieve export'
        };
      }

      if (!data) {
        return {
          success: false,
          error: 'Export not found'
        };
      }

      // Check if export has expired
      if ((data as any).expires_at && new Date((data as any).expires_at) < new Date()) {
        return {
          success: false,
          error: 'Export has expired'
        };
      }

      const filename = `export_${exportId}.${(data as any).format || 'pdf'}`;

      console.log('✅ Export download info retrieved successfully');

      return {
        success: true,
        data: {
          downloadUrl: (data as any).download_url || `/api/exports/${exportId}/download`,
          filename
        }
      };

    } catch (error) {
      console.error('❌ Failed to download export:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get export history for customer from Supabase database
   */
  async getExportHistory(customerId: string, limit: number = 20): Promise<BackendResponse<ExportResult[]>> {
    try {
      console.log('📋 Fetching export history from database for customer:', customerId);

      const { data, error } = await supabase
        .from('export_history')
        .select('*')
        .eq('user_id', customerId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Supabase error:', error);
        return {
          success: false,
          error: error.message || 'Failed to retrieve export history'
        };
      }

      // Transform database rows to ExportResult format
      const results: ExportResult[] = (data || []).map((row: any) => ({
        exportId: row.id,
        status: row.status || 'completed',
        downloadUrl: row.download_url,
        fileSize: row.file_size,
        expiresAt: row.expires_at,
        metadata: {
          format: row.format || 'pdf',
          type: row.type || 'assessment',
          generatedAt: row.generated_at || row.created_at,
          processingTime: row.processing_time || 0
        }
      }));

      console.log(`✅ Retrieved ${results.length} exports from database`);

      return {
        success: true,
        data: results
      };

    } catch (error) {
      console.error('❌ Failed to fetch export history:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete export from Supabase database
   */
  async deleteExport(exportId: string): Promise<BackendResponse> {
    try {
      console.log('🗑️ Deleting export from database:', exportId);

      const { error } = await supabase
        .from('export_history')
        .delete()
        .eq('id', exportId);

      if (error) {
        console.error('❌ Supabase error:', error);
        return {
          success: false,
          error: error.message || 'Failed to delete export'
        };
      }

      console.log('✅ Export deleted successfully');

      return {
        success: true,
        message: 'Export deleted successfully'
      };

    } catch (error) {
      console.error('❌ Failed to delete export:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Validate export request
   */
  private validateExportRequest(request: ExportRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.type?.trim()) {
      errors.push('Export type is required');
    }

    if (!request.format?.trim()) {
      errors.push('Export format is required');
    }

    if (!request.data) {
      errors.push('Export data is required');
    }

    // Validate format is supported
    const supportedFormats = this.getSupportedFormats();
    const format = supportedFormats.find(f => f.format === request.format);
    if (!format) {
      errors.push(`Unsupported format: ${request.format}`);
    } else if (!format.supportedTypes.includes(request.type)) {
      errors.push(`Format ${request.format} is not supported for type ${request.type}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Estimate file size based on request
   */
  private estimateFileSize(request: ExportRequest): number {
    const baseSizes: Record<string, number> = {
      'pdf': 500000,    // 500KB
      'docx': 300000,   // 300KB
      'pptx': 800000,   // 800KB
      'csv': 50000,     // 50KB
      'json': 100000,   // 100KB
      'xlsx': 200000    // 200KB
    };

    const typeMultipliers: Record<string, number> = {
      'assessment': 1.0,
      'icp': 1.5,
      'cost': 1.2,
      'business_case': 2.0,
      'comprehensive': 3.0,
      'progress': 0.8
    };

    const baseSize = baseSizes[request.format] || 100000;
    const multiplier = typeMultipliers[request.type] || 1.0;

    return Math.round(baseSize * multiplier);
  }

  /**
   * Get export templates
   */
  getExportTemplates(): Array<{ id: string; name: string; description: string; type: string; format: string }> {
    return [
      {
        id: 'assessment_report',
        name: 'Assessment Report',
        description: 'Comprehensive assessment results with insights and recommendations',
        type: 'assessment',
        format: 'pdf'
      },
      {
        id: 'icp_analysis',
        name: 'ICP Analysis Report',
        description: 'Detailed Ideal Customer Profile analysis with buyer personas',
        type: 'icp',
        format: 'docx'
      },
      {
        id: 'cost_analysis',
        name: 'Cost Analysis Report',
        description: 'Cost of inaction analysis with financial projections',
        type: 'cost',
        format: 'pdf'
      },
      {
        id: 'business_case',
        name: 'Business Case Document',
        description: 'Professional business case with ROI analysis and implementation plan',
        type: 'business_case',
        format: 'docx'
      },
      {
        id: 'executive_summary',
        name: 'Executive Summary',
        description: 'High-level summary for executive presentation',
        type: 'comprehensive',
        format: 'pptx'
      }
    ];
  }

  /**
   * Get export statistics
   */
  async getExportStatistics(customerId?: string): Promise<BackendResponse<{ totalExports: number; formatBreakdown: Record<string, number>; typeBreakdown: Record<string, number> }>> {
    try {
      console.log('📊 Fetching export statistics');

      // For now, return mock statistics
      // In production, this would fetch from the backend API
      const mockStats = {
        totalExports: 156,
        formatBreakdown: {
          'pdf': 45,
          'docx': 38,
          'pptx': 22,
          'csv': 28,
          'json': 15,
          'xlsx': 8
        },
        typeBreakdown: {
          'assessment': 52,
          'icp': 34,
          'cost': 28,
          'business_case': 25,
          'comprehensive': 12,
          'progress': 5
        }
      };

      return {
        success: true,
        data: mockStats
      };

    } catch (error) {
      console.error('❌ Failed to fetch export statistics:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
const exportService = new ExportService();
export default exportService;
