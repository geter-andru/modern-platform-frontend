'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Download, FileText, Users, BarChart3, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { EnterpriseNavigationV2 } from '../../../src/shared/components/layout/EnterpriseNavigationV2';
import BuyerPersonasWidget from '../../../src/features/icp-analysis/widgets/BuyerPersonasWidget';
import MyICPOverviewWidget from '../../../src/features/icp-analysis/widgets/MyICPOverviewWidget';
import { exportICPToPDF } from '@/app/lib/utils/pdf-export';
import toast, { Toaster } from 'react-hot-toast';
import demoData from '../../../data/demo-icp-devtool.json';
import DemoGenerationModal from './components/DemoGenerationModal';
import '../../../src/shared/styles/component-patterns.css';
import { BRAND_IDENTITY } from '@/app/lib/constants/brand-identity';

export default function ICPDemoPage() {
  const [activeTab, setActiveTab] = useState<'personas' | 'overview'>('personas');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showGenerationModal, setShowGenerationModal] = useState(false);

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

  const handleMarkdownExport = () => {
    toast('Markdown export coming soon in Phase 1.2!', { icon: 'ℹ️' });
  };

  const handleCSVExport = () => {
    toast('CSV export coming soon in Phase 1.2!', { icon: 'ℹ️' });
  };

  return (
    <EnterpriseNavigationV2>
      <Toaster position="top-right" />
      <div className="min-h-screen py-8" style={{ background: 'var(--bg-primary)' }}>
        <div className="container-wide">
          {/* Demo Badge Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Demo Mode</span>
                  </div>
                  <h1 className="heading-1">ICP Tool Demo</h1>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted pl-1">
                  <span>Built by {BRAND_IDENTITY.FOUNDER.NAME}, {BRAND_IDENTITY.FOUNDER.BIO_SHORT}</span>
                  <span className="text-text-subtle">•</span>
                  <span>Powered by advanced AI (sub-3s ICP generation)</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowGenerationModal(true)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Live ICP
                </button>
                <Link
                  href="/signup"
                  className="btn btn-secondary flex items-center gap-2"
                >
                  Sign Up Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <p className="body-large text-text-muted max-w-3xl">
              Explore a complete ICP analysis for <strong>{demoData.product.productName}</strong> -
              an AI-powered code review platform. See how Andru generates detailed buyer personas,
              pain points, and actionable insights for B2B SaaS products.
            </p>
          </motion.div>

          {/* Product Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div
              className="p-6 rounded-2xl border"
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
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-surface-secondary/50">
                  <div className="text-sm text-text-muted mb-1">Distinguishing Feature</div>
                  <div className="body-small">{demoData.product.distinguishingFeature}</div>
                </div>
                <div className="p-4 rounded-lg bg-surface-secondary/50">
                  <div className="text-sm text-text-muted mb-1">Business Model</div>
                  <div className="body-small">{demoData.product.businessModel}</div>
                </div>
                <div className="p-4 rounded-lg bg-surface-secondary/50">
                  <div className="text-sm text-text-muted mb-1">Target Market</div>
                  <div className="body-small">{demoData.product.targetMarket}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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
          </motion.div>

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <div
              className="p-8 rounded-2xl border text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                borderColor: 'var(--glass-border)'
              }}
            >
              <h3 className="heading-2 mb-3">You've Seen the Demo. Now Generate Your Real ICP.</h3>
              <p className="body-large text-text-muted mb-6 max-w-2xl mx-auto">
                This is what Andru can do for <strong>YOUR product</strong>.
                Join 100 founding members getting <strong>$149/mo locked-in pricing</strong>
                (launching at $297/mo in March 2025).
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/founding-members"
                  className="btn btn-primary btn-large flex items-center gap-2"
                >
                  Apply for Founding Member Access
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="btn btn-secondary btn-large flex items-center gap-2"
                >
                  View Pricing
                  <ExternalLink className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
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
                disabled
              >
                <FileText className="w-4 h-4" />
                Export as Markdown
                <span className="badge badge-secondary text-xs ml-2">Coming Soon</span>
              </button>
              <button
                onClick={handleCSVExport}
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
                disabled
              >
                <FileText className="w-4 h-4" />
                Export as CSV
                <span className="badge badge-secondary text-xs ml-2">Coming Soon</span>
              </button>
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              className="btn btn-ghost w-full mt-4"
            >
              Cancel
            </button>

            <p className="text-sm text-text-muted text-center mt-6 pt-6 border-t" style={{ borderColor: 'var(--glass-border)' }}>
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
          toast.success('ICP generated successfully! View it below.');
          setShowGenerationModal(false);
          // Could optionally update the page to show the new result
        }}
      />
    </EnterpriseNavigationV2>
  );
}
