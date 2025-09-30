'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon,
  PresentationChartBarIcon,
  CloudArrowDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: any;
  format: string;
  size: string;
  available: boolean;
}

interface ExportCenterProps {
  customerId: string;
  onExport?: (format: string, options: any) => void;
}

export function ExportCenter({ customerId, onExport }: ExportCenterProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [exportStatus, setExportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showOptions, setShowOptions] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    includeCharts: true,
    includeAnalysis: true,
    includeRecommendations: true,
    timeRange: '30days',
    format: 'detailed',
  });

  const exportFormats: ExportFormat[] = [
    {
      id: 'pdf-report',
      name: 'Executive Report',
      description: 'Complete business case with charts and analysis',
      icon: DocumentTextIcon,
      format: 'PDF',
      size: '~2.5 MB',
      available: true,
    },
    {
      id: 'excel-data',
      name: 'Data Export',
      description: 'Raw data with calculations and metrics',
      icon: TableCellsIcon,
      format: 'Excel',
      size: '~850 KB',
      available: true,
    },
    {
      id: 'ppt-presentation',
      name: 'Presentation Deck',
      description: 'Ready-to-present slides with key insights',
      icon: PresentationChartBarIcon,
      format: 'PowerPoint',
      size: '~4.2 MB',
      available: true,
    },
    {
      id: 'json-api',
      name: 'API Export',
      description: 'Structured data for integration',
      icon: CloudArrowDownIcon,
      format: 'JSON',
      size: '~125 KB',
      available: true,
    },
  ];

  const handleExport = async (formatId: string) => {
    setSelectedFormat(formatId);
    setExportStatus('loading');

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would call the actual export API
      if (onExport) {
        onExport(formatId, exportOptions);
      }

      // Simulate file download
      const format = exportFormats.find(f => f.id === formatId);
      if (format) {
        const blob = new Blob(['Export content'], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formatId}-${customerId}-${new Date().toISOString().split('T')[0]}.${format.format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setExportStatus('success');
      setTimeout(() => {
        setExportStatus('idle');
        setSelectedFormat('');
      }, 3000);
    } catch (error) {
      setExportStatus('error');
      setTimeout(() => {
        setExportStatus('idle');
        setSelectedFormat('');
      }, 3000);
    }
  };

  const getStatusIcon = () => {
    switch (exportStatus) {
      case 'loading':
        return <ClockIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <DocumentArrowDownIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (exportStatus) {
      case 'loading':
        return 'Generating export...';
      case 'success':
        return 'Export completed successfully!';
      case 'error':
        return 'Export failed. Please try again.';
      default:
        return 'Export your data and reports';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {getStatusIcon()}
          <h2 className="text-xl font-semibold text-gray-900 ml-3">Export Center</h2>
        </div>
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showOptions ? 'Hide Options' : 'Export Options'}
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        {getStatusMessage()}
      </p>

      {/* Export Options */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-4 mb-6 bg-gray-50"
          >
            <h3 className="font-medium text-gray-900 mb-3">Export Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Range
                </label>
                <select
                  value={exportOptions.timeRange}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, timeRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="90days">Last 90 days</option>
                  <option value="all">All time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detail Level
                </label>
                <select
                  value={exportOptions.format}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="summary">Summary</option>
                  <option value="detailed">Detailed</option>
                  <option value="comprehensive">Comprehensive</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includeCharts}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Include charts and visualizations</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includeAnalysis}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeAnalysis: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Include detailed analysis</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includeRecommendations}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeRecommendations: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Include recommendations</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Formats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
        {exportFormats.map((format, index) => {
          const IconComponent = format.icon;
          const isSelected = selectedFormat === format.id;
          const isLoading = exportStatus === 'loading' && isSelected;

          return (
            <motion.div
              key={format.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${!format.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => format.available && !isLoading && handleExport(format.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      isSelected ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{format.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{format.description}</p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="font-medium">{format.format}</span>
                      <span>{format.size}</span>
                    </div>
                  </div>
                </div>

                {isLoading && (
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                )}
              </div>

              {!format.available && (
                <div className="mt-3 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Coming soon
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Export History */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Exports</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
            <div className="flex items-center">
              <DocumentTextIcon className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-700">Executive Report - PDF</span>
            </div>
            <span className="text-gray-500 text-xs">2 hours ago</span>
          </div>
          
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
            <div className="flex items-center">
              <TableCellsIcon className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-700">Data Export - Excel</span>
            </div>
            <span className="text-gray-500 text-xs">1 day ago</span>
          </div>
        </div>
      </div>

      {/* Bulk Export */}
      <div className="mt-6">
        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
          Export All Formats
        </button>
      </div>
    </div>
  );
}