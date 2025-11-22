'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, Clock, ArrowLeft, Sparkles } from 'lucide-react';
import { MotionBackground } from '../../src/shared/components/ui/MotionBackground';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen relative" style={{
      background: 'transparent',
      color: '#ffffff',
      fontFamily: '"Red Hat Display", sans-serif'
    }}>
      <MotionBackground />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full" style={{
              background: 'rgba(59, 130, 246, 0.15)',
              border: '2px solid rgba(59, 130, 246, 0.3)'
            }}>
              <Rocket className="w-12 h-12 text-blue-400" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold mb-6"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Great Things Take Time
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl sm:text-2xl mb-4"
            style={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            We&apos;re building something special here.
          </motion.p>

          {/* Witty Copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg mb-8"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            Unlike your competitors&apos; &quot;6-month roadmap&quot; that never ships,<br />
            we actually deliver. Check back soon.
          </motion.p>

          {/* Feature hint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-12"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            <Clock className="w-5 h-5" />
            <span className="text-sm">Launching faster than you can say &quot;product-market fit&quot;</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff'
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>

            <Link
              href="/icp/demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
              }}
            >
              <Sparkles className="w-5 h-5" />
              Try The Demo Instead
            </Link>
          </motion.div>

          {/* Bottom note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-12 text-sm"
            style={{ color: 'rgba(255, 255, 255, 0.4)' }}
          >
            Want early access? Email us at{' '}
            <a
              href="mailto:geter@andru-ai.com"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              geter@andru-ai.com
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
