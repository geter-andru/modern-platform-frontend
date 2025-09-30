'use client';

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, X, Search, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Input - Advanced input component system
 * 
 * Features:
 * - Multiple input types (text, password, email, search, etc.)
 * - Different sizes (sm, md, lg)
 * - Icon support (left and right)
 * - Validation states (error, success, warning)
 * - Helper text and error messages
 * - Clearable inputs
 * - Password visibility toggle
 * - Floating labels
 * - Character counter
 * - Auto-resize for textarea
 * - Debounced input
 */

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'filled' | 'underlined' | 'borderless';
export type InputState = 'default' | 'error' | 'success' | 'warning';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  variant?: InputVariant;
  state?: InputState;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
  floatingLabel?: boolean;
  debounceMs?: number;
  onDebouncedChange?: (value: string) => void;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  size = 'md',
  variant = 'default',
  state = 'default',
  label,
  helperText,
  errorMessage,
  leftIcon,
  rightIcon,
  clearable = false,
  showCharCount = false,
  maxLength,
  floatingLabel = false,
  debounceMs,
  onDebouncedChange,
  containerClassName = '',
  className = '',
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  disabled,
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const isEmpty = !currentValue || currentValue.toString().length === 0;

  // Handle debounced change
  useEffect(() => {
    if (!debounceMs || !onDebouncedChange) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onDebouncedChange(currentValue?.toString() || '');
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [currentValue, debounceMs, onDebouncedChange]);

  // Handle input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    onChange?.(event);
  };

  // Handle clear
  const handleClear = () => {
    const event = {
      target: { value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    
    if (!isControlled) {
      setInternalValue('');
    }
    
    onChange?.(event);
  };

  // Handle focus
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  // Handle blur
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          input: 'px-3 py-1.5 text-sm',
          icon: 'w-4 h-4',
          iconContainer: 'px-2'
        };
      case 'lg':
        return {
          input: 'px-4 py-3 text-base',
          icon: 'w-6 h-6',
          iconContainer: 'px-3'
        };
      default:
        return {
          input: 'px-3 py-2 text-sm',
          icon: 'w-5 h-5',
          iconContainer: 'px-3'
        };
    }
  };

  // Get variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'filled':
        return 'bg-gray-800 border border-transparent hover:border-gray-600 focus-within:border-blue-500';
      case 'underlined':
        return 'bg-transparent border-0 border-b-2 border-gray-700 rounded-none hover:border-gray-600 focus-within:border-blue-500';
      case 'borderless':
        return 'bg-transparent border-0 hover:bg-gray-800/50 focus-within:bg-gray-800/50';
      default:
        return 'bg-gray-800 border border-gray-700 hover:border-gray-600 focus-within:border-blue-500';
    }
  };

  // Get state classes
  const getStateClasses = () => {
    switch (state) {
      case 'error':
        return {
          container: 'focus-within:border-red-500 border-red-500',
          text: 'text-red-400',
          icon: <AlertCircle className={sizeClasses.icon} />
        };
      case 'success':
        return {
          container: 'focus-within:border-green-500 border-green-500',
          text: 'text-green-400',
          icon: <CheckCircle className={sizeClasses.icon} />
        };
      case 'warning':
        return {
          container: 'focus-within:border-yellow-500 border-yellow-500',
          text: 'text-yellow-400',
          icon: <AlertCircle className={sizeClasses.icon} />
        };
      default:
        return {
          container: '',
          text: 'text-gray-400',
          icon: null
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();
  const stateClasses = getStateClasses();

  const hasLeftIcon = leftIcon || (type === 'search');
  const hasRightIcon = rightIcon || clearable || (type === 'password') || stateClasses.icon;

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const shouldShowLabel = label && (!floatingLabel || !isEmpty || isFocused);
  const shouldShowFloatingLabel = floatingLabel && label;

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {/* Static Label */}
      {shouldShowLabel && !floatingLabel && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className={`
        relative rounded-lg transition-all duration-200
        ${variantClasses}
        ${stateClasses.container}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        {/* Floating Label */}
        {shouldShowFloatingLabel && (
          <motion.label
            initial={false}
            animate={{
              scale: !isEmpty || isFocused ? 0.85 : 1,
              y: !isEmpty || isFocused ? -10 : 0,
              x: !isEmpty || isFocused ? -2 : 0
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`
              absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none
              origin-left z-10 bg-gray-800 px-1
              ${!isEmpty || isFocused ? 'text-blue-400' : ''}
            `}
          >
            {label}
          </motion.label>
        )}

        {/* Left Icon */}
        {hasLeftIcon && (
          <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 ${sizeClasses.iconContainer} flex items-center`}>
            {type === 'search' ? (
              <Search className={`${sizeClasses.icon} text-gray-400`} />
            ) : (
              leftIcon
            )}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={inputType}
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={floatingLabel ? '' : placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`
            w-full bg-transparent text-white placeholder-gray-400 transition-all duration-200
            focus:outline-none
            ${sizeClasses.input}
            ${hasLeftIcon ? 'pl-10' : ''}
            ${hasRightIcon ? 'pr-10' : ''}
            ${disabled ? 'cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Right Icons */}
        {hasRightIcon && (
          <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 ${sizeClasses.iconContainer} flex items-center gap-1`}>
            {/* State Icon */}
            {stateClasses.icon && (
              <span className={stateClasses.text}>
                {stateClasses.icon}
              </span>
            )}

            {/* Clear Button */}
            {clearable && currentValue && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                <X className={sizeClasses.icon} />
              </button>
            )}

            {/* Password Toggle */}
            {type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className={sizeClasses.icon} />
                ) : (
                  <Eye className={sizeClasses.icon} />
                )}
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && (
              <span className="text-gray-400">
                {rightIcon}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Helper Text / Error Message */}
      <AnimatePresence>
        {(helperText || errorMessage) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <p className={`text-xs ${errorMessage ? 'text-red-400' : stateClasses.text}`}>
                {errorMessage || helperText}
              </p>
              
              {/* Character Count */}
              {showCharCount && maxLength && (
                <p className="text-xs text-gray-500">
                  {currentValue?.toString().length || 0}/{maxLength}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';

// Textarea Component
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  size?: InputSize;
  variant?: InputVariant;
  state?: InputState;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  showCharCount?: boolean;
  maxLength?: number;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  size = 'md',
  variant = 'default',
  state = 'default',
  label,
  helperText,
  errorMessage,
  showCharCount = false,
  maxLength,
  autoResize = false,
  minRows = 3,
  maxRows = 10,
  containerClassName = '',
  className = '',
  value,
  onChange,
  onFocus,
  onBlur,
  disabled,
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  // Auto-resize functionality
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea || !autoResize) return;

    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    const minHeight = minRows * 20; // Approximate line height
    const maxHeight = maxRows * 20;
    
    textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [currentValue, autoResize]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    onChange?.(event);
    adjustHeight();
  };

  const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-4 py-3 text-base';
      default:
        return 'px-3 py-2 text-sm';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'filled':
        return 'bg-gray-800 border border-transparent hover:border-gray-600 focus:border-blue-500';
      case 'underlined':
        return 'bg-transparent border-0 border-b-2 border-gray-700 rounded-none hover:border-gray-600 focus:border-blue-500';
      case 'borderless':
        return 'bg-transparent border-0 hover:bg-gray-800/50 focus:bg-gray-800/50';
      default:
        return 'bg-gray-800 border border-gray-700 hover:border-gray-600 focus:border-blue-500';
    }
  };

  const getStateClasses = () => {
    switch (state) {
      case 'error':
        return { container: 'focus:border-red-500 border-red-500', text: 'text-red-400' };
      case 'success':
        return { container: 'focus:border-green-500 border-green-500', text: 'text-green-400' };
      case 'warning':
        return { container: 'focus:border-yellow-500 border-yellow-500', text: 'text-yellow-400' };
      default:
        return { container: '', text: 'text-gray-400' };
    }
  };

  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();
  const stateClasses = getStateClasses();

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      {/* Textarea */}
      <textarea
        ref={(node) => {
          textareaRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        value={currentValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        maxLength={maxLength}
        rows={autoResize ? undefined : minRows}
        className={`
          w-full rounded-lg transition-all duration-200 text-white placeholder-gray-400
          focus:outline-none resize-none
          ${sizeClasses}
          ${variantClasses}
          ${stateClasses.container}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      />

      {/* Helper Text / Error Message */}
      <AnimatePresence>
        {(helperText || errorMessage) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <p className={`text-xs ${errorMessage ? 'text-red-400' : stateClasses.text}`}>
                {errorMessage || helperText}
              </p>
              
              {/* Character Count */}
              {showCharCount && maxLength && (
                <p className="text-xs text-gray-500">
                  {currentValue?.toString().length || 0}/{maxLength}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Input;