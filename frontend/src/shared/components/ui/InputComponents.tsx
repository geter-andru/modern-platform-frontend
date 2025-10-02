'use client';

import React, { ReactNode, InputHTMLAttributes, forwardRef } from 'react';

// Search Input
interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  showClearButton?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({
  onClear,
  showClearButton = true,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        ref={ref}
        type="text"
        className={`
          w-full pl-10 pr-10 py-3 rounded-lg border border-slate-600
          bg-slate-700 text-white placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
          transition-all duration-200
          ${className}
        `}
        {...props}
      />
      {showClearButton && props.value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

// Number Input with increment/decrement
interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onIncrement?: () => void;
  onDecrement?: () => void;
  showControls?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(({
  onIncrement,
  onDecrement,
  showControls = true,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="relative">
      <input
        ref={ref}
        type="number"
        className={`
          w-full px-4 py-3 rounded-lg border border-slate-600
          bg-slate-700 text-white placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
          transition-all duration-200
          ${showControls ? 'pr-12' : ''}
          ${className}
        `}
        {...props}
      />
      {showControls && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
          <button
            type="button"
            onClick={onIncrement}
            className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-600 rounded transition-all duration-200"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDecrement}
            className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-600 rounded transition-all duration-200"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
});

NumberInput.displayName = 'NumberInput';

// Password Input with visibility toggle
interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showToggle?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({
  showToggle = true,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        className={`
          w-full px-4 py-3 rounded-lg border border-slate-600
          bg-slate-700 text-white placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
          transition-all duration-200
          ${showToggle ? 'pr-12' : ''}
          ${className}
        `}
        {...props}
      />
      {showToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

// Email Input with validation
interface EmailInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showValidation?: boolean;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(({
  showValidation = true,
  className = '',
  onChange,
  ...props
}, ref) => {
  const [isValid, setIsValid] = React.useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (showValidation && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid(emailRegex.test(value));
    } else {
      setIsValid(null);
    }
    onChange?.(e);
  };

  return (
    <div className="relative">
      <input
        ref={ref}
        type="email"
        className={`
          w-full px-4 py-3 rounded-lg border transition-all duration-200
          bg-slate-700 text-white placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
          ${showValidation && isValid === false 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
            : showValidation && isValid === true
            ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/50'
            : 'border-slate-600 focus:border-blue-500 focus:ring-blue-500/50'
          }
          ${showValidation ? 'pr-12' : ''}
          ${className}
        `}
        onChange={handleChange}
        {...props}
      />
      {showValidation && isValid !== null && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isValid ? (
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
});

EmailInput.displayName = 'EmailInput';

// Phone Input
interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  format?: 'us' | 'international';
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({
  format = 'us',
  className = '',
  onChange,
  ...props
}, ref) => {
  const formatPhone = (value: string) => {
    if (format === 'us') {
      // Remove all non-digit characters
      const digits = value.replace(/\D/g, '');
      // Format as (XXX) XXX-XXXX
      if (digits.length >= 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      } else if (digits.length >= 6) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else if (digits.length >= 3) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else {
        return digits;
      }
    }
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    e.target.value = formatted;
    onChange?.(e);
  };

  return (
    <input
      ref={ref}
      type="tel"
      className={`
        w-full px-4 py-3 rounded-lg border border-slate-600
        bg-slate-700 text-white placeholder-slate-400
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
        transition-all duration-200
        ${className}
      `}
      onChange={handleChange}
      placeholder={format === 'us' ? '(555) 123-4567' : '+1 555 123 4567'}
      {...props}
    />
  );
});

PhoneInput.displayName = 'PhoneInput';

// URL Input
interface URLInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showValidation?: boolean;
}

export const URLInput = forwardRef<HTMLInputElement, URLInputProps>(({
  showValidation = true,
  className = '',
  onChange,
  ...props
}, ref) => {
  const [isValid, setIsValid] = React.useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (showValidation && value) {
      try {
        new URL(value);
        setIsValid(true);
      } catch {
        setIsValid(false);
      }
    } else {
      setIsValid(null);
    }
    onChange?.(e);
  };

  return (
    <div className="relative">
      <input
        ref={ref}
        type="url"
        className={`
          w-full px-4 py-3 rounded-lg border transition-all duration-200
          bg-slate-700 text-white placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
          ${showValidation && isValid === false 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
            : showValidation && isValid === true
            ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/50'
            : 'border-slate-600 focus:border-blue-500 focus:ring-blue-500/50'
          }
          ${showValidation ? 'pr-12' : ''}
          ${className}
        `}
        onChange={handleChange}
        placeholder="https://example.com"
        {...props}
      />
      {showValidation && isValid !== null && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isValid ? (
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
});

URLInput.displayName = 'URLInput';

// Currency Input
interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  currency?: string;
  locale?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(({
  currency = 'USD',
  locale = 'en-US',
  className = '',
  onChange,
  ...props
}, ref) => {
  const formatCurrency = (value: string) => {
    // Remove all non-digit and non-decimal characters
    const numericValue = value.replace(/[^\d.]/g, '');
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return numericValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    e.target.value = formatted;
    onChange?.(e);
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">
        {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency}
      </div>
      <input
        ref={ref}
        type="text"
        className={`
          w-full pl-10 pr-4 py-3 rounded-lg border border-slate-600
          bg-slate-700 text-white placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
          transition-all duration-200
          ${className}
        `}
        onChange={handleChange}
        placeholder="0.00"
        {...props}
      />
    </div>
  );
});

CurrencyInput.displayName = 'CurrencyInput';

// Export all components as default
export default {
  SearchInput,
  NumberInput,
  PasswordInput,
  EmailInput,
  PhoneInput,
  URLInput,
  CurrencyInput
};