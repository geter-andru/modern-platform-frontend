'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase/client';
import { type Resource } from '@/app/lib/hooks/useResources';

interface ShareData {
  resource: Resource;
  shareToken: string;
  expiresAt: string;
  isValid: boolean;
}

export default function SharedResourcePage() {
  const params = useParams();
  const token = params.token as string;
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedResource = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get share record from database
        const { data: shareRecord, error: shareError } = await (supabase
          .from('resource_shares') as any)
          .select('*')
          .eq('share_token', token)
          .single();

        if (shareError || !shareRecord) {
          throw new Error('Share link not found or expired');
        }

        // Check if share has expired
        const now = new Date();
        const expiresAt = new Date(shareRecord.expires_at);
        if (now > expiresAt) {
          throw new Error('Share link has expired');
        }

        // Get the resource
        const { data: resource, error: resourceError } = await (supabase
          .from('resources') as any)
          .select('*')
          .eq('id', shareRecord.resource_id)
          .single();

        if (resourceError || !resource) {
          throw new Error('Resource not found');
        }

        setShareData({
          resource,
          shareToken: token,
          expiresAt: shareRecord.expires_at,
          isValid: true
        });

      } catch (err) {
        console.error('Error fetching shared resource:', err);
        setError(err instanceof Error ? err.message : 'Failed to load shared resource');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSharedResource();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-text-muted">Loading shared resource...</p>
        </div>
      </div>
    );
  }

  if (error || !shareData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-semibold text-red-800 mb-2">Share Link Issue</h1>
            <p className="text-red-600 mb-4">{error || 'This share link is not valid'}</p>
            <p className="text-sm text-text-muted">
              The link may have expired, been revoked, or the resource may no longer be available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { resource, expiresAt } = shareData;
  const expiresDate = new Date(expiresAt).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{resource.title}</h1>
              <p className="text-text-muted mt-1">Shared Resource</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Expires</div>
              <div className="text-sm font-medium text-text-primary">{expiresDate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Resource Info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Tier {resource.tier}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {resource.category.replace('_', ' ')}
              </span>
            </div>
            
            {resource.description && (
              <p className="text-gray-700 mb-4">{resource.description}</p>
            )}
          </div>

          {/* Resource Content */}
          <div className="prose max-w-none">
            {resource.content && (
              <div className="space-y-6">
                {resource.content.summary && (
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Summary</h3>
                    <p className="text-gray-700">{resource.content.summary}</p>
                  </div>
                )}

                {resource.content.sections && resource.content.sections.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Content Sections</h3>
                    <div className="space-y-4">
                      {resource.content.sections.map((section: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-text-primary mb-2">{section.title}</h4>
                          <p className="text-gray-700 mb-2">{section.content}</p>
                          {section.action && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <p className="text-sm text-blue-800">
                                <strong>Action:</strong> {section.action}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {resource.content.deliverables && resource.content.deliverables.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Deliverables</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {resource.content.deliverables.map((deliverable: string, index: number) => (
                        <li key={index}>{deliverable}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {resource.content.estimatedTime && (
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Estimated Time</h3>
                    <p className="text-gray-700">{resource.content.estimatedTime}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                Shared from <span className="font-medium text-gray-700">H&S Revenue Intelligence Platform</span>
              </div>
              <div>
                This link expires on {expiresDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







