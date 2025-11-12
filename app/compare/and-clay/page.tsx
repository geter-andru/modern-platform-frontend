'use client';

import React from 'react';
import Link from 'next/link';

export default function AndruVsClayPage() {
  return (
    <>
      {/* Structured Data for AI Assistants */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Andru & Clay: Strategic Intelligence & Data Enrichment - Revenue Intelligence Comparison',
            description: 'Compare Andru and Clay. Clay automates data enrichment and workflows, while Andru defines who to target and why. Learn why you need both, and which to use first.',
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
              '@id': 'https://andru.ai/compare/and-clay'
            },
            keywords: 'Andru & Clay, revenue intelligence, data enrichment, ICP analysis, buyer personas, workflow automation, prospecting intelligence'
          })
        }}
      />

      <div
        style={{
          minHeight: '100vh',
          background: 'var(--color-background-primary, #000000)',
          color: 'var(--color-text-primary, #ffffff)',
          fontFamily: '"Red Hat Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        {/* Header */}
        <header
          style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: 'var(--spacing-xl, 24px) 0',
            background: 'var(--color-background-secondary, #0a0a0a)'
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 var(--spacing-xl, 24px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Link
              href="/ai-seo"
              style={{
                fontSize: 'var(--font-size-2xl, 28px)',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textDecoration: 'none'
              }}
            >
              Andru
            </Link>
            <Link
              href="/ai-seo"
              style={{
                color: 'var(--color-text-secondary, #a3a3a3)',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm, 13px)',
                transition: 'color 0.2s'
              }}
            >
              ← Back to AI SEO
            </Link>
          </div>
        </header>

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
              Strategy vs Automation
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
              Andru & Clay
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
              Clay automates data enrichment. Andru tells you which data to enrich and why it matters.
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
                  Strategic Layer: Buyer Intelligence
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
                    'Builds messaging frameworks',
                    'Defines "good fit" signals',
                    'Creates prioritization logic'
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

              {/* Clay Column */}
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
                      background: '#FF6B35',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}
                  >
                    ⚡
                  </div>
                  <h3
                    style={{
                      fontSize: 'var(--font-size-xl, 19px)',
                      fontWeight: '600',
                      color: '#ffffff'
                    }}
                  >
                    Clay
                  </h3>
                </div>

                <p
                  style={{
                    fontSize: 'var(--font-size-base, 15px)',
                    color: '#FF6B35',
                    fontWeight: '600',
                    marginBottom: 'var(--spacing-lg, 16px)'
                  }}
                >
                  Operational Layer: Data Enrichment
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
                    'Enriches contact/company data',
                    'Builds data waterfall workflows',
                    'Scrapes LinkedIn & websites',
                    'Finds emails & phone numbers',
                    'Integrates 50+ data providers',
                    'Automates list building',
                    'Creates custom formulas & logic',
                    'Exports to CRM/outbound tools'
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
                      <span style={{ color: '#FF6B35', flexShrink: 0 }}>✓</span>
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
              Clay is incredible at automating data enrichment and building workflows. But enriching data
              without strategy is just building bigger lists of the wrong people. Here's what happens with
              each approach:
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
                  <li>Buy Clay ($149-800/mo)</li>
                  <li>Build complex enrichment workflows</li>
                  <li>Realize: "Wait, who should we even target?"</li>
                  <li>Enrich 10,000 random contacts</li>
                  <li>Waste credits on wrong people</li>
                  <li>Export to CRM, chase bad leads</li>
                  <li>Automation without direction = waste at scale</li>
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
                  <li>Define exact ICP & qualification signals</li>
                  <li>Get precise targeting criteria</li>
                  <li>THEN buy Clay to find those people</li>
                  <li>Build workflows targeting ideal buyers only</li>
                  <li>Enrich 500 perfect-fit prospects</li>
                  <li>Maximize ROI on every credit spent</li>
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
                <strong style={{ color: '#8b5cf6' }}>💡 Key Insight:</strong> Clay is a Ferrari for data
                enrichment — incredibly powerful. But a Ferrari without a destination is just burning gas.
                Andru gives you the map (ICP, personas, qualification criteria). Then Clay gets you there
                fast.
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
                    <span>Don't have clear ICP definition</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Need qualification criteria first</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Want to avoid wasting enrichment credits</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Need strategic targeting logic</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Value quality over quantity</span>
                  </li>
                </ul>
              </div>

              {/* Then Add Clay */}
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
                  Then add Clay to:
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
                    <span>Automate data enrichment workflows</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Find contacts matching your ICP</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Build custom waterfall logic</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Scale prospecting at speed</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Export to outbound tools</span>
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
                    <span>Want intelligence + automation unified</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Need targeted prospecting at scale</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Want to maximize enrichment ROI</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Value strategic automation</span>
                  </li>
                  <li style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
                    <span>•</span>
                    <span>Ready to scale efficiently</span>
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
                        color: '#FF6B35'
                      }}
                    >
                      Clay
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
                      $149-349/mo (Starter-Pro)
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
                      $800+/mo (custom)
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
                      ❌ You define manually
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
                      Data Enrichment
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ❌ Not included
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ✅ 50+ providers
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      Workflow Automation
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
                      Credits/Month
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      N/A (unlimited analysis)
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      2K-50K+ (varies by plan)
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td
                      style={{
                        padding: 'var(--spacing-lg, 16px)',
                        color: 'var(--color-text-secondary, #a3a3a3)'
                      }}
                    >
                      Custom Formulas
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ❌ Not included
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      ✅ Unlimited
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
                      Strategic targeting
                    </td>
                    <td style={{ padding: 'var(--spacing-lg, 16px)', color: '#ffffff' }}>
                      Automated enrichment
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
              "We enriched 15,000 contacts. 200 were actually qualified."
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
              "We went all-in on Clay — built these beautiful waterfall workflows, integrated 10 data
              providers, enriched 15,000 contacts in our first month. Burned through $3,200 in credits. But
              we had no idea who we were actually targeting. Just 'VP Sales at SaaS companies.' Our SDRs
              called for 3 months with a 1.2% conversion rate because 98% of those contacts were wrong fit.
              Then we used Andru to actually define our ICP — turns out we should only target post-Series A
              companies with 30-100 employees selling to SMBs. We went back to Clay with those exact
              criteria and enriched 500 highly qualified prospects. Same team, same tools — but now our
              conversion rate is 11%. Andru told us WHO to enrich. Clay made it fast."
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
                  Jessica Martinez
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 'var(--font-size-xs, 11px)',
                    color: 'var(--color-text-secondary, #a3a3a3)'
                  }}
                >
                  Head of Growth, B2B SaaS ($6M ARR)
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
              Clay is a game-changer for data enrichment and workflow automation. It integrates 50+ data
              providers, builds custom waterfalls, and scales prospecting like nothing else. But it can't
              tell you WHO to target — it just makes targeting whoever you choose incredibly efficient.
            </p>
            <p
              style={{
                fontSize: 'var(--font-size-lg, 17px)',
                color: '#ffffff',
                marginBottom: 'var(--spacing-lg, 16px)',
                lineHeight: '1.6'
              }}
            >
              <strong style={{ color: '#8b5cf6' }}>Andru gives you that "who."</strong> It defines your ICP,
              creates qualification criteria, and builds targeting logic. Then you load those filters into
              Clay and watch it find perfect-fit prospects at scale.
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
                <strong>Think of it this way:</strong> Clay is a supercharged excavator — it can move
                massive amounts of earth incredibly fast. Andru is the geologist who tells you where to dig
                for gold. Don't waste credits digging in the wrong place — use Andru first.
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
              Lock in founding member pricing and get the buyer intelligence that makes Clay (and every enrichment tool) actually work.
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
                { name: 'Gong', href: '/compare/and-gong' }
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
