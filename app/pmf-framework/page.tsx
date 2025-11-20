'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Target, Zap, Heart, Lightbulb, Sparkles, ArrowRight,
  TrendingUp, Clock, DollarSign, Award, CheckCircle2,
  AlertCircle, BarChart3, Users, Rocket
} from 'lucide-react';
import { GradientButton } from '../../src/shared/components/ui/GradientButton';
import { FooterLayout } from '../../src/shared/components/layout/FooterLayout';
import { MotionBackground } from '../../src/shared/components/ui/MotionBackground';
import { PublicHeader } from '../../src/shared/components/layout/PublicHeader';
import { initPublicPageTracking, trackCtaClick } from '../lib/analytics/publicPageTracking';

export default function PMFFrameworkPage() {
  const [activeTab, setActiveTab] = useState<'traditional' | 'andru'>('andru');

  // Initialize public page tracking
  useEffect(() => {
    initPublicPageTracking('/pmf-framework', 'Product-Market Fit Framework - Intelligence, Resonance, Clarity & Synergy');
  }, []);

  // CTA click handler
  const handleCtaClick = (ctaText: string, ctaLocation: string) => {
    trackCtaClick({
      ctaText,
      ctaLocation,
      pagePath: '/pmf-framework'
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const frameworkParts = [
    {
      number: 'I',
      title: 'Product-Market Intelligence',
      subtitle: 'Rapid market identification in days, not months',
      icon: Target,
      color: '#0066cc',
      bgColor: 'rgba(0, 102, 204, 0.1)',
      borderColor: 'rgba(0, 102, 204, 0.3)',
      description: 'Most failed startups have markets that need them, but lacked the clarity in identifying them quickly—and why speed of market identification determines survival.',
      keyMetrics: ['Days not months', '90-95% accuracy', 'Zero runway burned'],
      outcome: 'Which markets structurally need you'
    },
    {
      number: 'II',
      title: 'Product-Market Resonance',
      subtitle: 'Understanding authentic human needs that drive decisions',
      icon: Heart,
      color: '#ff9500',
      bgColor: 'rgba(255, 149, 0, 0.1)',
      borderColor: 'rgba(255, 149, 0, 0.3)',
      description: 'Why surface-level ICPs miss the authentic human needs that drive purchase decisions—and how to achieve resonance with the real people behind professional titles.',
      keyMetrics: ['12x conversion', '45% response rate', '20% close rate'],
      outcome: 'Which humans + what resonates'
    },
    {
      number: 'III',
      title: 'Product-Market Clarity',
      subtitle: 'Translating capabilities into strategic outcomes and ROI',
      icon: Lightbulb,
      color: '#00c853',
      bgColor: 'rgba(0, 200, 83, 0.1)',
      borderColor: 'rgba(0, 200, 83, 0.3)',
      description: 'Why technical founders with PMF are losing to inferior products in enterprise—and how to translate capabilities into strategic outcomes and ROI for CFO approval.',
      keyMetrics: ['$2.1M ROI examples', '1.8x higher ACV', '40% shorter sales cycles'],
      outcome: 'CFO-defensible business cases'
    },
    {
      number: 'IV',
      title: 'Product-Market Synergy',
      subtitle: '72-hour execution creating compounding advantage',
      icon: Zap,
      color: '#9c27b0',
      bgColor: 'rgba(156, 39, 176, 0.1)',
      borderColor: 'rgba(156, 39, 176, 0.3)',
      description: 'How to operationalize Intelligence + Resonance + Clarity in 72 hours instead of 6 months—and create compounding competitive advantage through AI execution.',
      keyMetrics: ['72 hours vs 6 months', 'Multiplication not addition', 'Defensible moat'],
      outcome: 'Self-improving revenue system'
    }
  ];

  const traditionalVsAndru = {
    traditional: {
      time: '6-9 months',
      cost: '$250K-$600K',
      accuracy: '60-70%',
      runway: '43-64% burned',
      improvement: 'Static/degrades',
      moat: 'None (easily copied)',
      responseRate: '15-25%',
      closeRate: '5-8%'
    },
    andru: {
      time: '72 hours',
      cost: '$12K-$30K',
      accuracy: '90-95%',
      runway: '<1% burned',
      improvement: 'Compounds monthly',
      moat: 'Widens over time',
      responseRate: '40-50%',
      closeRate: '18-25%'
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      <MotionBackground />
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-300">
                90% of startups fail—not for lack of market need, but for lack of market clarity
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              style={{
                color: 'var(--color-text-primary, #ffffff)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.1'
              }}
            >
              The Complete{' '}
              <span style={{
                background: 'linear-gradient(135deg, #0066cc 0%, #ff9500 25%, #00c853 50%, #9c27b0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Product-Market Fit
              </span>{' '}
              Framework
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl leading-relaxed mb-8 max-w-4xl mx-auto"
              style={{
                color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}
            >
              Intelligence → Resonance → Clarity → Synergy
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-lg leading-relaxed mb-10 max-w-3xl mx-auto"
              style={{
                color: 'var(--color-text-muted, rgba(255, 255, 255, 0.6))',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}
            >
              From finding the right markets in days (not months) to achieving resonance with authentic buyer needs,
              to translating technical capabilities into CFO-defensible ROI—all operationalized in 72 hours through AI.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <GradientButton
                href="/founding-members"
                leftIcon={Rocket}
                rightIcon={ArrowRight}
                size="lg"
                ariaLabel="Get started with PMF framework"
                onClick={() => handleCtaClick('Get Started with PMF Framework', 'hero')}
              >
                Get Started with PMF Framework
              </GradientButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Framework Flow Diagram */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl p-8 md:p-12"
            style={{
              background: 'var(--glass-bg-emphasis)',
              backdropFilter: 'var(--glass-blur-lg)',
              border: '1px solid var(--glass-border-emphasis)',
              boxShadow: 'var(--shadow-premium)'
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center" style={{
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
            }}>
              The Four-Part Framework
            </h2>

            {/* Flow visualization */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {frameworkParts.map((part, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  <div
                    className="p-6 rounded-2xl h-full flex flex-col"
                    style={{
                      background: part.bgColor,
                      border: `1px solid ${part.borderColor}`
                    }}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl mb-4 mx-auto" style={{
                      background: part.bgColor,
                      border: `2px solid ${part.color}`,
                      boxShadow: `0 4px 12px ${part.color}40`
                    }}>
                      <part.icon className="w-6 h-6" style={{ color: part.color }} />
                    </div>

                    <div className="text-center mb-3">
                      <div className="text-sm font-bold mb-1" style={{ color: part.color }}>
                        PART {part.number}
                      </div>
                      <h3 className="text-lg font-bold mb-2" style={{
                        color: 'var(--color-text-primary)',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        {part.title}
                      </h3>
                    </div>

                    <div className="space-y-2 flex-1">
                      {part.keyMetrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm" style={{
                          color: 'var(--color-text-secondary)'
                        }}>
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: part.color }} />
                          <span>{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Arrow between parts */}
                  {index < frameworkParts.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Outcome box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center p-6 rounded-2xl"
              style={{
                background: 'rgba(233, 30, 99, 0.1)',
                border: '1px solid rgba(233, 30, 99, 0.3)'
              }}
            >
              <Award className="w-8 h-8 mx-auto mb-3" style={{ color: '#e91e63' }} />
              <h3 className="text-xl font-bold mb-2" style={{
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}>
                Complete Product-Market Fit
              </h3>
              <p style={{
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}>
                Defensible, Scalable, and Compounding
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Detailed Framework Parts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center" style={{
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
          }}>
            How Each Part Works
          </h2>

          <div className="space-y-8">
            {frameworkParts.map((part, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="rounded-3xl p-8 md:p-10"
                style={{
                  background: 'var(--glass-bg-emphasis)',
                  backdropFilter: 'var(--glass-blur-lg)',
                  border: '1px solid var(--glass-border-emphasis)',
                  boxShadow: 'var(--shadow-elegant)'
                }}
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{
                      background: part.bgColor,
                      border: `2px solid ${part.color}`,
                      boxShadow: `0 6px 16px ${part.color}40`
                    }}>
                      <part.icon className="w-8 h-8" style={{ color: part.color }} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-bold px-3 py-1 rounded-full" style={{
                        background: part.bgColor,
                        color: part.color
                      }}>
                        PART {part.number}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{
                      color: 'var(--color-text-primary)',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                    }}>
                      {part.title}
                    </h3>

                    <p className="text-lg mb-4" style={{
                      color: part.color,
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                      fontWeight: 500
                    }}>
                      {part.subtitle}
                    </p>

                    <p className="text-base leading-relaxed mb-6" style={{
                      color: 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                      lineHeight: '1.7'
                    }}>
                      {part.description}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      {part.keyMetrics.map((metric, idx) => (
                        <div key={idx} className="px-4 py-2 rounded-lg" style={{
                          background: part.bgColor,
                          border: `1px solid ${part.borderColor}`
                        }}>
                          <span className="text-sm font-medium" style={{ color: part.color }}>
                            {metric}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 rounded-xl" style={{
                      background: part.bgColor,
                      border: `1px solid ${part.borderColor}`
                    }}>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" style={{ color: part.color }} />
                        <span className="font-semibold" style={{ color: part.color }}>Output:</span>
                        <span style={{ color: 'var(--color-text-secondary)' }}>{part.outcome}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Traditional vs Andru Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center" style={{
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
            }}>
              Traditional Approach vs Andru Framework
            </h2>
            <p className="text-lg text-center mb-12" style={{
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
            }}>
              6-9 months and $250K-$600K vs 72 hours and $12K-$30K
            </p>

            <div className="rounded-3xl overflow-hidden" style={{
              background: 'var(--glass-bg-emphasis)',
              backdropFilter: 'var(--glass-blur-lg)',
              border: '1px solid var(--glass-border-emphasis)',
              boxShadow: 'var(--shadow-premium)'
            }}>
              {/* Tab selector */}
              <div className="flex border-b" style={{ borderColor: 'var(--glass-border-emphasis)' }}>
                <button
                  onClick={() => setActiveTab('andru')}
                  className="flex-1 py-4 px-6 font-semibold transition-all"
                  style={{
                    background: activeTab === 'andru' ? 'rgba(0, 200, 83, 0.1)' : 'transparent',
                    color: activeTab === 'andru' ? '#00c853' : 'var(--color-text-muted)',
                    borderBottom: activeTab === 'andru' ? '2px solid #00c853' : '2px solid transparent'
                  }}
                >
                  ✅ Andru Approach
                </button>
                <button
                  onClick={() => setActiveTab('traditional')}
                  className="flex-1 py-4 px-6 font-semibold transition-all"
                  style={{
                    background: activeTab === 'traditional' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                    color: activeTab === 'traditional' ? '#ef4444' : 'var(--color-text-muted)',
                    borderBottom: activeTab === 'traditional' ? '2px solid #ef4444' : '2px solid transparent'
                  }}
                >
                  ❌ Traditional Approach
                </button>
              </div>

              {/* Comparison grid */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { label: 'Total Time', icon: Clock, key: 'time' },
                    { label: 'Total Cost', icon: DollarSign, key: 'cost' },
                    { label: 'Market Accuracy', icon: Target, key: 'accuracy' },
                    { label: 'Runway Impact', icon: TrendingUp, key: 'runway' },
                    { label: 'Response Rate', icon: BarChart3, key: 'responseRate' },
                    { label: 'Close Rate', icon: CheckCircle2, key: 'closeRate' },
                    { label: 'Improvement', icon: Sparkles, key: 'improvement' },
                    { label: 'Competitive Moat', icon: Award, key: 'moat' }
                  ].map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="p-4 rounded-xl"
                      style={{
                        background: activeTab === 'andru'
                          ? 'rgba(0, 200, 83, 0.1)'
                          : 'rgba(239, 68, 68, 0.1)',
                        border: activeTab === 'andru'
                          ? '1px solid rgba(0, 200, 83, 0.3)'
                          : '1px solid rgba(239, 68, 68, 0.3)'
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <metric.icon className="w-5 h-5" style={{
                          color: activeTab === 'andru' ? '#00c853' : '#ef4444'
                        }} />
                        <span className="font-semibold" style={{
                          color: 'var(--color-text-primary)',
                          fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                        }}>
                          {metric.label}
                        </span>
                      </div>
                      <div className="text-xl font-bold" style={{
                        color: activeTab === 'andru' ? '#00c853' : '#ef4444',
                        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                      }}>
                        {activeTab === 'andru'
                          ? traditionalVsAndru.andru[metric.key as keyof typeof traditionalVsAndru.andru]
                          : traditionalVsAndru.traditional[metric.key as keyof typeof traditionalVsAndru.traditional]}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* ROI calculation */}
                {activeTab === 'andru' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-8 p-6 rounded-2xl text-center"
                    style={{
                      background: 'rgba(0, 200, 83, 0.15)',
                      border: '2px solid rgba(0, 200, 83, 0.4)'
                    }}
                  >
                    <div className="text-sm font-semibold mb-2" style={{ color: '#00c853' }}>
                      TOTAL ROI MULTIPLE
                    </div>
                    <div className="text-4xl font-bold mb-2" style={{
                      color: '#00c853',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                    }}>
                      247x to 617x
                    </div>
                    <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      Cost: $12K-$30K | Value Created: $7.4M | Time Saved: 5.9 months of runway
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Synergy Explanation */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl p-10"
            style={{
              background: 'var(--glass-bg-emphasis)',
              backdropFilter: 'var(--glass-blur-lg)',
              border: '1px solid var(--glass-border-emphasis)',
              boxShadow: 'var(--shadow-premium)'
            }}
          >
            <div className="text-center mb-8">
              <Zap className="w-12 h-12 mx-auto mb-4" style={{ color: '#9c27b0' }} />
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}>
                Why Synergy = Multiplication, Not Addition
              </h2>
              <p className="text-lg" style={{
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}>
                This is how we create a defensible competitive moat that widens over time
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Addition */}
              <div className="p-6 rounded-2xl" style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#ef4444' }}>
                  ❌ Addition (Traditional)
                </h3>
                <div className="space-y-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <div>Intelligence: 100 results</div>
                  <div>+ Resonance: 100 results</div>
                  <div>+ Clarity: 100 results</div>
                  <div className="pt-3 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                    <span className="font-bold" style={{ color: '#fca5a5' }}>= 300 Total Results</span>
                  </div>
                  <div className="text-xs italic pt-2" style={{ color: '#fca5a5' }}>
                    Static over time → No compounding advantage
                  </div>
                </div>
              </div>

              {/* Multiplication */}
              <div className="p-6 rounded-2xl" style={{
                background: 'rgba(0, 200, 83, 0.1)',
                border: '1px solid rgba(0, 200, 83, 0.3)'
              }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#00c853' }}>
                  ✅ Multiplication (Synergy)
                </h3>
                <div className="space-y-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <div>Intelligence: 100 base</div>
                  <div>× Resonance: 2x multiplier</div>
                  <div>× Clarity: 1.5x multiplier</div>
                  <div className="pt-3 border-t" style={{ borderColor: 'rgba(0, 200, 83, 0.3)' }}>
                    <span className="font-bold" style={{ color: '#10b981' }}>= 300 Results (Month 1)</span>
                  </div>
                  <div className="space-y-1 pt-2 text-xs" style={{ color: '#a7f3d0' }}>
                    <div>Month 6: 450 results (+50%)</div>
                    <div>Month 12: 750 results (+150%)</div>
                    <div className="font-bold pt-1">Each layer improves the others! 🚀</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl text-center" style={{
              background: 'rgba(156, 39, 176, 0.1)',
              border: '1px solid rgba(156, 39, 176, 0.3)'
            }}>
              <p className="text-lg font-semibold" style={{
                color: '#9c27b0',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.6'
              }}>
                This is the moat: Product-Market Synergy that improves every day, where Intelligence + Resonance + Clarity multiply results. Competitors can't catch up because your advantage compounds while theirs stays static.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center rounded-3xl p-12"
            style={{
              background: 'var(--glass-bg-emphasis)',
              backdropFilter: 'var(--glass-blur-lg)',
              border: '1px solid var(--glass-border-emphasis)',
              boxShadow: 'var(--shadow-premium)'
            }}
          >
            <Sparkles className="w-12 h-12 mx-auto mb-6 text-yellow-400" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
            }}>
              Ready to Achieve Complete Product-Market Fit?
            </h2>
            <p className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
              lineHeight: '1.7'
            }}>
              Join 65 founding members getting Intelligence + Resonance + Clarity + Synergy in 72 hours, not 6 months. Beta launching December 2025 with <strong style={{ color: 'var(--color-primary)' }}>50% lifetime discount</strong>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GradientButton
                href="/founding-members"
                leftIcon={Rocket}
                rightIcon={ArrowRight}
                size="lg"
                ariaLabel="Apply for founding member access"
                onClick={() => handleCtaClick('Apply for Founding Member Access', 'bottom-cta')}
              >
                Apply for Founding Member Access
              </GradientButton>
              <Link
                href="/about"
                className="text-sm font-medium transition-colors"
                style={{
                  color: 'var(--color-text-muted, rgba(255, 255, 255, 0.6))'
                }}
              >
                Learn More About Andru
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <FooterLayout variant="standard" theme="dark" />
    </div>
  );
}
