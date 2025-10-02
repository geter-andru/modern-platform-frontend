'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '../../src/shared/hooks/useSupabaseAuth';
import { EnterpriseNavigationV2 } from '../../src/shared/components/layout/EnterpriseNavigationV2';
import { ExportCenter } from '../../src/shared/components/export/ExportCenter';

export default function ExportsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useSupabaseAuth();
  const [exportStage, setExportStage] = useState(0); // Track export workflow stage

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleExport = (format: string, options: any) => {
    console.log('Exporting:', format, options);
    // Here you would implement the actual export logic
    // For now, we'll just log the action
    setExportStage(1);
    
    // Simulate export process
    setTimeout(() => {
      setExportStage(2);
      setTimeout(() => setExportStage(0), 3000);
    }, 2000);
  };

  return (
    <EnterpriseNavigationV2>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Export Center
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Export your data in various formats for analysis and sharing
          </p>
        </div>

        {/* Export Center */}
        <ExportCenter 
          customerId={user.id} 
          onExport={handleExport}
        />
      </div>
    </EnterpriseNavigationV2>
  );
}
