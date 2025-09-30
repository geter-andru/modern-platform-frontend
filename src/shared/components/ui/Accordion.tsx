'use client';

import React, { useState, useRef, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react';

/**
 * Accordion - Enterprise-grade accordion/collapsible component system
 * 
 * Features:
 * - Single and multiple expansion modes
 * - Controlled and uncontrolled modes
 * - Custom trigger icons and styling
 * - Smooth animations and transitions
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Keyboard navigation
 * - Nested accordion support
 * - Context-based state management
 * - Multiple variants and sizes
 * - Custom content rendering
 */

export type AccordionSize = 'small' | 'medium' | 'large';
export type AccordionVariant = 'default' | 'bordered' | 'filled' | 'minimal';
export type IconPosition = 'left' | 'right';
export type IconType = 'chevron' | 'plus' | 'arrow' | 'custom';

export interface AccordionItemData {
  id: string | number;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export interface AccordionProps {
  items?: AccordionItemData[];
  value?: string | number | (string | number)[];
  defaultValue?: string | number | (string | number)[];
  onValueChange?: (value: string | number | (string | number)[]) => void;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  disabled?: boolean;
  size?: AccordionSize;
  variant?: AccordionVariant;
  iconPosition?: IconPosition;
  iconType?: IconType;
  customIcon?: {
    collapsed: React.ReactNode;
    expanded: React.ReactNode;
  };
  className?: string;
  itemClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  children?: React.ReactNode;
}

// Accordion Context
interface AccordionContextValue {
  value?: string | number | (string | number)[];
  onValueChange?: (value: string | number | (string | number)[]) => void;
  type: 'single' | 'multiple';
  collapsible: boolean;
  disabled: boolean;
  size: AccordionSize;
  variant: AccordionVariant;
  iconPosition: IconPosition;
  iconType: IconType;
  customIcon?: {
    collapsed: React.ReactNode;
    expanded: React.ReactNode;
  };
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

// Individual Accordion Item Component
export interface AccordionItemProps {
  value: string | number;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  value,
  disabled: itemDisabled = false,
  className = '',
  children
}) => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('AccordionItem must be used within an Accordion');
  }

  const { 
    value: contextValue, 
    onValueChange, 
    type, 
    collapsible, 
    disabled: contextDisabled,
    variant,
    size 
  } = context;

  const disabled = itemDisabled || contextDisabled;

  // Determine if this item is expanded
  const isExpanded = Array.isArray(contextValue) 
    ? contextValue.includes(value)
    : contextValue === value;

  // Handle toggle
  const handleToggle = useCallback(() => {
    if (disabled) return;

    if (type === 'single') {
      // Single mode: only one item can be expanded
      const newValue = isExpanded && collapsible ? undefined : value;
      onValueChange?.(newValue);
    } else {
      // Multiple mode: multiple items can be expanded
      if (!Array.isArray(contextValue)) {
        onValueChange?.([value]);
      } else {
        const newValue = isExpanded
          ? contextValue.filter(v => v !== value)
          : [...contextValue, value];
        onValueChange?.(newValue);
      }
    }
  }, [disabled, type, isExpanded, collapsible, value, contextValue, onValueChange]);

  // Size configurations
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  // Variant configurations
  const variantClasses = {
    default: 'border-b border-gray-700 last:border-b-0',
    bordered: 'border border-gray-700 rounded-lg mb-2 last:mb-0',
    filled: 'bg-gray-800 border border-gray-700 rounded-lg mb-2 last:mb-0',
    minimal: 'border-b border-gray-800 last:border-b-0'
  };

  const itemClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim();

  return (
    <div className={itemClasses} data-state={isExpanded ? 'open' : 'closed'}>
      <AccordionContextProvider value={{ ...context, handleToggle, isExpanded, itemValue: value, disabled }}>
        {children}
      </AccordionContextProvider>
    </div>
  );
};

