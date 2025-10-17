
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Security headers configuration
export const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://*.anthropic.com https://*.airtable.com https://*.render.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')
};

// CORS configuration
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? 'https://hs-andru-test.onrender.com' 
    : 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400'
};

// IP whitelist for admin operations
const adminIPs = [
  '127.0.0.1',
  '::1',
  // Add production admin IPs here
  ...(process.env.ADMIN_IPS ? process.env.ADMIN_IPS.split(',') : [])
];

// Suspicious patterns to block
const suspiciousPatterns = [
  /\.\./, // Directory traversal
  /<script/i, // XSS attempts
  /javascript:/i, // JavaScript protocol
  /on\w+\s*=/i, // Event handlers
  /union\s+select/i, // SQL injection
  /drop\s+table/i, // SQL injection
  /delete\s+from/i, // SQL injection
  /insert\s+into/i, // SQL injection
  /update\s+set/i, // SQL injection
];

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function withSecurityHeaders(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const response = await handler(req);
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  };
}

export function withCORS(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: corsHeaders
      });
    }
    
    const response = await handler(req);
    
    // Add CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  };
}

export function withIPWhitelist(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const clientIP = getClientIP(req);
    
    if (!adminIPs.includes(clientIP)) {
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    return handler(req);
  };
}

export function withInputSanitization(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const url = req.url;
    const userAgent = req.headers.get('user-agent') || '';
    
    // Check for suspicious patterns in URL
    if (suspiciousPatterns.some(pattern => pattern.test(url))) {
      console.warn(`Suspicious request blocked: ${url}`);
      return new NextResponse('Bad Request', { status: 400 });
    }
    
    // Check for suspicious user agents
    if (isSuspiciousUserAgent(userAgent)) {
      console.warn(`Suspicious user agent blocked: ${userAgent}`);
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    return handler(req);
  };
}

export function withRateLimit(
  windowMs: number = 60000,
  maxRequests: number = 100,
  keyGenerator?: (req: NextRequest) => string
) {
  return function(handler: (req: NextRequest) => Promise<NextResponse>) {
    return async (req: NextRequest): Promise<NextResponse> => {
      const key = keyGenerator ? keyGenerator(req) : getClientIP(req);
      const now = Date.now();
      
      const existing = rateLimitStore.get(key);
      
      if (existing) {
        if (now < existing.resetTime) {
          if (existing.count >= maxRequests) {
            return new NextResponse('Too Many Requests', { 
              status: 429,
              headers: {
                'Retry-After': Math.ceil((existing.resetTime - now) / 1000).toString()
              }
            });
          }
          existing.count++;
        } else {
          rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
        }
      } else {
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      }
      
      return handler(req);
    };
  };
}

export function withRequestLogging(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const clientIP = getClientIP(req);
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${clientIP} - UA: ${userAgent}`);
    
    const response = await handler(req);
    
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${response.status} - ${duration}ms`);
    
    return response;
  };
}

// Utility functions
function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return (req as any).ip || 'unknown';
}

function isSuspiciousUserAgent(userAgent: string): boolean {
  const suspiciousAgents = [
    'sqlmap',
    'nikto',
    'nmap',
    'masscan',
    'zap',
    'burp',
    'w3af',
    'acunetix',
    'nessus',
    'openvas'
  ];
  
  return suspiciousAgents.some(agent => 
    userAgent.toLowerCase().includes(agent.toLowerCase())
  );
}

// Input validation utilities
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Session security
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

export function hashToken(token: string): string {
  // In production, use a proper hashing library like bcrypt
  return Buffer.from(token).toString('base64');
}

// Cleanup expired rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now >= value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Cleanup every minute
