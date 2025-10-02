'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSupabaseAuth } from '../../../src/shared/hooks/useSupabaseAuth';
import { EnterpriseNavigationV2 } from '../../../src/shared/components/layout/EnterpriseNavigationV2';
import { ResourceModal } from '../../../src/features/resources-library/widgets/ResourceModal';
import { ResourceExport } from '../../../src/features/resources-library/widgets/ResourceExport';

interface ResourcePageProps {
  params: Promise<{
    resourceId: string;
  }>;
}

export default function ResourcePage({ params }: ResourcePageProps) {
  const { user, loading: authLoading } = useSupabaseAuth();
  const router = useRouter();
  const [resource, setResource] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resourceId, setResourceId] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

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
      <EnterpriseNavigationV2>
        <div className="flex items-center justify-center h-64">
          <div className="text-text-muted">Loading resource...</div>
        </div>
      </EnterpriseNavigationV2>
    );
  }

  if (!user || !resource) {
    return null;
  }

  return (
    <EnterpriseNavigationV2>
      <div className="min-h-screen bg-gray-50">
        <ResourceModal
          resource={resource}
          isOpen={true}
          onClose={() => router.push('/resources')}
          onExport={(format) => {
            // TODO: Implement export functionality
            console.log('Exporting resource:', resource.id, 'format:', format);
          }}
        />
      </div>
    </EnterpriseNavigationV2>
  );
}
