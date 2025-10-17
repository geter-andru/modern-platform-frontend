'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Share2, 
  Copy, 
  FileText,
  Clock,
  Users,
  ExternalLink
} from 'lucide-react';
import { ResourceExport } from './ResourceExport';

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

interface ResourceModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onExport: (resource: Resource, format: string) => void;
  onShare: (resource: Resource) => void;
  isLoading?: boolean;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({
  resource,
  isOpen,
  onClose,
  onExport,
  onShare,
  isLoading = false
}) => {
  if (!resource) return null;

  // Content will be fetched from API - placeholder for now
  const getContentTemplate = (category: string) => {
    return `# ${resource.title}

## Overview
${resource.description}

## Content Loading
This resource content will be loaded from the API based on the resource type and user's access level.

## Status
${resource.status === 'available' ? 'Available for download' : 
  resource.status === 'locked' ? 'Locked - complete prerequisites to unlock' : 
  'Generating content...'}

## Export Formats
${resource.exportFormats.join(', ')}
`;
  };

  const content = getContentTemplate(resource.category);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl bg-white rounded-lg shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{resource.title}</h2>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onShare(resource)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Share resource"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                    {content}
                  </pre>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Updated {resource.lastUpdated}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {resource.accessCount} views
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(content);
                      // TODO: Add toast notification
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                  
                  <ResourceExport
                    resource={resource}
                    onExport={onExport}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
