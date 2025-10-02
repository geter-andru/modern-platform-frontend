import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  customerAPI,
  costCalculatorAPI,
  businessCaseAPI,
  progressAPI,
  exportAPI,
  auth,
} from '@/lib/api/client';

// Customer hooks
export function useCustomer(customerId: string | undefined) {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => customerAPI.getCustomer(customerId!),
    enabled: !!customerId,
  });
}

export function useCustomerICP(customerId: string | undefined) {
  return useQuery({
    queryKey: ['customer-icp', customerId],
    queryFn: () => customerAPI.getICP(customerId!),
    enabled: !!customerId,
  });
}

export function useGenerateAIICP() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: any }) =>
      customerAPI.generateAIICP(customerId, data),
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
    mutationFn: costCalculatorAPI.calculate,
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
    mutationFn: costCalculatorAPI.calculateWithAI,
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
    queryFn: () => costCalculatorAPI.getHistory(customerId!),
    enabled: !!customerId,
  });
}

// Business Case hooks
export function useBusinessCaseTemplates() {
  return useQuery({
    queryKey: ['business-case-templates'],
    queryFn: businessCaseAPI.getTemplates,
  });
}

export function useGenerateBusinessCase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: businessCaseAPI.generate,
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
    queryFn: () => businessCaseAPI.getHistory(customerId!),
    enabled: !!customerId,
  });
}

// Progress hooks
export function useProgress(customerId: string | undefined) {
  return useQuery({
    queryKey: ['progress', customerId],
    queryFn: () => progressAPI.getProgress(customerId!),
    enabled: !!customerId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useMilestones(customerId: string | undefined) {
  return useQuery({
    queryKey: ['milestones', customerId],
    queryFn: () => progressAPI.getMilestones(customerId!),
    enabled: !!customerId,
  });
}

export function useProgressInsights(customerId: string | undefined) {
  return useQuery({
    queryKey: ['progress-insights', customerId],
    queryFn: () => progressAPI.getInsights(customerId!),
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
    }) => progressAPI.trackAction(customerId, action, metadata),
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
    mutationFn: ({ customerId, milestoneId, metadata }: {
      customerId: string;
      milestoneId: string;
      metadata?: any;
    }) => progressAPI.completeMilestone(customerId, milestoneId, metadata),
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
          return exportAPI.exportICP(data);
        case 'cost-calculator':
          return exportAPI.exportCostCalculator(data);
        case 'business-case':
          return exportAPI.exportBusinessCase(data);
        case 'comprehensive':
          return exportAPI.exportComprehensive(data);
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
    queryFn: () => exportAPI.getExportHistory(customerId!),
    enabled: !!customerId,
  });
}

// Auth hooks
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (customerId: string) => auth.login(customerId),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.clear(); // Clear all cached data on login
        toast.success('Login successful!');
        window.location.href = '/dashboard';
      } else {
        toast.error(data.error || 'Login failed');
      }
    },
    onError: (error: any) => {
      toast.error('Login failed. Please try again.');
    },
  });
}

export function useLogout() {
  return () => {
    auth.logout();
    toast.success('Logged out successfully');
  };
}