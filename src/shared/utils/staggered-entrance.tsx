/**
 * Staggered Animation Entrance System
 *
 * Creates orchestrated page entrances with cascading animation delays.
 * Based on archived platform's 7-stage choreography pattern.
 *
 * Features:
 * - Auto-stagger: Automatically staggers children with configurable delay
 * - Manual control: StaggeredItem for precise delay control
 * - Framer Motion integration for smooth GPU-accelerated animations
 * - Respects prefers-reduced-motion
 * - Configurable entrance animations (slide, fade, scale, lift)
 *
 * Usage:
 * // Auto-stagger (default 0.1s delay between children)
 * <StaggeredEntrance>
 *   <Card />
 *   <Card />
 *   <Card />
 * </StaggeredEntrance>
 *
 * // Custom delay and animation
 * <StaggeredEntrance delay={0.2} animation="lift">
 *   <Section />
 *   <Section />
 * </StaggeredEntrance>
 *
 * // Manual control
 * <div>
 *   <StaggeredItem delay={0}>
 *     <Hero />
 *   </StaggeredItem>
 *   <StaggeredItem delay={0.4}>
 *     <Subheading />
 *   </StaggeredItem>
 *   <StaggeredItem delay={0.8}>
 *     <CTA />
 *   </StaggeredItem>
 * </div>
 */

'use client';

import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';

// ============================================================================
// ANIMATION VARIANTS - Entrance Patterns
// ============================================================================

/**
 * Predefined entrance animation variants
 * Each variant defines initial, animate, and exit states
 */
export const entranceVariants = {
  /**
   * Slide In - Elegant upward slide with fade
   * Use for: Page sections, cards, content blocks
   */
  slide: {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // --ease-elegant
      },
    },
  } as Variants,

  /**
   * Fade In - Simple opacity transition
   * Use for: Text, subtle elements, background content
   */
  fade: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94], // --ease-sophisticated
      },
    },
  } as Variants,

  /**
   * Scale In - Zoom entrance
   * Use for: Modals, popovers, featured elements
   */
  scale: {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94], // --ease-sophisticated
      },
    },
  } as Variants,

  /**
   * Lift - Upward movement with scale
   * Use for: Hero sections, important announcements, milestone cards
   */
  lift: {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // --ease-elegant
      },
    },
  } as Variants,

  /**
   * Dramatic - Bold entrance with overshoot
   * Use for: Celebration moments, achievements, major milestones
   */
  dramatic: {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.34, 1.56, 0.64, 1], // --ease-satisfaction (bouncy)
      },
    },
  } as Variants,
} as const;

// ============================================================================
// STAGGERED ENTRANCE COMPONENT - Auto-Stagger
// ============================================================================

export interface StaggeredEntranceProps {
  children: React.ReactNode;
  /** Delay between each child animation (in seconds) */
  delay?: number;
  /** Which animation variant to use */
  animation?: keyof typeof entranceVariants;
  /** Custom className for container */
  className?: string;
  /** Initial delay before first animation starts (in seconds) */
  initialDelay?: number;
  /** Whether to animate when element comes into view (default: true) */
  viewport?: boolean;
}

/**
 * StaggeredEntrance - Automatically staggers animations for children
 *
 * Wraps children in motion.div elements with increasing delays.
 * Perfect for lists of cards, sections, or grid items.
 *
 * @example
 * <StaggeredEntrance delay={0.1} animation="slide">
 *   <Card />
 *   <Card />
 *   <Card />
 * </StaggeredEntrance>
 */
