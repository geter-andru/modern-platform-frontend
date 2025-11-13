'use client';

import { useEffect } from 'react';
import { initPublicPageTracking, trackCtaClick } from '@/app/lib/analytics/publicPageTracking';

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

  // Initialize tracking for this ICP page
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
              If We Can Map {scenario.company}'s Customer Journey This Well...
            </h3>
            <p className="text-lg md:text-xl mb-6" style={{ color: '#e5e5e5' }}>
              Imagine what we can do for <strong style={{ color: '#ffffff' }}>your</strong> ICP
            </p>
            <p className="text-base mb-8 max-w-2xl mx-auto" style={{ color: '#a3a3a3', lineHeight: '1.6' }}>
              This customer intelligence took 3 minutes to generate. Most founders spend 3 months (or never figure it out).
              See how Andru maps buyer journeys, pain points, and moments of value—automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://calendly.com/humusnshore/discovery-60-min?back=1&month=2025-10"
                onClick={() => handleCtaClick('Book a 15-Min Chat', 'header')}
                className="inline-block text-white font-bold px-8 py-4 rounded-lg hover:-translate-y-0.5 hover:shadow-xl transition-all w-full sm:w-auto"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
              >
                Book a 15-Min Chat
              </a>
              <a
                href="https://andru-ai.com/"
                onClick={() => handleCtaClick(`See ${scenario.company}'s ICP Score`, 'header')}
                className="inline-block font-bold px-8 py-4 rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all w-full sm:w-auto"
                style={{
                  background: 'transparent',
                  border: '2px solid rgba(139, 92, 246, 0.5)',
                  color: '#ffffff'
                }}
              >
                See {scenario.company}'s ICP Score
              </a>
            </div>
            <p className="text-sm mt-4" style={{ color: '#737373' }}>
              No pitch. Just 3 minutes to see how your ICP clarity compares.
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
            {scenario.company}
          </h1>

          <p className="text-xl font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            {scenario.title}
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
                      <p className="mb-4 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                        {timestamp.narrative}
                      </p>
                    )}

                    {/* Moment of Value */}
                    {timestamp.momentOfValue && (
                      <div className="border-l-4 pl-6 py-4 mb-4 rounded-r-lg" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981' }}>
                        <p className="font-semibold mb-2" style={{ color: '#6ee7b7' }}>
                          💡 Moment of Value
                        </p>
                        <p className="leading-relaxed" style={{ color: '#a7f3d0' }}>
                          {timestamp.momentOfValue}
                        </p>
                      </div>
                    )}

                    {/* Thinking */}
                    {timestamp.thinking && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                          What they're thinking:
                        </p>
                        <p className="italic leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                          {timestamp.thinking}
                        </p>
                      </div>
                    )}

                    {/* Feeling */}
                    {timestamp.feeling && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                          What they're feeling:
                        </p>
                        <p className="italic leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                          {timestamp.feeling}
                        </p>
                      </div>
                    )}

                    {/* Action */}
                    {timestamp.action && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                          What they do:
                        </p>
                        <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                          {timestamp.action}
                        </p>
                      </div>
                    )}

                    {/* Quote */}
                    {timestamp.quote && (
                      <div className="rounded-lg p-4 mt-4" style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}>
                        <p className="italic" style={{ color: 'var(--color-text-secondary)' }}>
                          "{timestamp.quote}"
                        </p>
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
              See how your ICP clarity compares to other Series A founders
            </p>
            <p className="text-base mb-8 max-w-2xl mx-auto" style={{ color: '#a3a3a3', lineHeight: '1.6' }}>
              A consultant would charge $5,000 for this analysis. With Andru, you get buyer intelligence like this in 3 minutes—not 3 months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://andru-ai.com/"
                onClick={() => handleCtaClick(`See ${scenario.company}'s ICP Score`, 'footer')}
                className="inline-block text-white font-bold px-8 py-4 rounded-lg hover:-translate-y-0.5 hover:shadow-xl transition-all w-full sm:w-auto"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
              >
                See {scenario.company}'s ICP Score
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
              Join 47 founders who figured out their ICP before hiring a VP of Sales
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
