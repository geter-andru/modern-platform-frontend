'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, RefreshCw, Download, FileDown, FileCode, Table, Sparkles } from 'lucide-react';
import { Brain, Target, Users, FileText, Zap, BarChart3 } from 'lucide-react';
import { useRequireAuth } from '@/app/lib/auth';
import { useCustomer, useCustomerICP, useTrackAction } from '@/app/lib/hooks/useAPI';
import { usePersonasCache } from '@/app/lib/hooks/cache';
import { ModernSidebarLayout } from '../../src/shared/components/layout/ModernSidebarLayout';
import { GlassCard, GlassButton, GlassModal } from '../../src/shared/components/design-system';
import { exportICPToPDF } from '@/app/lib/utils/pdf-export';
import { exportToMarkdown, exportToCSV } from '@/app/lib/utils/data-export';
import { exportToChatGPTPrompt, exportToClaudePrompt, exportToGeminiPrompt } from '@/app/lib/utils/ai-prompt-export';
import toast from 'react-hot-toast';

// Import widget components
import ProductDetailsWidget from '../../src/features/icp-analysis/widgets/ProductDetailsWidget';
import ICPRatingSystemWidget from '../../src/features/icp-analysis/widgets/ICPRatingSystemWidget';
import BuyerPersonasWidget from '../../src/features/icp-analysis/widgets/BuyerPersonasWidget';
import MyICPOverviewWidget from '../../src/features/icp-analysis/widgets/MyICPOverviewWidget';
import RateCompanyWidget from '../../src/features/icp-analysis/widgets/RateCompanyWidget';
import TechnicalTranslationWidget from '../../src/features/icp-analysis/widgets/TechnicalTranslationWidget';

interface Widget {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  component?: React.ComponentType<any>
}

const WIDGETS: Widget[] = [
  {
    id: 'product-details',
    title: 'Product Details',
    description: 'Core ICP analysis workflow',
    icon: Brain,
    component: ProductDetailsWidget
  },
  {
    id: 'rating-system',
    title: 'ICP Rating System',
    description: 'Rate and evaluate ICP framework',
    icon: Target,
    component: ICPRatingSystemWidget
  },
  {
    id: 'personas',
    title: 'Buyer Personas',
    description: 'Generate buyer personas',
    icon: Users,
    component: BuyerPersonasWidget
  },
  {
    id: 'overview',
    title: 'My ICP Overview',
    description: 'Summary of your ICPs',
    icon: BarChart3,
    component: MyICPOverviewWidget
  },
  {
    id: 'rate-company',
    title: 'Rate a Company',
    description: 'Evaluate a company against your ICP',
    icon: FileText,
    component: RateCompanyWidget
  },
  {
    id: 'translator',
    title: 'Technical Translator',
    description: 'Translate technical features into business language',
    icon: Zap,
    component: TechnicalTranslationWidget
  }
]

