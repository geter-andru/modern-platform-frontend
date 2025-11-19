'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRequireAuth, useRequirePayment } from '@/app/lib/auth';
import { useCustomer, useCustomerICP, useTrackAction } from '@/app/lib/hooks/useAPI';
import { usePersonasCache } from '@/app/lib/hooks/cache';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Info,
  Lightbulb,
  Zap,
  Users,
  Download,
  FileDown,
  FileCode,
  Table,
  FileText,
  Brain,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

// Import layout components
import { ModernSidebarLayout } from '../../src/shared/components/layout/ModernSidebarLayout';

// Import design system components
import { GlassCard, GlassButton, GlassModal } from '../../src/shared/components/design-system';

// Import export utilities
import { exportICPToPDF } from '@/app/lib/utils/pdf-export';
import { exportToMarkdown, exportToCSV } from '@/app/lib/utils/data-export';
import { exportToChatGPTPrompt, exportToClaudePrompt, exportToGeminiPrompt } from '@/app/lib/utils/ai-prompt-export';

// Import widget components
import ProductDetailsWidget from '@/src/features/icp-analysis/widgets/ProductDetailsWidget';
import ICPFrameworkConfiguration from '@/src/features/icp-analysis/widgets/ICPFrameworkConfiguration';
import BuyerPersonasWidget from '@/src/features/icp-analysis/widgets/BuyerPersonasWidget';
import RateCompanyWidget from '@/src/features/icp-analysis/widgets/RateCompanyWidget';
import TechnicalTranslationWidget from '@/src/features/icp-analysis/widgets/TechnicalTranslationWidget';
import MyICPOverviewWidget from '../../src/features/icp-analysis/widgets/MyICPOverviewWidget';

interface Section {
  id: string;
  label: string;
  description: string;
}

const SECTIONS: Section[] = [
  {
    id: 'overview',
    label: 'My ICP Overview',
    description: 'Summary dashboard of all ICPs'
  },
  {
    id: 'framework',
    label: 'Scoring Framework',
    description: 'Define and manage ICP scoring criteria'
  },
  {
    id: 'personas',
    label: 'Buyer Personas',
    description: 'Understand target buyer profiles'
  },
  {
    id: 'rate',
    label: 'Rate Company',
    description: 'Evaluate company fit against ICP'
  },
  {
    id: 'generate',
    label: 'Generate Resources',
    description: 'Create ICP-based assets'
  }
];

