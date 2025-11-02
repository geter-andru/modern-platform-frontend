'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles, Users, Zap } from 'lucide-react';
import Link from 'next/link';

/**
 * Pricing Page - Free Beta Launch
 *
 * STAGED LAUNCH STRATEGY:
 * - Stage 1: Free Beta (Dec 2025 - Feb 2025) - 100 Founding Members
 * - Stage 2: Paid Launch (March 2025) - Founding: $149/mo, Standard: $297/mo
 *
 * Routes: /pricing
 * Last Updated: 2025-11-01 (Updated for Free Beta Launch)
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
      background: '#121212',
      color: '#E0E0E0',
      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
    }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center px-4 sm:px-6 lg:px-8">
        {/* Background Gradients */}
        <div className="absolute inset-0" style={{ background: '#121212' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/20 via-transparent to-transparent" />

        <div className="relative max-w-6xl mx-auto pt-20 pb-24 sm:pt-24 sm:pb-32">
          <motion.div
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Beta Badge */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full" style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)'
              }}>
                <Sparkles className="w-5 h-5" style={{ color: '#3b82f6' }} />
                <span className="text-sm font-bold" style={{
                  color: '#3b82f6',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  letterSpacing: '0.5px'
                }}>
                  FREE BETA LAUNCHING DECEMBER 1, 2025
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
              style={{
                color: '#FFFFFF',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 700,
                letterSpacing: '-0.02em'
              }}
            >
              Join 100 Founding Members
              <span className="block mt-4 text-4xl sm:text-5xl md:text-6xl" style={{
                color: '#3b82f6',
                fontWeight: 600
              }}>
                Shape the Future of ICP Tools
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl max-w-4xl mx-auto mb-16 leading-relaxed"
              style={{
                color: '#E0E0E0',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.7'
              }}
            >
              Full access to the ICP tool. No credit card required. Lock in 50% lifetime discount when we launch paid tiers.
            </motion.p>

            {/* Main CTA Card */}
            <motion.div
              variants={fadeInUp}
              className="max-w-3xl mx-auto mb-16 p-10 rounded-2xl relative"
              style={{
                background: '#1A1A1A',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)'
              }}
            >
              {/* Spots Remaining Badge */}
              <div className="absolute -top-4 right-8">
                <div className="px-4 py-2 rounded-full" style={{
                  background: '#10b981',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}>
                  <p className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    100 Spots Available
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                }}>
                  Free Beta Access
                </h2>
                <p className="text-lg" style={{
                  color: '#E0E0E0',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                }}>
                  Help us build the best ICP tool for technical founders
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                {[
                  'Full access to ICP tool',
                  'All export formats (PDF, Markdown, CSV)',
                  'Direct Slack channel with founders',
                  'No credit card required',
                  'Weekly feedback sessions',
                  'Lock in 50% lifetime discount'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                    <span className="text-base" style={{
                      color: '#E0E0E0',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                    }}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                href="/founding-members"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
                }}
              >
                <Zap className="w-6 h-6" />
                Apply for Founding Member Access
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Trust Signal */}
              <p className="mt-6 text-sm" style={{
                color: '#E0E0E0',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}>
                Beta launches December 1, 2025 • Limited to 100 founding members
              </p>
            </motion.div>

            {/* What Happens After Beta */}
            <motion.div variants={fadeInUp} className="max-w-4xl mx-auto">
              <div className="p-8 rounded-xl" style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <h3 className="text-2xl font-bold mb-6" style={{
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                }}>
                  What Happens After Beta?
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {/* Founding Members */}
                  <div className="p-6 rounded-lg" style={{
                    background: '#1A1A1A',
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                  }}>
                    <div className="mb-4">
                      <span className="px-3 py-1 rounded-full text-sm font-bold" style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#3b82f6'
                      }}>
                        For You (Founding Members)
                      </span>
                    </div>
                    <p className="text-3xl font-bold mb-2" style={{ color: '#3b82f6' }}>
                      $149<span className="text-lg font-normal" style={{ color: '#E0E0E0' }}>/month</span>
                    </p>
                    <p className="text-sm mb-4" style={{ color: '#10b981' }}>
                      50% off forever • Locked for life
                    </p>
                    <p className="text-sm" style={{
                      color: '#E0E0E0',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                      lineHeight: '1.6'
                    }}>
                      As a thank you for helping us build the product, you'll get 50% off our standard pricing—forever. No price increases. Ever.
                    </p>
                  </div>

                  {/* New Users */}
                  <div className="p-6 rounded-lg" style={{
                    background: '#1A1A1A',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div className="mb-4">
                      <span className="px-3 py-1 rounded-full text-sm font-bold" style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#E0E0E0'
                      }}>
                        New Users (After March 2025)
                      </span>
                    </div>
                    <p className="text-3xl font-bold mb-2" style={{ color: '#FFFFFF' }}>
                      $297<span className="text-lg font-normal" style={{ color: '#E0E0E0' }}>/month</span>
                    </p>
                    <p className="text-sm mb-4" style={{ color: '#E0E0E0' }}>
                      Standard pricing + 14-day free trial
                    </p>
                    <p className="text-sm" style={{
                      color: '#E0E0E0',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                      lineHeight: '1.6'
                    }}>
                      Users who join after the beta period will pay standard pricing. That's why being a founding member is such a good deal.
                    </p>
                  </div>
                </div>
              </div>
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
              className="text-4xl font-bold mb-12 text-center"
              style={{
                color: '#FFFFFF',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}
            >
              Frequently Asked Questions
            </motion.h2>

            <div className="space-y-6">
              {[
                {
                  q: 'What do I get as a founding member?',
                  a: 'Full access to the ICP tool during the 60-90 day beta period, direct Slack channel with our team, weekly feedback sessions, and a 50% lifetime discount when we launch paid tiers in March 2025.'
                },
                {
                  q: 'Is this really free? No credit card required?',
                  a: 'Yes, completely free during the beta period (Dec 2025 - Feb 2025). No credit card required to join. We\'ll only ask for payment in March 2025 if you choose to continue at the founding member rate.'
                },
                {
                  q: 'What\'s the lifetime discount?',
                  a: 'Founding members pay $149/month forever (50% off the standard $297/month price). Your price will never increase, even as we add more modules and features to the platform.'
                },
                {
                  q: 'What happens after the beta period?',
                  a: 'In March 2025, you\'ll have the option to convert to a paying customer at $149/month (50% off) or stop using the product. There\'s no obligation to continue.'
                },
                {
                  q: 'How are the 100 spots selected?',
                  a: 'We\'re looking for technical founders and product leaders at B2B SaaS companies who will actively use the tool and provide thoughtful feedback. Apply through the founding member form and we\'ll review applications on a rolling basis.'
                },
                {
                  q: 'When does beta access start?',
                  a: 'Beta access begins December 1, 2025. We\'ll start approving applications in batches, with the first 20 users getting access within 24 hours of launch.'
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
                  <h3 className="text-lg font-bold mb-3" style={{
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                  }}>
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
              Ready to Join?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl mb-10"
              style={{
                color: '#E0E0E0',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.7'
              }}
            >
              100 spots. Free beta access. 50% lifetime discount. Apply now.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link
                href="/founding-members"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
                }}
              >
                <Zap className="w-6 h-6" />
                Apply for Founding Member Access
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
