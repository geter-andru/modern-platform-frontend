'use client';

import React, { useState } from 'react';
import { ModernCard } from '@/src/shared/components/ui/ModernCard';

interface ExportCenterProps {
  customerId: string;
  onExport: (format: string, options: any) => void;
}

export function ExportCenter({ customerId, onExport }: ExportCenterProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Executive-ready PDF presentation',
      icon: '📄',
      color: 'red'
    },
    {
      id: 'powerpoint',
      name: 'PowerPoint',
      description: 'Customizable slide deck',
      icon: '📊',
      color: 'orange'
    },
    {
      id: 'excel',
      name: 'Excel Analysis',
      description: 'Data tables and charts',
      icon: '📈',
      color: 'green'
    },
    {
      id: 'crm',
      name: 'CRM Export',
      description: 'Salesforce/HubSpot integration',
      icon: '🎯',
      color: 'blue'
    },
    {
      id: 'email',
      name: 'Email Template',
      description: 'Ready-to-send outreach',
      icon: '✉️',
      color: 'purple'
    },
    {
      id: 'json',
      name: 'JSON Data',
      description: 'API integration format',
      icon: '🔗',
      color: 'indigo'
    }
  ];

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setSelectedFormat(format);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      onExport(format, { customerId });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setSelectedFormat('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exportFormats.map((format) => (
          <ModernCard key={format.id} className="p-6 hover:scale-105 transition-transform">
            <div className="text-center space-y-4">
              <div className="text-4xl mb-4">{format.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{format.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{format.description}</p>
              </div>
              
              <button
                onClick={() => handleExport(format.id)}
                disabled={isExporting}
                className={`
                  w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200
                  ${isExporting && selectedFormat === format.id
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : `bg-gradient-to-r from-${format.color}-600 to-${format.color}-700 hover:from-${format.color}-700 hover:to-${format.color}-800 text-white`
                  }
                `}
              >
                {isExporting && selectedFormat === format.id ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Exporting...</span>
                  </span>
                ) : (
                  `Export ${format.name}`
                )}
              </button>
            </div>
          </ModernCard>
        ))}
      </div>

      {/* Export History */}
      <ModernCard className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-white">Recent Exports</h3>
        </div>
        
        <div className="space-y-3">
          {[
            { format: 'PDF Report', time: '2 hours ago', status: 'completed' },
            { format: 'PowerPoint', time: '1 day ago', status: 'completed' },
            { format: 'CRM Export', time: '3 days ago', status: 'completed' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-white">{item.format}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-slate-400 text-sm">{item.time}</span>
                <span className="text-emerald-400 text-sm font-semibold">✓ {item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </ModernCard>

      {/* Export Settings */}
      <ModernCard className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-white">Export Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">Include Sections</label>
            <div className="space-y-2">
              {['Executive Summary', 'ICP Analysis', 'Cost Calculator', 'Business Case'].map((section) => (
                <label key={section} className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-slate-300">{section}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Output Quality</label>
            <select className="w-full p-2 bg-slate-700 text-white rounded-lg border border-slate-600">
              <option>High (Slower)</option>
              <option>Medium (Balanced)</option>
              <option>Fast (Lower Quality)</option>
            </select>
            
            <label className="block text-white font-medium mb-2 mt-4">Branding</label>
            <select className="w-full p-2 bg-slate-700 text-white rounded-lg border border-slate-600">
              <option>Company Branding</option>
              <option>H&S Platform Branding</option>
              <option>No Branding</option>
            </select>
          </div>
        </div>
      </ModernCard>
    </div>
  );
}