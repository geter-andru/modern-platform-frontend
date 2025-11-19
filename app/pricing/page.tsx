'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles, Users, Zap, DollarSign, Calendar, TrendingDown, Award, Shield, BarChart3, Calculator, Info } from 'lucide-react';
import Link from 'next/link';
import { GradientButton } from '../../src/shared/components/ui/GradientButton';
import { FooterLayout } from '../../src/shared/components/layout/FooterLayout';
import { MotionBackground } from '../../src/shared/components/ui/MotionBackground';
import { PublicHeader } from '../../src/shared/components/layout/PublicHeader';
import { initPublicPageTracking, trackCtaClick } from '../lib/analytics/publicPageTracking';

/**
 * Pricing Page - Paid Waitlist Launch
 *
 * FOUNDING MEMBER PRICING STRATEGY:
 * - Early Access: $497/month (Dec 1, 2025 - Full Platform Launch)
 * - Forever Lock: $750/month (Full Platform onwards - NEVER increases)
 * - Standard: $1,250/month (for non-founding members)
 * - Savings: $6,000/year forever vs. standard pricing
 *
 * Routes: /pricing
 * Last Updated: 2025-11-10 (Updated for Paid Waitlist Launch)
 */

// ROI Calculator Component
function ROICalculator() {
  const [dealSize, setDealSize] = useState(50000);
  const [closeRate, setCloseRate] = useState(20);
  const [currentRunway, setCurrentRunway] = useState(12); // Changed from salesCycle
  const [dealsPerMonth, setDealsPerMonth] = useState(5);
  const [monthlyARR, setMonthlyARR] = useState(100000); // Added for runway calculation

  // Calculations
  const currentMonthlyRevenue = (dealSize * (closeRate / 100) * dealsPerMonth);
  const improvedCloseRate = Math.min(closeRate * 1.4, 100); // 40% improvement, capped at 100%
  const newMonthlyRevenue = (dealSize * (improvedCloseRate / 100) * dealsPerMonth);
  const monthlyGain = newMonthlyRevenue - currentMonthlyRevenue;
  const annualGain = monthlyGain * 12;
  const andruCost = 9000; // $750/month * 12
  const netAnnualROI = annualGain - andruCost;
  const roiMultiple = netAnnualROI / andruCost;

  // Runway calculation: (Additional Revenue × 12) / (2.25 × Monthly ARR)
  const burnMultiple = 2.25;
  const addedRunwayMonths = (monthlyGain * 12) / (burnMultiple * monthlyARR);

  // Founding member savings
  const standardPricing = 1250; // $1,250/month standard
  const foundingMemberPricing = 750; // $750/month founding member
  const monthlySavings = standardPricing - foundingMemberPricing;
  const annualSavings = monthlySavings * 12; // $6,000/year
  const threeYearValue = annualSavings * 3; // $18,000 over 3 years

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative" style={{
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
    }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <Calculator className="w-4 h-4" style={{ color: '#3b82f6' }} />
              <span className="text-sm font-semibold" style={{ color: '#3b82f6' }}>INTERACTIVE ROI CALCULATOR</span>
            </div>
            <h2 className="heading-2 mb-4" style={{ color: '#FFFFFF' }}>
              Calculate Your ROI
            </h2>
            <p className="text-xl" style={{ color: '#E0E0E0' }}>
              See exactly how much revenue you're leaving on the table
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="p-8 rounded-2xl" style={{
              background: '#1A1A1A',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: '#FFFFFF' }}>Your Current Metrics</h3>
              <div className="space-y-6">
                {/* Average Deal Size */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#E0E0E0' }}>
                    Average Deal Size
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="10000"
                      max="500000"
                      step="10000"
                      value={dealSize}
                      onChange={(e) => setDealSize(Number(e.target.value))}
                      className="flex-1"
                      style={{
                        accentColor: '#3b82f6'
                      }}
                    />
                    <input
                      type="number"
                      value={dealSize}
                      onChange={(e) => setDealSize(Number(e.target.value))}
                      className="w-32 px-3 py-2 rounded-lg text-right"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF'
                      }}
                    />
                  </div>
                  <p className="text-sm mt-1" style={{ color: '#a3a3a3' }}>{formatCurrency(dealSize)}</p>
                </div>

                {/* Close Rate */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#E0E0E0' }}>
                    Current Close Rate (%)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={closeRate}
                      onChange={(e) => setCloseRate(Number(e.target.value))}
                      className="flex-1"
                      style={{
                        accentColor: '#3b82f6'
                      }}
                    />
                    <input
                      type="number"
                      value={closeRate}
                      onChange={(e) => setCloseRate(Number(e.target.value))}
                      className="w-32 px-3 py-2 rounded-lg text-right"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF'
                      }}
                    />
                  </div>
                  <p className="text-sm mt-1" style={{ color: '#a3a3a3' }}>{closeRate}%</p>
                </div>

                {/* Current Runway Remaining */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#E0E0E0' }}>
                    Current Runway Remaining (months)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="6"
                      max="24"
                      step="1"
                      value={currentRunway}
                      onChange={(e) => setCurrentRunway(Number(e.target.value))}
                      className="flex-1"
                      style={{
                        accentColor: '#3b82f6'
                      }}
                    />
                    <input
                      type="number"
                      value={currentRunway}
                      onChange={(e) => setCurrentRunway(Number(e.target.value))}
                      className="w-32 px-3 py-2 rounded-lg text-right"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF'
                      }}
                    />
                  </div>
                  <p className="text-sm mt-1" style={{ color: '#a3a3a3' }}>{currentRunway} months</p>
                </div>

                {/* Monthly ARR (for runway calculation) */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#E0E0E0' }}>
                    Current Monthly ARR
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="50000"
                      max="1000000"
                      step="50000"
                      value={monthlyARR}
                      onChange={(e) => setMonthlyARR(Number(e.target.value))}
                      className="flex-1"
                      style={{
                        accentColor: '#3b82f6'
                      }}
                    />
                    <input
                      type="number"
                      value={monthlyARR}
                      onChange={(e) => setMonthlyARR(Number(e.target.value))}
                      className="w-32 px-3 py-2 rounded-lg text-right"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF'
                      }}
                    />
                  </div>
                  <p className="text-sm mt-1" style={{ color: '#a3a3a3' }}>{formatCurrency(monthlyARR)}/month</p>
                </div>

                {/* Deals Per Month */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#E0E0E0' }}>
                    New Opportunities per Month
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={dealsPerMonth}
                      onChange={(e) => setDealsPerMonth(Number(e.target.value))}
                      className="flex-1"
                      style={{
                        accentColor: '#3b82f6'
                      }}
                    />
                    <input
                      type="number"
                      value={dealsPerMonth}
                      onChange={(e) => setDealsPerMonth(Number(e.target.value))}
                      className="w-32 px-3 py-2 rounded-lg text-right"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF'
                      }}
                    />
                  </div>
                  <p className="text-sm mt-1" style={{ color: '#a3a3a3' }}>{dealsPerMonth} deals/month</p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="p-8 rounded-2xl" style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: '#FFFFFF' }}>Your Projected Results with Andru</h3>
              <div className="space-y-6">
                {/* Current vs New Monthly Revenue */}
                <div className="p-4 rounded-xl" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <p className="text-sm mb-1" style={{ color: '#a3a3a3' }}>Current Monthly Revenue</p>
                  <p className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>{formatCurrency(currentMonthlyRevenue)}</p>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="w-6 h-6" style={{ color: '#10b981' }} />
                </div>

                <div className="p-4 rounded-xl" style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <p className="text-sm mb-1" style={{ color: '#a7f3d0' }}>New Monthly Revenue with Andru</p>
                  <p className="text-2xl font-bold" style={{ color: '#10b981' }}>{formatCurrency(newMonthlyRevenue)}</p>
                  <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                    <p className="text-xs" style={{ color: '#a7f3d0' }}>
                      ✓ Close rate: {closeRate}% → {improvedCloseRate.toFixed(0)}%
                    </p>
                  </div>
                </div>

                {/* Monthly Gain */}
                <div className="p-5 rounded-xl text-center" style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid rgba(16, 185, 129, 0.4)'
                }}>
                  <p className="text-sm mb-1" style={{ color: '#a7f3d0' }}>Additional Revenue Per Month</p>
                  <p className="text-3xl font-bold" style={{ color: '#10b981' }}>+{formatCurrency(monthlyGain)}</p>
                </div>

                {/* Added Runway Months */}
                <div className="p-5 rounded-xl text-center" style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid rgba(16, 185, 129, 0.4)'
                }}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <p className="text-sm" style={{ color: '#a7f3d0' }}>Added Runway Months</p>
                    <div className="group relative">
                      <Info className="w-4 h-4 cursor-help" style={{ color: '#a7f3d0' }} />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all" style={{
                        background: '#1A1A1A',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                      }}>
                        <p className="text-xs" style={{ color: '#E0E0E0', lineHeight: '1.4' }}>
                          The average burn multiple for a Series A AI SaaS startup in 2025 is highly competitive, with sub-1.0× being elite and 1.5× to 2.0× being considered acceptable or &apos;good&apos;. While traditional SaaS startups have median burn multiples around 1.6×, AI-native companies can achieve lower ratios by growing revenue much faster, sometimes exceeding $1M ARR within their first year.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: '#10b981' }}>{addedRunwayMonths.toFixed(1)} months</p>
                  <p className="text-xs mt-2" style={{ color: '#a3a3a3' }}>
                    Based on average monthly burn multiple of {burnMultiple}×
                  </p>
                </div>

                {/* Annual ROI */}
                <div className="p-5 rounded-xl text-center" style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                  border: '2px solid rgba(59, 130, 246, 0.5)'
                }}>
                  <p className="text-sm mb-1" style={{ color: '#93c5fd' }}>Annual Net ROI</p>
                  <p className="text-4xl font-bold mb-2" style={{ color: '#3b82f6' }}>{formatCurrency(netAnnualROI)}</p>
                  <p className="text-sm" style={{ color: '#93c5fd' }}>
                    {roiMultiple.toFixed(1)}x return on investment
                  </p>
                  <p className="text-xs mt-2" style={{ color: '#a3a3a3' }}>
                    (After Andru's $9,000/year cost)
                  </p>
                </div>

                {/* Founding Member Bonus */}
                <div className="p-6 rounded-xl text-center" style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                  border: '2px solid rgba(16, 185, 129, 0.5)',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
                }}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)'
                  }}>
                    <Award className="w-4 h-4" style={{ color: '#10b981' }} />
                    <span className="text-xs font-bold" style={{ color: '#10b981' }}>FOUNDING MEMBER BONUS</span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#a7f3d0' }}>Additional Annual Savings</p>
                  <p className="text-4xl font-bold mb-1" style={{ color: '#10b981' }}>+{formatCurrency(annualSavings)}/year</p>
                  <p className="text-sm mb-4" style={{ color: '#a7f3d0' }}>
                    ${monthlySavings}/month × 12 months = {formatCurrency(annualSavings)} saved annually
                  </p>
                  <div className="pt-4 border-t" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                    <p className="text-lg font-bold mb-1" style={{ color: '#FFFFFF' }}>
                      Total Annual Value: {formatCurrency(netAnnualROI + annualSavings)}
                    </p>
                    <p className="text-xs" style={{ color: '#a7f3d0' }}>
                      (ROI + Founding Member Savings)
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                    <p className="text-xs font-bold mb-1" style={{ color: '#a7f3d0' }}>3-YEAR VALUE</p>
                    <p className="text-2xl font-bold" style={{ color: '#10b981' }}>
                      {formatCurrency(threeYearValue)} in guaranteed savings
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#a3a3a3' }}>
                      Lock in $750/month forever (vs. $1,250/month standard)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Insight */}
          <motion.div variants={fadeInUp} className="mt-8 p-6 rounded-xl text-center" style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <p className="text-xl font-bold mb-2" style={{ color: '#10b981' }}>
              You're leaving {formatCurrency(annualGain)} on the table this year
            </p>
            <p style={{ color: '#E0E0E0' }}>
              Based on conservative 40% improvement to close rate that our founding members achieve
            </p>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}

