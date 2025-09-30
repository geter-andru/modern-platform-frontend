'use client';

import React, { useState, useRef, useCallback, createContext, useContext } from 'react';
import { motion } from 'framer-motion';

/**
 * Radio - Enterprise-grade radio button component system
 * 
 * Features:
 * - Single and grouped radio buttons
 * - Controlled and uncontrolled modes
 * - Custom styling and variants
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Keyboard navigation (arrow keys)
 * - Error states and validation
 * - Label positioning options
 * - Animation and transitions
 * - Context-based grouping
 * - Card-style options
 */

export type RadioSize = 'small' | 'medium' | 'large';
export type RadioVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type LabelPosition = 'right' | 'left' | 'top' | 'bottom';
export type RadioLayout = 'vertical' | 'horizontal' | 'grid';

export interface RadioProps {
  value: string | number;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: string | number, event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  label?: React.ReactNode;
  description?: string;
  error?: string;
  size?: RadioSize;
  variant?: RadioVariant;
  labelPosition?: LabelPosition;
  className?: string;
  labelClassName?: string;
  radioClassName?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  autoFocus?: boolean;
  tabIndex?: number;
}

// Radio Group Context
interface RadioGroupContextValue {
  name: string;
  value?: string | number;
  onChange?: (value: string | number, event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  size?: RadioSize;
  variant?: RadioVariant;
  labelPosition?: LabelPosition;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const Radio: React.FC<RadioProps> = ({
  value,
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  onFocus,
  onBlur,
  disabled: propDisabled = false,
  readOnly = false,
  required: propRequired = false,
  name: propName,
  id: providedId,
  label,
  description,
  error,
  size: propSize = 'medium',
  variant: propVariant = 'default',
  labelPosition: propLabelPosition = 'right',
  className = '',
  labelClassName = '',
  radioClassName = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  autoFocus = false,
  tabIndex,
  ...rest
}) => {
  const groupContext = useContext(RadioGroupContext);
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use group context values when available
  const name = propName || groupContext?.name || `radio-${Math.random().toString(36).substr(2, 9)}`;
  const disabled = propDisabled || groupContext?.disabled || false;
  const required = propRequired || groupContext?.required || false;
  const size = propSize || groupContext?.size || 'medium';
  const variant = propVariant || groupContext?.variant || 'default';
  const labelPosition = propLabelPosition || groupContext?.labelPosition || 'right';

  // Determine checked state
  const isControlledByGroup = groupContext && groupContext.value !== undefined;
  const isControlledLocal = controlledChecked !== undefined;
  const checked = isControlledByGroup 
    ? groupContext.value === value
    : isControlledLocal 
    ? controlledChecked 
    : internalChecked;

  // Generate unique ID if not provided
  const id = providedId || `radio-${name}-${value}`;

  // Size configurations
  const sizeClasses = {
    small: {
      container: 'text-sm',
      radio: 'w-4 h-4',
      dot: 'w-2 h-2',
      label: 'text-sm'
    },
    medium: {
      container: 'text-base',
      radio: 'w-5 h-5',
      dot: 'w-2.5 h-2.5',
      label: 'text-base'
    },
    large: {
      container: 'text-lg',
      radio: 'w-6 h-6',
      dot: 'w-3 h-3',
      label: 'text-lg'
    }
  };

  // Variant configurations
  const variantClasses = {
    default: {
      unchecked: 'border-gray-600 bg-gray-800',
      checked: 'border-blue-500 bg-gray-800',
      dot: 'bg-blue-500',
      hover: 'hover:border-gray-500',
      focus: 'focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500',
      disabled: 'opacity-50 cursor-not-allowed'
    },
    primary: {
      unchecked: 'border-gray-600 bg-gray-800',
      checked: 'border-purple-500 bg-gray-800',
      dot: 'bg-purple-500',
      hover: 'hover:border-gray-500',
      focus: 'focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500',
      disabled: 'opacity-50 cursor-not-allowed'
    },
    secondary: {
      unchecked: 'border-gray-600 bg-gray-800',
      checked: 'border-gray-400 bg-gray-800',
      dot: 'bg-gray-400',
      hover: 'hover:border-gray-500',
      focus: 'focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400',
      disabled: 'opacity-50 cursor-not-allowed'
    },
    success: {
      unchecked: 'border-gray-600 bg-gray-800',
      checked: 'border-green-500 bg-gray-800',
      dot: 'bg-green-500',
      hover: 'hover:border-gray-500',
      focus: 'focus:ring-2 focus:ring-green-500/30 focus:border-green-500',
      disabled: 'opacity-50 cursor-not-allowed'
    },
    warning: {
      unchecked: 'border-gray-600 bg-gray-800',
      checked: 'border-orange-500 bg-gray-800',
      dot: 'bg-orange-500',
      hover: 'hover:border-gray-500',
      focus: 'focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500',
      disabled: 'opacity-50 cursor-not-allowed'
    },
    danger: {
      unchecked: 'border-gray-600 bg-gray-800',
      checked: 'border-red-500 bg-gray-800',
      dot: 'bg-red-500',
      hover: 'hover:border-gray-500',
      focus: 'focus:ring-2 focus:ring-red-500/30 focus:border-red-500',
      disabled: 'opacity-50 cursor-not-allowed'
    }
  };

  // Handle change
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    if (!isControlledLocal && !isControlledByGroup) {
      setInternalChecked(true);
    }

    // Call group onChange if available
    if (groupContext?.onChange) {
      groupContext.onChange(value, event);
    }
    
    // Call local onChange
    onChange?.(value, event);
  }, [disabled, readOnly, isControlledLocal, isControlledByGroup, groupContext, value, onChange]);

