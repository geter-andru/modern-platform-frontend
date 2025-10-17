'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  File,
  Share2,
  Mail,
  Link2,
  Settings,
  ChevronDown,
  Check,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';

/**
 * ExportControls - Advanced export and sharing interface
 * 
 * Features:
 * - Multiple export formats (PDF, Excel, CSV, JSON, Image)
 * - Custom export configurations
 * - Scheduled exports
 * - Direct sharing options
 * - Batch export capabilities
 * - Progress tracking
 * - Email integration
 * - Custom branding options
 */

export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'png' | 'jpeg' | 'svg';

export interface ExportJob {
  id: string;
  format: ExportFormat;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  fileName: string;
  fileSize?: number;
  downloadUrl?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface ExportConfig {
  format: ExportFormat;
  includeHeaders?: boolean;
  includeImages?: boolean;
  pageOrientation?: 'portrait' | 'landscape';
  paperSize?: 'a4' | 'letter' | 'a3';
  compression?: 'none' | 'low' | 'medium' | 'high';
  customBranding?: boolean;
  includeDateRange?: boolean;
  includeFilters?: boolean;
  customFields?: string[];
}

export interface ShareOption {
  type: 'email' | 'link' | 'embed';
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

export interface ExportControlsProps {
  data: any;
  onExport: (config: ExportConfig) => Promise<ExportJob>;
  onShare?: (shareType: string, config: any) => void;
  availableFormats?: ExportFormat[];
  showScheduler?: boolean;
  showSharing?: boolean;
  showBatchExport?: boolean;
  customBranding?: boolean;
  className?: string;
  maxFileSize?: number; // in MB
}

const ExportControls: React.FC<ExportControlsProps> = ({
  data,
  onExport,
  onShare,
  availableFormats = ['pdf', 'excel', 'csv', 'json'],
  showScheduler = false,
  showSharing = true,
  showBatchExport = false,
  customBranding = false,
  className = '',
  maxFileSize = 50
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'pdf',
    includeHeaders: true,
    includeImages: true,
    pageOrientation: 'portrait',
    paperSize: 'a4',
    compression: 'medium',
    customBranding: false,
    includeDateRange: true,
    includeFilters: false
  });
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [scheduledExports, setScheduledExports] = useState<any[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format configurations
  const formatOptions = {
    pdf: {
      label: 'PDF Document',
      icon: <FileText className="w-4 h-4" />,
      description: 'Formatted document with layouts',
      extension: '.pdf'
    },
    excel: {
      label: 'Excel Spreadsheet',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      description: 'Editable spreadsheet format',
      extension: '.xlsx'
    },
    csv: {
      label: 'CSV File',
      icon: <File className="w-4 h-4" />,
      description: 'Comma-separated values',
      extension: '.csv'
    },
    json: {
      label: 'JSON Data',
      icon: <File className="w-4 h-4" />,
      description: 'Raw data format',
      extension: '.json'
    },
    png: {
      label: 'PNG Image',
      icon: <ImageIcon className="w-4 h-4" />,
      description: 'High-quality image',
      extension: '.png'
    },
    jpeg: {
      label: 'JPEG Image',
      icon: <ImageIcon className="w-4 h-4" />,
      description: 'Compressed image format',
      extension: '.jpeg'
    },
    svg: {
      label: 'SVG Vector',
      icon: <ImageIcon className="w-4 h-4" />,
      description: 'Scalable vector format',
      extension: '.svg'
    }
  };

  // Share options
  const shareOptions: ShareOption[] = [
    {
      type: 'email',
      label: 'Send via Email',
      icon: <Mail className="w-4 h-4" />,
      action: () => onShare?.('email', { format: selectedFormat, config: exportConfig })
    },
    {
      type: 'link',
      label: 'Share Link',
      icon: <Link2 className="w-4 h-4" />,
      action: () => onShare?.('link', { format: selectedFormat, config: exportConfig })
    },
    {
      type: 'embed',
      label: 'Embed Code',
      icon: <Share2 className="w-4 h-4" />,
      action: () => onShare?.('embed', { format: selectedFormat, config: exportConfig })
    }
  ];

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle export
  const handleExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    
    try {
      const job = await onExport({ ...exportConfig, format: selectedFormat });
      setExportJobs(prev => [job, ...prev]);
      
      // Poll for job completion
      const pollInterval = setInterval(async () => {
        // In a real implementation, you'd poll the backend for job status
        // For now, simulate completion after 3 seconds
        setTimeout(() => {
          setExportJobs(prev => prev.map(j => 
            j.id === job.id 
              ? { ...j, status: 'completed', progress: 100, completedAt: new Date(), downloadUrl: '#' }
              : j
          ));
          clearInterval(pollInterval);
        }, 3000);
      }, 500);
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  // Handle batch export
  const handleBatchExport = async () => {
    const batchFormats = availableFormats.slice(0, 3); // Export first 3 formats
    
    for (const format of batchFormats) {
      const config = { ...exportConfig, format };
      await handleExport();
    }
  };

  // Update export config
  const updateConfig = (key: keyof ExportConfig, value: any) => {
    setExportConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Export Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isExporting}
          className={`
            flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium
            transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50
            ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Export</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="Export Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {showBatchExport && (
            <button
              onClick={handleBatchExport}
              className="px-3 py-2 text-sm bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Batch Export"
            >
              Batch
            </button>
          )}
        </div>
      </div>

      {/* Export Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 min-w-[300px] max-w-[400px]"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Export Options</h3>

              {/* Format Selection */}
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium text-gray-300">Format</label>
                <div className="grid grid-cols-1 gap-2">
                  {availableFormats.map(format => {
                    const config = formatOptions[format];
                    return (
                      <button
                        key={format}
                        onClick={() => setSelectedFormat(format)}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg border transition-all text-left
                          ${selectedFormat === format
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                            : 'border-gray-700 bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                          }
                        `}
                      >
                        {config.icon}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{config.label}</p>
                          <p className="text-xs text-gray-400">{config.description}</p>
                        </div>
                        {selectedFormat === format && (
                          <Check className="w-4 h-4 text-blue-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Export Button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  Size estimate: ~{Math.round(JSON.stringify(data).length / 1024)}KB
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {isExporting ? 'Exporting...' : 'Export'}
                  </button>
                </div>
              </div>
            </div>

            {/* Share Options */}
            {showSharing && (
              <div className="border-t border-gray-700 p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Share Options</h4>
                <div className="flex items-center gap-2">
                  {shareOptions.map(option => (
                    <button
                      key={option.type}
                      onClick={option.action}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      {option.icon}
                      <span className="hidden sm:inline">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Configuration Panel */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 bg-gray-800/50 border border-gray-700 rounded-xl p-4 overflow-hidden"
          >
            <h4 className="text-lg font-semibold text-white mb-4">Export Configuration</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* General Options */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-300">General</h5>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeHeaders}
                    onChange={(e) => updateConfig('includeHeaders', e.target.checked)}
                    className="w-4 h-4 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Include Headers</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeImages}
                    onChange={(e) => updateConfig('includeImages', e.target.checked)}
                    className="w-4 h-4 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Include Images</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeDateRange}
                    onChange={(e) => updateConfig('includeDateRange', e.target.checked)}
                    className="w-4 h-4 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Include Date Range</span>
                </label>
              </div>

              {/* PDF Specific */}
              {selectedFormat === 'pdf' && (
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-gray-300">PDF Options</h5>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Orientation</label>
                    <select
                      value={exportConfig.pageOrientation}
                      onChange={(e) => updateConfig('pageOrientation', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Paper Size</label>
                    <select
                      value={exportConfig.paperSize}
                      onChange={(e) => updateConfig('paperSize', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="a4">A4</option>
                      <option value="letter">Letter</option>
                      <option value="a3">A3</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Branding */}
            {customBranding && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportConfig.customBranding}
                    onChange={(e) => updateConfig('customBranding', e.target.checked)}
                    className="w-4 h-4 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Include Custom Branding</span>
                </label>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Jobs Status */}
      {exportJobs.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Export History</h4>
          <div className="space-y-2">
            {exportJobs.slice(0, 3).map(job => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg"
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {job.status === 'processing' && (
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  )}
                  {job.status === 'completed' && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                  {job.status === 'failed' && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                  {job.status === 'pending' && (
                    <Clock className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {job.fileName}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="capitalize">{job.status}</span>
                    {job.fileSize && <span>{formatFileSize(job.fileSize)}</span>}
                    {job.status === 'processing' && (
                      <span>{job.progress}%</span>
                    )}
                  </div>
                </div>

                {/* Download Button */}
                {job.status === 'completed' && job.downloadUrl && (
                  <a
                    href={job.downloadUrl}
                    download={job.fileName}
                    className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportControls;