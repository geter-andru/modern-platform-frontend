'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Download, FileDown, FileCode, Table, Sparkles } from 'lucide-react';
import { Brain, Target, Users, FileText, Zap, BarChart3 } from 'lucide-react';
import { useRequireAuth } from '@/app/lib/auth';
import { useCustomer, useCustomerICP, useTrackAction } from '@/app/lib/hooks/useAPI';
import { usePersonasCache } from '@/app/lib/hooks/cache';
import { EnterpriseNavigationV2 } from '../../src/shared/components/layout/EnterpriseNavigationV2';
import { GlassCard, GlassButton, GlassModal } from '../../src/shared/components/design-system';
import { exportICPToPDF } from '@/app/lib/utils/pdf-export';
import { exportToMarkdown, exportToCSV } from '@/app/lib/utils/data-export';
import { exportToChatGPTPrompt, exportToClaudePrompt, exportToGeminiPrompt } from '@/app/lib/utils/ai-prompt-export';
import toast from 'react-hot-toast';
import '../../src/shared/styles/component-patterns.css';

// Import widget components
import ProductDetailsWidget from '../../src/features/icp-analysis/widgets/ProductDetailsWidget';
import ICPRatingSystemWidget from '../../src/features/icp-analysis/widgets/ICPRatingSystemWidget';
import BuyerPersonasWidget from '../../src/features/icp-analysis/widgets/BuyerPersonasWidget';
import MyICPOverviewWidget from '../../src/features/icp-analysis/widgets/MyICPOverviewWidget';
import RateCompanyWidget from '../../src/features/icp-analysis/widgets/RateCompanyWidget';

interface Widget {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  available: boolean
  component?: React.ComponentType<any>
}

// Widget categorization for two-column layout (STYLING DATA ONLY - no logic changes)
const INPUT_WIDGETS = ['product-details', 'rating-system', 'rate-company'];
const OUTPUT_WIDGETS = ['overview', 'personas'];

const WIDGETS: Widget[] = [
  {
    id: 'product-details',
    title: 'Product Details',
    description: 'Core ICP analysis workflow',
    icon: Brain,
    available: true,
    component: ProductDetailsWidget
  },
  {
    id: 'rating-system',
    title: 'Rating System',
    description: 'Rate and evaluate ICP framework',
    icon: Target,
    available: true,
    component: ICPRatingSystemWidget
  },
  {
    id: 'personas',
    title: 'Personas',
    description: 'Generate buyer personas',
    icon: Users,
    available: true,
    component: BuyerPersonasWidget
  },
  {
    id: 'overview',
    title: 'My ICP Overview',
    description: 'Summary of your ICPs',
    icon: BarChart3,
    available: true,
    component: MyICPOverviewWidget
  },
  {
    id: 'rate-company',
    title: 'Rate a Company',
    description: 'Evaluate a company against your ICP',
    icon: FileText,
    available: true,
    component: RateCompanyWidget
  },
  {
    id: 'translator',
    title: 'Technical Translator',
    description: 'Translate technical terms',
    icon: Zap,
    available: false
  }
]

