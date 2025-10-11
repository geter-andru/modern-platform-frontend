'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Share2, 
  Clock, 
  Users,
  Lock,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

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

interface ResourceTier {
  id: 1 | 2 | 3;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  isUnlocked: boolean;
  unlockRequirement?: string;
}

interface ResourceGridProps {
  resources: Resource[];
  tier: ResourceTier;
  onResourceClick: (resource: Resource) => void;
  isLoading?: boolean;
}

const categoryIcons = {
  content_templates: FileText,
  guides: FileText,
  frameworks: CheckCircle,
  ai_prompts: Sparkles,
  one_pagers: FileText,
  slide_decks: FileText
};

const categoryColors = {
  content_templates: 'text-blue-600 bg-blue-50',
  guides: 'text-green-600 bg-green-50',
  frameworks: 'text-purple-600 bg-purple-50',
  ai_prompts: 'text-orange-600 bg-orange-50',
  one_pagers: 'text-indigo-600 bg-indigo-50',
  slide_decks: 'text-pink-600 bg-pink-50'
};

export const ResourceGrid: React.FC<ResourceGridProps> = ({
  resources,
  tier,
  onResourceClick,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48"></div>
          </div>
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <tier.icon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No resources available</h3>
        <p className="mt-1 text-sm text-gray-500">
          {tier.isUnlocked 
            ? 'No resources have been generated for this tier yet.'
            : 'Complete the requirements to unlock this tier.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource, index) => {
        const CategoryIcon = categoryIcons[resource.category];
        const categoryColor = categoryColors[resource.category];
        
        return (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              group relative bg-white rounded-lg border-2 transition-all duration-200 cursor-pointer
              ${resource.status === 'available' 
                ? 'border-gray-200 hover:border-gray-300 hover:shadow-lg' 
                : 'border-gray-100 cursor-not-allowed opacity-60'
              }
            `}
            onClick={() => resource.status === 'available' && onResourceClick(resource)}
          >
            {/* Status Indicator */}
            <div className="absolute top-3 right-3">
              {resource.status === 'available' && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
              {resource.status === 'locked' && (
                <Lock className="h-4 w-4 text-gray-400" />
              )}
              {resource.status === 'generating' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              )}
            </div>

            <div className="p-6">
              {/* Category Badge */}
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor} mb-3`}>
                <CategoryIcon className="h-3 w-3 mr-1" />
                {resource.category.replace('_', ' ')}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {resource.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {resource.description}
              </p>

              {/* Dependencies */}
              {resource.dependencies && resource.dependencies.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Dependencies
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {resource.dependencies.slice(0, 2).map((dep) => (
                      <span key={dep} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {dep.replace('-', ' ')}
                      </span>
                    ))}
                    {resource.dependencies.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{resource.dependencies.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {resource.lastUpdated}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {resource.accessCount}
                  </div>
                </div>
                
                {/* Export Formats */}
                <div className="flex items-center gap-1">
                  {resource.exportFormats.slice(0, 2).map((format) => (
                    <span key={format} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                      {format}
                    </span>
                  ))}
                  {resource.exportFormats.length > 2 && (
                    <span className="text-xs">+{resource.exportFormats.length - 2}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Hover Overlay */}
            {resource.status === 'available' && (
              <div className="absolute inset-0 bg-blue-50 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-2 text-blue-600 font-medium">
                  <FileText className="h-4 w-4" />
                  View Resource
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
