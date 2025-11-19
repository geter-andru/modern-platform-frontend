'use client';

/**
 * Dependency Validation Modal
 *
 * Professional modal for validating resource generation dependencies.
 * Shows missing dependencies, estimated costs, and suggested generation order.
 *
 * Features:
 * - Real-time validation via API
 * - Visual dependency tree
 * - Cost estimation with token breakdown
 * - Recommended generation path
 * - One-click dependency generation
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, AlertCircle, CheckCircle, ArrowRight, DollarSign,
  Zap, Clock, GitBranch, Loader2, ExternalLink, TrendingUp
} from 'lucide-react';

// TypeScript interfaces
interface ValidationResult {
  valid: boolean;
  resourceId: string;
  resourceName: string;
  missingDependencies: Array<{
    resourceId: string;
    resourceName: string;
    tier: number;
    estimatedCost: number;
    estimatedTokens: number;
  }>;
  estimatedCost: number;
  estimatedTokens: number;
  suggestedOrder: Array<{
    resourceId: string;
    resourceName: string;
    tier: number;
    reason: string;
  }>;
  cacheStatus?: {
    cached: boolean;
    cacheAge?: number;
  };
}

interface DependencyValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: string;
  resourceName: string;
  onGenerateDependency?: (resourceId: string) => void;
  onGenerateAll?: (resourceIds: string[]) => void;
}

const DependencyValidationModal: React.FC<DependencyValidationModalProps> = ({
  isOpen,
  onClose,
  resourceId,
  resourceName,
  onGenerateDependency,
  onGenerateAll
}) => {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch validation on mount and when resourceId changes
  useEffect(() => {
    if (isOpen && resourceId) {
      fetchValidation();
    }
  }, [isOpen, resourceId]);

  const fetchValidation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dependencies/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resourceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to validate dependencies');
      }

      const data = await response.json();

      if (data.success) {
        setValidation(data.validation);
      } else {
        throw new Error(data.error || 'Validation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDependency = (depResourceId: string) => {
    if (onGenerateDependency) {
      onGenerateDependency(depResourceId);
      onClose();
    }
  };

  const handleGenerateAll = () => {
    if (onGenerateAll && validation) {
      const resourceIds = validation.suggestedOrder.map(r => r.resourceId);
      onGenerateAll(resourceIds);
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
        onClick={handleOverlayClick}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={handleStopPropagation}
          className="bg-black/90 backdrop-blur-lg border border-white/10 shadow-2xl shadow-black/50 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Dependency Validation
                </h2>
                <p className="text-sm text-gray-400">
                  {resourceName}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Validating dependencies...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-300 mb-2">
                      Validation Error
                    </h3>
                    <p className="text-sm text-red-100">
                      {error}
                    </p>
                    <button
                      onClick={fetchValidation}
                      className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Retry Validation
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Success State - All Dependencies Met */}
            {validation && validation.valid && !isLoading && !error && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-green-300 mb-2">
                      Ready to Generate
                    </h3>
                    <p className="text-sm text-green-100 mb-4">
                      All required dependencies are satisfied. You can proceed with generating this resource.
                    </p>

                    {/* Cost Estimate */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-900/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-xs text-green-300 font-medium">Estimated Cost</span>
                        </div>
                        <div className="text-lg font-semibold text-green-200">
                          ${validation.estimatedCost.toFixed(4)}
                        </div>
                      </div>

                      <div className="bg-green-900/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <Zap className="w-4 h-4 text-green-400" />
                          <span className="text-xs text-green-300 font-medium">Estimated Tokens</span>
                        </div>
                        <div className="text-lg font-semibold text-green-200">
                          {validation.estimatedTokens.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {validation.cacheStatus?.cached && (
                      <div className="mt-4 flex items-center space-x-2 text-xs text-green-400">
                        <TrendingUp className="w-3 h-3" />
                        <span>Validation cached • {validation.cacheStatus.cacheAge}s old</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Missing Dependencies State */}
            {validation && !validation.valid && !isLoading && !error && (
              <>
                {/* Summary */}
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-yellow-300 mb-2">
                        Missing Dependencies
                      </h3>
                      <p className="text-sm text-yellow-100">
                        This resource requires {validation.missingDependencies.length} prerequisite{validation.missingDependencies.length > 1 ? 's' : ''} to be generated first.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Missing Dependencies List */}
                <div>
                  <h3 className="font-medium text-white mb-4 flex items-center space-x-2">
                    <ArrowRight className="w-5 h-5 text-blue-400" />
                    <span>Required Resources</span>
                  </h3>

                  <div className="space-y-3">
                    {validation.missingDependencies.map((dep, index) => (
                      <div key={dep.resourceId} className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-xs font-medium text-gray-500">
                                Tier {dep.tier}
                              </span>
                              <span className="text-xs text-gray-600">•</span>
                              <h4 className="text-sm font-medium text-white">
                                {dep.resourceName}
                              </h4>
                            </div>

                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center space-x-1">
                                <DollarSign className="w-3 h-3" />
                                <span>${dep.estimatedCost.toFixed(4)}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Zap className="w-3 h-3" />
                                <span>{dep.estimatedTokens.toLocaleString()} tokens</span>
                              </span>
                            </div>
                          </div>

                          {onGenerateDependency && (
                            <button
                              onClick={() => handleGenerateDependency(dep.resourceId)}
                              className="ml-4 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                            >
                              <span>Generate</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Generation Order */}
                {validation.suggestedOrder && validation.suggestedOrder.length > 0 && (
                  <div>
                    <h3 className="font-medium text-white mb-4 flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-green-400" />
                      <span>Recommended Generation Order</span>
                    </h3>

                    <div className="space-y-2">
                      {validation.suggestedOrder.map((step, index) => (
                        <div key={step.resourceId} className="flex items-start space-x-4 p-3 bg-gray-800 rounded-lg">
                          <div className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-blue-300">
                              {index + 1}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium text-gray-500">
                                Tier {step.tier}
                              </span>
                              <span className="text-xs text-gray-600">•</span>
                              <h4 className="text-sm font-medium text-white truncate">
                                {step.resourceName}
                              </h4>
                            </div>
                            <p className="text-xs text-gray-400">
                              {step.reason}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total Cost Summary */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="font-medium text-white mb-4">Total Cost to Complete</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <DollarSign className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-gray-400 font-medium">Total Cost</span>
                      </div>
                      <div className="text-xl font-semibold text-white">
                        ${validation.estimatedCost.toFixed(4)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Includes all dependencies
                      </div>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-gray-400 font-medium">Total Tokens</span>
                      </div>
                      <div className="text-xl font-semibold text-white">
                        {validation.estimatedTokens.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Combined token usage
                      </div>
                    </div>
                  </div>
                </div>

                {/* Information Notice */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="font-medium text-blue-300 mb-2 text-sm">
                    Dependency-Based Architecture
                  </h4>
                  <p className="text-xs text-blue-100">
                    Our platform uses a tier-based dependency system to ensure each resource is built on high-quality prerequisite data.
                    This approach maximizes the accuracy and relevance of AI-generated outputs.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {validation && !validation.valid && !isLoading && !error && (
            <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-800/50">
              <div className="text-sm text-gray-400">
                Generate dependencies in the recommended order for best results
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>

                {onGenerateAll && (
                  <button
                    onClick={handleGenerateAll}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <span>Generate All ({validation.missingDependencies.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {validation && validation.valid && !isLoading && !error && (
            <div className="flex items-center justify-end p-6 border-t border-gray-700 bg-gray-800/50">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
              >
                Continue to Generation
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DependencyValidationModal;
