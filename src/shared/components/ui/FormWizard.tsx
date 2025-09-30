'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  AlertCircle,
  Loader2,
  Save,
  Send
} from 'lucide-react';
import { ValidationProvider, useValidation, ValidationRule } from './ValidationSystem';

/**
 * FormWizard - Multi-step form progression component
 * 
 * Features:
 * - Step-by-step form navigation
 * - Progress tracking
 * - Step validation
 * - Data persistence
 * - Conditional steps
 * - Review step
 * - Mobile optimized
 * - Keyboard navigation
 */

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<any>;
  validation?: Record<string, ValidationRule[]>;
  isOptional?: boolean;
  condition?: (data: any) => boolean;
}

export interface FormWizardProps {
  steps: WizardStep[];
  onComplete: (data: any) => void | Promise<void>;
  onStepChange?: (step: number, data: any) => void;
  initialData?: any;
  showProgressBar?: boolean;
  showStepIndicator?: boolean;
  allowSkip?: boolean;
  allowSave?: boolean;
  onSave?: (data: any) => void;
  className?: string;
}

const FormWizard: React.FC<FormWizardProps> = ({
  steps,
  onComplete,
  onStepChange,
  initialData = {},
  showProgressBar = true,
  showStepIndicator = true,
  allowSkip = false,
  allowSave = false,
  onSave,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<number, string>>({});

  // Filter steps based on conditions
  const visibleSteps = steps.filter(step => 
    !step.condition || step.condition(formData)
  );

  const currentStepConfig = visibleSteps[currentStep];
  const isLastStep = currentStep === visibleSteps.length - 1;
  const isFirstStep = currentStep === 0;

  // Calculate progress
  const progress = ((currentStep + 1) / visibleSteps.length) * 100;

  // Update form data
  const updateFormData = useCallback((stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  }, []);

  // Validate current step
  const validateStep = useCallback(async (): Promise<boolean> => {
    if (!currentStepConfig.validation) return true;

    // Validation is handled by ValidationProvider
    // This is a placeholder for custom validation logic
    return true;
  }, [currentStepConfig]);

  // Navigate to next step
  const handleNext = useCallback(async () => {
    const isValid = await validateStep();
    
    if (!isValid) {
      setStepErrors(prev => ({
        ...prev,
        [currentStep]: 'Please complete all required fields'
      }));
      return;
    }

    setCompletedSteps(prev => new Set([...prev, currentStep]));
    setStepErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[currentStep];
      return newErrors;
    });

    if (isLastStep) {
      handleSubmit();
    } else {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (onStepChange) {
        onStepChange(nextStep, formData);
      }
    }
  }, [currentStep, isLastStep, formData, validateStep, onStepChange]);

  // Navigate to previous step
  const handlePrevious = useCallback(() => {
    if (!isFirstStep) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (onStepChange) {
        onStepChange(prevStep, formData);
      }
    }
  }, [currentStep, isFirstStep, formData, onStepChange]);

  // Jump to specific step
  const handleStepClick = useCallback((stepIndex: number) => {
    if (stepIndex < currentStep || completedSteps.has(stepIndex - 1) || stepIndex === 0) {
      setCurrentStep(stepIndex);
      if (onStepChange) {
        onStepChange(stepIndex, formData);
      }
    }
  }, [currentStep, completedSteps, formData, onStepChange]);

  // Skip current step
  const handleSkip = useCallback(() => {
    if (currentStepConfig.isOptional && !isLastStep) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (onStepChange) {
        onStepChange(nextStep, formData);
      }
    }
  }, [currentStep, currentStepConfig, isLastStep, formData, onStepChange]);

  // Save progress
  const handleSave = useCallback(async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  }, [formData, onSave]);

  // Submit form
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await onComplete(formData);
    } catch (error) {
      console.error('Failed to submit:', error);
      setStepErrors(prev => ({
        ...prev,
        [currentStep]: 'Failed to submit form. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onComplete, currentStep]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
        handlePrevious();
      } else if (e.key === 's' && e.ctrlKey && allowSave) {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, handleSave, allowSave]);

  if (!currentStepConfig) return null;

  const StepComponent = currentStepConfig.component;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Bar */}
      {showProgressBar && (
        <div className="relative">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Step Indicator */}
      {showStepIndicator && (
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {visibleSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              disabled={index > currentStep && !completedSteps.has(index - 1)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap
                transition-all duration-200 min-w-fit
                ${index === currentStep
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : completedSteps.has(index)
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-pointer hover:bg-green-500/20'
                  : index < currentStep || index === 0
                  ? 'bg-gray-800 text-gray-300 cursor-pointer hover:bg-gray-700 border border-gray-700'
                  : 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-800'
                }
              `}
            >
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                ${completedSteps.has(index) ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}
              `}>
                {completedSteps.has(index) ? (
                  <Check className="w-3 h-3" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="hidden sm:inline">{step.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Step Content */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        {/* Step Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-1">
            {currentStepConfig.title}
          </h2>
          {currentStepConfig.description && (
            <p className="text-sm text-gray-400">
              {currentStepConfig.description}
            </p>
          )}
          {currentStepConfig.isOptional && (
            <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
              Optional
            </span>
          )}
        </div>

        {/* Error Display */}
        {stepErrors[currentStep] && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-400">{stepErrors[currentStep]}</span>
          </motion.div>
        )}

        {/* Step Component with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepConfig.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ValidationProvider validations={
              currentStepConfig.validation 
                ? Object.entries(currentStepConfig.validation).map(([field, rules]) => ({
                    field,
                    rules
                  }))
                : []
            }>
              <StepComponent
                data={formData}
                onChange={updateFormData}
                onNext={handleNext}
              />
            </ValidationProvider>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={isFirstStep}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium
            transition-all duration-200
            ${isFirstStep
              ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
              : 'bg-gray-800 text-white hover:bg-gray-700'
            }
          `}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-3">
          {allowSave && onSave && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Progress
            </button>
          )}

          {allowSkip && currentStepConfig.isOptional && !isLastStep && (
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Skip
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium
              transition-all duration-200
              ${isLastStep
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : isLastStep ? (
              <>
                <Send className="w-4 h-4" />
                Submit
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="text-center text-xs text-gray-500">
        <span>Tip: Use </span>
        <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Ctrl</kbd>
        <span> + </span>
        <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Enter</kbd>
        <span> to continue</span>
        {allowSave && (
          <>
            <span> or </span>
            <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Ctrl</kbd>
            <span> + </span>
            <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">S</kbd>
            <span> to save</span>
          </>
        )}
      </div>
    </div>
  );
};

export default FormWizard;