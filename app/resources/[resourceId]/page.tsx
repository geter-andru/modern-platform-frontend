'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/app/lib/auth';
import { ModernSidebarLayout } from '../../../src/shared/components/layout/ModernSidebarLayout';
import { ResourceModal } from '../../../src/features/resources-library/widgets/ResourceModal';
import { ResourceExport } from '../../../src/features/resources-library/widgets/ResourceExport';

interface ResourcePageProps {
  params: Promise<{
    resourceId: string;
  }>;
}

export default function ResourcePage({ params }: ResourcePageProps) {
  const { user, loading: authLoading } = useRequireAuth(); // Auto-redirects if not authenticated
  const router = useRouter();
  const [resource, setResource] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resourceId, setResourceId] = useState<string>('');

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setResourceId(resolvedParams.resourceId);
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    if (resourceId) {
      // TODO: Fetch resource data from API
      // For now, use mock data
      setResource({
        id: resourceId,
        title: 'Sample Resource',
        content: 'This is sample resource content...',
        tier: 1,
        category: 'core'
      });
      setIsLoading(false);
    }
  }, [resourceId]);

  if (authLoading || isLoading) {
    return (
      <ModernSidebarLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-text-muted">Loading resource...</div>
        </div>
      </ModernSidebarLayout>
    );
  }

  if (!resource) {
    return null;
  }

  return (
    <ModernSidebarLayout>
      <div className="min-h-screen bg-gray-50">
        <ResourceModal
          resource={resource}
          isOpen={true}
          onClose={() => router.push('/resources')}
          onExport={(format) => {
            // TODO: Implement export functionality
            console.log('Exporting resource:', resource.id, 'format:', format);
          }}
          onShare={() => {
            // TODO: Implement share functionality
            console.log('Sharing resource:', resource.id);
          }}
        />
      </div>
    </ModernSidebarLayout>
  );
}
