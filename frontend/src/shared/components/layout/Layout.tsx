'use client'

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Header from './Header';
import AdminModeIndicator from '../admin/AdminModeIndicator';

// TypeScript interfaces
interface LayoutProps {
  children: React.ReactNode;
}

interface CustomerData {
  customerId: string;
  customerName?: string;
  isAdmin?: boolean;
  paymentStatus?: string;
  accessToken?: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { authService } = await import('../../../lib/services/authService');
        const { airtableService } = await import('../../../lib/services/airtableService');

        // Check if already authenticated
        const existingSession = authService.getCurrentSession();
        console.log('Layout - Existing session check:', existingSession ? 'found' : 'not found');
        if (existingSession) {
          console.log('Layout - Using existing session:', existingSession.customerId);
          setCustomerData(existingSession);
          setLoading(false);
          return;
        }

        // Extract credentials from URL
        const credentials = authService.extractCredentials({ pathname, search: searchParams.toString() });
        console.log('Layout - Extracted credentials:', credentials);
        
        if (!credentials.customerId || !credentials.accessToken) {
          setError('Missing customer ID or access token in URL');
          setLoading(false);
          return;
        }

        // Validate credentials
        const validation = await authService.validateCredentials(credentials.customerId, credentials.accessToken);
        
        if (!validation.valid) {
          setError(validation.error);
          setLoading(false);
          return;
        }

        // Generate session and update last accessed
        console.log('Layout - Generating session with token:', credentials.accessToken);
        const session = authService.generateSession(validation.customerData, credentials.accessToken);
        console.log('Layout - Generated session:', session);
        await airtableService.updateLastAccessed(validation.customerData.id);
        
        setCustomerData(session);
        setLoading(false);

        // Redirect to first tool if on root dashboard
        if (pathname === '/dashboard' || pathname === '/dashboard/') {
          router.replace('/dashboard/icp');
        }

      } catch (err) {
        console.error('Authentication error:', err);
        setError('Failed to authenticate. Please check your credentials.');
        setLoading(false);
      }
    };

    initializeAuth();
  }, [pathname, searchParams, router]);

  // Refresh session periodically
  useEffect(() => {
    if (customerData) {
      const interval = setInterval(async () => {
        const { authService } = await import('../../../lib/services/authService');
        authService.refreshSession();
      }, 5 * 60 * 1000); // Every 5 minutes

      return () => clearInterval(interval);
    }
  }, [customerData]);

  // Dynamic loading of components
  const [LoadingSpinner, setLoadingSpinner] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    const loadLoadingSpinner = async () => {
      try {
        const module = await import('../common/LoadingSpinner');
        setLoadingSpinner(() => module.default);
      } catch (error) {
        console.error('Failed to load LoadingSpinner:', error);
      }
    };

    if (loading) {
      loadLoadingSpinner();
    }
  }, [loading]);

  if (loading) {
    return LoadingSpinner ? (
      <LoadingSpinner 
        fullScreen 
        message="Authenticating and loading your business assets..." 
        size="large"
      />
    ) : (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="max-w-md w-full card card-padding text-center animate-fade-in">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-danger/10 mb-6 shadow-elegant">
            <svg className="h-8 w-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-primary mb-3">
            Authentication Error
          </h3>
          <p className="text-base text-secondary mb-6 leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary hover-lift"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="max-w-md w-full card card-padding text-center animate-fade-in">
          <h3 className="text-2xl font-semibold text-primary mb-3">
            Access Required
          </h3>
          <p className="text-base text-secondary leading-relaxed">
            Please access this application through your personalized link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <Header />
      
      {/* Admin Mode Indicator */}
      {customerData?.isAdmin && (
        <AdminModeIndicator isVisible={true} position="top-right" />
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;