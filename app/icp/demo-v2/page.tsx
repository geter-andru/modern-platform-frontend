'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Download, Users, BarChart3, TrendingUp, AlertCircle, CheckCircle2, Zap, Target, DollarSign, TrendingDown, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import BuyerPersonasWidget from '../../../src/features/icp-analysis/widgets/BuyerPersonasWidget';
import MyICPOverviewWidget from '../../../src/features/icp-analysis/widgets/MyICPOverviewWidget';
import { Badge } from '../../../src/shared/components/ui/Badge';
import { MotionBackground } from '../../../src/shared/components/ui/MotionBackground';
import { exportICPToPDF } from '@/app/lib/utils/pdf-export';
import { exportToMarkdown, exportToCSV } from '@/app/lib/utils/data-export';
import toast, { Toaster } from 'react-hot-toast';
import demoData from '../../../data/demo-icp-devtool.json';
import '../../../src/shared/styles/component-patterns.css';
import { BRAND_IDENTITY } from '@/app/lib/constants/brand-identity';
import { StaggeredItem } from '../../../src/shared/utils/staggered-entrance';

export default function ICPDemoV2Page() {
  const [activeTab, setActiveTab] = useState<'personas' | 'overview'>('personas');
  const [showExportModal, setShowExportModal] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [tappedStat, setTappedStat] = useState<string | null>(null);
  const [comparisonView, setComparisonView] = useState<'without' | 'with'>('without');
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const statsScrollRef = React.useRef<HTMLDivElement>(null);

  // Form state
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [targetBuyer, setTargetBuyer] = useState('');

  // Mobile detection for touch optimization
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleGenerate = async () => {
    if (!productName || !productDescription) {
      toast.error('Please fill in product name and description');
      return;
    }

    setIsGenerating(true);
    toast.loading('Generating your ICP...', { id: 'generate' });

    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setShowResults(true);
      toast.success('ICP generated successfully!', { id: 'generate' });

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 2000);
  };

  const handlePDFExport = async () => {
    toast.loading('Generating demo PDF...', { id: 'pdf-export' });
    const exportData = {
      companyName: 'Demo - ' + demoData.product.productName,
      productName: demoData.product.description,
      personas: demoData.personas,
      generatedAt: demoData.generatedAt
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
      companyName: 'Demo - ' + demoData.product.productName,
      productName: demoData.product.description,
      personas: demoData.personas,
      generatedAt: demoData.generatedAt
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
      companyName: 'Demo - ' + demoData.product.productName,
      productName: demoData.product.description,
      personas: demoData.personas,
      generatedAt: demoData.generatedAt
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

          {/* Hero Section with Inline Form */}
          <StaggeredItem delay={0} animation="lift">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="body-small text-blue-400">Interactive Demo</span>
                </div>
              </div>

              <h1 className="heading-1 mb-4">Generate Your ICP in 3 Minutes</h1>

              <p className="body-large text-text-muted max-w-3xl mx-auto mb-6">
                See how Andru generates detailed buyer personas, pain points, and sales plays for B2B SaaS.
              </p>

              {/* Social Proof Badge */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <Badge variant="info" size="md" icon={Users}>
                  Join 100 founders improving their enterprise close rates
                </Badge>
              </div>
            </div>

            {/* Inline Generation Form */}
            <div className="max-w-2xl mx-auto p-6 rounded-2xl border" style={{
              background: 'var(--glass-bg)',
              borderColor: 'var(--glass-border)',
              backdropFilter: 'blur(20px)'
            }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-3">Try It Now</h2>
                <div className="flex items-center gap-4 text-sm text-text-muted">
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-blue-400" />
                    Takes minutes
                  </span>
                  <span>🔒 Secure</span>
                </div>
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
                    style={{ borderColor: 'var(--glass-border)' }}
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
                    style={{ borderColor: 'var(--glass-border)' }}
                  />
                </div>

                <div>
                  <label className="body-small text-text-muted mb-2 block">
                    Whose your target buyer (optional)
                  </label>
                  <input
                    type="text"
                    value={targetBuyer}
                    onChange={(e) => setTargetBuyer(e.target.value)}
                    placeholder="e.g., Engineering teams at Series A startups (or leave blank)"
                    className="w-full px-4 py-3 rounded-lg border bg-surface-secondary text-text-primary placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    style={{ borderColor: 'var(--glass-border)' }}
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="btn btn-primary w-full flex items-center justify-center gap-2 btn-large"
                  style={{
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
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
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Results
                  </button>
                </div>
              </StaggeredItem>

              {/* Tab Navigation */}
              <StaggeredItem delay={0.4} animation="slide">
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setActiveTab('personas')}
                    className={`btn ${activeTab === 'personas' ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2`}
                  >
                    <Users className="w-4 h-4" />
                    Buyer Personas ({demoData.personas.length})
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
                    <BuyerPersonasWidget
                      personas={demoData.personas}
                      isDemo={true}
                    />
                    {/* Contextual CTA for Personas */}
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => setShowExportModal(true)}
                        className="btn btn-primary flex items-center gap-2"
                        style={{
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Export Personas to CRM →
                      </button>
                    </div>
                  </>
                )}

                {activeTab === 'overview' && (
                  <>
                    <MyICPOverviewWidget
                      icpData={demoData.icp}
                      personas={demoData.personas}
                      productName={productName || demoData.product.productName}
                      isDemo={true}
                    />
                    {/* Contextual CTA for ICP Overview */}
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => setShowExportModal(true)}
                        className="btn btn-primary flex items-center gap-2"
                        style={{
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Download Full Analysis →
                      </button>
                    </div>
                  </>
                )}
              </motion.div>

              {/* Sign Up CTA After Results */}
              <StaggeredItem delay={0.5} animation="lift" className="mt-12">
                <div className="p-8 rounded-2xl border text-center" style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                  borderColor: 'var(--glass-border)'
                }}>
                  <h3 className="heading-2 mb-3">Want to Save This Analysis?</h3>
                  <p className="body-large text-text-muted mb-6 max-w-2xl mx-auto">
                    Sign up free to save your ICP, get watermark-free exports, and generate unlimited analyses.
                  </p>
                  <Link
                    href="/signup"
                    className="btn btn-primary btn-large inline-flex items-center gap-2"
                  >
                    Sign Up Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
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
  );
}
