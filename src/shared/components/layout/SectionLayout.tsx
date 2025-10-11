'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ResponsiveContainer from './ResponsiveContainer';

/**
 * SectionLayout - Enterprise-grade section layout component system
 * 
 * Features:
 * - Multiple section variants (hero, content, feature, testimonial, etc.)
 * - Responsive design with mobile optimization
 * - Background variants (solid, gradient, image, pattern)
 * - Spacing and padding configurations
 * - Content alignment options
 * - Animation support with staggered children
 * - Accessibility compliance
 * - SEO-friendly semantic structure
 */

export type SectionVariant = 
  | 'hero' 
  | 'content' 
  | 'feature' 
  | 'testimonial' 
  | 'cta' 
  | 'stats' 
  | 'pricing'
  | 'faq'
  | 'contact';

export type SectionBackground = 
  | 'none' 
  | 'subtle' 
  | 'dark' 
  | 'gradient' 
  | 'pattern' 
  | 'image';

export type SectionSpacing = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type SectionAlignment = 'left' | 'center' | 'right';

export interface SectionLayoutProps {
  children: React.ReactNode;
  variant?: SectionVariant;
  background?: SectionBackground;
  backgroundImage?: string;
  backgroundOverlay?: boolean;
  spacing?: SectionSpacing;
  paddingTop?: SectionSpacing;
  paddingBottom?: SectionSpacing;
  alignment?: SectionAlignment;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  className?: string;
  containerClassName?: string;
  as?: keyof JSX.IntrinsicElements;
  animate?: boolean;
  staggerChildren?: boolean;
  id?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

const SectionLayout: React.FC<SectionLayoutProps> = ({
  children,
  variant = 'content',
  background = 'none',
  backgroundImage,
  backgroundOverlay = false,
  spacing = 'lg',
  paddingTop,
  paddingBottom,
  alignment = 'left',
  maxWidth = 'xl',
  className = '',
  containerClassName = '',
  as = 'section',
  animate = false,
  staggerChildren = false,
  id,
  'aria-label': ariaLabel,
  'data-testid': testId
}) => {
  // Spacing configurations
  const spacingClasses = {
    none: 'py-0',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20',
    '2xl': 'py-24'
  };

  const paddingTopClasses = {
    none: 'pt-0',
    sm: 'pt-8',
    md: 'pt-12',
    lg: 'pt-16',
    xl: 'pt-20',
    '2xl': 'pt-24'
  };

  const paddingBottomClasses = {
    none: 'pb-0',
    sm: 'pb-8',
    md: 'pb-12',
    lg: 'pb-16',
    xl: 'pb-20',
    '2xl': 'pb-24'
  };

  // Background configurations
  const backgroundClasses = {
    none: '',
    subtle: 'bg-gray-800/30',
    dark: 'bg-gray-800',
    gradient: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
    pattern: 'bg-gray-900 bg-opacity-95 bg-pattern',
    image: 'bg-cover bg-center bg-no-repeat'
  };

  // Variant-specific configurations
  const variantConfigs = {
    hero: {
      defaultSpacing: '2xl' as SectionSpacing,
      defaultAlignment: 'center' as SectionAlignment,
      defaultBackground: 'gradient' as SectionBackground
    },
    content: {
      defaultSpacing: 'lg' as SectionSpacing,
      defaultAlignment: 'left' as SectionAlignment,
      defaultBackground: 'none' as SectionBackground
    },
    feature: {
      defaultSpacing: 'xl' as SectionSpacing,
      defaultAlignment: 'center' as SectionAlignment,
      defaultBackground: 'subtle' as SectionBackground
    },
    testimonial: {
      defaultSpacing: 'xl' as SectionSpacing,
      defaultAlignment: 'center' as SectionAlignment,
      defaultBackground: 'dark' as SectionBackground
    },
    cta: {
      defaultSpacing: 'lg' as SectionSpacing,
      defaultAlignment: 'center' as SectionAlignment,
      defaultBackground: 'gradient' as SectionBackground
    },
    stats: {
      defaultSpacing: 'md' as SectionSpacing,
      defaultAlignment: 'center' as SectionAlignment,
      defaultBackground: 'subtle' as SectionBackground
    },
    pricing: {
      defaultSpacing: 'xl' as SectionSpacing,
      defaultAlignment: 'center' as SectionAlignment,
      defaultBackground: 'none' as SectionBackground
    },
    faq: {
      defaultSpacing: 'lg' as SectionSpacing,
      defaultAlignment: 'left' as SectionAlignment,
      defaultBackground: 'none' as SectionBackground
    },
    contact: {
      defaultSpacing: 'xl' as SectionSpacing,
      defaultAlignment: 'center' as SectionAlignment,
      defaultBackground: 'dark' as SectionBackground
    }
  };

  // Use variant defaults if not explicitly provided
  const config = variantConfigs[variant];
  const finalSpacing = spacing !== 'lg' ? spacing : config.defaultSpacing;
  const finalAlignment = alignment !== 'left' ? alignment : config.defaultAlignment;
  const finalBackground = background !== 'none' ? background : config.defaultBackground;

  // Alignment classes
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  // Build section classes
  const sectionClasses = `
    relative
    ${backgroundClasses[finalBackground]}
    ${paddingTop ? paddingTopClasses[paddingTop] : paddingBottom ? '' : spacingClasses[finalSpacing]}
    ${paddingTop ? '' : paddingBottom ? paddingBottomClasses[paddingBottom] : ''}
    ${paddingTop && paddingBottom ? paddingTopClasses[paddingTop] + ' ' + paddingBottomClasses[paddingBottom] : ''}
    ${alignmentClasses[finalAlignment]}
    ${className}
  `.trim();

  // Background image style
  const backgroundStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`
  } : {};

  // Animation variants
  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        ...(staggerChildren && {
          staggerChildren: 0.1,
          delayChildren: 0.1
        })
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const childVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  const Component = animate ? motion[as as keyof typeof motion] || motion.section : as;
  const ChildWrapper = staggerChildren ? motion.div : React.Fragment;

  return (
    <Component
      id={id}
      className={sectionClasses}
      style={backgroundStyle}
      aria-label={ariaLabel}
      data-testid={testId}
      {...(animate ? {
        variants: sectionVariants,
        initial: "initial",
        animate: "animate",
        exit: "exit",
        viewport: { once: true, margin: "-100px" }
      } : {})}
    >
      {/* Background overlay */}
      {backgroundImage && backgroundOverlay && (
        <div className="absolute inset-0 bg-black/50" />
      )}

      {/* Section content */}
      <ResponsiveContainer
        size={maxWidth as any}
        className={`relative z-10 ${containerClassName}`}
      >
        {staggerChildren ? (
          <ChildWrapper
            {...(animate && staggerChildren ? {
              variants: { animate: { transition: { staggerChildren: 0.1 } } }
            } : {})}
          >
            {React.Children.map(children, (child, index) => 
              animate ? (
                <motion.div key={index} variants={childVariants}>
                  {child}
                </motion.div>
              ) : (
                child
              )
            )}
          </ChildWrapper>
        ) : (
          children
        )}
      </ResponsiveContainer>
    </Component>
  );
};

// Hero Section Component
export interface HeroSectionProps extends Omit<SectionLayoutProps, 'variant'> {
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  media?: React.ReactNode;
  mediaPosition?: 'left' | 'right' | 'background';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  media,
  mediaPosition = 'right',
  children,
  ...sectionProps
}) => {
  const isMediaBackground = mediaPosition === 'background';
  
  return (
    <SectionLayout 
      {...sectionProps} 
      variant="hero" 
      backgroundOverlay={isMediaBackground}
    >
      <div className={`grid gap-12 ${
        media && !isMediaBackground 
          ? mediaPosition === 'left' 
            ? 'lg:grid-cols-2 lg:items-center' 
            : 'lg:grid-cols-2 lg:items-center'
          : ''
      }`}>
        {/* Content */}
        <div className={mediaPosition === 'right' ? 'lg:order-1' : ''}>
          {subtitle && (
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
              {subtitle}
            </p>
          )}
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {title}
          </h1>
          
          {description && (
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              {description}
            </p>
          )}
          
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col sm:flex-row gap-4">
              {primaryAction}
              {secondaryAction}
            </div>
          )}
          
          {children}
        </div>

        {/* Media */}
        {media && !isMediaBackground && (
          <div className={mediaPosition === 'right' ? 'lg:order-2' : ''}>
            {media}
          </div>
        )}
      </div>
      
      {/* Background media */}
      {media && isMediaBackground && (
        <div className="absolute inset-0 z-0">
          {media}
        </div>
      )}
    </SectionLayout>
  );
};

// Feature Section Component
export interface FeatureSectionProps extends Omit<SectionLayoutProps, 'variant'> {
  title?: string;
  description?: string;
  features: Array<{
    icon?: React.ReactNode;
    title: string;
    description: string;
  }>;
  columns?: 1 | 2 | 3 | 4;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  description,
  features,
  columns = 3,
  children,
  ...sectionProps
}) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <SectionLayout {...sectionProps} variant="feature" staggerChildren>
      {(title || description) && (
        <div className="text-center mb-16">
          {title && (
            <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
          )}
          {description && (
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">{description}</p>
          )}
        </div>
      )}

      <div className={`grid gap-8 ${columnClasses[columns]}`}>
        {features.map((feature, index) => (
          <div key={index} className="text-center">
            {feature.icon && (
              <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                {feature.icon}
              </div>
            )}
            <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>

      {children}
    </SectionLayout>
  );
};

// CTA Section Component
export interface CTASectionProps extends Omit<SectionLayoutProps, 'variant'> {
  title: string;
  description?: string;
  primaryAction: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
  ...sectionProps
}) => {
  return (
    <SectionLayout {...sectionProps} variant="cta">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">{title}</h2>
        
        {description && (
          <p className="text-xl text-gray-300 mb-8">{description}</p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryAction}
          {secondaryAction}
        </div>
        
        {children}
      </div>
    </SectionLayout>
  );
};

// Hook for section visibility and animation
export const useSectionVisibility = (threshold: number = 0.1) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return { ref, isVisible };
};

export default SectionLayout;