'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from './lib/supabase/client-rewrite';
import { motion } from 'framer-motion';
import { DesignSystemTest } from '../src/shared/design-system/DesignSystemTest';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };
    checkAuth();
  }, [supabase]);

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
      background: 'var(--color-background-primary, #000000)',
      color: 'var(--color-text-primary, #ffffff)',
      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
    }}>
      {/* Design System Test Component */}
      <DesignSystemTest />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center" style={{
        background: 'var(--color-background-primary, #000000)'
      }}>
        {/* Clean Professional Background */}
        <div className="absolute inset-0" style={{
          background: 'var(--color-background-primary, #000000)'
        }} />

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
                  H&S Revenue Intelligence
                </h2>
              </div>
            </motion.div>

            {/* Executive-Level Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
              style={{
                color: 'var(--color-text-primary, #ffffff)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-bold, 700)',
                letterSpacing: 'var(--tracking-tighter, -0.02em)',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              Transform Your Revenue Strategy
              <span className="block mt-4 text-4xl sm:text-5xl md:text-6xl" style={{
                color: 'var(--color-brand-primary, #3b82f6)',
                fontWeight: 'var(--font-weight-semibold, 600)'
              }}>
                With AI-Powered Intelligence
              </span>
            </motion.h1>

            {/* Executive Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl max-w-4xl mx-auto mb-16 leading-relaxed"
              style={{
                color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-normal, 400)',
                lineHeight: 'var(--line-height-relaxed, 1.6)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            >
              Identify ideal customers, calculate ROI with precision, and build compelling business cases—all in one intelligent platform designed for executive decision-making.
            </motion.p>

            {/* Executive CTA Buttons with Glass Morphism */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              {!loading && (
                <>
                  {isAuthenticated ? (
                    <Link
                      href="/dashboard"
                      className="group relative overflow-hidden px-12 py-6 rounded-2xl font-semibold text-lg min-w-[240px] text-center transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        color: '#ffffff',
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: '600',
                        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <span className="relative z-10">Go to Dashboard</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </Link>
                  ) : (
                    <Link
                      href="/pricing"
                      className="group relative overflow-hidden px-12 py-6 rounded-2xl font-semibold text-lg min-w-[240px] text-center transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        color: '#ffffff',
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: '600',
                        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <span className="relative z-10">View Pricing</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </Link>
                  )}

                  <Link
                    href="/icp"
                    className="group px-12 py-6 rounded-2xl font-semibold text-lg min-w-[240px] text-center transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
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
                    Explore Features
                  </Link>
                </>
              )}
            </motion.div>

            {/* Platform Status Badge */}
            <motion.div variants={fadeInUp} className="mt-12">
              <div className="inline-block px-6 py-3 rounded-full" style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}>
                <p className="text-sm font-medium" style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: '0.5px'
                }}>
                  🚧 Platform in Beta • Launching December 2025
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Executive Features Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Sophisticated Background */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at 30% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(255, 119, 198, 0.08) 0%, transparent 50%),
            linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(26, 26, 46, 0.9) 50%, rgba(22, 33, 62, 0.8) 100%)
          `
        }} />
        
        <div className="absolute inset-0" style={{
          background: 'rgba(255, 255, 255, 0.01)',
          backdropFilter: 'blur(1px)'
        }} />
        
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
              Everything You Need to Drive Revenue
            </h2>
            <p className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed" style={{
              color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
              fontWeight: 'var(--font-weight-normal, 400)',
              lineHeight: 'var(--line-height-relaxed, 1.6)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}>
              Powerful tools designed for revenue teams to identify, qualify, and convert ideal customers with executive-level precision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1: ICP Analysis with Glass Morphism */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="group relative p-8 rounded-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300" style={{
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
              }}>
                🎯
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{
                color: '#ffffff',
                fontFamily: '"Inter", sans-serif',
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}>
                ICP Analysis
              </h3>
              <p className="text-lg leading-relaxed" style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: '"Inter", sans-serif',
                fontWeight: '400',
                lineHeight: '1.6'
              }}>
                Define and analyze your Ideal Customer Profile with AI-powered insights and data-driven recommendations.
              </p>
            </motion.div>

            {/* Feature 2: Cost Calculator */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group relative p-8 rounded-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
              style={{
                background: 'var(--glass-background, rgba(255, 255, 255, 0.03))',
                backdropFilter: 'var(--glass-backdrop, blur(16px))',
                border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.08))',
                boxShadow: 'var(--shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.4))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--glass-background, rgba(255, 255, 255, 0.03))';
                e.currentTarget.style.borderColor = 'var(--glass-border, rgba(255, 255, 255, 0.08))';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.4))';
              }}
            >
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300" style={{
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
              }}>
                💰
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{
                color: 'var(--color-text-primary, #ffffff)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-bold, 700)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}>
                Cost Calculator
              </h3>
              <p className="text-lg leading-relaxed" style={{
                color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-normal, 400)',
                lineHeight: 'var(--line-height-relaxed, 1.6)'
              }}>
                Calculate ROI and total cost of ownership with precision. Make data-backed investment decisions.
              </p>
            </motion.div>

            {/* Feature 3: Business Case Generator */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="group relative p-8 rounded-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
              style={{
                background: 'var(--glass-background, rgba(255, 255, 255, 0.03))',
                backdropFilter: 'var(--glass-backdrop, blur(16px))',
                border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.08))',
                boxShadow: 'var(--shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.4))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--glass-background, rgba(255, 255, 255, 0.03))';
                e.currentTarget.style.borderColor = 'var(--glass-border, rgba(255, 255, 255, 0.08))';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.4))';
              }}
            >
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300" style={{
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
              }}>
                📊
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{
                color: 'var(--color-text-primary, #ffffff)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-bold, 700)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}>
                Business Case Generator
              </h3>
              <p className="text-lg leading-relaxed" style={{
                color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-normal, 400)',
                lineHeight: 'var(--line-height-relaxed, 1.6)'
              }}>
                Create compelling business cases automatically with comprehensive financial models and projections.
              </p>
            </motion.div>

            {/* Feature 4: Export & Share */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="group relative p-8 rounded-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
              style={{
                background: 'var(--glass-background, rgba(255, 255, 255, 0.03))',
                backdropFilter: 'var(--glass-backdrop, blur(16px))',
                border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.08))',
                boxShadow: 'var(--shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.4))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--glass-background, rgba(255, 255, 255, 0.03))';
                e.currentTarget.style.borderColor = 'var(--glass-border, rgba(255, 255, 255, 0.08))';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.4))';
              }}
            >
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300" style={{
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
              }}>
                📤
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{
                color: 'var(--color-text-primary, #ffffff)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-bold, 700)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}>
                Export & Collaborate
              </h3>
              <p className="text-lg leading-relaxed" style={{
                color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-normal, 400)',
                lineHeight: 'var(--line-height-relaxed, 1.6)'
              }}>
                Share insights with your team and stakeholders. Export functionality coming soon in full launch.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{
        borderColor: 'var(--glass-border, rgba(255, 255, 255, 0.08))',
        background: 'var(--color-background-secondary, #0a0a0a)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4" style={{
                color: 'var(--color-brand-primary, #3b82f6)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-bold, 700)'
              }}>
                H&S Revenue Intelligence
              </h3>
              <p className="leading-relaxed max-w-md" style={{
                color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-normal, 400)',
                lineHeight: 'var(--line-height-relaxed, 1.6)'
              }}>
                Transform your revenue strategy with AI-powered intelligence. Identify ideal customers, calculate ROI, and build compelling business cases.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold mb-4" style={{
                color: 'var(--color-text-primary, #ffffff)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-semibold, 600)'
              }}>Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/icp" className="transition-colors" style={{
                    color: 'var(--color-text-muted, rgba(255, 255, 255, 0.6))'
                  }}>
                    ICP Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="transition-colors" style={{
                    color: 'var(--color-text-muted, rgba(255, 255, 255, 0.6))'
                  }}>
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="transition-colors" style={{
                    color: 'var(--color-text-muted, rgba(255, 255, 255, 0.6))'
                  }}>
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-4" style={{
                color: 'var(--color-text-primary, #ffffff)',
                fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                fontWeight: 'var(--font-weight-semibold, 600)'
              }}>Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="transition-colors" style={{
                    color: 'var(--color-text-muted, rgba(255, 255, 255, 0.6))'
                  }}>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors" style={{
                    color: 'var(--color-text-muted, rgba(255, 255, 255, 0.6))'
                  }}>
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="mailto:support@hs-platform.com" className="transition-colors" style={{
                    color: 'var(--color-text-muted, rgba(255, 255, 255, 0.6))'
                  }}>
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t" style={{
            borderColor: 'var(--glass-border, rgba(255, 255, 255, 0.08))'
          }}>
            <p className="text-center text-sm" style={{
              color: 'var(--color-text-subtle, rgba(255, 255, 255, 0.5))',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
              fontWeight: 'var(--font-weight-normal, 400)'
            }}>
              © {new Date().getFullYear()} H&S Revenue Intelligence Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}