export default function ICPRefactoredPage() {
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useRequireAuth();
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
      metadata: { page: 'icp_analysis_refactored' }
    });
  }, [user, authLoading]);

  // Handle URL parameters for widget selection
  useEffect(() => {
    const widget = searchParams.get('widget');
    if (widget && WIDGETS.some(w => w.id === widget)) {
      setActiveWidget(widget);
    }
  }, [searchParams]);

  const { data: icpData, isLoading } = useCustomerICP(user?.id);
  const { data: customerData } = useCustomer(user?.id);

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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentWidget = WIDGETS.find(w => w.id === activeWidget);

  const handleWidgetChange = (widgetId: string) => {
    setActiveWidget(widgetId);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('widget', widgetId);
    window.history.pushState({}, '', url.toString());
  }

  const handleExport = (data: any) => {
    console.log('Exporting data:', data);
  }

  const handlePDFExport = async () => {
    if (!personas || personas.length === 0) {
      toast.error('No personas available to export. Please generate your ICP first.');
      return;
    }

    toast.loading('Generating PDF...', { id: 'pdf-export' });

    const exportData = {
      companyName: user?.user_metadata?.company_name || 'Your Company',
      productName: 'ICP Analysis',
      personas: personas,
      generatedAt: new Date().toISOString()
    };

    const isFreeTier = true;
    const brandAssets = (customerData?.data as any)?.brand_assets || null;

    const result = await exportICPToPDF(exportData, {
      includeFreeWatermark: isFreeTier,
      companyName: exportData.companyName,
      productName: exportData.productName,
      brandAssets: brandAssets || undefined
    });

    if (result.success) {
      toast.success('PDF exported successfully!', { id: 'pdf-export' });
      setShowExportModal(false);

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
    if (!personas || personas.length === 0) {
      toast.error('No personas available to export. Please generate your ICP first.');
      return;
    }

    toast.loading('Copying to clipboard...', { id: 'markdown-export' });

    const exportData = {
      companyName: user?.user_metadata?.company_name || 'Your Company',
      productName: 'ICP Analysis',
      personas: personas,
      generatedAt: new Date().toISOString()
    };

    const result = await exportToMarkdown(exportData);

    if (result.success) {
      toast.success('Markdown copied to clipboard! Paste into Notion.', { id: 'markdown-export' });
      setShowExportModal(false);

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
    if (!personas || personas.length === 0) {
      toast.error('No personas available to export. Please generate your ICP first.');
      return;
    }

    toast.loading('Generating CSV...', { id: 'csv-export' });

    const exportData = {
      companyName: user?.user_metadata?.company_name || 'Your Company',
      productName: 'ICP Analysis',
      personas: personas,
      generatedAt: new Date().toISOString()
    };

    const result = exportToCSV(exportData);

    if (result.success) {
      toast.success('CSV downloaded successfully!', { id: 'csv-export' });
      setShowExportModal(false);

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
    if (!personas || personas.length === 0) {
      toast.error('No personas available to export. Please generate your ICP first.');
      return;
    }

    toast.loading('Copying ChatGPT prompt...', { id: 'chatgpt-export' });

    const exportData = {
      companyName: user?.user_metadata?.company_name || 'Your Company',
      productName: 'ICP Analysis',
      productDescription: undefined,
      targetMarket: undefined,
      personas: personas,
      generatedAt: new Date().toISOString()
    };

    const result = await exportToChatGPTPrompt(exportData);

    if (result.success) {
      toast.success('ChatGPT prompt copied! Paste into ChatGPT to extend your research.', { id: 'chatgpt-export' });
      setShowExportModal(false);

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
    if (!personas || personas.length === 0) {
      toast.error('No personas available to export. Please generate your ICP first.');
      return;
    }

    toast.loading('Copying Claude prompt...', { id: 'claude-export' });

    const exportData = {
      companyName: user?.user_metadata?.company_name || 'Your Company',
      productName: 'ICP Analysis',
      productDescription: undefined,
      targetMarket: undefined,
      personas: personas,
      generatedAt: new Date().toISOString()
    };

    const result = await exportToClaudePrompt(exportData);

    if (result.success) {
      toast.success('Claude prompt copied! Paste into Claude to extend your research.', { id: 'claude-export' });
      setShowExportModal(false);

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
    if (!personas || personas.length === 0) {
      toast.error('No personas available to export. Please generate your ICP first.');
      return;
    }

    toast.loading('Copying Gemini prompt...', { id: 'gemini-export' });

    const exportData = {
      companyName: user?.user_metadata?.company_name || 'Your Company',
      productName: 'ICP Analysis',
      productDescription: undefined,
      targetMarket: undefined,
      personas: personas,
      generatedAt: new Date().toISOString()
    };

    const result = await exportToGeminiPrompt(exportData);

    if (result.success) {
      toast.success('Gemini prompt copied! Paste into Gemini to extend your research.', { id: 'gemini-export' });
      setShowExportModal(false);

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
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModernSidebarLayout>
      <div className="min-h-screen py-8 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-3xl font-bold text-white">Ideal Customer Profile (ICP) - Refactored</h1>
            </div>
            <p className="text-base text-gray-400">
              Rate any company 1-100 for sales fit in 30 seconds
            </p>
            <p className="text-sm text-gray-400 mt-2">
              <strong>When to use:</strong> Before reaching out to new prospects
            </p>
          </div>

          {/* Tab Navigation - Assets-App Pattern */}
          <div className="mb-8">
            <div className="flex gap-3 flex-wrap">
              {WIDGETS.map((widget) => {
                const IconComponent = widget.icon;
                const isActive = activeWidget === widget.id;
                const isAvailable = !!widget.component;

                return (
                  <button
                    key={widget.id}
                    onClick={() => handleWidgetChange(widget.id)}
                    disabled={!isAvailable}
                    data-widget-id={widget.id}
                    aria-label={`${widget.title} - ${widget.description}${!isAvailable ? ' (Coming Soon)' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-disabled={!isAvailable}
                    className={`
                      flex items-center gap-2 min-w-full sm:min-w-[180px] px-4 py-2 rounded-lg font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : isAvailable
                        ? 'bg-gray-700 hover:bg-gray-600 text-white hover:scale-105 hover:-translate-y-0.5 active:scale-95'
                        : 'bg-gray-700 text-white opacity-50 cursor-not-allowed'
                      }
                    `}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>
                      {widget.title}
                    </span>
                    {!isAvailable && (
                      <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs ml-2">
                        Coming Soon
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Single-Column Content Area - Direct Conditional Rendering */}
          <div className="mb-8">
            {/* Product Details Widget */}
            {activeWidget === 'product-details' && currentWidget?.component && (
              <ProductDetailsWidget className="w-full" />
            )}

            {/* ICP Rating System Widget */}
            {activeWidget === 'rating-system' && currentWidget?.component && (
              <ICPRatingSystemWidget
                className="w-full"
              />
            )}

            {/* Buyer Personas Widget */}
            {activeWidget === 'personas' && currentWidget?.component && (
              <BuyerPersonasWidget
                className="w-full"
                userId={user?.id}
                onExport={handleExport}
              />
            )}

            {/* My ICP Overview Widget */}
            {activeWidget === 'overview' && currentWidget?.component && (
              <MyICPOverviewWidget
                className="w-full"
                userId={user?.id}
                icpData={icpData?.data}
                personas={personas}
                onExport={handleExport}
                onRefresh={handleRefresh}
              />
            )}

            {/* Rate Company Widget */}
            {activeWidget === 'rate-company' && currentWidget?.component && (
              <RateCompanyWidget
                className="w-full"
                userId={user?.id}
                onExport={handleExport}
              />
            )}

            {/* Technical Translator Widget */}
            {activeWidget === 'translator' && currentWidget?.component && (
              <TechnicalTranslationWidget className="w-full" />
            )}
          </div>

          {/* Action Buttons */}
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

        {/* Export Modal - Preserved from Original */}
        <GlassModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="Export ICP Analysis"
          size="lg"
        >
          <div>
            <FileDown className="w-16 h-16 mx-auto mb-6 text-blue-500" style={{
              filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))'
            }} />
            <h3 className="text-2xl font-semibold text-white mb-4 text-center">
              Choose Export Format
            </h3>
            <p className="text-sm text-gray-400 mb-2 text-center">
              {!personas || personas.length === 0
                ? 'Generate your ICP first to enable exports'
                : `Export ${personas.length} buyer personas as ready-to-use sales materials`}
            </p>
            {personas && personas.length > 0 && (
              <p className="text-xs text-gray-500 mb-8 text-center">
                Create sales materials, AI research prompts, or spreadsheet data in one click
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* PDF Export */}
              <button
                onClick={handlePDFExport}
                disabled={!personas || personas.length === 0 || isLoadingPersonas}
                aria-label={
                  personas && personas.length > 0
                    ? `Export ${personas.length} buyer personas as PDF report`
                    : "Generate your ICP first to export PDF report"
                }
                className={`
                  p-6 rounded-lg border-2 transition-all
                  ${!personas || personas.length === 0 || isLoadingPersonas
                    ? 'opacity-50 cursor-not-allowed border-gray-700 bg-gray-900'
                    : 'border-blue-500 bg-blue-900/20 hover:bg-blue-900/40 hover:scale-105 cursor-pointer'
                  }
                `}
              >
                <FileText className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                <h4 className="text-base font-semibold text-white mb-2">PDF Report</h4>
                <p className="text-xs text-gray-400">
                  Comprehensive ICP analysis document
                </p>
                {!personas || personas.length === 0 ? (
                  <span className="text-xs text-yellow-500 mt-2 inline-block">
                    Generate ICP first
                  </span>
                ) : (
                  <span className="text-xs text-green-500 mt-2 inline-block">
                    ✓ Ready to export
                  </span>
                )}
              </button>

              {/* Markdown Export */}
              <button
                onClick={handleMarkdownExport}
                disabled={!personas || personas.length === 0 || isLoadingPersonas}
                className={`
                  p-6 rounded-lg border-2 transition-all
                  ${!personas || personas.length === 0 || isLoadingPersonas
                    ? 'opacity-50 cursor-not-allowed border-gray-700 bg-gray-900'
                    : 'border-purple-500 bg-purple-900/20 hover:bg-purple-900/40 hover:scale-105 cursor-pointer'
                  }
                `}
              >
                <FileCode className={`w-8 h-8 mx-auto mb-3 ${personas?.length ? 'text-purple-500' : 'text-gray-500'}`} />
                <h4 className="text-base font-semibold text-white mb-2">Copy to Notion</h4>
                <p className="text-xs text-gray-400">
                  Markdown format for Notion, Obsidian
                </p>
                {!personas || personas.length === 0 ? (
                  <span className="text-xs text-yellow-500 mt-2 inline-block">
                    Generate ICP first
                  </span>
                ) : (
                  <span className="text-xs text-green-500 mt-2 inline-block">
                    ✓ Ready to copy
                  </span>
                )}
              </button>

              {/* CSV Export */}
              <button
                onClick={handleCSVExport}
                disabled={!personas || personas.length === 0 || isLoadingPersonas}
                className={`
                  p-6 rounded-lg border-2 transition-all
                  ${!personas || personas.length === 0 || isLoadingPersonas
                    ? 'opacity-50 cursor-not-allowed border-gray-700 bg-gray-900'
                    : 'border-green-500 bg-green-900/20 hover:bg-green-900/40 hover:scale-105 cursor-pointer'
                  }
                `}
              >
                <Table className={`w-8 h-8 mx-auto mb-3 ${personas?.length ? 'text-green-500' : 'text-gray-500'}`} />
                <h4 className="text-base font-semibold text-white mb-2">Export CSV</h4>
                <p className="text-xs text-gray-400">
                  Spreadsheet with all persona details
                </p>
                {!personas || personas.length === 0 ? (
                  <span className="text-xs text-yellow-500 mt-2 inline-block">
                    Generate ICP first
                  </span>
                ) : (
                  <span className="text-xs text-green-500 mt-2 inline-block">
                    ✓ Ready to download
                  </span>
                )}
              </button>

              {/* ChatGPT Prompt */}
              <button
                onClick={handleChatGPTExport}
                disabled={!personas || personas.length === 0 || isLoadingPersonas}
                className={`
                  p-6 rounded-lg border-2 transition-all
                  ${!personas || personas.length === 0 || isLoadingPersonas
                    ? 'opacity-50 cursor-not-allowed border-gray-700 bg-gray-900'
                    : 'border-cyan-500 bg-cyan-900/20 hover:bg-cyan-900/40 hover:scale-105 cursor-pointer'
                  }
                `}
              >
                <Zap className={`w-8 h-8 mx-auto mb-3 ${personas?.length ? 'text-cyan-500' : 'text-gray-500'}`} />
                <h4 className="text-base font-semibold text-white mb-2">ChatGPT Prompt</h4>
                <p className="text-xs text-gray-400">
                  Extend research with ChatGPT
                </p>
                {!personas || personas.length === 0 ? (
                  <span className="text-xs text-yellow-500 mt-2 inline-block">
                    Generate ICP first
                  </span>
                ) : (
                  <span className="text-xs text-green-500 mt-2 inline-block">
                    ✓ Ready to copy
                  </span>
                )}
              </button>

              {/* Claude Prompt */}
              <button
                onClick={handleClaudeExport}
                disabled={!personas || personas.length === 0 || isLoadingPersonas}
                className={`
                  p-6 rounded-lg border-2 transition-all
                  ${!personas || personas.length === 0 || isLoadingPersonas
                    ? 'opacity-50 cursor-not-allowed border-gray-700 bg-gray-900'
                    : 'border-orange-500 bg-orange-900/20 hover:bg-orange-900/40 hover:scale-105 cursor-pointer'
                  }
                `}
              >
                <Brain className={`w-8 h-8 mx-auto mb-3 ${personas?.length ? 'text-orange-500' : 'text-gray-500'}`} />
                <h4 className="text-base font-semibold text-white mb-2">Claude Prompt</h4>
                <p className="text-xs text-gray-400">
                  Extend research with Claude
                </p>
                {!personas || personas.length === 0 ? (
                  <span className="text-xs text-yellow-500 mt-2 inline-block">
                    Generate ICP first
                  </span>
                ) : (
                  <span className="text-xs text-green-500 mt-2 inline-block">
                    ✓ Ready to copy
                  </span>
                )}
              </button>

              {/* Gemini Prompt */}
              <button
                onClick={handleGeminiExport}
                disabled={!personas || personas.length === 0 || isLoadingPersonas}
                className={`
                  p-6 rounded-lg border-2 transition-all
                  ${!personas || personas.length === 0 || isLoadingPersonas
                    ? 'opacity-50 cursor-not-allowed border-gray-700 bg-gray-900'
                    : 'border-indigo-500 bg-indigo-900/20 hover:bg-indigo-900/40 hover:scale-105 cursor-pointer'
                  }
                `}
              >
                <Sparkles className={`w-8 h-8 mx-auto mb-3 ${personas?.length ? 'text-indigo-500' : 'text-gray-500'}`} />
                <h4 className="text-base font-semibold text-white mb-2">Gemini Prompt</h4>
                <p className="text-xs text-gray-400">
                  Extend research with Gemini
                </p>
                {!personas || personas.length === 0 ? (
                  <span className="text-xs text-yellow-500 mt-2 inline-block">
                    Generate ICP first
                  </span>
                ) : (
                  <span className="text-xs text-green-500 mt-2 inline-block">
                    ✓ Ready to copy
                  </span>
                )}
              </button>
            </div>
          </div>
        </GlassModal>
      </div>
    </ModernSidebarLayout>
  );
}
