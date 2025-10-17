/**
 * Jest Setup Configuration
 * 
 * Global test setup for modern-platform testing framework.
 * Configures testing utilities, mocks, and global test environment.
 */

import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Next.js headers
jest.mock('next/headers', () => ({
  cookies() {
    return {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(() => []),
    };
  },
  headers() {
    return {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      has: jest.fn(),
      entries: jest.fn(),
      keys: jest.fn(),
      values: jest.fn(),
    };
  },
}));

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
process.env.NEXT_PUBLIC_STRIPE_TOKEN = 'rk_test_test-key';
process.env.NEXT_PUBLIC_GITHUB_TOKEN = 'github_pat_test-token';
process.env.NEXT_PUBLIC_AIRTABLE_API_KEY = 'pat_test-airtable-key';
process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID = 'app_test-base-id';
process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'GOCSPX-test-secret';
process.env.NEXT_PUBLIC_NETLIFY_API_KEY = 'nfp_test-netlify-key';
process.env.NEXT_PUBLIC_RENDER_SERVICE_ID = 'srv_test-render-id';
process.env.NEXT_PUBLIC_RENDER_URL = 'https://test.onrender.com';
process.env.RENDER_API_KEY = 'rnd_test-render-key';

// Mock Supabase client
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signIn: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => Promise.resolve({ data: null, error: null })),
      delete: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  })),
  createBrowserClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signIn: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => Promise.resolve({ data: null, error: null })),
      delete: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  })),
}));

// Mock external API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mock Web APIs for Node.js environment
global.Request = class Request {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || 'GET';
    this.headers = new Map(Object.entries(options.headers || {}));
    this.body = options.body;
  }
  
  async json() {
    return JSON.parse(this.body || '{}');
  }
  
  async text() {
    return this.body || '';
  }
};

global.Response = class Response {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.statusText = options.statusText || 'OK';
    this.headers = new Map(Object.entries(options.headers || {}));
  }
  
  async json() {
    return JSON.parse(this.body || '{}');
  }
  
  async text() {
    return this.body || '';
  }
  
  get ok() {
    return this.status >= 200 && this.status < 300;
  }
};

// Mock PointerEvent for testing
global.PointerEvent = class PointerEvent extends Event {
  constructor(type, options = {}) {
    super(type, options);
    this.pointerId = options.pointerId || 0;
    this.width = options.width || 1;
    this.height = options.height || 1;
    this.pressure = options.pressure || 0;
    this.tangentialPressure = options.tangentialPressure || 0;
    this.tiltX = options.tiltX || 0;
    this.tiltY = options.tiltY || 0;
    this.twist = options.twist || 0;
    this.pointerType = options.pointerType || 'mouse';
    this.isPrimary = options.isPrimary || false;
  }
};

// Mock NextRequest and NextResponse
jest.mock('next/server', () => ({
  NextRequest: class NextRequest {
    constructor(url, options = {}) {
      this._url = url;
      this.method = options.method || 'GET';
      this.headers = new Map(Object.entries(options.headers || {}));
      this.body = options.body;
    }
    
    get url() {
      return this._url;
    }
    
    async json() {
      return JSON.parse(this.body || '{}');
    }
    
    async text() {
      return this.body || '';
    }
  },
  
  NextResponse: {
    json: (data, options = {}) => ({
      body: JSON.stringify(data),
      status: options.status || 200,
      statusText: options.statusText || 'OK',
      headers: new Map(Object.entries(options.headers || {})),
      async json() {
        return data;
      },
      async text() {
        return JSON.stringify(data);
      },
      get ok() {
        return this.status >= 200 && this.status < 300;
      }
    }),
    
    error: (message, options = {}) => ({
      body: JSON.stringify({ error: message }),
      status: options.status || 500,
      statusText: options.statusText || 'Internal Server Error',
      headers: new Map(Object.entries(options.headers || {})),
      async json() {
        return { error: message };
      },
      async text() {
        return JSON.stringify({ error: message });
      },
      get ok() {
        return false;
      }
    })
  }
}));

// Mock console methods in tests
const originalConsole = { ...console };
beforeEach(() => {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
});

// Global test utilities
global.testUtils = {
  // Mock user data
  mockUser: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  },
  
  // Mock API response
  mockApiResponse: (data, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  }),
  
  // Mock error response
  mockErrorResponse: (message, status = 500) => ({
    ok: false,
    status,
    json: () => Promise.resolve({ error: message }),
  }),
  
  // Wait for async operations
  waitFor: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Mock localStorage
  mockLocalStorage: () => {
    const store = {};
    return {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => { store[key] = value; }),
      removeItem: jest.fn((key) => { delete store[key]; }),
      clear: jest.fn(() => { Object.keys(store).forEach(key => delete store[key]); }),
    };
  },
  
  // Mock sessionStorage
  mockSessionStorage: () => {
    const store = {};
    return {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => { store[key] = value; }),
      removeItem: jest.fn((key) => { delete store[key]; }),
      clear: jest.fn(() => { Object.keys(store).forEach(key => delete store[key]); }),
    };
  },
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  if (global.fetch) {
    global.fetch.mockClear();
  }
});

// Global test timeout
jest.setTimeout(10000);
