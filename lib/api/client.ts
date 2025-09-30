import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
const TOKEN_COOKIE_NAME = 'hs_access_token';
const REFRESH_TOKEN_COOKIE_NAME = 'hs_refresh_token';
const CUSTOMER_ID_COOKIE_NAME = 'hs_customer_id';

// Fetch wrapper with auth and error handling
async function apiRequest(url: string, options: RequestInit = {}): Promise<any> {
  const token = Cookies.get(TOKEN_COOKIE_NAME);
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const fullUrl = url.startsWith('/') ? `${API_BASE_URL}${url}` : url;

  try {
    const response = await fetch(fullUrl, config);
    
    // Handle 401 errors (token expired)
    if (response.status === 401) {
      try {
        const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE_NAME);
        if (refreshToken) {
          const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const { accessToken } = refreshData.data;
            Cookies.set(TOKEN_COOKIE_NAME, accessToken, { expires: 1 });
            
            // Retry original request with new token
            const retryResponse = await fetch(fullUrl, {
              ...config,
              headers: {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`,
              },
            });
            
            if (retryResponse.ok) {
              return retryResponse.json();
            }
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
      
      // Refresh failed, redirect to login
      Cookies.remove(TOKEN_COOKIE_NAME);
      Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
      Cookies.remove(CUSTOMER_ID_COOKIE_NAME);
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }

    // Handle other HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429) {
        toast.error('Rate limit exceeded. Please wait before trying again.');
      } else if (response.status === 500) {
        toast.error('Server error. Please try again later.');
      } else if (response.status === 403) {
        toast.error('Access denied. You do not have permission to perform this action.');
      }
      
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network request failed');
  }
}

// Auth functions
export const auth = {
  async login(customerId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await apiRequest('/api/auth/token', {
        method: 'POST',
        body: JSON.stringify({ customerId }),
      });
      
      const { accessToken, refreshToken, customer } = response.data;
      
      // Store tokens in cookies
      Cookies.set(TOKEN_COOKIE_NAME, accessToken, { expires: 1 });
      Cookies.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, { expires: 7 });
      Cookies.set(CUSTOMER_ID_COOKIE_NAME, customerId, { expires: 7 });
      
      return { success: true, data: customer };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
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
    return apiRequest(`/api/customer/${customerId}`);
  },

  async getICP(customerId: string) {
    return apiRequest(`/api/customer/${customerId}/icp`);
  },

  async generateAIICP(customerId: string, data: any) {
    return apiRequest(`/api/customer/${customerId}/generate-icp`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCustomer(customerId: string, data: any) {
    return apiRequest(`/api/customer/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Cost Calculator API functions
export const costCalculatorAPI = {
  async calculate(data: any) {
    return apiRequest('/api/cost-calculator/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async calculateWithAI(data: any) {
    return apiRequest('/api/cost-calculator/calculate-ai', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async save(data: any) {
    return apiRequest('/api/cost-calculator/save', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getHistory(customerId: string) {
    return apiRequest(`/api/cost-calculator/history/${customerId}`);
  },

  async compare(data: any) {
    return apiRequest('/api/cost-calculator/compare', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Business Case API functions
export const businessCaseAPI = {
  async generate(data: any) {
    return apiRequest('/api/business-case/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async customize(data: any) {
    return apiRequest('/api/business-case/customize', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async save(data: any) {
    return apiRequest('/api/business-case/save', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async export(data: any) {
    return apiRequest('/api/business-case/export', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getTemplates() {
    return apiRequest('/api/business-case/templates');
  },

  async getHistory(customerId: string) {
    return apiRequest(`/api/business-case/${customerId}/history`);
  },
};

// Progress API functions
export const progressAPI = {
  async getProgress(customerId: string) {
    return apiRequest(`/api/progress/${customerId}`);
  },

  async trackAction(customerId: string, action: string, metadata?: any) {
    return apiRequest(`/api/progress/${customerId}/track`, {
      method: 'POST',
      body: JSON.stringify({ action, metadata }),
    });
  },

  async getMilestones(customerId: string) {
    return apiRequest(`/api/progress/${customerId}/milestones`);
  },

  async getInsights(customerId: string) {
    return apiRequest(`/api/progress/${customerId}/insights`);
  },

  async completeMilestone(customerId: string, milestoneId: string, metadata?: any) {
    return apiRequest(
      `/api/progress/${customerId}/milestones/${milestoneId}/complete`,
      {
        method: 'POST',
        body: JSON.stringify({ metadata }),
      }
    );
  },
};

// Export API functions
export const exportAPI = {
  async exportICP(data: any) {
    return apiRequest('/api/export/icp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async exportCostCalculator(data: any) {
    return apiRequest('/api/export/cost-calculator', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async exportBusinessCase(data: any) {
    return apiRequest('/api/export/business-case', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async exportComprehensive(data: any) {
    return apiRequest('/api/export/comprehensive', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getExportStatus(exportId: string) {
    return apiRequest(`/api/export/status/${exportId}`);
  },

  async getExportHistory(customerId: string) {
    return apiRequest(`/api/export/history/${customerId}`);
  },
};

// Webhook API functions
export const webhookAPI = {
  async triggerAutomation(customerId: string, automationType: string, data?: any) {
    return apiRequest('/api/webhooks/trigger', {
      method: 'POST',
      body: JSON.stringify({ customerId, automationType, data }),
    });
  },

  async getAutomationStatus() {
    return apiRequest('/api/webhooks/status');
  },
};

export default { auth, customerAPI, costCalculatorAPI, businessCaseAPI, progressAPI, exportAPI, webhookAPI };