// Accordion Trigger Component
export interface AccordionTriggerProps {
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  className = '',
  children,
  asChild = false
}) => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('AccordionTrigger must be used within an AccordionItem');
  }

  const { 
    handleToggle, 
    isExpanded, 
    disabled, 
    size, 
    variant,
    iconPosition,
    iconType,
    customIcon 
  } = context as AccordionContextValue & {
    handleToggle: () => void;
    isExpanded: boolean;
    itemValue: string | number;
  };

  // Size configurations
  const sizeClasses = {
    small: 'py-3 px-4 text-sm',
    medium: 'py-4 px-5 text-base',
    large: 'py-5 px-6 text-lg'
  };

  // Icon configurations
  const getIcon = () => {
    if (customIcon) {
      return isExpanded ? customIcon.expanded : customIcon.collapsed;
    }

    const iconProps = {
      className: `w-4 h-4 transition-transform duration-200 ${
        isExpanded ? 'rotate-180' : ''
      }`
    };

    switch (iconType) {
      case 'plus':
        return isExpanded ? <Minus {...iconProps} /> : <Plus {...iconProps} />;
      case 'arrow':
        return <ChevronRight {...{ ...iconProps, className: iconProps.className.replace('rotate-180', isExpanded ? 'rotate-90' : '') }} />;
      case 'custom':
        return null;
      default:
        return <ChevronDown {...iconProps} />;
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  }, [handleToggle]);

  const triggerClasses = `
    flex items-center justify-between w-full
    ${sizeClasses[size]}
    ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-800/50'}
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500/30
    ${variant === 'minimal' ? 'px-0' : ''}
    ${className}
  `.trim();

  const Component = asChild ? 'div' : 'button';

  return (
    <Component
      className={triggerClasses}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-expanded={isExpanded}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      role={asChild ? undefined : 'button'}
    >
      <div className={`flex items-center ${iconPosition === 'right' ? 'flex-row-reverse justify-between' : 'space-x-3'}`}>
        {iconPosition === 'left' && getIcon()}
        <div className="flex-1 text-left">
          {children}
        </div>
        {iconPosition === 'right' && getIcon()}
      </div>
    </Component>
  );
};

