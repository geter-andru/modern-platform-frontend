import { createBrowserClient } from '@supabase/ssr';
import toast from 'react-hot-toast';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// Supabase client
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fetch wrapper with Supabase auth
async function apiRequest(url: string, options: RequestInit = {}): Promise<any> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
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
      // Try to refresh Supabase session
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        // Refresh failed, redirect to login
        await supabase.auth.signOut();
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }
      
      // Retry with new token
      const { data: { session: newSession } } = await supabase.auth.getSession();
      const newToken = newSession?.access_token;
      
      if (newToken) {
        const retryResponse = await fetch(fullUrl, {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
        
        if (retryResponse.ok) {
          return retryResponse.json();
        }
      }
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

// Auth functions using Supabase
export const auth = {
  async signOut() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  },

  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return !!session;
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