'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  Download,
  FileText,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { getBrandName } from '@/app/lib/constants/brand-identity';
import toast from 'react-hot-toast';
import { exportICPToPDF } from '@/app/lib/utils/pdf-export';
import { exportToMarkdown, exportToCSV } from '@/app/lib/utils/data-export';

interface DemoGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (result: any) => void;
}

interface FormData {
  productName: string;
  description: string;
  businessModel: 'b2b-subscription' | 'b2b-one-time' | '';
}

interface FormErrors {
  productName?: string;
  description?: string;
  businessModel?: string;
}

type ModalState = 'form' | 'loading' | 'success' | 'error' | 'rate-limited';

export default function DemoGenerationModal({
  isOpen,
  onClose,
  onSuccess
}: DemoGenerationModalProps) {
  // State management
  const [modalState, setModalState] = useState<ModalState>('form');
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    description: '',
    businessModel: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [rateLimitInfo, setRateLimitInfo] = useState<any>(null);

  // Loading messages that rotate every 3 seconds
  const loadingMessages = [
    '🤔 Reading your product description...',
    '🧠 Identifying buyer pain points...',
    '🎯 Mapping decision-maker profiles...',
    '✨ Almost there...'
  ];

  // Rotate loading messages every 3 seconds
  useEffect(() => {
    if (modalState === 'loading') {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [modalState]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setModalState('form');
        setFormData({ productName: '', description: '', businessModel: '' });
        setFormErrors({});
        setLoadingMessageIndex(0);
        setGeneratedResult(null);
        setErrorMessage('');
        setRateLimitInfo(null);
      }, 300); // Wait for exit animation
    }
  }, [isOpen]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Product name validation
    if (!formData.productName.trim()) {
      errors.productName = 'Product name is required';
    } else if (formData.productName.length < 2) {
      errors.productName = 'Product name must be at least 2 characters';
    } else if (formData.productName.length > 100) {
      errors.productName = 'Product name must be less than 100 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = 'Product description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    // Business model validation
    if (!formData.businessModel) {
      errors.businessModel = 'Please select a business model';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setModalState('loading');
    setLoadingMessageIndex(0);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/demo/generate-icp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: formData.productName,
          description: formData.description,
          businessModel: formData.businessModel
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle rate limiting
        if (response.status === 429) {
          setModalState('rate-limited');
          setRateLimitInfo(data);
          return;
        }

        // Handle other errors
        throw new Error(data.error || 'Failed to generate ICP');
      }

      // Success
      setGeneratedResult(data);
      setModalState('success');

      if (onSuccess) {
        onSuccess(data);
      }

    } catch (error: any) {
      console.error('Demo generation error:', error);
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
      setModalState('error');
    }
  };

  // Handle input changes with real-time validation clearing
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle export actions with demo watermarks
  const handleExport = async (format: 'pdf' | 'markdown' | 'csv') => {
    if (!generatedResult || !generatedResult.personas) {
      toast.error('No data available to export');
      return;
    }

    // Prepare export data
    const exportData = {
      companyName: 'Demo - ' + (generatedResult.product?.productName || 'Product'),
      productName: generatedResult.product?.description || '',
      personas: generatedResult.personas,
      generatedAt: generatedResult.metadata?.generatedAt || new Date().toISOString()
    };

    if (format === 'pdf') {
      toast.loading('Generating demo PDF...', { id: 'demo-export' });

      const result = await exportICPToPDF(exportData, {
        includeDemoWatermark: true,
        companyName: exportData.companyName,
        productName: exportData.productName
      });

      if (result.success) {
        toast.success('Demo PDF exported! Contains watermarks - sign up to remove.', { id: 'demo-export' });
      } else {
        toast.error(result.error || 'Failed to export PDF', { id: 'demo-export' });
      }
    } else if (format === 'markdown') {
      toast.loading('Copying demo Markdown...', { id: 'demo-export' });

      const result = await exportToMarkdown(exportData, { includeDemoWatermark: true });

      if (result.success) {
        toast.success('Demo Markdown copied to clipboard! Contains watermarks - sign up to remove.', { id: 'demo-export' });
      } else {
        toast.error(result.error || 'Failed to export Markdown', { id: 'demo-export' });
      }
    } else {
      toast.loading('Generating demo CSV...', { id: 'demo-export' });

      const result = exportToCSV(exportData, { includeDemoWatermark: true });

      if (result.success) {
        toast.success('Demo CSV exported! Contains watermarks - sign up to remove.', { id: 'demo-export' });
      } else {
        toast.error(result.error || 'Failed to export CSV', { id: 'demo-export' });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl p-8 rounded-2xl border"
          style={{
            background: 'var(--glass-bg)',
            borderColor: 'var(--glass-border)',
            backdropFilter: 'blur(20px)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Live Demo</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-secondary/50 transition-colors"
            >
              <X className="w-5 h-5 text-text-muted" />
            </button>
          </div>

          {/* Form State */}
          {modalState === 'form' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="heading-2 mb-2">Generate Your First ICP</h2>
              <p className="body text-text-muted mb-8">
                Enter your product details and watch {getBrandName('short')} analyze your ideal buyers in real-time
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What's your product called?
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => handleInputChange('productName', e.target.value)}
                    placeholder="e.g., DevTool Pro, Salesforce CRM, Notion"
                    className={`w-full px-4 py-3 rounded-lg border bg-surface-secondary/50 focus:outline-none focus:ring-2 ${
                      formErrors.productName
                        ? 'border-red-500/50 focus:ring-red-500/20'
                        : 'border-glass-border focus:ring-blue-500/20'
                    }`}
                  />
                  {formErrors.productName && (
                    <p className="text-sm text-red-400 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.productName}
                    </p>
                  )}
                </div>

                {/* Product Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What does it do?
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="One sentence is enough. E.g., 'AI-powered code review that catches bugs before deployment'"
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border bg-surface-secondary/50 focus:outline-none focus:ring-2 resize-none ${
                      formErrors.description
                        ? 'border-red-500/50 focus:ring-red-500/20'
                        : 'border-glass-border focus:ring-blue-500/20'
                    }`}
                  />
                  {formErrors.description && (
                    <p className="text-sm text-red-400 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.description}
                    </p>
                  )}
                </div>

                {/* Business Model */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business Model
                  </label>
                  <select
                    value={formData.businessModel}
                    onChange={(e) => handleInputChange('businessModel', e.target.value as any)}
                    className={`w-full px-4 py-3 rounded-lg border bg-surface-secondary/50 focus:outline-none focus:ring-2 ${
                      formErrors.businessModel
                        ? 'border-red-500/50 focus:ring-red-500/20'
                        : 'border-glass-border focus:ring-blue-500/20'
                    }`}
                  >
                    <option value="">Select business model...</option>
                    <option value="b2b-subscription">B2B Subscription (SaaS)</option>
                    <option value="b2b-one-time">B2B One-Time Purchase</option>
                  </select>
                  {formErrors.businessModel && (
                    <p className="text-sm text-red-400 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.businessModel}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-full flex items-center justify-center gap-2 py-4"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate ICP Analysis
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-text-muted text-center">
                  🎭 This is a demo preview with DEMO watermarks. Sign up to save your analysis and remove watermarks.
                </p>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {modalState === 'loading' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="flex justify-center mb-6">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
              </div>

              <h3 className="heading-3 mb-3">
                Analyzing your product with {getBrandName('short')}'s advanced AI...
              </h3>

              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingMessageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="body-large text-text-muted"
                >
                  {loadingMessages[loadingMessageIndex]}
                </motion.p>
              </AnimatePresence>

              <div className="mt-8 max-w-md mx-auto">
                <div className="h-2 bg-surface-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 45, ease: 'linear' }}
                  />
                </div>
                <p className="text-sm text-text-muted mt-2">
                  This usually takes about 45 seconds...
                </p>
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {modalState === 'success' && generatedResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-green-500/10">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </div>
              </div>

              <h3 className="heading-3 mb-3">Your ICP Analysis is Ready!</h3>
              <p className="body-large text-text-muted mb-8">
                We've generated {generatedResult.personas?.length || 3} detailed buyer personas for{' '}
                <strong>{generatedResult.product?.productName}</strong>
              </p>

              {/* Personas Preview */}
              <div className="grid grid-cols-1 gap-4 mb-8 text-left">
                {generatedResult.personas?.slice(0, 3).map((persona: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border"
                    style={{
                      background: 'var(--surface-secondary)',
                      borderColor: 'var(--glass-border)'
                    }}
                  >
                    <h4 className="font-semibold mb-2">{persona.title}</h4>
                    <div className="text-sm text-text-muted">
                      <p>{persona.level} • {persona.department}</p>
                      {persona.psychographics?.goals?.[0] && (
                        <p className="mt-2">Goal: {persona.psychographics.goals[0]}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Export Actions */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleExport('pdf')}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Export as PDF
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleExport('markdown')}
                    className="btn btn-secondary flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Markdown
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="btn btn-secondary flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </button>
                </div>
              </div>

              {/* CTA */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <p className="text-sm text-text-muted mb-3">
                  Want to save this analysis and generate unlimited ICPs?
                </p>
                <a
                  href="/auth"
                  className="btn btn-primary btn-small inline-flex items-center gap-2"
                >
                  Sign Up Free
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {modalState === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-red-500/10">
                  <AlertCircle className="w-12 h-12 text-red-400" />
                </div>
              </div>

              <h3 className="heading-3 mb-3">Something Went Wrong</h3>
              <p className="body text-text-muted mb-8">
                {errorMessage}
              </p>

              <button
                onClick={() => setModalState('form')}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Rate Limited State */}
          {modalState === 'rate-limited' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-yellow-500/10">
                  <AlertCircle className="w-12 h-12 text-yellow-400" />
                </div>
              </div>

              <h3 className="heading-3 mb-3">Demo Limit Reached</h3>
              <p className="body text-text-muted mb-2">
                {rateLimitInfo?.error || 'You\'ve generated 3 demo ICPs in the last 24 hours.'}
              </p>
              <p className="body-small text-text-muted mb-8">
                {rateLimitInfo?.details || 'Sign up for free to generate unlimited ICPs with more features.'}
              </p>

              <a
                href={rateLimitInfo?.callToAction?.url || '/auth'}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                {rateLimitInfo?.callToAction?.text || 'Sign Up Free'}
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