export default function ICPPage() {
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useRequireAuth(); // Auto-redirects if not authenticated
  const [activeWidget, setActiveWidget] = useState('product-details');
  const [loading, setLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const trackAction = useTrackAction();

  useEffect(() => {
    if (authLoading || !user) return;

    // Track page view
    trackAction.mutate({
      customerId: user.id,
      action: 'page_view',
      metadata: { page: 'icp_analysis' }
    });
  }, [user, authLoading]); // trackAction is stable, doesn't need to be in deps

  // Handle URL parameters for widget selection
  useEffect(() => {
    const widget = searchParams.get('widget');
    if (widget && WIDGETS.some(w => w.id === widget)) {
      setActiveWidget(widget);
    }
  }, [searchParams]);

  const { data: icpData, isLoading } = useCustomerICP(user?.id);
  const { data: customerData } = useCustomer(user?.id); // Fetch full customer data for brand assets

  // Get personas data for export
  const {
    personas,
    isLoadingPersonas,
  } = usePersonasCache({
    customerId: user?.id,
    enabled: !!user?.id
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="body text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentWidget = WIDGETS.find(w => w.id === activeWidget);
  const isInputWidget = INPUT_WIDGETS.includes(activeWidget);
  const isOutputWidget = OUTPUT_WIDGETS.includes(activeWidget);

  // Determine which widgets to show in each column (STYLING DATA ACCESS ONLY - no logic changes)
  // Provide fallbacks to prevent undefined errors
  const leftColumnWidget = isInputWidget && currentWidget 
    ? currentWidget 
    : WIDGETS.find(w => w.id === 'product-details') || WIDGETS[0];
  const rightColumnWidget = isOutputWidget && currentWidget 
    ? currentWidget 
    : WIDGETS.find(w => w.id === 'overview') || WIDGETS.find(w => OUTPUT_WIDGETS.includes(w.id)) || WIDGETS[0];

  const handleWidgetChange = (widgetId: string) => {
    setActiveWidget(widgetId);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('widget', widgetId);
    window.history.pushState({}, '', url.toString());
  }

  const handleExport = (data: any) => {
    console.log('Exporting data:', data);
    // Handle export logic
  }

  const handlePDFExport = async () => {
    // Validate we have persona data
    if (!personas || personas.length === 0) {
      toast.error('No personas available to export. Please generate your ICP first.');
      return;
    }

    // Show loading state
    toast.loading('Generating PDF...', { id: 'pdf-export' });

    // Prepare export data
    const exportData = {
      companyName: user?.user_metadata?.company_name || 'Your Company',
      productName: 'ICP Analysis',
      personas: personas,
      generatedAt: new Date().toISOString()
    };

    // Check if user is on free tier (we'll implement this properly in Phase 2)
    // For now, assume all exports include watermark for beta
    const isFreeTier = true;

    // Extract brand assets from customer data
    const brandAssets = (customerData?.data as any)?.brand_assets || null;

    // Export PDF with error handling (now async to support logo loading)
    const result = await exportICPToPDF(exportData, {
      includeFreeWatermark: isFreeTier,
      companyName: exportData.companyName,
      productName: exportData.productName,
      brandAssets: brandAssets || undefined // Pass brand assets if available
    });

    // Handle result
    if (result.success) {
      toast.success('PDF exported successfully!', { id: 'pdf-export' });
      setShowExportModal(false);

      // Track export action
      if (trackAction?.mutate) {
        trackAction.mutate({
          customerId: user.id,
          action: 'export_pdf',
          metadata: { personaCount: personas.length }
        });
      }
    } else {
      toast.error(result.error || 'Failed to export PDF. Please try again.', { id: 'pdf-export' });
    }
  };

  const handleMarkdownExport = async () => {
    // Validate we have persona data
    if (!personas || personas.length === 0) {
      toast.error('No personas available to export. Please generate your ICP first.');
      return;
    }

    // Show loading state
    toast.loading('Copying to clipboard...', { id: 'markdown-export' });

    // Prepare export data
    const exportData = {
      companyName: user?.user_metadata?.company_name || 'Your Company',
      productName: 'ICP Analysis',
      personas: personas,
      generatedAt: new Date().toISOString()
    };

    // Export Markdown
    const result = await exportToMarkdown(exportData);

    // Handle result
    if (result.success) {
      toast.success('Markdown copied to clipboard! Paste into Notion.', { id: 'markdown-export' });
      setShowExportModal(false);

      // Track export action
      if (trackAction?.mutate) {
        trackAction.mutate({
          customerId: user.id,
          action: 'export_markdown',
          metadata: { personaCount: personas.length }
        });
      }
    } else {
      toast.error(result.error || 'Failed to copy Markdown. Please try again.', { id: 'markdown-export' });
    }
  };

  const handleCSVExport = () => {
    // Validate we have persona data
    if (!personas || personas.length === 0) {
      toast.error('No personas available to export. Please generate your ICP first.');
      return;
    }

    // Show loading state
    toast.loading('Generating CSV...', { id: 'csv-export' });

    // Prepare export data
    const exportData = {
      companyName: user?.user_metadata?.company_name || 'Your Company',
      productName: 'ICP Analysis',
      personas: personas,
      generatedAt: new Date().toISOString()
    };

    // Export CSV
    const result = exportToCSV(exportData);

    // Handle result
    if (result.success) {
      toast.success('CSV downloaded successfully!', { id: 'csv-export' });
      setShowExportModal(false);

      // Track export action
      if (trackAction?.mutate) {
        trackAction.mutate({
          customerId: user.id,
          action: 'export_csv',
          metadata: { personaCount: personas.length }
        });
      }
    } else {
      toast.error(result.error || 'Failed to export CSV. Please try again.', { id: 'csv-export' });
    }
  };

  const handleChatGPTExport = async () => {
    // Validate we have persona data
    if (!personas || personas.length === 0) {
      toast.error('No personas available to export. Please generate your ICP first.');
      return;
    }

    // Show loading state
    toast.loading('Copying ChatGPT prompt...', { id: 'chatgpt-export' });

    // Prepare export data
    const exportData = {
      companyName: user?.user_metadata?.company_name || 'Your Company',
      productName: 'ICP Analysis',
      productDescription: undefined,
      targetMarket: undefined,
      personas: personas,
      generatedAt: new Date().toISOString()
    };

    // Export ChatGPT Prompt
    const result = await exportToChatGPTPrompt(exportData);

    // Handle result
    if (result.success) {
      toast.success('ChatGPT prompt copied! Paste into ChatGPT to extend your research.', { id: 'chatgpt-export' });
      setShowExportModal(false);

      // Track export action
      if (trackAction?.mutate) {
        trackAction.mutate({
          customerId: user.id,
          action: 'export_chatgpt_prompt',
          metadata: { personaCount: personas.length }
        });
      }
    } else {
      toast.error(result.error || 'Failed to copy ChatGPT prompt. Please try again.', { id: 'chatgpt-export' });
    }
  };

  const handleClaudeExport = async () => {
    // Validate we have persona data
    if (!personas || personas.length === 0) {
      toast.error('No personas available to export. Please generate your ICP first.');
      return;
    }

    // Show loading state
    toast.loading('Copying Claude prompt...', { id: 'claude-export' });

    // Prepare export data
    const exportData = {
      companyName: user?.user_metadata?.company_name || 'Your Company',
      productName: 'ICP Analysis',
      productDescription: undefined,
      targetMarket: undefined,
      personas: personas,
      generatedAt: new Date().toISOString()
    };

    // Export Claude Prompt
    const result = await exportToClaudePrompt(exportData);

    // Handle result
    if (result.success) {
      toast.success('Claude prompt copied! Paste into Claude to extend your research.', { id: 'claude-export' });
      setShowExportModal(false);

      // Track export action
      if (trackAction?.mutate) {
        trackAction.mutate({
          customerId: user.id,
          action: 'export_claude_prompt',
          metadata: { personaCount: personas.length }
        });
      }
    } else {
      toast.error(result.error || 'Failed to copy Claude prompt. Please try again.', { id: 'claude-export' });
    }
  };

  const handleGeminiExport = async () => {
    // Validate we have persona data
    if (!personas || personas.length === 0) {
      toast.error('No personas available to export. Please generate your ICP first.');
      return;
    }

    // Show loading state
    toast.loading('Copying Gemini prompt...', { id: 'gemini-export' });

    // Prepare export data
    const exportData = {
      companyName: user?.user_metadata?.company_name || 'Your Company',
      productName: 'ICP Analysis',
      productDescription: undefined,
      targetMarket: undefined,
      personas: personas,
      generatedAt: new Date().toISOString()
    };

    // Export Gemini Prompt
    const result = await exportToGeminiPrompt(exportData);

    // Handle result
    if (result.success) {
      toast.success('Gemini prompt copied! Paste into Gemini to extend your research.', { id: 'gemini-export' });
      setShowExportModal(false);

      // Track export action
      if (trackAction?.mutate) {
        trackAction.mutate({
          customerId: user.id,
          action: 'export_gemini_prompt',
          metadata: { personaCount: personas.length }
        });
      }
    } else {
      toast.error(result.error || 'Failed to copy Gemini prompt. Please try again.', { id: 'gemini-export' });
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setLoading(false);
    }
  }

  return (
    <EnterpriseNavigationV2>
      <div className="min-h-screen py-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="container-wide">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => window.history.back()}
              className="btn btn-secondary"
              style={{ minWidth: 'auto', padding: 'var(--space-2)' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="heading-1">Ideal Customer Profile (ICP)</h1>
          </div>
          <p className="body-large text-text-muted">
            Rate any company 1-100 for sales fit in 30 seconds
          </p>
          <p className="body text-text-secondary mt-2">
            <strong>When to use:</strong> Before reaching out to new prospects
          </p>
        </div>

        <div className="mb-8">
          <div className="flex gap-3 flex-wrap">
            {WIDGETS.map((widget) => {
              const IconComponent = widget.icon;
              const isActive = activeWidget === widget.id;
              const isAvailable = widget.available;
              
              return (
                <motion.div
                  key={widget.id}
                  whileHover={isAvailable ? { scale: 1.05, y: -2 } : {}}
                  whileTap={isAvailable ? { scale: 0.95 } : {}}
                >
                  <button
                    onClick={() => handleWidgetChange(widget.id)}
                    disabled={!isAvailable}
                    data-widget-id={widget.id}
                    aria-label={`${widget.title} - ${widget.description}${!isAvailable ? ' (Coming Soon)' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-disabled={!isAvailable}
                    className={`
                      btn min-w-full sm:min-w-[180px]
                      ${isActive
                        ? 'btn-primary'
                        : isAvailable
                        ? 'btn-secondary'
                        : 'btn-secondary opacity-50 cursor-not-allowed'
                      }
                    `}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>
                      {widget.title}
                    </span>
                    {!isAvailable && (
                      <span className="badge badge-secondary text-xs ml-2">
                        Coming Soon
                      </span>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Two-Column Layout: 30-35% Input, 65-70% Output (Expert Requirement) */}
        {/* Mobile: Single column, Desktop (md+): Two columns */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-[30fr_70fr] gap-6">
          {/* Left Column: Input & Configuration (30-35%) */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {leftColumnWidget && leftColumnWidget.available && leftColumnWidget.component && (
                <motion.div
                  key={leftColumnWidget.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <leftColumnWidget.component
                    className="w-full"
                    userId={user?.id}
                    icpData={icpData?.data}
                    isLoading={isLoading}
                    onExport={handleExport}
                    onRefresh={handleRefresh}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {leftColumnWidget && !leftColumnWidget.available && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-executive card-padding-lg text-center"
              >
                <leftColumnWidget.icon className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <h3 className="heading-3 mb-2">
                  {leftColumnWidget.title}
                </h3>
                <p className="body text-text-secondary mb-6">
                  {leftColumnWidget.description}
                </p>
                <div className="card-glass card-padding-md">
                  <p className="body-small" style={{ color: 'var(--color-primary)' }}>
                    🚧 This widget is currently under development and will be available soon.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Output & Visualization (65-70%) */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {rightColumnWidget && rightColumnWidget.available && rightColumnWidget.component && (
                <motion.div
                  key={rightColumnWidget.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <rightColumnWidget.component
                    className="w-full"
                    userId={user?.id}
                    icpData={icpData?.data}
                    isLoading={isLoading}
                    onExport={handleExport}
                    onRefresh={handleRefresh}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {rightColumnWidget && !rightColumnWidget.available && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-executive card-padding-lg text-center"
              >
                <rightColumnWidget.icon className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <h3 className="heading-3 mb-2">
                  {rightColumnWidget.title}
                </h3>
                <p className="body text-text-secondary mb-6">
                  {rightColumnWidget.description}
                </p>
                <div className="card-glass card-padding-md">
                  <p className="body-small" style={{ color: 'var(--color-primary)' }}>
                    🚧 This widget is currently under development and will be available soon.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <GlassButton
            variant="secondary"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </GlassButton>

          <GlassButton
            variant="primary"
            onClick={() => setShowExportModal(true)}
            glow
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export All
          </GlassButton>
        </div>
      </div>

      <GlassModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export ICP Analysis"
        size="lg"
      >
        <div>
          <FileDown className="w-16 h-16 mx-auto mb-6" style={{
            color: 'var(--color-primary)',
            filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))'
          }} />
          <h3 className="heading-2 mb-4 text-center">
            Choose Export Format
          </h3>
          <p className="body text-text-secondary mb-2 text-center">
            {!personas || personas.length === 0
              ? 'Generate your ICP first to enable exports'
              : `Export ${personas.length} buyer personas as ready-to-use sales materials`}
          </p>
          {personas && personas.length > 0 && (
            <p className="body-small text-text-muted mb-8 text-center">
              Create sales materials, AI research prompts, or spreadsheet data in one click
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* PDF Export - WORKING */}
            <button
              onClick={handlePDFExport}
              disabled={!personas || personas.length === 0 || isLoadingPersonas}
              aria-label={
                personas && personas.length > 0
                  ? `Export ${personas.length} buyer personas as PDF report`
                  : "Generate your ICP first to export PDF report"
              }
              aria-disabled={!personas || personas.length === 0 || isLoadingPersonas}
              className={`
                p-6 rounded-lg border-2 transition-all
                ${!personas || personas.length === 0 || isLoadingPersonas
                  ? 'opacity-50 cursor-not-allowed border-gray-700 bg-gray-900'
                  : 'border-blue-500 bg-blue-900/20 hover:bg-blue-900/40 hover:scale-105 cursor-pointer'
                }
              `}
            >
              <FileText className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
              <h4 className="heading-4 mb-2">
                PDF Report
              </h4>
              <p className="body-small text-text-secondary">
                Comprehensive ICP analysis document
              </p>
              {!personas || personas.length === 0 ? (
                <span className="text-sm text-yellow-500 mt-2 inline-block">
                  Generate ICP first
                </span>
              ) : (
                <span className="text-sm text-green-500 mt-2 inline-block">
                  ✓ Ready to export
                </span>
              )}
            </button>

            {/* Markdown Export - WORKING */}
            <button
              onClick={handleMarkdownExport}
              disabled={!personas || personas.length === 0 || isLoadingPersonas}
              aria-label={
                personas && personas.length > 0
                  ? `Copy ${personas.length} buyer personas as Markdown to clipboard for Notion`
                  : "Generate your ICP first to copy Markdown"
              }
              aria-disabled={!personas || personas.length === 0 || isLoadingPersonas}
              className={`
                p-6 rounded-lg border-2 transition-all
                ${!personas || personas.length === 0 || isLoadingPersonas
                  ? 'opacity-50 cursor-not-allowed border-gray-700 bg-gray-900'
                  : 'border-purple-500 bg-purple-900/20 hover:bg-purple-900/40 hover:scale-105 cursor-pointer'
                }
              `}
            >
              <FileCode className="w-8 h-8 mx-auto mb-3" style={{ color: personas?.length ? '#a855f7' : '#6b7280' }} />
              <h4 className="heading-4 mb-2">
                Copy to Notion
              </h4>
              <p className="body-small text-text-secondary">
                Markdown format for Notion, Obsidian
              </p>
              {!personas || personas.length === 0 ? (
                <span className="text-sm text-yellow-500 mt-2 inline-block">
                  Generate ICP first
                </span>
              ) : (
                <span className="text-sm text-green-500 mt-2 inline-block">
                  ✓ Ready to copy
                </span>
              )}
            </button>

            {/* CSV Export - WORKING */}
            <button
              onClick={handleCSVExport}
              disabled={!personas || personas.length === 0 || isLoadingPersonas}
              aria-label={
                personas && personas.length > 0
                  ? `Export ${personas.length} buyer personas as CSV spreadsheet`
                  : "Generate your ICP first to export CSV"
              }
              aria-disabled={!personas || personas.length === 0 || isLoadingPersonas}
              className={`
                p-6 rounded-lg border-2 transition-all
                ${!personas || personas.length === 0 || isLoadingPersonas
                  ? 'opacity-50 cursor-not-allowed border-gray-700 bg-gray-900'
                  : 'border-green-500 bg-green-900/20 hover:bg-green-900/40 hover:scale-105 cursor-pointer'
                }
              `}
            >
              <Table className="w-8 h-8 mx-auto mb-3" style={{ color: personas?.length ? '#10b981' : '#6b7280' }} />
              <h4 className="heading-4 mb-2">
                Export CSV
              </h4>
              <p className="body-small text-text-secondary">
                Spreadsheet with all persona details
              </p>
              {!personas || personas.length === 0 ? (
                <span className="text-sm text-yellow-500 mt-2 inline-block">
                  Generate ICP first
                </span>
              ) : (
                <span className="text-sm text-green-500 mt-2 inline-block">
                  ✓ Ready to download
                </span>
              )}
            </button>

            {/* ChatGPT Prompt - WORKING */}
            <button
              onClick={handleChatGPTExport}
              disabled={!personas || personas.length === 0 || isLoadingPersonas}
              aria-label={
                personas && personas.length > 0
                  ? `Copy ${personas.length} buyer personas as ChatGPT research prompt`
                  : "Generate your ICP first to copy ChatGPT prompt"
              }
              aria-disabled={!personas || personas.length === 0 || isLoadingPersonas}
              className={`
                p-6 rounded-lg border-2 transition-all
                ${!personas || personas.length === 0 || isLoadingPersonas
                  ? 'opacity-50 cursor-not-allowed border-gray-700 bg-gray-900'
                  : 'border-cyan-500 bg-cyan-900/20 hover:bg-cyan-900/40 hover:scale-105 cursor-pointer'
                }
              `}
            >
              <Zap className="w-8 h-8 mx-auto mb-3" style={{ color: personas?.length ? '#06b6d4' : '#6b7280' }} />
              <h4 className="heading-4 mb-2">
                ChatGPT Prompt
              </h4>
              <p className="body-small text-text-secondary">
                Extend research with ChatGPT
              </p>
              {!personas || personas.length === 0 ? (
                <span className="text-sm text-yellow-500 mt-2 inline-block">
                  Generate ICP first
                </span>
              ) : (
                <span className="text-sm text-green-500 mt-2 inline-block">
                  ✓ Ready to copy
                </span>
              )}
            </button>

            {/* Claude Prompt - WORKING */}
            <button
              onClick={handleClaudeExport}
              disabled={!personas || personas.length === 0 || isLoadingPersonas}
              aria-label={
                personas && personas.length > 0
                  ? `Copy ${personas.length} buyer personas as Claude research prompt`
                  : "Generate your ICP first to copy Claude prompt"
              }
              aria-disabled={!personas || personas.length === 0 || isLoadingPersonas}
              className={`
                p-6 rounded-lg border-2 transition-all
                ${!personas || personas.length === 0 || isLoadingPersonas
                  ? 'opacity-50 cursor-not-allowed border-gray-700 bg-gray-900'
                  : 'border-orange-500 bg-orange-900/20 hover:bg-orange-900/40 hover:scale-105 cursor-pointer'
                }
              `}
            >
              <Brain className="w-8 h-8 mx-auto mb-3" style={{ color: personas?.length ? '#f97316' : '#6b7280' }} />
              <h4 className="heading-4 mb-2">
                Claude Prompt
              </h4>
              <p className="body-small text-text-secondary">
                Extend research with Claude
              </p>
              {!personas || personas.length === 0 ? (
                <span className="text-sm text-yellow-500 mt-2 inline-block">
                  Generate ICP first
                </span>
              ) : (
                <span className="text-sm text-green-500 mt-2 inline-block">
                  ✓ Ready to copy
                </span>
              )}
            </button>

            {/* Gemini Prompt - WORKING */}
            <button
              onClick={handleGeminiExport}
              disabled={!personas || personas.length === 0 || isLoadingPersonas}
              aria-label={
                personas && personas.length > 0
                  ? `Copy ${personas.length} buyer personas as Gemini research prompt`
                  : "Generate your ICP first to copy Gemini prompt"
              }
              aria-disabled={!personas || personas.length === 0 || isLoadingPersonas}
              className={`
                p-6 rounded-lg border-2 transition-all
                ${!personas || personas.length === 0 || isLoadingPersonas
                  ? 'opacity-50 cursor-not-allowed border-gray-700 bg-gray-900'
                  : 'border-indigo-500 bg-indigo-900/20 hover:bg-indigo-900/40 hover:scale-105 cursor-pointer'
                }
              `}
            >
              <Sparkles className="w-8 h-8 mx-auto mb-3" style={{ color: personas?.length ? '#6366f1' : '#6b7280' }} />
              <h4 className="heading-4 mb-2">
                Gemini Prompt
              </h4>
              <p className="body-small text-text-secondary">
                Extend research with Gemini
              </p>
              {!personas || personas.length === 0 ? (
                <span className="text-sm text-yellow-500 mt-2 inline-block">
                  Generate ICP first
                </span>
              ) : (
                <span className="text-sm text-green-500 mt-2 inline-block">
                  ✓ Ready to copy
                </span>
              )}
            </button>
          </div>
        </div>
      </GlassModal>
      </div>
    </EnterpriseNavigationV2>
  );
}