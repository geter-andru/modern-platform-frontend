'use client';

import React, { useState } from 'react';
import { Button } from './Button';

/**
 * FormComponents - Professional form component library
 * 
 * Features:
 * - ProductInputForm for assessment data collection
 * - Reusable form field components
 * - Validation and error handling
 * - Design system integration
 * - TypeScript-first implementation
 */

// ============================================================================
// INTERFACES
// ============================================================================

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  'aria-label'?: string;
}

interface ProductInfo {
  productName: string;
  productDescription: string;
  keyFeatures: string;
  idealCustomerDescription: string;
  businessModel: string;
  customerCount: string;
  distinguishingFeature: string;
}

interface ProductInputFormProps {
  onSubmit: (productInfo: ProductInfo) => void;
  className?: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'select';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  className?: string;
}

// ============================================================================
// FORM FIELD COMPONENTS
// ============================================================================

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  options = [],
  rows = 3,
  className = ''
}) => {
  const baseInputClasses = `
    w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
    bg-surface text-text-primary placeholder-text-muted
    focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary
    disabled:bg-surface disabled:text-text-disabled disabled:border-surface
    ${error ? 'border-accent-danger' : 'border-surface'}
    ${className}
  `.trim();

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className={`${baseInputClasses} resize-vertical min-h-[100px]`}
          />
        );
      
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className={baseInputClasses}
          >
            <option value="">{placeholder || 'Select an option...'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-text-primary"
      >
        {label}
        {required && <span className="text-accent-danger ml-1">*</span>}
      </label>
      
      {renderInput()}
      
      {error && (
        <p className="text-sm text-accent-danger flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// INPUT COMPONENT
// ============================================================================

/**
 * Input - Professional input component
 */
const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  disabled = false,
  required = false,
  name,
  id,
  'aria-label': ariaLabel,
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      name={name}
      id={id}
      aria-label={ariaLabel}
      className={`
        w-full px-3 py-2 border border-gray-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
        disabled:bg-gray-100 disabled:cursor-not-allowed
        placeholder:text-gray-500
        ${className}
      `.trim()}
      {...props}
    />
  );
};

// ============================================================================
// PRODUCT INPUT FORM
// ============================================================================

const ProductInputForm: React.FC<ProductInputFormProps> = ({ 
  onSubmit, 
  className = '' 
}) => {
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    productName: '',
    productDescription: '',
    keyFeatures: '',
    idealCustomerDescription: '',
    businessModel: '',
    customerCount: '',
    distinguishingFeature: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!productInfo.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }
    
    if (!productInfo.businessModel.trim()) {
      newErrors.businessModel = 'Business model is required';
    }
    
    if (!productInfo.productDescription.trim()) {
      newErrors.productDescription = 'Product description is required';
    }
    
    if (!productInfo.idealCustomerDescription.trim()) {
      newErrors.idealCustomerDescription = 'Please describe your ideal customer';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(productInfo);
    }
  };
  
  const handleInputChange = (field: keyof ProductInfo, value: string) => {
    setProductInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const businessModelOptions = [
    { value: 'B2B Subscription', label: 'B2B (Subscription)' },
    { value: 'B2B One-time', label: 'B2B (One-time Purchase)' },
    { value: 'B2C Subscription', label: 'B2C (Subscription)' },
    { value: 'B2C One-time', label: 'B2C (One-time Purchase)' },
    { value: 'Marketplace', label: 'Marketplace' },
    { value: 'Freemium', label: 'Freemium' }
  ];

  return (
    <div className={`min-h-screen bg-background-primary py-8 px-4 ${className}`}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-background-elevated rounded-xl border border-surface p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Tell Us About Your Product
            </h1>
            <p className="text-lg text-text-secondary">
              We'll use this information to generate personalized insights and recommendations.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Product Name"
              name="productName"
              type="text"
              value={productInfo.productName}
              onChange={(value) => handleInputChange('productName', value)}
              error={errors.productName}
              placeholder="e.g., AI Sales Assistant, CRM Platform"
              required
            />
            
            <FormField
              label="Business Model"
              name="businessModel"
              type="select"
              value={productInfo.businessModel}
              onChange={(value) => handleInputChange('businessModel', value)}
              error={errors.businessModel}
              placeholder="Select business model..."
              options={businessModelOptions}
              required
            />
            
            <FormField
              label="Product Description"
              name="productDescription"
              type="textarea"
              value={productInfo.productDescription}
              onChange={(value) => handleInputChange('productDescription', value)}
              error={errors.productDescription}
              placeholder="Describe what your product does and the problem it solves..."
              rows={4}
              required
            />
            
            <FormField
              label="Key Features (Optional)"
              name="keyFeatures"
              type="textarea"
              value={productInfo.keyFeatures}
              onChange={(value) => handleInputChange('keyFeatures', value)}
              placeholder="List main features or capabilities..."
              rows={3}
            />
            
            <FormField
              label="Describe Your Ideal Customer or Target Buyer"
              name="idealCustomerDescription"
              type="textarea"
              value={productInfo.idealCustomerDescription}
              onChange={(value) => handleInputChange('idealCustomerDescription', value)}
              error={errors.idealCustomerDescription}
              placeholder="Who is your ideal customer? What are their characteristics, pain points, and goals? Be as specific as possible..."
              rows={4}
              required
            />
            
            <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-lg p-4">
              <p className="text-sm text-text-secondary flex items-start">
                <svg className="w-5 h-5 text-brand-primary mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>
                  <strong className="text-brand-primary">💡 Pro Tip:</strong> We'll compare your description with AI-generated insights to identify buyer understanding gaps and provide targeted recommendations.
                </span>
              </p>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              className="mt-8"
            >
              Next: Begin Assessment →
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// USER INFO FORM
// ============================================================================

interface UserInfo {
  name: string;
  email: string;
  company: string;
  role?: string;
}

interface UserInfoFormProps {
  onSubmit: (userInfo: UserInfo) => void;
  onSkip?: () => void;
  className?: string;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ 
  onSubmit, 
  onSkip,
  className = '' 
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    company: '',
    role: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!userInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!userInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!userInfo.company.trim()) {
      newErrors.company = 'Company is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(userInfo);
    }
  };
  
  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={`min-h-screen bg-background-primary py-8 px-4 ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="bg-background-elevated rounded-xl border border-surface p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Almost Done!
            </h1>
            <p className="text-text-secondary">
              Tell us a bit about yourself to personalize your results.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Full Name"
              name="name"
              type="text"
              value={userInfo.name}
              onChange={(value) => handleInputChange('name', value)}
              error={errors.name}
              placeholder="Your full name"
              required
            />
            
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={userInfo.email}
              onChange={(value) => handleInputChange('email', value)}
              error={errors.email}
              placeholder="your@email.com"
              required
            />
            
            <FormField
              label="Company"
              name="company"
              type="text"
              value={userInfo.company}
              onChange={(value) => handleInputChange('company', value)}
              error={errors.company}
              placeholder="Your company name"
              required
            />
            
            <FormField
              label="Role (Optional)"
              name="role"
              type="text"
              value={userInfo.role || ''}
              onChange={(value) => handleInputChange('role', value)}
              placeholder="e.g., CEO, Founder, Sales Director"
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
              >
                Get My Results
              </Button>
              
              {onSkip && (
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={onSkip}
                  className="flex-1"
                >
                  Skip for Now
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default ProductInputForm;
export { Input, ProductInputForm, UserInfoForm, FormField };
export type { ProductInfo, UserInfo, ProductInputFormProps, UserInfoFormProps, FormFieldProps, InputProps };
