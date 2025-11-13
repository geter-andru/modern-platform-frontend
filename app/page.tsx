'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from './lib/supabase/client-rewrite';
import { motion } from 'framer-motion';
import { Eye, Target, Calculator, BarChart3, Share2, Menu, X, ChevronDown } from 'lucide-react';
import { GradientButton } from '../src/shared/components/ui/GradientButton';
import { FeatureCard } from '../src/shared/components/ui/FeatureCard';
import { FooterLayout } from '../src/shared/components/layout/FooterLayout';
import { MotionBackground } from '../src/shared/components/ui/MotionBackground';
import { initPublicPageTracking, trackCtaClick } from './lib/analytics/publicPageTracking';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false); // Changed: Show CTAs immediately, don't block on auth check
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [whyAndruOpen, setWhyAndruOpen] = useState(false);

  // Non-blocking auth check - runs in background, updates state when complete
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, [supabase]);

  // Initialize public page tracking
  useEffect(() => {
    initPublicPageTracking('/', 'Andru Revenue Intelligence - Homepage');
  }, []);

  // CTA click handler
  const handleCtaClick = (ctaText: string, ctaLocation: string) => {
    // Fire-and-forget tracking (non-blocking)
    trackCtaClick({
      ctaText,
      ctaLocation,
      pagePath: '/'
    }).catch(() => {
      // Tracking failures are non-fatal and already logged
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: 'transparent',
      color: 'var(--color-text-primary, #ffffff)',
      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
    }}>
      {/* Header Navigation */}
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
              <span className="text-xl font-bold" style={{
                color: 'var(--color-text-primary, #ffffff)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}>
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

              {/* Why Andru Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setWhyAndruOpen(!whyAndruOpen)}
                  className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-blue-400"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  Why Andru
                  <ChevronDown className={`w-4 h-4 transition-transform ${whyAndruOpen ? 'rotate-180' : ''}`} />
                </button>

                {whyAndruOpen && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setWhyAndruOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div
                      className="absolute top-full left-0 mt-2 w-56 rounded-lg z-20"
                      style={{
                        background: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      <div className="py-2">
                        <Link
                          href="/compare/and-clay"
                          className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                          onClick={() => setWhyAndruOpen(false)}
                        >
                          Andru & Clay
                        </Link>
                        <Link
                          href="/compare/and-gong"
                          className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                          onClick={() => setWhyAndruOpen(false)}
                        >
                          Andru & Gong
                        </Link>
                        <Link
                          href="/compare/and-hubspot"
                          className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                          onClick={() => setWhyAndruOpen(false)}
                        >
                          Andru & HubSpot
                        </Link>
                        <Link
                          href="/compare/and-salesforce"
                          className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                          onClick={() => setWhyAndruOpen(false)}
                        >
                          Andru & Salesforce
                        </Link>
                        <Link
                          href="/compare/and-zoominfo"
                          className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                          onClick={() => setWhyAndruOpen(false)}
                        >
                          Andru & ZoomInfo
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
              <Link
                href="/login"
                className="px-6 py-2 rounded-lg font-semibold text-sm transition-all"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff'
                }}
              >
                Login
              </Link>
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

              {/* Why Andru - Mobile */}
              <div>
                <button
                  onClick={() => setWhyAndruOpen(!whyAndruOpen)}
                  className="flex items-center justify-between w-full py-2 text-sm font-medium"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  Why Andru
                  <ChevronDown className={`w-4 h-4 transition-transform ${whyAndruOpen ? 'rotate-180' : ''}`} />
                </button>
                {whyAndruOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    <Link
                      href="/compare/and-clay"
                      className="block py-2 text-sm"
                      style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Andru & Clay
                    </Link>
                    <Link
                      href="/compare/and-gong"
                      className="block py-2 text-sm"
                      style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Andru & Gong
                    </Link>
                    <Link
                      href="/compare/and-hubspot"
                      className="block py-2 text-sm"
                      style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Andru & HubSpot
                    </Link>
                    <Link
                      href="/compare/and-salesforce"
                      className="block py-2 text-sm"
                      style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Andru & Salesforce
                    </Link>
                    <Link
                      href="/compare/and-zoominfo"
                      className="block py-2 text-sm"
                      style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Andru & ZoomInfo
                    </Link>
                  </div>
                )}
              </div>

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
              <Link
                href="/login"
                className="block px-6 py-2 rounded-lg font-semibold text-sm text-center"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Animated Background */}
      <MotionBackground />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-24 sm:pb-32">
          <motion.div
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Logo/Brand with Glass Effect */}
            <motion.div variants={fadeInUp} className="mb-12">
              <div className="inline-block px-8 py-4 rounded-2xl glass" style={{
                background: 'var(--glass-background, rgba(255, 255, 255, 0.03))',
                backdropFilter: 'var(--glass-backdrop, blur(16px))',
                border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.08))',
                boxShadow: 'var(--shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.4))'
              }}>
                <h2 className="text-2xl font-bold tracking-wide" style={{
                  color: 'var(--color-text-primary, #ffffff)',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  fontWeight: 'var(--font-weight-semibold, 600)',
                  letterSpacing: 'var(--tracking-wide, 0.5px)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}>
                  Andru Revenue Intelligence
                </h2>
              </div>
            </motion.div>

            {/* Executive-Level Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{
                color: 'var(--color-text-primary, #ffffff)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-bold, 700)',
                letterSpacing: 'var(--tracking-tighter, -0.02em)',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              90% of Startups Fail for Lack of Market Need?
            </motion.h1>

            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-bold, 700)',
                letterSpacing: 'var(--tracking-tighter, -0.02em)',
              }}
            >
              No. They Fail for Lack of Market Clarity.
            </motion.h2>

            {/* Executive Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl max-w-4xl mx-auto mb-8 leading-relaxed"
              style={{
                color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-normal, 400)',
                lineHeight: 'var(--line-height-relaxed, 1.6)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            >
              The AI platform that delivers Product-Market Intelligence, Resonance, and Clarity—
              the complete framework for achieving enterprise product-market fit in 72 hours, not 6 months.
            </motion.p>

            {/* Try Demo CTA - Above the Fold */}
            <motion.div
              variants={fadeInUp}
              className="mb-16"
            >
              <Link
                href="/icp/demo-v2"
                onClick={() => handleCtaClick('See Live Demo', 'hero-above-fold')}
                className="inline-flex items-center justify-center gap-2 px-12 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: '600',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Eye className="w-5 h-5" />
                See Live Demo
              </Link>
            </motion.div>

            {/* Executive CTA Buttons with Glass Morphism */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              {!loading && (
                <>
                  {isAuthenticated ? (
                    <GradientButton
                      href="/dashboard"
                      size="xl"
                      ariaLabel="Go to your dashboard"
                      onClick={() => handleCtaClick('Go to Dashboard', 'hero')}
                    >
                      Go to Dashboard
                    </GradientButton>
                  ) : (
                    <GradientButton
                      href="/pricing"
                      size="xl"
                      ariaLabel="Lock in founding member pricing"
                      onClick={() => handleCtaClick('Lock In Founding Member Pricing', 'hero')}
                    >
                      Lock In Founding Member Pricing
                    </GradientButton>
                  )}

                  <Link
                    href="/icp/demo-v2"
                    onClick={() => handleCtaClick('See Live Demo', 'hero')}
                    className="group px-12 py-6 rounded-2xl font-semibold text-lg min-w-[240px] text-center transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: '600',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <Eye className="w-5 h-5" />
                    See Live Demo
                  </Link>
                </>
              )}
            </motion.div>

            {/* Platform Status Badge */}
            <motion.div variants={fadeInUp} className="mt-12">
              <div className="inline-block px-6 py-3 rounded-full" style={{
                background: 'rgba(59, 130, 246, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)'
              }}>
                <p className="body-small" style={{
                  color: '#3b82f6',
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: '0.5px',
                  fontWeight: 500
                }}>
                  🚀 Founding Member Program • 100 Spots • December 1, 2025 Launch
                </p>
              </div>

              {/* Technical Trust Signals - Agent 4 Fix 2 */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap items-center justify-center gap-2 text-sm mt-4"
                style={{
                  color: 'var(--color-text-muted, rgba(255, 255, 255, 0.6))',
                  fontFamily: '"Inter", sans-serif'
                }}
              >
                <span>AI-powered ICP analysis</span>
                <span style={{ color: 'var(--color-text-subtle, rgba(255, 255, 255, 0.4))' }}>•</span>
                <span>Sub-3s generation</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* You Need This If Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center" style={{
              color: 'var(--color-text-primary, #ffffff)',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
            }}>
              You Need This If...
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "You're spending $20K+/month on sales tools nobody uses",
                "Your pipeline is full but deals keep stalling at 'no decision'",
                "Your sales team can't articulate your value proposition",
                "You're about to hire sales leadership (and they'll ask 'What's our ICP?')",
                "Your board is asking about your GTM strategy",
                "You're stuck at $3M ARR and burning through runway"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: 'rgb(16, 185, 129)'
                  }}>
                    ✓
                  </div>
                  <span style={{
                    color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                    fontSize: '1.0625rem',
                    lineHeight: '1.6'
                  }}>
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Executive Features Section */}
      <section className="py-32 relative overflow-hidden">
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8" style={{
              color: 'var(--color-text-primary, #ffffff)',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
              fontWeight: 'var(--font-weight-bold, 700)',
              letterSpacing: 'var(--tracking-tighter, -0.02em)',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}>
              The Three-Layer Market Clarity Framework
            </h2>
            <p className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed" style={{
              color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
              fontWeight: 'var(--font-weight-normal, 400)',
              lineHeight: 'var(--line-height-relaxed, 1.6)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}>
              Stop reverse-engineering accidents into strategy. Build the complete intelligence stack
              that technical founders need to achieve product-market fit at enterprise scale.
            </p>
          </motion.div>

          {/* Grid Layout: Hero (2x2) + 3 standard cards - Agent 4 Visual Hierarchy */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-8">
            {/* Hero Feature: Product-Market Intelligence (2x2 Grid) */}
            <FeatureCard
              icon={Target}
              title="Product-Market Intelligence: Pure Signal ICP"
              description="Stop reverse-engineering accidents. Build your ICP from product capabilities, not historical customer data contaminated by relationship noise, timing luck, and discount-driven purchases. Know which markets are structurally positioned for Maximum Value Realization."
              variant="featured"
              iconColor="var(--color-primary)"
              iconBgColor="rgba(59, 130, 246, 0.15)"
              iconBorderColor="rgba(59, 130, 246, 0.3)"
              animationDelay={0.1}
              href="/icp/demo-v2"
              ctaText="Try Demo"
              className="md:col-span-2 md:row-span-2"
            />

            {/* Standard Feature 2: Product-Market Resonance */}
            <FeatureCard
              icon={Calculator}
              title="Product-Market Resonance: Human Understanding"
              description="Move from company profiles to authentic human needs. Build buyer personas and empathy maps that reveal what decision-makers see, hear, think, feel—the psychological terrain that drives every B2B purchase."
              variant="standard"
              iconColor="rgb(52, 211, 153)"
              iconBgColor="rgba(16, 185, 129, 0.1)"
              iconBorderColor="rgba(16, 185, 129, 0.2)"
              animationDelay={0.2}
            />

            {/* Standard Feature 3: Product-Market Clarity */}
            <FeatureCard
              icon={BarChart3}
              title="Product-Market Clarity: Tech to Strategic Outcomes"
              description="Translate your technical capabilities into the strategic outcomes and ROI that CFOs approve and boards celebrate. Stop losing enterprise deals to inferior products because you can't articulate business value in their language."
              variant="standard"
              iconColor="rgb(192, 132, 252)"
              iconBgColor="rgba(139, 92, 246, 0.1)"
              iconBorderColor="rgba(139, 92, 246, 0.2)"
              animationDelay={0.3}
            />

            {/* Standard Feature 4: AI-Powered Velocity */}
            <FeatureCard
              icon={Share2}
              title="AI-Powered Velocity: 72 Hours, Not 6 Months"
              description="What takes consultants 6 months and $90K to deliver, Andru generates in 72 hours. Then refines continuously as your market evolves. Export to PDF, CSV, or AI prompt templates for extended research."
              variant="standard"
              iconColor="rgb(34, 211, 238)"
              iconBgColor="rgba(6, 182, 212, 0.1)"
              iconBorderColor="rgba(6, 182, 212, 0.2)"
              animationDelay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterLayout variant="standard" theme="dark" />
    </div>
  );
}