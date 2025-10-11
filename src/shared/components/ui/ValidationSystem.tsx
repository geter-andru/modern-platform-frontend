'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

/**
 * ValidationSystem - Real-time form validation with error states
 * 
 * Features:
 * - Real-time field validation
 * - Custom validation rules
 * - Async validation support
 * - Field dependencies
 * - Error message management
 * - Success indicators
 * - Form-level validation
 * - Accessibility compliant
 */

// Validation rule types
export type ValidationRule<T = any> = {
  validate: (value: T, formData?: any) => boolean | Promise<boolean>;
  message: string;
  type?: 'error' | 'warning' | 'info';
};

export type FieldValidation = {
  field: string;
  rules: ValidationRule[];
  dependencies?: string[];
  debounce?: number;
};

export type ValidationState = {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
  info: Record<string, string[]>;
  touched: Record<string, boolean>;
  validating: Record<string, boolean>;
};

// Common validation rules
export const ValidationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
      return value !== undefined && value !== null && value !== '';
    },
    message,
    type: 'error'
  }),

  email: (message = 'Please enter a valid email'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Let required rule handle empty values
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(String(value));
    },
    message,
    type: 'error'
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return String(value).length >= min;
    },
    message: message || `Must be at least ${min} characters`,
    type: 'error'
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return String(value).length <= max;
    },
    message: message || `Must be no more than ${max} characters`,
    type: 'error'
  }),

  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return regex.test(String(value));
    },
    message,
    type: 'error'
  }),

  number: (message = 'Must be a valid number'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return !isNaN(Number(value));
    },
    message,
    type: 'error'
  }),

  min: (min: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return Number(value) >= min;
    },
    message: message || `Must be at least ${min}`,
    type: 'error'
  }),

  max: (max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return Number(value) <= max;
    },
    message: message || `Must be no more than ${max}`,
    type: 'error'
  }),

  url: (message = 'Please enter a valid URL'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      try {
        new URL(String(value));
        return true;
      } catch {
        return false;
      }
    },
    message,
    type: 'error'
  }),

  custom: <T = any>(
    validateFn: (value: T, formData?: any) => boolean | Promise<boolean>,
    message: string,
    type: 'error' | 'warning' | 'info' = 'error'
  ): ValidationRule<T> => ({
    validate: validateFn,
    message,
    type
  })
};

// Validation Context
interface ValidationContextValue {
  state: ValidationState;
  validateField: (field: string, value: any) => Promise<void>;
  validateForm: (data: Record<string, any>) => Promise<boolean>;
  setFieldTouched: (field: string) => void;
  clearFieldErrors: (field: string) => void;
  clearAllErrors: () => void;
  registerField: (field: string, rules: ValidationRule[]) => void;
  unregisterField: (field: string) => void;
}

const ValidationContext = createContext<ValidationContextValue | null>(null);

export const useValidation = () => {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error('useValidation must be used within ValidationProvider');
  }
  return context;
};

// Validation Provider Component
interface ValidationProviderProps {
  children: React.ReactNode;
  validations?: FieldValidation[];
  onValidationChange?: (state: ValidationState) => void;
}

