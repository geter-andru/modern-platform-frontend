/**
 * Modern API Client
 * 
 * Uses Supabase authentication bridge to communicate with Express backend.
 * Replaces the legacy cookie-based authentication with Supabase JWT tokens.
 * 
 * FUNCTIONALITY STATUS: REAL
 * - Real Supabase authentication integration
 * - Real backend API communication
 * - Real error handling and user feedback
 * - Production-ready API client
 */

import { authBridge, BackendResponse } from '@/app/lib/services/auth-bridge';
import toast from 'react-hot-toast';
import { API_CONFIG } from '@/app/lib/config/api';

// Backend API configuration
const BACKEND_URL = API_CONFIG.backend;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

export interface CustomerData {
  customerId: string;
  customerName: string;
  company: string;
  email: string;
  contentStatus: string;
  paymentStatus: string;
}

export interface ICPData {
  companyProfile: any;
  idealCustomerProfile: any;
  buyerPersonas: any[];
  marketAnalysis: any;
  recommendations: any[];
}

export interface CostCalculationData {
  currentRevenue: number;
  potentialRevenue: number;
  costOfInaction: number;
  roi: number;
  insights: string[];
}

export interface BusinessCaseData {
  executiveSummary: string;
  problemStatement: string;
  solution: string;
  marketOpportunity: any;
  financialProjections: any;
  implementationPlan: any;
}

export interface ProgressData {
  overallProgress: number;
  milestones: any[];
  insights: any[];
  recommendations: any[];
}

/**
 * Modern API Client Class
 * Handles all backend API communication using Supabase authentication
 */
