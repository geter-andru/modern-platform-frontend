'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ICPQuickStartFormProps {
  className?: string;
  redirectOnSubmit?: boolean;
}

/**
 * Lightweight ICP Quick Start Form
 * Collects basic product info and either redirects to full ICP page or triggers generation
 */
export function ICPQuickStartForm({
  className = '',
  redirectOnSubmit = true
}: ICPQuickStartFormProps) {
  const router = useRouter();
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim() || !productDescription.trim()) {
      return;
    }

    if (redirectOnSubmit) {
      // Store in localStorage and redirect to full ICP page
      localStorage.setItem('icp_quickstart_product', productName);
      localStorage.setItem('icp_quickstart_description', productDescription);
      router.push('/icp/demo-v2');
    }
  };

  const isValid = productName.trim() && productDescription.trim();

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* Product Name */}
      <div>
        <label
          htmlFor="product-name"
          className="body-small text-text-muted mb-2 block"
        >
          What's your product/service name? <span className="text-red-400">*</span>
        </label>
        <input
          id="product-name"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="e.g., DevTool Pro"
          className="w-full px-4 py-3 rounded-lg border bg-surface-secondary text-text-primary placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          style={{
            background: 'var(--glass-bg, rgba(255, 255, 255, 0.03))',
            borderColor: 'var(--glass-border, rgba(255, 255, 255, 0.1))'
          }}
          required
        />
      </div>

      {/* Product Description */}
      <div>
        <label
          htmlFor="product-description"
          className="body-small text-text-muted mb-2 block"
        >
          What does it do? <span className="text-red-400">*</span>
        </label>
        <textarea
          id="product-description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          placeholder="e.g., AI-powered code review platform that catches 3x more bugs..."
          rows={3}
          className="w-full px-4 py-3 rounded-lg border bg-surface-secondary text-text-primary placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
          style={{
            background: 'var(--glass-bg, rgba(255, 255, 255, 0.03))',
            borderColor: 'var(--glass-border, rgba(255, 255, 255, 0.1))'
          }}
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isValid}
        className="btn btn-primary w-full flex items-center justify-center gap-2 btn-large"
        style={{
          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
          opacity: isValid ? 1 : 0.5,
          cursor: isValid ? 'pointer' : 'not-allowed'
        }}
      >
        <Sparkles className="w-5 h-5" />
        Generate My Free ICP
        <ArrowRight className="w-5 h-5" />
      </button>

      <p className="body-small text-text-muted text-center">
        No signup required • See results in 2 minutes
      </p>
    </form>
  );
}
