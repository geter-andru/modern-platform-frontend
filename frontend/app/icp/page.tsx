'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Download, FileDown } from 'lucide-react';
import { Brain, Target, Users, FileText, Zap, BarChart3 } from 'lucide-react';
import { useSupabaseAuth } from '../../src/shared/hooks/useSupabaseAuth';
import { useCustomerICP, useTrackAction } from '@/app/lib/hooks/useAPI';
import { EnterpriseNavigationV2 } from '../../src/shared/components/layout/EnterpriseNavigationV2';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useSupabaseAuth();
  const [activeWidget, setActiveWidget] = useState('product-details');
  const [loading, setLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const trackAction = useTrackAction();
  
  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    if (!user) {
      router.push('/login');
      return;
    }

    // Track page view
    trackAction.mutate({
      customerId: user.id,
      action: 'page_view',
      metadata: { page: 'icp_analysis' }
    });
  }, [user, authLoading, router]); // trackAction is stable, doesn't need to be in deps

  // Handle URL parameters for widget selection
  useEffect(() => {
    const widget = searchParams.get('widget');
    if (widget && WIDGETS.some(w => w.id === widget)) {
      setActiveWidget(widget);
    }
  }, [searchParams]);

  const { data: icpData, isLoading } = useCustomerICP(user?.id);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
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
    // Handle export logic
  }

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
      <div className="min-h-screen bg-background-primary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => window.history.back()}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-text-primary">Ideal Customer Profile (ICP)</h1>
          </div>
          <p className="text-text-muted">
            Define and refine your perfect customer segments
          </p>
        </div>

        <div className="mb-8">
          <div className="flex gap-2 flex-wrap">
            {WIDGETS.map((widget) => {
              const IconComponent = widget.icon;
              const isActive = activeWidget === widget.id;
              const isAvailable = widget.available;
              
              return (
                <button
                  key={widget.id}
                  onClick={() => handleWidgetChange(widget.id)}
                  disabled={!isAvailable}
                  className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-brand-primary text-text-primary shadow-glow'
                      : isAvailable
                      ? 'bg-surface text-text-muted hover:text-text-primary hover:bg-surface-hover hover:shadow-medium'
                      : 'bg-surface text-text-disabled cursor-not-allowed'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {widget.title}
                  {!isAvailable && (
                    <span className="text-xs bg-background-elevated text-text-disabled px-2 py-1 rounded">
                      Coming Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <AnimatePresence mode="wait">
            {currentWidget && currentWidget.available && currentWidget.component && (
              <motion.div
                key={activeWidget}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <currentWidget.component
                  className="max-w-6xl mx-auto"
                  userId={user.id}
                  icpData={icpData?.data}
                  isLoading={isLoading}
                  onExport={handleExport}
                  onRefresh={handleRefresh}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {currentWidget && !currentWidget.available && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center"
            >
              <currentWidget.icon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {currentWidget.title}
              </h3>
              <p className="text-gray-400 mb-6">
                {currentWidget.description}
              </p>
              <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-blue-300 text-sm">
                  🚧 This widget is currently under development and will be available soon.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover text-text-primary rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-blue-700 text-text-primary rounded-lg transition-colors shadow-medium"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-elevated border border-surface rounded-xl max-w-2xl w-full shadow-large">
            <div className="px-6 py-4 border-b border-surface">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary">Export ICP Analysis</h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="text-center">
                <FileDown className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Export Options Coming Soon
                </h3>
                <p className="text-text-muted mb-6">
                  Advanced export functionality will be available in the next phase of development.
                </p>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="bg-surface rounded-lg p-4 hover:bg-surface-hover transition-colors">
                    <h4 className="text-text-primary font-medium mb-2">PDF Report</h4>
                    <p className="text-text-muted text-sm">Comprehensive ICP analysis document</p>
                  </div>
                  <div className="bg-surface rounded-lg p-4 hover:bg-surface-hover transition-colors">
                    <h4 className="text-text-primary font-medium mb-2">CRM Integration</h4>
                    <p className="text-text-muted text-sm">HubSpot, Salesforce, Pipedrive</p>
                  </div>
                  <div className="bg-surface rounded-lg p-4 hover:bg-surface-hover transition-colors">
                    <h4 className="text-text-primary font-medium mb-2">AI Prompts</h4>
                    <p className="text-text-muted text-sm">Claude, ChatGPT, Perplexity</p>
                  </div>
                  <div className="bg-surface rounded-lg p-4 hover:bg-surface-hover transition-colors">
                    <h4 className="text-text-primary font-medium mb-2">Sales Tools</h4>
                    <p className="text-text-muted text-sm">Outreach, SalesLoft, Apollo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </EnterpriseNavigationV2>
  );
}