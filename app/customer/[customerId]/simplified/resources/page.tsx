import { Suspense } from 'react';
import ResourcesClient from './ResourcesClient';

export default async function ResourcesPage({
  params,
  searchParams,
}: {
  params: Promise<{ customerId: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense fallback={<div>Loading resources...</div>}>
      <ResourcesClient 
        customerId={resolvedParams.customerId} 
        token={resolvedSearchParams.token}
      />
    </Suspense>
  );
}