export default function PricingPage() {
  // Initialize public page tracking
  useEffect(() => {
    initPublicPageTracking('/pricing', 'Pricing - Lock in $750/month Forever');
  }, []);

  // CTA click handler
  const handleCtaClick = (ctaText: string, ctaLocation: string) => {
    trackCtaClick({
      ctaText,
      ctaLocation,
      pagePath: '/pricing'
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
      color: '#E0E0E0',
      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
    }}>
      <MotionBackground />
      <PublicHeader />

      {/* Problem-First Opening Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
              style={{
                color: '#FFFFFF',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.2'
              }}
            >
              Before You Hire a $180K VP of Sales...
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl mb-8"
              style={{
                color: '#E0E0E0',
                lineHeight: '1.6'
              }}
            >
              Ask yourself: Do they even know who to sell to?
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="max-w-3xl mx-auto space-y-4 mb-12"
            >
              {[
                'Most technical founders hire sales leadership hoping they\'ll "figure out the ICP"',
                'Reality: They burn 6 months and $90K learning what you should\'ve known on Day 1',
                'The VP you\'re about to hire will ask: "What\'s our ideal customer profile?"'
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl text-left"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <p style={{ color: '#fca5a5', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    {item}
                  </p>
                </div>
              ))}
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="text-2xl sm:text-3xl font-bold mb-4"
              style={{
                color: '#3b82f6',
                lineHeight: '1.4'
              }}
            >
              Get ICP clarity BEFORE you hire sales.
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-xl mb-12"
              style={{
                color: '#E0E0E0',
                lineHeight: '1.6'
              }}
            >
              Save $90K in wasted ramp time. Start with the answers, not the guesswork.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pb-16">

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Waitlist Badge */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full" style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)'
              }}>
                <Sparkles className="w-5 h-5" style={{ color: '#3b82f6' }} />
                <span className="body-small" style={{
                  color: '#3b82f6',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  letterSpacing: '0.5px',
                  fontWeight: 700
                }}>
                  PAID WAITLIST • DECEMBER 1, 2025 ACCESS
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight"
              style={{
                color: '#FFFFFF',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 700,
                letterSpacing: '-0.02em'
              }}
            >
              Lock in $750/month Forever
            </motion.h1>

            {/* Subheadline */}
            <motion.div
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
              style={{
                color: '#3b82f6',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 600,
                letterSpacing: '-0.01em'
              }}
            >
              vs. $1,250 Standard Price
            </motion.div>

            {/* Value Proposition */}
            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl max-w-4xl mx-auto mb-4 leading-relaxed"
              style={{
                color: '#E0E0E0',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.7'
              }}
            >
              Pay $497/month during early access, then $750/month forever.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-2xl sm:text-3xl max-w-3xl mx-auto mb-16 leading-relaxed font-bold"
              style={{
                color: '#10b981',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.6'
              }}
            >
              Save $6,000/year. Every year. Forever.
            </motion.p>

            {/* Pricing Cards Grid */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">

              {/* Founding Member Card */}
              <motion.div
                variants={fadeInUp}
                className="relative p-10 rounded-2xl"
                style={{
                  background: '#1A1A1A',
                  border: '2px solid rgba(59, 130, 246, 0.4)',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
                }}
              >
                {/* Recommended Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="px-6 py-2 rounded-full" style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                  }}>
                    <p className="body-small text-white flex items-center gap-2" style={{ fontWeight: 700 }}>
                      <Award className="w-4 h-4" />
                      100 Founding Member Spots
                    </p>
                  </div>
                </div>

                <div className="mb-8 mt-4">
                  <h2 className="heading-2 mb-3" style={{ color: '#FFFFFF' }}>
                    Founding Member
                  </h2>
                  <p className="body text-center" style={{ color: '#E0E0E0' }}>
                    Forever price lock + immediate value
                  </p>
                </div>

                {/* Pricing Display */}
                <div className="mb-6 text-center">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold" style={{ color: '#FFFFFF' }}>$497</span>
                    <span className="text-xl" style={{ color: '#E0E0E0' }}>/month</span>
                  </div>
                  <div className="text-lg mb-4" style={{ color: '#8b5cf6', fontWeight: 600 }}>
                    During early access period
                  </div>
                  <div className="flex items-center justify-center gap-2 p-4 rounded-lg" style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    <ArrowRight className="w-5 h-5" style={{ color: '#10b981' }} />
                    <span style={{ color: '#10b981', fontWeight: 600, fontSize: '1.1rem' }}>
                      Then $750/month forever when full platform launches
                    </span>
                  </div>
                </div>

                {/* Savings Highlight */}
                <div className="mb-6 p-4 rounded-lg text-center" style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <div className="text-sm mb-1" style={{ color: '#E0E0E0' }}>Your Forever Savings</div>
                  <div className="text-3xl font-bold" style={{ color: '#10b981' }}>
                    $6,000/year
                  </div>
                  <div className="text-sm" style={{ color: '#E0E0E0' }}>vs. $1,250 standard pricing</div>
                </div>

                {/* Benefits */}
                <div className="space-y-3 mb-8 text-left">
                  {[
                    '2 hours of 1:1 founder strategy sessions ($1,000+ value)',
                    'Immediate ICP Analysis Package delivery',
                    'Early access to each tool as it rolls out',
                    'Private Slack community access',
                    'Forever price lock at $750/month',
                    'Priority support and feature requests'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                      <span className="body" style={{ color: '#E0E0E0' }}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <a
                  href="https://buy.stripe.com/6oU9AVgJn4y78iqdU6bsc0n"
                  className="block w-full px-8 py-5 rounded-xl font-bold text-lg text-center transition-all transform hover:-translate-y-1"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
                    border: 'none'
                  }}
                >
                  Join Waitlist - $497/month
                </a>

                {/* Trust Signal */}
                <p className="mt-4 body-small text-center" style={{ color: '#E0E0E0' }}>
                  Access unlocks December 1, 2025 • Cancel anytime
                </p>
              </motion.div>

              {/* Urgent Assistance Card */}
              <motion.div
                variants={fadeInUp}
                className="p-10 rounded-2xl"
                style={{
                  background: '#1A1A1A',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-6 h-6" style={{ color: '#f59e0b' }} />
                    <h2 className="heading-2" style={{ color: '#FFFFFF' }}>
                      Urgent Assistance
                    </h2>
                  </div>
                  <p className="body text-center" style={{ color: '#E0E0E0' }}>
                    Need help NOW? Get immediate support.
                  </p>
                </div>

                {/* Pricing */}
                <div className="mb-6 text-center">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold" style={{ color: '#FFFFFF' }}>$350</span>
                    <span className="text-xl" style={{ color: '#E0E0E0' }}>one-time</span>
                  </div>
                  <div className="text-lg" style={{ color: '#f59e0b', fontWeight: 600 }}>
                    90-minute strategy session
                  </div>
                </div>

                {/* What's Included */}
                <div className="space-y-3 mb-8 text-left">
                  {[
                    'Active deal assistance - close deals THIS WEEK',
                    'Sales hiring strategy - build your team right',
                    'Sales onboarding guidance - ramp new hires faster',
                    'Immediate action plan you can execute today',
                    'Can be applied to founding membership within 7 days'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
                      <span className="body" style={{ color: '#E0E0E0' }}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <a
                  href="https://calendly.com/humusnshore/urgent-assistance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-8 py-5 rounded-xl font-bold text-lg text-center transition-all transform hover:-translate-y-1"
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '2px solid rgba(245, 158, 11, 0.4)',
                    color: '#f59e0b',
                    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.2)'
                  }}
                >
                  Book Session - $350
                </a>

                <p className="mt-4 body-small text-center" style={{ color: '#E0E0E0' }}>
                  Available immediately • Book your preferred time
                </p>
              </motion.div>

            </div>

          </motion.div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2
              variants={fadeInUp}
              className="heading-2 mb-4 text-center"
              style={{ color: '#FFFFFF' }}
            >
              Compare Your Options
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-center mb-12 max-w-3xl mx-auto"
              style={{ color: '#E0E0E0' }}
            >
              Andru founding members get 10x better ROI than traditional sales solutions
            </motion.p>

            {/* Comparison Table */}
            <motion.div variants={fadeInUp} className="overflow-x-auto">
              <table className="w-full border-collapse" style={{
                background: '#1A1A1A',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px'
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(59, 130, 246, 0.3)' }}>
                    <th className="p-4 text-left" style={{ color: '#FFFFFF', fontWeight: 700 }}>Solution</th>
                    <th className="p-4 text-left" style={{ color: '#FFFFFF', fontWeight: 700 }}>Monthly Cost</th>
                    <th className="p-4 text-left" style={{ color: '#FFFFFF', fontWeight: 700 }}>Annual Cost</th>
                    <th className="p-4 text-left" style={{ color: '#FFFFFF', fontWeight: 700 }}>3-Year Total</th>
                    <th className="p-4 text-left" style={{ color: '#FFFFFF', fontWeight: 700 }}>vs. Andru</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Andru Founding Member */}
                  <tr style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" style={{ color: '#3b82f6' }} />
                        <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Andru Founding Member</span>
                      </div>
                    </td>
                    <td className="p-4" style={{ color: '#10b981', fontWeight: 700 }}>$497 → $750</td>
                    <td className="p-4" style={{ color: '#10b981', fontWeight: 700 }}>$9,000</td>
                    <td className="p-4" style={{ color: '#10b981', fontWeight: 700 }}>~$26,000</td>
                    <td className="p-4" style={{ color: '#10b981', fontWeight: 700 }}>Baseline</td>
                  </tr>

                  {/* Andru Standard */}
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td className="p-4" style={{ color: '#E0E0E0' }}>Andru Standard</td>
                    <td className="p-4" style={{ color: '#E0E0E0' }}>$1,250</td>
                    <td className="p-4" style={{ color: '#E0E0E0' }}>$15,000</td>
                    <td className="p-4" style={{ color: '#E0E0E0' }}>$45,000</td>
                    <td className="p-4" style={{ color: '#ef4444', fontWeight: 700 }}>-$19,000</td>
                  </tr>

                  {/* Fractional VP Sales */}
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td className="p-4" style={{ color: '#E0E0E0' }}>Fractional VP Sales</td>
                    <td className="p-4" style={{ color: '#E0E0E0' }}>$8K - $15K</td>
                    <td className="p-4" style={{ color: '#E0E0E0' }}>$96K - $180K</td>
                    <td className="p-4" style={{ color: '#E0E0E0' }}>$288K - $540K</td>
                    <td className="p-4" style={{ color: '#ef4444', fontWeight: 700 }}>-$262K - $514K</td>
                  </tr>

                  {/* Full-Time Sales Hire */}
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td className="p-4" style={{ color: '#E0E0E0' }}>Full-Time Sales Hire</td>
                    <td className="p-4" style={{ color: '#E0E0E0' }}>$12K - $20K</td>
                    <td className="p-4" style={{ color: '#E0E0E0' }}>$144K - $240K</td>
                    <td className="p-4" style={{ color: '#E0E0E0' }}>$432K - $720K</td>
                    <td className="p-4" style={{ color: '#ef4444', fontWeight: 700 }}>-$406K - $694K</td>
                  </tr>

                  {/* DIY Tools */}
                  <tr>
                    <td className="p-4" style={{ color: '#E0E0E0' }}>DIY Tools + Your Time</td>
                    <td className="p-4" style={{ color: '#E0E0E0' }}>$2K - $5K</td>
                    <td className="p-4" style={{ color: '#E0E0E0' }}>$24K - $60K</td>
                    <td className="p-4" style={{ color: '#E0E0E0' }}>$72K - $180K</td>
                    <td className="p-4" style={{ color: '#ef4444', fontWeight: 700 }}>-$46K - $154K</td>
                  </tr>
                </tbody>
              </table>
            </motion.div>

            {/* Key Insight */}
            <motion.div
              variants={fadeInUp}
              className="mt-8 p-6 rounded-xl text-center"
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              <TrendingDown className="w-8 h-8 mx-auto mb-3" style={{ color: '#10b981' }} />
              <p className="text-xl font-bold mb-2" style={{ color: '#10b981' }}>
                10-50x More Affordable Than Alternatives
              </p>
              <p style={{ color: '#E0E0E0' }}>
                Same systematic revenue outcomes at a fraction of the cost
              </p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Qualification Section: You Need This If... */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2
              variants={fadeInUp}
              className="heading-2 mb-4 text-center"
              style={{ color: '#FFFFFF' }}
            >
              You Need This If...
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-center mb-12 max-w-3xl mx-auto"
              style={{ color: '#E0E0E0' }}
            >
              Andru is built for technical founders at Series A who are drowning in sales chaos
            </motion.p>

            {/* YES - You Need This */}
            <motion.div variants={fadeInUp} className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: '#10b981' }}>
                ✓ This Is For You If:
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'You\'re at $2-10M ARR and pipeline is full but nothing\'s closing',
                  'You\'re about to hire your first VP of Sales (or just did)',
                  'Your board is asking "What\'s your ICP?" and you freeze',
                  'You\'re spending $20K+/month on sales tools nobody actually uses',
                  'Your sales cycle is 6+ months and you don\'t know why',
                  'You\'re a technical founder who needs to "figure out sales"',
                  'You have smart prospects who go silent after the first demo',
                  'You\'re hiring SDRs but they don\'t know who to call'
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                    <span style={{ color: '#a7f3d0', fontSize: '1rem', lineHeight: '1.6' }}>
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* NO - This Is NOT For You */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: '#ef4444' }}>
                ✗ This Is NOT For You If:
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'You already have a high-performing sales team closing 40%+ of pipeline',
                  'You\'re pre-revenue and still validating product-market fit',
                  'You\'re selling to consumers (B2C) instead of businesses',
                  'You just need more leads (not better qualification)',
                  'Your ACV is under $10K (too small for enterprise sales complexity)',
                  'You want a CRM or sales automation tool (we\'re buyer intelligence)'
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    <span className="flex-shrink-0 mt-0.5" style={{ color: '#fca5a5', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      ×
                    </span>
                    <span style={{ color: '#fecaca', fontSize: '1rem', lineHeight: '1.6' }}>
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Bottom CTA */}
            <motion.div variants={fadeInUp} className="mt-12 text-center">
              <p className="text-xl mb-6" style={{ color: '#E0E0E0' }}>
                If 3+ items in the "Yes" list sound like you, Andru will save you months of wasted effort.
              </p>
              <a
                href="https://buy.stripe.com/6oU9AVgJn4y78iqdU6bsc0n"
                onClick={() => handleCtaClick('Join Waitlist from Qualification', 'qualification-section')}
                className="inline-flex items-center gap-2 px-10 py-5 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
                }}
              >
                Join Waitlist - $497/month
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <ROICalculator />

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2
              variants={fadeInUp}
              className="heading-2 mb-12 text-center"
              style={{ color: '#FFFFFF' }}
            >
              Frequently Asked Questions
            </motion.h2>

            <div className="space-y-6">
              {[
                {
                  q: 'What do I get as a founding member?',
                  a: '2 hours of 1:1 strategy sessions with the founder (worth $1,000+), immediate ICP Analysis Package, early access to each tool as it rolls out, private Slack community, priority support, and a forever price lock at $750/month when the full platform launches. Your rate never increases—ever.'
                },
                {
                  q: 'How does the forever price lock work?',
                  a: 'You pay $497/month during early access (Dec 1 - Platform Launch). When the full platform launches, your price changes to $750/month and stays there forever. While new users pay $1,250/month, you\'ll always pay $750/month. That\'s $6,000 saved every year, for as long as you use Andru.'
                },
                {
                  q: 'When does my access start?',
                  a: 'You\'ll get immediate access to your 1:1 strategy sessions, ICP package, and Slack community after payment. Full platform access unlocks on December 1, 2025. We\'ll send you login instructions via email right after you join the waitlist.'
                },
                {
                  q: 'Can I cancel anytime?',
                  a: 'Yes, absolutely. You can cancel your subscription at any time with no penalties or fees. However, once you cancel, you lose your forever price lock at $750/month. If you rejoin later, you\'ll pay the standard $1,250/month rate.'
                },
                {
                  q: 'How are the 100 founding member spots selected?',
                  a: 'First come, first served. Once 100 people join the paid waitlist, the founding member offer closes permanently. After that, new users pay $1,250/month with no price lock option.'
                },
                {
                  q: 'What\'s included in the urgent assistance session?',
                  a: 'The $350 urgent assistance session is a 90-minute 1:1 strategy call focused on immediate needs: closing active deals, building your sales team, or onboarding new sales hires. You get an actionable plan you can execute the same day. This payment can be applied toward founding membership if you join within 7 days.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="p-6 rounded-xl"
                  style={{
                    background: '#1A1A1A',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <h3 className="heading-4 mb-3" style={{ color: '#FFFFFF' }}>
                    {faq.q}
                  </h3>
                  <p style={{
                    color: '#E0E0E0',
                    fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                    lineHeight: '1.7'
                  }}>
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Continue Browsing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t" style={{
        borderColor: 'rgba(255, 255, 255, 0.08)'
      }}>
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-12" style={{
            color: '#FFFFFF',
            fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
          }}>
            Want to learn more first?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/about"
              className="p-6 rounded-xl transition-all hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textDecoration: 'none'
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5" style={{ color: '#3b82f6' }} />
                <h4 className="font-semibold" style={{ color: '#FFFFFF' }}>About Us</h4>
              </div>
              <p className="text-sm" style={{ color: '#E0E0E0', lineHeight: '1.6' }}>
                Learn about our mission and story
              </p>
            </Link>

            <Link
              href="/compare"
              className="p-6 rounded-xl transition-all hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textDecoration: 'none'
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-5 h-5" style={{ color: '#3b82f6' }} />
                <h4 className="font-semibold" style={{ color: '#FFFFFF' }}>Comparisons</h4>
              </div>
              <p className="text-sm" style={{ color: '#E0E0E0', lineHeight: '1.6' }}>
                See how Andru works with other tools
              </p>
            </Link>

            <a
              href="https://andru-ai.com/assessment"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-xl transition-all hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textDecoration: 'none'
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Calculator className="w-5 h-5" style={{ color: '#3b82f6' }} />
                <h4 className="font-semibold" style={{ color: '#FFFFFF' }}>Free Assessment</h4>
              </div>
              <p className="text-sm" style={{ color: '#E0E0E0', lineHeight: '1.6' }}>
                Try our free ICP assessment tool
              </p>
            </a>

            <Link
              href="/"
              className="p-6 rounded-xl transition-all hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textDecoration: 'none'
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-5 h-5" style={{ color: '#3b82f6' }} />
                <h4 className="font-semibold" style={{ color: '#FFFFFF' }}>Homepage</h4>
              </div>
              <p className="text-sm" style={{ color: '#E0E0E0', lineHeight: '1.6' }}>
                Back to the main page
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{
                color: '#FFFFFF',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}
            >
              Lock in $750/month Forever
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="body-large mb-10"
              style={{
                color: '#E0E0E0',
                lineHeight: '1.7'
              }}
            >
              Join 100 founding members saving $6,000/year. Every year. Forever.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <a
                href="https://buy.stripe.com/6oU9AVgJn4y78iqdU6bsc0n"
                className="inline-flex items-center gap-2 px-12 py-6 rounded-xl font-bold text-xl transition-all transform hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
                  border: 'none'
                }}
              >
                Join Waitlist - $497/month
                <ArrowRight className="w-6 h-6" />
              </a>
              <p className="mt-6 body-small" style={{ color: '#E0E0E0' }}>
                Access unlocks December 1, 2025 • 100 spots only • Cancel anytime
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <FooterLayout variant="standard" theme="dark" />
    </div>
  );
}
