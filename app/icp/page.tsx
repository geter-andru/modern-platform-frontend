'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Download, FileDown } from 'lucide-react';
import { Brain, Target, Users, FileText, Zap, BarChart3 } from 'lucide-react';
import { useRequireAuth } from '@/app/lib/auth';
import { useCustomerICP, useTrackAction } from '@/app/lib/hooks/useAPI';
import { EnterpriseNavigationV2 } from '../../src/shared/components/layout/EnterpriseNavigationV2';
import { GlassCard, GlassButton, GlassModal } from '../../src/shared/components/design-system';

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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
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
                    className={`
                      px-6 py-4 rounded-2xl font-semibold transition-all duration-300 
                      flex items-center gap-3 min-w-[200px] justify-center
                      ${isActive
                        ? 'glass-card bg-white/10 border-brand-primary/50 text-white shadow-lg shadow-brand/30'
                        : isAvailable
                        ? 'glass-button text-white/80 hover:text-white hover:bg-white/15 hover:border-white/30'
                        : 'bg-white/5 text-white/40 cursor-not-allowed border-white/10'
                      }
                    `}
                    style={{
                      background: isActive 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : isAvailable 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      border: isActive 
                        ? '1px solid rgba(59, 130, 246, 0.5)' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: isActive 
                        ? '0 8px 25px rgba(59, 130, 246, 0.3)' 
                        : '0 4px 12px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium" style={{
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                    }}>
                      {widget.title}
                    </span>
                    {!isAvailable && (
                      <span className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded-lg ml-2">
                        Coming Soon
                      </span>
                    )}
                  </button>
                </motion.div>
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
              className="bg-background-secondary border border-surface rounded-xl p-12 text-center"
            >
              <currentWidget.icon className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {currentWidget.title}
              </h3>
              <p className="text-text-secondary mb-6">
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
        <div className="text-center">
          <FileDown className="w-16 h-16 text-brand-primary mx-auto mb-6" style={{
            filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))'
          }} />
          <h3 className="text-2xl font-bold text-white mb-4" style={{
            fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
            fontWeight: 'var(--font-weight-bold, 700)'
          }}>
            Export Options Coming Soon
          </h3>
          <p className="text-white/70 mb-8 text-lg" style={{
            fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
          }}>
            Advanced export functionality will be available in the next phase of development.
          </p>

          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
            <GlassCard className="p-6 hover glow">
              <h4 className="text-white font-semibold mb-3 text-lg" style={{
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}>
                PDF Report
              </h4>
              <p className="text-white/70 text-sm" style={{
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}>
                Comprehensive ICP analysis document
              </p>
            </GlassCard>
            
            <GlassCard className="p-6 hover glow">
              <h4 className="text-white font-semibold mb-3 text-lg" style={{
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}>
                CRM Integration
              </h4>
              <p className="text-white/70 text-sm" style={{
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}>
                HubSpot, Salesforce, Pipedrive
              </p>
            </GlassCard>
            
            <GlassCard className="p-6 hover glow">
              <h4 className="text-white font-semibold mb-3 text-lg" style={{
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}>
                AI Prompts
              </h4>
              <p className="text-white/70 text-sm" style={{
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}>
                Claude, ChatGPT, Perplexity
              </p>
            </GlassCard>
            
            <GlassCard className="p-6 hover glow">
              <h4 className="text-white font-semibold mb-3 text-lg" style={{
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}>
                Sales Tools
              </h4>
              <p className="text-white/70 text-sm" style={{
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}>
                Outreach, SalesLoft, Apollo
              </p>
            </GlassCard>
          </div>
        </div>
      </GlassModal>
      </div>
    </EnterpriseNavigationV2>
  );
}