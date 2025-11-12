'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Target, Zap, Users, Sparkles, ArrowRight } from 'lucide-react';
import { GradientButton } from '../../src/shared/components/ui/GradientButton';
import { FooterLayout } from '../../src/shared/components/layout/FooterLayout';
import { MotionBackground } from '../../src/shared/components/ui/MotionBackground';

export default function AboutPage() {
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

  return (
    <div className="min-h-screen" style={{
      background: 'transparent'
    }}>
      <MotionBackground />

      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b" style={{
        borderColor: 'var(--glass-border, rgba(255, 255, 255, 0.08))'
      }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
            }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold" style={{
              color: 'var(--color-text-primary, #ffffff)',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
            }}>
              Andru
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm font-medium transition-colors" style={{
              color: 'var(--color-text-muted, rgba(255, 255, 255, 0.6))'
            }}>
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-medium transition-colors" style={{
              color: 'var(--color-text-muted, rgba(255, 255, 255, 0.6))'
            }}>
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{
                color: 'var(--color-text-primary, #ffffff)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.2'
              }}
            >
              Revenue Intelligence,{' '}
              <span style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Powered by AI
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl leading-relaxed mb-8"
              style={{
                color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}
            >
              We're building the future of revenue operations for B2B SaaS companies.
              No more guessing who your ideal customers are or how to sell to them.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl p-12"
            style={{
              background: 'var(--glass-bg-emphasis)',
              backdropFilter: 'var(--glass-blur-lg)',
              border: '1px solid var(--glass-border-emphasis)',
              boxShadow: 'var(--shadow-elegant)'
            }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                boxShadow: 'var(--shadow-glow-primary)'
              }}>
                <Target className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4" style={{
                  color: 'var(--color-text-primary, #ffffff)',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                }}>
                  Our Mission
                </h2>
                <p className="text-lg leading-relaxed" style={{
                  color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  lineHeight: '1.7'
                }}>
                  Every B2B SaaS company struggles with the same fundamental question: <strong style={{ color: 'var(--color-primary)' }}>Who should we sell to?</strong> Without a clear understanding of your Ideal Customer Profile (ICP), you're burning cash on the wrong prospects, extending sales cycles, and missing revenue targets.
                </p>
                <p className="text-lg leading-relaxed mt-4" style={{
                  color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  lineHeight: '1.7'
                }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Andru</strong> uses AI to analyze your product, market, and competitive landscape to generate detailed buyer personas, calculate ROI, and build compelling business cases—in under 3 minutes.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center" style={{
              color: 'var(--color-text-primary, #ffffff)',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
            }}>
              Why We're Building This
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Problem */}
              <div className="rounded-2xl p-8" style={{
                background: 'var(--glass-bg-standard)',
                backdropFilter: 'var(--glass-blur-md)',
                border: '1px solid var(--glass-border-standard)',
                boxShadow: 'var(--shadow-subtle)'
              }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <Zap className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{
                  color: 'var(--color-text-primary, #ffffff)',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                }}>
                  The Problem
                </h3>
                <p className="leading-relaxed" style={{
                  color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  lineHeight: '1.6'
                }}>
                  As a founder and revenue leader, I've watched teams waste months on manual ICP research, building business cases in spreadsheets, and presenting to executives without data-backed insights. The result? Missed targets, bloated CAC, and revenue teams working on the wrong opportunities.
                </p>
              </div>

              {/* Solution */}
              <div className="rounded-2xl p-8" style={{
                background: 'var(--glass-bg-standard)',
                backdropFilter: 'var(--glass-blur-md)',
                border: '1px solid var(--glass-border-standard)',
                boxShadow: 'var(--shadow-subtle)'
              }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{
                  color: 'var(--color-text-primary, #ffffff)',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                }}>
                  The Solution
                </h3>
                <p className="leading-relaxed" style={{
                  color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  lineHeight: '1.6'
                }}>
                  Andru condenses weeks of research into minutes using AI. You describe your product, we analyze your market, identify decision-makers, surface pain points, and generate ROI calculations—automatically. Your team gets back to selling, not researching.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Beta Launch Section */}
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
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{
              background: 'rgba(251, 191, 36, 0.15)',
              border: '2px solid rgba(251, 191, 36, 0.3)',
              boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
            }}>
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{
              color: 'var(--color-text-primary, #ffffff)',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
            }}>
              Join Our Beta Launch
            </h2>
            <p className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{
              color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
              lineHeight: '1.7'
            }}>
              We're launching in <strong style={{ color: 'var(--color-primary)' }}>December 2025</strong> with 100 founding members. Get free access during the 60-90 day beta period, plus a <strong style={{ color: 'var(--color-primary)' }}>50% lifetime discount</strong> when we go paid in March 2025.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GradientButton
                href="/founding-members"
                leftIcon={Zap}
                rightIcon={ArrowRight}
                size="lg"
                ariaLabel="Apply for founding member access"
              >
                Apply for Beta Access
              </GradientButton>
              <Link
                href="/pricing"
                className="text-sm font-medium transition-colors"
                style={{
                  color: 'var(--color-text-muted, rgba(255, 255, 255, 0.6))'
                }}
              >
                View Pricing Details
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{
            color: 'var(--color-text-primary, #ffffff)',
            fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
          }}>
            What We Believe
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Data-Driven Decisions',
                description: 'Revenue teams deserve real-time insights, not gut feelings. Every recommendation is backed by AI analysis of your market, competitors, and customer data.'
              },
              {
                icon: Zap,
                title: 'Speed Matters',
                description: 'Time spent on manual research is time not spent selling. Our platform generates comprehensive ICP analysis in under 3 minutes.'
              },
              {
                icon: Users,
                title: 'Built for Founders',
                description: 'We\'re founders building for founders. We understand the pressure of hitting revenue targets with limited resources.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <value.icon className="w-7 h-7" style={{ color: 'var(--color-primary)' }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{
                  color: 'var(--color-text-primary, #ffffff)',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                }}>
                  {value.title}
                </h3>
                <p className="leading-relaxed" style={{
                  color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  lineHeight: '1.6'
                }}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterLayout variant="standard" theme="dark" />
    </div>
  );
}
