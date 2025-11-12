'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles, Users, Zap, DollarSign, Calendar, TrendingDown, Award, Shield } from 'lucide-react';
import Link from 'next/link';
import { GradientButton } from '../../src/shared/components/ui/GradientButton';
import { FooterLayout } from '../../src/shared/components/layout/FooterLayout';
import { MotionBackground } from '../../src/shared/components/ui/MotionBackground';

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

export default function PricingPage() {
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

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center px-4 sm:px-6 lg:px-8">

        <div className="relative max-w-6xl mx-auto pt-20 pb-24 sm:pt-24 sm:pb-32">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
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

      {/* FAQ Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
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
