'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Check,
  Loader2,
  Mail,
  User,
  Building2,
  Briefcase,
  FileText,
  Link2,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { ModernSidebarLayout } from '../../src/shared/components/layout/ModernSidebarLayout';
import toast, { Toaster } from 'react-hot-toast';
import '../../src/shared/styles/component-patterns.css';

interface FormData {
  fullName: string;
  email: string;
  company: string;
  jobTitle: string;
  productDescription: string;
  referralSource: string;
  linkedinProfile: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  company?: string;
  jobTitle?: string;
  productDescription?: string;
  referralSource?: string;
  linkedinProfile?: string;
}

export default function FoundingMembersPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    company: '',
    jobTitle: '',
    productDescription: '',
    referralSource: '',
    linkedinProfile: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [spotsRemaining, setSpotsRemaining] = useState<number>(100);
  const [formStarted, setFormStarted] = useState(false);

  // Fetch spots remaining on mount
  useEffect(() => {
    fetchSpotsRemaining();
  }, []);

  const fetchSpotsRemaining = async () => {
    try {
      const response = await fetch('/api/beta-signup/spots-remaining');
      if (response.ok) {
        const data = await response.json();
        setSpotsRemaining(data.spotsRemaining);
      }
    } catch (error) {
      console.error('Failed to fetch spots remaining:', error);
    }
  };

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (value.length < 2) return 'Please enter your full name';
        if (value.length > 100) return 'Name is too long (max 100 characters)';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        break;
      case 'company':
        if (value.length < 2) return 'Please enter your company name';
        if (value.length > 100) return 'Company name is too long (max 100 characters)';
        break;
      case 'jobTitle':
        if (value.length < 2) return 'Please enter your job title';
        if (value.length > 100) return 'Job title is too long (max 100 characters)';
        break;
      case 'productDescription':
        if (value.length < 20) return 'Please provide at least 20 characters describing your product';
        if (value.length > 500) return 'Product description is too long (max 500 characters)';
        break;
      case 'referralSource':
        if (!value) return 'Please select how you heard about us';
        break;
      case 'linkedinProfile':
        if (value && !/^https?:\/\/.+/.test(value)) return 'Please enter a valid LinkedIn URL';
        break;
    }
    return undefined;
  };

  const handleInputChange = (name: keyof FormData, value: string) => {
    if (!formStarted) {
      setFormStarted(true);
      // Track analytics event
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('Beta Signup - Form Started');
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
      if (key !== 'linkedinProfile') { // Optional field
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      } else if (formData[key]) {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Track analytics event
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('Beta Signup - Form Submitted', {
          referralSource: formData.referralSource
        });
      }

      const response = await fetch('/api/beta-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Application submitted successfully!');
        setSubmitted(true);
        setSpotsRemaining(data.spotsRemaining);

        // Track success event
        if (typeof window !== 'undefined' && (window as any).analytics) {
          (window as any).analytics.track('Beta Signup - Success');
        }
      } else {
        if (data.field) {
          setErrors({ [data.field]: data.error });
        }
        toast.error(data.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSpotsRemainingBadge = () => {
    if (spotsRemaining > 50) {
      return (
        <span className="badge badge-success body-small px-4 py-2">
          {spotsRemaining} of 100 Spots Remaining
        </span>
      );
    } else if (spotsRemaining > 20) {
      return (
        <span className="badge badge-warning body-small px-4 py-2">
          {spotsRemaining} of 100 Spots Remaining
        </span>
      );
    } else if (spotsRemaining > 0) {
      return (
        <span className="badge badge-error body-small px-4 py-2">
          Only {spotsRemaining} of 100 Spots Remaining!
        </span>
      );
    } else {
      return (
        <span className="badge badge-secondary body-small px-4 py-2">
          Waitlist Full
        </span>
      );
    }
  };

  const characterCount = formData.productDescription.length;
  const characterCountColor = characterCount < 20 ? 'text-error' : characterCount > 500 ? 'text-error' : 'text-text-muted';

  if (submitted) {
    return (
      <ModernSidebarLayout>
        <Toaster position="top-right" />
        <div className="min-h-screen py-20" style={{ background: 'var(--bg-primary)' }}>
          <div className="container max-w-2xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 rounded-2xl border text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                borderColor: 'var(--glass-border)'
              }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
                <Check className="w-10 h-10 text-success" />
              </div>

              <h1 className="heading-1 mb-4">You're on the list!</h1>
              <p className="body-large text-text-muted mb-8">
                We'll review your application and send you an email within 48 hours.
                Check your inbox for a confirmation email.
              </p>

              <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-success body-small" style={{ fontWeight: 700 }}>1</span>
                  </div>
                  <p className="body text-text-primary">Check your email for confirmation</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-success body-small" style={{ fontWeight: 700 }}>2</span>
                  </div>
                  <p className="body text-text-primary">Join our Slack channel (link sent via email)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-success body-small" style={{ fontWeight: 700 }}>3</span>
                  </div>
                  <p className="body text-text-primary">Beta access begins December 1, 2025</p>
                </div>
              </div>

              <Link
                href="/icp/demo"
                className="btn btn-primary btn-large inline-flex items-center gap-2"
              >
                Explore Demo While You Wait
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </ModernSidebarLayout>
    );
  }

  return (
    <ModernSidebarLayout>
      <Toaster position="top-right" />
      <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="body-small text-blue-400" style={{ fontWeight: 500 }}>
                🚀 FREE BETA LAUNCHING DECEMBER 1, 2025
              </span>
            </div>

            <h1 className="heading-1 mb-4">
              Apply to Join 100 Founding Members
            </h1>
            <p className="body-large text-text-muted max-w-2xl mx-auto mb-6">
              Help us build the best ICP tool for technical founders—and lock in 50% lifetime discount
            </p>

            {getSpotsRemainingBadge()}
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div
              className="p-8 rounded-2xl border"
              style={{
                background: 'var(--glass-bg)',
                borderColor: 'var(--glass-border)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <h2 className="heading-3 mb-6 text-center">What You Get as a Founding Member</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Full access to ICP tool during beta (Dec 2025 - Feb 2025)',
                  'All export formats (PDF, Markdown, CSV)',
                  'Direct Slack channel with founders',
                  'Weekly feedback sessions',
                  'Lock in $149/month lifetime pricing (vs $297 for new users)',
                  'No credit card required'
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="body-small text-text-primary">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                className="p-8 rounded-2xl border"
                style={{
                  background: 'var(--glass-bg)',
                  borderColor: 'var(--glass-border)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                {/* 2-column layout on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Full Name */}
                  <div>
                    <label className="block body-small font-medium text-text-primary mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Sarah Chen"
                        className={`w-full pl-11 pr-4 py-3 rounded-lg bg-surface-secondary border ${
                          errors.fullName ? 'border-error' : 'border-border-primary'
                        } text-text-primary focus:outline-none focus:border-accent-primary transition-colors`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-error body-small mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block body-small font-medium text-text-primary mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="sarah@yourcompany.com"
                        className={`w-full pl-11 pr-4 py-3 rounded-lg bg-surface-secondary border ${
                          errors.email ? 'border-error' : 'border-border-primary'
                        } text-text-primary focus:outline-none focus:border-accent-primary transition-colors`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-error body-small mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block body-small font-medium text-text-primary mb-2">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Acme Inc."
                        className={`w-full pl-11 pr-4 py-3 rounded-lg bg-surface-secondary border ${
                          errors.company ? 'border-error' : 'border-border-primary'
                        } text-text-primary focus:outline-none focus:border-accent-primary transition-colors`}
                      />
                    </div>
                    {errors.company && (
                      <p className="text-error body-small mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.company}
                      </p>
                    )}
                  </div>

                  {/* Job Title */}
                  <div>
                    <label className="block body-small font-medium text-text-primary mb-2">
                      Job Title *
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        placeholder="Head of Product"
                        className={`w-full pl-11 pr-4 py-3 rounded-lg bg-surface-secondary border ${
                          errors.jobTitle ? 'border-error' : 'border-border-primary'
                        } text-text-primary focus:outline-none focus:border-accent-primary transition-colors`}
                      />
                    </div>
                    {errors.jobTitle && (
                      <p className="text-error body-small mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.jobTitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Product Description (full width) */}
                <div className="mb-6">
                  <label className="block body-small font-medium text-text-primary mb-2">
                    Product Description *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                    <textarea
                      value={formData.productDescription}
                      onChange={(e) => handleInputChange('productDescription', e.target.value)}
                      placeholder="Tell us about your B2B SaaS product. What problem does it solve?"
                      rows={4}
                      className={`w-full pl-11 pr-4 py-3 rounded-lg bg-surface-secondary border ${
                        errors.productDescription ? 'border-error' : 'border-border-primary'
                      } text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none`}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    {errors.productDescription ? (
                      <p className="text-error text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.productDescription}
                      </p>
                    ) : (
                      <span></span>
                    )}
                    <span className={`body-small ${characterCountColor}`}>
                      {characterCount}/500
                    </span>
                  </div>
                </div>

                {/* Referral Source */}
                <div className="mb-6">
                  <label className="block body-small font-medium text-text-primary mb-2">
                    How did you hear about us? *
                  </label>
                  <select
                    value={formData.referralSource}
                    onChange={(e) => handleInputChange('referralSource', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg bg-surface-secondary border ${
                      errors.referralSource ? 'border-error' : 'border-border-primary'
                    } text-text-primary focus:outline-none focus:border-accent-primary transition-colors`}
                  >
                    <option value="">Select one...</option>
                    <option value="Twitter">Twitter</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="ProductHunt">ProductHunt</option>
                    <option value="Referral from a friend">Referral from a friend</option>
                    <option value="Google search">Google search</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.referralSource && (
                    <p className="text-error body-small mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.referralSource}
                    </p>
                  )}
                </div>

                {/* LinkedIn Profile (optional) */}
                <div>
                  <label className="block body-small font-medium text-text-primary mb-2">
                    LinkedIn Profile <span className="text-text-muted">(optional)</span>
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="url"
                      value={formData.linkedinProfile}
                      onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className={`w-full pl-11 pr-4 py-3 rounded-lg bg-surface-secondary border ${
                        errors.linkedinProfile ? 'border-error' : 'border-border-primary'
                      } text-text-primary focus:outline-none focus:border-accent-primary transition-colors`}
                    />
                  </div>
                  {errors.linkedinProfile && (
                    <p className="text-error body-small mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.linkedinProfile}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting || spotsRemaining === 0}
                    className="btn btn-primary btn-large w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Apply for Founding Member Access
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </ModernSidebarLayout>
  );
}
