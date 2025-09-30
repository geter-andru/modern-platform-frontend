'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Share2, 
  Eye, 
  Calendar, 
  Users, 
  Clock, 
  FileText,
  CheckCircle,
  Lock,
  AlertCircle,
  ExternalLink,
  Copy,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Settings,
  RefreshCw
} from 'lucide-react';
import { 
  ResourceTier, 
  ResourceCategory, 
  GenerationStatus,
  ExportFormat
} from '@/lib/validation/schemas/resourcesLibrarySchemas';

// Types
interface Resource {
  id: string;
  title: string;
  description: string;
  tier: ResourceTier;
  category: ResourceCategory;
  status: 'available' | 'locked' | 'generating';
  lastUpdated: string;
  accessCount: number;
  content?: {
    sections?: Array<{
      id: string;
      title: string;
      content: string;
      order: number;
    }>;
    templates?: Array<{
      id: string;
      name: string;
      type: string;
      content: string;
    }>;
    frameworks?: Array<{
      id: string;
      name: string;
      description: string;
      steps: Array<{
        id: string;
        title: string;
        description: string;
        order: number;
      }>;
    }>;
  };
  metadata?: {
    generation_time_ms?: number;
    tokens_used?: number;
    cost_estimate?: number;
    ai_model?: string;
    version?: string;
  };
  export_formats?: ExportFormat[];
  dependencies?: string[];
  unlock_criteria?: Record<string, any>;
}

