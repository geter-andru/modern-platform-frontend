import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/app/lib/supabase/client-rewrite';

// Types matching the database schema
export interface Resource {
  id: string;
  customer_id: string;
  tier: 1 | 2 | 3;
  category: 'buyer_intelligence' | 'sales_frameworks' | 'strategic_tools' | 'implementation_guides' | 'competitive_intelligence' | 'behavioral_analysis';
  title: string;
  description: string | null;
  content: any; // JSONB
  metadata: any; // JSONB
  dependencies: string[];
  unlock_criteria: any; // JSONB
  export_formats: string[];
  generation_status: 'pending' | 'generating' | 'completed' | 'failed' | 'archived';
  ai_context: any; // JSONB
  generation_time_ms: number | null;
  access_count: number;
  last_accessed: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResourceFilters {
  category?: string;
  tier?: number;
  search?: string;
  status?: string;
}

export interface ResourceGenerationRequest {
  template_id: string;
  customer_id: string;
  context: any;
}

// Hook for fetching resources with filters
export function useResources(filters?: ResourceFilters) {
  return useQuery({
    queryKey: ['resources', filters],
    queryFn: async () => {
      let query = supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.tier) {
        query = query.eq('tier', filters.tier);
      }
      if (filters?.status) {
        query = query.eq('generation_status', filters.status);
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Resource[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Hook for fetching a single resource
export function useResource(resourceId: string) {
  return useQuery({
    queryKey: ['resource', resourceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', resourceId)
        .single();

      if (error) throw error;
      return data as Resource;
    },
    enabled: !!resourceId,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for generating a new resource
export function useGenerateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: ResourceGenerationRequest) => {
      // This would typically call a backend API endpoint
      // For now, we'll create a placeholder resource
      const { data, error } = await (supabase
        .from('resources') as any)
        .insert({
          customer_id: request.customer_id,
          tier: 1, // Default to tier 1
          category: 'buyer_intelligence', // Default category
          title: 'Generated Resource',
          description: 'AI-generated resource',
          content: { placeholder: true },
          metadata: {},
          dependencies: [],
          unlock_criteria: {},
          export_formats: ['pdf', 'docx', 'csv'],
          generation_status: 'generating',
          ai_context: request.context,
          access_count: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Resource;
    },
    onSuccess: () => {
      // Invalidate and refetch resources
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}

// Hook for tracking resource access
export function useTrackResourceAccess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resourceId: string) => {
      // Use backend API for tracking access
      const response = await fetch('/api/resources/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId,
          customerId: 'demo-user-1' // TODO: Get from auth context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to track resource access');
      }
    },
    onSuccess: (_, resourceId) => {
      // Update the specific resource in cache
      queryClient.setQueryData(['resource', resourceId], (old: Resource | undefined) => {
        if (!old) return old;
        return {
          ...old,
          access_count: old.access_count + 1,
          last_accessed: new Date().toISOString(),
        };
      });
      
      // Invalidate resources list to reflect changes
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}

// Hook for exporting resources
export function useExportResource() {
  return useMutation({
    mutationFn: async ({ resourceId, format, customerId }: { resourceId: string; format: string; customerId: string }) => {
      const response = await fetch('/api/resources/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId,
          format,
          customerId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to export resource');
      }

      return response.json();
    },
  });
}

// Hook for sharing resources
export function useShareResource() {
  return useMutation({
    mutationFn: async ({ resourceId, customerId, shareType = 'view' }: { resourceId: string; customerId: string; shareType?: string }) => {
      const response = await fetch('/api/resources/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId,
          customerId,
          shareType
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to share resource');
      }

      return response.json();
    },
  });
}

// Hook for getting resource templates
export function useResourceTemplates() {
  return useQuery({
    queryKey: ['resource-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resource_templates')
        .select('*')
        .eq('is_active', true)
        .order('tier', { ascending: true });

      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
