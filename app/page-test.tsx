'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from './lib/supabase/client-rewrite';
import { motion } from 'framer-motion';
// import { DesignSystemTest } from '../src/shared/design-system/test-component';

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-24 sm:pb-32">
          <motion.div
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Logo/Brand */}
            <motion.div variants={fadeInUp} className="mb-8">
              <h2 className="text-2xl font-bold text-primary tracking-tight">
                H&S Revenue Intelligence
              </h2>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary mb-6 tracking-tight"
            >
              Transform Your Revenue Strategy
              <span className="block text-primary mt-2">With AI-Powered Intelligence</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-xl text-text-muted max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Identify ideal customers, calculate ROI with precision, and build compelling business cases—all in one intelligent platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {!loading && (
                <>
                  {isAuthenticated ? (
                    <Link
                      href="/dashboard"
                      className="
                        px-8 py-4 rounded-lg
                        bg-primary text-white font-semibold
                        hover:bg-primary-hover
                        transition-all duration-200 ease-elegant
                        shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30
                        transform hover:-translate-y-0.5
                        min-w-[200px] text-center
                      "
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/pricing"
                      className="
                        px-8 py-4 rounded-lg
                        bg-primary text-white font-semibold
                        hover:bg-primary-hover
                        transition-all duration-200 ease-elegant
                        shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30
                        transform hover:-translate-y-0.5
                        min-w-[200px] text-center
                      "
                    >
                      Start Free Trial
                    </Link>
                  )}

                  <Link
                    href="/icp"
                    className="
                      px-8 py-4 rounded-lg
                      bg-surface border border-white/10 text-text-primary font-semibold
                      hover:bg-surface-hover hover:border-white/20
                      transition-all duration-200 ease-elegant
                      min-w-[200px] text-center
                    "
                  >
                    Explore Features
                  </Link>
                </>
              )}
            </motion.div>

            {/* Trial Badge */}
            <motion.div variants={fadeInUp} className="mt-8">
              <p className="text-sm text-text-subtle">
                ✨ Start with a 3-day free trial • No credit card required
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Everything You Need to Drive Revenue
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Powerful tools designed for revenue teams to identify, qualify, and convert ideal customers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1: ICP Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="
                p-6 rounded-lg
                bg-surface border border-white/10
                hover:bg-surface-hover hover:border-white/20
                transition-all duration-200 ease-elegant
                group
              "
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-200">
                🎯
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                ICP Analysis
              </h3>
              <p className="text-text-muted leading-relaxed">
                Define and analyze your Ideal Customer Profile with AI-powered insights and data-driven recommendations.
              </p>
            </motion.div>

            {/* Feature 2: Cost Calculator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="
                p-6 rounded-lg
                bg-surface border border-white/10
                hover:bg-surface-hover hover:border-white/20
                transition-all duration-200 ease-elegant
                group
              "
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-200">
                💰
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Cost Calculator
              </h3>
              <p className="text-text-muted leading-relaxed">
                Calculate ROI and total cost of ownership with precision. Make data-backed investment decisions.
              </p>
            </motion.div>

            {/* Feature 3: Business Case Generator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="
                p-6 rounded-lg
                bg-surface border border-white/10
                hover:bg-surface-hover hover:border-white/20
                transition-all duration-200 ease-elegant
                group
              "
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-200">
                📊
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Business Case Generator
              </h3>
              <p className="text-text-muted leading-relaxed">
                Create compelling business cases automatically with comprehensive financial models and projections.
              </p>
            </motion.div>

            {/* Feature 4: Export & Share */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="
                p-6 rounded-lg
                bg-surface border border-white/10
                hover:bg-surface-hover hover:border-white/20
                transition-all duration-200 ease-elegant
                group
              "
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-200">
                📤
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Export & Collaborate
              </h3>
              <p className="text-text-muted leading-relaxed">
                Export to PDF, CSV, or Excel. Share insights with your team and stakeholders instantly.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              How It Works
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Get started in minutes and transform your revenue strategy in three simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="
                w-16 h-16 rounded-full
                bg-primary/10 border-2 border-primary
                flex items-center justify-center
                mx-auto mb-6
                text-2xl font-bold text-primary
              ">
                1
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                Define Your ICP
              </h3>
              <p className="text-text-muted leading-relaxed">
                Input your product details and target market. Our AI analyzes your data to identify ideal customer characteristics.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="
                w-16 h-16 rounded-full
                bg-primary/10 border-2 border-primary
                flex items-center justify-center
                mx-auto mb-6
                text-2xl font-bold text-primary
              ">
                2
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                Calculate ROI
              </h3>
              <p className="text-text-muted leading-relaxed">
                Use our advanced cost calculator to model scenarios, compare options, and quantify the business impact.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="
                w-16 h-16 rounded-full
                bg-primary/10 border-2 border-primary
                flex items-center justify-center
                mx-auto mb-6
                text-2xl font-bold text-primary
              ">
                3
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                Generate Business Case
              </h3>
              <p className="text-text-muted leading-relaxed">
                Create comprehensive business cases with financial projections, risk analysis, and executive summaries.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing/CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-background border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Ready to Transform Your Revenue Strategy?
            </h2>
            <p className="text-xl text-text-muted mb-8">
              Start your 3-day free trial today. No credit card required.
            </p>

            <div className="
              inline-block p-8 rounded-xl
              bg-surface border border-white/10
              shadow-xl shadow-primary/5
            ">
              <div className="mb-6">
                <div className="text-5xl font-bold text-primary mb-2">
                  $99
                  <span className="text-2xl text-text-muted font-normal">/month</span>
                </div>
                <p className="text-text-muted">
                  All features included • 3-day free trial
                </p>
              </div>

              <ul className="text-left space-y-3 mb-8 max-w-md mx-auto">
                <li className="flex items-start gap-3 text-text-muted">
                  <span className="text-primary mt-1">✓</span>
                  <span>Unlimited ICP analysis and insights</span>
                </li>
                <li className="flex items-start gap-3 text-text-muted">
                  <span className="text-primary mt-1">✓</span>
                  <span>Advanced cost calculator and ROI modeling</span>
                </li>
                <li className="flex items-start gap-3 text-text-muted">
                  <span className="text-primary mt-1">✓</span>
                  <span>Business case generation with AI</span>
                </li>
                <li className="flex items-start gap-3 text-text-muted">
                  <span className="text-primary mt-1">✓</span>
                  <span>Export to PDF, CSV, and Excel</span>
                </li>
                <li className="flex items-start gap-3 text-text-muted">
                  <span className="text-primary mt-1">✓</span>
                  <span>Priority support and updates</span>
                </li>
              </ul>

              {!loading && (
                <Link
                  href={isAuthenticated ? "/dashboard" : "/pricing"}
                  className="
                    inline-block px-8 py-4 rounded-lg
                    bg-primary text-white font-semibold text-lg
                    hover:bg-primary-hover
                    transition-all duration-200 ease-elegant
                    shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30
                    transform hover:-translate-y-0.5
                  "
                >
                  {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Design System Test Component - Development Only */}
      {/* {process.env.NODE_ENV === 'development' && <DesignSystemTest />} */}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-primary mb-4">
                H&S Revenue Intelligence
              </h3>
              <p className="text-text-muted leading-relaxed max-w-md">
                Transform your revenue strategy with AI-powered intelligence. Identify ideal customers, calculate ROI, and build compelling business cases.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/icp" className="text-text-muted hover:text-text-primary transition-colors">
                    ICP Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-text-muted hover:text-text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-text-muted hover:text-text-primary transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-text-muted hover:text-text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="mailto:support@hs-platform.com" className="text-text-muted hover:text-text-primary transition-colors">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-white/10">
            <p className="text-center text-text-subtle text-sm">
              © {new Date().getFullYear()} H&S Revenue Intelligence Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
