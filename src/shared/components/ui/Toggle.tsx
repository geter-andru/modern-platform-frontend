'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sun, Moon } from 'lucide-react';

/**
 * Toggle - Enterprise-grade toggle/switch component system
 * 
 * Features:
 * - Modern toggle switch design
 * - Multiple sizes and variants
 * - Controlled and uncontrolled modes
 * - Custom icons and labels
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Keyboard navigation
 * - Loading states
 * - Error states and validation
 * - Animation and transitions
 * - Theme switching variants
 * - Custom toggle styles
 */

export type ToggleSize = 'small' | 'medium' | 'large' | 'xlarge';
export type ToggleVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'theme';
export type LabelPosition = 'left' | 'right' | 'top' | 'bottom';

export interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event?: React.MouseEvent | React.KeyboardEvent) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  readOnly?: boolean;
  name?: string;
  id?: string;
  label?: React.ReactNode;
  description?: string;
  error?: string;
  size?: ToggleSize;
  variant?: ToggleVariant;
  labelPosition?: LabelPosition;
  className?: string;
  labelClassName?: string;
  toggleClassName?: string;
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
  checkedLabel?: React.ReactNode;
  uncheckedLabel?: React.ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  autoFocus?: boolean;
  tabIndex?: number;
}

const Toggle: React.FC<ToggleProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  loading = false,
  readOnly = false,
  name,
  id: providedId,
  label,
  description,
  error,
  size = 'medium',
  variant = 'default',
  labelPosition = 'right',
  className = '',
  labelClassName = '',
  toggleClassName = '',
  checkedIcon,
  uncheckedIcon,
  checkedLabel,
  uncheckedLabel,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  autoFocus = false,
  tabIndex,
  ...rest
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [isFocused, setIsFocused] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;
  
  // Generate unique ID if not provided
  const id = providedId || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  // Size configurations
  const sizeClasses = {
    small: {
      container: 'text-sm',
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      thumbTranslate: 'translate-x-4',
      icon: 'w-2 h-2',
      label: 'text-sm'
    },
    medium: {
      container: 'text-base',
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      thumbTranslate: 'translate-x-5',
      icon: 'w-3 h-3',
      label: 'text-base'
    },
    large: {
      container: 'text-lg',
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      thumbTranslate: 'translate-x-7',
      icon: 'w-4 h-4',
      label: 'text-lg'
    },
    xlarge: {
      container: 'text-xl',
      track: 'w-16 h-8',
      thumb: 'w-7 h-7',
      thumbTranslate: 'translate-x-8',
      icon: 'w-5 h-5',
      label: 'text-xl'
    }
  };

  // Variant configurations
  const variantClasses = {
    default: {
      trackUnchecked: 'bg-gray-700 border-gray-600',
      trackChecked: 'bg-blue-500 border-blue-500',
      thumb: 'bg-white',
      focus: 'focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500'
    },
    primary: {
      trackUnchecked: 'bg-gray-700 border-gray-600',
      trackChecked: 'bg-purple-500 border-purple-500',
      thumb: 'bg-white',
      focus: 'focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500'
    },
    secondary: {
      trackUnchecked: 'bg-gray-700 border-gray-600',
      trackChecked: 'bg-gray-500 border-gray-500',
      thumb: 'bg-white',
      focus: 'focus:ring-2 focus:ring-gray-500/30 focus:border-gray-500'
    },
    success: {
      trackUnchecked: 'bg-gray-700 border-gray-600',
      trackChecked: 'bg-green-500 border-green-500',
      thumb: 'bg-white',
      focus: 'focus:ring-2 focus:ring-green-500/30 focus:border-green-500'
    },
    warning: {
      trackUnchecked: 'bg-gray-700 border-gray-600',
      trackChecked: 'bg-orange-500 border-orange-500',
      thumb: 'bg-white',
      focus: 'focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500'
    },
    danger: {
      trackUnchecked: 'bg-gray-700 border-gray-600',
      trackChecked: 'bg-red-500 border-red-500',
      thumb: 'bg-white',
      focus: 'focus:ring-2 focus:ring-red-500/30 focus:border-red-500'
    },
    theme: {
      trackUnchecked: 'bg-gray-700 border-gray-600',
      trackChecked: 'bg-gradient-to-r from-purple-500 to-blue-500 border-transparent',
      thumb: 'bg-white',
      focus: 'focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500'
    }
  };

  // Handle change
  const handleChange = useCallback((event?: React.MouseEvent | React.KeyboardEvent) => {
    if (disabled || loading || readOnly) return;

    const newChecked = !checked;
    
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    
    onChange?.(newChecked, event);
  }, [disabled, loading, readOnly, checked, isControlled, onChange]);

  // Handle click
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    handleChange(event);
  }, [handleChange]);

  // Handle keyboard interaction
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleChange(event);
    }
  }, [handleChange]);

  // Handle focus
  const handleFocus = useCallback((event: React.FocusEvent<HTMLButtonElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  }, [onFocus]);

  // Handle blur
  const handleBlur = useCallback((event: React.FocusEvent<HTMLButtonElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  }, [onBlur]);

  // Layout configurations
  const layoutClasses = {
    left: 'flex-row-reverse',
    right: 'flex-row',
    top: 'flex-col-reverse',
    bottom: 'flex-col'
  };

  const spacingClasses = {
    left: 'space-x-3 space-x-reverse',
    right: 'space-x-3',
    top: 'space-y-2 space-y-reverse',
    bottom: 'space-y-2'
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  // Build toggle classes
  const trackClasses = `
    relative inline-flex items-center ${currentSize.track}
    border-2 rounded-full transition-all duration-200
    ${checked ? currentVariant.trackChecked : currentVariant.trackUnchecked}
    ${isFocused ? currentVariant.focus : ''}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}
    ${error ? 'ring-1 ring-red-500/30' : ''}
    ${toggleClassName}
  `.trim();

  // Build container classes
  const containerClasses = `
    inline-flex items-center
    ${layoutClasses[labelPosition]}
    ${spacingClasses[labelPosition]}
    ${currentSize.container}
    ${disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'}
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

  // Thumb animation variants
  const thumbVariants = {
    unchecked: { x: 0 },
    checked: { 
      x: parseInt(currentSize.thumbTranslate.replace(/\D/g, '')) * 4 // Convert translate-x-{n} to pixels
    }
  };

  // Default icons based on variant
  const getDefaultIcons = () => {
    if (variant === 'theme') {
      return {
        checked: checkedIcon || <Sun className={currentSize.icon} />,
        unchecked: uncheckedIcon || <Moon className={currentSize.icon} />
      };
    }
    return {
      checked: checkedIcon || <Check className={currentSize.icon} />,
      unchecked: uncheckedIcon || <X className={currentSize.icon} />
    };
  };

  const icons = getDefaultIcons();

  return (
    <div>
      {label && labelPosition === 'top' && (
        <div className="mb-2">
          <span className={labelClasses}>{label}</span>
        </div>
      )}

      <div className={labelPosition === 'top' || labelPosition === 'bottom' ? '' : containerClasses}>
        {/* Toggle Button */}
        <button
          {...rest}
          ref={buttonRef}
          type="button"
          role="switch"
          id={id}
          name={name}
          aria-checked={checked}
          aria-disabled={disabled}
          aria-readonly={readOnly}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled || loading}
          autoFocus={autoFocus}
          tabIndex={tabIndex}
          className={trackClasses}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy || (description ? `${id}-description` : undefined)}
          aria-labelledby={ariaLabelledBy}
          aria-invalid={!!error}
        >
          {/* Track background with state labels */}
          {(checkedLabel || uncheckedLabel) && (
            <div className="absolute inset-0 flex items-center justify-between px-1 text-xs font-medium text-white/70">
              {uncheckedLabel && !checked && (
                <span className="ml-1">{uncheckedLabel}</span>
              )}
              {checkedLabel && checked && (
                <span className="mr-1">{checkedLabel}</span>
              )}
            </div>
          )}

          {/* Thumb */}
          <motion.div
            className={`
              ${currentSize.thumb}
              bg-white rounded-full shadow-lg flex items-center justify-center
              transition-all duration-200
            `}
            variants={thumbVariants}
            animate={checked ? 'checked' : 'unchecked'}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {/* Loading spinner */}
            {loading ? (
              <motion.div
                className={`${currentSize.icon} border border-gray-400 border-t-transparent rounded-full`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              /* Icons */
              icons.checked && icons.unchecked && (
                <motion.div
                  key={checked ? 'checked' : 'unchecked'}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="text-gray-600"
                >
                  {checked ? icons.checked : icons.unchecked}
                </motion.div>
              )
            )}
          </motion.div>
        </button>

        {/* Label (for left/right positions) */}
        {label && (labelPosition === 'left' || labelPosition === 'right') && (
          <label htmlFor={id} className={labelClasses}>
            {label}
          </label>
        )}
      </div>

      {/* Label for bottom position */}
      {label && labelPosition === 'bottom' && (
        <div className="mt-2">
          <label htmlFor={id} className={labelClasses}>{label}</label>
        </div>
      )}

      {/* Description */}
      {description && (
        <p 
          id={`${id}-description`}
          className={`mt-1 text-sm ${error ? 'text-red-400' : 'text-gray-400'}`}
        >
          {description}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

// Toggle Group Component for multiple related toggles
export interface ToggleOption {
  value: string | number;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
  defaultChecked?: boolean;
}

export interface ToggleGroupProps {
  options: ToggleOption[];
  value?: (string | number)[];
  defaultValue?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  disabled?: boolean;
  size?: ToggleSize;
  variant?: ToggleVariant;
  labelPosition?: LabelPosition;
  className?: string;
  label?: string;
  description?: string;
  error?: string;
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: number;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  disabled = false,
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
  const [internalValue, setInternalValue] = useState<(string | number)[]>(
    defaultValue.length > 0 ? defaultValue : 
    options.filter(option => option.defaultChecked).map(option => option.value)
  );
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

  const layoutClasses = {
    horizontal: 'flex flex-wrap gap-6',
    vertical: 'space-y-4',
    grid: `grid grid-cols-${columns} gap-4`
  };

  return (
    <div className={className}>
      {label && (
        <fieldset className="space-y-3">
          <legend className="text-base font-medium text-gray-200">
            {label}
          </legend>
          
          {description && (
            <p className="text-sm text-gray-400">{description}</p>
          )}

          <div className={layoutClasses[layout]}>
            {options.map((option, index) => (
              <Toggle
                key={`${option.value}-${index}`}
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
        <div className={layoutClasses[layout]}>
          {options.map((option, index) => (
            <Toggle
              key={`${option.value}-${index}`}
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

// Hook for toggle state management
export const useToggle = (defaultValue: boolean = false) => {
  const [value, setValue] = useState<boolean>(defaultValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return {
    value,
    setValue,
    toggle,
    setTrue,
    setFalse,
    on: setTrue,
    off: setFalse
  };
};

// Hook for multiple toggle state management
export const useToggleGroup = (defaultValues: (string | number)[] = []) => {
  const [values, setValues] = useState<(string | number)[]>(defaultValues);

  const isToggled = useCallback((option: string | number) => {
    return values.includes(option);
  }, [values]);

  const toggle = useCallback((option: string | number) => {
    setValues(prev => 
      prev.includes(option)
        ? prev.filter(v => v !== option)
        : [...prev, option]
    );
  }, []);

  const toggleOn = useCallback((option: string | number) => {
    setValues(prev => 
      prev.includes(option) ? prev : [...prev, option]
    );
  }, []);

  const toggleOff = useCallback((option: string | number) => {
    setValues(prev => prev.filter(v => v !== option));
  }, []);

  const clear = useCallback(() => {
    setValues([]);
  }, []);

  const toggleAll = useCallback((options: (string | number)[]) => {
    setValues(options);
  }, []);

  return {
    values,
    setValues,
    isToggled,
    toggle,
    toggleOn,
    toggleOff,
    clear,
    toggleAll
  };
};

export default Toggle;