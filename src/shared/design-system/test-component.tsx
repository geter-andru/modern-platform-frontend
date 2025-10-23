/**
 * H&S Revenue Intelligence Platform - Design System Test Component
 * Simple test component to verify design system functionality
 * 
 * SURGICAL IMPLEMENTATION:
 * - Test component only
 * - Can be removed after testing
 * - Zero impact on production
 * 
 * Last Updated: 2025-10-21
 */

'use client';

import React from 'react';
import { useDesignSystem, useTheme, useBrand } from './index';

/**
 * Test Component for Design System
 * This component can be used to test the design system functionality
 * Remove this file after testing is complete
 */
export const DesignSystemTest: React.FC = () => {
  const { tokens, getToken, updateTokens } = useDesignSystem();
  const { theme, setTheme } = useTheme();
  const { brand, setBrand } = useBrand();

  const handleColorChange = () => {
    updateTokens({
      colors: {
        ...tokens.colors,
        brand: {
          ...tokens.colors.brand,
          primary: '#ff0000', // Test red color
        }
      }
    });
  };

  const handleReset = () => {
    updateTokens({
      colors: {
        ...tokens.colors,
        brand: {
          ...tokens.colors.brand,
          primary: '#3b82f6', // Reset to original blue
        }
      }
    });
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: getToken('colors.background.surface'),
      color: getToken('colors.text.primary'),
      padding: getToken('spacing.4'),
      borderRadius: getToken('spacing.2'),
      boxShadow: getToken('shadows.lg'),
      border: `1px solid ${getToken('colors.border.standard')}`,
      zIndex: 9999,
      minWidth: '200px',
    }}>
      <h3 style={{ margin: 0, marginBottom: getToken('spacing.2') }}>
        Design System Test
      </h3>
      
      <div style={{ marginBottom: getToken('spacing.2') }}>
        <strong>Theme:</strong> {theme}
      </div>
      
      <div style={{ marginBottom: getToken('spacing.2') }}>
        <strong>Brand:</strong> {brand}
      </div>
      
      <div style={{ marginBottom: getToken('spacing.2') }}>
        <strong>Primary Color:</strong> {getToken('colors.brand.primary')}
      </div>
      
      <div style={{ display: 'flex', gap: getToken('spacing.2'), flexDirection: 'column' }}>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{
            background: getToken('colors.brand.primary'),
            color: getToken('colors.text.primary'),
            border: 'none',
            padding: `${getToken('spacing.2')} ${getToken('spacing.3')}`,
            borderRadius: getToken('spacing.1'),
            cursor: 'pointer',
          }}
        >
          Toggle Theme
        </button>
        
        <button
          onClick={handleColorChange}
          style={{
            background: getToken('colors.brand.secondary'),
            color: getToken('colors.text.primary'),
            border: 'none',
            padding: `${getToken('spacing.2')} ${getToken('spacing.3')}`,
            borderRadius: getToken('spacing.1'),
            cursor: 'pointer',
          }}
        >
          Change Color
        </button>
        
        <button
          onClick={handleReset}
          style={{
            background: getToken('colors.brand.accent'),
            color: getToken('colors.text.primary'),
            border: 'none',
            padding: `${getToken('spacing.2')} ${getToken('spacing.3')}`,
            borderRadius: getToken('spacing.1'),
            cursor: 'pointer',
          }}
        >
          Reset Color
        </button>
        
        <button
          onClick={() => setBrand('enterprise')}
          style={{
            background: getToken('colors.semantic.info'),
            color: getToken('colors.text.primary'),
            border: 'none',
            padding: `${getToken('spacing.2')} ${getToken('spacing.3')}`,
            borderRadius: getToken('spacing.1'),
            cursor: 'pointer',
          }}
        >
          Enterprise Brand
        </button>
      </div>
    </div>
  );
};
