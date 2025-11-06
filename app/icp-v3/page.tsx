'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRequireAuth } from '@/app/lib/auth';
import { useCustomer, useCustomerICP, useTrackAction } from '@/app/lib/hooks/useAPI';
import {
  Info,
  Lightbulb,
  Zap,
  Users
} from 'lucide-react';

// Import layout components
import { ModernSidebarLayout } from '../../src/shared/components/layout/ModernSidebarLayout';

// Import widget components
import ProductDetailsWidget from '@/src/features/icp-analysis/widgets/ProductDetailsWidget';
import ICPFrameworkConfiguration from '@/src/features/icp-analysis/widgets/ICPFrameworkConfiguration';
import BuyerPersonasWidget from '@/src/features/icp-analysis/widgets/BuyerPersonasWidget';
import RateCompanyWidget from '@/src/features/icp-analysis/widgets/RateCompanyWidget';
import TechnicalTranslationWidget from '@/src/features/icp-analysis/widgets/TechnicalTranslationWidget';

interface Section {
  id: string;
  label: string;
  description: string;
}

const SECTIONS: Section[] = [
  {
    id: 'framework',
    label: 'Scoring Framework',
    description: 'Define and manage ICP scoring criteria'
  },
  {
    id: 'personas',
    label: 'Buyer Personas',
    description: 'Understand target buyer profiles'
  },
  {
    id: 'rate',
    label: 'Rate Company',
    description: 'Evaluate company fit against ICP'
  },
  {
    id: 'generate',
    label: 'Generate Resources',
    description: 'Create ICP-based assets'
  }
];

export default function ICPv3Page() {
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useRequireAuth();
  const [activeSection, setActiveSection] = useState('framework');

  const trackAction = useTrackAction();

  // Track page view
  useEffect(() => {
    if (authLoading || !user) return;

    trackAction.mutate({
      customerId: user.id,
      action: 'page_view',
      metadata: { page: 'icp_v3' }
    });
  }, [user, authLoading]);

  // Handle URL parameters for section selection
  useEffect(() => {
    const section = searchParams.get('section');
    if (section && SECTIONS.some(s => s.id === section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Get customer and ICP data
  const { data: icpData, isLoading: isLoadingICP } = useCustomerICP(user?.id);
  const { data: customerData, isLoading: isLoadingCustomer } = useCustomer(user?.id);

  // Handle authentication loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a2332]">
        <div className="text-sm text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const trackSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);

    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('section', sectionId);
    window.history.pushState({}, '', url.toString());

    // Track section navigation
    trackAction.mutate({
      customerId: user.id,
      action: 'section_navigation',
      metadata: { section_id: sectionId }
    });
  };

  return (
    <ModernSidebarLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">ICP Analysis Tool</h1>
        <p className="text-gray-300">Systematic buyer understanding and targeting framework</p>
      </div>

      {/* Milestone Guidance Banner */}
      <div className="bg-[#1e3a5f] border border-blue-800/30 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Info className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Foundation Stage Guidance</h3>
            <p className="text-sm text-gray-300 mb-3">
              Establish systematic buyer understanding frameworks
            </p>
            <a
              href="#"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Start with clear buyer personas and pain point identification →
            </a>
          </div>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => trackSectionClick(section.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeSection === section.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Main Content - Section-based rendering */}
      <div className="space-y-6">
        {/* Framework Section */}
        {activeSection === 'framework' && (
          <div className="space-y-6">
            <ICPFrameworkConfiguration className="w-full" />
          </div>
        )}

        {/* Personas Section */}
        {activeSection === 'personas' && (
          <div className="space-y-6">
            <BuyerPersonasWidget className="w-full" />
          </div>
        )}

        {/* Rate Section */}
        {activeSection === 'rate' && (
          <div className="space-y-6">
            <RateCompanyWidget className="w-full" />
          </div>
        )}

        {/* Generate Section */}
        {activeSection === 'generate' && (
          <div className="space-y-6">
            <ProductDetailsWidget className="w-full" />
          </div>
        )}
      </div>

      {/* Intelligence Widgets Section - Always visible below main content */}
      <div className="mt-8 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Customer Intelligence Tools</h2>
            <p className="text-gray-400 text-sm">Transform insights into actionable strategies</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Stakeholder Arsenal Widget */}
          <div className="bg-[#1a2332] border border-blue-800/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Stakeholder Arsenal</h3>
                <p className="text-gray-400 text-sm">Role-specific preparation for customer calls</p>
              </div>
            </div>
            <TechnicalTranslationWidget />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {(isLoadingICP || isLoadingCustomer) && (
        <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-300">Loading data...</span>
          </div>
        </div>
      )}
    </ModernSidebarLayout>
  );
}
