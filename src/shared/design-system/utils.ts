/**
 * Andru Revenue Intelligence - Design System Utilities
 * Utility functions for token management and DOM manipulation
 * 
 * SURGICAL IMPLEMENTATION:
 * - Safe DOM manipulation
 * - Error handling and fallbacks
 * - Performance optimized
 * 
 * Last Updated: 2025-10-21
 */

import { DesignTokens } from './types';

/**
 * Get nested value from object using dot notation
 * Example: getNestedValue(tokens, 'colors.background.primary')
 */
export const getNestedValue = (obj: any, path: string): string => {
  try {
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return current[key];
      }
      return '';
    }, obj) || '';
  } catch (error) {
    console.warn(`Design System: Failed to get token at path "${path}"`, error);
    return '';
  }
};

/**
 * Apply design tokens to DOM CSS variables
 * Safely updates CSS custom properties without breaking existing styles
 */
export const applyTokensToDOM = (tokens: DesignTokens): void => {
  try {
    if (typeof window === 'undefined') {
      return; // Skip on server-side
    }

    console.log('Design System: applyTokensToDOM called with tokens:', tokens);

    // Safety check: ensure tokens object exists and has required properties
    if (!tokens || !tokens.typography) {
      console.error('Design System: Invalid tokens object provided to applyTokensToDOM:', {
        tokens,
        hasTokens: !!tokens,
        hasTypography: tokens?.typography ? true : false
      });
      return;
    }

    const root = document.documentElement;
    
    // Apply typography tokens
    if (tokens.typography.fontFamily) {
      root.style.setProperty('--font-family-primary', tokens.typography.fontFamily.primary);
      root.style.setProperty('--font-family-mono', tokens.typography.fontFamily.mono);
    }
    
    if (tokens.typography.fontWeight) {
      Object.entries(tokens.typography.fontWeight).forEach(([key, value]) => {
        root.style.setProperty(`--font-weight-${key}`, value);
      });
    }
    
    if (tokens.typography.fontSize) {
      Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
        root.style.setProperty(`--text-${key}`, value);
      });
    }
    
    if (tokens.typography.lineHeight) {
      Object.entries(tokens.typography.lineHeight).forEach(([key, value]) => {
        root.style.setProperty(`--leading-${key}`, value);
      });
    }
    
    if (tokens.typography.letterSpacing) {
      Object.entries(tokens.typography.letterSpacing).forEach(([key, value]) => {
        root.style.setProperty(`--tracking-${key}`, value);
      });
    }

    // Apply color tokens
    if (tokens.colors && tokens.colors.background) {
      Object.entries(tokens.colors.background).forEach(([key, value]) => {
        root.style.setProperty(`--color-background-${key}`, value);
      });
    }
    
    if (tokens.colors && tokens.colors.text) {
      Object.entries(tokens.colors.text).forEach(([key, value]) => {
        root.style.setProperty(`--color-text-${key}`, value);
      });
    }
    
    if (tokens.colors && tokens.colors.brand) {
      Object.entries(tokens.colors.brand).forEach(([key, value]) => {
        root.style.setProperty(`--color-brand-${key}`, value);
      });
    }
    
    if (tokens.colors && tokens.colors.semantic) {
      Object.entries(tokens.colors.semantic).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }
    
    if (tokens.colors && tokens.colors.interactive) {
      Object.entries(tokens.colors.interactive).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }
    
    if (tokens.colors && tokens.colors.border) {
      Object.entries(tokens.colors.border).forEach(([key, value]) => {
        root.style.setProperty(`--border-${key}`, value);
      });
    }

    // Apply gradient tokens
    if (tokens.gradients) {
      Object.entries(tokens.gradients).forEach(([key, value]) => {
        root.style.setProperty(`--gradient-${key}`, value);
      });
    }

    // Apply spacing tokens
    if (tokens.spacing) {
      Object.entries(tokens.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--space-${key}`, value);
      });
    }

    // Apply shadow tokens
    if (tokens.shadows) {
      Object.entries(tokens.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value);
      });
    }

    // Apply animation tokens
    if (tokens.animations && tokens.animations.duration) {
      Object.entries(tokens.animations.duration).forEach(([key, value]) => {
        root.style.setProperty(`--duration-${key}`, value);
      });
    }
    
    if (tokens.animations && tokens.animations.easing) {
      Object.entries(tokens.animations.easing).forEach(([key, value]) => {
        root.style.setProperty(`--ease-${key}`, value);
      });
    }
    
    if (tokens.animations && tokens.animations.transitions) {
      Object.entries(tokens.animations.transitions).forEach(([key, value]) => {
        root.style.setProperty(`--transition-${key}`, value);
      });
    }

    // Apply glass effect tokens
    if (tokens.glass && tokens.glass.background) {
      Object.entries(tokens.glass.background).forEach(([key, value]) => {
        root.style.setProperty(`--glass-background`, value);
      });
    }

    if (tokens.glass && tokens.glass.border) {
      Object.entries(tokens.glass.border).forEach(([key, value]) => {
        root.style.setProperty(`--glass-border`, value);
      });
    }

    if (tokens.glass && tokens.glass.blur) {
      Object.entries(tokens.glass.blur).forEach(([key, value]) => {
        root.style.setProperty(`--glass-backdrop`, value);
      });
    }

    // Apply layout tokens
    if (tokens.layout && tokens.layout.container) {
      Object.entries(tokens.layout.container).forEach(([key, value]) => {
        root.style.setProperty(`--container-${key}`, value);
      });
    }
    
    if (tokens.layout && tokens.layout.content) {
      Object.entries(tokens.layout.content).forEach(([key, value]) => {
        root.style.setProperty(`--content-${key}`, value);
      });
    }
    
    if (tokens.layout && tokens.layout.zIndex) {
      Object.entries(tokens.layout.zIndex).forEach(([key, value]) => {
        root.style.setProperty(`--z-${key}`, value);
      });
    }

    // Apply competency tokens
    if (tokens.competency) {
      Object.entries(tokens.competency).forEach(([key, value]) => {
        root.style.setProperty(`--competency-level-${key}`, value);
      });
    }

    // Apply notification tokens
    if (tokens.notification) {
      Object.entries(tokens.notification).forEach(([key, value]) => {
        root.style.setProperty(`--notification-${key}`, value);
      });
    }

  } catch (error) {
    console.error('Design System: Failed to apply tokens to DOM', error);
  }
};

/**
 * Merge design tokens safely
 * Handles partial updates without breaking existing tokens
 */
export const mergeTokens = (base: DesignTokens, updates: Partial<DesignTokens>): DesignTokens => {
  try {
    const merged = { ...base };
    
    // Deep merge each category
    if (updates.typography) {
      merged.typography = { ...base.typography, ...updates.typography };
    }
    
    if (updates.colors) {
      merged.colors = { ...base.colors, ...updates.colors };
    }
    
    if (updates.gradients) {
      merged.gradients = { ...base.gradients, ...updates.gradients };
    }
    
    if (updates.spacing) {
      merged.spacing = { ...base.spacing, ...updates.spacing };
    }
    
    if (updates.shadows) {
      merged.shadows = { ...base.shadows, ...updates.shadows };
    }
    
    if (updates.animations) {
      merged.animations = { ...base.animations, ...updates.animations };
    }
    
    if (updates.glass) {
      merged.glass = { ...base.glass, ...updates.glass };
    }
    
    if (updates.layout) {
      merged.layout = { ...base.layout, ...updates.layout };
    }
    
    if (updates.competency) {
      merged.competency = { ...base.competency, ...updates.competency };
    }
    
    if (updates.notification) {
      merged.notification = { ...base.notification, ...updates.notification };
    }
    
    return merged;
  } catch (error) {
    console.error('Design System: Failed to merge tokens', error);
    return base; // Return original tokens on error
  }
};

/**
 * Validate design tokens
 * Ensures all required tokens are present and valid
 */
export const validateTokens = (tokens: DesignTokens): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  try {
    // Validate typography
    if (!tokens.typography?.fontFamily?.primary) {
      errors.push('Missing typography.fontFamily.primary');
    }
    if (!tokens.typography?.fontSize?.base) {
      errors.push('Missing typography.fontSize.base');
    }
    
    // Validate colors
    if (!tokens.colors?.background?.primary) {
      errors.push('Missing colors.background.primary');
    }
    if (!tokens.colors?.text?.primary) {
      errors.push('Missing colors.text.primary');
    }
    if (!tokens.colors?.brand?.primary) {
      errors.push('Missing colors.brand.primary');
    }
    
    // Validate spacing
    if (!tokens.spacing?.['4']) {
      errors.push('Missing spacing.4');
    }
    
    // Validate shadows
    if (!tokens.shadows?.md) {
      errors.push('Missing shadows.md');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  } catch (error) {
    return {
      isValid: false,
      errors: ['Token validation failed: ' + (error as Error).message]
    };
  }
};

/**
 * Get CSS variable name from token path
 * Example: 'colors.background.primary' -> '--bg-primary'
 */
export const getCSSVariableName = (path: string): string => {
  const pathParts = path.split('.');
  
  if (pathParts.length === 3) {
    const [category, subcategory, token] = pathParts;
    
    switch (category) {
      case 'colors':
        if (subcategory === 'background') {
          return `--bg-${token}`;
        } else if (subcategory === 'text') {
          return `--text-${token}`;
        } else if (subcategory === 'brand') {
          return `--color-${token}`;
        } else if (subcategory === 'semantic') {
          return `--color-${token}`;
        } else if (subcategory === 'interactive') {
          return `--color-${token}`;
        } else if (subcategory === 'border') {
          return `--border-${token}`;
        }
        break;
      case 'typography':
        if (subcategory === 'fontSize') {
          return `--text-${token}`;
        } else if (subcategory === 'lineHeight') {
          return `--leading-${token}`;
        } else if (subcategory === 'letterSpacing') {
          return `--tracking-${token}`;
        } else if (subcategory === 'fontWeight') {
          return `--font-weight-${token}`;
        }
        break;
      case 'spacing':
        return `--space-${token}`;
      case 'shadows':
        return `--shadow-${token}`;
      case 'gradients':
        return `--gradient-${token}`;
      case 'animations':
        if (subcategory === 'duration') {
          return `--duration-${token}`;
        } else if (subcategory === 'easing') {
          return `--ease-${token}`;
        } else if (subcategory === 'transitions') {
          return `--transition-${token}`;
        }
        break;
      case 'glass':
        if (subcategory === 'background') {
          return `--glass-bg-${token}`;
        } else if (subcategory === 'border') {
          return `--glass-border-${token}`;
        } else if (subcategory === 'blur') {
          return `--glass-blur-${token}`;
        }
        break;
      case 'layout':
        if (subcategory === 'container') {
          return `--container-${token}`;
        } else if (subcategory === 'content') {
          return `--content-${token}`;
        } else if (subcategory === 'zIndex') {
          return `--z-${token}`;
        }
        break;
      case 'competency':
        return `--competency-level-${token}`;
      case 'notification':
        return `--notification-${token}`;
    }
  }
  
  return `--${path.replace(/\./g, '-')}`;
};

/**
 * Debounce function for performance optimization
 * Prevents excessive DOM updates during rapid token changes
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Create debounced token application function
 * Optimizes performance for rapid token updates
 */
export const createDebouncedTokenApplier = (wait: number = 100) => {
  return debounce(applyTokensToDOM, wait);
};
