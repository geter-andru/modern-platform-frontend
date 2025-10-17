'use client';

import { useState } from 'react';
import { useRequireAuth } from '@/app/lib/auth';
import { EnterpriseNavigationV2 } from '../../src/shared/components/layout/EnterpriseNavigationV2';
import { ExportCenter } from '../../src/shared/components/export/ExportCenter';

export default function ExportsPage() {
  const { user, loading } = useRequireAuth(); // Auto-redirects if not authenticated
  const [exportStage, setExportStage] = useState(0); // Track export workflow stage

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
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
        {user?.id && (
          <ExportCenter
            customerId={user.id}
            onExport={handleExport}
          />
        )}
      </div>
    </EnterpriseNavigationV2>
  );
}
