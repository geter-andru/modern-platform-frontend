'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Target, Zap, Users, Sparkles, ArrowRight } from 'lucide-react';
import { GradientButton } from '../../src/shared/components/ui/GradientButton';
import { FooterLayout } from '../../src/shared/components/layout/FooterLayout';
import { MotionBackground } from '../../src/shared/components/ui/MotionBackground';
import { PublicHeader } from '../../src/shared/components/layout/PublicHeader';
import { initPublicPageTracking, trackCtaClick } from '../lib/analytics/publicPageTracking';

export default function AboutPage() {
  // Initialize public page tracking
  useEffect(() => {
    initPublicPageTracking('/about', 'About - Revenue Intelligence Powered by AI');
  }, []);

  // CTA click handler
  const handleCtaClick = (ctaText: string, ctaLocation: string) => {
    trackCtaClick({
      ctaText,
      ctaLocation,
      pagePath: '/about'
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

  return (
    <div className="min-h-screen" style={{
      background: 'transparent'
    }}>
      <MotionBackground />
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 pt-32">
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
                  <strong style={{ color: '#fca5a5' }}>90% of startups fail—not for lack of market need, but for lack of market clarity.</strong> They reverse-engineer accidents into strategy. They chase relationship wins contaminated by founder connections, discount-driven purchases, and timing luck. They mistake tactical flexibility for strategic direction.
                </p>
                <p className="text-lg leading-relaxed mt-4" style={{
                  color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  lineHeight: '1.7'
                }}>
                  Without <strong style={{ color: 'var(--color-primary)' }}>Product-Market Intelligence</strong> (which markets structurally need you), <strong style={{ color: 'var(--color-primary)' }}>Product-Market Resonance</strong> (what resonates with buyers), and <strong style={{ color: 'var(--color-primary)' }}>Product-Market Clarity</strong> (translating tech to strategic outcomes), you don't have product-market fit. You have product-market illusion.
                </p>
                <p className="text-lg leading-relaxed mt-4" style={{
                  color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  lineHeight: '1.7'
                }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Andru</strong> solves the market clarity crisis. We deliver the complete three-layer intelligence stack that transforms how technical founders achieve product-market fit at enterprise scale—in 72 hours, not 6 months.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
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
              I Built This Because I Needed It
            </h2>

            <div className="space-y-6 rounded-2xl p-8 md:p-10" style={{
              background: 'var(--glass-bg-emphasis)',
              backdropFilter: 'var(--glass-blur-lg)',
              border: '1px solid var(--glass-border-emphasis)',
              boxShadow: 'var(--shadow-premium)'
            }}>
              <p className="text-lg leading-relaxed" style={{
                color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.7'
              }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>March 2024.</strong> My board asked the question I'd been dreading: <em style={{ color: 'var(--color-primary)' }}>"Who's your ICP?"</em>
              </p>

              <p className="text-lg leading-relaxed" style={{
                color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.7'
              }}>
                I froze. We were at $4M ARR. Pipeline was full. But I couldn't articulate who we were actually selling to. "Mid-market SaaS companies" was as specific as I could get.
              </p>

              <p className="text-lg leading-relaxed" style={{
                color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.7'
              }}>
                That week, I hired a $15K/month consultant. <strong style={{ color: '#fca5a5' }}>Six weeks and $90K later</strong>, they delivered a 47-page deck that sat in Google Drive collecting dust. My sales team never used it.
              </p>

              <div className="border-l-4 pl-6 py-2 my-6" style={{
                borderColor: '#ef4444',
                background: 'rgba(239, 68, 68, 0.1)'
              }}>
                <p className="text-lg italic leading-relaxed" style={{
                  color: '#fca5a5',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  lineHeight: '1.7'
                }}>
                  Meanwhile, my close rate kept dropping. Sales cycle ballooned to 8 months. I was burning $20K/month on tools my team couldn't explain the ROI for.
                </p>
              </div>

              <p className="text-lg leading-relaxed" style={{
                color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.7'
              }}>
                Then my VP of Sales quit. Her exit interview: <em style={{ color: '#fca5a5' }}>"I don't know who we're selling to or why they should buy."</em>
              </p>

              <p className="text-lg leading-relaxed" style={{
                color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.7'
              }}>
                That's when it clicked. <strong style={{ color: 'var(--color-primary)' }}>The problem wasn't just bad ICP research. It was lack of market clarity—the systematic framework for achieving product-market fit at enterprise scale.</strong>
              </p>

              <p className="text-lg leading-relaxed mt-4" style={{
                color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.7'
              }}>
                I needed three layers of intelligence: <strong style={{ color: 'var(--color-primary)' }}>Which markets structurally need us</strong> (Product-Market Intelligence). <strong style={{ color: 'var(--color-primary)' }}>What resonates with buyers</strong> (Product-Market Resonance). <strong style={{ color: 'var(--color-primary)' }}>How to translate our tech into strategic outcomes</strong> (Product-Market Clarity).
              </p>

              <div className="border-l-4 pl-6 py-2 my-6 rounded-r-xl" style={{
                borderColor: '#10b981',
                background: 'rgba(16, 185, 129, 0.1)'
              }}>
                <p className="text-lg leading-relaxed" style={{
                  color: '#a7f3d0',
                  fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                  lineHeight: '1.7'
                }}>
                  <strong style={{ color: '#10b981' }}>So I built Andru.</strong> Not as a consultant replacement. As the AI platform that delivers complete market clarity—Intelligence, Resonance, and Clarity—in 72 hours, not 6 months.
                </p>
              </div>

              <p className="text-lg leading-relaxed" style={{
                color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.7'
              }}>
                If you're a technical founder stuck at Series A, spending more time defending your pipeline than building product—I built this for you.
              </p>

              <p className="text-lg leading-relaxed font-semibold" style={{
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.7'
              }}>
                Because you shouldn't have to burn $90K and 6 months to figure out who to sell to.
              </p>
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

      {/* Who This Is For Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-12 text-center" style={{
              color: 'var(--color-text-primary, #ffffff)',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
            }}>
              Who This Is For (And Who It's Not)
            </h2>

            {/* This IS For You */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: '#10b981' }}>
                ✓ Andru Is Built For:
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Series A Technical Founders',
                    description: 'You built the product. Now you need to figure out sales. You\'re at $2-10M ARR and the board is asking about your GTM strategy.'
                  },
                  {
                    title: 'Founders Hiring Their First VP of Sales',
                    description: 'You\'re about to spend $180K+ on sales leadership. They\'re going to ask "What\'s our ICP?" on Day 1. You need the answer ready.'
                  },
                  {
                    title: 'Founders Drowning in Sales Chaos',
                    description: 'Pipeline is full but nothing closes. Sales cycle is 6+ months. You\'re spending $20K+/month on tools nobody uses. Something has to change.'
                  },
                  {
                    title: 'Founders Who Need Answers, Not Consultants',
                    description: 'You don\'t have 3 months and $90K for a consulting engagement. You need ICP clarity this week, not next quarter.'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="p-6 rounded-xl"
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <h4 className="font-bold mb-2" style={{ color: '#10b981', fontSize: '1.1rem' }}>
                      {item.title}
                    </h4>
                    <p style={{
                      color: '#a7f3d0',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                      lineHeight: '1.6'
                    }}>
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* This Is NOT For You */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: '#ef4444' }}>
                ✗ Andru Is NOT For:
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Companies With High-Performing Sales Teams',
                    description: 'If you\'re already closing 40%+ of pipeline and scaling predictably, you don\'t need us. Keep doing what\'s working.'
                  },
                  {
                    title: 'Pre-Revenue Startups',
                    description: 'If you\'re still validating product-market fit, focus on that first. Andru is for founders who have PMF and need to scale sales.'
                  },
                  {
                    title: 'B2C Companies',
                    description: 'We\'re built for B2B SaaS selling to enterprises. If you\'re selling to consumers, we\'re not the right fit.'
                  },
                  {
                    title: 'Companies That Just Need More Leads',
                    description: 'If your problem is lead volume (not qualification), you need a demand gen tool. We help you qualify better, not generate more.'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="p-6 rounded-xl"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    <h4 className="font-bold mb-2" style={{ color: '#fca5a5', fontSize: '1.1rem' }}>
                      {item.title}
                    </h4>
                    <p style={{
                      color: '#fecaca',
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                      lineHeight: '1.6'
                    }}>
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 p-6 rounded-xl text-center"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}
            >
              <p className="text-xl font-semibold mb-2" style={{
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}>
                If 2+ items in the "Yes" list describe you, we should talk.
              </p>
              <p style={{
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
              }}>
                We only work with founders who are the right fit. That's how we deliver results.
              </p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Pure Signal Philosophy Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
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
              boxShadow: 'var(--shadow-premium)'
            }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center" style={{
              color: 'var(--color-text-primary, #ffffff)',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
            }}>
              The Pure Signal Philosophy
            </h2>

            <p className="text-lg leading-relaxed mb-6" style={{
              color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
              lineHeight: '1.7'
            }}>
              <strong style={{ color: 'var(--color-primary)' }}>Direction must precede data.</strong> You cannot let historical accidents dictate strategic direction. You cannot let contaminated customer data—wins driven by founder relationships, discount-driven purchases, or timing luck—define your ideal customer profile.
            </p>

            <p className="text-lg leading-relaxed mb-6" style={{
              color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
              lineHeight: '1.7'
            }}>
              <strong style={{ color: 'var(--color-primary)' }}>Pure Signal</strong> is derived from first principles: the intrinsic capabilities of your product and the fundamental problems it solves. Not who happened to buy. Not who you could convince with discounts. But who is structurally positioned to derive Maximum Value Realization from what you've built.
            </p>

            <p className="text-lg leading-relaxed mb-6" style={{
              color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
              lineHeight: '1.7'
            }}>
              This is the <strong style={{ color: 'var(--color-primary)' }}>Hybrid ICP Operating System</strong>: Start with Pure Signal (product capabilities). Execute intentionally (target based on value alignment). Analyze rigorously (filter accidents from authentic success). Iterate intelligently (refine based on validated market reality).
            </p>

            <div className="border-l-4 pl-6 py-4 rounded-r-xl" style={{
              borderColor: 'var(--color-primary)',
              background: 'rgba(59, 130, 246, 0.1)'
            }}>
              <p className="text-lg leading-relaxed font-semibold" style={{
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                lineHeight: '1.7'
              }}>
                When you master this system, you don't just grow faster—you build defensible competitive moats that rivals can't copy. Because competitors can copy features, but they can't replicate systematic clarity about who should buy and why.
              </p>
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
