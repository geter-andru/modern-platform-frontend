/**
 * Resource Export Service
 * 
 * Handles exporting resources in various formats (PDF, DOCX, CSV, JSON, HTML).
 * Manages file generation, storage, and download URLs with expiration.
 */

import { createClient } from '@/lib/supabase/server';
import { 
  Resource, 
  ResourceExport, 
  ExportFormat,
  ResourceExportService as IResourceExportService
} from '@/lib/types/resourcesLibrary';
import {
  ExportResourceRequest,
  ExportResourceResponse
} from '@/lib/validation/schemas/resourcesLibrarySchemas';

interface ExportConfig {
  maxFileSizeMB: number;
  retentionDays: number;
  supportedFormats: ExportFormat[];
  storagePath: string;
}

interface ExportOptions {
  includeMetadata?: boolean;
  includeTemplates?: boolean;
  includeFrameworks?: boolean;
  includeTools?: boolean;
  customStyling?: boolean;
  watermark?: boolean;
}

class ResourceExportService implements IResourceExportService {
  private config: ExportConfig;

  constructor() {
    this.config = {
      maxFileSizeMB: 50,
      retentionDays: 30,
      supportedFormats: ['pdf', 'docx', 'csv', 'json', 'html'],
      storagePath: 'exports/resources'
    };
  }

  private async getSupabaseClient() {
    return await createClient();
  }

  /**
   * Export a resource in the specified format
   */
  async exportResource(
    resourceId: string,
    format: ExportFormat,
    options?: Record<string, any>
  ): Promise<ResourceExport> {
    console.log(`📤 Exporting resource: ${resourceId} in format: ${format}`);

    try {
      // 1. Get the resource
      const resource = await this.getResource(resourceId);
      if (!resource) {
        throw new Error(`Resource not found: ${resourceId}`);
      }

      // 2. Validate export format
      if (!this.config.supportedFormats.includes(format)) {
        throw new Error(`Unsupported export format: ${format}`);
      }

      // 3. Create export record
      const exportRecord = await this.createExportRecord(resource.customer_id, resourceId, format);

      // 4. Generate the file
      const fileData = await this.generateFile(resource, format, options);

      // 5. Upload to storage
      const filePath = await this.uploadFile(exportRecord.id, fileData, format);

      // 6. Update export record with file info
      const updatedExport = await this.updateExportRecord(exportRecord.id, {
        export_status: 'completed',
        file_path: filePath,
        file_size_bytes: fileData.length,
        download_url: await this.generateDownloadUrl(exportRecord.id),
        expires_at: this.calculateExpirationDate()
      });

      console.log(`✅ Resource exported successfully: ${exportRecord.id}`);
      return updatedExport;

    } catch (error) {
      console.error(`❌ Failed to export resource: ${resourceId}`, error);
      
      // Update export record with error
      await this.updateExportRecord('', {
        export_status: 'failed'
      });
      
      throw error;
    }
  }

  /**
   * Get export status
   */
  async getExportStatus(exportId: string): Promise<ResourceExport> {
    console.log(`📊 Getting export status: ${exportId}`);

    try {
      const supabase = await this.getSupabaseClient();
      const { data: exportRecord, error } = await supabase
        .from('resource_exports')
        .select('*')
        .eq('id', exportId)
        .single();

      if (error) throw error;
      if (!exportRecord) {
        throw new Error(`Export not found: ${exportId}`);
      }

      return exportRecord;

    } catch (error) {
      console.error('Error getting export status:', error);
      throw error;
    }
  }

  /**
   * Download export file
   */
  async downloadExport(exportId: string): Promise<string> {
    console.log(`⬇️ Downloading export: ${exportId}`);

    try {
      const exportRecord = await this.getExportStatus(exportId);

      if (exportRecord.export_status !== 'completed') {
        throw new Error(`Export not ready: ${exportRecord.export_status}`);
      }

      if (!exportRecord.download_url) {
        throw new Error('Download URL not available');
      }

      // Check if export has expired
      if (exportRecord.expires_at && new Date(exportRecord.expires_at) < new Date()) {
        throw new Error('Export has expired');
      }

      return exportRecord.download_url;

    } catch (error) {
      console.error('Error downloading export:', error);
      throw error;
    }
  }

