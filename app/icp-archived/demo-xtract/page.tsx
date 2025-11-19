'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Download, FileText, Users, BarChart3, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ModernSidebarLayout } from '../../../src/shared/components/layout/ModernSidebarLayout';
import BuyerPersonasWidget from '../../../src/features/icp-analysis/widgets/BuyerPersonasWidget';
import MyICPOverviewWidget from '../../../src/features/icp-analysis/widgets/MyICPOverviewWidget';
import { exportICPToPDF } from '@/app/lib/utils/pdf-export';
import { exportToMarkdown, exportToCSV } from '@/app/lib/utils/data-export';
import toast, { Toaster } from 'react-hot-toast';
import demoData from '../../../data/demo-icp-devtool.json';
import DemoGenerationModal from './components/DemoGenerationModal';
import '../../../src/shared/styles/component-patterns.css';
import { BRAND_IDENTITY } from '@/app/lib/constants/brand-identity';
import { StaggeredItem } from '../../../src/shared/utils/staggered-entrance';
import { XtractButton } from '../../../src/shared/components/ui/XtractButton';
import { XtractCard } from '../../../src/shared/components/ui/XtractCard';
import { XtractBadge } from '../../../src/shared/components/ui/XtractBadge';

export default function ICPDemoXtractPage() {
  const [activeTab, setActiveTab] = useState<'personas' | 'overview'>('personas');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showGenerationModal, setShowGenerationModal] = useState(false);

  // All handlers remain unchanged - only visual layer changes
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

  return (
    <ModernSidebarLayout>
      <Toaster position="top-right" />
      <div className="min-h-screen" style={{
        background: 'var(--bg-primary)',
        paddingTop: 'var(--space-20)',
        paddingBottom: 'var(--space-20)'
      }}>
        <div className="container-wide">
          {/* Demo Badge Header - XTRACT DESIGN */}
          <StaggeredItem
            delay={0}
            animation="lift"
            style={{ marginBottom: 'var(--space-16)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <XtractBadge variant="primary" size="md" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Demo Mode
                  </XtractBadge>
                  <h1 className="text-hero">Generate Your ICP in 3 Minutes</h1>
                </div>
                <div className="flex items-center gap-2 text-body-sm text-text-muted pl-1">
                  <span>Built by {BRAND_IDENTITY.FOUNDER.NAME}, {BRAND_IDENTITY.FOUNDER.BIO_SHORT}</span>
                  <span className="text-text-subtle">•</span>
                  <span>Powered by advanced AI (sub-3s ICP generation)</span>
                </div>
              </div>
              <div className="flex gap-3">
                <XtractButton
                  onClick={() => setShowGenerationModal(true)}
                  variant="primary"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Live ICP
                </XtractButton>
                <XtractButton
                  href="/signup"
                  variant="secondary"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  Sign Up Free
                  <ArrowRight className="w-4 h-4" />
                </XtractButton>
              </div>
            </div>

            <p className="text-body-lg text-text-muted max-w-3xl">
              See how Andru generates detailed buyer personas, pain points, and sales plays for B2B SaaS. Complete analysis in under 3 minutes.
            </p>
          </StaggeredItem>

          {/* Product Info Card - XTRACT DESIGN */}
          <StaggeredItem
            delay={0.2}
            animation="slide"
            className="mb-8"
          >
            <XtractBadge variant="primary" size="md" className="mb-4">
              📋 Demo Example Product
            </XtractBadge>

            <XtractCard padding="lg" className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-section-heading mb-2">{demoData.product.productName}</h2>
                  <p className="text-body text-text-muted">{demoData.product.description}</p>
                </div>
                <div className="flex gap-2">
                  <XtractButton
                    onClick={() => setShowExportModal(true)}
                    variant="secondary"
                    size="md"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </XtractButton>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 rounded-xtract-md bg-surface-secondary/50">
                  <div className="text-body-sm text-text-muted mb-1">Distinguishing Feature</div>
                  <div className="text-body-sm">{demoData.product.distinguishingFeature}</div>
                </div>
                <div className="p-4 rounded-xtract-md bg-surface-secondary/50">
                  <div className="text-body-sm text-text-muted mb-1">Business Model</div>
                  <div className="text-body-sm">{demoData.product.businessModel}</div>
                </div>
                <div className="p-4 rounded-xtract-md bg-surface-secondary/50">
                  <div className="text-body-sm text-text-muted mb-1">Target Market</div>
                  <div className="text-body-sm">{demoData.product.targetMarket}</div>
                </div>
              </div>
            </XtractCard>
          </StaggeredItem>

          {/* Tab Navigation - XTRACT DESIGN */}
          <StaggeredItem
            delay={0.4}
            animation="slide"
            className="mb-8"
          >
            <div className="flex gap-3">
              <XtractButton
                onClick={() => setActiveTab('personas')}
                variant={activeTab === 'personas' ? 'primary' : 'secondary'}
                size="md"
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Buyer Personas ({demoData.personas.length})
              </XtractButton>
              <XtractButton
                onClick={() => setActiveTab('overview')}
                variant={activeTab === 'overview' ? 'primary' : 'secondary'}
                size="md"
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                ICP Overview
              </XtractButton>
            </div>
          </StaggeredItem>

          {/* Content Area - Widgets remain unchanged for now */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'personas' && (
              <BuyerPersonasWidget
                personas={demoData.personas}
                isDemo={true}
              />
            )}

            {activeTab === 'overview' && (
              <MyICPOverviewWidget
                icpData={demoData.icp}
                personas={demoData.personas}
                productName={demoData.product.productName}
                isDemo={true}
              />
            )}
          </motion.div>

          {/* CTA Footer - XTRACT DESIGN */}
          <StaggeredItem
            delay={0.6}
            animation="lift"
            className="mt-12"
          >
            <XtractCard padding="lg" className="text-center">
              <div style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                borderRadius: 'var(--radius-xtract-lg)',
                padding: 'var(--space-8)'
              }}>
                <h3 className="text-section-heading mb-3">Ready to Generate Your Own ICP?</h3>
                <p className="text-body-lg text-text-muted mb-6 max-w-2xl mx-auto">
                  Join 100+ founders using Andru to identify their best buyers. <strong>Free to start</strong>, no credit card required.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <XtractButton
                    href="/signup"
                    variant="primary"
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </XtractButton>
                  <Link
                    href="/pricing"
                    className="flex items-center gap-2 text-body text-text-secondary hover:text-text-primary transition-colors"
                    style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
                  >
                    View Pricing & Founding Member Benefits
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </XtractCard>
          </StaggeredItem>
        </div>
      </div>

      {/* Export Modal - XTRACT DESIGN */}
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
            onClick={(e) => e.stopPropagation()}
          >
            <XtractCard padding="lg" className="w-full max-w-md">
              <h3 className="text-subsection mb-4">Export Demo ICP</h3>
              <p className="text-body text-text-muted mb-6">
                See how Andru formats your ICP analysis. All exports include
                <strong> DEMO watermarks</strong>—sign up to save your real analysis
                and get watermark-free exports.
              </p>

              <div className="space-y-3">
                <XtractButton
                  onClick={handlePDFExport}
                  variant="primary"
                  size="md"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Export as PDF
                </XtractButton>
                <XtractButton
                  onClick={handleMarkdownExport}
                  variant="secondary"
                  size="md"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Export as Markdown
                </XtractButton>
                <XtractButton
                  onClick={handleCSVExport}
                  variant="secondary"
                  size="md"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Export as CSV
                </XtractButton>
              </div>

              <XtractButton
                onClick={() => setShowExportModal(false)}
                variant="ghost"
                size="md"
                className="w-full mt-4"
              >
                Cancel
              </XtractButton>

              <p className="text-body-sm text-text-muted text-center mt-6 pt-6 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                Founding members get unlimited exports in all formats.
                <Link href="/founding-members" className="text-blue-400 hover:underline ml-1">
                  Learn more →
                </Link>
              </p>
            </XtractCard>
          </motion.div>
        </motion.div>
      )}

      {/* Demo Generation Modal - unchanged, uses its own components */}
      <DemoGenerationModal
        isOpen={showGenerationModal}
        onClose={() => setShowGenerationModal(false)}
        onSuccess={(result) => {
          // Don't close modal - let modal show its success state
        }}
      />
    </ModernSidebarLayout>
  );
}