  // Handle focus
  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  }, [onFocus]);

  // Handle blur
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  }, [onBlur]);

  // Layout configurations
  const layoutClasses = {
    right: 'flex-row',
    left: 'flex-row-reverse',
    top: 'flex-col-reverse',
    bottom: 'flex-col'
  };

  const spacingClasses = {
    right: 'space-x-3',
    left: 'space-x-3',
    top: 'space-y-2',
    bottom: 'space-y-2'
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  // Build radio classes
  const radioClasses = `
    ${currentSize.radio}
    rounded-full border-2 transition-all duration-200 relative
    ${checked ? currentVariant.checked : currentVariant.unchecked}
    ${!disabled && !readOnly ? currentVariant.hover : ''}
    ${isFocused ? currentVariant.focus : ''}
    ${disabled ? currentVariant.disabled : 'cursor-pointer'}
    ${error ? 'border-red-500 ring-1 ring-red-500/30' : ''}
    ${radioClassName}
  `.trim();

  // Build container classes
  const containerClasses = `
    inline-flex items-center
    ${layoutClasses[labelPosition]}
    ${spacingClasses[labelPosition]}
    ${currentSize.container}
    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();

  // Build label classes
  const labelClasses = `
    select-none
    ${currentSize.label}
    ${disabled ? 'text-gray-500' : 'text-gray-200'}
    ${error ? 'text-red-400' : ''}
    ${labelClassName}
  `.trim();

  // Dot animation variants
  const dotVariants = {
    unchecked: { scale: 0, opacity: 0 },
    checked: { scale: 1, opacity: 1 }
  };

  return (
    <div>
      <label
        className={containerClasses}
        htmlFor={id}
      >
        {/* Hidden native radio */}
        <input
          {...rest}
          ref={inputRef}
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoFocus={autoFocus}
          tabIndex={tabIndex}
          className="sr-only"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy || (description ? `${id}-description` : undefined)}
          aria-labelledby={ariaLabelledBy}
          aria-invalid={!!error}
        />

        {/* Custom radio */}
        <div className={radioClasses}>
          <motion.div
            className={`absolute inset-0 flex items-center justify-center`}
            variants={dotVariants}
            animate={checked ? 'checked' : 'unchecked'}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
          >
            <div className={`${currentSize.dot} rounded-full ${currentVariant.dot}`} />
          </motion.div>
        </div>

        {/* Label */}
        {label && (
          <span className={labelClasses}>
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </span>
        )}
      </label>

      {/* Description */}
      {description && (
        <p 
          id={`${id}-description`}
          className={`mt-1 text-sm ${error ? 'text-red-400' : 'text-gray-400'} ${
            labelPosition === 'right' || labelPosition === 'left' ? 'ml-8' : ''
          }`}
        >
          {description}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p 
          className={`mt-1 text-sm text-red-400 ${
            labelPosition === 'right' || labelPosition === 'left' ? 'ml-8' : ''
          }`}
        >
          {error}
        </p>
      )}
    </div>
  );
};

// Radio Group Component
export interface RadioOption {
  value: string | number;
  label: React.ReactNode;
  disabled?: boolean;
  description?: string;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  name: string;
  disabled?: boolean;
  required?: boolean;
  size?: RadioSize;
  variant?: RadioVariant;
  labelPosition?: LabelPosition;
  className?: string;
  label?: string;
  description?: string;
  error?: string;
  layout?: RadioLayout;
  columns?: number;
  gap?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  name,
  disabled = false,
  required = false,
  size = 'medium',
  variant = 'default',
  labelPosition = 'right',
  className = '',
  label,
  description,
  error,
  layout = 'vertical',
  columns = 1,
  gap = '3'
}) => {
  const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback((value: string | number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(value);
    }
    onChange?.(value);
  }, [isControlled, onChange]);

  // Handle keyboard navigation (arrow keys)
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;

    event.preventDefault();

    const currentIndex = options.findIndex(option => option.value === currentValue);
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        break;
    }

    // Find next non-disabled option
    while (options[nextIndex]?.disabled && nextIndex !== currentIndex) {
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        nextIndex = nextIndex > 0 ? nextIndex - 1 : options.length - 1;
      } else {
        nextIndex = nextIndex < options.length - 1 ? nextIndex + 1 : 0;
      }
    }

    if (!options[nextIndex]?.disabled) {
      const syntheticEvent = {
        target: { checked: true },
        currentTarget: { checked: true }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(options[nextIndex].value, syntheticEvent);

      // Focus the next radio button
      const nextRadio = document.getElementById(`radio-${name}-${options[nextIndex].value}`);
      nextRadio?.focus();
    }
  }, [options, currentValue, handleChange, name]);

  // Layout classes
  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-wrap gap-6';
      case 'grid':
        return `grid grid-cols-${columns} gap-${gap}`;
      default:
        return `space-y-${gap}`;
    }
  };

  const contextValue: RadioGroupContextValue = {
    name,
    value: currentValue,
    onChange: handleChange,
    disabled,
    required,
    size,
    variant,
    labelPosition
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div className={className}>
        {label && (
          <fieldset className="space-y-3">
            <legend className="text-base font-medium text-gray-200">
              {label}
              {required && <span className="text-red-400 ml-1">*</span>}
            </legend>
            
            {description && (
              <p className="text-sm text-gray-400">{description}</p>
            )}

            <div 
              className={getLayoutClasses()}
              onKeyDown={handleKeyDown}
              role="radiogroup"
              aria-labelledby={label ? `${name}-label` : undefined}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
            >
              {options.map((option, index) => (
                <Radio
                  key={`${option.value}-${index}`}
                  value={option.value}
                  disabled={option.disabled}
                  label={option.label}
                  description={option.description}
                  tabIndex={option.value === currentValue ? 0 : -1}
                />
              ))}
            </div>

            {error && (
              <p id={`${name}-error`} className="text-sm text-red-400">{error}</p>
            )}
          </fieldset>
        )}

        {!label && (
          <div 
            className={getLayoutClasses()}
            onKeyDown={handleKeyDown}
            role="radiogroup"
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          >
            {options.map((option, index) => (
              <Radio
                key={`${option.value}-${index}`}
                value={option.value}
                disabled={option.disabled}
                label={option.label}
                description={option.description}
                error={error && index === 0 ? error : undefined}
                tabIndex={option.value === currentValue ? 0 : -1}
              />
            ))}
          </div>
        )}
      </div>
    </RadioGroupContext.Provider>
  );
};

// Card-style Radio Option Component
export interface RadioCardProps extends Omit<RadioProps, 'labelPosition'> {
  title?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  selected?: boolean;
}

export const RadioCard: React.FC<RadioCardProps> = ({
  title,
  icon,
  badge,
  selected,
  disabled,
  className = '',
  children,
  ...radioProps
}) => {
  const cardClasses = `
    relative p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer
    ${selected 
      ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20' 
      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  return (
    <div className={cardClasses}>
      {badge && (
        <div className="absolute top-3 right-3">
          {badge}
        </div>
      )}

      <Radio
        {...radioProps}
        disabled={disabled}
        className="absolute top-3 left-3"
        radioClassName="w-4 h-4"
      />

      <div className="ml-8">
        <div className="flex items-center space-x-3 mb-2">
          {icon && (
            <div className="flex-shrink-0 text-gray-400">
              {icon}
            </div>
          )}
          {title && (
            <h3 className="text-sm font-medium text-gray-200">{title}</h3>
          )}
        </div>
        
        {children && (
          <div className="text-sm text-gray-400">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

// Hook for radio group state management
export const useRadioGroup = (defaultValue?: string | number) => {
  const [value, setValue] = useState<string | number | undefined>(defaultValue);

  const isSelected = useCallback((option: string | number) => {
    return value === option;
  }, [value]);

  const select = useCallback((option: string | number) => {
    setValue(option);
  }, []);

  const clear = useCallback(() => {
    setValue(undefined);
  }, []);

  return {
    value,
    setValue,
    isSelected,
    select,
    clear
  };
};

export default Radio;