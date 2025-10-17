'use client';

import React, { useState, useRef, useEffect, cloneElement, isValidElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

/**
 * ModernTooltip - Advanced tooltip component for Next.js App Router
 *
 * Features:
 * - 4 positioning options (top, bottom, left, right)
 * - Auto-positioning with viewport edge detection
 * - Hover and focus state triggers
 * - Optional click-to-toggle mode
 * - Arrow/pointer element
 * - Configurable show/hide delays (default 200ms)
 * - Portal rendering (attaches to body)
 * - Rich content support
 * - Keyboard navigation (Escape to close)
 * - Touch device support
 * - Dark theme design system
 * - Framer Motion fade-in animations
 * - TypeScript strict mode
 * - Full accessibility (ARIA attributes)
 */

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
  showArrow?: boolean;
  clickable?: boolean;
  maxWidth?: string;
  className?: string;
  contentClassName?: string;
}

const ModernTooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 200,
  disabled = false,
  showArrow = true,
  clickable = false,
  maxWidth = '320px',
  className = '',
  contentClassName = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [calculatedPosition, setCalculatedPosition] = useState(position);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const hideTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isHoveringTooltip = useRef(false);

  // Calculate tooltip position with auto-flip for viewport edges
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    const offset = 8;
    let finalPosition = position;
    let x = 0;
    let y = 0;

    // Calculate initial position
    switch (position) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - offset;

        // Flip to bottom if not enough space at top
        if (y < 0) {
          finalPosition = 'bottom';
          y = triggerRect.bottom + offset;
        }
        break;

      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + offset;

        // Flip to top if not enough space at bottom
        if (y + tooltipRect.height > viewport.height) {
          finalPosition = 'top';
          y = triggerRect.top - tooltipRect.height - offset;
        }
        break;

      case 'left':
        x = triggerRect.left - tooltipRect.width - offset;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;

        // Flip to right if not enough space at left
        if (x < 0) {
          finalPosition = 'right';
          x = triggerRect.right + offset;
        }
        break;

      case 'right':
        x = triggerRect.right + offset;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;

        // Flip to left if not enough space at right
        if (x + tooltipRect.width > viewport.width) {
          finalPosition = 'left';
          x = triggerRect.left - tooltipRect.width - offset;
        }
        break;
    }

    // Ensure tooltip stays within viewport bounds (horizontal)
    const padding = 8;
    if (x < padding) {
      x = padding;
    } else if (x + tooltipRect.width > viewport.width - padding) {
      x = viewport.width - tooltipRect.width - padding;
    }

    // Ensure tooltip stays within viewport bounds (vertical)
    if (y < padding) {
      y = padding;
    } else if (y + tooltipRect.height > viewport.height - padding) {
      y = viewport.height - tooltipRect.height - padding;
    }

    setCoords({ x, y });
    setCalculatedPosition(finalPosition);
  };

  // Show tooltip with delay
  const showTooltip = () => {
    if (disabled) return;

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  // Hide tooltip with delay
  const hideTooltip = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      if (!isHoveringTooltip.current) {
        setIsVisible(false);
      }
    }, delay);
  };

  // Event handlers
  const handleMouseEnter = () => {
    if (!clickable) {
      showTooltip();
    }
  };

  const handleMouseLeave = () => {
    if (!clickable) {
      hideTooltip();
    }
  };

  const handleFocus = () => {
    if (!clickable) {
      showTooltip();
    }
  };

  const handleBlur = () => {
    if (!clickable) {
      hideTooltip();
    }
  };

  const handleClick = () => {
    if (clickable) {
      if (isVisible) {
        setIsVisible(false);
      } else {
        showTooltip();
      }
    }
  };

  const handleTooltipMouseEnter = () => {
    isHoveringTooltip.current = true;
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  };

  const handleTooltipMouseLeave = () => {
    isHoveringTooltip.current = false;
    hideTooltip();
  };

  // Calculate position when visible
  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, content]);

  // Recalculate on scroll/resize
  useEffect(() => {
    if (!isVisible) return;

    const handleReposition = () => calculatePosition();

    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);

    return () => {
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [isVisible]);

  // Handle escape key
  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsVisible(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Clone children with event handlers
  const clonedChild = isValidElement(children)
    ? cloneElement(children, {
        ref: (ref: HTMLElement) => {
          triggerRef.current = ref;
          // Preserve original ref
          const originalRef = (children as any).ref;
          if (typeof originalRef === 'function') {
            originalRef(ref);
          } else if (originalRef) {
            originalRef.current = ref;
          }
        },
        onMouseEnter: (e: React.MouseEvent) => {
          (children.props as any)?.onMouseEnter?.(e);
          handleMouseEnter();
        },
        onMouseLeave: (e: React.MouseEvent) => {
          (children.props as any)?.onMouseLeave?.(e);
          handleMouseLeave();
        },
        onFocus: (e: React.FocusEvent) => {
          (children.props as any)?.onFocus?.(e);
          handleFocus();
        },
        onBlur: (e: React.FocusEvent) => {
          (children.props as any)?.onBlur?.(e);
          handleBlur();
        },
        onClick: (e: React.MouseEvent) => {
          (children.props as any)?.onClick?.(e);
          handleClick();
        },
        'aria-describedby': isVisible ? 'modern-tooltip' : undefined
      } as any)
    : children;

  // Get arrow styles based on position
  const getArrowStyles = (): React.CSSProperties => {
    const arrowSize = 6;
    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid'
    };

    switch (calculatedPosition) {
      case 'top':
        return {
          ...baseStyles,
          top: '100%',
          left: '50%',
          marginLeft: -arrowSize,
          borderWidth: `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`,
          borderColor: '#374151 transparent transparent transparent'
        };

      case 'bottom':
        return {
          ...baseStyles,
          bottom: '100%',
          left: '50%',
          marginLeft: -arrowSize,
          borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`,
          borderColor: 'transparent transparent #374151 transparent'
        };

      case 'left':
        return {
          ...baseStyles,
          left: '100%',
          top: '50%',
          marginTop: -arrowSize,
          borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
          borderColor: 'transparent transparent transparent #374151'
        };

      case 'right':
        return {
          ...baseStyles,
          right: '100%',
          top: '50%',
          marginTop: -arrowSize,
          borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
          borderColor: 'transparent #374151 transparent transparent'
        };

      default:
        return baseStyles;
    }
  };

  // Animation variants based on position
  const getAnimationVariants = () => {
    const distance = 8;

    const variants = {
      hidden: {
        opacity: 0,
        scale: 0.95,
        y: 0,
        x: 0
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0
      }
    };

    switch (calculatedPosition) {
      case 'top':
        variants.hidden.y = distance;
        break;
      case 'bottom':
        variants.hidden.y = -distance;
        break;
      case 'left':
        variants.hidden.x = distance;
        break;
      case 'right':
        variants.hidden.x = -distance;
        break;
    }

    return variants;
  };

  const animationVariants = getAnimationVariants();

  // Tooltip content
  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          variants={animationVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={`
            fixed z-50 px-3 py-2 text-sm text-white
            bg-gray-800 border border-gray-700 rounded-lg shadow-xl
            pointer-events-auto
            ${contentClassName}
            ${className}
          `}
          style={{
            left: coords.x,
            top: coords.y,
            maxWidth
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          role="tooltip"
          id="modern-tooltip"
        >
          {content}

          {/* Arrow */}
          {showArrow && (
            <div style={getArrowStyles()} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {clonedChild}
      {typeof document !== 'undefined'
        ? createPortal(tooltipContent, document.body)
        : null
      }
    </>
  );
};

ModernTooltip.displayName = 'ModernTooltip';

export default ModernTooltip;