  /**
   * Get all exports for a customer
   */
  async getCustomerExports(customerId: string, limit: number = 20): Promise<ResourceExport[]> {
    console.log(`📋 Getting exports for customer: ${customerId}`);

    try {
      const supabase = await this.getSupabaseClient();
      const { data: exports, error } = await supabase
        .from('resource_exports')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return exports || [];

    } catch (error) {
      console.error('Error getting customer exports:', error);
      return [];
    }
  }

  /**
   * Clean up expired exports
   */
  async cleanupExpiredExports(): Promise<number> {
    console.log('🧹 Cleaning up expired exports');

    try {
      const supabase = await this.getSupabaseClient();
      const { data: expiredExports, error: selectError } = await supabase
        .from('resource_exports')
        .select('id, file_path')
        .lt('expires_at', new Date().toISOString());

      if (selectError) throw selectError;

      let cleanedCount = 0;

      for (const exportRecord of expiredExports || []) {
        try {
          // Delete file from storage
          if (exportRecord.file_path) {
            await this.deleteFile(exportRecord.file_path);
          }

          // Delete export record
          const { error: deleteError } = await supabase
            .from('resource_exports')
            .delete()
            .eq('id', exportRecord.id);

          if (deleteError) throw deleteError;

          cleanedCount++;

        } catch (error) {
          console.error(`Failed to clean up export ${exportRecord.id}:`, error);
        }
      }

      console.log(`✅ Cleaned up ${cleanedCount} expired exports`);
      return cleanedCount;

    } catch (error) {
      console.error('Error cleaning up expired exports:', error);
      return 0;
    }
  }

  // ===========================================
  // PRIVATE HELPER METHODS
  // ===========================================

