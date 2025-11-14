'use client';

import { useEffect, useState } from 'react';
import { initPublicPageTracking, trackCtaClick } from '@/app/lib/analytics/publicPageTracking';
import { useAuth } from '@/app/lib/auth/auth-provider';
import { useBehaviorTracking } from '@/src/shared/hooks/useBehaviorTracking';
import HowToUseModal from './HowToUseModal';
import scenarioModalData from '@/data/scenario-modal-data.json';

interface Timestamp {
  time: string;
  narrative?: string;
  momentOfValue?: string;
  thinking?: string;
  feeling?: string;
  action?: string;
  quote?: string;
}

interface Scenario {
  slug: string;
  company: string;
  title: string;
  scenario: string;
  worstCase: string;
  timestamps: Timestamp[];
}

interface ICPPageClientProps {
  scenario: Scenario;
}

export default function ICPPageClient({ scenario }: ICPPageClientProps) {
  const { slug } = scenario;
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Find modal data for this scenario
  const modalData = scenarioModalData.find((data) => data.slug === slug);

  // Track authenticated user behavior (for logged-in Delve users)
  // This safely handles unauthenticated visitors by not tracking when user is null
  useBehaviorTracking({
    customerId: user?.id || '',
  });

  // Initialize public page tracking for all visitors (anonymous + authenticated)
  useEffect(() => {
    initPublicPageTracking(
      `/icp/${slug}`,
      `${scenario.company} ICP | ${scenario.title}`
    );
  }, [slug, scenario.company, scenario.title]);

  // CTA click handler
  const handleCtaClick = (ctaText: string, ctaLocation: string) => {
    trackCtaClick({
      ctaText,
      ctaLocation,
      pagePath: `/icp/${slug}`
    }).catch(() => {
      // Tracking failures are non-fatal and already logged
    });
  };

  return (
    <div className="min-h-screen" style={{
      fontFamily: '"Red Hat Display", sans-serif',
      background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
      color: '#ffffff'
    }}>
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* CTA Header */}
        <div className="mb-8">
          <div className="rounded-2xl shadow-xl p-8 text-center" style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              A Moment in the Life of A {scenario.company} Customer...
            </h3>
            <p className="text-lg md:text-xl mb-6" style={{ color: '#e5e5e5' }}>
              Built with <strong style={{ color: '#ffffff' }}>Andru</strong>
            </p>
            <p className="text-base mb-8 max-w-2xl mx-auto" style={{ color: '#a3a3a3', lineHeight: '1.6' }}>
              We're on a mission to help you win in enterprise by mapping which markets need {scenario.company} most, what resonates with target buyers, and how to articulate {scenario.company}'s value in THEIR language-automatically.
            </p>
            <div className="flex justify-center">
              <a
                href="https://andru-ai.com/"
                onClick={() => handleCtaClick('See My Buyer Intelligence Score', 'header')}
                className="inline-block text-white font-bold px-8 py-4 rounded-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
              >
                See My Buyer Intelligence Score
              </a>
            </div>
            <p className="text-sm mt-4" style={{ color: '#737373' }}>
              No pitch. Just 3 minutes to see where you stand.
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <a
              href="/"
              className="text-sm hover:opacity-80 transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              ← Back to Andru
            </a>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            {scenario.title}
          </h1>

          <p className="text-xl font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Why The Need {scenario.company}
          </p>
        </div>

        {/* Scenario Content */}
        <div className="rounded-2xl shadow-xl p-8 md:p-12 space-y-8" style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>

          {/* The Scenario */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              The Scenario
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {scenario.scenario}
            </p>
          </section>

          {/* Worst Case */}
          <section className="border-l-4 pl-6 py-2 rounded-r-lg" style={{ borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}>
            <h2 className="text-xl font-bold mb-3" style={{ color: '#fca5a5' }}>
              The Worst-Case They're Avoiding
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#fecaca' }}>
              {scenario.worstCase}
            </p>
          </section>

          {/* Timestamps */}
          <div className="space-y-8 mt-12">
            {scenario.timestamps.map((timestamp, index) => (
              <section key={index} className="relative">
                <div className="flex items-start gap-6">
                  {/* Timeline marker */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg" style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}>
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    {/* Time header */}
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                      {timestamp.time}
                    </h3>

                    {/* Narrative */}
                    {timestamp.narrative && (
                      <p
                        className="mb-3 text-sm leading-relaxed"
                        style={{ color: 'var(--color-text-secondary)' }}
                        dangerouslySetInnerHTML={{ __html: timestamp.narrative }}
                      />
                    )}

                    {/* Thinking */}
                    {timestamp.thinking && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                          What they're thinking:
                        </p>
                        <p
                          className="italic text-sm leading-relaxed"
                          style={{ color: 'var(--color-text-secondary)' }}
                          dangerouslySetInnerHTML={{ __html: timestamp.thinking }}
                        />
                      </div>
                    )}

                    {/* Feeling */}
                    {timestamp.feeling && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                          What they're feeling:
                        </p>
                        <p
                          className="italic text-sm leading-relaxed"
                          style={{ color: 'var(--color-text-secondary)' }}
                          dangerouslySetInnerHTML={{ __html: timestamp.feeling }}
                        />
                      </div>
                    )}

                    {/* Action */}
                    {timestamp.action && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                          What they do:
                        </p>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: 'var(--color-text-secondary)' }}
                          dangerouslySetInnerHTML={{ __html: timestamp.action }}
                        />
                      </div>
                    )}

                    {/* Moment of Value */}
                    {timestamp.momentOfValue && (
                      <div className="border-l-4 pl-6 py-4 mb-4 rounded-r-lg" style={{
                        background: 'rgba(59, 130, 246, 0.08)',
                        borderColor: '#3b82f6',
                        borderWidth: '2px'
                      }}>
                        <p
                          className="text-base font-bold leading-relaxed"
                          style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                          dangerouslySetInnerHTML={{ __html: timestamp.momentOfValue }}
                        />
                      </div>
                    )}

                    {/* Quote */}
                    {timestamp.quote && (
                      <div className="rounded-lg p-4 mt-4" style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}>
                        <p
                          className="italic"
                          style={{ color: 'var(--color-text-secondary)' }}
                          dangerouslySetInnerHTML={{ __html: `"${timestamp.quote}"` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Connecting line */}
                {index < scenario.timestamps.length - 1 && (
                  <div
                    className="absolute left-6 top-16 bottom-0 w-0.5"
                    style={{ background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.3), transparent)' }}
                  />
                )}
              </section>
            ))}
          </div>
        </div>

        {/* How To Use This Scenario Button */}
        {modalData && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-block font-bold px-8 py-4 rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e5e5e5',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#e5e5e5';
              }}
            >
              Use This Scenario Today
            </button>
          </div>
        )}

        {/* CTA Footer */}
        <div className="mt-12 text-center">
          <div className="rounded-2xl shadow-xl p-8 md:p-10" style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Want This Level of Customer Intelligence for Your Company?
            </h3>
            <p className="text-lg mb-4" style={{ color: '#e5e5e5' }}>
              See how your go-to-market foundation compares to other Series A founders
            </p>
            <p className="text-base mb-8 max-w-2xl mx-auto" style={{ color: '#a3a3a3', lineHeight: '1.6' }}>
              A consultant would charge $90K and take 6 months for this complete analysis. With Andru, you get customer intelligence like this in 72 hours—not 6 months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://andru-ai.com/"
                onClick={() => handleCtaClick('See My Buyer Intelligence Score', 'footer')}
                className="inline-block text-white font-bold px-8 py-4 rounded-lg hover:-translate-y-0.5 hover:shadow-xl transition-all w-full sm:w-auto"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
              >
                See My Buyer Intelligence Score
              </a>
              <a
                href="https://calendly.com/humusnshore/discovery-60-min?back=1&month=2025-10"
                onClick={() => handleCtaClick('Talk to the Founder', 'footer')}
                className="inline-block font-bold px-8 py-4 rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all w-full sm:w-auto"
                style={{
                  background: 'transparent',
                  border: '2px solid rgba(139, 92, 246, 0.5)',
                  color: '#ffffff'
                }}
              >
                Talk to the Founder
              </a>
            </div>
            <p className="text-sm mt-4" style={{ color: '#737373' }}>
              Join 47 founders who built their GTM foundation before hiring a VP of Sales
            </p>
          </div>
        </div>
      </div>

      {/* How To Use Modal */}
      {modalData && (
        <HowToUseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          personaRole={modalData.personaRole}
          triggeringMoment={modalData.triggeringMoment}
        />
      )}
    </div>
  );
}
