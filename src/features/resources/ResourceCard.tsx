'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  CheckCircle, 
  Clock, 
  Download, 
  Eye, 
  MoreVertical,
  Calendar,
  Users
} from 'lucide-react';

// Types
interface Resource {
  id: string;
  title: string;
  description: string;
  tier: 1 | 2 | 3;
  category: string;
  status: 'available' | 'locked' | 'generating';
  lastUpdated: string;
  accessCount: number;
}

interface ResourceTier {
  id: 1 | 2 | 3;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ResourceCardProps {
  resource: Resource;
  tier: ResourceTier;
  viewMode?: 'grid' | 'list';
  onClick?: (resource: Resource) => void;
  onDownload?: (resource: Resource) => void;
  onView?: (resource: Resource) => void;
  className?: string;
  index?: number;
}

export function ResourceCard({ 
  resource, 
  tier, 
  viewMode = 'grid',
  onClick,
  onDownload,
  onView,
  className = '',
  index = 0
}: ResourceCardProps) {
  const IconComponent = tier.icon;
  const isInteractive = resource.status === 'available';

  // Get status icon and styling
  const getStatusIcon = () => {
    switch (resource.status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'locked':
        return <Lock className="h-4 w-4 text-gray-400" />;
      case 'generating':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  // Get status styling
  const getStatusStyling = () => {
    switch (resource.status) {
      case 'available':
        return {
          card: 'border-gray-200 hover:border-gray-300 cursor-pointer hover:shadow-lg',
          overlay: 'bg-blue-500/5'
        };
      case 'locked':
        return {
          card: 'border-gray-100 cursor-not-allowed opacity-75',
          overlay: 'bg-gray-500/5'
        };
      case 'generating':
        return {
          card: 'border-blue-200 cursor-wait opacity-90',
          overlay: 'bg-blue-500/5'
        };
      default:
        return {
          card: 'border-gray-200',
          overlay: ''
        };
    }
  };

  const statusStyling = getStatusStyling();

  // Handle click events
  const handleClick = () => {
    if (isInteractive && onClick) {
      onClick(resource);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInteractive && onDownload) {
      onDownload(resource);
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInteractive && onView) {
      onView(resource);
    }
  };

  // Grid view component
  const GridView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`
        group relative bg-white rounded-xl border-2 transition-all duration-300
        ${statusStyling.card}
        ${tier.borderColor}
        ${className}
      `}
      onClick={handleClick}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Tier Badge */}
      <div className={`
        absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold
        ${tier.bgColor} ${tier.color}
      `}>
        {tier.name}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`
            p-3 rounded-lg ${tier.bgColor}
          `}>
            <IconComponent className={`h-6 w-6 ${tier.color}`} />
          </div>
          {getStatusIcon()}
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {resource.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {resource.description}
        </p>

        {/* Category */}
        <div className="text-xs text-gray-500 mb-4 font-medium">
          {resource.category.replace('_', ' ').toUpperCase()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{resource.accessCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(resource.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      {isInteractive && (
        <div className={`
          absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
          transition-opacity duration-300 ${statusStyling.overlay}
        `} />
      )}

      {/* Action Buttons (on hover) */}
      {isInteractive && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-1">
            <button
              onClick={handleView}
              className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors"
              title="View resource"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors"
              title="Download resource"
            >
              <Download className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );

  // List view component
  const ListView = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`
        group flex items-center p-4 bg-white rounded-lg border transition-all duration-300
        ${statusStyling.card}
        ${className}
      `}
      onClick={handleClick}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Icon */}
      <div className={`
        p-3 rounded-lg mr-4 ${tier.bgColor}
      `}>
        <IconComponent className={`h-6 w-6 ${tier.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {resource.title}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`
              px-2 py-1 rounded-full text-xs font-semibold
              ${tier.bgColor} ${tier.color}
            `}>
              {tier.name}
            </span>
            {getStatusIcon()}
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {resource.description}
        </p>
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span className="font-medium">{resource.category.replace('_', ' ').toUpperCase()}</span>
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{resource.accessCount} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(resource.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {isInteractive && (
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleView}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            title="View resource"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-gray-400 hover:text-green-500 transition-colors"
            title="Download resource"
          >
            <Download className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      )}
    </motion.div>
  );

  return viewMode === 'grid' ? <GridView /> : <ListView />;
}

// Loading skeleton component
export function ResourceCardSkeleton({ viewMode = 'grid' }: { viewMode?: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 animate-pulse">
        <div className="p-3 rounded-lg bg-gray-200 mr-4">
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
        </div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 animate-pulse">
      {/* Tier Badge */}
      <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-gray-200">
        <div className="h-3 w-12 bg-gray-300 rounded"></div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-gray-200">
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
        </div>
        <div className="h-4 w-4 bg-gray-200 rounded"></div>
      </div>

      {/* Title & Description */}
      <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>

      {/* Category */}
      <div className="h-3 bg-gray-200 rounded mb-4 w-1/3"></div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
}
