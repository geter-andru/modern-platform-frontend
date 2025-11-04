/**
 * Compound Hover Effect Utilities
 *
 * Creates 3D depth perception through simultaneous transform, shadow, and brightness changes.
 * Based on archived platform's compound micro-interaction patterns.
 *
 * Usage:
 * const { handleMouseEnter, handleMouseLeave } = useCompoundHover();
 * <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>...</div>
 */

export interface CompoundHoverConfig {
  lift?: number;              // translateY amount in pixels (default: -2)
  scale?: number;             // scale multiplier (default: 1.0, no scaling)
  brightness?: number;        // filter brightness multiplier (default: 1.05)
  shadowColor?: string;       // shadow color as RGB string (default: '59, 130, 246')
  shadowIntensity?: number;   // shadow opacity (default: 0.2)
  duration?: string;          // transition duration (default: 'var(--duration-smooth)')
  easing?: string;            // easing curve (default: 'var(--ease-sophisticated)')
}

const DEFAULT_CONFIG: Required<CompoundHoverConfig> = {
  lift: -2,
  scale: 1.0,
  brightness: 1.05,
  shadowColor: '59, 130, 246',
  shadowIntensity: 0.2,
  duration: 'var(--duration-smooth)',
  easing: 'var(--ease-sophisticated)'
};

/**
 * Apply compound hover effect to an element
 */
export const compoundHover = {
  enter: (element: HTMLElement, config: CompoundHoverConfig = {}) => {
    const {
      lift,
      scale,
      brightness,
      shadowColor,
      shadowIntensity,
      duration,
      easing
    } = { ...DEFAULT_CONFIG, ...config };

    // Build transform string
    const transforms: string[] = [];
    if (lift !== 0) {
      transforms.push(`translateY(${lift}px)`);
    }
    if (scale !== 1.0) {
      transforms.push(`scale(${scale})`);
    }

    element.style.transform = transforms.join(' ');
    element.style.boxShadow = `0 15px 30px rgba(${shadowColor}, ${shadowIntensity})`;
    element.style.filter = `brightness(${brightness})`;
    element.style.transition = `all ${duration} ${easing}`;
  },

  leave: (element: HTMLElement) => {
    element.style.transform = '';
    element.style.boxShadow = '';
    element.style.filter = '';
    // Keep transition for smooth return
  },

  /**
   * Preset configurations for common patterns
   */
  presets: {
    /** Subtle lift - Professional cards */
    subtle: {
      lift: -1,
      brightness: 1.02,
      shadowIntensity: 0.1
    } as CompoundHoverConfig,

    /** Medium lift - Default interaction */
    medium: {
      lift: -2,
      brightness: 1.05,
      shadowIntensity: 0.2
    } as CompoundHoverConfig,

    /** Strong lift - Hero cards, primary CTAs */
    strong: {
      lift: -4,
      brightness: 1.1,
      shadowIntensity: 0.3
    } as CompoundHoverConfig,

    /** Scale up - Buttons, interactive elements */
    scale: {
      lift: 0,
      scale: 1.02,
      brightness: 1.05,
      shadowIntensity: 0.15
    } as CompoundHoverConfig,

    /** Dramatic - Milestone cards, achievements */
    dramatic: {
      lift: -6,
      scale: 1.02,
      brightness: 1.15,
      shadowIntensity: 0.4,
      duration: 'var(--duration-dramatic)',
      easing: 'var(--ease-satisfaction)'
    } as CompoundHoverConfig,

    /** Blue glow - Primary branded elements */
    blue: {
      lift: -2,
      brightness: 1.05,
      shadowColor: '59, 130, 246',
      shadowIntensity: 0.25
    } as CompoundHoverConfig,

    /** Purple glow - Secondary branded elements */
    purple: {
      lift: -2,
      brightness: 1.05,
      shadowColor: '139, 92, 246',
      shadowIntensity: 0.25
    } as CompoundHoverConfig,

    /** Green glow - Success states, positive actions */
    green: {
      lift: -2,
      brightness: 1.05,
      shadowColor: '16, 185, 129',
      shadowIntensity: 0.25
    } as CompoundHoverConfig
  }
};

/**
 * React Hook for Compound Hover
 *
 * @param config - Optional configuration or preset name
 * @returns Mouse event handlers
 *
 * @example
 * const { handleMouseEnter, handleMouseLeave } = useCompoundHover('strong');
 * <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>...</div>
 */
export const useCompoundHover = (
  config?: CompoundHoverConfig | keyof typeof compoundHover.presets
) => {
  // Resolve config from preset name or use directly
  const resolvedConfig = typeof config === 'string'
    ? compoundHover.presets[config]
    : config;

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    compoundHover.enter(e.currentTarget, resolvedConfig);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    compoundHover.leave(e.currentTarget);
  };

  return { handleMouseEnter, handleMouseLeave };
};
