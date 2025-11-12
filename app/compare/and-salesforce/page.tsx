'use client';

import React from 'react';
import Link from 'next/link';
import { MotionBackground } from '../../../src/shared/components/ui/MotionBackground';
import { PublicHeader } from '../../../src/shared/components/layout/PublicHeader';

/**
 * Andru & Salesforce Comparison Page
 * Positioning: Foundation (Andru) vs Pipeline Management (Salesforce)
 * Message: Andru defines what "qualified" means → Salesforce tracks those deals
 */

export default function AndruVsSalesforcePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Andru & Salesforce: Foundation Layer vs Pipeline Management",
            "description": "Andru defines what 'qualified' means. Salesforce tracks those deals. Learn why you need both tools in the right order.",
            "author": {
              "@type": "Organization",
              "name": "Andru"
            },
            "datePublished": "2025-11-01"
          })
        }}
      />

      <MotionBackground />
      <PublicHeader />

      <div className="min-h-screen pt-32" style={{
        background: 'transparent',
        padding: 'var(--spacing-4xl) var(--spacing-lg)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {/* Breadcrumb Navigation */}
          <nav style={{
            color: 'var(--color-text-secondary, #a3a3a3)',
            fontSize: 'var(--font-size-sm, 13px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: 'var(--spacing-2xl)'
          }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>
              Home
            </Link>
            <span>›</span>
            <Link href="/compare" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>
              Compare
            </Link>
            <span>›</span>
            <span style={{ color: 'var(--color-text-primary, #ffffff)' }}>Andru & Salesforce</span>
          </nav>

          {/* Hero */}
          <section style={{ textAlign: 'center', marginBottom: 'var(--spacing-5xl)' }}>
            <h1 style={{
              fontSize: 'var(--font-size-5xl)',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: 'var(--spacing-xl)',
              letterSpacing: '-0.025em',
              lineHeight: '1.25'
            }}>
              Andru & Salesforce: When to Use Each
            </h1>

            <p style={{
              fontSize: 'var(--font-size-xl)',
              color: '#e5e5e5',
              lineHeight: '1.625'
            }}>
              Foundation Layer vs Pipeline Management
            </p>
          </section>

          {/* What They Do Differently */}
          <section className="glass-card" style={{ marginBottom: 'var(--spacing-4xl)' }}>
            <h2 style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: 'var(--spacing-2xl)'
            }}>
              What They Do Differently
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--spacing-2xl)'
            }}>
              {/* Salesforce Column */}
              <div style={{
                padding: 'var(--spacing-lg)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--border-radius-md)'
              }}>
                <h3 style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: '600',
                  color: '#ef4444',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  Salesforce: Pipeline Management
                </h3>

                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-md)'
                }}>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#a3a3a3',
                    lineHeight: '1.625'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#ef4444' }}>•</span>
                    Tracks deals through sales pipeline
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#a3a3a3',
                    lineHeight: '1.625'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#ef4444' }}>•</span>
                    Manages customer relationships
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#a3a3a3',
                    lineHeight: '1.625'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#ef4444' }}>•</span>
                    Automates sales workflows
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#a3a3a3',
                    lineHeight: '1.625'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#ef4444' }}>•</span>
                    Reports on sales performance
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#ffffff',
                    fontWeight: '600',
                    lineHeight: '1.625',
                    marginTop: 'var(--spacing-lg)'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#f59e0b' }}>⚠️</span>
                    Assumes you already know your ICP
                  </li>
                </ul>
              </div>

              {/* Andru Column */}
              <div style={{
                padding: 'var(--spacing-lg)',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: 'var(--border-radius-md)'
              }}>
                <h3 style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: '600',
                  color: '#3b82f6',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  Andru: Sales Foundation
                </h3>

                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-md)'
                }}>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#e5e5e5',
                    lineHeight: '1.625'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#3b82f6' }}>•</span>
                    Identifies ideal customers (ICP)
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#e5e5e5',
                    lineHeight: '1.625'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#3b82f6' }}>•</span>
                    Generates buyer personas
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#e5e5e5',
                    lineHeight: '1.625'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#3b82f6' }}>•</span>
                    Defines qualification criteria
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#e5e5e5',
                    lineHeight: '1.625'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#3b82f6' }}>•</span>
                    Builds business cases for ROI
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#22c55e',
                    fontWeight: '600',
                    lineHeight: '1.625',
                    marginTop: 'var(--spacing-lg)'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)' }}>✓</span>
                    Provides the foundation Salesforce needs
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* The Reality: You Need BOTH */}
          <section className="glass-card" style={{ marginBottom: 'var(--spacing-4xl)' }}>
            <h2 style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: 'var(--spacing-2xl)'
            }}>
              The Reality: You Need BOTH (In Order)
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--spacing-2xl)'
            }}>
              {/* Wrong Order */}
              <div style={{
                padding: 'var(--spacing-xl)',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--border-radius-md)'
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                  background: '#ef4444',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: '600',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  ❌ Wrong Order
                </div>

                <ol style={{
                  listStyle: 'decimal',
                  paddingLeft: 'var(--spacing-lg)',
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-md)'
                }}>
                  <li style={{ fontSize: 'var(--font-size-base)', color: '#e5e5e5', lineHeight: '1.625' }}>
                    Buy Salesforce ($25-150K/year)
                  </li>
                  <li style={{ fontSize: 'var(--font-size-base)', color: '#e5e5e5', lineHeight: '1.625' }}>
                    Start adding leads to pipeline
                  </li>
                  <li style={{ fontSize: 'var(--font-size-base)', color: '#e5e5e5', lineHeight: '1.625' }}>
                    Realize: "Wait, who are we even targeting?"
                  </li>
                  <li style={{ fontSize: 'var(--font-size-base)', color: '#e5e5e5', lineHeight: '1.625' }}>
                    Waste 6 months chasing wrong prospects
                  </li>
                  <li style={{ fontSize: 'var(--font-size-base)', color: '#ef4444', fontWeight: '600', lineHeight: '1.625' }}>
                    Cancel Salesforce (part of $21M waste)
                  </li>
                </ol>
              </div>

              {/* Right Order */}
              <div style={{
                padding: 'var(--spacing-xl)',
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: 'var(--border-radius-md)'
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                  background: '#22c55e',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: '600',
                  marginBottom: 'var(--spacing-lg)',
                  color: '#000000'
                }}>
                  ✓ Right Order
                </div>

                <ol style={{
                  listStyle: 'decimal',
                  paddingLeft: 'var(--spacing-lg)',
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-md)'
                }}>
                  <li style={{ fontSize: 'var(--font-size-base)', color: '#e5e5e5', lineHeight: '1.625' }}>
                    Use Andru to define ICP ($149-297/mo)
                  </li>
                  <li style={{ fontSize: 'var(--font-size-base)', color: '#e5e5e5', lineHeight: '1.625' }}>
                    Identify ideal buyer personas
                  </li>
                  <li style={{ fontSize: 'var(--font-size-base)', color: '#e5e5e5', lineHeight: '1.625' }}>
                    Set clear qualification criteria
                  </li>
                  <li style={{ fontSize: 'var(--font-size-base)', color: '#e5e5e5', lineHeight: '1.625' }}>
                    THEN buy Salesforce with clear targets
                  </li>
                  <li style={{ fontSize: 'var(--font-size-base)', color: '#22c55e', fontWeight: '600', lineHeight: '1.625' }}>
                    Salesforce delivers ROI (right prospects)
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Who Should Use Which */}
          <section className="glass-card" style={{ marginBottom: 'var(--spacing-4xl)' }}>
            <h2 style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: 'var(--spacing-2xl)'
            }}>
              Who Should Use Which?
            </h2>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xl)'
            }}>
              <div>
                <h3 style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: '600',
                  color: '#3b82f6',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  Use Andru First When:
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-sm)'
                }}>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#e5e5e5',
                    lineHeight: '1.625'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#22c55e' }}>✓</span>
                    You're a technical founder without sales background
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#e5e5e5',
                    lineHeight: '1.625'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#22c55e' }}>✓</span>
                    You're not sure who your ideal customer is
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#e5e5e5',
                    lineHeight: '1.625'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#22c55e' }}>✓</span>
                    Your Salesforce is full of random leads with no clear criteria
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#e5e5e5',
                    lineHeight: '1.625'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#22c55e' }}>✓</span>
                    You need to justify why a prospect is "qualified"
                  </li>
                </ul>
              </div>

              <div>
                <h3 style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: '600',
                  color: '#ef4444',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  Add Salesforce After When:
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-sm)'
                }}>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#e5e5e5',
                    lineHeight: '1.625'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#22c55e' }}>✓</span>
                    You have clear ICP definition (thanks to Andru)
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#e5e5e5',
                    lineHeight: '1.625'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#22c55e' }}>✓</span>
                    You need to manage growing pipeline of qualified leads
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#e5e5e5',
                    lineHeight: '1.625'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#22c55e' }}>✓</span>
                    You want to automate workflows for known buyer personas
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: 'var(--font-size-base)',
                    color: '#e5e5e5',
                    lineHeight: '1.625'
                  }}>
                    <span style={{ marginRight: 'var(--spacing-sm)', color: '#22c55e' }}>✓</span>
                    You need team collaboration on deal progression
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Pricing Comparison */}
          <section className="glass-card" style={{ marginBottom: 'var(--spacing-4xl)' }}>
            <h2 style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: 'var(--spacing-2xl)'
            }}>
              Pricing Comparison
            </h2>

            <div style={{
              overflowX: 'auto'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 'var(--font-size-base)'
              }}>
                <thead>
                  <tr style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <th style={{
                      textAlign: 'left',
                      padding: 'var(--spacing-md)',
                      color: '#ffffff',
                      fontWeight: '600'
                    }}>
                      Feature
                    </th>
                    <th style={{
                      textAlign: 'left',
                      padding: 'var(--spacing-md)',
                      color: '#3b82f6',
                      fontWeight: '600'
                    }}>
                      Andru
                    </th>
                    <th style={{
                      textAlign: 'left',
                      padding: 'var(--spacing-md)',
                      color: '#ef4444',
                      fontWeight: '600'
                    }}>
                      Salesforce
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <td style={{ padding: 'var(--spacing-md)', color: '#e5e5e5' }}>Price</td>
                    <td style={{ padding: 'var(--spacing-md)', color: '#a3a3a3' }}>$149-297/mo</td>
                    <td style={{ padding: 'var(--spacing-md)', color: '#a3a3a3' }}>$25-150K/year</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <td style={{ padding: 'var(--spacing-md)', color: '#e5e5e5' }}>Purpose</td>
                    <td style={{ padding: 'var(--spacing-md)', color: '#a3a3a3' }}>Foundation</td>
                    <td style={{ padding: 'var(--spacing-md)', color: '#a3a3a3' }}>Execution</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <td style={{ padding: 'var(--spacing-md)', color: '#e5e5e5' }}>When to Buy</td>
                    <td style={{ padding: 'var(--spacing-md)', color: '#a3a3a3' }}>FIRST (before sales tools)</td>
                    <td style={{ padding: 'var(--spacing-md)', color: '#a3a3a3' }}>AFTER (when scaling)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <td style={{ padding: 'var(--spacing-md)', color: '#e5e5e5' }}>Best For</td>
                    <td style={{ padding: 'var(--spacing-md)', color: '#a3a3a3' }}>Technical founders</td>
                    <td style={{ padding: 'var(--spacing-md)', color: '#a3a3a3' }}>Sales teams</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 'var(--spacing-md)', color: '#e5e5e5' }}>Setup Time</td>
                    <td style={{ padding: 'var(--spacing-md)', color: '#a3a3a3' }}>Minutes (AI-powered)</td>
                    <td style={{ padding: 'var(--spacing-md)', color: '#a3a3a3' }}>Weeks (complex setup)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Real User Story */}
          <section className="glass-card" style={{ marginBottom: 'var(--spacing-4xl)' }}>
            <h2 style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: 'var(--spacing-2xl)'
            }}>
              Real User Story
            </h2>

            <div style={{
              padding: 'var(--spacing-xl)',
              background: 'rgba(139, 92, 246, 0.08)',
              borderLeft: '4px solid #8b5cf6',
              borderRadius: 'var(--border-radius-md)'
            }}>
              <p style={{
                fontSize: 'var(--font-size-lg)',
                fontStyle: 'italic',
                color: '#e5e5e5',
                lineHeight: '1.625',
                marginBottom: 'var(--spacing-lg)'
              }}>
                "I bought Salesforce first. Huge waste of money. We were tracking deals but had no idea if they were actually good fits. Our pipeline was full but conversion was terrible."
              </p>

              <p style={{
                fontSize: 'var(--font-size-lg)',
                fontStyle: 'italic',
                color: '#e5e5e5',
                lineHeight: '1.625',
                marginBottom: 'var(--spacing-lg)'
              }}>
                "Then I used Andru to figure out our actual ICP - who we should be targeting, why they buy, what pain points matter. NOW Salesforce is valuable. We only track qualified leads that match our ICP criteria."
              </p>

              <p style={{
                fontSize: 'var(--font-size-base)',
                color: '#a3a3a3',
                fontWeight: '600'
              }}>
                — Sarah Chen, CTO @ Greptile
              </p>
            </div>
          </section>

          {/* Bottom Line */}
          <section className="glass-card" style={{
            marginBottom: 'var(--spacing-4xl)',
            textAlign: 'center',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <h2 style={{
              fontSize: 'var(--font-size-4xl)',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: 'var(--spacing-lg)'
            }}>
              Bottom Line
            </h2>

            <p style={{
              fontSize: 'var(--font-size-xl)',
              color: '#e5e5e5',
              lineHeight: '1.625',
              marginBottom: 'var(--spacing-md)'
            }}>
              <strong>These tools don't compete. They complement.</strong>
            </p>

            <p style={{
              fontSize: 'var(--font-size-lg)',
              color: '#a3a3a3',
              lineHeight: '1.625'
            }}>
              Andru = Foundation (who to sell to)<br />
              Salesforce = Execution (how to track deals)
            </p>

            <p style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: '600',
              color: '#3b82f6',
              marginTop: 'var(--spacing-xl)'
            }}>
              You can't execute effectively without a foundation.
            </p>
          </section>

          {/* CTA */}
          <section className="glass-card" style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-4xl)'
          }}>
            <h3 style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: 'var(--spacing-lg)'
            }}>
              Start with the Foundation
            </h3>

            <p style={{
              fontSize: 'var(--font-size-base)',
              color: '#a3a3a3',
              marginBottom: 'var(--spacing-xl)'
            }}>
              Define your ICP with Andru. Then use Salesforce to track the right deals.
            </p>

            <Link href="/pricing" style={{
              display: 'inline-block',
              padding: 'var(--spacing-lg) var(--spacing-3xl)',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              color: '#ffffff',
              borderRadius: 'var(--border-radius-md)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              Try Andru Free →
            </Link>

            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: '#737373',
              marginTop: 'var(--spacing-lg)'
            }}>
              Beta launching December 1, 2025
            </p>
          </section>

          {/* Other Comparisons */}
          <section className="glass-card">
            <h3 style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: 'var(--spacing-lg)'
            }}>
              Compare Andru with Other Tools
            </h3>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--spacing-md)'
            }}>
              <Link href="/compare/and-hubspot" style={{
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--border-radius-sm)',
                color: '#3b82f6',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)'
              }}>
                Andru & Hubspot →
              </Link>

              <Link href="/compare/and-gong" style={{
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--border-radius-sm)',
                color: '#3b82f6',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)'
              }}>
                Andru & Gong →
              </Link>

              <Link href="/compare/and-zoominfo" style={{
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--border-radius-sm)',
                color: '#3b82f6',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)'
              }}>
                Andru & Zoominfo →
              </Link>

              <Link href="/compare/and-clay" style={{
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--border-radius-sm)',
                color: '#3b82f6',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)'
              }}>
                Andru & Clay →
              </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
