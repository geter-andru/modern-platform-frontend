'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  FileText, 
  File, 
  Database, 
  Table,
  ChevronDown,
  Loader2
} from 'lucide-react';
import exportService from '../../../../app/lib/services/exportService';

interface Resource {
  id: string;
  title: string;
  description: string;
  tier: 1 | 2 | 3;
  category: 'content_templates' | 'guides' | 'frameworks' | 'ai_prompts' | 'one_pagers' | 'slide_decks';
  status: 'available' | 'locked' | 'generating';
  lastUpdated: string;
  accessCount: number;
  dependencies?: string[];
  exportFormats: string[];
}

interface ResourceExportProps {
  resource: Resource;
  onExport: (resource: Resource, format: string) => void;
  isLoading?: boolean;
}

const exportFormats = [
  {
    id: 'PDF',
    name: 'PDF Document',
    description: 'Portable document format',
    icon: FileText,
    color: 'text-red-600 bg-red-50 hover:bg-red-100'
  },
  {
    id: 'DOCX',
    name: 'Word Document',
    description: 'Editable document format',
    icon: File,
    color: 'text-blue-600 bg-blue-50 hover:bg-blue-100'
  },
  {
    id: 'JSON',
    name: 'JSON Data',
    description: 'Structured data format',
    icon: Database,
    color: 'text-green-600 bg-green-50 hover:bg-green-100'
  },
  {
    id: 'CSV',
    name: 'CSV Spreadsheet',
    description: 'Tabular data format',
    icon: Table,
    color: 'text-purple-600 bg-purple-50 hover:bg-purple-100'
  }
];

export const ResourceExport: React.FC<ResourceExportProps> = ({
  resource,
  onExport,
  isLoading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);

  const handleExport = async (format: string) => {
    setExportingFormat(format);
    setIsOpen(false);
    
    try {
      // Use the existing export service
      const exportRequest = {
        type: 'resource',
        data: {
          resource: resource,
          content: (resource as any).content || 'Resource content not available',
          metadata: {
            title: resource.title,
            description: resource.description,
            category: resource.category,
            tier: resource.tier,
            lastUpdated: resource.lastUpdated
          }
        },
        format: format.toLowerCase(),
        options: {
          includeMetadata: true,
          customStyling: true
        }
      };

      const result = await exportService.exportData(exportRequest);
      
      if (result.success && (result as any).downloadUrl) {
        // Trigger download
        const link = document.createElement('a');
        link.href = (result as any).downloadUrl;
        link.download = `${resource.title.replace(/\s+/g, '_')}.${format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error(result.error || 'Export failed');
      }
      
      // Also call the parent handler for any additional logic
      await onExport(resource, format as any);
      
    } catch (error) {
      console.error('Export failed:', error);
      // TODO: Add toast notification for error
    } finally {
      setExportingFormat(null);
    }
  };

  const availableFormats = exportFormats.filter(format => 
    resource.exportFormats.includes(format.id)
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading || exportingFormat !== null}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {exportingFormat ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Exporting {exportingFormat}...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Export
            <ChevronDown className="h-4 w-4" />
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
          >
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Export Formats
              </div>
              
              {availableFormats.map((format) => {
                const Icon = format.icon;
                const isExporting = exportingFormat === format.id;
                
                return (
                  <button
                    key={format.id}
                    onClick={() => handleExport(format.id)}
                    disabled={isLoading || isExporting}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                      ${format.color}
                      ${isExporting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                    
                    <div className="flex-1 text-left">
                      <div className="font-medium">{format.name}</div>
                      <div className="text-xs opacity-75">{format.description}</div>
                    </div>
                  </button>
                );
              })}
              
              {availableFormats.length === 0 && (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  No export formats available
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
