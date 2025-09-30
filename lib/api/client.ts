import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const TOKEN_COOKIE_NAME = 'hs_access_token';
const REFRESH_TOKEN_COOKIE_NAME = 'hs_refresh_token';
const CUSTOMER_ID_COOKIE_NAME = 'hs_customer_id';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get(TOKEN_COOKIE_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE_NAME);
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          Cookies.set(TOKEN_COOKIE_NAME, accessToken, { expires: 1 }); // 1 day expiry
          
          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        Cookies.remove(TOKEN_COOKIE_NAME);
        Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
        Cookies.remove(CUSTOMER_ID_COOKIE_NAME);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 429) {
      toast.error('Rate limit exceeded. Please wait before trying again.');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.status === 403) {
      toast.error('Access denied. You do not have permission to perform this action.');
    }

    return Promise.reject(error);
  }
);

// Auth functions
export const auth = {
  async login(customerId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await apiClient.post('/api/auth/token', { customerId });
      const { accessToken, refreshToken, customer } = response.data.data;
      
      // Store tokens in cookies
      Cookies.set(TOKEN_COOKIE_NAME, accessToken, { expires: 1 });
      Cookies.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, { expires: 7 });
      Cookies.set(CUSTOMER_ID_COOKIE_NAME, customerId, { expires: 7 });
      
      return { success: true, data: customer };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  },

  logout() {
    Cookies.remove(TOKEN_COOKIE_NAME);
    Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
    Cookies.remove(CUSTOMER_ID_COOKIE_NAME);
    window.location.href = '/login';
  },

  getCustomerId(): string | undefined {
    return Cookies.get(CUSTOMER_ID_COOKIE_NAME);
  },

  isAuthenticated(): boolean {
    return !!Cookies.get(TOKEN_COOKIE_NAME);
  },
};

// Customer API functions
export const customerAPI = {
  async getCustomer(customerId: string) {
    const response = await apiClient.get(`/api/customer/${customerId}`);
    return response.data;
  },

  async getICP(customerId: string) {
    const response = await apiClient.get(`/api/customer/${customerId}/icp`);
    return response.data;
  },

  async generateAIICP(customerId: string, data: any) {
    const response = await apiClient.post(`/api/customer/${customerId}/generate-icp`, data);
    return response.data;
  },

  async updateCustomer(customerId: string, data: any) {
    const response = await apiClient.put(`/api/customer/${customerId}`, data);
    return response.data;
  },
};

// Cost Calculator API functions
export const costCalculatorAPI = {
  async calculate(data: any) {
    const response = await apiClient.post('/api/cost-calculator/calculate', data);
    return response.data;
  },

  async calculateWithAI(data: any) {
    const response = await apiClient.post('/api/cost-calculator/calculate-ai', data);
    return response.data;
  },

  async save(data: any) {
    const response = await apiClient.post('/api/cost-calculator/save', data);
    return response.data;
  },

  async getHistory(customerId: string) {
    const response = await apiClient.get(`/api/cost-calculator/history/${customerId}`);
    return response.data;
  },

  async compare(data: any) {
    const response = await apiClient.post('/api/cost-calculator/compare', data);
    return response.data;
  },
};

// Business Case API functions
export const businessCaseAPI = {
  async generate(data: any) {
    const response = await apiClient.post('/api/business-case/generate', data);
    return response.data;
  },

  async customize(data: any) {
    const response = await apiClient.post('/api/business-case/customize', data);
    return response.data;
  },

  async save(data: any) {
    const response = await apiClient.post('/api/business-case/save', data);
    return response.data;
  },

  async export(data: any) {
    const response = await apiClient.post('/api/business-case/export', data);
    return response.data;
  },

  async getTemplates() {
    const response = await apiClient.get('/api/business-case/templates');
    return response.data;
  },

  async getHistory(customerId: string) {
    const response = await apiClient.get(`/api/business-case/${customerId}/history`);
    return response.data;
  },
};

// Progress API functions
export const progressAPI = {
  async getProgress(customerId: string) {
    const response = await apiClient.get(`/api/progress/${customerId}`);
    return response.data;
  },

  async trackAction(customerId: string, action: string, metadata?: any) {
    const response = await apiClient.post(`/api/progress/${customerId}/track`, {
      action,
      metadata,
    });
    return response.data;
  },

  async getMilestones(customerId: string) {
    const response = await apiClient.get(`/api/progress/${customerId}/milestones`);
    return response.data;
  },

  async getInsights(customerId: string) {
    const response = await apiClient.get(`/api/progress/${customerId}/insights`);
    return response.data;
  },

  async completeMilestone(customerId: string, milestoneId: string, metadata?: any) {
    const response = await apiClient.post(
      `/api/progress/${customerId}/milestones/${milestoneId}/complete`,
      { metadata }
    );
    return response.data;
  },
};

// Export API functions
export const exportAPI = {
  async exportICP(data: any) {
    const response = await apiClient.post('/api/export/icp', data);
    return response.data;
  },

  async exportCostCalculator(data: any) {
    const response = await apiClient.post('/api/export/cost-calculator', data);
    return response.data;
  },

  async exportBusinessCase(data: any) {
    const response = await apiClient.post('/api/export/business-case', data);
    return response.data;
  },

  async exportComprehensive(data: any) {
    const response = await apiClient.post('/api/export/comprehensive', data);
    return response.data;
  },

  async getExportStatus(exportId: string) {
    const response = await apiClient.get(`/api/export/status/${exportId}`);
    return response.data;
  },

  async getExportHistory(customerId: string) {
    const response = await apiClient.get(`/api/export/history/${customerId}`);
    return response.data;
  },
};

// Webhook API functions
export const webhookAPI = {
  async triggerAutomation(customerId: string, automationType: string, data?: any) {
    const response = await apiClient.post('/api/webhooks/trigger', {
      customerId,
      automationType,
      data,
    });
    return response.data;
  },

  async getAutomationStatus() {
    const response = await apiClient.get('/api/webhooks/status');
    return response.data;
  },
};

export default apiClient;