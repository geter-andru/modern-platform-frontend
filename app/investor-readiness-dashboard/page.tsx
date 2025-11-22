'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, TrendingUp, Target, Clock, Sparkles, CheckCircle, ArrowLeft, AlertTriangle } from 'lucide-react';
import { MotionBackground } from '../../src/shared/components/ui/MotionBackground';
import { FooterLayout } from '../../src/shared/components/layout/FooterLayout';

export default function InvestorReadinessDashboardPage() {
  return (
    <div className="min-h-screen relative" style={{
      background: 'transparent',
      color: '#ffffff',
      fontFamily: '"Red Hat Display", sans-serif'
    }}>
      <MotionBackground />

      {/* Back button */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm transition-colors hover:text-blue-400"
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
          >
            Stop Walking Into Board Meetings Blindsided By CRM Numbers You Should Have Seen Coming
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl sm:text-2xl mb-4"
            style={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            Your board wants to know if you&apos;ll hit Q3 revenue targets. Your CRM shows last quarter&apos;s results. By the time Salesforce shows the problem, it&apos;s too late to fix it—and your Series A timeline just collapsed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <Link
              href="/icp/demo-v2"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
              }}
            >
              <Sparkles className="w-5 h-5" />
              See Your Revenue Future Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-6 text-sm"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            Predictive execution intelligence dashboard that shows you what your CRM will report 4-8 weeks before it reports it.
          </motion.p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">The Nightmare You&apos;re Living</h2>

            <div className="space-y-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <p className="text-lg">
                You wake up at 3 AM terrified about missing board milestones.
              </p>
              <p className="text-lg">
                Not because your team isn&apos;t working hard—they&apos;re putting in 60-hour weeks. Not because your product isn&apos;t good—you&apos;re shipping features constantly.
              </p>
              <p className="text-lg">
                You&apos;re losing sleep because <strong>you have no visibility into whether your sales execution is working until your CRM tells you it already failed</strong>.
              </p>

              <div className="mt-8 p-6 rounded-xl" style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <p className="font-semibold text-lg mb-4" style={{ color: '#ef4444' }}>
                  The pattern that keeps repeating:
                </p>
                <ul className="space-y-3">
                  {[
                    "Board meeting in 48 hours, you need to report Q3 pipeline health",
                    "Salesforce shows Q2 actuals (stale data from 4-8 weeks ago)",
                    "You report 'trending positive' based on gut feel, not data",
                    "6 weeks later: CRM shows you missed pipeline targets by 30%",
                    "Board questions your ability to forecast accurately",
                    "Series A conversations get delayed because 'revenue trajectory unclear'"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-red-400">→</span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-lg mt-6">
                <strong>You&apos;re flying blind with a rear-view mirror, pretending it&apos;s a windshield.</strong>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Unique Differentiator Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Why This Is Different From Every Other &quot;Sales Dashboard&quot;</h2>
            <p className="text-xl text-center mb-12" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              We Don&apos;t Show You CRM Metrics. We Predict Them 4-8 Weeks Before They Appear.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Every Other Dashboard */}
              <div className="p-6 rounded-xl" style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Every Other Dashboard:</h3>
                <ul className="space-y-3">
                  {[
                    "Shows lagging CRM metrics (what already happened)",
                    "Reports outcomes, can't predict them",
                    "You see the revenue miss AFTER it's too late",
                    "Backwards-looking analytics with zero predictive intelligence"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      <span>✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Andru GPS for Revenue */}
              <div className="p-6 rounded-xl" style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Andru GPS for Revenue:</h3>
                <ul className="space-y-3">
                  {[
                    "Leading Indicators (Weeks 2-6): Shows observable metrics NOW",
                    "Predicted Lagging Indicators (Weeks 8-12): AI predicts CRM results",
                    "Validated Predictions: 90%+ accuracy builds board trust",
                    "Impossible to replicate without our tool outcome architecture"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">How Predictive Intelligence Actually Works</h2>

            <div className="space-y-6">
              {[
                {
                  week: "Week 1",
                  title: "Tool Usage",
                  description: "Rate companies with ICP analysis, generate buyer personas, create empathy-driven translations"
                },
                {
                  week: "Weeks 2-6",
                  title: "Leading Indicators (Observable NOW)",
                  items: [
                    "Low-fit deal reduction: 28% (benchmark: 15%)",
                    "Meeting→proposal conversion: 45% (benchmark: 30%)",
                    "Multi-stakeholder engagement: 3.2 avg (benchmark: 2.0)"
                  ]
                },
                {
                  week: "Weeks 2-6",
                  title: "AI Predictions Generated",
                  items: [
                    '"Close rate will improve 15-20% by Week 8"',
                    '"Pipeline will grow $250K-$320K by Week 6"',
                    '"Sales cycle will reduce 18-24 days by Week 6"'
                  ]
                },
                {
                  week: "Weeks 8-12",
                  title: "CRM Validates Predictions",
                  description: "See prediction accuracy (90%+) and build board confidence in your forecasting ability"
                }
              ].map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-24 text-right">
                    <span className="text-sm font-semibold text-blue-400">{phase.week}</span>
                  </div>
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-blue-400 mt-2" />
                  <div className="flex-1 pb-8 border-l border-blue-400/30 pl-6 -ml-1.5">
                    <h3 className="text-xl font-semibold mb-2">{phase.title}</h3>
                    {phase.description && (
                      <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{phase.description}</p>
                    )}
                    {phase.items && (
                      <ul className="space-y-1 mt-2">
                        {phase.items.map((item, itemIndex) => (
                          <li key={itemIndex} style={{ color: 'rgba(255, 255, 255, 0.7)' }}>• {item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7 Leading Indicators */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">7 Leading Indicators That Predict Revenue Outcomes</h2>
            <p className="text-center mb-12" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Observable NOW. Don&apos;t wait 6-8 weeks for CRM to show outcomes.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Low-Fit Deal Reduction", predicts: "Close rate boost" },
                { name: "Meeting→Proposal Conversion", predicts: "Qualified opportunities" },
                { name: "Multi-Stakeholder Engagement", predicts: "Cycle reduction" },
                { name: "Deal Size Increase", predicts: "Pipeline growth" },
                { name: "Deal Cycle Reduction", predicts: "Revenue velocity" },
                { name: "Executive Engagement Win Rate", predicts: "Close rate improvement" },
                { name: "Customer Referral Rate", predicts: "Warm intro pipeline" }
              ].map((indicator, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="p-4 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <BarChart3 className="w-6 h-6 text-blue-400 mb-2" />
                  <h3 className="font-semibold mb-1">{indicator.name}</h3>
                  <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    Predicts: {indicator.predicts}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Board Meeting Scenario */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Example: Board Meeting Scenario</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Without GPS */}
              <div className="p-6 rounded-xl" style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-semibold">With Traditional Dashboard</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  {[
                    'Week 1: Board asks "How\'s Q3 pipeline?"',
                    "You check Salesforce: Shows Q2 actuals (stale)",
                    'You report: "Trending positive" (gut feel)',
                    "Week 8: CRM shows pipeline 30% light",
                    'Board: "Why didn\'t you see this coming?"'
                  ].map((item, index) => (
                    <li key={index} style={{ color: 'rgba(255, 255, 255, 0.7)' }}>• {item}</li>
                  ))}
                </ul>
              </div>

              {/* With GPS */}
              <div className="p-6 rounded-xl" style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-semibold">With GPS for Revenue</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  {[
                    'Week 1: Board asks "How\'s Q3 pipeline?"',
                    "You check Dashboard: 7 leading indicators + AI predictions",
                    'You report: "18% close rate improvement predicted, 92% confidence"',
                    "Week 8: CRM shows 17% improvement (95% accuracy)",
                    'Board: "Your forecasting is excellent. Series A on track."'
                  ].map((item, index) => (
                    <li key={index} style={{ color: 'rgba(255, 255, 255, 0.7)' }}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Your Board Meeting Is In 48 Hours</h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              They&apos;re going to ask: &quot;Are we hitting Q3 revenue targets?&quot;
            </p>
            <p className="text-lg mb-8" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              You can check Salesforce and pray. Or you can check GPS for Revenue and know.
            </p>
            <p className="text-lg mb-8" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <strong>One approach is guessing. The other is predictive intelligence.</strong>
            </p>

            <Link
              href="/icp/demo-v2"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
              }}
            >
              <Sparkles className="w-5 h-5" />
              See Your Revenue Future
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="mt-6 text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              90%+ prediction accuracy • 4-8 weeks advance warning • Zero manual setup
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <FooterLayout variant="minimal" theme="dark" />
    </div>
  );
}
