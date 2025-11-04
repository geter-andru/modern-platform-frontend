'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

/**
 * FeatureCard Component
 *
 * Production-ready feature card extracted from homepage pattern.
 * Matches design system established in DESIGN_SYSTEM_SURGICAL_FIXES_COMPLETE.md
 *
 * Features:
 * - Glass morphism styling (design system compliant)
 * - Smooth hover animations (scale + shadow)
 * - Framer Motion viewport animations
 * - Two variants: featured (with CTA) and standard
 * - Flexible icon styling
 * - TypeScript typed
 *
 * Usage:
 * <FeatureCard
 *   icon={Target}
 *   title="ICP Analysis"
 *   description="Generate detailed buyer personas..."
 *   variant="featured"
 *   iconColor="var(--color-primary)"
 *   iconBgColor="rgba(59, 130, 246, 0.15)"
 *   iconBorderColor="rgba(59, 130, 246, 0.3)"
 *   animationDelay={0.1}
 *   href="/icp"
 *   ctaText="Try Demo"
 * />
 */

export interface FeatureCardProps {
  /** Lucide icon component */
  icon: LucideIcon;

  /** Card title */
  title: string;

  /** Card description */
  description: string;

  /** Card variant */
  variant?: 'featured' | 'standard';

  /** Icon color (CSS value) */
  iconColor: string;

  /** Icon container background (CSS value) */
  iconBgColor: string;

  /** Icon container border color (CSS value) */
  iconBorderColor: string;

  /** Animation delay in seconds */
  animationDelay?: number;

  /** CTA link href (for featured variant) */
  href?: string;

  /** CTA button text (for featured variant) */
  ctaText?: string;

  /** Additional CSS classes */
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  variant = 'standard',
  iconColor,
  iconBgColor,
  iconBorderColor,
  animationDelay = 0,
  href,
  ctaText,
  className = ''
}) => {
  // Variant-specific configurations
  const isFeatured = variant === 'featured';

  const cardConfig = isFeatured
    ? {
        // Featured card (ICP Analysis)
        zIndex: 'var(--z-content-featured)',
        background: 'var(--glass-bg-emphasis)',
        backdropFilter: 'var(--glass-blur-lg)',
        border: '1px solid var(--glass-border-emphasis)',
        boxShadow: 'var(--shadow-elegant)',
        hoverBg: 'rgba(255, 255, 255, 0.11)',
        hoverBorder: 'rgba(255, 255, 255, 0.17)',
        hoverShadow: 'var(--shadow-premium)',
        iconSize: 'w-20 h-20',
        iconInnerSize: 'w-10 h-10',
        iconBorder: '2px solid',
        iconShadow: 'var(--shadow-glow-primary)',
        titleClass: 'text-4xl font-bold mb-6',
        descriptionClass: 'text-xl leading-relaxed mb-8'
      }
    : {
        // Standard cards
        zIndex: 'var(--z-content-base)',
        background: 'var(--glass-bg-standard)',
        backdropFilter: 'var(--glass-blur-md)',
        border: '1px solid var(--glass-border-standard)',
        boxShadow: 'var(--shadow-subtle)',
        hoverBg: 'rgba(255, 255, 255, 0.08)',
        hoverBorder: 'rgba(255, 255, 255, 0.13)',
        hoverShadow: 'var(--shadow-elegant)',
        iconSize: 'w-16 h-16',
        iconInnerSize: 'w-8 h-8',
        iconBorder: '1px solid',
        iconShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        titleClass: 'heading-3 mb-4',
        descriptionClass: 'body leading-relaxed'
      };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.style.background = cardConfig.hoverBg;
    target.style.borderColor = cardConfig.hoverBorder;
    target.style.boxShadow = cardConfig.hoverShadow;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.style.background = cardConfig.background;
    target.style.borderColor = cardConfig.border.split(' ').pop() || '';
    target.style.boxShadow = cardConfig.boxShadow;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: animationDelay }}
      className={`group relative p-8 rounded-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${className}`}
      style={{
        zIndex: cardConfig.zIndex,
        background: cardConfig.background,
        backdropFilter: cardConfig.backdropFilter,
        border: cardConfig.border,
        boxShadow: cardConfig.boxShadow
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient overlay for featured cards */}
      {isFeatured && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-3xl" />
      )}

      <div className={isFeatured ? 'relative z-10' : ''}>
        {/* Icon */}
        <div
          className={`${cardConfig.iconSize} mb-${isFeatured ? '8' : '6'} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}
          style={{
            background: iconBgColor,
            border: `${cardConfig.iconBorder} ${iconBorderColor}`,
            boxShadow: cardConfig.iconShadow
          }}
        >
          <Icon className={cardConfig.iconInnerSize} style={{ color: iconColor }} />
        </div>

        {/* Title */}
        <h3
          className={cardConfig.titleClass}
          style={{
            color: isFeatured ? 'var(--text-primary)' : undefined,
            fontFamily: isFeatured ? 'var(--font-family-primary)' : undefined,
            fontWeight: isFeatured ? 'var(--font-weight-bold)' : undefined,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={cardConfig.descriptionClass}
          style={{
            color: isFeatured
              ? 'var(--text-secondary)'
              : 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
            fontFamily: isFeatured ? 'var(--font-family-primary)' : undefined,
            fontWeight: isFeatured ? 'var(--font-weight-normal)' : undefined,
            lineHeight: isFeatured ? 'var(--line-height-relaxed)' : undefined
          }}
        >
          {description}
        </p>

        {/* CTA Button (featured only) */}
        {isFeatured && href && ctaText && (
          <Link
            href={href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300"
            style={{
              background: 'var(--color-primary)',
              color: 'white',
              boxShadow: 'var(--shadow-glow-primary)',
              fontWeight: 'var(--font-weight-semibold)'
            }}
          >
            {ctaText}
            <Icon className="w-4 h-4" />
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default FeatureCard;
