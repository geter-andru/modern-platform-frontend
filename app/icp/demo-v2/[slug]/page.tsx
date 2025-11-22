'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronDown, Menu, X, Download, ArrowLeft, Share2, Sparkles } from 'lucide-react';
import BuyerPersonasWidget from '../../../../src/features/icp-analysis/widgets/BuyerPersonasWidget';
import { MotionBackground } from '../../../../src/shared/components/ui/MotionBackground';
import { FooterLayout } from '../../../../src/shared/components/layout/FooterLayout';
import { exportICPToPDF } from '@/app/lib/utils/pdf-export';
import { exportToMarkdown, exportToCSV } from '@/app/lib/utils/data-export';
import toast, { Toaster } from 'react-hot-toast';
import demoData from '../../../../data/demo-icp-devtool.json';

// Session storage keys
const SESSION_KEYS = {
  PERSONAS: 'andru_generated_personas',
  FORM_DATA: 'andru_icp_form_data',
  PRODUCT_INFO: 'andru_product_info'
};

// Helper to convert slug back to display name (for fallback)
function slugToDisplayName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function PeopleWhoNeedPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [personas, setPersonas] = useState<any[]>([]);
  const [productInfo, setProductInfo] = useState<{ name: string; description: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Load personas from session storage on mount
  useEffect(() => {
    const loadSessionData = () => {
      try {
        const storedPersonas = sessionStorage.getItem(SESSION_KEYS.PERSONAS);
        const storedProductInfo = sessionStorage.getItem(SESSION_KEYS.PRODUCT_INFO);

        if (storedPersonas) {
          const parsedPersonas = JSON.parse(storedPersonas);
          setPersonas(parsedPersonas);

          if (storedProductInfo) {
            setProductInfo(JSON.parse(storedProductInfo));
          }

          setIsLoading(false);
        } else {
          // No session data - redirect back to form
          console.log('No personas in session storage, redirecting to form');
          router.push('/icp/demo-v2');
        }
      } catch (error) {
        console.error('Error loading session data:', error);
        router.push('/icp/demo-v2');
      }
    };

    loadSessionData();
  }, [router]);

  // Export handlers
  const handleExportPDF = async () => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf-export' });

      const exportData = {
        companyName: productInfo?.name || 'Your Company',
        productName: productInfo?.name || 'Your Product',
        personas: personas,
        generatedAt: new Date().toISOString()
      };

      await exportICPToPDF(exportData, {
        includeDemoWatermark: true
      });

      toast.success('PDF downloaded!', { id: 'pdf-export' });
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to generate PDF', { id: 'pdf-export' });
    }
    setShowExportMenu(false);
  };

  const handleExportMarkdown = () => {
    try {
      const exportData = {
        companyName: productInfo?.name || 'Your Company',
        productName: productInfo?.name || 'Your Product',
        personas: personas,
        generatedAt: new Date().toISOString()
      };

      exportToMarkdown(exportData);
      toast.success('Markdown downloaded!');
    } catch (error) {
      toast.error('Failed to export Markdown');
    }
    setShowExportMenu(false);
  };

  const handleExportCSV = () => {
    try {
      const exportData = {
        companyName: productInfo?.name || 'Your Company',
        productName: productInfo?.name || 'Your Product',
        personas: personas,
        generatedAt: new Date().toISOString()
      };

      exportToCSV(exportData);
      toast.success('CSV downloaded!');
    } catch (error) {
      toast.error('Failed to export CSV');
    }
    setShowExportMenu(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)'
      }}>
        <div className="text-white text-lg">Loading your results...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{
      background: 'transparent',
      color: '#ffffff',
      fontFamily: '"Red Hat Display", sans-serif'
    }}>
      <Toaster position="top-right" />
      <MotionBackground />

      {/* Header Navigation - Same as homepage */}
      <header className="fixed top-0 left-0 right-0 z-50" style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/andru-logo-v2_192x192.png"
                alt="Andru"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold" style={{ color: '#ffffff' }}>
                Andru
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="https://andru-ai.com/assessment"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium transition-colors hover:text-blue-400"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Free Assessment
              </a>

              {/* Product Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                  className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-blue-400"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  Product
                  <ChevronDown className={`w-4 h-4 transition-transform ${productDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {productDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProductDropdownOpen(false)}
                    />
                    <div
                      className="absolute top-full left-0 mt-2 w-64 rounded-lg z-20"
                      style={{
                        background: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      <div className="py-2">
                        <Link
                          href="/icp/demo-v2"
                          className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                          onClick={() => setProductDropdownOpen(false)}
                        >
                          Your Andru ICP
                        </Link>
                        <Link
                          href="/enterprise-sales-frameworks"
                          className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                          onClick={() => setProductDropdownOpen(false)}
                        >
                          Enterprise Sales Frameworks
                        </Link>
                        <Link
                          href="/investor-readiness-dashboard"
                          className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                          onClick={() => setProductDropdownOpen(false)}
                        >
                          Investor Readiness Dashboard
                        </Link>
                        <Link
                          href="/coming-soon"
                          className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                          onClick={() => setProductDropdownOpen(false)}
                        >
                          Product Roadmap
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-blue-400"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                About
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium transition-colors hover:text-blue-400"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Pricing
              </Link>
              <a
                href="https://andru-ai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff'
                }}
              >
                Get My Revenue Readiness Score
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              style={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <a
                href="https://andru-ai.com/assessment"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-2 text-sm font-medium"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Free Assessment
              </a>
              <Link
                href="/icp/demo-v2"
                className="block py-2 text-sm font-medium"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Your Andru ICP
              </Link>
              <Link
                href="/about"
                className="block py-2 text-sm font-medium"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/pricing"
                className="block py-2 text-sm font-medium"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <a
                href="https://andru-ai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-2 px-4 rounded-lg font-semibold text-sm text-center"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff'
                }}
              >
                Get My Revenue Readiness Score
              </a>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Link & Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/icp/demo-v2"
              className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-blue-400"
              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Generate another
            </Link>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  People Who Desperately Need{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {productInfo?.name || slugToDisplayName(slug)}
                  </span>
                </h1>
                <p className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Your AI-generated buyer personas with ready-to-use objection responses
                </p>
              </div>

              {/* Export Button */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff'
                  }}
                >
                  <Download className="w-4 h-4" />
                  Export
                  <ChevronDown className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
                </button>

                {showExportMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowExportMenu(false)}
                    />
                    <div
                      className="absolute top-full right-0 mt-2 w-48 rounded-lg z-20"
                      style={{
                        background: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      <div className="py-2">
                        <button
                          onClick={handleExportPDF}
                          className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-white/5"
                          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        >
                          Download PDF
                        </button>
                        <button
                          onClick={handleExportMarkdown}
                          className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-white/5"
                          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        >
                          Download Markdown
                        </button>
                        <button
                          onClick={handleExportCSV}
                          className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-white/5"
                          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        >
                          Download CSV
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Buyer Personas Widget */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <BuyerPersonasWidget
              personas={personas}
              isDemo={true}
              simplified={true}
            />
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div
              className="p-8 rounded-2xl"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}
            >
              <Sparkles className="w-10 h-10 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">Want the Full Revenue Intelligence Suite?</h2>
              <p className="text-lg mb-6" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Get 77 AI-generated resources including sales decks, email templates, objection handlers, and ROI calculators.
              </p>
              <a
                href="https://andru-ai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff',
                  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
                }}
              >
                Get My Revenue Readiness Score
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <FooterLayout variant="minimal" theme="dark" />
    </div>
  );
}
