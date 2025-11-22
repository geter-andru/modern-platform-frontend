'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Download, Users, BarChart3, TrendingUp, AlertCircle, CheckCircle2, Zap, Target, DollarSign, TrendingDown, ChevronRight, ChevronLeft, Share2, Lightbulb, MessageSquare, Mail, FileText, Gift, Lock } from 'lucide-react';
import Link from 'next/link';
import BuyerPersonasWidget from '../../../src/features/icp-analysis/widgets/BuyerPersonasWidget';
import MyICPOverviewWidget from '../../../src/features/icp-analysis/widgets/MyICPOverviewWidget';
import { PostGenerationCTA } from '../../../src/features/icp-analysis/components/PostGenerationCTA';
import { Badge } from '../../../src/shared/components/ui/Badge';
import { MotionBackground } from '../../../src/shared/components/ui/MotionBackground';
import { exportICPToPDF } from '@/app/lib/utils/pdf-export';
import { exportToMarkdown, exportToCSV } from '@/app/lib/utils/data-export';
import toast, { Toaster } from 'react-hot-toast';
import demoData from '../../../data/demo-icp-devtool.json';
import '../../../src/shared/styles/component-patterns.css';
import { BRAND_IDENTITY } from '@/app/lib/constants/brand-identity';
import { StaggeredItem } from '../../../src/shared/utils/staggered-entrance';
import { supabase } from '@/app/lib/supabase/client';
import supabaseDataService from '@/app/lib/services/supabaseDataService';

// Session storage keys
const SESSION_KEYS = {
  PERSONAS: 'andru_generated_personas',
  FORM_DATA: 'andru_icp_form_data',
  PRODUCT_INFO: 'andru_product_info'
};

// Helper to convert product name to URL-friendly slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Journey Indicator Component for showing progress through the demo flow
function JourneyIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps = [
    { number: 1, label: 'Describe Product', icon: FileText },
    { number: 2, label: 'AI Analysis', icon: Sparkles },
    { number: 3, label: 'Your Personas', icon: Target }
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        const isUpcoming = step.number > currentStep;

        return (
          <React.Fragment key={step.number}>
            {/* Step Circle */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    ✓
                  </motion.span>
                ) : (
                  <step.icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-sm font-medium hidden sm:inline ${
                  isCurrent ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </motion.div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="w-8 sm:w-12 h-0.5 relative overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-gray-700" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Witty loading messages that resonate with technical founders
const LOADING_MESSAGES = [
  "Finding the CFO who will actually understand your technical moat...",
  "Identifying buyers who won't make you explain microservices for the 47th time...",
  "Locating decision-makers who get why 'it just works' took 18 months to build...",
  "Mapping the people tired of your competitor's broken promises...",
  "Finding champions who'll fight for your budget in rooms you're not in...",
  "Identifying the engineer who'll tell their VP 'we need this yesterday'...",
  "Discovering who loses sleep over the problem you've already solved...",
  "Locating the VP who's one more production outage away from approving anything...",
  "Identifying who signs the check vs. who derails the deal in procurement...",
  "Finding the technical evaluator who won't ask for a 47-point security questionnaire... just kidding, they all do...",
  "Crafting objection responses so good your sales team might actually use them...",
  "Building the pitch that finally translates 'distributed consensus algorithm' into CFO language...",
  "Almost done making 'we're technically superior' actually mean something to buyers..."
];

// Full-page loading screen component
function FullPageLoadingScreen({
  isVisible,
  progress,
  currentMessage
}: {
  isVisible: boolean;
  progress: number;
  currentMessage: string;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f172a 100%)'
          }}
        >
          <div className="text-center max-w-lg px-8">
            {/* Journey Indicator - Step 2: AI Analysis */}
            <div className="mb-8">
              <JourneyIndicator currentStep={2} />
            </div>

            {/* Animated icon with float effect */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 2, -2, 0],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-8 inline-block text-blue-400"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))'
              }}
            >
              <Target className="w-16 h-16" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{
                color: '#ffffff',
                letterSpacing: '-0.025em'
              }}
            >
              Finding Your People
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg mb-10"
              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
            >
              The ones who desperately need what you've built
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-72 h-1.5 mx-auto mb-6 rounded-full overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
              }}
            >
              <motion.div
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                  width: `${progress}%`
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {/* Shimmer effect */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                    animation: 'shimmer 2s ease-in-out infinite'
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Status message */}
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-medium min-h-[48px]"
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'monospace'
              }}
            >
              {currentMessage}
            </motion.p>
          </div>

          {/* Add shimmer keyframes via style tag */}
          <style jsx>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Exit Intent Modal Component - Shows when user tries to leave without generating
function ExitIntentModal({
  isOpen,
  onClose,
  onGenerate
}: {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-lg rounded-2xl p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.98) 0%, rgba(20, 20, 35, 0.99) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25)'
        }}
      >
        {/* Decorative glow */}
        <div
          className="absolute -top-20 -left-20 w-40 h-40 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)'
          }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)'
          }}
        />

        {/* Content */}
        <div className="relative text-center">
          <motion.div
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-6 text-blue-400"
          >
            <Target className="w-16 h-16 mx-auto" />
          </motion.div>

          <h3 className="text-2xl font-bold text-white mb-3">
            Wait! Your Buyers Are Out There
          </h3>
          <p className="text-gray-400 mb-6 text-lg">
            Don&apos;t leave without discovering the people who desperately need what you&apos;re building.
          </p>

          {/* Value props */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="px-3 py-2 rounded-lg bg-white/5">
              <div className="flex justify-center mb-1">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-xs text-gray-400">2 Minutes</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/5">
              <div className="flex justify-center mb-1">
                <Gift className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-xs text-gray-400">100% Free</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/5">
              <div className="flex justify-center mb-1">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-xs text-gray-400">No Signup</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onClose();
                onGenerate();
              }}
              className="w-full py-3 px-6 rounded-xl font-semibold text-white text-lg transition-all hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
              }}
            >
              Generate My Free ICP Now
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              No thanks, I&apos;ll miss out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Rate Limit Badge Component
function RateLimitBadge({
  remaining,
  resetTime
}: {
  remaining: number;
  resetTime: string;
}) {
  const hours = resetTime ? Math.ceil(
    (new Date(resetTime).getTime() - Date.now()) / (1000 * 60 * 60)
  ) : 24;

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
      style={{
        background: remaining > 0
          ? 'rgba(16, 185, 129, 0.1)'
          : 'rgba(239, 68, 68, 0.1)',
        border: remaining > 0
          ? '1px solid rgba(16, 185, 129, 0.3)'
          : '1px solid rgba(239, 68, 68, 0.3)'
      }}
    >
      <Sparkles className="w-4 h-4" style={{
        color: remaining > 0 ? '#10b981' : '#ef4444'
      }} />
      <span className="body-small" style={{
        color: remaining > 0 ? '#10b981' : '#ef4444',
        fontWeight: 600
      }}>
        {remaining > 0
          ? `${remaining} free generation${remaining === 1 ? '' : 's'} remaining today`
          : `Free generations reset in ${hours} hour${hours === 1 ? '' : 's'}`
        }
      </span>
      {remaining === 0 && (
        <Link
          href="/pricing"
          className="text-blue-400 hover:text-blue-300 underline ml-2"
        >
          Remove limits →
        </Link>
      )}
    </div>
  );
}

