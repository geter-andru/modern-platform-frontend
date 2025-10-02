'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Sparkles, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Info
} from 'lucide-react';
import { 
  ResourceTier, 
  ResourceCategory, 
  GenerateResourceRequest,
  CumulativeIntelligenceContext
} from '@/lib/validation/schemas/resourcesLibrarySchemas';

// Types
interface ResourceGenerationFormProps {
  customerId: string;
  onGenerate: (request: GenerateResourceRequest) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
  isLoading?: boolean;
  existingContext?: CumulativeIntelligenceContext;
}

interface FormData {
  resource_type: string;
  tier: ResourceTier;
  category: ResourceCategory;
  title: string;
  description: string;
  customContext: string;
}

const RESOURCE_TIERS = [
  { value: 1 as ResourceTier, label: 'Core Resources', description: 'Essential buyer intelligence and foundational frameworks' },
  { value: 2 as ResourceTier, label: 'Advanced Resources', description: 'Advanced methodologies and systematic implementation' },
  { value: 3 as ResourceTier, label: 'Strategic Resources', description: 'Sophisticated strategic frameworks for market leadership' }
];

const RESOURCE_CATEGORIES = [
  { value: 'buyer_intelligence' as ResourceCategory, label: 'Buyer Intelligence', description: 'Customer psychology and behavior analysis' },
  { value: 'sales_frameworks' as ResourceCategory, label: 'Sales Frameworks', description: 'Systematic sales methodologies and processes' },
  { value: 'strategic_tools' as ResourceCategory, label: 'Strategic Tools', description: 'High-level strategic planning and analysis' },
  { value: 'implementation_guides' as ResourceCategory, label: 'Implementation Guides', description: 'Step-by-step implementation instructions' },
  { value: 'competitive_intelligence' as ResourceCategory, label: 'Competitive Intelligence', description: 'Market and competitor analysis tools' },
  { value: 'behavioral_analysis' as ResourceCategory, label: 'Behavioral Analysis', description: 'Customer behavior and decision-making insights' }
];

const RESOURCE_TYPES = [
  'Buyer Persona Template',
  'Sales Playbook',
  'Competitive Analysis Framework',
  'Customer Journey Map',
  'Pricing Strategy Guide',
  'Market Research Report',
  'Implementation Checklist',
  'ROI Calculator',
  'Custom Assessment Tool',
  'Strategic Planning Template'
];

export function ResourceGenerationForm({ 
  customerId, 
  onGenerate, 
  onClose, 
  isOpen, 
  isLoading = false,
  existingContext
}: ResourceGenerationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    resource_type: '',
    tier: 1,
    category: 'buyer_intelligence',
    title: '',
    description: '',
    customContext: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const totalSteps = 3;

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step >= 1) {
      if (!formData.resource_type.trim()) {
        newErrors.resource_type = 'Resource type is required';
      }
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required';
      }
    }

    if (step >= 2) {
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(totalSteps)) {
      return;
    }

    try {
      // Build cumulative intelligence context
      const context: CumulativeIntelligenceContext = {
        product_details: existingContext?.product_details || {},
        icp_analysis: existingContext?.icp_analysis || {},
        buyer_personas: existingContext?.buyer_personas || [],
        rating_system: existingContext?.rating_system || {},
        company_ratings: existingContext?.company_ratings || [],
        technical_translations: existingContext?.technical_translations || [],
        resources_library: existingContext?.resources_library || [],
        customer_progress: existingContext?.customer_progress || {},
        behavioral_data: existingContext?.behavioral_data || {},
        custom_context: formData.customContext ? { 
          user_input: formData.customContext,
          timestamp: new Date().toISOString()
        } : undefined
      };

      const request: GenerateResourceRequest = {
        customer_id: customerId,
        resource_type: formData.resource_type,
        tier: formData.tier,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        context
      };

      await onGenerate(request);
    } catch (error) {
      console.error('Failed to generate resource:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | ResourceTier | ResourceCategory) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle step navigation
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Get tier info
  const getTierInfo = (tier: ResourceTier) => {
    return RESOURCE_TIERS.find(t => t.value === tier) || RESOURCE_TIERS[0];
  };

  // Get category info
  const getCategoryInfo = (category: ResourceCategory) => {
    return RESOURCE_CATEGORIES.find(c => c.value === category) || RESOURCE_CATEGORIES[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Generate New Resource</h2>
              <p className="text-sm text-gray-600">Create AI-powered resources for your business</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  
                  {/* Resource Type */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resource Type *
                    </label>
                    <select
                      value={formData.resource_type}
                      onChange={(e) => handleInputChange('resource_type', e.target.value)}
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${errors.resource_type ? 'border-red-300' : 'border-gray-300'}
                      `}
                    >
                      <option value="">Select a resource type</option>
                      {RESOURCE_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.resource_type && (
                      <p className="mt-1 text-sm text-red-600">{errors.resource_type}</p>
                    )}
                  </div>

                  {/* Title */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter a descriptive title for your resource"
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${errors.title ? 'border-red-300' : 'border-gray-300'}
                      `}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  {/* Tier Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Resource Tier *
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {RESOURCE_TIERS.map(tier => (
                        <div
                          key={tier.value}
                          className={`
                            p-4 border-2 rounded-lg cursor-pointer transition-all
                            ${formData.tier === tier.value 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                          onClick={() => handleInputChange('tier', tier.value)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`
                              w-4 h-4 rounded-full border-2 flex items-center justify-center
                              ${formData.tier === tier.value 
                                ? 'border-blue-500 bg-blue-500' 
                                : 'border-gray-300'
                              }
                            `}>
                              {formData.tier === tier.value && (
                                <CheckCircle className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{tier.label}</h4>
                              <p className="text-sm text-gray-600">{tier.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Category and Description */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Category & Description</h3>
                  
                  {/* Category Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Category *
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {RESOURCE_CATEGORIES.map(category => (
                        <div
                          key={category.value}
                          className={`
                            p-4 border-2 rounded-lg cursor-pointer transition-all
                            ${formData.category === category.value 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                          onClick={() => handleInputChange('category', category.value)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`
                              w-4 h-4 rounded-full border-2 flex items-center justify-center
                              ${formData.category === category.value 
                                ? 'border-blue-500 bg-blue-500' 
                                : 'border-gray-300'
                              }
                            `}>
                              {formData.category === category.value && (
                                <CheckCircle className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{category.label}</h4>
                              <p className="text-sm text-gray-600">{category.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe what this resource will help you achieve..."
                      rows={4}
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${errors.description ? 'border-red-300' : 'border-gray-300'}
                      `}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Advanced Options */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Options</h3>
                  
                  {/* Custom Context */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Context (Optional)
                    </label>
                    <textarea
                      value={formData.customContext}
                      onChange={(e) => handleInputChange('customContext', e.target.value)}
                      placeholder="Provide any additional context or specific requirements for this resource..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      This will help the AI generate more personalized and relevant content.
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Resource Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{formData.resource_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tier:</span>
                        <span className="font-medium">{getTierInfo(formData.tier).label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{getCategoryInfo(formData.category).label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Title:</span>
                        <span className="font-medium">{formData.title}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Previous
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Resource</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