  private async getResource(resourceId: string): Promise<Resource | null> {
    const supabase = await this.getSupabaseClient();
    const { data: resource, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', resourceId)
      .single();

    if (error) {
      console.error('Error getting resource:', error);
      return null;
    }

    return resource;
  }

  private async createExportRecord(
    customerId: string,
    resourceId: string,
    format: ExportFormat
  ): Promise<ResourceExport> {
    const { data: exportRecord, error } = await this.supabase
      .from('resource_exports')
      .insert({
        customer_id: customerId,
        resource_id: resourceId,
        export_format: format,
        export_status: 'processing'
      })
      .select()
      .single();

    if (error) throw error;
    return exportRecord;
  }

  private async updateExportRecord(
    exportId: string,
    updates: Partial<ResourceExport>
  ): Promise<ResourceExport> {
    const { data: exportRecord, error } = await this.supabase
      .from('resource_exports')
      .update(updates)
      .eq('id', exportId)
      .select()
      .single();

    if (error) throw error;
    return exportRecord;
  }

  private async generateFile(
    resource: Resource,
    format: ExportFormat,
    options?: Record<string, any>
  ): Promise<Buffer> {
    console.log(`🔨 Generating file in format: ${format}`);

    switch (format) {
      case 'pdf':
        return this.generatePDF(resource, options);
      case 'docx':
        return this.generateDOCX(resource, options);
      case 'csv':
        return this.generateCSV(resource, options);
      case 'json':
        return this.generateJSON(resource, options);
      case 'html':
        return this.generateHTML(resource, options);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private async generatePDF(resource: Resource, options?: Record<string, any>): Promise<Buffer> {
    // Implementation for PDF generation
    // This would use a library like puppeteer or jsPDF
    const html = this.generateHTMLContent(resource, options);
    
    // For now, return a mock PDF buffer
    // In production, this would generate an actual PDF
    return Buffer.from(`PDF content for ${resource.title}`, 'utf-8');
  }

  private async generateDOCX(resource: Resource, options?: Record<string, any>): Promise<Buffer> {
    // Implementation for DOCX generation
    // This would use a library like docx
    const content = this.generateDocumentContent(resource, options);
    
    // For now, return a mock DOCX buffer
    return Buffer.from(`DOCX content for ${resource.title}`, 'utf-8');
  }

  private async generateCSV(resource: Resource, options?: Record<string, any>): Promise<Buffer> {
    // Implementation for CSV generation
    const csvContent = this.generateCSVContent(resource, options);
    return Buffer.from(csvContent, 'utf-8');
  }

  private async generateJSON(resource: Resource, options?: Record<string, any>): Promise<Buffer> {
    // Implementation for JSON generation
    const jsonContent = JSON.stringify(resource, null, 2);
    return Buffer.from(jsonContent, 'utf-8');
  }

  private async generateHTML(resource: Resource, options?: Record<string, any>): Promise<Buffer> {
    // Implementation for HTML generation
    const htmlContent = this.generateHTMLContent(resource, options);
    return Buffer.from(htmlContent, 'utf-8');
  }

  private generateHTMLContent(resource: Resource, options?: Record<string, any>): string {
    const sections = resource.content.sections || [];
    const sectionsHTML = sections.map(section => `
      <div class="section">
        <h2>${section.title}</h2>
        <div class="content">${section.content}</div>
      </div>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resource.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            .content { line-height: 1.6; }
            .metadata { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${resource.title}</h1>
            ${resource.description ? `<p>${resource.description}</p>` : ''}
          </div>
          ${sectionsHTML}
          <div class="metadata">
            <p><strong>Category:</strong> ${resource.category}</p>
            <p><strong>Tier:</strong> ${resource.tier}</p>
            <p><strong>Generated:</strong> ${new Date(resource.created_at).toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `;
  }

  private generateDocumentContent(resource: Resource, options?: Record<string, any>): string {
    const sections = resource.content.sections || [];
    const sectionsText = sections.map(section => 
      `${section.title}\n${section.content}\n\n`
    ).join('');

    return `
${resource.title}
${resource.description ? `\n${resource.description}\n` : ''}

${sectionsText}

---
Category: ${resource.category}
Tier: ${resource.tier}
Generated: ${new Date(resource.created_at).toLocaleDateString()}
    `;
  }

  private generateCSVContent(resource: Resource, options?: Record<string, any>): string {
    const sections = resource.content.sections || [];
    
    let csv = 'Section,Title,Content\n';
    sections.forEach(section => {
      const escapedContent = section.content.replace(/"/g, '""');
      csv += `"${section.title}","${section.title}","${escapedContent}"\n`;
    });

    return csv;
  }

  private async uploadFile(
    exportId: string,
    fileData: Buffer,
    format: ExportFormat
  ): Promise<string> {
    const fileName = `${exportId}.${format}`;
    const filePath = `${this.config.storagePath}/${fileName}`;

    // Upload to Supabase Storage
    const supabase = await this.getSupabaseClient();
    const { error } = await supabase.storage
      .from('exports')
      .upload(filePath, fileData, {
        contentType: this.getContentType(format),
        upsert: true
      });

    if (error) throw error;

    return filePath;
  }

  private async deleteFile(filePath: string): Promise<void> {
    const supabase = await this.getSupabaseClient();
    const { error } = await supabase.storage
      .from('exports')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
    }
  }

  private async generateDownloadUrl(exportId: string): Promise<string> {
    const fileName = `${exportId}.pdf`; // Default to PDF for now
    const filePath = `${this.config.storagePath}/${fileName}`;

    const supabase = await this.getSupabaseClient();
    const { data } = supabase.storage
      .from('exports')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  private calculateExpirationDate(): string {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + this.config.retentionDays);
    return expirationDate.toISOString();
  }

  private getContentType(format: ExportFormat): string {
    const contentTypes: Record<ExportFormat, string> = {
      'pdf': 'application/pdf',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'csv': 'text/csv',
      'json': 'application/json',
      'html': 'text/html'
    };

    return contentTypes[format] || 'application/octet-stream';
  }
}

// Export singleton instance
export const resourceExportService = new ResourceExportService();
export default resourceExportService;