interface ResourceTierInfo {
  id: ResourceTier;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ResourceDetailModalProps {
  resource: Resource | null;
  tier: ResourceTierInfo;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (resource: Resource, format: ExportFormat) => void;
  onShare?: (resource: Resource) => void;
  onFeedback?: (resource: Resource, type: 'positive' | 'negative', comment?: string) => void;
  onRegenerate?: (resource: Resource) => void;
  isLoading?: boolean;
}

export function ResourceDetailModal({ 
  resource, 
  tier, 
  isOpen, 
  onClose, 
  onDownload,
  onShare,
  onFeedback,
  onRegenerate,
  isLoading = false 
}: ResourceDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'details' | 'feedback'>('overview');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative' | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
      setFeedbackComment('');
      setFeedbackType(null);
      setShowFeedbackForm(false);
    }
  }, [isOpen]);

  if (!resource || !isOpen) return null;

  const IconComponent = tier.icon;

  // Get status info
  const getStatusInfo = () => {
    switch (resource.status) {
      case 'available':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          text: 'Available',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'locked':
        return {
          icon: <Lock className="h-5 w-5 text-gray-400" />,
          text: 'Locked',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
      case 'generating':
        return {
          icon: <Clock className="h-5 w-5 text-blue-500 animate-spin" />,
          text: 'Generating',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      default:
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          text: 'Available',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
    }
  };

  const statusInfo = getStatusInfo();

  // Handle actions
  const handleDownload = (format: ExportFormat) => {
    if (onDownload && resource.status === 'available') {
      onDownload(resource, format);
    }
  };

  const handleShare = () => {
    if (onShare && resource.status === 'available') {
      onShare(resource);
    }
  };

  const handleFeedback = () => {
    if (onFeedback && feedbackType) {
      onFeedback(resource, feedbackType, feedbackComment);
      setFeedbackComment('');
      setFeedbackType(null);
      setShowFeedbackForm(false);
    }
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(resource);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format duration
  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.round(seconds / 60);
    return `${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className={`
              p-3 rounded-lg ${tier.bgColor}
            `}>
              <IconComponent className={`h-8 w-8 ${tier.color}`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{resource.title}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-semibold
                  ${tier.bgColor} ${tier.color}
                `}>
                  {tier.name}
                </span>
                <div className={`
                  flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                  ${statusInfo.bgColor} ${statusInfo.color}
                `}>
                  {statusInfo.icon}
                  <span>{statusInfo.text}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {resource.status === 'available' && (
              <>
                <button
                  onClick={handleShare}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Share resource"
                >
                  <Share2 className="h-5 w-5 text-gray-500" />
                </button>
                {onRegenerate && (
                  <button
                    onClick={handleRegenerate}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Regenerate resource"
                  >
                    <RefreshCw className="h-5 w-5 text-gray-500" />
                  </button>
                )}
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'content', label: 'Content', icon: FileText },
              { id: 'details', label: 'Details', icon: Settings },
              { id: 'feedback', label: 'Feedback', icon: MessageSquare }
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-6"
              >
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{resource.description}</p>
                </div>

                {/* Key Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Resource Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{resource.category.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Access Count:</span>
                        <span className="font-medium">{resource.accessCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">{formatDate(resource.lastUpdated)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Generation Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Generation Time:</span>
                        <span className="font-medium">{formatDuration(resource.metadata?.generation_time_ms)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">AI Model:</span>
                        <span className="font-medium">{resource.metadata?.ai_model || 'Claude 3.5 Sonnet'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Version:</span>
                        <span className="font-medium">{resource.metadata?.version || '1.0'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {resource.status === 'available' && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Available Actions</h4>
                    <div className="flex flex-wrap gap-3">
                      {resource.export_formats?.map(format => (
                        <button
                          key={format}
                          onClick={() => handleDownload(format)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download {format.toUpperCase()}</span>
                        </button>
                      )) || (
                        <button
                          onClick={() => handleDownload('pdf')}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download PDF</span>
                        </button>
                      )}
                      <button
                        onClick={handleShare}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-6"
              >
                {resource.content?.sections && resource.content.sections.length > 0 ? (
                  <div className="space-y-6">
                    {resource.content.sections
                      .sort((a, b) => a.order - b.order)
                      .map(section => (
                        <div key={section.id} className="border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                              {section.content}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No content available</h3>
                    <p className="text-gray-600">
                      {resource.status === 'generating' 
                        ? 'Content is being generated...' 
                        : 'This resource does not have content sections yet.'
                      }
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-6"
              >
                {/* Technical Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resource ID:</span>
                      <span className="font-mono text-xs">{resource.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Generation Time:</span>
                      <span className="font-medium">{formatDuration(resource.metadata?.generation_time_ms)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tokens Used:</span>
                      <span className="font-medium">{resource.metadata?.tokens_used?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost Estimate:</span>
                      <span className="font-medium">${resource.metadata?.cost_estimate?.toFixed(4) || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">AI Model:</span>
                      <span className="font-medium">{resource.metadata?.ai_model || 'Claude 3.5 Sonnet'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Version:</span>
                      <span className="font-medium">{resource.metadata?.version || '1.0'}</span>
                    </div>
                  </div>
                </div>

                {/* Dependencies */}
                {resource.dependencies && resource.dependencies.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Dependencies</h3>
                    <div className="space-y-2">
                      {resource.dependencies.map(dep => (
                        <div key={dep} className="flex items-center space-x-2 text-sm">
                          <ExternalLink className="h-4 w-4 text-yellow-600" />
                          <span className="text-gray-700">{dep}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Export Formats */}
                {resource.export_formats && resource.export_formats.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Formats</h3>
                    <div className="flex flex-wrap gap-2">
                      {resource.export_formats.map(format => (
                        <span
                          key={format}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                        >
                          {format.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Your Feedback</h3>
                  <p className="text-gray-600 mb-6">
                    Help us improve this resource by sharing your thoughts and suggestions.
                  </p>
                </div>

                {/* Quick Feedback */}
                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={() => setFeedbackType('positive')}
                    className={`
                      flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors
                      ${feedbackType === 'positive' 
                        ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span>Helpful</span>
                  </button>
                  <button
                    onClick={() => setFeedbackType('negative')}
                    className={`
                      flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors
                      ${feedbackType === 'negative' 
                        ? 'bg-red-100 text-red-700 border-2 border-red-300' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    <ThumbsDown className="h-5 w-5" />
                    <span>Not Helpful</span>
                  </button>
                </div>

                {/* Detailed Feedback */}
                {feedbackType && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Comments (Optional)
                      </label>
                      <textarea
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        placeholder="Tell us more about your experience with this resource..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setFeedbackType(null);
                          setFeedbackComment('');
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleFeedback}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