// Accordion Content Component
export interface AccordionContentProps {
  className?: string;
  children?: React.ReactNode;
  forceMount?: boolean;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  className = '',
  children,
  forceMount = false
}) => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('AccordionContent must be used within an AccordionItem');
  }

  const { isExpanded, size, variant } = context as AccordionContextValue & {
    isExpanded: boolean;
  };

  const contentRef = useRef<HTMLDivElement>(null);

  // Size configurations
  const sizeClasses = {
    small: 'px-4 pb-3 text-sm',
    medium: 'px-5 pb-4 text-base',
    large: 'px-6 pb-5 text-lg'
  };

  const contentClasses = `
    overflow-hidden
    ${sizeClasses[size]}
    ${variant === 'minimal' ? 'px-0' : ''}
    ${className}
  `.trim();

  // Animation variants
  const contentVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      paddingTop: 0,
      paddingBottom: 0
    },
    expanded: {
      height: 'auto',
      opacity: 1,
      paddingTop: undefined,
      paddingBottom: undefined
    }
  };

  if (!forceMount && !isExpanded) {
    return null;
  }

  return (
    <AnimatePresence initial={false}>
      {(isExpanded || forceMount) && (
        <motion.div
          ref={contentRef}
          className={contentClasses}
          variants={contentVariants}
          initial="collapsed"
          animate={isExpanded ? 'expanded' : 'collapsed'}
          exit="collapsed"
          transition={{
            duration: 0.3,
            ease: [0.04, 0.62, 0.23, 0.98]
          }}
          aria-hidden={!isExpanded}
        >
          <div className="text-gray-300">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Extended Context Provider for additional item-specific props
const AccordionContextProvider: React.FC<{
  value: AccordionContextValue & any;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <AccordionContext.Provider value={value}>
      {children}
    </AccordionContext.Provider>
  );
};

// Main Accordion Component
const Accordion: React.FC<AccordionProps> = ({
  items,
  value: controlledValue,
  defaultValue,
  onValueChange,
  type = 'single',
  collapsible = true,
  disabled = false,
  size = 'medium',
  variant = 'default',
  iconPosition = 'right',
  iconType = 'chevron',
  customIcon,
  className = '',
  itemClassName = '',
  headerClassName = '',
  contentClassName = '',
  children
}) => {
  const [internalValue, setInternalValue] = useState<string | number | (string | number)[] | undefined>(
    defaultValue
  );

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleValueChange = useCallback((newValue: string | number | (string | number)[] | undefined) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  }, [isControlled, onValueChange]);

  const contextValue: AccordionContextValue = {
    value: currentValue,
    onValueChange: handleValueChange,
    type,
    collapsible,
    disabled,
    size,
    variant,
    iconPosition,
    iconType,
    customIcon
  };

  const accordionClasses = `
    space-y-0
    ${className}
  `.trim();

  // If items are provided, render them directly
  if (items) {
    return (
      <AccordionContext.Provider value={contextValue}>
        <div className={accordionClasses}>
          {items.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              disabled={item.disabled}
              className={itemClassName}
            >
              <AccordionTrigger className={headerClassName}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    {item.icon && (
                      <div className="flex-shrink-0 text-gray-400">
                        {item.icon}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-200">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-sm text-gray-400 mt-1">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  {item.badge && (
                    <div className="flex-shrink-0 ml-3">
                      {item.badge}
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className={contentClassName}>
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </div>
      </AccordionContext.Provider>
    );
  }

  // Otherwise, use children pattern
  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={accordionClasses}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

// Hook for accordion state management
export const useAccordion = (type: 'single' | 'multiple' = 'single', defaultValue?: string | number | (string | number)[]) => {
  const [value, setValue] = useState<string | number | (string | number)[] | undefined>(defaultValue);

  const isExpanded = useCallback((item: string | number) => {
    if (Array.isArray(value)) {
      return value.includes(item);
    }
    return value === item;
  }, [value]);

  const expand = useCallback((item: string | number) => {
    if (type === 'single') {
      setValue(item);
    } else {
      setValue(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.includes(item) ? prevArray : [...prevArray, item];
      });
    }
  }, [type]);

  const collapse = useCallback((item: string | number) => {
    if (type === 'single') {
      setValue(undefined);
    } else {
      setValue(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.filter(v => v !== item);
      });
    }
  }, [type]);

  const toggle = useCallback((item: string | number) => {
    if (isExpanded(item)) {
      collapse(item);
    } else {
      expand(item);
    }
  }, [isExpanded, expand, collapse]);

  const expandAll = useCallback((items: (string | number)[]) => {
    if (type === 'multiple') {
      setValue(items);
    }
  }, [type]);

  const collapseAll = useCallback(() => {
    setValue(type === 'single' ? undefined : []);
  }, [type]);

  return {
    value,
    setValue,
    isExpanded,
    expand,
    collapse,
    toggle,
    expandAll,
    collapseAll
  };
};

// Nested Accordion Component for complex hierarchical data
export interface NestedAccordionProps extends AccordionProps {
  data: {
    id: string | number;
    title: React.ReactNode;
    content?: React.ReactNode;
    children?: NestedAccordionProps['data'];
    [key: string]: any;
  }[];
  level?: number;
  maxLevel?: number;
}

export const NestedAccordion: React.FC<NestedAccordionProps> = ({
  data,
  level = 0,
  maxLevel = 3,
  ...accordionProps
}) => {
  if (level >= maxLevel) return null;

  const items: AccordionItemData[] = data.map(item => ({
    id: item.id,
    title: item.title,
    content: (
      <div>
        {item.content}
        {item.children && item.children.length > 0 && (
          <div className="mt-4 pl-4 border-l-2 border-gray-700">
            <NestedAccordion
              {...accordionProps}
              data={item.children}
              level={level + 1}
              maxLevel={maxLevel}
            />
          </div>
        )}
      </div>
    ),
    disabled: item.disabled,
    icon: item.icon,
    badge: item.badge,
    subtitle: item.subtitle
  }));

  return <Accordion {...accordionProps} items={items} />;
};

export default Accordion;
export { AccordionItem, AccordionTrigger, AccordionContent };