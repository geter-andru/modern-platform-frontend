'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Crown, Check, Info, Download, Share2, Calculator, HelpCircle, ArrowRight } from 'lucide-react';

/**
 * Pricing Page - Andru Platform
 * 
 * Features:
 * - Waitlist pricing at $497/month (Stripe link)
 * - Immediate deal assistance at $350/hour (Calendly link)
 * - Three platform tiers: Foundations, Growth, Scale
 * 
 * Routes: /pricing
 * 
 * Last Updated: 2025-10-29
 */

export default function PricingPage() {
  // Monthly/Annual Toggle State
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  
  // Animation variants
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

  // External links
  const STRIPE_WAITLIST_LINK = 'https://buy.stripe.com/6oU9AVgJn4y78iqdU6bsc0n';
  const CALENDLY_DEAL_ASSISTANCE_LINK = 'https://calendly.com/humusnshore/60-min-sales-solution-session';

  // Pricing Data (Technical Founder Focus)
  const pricingTiers = {
    foundations: {
      name: 'Pilot / Dev Stage',
      monthly: 497,
      annual: 4970, // 17% discount (approx 1.7 months free)
      stage: 'Pre-seed to Seed',
      technicalDeliverables: [
        'API Access with Rate Limits',
        '3-Hour Technical Onboarding Session',
        'Basic ICP Generation (Pure Signal Methodology)',
        'Export to JSON/CSV for Integration',
        'Email Support (24hr Response SLA)'
      ],
      measurableOutcomes: [
        'Validate product-market fit hypothesis with data-driven ICP scoring',
        'Identify 3-5 ideal customer profiles with measurable fit scores (>0.7)',
        'Generate technical requirements document for sales engineering'
      ]
    },
    growth: {
      name: 'Product-Market Fit / Scale Prep',
      monthly: 4997,
      annual: 49970, // 17% discount
      stage: 'Series A to Series B',
      technicalDeliverables: [
        'Everything in Foundations, plus:',
        'Custom Rate Limits & API Quotas',
        '99.9% Uptime SLO Configuration',
        'Dedicated Slack Channel with Technical Team',
        'Direct Feature Request Portal Access',
        'Priority Support (4hr Response SLA)'
      ],
      measurableOutcomes: [
        'Increase close rates by 60-80% through high-value customer targeting',
        'Reduce sales cycle from 6+ months to 6-8 weeks via ICP prioritization',
        'Improve average deal size by 3-5x through premium pricing justification'
      ]
    },
    scale: {
      name: 'Series B & Beyond / Enterprise',
      monthly: 14997,
      annual: 149970, // 17% discount
      stage: 'Series B+ and Enterprise',
      technicalDeliverables: [
        'Everything in Growth, plus:',
        'Custom AI Models Trained on Your Market Data',
        'Dedicated Environment & Infrastructure',
        'Quarterly Technical Reviews & Roadmap Planning',
        'White-Glove Onboarding with Dedicated Technical PM',
        'SOC 2 & ISO 27001 Compliance Documentation',
        '24/7 Technical Support with Dedicated Escalation Path'
      ],
      measurableOutcomes: [
        'Establish category leadership through proprietary market intelligence',
        'Map and own adjacent market opportunities (expanded ICP discovery)',
        'Build strategic moat via custom AI models and quarterly strategy reviews'
      ]
    }
  };

  // Handle external link clicks
  const handleStripeClick = () => {
    window.open(STRIPE_WAITLIST_LINK, '_blank', 'noopener,noreferrer');
  };

  const handleCalendlyClick = () => {
    window.open(CALENDLY_DEAL_ASSISTANCE_LINK, '_blank', 'noopener,noreferrer');
  };

  // Calculate savings for annual billing (17% discount = pay for 10 months, get 12)
  const calculateSavings = (monthly: number, annual: number) => {
    const monthlyTotal = monthly * 12;
    return monthlyTotal - annual;
  };

  // Generate CSV for comparison table export
  const generateComparisonCSV = () => {
    const rows = [
      ['Feature', 'Pilot / Dev Stage', 'Product-Market Fit / Scale Prep', 'Series B & Beyond'],
      ['API Rate Limits', 'Basic', 'Custom Quotas', 'Dedicated Environment'],
      ['Technical Onboarding', '3-Hour Session', 'Dedicated Slack Channel', 'White-Glove + Technical PM'],
      ['Support SLA', '24hr Response', '4hr Response', '24/7 + Escalation Path'],
      ['Uptime SLO Configuration', '—', '99.9% Configurable', '99.99% + Custom SLAs'],
      ['ICP Generation', 'Pure Signal', 'Pure Signal + Custom Models', 'Pure Signal + Trained on Your Data'],
      ['Export Formats', 'JSON, CSV', 'JSON, CSV, PDF', 'All + CRM Push'],
      ['Feature Request Portal', '—', 'Prioritized Access', 'Direct Roadmap Influence'],
      ['Custom AI Models', '—', '—', 'Trained on Market Data'],
      ['Quarterly Reviews', '—', '—', 'Technical Roadmap Planning'],
      ['Compliance Documentation', '—', '—', 'SOC 2 & ISO 27001']
    ];
    return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

  // Tooltip component
  const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    
    // Don't render tooltip if text is empty or undefined
    if (!text || text.trim() === '') {
      return <>{children}</>;
    }
    
    return (
      <div className="relative inline-block">
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="inline-flex items-center gap-1 cursor-help"
        >
          {children}
          <HelpCircle className="h-3 w-3" style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
        </div>
        {showTooltip && text && (
          <div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 rounded text-xs z-50 max-w-xs"
            style={{
              background: '#1A1A1A',
                    border: '1px solid transparent',
              color: '#E0E0E0',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
              pointerEvents: 'none'
            }}
          >
            {text}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent" style={{
              borderTopColor: '#1A1A1A'
            }} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ 
      background: '#121212',
      color: '#E0E0E0',
      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
    }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center px-4 sm:px-6 lg:px-8" style={{
        background: '#121212'
      }}>
        {/* Gradient Background Overlays */}
        <div className="absolute inset-0" style={{
          background: '#121212'
        }} />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/20 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto pt-20 pb-24 sm:pt-24 sm:pb-32">
          <motion.div
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Hero Headline - Technical Founder Focus */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
              style={{
                color: '#FFFFFF',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-bold, 700)',
                letterSpacing: '0.02em',
                lineHeight: '1.2'
              }}
            >
              Pricing Built for
              <span className="block mt-4 text-4xl sm:text-5xl md:text-6xl" style={{
                color: '#3b82f6',
                fontWeight: 'var(--font-weight-semibold, 600)'
              }}>
                Technical Founders
              </span>
            </motion.h1>

            {/* Hero Subheadline - ROI-Driven */}
            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl max-w-4xl mx-auto mb-16 leading-relaxed"
              style={{
                color: '#E0E0E0',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-normal, 400)',
                lineHeight: '1.7',
                letterSpacing: '0.01em'
              }}
            >
              Quantifiable technical outcomes. Clear ROI. No marketing fluff. Choose the tier that matches your stage.
            </motion.p>

            {/* Launch Banner - Technical */}
            <motion.div
              variants={fadeInUp}
              className="max-w-2xl mx-auto mb-12 p-6 rounded-lg relative"
              style={{
                background: '#1A1A1A',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div className="relative">
                <h3 className="text-lg font-bold mb-2" style={{ 
                  color: '#3b82f6',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                }}>
                  ⚡ Platform Launches December 1st, 2025
                </h3>
                <p className="font-semibold mb-2" style={{ 
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                }}>
                  Join the waitlist now for 50% founding member pricing
                </p>
                <p className="text-sm" style={{ 
                  color: '#E0E0E0',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                }}>
                  Limited to first 75 founders • 47 spots remaining
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative" style={{
        background: '#121212'
      }}>
        {/* Subtle Background Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.15), transparent)'
        }}></div>
        
        {/* Section 1: Waitlist Pricing */}
        <section className="mb-24 relative">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ 
                color: '#FFFFFF',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                letterSpacing: '0.02em'
              }}>
                🧭 Founding Member Waitlist
              </h2>
              <p className="text-lg" style={{ 
                color: '#E0E0E0',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.7'
              }}>
                50% discount for first 75 technical founders
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <div
                className="max-w-2xl mx-auto p-8 rounded-xl relative transition-all duration-300"
                style={{
                  background: '#1A1A1A',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
                }}
              >
                <div className="relative">
                <div className="text-center">
                  {/* Price Display */}
                  <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ 
                      color: '#E0E0E0',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                    }}>
                      Founding Member Price
                    </p>
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-5xl md:text-6xl font-extrabold" style={{ 
                        color: '#3b82f6',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        $497
                      </span>
                      <span className="ml-2 text-2xl md:text-3xl" style={{ 
                        color: '#E0E0E0',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        /month
                      </span>
                    </div>
                    <p className="text-sm font-semibold" style={{ 
                      color: '#10b981',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                    }}>
                      Save 50% • Lock in lifetime discount
                    </p>
                  </div>

                  {/* Technical Deliverables */}
                  <div className="text-left mb-8 space-y-4">
                    <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ 
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                    }}>
                      Technical Deliverables
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {[
                        'API Access with Rate Limits',
                        'ICP Generation (Pure Signal Methodology)',
                        'JSON/CSV Export for Integration',
                        'Email Support (24hr Response SLA)',
                        'Early Access to Platform Features'
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 mr-3 flex-shrink-0 mt-0.5" style={{ color: '#3b82f6' }} />
                          <span style={{ 
                            color: '#E0E0E0',
                            fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                            lineHeight: '1.6'
                          }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="mb-6">
                    <button
                      onClick={handleStripeClick}
                      className="w-full max-w-md mx-auto px-12 py-6 rounded-lg font-semibold text-base text-center transition-all duration-300"
                      style={{
                        background: '#3b82f6',
                        border: '1px solid #3b82f6',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                        fontWeight: '600'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#2563eb';
                        e.currentTarget.style.borderColor = '#2563eb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#3b82f6';
                        e.currentTarget.style.borderColor = '#3b82f6';
                      }}
                    >
                      Join Waitlist - Lock in 50% Discount
                    </button>
                  </div>
                  
                  {/* Trust Signal */}
                  <div className="mt-6 text-center">
                    <div className="inline-block px-4 py-2 rounded-full" style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      <p className="text-xs font-medium" style={{
                        color: '#E0E0E0',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        ✨ Limited to first 75 founders • 47 spots remaining
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Section 2: Immediate Deal Assistance */}
        <section className="mb-24 relative">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  fontWeight: 'var(--font-weight-bold, 700)',
                  letterSpacing: '0.02em',
                  lineHeight: '1.2'
                }}
              >
                ⚡ Active Deal Assessment
                <span className="block mt-2 text-3xl sm:text-4xl md:text-5xl" style={{
                  color: '#3b82f6',
                  fontWeight: 'var(--font-weight-semibold, 600)'
                }}>
                  & Immediate Wins
                </span>
              </h2>
              <p 
                className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed"
                style={{
                  color: '#E0E0E0',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  lineHeight: '1.7',
                  letterSpacing: '0.01em'
                }}
              >
                1-hour technical scoping session to accelerate your active deals
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <div
                className="max-w-2xl mx-auto p-8 rounded-xl relative transition-all duration-300"
                style={{
                  background: '#1A1A1A',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
                }}
              >
                <div className="relative">
                <div className="text-center">
                  {/* Price Display */}
                  <div className="mb-8">
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-5xl md:text-6xl font-extrabold" style={{ 
                        color: '#3b82f6',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        $350
                      </span>
                      <span className="ml-2 text-2xl md:text-3xl" style={{ 
                        color: '#E0E0E0',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        /hour
                      </span>
                    </div>
                    <p className="text-lg mb-2" style={{ 
                      color: '#E0E0E0',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                      lineHeight: '1.6'
                    }}>
                      1-hour technical scoping session via Calendly
                    </p>
                    <p className="text-sm" style={{ 
                      color: '#E0E0E0',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                    }}>
                      Immediate availability • Technical expert guidance
                    </p>
                  </div>

                  {/* Technical Deliverables */}
                  <div className="text-left mb-8 space-y-4">
                    <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ 
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                    }}>
                      Technical Deliverables
                    </h3>
                    <ul className="space-y-3 text-sm">
                      {[
                        'Review 100% of active pipeline opportunities',
                        'Identify 3-5 deals with highest close probability',
                        'Create week-by-week advancement strategy',
                        'Sprint Planning Session with team commitment'
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Zap className="h-4 w-4 mr-3 flex-shrink-0 mt-0.5" style={{ color: '#3b82f6' }} />
                          <span style={{ 
                            color: '#E0E0E0',
                            fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                            lineHeight: '1.6'
                          }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="mb-6">
                    <button
                      onClick={handleCalendlyClick}
                      className="w-full max-w-md mx-auto px-12 py-6 rounded-lg font-semibold text-base text-center transition-all duration-300 flex items-center justify-center gap-2"
                      style={{
                        background: '#1A1A1A',
                        border: '1px solid transparent',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                        fontWeight: '600'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#3b82f6';
                        e.currentTarget.style.borderColor = '#3b82f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#1A1A1A';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      <Zap className="h-5 w-5 relative z-10" />
                      <span className="relative z-10">Book Technical Scoping Call & Pipeline Review</span>
                      <ArrowRight className="h-4 w-4 relative z-10" />
                    </button>
                  </div>
                  
                  {/* Trust Signal */}
                  <div className="mt-6 text-center">
                    <div className="inline-block px-4 py-2 rounded-full" style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      <p className="text-xs font-medium" style={{
                        color: '#E0E0E0',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        ⚡ Immediate availability • Technical expert guidance
                      </p>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Section 3: Platform Tiers */}
        <section className="mb-24 relative">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ 
                color: '#FFFFFF',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                letterSpacing: '0.02em',
                lineHeight: '1.2'
              }}>
                Platform Pricing Tiers
              </h2>
              <p className="text-lg" style={{ 
                color: '#E0E0E0',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                letterSpacing: '0.01em',
                lineHeight: '1.7'
              }}>
                Stage-aligned technical deliverables with quantifiable outcomes
              </p>
              
              {/* Monthly/Annual Toggle */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <span className={`text-sm font-medium transition-colors ${billingPeriod === 'monthly' ? 'text-white' : 'text-[#E0E0E0]'}`} style={{
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                }}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                  className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 focus:ring-offset-[#121212]"
                  style={{
                    background: billingPeriod === 'annual' ? '#3b82f6' : '#1A1A1A',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  aria-label={`Switch to ${billingPeriod === 'monthly' ? 'annual' : 'monthly'} billing`}
                >
                  <span
                    className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-md"
                    style={{
                      transform: billingPeriod === 'annual' ? 'translateX(28px)' : 'translateX(0)'
                    }}
                  />
                </button>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium transition-colors ${billingPeriod === 'annual' ? 'text-white' : 'text-[#E0E0E0]'}`} style={{
                    fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                  }}>
                    Annual
                  </span>
                  {billingPeriod === 'annual' && (
                    <span className="px-2 py-1 text-xs font-bold rounded" style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                    }}>
                      Save 17%
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Tier 1: Pilot / Dev Stage */}
              <motion.div variants={fadeInUp} className="relative">
                <div
                  className="p-8 rounded-xl relative transition-all duration-300"
                  style={{
                    background: '#1A1A1A',
                    border: '1px solid transparent',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
                  }}
                >
                  <div className="relative">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2" style={{ 
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                        letterSpacing: '0.01em'
                      }}>
                        {pricingTiers.foundations.name}
                      </h3>
                      <p className="text-sm mb-4" style={{ 
                        color: '#E0E0E0',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                        lineHeight: '1.6'
                      }}>
                        {pricingTiers.foundations.stage}
                      </p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline justify-center mb-2">
                        <span className="text-4xl font-extrabold" style={{ 
                          color: '#3b82f6',
                          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                        }}>
                          ${billingPeriod === 'monthly' ? pricingTiers.foundations.monthly : pricingTiers.foundations.annual}
                        </span>
                        <span className="ml-2 text-lg" style={{ 
                          color: '#E0E0E0',
                          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                        }}>
                          /{billingPeriod === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                      {billingPeriod === 'annual' && (
                        <p className="text-xs text-center" style={{ 
                          color: '#10b981',
                          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                        }}>
                          Save ${calculateSavings(pricingTiers.foundations.monthly, pricingTiers.foundations.annual)}/year
                        </p>
                      )}
                    </div>

                    {/* Technical Deliverables */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ 
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        Technical Deliverables
                      </h4>
                      <ul className="space-y-2 text-left">
                        {[
                          { text: 'API Access with Rate Limits', tooltip: 'REST API with configurable rate limits per endpoint' },
                          { text: '3-Hour Technical Onboarding Session', tooltip: 'Deep-dive session covering API integration, data mapping, and first ICP generation' },
                          { text: 'Basic ICP Generation (Pure Signal Methodology)', tooltip: 'AI-powered ICP analysis using Pure Signal framework for market validation' },
                          { text: 'Export to JSON/CSV for Integration', tooltip: 'Structured data export formats for seamless integration with your tech stack' },
                          { text: 'Email Support (24hr Response SLA)', tooltip: 'Email-based technical support with guaranteed 24-hour response time' }
                        ].map((item, index) => (
                          <li key={index} className="flex items-start text-xs" style={{
                            color: '#E0E0E0',
                            fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                            lineHeight: '1.6'
                          }}>
                            <Check className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" style={{ color: '#3b82f6' }} />
                            <Tooltip text={item.tooltip}>
                              <span>{item.text}</span>
                            </Tooltip>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Measurable Outcomes */}
                    <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ 
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        Measurable Outcomes
                      </h4>
                      <ul className="space-y-3 text-left">
                        {pricingTiers.foundations.measurableOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start text-xs" style={{
                            color: '#E0E0E0',
                            fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                            lineHeight: '1.6'
                          }}>
                            <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5" style={{ background: '#3b82f6' }}>
                              <span className="text-white text-xs font-bold" style={{ fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)' }}>{index + 1}</span>
                            </div>
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={handleStripeClick}
                      className="w-full px-6 py-3 rounded-lg font-semibold text-sm text-center transition-all duration-300 flex items-center justify-center gap-2"
                      style={{
                        background: '#1A1A1A',
                        border: '1px solid transparent',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                        fontWeight: '600'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#3b82f6';
                        e.currentTarget.style.borderColor = '#3b82f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#1A1A1A';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      <span>Join Waitlist & View Sample ICP Report</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Tier 2: Product-Market Fit / Scale Prep - Recommended */}
              <motion.div variants={fadeInUp} className="relative">
                <div
                  className="p-8 rounded-xl relative transition-all duration-300"
                  style={{
                    background: '#1A1A1A',
                    border: '2px solid rgba(59, 130, 246, 0.4)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
                  }}
                >
                  {/* Recommended Badge */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="px-4 py-1 rounded-full" style={{
                      background: '#3b82f6',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <p className="text-xs font-bold text-white uppercase tracking-wider" style={{
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        Recommended
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="text-center mb-6 pt-2">
                      <h3 className="text-2xl font-bold mb-2" style={{ 
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                        letterSpacing: '0.01em'
                      }}>
                        {pricingTiers.growth.name}
                      </h3>
                      <p className="text-sm mb-4" style={{ 
                        color: '#E0E0E0',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                        lineHeight: '1.6'
                      }}>
                        {pricingTiers.growth.stage}
                      </p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline justify-center mb-2">
                        <span className="text-4xl font-extrabold" style={{ 
                          color: '#3b82f6',
                          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                        }}>
                          ${billingPeriod === 'monthly' ? pricingTiers.growth.monthly.toLocaleString() : pricingTiers.growth.annual.toLocaleString()}
                        </span>
                        <span className="ml-2 text-lg" style={{ 
                          color: '#E0E0E0',
                          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                        }}>
                          /{billingPeriod === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                      {billingPeriod === 'annual' && (
                        <p className="text-xs text-center" style={{ 
                          color: '#10b981',
                          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                        }}>
                          Save ${calculateSavings(pricingTiers.growth.monthly, pricingTiers.growth.annual).toLocaleString()}/year
                        </p>
                      )}
                    </div>

                    {/* Technical Deliverables */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ 
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        Technical Deliverables
                      </h4>
                      <ul className="space-y-2 text-left">
                        {[
                          { text: 'Everything in Foundations, plus:', tooltip: '' },
                          { text: 'Custom Rate Limits & API Quotas', tooltip: 'Configure custom rate limits and API quotas based on your infrastructure needs' },
                          { text: '99.9% Uptime SLO Configuration', tooltip: 'Configure Service Level Objectives (SLOs) with configurable alerts and escalation paths' },
                          { text: 'Dedicated Slack Channel with Technical Team', tooltip: 'Direct communication channel with engineering team for rapid issue resolution' },
                          { text: 'Direct Feature Request Portal Access', tooltip: 'Prioritized access to submit and track feature requests on the product roadmap' },
                          { text: 'Priority Support (4hr Response SLA)', tooltip: 'Priority technical support with guaranteed 4-hour response time for critical issues' }
                        ].map((item, index) => (
                          <li key={index} className="flex items-start text-xs" style={{
                            color: '#E0E0E0',
                            fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                            lineHeight: '1.6'
                          }}>
                            <Check className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" style={{ color: '#3b82f6' }} />
                            {item.tooltip && item.tooltip.trim() ? (
                              <Tooltip text={item.tooltip}>
                                <span>{item.text}</span>
                              </Tooltip>
                            ) : (
                              <span>{item.text}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Inline Trust Signal */}
                    <div className="mb-6 p-3 rounded-lg text-center" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <p className="text-xs font-medium" style={{
                        color: '#10b981',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        ✓ Used by 50+ Series A Companies
                      </p>
                    </div>

                    {/* Measurable Outcomes */}
                    <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ 
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        Measurable Outcomes
                      </h4>
                      <ul className="space-y-3 text-left">
                        {pricingTiers.growth.measurableOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start text-xs" style={{
                            color: '#E0E0E0',
                            fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                            lineHeight: '1.6'
                          }}>
                            <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5" style={{ background: '#3b82f6' }}>
                              <span className="text-white text-xs font-bold" style={{ fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)' }}>{index + 1}</span>
                            </div>
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={handleStripeClick}
                      className="w-full px-6 py-3 rounded-lg font-semibold text-sm text-center transition-all duration-300 flex items-center justify-center gap-2"
                      style={{
                        background: '#3b82f6',
                        border: '1px solid #3b82f6',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                        fontWeight: '600'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#2563eb';
                        e.currentTarget.style.borderColor = '#2563eb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#3b82f6';
                        e.currentTarget.style.borderColor = '#3b82f6';
                      }}
                    >
                      <span>Activate Account & Schedule Onboarding Call</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Tier 3: Series B & Beyond / Enterprise */}
              <motion.div variants={fadeInUp} className="relative">
                <div
                  className="p-8 rounded-xl relative transition-all duration-300"
                  style={{
                    background: '#1A1A1A',
                    border: '1px solid transparent',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
                  }}
                >
                  <div className="relative">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2" style={{ 
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                        letterSpacing: '0.01em'
                      }}>
                        {pricingTiers.scale.name}
                      </h3>
                      <p className="text-sm mb-4" style={{ 
                        color: '#E0E0E0',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                        lineHeight: '1.6'
                      }}>
                        {pricingTiers.scale.stage}
                      </p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline justify-center mb-2">
                        <span className="text-4xl font-extrabold" style={{ 
                          color: '#3b82f6',
                          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                        }}>
                          ${billingPeriod === 'monthly' ? pricingTiers.scale.monthly.toLocaleString() : pricingTiers.scale.annual.toLocaleString()}
                        </span>
                        <span className="ml-2 text-lg" style={{ 
                          color: '#E0E0E0',
                          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                        }}>
                          /{billingPeriod === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                      {billingPeriod === 'annual' && (
                        <p className="text-xs text-center" style={{ 
                          color: '#10b981',
                          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                        }}>
                          Save ${calculateSavings(pricingTiers.scale.monthly, pricingTiers.scale.annual).toLocaleString()}/year
                        </p>
                      )}
                    </div>

                    {/* Technical Deliverables */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ 
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        Technical Deliverables
                      </h4>
                      <ul className="space-y-2 text-left">
                        {[
                          { text: 'Everything in Growth, plus:', tooltip: '' },
                          { text: 'Custom AI Models Trained on Your Market Data', tooltip: 'Dedicated AI models fine-tuned on your specific market data for enhanced accuracy' },
                          { text: 'Dedicated Environment & Infrastructure', tooltip: 'Isolated infrastructure deployment with dedicated resources and custom configurations' },
                          { text: 'Quarterly Technical Reviews & Roadmap Planning', tooltip: 'Quarterly sessions with technical PM to review progress and plan feature roadmap' },
                          { text: 'White-Glove Onboarding with Dedicated Technical PM', tooltip: 'Dedicated technical project manager for personalized onboarding and integration' },
                          { text: 'SOC 2 & ISO 27001 Compliance Documentation', tooltip: 'Complete compliance documentation and certifications for enterprise security requirements' },
                          { text: '24/7 Technical Support with Dedicated Escalation Path', tooltip: 'Round-the-clock support with dedicated escalation path for critical issues' }
                        ].map((item, index) => (
                          <li key={index} className="flex items-start text-xs" style={{
                            color: '#E0E0E0',
                            fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                            lineHeight: '1.6'
                          }}>
                            <Check className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" style={{ color: '#3b82f6' }} />
                            {item.tooltip && item.tooltip.trim() ? (
                              <Tooltip text={item.tooltip}>
                                <span>{item.text}</span>
                              </Tooltip>
                            ) : (
                              <span>{item.text}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Inline Trust Signal */}
                    <div className="mb-6 p-3 rounded-lg text-center" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <p className="text-xs font-medium" style={{
                        color: '#3b82f6',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        ✓ SOC 2 Type II Compliant • Enterprise Ready
                      </p>
                    </div>

                    {/* Measurable Outcomes */}
                    <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ 
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        Measurable Outcomes
                      </h4>
                      <ul className="space-y-3 text-left">
                        {pricingTiers.scale.measurableOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start text-xs" style={{
                            color: '#E0E0E0',
                            fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                            lineHeight: '1.6'
                          }}>
                            <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5" style={{ background: '#3b82f6' }}>
                              <span className="text-white text-xs font-bold" style={{ fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)' }}>{index + 1}</span>
                            </div>
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={handleCalendlyClick}
                      className="w-full px-6 py-3 rounded-lg font-semibold text-sm text-center transition-all duration-300 flex items-center justify-center gap-2"
                      style={{
                        background: '#1A1A1A',
                        border: '1px solid transparent',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                        fontWeight: '600'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#3b82f6';
                        e.currentTarget.style.borderColor = '#3b82f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#1A1A1A';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      <span>Book Technical Scoping Call & Architecture Review</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Comparison Table Section */}
        <section className="mb-24 relative">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp} className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ 
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  letterSpacing: '0.02em'
                }}>
                  Feature Comparison
                </h2>
                <p className="text-lg" style={{ 
                  color: '#E0E0E0',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  lineHeight: '1.7'
                }}>
                  Dense comparison for technical founders who need to scan features quickly
                </p>
              </div>
              
              {/* Export/Share Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Generate and download comparison CSV
                    const csv = generateComparisonCSV();
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'andru-pricing-comparison.csv';
                    a.click();
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2"
                  style={{
                    background: '#1A1A1A',
                    border: '1px solid transparent',
                    color: '#E0E0E0',
                    fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.color = '#E0E0E0';
                  }}
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
                <button
                  onClick={() => {
                    navigator.share?.({
                      title: 'Andru Platform Pricing',
                      text: 'Check out Andru platform pricing comparison',
                      url: window.location.href
                    }).catch(() => {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard');
                    });
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2"
                  style={{
                    background: '#1A1A1A',
                    border: '1px solid transparent',
                    color: '#E0E0E0',
                    fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.color = '#E0E0E0';
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </motion.div>

            {/* Comparison Table */}
            <motion.div variants={fadeInUp}>
              <div className="overflow-x-auto rounded-xl" style={{
                background: '#1A1A1A',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <th className="text-left p-4 font-semibold text-sm uppercase tracking-wider" style={{
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        Feature
                      </th>
                      <th className="text-center p-4 font-semibold text-sm uppercase tracking-wider" style={{
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        Pilot / Dev Stage
                      </th>
                      <th className="text-center p-4 font-semibold text-sm uppercase tracking-wider relative" style={{
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        Product-Market Fit / Scale Prep
                        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded" style={{
                          background: '#3b82f6',
                          color: '#FFFFFF',
                          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                        }}>
                          Recommended
                        </span>
                      </th>
                      <th className="text-center p-4 font-semibold text-sm uppercase tracking-wider" style={{
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        Series B & Beyond
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'API Rate Limits', foundations: 'Basic', growth: 'Custom Quotas', scale: 'Dedicated Environment' },
                      { feature: 'Technical Onboarding', foundations: '3-Hour Session', growth: 'Dedicated Slack Channel', scale: 'White-Glove + Technical PM' },
                      { feature: 'Support SLA', foundations: '24hr Response', growth: '4hr Response', scale: '24/7 + Escalation Path' },
                      { feature: 'Uptime SLO Configuration', foundations: '—', growth: '99.9% Configurable', scale: '99.99% + Custom SLAs' },
                      { feature: 'ICP Generation', foundations: '✓ Pure Signal', growth: '✓ + Custom Models', scale: '✓ + Trained on Your Data' },
                      { feature: 'Export Formats', foundations: 'JSON, CSV', growth: 'JSON, CSV, PDF', scale: 'All + CRM Push' },
                      { feature: 'Feature Request Portal', foundations: '—', growth: '✓ Prioritized Access', scale: '✓ Direct Roadmap Influence' },
                      { feature: 'Custom AI Models', foundations: '—', growth: '—', scale: '✓ Trained on Market Data' },
                      { feature: 'Quarterly Reviews', foundations: '—', growth: '—', scale: '✓ Technical Roadmap Planning' },
                      { feature: 'Compliance Documentation', foundations: '—', growth: '—', scale: '✓ SOC 2 & ISO 27001' }
                    ].map((row, index) => (
                      <tr 
                        key={index} 
                        className="hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                        style={{ 
                          borderBottom: index < 9 ? '1px solid transparent' : 'none'
                        }}
                      >
                        <td className="p-4 text-sm font-medium" style={{
                          color: '#E0E0E0',
                          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                        }}>
                          {row.feature}
                        </td>
                        <td className="p-4 text-sm text-center" style={{
                          color: '#E0E0E0',
                          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                        }}>
                          {row.foundations === '✓' || row.foundations === '—' ? (
                            <span style={{ color: row.foundations === '✓' ? '#10b981' : 'rgba(255, 255, 255, 0.3)' }}>
                              {row.foundations}
                            </span>
                          ) : (
                            row.foundations
                          )}
                        </td>
                        <td className="p-4 text-sm text-center relative" style={{
                          color: '#E0E0E0',
                          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                          background: 'rgba(59, 130, 246, 0.05)'
                        }}>
                          {row.growth === '✓' || row.growth === '—' ? (
                            <span style={{ color: row.growth === '✓' ? '#10b981' : 'rgba(255, 255, 255, 0.3)' }}>
                              {row.growth}
                            </span>
                          ) : (
                            row.growth
                          )}
                        </td>
                        <td className="p-4 text-sm text-center" style={{
                          color: '#E0E0E0',
                          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                        }}>
                          {row.scale === '✓' || row.scale === '—' ? (
                            <span style={{ color: row.scale === '✓' ? '#10b981' : 'rgba(255, 255, 255, 0.3)' }}>
                              {row.scale}
                            </span>
                          ) : (
                            row.scale
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Trust Signals Section */}
        <section className="mb-24 relative">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ 
                color: '#FFFFFF',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                letterSpacing: '0.02em'
              }}>
                Trust Signals
              </h2>
              <p className="text-lg" style={{ 
                color: '#E0E0E0',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.7'
              }}>
                Built for technical founders who value security, integration, and peer validation
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Security Badges */}
              <motion.div variants={fadeInUp} className="text-center p-6 rounded-lg" style={{
                background: '#1A1A1A',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <h3 className="text-lg font-semibold mb-4" style={{
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                }}>
                  Security & Compliance
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="px-4 py-2 rounded" style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <p className="text-sm font-medium" style={{
                      color: '#E0E0E0',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                    }}>
                      SOC 2 Type II (In Progress)
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded" style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <p className="text-sm font-medium" style={{
                      color: '#E0E0E0',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                    }}>
                      ISO 27001 (Target Q2 2026)
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Integration Icons */}
              <motion.div variants={fadeInUp} className="text-center p-6 rounded-lg" style={{
                background: '#1A1A1A',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <h3 className="text-lg font-semibold mb-4" style={{
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                }}>
                  Native Integrations
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {['GitHub', 'AWS', 'Stripe', 'Slack', 'JSON/CSV'].map((integration, index) => (
                    <div key={index} className="px-4 py-2 rounded text-xs font-medium" style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid transparent',
                      color: '#E0E0E0',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                    }}>
                      {integration}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Founder Quote */}
              <motion.div variants={fadeInUp} className="text-center p-6 rounded-lg" style={{
                background: '#1A1A1A',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <h3 className="text-lg font-semibold mb-4" style={{
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                }}>
                  Technical Founder Validation
                </h3>
                <blockquote className="text-sm italic mb-3" style={{
                  color: '#E0E0E0',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  lineHeight: '1.7'
                }}>
                  "Finally, an ICP tool that speaks engineer. The API-first approach and quantifiable outputs cut our sales cycle by 40%."
                </blockquote>
                <p className="text-xs" style={{
                  color: '#E0E0E0',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                }}>
                  — CTO, Series A SaaS Company
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}