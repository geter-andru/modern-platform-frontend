'use client';

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'csv' | 'json';
  includeAssessmentData?: boolean;
  includeProductDetails?: boolean;
  includeRecommendations?: boolean;
  includeChallenges?: boolean;
  includeInsights?: boolean;
}

export interface AssessmentExportOptions {
  format: 'pdf' | 'docx' | 'csv' | 'json';
  includeProductInfo?: boolean;
  includeChallenges?: boolean;
  includeRecommendations?: boolean;
  includeInsights?: boolean;
}

export interface ExportResult {
  success: boolean;
  error?: string;
  downloadUrl?: string;
  filename?: string;
}

export class ExportService {
  
  static async exportICP(options: ExportOptions): Promise<ExportResult> {
    try {
      console.log('🔍 Exporting ICP data with options:', options);

      const response = await fetch('/api/export/icp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export ICP data');
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `icp-export-${new Date().toISOString().split('T')[0]}.${options.format}`;

      // Create blob and download URL
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL after a delay
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

      console.log('✅ ICP export completed successfully');

      return {
        success: true,
        downloadUrl,
        filename
      };

    } catch (error) {
      console.error('❌ Error exporting ICP data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async exportAssessment(options: AssessmentExportOptions): Promise<ExportResult> {
    try {
      console.log('🔍 Exporting assessment data with options:', options);

      const response = await fetch('/api/export/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export assessment data');
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `assessment-export-${new Date().toISOString().split('T')[0]}.${options.format}`;

      // Create blob and download URL
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL after a delay
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

      console.log('✅ Assessment export completed successfully');

      return {
        success: true,
        downloadUrl,
        filename
      };

    } catch (error) {
      console.error('❌ Error exporting assessment data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static getAvailableFormats() {
    return [
      { value: 'pdf', label: 'PDF Document', description: 'Professional formatted document' },
      { value: 'docx', label: 'Word Document', description: 'Editable Microsoft Word format' },
      { value: 'csv', label: 'CSV Spreadsheet', description: 'Data in spreadsheet format' },
      { value: 'json', label: 'JSON Data', description: 'Raw data in JSON format' }
    ];
  }

  static getFormatOptions(format: string) {
    const baseOptions = {
      includeAssessmentData: true,
      includeProductDetails: true,
      includeRecommendations: true
    };

    // const assessmentOptions = {
    //   includeProductInfo: true,
    //   includeChallenges: true,
    //   includeRecommendations: true,
    //   includeInsights: true
    // };

    switch (format) {
      case 'pdf':
        return {
          ...baseOptions,
          description: 'Best for sharing and presentation'
        };
      case 'docx':
        return {
          ...baseOptions,
          description: 'Best for editing and collaboration'
        };
      case 'csv':
        return {
          ...baseOptions,
          description: 'Best for data analysis and import'
        };
      case 'json':
        return {
          ...baseOptions,
          description: 'Best for technical integration'
        };
      default:
        return baseOptions;
    }
  }

  static validateOptions(options: ExportOptions | AssessmentExportOptions): string[] {
    const errors: string[] = [];

    if (!options.format) {
      errors.push('Export format is required');
    }

    if (!['pdf', 'docx', 'csv', 'json'].includes(options.format)) {
      errors.push('Invalid export format');
    }

    return errors;
  }

  static getExportProgress(): Promise<number> {
    // This would be implemented for large exports that take time
    return Promise.resolve(100);
  }

  static cancelExport(): Promise<boolean> {
    // This would be implemented for cancelable exports
    return Promise.resolve(true);
  }
}