export default function ICPv3Page() {
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useRequireAuth();
  const { hasPaid, loading: paymentLoading } = useRequirePayment();
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const trackAction = useTrackAction();

  // Track page view
  useEffect(() => {
    if (authLoading || !user) return;

    trackAction.mutate({
      customerId: user.id,
      action: 'page_view',
      metadata: { page: 'icp_v3' }
    });
  }, [user, authLoading]);

  // Handle URL parameters for section selection
  useEffect(() => {
    const section = searchParams.get('section');
    if (section && SECTIONS.some(s => s.id === section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Get customer and ICP data
  const { data: icpData, isLoading: isLoadingICP } = useCustomerICP(user?.id);
  const { data: customerData, isLoading: isLoadingCustomer } = useCustomer(user?.id);

  // Get personas data for export
  const {
    personas,
    isLoadingPersonas,
  } = usePersonasCache({
    customerId: user?.id,
    enabled: !!user?.id
  });

  // Handle authentication and payment loading
  if (authLoading || paymentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a2332]">
        <div className="text-sm text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Export Handlers
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
      trackAction.mutate({
        customerId: user.id,
        action: 'export_pdf',
        metadata: { personaCount: personas.length }
      });
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
      trackAction.mutate({
        customerId: user.id,
        action: 'export_markdown',
        metadata: { personaCount: personas.length }
      });
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
      trackAction.mutate({
        customerId: user.id,
        action: 'export_csv',
        metadata: { personaCount: personas.length }
      });
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
      trackAction.mutate({
        customerId: user.id,
        action: 'export_chatgpt_prompt',
        metadata: { personaCount: personas.length }
      });
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
      trackAction.mutate({
        customerId: user.id,
        action: 'export_claude_prompt',
        metadata: { personaCount: personas.length }
      });
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
      trackAction.mutate({
        customerId: user.id,
        action: 'export_gemini_prompt',
        metadata: { personaCount: personas.length }
      });
    } else {
      toast.error(result.error || 'Failed to copy Gemini prompt. Please try again.', { id: 'gemini-export' });
    }
  };

  const trackSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);

    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('section', sectionId);
    window.history.pushState({}, '', url.toString());

    // Track section navigation
    trackAction.mutate({
      customerId: user.id,
      action: 'section_navigation',
      metadata: { section_id: sectionId }
    });
  };

  return (
    <ModernSidebarLayout>
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">ICP Analysis Tool</h1>
          <p className="text-gray-300">Systematic buyer understanding and targeting framework</p>
        </div>

        {/* Export Button */}
        <GlassButton
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </GlassButton>
      </div>

      {/* Milestone Guidance Banner */}
      <div className="bg-[#1e3a5f] border border-blue-800/30 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Info className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Foundation Stage Guidance</h3>
            <p className="text-sm text-gray-300 mb-3">
              Establish systematic buyer understanding frameworks
            </p>
            <a
              href="#"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Start with clear buyer personas and pain point identification →
            </a>
          </div>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => trackSectionClick(section.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeSection === section.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Main Content - Section-based rendering */}
      <div className="space-y-6">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <MyICPOverviewWidget className="w-full" />
          </div>
        )}

        {/* Framework Section */}
        {activeSection === 'framework' && (
          <div className="space-y-6">
            <ICPFrameworkConfiguration className="w-full" />
          </div>
        )}

        {/* Personas Section */}
        {activeSection === 'personas' && (
          <div className="space-y-6">
            <BuyerPersonasWidget className="w-full" />
          </div>
        )}

        {/* Rate Section */}
        {activeSection === 'rate' && (
          <div className="space-y-6">
            <RateCompanyWidget className="w-full" />
          </div>
        )}

        {/* Generate Section */}
        {activeSection === 'generate' && (
          <div className="space-y-6">
            <ProductDetailsWidget className="w-full" />
          </div>
        )}
      </div>

      {/* Intelligence Widgets Section - Always visible below main content */}
      <div className="mt-8 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Customer Intelligence Tools</h2>
            <p className="text-gray-400 text-sm">Transform insights into actionable strategies</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Stakeholder Arsenal Widget */}
          <div className="bg-[#1a2332] border border-blue-800/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Stakeholder Arsenal</h3>
                <p className="text-gray-400 text-sm">Role-specific preparation for customer calls</p>
              </div>
            </div>
            <TechnicalTranslationWidget />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {(isLoadingICP || isLoadingCustomer) && (
        <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-300">Loading data...</span>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <GlassModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export ICP Analysis"
        size="lg"
      >
        <div>
          <FileDown className="w-16 h-16 mx-auto mb-6 text-blue-400" style={{
            filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))'
          }} />
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            Choose Export Format
          </h3>
          <p className="text-sm text-gray-300 mb-2 text-center">
            {!personas || personas.length === 0
              ? 'Generate your ICP first to enable exports'
              : `Export ${personas.length} buyer personas as ready-to-use sales materials`}
          </p>
          {personas && personas.length > 0 && (
            <p className="text-xs text-gray-400 mb-8 text-center">
              Create sales materials, AI research prompts, or spreadsheet data in one click
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* PDF Export */}
            <button
              onClick={handlePDFExport}
              disabled={!personas || personas.length === 0 || isLoadingPersonas}
              className={`
                p-6 rounded-lg border-2 transition-all
                ${!personas || personas.length === 0 || isLoadingPersonas
                  ? 'opacity-50 cursor-not-allowed border-gray-700 bg-gray-900'
                  : 'border-blue-500 bg-blue-900/20 hover:bg-blue-900/40 hover:scale-105 cursor-pointer'
                }
              `}
            >
              <FileText className="w-8 h-8 mx-auto mb-3 text-blue-400" />
              <h4 className="font-semibold text-white mb-2">PDF Report</h4>
              <p className="text-sm text-gray-400">Comprehensive ICP analysis document</p>
              {!personas || personas.length === 0 ? (
                <span className="text-xs text-yellow-500 mt-2 inline-block">Generate ICP first</span>
              ) : (
                <span className="text-xs text-green-500 mt-2 inline-block">✓ Ready to export</span>
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
              <FileCode className="w-8 h-8 mx-auto mb-3" style={{ color: personas?.length ? '#a855f7' : '#6b7280' }} />
              <h4 className="font-semibold text-white mb-2">Copy to Notion</h4>
              <p className="text-sm text-gray-400">Markdown format for Notion, Obsidian</p>
              {!personas || personas.length === 0 ? (
                <span className="text-xs text-yellow-500 mt-2 inline-block">Generate ICP first</span>
              ) : (
                <span className="text-xs text-green-500 mt-2 inline-block">✓ Ready to copy</span>
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
              <Table className="w-8 h-8 mx-auto mb-3" style={{ color: personas?.length ? '#10b981' : '#6b7280' }} />
              <h4 className="font-semibold text-white mb-2">Export CSV</h4>
              <p className="text-sm text-gray-400">Spreadsheet with all persona details</p>
              {!personas || personas.length === 0 ? (
                <span className="text-xs text-yellow-500 mt-2 inline-block">Generate ICP first</span>
              ) : (
                <span className="text-xs text-green-500 mt-2 inline-block">✓ Ready to download</span>
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
              <Zap className="w-8 h-8 mx-auto mb-3" style={{ color: personas?.length ? '#06b6d4' : '#6b7280' }} />
              <h4 className="font-semibold text-white mb-2">ChatGPT Prompt</h4>
              <p className="text-sm text-gray-400">Extend research with ChatGPT</p>
              {!personas || personas.length === 0 ? (
                <span className="text-xs text-yellow-500 mt-2 inline-block">Generate ICP first</span>
              ) : (
                <span className="text-xs text-green-500 mt-2 inline-block">✓ Ready to copy</span>
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
              <Brain className="w-8 h-8 mx-auto mb-3" style={{ color: personas?.length ? '#f97316' : '#6b7280' }} />
              <h4 className="font-semibold text-white mb-2">Claude Prompt</h4>
              <p className="text-sm text-gray-400">Extend research with Claude</p>
              {!personas || personas.length === 0 ? (
                <span className="text-xs text-yellow-500 mt-2 inline-block">Generate ICP first</span>
              ) : (
                <span className="text-xs text-green-500 mt-2 inline-block">✓ Ready to copy</span>
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
              <Sparkles className="w-8 h-8 mx-auto mb-3" style={{ color: personas?.length ? '#6366f1' : '#6b7280' }} />
              <h4 className="font-semibold text-white mb-2">Gemini Prompt</h4>
              <p className="text-sm text-gray-400">Extend research with Gemini</p>
              {!personas || personas.length === 0 ? (
                <span className="text-xs text-yellow-500 mt-2 inline-block">Generate ICP first</span>
              ) : (
                <span className="text-xs text-green-500 mt-2 inline-block">✓ Ready to copy</span>
              )}
            </button>
          </div>
        </div>
      </GlassModal>
    </ModernSidebarLayout>
  );
}
