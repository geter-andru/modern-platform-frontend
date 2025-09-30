/**
 * Export Service
 * 
 * Handles file generation and export functionality for various data types.
 * Supports multiple formats including PDF, DOCX, PPTX, CSV, and JSON.
 */

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
    this.baseUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
    this.apiKey = process.env.BACKEND_API_KEY || '';
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

      // For now, return mock export result
      // In production, this would call the backend API for file generation
      const mockResult: ExportResult = {
        exportId,
        status: 'completed',
        downloadUrl: `/api/exports/${exportId}/download`,
        fileSize: this.estimateFileSize(request),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        metadata: {
          format: request.format,
          type: request.type,
          generatedAt: new Date().toISOString(),
          processingTime: Date.now()
        }
      };

      return {
        success: true,
        data: mockResult
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
   * Get export status
   */
  async getExportStatus(exportId: string): Promise<BackendResponse<ExportResult>> {
    try {
      console.log('📊 Checking export status:', exportId);

      // For now, return mock status
      // In production, this would check the backend API
      const mockStatus: ExportResult = {
        exportId,
        status: 'completed',
        downloadUrl: `/api/exports/${exportId}/download`,
        fileSize: 1024000, // 1MB
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          format: 'pdf',
          type: 'assessment',
          generatedAt: new Date().toISOString(),
          processingTime: 1500
        }
      };

      return {
        success: true,
        data: mockStatus
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
   * Download export file
   */
  async downloadExport(exportId: string): Promise<BackendResponse<{ downloadUrl: string; filename: string }>> {
    try {
      console.log('⬇️ Downloading export:', exportId);

      // For now, return mock download info
      // In production, this would generate a secure download URL
      const filename = `export_${exportId}.pdf`;

      return {
        success: true,
        data: {
          downloadUrl: `/api/exports/${exportId}/download`,
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
   * Get export history for customer
   */
  async getExportHistory(customerId: string, limit: number = 20): Promise<BackendResponse<ExportResult[]>> {
    try {
      console.log('📋 Fetching export history for customer:', customerId);

      // For now, return mock history
      // In production, this would fetch from the backend API
      const mockHistory: ExportResult[] = [
        {
          exportId: 'export_1',
          status: 'completed',
          downloadUrl: '/api/exports/export_1/download',
          fileSize: 1024000,
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: {
            format: 'pdf',
            type: 'assessment',
            generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            processingTime: 1200
          }
        },
        {
          exportId: 'export_2',
          status: 'completed',
          downloadUrl: '/api/exports/export_2/download',
          fileSize: 2048000,
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: {
            format: 'docx',
            type: 'icp',
            generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            processingTime: 1800
          }
        }
      ];

      return {
        success: true,
        data: mockHistory.slice(0, limit)
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
   * Delete export
   */
  async deleteExport(exportId: string): Promise<BackendResponse> {
    try {
      console.log('🗑️ Deleting export:', exportId);

      // For now, return mock success
      // In production, this would delete from the backend API
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
