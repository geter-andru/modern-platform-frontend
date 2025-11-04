'use client';

/**
 * OnboardingFlow.tsx
 *
 * PLG-optimized 3-step onboarding flow for first-time users.
 * Guides users through product input, ICP preview, and activation paths.
 *
 * @module OnboardingFlow
 * @version 2.0.0 - PLG Optimized (Agent 1 Spec)
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/app/lib/supabase/client';
import Image from 'next/image';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: React.ReactNode;
  actionLabel?: string;
  skipLabel?: string;
}

export interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip?: () => void;
  steps?: OnboardingStep[];
  className?: string;
}

export interface ProductInfo {
  productName: string;
  productDescription: string;
  targetAudience?: string;
}

// ============================================================================
// ONBOARDING FLOW COMPONENT
// ============================================================================

export default function OnboardingFlow({
  isOpen,
  onComplete,
  onSkip,
  className = ''
}: OnboardingFlowProps) {
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    productName: '',
    productDescription: '',
    targetAudience: ''
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState<Partial<ProductInfo>>({});

  // Validate Step 1 form
  const validateStep1 = useCallback(() => {
    const errors: Partial<ProductInfo> = {};

    if (!productInfo.productName || productInfo.productName.length < 2) {
      errors.productName = 'Product name must be at least 2 characters';
    } else if (productInfo.productName.length > 50) {
      errors.productName = 'Product name must be 50 characters or less';
    }

    if (!productInfo.productDescription || productInfo.productDescription.length < 20) {
      errors.productDescription = 'Please describe what your product does (20-200 characters)';
    } else if (productInfo.productDescription.length > 200) {
      errors.productDescription = 'Description must be 200 characters or less';
    }

    if (productInfo.targetAudience && productInfo.targetAudience.length > 200) {
      errors.targetAudience = 'Target audience must be 200 characters or less';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [productInfo]);

  // Check if Step 1 form is valid for enabling the button
  const isStep1Valid = productInfo.productName.length >= 2 &&
                       productInfo.productName.length <= 50 &&
                       productInfo.productDescription.length >= 20 &&
                       productInfo.productDescription.length <= 200 &&
                       (!productInfo.targetAudience || productInfo.targetAudience.length <= 200);

  // ============================================================================
  // DEFAULT ONBOARDING STEPS - PLG OPTIMIZED (Agent 1 Spec)
  // ============================================================================

  const steps: OnboardingStep[] = [
    // STEP 1: Tell Us About Your Product
    {
      id: 'product-info',
      title: "Let's Set Up Your First ICP",
      description: 'Tell us about your product and Andru will identify your ideal buyers in under 3 minutes.',
      icon: '🎯',
      content: (
        <div className="space-y-6">
          {/* Brandon Geter Trust Signal */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex-shrink-0">
              <Image
                src="/images/brandon-geter.jpg"
                alt="Brandon Geter"
                width={48}
                height={48}
                className="rounded-full object-cover"
                priority
              />
            </div>
            <div>
              <p className="text-sm text-gray-200 font-medium">
                Built by <span className="text-blue-400">Brandon Geter</span>, former VP Revenue at Series A SaaS
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Used by 100+ founding members to close enterprise deals faster
              </p>
            </div>
          </div>

          {/* Product Name Field */}
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-200 mb-2">
              What's your product called?
            </label>
            <input
              id="productName"
              type="text"
              value={productInfo.productName}
              onChange={(e) => setProductInfo({ ...productInfo, productName: e.target.value })}
              placeholder="e.g., DevTool Pro, Notion, Stripe"
              className={`w-full px-4 py-3 bg-gray-800 border ${
                formErrors.productName ? 'border-red-500' : 'border-gray-700'
              } rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              maxLength={50}
            />
            {formErrors.productName && (
              <p className="mt-1 text-sm text-red-400">{formErrors.productName}</p>
            )}
          </div>

          {/* Product Description Field */}
          <div>
            <label htmlFor="productDescription" className="block text-sm font-medium text-gray-200 mb-2">
              What does it do?
            </label>
            <textarea
              id="productDescription"
              value={productInfo.productDescription}
              onChange={(e) => setProductInfo({ ...productInfo, productDescription: e.target.value })}
              placeholder="e.g., AI-powered code review platform that catches bugs before production"
              rows={3}
              className={`w-full px-4 py-3 bg-gray-800 border ${
                formErrors.productDescription ? 'border-red-500' : 'border-gray-700'
              } rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none`}
              maxLength={200}
            />
            <p className="mt-1 text-xs text-gray-400">
              One sentence is enough. The more specific, the better your ICP will be.
            </p>
            {formErrors.productDescription && (
              <p className="mt-1 text-sm text-red-400">{formErrors.productDescription}</p>
            )}
          </div>

          {/* Target Audience Field (Optional) */}
          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-200 mb-2">
              Who's it for? <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              id="targetAudience"
              value={productInfo.targetAudience}
              onChange={(e) => setProductInfo({ ...productInfo, targetAudience: e.target.value })}
              placeholder="e.g., Engineering teams at B2B SaaS startups with 10-50 developers"
              rows={2}
              className={`w-full px-4 py-3 bg-gray-800 border ${
                formErrors.targetAudience ? 'border-red-500' : 'border-gray-700'
              } rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none`}
              maxLength={200}
            />
            <p className="mt-1 text-xs text-gray-400">
              Skip this if you're not sure—Andru will figure it out.
            </p>
            {formErrors.targetAudience && (
              <p className="mt-1 text-sm text-red-400">{formErrors.targetAudience}</p>
            )}
          </div>
        </div>
      ),
      actionLabel: 'Set Up My ICP'
    },

    // STEP 2: Understanding Your ICP Analysis
    {
      id: 'icp-preview',
      title: 'Your ICP Analysis Is Ready',
      description: 'Andru analyzed your product and generated a complete ICP with:',
      icon: '📊',
      content: (
        <div className="space-y-6">
          {/* Feature Cards */}
          <div className="grid gap-4">
            {/* Buyer Personas */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-200 mb-1">3-5 Buyer Personas</h4>
                <p className="text-sm text-gray-400">
                  Decision-makers who buy, use, or influence purchases
                </p>
              </div>
            </div>

            {/* Pain Points & Jobs */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-200 mb-1">Pain Points & Jobs to Be Done</h4>
                <p className="text-sm text-gray-400">
                  What problems they're solving and why they need your product
                </p>
              </div>
            </div>

            {/* Objections & Triggers */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-200 mb-1">Buying Triggers & Objections</h4>
                <p className="text-sm text-gray-400">
                  When they're ready to buy and what makes them hesitate
                </p>
              </div>
            </div>

            {/* Export & Share */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">📤</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-200 mb-1">Export & Share Anywhere</h4>
                <p className="text-sm text-gray-400">
                  Download as PDF, Markdown, CSV, or AI prompt templates
                </p>
              </div>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-gray-300">
              <span className="text-lg mr-2">💡</span>
              <strong>Pro Tip:</strong> Use your ICP to write better marketing copy, qualify leads faster, and train your sales team.
            </p>
          </div>
        </div>
      ),
      actionLabel: 'See My ICP'
    },

    // STEP 3: What You Can Do Next
    {
      id: 'activation-paths',
      title: "You're All Set!",
      description: "Here's what you can do next:",
      icon: '✨',
      content: (
        <div className="space-y-4">
          {/* Action Cards */}

          {/* Card 1 - Generate More ICPs */}
          <div className="p-5 bg-gradient-to-br from-gray-800 to-gray-800/50 border border-gray-700 rounded-xl hover:border-blue-500/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-100 text-lg">Generate More ICPs</h4>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-3 leading-relaxed">
              <strong>Free Beta:</strong> 3 ICPs per month<br />
              <strong>Starter Plan:</strong> Unlimited ICPs
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Track multiple products, test positioning variations, or analyze different market segments.
            </p>
            <button className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-400 font-medium text-sm transition-colors">
              Generate Another ICP →
            </button>
          </div>

          {/* Card 2 - Export Your ICP */}
          <div className="p-5 bg-gradient-to-br from-gray-800 to-gray-800/50 border border-gray-700 rounded-xl hover:border-green-500/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📤</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-100 text-lg">Export & Share Your ICP</h4>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              Download your ICP analysis as PDF, Markdown, or CSV. Share with your team, save to your CRM, or use as input for ChatGPT/Claude to extend your research.
            </p>
            <button className="w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-400 font-medium text-sm transition-colors">
              Export Options →
            </button>
          </div>

          {/* Card 3 - Upgrade to Starter */}
          <div className="p-5 bg-gradient-to-br from-gray-800 to-gray-800/50 border border-purple-700 rounded-xl hover:border-purple-500/70 transition-all relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-xs text-purple-300 font-semibold">
                Founding Member Discount
              </span>
            </div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-100 text-lg">Upgrade to Starter Plan</h4>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-2">
              <strong className="text-purple-400">$49/month</strong> • Cancel anytime
            </p>
            <ul className="text-xs text-gray-400 space-y-1 mb-4">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Unlimited ICP generations
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Advanced export formats (AI prompts)
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Priority support
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Early access to new features
              </li>
            </ul>
            <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg text-white font-semibold text-sm transition-all shadow-lg">
              View Pricing →
            </button>
          </div>
        </div>
      ),
      actionLabel: 'Start Exploring'
    }
  ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const handleNext = useCallback(async () => {
    // Validate Step 1 before proceeding
    if (currentStep === 0 && !validateStep1()) {
      console.log('🔴 Step 1 validation failed');
      return;
    }

    if (currentStep < steps.length - 1) {
      console.log(`📍 Moving from step ${currentStep + 1} to ${currentStep + 2}`);
      setCurrentStep(prev => prev + 1);
    } else {
      console.log('✅ Onboarding complete - marking in database');

      // Mark onboarding as complete and save product info in database
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user?.id) {
          const response = await fetch('/api/users/complete-onboarding', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: session.user.id,
              productInfo: {
                productName: productInfo.productName,
                productDescription: productInfo.productDescription,
                targetAudience: productInfo.targetAudience
              }
            }),
          });

          const result = await response.json();

          if (result.success) {
            console.log('✅ Onboarding status and product info saved in database');
          } else {
            console.error('❌ Failed to update onboarding status:', result.error);
          }
        }
      } catch (error) {
        console.error('❌ Exception marking onboarding complete:', error);
      }

      // Call onComplete callback regardless of API success (graceful degradation)
      onComplete();
    }
  }, [currentStep, steps.length, onComplete, validateStep1]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      console.log(`📍 Moving back from step ${currentStep + 1} to ${currentStep}`);
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    console.log('⏭️ User skipped onboarding');
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  }, [onSkip, onComplete]);

  const handleStepClick = useCallback((index: number) => {
    // Don't allow clicking ahead past Step 1 if not validated
    if (index > 0 && !isStep1Valid) {
      console.log('🔴 Cannot skip to later steps without completing Step 1');
      return;
    }
    console.log(`📍 Jumping to step ${index + 1}`);
    setCurrentStep(index);
  }, [isStep1Valid]);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  // Disable next button on Step 1 if form is invalid
  const isNextDisabled = currentStep === 0 && !isStep1Valid;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.90)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="p-8 pb-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                key={step.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
              >
                {step.icon}
              </motion.div>
              <div>
                <motion.h2
                  key={`title-${step.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-gray-100"
                >
                  {step.title}
                </motion.h2>
                <motion.p
                  key={`desc-${step.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-400"
                >
                  {step.description}
                </motion.p>
              </div>
            </div>

            {/* Skip Button */}
            {onSkip && !isLastStep && (
              <button
                onClick={handleSkip}
                className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
              >
                Skip Tour
              </button>
            )}
          </div>

          {/* Progress Dots (Improved - PLG style) */}
          <div className="flex gap-2 items-center justify-center">
            {steps.map((s, index) => (
              <button
                key={s.id}
                onClick={() => handleStepClick(index)}
                disabled={index > 0 && !isStep1Valid}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-blue-500 scale-125'
                    : index < currentStep
                    ? 'bg-blue-500/50'
                    : 'bg-gray-700 hover:bg-gray-600'
                } ${index > 0 && !isStep1Valid ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                aria-label={`Go to step ${index + 1}: ${s.title}`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-8 pt-6 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center justify-between">
            {/* Back Button (only show if not first step) */}
            <div>
              {!isFirstStep && (
                <button
                  onClick={handlePrevious}
                  className="px-6 py-3 rounded-lg font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  ← Back
                </button>
              )}
            </div>

            {/* Next/Complete Button */}
            <button
              onClick={handleNext}
              disabled={isNextDisabled}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                isNextDisabled
                  ? 'bg-gray-700 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg'
              }`}
            >
              {step.actionLabel || (isLastStep ? 'Get Started' : 'Next')} →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
