'use client';

import SupabaseAuth from '../../src/shared/components/auth/SupabaseAuth';
import { FooterLayout } from '../../src/shared/components/layout/FooterLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)'
    }}>
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
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
          <Link
            href="/pricing"
            className="text-sm font-medium transition-colors"
            style={{
              color: 'var(--color-text-muted, rgba(255, 255, 255, 0.6))'
            }}
          >
            View Pricing
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Welcome Card */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{
              color: 'var(--color-text-primary, #ffffff)',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
            }}>
              Welcome Back
            </h1>
            <p className="body" style={{
              color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))'
            }}>
              Sign in to access your dashboard and AI-powered revenue intelligence tools
            </p>
          </div>

          {/* Auth Component Container */}
          <div className="rounded-2xl p-8" style={{
            background: 'var(--glass-bg-standard)',
            backdropFilter: 'var(--glass-blur-md)',
            border: '1px solid var(--glass-border-standard)',
            boxShadow: 'var(--shadow-elegant)'
          }}>
            <SupabaseAuth redirectTo="/dashboard" />
          </div>

          {/* Payment Required Notice */}
          <div className="mt-6 p-4 rounded-lg" style={{
            background: 'rgba(234, 179, 8, 0.1)',
            border: '1px solid rgba(234, 179, 8, 0.3)'
          }}>
            <p className="body-small" style={{
              color: '#eab308',
              textAlign: 'center'
            }}>
              ⚠️ Platform access requires founding member payment.{' '}
              <Link
                href="/pricing"
                className="font-semibold underline"
                style={{ color: '#eab308' }}
              >
                View pricing
              </Link>
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="body-small" style={{
              color: 'var(--color-text-muted, rgba(255, 255, 255, 0.6))'
            }}>
              Don't have an account?{' '}
              <Link
                href="/pricing"
                className="font-semibold transition-colors"
                style={{
                  color: 'var(--color-primary, #3b82f6)'
                }}
              >
                View Founding Member Pricing
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <FooterLayout variant="minimal" theme="dark" />
    </div>
  );
}