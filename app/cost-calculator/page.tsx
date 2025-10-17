'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/app/lib/auth';
import { EnterpriseNavigationV2 } from '../../src/shared/components/layout/EnterpriseNavigationV2';
import { CostCalculatorForm } from '../../src/shared/components/cost-calculator/CostCalculatorForm';
import { CostResults } from '../../src/shared/components/cost-calculator/CostResults';
import { CostHistory } from '../../src/shared/components/cost-calculator/CostHistory';
import { useCostHistory, useTrackAction } from '@/app/lib/hooks/useAPI';
import { Skeleton, SkeletonCard } from '../../src/shared/components/ui/Skeleton';

export default function CostCalculatorPage() {
  const { user, loading } = useRequireAuth(); // Auto-redirects if not authenticated
  const [activeTab, setActiveTab] = useState<'calculator' | 'results' | 'history'>('calculator');
  const [currentResults, setCurrentResults] = useState<any>(null);

  const trackAction = useTrackAction();
  const { data: costHistory } = useCostHistory(user?.id);

  useEffect(() => {
    if (loading || !user) return;

    // Track page view
    trackAction.mutate({
      customerId: user.id,
      action: 'page_view',
      metadata: { page: 'cost_calculator' }
    });
  }, [user, loading]); // trackAction is stable, doesn't need to be in deps

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="space-y-3">
            <Skeleton variant="text" width="70%" height="h-8" animation="shimmer" />
            <Skeleton variant="text" width="50%" height="h-4" animation="shimmer" />
          </div>
          
          {/* Tabs skeleton */}
          <div className="flex space-x-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="text" width="120px" height="h-6" animation="shimmer" />
            ))}
          </div>
          
          {/* Form skeleton */}
          <SkeletonCard animation="shimmer" />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'calculator', name: 'Calculator', description: 'Calculate cost of inaction' },
    { id: 'results', name: 'Results', description: 'View calculation results' },
    { id: 'history', name: 'History', description: 'Previous calculations' },
  ];

  const handleCalculationComplete = (results: any) => {
    setCurrentResults(results);
    setActiveTab('results');
  };

  return (
    <EnterpriseNavigationV2>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Cost of Inaction Calculator
          </h1>
          <p className="text-gray-600 mt-2">
            Calculate the true financial impact of delayed decision-making and missed opportunities
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div>
                  <div>{tab.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{tab.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'calculator' && user?.id && (
            <CostCalculatorForm
              customerId={user.id}
              onCalculationComplete={handleCalculationComplete}
            />
          )}

          {activeTab === 'results' && user?.id && (
            <CostResults
              customerId={user.id}
              results={currentResults || costHistory?.data?.[0]}
            />
          )}

          {activeTab === 'history' && user?.id && (
            <CostHistory
              customerId={user.id}
              onViewResults={(results) => {
                setCurrentResults(results);
                setActiveTab('results');
              }}
            />
          )}
        </div>
      </div>
    </EnterpriseNavigationV2>
  );
}