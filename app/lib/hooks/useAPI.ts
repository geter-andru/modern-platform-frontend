import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  api as modernAPI,
} from '@/app/lib/api/modern-client';

// Customer hooks
export function useCustomer(customerId: string | undefined) {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => modernAPI.getCustomer(customerId!),
    enabled: !!customerId,
  });
}

export function useCustomerICP(customerId: string | undefined) {
  return useQuery({
    queryKey: ['customer-icp', customerId],
    queryFn: () => modernAPI.getCustomerICP(customerId!),
    enabled: !!customerId,
  });
}

export function useGenerateAIICP() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: any }) =>
      modernAPI.generateAIICP(customerId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer-icp', variables.customerId] });
      toast.success('ICP analysis generated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to generate ICP analysis');
    },
  });
}

// Cost Calculator hooks
export function useCostCalculation() {
  return useMutation({
    mutationFn: modernAPI.calculateCost,
    onSuccess: () => {
      toast.success('Cost calculation completed!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Cost calculation failed');
    },
  });
}

export function useAICostCalculation() {
  return useMutation({
    mutationFn: modernAPI.calculateCostWithAI,
    onSuccess: () => {
      toast.success('AI-enhanced cost calculation completed!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'AI cost calculation failed');
    },
  });
}

export function useCostHistory(customerId: string | undefined) {
  return useQuery({
    queryKey: ['cost-history', customerId],
    queryFn: () => modernAPI.getCostCalculationHistory(customerId!),
    enabled: !!customerId,
  });
}

// Business Case hooks
export function useBusinessCaseTemplates() {
  return useQuery({
    queryKey: ['business-case-templates'],
    queryFn: modernAPI.getBusinessCaseTemplates,
  });
}

export function useGenerateBusinessCase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: modernAPI.generateBusinessCase,
    onSuccess: (data, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ['business-case-history', variables.customerId] });
      toast.success('Business case generated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to generate business case');
    },
  });
}

export function useBusinessCaseHistory(customerId: string | undefined) {
  return useQuery({
    queryKey: ['business-case-history', customerId],
    queryFn: () => modernAPI.getBusinessCaseHistory(customerId!),
    enabled: !!customerId,
  });
}

// Progress hooks
export function useProgress(customerId: string | undefined) {
  return useQuery({
    queryKey: ['progress', customerId],
    queryFn: () => modernAPI.getCustomerProgress(customerId!),
    enabled: !!customerId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useMilestones(customerId: string | undefined) {
  return useQuery({
    queryKey: ['milestones', customerId],
    queryFn: () => modernAPI.getMilestones(customerId!),
    enabled: !!customerId,
  });
}

export function useProgressInsights(customerId: string | undefined) {
  return useQuery({
    queryKey: ['progress-insights', customerId],
    queryFn: () => modernAPI.getProgressInsights(customerId!),
    enabled: !!customerId,
  });
}

export function useTrackAction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ customerId, action, metadata }: { 
      customerId: string; 
      action: string; 
      metadata?: any;
    }) => modernAPI.trackProgress(customerId, action, metadata),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progress', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['milestones', variables.customerId] });
      
      if (data.data.milestonesTriggered?.length > 0) {
        toast.success(`Milestone achieved: ${data.data.milestonesTriggered[0].name}!`, {
          duration: 5000,
          icon: '🎉',
        });
      }
    },
  });
}

export function useCompleteMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerId, milestoneId, metadata }: {
      customerId: string;
      milestoneId: string;
      metadata?: any;
    }) => {
      // TODO: Implement completeMilestone in modern-client.ts
      throw new Error('Milestone completion not yet implemented');
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progress', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['milestones', variables.customerId] });
      toast.success('Milestone completed!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to complete milestone');
    },
  });
}

// Export hooks
export function useExportData() {
  return useMutation({
    mutationFn: ({ type, data }: { type: string; data: any }) => {
      switch (type) {
        case 'icp':
          return modernAPI.exportICP(data);
        case 'cost-calculator':
          return modernAPI.exportCostCalculator(data);
        case 'business-case':
          return modernAPI.exportBusinessCase(data);
        case 'comprehensive':
          return modernAPI.exportComprehensive(data);
        default:
          throw new Error('Invalid export type');
      }
    },
    onSuccess: (data) => {
      toast.success('Export initiated successfully!');
      // Optionally download the file
      if (data.data.downloadUrl) {
        window.open(data.data.downloadUrl, '_blank');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Export failed');
    },
  });
}

export function useExportHistory(customerId: string | undefined) {
  return useQuery({
    queryKey: ['export-history', customerId],
    queryFn: () => modernAPI.getExportHistory(customerId!),
    enabled: !!customerId,
  });
}

// Auth hooks removed - using Supabase authentication instead