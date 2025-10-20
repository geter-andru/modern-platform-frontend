/**
 * Centralized API Configuration
 *
 * Single source of truth for all API base URLs.
 * Ensures consistent URL construction across the entire application.
 *
 * @module api-config
 */

/**
 * Normalize and validate a URL
 * Removes trailing slash and validates format
 */
function normalizeUrl(url: string, name: string): string {
  if (!url) {
    throw new Error(`Missing ${name} environment variable`);
  }

  // Remove trailing slash
  const normalized = url.replace(/\/$/, '');

  // Validate URL format
  try {
    new URL(normalized);
  } catch (error) {
    throw new Error(`Invalid URL format for ${name}: ${url}`);
  }

  return normalized;
}

/**
 * API Configuration object
 */
export const API_CONFIG = {
  /**
   * Backend Express API base URL
   * Points to the Express server running on Render
   */
  backend: normalizeUrl(
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
    'NEXT_PUBLIC_BACKEND_URL'
  ),

  /**
   * Supabase project URL
   */
  supabase: normalizeUrl(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    'NEXT_PUBLIC_SUPABASE_URL'
  ),
} as const;

// Configuration is validated during initialization
// No additional validation needed

/**
 * Construct a full backend API URL from a path
 *
 * @param path - API endpoint path (with or without leading slash)
 * @returns Full URL to backend endpoint
 *
 * @example
 * getBackendUrl('/api/customer/123')
 * // => 'https://backend.example.com/api/customer/123'
 *
 * getBackendUrl('api/customer/123')
 * // => 'https://backend.example.com/api/customer/123'
 */
export function getBackendUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_CONFIG.backend}${cleanPath}`;
}

/**
 * Construct a full Supabase URL from a path
 * Rarely needed since Supabase client handles this, but available for direct REST calls
 *
 * @param path - Supabase REST API path
 * @returns Full URL to Supabase endpoint
 */
export function getSupabaseUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_CONFIG.supabase}${cleanPath}`;
}

/**
 * Check if a URL is a backend API URL
 * Useful for conditional logic based on request destination
 *
 * @param url - URL to check
 * @returns True if URL points to backend API
 */
export function isBackendUrl(url: string): boolean {
  return url.startsWith(API_CONFIG.backend);
}

/**
 * Export configuration for read-only access
 */
export const getApiConfig = () => ({
  backend: API_CONFIG.backend,
  supabase: API_CONFIG.supabase,
});
