'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';

/**
 * PublicHeader Component
 * Persistent navigation header for all public-facing pages
 *
 * Features:
 * - Fixed position with backdrop blur
 * - Desktop navigation with dropdown
 * - Mobile hamburger menu
 * - Login CTA button
 */

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [whyAndruOpen, setWhyAndruOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold" style={{
              color: 'var(--color-text-primary, #ffffff)',
              fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
            }}>
              Andru
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="https://andru-ai.com/assessment"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors hover:text-blue-400"
              style={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Free Assessment
            </a>

            {/* Why Andru Dropdown */}
            <div className="relative">
              <button
                onClick={() => setWhyAndruOpen(!whyAndruOpen)}
                className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-blue-400"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Why Andru
                <ChevronDown className={`w-4 h-4 transition-transform ${whyAndruOpen ? 'rotate-180' : ''}`} />
              </button>

              {whyAndruOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setWhyAndruOpen(false)}
                  />

                  {/* Dropdown Menu */}
                  <div
                    className="absolute top-full left-0 mt-2 w-56 rounded-lg z-20"
                    style={{
                      background: 'rgba(0, 0, 0, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <div className="py-2">
                      <Link
                        href="/compare/and-clay"
                        className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        onClick={() => setWhyAndruOpen(false)}
                      >
                        Andru & Clay
                      </Link>
                      <Link
                        href="/compare/and-gong"
                        className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        onClick={() => setWhyAndruOpen(false)}
                      >
                        Andru & Gong
                      </Link>
                      <Link
                        href="/compare/and-hubspot"
                        className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        onClick={() => setWhyAndruOpen(false)}
                      >
                        Andru & HubSpot
                      </Link>
                      <Link
                        href="/compare/and-salesforce"
                        className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        onClick={() => setWhyAndruOpen(false)}
                      >
                        Andru & Salesforce
                      </Link>
                      <Link
                        href="/compare/and-zoominfo"
                        className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        onClick={() => setWhyAndruOpen(false)}
                      >
                        Andru & ZoomInfo
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-blue-400"
              style={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium transition-colors hover:text-blue-400"
              style={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="px-6 py-2 rounded-lg font-semibold text-sm transition-all"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff'
              }}
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            style={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a
              href="https://andru-ai.com/assessment"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 text-sm font-medium"
              style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Free Assessment
            </a>

            {/* Why Andru - Mobile */}
            <div>
              <button
                onClick={() => setWhyAndruOpen(!whyAndruOpen)}
                className="flex items-center justify-between w-full py-2 text-sm font-medium"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Why Andru
                <ChevronDown className={`w-4 h-4 transition-transform ${whyAndruOpen ? 'rotate-180' : ''}`} />
              </button>
              {whyAndruOpen && (
                <div className="pl-4 mt-2 space-y-2">
                  <Link
                    href="/compare/and-clay"
                    className="block py-2 text-sm"
                    style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Andru & Clay
                  </Link>
                  <Link
                    href="/compare/and-gong"
                    className="block py-2 text-sm"
                    style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Andru & Gong
                  </Link>
                  <Link
                    href="/compare/and-hubspot"
                    className="block py-2 text-sm"
                    style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Andru & HubSpot
                  </Link>
                  <Link
                    href="/compare/and-salesforce"
                    className="block py-2 text-sm"
                    style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Andru & Salesforce
                  </Link>
                  <Link
                    href="/compare/and-zoominfo"
                    className="block py-2 text-sm"
                    style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Andru & ZoomInfo
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="block py-2 text-sm font-medium"
              style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="block py-2 text-sm font-medium"
              style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="block px-6 py-2 rounded-lg font-semibold text-sm text-center"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
