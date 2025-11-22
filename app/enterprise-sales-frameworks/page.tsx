'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Users, BarChart3, FileText, Sparkles, CheckCircle, ArrowLeft } from 'lucide-react';
import { MotionBackground } from '../../src/shared/components/ui/MotionBackground';
import { FooterLayout } from '../../src/shared/components/layout/FooterLayout';

export default function EnterpriseSalesFrameworksPage() {
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
            Stop Losing Enterprise Deals Because You Can&apos;t Translate Technical Brilliance Into CFO Language
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl sm:text-2xl mb-4"
            style={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            Your product is technically superior. Your team is world-class. But you&apos;re 14 months from running out of runway because you can&apos;t get past the CFO in enterprise sales conversations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <Link
              href="/icp/demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
              }}
            >
              <Sparkles className="w-5 h-5" />
              Generate Your Enterprise Sales Toolkit
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
            77 AI-generated resources that translate your technical product into enterprise-closing sales materials.
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">The Reality You&apos;re Facing</h2>

            <div className="space-y-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <p className="text-lg">
                You wake up at 3 AM terrified about team layoffs.
              </p>
              <p className="text-lg">
                Not because your product isn&apos;t good enough—it&apos;s technically brilliant. Not because you don&apos;t work hard enough—you&apos;re putting in 80-hour weeks.
              </p>
              <p className="text-lg">
                You&apos;re losing enterprise deals because when the CFO asks &quot;What&apos;s the ROI?&quot; you default to explaining your architecture instead of articulating business impact in their language.
              </p>

              <div className="mt-8 p-6 rounded-xl" style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <p className="font-semibold text-lg mb-4" style={{ color: '#ef4444' }}>
                  Every lost enterprise deal brings you closer to the nightmare:
                </p>
                <ul className="space-y-3">
                  {[
                    "14 months of runway becomes 12, then 10, then 8",
                    "Series A conversations start in 90 days with no enterprise logos",
                    "Board meetings where you explain why technical superiority hasn't translated to revenue",
                    "The day you have to tell your team you're out of money"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-red-400">•</span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Why This Is Different From Every Other &quot;Sales Toolkit&quot;</h2>
            <p className="text-xl text-center mb-12" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              We Don&apos;t Give You Generic Templates. We Generate Your Entire Enterprise Sales Methodology Using Cumulative Intelligence.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Every Other Tool */}
              <div className="p-6 rounded-xl" style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Every Other Tool:</h3>
                <ul className="space-y-3">
                  {[
                    "Generic templates that treat every input independently",
                    "One-off outputs with no memory or connection",
                    "Copy/paste the same messaging for everyone",
                    "No personalization that compounds over time"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      <span>✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Andru Cumulative Intelligence */}
              <div className="p-6 rounded-xl" style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Andru Cumulative Intelligence:</h3>
                <ul className="space-y-3">
                  {[
                    "Each resource builds on ALL previous resources",
                    "Resource #77 knows everything from resources #1-76",
                    "Your sales methodology gets smarter with every resource",
                    "Impossible to replicate without our architecture"
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

      {/* Outcomes Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">What This Actually Does For You</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Target,
                  title: "Stop Losing Deals at the CFO Stage",
                  before: '"This sounds expensive. What\'s the ROI?"',
                  after: "You have instant answers that connect your technical superiority to their board milestones, funding deadlines, and survival metrics."
                },
                {
                  icon: Users,
                  title: "Scale Sales Without Founder Involvement",
                  before: "You're in every enterprise sales call because your team can't articulate technical value.",
                  after: "Your sales team has 77 resources that systematically translate technical superiority to business impact."
                },
                {
                  icon: BarChart3,
                  title: "Hit Series A Milestones",
                  before: "14 months runway, no enterprise logos, Series A in 90 days = layoff planning.",
                  after: "Close 3-5 enterprise deals in 90 days using systematic methodology generated for YOUR product."
                },
                {
                  icon: FileText,
                  title: "Prove Technical Founders Can Scale",
                  before: "You fear the board will replace you with a 'business' CEO.",
                  after: "You close enterprise deals, extend runway, hit milestones, and prove engineers can build billion-dollar companies."
                }
              ].map((outcome, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="p-6 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <outcome.icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-4">{outcome.title}</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-red-400 text-sm font-semibold">Before: </span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{outcome.before}</span>
                    </div>
                    <div>
                      <span className="text-green-400 text-sm font-semibold">After: </span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{outcome.after}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Resource Library Overview */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">All 77 Resources, Organized By What You Need When</h2>

            <div className="space-y-8 mt-12">
              {[
                {
                  title: "Tier 1: Core Foundation (5 Resources)",
                  description: "Define who buys, why they buy, and how to talk to them",
                  items: ["ICP Analysis", "Target Buyer Personas", "Empathy Maps", "Refined Product Description", "Value Messaging"]
                },
                {
                  title: "Tier 2: Buyer Intelligence (8 Resources)",
                  description: "Reveal when to reach out, what they fear, and what makes them buy",
                  items: ["Compelling Events", "Buyer Persona Rating", "Cost of Inaction Calculator", "Negative Personas", "Discovery Questions"]
                },
                {
                  title: "Tiers 3-8: Complete Sales Arsenal (64 Resources)",
                  description: "Everything you need to close enterprise deals without founder involvement",
                  items: ["Sales Decks", "Email Templates", "Call Scripts", "Objection Handlers", "ROI Calculators", "Battlecards"]
                }
              ].map((tier, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <h3 className="text-xl font-semibold mb-2">{tier.title}</h3>
                  <p className="mb-4" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{tier.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {tier.items.map((item, itemIndex) => (
                      <span
                        key={itemIndex}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{
                          background: 'rgba(59, 130, 246, 0.2)',
                          color: '#60a5fa'
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Your Team Is Counting On You</h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              You have 14 months of runway. Series A conversations start in 90 days. Every lost enterprise deal brings you closer to team layoffs.
            </p>
            <p className="text-lg mb-8" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <strong>The choice is yours. The timeline is not.</strong>
            </p>

            <Link
              href="/icp/demo"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
              }}
            >
              <Sparkles className="w-5 h-5" />
              Generate Your Enterprise Sales Toolkit
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="mt-6 text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              77 resources. 30 minutes. Immediate use. No credit card required.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <FooterLayout variant="minimal" theme="dark" />
    </div>
  );
}