export const StaggeredEntrance: React.FC<StaggeredEntranceProps> = ({
  children,
  delay = 0.1,
  animation = 'slide',
  className = '',
  initialDelay = 0,
  viewport = true,
}) => {
  const childrenArray = React.Children.toArray(children);
  const variant = entranceVariants[animation];

  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          variants={variant}
          initial="hidden"
          animate="visible"
          viewport={viewport ? { once: true, margin: '-50px' } : undefined}
          whileInView={viewport ? 'visible' : undefined}
          transition={{
            delay: initialDelay + index * delay,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

// ============================================================================
// STAGGERED ITEM COMPONENT - Manual Control
// ============================================================================

export interface StaggeredItemProps {
  children: React.ReactNode;
  /** Specific delay for this item (in seconds) */
  delay?: number;
  /** Which animation variant to use */
  animation?: keyof typeof entranceVariants;
  /** Whether to animate when element comes into view (default: true) */
  viewport?: boolean;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * StaggeredItem - Manual delay control for precise choreography
 *
 * Use this when you need exact control over animation timing,
 * such as hero sections with specific entrance sequences.
 *
 * @example
 * // Archived platform's 7-stage pattern:
 * <StaggeredItem delay={0}><Hero /></StaggeredItem>
 * <StaggeredItem delay={0.2}><Subheading /></StaggeredItem>
 * <StaggeredItem delay={0.4}><Description /></StaggeredItem>
 * <StaggeredItem delay={0.6}><CTAButton /></StaggeredItem>
 * <StaggeredItem delay={0.8}><SecondaryButton /></StaggeredItem>
 * <StaggeredItem delay={1.0}><SocialProof /></StaggeredItem>
 * <StaggeredItem delay={1.2}><FeatureGrid /></StaggeredItem>
 */
export const StaggeredItem: React.FC<StaggeredItemProps> = ({
  children,
  delay = 0,
  animation = 'slide',
  viewport = true,
  className = '',
  style,
}) => {
  const variant = entranceVariants[animation];

  return (
    <motion.div
      variants={variant}
      initial="hidden"
      animate="visible"
      viewport={viewport ? { once: true, margin: '-50px' } : undefined}
      whileInView={viewport ? 'visible' : undefined}
      transition={{
        delay,
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// PRESET PATTERNS - Common Choreographies
// ============================================================================

/**
 * Preset staggered patterns for common use cases
 * Use these for consistent timing across the platform
 */
export const staggerPresets = {
  /**
   * Fast - Quick successive entrances
   * Delay: 0.05s between items
   * Use for: Small lists, menu items, badges
   */
  fast: 0.05,

  /**
   * Normal - Standard comfortable pace
   * Delay: 0.1s between items (default)
   * Use for: Card grids, feature sections, content blocks
   */
  normal: 0.1,

  /**
   * Elegant - Sophisticated slower pace
   * Delay: 0.15s between items
   * Use for: Hero sections, premium content, milestone displays
   */
  elegant: 0.15,

  /**
   * Dramatic - Statement-making slow reveal
   * Delay: 0.2s between items (archived platform pattern)
   * Use for: Landing pages, major announcements, campaign pages
   */
  dramatic: 0.2,

  /**
   * Cascading - Very slow theatrical reveal
   * Delay: 0.3s between items
   * Use for: Storytelling sequences, onboarding flows
   */
  cascading: 0.3,
} as const;

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook to get responsive stagger delays
 * Automatically reduces delays on mobile for faster perceived performance
 */
export const useResponsiveStagger = (
  baseDelay: number = staggerPresets.normal
): number => {
  const [delay, setDelay] = React.useState(baseDelay);

  React.useEffect(() => {
    const updateDelay = () => {
      // Reduce delay by 50% on mobile for snappier feel
      const isMobile = window.innerWidth < 768;
      setDelay(isMobile ? baseDelay * 0.5 : baseDelay);
    };

    updateDelay();
    window.addEventListener('resize', updateDelay);
    return () => window.removeEventListener('resize', updateDelay);
  }, [baseDelay]);

  return delay;
};

/**
 * Hook to check if user prefers reduced motion
 * Use this to conditionally disable animations
 */
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
};

// ============================================================================
// EXAMPLES - Common Usage Patterns
// ============================================================================

/**
 * Example: Hero Section (Archived platform pattern)
 *
 * <div>
 *   <StaggeredItem delay={0} animation="lift">
 *     <h1>Transform Your Business</h1>
 *   </StaggeredItem>
 *   <StaggeredItem delay={0.2} animation="fade">
 *     <p>Subheading text...</p>
 *   </StaggeredItem>
 *   <StaggeredItem delay={0.4} animation="slide">
 *     <p>Description...</p>
 *   </StaggeredItem>
 *   <StaggeredItem delay={0.6} animation="scale">
 *     <Button>Get Started</Button>
 *   </StaggeredItem>
 * </div>
 */

/**
 * Example: Feature Grid
 *
 * <StaggeredEntrance delay={0.1} animation="slide" className="grid grid-cols-3 gap-6">
 *   <FeatureCard />
 *   <FeatureCard />
 *   <FeatureCard />
 *   <FeatureCard />
 *   <FeatureCard />
 *   <FeatureCard />
 * </StaggeredEntrance>
 */

/**
 * Example: Responsive Stagger
 *
 * const delay = useResponsiveStagger(staggerPresets.elegant);
 *
 * <StaggeredEntrance delay={delay}>
 *   <Card />
 *   <Card />
 *   <Card />
 * </StaggeredEntrance>
 */
