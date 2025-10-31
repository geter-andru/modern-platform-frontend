import { notFound } from 'next/navigation';
import scenarios from '@/data/scenarios.json';

// Generate static params for all scenarios
export async function generateStaticParams() {
  return scenarios.map((scenario) => ({
    slug: scenario.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scenario = scenarios.find((s) => s.slug === slug);

  if (!scenario) {
    return {
      title: 'ICP Scenario Not Found',
    };
  }

  return {
    title: `${scenario.company} ICP | ${scenario.title}`,
    description: scenario.scenario.substring(0, 160),
    openGraph: {
      title: `${scenario.company} - ${scenario.title}`,
      description: scenario.scenario,
      type: 'article',
    },
  };
}

export default async function ICPScenarioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scenario = scenarios.find((s) => s.slug === slug);

  if (!scenario) {
    notFound();
  }

  return (
    <div className="icp-scenario-page">
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-12">

          {/* CTA Header */}
          <div className="mb-8">
            <div className="glass-card rounded-2xl shadow-xl p-8 text-center">
              <h3 className="text-2xl font-bold gradient-text mb-3">
                This is how your product can delight your customers, according to Andru
              </h3>
              <p className="text-lg mb-6" style={{ color: 'var(--color-text-muted)' }}>
                Deep customer insight that makes your product value crystal clear
              </p>
              <a
                href="https://calendly.com/humusnshore/discovery-60-min?back=1&month=2025-10"
                className="btn-primary inline-block text-white font-bold px-8 py-3 rounded-lg"
              >
                Learn More About Andru
              </a>
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
          <div className="glass-card rounded-2xl shadow-xl p-8 md:p-12 space-y-8">

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
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg btn-primary">
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
                        <div className="glass-card rounded-lg p-4 mt-4">
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
            <div className="glass-card rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold gradient-text mb-3">
                This is how your product can delight your customers, according to Andru
              </h3>
              <p className="text-lg mb-6" style={{ color: 'var(--color-text-muted)' }}>
                Deep customer insight that makes your product value crystal clear
              </p>
              <a
                href="https://calendly.com/humusnshore/discovery-60-min?back=1&month=2025-10"
                className="btn-primary inline-block text-white font-bold px-8 py-3 rounded-lg"
              >
                Learn More About Andru
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
