'use client';

import React, { useState, useEffect } from 'react';
import { useDesignSystem } from './DesignSystemProvider';

export function DesignSystemTest() {
  const { tokens, theme, brand, setTheme, setBrand, getToken } = useDesignSystem();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the test component after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      background: 'var(--bg-surface, #1f2937)',
      color: 'var(--text-primary, #ffffff)',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid var(--border-primary, #374151)',
      boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))',
      fontFamily: 'var(--font-primary, system-ui)',
      fontSize: '14px',
      maxWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-primary, #3b82f6)' }}>
        🎨 Design System Test
      </h3>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Theme:</strong> {theme}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Brand:</strong> {brand}
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Primary Color:</strong> {getToken('colors.brand.primary')}
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{
            background: 'var(--color-primary, #3b82f6)',
            color: 'white',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Toggle Theme
        </button>
        
        <button
          onClick={() => setBrand(brand === 'hs' ? 'alternative' : 'hs')}
          style={{
            background: 'var(--color-secondary, #6b7280)',
            color: 'white',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Toggle Brand
        </button>
      </div>
      
      <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.7 }}>
        CSS Variables are working: {getToken('typography.fontFamily.primary') ? '✅' : '❌'}
      </div>
    </div>
  );
}
