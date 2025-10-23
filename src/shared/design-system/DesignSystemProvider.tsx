'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DesignTokens, ThemeVariant, BrandVariant } from './types';
import { getDefaultTokens } from './default-tokens';
import { applyTokensToDOM, getNestedValue } from './utils';

// Design System Context
interface DesignSystemContextType {
  tokens: DesignTokens;
  theme: ThemeVariant;
  brand: BrandVariant;
  isInitialized: boolean;
  updateTokens: (newTokens: Partial<DesignTokens>) => void;
  setTheme: (theme: ThemeVariant) => void;
  setBrand: (brand: BrandVariant) => void;
  getToken: (path: string) => string;
  resetTokens: () => void;
  resetToDefaults: () => void;
  toggleTheme: () => void;
  updateBrand: (brand: BrandVariant) => void;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

// SSR-Safe DesignSystemProvider
export function DesignSystemProvider({ children }: { children: ReactNode }) {
  // State management
  const [tokens, setTokens] = useState<DesignTokens>(getDefaultTokens());
  const [theme, setTheme] = useState<ThemeVariant>('dark');
  const [brand, setBrand] = useState<BrandVariant>('hs');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // SSR Safety: Only run on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize design system only on client
  useEffect(() => {
    if (!isClient) return;

    const initializeDesignSystem = () => {
      try {
        console.log('Design System: Starting initialization...');
        console.log('Design System: Tokens object:', tokens);
        
        // Safety check: ensure tokens exist
        if (!tokens || !tokens.typography) {
          console.error('Design System: Invalid tokens object:', tokens);
          setIsInitialized(true);
          return;
        }
        
        console.log('Design System: Applying tokens to DOM...');
        // Apply initial tokens to DOM
        applyTokensToDOM(tokens);
        
        // Load saved preferences from localStorage (client-only)
        const savedTheme = localStorage.getItem('design-system-theme') as ThemeVariant;
        const savedBrand = localStorage.getItem('design-system-brand') as BrandVariant;
        
        if (savedTheme && savedTheme !== theme) {
          setTheme(savedTheme);
        }
        
        if (savedBrand && savedBrand !== brand) {
          setBrand(savedBrand);
        }
        
        setIsInitialized(true);
        console.log('Design System: Successfully initialized!');
      } catch (error) {
        console.error('Design System: Failed to initialize', error);
        setIsInitialized(true); // Continue with fallback
      }
    };

    // Add a small delay to ensure the component is mounted
    const timer = setTimeout(initializeDesignSystem, 100);
    return () => clearTimeout(timer);
  }, [isClient, tokens, theme, brand]);

  // Update theme in localStorage when it changes (client-only)
  useEffect(() => {
    if (isClient && isInitialized) {
      localStorage.setItem('design-system-theme', theme);
    }
  }, [theme, isInitialized, isClient]);

  // Update brand in localStorage when it changes (client-only)
  useEffect(() => {
    if (isClient && isInitialized) {
      localStorage.setItem('design-system-brand', brand);
    }
  }, [brand, isInitialized, isClient]);

  // Update tokens and apply to DOM
  const updateTokens = (newTokens: Partial<DesignTokens>) => {
    setTokens(prevTokens => {
      const updatedTokens = { ...prevTokens, ...newTokens };
      
      // Apply to DOM only on client
      if (isClient) {
        applyTokensToDOM(updatedTokens);
      }
      
      return updatedTokens;
    });
  };

  // Reset tokens to default
  const resetTokens = () => {
    const defaultTokens = getDefaultTokens();
    setTokens(defaultTokens);
    if (isClient) {
      applyTokensToDOM(defaultTokens);
    }
  };

  // Get token value by path
  const getToken = (path: string): string => {
    return getNestedValue(tokens, path) || '';
  };

  // Reset to defaults
  const resetToDefaults = () => {
    const defaultTokens = getDefaultTokens();
    setTokens(defaultTokens);
    setTheme('dark');
    setBrand('hs');
    if (isClient) {
      applyTokensToDOM(defaultTokens);
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Update brand
  const updateBrand = (newBrand: BrandVariant) => {
    setBrand(newBrand);
  };

  // Context value
  const contextValue: DesignSystemContextType = {
    tokens,
    theme,
    brand,
    isInitialized: isClient ? isInitialized : true, // Always show as initialized on server
    updateTokens,
    setTheme,
    setBrand,
    getToken,
    resetTokens,
    resetToDefaults,
    toggleTheme,
    updateBrand,
  };

  return (
    <DesignSystemContext.Provider value={contextValue}>
      {children}
    </DesignSystemContext.Provider>
  );
}

// Hook to use design system
export function useDesignSystem() {
  const context = useContext(DesignSystemContext);
  if (context === undefined) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
}

// Additional hooks for convenience
export function useDesignTokens() {
  const { tokens } = useDesignSystem();
  return tokens;
}

export function useTheme() {
  const { theme, setTheme } = useDesignSystem();
  return { theme, setTheme };
}

export function useBrand() {
  const { brand, setBrand } = useDesignSystem();
  return { brand, setBrand };
}