export class ModernApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BACKEND_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Handle API response and show user feedback
   * Note: showToast defaults to FALSE to prevent spam on read operations
   * Mutations should explicitly pass showToast: true OR handle their own toasts
   */
  private handleResponse<T>(response: BackendResponse<T>, showToast: boolean = false): ApiResponse<T> {
    if (response.success) {
      // Generic success toast removed - mutations handle their own specific messages
      // This prevents spam when dashboard loads and makes multiple API calls
      return {
        success: true,
        data: response.data
      };
    } else {
      const errorMessage = response.error || 'An error occurred';
      if (showToast) {
        toast.error(errorMessage);
      }
      return {
        success: false,
        error: errorMessage,
        details: response.details
      };
    }
  }

  /**
   * Health Check
   */
  async checkHealth(): Promise<ApiResponse> {
    try {
      const response = await authBridge.get('/health');
      return this.handleResponse(response, false);
    } catch (error) {
      return {
        success: false,
        error: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Customer Management APIs
   */
  async getCustomer(customerId: string): Promise<ApiResponse<CustomerData>> {
    try {
      const response = await authBridge.get<CustomerData>(`/api/customer/${customerId}`);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch customer data',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateCustomer(customerId: string, data: Partial<CustomerData>): Promise<ApiResponse<CustomerData>> {
    try {
      const response = await authBridge.put<CustomerData>(`/api/customer/${customerId}`, data);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update customer data',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getCustomerICP(customerId: string): Promise<ApiResponse<ICPData>> {
    try {
      const response = await authBridge.get<ICPData>(`/api/customer/${customerId}/icp`);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch ICP data',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async generateAIICP(customerId: string, productData: any): Promise<ApiResponse<ICPData>> {
    try {
      const response = await authBridge.post<ICPData>(`/api/customer/${customerId}/generate-icp`, productData);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate ICP analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Cost Calculator APIs
   */
  async calculateCost(data: any): Promise<ApiResponse<CostCalculationData>> {
    try {
      const response = await authBridge.post<CostCalculationData>('/api/cost-calculator/calculate', data);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to calculate cost',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async calculateCostWithAI(data: any): Promise<ApiResponse<CostCalculationData>> {
    try {
      const response = await authBridge.post<CostCalculationData>('/api/cost-calculator/calculate-ai', data);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to calculate cost with AI',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async saveCostCalculation(data: any): Promise<ApiResponse> {
    try {
      const response = await authBridge.post('/api/cost-calculator/save', data);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to save cost calculation',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getCostCalculationHistory(customerId: string): Promise<ApiResponse<CostCalculationData[]>> {
    try {
      const response = await authBridge.get<CostCalculationData[]>(`/api/cost-calculator/history/${customerId}`);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch cost calculation history',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Business Case APIs
   */
  async generateBusinessCase(data: any): Promise<ApiResponse<BusinessCaseData>> {
    try {
      const response = await authBridge.post<BusinessCaseData>('/api/business-case/generate', data);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate business case',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async customizeBusinessCase(businessCaseId: string, customizations: any): Promise<ApiResponse<BusinessCaseData>> {
    try {
      const response = await authBridge.post<BusinessCaseData>('/api/business-case/customize', {
        businessCaseId,
        customizations
      });
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to customize business case',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async saveBusinessCase(data: any): Promise<ApiResponse> {
    try {
      const response = await authBridge.post('/api/business-case/save', data);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to save business case',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getBusinessCaseTemplates(): Promise<ApiResponse<any[]>> {
    try {
      const response = await authBridge.get<any[]>('/api/business-case/templates');
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch business case templates',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getBusinessCaseHistory(customerId: string): Promise<ApiResponse<BusinessCaseData[]>> {
    try {
      const response = await authBridge.get<BusinessCaseData[]>(`/api/business-case/${customerId}/history`);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch business case history',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Progress Tracking APIs
   */
  async getCustomerProgress(customerId: string): Promise<ApiResponse<ProgressData>> {
    try {
      const response = await authBridge.get<ProgressData>(`/api/progress/${customerId}`);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch progress data',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async trackProgress(customerId: string, action: string, metadata?: any): Promise<ApiResponse> {
    try {
      const response = await authBridge.post(`/api/progress/${customerId}/track`, {
        action,
        metadata
      });
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to track progress',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getMilestones(customerId: string): Promise<ApiResponse<{ customerId: string; milestones: any[]; summary: any }>> {
    try {
      const response = await authBridge.get<{ customerId: string; milestones: any[]; summary: any }>(`/api/progress/${customerId}/milestones`);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch milestones',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getProgressInsights(customerId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await authBridge.get<any[]>(`/api/progress/${customerId}/insights`);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch progress insights',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Export APIs
   */
  async exportICP(data: any): Promise<ApiResponse> {
    try {
      const response = await authBridge.post('/api/export/icp', data);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to export ICP data',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async exportCostCalculator(data: any): Promise<ApiResponse> {
    try {
      const response = await authBridge.post('/api/export/cost-calculator', data);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to export cost calculator data',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async exportBusinessCase(data: any): Promise<ApiResponse> {
    try {
      const response = await authBridge.post('/api/export/business-case', data);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to export business case',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async exportComprehensive(data: any): Promise<ApiResponse> {
    try {
      const response = await authBridge.post('/api/export/comprehensive', data);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to export comprehensive report',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getExportStatus(exportId: string): Promise<ApiResponse> {
    try {
      const response = await authBridge.get(`/api/export/status/${exportId}`);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get export status',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getExportHistory(customerId: string): Promise<ApiResponse> {
    try {
      const response = await authBridge.get(`/api/export/history/${customerId}`);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get export history',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Prospect Discovery API
   * Discovers 5-7 real companies matching user's ICP using Claude AI + web search
   */
  async discoverProspects(data: {
    companyName: string;
    refinedProductDescription: string;
    coreCapability: string;
    industry?: string;
    targetMarket?: string;
  }): Promise<ApiResponse> {
    try {
      const response = await authBridge.post('/api/prospect-discovery/generate', data);
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to discover prospects',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const modernApiClient = new ModernApiClient();

// Export convenience functions for backward compatibility
export const api = {
  // Health
  checkHealth: () => modernApiClient.checkHealth(),
  
  // Customer
  getCustomer: (customerId: string) => modernApiClient.getCustomer(customerId),
  updateCustomer: (customerId: string, data: Partial<CustomerData>) => modernApiClient.updateCustomer(customerId, data),
  getCustomerICP: (customerId: string) => modernApiClient.getCustomerICP(customerId),
  generateAIICP: (customerId: string, productData: any) => modernApiClient.generateAIICP(customerId, productData),
  
  // Cost Calculator
  calculateCost: (data: any) => modernApiClient.calculateCost(data),
  calculateCostWithAI: (data: any) => modernApiClient.calculateCostWithAI(data),
  saveCostCalculation: (data: any) => modernApiClient.saveCostCalculation(data),
  getCostCalculationHistory: (customerId: string) => modernApiClient.getCostCalculationHistory(customerId),
  
  // Business Case
  generateBusinessCase: (data: any) => modernApiClient.generateBusinessCase(data),
  customizeBusinessCase: (businessCaseId: string, customizations: any) => modernApiClient.customizeBusinessCase(businessCaseId, customizations),
  saveBusinessCase: (data: any) => modernApiClient.saveBusinessCase(data),
  getBusinessCaseTemplates: () => modernApiClient.getBusinessCaseTemplates(),
  getBusinessCaseHistory: (customerId: string) => modernApiClient.getBusinessCaseHistory(customerId),
  
  // Progress
  getCustomerProgress: (customerId: string) => modernApiClient.getCustomerProgress(customerId),
  trackProgress: (customerId: string, action: string, metadata?: any) => modernApiClient.trackProgress(customerId, action, metadata),
  getMilestones: (customerId: string) => modernApiClient.getMilestones(customerId),
  getProgressInsights: (customerId: string) => modernApiClient.getProgressInsights(customerId),
  
  // Export
  exportICP: (data: any) => modernApiClient.exportICP(data),
  exportCostCalculator: (data: any) => modernApiClient.exportCostCalculator(data),
  exportBusinessCase: (data: any) => modernApiClient.exportBusinessCase(data),
  exportComprehensive: (data: any) => modernApiClient.exportComprehensive(data),
  getExportStatus: (exportId: string) => modernApiClient.getExportStatus(exportId),
  getExportHistory: (customerId: string) => modernApiClient.getExportHistory(customerId),

  // Prospect Discovery
  discoverProspects: (data: {
    companyName: string;
    refinedProductDescription: string;
    coreCapability: string;
    industry?: string;
    targetMarket?: string;
  }) => modernApiClient.discoverProspects(data)
};

export default modernApiClient;