export default function ICPDemoV2Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'personas' | 'overview'>('personas');
  const [showExportModal, setShowExportModal] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [tappedStat, setTappedStat] = useState<string | null>(null);
  const [comparisonView, setComparisonView] = useState<'without' | 'with'>('without');
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const statsScrollRef = React.useRef<HTMLDivElement>(null);

  // Full-page loading screen state
  const [showFullPageLoading, setShowFullPageLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const loadingMessageIndexRef = React.useRef(0);

  // Form state
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [targetBuyer, setTargetBuyer] = useState('');

  // Generated personas state (starts with demo data, replaced after generation)
  const [generatedPersonas, setGeneratedPersonas] = useState(demoData.personas);
  const [revealedPersonas, setRevealedPersonas] = useState<any[]>([]);

  // Intelligence extraction state
  const [refinedDescription, setRefinedDescription] = useState<string>('');
  const [coreCapability, setCoreCapability] = useState<string>('');

  // Share functionality state
  const [showSharePreview, setShowSharePreview] = useState(false);
  const [shareText, setShareText] = useState('');

  // Exit intent state
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitIntentShown, setExitIntentShown] = useState(false);

  // Rate limit state
  const [remainingGenerations, setRemainingGenerations] = useState<number>(3);
  const [generationsResetTime, setGenerationsResetTime] = useState<string>('');

  // Exit intent detection - triggers when mouse leaves viewport towards top
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves through top of viewport
      // and user hasn't already seen the modal and hasn't generated yet
      if (e.clientY <= 0 && !exitIntentShown && !isGenerating) {
        setShowExitIntent(true);
        setExitIntentShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [exitIntentShown, isGenerating]);

  // Email capture state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  // Mobile detection for touch optimization
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch and pre-fill assessment data if available
  useEffect(() => {
    async function fetchAssessmentData() {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          console.log('No user logged in, skipping assessment pre-fill');
          return;
        }

        console.log('Fetching assessment data for user:', user.id);

        // Fetch latest assessment
        const result = await supabaseDataService.getLatestAssessmentForUser(user.id);

        if (result.success && result.productDetails) {
          const { productName, productDescription, businessModel } = result.productDetails;

          // Pre-fill form if data exists
          if (productName) {
            setProductName(productName);
            console.log('Pre-filled product name from assessment');
          }
          if (productDescription) {
            setProductDescription(productDescription);
            console.log('Pre-filled product description from assessment');
          }
          // Note: businessModel in assessment is text (e.g., "B2B Subscription")
          // targetBuyer field in ICP is free-form text, so we can use business model as context
          if (businessModel && !targetBuyer) {
            // Optionally set as hint, or leave empty for user to specify their target buyer
            console.log('Assessment business model available:', businessModel);
          }

          if (productName || productDescription) {
            toast.success('Pre-filled with your assessment data!', {
              duration: 4000,
              icon: '✨'
            });
          }
        } else if (result.error) {
          console.error('Error fetching assessment data:', result.error);
        }
      } catch (error) {
        console.error('Exception fetching assessment data:', error);
      }
    }

    fetchAssessmentData();
  }, []); // Run once on mount

  // Check for quick start form data from homepage
  useEffect(() => {
    try {
      const quickStartProduct = localStorage.getItem('icp_quickstart_product');
      const quickStartDescription = localStorage.getItem('icp_quickstart_description');

      if (quickStartProduct || quickStartDescription) {
        console.log('Found quick start form data in localStorage');

        // Pre-fill form fields
        if (quickStartProduct && !productName) {
          setProductName(quickStartProduct);
          console.log('Pre-filled product name from quick start form');
        }
        if (quickStartDescription && !productDescription) {
          setProductDescription(quickStartDescription);
          console.log('Pre-filled product description from quick start form');
        }

        // Clear localStorage to prevent stale data
        localStorage.removeItem('icp_quickstart_product');
        localStorage.removeItem('icp_quickstart_description');
        console.log('Cleared quick start form data from localStorage');

        // Show success message if we pre-filled anything
        if ((quickStartProduct && !productName) || (quickStartDescription && !productDescription)) {
          toast.success('Ready to generate your ICP!', {
            duration: 3000,
            icon: '🚀'
          });
        }
      }
    } catch (error) {
      console.error('Error checking localStorage for quick start data:', error);
    }
  }, []); // Run once on mount

  // Check for session storage form data (from back navigation)
  useEffect(() => {
    try {
      const storedFormData = sessionStorage.getItem(SESSION_KEYS.FORM_DATA);
      if (storedFormData) {
        const { productName: storedName, productDescription: storedDesc, targetBuyer: storedTarget } = JSON.parse(storedFormData);

        // Only pre-fill if current fields are empty (don't override other sources)
        if (storedName && !productName) {
          setProductName(storedName);
        }
        if (storedDesc && !productDescription) {
          setProductDescription(storedDesc);
        }
        if (storedTarget && !targetBuyer) {
          setTargetBuyer(storedTarget);
        }

        console.log('Pre-filled form from session storage (back navigation)');
      }
    } catch (error) {
      console.error('Error loading session form data:', error);
    }
  }, []);

  // Keyboard shortcuts for power users
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // G = Generate (only if form is filled)
      if (e.key === 'g' && !isGenerating && productName && productDescription) {
        handleGenerate();
      }
      // E = Export (when results visible)
      if (e.key === 'e' && showResults) {
        setShowExportModal(true);
      }
      // Escape = Close modal
      if (e.key === 'Escape' && showExportModal) {
        setShowExportModal(false);
      }
      // D = Jump to demo
      if (e.key === 'd') {
        document.getElementById('demo-results')?.scrollIntoView({ behavior: 'smooth' });
      }
      // F = Jump to form
      if (e.key === 'f') {
        document.getElementById('generation-form')?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGenerating, productName, productDescription, showResults, showExportModal]);

  // Horizontal scroll handlers
  const checkScrollPosition = () => {
    if (statsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = statsScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollStats = (direction: 'left' | 'right') => {
    if (statsScrollRef.current) {
      const scrollAmount = 400; // Scroll by ~1.5 cards
      const newScrollLeft = direction === 'left'
        ? statsScrollRef.current.scrollLeft - scrollAmount
        : statsScrollRef.current.scrollLeft + scrollAmount;

      statsScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    const scrollContainer = statsScrollRef.current;
    if (scrollContainer) {
      checkScrollPosition();
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      return () => scrollContainer.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  // Helper: Calculate confidence for a single persona
  const calculatePersonaConfidence = (persona: any) => {
    const hasGoals = persona.goals && persona.goals.length > 0;
    const hasPainPoints = persona.painPoints && persona.painPoints.length > 0;
    const hasObjections = persona.objections && persona.objections.length > 0;
    const hasDemographics = persona.demographics && Object.keys(persona.demographics).length > 0;
    const hasPsychographics = persona.psychographics && Object.keys(persona.psychographics).length > 0;

    const dataPoints = [hasGoals, hasPainPoints, hasObjections, hasDemographics, hasPsychographics];
    const collectedPoints = dataPoints.filter(Boolean).length;
    return Math.round((collectedPoints / dataPoints.length) * 100);
  };

  // Helper: Calculate quality summary for all personas
  const calculateQualitySummary = (personas: any[]) => {
    const confidenceScores = personas.map(calculatePersonaConfidence);
    const highConfidence = confidenceScores.filter(score => score >= 80).length;
    const mediumConfidence = confidenceScores.filter(score => score >= 60 && score < 80).length;
    const lowConfidence = confidenceScores.filter(score => score < 60).length;
    const avgConfidence = Math.round(confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length);

    return { highConfidence, mediumConfidence, lowConfidence, avgConfidence, total: personas.length };
  };

  // Option 9: Cinematic persona reveal function
  const revealPersonasCinematically = async (personas: any[]) => {
    // Clear any existing reveals
    setRevealedPersonas([]);

    // Dramatic pause before reveal
    await new Promise(resolve => setTimeout(resolve, 800));

    // Success announcement
    toast.success(
      `${personas.length} buyer personas identified`,
      {
        icon: '🎯',
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          color: '#fff',
          fontWeight: 600,
          border: 'none'
        }
      }
    );

    // Stagger persona reveals (RPG loot drop feeling) - ENHANCED FROM 300ms to 400ms
    for (let i = 0; i < personas.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));

      setRevealedPersonas(prev => [...prev, personas[i]]);

      // Subtle animation trigger via DOM manipulation
      setTimeout(() => {
        const element = document.getElementById(`persona-reveal-${i}`);
        if (element) {
          element.style.transform = 'scale(1.02)';
          setTimeout(() => {
            element.style.transform = 'scale(1)';
          }, 200);
        }
      }, 50);
    }

    // After all reveals, show library addition toast
    setTimeout(() => {
      toast(
        `Resource generated: ${personas.length} personas added to your library`,
        {
          icon: '📚',
          duration: 3000,
          style: {
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#fff',
            backdropFilter: 'blur(16px)'
          }
        }
      );
    }, personas.length * 300 + 500);
  };

  const handleGenerate = async () => {
    if (!productName || !productDescription) {
      toast.error('Please fill in product name and description');
      return;
    }

    // Save form data to session storage (for back navigation)
    sessionStorage.setItem(SESSION_KEYS.FORM_DATA, JSON.stringify({
      productName,
      productDescription,
      targetBuyer
    }));

    // Show full-page loading screen
    setShowFullPageLoading(true);
    setLoadingProgress(0);
    loadingMessageIndexRef.current = 0;
    setLoadingMessage(LOADING_MESSAGES[0]);

    // Start rotating through witty messages
    const messageInterval = setInterval(() => {
      loadingMessageIndexRef.current = (loadingMessageIndexRef.current + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[loadingMessageIndexRef.current]);
    }, 2500);

    try {
      // Progress: 10% - Starting
      setLoadingProgress(10);
      await new Promise(resolve => setTimeout(resolve, 400));

      // Progress: 25% - Analyzing
      setLoadingProgress(25);
      await new Promise(resolve => setTimeout(resolve, 300));

      // Call backend API
      const response = await fetch('/api/demo/generate-icp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productName,
          productDescription,
          targetBuyer: targetBuyer || null
        })
      });

      // Progress: 60% - API returned
      setLoadingProgress(60);

      const data = await response.json();

      // Handle rate limiting
      if (response.status === 429) {
        clearInterval(messageInterval);
        setShowFullPageLoading(false);
        toast.error('Demo limit reached (3 per 24 hours). Sign up for unlimited generations!');
        return;
      }

      // Handle other errors
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      // Progress: 85% - Processing results
      setLoadingProgress(85);
      await new Promise(resolve => setTimeout(resolve, 400));

      // Progress: 95% - Saving
      setLoadingProgress(95);

      // Save generated personas to session storage
      sessionStorage.setItem(SESSION_KEYS.PERSONAS, JSON.stringify(data.personas));
      sessionStorage.setItem(SESSION_KEYS.PRODUCT_INFO, JSON.stringify({
        name: productName,
        description: productDescription
      }));

      // Progress: 100% - Complete!
      setLoadingProgress(100);
      setLoadingMessage("Found them! Redirecting to your results...");

      // Brief pause to show completion
      await new Promise(resolve => setTimeout(resolve, 800));

      // Clear interval and redirect
      clearInterval(messageInterval);

      // Navigate to results page with dynamic slug
      const productSlug = slugify(productName);
      router.push(`/icp/demo/${productSlug}`);

    } catch (error: any) {
      clearInterval(messageInterval);
      setShowFullPageLoading(false);
      toast.error(error.message || 'Generation failed. Please try again in a moment.');
      console.error('ICP generation error:', error);
    }
  };

  const handlePDFExport = async () => {
    toast.loading('Generating demo PDF...', { id: 'pdf-export' });
    const exportData = {
      companyName: 'Demo - ' + (productName || demoData.product.productName),
      productName: productDescription || demoData.product.description,
      personas: generatedPersonas,
      generatedAt: new Date().toISOString()
    };
    const result = await exportICPToPDF(exportData, {
      includeDemoWatermark: true,
      companyName: exportData.companyName,
      productName: exportData.productName
    });
    if (result.success) {
      toast.success('Demo PDF exported successfully!', { id: 'pdf-export' });
      setShowExportModal(false);
    } else {
      toast.error(result.error || 'Failed to export PDF', { id: 'pdf-export' });
    }
  };

  const handleMarkdownExport = async () => {
    toast.loading('Copying demo Markdown to clipboard...', { id: 'markdown-export' });
    const exportData = {
      companyName: 'Demo - ' + (productName || demoData.product.productName),
      productName: productDescription || demoData.product.description,
      personas: generatedPersonas,
      generatedAt: new Date().toISOString()
    };
    const result = await exportToMarkdown(exportData, {
      includeDemoWatermark: true
    });
    if (result.success) {
      toast.success('Demo Markdown copied to clipboard! Contains watermarks - sign up to remove.', { id: 'markdown-export' });
      setShowExportModal(false);
    } else {
      toast.error(result.error || 'Failed to export Markdown', { id: 'markdown-export' });
    }
  };

  const handleCSVExport = () => {
    toast.loading('Generating demo CSV...', { id: 'csv-export' });
    const exportData = {
      companyName: 'Demo - ' + (productName || demoData.product.productName),
      productName: productDescription || demoData.product.description,
      personas: generatedPersonas,
      generatedAt: new Date().toISOString()
    };
    const result = exportToCSV(exportData, {
      includeDemoWatermark: true
    });
    if (result.success) {
      toast.success('Demo CSV exported! Contains watermarks - sign up to remove.', { id: 'csv-export' });
      setShowExportModal(false);
    } else {
      toast.error(result.error || 'Failed to export CSV', { id: 'csv-export' });
    }
  };

  const handleSocialShare = (platform: 'linkedin' | 'twitter') => {
    const shareMessage = `Andru analyzed ${productName}'s core capability and generated buyer personas with objection handlers in under 5 minutes - complete with WHY each persona is the ideal customer. Finally, buyer intelligence that doesn't feel generic.\n\nhttps://platform.andru.ai/icp/demo`;

    const encodedMessage = encodeURIComponent(shareMessage);

    let shareUrl = '';
    if (platform === 'linkedin') {
      // LinkedIn doesn't support pre-filled text, but we can share the URL
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://platform.andru.ai/icp/demo')}`;
    } else {
      // Twitter/X supports pre-filled text
      shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    toast.success(`Opening ${platform === 'linkedin' ? 'LinkedIn' : 'X/Twitter'} share dialog...`);
  };

  const handleEmailCapture = async () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailRegex.test(emailInput)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmittingEmail(true);

    try {
      const response = await fetch('/api/demo/capture-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput,
          demo_type: 'icp_analysis',
          company_slug: productName || null
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.already_exists) {
          toast.success('You\'re already on the list! Check your inbox.', {
            icon: '📧',
            duration: 4000,
          });
        } else {
          toast.success('Analysis sent! Check your inbox.', {
            icon: '✅',
            duration: 5000,
            style: {
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              fontWeight: 600
            }
          });
        }
        setShowEmailModal(false);
        setEmailInput('');
      } else {
        toast.error(data.error || 'Failed to send analysis. Please try again.');
      }
    } catch (error) {
      console.error('Email capture error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  // Option 10: Share Results Handler
  const handleShareResults = async () => {
    const extractUniqueIndustries = (personas: any[]) => {
      const industries = personas
        .flatMap(p => p.industries || [])
        .filter((v, i, a) => a.indexOf(v) === i);
      return industries.slice(0, 3);
    };

    const stats = {
      personaCount: generatedPersonas.length,
      productName: productName || demoData.product.productName,
      topPersona: generatedPersonas[0]?.title || 'Decision Maker',
      industries: extractUniqueIndustries(generatedPersonas)
    };

    // Professional LinkedIn-ready share text
    const text = `Just mapped ${stats.personaCount} buyer personas for ${stats.productName} in <45 seconds with Andru 🎯

Top persona: ${stats.topPersona}
Focus: ${stats.industries.join(', ') || 'Multiple industries'}

Building systematic buyer intelligence instead of guessing.

Try it: https://andru-ai.com/demo`;

    try {
      await navigator.clipboard.writeText(text);

      setShareText(text);

      toast.success(
        'Shareable results copied to clipboard!',
        {
          icon: '📋',
          duration: 3000,
          style: {
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#fff',
            backdropFilter: 'blur(16px)'
          }
        }
      );

      // Show preview of what was copied
      setShowSharePreview(true);
      setTimeout(() => setShowSharePreview(false), 5000);

    } catch (error) {
      toast.error('Failed to copy - please select and copy manually');
    }
  };

  const dataStats = [
    {
      id: 'miss-quota',
      value: '67%',
      label: 'of B2B sales reps miss quota',
      subtext: 'without clear ICP definition',
      color: 'blue',
      gradient: 'rgba(59, 130, 246, 0.05)',
      border: 'rgba(59, 130, 246, 0.2)',
      icon: AlertCircle,
      detail: 'Companies without ICPs waste 30-40% of marketing budget on wrong targets'
    },
    {
      id: 'close-rate',
      value: '3.2x',
      label: 'higher close rates',
      subtext: 'with detailed buyer personas',
      color: 'blue',
      gradient: 'rgba(59, 130, 246, 0.05)',
      border: 'rgba(59, 130, 246, 0.2)',
      icon: TrendingUp,
      detail: 'ICP-based messaging gets 15-25% response rates vs. 2-5% generic outreach'
    },
    {
      id: 'time-saved',
      value: '40hrs',
      label: 'saved per quarter',
      subtext: 'vs. manual market research',
      color: 'blue',
      gradient: 'rgba(59, 130, 246, 0.05)',
      border: 'rgba(59, 130, 246, 0.2)',
      icon: Zap,
      detail: 'AI-powered analysis delivers insights 10x faster than traditional research methods'
    },
    {
      id: 'deal-size',
      value: '+47%',
      label: 'average deal size',
      subtext: 'targeting high-value segments',
      color: 'blue',
      gradient: 'rgba(59, 130, 246, 0.05)',
      border: 'rgba(59, 130, 246, 0.2)',
      icon: DollarSign,
      detail: 'Focus on ideal customers with higher budget authority and clear buying intent'
    },
    {
      id: 'sales-cycle',
      value: '-38%',
      label: 'shorter sales cycles',
      subtext: 'with ICP-aligned prospects',
      color: 'blue',
      gradient: 'rgba(59, 130, 246, 0.05)',
      border: 'rgba(59, 130, 246, 0.2)',
      icon: TrendingDown,
      detail: 'Qualified leads make decisions 38% faster when messaging matches their pain points'
    },
    {
      id: 'win-rate',
      value: '68%',
      label: 'win rate',
      subtext: 'on ICP-matched opportunities',
      color: 'blue',
      gradient: 'rgba(59, 130, 246, 0.05)',
      border: 'rgba(59, 130, 246, 0.2)',
      icon: Target,
      detail: 'Targeting your ICP increases win rates from industry average of 15-20% to 68%'
    }
  ];

  const problemsWithoutICP = [
    { problem: 'Generic Messaging', stat: '2-5% response rates', icon: '📧' },
    { problem: 'Wasted Sales Cycles', stat: '40% "not a fit" losses', icon: '⏱️' },
    { problem: 'High CAC', stat: '3x more expensive', icon: '💰' }
  ];

  const benefitsWithICP = [
    { benefit: 'Targeted Outreach', stat: '15-25% response rates', icon: '🎯' },
    { benefit: 'Qualified Pipeline', stat: '85% convert to next stage', icon: '✅' },
    { benefit: 'Efficient Growth', stat: '65% lower CAC', icon: '📈' }
  ];

  const faqs = [
    {
      question: 'How accurate is the AI-generated ICP?',
      answer: 'Our AI has been trained on 10,000+ validated ICPs and achieves 92% accuracy when compared to manual buyer research. The personas include real buying triggers, pain points, and objections based on market data and buyer psychology patterns.'
    },
    {
      question: 'Can I customize the personas after generation?',
      answer: 'Yes! While the demo shows static results, the full platform allows you to edit every field, add custom pain points, adjust demographics, and save multiple ICP versions. Think of AI as your starting point—you refine from there.'
    },
    {
      question: 'What if my product is unique or brand new?',
      answer: 'Our AI specializes in emerging products. It analyzes adjacent markets, identifies similar buying patterns, and maps buyer psychology from analogous solutions. Even if your product is "first of its kind," buyers have existing problems—we help you find them.'
    },
    {
      question: 'Do I need to sign up to generate an ICP?',
      answer: 'No signup required for the demo! You can generate a full ICP right now and see all the outputs. Sign up only if you want to save your analysis, remove watermarks from exports, or generate unlimited ICPs.'
    },
    {
      question: 'How is this different from manual market research?',
      answer: 'Manual research takes 40+ hours per ICP (interviews, surveys, analysis). Our AI does it in 2 minutes by synthesizing market data, competitor positioning, and buyer psychology patterns. You get the same depth, 10x faster, with export-ready formats.'
    },
    {
      question: 'What formats can I export to?',
      answer: 'You can export to PDF (formatted report), Markdown (for docs), CSV (for CRM import), and AI Prompt Templates (for ChatGPT/Claude to extend your research). All formats include your full ICP analysis.'
    }
  ];

  return (
    <>
      {/* Full-page loading screen */}
      <FullPageLoadingScreen
        isVisible={showFullPageLoading}
        progress={loadingProgress}
        currentMessage={loadingMessage}
      />

      {/* Exit Intent Modal */}
      <ExitIntentModal
        isOpen={showExitIntent}
        onClose={() => setShowExitIntent(false)}
        onGenerate={() => {
          // Scroll to the form section
          const formSection = document.getElementById('generation-form');
          if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      <div className="min-h-screen" style={{
        background: 'transparent',
        color: 'var(--color-text-primary, #ffffff)',
        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
      }}>
        <MotionBackground />
        <Toaster position="top-right" />

      {/* Minimal Top Navigation */}
      <nav className="border-b" style={{
        borderColor: 'var(--glass-border, rgba(255, 255, 255, 0.08))',
        background: 'var(--glass-bg, rgba(255, 255, 255, 0.03))',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <h2 className="text-xl font-bold tracking-wide" style={{
              color: 'var(--color-text-primary, #ffffff)',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
              fontWeight: 'var(--font-weight-semibold, 600)'
            }}>
              Andru
            </h2>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="body text-text-secondary hover:text-text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/signup"
              className="btn btn-primary flex items-center gap-2"
            >
              Sign Up
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Journey Indicator - Step 1: Describe Product */}
          <JourneyIndicator currentStep={1} />

          {/* Hero Section with Inline Form */}
          <StaggeredItem delay={0} animation="lift">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="body-small text-blue-400">Free ICP Generator • No Signup Required</span>
                </div>
              </div>

              <h1 className="heading-1 mb-4">See Your Ideal Customer Profile—In 2 Minutes</h1>

              {/* Social Proof Badge */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <Badge variant="info" size="md" icon={Users}>
                  Andru helps founders improve their enterprise close rates. See how.
                </Badge>
              </div>
            </div>
          </StaggeredItem>

          {/* NEW: Instant Demo Results - Show BEFORE Form */}
          <StaggeredItem delay={0.1} animation="lift">
            <div className="mb-16" id="demo-results">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="body-small text-blue-400">Live Preview</span>
                </div>

                <h2 className="heading-2 mb-3">
                  Here's What You'll Get
                </h2>
                <p className="body-large text-text-muted max-w-2xl mx-auto">
                  Sample ICP for <strong className="text-blue-400">"DevTool Pro"</strong>
                  {' '}(AI-powered code review platform for engineering teams)
                </p>
              </div>

              {/* Show first 2 persona cards */}
              <div className="max-w-5xl mx-auto mb-8">
                <BuyerPersonasWidget
                  personas={generatedPersonas.slice(0, 2)}
                  isDemo={true}
                />

                {/* Preview indicator */}
                <div className="mt-6 p-4 rounded-lg text-center" style={{
                  background: 'rgba(59, 130, 246, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <p className="body-small text-text-muted">
                    Showing 2 of 5 detailed personas •
                    <button
                      onClick={() => document.getElementById('generation-form')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-blue-400 hover:text-blue-300 ml-1 underline"
                    >
                      Generate full analysis for your product ↓
                    </button>
                  </p>
                </div>
              </div>

              {/* Primary CTA - moved up */}
              <div className="text-center">
                <button
                  onClick={() => {
                    document.getElementById('generation-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn btn-primary btn-large inline-flex items-center gap-2"
                  style={{
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  <Sparkles className="w-5 h-5" />
                  Generate This For My Product (2 min)
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="body-small text-text-muted mt-3">
                  No signup required • See all 5 personas + ICP overview
                </p>
              </div>
            </div>
          </StaggeredItem>

          {/* THEN: Form section (now labeled properly) */}
          <StaggeredItem delay={0.15} animation="lift">
            <div id="generation-form" className="max-w-2xl mx-auto p-6 rounded-2xl border" style={{
              background: 'var(--glass-bg)',
              borderColor: 'var(--glass-border)',
              backdropFilter: 'blur(20px)'
            }}>
              <div className="text-center mb-6">
                <RateLimitBadge remaining={remainingGenerations} resetTime={generationsResetTime} />
                <h3 className="heading-3 mb-2">Generate Your Custom ICP</h3>
                <p className="body text-text-muted">Tell us about your product and get instant insights</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="body-small text-text-muted mb-2 block">
                    What's your product/service name? <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., DevTool Pro"
                    className="w-full px-4 py-3 rounded-lg border bg-surface-secondary text-text-primary placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    style={{ 
                      background: 'var(--glass-bg)',
                      borderColor: 'var(--glass-border)' }}
                  />
                </div>

                <div>
                  <label className="body-small text-text-muted mb-2 block">
                    What does it do? <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="e.g., AI-powered code review platform that catches 3x more bugs..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border bg-surface-secondary text-text-primary placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    style={{ 
                      background: 'var(--glass-bg)',
                      borderColor: 'var(--glass-border)' }}
                  />
                </div>

                <div>
                  <label className="body-small text-text-muted mb-2 block">
                    Who's your target buyer? (optional)
                  </label>
                  <input
                    type="text"
                    value={targetBuyer}
                    onChange={(e) => setTargetBuyer(e.target.value)}
                    placeholder="e.g., Engineering teams at Series A startups (or leave blank)"
                    className="w-full px-4 py-3 rounded-lg border bg-surface-secondary text-text-primary placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    style={{ 
                      background: 'var(--glass-bg)',
                      borderColor: 'var(--glass-border)' }}
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || remainingGenerations === 0}
                  className="btn btn-primary w-full flex flex-col items-center justify-center gap-2 btn-large"
                  style={{
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                    minHeight: '60px'
                  }}
                >
                  {remainingGenerations === 0 ? (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      Daily Limit Reached
                    </>
                  ) : isGenerating ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating...</span>
                      </div>
                      {generationStage && (
                        <span className="text-xs font-mono opacity-75">{generationStage}</span>
                      )}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate My Free ICP
                    </>
                  )}
                </button>

                <p className="body-small text-text-muted text-center">
                  No credit card required • Free for basic features
                </p>

                {/* Results Preview */}
                <div className="mt-6 p-4 rounded-lg" style={{
                  background: 'rgba(59, 130, 246, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <div className="body-small font-medium text-blue-400 mb-3">You'll Get:</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div className="body-small text-text-muted">
                        <strong className="text-text-primary">5 Detailed Personas</strong> with pain points, objections & buying triggers
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div className="body-small text-text-muted">
                        <strong className="text-text-primary">ICP Overview</strong> with company profile & buying committee analysis
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div className="body-small text-text-muted">
                        <strong className="text-text-primary">Export Options</strong> in PDF, Markdown, CSV & AI prompt formats
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </StaggeredItem>

          {/* How It Works Section */}
          <StaggeredItem delay={0.15} animation="slide">
            <div className="mb-8">
              <h2 className="heading-3 text-center mb-6">How It Works</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <motion.div
                  className="relative p-6 rounded-2xl border"
                  style={{
                    background: 'var(--glass-bg)',
                    borderColor: 'rgba(59, 130, 246, 0.2)',
                    minHeight: '200px'
                  }}
                  whileHover={{ y: -4 }}
                >
                  <div className="absolute -top-4 left-6 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      color: 'white'
                    }}
                  >
                    1
                  </div>

                  <div className="mt-4">
                    <h3 className="heading-4 mb-2">Describe Your Product</h3>
                    <p className="body-small text-text-muted mb-3">
                      Tell us what your product does and who it's for. Takes just 30 seconds.
                    </p>
                    <div className="flex items-center gap-2 text-blue-400">
                      <Zap className="w-4 h-4" />
                      <span className="body-small">30 seconds</span>
                    </div>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                  className="relative p-6 rounded-2xl border"
                  style={{
                    background: 'var(--glass-bg)',
                    borderColor: 'rgba(59, 130, 246, 0.2)',
                    minHeight: '200px'
                  }}
                  whileHover={{ y: -4 }}
                >
                  <div className="absolute -top-4 left-6 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                      color: 'white'
                    }}
                  >
                    2
                  </div>

                  <div className="mt-4">
                    <h3 className="heading-4 mb-2">AI Analyzes Market</h3>
                    <p className="body-small text-text-muted mb-3">
                      Our AI analyzes your market positioning, competition, and buyer psychology in real-time.
                    </p>
                    <div className="flex items-center gap-2 text-purple-400">
                      <Sparkles className="w-4 h-4" />
                      <span className="body-small">90 seconds</span>
                    </div>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                  className="relative p-6 rounded-2xl border"
                  style={{
                    background: 'var(--glass-bg)',
                    borderColor: 'rgba(59, 130, 246, 0.2)',
                    minHeight: '200px'
                  }}
                  whileHover={{ y: -4 }}
                >
                  <div className="absolute -top-4 left-6 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899 0%, #10b981 100%)',
                      color: 'white'
                    }}
                  >
                    3
                  </div>

                  <div className="mt-4">
                    <h3 className="heading-4 mb-2">Get Detailed Personas</h3>
                    <p className="body-small text-text-muted mb-3">
                      Receive comprehensive buyer personas, pain points, and sales plays. Export in any format.
                    </p>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="body-small">Instant results</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Process Arrow Visualization */}
              <div className="hidden md:flex items-center justify-center gap-2 mt-4">
                <div className="body-small text-text-subtle">Total Time:</div>
                <div className="body-small font-medium text-blue-400">~2 minutes</div>
                <div className="body-small text-text-subtle">• 10x faster than manual research</div>
              </div>
            </div>
          </StaggeredItem>

          {/* Interactive Data Stats Section - Horizontal Scroll */}
          <StaggeredItem delay={0.1} animation="slide">
            <div className="mb-8">
              <h2 className="heading-3 text-center mb-6">Why ICPs Matter for Revenue Growth</h2>

              {/* Horizontal scroll container with scroll indicators */}
              <div className="relative">
                {/* Left scroll arrow */}
                {canScrollLeft && (
                  <button
                    onClick={() => scrollStats('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      background: 'rgba(59, 130, 246, 0.9)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                )}

                {/* Scrollable stats container */}
                <div
                  ref={statsScrollRef}
                  className="horizontal-scroll-container flex gap-6 overflow-x-auto pb-2"
                  style={{
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {dataStats.map((stat, index) => {
                    const Icon = stat.icon;
                    const isExpanded = isMobile ? tappedStat === stat.id : hoveredStat === stat.id;
                    return (
                      <motion.div
                        key={stat.id}
                        className="p-6 rounded-2xl border cursor-pointer flex-shrink-0"
                        style={{
                          background: stat.gradient,
                          borderColor: stat.border,
                          minHeight: '240px',
                          width: '320px', // Fixed width for horizontal scroll
                          transition: 'border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseEnter={(e) => {
                          if (!isMobile) {
                            setHoveredStat(stat.id);
                            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)'; // Enhanced border glow
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isMobile) {
                            setHoveredStat(null);
                            e.currentTarget.style.borderColor = stat.border;
                          }
                        }}
                        onClick={() => isMobile && setTappedStat(tappedStat === stat.id ? null : stat.id)}
                        whileHover={{ y: -8, scale: 1.02, boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)' }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="text-4xl font-bold text-blue-400">
                            {stat.value}
                          </div>
                          <Icon className="w-6 h-6 text-blue-400" />
                        </div>

                        <div className="body text-text-primary mb-1">{stat.label}</div>
                        <div className="body-small text-text-muted">{stat.subtext}</div>

                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: isExpanded ? 'auto' : 0,
                            opacity: isExpanded ? 1 : 0
                          }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: stat.border }}>
                            <div className="body-small text-text-muted italic">
                              {stat.detail}
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Right scroll arrow */}
                {canScrollRight && (
                  <button
                    onClick={() => scrollStats('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      background: 'rgba(59, 130, 246, 0.9)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>

              {/* Contextual CTA for Data Stats */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => {
                    // Share functionality - for demo, show toast
                    toast.success('Share link copied to clipboard!');
                  }}
                  className="btn btn-primary flex items-center gap-2"
                  style={{
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <Users className="w-4 h-4" />
                  Share These Insights →
                </button>
              </div>
            </div>
          </StaggeredItem>

          {/* Interactive Before/After Comparison */}
          <StaggeredItem delay={0.2} animation="lift">
            <div className="p-8 rounded-2xl border" style={{
              background: 'var(--glass-bg)',
              borderColor: 'var(--glass-border)'
            }}>
              <h3 className="heading-3 text-center mb-6">The Cost of Guessing Your Customer</h3>

              {/* Toggle Switch */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={`body ${comparisonView === 'without' ? 'text-text-primary' : 'text-text-muted'}`}>
                  Without ICP
                </span>
                <button
                  onClick={() => setComparisonView(comparisonView === 'without' ? 'with' : 'without')}
                  className="relative w-20 h-10 rounded-full transition-colors"
                  style={{
                    background: comparisonView === 'with'
                      ? 'rgba(59, 130, 246, 0.8)'
                      : 'rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <motion.div
                    className="absolute top-1 w-8 h-8 bg-white rounded-full shadow-lg"
                    animate={{ left: comparisonView === 'with' ? '44px' : '4px' }}
                    transition={{ duration: 0.2 }}
                  />
                </button>
                <span className={`body ${comparisonView === 'with' ? 'text-text-primary' : 'text-text-muted'}`}>
                  With ICP
                </span>
              </div>

              {/* Comparison Grid */}
              <motion.div
                key={comparisonView}
                initial={{ opacity: 0, x: comparisonView === 'with' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {comparisonView === 'without' ? (
                  problemsWithoutICP.map((item, index) => (
                    <motion.div
                      key={index}
                      className="p-4 rounded-lg bg-red-900/20 border border-red-700/50"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{item.icon}</div>
                        <div>
                          <div className="body font-medium text-white mb-1">{item.problem}</div>
                          <div className="body-small text-red-400">{item.stat}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  benefitsWithICP.map((item, index) => (
                    <motion.div
                      key={index}
                      className="p-4 rounded-lg bg-emerald-900/20 border border-emerald-700/50"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{item.icon}</div>
                        <div>
                          <div className="body font-medium text-white mb-1">{item.benefit}</div>
                          <div className="body-small text-emerald-400">{item.stat}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>

              <div className="text-center mt-6">
                <p className="body-small text-text-muted italic">
                  Toggle to compare the impact of ICP-driven strategy
                </p>
              </div>
            </div>
          </StaggeredItem>

          {/* FAQ Section */}
          <StaggeredItem delay={0.25} animation="lift">
            <div className="mb-8">
              <h2 className="heading-3 text-center mb-6">Frequently Asked Questions</h2>

              <div className="max-w-3xl mx-auto space-y-3">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className="p-5 rounded-xl border cursor-pointer"
                    style={{
                      background: 'var(--glass-bg)',
                      borderColor: openFaqIndex === index ? 'rgba(59, 130, 246, 0.3)' : 'var(--glass-border)'
                    }}
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    whileHover={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="body font-medium text-text-primary flex-1">
                        {faq.question}
                      </div>
                      <motion.div
                        animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 mt-1"
                      >
                        <ArrowRight className="w-5 h-5 text-text-muted transform rotate-90" />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={false}
                      animate={{
                        height: openFaqIndex === index ? 'auto' : 0,
                        opacity: openFaqIndex === index ? 1 : 0
                      }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 body-small text-text-muted">
                        {faq.answer}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-6">
                <p className="body-small text-text-muted">
                  Still have questions?{' '}
                  <Link href="/contact" className="text-blue-400 hover:underline">
                    Contact us
                  </Link>
                </p>
              </div>
            </div>
          </StaggeredItem>

          {/* Results Section - Only show after generation */}
          {showResults && (
            <div id="results-section">
              {/* Demo Results Header */}
              <StaggeredItem delay={0.3} animation="slide">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="heading-2 mb-2">Your ICP Analysis</h2>
                    <p className="body text-text-muted">
                      Based on: <strong>{productName || 'DevTool Pro'}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowEmailModal(true)}
                      className="btn btn-primary flex items-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      <Mail className="w-4 h-4" />
                      Email Me This
                    </button>
                    <button
                      onClick={() => handleSocialShare('linkedin')}
                      className="btn btn-secondary flex items-center gap-2"
                      title="Share on LinkedIn"
                    >
                      <Share2 className="w-4 h-4" />
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleSocialShare('twitter')}
                      className="btn btn-secondary flex items-center gap-2"
                      title="Share on X/Twitter"
                    >
                      <Share2 className="w-4 h-4" />
                      X
                    </button>
                    <button
                      onClick={() => setShowExportModal(true)}
                      className="btn btn-secondary flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
              </StaggeredItem>

              {/* Intelligence Summary - NEW */}
              {(refinedDescription || coreCapability) && (
                <StaggeredItem delay={0.35} animation="lift">
                  <div className="mb-6 p-6 rounded-xl border" style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
                    borderColor: 'rgba(59, 130, 246, 0.2)'
                  }}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                        <Lightbulb className="w-5 h-5 text-primary-blue" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary mb-1">Intelligence Extraction</h3>
                        <p className="text-sm text-text-muted">
                          Andru's deep analysis of your product description
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {refinedDescription && (
                        <div>
                          <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">
                            Enhanced Product Description
                          </p>
                          <p className="text-text-primary leading-relaxed">
                            {refinedDescription}
                          </p>
                        </div>
                      )}

                      {coreCapability && (
                        <div>
                          <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">
                            Core Capability (Pure Signal)
                          </p>
                          <p className="text-text-primary font-medium leading-relaxed">
                            {coreCapability}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </StaggeredItem>
              )}

              {/* Tab Navigation */}
              <StaggeredItem delay={0.4} animation="slide">
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setActiveTab('personas')}
                    className={`btn ${activeTab === 'personas' ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2`}
                  >
                    <Users className="w-4 h-4" />
                    Buyer Personas ({generatedPersonas.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    ICP Overview
                  </button>
                </div>
              </StaggeredItem>

              {/* Content Area */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'personas' && (
                  <>
                    {/* Quality Summary Banner */}
                    {(() => {
                      const quality = calculateQualitySummary(generatedPersonas);
                      return (
                        <div className="mb-6 p-4 rounded-xl border" style={{
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
                          borderColor: 'rgba(16, 185, 129, 0.2)'
                        }}>
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg" style={{
                                background: 'rgba(16, 185, 129, 0.1)'
                              }}>
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-text-primary">
                                  Analysis Quality Score: {quality.avgConfidence}%
                                </h3>
                                <p className="text-xs text-text-muted">
                                  {quality.highConfidence} of {quality.total} personas have high confidence
                                </p>
                              </div>
                            </div>

                            {/* Confidence Indicators */}
                            <div className="flex items-center gap-2">
                              {quality.highConfidence > 0 && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{
                                  background: 'rgba(16, 185, 129, 0.1)',
                                  border: '1px solid rgba(16, 185, 129, 0.3)'
                                }}>
                                  <div className="w-2 h-2 rounded-full bg-green-400" />
                                  <span className="text-xs font-medium text-green-400">{quality.highConfidence} High</span>
                                </div>
                              )}
                              {quality.mediumConfidence > 0 && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{
                                  background: 'rgba(251, 191, 36, 0.1)',
                                  border: '1px solid rgba(251, 191, 36, 0.3)'
                                }}>
                                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                  <span className="text-xs font-medium text-yellow-400">{quality.mediumConfidence} Medium</span>
                                </div>
                              )}
                              {quality.lowConfidence > 0 && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)'
                                }}>
                                  <div className="w-2 h-2 rounded-full bg-red-400" />
                                  <span className="text-xs font-medium text-red-400">{quality.lowConfidence} Low</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    <BuyerPersonasWidget
                      personas={generatedPersonas}
                      isDemo={true}
                    />
                    {/* Contextual CTA for Personas */}
                    <div className="mt-6 flex justify-center gap-3">
                      <button
                        onClick={() => setShowExportModal(true)}
                        className="btn btn-secondary flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </button>

                      <button
                        onClick={handleShareResults}
                        className="btn btn-primary flex items-center gap-2"
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                        Share Results
                      </button>
                    </div>
                  </>
                )}

                {activeTab === 'overview' && (
                  <>
                    <MyICPOverviewWidget
                      icpData={demoData.icp}
                      personas={generatedPersonas}
                      productName={productName || demoData.product.productName}
                      isDemo={true}
                    />
                    {/* Contextual CTA for ICP Overview */}
                    <div className="mt-6 flex justify-center gap-3">
                      <button
                        onClick={() => setShowExportModal(true)}
                        className="btn btn-secondary flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </button>

                      <button
                        onClick={handleShareResults}
                        className="btn btn-primary flex items-center gap-2"
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                        Share Results
                      </button>
                    </div>
                  </>
                )}
              </motion.div>

              {/* Strategic CTAs After Results */}
              <StaggeredItem delay={0.5} animation="lift" className="mt-12">
                <PostGenerationCTA
                  variant="all"
                  productName={productName || 'your product'}
                  onCTAClick={(ctaType) => {
                    // Track CTA clicks for analytics
                    console.log('Post-generation CTA clicked:', ctaType);
                  }}
                />
              </StaggeredItem>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowExportModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md p-6 rounded-2xl border"
            style={{
              background: 'var(--glass-bg)',
              borderColor: 'var(--glass-border)',
              backdropFilter: 'blur(20px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="heading-3 mb-4">Export Demo ICP</h3>
            <p className="body text-text-muted mb-6">
              See how Andru formats your ICP analysis. All exports include
              <strong> DEMO watermarks</strong>—sign up to save your real analysis
              and get watermark-free exports.
            </p>

            <div className="space-y-3">
              <button
                onClick={handlePDFExport}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export as PDF
              </button>
              <button
                onClick={handleMarkdownExport}
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export as Markdown
              </button>
              <button
                onClick={handleCSVExport}
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export as CSV
              </button>
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              className="btn btn-ghost w-full mt-4"
            >
              Cancel
            </button>

            <p className="body-small text-text-muted text-center mt-6 pt-6 border-t" style={{ borderColor: 'var(--glass-border)' }}>
              Founding members get unlimited exports in all formats.
              <Link href="/founding-members" className="text-blue-400 hover:underline ml-1">
                Learn more →
              </Link>
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Email Capture Modal */}
      {showEmailModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowEmailModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md p-6 rounded-2xl border"
            style={{
              background: 'var(--glass-bg)',
              borderColor: 'var(--glass-border)',
              backdropFilter: 'blur(20px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg" style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)'
              }}>
                <Mail className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="heading-3">Email Me This Analysis</h3>
            </div>

            <p className="body text-text-muted mb-6">
              Get this ICP analysis sent to your inbox. We'll also keep you updated on new features and insights.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="email-input" className="block text-sm font-semibold mb-2 text-text-primary">
                  Email Address
                </label>
                <input
                  id="email-input"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isSubmittingEmail) {
                      handleEmailCapture();
                    }
                  }}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 rounded-lg border text-text-primary placeholder-text-muted"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                  disabled={isSubmittingEmail}
                  autoFocus
                />
              </div>

              <button
                onClick={handleEmailCapture}
                disabled={isSubmittingEmail || !emailInput}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                style={{
                  background: isSubmittingEmail || !emailInput
                    ? 'rgba(16, 185, 129, 0.3)'
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: isSubmittingEmail || !emailInput
                    ? 'none'
                    : '0 4px 12px rgba(16, 185, 129, 0.3)',
                  cursor: isSubmittingEmail || !emailInput ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmittingEmail ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send Analysis
                  </>
                )}
              </button>

              <button
                onClick={() => setShowEmailModal(false)}
                className="btn btn-ghost w-full"
                disabled={isSubmittingEmail}
              >
                Cancel
              </button>
            </div>

            <p className="body-small text-text-muted text-center mt-6 pt-6 border-t" style={{ borderColor: 'var(--glass-border)' }}>
              <CheckCircle2 className="w-4 h-4 inline-block mr-1 text-green-400" />
              No spam. Just valuable insights about your buyers.
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Share Preview Modal */}
      {showSharePreview && shareText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-24 right-6 p-4 rounded-xl shadow-2xl max-w-sm border z-50"
          style={{
            background: 'rgba(17, 24, 39, 0.95)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            backdropFilter: 'blur(16px)'
          }}
        >
          <p className="text-xs text-gray-400 mb-2">Copied to clipboard:</p>
          <div className="text-sm text-white whitespace-pre-wrap bg-gray-800 p-3 rounded-lg font-mono max-h-48 overflow-y-auto">
            {shareText}
          </div>
          <button
            onClick={() => setShowSharePreview(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Keyboard Shortcuts Hint - Only show on desktop */}
      {!isMobile && (
        <div className="fixed bottom-4 right-4 p-3 rounded-lg border backdrop-blur-xl"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            fontSize: '11px',
            color: '#a3a3a3',
            zIndex: 40
          }}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded bg-gray-700 text-white font-mono">D</kbd>
              <span>Jump to demo</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded bg-gray-700 text-white font-mono">F</kbd>
              <span>Jump to form</span>
            </div>
            {productName && productDescription && (
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-gray-700 text-white font-mono">G</kbd>
                <span>Generate ICP</span>
              </div>
            )}
            {showResults && (
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-gray-700 text-white font-mono">E</kbd>
                <span>Export results</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden Scrollbar CSS - 21st.dev pattern */}
      <style jsx>{`
        .horizontal-scroll-container {
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          overflow-x: auto;
          scroll-behavior: smooth;
        }

        .horizontal-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      </div>
    </>
  );
}
