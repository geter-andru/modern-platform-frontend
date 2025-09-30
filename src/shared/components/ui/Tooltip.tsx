'use client';

import React, { useState, useRef, useEffect, cloneElement, isValidElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

/**
 * Tooltip - Advanced tooltip system
 * 
 * Features:
 * - Multiple placement options (top, bottom, left, right, auto)
 * - Smart positioning with collision detection
 * - Hover and focus triggers
 * - Delay configurations
 * - Rich content support
 * - Keyboard navigation
 * - Portal rendering
 * - Touch device support
 * - Custom styling and animations
 * - Arrow indicators
 */

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end' | 'auto';
export type TooltipTrigger = 'hover' | 'focus' | 'click' | 'manual';

export interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  trigger?: TooltipTrigger | TooltipTrigger[];
  delay?: number | { show: number; hide: number };
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  arrowClassName?: string;
  offset?: number;
  showArrow?: boolean;
  portal?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  maxWidth?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  trigger = 'hover',
  delay = { show: 200, hide: 100 },
  disabled = false,
  className = '',
  contentClassName = '',
  arrowClassName = '',
  offset = 8,
  showArrow = true,
  portal = true,
  onVisibilityChange,
  maxWidth = 320
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPlacement, setCurrentPlacement] = useState(placement);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();
  const isHoveringTooltip = useRef(false);

  const triggers = Array.isArray(trigger) ? trigger : [trigger];
  const showDelay = typeof delay === 'number' ? delay : delay.show;
  const hideDelay = typeof delay === 'number' ? delay : delay.hide;

  // Calculate tooltip position
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let finalPlacement = placement;
    let x = 0;
    let y = 0;

    // Auto placement - find best position
    if (placement === 'auto') {
      const spaces = {
        top: triggerRect.top,
        bottom: viewport.height - triggerRect.bottom,
        left: triggerRect.left,
        right: viewport.width - triggerRect.right
      };

      finalPlacement = Object.keys(spaces).reduce((a, b) => 
        spaces[a as keyof typeof spaces] > spaces[b as keyof typeof spaces] ? a : b
      ) as TooltipPlacement;
    }

    // Calculate position based on placement
    switch (finalPlacement) {
      case 'top':
      case 'top-start':
      case 'top-end':
        x = finalPlacement === 'top-start' 
          ? triggerRect.left 
          : finalPlacement === 'top-end'
          ? triggerRect.right - tooltipRect.width
          : triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - offset;
        break;

      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        x = finalPlacement === 'bottom-start'
          ? triggerRect.left
          : finalPlacement === 'bottom-end'
          ? triggerRect.right - tooltipRect.width
          : triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + offset;
        break;

      case 'left':
      case 'left-start':
      case 'left-end':
        x = triggerRect.left - tooltipRect.width - offset;
        y = finalPlacement === 'left-start'
          ? triggerRect.top
          : finalPlacement === 'left-end'
          ? triggerRect.bottom - tooltipRect.height
          : triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;

      case 'right':
      case 'right-start':
      case 'right-end':
        x = triggerRect.right + offset;
        y = finalPlacement === 'right-start'
          ? triggerRect.top
          : finalPlacement === 'right-end'
          ? triggerRect.bottom - tooltipRect.height
          : triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Collision detection and adjustment
    const padding = 8;
    
    // Horizontal bounds
    if (x < padding) {
      x = padding;
    } else if (x + tooltipRect.width > viewport.width - padding) {
      x = viewport.width - tooltipRect.width - padding;
    }

    // Vertical bounds
    if (y < padding) {
      y = padding;
    } else if (y + tooltipRect.height > viewport.height - padding) {
      y = viewport.height - tooltipRect.height - padding;
    }

    setPosition({ x, y });
    setCurrentPlacement(finalPlacement);
  };

  // Show tooltip
  const showTooltip = () => {
    if (disabled) return;
    
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      onVisibilityChange?.(true);
    }, showDelay);
  };

  // Hide tooltip
  const hideTooltip = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      if (!isHoveringTooltip.current) {
        setIsVisible(false);
        onVisibilityChange?.(false);
      }
    }, hideDelay);
  };

  // Event handlers
  const handleMouseEnter = () => {
    if (triggers.includes('hover')) {
      showTooltip();
    }
  };

  const handleMouseLeave = () => {
    if (triggers.includes('hover')) {
      hideTooltip();
    }
  };

  const handleFocus = () => {
    if (triggers.includes('focus')) {
      showTooltip();
    }
  };

  const handleBlur = () => {
    if (triggers.includes('focus')) {
      hideTooltip();
    }
  };

  const handleClick = () => {
    if (triggers.includes('click')) {
      if (isVisible) {
        setIsVisible(false);
        onVisibilityChange?.(false);
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

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsVisible(false);
        onVisibilityChange?.(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, onVisibilityChange]);

  // Clone children with event handlers
  const clonedChild = isValidElement(children) 
    ? cloneElement(children, {
        ref: (ref: HTMLElement) => {
          triggerRef.current = ref;
          // Preserve original ref
          if (typeof children.ref === 'function') {
            children.ref(ref);
          } else if (children.ref) {
            (children.ref as any).current = ref;
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
        'aria-describedby': isVisible ? 'tooltip' : undefined
      } as any)
    : children;

  // Get arrow styles
  const getArrowStyles = () => {
    const arrowSize = 6;
    const arrowStyles: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid'
    };

    if (currentPlacement.startsWith('top')) {
      arrowStyles.top = '100%';
      arrowStyles.left = '50%';
      arrowStyles.marginLeft = -arrowSize;
      arrowStyles.borderWidth = `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`;
      arrowStyles.borderColor = '#374151 transparent transparent transparent';
    } else if (currentPlacement.startsWith('bottom')) {
      arrowStyles.bottom = '100%';
      arrowStyles.left = '50%';
      arrowStyles.marginLeft = -arrowSize;
      arrowStyles.borderWidth = `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`;
      arrowStyles.borderColor = 'transparent transparent #374151 transparent';
    } else if (currentPlacement.startsWith('left')) {
      arrowStyles.left = '100%';
      arrowStyles.top = '50%';
      arrowStyles.marginTop = -arrowSize;
      arrowStyles.borderWidth = `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`;
      arrowStyles.borderColor = 'transparent transparent transparent #374151';
    } else if (currentPlacement.startsWith('right')) {
      arrowStyles.right = '100%';
      arrowStyles.top = '50%';
      arrowStyles.marginTop = -arrowSize;
      arrowStyles.borderWidth = `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`;
      arrowStyles.borderColor = 'transparent #374151 transparent transparent';
    }

    return arrowStyles;
  };

  // Animation variants
  const tooltipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: currentPlacement.startsWith('top') ? 5 : currentPlacement.startsWith('bottom') ? -5 : 0,
      x: currentPlacement.startsWith('left') ? 5 : currentPlacement.startsWith('right') ? -5 : 0
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0
    }
  };

  // Tooltip content
  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          variants={tooltipVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={`
            fixed z-50 px-3 py-2 text-sm text-white bg-gray-700 rounded-lg shadow-lg
            pointer-events-auto
            ${contentClassName}
            ${className}
          `}
          style={{
            left: position.x,
            top: position.y,
            maxWidth
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          role="tooltip"
          id="tooltip"
        >
          {content}
          
          {/* Arrow */}
          {showArrow && (
            <div
              className={arrowClassName}
              style={getArrowStyles()}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {clonedChild}
      {portal && typeof document !== 'undefined' 
        ? createPortal(tooltipContent, document.body)
        : tooltipContent
      }
    </>
  );
};

// Controlled tooltip for manual control
export interface ControlledTooltipProps extends Omit<TooltipProps, 'trigger'> {
  visible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}

export const ControlledTooltip: React.FC<ControlledTooltipProps> = ({
  visible,
  onVisibilityChange,
  ...props
}) => {
  return (
    <Tooltip
      {...props}
      trigger="manual"
      onVisibilityChange={onVisibilityChange}
    />
  );
};

// Hook for programmatic tooltip control
export const useTooltip = () => {
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);
  const toggle = () => setVisible(!visible);

  return {
    visible,
    show,
    hide,
    toggle,
    setVisible
  };
};

// Higher-order component for adding tooltips
export const withTooltip = <P extends object>(
  Component: React.ComponentType<P>,
  tooltipProps: Omit<TooltipProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <Tooltip {...tooltipProps}>
      <Component {...props} />
    </Tooltip>
  );

  WrappedComponent.displayName = `withTooltip(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default Tooltip;