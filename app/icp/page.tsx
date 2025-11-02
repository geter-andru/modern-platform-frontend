'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Download, FileDown } from 'lucide-react';
import { Brain, Target, Users, FileText, Zap, BarChart3 } from 'lucide-react';
import { useRequireAuth } from '@/app/lib/auth';
import { useCustomerICP, useTrackAction } from '@/app/lib/hooks/useAPI';
import { usePersonasCache } from '@/app/lib/hooks/cache';
import { EnterpriseNavigationV2 } from '../../src/shared/components/layout/EnterpriseNavigationV2';
import { GlassCard, GlassButton, GlassModal } from '../../src/shared/components/design-system';
import { exportICPToPDF } from '@/app/lib/utils/pdf-export';
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

  const handlePDFExport = () => {
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

    // Export PDF with error handling
    const result = exportICPToPDF(exportData, {
      includeFreeWatermark: isFreeTier,
      companyName: exportData.companyName,
      productName: exportData.productName
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
            Define and refine your perfect customer segments
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
                    className={`
                      btn min-w-[200px]
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
          <p className="body text-text-secondary mb-8 text-center">
            {!personas || personas.length === 0
              ? 'Generate your ICP first to enable exports'
              : `Export ${personas.length} buyer personas`}
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* PDF Export - WORKING */}
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
              <FileText className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
              <h4 className="heading-4 mb-2">
                PDF Report
              </h4>
              <p className="body-small text-text-secondary">
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

            {/* Markdown/CSV - Coming in Task 1.2 */}
            <GlassCard className="p-6 opacity-50">
              <FileDown className="w-8 h-8 mx-auto mb-3 text-gray-500" />
              <h4 className="heading-4 mb-2">
                Markdown / CSV
              </h4>
              <p className="body-small text-text-secondary">
                Copy to Notion or export to spreadsheet
              </p>
              <span className="text-xs text-gray-500 mt-2 inline-block">
                Coming in Phase 1.2
              </span>
            </GlassCard>

            {/* CRM Integration - Phase 4 */}
            <GlassCard className="p-6 opacity-50">
              <Users className="w-8 h-8 mx-auto mb-3 text-gray-500" />
              <h4 className="heading-4 mb-2">
                CRM Integration
              </h4>
              <p className="body-small text-text-secondary">
                HubSpot, Salesforce, Pipedrive
              </p>
              <span className="text-xs text-gray-500 mt-2 inline-block">
                Coming in Phase 4
              </span>
            </GlassCard>

            {/* AI Prompts - Phase 4 */}
            <GlassCard className="p-6 opacity-50">
              <Zap className="w-8 h-8 mx-auto mb-3 text-gray-500" />
              <h4 className="heading-4 mb-2">
                AI Prompts
              </h4>
              <p className="body-small text-text-secondary">
                Claude, ChatGPT, Perplexity
              </p>
              <span className="text-xs text-gray-500 mt-2 inline-block">
                Coming in Phase 4
              </span>
            </GlassCard>
          </div>
        </div>
      </GlassModal>
      </div>
    </EnterpriseNavigationV2>
  );
}