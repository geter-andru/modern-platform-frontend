'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';

/**
 * Checkbox - Enterprise-grade checkbox component system
 * 
 * Features:
 * - Single and multi-checkbox support
 * - Controlled and uncontrolled modes
 * - Indeterminate state support
 * - Custom styling and variants
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Keyboard navigation
 * - Error states and validation
 * - Label positioning options
 * - Animation and transitions
 * - Group management
 */

export type CheckboxSize = 'small' | 'medium' | 'large';
export type CheckboxVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type LabelPosition = 'right' | 'left' | 'top' | 'bottom';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  value?: string | number;
  id?: string;
  label?: React.ReactNode;
  description?: string;
  error?: string;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  labelPosition?: LabelPosition;
  className?: string;
  labelClassName?: string;
  checkboxClassName?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  autoFocus?: boolean;
  tabIndex?: number;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  indeterminate = false,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  value,
  id: providedId,
  label,
  description,
  error,
  size = 'medium',
  variant = 'default',
  labelPosition = 'right',
  className = '',
  labelClassName = '',
  checkboxClassName = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  autoFocus = false,
  tabIndex,
  ...rest
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;
  
  // Generate unique ID if not provided
  const id = providedId || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  // Size configurations
  const sizeClasses = {
    small: {
      container: 'text-sm',
      checkbox: 'w-4 h-4',
      icon: 'w-2.5 h-2.5',
      label: 'text-sm'
    },
    medium: {
      container: 'text-base',
      checkbox: 'w-5 h-5',
      icon: 'w-3 h-3',
      label: 'text-base'
    },
    large: {
      container: 'text-lg',
      checkbox: 'w-6 h-6',
      icon: 'w-4 h-4',
      label: 'text-lg'
    }
  };

  // Variant configurations
  const variantClasses = {
    default: {
      unchecked: 'border-gray-600 bg-gray-800',
      checked: 'border-blue-500 bg-blue-500',
      hover: 'hover:border-gray-500',
      focus: 'focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500',
      disabled: 'opacity-50 cursor-not-allowed'
    },
    primary: {
      unchecked: 'border-gray-600 bg-gray-800',
      checked: 'border-purple-500 bg-purple-500',
      hover: 'hover:border-gray-500',
      focus: 'focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500',
      disabled: 'opacity-50 cursor-not-allowed'
    },
    secondary: {
      unchecked: 'border-gray-600 bg-gray-800',
      checked: 'border-gray-400 bg-gray-400',
      hover: 'hover:border-gray-500',
      focus: 'focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400',
      disabled: 'opacity-50 cursor-not-allowed'
    },
    success: {
      unchecked: 'border-gray-600 bg-gray-800',
      checked: 'border-green-500 bg-green-500',
      hover: 'hover:border-gray-500',
      focus: 'focus:ring-2 focus:ring-green-500/30 focus:border-green-500',
      disabled: 'opacity-50 cursor-not-allowed'
    },
    warning: {
      unchecked: 'border-gray-600 bg-gray-800',
      checked: 'border-orange-500 bg-orange-500',
      hover: 'hover:border-gray-500',
      focus: 'focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500',
      disabled: 'opacity-50 cursor-not-allowed'
    },
    danger: {
      unchecked: 'border-gray-600 bg-gray-800',
      checked: 'border-red-500 bg-red-500',
      hover: 'hover:border-gray-500',
      focus: 'focus:ring-2 focus:ring-red-500/30 focus:border-red-500',
      disabled: 'opacity-50 cursor-not-allowed'
    }
  };

  // Handle change
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    const newChecked = event.target.checked;
    
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    
    onChange?.(newChecked, event);
  }, [disabled, readOnly, isControlled, onChange]);

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

  // Handle keyboard interaction
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      event.preventDefault();
      if (inputRef.current && !disabled && !readOnly) {
        inputRef.current.click();
      }
    }
  }, [disabled, readOnly]);

  // Update indeterminate state
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

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

  // Build checkbox classes
  const checkboxClasses = `
    ${currentSize.checkbox}
    rounded border-2 transition-all duration-200
    ${checked || indeterminate ? currentVariant.checked : currentVariant.unchecked}
    ${!disabled && !readOnly ? currentVariant.hover : ''}
    ${isFocused ? currentVariant.focus : ''}
    ${disabled ? currentVariant.disabled : 'cursor-pointer'}
    ${error ? 'border-red-500 ring-1 ring-red-500/30' : ''}
    ${checkboxClassName}
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

  // Icon animations
  const iconVariants = {
    unchecked: { scale: 0, opacity: 0 },
    checked: { scale: 1, opacity: 1 },
    indeterminate: { scale: 1, opacity: 1 }
  };

  return (
    <div>
      <label
        className={containerClasses}
        htmlFor={id}
      >
        {/* Hidden native checkbox */}
        <input
          {...rest}
          ref={inputRef}
          type="checkbox"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
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

        {/* Custom checkbox */}
        <div className={checkboxClasses}>
          <motion.div
            className="flex items-center justify-center w-full h-full"
            variants={iconVariants}
            animate={
              indeterminate ? 'indeterminate' : 
              checked ? 'checked' : 'unchecked'
            }
            transition={{ duration: 0.15, ease: 'easeInOut' }}
          >
            {indeterminate ? (
              <Minus className={`${currentSize.icon} text-white`} />
            ) : (
              <Check className={`${currentSize.icon} text-white`} />
            )}
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

// Checkbox Group Component
export interface CheckboxOption {
  value: string | number;
  label: React.ReactNode;
  disabled?: boolean;
  description?: string;
}

export interface CheckboxGroupProps {
  options: CheckboxOption[];
  value?: (string | number)[];
  defaultValue?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  labelPosition?: LabelPosition;
  className?: string;
  label?: string;
  description?: string;
  error?: string;
  layout?: 'vertical' | 'horizontal';
  columns?: number;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  value: controlledValue,
  defaultValue = [],
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
  columns = 1
}) => {
  const [internalValue, setInternalValue] = useState<(string | number)[]>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleOptionChange = useCallback((optionValue: string | number, checked: boolean) => {
    const newValue = checked
      ? [...currentValue, optionValue]
      : currentValue.filter(v => v !== optionValue);

    if (!isControlled) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
  }, [currentValue, isControlled, onChange]);

  const gridClasses = columns > 1 ? `grid grid-cols-${columns} gap-4` : '';
  const layoutClasses = layout === 'horizontal' ? 'flex flex-wrap gap-6' : 'space-y-3';

  return (
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

          <div className={`${gridClasses || layoutClasses}`}>
            {options.map((option, index) => (
              <Checkbox
                key={`${option.value}-${index}`}
                name={name}
                value={option.value}
                checked={currentValue.includes(option.value)}
                onChange={(checked) => handleOptionChange(option.value, checked)}
                disabled={disabled || option.disabled}
                size={size}
                variant={variant}
                labelPosition={labelPosition}
                label={option.label}
                description={option.description}
                error={error && index === 0 ? error : undefined}
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
        </fieldset>
      )}

      {!label && (
        <div className={`${gridClasses || layoutClasses}`}>
          {options.map((option, index) => (
            <Checkbox
              key={`${option.value}-${index}`}
              name={name}
              value={option.value}
              checked={currentValue.includes(option.value)}
              onChange={(checked) => handleOptionChange(option.value, checked)}
              disabled={disabled || option.disabled}
              size={size}
              variant={variant}
              labelPosition={labelPosition}
              label={option.label}
              description={option.description}
              error={error && index === 0 ? error : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Hook for checkbox group state management
export const useCheckboxGroup = (defaultValue: (string | number)[] = []) => {
  const [value, setValue] = useState<(string | number)[]>(defaultValue);

  const isChecked = useCallback((option: string | number) => {
    return value.includes(option);
  }, [value]);

  const toggle = useCallback((option: string | number) => {
    setValue(prev => 
      prev.includes(option)
        ? prev.filter(v => v !== option)
        : [...prev, option]
    );
  }, []);

  const check = useCallback((option: string | number) => {
    setValue(prev => 
      prev.includes(option) ? prev : [...prev, option]
    );
  }, []);

  const uncheck = useCallback((option: string | number) => {
    setValue(prev => prev.filter(v => v !== option));
  }, []);

  const clear = useCallback(() => {
    setValue([]);
  }, []);

  const checkAll = useCallback((options: (string | number)[]) => {
    setValue(options);
  }, []);

  return {
    value,
    setValue,
    isChecked,
    toggle,
    check,
    uncheck,
    clear,
    checkAll
  };
};

// Higher-order component for adding checkbox functionality
export const withCheckbox = <P extends object>(
  Component: React.ComponentType<P>,
  checkboxProps?: Partial<CheckboxProps>
) => {
  const WrappedComponent = (props: P) => (
    <Checkbox {...checkboxProps}>
      <Component {...props} />
    </Checkbox>
  );

  WrappedComponent.displayName = `withCheckbox(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default Checkbox;