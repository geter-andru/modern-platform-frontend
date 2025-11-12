'use client';

import React from 'react';
import Link from 'next/link';
import { MotionBackground } from '../../../src/shared/components/ui/MotionBackground';
import { PublicHeader } from '../../../src/shared/components/layout/PublicHeader';

export default function AndruVsZoominfoPage() {
  return (
    <>
      {/* Structured Data for AI Assistants */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Andru & Zoominfo: Buyer Intelligence vs Contact Data - Revenue Intelligence Comparison',
            description: 'Compare Andru and Zoominfo. Zoominfo provides contact data and firmographics, while Andru defines who to target and why. Learn why you need both, and which to use first.',
            author: {
              '@type': 'Organization',
              name: 'Andru',
              url: 'https://andru.ai'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Andru',
              logo: {
                '@type': 'ImageObject',
                url: 'https://andru.ai/logo.png'
              }
            },
            datePublished: '2025-11-01',
            dateModified: '2025-11-01',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://andru.ai/compare/and-zoominfo'
            },
            keywords: 'Andru & Zoominfo, revenue intelligence, contact data, ICP analysis, buyer personas, lead qualification, prospecting intelligence'
          })
        }}
      />

      <MotionBackground />
      <PublicHeader />

      <div
        style={{
          minHeight: '100vh',
          background: 'transparent',
          color: 'var(--color-text-primary, #ffffff)',
          fontFamily: '"Red Hat Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)'
        }}
      >
        {/* Breadcrumb Navigation */}
        <div style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: 'var(--spacing-xl, 24px) 0',
          background: 'var(--color-background-secondary, #0a0a0a)',
          marginTop: '64px'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 var(--spacing-xl, 24px)'
          }}>
            <nav style={{
              color: 'var(--color-text-secondary, #a3a3a3)',
              fontSize: 'var(--font-size-sm, 13px)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Link href="/" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>
                Home
              </Link>
              <span>›</span>
              <Link href="/compare" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>
                Compare
              </Link>
              <span>›</span>
              <span style={{ color: 'var(--color-text-primary, #ffffff)' }}>Andru & ZoomInfo</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: 'var(--spacing-4xl, 64px) var(--spacing-xl, 24px)'
          }}
        >
          {/* Hero Section */}
          <section style={{ marginBottom: 'var(--spacing-4xl, 64px)', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-block',
                padding: 'var(--spacing-sm, 8px) var(--spacing-lg, 16px)',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: 'var(--border-radius-full, 9999px)',
                fontSize: 'var(--font-size-sm, 13px)',
                fontWeight: '600',
                color: '#8b5cf6',
                marginBottom: 'var(--spacing-xl, 24px)'
              }}
            >
              Intelligence vs Data
            </div>
            <h1
              style={{
                fontSize: 'var(--font-size-5xl, 41px)',
                fontWeight: '700',
                lineHeight: '1.2',
                marginBottom: 'var(--spacing-xl, 24px)',
                background: 'linear-gradient(135deg, #ffffff 0%, #a3a3a3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Andru & Zoominfo
            </h1>
            <p
              style={{
                fontSize: 'var(--font-size-xl, 19px)',
                color: 'var(--color-text-secondary, #a3a3a3)',
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}
            >
              Zoominfo gives you millions of contacts. Andru tells you which 100 to call first.
              <br />
              <strong style={{ color: '#ffffff' }}>You need both. Here's which to use first.</strong>
            </p>
          </section>

          {/* What They Do Differently */}
          <section
            className="glass-card"
            style={{
              padding: 'var(--spacing-3xl, 48px)',
              background: 'rgba(26, 26, 26, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--border-radius-lg, 16px)',
              backdropFilter: 'blur(10px)',
              marginBottom: 'var(--spacing-4xl, 64px)'
            }}
          >
            <h2
              style={{
                fontSize: 'var(--font-size-3xl, 31px)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-2xl, 32px)',
                color: '#ffffff'
              }}
            >
              What They Do Differently
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--spacing-2xl, 32px)'
              }}
            >
              {/* Andru Column */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md, 12px)',
                    marginBottom: 'var(--spacing-xl, 24px)'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--border-radius-md, 12px)',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}
                  >
                    🧠
                  </div>
                  <h3
                    style={{
                      fontSize: 'var(--font-size-xl, 19px)',
                      fontWeight: '600',
                      color: '#ffffff'
                    }}
                  >
                    Andru
                  </h3>
                </div>

                <p
                  style={{
                    fontSize: 'var(--font-size-base, 15px)',
                    color: '#8b5cf6',
                    fontWeight: '600',
                    marginBottom: 'var(--spacing-lg, 16px)'
                  }}
                >
                  Foundation Layer: Buyer Intelligence
                </p>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-md, 12px)'
                  }}
                >
                  {[
                    'Defines WHO your ideal buyers are (ICP)',
                    'Creates detailed buyer personas',
                    'Identifies qualification criteria',
                    'Maps pain points & trigger events',
                    'Generates value propositions',
                    'Builds prioritization frameworks',
                    'Defines "good fit" vs "bad fit"',
                    'Creates messaging strategy'
                  ].map((item, index) => (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 'var(--spacing-sm, 8px)',
                        fontSize: 'var(--font-size-sm, 13px)',
                        color: 'var(--color-text-secondary, #a3a3a3)',
                        lineHeight: '1.6'
                      }}
                    >
                      <span style={{ color: '#8b5cf6', flexShrink: 0 }}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Zoominfo Column */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md, 12px)',
                    marginBottom: 'var(--spacing-xl, 24px)'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--border-radius-md, 12px)',
                      background: '#0095FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}
                  >
                    📊
                  </div>
                  <h3
                    style={{
                      fontSize: 'var(--font-size-xl, 19px)',
                      fontWeight: '600',
                      color: '#ffffff'
                    }}
                  >
                    Zoominfo
                  </h3>
                </div>

                <p
                  style={{
                    fontSize: 'var(--font-size-base, 15px)',
                    color: '#0095FF',
                    fontWeight: '600',
                    marginBottom: 'var(--spacing-lg, 16px)'
                  }}
                >
                  Data Layer: Contact Information
                </p>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-md, 12px)'
                  }}
                >
                  {[
                    'Provides contact data (email, phone)',
                    'Shows company firmographics',
                    'Reveals org charts & reporting lines',
                    'Tracks technographic data',
                    'Lists recent funding & growth signals',
                    'Monitors job changes & hiring',
                    'Identifies decision makers',
                    'Enriches existing CRM data'
                  ].map((item, index) => (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 'var(--spacing-sm, 8px)',
                        fontSize: 'var(--font-size-sm, 13px)',
                        color: 'var(--color-text-secondary, #a3a3a3)',
                        lineHeight: '1.6'
                      }}
                    >
                      <span style={{ color: '#0095FF', flexShrink: 0 }}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* The Reality: You Need BOTH */}
          <section
            className="glass-card"
            style={{
              padding: 'var(--spacing-3xl, 48px)',
              background: 'rgba(26, 26, 26, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--border-radius-lg, 16px)',
              backdropFilter: 'blur(10px)',
              marginBottom: 'var(--spacing-4xl, 64px)'
            }}
          >
            <h2
              style={{
                fontSize: 'var(--font-size-3xl, 31px)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-lg, 16px)',
                color: '#ffffff'
              }}
            >
              The Reality: You Need BOTH
            </h2>
            <p
              style={{
                fontSize: 'var(--font-size-base, 15px)',
                color: 'var(--color-text-secondary, #a3a3a3)',
                marginBottom: 'var(--spacing-2xl, 32px)',
                lineHeight: '1.6'
              }}
            >
              Zoominfo has 220M+ contacts. But access to data doesn't mean you know which contacts matter.
              Here's what happens with each approach:
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--spacing-2xl, 32px)'
              }}
            >
              {/* Wrong Order */}
              <div
                style={{
                  padding: 'var(--spacing-xl, 24px)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--border-radius-md, 12px)'
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    padding: 'var(--spacing-sm, 8px) var(--spacing-lg, 16px)',
                    background: '#ef4444',
                    borderRadius: 'var(--border-radius-sm, 8px)',
                    fontSize: 'var(--font-size-sm, 13px)',
                    fontWeight: '600',
                    marginBottom: 'var(--spacing-lg, 16px)'
                  }}
                >
                  ❌ Wrong Order
                </div>
                <ol
                  style={{
                    margin: 0,
                    paddingLeft: 'var(--spacing-xl, 24px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-md, 12px)',
                    fontSize: 'var(--font-size-sm, 13px)',
                    color: 'var(--color-text-secondary, #a3a3a3)',
                    lineHeight: '1.6'
                  }}
                >
                  <li>Buy Zoominfo ($15-40K/year)</li>
                  <li>Get access to 220M contacts</li>
                  <li>Realize: "Wait, who should we actually target?"</li>
                  <li>Export random lists by industry/size</li>
                  <li>Waste 6 months calling wrong prospects</li>
                  <li>Blame the data (but it's not the data's fault)</li>
                  <li>Part of $21M/year waste problem</li>
                </ol>
              </div>

              {/* Right Order */}
              <div
                style={{
                  padding: 'var(--spacing-xl, 24px)',
                  background: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: 'var(--border-radius-md, 12px)'
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    padding: 'var(--spacing-sm, 8px) var(--spacing-lg, 16px)',
                    background: '#22c55e',
                    borderRadius: 'var(--border-radius-sm, 8px)',
                    fontSize: 'var(--font-size-sm, 13px)',
                    fontWeight: '600',
                    color: '#000000',
                    marginBottom: 'var(--spacing-lg, 16px)'
                  }}
                >
                  ✅ Right Order
                </div>
                <ol
                  style={{
                    margin: 0,
                    paddingLeft: 'var(--spacing-xl, 24px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-md, 12px)',
                    fontSize: 'var(--font-size-sm, 13px)',
                    color: 'var(--color-text-secondary, #a3a3a3)',
                    lineHeight: '1.6'
                  }}
                >
                  <li>Start with Andru ($497 founding member)</li>
                  <li>Define exact ICP & qualification criteria</li>
                  <li>Get detailed buyer personas</li>
                  <li>THEN buy Zoominfo to find those people</li>
                  <li>Use ICP filters to export targeted lists</li>
                  <li>Call 100 right people, not 10,000 wrong ones</li>
                  <li>Maximize ROI on every contact credit</li>
                </ol>
              </div>
            </div>

            <div
              style={{
                marginTop: 'var(--spacing-2xl, 32px)',
                padding: 'var(--spacing-lg, 16px)',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: 'var(--border-radius-md, 12px)'
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--font-size-sm, 13px)',
                  color: 'var(--color-text-secondary, #a3a3a3)',
                  lineHeight: '1.6'
                }}
              >
                <strong style={{ color: '#8b5cf6' }}>💡 Key Insight:</strong> Zoominfo gives you the "who"
                (contact data). Andru gives you the "why" (who to prioritize and what makes them qualified).
                Without Andru's intelligence, you're just guessing which of those 220M contacts to call.
              </p>
            </div>
          </section>

          {/* Who Should Use Which */}
          <section
            className="glass-card"
            style={{
              padding: 'var(--spacing-3xl, 48px)',
              background: 'rgba(26, 26, 26, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--border-radius-lg, 16px)',
              backdropFilter: 'blur(10px)',
              marginBottom: 'var(--spacing-4xl, 64px)'
            }}
          >
            <h2
              style={{
                fontSize: 'var(--font-size-3xl, 31px)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-2xl, 32px)',
                color: '#ffffff'
              }}
            >
              Who Should Use Which?
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 'var(--spacing-xl, 24px)'
              }}
            >
              {/* Use Andru First */}
              <div
                style={{
                  padding: 'var(--spacing-xl, 24px)',
                  background: 'rgba(139, 92, 246, 0.08)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: 'var(--border-radius-md, 12px)'
                }}
              >
                <h3
                  style={{
                    fontSize: 'var(--font-size-lg, 17px)',
                    fontWeight: '600',
                    color: '#8b5cf6',
                    marginBottom: 'var(--spacing-lg, 16px)'
                  }}
                >
                  Use Andru FIRST if you:
                </h3>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-sm, 8px)',
                    fontSize: 'var(--font-size-sm, 13px)',
                    color: 'var(--color-text-secondary, #a3a3a3)',
                    lineHeight: '1.6'
                  }}
                >
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Don't have a clear ICP definition</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Can't articulate buyer qualification</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Need prioritization frameworks</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Want to avoid wasting contact credits</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Need messaging for outreach</span>
                  </li>
                </ul>
              </div>

              {/* Then Add Zoominfo */}
              <div
                style={{
                  padding: 'var(--spacing-xl, 24px)',
                  background: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: 'var(--border-radius-md, 12px)'
                }}
              >
                <h3
                  style={{
                    fontSize: 'var(--font-size-lg, 17px)',
                    fontWeight: '600',
                    color: '#22c55e',
                    marginBottom: 'var(--spacing-lg, 16px)'
                  }}
                >
                  Then add Zoominfo to:
                </h3>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-sm, 8px)',
                    fontSize: 'var(--font-size-sm, 13px)',
                    color: 'var(--color-text-secondary, #a3a3a3)',
                    lineHeight: '1.6'
                  }}
                >
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Find contacts matching your ICP</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Get direct dials & verified emails</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Map org charts & decision makers</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Monitor trigger events</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Enrich your CRM data</span>
                  </li>
                </ul>
              </div>

              {/* Use Both */}
              <div
                style={{
                  padding: 'var(--spacing-xl, 24px)',
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 'var(--border-radius-md, 12px)'
                }}
              >
                <h3
                  style={{
                    fontSize: 'var(--font-size-lg, 17px)',
                    fontWeight: '600',
                    color: '#3b82f6',
                    marginBottom: 'var(--spacing-lg, 16px)'
                  }}
                >
                  Use BOTH when you:
                </h3>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-sm, 8px)',
                    fontSize: 'var(--font-size-sm, 13px)',
                    color: 'var(--color-text-secondary, #a3a3a3)',
                    lineHeight: '1.6'
                  }}
                >
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Want intelligence + data unified</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Need targeted prospecting at scale</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Want to maximize data ROI</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Value quality over quantity</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Want strategic prospecting</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Pricing Comparison */}
          <section
            className="glass-card"
            style={{
              padding: 'var(--spacing-3xl, 48px)',
              background: 'rgba(26, 26, 26, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--border-radius-lg, 16px)',
              backdropFilter: 'blur(10px)',
              marginBottom: 'var(--spacing-4xl, 64px)'
            }}
          >
            <h2
              style={{
                fontSize: 'var(--font-size-3xl, 31px)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-2xl, 32px)',
                color: '#ffffff'
              }}
            >
              Pricing Comparison
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 'var(--font-size-sm, 13px)'
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <th
                      style={{
                        textAlign: 'left',
                        padding: 'var(--spacing-lg, 16px)',
                        fontWeight: '600',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      Feature
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: 'var(--spacing-lg, 16px)',
                        fontWeight: '600',
                        color: '#8b5cf6'
                      }}
                    >
                      Andru
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: 'var(--spacing-lg, 16px)',
                        fontWeight: '600',
                        color: '#0095FF'
                      }}
                    >
                      Zoominfo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      Starting Price
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      $497 early access (founding member)
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      $15-25K/year
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      Enterprise Price
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>$297/mo</td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      $40K+/year
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      Contact Database
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ❌ Not included
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ✅ 220M+ contacts
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      ICP Analysis
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ✅ AI-generated
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ❌ You define filters
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      Buyer Personas
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ✅ Core feature
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ❌ Not included
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      Qualification Criteria
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ✅ AI-powered
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ❌ Manual setup
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      Direct Dials
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ❌ Not included
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ✅ Included
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      Technographics
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ❌ Not included
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ✅ 30K+ technologies
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      Intent Signals
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ❌ Not included
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ✅ Included
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      Best For
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      Defining targets
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      Finding targets
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Real User Story */}
          <section
            className="glass-card"
            style={{
              padding: 'var(--spacing-3xl, 48px)',
              background: 'rgba(26, 26, 26, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--border-radius-lg, 16px)',
              backdropFilter: 'blur(10px)',
              marginBottom: 'var(--spacing-4xl, 64px)'
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: 'var(--spacing-sm, 8px) var(--spacing-lg, 16px)',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: 'var(--border-radius-full, 9999px)',
                fontSize: 'var(--font-size-sm, 13px)',
                fontWeight: '600',
                color: '#8b5cf6',
                marginBottom: 'var(--spacing-xl, 24px)'
              }}
            >
              Real User Story
            </div>
            <h2
              style={{
                fontSize: 'var(--font-size-3xl, 31px)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-lg, 16px)',
                color: '#ffffff'
              }}
            >
              "We had 50,000 contacts and no idea who to call"
            </h2>
            <p
              style={{
                fontSize: 'var(--font-size-base, 15px)',
                color: 'var(--color-text-secondary, #a3a3a3)',
                marginBottom: 'var(--spacing-xl, 24px)',
                lineHeight: '1.6',
                fontStyle: 'italic'
              }}
            >
              "We paid $28K for Zoominfo and exported every VP of Sales in the US. 50,000 contacts. Our SDRs
              spent 4 months making calls with a 2% connect rate and 0.1% conversion. We were burning
              credits on companies that would never buy from us. Then we used Andru to actually define our
              ICP — turns out we should only target Series B+ SaaS companies with 50-200 employees in 3
              specific verticals. We went back to Zoominfo with those filters and got 847 highly qualified
              contacts. Our connect rate jumped to 18%, conversion to 4%. Same data, same team — we just
              finally knew who to call."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md, 12px)' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--border-radius-full, 9999px)',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}
              >
                👤
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 'var(--font-size-sm, 13px)',
                    fontWeight: '600',
                    color: '#ffffff'
                  }}
                >
                  Marcus Williams
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 'var(--font-size-xs, 11px)',
                    color: 'var(--color-text-secondary, #a3a3a3)'
                  }}
                >
                  Head of Sales, B2B SaaS ($12M ARR)
                </p>
              </div>
            </div>
          </section>

          {/* Bottom Line */}
          <section
            className="glass-card"
            style={{
              padding: 'var(--spacing-3xl, 48px)',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: 'var(--border-radius-lg, 16px)',
              backdropFilter: 'blur(10px)',
              marginBottom: 'var(--spacing-4xl, 64px)'
            }}
          >
            <h2
              style={{
                fontSize: 'var(--font-size-3xl, 31px)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-lg, 16px)',
                color: '#ffffff'
              }}
            >
              The Bottom Line
            </h2>
            <p
              style={{
                fontSize: 'var(--font-size-lg, 17px)',
                color: '#ffffff',
                marginBottom: 'var(--spacing-lg, 16px)',
                lineHeight: '1.6'
              }}
            >
              Zoominfo is the gold standard for B2B contact data. It gives you access to 220M+ contacts,
              technographics, intent signals, and org charts. But all that data is worthless if you don't
              know which 100 contacts to prioritize.
            </p>
            <p
              style={{
                fontSize: 'var(--font-size-lg, 17px)',
                color: '#ffffff',
                marginBottom: 'var(--spacing-lg, 16px)',
                lineHeight: '1.6'
              }}
            >
              <strong style={{ color: '#8b5cf6' }}>Andru gives you that intelligence.</strong> It defines
              your ICP, creates qualification criteria, and builds prioritization frameworks. Then you use
              Zoominfo to find contacts matching those criteria and actually convert them.
            </p>
            <div
              style={{
                padding: 'var(--spacing-lg, 16px)',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 'var(--border-radius-md, 12px)',
                borderLeft: '4px solid #8b5cf6'
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--font-size-base, 15px)',
                  color: '#ffffff',
                  lineHeight: '1.6'
                }}
              >
                <strong>Think of it this way:</strong> Zoominfo is a library with 220 million books. Andru
                tells you which shelf to go to and which 10 books are worth reading. Don't wander the
                library aimlessly — use Andru first.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section style={{ textAlign: 'center', marginBottom: 'var(--spacing-4xl, 64px)' }}>
            <h2
              style={{
                fontSize: 'var(--font-size-3xl, 31px)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-lg, 16px)',
                color: '#ffffff'
              }}
            >
              Ready to Know Who to Target?
            </h2>
            <p
              style={{
                fontSize: 'var(--font-size-base, 15px)',
                color: 'var(--color-text-secondary, #a3a3a3)',
                marginBottom: 'var(--spacing-2xl, 32px)',
                lineHeight: '1.6'
              }}
            >
              Lock in founding member pricing and get the buyer intelligence that makes Zoominfo (and every contact database) actually work.
            </p>
            <div style={{ display: 'flex', gap: 'var(--spacing-lg, 16px)', justifyContent: 'center' }}>
              <Link
                href="/pricing"
                style={{
                  display: 'inline-block',
                  padding: 'var(--spacing-lg, 16px) var(--spacing-2xl, 32px)',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: 'var(--border-radius-md, 12px)',
                  fontSize: 'var(--font-size-base, 15px)',
                  fontWeight: '600',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.3)';
                }}
              >
                Lock In Founding Member Pricing
              </Link>
              <Link
                href="/ai-seo"
                style={{
                  display: 'inline-block',
                  padding: 'var(--spacing-lg, 16px) var(--spacing-2xl, 32px)',
                  background: 'transparent',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: 'var(--border-radius-md, 12px)',
                  fontSize: 'var(--font-size-base, 15px)',
                  fontWeight: '600',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'border-color 0.2s, background 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Learn More
              </Link>
            </div>
          </section>

          {/* Other Comparisons */}
          <section
            className="glass-card"
            style={{
              padding: 'var(--spacing-2xl, 32px)',
              background: 'rgba(26, 26, 26, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--border-radius-lg, 16px)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3
              style={{
                fontSize: 'var(--font-size-xl, 19px)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-lg, 16px)',
                color: '#ffffff'
              }}
            >
              Compare Andru with Other Tools
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-md, 12px)'
              }}
            >
              {[
                { name: 'Salesforce', href: '/compare/and-salesforce' },
                { name: 'Hubspot', href: '/compare/and-hubspot' },
                { name: 'Gong', href: '/compare/and-gong' },
                { name: 'Clay', href: '/compare/and-clay' }
              ].map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  style={{
                    padding: 'var(--spacing-md, 12px) var(--spacing-lg, 16px)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--border-radius-md, 12px)',
                    color: 'var(--color-text-secondary, #a3a3a3)',
                    textDecoration: 'none',
                    fontSize: 'var(--font-size-sm, 13px)',
                    transition: 'border-color 0.2s, background 0.2s, color 0.2s',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.color = 'var(--color-text-secondary, #a3a3a3)';
                  }}
                >
                  & {tool.name}
                </Link>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: 'var(--spacing-2xl, 32px) 0',
            background: 'var(--color-background-secondary, #0a0a0a)',
            marginTop: 'var(--spacing-5xl, 96px)'
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 var(--spacing-xl, 24px)',
              textAlign: 'center'
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 'var(--font-size-sm, 13px)',
                color: 'var(--color-text-secondary, #a3a3a3)'
              }}
            >
              © 2025 Andru. Revenue Intelligence Operating System.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
