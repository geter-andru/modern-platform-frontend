'use client';

import React from 'react';
import Link from 'next/link';
import { MotionBackground } from '../../../src/shared/components/ui/MotionBackground';
import { PublicHeader } from '../../../src/shared/components/layout/PublicHeader';

export default function AndruVsGongPage() {
  return (
    <>
      {/* Structured Data for AI Assistants */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Andru & Gong: Proactive Intelligence vs Reactive Coaching - Revenue Intelligence Comparison',
            description: 'Compare Andru and Gong. Andru defines messaging strategy before calls, while Gong analyzes what happened after. Learn why you need both, and which to use first.',
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
              '@id': 'https://andru.ai/compare/and-gong'
            },
            keywords: 'Andru & Gong, revenue intelligence, conversation intelligence, sales coaching, buyer personas, messaging strategy, call analysis'
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
              <span style={{ color: 'var(--color-text-primary, #ffffff)' }}>Andru & Gong</span>
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
              Proactive vs Reactive Intelligence
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
              Andru & Gong
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
              Gong shows you what your reps said. Andru tells them what they SHOULD say.
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
                  Proactive Layer: Strategic Foundation
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
                    'Defines ICP before first call',
                    'Creates buyer personas & pain points',
                    'Builds messaging frameworks',
                    'Generates objection handling scripts',
                    'Maps value propositions',
                    'Creates talk tracks for each persona',
                    'Defines qualification criteria',
                    'Provides pre-call intelligence'
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

              {/* Gong Column */}
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
                      background: '#FF5A4D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}
                  >
                    🎙️
                  </div>
                  <h3
                    style={{
                      fontSize: 'var(--font-size-xl, 19px)',
                      fontWeight: '600',
                      color: '#ffffff'
                    }}
                  >
                    Gong
                  </h3>
                </div>

                <p
                  style={{
                    fontSize: 'var(--font-size-base, 15px)',
                    color: '#FF5A4D',
                    fontWeight: '600',
                    marginBottom: 'var(--spacing-lg, 16px)'
                  }}
                >
                  Reactive Layer: Post-Call Analysis
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
                    'Records & transcribes sales calls',
                    'Analyzes what was said (talk ratio)',
                    'Identifies keywords & competitors mentioned',
                    'Tracks objections raised',
                    'Scores call effectiveness',
                    'Provides coaching recommendations',
                    'Highlights winning patterns',
                    'Generates call summaries'
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
                      <span style={{ color: '#FF5A4D', flexShrink: 0 }}>✓</span>
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
              Gong is brilliant at showing you what happened on calls and coaching reps to improve. But
              coaching without strategy is just polishing bad messaging. Here's what happens with each
              approach:
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
                  <li>Buy Gong ($1,200-5,000/user/year)</li>
                  <li>Start recording sales calls</li>
                  <li>Realize: "Our reps don't know what to say"</li>
                  <li>Gong shows they're talking too much</li>
                  <li>But no one knows the RIGHT messaging</li>
                  <li>6 months of coaching to improve bad scripts</li>
                  <li>Convert 18% → 22% (marginal improvement)</li>
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
                  <li>Define ICP, personas, messaging frameworks</li>
                  <li>Give reps proven talk tracks & objection handling</li>
                  <li>THEN buy Gong to optimize execution</li>
                  <li>Gong shows which messages resonate most</li>
                  <li>Coaching improves GOOD messaging</li>
                  <li>Convert 18% → 42% (strategic improvement)</li>
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
                <strong style={{ color: '#8b5cf6' }}>💡 Key Insight:</strong> Gong tells you "Your reps are
                only getting 30% talk time." Andru tells you what they should say during that 30%. Gong
                optimizes execution. Andru creates the strategy worth executing.
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
                    <span>Don't have clear messaging frameworks</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Reps struggle with objection handling</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Need persona-specific talk tracks</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Want strategic foundation first</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Launching new product/market</span>
                  </li>
                </ul>
              </div>

              {/* Then Add Gong */}
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
                  Then add Gong to:
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
                    <span>Record & analyze every call</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Identify which messages work best</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Coach reps to improve execution</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Track deal progression signals</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Scale best practices across team</span>
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
                    <span>Want strategy + execution unified</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Need proven messaging + coaching</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Want continuous optimization loop</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Value data-driven improvement</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Ready to maximize win rates</span>
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
                        color: '#FF5A4D'
                      }}
                    >
                      Gong
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
                      Pricing Model
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      $497 early access (founding member)
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      Per user ($1,200-5,000/year)
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      10-Person Team
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      $297/mo ($3,564/year)
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      $12K-50K/year
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      ICP Definition
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ✅ AI-generated
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
                      Messaging Frameworks
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ✅ AI-generated
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ❌ You create manually
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      Call Recording
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ❌ Not included
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ✅ Unlimited
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      AI Call Analysis
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ❌ Not included
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ✅ Core feature
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      Coaching Insights
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ❌ Not included
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ✅ AI-powered
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      Deal Intelligence
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
                      Creating strategy
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      Optimizing execution
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
              "Gong showed us the problem. Andru gave us the answer."
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
              "We spent $35K on Gong and it immediately showed us the issue: our reps were pitching features
              instead of outcomes, talking 70% of the time, and getting destroyed on price objections. But
              Gong couldn't tell us WHAT to say instead — it just showed us we were doing it wrong. We used
              Andru to build persona-specific talk tracks, value propositions mapped to pain points, and
              objection handling frameworks. Loaded those into our playbook. Within 2 weeks, Gong showed our
              talk ratio drop to 40%, objection handling improve 3x, and win rates jump from 19% to 37%.
              Same reps, same product — we just finally gave them the right words to say."
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
                  David Park
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 'var(--font-size-xs, 11px)',
                    color: 'var(--color-text-secondary, #a3a3a3)'
                  }}
                >
                  VP Sales, Enterprise SaaS ($45M ARR)
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
              Gong is revolutionary for revenue intelligence. It records calls, analyzes patterns, identifies
              coaching opportunities, and helps teams improve execution. But it can't create your messaging
              strategy — it can only show you how well you're executing it.
            </p>
            <p
              style={{
                fontSize: 'var(--font-size-lg, 17px)',
                color: '#ffffff',
                marginBottom: 'var(--spacing-lg, 16px)',
                lineHeight: '1.6'
              }}
            >
              <strong style={{ color: '#8b5cf6' }}>Andru creates that strategy.</strong> It defines your
              ICP, builds buyer personas, generates messaging frameworks, and creates talk tracks. Then Gong
              shows you which parts of that strategy work best and helps you optimize them.
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
                <strong>Think of it this way:</strong> Gong is your fitness tracker showing you ran 5 miles.
                Andru is your training plan telling you which route to run and why. Don't just track bad
                execution — create good strategy first, then use Gong to optimize it.
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
              Ready to Build Your Messaging Strategy?
            </h2>
            <p
              style={{
                fontSize: 'var(--font-size-base, 15px)',
                color: 'var(--color-text-secondary, #a3a3a3)',
                marginBottom: 'var(--spacing-2xl, 32px)',
                lineHeight: '1.6'
              }}
            >
              Lock in founding member pricing and get the buyer intelligence that makes Gong (and every coaching tool) actually work.
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
                { name: 'Zoominfo', href: '/compare/and-zoominfo' },
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
