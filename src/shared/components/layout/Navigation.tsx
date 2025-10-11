'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams, useSearchParams, usePathname } from 'next/navigation';

// TypeScript interfaces
interface NavigationItem {
  id: string;
  name: string;
  path: string;
  step: number;
  description: string;
}

interface CustomerSession {
  customerId?: string;
  accessToken?: string;
}

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<CustomerSession | null>(null);
  
  // Get access token from session or URL
  const accessToken = session?.accessToken || searchParams?.get('token');
  const customerId = params?.customerId as string;

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { authService } = await import('../../../lib/services/authService');
        const currentSession = authService.getCurrentSession();
        setSession(currentSession);
      } catch (error) {
        console.error('Failed to load session:', error);
      }
    };

    loadSession();
  }, []);
  
  // Build query string to preserve access token
  const queryString = accessToken ? `?token=${accessToken}` : '';
  
  // If no customerId, don't render navigation
  if (!customerId) {
    console.error('Navigation - No customerId available');
    return null;
  }
  
  const navItems: NavigationItem[] = [
    {
      id: 'icp',
      name: 'ICP Analysis',
      path: `/customer/${customerId}/dashboard/icp${queryString}`,
      step: 1,
      description: 'Identify & rate ideal customers'
    },
    {
      id: 'cost-calculator',
      name: 'Cost Calculator',
      path: `/customer/${customerId}/dashboard/cost-calculator${queryString}`,
      step: 2,
      description: 'Calculate cost of inaction'
    },
    {
      id: 'business-case',
      name: 'Business Case',
      path: `/customer/${customerId}/dashboard/business-case${queryString}`,
      step: 3,
      description: 'Build pilot-to-contract cases'
    },
    {
      id: 'results',
      name: 'Results Dashboard',
      path: `/customer/${customerId}/dashboard/results${queryString}`,
      step: 4,
      description: 'Executive results & insights'
    }
  ];
  
  console.log('Navigation - Building paths with customerId:', customerId, 'accessToken:', accessToken ? 'found' : 'missing', 'queryString:', queryString);
  console.log('Navigation - Session data:', session ? 'exists' : 'missing');

  return (
    <nav className="bg-primary py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-8 lg:space-x-16">
          {navItems.map((item, index) => (
            <div key={item.id} className="flex items-center">
              <Link
                href={item.path}
                className="flex flex-col items-center group transition-all duration-300 opacity-60 hover:opacity-80 data-[active=true]:opacity-100"
                data-active={pathname?.includes(item.id) || false}
              >
                {/* Step Circle */}
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  pathname?.includes(item.id)
                    ? 'bg-brand border-brand shadow-lg shadow-brand/30' 
                    : 'bg-surface border-glass-border hover:border-brand/50'
                }`}>
                  <span className={`text-lg font-semibold ${
                    pathname?.includes(item.id) ? 'text-white' : 'text-secondary'
                  }`}>
                    {item.step}
                  </span>
                </div>
                
                {/* Step Label */}
                <div className="mt-3 text-center">
                  <div className={`text-sm font-medium ${
                    pathname?.includes(item.id) ? 'text-primary' : 'text-secondary'
                  }`}>
                    {item.name}
                  </div>
                  <div className="text-xs text-muted mt-1 max-w-24">
                    {item.description}
                  </div>
                </div>
              </Link>
              
              {/* Connection Line */}
              {index < navItems.length - 1 && (
                <div className="hidden lg:flex ml-8 xl:ml-16">
                  <div className="w-16 xl:w-24 h-0.5 bg-surface"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;