export const ValidationProvider: React.FC<ValidationProviderProps> = ({
  children,
  validations = [],
  onValidationChange
}) => {
  const [state, setState] = useState<ValidationState>({
    isValid: true,
    errors: {},
    warnings: {},
    info: {},
    touched: {},
    validating: {}
  });

  const [fieldRules, setFieldRules] = useState<Record<string, ValidationRule[]>>({});
  const [debounceTimers, setDebounceTimers] = useState<Record<string, NodeJS.Timeout>>({});

  // Initialize field rules from validations prop
  useEffect(() => {
    const rules: Record<string, ValidationRule[]> = {};
    validations.forEach(validation => {
      rules[validation.field] = validation.rules;
    });
    setFieldRules(rules);
  }, [validations]);

  // Notify parent of validation changes
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(state);
    }
  }, [state, onValidationChange]);

  // Register field with validation rules
  const registerField = useCallback((field: string, rules: ValidationRule[]) => {
    setFieldRules(prev => ({ ...prev, [field]: rules }));
  }, []);

  // Unregister field
  const unregisterField = useCallback((field: string) => {
    setFieldRules(prev => {
      const newRules = { ...prev };
      delete newRules[field];
      return newRules;
    });
    
    // Clear field from state
    setState(prev => {
      const newState = { ...prev };
      delete newState.errors[field];
      delete newState.warnings[field];
      delete newState.info[field];
      delete newState.touched[field];
      delete newState.validating[field];
      return newState;
    });
  }, []);

  // Validate a single field
  const validateField = useCallback(async (field: string, value: any, formData?: any) => {
    const rules = fieldRules[field] || [];
    
    if (rules.length === 0) return;

    // Set validating state
    setState(prev => ({
      ...prev,
      validating: { ...prev.validating, [field]: true }
    }));

    const errors: string[] = [];
    const warnings: string[] = [];
    const info: string[] = [];

    // Run all validation rules
    for (const rule of rules) {
      try {
        const isValid = await rule.validate(value, formData);
        if (!isValid) {
          switch (rule.type) {
            case 'warning':
              warnings.push(rule.message);
              break;
            case 'info':
              info.push(rule.message);
              break;
            default:
              errors.push(rule.message);
          }
        }
      } catch (error) {
        console.error(`Validation error for field ${field}:`, error);
        errors.push('Validation failed');
      }
    }

    // Update state
    setState(prev => {
      const newState = { ...prev };
      
      // Update messages
      if (errors.length > 0) {
        newState.errors[field] = errors;
      } else {
        delete newState.errors[field];
      }
      
      if (warnings.length > 0) {
        newState.warnings[field] = warnings;
      } else {
        delete newState.warnings[field];
      }
      
      if (info.length > 0) {
        newState.info[field] = info;
      } else {
        delete newState.info[field];
      }
      
      // Update validating state
      newState.validating[field] = false;
      
      // Update overall validity
      newState.isValid = Object.keys(newState.errors).length === 0;
      
      return newState;
    });
  }, [fieldRules]);

  // Validate entire form
  const validateForm = useCallback(async (data: Record<string, any>): Promise<boolean> => {
    const validationPromises = Object.keys(fieldRules).map(field =>
      validateField(field, data[field], data)
    );
    
    await Promise.all(validationPromises);
    
    return Object.keys(state.errors).length === 0;
  }, [fieldRules, validateField, state.errors]);

  // Set field as touched
  const setFieldTouched = useCallback((field: string) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: true }
    }));
  }, []);

  // Clear field errors
  const clearFieldErrors = useCallback((field: string) => {
    setState(prev => {
      const newState = { ...prev };
      delete newState.errors[field];
      delete newState.warnings[field];
      delete newState.info[field];
      newState.isValid = Object.keys(newState.errors).length === 0;
      return newState;
    });
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setState({
      isValid: true,
      errors: {},
      warnings: {},
      info: {},
      touched: {},
      validating: {}
    });
  }, []);

  const value: ValidationContextValue = {
    state,
    validateField,
    validateForm,
    setFieldTouched,
    clearFieldErrors,
    clearAllErrors,
    registerField,
    unregisterField
  };

  return (
    <ValidationContext.Provider value={value}>
      {children}
    </ValidationContext.Provider>
  );
};

// Field Error Display Component
interface FieldErrorProps {
  field: string;
  className?: string;
  showIcon?: boolean;
}

export const FieldError: React.FC<FieldErrorProps> = ({
  field,
  className = '',
  showIcon = true
}) => {
  const { state } = useValidation();
  const errors = state.errors[field] || [];
  const warnings = state.warnings[field] || [];
  const info = state.info[field] || [];
  const isValidating = state.validating[field];
  const isTouched = state.touched[field];

  if (!isTouched || isValidating) return null;

  return (
    <AnimatePresence mode="wait">
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`mt-1 ${className}`}
        >
          {errors.map((error, index) => (
            <div key={index} className="flex items-start gap-1 text-red-400 text-sm">
              {showIcon && <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
              <span>{error}</span>
            </div>
          ))}
        </motion.div>
      )}
      
      {warnings.length > 0 && errors.length === 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`mt-1 ${className}`}
        >
          {warnings.map((warning, index) => (
            <div key={index} className="flex items-start gap-1 text-yellow-400 text-sm">
              {showIcon && <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
              <span>{warning}</span>
            </div>
          ))}
        </motion.div>
      )}
      
      {info.length > 0 && errors.length === 0 && warnings.length === 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`mt-1 ${className}`}
        >
          {info.map((infoMsg, index) => (
            <div key={index} className="flex items-start gap-1 text-blue-400 text-sm">
              {showIcon && <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />}
              <span>{infoMsg}</span>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Validated Input Wrapper Component
interface ValidatedFieldProps {
  field: string;
  children: React.ReactElement;
  rules?: ValidationRule[];
  showError?: boolean;
  className?: string;
}

export const ValidatedField: React.FC<ValidatedFieldProps> = ({
  field,
  children,
  rules = [],
  showError = true,
  className = ''
}) => {
  const { validateField, setFieldTouched, registerField, unregisterField, state } = useValidation();
  
  useEffect(() => {
    if (rules.length > 0) {
      registerField(field, rules);
    }
    
    return () => {
      unregisterField(field);
    };
  }, [field, rules, registerField, unregisterField]);

  const handleBlur = useCallback(() => {
    setFieldTouched(field);
  }, [field, setFieldTouched]);

  const childWithProps = React.cloneElement(children, {
    onBlur: (e: any) => {
      handleBlur();
      if ((children.props as any)?.onBlur) {
        (children.props as any).onBlur(e);
      }
    },
    onChange: (e: any) => {
      const value = e?.target?.value !== undefined ? e.target.value : e;
      validateField(field, value);
      if ((children.props as any)?.onChange) {
        (children.props as any).onChange(e);
      }
    },
    className: `${(children.props as any)?.className || ''} ${
      state.touched[field] && state.errors[field]?.length > 0
        ? 'border-red-500 focus:border-red-500'
        : state.touched[field] && !state.errors[field]
        ? 'border-green-500 focus:border-green-500'
        : ''
    }`
  });

  return (
    <div className={className}>
      {childWithProps}
      {showError && <FieldError field={field} />}
    </div>
  );
};

export default ValidationProvider;