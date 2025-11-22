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
import { useCompoundHover } from '../../../src/shared/utils/compound-hover';

export default function ICPDemoPage() {
  const [activeTab, setActiveTab] = useState<'personas' | 'overview'>('personas');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showGenerationModal, setShowGenerationModal] = useState(false);

  // Compound hover effects
  const primaryButtonHover = useCompoundHover('strong');
  const secondaryButtonHover = useCompoundHover('medium');
  const cardHover = useCompoundHover('subtle');

  const handlePDFExport = async () => {
    toast.loading('Generating demo PDF...', { id: 'pdf-export' });

    // Prepare export data from demo JSON
    const exportData = {
      companyName: 'Demo - ' + demoData.product.productName,
      productName: demoData.product.description,
      personas: demoData.personas,
      generatedAt: demoData.generatedAt
    };

    // Export with demo watermark (diagonal overlay on all pages)
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

    // Prepare export data from demo JSON
    const exportData = {
      companyName: 'Demo - ' + demoData.product.productName,
      productName: demoData.product.description,
      personas: demoData.personas,
      generatedAt: demoData.generatedAt
    };

    // Export with demo watermark
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

    // Prepare export data from demo JSON
    const exportData = {
      companyName: 'Demo - ' + demoData.product.productName,
      productName: demoData.product.description,
      personas: demoData.personas,
      generatedAt: demoData.generatedAt
    };

    // Export with demo watermark
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
      <div className="space-y-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Demo Badge Header */}
          <StaggeredItem
            delay={0}
            animation="lift"
            style={{ marginBottom: 'var(--space-16)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="body-small text-blue-400">Demo Mode</span>
                  </div>
                  <h1 className="heading-1">Generate Your ICP in 3 Minutes</h1>
                </div>
                <div className="flex items-center gap-2 body-small text-text-muted pl-1">
                  <span>Built by {BRAND_IDENTITY.FOUNDER.NAME}, {BRAND_IDENTITY.FOUNDER.BIO_SHORT}</span>
                  <span className="text-text-subtle">•</span>
                  <span>Powered by advanced AI (sub-3s ICP generation)</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowGenerationModal(true)}
                  onMouseEnter={primaryButtonHover.handleMouseEnter}
                  onMouseLeave={primaryButtonHover.handleMouseLeave}
                  className="btn btn-primary flex items-center gap-2"
                  style={{
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Live ICP
                </button>
                <Link
                  href="/signup"
                  onMouseEnter={secondaryButtonHover.handleMouseEnter}
                  onMouseLeave={secondaryButtonHover.handleMouseLeave}
                  className="flex items-center gap-2"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'var(--text-muted)',
                    padding: 'var(--space-3) var(--space-6)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 'var(--text-base)',
                    fontWeight: '500',
                    transition: 'all 200ms ease'
                  }}
                >
                  Sign Up Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <p className="body-large text-text-muted max-w-3xl">
              See how Andru generates detailed buyer personas, pain points, and sales plays for B2B SaaS. Complete analysis in under 3 minutes.
            </p>
          </StaggeredItem>

          {/* Product Info Card */}
          <StaggeredItem
            delay={0.2}
            animation="slide"
            className="mb-8"
          >
            {/* Demo Example Label */}
            <div className="badge badge-primary" style={{
              display: 'inline-block',
              marginBottom: 'var(--space-4)'
            }}>
              📋 Demo Example Product
            </div>

            <div
              className="p-6 rounded-2xl border hover-shimmer-blue"
              style={{
                background: 'var(--glass-bg)',
                borderColor: 'var(--glass-border)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="heading-2 mb-2">{demoData.product.productName}</h2>
                  <p className="body text-text-muted">{demoData.product.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowExportModal(true)}
                    onMouseEnter={secondaryButtonHover.handleMouseEnter}
                    onMouseLeave={secondaryButtonHover.handleMouseLeave}
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-surface-secondary/50">
                  <div className="body-small text-text-muted mb-1">Distinguishing Feature</div>
                  <div className="body-small">{demoData.product.distinguishingFeature}</div>
                </div>
                <div className="p-4 rounded-lg bg-surface-secondary/50">
                  <div className="body-small text-text-muted mb-1">Business Model</div>
                  <div className="body-small">{demoData.product.businessModel}</div>
                </div>
                <div className="p-4 rounded-lg bg-surface-secondary/50">
                  <div className="body-small text-text-muted mb-1">Target Market</div>
                  <div className="body-small">{demoData.product.targetMarket}</div>
                </div>
              </div>
            </div>
          </StaggeredItem>

          {/* Tab Navigation */}
          <StaggeredItem
            delay={0.4}
            animation="slide"
            className="mb-8"
          >
            <div className="flex gap-3">
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

          {/* CTA Footer */}
          <StaggeredItem
            delay={0.6}
            animation="lift"
            className="mt-12"
          >
            <div
              className="p-8 rounded-2xl border text-center hover-shimmer-diagonal"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                borderColor: 'var(--glass-border)'
              }}
            >
              <h3 className="heading-2 mb-3">Ready to Generate Your Own ICP?</h3>
              <p className="body-large text-text-muted mb-6 max-w-2xl mx-auto">
                Join 100+ founders using Andru to identify their best buyers. <strong>Free to start</strong>, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/signup"
                  onMouseEnter={primaryButtonHover.handleMouseEnter}
                  onMouseLeave={primaryButtonHover.handleMouseLeave}
                  className="btn btn-primary btn-large flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 body text-text-secondary hover:text-text-primary transition-colors"
                  style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
                >
                  View Pricing & Founding Member Benefits
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </StaggeredItem>
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
                <FileText className="w-4 h-4" />
                Export as PDF
              </button>
              <button
                onClick={handleMarkdownExport}
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Export as Markdown
              </button>
              <button
                onClick={handleCSVExport}
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
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

      {/* Demo Generation Modal */}
      <DemoGenerationModal
        isOpen={showGenerationModal}
        onClose={() => setShowGenerationModal(false)}
        onSuccess={(result) => {
          // Don't close modal - let modal show its success state
          // Modal has export buttons and sign-up CTA in success state
          // User will close modal when done
        }}
      />
    </ModernSidebarLayout>
  );
}
