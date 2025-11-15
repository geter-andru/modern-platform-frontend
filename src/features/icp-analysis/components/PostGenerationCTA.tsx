'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Zap,
  Users,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';

type CTAVariant = 'beta-waitlist' | 'urgent-assistance' | 'discovery' | 'all';

interface PostGenerationCTAProps {
  variant?: CTAVariant;
  productName?: string;
  className?: string;
  onCTAClick?: (ctaType: string) => void;
}

export function PostGenerationCTA({
  variant = 'all',
  productName,
  className = '',
  onCTAClick
}: PostGenerationCTAProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  // CTA configurations
  const ctas = {
    'beta-waitlist': {
      icon: Users,
      title: 'Join the Founding Members Waitlist',
      description: 'Get full platform access Dec 1st + lock in $750/mo forever (vs $1,250/mo standard)',
      benefits: [
        'Full platform access + quarterly ICP updates',
        '1:1 strategy sessions with founders',
        'Private Slack community',
        'Price locked forever at $750/mo'
      ],
      buttonText: 'Join Paid Waitlist',
      buttonHref: '/pricing#waitlist',
      urgency: '87 of 100 spots remaining',
      color: 'blue',
      gradientFrom: '#3b82f6',
      gradientTo: '#8b5cf6',
      recommended: true
    },
    'urgent-assistance': {
      icon: Zap,
      title: 'Need Help Closing a Deal This Week?',
      description: '90-minute strategy session to close active deals, build your sales process, or onboard new sales hires',
      benefits: [
        '90-min 1:1 strategy call (this week)',
        'Actionable plan you can execute today',
        'Deal-specific playbook & scripts',
        '$350 applies toward founding membership'
      ],
      buttonText: 'Book Urgent Assistance ($350)',
      buttonHref: 'https://calendly.com/humusnshore/urgent-assistance',
      urgency: 'Next slot: This week',
      color: 'orange',
      gradientFrom: '#f97316',
      gradientTo: '#ef4444',
      recommended: false
    },
    'discovery': {
      icon: Calendar,
      title: 'Want to See How This Fits Your Sales Process?',
      description: '60-minute discovery call to understand your situation and see if Andru is the right fit',
      benefits: [
        'Understand your current sales challenges',
        'See how Andru accelerates your pipeline',
        'Get custom ROI projection',
        'No pressure, just clarity'
      ],
      buttonText: 'Book Discovery Call (Free)',
      buttonHref: 'https://calendly.com/humusnshore/discovery-60-min',
      urgency: null,
      color: 'green',
      gradientFrom: '#10b981',
      gradientTo: '#14b8a6',
      recommended: false
    }
  };

  // Determine which CTAs to show
  const visibleCTAs = variant === 'all'
    ? Object.entries(ctas)
    : [[variant, ctas[variant as keyof typeof ctas]]];

  const handleCTAClick = (ctaKey: string) => {
    if (onCTAClick) {
      onCTAClick(ctaKey);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="text-center mb-8">
        <h3 className="heading-2 mb-3">
          {productName ? `Perfect! Now Let's Get ${productName} Selling` : "What's Your Next Step?"}
        </h3>
        <p className="body-large text-text-muted max-w-2xl mx-auto">
          You've seen what your ICP looks like. Choose the path that matches where you are:
        </p>
      </div>

      {/* CTA Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {visibleCTAs.map(([key, cta]) => {
          const Icon = cta.icon;
          const isSelected = selectedPath === key;

          return (
            <motion.div
              key={key}
              className="relative p-6 rounded-2xl border cursor-pointer"
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${cta.gradientFrom}15 0%, ${cta.gradientTo}15 100%)`
                  : 'var(--glass-bg)',
                borderColor: isSelected
                  ? `${cta.gradientFrom}80`
                  : 'var(--glass-border)',
                transition: 'all 0.3s ease'
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              onMouseEnter={() => setSelectedPath(key)}
              onMouseLeave={() => setSelectedPath(null)}
            >
              {/* Recommended badge */}
              {cta.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: `linear-gradient(135deg, ${cta.gradientFrom} 0%, ${cta.gradientTo} 100%)`,
                    color: 'white'
                  }}
                >
                  Most Popular
                </div>
              )}

              {/* Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${cta.gradientFrom}20 0%, ${cta.gradientTo}20 100%)`,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: cta.gradientFrom }} />
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="heading-4 mb-2">{cta.title}</h4>
              <p className="body-small text-text-muted mb-4">{cta.description}</p>

              {/* Benefits */}
              <ul className="space-y-2 mb-6">
                {cta.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="body-small text-text-muted">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Urgency */}
              {cta.urgency && (
                <div className="mb-4 p-2 rounded-lg flex items-center gap-2"
                  style={{
                    background: `${cta.gradientFrom}10`,
                    border: `1px solid ${cta.gradientFrom}30`
                  }}
                >
                  <Clock className="w-4 h-4" style={{ color: cta.gradientFrom }} />
                  <span className="body-small font-medium" style={{ color: cta.gradientFrom }}>
                    {cta.urgency}
                  </span>
                </div>
              )}

              {/* CTA Button */}
              <Link
                href={cta.buttonHref}
                onClick={() => handleCTAClick(key)}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${cta.gradientFrom} 0%, ${cta.gradientTo} 100%)`,
                  boxShadow: `0 4px 16px ${cta.gradientFrom}40`
                }}
                target={cta.buttonHref.startsWith('http') ? '_blank' : undefined}
                rel={cta.buttonHref.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {cta.buttonText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Helper Text */}
      <div className="text-center mt-8 p-4 rounded-lg" style={{
        background: 'rgba(59, 130, 246, 0.05)',
        border: '1px solid rgba(59, 130, 246, 0.2)'
      }}>
        <p className="body-small text-text-muted">
          <strong className="text-text-primary">Not sure which path?</strong> Book a discovery call—we'll help you figure out what makes sense for your stage.
        </p>
      </div>
    </div>
  );
}
